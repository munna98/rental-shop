import mongoose from 'mongoose';

const SubItemSchema = new mongoose.Schema({
  master: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MasterItem',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  rentRate: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Available', 'Rented', 'Damaged', 'Maintanance'],
    default: 'Available'
  }
});

export default mongoose.models.SubItem || mongoose.model('SubItem', SubItemSchema);