import React from 'react';
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { Eye, Edit, UserX } from 'lucide-react';
import { useBeneficiariosListContext } from '../BeneficiariosListLogic';

export const BeneficiariosActionMenu: React.FC = () => {
  const {
    menuAnchorEl,
    handleCloseMenu,
    handleView,
    handleEdit,
    handleDisable,
  } = useBeneficiariosListContext();

  return (
    <Menu
      anchorEl={menuAnchorEl}
      open={Boolean(menuAnchorEl)}
      onClose={handleCloseMenu}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <MenuItem onClick={handleView}>
        <ListItemIcon>
          <Eye size={20} />
        </ListItemIcon>
        <ListItemText>Ver Detalles</ListItemText>
      </MenuItem>
      <MenuItem onClick={handleEdit}>
        <ListItemIcon>
          <Edit size={20} />
        </ListItemIcon>
        <ListItemText>Editar</ListItemText>
      </MenuItem>
      <MenuItem onClick={handleDisable}>
        <ListItemIcon>
          <UserX size={20} />
        </ListItemIcon>
        <ListItemText>Deshabilitar</ListItemText>
      </MenuItem>
    </Menu>
  );
};