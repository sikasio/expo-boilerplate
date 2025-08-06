export const APP_CONFIG = {
  APP_NAME: 'Expo Boilerplate',
  VERSION: '1.0.0',
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com',
  WEB_URL: process.env.EXPO_PUBLIC_WEB_URL || 'https://example.com',
} as const;

export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  background: '#F2F2F7',
  surface: '#FFFFFF',
  text: '#000000',
  textSecondary: '#8E8E93',
  border: '#C6C6C8',
  placeholder: '#C7C7CD',
} as const;

export const DARK_COLORS = {
  primary: '#0A84FF',
  secondary: '#5E5CE6',
  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF453A',
  background: '#000000',
  surface: '#1C1C1E',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  border: '#38383A',
  placeholder: '#48484A',
} as const;

export const COLOR_SCHEMES = {
  blue: { 
    light: { primary: '#007AFF', secondary: '#5856D6' }, 
    dark: { primary: '#0A84FF', secondary: '#5E5CE6' } 
  },
  green: { 
    light: { primary: '#34C759', secondary: '#32ADE6' }, 
    dark: { primary: '#30D158', secondary: '#64D2FF' } 
  },
  purple: { 
    light: { primary: '#AF52DE', secondary: '#007AFF' }, 
    dark: { primary: '#BF5AF2', secondary: '#0A84FF' } 
  },
  orange: { 
    light: { primary: '#FF9500', secondary: '#FF3B30' }, 
    dark: { primary: '#FF9F0A', secondary: '#FF453A' } 
  },
  red: { 
    light: { primary: '#FF3B30', secondary: '#FF9500' }, 
    dark: { primary: '#FF453A', secondary: '#FF9F0A' } 
  },
  teal: { 
    light: { primary: '#5AC8FA', secondary: '#34C759' }, 
    dark: { primary: '#64D2FF', secondary: '#30D158' } 
  },
} as const;

export const SIZES = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BORDER_RADIUS = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  full: 9999,
} as const;

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const STORAGE_KEYS = {
  USER_TOKEN: 'app_user_token',
  USER_DATA: 'app_user_data',
  THEME: 'app_theme',
  COLOR_SCHEME: 'app_color_scheme',
  LANGUAGE: 'app_language',
  ONBOARDING_COMPLETED: 'app_onboarding_completed',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    CHANGE_PASSWORD: '/user/change-password',
  },
} as const;

export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 500,
} as const;