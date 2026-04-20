import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
  Animated,
} from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent, State } from 'react-native-gesture-handler';
import { useTheme } from '../../contexts/ThemeContext';
import { Text } from './Text';
import { Icon } from './Icon';
import { LazyImage } from './LazyImage';

const { width: screenWidth } = Dimensions.get('window');

export interface GallerySliderItem {
  id: string;
  uri: string;
  title?: string;
  description?: string;
}

export interface GallerySliderProps {
  items: GallerySliderItem[];
  style?: StyleProp<ViewStyle>;
  height?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  showCounter?: boolean;
  showThumbnails?: boolean;
  thumbnailHeight?: number;
  enableZoom?: boolean;
  enableFullscreen?: boolean;
  loop?: boolean;
  snapToInterval?: boolean;
  imageDisplayMode?: 'cover' | 'contain' | 'stretch' | 'center';
  borderRadius?: number;
  onImageChange?: (index: number) => void;
  onImagePress?: (item: GallerySliderItem, index: number) => void;
  onFullscreenToggle?: (isFullscreen: boolean) => void;
}

export const GallerySlider: React.FC<GallerySliderProps> = ({
  items = [],
  style,
  height = 300,
  autoPlay = false,
  autoPlayInterval = 3000,
  showDots = true,
  showArrows = false,
  showCounter = false,
  showThumbnails = false,
  thumbnailHeight = 60,
  enableZoom = false,
  enableFullscreen = false,
  loop = true,
  snapToInterval = true,
  imageDisplayMode = 'cover',
  borderRadius,
  onImageChange,
  onImagePress,
  onFullscreenToggle,
}) => {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: height });
  const scrollViewRef = useRef<ScrollView>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const zoomScale = useRef(new Animated.Value(1)).current;
  const panX = useRef(new Animated.Value(0)).current;
  const panY = useRef(new Animated.Value(0)).current;

  const slideWidth = containerDimensions.width || screenWidth;
  const actualHeight = containerDimensions.height;

  const handleContainerLayout = useCallback((event: any) => {
    const { width, height: measuredHeight } = event.nativeEvent.layout;
    setContainerDimensions({ width, height: measuredHeight });
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && items.length > 1) {
      autoPlayRef.current = setInterval(() => {
        goToNext();
      }, autoPlayInterval);

      return () => {
        if (autoPlayRef.current) {
          clearInterval(autoPlayRef.current);
        }
      };
    }
  }, [autoPlay, autoPlayInterval, currentIndex, items.length]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  }, []);

  const startAutoPlay = useCallback(() => {
    if (autoPlay && items.length > 1) {
      autoPlayRef.current = setInterval(() => {
        goToNext();
      }, autoPlayInterval);
    }
  }, [autoPlay, autoPlayInterval]);

  const goToSlide = useCallback((index: number) => {
    const targetIndex = Math.max(0, Math.min(index, items.length - 1));
    setCurrentIndex(targetIndex);
    scrollViewRef.current?.scrollTo({
      x: targetIndex * slideWidth,
      animated: true,
    });
    onImageChange?.(targetIndex);
  }, [items.length, slideWidth, onImageChange]);

  const goToNext = useCallback(() => {
    if (loop && currentIndex === items.length - 1) {
      goToSlide(0);
    } else if (currentIndex < items.length - 1) {
      goToSlide(currentIndex + 1);
    }
  }, [currentIndex, items.length, loop, goToSlide]);

  const goToPrevious = useCallback(() => {
    if (loop && currentIndex === 0) {
      goToSlide(items.length - 1);
    } else if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  }, [currentIndex, items.length, loop, goToSlide]);

  const handleScroll = useCallback((event: any) => {
    const { contentOffset } = event.nativeEvent;
    const index = Math.round(contentOffset.x / slideWidth);
    const boundedIndex = Math.max(0, Math.min(index, items.length - 1));
    
    if (boundedIndex !== currentIndex) {
      setCurrentIndex(boundedIndex);
      onImageChange?.(boundedIndex);
    }
  }, [currentIndex, slideWidth, items.length, onImageChange]);

  const handleImagePress = useCallback((item: GallerySliderItem, index: number) => {
    if (enableFullscreen) {
      setIsFullscreen(!isFullscreen);
      onFullscreenToggle?.(!isFullscreen);
    }
    onImagePress?.(item, index);
  }, [enableFullscreen, isFullscreen, onFullscreenToggle, onImagePress]);

  const handleThumbnailPress = useCallback((index: number) => {
    goToSlide(index);
  }, [goToSlide]);

  // Zoom gesture handling
  const handlePanGesture = useCallback((event: PanGestureHandlerGestureEvent) => {
    if (!enableZoom) return;

    // `scale` isn't on the pan event payload type; this component was wired
    // against a mixed pinch/pan gesture originally. Cast to access it safely.
    const { translationX, translationY, scale, state } = event.nativeEvent as any;

    if (state === State.ACTIVE) {
      zoomScale.setValue(scale);
      panX.setValue(translationX);
      panY.setValue(translationY);
    } else if (state === State.END) {
      Animated.parallel([
        Animated.spring(zoomScale, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.spring(panX, {
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.spring(panY, {
          toValue: 0,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [enableZoom, zoomScale, panX, panY]);

  const renderImage = (item: GallerySliderItem, index: number) => {
    const imageContent = (
      <View key={item.id} style={{ width: slideWidth, height: actualHeight }}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => handleImagePress(item, index)}
          style={{ flex: 1 }}
        >
          {enableZoom ? (
            <PanGestureHandler onGestureEvent={handlePanGesture}>
              <Animated.View
                style={[
                  { flex: 1 },
                  {
                    transform: [
                      { scale: zoomScale },
                      { translateX: panX },
                      { translateY: panY },
                    ],
                  },
                ]}
              >
                <LazyImage
                  source={{ uri: item.uri }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode={imageDisplayMode}
                />
              </Animated.View>
            </PanGestureHandler>
          ) : (
            <LazyImage
              source={{ uri: item.uri }}
              style={{ width: '100%', height: '100%' }}
              resizeMode={imageDisplayMode}
            />
          )}

          {/* Image overlay with title/description */}
          {(item.title || item.description) && (
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                padding: theme.sizes.md,
              }}
            >
              {item.title && (
                <Text
                  variant="subtitle"
                  style={{
                    color: '#FFFFFF',
                    fontWeight: '600',
                    marginBottom: theme.sizes.xs,
                  }}
                >
                  {item.title}
                </Text>
              )}
              {item.description && (
                <Text
                  variant="caption"
                  style={{ color: 'rgba(255,255,255,0.8)' }}
                >
                  {item.description}
                </Text>
              )}
            </View>
          )}
        </TouchableOpacity>
      </View>
    );

    return imageContent;
  };

  const renderDots = () => {
    if (!showDots || items.length <= 1) return null;

    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: theme.sizes.sm,
          position: 'absolute',
          bottom: theme.sizes.sm,
          left: 0,
          right: 0,
        }}
      >
        {items.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => goToSlide(index)}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor:
                index === currentIndex
                  ? theme.colors.primary
                  : 'rgba(255,255,255,0.4)',
              marginHorizontal: 4,
            }}
          />
        ))}
      </View>
    );
  };

  const renderArrows = () => {
    if (!showArrows || items.length <= 1) return null;

    return (
      <>
        {/* Previous Arrow */}
        <TouchableOpacity
          onPress={goToPrevious}
          style={{
            position: 'absolute',
            left: theme.sizes.sm,
            top: '50%',
            marginTop: -20,
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
          }}
        >
          <Icon name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Next Arrow */}
        <TouchableOpacity
          onPress={goToNext}
          style={{
            position: 'absolute',
            right: theme.sizes.sm,
            top: '50%',
            marginTop: -20,
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
          }}
        >
          <Icon name="chevron-forward" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </>
    );
  };

  const renderCounter = () => {
    if (!showCounter || items.length <= 1) return null;

    return (
      <View
        style={{
          position: 'absolute',
          top: theme.sizes.sm,
          right: theme.sizes.sm,
          backgroundColor: 'rgba(0,0,0,0.6)',
          paddingHorizontal: theme.sizes.sm,
          paddingVertical: theme.sizes.xs,
          borderRadius: theme.borderRadius.sm,
          zIndex: 1,
        }}
      >
        <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>
          {currentIndex + 1} / {items.length}
        </Text>
      </View>
    );
  };

  const renderThumbnails = () => {
    if (!showThumbnails || items.length <= 1) return null;

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          height: thumbnailHeight,
          backgroundColor: theme.colors.surface,
        }}
        contentContainerStyle={{
          paddingHorizontal: theme.sizes.sm,
          alignItems: 'center',
        }}
      >
        {items.map((item, index) => (
          <TouchableOpacity
            key={`thumb-${item.id}`}
            onPress={() => handleThumbnailPress(index)}
            style={{
              marginRight: theme.sizes.sm,
              borderRadius: theme.borderRadius.sm,
              overflow: 'hidden',
              borderWidth: index === currentIndex ? 2 : 0,
              borderColor: theme.colors.primary,
            }}
          >
            <LazyImage
              source={{ uri: item.uri }}
              style={{
                width: thumbnailHeight - 8,
                height: thumbnailHeight - 8,
              }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  if (!items || items.length === 0) {
    return (
      <View
        style={[
          {
            height,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.md,
          },
          style,
        ]}
      >
        <Icon name="image-outline" size={48} color={theme.colors.textSecondary} />
        <Text
          variant="caption"
          style={{ color: theme.colors.textSecondary, marginTop: theme.sizes.sm }}
        >
          No images to display
        </Text>
      </View>
    );
  }

  return (
    <View style={style} onLayout={handleContainerLayout}>
      <View
        style={{
          height: actualHeight,
          borderRadius: borderRadius !== undefined ? borderRadius : theme.borderRadius.md,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onScrollBeginDrag={stopAutoPlay}
          onScrollEndDrag={startAutoPlay}
          onMomentumScrollEnd={handleScroll}
          bounces={false}
          decelerationRate="fast"
          snapToInterval={snapToInterval ? slideWidth : undefined}
          snapToAlignment="start"
        >
          {containerDimensions.width > 0 && items.map((item, index) => renderImage(item, index))}
        </ScrollView>

        {renderCounter()}
        {renderArrows()}
        {renderDots()}
      </View>

      {renderThumbnails()}
    </View>
  );
};