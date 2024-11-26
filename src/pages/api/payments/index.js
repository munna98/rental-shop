import connectDB from "../../../config/db"; 
import Payment from "@/models/Payment";
import Customer from "@/models/Customer";
import Account from "@/models/Account";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { 
      payments, 
      entityId, 
      entityType, 
      transactionType, 
      sourcePage,
      invoiceNumber, 
    } = req.body;

    // Validate required fields
    if (!entityId || !entityType || !payments || !Array.isArray(payments)) {
      return res.status(400).json({ 
        message: "Missing required fields or invalid data format" 
      });
    }

    // Ensure entityType is a single string, not an array
    if (Array.isArray(entityType)) {
      return res.status(400).json({
        message: "entityType must be a single string ('customer' or 'account')"
      });
    }

    // Validate entity exists based on type
    let entity;
    if (entityType === 'customer') {
      entity = await Customer.findById(entityId);
    } else if (entityType === 'account') {
      entity = await Account.findById(entityId);
    } else {
      return res.status(400).json({ 
        message: "Invalid entity type. Must be 'customer' or 'account'" 
      });
    }

    if (!entity) {
      return res.status(404).json({ 
        message: `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} not found` 
      });
    }

    const createdPayments = [];
    const errors = [];

    // Process each payment in a payments
    for (const paymentData of payments) {
      try {
        // Validate payment data
        if (!paymentData.amount || !paymentData.method || !paymentData.date) {
          throw new Error("Invalid payment data: missing required fields");
        }

        // Generate serial number
        const lastPayment = await Payment.findOne({ 
          transactionType: transactionType || 'payment' 
        })
          .sort({ serialNumber: -1 })
          .select("serialNumber");

        let nextNumber = lastPayment 
          ? parseInt(lastPayment.serialNumber.slice(1)) + 1 
          : 1;

        const prefix =  "P";
        const formattedSerialNumber = `${prefix}${nextNumber.toString().padStart(3, '0')}`;

        // Check for duplicate serial numbers
        const exists = await Payment.findOne({ 
          serialNumber: formattedSerialNumber 
        });
        
        if (exists) {
          throw new Error(
            `Duplicate serial number ${formattedSerialNumber} detected.`
          );
        }

        // Create transaction with proper data formatting
        const newPayment = await Payment.create({
          entityId,
          entityType: entityType.toLowerCase(), // Ensure consistent casing
          transactionType:'payment',
          serialNumber: formattedSerialNumber,
          amount: parseFloat(paymentData.amount),
          method: paymentData.method,
          date: new Date(paymentData.date),
          note: paymentData.note || '',
          sourcePage: sourcePage ,
          invoiceNumber,
          entityDetails: entityType === 'account' ? {
            type: entity.type,
            category: entity.category
          } : null
        });

        createdPayments.push(newPayment);
      } catch (error) {
        errors.push({
          payment: paymentData,
          error: error.message
        });
      }
    }

    // Return appropriate response based on results
    if (errors.length > 0 && createdPayments.length === 0) {
      // All payments failed
      return res.status(500).json({
        message: "Failed to create any payments",
        errors
      });
    } else if (errors.length > 0) {
      // Some payments succeeded, some failed
      return res.status(207).json({
        message: "Some payments were created successfully",
        payments: createdPayments,
        errors
      });
    }

    // All payments succeeded
    return res.status(201).json({
      message: "All payments created successfully",
      payments: createdPayments
    });

  } catch (error) {
    console.error("Payments creation error:", error);
    return res.status(500).json({ 
      message: error.message || "Error creating payments" 
    });
  }
}