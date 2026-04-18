/**
 * Storage Clearing Service
 *
 * Provides comprehensive storage clearing functionality for multi-app environments.
 * Handles both smart clearing (app-data only) and nuclear clearing (all data).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { logger } from '../utils/logger';

export interface StorageClearingResult {
  success: boolean;
  totalKeys: number;
  removedKeys: string[];
  preservedKeys?: string[];
  error?: string;
}

export interface StorageClearingOptions {
  showAnalysis?: boolean;
  preserveSystemKeys?: boolean;
  onProgress?: (progress: { current: number; total: number; key: string }) => void;
}

export class StorageClearingService {

  /**
   * App-related key patterns for smart clearing. These are intentionally
   * generic so the service works for any app ID passed to `setCurrentApp()`
   * rather than a hardcoded allow-list.
   */
  private static readonly APP_PATTERNS = [
    // App-specific initialization keys — any `app_first_launch_completed_<AppId>`
    /^app_first_launch_completed_[A-Za-z0-9_-]+$/,
    // App-prefixed keys produced by StorageService.getAppKey(): `<AppId>_<rest>`
    /^[A-Z_][A-Za-z0-9_-]*_/,
    // Global app settings
    /^app_(theme|color_scheme|rtl_direction|language|user_token|user_data|onboarding_completed)$/,
    // Firebase / Auth related keys
    /^firebase_/,
    /^auth_/,
    // User preferences and cache
    /^user_/,
    /^cache_/,
  ];

  /**
   * System/Framework keys that should be preserved during smart clearing
   */
  private static readonly SYSTEM_PATTERNS = [
    /^(Expo|RCT|@|DeviceInfo|__react_native_user_defaults)/,
    /^react-native/,
    /^metro/,
    /^flipper/,
    /^debugger/,
    // Expo specific keys
    /^ExponentConstants/,
    /^ExpoSecureStore/,
    /^ExpoFont/,
  ];

  /**
   * Analyze storage keys to categorize them
   */
  static async analyzeStorage(): Promise<{
    totalKeys: number;
    appRelatedKeys: string[];
    systemKeys: string[];
    otherKeys: string[];
  }> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();

      const appRelatedKeys = allKeys.filter(key =>
        this.APP_PATTERNS.some(pattern => pattern.test(key))
      );

      const systemKeys = allKeys.filter(key =>
        this.SYSTEM_PATTERNS.some(pattern => pattern.test(key))
      );

      const otherKeys = allKeys.filter(key =>
        !appRelatedKeys.includes(key) && !systemKeys.includes(key)
      );

      return {
        totalKeys: allKeys.length,
        appRelatedKeys,
        systemKeys,
        otherKeys
      };

    } catch (error) {
      logger.error('Failed to analyze storage', error, {
        component: 'StorageClearingService',
        function: 'analyzeStorage'
      });
      throw new Error('Storage analysis failed');
    }
  }

  /**
   * Smart clear - removes only app-related keys, preserves system keys
   */
  static async smartClear(options: StorageClearingOptions = {}): Promise<StorageClearingResult> {
    try {
      const analysis = await this.analyzeStorage();

      if (options.showAnalysis) {
        logger.info('Smart Clear Analysis', {
          component: 'StorageClearingService',
          function: 'smartClear',
          analysis
        });
      }

      if (analysis.appRelatedKeys.length === 0) {
        return {
          success: true,
          totalKeys: analysis.totalKeys,
          removedKeys: [],
          preservedKeys: [...analysis.systemKeys, ...analysis.otherKeys],
        };
      }

      // Remove app-related keys with progress tracking
      if (options.onProgress) {
        for (let i = 0; i < analysis.appRelatedKeys.length; i++) {
          const key = analysis.appRelatedKeys[i];
          await AsyncStorage.removeItem(key);
          options.onProgress({
            current: i + 1,
            total: analysis.appRelatedKeys.length,
            key
          });
        }
      } else {
        await AsyncStorage.multiRemove(analysis.appRelatedKeys);
      }

      logger.info('Smart clear completed successfully', {
        component: 'StorageClearingService',
        function: 'smartClear',
        removedCount: analysis.appRelatedKeys.length,
        preservedCount: analysis.systemKeys.length + analysis.otherKeys.length
      });

      return {
        success: true,
        totalKeys: analysis.totalKeys,
        removedKeys: analysis.appRelatedKeys,
        preservedKeys: [...analysis.systemKeys, ...analysis.otherKeys],
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Smart clear failed', error, {
        component: 'StorageClearingService',
        function: 'smartClear'
      });

      return {
        success: false,
        totalKeys: 0,
        removedKeys: [],
        error: errorMessage,
      };
    }
  }

  /**
   * Nuclear clear - removes ALL storage data
   */
  static async nuclearClear(options: StorageClearingOptions = {}): Promise<StorageClearingResult> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();

      if (options.showAnalysis) {
        logger.info('Nuclear Clear Analysis', {
          component: 'StorageClearingService',
          function: 'nuclearClear',
          totalKeys: allKeys.length,
          keys: allKeys
        });
      }

      // Clear all storage
      await AsyncStorage.clear();

      logger.info('Nuclear clear completed successfully', {
        component: 'StorageClearingService',
        function: 'nuclearClear',
        removedCount: allKeys.length
      });

      return {
        success: true,
        totalKeys: allKeys.length,
        removedKeys: allKeys,
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Nuclear clear failed', error, {
        component: 'StorageClearingService',
        function: 'nuclearClear'
      });

      return {
        success: false,
        totalKeys: 0,
        removedKeys: [],
        error: errorMessage,
      };
    }
  }

  /**
   * Show interactive clearing dialog with options
   */
  static showClearingDialog(options: {
    onComplete?: (result: StorageClearingResult, method: 'smart' | 'nuclear') => void;
    onCancel?: () => void;
  } = {}): void {
    Alert.alert(
      'Clear All App Data & Cache',
      'Choose your clearing method. This will affect all apps in this multi-app project.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: options.onCancel
        },
        {
          text: 'Smart Clear (Recommended)',
          onPress: async () => {
            try {
              const result = await this.smartClear({ showAnalysis: true });

              if (result.success) {
                Alert.alert(
                  'Smart Clear Complete',
                  `Successfully cleared ${result.removedKeys.length} app-related storage keys.\n\nPreserved ${result.preservedKeys?.length || 0} system keys.\n\nAll apps will now behave as fresh installations. Restart the app for full effect.`,
                  [{ text: 'OK' }]
                );
              } else {
                Alert.alert(
                  'Smart Clear Failed',
                  result.error || 'Unknown error occurred during smart clear.',
                  [{ text: 'OK' }]
                );
              }

              options.onComplete?.(result, 'smart');
            } catch (error) {
              logger.error('Smart clear dialog error', error);
              Alert.alert('Error', 'Failed to clear app data. Please try again.');
            }
          }
        },
        {
          text: 'Nuclear Clear (All Data)',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await this.nuclearClear({ showAnalysis: true });

              if (result.success) {
                Alert.alert(
                  'Nuclear Clear Complete',
                  `Successfully cleared ALL ${result.totalKeys} storage keys.\n\nComplete fresh state - all system and app data removed. Restart required.`,
                  [{ text: 'OK' }]
                );
              } else {
                Alert.alert(
                  'Nuclear Clear Failed',
                  result.error || 'Unknown error occurred during nuclear clear.',
                  [{ text: 'OK' }]
                );
              }

              options.onComplete?.(result, 'nuclear');
            } catch (error) {
              logger.error('Nuclear clear dialog error', error);
              Alert.alert('Error', 'Failed to clear all storage. Please try again.');
            }
          }
        }
      ]
    );
  }

  /**
   * Get storage statistics without clearing anything
   */
  static async getStorageStats(): Promise<{
    totalKeys: number;
    appKeys: number;
    systemKeys: number;
    otherKeys: number;
    estimatedSize?: string;
  }> {
    try {
      const analysis = await this.analyzeStorage();

      return {
        totalKeys: analysis.totalKeys,
        appKeys: analysis.appRelatedKeys.length,
        systemKeys: analysis.systemKeys.length,
        otherKeys: analysis.otherKeys.length,
      };
    } catch (error) {
      logger.error('Failed to get storage stats', error);
      return {
        totalKeys: 0,
        appKeys: 0,
        systemKeys: 0,
        otherKeys: 0,
      };
    }
  }

  /**
   * Quick method for testing - clears app data and shows result in console
   */
  static async quickTestClear(): Promise<void> {
    console.log('🧹 Starting quick test clear...');

    const beforeStats = await this.getStorageStats();
    console.log('📊 Before:', beforeStats);

    const result = await this.smartClear({ showAnalysis: true });

    const afterStats = await this.getStorageStats();
    console.log('📊 After:', afterStats);
    console.log('✅ Result:', result);
  }
}

// Export convenience functions
export const { smartClear, nuclearClear, showClearingDialog, getStorageStats, quickTestClear } = StorageClearingService;