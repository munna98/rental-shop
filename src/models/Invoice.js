// src/models/Invoice.js
import mongoose from 'mongoose';

const measurementSchema = new mongoose.Schema({
  item: { 
    type: Number,
    default: null
  },
  sleeve: { 
    type: Number,
    default: null
  },
  waist: { 
    type: Number,
    default: null
  },
  length: { 
    type: Number,
    default: null
  },
  pantsize: { 
    type: Number,
    default: null
  }
});

const invoiceItemSchema = new mongoose.Schema({
  item: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'SubItem', 
    required: true 
  },
  measurement: {
    type: [measurementSchema],
    default: [{}] // Provides a default empty measurement object
  },
  rentRate: { 
    type: Number, 
    required: true 
  },
  name: { 
    type: String 
  }, // Optional: Store item name directly for easier reference
  status:{
    type: String, 
  },
  deliveryStatus: {
    type: String,
    enum: ['Pending', 'Delivered', 'Overdue'],
    default: 'Pending'
  },
});

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { 
    type: String, 
    required: true,
    // unique: true,
    index: true
  },
  customer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer', 
    required: true 
  },
  items: [invoiceItemSchema],
  totalAmount: { 
    type: Number, 
    required: true 
  },
  deliveryDate: { 
    type: Date,
    required: true
  },
  weddingDate: { 
    type: Date,
    required: true
  },
  receipts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }],
  
  // Add fields to track payment
  paidAmount: {
    type: Number,
    default: 0
  },
  balanceAmount: {
    type: Number,
    default: function() {
      return this.totalAmount - this.paidAmount;
    }
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'completed'],
    default: 'pending'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update the updatedAt field before saving
invoiceSchema.pre('save', function(next) {
  // Update paymentStatus based on paidAmount and totalAmount
  if (this.paidAmount >= this.totalAmount) {
    this.paymentStatus = 'completed';
  } else if (this.paidAmount > 0) {
    this.paymentStatus = 'partial';
  } else {
    this.paymentStatus = 'pending';
  }
  next();
});

// Virtual property for customer details
invoiceSchema.virtual('customerDetails', {
  ref: 'Customer',
  localField: 'customer',
  foreignField: '_id',
  justOne: true
});

// Ensure virtuals are included in JSON output
invoiceSchema.set('toJSON', { virtuals: true });
invoiceSchema.set('toObject', { virtuals: true });

// Create indexes for better query performance
invoiceSchema.index({ createdAt: -1 });
invoiceSchema.index({ customer: 1 });
invoiceSchema.index({ status: 1 });
invoiceSchema.index({ paymentStatus: 1 });

// Add instance methods if needed
invoiceSchema.methods.calculateBalance = function() {
  return this.totalAmount - this.advanceAmount;
};

// Add static methods if needed
invoiceSchema.statics.findByCustomer = function(customerId) {
  return this.find({ customer: customerId }).populate('customer items.item');
};

invoiceSchema.statics.findByDateRange = function(startDate, endDate) {
  return this.find({
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  });
};

// Create the model
const Invoice = mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);

export default Invoice;