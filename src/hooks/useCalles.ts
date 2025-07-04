import { useState, useEffect } from 'react';
import { Calle } from '../types';
import { callesApi } from '../services/api';

export function useCalles() {
  const [calles, setCalles] = useState<Calle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCalles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await callesApi.getAll();
      if (response.success && response.data) {
        setCalles(response.data);
      } else {
        setError(response.error || 'Error al cargar calles');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCalles();
  }, []);

  return {
    calles,
    loading,
    error,
    loadCalles
  };
}