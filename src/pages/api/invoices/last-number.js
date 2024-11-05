// pages/api/invoices/last-number.js
import connectDB from '@/config/db';
import Invoice from '@/models/Invoice';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    // Find the last invoice, sorted by invoiceNumber in descending order
    const lastInvoice = await Invoice.findOne({})
      .sort({ invoiceNumber: -1 })
      .select('invoiceNumber');

    if (!lastInvoice) {
      // If no invoices exist yet, return INV000
      return res.status(200).json({ lastInvoiceNumber: 'INV000' });
    }

    return res.status(200).json({ lastInvoiceNumber: lastInvoice.invoiceNumber });
  } catch (error) {
    console.error('Error fetching last invoice number:', error);
    return res.status(500).json({ error: 'Failed to fetch last invoice number' });
  }
}