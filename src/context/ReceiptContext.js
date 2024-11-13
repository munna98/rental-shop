import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { fetchCustomers, createReceipts } from '@/services/api';

export const ACTIONS = {
  SET_CUSTOMERS: 'SET_CUSTOMERS',
  SET_RECEIPTS: 'SET_RECEIPTS',
  ADD_RECEIPT: 'ADD_RECEIPT',
  RESET_RECEIPTS: 'RESET_RECEIPTS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};

const initialState = {
  customers: [],
  receipts: [],
  loading: false,
  error: null,
};

function receiptReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_CUSTOMERS:
      return { ...state, customers: action.payload, loading: false };
    case ACTIONS.SET_RECEIPTS:
      return { ...state, receipts: action.payload };
    case ACTIONS.ADD_RECEIPT:
      return { ...state, receipts: [...state.receipts, action.payload] };
    case ACTIONS.RESET_RECEIPTS:
      return { ...state, receipts: [] };
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

const ReceiptContext = createContext();

export function ReceiptProvider({ children }) {
  const [state, dispatch] = useReducer(receiptReducer, initialState);

  useEffect(() => {
    const loadCustomers = async () => {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      try {
        const customers = await fetchCustomers();
        dispatch({ type: ACTIONS.SET_CUSTOMERS, payload: customers });
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to load customers' });
      }
    };
    loadCustomers();
  }, []);

  const addReceipt = (receipt) => {
    if (!receipt.customerId) {
      return { success: false, error: "Customer selection is required" };
    }
    dispatch({ type: ACTIONS.ADD_RECEIPT, payload: receipt });
    return { success: true };
  };

  const submitReceipts = async (customerId) => {
    if (!customerId || state.receipts.length === 0) {
      return { success: false, error: "Please select a customer and add at least one receipt" };
    }

    try {
      const receiptData = {
        receipts: state.receipts,
        customerId,
        transactionType: "receipt",
      };
      await createReceipts(receiptData);
      dispatch({ type: ACTIONS.RESET_RECEIPTS });
      return { success: true };
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: "Failed to submit receipts" });
      return { success: false, error: "Failed to submit receipts" };
    }
  };

  const value = {
    ...state,
    addReceipt,
    submitReceipts,
    dispatch,
  };

  return <ReceiptContext.Provider value={value}>{children}</ReceiptContext.Provider>;
}

export function useReceipt() {
  const context = useContext(ReceiptContext);
  if (!context) {
    throw new Error('useReceipt must be used within a ReceiptProvider');
  }
  return context;
}