
import mongoose from 'mongoose';

const subItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  masteritem: { type: mongoose.Schema.Types.ObjectId, ref: 'MasterItem', required: true },
  rentRate: { type: String, required: true },
  status: { type: String},
  description: { type: String },
  image: String,
});

export default mongoose.models.SubItem || mongoose.model('SubItem', subItemSchema);
