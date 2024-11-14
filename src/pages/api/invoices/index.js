// // src/pages/api/invoices/index.js
// import connectDB from '../../../config/db';
// import Invoice from '../../../models/Invoice';

// export default async function handler(req, res) {
//   await connectDB();
//   const { method } = req;

//   switch (method) {
//     case 'GET':
//       try {
//         const invoices = await Invoice.find()
//           .populate('customer')
//           .populate('items.item');
//         res.status(200).json(invoices);
//       } catch (error) {
//         res.status(500).json({ error: error.message });
//       }
//       break;

//     case 'POST':
//       try {
//         const invoice = new Invoice(req.body);
//         await invoice.save();
//         res.status(201).json(invoice);
//       } catch (error) {
//         res.status(500).json({ error: error.message });
//       }
//       break;

//     default:
//       res.setHeader('Allow', ['GET', 'POST']);
//       res.status(405).end(`Method ${method} Not Allowed`);
//   }
// }


// pages/api/invoices/index.js
import connectDB from '@/config/db';
import Invoice from '@/models/Invoice';
import Transaction from '@/models/Transaction'; // Import Transaction instead of Receipt

export default async function handler(req, res) {
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
        advanceAmount = 0,
        status = 'pending',
        paymentStatus = 'pending',
        notes = '',
        receipts = []
      } = req.body;
  
      // First create the invoice
      const invoice = new Invoice({
        invoiceNumber,
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
        balanceAmount: totalAmount - advanceAmount, // Initial balance amount
        status,
        paymentStatus,
        notes,
        receipts: receipts.map(receipt => receipt.id)
      });
  
      const savedInvoice = await invoice.save();
  
  
      // Populate the invoice with all related data
      const populatedInvoice = await Invoice.findById(savedInvoice._id)
        .populate('customer')
        .populate('items.item')
        .populate('receipts');
  
      res.status(201).json(populatedInvoice);
  
    } catch (error) {
      console.error('Error saving invoice:', error);
      res.status(400).json({ error: 'Failed to save invoice', details: error.message });
    }
  }
  
  
  
  else if (req.method === 'GET') {
    try {
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
    } catch (error) {
      console.error('Error fetching invoices:', error);
      res.status(400).json({ error: 'Failed to fetch invoices', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}