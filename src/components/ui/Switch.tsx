import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Animated, ViewStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  activeColor?: string;
  inactiveColor?: string;
  thumbColor?: string;
  style?: ViewStyle;
  testID?: string;
}

export function Switch({
  value,
  onValueChange,
  disabled = false,
  size = 'medium',
  activeColor,
  inactiveColor,
  thumbColor,
  style,
  testID,
}: SwitchProps) {
  const { theme } = useTheme();
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  // Size configurations
  const sizeConfig = {
    small: {
      width: 38,
      height: 20,
      thumbSize: 16,
      padding: 2,
    },
    medium: {
      width: 48,
      height: 28,
      thumbSize: 24,
      padding: 2,
    },
    large: {
      width: 58,
      height: 32,
      thumbSize: 28,
      padding: 2,
    },
  };

  const config = sizeConfig[size];
  const thumbPosition = config.width - config.thumbSize - config.padding * 2;

  // Colors - optimized for better contrast and visual hierarchy
  const defaultActiveColor = activeColor || theme.colors.primary;
  const defaultInactiveColor = inactiveColor || (theme.isDark ? theme.colors.textSecondary + '40' : theme.colors.border);
  const defaultThumbColor = thumbColor || (theme.isDark ? theme.colors.surface : '#FFFFFF');
  
  // Disabled state colors
  const disabledTrackColor = theme.isDark ? theme.colors.textSecondary + '30' : theme.colors.border + '80';
  const disabledThumbColor = theme.isDark ? theme.colors.textSecondary + '60' : theme.colors.textSecondary;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, animatedValue]);

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  const trackColor = disabled 
    ? disabledTrackColor
    : animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [defaultInactiveColor, defaultActiveColor],
      });

  const thumbTranslateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, thumbPosition],
  });

  const thumbScale = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.1, 1],
  });

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        {
          width: config.width,
          height: config.height,
          borderRadius: config.height / 2,
          padding: config.padding,
          justifyContent: 'center',
        },
        style,
      ]}
      testID={testID}
    >
      <Animated.View
        style={{
          width: '100%',
          height: '100%',
          borderRadius: config.height / 2,
          backgroundColor: trackColor,
          justifyContent: 'center',
          borderWidth: theme.isDark ? 0 : 0.5,
          borderColor: disabled 
            ? (theme.isDark ? 'transparent' : theme.colors.textSecondary + '40')
            : (theme.isDark ? 'transparent' : theme.colors.border + '60'),
        }}
      >
        <Animated.View
          style={{
            width: config.thumbSize,
            height: config.thumbSize,
            borderRadius: config.thumbSize / 2,
            backgroundColor: disabled ? disabledThumbColor : defaultThumbColor,
            shadowColor: disabled ? 'transparent' : (theme.isDark ? '#000000' : '#000000'),
            shadowOffset: {
              width: 0,
              height: disabled ? 0 : 2,
            },
            shadowOpacity: disabled ? 0 : (theme.isDark ? 0.3 : 0.2),
            shadowRadius: disabled ? 0 : 3,
            elevation: disabled ? 0 : (theme.isDark ? 4 : 3),
            transform: [
              { translateX: thumbTranslateX },
              { scale: disabled ? 1 : thumbScale },
            ],
          }}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}