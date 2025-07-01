import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Box,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
  Grid,
  useMediaQuery,
  useTheme,
  Container,
} from '@mui/material';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import RecoverUsernameModal from './RecoverUsernameModal';
import RecoverPasswordModal from './RecoverPasswordModal';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [openRecoverUsername, setOpenRecoverUsername] = useState(false);
  const [openRecoverPassword, setOpenRecoverPassword] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('El nombre de usuario es requerido'),
      password: Yup.string().required('La contraseña es requerida'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await login(values.username, values.password);
      } catch (error) {
        console.error('Error en inicio de sesión:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Container maxWidth={false} disableGutters sx={{ minHeight: '100vh' }}>
      <Grid container sx={{ height: '100vh' }}>
        {/* Panel izquierdo */}
        {!isMobile && (
          <Grid
            item
            xs={12} md={7}
            sx={{
              background: '#D32F2F',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              textAlign: 'center',
              padding: { xs: 2, sm: 3, md: 4 },
              borderTopRightRadius: '50px',
              gap: { xs: 2, sm: 3, md: 4 },
            }}
          >
            <Box 
              component="img" 
              src="/clap-logo.png" 
              alt="Logo" 
              sx={{ 
                width: { xs: 200, sm: 250, md: 300 }, 
                height: { xs: 167, sm: 208, md: 250 }, 
                mb: { xs: 1, sm: 2 },
                maxWidth: '100%',
                height: 'auto'
              }} 
            />
            <Box sx={{ maxWidth: '90%' }}>
              <Typography 
                variant="h4" 
                fontWeight="bold"
                sx={{ 
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                  lineHeight: 1.2,
                  mb: { xs: 1, sm: 2 }
                }}
              >
                Sistema de Gestión de Beneficios Brisas del Orinoco II
              </Typography>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  mt: { xs: 1, sm: 2 },
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  lineHeight: 1.5
                }}
              >
                Bienvenido al sistema de gestión de beneficios. Accede con tus credenciales para consultar y administrar la información de los beneficiarios de Brisas del Orinoco II.
              </Typography>
            </Box>
          </Grid>
        )}

        {/* Panel derecho - Login */}
        <Grid
          item
          xs={12} md={5}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            background: isMobile ? 'white' : 'none',
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 3, sm: 4 },
          }}
        >
          <Box sx={{ 
            width: '100%', 
            maxWidth: { xs: '100%', sm: 400 },
            borderRadius: 2, 
            px: { xs: 2, sm: 4 },
            py: { xs: 3, sm: 4 }
          }}>
            {isMobile && (
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mb: 3 
                }}
              >
                <Box 
                  component="img" 
                  src="/clap-logo.png" 
                  alt="Logo" 
                  sx={{ 
                    width: { xs: 150, sm: 200 }, 
                    height: 'auto',
                    maxWidth: '100%'
                  }} 
                />
              </Box>
            )}
            
            <Typography 
              variant="h5" 
              textAlign="center" 
              fontWeight="bold" 
              gutterBottom
              sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
            >
              Iniciar Sesión
            </Typography>
            <Typography 
              variant="subtitle1" 
              color="text.secondary" 
              textAlign="center" 
              gutterBottom
              sx={{ 
                mb: { xs: 2, sm: 3 },
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              Ingresa tus credenciales
            </Typography>

            <Box component="form" onSubmit={formik.handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Nombre de Usuario"
                name="username"
                autoComplete="username"
                autoFocus
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
                disabled={loading}
                sx={{ mb: 2 }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                disabled={loading}
                sx={{ mb: 3 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ 
                  mt: 2, 
                  mb: 3,
                  py: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Iniciar Sesión'}
              </Button>

              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between', 
                gap: { xs: 1, sm: 0 },
                mb: 2 
              }}>
                <Button 
                  variant="text" 
                  size="small" 
                  onClick={() => setOpenRecoverUsername(true)}
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  ¿Olvidaste tu usuario?
                </Button>
                <Button 
                  variant="text" 
                  size="small" 
                  onClick={() => setOpenRecoverPassword(true)}
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  ¿Olvidaste tu contraseña?
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <RecoverUsernameModal open={openRecoverUsername} handleClose={() => setOpenRecoverUsername(false)} />
      <RecoverPasswordModal open={openRecoverPassword} handleClose={() => setOpenRecoverPassword(false)} />
    </Container>
  );
};

export default Login;