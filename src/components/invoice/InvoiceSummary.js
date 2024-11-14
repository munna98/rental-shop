// src/components/invoice/ReceiptDetails
import React from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import { generateWhatsAppLink } from '@/services/whatsapp';
import { useInvoice, ACTIONS } from '@/context/InvoiceContext';

const InvoiceSummary = () => {
  const theme = useTheme();
  const {
    totalAmount,
    invoiceNumber,
    selectedCustomer,
    selectedItems,
    deliveryDate,
    weddingDate,
    receipts,
    refreshInvoiceNumber,
    dispatch,
    saveInvoiceWithReceipts,
  } = useInvoice();

  const customerDetails = selectedCustomer;

    // Calculate paidAmount and balanceAmount
    const paidAmount = receipts.reduce((sum, receipt) => sum + parseFloat(receipt.amount || 0), 0);
    const balanceAmount = totalAmount - paidAmount;
  
    const handleSave = async () => {
      if (!selectedCustomer) {
        alert("Please select a customer to proceed.");
        return null;
      }
    
      try {
        const invoiceData = {
          invoiceNumber,
          customer: selectedCustomer,
          items: selectedItems.map(item => ({
            ...item,
            measurement: item.measurement || [
              { item: '', sleeve: '', waist: '', length: '', pantsize: '' }
            ],
          })),
          totalAmount,
          deliveryDate,
          weddingDate,
        };
    
        const result = await saveInvoiceWithReceipts(invoiceData, receipts);
        
        if (result.success) {
          dispatch({ 
            type: ACTIONS.UPDATE_INVOICE_STATUS,   
            payload: result.invoice 
          });
          dispatch({ type: ACTIONS.RESET_RECEIPTS });
          await refreshInvoiceNumber();
          alert('Invoice and receipts saved successfully!');
          return result;
        }
        return null;
      } catch (error) {
        console.error('Error saving invoice:', error);
        alert(
          error.message.includes('Critical error') 
            ? 'A critical error occurred. Please contact support.'
            : 'Failed to save invoice. Please try again.'
        );
        return null;
      }
    };

    const handleSaveAndSendWhatsApp = async () => {
      if (!customerDetails) {
        alert("Please select a customer to proceed.");
        return;
      }
    
      try {
        // First save the invoice and get the result
        const saveResult = await handleSave();
        
        // Only proceed if save was successful
        if (!saveResult?.success) {
          throw new Error('Failed to save invoice and receipts');
        }
    
        // Then generate and open WhatsApp link
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
          paidAmount: saveResult.invoice.paidAmount,   
          balanceAmount: totalAmount - saveResult.invoice.paidAmount,
          deliveryDate,
          weddingDate
        });
    
        window.open(whatsappMessage, '_blank');
      } catch (error) {
        console.error('Error in save and send:', error);
        alert('Failed to complete the operation. Please try again.');
      }
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

        <Typography variant="body1" gutterBottom>
          Paid Amount: ₹{paidAmount.toLocaleString()}
        </Typography>

        <Typography variant="body1" gutterBottom>
          Balance Amount: ₹{balanceAmount.toLocaleString()}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          fullWidth
          disabled={!customerDetails}
          sx={{
            backgroundColor: '#CE5A67',
            '&:hover': {
              backgroundColor: '#b44851',
            },
          }}
        >
          Save Invoice
        </Button>
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