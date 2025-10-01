import React, { useEffect, useRef, useState } from 'react';
import {
  Modal as RNModal,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  ScrollView,
  Platform,
  Easing,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from './Text';
import { Button } from './Button';
import { Icon } from './Icon';
import { useTheme } from '@/contexts/ThemeContext';
import { useRTL } from '@/contexts/RTLContext';
import { getFlexDirection, getRTLMargin, getRTLPadding } from '@/utils';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export type ModalSize = 'small' | 'medium' | 'large' | 'fullscreen';
export type ModalPosition = 'center' | 'bottom' | 'top';
export type ModalVariant = 'default' | 'alert' | 'confirmation' | 'form' | 'custom';
export type ModalAnimation = 'slide' | 'fade' | 'scale' | 'none';

export interface ModalAction {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning' | 'outline-primary' | 'outline-secondary' | 'outline-danger' | 'outline-warning' | 'outline-success';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
}

export interface ModalProps {
  // Visibility
  visible: boolean;
  onClose: () => void;

  // Content
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;

  // Layout & Appearance
  size?: ModalSize;
  position?: ModalPosition;
  variant?: ModalVariant;
  animation?: ModalAnimation;

  // Header
  showHeader?: boolean;
  showCloseButton?: boolean;
  headerIcon?: string;
  headerActions?: React.ReactNode;

  // Footer
  showFooter?: boolean;
  actions?: ModalAction[];
  footerContent?: React.ReactNode;

  // Behavior
  dismissible?: boolean;
  closeOnBackdropPress?: boolean;
  closeOnHardwareBackPress?: boolean;

  // Styling
  backgroundColor?: string;
  backdropColor?: string;
  backdropOpacity?: number;
  borderRadius?: number;
  padding?: number;

  // Scrolling
  scrollable?: boolean;
  scrollViewProps?: any;

  // Advanced
  statusBarTranslucent?: boolean;
  presentationStyle?: 'pageSheet' | 'formSheet' | 'fullScreen' | 'overFullScreen';
  animationDuration?: number;

  // Callbacks
  onShow?: () => void;
  onDismiss?: () => void;
  onRequestClose?: () => void;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  subtitle,
  children,
  size = 'medium',
  position = 'center',
  variant = 'default',
  animation = 'slide',
  showHeader = true,
  showCloseButton = true,
  headerIcon,
  headerActions,
  showFooter = false,
  actions = [],
  footerContent,
  dismissible = true,
  closeOnBackdropPress = true,
  closeOnHardwareBackPress = true,
  backgroundColor,
  backdropColor,
  backdropOpacity = 0.5,
  borderRadius,
  padding,
  scrollable = false,
  scrollViewProps = {},
  statusBarTranslucent = true,
  presentationStyle = 'overFullScreen',
  animationDuration = 200,
  onShow,
  onDismiss,
  onRequestClose,
}) => {
  const { theme } = useTheme();
  const { isRTL } = useRTL();
  const insets = useSafeAreaInsets();
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [internalVisible, setInternalVisible] = useState(visible);

  // Animation effects
  useEffect(() => {
    if (visible) {
      setInternalVisible(true);
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: animationDuration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
      onShow?.();
    } else {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: animationDuration * 0.4, // Much faster close animation
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }).start(() => {
        setInternalVisible(false);
        onDismiss?.();
      });
    }
  }, [visible, animationDuration, onShow, onDismiss]);

  // Handle close
  const handleClose = () => {
    if (dismissible) {
      onClose();
    }
  };

  const handleBackdropPress = () => {
    if (closeOnBackdropPress) {
      handleClose();
    }
  };

  const handleRequestClose = () => {
    if (closeOnHardwareBackPress) {
      onRequestClose ? onRequestClose() : handleClose();
    }
  };

  // Size calculations
  const getModalDimensions = () => {
    const maxWidth = screenWidth - 40; // 20px margin on each side
    const maxHeight = screenHeight - 100; // 50px margin top/bottom

    switch (size) {
      case 'small':
        return {
          width: Math.min(320, maxWidth),
          maxHeight: Math.min(400, maxHeight),
        };
      case 'medium':
        return {
          width: Math.min(400, maxWidth),
          maxHeight: Math.min(600, maxHeight),
        };
      case 'large':
        return {
          width: Math.min(600, maxWidth),
          maxHeight: Math.min(800, maxHeight),
        };
      case 'fullscreen':
        return {
          width: screenWidth,
          height: screenHeight,
          maxHeight: screenHeight,
        };
      default:
        return {
          width: Math.min(400, maxWidth),
          maxHeight: Math.min(600, maxHeight),
        };
    }
  };

  // Animation transforms
  const getAnimationStyle = () => {
    switch (animation) {
      case 'slide':
        return {
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  position === 'bottom' ? 300 :
                  position === 'top' ? -300 : 50,
                  0
                ],
              }),
            },
          ],
          opacity: animatedValue,
        };
      case 'scale':
        return {
          transform: [
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ],
          opacity: animatedValue,
        };
      case 'fade':
        return {
          opacity: animatedValue,
        };
      case 'none':
        return {};
      default:
        return {
          opacity: animatedValue,
        };
    }
  };

  // Position styles
  const getPositionStyle = () => {
    const dimensions = getModalDimensions();

    switch (position) {
      case 'top':
        return {
          justifyContent: 'flex-start',
          paddingTop: insets.top + 20,
        };
      case 'bottom':
        return {
          justifyContent: 'flex-end',
          paddingBottom: insets.bottom + 20,
        };
      case 'center':
      default:
        return {
          justifyContent: 'center',
        };
    }
  };

  const dimensions = getModalDimensions();
  const modalBackgroundColor = backgroundColor || theme.colors.surface;
  const modalBorderRadius = borderRadius !== undefined ? borderRadius : theme.borderRadius.lg;
  const modalPadding = padding !== undefined ? padding : theme.sizes.md;

  // Variant-specific styling
  const getVariantStyles = () => {
    switch (variant) {
      case 'alert':
        return isRTL ? {
          borderRightWidth: 4,
          borderRightColor: theme.colors.warning,
        } : {
          borderLeftWidth: 4,
          borderLeftColor: theme.colors.warning,
        };
      case 'confirmation':
        return isRTL ? {
          borderRightWidth: 4,
          borderRightColor: theme.colors.primary,
        } : {
          borderLeftWidth: 4,
          borderLeftColor: theme.colors.primary,
        };
      case 'form':
        return {
          borderTopWidth: 3,
          borderTopColor: theme.colors.primary,
        };
      default:
        return {};
    }
  };

  const renderHeader = () => {
    if (!showHeader && !title && !subtitle) return null;

    return (
      <View style={[
        styles.header,
        {
          paddingHorizontal: modalPadding,
          paddingTop: modalPadding,
          paddingBottom: children ? theme.sizes.md : modalPadding,
          borderBottomWidth: children ? 1 : 0,
          borderBottomColor: theme.colors.border,
        }
      ]}>
        <View style={[styles.headerContent, { flexDirection: getFlexDirection(isRTL) }]}>
          {headerIcon && (
            <View style={[
              styles.headerIcon,
              {
                backgroundColor: theme.colors.primary + '20',
                ...getRTLMargin(isRTL).marginEnd(12),
              }
            ]}>
              <Icon
                name={headerIcon as any}
                size={24}
                color={theme.colors.primary}
              />
            </View>
          )}

          <View style={styles.headerText}>
            {title && (
              <Text
                variant="title"
                style={[
                  styles.title,
                  { color: theme.colors.text }
                ]}
              >
                {title}
              </Text>
            )}
            {subtitle && (
              <Text
                variant="body"
                style={[
                  styles.subtitle,
                  { color: theme.colors.textSecondary }
                ]}
              >
                {subtitle}
              </Text>
            )}
          </View>

          <View style={[styles.headerActions, { flexDirection: getFlexDirection(isRTL) }]}>
            {headerActions}
            {showCloseButton && (
              <TouchableOpacity
                onPress={handleClose}
                style={[
                  styles.closeButton,
                  {
                    backgroundColor: theme.colors.background,
                    ...getRTLMargin(isRTL).marginStart(8),
                  }
                ]}
                disabled={!dismissible}
              >
                <Icon
                  name="close-outline"
                  size={20}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    const contentStyle = {
      paddingHorizontal: modalPadding,
      paddingVertical: (!showHeader && !title && !subtitle) ? modalPadding : theme.sizes.md,
    };

    if (scrollable) {
      return (
        <ScrollView
          style={[styles.scrollContent, { maxHeight: dimensions.maxHeight - 200 }]}
          contentContainerStyle={contentStyle}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
          {...scrollViewProps}
        >
          {children}
        </ScrollView>
      );
    }

    return (
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
    );
  };

  const renderFooter = () => {
    if (!showFooter && !actions.length && !footerContent) return null;

    return (
      <View style={[
        styles.footer,
        {
          paddingHorizontal: modalPadding,
          paddingBottom: modalPadding,
          paddingTop: theme.sizes.md,
          borderTopWidth: (children || showHeader) ? 1 : 0,
          borderTopColor: theme.colors.border,
        }
      ]}>
        {footerContent}
        {actions.length > 0 && (
          <View style={[
            styles.actions,
            actions.length > 2 ? styles.actionsColumn : [styles.actionsRow, { flexDirection: getFlexDirection(isRTL) }]
          ]}>
            {actions.map((action, index) => (
              <Button
                key={index}
                title={action.title}
                variant={action.variant || 'outline'}
                size="medium"
                onPress={action.onPress}
                disabled={action.disabled}
                loading={action.loading}
                leftIcon={action.icon as any}
                style={[
                  actions.length > 2 ? styles.actionButtonColumn : styles.actionButtonRow,
                  index === actions.length - 1 && actions.length <= 2 ? getRTLMargin(isRTL).marginStart(theme.sizes.sm) : undefined,
                  {
                    paddingVertical: theme.sizes.sm,
                    paddingHorizontal: theme.sizes.md,
                  }
                ]}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <RNModal
      visible={internalVisible}
      transparent={true}
      animationType="none"
      statusBarTranslucent={statusBarTranslucent}
      presentationStyle={presentationStyle}
      onRequestClose={handleRequestClose}
      onShow={onShow}
      onDismiss={onDismiss}
    >
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              backgroundColor: backdropColor || '#000000',
              opacity: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, backdropOpacity],
              }),
            }
          ]}
        />
      </TouchableWithoutFeedback>

      {/* Modal Container */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[styles.container, getPositionStyle()]}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <Animated.View
          style={[
            styles.modal,
            {
              backgroundColor: modalBackgroundColor,
              borderRadius: size === 'fullscreen' ? 0 : modalBorderRadius,
              width: dimensions.width,
              height: size === 'fullscreen' ? dimensions.height : undefined,
              maxHeight: size === 'fullscreen' ? undefined : dimensions.maxHeight,
              // shadowColor: theme.colors.text,
              // shadowOffset: { width: 0, height: 10 },
              // shadowOpacity: 0.25,
              // shadowRadius: 20,
              borderColor: theme.colors.border,
              borderWidth: 1,
              elevation: 10,
            },
            getVariantStyles(),
            getAnimationStyle(),
          ]}
        >
          {renderHeader()}
          {renderContent()}
          {renderFooter()}
        </Animated.View>
      </KeyboardAvoidingView>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modal: {
    overflow: 'hidden',
  },
  header: {
    // Styling applied dynamically
  },
  headerContent: {
    alignItems: 'flex-start',
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  headerActions: {
    alignItems: 'center',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    // Styling applied dynamically
  },
  scrollContent: {
    // Styling applied dynamically
  },
  footer: {
    // Styling applied dynamically
  },
  actions: {
    // Base styling for actions container
  },
  actionsRow: {
    justifyContent: 'flex-end',
  },
  actionsColumn: {
    flexDirection: 'column',
  },
  actionButtonRow: {
    minWidth: 100,
  },
  actionButtonColumn: {
    width: '100%',
    marginBottom: 8,
  },
});