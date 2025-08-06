import { COLORS, DARK_COLORS, COLOR_SCHEMES, SIZES, FONT_SIZES, BORDER_RADIUS } from '@/constants';

export interface Theme {
  colors: typeof COLORS;
  sizes: typeof SIZES;
  fontSizes: typeof FONT_SIZES;
  borderRadius: typeof BORDER_RADIUS;
  isDark: boolean;
}

export const lightTheme: Theme = {
  colors: COLORS,
  sizes: SIZES,
  fontSizes: FONT_SIZES,
  borderRadius: BORDER_RADIUS,
  isDark: false,
};

export const darkTheme: Theme = {
  colors: DARK_COLORS,
  sizes: SIZES,
  fontSizes: FONT_SIZES,
  borderRadius: BORDER_RADIUS,
  isDark: true,
};

export const getTheme = (isDark: boolean, colorScheme: string = 'blue'): Theme => {
  const baseTheme = isDark ? darkTheme : lightTheme;
  const schemeColors = COLOR_SCHEMES[colorScheme as keyof typeof COLOR_SCHEMES];
  
  if (schemeColors) {
    const colors = isDark ? schemeColors.dark : schemeColors.light;
    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        primary: colors.primary,
        secondary: colors.secondary,
      },
    };
  }
  
  return baseTheme;
};