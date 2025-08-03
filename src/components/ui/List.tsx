import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
import { useTheme } from '../../contexts/ThemeContext';
import { Text } from './Text';
import { Icon, IconName } from './Icon';
import { Avatar, AvatarSize } from './Avatar';

export type ListVariant = 'default' | 'inset' | 'sidebar' | 'card';
export type ListItemVariant = 'default' | 'compact' | 'expanded' | 'action';
export type ListDividerVariant = 'full' | 'inset' | 'middle' | 'none';

interface ListProps {
  children: React.ReactNode;
  variant?: ListVariant;
  showDividers?: boolean;
  dividerVariant?: ListDividerVariant;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}

interface ListItemProps extends TouchableOpacityProps {
  title: string;
  subtitle?: string;
  description?: string;
  leftIcon?: IconName;
  rightIcon?: IconName;
  leftAvatar?: {
    source?: any;
    title?: string;
    size?: AvatarSize;
    variant?: 'circle' | 'square' | 'rounded';
  };
  rightContent?: React.ReactNode;
  badge?: {
    text: string;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  };
  variant?: ListItemVariant;
  showChevron?: boolean;
  selected?: boolean;
  disabled?: boolean;
  loading?: boolean;
  multiline?: boolean;
  itemStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  // Collapsible features
  collapsible?: boolean;
  expanded?: boolean;
  onToggleExpand?: (expanded: boolean) => void;
  children?: React.ReactNode;
  // Nested features
  nested?: boolean;
  nestLevel?: number;
  maxNestLevel?: number;
}

interface ListSectionProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  headerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  // Collapsible features
  collapsible?: boolean;
  expanded?: boolean;
  onToggleExpand?: (expanded: boolean) => void;
  headerIcon?: IconName;
}

interface ListDividerProps {
  variant?: ListDividerVariant;
  style?: ViewStyle;
}

export function List({
  children,
  variant = 'default',
  showDividers = true,
  dividerVariant = 'full',
  style,
  contentContainerStyle,
}: ListProps) {
  const { theme } = useTheme();

  const getListStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: variant === 'card' ? theme.colors.surface : 'transparent',
    };

    const variantStyles = {
      default: {},
      inset: {
        marginHorizontal: theme.sizes.md,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.surface,
      },
      sidebar: {
        backgroundColor: theme.colors.background,
        borderRightWidth: 1,
        borderRightColor: theme.colors.border,
      },
      card: {
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        overflow: 'hidden' as const,
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
    };
  };

  const childrenArray = React.Children.toArray(children);
  const childrenWithDividers = showDividers
    ? childrenArray.reduce((acc: React.ReactNode[], child, index) => {
        acc.push(child);
        if (index < childrenArray.length - 1) {
          acc.push(
            <ListDivider key={`divider-${index}`} variant={dividerVariant} />
          );
        }
        return acc;
      }, [])
    : childrenArray;

  return (
    <View style={[getListStyle(), style]}>
      <View style={contentContainerStyle}>
        {childrenWithDividers}
      </View>
    </View>
  );
}

export function ListItem({
  title,
  subtitle,
  description,
  leftIcon,
  rightIcon,
  leftAvatar,
  rightContent,
  badge,
  variant = 'default',
  showChevron = false,
  selected = false,
  disabled = false,
  loading = false,
  multiline = false,
  onPress,
  itemStyle,
  titleStyle,
  subtitleStyle,
  descriptionStyle,
  style,
  // Collapsible features
  collapsible = false,
  expanded: controlledExpanded,
  onToggleExpand,
  children,
  // Nested features
  nested = false,
  nestLevel = 0,
  maxNestLevel = 3,
  ...props
}: ListItemProps) {
  const { theme } = useTheme();
  
  // Internal state for uncontrolled collapsible
  const [internalExpanded, setInternalExpanded] = useState(false);
  const expanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const handleToggleExpand = () => {
    if (collapsible) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      const newExpanded = !expanded;
      
      if (onToggleExpand) {
        onToggleExpand(newExpanded);
      } else {
        setInternalExpanded(newExpanded);
      }
    }
  };

  const handlePress = (event: any) => {
    if (collapsible) {
      handleToggleExpand();
    }
    if (onPress) {
      onPress(event);
    }
  };

  const getItemStyle = (): ViewStyle => {
    // Calculate padding based on nesting level
    const nestPadding = nested ? (nestLevel + 1) * theme.sizes.md : theme.sizes.md;
    
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: variant === 'compact' ? 'center' : 'flex-start',
      paddingHorizontal: nestPadding,
      paddingVertical: variant === 'compact' ? theme.sizes.sm : theme.sizes.md,
      backgroundColor: selected ? theme.colors.primary + '10' : 'transparent',
      opacity: disabled ? 0.6 : 1,
    };

    // Add visual indicators for nested items
    if (nested && nestLevel > 0) {
      baseStyle.borderLeftWidth = 2;
      baseStyle.borderLeftColor = theme.colors.border;
      baseStyle.marginLeft = nestLevel * theme.sizes.xs;
    }

    const variantStyles = {
      default: {},
      compact: {
        paddingVertical: theme.sizes.sm,
      },
      expanded: {
        paddingVertical: theme.sizes.lg,
      },
      action: {
        paddingVertical: theme.sizes.md,
        borderLeftWidth: 4,
        borderLeftColor: selected ? theme.colors.primary : 'transparent',
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
    };
  };

  const getTextColor = (type: 'title' | 'subtitle' | 'description') => {
    if (disabled) return theme.colors.textSecondary;
    if (selected && type === 'title') return theme.colors.primary;
    
    switch (type) {
      case 'title':
        return theme.colors.text;
      case 'subtitle':
      case 'description':
        return theme.colors.textSecondary;
      default:
        return theme.colors.text;
    }
  };

  const renderLeftContent = () => {
    if (leftAvatar) {
      return (
        <View style={{ marginRight: theme.sizes.md }}>
          <Avatar
            source={leftAvatar.source}
            title={leftAvatar.title}
            size={leftAvatar.size || 'medium'}
            variant={leftAvatar.variant}
          />
        </View>
      );
    }

    if (leftIcon) {
      return (
        <View style={{ 
          marginRight: theme.sizes.md,
          justifyContent: 'center',
          alignItems: 'center',
          width: 24,
          height: 24,
        }}>
          <Icon
            name={leftIcon}
            size={20}
            color={selected ? theme.colors.primary : theme.colors.text}
          />
        </View>
      );
    }

    return null;
  };

  const renderRightContent = () => {
    if (rightContent) {
      return <View style={{ marginLeft: theme.sizes.sm }}>{rightContent}</View>;
    }

    const rightItems: React.ReactNode[] = [];

    // Add collapse/expand indicator for collapsible items
    if (collapsible && children) {
      rightItems.push(
        <TouchableOpacity
          key="collapse-toggle"
          onPress={handleToggleExpand}
          style={{
            marginLeft: theme.sizes.sm,
            justifyContent: 'center',
            alignItems: 'center',
            padding: theme.sizes.xs,
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon
            name={expanded ? "chevron-up-outline" : "chevron-down-outline"}
            size={16}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      );
    }

    if (badge) {
      const badgeColors = {
        primary: theme.colors.primary,
        secondary: theme.colors.secondary,
        success: theme.colors.success,
        warning: theme.colors.warning,
        error: theme.colors.error,
      };

      rightItems.push(
        <View
          key="badge"
          style={{
            backgroundColor: badgeColors[badge.variant || 'primary'] + '20',
            paddingHorizontal: theme.sizes.xs,
            paddingVertical: 2,
            borderRadius: theme.borderRadius.xs,
            marginLeft: theme.sizes.sm,
          }}
        >
          <Text
            variant="caption"
            style={{
              color: badgeColors[badge.variant || 'primary'],
              fontSize: 10,
              fontWeight: '600',
            }}
          >
            {badge.text}
          </Text>
        </View>
      );
    }

    if (rightIcon) {
      rightItems.push(
        <View
          key="right-icon"
          style={{
            marginLeft: theme.sizes.sm,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Icon
            name={rightIcon}
            size={20}
            color={theme.colors.textSecondary}
          />
        </View>
      );
    }

    if (showChevron) {
      rightItems.push(
        <View
          key="chevron"
          style={{
            marginLeft: theme.sizes.sm,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Icon
            name="chevron-forward-outline"
            size={16}
            color={theme.colors.textSecondary}
          />
        </View>
      );
    }

    return rightItems.length > 0 ? (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {rightItems}
      </View>
    ) : null;
  };

  const renderChildren = () => {
    if (!children || !collapsible) return null;
    
    return (
      <View style={{ 
        overflow: 'hidden',
        display: expanded ? 'flex' : 'none',
      }}>
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child) && child.type === ListItem) {
            // Auto-nest child items
            return React.cloneElement(child as React.ReactElement<ListItemProps>, {
              nested: true,
              nestLevel: Math.min(nestLevel + 1, maxNestLevel),
              maxNestLevel,
            });
          }
          return child;
        })}
      </View>
    );
  };

  const content = (
    <View style={[getItemStyle(), itemStyle, style]}>
      {renderLeftContent()}
      
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text
          variant={variant === 'compact' ? 'body' : 'subtitle'}
          style={[
            {
              color: getTextColor('title'),
              fontWeight: selected ? '600' : '500',
              marginBottom: subtitle || description ? 2 : 0,
            },
            titleStyle,
          ]}
          numberOfLines={multiline ? undefined : 1}
        >
          {title}
        </Text>
        
        {subtitle && (
          <Text
            variant="body"
            style={[
              {
                color: getTextColor('subtitle'),
                fontSize: variant === 'compact' ? 13 : 14,
                marginBottom: description ? 2 : 0,
              },
              subtitleStyle,
            ]}
            numberOfLines={multiline ? undefined : 1}
          >
            {subtitle}
          </Text>
        )}
        
        {description && (
          <Text
            variant="caption"
            style={[
              {
                color: getTextColor('description'),
                fontSize: 12,
                lineHeight: 16,
              },
              descriptionStyle,
            ]}
            numberOfLines={multiline ? undefined : 2}
          >
            {description}
          </Text>
        )}
      </View>
      
      {renderRightContent()}
    </View>
  );

  const itemWrapper = (
    <View>
      {(onPress && !disabled) || collapsible ? (
        <TouchableOpacity
          onPress={handlePress}
          disabled={disabled || loading}
          activeOpacity={0.7}
          {...props}
        >
          {content}
        </TouchableOpacity>
      ) : (
        content
      )}
      {renderChildren()}
    </View>
  );

  return itemWrapper;
}

export function ListSection({
  title,
  subtitle,
  children,
  headerStyle,
  titleStyle,
  subtitleStyle,
  // Collapsible features
  collapsible = false,
  expanded: controlledExpanded,
  onToggleExpand,
  headerIcon,
}: ListSectionProps) {
  const { theme } = useTheme();
  
  // Internal state for uncontrolled collapsible
  const [internalExpanded, setInternalExpanded] = useState(true);
  const expanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const handleToggleExpand = () => {
    if (collapsible) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      const newExpanded = !expanded;
      
      if (onToggleExpand) {
        onToggleExpand(newExpanded);
      } else {
        setInternalExpanded(newExpanded);
      }
    }
  };

  const renderHeader = () => {
    if (!title && !subtitle) return null;

    const headerContent = (
      <View
        style={[
          {
            paddingHorizontal: theme.sizes.md,
            paddingTop: theme.sizes.lg,
            paddingBottom: theme.sizes.sm,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
          headerStyle,
        ]}
      >
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          {headerIcon && (
            <Icon
              name={headerIcon}
              size={18}
              color={theme.colors.primary}
              style={{ marginRight: theme.sizes.sm }}
            />
          )}
          <View style={{ flex: 1 }}>
            {title && (
              <Text
                variant="body"
                style={[
                  {
                    fontWeight: '600',
                    color: theme.colors.text,
                    marginBottom: subtitle ? 2 : 0,
                  },
                  titleStyle,
                ]}
              >
                {title}
              </Text>
            )}
            {subtitle && (
              <Text
                variant="caption"
                style={[
                  {
                    color: theme.colors.textSecondary,
                  },
                  subtitleStyle,
                ]}
              >
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        
        {collapsible && (
          <TouchableOpacity
            onPress={handleToggleExpand}
            style={{
              padding: theme.sizes.xs,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon
              name={expanded ? "chevron-up-outline" : "chevron-down-outline"}
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
    );

    if (collapsible) {
      return (
        <TouchableOpacity onPress={handleToggleExpand} activeOpacity={0.7}>
          {headerContent}
        </TouchableOpacity>
      );
    }

    return headerContent;
  };

  return (
    <View>
      {renderHeader()}
      <View style={{ 
        overflow: 'hidden',
        display: collapsible ? (expanded ? 'flex' : 'none') : 'flex',
      }}>
        {children}
      </View>
    </View>
  );
}

export function ListDivider({ variant = 'full', style }: ListDividerProps) {
  const { theme } = useTheme();

  const getDividerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      height: 1,
      backgroundColor: theme.colors.border,
    };

    const variantStyles = {
      full: {},
      inset: {
        marginLeft: theme.sizes.md,
      },
      middle: {
        marginHorizontal: theme.sizes.md,
      },
      none: {
        height: 0,
        backgroundColor: 'transparent',
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
    };
  };

  return <View style={[getDividerStyle(), style]} />;
}