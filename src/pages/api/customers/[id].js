// src/pages/api/customers/[id].js
import connectDB from "../../../config/db";
import Customer from "../../../models/Customer";

export default async function handler(req, res) {
  await connectDB();
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case "GET":
      try {
        const customer = await Customer.findById(id);
        if (!customer) {
          return res.status(404).json({ error: "Customer not found" });
        }
        res.status(200).json(customer);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    case "PUT":
      try {
        const updatedCustomer = await Customer.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        console.log(updatedCustomer,"up cus");
        
        if (!updatedCustomer) {
          return res.status(404).json({ error: "Customer not found" });
        }
        res.status(200).json(updatedCustomer);
      } catch (error) {
        console.error("PUT request error:", error.message); // Enhanced logging
        res
          .status(500)
          .json({ error: "Failed to update customer", details: error.message });
      }
      break;

    case "DELETE":
      try {
        const deletedCustomer = await Customer.findByIdAndDelete(id);
        if (!deletedCustomer) {
          return res.status(404).json({ error: "Customer not found" });
        }
        res.status(200).json({ message: "Customer deleted successfully" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
