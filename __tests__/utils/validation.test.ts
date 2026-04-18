import { ValidationUtils } from '../../src/utils/validation';

describe('ValidationUtils.email', () => {
  it('accepts standard email addresses', () => {
    expect(ValidationUtils.email('user@example.com')).toBe(true);
    expect(ValidationUtils.email('user.name+tag@sub.example.co.uk')).toBe(true);
  });
  it('rejects missing @, missing domain, whitespace', () => {
    expect(ValidationUtils.email('user.example.com')).toBe(false);
    expect(ValidationUtils.email('user@')).toBe(false);
    expect(ValidationUtils.email('user @example.com')).toBe(false);
    expect(ValidationUtils.email('')).toBe(false);
  });
});

describe('ValidationUtils.password', () => {
  it('accepts strong passwords', () => {
    expect(ValidationUtils.password('Abcdefg1')).toBe(true);
    expect(ValidationUtils.password('MyP@ssw0rd!')).toBe(true);
  });
  it('rejects too short', () => {
    expect(ValidationUtils.password('Abc1')).toBe(false);
  });
  it('rejects missing uppercase', () => {
    expect(ValidationUtils.password('abcdefg1')).toBe(false);
  });
  it('rejects missing lowercase', () => {
    expect(ValidationUtils.password('ABCDEFG1')).toBe(false);
  });
  it('rejects missing digit', () => {
    expect(ValidationUtils.password('Abcdefgh')).toBe(false);
  });
});

describe('ValidationUtils.phone', () => {
  it('accepts 10+ digit numbers with or without +', () => {
    expect(ValidationUtils.phone('+1234567890')).toBe(true);
    expect(ValidationUtils.phone('1234567890')).toBe(true);
    expect(ValidationUtils.phone('+1 (555) 123-4567')).toBe(true);
  });
  it('rejects too short', () => {
    expect(ValidationUtils.phone('12345')).toBe(false);
  });
  it('rejects letters', () => {
    expect(ValidationUtils.phone('abc123def0')).toBe(false);
  });
});

describe('ValidationUtils.url', () => {
  it('accepts valid URLs', () => {
    expect(ValidationUtils.url('https://example.com')).toBe(true);
    expect(ValidationUtils.url('http://localhost:3000/path?q=1')).toBe(true);
  });
  it('rejects nonsense', () => {
    expect(ValidationUtils.url('not a url')).toBe(false);
    expect(ValidationUtils.url('')).toBe(false);
  });
});

describe('ValidationUtils.required', () => {
  it('rejects empty string and whitespace-only', () => {
    expect(ValidationUtils.required('')).toBe(false);
    expect(ValidationUtils.required('   ')).toBe(false);
  });
  it('accepts non-empty string', () => {
    expect(ValidationUtils.required('x')).toBe(true);
  });
  it('rejects null and undefined', () => {
    expect(ValidationUtils.required(null)).toBe(false);
    expect(ValidationUtils.required(undefined)).toBe(false);
  });
  it('accepts 0 and false (non-string values)', () => {
    expect(ValidationUtils.required(0)).toBe(true);
    expect(ValidationUtils.required(false)).toBe(true);
  });
});

describe('ValidationUtils.minLength / maxLength', () => {
  it('minLength boundary', () => {
    expect(ValidationUtils.minLength('abc', 3)).toBe(true);
    expect(ValidationUtils.minLength('ab', 3)).toBe(false);
  });
  it('maxLength boundary', () => {
    expect(ValidationUtils.maxLength('abc', 3)).toBe(true);
    expect(ValidationUtils.maxLength('abcd', 3)).toBe(false);
  });
});

describe('ValidationUtils.numeric / alphabetic / alphanumeric', () => {
  it('numeric', () => {
    expect(ValidationUtils.numeric('123.45')).toBe(true);
    expect(ValidationUtils.numeric('abc')).toBe(false);
  });
  it('alphabetic allows spaces', () => {
    expect(ValidationUtils.alphabetic('Hello World')).toBe(true);
    expect(ValidationUtils.alphabetic('Hello123')).toBe(false);
  });
  it('alphanumeric allows spaces', () => {
    expect(ValidationUtils.alphanumeric('Hello 123')).toBe(true);
    expect(ValidationUtils.alphanumeric('Hello-World')).toBe(false);
  });
});
