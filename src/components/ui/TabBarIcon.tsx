import React from 'react';
import { Icon, IconName } from './Icon';

interface TabBarIconProps {
  name: string;
  color: string;
  size?: number;
}

export function TabBarIcon({ name, color, size = 24 }: TabBarIconProps) {
  const getIconName = (iconName: string): IconName => {
    switch (iconName) {
      case 'home':
        return 'home';
      case 'home-outline':
        return 'home-outline';
      case 'compass':
        return 'compass';
      case 'compass-outline':
        return 'compass-outline';
      case 'person':
        return 'person';
      case 'person-outline':
        return 'person-outline';
      default:
        return 'ellipse';
    }
  };

  return (
    <Icon 
      name={getIconName(name)} 
      color={color} 
      size={size} 
    />
  );
}