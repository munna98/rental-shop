import { ACTIONS } from "./actions";
import {
  fetchCustomers,
  fetchItems,
  fetchLastInvoiceNumber,
  fetchInvoiceByNumber,
  createReceipts,
  saveInvoice,
  updateInvoice,
  deleteReceipts,
} from "@/services/api";

/**
 * Fetch initial data including customers, items, and the next invoice number.
 */
export const fetchData = async (dispatch) => {
  dispatch({ type: ACTIONS.SET_LOADING, payload: true });
  try {
    const [customers, items, lastInvoiceNumber] = await Promise.all([
      fetchCustomers(),
      fetchItems(),
      fetchLastInvoiceNumber(),
    ]);

    dispatch({ type: ACTIONS.SET_CUSTOMERS, payload: customers });
    dispatch({ type: ACTIONS.SET_ITEMS, payload: items });
    dispatch({ type: ACTIONS.TOGGLE_EDIT_MODE, payload: true });

    const nextInvoiceNumber = `INV${(parseInt(lastInvoiceNumber.replace("INV", "")) + 1)
      .toString()
      .padStart(3, "0")}`;
    dispatch({ type: ACTIONS.SET_INVOICE_NUMBER, payload: nextInvoiceNumber });
  } catch (error) {
    dispatch({ type: ACTIONS.SET_ERROR, payload: "Failed to fetch data" });
    console.error("Error fetching data:", error);
  } finally {
    dispatch({ type: ACTIONS.SET_LOADING, payload: false });
  }
};

/**
 * Load a specific invoice by its number.
 */
export const loadInvoice = async (invoiceNumber, dispatch) => {
  dispatch({ type: ACTIONS.SET_LOADING, payload: true });
  try {
    const invoiceData = await fetchInvoiceByNumber(invoiceNumber);
    dispatch({ type: ACTIONS.LOAD_INVOICE_DATA, payload: invoiceData });
  } catch (error) {
    dispatch({ type: ACTIONS.SET_ERROR, payload: "Failed to load invoice" });
    console.error("Error loading invoice:", error);
  } finally {
    dispatch({ type: ACTIONS.SET_LOADING, payload: false });
  }
};

/**
 * Refresh the invoice number to the next available one.
 */
export const refreshInvoiceNumber = async (dispatch) => {
  try {
    const lastInvoiceNumber = await fetchLastInvoiceNumber();
    console.log("last invoice number",lastInvoiceNumber);
    
    const nextInvoiceNumber = `INV${(parseInt(lastInvoiceNumber.replace("INV", "")) + 1)
      .toString()
      .padStart(3, "0")}`;
    dispatch({ type: "SET_INVOICE_NUMBER", payload: nextInvoiceNumber });
    dispatch({ type: "TOGGLE_EDIT_MODE", payload: true });  
  } catch (error) {
    console.error("Error refreshing invoice number:", error);
  }
};

/**
 * Save an invoice along with its associated receipts.
 */
export const saveInvoiceWithReceipts = async (invoiceData, receipts, dispatch) => {
  let createdReceipts = [];
  try {
    // Calculate total paid amount
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

    // Save the receipts
    const receiptResult = await createReceipts(receiptData);
    if (!receiptResult?.receipts) throw new Error("Failed to create receipts");
    createdReceipts = receiptResult.receipts;

    // Format receipts for the invoice
    const updatedReceipts = receiptResult.receipts.map((receipt) => ({
      id: receipt._id,
      amount: receipt.amount,
      date: receipt.date,
      method: receipt.method,
      serialNumber: receipt.serialNumber,
      note: receipt.note,
    }));

    // Prepare and save invoice data
    const completeInvoiceData = {
      ...invoiceData,
      receipts: updatedReceipts,
      paidAmount: totalPaidAmount,
      balanceAmount: invoiceData.totalAmount - totalPaidAmount,
      paymentStatus:
        totalPaidAmount >= invoiceData.totalAmount
          ? "completed"
          : totalPaidAmount > 0
          ? "partial"
          : "pending",
    };

    const savedInvoice = await saveInvoice(completeInvoiceData);

    refreshInvoiceNumber(dispatch);

    if (!savedInvoice) throw new Error("Failed to save invoice");

    // Reset invoice after success
    dispatch({ type: ACTIONS.RESET_INVOICE });
    return { success: true, invoice: savedInvoice, receipts: receiptResult.receipts };
  } catch (error) {
    // Rollback receipts if invoice save fails
    if (createdReceipts.length > 0) {
      try {
        const receiptIds = createdReceipts.map((r) => r._id);
        await deleteReceipts(receiptIds);
        console.log("Receipts rolled back successfully");
      } catch (rollbackError) {
        console.error("Failed to rollback receipts:", rollbackError);
        throw new Error("Failed to save invoice. Manual cleanup required.");
      }
    }
    console.error("Error saving invoice with receipts:", error);
    throw error;
  }
};


export const editInvoice = async (invoiceNumber, editedData, dispatch) => {
  try {
    // Assuming you have an API method to update an invoice
    const updatedInvoice = await updateInvoice(invoiceNumber, editedData);
    
    if (updatedInvoice) {
      dispatch({ 
        type: ACTIONS.LOAD_INVOICE_DATA, 
        payload: updatedInvoice 
      });
      dispatch({ 
        type: ACTIONS.TOGGLE_EDIT_MODE, 
        payload: false 
      });
      
      return { success: true, invoice: updatedInvoice };
    }
    
    return { success: false };
  } catch (error) {
    console.error('Error editing invoice:', error);
    return { success: false, error };
  }
};