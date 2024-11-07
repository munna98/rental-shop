import mongoose from 'mongoose';

const ReceiptSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  invoiceNumber: {
    type: String,
    // This is optional, and it will only be required if the receipt is from the InvoicingPage.
    required: function () {
      return this.sourcePage === 'invoicing';  // Only required if the source is 'invoicing'
    },
  },
  receiptNumber: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  receiptMethod: {
    type: String,
    enum: ['cash', 'upi', 'card', 'bank_transfer'],
    required: true,
  },
  receiptDate: {
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
    enum: ['receipt', 'invoicing'],
    required: true,  // Tracks whether the receipt is from the ReceiptPage or InvoicingPage
  }
});

export default mongoose.models.Receipt || mongoose.model('Receipt', ReceiptSchema);
