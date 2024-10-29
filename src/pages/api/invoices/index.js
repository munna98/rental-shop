// src/pages/api/invoices/index.js
import connectDB from '../../../config/db';
import Invoice from '../../../models/Invoice';

export default async function handler(req, res) {
  await connectDB();
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const invoices = await Invoice.find()
          .populate('customer')
          .populate('items.item');
        res.status(200).json(invoices);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    case 'POST':
      try {
        const invoice = new Invoice(req.body);
        await invoice.save();
        res.status(201).json(invoice);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
