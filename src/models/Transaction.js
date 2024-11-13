import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  relatedInvoice: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Invoice' 
  },
  transactionType: {
    type: String,
    enum: ['receipt', 'payment'], 
    required: true, 
  },
  serialNumber: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  method: {
    type: String,
    enum: ['cash', 'upi', 'card', 'bank_transfer'],
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  note: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  sourcePage: {
    type: String,
    enum: ['receipt', 'invoicing', 'payment'],
    required: true,  // Tracks whether the receipt is from the ReceiptPage or InvoicingPage or PaymentPage
  }
});

export default mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
