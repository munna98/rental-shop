import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import axios from "axios";

const EditSubItemForm = ({ open, handleClose, item, onUpdate }) => {
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

  useEffect(() => {
    if (item) {
      setMaster(item.master);
      setName(item.name);
      setCode(item.code);
      setRentRate(item.rentRate);
      setDescription(item.description);
      setImage(item.image); // assuming the sub-item has an image property
    }
  }, [item]);

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (event) => {
    if (event) event.preventDefault();
    try {
      const updatedItemData = {
        _id: item._id,
        name,
        code,
        rentRate,
        description,
        image,
        master: item.master, // Preserve the master reference
        status: item.status, // Preserve the status
      };

      const response = await axios.put(`/api/sub-items/${item._id}`, updatedItemData);

      // Create complete updated item including _id and all data
      // Pass the complete updated item back
      onUpdate(updatedItemData);
      
      setSnackbar({
        open: true,
        message: "Sub item updated successfully!",
        severity: "success",
      });

      handleClose(); // Close the dialog after submission
    } catch (error) {
      console.error("Error updating sub item:", error);
      setSnackbar({
        open: true,
        message: "Failed to update sub item.",
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

  console.log(item,"item");
  
  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Sub Item</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Master Item"
            value={item?.master.name}
            fullWidth
            disabled
          />
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
            Update Sub Item
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

export default EditSubItemForm;
