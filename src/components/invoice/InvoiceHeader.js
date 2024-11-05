// src/components/invoice/InvoiceHeader.jsx
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useInvoice } from "@/context/InvoiceContext";

const InvoiceHeader = () => {
  const { invoiceNumber, handlePrevious, handleNext } = useInvoice();

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
          disabled={invoiceNumber === "INV1"}
        >
          <ChevronLeftIcon />
        </Button>

        <Typography variant="subtitle1" sx={{ margin: "0 16px" }}>
          # {invoiceNumber}
        </Typography>

        <Button variant="outlined" onClick={handleNext} aria-label="Next Invoice">
          <ChevronRightIcon />
        </Button>
      </Box>
    </Box>
  );
};

export default InvoiceHeader;
