import React from 'react';
import {
  View,
  ViewProps,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface ContainerProps extends ViewProps {
  children: React.ReactNode;
  safeArea?: boolean;
  padding?: 'none' | 'small' | 'medium' | 'large';
  backgroundColor?: string;
}

export function Container({
  children,
  safeArea = true,
  padding = 'medium',
  backgroundColor,
  style,
  ...props
}: ContainerProps) {
  const { theme } = useTheme();

  const getContainerStyle = () => {
    const paddingStyles = {
      none: {},
      small: {
        paddingHorizontal: theme.sizes.sm,
        paddingTop: theme.sizes.md,
      },
      medium: {
        paddingHorizontal: theme.sizes.md,
        paddingTop: theme.sizes.md,
      },
      large: {
        paddingHorizontal: theme.sizes.lg,
        paddingTop: theme.sizes.lg,
      },
    };

    const baseStyle = {
      flex: 1,
      backgroundColor: backgroundColor || theme.colors.background,
      ...paddingStyles[padding],
    };

    return baseStyle;
  };

  const getSafeAreaStyle = () => {
    return {
      flex: 1,
      backgroundColor: backgroundColor || theme.colors.background,
    };
  };

  if (safeArea) {
    return (
      <SafeAreaView style={[getSafeAreaStyle(), { paddingTop: 0 }]} {...props}>
        <View style={[getContainerStyle(), style]}>
          {children}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={[getContainerStyle(), style]} {...props}>
      {children}
    </View>
  );
}