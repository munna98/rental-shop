// hooks/useReturnConfirmation
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const useReturnConfirmation = ({ open, onClose, onConfirm, item }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Confirm Return</DialogTitle>
    <DialogContent>
      <Typography>
        Are you sure you want to mark this item as returned?
        <br />
        Item: {item?.item} (Code: {item?.code})
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button variant="contained" color="primary" onClick={onConfirm}>
        Confirm Return
      </Button>
    </DialogActions>
  </Dialog>
);

export default useReturnConfirmation;
