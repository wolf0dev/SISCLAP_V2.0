import React from 'react';
import {
  Paper,
  Typography,
  Divider,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { useBeneficiarioFormContext } from '../BeneficiarioFormLogic';

export const LocationInfoSection: React.FC = () => {
  const { formik, loading, calles } = useBeneficiarioFormContext();

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Información de Ubicación
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <FormControl
            fullWidth
            error={formik.touched.id_calle && Boolean(formik.errors.id_calle)}
            disabled={loading}
          >
            <InputLabel id="calle-label">Calle</InputLabel>
            <Select
              labelId="calle-label"
              id="id_calle"
              name="id_calle"
              value={formik.values.id_calle}
              label="Calle"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <MenuItem value={0} disabled>
                Seleccione una calle
              </MenuItem>
              {calles.map((calle) => (
                <MenuItem key={calle.id_calle} value={calle.id_calle}>
                  {calle.nom_calle}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.id_calle && formik.errors.id_calle && (
              <FormHelperText>{formik.errors.id_calle}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="numero_casa"
            name="numero_casa"
            label="Número de Casa"
            value={formik.values.numero_casa}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.numero_casa && Boolean(formik.errors.numero_casa)}
            helperText={formik.touched.numero_casa && formik.errors.numero_casa}
            disabled={loading}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};