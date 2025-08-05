import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeStatusBar() {
  const { theme } = useTheme();

  return (
    <StatusBar 
      style={theme.isDark ? 'light' : 'dark'} 
      backgroundColor={theme.colors.background}
    />
  );
}