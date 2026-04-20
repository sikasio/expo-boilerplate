import React from 'react';
import {
  View,
  ViewProps,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useRTL } from '../../contexts/RTLContext';
import { Text } from './Text';
import { Icon, IconName } from './Icon';
import { Button } from './Button';
import { getFlexDirection, getRTLMargin, createRTLStyle } from '../../utils';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled' | 'ghost';
export type CardSize = 'small' | 'medium' | 'large';
export type CardColorScheme = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost' | 'white';

interface CardAction {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  leftIcon?: IconName;
  rightIcon?: IconName;
}

export interface CardProps extends ViewProps {
  children?: React.ReactNode;
  onPress?: () => void;
  variant?: CardVariant;
  size?: CardSize;
  colorScheme?: CardColorScheme;
  padding?: 'none' | 'small' | 'medium' | 'large';

  // Header section
  title?: string;
  subtitle?: string;
  headerIcon?: IconName;
  headerActions?: React.ReactNode;
  headerSpacing?: 'none' | 'small' | 'medium' | 'large' | 'xl';
  headerBorder?: boolean;

  // Footer section
  footer?: React.ReactNode;
  actions?: CardAction[];

  // Visual enhancements
  image?: React.ReactNode;
  badge?: string;
  badgeColor?: CardColorScheme;

  // Layout options
  horizontal?: boolean;
  disabled?: boolean;
}

export function Card({
  children,
  onPress,
  variant = 'default',
  size = 'medium',
  colorScheme = 'default',
  padding = 'medium',
  title,
  subtitle,
  headerIcon,
  headerActions,
  headerSpacing = 'small',
  headerBorder = false,
  footer,
  actions,
  image,
  badge,
  badgeColor = 'primary',
  horizontal = false,
  disabled = false,
  style,
  ...props
}: CardProps) {
  const { theme } = useTheme();
  const { isRTL } = useRTL();

  // Get size-based dimensions
  const getSizeDimensions = () => {
    switch (size) {
      case 'small':
        return {
          borderRadius: theme.borderRadius.sm,
          minHeight: 80,
          titleSize: theme.fontSizes.md,
          subtitleSize: theme.fontSizes.sm,
          iconSize: theme.fontSizes.lg,
        };
      case 'large':
        return {
          borderRadius: theme.borderRadius.lg,
          minHeight: 160,
          titleSize: theme.fontSizes.xl,
          subtitleSize: theme.fontSizes.md,
          iconSize: theme.fontSizes.xl,
        };
      default: // medium
        return {
          borderRadius: theme.borderRadius.md,
          minHeight: 120,
          titleSize: theme.fontSizes.lg,
          subtitleSize: theme.fontSizes.md,
          iconSize: theme.fontSizes.xl,
        };
    }
  };

  // Get color scheme colors
  const getColorSchemeColors = () => {
    switch (colorScheme) {
      case 'primary':
        return {
          backgroundColor: theme.colors.primary + (theme.isDark ? '20' : '10'),
          borderColor: theme.colors.primary,
          titleColor: theme.colors.primary,
          badgeColor: theme.colors.primary,
        };
      case 'secondary':
        return {
          backgroundColor: theme.colors.secondary + (theme.isDark ? '20' : '10'),
          borderColor: theme.colors.secondary,
          titleColor: theme.colors.secondary,
          badgeColor: theme.colors.secondary,
        };
      case 'success':
        return {
          backgroundColor: theme.colors.success + (theme.isDark ? '20' : '10'),
          borderColor: theme.colors.success,
          titleColor: theme.colors.success,
          badgeColor: theme.colors.success,
        };
      case 'warning':
        return {
          backgroundColor: theme.colors.warning + (theme.isDark ? '20' : '10'),
          borderColor: theme.colors.warning,
          titleColor: theme.colors.warning,
          badgeColor: theme.colors.warning,
        };
      case 'error':
        return {
          backgroundColor: theme.colors.error + (theme.isDark ? '20' : '10'),
          borderColor: theme.colors.error,
          titleColor: theme.colors.error,
          badgeColor: theme.colors.error,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          titleColor: theme.colors.text,
          badgeColor: theme.colors.primary,
        };
      case 'white':
        return {
          backgroundColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.15)',
          borderColor: theme.isDark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.3)',
          titleColor: '#FFFFFF',
          badgeColor: '#FFFFFF',
        };
      default:
        return {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          titleColor: theme.colors.text,
          badgeColor: theme.colors.primary,
        };
    }
  };

  const sizeDimensions = getSizeDimensions();
  const schemeColors = getColorSchemeColors();

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: schemeColors.backgroundColor,
      borderRadius: sizeDimensions.borderRadius,
      flexDirection: horizontal ? getFlexDirection(isRTL) : 'column',
      overflow: 'hidden',
      marginBottom: theme.sizes.md,
    };

    const paddingStyles = {
      none: {},
      small: { padding: theme.sizes.sm },
      medium: { padding: theme.sizes.md },
      large: { padding: theme.sizes.lg },
    };

    const variantStyles: Record<CardVariant, ViewStyle> = {
      default: {
        ...baseStyle,
      },
      elevated: {
        ...baseStyle,
        shadowColor: theme.colors.text,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
      },
      outlined: {
        ...baseStyle,
        borderWidth: 1,
        borderColor: schemeColors.borderColor,
      },
      filled: {
        ...baseStyle,
        backgroundColor: schemeColors.backgroundColor,
        borderWidth: 1,
        borderColor: schemeColors.borderColor,
      },
      // Ghost: no surface, border, or shadow — just hosts its children.
      ghost: {
        ...baseStyle,
        backgroundColor: 'transparent',
        borderWidth: 0,
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
      },
    };

    const finalStyle = createRTLStyle({
      ...variantStyles[variant],
      ...(padding !== 'none' ? paddingStyles[padding] : {}),
      opacity: disabled ? 0.6 : 1,
    }, {}, isRTL);

    return finalStyle;
  };

  const getBadgeColor = () => {
    switch (badgeColor) {
      case 'primary': return theme.colors.primary;
      case 'secondary': return theme.colors.secondary;
      case 'success': return theme.colors.success;
      case 'warning': return theme.colors.warning;
      case 'error': return theme.colors.error;
      default: return theme.colors.primary;
    }
  };

  const getBadgeStyle = () => {
    const margin = getRTLMargin(isRTL);
    return {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: theme.borderRadius.md,
      ...margin.marginStart(8),
      backgroundColor: getBadgeColor(),
    };
  };

  const getHeaderBottomMargin = () => {
    if (!title && !subtitle && !headerIcon && !headerActions && !badge) return 0;
    if (children) {
      switch (headerSpacing) {
        case 'none': return 0;
        case 'small': return theme.sizes.sm;
        case 'medium': return theme.sizes.md;
        case 'large': return theme.sizes.lg;
        case 'xl': return theme.sizes.xl;
        default: return theme.sizes.sm;
      }
    }
    return 0;
  };

  const getHeaderStyle = () => {
    const baseStyle = {
      marginBottom: getHeaderBottomMargin(),
    };

    if (headerBorder && children) {
      return {
        ...baseStyle,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        paddingBottom: theme.sizes.sm,
      };
    }

    return baseStyle;
  };

  // RTL-aware dynamic styles
  const getDynamicStyles = () => {
    const margin = getRTLMargin(isRTL);

    return {
      header: createRTLStyle({
        flexDirection: 'row' as const,
        alignItems: 'flex-start' as const,
        justifyContent: 'space-between' as const,
      }, {}, isRTL),
      headerLeft: createRTLStyle({
        flexDirection: 'row' as const,
        alignItems: 'flex-start' as const,
        flex: 1,
      }, {}, isRTL),
      headerIcon: {
        ...margin.marginEnd(6),
        marginTop: 7,
      },
      headerRight: {
        ...createRTLStyle({
          flexDirection: 'row' as const,
          alignItems: 'center' as const,
        }, {}, isRTL),
        ...margin.marginStart(12),
      },
      horizontalContent: createRTLStyle({
        flexDirection: 'row' as const,
      }, {}, isRTL),
      horizontalImage: {
        marginBottom: 0,
        width: 80,
        height: 80,
        ...margin.marginEnd(12),
      },
      actions: createRTLStyle({
        flexDirection: 'row' as const,
        flexWrap: 'wrap' as const,
      }, {}, isRTL),
      actionButton: {
        marginBottom: 4,
        ...margin.marginEnd(8),
      },
    };
  };

  const dynamicStyles = getDynamicStyles();

  const renderHeader = () => {
    if (!title && !subtitle && !headerIcon && !headerActions && !badge) return null;

    return (
      <View style={[dynamicStyles.header, getHeaderStyle()]}>
        <View style={dynamicStyles.headerLeft}>
          {headerIcon && (
            <Icon
              name={headerIcon}
              size={sizeDimensions.iconSize}
              color={colorScheme === 'white' ? '#FFFFFF' : schemeColors.titleColor}
              style={dynamicStyles.headerIcon}
            />
          )}
          <View style={styles.headerText}>
            {title && (
              <Text
                variant="subtitle"
                style={[
                  { fontSize: sizeDimensions.titleSize, color: schemeColors.titleColor },
                  styles.title
                ]}
                numberOfLines={2}
              >
                {title}
              </Text>
            )}
            {subtitle && (
              <Text
                variant="body"
                style={[
                  { fontSize: sizeDimensions.subtitleSize, color: colorScheme === 'white' ? '#FFFFFF' : theme.colors.textSecondary },
                  styles.subtitle
                ]}
                numberOfLines={3}
              >
                {subtitle}
              </Text>
            )}
          </View>
        </View>

        <View style={dynamicStyles.headerRight}>
          {badge && (
            <View style={getBadgeStyle()}>
              <Text variant="caption" style={styles.badgeText}>
                {badge}
              </Text>
            </View>
          )}
          {headerActions}
        </View>
      </View>
    );
  };

  const renderContent = () => {
    if (!children && !image) return null;

    return (
      <View style={[styles.content, horizontal && dynamicStyles.horizontalContent]}>
        {image && (
          <View style={[styles.imageContainer, horizontal && dynamicStyles.horizontalImage]}>
            {image}
          </View>
        )}
        {children && (
          <View style={[styles.children, horizontal && styles.horizontalChildren]}>
            {children}
          </View>
        )}
      </View>
    );
  };

  const renderFooter = () => {
    if (!footer && !actions?.length) return null;

    return (
      <View style={styles.footer}>
        {footer}
        {actions && actions.length > 0 && (
          <View style={dynamicStyles.actions}>
            {actions.map((action, index) => (
              <Button
                key={index}
                title={action.label}
                variant={action.variant || 'outline'}
                size="small"
                onPress={action.onPress}
                leftIcon={action.leftIcon}
                rightIcon={action.rightIcon}
                style={[dynamicStyles.actionButton, index > 0 && styles.actionButtonSpacing]}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  const cardContent = (
    <>
      {renderHeader()}
      {renderContent()}
      {renderFooter()}
    </>
  );

  if (onPress && !disabled) {
    return (
      <TouchableOpacity
        style={[getCardStyle(), style]}
        onPress={onPress}
        activeOpacity={0.8}
        {...(props as TouchableOpacityProps)}
      >
        {cardContent}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[getCardStyle(), style]} {...props}>
      {cardContent}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  headerIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  headerText: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  title: {
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    lineHeight: 20,
  },
  badgeText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  content: {
    flex: 1,
  },
  horizontalContent: {
    flexDirection: 'row',
  },
  imageContainer: {
    marginBottom: 12,
  },
  horizontalImage: {
    marginBottom: 0,
    marginRight: 12,
    width: 80,
    height: 80,
  },
  children: {
    flex: 1,
  },
  horizontalChildren: {
    flex: 1,
  },
  footer: {
    marginTop: 8,
    paddingTop: 8,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  actionButton: {
    marginRight: 8,
    marginBottom: 8,
  },
  actionButtonSpacing: {
    marginLeft: 0,
  },
});