import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Tooltip,
  useMediaQuery,
  useTheme as useMuiTheme,
  Chip,
  Collapse,
  Paper,
} from '@mui/material';
import { Menu as MenuIcon, ChevronLeft, LogOut, User, Home, Users, UserPlus, FileText, Settings, Moon, Sun, UserX, Expand as ExpandLess, Expand as ExpandMore } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const drawerWidth = 280;

const DashboardLayout: React.FC = () => {
  const { user, logout, isLiderComunidad, isJefeCalle } = useAuth();
  const { toggleTheme, isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const [open, setOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  const handleProfile = () => {
    handleMenuClose();
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
      text: 'Gestión de Usuarios',
      icon: <Settings size={24} />,
      path: '/dashboard/users',
      roles: [1], // Solo para Líder de Comunidad
    },
  ];

  const handleExpandItem = (text: string) => {
    if (expandedItem === text) {
      setExpandedItem(null);
    } else {
      setExpandedItem(text);
    }
  };

  const canAccessMenuItem = (roles: number[]) => {
    return user && roles.includes(user.id_rol_user);
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const isActiveParent = (subItems: any[]) => {
    return subItems.some(item => location.pathname === item.path);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'linear-gradient(135deg, #FF4040 0%, #FF6B6B 100%)',
          boxShadow: '0 4px 20px rgba(255, 64, 64, 0.3)',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ 
              mr: 2,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            {open ? <ChevronLeft /> : <MenuIcon />}
          </IconButton>
          
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 600,
              fontSize: { xs: '1rem', sm: '1.25rem' },
              display: { xs: 'none', sm: 'block' }
            }}
          >
            Sistema de Gestión de Beneficios
          </Typography>

          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 600,
              fontSize: '0.9rem',
              display: { xs: 'block', sm: 'none' }
            }}
          >
            SGB
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            <Chip 
              label={getRoleLabel()} 
              color={getRoleColor()}
              size="small"
              variant="outlined"
              sx={{ 
                color: 'white', 
                borderColor: 'rgba(255, 255, 255, 0.5)',
                fontWeight: 500,
                fontSize: { xs: '0.7rem', sm: '0.8rem' },
                display: { xs: 'none', sm: 'flex' }
              }}
            />

            <Tooltip title={isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}>
              <IconButton 
                color="inherit" 
                onClick={toggleTheme} 
                sx={{ 
                  mr: { xs: 0, sm: 1 },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Configuración de cuenta">
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                <Avatar
                  alt={user?.nom_user || 'Usuario'}
                  src={user?.foto_perfil || ''}
                  sx={{ 
                    width: { xs: 36, sm: 46 }, 
                    height: { xs: 36, sm: 46 },
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                  }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleProfile} sx={{ py: 1.5, px: 2 }}>
          <ListItemIcon>
            <User size={20} />
          </ListItemIcon>
          <Typography variant="inherit">Mi Perfil</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ py: 1.5, px: 2 }}>
          <ListItemIcon>
            <LogOut size={20} />
          </ListItemIcon>
          <Typography variant="inherit">Cerrar Sesión</Typography>
        </MenuItem>
      </Menu>

      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={open}
        onClose={isMobile ? handleDrawerToggle : undefined}
        sx={{
          width: open ? drawerWidth : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: isDarkMode 
              ? 'linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%)'
              : 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
            borderRight: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            transition: 'all 0.3s ease',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', p: 0 }}>

          <List sx={{ px: 1 }}>
            {menuItems.map((item) => {
              if (!canAccessMenuItem(item.roles)) return null;

              const isParentActive = item.subItems ? isActiveParent(item.subItems) : false;
              const isItemActive = isActiveRoute(item.path);

              return (
                <React.Fragment key={item.text}>
                  {item.subItems ? (
                    <>
                      <ListItem disablePadding sx={{ mb: 0 }}>
                        <ListItemButton
                          onClick={() => handleExpandItem(item.text)}
                          sx={{
                            borderRadius: 2,
                            py: 1.5,
                            px: 2,
                            backgroundColor: isParentActive ? '#FF4040' : 'transparent',
                            color: isParentActive ? 'white' : 'inherit',
                            '&:hover': {
                              backgroundColor: isParentActive ? '#D32F2F' : '#FF4040',
                              color: 'white',
                              transform: 'translateX(4px)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <ListItemIcon 
                            sx={{ 
                              color: isParentActive ? 'white' : 'inherit',
                              minWidth: 40,
                            }}
                          >
                            {item.icon}
                          </ListItemIcon>
                          <ListItemText 
                            primary={item.text} 
                            primaryTypographyProps={{
                              fontWeight: isParentActive ? 600 : 500,
                              fontSize: '0.95rem',
                            }}
                          />
                          {expandedItem === item.text ? (
                            <ExpandLess sx={{ color: isParentActive ? 'white' : 'inherit' }} />
                          ) : (
                            <ExpandMore sx={{ color: isParentActive ? 'white' : 'inherit' }} />
                          )}
                        </ListItemButton>
                      </ListItem>
                      <Collapse in={expandedItem === item.text} timeout="auto" unmountOnExit>
                        <List disablePadding sx={{ pl: 2 }}>
                          {item.subItems.map((subItem) => {
                            if (!canAccessMenuItem(subItem.roles)) return null;
                            
                            const isSubItemActive = isActiveRoute(subItem.path);
                            
                            return (
                              <ListItem
                                key={subItem.text}
                                disablePadding
                                component={Link}
                                to={subItem.path}
                                sx={{ 
                                  mb: 0.5,
                                  textDecoration: 'none',
                                  color: 'inherit',
                                }}
                              >
                                <ListItemButton
                                  sx={{
                                    borderRadius: 2,
                                    py: 1,
                                    px: 2,
                                    backgroundColor: isSubItemActive ? '#FF4040' : 'transparent',
                                    color: isSubItemActive ? 'white' : 'inherit',
                                    '&:hover': {
                                      backgroundColor: isSubItemActive ? '#D32F2F' : '#FF4040',
                                      color: 'white',
                                      transform: 'translateX(4px)',
                                    },
                                    transition: 'all 0.3s ease',
                                  }}
                                >
                                  <ListItemText 
                                    primary={subItem.text}
                                    primaryTypographyProps={{
                                      fontWeight: isSubItemActive ? 600 : 400,
                                      fontSize: '0.9rem',
                                    }}
                                  />
                                </ListItemButton>
                              </ListItem>
                            );
                          })}
                        </List>
                      </Collapse>
                    </>
                  ) : (
                    <ListItem 
                      disablePadding 
                      component={Link} 
                      to={item.path}
                      sx={{ 
                        mb: 0.5,
                        textDecoration: 'none',
                        color: 'inherit',
                      }}
                    >
                      <ListItemButton
                        sx={{
                          borderRadius: 2,
                          py: 1.5,
                          px: 2,
                          backgroundColor: isItemActive ? '#FF4040' : 'transparent',
                          color: isItemActive ? 'white' : 'inherit',
                          '&:hover': {
                            backgroundColor: isItemActive ? '#D32F2F' : '#FF4040',
                            color: 'white',
                            transform: 'translateX(4px)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <ListItemIcon 
                          sx={{ 
                            color: isItemActive ? 'white' : 'inherit',
                            minWidth: 40,
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText 
                          primary={item.text}
                          primaryTypographyProps={{
                            fontWeight: isItemActive ? 600 : 500,
                            fontSize: '0.95rem',
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  )}
                </React.Fragment>
              );
            })}
          </List>
          
          <Divider sx={{ my: 2, opacity: 0.3 }} />
          
          <List sx={{ px: 1 }}>
            <ListItem 
              disablePadding 
              component={Link} 
              to="/dashboard/profile"
              sx={{ 
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <ListItemButton
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  px: 2,
                  backgroundColor: isActiveRoute('/dashboard/profile') ? '#FF4040' : 'transparent',
                  color: isActiveRoute('/dashboard/profile') ? 'white' : 'inherit',
                  '&:hover': {
                    backgroundColor: isActiveRoute('/dashboard/profile') ? '#D32F2F' : '#FF4040',
                    color: 'white',
                    transform: 'translateX(4px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: isActiveRoute('/dashboard/profile') ? 'white' : 'inherit',
                    minWidth: 40,
                  }}
                >
                  <Settings size={24} />
                </ListItemIcon>
                <ListItemText 
                  primary="Mi Perfil"
                  primaryTypographyProps={{
                    fontWeight: isActiveRoute('/dashboard/profile') ? 600 : 500,
                    fontSize: '0.95rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: (theme) =>
            theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        <Toolbar />
        <Box sx={{ 
          flexGrow: 1, 
          p: { xs: 1, sm: 2, md: 3 },
          width: '100%',
          maxWidth: '100%',
          overflow: 'auto',
          boxSizing: 'border-box'
        }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;