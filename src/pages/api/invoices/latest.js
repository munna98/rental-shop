import { invoiceService } from '@/lib/invoice';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const latestInvoiceNumber = await invoiceService.getLatestInvoiceNumber();

    return res.status(200).json({
      success: true,
      data: latestInvoiceNumber
    });

  } catch (error) {
    console.error('Latest Invoice Number API Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
