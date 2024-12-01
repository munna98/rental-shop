import { ACTIONS } from "./actions";

export const initialState = {
  invoiceNumber: "INV001",
  isNewInvoice: true,
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
  isEditMode: false,
};

const invoiceReducer = (state, action) => {
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
        isNewInvoice: true,
      };
    case ACTIONS.LOAD_INVOICE_DATA:
      const invoiceData = action.payload;
      return {
        ...state,
        invoiceNumber: invoiceData.invoiceNumber,
        isNewInvoice: false,
        selectedCustomer: invoiceData.customer || null, // Ensure customer is set
        selectedItems: invoiceData.items || [],
        deliveryDate: invoiceData.deliveryDate || "",
        weddingDate: invoiceData.weddingDate || "",
        totalAmount: invoiceData.totalAmount || 0,
        receipts: invoiceData.receipts || [],
        invoiceStatus: invoiceData.status || null,
      };
    // case ACTIONS.TOGGLE_EDIT_MODE:
    //   return {
    //     ...state,
    //     isEditMode: action.payload !== undefined ? action.payload : !state.currentState.isEditMode
    //   };

    case ACTIONS.TOGGLE_EDIT_MODE:
      return {
        ...state,
        isEditMode:
          action.payload !== undefined ? action.payload : !state.isEditMode, // Correct reference to `isEditMode`
      };
    case ACTIONS.SET_IS_NEW_INVOICE:
      return { ...state, isNewInvoice: action.payload };

    default:
      return state;
  }
};

export default invoiceReducer;
