import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState } from '../types';
import { logger } from '../utils/logger';

interface AppContextType {
  state: AppState;
  setLoading: (loading: boolean) => void;
  showError: (message: string) => void;
  clearError: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_USER'; payload: any }
  | { type: 'CLEAR_USER' };

const initialState: AppState = {
  isLoading: false,
  user: null,
  theme: 'system',
  isAuthenticated: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload 
      };
    case 'CLEAR_USER':
      return { 
        ...state, 
        user: null, 
        isAuthenticated: false 
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Removed notification service initialization

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const showError = (message: string) => {
    // Handle error display (could use Toast or another method)
    logger.error(message, null, { function: 'showError', component: 'AppProvider' });
  };

  const clearError = () => {
    // Clear error state
  };

  const value: AppContextType = {
    state,
    setLoading,
    showError,
    clearError,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}