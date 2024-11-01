export const generateWhatsAppLink = ({
  invoiceNumber,
  customerName,
  customer,
  items,
  totalAmount,
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

  // Format total amount
  const formattedTotal = totalAmount.toLocaleString('en-IN');

  // Helper function to format measurements
  const formatMeasurements = (measurementArray) => {
    if (!measurementArray || !measurementArray[0]) return '';
    
    const measurements = measurementArray[0];
    const formattedMeasurements = [];

    if (measurements.item) formattedMeasurements.push(`Size: ${measurements.item}`);
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

  // Build the message with proper spacing and emojis
  const message = `🏰 *WED CASTLE*
---------------------------

📋 *Invoice #${invoiceNumber}*
📅 Date: ${new Date().toLocaleDateString('en-IN')}

👤 *Customer Details*
Name: ${customerName}${formattedWeddingDate ? `\n💒 Wedding Date: ${formattedWeddingDate}` : ''}${formattedDeliveryDate ? `\n🚚 Delivery Date: ${formattedDeliveryDate}` : ''}

📝 *Order Details*
${itemsList}

---------------------------
💰 *Total Amount: ₹${formattedTotal}*
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