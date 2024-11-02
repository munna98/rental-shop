import React, { useState, useEffect } from "react";
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
import { useItems } from "@/context/ItemsContext";

const AddSubItemForm = ({ open, handleClose, selectedMaster }) => {
  const { masterItems, subItems, fetchSubItems } = useItems();

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    rentRate: "",
    description: "",
    image: "",
    status:"",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Generate the next available code for the sub item
  const generateNextCode = async () => {
    if (!selectedMaster) return;

    // Find the selected master item
    const masterItem = masterItems.find(item => item._id === selectedMaster);
    if (!masterItem) return;

    const masterCode = masterItem.code;
    

    // Filter sub items that belong to this master item
    const relatedSubItems = subItems.filter(item => 
      item.master._id === selectedMaster
    );
    

    // If no sub items exist, start with 001
    if (relatedSubItems.length === 0) {
      const newCode = `${masterCode}-001`;
      setFormData(prev => ({ ...prev, code: newCode }));
      return;
    }

    // Find the highest existing number
    const existingNumbers = relatedSubItems.map(item => {
      const parts = item.code.split('-');
      return parseInt(parts[parts.length - 1], 10);
    });

    const highestNumber = Math.max(...existingNumbers);
    const nextNumber = (highestNumber + 1).toString().padStart(3, '0');
    const newCode = `${masterCode}-${nextNumber}`;

    setFormData(prev => ({ ...prev, code: newCode }));
  };

  // Generate code when selected master changes or when sub items are updated
  useEffect(() => {
    generateNextCode();
  }, [selectedMaster, subItems]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      rentRate: "",
      description: "",
      image: "",
      status: "",
    });
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.name || !formData.code || !formData.rentRate ) {
        setSnackbar({
          open: true,
          message: "Please fill in all required fields",
          severity: "error",
        });
        return;
      }

      const payload = {
        master: selectedMaster,
        name: formData.name,
        code: formData.code,
        rentRate: parseFloat(formData.rentRate),
        description: formData.description,
        image: formData.image,
        status: "Available",
      };

      await axios.post("/api/sub-items", payload);
      
      await fetchSubItems(); // Refresh sub items list
      handleClose();
      resetForm();

      setSnackbar({
        open: true,
        message: "Sub item added successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error adding sub item:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to add sub item",
        severity: "error",
      });
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add Sub Item</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="master-item-label">Master Item</InputLabel>
            <Select
              labelId="master-item-label"
              value={selectedMaster}
              disabled
            >
              {masterItems
                .filter((item) => item._id === selectedMaster)
                .map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    {item.name} ({item.code})
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <TextField
            margin="normal"
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            margin="normal"
            label="Code"
            value={formData.code}
            disabled
            fullWidth
          />

          <TextField
            margin="normal"
            label="Rent Rate"
            name="rentRate"
            value={formData.rentRate}
            onChange={handleChange}
            fullWidth
            required
            type="number"
            InputProps={{
              startAdornment: <Typography>₹</Typography>,
            }}
          />

          <TextField
            margin="normal"
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            // multiline
            rows={3}
          />

          <input
            accept="image/*"
            style={{ display: "none" }}
            id="image-upload"
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="image-upload">
            <IconButton component="span" color="primary">
              <AttachFileIcon />
            </IconButton>
            <Typography variant="body2" component="span">
              Upload Image
            </Typography>
          </label>
          {formData.image && (
            <img
              src={formData.image}
              alt="Preview"
              style={{ width: "100%", maxHeight: 200, objectFit: "contain", marginTop: 10 }}
            />
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Add Sub Item
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddSubItemForm;