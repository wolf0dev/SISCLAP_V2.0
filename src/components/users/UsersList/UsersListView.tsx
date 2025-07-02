import React from 'react';
import { Box } from '@mui/material';
import { UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useUsersListContext } from './UsersListLogic';
import PageHeader from '../../common/PageHeader';
import { UsersSearchBar } from './components/UsersSearchBar';
import { UsersTable } from './components/UsersTable';
import { UsersActionMenu } from './components/UsersActionMenu';
import { UsersConfirmDialog } from './components/UsersConfirmDialog';
import LoadingOverlay from '../../common/LoadingOverlay';
import EmptyState from '../../common/EmptyState';

export const UsersListView: React.FC = () => {
  const navigate = useNavigate();
  const { isLiderComunidad } = useAuth();
  const { loading, users } = useUsersListContext();

  if (!isLiderComunidad()) {
    return null;
  }

  if (loading) {
    return <LoadingOverlay open={loading} message="Cargando usuarios..." />;
  }

  return (
    <Box>
      <PageHeader
        title="Gestión de Usuarios"
        breadcrumbs={[
          { label: 'Inicio', path: '/dashboard' },
          { label: 'Usuarios' },
        ]}
        action={{
          label: 'Nuevo Usuario',
          onClick: () => navigate('/dashboard/users/new'),
          icon: <UserPlus size={20} />,
        }}
      />

      <UsersSearchBar />

      {users.length === 0 ? (
        <EmptyState
          title="No hay usuarios registrados"
          description="Comienza registrando un nuevo usuario en el sistema."
          actionText="Registrar Usuario"
          onAction={() => navigate('/dashboard/users/new')}
          icon={<UserPlus size={80} />}
        />
      ) : (
        <UsersTable />
      )}

      <UsersActionMenu />
      <UsersConfirmDialog />
    </Box>
  );
};