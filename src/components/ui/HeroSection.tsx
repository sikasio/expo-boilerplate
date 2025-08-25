import React from 'react';
import {
  View,
  ViewProps,
  TouchableOpacity,
  ViewStyle,
  ImageBackground,
  ImageSourcePropType,
  StyleSheet,
  StatusBar,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useRTL } from '@/contexts/RTLContext';
import { Text } from './Text';
import { Icon, IconName } from './Icon';
import { Button } from './Button';
import { Avatar } from './Avatar';

export type HeroSize = 'small' | 'medium' | 'large';
export type HeroColorScheme = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'dark' | 'light';

interface HeroAction {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'warning' | 'error';
  size?: 'xs' | 'small' | 'medium' | 'large' | 'xl';
  leftIcon?: IconName;
  rightIcon?: IconName;
  loading?: boolean;
}


interface HeroSectionProps extends ViewProps {
  // Content - can be string props AND custom content
  title?: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  customContent?: React.ReactNode;

  // Avatar section
  avatar?: {
    name: string;
    align?: 'left' | 'center' | 'right';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    backgroundColor?: string;
    textColor?: string;
    status?: 'online' | 'offline' | 'away' | 'busy';
    showStatus?: boolean;
  };

  // Actions & Buttons
  actions?: HeroAction[];
  actionButtons?: HeroAction[];
  rightAction?: {
    icon: IconName;
    onPress: () => void;
    label?: string;
  };
  rightActions?: {
    icon: IconName;
    onPress: () => void;
    label?: string;
  }[];

  // Visual
  size?: HeroSize;
  colorScheme?: HeroColorScheme;
  backgroundImage?: ImageSourcePropType;
  overlay?: boolean;
  overlayOpacity?: number;

  // Layout
  rounded?: boolean;
  centerContent?: boolean;
  contentAlign?: 'left' | 'center' | 'right';
  fullScreen?: boolean;
  scrollable?: boolean;

  // Animation
  scrollY?: Animated.Value;
  hideOnScroll?: boolean;

  // Spacing control
  titleSpacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | number;
  subtitleSpacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | number;
  descriptionSpacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | number;
  descriptionBottomSpacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | number;
}

export function HeroSection({
  title,
  subtitle,
  description,
  badge,
  customContent,
  avatar,
  actions = [],
  actionButtons = [],
  rightAction,
  rightActions = [],
  size = 'medium',
  colorScheme = 'primary',
  backgroundImage,
  overlay = false,
  overlayOpacity = 0.5,
  rounded = true,
  centerContent = false,
  contentAlign = 'left',
  fullScreen = false,
  scrollable = false,
  scrollY,
  hideOnScroll = false,
  titleSpacing = 'xs',
  subtitleSpacing = 'md',
  descriptionSpacing = 'sm',
  descriptionBottomSpacing = 'md',
  style,
  ...props
}: HeroSectionProps) {
  const { theme } = useTheme();
  const { isRTL } = useRTL();

  // Scroll animation - only when hideOnScroll=true, scrollable=false (fixed hero) and scrollY is provided
  const heroElementsOpacity = React.useMemo(() => {
    if (!hideOnScroll || scrollable || !scrollY) {
      return 1; // No animation when hideOnScroll disabled, scrollable, or no scrollY provided
    }

    return scrollY.interpolate({
      inputRange: [0, 100], // Start fading at 0, fully hidden at 100px scroll
      outputRange: [1, 0],   // From fully visible to fully hidden
      extrapolate: 'clamp',
    });
  }, [hideOnScroll, scrollable, scrollY]);

  // Height animation for collapsing elements (maxHeight values for multi-line support)
  const badgeHeight = React.useMemo(() => {
    if (!hideOnScroll || scrollable || !scrollY) {
      return 100; // Allow enough space for multi-line badges (no animation)
    }

    return scrollY.interpolate({
      inputRange: [0, 100], // Start collapsing at 0, fully collapsed at 100px scroll
      outputRange: [100, 0],   // From generous badge height to 0
      extrapolate: 'clamp',
    });
  }, [hideOnScroll, scrollable, scrollY]);

  const descriptionHeight = React.useMemo(() => {
    if (!hideOnScroll || scrollable || !scrollY) {
      return 200; // Allow enough space for multi-line descriptions (no animation)
    }

    return scrollY.interpolate({
      inputRange: [0, 100], // Start collapsing at 0, fully collapsed at 100px scroll
      outputRange: [200, 0],   // From generous description height to 0
      extrapolate: 'clamp',
    });
  }, [hideOnScroll, scrollable, scrollY]);

  // Margin animation to smooth the spacing
  const heroElementsMargin = React.useMemo(() => {
    if (!hideOnScroll || scrollable || !scrollY) {
      return theme.sizes.sm; // Static margin when no animation
    }

    return scrollY.interpolate({
      inputRange: [0, 100], // Start reducing margin at 0, no margin at 100px scroll
      outputRange: [theme.sizes.sm, 0], // From normal margin to no margin
      extrapolate: 'clamp',
    });
  }, [hideOnScroll, scrollable, scrollY, theme.sizes.sm]);

  // Get size dimensions
  const getSizeDimensions = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: theme.sizes.lg,
          titleSize: theme.fontSizes.xxl,
          subtitleSize: theme.fontSizes.md,
          descriptionSize: theme.fontSizes.sm,
          iconSize: 20,
        };
      case 'large':
        return {
          paddingVertical: theme.sizes.xxl,
          titleSize: theme.fontSizes.xxxl,
          subtitleSize: theme.fontSizes.xl,
          descriptionSize: theme.fontSizes.lg,
          iconSize: 28,
        };
      default: // medium
        return {
          paddingVertical: theme.sizes.xxl,
          titleSize: theme.fontSizes.xxl,
          subtitleSize: theme.fontSizes.lg,
          descriptionSize: theme.fontSizes.md,
          iconSize: 24,
        };
    }
  };

  // Get color scheme
  const getColorScheme = () => {
    switch (colorScheme) {
      case 'primary': return { bg: theme.colors.primary, text: 'white' };
      case 'secondary': return { bg: theme.colors.secondary, text: 'white' };
      case 'success': return { bg: theme.colors.success, text: 'white' };
      case 'warning': return { bg: theme.colors.warning, text: 'white' };
      case 'error': return { bg: theme.colors.error, text: 'white' };
      case 'dark': return { bg: '#000000', text: 'white' };
      case 'light': return { bg: '#FFFFFF', text: theme.colors.text };
      default: return { bg: theme.colors.primary, text: 'white' };
    }
  };

  const dimensions = getSizeDimensions();
  const colors = getColorScheme();

  // General spacing helper function
  const getSpacing = (spacingValue: 'none' | 'xs' | 'sm' | 'md' | 'lg' | number | undefined, defaultValue: 'xs' | 'sm' | 'md' | 'lg' = 'xs') => {
    if (spacingValue === 'none') return 0;
    if (typeof spacingValue === 'number') return spacingValue;

    const value = spacingValue || defaultValue;

    switch (value) {
      case 'xs': return theme.sizes.xs;
      case 'sm': return theme.sizes.sm;
      case 'md': return theme.sizes.md;
      case 'lg': return theme.sizes.lg;
      default: return theme.sizes.xs;
    }
  };

  const getStatusBarHeight = () => {
    if (Platform.OS === 'android') {
      return StatusBar.currentHeight || 0;
    }
    // iOS status bar height varies by device, but we'll use a standard approach
    return 50; // Standard iOS status bar height
  };

  const getContainerStyle = (): ViewStyle => {
    const baseStyle = {
      backgroundColor: backgroundImage ? 'transparent' : colors.bg,
      paddingHorizontal: theme.sizes.lg,
      ...(rounded && {
        borderBottomLeftRadius: theme.borderRadius.lg,
        borderBottomRightRadius: theme.borderRadius.lg,
      }),
    };

    if (scrollable) {
      // When scrollable, don't use fixed positioning, work with natural scroll
      return {
        ...baseStyle,
        paddingTop: dimensions.paddingVertical + theme.sizes.md,
        paddingBottom: theme.sizes.lg,
      };
    }

    if (fullScreen) {
      return {
        ...baseStyle,
        paddingTop: getStatusBarHeight() + dimensions.paddingVertical + theme.sizes.lg,
        paddingBottom: theme.sizes.lg,
        marginTop: -getStatusBarHeight(),
      };
    }

    return {
      ...baseStyle,
      paddingTop: dimensions.paddingVertical,
      paddingBottom: dimensions.paddingVertical,
    };
  };

  const getOverlayStyle = (): ViewStyle => {
    if (!overlay || !backgroundImage) return {};
    return {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
    };
  };

  const renderDefaultContent = () => (
    <View style={{ flex: 1 }}>
      {badge && (
        <Animated.View
          style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            paddingHorizontal: theme.sizes.sm,
            paddingVertical: 4,
            borderRadius: theme.borderRadius.md,
            alignSelf: isRTL ? 'flex-end' : (contentAlign === 'center' ? 'center' : contentAlign === 'right' ? 'flex-end' : 'flex-start'),
            marginBottom: heroElementsMargin,
            opacity: heroElementsOpacity,
            maxHeight: badgeHeight,
            overflow: 'hidden',
          }}
        >
          <Text
            variant="caption"
            style={{
              color: colors.text,
              fontWeight: '600',
              fontSize: 10,
            }}
          >
            {badge}
          </Text>
        </Animated.View>
      )}

      {title && (
        <Text
          variant='title'
          style={{
            color: colors.text,
            fontWeight: 'bold',
            fontSize: dimensions.titleSize,
            textAlign: isRTL ? 'right' : contentAlign,
          }}
        >
          {title}
        </Text>
      )}

      {subtitle && (
        <Animated.View>
          <Text
            variant='subtitle'
            style={{
              color: colors.text,
              fontSize: dimensions.subtitleSize,
              textAlign: isRTL ? 'right' : contentAlign,
            }}
          >
            {subtitle}
          </Text>
        </Animated.View>
      )}

      {description && (
        <Animated.View
          style={{
            opacity: heroElementsOpacity,
            maxHeight: descriptionHeight,
            overflow: 'hidden',
          }}
        >
          <Text
            variant='body'
            style={{
              color: colors.text,
              opacity: 0.9,
              fontSize: dimensions.descriptionSize,
              textAlign: isRTL ? 'right' : contentAlign,
            }}
          >
            {description}
          </Text>
        </Animated.View>
      )}
    </View>
  );

  const renderAvatar = () => {
    if (!avatar) return null;

    return (
      <View style={{
        alignItems: avatar.align === 'center' ? 'center' : avatar.align === 'right' ? 'flex-end' : 'flex-start',
        marginBottom: avatar ? theme.sizes.md : 0,
      }}>
        <Avatar
          name={avatar.name}
          size={avatar.size || 'md'}
          backgroundColor={avatar.backgroundColor || theme.colors.secondary}
          textColor={avatar.textColor || 'white'}
          status={avatar.status}
          showStatus={avatar.showStatus}
        />
      </View>
    );
  };

  const renderHeader = () => (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    }}>
      {/* Content takes full width */}
      {customContent ? customContent : renderDefaultContent()}

      {/* Right actions floated absolutely - positioned based on RTL */}
      {(rightAction || rightActions.length > 0) && (
        <View style={{
          position: 'absolute',
          top: 0,
          [isRTL ? 'left' : 'right']: 0,
          zIndex: 10,
          flexDirection: 'row',
          gap: theme.sizes.xs,
        }}>
          {/* Single right action (legacy) */}
          {rightAction && (
            <TouchableOpacity
              onPress={rightAction.onPress}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                padding: theme.sizes.sm,
                borderRadius: theme.borderRadius.md,
              }}
            >
              <Icon
                name={rightAction.icon}
                size={dimensions.iconSize}
                color={colors.text}
              />
            </TouchableOpacity>
          )}

          {/* Multiple right actions */}
          {rightActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              onPress={action.onPress}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                padding: theme.sizes.sm,
                borderRadius: theme.borderRadius.md,
              }}
            >
              <Icon
                name={action.icon}
                size={dimensions.iconSize}
                color={colors.text}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}

    </View>
  );


  const renderActions = () => {
    const allActions = [...actions, ...actionButtons];
    if (!allActions.length) return null;

    return (
      <View style={{
        flexDirection: 'row',
        gap: theme.sizes.sm,
        marginTop: theme.sizes.sm,
        justifyContent: isRTL ? 'flex-end' : (contentAlign === 'center' ? 'center' : contentAlign === 'right' ? 'flex-end' : 'flex-start'),
        alignItems: 'center',
      }}>
        {allActions.map((action, index) => (
          <Button
            key={index}
            title={action.title}
            variant={action.variant || 'outline'}
            size={action.size || 'medium'}
            onPress={action.onPress}
            leftIcon={action.leftIcon}
            rightIcon={action.rightIcon}
            loading={action.loading}
          />
        ))}
      </View>
    );
  };

  const content = (
    <View style={getContainerStyle()}>
      {overlay && backgroundImage && <View style={getOverlayStyle()} />}
      <View style={{ zIndex: 1 }}>
        {renderHeader()}
        {renderAvatar()}
        {renderActions()}
      </View>
    </View>
  );

  if (backgroundImage) {
    return (
      <ImageBackground
        source={backgroundImage}
        style={[style]}
        {...props}
      >
        {content}
      </ImageBackground>
    );
  }

  return (
    <View style={[style]} {...props}>
      {content}
    </View>
  );
}