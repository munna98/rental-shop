import React, { createContext, useReducer, useContext, useEffect } from "react";
import {
  fetchCustomers,
  fetchItems,
  fetchLastInvoiceNumber,
  fetchInvoiceByNumber,
  createReceipts,
  saveInvoice,
} from "@/services/api";

const InvoiceContext = createContext();

export const ACTIONS = {
  SET_INVOICE_NUMBER: "SET_INVOICE_NUMBER",
  SET_CUSTOMER: "SET_CUSTOMER",
  SET_DELIVERY_DATE: "SET_DELIVERY_DATE",
  SET_WEDDING_DATE: "SET_WEDDING_DATE",
  ADD_ITEM: "ADD_ITEM",
  REMOVE_ITEM: "REMOVE_ITEM",
  SET_CUSTOMERS: "SET_CUSTOMERS",
  SET_ITEMS: "SET_ITEMS",
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_RECEIPTS: "SET_RECEIPTS",
  ADD_RECEIPT: "ADD_RECEIPT",
  RESET_RECEIPTS: "RESET_RECEIPTS",
  UPDATE_INVOICE_STATUS: "UPDATE_INVOICE_STATUS",
  RESET_INVOICE: "RESET_INVOICE",
  LOAD_INVOICE_DATA: "LOAD_INVOICE_DATA",
};

const initialState = {
  invoiceNumber: "INV001",
  selectedItems: [],
  selectedCustomer: null,
  deliveryDate: "",
  weddingDate: "",
  totalAmount: 0,
  customers: [],
  items: [],
  receipts: [],
  loading: true,
  error: null,
  invoiceStatus: null,
};

function invoiceReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_INVOICE_NUMBER:
      return { ...state, invoiceNumber: action.payload };
    case ACTIONS.SET_CUSTOMER:
      return {
        ...state,
        selectedCustomer:
          state.customers.find((c) => c._id === action.payload) || null,
      };
    case ACTIONS.SET_DELIVERY_DATE:
      return { ...state, deliveryDate: action.payload };
    case ACTIONS.SET_WEDDING_DATE:
      return { ...state, weddingDate: action.payload };
    case ACTIONS.ADD_ITEM:
      const newItem = { ...action.payload, uniqueId: Date.now().toString() };
      return {
        ...state,
        selectedItems: [...state.selectedItems, newItem],
        totalAmount: state.totalAmount + newItem.rentRate,
      };
    case ACTIONS.REMOVE_ITEM:
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
    case ACTIONS.SET_CUSTOMERS:
      return { ...state, customers: action.payload };
    case ACTIONS.SET_ITEMS:
      return { ...state, items: action.payload };
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    case ACTIONS.SET_RECEIPTS:
      return { ...state, receipts: action.payload };
    case ACTIONS.ADD_RECEIPT:
      return { ...state, receipts: [...state.receipts, action.payload] };
    case ACTIONS.RESET_RECEIPTS:
      return { ...state, receipts: [] };
    case ACTIONS.UPDATE_INVOICE_STATUS:
      return { ...state, invoiceStatus: action.payload };
    case ACTIONS.RESET_INVOICE:
      return {
        ...state,
        selectedItems: [],
        selectedCustomer: null,
        deliveryDate: "",
        weddingDate: "",
        totalAmount: 0,
        receipts: [],
        invoiceStatus: null,
        error: null,
      };
    case ACTIONS.LOAD_INVOICE_DATA:
      const invoiceData = action.payload;
      return {
        ...state,
        invoiceNumber: invoiceData.invoiceNumber,
        selectedCustomer: invoiceData.customer,
        selectedItems: invoiceData.items,
        deliveryDate: invoiceData.deliveryDate,
        weddingDate: invoiceData.weddingDate,
        totalAmount: invoiceData.totalAmount,
        receipts: invoiceData.receipts || [],
        invoiceStatus: invoiceData.status,
      };
    default:
      return state;
  }
}

export const InvoiceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(invoiceReducer, initialState);

  const loadInvoice = async (invoiceNumber) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const invoiceData = await fetchInvoiceByNumber(invoiceNumber);
      dispatch({ type: ACTIONS.LOAD_INVOICE_DATA, payload: invoiceData });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      console.error("Failed to load invoice:", error);
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  const handlePrevious = async () => {
    const currentNumber = parseInt(state.invoiceNumber.replace("INV", ""));
    if (currentNumber > 1) {
      const prevInvoiceNumber = `INV${(currentNumber - 1).toString().padStart(3, '0')}`;
      await loadInvoice(prevInvoiceNumber);
    }
  };

  const handleNext = async () => {
    const currentNumber = parseInt(state.invoiceNumber.replace("INV", ""));
    const nextInvoiceNumber = `INV${(currentNumber + 1).toString().padStart(3, '0')}`;
    await loadInvoice(nextInvoiceNumber);
  };

  const refreshInvoiceNumber = async () => {
    try {
      const lastInvoiceNumber = await fetchLastInvoiceNumber();
      const lastNumber = parseInt(lastInvoiceNumber.replace("INV", ""));
      const nextInvoiceNumber = `INV${(lastNumber + 1)
        .toString()
        .padStart(3, "0")}`;
      dispatch({
        type: ACTIONS.SET_INVOICE_NUMBER,
        payload: nextInvoiceNumber,
      });
    } catch (error) {
      console.error("Failed to refresh invoice number", error);
    }
  };

  const resetInvoice = () => {
    dispatch({ type: ACTIONS.RESET_INVOICE });
    refreshInvoiceNumber();
  };


  const saveInvoiceWithReceipts = async (invoiceData, receipts) => {
    let createdReceipts = [];
    
    try {
      // Calculate total paid amount from receipts
      const totalPaidAmount = receipts.reduce(
        (sum, receipt) => sum + parseFloat(receipt.amount || 0),
        0
      );
  
      // Prepare receipt data
      const receiptData = {
        receipts: receipts.map((receipt) => ({
          ...receipt,
          customerId: invoiceData.customer._id,
          invoiceNumber: invoiceData.invoiceNumber,
          transactionType: "receipt",
          sourcePage: "invoicing",
        })),
        entityId: invoiceData.customer._id,
        entityType: "customer",
        invoiceNumber: invoiceData.invoiceNumber,
        transactionType: "receipt",
        sourcePage: "invoicing",
      };
  
      // Save the receipts first
      const receiptResult = await createReceipts(receiptData);
  
      if (!receiptResult?.receipts) {
        throw new Error('Failed to create receipts');
      }
  
      createdReceipts = receiptResult.receipts;
  
      // Format the receipts with their IDs and other details
      const updatedReceipts = receiptResult.receipts.map(
        (receipt) => ({
          id: receipt._id,
          amount: receipt.amount,
          date: receipt.date,
          method: receipt.method,
          serialNumber: receipt.serialNumber,
          note: receipt.note,
        })
      );
  
      // Prepare complete invoice data with payment information
      const completeInvoiceData = {
        ...invoiceData,
        receipts: updatedReceipts,
        paidAmount: totalPaidAmount,
        balanceAmount: invoiceData.totalAmount - totalPaidAmount,
        paymentStatus: totalPaidAmount >= invoiceData.totalAmount 
          ? "completed" 
          : totalPaidAmount > 0 
            ? "partial" 
            : "pending",
      };
  
      const savedInvoice = await saveInvoice(completeInvoiceData);

      if (!savedInvoice) {
        // If invoice save fails, attempt to delete the created receipts
        if (createdReceipts.length > 0) {
          const receiptIds = createdReceipts.map(t => t._id);
          await deleteReceipts(receiptIds);
        }
        throw new Error('Failed to save invoice');
      }

      // Reset the invoice after successful save
      resetInvoice();
  
      return {
        success: true,
        invoice: savedInvoice,
        receipts: receiptResult.receipts,
      };
  
    } catch (error) {
      // Rollback receipts if they were created
      if (createdReceipts.length > 0) {
        try {
          const receiptIds = createdReceipts.map(t => t._id);
          await deleteReceipts(receiptIds);
          console.log('Successfully rolled back receipts');
        } catch (rollbackError) {
          console.error('Error rolling back receipts:', rollbackError);
          throw new Error(
            'Error: Failed to rollback receipts. Manual cleanup may be required. ' +
            'Original error: ' + error.message
          );
        }
      }
  
      console.error("Failed to save invoice and receipts:", error);
      throw new Error(error.message || "Failed to save invoice and receipts");
    }
  };

  const fetchData = async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const [fetchedCustomers, fetchedItems, lastInvoiceNumber] =
        await Promise.all([
          fetchCustomers(),
          fetchItems(),
          fetchLastInvoiceNumber(),
        ]);

      dispatch({ type: ACTIONS.SET_CUSTOMERS, payload: fetchedCustomers });
      dispatch({ type: ACTIONS.SET_ITEMS, payload: fetchedItems });

      const lastNumber = parseInt(lastInvoiceNumber.replace("INV", ""));
      const nextInvoiceNumber = `INV${(lastNumber + 1)
        .toString()
        .padStart(3, "0")}`;
      dispatch({
        type: ACTIONS.SET_INVOICE_NUMBER,
        payload: nextInvoiceNumber,
      });
    } catch (error) {
      console.error("Failed to fetch data", error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: "Failed to fetch data" });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
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
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoice = () => {
  return useContext(InvoiceContext);
};
