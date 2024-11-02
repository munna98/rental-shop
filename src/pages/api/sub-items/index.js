// // /pages/api/sub-items/index.js

// import connectDB from "@/config/db";
// import SubItem from "@/models/SubItem";


// export default async function handler(req, res) {
//   await connectDB();
  
//   if (req.method === "POST") {
//     // Create a new sub-item
//     const { master, name, code, rentRate, description, image, status } = req.body;

//     try {
//       const subItem = await SubItem.create({
//         master: master,
//         name,
//         code,
//         rentRate,
//         description,
//         image,
//         status,
//       });
//       res.status(201).json(subItem);
//     } catch (error) {
//       res.status(500).json({ error: "Failed to create sub-item" });
//     }
//   } else if (req.method === "GET") {
//     // Fetch all sub-items
//     try {
//       const subItems = await SubItem.find().populate('master');
//       res.status(200).json(subItems);
//     } catch (error) {
//       res.status(500).json({ error: "Failed to fetch sub-items" });
//     }
//   } else {
//     res.status(405).json({ error: "Method not allowed" });
//   }
// }


import connectDB from "@/config/db";
import SubItem from "@/models/SubItem";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    // Create a new sub-item
    const { master, name, code, rentRate, description, image, status } = req.body;

    // Validate required fields
    if (!master || !name || !code || !rentRate) {
      return res.status(400).json({ 
        message: "Missing required fields: master, name, code, and rentRate are required" 
      });
    }

    // Validate rent rate is a positive number
    if (isNaN(rentRate) || rentRate <= 0) {
      return res.status(400).json({ 
        message: "Rent rate must be a positive number" 
      });
    }

    try {
      // Check if code already exists
      const existingItem = await SubItem.findOne({ code });
      if (existingItem) {
        return res.status(400).json({ 
          message: "A sub-item with this code already exists" 
        });
      }

      const subItem = await SubItem.create({
        master,
        name,
        code,
        rentRate,
        description,
        image,
        status: "Available" // Use provided status or default to "Available"
      });

      // Populate the master field before sending response
      await subItem.populate('master');
      
      res.status(201).json(subItem);
    } catch (error) {
      console.error("Error creating sub-item:", error);
      res.status(500).json({ 
        message: "Failed to create sub-item",
        error: error.message 
      });
    }
  } else if (req.method === "GET") {
    try {
      // Add support for filtering by master item if provided
      const { master } = req.query;
      const query = master ? { master } : {};

      const subItems = await SubItem.find(query)
        .populate('master')
        .sort({ createdAt: -1 }); // Sort by newest first

      res.status(200).json(subItems);
    } catch (error) {
      console.error("Error fetching sub-items:", error);
      res.status(500).json({ 
        message: "Failed to fetch sub-items",
        error: error.message 
      });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}