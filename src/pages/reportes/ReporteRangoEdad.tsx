import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
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
  CircularProgress,
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material';
import { Search, FileText, Download, User, Users } from 'lucide-react';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { useAuth } from '../../contexts/AuthContext';
import { reporteService, ReporteRangoEdad as ReporteRangoEdadType } from '../../services/reporteService';
import { calleService } from '../../services/calleService';
import PageHeader from '../../components/common/PageHeader';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import EmptyState from '../../components/common/EmptyState';

const ReporteRangoEdad: React.FC = () => {
  const { showSnackbar } = useSnackbar();
  const { isLiderComunidad, isJefeCalle, getUserCalle } = useAuth();
  const [edadMin, setEdadMin] = useState<number | ''>('');
  const [edadMax, setEdadMax] = useState<number | ''>('');
  const [reporte, setReporte] = useState<ReporteRangoEdadType | null>(null);
  const [loadingReporte, setLoadingReporte] = useState(false);
  const [buscado, setBuscado] = useState(false);
  const [calleNombre, setCalleNombre] = useState<string>('');

  React.useEffect(() => {
    // Obtener el nombre de la calle si es jefe de calle
    const fetchCalleNombre = async () => {
      if (isJefeCalle()) {
        const userCalle = getUserCalle();
        if (userCalle) {
          try {
            const calles = await calleService.getAll();
            const calle = calles.find(c => c.id_calle === userCalle);
            if (calle) {
              setCalleNombre(calle.nom_calle);
            }
          } catch (error) {
            console.error('Error al obtener nombre de calle:', error);
          }
        }
      }
    };

    fetchCalleNombre();
  }, [isJefeCalle, getUserCalle]);

  const handleSearch = async () => {
    if (edadMin === '' || edadMax === '') {
      showSnackbar('Ingresa ambos rangos de edad', 'warning');
      return;
    }

    if (Number(edadMin) > Number(edadMax)) {
      showSnackbar('La edad mínima no puede ser mayor que la edad máxima', 'warning');
      return;
    }

    setLoadingReporte(true);
    setBuscado(true);
    try {
      let data: ReporteRangoEdadType;
      
      if (isLiderComunidad()) {
        // Líder de comunidad ve todos los datos
        data = await reporteService.getRangoEdad(Number(edadMin), Number(edadMax));
      } else if (isJefeCalle()) {
        // Jefe de calle solo ve datos de su calle
        const userCalle = getUserCalle();
        if (userCalle) {
          data = await reporteService.getRangoEdadByCalle(Number(edadMin), Number(edadMax), userCalle);
        } else {
          throw new Error('No se pudo determinar tu calle asignada');
        }
      } else {
        throw new Error('No tienes permisos para generar reportes');
      }
      
      setReporte(data);
    } catch (error) {
      console.error('Error al obtener reporte:', error);
      showSnackbar('Error al generar el reporte', 'error');
      setReporte(null);
    } finally {
      setLoadingReporte(false);
    }
  };

  const handleExportExcel = () => {
    if (!reporte || !reporte.personas) return;

    // Preparar datos para Excel
    const data = reporte.personas.map((persona) => ({
      Rango: reporte.rango,
      Cedula: persona.cedula,
      Nombre: persona.nombre_apellido,
      Fecha_Nacimiento: new Date(persona.fecha_nacimiento).toLocaleDateString(),
      Edad: persona.edad,
      Calle: persona.calle || persona.nom_calle || 'No especificada',
    }));

    const fileName = isJefeCalle() ? `Reporte_Rango_Edad_${calleNombre?.replace(/\s+/g, '_') || 'Mi_Calle'}` : 'Reporte_Rango_Edad';
    reporteService.exportHabitantesToExcel(data, fileName);
    showSnackbar('Reporte exportado a Excel exitosamente', 'success');
  };

  const handleExportPDF = () => {
    if (!reporte || !reporte.personas) return;

    // Preparar datos para PDF
    const data = reporte.personas.map((persona) => ({
      cedula: persona.cedula,
      nombre: persona.nombre_apellido,
      edad: persona.edad.toString(),
      calle: persona.calle || persona.nom_calle || 'No especificada',
    }));

    const columns = ['cedula', 'nombre', 'edad', 'calle'];
    const title = `Personas en Rango de Edad: ${reporte.rango}${isJefeCalle() ? ` - ${calleNombre}` : ''}`;
    const fileName = isJefeCalle() ? `Reporte_Rango_Edad_${calleNombre?.replace(/\s+/g, '_') || 'Mi_Calle'}` : 'Reporte_Rango_Edad';

    reporteService.exportHabitantesToPDF(data, columns, title, fileName);
    showSnackbar('Reporte exportado a PDF exitosamente', 'success');
  };

  const getPageTitle = () => {
    if (isJefeCalle()) {
      return `Reporte por Rango de Edad - ${calleNombre || 'Mi Calle'}`;
    }
    return 'Reporte por Rango de Edad';
  };

  return (
    <Box>
      <PageHeader
        title={getPageTitle()}
        breadcrumbs={[
          { label: 'Inicio', path: '/dashboard' },
          { label: 'Reportes', path: '/dashboard/reportes/rango-edad' },
          { label: 'Rango de Edad' },
        ]}
      />

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Generar Reporte por Rango de Edad
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {isJefeCalle() 
            ? `Ingresa el rango de edad para generar el reporte de ${calleNombre}.`
            : 'Ingresa el rango de edad para generar el reporte.'
          }
        </Typography>

        {isJefeCalle() && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Solo puedes ver datos de tu calle asignada: {calleNombre}
          </Alert>
        )}

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Edad Mínima"
              type="number"
              value={edadMin}
              onChange={(e) => setEdadMin(e.target.value === '' ? '' : Number(e.target.value))}
              inputProps={{ min: 0, max: 120 }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Edad Máxima"
              type="number"
              value={edadMax}
              onChange={(e) => setEdadMax(e.target.value === '' ? '' : Number(e.target.value))}
              inputProps={{ min: 0, max: 120 }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              startIcon={<Search />}
              onClick={handleSearch}
              fullWidth
              disabled={edadMin === '' || edadMax === '' || loadingReporte}
            >
              {loadingReporte ? 'Generando...' : 'Generar Reporte'}
            </Button>
          </Grid>
        </Grid>

        {loadingReporte && <LoadingOverlay open={loadingReporte} message="Generando reporte..." />}

        {buscado && !loadingReporte && (
          <>
            {reporte && reporte.personas ? (
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
                        <Users size={24} />
                      </Avatar>
                      <Box>
                        <Typography variant="h6">Rango de Edad: {reporte.rango}</Typography>
                        {isJefeCalle() && (
                          <Typography variant="body2" color="text.secondary">
                            Datos de {calleNombre}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" gutterBottom>
                      Total de Personas: {reporte.total}
                    </Typography>
                  </CardContent>
                </Card>

                <Typography variant="subtitle1" gutterBottom>
                  Lista de Personas
                </Typography>

                {reporte.personas.length === 0 ? (
                  <EmptyState
                    title="Sin resultados"
                    description={
                      isJefeCalle() 
                        ? `No hay personas registradas en este rango de edad en ${calleNombre}.`
                        : "No hay personas registradas en este rango de edad."
                    }
                    icon={<Users size={80} />}
                  />
                ) : (
                  <List>
                    {reporte.personas.map((persona) => (
                      <Card key={persona.cedula} sx={{ mb: 2 }}>
                        <CardContent sx={{ p: 2 }}>
                          <ListItem disablePadding>
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: 'primary.light' }}>
                                <User size={20} />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={persona.nombre_apellido}
                              secondary={
                                <>
                                  <Typography component="span" variant="body2" color="text.primary">
                                    {persona.edad} años
                                  </Typography>
                                  {` — Cédula: ${persona.cedula}`}
                                  <br />
                                  {`Calle: ${persona.calle || persona.nom_calle || 'No especificada'}`}
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
                description="No se pudo generar el reporte para el rango de edad seleccionado."
                icon={<FileText size={80} />}
              />
            )}
          </>
        )}
      </Paper>
    </Box>
  );
};

export default ReporteRangoEdad;