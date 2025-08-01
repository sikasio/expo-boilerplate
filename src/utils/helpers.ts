import { Dimensions, Platform } from 'react-native';

export const DeviceUtils = {
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
  isWeb: Platform.OS === 'web',

  getScreenDimensions: () => {
    const { width, height } = Dimensions.get('screen');
    return { width, height };
  },

  getWindowDimensions: () => {
    const { width, height } = Dimensions.get('window');
    return { width, height };
  },

  isTablet: () => {
    const { width, height } = Dimensions.get('screen');
    const aspectRatio = width / height;
    return Math.min(width, height) >= 600 && (aspectRatio > 1.2 && aspectRatio < 2.0);
  },

  isLandscape: () => {
    const { width, height } = Dimensions.get('screen');
    return width > height;
  },
};

export const AsyncUtils = {
  delay: (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  timeout: <T>(promise: Promise<T>, ms: number): Promise<T> => {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Promise timeout')), ms)
      ),
    ]);
  },

  retry: async <T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    delay: number = 1000
  ): Promise<T> => {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxAttempts) {
          throw lastError;
        }
        
        await AsyncUtils.delay(delay * attempt);
      }
    }

    throw lastError!;
  },
};

export const ArrayUtils = {
  unique: <T>(array: T[]): T[] => {
    return [...new Set(array)];
  },

  uniqueBy: <T>(array: T[], key: keyof T): T[] => {
    const seen = new Set();
    return array.filter(item => {
      const value = item[key];
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
  },

  groupBy: <T>(array: T[], key: keyof T): Record<string, T[]> => {
    return array.reduce((groups, item) => {
      const value = String(item[key]);
      groups[value] = groups[value] || [];
      groups[value].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  },

  chunk: <T>(array: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },

  shuffle: <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  sample: <T>(array: T[], count: number = 1): T[] => {
    const shuffled = ArrayUtils.shuffle(array);
    return shuffled.slice(0, count);
  },
};

export const ObjectUtils = {
  pick: <T extends object, K extends keyof T>(
    obj: T,
    keys: K[]
  ): Pick<T, K> => {
    const result = {} as Pick<T, K>;
    keys.forEach(key => {
      if (key in obj) {
        result[key] = obj[key];
      }
    });
    return result;
  },

  omit: <T extends object, K extends keyof T>(
    obj: T,
    keys: K[]
  ): Omit<T, K> => {
    const result = { ...obj };
    keys.forEach(key => {
      delete result[key];
    });
    return result;
  },

  isEmpty: (obj: any): boolean => {
    if (obj == null) return true;
    if (Array.isArray(obj)) return obj.length === 0;
    if (typeof obj === 'object') return Object.keys(obj).length === 0;
    return false;
  },

  deepEqual: (a: any, b: any): boolean => {
    if (a === b) return true;
    
    if (a == null || b == null) return false;
    if (typeof a !== typeof b) return false;
    
    if (Array.isArray(a)) {
      if (!Array.isArray(b) || a.length !== b.length) return false;
      return a.every((item, index) => ObjectUtils.deepEqual(item, b[index]));
    }
    
    if (typeof a === 'object') {
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      
      if (keysA.length !== keysB.length) return false;
      
      return keysA.every(key => 
        keysB.includes(key) && ObjectUtils.deepEqual(a[key], b[key])
      );
    }
    
    return false;
  },
};

export const ColorUtils = {
  hexToRgb: (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  },

  rgbToHex: (r: number, g: number, b: number): string => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  },

  adjustOpacity: (color: string, opacity: number): string => {
    if (color.includes('rgba')) {
      return color.replace(/rgba?\(([^)]+)\)/, (match, rgb) => {
        const values = rgb.split(',').map((v: string) => v.trim());
        return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${opacity})`;
      });
    }
    
    const rgb = ColorUtils.hexToRgb(color);
    if (rgb) {
      return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
    }
    
    return color;
  },
};

export const RandomUtils = {
  id: (length: number = 8): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  number: (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  boolean: (): boolean => {
    return Math.random() < 0.5;
  },

  color: (): string => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  },
};