// src/services/api.js

export const fetchCustomers = async () => {
  const response = await fetch("/api/customers"); // Replace with your actual API endpoint
  if (!response.ok) {
    throw new Error("Failed to fetch customers");
  }
  return response.json();
};

export const fetchItems = async () => {
  const response = await fetch("/api/sub-items"); // Replace with your actual API endpoint
  if (!response.ok) {
    throw new Error("Failed to fetch items");
  }
  return response.json();
};

export const fetchAccounts = async () => {
  const response = await fetch("/api/accounts"); // Replace with your actual API endpoint
  if (!response.ok) {
    throw new Error("Failed to fetch accounts");
  }
  return response.json();
};


// *************INVOICE*****************

export const fetchLastInvoiceNumber = async () => {
  try {
    const response = await fetch('/api/invoices/latest');
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch latest invoice number');
    }
    
    return data.data;
  } catch (error) {
    throw new Error(`Error fetching latest invoice number: ${error.message}`);
  }
};



// Add this function to your existing api.js file
export const saveInvoice = async (invoiceData) => {
  try {
    const response = await fetch("/api/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invoiceData),
    });

    if (!response.ok) {
      throw new Error("Failed to save invoice");
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving invoice:", error);
    throw error;
  }
};

 // Update invoice with new payment information
// export const updateInvoicePayments = async (invoiceId) => {
//   try {
//     const invoice = await Invoice.findById(invoiceId).populate('receipts');
    
//     // Calculate total paid amount from all receipts
//     const totalPaidAmount = invoice.receipts.reduce(
//       (sum, receipt) => sum + parseFloat(receipt.amount || 0),
//       0
//     );

//     // Update invoice with new payment information
//     const updatedInvoice = await Invoice.findByIdAndUpdate(
//       invoiceId,
//       {
//         paidAmount: totalPaidAmount,
//         balanceAmount: invoice.totalAmount - totalPaidAmount,
//         paymentStatus: totalPaidAmount >= invoice.totalAmount 
//           ? "completed" 
//           : totalPaidAmount > 0 
//             ? "partial" 
//             : "pending"
//       },
//       { new: true }
//     );

//     return updatedInvoice;
//   } catch (error) {
//     console.error("Error updating invoice payments:", error);
//     throw error;
//   }
// };

// Add this to fetch existing invoices if needed
export const getInvoices = async () => {
  try {
    const response = await fetch("/api/invoices");
    if (!response.ok) {
      throw new Error("Failed to fetch invoices");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};

// src/services/api.js

// ... existing api functions ...

// Fetch a single invoice by ID
export const fetchInvoiceById = async (id) => {
  try {
    const response = await fetch(`/api/invoices/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch invoice');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching invoice:', error);
    throw error;
  }
};

export const fetchInvoiceByNumber = async (invoiceNumber, action = null) => {
  try {
    const url = new URL(`/api/invoices/${invoiceNumber}`, window.location.origin);
    if (action) {
      url.searchParams.append('action', action);
    }

    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch invoice');
    }
    
    return {
      ...data.data,
      navigation: data.navigation
    };
  } catch (error) {
    throw new Error(`Error fetching invoice: ${error.message}`);
  }
};

// Update an invoice
export const updateInvoice = async (id, invoiceData) => {
  try {
    const response = await fetch(`/api/invoices/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoiceData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update invoice');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating invoice:', error);
    throw error;
  }
};

// Delete an invoice
export const deleteInvoice = async (id) => {
  try {
    const response = await fetch(`/api/invoices/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete invoice');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting invoice:', error);
    throw error;
  }
};
// src/services/api.js
// src/services/api.js

export const createReceipts = async (receiptData) => {
  try {
    // Format the receipt data before sending
    const formattedData = {
      ...receiptData,
      receipts: receiptData.receipts.map(receipt => ({
        amount: parseFloat(receipt.amount),
        date: receipt.date,
        method: receipt.method,
        note: receipt.note,
        customer: receipt.customer,
        invoiceNumber: receiptData.invoiceNumber,
        transactionType: receiptData.transactionType || 'receipt',
        sourcePage: receiptData.sourcePage || 'invoicing'
      }))
    };
    
    // Make the API call
    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    });

    // Log for debugging
    console.log('Sending receipt data:', formattedData);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create receipts');
    }

    const result = await response.json();
    
    // Log successful response
    console.log('Receipt creation response:', result);

    return result;
  } catch (error) {
    console.error('Error creating receipts:', error);
    throw error;
  }
};

export const deleteReceipts = async (transactionIds) => {
  try {
    const response = await fetch('/api/transactions/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ transactionIds }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete receipts');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting receipts:', error);
    throw error;
  }
};

// Add a new function to fetch receipts for an invoice
export const fetchReceiptsForInvoice = async (invoiceNumber) => {
  try {
    const response = await fetch(`/api/transactions?invoiceNumber=${invoiceNumber}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch receipts');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching receipts:', error);
    throw error;
  }
};

// Add a function to validate receipt data
export const validateReceiptData = (receiptData) => {
  const errors = [];

  if (!receiptData.receipts || !Array.isArray(receiptData.receipts)) {
    errors.push('Invalid receipts data');
  }

  if (!receiptData.customerId) {
    errors.push('Customer ID is required');
  }

  if (!receiptData.invoiceNumber) {
    errors.push('Invoice number is required');
  }

  receiptData.receipts?.forEach((receipt, index) => {
    if (!receipt.amount || isNaN(parseFloat(receipt.amount))) {
      errors.push(`Invalid amount for receipt at index ${index}`);
    }
    if (!receipt.date) {
      errors.push(`Missing date for receipt at index ${index}`);
    }
    if (!receipt.method) {
      errors.push(`Missing payment method for receipt at index ${index}`);
    }
  });

  return errors;
};