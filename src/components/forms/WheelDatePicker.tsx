import React, { useState, useRef, useEffect, memo, useCallback } from 'react';
import { View, TouchableOpacity, ScrollView, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';
import { Modal } from '@/components/ui/Modal';
import { useTheme } from '@/contexts/ThemeContext';
import { useRTL } from '@/contexts/RTLContext';
import { getFlexDirection, getRTLPadding, getTextAlign } from '@/utils';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const ITEM_HEIGHT = 44; // iOS standard picker item height

interface WheelDatePickerProps {
  label?: string;
  placeholder?: string;
  value?: string; // ISO format YYYY-MM-DD
  onDateChange: (date: string) => void;
  error?: string;
  helperText?: string;
  maxDate?: Date;
  disabled?: boolean;

  // Customizable labels for modal
  modalTitle?: string;
  dayLabel?: string;
  monthLabel?: string;
  yearLabel?: string;
  previewLabel?: string;
  cancelButtonText?: string;
  confirmButtonText?: string;
}

interface WheelPickerProps {
  data: (string | number)[];
  selectedIndex: number;
  onValueChange: (index: number) => void;
  style?: any;
}

// Memoized item component to prevent unnecessary re-renders
const WheelPickerItem = memo<{
  item: string | number;
  isSelected: boolean;
  theme: any;
}>(({ item, isSelected, theme }) => {
  return (
    <View
      style={{
        height: ITEM_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          fontSize: isSelected ? theme.fontSizes.xl : theme.fontSizes.lg,
          fontWeight: isSelected ? '600' : '400',
          color: isSelected ? theme.colors.text : theme.colors.textSecondary,
        }}
      >
        {item}
      </Text>
    </View>
  );
});

const WheelPicker: React.FC<WheelPickerProps> = ({ data, selectedIndex, onValueChange, style }) => {
  const { theme } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const [visibleIndex, setVisibleIndex] = useState(selectedIndex);
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Scroll to initial position with a longer delay for better reliability
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: selectedIndex * ITEM_HEIGHT,
        animated: false,
      });
      setVisibleIndex(selectedIndex);
    }, 200);

    return () => clearTimeout(timer);
  }, [selectedIndex]);

  const handleScrollEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // Extract value immediately before event is pooled
    const y = event.nativeEvent.contentOffset.y;

    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    scrollTimeout.current = setTimeout(() => {
      const index = Math.round(y / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(data.length - 1, index));

      // Snap to item
      scrollViewRef.current?.scrollTo({
        y: clampedIndex * ITEM_HEIGHT,
        animated: true,
      });

      setVisibleIndex(clampedIndex);

      if (clampedIndex !== selectedIndex) {
        onValueChange(clampedIndex);
      }

      isScrolling.current = false;
    }, 50);
  }, [data.length, selectedIndex, onValueChange]);

  const handleScrollBeginDrag = useCallback(() => {
    isScrolling.current = true;
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
  }, []);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!isScrolling.current) return;

    // Extract value immediately before event is pooled
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(data.length - 1, index));

    if (clampedIndex !== visibleIndex) {
      setVisibleIndex(clampedIndex);
    }
  }, [data.length, visibleIndex]);

  return (
    <View style={[{ height: ITEM_HEIGHT * 5, overflow: 'hidden' }, style]}>
      {/* Selection indicator */}
      <View
        style={{
          position: 'absolute',
          top: ITEM_HEIGHT * 2,
          left: 0,
          right: 0,
          height: ITEM_HEIGHT,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEnd}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={32}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingVertical: ITEM_HEIGHT * 2,
        }}
      >
        {data.map((item, index) => (
          <WheelPickerItem
            key={`${item}-${index}`}
            item={item}
            isSelected={index === visibleIndex}
            theme={theme}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export const WheelDatePicker: React.FC<WheelDatePickerProps> = ({
  label,
  placeholder = 'Select date',
  value,
  onDateChange,
  error,
  helperText,
  maxDate = new Date(),
  disabled = false,

  // Customizable labels with defaults
  modalTitle = 'Select Date',
  dayLabel = 'Day',
  monthLabel = 'Month',
  yearLabel = 'Year',
  previewLabel = 'Selected Date',
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
  const yearIndex = years.indexOf(tempYear);

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

  // Find current day index
  const dayIndex = days.indexOf(tempDay);

  // Format display
  const getDisplayText = () => {
    if (!value) return placeholder;
    const parsed = parseValue();
    return `${parsed.day} ${months[parsed.month]} ${parsed.year}`;
  };

  const handleConfirm = () => {
    // Adjust day if it exceeds the days in selected month
    const maxDay = getDaysInMonth(tempYear, tempMonth);
    const finalDay = tempDay > maxDay ? maxDay : tempDay;

    const formattedMonth = String(tempMonth + 1).padStart(2, '0');
    const formattedDay = String(finalDay).padStart(2, '0');
    onDateChange(`${tempYear}-${formattedMonth}-${formattedDay}`);
    setShowPicker(false);
  };

  const handleCancel = () => {
    // Reset to current value
    if (value) {
      const parsed = parseValue();
      setTempYear(parsed.year);
      setTempMonth(parsed.month);
      setTempDay(parsed.day);
    }
    setShowPicker(false);
  };

  const handleYearChange = (index: number) => {
    setTempYear(years[index]);
  };

  const handleMonthChange = (index: number) => {
    setTempMonth(index);
    // Auto-adjust day if needed
    const maxDay = getDaysInMonth(tempYear, index);
    if (tempDay > maxDay) {
      setTempDay(maxDay);
    }
  };

  const handleDayChange = (index: number) => {
    setTempDay(days[index]);
  };

  return (
    <View style={{ marginBottom: theme.sizes.md }}>
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

      <TouchableOpacity
        onPress={() => !disabled && setShowPicker(true)}
        style={{
          flexDirection: getFlexDirection(isRTL),
          alignItems: 'center',
          borderWidth: 1,
          borderColor: error ? theme.colors.error : theme.colors.border,
          borderRadius: theme.borderRadius.sm,
          backgroundColor: theme.colors.surface,
          minHeight: theme.sizes.xxl,
          opacity: disabled ? 0.5 : 1,
        }}
        disabled={disabled}
        activeOpacity={0.7}
      >
        {/* Calendar icon at start (left in LTR, right in RTL) */}
        <View style={{ ...getRTLPadding(isRTL).paddingStart(theme.sizes.md) }}>
          <Icon
            name="calendar-outline"
            size={theme.fontSizes.lg}
            color={error ? theme.colors.error : theme.colors.textSecondary}
          />
        </View>

        {/* Date text */}
        <Text
          style={{
            flex: 1,
            fontSize: theme.fontSizes.md,
            color: value ? theme.colors.text : theme.colors.placeholder,
            paddingHorizontal: theme.sizes.sm,
            paddingVertical: theme.sizes.sm,
            textAlign: getTextAlign(isRTL),
          }}
        >
          {getDisplayText()}
        </Text>

        {/* Chevron icon at end (right in LTR, left in RTL) */}
        <View style={{ ...getRTLPadding(isRTL).paddingEnd(theme.sizes.md) }}>
          <Icon
            name="chevron-down-outline"
            size={theme.fontSizes.lg}
            color={theme.colors.textSecondary}
          />
        </View>
      </TouchableOpacity>

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

      {/* iOS-Style Wheel Picker Modal */}
      <Modal
        visible={showPicker}
        onClose={handleCancel}
        title={modalTitle}
        size="medium"
        position="center"
        animation="fade"
        showHeader={true}
        showCloseButton={false}
        showFooter={false}
        closeOnBackdropPress={true}
        scrollable={false}
      >
        {/* Wheel Pickers Container */}
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: theme.sizes.md,
          }}
        >
          {/* Day Picker */}
          <View style={{ flex: 1 }}>
            <Text
              variant="caption"
              style={{
                textAlign: 'center',
                marginBottom: theme.sizes.sm,
                color: theme.colors.textSecondary,
                fontWeight: '600',
              }}
            >
              {dayLabel}
            </Text>
            <WheelPicker
              data={days}
              selectedIndex={dayIndex >= 0 ? dayIndex : 0}
              onValueChange={handleDayChange}
            />
          </View>

          {/* Month Picker */}
          <View style={{ flex: 2 }}>
            <Text
              variant="caption"
              style={{
                textAlign: 'center',
                marginBottom: theme.sizes.sm,
                color: theme.colors.textSecondary,
                fontWeight: '600',
              }}
            >
              {monthLabel}
            </Text>
            <WheelPicker
              data={months}
              selectedIndex={tempMonth}
              onValueChange={handleMonthChange}
            />
          </View>

          {/* Year Picker */}
          <View style={{ flex: 1.5 }}>
            <Text
              variant="caption"
              style={{
                textAlign: 'center',
                marginBottom: theme.sizes.sm,
                color: theme.colors.textSecondary,
                fontWeight: '600',
              }}
            >
              {yearLabel}
            </Text>
            <WheelPicker
              data={years}
              selectedIndex={yearIndex >= 0 ? yearIndex : 0}
              onValueChange={handleYearChange}
            />
          </View>
        </View>

        {/* Preview */}
        <View
          style={{
            padding: theme.sizes.md,
            backgroundColor: theme.colors.primary + '10',
            marginHorizontal: theme.sizes.lg,
            marginBottom: theme.sizes.lg,
            borderRadius: theme.borderRadius.md,
          }}
        >
          <Text
            variant="caption"
            style={{
              textAlign: 'center',
              color: theme.colors.textSecondary,
              marginBottom: 4,
            }}
          >
            {previewLabel}
          </Text>
          <Text
            variant="subtitle"
            style={{
              textAlign: 'center',
              fontWeight: '600',
              color: theme.colors.primary,
            }}
          >
            {tempDay} {months[tempMonth]} {tempYear}
          </Text>
        </View>

        {/* Action Buttons */}
        <View
          style={{
            flexDirection: 'row',
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
            marginHorizontal: -theme.sizes.lg,
            marginBottom: -theme.sizes.lg,
          }}
        >
          <TouchableOpacity
            onPress={handleCancel}
            style={{
              flex: 1,
              paddingVertical: theme.sizes.md + 2,
              borderEndWidth: 0.5,
              borderEndColor: theme.colors.border,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: theme.fontSizes.lg,
                color: theme.colors.textSecondary,
                fontWeight: '500',
              }}
            >
              {cancelButtonText}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleConfirm}
            style={{
              flex: 1,
              paddingVertical: theme.sizes.md + 2,
              borderStartWidth: 0.5,
              borderStartColor: theme.colors.border,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: theme.fontSizes.lg,
                color: theme.colors.primary,
                fontWeight: '600',
              }}
            >
              {confirmButtonText}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};
