import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useAccounts } from "@/context/AccountsContext";

const Payment = () => {
  const { addTransaction } = useAccounts();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleAddPayment = () => {
    if (amount) {
      addTransaction({
        id: Date.now().toString(),
        type: "income",
        amount: parseFloat(amount),
        description: description || "Payment",
        date: new Date(),
      });
      setAmount("");
      setDescription("");
    }
  };

  return (
    <Box>
      <Typography variant="h6">Add Payment</Typography>
      <TextField
        label="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleAddPayment}>
        Add Payment
      </Button>
    </Box>
  );
};

export default Payment;
