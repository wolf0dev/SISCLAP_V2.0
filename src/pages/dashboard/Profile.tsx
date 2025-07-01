import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  TextField,
  Button,
  Grid,
  Avatar,
  Tab,
  Tabs,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Eye, EyeOff, Upload, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Profile: React.FC = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(user?.foto_perfil || null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const profileFormik = useFormik({
    initialValues: {
      nom_user: user?.nom_user || '',
      correo: user?.correo || '',
      user: user?.user || '',
      ced_user: user?.ced_user || '',
      id_rol_user: user?.id_rol_user || 0,
      id_calle: user?.id_calle || 0,
    },
    enableReinitialize: true, // Permite que los valores se actualicen cuando cambie el usuario
    validationSchema: Yup.object({
      nom_user: Yup.string().required('El nombre es requerido'),
      correo: Yup.string()
        .email('Correo electrónico inválido')
        .required('El correo electrónico es requerido'),
      user: Yup.string().required('El nombre de usuario es requerido'),
      ced_user: Yup.string().required('La cédula es requerida'),
    }),
    onSubmit: async (values) => {
      setLoadingProfile(true);
      try {
        const updatedUser = {
          ...values,
          foto_perfil: profileImage || '',
        };
        await updateProfile(updatedUser);
      } catch (error) {
        console.error('Error al actualizar perfil:', error);
      } finally {
        setLoadingProfile(false);
      }
    },
  });

  const passwordFormik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required('La contraseña actual es requerida'),
      newPassword: Yup.string()
        .required('La nueva contraseña es requerida')
        .min(6, 'La contraseña debe tener al menos 6 caracteres'),
      confirmPassword: Yup.string()
        .required('Confirma tu nueva contraseña')
        .oneOf([Yup.ref('newPassword')], 'Las contraseñas no coinciden'),
    }),
    onSubmit: async (values) => {
      setLoadingPassword(true);
      try {
        await changePassword(values.oldPassword, values.newPassword);
        passwordFormik.resetForm();
      } catch (error) {
        console.error('Error al cambiar contraseña:', error);
      } finally {
        setLoadingPassword(false);
      }
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getRoleLabel = () => {
    if (user?.id_rol_user === 1) return 'Líder de Comunidad';
    if (user?.id_rol_user === 2) return 'Jefe de Calle';
    return 'Usuario';
  };

  return (
    <Box>
      <Paper sx={{ p: 7, mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
            <Tab label="Información Personal" />
            <Tab label="Cambiar Contraseña" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box component="form" onSubmit={profileFormik.handleSubmit}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar
                  src={profileImage || undefined}
                  alt={user?.nom_user || "Usuario"}
                  sx={{ width: 150, height: 150, mb: 2 }}
                />
                <Button variant="outlined" component="label" startIcon={<Upload size={20} />}>
                  Cambiar Foto
                  <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                </Button>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                  Formatos permitidos: JPG, PNG. Tamaño máximo: 2MB
                </Typography>
              </Grid>

              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>
                  Información Personal
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="nom_user"
                      name="nom_user"
                      label="Nombre Completo"
                      value={profileFormik.values.nom_user}
                      onChange={profileFormik.handleChange}
                      onBlur={profileFormik.handleBlur}
                      error={profileFormik.touched.nom_user && Boolean(profileFormik.errors.nom_user)}
                      helperText={profileFormik.touched.nom_user && profileFormik.errors.nom_user}
                      disabled={loadingProfile}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="correo"
                      name="correo"
                      label="Correo Electrónico"
                      value={profileFormik.values.correo}
                      onChange={profileFormik.handleChange}
                      onBlur={profileFormik.handleBlur}
                      error={profileFormik.touched.correo && Boolean(profileFormik.errors.correo)}
                      helperText={profileFormik.touched.correo && profileFormik.errors.correo}
                      disabled={loadingProfile}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="ced_user"
                      name="ced_user"
                      label="Cédula"
                      value={profileFormik.values.ced_user}
                      onChange={profileFormik.handleChange}
                      onBlur={profileFormik.handleBlur}
                      error={profileFormik.touched.ced_user && Boolean(profileFormik.errors.ced_user)}
                      helperText={profileFormik.touched.ced_user && profileFormik.errors.ced_user}
                      disabled
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="user"
                      name="user"
                      label="Nombre de Usuario"
                      value={profileFormik.values.user}
                      onChange={profileFormik.handleChange}
                      onBlur={profileFormik.handleBlur}
                      error={profileFormik.touched.user && Boolean(profileFormik.errors.user)}
                      helperText={profileFormik.touched.user && profileFormik.errors.user}
                      disabled={loadingProfile}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="rol"
                      name="rol"
                      label="Rol"
                      value={getRoleLabel()}
                      disabled
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loadingProfile}
                    startIcon={loadingProfile ? <CircularProgress size={20} /> : null}
                  >
                    {loadingProfile ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box component="form" onSubmit={passwordFormik.handleSubmit} sx={{ maxWidth: 500, mx: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              Cambiar Contraseña
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <TextField
              fullWidth
              margin="normal"
              id="oldPassword"
              name="oldPassword"
              label="Contraseña Actual"
              type={showPassword ? 'text' : 'password'}
              value={passwordFormik.values.oldPassword}
              onChange={passwordFormik.handleChange}
              onBlur={passwordFormik.handleBlur}
              error={passwordFormik.touched.oldPassword && Boolean(passwordFormik.errors.oldPassword)}
              helperText={passwordFormik.touched.oldPassword && passwordFormik.errors.oldPassword}
              disabled={loadingPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              id="newPassword"
              name="newPassword"
              label="Nueva Contraseña"
              type={showNewPassword ? 'text' : 'password'}
              value={passwordFormik.values.newPassword}
              onChange={passwordFormik.handleChange}
              onBlur={passwordFormik.handleBlur}
              error={passwordFormik.touched.newPassword && Boolean(passwordFormik.errors.newPassword)}
              helperText={passwordFormik.touched.newPassword && passwordFormik.errors.newPassword}
              disabled={loadingPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge="end"
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              id="confirmPassword"
              name="confirmPassword"
              label="Confirmar Nueva Contraseña"
              type={showNewPassword ? 'text' : 'password'}
              value={passwordFormik.values.confirmPassword}
              onChange={passwordFormik.handleChange}
              onBlur={passwordFormik.handleBlur}
              error={passwordFormik.touched.confirmPassword && Boolean(passwordFormik.errors.confirmPassword)}
              helperText={passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword}
              disabled={loadingPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge="end"
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loadingPassword}
                startIcon={loadingPassword ? <CircularProgress size={20} /> : null}
              >
                {loadingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}
              </Button>
            </Box>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default Profile;