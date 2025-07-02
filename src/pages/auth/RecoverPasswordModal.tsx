import React from 'react';
import { Modal, Box, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';

interface RecoverPasswordModalProps {
  open: boolean;
  handleClose: () => void;
}

const RecoverPasswordModal: React.FC<RecoverPasswordModalProps> = ({ open, handleClose }) => {
  const { recoverPassword } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState('');

  const formik = useFormik({
    initialValues: {
      correo: '',
      cedula: '',
    },
    validationSchema: Yup.object({
      correo: Yup.string()
        .email('Correo electrónico inválido')
        .required('El correo electrónico es requerido'),
      cedula: Yup.string()
        .required('La cédula es requerida')
        .matches(/^[0-9]+$/, 'La cédula debe contener solo números'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await recoverPassword(values.correo, values.cedula);
        setNewPassword(response.NuevaContraseña);
        setSuccess(true);
      } catch (error) {
        console.error('Error al recuperar contraseña:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleCloseModal = () => {
    setSuccess(false);
    setNewPassword('');
    formik.resetForm();
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleCloseModal}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" component="h2" align="center" gutterBottom>
          Recuperar Contraseña
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Tu nueva contraseña es: <strong>{newPassword}</strong>
            <br />
            Guarda esta contraseña en un lugar seguro.
          </Alert>
        )}

        {!success && (
          <form onSubmit={formik.handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="correo"
              label="Correo Electrónico"
              name="correo"
              autoComplete="off"
              autoFocus
              value={formik.values.correo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.correo && Boolean(formik.errors.correo)}
              helperText={formik.touched.correo && formik.errors.correo}
              disabled={loading}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="cedula"
              label="Cédula"
              name="cedula"
              autoComplete="off"
              value={formik.values.cedula}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.cedula && Boolean(formik.errors.cedula)}
              helperText={formik.touched.cedula && formik.errors.cedula}
              disabled={loading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Recuperar Contraseña'}
            </Button>
          </form>
        )}

        <Button fullWidth variant="outlined" onClick={handleCloseModal}>
          Cerrar
        </Button>
      </Box>
    </Modal>
  );
};

export default RecoverPasswordModal;