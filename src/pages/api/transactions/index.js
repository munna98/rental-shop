import connectDB from "../../../config/db";
import Transaction from "@/models/Transaction";
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
      sourcePage = 'receipt' 
    } = req.body;

    // Validate required fields
    if (!entityId || !entityType || !receipts || !Array.isArray(receipts)) {
      return res.status(400).json({ 
        message: "Missing required fields or invalid data format" 
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

    const createdTransactions = [];
    const errors = [];

    // Process each receipt/payment in a transaction
    for (const receiptData of receipts) {
      try {
        // Validate receipt data
        if (!receiptData.amount || !receiptData.method || !receiptData.date) {
          throw new Error("Invalid receipt data: missing required fields");
        }

        // Generate serial number
        const lastTransaction = await Transaction.findOne({ transactionType })
          .sort({ serialNumber: -1 })
          .select("serialNumber");

        let nextNumber = lastTransaction 
          ? parseInt(lastTransaction.serialNumber.slice(1)) + 1 
          : 1;

        const prefix = transactionType === "receipt" ? "R" : "P";
        const formattedSerialNumber = `${prefix}${nextNumber.toString().padStart(3, '0')}`;

        // Check for duplicate serial numbers
        const exists = await Transaction.findOne({ 
          serialNumber: formattedSerialNumber 
        });
        
        if (exists) {
          throw new Error(
            `Duplicate serial number ${formattedSerialNumber} detected.`
          );
        }

        // Create transaction
        const newTransaction = await Transaction.create({
          entityId,
          entityType,
          transactionType,
          serialNumber: formattedSerialNumber,
          amount: receiptData.amount,
          method: receiptData.method,
          date: new Date(receiptData.date),
          note: receiptData.note || '',
          sourcePage,
          entityDetails: entityType === 'account' ? {
            type: entity.type,
            category: entity.category
          } : null
        });

        createdTransactions.push(newTransaction);
      } catch (error) {
        errors.push({
          receipt: receiptData,
          error: error.message
        });
      }
    }

    // Return appropriate response based on results
    if (errors.length > 0 && createdTransactions.length === 0) {
      // All transactions failed
      return res.status(500).json({
        message: "Failed to create any transactions",
        errors
      });
    } else if (errors.length > 0) {
      // Some transactions succeeded, some failed
      return res.status(207).json({
        message: "Some transactions were created successfully",
        transactions: createdTransactions,
        errors
      });
    }

    // All transactions succeeded
    return res.status(201).json({
      message: "All transactions created successfully",
      transactions: createdTransactions
    });

  } catch (error) {
    console.error("Transaction creation error:", error);
    return res.status(500).json({ 
      message: error.message || "Error creating transactions" 
    });
  }
}


//TRansaction, replica

// // src/pages/api/receipts/index.js
// // import dbConnect from '@/lib/dbConnect';
// import connectDB from "../../../config/db";
// import Transaction from "@/models/Transaction";
// import Invoice from "@/models/Invoice";
// import { startSession } from "mongoose";

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method not allowed" });
//   }

//   const session = await startSession();
//   session.startTransaction();

//   try {
//     await connectDB();

//     const { receipts, invoiceNumber, customerId } = req.body;

//     // Get the last receipt number
//     const lastTransaction = await Transaction.findOne()
//       .sort({ serialNumber: -1 })
//       .select("serialNumber");

//     let nextserialNumber = 1;
//     if (lastTransaction) {
//       const lastNumber = parseInt(lastTransaction.serialNumber.replace("RCP", ""));
//       nextserialNumber = lastNumber + 1;
//     }

//     // Create all receipts with proper receipt numbers
//     const createdTransactions = [];
//     let totalPaidAmount = 0;

//     for (const receiptData of receipts) {
//       const formattedserialNumber = `RCP${nextserialNumber
//         .toString()
//         .padStart(3, "0")}`;

//       const newTransaction = await Transaction.create(
//         [
//           {
//             customer: customerId,
//             invoiceNumber: invoiceNumber,
//             serialNumber: formattedserialNumber,
//             amount: receiptData.amount,
//             method: receiptData.method,
//             date: new Date(receiptData.date),
//             note: receiptData.note,
//           },
//         ],
//         { session }
//       );

//       createdTransactions.push(newTransaction[0]);
//       totalPaidAmount += parseFloat(receiptData.amount);
//       nextserialNumber++;
//     }
//     // Find the invoice
//     const invoice = await Invoice.findOne({ invoiceNumber })
//     if (invoice) {
//       // Update invoice with new payment information
//       invoice.paidAmount = (invoice.paidAmount || 0) + totalPaidAmount;
//       invoice.balanceAmount = invoice.totalAmount - invoice.paidAmount;
//       invoice.paymentStatus =
//         invoice.balanceAmount <= 0 ? "completed" : "pending";
//     }

//     // Push all new receipt IDs to the invoice's receipts array
//     invoice.receipts = [
//       ...(invoice.receipts || []),
//       ...createdTransactions.map((r) => r._id),
//     ];

//     await invoice.save({ session });
//     await session.commitTransaction();

//     // Return created receipts with invoice update status
//     return res.status(201).json({
//       receipts: createdTransactions,
//       invoice: {
//         paidAmount: invoice.paidAmount,
//         balanceAmount: invoice.balanceAmount,
//         paymentStatus: invoice.paymentStatus,
//       },
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     console.error("Transaction creation error:", error);
//     return res
//       .status(500)
//       .json({ message: error.message || "Error creating receipts" });
//   } finally {
//     session.endSession();
//   }
// }
