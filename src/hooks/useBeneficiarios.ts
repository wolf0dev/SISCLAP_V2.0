import { useState, useEffect } from 'react';
import { Beneficiario } from '../types';
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
      }
    } catch (err) {
      setError('Error de conexión');
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
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const createBeneficiario = async (beneficiario: Omit<Beneficiario, 'id' | 'fechaRegistro'>) => {
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

  const updateBeneficiario = async (id: string, beneficiario: Partial<Beneficiario>) => {
    try {
      const response = await beneficiariosApi.update(id, beneficiario);
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

  const deleteBeneficiario = async (id: string) => {
    try {
      const response = await beneficiariosApi.delete(id);
      if (response.success) {
        await loadBeneficiarios();
        return response;
      } else {
        throw new Error(response.error || 'Error al eliminar beneficiario');
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
    deleteBeneficiario
  };
}