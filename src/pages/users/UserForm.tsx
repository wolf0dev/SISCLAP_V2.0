import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Divider,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Save, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { userService, User, CreateUserData, UpdateUserData } from '../../services/userService';
import { calleService, Calle } from '../../services/calleService';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { useAuth } from '../../contexts/AuthContext';
import PageHeader from '../../components/common/PageHeader';
import LoadingOverlay from '../../components/common/LoadingOverlay';

const UserForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const { isLiderComunidad } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [calles, setCalles] = useState<Calle[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const isEditing = !!id;

  useEffect(() => {
    if (!isLiderComunidad()) {
      navigate('/dashboard');
      return;
    }
    fetchCalles();
    if (isEditing) {
      fetchUser();
    }
  }, [id, isEditing, isLiderComunidad, navigate]);

  const validationSchema = Yup.object({
    nom_user: Yup.string().required('El nombre completo es requerido'),
    user: Yup.string().required('El nombre de usuario es requerido'),
    ced_user: Yup.string()
      .required('La cédula es requerida')
      .matches(/^[0-9]+$/, 'La cédula debe contener solo números'),
    correo: Yup.string()
      .email('Correo electrónico inválido')
      .required('El correo electrónico es requerido'),
    pass_user: isEditing 
      ? Yup.string() 
      : Yup.string()
          .required('La contraseña es requerida')
          .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    id_calle: Yup.number().required('La calle es requerida'),
  });

  const formik = useFormik({
    initialValues: {
      nom_user: '',
      user: '',
      ced_user: '',
      correo: '',
      pass_user: '',
      id_calle: 0,
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        if (isEditing) {
          const updateData: UpdateUserData = {
            id: parseInt(id!),
            nom_user: values.nom_user,
            user: values.user,
            ced_user: values.ced_user,
            correo: values.correo,
            id_rol_user: 2, // Siempre Jefe de Calle
            id_calle: values.id_calle,
          };
          await userService.update(updateData);
          showSnackbar('Usuario actualizado exitosamente', 'success');
        } else {
          const createData: CreateUserData = {
            nom_user: values.nom_user,
            user: values.user,
            ced_user: values.ced_user,
            correo: values.correo,
            pass_user: values.pass_user,
            id_calle: values.id_calle,
          };
          await userService.create(createData);
          showSnackbar('Usuario creado exitosamente', 'success');
        }
        navigate('/dashboard/users');
      } catch (error: any) {
        console.error('Error al guardar usuario:', error);
        const errorMessage = error.response?.data?.error || 'Error al guardar el usuario';
        showSnackbar(errorMessage, 'error');
      } finally {
        setLoading(false);
      }
    },
  });

  const fetchCalles = async () => {
    try {
      const data = await calleService.getAll();
      setCalles(data);
      if (data.length > 0 && formik.values.id_calle === 0) {
        formik.setFieldValue('id_calle', data[0].id_calle);
      }
    } catch (error) {
      console.error('Error al obtener calles:', error);
      showSnackbar('Error al cargar las calles', 'error');
    }
  };

  const fetchUser = async () => {
    setInitialLoading(true);
    try {
      const data = await userService.getById(parseInt(id!));
      formik.setValues({
        nom_user: data.nom_user,
        user: data.user,
        ced_user: data.ced_user,
        correo: data.correo,
        pass_user: '',
        id_calle: data.id_calle,
      });
    } catch (error: any) {
      console.error('Error al obtener usuario:', error);
      const errorMessage = error.response?.data?.error || 'Error al cargar los datos del usuario';
      showSnackbar(errorMessage, 'error');
      navigate('/dashboard/users');
    } finally {
      setInitialLoading(false);
    }
  };

  if (!isLiderComunidad()) {
    return null;
  }

  if (initialLoading) {
    return <LoadingOverlay open={initialLoading} message="Cargando datos del usuario..." />;
  }

  return (
    <Box>
      <PageHeader
        title={isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
        breadcrumbs={[
          { label: 'Inicio', path: '/dashboard' },
          { label: 'Usuarios', path: '/dashboard/users' },
          { label: isEditing ? 'Editar' : 'Nuevo' },
        ]}
      />

      <Paper sx={{ p: 3, mb: 4 }}>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <Typography variant="h6" gutterBottom>
            Información del Usuario
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="nom_user"
                name="nom_user"
                label="Nombre Completo"
                value={formik.values.nom_user}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.nom_user && Boolean(formik.errors.nom_user)}
                helperText={formik.touched.nom_user && formik.errors.nom_user}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="ced_user"
                name="ced_user"
                label="Cédula"
                value={formik.values.ced_user}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.ced_user && Boolean(formik.errors.ced_user)}
                helperText={formik.touched.ced_user && formik.errors.ced_user}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="user"
                name="user"
                label="Nombre de Usuario"
                value={formik.values.user}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.user && Boolean(formik.errors.user)}
                helperText={formik.touched.user && formik.errors.user}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="correo"
                name="correo"
                label="Correo Electrónico"
                type="email"
                value={formik.values.correo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.correo && Boolean(formik.errors.correo)}
                helperText={formik.touched.correo && formik.errors.correo}
                disabled={loading}
              />
            </Grid>

            {!isEditing && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="pass_user"
                  name="pass_user"
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  value={formik.values.pass_user}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.pass_user && Boolean(formik.errors.pass_user)}
                  helperText={formik.touched.pass_user && formik.errors.pass_user}
                  disabled={loading}
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
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <FormControl
                fullWidth
                error={formik.touched.id_calle && Boolean(formik.errors.id_calle)}
                disabled={loading}
              >
                <InputLabel id="calle-label">Calle Asignada</InputLabel>
                <Select
                  labelId="calle-label"
                  id="id_calle"
                  name="id_calle"
                  value={formik.values.id_calle}
                  label="Calle Asignada"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <MenuItem value={0} disabled>
                    Seleccione una calle
                  </MenuItem>
                  {calles.map((calle) => (
                    <MenuItem key={calle.id_calle} value={calle.id_calle}>
                      {calle.nom_calle}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.id_calle && formik.errors.id_calle && (
                  <FormHelperText>{formik.errors.id_calle}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                <strong>Nota:</strong> Todos los usuarios creados tendrán automáticamente el rol de "Jefe de Calle".
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              startIcon={<ArrowLeft size={20} />}
              onClick={() => navigate('/dashboard/users')}
              disabled={loading}
            >
              Volver
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <Save size={20} />}
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default UserForm;