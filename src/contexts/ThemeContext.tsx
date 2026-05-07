import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Theme, getTheme } from '../config/theme';
import { ThemeMode } from '../types';
import { StorageService } from '../services/storage';
import { STORAGE_KEYS } from '../constants';
import { logger } from '../utils/logger';
import { getCurrentAppDefaults } from '../config/appDefaults';
import { FontContext } from './FontContext';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  colorScheme: string;
  setThemeMode: (mode: ThemeMode) => void;
  setColorScheme: (scheme: string) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  
  // Start with fallback defaults initially, will be set properly after loading
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [colorScheme, setColorSchemeState] = useState<string>('blue');

  useEffect(() => {
    loadThemeMode();
    loadColorScheme();
  }, []);

  const loadThemeMode = async () => {
    try {
      const savedMode = await StorageService.getItem(STORAGE_KEYS.THEME);
      if (savedMode && (savedMode === 'light' || savedMode === 'dark' || savedMode === 'system')) {
        setThemeModeState(savedMode as ThemeMode);
      } else {
        // No saved preference, use app-specific default
        const appDefaults = getCurrentAppDefaults();
        setThemeModeState(appDefaults.theme.mode);
        // Save the default for this app
        await StorageService.setItem(STORAGE_KEYS.THEME, appDefaults.theme.mode);
        
        logger.debug('No saved theme mode, using app default', {
          function: 'loadThemeMode',
          component: 'ThemeContext',
          defaultMode: appDefaults.theme.mode
        });
      }
    } catch (error) {
      logger.error('Failed to load theme mode', error, {
        function: 'loadThemeMode',
        component: 'ThemeContext'
      });
      // Fallback to system on error
      setThemeModeState('system');
    }
  };

  const loadColorScheme = async () => {
    try {
      const savedScheme = await StorageService.getItem(STORAGE_KEYS.COLOR_SCHEME);
      if (savedScheme) {
        setColorSchemeState(savedScheme);
      } else {
        // No saved preference, use app-specific default
        const appDefaults = getCurrentAppDefaults();
        setColorSchemeState(appDefaults.theme.colorScheme);
        // Save the default for this app
        await StorageService.setItem(STORAGE_KEYS.COLOR_SCHEME, appDefaults.theme.colorScheme);
        
        logger.debug('No saved color scheme, using app default', {
          function: 'loadColorScheme',
          component: 'ThemeContext',
          defaultColorScheme: appDefaults.theme.colorScheme
        });
      }
    } catch (error) {
      logger.error('Failed to load color scheme', error, {
        function: 'loadColorScheme',
        component: 'ThemeContext'
      });
      // Fallback to blue on error
      setColorSchemeState('blue');
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await StorageService.setItem(STORAGE_KEYS.THEME, mode);
    } catch (error) {
      logger.error('Failed to save theme mode', error, {
        function: 'setThemeMode',
        component: 'ThemeContext',
        mode
      });
    }
  };

  const setColorScheme = async (scheme: string) => {
    try {
      setColorSchemeState(scheme);
      await StorageService.setItem(STORAGE_KEYS.COLOR_SCHEME, scheme);
    } catch (error) {
      logger.error('Failed to save color scheme', error, {
        function: 'setColorScheme',
        component: 'ThemeContext',
        scheme
      });
    }
  };

  const toggleTheme = () => {
    const currentIsDark = getEffectiveTheme().isDark;
    setThemeMode(currentIsDark ? 'light' : 'dark');
  };

  const getEffectiveTheme = (): Theme => {
    let isDark = false;
    
    if (themeMode === 'system') {
      isDark = systemColorScheme === 'dark';
    } else {
      isDark = themeMode === 'dark';
    }
    
    return getTheme(isDark, colorScheme);
  };

  const theme = getEffectiveTheme();

  const value: ThemeContextType = {
    theme,
    themeMode,
    colorScheme,
    setThemeMode,
    setColorScheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  // Overlay the live fontSizes from FontContext (when present) so consumers
  // reading `theme.fontSizes` automatically pick up the user's chosen base
  // size. Falling through to the static theme if FontProvider isn't mounted.
  const fontCtx = useContext(FontContext);
  if (fontCtx?.fontSizes) {
    return {
      ...context,
      theme: {
        ...context.theme,
        fontSizes: fontCtx.fontSizes,
      },
    };
  }
  return context;
}