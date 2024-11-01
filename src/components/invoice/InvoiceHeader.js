import React from "react";
import { Box, Typography, IconButton ,Button} from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const InvoiceHeader = ({ invoiceNumber, onPrevious, onNext }) => {
  return (
    <Box sx={{ marginBottom: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography variant="h4" gutterBottom>
        Invoice
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Button 
            variant="outlined"  onClick={onPrevious} aria-label="Previous Invoice">
          <ChevronLeftIcon />
        </Button>
        
        <Typography variant="subtitle1" sx={{ margin: '0 16px' }}>
          # {invoiceNumber}
        </Typography>
        
        <Button variant="outlined" onClick={onNext} aria-label="Next Invoice">
          <ChevronRightIcon />
        </Button>
      </Box>
    </Box>
  );
};

export default InvoiceHeader;
