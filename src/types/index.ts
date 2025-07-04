export interface Beneficiario {
  id: string;
  nombre: string;
  apellido: string;
  cedula: string;
  telefono: string;
  email?: string;
  fechaNacimiento: string;
  direccion: {
    calle: string;
    casa: string;
    sector: string;
  };
  status: 'Activo' | 'Inactivo';
  fechaRegistro: string;
  dependientes: Dependiente[];
  beneficiosRecibidos: BeneficioRecibido[];
}

export interface Dependiente {
  id: string;
  nombre: string;
  apellido: string;
  cedula?: string;
  fechaNacimiento: string;
  parentesco: string;
  beneficiarioId: string;
}

export interface BeneficioRecibido {
  id: string;
  tipo: string;
  descripcion: string;
  fecha: string;
  cantidad?: number;
  beneficiarioId: string;
}

export interface Reporte {
  id: string;
  titulo: string;
  tipo: 'carga-familiar' | 'habitantes-calle' | 'rango-edad' | 'ventas';
  fechaGeneracion: string;
  datos: any;
  generadoPor: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}