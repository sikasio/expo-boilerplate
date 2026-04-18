import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { getAppPrefix } from '../utils/getCurrentApp';
import { logger } from '../utils/logger';

export class StorageService {
  /**
   * Get the app-prefixed key for the current app
   */
  private static getAppKey(key: string): string {
    const prefix = getAppPrefix();
    return `${prefix}${key}`;
  }

  static async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      logger.error('Error storing data', error, {
        function: 'setItem',
        component: 'StorageService',
        key
      });
      throw error;
    }
  }

  /**
   * Set item with app-specific prefix
   */
  static async setAppItem(key: string, value: string): Promise<void> {
    try {
      const appKey = this.getAppKey(key);
      await AsyncStorage.setItem(appKey, value);
    } catch (error) {
      logger.error('Error storing app data', error, {
        function: 'setAppItem',
        component: 'StorageService',
        key
      });
      throw error;
    }
  }

  static async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      logger.error('Error getting data', error, {
        function: 'getItem',
        component: 'StorageService',
        key
      });
      return null;
    }
  }

  /**
   * Get item with app-specific prefix
   */
  static async getAppItem(key: string): Promise<string | null> {
    try {
      const appKey = this.getAppKey(key);
      return await AsyncStorage.getItem(appKey);
    } catch (error) {
      logger.error('Error getting app data', error, {
        function: 'getAppItem',
        component: 'StorageService',
        key
      });
      return null;
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      logger.error('Error removing data', error, {
        function: 'removeItem',
        component: 'StorageService',
        key
      });
      throw error;
    }
  }

  /**
   * Remove item with app-specific prefix
   */
  static async removeAppItem(key: string): Promise<void> {
    try {
      const appKey = this.getAppKey(key);
      await AsyncStorage.removeItem(appKey);
    } catch (error) {
      logger.error('Error removing app data', error, {
        function: 'removeAppItem',
        component: 'StorageService',
        key
      });
      throw error;
    }
  }

  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      logger.error('Error clearing storage', error, {
        function: 'clear',
        component: 'StorageService'
      });
      throw error;
    }
  }

  /**
   * Clear all items for the current app only
   */
  static async clearApp(): Promise<void> {
    try {
      const prefix = getAppPrefix();
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter(key => key.startsWith(prefix));
      await AsyncStorage.multiRemove(appKeys);
    } catch (error) {
      logger.error('Error clearing app storage', error, {
        function: 'clearApp',
        component: 'StorageService'
      });
      throw error;
    }
  }

  /**
   * Get all keys for the current app
   */
  static async getAppKeys(): Promise<string[]> {
    try {
      const prefix = getAppPrefix();
      const keys = await AsyncStorage.getAllKeys();
      return keys
        .filter(key => key.startsWith(prefix))
        .map(key => key.replace(prefix, ''));
    } catch (error) {
      logger.error('Error getting app keys', error, {
        function: 'getAppKeys',
        component: 'StorageService'
      });
      return [];
    }
  }

  // Secure storage methods
  static async setSecureItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      logger.error('Error storing secure data', error, {
        function: 'setSecureItem',
        component: 'StorageService',
        key
      });
      throw error;
    }
  }

  static async getSecureItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      logger.error('Error getting secure data', error, {
        function: 'getSecureItem',
        component: 'StorageService',
        key
      });
      return null;
    }
  }

  static async removeSecureItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      logger.error('Error removing secure data', error, {
        function: 'removeSecureItem',
        component: 'StorageService',
        key
      });
      throw error;
    }
  }

  // JSON storage helpers
  static async setObject(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await this.setItem(key, jsonValue);
    } catch (error) {
      logger.error('Error storing object', error, {
        function: 'setObject',
        component: 'StorageService',
        key
      });
      throw error;
    }
  }

  static async getObject<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await this.getItem(key);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
      logger.error('Error getting object', error, {
        function: 'getObject',
        component: 'StorageService',
        key
      });
      return null;
    }
  }

  // App-specific JSON storage helpers
  static async setAppObject(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await this.setAppItem(key, jsonValue);
    } catch (error) {
      logger.error('Error storing app object', error, {
        function: 'setAppObject',
        component: 'StorageService',
        key
      });
      throw error;
    }
  }

  static async getAppObject<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await this.getAppItem(key);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
      logger.error('Error getting app object', error, {
        function: 'getAppObject',
        component: 'StorageService',
        key
      });
      return null;
    }
  }
}