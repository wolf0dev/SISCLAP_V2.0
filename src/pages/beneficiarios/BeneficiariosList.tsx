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
  UserX,
  RefreshCw,
} from 'lucide-react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { beneficiarioService, Beneficiario } from '../../services/beneficiarioService';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { useAuth } from '../../contexts/AuthContext';

import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import EmptyState from '../../components/common/EmptyState';
import PageHeader from '../../components/common/PageHeader';

const BeneficiariosList: React.FC = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const { user, isLiderComunidad, isJefeCalle, getUserCalle } = useAuth();
  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedBeneficiario, setSelectedBeneficiario] = useState<Beneficiario | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  useEffect(() => {
    fetchBeneficiarios();
  }, []);

  const fetchBeneficiarios = async () => {
    setLoading(true);
    try {
      let data: Beneficiario[];
      
      if (isLiderComunidad()) {
        // Líder de comunidad ve todos los beneficiarios
        data = await beneficiarioService.getAll();
      } else if (isJefeCalle()) {
        // Jefe de calle solo ve beneficiarios de su calle
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

      // Filtrar solo beneficiarios activos usando la función helper
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, beneficiario: Beneficiario) => {
    // Verificar permisos antes de abrir el menú
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

  const columns: GridColDef[] = [
    {
      field: 'cedula',
      headerName: 'Cédula',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'nombre_apellido',
      headerName: 'Nombre y Apellido',
      flex: 1.5,
      minWidth: 200,
    },
    {
      field: 'profesion',
      headerName: 'Profesión',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'telefono',
      headerName: 'Teléfono',
      flex: 1,
      minWidth: 130,
    },
    ...(isLiderComunidad() ? [{
      field: 'nom_calle',
      headerName: 'Calle',
      flex: 1,
      minWidth: 150,
    }] : []),
    {
      field: 'estatus',
      headerName: 'Estatus',
      flex: 1,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={beneficiarioService.isActive({ estatus: params.value } as Beneficiario) ? 'Activo' : 'Inactivo'}
          color={beneficiarioService.isActive({ estatus: params.value } as Beneficiario) ? 'success' : 'error'}
          size="small"
        />
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
              onClick={(e) => handleOpenMenu(e, params.row as Beneficiario)}
              color={selectedRowId === params.row.cedula ? 'primary' : 'default'}
              disabled={!canAccessBeneficiario(params.row as Beneficiario)}
            >
              <MoreVertical size={20} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const getPageTitle = () => {
    if (isLiderComunidad()) {
      return 'Beneficiarios - Todas las Calles';
    } else if (isJefeCalle()) {
      return `Beneficiarios - Mi Calle`;
    }
    return 'Beneficiarios';
  };

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <PageHeader
        title={getPageTitle()}
        breadcrumbs={[
          { label: 'Inicio', path: '/dashboard' },
          { label: 'Beneficiarios' },
        ]}
        action={{
          label: 'Nuevo Beneficiario',
          onClick: () => navigate('/dashboard/beneficiarios/new'),
          icon: <UserPlus size={20} />,
        }}
      />
      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 4, width: '100%', overflow: 'hidden' }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' }, 
          mb: 3,
          gap: { xs: 2, sm: 0 }
        }}>
          <TextField
            placeholder="Buscar beneficiario..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ 
              width: { xs: '100%', sm: 300 },
              maxWidth: '100%'
            }}
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
            onClick={fetchBeneficiarios}
            sx={{ 
              flexShrink: 0,
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
          >
            Actualizar
          </Button>
        </Box>

        {isJefeCalle() && (
          <Box sx={{ mb: 2 }}>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              Mostrando beneficiarios de tu calle asignada
            </Typography>
          </Box>
        )}

        {loading ? (
          <LoadingOverlay open={loading} message="Cargando beneficiarios..." />
        ) : beneficiarios.length === 0 ? (
          <EmptyState
            title="No hay beneficiarios registrados"
            description={
              isJefeCalle() 
                ? "No hay beneficiarios registrados en tu calle asignada."
                : "Comienza registrando un nuevo beneficiario en el sistema."
            }
            actionText="Registrar Beneficiario"
            onAction={() => navigate('/dashboard/beneficiarios/new')}
            icon={<UserPlus size={80} />}
          />
        ) : (
          <Box sx={{ width: '100%', overflow: 'auto' }}>
            <DataGrid
              rows={filteredBeneficiarios}
              columns={columns}
              getRowId={(row) => row.cedula}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
                sorting: {
                  sortModel: [{ field: 'nombre_apellido', sort: 'asc' }],
                },
              }}
              pageSizeOptions={[5, 10, 25, 50]}
              autoHeight
              disableRowSelectionOnClick
              sx={{
                width: '100%',
                minWidth: 0,
                '& .MuiDataGrid-cell:focus': {
                  outline: 'none',
                },
                '& .MuiDataGrid-root': {
                  border: 'none',
                },
                '& .MuiDataGrid-columnHeaders': {
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                },
                '& .MuiDataGrid-cell': {
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                },
              }}
            />
          </Box>
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
        <MenuItem onClick={handleDisable}>
          <ListItemIcon>
            <UserX size={20} />
          </ListItemIcon>
          <ListItemText>Deshabilitar</ListItemText>
        </MenuItem>
      </Menu>

      <ConfirmDialog
        open={confirmDialogOpen}
        title="Deshabilitar Beneficiario"
        message={`¿Estás seguro de que deseas deshabilitar al beneficiario ${selectedBeneficiario?.nombre_apellido}?`}
        confirmText="Deshabilitar"
        cancelText="Cancelar"
        onConfirm={confirmDisable}
        onCancel={() => setConfirmDialogOpen(false)}
        severity="warning"
      />
    </Box>
  );
};

export default BeneficiariosList;