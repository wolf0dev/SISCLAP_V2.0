import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import {
  User,
  Phone,
  Calendar,
  ArrowLeft,
  Edit,
  Trash2,
  Briefcase,
  Book,
  Heart,
  UserCheck,
} from 'lucide-react';
import { dependienteService, Dependiente } from '../../services/dependienteService';
import { beneficiarioService, Beneficiario } from '../../services/beneficiarioService';
import { useSnackbar } from '../../contexts/SnackbarContext';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';

const DependienteDetail: React.FC = () => {
  const { cedula } = useParams<{ cedula: string }>();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [dependiente, setDependiente] = useState<Dependiente | null>(null);
  const [beneficiario, setBeneficiario] = useState<Beneficiario | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingBeneficiario, setLoadingBeneficiario] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  useEffect(() => {
    fetchDependiente();
  }, [cedula]);

  const fetchDependiente = async () => {
    setLoading(true);
    try {
      const data = await dependienteService.getById(cedula!);
      setDependiente(data);
      fetchBeneficiario(data.cedula_beneficiario);
    } catch (error) {
      console.error('Error al obtener dependiente:', error);
      showSnackbar('Error al cargar los datos del dependiente', 'error');
      navigate('/dashboard/dependientes');
    } finally {
      setLoading(false);
    }
  };

  const fetchBeneficiario = async (cedulaBeneficiario: string) => {
    setLoadingBeneficiario(true);
    try {
      const data = await beneficiarioService.getById(cedulaBeneficiario);
      setBeneficiario(data);
    } catch (error) {
      console.error('Error al obtener beneficiario:', error);
      showSnackbar('Error al cargar los datos del beneficiario', 'error');
    } finally {
      setLoadingBeneficiario(false);
    }
  };

  const handleDelete = () => {
    setConfirmDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await dependienteService.delete(cedula!);
      showSnackbar('Dependiente eliminado exitosamente', 'success');
      navigate('/dashboard/dependientes');
    } catch (error) {
      console.error('Error al eliminar dependiente:', error);
      showSnackbar('Error al eliminar el dependiente', 'error');
    } finally {
      setConfirmDialogOpen(false);
    }
  };

  const formatFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString();
  };

  const calcularEdad = (fechaStr: string) => {
    const fechaNacimiento = new Date(fechaStr);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  if (loading) {
    return <LoadingOverlay open={loading} message="Cargando datos del dependiente..." />;
  }

  if (!dependiente) {
    return (
      <EmptyState
        title="Dependiente no encontrado"
        description="El dependiente que estás buscando no existe o ha sido eliminado."
        actionText="Volver a Dependientes"
        onAction={() => navigate('/dashboard/dependientes')}
      />
    );
  }

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
                {dependiente.nombre_apellido}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cédula: {dependiente.cedula}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Edit size={18} />}
              onClick={() => navigate(`/dashboard/dependientes/edit/${cedula}`)}
              sx={{ mr: 1 }}
            >
              Editar
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Trash2 size={18} />}
              onClick={handleDelete}
            >
              Eliminar
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3} sx={{ mt: 2 }}>
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
                  secondary={dependiente.nombre_apellido}
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
                  secondary={`${formatFecha(dependiente.fecha_nacimiento)} (${calcularEdad(
                    dependiente.fecha_nacimiento
                  )} años)`}
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <User size={20} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Género" secondary={dependiente.genero} />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <UserCheck size={20} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Estado Civil" secondary={dependiente.estado_civil} />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <Phone size={20} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Teléfono" secondary={dependiente.telefono} />
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
                    <Briefcase size={20} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Profesión" secondary={dependiente.profesion} />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <Book size={20} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Grado de Instrucción" secondary={dependiente.grado_instruccion} />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <Heart size={20} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Enfermedad Crónica" secondary={dependiente.enfermedad_cronica || 'Ninguna'} />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <Heart size={20} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Discapacidad" secondary={dependiente.discapacidad || 'Ninguna'} />
              </ListItem>
            </List>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Relación con Beneficiario
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <User size={20} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Parentesco" secondary={dependiente.parentesco} />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <User size={20} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Beneficiario"
                  secondary={
                    loadingBeneficiario
                      ? 'Cargando...'
                      : beneficiario
                      ? `${beneficiario.nombre_apellido} (${beneficiario.cedula})`
                      : 'No disponible'
                  }
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowLeft size={20} />}
            onClick={() => navigate('/dashboard/dependientes')}
          >
            Volver a Dependientes
          </Button>
        </Box>
      </Paper>

      <ConfirmDialog
        open={confirmDialogOpen}
        title="Eliminar Dependiente"
        message={`¿Estás seguro de que deseas eliminar al dependiente ${dependiente.nombre_apellido}?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialogOpen(false)}
        severity="error"
      />
    </Box>
  );
};

export default DependienteDetail;