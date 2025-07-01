import React from 'react';
import { Paper, Typography, Grid, TextField, Button, InputAdornment } from '@mui/material';
import { Search } from 'lucide-react';
import { useDependientesListContext } from '../DependientesListLogic';

export const DependientesSearchSection: React.FC = () => {
  const { cedulaBeneficiario, setCedulaBeneficiario, handleSearch, loading } = useDependientesListContext();

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Buscar Dependientes por Beneficiario
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Ingrese la cédula del beneficiario para ver sus dependientes.
      </Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            label="Cédula del Beneficiario"
            value={cedulaBeneficiario}
            onChange={(e) => setCedulaBeneficiario(e.target.value)}
            placeholder="Ingrese la cédula del beneficiario"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleSearch}
            disabled={loading}
          >
            Buscar Dependientes
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};