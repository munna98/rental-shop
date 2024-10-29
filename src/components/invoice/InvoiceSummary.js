// src/components/invoice/InvoiceSummary.js

import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { generateWhatsAppLink } from "@/services/whatsapp";

const InvoiceSummary = ({ 
  totalAmount, 
  invoiceNumber, 
  selectedCustomer, 
  selectedItems, 
  sampleCustomers 
}) => {
  const theme = useTheme();

  // Find customer details based on selectedCustomer ID
  const customerDetails = sampleCustomers.find(
    (cust) => cust.id === parseInt(selectedCustomer)
  );

  // Handle Save & Send WhatsApp function
  const handleSaveAndSendWhatsApp = () => {
    if (customerDetails) {
      const whatsappLink = generateWhatsAppLink({
        invoiceNumber,
        customerName: customerDetails.name,
        customerPhone: customerDetails.phone,
        items: selectedItems,
        totalAmount,
      });
      
      window.open(whatsappLink, "_blank"); // Open WhatsApp link in a new tab
    } else {
      alert("Please select a customer to proceed.");
    }
  };

  return (
    <Box
      sx={{
        background: theme.palette.mode === "dark" ? "rgba(206, 90, 103, 0.4)" : "rgba(206, 90, 103, 0.2)",
        padding: 2,
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Typography variant="h6" color="#CE5A67" gutterBottom>
        Summary
      </Typography>
      <Typography variant="body1">
        Total Amount: ₹{totalAmount}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSaveAndSendWhatsApp}
        fullWidth
        sx={{ marginTop: 2 }}
      >
        Save Invoice & Send WhatsApp
      </Button>
    </Box>
  );
};

export default InvoiceSummary;
