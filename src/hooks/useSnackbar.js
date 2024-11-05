// hooks/useSnackbar.js
import { useState, useCallback } from 'react';
import { Alert, Snackbar } from '@mui/material';

export const useSnackbar = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const showSnackbar = useCallback((message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  }, []);

  const hideSnackbar = useCallback(() => {
    setSnackbar(prev => ({
      ...prev,
      open: false,
    }));
  }, []);

  const SnackbarComponent = useCallback(() => (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={3000}
      onClose={hideSnackbar}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert 
        onClose={hideSnackbar} 
        severity={snackbar.severity} 
        sx={{ width: '100%' }}
        elevation={6}
        variant="filled"
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  ), [snackbar, hideSnackbar]);

  return {
    showSnackbar,
    hideSnackbar,
    SnackbarComponent,
  };
};