import React from 'react';
import {
  Drawer,
  Box,
} from '@mui/material';
import Menu from './Menu';

const Sidebar = ({ 
  open, 
  onClose, 
  menuItems, 
  width = 240, 
  variant = 'persistent',
  canAccessMenuItem 
}) => {
  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: open ? width : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: width,
          boxSizing: 'border-box',
          transition: (theme) =>
            theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        },
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <img src="/banner.png" alt="Banner" style={{ width: '100%' }} />
        <Menu items={menuItems} canAccessItem={canAccessMenuItem} />
      </Box>
    </Drawer>
  );
};

export default Sidebar;