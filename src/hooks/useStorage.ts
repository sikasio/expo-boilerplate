import { useState, useEffect, useCallback } from 'react';
import { StorageService } from '@/services/storage';
import { logger } from '@/utils/logger';

export function useStorage<T>(
  key: string,
  initialValue: T,
  secure = false
): [T, (value: T) => Promise<void>, () => Promise<void>] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    loadStoredValue();
  }, [key]);

  const loadStoredValue = async () => {
    try {
      let item: string | null;
      
      if (secure) {
        item = await StorageService.getSecureItem(key);
      } else {
        item = await StorageService.getItem(key);
      }

      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      logger.error('Error loading stored value:', error, { function: 'loadStoredValue', hook: 'useStorage', key, secure });
    }
  };

  const setValue = useCallback(async (value: T) => {
    try {
      setStoredValue(value);
      const valueToStore = JSON.stringify(value);
      
      if (secure) {
        await StorageService.setSecureItem(key, valueToStore);
      } else {
        await StorageService.setItem(key, valueToStore);
      }
    } catch (error) {
      logger.error('Error storing value:', error, { function: 'setValue', hook: 'useStorage', key, secure });
      throw error;
    }
  }, [key, secure]);

  const removeValue = useCallback(async () => {
    try {
      setStoredValue(initialValue);
      
      if (secure) {
        await StorageService.removeSecureItem(key);
      } else {
        await StorageService.removeItem(key);
      }
    } catch (error) {
      logger.error('Error removing stored value:', error, { function: 'removeValue', hook: 'useStorage', key, secure });
      throw error;
    }
  }, [key, initialValue, secure]);

  return [storedValue, setValue, removeValue];
}