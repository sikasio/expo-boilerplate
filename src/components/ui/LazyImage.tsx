import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  ImageStyle,
  ViewStyle,
  StyleProp,
  Platform
} from 'react-native';
import { Image, ImageLoadEventData, ImageErrorEventData } from 'expo-image';
import { useTheme } from '../../contexts/ThemeContext';
import { LoadingSpinner, LoadingSpinnerSize, LoadingSpinnerVariant } from './LoadingSpinner';
import { Icon } from './Icon';
import { Text } from './Text';

export interface LazyImageProps {
  source: { uri: string } | number;
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  placeholder?: React.ReactNode;
  errorComponent?: React.ReactNode;
  loadingComponent?: React.ReactNode;
  fadeDuration?: number;
  showLoadingSpinner?: boolean;
  showErrorIcon?: boolean;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  onLoad?: (event: ImageLoadEventData) => void;
  onError?: (error: ImageErrorEventData) => void;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  testID?: string;
  loadingTimeout?: number; // Simulate loading - show spinner for this duration before displaying image
  spinnerSize?: LoadingSpinnerSize; // Size of loading spinner ('xs' | 'small' | 'medium' | 'large' | 'xl')
  spinnerVariant?: LoadingSpinnerVariant; // Variant of loading spinner ('default' | 'dots' | 'pulse' | 'bars' | 'circle' | 'custom')
  cachePolicy?: 'none' | 'disk' | 'memory' | 'memory-disk'; // expo-image cache policy
  priority?: 'low' | 'normal' | 'high'; // Image loading priority
}

export function LazyImage({
  source,
  style,
  containerStyle,
  placeholder,
  errorComponent,
  loadingComponent,
  fadeDuration = 300,
  showLoadingSpinner = true,
  showErrorIcon = true,
  resizeMode = 'cover',
  onLoad,
  onError,
  onLoadStart,
  onLoadEnd,
  testID,
  loadingTimeout,
  spinnerSize,
  spinnerVariant,
  cachePolicy = 'memory-disk',
  priority = 'normal' // Changed from 'high' to prevent network congestion
}: LazyImageProps) {
  const { theme } = useTheme();

  // Use theme defaults if props not provided
  const finalSpinnerSize = spinnerSize || theme.lazyImage.spinnerSize;
  const finalSpinnerVariant = spinnerVariant || theme.lazyImage.spinnerVariant;
  const finalLoadingTimeout = loadingTimeout || theme.lazyImage.defaultTimeout;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false); // Track if image has been loaded before
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSourceRef = useRef<string | number | null>(null); // Track the last source to detect changes

  const internalHandleLoadStart = useCallback(() => {
    const currentSource = typeof source === 'object' && source.uri ? source.uri : source;
    const sourceChanged = lastSourceRef.current !== currentSource;

    // If source changed, reset the loaded state
    if (sourceChanged) {
      setHasLoadedOnce(false);
      lastSourceRef.current = currentSource;
    }

    // If image has already been loaded once and source hasn't changed, skip loading state
    if (hasLoadedOnce && !sourceChanged) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);
    onLoadStart?.();
  }, [source, hasLoadedOnce, onLoadStart]);

  const handleLoad = useCallback((event: ImageLoadEventData) => {
    // Hide loading spinner when image is loaded
    setLoading(false);
    setHasLoadedOnce(true);
    onLoadEnd?.();
    onLoad?.(event);
  }, [onLoad, onLoadEnd]);

  const handleError = useCallback((error: ImageErrorEventData) => {
    setLoading(false);
    setError(true);
    onError?.(error);
    onLoadEnd?.();
  }, [onError, onLoadEnd]);

  const defaultStyle: ImageStyle = {
    width: '100%',
    height: '100%',
  };

  const containerDefaultStyle: ViewStyle = {
    position: 'relative',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  };

  const overlayStyle: ViewStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  };

  const renderLoadingComponent = useCallback(() => {
    if (loadingComponent) {
      return loadingComponent;
    }

    if (showLoadingSpinner) {
      return (
        <View style={overlayStyle}>
          <LoadingSpinner 
            size={finalSpinnerSize} 
            variant={finalSpinnerVariant}
            color={theme.colors.primary} 
          />
        </View>
      );
    }

    return null;
  }, [loadingComponent, showLoadingSpinner, overlayStyle, finalSpinnerSize, finalSpinnerVariant, theme.colors.primary]);

  const renderErrorComponent = () => {
    if (errorComponent) {
      return errorComponent;
    }

    if (showErrorIcon) {
      return (
        <View style={[overlayStyle, { backgroundColor: theme.colors.backgroundSecondary }]}>
          <Icon
            name="image-outline"
            size={32}
            color={theme.colors.textSecondary}
            style={{ marginBottom: theme.sizes.xs }}
          />
          <Text
            variant="caption"
            style={{
              color: theme.colors.textSecondary,
              textAlign: 'center',
              fontSize: 10
            }}
          >
            Failed to load
          </Text>
        </View>
      );
    }

    return null;
  };

  const renderPlaceholder = () => {
    if (placeholder) {
      return (
        <View style={overlayStyle}>
          {placeholder}
        </View>
      );
    }

    return (
      <View style={[overlayStyle, { backgroundColor: theme.colors.backgroundSecondary }]}>
        <Icon
          name="image-outline"
          size={24}
          color={theme.colors.textSecondary}
        />
      </View>
    );
  };

  return (
    <View style={[containerDefaultStyle, containerStyle, style]} testID={testID}>
      {/* Main Image using expo-image */}
      <Image
        source={source}
        style={defaultStyle}
        contentFit={resizeMode}
        transition={fadeDuration}
        cachePolicy={cachePolicy}
        onLoadStart={internalHandleLoadStart}
        onLoad={handleLoad}
        onError={handleError}
        priority={priority}
      />

      {/* Loading Overlay */}
      {loading && renderLoadingComponent()}

      {/* Error Overlay */}
      {error && renderErrorComponent()}
    </View>
  );
}

// Re-export types for convenience
export type { LoadingSpinnerSize, LoadingSpinnerVariant };