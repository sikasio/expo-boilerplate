/**
 * Default Application Configuration
 *
 * Central configuration file for all app-wide settings.
 * Update values here to affect the entire application.
 */

import { AppDefaults } from '@sikasio/expo-boilerplate/config';

export const APP_DEFAULTS: AppDefaults = {
  theme: {
    mode: 'system', // Follow system preference
    colorScheme: 'blue', // Standard blue theme
  },
  rtl: {
    enabled: false, // LTR for English content
  },
};

