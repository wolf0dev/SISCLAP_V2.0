import api from './api';

export interface Calle {
  id_calle: number;
  nom_calle: string;
  id_com?: number;
}

export const calleService = {
  getAll: async (): Promise<Calle[]> => {
    const response = await api.get('/api/calles');
    return response.data;
  }
};