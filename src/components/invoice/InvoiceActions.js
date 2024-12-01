import React from 'react';
import { Box, Button } from '@mui/material';
import { generateWhatsAppLink } from '@/services/whatsapp';
import { useInvoice } from '@/context/InvoiceContext/InvoiceContext';
import { useSnackbar } from '@/hooks/useSnackbar';

const InvoiceActions = () => {
  const {
    totalAmount,
    invoiceNumber,
    selectedCustomer,
    selectedItems,
    deliveryDate,
    weddingDate,
    receipts,
    saveInvoiceWithReceipts,
    updateInvoice, 
    toggleEditMode,
    isEditMode, 
    editInvoice,
    isNewInvoice,
    dispatch,
  } = useInvoice();

  const { showSnackbar, SnackbarComponent } = useSnackbar();

  const handleSave = async () => {
    if (!selectedCustomer) {
      showSnackbar("Please select a customer to proceed.", "warning");
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
          status: item.status || "Rented",
          deliveryStatus: item.deliveryStatus || "Pending",
        })),
        totalAmount,
        deliveryDate,
        weddingDate,
      };

  //     const result = await saveInvoiceWithReceipts(invoiceData, receipts);

  //     if (result?.success) {
  //       showSnackbar("Invoice saved successfully!", "success");
  //     }

  //     return result;
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


//   let result;
//   if (isEditMode) {
//     // Use editInvoice for existing invoice
//     result = await editInvoice(invoiceNumber, invoiceData);
//     if (result?.success) {
//       showSnackbar("Invoice updated successfully!", "success");
//       toggleEditMode(false); // Exit edit mode after successful update
//     }
//   } else {
//     // Save new invoice
//     result = await saveInvoiceWithReceipts(invoiceData, receipts);
//     if (result?.success) {
//       showSnackbar("Invoice saved successfully!", "success");
//     }
//   }

//   return result;
// } catch (error) {
//   console.error('Error saving/updating invoice:', error);
//   showSnackbar(
//     error.message.includes('Critical error')
//       ? 'A critical error occurred. Please contact support.'
//       : 'Failed to save/update invoice. Please try again.',
//     "error"
//   );
//   return null;
// }
// };


let result;
if (isNewInvoice) {
  // Save new invoice (POST)
  result = await saveInvoiceWithReceipts(invoiceData, receipts);
  if (result?.success) {
    showSnackbar("Invoice saved successfully!", "success");
    dispatch({ type: "SET_IS_NEW_INVOICE", payload: true }); // Update flag
  }
} else {
  // Update existing invoice (PUT)
  result = await editInvoice(invoiceNumber, invoiceData);
  if (result?.success) {
    showSnackbar("Invoice updated successfully!", "success");
    toggleEditMode(false);
  }
}

return result;
} catch (error) {
console.error('Error saving/updating invoice:', error);
showSnackbar(
  error.message.includes('Critical error')
    ? 'A critical error occurred. Please contact support.'
    : 'Failed to save/update invoice. Please try again.',
  "error"
);
return null;
}
};


  const handleSaveAndSendWhatsApp = async () => {
    if (!selectedCustomer) {
      showSnackbar("Please select a customer to proceed.", "warning");
      return;
    }

    try {
      const saveResult = await handleSave();

      if (!saveResult?.success) {
        throw new Error('Failed to save or update invoice and receipts');
      }

      const formattedItems = selectedItems.map(item => ({
        name: item.name,
        measurement: item.measurement || [
          { item: '', sleeve: '', waist: '', length: '', pantsize: '' },
        ],
        rentRate: item.rentRate,
      }));

      const whatsappMessage = generateWhatsAppLink({
        invoiceNumber,
        customerName: selectedCustomer.name,
        customer: selectedCustomer.mobile,
        items: formattedItems,
        totalAmount,
        paidAmount: saveResult.invoice.paidAmount,
        balanceAmount: totalAmount - saveResult.invoice.paidAmount,
        deliveryDate,
        weddingDate,
      });

      window.open(whatsappMessage, '_blank');
    } catch (error) {
      console.error('Error in save and send:', error);
      showSnackbar('Failed to complete the operation. Please try again.', "error");
    }
  };

  const handleEdit = () => {
    toggleEditMode(true);
    showSnackbar('Edit mode enabled', 'info');
  };

  const handleSend = () => {
    // Implement send logic here - you might want to add specific send functionality
    showSnackbar('Send functionality in development', 'info');
  };

  // Disable buttons if conditions are not met
  const isActionDisabled = !selectedCustomer || totalAmount <= 0 || selectedItems.length === 0;

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        width: '100%',
        marginTop: 2,
        flexDirection: {
          xs: 'column', // Stack buttons vertically on small devices
          sm: 'row', // Align buttons horizontally on medium and larger devices
        },
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        fullWidth
        disabled={isActionDisabled || !isEditMode}
      >
   {isNewInvoice ? "Save Invoice" : "Update Invoice"}
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSaveAndSendWhatsApp}
        fullWidth
        disabled={isActionDisabled || !isEditMode}
      >
        {isNewInvoice? "Save & Send WhatsApp" : "Update & Send WhatsApp"}
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleEdit}
        fullWidth
        disabled={isActionDisabled}
      >
        Edit
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleSend}
        fullWidth
        disabled={isActionDisabled}
      >
        Send
      </Button>
      <SnackbarComponent />
    </Box>
  );
  
};

export default InvoiceActions;