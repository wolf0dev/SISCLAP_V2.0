import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material';
import { Search, FileText, Download, User, MapPin } from 'lucide-react';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { useAuth } from '../../contexts/AuthContext';
import { reporteService, ReporteHabitantesCalle as ReporteHabitantesCalleType } from '../../services/reporteService';
import { calleService, Calle } from '../../services/calleService';
import PageHeader from '../../components/common/PageHeader';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import EmptyState from '../../components/common/EmptyState';

const ReporteHabitantesCalle: React.FC = () => {
  const { showSnackbar } = useSnackbar();
  const { isLiderComunidad, isJefeCalle, getUserCalle } = useAuth();
  const [selectedCalle, setSelectedCalle] = useState<number | ''>('');
  const [reporte, setReporte] = useState<ReporteHabitantesCalleType | null>(null);
  const [loadingReporte, setLoadingReporte] = useState(false);
  const [buscado, setBuscado] = useState(false);
  const [calles, setCalles] = useState<Calle[]>([]);
  const [loadingCalles, setLoadingCalles] = useState(false);
  const [calleNombre, setCalleNombre] = useState<string>('');

  useEffect(() => {
    fetchCalles();
  }, []);

  const fetchCalles = async () => {
    setLoadingCalles(true);
    try {
      const data = await calleService.getAll();
      
      // Si es jefe de calle, filtrar solo su calle
      if (isJefeCalle()) {
        const userCalle = getUserCalle();
        if (userCalle) {
          const userCalleData = data.filter(calle => calle.id_calle === userCalle);
          setCalles(userCalleData);
          // Auto-seleccionar la calle del usuario
          if (userCalleData.length > 0) {
            setSelectedCalle(userCalleData[0].id_calle);
            setCalleNombre(userCalleData[0].nom_calle);
          }
        } else {
          setCalles([]);
          showSnackbar('No se pudo determinar tu calle asignada', 'error');
        }
      } else {
        setCalles(data);
      }
    } catch (error) {
      console.error('Error al obtener calles:', error);
      showSnackbar('Error al cargar las calles', 'error');
    } finally {
      setLoadingCalles(false);
    }
  };

  const handleSearch = async () => {
    if (!selectedCalle) {
      showSnackbar('Selecciona una calle', 'warning');
      return;
    }

    setLoadingReporte(true);
    setBuscado(true);
    try {
      const data = await reporteService.getHabitantesCalle(selectedCalle as number);
      setReporte(data);
      
      // Obtener el nombre de la calle seleccionada
      const calle = calles.find(c => c.id_calle === selectedCalle);
      if (calle) {
        setCalleNombre(calle.nom_calle);
      }
    } catch (error) {
      console.error('Error al obtener reporte:', error);
      showSnackbar('Error al generar el reporte', 'error');
      setReporte(null);
    } finally {
      setLoadingReporte(false);
    }
  };

  const handleExportExcel = () => {
    if (!reporte || !reporte.habitantes) return;
    
    const data = reporte.habitantes.map((hab) => ({
      Calle: calleNombre,
      Cedula: hab.cedula,
      Nombre: hab.nombre_apellido,
      Numero_Casa: hab.numero_casa,
    }));

    reporteService.exportHabitantesToExcel(data, 'Reporte_Habitantes_Calle', calleNombre);
    showSnackbar('Reporte exportado a Excel exitosamente', 'success');
  };

  const handleExportPDF = () => {
    if (!reporte || !reporte.habitantes) return;
    
    const data = reporte.habitantes.map((hab) => ({
      cedula: hab.cedula,
      nombre: hab.nombre_apellido,
      num_casa: hab.numero_casa,
    }));

    const columns = ['cedula', 'nombre', 'num_casa'];
    const title = `Habitantes de ${calleNombre}`;

    reporteService.exportHabitantesToPDF(data, columns, title, 'Reporte_Habitantes_Calle', calleNombre);
    showSnackbar('Reporte exportado a PDF exitosamente', 'success');
  };

  const getPageTitle = () => {
    if (isJefeCalle()) {
      return `Reporte de Habitantes - ${calleNombre || 'Mi Calle'}`;
    }
    return 'Reporte de Habitantes por Calle';
  };

  return (
    <Box>
      <PageHeader
        title={getPageTitle()}
        breadcrumbs={[
          { label: 'Inicio', path: '/dashboard' },
          { label: 'Reportes', path: '/dashboard/reportes/habitantes-calle' },
          { label: 'Habitantes por Calle' },
        ]}
      />

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Generar Reporte de Habitantes por Calle
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {isJefeCalle() 
            ? `Genera el reporte de habitantes de ${calleNombre}.`
            : 'Selecciona una calle para generar el reporte de habitantes.'
          }
        </Typography>

        {isJefeCalle() && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Solo puedes generar reportes de tu calle asignada: {calleNombre}
          </Alert>
        )}

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <FormControl fullWidth>
              <InputLabel id="calle-label">Seleccionar Calle</InputLabel>
              <Select
                labelId="calle-label"
                id="calle"
                value={selectedCalle}
                label="Seleccionar Calle"
                onChange={(e) => setSelectedCalle(e.target.value as number)}
                disabled={isJefeCalle() || loadingCalles}
              >
                <MenuItem value="" disabled>
                  Seleccione una calle
                </MenuItem>
                {calles.map((calle) => (
                  <MenuItem key={calle.id_calle} value={calle.id_calle}>
                    {calle.nom_calle}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              startIcon={<Search />}
              onClick={handleSearch}
              fullWidth
              disabled={!selectedCalle || loadingReporte}
            >
              {loadingReporte ? 'Generando...' : 'Generar Reporte'}
            </Button>
          </Grid>
        </Grid>

        {loadingReporte && <LoadingOverlay open={loadingReporte} message="Generando reporte..." />}

        {buscado && !loadingReporte && (
          <>
            {reporte && reporte.habitantes ? (
              <Box sx={{ mt: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Resultados del Reporte</Typography>
                  <Box>
                    <Tooltip title="Exportar a Excel">
                      <IconButton color="primary" onClick={handleExportExcel} sx={{ mr: 1 }}>
                        <FileText size={24} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Exportar a PDF">
                      <IconButton color="error" onClick={handleExportPDF}>
                        <Download size={24} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        <MapPin size={24} />
                      </Avatar>
                      <Box>
                        <Typography variant="h6">{calleNombre}</Typography>
                      </Box>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" gutterBottom>
                      Total de Habitantes: {reporte.total_habitantes}
                    </Typography>
                  </CardContent>
                </Card>

                <Typography variant="subtitle1" gutterBottom>
                  Lista de Habitantes
                </Typography>

                {reporte.habitantes.length === 0 ? (
                  <EmptyState
                    title="Sin habitantes"
                    description="No hay habitantes registrados en esta calle."
                    icon={<User size={80} />}
                  />
                ) : (
                  <List>
                    {reporte.habitantes.map((habitante) => (
                      <Card key={habitante.cedula} sx={{ mb: 2 }}>
                        <CardContent sx={{ p: 2 }}>
                          <ListItem disablePadding>
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: 'primary.light' }}>
                                <User size={20} />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={habitante.nombre_apellido}
                              secondary={
                                <>
                                  <Typography component="span" variant="body2" color="text.primary">
                                    Casa N° {habitante.numero_casa}
                                  </Typography>
                                  {` — Cédula: ${habitante.cedula}`}
                                </>
                              }
                            />
                          </ListItem>
                        </CardContent>
                      </Card>
                    ))}
                  </List>
                )}
              </Box>
            ) : (
              <EmptyState
                title="No se encontraron resultados"
                description="No se pudo generar el reporte para la calle seleccionada."
                icon={<FileText size={80} />}
              />
            )}
          </>
        )}
      </Paper>
    </Box>
  );
};

export default ReporteHabitantesCalle;