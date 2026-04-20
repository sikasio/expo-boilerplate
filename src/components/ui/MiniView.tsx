import React from 'react';
import { View as RNView, ViewProps as RNViewProps, ViewStyle } from 'react-native';
import { useRTL } from '../../contexts/RTLContext';
import { getFlexDirection, getRTLMargin, createRTLStyle } from '../../utils';

/**
 * RTL-Aware MiniView Component
 * 
 * A wrapper around React Native's View component with opt-in RTL (Right-to-Left) support.
 * Only applies RTL transformations when explicitly requested through props.
 * When enableRTL is active, only direction-related properties are overridden (flexDirection, margins, padding, positioning).
 * All other style properties (colors, sizes, backgrounds, etc.) are preserved.
 * Reads RTL configuration from the global RTLContext when enabled.
 * 
 * @example
 * // Basic MiniView (no RTL applied by default)
 * <MiniView>
 *   <Text>Regular LTR content</Text>
 * </MiniView>
 * 
 * @example
 * // Enable RTL from global context - only overrides direction properties
 * <MiniView enableRTL style={{ flexDirection: 'row', backgroundColor: 'red' }}>
 *   <Text>flexDirection becomes 'row-reverse', backgroundColor preserved</Text>
 * </MiniView>
 * 
 * @example
 * // Force RTL regardless of context
 * <MiniView forceRTL>
 *   <Text>Always RTL</Text>
 * </MiniView>
 * 
 * @example
 * // Force LTR regardless of context
 * <MiniView forceLTR>
 *   <Text>Always LTR</Text>
 * </MiniView>
 * 
 * @example
 * // RTL-aware styling - only direction properties are overridden
 * <MiniView 
 *   enableRTL
 *   style={{ 
 *     flexDirection: 'row',     // Overridden: becomes 'row-reverse' in RTL
 *     marginLeft: 8,           // Overridden: swapped with marginRight in RTL
 *     backgroundColor: 'blue', // Preserved: not direction-related
 *     height: 100             // Preserved: not direction-related
 *   }}
 * >
 *   <Text>Direction properties overridden, others preserved</Text>
 * </MiniView>
 */

interface RTLMiniViewProps extends RNViewProps {
  children?: React.ReactNode;
  
  // RTL-aware style props
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  marginLeft?: number;
  marginRight?: number;
  paddingLeft?: number;
  paddingRight?: number;
  marginStart?: number;
  marginEnd?: number;
  paddingStart?: number;
  paddingEnd?: number;
  
  // RTL-aware positioning
  left?: number;
  right?: number;
  alignItems?: ViewStyle['alignItems'];
  justifyContent?: ViewStyle['justifyContent'];
  
  // RTL control - only applies RTL when explicitly requested
  enableRTL?: boolean; // When true, applies RTL transformations from context
  forceRTL?: boolean; // When true, forces RTL behavior regardless of context
  forceLTR?: boolean; // When true, forces LTR behavior regardless of context
}

export function MiniView({
  children,
  style,
  flexDirection,
  marginLeft,
  marginRight,
  paddingLeft,
  paddingRight,
  marginStart,
  marginEnd,
  paddingStart,
  paddingEnd,
  left,
  right,
  alignItems,
  justifyContent,
  enableRTL = false,
  forceRTL = false,
  forceLTR = false,
  ...props
}: RTLMiniViewProps) {
  const { isRTL } = useRTL();
  
  // Determine RTL behavior based on props
  const shouldApplyRTL = forceLTR ? false : 
                        forceRTL ? true : 
                        enableRTL ? isRTL : 
                        false; // Default to no RTL unless explicitly enabled

  // Process passed style to extract RTL-relevant properties
  const styleArray = (Array.isArray(style) ? style : [style]) as any[];
  const flattenedStyle = styleArray.reduce((acc: any, styleItem: any) => {
    if (styleItem && typeof styleItem === 'object' && !Array.isArray(styleItem)) {
      return { ...acc, ...styleItem };
    }
    return acc;
  }, {} as ViewStyle);

  // Create RTL-aware styles
  const rtlAwareStyle: ViewStyle = {};

  // Handle flex direction - enableRTL overrides style flexDirection
  if (enableRTL && shouldApplyRTL) {
    // When enableRTL is true, override flexDirection from style with RTL-aware version
    const originalFlexDirection = flexDirection || flattenedStyle.flexDirection || 'column';
    rtlAwareStyle.flexDirection = getFlexDirection(originalFlexDirection as any);
  } else if (flexDirection) {
    rtlAwareStyle.flexDirection = flexDirection;
  }

  // Handle margins — swap left/right when RTL is active.
  // (Prior impl called getRTLMargin() with the wrong shape; utility returns
  // marginStart/marginEnd helpers, not {left, right}.)
  const swapLR = (left: number, right: number): { left: number; right: number } =>
    shouldApplyRTL ? { left: right, right: left } : { left, right };

  if (enableRTL && shouldApplyRTL) {
    const styleMarginLeft = marginLeft !== undefined ? marginLeft : (flattenedStyle.marginLeft as number) || 0;
    const styleMarginRight = marginRight !== undefined ? marginRight : (flattenedStyle.marginRight as number) || 0;
    const m = swapLR(styleMarginLeft, styleMarginRight);
    rtlAwareStyle.marginLeft = m.left;
    rtlAwareStyle.marginRight = m.right;
  } else if (marginLeft !== undefined || marginRight !== undefined) {
    const m = swapLR(marginLeft || 0, marginRight || 0);
    rtlAwareStyle.marginLeft = m.left;
    rtlAwareStyle.marginRight = m.right;
  }

  // Handle padding same as margins.
  if (enableRTL && shouldApplyRTL) {
    const stylePaddingLeft = paddingLeft !== undefined ? paddingLeft : (flattenedStyle.paddingLeft as number) || 0;
    const stylePaddingRight = paddingRight !== undefined ? paddingRight : (flattenedStyle.paddingRight as number) || 0;
    const p = swapLR(stylePaddingLeft, stylePaddingRight);
    rtlAwareStyle.paddingLeft = p.left;
    rtlAwareStyle.paddingRight = p.right;
  } else if (paddingLeft !== undefined || paddingRight !== undefined) {
    const p = swapLR(paddingLeft || 0, paddingRight || 0);
    rtlAwareStyle.paddingLeft = p.left;
    rtlAwareStyle.paddingRight = p.right;
  }

  // Handle logical properties (start/end)
  if (marginStart !== undefined) {
    rtlAwareStyle[shouldApplyRTL ? 'marginRight' : 'marginLeft'] = marginStart;
  }
  if (marginEnd !== undefined) {
    rtlAwareStyle[shouldApplyRTL ? 'marginLeft' : 'marginRight'] = marginEnd;
  }
  if (paddingStart !== undefined) {
    rtlAwareStyle[shouldApplyRTL ? 'paddingRight' : 'paddingLeft'] = paddingStart;
  }
  if (paddingEnd !== undefined) {
    rtlAwareStyle[shouldApplyRTL ? 'paddingLeft' : 'paddingRight'] = paddingEnd;
  }

  // Handle positioning - enableRTL overrides style positioning
  if (enableRTL && shouldApplyRTL) {
    // Override positioning from style when enableRTL is active
    const styleLeft = left !== undefined ? left : flattenedStyle.left;
    const styleRight = right !== undefined ? right : flattenedStyle.right;
    
    if (styleLeft !== undefined) {
      rtlAwareStyle.right = styleLeft;
      rtlAwareStyle.left = undefined;
    }
    if (styleRight !== undefined) {
      rtlAwareStyle.left = styleRight;
      rtlAwareStyle.right = undefined;
    }
  } else {
    // Standard positioning when enableRTL is not active or RTL is disabled
    if (left !== undefined && shouldApplyRTL) {
      rtlAwareStyle.right = left;
      rtlAwareStyle.left = undefined;
    } else if (left !== undefined) {
      rtlAwareStyle.left = left;
    }
    
    if (right !== undefined && shouldApplyRTL) {
      rtlAwareStyle.left = right;
      rtlAwareStyle.right = undefined;
    } else if (right !== undefined) {
      rtlAwareStyle.right = right;
    }
  }

  // Handle alignment
  if (alignItems) {
    rtlAwareStyle.alignItems = alignItems;
  }
  if (justifyContent) {
    rtlAwareStyle.justifyContent = justifyContent;
  }

  // Apply RTL transformation only to direction-related properties
  let processedStyle: any = style;
  
  if (enableRTL && shouldApplyRTL) {
    // When enableRTL is active, only remove direction-related properties from style
    // All other properties (colors, sizes, backgrounds, etc.) should be preserved
    if (style) {
      const styleArray = Array.isArray(style) ? style : [style];
      processedStyle = styleArray.map((styleItem: any) => {
        if (styleItem && typeof styleItem === 'object' && !Array.isArray(styleItem)) {
          const {
            flexDirection: _,
            marginLeft: __,
            marginRight: ___,
            paddingLeft: ____,
            paddingRight: _____,
            left: ______,
            right: _______,
            ...preservedStyle
          } = styleItem;
          return preservedStyle;
        }
        return styleItem;
      });
    }
  } else if (shouldApplyRTL) {
    // createRTLStyle is (baseStyle, rtlStyle?, rtl?) — pass the rtl flag as arg 3.
    processedStyle = createRTLStyle(style as ViewStyle, undefined, shouldApplyRTL);
  }

  return (
    <RNView
      {...props}
      style={[
        processedStyle,  // Base style (cleaned of overridden properties when enableRTL is active)
        rtlAwareStyle,   // RTL-aware overrides (takes precedence)
      ]}
    >
      {children}
    </RNView>
  );
}

// Export type for external use
export type MiniViewProps = RTLMiniViewProps;

/**
 * Default MiniView export for easy replacement of React Native's View
 * Can be used as a drop-in replacement for React Native View.
 * RTL support is opt-in through props (enableRTL, forceRTL, forceLTR).
 */
export default MiniView;