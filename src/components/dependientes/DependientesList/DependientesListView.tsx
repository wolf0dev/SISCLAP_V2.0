import React from 'react';
import { Box } from '@mui/material';
import { UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDependientesListContext } from './DependientesListLogic';
import PageHeader from '../../common/PageHeader';
import { DependientesSearchSection } from './components/DependientesSearchSection';
import { DependientesResultsSection } from './components/DependientesResultsSection';
import { DependientesConfirmDialog } from './components/DependientesConfirmDialog';

export const DependientesListView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <PageHeader
        title="Dependientes"
        breadcrumbs={[
          { label: 'Inicio', path: '/dashboard' },
          { label: 'Dependientes' },
        ]}
        action={{
          label: 'Nuevo Dependiente',
          onClick: () => navigate('/dashboard/dependientes/new'),
          icon: <UserPlus size={20} />,
        }}
      />

      <DependientesSearchSection />
      <DependientesResultsSection />
      <DependientesConfirmDialog />
    </Box>
  );
};