// src/hooks/useConfirmation.js
import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

export const useConfirmation = () => {
  const [dialog, setDialog] = useState({ open: false, resolve: null, title: '', message: '' });
  
  const showConfirmation = useCallback(
    ({ title, message }) =>
      new Promise((resolve) => {
        setDialog({ open: true, title, message, resolve });
      }),
    []
  );

  const handleClose = useCallback(
    (value) => {
      setDialog((prevDialog) => ({ ...prevDialog, open: false }));
      dialog.resolve(value);
    },
    [dialog]
  );

  const ConfirmationDialog = () => (
    <Dialog open={dialog.open} onClose={() => handleClose(false)}>
      <DialogTitle>{dialog.title}</DialogTitle>
      <DialogContent>{dialog.message}</DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(false)}>Cancel</Button>
        <Button onClick={() => handleClose(true)} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );

  return { showConfirmation, ConfirmationDialog };
};
