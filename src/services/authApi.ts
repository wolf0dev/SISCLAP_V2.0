import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RecoverPasswordRequest,
  RecoverPasswordResponse,
  UpdateUserRequest,
  UpdatePasswordRequest,
  RecoverUserRequest,
  RecoverUserResponse,
  ApiResponse
} from '../types/auth';

const API_BASE_URL = 'https://localhost:3000/api/usuarios';

class AuthApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if token exists
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.makeRequest<LoginResponse>('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Store token in AsyncStorage
    if (response.token) {
      await AsyncStorage.setItem('auth_token', response.token);
      await AsyncStorage.setItem('user_data', JSON.stringify(response));
    }

    return response;
  }

  async register(userData: RegisterRequest): Promise<ApiResponse> {
    return this.makeRequest<ApiResponse>('/registro', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async recoverPassword(data: RecoverPasswordRequest): Promise<RecoverPasswordResponse> {
    return this.makeRequest<RecoverPasswordResponse>('/recuperar', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUser(userData: UpdateUserRequest): Promise<ApiResponse> {
    return this.makeRequest<ApiResponse>('/actualizar', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async updatePassword(passwordData: UpdatePasswordRequest): Promise<ApiResponse> {
    return this.makeRequest<ApiResponse>('/actualizar-contrasena', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  async recoverUser(data: RecoverUserRequest): Promise<RecoverUserResponse> {
    return this.makeRequest<RecoverUserResponse>('/recuperar-usuario', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('user_data');
  }

  async getStoredUser(): Promise<LoginResponse | null> {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting stored user:', error);
      return null;
    }
  }

  async getStoredToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Error getting stored token:', error);
      return null;
    }
  }
}

export const authApi = new AuthApiService();