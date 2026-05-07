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

  // Inter — Apple-style open-source family (SIL Open Font License). Useful as
  // a cross-platform stand-in for SF Pro since Apple doesn't license SF for
  // redistribution to Android.
  'Inter-ExtraLight': require('../../assets/fonts/Inter/Inter-ExtraLight.ttf'),
  'Inter-Light': require('../../assets/fonts/Inter/Inter-Light.ttf'),
  'Inter-Regular': require('../../assets/fonts/Inter/Inter-Regular.ttf'),
  'Inter-Medium': require('../../assets/fonts/Inter/Inter-Medium.ttf'),
  'Inter-SemiBold': require('../../assets/fonts/Inter/Inter-SemiBold.ttf'),
  'Inter-Bold': require('../../assets/fonts/Inter/Inter-Bold.ttf'),
  'Inter-ExtraBold': require('../../assets/fonts/Inter/Inter-ExtraBold.ttf'),
  'Inter-Black': require('../../assets/fonts/Inter/Inter-Black.ttf'),
  'Inter-Italic': require('../../assets/fonts/Inter/Inter-Italic.ttf'),
  'Inter-LightItalic': require('../../assets/fonts/Inter/Inter-LightItalic.ttf'),

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