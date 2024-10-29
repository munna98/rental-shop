
export const generateWhatsAppLink = ({ invoiceNumber, customerName, customerPhone, items, totalAmount }) => {
    // Generate message text with invoice details
    const message = `
      📋 Invoice #${invoiceNumber}
      Customer: ${customerName}
      Total Amount: ₹${totalAmount}
  
      Items:
      ${items
        .map(
          (item) =>
            `- ${item.name} (${item.measurements || "No measurements provided"}): ₹${item.rentRate}`
        )
        .join("\n")}
  
      Thank you for choosing us!
    `;
  
    // Encode message and phone number into a URL-friendly format for WhatsApp
    const encodedMessage = encodeURIComponent(message.trim());
    const whatsappLink = `https://wa.me/${customerPhone}?text=${encodedMessage}`;
  
    return whatsappLink;
  };
  