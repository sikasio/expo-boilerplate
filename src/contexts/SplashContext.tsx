import React, { createContext, useContext, useState } from 'react';

interface SplashContextType {
  isSplashActive: boolean;
  setIsSplashActive: (active: boolean) => void;
}

const SplashContext = createContext<SplashContextType | undefined>(undefined);

export function SplashProvider({ children }: { children: React.ReactNode }) {
  const [isSplashActive, setIsSplashActive] = useState(false);

  const value: SplashContextType = {
    isSplashActive,
    setIsSplashActive,
  };

  return (
    <SplashContext.Provider value={value}>
      {children}
    </SplashContext.Provider>
  );
}

export function useSplash() {
  const context = useContext(SplashContext);
  if (context === undefined) {
    throw new Error('useSplash must be used within a SplashProvider');
  }
  return context;
}