// src/components/forms/AddMasterItemForm.js
import React, { useState } from "react";
import { Modal, Box, TextField, Button, Typography, Snackbar, Alert } from "@mui/material";
import axios from 'axios';

const AddMasterItemForm = ({ open, handleClose, onAddNewMasterItem }) => {
  const [itemName, setItemName] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/master-items', {
        name: itemName,
        code: itemCode,
      });

      onAddNewMasterItem(response.data);

      // Show success snackbar
      setSnackbar({
        open: true,
        message: "Master item added successfully!",
        severity: "success",
      });

      handleClose();
      setItemName("");
      setItemCode("");
    } catch (error) {
      console.error("Error adding master item:", error);
      
      // Show error snackbar
      setSnackbar({
        open: true,
        message: "Failed to add master item.",
        severity: "error",
      });
    }
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            padding: 4,
            width: 400,
            margin: "auto",
            marginTop: "10%",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Add New Master Item
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Item Code"
              value={itemCode}
              onChange={(e) => setItemCode(e.target.value)}
              required
            />
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
              Add Item
            </Button>
          </form>
        </Box>
      </Modal>

      {/* Snackbar for success and error messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddMasterItemForm;
