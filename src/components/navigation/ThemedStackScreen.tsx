import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemedStackScreenProps {
  name: string;
  options: any;
}

export function ThemedStackScreen({ name, options }: ThemedStackScreenProps) {
  const { theme } = useTheme();

  const themedOptions = {
    ...options,
    headerStyle: {
      backgroundColor: theme.colors.surface,
      ...options.headerStyle,
    },
    headerTintColor: theme.colors.text,
    headerTitleStyle: {
      color: theme.colors.text,
      ...options.headerTitleStyle,
    },
  };

  return <Stack.Screen name={name} options={themedOptions} />;
}