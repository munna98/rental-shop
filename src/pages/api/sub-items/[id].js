// /pages/api/sub-items/[id].js
import connectDB from "@/config/db";
import SubItem from "@/models/SubItem";

export default async function handler(req, res) {
  await connectDB();
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'PUT': // Handle updating sub-item
      try {
        const { master, name, code, rentRate, description, image } = req.body;

        const updatedSubItem = await SubItem.findByIdAndUpdate(
          id,
          { master: master, name, code, rentRate, description, image },
          { new: true, runValidators: true } // Returns the updated document after update
        );

        if (!updatedSubItem) {
          return res.status(404).json({ error: 'Sub-item not found' });
        }

        res.status(200).json({ message: 'Sub-item updated successfully', updatedSubItem });
      } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ error: error.message });
      }
      break;

    case 'DELETE': // Handle deleting sub-item
      try {
        const deletedSubItem = await SubItem.findByIdAndDelete(id);

        if (!deletedSubItem) {
          return res.status(404).json({ error: 'Sub-item not found' });
        }

        res.status(200).json({ message: 'Sub-item deleted successfully', deletedSubItem });
      } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['PUT', 'DELETE']); // Allow both PUT and DELETE methods
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
