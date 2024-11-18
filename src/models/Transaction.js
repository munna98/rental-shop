import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  entityType: {
    type: String,
    enum: ['customer', 'account'],
    required: true,
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // Using refPath to dynamically reference either Customer or Account
    refPath: 'entityType'
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
    required: true,
  }
});

// Update the model name mappings for refPath
transactionSchema.path('entityType').enum(['customer', 'account']);

export default mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);