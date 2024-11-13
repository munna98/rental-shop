import connectDB from "../../../config/db";
import Transaction from "@/models/Transaction";
import Customer from "@/models/Customer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { receipts, customerId, invoiceNumber, transactionType, sourcePage = 'receipt' } = req.body;

    // Validate customerId
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const createdTransactions = [];

    // Process each receipt/payment individually
    for (const receiptData of receipts) {
      // Get the last serial number for this transaction type
      const lastTransaction = await Transaction.findOne({ transactionType })
        .sort({ serialNumber: -1 })
        .select("serialNumber");

      // Calculate next serial number
      let nextNumber = 1;
      if (lastTransaction) {
        // Extract numeric part of the last serial number and increment it
        nextNumber = parseInt(lastTransaction.serialNumber.slice(1)) + 1;
      }

      // Generate serial number with appropriate prefix
      const prefix = transactionType === "receipt" ? "R" : "P";
      const formattedSerialNumber = `${prefix}${nextNumber.toString().padStart(3, '0')}`;

      // Create the transaction with unique serial number
      const newTransaction = await Transaction.create({
        customer: customerId,
        transactionType,
        serialNumber: formattedSerialNumber,
        amount: receiptData.amount,
        method: receiptData.method,
        date: new Date(receiptData.date),
        note: receiptData.note,
        sourcePage,
      });

      createdTransactions.push(newTransaction);
    }

    return res.status(201).json({
      transactions: createdTransactions,
      message: "Transactions created successfully",
    });
  } catch (error) {
    console.error("Transaction creation error:", error);
    return res
      .status(500)
      .json({ message: error.message || "Error creating transactions" });
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
