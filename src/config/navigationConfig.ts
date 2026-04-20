import { Platform } from 'react-native';

/**
 * Navigation configuration options for different animation types
 */
export type NavigationAnimationType = 'instant' | 'fast' | 'default';

/**
 * Creates navigation options based on animation type and theme
 * @param theme - The current theme object
 * @param animationType - Type of animation to use
 * @returns Navigation options object for React Navigation
 */
export const createNavigationOptions = (theme: any, animationType: NavigationAnimationType = 'default') => {
  const baseOptions = {
    headerShown: false,
    contentStyle: { 
      backgroundColor: theme.colors.background 
    },
    cardStyle: { 
      backgroundColor: theme.colors.background 
    },
    cardStyleInterpolator: () => ({
      cardStyle: {
        backgroundColor: theme.colors.background,
      },
    }),
  };

  switch (animationType) {
    case 'instant':
      return {
        ...baseOptions,
        animationEnabled: false,
        transitionSpec: {
          open: {
            animation: 'timing',
            config: {
              duration: 0,
              useNativeDriver: true,
            },
          },
          close: {
            animation: 'timing',
            config: {
              duration: 0,
              useNativeDriver: true,
            },
          },
        },
        ...(Platform.OS === 'android' && {
          animation: 'none' as const,
          animationDuration: 0,
          gestureEnabled: false,
        }),
        ...(Platform.OS === 'ios' && {
          presentation: 'card' as const,
          gestureEnabled: false,
        }),
      };

    case 'fast':
      return {
        ...baseOptions,
        cardStyleInterpolator: ({ current, layouts }: any) => ({
          cardStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.width, 0],
                  extrapolate: 'clamp',
                }),
              },
            ],
            backgroundColor: theme.colors.background,
          },
        }),
        transitionSpec: {
          open: {
            animation: 'timing',
            config: {
              duration: 100,
              useNativeDriver: true,
            },
          },
          close: {
            animation: 'timing',
            config: {
              duration: 100,
              useNativeDriver: true,
            },
          },
        },
        ...(Platform.OS === 'android' && {
          animation: 'slide_from_right' as const,
          animationDuration: 100,
          gestureEnabled: true,
          gestureDirection: 'horizontal' as const,
          // React Navigation 7+ expects start/end/top/bottom, not horizontal/vertical.
          gestureResponseDistance: {
            start: 15,
          },
          gestureVelocityImpact: 0.3,
        }),
        ...(Platform.OS === 'ios' && {
          presentation: 'card' as const,
          gestureEnabled: true,
          gestureDirection: 'horizontal' as const,
          // React Navigation 7+ expects start/end/top/bottom, not horizontal/vertical.
          gestureResponseDistance: {
            start: 15,
          },
          gestureVelocityImpact: 0.3,
        }),
      };

    case 'default':
    default:
      return {
        ...baseOptions,
        cardStyleInterpolator: ({ current, layouts }: any) => ({
          cardStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.width, 0],
                  extrapolate: 'clamp',
                }),
              },
            ],
            backgroundColor: theme.colors.background,
          },
        }),
        transitionSpec: {
          open: {
            animation: 'timing',
            config: {
              duration: 250,
              useNativeDriver: true,
            },
          },
          close: {
            animation: 'timing',
            config: {
              duration: 250,
              useNativeDriver: true,
            },
          },
        },
        ...(Platform.OS === 'android' && {
          animation: 'slide_from_right' as const,
          animationDuration: 250,
          gestureEnabled: true,
          gestureDirection: 'horizontal' as const,
          gestureResponseDistance: {
            start: 25,
          },
        }),
        ...(Platform.OS === 'ios' && {
          presentation: 'card' as const,
          gestureEnabled: true,
          gestureDirection: 'horizontal' as const,
          gestureResponseDistance: {
            start: 25,
          },
        }),
      };
  }
};

/**
 * Convenience function for instant navigation (no animations)
 * @param theme - The current theme object
 * @returns Instant navigation options
 */
export const createInstantNavigationOptions = (theme: any) => 
  createNavigationOptions(theme, 'instant');

/**
 * Convenience function for fast navigation (100ms animations)
 * @param theme - The current theme object
 * @returns Fast navigation options
 */
export const createFastNavigationOptions = (theme: any) => 
  createNavigationOptions(theme, 'fast');

/**
 * Convenience function for default navigation (250ms animations)
 * @param theme - The current theme object
 * @returns Default navigation options
 */
export const createDefaultNavigationOptions = (theme: any) => 
  createNavigationOptions(theme, 'default');