import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import {
  Search,
  MoreVertical,
  Eye,
  RefreshCw,
  UserCheck,
} from 'lucide-react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { beneficiarioService, Beneficiario } from '../../services/beneficiarioService';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { useAuth } from '../../contexts/AuthContext';
import PageHeader from '../../components/common/PageHeader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import EmptyState from '../../components/common/EmptyState';

const BeneficiariosInactivos: React.FC = () => {
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

      // Filtrar solo beneficiarios inactivos usando la función helper
      const inactiveBeneficiarios = data.filter((b: Beneficiario) => beneficiarioService.isInactive(b));
      setBeneficiarios(inactiveBeneficiarios);
    } catch (error: any) {
      console.error('Error al obtener beneficiarios inactivos:', error);
      const errorMessage = error.response?.data?.error || 'Error al cargar los beneficiarios inactivos';
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

  const handleReactivate = () => {
    handleCloseMenu();
    if (selectedBeneficiario && canAccessBeneficiario(selectedBeneficiario)) {
      setConfirmDialogOpen(true);
    }
  };

  const confirmReactivate = async () => {
    if (selectedBeneficiario) {
      try {
        await beneficiarioService.updateStatus(selectedBeneficiario.cedula, 'Activo');
        showSnackbar('Beneficiario reactivado exitosamente', 'success');
        fetchBeneficiarios();
      } catch (error: any) {
        console.error('Error al reactivar beneficiario:', error);
        const errorMessage = error.response?.data?.error || 'Error al reactivar el beneficiario';
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
      beneficiario.telefono.toLowerCase().includes(searchTermLower)
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
      field: 'fecha_nacimiento',
      headerName: 'Fecha Nacimiento',
      flex: 1,
      minWidth: 150,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return date.toLocaleDateString();
      },
    },
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
      return 'Beneficiarios Inactivos - Todas las Calles';
    } else if (isJefeCalle()) {
      return `Beneficiarios Inactivos - Mi Calle`;
    }
    return 'Beneficiarios Inactivos';
  };

  return (
    <Box>
      <PageHeader
        title={getPageTitle()}
        breadcrumbs={[
          { label: 'Inicio', path: '/dashboard' },
          { label: 'Beneficiarios', path: '/dashboard/beneficiarios' },
          { label: 'Inactivos' },
        ]}
      />
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <TextField
            placeholder="Buscar beneficiario..."
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
            onClick={fetchBeneficiarios}
          >
            Actualizar
          </Button>
        </Box>

        {isJefeCalle() && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Mostrando beneficiarios inactivos de tu calle asignada
            </Typography>
          </Box>
        )}

        {loading ? (
          <LoadingOverlay open={loading} message="Cargando beneficiarios inactivos..." />
        ) : beneficiarios.length === 0 ? (
          <EmptyState
            title="No hay beneficiarios inactivos"
            description={
              isJefeCalle() 
                ? "No se encontraron beneficiarios inactivos en tu calle asignada."
                : "No se encontraron beneficiarios inactivos en el sistema."
            }
            actionText="Volver a Beneficiarios"
            onAction={() => navigate('/dashboard/beneficiarios')}
          />
        ) : (
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
        <MenuItem onClick={handleReactivate}>
          <ListItemIcon>
            <UserCheck size={20} />
          </ListItemIcon>
          <ListItemText>Reactivar</ListItemText>
        </MenuItem>
      </Menu>

      <ConfirmDialog
        open={confirmDialogOpen}
        title="Reactivar Beneficiario"
        message={`¿Estás seguro de que deseas reactivar al beneficiario ${selectedBeneficiario?.nombre_apellido}?`}
        confirmText="Reactivar"
        cancelText="Cancelar"
        onConfirm={confirmReactivate}
        onCancel={() => setConfirmDialogOpen(false)}
        severity="info"
      />
    </Box>
  );
};

export default BeneficiariosInactivos;