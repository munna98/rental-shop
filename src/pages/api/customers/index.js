// src/pages/api/customers/index.js
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
        res.status(500).json({ error: error.message });
      }
      break;

    case 'POST':aa
      try {
        const customer = new Customer(req.body);
        await customer.save();
        res.status(201).json(customer);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
