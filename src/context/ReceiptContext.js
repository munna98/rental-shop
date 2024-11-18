import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { fetchCustomers, createReceipts } from '@/services/api';

export const ACTIONS = {
  SET_CUSTOMERS: 'SET_CUSTOMERS',
  SET_RECEIPTS: 'SET_RECEIPTS',
  ADD_RECEIPT: 'ADD_RECEIPT',
  RESET_RECEIPTS: 'RESET_RECEIPTS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_SUBMITTING: 'SET_SUBMITTING'
};

const initialState = {
  customers: [],
  receipts: [],
  loading: false,
  submitting: false,
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
    case ACTIONS.SET_SUBMITTING:
      return { ...state, submitting: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false, submitting: false };
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
        dispatch({ 
          type: ACTIONS.SET_ERROR, 
          payload: 'Failed to load customers' 
        });
      }
    };
    loadCustomers();
  }, []);

  const addReceipt = (receipt) => {
    if (!receipt.entityId || !receipt.entityType) {
      return { 
        success: false, 
        error: "Please select a customer or account" 
      };
    }

    try {
      dispatch({ type: ACTIONS.ADD_RECEIPT, payload: receipt });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: "Failed to add receipt" 
      };
    }
  };

  const submitReceipts = async (entityId, entityType) => {
    if (state.submitting) {
      return { 
        success: false, 
        error: "Submission already in progress" 
      };
    }

    if (!entityId || !entityType) {
      return { 
        success: false, 
        error: "Please select a customer or account" 
      };
    }

    if (state.receipts.length === 0) {
      return { 
        success: false, 
        error: "Please add at least one receipt" 
      };
    }

    dispatch({ type: ACTIONS.SET_SUBMITTING, payload: true });

    try {
      const receiptData = {
        entityId,
        entityType,
        transactionType: "receipt",
        receipts: state.receipts.map(receipt => ({
          amount: receipt.amount,
          method: receipt.method,
          date: receipt.date,
          note: receipt.note || ''
        }))
      };

      const response = await createReceipts(receiptData);

      // Handle partial success
      if (response.status === 207) {
        dispatch({ type: ACTIONS.SET_SUBMITTING, payload: false });
        return {
          success: true,
          warning: "Some receipts could not be processed",
          errors: response.errors
        };
      }

      // Handle complete success
      dispatch({ type: ACTIONS.RESET_RECEIPTS });
      dispatch({ type: ACTIONS.SET_SUBMITTING, payload: false });
      return { success: true };

    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      dispatch({ type: ACTIONS.SET_SUBMITTING, payload: false });
      return { 
        success: false, 
        error: error.message || "Failed to submit receipts" 
      };
    }
  };

  const value = {
    customers: state.customers,
    receipts: state.receipts,
    loading: state.loading,
    submitting: state.submitting,
    error: state.error,
    addReceipt,
    submitReceipts,
    dispatch,
  };

  return (
    <ReceiptContext.Provider value={value}>
      {children}
    </ReceiptContext.Provider>
  );
}

export function useReceipt() {
  const context = useContext(ReceiptContext);
  if (!context) {
    throw new Error('useReceipt must be used within a ReceiptProvider');
  }
  return context;
}