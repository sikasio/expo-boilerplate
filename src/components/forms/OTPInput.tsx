import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput as RNTextInput,
  ViewStyle,
  Pressable,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Text } from '@/components/ui/Text';

interface OTPInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
  onChangeText?: (otp: string) => void;
  label?: string;
  error?: string;
  helperText?: string;
  containerStyle?: ViewStyle;
  cellStyle?: ViewStyle;
  autoFocus?: boolean;
  secureTextEntry?: boolean;
}

export function OTPInput({
  length = 6,
  onComplete,
  onChangeText,
  label,
  error,
  helperText,
  containerStyle,
  cellStyle,
  autoFocus = true,
  secureTextEntry = false,
}: OTPInputProps) {
  const { theme } = useTheme();
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const inputRefs = useRef<(RNTextInput | null)[]>([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleTextChange = (text: string, index: number) => {
    // Only allow single digit/character
    const sanitizedText = text.slice(-1);
    
    const newOtp = [...otp];
    newOtp[index] = sanitizedText;
    setOtp(newOtp);

    const otpString = newOtp.join('');
    onChangeText?.(otpString);

    // Auto-focus next input
    if (sanitizedText && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if OTP is complete
    if (otpString.length === length && !otpString.includes('')) {
      onComplete?.(otpString);
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        // If current cell is empty, move to previous cell
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current cell
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
        onChangeText?.(newOtp.join(''));
      }
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(-1);
  };

  const handleCellPress = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const getCellStyle = (index: number) => {
    const baseStyle = {
      width: 48,
      height: 48,
      borderWidth: 1,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.surface,
      textAlign: 'center' as const,
      fontSize: theme.fontSizes.lg,
      color: theme.colors.text,
      textAlignVertical: 'center' as const,
    };

    let borderColor = theme.colors.border;
    
    if (error) {
      borderColor = theme.colors.error;
    } else if (focusedIndex === index) {
      borderColor = theme.colors.primary;
    } else if (otp[index]) {
      borderColor = theme.colors.success;
    }

    return {
      ...baseStyle,
      borderColor,
      ...(focusedIndex === index && {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
      }),
      ...cellStyle,
    };
  };

  const clearOTP = () => {
    setOtp(new Array(length).fill(''));
    onChangeText?.('');
    inputRefs.current[0]?.focus();
  };

  return (
    <View style={[{ marginBottom: theme.sizes.md }, containerStyle]}>
      {label && (
        <Text
          variant="label"
          style={{
            marginBottom: theme.sizes.sm,
            color: error ? theme.colors.error : theme.colors.text,
          }}
        >
          {label}
        </Text>
      )}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: theme.sizes.sm,
        }}
      >
        {otp.map((digit, index) => (
          <Pressable
            key={index}
            onPress={() => handleCellPress(index)}
            style={{ flex: 1, alignItems: 'center' }}
          >
            <RNTextInput
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={getCellStyle(index)}
              value={secureTextEntry ? (digit ? '•' : '') : digit}
              onChangeText={(text) => handleTextChange(text, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              onFocus={() => handleFocus(index)}
              onBlur={handleBlur}
              keyboardType="numeric"
              maxLength={1}
              selectTextOnFocus={false}
              textAlign="center"
              autoCorrect={false}
              autoComplete="sms-otp"
              textContentType="oneTimeCode"
            />
          </Pressable>
        ))}
      </View>

      {/* Clear button for development/testing */}
      {__DEV__ && otp.some(digit => digit !== '') && (
        <Pressable
          onPress={clearOTP}
          style={{
            marginTop: theme.sizes.sm,
            alignSelf: 'center',
            paddingHorizontal: theme.sizes.md,
            paddingVertical: theme.sizes.xs,
            backgroundColor: theme.colors.textSecondary + '20',
            borderRadius: theme.borderRadius.xs,
          }}
        >
          <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
            Clear (Dev only)
          </Text>
        </Pressable>
      )}

      {(error || helperText) && (
        <Text
          variant="caption"
          style={{
            marginTop: theme.sizes.xs,
            textAlign: 'center',
            color: error ? theme.colors.error : theme.colors.textSecondary,
          }}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
}