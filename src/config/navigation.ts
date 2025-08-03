import { Platform } from 'react-native';

export type TabNavigatorDesign = 'default' | 'floating' | 'bubble';

export interface NavigationDimensions {
  height: number;
  paddingTop: number;
  paddingBottom: number;
  bottomOffset: number; // Distance from screen bottom
}

export interface NavigationConfig {
  tabBar: {
    [K in TabNavigatorDesign]: NavigationDimensions;
  };
}

/**
 * Centralized navigation configuration
 * Contains all navigation-related dimensions and measurements
 */
export const NAVIGATION_CONFIG: NavigationConfig = {
  tabBar: {
    default: {
      height: Platform.OS === 'ios' ? 75 : 60,
      paddingTop: Platform.OS === 'ios' ? 8 : 0,
      paddingBottom: Platform.OS === 'ios' ? 22 : 0,
      bottomOffset: 0, // Sits at bottom of screen
    },
    floating: {
      height: Platform.OS === 'ios' ? 75 : 65,
      paddingTop: 15,
      paddingBottom: Platform.OS === 'ios' ? 25 : 15,
      bottomOffset: 15, // 15px from bottom
    },
    bubble: {
      height: 65, // Approximate total height including padding
      paddingTop: 10,
      paddingBottom: 10,
      bottomOffset: 15, // 15px from bottom
    },
  },
};

/**
 * Get tab bar dimensions for a specific design
 */
export const getTabBarDimensions = (design: TabNavigatorDesign): NavigationDimensions => {
  return NAVIGATION_CONFIG.tabBar[design];
};

/**
 * Get the total bottom space occupied by tab bar (height + bottom offset)
 */
export const getTabBarBottomSpace = (design: TabNavigatorDesign): number => {
  const dimensions = getTabBarDimensions(design);
  return dimensions.height + dimensions.bottomOffset;
};

/**
 * Calculate safe floating button position above tab bar
 * @param design - Current tab bar design
 * @param safeAreaBottom - Bottom safe area inset
 * @param extraSpacing - Additional spacing above tab bar (default: 20px)
 */
export const getFloatingButtonBottom = (
  design: TabNavigatorDesign,
  safeAreaBottom: number = 0,
  extraSpacing: number = 20
): number => {
  const tabBarSpace = getTabBarBottomSpace(design);
  const iosSafeArea = Platform.OS === 'ios' ? safeAreaBottom : 0;
  return tabBarSpace + extraSpacing + iosSafeArea;
};

/**
 * Get current tab bar design from app configuration
 * This can be made dynamic in the future
 */
export const getCurrentTabBarDesign = (): TabNavigatorDesign => {
  // For now, return the design currently used in _layout.tsx
  // In the future, this could read from app settings/preferences
  return 'bubble';
};

/**
 * Navigation constants for consistent spacing
 */
export const NAVIGATION_CONSTANTS = {
  HEADER_HEIGHT: Platform.OS === 'ios' ? 44 : 56,
  STATUS_BAR_HEIGHT: Platform.OS === 'ios' ? 20 : 24,
  FLOATING_BUTTON_SIZE: 56,
  FLOATING_BUTTON_SPACING: 20,
  TAB_ICON_SIZE: 24,
  TAB_ICON_SIZE_FOCUSED: 26,
} as const;

/**
 * Helper to get safe scrollview content inset for tab bar
 */
export const getScrollViewContentInset = (
  design: TabNavigatorDesign,
  safeAreaBottom: number = 0
): { bottom: number } => {
  const tabBarSpace = getTabBarBottomSpace(design);
  const iosSafeArea = Platform.OS === 'ios' ? safeAreaBottom : 0;
  return {
    bottom: tabBarSpace + iosSafeArea + 20, // Extra 20px for comfortable scrolling
  };
};