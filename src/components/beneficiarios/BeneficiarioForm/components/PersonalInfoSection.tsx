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

export const PersonalInfoSection: React.FC = () => {
  const { formik, loading, isEditing, generos, estadosCiviles } = useBeneficiarioFormContext();

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Información Personal
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="cedula"
            name="cedula"
            label="Cédula"
            value={formik.values.cedula}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.cedula && Boolean(formik.errors.cedula)}
            helperText={formik.touched.cedula && formik.errors.cedula}
            disabled={isEditing || loading}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="nombre_apellido"
            name="nombre_apellido"
            label="Nombre y Apellido"
            value={formik.values.nombre_apellido}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.nombre_apellido && Boolean(formik.errors.nombre_apellido)}
            helperText={formik.touched.nombre_apellido && formik.errors.nombre_apellido}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="fecha_nacimiento"
            name="fecha_nacimiento"
            label="Fecha de Nacimiento"
            type="date"
            value={formik.values.fecha_nacimiento}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.fecha_nacimiento && Boolean(formik.errors.fecha_nacimiento)}
            helperText={formik.touched.fecha_nacimiento && formik.errors.fecha_nacimiento}
            InputLabelProps={{ shrink: true }}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl
            fullWidth
            error={formik.touched.genero && Boolean(formik.errors.genero)}
            disabled={loading}
          >
            <InputLabel id="genero-label">Género</InputLabel>
            <Select
              labelId="genero-label"
              id="genero"
              name="genero"
              value={formik.values.genero}
              label="Género"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <MenuItem value="" disabled>
                Seleccione un género
              </MenuItem>
              {generos.map((genero) => (
                <MenuItem key={genero} value={genero}>
                  {genero}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.genero && formik.errors.genero && (
              <FormHelperText>{formik.errors.genero}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl
            fullWidth
            error={formik.touched.estado_civil && Boolean(formik.errors.estado_civil)}
            disabled={loading}
          >
            <InputLabel id="estado-civil-label">Estado Civil</InputLabel>
            <Select
              labelId="estado-civil-label"
              id="estado_civil"
              name="estado_civil"
              value={formik.values.estado_civil}
              label="Estado Civil"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <MenuItem value="" disabled>
                Seleccione un estado civil
              </MenuItem>
              {estadosCiviles.map((estado) => (
                <MenuItem key={estado} value={estado}>
                  {estado}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.estado_civil && formik.errors.estado_civil && (
              <FormHelperText>{formik.errors.estado_civil}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="telefono"
            name="telefono"
            label="Teléfono"
            value={formik.values.telefono}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.telefono && Boolean(formik.errors.telefono)}
            helperText={formik.touched.telefono && formik.errors.telefono}
            disabled={loading}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};