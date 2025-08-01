import React from 'react';
import {
  View,
  ViewProps,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export function Card({
  children,
  onPress,
  variant = 'default',
  padding = 'medium',
  style,
  ...props
}: CardProps) {
  const { theme } = useTheme();

  const getCardStyle = () => {
    const baseStyle = {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.sizes.md,
    };

    const paddingStyles = {
      none: {},
      small: { padding: theme.sizes.sm },
      medium: { padding: theme.sizes.md },
      large: { padding: theme.sizes.lg },
    };

    const variantStyles = {
      default: {
        ...baseStyle,
      },
      elevated: {
        ...baseStyle,
        shadowColor: theme.colors.text,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      outlined: {
        ...baseStyle,
        borderWidth: 1,
        borderColor: theme.colors.border,
      },
    };

    return {
      ...variantStyles[variant],
      ...paddingStyles[padding],
    };
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={[getCardStyle(), style]}
        onPress={onPress}
        activeOpacity={0.8}
        {...(props as TouchableOpacityProps)}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[getCardStyle(), style]} {...props}>
      {children}
    </View>
  );
}