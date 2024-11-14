export const generateWhatsAppLink = ({
  invoiceNumber,
  customerName,
  customer,
  items,
  totalAmount,
  paidAmount,
  balanceAmount,
  deliveryDate,
  weddingDate
}) => {
  // Format dates if they exist
  const formattedDeliveryDate = deliveryDate
    ? new Date(deliveryDate).toLocaleDateString('en-IN')
    : null;

  const formattedWeddingDate = weddingDate
    ? new Date(weddingDate).toLocaleDateString('en-IN')
    : null;

  // Format amounts
  const formattedTotal = totalAmount.toLocaleString('en-IN');
  const formattedPaid = paidAmount.toLocaleString('en-IN');
  const formattedBalance = balanceAmount.toLocaleString('en-IN');

  // Helper function to format measurements
  const formatMeasurements = (measurementArray) => {
    if (!measurementArray || !measurementArray[0]) return '';

    const measurements = measurementArray[0];
    const formattedMeasurements = [];

    if (measurements.item) formattedMeasurements.push(`Item Type: ${measurements.item}`);
    if (measurements.sleeve) formattedMeasurements.push(`Sleeve: ${measurements.sleeve}`);
    if (measurements.waist) formattedMeasurements.push(`Waist: ${measurements.waist}`);
    if (measurements.length) formattedMeasurements.push(`Length: ${measurements.length}`);
    if (measurements.pantsize) formattedMeasurements.push(`Pant: ${measurements.pantsize}`);

    return formattedMeasurements.length > 0
      ? `\n     📏 ${formattedMeasurements.join(' | ')}`
      : '';
  };

  // Generate itemized list with proper formatting
  const itemsList = items
    .map((item) => {
      const measurements = formatMeasurements(item.measurement);
      const rate = item.rentRate.toLocaleString('en-IN');
      return `   • ${item.name}${measurements}\n     ₹${rate}`;
    })
    .join('\n\n');

  // Build the message with paid and balance amounts
  const message = `🏰 *WED CASTLE*
---------------------------

📋 *Invoice #${invoiceNumber}*
📅 Date: ${new Date().toLocaleDateString('en-IN')}

👤 *Customer Details*
Name: ${customerName}
      ${formattedDeliveryDate ? `\n🚚 Delivery Date: ${formattedDeliveryDate}` : ''}
      ${formattedWeddingDate ? `\n💒 Wedding Date: ${formattedWeddingDate}` : ''}
📝 *Order Details*
${itemsList}

---------------------------
💰 *Total Amount: ₹${formattedTotal}*
✅ *Paid Amount: ₹${formattedPaid}*
🔴 *Balance Amount: ₹${formattedBalance}*
---------------------------

Thank you for choosing Wed Castle! 🙏
For any queries, please feel free to contact us.

Follow us on Instagram: @wedcastle
Visit our website: www.wedcastle.in
---------------------------
*Terms & Conditions Apply*`;

  // Encode message and number into a URL-friendly format
  const encodedMessage = encodeURIComponent(message.trim());
  const whatsappLink = `https://wa.me/${customer}?text=${encodedMessage}`;

  return whatsappLink;
};