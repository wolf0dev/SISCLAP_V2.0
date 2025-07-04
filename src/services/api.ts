import { 
  Beneficiario, 
  Dependiente, 
  Calle, 
  BeneficiarioConDependientes,
  HabitantesPorCalle,
  RangoEdad,
  ApiResponse,
  BeneficiarioForm,
  DependienteForm
} from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

// Función helper para manejar respuestas de la API
const handleApiResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  try {
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || `Error ${response.status}: ${response.statusText}`
      };
    }

    // Si la respuesta es un array o un objeto directo, lo envolvemos en data
    if (Array.isArray(data) || (typeof data === 'object' && !data.message && !data.error)) {
      return {
        success: true,
        data: data
      };
    }

    return {
      success: true,
      data: data.data || data,
      message: data.message
    };
  } catch (error) {
    return {
      success: false,
      error: 'Error de conexión con el servidor'
    };
  }
};

// Función helper para hacer peticiones
const makeRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // TODO: Agregar token de autenticación cuando esté implementado
  // const token = await getAuthToken();
  // if (token) {
  //   defaultHeaders['Authorization'] = `Bearer ${token}`;
  // }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    return await handleApiResponse<T>(response);
  } catch (error) {
    return {
      success: false,
      error: 'Error de conexión'
    };
  }
};

// API de Beneficiarios
export const beneficiariosApi = {
  async getAll(): Promise<ApiResponse<Beneficiario[]>> {
    return makeRequest<Beneficiario[]>('/beneficiarios');
  },

  async getByCedula(cedula: string): Promise<ApiResponse<Beneficiario>> {
    return makeRequest<Beneficiario>(`/beneficiarios/${cedula}`);
  },

  async create(beneficiario: BeneficiarioForm): Promise<ApiResponse<void>> {
    return makeRequest<void>('/beneficiarios', {
      method: 'POST',
      body: JSON.stringify(beneficiario),
    });
  },

  async update(cedula: string, beneficiario: Partial<BeneficiarioForm>): Promise<ApiResponse<void>> {
    return makeRequest<void>(`/beneficiarios/${cedula}`, {
      method: 'PUT',
      body: JSON.stringify(beneficiario),
    });
  },

  async updateEstatus(cedula: string, estatus: 'Activo' | 'Inactivo'): Promise<ApiResponse<void>> {
    return makeRequest<void>(`/beneficiarios/estatus/${cedula}`, {
      method: 'PUT',
      body: JSON.stringify({ estatus }),
    });
  },

  async search(query: string): Promise<ApiResponse<Beneficiario[]>> {
    // Implementar búsqueda local por ahora, ya que la API no tiene endpoint específico
    const response = await this.getAll();
    if (!response.success || !response.data) {
      return response;
    }

    const filtered = response.data.filter(b => 
      b.nombre_apellido.toLowerCase().includes(query.toLowerCase()) ||
      b.cedula.includes(query)
    );

    return {
      success: true,
      data: filtered
    };
  }
};

// API de Dependientes
export const dependientesApi = {
  async getByBeneficiario(cedulaBeneficiario: string): Promise<ApiResponse<Dependiente[]>> {
    return makeRequest<Dependiente[]>(`/dependientes/${cedulaBeneficiario}`);
  },

  async getByCedula(cedula: string): Promise<ApiResponse<Dependiente>> {
    return makeRequest<Dependiente>(`/dependientes/detalles/${cedula}`);
  },

  async create(dependiente: DependienteForm): Promise<ApiResponse<void>> {
    return makeRequest<void>('/dependientes', {
      method: 'POST',
      body: JSON.stringify(dependiente),
    });
  },

  async update(cedula: string, dependiente: Partial<DependienteForm>): Promise<ApiResponse<void>> {
    return makeRequest<void>(`/dependientes/${cedula}`, {
      method: 'PUT',
      body: JSON.stringify(dependiente),
    });
  },

  async delete(cedula: string): Promise<ApiResponse<void>> {
    return makeRequest<void>(`/dependientes/${cedula}`, {
      method: 'DELETE',
    });
  }
};

// API de Calles
export const callesApi = {
  async getAll(): Promise<ApiResponse<Calle[]>> {
    return makeRequest<Calle[]>('/calles');
  }
};

// API de Reportes
export const reportesApi = {
  async getHabitantesPorCalle(idCalle?: number): Promise<ApiResponse<HabitantesPorCalle | HabitantesPorCalle[]>> {
    const endpoint = idCalle ? `/reportes/habitantes-calle/${idCalle}` : '/reportes/habitantes-calle/';
    return makeRequest<HabitantesPorCalle | HabitantesPorCalle[]>(endpoint);
  },

  async getRangoEdad(min?: number, max?: number): Promise<ApiResponse<RangoEdad>> {
    const params = new URLSearchParams();
    if (min !== undefined) params.append('min', min.toString());
    if (max !== undefined) params.append('max', max.toString());
    
    const endpoint = `/reportes/rango-edad${params.toString() ? `?${params.toString()}` : ''}`;
    return makeRequest<RangoEdad>(endpoint);
  },

  async getBeneficiariosConDependientes(): Promise<ApiResponse<BeneficiarioConDependientes[]>> {
    return makeRequest<BeneficiarioConDependientes[]>('/reportes/beneficiarios-dependientes');
  },

  async getBeneficiarioConDependientes(cedula: string): Promise<ApiResponse<BeneficiarioConDependientes>> {
    return makeRequest<BeneficiarioConDependientes>(`/reportes/beneficiario-dependientes/${cedula}`);
  },

  // Métodos de compatibilidad con la interfaz anterior
  async generateCargaFamiliar(): Promise<ApiResponse<any>> {
    const response = await this.getBeneficiariosConDependientes();
    if (!response.success || !response.data) {
      return response;
    }

    const data = response.data;
    const totalBeneficiarios = data.length;
    const totalDependientes = data.reduce((acc, item) => acc + item.dependientes.length, 0);
    const familiasConHijos = data.filter(item => item.dependientes.length > 0).length;
    const familiasSinHijos = totalBeneficiarios - familiasConHijos;

    return {
      success: true,
      data: {
        totalBeneficiarios,
        totalDependientes,
        promedioHijosPorFamilia: totalBeneficiarios > 0 ? totalDependientes / totalBeneficiarios : 0,
        familiasConHijos,
        familiasSinHijos
      }
    };
  },

  async generateHabitantesPorCalle(): Promise<ApiResponse<any>> {
    const response = await this.getHabitantesPorCalle();
    if (!response.success || !response.data) {
      return response;
    }

    // Convertir formato de respuesta
    const data = Array.isArray(response.data) ? response.data : [response.data];
    return {
      success: true,
      data: data.map(item => ({
        calle: item.calle,
        habitantes: item.total_habitantes
      }))
    };
  },

  async generateRangoEdad(): Promise<ApiResponse<any>> {
    // Generar reportes para diferentes rangos de edad
    const rangos = [
      { min: 0, max: 17, label: '0-17' },
      { min: 18, max: 35, label: '18-35' },
      { min: 36, max: 50, label: '36-50' },
      { min: 51, max: 65, label: '51-65' },
      { min: 66, max: 120, label: '65+' }
    ];

    const resultados = [];
    
    for (const rango of rangos) {
      const response = await this.getRangoEdad(rango.min, rango.max);
      if (response.success && response.data) {
        resultados.push({
          rango: rango.label,
          cantidad: response.data.total
        });
      }
    }

    return {
      success: true,
      data: resultados
    };
  },

  async generateVentas(): Promise<ApiResponse<any>> {
    // Por ahora retornamos datos mock ya que no hay endpoint específico para beneficios
    return {
      success: true,
      data: {
        totalBeneficios: 0,
        tiposBeneficios: [],
        ultimoMes: 0
      }
    };
  }
};