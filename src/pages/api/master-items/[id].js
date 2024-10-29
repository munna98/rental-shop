// src/pages/api/master-items/[id].js
import connectDB from '../../../config/db';
import MasterItem from '../../../models/MasterItem';

export default async function handler(req, res) {
  await connectDB();
  const { method } = req;
  const { id } = req.query;  // Extract the ID from the request query

  switch (method) {
    case 'DELETE':
      try {
        const deletedItem = await MasterItem.findByIdAndDelete(id);

        if (!deletedItem) {
          return res.status(404).json({ error: 'Item not found' });
        }

        res.status(200).json({ message: 'Item deleted successfully', deletedItem });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
