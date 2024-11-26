import connectDB from "../../../config/db"; 
import Receipt from "@/models/Receipt";
import Customer from "@/models/Customer";
import Account from "@/models/Account";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { 
      receipts, 
      entityId, 
      entityType, 
      transactionType, 
      sourcePage,
      invoiceNumber, 
    } = req.body;

    // Validate required fields
    if (!entityId || !entityType || !receipts || !Array.isArray(receipts)) {
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

    const createdReceipts = [];
    const errors = [];

    // Process each receipt in a receipts
    for (const receiptData of receipts) {
      try {
        // Validate receipt data
        if (!receiptData.amount || !receiptData.method || !receiptData.date) {
          throw new Error("Invalid receipt data: missing required fields");
        }

        // Generate serial number
        const lastReceipt = await Receipt.findOne({ 
          transactionType: transactionType || 'receipt' 
        })
          .sort({ serialNumber: -1 })
          .select("serialNumber");

        let nextNumber = lastReceipt 
          ? parseInt(lastReceipt.serialNumber.slice(1)) + 1 
          : 1;

        const prefix =  "R";
        const formattedSerialNumber = `${prefix}${nextNumber.toString().padStart(3, '0')}`;

        // Check for duplicate serial numbers
        const exists = await Receipt.findOne({ 
          serialNumber: formattedSerialNumber 
        });
        
        if (exists) {
          throw new Error(
            `Duplicate serial number ${formattedSerialNumber} detected.`
          );
        }

        // Create transaction with proper data formatting
        const newReceipt = await Receipt.create({
          entityId,
          entityType: entityType.toLowerCase(), // Ensure consistent casing
          transactionType:'receipt',
          serialNumber: formattedSerialNumber,
          amount: parseFloat(receiptData.amount),
          method: receiptData.method,
          date: new Date(receiptData.date),
          note: receiptData.note || '',
          sourcePage: sourcePage || 'invoicing',
          invoiceNumber,
          entityDetails: entityType === 'account' ? {
            type: entity.type,
            category: entity.category
          } : null
        });

        createdReceipts.push(newReceipt);
      } catch (error) {
        errors.push({
          receipt: receiptData,
          error: error.message
        });
      }
    }

    // Return appropriate response based on results
    if (errors.length > 0 && createdReceipts.length === 0) {
      // All receipts failed
      return res.status(500).json({
        message: "Failed to create any receipts",
        errors
      });
    } else if (errors.length > 0) {
      // Some transactions succeeded, some failed
      return res.status(207).json({
        message: "Some receipts were created successfully",
        receipts: createdReceipts,
        errors
      });
    }

    // All transactions succeeded
    return res.status(201).json({
      message: "All receipts created successfully",
      receipts: createdReceipts
    });

  } catch (error) {
    console.error("Receipts creation error:", error);
    return res.status(500).json({ 
      message: error.message || "Error creating receipts" 
    });
  }
}