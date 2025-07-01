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
import { FileText, Download } from 'lucide-react';
import { useAuth } from '../../security';
import { reporteService, calleService } from '../../domain/services';
import { useNotification } from '../providers/NotificationProvider';
import { Button, PageHeader, LoadingOverlay } from '../components';

const ReporteVentasPage = () => {
  const { showNotification } = useNotification();
  const { user, isLiderComunidad, isJefeCalle, getUserCalle, getUserCalleNombre } = useAuth();
  const [loading, setLoading] = useState(false);
  const [calles, setCalles] = useState([]);
  const [selectedCalle, setSelectedCalle] = useState('');
  const [tipoVenta, setTipoVenta] = useState('CLAP');

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

  const handleGenerateReport = async () => {
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

      // Generar PDF con formato de venta
      reporteService.exportHabitantesToPDF(
        data,
        tipoVenta === 'CLAP'
          ? ['Cédula', 'Nombre', 'Casa', 'Cant. Beneficios', 'Ref. Pago', 'Firma']
          : ['Cédula', 'Nombre', 'Casa', 'Cap. Cilindro', 'Cantidad', 'Referencia', 'Firma'],
        `Reporte de Venta ${tipoVenta}`,
        `Reporte_Venta_${tipoVenta}`,
        `Reporte_Venta_${tipoVenta}_${new Date().toISOString().split('T')[0]}`
      );

      showNotification('Reporte generado exitosamente', 'success');
    } catch (error) {
      console.error('Error al generar reporte:', error);
      const errorMessage = error.response?.data?.error || 'Error al generar el reporte';
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateGeneralReport = async () => {
    if (!isLiderComunidad()) {
      showNotification('No tienes permisos para generar reportes generales', 'error');
      return;
    }

    setLoading(true);
    try {
      const data = await reporteService.getHabitantesCallesGeneral();
      
      if (!data || data.length === 0) {
        showNotification('No hay datos para generar el reporte general', 'warning');
        return;
      }

      // Generar PDF general con todas las calles
      reporteService.exportToPDFGeneral(data, tipoVenta);

      showNotification('Reporte general generado exitosamente', 'success');
    } catch (error) {
      console.error('Error al generar reporte general:', error);
      const errorMessage = error.response?.data?.error || 'Error al generar el reporte general';
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
        title="Reporte de Ventas"
        breadcrumbs={[
          { label: 'Inicio', path: '/dashboard' },
          { label: 'Reportes' },
          { label: 'Reporte de Ventas' },
        ]}
      />

      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <FileText size={24} style={{ marginRight: 8 }} />
          <Typography variant="h6">
            Generar Reporte de Ventas
          </Typography>
        </Box>

        {isJefeCalle() && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Solo puedes generar reportes de tu calle asignada: {getUserCalleNombre() || 'Calle no asignada'}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Venta</InputLabel>
              <Select
                value={tipoVenta}
                label="Tipo de Venta"
                onChange={(e) => setTipoVenta(e.target.value)}
              >
                <MenuItem value="CLAP">CLAP</MenuItem>
                <MenuItem value="GAS">Gas</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {isLiderComunidad() && (
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
          )}
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Opciones de Reporte
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                startIcon={<Download size={20} />}
                onClick={handleGenerateReport}
                disabled={loading || (!selectedCalle && isLiderComunidad())}
                fullWidth
                size="large"
              >
                {loading ? 'Generando...' : `Generar Reporte ${getCalleNombre() ? `- ${getCalleNombre()}` : ''}`}
              </Button>
            </Grid>

            {isLiderComunidad() && (
              <Grid item xs={12} md={6}>
                <Button
                  variant="outlined"
                  startIcon={<Download size={20} />}
                  onClick={handleGenerateGeneralReport}
                  disabled={loading}
                  fullWidth
                  size="large"
                >
                  {loading ? 'Generando...' : 'Generar Reporte General (Todas las Calles)'}
                </Button>
              </Grid>
            )}
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="h6" gutterBottom>
            Información del Reporte
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Este reporte genera un formato específico para el control de ventas de {tipoVenta}.
          </Typography>
          
          {tipoVenta === 'CLAP' ? (
            <Typography variant="body2" color="text.secondary">
              <strong>Formato CLAP:</strong> Incluye campos para Cédula, Nombre, Casa, Cantidad de Beneficios, Referencia de Pago y Firma.
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              <strong>Formato Gas:</strong> Incluye campos para Cédula, Nombre, Casa, Capacidad del Cilindro, Cantidad, Referencia y Firma.
            </Typography>
          )}
        </Box>
      </Paper>

      <LoadingOverlay open={loading} message="Generando reporte..." />
    </Box>
  );
};

export default ReporteVentasPage;