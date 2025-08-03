import React from 'react';
import {
  View,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Text } from './Text';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  message?: string;
  overlay?: boolean;
  style?: ViewStyle;
}

export function LoadingSpinner({
  size = 'large',
  color,
  message,
  overlay = false,
  style,
}: LoadingSpinnerProps) {
  const { theme } = useTheme();

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      justifyContent: 'center',
      alignItems: 'center',
    };

    if (overlay) {
      return {
        ...baseStyle,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: theme.isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
      };
    }

    return {
      ...baseStyle,
      flex: 1,
      backgroundColor: theme.colors.background,
    };
  };

  const getSpinnerSize = () => {
    switch (size) {
      case 'small': return 'small' as const;
      case 'medium': return 'large' as const;
      case 'large': return 'large' as const;
      default: return 'large' as const;
    }
  };

  const getSpinnerStyle = () => {
    switch (size) {
      case 'small': return { transform: [{ scale: 0.8 }] };
      case 'medium': return { transform: [{ scale: 1 }] };
      case 'large': return { transform: [{ scale: 1.3 }] };
      default: return {};
    }
  };

  return (
    <View style={[getContainerStyle(), style]}>
      <View style={getSpinnerStyle()}>
        <ActivityIndicator
          size={getSpinnerSize()}
          color={color || theme.colors.primary}
        />
      </View>
      {message && (
        <Text
          variant="body"
          style={{
            marginTop: theme.sizes.md,
            textAlign: 'center',
            color: overlay ? '#FFFFFF' : theme.colors.text,
          }}
        >
          {message}
        </Text>
      )}
    </View>
  );
}