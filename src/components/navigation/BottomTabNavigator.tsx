import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, View, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { use3ButtonNavigationDetector } from '@/hooks/use3ButtonNavigationDetector';

import { useTheme } from '@/contexts/ThemeContext';
import { useSplash } from '@/contexts/SplashContext';
import { TabBarIcon } from '@/components/ui/TabBarIcon';
import { IconName } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { getTabBarDimensions, NAVIGATION_CONSTANTS, TabNavigatorDesign } from '@/config/navigation';

export interface TabConfig {
  name: string;
  title: string;
  icon: IconName;
  iconFocused: IconName;
  badge?: boolean;
  badgeCount?: number;
}

interface BottomTabNavigatorProps {
  tabs: TabConfig[];
  design?: TabNavigatorDesign;
}

export function BottomTabNavigator({ tabs, design = 'default' }: BottomTabNavigatorProps) {
  const { theme } = useTheme();
  const { isSplashActive } = useSplash();
  const { androidBottomOffset } = use3ButtonNavigationDetector();

  const getTabBarStyle = () => {
    const dimensions = getTabBarDimensions(design);

    // Android-only: Add small extra padding
    const androidExtraTopPadding = Platform.OS === 'android' ? 8 : 0;
    const androidExtraBottomPadding = Platform.OS === 'android' ? 8 + androidBottomOffset : 0;

    const baseStyle = {
      backgroundColor: theme.colors.surface,
      borderTopColor: theme.colors.border,
    };

    switch (design) {
      case 'floating':
        return {
          position: 'absolute' as const,
          bottom: dimensions.bottomOffset + androidBottomOffset,
          marginHorizontal: 16,
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.xxl,
          paddingTop: dimensions.paddingTop + androidExtraTopPadding,
          paddingBottom: dimensions.paddingBottom + androidExtraBottomPadding,
          height: dimensions.height + androidExtraTopPadding + androidExtraBottomPadding,
          borderTopWidth: 0,
          ...(theme.isDark ? {} : {
            shadowColor: theme.colors.text,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 15,
          }),
        };

      case 'default':
        return {
          backgroundColor: theme.colors.surface,
          paddingTop: dimensions.paddingTop + androidExtraTopPadding,
          paddingBottom: dimensions.paddingBottom + androidExtraBottomPadding,
          height: dimensions.height + androidExtraTopPadding + androidExtraBottomPadding,
          borderTopWidth: 0.2,
        };

      default:
        return {
          ...baseStyle,
          paddingTop: dimensions.paddingTop + androidExtraTopPadding,
          paddingBottom: dimensions.paddingBottom + androidExtraBottomPadding,
          height: dimensions.height + androidExtraTopPadding + androidExtraBottomPadding,
          ...(theme.isDark ? {} : {
            shadowColor: theme.colors.text,
            shadowOffset: { width: 0, height: -1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 5,
          }),
        };
    }
  };

  const CustomTabBar = ({ state, descriptors, navigation }: any) => {
    if (design === 'bubble') {
      // Hide tab bar when splash is active
      if (isSplashActive) {
        return null;
      }

      const dimensions = getTabBarDimensions(design);
      // Android-only: Add small extra padding for bubble design
      const androidExtraBottomPadding = Platform.OS === 'android' ? 8 + androidBottomOffset : 0;
      const androidExtraTopPadding = Platform.OS === 'android' ? 8 : 0;

      return (
        <View style={{
          position: 'absolute',
          bottom: dimensions.bottomOffset + androidBottomOffset,
          left: 16,
          right: 16,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: androidExtraTopPadding,
          paddingBottom: androidExtraBottomPadding,
        }}>
          <View
            key={`bubble-container-${state.index}`}
            style={{
              flex: 1,
              flexDirection: 'row',
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.xxl,
              paddingHorizontal: 6,
              paddingVertical: dimensions.paddingTop,
              justifyContent: 'center',
              ...(theme.isDark ? {
                borderWidth: 1,
                borderColor: theme.colors.border,
              } : {
                shadowColor: theme.colors.text,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 15,
                elevation: 20,
              }),
            }}>
            {state.routes.map((route: any, index: number) => {
              const isFocused = state.index === index;
              const tab = tabs.find(t => t.name === route.name);

              // Skip rendering if tab config is not found (common during auth state changes)
              if (!tab) {
                // console.log(`Tab config not found for route: ${route.name} (likely due to role change or logout)`);
                return null;
              }

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
                    paddingHorizontal: isFocused ? 14 : 8,
                    paddingVertical: 8,
                    paddingBottom: 6,
                    marginHorizontal: 2,
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
                      position: 'relative',
                    }}
                  >
                    <TabBarIcon
                      name={isFocused ? tab.iconFocused : tab.icon}
                      color={isFocused ? theme.colors.primary : theme.colors.textSecondary}
                      size={isFocused ? 24 : 28}
                    />
                    {/* Badge/Notification Dot */}
                    {tab.badge && !isFocused && (
                      <View
                        style={{
                          position: 'absolute',
                          top: -7,
                          right: -7,
                          backgroundColor: theme.colors.error,
                          borderRadius: 8,
                          minWidth: 14,
                          height: 14,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderWidth: 2,
                          borderColor: theme.colors.surface,
                        }}
                      >
                        {tab.badgeCount && tab.badgeCount > 0 && (
                          <Text
                            style={{
                              color: 'white',
                              fontSize: 10,
                              fontWeight: '700',
                              lineHeight: 12,
                            }}
                          >
                            {tab.badgeCount > 9 ? '9+' : tab.badgeCount}
                          </Text>
                        )}
                      </View>
                    )}
                  </Animated.View>
                  {isFocused && (
                    <Animated.View
                      style={{
                        opacity: 1,
                      }}
                    >
                      <Text
                        variant="caption"
                        style={{
                          color: theme.colors.primary,
                          fontWeight: '600',
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {tab.title}
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