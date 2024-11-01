// src/components/forms/AddSubItemForm.js

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
  IconButton,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import axios from "axios";

const AddSubItemForm = ({
  open,
  handleClose,
  masterItems,
  onAdd,
  selectedMaster,
}) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [rentRate, setRentRate] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/api/sub-items", {
        master: selectedMaster,
        name,
        code,
        rentRate,
        description,
        image,
      });

      handleClose(); // Close the dialog after submission
      onAdd(response.data); // Call the prop function to add the new subitem to the state

      // Show success snackbar
      setSnackbar({
        open: true,
        message: "Sub item added successfully!",
        severity: "success",
      });

      // Reset the fields after submission
      setName("");
      setCode("");
      setRentRate("");
      setDescription("");
      setImage("");
    } catch (error) {
      console.error("Error adding sub item:", error);
      // Show error snackbar
      setSnackbar({
        open: true,
        message: "Failed to add subitem.",
        severity: "error",
      });
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Sub Item</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="master-item-label">Master Item</InputLabel>
            <Select
              labelId="master-item-label"
              value={selectedMaster}>
              {/* Only show the selected master item if it exists */}
              {masterItems
                .filter((item) => item._id === selectedMaster)
                .map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    {item.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <TextField
            margin="normal"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            margin="normal"
            label="Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            fullWidth
          />
          <TextField
            margin="normal"
            label="Rent Rate"
            value={rentRate}
            onChange={(e) => setRentRate(e.target.value)}
            fullWidth
          />
          <TextField
            margin="normal"
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
          />
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="image-upload"
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="image-upload">
            <IconButton component="span">
              <AttachFileIcon />
            </IconButton>
            <Typography variant="body2">Upload Image</Typography>
          </label>
          {image && (
            <img
              src={image}
              alt="Sub Item"
              style={{ width: "25%", marginTop: 10 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Add Sub Item
          </Button>
        </DialogActions>
      </Dialog>
      {/* Snackbar for success and error messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddSubItemForm;
