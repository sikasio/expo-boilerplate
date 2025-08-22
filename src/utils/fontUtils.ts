import { TextStyle } from 'react-native';
import { FONT_FAMILIES, getFontStyle, type FontFamily } from '@/config/fonts';

// Utility to create text styles with font support
export const createTextStyle = (
  fontFamily?: FontFamily,
  weight: 'thin' | 'extraLight' | 'light' | 'regular' | 'medium' | 'semiBold' | 'bold' | 'extraBold' | 'black' = 'regular',
  italic: boolean = false,
  fontSize?: number,
  lineHeight?: number,
  color?: string
): TextStyle => {
  const baseStyle: TextStyle = {};

  // Apply font family and weight
  if (fontFamily) {
    Object.assign(baseStyle, getFontStyle(fontFamily, weight, italic));
  }

  // Apply additional styles
  if (fontSize) baseStyle.fontSize = fontSize;
  if (lineHeight) baseStyle.lineHeight = lineHeight;
  if (color) baseStyle.color = color;

  return baseStyle;
};

// Predefined text style presets
export const createFontPresets = (fontFamily: FontFamily, baseSize: number, lineHeightMultiplier: number) => ({
  // Headings
  title: createTextStyle(fontFamily, 'bold', false, baseSize * 2, baseSize * 2 * lineHeightMultiplier),
  heading: createTextStyle(fontFamily, 'bold', false, baseSize * 1.5, baseSize * 1.5 * lineHeightMultiplier),
  subtitle: createTextStyle(fontFamily, 'medium', false, baseSize * 1.125, baseSize * 1.125 * lineHeightMultiplier),
  
  // Body text
  body: createTextStyle(fontFamily, 'regular', false, baseSize, baseSize * lineHeightMultiplier),
  bodyBold: createTextStyle(fontFamily, 'bold', false, baseSize, baseSize * lineHeightMultiplier),
  bodyLight: createTextStyle(fontFamily, 'light', false, baseSize, baseSize * lineHeightMultiplier),
  
  // Small text
  caption: createTextStyle(fontFamily, 'regular', false, baseSize * 0.875, baseSize * 0.875 * lineHeightMultiplier),
  label: createTextStyle(fontFamily, 'medium', false, baseSize * 0.75, baseSize * 0.75 * lineHeightMultiplier),
  
  // Button text
  button: createTextStyle(fontFamily, 'medium', false, baseSize, baseSize * 1.2),
  buttonSmall: createTextStyle(fontFamily, 'medium', false, baseSize * 0.875, baseSize * 0.875 * 1.2),
  buttonLarge: createTextStyle(fontFamily, 'medium', false, baseSize * 1.125, baseSize * 1.125 * 1.2),
});

// Helper to get optimized line height for different languages
export const getOptimalLineHeight = (fontSize: number, fontFamily: FontFamily): number => {
  // Arabic fonts generally need more line height for better readability
  if (fontFamily.category === 'arabic') {
    return fontSize * 1.6;
  }
  
  // Latin fonts can use tighter line height
  return fontSize * 1.4;
};

// Helper to check if a font supports RTL
export const fontSupportsRTL = (fontId: string): boolean => {
  const font = FONT_FAMILIES[fontId];
  return font?.rtlSupport || false;
};

// Helper to get the best font for RTL content
export const getBestRTLFont = (): FontFamily => {
  // Find the first RTL-supporting font, or fallback to system
  const rtlFonts = Object.values(FONT_FAMILIES).filter(font => font.rtlSupport);
  return rtlFonts[0] || FONT_FAMILIES.system;
};

// Helper to get font display name
export const getFontDisplayName = (fontId: string): string => {
  return FONT_FAMILIES[fontId]?.displayName || 'Unknown Font';
};