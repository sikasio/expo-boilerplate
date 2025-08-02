import React from 'react';
import { Icon, IconName } from './Icon';

interface TabBarIconProps {
  name: IconName;
  color: string;
  size?: number;
}

export function TabBarIcon({ name, color, size = 24 }: TabBarIconProps) {
  return (
    <Icon 
      name={name} 
      color={color} 
      size={size} 
    />
  );
}