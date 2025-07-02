import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Grid,
  Alert,
  Divider,
} from '@mui/material';
import { FileText, Download, FileSpreadsheet } from 'lucide-react';
import { useAuth } from '../../security';
import { reporteService } from '../../domain/services';
import { useNotification } from '../providers/NotificationProvider';
import { Button, PageHeader, LoadingOverlay } from '../components';

const ReporteRangoEdadPage = () => {
  const { showNotification } = useNotification();
  const { user, isLiderComunidad, isJefeCalle, getUserCalle, getUserCalleNombre } = useAuth();
  const [loading, setLoading] = useState(false);
  const [edadMin, setEdadMin] = useState('');
  const [edadMax, setEdadMax] = useState('');

  const handleGenerateReport = async (format) => {
    if (!edadMin || !edadMax) {
      showNotification('Por favor ingresa el rango de edad', 'warning');
      return;
    }

    if (parseInt(edadMin) > parseInt(edadMax)) {
      showNotification('La edad mínima no puede ser mayor que la máxima', 'warning');
      return;
    }

    setLoading(true);
    try {
      let data;
      
      if (isLiderComunidad()) {
        data = await reporteService.getRangoEdad(edadMin, edadMax);
      } else if (isJefeCalle()) {
        const userCalle = getUserCalle();
        if (userCalle) {
          data = await reporteService.getRangoEdadByCalle(edadMin, edadMax, userCalle);
        } else {
          showNotification('No se pudo determinar tu calle asignada', 'error');
          return;
        }
      } else {
        showNotification('No tienes permisos para generar este reporte', 'error');
        return;
      }
      
      if (!data || !data.personas || data.personas.length === 0) {
        showNotification('No hay datos para el rango de edad especificado', 'warning');
        return;
      }

      const calleInfo = isJefeCalle() ? `_${getUserCalleNombre()?.replace(/\s+/g, '_') || 'Mi_Calle'}` : '';
      const fileName = `Rango_Edad_${edadMin}-${edadMax}${calleInfo}_${new Date().toISOString().split('T')[0]}`;
      const title = `Personas entre ${edadMin} y ${edadMax} años${isJefeCalle() ? ` - ${getUserCalleNombre() || 'Mi Calle'}` : ''}`;

      if (format === 'pdf') {
        reporteService.exportHabitantesToPDF(
          data.personas,
          ['cedula', 'nombre_apellido', 'genero', 'fecha_nacimiento', 'edad', 'numero_casa'],
          title,
          fileName,
          fileName
        );
      } else if (format === 'excel') {
        reporteService.exportHabitantesToExcel(
          data.personas,
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

  return (
    <Box>
      <PageHeader
        title="Reporte por Rango de Edad"
        breadcrumbs={[
          { label: 'Inicio', path: '/dashboard' },
          { label: 'Reportes' },
          { label: 'Rango de Edad' },
        ]}
      />

      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <FileText size={24} style={{ marginRight: 8 }} />
          <Typography variant="h6">
            Generar Reporte por Rango de Edad
          </Typography>
        </Box>

        {isJefeCalle() && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Solo puedes generar reportes de tu calle asignada: {getUserCalleNombre() || 'Calle no asignada'}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Edad Mínima"
              type="number"
              value={edadMin}
              onChange={(e) => setEdadMin(e.target.value)}
              inputProps={{ min: 0, max: 120 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Edad Máxima"
              type="number"
              value={edadMax}
              onChange={(e) => setEdadMax(e.target.value)}
              inputProps={{ min: 0, max: 120 }}
            />
          </Grid>
        </Grid>

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
                disabled={loading || !edadMin || !edadMax}
                fullWidth
                size="large"
              >
                {loading ? 'Generando...' : 'Exportar PDF'}
              </Button>
            </Grid>

            <Grid item xs={12} md={6}>
              <Button
                variant="outlined"
                startIcon={<FileSpreadsheet size={20} />}
                onClick={() => handleGenerateReport('excel')}
                disabled={loading || !edadMin || !edadMax}
                fullWidth
                size="large"
              >
                {loading ? 'Generando...' : 'Exportar Excel'}
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
            Este reporte incluye todas las personas (beneficiarios y dependientes) que se encuentren en el rango de edad especificado.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Datos incluidos:</strong> Cédula, Nombre completo, Género, Fecha de nacimiento, Edad calculada y Número de casa.
          </Typography>
          {isJefeCalle() && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              <strong>Filtro aplicado:</strong> Solo se incluirán personas de tu calle asignada ({getUserCalleNombre() || 'Calle no asignada'}).
            </Typography>
          )}
        </Box>
      </Paper>

      <LoadingOverlay open={loading} message="Generando reporte..." />
    </Box>
  );
};

export default ReporteRangoEdadPage;