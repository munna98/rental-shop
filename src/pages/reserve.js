import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
} from '@mui/material';

const ReservePage = () => {

  return (
    <Box sx={{ padding: 4, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Reserve Item
      </Typography>
      <Paper sx={{ padding: 3, borderRadius: 2, boxShadow: 2 }}>
      <Typography variant="1" gutterBottom>
        Under Maintanance
      </Typography>
      </Paper>
    </Box>
  );
};

export default ReservePage;

