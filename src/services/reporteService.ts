import api from './api';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

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
  nom_calle: string;
  estado_civil: string;
  estatus: string;
}

export interface Dependiente {
  cedula: string;
  nombre_apellido: string;
  profesion: string;
  fecha_nacimiento: string;
  grado_instruccion: string;
  enfermedad_cronica: string;
  discapacidad: string;
  genero: string;
  telefono: string;
  estado_civil: string;
  parentesco: string;
  cedula_beneficiario: string;
}

export interface ReporteGeneral {
  beneficiario: Beneficiario;
  dependientes: Dependiente[];
}

export interface ReporteHabitantesCalle {
  calle: string;
  total_habitantes: number;
  habitantes: {
    cedula: string;
    nombre_apellido: string;
    numero_casa: string;
    cantidad_beneficios?: string;
    referencia_pago?: string;
    firma?: string;
    capacidad_cilindro?: string;
    cantidad?: string;
    referencia?: string;
  }[];
}

export interface ReporteRangoEdad {
  rango: string;
  total: number;
  personas: {
    cedula: string;
    nombre_apellido: string;
    fecha_nacimiento: string;
    edad: number;
    calle?: string;
    nom_calle?: string;
    id_calle?: number;
  }[];
}

export interface ReporteVenta extends ReporteHabitantesCalle {}

const isActiveBeneficiario = (beneficiario: Beneficiario): boolean => {
  return beneficiario.estatus === 'ACTIVO' || beneficiario.estatus === 'Activo';
};

export const reporteService = {
  getReporteGeneral: async (): Promise<ReporteGeneral[]> => {
    const response = await api.get('/api/reportes/beneficiarios-dependientes');
    const data = response.data;
    return data.filter((item: ReporteGeneral) => isActiveBeneficiario(item.beneficiario));
  },

  getReporteGeneralByCalle: async (idCalle: number): Promise<ReporteGeneral[]> => {
    const response = await api.get('/api/reportes/beneficiarios-dependientes');
    const allData = response.data;
    return allData.filter((item: ReporteGeneral) => 
      item.beneficiario.id_calle === idCalle && isActiveBeneficiario(item.beneficiario)
    );
  },

  getCargaFamiliar: async (cedula: string): Promise<ReporteGeneral> => {
    const response = await api.get(`/api/reportes/beneficiario-dependientes/${cedula}`);
    return response.data;
  },

  getHabitantesCalle: async (idCalle: number): Promise<ReporteHabitantesCalle> => {
    const response = await api.get(`/api/reportes/habitantes-calle/${idCalle}`);
    return response.data;
  },

  getHabitantesCallesGeneral: async (): Promise<ReporteHabitantesCalle[]> => {
    const response = await api.get('/api/reportes/habitantes-calle/');
    return response.data;
  },

  getRangoEdad: async (edadMin: number, edadMax: number): Promise<ReporteRangoEdad> => {
    const response = await api.get(`/api/reportes/rango-edad?min=${edadMin}&max=${edadMax}`);
    return response.data;
  },

  getRangoEdadByCalle: async (edadMin: number, edadMax: number, idCalle: number): Promise<ReporteRangoEdad> => {
    const response = await api.get(`/api/reportes/rango-edad?min=${edadMin}&max=${edadMax}`);
    const data = response.data;
    
    const personasFiltradas = data.personas.filter((persona: any) => {
      return persona.id_calle === idCalle;
    });

    return {
      ...data,
      personas: personasFiltradas,
      total: personasFiltradas.length,
      rango: `${edadMin}-${edadMax}`
    };
  },

  exportToCSV: async (data: any[], fileName: string): Promise<void> => {
    try {
      if (!data || data.length === 0) {
        console.warn("No data to export.");
        return;
      }

      const headers = Object.keys(data[0]).join(',');
      const csvContent = [
        headers,
        ...data.map(row => Object.values(row).join(','))
      ].join('\n');

      const fileUri = FileSystem.documentDirectory + `${fileName}.csv`;
      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      }
    } catch (error) {
      console.error('Error exporting CSV:', error);
      throw error;
    }
  },

  exportToPDF: async (data: any[], title: string, fileName: string): Promise<void> => {
    try {
      // Para PDF en React Native, necesitarías una librería específica
      // Por ahora, exportamos como CSV
      await reporteService.exportToCSV(data, fileName);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      throw error;
    }
  },
};