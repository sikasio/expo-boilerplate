import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  ScrollView,
  View,
  ViewStyle,
  ScrollViewProps,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardProps } from './Card';
import { Text } from './Text';
import { Button } from './Button';
import { Icon, IconName } from './Icon';
import { LoadingSpinner } from './LoadingSpinner';

const { width: screenWidth } = Dimensions.get('window');

export type HorizontalCardScrollVariant = 'default' | 'compact' | 'hero' | 'gallery';
export type HorizontalCardScrollSize = 'small' | 'medium' | 'large';

export interface CardData {
  id: string | number;
  title?: string;
  subtitle?: string;
  description?: string;
  icon?: IconName;
  image?: string;
  badge?: string;
  price?: string;
  rating?: number;
  tags?: string[];
  onPress?: () => void;
  cardProps?: Partial<CardProps>;
}

export interface HorizontalCardScrollProps extends Omit<ScrollViewProps, 'horizontal'> {
  data: CardData[];
  variant?: HorizontalCardScrollVariant;
  size?: HorizontalCardScrollSize;
  cardWidth?: number;
  cardHeight?: number;
  spacing?: number;
  showIndicators?: boolean;
  showScrollButtons?: boolean;
  title?: string;
  subtitle?: string;
  headerAction?: {
    title: string;
    onPress: () => void;
    icon?: IconName;
  };
  contentPadding?: number;
  snapToCards?: boolean;
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  refreshing?: boolean;
  onRefresh?: () => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  centerMode?: boolean;
  autoScroll?: boolean;
  autoScrollInterval?: number;
  renderCard?: (item: CardData, index: number) => React.ReactNode;
  renderEmpty?: () => React.ReactNode;
  renderError?: (error: string) => React.ReactNode;
  renderLoading?: () => React.ReactNode;
}

export function HorizontalCardScroll({
  data,
  variant = 'default',
  size = 'medium',
  cardWidth,
  cardHeight,
  spacing,
  showIndicators = false,
  showScrollButtons = false,
  title,
  subtitle,
  headerAction,
  contentPadding,
  snapToCards = true,
  loading = false,
  error,
  emptyMessage = 'No items to display',
  refreshing = false,
  onRefresh,
  onLoadMore,
  hasMore = false,
  centerMode = false,
  autoScroll = false,
  autoScrollInterval = 3000,
  renderCard,
  renderEmpty,
  renderError,
  renderLoading,
  style,
  ...scrollViewProps
}: HorizontalCardScrollProps) {
  const { theme } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const autoScrollTimer = useRef<NodeJS.Timeout>();

  // Get default values based on variant and size
  const getDefaultCardWidth = () => {
    if (cardWidth) return cardWidth;
    
    const sizeMultiplier = size === 'small' ? 0.8 : size === 'large' ? 1.2 : 1;
    
    switch (variant) {
      case 'compact':
        return 120 * sizeMultiplier;
      case 'hero':
        return screenWidth * 0.85;
      case 'gallery':
        return 200 * sizeMultiplier;
      default:
        return 280 * sizeMultiplier;
    }
  };

  const getDefaultCardHeight = () => {
    if (cardHeight) return cardHeight;
    
    const sizeMultiplier = size === 'small' ? 0.8 : size === 'large' ? 1.2 : 1;
    
    switch (variant) {
      case 'compact':
        return 80 * sizeMultiplier;
      case 'hero':
        return 200 * sizeMultiplier;
      case 'gallery':
        return 160 * sizeMultiplier;
      default:
        return 160 * sizeMultiplier;
    }
  };

  const getDefaultSpacing = () => {
    if (spacing !== undefined) return spacing;
    return variant === 'compact' ? 8 : variant === 'hero' ? 20 : 16;
  };

  const getDefaultContentPadding = () => {
    if (contentPadding !== undefined) return contentPadding;
    return variant === 'hero' ? 20 : 16;
  };

  const finalCardWidth = getDefaultCardWidth();
  const finalCardHeight = getDefaultCardHeight();
  const finalSpacing = getDefaultSpacing();
  const finalContentPadding = getDefaultContentPadding();

  // Auto scroll functionality
  useEffect(() => {
    if (autoScroll && data.length > 1 && !loading) {
      autoScrollTimer.current = setInterval(() => {
        const nextIndex = (currentIndex + 1) % data.length;
        scrollToIndex(nextIndex);
      }, autoScrollInterval);

      return () => {
        if (autoScrollTimer.current) {
          clearInterval(autoScrollTimer.current);
        }
      };
    }
  }, [autoScroll, currentIndex, data.length, loading, autoScrollInterval]);

  const scrollToIndex = useCallback((index: number) => {
    if (scrollViewRef.current && data.length > 0) {
      const targetX = index * (finalCardWidth + finalSpacing);
      scrollViewRef.current.scrollTo({ x: targetX, animated: true });
      setCurrentIndex(index);
    }
  }, [finalCardWidth, finalSpacing, data.length]);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = event.nativeEvent;
    setScrollX(contentOffset.x);
    
    if (snapToCards) {
      const index = Math.round(contentOffset.x / (finalCardWidth + finalSpacing));
      setCurrentIndex(Math.max(0, Math.min(index, data.length - 1)));
    }

    // Load more trigger
    if (onLoadMore && hasMore) {
      const { layoutMeasurement, contentSize } = event.nativeEvent;
      const paddingToBottom = 20;
      if (layoutMeasurement.width + contentOffset.x >= contentSize.width - paddingToBottom) {
        onLoadMore();
      }
    }
  }, [snapToCards, finalCardWidth, finalSpacing, data.length, onLoadMore, hasMore]);

  const scrollLeft = useCallback(() => {
    const newIndex = Math.max(0, currentIndex - 1);
    scrollToIndex(newIndex);
  }, [currentIndex, scrollToIndex]);

  const scrollRight = useCallback(() => {
    const newIndex = Math.min(data.length - 1, currentIndex + 1);
    scrollToIndex(newIndex);
  }, [currentIndex, data.length, scrollToIndex]);

  const renderDefaultCard = (item: CardData, index: number) => {
    const cardStyle: ViewStyle = {
      width: finalCardWidth,
      height: finalCardHeight,
      marginRight: index === data.length - 1 ? 0 : finalSpacing,
    };

    if (centerMode && variant === 'hero') {
      const inputRange = [
        (index - 1) * (finalCardWidth + finalSpacing),
        index * (finalCardWidth + finalSpacing),
        (index + 1) * (finalCardWidth + finalSpacing),
      ];
      // Add scale animation based on scroll position (simplified for this example)
    }

    return (
      <Card
        key={item.id}
        title={item.title}
        subtitle={item.subtitle}
        description={item.description}
        headerIcon={item.icon}
        onPress={item.onPress}
        variant={variant === 'hero' ? 'elevated' : 'outlined'}
        style={cardStyle}
        {...item.cardProps}
      >
        {/* Badge */}
        {item.badge && (
          <View style={{
            position: 'absolute',
            top: theme.sizes.sm,
            right: theme.sizes.sm,
            backgroundColor: theme.colors.primary,
            paddingHorizontal: theme.sizes.sm,
            paddingVertical: theme.sizes.xs,
            borderRadius: theme.borderRadius.sm,
            zIndex: 1,
          }}>
            <Text style={{
              color: '#FFFFFF',
              fontSize: theme.fontSizes.xs,
              fontWeight: '600',
            }}>
              {item.badge}
            </Text>
          </View>
        )}

        {/* Price */}
        {item.price && (
          <View style={{ marginTop: theme.sizes.sm }}>
            <Text style={{
              fontSize: theme.fontSizes.lg,
              fontWeight: '700',
              color: theme.colors.primary,
            }}>
              {item.price}
            </Text>
          </View>
        )}

        {/* Rating */}
        {item.rating && (
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            marginTop: theme.sizes.xs 
          }}>
            {[...Array(5)].map((_, i) => (
              <Icon
                key={i}
                name={i < Math.floor(item.rating!) ? 'star' : 'star-outline'}
                size={12}
                color={theme.colors.warning}
                style={{ marginRight: 2 }}
              />
            ))}
            <Text style={{
              fontSize: theme.fontSizes.xs,
              color: theme.colors.textSecondary,
              marginLeft: theme.sizes.xs,
            }}>
              {item.rating.toFixed(1)}
            </Text>
          </View>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <View style={{ 
            flexDirection: 'row', 
            flexWrap: 'wrap',
            marginTop: theme.sizes.sm,
            gap: theme.sizes.xs,
          }}>
            {item.tags.slice(0, 3).map((tag, tagIndex) => (
              <View
                key={tagIndex}
                style={{
                  backgroundColor: theme.colors.background,
                  paddingHorizontal: theme.sizes.xs,
                  paddingVertical: 2,
                  borderRadius: theme.borderRadius.xs,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                }}
              >
                <Text style={{
                  fontSize: theme.fontSizes.xs,
                  color: theme.colors.textSecondary,
                }}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Card>
    );
  };

  const renderDefaultEmpty = () => (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: theme.sizes.xl,
    }}>
      <Icon 
        name="albums-outline" 
        size={48} 
        color={theme.colors.textSecondary} 
      />
      <Text style={{
        color: theme.colors.textSecondary,
        marginTop: theme.sizes.sm,
        textAlign: 'center',
      }}>
        {emptyMessage}
      </Text>
    </View>
  );

  const renderDefaultError = (errorMessage: string) => (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: theme.sizes.xl,
    }}>
      <Icon 
        name="alert-circle-outline" 
        size={48} 
        color={theme.colors.error} 
      />
      <Text style={{
        color: theme.colors.error,
        marginTop: theme.sizes.sm,
        textAlign: 'center',
      }}>
        {errorMessage}
      </Text>
      {onRefresh && (
        <Button
          title="Try Again"
          variant="outline"
          size="small"
          onPress={onRefresh}
          style={{ marginTop: theme.sizes.md }}
        />
      )}
    </View>
  );

  const renderDefaultLoading = () => (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: theme.sizes.xl,
    }}>
      <LoadingSpinner size="large" />
      <Text style={{
        color: theme.colors.textSecondary,
        marginTop: theme.sizes.sm,
        textAlign: 'center',
      }}>
        Loading...
      </Text>
    </View>
  );

  const containerStyle: ViewStyle = {
    marginBottom: theme.sizes.md,
  };

  // Loading state
  if (loading && renderLoading) {
    return renderLoading();
  }
  if (loading) {
    return renderDefaultLoading();
  }

  // Error state
  if (error && renderError) {
    return renderError(error);
  }
  if (error) {
    return renderDefaultError(error);
  }

  // Empty state
  if (data.length === 0 && renderEmpty) {
    return renderEmpty();
  }
  if (data.length === 0) {
    return renderDefaultEmpty();
  }

  return (
    <View style={[containerStyle, style]}>
      {/* Header */}
      {(title || subtitle || headerAction) && (
        <View style={{ 
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: headerAction ? 'center' : 'flex-start',
          paddingHorizontal: finalContentPadding,
          marginBottom: theme.sizes.md,
        }}>
          <View style={{ flex: 1 }}>
            {title && (
              <Text variant="subtitle" style={{ 
                fontWeight: '600',
                marginBottom: subtitle ? theme.sizes.xs : 0,
              }}>
                {title}
              </Text>
            )}
            {subtitle && (
              <Text variant="body" style={{ 
                color: theme.colors.textSecondary,
              }}>
                {subtitle}
              </Text>
            )}
          </View>
          {headerAction && (
            <Button
              title={headerAction.title}
              variant="ghost"
              size="small"
              rightIcon={headerAction.icon}
              onPress={headerAction.onPress}
            />
          )}
        </View>
      )}

      {/* Scroll Buttons */}
      {showScrollButtons && data.length > 1 && (
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'absolute',
          top: (title || subtitle) ? 60 : 20,
          left: 0,
          right: 0,
          zIndex: 2,
          paddingHorizontal: finalContentPadding,
        }}>
          <TouchableOpacity
            onPress={scrollLeft}
            disabled={currentIndex === 0}
            style={{
              backgroundColor: theme.colors.background,
              borderRadius: 20,
              padding: theme.sizes.sm,
              opacity: currentIndex === 0 ? 0.5 : 1,
              shadowColor: theme.colors.text,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            <Icon name="chevron-back" size={20} color={theme.colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={scrollRight}
            disabled={currentIndex === data.length - 1}
            style={{
              backgroundColor: theme.colors.background,
              borderRadius: 20,
              padding: theme.sizes.sm,
              opacity: currentIndex === data.length - 1 ? 0.5 : 1,
              shadowColor: theme.colors.text,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            <Icon name="chevron-forward" size={20} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      )}

      {/* Horizontal ScrollView */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={showIndicators}
        contentContainerStyle={{
          paddingHorizontal: finalContentPadding,
        }}
        snapToInterval={snapToCards ? finalCardWidth + finalSpacing : undefined}
        decelerationRate={snapToCards ? 'fast' : 'normal'}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined}
        {...scrollViewProps}
      >
        {data.map((item, index) => 
          renderCard ? renderCard(item, index) : renderDefaultCard(item, index)
        )}
        
        {/* Load More Indicator */}
        {hasMore && (
          <View style={{
            width: 80,
            height: finalCardHeight,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: finalSpacing,
          }}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={{
              fontSize: theme.fontSizes.xs,
              color: theme.colors.textSecondary,
              marginTop: theme.sizes.xs,
            }}>
              Loading...
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Page Indicators */}
      {snapToCards && data.length > 1 && variant !== 'compact' && (
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: theme.sizes.md,
          gap: theme.sizes.xs,
        }}>
          {data.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => scrollToIndex(index)}
              style={{
                width: currentIndex === index ? 20 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: currentIndex === index 
                  ? theme.colors.primary 
                  : theme.colors.textSecondary + '40',
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
}