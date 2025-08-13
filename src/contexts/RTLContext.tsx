import React, { createContext, useContext, useState, useEffect } from 'react';
import { I18nManager } from 'react-native';
import { StorageService } from '@/services/storage';
import { STORAGE_KEYS } from '@/constants';

interface RTLContextType {
  isRTL: boolean;
  setRTL: (enabled: boolean) => Promise<void>;
  toggleRTL: () => Promise<void>;
}

const RTLContext = createContext<RTLContextType | undefined>(undefined);

export function RTLProvider({ children }: { children: React.ReactNode }) {
  const [isRTL, setIsRTLState] = useState<boolean>(I18nManager.isRTL);

  useEffect(() => {
    loadRTLSetting();
  }, []);

  const loadRTLSetting = async () => {
    try {
      const savedRTL = await StorageService.getItem(STORAGE_KEYS.RTL_DIRECTION);
      if (savedRTL !== null) {
        const rtlEnabled = savedRTL === 'true';
        setIsRTLState(rtlEnabled);
        
        // Apply to React Native I18nManager if different from current state
        if (I18nManager.isRTL !== rtlEnabled) {
          I18nManager.forceRTL(rtlEnabled);
          // Note: App restart required for I18nManager changes to take effect
        }
      }
    } catch (error) {
      console.error('Failed to load RTL setting:', error);
    }
  };

  const setRTL = async (enabled: boolean) => {
    try {
      setIsRTLState(enabled);
      await StorageService.setItem(STORAGE_KEYS.RTL_DIRECTION, enabled.toString());
      
      // Apply to React Native I18nManager
      I18nManager.forceRTL(enabled);
      
      // Note: Full app restart is required for I18nManager changes to take effect
      // For demo purposes, we update local state immediately
      console.log(`RTL direction changed to: ${enabled ? 'RTL' : 'LTR'}`);
    } catch (error) {
      console.error('Failed to save RTL setting:', error);
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