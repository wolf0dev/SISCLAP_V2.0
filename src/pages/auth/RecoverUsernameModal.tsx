import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Modal,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface RecoverUsernameModalProps {
  open: boolean;
  handleClose: () => void;
}

const RecoverUsernameModal: React.FC<RecoverUsernameModalProps> = ({ open, handleClose }) => {
  const { recoverUsername } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [recoveredUsername, setRecoveredUsername] = useState('');

  const formik = useFormik({
    initialValues: {
      ced_user: '',
      nom_user: '',
    },
    validationSchema: Yup.object({
      ced_user: Yup.string()
        .required('La cédula es requerida')
        .matches(/^[0-9]+$/, 'La cédula debe contener solo números'),
      nom_user: Yup.string().required('El nombre es requerido'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await recoverUsername(values.ced_user, values.nom_user);
        setRecoveredUsername(response.Usuario);
        setSuccess(true);
      } catch (error) {
        console.error('Error al recuperar usuario:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleCloseModal = () => {
    setSuccess(false);
    setRecoveredUsername('');
    formik.resetForm();
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleCloseModal} aria-labelledby="recover-username-title">
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
        <Typography id="recover-username-title" variant="h5" component="h2" align="center" gutterBottom>
          Recuperar Nombre de Usuario
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Tu nombre de usuario es: <strong>{recoveredUsername}</strong>
          </Alert>
        )}

        {!success && (
          <>
            <Typography variant="body2" color="text.secondary" paragraph>
              Ingresa tu cédula y nombre completo para recuperar tu nombre de usuario.
            </Typography>

            <form onSubmit={formik.handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="ced_user"
                label="Cédula"
                name="ced_user"
                autoComplete="off"
                autoFocus
                value={formik.values.ced_user}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.ced_user && Boolean(formik.errors.ced_user)}
                helperText={formik.touched.ced_user && formik.errors.ced_user}
                disabled={loading}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                id="nom_user"
                label="Nombre Completo"
                name="nom_user"
                autoComplete="off"
                value={formik.values.nom_user}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.nom_user && Boolean(formik.errors.nom_user)}
                helperText={formik.touched.nom_user && formik.errors.nom_user}
                disabled={loading}
              />

              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Recuperar Usuario'}
              </Button>
            </form>
          </>
        )}

        <Button fullWidth variant="outlined" onClick={handleCloseModal}>
          Cerrar
        </Button>
      </Box>
    </Modal>
  );
};

export default RecoverUsernameModal;