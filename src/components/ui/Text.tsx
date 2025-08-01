import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

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

  const getVariantStyle = () => {
    switch (variant) {
      case 'title':
        return {
          fontSize: theme.fontSizes.xxxl,
          fontWeight: 'bold' as const,
          color: color || theme.colors.text,
        };
      case 'subtitle':
        return {
          fontSize: theme.fontSizes.xl,
          fontWeight: '600' as const,
          color: color || theme.colors.text,
        };
      case 'body':
        return {
          fontSize: theme.fontSizes.md,
          fontWeight: 'normal' as const,
          color: color || theme.colors.text,
        };
      case 'caption':
        return {
          fontSize: theme.fontSizes.sm,
          fontWeight: 'normal' as const,
          color: color || theme.colors.textSecondary,
        };
      case 'label':
        return {
          fontSize: theme.fontSizes.sm,
          fontWeight: '500' as const,
          color: color || theme.colors.text,
        };
      default:
        return {
          fontSize: theme.fontSizes.md,
          color: color || theme.colors.text,
        };
    }
  };

  return (
    <RNText
      style={[getVariantStyle(), style]}
      {...props}
    >
      {children}
    </RNText>
  );
}