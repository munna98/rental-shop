// src/models/Customer.js
import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  phone: { type: String, required: true },
  whatsapp: { type: String, required: true },
  address: {String},
});

export default mongoose.models.Customer || mongoose.model('Customer', customerSchema);
