import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Text } from './Text';

export function SplashLoader() {
  const { theme } = useTheme();

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    }}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text 
        variant="body" 
        style={{ 
          marginTop: theme.sizes.lg,
          color: theme.colors.textSecondary 
        }}
      >
        Loading...
      </Text>
    </View>
  );
}