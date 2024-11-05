import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useSnackbar } from "@/hooks/useSnackbar";
import axios from "axios";

const EditMasterItemForm = ({ open, handleClose, item, onUpdate }) => {
  const [itemName, setItemName] = useState("");
  const [itemCode, setItemCode] = useState("");
  const { showSnackbar, SnackbarComponent } = useSnackbar();

  useEffect(() => {
    if (item) {
      setItemName(item.name);
      setItemCode(item.code);
    }
  }, [item]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`/api/master-items/${item._id}`, {
        name: itemName,
        code: itemCode,
      });
      
      onUpdate({ ...item, name: itemName, code: itemCode });
      showSnackbar("Item updated successfully!", "success");
      handleClose();
    } catch (error) {
      console.error("Error updating master item:", error);
      showSnackbar("Failed to update master item.", "error");
    }
  };

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
            disabled
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

      <SnackbarComponent />
    </>
  );
};

export default EditMasterItemForm;