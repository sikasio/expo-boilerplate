import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, Pressable, ViewStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useRTL } from '../../contexts/RTLContext';
import { Text } from '../ui/Text';
import { Icon, IconName } from '../ui/Icon';
import { Button } from '../ui/Button';
import { getFlexDirection, getRTLPadding } from '../../utils';

interface SimpleDatePickerProps {
  label?: string;
  placeholder?: string;
  value?: string; // ISO format YYYY-MM-DD
  onDateChange: (date: string) => void;
  error?: string;
  helperText?: string;
  maxDate?: Date;
  disabled?: boolean;
  containerStyle?: ViewStyle;

  // Customizable labels
  modalTitle?: string;
  dayLabel?: string;
  monthLabel?: string;
  yearLabel?: string;
  cancelButtonText?: string;
  confirmButtonText?: string;
}

export const SimpleDatePicker: React.FC<SimpleDatePickerProps> = ({
  label,
  placeholder = 'Select date',
  value,
  onDateChange,
  error,
  helperText,
  maxDate = new Date(),
  disabled = false,
  containerStyle,
  modalTitle = 'Select Date',
  dayLabel = 'Day',
  monthLabel = 'Month',
  yearLabel = 'Year',
  cancelButtonText = 'Cancel',
  confirmButtonText = 'Confirm',
}) => {
  const { theme } = useTheme();
  const { isRTL } = useRTL();
  const [showPicker, setShowPicker] = useState(false);

  // Parse current value or use defaults
  const parseValue = () => {
    if (value) {
      const parts = value.split('-');
      return {
        year: parseInt(parts[0]),
        month: parseInt(parts[1]) - 1,
        day: parseInt(parts[2]),
      };
    }
    const maxYear = maxDate.getFullYear();
    return {
      year: maxYear - 20,
      month: 0,
      day: 1,
    };
  };

  const [tempYear, setTempYear] = useState(parseValue().year);
  const [tempMonth, setTempMonth] = useState(parseValue().month);
  const [tempDay, setTempDay] = useState(parseValue().day);

  // Generate years (1900 to max year)
  const maxYear = maxDate.getFullYear();
  const years = Array.from({ length: maxYear - 1900 + 1 }, (_, i) => 1900 + i).reverse();

  // Arabic month names
  const months = [
    'يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  // Get days in selected month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(tempYear, tempMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Format display
  const getDisplayText = () => {
    if (!value) return placeholder;
    const parsed = parseValue();
    return `${parsed.day} ${months[parsed.month]} ${parsed.year}`;
  };

  const handleConfirm = () => {
    const maxDay = getDaysInMonth(tempYear, tempMonth);
    const finalDay = tempDay > maxDay ? maxDay : tempDay;
    const formattedMonth = String(tempMonth + 1).padStart(2, '0');
    const formattedDay = String(finalDay).padStart(2, '0');
    onDateChange(`${tempYear}-${formattedMonth}-${formattedDay}`);
    setShowPicker(false);
  };

  const handleCancel = () => {
    if (value) {
      const parsed = parseValue();
      setTempYear(parsed.year);
      setTempMonth(parsed.month);
      setTempDay(parsed.day);
    }
    setShowPicker(false);
  };

  // Styles using theme
  const getInputContainerStyle = () => {
    return {
      flexDirection: getFlexDirection(isRTL) as 'row' | 'row-reverse',
      alignItems: 'center' as const,
      borderWidth: 1,
      borderColor: error ? theme.colors.error : theme.colors.border,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.surface,
      minHeight: theme.sizes.xxl,
      opacity: disabled ? 0.5 : 1,
      paddingHorizontal: theme.sizes.md,
    };
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

      {/* Input */}
      <TouchableOpacity
        onPress={() => !disabled && setShowPicker(true)}
        style={getInputContainerStyle()}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Icon
          name="calendar-outline"
          size={theme.fontSizes.lg}
          color={error ? theme.colors.error : theme.colors.textSecondary}
        />
        <Text
          style={{
            flex: 1,
            fontSize: theme.fontSizes.md,
            color: value ? theme.colors.text : theme.colors.placeholder,
            paddingHorizontal: theme.sizes.sm,
          }}
        >
          {getDisplayText()}
        </Text>
        <Icon
          name="chevron-down-outline"
          size={theme.fontSizes.lg}
          color={theme.colors.textSecondary}
        />
      </TouchableOpacity>

      {/* Error */}
      {error && (
        <Text
          variant="caption"
          style={{
            marginTop: theme.sizes.xs,
            color: theme.colors.error,
          }}
        >
          {error}
        </Text>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <Text
          variant="caption"
          style={{
            marginTop: theme.sizes.xs,
            color: theme.colors.textSecondary,
          }}
        >
          {helperText}
        </Text>
      )}

      {/* Modal */}
      <Modal
        visible={showPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: theme.sizes.lg,
          }}
          onPress={handleCancel}
        >
          <Pressable
            style={{
              width: '100%',
              maxWidth: 400,
              borderRadius: theme.borderRadius.md,
              padding: theme.sizes.lg,
              backgroundColor: theme.colors.background,
            }}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Title */}
            <Text
              variant="subtitle"
              style={{
                fontSize: theme.fontSizes.lg,
                fontWeight: '600',
                marginBottom: theme.sizes.lg,
                textAlign: 'center',
              }}
            >
              {modalTitle}
            </Text>

            {/* Pickers Row */}
            <View
              style={{
                flexDirection: getFlexDirection(isRTL) as 'row' | 'row-reverse',
                justifyContent: 'space-between',
                marginBottom: theme.sizes.lg,
                gap: theme.sizes.sm,
              }}
            >
              {/* Day Picker */}
              <View style={{ flex: 1 }}>
                <Text
                  variant="caption"
                  style={{
                    textAlign: 'center',
                    marginBottom: theme.sizes.xs,
                    fontWeight: '600',
                    color: theme.colors.textSecondary,
                  }}
                >
                  {dayLabel}
                </Text>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    borderRadius: theme.borderRadius.sm,
                    padding: theme.sizes.xs,
                    alignItems: 'center',
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setTempDay(tempDay > 1 ? tempDay - 1 : days.length)}
                    style={{ padding: theme.sizes.xs }}
                  >
                    <Icon name="chevron-up-outline" size={20} color={theme.colors.text} />
                  </TouchableOpacity>
                  <Text style={{ fontSize: theme.fontSizes.xl, fontWeight: '600' }}>
                    {tempDay}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setTempDay(tempDay < days.length ? tempDay + 1 : 1)}
                    style={{ padding: theme.sizes.xs }}
                  >
                    <Icon name="chevron-down-outline" size={20} color={theme.colors.text} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Month Picker */}
              <View style={{ flex: 2 }}>
                <Text
                  variant="caption"
                  style={{
                    textAlign: 'center',
                    marginBottom: theme.sizes.xs,
                    fontWeight: '600',
                    color: theme.colors.textSecondary,
                  }}
                >
                  {monthLabel}
                </Text>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    borderRadius: theme.borderRadius.sm,
                    padding: theme.sizes.xs,
                    alignItems: 'center',
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setTempMonth(tempMonth > 0 ? tempMonth - 1 : 11)}
                    style={{ padding: theme.sizes.xs }}
                  >
                    <Icon name="chevron-up-outline" size={20} color={theme.colors.text} />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: theme.fontSizes.md,
                      fontWeight: '600',
                      textAlign: 'center',
                    }}
                  >
                    {months[tempMonth]}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setTempMonth(tempMonth < 11 ? tempMonth + 1 : 0)}
                    style={{ padding: theme.sizes.xs }}
                  >
                    <Icon name="chevron-down-outline" size={20} color={theme.colors.text} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Year Picker */}
              <View style={{ flex: 1.5 }}>
                <Text
                  variant="caption"
                  style={{
                    textAlign: 'center',
                    marginBottom: theme.sizes.xs,
                    fontWeight: '600',
                    color: theme.colors.textSecondary,
                  }}
                >
                  {yearLabel}
                </Text>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    borderRadius: theme.borderRadius.sm,
                    padding: theme.sizes.xs,
                    alignItems: 'center',
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      const currentIndex = years.indexOf(tempYear);
                      if (currentIndex > 0) setTempYear(years[currentIndex - 1]);
                    }}
                    style={{ padding: theme.sizes.xs }}
                  >
                    <Icon name="chevron-up-outline" size={20} color={theme.colors.text} />
                  </TouchableOpacity>
                  <Text style={{ fontSize: theme.fontSizes.xl, fontWeight: '600' }}>
                    {tempYear}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      const currentIndex = years.indexOf(tempYear);
                      if (currentIndex < years.length - 1) setTempYear(years[currentIndex + 1]);
                    }}
                    style={{ padding: theme.sizes.xs }}
                  >
                    <Icon name="chevron-down-outline" size={20} color={theme.colors.text} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View
              style={{
                flexDirection: getFlexDirection(isRTL) as 'row' | 'row-reverse',
                gap: theme.sizes.sm,
              }}
            >
              <Button
                title={cancelButtonText}
                variant="outline"
                onPress={handleCancel}
                style={{ flex: 1 }}
              />
              <Button
                title={confirmButtonText}
                variant="primary"
                onPress={handleConfirm}
                style={{ flex: 1 }}
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};
