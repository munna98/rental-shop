import React, { useState } from "react";
import { Box, Grid } from "@mui/material";
import InvoiceHeader from "@/components/invoice/InvoiceHeader";
import InvoiceInfo from "@/components/invoice/InvoiceInfo";
import ItemSelection from "@/components/invoice/ItemSelection";
import SelectedItems from "@/components/invoice/SelectedItems";
import InvoiceSummary from "@/components/invoice/InvoiceSummary";

// Sample data for customers and items
const sampleCustomers = [
  { id: 1, name: "Munavir T", phone: "+918086046399" },
  { id: 2, name: "Jane Smith", phone: "+918086094070" },
];

const sampleItems = [
  { id: 1, name: "Blazer", rentRate: 500 },
  { id: 2, name: "Wedding Dress", rentRate: 1000 },
];

const InvoicingPage = () => {
  const [invoiceNumber] = useState("INV0001");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [measurements, setMeasurements] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedItem, setSelectedItem] = useState("");
  const [rate, setRate] = useState("");

  const handleAddItem = () => {
    const item = sampleItems.find((item) => item.id === parseInt(selectedItem));
    if (item) {
      const customRate = parseFloat(rate); // Ensure rate is a number
      if (!isNaN(customRate)) {
        const itemWithCustomRate = { ...item, rentRate: customRate, measurements };
        setSelectedItems((prev) => [...prev, itemWithCustomRate]);
        setTotalAmount((prev) => prev + customRate);
        setSelectedItem("");
        setRate("");
        setMeasurements("");
      } else {
        alert("Please enter a valid rent rate.");
      }
    }
  };

  const handleRemoveItem = (itemId) => {
    const itemToRemove = selectedItems.find((item) => item.id === itemId);
    setSelectedItems((prev) => prev.filter((item) => item.id !== itemId));
    setTotalAmount((prev) => prev - itemToRemove.rentRate);
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 1200, margin: "0 auto" }}>
      <InvoiceHeader invoiceNumber={invoiceNumber} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <InvoiceInfo
            selectedCustomer={selectedCustomer}
            setSelectedCustomer={setSelectedCustomer}
            deliveryDate={deliveryDate}
            setDeliveryDate={setDeliveryDate}
            weddingDate={weddingDate}
            setWeddingDate={setWeddingDate}
            sampleCustomers={sampleCustomers}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <ItemSelection
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            measurements={measurements}
            setMeasurements={setMeasurements}
            rate={rate}
            setRate={setRate}
            handleAddItem={handleAddItem}
            sampleItems={sampleItems}
          />
        </Grid>
        <Grid item xs={12}>
          <SelectedItems selectedItems={selectedItems} handleRemoveItem={handleRemoveItem} />
        </Grid>
        <Grid item xs={12}>
          <InvoiceSummary
            totalAmount={totalAmount}
            invoiceNumber={invoiceNumber}
            selectedCustomer={selectedCustomer}
            selectedItems={selectedItems}
            measurements={measurements}
            deliveryDate={deliveryDate}
            weddingDate={weddingDate}
            sampleCustomers={sampleCustomers}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default InvoicingPage;
