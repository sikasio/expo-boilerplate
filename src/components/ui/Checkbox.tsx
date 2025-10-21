import React, { useRef, useEffect } from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
  View,
  Animated,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useRTL } from '@/contexts/RTLContext';
import { Text } from './Text';
import { Icon, IconName } from './Icon';
import { getFlexDirection, getRTLMargin } from '@/utils';

export type CheckboxVariant = 'default' | 'success' | 'warning' | 'error';
export type CheckboxSize = 'small' | 'medium' | 'large';

interface CheckboxProps extends Omit<TouchableOpacityProps, 'onPress'> {
  checked?: boolean;
  indeterminate?: boolean;
  label?: string | React.ReactNode;
  description?: string;
  variant?: CheckboxVariant;
  size?: CheckboxSize;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  onPress?: (checked: boolean) => void;
  labelStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  checkboxStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  checkedIcon?: IconName;
  uncheckedIcon?: IconName;
  indeterminateIcon?: IconName;
  animate?: boolean;
}

export function Checkbox({
  checked = false,
  indeterminate = false,
  label,
  description,
  variant = 'default',
  size = 'medium',
  disabled = false,
  error,
  required = false,
  onPress,
  labelStyle,
  descriptionStyle,
  checkboxStyle,
  containerStyle,
  checkedIcon = 'checkmark',
  uncheckedIcon,
  indeterminateIcon = 'remove',
  animate = true,
  style,
  ...props
}: CheckboxProps) {
  const { theme } = useTheme();
  
  const { isRTL } = useRTL();
  const scaleAnimation = useRef(new Animated.Value(checked || indeterminate ? 1 : 0.8)).current;
  const opacityAnimation = useRef(new Animated.Value(checked || indeterminate ? 1 : 0)).current;

  useEffect(() => {
    if (animate) {
      const toValue = checked || indeterminate ? 1 : 0;
      const scaleValue = checked || indeterminate ? 1 : 0.8;
      
      Animated.parallel([
        Animated.spring(scaleAnimation, {
          toValue: scaleValue,
          useNativeDriver: true,
          tension: 300,
          friction: 10,
        }),
        Animated.timing(opacityAnimation, {
          toValue,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnimation.setValue(checked || indeterminate ? 1 : 0.8);
      opacityAnimation.setValue(checked || indeterminate ? 1 : 0);
    }
  }, [checked, indeterminate, animate]);

  const getSizeConfig = () => {
    switch (size) {
      case 'small':
        return {
          checkboxSize: 16,
          iconSize: 12,
          fontSize: theme.fontSizes.sm,
          spacing: theme.sizes.xs,
          borderRadius: theme.borderRadius.xs,
        };
      case 'large':
        return {
          checkboxSize: 28,
          iconSize: 20,
          fontSize: theme.fontSizes.lg,
          spacing: theme.sizes.md,
          borderRadius: theme.borderRadius.sm,
        };
      default: // medium
        return {
          checkboxSize: 20,
          iconSize: 16,
          fontSize: theme.fontSizes.md,
          spacing: theme.sizes.sm,
          borderRadius: theme.borderRadius.xs,
        };
    }
  };

  const getVariantColors = () => {
    const baseColors = {
      default: {
        checked: theme.colors.primary,
        unchecked: 'transparent',
        border: theme.colors.border,
        checkedBorder: theme.colors.primary,
        icon: '#FFFFFF',
        text: theme.colors.text,
      },
      success: {
        checked: theme.colors.success,
        unchecked: 'transparent',
        border: theme.colors.border,
        checkedBorder: theme.colors.success,
        icon: '#FFFFFF',
        text: theme.colors.text,
      },
      warning: {
        checked: theme.colors.warning,
        unchecked: 'transparent',
        border: theme.colors.border,
        checkedBorder: theme.colors.warning,
        icon: '#FFFFFF',
        text: theme.colors.text,
      },
      error: {
        checked: theme.colors.error,
        unchecked: 'transparent',
        border: theme.colors.border,
        checkedBorder: theme.colors.error,
        icon: '#FFFFFF',
        text: theme.colors.text,
      },
    };

    if (error) {
      return {
        ...baseColors[variant],
        border: theme.colors.error,
        text: theme.colors.error,
      };
    }

    return baseColors[variant];
  };

  const sizeConfig = getSizeConfig();
  const colors = getVariantColors();

  const handlePress = () => {
    if (!disabled && onPress) {
      onPress(!checked);
    }
  };

  const getCheckboxStyle = (): ViewStyle => {
    const isCheckedOrIndeterminate = checked || indeterminate;
    
    return {
      width: sizeConfig.checkboxSize,
      height: sizeConfig.checkboxSize,
      borderRadius: sizeConfig.borderRadius,
      borderWidth: 2,
      borderColor: isCheckedOrIndeterminate ? colors.checkedBorder : colors.border,
      backgroundColor: isCheckedOrIndeterminate ? colors.checked : colors.unchecked,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: disabled ? 0.6 : 1,
      ...checkboxStyle,
    };
  };

  const getLabelStyle = (): TextStyle => {
    return {
      color: disabled ? theme.colors.textSecondary : colors.text,
      fontSize: sizeConfig.fontSize,
      fontWeight: '500',
      flex: 1,
      ...labelStyle,
    };
  };

  const getDescriptionStyle = (): TextStyle => {
    return {
      color: disabled ? theme.colors.textSecondary : theme.colors.textSecondary,
      fontSize: sizeConfig.fontSize - 2,
      marginTop: 2,
      flex: 1,
      ...descriptionStyle,
    };
  };

  const renderIcon = () => {
    let iconName: IconName;
    
    if (indeterminate) {
      iconName = indeterminateIcon;
    } else if (checked) {
      iconName = checkedIcon;
    } else if (uncheckedIcon) {
      iconName = uncheckedIcon;
    } else {
      return null;
    }

    return (
      <Animated.View
        style={{
          transform: [{ scale: scaleAnimation }],
          opacity: opacityAnimation,
        }}
      >
        <Icon
          name={iconName}
          size={sizeConfig.iconSize}
          color={colors.icon}
        />
      </Animated.View>
    );
  };

  const renderContent = () => {
    if (!label && !description) return null;

    const margin = getRTLMargin(isRTL);

    return (
      <View style={[{ flex: 1 }, margin.marginStart(sizeConfig.spacing)]}>
        {label && (
          <View style={{ flexDirection: getFlexDirection(isRTL), alignItems: 'center' }}>
            {typeof label === 'string' ? (
              <Text style={getLabelStyle()}>
                {label}
              </Text>
            ) : (
              <View style={{ flex: 1 }}>
                {label}
              </View>
            )}
            {required && (
              <Text style={[{ color: theme.colors.error }, margin.marginStart(2)]}>
                *
              </Text>
            )}
          </View>
        )}
        {description && (
          <Text style={getDescriptionStyle()}>
            {description}
          </Text>
        )}
        {error && (
          <Text style={{
            color: theme.colors.error,
            fontSize: sizeConfig.fontSize - 2,
            marginTop: 2,
          }}>
            {error}
          </Text>
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[
        {
          flexDirection: getFlexDirection(isRTL),
          alignItems: 'flex-start',
          opacity: disabled ? 0.6 : 1,
        },
        containerStyle,
        style,
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      {...props}
    >
      <View style={getCheckboxStyle()}>
        {renderIcon()}
      </View>
      {renderContent()}
    </TouchableOpacity>
  );
}