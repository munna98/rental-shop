// src/pages/api/master-items/index.js
import connectDB from '../../../config/db';
import MasterItem from '../../../models/MasterItem';

export default async function handler(req, res) {
  await connectDB();
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const masterItems = await MasterItem.find();
        res.status(200).json(masterItems);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    case 'POST':
      try {
        const masterItem = new MasterItem(req.body);
        await masterItem.save();
        res.status(201).json(masterItem);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

