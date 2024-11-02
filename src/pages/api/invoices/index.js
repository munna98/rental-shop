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
        notes = ''
      } = req.body;

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
        balanceAmount: totalAmount - advanceAmount,
        status,
        paymentStatus,
        notes
      });

      const savedInvoice = await invoice.save();
      
      // Populate the customer and item details before sending response
      const populatedInvoice = await Invoice.findById(savedInvoice._id)
        .populate('customer')
        .populate('items.item');

      res.status(201).json(populatedInvoice);
    } catch (error) {
      console.error('Error saving invoice:', error);
      res.status(400).json({ error: 'Failed to save invoice', details: error.message });
    }
  } else if (req.method === 'GET') {
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