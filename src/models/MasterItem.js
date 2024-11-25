
import mongoose from 'mongoose';

const masterItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  image: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.MasterItem || mongoose.model('MasterItem', masterItemSchema);
