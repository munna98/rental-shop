import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Customer name is required'],
    trim: true
  },
  code: { 
    type: String, 
    required: [true, 'Customer code is required'],
    unique: true // Ensure unique customer codes
  },
  mobile: { 
    type: String, 
    required: [true, 'Mobile number is required']
  },
  whatsapp: { 
    type: String, 
    required: [true, 'WhatsApp number is required']
  },
  address: { 
    type: String, 
    default: '' // Optional field with default empty string
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

export default mongoose.models.Customer || mongoose.model('Customer', customerSchema);