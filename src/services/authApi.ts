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

// Use the correct API base URL from the documentation
const API_BASE_URL = 'http://localhost:3000/api/usuarios';

class AuthApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
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
      console.log(`Making auth request to: ${url}`, config);
      const response = await fetch(url, config);
      
      // Check if response has content
      const contentType = response.headers.get('content-type');
      const hasJsonContent = contentType && contentType.includes('application/json');
      
      let data;
      
      if (hasJsonContent) {
        const text = await response.text();
        if (text.trim() === '') {
          throw new Error('Respuesta vacía del servidor');
        }
        
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError, 'Response text:', text);
          throw new Error('Respuesta inválida del servidor');
        }
      } else {
        const text = await response.text();
        
        // Try to parse as JSON anyway (some servers don't set correct content-type)
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(`Respuesta no válida: ${text}`);
        }
      }

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      console.log(`Auth response from ${url}:`, data);
      return data;
    } catch (error) {
      console.error('Auth API Request failed:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Error de conexión. Verifique que el servidor SISCLAP esté funcionando en http://localhost:3000');
      }
      
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