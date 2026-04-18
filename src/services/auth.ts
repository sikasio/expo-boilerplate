import { apiClient } from '../config/api';
import { StorageService } from './storage';
import { STORAGE_KEYS, API_ENDPOINTS } from '../constants';
import { User, ApiResponse } from '../types';
import { logger } from '../utils/logger';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      const { user, token, refreshToken } = response.data;

      // Store auth data
      await StorageService.setSecureItem(STORAGE_KEYS.USER_TOKEN, token);
      await StorageService.setObject(STORAGE_KEYS.USER_DATA, user);

      return response.data;
    } catch (error) {
      logger.error('Login failed', error, { 
        function: 'login',
        component: 'AuthService',
        email: credentials.email
      });
      throw error;
    }
  }

  static async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        API_ENDPOINTS.AUTH.REGISTER,
        credentials
      );

      const { user, token } = response.data;

      // Store auth data
      await StorageService.setSecureItem(STORAGE_KEYS.USER_TOKEN, token);
      await StorageService.setObject(STORAGE_KEYS.USER_DATA, user);

      return response.data;
    } catch (error) {
      logger.error('Registration failed', error, { 
        function: 'register',
        component: 'AuthService',
        email: credentials.email
      });
      throw error;
    }
  }

  static async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      logger.error('Logout failed', error, { 
        function: 'logout',
        component: 'AuthService'
      });
    } finally {
      // Clear stored auth data
      await StorageService.removeSecureItem(STORAGE_KEYS.USER_TOKEN);
      await StorageService.removeItem(STORAGE_KEYS.USER_DATA);
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const user = await StorageService.getObject<User>(STORAGE_KEYS.USER_DATA);
      return user;
    } catch (error) {
      logger.error('Get current user failed', error, { 
        function: 'getCurrentUser',
        component: 'AuthService'
      });
      return null;
    }
  }

  static async getToken(): Promise<string | null> {
    try {
      return await StorageService.getSecureItem(STORAGE_KEYS.USER_TOKEN);
    } catch (error) {
      logger.error('Get token failed', error, { 
        function: 'getToken',
        component: 'AuthService'
      });
      return null;
    }
  }

  static async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getToken();
      return !!token;
    } catch (error) {
      logger.error('Check authentication failed', error, { 
        function: 'isAuthenticated',
        component: 'AuthService'
      });
      return false;
    }
  }

  static async forgotPassword(email: string): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    } catch (error) {
      logger.error('Forgot password failed', error, { 
        function: 'forgotPassword',
        component: 'AuthService',
        email
      });
      throw error;
    }
  }

  static async resetPassword(token: string, password: string): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        token,
        password,
      });
    } catch (error) {
      logger.error('Reset password failed', error, { 
        function: 'resetPassword',
        component: 'AuthService'
      });
      throw error;
    }
  }
}