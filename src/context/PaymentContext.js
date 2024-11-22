import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { fetchCustomers, fetchAccounts, createPayments } from '@/services/api';

export const ACTIONS = {
  SET_CUSTOMERS: 'SET_CUSTOMERS',
  SET_ACCOUNTS: 'SET_ACCOUNTS',
  SET_PAYMENTS: 'SET_PAYMENTS',
  ADD_PAYMENT: 'ADD_PAYMENT',
  REMOVE_PAYMENTS_BY_ENTITY: 'REMOVE_PAYMENTS_BY_ENTITY',
  RESET_PAYMENTS: 'RESET_PAYMENTS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_SUBMITTING: 'SET_SUBMITTING'
};

const initialState = {
  customers: [],
  accounts: [],
  payments: [],
  loading: false,
  submitting: false,
  error: null,
};

function paymentReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_CUSTOMERS:
      return { ...state, customers: action.payload };
    case ACTIONS.SET_ACCOUNTS:
      return { ...state, accounts: action.payload.data };
    case ACTIONS.SET_PAYMENTS:
      return { ...state, payments: action.payload };
    case ACTIONS.ADD_PAYMENT:
      return { ...state, payments: [...state.payments, action.payload] };
    case ACTIONS.REMOVE_PAYMENTS_BY_ENTITY:
      return {
        ...state,
        payments: state.payments.filter(
          payment => !(payment.entityId === action.payload.entityId && 
                      payment.entityType === action.payload.entityType)
        )
      };
    case ACTIONS.RESET_PAYMENTS:
      return { ...state, payments: [] };
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

const PaymentContext = createContext();

export function PaymentProvider({ children }) {
  const [state, dispatch] = useReducer(paymentReducer, initialState);

  useEffect(() => {
    // In PaymentProvider.jsx, modify the loadData function:
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

  const addPayment = (payment) => {
    if (!payment.entityId || !payment.entityType) {
      return { 
        success: false, 
        error: "Please select a customer or account" 
      };
    }

    try {
      dispatch({ type: ACTIONS.ADD_PAYMENT, payload: payment });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: "Failed to add payment" 
      };
    }
  };

  const submitPayments = async (entityId, entityType) => {
    if (state.submitting) {
      return { 
        success: false, 
        error: "Submission already in progress" 
      };
    }

    const entityPayments = state.payments.filter(
      payment => payment.entityId === entityId && payment.entityType === entityType
    );

    if (entityPayments.length === 0) {
      return { 
        success: false, 
        error: "No payments found for this entity" 
      };
    }

    dispatch({ type: ACTIONS.SET_SUBMITTING, payload: true });

    try {
      const paymentData = {
        entityId,
        entityType,
        transactionType: "payment",
        payments: entityPayments.map(payment => ({
          amount: payment.amount,
          method: payment.method,
          date: payment.date,
          note: payment.note || ''
        }))
      };

      const response = await createPayments(paymentData);

      dispatch({ 
        type: ACTIONS.REMOVE_PAYMENTS_BY_ENTITY, 
        payload: { entityId, entityType } 
      });

      dispatch({ type: ACTIONS.SET_SUBMITTING, payload: false });

      if (response.status === 207) {
        return {
          success: true,
          warning: "Some payments could not be processed",
          errors: response.errors
        };
      }

      return { success: true };

    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      dispatch({ type: ACTIONS.SET_SUBMITTING, payload: false });
      return { 
        success: false, 
        error: error.message || "Failed to submit payments" 
      };
    }
  };

  const value = {
    customers: state.customers,
    accounts: state.accounts,
    payments: state.payments,
    loading: state.loading,
    submitting: state.submitting,
    error: state.error,
    addPayment,
    submitPayments,
    dispatch,
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
}