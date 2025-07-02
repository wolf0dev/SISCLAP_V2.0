import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Box,
  Toolbar,
  useMediaQuery,
  useTheme as useMuiTheme,
} from '@mui/material';
import {
  Home,
  Users,
  UserPlus,
  FileText,
  Settings,
  UserX,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../security';
import { useTheme } from '../providers/ThemeProvider';
import { Header, Sidebar } from '../components';

const drawerWidth = 240;

const DashboardLayout = () => {
  const { user, logout, isLiderComunidad, isJefeCalle } = useAuth();
  const { toggleTheme, isDarkMode } = useTheme();
  const navigate = useNavigate();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const [open, setOpen] = useState(!isMobile);

  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleProfileClick = () => {
    navigate('/dashboard/profile');
  };

  const getRoleLabel = () => {
    if (isLiderComunidad()) return 'Líder de Comunidad';
    if (isJefeCalle()) return 'Jefe de Calle';
    return 'Usuario';
  };

  const getRoleColor = () => {
    if (isLiderComunidad()) return 'error';
    if (isJefeCalle()) return 'primary';
    return 'default';
  };

  const menuItems = [
    {
      text: 'Inicio',
      icon: <Home size={24} />,
      path: '/dashboard',
      roles: [1, 2],
    },
    {
      text: 'Beneficiarios',
      icon: <Users size={24} />,
      path: '/dashboard/beneficiarios',
      roles: [1, 2],
    },
    {
      text: 'Beneficiarios Inactivos',
      icon: <UserX size={24} />,
      path: '/dashboard/beneficiarios/inactivos',
      roles: [1, 2],
    },
    {
      text: 'Dependientes',
      icon: <UserPlus size={24} />,
      path: '/dashboard/dependientes',
      roles: [1, 2],
    },
    {
      text: 'Reportes',
      icon: <FileText size={24} />,
      roles: [1, 2],
      subItems: [
        {
          text: 'Carga Familiar',
          path: '/dashboard/reportes/carga-familiar',
          roles: [1, 2],
        },
        {
          text: 'Habitantes por Calle',
          path: '/dashboard/reportes/habitantes-calle',
          roles: [1, 2],
        },
        {
          text: 'Rango de Edad',
          path: '/dashboard/reportes/rango-edad',
          roles: [1],
        },
        {
          text: 'Reporte de Venta',
          path: '/dashboard/reportes/ventas',
          roles: [1, 2],
        },
      ],
    },
    {
      text: 'Configuración',
      icon: <Settings size={24} />,
      path: '/dashboard/profile',
      roles: [1, 2],
    },
  ];

  const canAccessMenuItem = (roles) => {
    return user && roles.includes(user.id_rol_user);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Header
        open={open}
        onToggleSidebar={handleDrawerToggle}
        title="Sistema de Gestión de Beneficios"
        user={user}
        onProfileClick={handleProfileClick}
        onLogout={logout}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        getRoleLabel={getRoleLabel}
        getRoleColor={getRoleColor}
      />

      <Sidebar
        open={open}
        onClose={isMobile ? handleDrawerToggle : undefined}
        menuItems={menuItems}
        width={drawerWidth}
        variant={isMobile ? 'temporary' : 'persistent'}
        canAccessMenuItem={canAccessMenuItem}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          width: { sm: `calc(100% - ${open ? drawerWidth : 0}px)` },
          marginLeft: { sm: open ? `${drawerWidth}px` : 0 },
          transition: (theme) =>
            theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;