import { useState, useEffect, useCallback } from 'react';
import { StorageService } from '../services/storage';

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
      console.error('Error loading stored value:', error);
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
      console.error('Error storing value:', error);
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
      console.error('Error removing stored value:', error);
      throw error;
    }
  }, [key, initialValue, secure]);

  return [storedValue, setValue, removeValue];
}