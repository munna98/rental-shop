// src/pages/api/master-items/[id].js
import connectDB from '../../../config/db';
import MasterItem from '../../../models/MasterItem';

export default async function handler(req, res) {
  await connectDB();
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'PUT': // Add a case for handling PUT requests
      try {
        const { name, code } = req.body;

        const updatedItem = await MasterItem.findByIdAndUpdate(
          id,
          { name, code },
          { new: true, runValidators: true } // Returns the updated document after update
        );

        if (!updatedItem) {
          return res.status(404).json({ error: 'Item not found' });
        }

        res.status(200).json({ message: 'Item updated successfully', updatedItem });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

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
      res.setHeader('Allow', ['PUT', 'DELETE']); // Allow both PUT and DELETE methods
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
