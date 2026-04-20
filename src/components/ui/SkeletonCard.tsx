import React, { useEffect, useRef } from 'react';
import {
  View,
  ViewProps,
  Animated,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export type SkeletonCardVariant = 'default' | 'elevated' | 'outlined';
export type SkeletonCardSize = 'small' | 'medium' | 'large';
export type SkeletonAnimation = 'pulse' | 'wave' | 'none';
export type SkeletonShape = 'rect' | 'circle' | 'rounded';

interface SkeletonLineProps {
  width?: string | number;
  height?: number | string;
  shape?: SkeletonShape;
  marginBottom?: number;
  animation?: SkeletonAnimation;
}

interface SkeletonCardProps extends ViewProps {
  // Card properties
  variant?: SkeletonCardVariant;
  size?: SkeletonCardSize;
  padding?: 'none' | 'small' | 'medium' | 'large';
  
  // Layout options
  horizontal?: boolean;
  showImage?: boolean;
  // Percentage strings are also valid (e.g. '100%').
  imageSize?: { width: number | string; height: number | string };
  imageShape?: SkeletonShape;
  
  // Header section
  showHeader?: boolean;
  headerLines?: number;
  
  // Content section
  showContent?: boolean;
  contentLines?: number;
  
  // Footer section
  showFooter?: boolean;
  footerLines?: number;
  showActions?: boolean;
  actionsCount?: number;
  
  // Animation
  animation?: SkeletonAnimation;
  animationSpeed?: number;
  
  // Custom layout
  customLayout?: React.ReactNode;
}

const SkeletonLine: React.FC<SkeletonLineProps> = ({
  width = '100%',
  height = 12,
  shape = 'rounded',
  marginBottom = 8,
  animation = 'pulse',
}) => {
  const { theme } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animation === 'none') return;

    const createAnimation = () => {
      return Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: animation === 'pulse' ? 1000 : 1500,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: animation === 'pulse' ? 1000 : 1500,
          useNativeDriver: false,
        }),
      ]);
    };

    const loopAnimation = () => {
      Animated.loop(createAnimation()).start();
    };

    loopAnimation();

    return () => {
      animatedValue.stopAnimation();
    };
  }, [animation, animatedValue]);

  const getShapeStyle = (): ViewStyle => {
    switch (shape) {
      case 'circle':
        return {
          borderRadius: Math.max(typeof height === 'number' ? height : 12) / 2,
        };
      case 'rect':
        return {
          borderRadius: 0,
        };
      default: // rounded
        return {
          borderRadius: theme.borderRadius.sm,
        };
    }
  };

  const animatedStyle = animation === 'none' ? {} : {
    opacity: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7],
    }),
  };

  if (animation === 'wave') {
    const translateX = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-100, 100],
    });

    return (
      <View
        style={[
          {
            width,
            height,
            backgroundColor: theme.colors.border,
            marginBottom,
            overflow: 'hidden',
          },
          getShapeStyle(),
        ] as any}
      >
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: theme.colors.surface,
              transform: [{ translateX }],
            },
          ]}
        />
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: theme.colors.border,
          marginBottom,
        },
        getShapeStyle(),
        animatedStyle,
      ] as any}
    />
  );
};

export function SkeletonCard({
  variant = 'default',
  size = 'medium',
  padding = 'medium',
  horizontal = false,
  showImage = true,
  imageSize,
  imageShape = 'rounded',
  showHeader = true,
  headerLines = 2,
  showContent = true,
  contentLines = 3,
  showFooter = false,
  footerLines = 1,
  showActions = false,
  actionsCount = 2,
  animation = 'pulse',
  animationSpeed = 1000,
  customLayout,
  style,
  ...props
}: SkeletonCardProps) {
  const { theme } = useTheme();

  // Get size-based dimensions
  const getSizeDimensions = () => {
    switch (size) {
      case 'small':
        return {
          borderRadius: theme.borderRadius.sm,
          minHeight: 80,
          imageSize: imageSize || { width: 40, height: 40 },
          titleHeight: 14,
          subtitleHeight: 12,
        };
      case 'large':
        return {
          borderRadius: theme.borderRadius.lg,
          minHeight: 160,
          imageSize: imageSize || { width: 80, height: 80 },
          titleHeight: 18,
          subtitleHeight: 14,
        };
      default: // medium
        return {
          borderRadius: theme.borderRadius.md,
          minHeight: 120,
          imageSize: imageSize || { width: 60, height: 60 },
          titleHeight: 16,
          subtitleHeight: 13,
        };
    }
  };

  const sizeDimensions = getSizeDimensions();

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: theme.colors.surface,
      borderRadius: sizeDimensions.borderRadius,
      flexDirection: horizontal ? 'row' : 'column',
      overflow: 'hidden',
      marginBottom: theme.sizes.md,
    };

    const paddingStyles = {
      none: {},
      small: { padding: theme.sizes.sm },
      medium: { padding: theme.sizes.md },
      large: { padding: theme.sizes.lg },
    };

    const variantStyles = {
      default: baseStyle,
      elevated: {
        ...baseStyle,
        shadowColor: theme.colors.text,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
      },
      outlined: {
        ...baseStyle,
        borderWidth: 1,
        borderColor: theme.colors.border,
      },
    };

    return {
      ...variantStyles[variant],
      ...(padding !== 'none' ? paddingStyles[padding] : {}),
    };
  };

  const renderImage = () => {
    if (!showImage) return null;

    return (
      <View
        style={[
          styles.imageContainer,
          horizontal && styles.horizontalImage,
          { marginRight: horizontal ? theme.sizes.md : 0 },
        ]}
      >
        <SkeletonLine
          width={sizeDimensions.imageSize.width}
          height={sizeDimensions.imageSize.height}
          shape={imageShape}
          marginBottom={horizontal ? 0 : theme.sizes.sm}
          animation={animation}
        />
      </View>
    );
  };

  const renderHeader = () => {
    if (!showHeader) return null;

    const lines = [];
    for (let i = 0; i < headerLines; i++) {
      const isTitle = i === 0;
      const width = isTitle ? '80%' : '60%';
      const height = isTitle ? sizeDimensions.titleHeight : sizeDimensions.subtitleHeight;

      lines.push(
        <SkeletonLine
          key={i}
          width={width}
          height={height}
          animation={animation}
          marginBottom={i === headerLines - 1 ? theme.sizes.md : theme.sizes.xs}
        />
      );
    }

    return <View style={styles.headerContainer}>{lines}</View>;
  };

  const renderContent = () => {
    if (!showContent) return null;

    const lines = [];
    for (let i = 0; i < contentLines; i++) {
      const width = i === contentLines - 1 ? '70%' : '100%';

      lines.push(
        <SkeletonLine
          key={i}
          width={width}
          height={12}
          animation={animation}
          marginBottom={theme.sizes.xs}
        />
      );
    }

    return <View style={styles.contentContainer}>{lines}</View>;
  };

  const renderFooter = () => {
    if (!showFooter && !showActions) return null;

    return (
      <View style={styles.footerContainer}>
        {showFooter && (
          <View style={styles.footerContent}>
            {Array.from({ length: footerLines }).map((_, i) => (
              <SkeletonLine
                key={i}
                width={i === footerLines - 1 ? '50%' : '100%'}
                height={12}
                animation={animation}
                marginBottom={theme.sizes.xs}
              />
            ))}
          </View>
        )}
        
        {showActions && (
          <View style={styles.actionsContainer}>
            {Array.from({ length: actionsCount }).map((_, i) => (
              <SkeletonLine
                key={i}
                width={80}
                height={36}
                shape="rounded"
                animation={animation}
                marginBottom={0}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderLayout = () => {
    if (customLayout) return customLayout;

    if (horizontal) {
      return (
        <View style={styles.horizontalLayout}>
          {renderImage()}
          <View style={styles.horizontalContent}>
            {renderHeader()}
            {renderContent()}
            {renderFooter()}
          </View>
        </View>
      );
    }

    return (
      <>
        {renderImage()}
        {renderHeader()}
        {renderContent()}
        {renderFooter()}
      </>
    );
  };

  return (
    <View style={[getCardStyle(), style]} {...props}>
      {renderLayout()}
    </View>
  );
}

// Predefined skeleton layouts for common use cases
export const BookCardSkeleton: React.FC<Omit<SkeletonCardProps, 'customLayout'>> = (props) => (
  <SkeletonCard
    showImage={true}
    imageSize={{ width: 120, height: 160 }}
    imageShape="rounded"
    showHeader={true}
    headerLines={2}
    showContent={true}
    contentLines={2}
    showFooter={true}
    footerLines={1}
    {...props}
  />
);

export const ProfileCardSkeleton: React.FC<Omit<SkeletonCardProps, 'customLayout'>> = (props) => (
  <SkeletonCard
    horizontal={true}
    showImage={true}
    imageSize={{ width: 60, height: 60 }}
    imageShape="circle"
    showHeader={true}
    headerLines={2}
    showContent={true}
    contentLines={1}
    {...props}
  />
);

export const ArticleCardSkeleton: React.FC<Omit<SkeletonCardProps, 'customLayout'>> = (props) => (
  <SkeletonCard
    showImage={true}
    imageSize={{ width: '100%', height: 180 }}
    imageShape="rounded"
    showHeader={true}
    headerLines={1}
    showContent={true}
    contentLines={3}
    showFooter={true}
    footerLines={1}
    {...props}
  />
);

export const ListItemSkeleton: React.FC<Omit<SkeletonCardProps, 'customLayout'>> = (props) => (
  <SkeletonCard
    horizontal={true}
    variant="outlined"
    padding="small"
    showImage={true}
    imageSize={{ width: 48, height: 48 }}
    imageShape="circle"
    showHeader={true}
    headerLines={2}
    showContent={false}
    showActions={true}
    actionsCount={1}
    {...props}
  />
);

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
  },
  horizontalImage: {
    alignItems: 'flex-start',
  },
  headerContainer: {
    marginBottom: 0,
  },
  contentContainer: {
    marginBottom: 0,
  },
  footerContainer: {
    marginTop: 16,
    paddingTop: 12,
  },
  footerContent: {
    marginBottom: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  horizontalLayout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  horizontalContent: {
    flex: 1,
  },
});