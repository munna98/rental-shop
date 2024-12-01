// src/components/invoice/invoiceSummary
import React, { useMemo } from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import { generateWhatsAppLink } from '@/services/whatsapp';
import { useInvoice, ACTIONS } from '@/context/InvoiceContext/InvoiceContext';
import { useSnackbar } from '@/hooks/useSnackbar';

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
  } = useInvoice();

  const customerDetails = selectedCustomer;

  // Memoize calculations for performance optimization
  const paidAmount = useMemo(
    () => receipts.reduce((sum, receipt) => sum + parseFloat(receipt.amount || 0), 0),
    [receipts]
  );
  const balanceAmount = useMemo(() => totalAmount - paidAmount, [totalAmount, paidAmount]);

  // Format date to improve code readability
  const formatDate = (date) => new Date(date).toLocaleDateString();

  // const handleSave = async () => {
  //   if (!selectedCustomer) {
  //     showSnackbar("Please select a customer to proceed.", "warning");
  //     return null;
  //   }

  //   try {
  //     const invoiceData = {
  //       invoiceNumber,
  //       customer: selectedCustomer,
  //       items: selectedItems.map(item => ({
  //         ...item,
  //         measurement: item.measurement || [
  //           { item: '', sleeve: '', waist: '', length: '', pantsize: '' }
  //         ],
  //         status: item.status || "Rented",
  //         deliveryStatus: item.deliveryStatus || "Pending",
  //       })),
  //       totalAmount,
  //       deliveryDate,
  //       weddingDate,
  //     };

  //     const result = await saveInvoiceWithReceipts(invoiceData, receipts);

  //     return null;
  //   } catch (error) {
  //     console.error('Error saving invoice:', error);
  //     showSnackbar(
  //       error.message.includes('Critical error') 
  //         ? 'A critical error occurred. Please contact support.'
  //         : 'Failed to save invoice. Please try again.',
  //       "error"
  //     );
  //     return null;
  //   }
  // };

  // const handleSaveAndSendWhatsApp = async () => {
  //   if (!customerDetails) {
  //     showSnackbar("Please select a customer to proceed.", "warning");
  //     return;
  //   }

  //   try {
  //     const saveResult = await handleSave();

  //     if (!saveResult?.success) {
  //       throw new Error('Failed to save invoice and receipts');
  //     }

  //     const formattedItems = selectedItems.map(item => ({
  //       name: item.name,
  //       measurement: item.measurement || [
  //         { item: '', sleeve: '', waist: '', length: '', pantsize: '' },
  //       ],
  //       rentRate: item.rentRate,
  //     }));

  //     const whatsappMessage = generateWhatsAppLink({
  //       invoiceNumber,
  //       customerName: customerDetails.name,
  //       customer: customerDetails.mobile,
  //       items: formattedItems,
  //       totalAmount,
  //       paidAmount: saveResult.invoice.paidAmount,
  //       balanceAmount: totalAmount - saveResult.invoice.paidAmount,
  //       deliveryDate,
  //       weddingDate,
  //     });

  //     window.open(whatsappMessage, '_blank');
  //   } catch (error) {
  //     console.error('Error in save and send:', error);
  //     showSnackbar('Failed to complete the operation. Please try again.', "error");
  //   }
  // };


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
            Delivery Date: {formatDate(deliveryDate)}
          </Typography>
        )}

        {weddingDate && (
          <Typography variant="body1" gutterBottom>
            Wedding Date: {formatDate(weddingDate)}
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
      
    </Box>
  );
};

export default InvoiceSummary;
