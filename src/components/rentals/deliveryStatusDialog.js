
// src/components/rentals/DeliveryStatusDialog.js
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
} from '@mui/material';
import { useRentals } from '@/context/RentalsContext';

const DELIVERY_STATUSES = {
    PENDING: 'Pending Delivery',
    DELIVERED: 'Delivered',
    YET_TO_DELIVER: 'Yet to Deliver'
  };

const DeliveryStatusDialog = ({ open, item, onClose }) => {
  const { handleDeliveryStatusChange } = useRentals();

  const handleStatusChange = async (newStatus) => {
    await handleDeliveryStatusChange(item, newStatus);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update Delivery Status</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Select the new delivery status for {item?.item}
        </DialogContentText>
        <Box sx={{ mt: 2 }}>
          {Object.values(DELIVERY_STATUSES).map((status) => (
            <Button
              key={status}
              variant="outlined"
              sx={{ mr: 1, mb: 1 }}
              onClick={() => handleStatusChange(status)}
            >
              {status}
            </Button>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeliveryStatusDialog;