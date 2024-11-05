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

// *************INVOICE*****************

export const fetchLastInvoiceNumber = async () => {
  try {
    const response = await fetch('/api/invoices/last-number');
    if (!response.ok) {
      throw new Error('Failed to fetch last invoice number');
    }
    const data = await response.json();
    return data.lastInvoiceNumber || 'INV000';
  } catch (error) {
    console.error('Error fetching last invoice number:', error);
    return 'INV000'; // fallback if no invoices exist yet
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

export const createReceipts = async (receiptData) => {
  try {
    const response = await fetch('/api/receipts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(receiptData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create receipts');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating receipts:', error);
    throw error;
  }
};