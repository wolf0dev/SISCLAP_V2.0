import React from 'react';
import { Box } from '@mui/material';
import { useBeneficiarioFormContext } from './BeneficiarioFormLogic';
import PageHeader from '../../common/PageHeader';
import LoadingOverlay from '../../common/LoadingOverlay';
import { PersonalInfoSection } from './components/PersonalInfoSection';
import { ProfessionalInfoSection } from './components/ProfessionalInfoSection';
import { LocationInfoSection } from './components/LocationInfoSection';
import { DependentsSection } from './components/DependentsSection';
import { FormActions } from './components/FormActions';

export const BeneficiarioFormView: React.FC = () => {
  const { initialLoading, isEditing } = useBeneficiarioFormContext();

  if (initialLoading) {
    return <LoadingOverlay open={initialLoading} message="Cargando datos del beneficiario..." />;
  }

  return (
    <Box>
      <PageHeader
        title={isEditing ? 'Editar Beneficiario' : 'Nuevo Beneficiario'}
        breadcrumbs={[
          { label: 'Inicio', path: '/dashboard' },
          { label: 'Beneficiarios', path: '/dashboard/beneficiarios' },
          { label: isEditing ? 'Editar' : 'Nuevo' },
        ]}
      />

      <Box component="form" onSubmit={(e) => e.preventDefault()}>
        <PersonalInfoSection />
        <ProfessionalInfoSection />
        <LocationInfoSection />
        {!isEditing && <DependentsSection />}
        <FormActions />
      </Box>
    </Box>
  );
};