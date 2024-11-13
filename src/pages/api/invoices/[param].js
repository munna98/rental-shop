// pages/api/invoices/[param].js
import connectDB from '@/config/db';
import Invoice from '@/models/Invoice';
import Transaction from '@/models/Transaction'; 
import { invoiceService } from '@/lib/invoice';

export default async function handler(req, res) {
  const { param, action } = req.query;

  await connectDB();

  switch (req.method) {
    case 'GET':
      try {
        let invoice;

        // Check if `param` is an invoice number or ID
        if (/^INV\d{3}$/.test(param)) {
          // Fetch by invoice number and handle navigation
          let navigationInfo = {
            hasPrevious: parseInt(param.replace('INV', '')) > 1,
            hasNext: false
          };

          if (action === 'previous') {
            invoice = await invoiceService.getPreviousInvoice(param);
          } else if (action === 'next') {
            invoice = await invoiceService.getNextInvoice(param);
          } else {
            invoice = await invoiceService.getByNumber(param);
          }

          // Check if next invoice exists
          const latestInvoiceNumber = await invoiceService.getLatestInvoiceNumber();
          const currentNumber = parseInt(param.replace('INV', ''));
          const latestNumber = parseInt(latestInvoiceNumber.replace('INV', ''));
          navigationInfo.hasNext = currentNumber < latestNumber;

          return res.status(200).json({
            success: true,
            data: invoice,
            navigation: navigationInfo
          });

        } else {
          // Fetch by ID
          invoice = await Invoice.findById(param)
            .populate('customer')
            .populate('items.item');

          if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
          }

          return res.status(200).json(invoice);
        }
      } catch (error) {
        console.error('Error fetching invoice:', error);
        return res.status(500).json({ error: 'Failed to fetch invoice', details: error.message });
      }

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
          param,
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

        return res.status(200).json(updatedInvoice);
      } catch (error) {
        console.error('Error updating invoice:', error);
        return res.status(400).json({ error: 'Failed to update invoice', details: error.message });
      }

    case 'DELETE':
      try {
        const deletedInvoice = await Invoice.findByIdAndDelete(param);

        if (!deletedInvoice) {
          return res.status(404).json({ error: 'Invoice not found' });
        }

        return res.status(200).json({ message: 'Invoice deleted successfully', deletedInvoice });
      } catch (error) {
        console.error('Error deleting invoice:', error);
        return res.status(500).json({ error: 'Failed to delete invoice', details: error.message });
      }

    default:
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}