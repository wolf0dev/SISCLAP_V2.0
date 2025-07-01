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
  CircularProgress,
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material';
import { Search, FileText, Download, User, MapPin } from 'lucide-react';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { useAuth } from '../../contexts/AuthContext';
import { reporteService, ReporteVenta as ReporteVentaType } from '../../services/reporteService';
import { calleService, Calle } from '../../services/calleService';
import PageHeader from '../../components/common/PageHeader';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import EmptyState from '../../components/common/EmptyState';

const ReporteDeVenta: React.FC = () => {
  const { showSnackbar } = useSnackbar();
  const { isLiderComunidad, isJefeCalle, getUserCalle } = useAuth();
  const [selectedCalle, setSelectedCalle] = useState<number | ''>('');
  const [selectedTipoVenta, setSelectedTipoVenta] = useState<'GAS' | 'CLAP'>('CLAP');
  const [reporte, setReporte] = useState<ReporteVentaType | null>(null);
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
    
    // Preparar datos para Excel
    const data = reporte.habitantes.map((hab) => ({
      Calle: calleNombre,
      Cedula: hab.cedula,
      Nombre: hab.nombre_apellido,
      Numero_Casa: hab.numero_casa,
      ...(selectedTipoVenta === 'CLAP' ? {
        Cantidad_Beneficios: hab.cantidad_beneficios || '',
        Referencia_Pago: hab.referencia_pago || '',
        Firma: hab.firma || '',
      } : {
        Capacidad_Cilindro: hab.capacidad_cilindro || '',
        Cantidad: hab.cantidad || '',
        Referencia: hab.referencia || '',
        Firma: hab.firma || '',
      }),
    }));

    reporteService.exportHabitantesToExcel(data, 'Reporte_Venta', calleNombre);
    showSnackbar('Reporte exportado a Excel exitosamente', 'success');
  };

  const handleExportPDF = () => {
    if (!reporte || !reporte.habitantes) return;
    
    // Preparar datos para PDF
    const data = reporte.habitantes.map((hab) => ({
      cedula: hab.cedula,
      nombre: hab.nombre_apellido,
      numero_casa: hab.numero_casa,
      ...(selectedTipoVenta === 'CLAP' ? {
        cantidad_beneficios: hab.cantidad_beneficios || '',
        referencia_pago: hab.referencia_pago || '',
        firma: hab.firma || '',
      } : {
        capacidad_cilindro: hab.capacidad_cilindro || '',
        cantidad: hab.cantidad || '',
        referencia: hab.referencia || '',
        firma: hab.firma || '',
      }),
    }));

    const columns = selectedTipoVenta === 'CLAP'
      ? ['cedula', 'nombre', 'numero_casa', 'cantidad_beneficios', 'referencia_pago', 'firma']
      : ['cedula', 'nombre', 'numero_casa', 'capacidad_cilindro', 'cantidad', 'referencia', 'firma'];
    const title = `Habitantes de ${calleNombre}`;

    reporteService.exportHabitantesToPDF(data, columns, title, 'Reporte_Venta', calleNombre);
    showSnackbar('Reporte exportado a PDF exitosamente', 'success');
  };

  const handleReporteGeneral = async () => {
    setLoadingReporte(true);
    try {
      const data = await reporteService.getHabitantesCallesGeneral();
      reporteService.exportToPDFGeneral(data, selectedTipoVenta);
      showSnackbar('Reporte general exportado a PDF exitosamente', 'success');
    } catch (error) {
      console.error('Error al obtener reporte general:', error);
      showSnackbar('Error al generar el reporte general', 'error');
    } finally {
      setLoadingReporte(false);
    }
  };

  const getPageTitle = () => {
    if (isJefeCalle()) {
      return `Reporte de Venta - ${calleNombre || 'Mi Calle'}`;
    }
    return 'Reporte de Venta';
  };

  return (
    <Box>
      <PageHeader
        title={getPageTitle()}
        breadcrumbs={[
          { label: 'Inicio', path: '/dashboard' },
          { label: 'Reportes', path: '/dashboard/reportes/venta' },
          { label: 'Venta por Calle' },
        ]}
      />

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Generar Reporte de Venta por Calle
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {isJefeCalle() 
            ? `Selecciona el tipo de venta para generar el reporte de ${calleNombre}.`
            : 'Selecciona una calle y el tipo de venta para generar el reporte de ventas.'
          }
        </Typography>

        {isJefeCalle() && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Solo puedes generar reportes de tu calle asignada: {calleNombre}
          </Alert>
        )}

        <Grid container spacing={2} alignItems="center">
          {isLiderComunidad() && (
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="calle-label">Seleccionar Calle</InputLabel>
                <Select
                  labelId="calle-label"
                  id="calle"
                  value={selectedCalle}
                  label="Seleccionar Calle"
                  onChange={(e) => setSelectedCalle(e.target.value as number)}
                  disabled={loadingCalles}
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
          )}
          
          <Grid item xs={12} md={isLiderComunidad() ? 6 : 6}>
            <FormControl fullWidth>
              <InputLabel id="tipo-venta-label">Tipo de Venta</InputLabel>
              <Select
                labelId="tipo-venta-label"
                id="tipo-venta"
                value={selectedTipoVenta}
                label="Tipo de Venta"
                onChange={(e) => setSelectedTipoVenta(e.target.value as 'GAS' | 'CLAP')}
              >
                <MenuItem value="CLAP">CLAP</MenuItem>
                <MenuItem value="GAS">GAS</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={isLiderComunidad() ? 6 : 6}>
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
          
          {/* Solo mostrar el botón de reporte general para líderes de comunidad */}
          {isLiderComunidad() && (
            <Grid item xs={12} md={6}>
              <Button
                variant="outlined"
                startIcon={<FileText />}
                onClick={handleReporteGeneral}
                fullWidth
                disabled={loadingReporte}
              >
                Reporte General
              </Button>
            </Grid>
          )}
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
                                  <Typography component="span" variant="body2" color="text.secondary">
                                    <br />
                                    {selectedTipoVenta === 'CLAP' ? (
                                      <>
                                        Cantidad de Beneficios: {habitante.cantidad_beneficios || ''}
                                        <br />Referencia de Pago: {habitante.referencia_pago || ''}
                                        <br />Firma: {habitante.firma || ''}
                                      </>
                                    ) : (
                                      <>
                                        Capacidad del Cilindro: {habitante.capacidad_cilindro || ''}
                                        <br />Cantidad: {habitante.cantidad || ''}
                                        <br />Referencia: {habitante.referencia || ''}
                                        <br />Firma: {habitante.firma || ''}
                                      </>
                                    )}
                                  </Typography>
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

export default ReporteDeVenta;