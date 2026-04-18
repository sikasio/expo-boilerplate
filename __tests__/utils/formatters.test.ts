import {
  formatNumberWithCommas,
  formatPrice,
  formatPercentage,
  formatQuantity,
} from '../../src/utils/formatters';

describe('formatNumberWithCommas', () => {
  it('formats with default 2 decimals', () => {
    expect(formatNumberWithCommas(1234567)).toBe('1,234,567.00');
  });
  it('respects decimalPlaces', () => {
    expect(formatNumberWithCommas(1234.5, 0)).toBe('1,235');
    expect(formatNumberWithCommas(1234.5, 1)).toBe('1,234.5');
  });
  it('returns "0" for NaN or non-number', () => {
    expect(formatNumberWithCommas(NaN)).toBe('0');
    expect(formatNumberWithCommas('abc' as unknown as number)).toBe('0');
  });
});

describe('formatPrice', () => {
  it('prepends default $ symbol', () => {
    expect(formatPrice(19.99)).toBe('$19.99');
  });
  it('respects custom currency symbol', () => {
    expect(formatPrice(100, '€')).toBe('€100.00');
  });
});

describe('formatPercentage', () => {
  it('default 1 decimal', () => {
    expect(formatPercentage(0.1234)).toBe('0.1%');
  });
  it('custom decimals', () => {
    expect(formatPercentage(12.345, 2)).toBe('12.35%');
  });
});

describe('formatQuantity', () => {
  it('uses singular for 1', () => {
    expect(formatQuantity(1, 'item')).toBe('1 item');
  });
  it('uses plural (s-suffix) for >1 when no explicit plural', () => {
    expect(formatQuantity(5, 'book')).toBe('5 books');
  });
  it('uses explicit plural when provided', () => {
    expect(formatQuantity(2, 'child', 'children')).toBe('2 children');
  });
});
