// // /pages/api/sub-items/[id].js

import connectDB from "@/config/db";
import SubItem from "@/models/SubItem";

export default async function handler(req, res) {
  await connectDB();
  const { method } = req;
  const { id } = req.query;

  // Validate MongoDB ObjectId
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  switch (method) {
    case 'GET':
      try {
        const subItem = await SubItem.findById(id).populate('master');
        
        if (!subItem) {
          return res.status(404).json({ message: 'Sub-item not found' });
        }

        res.status(200).json(subItem);
      } catch (error) {
        console.error("Get Error:", error);
        res.status(500).json({ 
          message: "Failed to fetch sub-item",
          error: error.message 
        });
      }
      break;

    case 'PUT':
      try {
        const { name, code, rentRate, description, image, status } = req.body;

        // Validate required fields
        if (!name || !code || !rentRate) {
          return res.status(400).json({
            message: "Name, code, and rent rate are required fields"
          });
        }

        // Validate rent rate is a positive number
        if (isNaN(rentRate) || rentRate <= 0) {
          return res.status(400).json({
            message: "Rent rate must be a positive number"
          });
        }

        // Check if code exists and belongs to different sub-item
        const existingItem = await SubItem.findOne({ 
          code: code,
          _id: { $ne: id } // Exclude current item from check
        });

        if (existingItem) {
          return res.status(400).json({
            message: "A sub-item with this code already exists"
          });
        }

        const updatedSubItem = await SubItem.findByIdAndUpdate(
          id,
          {
            name,
            code,
            rentRate: parseFloat(rentRate),
            description,
            image,
            status: status || 'Available'
          },
          { 
            new: true, // Return updated document
            runValidators: true // Run model validators
          }
        ).populate('master');

        if (!updatedSubItem) {
          return res.status(404).json({ message: 'Sub-item not found' });
        }

        res.status(200).json(updatedSubItem);
      } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ 
          message: "Failed to update sub-item",
          error: error.message 
        });
      }
      break;

    case 'DELETE':
      try {
        // Check if the sub-item exists before deletion
        const subItem = await SubItem.findById(id);
        
        if (!subItem) {
          return res.status(404).json({ message: 'Sub-item not found' });
        }

        // Check if the item can be deleted (e.g., not in 'Rented' status)
        if (subItem.status === 'Rented') {
          return res.status(400).json({ 
            message: 'Cannot delete a rented sub-item' 
          });
        }

        const deletedSubItem = await SubItem.findByIdAndDelete(id);
        res.status(200).json({
          message: 'Sub-item deleted successfully',
          data: deletedSubItem
        });
      } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ 
          message: "Failed to delete sub-item",
          error: error.message 
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}
