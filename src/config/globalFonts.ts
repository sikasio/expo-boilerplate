/**
 * Global font configuration for all apps
 * This file defines all fonts that should be loaded across the entire boilerplate
 */

export const GLOBAL_FONTS = {
  // Zain Arabic font family - Available to all apps
  'Zain-ExtraLight': require('../../assets/fonts/Zain/Zain-ExtraLight.ttf'),
  'Zain-Light': require('../../assets/fonts/Zain/Zain-Light.ttf'),
  'Zain-Regular': require('../../assets/fonts/Zain/Zain-Regular.ttf'),
  'Zain-Bold': require('../../assets/fonts/Zain/Zain-Bold.ttf'),
  'Zain-ExtraBold': require('../../assets/fonts/Zain/Zain-ExtraBold.ttf'),
  'Zain-Black': require('../../assets/fonts/Zain/Zain-Black.ttf'),
  'Zain-LightItalic': require('../../assets/fonts/Zain/Zain-LightItalic.ttf'),
  'Zain-Italic': require('../../assets/fonts/Zain/Zain-Italic.ttf'),
  
  // Add more global fonts here as needed
  // 'CustomFont-Regular': require('../../assets/fonts/CustomFont/CustomFont-Regular.ttf'),
  // 'AnotherFont-Bold': require('../../assets/fonts/AnotherFont/AnotherFont-Bold.ttf'),
};

/**
 * Helper function to merge global fonts with app-specific fonts
 */
export function createFontConfig(appSpecificFonts: Record<string, any> = {}) {
  return {
    ...GLOBAL_FONTS,
    ...appSpecificFonts,
  };
}