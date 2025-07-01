import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActionArea,
  Paper,
  Divider,
  Container,
  Chip,
  useTheme,
  Avatar,
} from '@mui/material';
import { Users, UserPlus, FileText, UserX, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLiderComunidad, isJefeCalle } = useAuth();
  const theme = useTheme();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const cards = [
    {
      title: 'Beneficiarios',
      description: 'Gestionar beneficiarios del sistema',
      icon: <Users size={48} />,
      path: '/dashboard/beneficiarios',
      color: '#FF4040',
      gradient: 'linear-gradient(135deg, #FF4040 0%, #FF6B6B 100%)',
      roles: [1, 2],
    },
    {
      title: 'Dependientes',
      description: 'Gestionar dependientes de beneficiarios',
      icon: <UserPlus size={48} />,
      path: '/dashboard/dependientes',
      color: '#FF6B6B',
      gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8A80 100%)',
      roles: [1, 2],
    },
    {
      title: 'Beneficiarios Inactivos',
      description: 'Ver y reactivar beneficiarios inactivos',
      icon: <UserX size={48} />,
      path: '/dashboard/beneficiarios/inactivos',
      color: '#D32F2F',
      gradient: 'linear-gradient(135deg, #D32F2F 0%, #F44336 100%)',
      roles: [1, 2],
    },
    {
      title: 'Reportes',
      description: 'Generar reportes del sistema',
      icon: <FileText size={48} />,
      path: '/dashboard/reportes/carga-familiar',
      color: '#FF4040',
      gradient: 'linear-gradient(135deg, #FF4040 0%, #E91E63 100%)',
      roles: [1, 2],
    },
  ];

  const getRoleInfo = () => {
    if (isLiderComunidad()) {
      return {
        label: 'Líder de Comunidad',
        description: 'Acceso completo a todas las funcionalidades del sistema',
        color: '#D32F2F',
      };
    } else if (isJefeCalle()) {
      return {
        label: 'Jefe de Calle',
        description: 'Gestión de beneficiarios y reportes de tu calle asignada',
        color: '#1976D2',
      };
    }
    return {
      label: 'Usuario',
      description: 'Acceso básico al sistema',
      color: '#757575',
    };
  };

  const roleInfo = getRoleInfo();

  const canAccessCard = (cardRoles: number[]) => {
    return user && cardRoles.includes(user.id_rol_user);
  };

  const visibleCards = cards.filter(card => canAccessCard(card.roles));

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
      <Box>
        {/* Header Section */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 2, sm: 3 }, 
            mb: { xs: 2, sm: 3, md: 4 }, 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #FF4040 0%, #FF6B6B 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: { xs: '100px', sm: '150px', md: '200px' },
              height: { xs: '100px', sm: '150px', md: '200px' },
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              transform: 'translate(50%, -50%)',
            }}
          />
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              justifyContent: 'space-between',
              mb: { xs: 1, sm: 2 }
            }}>
              {/* Contenido principal del texto */}
              <Box sx={{ flex: 1, pr: { xs: 2, sm: 3 } }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  flexWrap: 'wrap', 
                  gap: 1,
                  mb: { xs: 1, sm: 2 }
                }}>
                  <Typography 
                    variant="h4" 
                    component="h1" 
                    fontWeight="bold" 
                    sx={{ 
                      fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                      mr: { xs: 0, sm: 1 }
                    }}
                  >
                    {getGreeting()}, {user?.nom_user}!
                  </Typography>
                  <Chip 
                    label={roleInfo.label}
                    sx={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: { xs: '0.75rem', sm: '0.9rem' },
                    }}
                  />
                </Box>
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    opacity: 0.9, 
                    mb: 1,
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }}
                >
                  Sistema de Gestión de Beneficios
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    opacity: 0.8,
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                >
                  {roleInfo.description}
                </Typography>
              </Box>
              
              {/* Avatar del usuario - posicionado independientemente */}
              <Box sx={{ 
                flexShrink: 0,
                display: 'flex',
                alignItems: 'flex-start',
                pt: { xs: 0, sm: 1 }
              }}>
                <Avatar
                  alt={user?.nom_user || 'Usuario'}
                  src={user?.foto_perfil || ''}
                  sx={{ 
                    width: { xs: 80, sm: 100, md: 130 }, 
                    height: { xs: 80, sm: 100, md: 130 },
                    border: '3px solid rgba(255, 255, 255, 0.3)',
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate('/dashboard/profile')}
                />
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Main Cards Section */}
        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
          {visibleCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 60px rgba(255, 64, 64, 0.2)',
                  }
                }}
              >
                <CardActionArea 
                  sx={{ height: '100%' }}
                  onClick={() => navigate(card.path)}
                >
                  <Box
                    sx={{
                      height: { xs: 60, sm: 80 },
                      background: card.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                    }}
                  >
                    {React.cloneElement(card.icon, { size: { xs: 32, sm: 48 } })}
                  </Box>
                  <CardContent sx={{ 
                    p: { xs: 2, sm: 3 }, 
                    height: { xs: 'calc(100% - 60px)', sm: 'calc(100% - 80px)' }, 
                    display: 'flex', 
                    flexDirection: 'column' 
                  }}>
                    <Typography 
                      variant="h6" 
                      component="h2" 
                      gutterBottom 
                      fontWeight="bold" 
                      sx={{ 
                        mb: { xs: 1, sm: 2 },
                        fontSize: { xs: '1rem', sm: '1.25rem' }
                      }}
                    >
                      {card.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        flexGrow: 1,
                        fontSize: { xs: '0.8rem', sm: '0.875rem' }
                      }}
                    >
                      {card.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Info Section */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 2, sm: 3, md: 4 }, 
            borderRadius: 3,
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
          }}
        >
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom 
            fontWeight="bold" 
            sx={{ 
              mb: { xs: 2, sm: 3 },
              fontSize: { xs: '1.25rem', sm: '1.5rem' }
            }}
          >
            Acerca del Sistema
          </Typography>
          <Divider sx={{ mb: { xs: 2, sm: 3 }, opacity: 0.3 }} />
          
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            <Grid item xs={12} md={6}>
              <Typography 
                variant="body1" 
                paragraph 
                sx={{ 
                  lineHeight: 1.7,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                El Sistema de Gestión de Beneficios es una herramienta diseñada para facilitar 
                la administración de beneficiarios y sus dependientes en la comunidad Brisas del Orinoco II.
              </Typography>
              <Typography 
                variant="body1" 
                paragraph 
                sx={{ 
                  lineHeight: 1.7,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                Con este sistema, los administradores pueden gestionar de manera eficiente 
                toda la información relacionada con los beneficiarios de la comunidad.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h6" 
                gutterBottom 
                fontWeight="600" 
                sx={{ 
                  mb: 2,
                  fontSize: { xs: '1.1rem', sm: '1.25rem' }
                }}
              >
                Funcionalidades principales:
              </Typography>
              <Box component="ul" sx={{ pl: 0, listStyle: 'none' }}>
                {[
                  'Registrar y gestionar beneficiarios de la comunidad',
                  'Administrar dependientes de cada beneficiario',
                  'Generar reportes de carga familiar y habitantes por calle',
                  'Exportar información en formatos Excel y PDF',
                  'Control de acceso basado en roles de usuario',
                  ...(isLiderComunidad() ? ['Gestión completa de usuarios del sistema'] : []),
                ].map((item, index) => (
                  <Box 
                    component="li" 
                    key={index}
                    sx={{ 
                      mb: 1.5,
                      display: 'flex',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: '#FF4040',
                        mr: 2,
                        flexShrink: 0,
                        mt: 0.75,
                      }}
                    />
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        lineHeight: 1.6,
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }}
                    >
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default Home;