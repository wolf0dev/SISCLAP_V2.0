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

// Use the correct API base URL from the documentation
const API_BASE_URL = 'http://localhost:3000/api';

// Función helper para manejar respuestas de la API
const handleApiResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  try {
    // Check if response has content
    const contentType = response.headers.get('content-type');
    const hasJsonContent = contentType && contentType.includes('application/json');
    
    let data;
    
    if (hasJsonContent) {
      const text = await response.text();
      if (text.trim() === '') {
        // Empty response - this is OK for some operations
        return {
          success: true,
          message: 'Operación completada exitosamente'
        };
      } else {
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError, 'Response text:', text);
          return {
            success: false,
            error: 'Respuesta inválida del servidor'
          };
        }
      }
    } else {
      // Non-JSON response
      const text = await response.text();
      if (text.trim() === '') {
        return {
          success: true,
          message: 'Operación completada exitosamente'
        };
      }
      
      // Try to parse as JSON anyway (some servers don't set correct content-type)
      try {
        data = JSON.parse(text);
      } catch {
        // If it's not JSON, treat as error message
        return {
          success: false,
          error: text || 'Error desconocido del servidor'
        };
      }
    }
    
    if (!response.ok) {
      return {
        success: false,
        error: (data && typeof data === 'object' && data.error) || 
               (data && typeof data === 'string' ? data : null) ||
               `Error ${response.status}: ${response.statusText}`
      };
    }

    // Handle successful responses
    if (response.status === 204 || data === null) {
      // No content responses
      return {
        success: true,
        message: 'Operación completada exitosamente'
      };
    }

    // If the response is an array or an object without message/error, wrap it in data
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
    console.error('API Response Error:', error);
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
    'Accept': 'application/json',
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
    console.log(`Making request to: ${url}`, config);
    const response = await fetch(url, config);
    const result = await handleApiResponse<T>(response);
    console.log(`Response from ${url}:`, result);
    return result;
  } catch (error) {
    console.error(`Request failed for ${url}:`, error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        error: 'Error de conexión. Verifique que el servidor SISCLAP esté funcionando en http://localhost:3000'
      };
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
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

// API de Reportes - Updated to match the API documentation exactly
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

  // Enhanced report generation methods
  async generateCargaFamiliar(): Promise<ApiResponse<any>> {
    try {
      const response = await this.getBeneficiariosConDependientes();
      if (!response.success || !response.data) {
        return {
          success: false,
          error: response.error || 'Error al obtener datos de beneficiarios'
        };
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
          familiasSinHijos,
          detalles: data
        }
      };
    } catch (error) {
      console.error('Error generating carga familiar report:', error);
      return {
        success: false,
        error: 'Error al generar reporte de carga familiar'
      };
    }
  },

  async generateHabitantesPorCalle(): Promise<ApiResponse<any>> {
    try {
      const response = await this.getHabitantesPorCalle();
      if (!response.success || !response.data) {
        return {
          success: false,
          error: response.error || 'Error al obtener datos de habitantes por calle'
        };
      }

      // Convert API response format to display format
      const data = Array.isArray(response.data) ? response.data : [response.data];
      const formattedData = data.map(item => ({
        calle: item.calle,
        habitantes: item.total_habitantes,
        detalles: item.habitantes
      }));

      return {
        success: true,
        data: formattedData
      };
    } catch (error) {
      console.error('Error generating habitantes por calle report:', error);
      return {
        success: false,
        error: 'Error al generar reporte de habitantes por calle'
      };
    }
  }
};