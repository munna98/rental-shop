import connectDB from '../../../config/db';
import Customer from '../../../models/Customer';

export default async function handler(req, res) {
  await connectDB();
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const customers = await Customer.find();
        res.status(200).json(customers);
      } catch (error) {
        res.status(500).json({ 
          error: 'Failed to fetch customers',
          details: error.message 
        });
      }
      break;

    case 'POST':
      try {
        // Validate required fields
        const { name, code, mobile, whatsapp, address } = req.body;
        
        // Check for missing required fields
        if (!name || !code || !mobile || !whatsapp) {
          return res.status(400).json({ 
            error: 'Missing required fields',
            requiredFields: ['name', 'code', 'mobile', 'whatsapp']
          });
        }

        const customer = new Customer({
          name,
          code,
          mobile,
          whatsapp,
          address: address || '' // Provide a default empty string if no address
        });

        await customer.save();
        res.status(201).json(customer);
      } catch (error) {
        console.error("Detailed error saving customer:", error);
        
        // More detailed error response
        res.status(500).json({ 
          error: 'Failed to save customer',
          details: error.message,
          validationErrors: error.errors 
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}