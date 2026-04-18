import React, { useState, useEffect } from 'react';
import { View, ViewStyle, Platform } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useRTL } from '../../contexts/RTLContext';
import { Text } from './Text';
import { Icon, IconName } from './Icon';
import { getFlexDirection, getRTLMargin, createRTLStyle } from '../../utils';

export type CountdownTimerVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
export type CountdownTimerSize = 'xs' | 'small' | 'medium' | 'large' | 'xl';
export type CountdownTimerColorScheme = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost';

interface CountdownTimerProps {
  // Core functionality
  targetTime: Date;
  onExpire?: () => void;
  
  // Appearance
  variant?: CountdownTimerVariant;
  size?: CountdownTimerSize;
  colorScheme?: CountdownTimerColorScheme;
  
  // Content options
  showIcon?: boolean;
  showMilliseconds?: boolean;
  expiredText?: string;
  
  // Icons
  icon?: IconName;
  warningIcon?: IconName;
  dangerIcon?: IconName;
  expiredIcon?: IconName;
  
  // Thresholds (in seconds)
  warningThreshold?: number;
  dangerThreshold?: number;
  
  // Visual customization
  animated?: boolean;
  bordered?: boolean;
  disabled?: boolean;
  
  // Layout
  direction?: 'horizontal' | 'vertical';
  alignment?: 'left' | 'center' | 'right';
  
  // Colors override
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  iconColor?: string;
  
  // Styles
  style?: ViewStyle;
  textStyle?: any;
  iconStyle?: any;
  containerStyle?: ViewStyle;
  
  // Accessibility
  accessibilityLabel?: string;
  testID?: string;
}

export function CountdownTimer({
  targetTime,
  onExpire,
  variant = 'default',
  size = 'medium',
  colorScheme = 'default',
  showIcon = true,
  showMilliseconds = false,
  expiredText = 'انتهت',
  icon = 'timer-outline',
  warningIcon = 'warning-outline',
  dangerIcon = 'alert-circle-outline',
  expiredIcon = 'time-outline',
  warningThreshold = 30,
  dangerThreshold = 15,
  animated = true,
  bordered = true,
  disabled = false,
  direction = 'horizontal',
  alignment = 'center',
  textColor,
  backgroundColor,
  borderColor,
  iconColor,
  style,
  textStyle,
  iconStyle,
  containerStyle,
  accessibilityLabel,
  testID,
}: CountdownTimerProps) {
  const { theme } = useTheme();
  const { isRTL } = useRTL();
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    // Check if targetTime is valid
    if (!targetTime || isNaN(targetTime.getTime())) {
      setTimeRemaining(0);
      setIsExpired(true);
      return;
    }

    const updateTimer = () => {
      const now = new Date();
      const remaining = targetTime.getTime() - now.getTime();
      
      if (remaining <= 0) {
        setTimeRemaining(0);
        if (!isExpired) {
          setIsExpired(true);
          onExpire?.();
        }
        return;
      }
      
      setTimeRemaining(remaining);
    };

    // Reset expired state when targetTime changes
    setIsExpired(false);

    // Update immediately
    updateTimer();
    
    // Update every second (or 100ms if showing milliseconds)
    const interval = setInterval(updateTimer, showMilliseconds ? 100 : 1000);
    
    return () => clearInterval(interval);
  }, [targetTime, onExpire, showMilliseconds]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.ceil(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    if (showMilliseconds && totalSeconds < 10) {
      const ms = Math.floor((milliseconds % 1000) / 100);
      return `${seconds}.${ms}ث`;
    }
    
    return `${seconds}ث`;
  };

  const getTimerState = () => {
    const seconds = Math.ceil(timeRemaining / 1000);
    
    if (isExpired || seconds <= 0) {
      return 'expired';
    } else if (seconds <= dangerThreshold) {
      return 'danger';
    } else if (seconds <= warningThreshold) {
      return 'warning';
    }
    return 'normal';
  };

  const getColors = () => {
    const state = getTimerState();
    
    // Use colorScheme if provided, otherwise determine by state
    let baseColorScheme = colorScheme;
    if (colorScheme === 'default') {
      switch (state) {
        case 'expired':
          baseColorScheme = 'ghost';
          break;
        case 'danger':
          baseColorScheme = 'error';
          break;
        case 'warning':
          baseColorScheme = 'warning';
          break;
        default:
          baseColorScheme = 'primary';
      }
    }

    const colors = {
      primary: { bg: theme.colors.primary, text: theme.colors.primary, border: theme.colors.primary },
      secondary: { bg: theme.colors.secondary, text: theme.colors.secondary, border: theme.colors.secondary },
      success: { bg: theme.colors.success, text: theme.colors.success, border: theme.colors.success },
      warning: { bg: theme.colors.warning, text: theme.colors.warning, border: theme.colors.warning },
      error: { bg: theme.colors.error, text: theme.colors.error, border: theme.colors.error },
      ghost: { bg: theme.colors.surface, text: theme.colors.textSecondary, border: theme.colors.border },
      default: { bg: theme.colors.surface, text: theme.colors.text, border: theme.colors.border },
    };

    const colorSet = colors[baseColorScheme as keyof typeof colors];
    
    return {
      text: textColor || colorSet.text,
      background: backgroundColor || (variant === 'default' ? colorSet.bg + '15' : colorSet.bg),
      border: borderColor || colorSet.border,
      icon: iconColor || colorSet.text,
    };
  };

  const getSizes = () => {
    const sizes = {
      xs: {
        paddingHorizontal: theme.sizes.xs,
        paddingVertical: theme.sizes.xs / 2,
        fontSize: theme.fontSizes.xs,
        iconSize: 10,
        minHeight: 20,
        borderRadius: theme.borderRadius.xs,
      },
      small: {
        paddingHorizontal: theme.sizes.sm,
        paddingVertical: theme.sizes.xs,
        fontSize: theme.fontSizes.sm,
        iconSize: 14,
        minHeight: 24,
        borderRadius: theme.borderRadius.sm,
      },
      medium: {
        paddingHorizontal: theme.sizes.md,
        paddingVertical: theme.sizes.sm,
        fontSize: theme.fontSizes.md,
        iconSize: 16,
        minHeight: 32,
        borderRadius: theme.borderRadius.md,
      },
      large: {
        paddingHorizontal: theme.sizes.lg,
        paddingVertical: theme.sizes.md,
        fontSize: theme.fontSizes.lg,
        iconSize: 20,
        minHeight: 40,
        borderRadius: theme.borderRadius.md,
      },
      xl: {
        paddingHorizontal: theme.sizes.xl,
        paddingVertical: theme.sizes.lg,
        fontSize: theme.fontSizes.xl,
        iconSize: 24,
        minHeight: 48,
        borderRadius: theme.borderRadius.lg,
      },
    };

    return sizes[size];
  };

  const getCurrentIcon = () => {
    const state = getTimerState();
    switch (state) {
      case 'expired':
        return expiredIcon;
      case 'danger':
        return dangerIcon;
      case 'warning':
        return warningIcon;
      default:
        return icon;
    }
  };

  const colors = getColors();
  const sizeConfig = getSizes();
  const currentIcon = getCurrentIcon();
  const timerState = getTimerState();
  // Check if targetTime is valid
  const isValidTargetTime = targetTime && !isNaN(targetTime.getTime());
  const formattedTime = !isValidTargetTime ? expiredText : (isExpired ? expiredText : formatTime(timeRemaining));

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: direction === 'horizontal' ? getFlexDirection(isRTL) : 'column',
      alignItems: 'center',
      justifyContent: alignment === 'left' ? 'flex-start' : alignment === 'right' ? 'flex-end' : 'center',
      backgroundColor: colors.background,
      borderRadius: sizeConfig.borderRadius,
      paddingHorizontal: sizeConfig.paddingHorizontal,
      paddingVertical: sizeConfig.paddingVertical,
      minHeight: sizeConfig.minHeight,
      opacity: disabled ? 0.6 : 1,
    };

    if (bordered) {
      baseStyle.borderWidth = 1;
      baseStyle.borderColor = colors.border + '30';
    }

    return baseStyle;
  };

  const getIconMargin = () => {
    if (direction === 'vertical') {
      return { marginBottom: theme.sizes.xs };
    }
    return getRTLMargin(isRTL).marginEnd(theme.sizes.xs);
  };

  return (
    <View
      style={[
        getContainerStyle(),
        containerStyle,
        style
      ]}
      accessible={true}
      accessibilityLabel={accessibilityLabel || `${formattedTime} متبقية`}
      accessibilityRole="timer"
      testID={testID}
    >
      {showIcon && (
        <Icon
          name={currentIcon}
          size={sizeConfig.iconSize}
          color={colors.icon}
          style={[
            direction === 'horizontal' ? getIconMargin() : { marginBottom: theme.sizes.xs },
            iconStyle
          ]}
        />
      )}
      
      <Text
        variant="caption"
        style={[
          {
            color: colors.text,
            fontSize: sizeConfig.fontSize,
            fontWeight: timerState === 'expired' ? '400' : '600',
            fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', // Monospace for better number alignment
            textAlign: alignment === 'left' ? (isRTL ? 'right' : 'left') : alignment === 'right' ? (isRTL ? 'left' : 'right') : 'center',
          },
          textStyle
        ]}
      >
        {formattedTime}
      </Text>
    </View>
  );
}