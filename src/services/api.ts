import { Beneficiario, Dependiente, BeneficioRecibido, Reporte, ApiResponse } from '../types';

const API_BASE_URL = '/api';

// Mock data for development
let mockBeneficiarios: Beneficiario[] = [
  {
    id: '1',
    nombre: 'María',
    apellido: 'González',
    cedula: '12345678',
    telefono: '0414-1234567',
    email: 'maria.gonzalez@email.com',
    fechaNacimiento: '1985-03-15',
    direccion: {
      calle: 'Calle 1',
      casa: '15',
      sector: 'Brisas del Orinoco II'
    },
    status: 'Activo',
    fechaRegistro: '2024-01-15',
    dependientes: [
      {
        id: 'd1',
        nombre: 'Carlos',
        apellido: 'González',
        fechaNacimiento: '2010-05-20',
        parentesco: 'Hijo',
        beneficiarioId: '1'
      }
    ],
    beneficiosRecibidos: [
      {
        id: 'b1',
        tipo: 'Alimentario',
        descripcion: 'Caja CLAP',
        fecha: '2024-01-20',
        cantidad: 1,
        beneficiarioId: '1'
      }
    ]
  },
  {
    id: '2',
    nombre: 'José',
    apellido: 'Rodríguez',
    cedula: '87654321',
    telefono: '0424-7654321',
    email: 'jose.rodriguez@email.com',
    fechaNacimiento: '1978-08-22',
    direccion: {
      calle: 'Calle 2',
      casa: '8',
      sector: 'Brisas del Orinoco II'
    },
    status: 'Activo',
    fechaRegistro: '2024-01-10',
    dependientes: [],
    beneficiosRecibidos: []
  },
  {
    id: '3',
    nombre: 'Ana',
    apellido: 'Martínez',
    cedula: '11223344',
    telefono: '0412-1122334',
    email: 'ana.martinez@email.com',
    fechaNacimiento: '1990-12-05',
    direccion: {
      calle: 'Calle 3',
      casa: '22',
      sector: 'Brisas del Orinoco II'
    },
    status: 'Inactivo',
    fechaRegistro: '2024-01-05',
    dependientes: [],
    beneficiosRecibidos: []
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const beneficiariosApi = {
  async getAll(): Promise<ApiResponse<Beneficiario[]>> {
    await delay(500);
    return {
      success: true,
      data: mockBeneficiarios
    };
  },

  async getById(id: string): Promise<ApiResponse<Beneficiario>> {
    await delay(300);
    const beneficiario = mockBeneficiarios.find(b => b.id === id);
    if (!beneficiario) {
      return {
        success: false,
        error: 'Beneficiario no encontrado'
      };
    }
    return {
      success: true,
      data: beneficiario
    };
  },

  async create(beneficiario: Omit<Beneficiario, 'id' | 'fechaRegistro'>): Promise<ApiResponse<Beneficiario>> {
    await delay(800);
    const newBeneficiario: Beneficiario = {
      ...beneficiario,
      id: Date.now().toString(),
      fechaRegistro: new Date().toISOString().split('T')[0]
    };
    mockBeneficiarios.push(newBeneficiario);
    return {
      success: true,
      data: newBeneficiario,
      message: 'Beneficiario creado exitosamente'
    };
  },

  async update(id: string, beneficiario: Partial<Beneficiario>): Promise<ApiResponse<Beneficiario>> {
    await delay(600);
    const index = mockBeneficiarios.findIndex(b => b.id === id);
    if (index === -1) {
      return {
        success: false,
        error: 'Beneficiario no encontrado'
      };
    }
    mockBeneficiarios[index] = { ...mockBeneficiarios[index], ...beneficiario };
    return {
      success: true,
      data: mockBeneficiarios[index],
      message: 'Beneficiario actualizado exitosamente'
    };
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    await delay(400);
    const index = mockBeneficiarios.findIndex(b => b.id === id);
    if (index === -1) {
      return {
        success: false,
        error: 'Beneficiario no encontrado'
      };
    }
    mockBeneficiarios.splice(index, 1);
    return {
      success: true,
      message: 'Beneficiario eliminado exitosamente'
    };
  },

  async search(query: string): Promise<ApiResponse<Beneficiario[]>> {
    await delay(300);
    const filtered = mockBeneficiarios.filter(b => 
      b.nombre.toLowerCase().includes(query.toLowerCase()) ||
      b.apellido.toLowerCase().includes(query.toLowerCase()) ||
      b.cedula.includes(query)
    );
    return {
      success: true,
      data: filtered
    };
  }
};

export const reportesApi = {
  async generateCargaFamiliar(): Promise<ApiResponse<any>> {
    await delay(1000);
    const data = {
      totalBeneficiarios: mockBeneficiarios.length,
      totalDependientes: mockBeneficiarios.reduce((acc, b) => acc + b.dependientes.length, 0),
      promedioHijosPorFamilia: mockBeneficiarios.reduce((acc, b) => acc + b.dependientes.length, 0) / mockBeneficiarios.length,
      familiasSinHijos: mockBeneficiarios.filter(b => b.dependientes.length === 0).length,
      familiasConHijos: mockBeneficiarios.filter(b => b.dependientes.length > 0).length
    };
    return {
      success: true,
      data
    };
  },

  async generateHabitantesPorCalle(): Promise<ApiResponse<any>> {
    await delay(800);
    const calles = mockBeneficiarios.reduce((acc, b) => {
      const calle = b.direccion.calle;
      acc[calle] = (acc[calle] || 0) + 1 + b.dependientes.length;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      success: true,
      data: Object.entries(calles).map(([calle, habitantes]) => ({ calle, habitantes }))
    };
  },

  async generateRangoEdad(): Promise<ApiResponse<any>> {
    await delay(900);
    const rangos = {
      '0-17': 0,
      '18-35': 0,
      '36-50': 0,
      '51-65': 0,
      '65+': 0
    };

    mockBeneficiarios.forEach(b => {
      const edad = new Date().getFullYear() - new Date(b.fechaNacimiento).getFullYear();
      if (edad <= 17) rangos['0-17']++;
      else if (edad <= 35) rangos['18-35']++;
      else if (edad <= 50) rangos['36-50']++;
      else if (edad <= 65) rangos['51-65']++;
      else rangos['65+']++;

      b.dependientes.forEach(d => {
        const edadDep = new Date().getFullYear() - new Date(d.fechaNacimiento).getFullYear();
        if (edadDep <= 17) rangos['0-17']++;
        else if (edadDep <= 35) rangos['18-35']++;
        else if (edadDep <= 50) rangos['36-50']++;
        else if (edadDep <= 65) rangos['51-65']++;
        else rangos['65+']++;
      });
    });

    return {
      success: true,
      data: Object.entries(rangos).map(([rango, cantidad]) => ({ rango, cantidad }))
    };
  },

  async generateVentas(): Promise<ApiResponse<any>> {
    await delay(700);
    const beneficios = mockBeneficiarios.flatMap(b => b.beneficiosRecibidos);
    const tiposBeneficios = beneficios.reduce((acc, b) => {
      acc[b.tipo] = (acc[b.tipo] || 0) + (b.cantidad || 1);
      return acc;
    }, {} as Record<string, number>);

    return {
      success: true,
      data: {
        totalBeneficios: beneficios.length,
        tiposBeneficios: Object.entries(tiposBeneficios).map(([tipo, cantidad]) => ({ tipo, cantidad })),
        ultimoMes: beneficios.filter(b => {
          const fecha = new Date(b.fecha);
          const haceUnMes = new Date();
          haceUnMes.setMonth(haceUnMes.getMonth() - 1);
          return fecha >= haceUnMes;
        }).length
      }
    };
  }
};