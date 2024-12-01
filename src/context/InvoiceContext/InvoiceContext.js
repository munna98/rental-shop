import React, { createContext, useReducer, useEffect, useContext } from "react";
import invoiceReducer, { initialState } from "./invoiceReducer";
import * as asyncActions from "./asyncActions";
import * as utils from "./utilityFunctions";
import { ACTIONS } from "./actions";
import { NewKeyInstance } from "twilio/lib/rest/api/v2010/account/newKey";

const InvoiceContext = createContext();

export const InvoiceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(invoiceReducer, initialState);

  const toggleEditMode = (mode) => {
    dispatch({ 
      type: ACTIONS.TOGGLE_EDIT_MODE, 
      payload: mode 
    });
  };

  const editInvoice = async (invoiceNumber, editedData) => {
    return await asyncActions.editInvoice(invoiceNumber, editedData, dispatch);
  };

  const loadInvoice = async (invoiceNumber) => {
    await asyncActions.loadInvoice(invoiceNumber, dispatch);
  };

  const refreshInvoiceNumber = async () => {
    await asyncActions.refreshInvoiceNumber(dispatch);
  };

  const saveInvoiceWithReceipts = async (invoiceData, receipts) => {
    return await asyncActions.saveInvoiceWithReceipts(invoiceData, receipts, dispatch);
  };
    

  const resetInvoice = () => {
    dispatch({ type: ACTIONS.RESET_INVOICE });
    refreshInvoiceNumber();
  };

  // const handlePrevious = () => utils.navigateInvoice("previous", state, loadInvoice);

  // const handleNext = () => utils.navigateInvoice("next", state, loadInvoice);

  // const handlePrevious = () => {
  //   toggleEditMode(false); // Disable edit mode on navigation
  //   utils.navigateInvoice("previous", state, loadInvoice);
  // };

  const handlePrevious = () => {
    // If in edit mode, prompt user about unsaved changes
    if (state.isEditMode && !state.isNewInvoice) {
      const confirmNavigation = window.confirm(
        "You have unsaved changes. Are you sure you want to navigate away?"
      );
      
      if (!confirmNavigation) return;
    }

    toggleEditMode(false); // Disable edit mode on navigation
    utils.navigateInvoice("previous", state, loadInvoice);
  };

  
  // const handleNext = () => {
  //   toggleEditMode(false); // Disable edit mode on navigation
  //   utils.navigateInvoice("next", state, loadInvoice);
  // };


  const handleNext = () => {
    // Similar prompt for unsaved changes
    if (state.isEditMode && !state.isNewInvoice) {
      const confirmNavigation = window.confirm(
        "You have unsaved changes. Are you sure you want to navigate away?"
      );
      
      if (!confirmNavigation) return;
    }

    toggleEditMode(false); // Disable edit mode on navigation
    utils.navigateInvoice("next", state, loadInvoice);
  };

  const fetchData = async () => {
    await asyncActions.fetchData(dispatch);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <InvoiceContext.Provider
      value={{
        ...state,
        dispatch,
        refreshInvoiceNumber,
        saveInvoiceWithReceipts,
        resetInvoice,
        handlePrevious,
        handleNext,
        loadInvoice,
        toggleEditMode,
        editInvoice,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoice = () => useContext(InvoiceContext);
