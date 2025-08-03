import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, View, Animated, TouchableOpacity } from 'react-native';

import { useTheme } from '../../contexts/ThemeContext';
import { TabBarIcon } from '../ui/TabBarIcon';
import { IconName } from '../ui/Icon';
import { Text } from '../ui/Text';
import { getTabBarDimensions, NAVIGATION_CONSTANTS, TabNavigatorDesign } from '../../config/navigation';

export interface TabConfig {
  name: string;
  title: string;
  icon: IconName;
  iconFocused: IconName;
}

interface BottomTabNavigatorProps {
  tabs: TabConfig[];
  design?: TabNavigatorDesign;
}

export function BottomTabNavigator({ tabs, design = 'default' }: BottomTabNavigatorProps) {
  const { theme } = useTheme();

  const getTabBarStyle = () => {
    const dimensions = getTabBarDimensions(design);
    const baseStyle = {
      backgroundColor: theme.colors.surface,
      borderTopColor: theme.colors.border,
    };

    switch (design) {
      case 'floating':
        return {
          position: 'absolute' as const,
          bottom: dimensions.bottomOffset,
          marginHorizontal: 16,
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.xxl,
          paddingTop: dimensions.paddingTop,
          paddingBottom: dimensions.paddingBottom,
          height: dimensions.height,
          borderTopWidth: 0,
          shadowColor: theme.colors.text,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 15,
        };

      default:
        return {
          ...baseStyle,
          paddingTop: dimensions.paddingTop,
          paddingBottom: dimensions.paddingBottom,
          height: dimensions.height,
          shadowColor: theme.colors.text,
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 5,
        };
    }
  };

  const CustomTabBar = ({ state, descriptors, navigation }: any) => {
    if (design === 'bubble') {
      const dimensions = getTabBarDimensions(design);
      return (
        <View style={{
          position: 'absolute',
          bottom: dimensions.bottomOffset,
          left: 16,
          right: 16,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View
            key={`bubble-container-${state.index}`}
            style={{
              flex: 1,
              flexDirection: 'row',
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.xxl,
              paddingHorizontal: 10,
              paddingVertical: dimensions.paddingTop,
              shadowColor: theme.colors.text,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 15,
              elevation: 20,
              justifyContent: 'center',
            }}>
            {state.routes.map((route: any, index: number) => {
              const isFocused = state.index === index;
              const tab = tabs.find(t => t.name === route.name);

              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };

              return (
                <TouchableOpacity
                  key={`${route.key}-${state.index}-${isFocused}`}
                  onPress={onPress}
                  style={{
                    flex: isFocused ? 0 : 1,
                    minWidth: isFocused ? 'auto' : 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: isFocused ? 16 : 8,
                    paddingVertical: 8,
                    marginHorizontal: 4,
                    borderRadius: theme.borderRadius.lg,
                    backgroundColor: isFocused
                      ? theme.colors.primary + '20'
                      : 'transparent',
                    transform: [
                      {
                        scale: isFocused ? 1.05 : 1,
                      },
                    ],
                  }}
                >
                  <Animated.View
                    style={{
                      opacity: 1,
                      transform: [
                        {
                          translateY: isFocused ? -2 : 0,
                        },
                      ],
                    }}
                  >
                    <TabBarIcon
                      name={isFocused ? tab!.iconFocused : tab!.icon}
                      color={isFocused ? theme.colors.primary : theme.colors.textSecondary}
                      size={isFocused ? 24 : 28}
                    />
                  </Animated.View>
                  {isFocused && (
                    <Animated.View
                      style={{
                        opacity: 1,
                        marginTop: 4,
                      }}
                    >
                      <Text
                        variant="caption"
                        style={{
                          color: theme.colors.primary,
                          fontSize: 11,
                          fontWeight: '600',
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {tab!.title}
                      </Text>
                    </Animated.View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: getTabBarStyle(),
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        headerShown: false,
        tabBarHideOnKeyboard: true,
        ...(design === 'floating' && {
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
            paddingBottom: 0,
          },
          tabBarIconStyle: {
            marginTop: 0,
          },
        }),
      }}
      tabBar={design === 'bubble' ? CustomTabBar : undefined}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, focused }) => {
              if (design === 'floating') {
                return (
                  <Animated.View
                    style={{
                      transform: [
                        {
                          scale: focused ? 1.2 : 1,
                        },
                        {
                          translateY: focused ? -2 : 0,
                        },
                      ],
                    }}
                  >
                    <TabBarIcon
                      name={focused ? tab.iconFocused : tab.icon}
                      color={color}
                      size={26}
                    />
                  </Animated.View>
                );
              }

              return (
                <TabBarIcon
                  name={focused ? tab.iconFocused : tab.icon}
                  color={color}
                />
              );
            },
          }}
        />
      ))}
    </Tabs>
  );
}