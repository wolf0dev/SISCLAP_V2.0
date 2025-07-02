import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import auth from './auth';
import { useNotification } from '../app/providers/NotificationProvider';
import { calleService } from '../domain/services';

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  recoverPassword: async () => {},
  recoverUsername: async () => {},
  updateProfile: async () => {},
  changePassword: async () => {},
  isLiderComunidad: () => false,
  isJefeCalle: () => false,
  canAccessGeneralReports: () => false,
  getUserCalle: () => null,
  getUserCalleNombre: () => null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userCalleNombre, setUserCalleNombre] = useState(null);
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initializeAuth = async () => {
      if (!auth.isTokenValid()) {
        auth.logout();
        setUser(null);
        if (location.pathname !== '/login') {
          navigate('/login');
        }
      } else {
        const userData = auth.getCurrentUser();
        if (userData) {
          setUser(userData);
          
          // Obtener el nombre de la calle si el usuario es jefe de calle
          if (userData.id_rol_user === 2 && userData.id_calle) {
            try {
              const calle = await calleService.getById(userData.id_calle);
              setUserCalleNombre(calle.nom_calle);
            } catch (error) {
              console.error('Error al obtener nombre de calle:', error);
            }
          }
          
          if (location.pathname === '/login') {
            navigate('/dashboard');
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [navigate, location.pathname]);

  const login = async (username, password) => {
    try {
      const userData = await auth.login(username, password);
      setUser(userData);
      
      // Obtener el nombre de la calle si el usuario es jefe de calle
      if (userData.id_rol_user === 2 && userData.id_calle) {
        try {
          const calle = await calleService.getById(userData.id_calle);
          setUserCalleNombre(calle.nom_calle);
        } catch (error) {
          console.error('Error al obtener nombre de calle:', error);
        }
      }
      
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      const errorMessage = error.response?.data?.error || 'Error al iniciar sesión';
      showNotification(errorMessage, 'error');
      throw error;
    }
  };

  const logout = () => {
    auth.logout();
    setUser(null);
    setUserCalleNombre(null);
    navigate('/login', { replace: true });
  };

  const register = async (userData) => {
    try {
      const response = await auth.register(userData);
      showNotification('Usuario registrado exitosamente', 'success');
      return response;
    } catch (error) {
      console.error('Error de registro:', error);
      const errorMessage = error.response?.data?.error || 'Error al registrar usuario';
      showNotification(errorMessage, 'error');
      throw error;
    }
  };

  const recoverPassword = async (correo, ced_user) => {
    try {
      const response = await auth.recoverPassword(correo, ced_user);
      showNotification('Instrucciones enviadas a tu correo', 'success');
      return response;
    } catch (error) {
      console.error('Error al recuperar contraseña:', error);
      const errorMessage = error.response?.data?.error || 'Error al recuperar contraseña';
      showNotification(errorMessage, 'error');
      throw error;
    }
  };

  const recoverUsername = async (ced_user, nom_user) => {
    try {
      const response = await auth.recoverUsername(ced_user, nom_user);
      showNotification('Usuario recuperado exitosamente', 'success');
      return response;
    } catch (error) {
      console.error('Error al recuperar usuario:', error);
      const errorMessage = error.response?.data?.error || 'Error al recuperar usuario';
      showNotification(errorMessage, 'error');
      throw error;
    }
  };

  const updateProfile = async (data) => {
    try {
      if (!user) throw new Error('No hay usuario autenticado');

      const response = await auth.updateProfile(data, user.id);

      if (response.message) {
        const updatedUser = {
          ...user,
          nom_user: data.nom_user,
          user: data.user,
          ced_user: data.ced_user,
          correo: data.correo,
          foto_perfil: data.foto_perfil,
        };

        setUser(updatedUser);
        localStorage.setItem('userData', JSON.stringify(updatedUser));

        showNotification('Perfil actualizado exitosamente', 'success');
      }

      return response;
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      const errorMessage = error.response?.data?.error || 'Error al actualizar perfil';
      showNotification(errorMessage, 'error');
      throw error;
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    try {
      if (!user) throw new Error('No hay usuario autenticado');

      const response = await auth.changePassword(user.id, oldPassword, newPassword);

      if (response.message) {
        showNotification('Contraseña actualizada exitosamente', 'success');
        logout();
      }

      return response;
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      if (error.response?.status === 400) {
        showNotification('Contraseña actual incorrecta', 'error');
      } else {
        const errorMessage = error.response?.data?.error || 'Error al cambiar contraseña';
        showNotification(errorMessage, 'error');
      }
      throw error;
    }
  };

  // Funciones para manejo de roles
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
        register,
        recoverPassword,
        recoverUsername,
        updateProfile,
        changePassword,
        isLiderComunidad,
        isJefeCalle,
        canAccessGeneralReports,
        getUserCalle,
        getUserCalleNombre,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };