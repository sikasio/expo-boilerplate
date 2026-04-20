import { COLORS, DARK_COLORS, COLOR_SCHEMES, SIZES, FONT_SIZES, BORDER_RADIUS } from '../constants';
import type { LoadingSpinnerSize, LoadingSpinnerVariant } from '../components/ui/LoadingSpinner';
import type { FontFamily } from './fonts';

export interface LazyImageTheme {
  spinnerSize: LoadingSpinnerSize;
  spinnerVariant: LoadingSpinnerVariant;
  defaultTimeout: number;
}

// Use the structural key shape from COLORS (so we keep the typo-check) but
// widen each value to `string` — otherwise `DARK_COLORS` and consumer overrides
// (which provide different hex strings) can't be assigned.
export type ThemeColors = { [K in keyof typeof COLORS]: string };

export interface Theme {
  colors: ThemeColors;
  sizes: typeof SIZES;
  fontSizes: typeof FONT_SIZES;
  borderRadius: typeof BORDER_RADIUS;
  lazyImage?: LazyImageTheme;
  isDark: boolean;
  fontFamily?: FontFamily;
  lineHeightMultiplier?: number;
}

export interface ColorSchemeColors {
  light: { primary: string; secondary: string };
  dark: { primary: string; secondary: string };
}

export const lightTheme: Theme = {
  colors: { ...COLORS },
  sizes: SIZES,
  fontSizes: FONT_SIZES,
  borderRadius: BORDER_RADIUS,
  isDark: false,
};

export const darkTheme: Theme = {
  colors: { ...DARK_COLORS },
  sizes: SIZES,
  fontSizes: FONT_SIZES,
  borderRadius: BORDER_RADIUS,
  isDark: true,
};

const customColorSchemes: Record<string, ColorSchemeColors> = {};

export function registerColorScheme(name: string, colors: ColorSchemeColors): void {
  customColorSchemes[name] = colors;
}

export const getTheme = (isDark: boolean, colorScheme: string = 'blue'): Theme => {
  const baseTheme = isDark ? darkTheme : lightTheme;
  const schemeColors =
    customColorSchemes[colorScheme] ??
    COLOR_SCHEMES[colorScheme as keyof typeof COLOR_SCHEMES];

  if (schemeColors) {
    const colors = isDark ? schemeColors.dark : schemeColors.light;
    return {
      ...baseTheme,
      lazyImage: {
        spinnerSize: 'medium',
        spinnerVariant: 'circle',
        defaultTimeout: 500,
      },
      colors: {
        ...baseTheme.colors,
        primary: colors.primary,
        secondary: colors.secondary,
      },
    };
  }

  return baseTheme;
};
