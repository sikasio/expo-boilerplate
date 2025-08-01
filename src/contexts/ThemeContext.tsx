import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Theme, getTheme } from '../config/theme';
import { ThemeMode } from '../types';
import { StorageService } from '../services/storage';
import { STORAGE_KEYS } from '../constants';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    loadThemeMode();
  }, []);

  const loadThemeMode = async () => {
    try {
      const savedMode = await StorageService.getItem(STORAGE_KEYS.THEME);
      if (savedMode && (savedMode === 'light' || savedMode === 'dark' || savedMode === 'system')) {
        setThemeModeState(savedMode as ThemeMode);
      }
    } catch (error) {
      console.error('Failed to load theme mode:', error);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await StorageService.setItem(STORAGE_KEYS.THEME, mode);
    } catch (error) {
      console.error('Failed to save theme mode:', error);
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
    
    return getTheme(isDark);
  };

  const theme = getEffectiveTheme();

  const value: ThemeContextType = {
    theme,
    themeMode,
    setThemeMode,
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
  return context;
}