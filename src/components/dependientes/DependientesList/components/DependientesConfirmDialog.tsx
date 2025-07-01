import React from 'react';
import ConfirmDialog from '../../../common/ConfirmDialog';
import { useDependientesListContext } from '../DependientesListLogic';

export const DependientesConfirmDialog: React.FC = () => {
  const {
    confirmDialogOpen,
    selectedDependiente,
    confirmDeleteDependiente,
    setConfirmDialogOpen,
  } = useDependientesListContext();

  return (
    <ConfirmDialog
      open={confirmDialogOpen}
      title="Eliminar Dependiente"
      message={`¿Estás seguro de que deseas eliminar al dependiente ${selectedDependiente?.nombre_apellido}?`}
      confirmText="Eliminar"
      cancelText="Cancelar"
      onConfirm={confirmDeleteDependiente}
      onCancel={() => setConfirmDialogOpen(false)}
      severity="error"
    />
  );
};