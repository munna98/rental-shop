import React from 'react';
import { Chip } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const DeliveryStatusChip = ({ deliveryStatus }) => {
  // Define status configurations
  const statusConfig = {
    Pending: {
      color: 'warning',
      icon: <LocalShippingIcon fontSize="small" />,
      label: 'Pending'
    },
    Delivered: {
      color: 'success',
      icon: <CheckCircleIcon fontSize="small" />,
      label: 'Delivered'
    },
    Overdue: {
      color: 'error',
      icon: <ErrorIcon fontSize="small" />,
      label: 'Overdue'
    }
  };

  // Default to pending if status is undefined or not recognized
  const status = statusConfig[deliveryStatus] || statusConfig.Pending;

  return (
    <Chip
      icon={status.icon}
      label={status.label}
      color={status.color}
      size="small"
      variant="outlined"
      sx={{
        '& .MuiChip-icon': {
          marginLeft: '5px'
        }
      }}
    />
  );
};

export default DeliveryStatusChip;