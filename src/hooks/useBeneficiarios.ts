import { useState, useEffect } from 'react';
import { Beneficiario, BeneficiarioForm } from '../types';
import { beneficiariosApi } from '../services/api';

export function useBeneficiarios() {
  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBeneficiarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await beneficiariosApi.getAll();
      if (response.success && response.data) {
        setBeneficiarios(response.data);
      } else {
        setError(response.error || 'Error al cargar beneficiarios');
        // Set empty array if there's an error to avoid showing stale data
        setBeneficiarios([]);
      }
    } catch (err) {
      setError('Error de conexión con el servidor SISCLAP');
      setBeneficiarios([]);
    } finally {
      setLoading(false);
    }
  };

  const searchBeneficiarios = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await beneficiariosApi.search(query);
      if (response.success && response.data) {
        setBeneficiarios(response.data);
      } else {
        setError(response.error || 'Error en la búsqueda');
        setBeneficiarios([]);
      }
    } catch (err) {
      setError('Error de conexión');
      setBeneficiarios([]);
    } finally {
      setLoading(false);
    }
  };

  const createBeneficiario = async (beneficiario: BeneficiarioForm) => {
    try {
      const response = await beneficiariosApi.create(beneficiario);
      if (response.success) {
        await loadBeneficiarios();
        return response;
      } else {
        throw new Error(response.error || 'Error al crear beneficiario');
      }
    } catch (err) {
      throw err;
    }
  };

  const updateBeneficiario = async (cedula: string, beneficiario: Partial<BeneficiarioForm>) => {
    try {
      const response = await beneficiariosApi.update(cedula, beneficiario);
      if (response.success) {
        await loadBeneficiarios();
        return response;
      } else {
        throw new Error(response.error || 'Error al actualizar beneficiario');
      }
    } catch (err) {
      throw err;
    }
  };

  const updateEstatusBeneficiario = async (cedula: string, estatus: 'Activo' | 'Inactivo') => {
    try {
      const response = await beneficiariosApi.updateEstatus(cedula, estatus);
      if (response.success) {
        await loadBeneficiarios();
        return response;
      } else {
        throw new Error(response.error || 'Error al actualizar estatus');
      }
    } catch (err) {
      throw err;
    }
  };

  const getBeneficiario = async (cedula: string) => {
    try {
      const response = await beneficiariosApi.getByCedula(cedula);
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || 'Beneficiario no encontrado');
      }
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    loadBeneficiarios();
  }, []);

  return {
    beneficiarios,
    loading,
    error,
    loadBeneficiarios,
    searchBeneficiarios,
    createBeneficiario,
    updateBeneficiario,
    updateEstatusBeneficiario,
    getBeneficiario
  };
}