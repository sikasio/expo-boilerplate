import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

export type IconName = keyof typeof Ionicons.glyphMap;

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: any;
}

export function Icon({ name, size = 24, color, style }: IconProps) {
  const { theme } = useTheme();

  return (
    <Ionicons
      name={name}
      size={size}
      color={color || theme.colors.text}
      style={style}
    />
  );
}