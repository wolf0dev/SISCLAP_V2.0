import api from './api';

export interface User {
  id: number;
  nom_user: string;
  user: string;
  ced_user: string;
  correo: string;
  id_rol_user: number;
  id_calle: number;
  foto_perfil?: string;
  nom_calle?: string;
}

export interface CreateUserData {
  nom_user: string;
  user: string;
  ced_user: string;
  correo: string;
  pass_user: string;
  id_calle: number;
}

export interface UpdateUserData {
  id: number;
  nom_user: string;
  user: string;
  ced_user: string;
  correo: string;
  id_rol_user: number;
  id_calle: number;
  foto_perfil?: string;
}

export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get('/api/usuarios');
    return response.data;
  },

  getById: async (id: number): Promise<User> => {
    const response = await api.get(`/api/usuarios/${id}`);
    return response.data;
  },

  create: async (userData: CreateUserData): Promise<{ message: string }> => {
    const response = await api.post('/api/usuarios/registro', {
      ...userData,
      id_rol_user: 2,
      foto_perfil: null
    });
    return response.data;
  },

  update: async (userData: UpdateUserData): Promise<{ message: string }> => {
    const response = await api.put('/api/usuarios/actualizar', userData);
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/api/usuarios/${id}`);
    return response.data;
  },

  changePassword: async (id: number, oldPassword: string, newPassword: string): Promise<{ message: string }> => {
    const response = await api.put('/api/usuarios/actualizar-contrasena', {
      id,
      oldPassword,
      newPassword
    });
    return response.data;
  },

  recoverPassword: async (correo: string, ced_user: string): Promise<{ message: string; Usuario: string; NuevaContraseña: string }> => {
    const response = await api.post('/api/usuarios/recuperar', {
      correo,
      ced_user
    });
    return response.data;
  },

  recoverUsername: async (ced_user: string, nom_user: string): Promise<{ message: string; Usuario: string }> => {
    const response = await api.post('/api/usuarios/recuperar-usuario', {
      ced_user,
      nom_user
    });
    return response.data;
  }
};