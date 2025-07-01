import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService, User } from '../../../services/userService';
import { calleService, Calle } from '../../../services/calleService';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { useAuth } from '../../../contexts/AuthContext';

interface UsersListContextType {
  users: User[];
  calles: Calle[];
  loading: boolean;
  searchTerm: string;
  confirmDialogOpen: boolean;
  selectedUser: User | null;
  menuAnchorEl: HTMLElement | null;
  selectedRowId: number | null;
  filteredUsers: User[];
  
  // Actions
  setSearchTerm: (term: string) => void;
  handleOpenMenu: (event: React.MouseEvent<HTMLElement>, user: User) => void;
  handleCloseMenu: () => void;
  handleView: () => void;
  handleEdit: () => void;
  handleDelete: () => void;
  confirmDelete: () => Promise<void>;
  setConfirmDialogOpen: (open: boolean) => void;
  fetchUsers: () => Promise<void>;
  getCalleNombre: (idCalle: number) => string;
  getRoleLabel: (roleId: number) => string;
  getRoleColor: (roleId: number) => string;
}

const UsersListContext = createContext<UsersListContextType | undefined>(undefined);

export const useUsersListContext = () => {
  const context = useContext(UsersListContext);
  if (!context) {
    throw new Error('useUsersListContext must be used within UsersListLogic');
  }
  return context;
};

interface UsersListLogicProps {
  children: ReactNode;
}

export const UsersListLogic: React.FC<UsersListLogicProps> = ({ children }) => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const { isLiderComunidad } = useAuth();
  
  const [users, setUsers] = useState<User[]>([]);
  const [calles, setCalles] = useState<Calle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  useEffect(() => {
    if (!isLiderComunidad()) {
      navigate('/dashboard');
      return;
    }
    fetchUsers();
    fetchCalles();
  }, [isLiderComunidad, navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (error: any) {
      console.error('Error al obtener usuarios:', error);
      const errorMessage = error.response?.data?.error || 'Error al cargar los usuarios';
      showSnackbar(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCalles = async () => {
    try {
      const data = await calleService.getAll();
      setCalles(data);
    } catch (error: any) {
      console.error('Error al obtener calles:', error);
    }
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedUser(user);
    setSelectedRowId(user.id);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
    setSelectedRowId(null);
  };

  const handleView = () => {
    handleCloseMenu();
    if (selectedUser) {
      navigate(`/dashboard/users/view/${selectedUser.id}`);
    }
  };

  const handleEdit = () => {
    handleCloseMenu();
    if (selectedUser) {
      navigate(`/dashboard/users/edit/${selectedUser.id}`);
    }
  };

  const handleDelete = () => {
    handleCloseMenu();
    if (selectedUser) {
      setConfirmDialogOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (selectedUser) {
      try {
        await userService.delete(selectedUser.id);
        showSnackbar('Usuario eliminado exitosamente', 'success');
        fetchUsers();
      } catch (error: any) {
        console.error('Error al eliminar usuario:', error);
        const errorMessage = error.response?.data?.error || 'Error al eliminar el usuario';
        showSnackbar(errorMessage, 'error');
      } finally {
        setConfirmDialogOpen(false);
        setSelectedUser(null);
      }
    }
  };

  const getCalleNombre = (idCalle: number) => {
    const calle = calles.find(c => c.id_calle === idCalle);
    return calle ? calle.nom_calle : 'No asignada';
  };

  const getRoleLabel = (roleId: number) => {
    switch (roleId) {
      case 1:
        return 'Líder de Comunidad';
      case 2:
        return 'Jefe de Calle';
      default:
        return 'Usuario';
    }
  };

  const getRoleColor = (roleId: number) => {
    switch (roleId) {
      case 1:
        return 'error';
      case 2:
        return 'primary';
      default:
        return 'default';
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      user.ced_user.toLowerCase().includes(searchTermLower) ||
      user.nom_user.toLowerCase().includes(searchTermLower) ||
      user.user.toLowerCase().includes(searchTermLower) ||
      user.correo.toLowerCase().includes(searchTermLower)
    );
  });

  const contextValue: UsersListContextType = {
    users,
    calles,
    loading,
    searchTerm,
    confirmDialogOpen,
    selectedUser,
    menuAnchorEl,
    selectedRowId,
    filteredUsers,
    setSearchTerm,
    handleOpenMenu,
    handleCloseMenu,
    handleView,
    handleEdit,
    handleDelete,
    confirmDelete,
    setConfirmDialogOpen,
    fetchUsers,
    getCalleNombre,
    getRoleLabel,
    getRoleColor,
  };

  return (
    <UsersListContext.Provider value={contextValue}>
      {children}
    </UsersListContext.Provider>
  );
};