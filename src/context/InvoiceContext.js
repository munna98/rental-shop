// src/context/InvoiceContext.js
import React, { createContext, useReducer, useContext, useEffect } from "react";
import { fetchCustomers, fetchItems, fetchLastInvoiceNumber } from "@/services/api";

const InvoiceContext = createContext();

const initialState = {
  invoiceNumber: "INV001",
  selectedItems: [],
  selectedCustomer: null,
  deliveryDate: "",
  weddingDate: "",
  totalAmount: 0,
  customers: [],
  items: [],
  receiptDetails: {
    advanceAmount: 0,
    receiptMethod: "cash",
    notes: "",
  },
  loading: true,
  error: null,
};

const invoiceReducer = (state, action) => {
  switch (action.type) {
    case "SET_INVOICE_NUMBER":
      return {
        ...state,
        invoiceNumber: action.payload,
      };
    
    case "NEXT_INVOICE":
      const currentNumber = parseInt(state.invoiceNumber.replace("INV", ""));
      return {
        ...state,
        invoiceNumber: `INV${(currentNumber + 1).toString().padStart(3, '0')}`,
      };
    
    case "PREVIOUS_INVOICE":
      const prevNumber = parseInt(state.invoiceNumber.replace("INV", ""));
      if (prevNumber > 1) {
        return {
          ...state,
          invoiceNumber: `INV${(prevNumber - 1).toString().padStart(3, '0')}`,
        };
      }
      return state;
    case "SET_CUSTOMER":
      return {
        ...state,
        selectedCustomer:
          state.customers.find((customer) => customer._id === action.payload) ||
          null,
      };
    case "SET_DELIVERY_DATE":
      return { ...state, deliveryDate: action.payload };
    case "SET_WEDDING_DATE":
      return { ...state, weddingDate: action.payload };
    case "ADD_ITEM":
      // Ensure unique identifier for the item
      const newItem = {
        ...action.payload,
        uniqueId: Date.now().toString(), // Add a unique identifier
      };
      return {
        ...state,
        selectedItems: [...state.selectedItems, newItem],
        totalAmount: state.totalAmount + newItem.rentRate,
      };
    case "REMOVE_ITEM":
      const removedItem = state.selectedItems.find(
        (item) => item.uniqueId === action.payload
      );
      return {
        ...state,
        selectedItems: state.selectedItems.filter(
          (item) => item.uniqueId !== action.payload
        ),
        totalAmount:
          state.totalAmount - (removedItem ? removedItem.rentRate : 0),
      };
    case "SET_CUSTOMERS":
      return { ...state, customers: action.payload };
    case "SET_ITEMS":
      return { ...state, items: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "NEXT_INVOICE":
      return {
        ...state,
        invoiceNumber: `INV${
          parseInt(state.invoiceNumber.replace("INV", "")) + 1
        }`,
      };
    case "PREVIOUS_INVOICE":
      return {
        ...state,
        invoiceNumber: `INV${
          parseInt(state.invoiceNumber.replace("INV", "")) - 1
        }`,
      };
    case "UPDATE_RECEIPT_DETAILS":
      return {
        ...state,
        receiptDetails: {
          ...state.receiptDetails,
          ...action.payload,
        },
      };
    case "RESET_RECEIPT_DETAILS":
      return {
        ...state,
        receiptDetails: initialState.receiptDetails,
      };
    default:
      return state;
  }
};

export const InvoiceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(invoiceReducer, initialState);

  const refreshInvoiceNumber = async () => {
    try {
      const lastInvoiceNumber = await fetchLastInvoiceNumber();
      const lastNumber = parseInt(lastInvoiceNumber.replace("INV", ""));
      const nextInvoiceNumber = `INV${(lastNumber + 1).toString().padStart(3, '0')}`;
      dispatch({ type: "SET_INVOICE_NUMBER", payload: nextInvoiceNumber });
    } catch (error) {
      console.error("Failed to refresh invoice number", error);
    }
  };

  const fetchReceiptsForInvoice = async (invoiceId) => {
    try {
      const response = await fetch(`/api/receipts?invoiceId=${invoiceId}`);
      if (!response.ok) throw new Error('Failed to fetch receipts');
      return await response.json();
    } catch (error) {
      console.error('Error fetching receipts:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const [fetchedCustomers, fetchedItems, lastInvoiceNumber] = await Promise.all([
          fetchCustomers(),
          fetchItems(),
          fetchLastInvoiceNumber()
        ]);

        dispatch({ type: "SET_CUSTOMERS", payload: fetchedCustomers });
        dispatch({ type: "SET_ITEMS", payload: fetchedItems });
        
        // Set the next invoice number based on the last invoice
        const lastNumber = parseInt(lastInvoiceNumber.replace("INV", ""));
        const nextInvoiceNumber = `INV${(lastNumber + 1).toString().padStart(3, '0')}`;
        dispatch({ type: "SET_INVOICE_NUMBER", payload: nextInvoiceNumber });

      } catch (error) {
        console.error("Failed to fetch data", error);
        dispatch({ type: "SET_ERROR", payload: "Failed to fetch data" });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    fetchData();
  }, []);

  const handlePrevious = () => {
    dispatch({ type: "PREVIOUS_INVOICE" });
  };

  const handleNext = () => {
    dispatch({ type: "NEXT_INVOICE" });
  };

  const handleAddItem = (item) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const handleRemoveItem = (uniqueId) => {
    dispatch({ type: "REMOVE_ITEM", payload: uniqueId });
  };

  return (
    <InvoiceContext.Provider
      value={{
        ...state,
        handlePrevious,
        handleNext,
        handleAddItem,
        handleRemoveItem,
        dispatch,
        refreshInvoiceNumber,
        fetchReceiptsForInvoice,
        updateReceiptDetails: (details) => 
          dispatch({ type: "UPDATE_RECEIPT_DETAILS", payload: details }),
        resetReceiptDetails: () => 
          dispatch({ type: "RESET_RECEIPT_DETAILS" }),
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoice = () => {
  return useContext(InvoiceContext);
};
