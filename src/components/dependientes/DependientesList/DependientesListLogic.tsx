import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { dependienteService, Dependiente } from '../../../services/dependienteService';
import { useSnackbar } from '../../../contexts/SnackbarContext';

interface DependientesListContextType {
  dependientes: Dependiente[];
  loading: boolean;
  cedulaBeneficiario: string;
  setCedulaBeneficiario: (cedula: string) => void;
  confirmDialogOpen: boolean;
  selectedDependiente: Dependiente | null;
  searched: boolean;
  
  // Actions
  handleSearch: () => Promise<void>;
  handleDeleteDependiente: (dependiente: Dependiente) => void;
  confirmDeleteDependiente: () => Promise<void>;
  setConfirmDialogOpen: (open: boolean) => void;
}

const DependientesListContext = createContext<DependientesListContextType | undefined>(undefined);

export const useDependientesListContext = () => {
  const context = useContext(DependientesListContext);
  if (!context) {
    throw new Error('useDependientesListContext must be used within DependientesListLogic');
  }
  return context;
};

interface DependientesListLogicProps {
  children: ReactNode;
}

export const DependientesListLogic: React.FC<DependientesListLogicProps> = ({ children }) => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  
  const [dependientes, setDependientes] = useState<Dependiente[]>([]);
  const [loading, setLoading] = useState(false);
  const [cedulaBeneficiario, setCedulaBeneficiario] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedDependiente, setSelectedDependiente] = useState<Dependiente | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!cedulaBeneficiario) {
      showSnackbar('Ingrese la cédula del beneficiario', 'warning');
      return;
    }

    setLoading(true);
    try {
      const data = await dependienteService.getByBeneficiario(cedulaBeneficiario);
      setDependientes(data);
      setSearched(true);
    } catch (error) {
      console.error('Error al obtener dependientes:', error);
      showSnackbar('Error al cargar los dependientes', 'error');
      setDependientes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDependiente = (dependiente: Dependiente) => {
    setSelectedDependiente(dependiente);
    setConfirmDialogOpen(true);
  };

  const confirmDeleteDependiente = async () => {
    if (selectedDependiente) {
      try {
        await dependienteService.delete(selectedDependiente.cedula);
        showSnackbar('Dependiente eliminado exitosamente', 'success');
        handleSearch();
      } catch (error: any) {
        console.error('Error al eliminar dependiente:', error);
        const errorMessage = error.response?.data?.error || 'Error al eliminar el dependiente';
        showSnackbar(errorMessage, 'error');
      } finally {
        setConfirmDialogOpen(false);
        setSelectedDependiente(null);
      }
    }
  };

  const contextValue: DependientesListContextType = {
    dependientes,
    loading,
    cedulaBeneficiario,
    setCedulaBeneficiario,
    confirmDialogOpen,
    selectedDependiente,
    searched,
    handleSearch,
    handleDeleteDependiente,
    confirmDeleteDependiente,
    setConfirmDialogOpen,
  };

  return (
    <DependientesListContext.Provider value={contextValue}>
      {children}
    </DependientesListContext.Provider>
  );
};