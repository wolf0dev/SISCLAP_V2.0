import React, { useState } from 'react';
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
  ListItemText,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  Avatar
} from '@mui/material';
import {
  Search,
  UserPlus,
  Edit,
  Eye,
  MoreVertical,
  Trash2,
  User,
  Users,
} from 'lucide-react';
import { dependienteService, Dependiente } from '../../services/dependienteService';
import { useSnackbar } from '../../contexts/SnackbarContext';
import PageHeader from '../../components/common/PageHeader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import EmptyState from '../../components/common/EmptyState';

const DependientesList: React.FC = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [dependientes, setDependientes] = useState<Dependiente[]>([]);
  const [loading, setLoading] = useState(false);
  const [cedulaBeneficiario, setCedulaBeneficiario] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedDependiente, setSelectedDependiente] = useState<Dependiente | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
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

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, dependiente: Dependiente) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedDependiente(dependiente);
    setSelectedRowId(dependiente.cedula);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
    setSelectedRowId(null);
  };

  const handleView = () => {
    handleCloseMenu();
    if (selectedDependiente) {
      navigate(`/dashboard/dependientes/view/${selectedDependiente.cedula}`);
    }
  };

  const handleEdit = () => {
    handleCloseMenu();
    if (selectedDependiente) {
      navigate(`/dashboard/dependientes/edit/${selectedDependiente.cedula}`);
    }
  };

  const handleDelete = () => {
    handleCloseMenu();
    if (selectedDependiente) {
      setConfirmDialogOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (selectedDependiente) {
      try {
        await dependienteService.delete(selectedDependiente.cedula);
        showSnackbar('Dependiente eliminado exitosamente', 'success');
        handleSearch(); // Refresh the list
      } catch (error) {
        console.error('Error al eliminar dependiente:', error);
        showSnackbar('Error al eliminar el dependiente', 'error');
      } finally {
        setConfirmDialogOpen(false);
        setSelectedDependiente(null);
      }
    }
  };

  return (
    <Box>
      <PageHeader
        title="Dependientes"
        breadcrumbs={[
          { label: 'Inicio', path: '/dashboard' },
          { label: 'Dependientes' },
        ]}
        action={{
          label: 'Nuevo Dependiente',
          onClick: () => navigate('/dashboard/dependientes/new'),
          icon: <UserPlus size={20} />,
        }}
      />

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Buscar Dependientes por Beneficiario
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Ingrese la cédula del beneficiario para ver sus dependientes.
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Cédula del Beneficiario"
              value={cedulaBeneficiario}
              onChange={(e) => setCedulaBeneficiario(e.target.value)}
              placeholder="Ingrese la cédula del beneficiario"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSearch}
              disabled={loading}
            >
              Buscar Dependientes
            </Button>
          </Grid>
        </Grid>

        {loading ? (
          <LoadingOverlay open={loading} message="Buscando dependientes..." />
        ) : searched ? (
          dependientes.length === 0 ? (
            <EmptyState
              title="No se encontraron dependientes"
              description="No hay dependientes registrados para este beneficiario."
              actionText="Registrar Dependiente"
              onAction={() => navigate(`/dashboard/dependientes/new?beneficiario=${cedulaBeneficiario}`)}
              icon={<Users size={80} />}
            />
          ) : (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Dependientes Encontrados
              </Typography>
              <List>
                {dependientes.map((dependiente) => (
                  <Card key={dependiente.cedula} sx={{ mb: 2 }}>
                    <CardContent>
                      <ListItem
                        secondaryAction={
                          <Box>
                            <Tooltip title="Ver Detalles">
                              <IconButton
                                edge="end"
                                onClick={() =>
                                  navigate(`/dashboard/dependientes/view/${dependiente.cedula}`)
                                }
                                sx={{ mr: 1 }}
                              >
                                <Eye size={20} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Editar">
                              <IconButton
                                edge="end"
                                onClick={() =>
                                  navigate(`/dashboard/dependientes/edit/${dependiente.cedula}`)
                                }
                                sx={{ mr: 1 }}
                              >
                                <Edit size={20} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar">
                              <IconButton
                                edge="end"
                                color="error"
                                onClick={() => {
                                  setSelectedDependiente(dependiente);
                                  setConfirmDialogOpen(true);
                                }}
                              >
                                <Trash2 size={20} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <User size={20} />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={dependiente.nombre_apellido}
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="text.primary">
                                {dependiente.parentesco}
                              </Typography>
                              {` — Cédula: ${dependiente.cedula}`}
                            </>
                          }
                        />
                      </ListItem>
                    </CardContent>
                  </Card>
                ))}
              </List>
            </Box>
          )
        ) : null}
      </Paper>

      <ConfirmDialog
        open={confirmDialogOpen}
        title="Eliminar Dependiente"
        message={`¿Estás seguro de que deseas eliminar al dependiente ${selectedDependiente?.nombre_apellido}?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialogOpen(false)}
        severity="error"
      />
    </Box>
  );
};

export default DependientesList;
