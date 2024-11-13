import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    trim: true
  },
  type: {
    type: String,
    enum: ['income', 'expense', 'asset', 'liability'],
    required: true
  },
  description: {
    type: String,
    maxlength: 200,
    trim: true
  },
  balance: {
    type: Number,
    required: true,
    default: 0
  },
  currency: {
    type: String,
    required: true,
    uppercase: true,
    minlength: 3,
    maxlength: 3
  },
  category: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    trim: true
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

export default mongoose.models.Account || mongoose.model('Account', accountSchema);