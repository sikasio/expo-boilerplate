import React, { useEffect, useRef } from 'react';
import {
  View,
  ActivityIndicator,
  ViewStyle,
  Animated,
  Easing,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Text } from './Text';
import { Icon, IconName } from './Icon';

export type LoadingSpinnerSize = 'xs' | 'small' | 'medium' | 'large' | 'xl';
export type LoadingSpinnerVariant = 'default' | 'dots' | 'pulse' | 'bars' | 'circle' | 'custom';
export type LoadingSpinnerPosition = 'center' | 'top' | 'bottom' | 'inline';

interface LoadingSpinnerProps {
  size?: LoadingSpinnerSize;
  variant?: LoadingSpinnerVariant;
  position?: LoadingSpinnerPosition;
  color?: string;
  secondaryColor?: string;
  message?: string;
  progress?: number; // 0-100 for progress indicator
  overlay?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
  duration?: number; // Animation duration in ms
  style?: ViewStyle;
  containerStyle?: ViewStyle;
  textStyle?: ViewStyle;
  showPercentage?: boolean;
  icon?: IconName;
  customIcon?: React.ReactNode;
  onComplete?: () => void;
  testID?: string;
}

export function LoadingSpinner({
  size = 'large',
  variant = 'default',
  position = 'center',
  color,
  secondaryColor,
  message,
  progress,
  overlay = false,
  overlayColor,
  overlayOpacity = 0.6,
  duration = 1200,
  style,
  containerStyle,
  textStyle,
  showPercentage = false,
  icon,
  customIcon,
  onComplete,
  testID,
}: LoadingSpinnerProps) {
  const { theme } = useTheme();
  
  // Animation refs
  const rotateValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(1)).current;
  const progressValue = useRef(new Animated.Value(progress || 0)).current;

  // Colors
  const primaryColor = color || theme.colors.primary;
  const secondarySpinnerColor = secondaryColor || theme.colors.secondary;
  const defaultOverlayColor = overlayColor || (theme.isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)');

  // Size configurations
  const getSizeConfig = () => {
    switch (size) {
      case 'xs':
        return { spinnerSize: 12, iconSize: 12, textSize: theme.fontSizes.xs, scale: 0.6 };
      case 'small':
        return { spinnerSize: 16, iconSize: 16, textSize: theme.fontSizes.sm, scale: 0.8 };
      case 'medium':
        return { spinnerSize: 24, iconSize: 24, textSize: theme.fontSizes.md, scale: 1 };
      case 'large':
        return { spinnerSize: 32, iconSize: 32, textSize: theme.fontSizes.lg, scale: 1.2 };
      case 'xl':
        return { spinnerSize: 48, iconSize: 48, textSize: theme.fontSizes.xl, scale: 1.5 };
      default:
        return { spinnerSize: 32, iconSize: 32, textSize: theme.fontSizes.lg, scale: 1.2 };
    }
  };

  const sizeConfig = getSizeConfig();

  // Animations
  useEffect(() => {
    if (variant === 'default' || variant === 'circle') {
      const rotateAnimation = Animated.loop(
        Animated.timing(rotateValue, {
          toValue: 1,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      rotateAnimation.start();
      return () => rotateAnimation.stop();
    }
  }, [rotateValue, duration, variant]);

  useEffect(() => {
    if (variant === 'pulse') {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleValue, {
            toValue: 1.2,
            duration: duration / 2,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleValue, {
            toValue: 1,
            duration: duration / 2,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    }
  }, [scaleValue, duration, variant]);

  useEffect(() => {
    if (progress !== undefined) {
      Animated.timing(progressValue, {
        toValue: progress,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start(() => {
        if (progress >= 100 && onComplete) {
          onComplete();
        }
      });
    }
  }, [progress, progressValue, onComplete]);

  // Container styles
  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      justifyContent: position === 'top' ? 'flex-start' : position === 'bottom' ? 'flex-end' : 'center',
      alignItems: 'center',
      paddingVertical: position === 'inline' ? theme.sizes.sm : theme.sizes.md,
    };

    if (overlay) {
      return {
        ...baseStyle,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: defaultOverlayColor.replace(/[\d\.]+\)$/g, `${overlayOpacity})`),
        zIndex: 1000,
      };
    }

    if (position === 'inline') {
      return {
        ...baseStyle,
        flexDirection: 'row',
        backgroundColor: 'transparent',
      };
    }

    return {
      ...baseStyle,
      flex: position !== 'inline' ? 1 : undefined,
      backgroundColor: 'transparent',
    };
  };

  // Spinner components
  const renderDefaultSpinner = () => (
    <ActivityIndicator
      size={size === 'xs' || size === 'small' ? 'small' : 'large'}
      color={primaryColor}
      style={{ transform: [{ scale: sizeConfig.scale }] }}
    />
  );

  const renderDotsSpinner = () => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {[0, 1, 2].map((index) => (
        <Animated.View
          key={index}
          style={{
            width: sizeConfig.spinnerSize * 0.3,
            height: sizeConfig.spinnerSize * 0.3,
            borderRadius: sizeConfig.spinnerSize * 0.15,
            backgroundColor: primaryColor,
            marginHorizontal: sizeConfig.spinnerSize * 0.1,
            opacity: opacityValue,
            transform: [
              {
                scale: scaleValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1.2],
                }),
              },
            ],
          }}
        />
      ))}
    </View>
  );

  const renderPulseSpinner = () => (
    <Animated.View
      style={{
        width: sizeConfig.spinnerSize,
        height: sizeConfig.spinnerSize,
        borderRadius: sizeConfig.spinnerSize / 2,
        backgroundColor: primaryColor,
        transform: [{ scale: scaleValue }],
        opacity: scaleValue.interpolate({
          inputRange: [1, 1.2],
          outputRange: [0.8, 0.3],
        }),
      }}
    />
  );

  const renderBarsSpinner = () => (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
      {[0, 1, 2, 3].map((index) => (
        <Animated.View
          key={index}
          style={{
            width: sizeConfig.spinnerSize * 0.2,
            height: sizeConfig.spinnerSize,
            backgroundColor: index % 2 === 0 ? primaryColor : secondarySpinnerColor,
            marginHorizontal: 1,
            borderRadius: sizeConfig.spinnerSize * 0.1,
            transform: [
              {
                scaleY: scaleValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1],
                }),
              },
            ],
          }}
        />
      ))}
    </View>
  );

  const renderCircleSpinner = () => (
    <Animated.View
      style={{
        width: sizeConfig.spinnerSize,
        height: sizeConfig.spinnerSize,
        borderWidth: sizeConfig.spinnerSize * 0.1,
        borderColor: theme.colors.border,
        borderTopColor: primaryColor,
        borderRadius: sizeConfig.spinnerSize / 2,
        transform: [
          {
            rotate: rotateValue.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '360deg'],
            }),
          },
        ],
      }}
    />
  );

  const renderCustomSpinner = () => {
    if (customIcon) return customIcon;
    
    if (icon) {
      return (
        <Animated.View
          style={{
            transform: [
              {
                rotate: rotateValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          }}
        >
          <Icon
            name={icon}
            size={sizeConfig.iconSize}
            color={primaryColor}
          />
        </Animated.View>
      );
    }
    
    return renderDefaultSpinner();
  };

  const renderProgressBar = () => {
    if (progress === undefined) return null;
    
    return (
      <View style={{
        width: sizeConfig.spinnerSize * 3,
        height: 4,
        backgroundColor: theme.colors.border,
        borderRadius: 2,
        marginTop: theme.sizes.sm,
        overflow: 'hidden',
      }}>
        <Animated.View
          style={{
            height: '100%',
            backgroundColor: primaryColor,
            borderRadius: 2,
            width: progressValue.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
              extrapolate: 'clamp',
            }),
          }}
        />
      </View>
    );
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return renderDotsSpinner();
      case 'pulse':
        return renderPulseSpinner();
      case 'bars':
        return renderBarsSpinner();
      case 'circle':
        return renderCircleSpinner();
      case 'custom':
        return renderCustomSpinner();
      default:
        return renderDefaultSpinner();
    }
  };

  const renderMessage = () => {
    if (!message && !showPercentage) return null;

    const messageText = showPercentage && progress !== undefined 
      ? `${message || 'Loading'} ${Math.round(progress)}%`
      : message;

    return (
      <Text
        variant="body"
        style={[
          {
            marginTop: position === 'inline' ? 0 : theme.sizes.md,
            marginLeft: position === 'inline' ? theme.sizes.sm : 0,
            textAlign: position === 'inline' ? 'left' : 'center',
            color: overlay ? '#FFFFFF' : theme.colors.text,
            fontSize: sizeConfig.textSize,
          },
          textStyle,
        ]}
      >
        {messageText}
      </Text>
    );
  };

  return (
    <View 
      style={[getContainerStyle(), containerStyle]} 
      testID={testID}
    >
      <View style={[{ alignItems: 'center' }, style]}>
        {renderSpinner()}
        {renderProgressBar()}
        {renderMessage()}
      </View>
    </View>
  );
}