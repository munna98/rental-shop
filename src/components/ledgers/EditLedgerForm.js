import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  InputAdornment,
} from "@mui/material";
import { DatePicker } from "@mui/lab";

const EditLedgerForm = ({ open, handleClose, onEditLedger }) => {
  const [formData, setFormData] = useState({
    type: "",
    amount: "",
    description: "",
    date: new Date(),
    party: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (newDate) => {
    setFormData((prev) => ({
      ...prev,
      date: newDate,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onEditLedger(formData);
    setFormData({
      type: "",
      amount: "",
      description: "",
      date: new Date(),
      party: "",
      notes: "",
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit New Ledger Entry</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControl fullWidth required>
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                label="Type"
              >
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
                <MenuItem value="party">Party Transaction</MenuItem>
              </Select>
            </FormControl>

            <TextField
              required
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
              }}
            />

            <TextField
              required
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />

            <DatePicker
              label="Date"
              value={formData.date}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} required />}
            />

            <TextField
              label="Party Name"
              name="party"
              value={formData.party}
              onChange={handleChange}
            />

            <TextField
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Edit Ledger
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditLedgerForm;