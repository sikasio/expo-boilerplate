import {
  ArrayUtils,
  ObjectUtils,
  ColorUtils,
  RandomUtils,
} from '../../src/utils/helpers';

describe('ArrayUtils.unique', () => {
  it('dedupes primitives', () => {
    expect(ArrayUtils.unique([1, 1, 2, 3, 3])).toEqual([1, 2, 3]);
  });
  it('preserves order', () => {
    expect(ArrayUtils.unique(['b', 'a', 'b', 'c'])).toEqual(['b', 'a', 'c']);
  });
  it('returns empty for empty', () => {
    expect(ArrayUtils.unique([])).toEqual([]);
  });
});

describe('ArrayUtils.uniqueBy', () => {
  it('dedupes by key', () => {
    const arr = [
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
      { id: 1, name: 'c' },
    ];
    expect(ArrayUtils.uniqueBy(arr, 'id')).toEqual([
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
    ]);
  });
});

describe('ArrayUtils.groupBy', () => {
  it('groups objects by a key', () => {
    const arr = [
      { type: 'a', v: 1 },
      { type: 'b', v: 2 },
      { type: 'a', v: 3 },
    ];
    expect(ArrayUtils.groupBy(arr, 'type')).toEqual({
      a: [{ type: 'a', v: 1 }, { type: 'a', v: 3 }],
      b: [{ type: 'b', v: 2 }],
    });
  });
});

describe('ArrayUtils.chunk', () => {
  it('splits into chunks of size', () => {
    expect(ArrayUtils.chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });
  it('returns empty for empty input', () => {
    expect(ArrayUtils.chunk([], 3)).toEqual([]);
  });
});

describe('ArrayUtils.shuffle', () => {
  it('preserves length and elements', () => {
    const input = [1, 2, 3, 4, 5];
    const shuffled = ArrayUtils.shuffle(input);
    expect(shuffled).toHaveLength(5);
    expect(shuffled.sort()).toEqual([1, 2, 3, 4, 5]);
  });
  it('does not mutate input', () => {
    const input = [1, 2, 3];
    ArrayUtils.shuffle(input);
    expect(input).toEqual([1, 2, 3]);
  });
});

describe('ArrayUtils.sample', () => {
  it('returns n items by default (1)', () => {
    const s = ArrayUtils.sample([1, 2, 3, 4]);
    expect(s).toHaveLength(1);
    expect([1, 2, 3, 4]).toContain(s[0]);
  });
  it('returns count items', () => {
    expect(ArrayUtils.sample([1, 2, 3, 4, 5], 3)).toHaveLength(3);
  });
});

describe('ObjectUtils.pick', () => {
  it('keeps only specified keys', () => {
    expect(ObjectUtils.pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ a: 1, c: 3 });
  });
  it('skips missing keys silently', () => {
    expect(ObjectUtils.pick({ a: 1 } as any, ['a', 'b'])).toEqual({ a: 1 });
  });
});

describe('ObjectUtils.omit', () => {
  it('removes specified keys', () => {
    expect(ObjectUtils.omit({ a: 1, b: 2, c: 3 }, ['b'])).toEqual({ a: 1, c: 3 });
  });
  it('does not mutate input', () => {
    const input = { a: 1, b: 2 };
    ObjectUtils.omit(input, ['a']);
    expect(input).toEqual({ a: 1, b: 2 });
  });
});

describe('ObjectUtils.isEmpty', () => {
  it('null and undefined are empty', () => {
    expect(ObjectUtils.isEmpty(null)).toBe(true);
    expect(ObjectUtils.isEmpty(undefined)).toBe(true);
  });
  it('empty array and object', () => {
    expect(ObjectUtils.isEmpty([])).toBe(true);
    expect(ObjectUtils.isEmpty({})).toBe(true);
  });
  it('non-empty values', () => {
    expect(ObjectUtils.isEmpty([1])).toBe(false);
    expect(ObjectUtils.isEmpty({ a: 1 })).toBe(false);
  });
});

describe('ObjectUtils.deepEqual', () => {
  it('reflexive', () => {
    expect(ObjectUtils.deepEqual({ a: 1 }, { a: 1 })).toBe(true);
  });
  it('nested', () => {
    expect(ObjectUtils.deepEqual({ a: { b: [1, 2] } }, { a: { b: [1, 2] } })).toBe(true);
  });
  it('detects differences', () => {
    expect(ObjectUtils.deepEqual({ a: 1 }, { a: 2 })).toBe(false);
    expect(ObjectUtils.deepEqual([1, 2], [1, 2, 3])).toBe(false);
  });
});

describe('ColorUtils.hexToRgb', () => {
  it('parses 6-digit hex', () => {
    expect(ColorUtils.hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
  });
  it('accepts hex without leading #', () => {
    expect(ColorUtils.hexToRgb('00ff00')).toEqual({ r: 0, g: 255, b: 0 });
  });
  it('returns null for malformed input', () => {
    expect(ColorUtils.hexToRgb('not a color')).toBeNull();
  });
});

describe('ColorUtils.rgbToHex', () => {
  it('converts primaries', () => {
    expect(ColorUtils.rgbToHex(255, 0, 0)).toBe('#ff0000');
    expect(ColorUtils.rgbToHex(0, 255, 0)).toBe('#00ff00');
    expect(ColorUtils.rgbToHex(0, 0, 255)).toBe('#0000ff');
  });
});

describe('ColorUtils.adjustOpacity', () => {
  it('converts hex to rgba with opacity', () => {
    expect(ColorUtils.adjustOpacity('#ff0000', 0.5)).toBe('rgba(255, 0, 0, 0.5)');
  });
  it('adjusts opacity on existing rgba', () => {
    expect(ColorUtils.adjustOpacity('rgba(100, 50, 25, 1)', 0.3)).toBe('rgba(100, 50, 25, 0.3)');
  });
  it('returns input unchanged for unparseable colors', () => {
    expect(ColorUtils.adjustOpacity('red', 0.5)).toBe('red');
  });
});

describe('RandomUtils.id', () => {
  it('defaults to length 8', () => {
    expect(RandomUtils.id()).toHaveLength(8);
  });
  it('respects custom length', () => {
    expect(RandomUtils.id(16)).toHaveLength(16);
  });
  it('uses alphanumeric characters only', () => {
    expect(RandomUtils.id(100)).toMatch(/^[A-Za-z0-9]+$/);
  });
});

describe('RandomUtils.number', () => {
  it('stays within range [min, max]', () => {
    for (let i = 0; i < 50; i++) {
      const n = RandomUtils.number(5, 10);
      expect(n).toBeGreaterThanOrEqual(5);
      expect(n).toBeLessThanOrEqual(10);
      expect(Number.isInteger(n)).toBe(true);
    }
  });
});
