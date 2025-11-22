/**
 * Error Fallback Component - Boilerplate
 *
 * Generic error fallback component for React Error Boundaries.
 * Displays crash information with optional crash location details.
 */

import React from 'react';
import { View, ScrollView, Platform, Text as RNText } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { extractCrashLocation, type CrashLocation } from '@/utils/crashLocation';

export interface ErrorFallbackProps {
  error?: Error;
  componentStack?: string;
  crashLocation?: CrashLocation | null;
  title?: string;
  description?: string;
  restartRoute?: string;
  showCrashLocation?: boolean;
}

/**
 * Error Fallback Component
 *
 * Displays a user-friendly error screen with:
 * - Error icon
 * - Title and description
 * - Crash location (dev mode only)
 * - Restart button
 * - Support information
 *
 * @param props - ErrorFallbackProps
 *
 * @example
 * ```typescript
 * <Sentry.ErrorBoundary
 *   fallback={(props) => (
 *     <ErrorFallback
 *       {...props}
 *       title="Something went wrong"
 *       restartRoute="/(tabs)"
 *     />
 *   )}
 * >
 *   <App />
 * </Sentry.ErrorBoundary>
 * ```
 */
export function ErrorFallback({
  error,
  componentStack,
  crashLocation,
  title = 'Sorry, an error occurred',
  description = 'The app encountered an unexpected problem.',
  restartRoute = '/(tabs)',
  showCrashLocation = true,
}: ErrorFallbackProps) {
  const { theme } = useTheme();
  const router = useRouter();

  // Extract crash location if not provided
  const location = crashLocation ?? extractCrashLocation(error?.stack);

  const handleRestart = () => {
    router.replace(restartRoute);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 32,
          }}
        >
          {/* Error Icon */}
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: theme.colors.error + '20',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 32,
            }}
          >
            <Icon
              name="alert-circle-outline"
              size={60}
              color={theme.colors.error}
            />
          </View>

          {/* Error Title */}
          <RNText
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: theme.colors.text,
              textAlign: 'center',
              marginBottom: 16,
            }}
          >
            {title}
          </RNText>

          {/* Error Description */}
          <RNText
            style={{
              fontSize: 16,
              color: theme.colors.textSecondary,
              textAlign: 'center',
              marginBottom: 12,
              lineHeight: 24,
            }}
          >
            {description}
          </RNText>

          <RNText
            style={{
              fontSize: 14,
              color: theme.colors.textTertiary,
              textAlign: 'center',
              marginBottom: 32,
              lineHeight: 22,
            }}
          >
            The error report has been sent automatically to our team.
          </RNText>

          {/* Crash Location (Development Only) */}
          {__DEV__ && showCrashLocation && location && (
            <View
              style={{
                width: '100%',
                backgroundColor: theme.colors.surface,
                borderRadius: 12,
                padding: 16,
                marginBottom: 24,
                borderLeftWidth: 4,
                borderLeftColor: theme.colors.error,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <Icon
                  name="code-slash-outline"
                  size={20}
                  color={theme.colors.error}
                />
                <RNText
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: theme.colors.text,
                  }}
                >
                  Crash Location
                </RNText>
              </View>
              <RNText
                style={{
                  fontSize: 13,
                  color: theme.colors.textSecondary,
                  fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
                }}
              >
                📄 {location.file}
              </RNText>
              <RNText
                style={{
                  fontSize: 13,
                  color: theme.colors.textSecondary,
                  fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
                  marginTop: 4,
                }}
              >
                📍 Line {location.line}:{location.column}
              </RNText>
              {error?.message && (
                <RNText
                  style={{
                    fontSize: 12,
                    color: theme.colors.error,
                    marginTop: 8,
                    fontStyle: 'italic',
                  }}
                  numberOfLines={2}
                >
                  {error.message}
                </RNText>
              )}
            </View>
          )}

          {/* Restart Button */}
          <View style={{ width: '100%' }}>
            <Button
              title="Restart App"
              onPress={handleRestart}
              icon="refresh-outline"
              style={{ width: '100%' }}
            />
          </View>

          {/* Support Info */}
          <View
            style={{
              marginTop: 40,
              padding: 16,
              backgroundColor: theme.colors.surface,
              borderRadius: 12,
              width: '100%',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                marginBottom: 8,
              }}
            >
              <Icon
                name="information-circle-outline"
                size={20}
                color={theme.colors.primary}
              />
              <RNText
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: theme.colors.text,
                }}
              >
                Need help?
              </RNText>
            </View>
            <RNText
              style={{
                fontSize: 13,
                color: theme.colors.textSecondary,
                lineHeight: 20,
              }}
            >
              You can contact our support team from the account settings.
            </RNText>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * Arabic Error Fallback Component
 *
 * Same as ErrorFallback but with Arabic text
 */
export function ErrorFallbackArabic(props: Omit<ErrorFallbackProps, 'title' | 'description'>) {
  return (
    <ErrorFallback
      {...props}
      title="عذراً، حدث خطأ"
      description="لقد واجه التطبيق مشكلة غير متوقعة."
    />
  );
}
