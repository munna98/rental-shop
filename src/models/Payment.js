import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
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
    default: "payment",
  }
}, { timestamps: true }); 


export default mongoose.models.Payment || mongoose.model('Payment', paymentSchema);