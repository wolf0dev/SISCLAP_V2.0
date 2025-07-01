import React from 'react';
import ConfirmDialog from '../../../common/ConfirmDialog';
import { useBeneficiariosListContext } from '../BeneficiariosListLogic';

export const BeneficiariosConfirmDialog: React.FC = () => {
  const {
    confirmDialogOpen,
    selectedBeneficiario,
    confirmDisable,
    setConfirmDialogOpen,
  } = useBeneficiariosListContext();

  return (
    <ConfirmDialog
      open={confirmDialogOpen}
      title="Deshabilitar Beneficiario"
      message={`¿Estás seguro de que deseas deshabilitar al beneficiario ${selectedBeneficiario?.nombre_apellido}?`}
      confirmText="Deshabilitar"
      cancelText="Cancelar"
      onConfirm={confirmDisable}
      onCancel={() => setConfirmDialogOpen(false)}
      severity="warning"
    />
  );
};