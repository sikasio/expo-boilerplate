import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  ViewStyle,
  Animated,
  Easing,
  Dimensions,
  StatusBar,
  ImageBackground,
  ImageSourcePropType,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Icon, IconName } from '../components/ui/Icon';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export type SplashScreenVariant = 'default' | 'minimal' | 'branded' | 'onboarding' | 'loading' | 'animated';
export type SplashScreenLayout = 'center' | 'top' | 'bottom' | 'split';
export type SplashScreenTheme = 'light' | 'dark' | 'gradient' | 'branded' | 'custom';

interface SplashAction {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  icon?: IconName;
}

interface SplashContent {
  title?: string;
  subtitle?: string;
  description?: string;
  version?: string;
  copyright?: string;
}

export interface SplashScreenProps {
  variant?: SplashScreenVariant;
  layout?: SplashScreenLayout;
  theme?: SplashScreenTheme;
  
  // Content
  content?: SplashContent;
  logo?: React.ReactNode;
  logoSource?: ImageSourcePropType;
  logoSize?: number;
  backgroundImage?: ImageSourcePropType;
  
  // Progress & Loading
  showProgress?: boolean;
  progress?: number; // 0-100
  progressMessage?: string;
  showPercentage?: boolean;
  
  // Actions
  actions?: SplashAction[];
  showSkipButton?: boolean;
  skipButtonText?: string;
  onSkip?: () => void;
  
  // Animation
  animationDuration?: number;
  enableAnimations?: boolean;
  autoHide?: boolean;
  autoHideDelay?: number;
  onAnimationComplete?: () => void;
  
  // Customization
  backgroundColor?: string;
  gradientColors?: [string, string];
  gradientDirection?: 'vertical' | 'horizontal' | 'diagonal';
  textColor?: string;
  overlayOpacity?: number;
  
  // Callbacks
  onShow?: () => void;
  onHide?: () => void;
  onComplete?: () => void;
  
  // Accessibility
  testID?: string;
  accessible?: boolean;
  
  // Style overrides
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  // Logo is rendered via Animated.Image, so ImageStyle is the right shape.
  logoStyle?: import('react-native').ImageStyle;
  // Text styles flow into <Text> children — TextStyle is the right shape.
  textStyle?: import('react-native').TextStyle;
}

export function SplashScreen({
  variant = 'default',
  layout = 'center',
  theme: splashTheme = 'branded',
  content = {},
  logo,
  logoSource,
  logoSize = 120,
  backgroundImage,
  showProgress = false,
  progress = 0,
  progressMessage,
  showPercentage = false,
  actions = [],
  showSkipButton = false,
  skipButtonText = 'Skip',
  onSkip,
  animationDuration = 2000,
  enableAnimations = true,
  autoHide = false,
  autoHideDelay = 3000,
  onAnimationComplete,
  backgroundColor,
  gradientColors,
  gradientDirection = 'vertical',
  textColor,
  overlayOpacity = 0.3,
  onShow,
  onHide,
  onComplete,
  testID,
  accessible = true,
  style,
  contentStyle,
  logoStyle,
  textStyle,
}: SplashScreenProps) {
  const { theme } = useTheme();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(progress)).current;
  
  // State
  const [isVisible, setIsVisible] = useState(true);
  const [currentProgress, setCurrentProgress] = useState(progress);

  // Auto-hide timer
  useEffect(() => {
    if (autoHide && autoHideDelay > 0) {
      const timer = setTimeout(() => {
        hideSplash();
      }, autoHideDelay);
      return () => clearTimeout(timer);
    }
  }, [autoHide, autoHideDelay]);

  // Show animation
  useEffect(() => {
    if (enableAnimations && isVisible) {
      // Delay the animation start to next tick to avoid useInsertionEffect warning
      const timeoutId = setTimeout(() => {
        onShow?.();
        
        const animations = [
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: animationDuration / 2,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: animationDuration / 2,
            easing: Easing.out(Easing.back(1.2)),
            useNativeDriver: true,
          }),
        ];

        if (variant === 'animated') {
          animations.push(
            Animated.loop(
              Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: true,
              })
            )
          );
        }

        Animated.parallel(animations).start(() => {
          onAnimationComplete?.();
        });
      }, 0);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isVisible, enableAnimations]);

  // Progress animation
  useEffect(() => {
    if (showProgress) {
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
      setCurrentProgress(progress);
    }
  }, [progress, showProgress]);

  // Hide splash screen
  const hideSplash = () => {
    if (enableAnimations) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: animationDuration / 3,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: animationDuration / 3,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsVisible(false);
        onHide?.();
        onComplete?.();
      });
    } else {
      setIsVisible(false);
      onHide?.();
      onComplete?.();
    }
  };

  // Get theme colors
  const getThemeColors = () => {
    switch (splashTheme) {
      case 'light':
        return {
          background: '#FFFFFF',
          text: '#000000',
          secondary: '#666666',
        };
      case 'dark':
        return {
          background: '#000000',
          text: '#FFFFFF',
          secondary: '#AAAAAA',
        };
      case 'gradient':
        return {
          background: 'transparent',
          text: '#FFFFFF',
          secondary: '#EEEEEE',
        };
      case 'branded':
        return {
          background: theme.colors.primary,
          text: '#FFFFFF',
          secondary: '#EEEEEE',
        };
      case 'custom':
        return {
          background: backgroundColor || theme.colors.background,
          text: textColor || theme.colors.text,
          secondary: theme.colors.textSecondary,
        };
      default:
        return {
          background: theme.colors.background,
          text: theme.colors.text,
          secondary: theme.colors.textSecondary,
        };
    }
  };

  const colors = getThemeColors();

  // Container styles
  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: screenWidth,
      height: screenHeight,
      zIndex: 99999999, // Extremely high z-index to ensure it covers everything
      elevation: 99999999, // Android elevation to ensure it's on top
      // Force to cover entire screen including safe areas
      paddingTop: 0,
      paddingBottom: 0,
      margin: 0,
    };

    if (splashTheme === 'gradient' && gradientColors) {
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
      };
    }

    return {
      ...baseStyle,
      backgroundColor: colors.background,
    };
  };

  // Content layout styles
  const getContentLayoutStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flex: 1,
      paddingHorizontal: theme.sizes.xl,
      paddingVertical: theme.sizes.xxl,
    };

    switch (layout) {
      case 'top':
        return {
          ...baseStyle,
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingTop: screenHeight * 0.15,
        };
      case 'bottom':
        return {
          ...baseStyle,
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: screenHeight * 0.15,
        };
      case 'split':
        return {
          ...baseStyle,
          justifyContent: 'space-between',
          alignItems: 'center',
        };
      default: // center
        return {
          ...baseStyle,
          justifyContent: 'center',
          alignItems: 'center',
        };
    }
  };

  // Render logo
  const renderLogo = () => {
    if (!logo && !logoSource) return null;

    const logoContent = logo || (
      <Animated.Image
        source={logoSource!}
        style={[
          {
            width: logoSize,
            height: logoSize,
            resizeMode: 'contain',
          },
          logoStyle,
          enableAnimations && {
            transform: [
              { scale: scaleAnim },
              variant === 'animated' ? {
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                })
              } : { rotate: '0deg' },
            ],
          },
        ]}
      />
    );

    return (
      <Animated.View
        style={[
          { alignItems: 'center', marginBottom: theme.sizes.xl },
          enableAnimations && {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        {logoContent}
      </Animated.View>
    );
  };

  // Render content
  const renderContent = () => {
    const { title, subtitle, description, version, copyright } = content;
    
    if (!title && !subtitle && !description && !version && !copyright) {
      return null;
    }

    return (
      <Animated.View
        style={[
          { alignItems: 'center', marginBottom: theme.sizes.xl },
          enableAnimations && {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {title && (
          <Text
            variant="title"
            style={[
              {
                fontSize: variant === 'minimal' ? theme.fontSizes.xl : theme.fontSizes.xxl,
                fontWeight: '700',
                color: colors.text,
                textAlign: 'center',
                marginBottom: theme.sizes.md,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        )}
        
        {subtitle && (
          <Text
            variant="subtitle"
            style={[
              {
                fontSize: theme.fontSizes.lg,
                fontWeight: '500',
                color: colors.secondary,
                textAlign: 'center',
                marginBottom: theme.sizes.sm,
              },
              textStyle,
            ]}
          >
            {subtitle}
          </Text>
        )}
        
        {description && (
          <Text
            variant="body"
            style={[
              {
                fontSize: theme.fontSizes.md,
                color: colors.secondary,
                textAlign: 'center',
                lineHeight: theme.fontSizes.md * 1.5,
                marginBottom: theme.sizes.md,
                paddingHorizontal: theme.sizes.md,
              },
              textStyle,
            ]}
          >
            {description}
          </Text>
        )}
        
        {version && (
          <Text
            variant="caption"
            style={[
              {
                fontSize: theme.fontSizes.sm,
                color: colors.secondary,
                textAlign: 'center',
                marginTop: theme.sizes.sm,
              },
              textStyle,
            ]}
          >
            Version {version}
          </Text>
        )}
        
        {copyright && (
          <Text
            variant="caption"
            style={[
              {
                fontSize: theme.fontSizes.xs,
                color: colors.secondary,
                textAlign: 'center',
                marginTop: theme.sizes.sm,
              },
              textStyle,
            ]}
          >
            {copyright}
          </Text>
        )}
      </Animated.View>
    );
  };

  // Render progress
  const renderProgress = () => {
    if (!showProgress) return null;

    return (
      <Animated.View
        style={[
          {
            alignItems: 'center',
            marginBottom: theme.sizes.xl,
            width: '80%',
          },
          enableAnimations && {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {variant === 'loading' ? (
          <LoadingSpinner
            variant="circle"
            size="large"
            color={colors.text}
            message={progressMessage}
            progress={currentProgress}
            showPercentage={showPercentage}
          />
        ) : (
          <>
            <View style={{
              width: '100%',
              height: 4,
              backgroundColor: colors.secondary + '40',
              borderRadius: 2,
              marginBottom: theme.sizes.sm,
              overflow: 'hidden',
            }}>
              <Animated.View
                style={{
                  height: '100%',
                  backgroundColor: colors.text,
                  borderRadius: 2,
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                    extrapolate: 'clamp',
                  }),
                }}
              />
            </View>
            
            {progressMessage && (
              <Text
                variant="body"
                style={[
                  {
                    color: colors.secondary,
                    textAlign: 'center',
                    fontSize: theme.fontSizes.sm,
                  },
                  textStyle,
                ]}
              >
                {progressMessage}{showPercentage ? ` ${Math.round(currentProgress)}%` : ''}
              </Text>
            )}
          </>
        )}
      </Animated.View>
    );
  };

  // Render actions
  const renderActions = () => {
    if (actions.length === 0 && !showSkipButton) return null;

    return (
      <Animated.View
        style={[
          {
            alignItems: 'center',
            gap: theme.sizes.md,
            marginTop: theme.sizes.xl,
          },
          enableAnimations && {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {actions.map((action, index) => (
          <Button
            key={index}
            title={action.title}
            variant={action.variant || 'primary'}
            leftIcon={action.icon}
            onPress={action.onPress}
            style={{
              minWidth: 200,
              backgroundColor: action.variant === 'primary' ? colors.text : 'transparent',
              borderColor: colors.text,
            }}
            textStyle={{
              color: action.variant === 'primary' ? colors.background : colors.text,
            }}
          />
        ))}
        
        {showSkipButton && (
          <Button
            title={skipButtonText}
            variant="ghost"
            onPress={onSkip || hideSplash}
            style={{ marginTop: theme.sizes.sm }}
            textStyle={{ color: colors.secondary }}
          />
        )}
      </Animated.View>
    );
  };

  // Render gradient background
  const renderGradientBackground = () => {
    if (splashTheme !== 'gradient' || !gradientColors) return null;

    // Note: For a full gradient implementation, you'd use react-native-linear-gradient
    // This is a simplified version using overlapping views
    return (
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: gradientColors[0],
      }}>
        <View style={{
          flex: 1,
          backgroundColor: gradientColors[1],
          opacity: 0.7,
        }} />
      </View>
    );
  };

  // Render background image
  const renderBackgroundImage = () => {
    if (!backgroundImage) return null;

    return (
      <ImageBackground
        source={backgroundImage}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        resizeMode="cover"
      >
        <View
          style={{
            flex: 1,
            backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
          }}
        />
      </ImageBackground>
    );
  };

  if (!isVisible) return null;

  return (
    <View
      style={[getContainerStyle(), style]}
      testID={testID}
      accessible={accessible}
    >
      <StatusBar
        barStyle={colors.text === '#FFFFFF' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
        translucent={true}
        hidden={false}
      />
      
      {renderGradientBackground()}
      {renderBackgroundImage()}
      
      <Animated.View
        style={[
          getContentLayoutStyle(),
          contentStyle,
          enableAnimations && { opacity: fadeAnim },
        ]}
      >
        {layout === 'split' ? (
          <>
            <View style={{ alignItems: 'center' }}>
              {renderLogo()}
              {renderContent()}
            </View>
            <View style={{ alignItems: 'center' }}>
              {renderProgress()}
              {renderActions()}
            </View>
          </>
        ) : (
          <>
            {renderLogo()}
            {renderContent()}
            {renderProgress()}
            {renderActions()}
          </>
        )}
      </Animated.View>
    </View>
  );
}