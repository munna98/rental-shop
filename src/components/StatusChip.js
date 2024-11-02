import React from 'react';
import { Chip } from '@mui/material';

const StatusChip = ({ status }) => {
  let color;

  // Determine chip color based on the status
  switch (status) {
    case 'Rented':
      color = 'primary';
      break;
    case 'Available':
      color = 'success';
      break;
    case 'Damaged':
      color = 'error';
      break;
    case 'Maintanance':
      color = 'warning'; // 'warning' gives a yellow/orange color for reserved items
      break;
    default:
      color = 'default';
  }

  return (
    <Chip 
      label={status} 
      color={color} 
      sx={{ fontWeight: 'bold', textTransform: 'capitalize' }} 
    />
  );
};

export default StatusChip;
