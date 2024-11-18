// pages/api/invoices/update-delivery-status.js
import connectDB from '@/config/db';
import Invoice from '@/models/Invoice';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { subItemId, newDeliveryStatus } = req.body;

    if (!subItemId || !newDeliveryStatus) {
      return res.status(400).json({ 
        error: 'Missing required fields: subItemId and newDeliveryStatus are required' 
      });
    }

    // Find all invoices that contain this item and update its delivery status
    const result = await Invoice.updateMany(
      { 'items.item': subItemId },
      { 
        $set: { 
          'items.$[elem].deliveryStatus': newDeliveryStatus 
        }
      },
      { 
        arrayFilters: [{ 'elem.item': subItemId }],
        new: true
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ 
        error: 'No invoices found with this item' 
      });
    }

    return res.status(200).json({ 
      message: 'Delivery status updated successfully',
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Error updating invoice item delivery status:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
}