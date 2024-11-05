// pages/api/invoices/[id].js
import connectDB from '@/config/db';
import Invoice from '@/models/Invoice';

export default async function handler(req, res) {
  const { id } = req.query;

  await connectDB();

  switch (req.method) {
    case 'GET':
      try {
        const invoice = await Invoice.findById(id)
          .populate('customer')
          .populate('items.item');

        if (!invoice) {
          return res.status(404).json({ error: 'Invoice not found' });
        }

        res.status(200).json(invoice);
      } catch (error) {
        console.error('Error fetching invoice:', error);
        res.status(500).json({ error: 'Failed to fetch invoice', details: error.message });
      }
      break;

    case 'PUT':
      try {
        const {
          customer,
          items,
          totalAmount,
          deliveryDate,
          weddingDate,
          advanceAmount,
          status,
          paymentStatus,
          notes
        } = req.body;

        // Calculate balance amount
        const balanceAmount = totalAmount - (advanceAmount || 0);

        // Prepare update object
        const updateData = {
          customer: customer._id,
          items: items.map(item => ({
            item: item._id,
            measurement: item.measurement || [{}],
            rentRate: item.rentRate,
            name: item.name,
            category: item.category
          })),
          totalAmount,
          deliveryDate,
          weddingDate,
          advanceAmount,
          balanceAmount,
          status,
          paymentStatus,
          notes
        };

        // Update the invoice
        const updatedInvoice = await Invoice.findByIdAndUpdate(
          id,
          updateData,
          { 
            new: true, // Return the updated document
            runValidators: true // Run model validators
          }
        )
        .populate('customer')
        .populate('items.item');

        if (!updatedInvoice) {
          return res.status(404).json({ error: 'Invoice not found' });
        }

        res.status(200).json(updatedInvoice);
      } catch (error) {
        console.error('Error updating invoice:', error);
        res.status(400).json({ error: 'Failed to update invoice', details: error.message });
      }
      break;

    case 'DELETE':
      try {
        const deletedInvoice = await Invoice.findByIdAndDelete(id);
        
        if (!deletedInvoice) {
          return res.status(404).json({ error: 'Invoice not found' });
        }

        res.status(200).json({ message: 'Invoice deleted successfully', deletedInvoice });
      } catch (error) {
        console.error('Error deleting invoice:', error);
        res.status(500).json({ error: 'Failed to delete invoice', details: error.message });
      }
      break;

    default:
      res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}