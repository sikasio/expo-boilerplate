import React, { useState } from 'react';
import {
  View,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Text } from './Text';
import { Icon, IconName } from './Icon';

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
  const [isFocused, setIsFocused] = useState(false);

  const getInputStyle = () => {
    return {
      flex: 1,
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
      paddingHorizontal: leftIcon || rightIcon ? theme.sizes.sm : theme.sizes.md,
      includeFontPadding: false,
    };
  };

  const getContainerStyle = () => {
    const baseStyle = {
      borderWidth: 1,
      borderRadius: theme.sizes.sm,
      backgroundColor: theme.colors.surface,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      height: 48,
    };

    if (error) {
      return {
        ...baseStyle,
        borderColor: theme.colors.error,
      };
    }

    if (isFocused) {
      return {
        ...baseStyle,
        borderColor: theme.colors.primary,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
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
              size={20}
            />
          </View>
        )}

        <RNTextInput
          style={[getInputStyle()]}
          placeholderTextColor={theme.colors.placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {rightIcon && (
          <View style={{ paddingRight: theme.sizes.md }}>
            <Icon
              name={rightIcon}
              color={theme.colors.textSecondary}
              size={20}
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