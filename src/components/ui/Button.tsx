import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  View,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Text } from './Text';
import { Icon, IconName } from './Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'warning' | 'error';
export type ButtonSize = 'xs' | 'small' | 'medium' | 'large' | 'xl';

interface ButtonProps extends TouchableOpacityProps {
  title?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: IconName;
  rightIcon?: IconName;
}

export function Button({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  onPress,
  ...props
}: ButtonProps) {
  const { theme } = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.borderRadius.sm,
      borderWidth: 1,
    };

    const sizeStyles = {
      xs: {
        paddingHorizontal: theme.sizes.sm,
        paddingVertical: theme.sizes.xs,
        minHeight: 28,
      },
      small: {
        paddingHorizontal: theme.sizes.md,
        paddingVertical: theme.sizes.sm,
        minHeight: 32,
      },
      medium: {
        paddingHorizontal: theme.sizes.lg,
        paddingVertical: theme.sizes.md,
        minHeight: 44,
      },
      large: {
        paddingHorizontal: theme.sizes.xl,
        paddingVertical: theme.sizes.lg,
        minHeight: 52,
      },
      xl: {
        paddingHorizontal: theme.sizes.xxl,
        paddingVertical: theme.sizes.xl,
        minHeight: 60,
      },
    };

    const variantStyles = {
      primary: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
      },
      secondary: {
        backgroundColor: theme.colors.secondary,
        borderColor: theme.colors.secondary,
      },
      success: {
        backgroundColor: theme.colors.success,
        borderColor: theme.colors.success,
      },
      warning: {
        backgroundColor: theme.colors.warning,
        borderColor: theme.colors.warning,
      },
      error: {
        backgroundColor: theme.colors.error,
        borderColor: theme.colors.error,
      },
      outline: {
        backgroundColor: 'transparent',
        borderColor: theme.colors.primary,
      },
      ghost: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
      },
    };

    const disabledStyle = disabled || loading ? {
      opacity: 0.6,
    } : {};

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...disabledStyle,
    };
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'success':
      case 'warning':
      case 'error':
        return '#FFFFFF';
      case 'outline':
        return theme.colors.primary;
      case 'ghost':
        return theme.colors.text;
      default:
        return theme.colors.primary;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'xs':
        return theme.fontSizes.xs;
      case 'small':
        return theme.fontSizes.sm;
      case 'medium':
        return theme.fontSizes.md;
      case 'large':
        return theme.fontSizes.lg;
      case 'xl':
        return theme.fontSizes.xl;
      default:
        return theme.fontSizes.md;
    }
  };

  const handlePress = (event: any) => {
    if (!disabled && !loading && onPress) {
      onPress(event);
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={getTextColor()} 
        />
      ) : (
        <>
          {leftIcon && (
            <View style={{ marginRight: title ? theme.sizes.sm : 0 }}>
              <Icon 
                name={leftIcon} 
                color={getTextColor()} 
                size={getFontSize()} 
              />
            </View>
          )}
          
          {title && (
            <Text
              style={{
                color: getTextColor(),
                fontSize: getFontSize(),
                fontWeight: '600',
              }}
            >
              {title}
            </Text>
          )}
          
          {rightIcon && (
            <View style={{ marginLeft: title ? theme.sizes.sm : 0 }}>
              <Icon 
                name={rightIcon} 
                color={getTextColor()} 
                size={getFontSize()} 
              />
            </View>
          )}
        </>
      )}
    </TouchableOpacity>
  );
}