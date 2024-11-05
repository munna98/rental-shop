import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useAccounts } from "@/context/AccountsContext";

const Receipt = () => {
  const { addTransaction } = useAccounts();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleAddReceipt = () => {
    if (amount) {
      addTransaction({
        id: Date.now().toString(),
        type: "expense",
        amount: parseFloat(amount),
        description: description || "Receipt",
        date: new Date(),
      });
      setAmount("");
      setDescription("");
    }
  };

  return (
    <Box>
      <Typography variant="h6">Add Receipt</Typography>
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
      <Button variant="contained" color="primary" onClick={handleAddReceipt}>
        Add Receipt
      </Button>
    </Box>
  );
};

export default Receipt;
