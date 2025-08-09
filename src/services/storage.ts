import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { getAppPrefix } from '../utils/getCurrentApp';

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
      console.error('Error storing data:', error);
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
      console.error('Error storing app data:', error);
      throw error;
    }
  }

  static async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Error getting data:', error);
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
      console.error('Error getting app data:', error);
      return null;
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data:', error);
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
      console.error('Error removing app data:', error);
      throw error;
    }
  }

  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
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
      console.error('Error clearing app storage:', error);
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
      console.error('Error getting app keys:', error);
      return [];
    }
  }

  // Secure storage methods
  static async setSecureItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('Error storing secure data:', error);
      throw error;
    }
  }

  static async getSecureItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Error getting secure data:', error);
      return null;
    }
  }

  static async removeSecureItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Error removing secure data:', error);
      throw error;
    }
  }

  // JSON storage helpers
  static async setObject(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await this.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error storing object:', error);
      throw error;
    }
  }

  static async getObject<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await this.getItem(key);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error getting object:', error);
      return null;
    }
  }

  // App-specific JSON storage helpers
  static async setAppObject(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await this.setAppItem(key, jsonValue);
    } catch (error) {
      console.error('Error storing app object:', error);
      throw error;
    }
  }

  static async getAppObject<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await this.getAppItem(key);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error getting app object:', error);
      return null;
    }
  }
}