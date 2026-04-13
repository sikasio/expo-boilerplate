import { Platform, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Hook to detect Android 3-button navigation and provide bottom offset
 */
export function use3ButtonNavigationDetector() {
  const insets = useSafeAreaInsets();

  const getAndroidBottomOffset = () => {
    if (Platform.OS !== 'android') return 0;

    const screenHeight = Dimensions.get('screen').height;
    const windowHeight = Dimensions.get('window').height;
    const navigationHeight = screenHeight - windowHeight;

    // New detection logic: If safe area bottom is large (>= 40px), likely 3-button navigation
    // because gesture navigation typically has smaller safe area
    if (insets.bottom >= 40) {
      const extraOffset = Math.max(25, insets.bottom - 10);
      return extraOffset;
    }

    // Fallback: traditional detection method
    if (navigationHeight >= 35) {
      const extraOffset = Math.max(15, navigationHeight - insets.bottom);
      return extraOffset;
    }

    return 0;
  };

  const androidBottomOffset = getAndroidBottomOffset();
  const hasAndroid3ButtonNav = androidBottomOffset > 0;

  return {
    androidBottomOffset,
    hasAndroid3ButtonNav,
    safeAreaInsets: insets,
  };
}