import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet, Platform } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useRTL } from '@/contexts/RTLContext';
import { useFont } from '@/contexts/FontContext';
import { getTextAlign, createRTLStyle } from '@/utils';

type TextVariant = 'title' | 'subtitle' | 'body' | 'caption' | 'label';

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
  children: React.ReactNode;
}

export function Text({
  variant = 'body',
  color,
  style,
  children,
  ...props
}: TextProps) {
  const { theme } = useTheme();
  const { isRTL } = useRTL();

  // Try to use FontContext, fallback to theme if not available
  let getFontStyle, fontSizes, lineHeightMultiplier, fontFamily;
  try {
    const fontContext = useFont();
    getFontStyle = fontContext.getFontStyle;
    fontSizes = fontContext.fontSizes;
    lineHeightMultiplier = fontContext.lineHeightMultiplier;
    fontFamily = fontContext.fontFamily;
  } catch (error) {
    // FontContext not available, use theme defaults
    getFontStyle = () => ({});
    fontSizes = theme.fontSizes;
    lineHeightMultiplier = 1.2;
    fontFamily = null;
  }

  // Extract fontWeight and italic from user styles
  const { requestedFontWeight, isItalic } = React.useMemo(() => {
    if (!style) return { requestedFontWeight: null, isItalic: false };

    // Handle both single style object and style arrays
    const styleArray = Array.isArray(style) ? style : [style];

    // Check for italic
    const hasItalic = styleArray.some(s => s && typeof s === 'object' && s.fontStyle === 'italic');

    // Check for fontWeight
    let weight = null;
    for (const s of styleArray) {
      if (s && typeof s === 'object' && s.fontWeight) {
        const fw = s.fontWeight;
        if (fw === 'bold' || fw === '700') weight = 'bold';
        else if (fw === '600') weight = 'semiBold';
        else if (fw === '500') weight = 'medium';
        else if (fw === '300') weight = 'light';
        else if (fw === '200') weight = 'extraLight';
        else if (fw === '100') weight = 'thin';
        break;
      }
    }

    return { requestedFontWeight: weight, isItalic: hasItalic };
  }, [style]);

  // Helper to get the best available font weight
  const getAvailableFontWeight = (variantWeight: string, requestedWeight: string | null) => {
    // If no FontContext, just use variant weight
    if (!fontFamily) return variantWeight;

    // Determine the final weight to try
    const finalWeight = requestedWeight || variantWeight;

    // Check if the font family has this weight
    const hasWeight = fontFamily.weights[finalWeight as keyof typeof fontFamily.weights];

    if (hasWeight) {
      return finalWeight;
    }

    // Fallback: try to find the closest available weight
    const availableWeights = Object.keys(fontFamily.weights);

    // Weight hierarchy for fallbacks
    const weightHierarchy = {
      'thin': ['extraLight', 'light', 'regular'],
      'extraLight': ['thin', 'light', 'regular'],
      'light': ['extraLight', 'regular', 'thin'],
      'regular': ['medium', 'light', 'bold'],
      'medium': ['regular', 'semiBold', 'light'],
      'semiBold': ['medium', 'bold', 'regular'],
      'bold': ['semiBold', 'extraBold', 'medium', 'regular'],
      'extraBold': ['bold', 'black', 'semiBold'],
      'black': ['extraBold', 'bold', 'semiBold'],
    };

    // Try fallbacks for the requested weight
    const fallbacks = weightHierarchy[finalWeight as keyof typeof weightHierarchy] || ['regular'];

    for (const fallback of fallbacks) {
      if (availableWeights.includes(fallback)) {
        return fallback;
      }
    }

    // Last resort: use any available weight
    return availableWeights[0] || 'regular';
  };

  const getVariantStyle = () => {
    // Use font context line height multiplier (unchanged)
    const getLineHeight = (fontSize: number) => {
      return fontSize * lineHeightMultiplier;
    };

    // iOS-specific padding to prevent text clipping at the top
    const getIOSPaddingTop = (fontSize: number) => {
      return Platform.OS === 'ios' ? Math.max(0.2, fontSize * 0.05) : 0;
    };

    const baseStyle = {
      fontSize: fontSizes.md,
      lineHeight: getLineHeight(fontSizes.md),
      color: color || theme.colors.text,
      ...(Platform.OS === 'ios' && {
        paddingTop: getIOSPaddingTop(fontSizes.md),
        includeFontPadding: false, // iOS-specific fix for text clipping
      }),
    };

    switch (variant) {
      case 'title':
        const titleWeight = getAvailableFontWeight('bold', requestedFontWeight);
        return {
          ...baseStyle,
          ...getFontStyle(titleWeight, isItalic),
          fontSize: fontSizes.xxxl,
          lineHeight: getLineHeight(fontSizes.lg), // Keep original lineHeight logic
          color: color || theme.colors.text,
          ...(Platform.OS === 'ios' && {
            paddingTop: getIOSPaddingTop(fontSizes.xxxl),
            includeFontPadding: false,
          }),
        };
      case 'subtitle':
        const subtitleWeight = getAvailableFontWeight('medium', requestedFontWeight);
        return {
          ...baseStyle,
          ...getFontStyle(subtitleWeight, isItalic),
          fontSize: fontSizes.xl,
          lineHeight: getLineHeight(fontSizes.lg), // Keep original lineHeight logic
          color: color || theme.colors.text,
          ...(Platform.OS === 'ios' && {
            paddingTop: getIOSPaddingTop(fontSizes.xl),
            includeFontPadding: false,
          }),
        };
      case 'body':
        const bodyWeight = getAvailableFontWeight('regular', requestedFontWeight);
        return {
          ...baseStyle,
          ...getFontStyle(bodyWeight, isItalic),
          fontSize: fontSizes.md,
          lineHeight: getLineHeight(fontSizes.sm), // Keep original lineHeight logic
          color: color || theme.colors.text,
          ...(Platform.OS === 'ios' && {
            paddingTop: getIOSPaddingTop(fontSizes.md),
            includeFontPadding: false,
          }),
        };
      case 'caption':
        const captionWeight = getAvailableFontWeight('regular', requestedFontWeight);
        return {
          ...baseStyle,
          ...getFontStyle(captionWeight, isItalic),
          fontSize: fontSizes.sm,
          lineHeight: getLineHeight(fontSizes.xs), // Keep original lineHeight logic
          color: color || theme.colors.textSecondary,
          ...(Platform.OS === 'ios' && {
            paddingTop: getIOSPaddingTop(fontSizes.sm),
            includeFontPadding: false,
          }),
        };
      case 'label':
        const labelWeight = getAvailableFontWeight('medium', requestedFontWeight);
        return {
          ...baseStyle,
          ...getFontStyle(labelWeight, isItalic),
          fontSize: fontSizes.sm,
          lineHeight: getLineHeight(fontSizes.sm), // Keep original lineHeight logic
          color: color || theme.colors.text,
          ...(Platform.OS === 'ios' && {
            paddingTop: getIOSPaddingTop(fontSizes.sm),
            includeFontPadding: false,
          }),
        };
      default:
        const defaultWeight = getAvailableFontWeight('regular', requestedFontWeight);
        return {
          ...baseStyle,
          ...getFontStyle(defaultWeight, isItalic),
        };
    }
  };

  const variantStyle = getVariantStyle();

  // Always apply RTL-aware text alignment and writing direction
  const rtlTextAlign = getTextAlign(isRTL);
  const rtlWritingDirection = isRTL ? 'rtl' : 'ltr';

  // Process user styles to remove fontStyle and fontWeight since they're handled by FontContext
  const processedUserStyles = React.useMemo(() => {
    if (!style) return undefined;

    const styleArray = Array.isArray(style) ? style : [style];
    return styleArray.map(s => {
      if (s && typeof s === 'object') {
        // Remove fontStyle and fontWeight since they're handled by FontContext
        const { fontStyle, fontWeight, ...restStyle } = s;
        return restStyle;
      }
      return s;
    });
  }, [style]);

  // Create the final style array
  const styleArray = [
    variantStyle,
    {
      textAlign: rtlTextAlign,
      writingDirection: rtlWritingDirection
    }, // RTL-aware default alignment and writing direction
    processedUserStyles // User styles with fontStyle: 'italic' removed
  ];

  return (
    <RNText
      style={styleArray}
      {...props}
    >
      {children}
    </RNText>
  );
}