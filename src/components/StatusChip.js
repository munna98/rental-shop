import React from 'react';
import { Chip } from '@mui/material';

const StatusChip = ({ status }) => {
  let color;

  // Determine chip color based on the status
  switch (status) {
    case 'On Rent':
      color = 'primary';
      break;
    case 'In Store':
      color = 'success';
      break;
    case 'Damaged':
      color = 'error';
      break;
    case 'Reserved':
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
