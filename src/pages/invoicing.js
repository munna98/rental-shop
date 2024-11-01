// export default InvoicingPage;
import React, { useState } from "react";
import { Box, Grid, Button } from "@mui/material";
import InvoiceHeader from "@/components/invoice/InvoiceHeader";
import InvoiceInfo from "@/components/invoice/InvoiceInfo";
import ItemSelection from "@/components/invoice/ItemSelection";
import SelectedItems from "@/components/invoice/SelectedItems";
import InvoiceSummary from "@/components/invoice/InvoiceSummary";
import { useInvoice } from "@/context/InvoiceContext";

const InvoicingPage = () => {
  const {
    invoiceNumber,
    dispatch,
    items,
    handlePrevious,
    handleNext,
  } = useInvoice();

  // Local state for item selection
  const [selectedItem, setSelectedItem] = useState("");
  const [measurements, setMeasurements] = useState("");
  const [rate, setRate] = useState("");

  const handleAddItem = () => {
    // Find the item from the items list or items
    const item =
      items.find((item) => item.id === parseInt(selectedItem)) ||
      items.find((item) => item.id === parseInt(selectedItem));

    if (item) {
      const customRate = parseFloat(rate);

      if (!isNaN(customRate)) {
        // Create an item with custom details
        const itemWithCustomRate = {
          ...item,
          rentRate: customRate,
          measurements,
          id: item.id, // Ensure a unique identifier
        };

        // Dispatch add item action
        dispatch({
          type: "ADD_ITEM",
          payload: itemWithCustomRate,
        });

        // Reset form fields
        setSelectedItem("");
        setRate("");
        setMeasurements("");
      } else {
        alert("Please enter a valid rent rate.");
      }
    }
  };

  const handleRemoveItem = (itemId) => {
    dispatch({
      type: "REMOVE_ITEM",
      payload: itemId,
    });
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 1200, margin: "0 auto" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
        }}
      >
        <InvoiceHeader invoiceNumber={invoiceNumber} />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <InvoiceInfo />
        </Grid>

        <Grid item xs={12} md={8}>
          <ItemSelection
          />
        </Grid>

        <Grid item xs={12}>
          <Grid item xs={12}>
            <SelectedItems />
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <InvoiceSummary />
        </Grid>
      </Grid>
    </Box>
  );
};

export default InvoicingPage;
