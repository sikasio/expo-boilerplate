import React, { useState, useRef } from 'react';
import { ScrollView, View, Alert, Switch, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

import { Container } from '@sikasio/expo-boilerplate/components/layout';
import { Text } from '@sikasio/expo-boilerplate/components/ui';
import { Button } from '@sikasio/expo-boilerplate/components/ui';
import { ButtonGroup } from '@sikasio/expo-boilerplate/components/ui';
import { TextInput, MaskedTextInput, OTPInput, Select } from '@sikasio/expo-boilerplate/components/forms';
import { Card } from '@sikasio/expo-boilerplate/components/ui';
import { Icon } from '@sikasio/expo-boilerplate/components/ui';
import { LoadingSpinner } from '@sikasio/expo-boilerplate/components/ui';
import { Avatar } from '@sikasio/expo-boilerplate/components/ui';
import { Checkbox } from '@sikasio/expo-boilerplate/components/ui';
import { List, ListItem, ListSection, ListDivider } from '@sikasio/expo-boilerplate/components/ui';
import { HorizontalCardScroll } from '@sikasio/expo-boilerplate/components/ui';
import { Modal } from '@sikasio/expo-boilerplate/components/ui';
import { GallerySlider, GallerySliderItem } from '@sikasio/expo-boilerplate/components/ui';
import { ThemeStatusBar } from '@sikasio/expo-boilerplate/components/ui';
import { BackButton, Header } from '@sikasio/expo-boilerplate/components/navigation';
import { useTheme } from '@sikasio/expo-boilerplate/contexts';
import { getCurrentTabBarDesign, getFloatingButtonBottom, getScrollViewContentInset, NAVIGATION_CONSTANTS } from '@sikasio/expo-boilerplate/config';

export default function ComponentsScreen() {
  const { theme, toggleTheme } = useTheme();
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [switchValue, setSwitchValue] = useState(false);
  const [showQuickNav, setShowQuickNav] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [showBasicModal, setShowBasicModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showScrollableModal, setShowScrollableModal] = useState(false);

  // ScrollView ref for programmatic scrolling
  const scrollViewRef = useRef<ScrollView>(null);

  // Section positions for quick navigation scrolling
  const sectionPositions = useRef<{ [key: string]: number }>({});

  // Define all demo sections
  const demoSections = [
    { id: 'typography', title: 'Typography', icon: 'text-outline' },
    { id: 'buttons', title: 'Buttons', icon: 'radio-button-on-outline' },
    { id: 'button-groups', title: 'Button Groups', icon: 'options-outline' },
    { id: 'checkboxes', title: 'Checkboxes', icon: 'checkmark-outline' },
    { id: 'lists', title: 'Lists', icon: 'list-outline' },
    { id: 'navigation', title: 'Navigation', icon: 'navigate-outline' },
    { id: 'text-inputs', title: 'Text Inputs', icon: 'create-outline' },
    { id: 'masked-inputs', title: 'Masked Inputs', icon: 'keypad-outline' },
    { id: 'otp-inputs', title: 'OTP Inputs', icon: 'lock-closed-outline' },
    { id: 'selects', title: 'Select Components', icon: 'chevron-down-outline' },
    { id: 'icons', title: 'Icons', icon: 'star-outline' },
    { id: 'loading', title: 'Loading Spinners', icon: 'refresh-outline' },
    { id: 'cards', title: 'Cards', icon: 'card-outline' },
    { id: 'horizontal-cards', title: 'Horizontal Cards', icon: 'albums-outline' },
    { id: 'gallery-slider', title: 'Gallery Slider', icon: 'images-outline' },
    { id: 'avatars', title: 'Avatars', icon: 'person-circle-outline' },
    { id: 'modals', title: 'Modals', icon: 'layers-outline' },
    { id: 'theme', title: 'Theme Controls', icon: 'color-palette-outline' },
    { id: 'colors', title: 'Color Palette', icon: 'color-filter-outline' },
  ];

  // Function to scroll to specific section
  const scrollToSection = (sectionId: string) => {
    const position = sectionPositions.current[sectionId];
    if (position !== undefined && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: position - 20, animated: true });
      setShowQuickNav(false);
      setSearchQuery('');
    }
  };

  // Filter sections based on search query
  const filteredSections = demoSections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to measure section position
  const onSectionLayout = (sectionId: string, event: any) => {
    const { y } = event.nativeEvent.layout;
    sectionPositions.current[sectionId] = y;
  };

  // Get current tab bar design and calculate spacing
  const currentTabBarDesign = getCurrentTabBarDesign();
  const floatingButtonBottom = getFloatingButtonBottom(currentTabBarDesign, 0, 0);
  const contentInset = getScrollViewContentInset(currentTabBarDesign, 0);

  // Select component demo states (keeping only the ones that are actually used)
  const [selectedCountry, setSelectedCountry] = useState<string | number>();
  const [selectedSkills, setSelectedSkills] = useState<(string | number)[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | number>();
  const [selectedPriority, setSelectedPriority] = useState<string | number>();
  const [selectedCategory, setSelectedCategory] = useState<string | number>();
  const [selectedLanguages, setSelectedLanguages] = useState<(string | number)[]>([]);

  // Gallery Slider demo data
  const galleryItems: GallerySliderItem[] = [
    {
      id: '1',
      uri: 'https://picsum.photos/800/400?random=1',
      title: 'Beautiful Landscape',
      description: 'Stunning mountain view with crystal clear waters'
    },
    {
      id: '2',
      uri: 'https://picsum.photos/800/400?random=2',
      title: 'Urban Architecture',
      description: 'Modern city skyline with impressive buildings'
    },
    {
      id: '3',
      uri: 'https://picsum.photos/800/400?random=3',
      title: 'Nature Photography',
      description: 'Peaceful forest scene with natural lighting'
    },
    {
      id: '4',
      uri: 'https://picsum.photos/800/400?random=4',
      title: 'Ocean Waves',
      description: 'Serene beach with gentle waves and clear sky'
    },
    {
      id: '5',
      uri: 'https://picsum.photos/800/400?random=5',
      title: 'Mountain Peak',
      description: 'Majestic snow-capped mountain at sunrise'
    }
  ];
  const [selectedSize, setSelectedSize] = useState<string | number>();
  const [selectedTimezone, setSelectedTimezone] = useState<string | number>();
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<(string | number)[]>([]);
  const [selectedColorScheme, setSelectedColorScheme] = useState<string | number>();

  // ButtonGroup states
  const [selectedViewMode, setSelectedViewMode] = useState<number[]>([0]);
  const [selectedFilters, setSelectedFilters] = useState<number[]>([]);
  const [selectedAlignment, setSelectedAlignment] = useState<number[]>([1]);
  const [selectedTabs, setSelectedTabs] = useState<number[]>([0]);

  // Checkbox states
  const [basicCheckbox, setBasicCheckbox] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [agreeToNewsletter, setAgreeToNewsletter] = useState(false);
  const [selectAllItems, setSelectAllItems] = useState(false);
  const [item1Selected, setItem1Selected] = useState(true);
  const [item2Selected, setItem2Selected] = useState(false);
  const [item3Selected, setItem3Selected] = useState(true);
  const [customCheckbox, setCustomCheckbox] = useState(false);
  const [errorCheckbox, setErrorCheckbox] = useState(false);
  const [disabledCheckbox] = useState(true);
  const [animatedCheckbox, setAnimatedCheckbox] = useState(false);

  // List states
  const [selectedListItem, setSelectedListItem] = useState<string | null>(null);
  const [listItems, setListItems] = useState([
    { id: '1', title: 'Inbox', count: 5, selected: false },
    { id: '2', title: 'Starred', count: 2, selected: false },
    { id: '3', title: 'Sent Mail', count: 0, selected: false },
    { id: '4', title: 'Drafts', count: 3, selected: false },
  ]);


  const handleButtonPress = (message: string) => {
    Alert.alert('Button Pressed', message);
  };

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <Container>
      <ThemeStatusBar />
      <Header
        title="Component Library"
        subtitle="UI Components Showcase"
        showBackButton={true}
        backButtonProps={{
          variant: 'icon-only',
          size: 'medium'
        }}
        rightComponent={
          <View style={{ flexDirection: 'row', gap: theme.sizes.xs }}>
            <Button
              variant="ghost"
              size="small"
              leftIcon="list-outline"
              onPress={() => setShowQuickNav(!showQuickNav)}
            />
          </View>
        }
      />

      {/* Quick Navigation Overlay */}
      {showQuickNav && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: theme.colors.background + 'F0',
          zIndex: 1000,
          paddingTop: 80,
          paddingHorizontal: theme.sizes.md,
        }}>
          <View style={{
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.lg,
            maxHeight: '75%',
            shadowColor: theme.colors.text,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 15,
          }}>
            <View style={{
              padding: theme.sizes.md,
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.border,
            }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: theme.sizes.sm,
              }}>
                <Text variant="body" style={{ fontWeight: '600', fontSize: 16 }}>
                  Quick Navigation
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowQuickNav(false);
                    setSearchQuery('');
                  }}
                  style={{
                    padding: theme.sizes.xs,
                    borderRadius: theme.borderRadius.sm,
                  }}
                >
                  <Icon name="close-outline" size={20} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <TextInput
                placeholder="Search components..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                leftIcon="search-outline"
                containerStyle={{ marginBottom: 0 }}
              />
            </View>

            <ScrollView style={{ maxHeight: 400 }} showsVerticalScrollIndicator={false}>
              <View style={{ padding: theme.sizes.sm }}>
                {filteredSections.length > 0 ? (
                  <>
                    {searchQuery.length > 0 && (
                      <Text variant="caption" style={{
                        color: theme.colors.textSecondary,
                        marginBottom: theme.sizes.xs,
                        textAlign: 'center'
                      }}>
                        {filteredSections.length} result{filteredSections.length !== 1 ? 's' : ''} found
                      </Text>
                    )}
                    <View style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      gap: theme.sizes.xs,
                    }}>
                      {filteredSections.map((section, index) => (
                        <TouchableOpacity
                          key={section.id}
                          onPress={() => scrollToSection(section.id)}
                          style={{
                            width: '31%', // Three columns with gaps
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: theme.sizes.xs,
                            borderRadius: theme.borderRadius.md,
                            marginBottom: theme.sizes.xs,
                            backgroundColor: theme.colors.background + '80',
                            borderWidth: 1,
                            borderColor: theme.colors.border + '40',
                          }}
                          activeOpacity={0.7}
                        >
                          <View style={{
                            width: 28,
                            height: 28,
                            borderRadius: theme.borderRadius.sm,
                            backgroundColor: theme.colors.primary + '20',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 4,
                          }}>
                            <Icon name={section.icon as any} size={16} color={theme.colors.primary} />
                          </View>
                          <Text variant="caption" style={{
                            fontWeight: '600',
                            fontSize: 11,
                            textAlign: 'center',
                            marginBottom: 2,
                            lineHeight: 13,
                          }} numberOfLines={2}>
                            {section.title}
                          </Text>
                          <Text variant="caption" style={{
                            color: theme.colors.textSecondary,
                            fontSize: 9,
                            textAlign: 'center',
                          }}>
                            #{demoSections.findIndex(s => s.id === section.id) + 1}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </>
                ) : (
                  <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: theme.sizes.lg
                  }}>
                    <Icon name="search-outline" size={32} color={theme.colors.textSecondary} />
                    <Text variant="caption" style={{
                      color: theme.colors.textSecondary,
                      marginTop: theme.sizes.xs,
                      textAlign: 'center'
                    }}>
                      No components found matching "{searchQuery}"
                    </Text>
                    <Button
                      title="Clear Search"
                      variant="ghost"
                      size="small"
                      onPress={() => setSearchQuery('')}
                      style={{ marginTop: theme.sizes.xs }}
                    />
                  </View>
                )}
              </View>
            </ScrollView>

            <View style={{
              padding: theme.sizes.sm,
              borderTopWidth: 1,
              borderTopColor: theme.colors.border,
            }}>
              <View style={{
                flexDirection: 'row',
                gap: theme.sizes.xs,
                marginBottom: theme.sizes.xs
              }}>
                <Button
                  title="Top"
                  variant="outline"
                  size="small"
                  onPress={() => {
                    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
                    setShowQuickNav(false);
                    setSearchQuery('');
                  }}
                  leftIcon="arrow-up-outline"
                  style={{ flex: 1 }}
                />
                <Button
                  title="Bottom"
                  variant="outline"
                  size="small"
                  onPress={() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                    setShowQuickNav(false);
                    setSearchQuery('');
                  }}
                  leftIcon="arrow-down-outline"
                  style={{ flex: 1 }}
                />
              </View>
              <Button
                title="Close Navigation"
                variant="ghost"
                size="small"
                onPress={() => {
                  setShowQuickNav(false);
                  setSearchQuery('');
                }}
                leftIcon="close-outline"
              />
            </View>
          </View>
        </View>
      )}

      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: contentInset.bottom }}
      >

        {/* Introduction */}
        <Card style={{ marginBottom: theme.sizes.md }}>
          <Text variant="subtitle" style={{ marginBottom: theme.sizes.sm, fontWeight: '600' }}>
            Welcome to Component Library
          </Text>
          <Text variant="caption" style={{ color: theme.colors.textSecondary, marginBottom: theme.sizes.md, fontSize: theme.fontSizes.sm }}>
            Explore our comprehensive collection of UI components. Each component is designed with
            accessibility, flexibility, and modern design principles in mind.
          </Text>
          <View style={{ flexDirection: 'row', gap: theme.sizes.sm }}>
            <Button
              title="View Screen Examples"
              variant="primary"
              size="small"
              rightIcon="arrow-forward-outline"
              onPress={() => router.push('/screens')}
            />
          </View>
        </Card>

        {/* Typography Section */}
        <Card
          style={{ marginBottom: theme.sizes.lg }}
          onLayout={(event) => onSectionLayout('typography', event)}
        >
          <Text variant="subtitle" style={{ marginBottom: theme.sizes.md }}>
            Typography Variants
          </Text>
          <Text variant="title" style={{ marginBottom: theme.sizes.sm }}>
            Title - Main headings and page titles
          </Text>
          <Text variant="subtitle" style={{ marginBottom: theme.sizes.sm }}>
            Subtitle - Section headers and card titles
          </Text>
          <Text variant="body" style={{ marginBottom: theme.sizes.sm }}>
            Body - Regular content, descriptions, and paragraphs for reading
          </Text>
          <Text variant="caption" style={{ marginBottom: theme.sizes.sm }}>
            Caption - Small text for metadata and secondary information
          </Text>
          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>
            Label - Form field labels and input descriptions
          </Text>

          {/* Color variations */}
          <Text variant="body" style={{ color: theme.colors.primary, marginBottom: theme.sizes.xs }}>
            Primary colored text
          </Text>
          <Text variant="body" style={{ color: theme.colors.success, marginBottom: theme.sizes.xs }}>
            Success colored text
          </Text>
          <Text variant="body" style={{ color: theme.colors.warning, marginBottom: theme.sizes.xs }}>
            Warning colored text
          </Text>
          <Text variant="body" style={{ color: theme.colors.error, marginBottom: theme.sizes.xs }}>
            Error colored text
          </Text>
          <Text variant="body" style={{ color: theme.colors.textSecondary }}>
            Secondary text color
          </Text>
        </Card>

        {/* Button Variants */}
        <Card
          style={{ marginBottom: theme.sizes.lg }}
          onLayout={(event) => onSectionLayout('buttons', event)}
        >
          <Text variant="subtitle" style={{ marginBottom: theme.sizes.md }}>
            Button Variants
          </Text>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Primary Buttons:</Text>
          <Button
            title="Primary Default"
            onPress={() => handleButtonPress('Primary button pressed')}
            style={{ marginBottom: theme.sizes.sm }}
          />
          <Button
            title="Primary with Left Icon"
            onPress={() => handleButtonPress('Primary with left icon')}
            leftIcon="checkmark-outline"
            style={{ marginBottom: theme.sizes.sm }}
          />
          <Button
            title="Primary with Right Icon"
            onPress={() => handleButtonPress('Primary with right icon')}
            rightIcon="arrow-forward-outline"
            style={{ marginBottom: theme.sizes.sm }}
          />
          <Button
            title="Primary with Both Icons"
            onPress={() => handleButtonPress('Primary with both icons')}
            leftIcon="star-outline"
            rightIcon="chevron-forward-outline"
            style={{ marginBottom: theme.sizes.md }}
          />

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Secondary Buttons:</Text>
          <Button
            title="Secondary Default"
            variant="secondary"
            onPress={() => handleButtonPress('Secondary button')}
            style={{ marginBottom: theme.sizes.sm }}
          />
          <Button
            title="Secondary with Icon"
            variant="secondary"
            onPress={() => handleButtonPress('Secondary with icon')}
            leftIcon="heart-outline"
            style={{ marginBottom: theme.sizes.md }}
          />

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Outline Buttons:</Text>
          <Button
            title="Outline Default"
            variant="outline"
            onPress={() => handleButtonPress('Outline button')}
            style={{ marginBottom: theme.sizes.sm }}
          />
          <Button
            title="Outline with Icon"
            variant="outline"
            onPress={() => handleButtonPress('Outline with icon')}
            leftIcon="bookmark-outline"
            style={{ marginBottom: theme.sizes.sm }}
          />
          <View style={{
            backgroundColor: theme.colors.primary,
            padding: theme.sizes.md,
            borderRadius: theme.borderRadius.md,
            marginBottom: theme.sizes.md
          }}>
            <Text variant="caption" style={{
              color: '#FFFFFF',
              marginBottom: theme.sizes.sm,
              textAlign: 'center'
            }}>
              White Outline (on dark background)
            </Text>
            <Button
              title="White Outline"
              variant="outline-white"
              onPress={() => handleButtonPress('White outline button')}
              style={{ marginBottom: theme.sizes.sm }}
            />
            <Button
              title="White Outline with Icon"
              variant="outline-white"
              onPress={() => handleButtonPress('White outline with icon')}
              leftIcon="star-outline"
            />
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Ghost Buttons:</Text>
          <Button
            title="Ghost Default"
            variant="ghost"
            onPress={() => handleButtonPress('Ghost button')}
            style={{ marginBottom: theme.sizes.sm }}
          />
          <Button
            title="Ghost with Icon"
            variant="ghost"
            onPress={() => handleButtonPress('Ghost with icon')}
            leftIcon="ellipsis-horizontal-outline"
            style={{ marginBottom: theme.sizes.sm }}
          />
          <View style={{ flexDirection: 'row', gap: theme.sizes.sm, marginBottom: theme.sizes.md }}>
            <Button
              variant="ghost"
              leftIcon="heart-outline"
              onPress={() => handleButtonPress('Icon-only heart')}
            />
            <Button
              variant="ghost"
              leftIcon="star-outline"
              onPress={() => handleButtonPress('Icon-only star')}
            />
            <Button
              variant="ghost"
              leftIcon="share-outline"
              onPress={() => handleButtonPress('Icon-only share')}
            />
            <Button
              variant="ghost"
              leftIcon="bookmark-outline"
              onPress={() => handleButtonPress('Icon-only bookmark')}
            />
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Button Sizes:</Text>
          <View style={{ flexDirection: 'row', gap: theme.sizes.sm, marginBottom: theme.sizes.sm, alignItems: 'center' }}>
            <Button
              title="Small"
              size="small"
              onPress={() => handleButtonPress('Small button')}
            />
            <Button
              title="Medium"
              size="medium"
              onPress={() => handleButtonPress('Medium button')}
            />
            <Button
              title="Large"
              size="large"
              onPress={() => handleButtonPress('Large button')}
            />
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Button States:</Text>
          <Button
            title="Loading Button"
            onPress={handleLoadingDemo}
            loading={loading}
            leftIcon="download-outline"
            style={{ marginBottom: theme.sizes.sm }}
          />
          <Button
            title="Disabled Button"
            onPress={() => {}}
            disabled={true}
            leftIcon="ban-outline"
          />
        </Card>

        {/* Button Group Examples */}
        <Card
          style={{ marginBottom: theme.sizes.lg }}
          onLayout={(event) => onSectionLayout('button-groups', event)}
        >
          <Text variant="subtitle" style={{ marginBottom: theme.sizes.md }}>
            Button Group Component
          </Text>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Basic Button Groups:</Text>
          <View style={{ gap: theme.sizes.md, marginBottom: theme.sizes.lg }}>
            <View>
              <Text variant="caption" style={{ marginBottom: theme.sizes.xs, color: theme.colors.textSecondary }}>
                Horizontal Attached Group:
              </Text>
              <ButtonGroup
                buttons={[
                  {
                    title: 'Left',
                    onPress: () => Alert.alert('Button', 'Left button pressed'),
                    leftIcon: 'chevron-back-outline'
                  },
                  {
                    title: 'Center',
                    onPress: () => Alert.alert('Button', 'Center button pressed'),
                  },
                  {
                    title: 'Right',
                    onPress: () => Alert.alert('Button', 'Right button pressed'),
                    rightIcon: 'chevron-forward-outline'
                  }
                ]}
                variant="attached"
                orientation="horizontal"
              />
            </View>

            <View>
              <Text variant="caption" style={{ marginBottom: theme.sizes.xs, color: theme.colors.textSecondary }}>
                Horizontal Separated Group:
              </Text>
              <ButtonGroup
                buttons={[
                  {
                    title: 'Edit',
                    onPress: () => Alert.alert('Action', 'Edit pressed'),
                    leftIcon: 'create-outline',
                    variant: 'primary'
                  },
                  {
                    title: 'Share',
                    onPress: () => Alert.alert('Action', 'Share pressed'),
                    leftIcon: 'share-outline',
                    variant: 'secondary'
                  },
                  {
                    title: 'Delete',
                    onPress: () => Alert.alert('Action', 'Delete pressed'),
                    leftIcon: 'trash-outline',
                    variant: 'outline'
                  }
                ]}
                variant="separated"
                orientation="horizontal"
              />
            </View>

            <View>
              <Text variant="caption" style={{ marginBottom: theme.sizes.xs, color: theme.colors.textSecondary }}>
                Vertical Button Group:
              </Text>
              <ButtonGroup
                buttons={[
                  {
                    title: 'Dashboard',
                    onPress: () => Alert.alert('Navigation', 'Dashboard selected'),
                    leftIcon: 'grid-outline'
                  },
                  {
                    title: 'Settings',
                    onPress: () => Alert.alert('Navigation', 'Settings selected'),
                    leftIcon: 'settings-outline'
                  }
                ]}
                variant="attached"
                orientation="vertical"
                fullWidth
              />
            </View>
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Selection Groups:</Text>
          <View style={{ gap: theme.sizes.md, marginBottom: theme.sizes.lg }}>
            <View>
              <Text variant="caption" style={{ marginBottom: theme.sizes.xs, color: theme.colors.textSecondary }}>
                Single Selection (View Mode):
              </Text>
              <ButtonGroup
                buttons={[
                  {
                    title: 'List',
                    onPress: () => {},
                    leftIcon: 'list-outline'
                  },
                  {
                    title: 'Grid',
                    onPress: () => {},
                    leftIcon: 'grid-outline'
                  },
                  {
                    title: 'Card',
                    onPress: () => {},
                    leftIcon: 'card-outline'
                  }
                ]}
                variant="attached"
                orientation="horizontal"
                selectedIndices={selectedViewMode}
                onSelectionChange={setSelectedViewMode}
                allowMultipleSelection={false}
                allowDeselection={false}
              />
            </View>

            <View>
              <Text variant="caption" style={{ marginBottom: theme.sizes.xs, color: theme.colors.textSecondary }}>
                Multiple Selection (Filters):
              </Text>
              <ButtonGroup
                buttons={[
                  {
                    title: 'Active',
                    onPress: () => {},
                    leftIcon: 'checkmark-circle-outline'
                  },
                  {
                    title: 'Pending',
                    onPress: () => {},
                    leftIcon: 'time-outline'
                  },
                  {
                    title: 'Completed',
                    onPress: () => {},
                    leftIcon: 'checkmark-done-outline'
                  },
                  {
                    title: 'Archived',
                    onPress: () => {},
                    leftIcon: 'archive-outline'
                  }
                ]}
                variant="separated"
                orientation="horizontal"
                selectedIndices={selectedFilters}
                onSelectionChange={setSelectedFilters}
                allowMultipleSelection={true}
                allowDeselection={true}
              />
            </View>

            <View>
              <Text variant="caption" style={{ marginBottom: theme.sizes.xs, color: theme.colors.textSecondary }}>
                Text Alignment Toggle:
              </Text>
              <ButtonGroup
                buttons={[
                  {
                    title: '',
                    onPress: () => {},
                    leftIcon: 'text-outline'
                  },
                  {
                    title: '',
                    onPress: () => {},
                    leftIcon: 'text-outline'
                  },
                  {
                    title: '',
                    onPress: () => {},
                    leftIcon: 'text-outline'
                  }
                ]}
                variant="attached"
                orientation="horizontal"
                selectedIndices={selectedAlignment}
                onSelectionChange={setSelectedAlignment}
                allowMultipleSelection={false}
                size="small"
              />
            </View>
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Button Group Sizes:</Text>
          <View style={{ gap: theme.sizes.md, marginBottom: theme.sizes.lg }}>
            <View>
              <Text variant="caption" style={{ marginBottom: theme.sizes.xs, color: theme.colors.textSecondary }}>
                Small Size:
              </Text>
              <ButtonGroup
                buttons={[
                  { title: 'S', onPress: () => {} },
                  { title: 'M', onPress: () => {} },
                  { title: 'L', onPress: () => {} },
                  { title: 'XL', onPress: () => {} }
                ]}
                size="small"
                variant="attached"
              />
            </View>

            <View>
              <Text variant="caption" style={{ marginBottom: theme.sizes.xs, color: theme.colors.textSecondary }}>
                Medium Size (Default):
              </Text>
              <ButtonGroup
                buttons={[
                  { title: 'Option 1', onPress: () => {} },
                  { title: 'Option 2', onPress: () => {} },
                  { title: 'Option 3', onPress: () => {} }
                ]}
                size="medium"
                variant="attached"
              />
            </View>

            <View>
              <Text variant="caption" style={{ marginBottom: theme.sizes.xs, color: theme.colors.textSecondary }}>
                Large Size:
              </Text>
              <ButtonGroup
                buttons={[
                  { title: 'Primary', onPress: () => {}, leftIcon: 'star-outline' },
                  { title: 'Secondary', onPress: () => {}, leftIcon: 'heart-outline' }
                ]}
                size="large"
                variant="attached"
              />
            </View>
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Advanced Features:</Text>
          <View style={{ gap: theme.sizes.md }}>
            <View>
              <Text variant="caption" style={{ marginBottom: theme.sizes.xs, color: theme.colors.textSecondary }}>
                Full Width Tabs:
              </Text>
              <ButtonGroup
                buttons={[
                  {
                    title: 'Overview',
                    onPress: () => {},
                    leftIcon: 'bar-chart-outline'
                  },
                  {
                    title: 'Details',
                    onPress: () => {},
                    leftIcon: 'list-outline'
                  },
                  {
                    title: 'Settings',
                    onPress: () => {},
                    leftIcon: 'settings-outline'
                  }
                ]}
                variant="attached"
                orientation="horizontal"
                fullWidth={true}
                selectedIndices={selectedTabs}
                onSelectionChange={setSelectedTabs}
                allowMultipleSelection={false}
                allowDeselection={false}
              />
            </View>

            <View>
              <Text variant="caption" style={{ marginBottom: theme.sizes.xs, color: theme.colors.textSecondary }}>
                With Loading and Disabled States:
              </Text>
              <ButtonGroup
                buttons={[
                  {
                    title: 'Save',
                    onPress: () => Alert.alert('Save', 'Saving data...'),
                    leftIcon: 'save-outline',
                    loading: false
                  },
                  {
                    title: 'Processing',
                    onPress: () => {},
                    leftIcon: 'sync-outline',
                    loading: true
                  },
                  {
                    title: 'Disabled',
                    onPress: () => {},
                    leftIcon: 'ban-outline',
                    disabled: true
                  }
                ]}
                variant="separated"
                orientation="horizontal"
              />
            </View>
          </View>
        </Card>

        {/* Checkbox Components */}
        <Card
          style={{ marginBottom: theme.sizes.lg }}
          onLayout={(event) => onSectionLayout('checkboxes', event)}
        >
          <Text variant="subtitle" style={{ marginBottom: theme.sizes.md }}>
            Checkbox Components
          </Text>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Basic Checkboxes:</Text>
          <View style={{ gap: theme.sizes.sm, marginBottom: theme.sizes.lg }}>
            <Checkbox
              checked={basicCheckbox}
              onPress={setBasicCheckbox}
              label="Basic checkbox"
            />
            <Checkbox
              checked={acceptTerms}
              onPress={setAcceptTerms}
              label="I accept the terms and conditions"
              description="By checking this box, you agree to our terms of service and privacy policy"
              required
            />
            <Checkbox
              checked={enableNotifications}
              onPress={setEnableNotifications}
              label="Enable push notifications"
              description="Receive updates about your account and new features"
            />
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Checkbox Variants:</Text>
          <View style={{ gap: theme.sizes.sm, marginBottom: theme.sizes.lg }}>
            <Checkbox
              checked={acceptTerms}
              onPress={setAcceptTerms}
              label="Default variant"
              variant="default"
            />
            <Checkbox
              checked={enableNotifications}
              onPress={setEnableNotifications}
              label="Success variant"
              variant="success"
            />
            <Checkbox
              checked={agreeToNewsletter}
              onPress={setAgreeToNewsletter}
              label="Warning variant"
              variant="warning"
            />
            <Checkbox
              checked={errorCheckbox}
              onPress={setErrorCheckbox}
              label="Error variant"
              variant="error"
              error={errorCheckbox ? "" : "This field is required"}
            />
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Checkbox Sizes:</Text>
          <View style={{ gap: theme.sizes.sm, marginBottom: theme.sizes.lg }}>
            <Checkbox
              checked={basicCheckbox}
              onPress={setBasicCheckbox}
              label="Small checkbox"
              size="small"
            />
            <Checkbox
              checked={enableNotifications}
              onPress={setEnableNotifications}
              label="Medium checkbox (default)"
              size="medium"
            />
            <Checkbox
              checked={acceptTerms}
              onPress={setAcceptTerms}
              label="Large checkbox"
              size="large"
            />
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Indeterminate State:</Text>
          <View style={{ gap: theme.sizes.sm, marginBottom: theme.sizes.lg }}>
            <Checkbox
              indeterminate={item1Selected && !item2Selected && item3Selected}
              checked={item1Selected && item2Selected && item3Selected}
              onPress={(checked) => {
                setItem1Selected(checked);
                setItem2Selected(checked);
                setItem3Selected(checked);
              }}
              label="Select all items"
              description="Toggle all items below"
            />
            <View style={{ marginLeft: theme.sizes.lg, gap: theme.sizes.xs }}>
              <Checkbox
                checked={item1Selected}
                onPress={setItem1Selected}
                label="Item 1"
                size="small"
              />
              <Checkbox
                checked={item2Selected}
                onPress={setItem2Selected}
                label="Item 2"
                size="small"
              />
              <Checkbox
                checked={item3Selected}
                onPress={setItem3Selected}
                label="Item 3"
                size="small"
              />
            </View>
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Custom Styling:</Text>
          <View style={{ gap: theme.sizes.sm, marginBottom: theme.sizes.lg }}>
            <Checkbox
              checked={customCheckbox}
              onPress={setCustomCheckbox}
              label="Custom styled checkbox"
              labelStyle={{ fontWeight: 'bold', color: theme.colors.primary }}
              checkboxStyle={{ borderRadius: theme.borderRadius.sm }}
              description="Custom label and checkbox styling"
            />
            <Checkbox
              checked={animatedCheckbox}
              onPress={setAnimatedCheckbox}
              label="Animated checkbox"
              description="Smooth animations on state change"
              animate={true}
            />
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Disabled States:</Text>
          <View style={{ gap: theme.sizes.sm, marginBottom: theme.sizes.lg }}>
            <Checkbox
              checked={false}
              disabled
              label="Disabled unchecked"
              description="This checkbox cannot be interacted with"
            />
            <Checkbox
              checked={disabledCheckbox}
              disabled
              label="Disabled checked"
              description="This checkbox is permanently checked"
            />
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Custom Icons:</Text>
          <View style={{ gap: theme.sizes.sm }}>
            <Checkbox
              checked={customCheckbox}
              onPress={setCustomCheckbox}
              label="Custom check icon"
              checkedIcon="heart"
              uncheckedIcon="heart-outline"
            />
            <Checkbox
              checked={agreeToNewsletter}
              onPress={setAgreeToNewsletter}
              label="Star toggle"
              checkedIcon="star"
              uncheckedIcon="star-outline"
            />
            <Checkbox
              indeterminate={!item1Selected && item2Selected}
              checked={item1Selected && item2Selected}
              onPress={(checked) => {
                setItem1Selected(checked);
                setItem2Selected(checked);
              }}
              label="Custom indeterminate icon"
              indeterminateIcon="ellipsis-horizontal"
            />
          </View>
        </Card>

        {/* List Components */}
        <Card
          style={{ marginBottom: theme.sizes.lg }}
          onLayout={(event) => onSectionLayout('lists', event)}
        >
          <Text variant="subtitle" style={{ marginBottom: theme.sizes.md }}>
            List Components
          </Text>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Basic Lists:</Text>
          <View style={{ marginBottom: theme.sizes.lg }}>
            <List variant="default">
              <ListItem
                title="Simple List Item"
                onPress={() => Alert.alert('List', 'Simple item pressed')}
              />
              <ListItem
                title="With Subtitle"
                subtitle="This is a subtitle"
                onPress={() => Alert.alert('List', 'Subtitle item pressed')}
              />
              <ListItem
                title="With Description"
                subtitle="Short subtitle"
                description="This is a longer description that provides more context about the list item and what it represents."
                multiline
                onPress={() => Alert.alert('List', 'Description item pressed')}
              />
            </List>
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>List with Icons:</Text>
          <View style={{ marginBottom: theme.sizes.lg }}>
            <List variant="default">
              <ListItem
                title="Home"
                leftIcon="home-outline"
                showChevron
                onPress={() => Alert.alert('List', 'Home pressed')}
              />
              <ListItem
                title="Settings"
                subtitle="App preferences"
                leftIcon="settings-outline"
                rightIcon="notifications-outline"
                onPress={() => Alert.alert('List', 'Settings pressed')}
              />
              <ListItem
                title="Account"
                subtitle="Personal information"
                leftIcon="person-outline"
                badge={{ text: "New", variant: "primary" }}
                showChevron
                onPress={() => Alert.alert('List', 'Account pressed')}
              />
            </List>
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>List with Avatars:</Text>
          <View style={{ marginBottom: theme.sizes.lg }}>
            <List variant="default">
              <ListItem
                title="John Doe"
                subtitle="Software Developer"
                description="Available"
                leftAvatar={{ title: "JD", size: "medium" }}
                rightIcon="call-outline"
                onPress={() => Alert.alert('List', 'John Doe pressed')}
              />
              <ListItem
                title="Jane Smith"
                subtitle="Product Manager"
                description="In a meeting"
                leftAvatar={{ title: "JS", size: "medium" }}
                badge={{ text: "Busy", variant: "warning" }}
                onPress={() => Alert.alert('List', 'Jane Smith pressed')}
              />
              <ListItem
                title="Team Chat"
                subtitle="5 members"
                description="Last message 2 mins ago"
                leftAvatar={{ title: "TC", size: "medium" }}
                badge={{ text: "3", variant: "error" }}
                showChevron
                onPress={() => Alert.alert('List', 'Team Chat pressed')}
              />
            </List>
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>List Variants:</Text>
          <View style={{ marginBottom: theme.sizes.lg }}>
            <Text variant="caption" style={{ marginBottom: theme.sizes.xs, color: theme.colors.textSecondary }}>
              Card Variant:
            </Text>
            <List variant="card" style={{ marginBottom: theme.sizes.md }}>
              <ListItem
                title="Card List Item"
                subtitle="This list has a card appearance"
                leftIcon="card-outline"
              />
              <ListItem
                title="Another Item"
                subtitle="With borders and shadows"
                leftIcon="layers-outline"
              />
            </List>

            <Text variant="caption" style={{ marginBottom: theme.sizes.xs, color: theme.colors.textSecondary }}>
              Inset Variant:
            </Text>
            <List variant="inset">
              <ListItem
                title="Inset List Item"
                subtitle="This list has inset margins"
                leftIcon="contract-outline"
              />
              <ListItem
                title="Rounded Corners"
                subtitle="With background color"
                leftIcon="radio-button-on-outline"
              />
            </List>
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Interactive List:</Text>
          <View style={{ marginBottom: theme.sizes.lg }}>
            <List variant="default">
              {listItems.map((item) => (
                <ListItem
                  key={item.id}
                  title={item.title}
                  subtitle={`${item.count} items`}
                  leftIcon="mail-outline"
                  selected={selectedListItem === item.id}
                  badge={item.count > 0 ? { text: item.count.toString(), variant: "primary" } : undefined}
                  showChevron
                  onPress={() => setSelectedListItem(selectedListItem === item.id ? null : item.id)}
                />
              ))}
            </List>
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Item Variants:</Text>
          <View style={{ marginBottom: theme.sizes.lg }}>
            <List variant="default">
              <ListItem
                title="Compact Item"
                subtitle="Less padding"
                variant="compact"
                leftIcon="contract-outline"
              />
              <ListItem
                title="Default Item"
                subtitle="Standard padding"
                variant="default"
                leftIcon="resize-outline"
              />
              <ListItem
                title="Expanded Item"
                subtitle="More padding for emphasis"
                variant="expanded"
                leftIcon="expand-outline"
              />
              <ListItem
                title="Action Item"
                subtitle="With action indicator"
                variant="action"
                leftIcon="flash-outline"
                selected={true}
              />
            </List>
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Sectioned Lists:</Text>
          <View style={{ marginBottom: theme.sizes.lg }}>
            <List variant="default" showDividers={false}>
              <ListSection
                title="Personal"
                subtitle="Your personal information"
              >
                <ListItem
                  title="Account"
                  subtitle="Manage your account"
                  leftIcon="person-outline"
                  showChevron
                />
                <ListItem
                  title="Privacy"
                  subtitle="Privacy settings"
                  leftIcon="lock-closed-outline"
                  showChevron
                />
                <ListDivider variant="inset" />
              </ListSection>

              <ListSection
                title="Notifications"
                subtitle="Configure notifications"
              >
                <ListItem
                  title="Push Notifications"
                  subtitle="Enabled"
                  leftIcon="notifications-outline"
                  rightContent={
                    <View style={{
                      width: 40,
                      height: 20,
                      backgroundColor: theme.colors.success,
                      borderRadius: 10,
                      justifyContent: 'center',
                      alignItems: 'flex-end',
                      paddingHorizontal: 4,
                    }}>
                      <View style={{
                        width: 16,
                        height: 16,
                        backgroundColor: '#FFFFFF',
                        borderRadius: 8,
                      }} />
                    </View>
                  }
                />
                <ListItem
                  title="Email Notifications"
                  subtitle="Disabled"
                  leftIcon="mail-outline"
                  rightContent={
                    <View style={{
                      width: 40,
                      height: 20,
                      backgroundColor: theme.colors.border,
                      borderRadius: 10,
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                      paddingHorizontal: 4,
                    }}>
                      <View style={{
                        width: 16,
                        height: 16,
                        backgroundColor: '#FFFFFF',
                        borderRadius: 8,
                      }} />
                    </View>
                  }
                />
              </ListSection>
            </List>
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Divider Variants:</Text>
          <View style={{ marginBottom: theme.sizes.lg }}>
            <List variant="default" showDividers={false}>
              <ListItem title="Full Divider" leftIcon="remove-outline" />
              <ListDivider variant="full" />
              <ListItem title="Inset Divider" leftIcon="remove-outline" />
              <ListDivider variant="inset" />
              <ListItem title="Middle Divider" leftIcon="remove-outline" />
              <ListDivider variant="middle" />
              <ListItem title="No Divider" leftIcon="remove-outline" />
            </List>
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Collapsible Lists:</Text>
          <View style={{ marginBottom: theme.sizes.lg }}>
            <List variant="default">
              <ListItem
                title="Project Files"
                subtitle="Click to expand/collapse"
                leftIcon="folder-outline"
                collapsible
                badge={{ text: "4", variant: "primary" }}
              >
                <ListItem
                  title="index.tsx"
                  subtitle="Main entry point"
                  leftIcon="document-text-outline"
                  onPress={() => Alert.alert('File', 'index.tsx opened')}
                />
                <ListItem
                  title="components"
                  subtitle="React components"
                  leftIcon="folder-outline"
                  collapsible
                >
                  <ListItem
                    title="Button.tsx"
                    subtitle="Button component"
                    leftIcon="document-text-outline"
                  />
                  <ListItem
                    title="List.tsx"
                    subtitle="List component"
                    leftIcon="document-text-outline"
                  />
                </ListItem>
                <ListItem
                  title="package.json"
                  subtitle="Dependencies"
                  leftIcon="document-text-outline"
                />
                <ListItem
                  title="README.md"
                  subtitle="Documentation"
                  leftIcon="document-text-outline"
                />
              </ListItem>

              <ListItem
                title="Settings"
                subtitle="Application settings"
                leftIcon="settings-outline"
                collapsible
              >
                <ListItem
                  title="General"
                  subtitle="General preferences"
                  leftIcon="options-outline"
                />
                <ListItem
                  title="Security"
                  subtitle="Security settings"
                  leftIcon="shield-checkmark-outline"
                  collapsible
                >
                  <ListItem
                    title="Two-Factor Auth"
                    subtitle="Enable 2FA"
                    leftIcon="key-outline"
                  />
                  <ListItem
                    title="Password"
                    subtitle="Change password"
                    leftIcon="lock-closed-outline"
                  />
                </ListItem>
                <ListItem
                  title="Privacy"
                  subtitle="Privacy preferences"
                  leftIcon="eye-off-outline"
                />
              </ListItem>
            </List>
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Collapsible Sections:</Text>
          <View style={{ marginBottom: theme.sizes.lg }}>
            <List variant="default" showDividers={false}>
              <ListSection
                title="Account Information"
                subtitle="Personal details and preferences"
                headerIcon="person-outline"
                collapsible
              >
                <ListItem
                  title="Account"
                  subtitle="Edit your account"
                  leftIcon="create-outline"
                  showChevron
                />
                <ListItem
                  title="Email"
                  subtitle="john.doe@example.com"
                  leftIcon="mail-outline"
                  showChevron
                />
                <ListItem
                  title="Phone"
                  subtitle="+1 (555) 123-4567"
                  leftIcon="call-outline"
                  showChevron
                />
              </ListSection>

              <ListSection
                title="Notification Settings"
                subtitle="Manage your notifications"
                headerIcon="notifications-outline"
                collapsible
              >
                <ListItem
                  title="Push Notifications"
                  subtitle="Enabled"
                  leftIcon="phone-portrait-outline"
                  rightContent={
                    <View style={{
                      width: 40,
                      height: 20,
                      backgroundColor: theme.colors.success,
                      borderRadius: 10,
                      justifyContent: 'center',
                      alignItems: 'flex-end',
                      paddingHorizontal: 4,
                    }}>
                      <View style={{
                        width: 16,
                        height: 16,
                        backgroundColor: '#FFFFFF',
                        borderRadius: 8,
                      }} />
                    </View>
                  }
                />
                <ListItem
                  title="Email Notifications"
                  subtitle="Disabled"
                  leftIcon="mail-outline"
                  rightContent={
                    <View style={{
                      width: 40,
                      height: 20,
                      backgroundColor: theme.colors.border,
                      borderRadius: 10,
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                      paddingHorizontal: 4,
                    }}>
                      <View style={{
                        width: 16,
                        height: 16,
                        backgroundColor: '#FFFFFF',
                        borderRadius: 8,
                      }} />
                    </View>
                  }
                />
              </ListSection>

              <ListSection
                title="Advanced"
                subtitle="Developer and advanced options"
                headerIcon="construct-outline"
                collapsible
                expanded={false}
              >
                <ListItem
                  title="Debug Mode"
                  subtitle="Enable debug logging"
                  leftIcon="bug-outline"
                />
                <ListItem
                  title="Developer Tools"
                  subtitle="Advanced developer options"
                  leftIcon="code-outline"
                />
                <ListItem
                  title="Reset App"
                  subtitle="Reset all settings"
                  leftIcon="refresh-circle-outline"
                  badge={{ text: "Danger", variant: "error" }}
                />
              </ListSection>
            </List>
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Nested File Explorer:</Text>
          <View style={{ marginBottom: theme.sizes.lg }}>
            <List variant="card">
              <ListItem
                title="Documents"
                subtitle="Personal documents"
                leftIcon="folder-outline"
                collapsible
                badge={{ text: "8", variant: "secondary" }}
              >
                <ListItem
                  title="Work"
                  subtitle="Work-related files"
                  leftIcon="folder-outline"
                  collapsible
                >
                  <ListItem
                    title="Projects"
                    subtitle="Active projects"
                    leftIcon="folder-outline"
                    collapsible
                  >
                    <ListItem
                      title="Mobile App"
                      subtitle="React Native app"
                      leftIcon="phone-portrait-outline"
                    />
                    <ListItem
                      title="Website"
                      subtitle="Company website"
                      leftIcon="globe-outline"
                    />
                  </ListItem>
                  <ListItem
                    title="Reports"
                    subtitle="Monthly reports"
                    leftIcon="document-text-outline"
                  />
                </ListItem>
                <ListItem
                  title="Personal"
                  subtitle="Personal files"
                  leftIcon="folder-outline"
                  collapsible
                >
                  <ListItem
                    title="Photos"
                    subtitle="Family photos"
                    leftIcon="images-outline"
                  />
                  <ListItem
                    title="Videos"
                    subtitle="Home videos"
                    leftIcon="videocam-outline"
                  />
                </ListItem>
                <ListItem
                  title="README.txt"
                  subtitle="Important information"
                  leftIcon="document-text-outline"
                />
              </ListItem>
            </List>
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Disabled & Loading States:</Text>
          <View>
            <List variant="default">
              <ListItem
                title="Normal Item"
                subtitle="This item is interactive"
                leftIcon="checkmark-circle-outline"
                onPress={() => Alert.alert('List', 'Normal item pressed')}
              />
              <ListItem
                title="Disabled Item"
                subtitle="This item cannot be pressed"
                leftIcon="ban-outline"
                disabled
                onPress={() => Alert.alert('List', 'This should not appear')}
              />
              <ListItem
                title="Loading Item"
                subtitle="This item is loading"
                leftIcon="hourglass-outline"
                loading
                rightContent={<LoadingSpinner size="small" />}
              />
            </List>
          </View>
        </Card>


        {/* Navigation Components */}
        <Card
          style={{ marginBottom: theme.sizes.lg }}
          onLayout={(event) => onSectionLayout('navigation', event)}
        >
          <Text variant="subtitle" style={{ marginBottom: theme.sizes.md }}>
            Navigation Components
          </Text>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Back Button Variants:</Text>
          <View style={{ gap: theme.sizes.md, marginBottom: theme.sizes.lg }}>
            <View>
              <Text variant="caption" style={{ marginBottom: theme.sizes.xs, color: theme.colors.textSecondary }}>
                Icon Only (Default):
              </Text>
              <View style={{ flexDirection: 'row', gap: theme.sizes.sm, alignItems: 'center' }}>
                <BackButton
                  variant="icon-only"
                  size="small"
                  onPress={() => Alert.alert('Back Button', 'Small icon-only back button pressed')}
                />
                <BackButton
                  variant="icon-only"
                  size="medium"
                  onPress={() => Alert.alert('Back Button', 'Medium icon-only back button pressed')}
                />
                <BackButton
                  variant="icon-only"
                  size="large"
                  onPress={() => Alert.alert('Back Button', 'Large icon-only back button pressed')}
                />
              </View>
            </View>

            <View>
              <Text variant="caption" style={{ marginBottom: theme.sizes.xs, color: theme.colors.textSecondary }}>
                With Text:
              </Text>
              <View style={{ flexDirection: 'row', gap: theme.sizes.sm, alignItems: 'center', flexWrap: 'wrap' }}>
                <BackButton
                  variant="with-text"
                  size="small"
                  text="Back"
                  onPress={() => Alert.alert('Back Button', 'Small back button with text pressed')}
                />
                <BackButton
                  variant="with-text"
                  size="medium"
                  text="Go Back"
                  onPress={() => Alert.alert('Back Button', 'Medium back button with text pressed')}
                />
                <BackButton
                  variant="with-text"
                  size="large"
                  text="Return"
                  onPress={() => Alert.alert('Back Button', 'Large back button with text pressed')}
                />
              </View>
            </View>

            <View>
              <Text variant="caption" style={{ marginBottom: theme.sizes.xs, color: theme.colors.textSecondary }}>
                Text Only:
              </Text>
              <View style={{ flexDirection: 'row', gap: theme.sizes.sm, alignItems: 'center', flexWrap: 'wrap' }}>
                <BackButton
                  variant="text-only"
                  size="small"
                  text="← Cancel"
                  onPress={() => Alert.alert('Back Button', 'Small text-only back button pressed')}
                />
                <BackButton
                  variant="text-only"
                  size="medium"
                  text="← Back to Home"
                  onPress={() => Alert.alert('Back Button', 'Medium text-only back button pressed')}
                />
                <BackButton
                  variant="text-only"
                  size="large"
                  text="← Previous"
                  onPress={() => Alert.alert('Back Button', 'Large text-only back button pressed')}
                />
              </View>
            </View>
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Back Button Styles:</Text>
          <View style={{ gap: theme.sizes.md, marginBottom: theme.sizes.lg }}>
            <View>
              <Text variant="caption" style={{ marginBottom: theme.sizes.xs, color: theme.colors.textSecondary }}>
                With Background:
              </Text>
              <View style={{ flexDirection: 'row', gap: theme.sizes.sm, alignItems: 'center', flexWrap: 'wrap' }}>
                <BackButton
                  variant="icon-only"
                  showBackground={true}
                  onPress={() => Alert.alert('Back Button', 'Icon with background pressed')}
                />
                <BackButton
                  variant="with-text"
                  text="Back"
                  showBackground={true}
                  onPress={() => Alert.alert('Back Button', 'Text with background pressed')}
                />
              </View>
            </View>

            <View>
              <Text variant="caption" style={{ marginBottom: theme.sizes.xs, color: theme.colors.textSecondary }}>
                Custom Colors:
              </Text>
              <View style={{ flexDirection: 'row', gap: theme.sizes.sm, alignItems: 'center', flexWrap: 'wrap' }}>
                <BackButton
                  variant="with-text"
                  text="Primary"
                  color={theme.colors.primary}
                  onPress={() => Alert.alert('Back Button', 'Primary colored back button pressed')}
                />
                <BackButton
                  variant="with-text"
                  text="Success"
                  color={theme.colors.success}
                  showBackground={true}
                  onPress={() => Alert.alert('Back Button', 'Success colored back button pressed')}
                />
                <BackButton
                  variant="with-text"
                  text="Error"
                  color={theme.colors.error}
                  onPress={() => Alert.alert('Back Button', 'Error colored back button pressed')}
                />
              </View>
            </View>

            <View>
              <Text variant="caption" style={{ marginBottom: theme.sizes.xs, color: theme.colors.textSecondary }}>
                Custom Icons:
              </Text>
              <View style={{ flexDirection: 'row', gap: theme.sizes.sm, alignItems: 'center', flexWrap: 'wrap' }}>
                <BackButton
                  variant="with-text"
                  text="Close"
                  icon="close-outline"
                  onPress={() => Alert.alert('Back Button', 'Close button pressed')}
                />
                <BackButton
                  variant="with-text"
                  text="Home"
                  icon="home-outline"
                  onPress={() => Alert.alert('Back Button', 'Home button pressed')}
                />
                <BackButton
                  variant="icon-only"
                  icon="arrow-back-circle-outline"
                  size="large"
                  color={theme.colors.primary}
                  onPress={() => Alert.alert('Back Button', 'Custom arrow button pressed')}
                />
              </View>
            </View>
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Header Component:</Text>
          <View style={{ gap: theme.sizes.md }}>
            <View>
              <Text variant="caption" style={{ marginBottom: theme.sizes.xs, color: theme.colors.textSecondary }}>
                Basic Header with Back Button:
              </Text>
              <Header
                title="Page Title"
                subtitle="Optional subtitle"
                showBackButton={true}
                backButtonProps={{
                  onPress: () => Alert.alert('Header', 'Header back button pressed')
                }}
                marginBottom="medium"
              />
            </View>

            <View>
              <Text variant="caption" style={{ marginBottom: theme.sizes.xs, color: theme.colors.textSecondary }}>
                Header with Custom Components:
              </Text>
              <Header
                title="Custom Header"
                showBackButton={true}
                backButtonProps={{
                  variant: 'with-text',
                  text: 'Cancel',
                  onPress: () => Alert.alert('Header', 'Cancel button pressed')
                }}
                rightComponent={
                  <TouchableOpacity onPress={() => Alert.alert('Header', 'Save button pressed')}>
                    <Text variant="body" style={{ color: theme.colors.primary, fontWeight: '600' }}>
                      Save
                    </Text>
                  </TouchableOpacity>
                }
                marginBottom="large"
                backgroundColor={theme.colors.surface}
              />
            </View>

            <View>
              <Text variant="caption" style={{ marginBottom: theme.sizes.xs, color: theme.colors.textSecondary }}>
                Header without Back Button:
              </Text>
              <Header
                title="Settings"
                showBackButton={false}
                leftComponent={
                  <TouchableOpacity onPress={() => Alert.alert('Header', 'Menu button pressed')}>
                    <Icon name="menu-outline" size={24} color={theme.colors.text} />
                  </TouchableOpacity>
                }
                rightComponent={
                  <TouchableOpacity onPress={() => Alert.alert('Header', 'User button pressed')}>
                    <Icon name="person-circle-outline" size={24} color={theme.colors.text} />
                  </TouchableOpacity>
                }
                borderBottom={true}
              />
            </View>

            <View>
              <Text variant="caption" style={{ marginBottom: theme.sizes.xs, color: theme.colors.textSecondary }}>
                Margin Variations:
              </Text>
              <View style={{ gap: theme.sizes.sm }}>
                <Header
                  title="Small Margin Header with Longer Title"
                  showBackButton={true}
                  backButtonProps={{
                    onPress: () => Alert.alert('Header', 'Small margin header')
                  }}
                  marginBottom="small"
                />
                <Header
                  title="Medium Margin"
                  showBackButton={true}
                  backButtonProps={{
                    onPress: () => Alert.alert('Header', 'Medium margin header')
                  }}
                  marginBottom="medium"
                />
                <Header
                  title="Large Margin Header with Extended Title Text to Demonstrate Width"
                  subtitle="This subtitle shows how the extended width accommodates longer text"
                  showBackButton={true}
                  backButtonProps={{
                    onPress: () => Alert.alert('Header', 'Large margin header')
                  }}
                  marginBottom="large"
                />
                <Header
                  title="No Margin"
                  showBackButton={true}
                  backButtonProps={{
                    onPress: () => Alert.alert('Header', 'No margin header')
                  }}
                  marginBottom="none"
                />
              </View>
            </View>
          </View>
        </Card>

        {/* TextInput Examples */}
        <Card
          style={{ marginBottom: theme.sizes.lg }}
          onLayout={(event) => onSectionLayout('text-inputs', event)}
        >
          <Text variant="subtitle" style={{ marginBottom: theme.sizes.md }}>
            Text Input Variations
          </Text>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Basic Inputs:</Text>
          <TextInput
            label="Basic Text Input"
            placeholder="Enter some text"
            value={inputValue}
            onChangeText={setInputValue}
          />

          <TextInput
            label="Multiline Input"
            placeholder="Enter multiple lines..."
            multiline
            numberOfLines={3}
          />

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Inputs with Icons:</Text>
          <TextInput
            label="Email Address"
            placeholder="user@example.com"
            leftIcon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            label="Phone Number"
            placeholder="+1 (555) 123-4567"
            leftIcon="call-outline"
            keyboardType="phone-pad"
          />

          <TextInput
            label="Search Input"
            placeholder="Search for anything..."
            leftIcon="search-outline"
            rightIcon="mic-outline"
          />

          <TextInput
            label="Password with Toggle"
            placeholder="Enter your password"
            leftIcon="lock-closed-outline"
            secureTextEntry={true}
          />

          <TextInput
            label="Password without Toggle"
            placeholder="Static password field"
            leftIcon="lock-closed-outline"
            secureTextEntry={true}
            showPasswordToggle={false}
          />

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Input States:</Text>
          <TextInput
            label="Input with Error"
            placeholder="This field has an error"
            leftIcon="alert-circle-outline"
            error="This field is required and cannot be empty"
          />

          <TextInput
            label="Input with Helper Text"
            placeholder="Input with helpful information"
            leftIcon="information-circle-outline"
            helperText="This is helpful information to guide the user"
          />

          <TextInput
            label="Disabled Input"
            placeholder="This input is disabled"
            leftIcon="ban-outline"
            editable={false}
            value="Cannot edit this field"
          />

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Specialized Inputs:</Text>
          <TextInput
            label="URL Input"
            placeholder="https://example.com"
            leftIcon="link-outline"
            keyboardType="url"
            autoCapitalize="none"
          />

          <TextInput
            label="Numeric Input"
            placeholder="Enter a number"
            leftIcon="calculator-outline"
            keyboardType="numeric"
          />
        </Card>

        {/* Masked Text Input Examples */}
        <Card
          style={{ marginBottom: theme.sizes.lg }}
          onLayout={(event) => onSectionLayout('masked-inputs', event)}
        >
          <Text variant="subtitle" style={{ marginBottom: theme.sizes.md }}>
            Masked Text Input Component
          </Text>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Phone Number:</Text>
          <MaskedTextInput
            mask="phone"
            label="Phone Number"
            leftIcon="call-outline"
            onChangeText={(masked, unmasked) => {
              // Demo: Phone number input handler
            }}
          />

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Credit Card:</Text>
          <MaskedTextInput
            mask="credit-card"
            label="Credit Card Number"
            leftIcon="card-outline"
            onChangeText={(masked, unmasked) => {
              // Demo: Credit card input handler
            }}
          />

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Date (MM/DD/YYYY):</Text>
          <MaskedTextInput
            mask="date"
            label="Date of Birth"
            leftIcon="calendar-outline"
            onChangeText={(masked, unmasked) => {
              // Demo: Date input handler
            }}
          />

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Social Security Number:</Text>
          <MaskedTextInput
            mask="ssn"
            label="SSN"
            leftIcon="shield-outline"
            onChangeText={(masked, unmasked) => {
              // Demo: SSN input handler
            }}
          />

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Time (HH:MM):</Text>
          <MaskedTextInput
            mask="time"
            label="Meeting Time"
            leftIcon="time-outline"
            onChangeText={(masked, unmasked) => {
              // Demo: Time input handler
            }}
          />

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Custom Mask (License Plate):</Text>
          <MaskedTextInput
            mask="custom"
            customMask="###-####"
            label="License Plate"
            placeholder="ABC-1234"
            leftIcon="car-outline"
            onChangeText={(masked, unmasked) => {
              // Demo: License plate input handler
            }}
          />
        </Card>

        {/* OTP Input Examples */}
        <Card
          style={{ marginBottom: theme.sizes.lg }}
          onLayout={(event) => onSectionLayout('otp-inputs', event)}
        >
          <Text variant="subtitle" style={{ marginBottom: theme.sizes.md }}>
            OTP Input Component
          </Text>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>6-Digit OTP (Default):</Text>
          <OTPInput
            length={6}
            label="Enter verification code"
            helperText="Code sent to your phone number"
            autoFocus={false}
            onComplete={(otp) => Alert.alert('OTP Complete', `Entered OTP: ${otp}`)}
            onChangeText={(otp) => {
              // Demo: OTP change handler
            }}
          />

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>4-Digit PIN:</Text>
          <OTPInput
            length={4}
            label="Enter PIN"
            secureTextEntry={true}
            autoFocus={false}
            onComplete={(pin) => Alert.alert('PIN Complete', `Entered PIN: ${pin}`)}
          />

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>OTP with Error:</Text>
          <OTPInput
            length={6}
            label="Verification Code"
            error="Invalid code. Please try again."
            autoFocus={false}
            onComplete={(otp) => Alert.alert('OTP Complete', `Entered OTP: ${otp}`)}
          />
        </Card>

        {/* Select Component Examples */}
        <Card
          style={{ marginBottom: theme.sizes.lg }}
          onLayout={(event) => onSectionLayout('selects', event)}
        >
          <Text variant="subtitle" style={{ marginBottom: theme.sizes.md }}>
            Select Component Variations
          </Text>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Basic Select Types:</Text>
          <Select
            label="Single Select"
            placeholder="Choose your country"
            value={selectedCountry}
            leftIcon="flag-outline"
            options={[
              { label: 'United States', value: 'us', icon: 'flag-outline', description: 'North America' },
              { label: 'United Kingdom', value: 'uk', icon: 'flag-outline', description: 'Europe' },
              { label: 'Canada', value: 'ca', icon: 'flag-outline', description: 'North America' },
              { label: 'Australia', value: 'au', icon: 'flag-outline', description: 'Oceania' },
              { label: 'Germany', value: 'de', icon: 'flag-outline', description: 'Europe' },
              { label: 'France', value: 'fr', icon: 'flag-outline', description: 'Europe' },
              { label: 'Japan', value: 'jp', icon: 'flag-outline', description: 'Asia' },
              { label: 'Brazil', value: 'br', icon: 'flag-outline', description: 'South America' },
            ]}
            onSelectionChange={(value, option) => {
              setSelectedCountry(value);
            }}
            helperText="Single selection with country options"
          />

          <Select
            label="Multi-Select with Search"
            placeholder="Select your programming skills"
            value={selectedSkills}
            multiple
            searchable
            showSelectedCount
            leftIcon="code-outline"
            searchPlaceholder="Search technologies..."
            options={[
              { label: 'React Native', value: 'react-native', icon: 'logo-react', description: 'Mobile app development' },
              { label: 'TypeScript', value: 'typescript', icon: 'code-outline', description: 'Typed JavaScript' },
              { label: 'JavaScript', value: 'javascript', icon: 'logo-javascript', description: 'Web development' },
              { label: 'Python', value: 'python', icon: 'logo-python', description: 'Backend & AI' },
              { label: 'Node.js', value: 'nodejs', icon: 'logo-nodejs', description: 'Server-side JS' },
              { label: 'React', value: 'react', icon: 'logo-react', description: 'Web frontend' },
              { label: 'Vue.js', value: 'vue', icon: 'logo-vue', description: 'Progressive framework' },
              { label: 'Angular', value: 'angular', icon: 'logo-angular', description: 'Full framework' },
              { label: 'Swift', value: 'swift', icon: 'phone-portrait-outline', description: 'iOS development' },
              { label: 'Kotlin', value: 'kotlin', icon: 'phone-portrait-outline', description: 'Android development' },
              { label: 'GraphQL', value: 'graphql', icon: 'server-outline', description: 'API query language' },
              { label: 'MongoDB', value: 'mongodb', icon: 'server-outline', description: 'NoSQL database' },
              { label: 'PostgreSQL', value: 'postgresql', icon: 'server-outline', description: 'SQL database' },
              { label: 'Docker', value: 'docker', icon: 'cube-outline', description: 'Containerization' },
              { label: 'AWS', value: 'aws', icon: 'cloud-outline', description: 'Cloud platform' },
            ]}
            onSelectionChange={(values, options) => {
              setSelectedSkills(values as (string | number)[]);
            }}
            helperText="Multi-select with search - shows count when multiple selected"
            closeOnSelect={false}
          />

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Component Sizes:</Text>
          <View style={{ gap: theme.sizes.sm }}>
            <Select
              label="Small Size"
              placeholder="Compact select for tight spaces"
              size="small"
              value={selectedPlan}
              leftIcon="contract-outline"
              options={[
                { label: 'Starter', value: 'starter', icon: 'rocket-outline', description: '$9/month - Basic features' },
                { label: 'Professional', value: 'pro', icon: 'business-outline', description: '$29/month - Advanced tools' },
                { label: 'Enterprise', value: 'enterprise', icon: 'shield-outline', description: '$99/month - Full suite' },
                { label: 'Custom', value: 'custom', icon: 'construct-outline', description: 'Contact for pricing' },
              ]}
              onSelectionChange={(value, option) => {
                setSelectedPlan(value);
              }}
              helperText="Small size - perfect for forms with limited space"
            />

            <Select
              label="Medium Size (Default)"
              placeholder="Standard select for most use cases"
              size="medium"
              value={selectedPriority}
              leftIcon="flag-outline"
              options={[
                { label: 'Low Priority', value: 'low', icon: 'chevron-down-outline', description: 'Non-urgent tasks' },
                { label: 'Medium Priority', value: 'medium', icon: 'remove-outline', description: 'Standard importance' },
                { label: 'High Priority', value: 'high', icon: 'chevron-up-outline', description: 'Important tasks' },
                { label: 'Critical', value: 'critical', icon: 'alert-outline', description: 'Urgent action needed' },
                { label: 'Blocked', value: 'blocked', icon: 'ban-outline', description: 'Cannot proceed', disabled: true },
              ]}
              onSelectionChange={(value, option) => {
                setSelectedPriority(value);
              }}
              helperText="Medium size - standard height for regular forms"
            />

            <Select
              label="Large Size"
              placeholder="Prominent select for important choices"
              size="large"
              value={selectedCategory}
              leftIcon="apps-outline"
              searchable
              options={[
                { label: 'Technology', value: 'tech', icon: 'hardware-chip-outline', description: 'Software, hardware, and digital solutions' },
                { label: 'Business', value: 'business', icon: 'briefcase-outline', description: 'Corporate and entrepreneurial topics' },
                { label: 'Design', value: 'design', icon: 'color-palette-outline', description: 'UI/UX, graphics, and creative work' },
                { label: 'Marketing', value: 'marketing', icon: 'megaphone-outline', description: 'Promotion and brand strategy' },
                { label: 'Finance', value: 'finance', icon: 'card-outline', description: 'Money management and investments' },
                { label: 'Education', value: 'education', icon: 'school-outline', description: 'Learning and teaching resources' },
                { label: 'Health', value: 'health', icon: 'fitness-outline', description: 'Wellness and medical topics' },
                { label: 'Travel', value: 'travel', icon: 'airplane-outline', description: 'Tourism and exploration' },
              ]}
              onSelectionChange={(value, option) => {
                setSelectedCategory(value);
              }}
              helperText="Large size - draws attention for key decisions"
            />
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Color Variants:</Text>
          <View style={{ gap: theme.sizes.sm }}>
            <Select
              label="Primary Theme"
              placeholder="Default primary styling"
              variant="primary"
              value={selectedLanguages[0]}
              leftIcon="color-palette-outline"
              options={[
                { label: 'Blue Theme', value: 'blue', icon: 'water-outline', description: 'Professional and trustworthy' },
                { label: 'Purple Theme', value: 'purple', icon: 'diamond-outline', description: 'Creative and innovative' },
                { label: 'Teal Theme', value: 'teal', icon: 'leaf-outline', description: 'Fresh and modern' },
                { label: 'Indigo Theme', value: 'indigo', icon: 'prism-outline', description: 'Deep and sophisticated' },
              ]}
              onSelectionChange={(value, option) => {
                setSelectedLanguages([value] as (string | number)[]);
              }}
              helperText="Primary variant - uses main brand colors"
            />

            <Select
              label="Success State"
              placeholder="Positive actions and confirmations"
              variant="success"
              value={selectedSize}
              leftIcon="checkmark-circle-outline"
              multiple
              options={[
                { label: 'Task Completed', value: 'completed', icon: 'checkmark-outline', description: 'Successfully finished' },
                { label: 'Payment Processed', value: 'payment', icon: 'card-outline', description: 'Transaction successful' },
                { label: 'Account Verified', value: 'verified', icon: 'shield-checkmark-outline', description: 'Identity confirmed' },
                { label: 'Email Confirmed', value: 'email', icon: 'mail-outline', description: 'Address validated' },
                { label: 'Account Updated', value: 'account', icon: 'person-outline', description: 'Changes saved' },
              ]}
              onSelectionChange={(values, options) => {
                setSelectedSize(values as any);
              }}
              helperText="Success variant - green theme for positive outcomes"
            />

            <Select
              label="Warning State"
              placeholder="Caution and important notices"
              variant="warning"
              value={selectedTimezone}
              leftIcon="warning-outline"
              options={[
                { label: 'Low Storage Space', value: 'storage', icon: 'folder-outline', description: 'Less than 10% remaining' },
                { label: 'Trial Expiring Soon', value: 'trial', icon: 'time-outline', description: '3 days remaining' },
                { label: 'Password Weak', value: 'password', icon: 'key-outline', description: 'Consider strengthening' },
                { label: 'Backup Overdue', value: 'backup', icon: 'cloud-upload-outline', description: 'Last backup: 7 days ago' },
                { label: 'License Renewal', value: 'license', icon: 'document-outline', description: 'Expires next month' },
              ]}
              onSelectionChange={(value, option) => {
                setSelectedTimezone(value);
              }}
              helperText="Warning variant - orange theme for attention-needed items"
            />

            <Select
              label="Error State"
              placeholder="Critical issues and failures"
              variant="error"
              leftIcon="alert-circle-outline"
              error="This field requires immediate attention"
              options={[
                { label: 'Server Offline', value: 'server', icon: 'server-outline', description: 'Connection failed' },
                { label: 'Payment Failed', value: 'payment', icon: 'card-outline', description: 'Transaction declined' },
                { label: 'Access Denied', value: 'access', icon: 'ban-outline', description: 'Insufficient permissions' },
                { label: 'Data Corrupted', value: 'data', icon: 'warning-outline', description: 'File integrity compromised' },
                { label: 'Service Unavailable', value: 'service', icon: 'close-circle-outline', description: 'Temporarily down' },
              ]}
              onSelectionChange={() => {}}
              helperText="Error variant - red theme for critical issues"
            />
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Component States:</Text>
          <View style={{ gap: theme.sizes.sm }}>
            <Select
              label="With Helper Text"
              placeholder="Provides helpful guidance"
              value={selectedTeamMembers[0]}
              leftIcon="information-circle-outline"
              options={[
                { label: 'Option with guidance', value: 'guided', icon: 'help-outline' },
                { label: 'Self-explanatory option', value: 'clear', icon: 'checkmark-outline' },
                { label: 'Complex option', value: 'complex', icon: 'construct-outline' },
              ]}
              onSelectionChange={(value) => setSelectedTeamMembers([value] as (string | number)[])}
              helperText="Helper text provides additional context and guidance for users"
            />

            <Select
              label="Disabled State"
              placeholder="Cannot be interacted with"
              disabled={true}
              leftIcon="ban-outline"
              options={[
                { label: 'Unavailable option', value: 'unavailable' },
                { label: 'Locked feature', value: 'locked' },
              ]}
              onSelectionChange={() => {}}
              helperText="Disabled selects prevent user interaction"
            />
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Advanced Features:</Text>
          <Select
            label="Rich Content Select"
            placeholder="Options with detailed information"
            value={selectedColorScheme}
            searchable
            searchPlaceholder="Search plans..."
            leftIcon="layers-outline"
            options={[
              {
                label: 'Starter Plan',
                value: 'starter',
                icon: 'rocket-outline',
                description: '$9/month • 5 projects • 10GB storage • Email support'
              },
              {
                label: 'Professional Plan',
                value: 'professional',
                icon: 'business-outline',
                description: '$29/month • 25 projects • 100GB storage • Priority support'
              },
              {
                label: 'Team Plan',
                value: 'team',
                icon: 'people-outline',
                description: '$49/month • Unlimited projects • 500GB storage • Team collaboration'
              },
              {
                label: 'Enterprise Plan',
                value: 'enterprise',
                icon: 'shield-outline',
                description: '$99/month • Everything + SSO • Custom integrations • Dedicated support'
              },
              {
                label: 'Legacy Plan',
                value: 'legacy',
                icon: 'archive-outline',
                description: 'No longer available for new customers',
                disabled: true
              },
            ]}
            onSelectionChange={(value, option) => {
              setSelectedColorScheme(value);
            }}
            helperText="Complex options with rich descriptions and pricing details"
          />
        </Card>

        {/* Icons Showcase */}
        <Card
          style={{ marginBottom: theme.sizes.lg }}
          onLayout={(event) => onSectionLayout('icons', event)}
        >
          <Text variant="subtitle" style={{ marginBottom: theme.sizes.md }}>
            Icon Library (Ionicons)
          </Text>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Common Icons:</Text>
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: theme.sizes.md,
            marginBottom: theme.sizes.md
          }}>
            <View style={{ alignItems: 'center' }}>
              <Icon name="home-outline" size={32} color={theme.colors.primary} />
              <Text variant="caption">home</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Icon name="person-outline" size={32} color={theme.colors.primary} />
              <Text variant="caption">person</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Icon name="settings-outline" size={32} color={theme.colors.primary} />
              <Text variant="caption">settings</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Icon name="notifications-outline" size={32} color={theme.colors.primary} />
              <Text variant="caption">notify</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Icon name="search-outline" size={32} color={theme.colors.primary} />
              <Text variant="caption">search</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Icon name="add-outline" size={32} color={theme.colors.primary} />
              <Text variant="caption">add</Text>
            </View>
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Status Icons:</Text>
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: theme.sizes.md,
            marginBottom: theme.sizes.md
          }}>
            <View style={{ alignItems: 'center' }}>
              <Icon name="checkmark-circle-outline" size={32} color={theme.colors.success} />
              <Text variant="caption">success</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Icon name="alert-circle-outline" size={32} color={theme.colors.warning} />
              <Text variant="caption">warning</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Icon name="close-circle-outline" size={32} color={theme.colors.error} />
              <Text variant="caption">error</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Icon name="information-circle-outline" size={32} color={theme.colors.primary} />
              <Text variant="caption">info</Text>
            </View>
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Icon Sizes:</Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.sizes.md,
            marginBottom: theme.sizes.md
          }}>
            <Icon name="star-outline" size={16} color={theme.colors.warning} />
            <Icon name="star-outline" size={24} color={theme.colors.warning} />
            <Icon name="star-outline" size={32} color={theme.colors.warning} />
            <Icon name="star-outline" size={48} color={theme.colors.warning} />
            <Text variant="caption">16, 24, 32, 48px</Text>
          </View>
        </Card>

        {/* Loading Spinners */}
        <Card
          title="Loading Spinners"
          headerIcon="refresh-outline"
          headerSpacing="medium"
          headerBorder
          style={{ marginBottom: theme.sizes.lg }}
          onLayout={(event) => onSectionLayout('loading', event)}
        >
          <Text variant="caption" style={{ marginBottom: theme.sizes.lg, color: theme.colors.textSecondary }}>
            Full-featured loading indicators with multiple variants, sizes, animations, and progress tracking
          </Text>

          {/* Size Variants */}
          <View style={{ marginBottom: theme.sizes.xl }}>
            <Text variant="body" style={{ fontWeight: '600', marginBottom: theme.sizes.md }}>
              Size Variants
            </Text>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              paddingVertical: theme.sizes.lg
            }}>
              <View style={{ alignItems: 'center' }}>
                <LoadingSpinner size="xs" />
                <Text variant="caption" style={{ marginTop: theme.sizes.sm }}>XS</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <LoadingSpinner size="small" />
                <Text variant="caption" style={{ marginTop: theme.sizes.sm }}>Small</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <LoadingSpinner size="medium" />
                <Text variant="caption" style={{ marginTop: theme.sizes.sm }}>Medium</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <LoadingSpinner size="large" />
                <Text variant="caption" style={{ marginTop: theme.sizes.sm }}>Large</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <LoadingSpinner size="xl" />
                <Text variant="caption" style={{ marginTop: theme.sizes.sm }}>XL</Text>
              </View>
            </View>
          </View>

          {/* Spinner Variants */}
          <View style={{ marginBottom: theme.sizes.xl }}>
            <Text variant="body" style={{ fontWeight: '600', marginBottom: theme.sizes.md }}>
              Spinner Variants
            </Text>
            <View style={{ gap: theme.sizes.lg }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                paddingVertical: theme.sizes.md
              }}>
                <View style={{ alignItems: 'center' }}>
                  <LoadingSpinner variant="default" size="medium" />
                  <Text variant="caption" style={{ marginTop: theme.sizes.sm }}>Default</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <LoadingSpinner variant="circle" size="medium" />
                  <Text variant="caption" style={{ marginTop: theme.sizes.sm }}>Circle</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <LoadingSpinner variant="dots" size="medium" />
                  <Text variant="caption" style={{ marginTop: theme.sizes.sm }}>Dots</Text>
                </View>
              </View>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                paddingVertical: theme.sizes.md
              }}>
                <View style={{ alignItems: 'center' }}>
                  <LoadingSpinner variant="pulse" size="medium" />
                  <Text variant="caption" style={{ marginTop: theme.sizes.sm }}>Pulse</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <LoadingSpinner variant="bars" size="medium" />
                  <Text variant="caption" style={{ marginTop: theme.sizes.sm }}>Bars</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <LoadingSpinner variant="custom" icon="sync-outline" size="medium" />
                  <Text variant="caption" style={{ marginTop: theme.sizes.sm }}>Custom Icon</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Progress Indicators */}
          <View style={{ marginBottom: theme.sizes.xl }}>
            <Text variant="body" style={{ fontWeight: '600', marginBottom: theme.sizes.md }}>
              Progress Indicators
            </Text>
            <View style={{ gap: theme.sizes.lg }}>
              <View style={{ alignItems: 'center' }}>
                <LoadingSpinner
                  variant="circle"
                  size="large"
                  progress={65}
                  message="Uploading files"
                  showPercentage={true}
                />
              </View>
              <View style={{ alignItems: 'center' }}>
                <LoadingSpinner
                  variant="default"
                  size="medium"
                  progress={85}
                  message="Processing"
                  showPercentage={true}
                  color={theme.colors.success}
                />
              </View>
            </View>
          </View>

          {/* Position Variants */}
          <View style={{ marginBottom: theme.sizes.xl }}>
            <Text variant="body" style={{ fontWeight: '600', marginBottom: theme.sizes.md }}>
              Position & Message Variants
            </Text>
            <View style={{ gap: theme.sizes.md }}>
              <View style={{
                backgroundColor: theme.colors.background,
                borderRadius: theme.borderRadius.md,
                borderWidth: 1,
                borderColor: theme.colors.border,
                padding: theme.sizes.md,
              }}>
                <LoadingSpinner
                  variant="dots"
                  size="small"
                  position="inline"
                  message="Loading content..."
                />
              </View>

              <View style={{ alignItems: 'center', paddingVertical: theme.sizes.md }}>
                <LoadingSpinner
                  variant="pulse"
                  size="medium"
                  message="Please wait while we process your request"
                  color={theme.colors.warning}
                />
              </View>
            </View>
          </View>

          {/* Custom Colors & Animations */}
          <View style={{ marginBottom: theme.sizes.xl }}>
            <Text variant="body" style={{ fontWeight: '600', marginBottom: theme.sizes.md }}>
              Custom Colors & Animations
            </Text>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              paddingVertical: theme.sizes.lg
            }}>
              <View style={{ alignItems: 'center' }}>
                <LoadingSpinner
                  variant="circle"
                  size="medium"
                  color={theme.colors.success}
                  duration={800}
                />
                <Text variant="caption" style={{ marginTop: theme.sizes.sm, color: theme.colors.success }}>
                  Success
                </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <LoadingSpinner
                  variant="bars"
                  size="medium"
                  color={theme.colors.warning}
                  secondaryColor={theme.colors.warning + '40'}
                  duration={1500}
                />
                <Text variant="caption" style={{ marginTop: theme.sizes.sm, color: theme.colors.warning }}>
                  Warning
                </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <LoadingSpinner
                  variant="pulse"
                  size="medium"
                  color={theme.colors.error}
                  duration={600}
                />
                <Text variant="caption" style={{ marginTop: theme.sizes.sm, color: theme.colors.error }}>
                  Error
                </Text>
              </View>
            </View>
          </View>

          {/* Overlay Example */}
          <View style={{ marginBottom: theme.sizes.lg }}>
            <Text variant="body" style={{ fontWeight: '600', marginBottom: theme.sizes.md }}>
              Overlay Loading
            </Text>
            <View style={{
              position: 'relative',
              height: 120,
              backgroundColor: theme.colors.background,
              borderRadius: theme.borderRadius.md,
              borderWidth: 1,
              borderColor: theme.colors.border,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Text variant="body" style={{ color: theme.colors.textSecondary }}>
                Content behind overlay
              </Text>
              <LoadingSpinner
                variant="circle"
                size="large"
                overlay={true}
                overlayOpacity={0.7}
                message="Loading overlay..."
              />
            </View>
          </View>

          {/* Feature Summary */}
          <View style={{
            backgroundColor: theme.colors.primary + '10',
            padding: theme.sizes.md,
            borderRadius: theme.borderRadius.md,
          }}>
            <Text variant="body" style={{ fontWeight: '600', marginBottom: theme.sizes.sm }}>
              LoadingSpinner Features:
            </Text>
            <View style={{ gap: theme.sizes.xs }}>
              <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
                • 5 sizes: xs, small, medium, large, xl
              </Text>
              <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
                • 6 variants: default, circle, dots, pulse, bars, custom
              </Text>
              <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
                • 4 positions: center, top, bottom, inline
              </Text>
              <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
                • Progress tracking with percentage display
              </Text>
              <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
                • Custom colors and animation durations
              </Text>
              <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
                • Overlay support with opacity control
              </Text>
              <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
                • Custom icons and messages
              </Text>
              <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
                • Completion callbacks and test IDs
              </Text>
            </View>
          </View>
        </Card>


        {/* Card Component Examples */}
        <Card
          style={{ marginBottom: theme.sizes.lg }}
          onLayout={(event) => onSectionLayout('cards', event)}
        >
          <Text variant="subtitle" style={{ marginBottom: theme.sizes.md }}>
            Card Component Variations
          </Text>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Basic Card Types:</Text>
          <View style={{ gap: theme.sizes.sm, marginBottom: theme.sizes.md }}>
            <Card
              title="Default Card"
              subtitle="Simple card with title and subtitle"
              headerIcon="document-outline"
            >
              <Text variant="body">
                This is the default card variant with standard styling and theme-aware colors.
              </Text>
            </Card>

            <Card
              variant="elevated"
              title="Elevated Card"
              subtitle="Card with shadow elevation"
              headerIcon="layers-outline"
              badge="New"
            >
              <Text variant="body">
                Elevated cards have shadow effects to create depth and visual hierarchy.
              </Text>
            </Card>

            <Card
              variant="outlined"
              title="Outlined Card"
              subtitle="Card with border outline"
              headerIcon="square-outline"
              badge="Popular"
              badgeColor="success"
            >
              <Text variant="body">
                Outlined cards feature a visible border to define boundaries clearly.
              </Text>
            </Card>
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Card Sizes:</Text>
          <View style={{ gap: theme.sizes.sm, marginBottom: theme.sizes.md }}>
            <Card
              size="small"
              variant="elevated"
              title="Small Card"
              subtitle="Compact size for tight spaces"
              headerIcon="contract-outline"
            >
              <Text variant="caption">Perfect for lists and compact layouts.</Text>
            </Card>

            <Card
              size="medium"
              variant="elevated"
              title="Medium Card (Default)"
              subtitle="Standard size for most use cases"
              headerIcon="radio-button-off-outline"
            >
              <Text variant="body">The default medium size works well for most content types.</Text>
            </Card>

            <Card
              size="large"
              variant="elevated"
              title="Large Card"
              subtitle="Prominent size for important content"
              headerIcon="expand-outline"
              badge="Featured"
              badgeColor="primary"
            >
              <Text variant="body">Large cards draw attention and work great for hero content or featured items.</Text>
            </Card>
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Color Schemes:</Text>
          <View style={{ gap: theme.sizes.sm, marginBottom: theme.sizes.md }}>
            <Card
              colorScheme="primary"
              variant="filled"
              title="Primary Theme"
              subtitle="Using brand primary colors"
              headerIcon="color-palette-outline"
              badge="Brand"
            >
              <Text variant="body">Primary color scheme for brand-related content.</Text>
            </Card>

            <Card
              colorScheme="success"
              variant="filled"
              title="Success State"
              subtitle="Positive outcomes and confirmations"
              headerIcon="checkmark-circle-outline"
              badge="Success"
              badgeColor="success"
            >
              <Text variant="body">Green theme for successful operations and positive feedback.</Text>
            </Card>

            <Card
              colorScheme="warning"
              variant="filled"
              title="Warning State"
              subtitle="Important notices and cautions"
              headerIcon="warning-outline"
              badge="Alert"
              badgeColor="warning"
            >
              <Text variant="body">Orange theme for warnings and important notifications.</Text>
            </Card>

            <Card
              colorScheme="error"
              variant="filled"
              title="Error State"
              subtitle="Critical issues and failures"
              headerIcon="alert-circle-outline"
              badge="Critical"
              badgeColor="error"
            >
              <Text variant="body">Red theme for errors and critical system states.</Text>
            </Card>
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Interactive Cards:</Text>
          <View style={{ gap: theme.sizes.sm, marginBottom: theme.sizes.md }}>
            <Card
              variant="elevated"
              title="Clickable Card"
              subtitle="Tap to interact"
              headerIcon="finger-print-outline"
              badge="Interactive"
              onPress={() => Alert.alert('Card Pressed', 'You tapped the interactive card!')}
            >
              <Text variant="body">This card responds to touch interactions with visual feedback.</Text>
            </Card>

            <Card
              variant="outlined"
              title="Card with Actions"
              subtitle="Multiple action buttons"
              headerIcon="construct-outline"
              actions={[
                {
                  label: 'Edit',
                  onPress: () => Alert.alert('Edit', 'Edit action pressed'),
                  variant: 'outline',
                  leftIcon: 'create-outline'
                },
                {
                  label: 'Share',
                  onPress: () => Alert.alert('Share', 'Share action pressed'),
                  variant: 'ghost',
                  leftIcon: 'share-outline'
                },
                {
                  label: 'Delete',
                  onPress: () => Alert.alert('Delete', 'Delete action pressed'),
                  variant: 'outline',
                  leftIcon: 'trash-outline'
                }
              ]}
            >
              <Text variant="body">Cards can include action buttons for quick operations.</Text>
            </Card>
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Advanced Features:</Text>
          <View style={{ gap: theme.sizes.sm, marginBottom: theme.sizes.md }}>
            <Card
              variant="elevated"
              title="Card with Image"
              subtitle="Visual content integration"
              headerIcon="image-outline"
              badge="Media"
              badgeColor="secondary"
              image={
                <View style={{
                  height: 120,
                  backgroundColor: theme.colors.primary + '20',
                  borderRadius: theme.sizes.sm,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Icon name="image-outline" size={48} color={theme.colors.primary} />
                  <Text variant="caption" style={{ color: theme.colors.primary, marginTop: 8 }}>
                    Image Placeholder
                  </Text>
                </View>
              }
            >
              <Text variant="body">Cards can display images or other visual content seamlessly.</Text>
            </Card>

            <Card
              horizontal
              variant="elevated"
              title="Horizontal Layout"
              subtitle="Side-by-side content"
              headerIcon="resize-outline"
              badge="Layout"
              image={
                <View style={{
                  width: 80,
                  height: 80,
                  backgroundColor: theme.colors.success + '20',
                  borderRadius: theme.sizes.sm,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Icon name="grid-outline" size={32} color={theme.colors.success} />
                </View>
              }
            >
              <Text variant="body">Horizontal cards work well for compact lists and mobile layouts.</Text>
            </Card>

            <Card
              variant="outlined"
              colorScheme="primary"
              title="Complex Card"
              subtitle="Full-featured demonstration"
              headerIcon="star-outline"
              badge="Premium"
              badgeColor="warning"
              headerActions={
                <TouchableOpacity onPress={() => Alert.alert('Menu', 'Header action pressed')}>
                  <Icon name="ellipsis-vertical" size={20} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              }
              footer={
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: theme.sizes.sm,
                  borderTopWidth: 1,
                  borderTopColor: theme.colors.border
                }}>
                  <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
                    Last updated: 2 hours ago
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name="heart-outline" size={16} color={theme.colors.error} />
                    <Text variant="caption" style={{ marginLeft: 4, color: theme.colors.textSecondary }}>
                      24 likes
                    </Text>
                  </View>
                </View>
              }
              actions={[
                {
                  label: 'Learn More',
                  onPress: () => Alert.alert('Learn More', 'More info requested'),
                  variant: 'primary',
                  rightIcon: 'arrow-forward-outline'
                }
              ]}
            >
              <Text variant="body" style={{ marginBottom: theme.sizes.sm }}>
                This card demonstrates all available features including headers, footers, actions,
                badges, and custom content areas.
              </Text>
              <View style={{
                backgroundColor: theme.colors.surface,
                padding: theme.sizes.sm,
                borderRadius: theme.sizes.xs,
                marginTop: theme.sizes.sm
              }}>
                <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
                  💡 Cards are fully customizable and theme-aware components perfect for
                  displaying structured content with consistent styling.
                </Text>
              </View>
            </Card>
          </View>
        </Card>

        {/* Gallery Slider Component Examples */}
        <Card
          style={{ marginBottom: theme.sizes.lg }}
          onLayout={(event) => onSectionLayout('gallery-slider', event)}
        >
          <Text variant="subtitle" style={{ marginBottom: theme.sizes.md }}>
            Gallery Slider Component Showcase
          </Text>
          <Text variant="caption" style={{
            marginBottom: theme.sizes.lg,
            color: theme.colors.textSecondary
          }}>
            Full-featured image gallery with auto-play, zoom, navigation controls, and thumbnails
          </Text>

          {/* Basic Gallery */}
          <View style={{ marginBottom: theme.sizes.xl }}>
            <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Basic Gallery:</Text>
            <View style={{
              height: 200,
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.md,
              padding: theme.sizes.xs
            }}>
              <GallerySlider
                items={galleryItems.slice(0, 3)}
                style={{ flex: 1 }}
                showDots={true}
                imageDisplayMode="cover"
                borderRadius={theme.borderRadius.sm}
              />
            </View>
          </View>

          {/* Full Features */}
          <View style={{ marginBottom: theme.sizes.xl }}>
            <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Full Features:</Text>
            <View style={{ backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.md, padding: theme.sizes.xs }}>
              <GallerySlider
                items={galleryItems}
                style={{ height: 250 }}
                autoPlay={true}
                autoPlayInterval={4000}
                showDots={true}
                showArrows={true}
                showCounter={true}
                showThumbnails={true}
                thumbnailHeight={70}
                enableZoom={false}
                enableFullscreen={false}
                loop={true}
                imageDisplayMode="cover"
                borderRadius={theme.borderRadius.sm}
                onImageChange={(index) => {
                  // Handle image change
                }}
                onImagePress={(item, index) => {
                  // Handle image press
                }}
                onFullscreenToggle={(isFullscreen) => {
                  // Handle fullscreen toggle
                }}
              />
            </View>
          </View>

          <View style={{
            backgroundColor: theme.colors.surface,
            padding: theme.sizes.sm,
            borderRadius: theme.sizes.xs,
            marginTop: theme.sizes.sm
          }}>
            <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
              💡 Gallery Slider features auto-detection of container dimensions, flexible image display modes (cover, contain, stretch, center), auto-play, zoom gestures, navigation controls, thumbnails, and fullscreen mode. Perfect for any container size with smooth transitions and interactive features. No need to specify height - it adapts automatically!
            </Text>
          </View>
        </Card>

        {/* Avatar Component Examples */}
        <Card
          style={{ marginBottom: theme.sizes.lg }}
          onLayout={(event) => onSectionLayout('avatars', event)}
        >
          <Text variant="subtitle" style={{ marginBottom: theme.sizes.md }}>
            Avatar Component Showcase
          </Text>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Avatar Sizes:</Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.sizes.md,
            marginBottom: theme.sizes.lg,
            flexWrap: 'wrap'
          }}>
            <View style={{ alignItems: 'center' }}>
              <Avatar size="xs" name="John Doe" />
              <Text variant="caption" style={{ marginTop: theme.sizes.xs }}>XS (24px)</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Avatar size="sm" name="Jane Smith" />
              <Text variant="caption" style={{ marginTop: theme.sizes.xs }}>SM (32px)</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Avatar size="md" name="Bob Wilson" />
              <Text variant="caption" style={{ marginTop: theme.sizes.xs }}>MD (40px)</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Avatar size="lg" name="Alice Brown" />
              <Text variant="caption" style={{ marginTop: theme.sizes.xs }}>LG (56px)</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Avatar size="xl" name="Charlie Davis" />
              <Text variant="caption" style={{ marginTop: theme.sizes.xs }}>XL (72px)</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Avatar size="xxl" name="Diana Miller" />
              <Text variant="caption" style={{ marginTop: theme.sizes.xs }}>XXL (96px)</Text>
            </View>
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Avatar Variants:</Text>
          <View style={{ gap: theme.sizes.md, marginBottom: theme.sizes.lg }}>
            <View>
              <Text variant="caption" style={{ marginBottom: theme.sizes.xs, color: theme.colors.textSecondary }}>
                Circle Avatars (Default):
              </Text>
              <View style={{ flexDirection: 'row', gap: theme.sizes.md, alignItems: 'center' }}>
                <Avatar variant="circle" size="lg" name="Circle User" />
                <Avatar variant="circle" size="lg" fallbackIcon="person-outline" />
                <Avatar variant="circle" size="lg" initials="CU" backgroundColor={theme.colors.primary} />
              </View>
            </View>

            <View>
              <Text variant="caption" style={{ marginBottom: theme.sizes.xs, color: theme.colors.textSecondary }}>
                Rounded Avatars:
              </Text>
              <View style={{ flexDirection: 'row', gap: theme.sizes.md, alignItems: 'center' }}>
                <Avatar variant="rounded" size="lg" name="Rounded User" />
                <Avatar variant="rounded" size="lg" fallbackIcon="business-outline" />
                <Avatar variant="rounded" size="lg" initials="RU" backgroundColor={theme.colors.success} />
              </View>
            </View>

            <View>
              <Text variant="caption" style={{ marginBottom: theme.sizes.xs, color: theme.colors.textSecondary }}>
                Square Avatars:
              </Text>
              <View style={{ flexDirection: 'row', gap: theme.sizes.md, alignItems: 'center' }}>
                <Avatar variant="square" size="lg" name="Square User" />
                <Avatar variant="square" size="lg" fallbackIcon="cube-outline" />
                <Avatar variant="square" size="lg" initials="SU" backgroundColor={theme.colors.warning} />
              </View>
            </View>
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Content Types:</Text>
          <View style={{ gap: theme.sizes.md, marginBottom: theme.sizes.lg }}>
            <View>
              <Text variant="caption" style={{ marginBottom: theme.sizes.xs, color: theme.colors.textSecondary }}>
                Name-based Initials:
              </Text>
              <View style={{ flexDirection: 'row', gap: theme.sizes.sm, alignItems: 'center', flexWrap: 'wrap' }}>
                <Avatar size="md" name="John Doe" />
                <Avatar size="md" name="Jane Smith Wilson" />
                <Avatar size="md" name="Bob" />
                <Avatar size="md" name="María García López" />
                <Avatar size="md" name="李明华" />
              </View>
            </View>

            <View>
              <Text variant="caption" style={{ marginBottom: theme.sizes.xs, color: theme.colors.textSecondary }}>
                Custom Initials:
              </Text>
              <View style={{ flexDirection: 'row', gap: theme.sizes.sm, alignItems: 'center' }}>
                <Avatar size="md" initials="JS" backgroundColor={theme.colors.primary} />
                <Avatar size="md" initials="AB" backgroundColor={theme.colors.success} />
                <Avatar size="md" initials="XY" backgroundColor={theme.colors.warning} />
                <Avatar size="md" initials="ZZ" backgroundColor={theme.colors.error} />
              </View>
            </View>

            <View>
              <Text variant="caption" style={{ marginBottom: theme.sizes.xs, color: theme.colors.textSecondary }}>
                Icon Fallbacks:
              </Text>
              <View style={{ flexDirection: 'row', gap: theme.sizes.sm, alignItems: 'center' }}>
                <Avatar size="md" fallbackIcon="person-outline" />
                <Avatar size="md" fallbackIcon="business-outline" backgroundColor={theme.colors.secondary} />
                <Avatar size="md" fallbackIcon="shield-outline" backgroundColor={theme.colors.success} />
                <Avatar size="md" fallbackIcon="star-outline" backgroundColor={theme.colors.warning} />
                <Avatar size="md" fallbackIcon="heart-outline" backgroundColor={theme.colors.error} />
              </View>
            </View>
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Status Indicators:</Text>
          <View style={{ gap: theme.sizes.md, marginBottom: theme.sizes.lg }}>
            <View>
              <Text variant="caption" style={{ marginBottom: theme.sizes.xs, color: theme.colors.textSecondary }}>
                Online Status:
              </Text>
              <View style={{ flexDirection: 'row', gap: theme.sizes.md, alignItems: 'center' }}>
                <Avatar size="lg" name="Online User" status="online" showStatus={true} />
                <Avatar size="lg" name="Offline User" status="offline" showStatus={true} />
                <Avatar size="lg" name="Busy User" status="busy" showStatus={true} />
                <Avatar size="lg" name="Away User" status="away" showStatus={true} />
              </View>
            </View>

            <View>
              <Text variant="caption" style={{ marginBottom: theme.sizes.xs, color: theme.colors.textSecondary }}>
                Custom Status Size:
              </Text>
              <View style={{ flexDirection: 'row', gap: theme.sizes.md, alignItems: 'center' }}>
                <Avatar size="xl" name="User 1" status="online" showStatus={true} statusSize={16} />
                <Avatar size="xl" name="User 2" status="busy" showStatus={true} statusSize={20} />
              </View>
            </View>
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Badge Indicators:</Text>
          <View style={{ gap: theme.sizes.md, marginBottom: theme.sizes.lg }}>
            <View>
              <Text variant="caption" style={{ marginBottom: theme.sizes.xs, color: theme.colors.textSecondary }}>
                Notification Badges:
              </Text>
              <View style={{ flexDirection: 'row', gap: theme.sizes.md, alignItems: 'center' }}>
                <Avatar size="lg" name="User 1" badge={3} showBadge={true} />
                <Avatar size="lg" name="User 2" badge={12} showBadge={true} />
                <Avatar size="lg" name="User 3" badge={99} showBadge={true} />
                <Avatar size="lg" name="User 4" badge={150} showBadge={true} />
                <Avatar size="lg" name="User 5" badge="!" showBadge={true} badgeColor={theme.colors.warning} />
              </View>
            </View>

            <View>
              <Text variant="caption" style={{ marginBottom: theme.sizes.xs, color: theme.colors.textSecondary }}>
                Custom Badge Colors:
              </Text>
              <View style={{ flexDirection: 'row', gap: theme.sizes.md, alignItems: 'center' }}>
                <Avatar size="lg" name="User 1" badge={5} showBadge={true} badgeColor={theme.colors.primary} />
                <Avatar size="lg" name="User 2" badge="★" showBadge={true} badgeColor={theme.colors.success} badgeTextColor="white" />
                <Avatar size="lg" name="User 3" badge="VIP" showBadge={true} badgeColor={theme.colors.warning} badgeTextColor="black" />
              </View>
            </View>
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Combined Features:</Text>
          <View style={{ gap: theme.sizes.md, marginBottom: theme.sizes.lg }}>
            <View>
              <Text variant="caption" style={{ marginBottom: theme.sizes.xs, color: theme.colors.textSecondary }}>
                Status + Badge Combination:
              </Text>
              <View style={{ flexDirection: 'row', gap: theme.sizes.md, alignItems: 'center' }}>
                <Avatar
                  size="xl"
                  name="John Admin"
                  status="online"
                  showStatus={true}
                  badge={7}
                  showBadge={true}
                  variant="rounded"
                />
                <Avatar
                  size="xl"
                  name="Sarah Manager"
                  status="busy"
                  showStatus={true}
                  badge="!"
                  showBadge={true}
                  badgeColor={theme.colors.warning}
                  variant="circle"
                />
              </View>
            </View>

            <View>
              <Text variant="caption" style={{ marginBottom: theme.sizes.xs, color: theme.colors.textSecondary }}>
                Custom Styling:
              </Text>
              <View style={{ flexDirection: 'row', gap: theme.sizes.md, alignItems: 'center' }}>
                <Avatar
                  size="lg"
                  name="Custom User 1"
                  backgroundColor={theme.colors.primary}
                  textColor="white"
                  borderColor={theme.colors.secondary}
                  borderWidth={3}
                  variant="rounded"
                />
                <Avatar
                  size="lg"
                  name="Custom User 2"
                  backgroundColor="transparent"
                  textColor={theme.colors.text}
                  borderColor={theme.colors.primary}
                  borderWidth={2}
                  variant="circle"
                />
              </View>
            </View>
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Interactive Avatars:</Text>
          <View style={{ gap: theme.sizes.md, marginBottom: theme.sizes.lg }}>
            <View>
              <Text variant="caption" style={{ marginBottom: theme.sizes.xs, color: theme.colors.textSecondary }}>
                Clickable Avatars:
              </Text>
              <View style={{ flexDirection: 'row', gap: theme.sizes.md, alignItems: 'center' }}>
                <Avatar
                  size="lg"
                  name="Account User"
                  onPress={() => Alert.alert('Avatar Pressed', 'Account avatar tapped!')}
                  status="online"
                  showStatus={true}
                />
                <Avatar
                  size="lg"
                  fallbackIcon="add-outline"
                  backgroundColor={theme.colors.primary + '20'}
                  onPress={() => Alert.alert('Avatar Pressed', 'Add user avatar tapped!')}
                  borderColor={theme.colors.primary}
                  borderWidth={2}
                  variant="circle"
                />
                <Avatar
                  size="lg"
                  name="Settings"
                  fallbackIcon="settings-outline"
                  onPress={() => Alert.alert('Avatar Pressed', 'Settings avatar tapped!')}
                  backgroundColor={theme.colors.secondary + '20'}
                  variant="rounded"
                />
              </View>
            </View>

            <View>
              <Text variant="caption" style={{ marginBottom: theme.sizes.xs, color: theme.colors.textSecondary }}>
                Disabled State:
              </Text>
              <View style={{ flexDirection: 'row', gap: theme.sizes.md, alignItems: 'center' }}>
                <Avatar
                  size="lg"
                  name="Disabled User"
                  onPress={() => Alert.alert('Should not fire')}
                  disabled={true}
                  status="offline"
                  showStatus={true}
                />
              </View>
            </View>
          </View>

          <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Use Case Examples:</Text>
          <View style={{ gap: theme.sizes.md }}>
            <View>
              <Text variant="caption" style={{ marginBottom: theme.sizes.xs, color: theme.colors.textSecondary }}>
                User List:
              </Text>
              <View style={{ gap: theme.sizes.sm }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.sizes.md }}>
                  <Avatar size="md" name="Alice Johnson" status="online" showStatus={true} />
                  <View style={{ flex: 1 }}>
                    <Text variant="body" style={{ fontWeight: '600' }}>Alice Johnson</Text>
                    <Text variant="caption" style={{ color: theme.colors.textSecondary }}>Online • Last seen now</Text>
                  </View>
                  <Avatar size="xs" badge={3} showBadge={true} fallbackIcon="chatbubble-outline" />
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.sizes.md }}>
                  <Avatar size="md" name="Bob Smith" status="away" showStatus={true} />
                  <View style={{ flex: 1 }}>
                    <Text variant="body" style={{ fontWeight: '600' }}>Bob Smith</Text>
                    <Text variant="caption" style={{ color: theme.colors.textSecondary }}>Away • Last seen 5 minutes ago</Text>
                  </View>
                  <Avatar size="xs" badge={1} showBadge={true} fallbackIcon="chatbubble-outline" />
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.sizes.md }}>
                  <Avatar size="md" name="Carol Davis" status="busy" showStatus={true} />
                  <View style={{ flex: 1 }}>
                    <Text variant="body" style={{ fontWeight: '600' }}>Carol Davis</Text>
                    <Text variant="caption" style={{ color: theme.colors.textSecondary }}>Busy • In a meeting</Text>
                  </View>
                  <Avatar size="xs" showBadge={false} fallbackIcon="chatbubble-outline" />
                </View>
              </View>
            </View>

            <View>
              <Text variant="caption" style={{ marginBottom: theme.sizes.xs, color: theme.colors.textSecondary }}>
                Team Members:
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: -theme.sizes.sm }}>
                <Avatar size="md" name="Team Lead" backgroundColor={theme.colors.primary} borderColor="white" borderWidth={2} />
                <Avatar size="md" name="Developer 1" backgroundColor={theme.colors.success} borderColor="white" borderWidth={2} />
                <Avatar size="md" name="Developer 2" backgroundColor={theme.colors.warning} borderColor="white" borderWidth={2} />
                <Avatar size="md" name="Designer" backgroundColor={theme.colors.error} borderColor="white" borderWidth={2} />
                <Avatar
                  size="md"
                  initials="+5"
                  backgroundColor={theme.colors.textSecondary}
                  borderColor="white"
                  borderWidth={2}
                  onPress={() => Alert.alert('Team', 'View all team members')}
                />
              </View>
            </View>

            <View>
              <Text variant="caption" style={{ marginBottom: theme.sizes.xs, color: theme.colors.textSecondary }}>
                Account Header:
              </Text>
              <View style={{ alignItems: 'center', gap: theme.sizes.md }}>
                <Avatar
                  size="xxl"
                  name="John Doe"
                  status="online"
                  showStatus={true}
                  statusSize={20}
                  badge="Pro"
                  showBadge={true}
                  badgeColor={theme.colors.warning}
                  badgeTextColor="white"
                  onPress={() => Alert.alert('Account', 'Edit profile picture')}
                  variant="circle"
                />
                <View style={{ alignItems: 'center' }}>
                  <Text variant="title" style={{ fontWeight: 'bold' }}>John Doe</Text>
                  <Text variant="body" style={{ color: theme.colors.textSecondary }}>Senior Developer</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: theme.sizes.xs }}>
                    <View style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: theme.colors.success,
                      marginRight: theme.sizes.xs
                    }} />
                    <Text variant="caption" style={{ color: theme.colors.success }}>Online</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Card>

        {/* Theme Controls */}
        <Card
          style={{ marginBottom: theme.sizes.lg }}
          onLayout={(event) => onSectionLayout('theme', event)}
        >
          <Text variant="subtitle" style={{ marginBottom: theme.sizes.md }}>
            Theme & Controls
          </Text>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.sizes.md
          }}>
            <Text variant="body">Dark Mode</Text>
            <Switch
              value={theme.isDark}
              onValueChange={toggleTheme}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary
              }}
              thumbColor={theme.isDark ? theme.colors.surface : theme.colors.surface}
            />
          </View>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.sizes.md
          }}>
            <Text variant="body">Demo Switch</Text>
            <Switch
              value={switchValue}
              onValueChange={setSwitchValue}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.success
              }}
              thumbColor={switchValue ? theme.colors.surface : theme.colors.surface}
            />
          </View>

          <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
            Current theme: {theme.isDark ? 'Dark' : 'Light'} mode
          </Text>
        </Card>

        {/* Color Palette */}
        <Card
          style={{ marginBottom: theme.sizes.lg }}
          onLayout={(event) => onSectionLayout('colors', event)}
        >
          <Text variant="subtitle" style={{ marginBottom: theme.sizes.md }}>
            Color Palette
          </Text>

          <View style={{ gap: theme.sizes.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 32,
                height: 32,
                backgroundColor: theme.colors.primary,
                borderRadius: 4,
                marginRight: theme.sizes.md
              }} />
              <Text variant="body">Primary - {theme.colors.primary}</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 32,
                height: 32,
                backgroundColor: theme.colors.secondary,
                borderRadius: 4,
                marginRight: theme.sizes.md
              }} />
              <Text variant="body">Secondary - {theme.colors.secondary}</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 32,
                height: 32,
                backgroundColor: theme.colors.success,
                borderRadius: 4,
                marginRight: theme.sizes.md
              }} />
              <Text variant="body">Success - {theme.colors.success}</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 32,
                height: 32,
                backgroundColor: theme.colors.warning,
                borderRadius: 4,
                marginRight: theme.sizes.md
              }} />
              <Text variant="body">Warning - {theme.colors.warning}</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 32,
                height: 32,
                backgroundColor: theme.colors.error,
                borderRadius: 4,
                marginRight: theme.sizes.md
              }} />
              <Text variant="body">Error - {theme.colors.error}</Text>
            </View>
          </View>
        </Card>

        {/* Horizontal Card Scroll */}
        <Card
          title="Horizontal Card Scroll"
          headerIcon="albums-outline"
          headerSpacing="medium"
          headerBorder
          onLayout={(event) => {
            sectionPositions.current['horizontal-cards'] = event.nativeEvent.layout.y;
          }}
        >
          <Text variant="caption" style={{ marginBottom: theme.sizes.lg, color: theme.colors.textSecondary }}>
            Full-featured horizontal scrolling component with multiple variants, states, and customization options
          </Text>

          {/* Hero Variant */}
          <View style={{ marginBottom: theme.sizes.xl }}>
            <Text variant="body" style={{ fontWeight: '600', marginBottom: theme.sizes.md }}>
              Hero Variant
            </Text>
            <HorizontalCardScroll
              variant="hero"
              title="Featured Products"
              subtitle="Premium collection with ratings and pricing"
              headerAction={{
                title: "View All",
                icon: "arrow-forward-outline",
                onPress: () => Alert.alert('Action', 'View all products')
              }}
              showScrollButtons
              contentPadding={0}
              data={[
                {
                  id: 'hero1',
                  title: 'Premium Pro',
                  subtitle: 'Professional Edition',
                  description: 'Complete solution for professionals with advanced features',
                  icon: 'diamond-outline',
                  badge: 'Featured',
                  price: '$299',
                  rating: 4.8,
                  tags: ['Pro', 'Popular', 'Best Value'],
                  onPress: () => Alert.alert('Product', 'Premium Pro selected'),
                  cardProps: { colorScheme: 'primary' }
                },
                {
                  id: 'hero2',
                  title: 'Enterprise Plus',
                  subtitle: 'Business Solution',
                  description: 'Scalable enterprise solution with full support',
                  icon: 'business-outline',
                  badge: 'Enterprise',
                  price: '$599',
                  rating: 4.9,
                  tags: ['Enterprise', 'Support', 'Scalable'],
                  onPress: () => Alert.alert('Product', 'Enterprise Plus selected'),
                  cardProps: { colorScheme: 'success' }
                },
                {
                  id: 'hero3',
                  title: 'Developer Kit',
                  subtitle: 'For Developers',
                  description: 'Complete toolkit for developers and technical teams',
                  icon: 'code-slash-outline',
                  badge: 'New',
                  price: '$199',
                  rating: 4.7,
                  tags: ['Developer', 'API', 'Tools'],
                  onPress: () => Alert.alert('Product', 'Developer Kit selected'),
                  cardProps: { colorScheme: 'warning' }
                },
              ]}
              autoScroll
              autoScrollInterval={4000}
            />
          </View>

          {/* Gallery Variant */}
          <View style={{ marginBottom: theme.sizes.xl }}>
            <Text variant="body" style={{ fontWeight: '600', marginBottom: theme.sizes.md }}>
              Gallery Variant
            </Text>
            <HorizontalCardScroll
              variant="gallery"
              title="Popular Items"
              contentPadding={0}
              data={[
                {
                  id: 'gallery1',
                  title: 'Design System',
                  subtitle: 'UI Components',
                  description: 'Complete design system with 100+ components',
                  icon: 'color-palette-outline',
                  badge: 'Popular',
                  rating: 4.6,
                  onPress: () => Alert.alert('Item', 'Design System selected'),
                  cardProps: { variant: 'elevated' }
                },
                {
                  id: 'gallery2',
                  title: 'Analytics Pro',
                  subtitle: 'Data Insights',
                  description: 'Advanced analytics and reporting dashboard',
                  icon: 'analytics-outline',
                  rating: 4.5,
                  tags: ['Analytics', 'Pro'],
                  onPress: () => Alert.alert('Item', 'Analytics Pro selected'),
                  cardProps: { variant: 'elevated', colorScheme: 'primary' }
                },
                {
                  id: 'gallery3',
                  title: 'Security Suite',
                  subtitle: 'Protection',
                  description: 'Comprehensive security solution for your apps',
                  icon: 'shield-checkmark-outline',
                  badge: 'Secure',
                  rating: 4.9,
                  tags: ['Security', 'Enterprise'],
                  onPress: () => Alert.alert('Item', 'Security Suite selected'),
                  cardProps: { variant: 'elevated', colorScheme: 'success' }
                },
                {
                  id: 'gallery4',
                  title: 'Cloud Storage',
                  subtitle: 'File Management',
                  description: 'Unlimited cloud storage with sync capabilities',
                  icon: 'cloud-outline',
                  rating: 4.4,
                  tags: ['Cloud', 'Storage'],
                  onPress: () => Alert.alert('Item', 'Cloud Storage selected'),
                  cardProps: { variant: 'elevated', colorScheme: 'secondary' }
                },
              ]}
              size="large"
            />
          </View>

          {/* Compact Variant */}
          <View style={{ marginBottom: theme.sizes.xl }}>
            <Text variant="body" style={{ fontWeight: '600', marginBottom: theme.sizes.md }}>
              Compact Variant
            </Text>
            <HorizontalCardScroll
              variant="compact"
              title="Quick Stats"
              contentPadding={0}
              data={[
                {
                  id: 'stat1',
                  title: '2.5K',
                  subtitle: 'Users',
                  icon: 'people-outline',
                  cardProps: { size: 'small', colorScheme: 'primary' }
                },
                {
                  id: 'stat2',
                  title: '98.9%',
                  subtitle: 'Uptime',
                  icon: 'checkmark-circle-outline',
                  cardProps: { size: 'small', colorScheme: 'success' }
                },
                {
                  id: 'stat3',
                  title: '24/7',
                  subtitle: 'Support',
                  icon: 'headset-outline',
                  cardProps: { size: 'small', colorScheme: 'warning' }
                },
                {
                  id: 'stat4',
                  title: '50+',
                  subtitle: 'Features',
                  icon: 'star-outline',
                  cardProps: { size: 'small', colorScheme: 'secondary' }
                },
                {
                  id: 'stat5',
                  title: '15M+',
                  subtitle: 'Downloads',
                  icon: 'download-outline',
                  cardProps: { size: 'small', colorScheme: 'primary' }
                },
                {
                  id: 'stat6',
                  title: '4.8★',
                  subtitle: 'Rating',
                  icon: 'trophy-outline',
                  cardProps: { size: 'small', colorScheme: 'warning' }
                },
              ]}
              cardWidth={85}
              spacing={6}
              snapToCards={false}
              size="small"
            />
          </View>

          {/* Loading State Example */}
          <View style={{ marginBottom: theme.sizes.xl }}>
            <Text variant="body" style={{ fontWeight: '600', marginBottom: theme.sizes.md }}>
              Loading State
            </Text>
            <HorizontalCardScroll
              title="Loading Content"
              loading={true}
              data={[]}
            />
          </View>

          {/* Error State Example */}
          <View style={{ marginBottom: theme.sizes.xl }}>
            <Text variant="body" style={{ fontWeight: '600', marginBottom: theme.sizes.md }}>
              Error State
            </Text>
            <HorizontalCardScroll
              title="Failed to Load"
              error="Unable to fetch data. Please check your connection."
              data={[]}
              onRefresh={() => Alert.alert('Refresh', 'Refreshing data...')}
            />
          </View>

          {/* Empty State Example */}
          <View style={{ marginBottom: theme.sizes.xl }}>
            <Text variant="body" style={{ fontWeight: '600', marginBottom: theme.sizes.md }}>
              Empty State
            </Text>
            <HorizontalCardScroll
              title="No Items Found"
              emptyMessage="No products match your criteria"
              data={[]}
            />
          </View>
        </Card>

        {/* Modal Examples */}
        <Card
          style={{ marginBottom: theme.sizes.lg }}
          onLayout={(event) => onSectionLayout('modals', event)}
        >
          <Text variant="subtitle" style={{ marginBottom: theme.sizes.md }}>
            Modal Components
          </Text>
          <Text variant="caption" style={{ color: theme.colors.textSecondary, marginBottom: theme.sizes.lg }}>
            Flexible modal dialogs with various sizes, positions, and behaviors
          </Text>

          <View style={{ gap: theme.sizes.md }}>
            {/* Basic Modal */}
            <View>
              <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Basic Modal:</Text>
              <Button
                title="Show Basic Modal"
                variant="outline"
                onPress={() => setShowBasicModal(true)}
                leftIcon="layers-outline"
              />
            </View>

            {/* Confirmation Modal */}
            <View>
              <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Confirmation Modal:</Text>
              <Button
                title="Show Confirmation"
                variant="outline"
                onPress={() => setShowConfirmModal(true)}
                leftIcon="help-circle-outline"
              />
            </View>

            {/* Form Modal */}
            <View>
              <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Form Modal:</Text>
              <Button
                title="Show Form Modal"
                variant="outline"
                onPress={() => setShowFormModal(true)}
                leftIcon="create-outline"
              />
            </View>

            {/* Scrollable Modal */}
            <View>
              <Text variant="label" style={{ marginBottom: theme.sizes.sm }}>Scrollable Modal:</Text>
              <Button
                title="Show Scrollable Content"
                variant="outline"
                onPress={() => setShowScrollableModal(true)}
                leftIcon="document-text-outline"
              />
            </View>
          </View>
        </Card>

      </ScrollView>

      {/* Floating Quick Navigation Button */}
      {!showQuickNav && (
        <TouchableOpacity
          onPress={() => setShowQuickNav(true)}
          style={{
            position: 'absolute',
            bottom: floatingButtonBottom,
            right: 20,
            width: NAVIGATION_CONSTANTS.FLOATING_BUTTON_SIZE,
            height: NAVIGATION_CONSTANTS.FLOATING_BUTTON_SIZE,
            borderRadius: NAVIGATION_CONSTANTS.FLOATING_BUTTON_SIZE / 2,
            backgroundColor: theme.colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: theme.colors.text,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 12,
            zIndex: 999,
          }}
          activeOpacity={0.8}
        >
          <Icon name="apps-outline" size={24} color="white" />
        </TouchableOpacity>
      )}

      {/* Modal Examples */}
      {/* Basic Modal */}
      <Modal
        visible={showBasicModal}
        onClose={() => setShowBasicModal(false)}
        title="Basic Modal"
        subtitle="This is a simple modal dialog"
        size="medium"
        position="center"
        showHeader={true}
        showCloseButton={true}
        actions={[
          {
            title: 'Cancel',
            onPress: () => setShowBasicModal(false),
            variant: 'outline'
          },
          {
            title: 'OK',
            onPress: () => {
              Alert.alert('Success', 'Basic modal action completed!');
              setShowBasicModal(false);
            },
            variant: 'primary'
          }
        ]}
      >
        <Text variant="body" style={{ marginBottom: theme.sizes.md }}>
          This is the content of a basic modal. It can contain any React components and will adjust its height automatically.
        </Text>
        <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
          You can customize the appearance, behavior, and actions of the modal.
        </Text>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Action"
        subtitle="Are you sure you want to continue?"
        size="small"
        position="center"
        variant="confirmation"
        headerIcon="help-circle-outline"
        actions={[
          {
            title: 'Cancel',
            onPress: () => setShowConfirmModal(false),
            variant: 'ghost'
          },
          {
            title: 'Confirm',
            onPress: () => {
              Alert.alert('Confirmed', 'Action has been confirmed!');
              setShowConfirmModal(false);
            },
            variant: 'primary'
          }
        ]}
      >
        <Text variant="body">
          This action cannot be undone. Please make sure you want to proceed with this operation.
        </Text>
      </Modal>

      {/* Form Modal */}
      <Modal
        visible={showFormModal}
        onClose={() => setShowFormModal(false)}
        title="User Information"
        subtitle="Please fill out the form below"
        size="medium"
        position="center"
        variant="form"
        headerIcon="create-outline"
        scrollable={true}
        actions={[
          {
            title: 'Cancel',
            onPress: () => setShowFormModal(false),
            variant: 'outline'
          },
          {
            title: 'Save',
            onPress: () => {
              Alert.alert('Saved', 'Form data has been saved!');
              setShowFormModal(false);
            },
            variant: 'primary',
            icon: 'save-outline'
          }
        ]}
      >
        <View style={{ gap: theme.sizes.md }}>
          <TextInput
            label="Full Name"
            placeholder="Enter your full name"
            leftIcon="person-outline"
          />
          <TextInput
            label="Email"
            placeholder="Enter your email address"
            leftIcon="mail-outline"
            keyboardType="email-address"
          />
          <TextInput
            label="Phone Number"
            placeholder="Enter your phone number"
            leftIcon="call-outline"
            keyboardType="phone-pad"
          />
          <View style={{ gap: theme.sizes.xs }}>
            <Text variant="label">Preferences:</Text>
            <Checkbox
              label="Receive email notifications"
              checked={switchValue}
              onPress={() => setSwitchValue(!switchValue)}
            />
            <Checkbox
              label="Enable dark mode"
              checked={theme.isDark}
              onPress={toggleTheme}
            />
          </View>
        </View>
      </Modal>

      {/* Scrollable Modal */}
      <Modal
        visible={showScrollableModal}
        onClose={() => setShowScrollableModal(false)}
        title="Terms and Conditions"
        subtitle="Please read our terms carefully"
        size="large"
        position="center"
        headerIcon="document-text-outline"
        scrollable={true}
        actions={[
          {
            title: 'Decline',
            onPress: () => setShowScrollableModal(false),
            variant: 'outline'
          },
          {
            title: 'Accept',
            onPress: () => {
              Alert.alert('Accepted', 'Terms and conditions accepted!');
              setShowScrollableModal(false);
            },
            variant: 'primary'
          }
        ]}
      >
        <View style={{ gap: theme.sizes.md }}>
          <Text variant="body" style={{ fontWeight: '600' }}>
            1. Introduction
          </Text>
          <Text variant="body">
            Welcome to our application. These terms and conditions outline the rules and regulations for the use of our service.
          </Text>

          <Text variant="body" style={{ fontWeight: '600' }}>
            2. Acceptance of Terms
          </Text>
          <Text variant="body">
            By accessing and using this application, you accept and agree to be bound by the terms and provision of this agreement.
          </Text>

          <Text variant="body" style={{ fontWeight: '600' }}>
            3. User Responsibilities
          </Text>
          <Text variant="body">
            Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.
          </Text>

          <Text variant="body" style={{ fontWeight: '600' }}>
            4. Privacy Policy
          </Text>
          <Text variant="body">
            We are committed to protecting your privacy. Our Privacy Policy explains how we collect, use, and protect your information when you use our service.
          </Text>

          <Text variant="body" style={{ fontWeight: '600' }}>
            5. Service Availability
          </Text>
          <Text variant="body">
            We strive to keep our service available 24/7, but we do not guarantee uninterrupted access. We may need to perform maintenance or updates that temporarily affect service availability.
          </Text>

          <Text variant="body" style={{ fontWeight: '600' }}>
            6. Limitation of Liability
          </Text>
          <Text variant="body">
            In no event shall we be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
          </Text>

          <Text variant="body" style={{ fontWeight: '600' }}>
            7. Changes to Terms
          </Text>
          <Text variant="body">
            We reserve the right to modify these terms at any time. We will notify users of any changes by posting the new terms on this page.
          </Text>

          <Text variant="body" style={{ fontWeight: '600' }}>
            8. Contact Information
          </Text>
          <Text variant="body">
            If you have any questions about these terms and conditions, please contact us at support@example.com.
          </Text>
        </View>
      </Modal>
    </Container>
  );
}