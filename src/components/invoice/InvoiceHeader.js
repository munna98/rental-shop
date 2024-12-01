// src/components/invoice/InvoiceHeader.jsx
import React from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useInvoice } from "@/context/InvoiceContext/InvoiceContext";


const InvoiceHeader = () => {
  const { invoiceNumber, handlePrevious, handleNext, loading } = useInvoice();
  const currentNumber = parseInt(invoiceNumber.replace("INV", ""));

  return (
    <Box
      sx={{
        marginBottom: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Invoice
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Button
          variant="outlined"
          onClick={handlePrevious}
          aria-label="Previous Invoice"
          disabled={loading || currentNumber <= 1}
        >
          <ChevronLeftIcon />
        </Button>

        <Box sx={{ margin: "0 16px", display: "flex", alignItems: "center" }}>
          {loading ? (
            <CircularProgress size={20} sx={{ margin: "0 8px" }} />
          ) : (
            <Typography variant="subtitle1">
              # {invoiceNumber}
            </Typography>
          )}
        </Box>

        <Button 
          variant="outlined" 
          onClick={handleNext} 
          aria-label="Next Invoice"
          disabled={loading}
        >
          <ChevronRightIcon />
        </Button>
      </Box>
    </Box>
  );
};


export default InvoiceHeader;
