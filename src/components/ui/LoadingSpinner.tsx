import React from 'react';
import {
  View,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Text } from './Text';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
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

  return (
    <View style={[getContainerStyle(), style]}>
      <ActivityIndicator
        size={size}
        color={color || theme.colors.primary}
      />
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