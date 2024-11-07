import React, { createContext, useContext, useReducer } from 'react';

const LedgerContext = createContext();

// Define action types
export const ACTIONS = {
  SET_LEDGERS: 'SET_LEDGERS',
  ADD_LEDGER: 'ADD_LEDGER',
  UPDATE_LEDGER: 'UPDATE_LEDGER',
  DELETE_LEDGER: 'DELETE_LEDGER',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};

const initialState = {
  ledgers: [],
  loading: false,
  error: null
};

function ledgerReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LEDGERS:
      return {
        ...state,
        ledgers: action.payload,
        loading: false
      };
    case ACTIONS.ADD_LEDGER:
      return {
        ...state,
        ledgers: [...state.ledgers, action.payload]
      };
    case ACTIONS.UPDATE_LEDGER:
      return {
        ...state,
        ledgers: state.ledgers.map(ledger =>
          ledger._id === action.payload._id ? action.payload : ledger
        )
      };
    case ACTIONS.DELETE_LEDGER:
      return {
        ...state,
        ledgers: state.ledgers.filter(ledger => ledger._id !== action.payload)
      };
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
}

export function LedgerProvider({ children }) {
  const [state, dispatch] = useReducer(ledgerReducer, initialState);

  const value = {
    ledgers: state.ledgers,
    loading: state.loading,
    error: state.error,
    dispatch
  };

  return (
    <LedgerContext.Provider value={value}>
      {children}
    </LedgerContext.Provider>
  );
}

export function useLedger() {
  const context = useContext(LedgerContext);
  if (!context) {
    throw new Error('useLedger must be used within a LedgerProvider');
  }
  return context;
}