import React from "react";
import { Box, Typography, IconButton, TextField, Autocomplete, Paper } from "@mui/material";
import { useInvoice } from "@/context/InvoiceContext";
import AddIcon from "@mui/icons-material/Add";

const InvoiceInfo = () => {
  const {
    selectedCustomer,
    dispatch,
    deliveryDate,
    weddingDate,
    customers = [],
  } = useInvoice();

  const handleCustomerChange = (event, newValue) => {
    dispatch({
      type: "SET_CUSTOMER",
      payload: newValue?._id || null,
    });
  };

  const handleDeliveryDateChange = (e) => {
    dispatch({
      type: "SET_DELIVERY_DATE",
      payload: e.target.value,
    });
  };

  const handleWeddingDateChange = (e) => {
    dispatch({
      type: "SET_WEDDING_DATE",
      payload: e.target.value,
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return ""; // Handle null or undefined dates
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Extract the date part in yyyy-MM-dd format
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" color="#CE5A67" gutterBottom sx={{ mb: 3 }}>
        Invoice Info
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Autocomplete
          options={customers}
          getOptionLabel={(option) => option.name || ""}
          value={selectedCustomer || null}
          onChange={handleCustomerChange}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          renderInput={(params) => (
            <TextField {...params} label="Customer Name" variant="outlined" />
          )}
          renderOption={(props, option) => (
            <Box component="li" {...props}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body1">{option.name}</Typography>
                {option.code && (
                  <Typography variant="caption" color="text.secondary">
                    {option.code}
                  </Typography>
                )}
              </Box>
            </Box>
          )}
          fullWidth
          filterOptions={(options, { inputValue }) => {
            const filterValue = inputValue.toLowerCase();
            return options.filter(
              (option) =>
                option.name.toLowerCase().includes(filterValue) ||
                (option.code && option.code.toLowerCase().includes(filterValue))
            );
          }}
        />

        <TextField
          label="Delivery Date"
          type="date"
          value={formatDate(deliveryDate)}
          onChange={handleDeliveryDateChange}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
        />

        <TextField
          label="Wedding Date"
          type="date"
          value={formatDate(weddingDate)} 
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
        />
      </Box>
    </Paper>
  );
};

export default InvoiceInfo;
