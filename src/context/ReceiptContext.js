import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { fetchCustomers, fetchAccounts, createReceipts  } from '@/services/api';

export const ACTIONS = {
  SET_CUSTOMERS: 'SET_CUSTOMERS',
  SET_ACCOUNTS: 'SET_ACCOUNTS',
  SET_RECEIPTS: 'SET_RECEIPTS',
  ADD_RECEIPT: 'ADD_RECEIPT',
  REMOVE_RECEIPTS_BY_ENTITY: 'REMOVE_RECEIPTS_BY_ENTITY',
  RESET_RECEIPTS: 'RESET_RECEIPTS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_SUBMITTING: 'SET_SUBMITTING'
};

const initialState = {
  customers: [],
  accounts: [],
  receipts: [],
  loading: false,
  submitting: false,
  error: null,
};

function receiptReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_CUSTOMERS:
      return { ...state, customers: action.payload };
    case ACTIONS.SET_ACCOUNTS:
      return { ...state, accounts: action.payload.data };
    case ACTIONS.SET_RECEIPTS:
      return { ...state, receipts: action.payload };
    case ACTIONS.ADD_RECEIPT:
      return { ...state, receipts: [...state.receipts, action.payload] };
    case ACTIONS.REMOVE_RECEIPTS_BY_ENTITY:
      return {
        ...state,
        receipts: state.receipts.filter(
          receipt => !(receipt.entityId === action.payload.entityId && 
                      receipt.entityType === action.payload.entityType)
        )
      };
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
    // In ReceiptProvider.jsx, modify the loadData function:
const loadData = async () => {
  dispatch({ type: ACTIONS.SET_LOADING, payload: true });
  try {
    console.log('Starting data fetch...');
    const [customers, accounts] = await Promise.all([
      fetchCustomers(),
      fetchAccounts()
    ]);
    
    console.log('Fetched data:', { customers, accounts });
    
    dispatch({ type: ACTIONS.SET_CUSTOMERS, payload: customers });
    dispatch({ type: ACTIONS.SET_ACCOUNTS, payload: accounts });
    dispatch({ type: ACTIONS.SET_LOADING, payload: false });
  } catch (error) {
    console.error('Error in loadData:', error);
    dispatch({ 
      type: ACTIONS.SET_ERROR, 
      payload: 'Failed to load data' 
    });
  }
};
    loadData();
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

    const entityReceipts = state.receipts.filter(
      receipt => receipt.entityId === entityId && receipt.entityType === entityType
    );

    if (entityReceipts.length === 0) {
      return { 
        success: false, 
        error: "No receipts found for this entity" 
      };
    }

    dispatch({ type: ACTIONS.SET_SUBMITTING, payload: true });

    try {
      const receiptData = {
        entityId,
        entityType,
        transactionType: "receipt",
        receipts: entityReceipts.map(receipt => ({
          amount: receipt.amount,
          method: receipt.method,
          date: receipt.date,
          note: receipt.note || ''
        })),
        sourcePage: "receipt",
      };

      const response = await createReceipts (receiptData);

      dispatch({ 
        type: ACTIONS.REMOVE_RECEIPTS_BY_ENTITY, 
        payload: { entityId, entityType } 
      });

      dispatch({ type: ACTIONS.SET_SUBMITTING, payload: false });

      if (response.status === 207) {
        return {
          success: true,
          warning: "Some receipts could not be processed",
          errors: response.errors
        };
      }

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
    accounts: state.accounts,
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