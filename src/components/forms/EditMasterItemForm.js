// src/components/forms/EditMasterItemForm.js
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";

const EditMasterItemForm = ({ open, handleClose, item, onUpdate }) => {
  const [itemName, setItemName] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (item) {
      setItemName(item.name);
      setItemCode(item.code);
    }
  }, [item]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`/api/master-items/${item._id}`, { name: itemName, code: itemCode });
      onUpdate({ ...item, name: itemName, code: itemCode });

      setSnackbar({
        open: true,
        message: "Item updated successfully!",
        severity: "success",
      });
      
      handleClose();
    } catch (error) {
      console.error("Error updating master item:", error);
      setSnackbar({
        open: true,
        message: "Failed to update master item.",
        severity: "error",
      });
    }
  };

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Master Item</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Item Name"
            type="text"
            fullWidth
            variant="outlined"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Item Code"
            type="text"
            fullWidth
            variant="outlined"
            value={itemCode}
            onChange={(e) => setItemCode(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for update success or error messages */}
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

export default EditMasterItemForm;
