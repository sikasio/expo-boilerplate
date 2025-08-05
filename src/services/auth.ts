import { apiClient } from '@/config/api';
import { StorageService } from './storage';
import { STORAGE_KEYS, API_ENDPOINTS } from '@/constants';
import { User, ApiResponse } from '@/types';

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
      console.error('Login error:', error);
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
      console.error('Register error:', error);
      throw error;
    }
  }

  static async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
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
      console.error('Get current user error:', error);
      return null;
    }
  }

  static async getToken(): Promise<string | null> {
    try {
      return await StorageService.getSecureItem(STORAGE_KEYS.USER_TOKEN);
    } catch (error) {
      console.error('Get token error:', error);
      return null;
    }
  }

  static async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getToken();
      return !!token;
    } catch (error) {
      console.error('Check authentication error:', error);
      return false;
    }
  }

  static async forgotPassword(email: string): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    } catch (error) {
      console.error('Forgot password error:', error);
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
      console.error('Reset password error:', error);
      throw error;
    }
  }
}