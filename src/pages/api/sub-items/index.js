// /pages/api/sub-items/index.js

import connectDB from "@/config/db";
import SubItem from "@/models/SubItem";


export default async function handler(req, res) {
  await connectDB();
  
  if (req.method === "POST") {
    // Create a new sub-item
    const { master, name, code, rentRate, description, image } = req.body;

    try {
      const subItem = await SubItem.create({
        master: master,
        name,
        code,
        rentRate,
        description,
        image,
      });
      res.status(201).json(subItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to create sub-item" });
    }
  } else if (req.method === "GET") {
    // Fetch all sub-items
    try {
      const subItems = await SubItem.find().populate('master');
      res.status(200).json(subItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sub-items" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}


