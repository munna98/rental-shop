import React from "react";
import { TextField, MenuItem, Box, Typography, useTheme } from "@mui/material";

const InvoiceInfo = ({
  selectedCustomer,
  setSelectedCustomer,
  deliveryDate,
  setDeliveryDate,
  weddingDate,
  setWeddingDate,
  sampleCustomers = [], // Default to an empty array to avoid errors
}) => {
  const theme = useTheme();
  return (
    <Box sx={{  padding: 2, borderRadius: 2, boxShadow: 2 }}>
      <Typography variant="h6" color="#CE5A67" gutterBottom>
        Invoice info
      </Typography>
      <TextField
        label="Customer Name"
        value={selectedCustomer}
        onChange={(e) => setSelectedCustomer(e.target.value)}
        fullWidth
        select
        sx={{ marginBottom: 2 }}
      >
        {sampleCustomers.length > 0 ? (
          sampleCustomers.map((customer) => (
            <MenuItem key={customer.id} value={customer.id}>
              {customer.name}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>No Customers Available</MenuItem>
        )}
      </TextField>
      <TextField
        label="Delivery Date"
        type="date"
        value={deliveryDate}  
        onChange={(e) => setDeliveryDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Wedding Date"
        type="date"
        value={weddingDate}
        onChange={(e) => setWeddingDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      </Box>
  );
};

export default InvoiceInfo;
