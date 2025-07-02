import React from 'react';
import { Box, Paper, IconButton, Tooltip, Chip } from '@mui/material';
import { MoreVertical } from 'lucide-react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { beneficiarioService, Beneficiario } from '../../../../services/beneficiarioService';
import { useAuth } from '../../../../contexts/AuthContext';
import { useBeneficiariosListContext } from '../BeneficiariosListLogic';

export const BeneficiariosTable: React.FC = () => {
  const { isLiderComunidad } = useAuth();
  const {
    filteredBeneficiarios,
    selectedRowId,
    handleOpenMenu,
    canAccessBeneficiario,
  } = useBeneficiariosListContext();

  const columns: GridColDef[] = [
    {
      field: 'cedula',
      headerName: 'Cédula',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'nombre_apellido',
      headerName: 'Nombre y Apellido',
      flex: 1.5,
      minWidth: 200,
    },
    {
      field: 'profesion',
      headerName: 'Profesión',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'telefono',
      headerName: 'Teléfono',
      flex: 1,
      minWidth: 130,
    },
    ...(isLiderComunidad() ? [{
      field: 'nom_calle',
      headerName: 'Calle',
      flex: 1,
      minWidth: 150,
    }] : []),
    {
      field: 'estatus',
      headerName: 'Estatus',
      flex: 1,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={beneficiarioService.isActive({ estatus: params.value } as Beneficiario) ? 'Activo' : 'Inactivo'}
          color={beneficiarioService.isActive({ estatus: params.value } as Beneficiario) ? 'success' : 'error'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      flex: 1,
      minWidth: 100,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Tooltip title="Opciones">
            <IconButton
              onClick={(e) => handleOpenMenu(e, params.row as Beneficiario)}
              color={selectedRowId === params.row.cedula ? 'primary' : 'default'}
              disabled={!canAccessBeneficiario(params.row as Beneficiario)}
            >
              <MoreVertical size={20} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 4, width: '100%', overflow: 'hidden' }}>
      <Box sx={{ width: '100%', overflow: 'auto' }}>
        <DataGrid
          rows={filteredBeneficiarios}
          columns={columns}
          getRowId={(row) => row.cedula}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
            sorting: {
              sortModel: [{ field: 'nombre_apellido', sort: 'asc' }],
            },
          }}
          pageSizeOptions={[5, 10, 25, 50]}
          autoHeight
          disableRowSelectionOnClick
          sx={{
            width: '100%',
            minWidth: 0,
            '& .MuiDataGrid-cell:focus': {
              outline: 'none',
            },
            '& .MuiDataGrid-root': {
              border: 'none',
            },
            '& .MuiDataGrid-columnHeaders': {
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
            },
            '& .MuiDataGrid-cell': {
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
            },
          }}
        />
      </Box>
    </Paper>
  );
};