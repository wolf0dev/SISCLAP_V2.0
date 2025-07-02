import React from 'react';
import { Box, Typography, List } from '@mui/material';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDependientesListContext } from '../DependientesListLogic';
import LoadingOverlay from '../../../common/LoadingOverlay';
import EmptyState from '../../../common/EmptyState';
import { DependienteCard } from './DependienteCard';

export const DependientesResultsSection: React.FC = () => {
  const navigate = useNavigate();
  const { 
    dependientes, 
    loading, 
    searched, 
    cedulaBeneficiario,
    handleDeleteDependiente 
  } = useDependientesListContext();

  if (loading) {
    return <LoadingOverlay open={loading} message="Buscando dependientes..." />;
  }

  if (!searched) {
    return null;
  }

  if (dependientes.length === 0) {
    return (
      <EmptyState
        title="No se encontraron dependientes"
        description="No hay dependientes registrados para este beneficiario."
        actionText="Registrar Dependiente"
        onAction={() => navigate(`/dashboard/dependientes/new?beneficiario=${cedulaBeneficiario}`)}
        icon={<Users size={80} />}
      />
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Dependientes Encontrados
      </Typography>
      <List>
        {dependientes.map((dependiente) => (
          <DependienteCard
            key={dependiente.cedula}
            dependiente={dependiente}
            onDelete={handleDeleteDependiente}
          />
        ))}
      </List>
    </Box>
  );
};