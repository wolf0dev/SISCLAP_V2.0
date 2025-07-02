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

export const ProfessionalInfoSection: React.FC = () => {
  const { formik, loading, gradosInstruccion } = useBeneficiarioFormContext();

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Información Profesional
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="profesion"
            name="profesion"
            label="Profesión"
            value={formik.values.profesion}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.profesion && Boolean(formik.errors.profesion)}
            helperText={formik.touched.profesion && formik.errors.profesion}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl
            fullWidth
            error={formik.touched.grado_instruccion && Boolean(formik.errors.grado_instruccion)}
            disabled={loading}
          >
            <InputLabel id="grado-instruccion-label">Grado de Instrucción</InputLabel>
            <Select
              labelId="grado-instruccion-label"
              id="grado_instruccion"
              name="grado_instruccion"
              value={formik.values.grado_instruccion}
              label="Grado de Instrucción"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <MenuItem value="" disabled>
                Seleccione un grado de instrucción
              </MenuItem>
              {gradosInstruccion.map((grado) => (
                <MenuItem key={grado} value={grado}>
                  {grado}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.grado_instruccion && formik.errors.grado_instruccion && (
              <FormHelperText>{formik.errors.grado_instruccion}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="enfermedad_cronica"
            name="enfermedad_cronica"
            label="Enfermedad Crónica"
            value={formik.values.enfermedad_cronica}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.enfermedad_cronica && Boolean(formik.errors.enfermedad_cronica)}
            helperText={formik.touched.enfermedad_cronica && formik.errors.enfermedad_cronica}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="discapacidad"
            name="discapacidad"
            label="Discapacidad"
            value={formik.values.discapacidad}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.discapacidad && Boolean(formik.errors.discapacidad)}
            helperText={formik.touched.discapacidad && formik.errors.discapacidad}
            disabled={loading}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};