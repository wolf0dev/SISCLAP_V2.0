import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { calleService, Calle } from '../../services/calleService';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
} from '@mui/material';

const RegisterModal = ({ open, onClose }) => {
  const { register } = useAuth();
  const [calles, setCalles] = useState<Calle[]>([]);
  const [loadingCalles, setLoadingCalles] = useState(false);
  const [formData, setFormData] = useState({
    nom_user: '',
    ced_user: '',
    user: '',
    pass_user: '',
    correo: '',
    id_calle: 0,
  });

  useEffect(() => {
    if (open) {
      fetchCalles();
    }
  }, [open]);

  const fetchCalles = async () => {
    setLoadingCalles(true);
    try {
      const data = await calleService.getAll();
      setCalles(data);
    } catch (error) {
      console.error('Error al obtener calles:', error);
    } finally {
      setLoadingCalles(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'id_calle' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Enviamos id_rol_user como 2 (Jefe de Calle) por defecto
      await register({ ...formData, id_rol_user: 2 });
      onClose();
      setFormData({
        nom_user: '',
        ced_user: '',
        user: '',
        pass_user: '',
        correo: '',
        id_calle: 0,
      });
    } catch (error) {
      console.error('Error al registrar usuario:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Registro de Usuario</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nombre Completo"
            name="nom_user"
            value={formData.nom_user}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Cédula"
            name="ced_user"
            value={formData.ced_user}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Usuario"
            name="user"
            value={formData.user}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Contraseña"
            type="password"
            name="pass_user"
            value={formData.pass_user}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Correo"
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="calle-label">Calle</InputLabel>
            <Select
              labelId="calle-label"
              id="id_calle"
              name="id_calle"
              value={formData.id_calle}
              label="Calle"
              onChange={handleChange}
              disabled={loadingCalles}
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
            {loadingCalles && (
              <FormHelperText>
                <CircularProgress size={16} /> Cargando calles...
              </FormHelperText>
            )}
          </FormControl>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Cancelar
            </Button>
            <Button 
              type="submit" 
              color="primary" 
              disabled={formData.id_calle === 0 || loadingCalles}
            >
              Registrar
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterModal;