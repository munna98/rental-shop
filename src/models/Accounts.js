import mongoose from 'mongoose';

// Define the schema for the Account
const accountSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true }, // income or expense
});

export default mongoose.models.Account || mongoose.model('Account', accountSchema);
