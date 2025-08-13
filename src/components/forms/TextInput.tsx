import React, { useState } from 'react';
import {
  View,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useRTL } from '@/contexts/RTLContext';
import { Text } from '@/components/ui/Text';
import { Icon, IconName } from '@/components/ui/Icon';
import { getFlexDirection, getRTLMargin, getRTLPadding, getTextAlign, createRTLStyle, getRTLIconName } from '@/utils';

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
  
  const { isRTL } = useRTL();
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
      textAlign: getTextAlign(isRTL),
      writingDirection: isRTL ? 'rtl' as const : 'ltr' as const,
    };
  };

  const getContainerStyle = () => {
    const baseStyle = {
      borderWidth: 1,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.surface,
      flexDirection: getFlexDirection(isRTL),
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

  // RTL-aware icon positioning 
  // In RTL: prefix icon (leftIcon) goes to visual right side, suffix icon (rightIcon) goes to visual left side
  const startIcon = leftIcon;                                 // Prefix icon always at start (left in LTR, right in RTL)
  const endIcon = getEffectiveRightIcon();                    // Suffix icon always at end (right in LTR, left in RTL)
  const isStartIconInteractive = false;                       // Prefix icons are not interactive
  const isEndIconInteractive = isRightIconInteractive;        // Suffix icons can be interactive (password toggle)

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
        {startIcon && (
          <View style={{ ...getRTLPadding(isRTL).paddingStart(theme.sizes.md) }}>
            <Icon
              name={getRTLIconName(startIcon, isRTL)}
              color={theme.colors.textSecondary}
              size={theme.fontSizes.lg}
            />
          </View>
        )}

        <RNTextInput
          style={getInputStyle()}
          placeholderTextColor={theme.colors.placeholder}
          editable={props.editable !== false}
          selectTextOnFocus={true}
          // textAlign handled by style
          secureTextEntry={actualSecureTextEntry}
          // Prevent iOS password auto-fill and "Use Strong Password" suggestions
          autoComplete={isPasswordField ? "off" : props.autoComplete}
          textContentType={isPasswordField ? "oneTimeCode" : props.textContentType}
          passwordRules={isPasswordField ? "" : undefined}
          autoCorrect={isPasswordField ? false : props.autoCorrect}
          spellCheck={isPasswordField ? false : props.spellCheck}
          autoCapitalize={isPasswordField ? "none" : props.autoCapitalize}
          keyboardType={isPasswordField ? "default" : props.keyboardType}
          {...(isPasswordField ? 
            // For password fields, filter out props that might trigger iOS suggestions
            Object.fromEntries(
              Object.entries(props).filter(([key]) => 
                !['secureTextEntry', 'autoComplete', 'textContentType', 'passwordRules', 'autoCorrect', 'spellCheck', 'autoCapitalize', 'keyboardType'].includes(key)
              )
            ) : 
            props
          )}
        />

        {endIcon && (
          <TouchableOpacity
            onPress={isEndIconInteractive ? togglePasswordVisibility : undefined}
            style={{ 
              ...getRTLPadding(isRTL).paddingEnd(theme.sizes.md),
              ...getRTLPadding(isRTL).paddingStart(theme.sizes.xs),
              justifyContent: 'center',
            }}
            activeOpacity={isEndIconInteractive ? 0.7 : 1}
            disabled={!isRightIconInteractive}
          >
            <Icon
              name={getRTLIconName(endIcon, isRTL)}
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