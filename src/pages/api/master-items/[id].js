// src/pages/api/master-items/[id].js
import connectDB from '../../../config/db';
import MasterItem from '../../../models/MasterItem';
import SubItem from '../../../models/SubItem'; // Import the model referencing MasterItem

export default async function handler(req, res) {
  await connectDB();
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'PUT':
      try {
        const { name, code } = req.body;

        const updatedItem = await MasterItem.findByIdAndUpdate(
          id,
          { name, code },
          { new: true, runValidators: true }
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
        // Check if the master item is referenced by any subitems
        const referencedSubItems = await SubItem.countDocuments({ master: id });

        if (referencedSubItems > 0) {
          return res.status(400).json({ error: 'Item cannot be deleted as it is referenced by subitems' });
        }

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
      res.setHeader('Allow', ['PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
