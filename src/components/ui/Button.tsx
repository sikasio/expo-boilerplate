import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useRTL } from '../../contexts/RTLContext';
import { Text } from './Text';
import { Icon, IconName } from './Icon';
import { getFlexDirection, getRTLMargin, createRTLStyle, getRTLIconName } from '../../utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'outline-white' | 'ghost' | 'success' | 'warning' | 'error' | 'outline-error' | 'outline-warning';
export type ButtonSize = 'xs' | 'small' | 'medium' | 'large' | 'xl';

export interface ButtonProps extends TouchableOpacityProps {
  title?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  // Optional text shown in place of title while loading. Accepted for API
  // parity with other UI kits; ignored if loading is false.
  loadingText?: string;
  disabled?: boolean;
  leftIcon?: IconName;
  rightIcon?: IconName;
  startIcon?: IconName;
  endIcon?: IconName;
  textStyle?: TextStyle;
  iconColor?: string;
  iconStyle?: TextStyle;
}

export function Button({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  loadingText: _loadingText,
  disabled = false,
  leftIcon: leftIconProp,
  rightIcon: rightIconProp,
  startIcon: startIconAlias,
  endIcon: endIconAlias,
  textStyle,
  iconColor,
  iconStyle,
  style,
  onPress,
  ...props
}: ButtonProps) {
  // Accept both `leftIcon`/`rightIcon` and the alias pair `startIcon`/`endIcon`.
  const leftIcon = leftIconProp ?? startIconAlias;
  const rightIcon = rightIconProp ?? endIconAlias;
  const { theme } = useTheme();
  
  const { isRTL } = useRTL();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: getFlexDirection(isRTL),
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
      'outline-white': {
        backgroundColor: 'transparent',
        borderColor: '#FFFFFF',
      },
      'outline-error': {
        backgroundColor: 'transparent',
        borderColor: theme.colors.error,
      },
      'outline-warning': {
        backgroundColor: 'transparent',
        borderColor: theme.colors.warning,
      },
      ghost: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
      },
    };

    const disabledStyle = disabled || loading ? {
      opacity: 0.6,
    } : {};

    const finalStyle = createRTLStyle({
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...disabledStyle,
    }, {}, isRTL);

    return finalStyle;
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
      case 'outline-white':
        return '#FFFFFF';
      case 'outline-error':
        return theme.colors.error;
      case 'outline-warning':
        return theme.colors.warning;
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

  // RTL-aware icon positioning and spacing
  const margin = getRTLMargin(isRTL);
  
  // In RTL mode, we need to swap the visual positions of left and right icons
  const startIcon = isRTL ? rightIcon : leftIcon;   // What appears on the start side
  const endIcon = isRTL ? leftIcon : rightIcon;     // What appears on the end side
  
  // Simple approach: add horizontal margins to text when icons are present
  const textMargins = () => {
    const spacing = theme.sizes.sm;
    const hasStartIcon = Boolean(startIcon);
    const hasEndIcon = Boolean(endIcon);
    
    return {
      marginLeft: hasStartIcon ? spacing : 0,
      marginRight: hasEndIcon ? spacing : 0,
    };
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
          color={iconColor || textStyle?.color || getTextColor()} 
        />
      ) : (
        <>
          {startIcon && (
            <View style={iconStyle as any}>
              <Icon 
                name={getRTLIconName(startIcon, isRTL)} 
                color={(iconColor || textStyle?.color || getTextColor()) as string}
                size={getFontSize()} 
              />
            </View>
          )}
          
          {title && (
            <Text
              // RTL handled internally by Text component
              style={[
                {
                  color: getTextColor(),
                  fontSize: getFontSize(),
                  fontWeight: '600',
                  ...textMargins(), // Add margins for spacing from icons
                },
                textStyle
              ]}
            >
              {title}
            </Text>
          )}
          
          {endIcon && (
            <View style={iconStyle as any}>
              <Icon 
                name={getRTLIconName(endIcon, isRTL)} 
                color={(iconColor || textStyle?.color || getTextColor()) as string}
                size={getFontSize()} 
              />
            </View>
          )}
        </>
      )}
    </TouchableOpacity>
  );
}