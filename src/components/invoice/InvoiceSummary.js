import React from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import { generateWhatsAppLink } from '@/services/whatsapp';
import { useInvoice } from '@/context/InvoiceContext';

const InvoiceSummary = () => {
  const theme = useTheme();
  const {
    totalAmount,
    invoiceNumber,
    selectedCustomer,
    selectedItems,
    deliveryDate,
    weddingDate,
    customers,
  } = useInvoice();

  // Find customer details based on selectedCustomer
  const customerDetails = selectedCustomer;

  const handleSaveAndSendWhatsApp = () => {
    if (!customerDetails) {
      alert("Please select a customer to proceed.");
      return;
    }

    // Map items with the correct measurement structure
    const formattedItems = selectedItems.map(item => ({
      name: item.name,
      measurement: item.measurement || [
        {
          item: '',
          sleeve: '',
          waist: '',
          length: '',
          pantsize: '',
        }
      ],
      rentRate: item.rentRate
    }));

    const whatsappMessage = generateWhatsAppLink({
      invoiceNumber,
      customerName: customerDetails.name,
      customer: customerDetails.mobile,
      items: formattedItems,
      totalAmount,
      deliveryDate,
      weddingDate
    });

    window.open(whatsappMessage, '_blank');
  };

  return (
    <Box
      sx={{
        background: theme.palette.mode === 'dark' 
          ? 'rgba(206, 90, 103, 0.4)' 
          : 'rgba(206, 90, 103, 0.2)',
        padding: 3,
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Typography variant="h6" color="#CE5A67" gutterBottom>
        Invoice Summary
      </Typography>
      
      <Box sx={{ marginY: 2 }}>
        <Typography variant="body1" gutterBottom>
          Invoice Number: {invoiceNumber}
        </Typography>
        
        {customerDetails && (
          <>
            <Typography variant="body1" gutterBottom>
              Customer: {customerDetails.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Mobile: {customerDetails.mobile}
            </Typography>
          </>
        )}

        {deliveryDate && (
          <Typography variant="body1" gutterBottom>
            Delivery Date: {new Date(deliveryDate).toLocaleDateString()}
          </Typography>
        )}

        {weddingDate && (
          <Typography variant="body1" gutterBottom>
            Wedding Date: {new Date(weddingDate).toLocaleDateString()}
          </Typography>
        )}

        <Typography variant="body1" gutterBottom>
          Items Count: {selectedItems.length}
        </Typography>

        <Typography variant="h6" color="#CE5A67" sx={{ marginY: 1 }}>
          Total Amount: ₹{totalAmount.toLocaleString()}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveAndSendWhatsApp}
          fullWidth
          disabled={!customerDetails}
          sx={{
            backgroundColor: '#CE5A67',
            '&:hover': {
              backgroundColor: '#b44851',
            },
          }}
        >
          Save & Send WhatsApp
        </Button>
      </Box>
    </Box>
  );
};

export default InvoiceSummary;