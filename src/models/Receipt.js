import mongoose from 'mongoose';

const ReceiptSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  invoiceNumber: {
    type: String,
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
  }
});

export default mongoose.models.Receipt || mongoose.model('Receipt', ReceiptSchema);
