/**
 * Utility functions for formatting numbers and text
 */

/**
 * Format a number with comma separators for thousands
 * @param num - The number to format
 * @param decimalPlaces - Number of decimal places to show (default: 2)
 * @returns Formatted number string with comma separators
 */
export const formatNumberWithCommas = (num: number, decimalPlaces: number = 2): string => {
  if (typeof num !== 'number' || isNaN(num)) {
    return '0';
  }
  
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
};

/**
 * Format a price with currency symbol and comma separators
 * @param price - The price to format
 * @param currency - Currency symbol (default: '$')
 * @param decimalPlaces - Number of decimal places to show (default: 2)
 * @returns Formatted price string
 */
export const formatPrice = (price: number, currency: string = '$', decimalPlaces: number = 2): string => {
  if (typeof price !== 'number' || isNaN(price)) {
    return `${currency}0`;
  }
  
  return `${currency}${formatNumberWithCommas(price, decimalPlaces)}`;
};

/**
 * Format a percentage value
 * @param value - The value to format as percentage
 * @param decimalPlaces - Number of decimal places to show (default: 1)
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, decimalPlaces: number = 1): string => {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0%';
  }
  
  return `${formatNumberWithCommas(value, decimalPlaces)}%`;
};

/**
 * Format quantity with proper pluralization
 * @param quantity - The quantity number
 * @param singular - Singular form of the word
 * @param plural - Plural form of the word (optional, defaults to singular + 's')
 * @returns Formatted quantity string with proper pluralization
 */
export const formatQuantity = (quantity: number, singular: string, plural?: string): string => {
  if (typeof quantity !== 'number' || isNaN(quantity)) {
    return `0 ${plural || singular + 's'}`;
  }
  
  const formattedNumber = formatNumberWithCommas(quantity, 0);
  const word = quantity === 1 ? singular : (plural || singular + 's');
  
  return `${formattedNumber} ${word}`;
};