import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AppProvider } from '@sikasio/expo-boilerplate/contexts';
import { AuthProvider } from '@sikasio/expo-boilerplate/contexts';
import { ThemeProvider } from '@sikasio/expo-boilerplate/contexts';
import { RTLProvider } from '@sikasio/expo-boilerplate/contexts';
import { SplashProvider } from '@sikasio/expo-boilerplate/contexts';
import { FontProvider } from '@sikasio/expo-boilerplate/contexts';
import { ThemeStatusBar } from '@sikasio/expo-boilerplate/components/ui';
import { ThemeToast } from '@sikasio/expo-boilerplate/components/ui';
import { GlobalConfigPanel } from '@sikasio/expo-boilerplate/components/overlays';
import { AppInitializationService } from '@sikasio/expo-boilerplate/services';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    // Add your custom fonts here
  });

  useEffect(() => {
    if (loaded) {
      // Initialize app defaults for new installations
      AppInitializationService.initializeAppDefaults();
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <AuthProvider>
          <ThemeProvider>
            <FontProvider>
              <RTLProvider>
                <SplashProvider>
                <Stack>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                </Stack>
                <ThemeStatusBar />
                <ThemeToast />
                <GlobalConfigPanel />
                </SplashProvider>
              </RTLProvider>
            </FontProvider>
          </ThemeProvider>
        </AuthProvider>
      </AppProvider>
    </GestureHandlerRootView>
  );
}