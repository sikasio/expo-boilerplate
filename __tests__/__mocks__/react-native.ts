/**
 * Minimal react-native mock for the pure-function util tests.
 *
 * rtl.ts and helpers.ts import I18nManager, StyleSheet, Dimensions, and
 * Platform. The tests only exercise logic that doesn't depend on the
 * real native side, so stubbing is enough.
 */

export const I18nManager = {
  isRTL: false,
  forceRTL: (_: boolean) => {},
  allowRTL: (_: boolean) => {},
};

export const StyleSheet = {
  create: <T extends Record<string, unknown>>(styles: T): T => styles,
  flatten: (style: unknown) => (Array.isArray(style) ? Object.assign({}, ...style) : style),
  hairlineWidth: 1,
  absoluteFillObject: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
};

export const Dimensions = {
  get: (_: 'window' | 'screen') => ({ width: 375, height: 812, scale: 2, fontScale: 1 }),
  addEventListener: (_a: string, _b: unknown) => ({ remove: () => {} }),
};

export const Platform = {
  OS: 'ios' as 'ios' | 'android' | 'web',
  Version: 16,
  select: <T>(specifics: { ios?: T; android?: T; default?: T }) =>
    specifics.ios ?? specifics.default,
};

// Empty type exports — the real RN types are complex and tests don't introspect them.
export type TextStyle = Record<string, unknown>;
export type ViewStyle = Record<string, unknown>;
export type StyleProp<T> = T | T[] | null | undefined;
