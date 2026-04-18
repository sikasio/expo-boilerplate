import { StorageService } from './storage';
import { logger } from '../utils/logger';

/**
 * Generic First-Time Service
 * 
 * Manages first-time user experience for any context or feature.
 * Uses the global StorageService with app-specific prefixing to prevent
 * conflicts between different apps in the boilerplate.
 * 
 * Can track first-time status for different features, screens, or experiences
 * with support for versioning and namespacing.
 */

const FIRST_TIME_BASE_KEY = 'FirstTime';

export interface FirstTimeConfig {
  key: string;    // Unique identifier for the feature/context
  version?: string; // Optional version for feature updates
}

interface FirstTimeData {
  completed: boolean;
  timestamp: string;
  key: string;
  version?: string;
}

export class FirstTimeService {
  /**
   * Generate storage key for specific context
   */
  private static getStorageKey(key: string, version?: string): string {
    const baseKey = `${FIRST_TIME_BASE_KEY}_${key}`;
    return version ? `${baseKey}_v${version}` : baseKey;
  }

  /**
   * Check if this is the first time for a specific context
   * Uses app-specific storage to prevent conflicts between apps
   * @param config Configuration with key and optional version
   * @returns Promise<boolean> true if first time, false otherwise
   */
  static async isFirstTime(config: FirstTimeConfig): Promise<boolean> {
    try {
      const storageKey = this.getStorageKey(config.key, config.version);
      const data = await StorageService.getAppObject<FirstTimeData>(storageKey);
      return data === null || !data.completed;
    } catch (error) {
      logger.error(`FirstTimeService: Error checking first time status for ${config.key}:`, error, { function: 'isFirstTime', service: 'FirstTimeService', key: config.key, version: config.version });
      // On error, assume it's first time to be safe
      return true;
    }
  }

  /**
   * Mark that the first-time experience has been completed for a specific context
   * Uses app-specific storage to prevent conflicts between apps
   * @param config Configuration with key and optional version
   */
  static async markAsNotFirstTime(config: FirstTimeConfig): Promise<void> {
    try {
      const storageKey = this.getStorageKey(config.key, config.version);
      const data: FirstTimeData = {
        completed: true,
        timestamp: new Date().toISOString(),
        key: config.key,
        version: config.version
      };
      await StorageService.setAppObject(storageKey, data);
      logger.debug(`FirstTimeService: Marked ${config.key} as not first time`, null, { function: 'markAsNotFirstTime', service: 'FirstTimeService', key: config.key });
    } catch (error) {
      logger.error(`FirstTimeService: Error marking first time as complete for ${config.key}:`, error, { function: 'markAsNotFirstTime', service: 'FirstTimeService', key: config.key, version: config.version });
    }
  }

  /**
   * Reset first time status for a specific context (useful for testing/debugging)
   * Uses app-specific storage to prevent conflicts between apps
   * @param config Configuration with key and optional version
   */
  static async resetFirstTime(config: FirstTimeConfig): Promise<void> {
    try {
      const storageKey = this.getStorageKey(config.key, config.version);
      await StorageService.removeAppItem(storageKey);
      logger.debug(`FirstTimeService: Reset first time status for ${config.key}`, null, { function: 'resetFirstTime', service: 'FirstTimeService', key: config.key });
    } catch (error) {
      logger.error(`FirstTimeService: Error resetting first time status for ${config.key}:`, error, { function: 'resetFirstTime', service: 'FirstTimeService', key: config.key, version: config.version });
    }
  }

  /**
   * Get all first-time completion data for the current app (useful for debugging)
   * Only returns data for the current app, preventing cross-app data exposure
   */
  static async getAllFirstTimeData(): Promise<Record<string, FirstTimeData>> {
    try {
      const appKeys = await StorageService.getAppKeys();
      const firstTimeKeys = appKeys.filter(key => key.startsWith(FIRST_TIME_BASE_KEY));
      
      const data: Record<string, FirstTimeData> = {};
      for (const key of firstTimeKeys) {
        const value = await StorageService.getAppObject<FirstTimeData>(key);
        if (value) {
          data[key] = value;
        }
      }
      
      return data;
    } catch (error) {
      logger.error('FirstTimeService: Error getting all first time data:', error, { function: 'getAllFirstTimeData', service: 'FirstTimeService' });
      return {};
    }
  }

  /**
   * Clear all first-time data for the current app only (useful for testing/debugging)
   * Only affects the current app, preserving data for other apps
   */
  static async clearAllFirstTimeData(): Promise<void> {
    try {
      const appKeys = await StorageService.getAppKeys();
      const firstTimeKeys = appKeys.filter(key => key.startsWith(FIRST_TIME_BASE_KEY));
      
      for (const key of firstTimeKeys) {
        await StorageService.removeAppItem(key);
      }
      
      if (firstTimeKeys.length > 0) {
        logger.debug(`FirstTimeService: Cleared ${firstTimeKeys.length} first-time records for current app`, null, { function: 'clearAllFirstTimeData', service: 'FirstTimeService', recordsCleared: firstTimeKeys.length });
      }
    } catch (error) {
      logger.error('FirstTimeService: Error clearing all first time data:', error, { function: 'clearAllFirstTimeData', service: 'FirstTimeService' });
    }
  }
}

/**
 * Create a first-time tracker for any context
 * @param key Unique identifier for the context
 * @param version Optional version for the context
 * @returns Object with first-time methods
 */
export const createFirstTimeTracker = (key: string, version?: string) => ({
  isFirstTime: () => FirstTimeService.isFirstTime({ key, version }),
  markAsNotFirstTime: () => FirstTimeService.markAsNotFirstTime({ key, version }),
  resetFirstTime: () => FirstTimeService.resetFirstTime({ key, version })
});