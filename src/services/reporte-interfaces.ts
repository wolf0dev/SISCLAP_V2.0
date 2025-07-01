export interface ReporteGeneral {
  calle: string;
  total_habitantes: number;
  habitantes: Habitante[];
}

export interface ReporteHabitantesCalle {
  calle: string;
  total_habitantes: number;
  habitantes: Habitante[];
}

export interface ReporteRangoEdad {
  total_habitantes: number;
  habitantes: Habitante[];
}

export interface ReporteVenta {
  calle: string;
  total_habitantes: number;
  habitantes: HabitanteVenta[];
}

export interface Habitante {
  cedula: string;
  nombre_apellido: string;
  numero_casa: string;
}

export interface HabitanteVenta extends Habitante {
  cantidad_beneficios?: string;
  referencia_pago?: string;
  firma?: string;
  capacidad_cilindro?: string;
  cantidad?: string;
  referencia?: string;
}
