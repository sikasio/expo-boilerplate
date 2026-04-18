import React, { useState } from 'react';
import { TouchableOpacity, ViewStyle, View } from 'react-native';
import { Icon } from './Icon';
import { Text } from './Text';
import { MiniView } from './MiniView';
import { useTheme } from '../../contexts/ThemeContext';

export interface StarRatingProps {
  rating?: number;
  totalStars?: number;
  size?: number;
  interactive?: boolean;
  showRatingText?: boolean;
  onRatingChange?: (rating: number) => void;
  disabled?: boolean;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
}

export function StarRating({
  rating = 0,
  totalStars = 5,
  size = 20,
  interactive = false,
  showRatingText = false,
  onRatingChange,
  disabled = false,
  style,
  containerStyle,
}: StarRatingProps) {
  const { theme } = useTheme();
  const [currentRating, setCurrentRating] = useState(rating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarPress = (starIndex: number) => {
    if (!interactive || disabled) return;

    const newRating = starIndex + 1;
    setCurrentRating(newRating);
    onRatingChange?.(newRating);
  };

  const renderStar = (index: number) => {
    const starValue = index + 1;
    const isActive = (hoverRating || currentRating) >= starValue;
    const isHalfActive = !isActive && (hoverRating || currentRating) >= starValue - 0.5;

    return (
      <TouchableOpacity
        key={index}
        onPress={() => handleStarPress(index)}
        disabled={!interactive || disabled}
        style={{
          padding: 2,
          opacity: disabled ? 0.5 : 1,
        }}
        activeOpacity={interactive ? 0.7 : 1}
      >
        <Icon
          name={isActive ? "star" : isHalfActive ? "star-half" : "star-outline"}
          size={size}
          color={isActive || isHalfActive ? "#FFD700" : theme.colors.textSecondary}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        {
          alignItems: 'center',
          gap: showRatingText ? 8 : 0,
        },
        containerStyle,
      ]}
    >
      <MiniView enableRTL style={[
        style
      ]}>
        {Array.from({ length: totalStars }, (_, index) => renderStar(index))}
      </MiniView>

      {showRatingText && (
        <Text
          variant="body"
          style={{
            color: theme.colors.textSecondary,
            fontSize: size * 0.7,
            fontWeight: '500',
          }}
        >
          {currentRating.toFixed(1)} / {totalStars}
        </Text>
      )}
    </View>
  );
}