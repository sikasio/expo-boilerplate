import React from 'react';
import {
  View,
  ViewProps,
  SafeAreaView
} from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
import { usePathname } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { useRTL } from '../../contexts/RTLContext';
import { use3ButtonNavigationDetector } from '../../hooks/use3ButtonNavigationDetector';
import { createRTLStyle } from '../../utils';

interface ContainerProps extends ViewProps {
  children: React.ReactNode;
  safeArea?: boolean;
  padding?: 'none' | 'small' | 'medium' | 'large' | 'sm' | 'md' | 'lg' | 'xl';
  backgroundColor?: string;
  bottomOffset?: boolean; // Skip Android bottom offset (default: true, set false for non-tab screens)
}

export function Container({
  children,
  safeArea = true,
  padding = 'medium',
  backgroundColor,
  bottomOffset = true,
  style,
  ...props
}: ContainerProps) {
  const { theme } = useTheme();
  const { isRTL } = useRTL();
  const { androidBottomOffset } = use3ButtonNavigationDetector();
  const pathname = usePathname();

  // Auto-detect if we're in a tab screen to avoid double offset
  // Check for multiple possible tab patterns
  const isTabScreen = pathname?.includes('/(tabs)') ||
                      pathname?.includes('/tabs') ||
                      pathname === '/' ||  // Root path is likely a tab screen
                      pathname?.match(/^\/(index|discover)$/) || // Direct tab routes
                      false;

  const getContainerStyle = () => {
    const paddingStyles = {
      none: {},
      // Legacy padding options
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
      // Direct theme size values
      sm: {
        paddingHorizontal: theme.sizes.sm,
        paddingTop: theme.sizes.sm,
      },
      md: {
        paddingHorizontal: theme.sizes.md,
        paddingTop: theme.sizes.md,
      },
      lg: {
        paddingHorizontal: theme.sizes.lg,
        paddingTop: theme.sizes.lg,
      },
      xl: {
        paddingHorizontal: theme.sizes.xl,
        paddingTop: theme.sizes.xl,
      },
    };

    const baseStyle = {
      flex: 1,
      backgroundColor: backgroundColor || theme.colors.background,
      paddingBottom: (paddingStyles[padding].paddingBottom || 0) + (bottomOffset && !isTabScreen ? androidBottomOffset : 0),
      ...paddingStyles[padding],
    };

    // Apply RTL transformations to the base style
    return createRTLStyle(baseStyle, {}, isRTL);
  };

  const getSafeAreaStyle = () => {
    const baseStyle = {
      flex: 1,
      backgroundColor: backgroundColor || theme.colors.background,
    };

    return createRTLStyle(baseStyle, {}, isRTL);
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