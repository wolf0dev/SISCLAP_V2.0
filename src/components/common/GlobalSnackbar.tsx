import React from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';
import { useSnackbar } from '../../contexts/SnackbarContext';

interface GlobalSnackbarProps {
  open: boolean;
  message: string;
  severity: AlertColor;
}

const GlobalSnackbar: React.FC<GlobalSnackbarProps> = ({ open, message, severity }) => {
  const { hideSnackbar } = useSnackbar();

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    hideSnackbar();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalSnackbar;