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
        // Provide default calles if API fails
        setCalles([
          { id_calle: 1, nom_calle: 'Calle 1', id_com: 1 },
          { id_calle: 2, nom_calle: 'Calle 2', id_com: 1 },
          { id_calle: 3, nom_calle: 'Calle 3', id_com: 1 },
          { id_calle: 4, nom_calle: 'Calle 4', id_com: 1 },
          { id_calle: 5, nom_calle: 'Calle 5', id_com: 1 },
        ]);
      }
    } catch (err) {
      setError('Error de conexión');
      // Provide default calles if connection fails
      setCalles([
        { id_calle: 1, nom_calle: 'Calle 1', id_com: 1 },
        { id_calle: 2, nom_calle: 'Calle 2', id_com: 1 },
        { id_calle: 3, nom_calle: 'Calle 3', id_com: 1 },
        { id_calle: 4, nom_calle: 'Calle 4', id_com: 1 },
        { id_calle: 5, nom_calle: 'Calle 5', id_com: 1 },
      ]);
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