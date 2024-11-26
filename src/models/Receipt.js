import mongoose from 'mongoose';

const receiptSchema = new mongoose.Schema({
  entityType: {
    type: String,
    enum: ['customer', 'account'],
    required: true,
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'entityType',
  },
  relatedInvoice: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Invoice' 
  },
  transactionType: {
    type: String,
    default: "receipt",
  },
  serialNumber: {
    type: String,
    required: true,
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
    enum: ['receipt', 'invoicing'],
    required: true,
  }
}, { timestamps: true }); 


export default mongoose.models.Receipt || mongoose.model('Receipt', receiptSchema);