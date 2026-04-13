import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  FONT_FAMILIES,
  DEFAULT_APP_FONT_CONFIGS,
  calculateFontSizes,
  getFontStyle,
  type FontFamily,
  type AppFontConfig
} from '@/config/fonts';
import { getCurrentApp } from '@/utils/getCurrentApp';

// Storage keys
const STORAGE_KEYS = {
  FONT_FAMILY: '@font_family',
  FONT_SIZE: '@font_size',
  APP_FONT_CONFIGS: '@app_font_configs',
} as const;

interface FontContextType {
  // Current font settings
  fontFamily: FontFamily;
  fontSize: number;
  fontSizes: Record<string, number>;
  lineHeightMultiplier: number;

  // Available fonts
  availableFonts: FontFamily[];

  // Font management
  setFontFamily: (fontId: string) => Promise<void>;
  setFontSize: (size: number) => Promise<void>;
  setLineHeightMultiplier: (multiplier: number) => Promise<void>;

  // App-specific settings
  getAppFontConfig: (appId: string) => AppFontConfig;
  setAppFontConfig: (appId: string, config: Partial<AppFontConfig>) => Promise<void>;

  // Utility functions
  getFontStyle: (weight?: 'thin' | 'extraLight' | 'light' | 'regular' | 'medium' | 'semiBold' | 'bold' | 'extraBold' | 'black', italic?: boolean) => any;
  resetToDefaults: () => Promise<void>;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

interface FontProviderProps {
  children: ReactNode;
}

export function FontProvider({ children }: FontProviderProps) {
  const currentApp = getCurrentApp();

  // Apply platform-specific line height multipliers
  const getPlatformLineHeightMultiplier = (baseMultiplier: number): number => {
    return Platform.OS === 'ios' ? baseMultiplier * 1.15 : baseMultiplier;
  };

  const defaultConfig = DEFAULT_APP_FONT_CONFIGS[currentApp] || DEFAULT_APP_FONT_CONFIGS._default;
  const platformAdjustedLineHeight = getPlatformLineHeightMultiplier(defaultConfig.lineHeightMultiplier);

  // State
  const [fontFamily, setFontFamilyState] = useState<FontFamily>(FONT_FAMILIES[defaultConfig.fontFamily]);
  const [fontSize, setFontSizeState] = useState<number>(defaultConfig.baseSize);
  const [lineHeightMultiplier, setLineHeightMultiplierState] = useState<number>(platformAdjustedLineHeight);
  const [appFontConfigs, setAppFontConfigs] = useState<Record<string, AppFontConfig>>(DEFAULT_APP_FONT_CONFIGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Computed values
  const fontSizes = calculateFontSizes(fontSize);
  const availableFonts = Object.values(FONT_FAMILIES);

  // Load saved settings on mount
  useEffect(() => {
    loadFontSettings();
  }, []);

  // Save settings whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveFontSettings();
    }
  }, [fontFamily.id, fontSize, lineHeightMultiplier, appFontConfigs, isLoaded]);

  const loadFontSettings = async () => {
    try {
      // Load app-specific font configs
      const savedConfigs = await AsyncStorage.getItem(STORAGE_KEYS.APP_FONT_CONFIGS);
      if (savedConfigs) {
        const configs = JSON.parse(savedConfigs);
        setAppFontConfigs({ ...DEFAULT_APP_FONT_CONFIGS, ...configs });

        // Apply current app's config
        const currentConfig = configs[currentApp] || DEFAULT_APP_FONT_CONFIGS[currentApp] || DEFAULT_APP_FONT_CONFIGS._default;
        setFontFamilyState(FONT_FAMILIES[currentConfig.fontFamily] || FONT_FAMILIES.system);
        setFontSizeState(currentConfig.baseSize);
        setLineHeightMultiplierState(getPlatformLineHeightMultiplier(currentConfig.lineHeightMultiplier));
      } else {
        // First time - apply default config for current app
        const currentConfig = DEFAULT_APP_FONT_CONFIGS[currentApp] || DEFAULT_APP_FONT_CONFIGS._default;
        setFontFamilyState(FONT_FAMILIES[currentConfig.fontFamily]);
        setFontSizeState(currentConfig.baseSize);
        setLineHeightMultiplierState(getPlatformLineHeightMultiplier(currentConfig.lineHeightMultiplier));
      }

      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading font settings:', error);
      setIsLoaded(true);
    }
  };

  const saveFontSettings = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.APP_FONT_CONFIGS, JSON.stringify(appFontConfigs));
    } catch (error) {
      console.error('Error saving font settings:', error);
    }
  };

  const setFontFamily = async (fontId: string) => {
    const newFontFamily = FONT_FAMILIES[fontId];
    if (!newFontFamily) return;

    setFontFamilyState(newFontFamily);

    // Update current app's config
    const updatedConfigs = {
      ...appFontConfigs,
      [currentApp]: {
        ...appFontConfigs[currentApp],
        fontFamily: fontId,
      },
    };
    setAppFontConfigs(updatedConfigs);
  };

  const setFontSize = async (size: number) => {
    const clampedSize = Math.max(12, Math.min(24, size)); // Clamp between 12-24px
    setFontSizeState(clampedSize);

    // Update current app's config
    const updatedConfigs = {
      ...appFontConfigs,
      [currentApp]: {
        ...appFontConfigs[currentApp],
        baseSize: clampedSize,
      },
    };
    setAppFontConfigs(updatedConfigs);
  };

  const setLineHeightMultiplier = async (multiplier: number) => {
    const clampedMultiplier = Math.max(1.0, Math.min(2.0, multiplier)); // Clamp between 1.0-2.0
    setLineHeightMultiplierState(clampedMultiplier);

    // Update current app's config
    const updatedConfigs = {
      ...appFontConfigs,
      [currentApp]: {
        ...appFontConfigs[currentApp],
        lineHeightMultiplier: clampedMultiplier,
      },
    };
    setAppFontConfigs(updatedConfigs);
  };

  const getAppFontConfig = (appId: string): AppFontConfig => {
    return appFontConfigs[appId] || DEFAULT_APP_FONT_CONFIGS._default;
  };

  const setAppFontConfig = async (appId: string, config: Partial<AppFontConfig>) => {
    const updatedConfigs = {
      ...appFontConfigs,
      [appId]: {
        ...appFontConfigs[appId],
        ...config,
      },
    };
    setAppFontConfigs(updatedConfigs);

    // If updating current app, apply changes immediately
    if (appId === currentApp) {
      if (config.fontFamily) {
        setFontFamilyState(FONT_FAMILIES[config.fontFamily] || fontFamily);
      }
      if (config.baseSize) {
        setFontSizeState(config.baseSize);
      }
      if (config.lineHeightMultiplier) {
        setLineHeightMultiplierState(config.lineHeightMultiplier);
      }
    }
  };

  const getFontStyleFunction = (
    weight: 'thin' | 'extraLight' | 'light' | 'regular' | 'medium' | 'semiBold' | 'bold' | 'extraBold' | 'black' = 'regular',
    italic: boolean = false
  ) => {
    if (!fontFamily) {
      console.warn('FontContext: fontFamily is undefined, falling back to system font');
      return getFontStyle(FONT_FAMILIES.system, weight, italic);
    }
    return getFontStyle(fontFamily, weight, italic);
  };

  const resetToDefaults = async () => {
    const defaultConfig = DEFAULT_APP_FONT_CONFIGS[currentApp] || DEFAULT_APP_FONT_CONFIGS._default;

    setFontFamilyState(FONT_FAMILIES[defaultConfig.fontFamily]);
    setFontSizeState(defaultConfig.baseSize);
    setLineHeightMultiplierState(getPlatformLineHeightMultiplier(defaultConfig.lineHeightMultiplier));

    // Reset current app's config
    const updatedConfigs = {
      ...appFontConfigs,
      [currentApp]: defaultConfig,
    };
    setAppFontConfigs(updatedConfigs);
  };

  const value: FontContextType = {
    // Current font settings
    fontFamily,
    fontSize,
    fontSizes,
    lineHeightMultiplier,

    // Available fonts
    availableFonts,

    // Font management
    setFontFamily,
    setFontSize,
    setLineHeightMultiplier,

    // App-specific settings
    getAppFontConfig,
    setAppFontConfig,

    // Utility functions
    getFontStyle: getFontStyleFunction,
    resetToDefaults,
  };

  return (
    <FontContext.Provider value={value}>
      {children}
    </FontContext.Provider>
  );
}

export function useFont(): FontContextType {
  const context = useContext(FontContext);
  if (context === undefined) {
    throw new Error('useFont must be used within a FontProvider');
  }
  return context;
}

// Hook to get font styles with better TypeScript support
export function useFontStyle(
  weight: 'thin' | 'extraLight' | 'light' | 'regular' | 'medium' | 'semiBold' | 'bold' | 'extraBold' | 'black' = 'regular',
  italic: boolean = false
) {
  const { getFontStyle } = useFont();
  return getFontStyle(weight, italic);
}