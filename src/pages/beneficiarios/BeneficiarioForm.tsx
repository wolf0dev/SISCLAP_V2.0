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
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
} from '@mui/material';
import { Save, ArrowLeft } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { beneficiarioService, Beneficiario } from '../../services/beneficiarioService';
import { calleService, Calle } from '../../services/calleService';
import { useSnackbar } from '../../contexts/SnackbarContext';
import PageHeader from '../../components/common/PageHeader';
import LoadingOverlay from '../../components/common/LoadingOverlay';

// Definir las constantes para el género
const generos = ['Masculino', 'Femenino'];

const estadosCiviles = ['Soltero', 'Casado', 'Divorciado', 'Viudo', 'Unión Libre'];
const gradosInstruccion = [
  'Sin Instrucción',
  'Primaria',
  'Secundaria',
  'Técnico',
  'Universitario',
  'Postgrado',
];

const BeneficiarioForm: React.FC = () => {
  const { cedula } = useParams<{ cedula: string }>();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [tieneDependientes, setTieneDependientes] = useState('no');
  const [calles, setCalles] = useState<Calle[]>([]);
  const isEditing = !!cedula;

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
    numero_casa: Yup.string().required('El número de casa es requerido'),
    id_calle: Yup.number().required('La calle es requerida'),
    estado_civil: Yup.string().required('El estado civil es requerido'),
    estatus: Yup.string(),
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
      numero_casa: '',
      id_calle: 0,
      estado_civil: '',
      estatus: 'Activo',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        if (isEditing) {
          const { cedula: cedBeneficiario, ...updateData } = values;
          await beneficiarioService.update(cedula!, updateData);
          showSnackbar('Beneficiario actualizado exitosamente', 'success');
        } else {
          await beneficiarioService.create(values);
          showSnackbar('Beneficiario creado exitosamente', 'success');

          if (tieneDependientes === 'si') {
            navigate(`/dashboard/dependientes/new?beneficiario=${values.cedula}`);
            return;
          }
        }
        navigate('/dashboard/beneficiarios');
      } catch (error: any) {
        console.error('Error al guardar beneficiario:', error);
        const errorMessage = error.response?.data?.error || 'Error al guardar el beneficiario';
        showSnackbar(errorMessage, 'error');
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
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

    fetchCalles();

    if (isEditing) {
      fetchBeneficiario();
    }
  }, [cedula, isEditing]);

  const fetchBeneficiario = async () => {
    setInitialLoading(true);
    try {
      const data = await beneficiarioService.getById(cedula!);
      const fechaNacimiento = new Date(data.fecha_nacimiento).toISOString().split('T')[0];
      formik.setValues({
        ...data,
        fecha_nacimiento: fechaNacimiento,
      });
    } catch (error: any) {
      console.error('Error al obtener beneficiario:', error);
      const errorMessage = error.response?.data?.error || 'Error al cargar los datos del beneficiario';
      showSnackbar(errorMessage, 'error');
      navigate('/dashboard/beneficiarios');
    } finally {
      setInitialLoading(false);
    }
  };

  if (initialLoading) {
    return <LoadingOverlay open={initialLoading} message="Cargando datos del beneficiario..." />;
  }

  return (
    <Box>
      <PageHeader
        title={isEditing ? 'Editar Beneficiario' : 'Nuevo Beneficiario'}
        breadcrumbs={[
          { label: 'Inicio', path: '/dashboard' },
          { label: 'Beneficiarios', path: '/dashboard/beneficiarios' },
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
                Información de Ubicación
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl
                fullWidth
                error={formik.touched.id_calle && Boolean(formik.errors.id_calle)}
                disabled={loading}
              >
                <InputLabel id="calle-label">Calle</InputLabel>
                <Select
                  labelId="calle-label"
                  id="id_calle"
                  name="id_calle"
                  value={formik.values.id_calle}
                  label="Calle"
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

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="numero_casa"
                name="numero_casa"
                label="Número de Casa"
                value={formik.values.numero_casa}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.numero_casa && Boolean(formik.errors.numero_casa)}
                helperText={formik.touched.numero_casa && formik.errors.numero_casa}
                disabled={loading}
              />
            </Grid>

            {!isEditing && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Dependientes
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <FormControl component="fieldset">
                  <FormLabel component="legend">¿Tiene dependientes?</FormLabel>
                  <RadioGroup
                    row
                    value={tieneDependientes}
                    onChange={(e) => setTieneDependientes(e.target.value)}
                  >
                    <FormControlLabel value="si" control={<Radio />} label="Sí" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>

                {tieneDependientes === 'si' && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Después de guardar el beneficiario, será redirigido a la página de registro de dependientes.
                  </Alert>
                )}
              </Grid>
            )}
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              startIcon={<ArrowLeft size={20} />}
              onClick={() => navigate('/dashboard/beneficiarios')}
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

export default BeneficiarioForm;