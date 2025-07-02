import api from './api';

export interface Beneficiario {
  cedula: string;
  nombre_apellido: string;
  profesion: string;
  fecha_nacimiento: string;
  grado_instruccion: string;
  enfermedad_cronica: string;
  discapacidad: string;
  genero: string;
  telefono: string;
  numero_casa: string;
  id_calle: number;
  nom_calle?: string;
  estado_civil: string;
  estatus: string;
}

export const beneficiarioService = {
  getAll: async (): Promise<Beneficiario[]> => {
    const response = await api.get('/api/beneficiarios');
    return response.data;
  },

  getAllByUserCalle: async (idCalle: number): Promise<Beneficiario[]> => {
    const response = await api.get('/api/beneficiarios');
    const allBeneficiarios = response.data;
    return allBeneficiarios.filter((b: Beneficiario) => b.id_calle === idCalle);
  },

  getById: async (cedula: string): Promise<Beneficiario> => {
    const response = await api.get(`/api/beneficiarios/${cedula}`);
    return response.data;
  },

  create: async (beneficiario: Omit<Beneficiario, 'nom_calle'>): Promise<{ message: string }> => {
    const response = await api.post('/api/beneficiarios', {
      ...beneficiario,
      estatus: 'Activo'
    });
    return response.data;
  },

  update: async (cedula: string, beneficiario: Partial<Omit<Beneficiario, 'nom_calle'>>): Promise<{ message: string }> => {
    const response = await api.put(`/api/beneficiarios/${cedula}`, {
      cedula,
      ...beneficiario,
      estatus: beneficiario.estatus || 'Activo'
    });
    return response.data;
  },

  updateStatus: async (cedula: string, estatus: string): Promise<{ message: string }> => {
    const response = await api.put(`/api/beneficiarios/estatus/${cedula}`, {
      estatus: estatus
    });
    return response.data;
  },

  disable: async (cedula: string): Promise<{ message: string }> => {
    return beneficiarioService.updateStatus(cedula, 'Inactivo');
  },

  canAccessBeneficiario: (beneficiario: Beneficiario, userRole: number, userCalle: number): boolean => {
    if (userRole === 1) return true;
    if (userRole === 2) return beneficiario.id_calle === userCalle;
    return false;
  },

  isActive: (beneficiario: Beneficiario): boolean => {
    return beneficiario.estatus === 'ACTIVO' || beneficiario.estatus === 'Activo';
  },

  isInactive: (beneficiario: Beneficiario): boolean => {
    return beneficiario.estatus === 'INACTIVO' || beneficiario.estatus === 'Inactivo';
  },
};