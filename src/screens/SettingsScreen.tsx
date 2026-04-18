import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Alert,
  Linking,
  Animated,
  RefreshControl,
  StatusBar,
  ViewStyle,
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useFont } from '../contexts/FontContext';
import { Text } from '../components/ui/Text';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Icon, IconName } from '../components/ui/Icon';
import { List, ListItem, ListSection, ListDivider } from '../components/ui/List';
import { Switch } from '../components/ui/Switch';
import { AppConfig, LanguageOptions } from '../config/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MiniView } from '../components';

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

interface SettingsScreenContent {
  title?: string;
  quickActionsTitle?: string;
  sections?: {
    account?: string;
    accountSubtitle?: string;
    notifications?: string;
    notificationsSubtitle?: string;
    appearance?: string;
    appearanceSubtitle?: string;
    data?: string;
    dataSubtitle?: string;
    support?: string;
    supportSubtitle?: string;
    about?: string;
    aboutSubtitle?: string;
    danger?: string;
    dangerSubtitle?: string;
  };
  items?: {
    privacy?: { title: string; subtitle?: string };
    subscription?: { title: string; subtitle?: string; badge?: string };
    biometric?: { title: string; subtitle?: string };
    allNotifications?: { title: string; subtitle?: string };
    pushNotifications?: { title: string; subtitle?: string };
    emailNotifications?: { title: string; subtitle?: string };
    darkMode?: { title: string; subtitle?: string };
    language?: { title: string; subtitle?: string };
    fontSize?: { title: string; subtitle?: string };
    autoBackup?: { title: string; subtitle?: string };
    offlineMode?: { title: string; subtitle?: string };
    dataUsage?: { title: string; subtitle?: string };
    clearCache?: { title: string; subtitle?: string };
    help?: { title: string; subtitle?: string };
    contact?: { title: string; subtitle?: string };
    feedback?: { title: string; subtitle?: string };
    rate?: { title: string; subtitle?: string };
    version?: { title: string; subtitle?: string };
    terms?: { title: string; subtitle?: string };
    privacy?: { title: string; subtitle?: string };
    licenses?: { title: string; subtitle?: string };
    logout?: { title: string; subtitle?: string };
    deleteAccount?: { title: string; subtitle?: string };
  };
  alerts?: {
    signOut?: { title: string; message: string; cancel: string; confirm: string };
    deleteAccount?: { title: string; message: string; cancel: string; confirm: string };
    privacySettings?: { title: string; message: string };
    subscription?: { title: string; message: string };
    clearCache?: { title: string; message: string };
    contactSupport?: { title: string; message: string };
    feedback?: { title: string; message: string };
    rateApp?: { title: string; message: string };
    licenses?: { title: string; message: string };
    languageChanged?: { title: string; message: string };
    fontSizeChanged?: { title: string; message: string };
    dataUsageChanged?: { title: string; message: string };
  };
  quickActions?: {
    notifications?: string;
    privacy?: string;
    support?: string;
    backup?: string;
  };
  memberSince?: string;
}

interface FooterConfig {
  show?: boolean;
  logo?: any; // Image source
  companyName?: string;
  description?: string;
  websiteUrl?: string;
  copyrightYear?: number;
}

export interface SettingsScreenProps {
  layout?: SettingsScreenLayout;
  theme?: SettingsScreenTheme;
  user?: UserInfo;
  showUserSection?: boolean;
  showQuickActions?: boolean;
  showSearchBar?: boolean;
  showAnimatedHeader?: boolean; // Option to show/hide animated header
  enableRefresh?: boolean;
  useSafeArea?: boolean; // Control whether to use SafeAreaView
  contentBottomPadding?: number; // Control bottom padding of scroll content
  customSections?: SettingSection[];
  visibleSections?: string[]; // Filter which sections to show by their IDs
  hiddenItems?: string[]; // Hide specific items by their IDs across all sections
  content?: SettingsScreenContent;
  customItemStyle?: ViewStyle; // Custom style for list items
  footer?: FooterConfig; // Footer configuration
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

// Default content in English
const getDefaultContent = (): SettingsScreenContent => ({
  title: 'Settings',
  quickActionsTitle: 'Quick Actions',
  memberSince: 'Member since',
  sections: {
    account: 'Account',
    accountSubtitle: 'Manage your account settings',
    notifications: 'Notifications',
    notificationsSubtitle: 'Configure your notification preferences',
    appearance: 'Appearance',
    appearanceSubtitle: 'Customize how the app looks',
    data: 'Data & Storage',
    dataSubtitle: 'Manage your data usage and storage',
    support: 'Support & Feedback',
    supportSubtitle: 'Get help and send feedback',
    about: 'About',
    aboutSubtitle: 'App information and legal',
    danger: 'Danger Zone',
    dangerSubtitle: 'Irreversible actions',
  },
  items: {
    privacy: { title: 'Privacy & Security', subtitle: 'Control who can see your information' },
    subscription: { title: 'Subscription', subtitle: 'Free Plan', badge: 'Pro' },
    biometric: { title: 'Biometric Authentication', subtitle: 'Use Face ID or Touch ID' },
    allNotifications: { title: 'All Notifications', subtitle: 'Enable or disable all notifications' },
    pushNotifications: { title: 'Push Notifications', subtitle: 'Receive push notifications' },
    emailNotifications: { title: 'Email Notifications', subtitle: 'Receive notifications via email' },
    darkMode: { title: 'Dark Mode', subtitle: 'Use dark theme' },
    language: { title: 'Language', subtitle: 'Choose your language' },
    fontSize: { title: 'Font Size', subtitle: '16px' },
    autoBackup: { title: 'Auto Backup', subtitle: 'Automatically backup your data' },
    offlineMode: { title: 'Offline Mode', subtitle: 'Download content for offline use' },
    dataUsage: { title: 'Data Usage', subtitle: 'Control when to use mobile data' },
    clearCache: { title: 'Clear Cache', subtitle: 'Free up storage space' },
    help: { title: 'Help Center', subtitle: 'Browse help articles' },
    contact: { title: 'Contact Support', subtitle: 'Get help from our team' },
    feedback: { title: 'Send Feedback', subtitle: 'Help us improve the app' },
    rate: { title: 'Rate App', subtitle: 'Leave a review on the App Store' },
    version: { title: 'Version', subtitle: '' },
    terms: { title: 'Terms of Service', subtitle: '' },
    licenses: { title: 'Open Source Licenses', subtitle: '' },
    logout: { title: 'Sign Out', subtitle: 'Sign out of your account' },
    deleteAccount: { title: 'Delete Account', subtitle: 'Permanently delete your account' },
  },
  alerts: {
    signOut: { title: 'Sign Out', message: 'Are you sure you want to sign out?', cancel: 'Cancel', confirm: 'Sign Out' },
    deleteAccount: { title: 'Delete Account', message: 'This action cannot be undone. All your data will be permanently deleted.', cancel: 'Cancel', confirm: 'Delete' },
    privacySettings: { title: 'Privacy', message: 'Navigate to privacy settings' },
    subscription: { title: 'Subscription', message: 'Manage subscription' },
    clearCache: { title: 'Clear Cache', message: 'Cache cleared successfully' },
    contactSupport: { title: 'Contact Support', message: 'Open support chat' },
    feedback: { title: 'Feedback', message: 'Open feedback form' },
    rateApp: { title: 'Rate App', message: 'Navigate to App Store' },
    licenses: { title: 'Licenses', message: 'Show open source licenses' },
    languageChanged: { title: 'Language Changed', message: 'Language changed to' },
    fontSizeChanged: { title: 'Font Size Changed', message: 'Font size changed to' },
    dataUsageChanged: { title: 'Data Usage Changed', message: 'Data usage set to' },
  },
  quickActions: {
    notifications: 'Notifications',
    privacy: 'Privacy',
    support: 'Support',
    backup: 'Backup',
  },
});

export function SettingsScreen({
  layout = 'default',
  theme: settingsTheme = 'auto',
  user = defaultUser,
  showUserSection = true,
  showQuickActions = true,
  showSearchBar = false,
  showAnimatedHeader = true,
  enableRefresh = true,
  useSafeArea = true,
  contentBottomPadding = 90,
  customSections,
  visibleSections,
  hiddenItems,
  content,
  customItemStyle,
  footer,
  onUserPress,
  onSearchPress,
  onLogout,
  onDeleteAccount,
  style,
  testID = 'settings-screen',
}: SettingsScreenProps) {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const { fontSize, setFontSize } = useFont();
  const insets = useSafeAreaInsets();

  // Merge default content with provided content
  const defaultContent = getDefaultContent();
  const mergedContent: SettingsScreenContent = {
    title: content?.title || defaultContent.title,
    quickActionsTitle: content?.quickActionsTitle || defaultContent.quickActionsTitle,
    memberSince: content?.memberSince || defaultContent.memberSince,
    sections: { ...defaultContent.sections, ...content?.sections },
    items: { ...defaultContent.items, ...content?.items },
    alerts: { ...defaultContent.alerts, ...content?.alerts },
    quickActions: { ...defaultContent.quickActions, ...content?.quickActions },
  };

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
  // fontSize is now from FontContext, remove local state

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

  // saveFontSize is now handled by FontContext

  const loadSettings = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(AppConfig.storage.language);
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }
      // Font size loading is now handled by FontContext
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
    const alertContent = mergedContent.alerts?.signOut;
    Alert.alert(
      alertContent?.title || 'Sign Out',
      alertContent?.message || 'Are you sure you want to sign out?',
      [
        { text: alertContent?.cancel || 'Cancel', style: 'cancel' },
        {
          text: alertContent?.confirm || 'Sign Out',
          style: 'destructive',
          onPress: onLogout || logout,
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    const alertContent = mergedContent.alerts?.deleteAccount;
    Alert.alert(
      alertContent?.title || 'Delete Account',
      alertContent?.message || 'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: alertContent?.cancel || 'Cancel', style: 'cancel' },
        {
          text: alertContent?.confirm || 'Delete',
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
      title: mergedContent.sections?.account || 'Account',
      subtitle: mergedContent.sections?.accountSubtitle || 'Manage your account settings',
      icon: 'person-outline',
      items: [
        {
          id: 'privacy',
          title: mergedContent.items?.privacy?.title || 'Privacy & Security',
          subtitle: mergedContent.items?.privacy?.subtitle || 'Control who can see your information',
          icon: 'shield-outline',
          type: 'navigation',
          rightIcon: 'chevron-forward-outline',
          onPress: () => Alert.alert(mergedContent.alerts?.privacySettings?.title || 'Privacy', mergedContent.alerts?.privacySettings?.message || 'Navigate to privacy settings'),
        },
        {
          id: 'subscription',
          title: mergedContent.items?.subscription?.title || 'Subscription',
          subtitle: user.isPremium ? mergedContent.items?.subscription?.subtitle || 'Premium Member' : mergedContent.items?.subscription?.subtitle || 'Free Plan',
          icon: 'card-outline',
          type: 'navigation',
          rightIcon: 'chevron-forward-outline',
          badge: user.isPremium ? mergedContent.items?.subscription?.badge || 'Pro' : undefined,
          onPress: () => Alert.alert(mergedContent.alerts?.subscription?.title || 'Subscription', mergedContent.alerts?.subscription?.message || 'Manage subscription'),
        },
        {
          id: 'biometric',
          title: mergedContent.items?.biometric?.title || 'Biometric Authentication',
          subtitle: mergedContent.items?.biometric?.subtitle || 'Use Face ID or Touch ID',
          icon: 'finger-print-outline',
          type: 'toggle',
          value: biometricEnabled,
          onToggle: setBiometricEnabled,
        },
      ],
    },
    {
      id: 'notifications',
      title: mergedContent.sections?.notifications || 'Notifications',
      subtitle: mergedContent.sections?.notificationsSubtitle || 'Configure your notification preferences',
      icon: 'notifications-outline',
      items: [
        {
          id: 'all-notifications',
          title: mergedContent.items?.allNotifications?.title || 'All Notifications',
          subtitle: mergedContent.items?.allNotifications?.subtitle || 'Enable or disable all notifications',
          icon: 'notifications-outline',
          type: 'toggle',
          value: notificationsEnabled,
          onToggle: setNotificationsEnabled,
        },
        {
          id: 'push',
          title: mergedContent.items?.pushNotifications?.title || 'Push Notifications',
          subtitle: mergedContent.items?.pushNotifications?.subtitle || 'Receive push notifications',
          icon: 'phone-portrait-outline',
          type: 'toggle',
          value: pushNotifications,
          onToggle: setPushNotifications,
          disabled: !notificationsEnabled,
        },
        {
          id: 'email',
          title: mergedContent.items?.emailNotifications?.title || 'Email Notifications',
          subtitle: mergedContent.items?.emailNotifications?.subtitle || 'Receive notifications via email',
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
      title: mergedContent.sections?.appearance || 'Appearance',
      subtitle: mergedContent.sections?.appearanceSubtitle || 'Customize how the app looks',
      icon: 'color-palette-outline',
      items: [
        {
          id: 'dark-mode',
          title: mergedContent.items?.darkMode?.title || 'Dark Mode',
          subtitle: mergedContent.items?.darkMode?.subtitle || 'Use dark theme',
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
          title: mergedContent.items?.language?.title || 'Language',
          subtitle: mergedContent.items?.language?.subtitle || 'Choose your language',
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
                  Alert.alert(mergedContent.alerts?.languageChanged?.title || 'Language Changed', `${mergedContent.alerts?.languageChanged?.message || 'Language changed to'} ${lang.label}`);
                }
              })).concat([{ text: 'Cancel', style: 'cancel' }])
            );
          },
        },
        {
          id: 'font-size',
          title: mergedContent.items?.fontSize?.title || 'Font Size',
          subtitle: `${fontSize} (Base Size)`,
          icon: 'text-outline',
          type: 'picker',
          value: fontSize,
          options: [
            { label: '12 (Small)', value: 12 },
            { label: '14 (Medium)', value: 14 },
            { label: '16 (Default)', value: 16 },
            { label: '18 (Large)', value: 18 },
            { label: '20 (X-Large)', value: 20 },
            { label: '22 (XX-Large)', value: 22 },
            { label: '24 (XXX-Large)', value: 24 },
          ],
          onPress: () => {
            const fontSizeOptions = [
              { label: '12 (Small)', value: 12 },
              { label: '14 (Medium)', value: 14 },
              { label: '16 (Default)', value: 16 },
              { label: '18 (Large)', value: 18 },
              { label: '20 (X-Large)', value: 20 },
              { label: '22 (XX-Large)', value: 22 },
              { label: '24 (XXX-Large)', value: 24 },
            ];

            Alert.alert(
              'Select Font Size',
              'Choose your preferred base font size',
              fontSizeOptions.map(option => ({
                text: option.label,
                onPress: async () => {
                  await setFontSize(option.value);
                  Alert.alert(mergedContent.alerts?.fontSizeChanged?.title || 'Font Size Changed', `${mergedContent.alerts?.fontSizeChanged?.message || 'Font size changed to'} ${option.label}`);
                }
              })).concat([{ text: 'Cancel', style: 'cancel' }])
            );
          },
        },
      ],
    },
    {
      id: 'data',
      title: mergedContent.sections?.data || 'Data & Storage',
      subtitle: mergedContent.sections?.dataSubtitle || 'Manage your data usage and storage',
      icon: 'server-outline',
      items: [
        {
          id: 'auto-backup',
          title: mergedContent.items?.autoBackup?.title || 'Auto Backup',
          subtitle: mergedContent.items?.autoBackup?.subtitle || 'Automatically backup your data',
          icon: 'cloud-upload-outline',
          type: 'toggle',
          value: autoBackup,
          onToggle: setAutoBackup,
        },
        {
          id: 'offline-mode',
          title: mergedContent.items?.offlineMode?.title || 'Offline Mode',
          subtitle: mergedContent.items?.offlineMode?.subtitle || 'Download content for offline use',
          icon: 'cloud-offline-outline',
          type: 'toggle',
          value: offlineMode,
          onToggle: setOfflineMode,
        },
        {
          id: 'data-usage',
          title: mergedContent.items?.dataUsage?.title || 'Data Usage',
          subtitle: mergedContent.items?.dataUsage?.subtitle || 'Control when to use mobile data',
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
                  Alert.alert(mergedContent.alerts?.dataUsageChanged?.title || 'Data Usage Changed', `${mergedContent.alerts?.dataUsageChanged?.message || 'Data usage set to'} ${option.label}`);
                }
              })).concat([{ text: 'Cancel', style: 'cancel' }])
            );
          },
        },
        {
          id: 'clear-cache',
          title: mergedContent.items?.clearCache?.title || 'Clear Cache',
          subtitle: mergedContent.items?.clearCache?.subtitle || 'Free up storage space',
          icon: 'trash-outline',
          type: 'action',
          onPress: () => Alert.alert(mergedContent.alerts?.clearCache?.title || 'Clear Cache', mergedContent.alerts?.clearCache?.message || 'Cache cleared successfully'),
        },
      ],
    },
    {
      id: 'support',
      title: mergedContent.sections?.support || 'Support & Feedback',
      subtitle: mergedContent.sections?.supportSubtitle || 'Get help and send feedback',
      icon: 'help-circle-outline',
      items: [
        {
          id: 'help',
          title: mergedContent.items?.help?.title || 'Help Center',
          subtitle: mergedContent.items?.help?.subtitle || 'Browse help articles',
          icon: 'help-circle-outline',
          type: 'navigation',
          rightIcon: 'open-outline',
          onPress: () => handleOpenURL('https://help.example.com'),
        },
        {
          id: 'contact',
          title: mergedContent.items?.contact?.title || 'Contact Support',
          subtitle: mergedContent.items?.contact?.subtitle || 'Get help from our team',
          icon: 'chatbubble-outline',
          type: 'navigation',
          rightIcon: 'chevron-forward-outline',
          onPress: () => Alert.alert(mergedContent.alerts?.contactSupport?.title || 'Contact Support', mergedContent.alerts?.contactSupport?.message || 'Open support chat'),
        },
        {
          id: 'feedback',
          title: mergedContent.items?.feedback?.title || 'Send Feedback',
          subtitle: mergedContent.items?.feedback?.subtitle || 'Help us improve the app',
          icon: 'star-outline',
          type: 'navigation',
          rightIcon: 'chevron-forward-outline',
          onPress: () => Alert.alert(mergedContent.alerts?.feedback?.title || 'Feedback', mergedContent.alerts?.feedback?.message || 'Open feedback form'),
        },
        {
          id: 'rate',
          title: mergedContent.items?.rate?.title || 'Rate App',
          subtitle: mergedContent.items?.rate?.subtitle || 'Leave a review on the App Store',
          icon: 'heart-outline',
          type: 'navigation',
          rightIcon: 'open-outline',
          onPress: () => Alert.alert(mergedContent.alerts?.rateApp?.title || 'Rate App', mergedContent.alerts?.rateApp?.message || 'Navigate to App Store'),
        },
      ],
    },
    {
      id: 'about',
      title: mergedContent.sections?.about || 'About',
      subtitle: mergedContent.sections?.aboutSubtitle || 'App information and legal',
      icon: 'information-circle-outline',
      items: [
        {
          id: 'version',
          title: mergedContent.items?.version?.title || 'Version',
          subtitle: AppConfig.version,
          icon: 'code-outline',
          type: 'info',
        },
        {
          id: 'terms',
          title: mergedContent.items?.terms?.title || 'Terms of Service',
          icon: 'document-text-outline',
          type: 'navigation',
          rightIcon: 'open-outline',
          onPress: () => handleOpenURL('https://example.com/terms'),
        },
        {
          id: 'privacy-policy',
          title: mergedContent.items?.privacy?.title || 'Privacy Policy',
          icon: 'shield-checkmark-outline',
          type: 'navigation',
          rightIcon: 'open-outline',
          onPress: () => handleOpenURL('https://example.com/privacy'),
        },
        {
          id: 'licenses',
          title: mergedContent.items?.licenses?.title || 'Open Source Licenses',
          icon: 'library-outline',
          type: 'navigation',
          rightIcon: 'chevron-forward-outline',
          onPress: () => Alert.alert(mergedContent.alerts?.licenses?.title || 'Licenses', mergedContent.alerts?.licenses?.message || 'Show open source licenses'),
        },
      ],
    },
    {
      id: 'danger',
      title: mergedContent.sections?.danger || 'Danger Zone',
      subtitle: mergedContent.sections?.dangerSubtitle || 'Irreversible actions',
      icon: 'warning-outline',
      items: [
        {
          id: 'logout',
          title: mergedContent.items?.logout?.title || 'Sign Out',
          subtitle: mergedContent.items?.logout?.subtitle || 'Sign out of your account',
          icon: 'log-out-outline',
          type: 'action',
          color: theme.colors.warning,
          onPress: handleLogout,
        },
        {
          id: 'delete-account',
          title: mergedContent.items?.deleteAccount?.title || 'Delete Account',
          subtitle: mergedContent.items?.deleteAccount?.subtitle || 'Permanently delete your account',
          icon: 'trash-outline',
          type: 'action',
          color: theme.colors.error,
          destructive: true,
          onPress: handleDeleteAccount,
        },
      ],
    },
  ];

  const allSections = customSections || defaultSections;

  // Filter sections based on visibleSections prop
  let filteredSections = visibleSections
    ? allSections.filter(section => visibleSections.includes(section.id))
    : allSections;

  // Filter out hidden items from each section
  if (hiddenItems && hiddenItems.length > 0) {
    filteredSections = filteredSections.map(section => ({
      ...section,
      items: section.items.filter(item => !hiddenItems.includes(item.id))
    }));
  }

  const sections = filteredSections;

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
        paddingTop: insets.top + theme.sizes.sm,
        paddingHorizontal: theme.sizes.lg,
        justifyContent: 'space-between',
      }}
    >
      <Text variant="subtitle" style={{ fontWeight: '700' }}>
        {mergedContent.title}
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
            size="lg"
          />

          <View style={{ flex: 1, marginHorizontal: theme.sizes.sm }}>
            <MiniView enableRTL style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
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
            </MiniView>

            <Text variant="caption" style={{ color: colors.textSecondary, marginBottom: 2 }}>
              {user.email}
            </Text>

            {user.memberSince && (
              <Text variant="caption" style={{ color: colors.textSecondary, fontSize: theme.fontSizes.xs }}>
                {mergedContent.memberSince} {user.memberSince.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' })}
              </Text>
            )}
          </View>
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
        title: mergedContent.quickActions?.notifications || 'Notifications',
        icon: 'notifications-outline' as const,
        color: theme.colors.primary,
        onPress: () => Alert.alert('Notifications', 'Quick toggle notifications'),
      },
      {
        id: 'privacy',
        title: mergedContent.quickActions?.privacy || 'Privacy',
        icon: 'shield-outline' as const,
        color: theme.colors.success,
        onPress: () => Alert.alert('Privacy', 'Quick access to privacy settings'),
      },
      {
        id: 'support',
        title: mergedContent.quickActions?.support || 'Support',
        icon: 'help-circle-outline' as const,
        color: theme.colors.warning,
        onPress: () => Alert.alert('Support', 'Quick access to support'),
      },
      {
        id: 'backup',
        title: mergedContent.quickActions?.backup || 'Backup',
        icon: 'cloud-upload-outline' as const,
        color: theme.colors.secondary,
        onPress: () => Alert.alert('Backup', 'Start backup process'),
      },
    ];

    return (
      <Card style={{ marginBottom: theme.sizes.lg }}>
        <Text variant="subtitle" style={{ fontWeight: '600', marginBottom: theme.sizes.md }}>
          {mergedContent.quickActionsTitle}
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
              onValueChange={(value) => item.onToggle?.(value)}
              disabled={isDisabled}
              size="medium"
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
        variant="compact"
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
          ...customItemStyle,
        }}
      />
    );
  };

  // Render footer
  const renderFooter = () => {
    if (!footer?.show) return null;

    return (
      <Card
        colorScheme="ghost"
        padding="none"
        style={{
          alignItems: 'center',
          marginTop: theme.sizes.sm,
        }}
        footer={
          <View style={{
            alignItems: 'center',
            width: '100%',
          }}>
            {footer.logo && (
              <Image
                source={footer.logo}
                style={{
                  width: 50,
                  height: 50,
                  marginBottom: theme.sizes.sm,
                  opacity: 0.8,
                }}
                resizeMode="contain"
              />
            )}
            {footer.companyName && (
              <Text variant="caption" style={{
                marginBottom: theme.sizes.xs,
                textAlign: 'right',
                writingDirection: 'rtl',
              }}>
                مطور بواسطة {footer.websiteUrl || footer.companyName}
              </Text>
            )}
            {footer.description && (
              <Text variant="caption" style={{
                opacity: 0.7,
                marginBottom: theme.sizes.xs,
              }}>
                {footer.description}
              </Text>
            )}
            <Text variant="caption" style={{
              opacity: 0.6,
            }}>
              © {footer.copyrightYear || new Date().getFullYear()} جميع الحقوق محفوظة
            </Text>
          </View>
        }
      />
    );
  };

  // Render settings sections using our RTL-aware List components
  const renderSettingsSections = () => (
    <View>
      {sections.map((section, sectionIndex) => (
        <List key={section.id} variant="default" showDividers={true} dividerVariant="full"
          style={{ marginBottom: theme.sizes.md, backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.md, paddingBottom: theme.sizes.md }}
        >
          <ListSection
            title={section.title}
            subtitle={section.subtitle}
            titleStyle={{
              fontWeight: '600',
              fontSize: theme.fontSizes.lg,
              color: theme.colors.primary,
            }}
            subtitleStyle={{
              color: colors.textSecondary,
              fontSize: theme.fontSizes.sm,
            }}
            headerStyle={{
              paddingBottom: theme.sizes.md,
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

  const Container = useSafeArea ? SafeAreaView : View;

  return (
    <Container
      style={[
        {
          flex: 1,
          backgroundColor: colors.background,
          // Always add margins when not using SafeAreaView
          ...(!useSafeArea ? {
            marginTop: theme.sizes.md,
            marginBottom: 0,
          } : {}),
        },
        style
      ]}
      testID={testID}
    >
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {showAnimatedHeader && renderAnimatedHeader()}

      <Animated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: contentBottomPadding, // Configurable bottom padding
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
        {renderFooter()}
      </Animated.ScrollView>
    </Container>
  );
}