// pages/api/accounts/[id].js
import connectDB from '@/config/db';
import Account from '@/models/Account';

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;

  await connectDB();

  switch (method) {
    case 'GET':
      try {
        const account = await Account.findById(id);
        if (!account) {
          return res.status(404).json({ success: false, error: 'Account not found' });
        }
        return res.status(200).json({ success: true, data: account });
      } catch (error) {
        return res.status(500).json({ success: false, error: 'Failed to fetch account' });
      }

    case 'PUT':
      try {
        const account = await Account.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!account) {
          return res.status(404).json({ success: false, error: 'Account not found' });
        }
        return res.status(200).json({ success: true, data: account });
      } catch (error) {
        if (error.name === 'ValidationError') {
          const messages = Object.values(error.errors).map(err => err.message);
          return res.status(400).json({ success: false, error: messages.join(', ') });
        }
        return res.status(400).json({ success: false, error: 'Failed to update account' });
      }

    case 'DELETE':
      try {
        const account = await Account.findByIdAndDelete(id);
        if (!account) {
          return res.status(404).json({ success: false, error: 'Account not found' });
        }
        return res.status(200).json({ success: true, data: {} });
      } catch (error) {
        return res.status(400).json({ success: false, error: 'Failed to delete account' });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}