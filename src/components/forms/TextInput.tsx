import React from 'react';
import {
  View,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Text } from '../ui/Text';
import { Icon, IconName } from '../ui/Icon';

interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: IconName;
  rightIcon?: IconName;
  containerStyle?: ViewStyle;
}

export function TextInput({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerStyle,
  style,
  ...props
}: TextInputProps) {
  const { theme } = useTheme();

  const getInputStyle = () => {
    return {
      flex: 1,
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
      paddingHorizontal: leftIcon || rightIcon ? theme.sizes.sm : theme.sizes.md,
      paddingVertical: theme.sizes.sm,
      minHeight: 40,
      textAlign: 'left' as const,
      writingDirection: 'ltr' as const,
    };
  };

  const getContainerStyle = () => {
    const baseStyle = {
      borderWidth: 1,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.surface,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      minHeight: theme.sizes.xxl, // Use theme size instead of hardcoded 48
    };

    if (error) {
      return {
        ...baseStyle,
        borderColor: theme.colors.error,
      };
    }

    return {
      ...baseStyle,
      borderColor: theme.colors.border,
    };
  };

  return (
    <View style={[{ marginBottom: theme.sizes.md }, containerStyle]}>
      {label && (
        <Text
          variant="label"
          style={{
            marginBottom: theme.sizes.xs,
            color: error ? theme.colors.error : theme.colors.text,
          }}
        >
          {label}
        </Text>
      )}

      <View style={getContainerStyle()}>
        {leftIcon && (
          <View style={{ paddingLeft: theme.sizes.md }}>
            <Icon
              name={leftIcon}
              color={theme.colors.textSecondary}
              size={theme.fontSizes.lg} // Use theme font size instead of hardcoded 20
            />
          </View>
        )}

        <RNTextInput
          style={getInputStyle()}
          placeholderTextColor={theme.colors.placeholder}
          editable={props.editable !== false}
          selectTextOnFocus={true}
          textAlign="left"
          {...props}
        />

        {rightIcon && (
          <View style={{ paddingRight: theme.sizes.md }}>
            <Icon
              name={rightIcon}
              color={theme.colors.textSecondary}
              size={theme.fontSizes.lg} // Use theme font size instead of hardcoded 20
            />
          </View>
        )}
      </View>

      {(error || helperText) && (
        <Text
          variant="caption"
          style={{
            marginTop: theme.sizes.xs,
            color: error ? theme.colors.error : theme.colors.textSecondary,
          }}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
}