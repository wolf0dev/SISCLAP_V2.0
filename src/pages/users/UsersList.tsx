import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Button,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Search,
  UserPlus,
  Edit,
  Eye,
  MoreVertical,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { userService, User } from '../../services/userService';
import { calleService, Calle } from '../../services/calleService';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { useAuth } from '../../contexts/AuthContext';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import EmptyState from '../../components/common/EmptyState';
import PageHeader from '../../components/common/PageHeader';

const UsersList: React.FC = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const { isLiderComunidad } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [calles, setCalles] = useState<Calle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
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
      user.nom_user.toLowerCase().includes(searchTermLower) ||
      user.user.toLowerCase().includes(searchTermLower) ||
      user.correo.toLowerCase().includes(searchTermLower)
    );
  });

  const columns: GridColDef[] = [
    {
      field: 'nom_user',
      headerName: 'Nombre Completo',
      flex: 1.5,
      minWidth: 200,
    },
    {
      field: 'user',
      headerName: 'Usuario',
      flex: 1,
      minWidth: 130,
    },
    {
      field: 'correo',
      headerName: 'Correo',
      flex: 1.5,
      minWidth: 200,
    },
    {
      field: 'id_rol_user',
      headerName: 'Rol',
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={getRoleLabel(params.value)}
          color={getRoleColor(params.value) as 'error' | 'primary' | 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'id_calle',
      headerName: 'Calle',
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2">
          {getCalleNombre(params.value)}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      flex: 1,
      minWidth: 100,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Tooltip title="Opciones">
            <IconButton
              onClick={(e) => handleOpenMenu(e, params.row as User)}
              color={selectedRowId === params.row.id ? 'primary' : 'default'}
            >
              <MoreVertical size={20} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  if (!isLiderComunidad()) {
    return null;
  }

  return (
    <Box>
      <PageHeader
        title="Gestión de Usuarios"
        breadcrumbs={[
          { label: 'Inicio', path: '/dashboard' },
          { label: 'Usuarios' },
        ]}
        action={{
          label: 'Nuevo Usuario',
          onClick: () => navigate('/dashboard/users/new'),
          icon: <UserPlus size={20} />,
        }}
      />
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <TextField
            placeholder="Buscar usuario..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="outlined"
            startIcon={<RefreshCw size={20} />}
            onClick={fetchUsers}
          >
            Actualizar
          </Button>
        </Box>

        {loading ? (
          <LoadingOverlay open={loading} message="Cargando usuarios..." />
        ) : users.length === 0 ? (
          <EmptyState
            title="No hay usuarios registrados"
            description="Comienza registrando un nuevo usuario en el sistema."
            actionText="Registrar Usuario"
            onAction={() => navigate('/dashboard/users/new')}
            icon={<UserPlus size={80} />}
          />
        ) : (
          <DataGrid
            rows={filteredUsers}
            columns={columns}
            getRowId={(row) => row.id}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
              sorting: {
                sortModel: [{ field: 'nom_user', sort: 'asc' }],
              },
            }}
            pageSizeOptions={[5, 10, 25, 50]}
            autoHeight
            disableRowSelectionOnClick
            sx={{
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
            }}
          />
        )}
      </Paper>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleView}>
          <ListItemIcon>
            <Eye size={20} />
          </ListItemIcon>
          <ListItemText>Ver Detalles</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <Edit size={20} />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <Trash2 size={20} />
          </ListItemIcon>
          <ListItemText>Eliminar</ListItemText>
        </MenuItem>
      </Menu>

      <ConfirmDialog
        open={confirmDialogOpen}
        title="Eliminar Usuario"
        message={`¿Estás seguro de que deseas eliminar al usuario ${selectedUser?.nom_user}?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialogOpen(false)}
        severity="error"
      />
    </Box>
  );
};

export default UsersList;