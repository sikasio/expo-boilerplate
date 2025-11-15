/**
 * App-specific default configurations for theme and RTL settings
 * Uses static imports with mapping for React Native compatibility
 */

import { ThemeMode } from '@/types';
import { getCurrentApp } from '@/utils/getCurrentApp';

// Static imports for React Native/Metro bundler compatibility
import { APP_DEFAULTS as DEFAULT_CONFIG } from '../../apps/_default/_config/appConfig';
import { APP_DEFAULTS as TILAWAH_CONFIG } from '../../apps/TilawahConnect/_config/appConfig';
import { APP_DEFAULTS as AUDIOBOOKS_CONFIG } from '../../apps/Yarwy/_config/appConfig';
import { APP_DEFAULTS as ECOMMERCE_CONFIG } from '../../apps/eCommerce-v1/_config/appConfig';
import { APP_DEFAULTS as CASHFLOW_CONFIG } from '../../apps/CashFlow/_config/appConfig';
import { APP_DEFAULTS as ECHONOTE_CONFIG } from '../../apps/EchoNote/_config/appConfig';

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
 * Static mapping of app names to their configurations
 */
const APP_CONFIG_MAP: Record<string, AppDefaults> = {
  '_default': DEFAULT_CONFIG,
  'TilawahConnect': TILAWAH_CONFIG,
  'Yarwy': AUDIOBOOKS_CONFIG,
  'eCommerce-v1': ECOMMERCE_CONFIG,
  'CashFlow': CASHFLOW_CONFIG,
  'EchoNote': ECHONOTE_CONFIG,
};

/**
 * Fallback defaults when app config is not available
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
 * Load app defaults from the static configuration map
 */
function loadAppDefaults(appName: string): AppDefaults {
  const config = APP_CONFIG_MAP[appName];
  if (config) {
    return config;
  }

  console.warn(`No configuration found for app: ${appName}, using fallback`);
  return FALLBACK_DEFAULTS;
}

/**
 * Get current app's default configuration
 */
export function getCurrentAppDefaults(): AppDefaults {
  const currentApp = getCurrentApp();
  return loadAppDefaults(currentApp);
}

/**
 * Get default configuration for a specific app
 */
export function getAppDefaults(appName: string): AppDefaults {
  return loadAppDefaults(appName);
}

/**
 * Log current app defaults (for debugging)
 */
export function logCurrentAppDefaults(): void {
  const currentApp = getCurrentApp();
  const defaults = getCurrentAppDefaults();
}