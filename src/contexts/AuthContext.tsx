import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: number;
  nom_user: string;
  user: string;
  ced_user: string;
  correo: string;
  id_rol_user: number;
  id_calle: number;
  foto_perfil?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLiderComunidad: () => boolean;
  isJefeCalle: () => boolean;
  getUserCalle: () => number | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  logout: async () => {},
  isLiderComunidad: () => false,
  isJefeCalle: () => false,
  getUserCalle: () => null,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');

        if (!token || !userId) {
          setLoading(false);
          return;
        }

        // Verificar si el token es válido
        const decodedToken: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp && decodedToken.exp < currentTime) {
          await AsyncStorage.multiRemove(['token', 'userId']);
          setUser(null);
        } else {
          // Aquí podrías hacer una llamada a la API para obtener los datos del usuario
          // Por ahora, simularemos un usuario
          const userData = {
            id: parseInt(userId),
            nom_user: 'Usuario Demo',
            user: 'demo',
            ced_user: '12345678',
            correo: 'demo@example.com',
            id_rol_user: 1,
            id_calle: 1,
          };
          setUser(userData);
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
      // Simulación de login - reemplazar con llamada real a la API
      if (username === 'admin' && password === 'admin') {
        const token = 'demo-token';
        const userData = {
          id: 1,
          nom_user: 'Administrador',
          user: 'admin',
          ced_user: '12345678',
          correo: 'admin@example.com',
          id_rol_user: 1,
          id_calle: 1,
        };

        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('userId', userData.id.toString());
        setUser(userData);
      } else {
        throw new Error('Credenciales inválidas');
      }
    } catch (error: any) {
      console.error('Error de inicio de sesión:', error);
      throw new Error(error.message || 'Error al iniciar sesión');
    }
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['token', 'userId']);
    setUser(null);
  };

  const isLiderComunidad = () => {
    return user?.id_rol_user === 1;
  };

  const isJefeCalle = () => {
    return user?.id_rol_user === 2;
  };

  const getUserCalle = () => {
    return user?.id_calle || null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        isLiderComunidad,
        isJefeCalle,
        getUserCalle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};