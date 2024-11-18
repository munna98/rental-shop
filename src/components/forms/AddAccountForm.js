// components/forms/AddAccountForm.js
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
  Alert,
  Box,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useAccounts } from "@/context/AccountsContext";

const INITIAL_FORM_STATE = {
  name: "",
  type: "income",
  description: "",
  balance: 0,
  currency: "INR",
  category: "general"
};

const AddAccountForm = ({ open, handleClose, selectedAccount }) => {
  const { addAccount, updateAccount } = useAccounts();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (open && selectedAccount) {
      setFormData(selectedAccount);
    } else {
      setFormData(INITIAL_FORM_STATE);
    }
    setErrors({});
    setSubmitError("");
  }, [open, selectedAccount]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Account name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Account name must be at least 3 characters";
    }
    
    if (!formData.type) {
      newErrors.type = "Account type is required";
    }
    
    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (isNaN(formData.balance)) {
      newErrors.balance = "Balance must be a number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is modified
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");
    
    if (!validateForm()) {
      return;
    }

    const result = selectedAccount
      ? await updateAccount(selectedAccount._id, formData)
      : await addAccount(formData);

    if (result.success) {
      handleClose();
    } else {
      setSubmitError(result.error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {selectedAccount ? "Edit Account" : "Add Account"}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <ClearIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              name="name"
              label="Account Name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
              required
            />
            <TextField
              name="type"
              label="Account Type"
              value={formData.type}
              onChange={handleChange}
              select
              error={!!errors.type}
              helperText={errors.type}
              fullWidth
              required
            >
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
              <MenuItem value="asset">Asset</MenuItem>
              <MenuItem value="liability">Liability</MenuItem>
            </TextField>
            <TextField
              name="balance"
              label="Balance"
              type="number"
              value={formData.balance}
              onChange={handleChange}
              error={!!errors.balance}
              helperText={errors.balance}
              fullWidth
              required
            />
            <TextField
              name="category"
              label="Category"
              value={formData.category}
              onChange={handleChange}
              error={!!errors.category}
              helperText={errors.category}
              fullWidth
              required
            />
            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {selectedAccount ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddAccountForm;