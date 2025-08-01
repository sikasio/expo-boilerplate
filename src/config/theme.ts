import { COLORS, DARK_COLORS, SIZES, FONT_SIZES } from '../constants';

export interface Theme {
  colors: typeof COLORS;
  sizes: typeof SIZES;
  fontSizes: typeof FONT_SIZES;
  isDark: boolean;
}

export const lightTheme: Theme = {
  colors: COLORS,
  sizes: SIZES,
  fontSizes: FONT_SIZES,
  isDark: false,
};

export const darkTheme: Theme = {
  colors: DARK_COLORS,
  sizes: SIZES,
  fontSizes: FONT_SIZES,
  isDark: true,
};

export const getTheme = (isDark: boolean): Theme => {
  return isDark ? darkTheme : lightTheme;
};