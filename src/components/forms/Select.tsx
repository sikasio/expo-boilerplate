import React, { useState, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
  ViewStyle,
  TextStyle,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Text } from '../ui/Text';
import { Icon, IconName } from '../ui/Icon';
import { TextInput } from './TextInput';

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  icon?: IconName;
  description?: string;
}

export type SelectVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error';
export type SelectSize = 'small' | 'medium' | 'large';

interface SelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string | number | (string | number)[];
  onSelectionChange?: (value: string | number | (string | number)[], selectedOptions: SelectOption | SelectOption[]) => void;
  multiple?: boolean;
  searchable?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  leftIcon?: IconName;
  variant?: SelectVariant;
  size?: SelectSize;
  maxHeight?: number;
  adaptiveHeight?: boolean;
  containerStyle?: ViewStyle;
  dropdownStyle?: ViewStyle;
  optionStyle?: ViewStyle;
  selectedOptionStyle?: ViewStyle;
  closeOnSelect?: boolean;
  showSelectedCount?: boolean;
  emptyText?: string;
  searchPlaceholder?: string;
}

export function Select({
  label,
  placeholder = 'Select an option...',
  options,
  value,
  onSelectionChange,
  multiple = false,
  searchable = false,
  disabled = false,
  error,
  helperText,
  leftIcon,
  variant = 'primary',
  size = 'medium',
  maxHeight = 500,
  adaptiveHeight = true,
  containerStyle,
  dropdownStyle,
  optionStyle,
  selectedOptionStyle,
  closeOnSelect = true,
  showSelectedCount = false,
  emptyText = 'No options available',
  searchPlaceholder = 'Search options...',
}: SelectProps) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    
    return options.filter(option =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  // Get selected options for display
  const selectedOptions = useMemo(() => {
    if (!value) return [];
    
    const selectedValues = Array.isArray(value) ? value : [value];
    return options.filter(option => selectedValues.includes(option.value));
  }, [value, options]);

  // Calculate optimal height for dropdown using theme sizes
  const getOptimalHeight = () => {
    if (!adaptiveHeight) return maxHeight;
    
    const headerHeight = theme.sizes.xxl + theme.sizes.md; // Header with proper spacing
    const searchHeight = searchable ? theme.sizes.xxl + theme.sizes.lg : 0; // Search input with margins
    const footerHeight = multiple ? theme.sizes.xxl + theme.sizes.sm : 0; // Footer for multi-select
    const fixedHeight = headerHeight + searchHeight + footerHeight;
    
    // Calculate item height using theme sizes (padding + content + border)
    const estimatedItemHeight = theme.sizes.xxl + theme.sizes.md; // Base item height from theme
    const availableHeight = screenHeight * 0.8 - fixedHeight; // 80% of screen minus fixed elements
    const calculatedHeight = Math.min(
      filteredOptions.length * estimatedItemHeight,
      availableHeight,
      maxHeight
    );
    
    return Math.max(calculatedHeight, theme.sizes.xxl * 4); // Minimum height using theme
  };

  const optimalHeight = getOptimalHeight();

  // Get size-based dimensions
  const getSizeDimensions = () => {
    switch (size) {
      case 'small':
        return {
          minHeight: theme.sizes.xl, // 32px
          paddingHorizontal: theme.sizes.sm,
          paddingVertical: theme.sizes.xs,
          fontSize: theme.fontSizes.sm,
          iconSize: theme.fontSizes.md,
        };
      case 'large':
        return {
          minHeight: theme.sizes.xxxl || theme.sizes.xxl + theme.sizes.sm, // 56px
          paddingHorizontal: theme.sizes.lg,
          paddingVertical: theme.sizes.md,
          fontSize: theme.fontSizes.lg,
          iconSize: theme.fontSizes.xl,
        };
      default: // medium
        return {
          minHeight: theme.sizes.xxl, // 48px
          paddingHorizontal: theme.sizes.md,
          paddingVertical: theme.sizes.sm,
          fontSize: theme.fontSizes.md,
          iconSize: theme.fontSizes.lg,
        };
    }
  };

  // Get variant-based colors
  const getVariantColors = () => {
    if (error) {
      return {
        borderColor: theme.colors.error,
        focusColor: theme.colors.error,
        accentColor: theme.colors.error,
      };
    }

    switch (variant) {
      case 'secondary':
        return {
          borderColor: theme.colors.secondary,
          focusColor: theme.colors.secondary,
          accentColor: theme.colors.secondary,
        };
      case 'success':
        return {
          borderColor: theme.colors.success,
          focusColor: theme.colors.success,
          accentColor: theme.colors.success,
        };
      case 'warning':
        return {
          borderColor: theme.colors.warning,
          focusColor: theme.colors.warning,
          accentColor: theme.colors.warning,
        };
      case 'error':
        return {
          borderColor: theme.colors.error,
          focusColor: theme.colors.error,
          accentColor: theme.colors.error,
        };
      default: // primary
        return {
          borderColor: theme.colors.border,
          focusColor: theme.colors.primary,
          accentColor: theme.colors.primary,
        };
    }
  };

  const sizeDimensions = getSizeDimensions();
  const variantColors = getVariantColors();

  // Handle option selection
  const handleOptionSelect = (option: SelectOption) => {
    if (option.disabled) return;

    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const isSelected = currentValues.includes(option.value);
      
      let newValues: (string | number)[];
      if (isSelected) {
        newValues = currentValues.filter(v => v !== option.value);
      } else {
        newValues = [...currentValues, option.value];
      }
      
      const newSelectedOptions = options.filter(opt => newValues.includes(opt.value));
      onSelectionChange?.(newValues, newSelectedOptions);
    } else {
      onSelectionChange?.(option.value, option);
      if (closeOnSelect) {
        setIsOpen(false);
      }
    }
  };

  // Get display text for the select button
  const getDisplayText = (): string => {
    if (selectedOptions.length === 0) {
      return placeholder;
    }

    if (multiple) {
      if (showSelectedCount && selectedOptions.length > 1) {
        return `${selectedOptions.length} items selected`;
      }
      return selectedOptions.map(opt => opt.label).join(', ');
    }

    return selectedOptions[0]?.label || placeholder;
  };

  // Check if option is selected
  const isOptionSelected = (option: SelectOption): boolean => {
    if (!value) return false;
    
    if (Array.isArray(value)) {
      return value.includes(option.value);
    }
    
    return value === option.value;
  };

  // Get select button style using theme system with size and variant
  const getSelectButtonStyle = () => {
    const baseStyle = {
      borderWidth: 1,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.surface,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      minHeight: sizeDimensions.minHeight,
      paddingHorizontal: sizeDimensions.paddingHorizontal,
      paddingVertical: sizeDimensions.paddingVertical,
    };

    if (disabled) {
      return {
        ...baseStyle,
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        opacity: 0.6,
      };
    }

    return {
      ...baseStyle,
      borderColor: variantColors.borderColor,
    };
  };

  // Get option item style using theme system
  const getOptionStyle = (option: SelectOption, isSelected: boolean) => {
    const baseStyle = {
      flexDirection: 'row' as const,
      alignItems: 'flex-start' as const,
      paddingHorizontal: theme.sizes.md,
      paddingVertical: theme.sizes.md,
      minHeight: theme.sizes.xxl + theme.sizes.sm, // Use theme size instead of hardcoded 56
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border + '20',
    };

    if (option.disabled) {
      return {
        ...baseStyle,
        opacity: 0.5,
        backgroundColor: theme.colors.surface,
      };
    }

    if (isSelected) {
      return {
        ...baseStyle,
        backgroundColor: variantColors.accentColor + (theme.isDark ? '30' : '10'), // Adapt opacity for theme
        ...selectedOptionStyle,
      };
    }

    return {
      ...baseStyle,
      backgroundColor: theme.colors.surface,
      ...optionStyle,
    };
  };

  const clearSelection = () => {
    if (multiple) {
      onSelectionChange?.([], []);
    } else {
      onSelectionChange?.(undefined as any, undefined as any);
    }
  };

  return (
    <View style={[{ marginBottom: theme.sizes.md }, containerStyle]}>
      {/* Label */}
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

      {/* Select Button */}
      <TouchableOpacity
        style={getSelectButtonStyle()}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
      >
        {leftIcon && (
          <Icon
            name={leftIcon}
            size={sizeDimensions.iconSize}
            color={theme.colors.textSecondary}
            style={{ marginRight: theme.sizes.sm }}
          />
        )}

        <Text
          variant="body"
          style={{
            flex: 1,
            fontSize: sizeDimensions.fontSize,
            color: selectedOptions.length > 0 ? theme.colors.text : theme.colors.placeholder,
          }}
          numberOfLines={1}
        >
          {getDisplayText()}
        </Text>

        {/* Clear button for selected values */}
        {selectedOptions.length > 0 && !disabled && (
          <TouchableOpacity
            onPress={clearSelection}
            style={{ marginRight: theme.sizes.xs }}
          >
            <Icon
              name="close-circle"
              size={sizeDimensions.iconSize * 0.8}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        )}

        <Icon
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={sizeDimensions.iconSize}
          color={theme.colors.textSecondary}
        />
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: theme.sizes.md,
          }}
          onPress={() => setIsOpen(false)}
        >
          <Pressable
            style={{
              width: screenWidth > 600 ? '80%' : '95%', // Responsive width
              maxWidth: 500, // Maximum width for tablets
              height: optimalHeight,
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.md,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 5,
              overflow: 'hidden', // Ensure content doesn't overflow
              ...dropdownStyle,
            }}
            onPress={() => {}} // Prevent closing when tapping inside
          >
            {/* Header with close button */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: theme.sizes.lg,
                paddingVertical: theme.sizes.md,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.border,
              }}
            >
              <Text variant="subtitle">
                {multiple ? 'Select Options' : 'Select Option'}
              </Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Icon name="close" size={theme.fontSizes.xl} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            {searchable && (
              <View style={{ paddingHorizontal: theme.sizes.md, paddingTop: theme.sizes.sm }}>
                <TextInput
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  leftIcon="search-outline"
                  containerStyle={{ marginBottom: 0 }}
                />
              </View>
            )}

            {/* Options List */}
            <ScrollView 
              style={{ 
                flex: 1,
                maxHeight: optimalHeight - (searchable ? theme.sizes.xxl * 3 : theme.sizes.xxl + theme.sizes.md) - (multiple ? theme.sizes.xxl + theme.sizes.sm : 0)
              }}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={{ paddingBottom: theme.sizes.sm }}
            >
              {filteredOptions.length === 0 ? (
                <View
                  style={{
                    padding: theme.sizes.lg,
                    alignItems: 'center',
                  }}
                >
                  <Text variant="body" style={{ color: theme.colors.textSecondary }}>
                    {searchQuery ? 'No matching options found' : emptyText}
                  </Text>
                </View>
              ) : (
                filteredOptions.map((option, index) => {
                  const isSelected = isOptionSelected(option);
                  
                  return (
                    <TouchableOpacity
                      key={`${option.value}-${index}`}
                      style={getOptionStyle(option, isSelected)}
                      onPress={() => handleOptionSelect(option)}
                      disabled={option.disabled}
                    >
                      {/* Option Icon */}
                      {option.icon && (
                        <Icon
                          name={option.icon}
                          size={theme.fontSizes.lg} // Use theme font size
                          color={
                            option.disabled
                              ? theme.colors.textSecondary
                              : isSelected
                              ? variantColors.accentColor
                              : theme.colors.text
                          }
                          style={{ 
                            marginRight: theme.sizes.sm,
                            marginTop: theme.sizes.xs 
                          }}
                        />
                      )}

                      {/* Option Content */}
                      <View style={{ flex: 1 }}>
                        <Text
                          variant="body"
                          style={{
                            color: option.disabled
                              ? theme.colors.textSecondary
                              : isSelected
                              ? variantColors.accentColor
                              : theme.colors.text,
                          }}
                        >
                          {option.label}
                        </Text>
                        {option.description && (
                          <Text
                            variant="caption"
                            style={{
                              color: theme.colors.textSecondary,
                              marginTop: theme.sizes.xs,
                            }}
                          >
                            {option.description}
                          </Text>
                        )}
                      </View>

                      {/* Selection Indicator */}
                      <View style={{ 
                        marginLeft: theme.sizes.sm,
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: 24,
                        marginTop: theme.sizes.xs
                      }}>
                        {multiple ? (
                          <Icon
                            name={isSelected ? "checkbox" : "square-outline"}
                            size={theme.fontSizes.lg} // Use theme font size
                            color={isSelected ? variantColors.accentColor : theme.colors.textSecondary}
                          />
                        ) : (
                          isSelected && (
                            <Icon
                              name="checkmark"
                              size={theme.fontSizes.lg} // Use theme font size
                              color={variantColors.accentColor}
                            />
                          )
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>

            {/* Footer for multiple selection */}
            {multiple && selectedOptions.length > 0 && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: theme.sizes.md,
                  paddingVertical: theme.sizes.sm,
                  borderTopWidth: 1,
                  borderTopColor: theme.colors.border,
                }}
              >
                <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
                  {selectedOptions.length} selected
                </Text>
                <TouchableOpacity onPress={() => setIsOpen(false)}>
                  <Text variant="body" style={{ color: variantColors.accentColor }}>
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      {/* Helper Text / Error */}
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