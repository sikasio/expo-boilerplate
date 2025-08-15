import React, { createContext, useContext, useState, useEffect } from 'react';
import { I18nManager, Platform } from 'react-native';
import { StorageService } from '@/services/storage';
import { STORAGE_KEYS } from '@/constants';

interface RTLContextType {
  isRTL: boolean;
  setRTL: (enabled: boolean) => Promise<void>;
  toggleRTL: () => Promise<void>;
}

const RTLContext = createContext<RTLContextType | undefined>(undefined);

export function RTLProvider({ children }: { children: React.ReactNode }) {
  const [isRTL, setIsRTLState] = useState<boolean>(false); // Start with LTR, load from storage

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
        
        console.log(`Loaded RTL setting: ${rtlEnabled ? 'RTL' : 'LTR'}`);
        console.log('I18nManager forced to LTR, using manual RTL control');
      }
    } catch (error) {
      console.error('Failed to load RTL setting:', error);
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
      
      console.log(`RTL direction changed to: ${enabled ? 'RTL' : 'LTR'}`);
      console.log(`Platform: ${Platform.OS}, Manual RTL control enabled`);
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