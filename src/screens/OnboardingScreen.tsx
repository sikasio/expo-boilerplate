import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  ViewStyle,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Animated,
  ImageSourcePropType,
  ImageBackground,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Icon, IconName } from '@/components/ui/Icon';
import { MiniView } from '@/components/ui';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export interface OnboardingSlide {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  icon?: IconName;
  image?: ImageSourcePropType;
  backgroundColor?: string;
  textColor?: string;
  features?: string[];
  animation?: 'fadeIn' | 'slideUp' | 'scale' | 'bounce';
}

export interface OnboardingScreenProps {
  slides: OnboardingSlide[];
  showSkipButton?: boolean;
  showProgressDots?: boolean;
  showProgressBar?: boolean;
  enableSwipeGestures?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  backgroundImage?: ImageSourcePropType;
  overlayOpacity?: number;
  imageWidth?: number;
  imageHeight?: number;
  onComplete?: () => void;
  onSkip?: () => void;
  onSlideChange?: (index: number) => void;
  skipButtonText?: string;
  nextButtonText?: string;
  doneButtonText?: string;
  enableAnimations?: boolean;
  style?: ViewStyle;
  testID?: string;
}


export function OnboardingScreen({
  slides,
  showSkipButton = true,
  showProgressDots = true,
  showProgressBar = false,
  enableSwipeGestures = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  backgroundImage,
  overlayOpacity = 0.3,
  imageWidth = 140,
  imageHeight = 140,
  onComplete,
  onSkip,
  onSlideChange,
  skipButtonText = 'Skip',
  nextButtonText = 'Next',
  doneButtonText = 'Get Started',
  enableAnimations = true,
  style,
  testID = 'onboarding-screen',
}: OnboardingScreenProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  // Early return if no slides provided
  if (!slides || slides.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: theme.colors.error, textAlign: 'center' }}>
          No slides provided for onboarding
        </Text>
      </SafeAreaView>
    );
  }

  // State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animation refs
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Auto play timer
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);

  // Initialize animations
  useEffect(() => {
    if (enableAnimations) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          delay: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          delay: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(1);
      slideAnim.setValue(0);
      scaleAnim.setValue(1);
    }
  }, [currentIndex]);

  // Auto play functionality
  useEffect(() => {
    if (autoPlay && !isAnimating) {
      autoPlayTimer.current = setInterval(() => {
        if (currentIndex < slides.length - 1) {
          goToNext();
        } else {
          clearInterval(autoPlayTimer.current!);
        }
      }, autoPlayInterval);
    }

    return () => {
      if (autoPlayTimer.current) {
        clearInterval(autoPlayTimer.current);
      }
    };
  }, [autoPlay, currentIndex, isAnimating]);

  // Progress animation
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentIndex + 1) / slides.length,
      duration: 300,
      useNativeDriver: false,
    }).start();

    onSlideChange?.(currentIndex);
  }, [currentIndex]);

  // Navigation functions
  const goToNext = () => {
    if (isAnimating || currentIndex >= slides.length - 1) return;

    setIsAnimating(true);
    const nextIndex = currentIndex + 1;

    scrollViewRef.current?.scrollTo({
      x: nextIndex * screenWidth,
      animated: true
    });

    setCurrentIndex(nextIndex);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const goToPrevious = () => {
    if (isAnimating || currentIndex <= 0) return;

    setIsAnimating(true);
    const prevIndex = currentIndex - 1;

    scrollViewRef.current?.scrollTo({
      x: prevIndex * screenWidth,
      animated: true
    });

    setCurrentIndex(prevIndex);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;

    setIsAnimating(true);

    scrollViewRef.current?.scrollTo({
      x: index * screenWidth,
      animated: true
    });

    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleComplete = () => {
    onComplete?.();
  };

  const handleSkip = () => {
    onSkip?.();
  };

  // Render functions
  const renderProgressBar = () => {
    if (!showProgressBar) return null;

    return (
      <View style={{
        height: 4,
        backgroundColor: theme.colors.border,
        marginHorizontal: theme.sizes.lg,
        marginTop: theme.sizes.md,
        borderRadius: 2,
        overflow: 'hidden',
      }}>
        <Animated.View
          style={{
            height: '100%',
            backgroundColor: theme.colors.primary,
            borderRadius: 2,
            width: progressAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          }}
        />
      </View>
    );
  };

  const renderProgressDots = () => {
    if (!showProgressDots) return null;

    return (
      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: theme.sizes.xxl,
      }}>
        {slides.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => goToSlide(index)}
            style={{
              width: currentIndex === index ? 24 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: currentIndex === index
                ? theme.colors.primary
                : theme.colors.border,
              marginHorizontal: 4,
              opacity: currentIndex === index ? 1 : 0.5,
            }}
            activeOpacity={0.7}
          />
        ))}
      </View>
    );
  };

  const renderSlide = (slide: OnboardingSlide, index: number) => {
    const isActive = index === currentIndex;

    return (
      <View
        key={slide.id}
        style={{
          width: screenWidth,
          flex: 1,
          paddingHorizontal: theme.sizes.lg,
          paddingTop: theme.sizes.xl,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Animated.View
          style={[
            {
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              maxWidth: 400,
            },
            enableAnimations && isActive
              ? {
                  opacity: fadeAnim,
                  transform: [
                    { translateY: slideAnim },
                    { scale: scaleAnim }
                  ],
                }
              : {
                  opacity: 1,
                  transform: [
                    { translateY: 0 },
                    { scale: 1 }
                  ],
                },
          ]}
        >
          {/* Icon/Image */}
          {slide.image ? (
            <View style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: theme.sizes.xl,
            }}>
              <Image
                source={slide.image}
                style={{
                  width: slide.id === 'welcome' ? 140 : imageWidth,
                  height: slide.id === 'welcome' ? 140 : imageHeight,
                }}
                resizeMode="contain"
              />
            </View>
          ) : slide.icon ? (
            <View style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: theme.colors.primary + '15',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: theme.sizes.xl,
              shadowColor: theme.colors.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.1,
              shadowRadius: 16,
              elevation: 8,
            }}>
              <Icon
                name={slide.icon}
                size={60}
                color={theme.colors.primary}
              />
            </View>
          ) : null}

          {/* Title */}
          <Text
            variant="title"
            style={{
              fontSize: theme.fontSizes.xxl + 2,
              marginBottom: theme.sizes.sm,
            }}
          >
            {slide.title}
          </Text>

          {/* Subtitle */}
          {slide.subtitle && (
            <Text
              variant="subtitle"
              style={{
                color: theme.colors.primary,
                marginBottom: theme.sizes.md,
              }}
            >
              {slide.subtitle}
            </Text>
          )}

          {/* Description */}
          <Text
            variant="body"
            style={{
              color: slide.textColor || theme.colors.textSecondary,
              textAlign: 'center',
              lineHeight: theme.fontSizes.md * 1.5,
              marginBottom: theme.sizes.xl,
              paddingHorizontal: theme.sizes.sm,
            }}
          >
            {slide.description}
          </Text>

          {/* Features */}
          {slide.features && slide.features.length > 0 && (
            <View style={{
              width: '100%',
              marginBottom: theme.sizes.md,
            }}>
              {slide.features.map((feature, featureIndex) => (
                <MiniView enableRTL
                  key={featureIndex}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: theme.sizes.xs,
                    paddingHorizontal: theme.sizes.md,
                  }}
                >
                  <Icon
                    name="checkmark-circle"
                    size={20}
                    color={theme.colors.success}
                    style={{ marginHorizontal: theme.sizes.sm }}
                  />
                  <Text
                    style={{
                      fontSize: theme.fontSizes.sm,
                      color: theme.colors.textSecondary,
                    }}
                  >
                    {feature}
                  </Text>
                </MiniView>
              ))}
            </View>
          )}
        </Animated.View>
      </View>
    );
  };

  const renderButtons = () => {
    const isLastSlide = currentIndex === slides.length - 1;

    return (
      <View style={{
        paddingHorizontal: theme.sizes.lg,
        paddingBottom: Math.max(insets.bottom, theme.sizes.md),
        paddingTop: theme.sizes.md,
      }}>
        {/* Conditional Layout: Centered for Last Slide, Row Layout for Others */}
        {isLastSlide ? (
          // Last slide: Centered button layout (no skip button)
          <View style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Button
              title={doneButtonText}
              variant="primary"
              size="medium"
              rightIcon="checkmark-outline"
              onPress={handleComplete}
              style={{
                minWidth: 160,
                backgroundColor: theme.colors.success,
                borderColor: theme.colors.success,
              }}
              disabled={isAnimating}
            />
          </View>
        ) : (
          // Other slides: Original row layout
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            {/* Skip Button */}
            {showSkipButton && (
              <Button
                title={skipButtonText}
                variant="ghost"
                size="medium"
                onPress={handleSkip}
                textStyle={{
                  color: theme.colors.textSecondary,
                  fontWeight: '500',
                }}
              />
            )}

            {/* Spacer when skip is hidden */}
            {!showSkipButton && <View style={{ flex: 1 }} />}

            {/* Next Button */}
            <Button
              title={nextButtonText}
              variant="primary"
              size="medium"
              leftIcon="chevron-back-outline"
              onPress={goToNext}
              style={{
                minWidth: 120,
              }}
              disabled={isAnimating}
            />
          </View>
        )}
      </View>
    );
  };

  const renderBackgroundImage = () => {
    if (!backgroundImage) return null;

    return (
      <ImageBackground
        source={backgroundImage}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        resizeMode="cover"
      >
        <View
          style={{
            flex: 1,
            backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
          }}
        />
      </ImageBackground>
    );
  };

  return (
    <SafeAreaView
      style={[
        {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        style
      ]}
      testID={testID}
    >
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
        translucent={false}
      />

      {renderBackgroundImage()}

      <View style={{ flex: 1 }}>
        {renderProgressBar()}

        {/* Top Back Button */}
        {currentIndex > 0 && (
          <View style={{
            position: 'absolute',
            top: insets.top + theme.sizes.sm,
            left: theme.sizes.md,
            zIndex: 100,
          }}>
            <TouchableOpacity
              onPress={goToPrevious}
              style={{
                width: 44,
                height: 44,
                borderRadius: theme.borderRadius.sm,
                backgroundColor: theme.colors.surface + 'CC',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}
              disabled={isAnimating}
              activeOpacity={0.7}
            >
              <Icon
                name="chevron-back-outline"
                size={24}
                color={theme.colors.text}
              />
            </TouchableOpacity>
          </View>
        )}

        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled={enableSwipeGestures}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
            if (index !== currentIndex) {
              setCurrentIndex(index);
            }
          }}
          style={{ flex: 1 }}
          contentContainerStyle={{
            width: screenWidth * slides.length,
            flexDirection: 'row'
          }}
        >
          {slides.map((slide, index) => renderSlide(slide, index))}
        </ScrollView>

        {renderProgressDots()}
        {renderButtons()}
      </View>
    </SafeAreaView>
  );
}

