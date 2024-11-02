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

// src/services/api.js

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
