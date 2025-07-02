import React from 'react';
import { Box, Paper, TextField, InputAdornment, Button, Typography } from '@mui/material';
import { Search, RefreshCw } from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';
import { useBeneficiariosListContext } from '../BeneficiariosListLogic';

export const BeneficiariosSearchBar: React.FC = () => {
  const { isJefeCalle } = useAuth();
  const { searchTerm, setSearchTerm, fetchBeneficiarios } = useBeneficiariosListContext();

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 4, width: '100%', overflow: 'hidden' }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' }, 
        mb: 3,
        gap: { xs: 2, sm: 0 }
      }}>
        <TextField
          placeholder="Buscar beneficiario..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ 
            width: { xs: '100%', sm: 300 },
            maxWidth: '100%'
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="outlined"
          startIcon={<RefreshCw size={20} />}
          onClick={fetchBeneficiarios}
          sx={{ 
            flexShrink: 0,
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }}
        >
          Actualizar
        </Button>
      </Box>

      {isJefeCalle() && (
        <Box sx={{ mb: 2 }}>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            Mostrando beneficiarios de tu calle asignada
          </Typography>
        </Box>
      )}
    </Paper>
  );
};