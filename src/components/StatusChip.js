import React from 'react';
import { Chip } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import BuildIcon from '@mui/icons-material/Build';
import HelpIcon from '@mui/icons-material/Help';

const StatusChip = ({ status }) => {
  // Define status configurations
  const statusConfig = {
    Rented: {
      color: 'primary',
      icon: <ShoppingCartIcon fontSize="small" />,
      label: 'Rented'
    },
    Available: {
      color: 'success',
      icon: <CheckCircleIcon fontSize="small" />,
      label: 'Available'
    },
    Damaged: {
      color: 'error',
      icon: <ErrorIcon fontSize="small" />,
      label: 'Damaged'
    },
    Maintanance: {  // Note: You might want to fix the spelling to "Maintenance"
      color: 'warning',
      icon: <BuildIcon fontSize="small" />,
      label: 'Maintanance'
    }
  };

  // Default configuration for unknown status
  const defaultConfig = {
    color: 'default',
    icon: <HelpIcon fontSize="small" />,
    label: status || 'Unknown'
  };

  // Get configuration for current status or use default
  const config = statusConfig[status] || defaultConfig;

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      color={config.color}
      size="small"
      variant="outlined"
      sx={{
        fontWeight: 'bold',
        textTransform: 'capitalize',
        '& .MuiChip-icon': {
          marginLeft: '5px'
        }
      }}
    />
  );
};

export default StatusChip;