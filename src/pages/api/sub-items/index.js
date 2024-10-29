// src/pages/api/sub-items/index.js
import connectDB from '../../../config/db';
import SubItem from '../../../models/SubItem';

export default async function handler(req, res) {
  await connectDB();
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const subItems = await SubItem.find().populate('masteritem');
        res.status(200).json(subItems);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    case 'POST':
      try {
        const subItem = new SubItem(req.body);
        await subItem.save();
        res.status(201).json(subItem);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
