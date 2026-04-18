import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  ViewStyle,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  StatusBar,
  ImageBackground,
  ImageSourcePropType,
  Animated,
  Easing,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { useTheme } from '../contexts/ThemeContext';
import { useRTL } from '../contexts/RTLContext';
import { getFlexDirection, getTextAlign } from '../utils';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { TextInput } from '../components/forms/TextInput';
import { OTPInput } from '../components/forms/OTPInput';
import { Card } from '../components/ui/Card';
import { Icon, IconName } from '../components/ui/Icon';
import { Avatar } from '../components/ui/Avatar';
import { Checkbox } from '../components/ui/Checkbox';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Function to mask contact information (show last 3 digits)
const maskContact = (contact: string): string => {
  if (!contact || contact.length < 4) return contact;

  // For email addresses
  if (contact.includes('@')) {
    const [localPart, domain] = contact.split('@');
    if (localPart.length <= 3) {
      return `***@${domain}`;
    }
    const maskedLocal = '***' + localPart.slice(-3);
    return `${maskedLocal}@${domain}`;
  }

  // For phone numbers
  const cleanContact = contact.replace(/[^\d]/g, ''); // Remove non-digits
  if (cleanContact.length <= 3) {
    return '***' + cleanContact;
  }
  return '***' + cleanContact.slice(-3);
};

// Function to get last 3 characters for "ends with" format
const getLastThreeChars = (contact: string): string => {
  if (!contact) return '';

  // For email addresses, get last 3 characters before @
  if (contact.includes('@')) {
    const [localPart] = contact.split('@');
    return localPart.slice(-3);
  }

  // For phone numbers, get last 3 digits
  const cleanContact = contact.replace(/[^\d]/g, '');
  return cleanContact.slice(-3);
};

export type AuthScreenVariant = 'login-email' | 'login-phone' | 'register' | 'forgot-password' | 'forgot-password-email' | 'forgot-password-whatsapp' | 'reset-password' | 'social-login' | 'verification' | 'verification-email' | 'verification-whatsapp' | 'account-review' | 'account-suspended' | 'account-created-successfully';
export type AuthScreenLayout = 'default' | 'split' | 'centered' | 'minimal' | 'card' | 'fullscreen';
export type AuthScreenTheme = 'light' | 'dark' | 'gradient' | 'branded' | 'glassmorphism' | 'custom';

interface SocialProvider {
  name: string;
  icon: IconName;
  color: string;
  onPress: () => void;
}

interface AuthFormData {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  phone?: string;
  code?: string;
  rememberMe?: boolean;
  agreeToTerms?: boolean;
}

interface AuthScreenContent {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  footerText?: string;
  footerLinkText?: string;
}

interface AuthInputLabels {
  nameLabel?: string;
  namePlaceholder?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  phoneLabel?: string;
  phonePlaceholder?: string;
  phoneHelperText?: string;
  passwordLabel?: string;
  passwordPlaceholder?: string;
  confirmPasswordLabel?: string;
  confirmPasswordPlaceholder?: string;
  verificationCodeLabel?: string;
  rememberMeLabel?: string;
  termsLabel?: string;
  forgotPasswordLabel?: string;
  biometricLabel?: string;
  continueWithLabel?: string;
}

export interface AuthScreenProps {
  variant?: AuthScreenVariant;
  layout?: AuthScreenLayout;
  theme?: AuthScreenTheme;

  // Navigation
  showBackButton?: boolean;
  onBackPress?: () => void;

  // Content
  content?: AuthScreenContent;
  inputLabels?: AuthInputLabels;
  logo?: React.ReactNode;
  logoSource?: ImageSourcePropType;
  logoSize?: number;
  showTopLeftLogo?: boolean;
  topLeftLogoSource?: ImageSourcePropType;
  topLeftLogoSize?: number;
  backgroundImage?: ImageSourcePropType;

  // Social Authentication
  socialProviders?: SocialProvider[];
  showSocialLogin?: boolean;
  socialLoginTitle?: string;
  socialLoginPosition?: 'top' | 'bottom'; // Position of social login buttons (default: 'bottom')

  // Form Configuration
  primaryButtonVariant?: 'primary' | 'secondary' | 'outline' | 'ghost'; // Variant for primary button (default: 'primary')
  showRememberMe?: boolean;
  showForgotPassword?: boolean;
  showTermsCheckbox?: boolean;
  termsUrl?: string; // URL to open when terms text is clicked
  onTermsPress?: () => void; // Custom handler for terms press (overrides default URL opening)
  termsLinkText?: string; // The clickable part of the terms text (defaults to last part of termsLabel)
  termsPrefix?: string; // Text before the link (defaults to first part of termsLabel)
  enableBiometric?: boolean;

  // Conditional Input Visibility
  conditionalInputs?: {
    // Hide phone input until email is valid
    hidePhoneUntilValidEmail?: boolean;
    // Hide confirm password until password has minimum length
    hideConfirmPasswordUntilMinLength?: number; // e.g., 3 for 3 characters
    // Custom conditions for any field
    customConditions?: {
      [fieldName: string]: (formData: AuthFormData) => boolean;
    };
  };

  // Verification Configuration
  verificationContact?: string; // Phone number or email for verification

  // Validation
  enableValidation?: boolean;
  customValidation?: (data: AuthFormData) => { [key: string]: string } | null;
  registrationFieldRequirements?: {
    emailRequired?: boolean; // Default: true - Set false to make email optional
    phoneRequired?: boolean; // Default: false - Set true to make phone required
  };

  // Loading States
  isLoading?: boolean;
  loadingText?: string;
  fullScreenLoading?: boolean; // Show full-screen overlay during loading (e.g., social login)

  // Form Data
  initialValues?: Partial<AuthFormData>;

  // Callbacks
  onSubmit?: (data: AuthFormData) => Promise<void> | void;
  onSocialLogin?: (provider: string) => Promise<void> | void;
  onForgotPassword?: () => void;
  onSecondaryAction?: () => void;
  onFooterLinkPress?: () => void;
  onBiometricLogin?: () => Promise<void> | void;

  // Customization
  backgroundColor?: string;
  gradientColors?: [string, string];
  overlayOpacity?: number;
  borderRadius?: number;

  // Animation
  enableAnimations?: boolean;
  animationDuration?: number;

  // Accessibility
  testID?: string;
  accessible?: boolean;

  // Custom Fields
  customFields?: React.ReactNode; // Additional custom form fields to insert after standard fields

  // Style overrides
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  formStyle?: ViewStyle;
}

export function AuthScreen({
  variant = 'login',
  layout = 'default',
  theme: authTheme,
  showBackButton = false,
  onBackPress,
  content = {},
  inputLabels = {},
  logo,
  logoSource,
  logoSize = 80,
  showTopLeftLogo = true,
  topLeftLogoSource,
  topLeftLogoSize = 48,
  backgroundImage,
  socialProviders = [],
  showSocialLogin = false,
  socialLoginTitle = 'Or continue with',
  socialLoginPosition = 'bottom',
  primaryButtonVariant = 'primary',
  showRememberMe = true,
  showForgotPassword = true,
  showTermsCheckbox = false,
  termsUrl,
  onTermsPress,
  termsLinkText,
  termsPrefix,
  enableBiometric = false,
  conditionalInputs,
  verificationContact,
  enableValidation = true,
  customValidation,
  registrationFieldRequirements,
  initialValues = {},
  isLoading = false,
  loadingText = 'Please wait...',
  fullScreenLoading = false,
  onSubmit,
  onSocialLogin,
  onForgotPassword,
  onSecondaryAction,
  onFooterLinkPress,
  onBiometricLogin,
  backgroundColor,
  gradientColors,
  overlayOpacity = 0.3,
  borderRadius,
  enableAnimations = true,
  animationDuration = 600,
  testID,
  accessible = true,
  customFields,
  style,
  contentStyle,
  formStyle,
}: AuthScreenProps) {
  const { theme } = useTheme();
  const { isRTL } = useRTL();
  const insets = useSafeAreaInsets();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // Form state
  const { control, handleSubmit, watch, formState: { errors }, reset } = useForm<AuthFormData>({
    defaultValues: initialValues
  });
  const [rememberMe, setRememberMe] = useState(initialValues?.rememberMe || false);
  const [agreeToTerms, setAgreeToTerms] = useState(initialValues?.agreeToTerms || false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Watch form values for conditional input visibility
  const watchedEmail = watch('email');
  const watchedPassword = watch('password');

  // Helper functions for conditional input visibility
  const isEmailValid = (email: string): boolean => {
    if (!email) return false;
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const shouldShowPhoneInput = (): boolean => {
    if (!conditionalInputs?.hidePhoneUntilValidEmail) {
      return true; // Show by default if condition not enabled
    }
    return isEmailValid(watchedEmail || '');
  };

  const shouldShowConfirmPasswordInput = (): boolean => {
    if (!conditionalInputs?.hideConfirmPasswordUntilMinLength) {
      return true; // Show by default if condition not enabled
    }
    const minLength = conditionalInputs.hideConfirmPasswordUntilMinLength;
    return (watchedPassword || '').length >= minLength;
  };

  const shouldShowCustomField = (fieldName: string): boolean => {
    const customCondition = conditionalInputs?.customConditions?.[fieldName];
    if (!customCondition) {
      return true; // Show by default if no custom condition
    }
    return customCondition({
      email: watchedEmail,
      password: watchedPassword,
      confirmPassword: watch('confirmPassword'),
      name: watch('name'),
      phone: watch('phone'),
      code: watch('code'),
      rememberMe,
      agreeToTerms,
    });
  };

  // Start animations on mount
  React.useEffect(() => {
    if (enableAnimations) {
      // Simple, consistent animation for all screen types
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          delay: 50,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 450,
          delay: 100,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Set final values immediately if animations disabled
      fadeAnim.setValue(1);
      slideAnim.setValue(0);
      scaleAnim.setValue(1);
    }
  }, []);

  // Don't use useEffect to reset form - it causes infinite loops
  // The form will use the defaultValues from useForm initialization

  // Get default content based on variant
  const getDefaultContent = (): AuthScreenContent => {
    switch (variant) {
      case 'login-email':
        return {
          title: 'Welcome Back',
          subtitle: 'Sign in with your email',
          primaryButtonText: 'Sign In with Email',
          footerText: "Don't have an account?",
          footerLinkText: 'Sign Up',
        };
      case 'login-phone':
        return {
          title: 'Welcome Back',
          subtitle: 'Sign in with your phone number',
          primaryButtonText: 'Sign In with Phone',
          footerText: "Don't have an account?",
          footerLinkText: 'Sign Up',
        };
      case 'register':
        return {
          title: 'Create Account',
          subtitle: 'Join us today',
          primaryButtonText: 'Create Account',
          footerText: 'Already have an account?',
          footerLinkText: 'Sign In',
        };
      case 'forgot-password':
        return {
          title: 'Forgot Password',
          subtitle: 'Enter your email to reset password',
          primaryButtonText: 'Send Reset Link',
          secondaryButtonText: 'Back to Login',
          footerText: 'Remember your password?',
          footerLinkText: 'Sign In',
        };
      case 'reset-password':
        return {
          title: 'Reset Password',
          subtitle: 'Enter your new password',
          primaryButtonText: 'Reset Password',
          secondaryButtonText: 'Back to Login',
        };
      case 'forgot-password-email':
        return {
          title: 'Forgot Password',
          subtitle: 'Reset via Email',
          description: 'Enter your email address to receive a password reset link',
          primaryButtonText: 'Send Reset Link',
          secondaryButtonText: 'Back to Login',
          footerText: 'Remember your password?',
          footerLinkText: 'Sign In',
        };
      case 'forgot-password-whatsapp':
        return {
          title: 'Forgot Password',
          subtitle: 'Reset via WhatsApp',
          description: 'Enter your WhatsApp number to receive a password reset code',
          primaryButtonText: 'Send Reset Code',
          secondaryButtonText: 'Back to Login',
          footerText: 'Remember your password?',
          footerLinkText: 'Sign In',
        };
      case 'verification':
        return {
          title: 'Verify Account',
          subtitle: 'Enter the verification code',
          description: 'We sent a 6-digit code to you',
          primaryButtonText: 'Verify',
          secondaryButtonText: 'Resend Code',
        };
      case 'verification-email':
        return {
          title: 'Email Verification',
          subtitle: 'Check your email',
          description: verificationContact
            ? `We sent a 6-digit verification code to ${verificationContact}`
            : 'We sent a 6-digit verification code to your email address',
          primaryButtonText: 'Verify Email',
          secondaryButtonText: 'Resend Code',
        };
      case 'verification-whatsapp':
        return {
          title: 'WhatsApp Verification',
          subtitle: 'Check your WhatsApp',
          description: verificationContact
            ? `We sent a 6-digit verification code to your WhatsApp number ends with ***${getLastThreeChars(verificationContact)}`
            : 'We sent a 6-digit verification code to your WhatsApp number',
          primaryButtonText: 'Verify Number',
          secondaryButtonText: 'Resend Code',
        };
      case 'social-login':
        return {
          title: 'Welcome',
          subtitle: 'Choose your preferred sign-in method',
          primaryButtonText: 'Continue',
        };
      case 'account-review':
        return {
          title: 'Account Under Review',
          subtitle: 'Your account is being reviewed',
          description: 'We are currently reviewing your account information. This process usually takes 1-3 business days. You will receive an email notification once the review is complete.',
          primaryButtonText: 'Check Status',
          secondaryButtonText: 'Contact Support',
          footerText: 'Questions about the review?',
          footerLinkText: 'Help Center',
        };
      case 'account-suspended':
        return {
          title: 'Account Suspended',
          subtitle: 'Your account has been temporarily suspended',
          description: 'Your account has been suspended due to a violation of our terms of service. Please contact our support team to resolve this issue and restore your account access.',
          primaryButtonText: 'Appeal Suspension',
          secondaryButtonText: 'Contact Support',
          footerText: 'Need help understanding why?',
          footerLinkText: 'Community Guidelines',
        };
      case 'account-created-successfully':
        return {
          title: '🎉 Welcome Aboard!',
          subtitle: 'Your account is ready to go',
          description: 'Congratulations! You\'ve successfully joined our community. Everything is set up and ready for you to start your amazing journey with us.',
          primaryButtonText: 'Start Exploring',
          secondaryButtonText: 'View Profile',
          footerText: 'Need help getting started?',
          footerLinkText: 'User Guide',
        };
      default:
        return content;
    }
  };

  const finalContent = { ...getDefaultContent(), ...content };

  // Get theme colors - prioritize global theme for better consistency
  const getThemeColors = () => {
    // Always use global theme colors as the base, unless specifically overridden
    const baseColors = {
      background: theme.colors.background,
      surface: theme.colors.surface,
      text: theme.colors.text,
      textSecondary: theme.colors.textSecondary,
      border: theme.colors.border,
      primary: theme.colors.primary,
    };

    // Only override when authTheme is explicitly set to something specific
    switch (authTheme) {
      case 'light':
        return {
          background: '#FFFFFF',
          surface: '#F8F9FA',
          text: '#1A1A1A',
          textSecondary: '#6C757D',
          border: '#E9ECEF',
          primary: theme.colors.primary,
        };
      case 'dark':
        return {
          background: '#1A1A1A',
          surface: '#2D2D2D',
          text: '#FFFFFF',
          textSecondary: '#AAAAAA',
          border: '#404040',
          primary: theme.colors.primary,
        };
      case 'gradient':
        return {
          background: 'transparent',
          surface: theme.isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.1)',
          text: '#FFFFFF',
          textSecondary: '#E0E0E0',
          border: 'rgba(255, 255, 255, 0.2)',
          primary: '#FFFFFF',
        };
      case 'branded':
        return {
          background: theme.colors.primary,
          surface: theme.isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.95)',
          text: '#FFFFFF',
          textSecondary: 'rgba(255, 255, 255, 0.8)',
          border: 'rgba(255, 255, 255, 0.3)',
          primary: '#FFFFFF',
        };
      case 'glassmorphism':
        return {
          background: 'transparent',
          surface: theme.isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.15)',
          text: '#FFFFFF',
          textSecondary: 'rgba(255, 255, 255, 0.8)',
          border: 'rgba(255, 255, 255, 0.2)',
          primary: '#FFFFFF',
        };
      case 'custom':
        return {
          ...baseColors,
          background: backgroundColor || baseColors.background,
        };
      default:
        // Use global theme colors for default/unspecified theme
        return baseColors;
    }
  };

  const colors = getThemeColors();

  // Validation rules
  const getValidationRules = (field: keyof AuthFormData) => {
    if (!enableValidation) return {};

    const rules: any = {};

    switch (field) {
      case 'email':
        // Check if email should be required for registration
        const isEmailRequiredForReg = registrationFieldRequirements?.emailRequired !== false; // Default: true
        const isEmailOptional = variant === 'register' && !isEmailRequiredForReg;

        if (!isEmailOptional) {
          rules.required = 'Email is required';
        }
        // Only validate pattern if email is provided
        rules.validate = (value: string) => {
          if (!value || value.trim() === '') {
            // If email is empty and optional, allow it
            return isEmailOptional ? true : 'Email is required';
          }
          // If email is provided, validate the pattern
          const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
          return emailPattern.test(value) || 'Invalid email address';
        };
        break;
      case 'password':
        rules.required = 'Password is required';
        rules.minLength = {
          value: 6,
          message: 'Password must be at least 6 characters',
        };
        break;
      case 'confirmPassword':
        rules.required = 'Please confirm your password';
        rules.validate = (value: string) => {
          const password = watch('password');
          return value === password || 'Passwords do not match';
        };
        break;
      case 'name':
        rules.required = 'Name is required';
        rules.minLength = {
          value: 2,
          message: 'Name must be at least 2 characters',
        };
        break;
      case 'phone':
        // Check if phone should be required for registration
        const isPhoneRequiredForReg = registrationFieldRequirements?.phoneRequired === true; // Default: false

        // Phone is required based on variant and specific configuration
        if (variant === 'forgot-password-whatsapp') {
          rules.required = 'WhatsApp number is required';
        } else if (variant === 'login-phone') {
          rules.required = 'Phone number is required';
        } else if (variant === 'register' && isPhoneRequiredForReg) {
          rules.required = 'Phone number is required';
        }
        rules.pattern = {
          value: /^[+]?[1-9][\d\s\-\(\)]{7,15}$/,
          message: 'Invalid phone number',
        };
        break;
      case 'code':
        rules.required = 'Verification code is required';
        rules.pattern = {
          value: /^\d{4,6}$/,
          message: 'Invalid verification code',
        };
        break;
    }

    return rules;
  };

  // Container styles
  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flex: 1,
      backgroundColor: colors.background,
    };

    if (authTheme === 'gradient' && gradientColors) {
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
      };
    }

    return baseStyle;
  };

  // Content layout styles
  const getContentLayoutStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flex: 1,
      paddingHorizontal: theme.sizes.lg,
      paddingVertical: theme.sizes.xl,
    };

    switch (layout) {
      case 'centered':
        return {
          ...baseStyle,
          justifyContent: 'center',
          paddingHorizontal: theme.sizes.xl,
        };
      case 'split':
        return {
          ...baseStyle,
          justifyContent: 'space-between',
        };
      case 'minimal':
        return {
          ...baseStyle,
          paddingHorizontal: theme.sizes.md,
          paddingVertical: theme.sizes.lg,
        };
      case 'card':
        return {
          ...baseStyle,
          justifyContent: 'center',
          paddingHorizontal: theme.sizes.sm,
        };
      case 'fullscreen':
        return {
          ...baseStyle,
          paddingHorizontal: 0,
          paddingVertical: 0,
        };
      default:
        return baseStyle;
    }
  };

  // Render logo
  const renderLogo = () => {
    // Don't show center logo for register screen
    if (variant === 'register') return null;

    // Smart logo selection for center logo
    const getSmartCenterLogoSource = () => {
      // If a specific logoSource is provided, use it
      if (logoSource) return logoSource;

      // Smart selection based on theme for center logo
      if (theme.isDark) {
        return require('../assets/logo-white.png');
      } else {
        return require('../assets/logo.png');
      }
    };

    if (!logo && !logoSource) {
      // Use smart logo selection when no specific logo is provided
      const smartLogoSource = getSmartCenterLogoSource();

      const logoContent = (
        <Animated.Image
          source={smartLogoSource}
          style={[
            {
              width: logoSize,
              height: logoSize,
              resizeMode: 'contain',
            },
            enableAnimations && {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        />
      );

      return (
        <Animated.View
          style={[
            {
              alignItems: 'center',
              marginBottom: theme.sizes.sm,
            },
            enableAnimations && {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {logoContent}
        </Animated.View>
      );
    }

    const logoContent = logo || (
      <Animated.Image
        source={logoSource!}
        style={[
          {
            width: logoSize,
            height: logoSize,
            resizeMode: 'contain',
          },
          enableAnimations && {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      />
    );

    return (
      <Animated.View
        style={[
          {
            alignItems: 'center',
            marginTop: theme.sizes.md,
            marginBottom: theme.sizes.md,
          },
          enableAnimations && {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {logoContent}
      </Animated.View>
    );
  };

  // Render back button
  const renderBackButton = () => {
    if (!showBackButton) return null;

    return (
      <Animated.View
        style={[
          {
            alignSelf: 'flex-start',
            marginBottom: theme.sizes.md,
          },
          enableAnimations && {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity
          onPress={onBackPress}
          style={{
            width: 40,
            height: 40,
            borderRadius: theme.borderRadius.md,
            backgroundColor: colors.surface,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Icon name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Render top left logo
  const renderTopLeftLogo = () => {
    if (!showTopLeftLogo || showBackButton) return null; // Don't show logo if back button is shown

    // Smart logo selection based on theme
    const getSmartLogoSource = () => {
      // If a specific topLeftLogoSource is provided, use it
      if (topLeftLogoSource) return topLeftLogoSource;

      // If logoSource is provided, use it
      if (logoSource) return logoSource;

      // Smart selection based on theme
      if (theme.isDark) {
        return require('../assets/logo-white.png');
      } else {
        return require('../assets/logo.png');
      }
    };

    const logoSrc = getSmartLogoSource();
    if (!logoSrc) return null;

    return (
      <Animated.View
        style={[
          {
            alignSelf: 'flex-start',
            marginBottom: theme.sizes.md,
          },
          enableAnimations && {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Animated.Image
          source={logoSrc}
          style={[
            {
              width: topLeftLogoSize,
              height: topLeftLogoSize,
              resizeMode: 'contain',
            },
            enableAnimations && {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        />
      </Animated.View>
    );
  };

  // Render header
  const renderHeader = () => {
    if (!finalContent.title && !finalContent.subtitle) return null;

    return (
      <Animated.View
        style={[
          {
            alignItems: layout === 'centered' ? 'center' : 'flex-start',
            marginBottom: theme.sizes.xl,
          },
          enableAnimations && {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {finalContent.title && (
          <Text
            variant="title"
            style={{
              fontWeight: '700',
              color: variant === 'account-created-successfully' ? '#22C55E' : colors.text,
              textAlign: layout === 'centered' ? 'center' : 'left',
              lineHeight : theme.fontSizes.xxl * 1.4,
              marginBottom: theme.sizes.sm,
              ...(variant === 'account-created-successfully' && {
                fontSize: theme.fontSizes.xxl + 4,
                letterSpacing: 0.5,
              }),
            }}
          >
            {finalContent.title}
          </Text>
        )}

        {finalContent.subtitle && (
          <Text
            variant="subtitle"
            style={{
              color: variant === 'account-created-successfully' ? '#16A34A' : colors.textSecondary,
              textAlign: layout === 'centered' ? 'center' : 'left',
              ...(variant === 'account-created-successfully' && {
                fontSize: theme.fontSizes.lg + 2,
                fontWeight: '600',
              }),
            }}
          >
            {finalContent.subtitle}
          </Text>
        )}

        {finalContent.description && (
          <Text
            variant="body"
            style={{
              fontSize: theme.fontSizes.md,
              color: variant === 'account-created-successfully' ? '#374151' : colors.textSecondary,
              textAlign: layout === 'centered' ? 'center' : 'left',
              marginTop: theme.sizes.sm,
              lineHeight: theme.fontSizes.md * 1.5,
              ...(variant === 'account-created-successfully' && {
                fontSize: theme.fontSizes.md + 1,
                lineHeight: (theme.fontSizes.md + 1) * 1.6,
                fontWeight: '500',
              }),
            }}
          >
            {finalContent.description}
          </Text>
        )}
      </Animated.View>
    );
  };

  // Render form fields based on variant
  const renderFormFields = () => {
    // Account status screens don't need form fields
    if (variant === 'account-review' || variant === 'account-suspended' || variant === 'account-created-successfully') {
      return null;
    }

    const fields = [];

    // Name field for registration
    if (variant === 'register') {
      fields.push(
        <Controller
          key="name"
          control={control}
          name="name"
          rules={getValidationRules('name')}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label={inputLabels.nameLabel || "Full Name"}
              placeholder={inputLabels.namePlaceholder || "Enter your full name"}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.name?.message}
              leftIcon="person-outline"
              style={{ marginBottom: theme.sizes.md }}
            />
          )}
        />
      );
    }

    // Phone field (for registration, WhatsApp reset, and phone login only)
    if ((variant === 'register' || variant === 'forgot-password-whatsapp' || variant === 'login-phone') && shouldShowPhoneInput()) {
      fields.push(
        <Controller
          key="phone"
          control={control}
          name="phone"
          rules={getValidationRules('phone')}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label={
                inputLabels.phoneLabel || (
                  variant === 'forgot-password-whatsapp' ? 'WhatsApp Number' :
                  variant === 'login-phone' ? 'Phone Number' :
                  'Phone Number (Optional)'
                )
              }
              placeholder={
                inputLabels.phonePlaceholder || (
                  variant === 'forgot-password-whatsapp' ? 'Enter your WhatsApp number' :
                  variant === 'login-phone' ? 'Enter your phone number' :
                  'Enter your phone number'
                )
              }
              helperText={
                variant === 'register' ? (
                  inputLabels.phoneHelperText || 'Example: +1234567890 or +201234567890'
                ) : undefined
              }
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.phone?.message}
              leftIcon={variant === 'forgot-password-whatsapp' ? 'logo-whatsapp' : 'call-outline'}
              keyboardType="phone-pad"
              style={{ marginBottom: theme.sizes.md }}
            />
          )}
        />
      );
    }

    // Email field (for most variants, excluding phone login)
    if (['login-email', 'register', 'forgot-password', 'forgot-password-email'].includes(variant)) {
      fields.push(
        <Controller
          key="email"
          control={control}
          name="email"
          rules={getValidationRules('email')}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label={inputLabels.emailLabel || "Email"}
              placeholder={inputLabels.emailPlaceholder || "Enter your email"}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
              leftIcon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
              style={{ marginBottom: theme.sizes.md }}
            />
          )}
        />
      );
    }

    // Password field
    if (['login-email', 'login-phone', 'register', 'reset-password'].includes(variant)) {
      fields.push(
        <Controller
          key="password"
          control={control}
          name="password"
          rules={getValidationRules('password')}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label={inputLabels.passwordLabel || "Password"}
              placeholder={inputLabels.passwordPlaceholder || "Enter your password"}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.password?.message}
              leftIcon="lock-closed-outline"
              rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
              onRightIconPress={() => setShowPassword(!showPassword)}
              secureTextEntry={!showPassword}
              style={{ marginBottom: theme.sizes.md }}
            />
          )}
        />
      );
    }

    // Confirm password field
    if (['register', 'reset-password'].includes(variant) && shouldShowConfirmPasswordInput()) {
      fields.push(
        <Controller
          key="confirmPassword"
          control={control}
          name="confirmPassword"
          rules={getValidationRules('confirmPassword')}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label={inputLabels.confirmPasswordLabel || "Confirm Password"}
              placeholder={inputLabels.confirmPasswordPlaceholder || "Confirm your password"}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.confirmPassword?.message}
              leftIcon="lock-closed-outline"
              rightIcon={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
              onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
              secureTextEntry={!showConfirmPassword}
              style={{ marginBottom: theme.sizes.md }}
            />
          )}
        />
      );
    }

    // Verification code fields using OTP component
    if (['verification', 'verification-email', 'verification-whatsapp'].includes(variant)) {
      fields.push(
        <Controller
          key="code"
          control={control}
          name="code"
          rules={getValidationRules('code')}
          render={({ field: { onChange } }) => (
            <OTPInput
              length={6}
              onChangeText={onChange}
              onComplete={onChange}
              error={errors.code?.message}
              label={inputLabels?.verificationCodeLabel || "Verification Code"}
              autoFocus={true}
            />
          )}
        />
      );
    }

    return fields;
  };

  // Render form options (remember me, terms)
  const renderFormOptions = () => {
    if (variant === 'forgot-password' || variant === 'verification' || variant === 'account-review' || variant === 'account-suspended' || variant === 'account-created-successfully' || variant === 'social-login') return null;

    return (
      <View style={{ marginBottom: theme.sizes.lg, marginTop: theme.sizes.md }}>
        {showRememberMe && ['login-email', 'login-phone'].includes(variant) && (
          <Checkbox
            label={inputLabels.rememberMeLabel || "Remember me"}
            checked={rememberMe}
            onPress={() => setRememberMe(!rememberMe)}
            style={{ marginBottom: theme.sizes.sm }}
          />
        )}

        {showTermsCheckbox && variant === 'register' && (
          <Checkbox
            label={
              (termsUrl || onTermsPress) ? (
                <View style={{ flexDirection: getFlexDirection(isRTL), alignItems: 'center', flexWrap: 'wrap' }}>
                  <Text
                    style={{
                      fontSize: theme.fontSizes.sm,
                      color: theme.colors.text,
                      fontWeight: '500',
                      textAlign: getTextAlign(isRTL),
                    }}
                  >
                    {termsPrefix || (inputLabels.termsLabel?.split(' ').slice(0, 2).join(' ')) || 'I agree to'}{' '}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      if (onTermsPress) {
                        onTermsPress();
                      } else if (termsUrl) {
                        Linking.openURL(termsUrl);
                      }
                    }}
                  >
                    <Text
                      style={{
                        fontSize: theme.fontSizes.sm,
                        color: theme.colors.primary,
                        textDecorationLine: 'underline',
                        fontWeight: '500',
                        textAlign: getTextAlign(isRTL),
                      }}
                    >
                      {termsLinkText || (inputLabels.termsLabel?.split(' ').slice(2).join(' ')) || 'Terms of Service and Privacy Policy'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                inputLabels.termsLabel || "I agree to the Terms of Service and Privacy Policy"
              )
            }
            checked={agreeToTerms}
            onPress={() => setAgreeToTerms(!agreeToTerms)}
            style={{ marginBottom: theme.sizes.sm }}
          />
        )}

        {showForgotPassword && ['login-email', 'login-phone'].includes(variant) && (
          <Button
            title={inputLabels?.forgotPasswordLabel || "Forgot Password?"}
            variant="ghost"
            size="small"
            onPress={onForgotPassword}
            style={{ alignSelf: 'flex-end' }}
            textStyle={{ color: colors.primary }}
          />
        )}
      </View>
    );
  };

  // Render social login
  const renderSocialLogin = () => {
    if (!showSocialLogin || socialProviders.length === 0) return null;

    const renderSeparator = () => (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: socialLoginPosition === 'top' ? 0 : theme.sizes.md,
          marginTop: socialLoginPosition === 'top' ? theme.sizes.md : 0,
        }}
      >
        <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
        <Text
          variant="caption"
          style={{
            color: colors.textSecondary,
            marginHorizontal: theme.sizes.md,
          }}
        >
          {socialLoginTitle}
        </Text>
        <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
      </View>
    );

    const renderSocialButtons = () => (
      <View
          style={{
            flexDirection: 'column',
            gap: theme.sizes.sm,
          }}
        >
          {socialProviders.map((provider, index) => {
            // Define theme-aware colors for each platform
            const getTextColor = (providerName: string) => {
              switch (providerName.toLowerCase()) {
                case 'google':
                  return '#FFFFFF'; // White text on Google Red
                case 'apple':
                  return theme.isDark ? '#000000' : '#FFFFFF'; // Black text on white bg (dark theme), white text on black bg (light)
                case 'facebook':
                  return '#FFFFFF'; // Always white on Facebook blue
                default:
                  return '#FFFFFF';
              }
            };

            const getBackgroundColor = (providerName: string) => {
              switch (providerName.toLowerCase()) {
                case 'google':
                  return '#EA4335'; // Google Red
                case 'apple':
                  return theme.isDark ? '#FFFFFF' : '#000000'; // White on dark theme, black on light
                case 'facebook':
                  return '#1877F2'; // Always Facebook blue
                default:
                  return provider.color;
              }
            };

            const getBorderColor = (providerName: string) => {
              switch (providerName.toLowerCase()) {
                case 'google':
                  return '#EA4335'; // Google Red border
                case 'apple':
                  return theme.isDark ? '#FFFFFF' : '#000000'; // White border on dark, black on light
                case 'facebook':
                  return '#1877F2'; // Same as background for seamless look
                default:
                  return provider.color;
              }
            };

            const getButtonStyle = (providerName: string) => {
              const backgroundColor = getBackgroundColor(providerName);
              const borderColor = getBorderColor(providerName);

              const baseStyle = {
                width: '100%',
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 1,
                paddingVertical: theme.sizes.md,
                minHeight: 52,
                // Force background color override
                ...(backgroundColor && { backgroundColor: backgroundColor }),
              };

              // Add platform-specific styling with theme awareness
              switch (providerName.toLowerCase()) {
                case 'facebook':
                  return {
                    ...baseStyle,
                    backgroundColor: '#1877F2', // Facebook blue (consistent across themes)
                    borderColor: '#1877F2',
                    shadowColor: theme.isDark ? '#000000' : '#1877F2',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: theme.isDark ? 0.3 : 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  };
                case 'google':
                  return {
                    ...baseStyle,
                    backgroundColor: backgroundColor,
                    borderColor: borderColor,
                    shadowColor: theme.isDark ? '#FFFFFF' : '#000000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: theme.isDark ? 0.2 : 0.1,
                    shadowRadius: 2,
                    elevation: 1,
                  };
                case 'apple':
                  return {
                    ...baseStyle,
                    backgroundColor: backgroundColor,
                    borderColor: borderColor,
                    ...(theme.isDark && {
                      shadowColor: '#FFFFFF',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.2,
                      shadowRadius: 2,
                      elevation: 1,
                    }),
                  };
                default:
                  return baseStyle;
              }
            };

            return (
              <Button
                key={index}
                title={inputLabels?.continueWithLabel ? `${inputLabels.continueWithLabel} ${provider.name}` : `Continue with ${provider.name}`}
                variant={provider.name.toLowerCase() === 'google' ? 'outline' : 'primary'}
                onPress={() => {
                  if (provider.onPress) {
                    provider.onPress();
                  } else {
                    onSocialLogin?.(provider.name.toLowerCase());
                  }
                }}
                loading={isLoading}
                disabled={isLoading}
                style={getButtonStyle(provider.name)}
                textStyle={{
                  color: getTextColor(provider.name),
                  fontWeight: '600',
                  fontSize: theme.fontSizes.md,
                }}
              />
            );
          })}
        </View>
    );

    return (
      <View style={{ marginBottom: theme.sizes.lg }}>
        {/* When position is 'top': buttons first, then separator */}
        {/* When position is 'bottom': separator first, then buttons */}
        {socialLoginPosition === 'top' ? (
          <>
            {renderSocialButtons()}
            {renderSeparator()}
          </>
        ) : (
          <>
            {renderSeparator()}
            {renderSocialButtons()}
          </>
        )}
      </View>
    );
  };

  // Render biometric login
  const renderBiometricLogin = () => {
    if (!enableBiometric || !['login-email', 'login-phone'].includes(variant)) return null;

    return (
      <Button
        title={inputLabels?.biometricLabel || "Use Biometric"}
        variant="outline"
        size="medium"
        leftIcon="finger-print-outline"
        onPress={onBiometricLogin}
      />
    );
  };

  // Render footer
  const renderFooter = () => {
    if (!finalContent.footerText && !finalContent.footerLinkText) return null;

    // Special handling for account-suspended to prevent text overflow
    const isAccountSuspended = variant === 'account-suspended';

    return (
      <View
        style={{
          alignItems: 'center',
          marginTop: theme.sizes.lg,
          paddingHorizontal: theme.sizes.sm,
        }}
      >
        {finalContent.footerText && (
          <Text
            variant="body"
            style={{
              color: colors.textSecondary,
              textAlign: 'center',
              marginBottom: isAccountSuspended ? theme.sizes.sm : theme.sizes.xs,
              lineHeight: theme.fontSizes.md * 1.4,
              maxWidth: '100%',
            }}
          >
            {finalContent.footerText}
          </Text>
        )}

        {finalContent.footerLinkText && (
          <Button
            title={finalContent.footerLinkText}
            variant="ghost"
            size="small"
            onPress={onFooterLinkPress}
            textStyle={{ color: colors.primary }}
            style={{
              alignSelf: 'center',
              paddingHorizontal: theme.sizes.sm,
            }}
          />
        )}
      </View>
    );
  };

  // Render full-screen loading overlay
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLoading && fullScreenLoading) {
      const spinAnimation = Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      spinAnimation.start();
      return () => spinAnimation.stop();
    }
  }, [isLoading, fullScreenLoading]);

  const renderFullScreenLoading = () => {
    if (!isLoading || !fullScreenLoading) return null;

    const spin = spinAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: theme.isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999,
        }}
      >
        <View
          style={{
            backgroundColor: theme.isDark ? theme.colors.surface : '#FFFFFF',
            borderRadius: theme.borderRadius.xl,
            padding: theme.sizes.xl,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
            minWidth: 200,
          }}
        >
          <Animated.View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              borderWidth: 3,
              borderColor: theme.colors.primary,
              borderTopColor: 'transparent',
              marginBottom: theme.sizes.md,
              transform: [{ rotate: spin }],
            }}
          />
          <Text
            variant="body"
            style={{
              color: theme.colors.text,
              fontSize: theme.fontSizes.md,
              fontWeight: '500',
              textAlign: 'center',
            }}
          >
            {loadingText}
          </Text>
        </View>
      </View>
    );
  };

  // Handle form submission
  const handleFormSubmit = async (data: AuthFormData) => {
    // Include additional state values in form data
    const completeData = {
      ...data,
      rememberMe,
      agreeToTerms,
    };

    if (customValidation) {
      const validationErrors = customValidation(completeData);
      if (validationErrors) {
        // Handle custom validation errors
        return;
      }
    }

    try {
      await onSubmit?.(completeData);
    } catch (error) {
      // Handle error silently or with proper error handling
    }
  };

  // Render gradient background
  const renderGradientBackground = () => {
    if (authTheme !== 'gradient' || !gradientColors) return null;

    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: gradientColors[0],
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: gradientColors[1],
            opacity: 0.8,
          }}
        />
      </View>
    );
  };

  // Render background image
  const renderBackgroundImage = () => {
    if (!backgroundImage) return null;

    return (
      <ImageBackground
        source={backgroundImage}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        resizeMode="cover"
      >
        <View
          style={{
            flex: 1,
            backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
          }}
        />
      </ImageBackground>
    );
  };

  // Main form content
  const renderFormContent = () => {
    const cardStyle: ViewStyle = {
      backgroundColor: colors.surface,
      borderRadius: borderRadius || theme.borderRadius.xl,
      padding: theme.sizes.xl,
      marginHorizontal: layout === 'card' ? theme.sizes.md : 0,
      ...(authTheme === 'glassmorphism' && {
        backdropFilter: 'blur(10px)',
        borderWidth: 1,
        borderColor: colors.border,
      }),
    };

    const content = (
      <Animated.View
        style={[
          layout === 'card' ? cardStyle : {},
          formStyle,
          enableAnimations && {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        {renderHeader()}

        {/* Social login at top if socialLoginPosition is 'top' */}
        {socialLoginPosition === 'top' && renderSocialLogin()}

        <View>
          {renderFormFields()}
          {customFields}
          {renderFormOptions()}

          <Button
            title={finalContent.primaryButtonText || 'Submit'}
            variant={primaryButtonVariant}
            size="medium"
            onPress={handleSubmit(handleFormSubmit)}
            loading={isLoading}
            loadingText={loadingText}
            style={{ marginBottom: theme.sizes.md }}
            disabled={
              showTermsCheckbox && variant === 'register' ? !agreeToTerms : false
            }
          />

          {finalContent.secondaryButtonText && (
            <Button
              title={finalContent.secondaryButtonText}
              variant="outline"
              size="medium"
              onPress={onSecondaryAction}
              style={{ marginBottom: theme.sizes.md }}
            />
          )}
        </View>

        {renderBiometricLogin()}
        {/* Social login at bottom if socialLoginPosition is 'bottom' (default) */}
        {socialLoginPosition === 'bottom' && renderSocialLogin()}
        {renderFooter()}
      </Animated.View>
    );

    if (layout === 'fullscreen') {
      return (
        <View style={{ flex: 1, justifyContent: 'center', padding: theme.sizes.xl }}>
          {content}
        </View>
      );
    }

    return content;
  };

  return (
    <SafeAreaView
      style={[getContainerStyle(), style, { flex: 1 }]}
      testID={testID}
      accessible={accessible}
    >
      <StatusBar
        barStyle={
          authTheme === 'gradient' || authTheme === 'glassmorphism' || authTheme === 'branded' || authTheme === 'dark' ||
          (colors.text === '#FFFFFF' || colors.background === 'transparent')
            ? 'light-content'
            : 'dark-content'
        }
        backgroundColor={colors.background === 'transparent' ? 'transparent' : colors.background}
        translucent={authTheme === 'gradient' || authTheme === 'glassmorphism' || backgroundImage ? true : false}
      />

      {renderGradientBackground()}
      {renderBackgroundImage()}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[
            {
              flexGrow: 1,
              paddingHorizontal: layout === 'minimal' ? theme.sizes.md : layout === 'card' ? theme.sizes.sm : theme.sizes.lg,
              paddingTop: theme.sizes.sm,
              paddingBottom: Math.max(insets.bottom, theme.sizes.sm) + (layout === 'centered' ? theme.sizes.md : theme.sizes.xs),
              ...(layout === 'centered' && { justifyContent: 'center', minHeight: '100%' }),
              ...(layout === 'split' && { justifyContent: 'space-between', minHeight: '100%' }),
              ...(layout === 'fullscreen' && { paddingHorizontal: 0 }),
            },
            contentStyle,
          ]}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
          bounces={true}
        >
          {renderBackButton()}
          {renderTopLeftLogo()}
          {renderLogo()}
          {renderFormContent()}
        </ScrollView>
      </KeyboardAvoidingView>

      {renderFullScreenLoading()}
    </SafeAreaView>
  );
}