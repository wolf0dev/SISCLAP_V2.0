import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  Divider,
} from '@mui/material';
import { FileText, Download, FileSpreadsheet } from 'lucide-react';
import { useAuth } from '../../security';
import { reporteService, calleService } from '../../domain/services';
import { useNotification } from '../providers/NotificationProvider';
import { Button, PageHeader, LoadingOverlay } from '../components';

const ReporteHabitantesCallePage = () => {
  const { showNotification } = useNotification();
  const { user, isLiderComunidad, isJefeCalle, getUserCalle, getUserCalleNombre } = useAuth();
  const [loading, setLoading] = useState(false);
  const [calles, setCalles] = useState([]);
  const [selectedCalle, setSelectedCalle] = useState('');

  useEffect(() => {
    if (isLiderComunidad()) {
      fetchCalles();
    } else if (isJefeCalle()) {
      // Para jefe de calle, usar su calle asignada
      const userCalle = getUserCalle();
      if (userCalle) {
        setSelectedCalle(userCalle);
      }
    }
  }, [isLiderComunidad, isJefeCalle, getUserCalle]);

  const fetchCalles = async () => {
    try {
      const data = await calleService.getAll();
      setCalles(data);
    } catch (error) {
      console.error('Error al obtener calles:', error);
      showNotification('Error al cargar las calles', 'error');
    }
  };

  const handleGenerateReport = async (format) => {
    if (!selectedCalle && isLiderComunidad()) {
      showNotification('Por favor selecciona una calle', 'warning');
      return;
    }

    setLoading(true);
    try {
      const data = await reporteService.getHabitantesCalle(selectedCalle);
      
      if (!data || data.length === 0) {
        showNotification('No hay datos para generar el reporte', 'warning');
        return;
      }

      const calleNombre = getCalleNombre();
      const fileName = `Habitantes_${calleNombre.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`;

      if (format === 'pdf') {
        reporteService.exportHabitantesToPDF(
          data,
          ['cedula', 'nombre_apellido', 'genero', 'fecha_nacimiento', 'numero_casa'],
          `Habitantes de ${calleNombre}`,
          fileName,
          fileName
        );
      } else if (format === 'excel') {
        reporteService.exportHabitantesToExcel(
          data,
          fileName,
          fileName
        );
      }

      showNotification(`Reporte ${format.toUpperCase()} generado exitosamente`, 'success');
    } catch (error) {
      console.error('Error al generar reporte:', error);
      const errorMessage = error.response?.data?.error || 'Error al generar el reporte';
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const getCalleNombre = () => {
    if (isJefeCalle()) {
      return getUserCalleNombre() || 'Mi Calle';
    }
    if (selectedCalle && calles.length > 0) {
      const calle = calles.find(c => c.id_calle === selectedCalle);
      return calle ? calle.nom_calle : '';
    }
    return '';
  };

  return (
    <Box>
      <PageHeader
        title="Reporte de Habitantes por Calle"
        breadcrumbs={[
          { label: 'Inicio', path: '/dashboard' },
          { label: 'Reportes' },
          { label: 'Habitantes por Calle' },
        ]}
      />

      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <FileText size={24} style={{ marginRight: 8 }} />
          <Typography variant="h6">
            Generar Reporte de Habitantes por Calle
          </Typography>
        </Box>

        {isJefeCalle() && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Solo puedes generar reportes de tu calle asignada: {getUserCalleNombre() || 'Calle no asignada'}
          </Alert>
        )}

        {isLiderComunidad() && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Calle</InputLabel>
                <Select
                  value={selectedCalle}
                  label="Calle"
                  onChange={(e) => setSelectedCalle(e.target.value)}
                >
                  <MenuItem value="">Seleccione una calle</MenuItem>
                  {calles.map((calle) => (
                    <MenuItem key={calle.id_calle} value={calle.id_calle}>
                      {calle.nom_calle}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Opciones de Exportación
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                startIcon={<FileText size={20} />}
                onClick={() => handleGenerateReport('pdf')}
                disabled={loading || (!selectedCalle && isLiderComunidad())}
                fullWidth
                size="large"
              >
                {loading ? 'Generando...' : `Exportar PDF ${getCalleNombre() ? `- ${getCalleNombre()}` : ''}`}
              </Button>
            </Grid>

            <Grid item xs={12} md={6}>
              <Button
                variant="outlined"
                startIcon={<FileSpreadsheet size={20} />}
                onClick={() => handleGenerateReport('excel')}
                disabled={loading || (!selectedCalle && isLiderComunidad())}
                fullWidth
                size="large"
              >
                {loading ? 'Generando...' : `Exportar Excel ${getCalleNombre() ? `- ${getCalleNombre()}` : ''}`}
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="h6" gutterBottom>
            Información del Reporte
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Este reporte incluye todos los habitantes (beneficiarios y dependientes) de la calle seleccionada.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Datos incluidos:</strong> Cédula, Nombre completo, Género, Fecha de nacimiento y Número de casa.
          </Typography>
        </Box>
      </Paper>

      <LoadingOverlay open={loading} message="Generando reporte..." />
    </Box>
  );
};

export default ReporteHabitantesCallePage;