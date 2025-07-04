// Tipos principales del sistema SISCLAP
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
  nom_calle?: string; // Solo en respuestas
  estado_civil: string;
  estatus: 'Activo' | 'Inactivo';
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

export interface Calle {
  id_calle: number;
  nom_calle: string;
  id_com: number;
}

export interface BeneficiarioConDependientes {
  beneficiario: Beneficiario;
  dependientes: Dependiente[];
}

export interface HabitantesPorCalle {
  calle: string;
  total_habitantes: number;
  habitantes: {
    cedula: string;
    nombre_apellido: string;
    numero_casa: string;
  }[];
}

export interface RangoEdad {
  rango: string;
  total: number;
  personas: {
    cedula: string;
    nombre_apellido: string;
    fecha_nacimiento: string;
    edad: number;
  }[];
}

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Tipos para formularios
export interface BeneficiarioForm {
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
  estado_civil: string;
  estatus: 'Activo' | 'Inactivo';
}

export interface DependienteForm {
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

// Constantes para opciones de formularios
export const GENEROS = ['Masculino', 'Femenino'] as const;
export const ESTADOS_CIVILES = ['Soltero', 'Casado', 'Divorciado', 'Viudo'] as const;
export const GRADOS_INSTRUCCION = [
  'Sin Instrucción',
  'Primaria',
  'Secundaria',
  'Técnico',
  'Universitario',
  'Postgrado'
] as const;
export const PARENTESCOS = [
  'Hijo',
  'Hija',
  'Esposo',
  'Esposa',
  'Padre',
  'Madre',
  'Hermano',
  'Hermana',
  'Otro'
] as const;
export const ESTATUS = ['Activo', 'Inactivo'] as const;