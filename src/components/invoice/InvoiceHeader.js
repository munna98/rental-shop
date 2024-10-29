import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const InvoiceHeader = ({ invoiceNumber, onPrevious, onNext }) => {
  return (
    <Box sx={{ marginBottom: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography variant="h4" gutterBottom>
        Invoice
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={onPrevious} aria-label="Previous Invoice">
          <ChevronLeftIcon />
        </IconButton>
        
        <Typography variant="subtitle1" sx={{ margin: '0 16px' }}>
          # {invoiceNumber}
        </Typography>
        
        <IconButton onClick={onNext} aria-label="Next Invoice">
          <ChevronRightIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default InvoiceHeader;
