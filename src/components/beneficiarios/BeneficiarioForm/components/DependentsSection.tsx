import React from 'react';
import {
  Paper,
  Typography,
  Divider,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
} from '@mui/material';
import { useBeneficiarioFormContext } from '../BeneficiarioFormLogic';

export const DependentsSection: React.FC = () => {
  const { tieneDependientes, setTieneDependientes } = useBeneficiarioFormContext();

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Dependientes
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">¿Tiene dependientes?</FormLabel>
            <RadioGroup
              row
              value={tieneDependientes}
              onChange={(e) => setTieneDependientes(e.target.value)}
            >
              <FormControlLabel value="si" control={<Radio />} label="Sí" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>

          {tieneDependientes === 'si' && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Después de guardar el beneficiario, será redirigido a la página de registro de dependientes.
            </Alert>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};