import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
  Animated,
  RefreshControl,
  StatusBar,
  Platform,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Icon, IconName } from '@/components/ui/Icon';
import { List, ListItem, ListSection, ListDivider } from '@/components/ui/List';
import { ButtonGroup } from '@/components/ui/ButtonGroup';
import { AppConfig, LanguageOptions } from '@/config/app';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SettingsScreenLayout = 'default' | 'grouped' | 'minimal' | 'detailed';
export type SettingsScreenTheme = 'auto' | 'light' | 'dark' | 'gradient';

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: IconName;
  value?: string | boolean | number;
  type: 'navigation' | 'toggle' | 'info' | 'action' | 'picker' | 'slider';
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  onValueChange?: (value: any) => void;
  color?: string;
  rightIcon?: IconName;
  badge?: string;
  disabled?: boolean;
  destructive?: boolean;
  options?: { label: string; value: any }[];
  min?: number;
  max?: number;
  step?: number;
}

interface SettingSection {
  id: string;
  title: string;
  subtitle?: string;
  icon?: IconName;
  items: SettingItem[];
}

interface UserInfo {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isPremium?: boolean;
  memberSince?: Date;
}

export interface SettingsScreenProps {
  layout?: SettingsScreenLayout;
  theme?: SettingsScreenTheme;
  user?: UserInfo;
  showUserSection?: boolean;
  showQuickActions?: boolean;
  showSearchBar?: boolean;
  enableRefresh?: boolean;
  customSections?: SettingSection[];
  onUserPress?: () => void;
  onSearchPress?: () => void;
  onLogout?: () => void;
  onDeleteAccount?: () => void;
  style?: ViewStyle;
  testID?: string;
}

// Default user data for demo
const defaultUser: UserInfo = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  isPremium: true,
  memberSince: new Date('2023-01-15'),
};

export function SettingsScreen({
  layout = 'default',
  theme: settingsTheme = 'auto',
  user = defaultUser,
  showUserSection = true,
  showQuickActions = true,
  showSearchBar = false,
  enableRefresh = true,
  customSections,
  onUserPress,
  onSearchPress,
  onLogout,
  onDeleteAccount,
  style,
  testID = 'settings-screen',
}: SettingsScreenProps) {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const insets = useSafeAreaInsets();

  // State
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(theme.isDark);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [dataUsage, setDataUsage] = useState('wifi-only');
  const [language, setLanguage] = useState(AppConfig.defaults.language);
  const [fontSize, setFontSize] = useState(AppConfig.defaults.fontSize);

  // Animation
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // Storage utilities
  const saveLanguage = async (lang: string) => {
    try {
      await AsyncStorage.setItem(AppConfig.storage.language, lang);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const saveFontSize = async (size: number) => {
    try {
      await AsyncStorage.setItem(AppConfig.storage.fontSize, size.toString());
    } catch (error) {
      console.error('Error saving font size:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const [savedLanguage, savedFontSize] = await Promise.all([
        AsyncStorage.getItem(AppConfig.storage.language),
        AsyncStorage.getItem(AppConfig.storage.fontSize),
      ]);

      if (savedLanguage) {
        setLanguage(savedLanguage);
      }

      if (savedFontSize) {
        const parsedFontSize = parseInt(savedFontSize, 10);
        if (!isNaN(parsedFontSize)) {
          setFontSize(parsedFontSize);
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Handlers
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const handleUserPress = () => {
    onUserPress?.() || Alert.alert('User Settings', 'Navigate to user settings');
  };

  const handleSearchPress = () => {
    onSearchPress?.() || Alert.alert('Search Settings', 'Open settings search');
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: onLogout || logout,
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: onDeleteAccount || (() => Alert.alert('Account Deleted', 'Account deletion process started')),
        },
      ]
    );
  };

  const handleOpenURL = (url: string) => {
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
  };

  // Get theme colors
  const getThemeColors = () => {
    const baseColors = {
      background: theme.colors.background,
      surface: theme.colors.surface,
      text: theme.colors.text,
      textSecondary: theme.colors.textSecondary,
      primary: theme.colors.primary,
    };

    switch (settingsTheme) {
      case 'light':
        return {
          ...baseColors,
          background: '#FFFFFF',
          surface: '#F8F9FA',
          text: '#1A1A1A',
          textSecondary: '#6C757D',
        };
      case 'dark':
        return {
          ...baseColors,
          background: '#1A1A1A',
          surface: '#2D2D2D',
          text: '#FFFFFF',
          textSecondary: '#AAAAAA',
        };
      case 'gradient':
        return {
          ...baseColors,
          background: 'transparent',
          surface: 'rgba(255, 255, 255, 0.1)',
          text: '#FFFFFF',
          textSecondary: '#E0E0E0',
        };
      default:
        return baseColors;
    }
  };

  const colors = getThemeColors();

  // Default settings sections
  const defaultSections: SettingSection[] = [
    {
      id: 'account',
      title: 'Account',
      subtitle: 'Manage your account settings',
      icon: 'person-outline',
      items: [
        {
          id: 'privacy',
          title: 'Privacy & Security',
          subtitle: 'Control who can see your information',
          icon: 'shield-outline',
          type: 'navigation',
          rightIcon: 'chevron-forward-outline',
          onPress: () => Alert.alert('Privacy', 'Navigate to privacy settings'),
        },
        {
          id: 'subscription',
          title: 'Subscription',
          subtitle: user.isPremium ? 'Premium Member' : 'Free Plan',
          icon: 'card-outline',
          type: 'navigation',
          rightIcon: 'chevron-forward-outline',
          badge: user.isPremium ? 'Pro' : undefined,
          onPress: () => Alert.alert('Subscription', 'Manage subscription'),
        },
        {
          id: 'biometric',
          title: 'Biometric Authentication',
          subtitle: 'Use Face ID or Touch ID',
          icon: 'finger-print-outline',
          type: 'toggle',
          value: biometricEnabled,
          onToggle: setBiometricEnabled,
        },
      ],
    },
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Configure your notification preferences',
      icon: 'notifications-outline',
      items: [
        {
          id: 'all-notifications',
          title: 'All Notifications',
          subtitle: 'Enable or disable all notifications',
          icon: 'notifications-outline',
          type: 'toggle',
          value: notificationsEnabled,
          onToggle: setNotificationsEnabled,
        },
        {
          id: 'push',
          title: 'Push Notifications',
          subtitle: 'Receive push notifications',
          icon: 'phone-portrait-outline',
          type: 'toggle',
          value: pushNotifications,
          onToggle: setPushNotifications,
          disabled: !notificationsEnabled,
        },
        {
          id: 'email',
          title: 'Email Notifications',
          subtitle: 'Receive notifications via email',
          icon: 'mail-outline',
          type: 'toggle',
          value: emailNotifications,
          onToggle: setEmailNotifications,
          disabled: !notificationsEnabled,
        },
      ],
    },
    {
      id: 'appearance',
      title: 'Appearance',
      subtitle: 'Customize how the app looks',
      icon: 'color-palette-outline',
      items: [
        {
          id: 'dark-mode',
          title: 'Dark Mode',
          subtitle: 'Use dark theme',
          icon: 'moon-outline',
          type: 'toggle',
          value: darkModeEnabled,
          onToggle: (value) => {
            setDarkModeEnabled(value);
            if (value !== theme.isDark) {
              toggleTheme();
            }
          },
        },
        {
          id: 'language',
          title: 'Language',
          subtitle: 'Choose your language',
          icon: 'language-outline',
          type: 'picker',
          value: language,
          options: LanguageOptions,
          onPress: () => {
            Alert.alert(
              'Select Language',
              'Choose your preferred language',
              LanguageOptions.map(lang => ({
                text: lang.label,
                onPress: async () => {
                  setLanguage(lang.value);
                  await saveLanguage(lang.value);
                  Alert.alert('Language Changed', `Language changed to ${lang.label}`);
                }
              })).concat([{ text: 'Cancel', style: 'cancel' }])
            );
          },
        },
        {
          id: 'font-size',
          title: 'Font Size',
          subtitle: `${fontSize}px`,
          icon: 'text-outline',
          type: 'picker',
          value: fontSize,
          options: [
            { label: '12px', value: 12 },
            { label: '14px', value: 14 },
            { label: '16px (Default)', value: 16 },
            { label: '18px', value: 18 },
            { label: '20px', value: 20 },
            { label: '22px', value: 22 },
            { label: '24px', value: 24 },
          ],
          onPress: () => {
            const fontSizeOptions = [
              { label: '12px', value: 12 },
              { label: '14px', value: 14 },
              { label: '16px (Default)', value: 16 },
              { label: '18px', value: 18 },
              { label: '20px', value: 20 },
              { label: '22px', value: 22 },
              { label: '24px', value: 24 },
            ];

            Alert.alert(
              'Select Font Size',
              'Choose your preferred font size',
              fontSizeOptions.map(option => ({
                text: option.label,
                onPress: async () => {
                  setFontSize(option.value);
                  await saveFontSize(option.value);
                  Alert.alert('Font Size Changed', `Font size changed to ${option.label}`);
                }
              })).concat([{ text: 'Cancel', style: 'cancel' }])
            );
          },
        },
      ],
    },
    {
      id: 'data',
      title: 'Data & Storage',
      subtitle: 'Manage your data usage and storage',
      icon: 'server-outline',
      items: [
        {
          id: 'auto-backup',
          title: 'Auto Backup',
          subtitle: 'Automatically backup your data',
          icon: 'cloud-upload-outline',
          type: 'toggle',
          value: autoBackup,
          onToggle: setAutoBackup,
        },
        {
          id: 'offline-mode',
          title: 'Offline Mode',
          subtitle: 'Download content for offline use',
          icon: 'cloud-offline-outline',
          type: 'toggle',
          value: offlineMode,
          onToggle: setOfflineMode,
        },
        {
          id: 'data-usage',
          title: 'Data Usage',
          subtitle: 'Control when to use mobile data',
          icon: 'cellular-outline',
          type: 'picker',
          value: dataUsage,
          options: [
            { label: 'Wi-Fi Only', value: 'wifi-only' },
            { label: 'Wi-Fi + Cellular', value: 'all' },
            { label: 'Ask Every Time', value: 'ask' },
          ],
          onPress: () => {
            const dataOptions = [
              { label: 'Wi-Fi Only', value: 'wifi-only' },
              { label: 'Wi-Fi + Cellular', value: 'all' },
              { label: 'Ask Every Time', value: 'ask' },
            ];

            Alert.alert(
              'Data Usage',
              'Choose when to use mobile data',
              dataOptions.map(option => ({
                text: option.label,
                onPress: () => {
                  setDataUsage(option.value);
                  Alert.alert('Data Usage Changed', `Data usage set to ${option.label}`);
                }
              })).concat([{ text: 'Cancel', style: 'cancel' }])
            );
          },
        },
        {
          id: 'clear-cache',
          title: 'Clear Cache',
          subtitle: 'Free up storage space',
          icon: 'trash-outline',
          type: 'action',
          onPress: () => Alert.alert('Clear Cache', 'Cache cleared successfully'),
        },
      ],
    },
    {
      id: 'support',
      title: 'Support & Feedback',
      subtitle: 'Get help and send feedback',
      icon: 'help-circle-outline',
      items: [
        {
          id: 'help',
          title: 'Help Center',
          subtitle: 'Browse help articles',
          icon: 'help-circle-outline',
          type: 'navigation',
          rightIcon: 'open-outline',
          onPress: () => handleOpenURL('https://help.example.com'),
        },
        {
          id: 'contact',
          title: 'Contact Support',
          subtitle: 'Get help from our team',
          icon: 'chatbubble-outline',
          type: 'navigation',
          rightIcon: 'chevron-forward-outline',
          onPress: () => Alert.alert('Contact Support', 'Open support chat'),
        },
        {
          id: 'feedback',
          title: 'Send Feedback',
          subtitle: 'Help us improve the app',
          icon: 'star-outline',
          type: 'navigation',
          rightIcon: 'chevron-forward-outline',
          onPress: () => Alert.alert('Feedback', 'Open feedback form'),
        },
        {
          id: 'rate',
          title: 'Rate App',
          subtitle: 'Leave a review on the App Store',
          icon: 'heart-outline',
          type: 'navigation',
          rightIcon: 'open-outline',
          onPress: () => Alert.alert('Rate App', 'Navigate to App Store'),
        },
      ],
    },
    {
      id: 'about',
      title: 'About',
      subtitle: 'App information and legal',
      icon: 'information-circle-outline',
      items: [
        {
          id: 'version',
          title: 'Version',
          subtitle: AppConfig.version,
          icon: 'code-outline',
          type: 'info',
        },
        {
          id: 'terms',
          title: 'Terms of Service',
          icon: 'document-text-outline',
          type: 'navigation',
          rightIcon: 'open-outline',
          onPress: () => handleOpenURL('https://example.com/terms'),
        },
        {
          id: 'privacy-policy',
          title: 'Privacy Policy',
          icon: 'shield-checkmark-outline',
          type: 'navigation',
          rightIcon: 'open-outline',
          onPress: () => handleOpenURL('https://example.com/privacy'),
        },
        {
          id: 'licenses',
          title: 'Open Source Licenses',
          icon: 'library-outline',
          type: 'navigation',
          rightIcon: 'chevron-forward-outline',
          onPress: () => Alert.alert('Licenses', 'Show open source licenses'),
        },
      ],
    },
    {
      id: 'danger',
      title: 'Danger Zone',
      subtitle: 'Irreversible actions',
      icon: 'warning-outline',
      items: [
        {
          id: 'logout',
          title: 'Sign Out',
          subtitle: 'Sign out of your account',
          icon: 'log-out-outline',
          type: 'action',
          color: theme.colors.warning,
          onPress: handleLogout,
        },
        {
          id: 'delete-account',
          title: 'Delete Account',
          subtitle: 'Permanently delete your account',
          icon: 'trash-outline',
          type: 'action',
          color: theme.colors.error,
          destructive: true,
          onPress: handleDeleteAccount,
        },
      ],
    },
  ];

  const sections = customSections || defaultSections;

  // Render animated header
  const renderAnimatedHeader = () => (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 100,
        backgroundColor: colors.background,
        opacity: headerOpacity,
        zIndex: 1000,
        paddingTop: insets.top,
        paddingHorizontal: theme.sizes.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Text variant="subtitle" style={{ fontWeight: '700' }}>
        Settings
      </Text>
      {showSearchBar && (
        <TouchableOpacity onPress={handleSearchPress}>
          <Icon name="search-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      )}
    </Animated.View>
  );

  // Render user section
  const renderUserSection = () => {
    if (!showUserSection) return null;

    return (
      <Card style={{ marginBottom: theme.sizes.lg }}>
        <TouchableOpacity
          onPress={handleUserPress}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: theme.sizes.sm,
          }}
          activeOpacity={0.7}
        >
          <Avatar
            source={user.avatar ? { uri: user.avatar } : undefined}
            name={user.name}
            size="lg"
          />

          <View style={{ flex: 1, marginLeft: theme.sizes.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Text variant="subtitle" style={{ fontWeight: '600', marginRight: theme.sizes.xs }}>
                {user.name}
              </Text>
              {user.isPremium && (
                <View style={{
                  backgroundColor: theme.colors.warning + '20',
                  paddingHorizontal: theme.sizes.xs,
                  paddingVertical: 2,
                  borderRadius: theme.borderRadius.xs,
                  borderWidth: 1,
                  borderColor: theme.colors.warning + '40',
                }}>
                  <Text style={{
                    color: theme.colors.warning,
                    fontSize: theme.fontSizes.xs,
                    fontWeight: '600',
                  }}>
                    PRO
                  </Text>
                </View>
              )}
            </View>

            <Text variant="caption" style={{ color: colors.textSecondary, marginBottom: 2 }}>
              {user.email}
            </Text>

            {user.memberSince && (
              <Text variant="caption" style={{ color: colors.textSecondary, fontSize: theme.fontSizes.xs }}>
                Member since {user.memberSince.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Text>
            )}
          </View>

          <Icon name="chevron-forward-outline" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </Card>
    );
  };

  // Render quick actions
  const renderQuickActions = () => {
    if (!showQuickActions) return null;

    const quickActions = [
      {
        id: 'notifications',
        title: 'Notifications',
        icon: 'notifications-outline' as const,
        color: theme.colors.primary,
        onPress: () => Alert.alert('Notifications', 'Quick toggle notifications'),
      },
      {
        id: 'privacy',
        title: 'Privacy',
        icon: 'shield-outline' as const,
        color: theme.colors.success,
        onPress: () => Alert.alert('Privacy', 'Quick access to privacy settings'),
      },
      {
        id: 'support',
        title: 'Support',
        icon: 'help-circle-outline' as const,
        color: theme.colors.warning,
        onPress: () => Alert.alert('Support', 'Quick access to support'),
      },
      {
        id: 'backup',
        title: 'Backup',
        icon: 'cloud-upload-outline' as const,
        color: theme.colors.secondary,
        onPress: () => Alert.alert('Backup', 'Start backup process'),
      },
    ];

    return (
      <Card style={{ marginBottom: theme.sizes.lg }}>
        <Text variant="subtitle" style={{ fontWeight: '600', marginBottom: theme.sizes.md }}>
          Quick Actions
        </Text>

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          paddingVertical: theme.sizes.sm,
        }}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              onPress={action.onPress}
              style={{
                alignItems: 'center',
                padding: theme.sizes.sm,
                borderRadius: theme.borderRadius.md,
              }}
              activeOpacity={0.7}
            >
              <View style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: action.color + '20',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: theme.sizes.xs,
              }}>
                <Icon name={action.icon} size={24} color={action.color} />
              </View>
              <Text variant="caption" style={{
                color: colors.text,
                fontSize: theme.fontSizes.xs,
                textAlign: 'center',
              }}>
                {action.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>
    );
  };

  // Render setting item using our RTL-aware ListItem component
  const renderSettingItem = (item: SettingItem) => {
    const isDisabled = item.disabled || false;

    // Create rightContent for different item types
    const getRightContent = () => {
      switch (item.type) {
        case 'toggle':
          return (
            <Switch
              value={item.value as boolean}
              onValueChange={item.onToggle}
              disabled={isDisabled}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary + '50',
              }}
              thumbColor={(item.value as boolean) ? theme.colors.primary : '#FFFFFF'}
              style={{
                transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }], // Make switch smaller
              }}
            />
          );
        case 'picker':
          const selectedOption = item.options?.find(opt => opt.value === item.value);
          return (
            <Text style={{
              color: colors.textSecondary,
              fontSize: theme.fontSizes.xs,
            }}>
              {selectedOption?.label || String(item.value)}
            </Text>
          );
        case 'slider':
          return (
            <Text style={{
              color: colors.textSecondary,
              fontSize: theme.fontSizes.xs,
            }}>
              {String(item.value)}
            </Text>
          );
        case 'info':
          return item.value ? (
            <Text style={{
              color: colors.textSecondary,
              fontSize: theme.fontSizes.xs,
            }}>
              {String(item.value)}
            </Text>
          ) : null;
        default:
          return null;
      }
    };

    return (
      <ListItem
        title={item.title}
        subtitle={item.subtitle}
        leftIcon={item.icon}
        rightIcon={item.type === 'navigation' ? item.rightIcon : undefined}
        rightContent={getRightContent()}
        badge={item.badge ? { text: item.badge } : undefined}
        onPress={!isDisabled ? item.onPress : undefined}
        disabled={isDisabled}
        titleStyle={{
          fontSize: theme.fontSizes.sm,
          color: item.destructive ? theme.colors.error : (item.color || colors.text),
          fontWeight: '500',
        }}
        subtitleStyle={{
          fontSize: theme.fontSizes.xs,
          color: colors.textSecondary,
        }}
        itemStyle={{
          paddingVertical: theme.sizes.md,
          opacity: isDisabled ? 0.5 : 1,
        }}
      />
    );
  };

  // Render settings sections using our RTL-aware List components
  const renderSettingsSections = () => (
    <View>
      {sections.map((section, sectionIndex) => (
        <List key={section.id} variant="default" showDividers={true} dividerVariant="full"
          style={{ marginBottom: theme.sizes.lg, backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.md }}
        >
          <ListSection
            title={section.title}
            subtitle={section.subtitle}
            titleStyle={{
              fontWeight: '600',
              fontSize: theme.fontSizes.md,
              color: theme.colors.primary,
            }}
            subtitleStyle={{
              color: colors.textSecondary,
              fontSize: theme.fontSizes.xs,
            }}
          >
            {section.items.map((item) => (
              <React.Fragment key={item.id}>
                {renderSettingItem(item)}
              </React.Fragment>
            ))}
          </ListSection>
        </List>
      ))}
    </View>
  );

  return (
    <SafeAreaView
      style={[
        {
          flex: 1,
          backgroundColor: colors.background,
        },
        style
      ]}
      testID={testID}
    >
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {renderAnimatedHeader()}

      <Animated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: theme.sizes.lg,
          paddingTop: theme.sizes.lg,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          enableRefresh ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          ) : undefined
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {renderUserSection()}
        {renderQuickActions()}
        {renderSettingsSections()}
      </Animated.ScrollView>
    </SafeAreaView>
  );
}