import api from './api';

export interface Calle {
  id_calle: number; // Corregido: usar id_calle como en la API
  nom_calle: string; // Corregido: usar nom_calle como en la API
  id_com?: number; // Campo opcional
}

export const calleService = {
  getAll: async (): Promise<Calle[]> => {
    const response = await api.get('/api/calles');
    return response.data;
  }
};