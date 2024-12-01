// pages/api/invoices/[param].js
import connectDB from "@/config/db";
import Invoice from "@/models/Invoice";
import Transaction from "@/models/Transaction";
import { invoiceService } from "@/lib/invoice";

export default async function handler(req, res) {
  const { param, action } = req.query;

  await connectDB();

  switch (req.method) {
    case "GET":
      try {
        let invoice;

        // Check if `param` is an invoice number or ID
        if (/^INV\d{3}$/.test(param)) {
          // Fetch by invoice number and handle navigation
          let navigationInfo = {
            hasPrevious: parseInt(param.replace("INV", "")) > 1,
            hasNext: false,
          };

          if (action === "previous") {
            invoice = await invoiceService.getPreviousInvoice(param);
          } else if (action === "next") {
            invoice = await invoiceService.getNextInvoice(param);
          } else {
            invoice = await invoiceService.getByNumber(param);
          }

          // Check if next invoice exists
          const latestInvoiceNumber =
            await invoiceService.getLatestInvoiceNumber();
          const currentNumber = parseInt(param.replace("INV", ""));
          const latestNumber = parseInt(latestInvoiceNumber.replace("INV", ""));
          navigationInfo.hasNext = currentNumber < latestNumber;

          return res.status(200).json({
            success: true,
            data: invoice,
            navigation: navigationInfo,
          });
        } else {
          // Fetch by ID
          invoice = await Invoice.findById(param)
            .populate("customer")
            .populate("items.item");

          if (!invoice) {
            return res.status(404).json({ error: "Invoice not found" });
          }

          return res.status(200).json(invoice);
        }
      } catch (error) {
        console.error("Error fetching invoice:", error);
        return res
          .status(500)
          .json({ error: "Failed to fetch invoice", details: error.message });
      }

    // case 'PUT':
    //   try {
    //     const {
    //       customer,
    //       items,
    //       totalAmount,
    //       deliveryDate,
    //       weddingDate,
    //       advanceAmount,
    //       status,
    //       paymentStatus,
    //       notes,
    //       receipts
    //     } = req.body;

    //     // Calculate balance amount
    //     const balanceAmount = totalAmount - (advanceAmount || 0);

    //     // Prepare update object for the invoice
    //     const updateInvoiceData = {
    //       customer: customer._id,
    //       items: items.map(item => ({
    //         item: item._id,
    //         measurement: item.measurement || [{}],
    //         rentRate: item.rentRate,
    //         name: item.name,
    //         category: item.category
    //       })),
    //       totalAmount,
    //       deliveryDate,
    //       weddingDate,
    //       advanceAmount,
    //       balanceAmount,
    //       status,
    //       paymentStatus,
    //       notes
    //     };

    //     // Update invoice
    //     const updatedInvoice = await Invoice.findByIdAndUpdate(
    //       param,
    //       updateInvoiceData,
    //       {
    //         new: true,
    //         runValidators: true
    //       }
    //     )
    //     .populate('customer')
    //     .populate('items.item');

    //     if (!updatedInvoice) {
    //       return res.status(404).json({ error: 'Invoice not found' });
    //     }

    //     // Update associated receipts
    //     if (receipts && receipts.length) {
    //       for (const receipt of receipts) {
    //         if (receipt._id) {
    //           // Update existing receipt
    //           await Receipt.findByIdAndUpdate(
    //             receipt._id,
    //             {
    //               ...receipt,
    //               relatedInvoice: param // Ensure the receipt is still linked to this invoice
    //             },
    //             { new: true, runValidators: true }
    //           );
    //         } else {
    //           // Create new receipt if no _id is provided
    //           await Receipt.create({
    //             ...receipt,
    //             relatedInvoice: param
    //           });
    //         }
    //       }
    //     }

    //     return res.status(200).json({ success: true, data: updatedInvoice });
    //   } catch (error) {
    //     console.error('Error updating invoice:', error);
    //     return res.status(400).json({ error: 'Failed to update invoice', details: error.message });
    //   }

    case "PUT":
      try {
        let invoice;

        // Check if param is an invoice number or ID
        if (/^INV\d{3}$/.test(param)) {
          // Find invoice by invoice number
          invoice = await Invoice.findOne({ invoiceNumber: param });
        } else {
          // Find invoice by ID
          invoice = await Invoice.findById(param);
        }

        if (!invoice) {
          return res.status(404).json({ error: "Invoice not found" });
        }

        const {
          customer,
          items,
          totalAmount,
          deliveryDate,
          weddingDate,
          paidAmount = 0,
          status,
          notes = "",
          receipts = [],
        } = req.body;

        // Calculate payment status based on paid amount
        const paymentStatus =
          paidAmount >= totalAmount
            ? "completed"
            : paidAmount > 0
            ? "partial"
            : "pending";

        // Prepare update object for the invoice
        const updateInvoiceData = {
          customer: customer._id,
          items: items.map((item) => ({
            item: item._id,
            measurement: item.measurement || [{}],
            rentRate: item.rentRate,
            name: item.name,
            category: item.category,
            status: "Rented",
            deliveryStatus: "Pending",
          })),
          totalAmount,
          deliveryDate,
          weddingDate,
          paidAmount,
          balanceAmount: totalAmount - paidAmount,
          paymentStatus,
          status,
          notes,
          receipts: receipts.map((receipt) => receipt.id),
        };

        // Update invoice
        const updatedInvoice = await Invoice.findByIdAndUpdate(
          invoice._id,
          updateInvoiceData,
          {
            new: true,
            runValidators: true,
          }
        )
          .populate("customer")
          .populate("items.item")
          .populate("receipts");

        // Update receipts if any
        if (receipts.length > 0) {
          await Transaction.updateMany(
            { _id: { $in: receipts.map((r) => r.id) } },
            { $set: { invoice: updatedInvoice._id } }
          );
        }

        return res.status(200).json(updatedInvoice);
      } catch (error) {
        console.error("Error updating invoice:", error);
        return res.status(400).json({
          error: "Failed to update invoice",
          details: error.message,
        });
      }

    case "DELETE":
      try {
        const deletedInvoice = await Invoice.findByIdAndDelete(param);

        if (!deletedInvoice) {
          return res.status(404).json({ error: "Invoice not found" });
        }

        return res
          .status(200)
          .json({ message: "Invoice deleted successfully", deletedInvoice });
      } catch (error) {
        console.error("Error deleting invoice:", error);
        return res
          .status(500)
          .json({ error: "Failed to delete invoice", details: error.message });
      }

    default:
      return res
        .status(405)
        .json({ error: `Method ${req.method} not allowed` });
  }
}
