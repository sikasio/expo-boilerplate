import { Platform } from 'react-native';

// Font family definitions
export interface FontFamily {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: 'system' | 'arabic' | 'latin' | 'custom';
  weights: {
    thin?: string;
    extraLight?: string;
    light?: string;
    regular: string;
    medium?: string;
    semiBold?: string;
    bold?: string;
    extraBold?: string;
    black?: string;
  };
  italics?: {
    light?: string;
    regular?: string;
    bold?: string;
  };
  rtlSupport: boolean;
}

// Available font families
export const FONT_FAMILIES: Record<string, FontFamily> = {
  system: {
    id: 'system',
    name: Platform.select({
      ios: 'San Francisco',
      android: 'Roboto',
      default: 'System',
    }) as string,
    displayName: 'System Default',
    description: 'Platform default system font',
    category: 'system',
    weights: {
      light: Platform.select({
        ios: 'SFProDisplay-Light',
        android: 'Roboto-Light',
        default: 'System',
      }) as string,
      regular: Platform.select({
        ios: 'SFProDisplay-Regular',
        android: 'Roboto-Regular',
        default: 'System',
      }) as string,
      medium: Platform.select({
        ios: 'SFProDisplay-Medium',
        android: 'Roboto-Medium',
        default: 'System',
      }) as string,
      bold: Platform.select({
        ios: 'SFProDisplay-Bold',
        android: 'Roboto-Bold',
        default: 'System',
      }) as string,
    },
    rtlSupport: false,
  },
  zain: {
    id: 'zain',
    name: 'Zain',
    displayName: 'Zain Arabic',
    description: 'Modern Arabic font with excellent readability',
    category: 'arabic',
    weights: {
      extraLight: 'Zain-ExtraLight',
      light: 'Zain-Light',
      regular: 'Zain-Regular',
      bold: 'Zain-Bold',
      extraBold: 'Zain-ExtraBold',
      black: 'Zain-Black',
    },
    italics: {
      light: 'Zain-LightItalic',
      regular: 'Zain-Italic',
    },
    rtlSupport: true,
  },
};

// Font weight mapping for different font families
export const getFontWeight = (
  fontFamily: FontFamily,
  weight: 'thin' | 'extraLight' | 'light' | 'regular' | 'medium' | 'semiBold' | 'bold' | 'extraBold' | 'black' = 'regular',
  italic: boolean = false
): string => {
  // Handle italic variants first
  if (italic && fontFamily.italics) {
    const italicVariant =
      weight === 'light' ? fontFamily.italics.light :
      weight === 'bold' ? fontFamily.italics.bold :
      fontFamily.italics.regular;

    if (italicVariant) return italicVariant;
  }

  // Fallback to regular weights
  const targetWeight = fontFamily.weights[weight] || fontFamily.weights.regular;
  return targetWeight;
};

// Font size scale that works well with different font families
export const FONT_SCALE = {
  xs: 0.75,    // 12px at 16px base
  sm: 0.875,   // 14px at 16px base
  md: 1,       // 16px base
  lg: 1.125,   // 18px at 16px base
  xl: 1.25,    // 20px at 16px base
  xxl: 1.5,    // 24px at 16px base
  xxxl: 2,     // 32px at 16px base
} as const;

// Calculate font sizes based on base size and scale
export const calculateFontSizes = (baseSize: number = 16) => ({
  xs: Math.round(baseSize * FONT_SCALE.xs),
  sm: Math.round(baseSize * FONT_SCALE.sm),
  md: Math.round(baseSize * FONT_SCALE.md),
  lg: Math.round(baseSize * FONT_SCALE.lg),
  xl: Math.round(baseSize * FONT_SCALE.xl),
  xxl: Math.round(baseSize * FONT_SCALE.xxl),
  xxxl: Math.round(baseSize * FONT_SCALE.xxxl),
});

// Default font sizes (can be overridden by user preferences)
export const DEFAULT_FONT_SIZES = calculateFontSizes(16);

// App-specific font preferences
export interface AppFontConfig {
  appId: string;
  fontFamily: string;
  baseSize: number;
  lineHeightMultiplier: number;
}

// Default font configuration for the `_default` app.
// Consumers can add their own app configs by extending this record or by
// passing a custom `AppFontConfig` to `FontProvider`. Suggested pattern for
// Arabic-heavy apps: `{ fontFamily: 'zain', baseSize: 16, lineHeightMultiplier: 1.6 }`.
export const DEFAULT_APP_FONT_CONFIGS: Record<string, AppFontConfig> = {
  _default: {
    appId: '_default',
    fontFamily: 'system',
    baseSize: 16,
    lineHeightMultiplier: 1.4,
  },
};

// Utility to get font style object
export const getFontStyle = (
  fontFamily: FontFamily,
  weight: 'thin' | 'extraLight' | 'light' | 'regular' | 'medium' | 'semiBold' | 'bold' | 'extraBold' | 'black' = 'regular',
  italic: boolean = false
) => ({
  fontFamily: getFontWeight(fontFamily, weight, italic),
  ...(fontFamily.category === 'system' && {
    fontWeight: weight as any, // For system fonts, also set fontWeight
  }),
});