import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, View, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Container } from '@sikasio/expo-boilerplate/components/layout';
import { Text } from '@sikasio/expo-boilerplate/components/ui';
import { Card } from '@sikasio/expo-boilerplate/components/ui';
import { Button } from '@sikasio/expo-boilerplate/components/ui';
import { ThemeStatusBar } from '@sikasio/expo-boilerplate/components/ui';
import { SplashScreen } from '@sikasio/expo-boilerplate/screens';
import { AuthScreen } from '@sikasio/expo-boilerplate/screens';
import { OnboardingScreen } from '@sikasio/expo-boilerplate/screens';
import { SettingsScreen } from '@sikasio/expo-boilerplate/screens';
import { LoadingSpinner } from '@sikasio/expo-boilerplate/components/ui';
import { HorizontalCardScroll } from '@sikasio/expo-boilerplate/components/ui';
import { Avatar } from '@sikasio/expo-boilerplate/components/ui';
import { Icon } from '@sikasio/expo-boilerplate/components/ui';
import { Header } from '@sikasio/expo-boilerplate/components/navigation';
import { useTheme } from '@sikasio/expo-boilerplate/contexts';
import { useSplash } from '@sikasio/expo-boilerplate/contexts';
import { getCurrentTabBarDesign, getFloatingButtonBottom, getScrollViewContentInset, NAVIGATION_CONSTANTS } from '@sikasio/expo-boilerplate/config';
import { AppConfig } from '@sikasio/expo-boilerplate/config';

export default function ScreensScreen() {
  const { theme, toggleTheme } = useTheme();
  const { setIsSplashActive } = useSplash();
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);

  // State for interactive examples
  const [activeSplash, setActiveSplash] = useState<string | null>(null);
  const [splashProgress, setSplashProgress] = useState(0);
  const [activeAuth, setActiveAuth] = useState<string | null>(null);
  const [activeAuthSubVariant, setActiveAuthSubVariant] = useState<string | null>(null);
  const [activeOnboarding, setActiveOnboarding] = useState<string | null>(null);
  const [activeSettings, setActiveSettings] = useState<string | null>(null);
  const [selectedScreenType, setSelectedScreenType] = useState('dashboard');

  const currentTabBarDesign = getCurrentTabBarDesign();
  const floatingButtonBottom = getFloatingButtonBottom(currentTabBarDesign, 0, 0);
  const contentInset = getScrollViewContentInset(currentTabBarDesign, 0);

  // Update splash context when splash is active
  useEffect(() => {
    setIsSplashActive(!!activeSplash || !!activeAuth || !!activeOnboarding || !!activeSettings);
  }, [activeSplash, activeAuth, activeOnboarding, activeSettings, setIsSplashActive]);

  // Unified close button component
  const renderCloseButton = (onPress: () => void, zIndex: number = 1001) => (
    <View style={{
      position: 'absolute',
      top: 50,
      right: theme.sizes.md,
      zIndex: zIndex,
    }}>
      <TouchableOpacity
        onPress={onPress}
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: theme.isDark ? '#FFFFFF' : 'rgba(0, 0, 0, 0.7)',
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: theme.isDark ? '#000' : '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: zIndex,
        }}
      >
        <Icon name="close" size={24} color={theme.isDark ? '#000000' : '#FFFFFF'} />
      </TouchableOpacity>
    </View>
  );

  // Section positions for quick navigation scrolling
  const sectionPositions = useRef<{ [key: string]: number }>({});

  // Define screen categories
  const screenCategories = [
    { id: 'splash', title: 'Splash Screens', icon: 'play-outline', count: 6 },
    { id: 'settings', title: 'Settings Screens', icon: 'settings-outline', count: 5 },
    { id: 'auth', title: 'Authentication', icon: 'log-in-outline', count: 4 },
    { id: 'onboarding', title: 'Onboarding', icon: 'rocket-outline', count: 3 },
    { id: 'ecommerce', title: 'E-commerce', icon: 'storefront-outline', count: 6 },
    { id: 'social', title: 'Social Media', icon: 'heart-outline', count: 4 },
  ];

  // Define distinct splash screen variants
  const splashVariants = [
    {
      id: 'minimal',
      title: 'Minimal Splash',
      description: 'Clean design with auto-hide',
      variant: 'minimal' as const,
      theme: 'branded' as const,
      layout: 'center' as const,
      color: theme.colors.primary,
      icon: 'rocket-outline',
      features: ['Auto-hide', 'Fade animation', 'Clean design'],
      content: {
        title: AppConfig.name,
        subtitle: 'Welcome',
        version: AppConfig.version,
      },
      autoHide: true,
      autoHideDelay: 2500,
      enableAnimations: true,
    },
    {
      id: 'loading',
      title: 'Loading Progress',
      description: 'Progress tracking with percentage',
      variant: 'loading' as const,
      theme: 'dark' as const,
      layout: 'center' as const,
      color: theme.colors.warning,
      icon: 'download-outline',
      features: ['Progress bar', 'Percentage', 'Loading spinner'],
      content: {
        title: 'Loading Resources',
        subtitle: 'Please wait...',
        description: 'Setting up your experience',
      },
      showProgress: true,
      showPercentage: true,
      progressMessage: 'Loading assets',
    },
    {
      id: 'branded',
      title: 'Branded Experience',
      description: 'Company branding with actions',
      variant: 'branded' as const,
      theme: 'gradient' as const,
      layout: 'split' as const,
      color: theme.colors.success,
      icon: 'business-outline',
      features: ['Gradient background', 'Action buttons', 'Split layout'],
      content: {
        title: 'Your Company',
        subtitle: 'Professional Solutions',
        description: 'Empowering businesses worldwide with innovative technology solutions.',
        copyright: '© 2024 Your Company. All rights reserved.',
      },
      gradientColors: [theme.colors.success, theme.colors.success + 'CC'] as [string, string],
      actions: [
        { title: 'Get Started', onPress: () => {}, variant: 'primary' as const },
        { title: 'Learn More', onPress: () => {}, variant: 'outline' as const }
      ],
    },
    {
      id: 'animated',
      title: 'Animated Logo',
      description: 'Rotating animation with custom icon',
      variant: 'animated' as const,
      theme: 'custom' as const,
      layout: 'center' as const,
      color: theme.colors.secondary,
      icon: 'sync-outline',
      features: ['Rotating animation', 'Custom colors', 'Smooth transitions'],
      content: {
        title: 'Creative Studio',
        subtitle: 'Design & Innovation',
        description: 'Where creativity meets technology',
      },
      backgroundColor: '#1A1A2E',
      textColor: '#FFFFFF',
      enableAnimations: true,
      animationDuration: 3000,
    },
    {
      id: 'onboarding',
      title: 'Onboarding Start',
      description: 'Welcome screen with skip option',
      variant: 'onboarding' as const,
      theme: undefined,
      layout: 'bottom' as const,
      color: theme.colors.primary,
      icon: 'walk-outline',
      features: ['Skip button', 'Bottom layout', 'Welcome message'],
      content: {
        title: 'Welcome to the Future',
        subtitle: 'Discover Amazing Features',
        description: 'Take a quick tour to see what makes our app special and how it can help you achieve your goals.',
      },
      showSkipButton: true,
      skipButtonText: 'Skip Tour',
      actions: [
        { title: 'Start Tour', onPress: () => {}, variant: 'primary' as const, icon: 'play-outline' as const }
      ],
    },
    {
      id: 'ecommerce',
      title: 'E-commerce Launch',
      description: 'Product showcase with promotions',
      variant: 'default' as const,
      theme: 'branded' as const,
      layout: 'center' as const,
      color: theme.colors.error,
      icon: 'storefront-outline',
      features: ['Product focus', 'Promotional badge', 'Call-to-action'],
      content: {
        title: 'Shop & Save',
        subtitle: 'Black Friday Sale',
        description: 'Up to 70% off on selected items. Limited time offer!',
        version: '2.1.5',
      },
      backgroundColor: theme.colors.error,
      textColor: '#FFFFFF',
      actions: [
        { title: 'Shop Now', onPress: () => {}, variant: 'secondary' as const, icon: 'bag-outline' as const }
      ],
    },
  ];

  // Define authentication screen variants
  const authVariants = [
    {
      id: 'login',
      title: 'Login Options',
      description: 'Sign in with email or phone number',
      variant: 'login-email' as const,
      theme: undefined,
      layout: 'centered' as const,
      color: theme.colors.primary,
      icon: 'log-in-outline',
      features: ['Email validation', 'Phone validation', 'Remember me', 'Forgot password'],
      content: {
        title: 'Welcome Back',
        subtitle: 'Choose your sign-in method',
        description: 'Sign in with your email or phone number',
      },
      showRememberMe: true,
      showForgotPassword: true,
      enableValidation: true,
      isSplitCard: true,
      splitOptions: [
        {
          id: 'email',
          title: 'Sign in with Email',
          description: 'Use your email address',
          icon: 'mail-outline' as const,
        },
        {
          id: 'phone',
          title: 'Sign in with Phone',
          description: 'Use your phone number',
          icon: 'call-outline' as const,
        }
      ],
    },
    {
      id: 'register',
      title: 'Registration',
      description: 'Full signup form with terms',
      variant: 'register' as const,
      theme: undefined,
      layout: 'default' as const,
      color: theme.colors.success,
      icon: 'person-add-outline',
      features: ['Form validation', 'Terms checkbox', 'Password confirm'],
      content: {
        title: 'Create Account',
        subtitle: 'Join our platform today',
        description: 'Fill in your details to get started',
      },
      showTermsCheckbox: true,
      enableValidation: true,
    },
    {
      id: 'social',
      title: 'Social Login',
      description: 'OAuth providers with email option',
      variant: 'social-login' as const,
      theme: undefined,
      layout: 'centered' as const,
      color: theme.colors.secondary,
      icon: 'share-social-outline',
      features: ['Social providers', 'Centered layout', 'Clean design'],
      content: {
        title: 'Sign In',
        subtitle: 'Choose your preferred method',
        description: 'Connect with your social account or email',
      },
      showSocialLogin: true,
      socialProviders: [
        { name: 'Google', icon: 'logo-google', color: '#4285F4', onPress: () => {} },
        { name: 'Apple', icon: 'logo-apple', color: '#000000', onPress: () => {} },
        { name: 'Facebook', icon: 'logo-facebook', color: '#1877F2', onPress: () => {} },
      ],
    },
    {
      id: 'forgot-password',
      title: 'Forgot Password',
      description: 'Reset password via email or WhatsApp',
      variant: 'forgot-password-email' as const,
      theme: undefined,
      layout: 'centered' as const,
      color: '#FF9500',
      icon: 'key-outline',
      features: ['Email option', 'WhatsApp option'],
      enableValidation: true,
      // Special property to indicate this is a split card
      isSplitCard: true,
      splitOptions: [
        {
          id: 'email',
          title: 'Reset via Email',
          description: 'Send reset link to email',
          icon: 'mail-outline' as const,
        },
        {
          id: 'whatsapp',
          title: 'Reset via WhatsApp',
          description: 'Send code to WhatsApp',
          icon: 'logo-whatsapp' as const,
        }
      ],
    },
    {
      id: 'verification',
      title: 'Verification',
      description: 'Verify account via email or WhatsApp',
      variant: 'verification-email' as const,
      theme: undefined,
      layout: 'centered' as const,
      color: '#6366F1',
      icon: 'shield-checkmark-outline',
      features: ['Email option', 'WhatsApp option'],
      enableValidation: true,
      // Special property to indicate this is a split card
      isSplitCard: true,
      splitOptions: [
        {
          id: 'email',
          title: 'Verify via Email',
          description: 'Send code to email',
          icon: 'mail-outline' as const,
        },
        {
          id: 'whatsapp',
          title: 'Verify via WhatsApp',
          description: 'Send code to WhatsApp',
          icon: 'logo-whatsapp' as const,
        }
      ],
    },
    {
      id: 'account-review',
      title: 'Account Review',
      description: 'Account pending review status screen',
      variant: 'account-review' as const,
      theme: undefined,
      layout: 'centered' as const,
      color: '#FF9500',
      icon: 'time-outline',
      features: ['Status display', 'Support contact', 'Help center link'],
      enableValidation: false,
    },
    {
      id: 'account-suspended',
      title: 'Account Suspended',
      description: 'Account suspension notification screen',
      variant: 'account-suspended' as const,
      theme: undefined,
      layout: 'centered' as const,
      color: '#FF3B30',
      icon: 'ban-outline',
      features: ['Suspension notice', 'Appeal option', 'Guidelines link'],
      enableValidation: false,
    },
    {
      id: 'account-created-successfully',
      title: 'Account Created',
      description: 'Successful account creation welcome screen',
      variant: 'account-created-successfully' as const,
      theme: undefined,
      layout: 'centered' as const,
      color: '#22C55E',
      icon: 'checkmark-circle-outline',
      features: ['Welcome message', 'Success icon', 'Get started'],
      enableValidation: false,
    },
  ];

  const onSectionLayout = (sectionId: string, event: any) => {
    sectionPositions.current[sectionId] = event.nativeEvent.layout.y;
  };

  const scrollToSection = (sectionId: string) => {
    const position = sectionPositions.current[sectionId];
    if (position !== undefined && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: position, animated: true });
    }
  };

  // Demo splash screen handler
  const showDemoSplash = (variantId: string) => {
    const variant = splashVariants.find(v => v.id === variantId);
    if (!variant) return;

    setActiveSplash(variantId);
    setSplashProgress(0);

    // Simulate loading progress for loading variant but don't auto-close
    if (variant.showProgress) {
      const progressInterval = setInterval(() => {
        setSplashProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            // Don't auto-close - user controls with close button
            return 100;
          }
          return prev + 12;
        });
      }, 150);
    }
    // No auto-close - user controls with close button
  };

  // Demo auth screen handler
  const showDemoAuth = (variantId: string, subVariantId?: string) => {
    const variant = authVariants.find(v => v.id === variantId);
    if (!variant) return;

    setActiveAuth(variantId);
    setActiveAuthSubVariant(subVariantId || null);
    // No auto-close - user controls with close button
  };

  // Demo onboarding screen handler
  const showDemoOnboarding = (variantId: string) => {
    setActiveOnboarding(variantId);
    // No auto-close - user controls with close button
  };

  // Demo settings screen handler
  const showDemoSettings = (variantId: string) => {
    setActiveSettings(variantId);
    // No auto-close - user controls with close button
  };

  // Render authentication screen examples
  const renderAuthExamples = () => (
    <Card
      title="Authentication Screen Examples"
      headerIcon="log-in-outline"
      headerSpacing="medium"
      headerBorder
      onLayout={(event) => onSectionLayout('auth', event)}
    >
      <Text variant="caption" style={{ marginBottom: theme.sizes.lg, color: theme.colors.textSecondary }}>
        Complete authentication flows with form validation, social login, and modern designs
      </Text>

      <View style={{ gap: theme.sizes.md }}>
        {/* Grid of Auth Variants */}
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: theme.sizes.sm,
        }}>
          {authVariants.map((auth) => {
            // Handle split card (like forgot password with email/whatsapp)
            if ((auth as any).isSplitCard) {
              return (
                <TouchableOpacity
                  key={auth.id}
                  style={{
                    width: '48%',
                    minHeight: 140,
                    backgroundColor: auth.color,
                    borderRadius: theme.borderRadius.md,
                    overflow: 'hidden',
                  }}
                >
                  {/* Header */}
                  <View style={{ padding: theme.sizes.md }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Icon name={auth.icon as any} size={28} color="#FFFFFF" />
                      <View style={{
                        backgroundColor: '#FFFFFF20',
                        paddingHorizontal: theme.sizes.xs,
                        paddingVertical: 2,
                        borderRadius: theme.borderRadius.xs,
                      }}>
                        <Text style={{ color: '#FFFFFF', fontSize: 8, fontWeight: '600' }}>
                          SPLIT
                        </Text>
                      </View>
                    </View>

                    <Text style={{
                      color: '#FFFFFF',
                      fontWeight: '700',
                      fontSize: 14,
                      marginTop: theme.sizes.sm,
                      marginBottom: 2,
                    }}>
                      {auth.title}
                    </Text>
                    <Text style={{
                      color: '#FFFFFF80',
                      fontSize: 10,
                      lineHeight: 12,
                      marginBottom: theme.sizes.sm,
                    }}>
                      {auth.description}
                    </Text>
                  </View>

                  {/* Split sections - Dynamic based on splitOptions */}
                  <View style={{ flexDirection: 'row', flex: 1 }}>
                    {(auth as any).splitOptions?.map((option, index) => (
                      <React.Fragment key={option.id}>
                        <TouchableOpacity
                          onPress={() => showDemoAuth(auth.id, option.id)}
                          style={{
                            flex: 1,
                            backgroundColor: option.id === 'email' ? '#4285F4' :
                                           option.id === 'phone' ? '#34D399' :
                                           option.id === 'whatsapp' ? '#25D366' : '#6366F1',
                            padding: theme.sizes.sm,
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: 60,
                          }}
                        >
                          <Icon name={option.icon} size={20} color="#FFFFFF" />
                          <Text style={{
                            color: '#FFFFFF',
                            fontSize: 11,
                            fontWeight: '600',
                            marginTop: 4,
                          }}>
                            {option.id === 'email' ? 'Email' :
                             option.id === 'phone' ? 'Phone' :
                             option.id === 'whatsapp' ? 'WhatsApp' : option.title}
                          </Text>
                        </TouchableOpacity>

                        {/* Divider between options */}
                        {index < (auth as any).splitOptions.length - 1 && (
                          <View style={{ width: 1, backgroundColor: '#FFFFFF30' }} />
                        )}
                      </React.Fragment>
                    )) || (
                      // Fallback to old hardcoded layout if no splitOptions
                      <>
                        <TouchableOpacity
                          onPress={() => showDemoAuth(auth.id, 'email')}
                          style={{
                            flex: 1,
                            backgroundColor: '#4285F4',
                            padding: theme.sizes.sm,
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: 60,
                          }}
                        >
                          <Icon name="mail-outline" size={20} color="#FFFFFF" />
                          <Text style={{
                            color: '#FFFFFF',
                            fontSize: 11,
                            fontWeight: '600',
                            marginTop: 4,
                          }}>
                            Email
                          </Text>
                        </TouchableOpacity>

                        <View style={{ width: 1, backgroundColor: '#FFFFFF30' }} />

                        <TouchableOpacity
                          onPress={() => showDemoAuth(auth.id, 'whatsapp')}
                          style={{
                            flex: 1,
                            backgroundColor: '#25D366',
                            padding: theme.sizes.sm,
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: 60,
                          }}
                        >
                          <Icon name="logo-whatsapp" size={20} color="#FFFFFF" />
                          <Text style={{
                            color: '#FFFFFF',
                            fontSize: 11,
                            fontWeight: '600',
                            marginTop: 4,
                          }}>
                            WhatsApp
                          </Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </TouchableOpacity>
              );
            }

            // Regular single variants
            return (
              <TouchableOpacity
                key={auth.id}
                onPress={() => showDemoAuth(auth.id)}
                style={{
                  width: '48%',
                  minHeight: 140,
                  backgroundColor: auth.color,
                  borderRadius: theme.borderRadius.md,
                  padding: theme.sizes.md,
                  justifyContent: 'space-between',
                }}
              >
                {/* Header */}
                <View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Icon name={auth.icon as any} size={28} color="#FFFFFF" />
                    <View style={{
                      backgroundColor: '#FFFFFF20',
                      paddingHorizontal: theme.sizes.xs,
                      paddingVertical: 2,
                      borderRadius: theme.borderRadius.xs,
                    }}>
                      <Text style={{ color: '#FFFFFF', fontSize: 8, fontWeight: '600' }}>
                        {auth.variant.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <Text style={{
                    color: '#FFFFFF',
                    fontWeight: '700',
                    fontSize: 14,
                    marginTop: theme.sizes.sm,
                    marginBottom: 2,
                  }}>
                    {auth.title}
                  </Text>
                  <Text style={{
                    color: '#FFFFFF80',
                    fontSize: 10,
                    lineHeight: 12,
                  }}>
                    {auth.description}
                  </Text>
                </View>

                {/* Features */}
                <View>
                  <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 2,
                    marginTop: theme.sizes.xs,
                    marginBottom: theme.sizes.sm,
                  }}>
                    {auth.features.slice(0, 2).map((feature, index) => (
                      <View
                        key={index}
                        style={{
                          backgroundColor: '#FFFFFF15',
                          paddingHorizontal: 4,
                          paddingVertical: 1,
                          borderRadius: 3,
                        }}
                      >
                        <Text style={{ color: '#FFFFFF', fontSize: 8 }}>{feature}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="play-circle" size={16} color="#FFFFFF" />
                    <Text style={{ color: '#FFFFFF', fontSize: 10, marginLeft: 4 }}>
                      Tap to preview
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

      </View>
    </Card>
  );

  // Render splash screen examples
  const renderSplashExamples = () => (
    <Card
      title="Splash Screen Examples"
      headerIcon="play-outline"
      headerSpacing="medium"
      headerBorder
      onLayout={(event) => onSectionLayout('splash', event)}
    >
      <Text variant="caption" style={{ marginBottom: theme.sizes.lg, color: theme.colors.textSecondary }}>
        Interactive splash screen examples with distinct variants, themes, and features
      </Text>

      <View style={{ gap: theme.sizes.md }}>
        {/* Grid of Splash Variants */}
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: theme.sizes.sm,
        }}>
          {splashVariants.map((splash) => (
            <TouchableOpacity
              key={splash.id}
              onPress={() => showDemoSplash(splash.id)}
              style={{
                width: '48%',
                minHeight: 140,
                backgroundColor: splash.color,
                borderRadius: theme.borderRadius.md,
                padding: theme.sizes.md,
                justifyContent: 'space-between',
              }}
            >
              {/* Header */}
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Icon name={splash.icon as any} size={28} color="#FFFFFF" />
                  <View style={{
                    backgroundColor: '#FFFFFF20',
                    paddingHorizontal: theme.sizes.xs,
                    paddingVertical: 2,
                    borderRadius: theme.borderRadius.xs,
                  }}>
                    <Text style={{ color: '#FFFFFF', fontSize: 8, fontWeight: '600' }}>
                      {splash.variant.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <Text style={{
                  color: '#FFFFFF',
                  fontWeight: '700',
                  fontSize: 14,
                  marginTop: theme.sizes.sm,
                  marginBottom: 2,
                }}>
                  {splash.title}
                </Text>
                <Text style={{
                  color: '#FFFFFF80',
                  fontSize: 10,
                  lineHeight: 12,
                }}>
                  {splash.description}
                </Text>
              </View>

              {/* Features */}
              <View>
                <View style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 2,
                  marginTop: theme.sizes.xs,
                  marginBottom: theme.sizes.sm,
                }}>
                  {splash.features.slice(0, 2).map((feature, index) => (
                    <View
                      key={index}
                      style={{
                        backgroundColor: '#FFFFFF15',
                        paddingHorizontal: 4,
                        paddingVertical: 1,
                        borderRadius: 3,
                      }}
                    >
                      <Text style={{ color: '#FFFFFF', fontSize: 8 }}>{feature}</Text>
                    </View>
                  ))}
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="play-circle" size={16} color="#FFFFFF" />
                  <Text style={{ color: '#FFFFFF', fontSize: 10, marginLeft: 4 }}>
                    Tap to preview
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </View>
    </Card>
  );



  // Define settings screen variants
  const settingsVariants = [
    {
      id: 'default',
      title: 'Settings Screen',
      subtitle: 'Complete settings with all features',
      variant: 'default' as const,
      icon: 'settings-outline' as const,
      color: theme.colors.primary,
      description: 'Full-featured settings with user section, quick actions, and all setting categories',
      features: ['Quick actions', 'All sections', 'Toggle controls']
    }
  ];

  // Render settings examples
  const renderSettingsExamples = () => (
    <Card
      title="Settings Screen Examples"
      headerIcon="settings-outline"
      headerSpacing="medium"
      headerBorder
      onLayout={(event) => onSectionLayout('settings', event)}
    >
      <Text variant="caption" style={{ marginBottom: theme.sizes.lg, color: theme.colors.textSecondary }}>
        Interactive settings screens with user management, preferences, and comprehensive configuration options
      </Text>

      <View style={{ gap: theme.sizes.md }}>
        {/* Grid of Settings Variants */}
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: theme.sizes.sm,
        }}>
          {settingsVariants.map((settings) => (
            <TouchableOpacity
              key={settings.id}
              onPress={() => showDemoSettings(settings.id)}
              style={{
                width: '48%',
                minHeight: 140,
                backgroundColor: theme.colors.surface,
                borderRadius: theme.borderRadius.md,
                borderWidth: 1.5,
                borderColor: theme.colors.border,
                padding: theme.sizes.md,
                justifyContent: 'space-between',
              }}
              activeOpacity={0.7}
            >
              {/* Header */}
              <View>
                <View style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: settings.color + '20',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: theme.sizes.sm,
                }}>
                  <Icon
                    name={settings.icon}
                    size={18}
                    color={settings.color}
                  />
                </View>

                <Text variant="body" style={{
                  fontSize: theme.fontSizes.sm,
                  fontWeight: '700',
                  color: theme.colors.text,
                  marginBottom: 2,
                }}>
                  {settings.title}
                </Text>

                <Text variant="caption" style={{
                  color: theme.colors.textSecondary,
                  fontSize: theme.fontSizes.xs,
                  marginBottom: theme.sizes.sm,
                }}>
                  {settings.subtitle}
                </Text>
              </View>

              {/* Features */}
              <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 4,
              }}>
                {settings.features.slice(0, 2).map((feature, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: settings.color + '15',
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      borderRadius: theme.borderRadius.xs,
                      borderWidth: 0.5,
                      borderColor: settings.color + '30',
                    }}
                  >
                    <Text style={{
                      color: settings.color,
                      fontSize: 9,
                      fontWeight: '600',
                    }}>
                      {feature}
                    </Text>
                  </View>
                ))}
                {settings.features.length > 2 && (
                  <Text style={{
                    color: theme.colors.textSecondary,
                    fontSize: 9,
                    alignSelf: 'center',
                  }}>
                    +{settings.features.length - 2}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Card>
  );

  // Define onboarding variants
  const onboardingVariants = [
    {
      id: 'default',
      title: 'Default Flow',
      subtitle: 'Standard onboarding experience',
      variant: 'default' as const,
      icon: 'rocket-outline' as const,
      color: theme.colors.primary,
      description: 'Classic onboarding with progress dots and smooth animations',
      features: ['4 Welcome slides', 'Progress indicators', 'Skip functionality', 'Smooth transitions']
    },
    {
      id: 'minimal',
      title: 'Minimal Design',
      subtitle: 'Clean and simple approach',
      variant: 'minimal' as const,
      icon: 'layers-outline' as const,
      color: '#6366F1',
      description: 'Streamlined onboarding with progress bar and essential content',
      features: ['3 Quick slides', 'Progress bar', 'Swipe gestures', 'Auto-advance option']
    },
    {
      id: 'feature-rich',
      title: 'Feature Showcase',
      subtitle: 'Comprehensive introduction',
      variant: 'feature-rich' as const,
      icon: 'star-outline' as const,
      color: '#F59E0B',
      description: 'Detailed onboarding highlighting key features and benefits',
      features: ['Feature highlights', 'Interactive elements', 'Custom animations', 'Brand integration']
    }
  ];

  // Render onboarding examples
  const renderOnboardingExamples = () => (
    <Card
      title="Onboarding Screen Examples"
      headerIcon="rocket-outline"
      headerSpacing="medium"
      headerBorder
      onLayout={(event) => onSectionLayout('onboarding', event)}
    >
      <Text variant="caption" style={{ marginBottom: theme.sizes.lg, color: theme.colors.textSecondary }}>
        Interactive onboarding sequences with step indicators, animations, and modern designs
      </Text>

      <View style={{ gap: theme.sizes.md }}>
        {/* Grid of Onboarding Variants */}
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: theme.sizes.sm,
        }}>
          {onboardingVariants.map((onboarding) => (
            <TouchableOpacity
              key={onboarding.id}
              onPress={() => showDemoOnboarding(onboarding.id)}
              style={{
                width: '48%',
                minHeight: 140,
                backgroundColor: theme.colors.surface,
                borderRadius: theme.borderRadius.md,
                borderWidth: 1.5,
                borderColor: theme.colors.border,
                padding: theme.sizes.md,
                justifyContent: 'space-between',
              }}
              activeOpacity={0.7}
            >
              {/* Header */}
              <View>
                <View style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: onboarding.color + '20',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: theme.sizes.sm,
                }}>
                  <Icon
                    name={onboarding.icon}
                    size={18}
                    color={onboarding.color}
                  />
                </View>

                <Text variant="body" style={{
                  fontSize: theme.fontSizes.sm,
                  fontWeight: '700',
                  color: theme.colors.text,
                  marginBottom: 2,
                }}>
                  {onboarding.title}
                </Text>

                <Text variant="caption" style={{
                  color: theme.colors.textSecondary,
                  fontSize: theme.fontSizes.xs,
                  marginBottom: theme.sizes.sm,
                }}>
                  {onboarding.subtitle}
                </Text>
              </View>

              {/* Features */}
              <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 4,
              }}>
                {onboarding.features.slice(0, 2).map((feature, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: onboarding.color + '15',
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      borderRadius: theme.borderRadius.xs,
                      borderWidth: 0.5,
                      borderColor: onboarding.color + '30',
                    }}
                  >
                    <Text style={{
                      color: onboarding.color,
                      fontSize: 9,
                      fontWeight: '600',
                    }}>
                      {feature}
                    </Text>
                  </View>
                ))}
                {onboarding.features.length > 2 && (
                  <Text style={{
                    color: theme.colors.textSecondary,
                    fontSize: 9,
                    alignSelf: 'center',
                  }}>
                    +{onboarding.features.length - 2}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </View>
    </Card>
  );

  // Render quick navigation
  const renderQuickNavigation = () => (
    <Card style={{ marginBottom: theme.sizes.md }}>
      <Text variant="subtitle" style={{ marginBottom: theme.sizes.md, fontWeight: '600' }}>
        Screen Categories
      </Text>

      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.sizes.sm,
      }}>
        {screenCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => {
              setSelectedScreenType(category.id);
              scrollToSection(category.id);
            }}
            style={{
              width: '48%',
              padding: theme.sizes.md,
              backgroundColor: selectedScreenType === category.id ? theme.colors.primary + '20' : theme.colors.background,
              borderRadius: theme.borderRadius.md,
              borderWidth: 1,
              borderColor: selectedScreenType === category.id ? theme.colors.primary : theme.colors.border,
              alignItems: 'center',
            }}
          >
            <Icon
              name={category.icon as any}
              size={24}
              color={selectedScreenType === category.id ? theme.colors.primary : theme.colors.textSecondary}
            />
            <Text
              variant="body"
              style={{
                fontWeight: selectedScreenType === category.id ? '600' : '500',
                color: selectedScreenType === category.id ? theme.colors.primary : theme.colors.text,
                marginTop: theme.sizes.xs,
                textAlign: 'center',
              }}
            >
              {category.title}
            </Text>
            <Text
              variant="caption"
              style={{
                color: theme.colors.textSecondary,
                fontSize: 10,
              }}
            >
              {category.count} examples
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Card>
  );

  return (
    <>
      <Container>
        <ThemeStatusBar />
        <Header
          title="Screen Examples"
          subtitle="Interactive UI screen demonstrations"
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
          {/* Introduction */}
          <Card style={{ marginBottom: theme.sizes.md }}>
            <Text variant="subtitle" style={{ marginBottom: theme.sizes.sm, fontWeight: '600' }}>
              Welcome to Screen Examples
            </Text>
            <Text variant="caption" style={{ color: theme.colors.textSecondary, marginBottom: theme.sizes.md }}>
              Explore interactive examples of complete screen layouts built with our UI components.
              Each example demonstrates real-world usage patterns and best practices.
            </Text>
            <View style={{ flexDirection: 'row', gap: theme.sizes.sm }}>
              <Button
                title="Explore Components"
                variant="primary"
                size="small"
                rightIcon="arrow-forward-outline"
                onPress={() => Alert.alert('Navigation', 'Navigate to Components tab')}
              />
            </View>
          </Card>

          {renderQuickNavigation()}
          {renderSplashExamples()}
          {renderAuthExamples()}
          {renderOnboardingExamples()}
          {renderSettingsExamples()}
        </ScrollView>
      </Container>

      {/* Demo Splash Screen Overlay - Rendered Outside Container */}
      {activeSplash && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
        }}>
          {/* Floating Close Button */}
          {renderCloseButton(() => setActiveSplash(null), 999999999)}

          <SplashScreen
          {...(() => {
            const selectedVariant = splashVariants.find(v => v.id === activeSplash);
            if (!selectedVariant) return {};

            return {
              variant: selectedVariant.variant,
              theme: selectedVariant.theme,
              layout: selectedVariant.layout,
              content: selectedVariant.content,
              showProgress: selectedVariant.showProgress,
              progress: splashProgress,
              showPercentage: selectedVariant.showPercentage,
              progressMessage: selectedVariant.progressMessage,
              autoHide: false, // Override auto-hide for demo
              autoHideDelay: 0, // Override auto-hide delay
              enableAnimations: selectedVariant.enableAnimations,
              animationDuration: selectedVariant.animationDuration,
              backgroundColor: selectedVariant.backgroundColor,
              textColor: selectedVariant.textColor,
              gradientColors: selectedVariant.gradientColors,
              actions: selectedVariant.actions,
              showSkipButton: selectedVariant.showSkipButton,
              skipButtonText: selectedVariant.skipButtonText,
              onSkip: () => setActiveSplash(null),
              logoSource: (() => {
                // Use white logo for dark backgrounds or colored themes
                if (selectedVariant.theme === 'dark' ||
                    selectedVariant.theme === 'gradient' ||
                    selectedVariant.theme === 'branded' ||
                    selectedVariant.backgroundColor) {
                  return require('../../assets/logo-white.png');
                }
                // Use grey logo for custom themes
                if (selectedVariant.theme === 'custom') {
                  return require('../../assets/logo-grey.png');
                }
                // Use regular logo for light themes
                return require('../../assets/logo.png');
              })(),
              logoSize: 100,
            };
          })()}
          />
        </View>
      )}

      {/* Demo Auth Screen Overlay */}
      {activeAuth && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
        }}>
          {/* Floating Close Button */}
          {renderCloseButton(() => {
            setActiveAuth(null);
            setActiveAuthSubVariant(null);
          }, 1001)}

          <AuthScreen
          {...(() => {
            const selectedVariant = authVariants.find(v => v.id === activeAuth);
            if (!selectedVariant) return {};

            // Handle split card (like email/whatsapp options for forgot password)
            let actualVariant = selectedVariant.variant;
            let actualContact = selectedVariant.verificationContact;

            if ((selectedVariant as any).isSplitCard && activeAuthSubVariant) {
              // Set variant and contact based on sub-variant selection
              if (selectedVariant.id === 'login') {
                if (activeAuthSubVariant === 'email') {
                  actualVariant = 'login-email';
                } else if (activeAuthSubVariant === 'phone') {
                  actualVariant = 'login-phone';
                }
              } else if (selectedVariant.id === 'forgot-password') {
                if (activeAuthSubVariant === 'email') {
                  actualVariant = 'forgot-password-email';
                  actualContact = 'john.doe@example.com';
                } else if (activeAuthSubVariant === 'whatsapp') {
                  actualVariant = 'forgot-password-whatsapp';
                  actualContact = '+1234567890';
                }
              } else if (selectedVariant.id === 'verification') {
                if (activeAuthSubVariant === 'email') {
                  actualVariant = 'verification-email';
                  actualContact = 'john.doe@example.com';
                } else if (activeAuthSubVariant === 'whatsapp') {
                  actualVariant = 'verification-whatsapp';
                  actualContact = '+1234567890';
                }
              }
            }

            // Debug logging removed

            // Create base props object with variant-specific handling
            const baseProps = {
              variant: actualVariant,
              layout: selectedVariant.layout,
              showBackButton: true,
              onBackPress: () => {
                Alert.alert('Back Button', 'This would navigate back to previous screen');
              },
              showRememberMe: selectedVariant.showRememberMe,
              showForgotPassword: selectedVariant.showForgotPassword,
              showTermsCheckbox: selectedVariant.showTermsCheckbox,
              enableValidation: selectedVariant.enableValidation,
              verificationContact: actualContact,
              topLeftLogoSize: 44,
            };

            // Handle variant-specific props
            if (actualVariant === 'login-phone') {
              // Phone login specific props
              baseProps.showSocialLogin = false; // Phone login typically doesn't show social options
              baseProps.socialProviders = [];
              baseProps.enableBiometric = true; // Phone users often prefer biometric login
              baseProps.showRememberMe = true; // Keep remember me for phone login
              baseProps.showTopLeftLogo = false; // Remove top-left logo since we have large center logo
            } else if (actualVariant === 'login-email') {
              // Email login specific props
              baseProps.showSocialLogin = selectedVariant.showSocialLogin;
              baseProps.socialProviders = selectedVariant.socialProviders;
              baseProps.enableBiometric = false; // Email login uses traditional methods
              baseProps.showRememberMe = selectedVariant.showRememberMe;
              baseProps.showTopLeftLogo = false; // Remove top-left logo since we have large center logo
            } else {
              // For other variants, use default values
              baseProps.showSocialLogin = selectedVariant.showSocialLogin;
              baseProps.socialProviders = selectedVariant.socialProviders;
              baseProps.enableBiometric = false;
              baseProps.showTopLeftLogo = true; // Keep top-left logo for other screens
            }

            // Add theme if specified
            if (selectedVariant.theme) {
              baseProps.theme = selectedVariant.theme;
            }

            // Add content only for non-split cards
            if (!selectedVariant.isSplitCard) {
              baseProps.content = selectedVariant.content;
            }

            // Add gradient colors if specified
            if (selectedVariant.gradientColors) {
              baseProps.gradientColors = selectedVariant.gradientColors;
            }

            // Smart logo selection for top-left
            baseProps.topLeftLogoSource = (() => {
              if (selectedVariant.theme === 'dark' || selectedVariant.theme === 'gradient') {
                try {
                  return require('../../assets/logo-white.png');
                } catch {
                  return require('../../assets/logo.png');
                }
              }
              return require('../../assets/logo.png');
            })();

            // Add center logo with different sizes for different screen types
            const shouldShowCenterLogo = !['register'].includes(actualVariant); // Show logo for all except register
            if (shouldShowCenterLogo) {
              // Make login screens have larger logos
              const isLoginScreen = ['login-email', 'login-phone'].includes(actualVariant);

              if (isLoginScreen) {
                // For login screens, use actual app logo (larger and more prominent)
                const logoSource = (() => {
                  if (selectedVariant.theme === 'dark' || selectedVariant.theme === 'gradient') {
                    try {
                      return require('../../assets/logo-white.png');
                    } catch {
                      return require('../../assets/logo.png');
                    }
                  }
                  return require('../../assets/logo.png');
                })();

                baseProps.logo = (
                  <View style={{
                    alignItems: 'center',
                    marginBottom: theme.sizes.sm,
                  }}>
                    <Image
                      source={logoSource}
                      style={{
                        width: 140,
                        height: 140,
                        resizeMode: 'contain',
                      }}
                    />
                  </View>
                );
              } else {
                // For other screens, use icon-based logo (original size)
                const logoSize = 80;
                const iconSize = 40;
                const borderRadius = logoSize / 2;

                baseProps.logo = (
                  <View style={{
                    width: logoSize,
                    height: logoSize,
                    backgroundColor: selectedVariant.theme === 'gradient' ? '#FFFFFF20' : selectedVariant.color + '20',
                    borderRadius: borderRadius,
                    borderWidth: 2,
                    borderColor: selectedVariant.theme === 'gradient' ? '#FFFFFF40' : selectedVariant.color + '40',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <Icon
                      name={selectedVariant.icon as any}
                      size={iconSize}
                      color={selectedVariant.theme === 'gradient' ? '#FFFFFF' : selectedVariant.color}
                    />
                  </View>
                );
              }
            }

            // Add variant-specific event handlers
            baseProps.onSubmit = async (data) => {
              const loginType = actualVariant === 'login-phone' ? 'Phone' : 'Email';
              Alert.alert(`${loginType} Login`, JSON.stringify(data, null, 2));
            };

            baseProps.onSecondaryAction = () => {
              Alert.alert('Secondary Action', 'This would navigate to another screen');
            };

            baseProps.onForgotPassword = () => {
              Alert.alert('Forgot Password', 'This would open forgot password flow');
            };

            baseProps.onFooterLinkPress = () => {
              Alert.alert('Footer Link', 'This would navigate to signup/signin');
            };

            // Add biometric handler for phone login
            if (actualVariant === 'login-phone') {
              baseProps.onBiometricLogin = async () => {
                Alert.alert('Biometric Login', 'This would authenticate using biometrics (Face ID/Touch ID)');
              };
            }

            return baseProps;
          })()}
          />
        </View>
      )}

      {/* Demo Onboarding Screen Overlay */}
      {activeOnboarding && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
        }}>
          {renderCloseButton(() => setActiveOnboarding(null), 1002)}
          <OnboardingScreen
            slides={(() => {
              switch (activeOnboarding) {
                case 'minimal':
                  return [
                    {
                      id: 'welcome',
                      title: 'Welcome',
                      description: 'Start your journey with our minimal onboarding experience.',
                      icon: 'rocket-outline' as any,
                      animation: 'fadeIn' as any,
                    },
                    {
                      id: 'features',
                      title: 'Discover Features',
                      description: 'Explore powerful tools designed for productivity.',
                      icon: 'layers-outline' as any,
                      animation: 'slideUp' as any,
                    },
                    {
                      id: 'ready',
                      title: 'Ready to Go',
                      description: 'You\'re all set to start using our app!',
                      icon: 'checkmark-circle-outline' as any,
                      animation: 'scale' as any,
                    }
                  ];
                case 'feature-rich':
                  return [
                    {
                      id: 'welcome',
                      title: 'Welcome to the Future',
                      subtitle: 'Innovation at your fingertips',
                      description: 'Experience cutting-edge features designed to revolutionize your workflow and boost productivity.',
                      icon: 'rocket-outline' as any,
                      animation: 'fadeIn' as any,
                      features: ['Modern Design', 'Advanced Analytics', 'Real-time Sync']
                    },
                    {
                      id: 'customize',
                      title: 'Personalize Everything',
                      subtitle: 'Make it truly yours',
                      description: 'Customize themes, layouts, and preferences to create the perfect experience tailored to your needs.',
                      icon: 'color-palette-outline' as any,
                      animation: 'slideUp' as any,
                      features: ['Custom Themes', 'Layout Options', 'Personal Settings']
                    },
                    {
                      id: 'collaborate',
                      title: 'Collaborate Seamlessly',
                      subtitle: 'Together we achieve more',
                      description: 'Connect with your team and collaborate in real-time with powerful sharing and communication tools.',
                      icon: 'people-outline' as any,
                      animation: 'scale' as any,
                      features: ['Team Workspaces', 'Real-time Chat', 'File Sharing']
                    },
                    {
                      id: 'ready',
                      title: 'Ready to Transform',
                      subtitle: 'Your journey begins now',
                      description: 'You\'re equipped with everything needed to excel. Start creating amazing things today!',
                      icon: 'star-outline' as any,
                      animation: 'bounce' as any,
                      features: ['24/7 Support', 'Regular Updates', 'Community Access']
                    }
                  ];
                default:
                  return [
                    {
                      id: 'welcome',
                      title: 'Get Started',
                      description: 'Welcome to our application. Let\'s help you get set up quickly.',
                      icon: 'home-outline' as any,
                      animation: 'fadeIn' as any,
                      features: ['Quick Setup', 'Easy to Use']
                    },
                    {
                      id: 'explore',
                      title: 'Explore',
                      description: 'Discover what you can do with our simple and intuitive interface.',
                      icon: 'compass-outline' as any,
                      animation: 'slideUp' as any,
                      features: ['Intuitive Design', 'User Friendly']
                    },
                    {
                      id: 'start',
                      title: 'All Set!',
                      description: 'You\'re ready to start using the app. Enjoy your experience!',
                      icon: 'checkmark-circle-outline' as any,
                      animation: 'scale' as any,
                      features: ['Ready to Go', 'Start Now']
                    }
                  ];
              }
            })()}
            showSkipButton={true}
            showProgressDots={activeOnboarding !== 'minimal'}
            showProgressBar={activeOnboarding === 'minimal'}
            enableSwipeGestures={true}
            enableAnimations={true}
            onComplete={() => {
              Alert.alert('Onboarding Complete', 'User would be navigated to main app');
              setActiveOnboarding(null);
            }}
            onSkip={() => {
              Alert.alert('Onboarding Skipped', 'User chose to skip onboarding');
              setActiveOnboarding(null);
            }}
            onSlideChange={(index) => {
              // Track slide changes for analytics
            }}
          />
        </View>
      )}

      {/* Demo Settings Screen Overlay */}
      {activeSettings && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
        }}>
          {renderCloseButton(() => setActiveSettings(null), 1004)}
          <SettingsScreen
            layout="default"
            theme="auto"
            showUserSection={true}
            showQuickActions={true}
            showSearchBar={true}
            enableRefresh={true}
            onUserPress={() => Alert.alert('User Settings', 'This would navigate to user settings')}
            onSearchPress={() => Alert.alert('Search Settings', 'This would open settings search')}
            onLogout={() => Alert.alert('Sign Out', 'This would sign out the user')}
            onDeleteAccount={() => Alert.alert('Delete Account', 'This would start account deletion process')}
          />
        </View>
      )}
    </>
  );
}