import React from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';

import { Container } from '@sikasio/expo-boilerplate/components/layout';
import { Text } from '@sikasio/expo-boilerplate/components/ui';
import { Button } from '@sikasio/expo-boilerplate/components/ui';
import { Icon } from '@sikasio/expo-boilerplate/components/ui';
import { Card } from '@sikasio/expo-boilerplate/components/ui';
import { List, ListItem } from '@sikasio/expo-boilerplate/components/ui';
import { ThemeStatusBar } from '@sikasio/expo-boilerplate/components/ui';
import { HeroSection } from '@sikasio/expo-boilerplate/components/ui';
import { useAuth } from '@sikasio/expo-boilerplate/contexts';
import { useTheme } from '@sikasio/expo-boilerplate/contexts';
import { AppConfig } from '@sikasio/expo-boilerplate/config';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const quickActions = [
    { icon: 'code-slash-outline', label: 'Components', color: theme.colors.primary },
    { icon: 'color-palette-outline', label: 'Themes', color: theme.colors.success },
    { icon: 'construct-outline', label: 'Utils', color: theme.colors.warning },
    { icon: 'settings-outline', label: 'Config', color: theme.colors.secondary },
  ];

  const stats = [
    { label: 'UI Components', value: '25+', icon: 'shapes-outline', trend: 'Ready' },
    { label: 'Navigation', value: 'Stack+Tab', icon: 'map-outline', trend: 'Expo Router' },
    { label: 'TypeScript', value: '100%', icon: 'code-outline', trend: 'Type Safe' },
  ];

  // Create scroll Y animated value for hero animation
  const scrollY = React.useRef(new Animated.Value(0)).current;


  const heroSectionProps = {
    colorScheme: "primary" as const,
    size: "medium" as const,
    fullScreen: true,
    scrollable: false,
    badge: "v2.0",
    title: user ? `Welcome back, ${user.name.split(' ')[0]}!` : AppConfig.name,
    subtitle: user ? 'Ready to build amazing apps?' : AppConfig.description,
    description: user ? 'Accelerate development with enterprise-grade components and patterns.' : AppConfig.tagline,
    scrollY: scrollY, // Pass animated scroll value
    hideOnScroll: true, // Enable scroll animation feature
    actionButtons: [
      {
        title: 'Get Started',
        variant: 'outline-white' as const,
        size: 'small' as const,
        leftIcon: 'rocket-outline' as const,
        onPress: () => {},
      },
      {
        title: 'Documentation',
        variant: 'outline-white' as const,
        size: 'small' as const,
        leftIcon: 'book-outline' as const,
        onPress: () => {},
      }
    ],
    rightActions: [
      {
        icon: (theme.isDark ? 'sunny-outline' : 'moon-outline') as const,
        onPress: toggleTheme,
        label: 'Toggle theme',
      },
      {
        icon: (user ? 'log-out-outline' : 'log-in-outline') as const,
        onPress: user ? logout : () => {},
        label: user ? 'Logout' : 'Login',
      }
    ]
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ThemeStatusBar />

      <HeroSection {...heroSectionProps} />

      <Animated.ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <Container padding="small">
          <View style={{ paddingVertical: theme.sizes.lg, paddingHorizontal: theme.sizes.sm }}>
            {/* Boilerplate Features */}
            <Text variant="subtitle" style={{ marginBottom: theme.sizes.md, fontWeight: '600' }}>
              Boilerplate Features
            </Text>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: theme.sizes.xl
            }}>
              {quickActions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    alignItems: 'center',
                    flex: 1,
                    marginHorizontal: theme.sizes.xs,
                  }}
                  activeOpacity={0.7}
                >
                  <View style={{
                    width: 60,
                    height: 60,
                    borderRadius: theme.borderRadius.lg,
                    backgroundColor: action.color + '20',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: theme.sizes.sm,
                  }}>
                    <Icon name={action.icon as any} size={26} color={action.color} />
                  </View>
                  <Text variant="caption" style={{
                    textAlign: 'center',
                    fontWeight: '500',
                    fontSize: 11,
                  }}>
                    {action.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Tech Stack */}
            <Text variant="subtitle" style={{ marginBottom: theme.sizes.md, fontWeight: '600' }}>
              Tech Stack
            </Text>
            <List variant="default" showDividers={false}>
              {stats.map((stat, index) => (
                <ListItem
                  key={index}
                  title={stat.value}
                  subtitle={stat.label}
                  leftIcon={stat.icon as any}
                  iconSize={24}
                  iconBackground={theme.colors.primary + '15'}
                  badge={{ text: stat.trend }}
                  titleStyle={{
                    fontWeight: '600',
                    fontSize: theme.fontSizes.md,
                  }}
                  subtitleStyle={{
                    color: theme.colors.textSecondary,
                    fontSize: theme.fontSizes.sm,
                  }}
                  itemStyle={{
                    backgroundColor: theme.colors.surface,
                    borderRadius: theme.borderRadius.md,
                    marginBottom: theme.sizes.sm,
                    paddingHorizontal: theme.sizes.md,
                    paddingVertical: theme.sizes.md,
                  }}
                />
              ))}
            </List>

            {/* Development Tools */}
            <Text variant="subtitle" style={{ marginBottom: theme.sizes.md, marginTop: theme.sizes.lg, fontWeight: '600' }}>
              Development Tools
            </Text>
            <List variant="default" showDividers={false}>
              <ListItem
                title="ESLint & Prettier configured"
                subtitle="Code quality & formatting"
                leftIcon="checkmark-circle-outline"
                iconSize={20}
                iconBackground={theme.colors.success + '15'}
                titleStyle={{
                  fontWeight: '500',
                  fontSize: theme.fontSizes.md,
                }}
                subtitleStyle={{
                  color: theme.colors.textSecondary,
                  fontSize: theme.fontSizes.sm,
                }}
                itemStyle={{
                  backgroundColor: theme.colors.surface,
                  borderRadius: theme.borderRadius.md,
                  marginBottom: theme.sizes.sm,
                  paddingHorizontal: theme.sizes.md,
                  paddingVertical: theme.sizes.md,
                }}
              />
              <ListItem
                title="Theme system with dark mode"
                subtitle="Customizable themes"
                leftIcon="color-palette-outline"
                iconSize={20}
                iconBackground={theme.colors.warning + '15'}
                titleStyle={{
                  fontWeight: '500',
                  fontSize: theme.fontSizes.md,
                }}
                subtitleStyle={{
                  color: theme.colors.textSecondary,
                  fontSize: theme.fontSizes.sm,
                }}
                itemStyle={{
                  backgroundColor: theme.colors.surface,
                  borderRadius: theme.borderRadius.md,
                  marginBottom: theme.sizes.sm,
                  paddingHorizontal: theme.sizes.md,
                  paddingVertical: theme.sizes.md,
                }}
              />
              <ListItem
                title="Authentication & routing"
                subtitle="Ready to use patterns"
                leftIcon="shield-checkmark-outline"
                iconSize={20}
                iconBackground={theme.colors.primary + '15'}
                titleStyle={{
                  fontWeight: '500',
                  fontSize: theme.fontSizes.md,
                }}
                subtitleStyle={{
                  color: theme.colors.textSecondary,
                  fontSize: theme.fontSizes.sm,
                }}
                itemStyle={{
                  backgroundColor: theme.colors.surface,
                  borderRadius: theme.borderRadius.md,
                  marginBottom: theme.sizes.sm,
                  paddingHorizontal: theme.sizes.md,
                  paddingVertical: theme.sizes.md,
                }}
              />
            </List>

            {!user && (
              <Card
                variant="outlined"
                colorScheme="primary"
                style={{ marginBottom: 70, marginTop: theme.sizes.xl }}
              >
                <View style={{ alignItems: 'center', paddingVertical: theme.sizes.md }}>
                  <Icon
                    name="rocket-outline"
                    size={48}
                    color={theme.colors.primary}
                    style={{ marginBottom: theme.sizes.md }}
                  />
                  <Text variant="subtitle" style={{
                    textAlign: 'center',
                    marginBottom: theme.sizes.sm,
                    fontWeight: '600',
                  }}>
                    Get Started with {AppConfig.name}
                  </Text>
                  <Text variant="body" style={{
                    textAlign: 'center',
                    color: theme.colors.textSecondary,
                    marginBottom: theme.sizes.lg,
                  }}>
                    Sign in to explore the boilerplate features, components, and development tools.
                  </Text>
                  <View style={{ flexDirection: 'row', gap: theme.sizes.sm }}>
                    <Button
                      title="Sign In"
                      variant="primary"
                      leftIcon="log-in-outline"
                      style={{ flex: 1 }}
                    />
                    <Button
                      title="Explore"
                      variant="outline"
                      leftIcon="compass-outline"
                      style={{ flex: 1 }}
                    />
                  </View>
                </View>
              </Card>
            )}
          </View>
        </Container>
      </Animated.ScrollView>
    </View>
  );
}