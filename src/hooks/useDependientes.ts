import { useState, useEffect } from 'react';
import { Dependiente, DependienteForm } from '../types';
import { dependientesApi } from '../services/api';

export function useDependientes(cedulaBeneficiario?: string) {
  const [dependientes, setDependientes] = useState<Dependiente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDependientes = async (cedula?: string) => {
    const targetCedula = cedula || cedulaBeneficiario;
    if (!targetCedula) return;

    try {
      setLoading(true);
      setError(null);
      const response = await dependientesApi.getByBeneficiario(targetCedula);
      if (response.success && response.data) {
        setDependientes(response.data);
      } else {
        setError(response.error || 'Error al cargar dependientes');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const createDependiente = async (dependiente: DependienteForm) => {
    try {
      const response = await dependientesApi.create(dependiente);
      if (response.success) {
        await loadDependientes(dependiente.cedula_beneficiario);
        return response;
      } else {
        throw new Error(response.error || 'Error al crear dependiente');
      }
    } catch (err) {
      throw err;
    }
  };

  const updateDependiente = async (cedula: string, dependiente: Partial<DependienteForm>) => {
    try {
      const response = await dependientesApi.update(cedula, dependiente);
      if (response.success) {
        if (dependiente.cedula_beneficiario) {
          await loadDependientes(dependiente.cedula_beneficiario);
        } else if (cedulaBeneficiario) {
          await loadDependientes(cedulaBeneficiario);
        }
        return response;
      } else {
        throw new Error(response.error || 'Error al actualizar dependiente');
      }
    } catch (err) {
      throw err;
    }
  };

  const deleteDependiente = async (cedula: string) => {
    try {
      const response = await dependientesApi.delete(cedula);
      if (response.success) {
        await loadDependientes();
        return response;
      } else {
        throw new Error(response.error || 'Error al eliminar dependiente');
      }
    } catch (err) {
      throw err;
    }
  };

  const getDependiente = async (cedula: string) => {
    try {
      const response = await dependientesApi.getByCedula(cedula);
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || 'Dependiente no encontrado');
      }
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (cedulaBeneficiario) {
      loadDependientes();
    }
  }, [cedulaBeneficiario]);

  return {
    dependientes,
    loading,
    error,
    loadDependientes,
    createDependiente,
    updateDependiente,
    deleteDependiente,
    getDependiente
  };
}