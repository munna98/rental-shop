// src/services/api.js

export const fetchCustomers = async () => {
    const response = await fetch('/api/customers'); // Replace with your actual API endpoint
    if (!response.ok) {
      throw new Error('Failed to fetch customers');
    }
    return response.json();
  };
  
  export const fetchItems = async () => {
    const response = await fetch('/api/sub-items'); // Replace with your actual API endpoint
    if (!response.ok) {
      throw new Error('Failed to fetch items');
    }
    return response.json();
  };
  