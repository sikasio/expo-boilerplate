import React from 'react';
import {
  View,
  ViewProps,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Text } from './Text';
import { Icon, IconName } from './Icon';
import { Button } from './Button';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled';
export type CardSize = 'small' | 'medium' | 'large';
export type CardColorScheme = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost';

interface CardAction {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  leftIcon?: IconName;
  rightIcon?: IconName;
}

interface CardProps extends ViewProps {
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
  headerSpacing = 'medium',
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
          iconSize: theme.fontSizes.lg,
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
      flexDirection: horizontal ? 'row' : 'column',
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
    };

    return {
      ...variantStyles[variant],
      ...(padding !== 'none' ? paddingStyles[padding] : {}),
      opacity: disabled ? 0.6 : 1,
    };
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

  const getBadgeStyle = () => ({
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.md,
    marginLeft: 8,
    backgroundColor: getBadgeColor(),
  });

  const getHeaderBottomMargin = () => {
    if (!title && !subtitle && !headerIcon && !headerActions && !badge) return 0;
    if (children) {
      switch (headerSpacing) {
        case 'none': return 0;
        case 'small': return theme.sizes.sm;
        case 'medium': return theme.sizes.md;
        case 'large': return theme.sizes.lg;
        case 'xl': return theme.sizes.xl;
        default: return theme.sizes.md;
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

  const renderHeader = () => {
    if (!title && !subtitle && !headerIcon && !headerActions && !badge) return null;

    return (
      <View style={[styles.header, getHeaderStyle()]}>
        <View style={styles.headerLeft}>
          {headerIcon && (
            <Icon
              name={headerIcon}
              size={sizeDimensions.iconSize}
              color={schemeColors.titleColor}
              style={styles.headerIcon}
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
                  { fontSize: sizeDimensions.subtitleSize, color: theme.colors.textSecondary },
                  styles.subtitle
                ]}
                numberOfLines={2}
              >
                {subtitle}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.headerRight}>
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
      <View style={[styles.content, horizontal && styles.horizontalContent]}>
        {image && (
          <View style={[styles.imageContainer, horizontal && styles.horizontalImage]}>
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
          <View style={styles.actions}>
            {actions.map((action, index) => (
              <Button
                key={index}
                title={action.label}
                variant={action.variant || 'outline'}
                size="small"
                onPress={action.onPress}
                leftIcon={action.leftIcon}
                rightIcon={action.rightIcon}
                style={[styles.actionButton, index > 0 && styles.actionButtonSpacing]}
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
    marginTop: 12,
    paddingTop: 12,
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