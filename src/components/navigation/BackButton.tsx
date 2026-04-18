import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { Icon, IconName } from '../ui/Icon';
import { Text } from '../ui/Text';

export type BackButtonVariant = 'icon-only' | 'with-text' | 'text-only';
export type BackButtonSize = 'small' | 'medium' | 'large';

interface BackButtonProps extends Omit<TouchableOpacityProps, 'onPress'> {
  onPress?: () => void;
  variant?: BackButtonVariant;
  size?: BackButtonSize;
  text?: string;
  icon?: IconName;
  canGoBack?: boolean;
  fallbackRoute?: string;
  color?: string;
  showBackground?: boolean;
}

export function BackButton({
  onPress,
  variant = 'icon-only',
  size = 'medium',
  text = 'Back',
  icon = 'chevron-back-outline',
  canGoBack,
  fallbackRoute = '/',
  color,
  showBackground = false,
  style,
  ...props
}: BackButtonProps) {
  const { theme } = useTheme();

  // Determine if we can go back
  const canNavigateBack = canGoBack ?? router.canGoBack();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (canNavigateBack) {
      router.back();
    } else {
      router.replace(fallbackRoute);
    }
  };

  // Get size-based dimensions
  const getSizeDimensions = () => {
    switch (size) {
      case 'small':
        return {
          iconSize: theme.fontSizes.md,
          fontSize: theme.fontSizes.sm,
          padding: theme.sizes.xs,
          minHeight: 32,
          borderRadius: theme.borderRadius.xs,
        };
      case 'large':
        return {
          iconSize: theme.fontSizes.xl,
          fontSize: theme.fontSizes.lg,
          padding: theme.sizes.md,
          minHeight: 48,
          borderRadius: theme.borderRadius.sm,
        };
      default: // medium
        return {
          iconSize: theme.fontSizes.lg,
          fontSize: theme.fontSizes.md,
          padding: theme.sizes.sm,
          minHeight: 40,
          borderRadius: theme.borderRadius.xs,
        };
    }
  };

  const dimensions = getSizeDimensions();
  const buttonColor = color || theme.colors.text;

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: dimensions.minHeight,
    };

    if (showBackground) {
      baseStyle.backgroundColor = theme.colors.surface;
      baseStyle.borderRadius = dimensions.borderRadius;
      baseStyle.paddingHorizontal = dimensions.padding;
      baseStyle.paddingVertical = dimensions.padding / 2;
      
      // Add shadow for elevated appearance
      baseStyle.shadowColor = theme.colors.text;
      baseStyle.shadowOffset = { width: 0, height: 1 };
      baseStyle.shadowOpacity = 0.1;
      baseStyle.shadowRadius = 2;
      baseStyle.elevation = 2;
    } else {
      baseStyle.paddingHorizontal = dimensions.padding / 2;
      baseStyle.paddingVertical = dimensions.padding / 2;
    }

    return baseStyle;
  };

  const renderContent = () => {
    switch (variant) {
      case 'text-only':
        return (
          <Text 
            variant="body" 
            style={{ 
              color: buttonColor, 
              fontSize: dimensions.fontSize,
              fontWeight: '500'
            }}
          >
            {text}
          </Text>
        );
      
      case 'with-text':
        return (
          <>
            <Icon 
              name={icon} 
              size={dimensions.iconSize} 
              color={buttonColor}
              style={{ marginRight: theme.sizes.xs }}
            />
            <Text 
              variant="body" 
              style={{ 
                color: buttonColor, 
                fontSize: dimensions.fontSize,
                fontWeight: '500'
              }}
            >
              {text}
            </Text>
          </>
        );
      
      default: // icon-only
        return (
          <Icon 
            name={icon} 
            size={dimensions.iconSize} 
            color={buttonColor}
          />
        );
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={handlePress}
      activeOpacity={0.7}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}