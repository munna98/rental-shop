import connectDB from "@/config/db"; // Adjust the path based on your db connection file location
import Invoice from "@/models/Invoice"; // Adjust the path based on your models location

export const invoiceService = {
  // Get invoice by number with populated data
  getByNumber: async (invoiceNumber) => {
    await connectDB();

    const invoice = await Invoice.findOne({ invoiceNumber })
      .populate({
        path: "customer",
      })
      .populate({
        path: "items.item",
      })
      .populate({
        path: "receipts",
      });

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    // Format the response to match the frontend expectations
    return {
      invoiceNumber: invoice.invoiceNumber,
      customer: invoice.customer,
      items: invoice.items.map((item) => ({
        _id: item.item._id,
        name: item.item.name,
        rentRate: item.rentRate,
        measurement: item.measurement,
      })),
      deliveryDate: invoice.deliveryDate,
      weddingDate: invoice.weddingDate,
      totalAmount: invoice.totalAmount,
      paidAmount: invoice.paidAmount,
      balanceAmount: invoice.balanceAmount,
      paymentStatus: invoice.paymentStatus,
      receipts: invoice.receipts,
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    };
  },

  // Get the latest invoice number
  getLatestInvoiceNumber: async () => {
    await connectDB();

    const latestInvoice = await Invoice.findOne()
      .sort({ invoiceNumber: -1 })
      .select("invoiceNumber");

    if (!latestInvoice) {
      return "INV000";
    }

    return latestInvoice.invoiceNumber;
  },

  getPreviousInvoice: async (currentInvoiceNumber) => {
    const currentNumber = parseInt(currentInvoiceNumber.replace("INV", ""));
    const previousNumber = currentNumber - 1;

    if (previousNumber < 1) {
      throw new Error("No previous invoice exists");
    }

    const previousInvoiceNumber = `INV${previousNumber
      .toString()
      .padStart(3, "0")}`;
    return await invoiceService.getByNumber(previousInvoiceNumber);
  },

  // Get next invoice
  getNextInvoice: async (currentInvoiceNumber) => {
    const latestInvoiceNumber = await invoiceService.getLatestInvoiceNumber();
    const currentNumber = parseInt(currentInvoiceNumber.replace("INV", ""));
    const latestNumber = parseInt(latestInvoiceNumber.replace("INV", ""));

    if (currentNumber >= latestNumber) {
      throw new Error("No next invoice exists");
    }

    const nextInvoiceNumber = `INV${(currentNumber + 1)
      .toString()
      .padStart(3, "0")}`;
    return await invoiceService.getByNumber(nextInvoiceNumber);
  },
};
