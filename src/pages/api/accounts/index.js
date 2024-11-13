import connectDB from '../../../config/db';
import Account from '@/models/Account';

export default async function handler(req, res) {
  const { method, query, body } = req;

  // Connect to the database
  await connectDB();

  switch (method) {
    // Fetch all accounts
    case 'GET':
      try {
        const accounts = await Account.find({});
        return res.status(200).json({ success: true, data: accounts });
      } catch (error) {
        return res.status(500).json({ success: false, error: 'Failed to fetch accounts' });
      }

    // Create a new account
    case 'POST':
      try {
        const newAccount = await Account.create(body);
        return res.status(201).json({ success: true, data: newAccount });
      } catch (error) {
        return res.status(400).json({ success: false, error: 'Failed to create account' });
      }

    // Update an account by ID
    case 'PUT':
      try {
        const { id } = query;
        if (!id) {
          return res.status(400).json({ success: false, error: 'Account ID is required' });
        }
        const updatedAccount = await Account.findByIdAndUpdate(id, body, { new: true });
        if (!updatedAccount) {
          return res.status(404).json({ success: false, error: 'Account not found' });
        }
        return res.status(200).json({ success: true, data: updatedAccount });
      } catch (error) {
        return res.status(400).json({ success: false, error: 'Failed to update account' });
      }

    // Delete an account by ID
    case 'DELETE':
      try {
        const { id } = query;
        if (!id) {
          return res.status(400).json({ success: false, error: 'Account ID is required' });
        }
        const deletedAccount = await Account.findByIdAndDelete(id);
        if (!deletedAccount) {
          return res.status(404).json({ success: false, error: 'Account not found' });
        }
        return res.status(200).json({ success: true, message: 'Account deleted successfully' });
      } catch (error) {
        return res.status(400).json({ success: false, error: 'Failed to delete account' });
      }

    // Unsupported method handler
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
