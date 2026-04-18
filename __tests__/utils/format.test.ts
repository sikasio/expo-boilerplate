import { FormatUtils } from '../../src/utils/format';

describe('FormatUtils.currency', () => {
  it('formats USD by default', () => {
    const out = FormatUtils.currency(1234.56);
    expect(out).toMatch(/\$1,234\.56/);
  });
  it('respects explicit currency code', () => {
    const out = FormatUtils.currency(1000, 'EUR');
    expect(out).toMatch(/€|EUR/);
  });
});

describe('FormatUtils.number', () => {
  it('inserts thousand separators', () => {
    expect(FormatUtils.number(1234567)).toBe('1,234,567');
  });
  it('handles zero', () => {
    expect(FormatUtils.number(0)).toBe('0');
  });
});

describe('FormatUtils.percentage', () => {
  it('default 2 decimals', () => {
    expect(FormatUtils.percentage(12.345)).toBe('12.35%');
  });
  it('custom decimals', () => {
    expect(FormatUtils.percentage(12.345, 1)).toBe('12.3%');
    expect(FormatUtils.percentage(12, 0)).toBe('12%');
  });
});

describe('FormatUtils.fileSize', () => {
  it('zero bytes', () => {
    expect(FormatUtils.fileSize(0)).toBe('0 Bytes');
  });
  it('bytes under 1 KB', () => {
    expect(FormatUtils.fileSize(500)).toBe('500 Bytes');
  });
  it('KB', () => {
    expect(FormatUtils.fileSize(1536)).toBe('1.5 KB');
  });
  it('MB', () => {
    expect(FormatUtils.fileSize(5 * 1024 * 1024)).toBe('5 MB');
  });
  it('GB', () => {
    expect(FormatUtils.fileSize(2 * 1024 * 1024 * 1024)).toBe('2 GB');
  });
});

describe('FormatUtils.phone', () => {
  it('formats 10-digit US number', () => {
    expect(FormatUtils.phone('5551234567')).toBe('(555) 123-4567');
  });
  it('strips non-digits before matching', () => {
    expect(FormatUtils.phone('555-123-4567')).toBe('(555) 123-4567');
  });
  it('returns input unchanged if pattern does not match', () => {
    expect(FormatUtils.phone('+44 20 7946 0958')).toBe('+44 20 7946 0958');
  });
});

describe('FormatUtils.creditCard', () => {
  it('groups digits in 4-char chunks', () => {
    expect(FormatUtils.creditCard('4111111111111111')).toBe('4111 1111 1111 1111');
  });
  it('handles already-spaced input (idempotent)', () => {
    expect(FormatUtils.creditCard('4111 1111 1111 1111')).toBe('4111 1111 1111 1111');
  });
});

describe('FormatUtils.maskCreditCard', () => {
  it('masks all but last 4 digits', () => {
    expect(FormatUtils.maskCreditCard('4111111111111111')).toBe('**** **** **** 1111');
  });
  it('returns input if too short', () => {
    expect(FormatUtils.maskCreditCard('123')).toBe('123');
  });
});

describe('FormatUtils.maskEmail', () => {
  it('masks middle of local part', () => {
    expect(FormatUtils.maskEmail('alice@example.com')).toBe('a***e@example.com');
  });
  it('returns input if malformed', () => {
    expect(FormatUtils.maskEmail('not-an-email')).toBe('not-an-email');
  });
});
