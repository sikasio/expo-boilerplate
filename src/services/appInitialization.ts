/**
 * App Initialization Service
 * Ensures proper default settings are applied for new installations
 */

import { StorageService } from './storage';
import { STORAGE_KEYS } from '../constants';
import { getCurrentAppDefaults } from '../config/appDefaults';
import { getCurrentApp } from '../utils/getCurrentApp';
import { logger } from '../utils/logger';

const FIRST_LAUNCH_KEY = 'app_first_launch_completed';

export class AppInitializationService {
  /**
   * Initialize app with default settings on first launch
   */
  static async initializeAppDefaults(): Promise<void> {
    try {
      const currentApp = getCurrentApp();
      const initKey = `${FIRST_LAUNCH_KEY}_${currentApp}`;
      
      // Skip if already initialized
      const isInitialized = await StorageService.getItem(initKey);
      if (isInitialized === 'true') return;

      // Get app defaults and apply them if not set
      const defaults = getCurrentAppDefaults();
      
      const [existingTheme, existingColorScheme, existingRTL] = await Promise.all([
        StorageService.getItem(STORAGE_KEYS.THEME),
        StorageService.getItem(STORAGE_KEYS.COLOR_SCHEME),
        StorageService.getItem(STORAGE_KEYS.RTL_DIRECTION)
      ]);

      const updates: Promise<void>[] = [];
      
      if (!existingTheme) {
        updates.push(StorageService.setItem(STORAGE_KEYS.THEME, defaults.theme.mode));
      }
      if (!existingColorScheme) {
        updates.push(StorageService.setItem(STORAGE_KEYS.COLOR_SCHEME, defaults.theme.colorScheme));
      }
      if (existingRTL === null) {
        updates.push(StorageService.setItem(STORAGE_KEYS.RTL_DIRECTION, defaults.rtl.enabled.toString()));
      }

      await Promise.all([
        ...updates,
        StorageService.setItem(initKey, 'true')
      ]);

      logger.info('App initialized with defaults', { app: currentApp, defaults });

    } catch (error) {
      logger.error('App initialization failed', error);
      // Continue without throwing - app should still work
    }
  }

  /**
   * Reset app to defaults
   */
  static async resetToDefaults(): Promise<void> {
    const defaults = getCurrentAppDefaults();
    
    await Promise.all([
      StorageService.setItem(STORAGE_KEYS.THEME, defaults.theme.mode),
      StorageService.setItem(STORAGE_KEYS.COLOR_SCHEME, defaults.theme.colorScheme),
      StorageService.setItem(STORAGE_KEYS.RTL_DIRECTION, defaults.rtl.enabled.toString())
    ]);

    logger.info('App reset to defaults', { app: getCurrentApp() });
  }

  /**
   * Check if app has been initialized
   */
  static async isAppInitialized(): Promise<boolean> {
    try {
      const initKey = `${FIRST_LAUNCH_KEY}_${getCurrentApp()}`;
      const hasInitialized = await StorageService.getItem(initKey);
      return hasInitialized === 'true';
    } catch {
      return false;
    }
  }

  /**
   * Mark app as uninitialized (for testing)
   */
  static async markAsUninitialized(): Promise<void> {
    const initKey = `${FIRST_LAUNCH_KEY}_${getCurrentApp()}`;
    await StorageService.removeItem(initKey);
  }
}