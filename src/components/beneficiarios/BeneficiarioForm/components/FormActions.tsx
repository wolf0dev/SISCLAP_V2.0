import React from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { ArrowLeft, Save } from 'lucide-react';
import { useBeneficiarioFormContext } from '../BeneficiarioFormLogic';

export const FormActions: React.FC = () => {
  const { loading, handleSubmit, handleCancel } = useBeneficiarioFormContext();

  return (
    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
      <Button
        variant="outlined"
        startIcon={<ArrowLeft size={20} />}
        onClick={handleCancel}
        disabled={loading}
      >
        Volver
      </Button>
      <Button
        variant="contained"
        startIcon={loading ? <CircularProgress size={20} /> : <Save size={20} />}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Guardando...' : 'Guardar'}
      </Button>
    </Box>
  );
};