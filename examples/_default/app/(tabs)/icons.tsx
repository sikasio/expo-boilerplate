import React, { useState, useMemo, useRef } from 'react';
import { ScrollView, View, TouchableOpacity, Alert, Clipboard } from 'react-native';

import { Container } from '@sikasio/expo-boilerplate/components/layout';
import { Text } from '@sikasio/expo-boilerplate/components/ui';
import { Card } from '@sikasio/expo-boilerplate/components/ui';
import { Button } from '@sikasio/expo-boilerplate/components/ui';
import { ThemeStatusBar } from '@sikasio/expo-boilerplate/components/ui';
import { TextInput } from '@sikasio/expo-boilerplate/components/forms';
import { EnhancedIcon, IconFamily, getIconsForFamily, getIconFamilyInfo, getAvailableIconFamilies } from '@sikasio/expo-boilerplate/components/ui';
import { Header } from '@sikasio/expo-boilerplate/components/navigation';
import { useTheme } from '@sikasio/expo-boilerplate/contexts';
import { getCurrentTabBarDesign, getFloatingButtonBottom, getScrollViewContentInset, NAVIGATION_CONSTANTS } from '@sikasio/expo-boilerplate/config';

const ICONS_PER_PAGE = 100;
const POPULAR_ICONS: { [key in IconFamily]?: string[] } = {
  Ionicons: ['home', 'heart', 'star', 'search', 'settings', 'person', 'mail', 'call', 'camera', 'location', 'notifications', 'bookmark', 'share', 'download', 'cloud-upload', 'trash', 'create', 'add', 'remove', 'checkmark', 'close', 'menu', 'arrow-forward', 'arrow-back', 'refresh'],
  MaterialIcons: ['home', 'favorite', 'star', 'search', 'settings', 'person', 'email', 'phone', 'camera', 'place', 'notifications', 'bookmark', 'share', 'download', 'upload', 'delete', 'edit', 'add', 'remove', 'check', 'close', 'menu', 'arrow_forward', 'arrow_back', 'refresh'],
  MaterialCommunityIcons: ['home', 'heart', 'star', 'magnify', 'cog', 'account', 'email', 'phone', 'camera', 'map-marker', 'bell', 'bookmark', 'share', 'download', 'upload', 'delete', 'pencil', 'plus', 'minus', 'check', 'close', 'menu', 'arrow-right', 'arrow-left', 'refresh'],
  FontAwesome: ['home', 'heart', 'star', 'search', 'cog', 'user', 'envelope', 'phone', 'camera', 'map-marker', 'bell', 'bookmark', 'share', 'download', 'upload', 'trash', 'edit', 'plus', 'minus', 'check', 'times', 'bars', 'arrow-right', 'arrow-left', 'refresh'],
  FontAwesome5: ['home', 'heart', 'star', 'search', 'cog', 'user', 'envelope', 'phone', 'camera', 'map-marker-alt', 'bell', 'bookmark', 'share', 'download', 'upload', 'trash', 'edit', 'plus', 'minus', 'check', 'times', 'bars', 'arrow-right', 'arrow-left', 'sync'],
  FontAwesome6: ['house', 'heart', 'star', 'magnifying-glass', 'gear', 'user', 'envelope', 'phone', 'camera', 'location-dot', 'bell', 'bookmark', 'share', 'download', 'upload', 'trash', 'pen', 'plus', 'minus', 'check', 'xmark', 'bars', 'arrow-right', 'arrow-left', 'rotate'],
  AntDesign: ['home', 'heart', 'star', 'search1', 'setting', 'user', 'mail', 'phone', 'camera', 'enviromento', 'notification', 'book', 'sharealt', 'download', 'upload', 'delete', 'edit', 'plus', 'minus', 'check', 'close', 'menu', 'right', 'left', 'reload1'],
  Feather: ['home', 'heart', 'star', 'search', 'settings', 'user', 'mail', 'phone', 'camera', 'map-pin', 'bell', 'bookmark', 'share', 'download', 'upload', 'trash', 'edit', 'plus', 'minus', 'check', 'x', 'menu', 'arrow-right', 'arrow-left', 'refresh-cw'],
  Entypo: ['home', 'heart', 'star', 'magnifying-glass', 'cog', 'user', 'mail', 'phone', 'camera', 'location-pin', 'bell', 'bookmark', 'share', 'download', 'upload', 'trash', 'edit', 'plus', 'minus', 'check', 'cross', 'menu', 'chevron-right', 'chevron-left', 'cycle'],
  EvilIcons: ['sc-facebook', 'sc-twitter', 'sc-instagram', 'sc-linkedin', 'sc-youtube', 'sc-github', 'ei-user', 'ei-envelope', 'ei-phone', 'ei-camera', 'ei-location', 'ei-bell', 'ei-bookmark', 'ei-share-apple', 'ei-search', 'ei-gear', 'ei-heart', 'ei-star', 'ei-plus', 'ei-minus'],
  Foundation: ['home', 'heart', 'star', 'magnifying-glass', 'widget', 'torso', 'mail', 'telephone', 'camera', 'marker', 'alert', 'bookmark', 'share', 'download', 'upload', 'trash', 'pencil', 'plus', 'minus', 'check', 'x', 'list', 'arrow-right', 'arrow-left', 'refresh'],
  Octicons: ['home', 'heart', 'star', 'search', 'gear', 'person', 'mail', 'device-mobile', 'device-camera', 'location', 'bell', 'bookmark', 'share', 'download', 'upload', 'trash', 'pencil', 'plus', 'dash', 'check', 'x', 'three-bars', 'arrow-right', 'arrow-left', 'sync'],
  SimpleLineIcons: ['home', 'heart', 'star', 'magnifier', 'settings', 'user', 'envelope', 'phone', 'camera', 'location-pin', 'bell', 'book-open', 'share', 'cloud-download', 'cloud-upload', 'trash', 'pencil', 'plus', 'minus', 'check', 'close', 'menu', 'arrow-right', 'arrow-left', 'refresh'],
  Zocial: ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'github', 'google', 'apple', 'microsoft', 'amazon', 'dropbox', 'skype', 'wordpress', 'yahoo', 'android', 'chrome', 'firefox', 'opera', 'safari', 'bitcoin'],
};

export default function IconsScreen() {
  const { theme, toggleTheme } = useTheme();
  const availableFamilies = getAvailableIconFamilies();
  const [selectedFamily, setSelectedFamily] = useState<IconFamily>(availableFamilies[0] || 'Ionicons');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPopularOnly, setShowPopularOnly] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // ScrollView ref for programmatic scrolling
  const scrollViewRef = useRef<ScrollView>(null);

  const iconFamilyInfo = getIconFamilyInfo();
  const currentTabBarDesign = getCurrentTabBarDesign();
  const floatingButtonBottom = getFloatingButtonBottom(currentTabBarDesign, 0, 0);
  const contentInset = getScrollViewContentInset(currentTabBarDesign, 0);

  // Get filtered icons based on search and family
  const filteredIcons = useMemo(() => {
    let icons: string[] = [];
    
    if (showPopularOnly && POPULAR_ICONS[selectedFamily]) {
      icons = POPULAR_ICONS[selectedFamily]!;
    } else {
      icons = getIconsForFamily(selectedFamily);
    }

    if (searchQuery.trim()) {
      icons = icons.filter(icon => 
        icon.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return icons;
  }, [selectedFamily, searchQuery, showPopularOnly]);

  // Paginate icons
  const paginatedIcons = useMemo(() => {
    const startIndex = (currentPage - 1) * ICONS_PER_PAGE;
    const endIndex = startIndex + ICONS_PER_PAGE;
    return filteredIcons.slice(startIndex, endIndex);
  }, [filteredIcons, currentPage]);

  const totalPages = Math.ceil(filteredIcons.length / ICONS_PER_PAGE);

  const handleIconPress = (iconName: string) => {
    const codeExample = `<EnhancedIcon family="${selectedFamily}" name="${iconName}" size={24} />`;
    Clipboard.setString(codeExample);
    Alert.alert(
      'Icon Code Copied!',
      `${iconName} from ${selectedFamily}\n\nCode copied to clipboard:\n${codeExample}`,
      [{ text: 'OK' }]
    );
  };

  const handleFamilyChange = (family: IconFamily) => {
    setSelectedFamily(family);
    setCurrentPage(1);
    setSearchQuery('');
  };

  const iconFamilies = availableFamilies;

  // Safety check - if no icon families are available
  if (availableFamilies.length === 0) {
    return (
      <Container>
        <ThemeStatusBar />
        <Header
          title="Icon Library"
          subtitle="No Icons Available"
          showBackButton={true}
          backButtonProps={{
            variant: 'icon-only',
            size: 'medium'
          }}
        />
        <ScrollView 
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{
            paddingBottom: contentInset.bottom + theme.sizes.lg,
          }}
        >
          <Card>
            <View style={{ alignItems: 'center', paddingVertical: theme.sizes.xl }}>
              <EnhancedIcon 
                family="Ionicons" 
                name="warning-outline" 
                size={48} 
                color={theme.colors.warning} 
              />
              <Text variant="title" style={{ fontWeight: 'bold', marginBottom: theme.sizes.sm, marginTop: theme.sizes.sm }}>
                No Icon Families Available
              </Text>
              <Text variant="body" style={{ 
                textAlign: 'center', 
                color: theme.colors.textSecondary,
                marginBottom: theme.sizes.md,
              }}>
                It seems like @expo/vector-icons is not properly installed or loaded.
                Please check your Expo installation.
              </Text>
            </View>
          </Card>
        </ScrollView>
      </Container>
    );
  }

  return (
    <Container>
      <ThemeStatusBar />
      <Header
        title="Icon Library"
        subtitle={`Browse ${filteredIcons.length} icons from ${iconFamilyInfo[selectedFamily]?.name || selectedFamily}`}
        showBackButton={true}
        backButtonProps={{
          variant: 'icon-only',
          size: 'medium'
        }}
      />


      <ScrollView 
        ref={scrollViewRef}
        style={{ flex: 1 }}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          paddingBottom: contentInset.bottom + theme.sizes.lg,
        }}
      >
        {/* Icon Collections Overview */}
        <Card style={{ marginBottom: theme.sizes.md }}>
          <Text variant="subtitle" style={{ marginBottom: theme.sizes.md, fontWeight: '600' }}>
            Icon Collections
          </Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: theme.sizes.sm }}>
              {iconFamilies.map((family) => {
                const info = iconFamilyInfo[family];
                const isSelected = selectedFamily === family;
                
                return (
                  <TouchableOpacity
                    key={family}
                    onPress={() => {
                      setSelectedFamily(family);
                      setCurrentPage(1);
                      setSearchQuery('');
                    }}
                    style={{
                      width: 140,
                      padding: theme.sizes.sm,
                      borderRadius: theme.borderRadius.md,
                      backgroundColor: isSelected ? theme.colors.primary + '20' : theme.colors.background,
                      borderWidth: 1,
                      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.sizes.xs }}>
                      <EnhancedIcon 
                        family={family} 
                        name={POPULAR_ICONS[family]?.[0] || 'home'} 
                        size={20} 
                        color={isSelected ? theme.colors.primary : theme.colors.text}
                      />
                      <View style={{ 
                        marginLeft: theme.sizes.xs,
                        backgroundColor: isSelected ? theme.colors.primary : theme.colors.textSecondary,
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: theme.borderRadius.xs,
                      }}>
                        <Text style={{
                          color: '#FFFFFF',
                          fontSize: 10,
                          fontWeight: '600',
                        }}>
                          {info?.count || 0}
                        </Text>
                      </View>
                    </View>
                    
                    <Text 
                      variant="caption" 
                      style={{
                        fontWeight: isSelected ? '600' : '500',
                        color: isSelected ? theme.colors.primary : theme.colors.text,
                        marginBottom: 2,
                      }}
                      numberOfLines={1}
                    >
                      {info?.name || family}
                    </Text>
                    
                    <Text 
                      variant="caption" 
                      style={{
                        color: theme.colors.textSecondary,
                        fontSize: 10,
                        lineHeight: 12,
                      }}
                      numberOfLines={2}
                    >
                      {info?.description?.substring(0, 50) + (info?.description && info.description.length > 50 ? '...' : '') || 'Icon collection'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
          
          <View style={{ 
            marginTop: theme.sizes.md, 
            paddingTop: theme.sizes.sm,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <View>
              <Text variant="body" style={{ fontWeight: '600' }}>
                {iconFamilyInfo[selectedFamily]?.name || selectedFamily}
              </Text>
              <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
                {iconFamilyInfo[selectedFamily]?.count || 0} icons • {filteredIcons.length} showing
              </Text>
            </View>
            <Button
              title="Visit"
              variant="ghost"
              size="small"
              rightIcon="open-outline"
              onPress={() => Alert.alert(
                'Icon Library Website',
                `${iconFamilyInfo[selectedFamily]?.name || selectedFamily}\n\n${iconFamilyInfo[selectedFamily]?.description || 'Icon library'}\n\nWebsite: ${iconFamilyInfo[selectedFamily]?.website || 'N/A'}`
              )}
            />
          </View>
        </Card>

        {/* Theme & Filter Controls */}
        <Card style={{ marginBottom: theme.sizes.md }}>
          <Text variant="subtitle" style={{ marginBottom: theme.sizes.md, fontWeight: '600' }}>
            Display Options
          </Text>
          
          <View style={{ gap: theme.sizes.md }}>
            {/* Theme Toggle */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text variant="body" style={{ fontWeight: '500', marginBottom: 2 }}>
                  Theme Mode
                </Text>
                <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
                  {theme.isDark ? 'Dark theme active' : 'Light theme active'}
                </Text>
              </View>
              <Button
                variant={theme.isDark ? "primary" : "outline"}
                size="small"
                leftIcon={theme.isDark ? "moon" : "sunny-outline"}
                title={theme.isDark ? "Dark" : "Light"}
                onPress={toggleTheme}
              />
            </View>

            {/* Popular/All Toggle */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text variant="body" style={{ fontWeight: '500', marginBottom: 2 }}>
                  Icon Selection
                </Text>
                <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
                  {showPopularOnly ? 'Showing popular icons only' : 'Showing all available icons'}
                </Text>
              </View>
              <Button
                variant={showPopularOnly ? "primary" : "outline"}
                size="small"
                leftIcon={showPopularOnly ? "star" : "star-outline"}
                title={showPopularOnly ? "Popular" : "All"}
                onPress={() => {
                  setShowPopularOnly(!showPopularOnly);
                  setCurrentPage(1);
                }}
              />
            </View>

            {/* Quick Actions */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text variant="body" style={{ fontWeight: '500', marginBottom: 2 }}>
                  Quick Actions
                </Text>
                <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
                  {searchQuery ? `Found ${filteredIcons.length} results` : 'Search or clear filters'}
                </Text>
              </View>
              <Button
                variant="outline"
                size="small"
                leftIcon="refresh-outline"
                title="Clear All"
                onPress={() => {
                  setSearchQuery('');
                  setShowPopularOnly(true);
                  setCurrentPage(1);
                }}
              />
            </View>
          </View>
        </Card>

        {/* Icons Grid */}
        <Card>
          {/* Search Input - Always Visible */}
          <View style={{ marginBottom: theme.sizes.md }}>
            <TextInput
              label="Search Icons"
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                setCurrentPage(1);
              }}
              placeholder={`Search in ${iconFamilyInfo[selectedFamily]?.name || selectedFamily}...`}
              leftIcon="search-outline"
              rightIcon={searchQuery ? "close-outline" : undefined}
              onRightIconPress={searchQuery ? () => {
                setSearchQuery('');
                setCurrentPage(1);
              } : undefined}
            />
          </View>

          {/* Header with counts */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.sizes.md }}>
            <Text variant="subtitle" style={{ fontWeight: '600' }}>
              {showPopularOnly ? 'Popular Icons' : 'All Icons'}
            </Text>
            <View style={{ alignItems: 'flex-end' }}>
              <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
                {searchQuery ? `${filteredIcons.length} found` : `${filteredIcons.length} showing`}
              </Text>
              {searchQuery && (
                <Text variant="caption" style={{ color: theme.colors.primary, fontSize: 10 }}>
                  "{searchQuery}"
                </Text>
              )}
            </View>
          </View>

            {filteredIcons.length === 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: theme.sizes.xl }}>
                <EnhancedIcon 
                  family="Ionicons" 
                  name="search-outline" 
                  size={48} 
                  color={theme.colors.textSecondary} 
                />
                <Text variant="body" style={{ 
                  color: theme.colors.textSecondary, 
                  marginTop: theme.sizes.sm,
                  textAlign: 'center',
                }}>
                  No icons found matching "{searchQuery}"
                </Text>
                <Button
                  title="Clear Search"
                  variant="ghost"
                  size="small"
                  onPress={() => setSearchQuery('')}
                  style={{ marginTop: theme.sizes.sm }}
                />
              </View>
            ) : (
              <>
                {/* Icons Grid */}
                <View style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  gap: theme.sizes.xs,
                }}>
                  {paginatedIcons.map((iconName, index) => (
                    <TouchableOpacity
                      key={`${selectedFamily}-${iconName}-${index}`}
                      onPress={() => handleIconPress(iconName)}
                      style={{
                        width: '15%', // 6 columns with gaps for more icons
                        aspectRatio: 1,
                        backgroundColor: theme.colors.background,
                        borderRadius: theme.borderRadius.md,
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: theme.sizes.xs,
                      }}
                      activeOpacity={0.7}
                    >
                      <EnhancedIcon
                        family={selectedFamily}
                        name={iconName}
                        size={18}
                        color={theme.colors.text}
                      />
                      <Text
                        variant="caption"
                        style={{
                          fontSize: 7,
                          color: theme.colors.textSecondary,
                          marginTop: 2,
                          textAlign: 'center',
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {iconName.length > 6 ? `${iconName.substring(0, 6)}...` : iconName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Pagination */}
                {totalPages > 1 && (
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: theme.sizes.lg,
                    paddingTop: theme.sizes.md,
                    borderTopWidth: 1,
                    borderTopColor: theme.colors.border,
                  }}>
                    <Button
                      title="Previous"
                      variant="outline"
                      size="small"
                      leftIcon="chevron-back-outline"
                      disabled={currentPage === 1}
                      onPress={() => setCurrentPage(currentPage - 1)}
                    />
                    
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.sizes.xs }}>
                      <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
                        Page {currentPage} of {totalPages}
                      </Text>
                    </View>

                    <Button
                      title="Next"
                      variant="outline"
                      size="small"
                      rightIcon="chevron-forward-outline"
                      disabled={currentPage === totalPages}
                      onPress={() => setCurrentPage(currentPage + 1)}
                    />
                  </View>
                )}
              </>
            )}
          </Card>

          {/* Platform Overview */}
        <Card style={{ marginTop: theme.sizes.md }}>
          <Text variant="subtitle" style={{ marginBottom: theme.sizes.md, fontWeight: '600' }}>
            Platform Icon Collections
          </Text>
          
          <View style={{ gap: theme.sizes.md }}>
            {/* Google Material Design */}
            <View>
              <Text variant="body" style={{ fontWeight: '600', marginBottom: theme.sizes.xs }}>
                Google Material Design
              </Text>
              <View style={{ flexDirection: 'row', gap: theme.sizes.xs, marginBottom: theme.sizes.xs }}>
                {iconFamilies.filter(f => f.includes('Material')).map((family) => (
                  <TouchableOpacity
                    key={family}
                    onPress={() => {
                      setSelectedFamily(family);
                      setCurrentPage(1);
                      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
                    }}
                    style={{
                      paddingHorizontal: theme.sizes.sm,
                      paddingVertical: theme.sizes.xs,
                      backgroundColor: selectedFamily === family ? theme.colors.primary : theme.colors.background,
                      borderRadius: theme.borderRadius.sm,
                      borderWidth: 1,
                      borderColor: selectedFamily === family ? theme.colors.primary : theme.colors.border,
                    }}
                  >
                    <Text style={{
                      fontSize: 11,
                      color: selectedFamily === family ? '#FFFFFF' : theme.colors.text,
                      fontWeight: '500',
                    }}>
                      {family.replace('Material', 'M.')} ({iconFamilyInfo[family]?.count || 0})
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* FontAwesome */}
            <View>
              <Text variant="body" style={{ fontWeight: '600', marginBottom: theme.sizes.xs }}>
                FontAwesome
              </Text>
              <View style={{ flexDirection: 'row', gap: theme.sizes.xs, marginBottom: theme.sizes.xs }}>
                {iconFamilies.filter(f => f.includes('FontAwesome')).map((family) => (
                  <TouchableOpacity
                    key={family}
                    onPress={() => {
                      setSelectedFamily(family);
                      setCurrentPage(1);
                      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
                    }}
                    style={{
                      paddingHorizontal: theme.sizes.sm,
                      paddingVertical: theme.sizes.xs,
                      backgroundColor: selectedFamily === family ? theme.colors.primary : theme.colors.background,
                      borderRadius: theme.borderRadius.sm,
                      borderWidth: 1,
                      borderColor: selectedFamily === family ? theme.colors.primary : theme.colors.border,
                    }}
                  >
                    <Text style={{
                      fontSize: 11,
                      color: selectedFamily === family ? '#FFFFFF' : theme.colors.text,
                      fontWeight: '500',
                    }}>
                      {family.replace('FontAwesome', 'FA ')} ({iconFamilyInfo[family]?.count || 0})
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Other Popular Collections */}
            <View>
              <Text variant="body" style={{ fontWeight: '600', marginBottom: theme.sizes.xs }}>
                Other Collections
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.sizes.xs }}>
                {iconFamilies.filter(f => !f.includes('Material') && !f.includes('FontAwesome')).map((family) => (
                  <TouchableOpacity
                    key={family}
                    onPress={() => {
                      setSelectedFamily(family);
                      setCurrentPage(1);
                      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
                    }}
                    style={{
                      paddingHorizontal: theme.sizes.sm,
                      paddingVertical: theme.sizes.xs,
                      backgroundColor: selectedFamily === family ? theme.colors.primary : theme.colors.background,
                      borderRadius: theme.borderRadius.sm,
                      borderWidth: 1,
                      borderColor: selectedFamily === family ? theme.colors.primary : theme.colors.border,
                    }}
                  >
                    <Text style={{
                      fontSize: 11,
                      color: selectedFamily === family ? '#FFFFFF' : theme.colors.text,
                      fontWeight: '500',
                    }}>
                      {family} ({iconFamilyInfo[family]?.count || 0})
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Card>

      </ScrollView>

      {/* Floating Scroll to Top Button */}
      {currentPage > 1 && (
        <TouchableOpacity
          onPress={() => {
            scrollViewRef.current?.scrollTo({ y: 0, animated: true });
            setCurrentPage(1);
          }}
          style={{
            position: 'absolute',
            bottom: floatingButtonBottom,
            right: theme.sizes.md,
            width: NAVIGATION_CONSTANTS.FLOATING_BUTTON_SIZE,
            height: NAVIGATION_CONSTANTS.FLOATING_BUTTON_SIZE,
            borderRadius: NAVIGATION_CONSTANTS.FLOATING_BUTTON_SIZE / 2,
            backgroundColor: theme.colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: theme.colors.text,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
          activeOpacity={0.8}
        >
          <EnhancedIcon family="Ionicons" name="arrow-up-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </Container>
  );
}