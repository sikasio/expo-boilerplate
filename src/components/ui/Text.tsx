import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet, Platform } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useRTL } from '@/contexts/RTLContext';
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

  const getVariantStyle = () => {
    // Helper function to get Android-specific lineHeight
    const getLineHeight = (fontSize: number) => {
      if (Platform.OS === 'android') {
        return fontSize * 1.2; // Reduced lineHeight for Android (20% of fontSize)
      }
      return fontSize * 1.2; // Standard lineHeight for iOS (40% of fontSize)
    };

    const baseStyle = {
      fontSize: theme.fontSizes.md,
      lineHeight: getLineHeight(theme.fontSizes.md),
      color: color || theme.colors.text,
    };

    switch (variant) {
      case 'title':
        return {
          ...baseStyle,
          fontSize: theme.fontSizes.xxxl,
          lineHeight: getLineHeight(theme.fontSizes.xxxl),
          fontWeight: 'bold' as const,
          color: color || theme.colors.text,
        };
      case 'subtitle':
        return {
          ...baseStyle,
          fontSize: theme.fontSizes.xl,
          lineHeight: getLineHeight(theme.fontSizes.xl),
          fontWeight: '600' as const,
          color: color || theme.colors.text,
        };
      case 'body':
        return {
          ...baseStyle,
          fontSize: theme.fontSizes.md,
          lineHeight: getLineHeight(theme.fontSizes.md),
          fontWeight: 'normal' as const,
          color: color || theme.colors.text,
        };
      case 'caption':
        return {
          ...baseStyle,
          fontSize: theme.fontSizes.sm,
          lineHeight: getLineHeight(theme.fontSizes.sm),
          fontWeight: 'normal' as const,
          color: color || theme.colors.textSecondary,
        };
      case 'label':
        return {
          ...baseStyle,
          fontSize: theme.fontSizes.sm,
          lineHeight: getLineHeight(theme.fontSizes.sm),
          fontWeight: '500' as const,
          color: color || theme.colors.text,
        };
      default:
        return baseStyle;
    }
  };

  const variantStyle = getVariantStyle();

  // Always apply RTL-aware text alignment and writing direction
  const rtlTextAlign = getTextAlign(isRTL);
  const rtlWritingDirection = isRTL ? 'rtl' : 'ltr';

  // Create the final style array
  const styleArray = [
    variantStyle,
    {
      textAlign: rtlTextAlign,
      writingDirection: rtlWritingDirection
    }, // RTL-aware default alignment and writing direction
    style // User styles can still override if needed
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