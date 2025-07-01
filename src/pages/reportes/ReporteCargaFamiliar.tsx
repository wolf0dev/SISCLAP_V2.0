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
  Autocomplete,
  CircularProgress,
  IconButton,
  Tooltip,
  Modal,
  Alert,
} from '@mui/material';
import { Search, FileText, Download, User, Users } from 'lucide-react';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { useAuth } from '../../contexts/AuthContext';
import { reporteService, ReporteGeneral } from '../../services/reporteService';
import { calleService } from '../../services/calleService';
import PageHeader from '../../components/common/PageHeader';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import EmptyState from '../../components/common/EmptyState';

const ReporteCargaFamiliar: React.FC = () => {
  const { showSnackbar } = useSnackbar();
  const { isLiderComunidad, isJefeCalle, getUserCalle, canAccessGeneralReports } = useAuth();
  const [beneficiarios, setBeneficiarios] = useState<ReporteGeneral[]>([]);
  const [selectedBeneficiario, setSelectedBeneficiario] = useState<ReporteGeneral | null>(null);
  const [reporte, setReporte] = useState<ReporteGeneral | null>(null);
  const [loadingBeneficiarios, setLoadingBeneficiarios] = useState(false);
  const [loadingReporte, setLoadingReporte] = useState(false);
  const [buscado, setBuscado] = useState(false);
  const [openModal, setOpenModal] = useState(false);
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
    if (!selectedBeneficiario) {
      showSnackbar('Selecciona un beneficiario', 'warning');
      return;
    }

    setLoadingReporte(true);
    setBuscado(true);
    try {
      const data = await reporteService.getCargaFamiliar(selectedBeneficiario.beneficiario.cedula);
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
    if (!reporte) return;

    const data = [reporte];
    reporteService.exportToExcel(data, 'Reporte_Carga_Familiar');
    showSnackbar('Reporte exportado a Excel exitosamente', 'success');
  };

  const handleExportPDF = () => {
    if (!reporte) return;

    const data = [reporte];
    const columns = [
      'cedula',
      'nombre_apellido',
      'profesion',
      'fecha_nacimiento',
      'grado_instruccion',
      'enfermedad_cronica',
      'discapacidad',
      'genero',
      'telefono',
      'numero_casa',
      'estado_civil',
      'Rol'
    ];
    const title = `Carga Familiar de ${reporte.beneficiario.nombre_apellido}`;

    reporteService.exportToPDF(data, columns, title, 'Reporte_Carga_Familiar');
    showSnackbar('Reporte exportado a PDF exitosamente', 'success');
  };

  const handleInputChange = async (event: React.SyntheticEvent, value: string) => {
    if (value.length < 3) return;

    setLoadingBeneficiarios(true);
    try {
      let data: ReporteGeneral[];
      
      if (isLiderComunidad()) {
        // Líder de comunidad ve todos los beneficiarios
        data = await reporteService.getReporteGeneral();
      } else if (isJefeCalle()) {
        // Jefe de calle solo ve beneficiarios de su calle
        const userCalle = getUserCalle();
        if (userCalle) {
          data = await reporteService.getReporteGeneralByCalle(userCalle);
        } else {
          data = [];
          showSnackbar('No se pudo determinar tu calle asignada', 'error');
        }
      } else {
        data = [];
        showSnackbar('No tienes permisos para ver beneficiarios', 'error');
      }

      // Los datos ya vienen filtrados por beneficiarios activos desde el servicio
      
      // Filtrar por término de búsqueda
      const searchFilteredBeneficiarios = data.filter(
        (b: ReporteGeneral) =>
          b.beneficiario.cedula.includes(value) ||
          b.beneficiario.nombre_apellido.toLowerCase().includes(value.toLowerCase())
      );
      
      setBeneficiarios(searchFilteredBeneficiarios);
    } catch (error) {
      console.error('Error al obtener beneficiarios:', error);
      showSnackbar('Error al cargar los beneficiarios', 'error');
    } finally {
      setLoadingBeneficiarios(false);
    }
  };

  const handleReporteGeneral = async () => {
    if (!canAccessGeneralReports() && !isJefeCalle()) {
      showSnackbar('No tienes permisos para generar reportes generales', 'error');
      return;
    }
    setOpenModal(true);
  };

  const handleConfirmReporteGeneral = async () => {
    setOpenModal(false);
    setLoadingReporte(true);
    try {
      let data: ReporteGeneral[];
      
      if (isLiderComunidad()) {
        // Líder de comunidad ve todos los beneficiarios
        data = await reporteService.getReporteGeneral();
      } else if (isJefeCalle()) {
        // Jefe de calle solo ve beneficiarios de su calle
        const userCalle = getUserCalle();
        if (userCalle) {
          data = await reporteService.getReporteGeneralByCalle(userCalle);
        } else {
          data = [];
          showSnackbar('No se pudo determinar tu calle asignada', 'error');
        }
      } else {
        data = [];
        showSnackbar('No tienes permisos para generar reportes', 'error');
      }

      if (data && data.length > 0) {
        const fileName = isJefeCalle() ? `Reporte_General_${calleNombre?.replace(/\s+/g, '_') || 'Mi_Calle'}` : 'Reporte_General_Beneficiarios';
        reporteService.exportToExcel(data, fileName);
        showSnackbar('Reporte general exportado a Excel exitosamente', 'success');
      } else {
        showSnackbar('No hay datos para exportar', 'warning');
      }
    } catch (error) {
      console.error('Error al generar reporte general:', error);
      showSnackbar('Error al generar el reporte general', 'error');
    } finally {
      setLoadingReporte(false);
    }
  };

  const getReporteGeneralButtonText = () => {
    if (isLiderComunidad()) {
      return 'Reporte General - Todas las Calles';
    } else if (isJefeCalle()) {
      return `Reporte General - ${calleNombre || 'Mi Calle'}`;
    }
    return 'Reporte General';
  };

  const getPageTitle = () => {
    if (isJefeCalle()) {
      return `Reporte de Carga Familiar - ${calleNombre || 'Mi Calle'}`;
    }
    return 'Reporte de Carga Familiar';
  };

  return (
    <Box>
      <PageHeader
        title={getPageTitle()}
        breadcrumbs={[
          { label: 'Inicio', path: '/dashboard' },
          { label: 'Reportes', path: '/dashboard/reportes/carga-familiar' },
          { label: 'Carga Familiar' },
        ]}
      />

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Generar Reporte de Carga Familiar
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {isJefeCalle() 
            ? `Selecciona un beneficiario de ${calleNombre} para generar el reporte de su carga familiar.`
            : 'Selecciona un beneficiario para generar el reporte de su carga familiar.'
          }
        </Typography>

        {isJefeCalle() && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Solo puedes ver beneficiarios de tu calle asignada: {calleNombre}
          </Alert>
        )}

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Autocomplete
              id="beneficiario"
              options={beneficiarios}
              getOptionLabel={(option) => `${option.beneficiario.nombre_apellido} (${option.beneficiario.cedula})`}
              value={selectedBeneficiario}
              onChange={(_, newValue) => {
                setSelectedBeneficiario(newValue);
              }}
              onInputChange={handleInputChange}
              loading={loadingBeneficiarios}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Buscar Beneficiario"
                  placeholder="Ingresa nombre o cédula"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingBeneficiarios ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              startIcon={<Search />}
              onClick={handleSearch}
              fullWidth
              disabled={!selectedBeneficiario || loadingReporte}
            >
              {loadingReporte ? 'Generando...' : 'Generar Reporte'}
            </Button>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          color="secondary"
          startIcon={<FileText />}
          onClick={handleReporteGeneral}
          fullWidth
          sx={{ mt: 2 }}
          disabled={!canAccessGeneralReports() && !isJefeCalle()}
        >
          {getReporteGeneralButtonText()}
        </Button>

        {loadingReporte && <LoadingOverlay open={loadingReporte} message="Generando reporte..." />}

        {buscado && !loadingReporte && (
          <>
            {reporte ? (
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
                        <User size={24} />
                      </Avatar>
                      <Box>
                        <Typography variant="h6">
                          {reporte.beneficiario.nombre_apellido}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Cédula: {reporte.beneficiario.cedula}
                        </Typography>
                      </Box>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" gutterBottom>
                      Dependientes: {reporte.dependientes ? reporte.dependientes.length : 0}
                    </Typography>
                  </CardContent>
                </Card>

                <Typography variant="subtitle1" gutterBottom>
                  Lista de Dependientes
                </Typography>

                {!reporte.dependientes || reporte.dependientes.length === 0 ? (
                  <EmptyState
                    title="Sin dependientes"
                    description="Este beneficiario no tiene dependientes registrados."
                    icon={<Users size={80} />}
                  />
                ) : (
                  <List>
                    {reporte.dependientes.map((dependiente) => (
                      <Card key={dependiente.cedula} sx={{ mb: 2 }}>
                        <CardContent sx={{ p: 2 }}>
                          <ListItem disablePadding>
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: 'primary.light' }}>
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
                )}
              </Box>
            ) : (
              <EmptyState
                title="No se encontraron resultados"
                description="No se pudo generar el reporte para el beneficiario seleccionado."
                icon={<FileText size={80} />}
              />
            )}
          </>
        )}
      </Paper>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: 400, 
          bgcolor: 'background.paper', 
          border: '2px solid #000', 
          boxShadow: 24, 
          p: 4 
        }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Aviso
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {isLiderComunidad() 
              ? 'A continuación se generará su reporte general de beneficiarios y sus dependientes de la comunidad Brisas del Orinoco II.'
              : `A continuación se generará el reporte de beneficiarios y sus dependientes de ${calleNombre}.`
            }
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
            <Button onClick={handleConfirmReporteGeneral} variant="contained" color="primary">
              Aceptar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ReporteCargaFamiliar;