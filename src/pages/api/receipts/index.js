import connectDB from "../../../config/db";
import Receipt from "@/models/Receipt";
import Customer from "@/models/Customer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { receipts, customerId, sourcePage = 'receipt' } = req.body;

    // Validate customerId
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Get the last receipt number
    const lastReceipt = await Receipt.findOne()
      .sort({ receiptNumber: -1 })
      .select("receiptNumber");

    let nextReceiptNumber = 1;
    if (lastReceipt) {
      const lastNumber = parseInt(lastReceipt.receiptNumber.replace("RCP", ""));
      nextReceiptNumber = lastNumber + 1;
    }

    const createdReceipts = [];

    for (const receiptData of receipts) {
      const formattedReceiptNumber = `RCP${nextReceiptNumber
        .toString()
        .padStart(3, "0")}`;

      const newReceipt = await Receipt.create({
        customer: customerId,
        receiptNumber: formattedReceiptNumber,
        amount: receiptData.amount,
        receiptMethod: receiptData.method,
        receiptDate: new Date(receiptData.date),
        note: receiptData.note,
        sourcePage, // Track the source of the receipt
      });

      createdReceipts.push(newReceipt);
      nextReceiptNumber++;
    }

    return res.status(201).json({
      receipts: createdReceipts,
      message: "Receipts created successfully"
    });
  } catch (error) {
    console.error("Receipt creation error:", error);
    return res
      .status(500)
      .json({ message: error.message || "Error creating receipts" });
  }
}

//TRansaction, replica

// // src/pages/api/receipts/index.js
// // import dbConnect from '@/lib/dbConnect';
// import connectDB from "../../../config/db";
// import Receipt from "@/models/Receipt";
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
//     const lastReceipt = await Receipt.findOne()
//       .sort({ receiptNumber: -1 })
//       .select("receiptNumber");

//     let nextReceiptNumber = 1;
//     if (lastReceipt) {
//       const lastNumber = parseInt(lastReceipt.receiptNumber.replace("RCP", ""));
//       nextReceiptNumber = lastNumber + 1;
//     }

//     // Create all receipts with proper receipt numbers
//     const createdReceipts = [];
//     let totalPaidAmount = 0;

//     for (const receiptData of receipts) {
//       const formattedReceiptNumber = `RCP${nextReceiptNumber
//         .toString()
//         .padStart(3, "0")}`;

//       const newReceipt = await Receipt.create(
//         [
//           {
//             customer: customerId,
//             invoiceNumber: invoiceNumber,
//             receiptNumber: formattedReceiptNumber,
//             amount: receiptData.amount,
//             receiptMethod: receiptData.method,
//             receiptDate: new Date(receiptData.date),
//             note: receiptData.note,
//           },
//         ],
//         { session }
//       );

//       createdReceipts.push(newReceipt[0]);
//       totalPaidAmount += parseFloat(receiptData.amount);
//       nextReceiptNumber++;
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
//       ...createdReceipts.map((r) => r._id),
//     ];

//     await invoice.save({ session });
//     await session.commitTransaction();

//     // Return created receipts with invoice update status
//     return res.status(201).json({
//       receipts: createdReceipts,
//       invoice: {
//         paidAmount: invoice.paidAmount,
//         balanceAmount: invoice.balanceAmount,
//         paymentStatus: invoice.paymentStatus,
//       },
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     console.error("Receipt creation error:", error);
//     return res
//       .status(500)
//       .json({ message: error.message || "Error creating receipts" });
//   } finally {
//     session.endSession();
//   }
// }
