import { I18nManager, StyleSheet, TextStyle, ViewStyle } from 'react-native';

/**
 * RTL utility functions for React Native
 * Provides helper functions to handle RTL (Right-to-Left) layout support
 */

export interface RTLProps {
  /**
   * Enable RTL (Right-to-Left) layout
   * @default false
   */
  rtl?: boolean;
}

/**
 * Check if current device/app is in RTL mode
 * Uses React Native's I18nManager to detect RTL
 * Note: For dynamic RTL switching, use useRTL() hook from RTLContext instead
 */
export const isRTL = (): boolean => {
  return I18nManager.isRTL;
};

/**
 * Check RTL state from context (for dynamic RTL switching)
 * This should be used instead of isRTL() when you need dynamic RTL support
 */
export const isRTLFromContext = (contextRTL: boolean): boolean => {
  return contextRTL;
};

/**
 * Force RTL mode for the entire app
 * WARNING: This requires app restart to take effect
 */
export const forceRTL = (enable: boolean): void => {
  I18nManager.forceRTL(enable);
};

/**
 * Get flex direction based on RTL prop or global RTL state
 * @param rtl - Optional RTL override
 * @param flexDir - The base flex direction to transform
 * @returns Appropriate flex direction for RTL/LTR
 */
export const getFlexDirection = (rtl?: boolean, flexDir: 'row' | 'column' | 'row-reverse' | 'column-reverse' = 'row'): 'row' | 'column' | 'row-reverse' | 'column-reverse' => {
  const isRTLActive = rtl !== undefined ? rtl : false; // Default to false - manual RTL control
  
  if (!isRTLActive) {
    return flexDir;
  }
  
  // Transform row directions for RTL
  if (flexDir === 'row') {
    return 'row-reverse';
  } else if (flexDir === 'row-reverse') {
    return 'row';
  }
  
  // Column directions don't change
  return flexDir;
};

/**
 * Get text alignment based on RTL prop or global RTL state
 * @param rtl - Optional RTL override
 * @param align - Base text alignment ('left', 'right', 'center', 'auto')
 * @returns Appropriate text alignment for RTL/LTR
 */
export const getTextAlign = (rtl?: boolean, align?: TextStyle['textAlign']): TextStyle['textAlign'] => {
  const isRTLActive = rtl !== undefined ? rtl : false; // Default to false when no context provided
  
  if (align === 'center' || align === 'justify') {
    return align;
  }
  
  if (align === 'left') {
    return isRTLActive ? 'right' : 'left';
  }
  
  if (align === 'right') {
    return isRTLActive ? 'left' : 'right';
  }
  
  // Default alignment based on RTL state
  return isRTLActive ? 'right' : 'left';
};

/**
 * RTL-aware margin utilities (helper functions)
 */
export const getRTLMargin = (rtl?: boolean) => {
  const isRTLActive = rtl !== undefined ? rtl : false; // Default to false - manual RTL control
  
  return {
    /**
     * Margin start (left in LTR, right in RTL)
     */
    marginStart: (value: number) => ({
      [isRTLActive ? 'marginRight' : 'marginLeft']: value,
    }),
    
    /**
     * Margin end (right in LTR, left in RTL)  
     */
    marginEnd: (value: number) => ({
      [isRTLActive ? 'marginLeft' : 'marginRight']: value,
    }),
  };
};

/**
 * RTL-aware padding utilities (helper functions)
 */
export const getRTLPadding = (rtl?: boolean) => {
  const isRTLActive = rtl !== undefined ? rtl : false; // Default to false - manual RTL control
  
  return {
    /**
     * Padding start (left in LTR, right in RTL)
     */
    paddingStart: (value: number) => ({
      [isRTLActive ? 'paddingRight' : 'paddingLeft']: value,
    }),
    
    /**
     * Padding end (right in LTR, left in RTL)
     */
    paddingEnd: (value: number) => ({
      [isRTLActive ? 'paddingLeft' : 'paddingRight']: value,
    }),

    /**
     * Padding horizontal (both left and right — direction-agnostic)
     */
    paddingHorizontal: (value: number) => ({
      paddingLeft: value,
      paddingRight: value,
    }),
  };
};

/**
 * RTL-aware border utilities
 */
export const getRTLBorder = (rtl?: boolean) => {
  const isRTLActive = rtl !== undefined ? rtl : isRTL();
  
  return {
    /**
     * Border start (left in LTR, right in RTL)
     */
    borderStart: (width: number, color?: string) => ({
      [isRTLActive ? 'borderRightWidth' : 'borderLeftWidth']: width,
      ...(color && { [isRTLActive ? 'borderRightColor' : 'borderLeftColor']: color }),
    }),
    
    /**
     * Border end (right in LTR, left in RTL)
     */
    borderEnd: (width: number, color?: string) => ({
      [isRTLActive ? 'borderLeftWidth' : 'borderRightWidth']: width,
      ...(color && { [isRTLActive ? 'borderLeftColor' : 'borderRightColor']: color }),
    }),
  };
};

/**
 * Transform style object to be RTL-aware
 * Automatically converts margin/padding left/right properties
 */
export const transformRTLStyle = (style: ViewStyle | TextStyle, rtl?: boolean): ViewStyle | TextStyle => {
  const isRTLActive = rtl !== undefined ? rtl : false; // Default to false - manual RTL control
  
  if (!isRTLActive || !style) {
    return style;
  }
  
  const transformedStyle = { ...style };
  
  // Transform margin properties
  if ('marginLeft' in style && 'marginRight' in style) {
    const temp = transformedStyle.marginLeft;
    transformedStyle.marginLeft = transformedStyle.marginRight;
    transformedStyle.marginRight = temp;
  } else if ('marginLeft' in style) {
    transformedStyle.marginRight = transformedStyle.marginLeft;
    delete transformedStyle.marginLeft;
  } else if ('marginRight' in style) {
    transformedStyle.marginLeft = transformedStyle.marginRight;
    delete transformedStyle.marginRight;
  }
  
  // Transform padding properties
  if ('paddingLeft' in style && 'paddingRight' in style) {
    const temp = transformedStyle.paddingLeft;
    transformedStyle.paddingLeft = transformedStyle.paddingRight;
    transformedStyle.paddingRight = temp;
  } else if ('paddingLeft' in style) {
    transformedStyle.paddingRight = transformedStyle.paddingLeft;
    delete transformedStyle.paddingLeft;
  } else if ('paddingRight' in style) {
    transformedStyle.paddingLeft = transformedStyle.paddingRight;
    delete transformedStyle.paddingRight;
  }
  
  // Transform border properties
  if ('borderLeftWidth' in style && 'borderRightWidth' in style) {
    const temp = transformedStyle.borderLeftWidth;
    transformedStyle.borderLeftWidth = transformedStyle.borderRightWidth;
    transformedStyle.borderRightWidth = temp;
  } else if ('borderLeftWidth' in style) {
    transformedStyle.borderRightWidth = transformedStyle.borderLeftWidth;
    delete transformedStyle.borderLeftWidth;
  } else if ('borderRightWidth' in style) {
    transformedStyle.borderLeftWidth = transformedStyle.borderRightWidth;
    delete transformedStyle.borderRightWidth;
  }
  
  // Transform border colors
  if ('borderLeftColor' in style && 'borderRightColor' in style) {
    const temp = transformedStyle.borderLeftColor;
    transformedStyle.borderLeftColor = transformedStyle.borderRightColor;
    transformedStyle.borderRightColor = temp;
  } else if ('borderLeftColor' in style) {
    transformedStyle.borderRightColor = transformedStyle.borderLeftColor;
    delete transformedStyle.borderLeftColor;
  } else if ('borderRightColor' in style) {
    transformedStyle.borderLeftColor = transformedStyle.borderRightColor;
    delete transformedStyle.borderRightColor;
  }
  
  // Transform text alignment
  if ('textAlign' in style) {
    if (style.textAlign === 'left') {
      transformedStyle.textAlign = 'right';
    } else if (style.textAlign === 'right') {
      transformedStyle.textAlign = 'left';
    }
  }
  
  // Transform flex direction
  if ('flexDirection' in style) {
    if (style.flexDirection === 'row') {
      transformedStyle.flexDirection = 'row-reverse';
    } else if (style.flexDirection === 'row-reverse') {
      transformedStyle.flexDirection = 'row';
    }
  }
  
  return transformedStyle;
};

/**
 * RTL-aware style helper for creating responsive styles
 * @param baseStyle - Base style object
 * @param rtlStyle - Style overrides for RTL mode  
 * @param rtl - Optional RTL override
 */
export const createRTLStyle = (
  baseStyle: ViewStyle | TextStyle,
  rtlStyle?: Partial<ViewStyle | TextStyle>,
  rtl?: boolean
): ViewStyle | TextStyle => {
  const isRTLActive = rtl !== undefined ? rtl : false; // Default to false - manual RTL control
  
  if (!isRTLActive) {
    return baseStyle;
  }
  
  // Apply RTL transformations to base style
  const transformedBaseStyle = transformRTLStyle(baseStyle, rtl);
  
  // Merge with explicit RTL overrides
  return {
    ...transformedBaseStyle,
    ...(rtlStyle || {}),
  };
};

/**
 * RTL-aware icon name converter
 * Automatically converts directional icons for RTL mode
 */
export const getRTLIconName = (iconName: string, rtl?: boolean): string => {
  const isRTLActive = rtl !== undefined ? rtl : false; // Default to false when no context provided
  
  if (!isRTLActive) {
    return iconName;
  }
  
  // Arrow icon mappings for RTL
  const arrowMappings: { [key: string]: string } = {
    // Chevron arrows
    'chevron-back': 'chevron-forward',
    'chevron-back-outline': 'chevron-forward-outline',
    'chevron-forward': 'chevron-back', 
    'chevron-forward-outline': 'chevron-back-outline',
    
    // Arrow icons
    'arrow-back': 'arrow-forward',
    'arrow-back-outline': 'arrow-forward-outline',
    'arrow-forward': 'arrow-back',
    'arrow-forward-outline': 'arrow-back-outline',
    
    // Caret arrows  
    'caret-back': 'caret-forward',
    'caret-back-outline': 'caret-forward-outline',
    'caret-forward': 'caret-back',
    'caret-forward-outline': 'caret-back-outline',
    
    // Play/skip arrows
    'play-back': 'play-forward',
    'play-back-outline': 'play-forward-outline', 
    'play-forward': 'play-back',
    'play-forward-outline': 'play-back-outline',
    'play-skip-back': 'play-skip-forward',
    'play-skip-back-outline': 'play-skip-forward-outline',
    'play-skip-forward': 'play-skip-back',
    'play-skip-forward-outline': 'play-skip-back-outline',
    
    // Other directional icons
    'trending-up': 'trending-down', // These might not need RTL flip, but including for completeness
    'trending-down': 'trending-up',
  };
  
  // Return mapped icon or original if no mapping exists
  return arrowMappings[iconName] || iconName;
};

/**
 * Icon direction utilities for RTL
 */
export const getIconDirection = (rtl?: boolean) => {
  const isRTLActive = rtl !== undefined ? rtl : false; // Default to false when no context provided
  
  return {
    /**
     * Get appropriate arrow icon for RTL/LTR
     * @param direction - 'left', 'right', 'back', 'forward'
     */
    getArrowIcon: (direction: 'left' | 'right' | 'back' | 'forward') => {
      if (direction === 'back') {
        return isRTLActive ? 'chevron-forward-outline' : 'chevron-back-outline';
      }
      
      if (direction === 'forward') {
        return isRTLActive ? 'chevron-back-outline' : 'chevron-forward-outline';
      }
      
      if (direction === 'left') {
        return isRTLActive ? 'chevron-forward-outline' : 'chevron-back-outline';
      }
      
      if (direction === 'right') {
        return isRTLActive ? 'chevron-back-outline' : 'chevron-forward-outline';
      }
      
      return 'chevron-back-outline';
    },
  };
};