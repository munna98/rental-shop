// src/models/Invoice.js
import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  items: [
    {
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'Subitem', required: true },
      measurement: [
        {
          item: { type: Number, },
          sleeve: { type: Number, },
          waist: { type: Number, },
          length: { type: Number, },
          pantsize: { type: Number, },
        },
      ],
      rentRate: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);
