import React, { useState } from "react";
import { TextField, Button, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { useAccounts } from "@/context/AccountsContext"; // Importing context

const AddAccountForm = ({ account, onClose }) => {
  const { addAccount } = useAccounts(); // Accessing context function to add account
  const [accountName, setAccountName] = useState(account ? account.name : "");
  const [accountType, setAccountType] = useState(account ? account.type : "income");

  const handleSubmit = (event) => {
    event.preventDefault();
    const newAccount = { name: accountName, type: accountType };
    addAccount(newAccount);
    onClose(); // Close the form after submission
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Account Name"
        value={accountName}
        onChange={(e) => setAccountName(e.target.value)}
        fullWidth
        required
      />
      <FormControl fullWidth required>
        <InputLabel>Account Type</InputLabel>
        <Select
          value={accountType}
          onChange={(e) => setAccountType(e.target.value)}
          label="Account Type"
        >
          <MenuItem value="income">Income</MenuItem>
          <MenuItem value="expense">Expense</MenuItem>
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" color="primary">
        {account ? "Update Account" : "Add Account"}
      </Button>
    </form>
  );
};

export default AddAccountForm;
