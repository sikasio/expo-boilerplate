import React from 'react';
import {
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from './Button';
import { IconName } from './Icon';

export type ButtonGroupOrientation = 'horizontal' | 'vertical';
export type ButtonGroupVariant = 'attached' | 'separated';
export type ButtonGroupSize = 'small' | 'medium' | 'large';

export interface ButtonGroupItem {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: IconName;
  rightIcon?: IconName;
  selected?: boolean;
}

interface ButtonGroupProps extends ViewProps {
  buttons: ButtonGroupItem[];
  orientation?: ButtonGroupOrientation;
  variant?: ButtonGroupVariant;
  size?: ButtonGroupSize;
  fullWidth?: boolean;
  allowMultipleSelection?: boolean;
  allowDeselection?: boolean;
  onSelectionChange?: (selectedIndices: number[]) => void;
  selectedIndices?: number[];
}

export function ButtonGroup({
  buttons,
  orientation = 'horizontal',
  variant = 'attached',
  size = 'medium',
  fullWidth = false,
  allowMultipleSelection = false,
  allowDeselection = true,
  onSelectionChange,
  selectedIndices = [],
  style,
  ...props
}: ButtonGroupProps) {
  const { theme } = useTheme();

  const handleButtonPress = (index: number, originalOnPress: () => void) => {
    // Handle selection logic if onSelectionChange is provided
    if (onSelectionChange) {
      let newSelectedIndices = [...selectedIndices];
      
      if (allowMultipleSelection) {
        if (selectedIndices.includes(index)) {
          if (allowDeselection) {
            newSelectedIndices = selectedIndices.filter(i => i !== index);
          }
        } else {
          newSelectedIndices.push(index);
        }
      } else {
        if (selectedIndices.includes(index) && allowDeselection) {
          newSelectedIndices = [];
        } else {
          newSelectedIndices = [index];
        }
      }
      
      onSelectionChange(newSelectedIndices);
    }
    
    // Call the original onPress
    originalOnPress();
  };

  const getGroupStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: orientation === 'horizontal' ? 'row' : 'column',
    };

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    if (variant === 'separated') {
      baseStyle.gap = theme.sizes.xs;
    }

    return baseStyle;
  };

  const getButtonStyle = (index: number, isSelected: boolean): ViewStyle => {
    const isFirst = index === 0;
    const isLast = index === buttons.length - 1;
    
    if (variant === 'separated') {
      return fullWidth && orientation === 'horizontal' 
        ? { flex: 1 } 
        : {};
    }

    // Attached style
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.none,
    };

    if (fullWidth && orientation === 'horizontal') {
      baseStyle.flex = 1;
    }

    if (orientation === 'horizontal') {
      if (isFirst) {
        baseStyle.borderTopLeftRadius = theme.sizes.sm;
        baseStyle.borderBottomLeftRadius = theme.sizes.sm;
      }
      if (isLast) {
        baseStyle.borderTopRightRadius = theme.sizes.sm;
        baseStyle.borderBottomRightRadius = theme.sizes.sm;
      }
      if (!isLast && variant === 'attached') {
        baseStyle.borderRightWidth = 0;
      }
    } else {
      // Vertical orientation
      if (isFirst) {
        baseStyle.borderTopLeftRadius = theme.sizes.sm;
        baseStyle.borderTopRightRadius = theme.sizes.sm;
      }
      if (isLast) {
        baseStyle.borderBottomLeftRadius = theme.sizes.sm;
        baseStyle.borderBottomRightRadius = theme.sizes.sm;
      }
      if (!isLast && variant === 'attached') {
        baseStyle.borderBottomWidth = 0;
      }
    }

    return baseStyle;
  };

  const getButtonVariant = (button: ButtonGroupItem, index: number): 'primary' | 'secondary' | 'outline' | 'ghost' => {
    // If selection is managed by the group
    if (onSelectionChange) {
      const isSelected = selectedIndices.includes(index);
      if (isSelected) {
        return 'primary';
      } else {
        return variant === 'attached' ? 'outline' : (button.variant || 'outline');
      }
    }
    
    // Use individual button's variant or default
    return button.variant || 'outline';
  };

  return (
    <View style={[getGroupStyle(), style]} {...props}>
      {buttons.map((button, index) => {
        const isSelected = selectedIndices.includes(index);
        const buttonVariant = getButtonVariant(button, index);
        const buttonStyle = getButtonStyle(index, isSelected);

        return (
          <Button
            key={index}
            title={button.title}
            variant={buttonVariant}
            size={size}
            disabled={button.disabled}
            loading={button.loading}
            leftIcon={button.leftIcon}
            rightIcon={button.rightIcon}
            onPress={() => handleButtonPress(index, button.onPress)}
            style={buttonStyle}
          />
        );
      })}
    </View>
  );
}