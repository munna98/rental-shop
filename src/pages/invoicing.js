import React from "react";
import { Box, Grid } from "@mui/material";
import InvoiceHeader from "@/components/invoice/InvoiceHeader";
import InvoiceInfo from "@/components/invoice/InvoiceInfo";
import ItemSelection from "@/components/invoice/ItemSelection";
import SelectedItems from "@/components/invoice/SelectedItems";
import InvoiceSummary from "@/components/invoice/InvoiceSummary";
import ReceiptDetails from "@/components/invoice/ReceiptDetails";
import { useInvoice } from "@/context/InvoiceContext";

const InvoicingPage = () => {
  const { invoiceNumber } = useInvoice();

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
      </Box>
      <InvoiceHeader invoiceNumber={invoiceNumber} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <InvoiceInfo />
        </Grid>

        <Grid item xs={12} md={8}>
          <ItemSelection />
        </Grid>

        <Grid item xs={12}>
          <SelectedItems />
        </Grid>

        <Grid item xs={12} md={6}>
          <InvoiceSummary />
        </Grid>

        <Grid item xs={12} md={6}>
          <ReceiptDetails />
        </Grid>
      </Grid>
    </Box>
  );
};

export default InvoicingPage;