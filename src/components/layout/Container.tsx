import React from 'react';
import {
  View,
  ViewProps,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface ContainerProps extends ViewProps {
  children: React.ReactNode;
  safeArea?: boolean;
  padding?: 'none' | 'small' | 'medium' | 'large';
  backgroundColor?: string;
}

export function Container({
  children,
  safeArea = true,
  padding = 'medium',
  backgroundColor,
  style,
  ...props
}: ContainerProps) {
  const { theme } = useTheme();

  const getContainerStyle = () => {
    const paddingStyles = {
      none: {},
      small: { padding: theme.sizes.sm },
      medium: { padding: theme.sizes.md },
      large: { padding: theme.sizes.lg },
    };

    const baseStyle = {
      flex: 1,
      backgroundColor: backgroundColor || theme.colors.background,
      ...paddingStyles[padding],
    };

    return baseStyle;
  };

  const Wrapper = safeArea ? SafeAreaView : View;

  return (
    <Wrapper style={[getContainerStyle(), style]} {...props}>
      {children}
    </Wrapper>
  );
}