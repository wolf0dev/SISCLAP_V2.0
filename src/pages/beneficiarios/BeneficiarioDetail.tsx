import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Divider,
  Chip,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Home,
  ArrowLeft,
  Edit,
  UserX,
  UserPlus,
  Trash2,
  Eye,
  Briefcase,
  Book,
  Heart,
  UserCheck,
} from 'lucide-react';
import { beneficiarioService, Beneficiario } from '../../services/beneficiarioService';
import { dependienteService, Dependiente } from '../../services/dependienteService';
import { calleService, Calle } from '../../services/calleService';
import { useSnackbar } from '../../contexts/SnackbarContext';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`beneficiario-tabpanel-${index}`}
      aria-labelledby={`beneficiario-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const BeneficiarioDetail: React.FC = () => {
  const { cedula } = useParams<{ cedula: string }>();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [beneficiario, setBeneficiario] = useState<Beneficiario | null>(null);
  const [dependientes, setDependientes] = useState<Dependiente[] | null>(null);
  const [calles, setCalles] = useState<Calle[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDependientes, setLoadingDependientes] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmDeleteDependienteOpen, setConfirmDeleteDependienteOpen] = useState(false);
  const [selectedDependiente, setSelectedDependiente] = useState<Dependiente | null>(null);

  useEffect(() => {
    fetchBeneficiario();
    fetchDependientes();
    fetchCalles();
  }, [cedula]);

  const fetchBeneficiario = async () => {
    setLoading(true);
    try {
      const data = await beneficiarioService.getById(cedula!);
      setBeneficiario(data);
    } catch (error: any) {
      console.error('Error al obtener beneficiario:', error);
      const errorMessage = error.response?.data?.error || 'Error al cargar los datos del beneficiario';
      showSnackbar(errorMessage, 'error');
      navigate('/dashboard/beneficiarios');
    } finally {
      setLoading(false);
    }
  };

  const fetchDependientes = async () => {
    setLoadingDependientes(true);
    try {
      const data = await dependienteService.getByBeneficiario(cedula!);
      setDependientes(data);
    } catch (error: any) {
      console.error('Error al obtener dependientes:', error);
      const errorMessage = error.response?.data?.error || 'Error al cargar los dependientes';
      showSnackbar(errorMessage, 'error');
    } finally {
      setLoadingDependientes(false);
    }
  };

  const fetchCalles = async () => {
    try {
      const data = await calleService.getAll();
      setCalles(data);
    } catch (error: any) {
      console.error('Error al obtener calles:', error);
      const errorMessage = error.response?.data?.error || 'Error al cargar las calles';
      showSnackbar(errorMessage, 'error');
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDisable = () => {
    setConfirmDialogOpen(true);
  };

  const confirmDisable = async () => {
    try {
      await beneficiarioService.disable(cedula!);
      showSnackbar('Beneficiario deshabilitado exitosamente', 'success');
      navigate('/dashboard/beneficiarios');
    } catch (error: any) {
      console.error('Error al deshabilitar beneficiario:', error);
      const errorMessage = error.response?.data?.error || 'Error al deshabilitar el beneficiario';
      showSnackbar(errorMessage, 'error');
    } finally {
      setConfirmDialogOpen(false);
    }
  };

  const handleDeleteDependiente = (dependiente: Dependiente) => {
    setSelectedDependiente(dependiente);
    setConfirmDeleteDependienteOpen(true);
  };

  const confirmDeleteDependiente = async () => {
    if (selectedDependiente) {
      try {
        await dependienteService.delete(selectedDependiente.cedula);
        showSnackbar('Dependiente eliminado exitosamente', 'success');
        fetchDependientes();
      } catch (error: any) {
        console.error('Error al eliminar dependiente:', error);
        const errorMessage = error.response?.data?.error || 'Error al eliminar el dependiente';
        showSnackbar(errorMessage, 'error');
      } finally {
        setConfirmDeleteDependienteOpen(false);
        setSelectedDependiente(null);
      }
    }
  };

  if (loading) {
    return <LoadingOverlay open={loading} message="Cargando datos del beneficiario..." />;
  }

  if (!beneficiario) {
    return (
      <EmptyState
        title="Beneficiario no encontrado"
        description="El beneficiario que estás buscando no existe o ha sido eliminado."
        actionText="Volver a Beneficiarios"
        onAction={() => navigate('/dashboard/beneficiarios')}
      />
    );
  }

  const getCalleNombre = (id: number) => {
    const calle = calles.find((c) => c.id_calle === id);
    return calle ? calle.nom_calle : beneficiario.nom_calle || 'No especificada';
  };

  const formatFecha = (fechaStr: string) => {
    if (!fechaStr) return 'No especificada';
    const fecha = new Date(fechaStr + 'T00:00:00');
    return fecha.toLocaleDateString();
  };

  const calcularEdad = (fechaStr: string) => {
    if (!fechaStr) return 0;
    const fechaNacimiento = new Date(fechaStr + 'T00:00:00');
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 56,
                height: 56,
                mr: 2,
              }}
            >
              <User size={30} />
            </Avatar>
            <Box>
              <Typography variant="h5" component="h2">
                {beneficiario.nombre_apellido}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cédula: {beneficiario.cedula}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Chip
              label={beneficiario.estatus === 'Activo' ? 'Activo' : 'Inactivo'}
              color={beneficiario.estatus === 'Activo' ? 'success' : 'error'}
              sx={{ mr: 1 }}
            />
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Edit size={18} />}
              onClick={() => navigate(`/dashboard/beneficiarios/edit/${cedula}`)}
              sx={{ mr: 1 }}
            >
              Editar
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<UserX size={18} />}
              onClick={handleDisable}
            >
              Deshabilitar
            </Button>
          </Box>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="beneficiario tabs">
            <Tab label="Información Personal" />
            <Tab label="Dependientes" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Datos Personales
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                      <User size={20} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Nombre Completo"
                    secondary={beneficiario.nombre_apellido}
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                      <Calendar size={20} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Fecha de Nacimiento"
                    secondary={`${formatFecha(beneficiario.fecha_nacimiento)} (${calcularEdad(
                      beneficiario.fecha_nacimiento
                    )} años)`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                      <User size={20} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Género" secondary={beneficiario.genero || 'No especificado'} />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                      <UserCheck size={20} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Estado Civil" secondary={beneficiario.estado_civil} />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                      <Phone size={20} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Teléfono" secondary={beneficiario.telefono} />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                      <Briefcase size={20} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Profesión" secondary={beneficiario.profesion} />
                </ListItem>
              </List>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Información Adicional
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                      <Book size={20} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Grado de Instrucción" secondary={beneficiario.grado_instruccion} />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                      <Heart size={20} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Enfermedad Crónica" secondary={beneficiario.enfermedad_cronica || 'Ninguna'} />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                      <Heart size={20} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Discapacidad" secondary={beneficiario.discapacidad || 'Ninguna'} />
                </ListItem>
              </List>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Ubicación
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                      <MapPin size={20} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Calle" secondary={getCalleNombre(beneficiario.id_calle)} />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                      <Home size={20} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Número de Casa" secondary={beneficiario.numero_casa} />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Dependientes</Typography>
            <Button
              variant="contained"
              startIcon={<UserPlus size={18} />}
              onClick={() => navigate(`/dashboard/dependientes/new?beneficiario=${cedula}`)}
            >
              Agregar Dependiente
            </Button>
          </Box>

          {loadingDependientes ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <Typography>Cargando dependientes...</Typography>
            </Box>
          ) : dependientes === null ? (
            <EmptyState
              title="No hay dependientes registrados"
              description="Este beneficiario no tiene dependientes registrados."
              actionText="Agregar Dependiente"
              onAction={() => navigate(`/dashboard/dependientes/new?beneficiario=${cedula}`)}
              icon={<UserPlus size={80} />}
            />
          ) : dependientes.length === 0 ? (
            <EmptyState
              title="No hay dependientes registrados"
              description="Este beneficiario no tiene dependientes registrados."
              actionText="Agregar Dependiente"
              onAction={() => navigate(`/dashboard/dependientes/new?beneficiario=${cedula}`)}
              icon={<UserPlus size={80} />}
            />
          ) : (
            <List>
              {dependientes.map((dependiente) => (
                <Paper
                  key={dependiente.cedula}
                  elevation={1}
                  sx={{ mb: 2, p: 2, borderRadius: 2 }}
                >
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
                            onClick={() => handleDeleteDependiente(dependiente)}
                          >
                            <Trash2 size={20} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    }
                    disablePadding
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.light' }}>
                        <User size={20} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={dependiente.nombre_apellido}
                      secondary={
                        <React.Fragment>
                          <Typography component="span" variant="body2" color="text.primary">
                            {dependiente.parentesco}
                          </Typography>
                          {` — Cédula: ${dependiente.cedula}`}
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                </Paper>
              ))}
            </List>
          )}
        </TabPanel>

        <Box sx={{ mt: 4 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowLeft size={20} />}
            onClick={() => navigate('/dashboard/beneficiarios')}
          >
            Volver a Beneficiarios
          </Button>
        </Box>
      </Paper>

      <ConfirmDialog
        open={confirmDialogOpen}
        title="Deshabilitar Beneficiario"
        message={`¿Estás seguro de que deseas deshabilitar al beneficiario ${beneficiario.nombre_apellido}?`}
        confirmText="Deshabilitar"
        cancelText="Cancelar"
        onConfirm={confirmDisable}
        onCancel={() => setConfirmDialogOpen(false)}
        severity="warning"
      />

      <ConfirmDialog
        open={confirmDeleteDependienteOpen}
        title="Eliminar Dependiente"
        message={`¿Estás seguro de que deseas eliminar al dependiente ${selectedDependiente?.nombre_apellido}?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDeleteDependiente}
        onCancel={() => setConfirmDeleteDependienteOpen(false)}
        severity="error"
      />
    </Box>
  );
};

export default BeneficiarioDetail;