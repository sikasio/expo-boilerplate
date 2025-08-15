import React, { useState, useEffect } from 'react';
import { View, StatusBar, ViewStyle, ActivityIndicator, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { SplashScreen, SplashScreenProps } from '@/screens/SplashScreen';
import { useTheme } from '@/contexts/ThemeContext';
import { Icon, IconName } from './Icon';
import { Text } from './Text';

export type LoadingScreenVariant =
  | 'default'
  | 'minimal'
  | 'detailed'
  | 'progress'
  | 'skeleton'
  | 'fullscreen';

export type LoadingScreenSize = 'small' | 'medium' | 'large' | 'fullscreen';

export interface LoadingScreenAction {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  icon?: IconName;
  loading?: boolean;
}

export interface LoadingScreenContent {
  title?: string;
  subtitle?: string;
  message?: string;
  description?: string;
}

export interface LoadingScreenProps {
  // Visibility
  visible?: boolean;

  // Content
  content?: LoadingScreenContent;

  // Visual
  variant?: LoadingScreenVariant;
  size?: LoadingScreenSize;
  icon?: IconName;
  customIcon?: React.ReactNode;

  // Progress
  showProgress?: boolean;
  progress?: number; // 0-100
  showPercentage?: boolean;
  progressMessage?: string;

  // Theming
  theme?: 'light' | 'dark' | 'branded' | 'custom';
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;

  // Behavior
  cancelable?: boolean;
  actions?: LoadingScreenAction[];
  onCancel?: () => void;
  onComplete?: () => void;

  // Animation
  enableAnimations?: boolean;
  animationDuration?: number;
  disableSlideAnimation?: boolean; // New prop to disable slide-up animation

  // Layout
  overlay?: boolean;
  overlayOpacity?: number;
  position?: 'center' | 'top' | 'bottom' | 'custom';

  // Accessibility
  accessibilityLabel?: string;
  testID?: string;

  // Style overrides
  style?: ViewStyle;
  contentStyle?: ViewStyle;

  // Auto-hide
  autoHide?: boolean;
  autoHideDelay?: number;
}

export function LoadingScreen({
  visible = true,
  content = {},
  variant = 'default',
  size = 'large',
  icon,
  customIcon,
  showProgress = false,
  progress,
  showPercentage = false,
  progressMessage,
  theme: loadingTheme = 'branded',
  backgroundColor,
  textColor,
  accentColor,
  cancelable = false,
  actions = [],
  onCancel,
  onComplete,
  enableAnimations = true,
  animationDuration = 1500,
  disableSlideAnimation = false,
  overlay = true,
  overlayOpacity = 0.9,
  position = 'center',
  accessibilityLabel,
  testID = 'loading-screen',
  style,
  contentStyle,
  autoHide = false,
  autoHideDelay = 0,
}: LoadingScreenProps) {
  const { theme } = useTheme();

  if (!visible) return null;

  // Get variant-specific configuration
  const getVariantConfig = () => {
    const baseIcon = icon || 'hourglass-outline';

    switch (variant) {
      case 'minimal':
        return {
          showLogo: false,
          showContent: false,
          showProgress: false,
          layout: 'center' as const,
          splashVariant: 'minimal' as const,
        };

      case 'detailed':
        return {
          showLogo: true,
          showContent: true,
          showProgress: showProgress,
          layout: 'center' as const,
          splashVariant: 'default' as const,
        };

      case 'progress':
        return {
          showLogo: true,
          showContent: true,
          showProgress: true,
          layout: 'center' as const,
          splashVariant: 'loading' as const,
        };

      case 'skeleton':
        return {
          showLogo: false,
          showContent: true,
          showProgress: false,
          layout: 'center' as const,
          splashVariant: 'minimal' as const,
        };

      case 'fullscreen':
        return {
          showLogo: true,
          showContent: true,
          showProgress: showProgress,
          layout: 'split' as const,
          splashVariant: 'branded' as const,
        };

      default:
        return {
          showLogo: true,
          showContent: true,
          showProgress: showProgress,
          layout: 'center' as const,
          splashVariant: 'default' as const,
        };
    }
  };

  const config = getVariantConfig();

  // Get size-specific configuration
  const getSizeConfig = () => {
    switch (size) {
      case 'small':
        return { logoSize: 40, iconSize: 24 };
      case 'medium':
        return { logoSize: 60, iconSize: 32 };
      case 'large':
        return { logoSize: 80, iconSize: 40 };
      case 'fullscreen':
        return { logoSize: 120, iconSize: 60 };
      default:
        return { logoSize: 80, iconSize: 40 };
    }
  };

  const sizeConfig = getSizeConfig();

  // Create logo component
  const renderLogo = () => {
    if (!config.showLogo && !customIcon) return null;

    if (customIcon) return customIcon;

    const iconColor = textColor || (loadingTheme === 'branded' || loadingTheme === 'dark' ? '#FFFFFF' : theme.colors.primary);
    const bgColor = accentColor || (loadingTheme === 'branded' ? '#FFFFFF20' : theme.colors.primary + '20');

    return (
      <View style={{
        width: sizeConfig.logoSize,
        height: sizeConfig.logoSize,
        borderRadius: sizeConfig.logoSize / 2,
        backgroundColor: bgColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.sizes.lg,
      }}>
        <Icon
          name={icon || 'hourglass-outline'}
          size={sizeConfig.iconSize}
          color={iconColor}
        />
      </View>
    );
  };

  // Prepare actions
  const preparedActions = [...actions];

  if (cancelable && onCancel) {
    preparedActions.push({
      title: 'Cancel',
      variant: 'ghost',
      icon: 'close-outline',
      onPress: onCancel,
    });
  }

  // Get theme colors
  const getThemeColors = () => {
    switch (loadingTheme) {
      case 'light':
        return {
          background: backgroundColor || '#FFFFFF',
          text: textColor || '#000000',
          secondary: '#666666',
        };
      case 'dark':
        return {
          background: backgroundColor || '#000000',
          text: textColor || '#FFFFFF',
          secondary: '#AAAAAA',
        };
      case 'branded':
        return {
          background: backgroundColor || theme.colors.primary,
          text: textColor || '#FFFFFF',
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
          background: backgroundColor || theme.colors.background,
          text: textColor || theme.colors.text,
          secondary: theme.colors.textSecondary,
        };
    }
  };

  const colors = getThemeColors();

  // Prepare SplashScreen props
  const splashProps: Partial<SplashScreenProps> = {
    variant: config.splashVariant,
    layout: config.layout,
    theme: loadingTheme,
    content: config.showContent ? {
      title: content.title,
      subtitle: content.subtitle,
      description: content.description || content.message,
    } : {},
    logo: config.showLogo || customIcon ? renderLogo() : undefined,
    showProgress: config.showProgress || showProgress,
    progress: progress,
    progressMessage: progressMessage || content.message,
    showPercentage: showPercentage,
    actions: preparedActions,
    backgroundColor: colors.background,
    textColor: colors.text,
    enableAnimations: disableSlideAnimation ? false : enableAnimations,
    animationDuration: disableSlideAnimation ? 0 : animationDuration,
    onComplete: onComplete,
    autoHide: autoHide,
    autoHideDelay: autoHideDelay,
    testID: testID,
    accessible: !!accessibilityLabel,
    style: [
      {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: overlay ? 9999 : 1,
        // Ensure immediate display without animation
        opacity: 1,
        transform: [{ translateY: 0 }],
      },
      style,
    ],
    contentStyle: contentStyle,
  };

  return (
    <>
      <StatusBar
        barStyle={colors.text === '#FFFFFF' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <SplashScreen {...splashProps} />
    </>
  );
}

// Specialized loading screen variants for common use cases
export interface SimpleLoadingProps {
  visible?: boolean;
  testID?: string;
}

// Safe ActivityIndicator wrapper for Android - prevents ProgressBar measurement issues
export const SafeActivityIndicator = ({ size, color }: { size: "small" | "large", color: string }) => {
  const [shouldRender, setShouldRender] = useState(Platform.OS !== 'android');

  useEffect(() => {
    if (Platform.OS === 'android') {
      // Delay Android ActivityIndicator rendering to prevent measurement issues
      const timer = setTimeout(() => {
        setShouldRender(true);
      }, 16); // One frame delay
      return () => clearTimeout(timer);
    }
  }, []);

  if (!shouldRender) {
    return <View style={{ width: size === 'large' ? 36 : 20, height: size === 'large' ? 36 : 20 }} />;
  }

  return (
    <ActivityIndicator
      size={size}
      color={color}
    />
  );
};

export function SimpleLoading({
  visible = true,
  testID = 'simple-loading',
}: SimpleLoadingProps) {
  const { theme } = useTheme();

  if (!visible) return null;

  const overlayStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    zIndex: 9999,
    elevation: Platform.OS === 'android' ? 9999 : undefined, // Android specific
  };

  const spinnerContainer = (
    <View style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center' }}>
      {Platform.OS === 'android' ? (
        // Use regular ActivityIndicator on Android for loading screens to avoid delay issues
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
        />
      ) : (
        <SafeActivityIndicator
          size="large"
          color={theme.colors.primary}
        />
      )}
    </View>
  );

  // Use BlurView on iOS, solid overlay on Android
  if (Platform.OS === 'ios') {
    return (
      <BlurView
        intensity={25}
        tint="light"
        style={overlayStyle}
        testID={testID}
      >
        {spinnerContainer}
      </BlurView>
    );
  }

  // Android: Use solid overlay with proper opacity
  return (
    <View
      style={[
        overlayStyle,
        {
          backgroundColor: theme.isDark 
            ? 'rgba(0, 0, 0, 0.90)' 
            : 'rgba(255, 255, 255, 0.95)',
        }
      ]}
      testID={testID}
    >
      {spinnerContainer}
    </View>
  );
}

export function DetailedLoading({
  visible = true,
  title = 'Loading',
  subtitle,
  message = 'Please wait...',
  icon,
  showProgress = false,
  progress,
  showPercentage = false,
  onCancel,
  disableSlideAnimation = true, // Default to no slide animation for detailed loading
  testID = 'detailed-loading',
}: {
  visible?: boolean;
  title?: string;
  subtitle?: string;
  message?: string;
  icon?: IconName;
  showProgress?: boolean;
  progress?: number;
  showPercentage?: boolean;
  onCancel?: () => void;
  disableSlideAnimation?: boolean;
  testID?: string;
}) {
  return (
    <LoadingScreen
      visible={visible}
      variant="detailed"
      size="large"
      content={{ title, subtitle, message }}
      icon={icon}
      showProgress={showProgress}
      progress={progress}
      showPercentage={showPercentage}
      cancelable={!!onCancel}
      onCancel={onCancel}
      disableSlideAnimation={disableSlideAnimation}
      testID={testID}
    />
  );
}

export function ProgressLoading({
  visible = true,
  title = 'Processing',
  message = 'Please wait...',
  progress = 0,
  showPercentage = true,
  onCancel,
  testID = 'progress-loading',
}: {
  visible?: boolean;
  title?: string;
  message?: string;
  progress?: number;
  showPercentage?: boolean;
  onCancel?: () => void;
  testID?: string;
}) {
  return (
    <LoadingScreen
      visible={visible}
      variant="progress"
      size="large"
      content={{ title, message }}
      showProgress={true}
      progress={progress}
      showPercentage={showPercentage}
      cancelable={!!onCancel}
      onCancel={onCancel}
      disableSlideAnimation={true} // No slide animation for progress loading
      testID={testID}
    />
  );
}

// Error screen component using LoadingScreen base
export interface ErrorScreenProps {
  visible?: boolean;
  title?: string;
  message: string;
  icon?: IconName;
  variant?: 'error' | 'warning' | 'info' | 'network';
  onRetry?: () => void;
  onGoBack?: () => void;
  onDismiss?: () => void;
  retryText?: string;
  backText?: string;
  dismissText?: string;
  testID?: string;
}

export function ErrorScreen({
  visible = true,
  title,
  message,
  icon,
  variant = 'error',
  onRetry,
  onGoBack,
  onDismiss,
  retryText = 'Try Again',
  backText = 'Go Back',
  dismissText = 'Dismiss',
  testID = 'error-screen',
}: ErrorScreenProps) {
  const { theme } = useTheme();

  const getErrorConfig = () => {
    switch (variant) {
      case 'warning':
        return {
          title: title || 'Warning',
          icon: icon || 'warning-outline',
          color: theme.colors.warning,
        };
      case 'info':
        return {
          title: title || 'Information',
          icon: icon || 'information-circle-outline',
          color: theme.colors.primary,
        };
      case 'network':
        return {
          title: title || 'Connection Error',
          icon: icon || 'wifi-off-outline',
          color: theme.colors.warning,
        };
      default: // error
        return {
          title: title || 'Something went wrong',
          icon: icon || 'alert-circle-outline',
          color: theme.colors.error,
        };
    }
  };

  const config = getErrorConfig();
  const actions: LoadingScreenAction[] = [];

  if (onRetry) {
    actions.push({
      title: retryText,
      variant: 'primary',
      icon: 'refresh-outline',
      onPress: onRetry,
    });
  }

  if (onGoBack) {
    actions.push({
      title: backText,
      variant: 'outline',
      icon: 'chevron-back-outline',
      onPress: onGoBack,
    });
  }

  if (onDismiss) {
    actions.push({
      title: dismissText,
      variant: 'ghost',
      icon: 'close-outline',
      onPress: onDismiss,
    });
  }

  return (
    <LoadingScreen
      visible={visible}
      variant="detailed"
      size="large"
      theme="custom"
      content={{
        title: config.title,
        subtitle: message,
      }}
      customIcon={
        <View style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: config.color + '20',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Icon
            name={config.icon as any}
            size={40}
            color={config.color}
          />
        </View>
      }
      actions={actions}
      enableAnimations={true}
      animationDuration={800}
      disableSlideAnimation={true} // No slide animation for error screens
      testID={testID}
    />
  );
}