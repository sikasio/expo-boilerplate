import React from 'react';
import { View, ViewStyle, ViewProps, StatusBar, Platform } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useRTL } from '../../contexts/RTLContext';
import { Text } from '../ui/Text';
import { BackButton, BackButtonProps } from './BackButton';
import { IconName } from '../ui/Icon';
import { getFlexDirection, getRTLMargin, createRTLStyle } from '../../utils';

export type HeaderMarginBottom = 'none' | 'small' | 'medium' | 'large';

interface HeaderProps extends ViewProps {
  title?: string;
  subtitle?: string;
  titleSize?: keyof typeof import('../../constants').FONT_SIZES;
  showBackButton?: boolean;
  backButtonProps?: Partial<BackButtonProps>;
  // Shortcut for overriding the back-button handler without spreading backButtonProps.
  onBackPress?: () => void;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  centerComponent?: React.ReactNode;
  backgroundColor?: string;
  borderBottom?: boolean;
  paddingHorizontal?: 'none' | 'small' | 'medium' | 'large';
  marginBottom?: HeaderMarginBottom;
  rightSectionWidth?: number;
}

export function Header({
  title,
  subtitle,
  titleSize = 'lg',
  showBackButton = true,
  backButtonProps,
  onBackPress,
  leftComponent,
  rightComponent,
  centerComponent,
  backgroundColor,
  borderBottom = false,
  paddingHorizontal = 'large',
  marginBottom = 'medium',
  rightSectionWidth = 55,
  style,
  ...props
}: HeaderProps) {
  const { theme } = useTheme();
  const { isRTL } = useRTL();

  const getMarginBottom = () => {
    switch (marginBottom) {
      case 'none': return 0;
      case 'small': return theme.sizes.sm;
      case 'medium': return theme.sizes.md;
      case 'large': return theme.sizes.lg;
      default: return theme.sizes.md;
    }
  };

  const getHeaderStyle = (): ViewStyle => {
    // Android-only: Add top margin for status bar
    const androidTopMargin = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0;

    const baseStyle: ViewStyle = {
      flexDirection: getFlexDirection(isRTL),
      alignItems: 'center',
      minHeight: 56,
      paddingHorizontal: theme.sizes.sm,
      paddingVertical: theme.sizes.sm,
      marginTop: androidTopMargin, // Android-only status bar margin
      marginBottom: getMarginBottom(),
      backgroundColor: backgroundColor || theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      borderBottomWidth: borderBottom ? 1 : 0,
      borderBottomColor: theme.colors.border,
      // Only apply shadows/elevation if not transparent background
      ...(backgroundColor === 'transparent' ? {} : {
        shadowColor: theme.colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: Platform.OS === 'android' ? 0 : 2, // Remove Android elevation, keep iOS shadow
      }),
    };

    return createRTLStyle(baseStyle, {}, isRTL);
  };

  const renderLeftSection = () => {
    if (leftComponent) {
      return (
        <View style={{
          width: 55, // Fixed width for left section
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {leftComponent}
        </View>
      );
    }

    if (showBackButton) {
      return (
        <View style={{
          width: 55, // Fixed width for left section
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <BackButton
            variant="icon-only"
            size="medium"
            {...backButtonProps}
            {...(onBackPress && { onPress: onBackPress })}
          />
        </View>
      );
    }

    return <View style={{ width: 55 }} />;
  };

  const renderCenterSection = () => {
    if (centerComponent) {
      return (
        <View style={{
          flex: 1, // Take remaining space between fixed-width sides
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: theme.sizes.sm,
        }}>
          {centerComponent}
        </View>
      );
    }

    if (title || subtitle) {
      return (
        <View style={{
          flex: 1, // Take remaining space between fixed-width sides
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: theme.sizes.sm,
        }}>
          {title && (
            <Text
              style={{
                fontSize: theme.fontSizes[titleSize],
                fontWeight: '600',
                textAlign: 'center',
                width: '100%',
              }}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
          )}
          {subtitle && (
            <Text
              variant="caption"
              style={{
                color: theme.colors.textSecondary,
                textAlign: 'center',
                marginTop: 2,
                width: '100%',
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {subtitle}
            </Text>
          )}
        </View>
      );
    }

    return <View style={{ flex: 1 }} />;
  };

  const renderRightSection = () => {
    if (rightComponent) {
      return (
        <View style={{
          width: rightSectionWidth, // Configurable width for right section
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {rightComponent}
        </View>
      );
    }

    return <View style={{ width: rightSectionWidth }} />;
  };

  return (
    <View style={[getHeaderStyle(), style]} {...props}>
      {renderLeftSection()}
      {renderCenterSection()}
      {renderRightSection()}
    </View>
  );
}