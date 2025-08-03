import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ViewStyle,
  ImageStyle,
  TouchableOpacityProps,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Text } from './Text';
import { Icon, IconName } from './Icon';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export type AvatarVariant = 'circle' | 'rounded' | 'square';
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';

interface AvatarProps extends TouchableOpacityProps {
  // Image properties
  source?: { uri: string } | number;
  alt?: string;
  
  // Fallback content
  name?: string;
  initials?: string;
  fallbackIcon?: IconName;
  
  // Styling
  size?: AvatarSize;
  variant?: AvatarVariant;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: number;
  
  // Status indicator
  status?: AvatarStatus;
  showStatus?: boolean;
  statusSize?: number;
  
  // Badge/notification
  badge?: string | number;
  showBadge?: boolean;
  badgeColor?: string;
  badgeTextColor?: string;
  
  // Interactive
  onPress?: () => void;
  disabled?: boolean;
  
  // Custom styles
  containerStyle?: ViewStyle;
  imageStyle?: ImageStyle;
}

export function Avatar({
  source,
  alt,
  name,
  initials,
  fallbackIcon = 'person-outline',
  size = 'md',
  variant = 'circle',
  backgroundColor,
  textColor,
  borderColor,
  borderWidth = 0,
  status,
  showStatus = false,
  statusSize,
  badge,
  showBadge = false,
  badgeColor,
  badgeTextColor,
  onPress,
  disabled = false,
  containerStyle,
  imageStyle,
  ...props
}: AvatarProps) {
  const { theme } = useTheme();

  // Get size dimensions
  const getSizeDimensions = () => {
    switch (size) {
      case 'xs':
        return {
          size: 24,
          fontSize: theme.fontSizes.xs,
          iconSize: 12,
          statusSize: statusSize || 6,
          badgeFontSize: 8,
          badgeMinSize: 12,
        };
      case 'sm':
        return {
          size: 32,
          fontSize: theme.fontSizes.sm,
          iconSize: 16,
          statusSize: statusSize || 8,
          badgeFontSize: 9,
          badgeMinSize: 14,
        };
      case 'md':
        return {
          size: 40,
          fontSize: theme.fontSizes.md,
          iconSize: 20,
          statusSize: statusSize || 10,
          badgeFontSize: 10,
          badgeMinSize: 16,
        };
      case 'lg':
        return {
          size: 56,
          fontSize: theme.fontSizes.lg,
          iconSize: 28,
          statusSize: statusSize || 12,
          badgeFontSize: 11,
          badgeMinSize: 18,
        };
      case 'xl':
        return {
          size: 72,
          fontSize: theme.fontSizes.xl,
          iconSize: 36,
          statusSize: statusSize || 14,
          badgeFontSize: 12,
          badgeMinSize: 20,
        };
      case 'xxl':
        return {
          size: 96,
          fontSize: theme.fontSizes.xxl,
          iconSize: 48,
          statusSize: statusSize || 16,
          badgeFontSize: 14,
          badgeMinSize: 24,
        };
      default:
        return {
          size: 40,
          fontSize: theme.fontSizes.md,
          iconSize: 20,
          statusSize: statusSize || 10,
          badgeFontSize: 10,
          badgeMinSize: 16,
        };
    }
  };

  // Get border radius based on variant
  const getBorderRadius = (dimensions: { size: number }) => {
    switch (variant) {
      case 'circle':
        return dimensions.size / 2;
      case 'rounded':
        return theme.borderRadius.md;
      case 'square':
        return theme.borderRadius.xs;
      default:
        return dimensions.size / 2;
    }
  };

  // Get status color
  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return theme.colors.success;
      case 'offline':
        return theme.colors.textSecondary;
      case 'busy':
        return theme.colors.error;
      case 'away':
        return theme.colors.warning;
      default:
        return theme.colors.textSecondary;
    }
  };

  // Generate initials from name
  const generateInitials = () => {
    if (initials) return initials.toUpperCase();
    if (name) {
      return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .substring(0, 2)
        .toUpperCase();
    }
    return '';
  };

  // Get fallback background color
  const getFallbackBackgroundColor = () => {
    if (backgroundColor) return backgroundColor;
    
    // Generate color based on name/initials for consistency
    const text = name || initials || '';
    const colors = [
      theme.colors.primary,
      theme.colors.secondary,
      theme.colors.success,
      theme.colors.warning,
    ];
    
    const hash = text.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    return colors[Math.abs(hash) % colors.length] + '40'; // 40 for opacity
  };

  const dimensions = getSizeDimensions();
  const borderRadius = getBorderRadius(dimensions);
  const fallbackBgColor = getFallbackBackgroundColor();
  const finalTextColor = textColor || theme.colors.text;

  // Avatar container style
  const avatarContainerStyle: ViewStyle = {
    width: dimensions.size,
    height: dimensions.size,
    borderRadius,
    backgroundColor: source ? 'transparent' : fallbackBgColor,
    borderWidth,
    borderColor: borderColor || theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  };

  // Image style
  const avatarImageStyle: ImageStyle = {
    width: dimensions.size,
    height: dimensions.size,
    borderRadius,
    ...imageStyle,
  };

  // Status indicator style
  const statusIndicatorStyle: ViewStyle = {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: dimensions.statusSize,
    height: dimensions.statusSize,
    borderRadius: dimensions.statusSize / 2,
    backgroundColor: getStatusColor(),
    borderWidth: 2,
    borderColor: theme.colors.surface,
  };

  // Badge style
  const badgeStyle: ViewStyle = {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: dimensions.badgeMinSize,
    height: dimensions.badgeMinSize,
    borderRadius: dimensions.badgeMinSize / 2,
    backgroundColor: badgeColor || theme.colors.error,
    borderWidth: 2,
    borderColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  };

  // Render avatar content
  const renderAvatarContent = () => {
    if (source) {
      return (
        <Image
          source={source}
          style={avatarImageStyle}
          accessibilityLabel={alt || name || 'Avatar'}
          resizeMode="cover"
        />
      );
    }

    const displayInitials = generateInitials();
    if (displayInitials) {
      return (
        <Text
          style={{
            fontSize: dimensions.fontSize,
            fontWeight: '600',
            color: finalTextColor,
          }}
        >
          {displayInitials}
        </Text>
      );
    }

    return (
      <Icon
        name={fallbackIcon}
        size={dimensions.iconSize}
        color={finalTextColor}
      />
    );
  };

  // Render status indicator
  const renderStatusIndicator = () => {
    if (!showStatus || !status) return null;
    return <View style={statusIndicatorStyle} />;
  };

  // Render badge
  const renderBadge = () => {
    if (!showBadge || (!badge && badge !== 0)) return null;
    
    const badgeText = typeof badge === 'number' && badge > 99 ? '99+' : String(badge);
    
    return (
      <View style={badgeStyle}>
        <Text
          style={{
            fontSize: dimensions.badgeFontSize,
            fontWeight: '600',
            color: badgeTextColor || 'white',
            textAlign: 'center',
          }}
          numberOfLines={1}
        >
          {badgeText}
        </Text>
      </View>
    );
  };

  // Main container
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[{ position: 'relative' }, containerStyle]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole={onPress ? 'button' : 'image'}
      accessibilityLabel={alt || name || 'Avatar'}
      {...(onPress ? props : {})}
    >
      <View style={avatarContainerStyle}>
        {renderAvatarContent()}
      </View>
      {renderStatusIndicator()}
      {renderBadge()}
    </Container>
  );
}