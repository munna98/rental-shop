import mongoose from 'mongoose';

const SubItemSchema = new mongoose.Schema({
  master: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MasterItem', // Reference the MasterItem model
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  rentRate: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
});

export default mongoose.models.SubItem || mongoose.model('SubItem', SubItemSchema);
