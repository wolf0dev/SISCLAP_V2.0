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
  // Obtener todos los beneficiarios
  getAll: async (): Promise<Beneficiario[]> => {
    const response = await api.get('/api/beneficiarios');
    return response.data;
  },

  // Obtener beneficiarios filtrados por calle del usuario
  getAllByUserCalle: async (idCalle: number): Promise<Beneficiario[]> => {
    const response = await api.get('/api/beneficiarios');
    const allBeneficiarios = response.data;
    // Filtrar por la calle del usuario
    return allBeneficiarios.filter((b: Beneficiario) => b.id_calle === idCalle);
  },

  // Obtener beneficiario por cédula
  getById: async (cedula: string): Promise<Beneficiario> => {
    const response = await api.get(`/api/beneficiarios/${cedula}`);
    return response.data;
  },

  // Crear nuevo beneficiario
  create: async (beneficiario: Omit<Beneficiario, 'nom_calle'>): Promise<{ message: string }> => {
    const response = await api.post('/api/beneficiarios', {
      ...beneficiario,
      estatus: 'Activo'
    });
    return response.data;
  },

  // Actualizar beneficiario
  update: async (cedula: string, beneficiario: Partial<Omit<Beneficiario, 'nom_calle'>>): Promise<{ message: string }> => {
    const response = await api.put(`/api/beneficiarios/${cedula}`, {
      cedula,
      ...beneficiario,
      estatus: beneficiario.estatus || 'Activo'
    });
    return response.data;
  },

  // Actualizar estatus del beneficiario
  updateStatus: async (cedula: string, estatus: string): Promise<{ message: string }> => {
    const response = await api.put(`/api/beneficiarios/estatus/${cedula}`, {
      estatus: estatus
    });
    return response.data;
  },

  // Deshabilitar beneficiario (cambiar estatus a Inactivo)
  disable: async (cedula: string): Promise<{ message: string }> => {
    return beneficiarioService.updateStatus(cedula, 'Inactivo');
  },

  // Verificar si el usuario puede acceder a este beneficiario
  canAccessBeneficiario: (beneficiario: Beneficiario, userRole: number, userCalle: number): boolean => {
    // Líder de comunidad puede acceder a todos
    if (userRole === 1) return true;
    // Jefe de calle solo puede acceder a beneficiarios de su calle
    if (userRole === 2) return beneficiario.id_calle === userCalle;
    return false;
  },

  // Función helper para verificar si un beneficiario está activo
  isActive: (beneficiario: Beneficiario): boolean => {
    return beneficiario.estatus === 'ACTIVO' || beneficiario.estatus === 'Activo';
  },

  // Función helper para verificar si un beneficiario está inactivo
  isInactive: (beneficiario: Beneficiario): boolean => {
    return beneficiario.estatus === 'INACTIVO' || beneficiario.estatus === 'Inactivo';
  },
};