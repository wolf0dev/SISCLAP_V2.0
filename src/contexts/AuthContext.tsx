import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../services/authApi';
import {
  User,
  LoginRequest,
  RegisterRequest,
  UpdateUserRequest,
  UpdatePasswordRequest,
  RecoverPasswordRequest,
  RecoverPasswordResponse,
  RecoverUserRequest,
  RecoverUserResponse,
  AuthContextType
} from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const storedToken = await authApi.getStoredToken();
      const storedUser = await authApi.getStoredUser();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser({
          id: storedUser.id,
          nom_user: storedUser.nom_user,
          pass_user: storedUser.pass_user,
          id_rol_user: storedUser.id_rol_user,
          user: storedUser.user,
          ced_user: storedUser.ced_user,
          correo: storedUser.correo,
          id_calle: storedUser.id_calle,
          foto_perfil: storedUser.foto_perfil
        });
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      setLoading(true);
      const response = await authApi.login(credentials);
      
      setToken(response.token);
      setUser({
        id: response.id,
        nom_user: response.nom_user,
        pass_user: response.pass_user,
        id_rol_user: response.id_rol_user,
        user: response.user,
        ced_user: response.ced_user,
        correo: response.correo,
        id_calle: response.id_calle,
        foto_perfil: response.foto_perfil
      });
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      setLoading(true);
      await authApi.register(userData);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const updateUser = async (userData: UpdateUserRequest) => {
    try {
      setLoading(true);
      await authApi.updateUser(userData);
      
      // Update local user state
      if (user) {
        setUser({
          ...user,
          nom_user: userData.nom_user,
          id_rol_user: userData.id_rol_user,
          user: userData.user,
          ced_user: userData.ced_user,
          correo: userData.correo,
          id_calle: userData.id_calle,
          foto_perfil: userData.foto_perfil
        });
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (passwordData: UpdatePasswordRequest) => {
    try {
      setLoading(true);
      await authApi.updatePassword(passwordData);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const recoverPassword = async (data: RecoverPasswordRequest): Promise<RecoverPasswordResponse> => {
    try {
      setLoading(true);
      return await authApi.recoverPassword(data);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const recoverUser = async (data: RecoverUserRequest): Promise<RecoverUserResponse> => {
    try {
      setLoading(true);
      return await authApi.recoverUser(data);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    loading,
    login,
    register,
    logout,
    updateUser,
    updatePassword,
    recoverPassword,
    recoverUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}