export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface AppState {
  isLoading: boolean;
  user: User | null;
  theme: ThemeMode;
  isAuthenticated: boolean;
}

export interface NavigationProps {
  navigation: any;
  route: any;
}

export type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Settings: undefined;
  Login: undefined;
  Register: undefined;
};

export interface FormFieldProps {
  label: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
}

export interface ToastConfig {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}