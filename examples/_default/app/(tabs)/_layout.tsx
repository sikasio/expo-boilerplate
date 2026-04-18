import React from 'react';
import { BottomTabNavigator, TabConfig } from '@sikasio/expo-boilerplate/components/navigation';
import { TabNavigatorDesign } from '@sikasio/expo-boilerplate/config';

export default function TabLayout() {
  const tabs: TabConfig[] = [
    {
      name: 'index',
      title: 'Home',
      icon: 'home-outline',
      iconFocused: 'home',
    },
    {
      name: 'explore',
      title: 'Explore',
      icon: 'compass-outline',
      iconFocused: 'compass',
    },
    {
      name: 'icons',
      title: 'Icons',
      icon: 'star-outline',
      iconFocused: 'star',
    },
    {
      name: 'components',
      title: 'Components',
      icon: 'grid-outline',
      iconFocused: 'grid',
    },
    {
      name: 'screens',
      title: 'Screens',
      icon: 'phone-portrait-outline',
      iconFocused: 'phone-portrait',
    },
  ];

  // Try different designs: 'default' | 'floating' | 'bubble'
  const design: TabNavigatorDesign = 'bubble';

  return <BottomTabNavigator tabs={tabs} design={design} />;
}