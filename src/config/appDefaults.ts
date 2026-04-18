/**
 * App-specific default configurations for theme and RTL settings.
 *
 * NOTE: the standalone @sikasio/expo-boilerplate package has no knowledge of
 * the consuming app's defaults. Consumers should either:
 *   1. Pass their own defaults where needed, OR
 *   2. Override the `appDefaultsRegistry` below via `registerAppDefaults()`
 *      during app bootstrap.
 *
 * This keeps the package decoupled from any particular app.
 */

import { ThemeMode } from '../types';
import { getCurrentApp } from '../utils/getCurrentApp';

export interface AppDefaults {
  theme: {
    mode: ThemeMode;
    colorScheme: string;
  };
  rtl: {
    enabled: boolean;
  };
}

/**
 * Fallback defaults when no app-specific config is registered.
 */
const FALLBACK_DEFAULTS: AppDefaults = {
  theme: {
    mode: 'system',
    colorScheme: 'blue',
  },
  rtl: {
    enabled: false,
  },
};

/**
 * Registry of per-app defaults. Populate via `registerAppDefaults()` during
 * app bootstrap before any component reads `getCurrentAppDefaults()`.
 */
const appDefaultsRegistry: Record<string, AppDefaults> = {};

/**
 * Consumer apps call this early in their bootstrap to register their defaults.
 */
export function registerAppDefaults(appName: string, defaults: AppDefaults): void {
  appDefaultsRegistry[appName] = defaults;
}

function loadAppDefaults(appName: string): AppDefaults {
  return appDefaultsRegistry[appName] ?? FALLBACK_DEFAULTS;
}

export function getCurrentAppDefaults(): AppDefaults {
  return loadAppDefaults(getCurrentApp());
}

export function getAppDefaults(appName: string): AppDefaults {
  return loadAppDefaults(appName);
}

export function logCurrentAppDefaults(): void {
  // no-op; kept for backwards-compatible signature
}
