// PaymentForm.js
import React from "react";
import { Paper, Grid, Button, TextField, Typography, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { EntitySearchInput } from "./EntitySearchInput";

export const PaymentForm = ({
  selectedEntity,
  setSelectedEntity,
  entityError,
  setEntityError,
  entities,
  amount,
  setAmount,
  isValidAmount,
  setIsValidAmount,
  paymentMethod,
  setPaymentMethod,
  note,
  setNote,
  paymentDate,
  setPaymentDate,
  handleAddPayment
}) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        New Payment Entry
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <EntitySearchInput
          selectedEntity={selectedEntity}
          setSelectedEntity={setSelectedEntity}
          entityError={entityError}
          setEntityError={setEntityError}
          entities={entities}
        />
      </FormControl>

      <TextField
        label="Date"
        type="date"
        value={paymentDate}
        onChange={(e) => setPaymentDate(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
        InputLabelProps={{ shrink: true }}
      />

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setIsValidAmount(true);
            }}
            fullWidth
            error={!isValidAmount}
            helperText={!isValidAmount && "Amount must be a positive number"}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id="method-label">Payment Method</InputLabel>
            <Select
              labelId="method-label"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              label="Payment Method"
            >
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="upi">UPI</MenuItem>
              <MenuItem value="card">Card</MenuItem>
              <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <TextField
        label="Note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleAddPayment}
        fullWidth
      >
        Add Payment
      </Button>
    </Paper>
  );
};