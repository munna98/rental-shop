import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  IconButton,
  InputAdornment,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useAccounts } from "@/context/AccountsContext";

const AddAccountForm = ({ open, handleClose, selectedAccount }) => {
  const { addAccount, updateAccount } = useAccounts();

  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState("income");

  useEffect(() => {
    if (open && selectedAccount) {
      setAccountName(selectedAccount.name);
      setAccountType(selectedAccount.type);
    } else {
      setAccountName("");
      setAccountType("income");
    }
  }, [open, selectedAccount]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const newAccount = {
      name: accountName,
      type: accountType,
    };

    if (selectedAccount) {
      updateAccount(selectedAccount._id, newAccount);
    } else {
      addAccount(newAccount);
    }
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {selectedAccount ? "Edit Account" : "Add Account"}
        {selectedAccount && (
          <IconButton
            aria-label="delete"
            onClick={() => {
              updateAccount(selectedAccount._id, { ...selectedAccount, deleted: true });
              handleClose();
            }}
            style={{ position: "absolute", top: 8, right: 8 }}
          >
            <ClearIcon />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent>
        <TextField
          margin="normal"
          label="Account Name"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          fullWidth
          required
        />
        <TextField
          margin="normal"
          label="Account Type"
          value={accountType}
          onChange={(e) => setAccountType(e.target.value)}
          fullWidth
          select
        >
          <MenuItem value="income">Income</MenuItem>
          <MenuItem value="expense">Expense</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          {selectedAccount ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAccountForm;