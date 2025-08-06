/**
 * General Application Configuration
 * 
 * This file contains global app settings and constants
 * that are used throughout the application.
 */

export const AppConfig = {
  // App Identity
  name: 'Ignite',
  displayName: 'Ignite',
  version: '1.0.0',
  
  // App Description
  description: 'Production-ready React Native starter',
  tagline: 'Scale your project with our comprehensive starter kit',
  
  // App URLs & Links
  website: 'https://igniteapp.com',
  supportEmail: 'support@igniteapp.com',
  privacyPolicyUrl: 'https://igniteapp.com/privacy',
  termsOfServiceUrl: 'https://igniteapp.com/terms',
  
  // Social Links
  social: {
    twitter: 'https://twitter.com/igniteapp',
    github: 'https://github.com/igniteapp',
    linkedin: 'https://linkedin.com/company/igniteapp',
  },
  
  // App Store Links
  stores: {
    ios: 'https://apps.apple.com/app/ignite',
    android: 'https://play.google.com/store/apps/details?id=com.igniteapp',
  },
  
  // Feature Flags
  features: {
    analytics: true,
    crashReporting: true,
    pushNotifications: true,
    biometricAuth: true,
    darkMode: true,
  },
  
  // API Configuration
  api: {
    baseUrl: __DEV__ ? 'https://dev-api.igniteapp.com' : 'https://api.igniteapp.com',
    timeout: 10000,
    retryAttempts: 3,
  },
  
  // Auth Configuration
  auth: {
    tokenStorageKey: 'ignite_auth_token',
    refreshTokenStorageKey: 'ignite_refresh_token',
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours in ms
  },
  
  // Storage Keys
  storage: {
    theme: 'ignite_theme',
    language: 'ignite_language',
    onboardingCompleted: 'ignite_onboarding_completed',
    notificationSettings: 'ignite_notifications',
  },
  
  // Default Settings
  defaults: {
    theme: 'light' as const,
    language: 'en',
    notifications: {
      push: true,
      email: true,
      marketing: false,
    },
  },
  
  // Copyright & Legal
  copyright: `© ${new Date().getFullYear()} Ignite. All rights reserved.`,
  
  // Development
  dev: {
    enableFlipperIntegration: __DEV__,
    enableReduxDevTools: __DEV__,
    logLevel: __DEV__ ? 'debug' : 'error',
  },
} as const;

// Type exports for better TypeScript support
export type AppConfigType = typeof AppConfig;
export type ThemeType = typeof AppConfig.defaults.theme;
export type LanguageType = typeof AppConfig.defaults.language;

// Utility functions
export const getAppName = () => AppConfig.name;
export const getAppVersion = () => AppConfig.version;
export const getAppDescription = () => AppConfig.description;
export const getSupportEmail = () => AppConfig.supportEmail;
export const getCopyright = () => AppConfig.copyright;

export default AppConfig;