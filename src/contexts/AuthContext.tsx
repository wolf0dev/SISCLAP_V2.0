import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { userService, User } from '../services/userService';
import { calleService } from '../services/calleService';
import api from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  recoverPassword: (email: string, cedula: string) => Promise<any>;
  recoverUsername: (cedula: string, nombre: string) => Promise<any>;
  isLiderComunidad: () => boolean;
  isJefeCalle: () => boolean;
  canAccessGeneralReports: () => boolean;
  getUserCalle: () => number | null;
  getUserCalleNombre: () => string | null;
  refreshUserData: () => Promise<void>;
}

interface UpdateProfileData {
  nom_user: string;
  ced_user: string;
  user: string;
  correo: string;
  foto_perfil?: string;
}

interface LoginResponse {
  token: string;
  id: number;
  nom_user: string;
  ced_user: string;
  user: string;
  correo: string;
  id_rol_user: number;
  id_calle: number;
  foto_perfil?: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
  changePassword: async () => {},
  recoverPassword: async () => ({}),
  recoverUsername: async () => ({}),
  isLiderComunidad: () => false,
  isJefeCalle: () => false,
  canAccessGeneralReports: () => false,
  getUserCalle: () => null,
  getUserCalleNombre: () => null,
  refreshUserData: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userCalleNombre, setUserCalleNombre] = useState<string | null>(null);

  const refreshUserData = async () => {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) return;

    try {
      const userData = await userService.getById(parseInt(userId));
      
      if (userData.foto_perfil) {
        try {
          if (typeof userData.foto_perfil === 'string') {
            userData.foto_perfil = `data:image/jpeg;base64,${userData.foto_perfil}`;
          }
        } catch (error) {
          console.warn('Error procesando foto de perfil:', error);
          userData.foto_perfil = undefined;
        }
      }

      setUser(userData);

      if (userData.id_rol_user === 2 && userData.id_calle) {
        try {
          const calles = await calleService.getAll();
          const calle = calles.find(c => c.id_calle === userData.id_calle);
          setUserCalleNombre(calle?.nom_calle || null);
        } catch (error) {
          console.error('Error al obtener nombre de calle:', error);
        }
      }
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      await logout();
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');

      if (!token || !userId) {
        setLoading(false);
        return;
      }

      try {
        const decodedToken: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp && decodedToken.exp < currentTime) {
          await AsyncStorage.multiRemove(['token', 'userId']);
          setUser(null);
        } else {
          await refreshUserData();
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        await AsyncStorage.multiRemove(['token', 'userId']);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post<LoginResponse>('/api/usuarios/login', {
        user: username,
        pass_user: password,
      });

      const { token, id, ...userData } = response.data;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('userId', id.toString());

      if (userData.foto_perfil) {
        try {
          if (typeof userData.foto_perfil === 'string') {
            userData.foto_perfil = `data:image/jpeg;base64,${userData.foto_perfil}`;
          }
        } catch (error) {
          console.warn('Error procesando foto de perfil:', error);
          userData.foto_perfil = undefined;
        }
      }

      const fullUserData = { id, ...userData };
      setUser(fullUserData);

      if (userData.id_rol_user === 2 && userData.id_calle) {
        try {
          const calles = await calleService.getAll();
          const calle = calles.find(c => c.id_calle === userData.id_calle);
          setUserCalleNombre(calle?.nom_calle || null);
        } catch (error) {
          console.error('Error al obtener nombre de calle:', error);
        }
      }
    } catch (error: any) {
      console.error('Error de inicio de sesión:', error);
      const errorMessage = error.response?.data?.error || 'Error al iniciar sesión';
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['token', 'userId']);
    setUser(null);
    setUserCalleNombre(null);
  };

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      if (!user) throw new Error('No hay usuario autenticado');

      let foto_perfil = null;
      if (data.foto_perfil && data.foto_perfil.startsWith('data:image/')) {
        foto_perfil = data.foto_perfil.split(',')[1];
      }

      await userService.update({
        id: user.id,
        nom_user: data.nom_user,
        user: data.user,
        ced_user: data.ced_user,
        correo: data.correo,
        id_rol_user: user.id_rol_user,
        id_calle: user.id_calle,
        foto_perfil: foto_perfil,
      });

      await refreshUserData();
    } catch (error: any) {
      console.error('Error al actualizar perfil:', error);
      const errorMessage = error.response?.data?.error || 'Error al actualizar perfil';
      throw new Error(errorMessage);
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      if (!user) throw new Error('No hay usuario autenticado');

      await userService.changePassword(user.id, oldPassword, newPassword);
      await logout();
    } catch (error: any) {
      console.error('Error al cambiar contraseña:', error);
      if (error.response?.status === 400) {
        throw new Error('Contraseña actual incorrecta');
      } else {
        const errorMessage = error.response?.data?.error || 'Error al cambiar contraseña';
        throw new Error(errorMessage);
      }
    }
  };

  const recoverPassword = async (correo: string, ced_user: string) => {
    try {
      const response = await userService.recoverPassword(correo, ced_user);
      return response;
    } catch (error: any) {
      console.error('Error al recuperar contraseña:', error);
      const errorMessage = error.response?.data?.error || 'Error al recuperar contraseña';
      throw new Error(errorMessage);
    }
  };

  const recoverUsername = async (ced_user: string, nom_user: string) => {
    try {
      const response = await userService.recoverUsername(ced_user, nom_user);
      return response;
    } catch (error: any) {
      console.error('Error al recuperar usuario:', error);
      const errorMessage = error.response?.data?.error || 'Error al recuperar usuario';
      throw new Error(errorMessage);
    }
  };

  const isLiderComunidad = () => {
    return user?.id_rol_user === 1;
  };

  const isJefeCalle = () => {
    return user?.id_rol_user === 2;
  };

  const canAccessGeneralReports = () => {
    return isLiderComunidad();
  };

  const getUserCalle = () => {
    return user?.id_calle || null;
  };

  const getUserCalleNombre = () => {
    return userCalleNombre;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        updateProfile,
        changePassword,
        recoverPassword,
        recoverUsername,
        isLiderComunidad,
        isJefeCalle,
        canAccessGeneralReports,
        getUserCalle,
        getUserCalleNombre,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};