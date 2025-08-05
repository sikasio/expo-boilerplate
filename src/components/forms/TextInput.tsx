import React, { useState } from 'react';
import {
  View,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Text } from '@/components/ui/Text';
import { Icon, IconName } from '@/components/ui/Icon';

interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: IconName;
  rightIcon?: IconName;
  containerStyle?: ViewStyle;
  showPasswordToggle?: boolean;
}

export function TextInput({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerStyle,
  style,
  secureTextEntry,
  showPasswordToggle = true,
  ...props
}: TextInputProps) {
  const { theme } = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Detect if this is a password field with toggle enabled
  const isPasswordField = Boolean(secureTextEntry);
  const shouldShowPasswordToggle = isPasswordField && showPasswordToggle;
  
  // Determine the actual secureTextEntry value
  const actualSecureTextEntry = shouldShowPasswordToggle ? !isPasswordVisible : Boolean(secureTextEntry);
  
  // Determine the right icon to show
  const getEffectiveRightIcon = (): IconName | undefined => {
    if (shouldShowPasswordToggle) {
      return isPasswordVisible ? 'eye-off-outline' : 'eye-outline';
    }
    return rightIcon;
  };

  const togglePasswordVisibility = () => {
    if (shouldShowPasswordToggle) {
      setIsPasswordVisible(!isPasswordVisible);
    }
  };

  // Determine if right icon should be interactive
  const isRightIconInteractive = shouldShowPasswordToggle;

  const getInputStyle = () => {
    return {
      flex: 1,
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
      paddingHorizontal: leftIcon || getEffectiveRightIcon() ? theme.sizes.sm : theme.sizes.md,
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
          secureTextEntry={actualSecureTextEntry}
          {...props}
        />

        {getEffectiveRightIcon() && (
          <TouchableOpacity
            onPress={isRightIconInteractive ? togglePasswordVisibility : undefined}
            style={{ 
              paddingRight: theme.sizes.md,
              paddingLeft: theme.sizes.xs,
              justifyContent: 'center',
            }}
            activeOpacity={isRightIconInteractive ? 0.7 : 1}
            disabled={!isRightIconInteractive}
          >
            <Icon
              name={getEffectiveRightIcon()!}
              color={theme.colors.textSecondary}
              size={theme.fontSizes.lg}
            />
          </TouchableOpacity>
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