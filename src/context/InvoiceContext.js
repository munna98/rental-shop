// src/context/InvoiceContext.js
import React, { createContext, useReducer, useContext, useEffect } from "react";
import { fetchCustomers, fetchItems } from "@/services/api";

const InvoiceContext = createContext();

const initialState = {
  invoiceNumber: "INV0001",
  selectedItems: [],
  selectedCustomer: null,
  deliveryDate: "",
  weddingDate: "",
  totalAmount: 0,
  customers: [],
  items: [],
  loading: true,
  error: null,
};

const invoiceReducer = (state, action) => {
  switch (action.type) {
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
        uniqueId: Date.now().toString() // Add a unique identifier
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
        totalAmount: state.totalAmount - (removedItem ? removedItem.rentRate : 0),
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
    default:
      return state;
  }
};

export const InvoiceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(invoiceReducer, initialState);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const fetchedCustomers = await fetchCustomers();
        const fetchedItems = await fetchItems();
        dispatch({ type: "SET_CUSTOMERS", payload: fetchedCustomers });
        dispatch({ type: "SET_ITEMS", payload: fetchedItems });
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
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoice = () => {
  return useContext(InvoiceContext);
};