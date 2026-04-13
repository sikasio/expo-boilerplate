import React, { createContext, useContext, useState, useEffect } from 'react';
import { I18nManager, Platform } from 'react-native';
import { StorageService } from '@/services/storage';
import { STORAGE_KEYS } from '@/constants';
import { logger } from '@/utils/logger';
import { getCurrentApp } from '@/utils/getCurrentApp';
import { getCurrentAppDefaults } from '@/config/appDefaults';

interface RTLContextType {
  isRTL: boolean;
  setRTL: (enabled: boolean) => Promise<void>;
  toggleRTL: () => Promise<void>;
}

const RTLContext = createContext<RTLContextType | undefined>(undefined);

export function RTLProvider({ children }: { children: React.ReactNode }) {
  // Start with false initially, will be set properly after loading defaults
  const [isRTL, setIsRTLState] = useState<boolean>(false);

  useEffect(() => {
    loadRTLSetting();
  }, []);

  const loadRTLSetting = async () => {
    try {
      // Force I18nManager to LTR to prevent automatic flipping
      I18nManager.forceRTL(false);

      const savedRTL = await StorageService.getItem(STORAGE_KEYS.RTL_DIRECTION);
      if (savedRTL !== null) {
        const rtlEnabled = savedRTL === 'true';
        setIsRTLState(rtlEnabled);
      } else {
        // No saved preference, use app-specific default
        const appDefaults = getCurrentAppDefaults();
        const defaultRTL = appDefaults.rtl.enabled;
        setIsRTLState(defaultRTL);
        // Save the default for this app
        await StorageService.setItem(STORAGE_KEYS.RTL_DIRECTION, defaultRTL.toString());

        logger.debug('No saved RTL setting, using app default', {
          component: 'RTLContext',
          function: 'loadRTLSetting',
          app: getCurrentApp(),
          direction: defaultRTL ? 'RTL' : 'LTR',
          source: 'app_defaults'
        });
      }
    } catch (error) {
      logger.error('Failed to load RTL setting', error, {
        component: 'RTLContext',
        function: 'loadRTLSetting'
      });
      // Fallback to LTR on error
      setIsRTLState(false);
    }
  };

  const setRTL = async (enabled: boolean) => {
    try {
      // Update local state immediately for instant UI response
      setIsRTLState(enabled);
      await StorageService.setItem(STORAGE_KEYS.RTL_DIRECTION, enabled.toString());

      // DON'T use I18nManager.forceRTL() - this causes automatic flipping on Android
      // We want manual control over RTL behavior through our custom components
      // I18nManager.forceRTL(enabled);

      logger.debug('RTL direction changed', {
        component: 'RTLContext',
        function: 'setRTL',
        direction: enabled ? 'RTL' : 'LTR',
        platform: Platform.OS,
        manualControl: true
      });
    } catch (error) {
      logger.error('Failed to save RTL setting', error, {
        component: 'RTLContext',
        function: 'setRTL',
        enabled
      });
    }
  };

  const toggleRTL = async () => {
    await setRTL(!isRTL);
  };

  const value: RTLContextType = {
    isRTL,
    setRTL,
    toggleRTL,
  };

  return (
    <RTLContext.Provider value={value}>
      {children}
    </RTLContext.Provider>
  );
}

export function useRTL() {
  const context = useContext(RTLContext);
  if (context === undefined) {
    throw new Error('useRTL must be used within an RTLProvider');
  }
  return context;
}