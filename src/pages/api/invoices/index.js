import connectDB from '@/config/db';
import Invoice from '@/models/Invoice';
import Transaction from '@/models/Transaction';
import SubItem from '@/models/SubItem';

// Helper function to validate item availability
async function validateItemAvailability(items) {
  // Get all item IDs
  const itemIds = items.map(item => item._id);
  
  // Fetch all items in one query
  const subItems = await SubItem.find({ _id: { $in: itemIds } });
  
  // Check if all items exist
  if (subItems.length !== itemIds.length) {
    throw new Error('One or more items not found');
  }
  
  // Check if any item is already rented
  // we will implement this feature in future 
  // const rentedItems = subItems.filter(item => item.status === 'Rented');
  // if (rentedItems.length > 0) {
  //   const rentedItemCodes = rentedItems.map(item => item.code).join(', ');
  //   throw new Error(`The following items are already rented: ${rentedItemCodes}`);
  // }
  
  return subItems;
}

// Helper function to update item statuses
async function updateItemStatuses(items, status) {
  try {
    // Extract all item IDs from the invoice items
    const itemIds = items.map(item => item.item || item._id);
    
    // Update all items' status in a single operation
    await SubItem.updateMany(
      { _id: { $in: itemIds } },
      { $set: { status: status } }
    );
  } catch (error) {
    console.error('Error updating item statuses:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  try {
    await connectDB();

    if (req.method === 'POST') {
      try {
        const {
          invoiceNumber,
          customer,
          items,      
          totalAmount,
          deliveryDate,
          weddingDate,
          notes = '',
          receipts = [],
          paidAmount = 0
        } = req.body;

        // First validate item availability
        await validateItemAvailability(items);

        // Calculate payment status based on paid amount
        const paymentStatus = paidAmount >= totalAmount ? 'completed' : 
                            paidAmount > 0 ? 'partial' : 'pending';

        // Create the invoice with payment tracking
        const invoice = new Invoice({
          invoiceNumber,
          customer: customer._id,
          items: items.map(item => ({
            item: item._id,
            measurement: item.measurement || [{}],
            rentRate: item.rentRate,
            name: item.name,
            category: item.category,
            status: "Rented",
            deliveryStatus: "Pending",
          })),
          totalAmount,
          deliveryDate,
          weddingDate,
          paidAmount,
          balanceAmount: totalAmount - paidAmount,
          paymentStatus,
          notes,
          receipts: receipts.map(receipt => receipt.id)
        });

        // Save the invoice
        const savedInvoice = await invoice.save();

        // Try to update the items status
        try {
          await updateItemStatuses(items, 'Rented');
        } catch (statusError) {
          // If updating status fails, delete the saved invoice
          await Invoice.findByIdAndDelete(savedInvoice._id);
          throw new Error(`Failed to update item statuses: ${statusError.message}`);
        }

        // Try to update receipts if any
        if (receipts.length > 0) {
          try {
            await Transaction.updateMany(
              { _id: { $in: receipts.map(r => r.id) } },
              { $set: { invoice: savedInvoice._id } }
            );
          } catch (receiptError) {
            // If updating receipts fails, revert item statuses and delete invoice
            await updateItemStatuses(items, 'Available');
            await Invoice.findByIdAndDelete(savedInvoice._id);
            throw new Error(`Failed to update receipts: ${receiptError.message}`);
          }
        }

        // Populate and return the invoice
        const populatedInvoice = await Invoice.findById(savedInvoice._id)
          .populate('customer')
          .populate('items.item')
          .populate('receipts');

        res.status(201).json(populatedInvoice);

      } catch (error) {
        console.error('Error saving invoice:', error);
        res.status(400).json({ 
          error: 'Failed to save invoice', 
          details: error.message 
        });
      }

    } else if (req.method === 'GET') {
      const { customerId, startDate, endDate, status, paymentStatus } = req.query;
      let query = {};

      if (customerId) query.customer = customerId;
      if (status) query.status = status;
      if (paymentStatus) query.paymentStatus = paymentStatus;
      if (startDate && endDate) {
        query.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      const invoices = await Invoice.find(query)
        .populate('customer')
        .populate('items.item')
        .populate('receipts')
        .sort({ createdAt: -1 });

      res.status(200).json(invoices);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in API handler:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
}