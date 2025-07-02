import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { beneficiarioService, Beneficiario } from '../../../services/beneficiarioService';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { useAuth } from '../../../contexts/AuthContext';

interface BeneficiariosListContextType {
  beneficiarios: Beneficiario[];
  loading: boolean;
  searchTerm: string;
  confirmDialogOpen: boolean;
  selectedBeneficiario: Beneficiario | null;
  menuAnchorEl: HTMLElement | null;
  selectedRowId: string | null;
  filteredBeneficiarios: Beneficiario[];
  
  // Actions
  setSearchTerm: (term: string) => void;
  handleOpenMenu: (event: React.MouseEvent<HTMLElement>, beneficiario: Beneficiario) => void;
  handleCloseMenu: () => void;
  handleView: () => void;
  handleEdit: () => void;
  handleDisable: () => void;
  confirmDisable: () => Promise<void>;
  setConfirmDialogOpen: (open: boolean) => void;
  fetchBeneficiarios: () => Promise<void>;
  canAccessBeneficiario: (beneficiario: Beneficiario) => boolean;
  getPageTitle: () => string;
}

const BeneficiariosListContext = createContext<BeneficiariosListContextType | undefined>(undefined);

export const useBeneficiariosListContext = () => {
  const context = useContext(BeneficiariosListContext);
  if (!context) {
    throw new Error('useBeneficiariosListContext must be used within BeneficiariosListLogic');
  }
  return context;
};

interface BeneficiariosListLogicProps {
  children: ReactNode;
}

export const BeneficiariosListLogic: React.FC<BeneficiariosListLogicProps> = ({ children }) => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const { user, isLiderComunidad, isJefeCalle, getUserCalle } = useAuth();
  
  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedBeneficiario, setSelectedBeneficiario] = useState<Beneficiario | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  useEffect(() => {
    fetchBeneficiarios();
  }, []);

  const fetchBeneficiarios = async () => {
    setLoading(true);
    try {
      let data: Beneficiario[];
      
      if (isLiderComunidad()) {
        data = await beneficiarioService.getAll();
      } else if (isJefeCalle()) {
        const userCalle = getUserCalle();
        if (userCalle) {
          data = await beneficiarioService.getAllByUserCalle(userCalle);
        } else {
          data = [];
          showSnackbar('No se pudo determinar tu calle asignada', 'error');
        }
      } else {
        data = [];
        showSnackbar('No tienes permisos para ver beneficiarios', 'error');
      }

      const activeBeneficiarios = data.filter((b: Beneficiario) => beneficiarioService.isActive(b));
      setBeneficiarios(activeBeneficiarios);
    } catch (error: any) {
      console.error('Error al obtener beneficiarios:', error);
      const errorMessage = error.response?.data?.error || 'Error al cargar los beneficiarios';
      showSnackbar(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, beneficiario: Beneficiario) => {
    if (!canAccessBeneficiario(beneficiario)) {
      showSnackbar('No tienes permisos para acceder a este beneficiario', 'error');
      return;
    }

    setMenuAnchorEl(event.currentTarget);
    setSelectedBeneficiario(beneficiario);
    setSelectedRowId(beneficiario.cedula);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
    setSelectedRowId(null);
  };

  const canAccessBeneficiario = (beneficiario: Beneficiario): boolean => {
    if (!user) return false;
    return beneficiarioService.canAccessBeneficiario(
      beneficiario, 
      user.id_rol_user, 
      user.id_calle
    );
  };

  const handleView = () => {
    handleCloseMenu();
    if (selectedBeneficiario && canAccessBeneficiario(selectedBeneficiario)) {
      navigate(`/dashboard/beneficiarios/view/${selectedBeneficiario.cedula}`);
    }
  };

  const handleEdit = () => {
    handleCloseMenu();
    if (selectedBeneficiario && canAccessBeneficiario(selectedBeneficiario)) {
      navigate(`/dashboard/beneficiarios/edit/${selectedBeneficiario.cedula}`);
    }
  };

  const handleDisable = () => {
    handleCloseMenu();
    if (selectedBeneficiario && canAccessBeneficiario(selectedBeneficiario)) {
      setConfirmDialogOpen(true);
    }
  };

  const confirmDisable = async () => {
    if (selectedBeneficiario) {
      try {
        await beneficiarioService.updateStatus(selectedBeneficiario.cedula, 'Inactivo');
        showSnackbar('Beneficiario deshabilitado exitosamente', 'success');
        fetchBeneficiarios();
      } catch (error: any) {
        console.error('Error al deshabilitar beneficiario:', error);
        const errorMessage = error.response?.data?.error || 'Error al deshabilitar el beneficiario';
        showSnackbar(errorMessage, 'error');
      } finally {
        setConfirmDialogOpen(false);
        setSelectedBeneficiario(null);
      }
    }
  };

  const filteredBeneficiarios = beneficiarios.filter((beneficiario) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      beneficiario.cedula.toLowerCase().includes(searchTermLower) ||
      beneficiario.nombre_apellido.toLowerCase().includes(searchTermLower) ||
      beneficiario.telefono.toLowerCase().includes(searchTermLower) ||
      beneficiario.profesion.toLowerCase().includes(searchTermLower)
    );
  });

  const getPageTitle = () => {
    if (isLiderComunidad()) {
      return 'Beneficiarios - Todas las Calles';
    } else if (isJefeCalle()) {
      return `Beneficiarios - Mi Calle`;
    }
    return 'Beneficiarios';
  };

  const contextValue: BeneficiariosListContextType = {
    beneficiarios,
    loading,
    searchTerm,
    confirmDialogOpen,
    selectedBeneficiario,
    menuAnchorEl,
    selectedRowId,
    filteredBeneficiarios,
    setSearchTerm,
    handleOpenMenu,
    handleCloseMenu,
    handleView,
    handleEdit,
    handleDisable,
    confirmDisable,
    setConfirmDialogOpen,
    fetchBeneficiarios,
    canAccessBeneficiario,
    getPageTitle,
  };

  return (
    <BeneficiariosListContext.Provider value={contextValue}>
      {children}
    </BeneficiariosListContext.Provider>
  );
};