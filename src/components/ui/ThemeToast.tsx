import React from 'react';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToast() {
  const { theme } = useTheme();

  const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: theme.colors.success,
          backgroundColor: theme.colors.surface,
          borderLeftWidth: 5,
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: theme.fontSizes.md,
          fontWeight: '600',
          color: theme.colors.text,
        }}
        text2Style={{
          fontSize: theme.fontSizes.sm,
          color: theme.colors.textSecondary,
        }}
      />
    ),
    error: (props: any) => (
      <ErrorToast
        {...props}
        style={{
          borderLeftColor: theme.colors.error,
          backgroundColor: theme.colors.surface,
          borderLeftWidth: 5,
        }}
        text1Style={{
          fontSize: theme.fontSizes.md,
          fontWeight: '600',
          color: theme.colors.text,
        }}
        text2Style={{
          fontSize: theme.fontSizes.sm,
          color: theme.colors.textSecondary,
        }}
      />
    ),
    info: (props: any) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: theme.colors.primary,
          backgroundColor: theme.colors.surface,
          borderLeftWidth: 5,
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: theme.fontSizes.md,
          fontWeight: '600',
          color: theme.colors.text,
        }}
        text2Style={{
          fontSize: theme.fontSizes.sm,
          color: theme.colors.textSecondary,
        }}
      />
    ),
  };

  return (
    <Toast
      config={toastConfig}
      position="bottom"
      bottomOffset={100}
    />
  );
}