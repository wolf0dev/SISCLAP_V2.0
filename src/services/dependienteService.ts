import api from './api';

export interface Dependiente {
  cedula: string;
  nombre_apellido: string;
  profesion: string;
  fecha_nacimiento: string;
  grado_instruccion: string;
  enfermedad_cronica: string;
  discapacidad: string;
  genero: string; // Corregido: string en lugar de number
  telefono: string;
  estado_civil: string;
  parentesco: string;
  cedula_beneficiario: string;
}

export const dependienteService = {
  // Obtener dependientes por beneficiario
  getByBeneficiario: async (cedulaBeneficiario: string): Promise<Dependiente[]> => {
    const response = await api.get(`/api/dependientes/${cedulaBeneficiario}`);
    return response.data;
  },

  // Obtener dependiente por cédula
  getById: async (cedula: string): Promise<Dependiente> => {
    const response = await api.get(`/api/dependientes/detalles/${cedula}`);
    return response.data;
  },

  // Crear nuevo dependiente
  create: async (dependiente: Dependiente): Promise<{ message: string }> => {
    const response = await api.post('/api/dependientes', dependiente);
    return response.data;
  },

  // Actualizar dependiente
  update: async (cedula: string, dependiente: Omit<Dependiente, 'cedula'>): Promise<{ message: string }> => {
    const response = await api.put(`/api/dependientes/${cedula}`, dependiente);
    return response.data;
  },

  // Eliminar dependiente
  delete: async (cedula: string): Promise<{ message: string }> => {
    const response = await api.delete(`/api/dependientes/${cedula}`);
    return response.data;
  }
};