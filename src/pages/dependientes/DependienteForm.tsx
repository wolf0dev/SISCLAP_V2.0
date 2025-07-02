import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
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
  Autocomplete,
} from '@mui/material';
import { Save, ArrowLeft } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { dependienteService, Dependiente } from '../../services/dependienteService';
import { beneficiarioService, Beneficiario } from '../../services/beneficiarioService';
import { useSnackbar } from '../../contexts/SnackbarContext';
import PageHeader from '../../components/common/PageHeader';
import LoadingOverlay from '../../components/common/LoadingOverlay';

// Datos para los campos de selección
const generos = ['Masculino', 'Femenino'];
const estadosCiviles = ['Soltero', 'Casado', 'Divorciado', 'Viudo', 'Unión Libre'];
const parentescos = ['Hijo', 'Hija', 'Esposo', 'Esposa', 'Padre', 'Madre', 'Hermano', 'Hermana', 'Otro'];
const gradosInstruccion = [
  'Sin Instrucción',
  'Primaria',
  'Secundaria',
  'Técnico',
  'Universitario',
  'Postgrado',
];

const DependienteForm: React.FC = () => {
  const { cedula } = useParams<{ cedula: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([]);
  const [loadingBeneficiarios, setLoadingBeneficiarios] = useState(false);
  const isEditing = !!cedula;

  const queryParams = new URLSearchParams(location.search);
  const beneficiarioCedula = queryParams.get('beneficiario');

  const validationSchema = Yup.object({
    cedula: Yup.string()
      .required('La cédula es requerida')
      .matches(/^[0-9]+$/, 'La cédula debe contener solo números'),
    nombre_apellido: Yup.string().required('El nombre y apellido son requeridos'),
    profesion: Yup.string().required('La profesión es requerida'),
    fecha_nacimiento: Yup.date().required('La fecha de nacimiento es requerida'),
    grado_instruccion: Yup.string().required('El grado de instrucción es requerido'),
    enfermedad_cronica: Yup.string(),
    discapacidad: Yup.string(),
    genero: Yup.string().required('El género es requerido'),
    telefono: Yup.string()
      .required('El teléfono es requerido')
      .matches(/^[0-9]+$/, 'El teléfono debe contener solo números'),
    estado_civil: Yup.string().required('El estado civil es requerido'),
    parentesco: Yup.string().required('El parentesco es requerido'),
    cedula_beneficiario: Yup.string()
      .required('La cédula del beneficiario es requerida')
      .matches(/^[0-9]+$/, 'La cédula debe contener solo números'),
  });

  const formik = useFormik({
    initialValues: {
      cedula: '',
      nombre_apellido: '',
      profesion: '',
      fecha_nacimiento: '',
      grado_instruccion: '',
      enfermedad_cronica: 'Ninguna',
      discapacidad: 'Ninguna',
      genero: '',
      telefono: '',
      estado_civil: '',
      parentesco: '',
      cedula_beneficiario: beneficiarioCedula || '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        if (isEditing) {
          const { cedula: cedDependiente, ...updateData } = values;
          await dependienteService.update(cedula!, updateData);
          showSnackbar('Dependiente actualizado exitosamente', 'success');
        } else {
          await dependienteService.create(values);
          showSnackbar('Dependiente creado exitosamente', 'success');
        }
        navigate('/dashboard/dependientes');
      } catch (error: any) {
        console.error('Error al guardar dependiente:', error);
        const errorMessage = error.response?.data?.error || 'Error al guardar el dependiente';
        showSnackbar(errorMessage, 'error');
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    fetchBeneficiarios();
    if (isEditing) {
      fetchDependiente();
    }
  }, [cedula]);

  const fetchBeneficiarios = async () => {
    setLoadingBeneficiarios(true);
    try {
      const data = await beneficiarioService.getAll();
      const activeBeneficiarios = data.filter((b: Beneficiario) => b.estatus === 'Activo');
      setBeneficiarios(activeBeneficiarios);
    } catch (error) {
      console.error('Error al obtener beneficiarios:', error);
      showSnackbar('Error al cargar los beneficiarios', 'error');
    } finally {
      setLoadingBeneficiarios(false);
    }
  };

  const fetchDependiente = async () => {
    setInitialLoading(true);
    try {
      const data = await dependienteService.getById(cedula!);
      const fechaNacimiento = new Date(data.fecha_nacimiento).toISOString().split('T')[0];
      formik.setValues({
        ...data,
        fecha_nacimiento: fechaNacimiento,
      });
    } catch (error: any) {
      console.error('Error al obtener dependiente:', error);
      const errorMessage = error.response?.data?.error || 'Error al cargar los datos del dependiente';
      showSnackbar(errorMessage, 'error');
      navigate('/dashboard/dependientes');
    } finally {
      setInitialLoading(false);
    }
  };

  if (initialLoading) {
    return <LoadingOverlay open={initialLoading} message="Cargando datos del dependiente..." />;
  }

  return (
    <Box>
      <PageHeader
        title={isEditing ? 'Editar Dependiente' : 'Nuevo Dependiente'}
        breadcrumbs={[
          { label: 'Inicio', path: '/dashboard' },
          { label: 'Dependientes', path: '/dashboard/dependientes' },
          { label: isEditing ? 'Editar' : 'Nuevo' },
        ]}
      />

      <Paper sx={{ p: 3, mb: 4 }}>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <Typography variant="h6" gutterBottom>
            Información Personal
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="cedula"
                name="cedula"
                label="Cédula"
                value={formik.values.cedula}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.cedula && Boolean(formik.errors.cedula)}
                helperText={formik.touched.cedula && formik.errors.cedula}
                disabled={isEditing || loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="nombre_apellido"
                name="nombre_apellido"
                label="Nombre y Apellido"
                value={formik.values.nombre_apellido}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.nombre_apellido && Boolean(formik.errors.nombre_apellido)}
                helperText={formik.touched.nombre_apellido && formik.errors.nombre_apellido}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="fecha_nacimiento"
                name="fecha_nacimiento"
                label="Fecha de Nacimiento"
                type="date"
                value={formik.values.fecha_nacimiento}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.fecha_nacimiento && Boolean(formik.errors.fecha_nacimiento)}
                helperText={formik.touched.fecha_nacimiento && formik.errors.fecha_nacimiento}
                InputLabelProps={{ shrink: true }}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl
                fullWidth
                error={formik.touched.genero && Boolean(formik.errors.genero)}
                disabled={loading}
              >
                <InputLabel id="genero-label">Género</InputLabel>
                <Select
                  labelId="genero-label"
                  id="genero"
                  name="genero"
                  value={formik.values.genero}
                  label="Género"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <MenuItem value="" disabled>
                    Seleccione un género
                  </MenuItem>
                  {generos.map((genero) => (
                    <MenuItem key={genero} value={genero}>
                      {genero}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.genero && formik.errors.genero && (
                  <FormHelperText>{formik.errors.genero}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl
                fullWidth
                error={formik.touched.estado_civil && Boolean(formik.errors.estado_civil)}
                disabled={loading}
              >
                <InputLabel id="estado-civil-label">Estado Civil</InputLabel>
                <Select
                  labelId="estado-civil-label"
                  id="estado_civil"
                  name="estado_civil"
                  value={formik.values.estado_civil}
                  label="Estado Civil"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <MenuItem value="" disabled>
                    Seleccione un estado civil
                  </MenuItem>
                  {estadosCiviles.map((estado) => (
                    <MenuItem key={estado} value={estado}>
                      {estado}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.estado_civil && formik.errors.estado_civil && (
                  <FormHelperText>{formik.errors.estado_civil}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="telefono"
                name="telefono"
                label="Teléfono"
                value={formik.values.telefono}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.telefono && Boolean(formik.errors.telefono)}
                helperText={formik.touched.telefono && formik.errors.telefono}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Información Profesional
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="profesion"
                name="profesion"
                label="Profesión"
                value={formik.values.profesion}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.profesion && Boolean(formik.errors.profesion)}
                helperText={formik.touched.profesion && formik.errors.profesion}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl
                fullWidth
                error={formik.touched.grado_instruccion && Boolean(formik.errors.grado_instruccion)}
                disabled={loading}
              >
                <InputLabel id="grado-instruccion-label">Grado de Instrucción</InputLabel>
                <Select
                  labelId="grado-instruccion-label"
                  id="grado_instruccion"
                  name="grado_instruccion"
                  value={formik.values.grado_instruccion}
                  label="Grado de Instrucción"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <MenuItem value="" disabled>
                    Seleccione un grado de instrucción
                  </MenuItem>
                  {gradosInstruccion.map((grado) => (
                    <MenuItem key={grado} value={grado}>
                      {grado}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.grado_instruccion && formik.errors.grado_instruccion && (
                  <FormHelperText>{formik.errors.grado_instruccion}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="enfermedad_cronica"
                name="enfermedad_cronica"
                label="Enfermedad Crónica"
                value={formik.values.enfermedad_cronica}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.enfermedad_cronica && Boolean(formik.errors.enfermedad_cronica)}
                helperText={formik.touched.enfermedad_cronica && formik.errors.enfermedad_cronica}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="discapacidad"
                name="discapacidad"
                label="Discapacidad"
                value={formik.values.discapacidad}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.discapacidad && Boolean(formik.errors.discapacidad)}
                helperText={formik.touched.discapacidad && formik.errors.discapacidad}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Relación con Beneficiario
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl
                fullWidth
                error={formik.touched.parentesco && Boolean(formik.errors.parentesco)}
                disabled={loading}
              >
                <InputLabel id="parentesco-label">Parentesco</InputLabel>
                <Select
                  labelId="parentesco-label"
                  id="parentesco"
                  name="parentesco"
                  value={formik.values.parentesco}
                  label="Parentesco"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <MenuItem value="" disabled>
                    Seleccione un parentesco
                  </MenuItem>
                  {parentescos.map((parentesco) => (
                    <MenuItem key={parentesco} value={parentesco}>
                      {parentesco}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.parentesco && formik.errors.parentesco && (
                  <FormHelperText>{formik.errors.parentesco}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                id="cedula_beneficiario"
                options={beneficiarios}
                getOptionLabel={(option) => `${option.nombre_apellido} (${option.cedula})`}
                value={
                  beneficiarios.find((b) => b.cedula === formik.values.cedula_beneficiario) || null
                }
                onChange={(_, newValue) => {
                  formik.setFieldValue('cedula_beneficiario', newValue ? newValue.cedula : '');
                }}
                loading={loadingBeneficiarios}
                disabled={loading || (!!beneficiarioCedula && !isEditing)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Beneficiario"
                    error={
                      formik.touched.cedula_beneficiario &&
                      Boolean(formik.errors.cedula_beneficiario)
                    }
                    helperText={
                      formik.touched.cedula_beneficiario && formik.errors.cedula_beneficiario
                    }
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingBeneficiarios ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              startIcon={<ArrowLeft size={20} />}
              onClick={() => navigate('/dashboard/dependientes')}
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

export default DependienteForm;