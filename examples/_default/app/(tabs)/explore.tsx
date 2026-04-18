import React from 'react';
import { ScrollView, View } from 'react-native';

import { Container } from '@sikasio/expo-boilerplate/components/layout';
import { Text } from '@sikasio/expo-boilerplate/components/ui';
import { Card } from '@sikasio/expo-boilerplate/components/ui';
import { Icon } from '@sikasio/expo-boilerplate/components/ui';
import { Header } from '@sikasio/expo-boilerplate/components/navigation';
import { Button } from '@sikasio/expo-boilerplate/components/ui';
import { useTheme } from '@sikasio/expo-boilerplate/contexts';

export default function ExploreScreen() {
  const { theme, toggleTheme } = useTheme();

  const exploreItems = [
    {
      id: '1',
      title: 'Getting Started',
      description: 'Learn the basics of this boilerplate',
      category: 'Tutorial',
      icon: 'school-outline' as const,
    },
    {
      id: '2',
      title: 'API Integration',
      description: 'How to integrate with your backend API',
      category: 'Development',
      icon: 'server-outline' as const,
    },
    {
      id: '3',
      title: 'UI Components',
      description: 'Explore the available UI components',
      category: 'Design',
      icon: 'color-palette-outline' as const,
    },
  ];

  return (
    <Container>
      <Header 
        title="Explore"
        subtitle="Discover features and tutorials"
        showBackButton={true}
        backButtonProps={{
          variant: 'icon-only',
          size: 'medium'
        }}
        rightComponent={
          <Button
            variant="ghost"
            size="small"
            leftIcon="search-outline"
            onPress={() => {
              // Add search functionality
            }}
          />
        }
      />
      <ScrollView 
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        
        {exploreItems.map((item) => (
          <Card 
            key={item.id}
            style={{ marginBottom: theme.sizes.md }}
          >
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              marginBottom: theme.sizes.sm 
            }}>
              <Icon 
                name={item.icon} 
                size={24} 
                color={theme.colors.primary}
                style={{ marginRight: theme.sizes.sm }}
              />
              <Text variant="subtitle">
                {item.title}
              </Text>
            </View>
            <Text variant="caption" style={{ 
              color: theme.colors.primary,
              marginBottom: theme.sizes.xs 
            }}>
              {item.category}
            </Text>
            <Text variant="body">
              {item.description}
            </Text>
          </Card>
        ))}
      </ScrollView>
    </Container>
  );
}