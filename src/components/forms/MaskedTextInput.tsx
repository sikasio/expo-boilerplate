import React, { useState } from 'react';
import { TextInputProps as RNTextInputProps, ViewStyle } from 'react-native';
import { TextInput } from './TextInput';
import { IconName } from '../ui/Icon';

export type MaskType = 'phone' | 'credit-card' | 'date' | 'time' | 'currency' | 'ssn' | 'custom';

interface MaskedTextInputProps extends Omit<RNTextInputProps, 'onChangeText' | 'value'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: IconName;
  rightIcon?: IconName;
  containerStyle?: ViewStyle;
  mask: MaskType;
  customMask?: string; // For custom mask patterns (e.g., "###-##-####")
  onChangeText?: (maskedText: string, unmaskedText: string) => void;
  value?: string;
}

// Predefined mask patterns
const maskPatterns: Record<Exclude<MaskType, 'custom'>, string> = {
  phone: '(###) ###-####',
  'credit-card': '#### #### #### ####',
  date: '##/##/####',
  time: '##:##',
  currency: '$#,###.##',
  ssn: '###-##-####',
};

// Apply mask to input text
const applyMask = (text: string, mask: MaskType, customMask?: string): string => {
  const pattern = mask === 'custom' ? customMask : maskPatterns[mask];
  if (!pattern) return text;
  
  // Remove all non-alphanumeric characters for processing
  const cleanText = text.replace(/[^\w]/g, '');
  
  let maskedText = '';
  let textIndex = 0;
  
  for (let i = 0; i < pattern.length && textIndex < cleanText.length; i++) {
    const patternChar = pattern[i];
    
    if (patternChar === '#') {
      maskedText += cleanText[textIndex];
      textIndex++;
    } else {
      maskedText += patternChar;
    }
  }
  
  return maskedText;
};

// Remove mask characters to get clean text
const removeMask = (text: string): string => {
  return text.replace(/[^\w]/g, '');
};

// Get maximum length for the mask
const getMaxLength = (mask: MaskType, customMask?: string): number => {
  const pattern = mask === 'custom' ? customMask : maskPatterns[mask];
  return pattern?.length || 50;
};

export function MaskedTextInput({
  mask,
  customMask,
  onChangeText,
  value = '',
  placeholder,
  keyboardType,
  ...props
}: MaskedTextInputProps) {
  // Initialize with masked value if provided
  const [displayValue, setDisplayValue] = useState(() => 
    value ? applyMask(value, mask, customMask) : ''
  );

  const handleTextChange = (text: string) => {
    const masked = applyMask(text, mask, customMask);
    const unmasked = removeMask(text);
    
    setDisplayValue(masked);
    onChangeText?.(masked, unmasked);
  };

  const getKeyboardType = (): RNTextInputProps['keyboardType'] => {
    if (keyboardType) return keyboardType;
    
    switch (mask) {
      case 'phone':
      case 'credit-card':
      case 'date':
      case 'time':
      case 'ssn':
        return 'numeric';
      case 'currency':
        return 'decimal-pad';
      default:
        return 'default';
    }
  };

  const getPlaceholder = (): string => {
    if (placeholder) return placeholder;
    
    const pattern = mask === 'custom' ? customMask : maskPatterns[mask];
    return pattern?.replace(/#/g, '_') || '';
  };

  return (
    <TextInput
      {...props}
      value={displayValue}
      onChangeText={handleTextChange}
      placeholder={getPlaceholder()}
      keyboardType={getKeyboardType()}
      maxLength={getMaxLength(mask, customMask)}
    />
  );
}