import {
  getFlexDirection,
  getTextAlign,
  getRTLMargin,
  getRTLPadding,
  getRTLBorder,
  transformRTLStyle,
  getRTLIconName,
} from '../../src/utils/rtl';

describe('getFlexDirection', () => {
  it('returns row-reverse when RTL is true', () => {
    expect(getFlexDirection(true)).toBe('row-reverse');
  });
  it('returns row when RTL is false', () => {
    expect(getFlexDirection(false)).toBe('row');
  });
  it('respects explicit flexDir override', () => {
    expect(getFlexDirection(true, 'column')).toBe('column');
    expect(getFlexDirection(false, 'column-reverse')).toBe('column-reverse');
  });
});

describe('getTextAlign', () => {
  it('returns right when RTL is true', () => {
    expect(getTextAlign(true)).toBe('right');
  });
  it('returns left when RTL is false', () => {
    expect(getTextAlign(false)).toBe('left');
  });
  it('respects explicit center override', () => {
    expect(getTextAlign(true, 'center')).toBe('center');
  });
});

describe('getRTLMargin', () => {
  it('marginStart maps to marginRight in RTL', () => {
    expect(getRTLMargin(true).marginStart(16)).toEqual({ marginRight: 16 });
  });
  it('marginStart maps to marginLeft in LTR', () => {
    expect(getRTLMargin(false).marginStart(16)).toEqual({ marginLeft: 16 });
  });
  it('marginEnd flips vs marginStart', () => {
    expect(getRTLMargin(true).marginEnd(16)).toEqual({ marginLeft: 16 });
    expect(getRTLMargin(false).marginEnd(16)).toEqual({ marginRight: 16 });
  });
});

describe('getRTLPadding', () => {
  it('paddingStart maps to paddingRight in RTL', () => {
    expect(getRTLPadding(true).paddingStart(16)).toEqual({ paddingRight: 16 });
  });
  it('paddingStart maps to paddingLeft in LTR', () => {
    expect(getRTLPadding(false).paddingStart(16)).toEqual({ paddingLeft: 16 });
  });
  it('paddingEnd flips vs paddingStart', () => {
    expect(getRTLPadding(true).paddingEnd(16)).toEqual({ paddingLeft: 16 });
    expect(getRTLPadding(false).paddingEnd(16)).toEqual({ paddingRight: 16 });
  });
  it('paddingHorizontal sets both sides regardless of direction', () => {
    expect(getRTLPadding(true).paddingHorizontal(16)).toEqual({
      paddingLeft: 16,
      paddingRight: 16,
    });
    expect(getRTLPadding(false).paddingHorizontal(16)).toEqual({
      paddingLeft: 16,
      paddingRight: 16,
    });
  });
});

describe('getRTLBorder', () => {
  it('borderStart maps to borderRightWidth in RTL', () => {
    const { borderStart } = getRTLBorder(true);
    const result = borderStart(2);
    expect(result.borderRightWidth).toBe(2);
  });
  it('includes color when provided', () => {
    const { borderStart } = getRTLBorder(false);
    const result = borderStart(2, '#ff0000');
    expect(result).toMatchObject({ borderLeftWidth: 2, borderLeftColor: '#ff0000' });
  });
});

describe('transformRTLStyle', () => {
  it('swaps marginLeft <-> marginRight in RTL', () => {
    const input = { marginLeft: 10, marginRight: 20 };
    const out = transformRTLStyle(input, true);
    expect(out.marginLeft).toBe(20);
    expect(out.marginRight).toBe(10);
  });
  it('does not swap in LTR', () => {
    const input = { marginLeft: 10, marginRight: 20 };
    const out = transformRTLStyle(input, false);
    expect(out).toEqual(input);
  });
  it('mirrors textAlign from left to right in RTL', () => {
    const out = transformRTLStyle({ textAlign: 'left' as const }, true);
    expect(out.textAlign).toBe('right');
  });
  it('mirrors flexDirection row to row-reverse in RTL', () => {
    const out = transformRTLStyle({ flexDirection: 'row' as const }, true);
    expect(out.flexDirection).toBe('row-reverse');
  });
  it('preserves unrelated style keys', () => {
    const out = transformRTLStyle({ color: 'red', padding: 8 }, true);
    expect(out.color).toBe('red');
    expect(out.padding).toBe(8);
  });
});

describe('getRTLIconName', () => {
  it('flips chevron-back to chevron-forward in RTL', () => {
    expect(getRTLIconName('chevron-back', true)).toBe('chevron-forward');
  });
  it('flips chevron-forward to chevron-back in RTL', () => {
    expect(getRTLIconName('chevron-forward', true)).toBe('chevron-back');
  });
  it('does not flip in LTR', () => {
    expect(getRTLIconName('chevron-back', false)).toBe('chevron-back');
  });
  it('returns unknown icons unchanged', () => {
    expect(getRTLIconName('heart', true)).toBe('heart');
  });
});
