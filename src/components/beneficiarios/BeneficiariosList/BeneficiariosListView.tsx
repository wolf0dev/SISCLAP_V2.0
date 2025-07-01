import React from 'react';
import { Box } from '@mui/material';
import { UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useBeneficiariosListContext } from './BeneficiariosListLogic';
import PageHeader from '../../common/PageHeader';
import { BeneficiariosSearchBar } from './components/BeneficiariosSearchBar';
import { BeneficiariosTable } from './components/BeneficiariosTable';
import { BeneficiariosActionMenu } from './components/BeneficiariosActionMenu';
import { BeneficiariosConfirmDialog } from './components/BeneficiariosConfirmDialog';
import LoadingOverlay from '../../common/LoadingOverlay';
import EmptyState from '../../common/EmptyState';

export const BeneficiariosListView: React.FC = () => {
  const navigate = useNavigate();
  const { isJefeCalle } = useAuth();
  const {
    loading,
    filteredBeneficiarios,
    getPageTitle,
  } = useBeneficiariosListContext();

  if (loading) {
    return <LoadingOverlay open={loading} message="Cargando beneficiarios..." />;
  }

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <PageHeader
        title={getPageTitle()}
        breadcrumbs={[
          { label: 'Inicio', path: '/dashboard' },
          { label: 'Beneficiarios' },
        ]}
        action={{
          label: 'Nuevo Beneficiario',
          onClick: () => navigate('/dashboard/beneficiarios/new'),
          icon: <UserPlus size={20} />,
        }}
      />

      <BeneficiariosSearchBar />

      {filteredBeneficiarios.length === 0 ? (
        <EmptyState
          title="No hay beneficiarios registrados"
          description={
            isJefeCalle() 
              ? "No hay beneficiarios registrados en tu calle asignada."
              : "Comienza registrando un nuevo beneficiario en el sistema."
          }
          actionText="Registrar Beneficiario"
          onAction={() => navigate('/dashboard/beneficiarios/new')}
          icon={<UserPlus size={80} />}
        />
      ) : (
        <BeneficiariosTable />
      )}

      <BeneficiariosActionMenu />
      <BeneficiariosConfirmDialog />
    </Box>
  );
};