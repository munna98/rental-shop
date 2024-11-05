// Adjusted AddSubItemForm component
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
  Typography
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import axios from "axios";
import { useItems } from "@/context/ItemsContext";

const initialFormState = {
  name: "",
  code: "",
  rentRate: "",
  description: "",
  image: "",
  status: ""
};

const AddSubItemForm = ({ open, handleClose, selectedMaster, onAdd }) => {
  const { masterItems } = useItems();
  const [formData, setFormData] = useState(initialFormState);
  const selectedMasterItem = masterItems.find(item => item._id === selectedMaster);

  useEffect(() => {
    if (selectedMasterItem) {
      setFormData(prev => ({ ...prev, name: selectedMasterItem.name }));
    }
  }, [selectedMasterItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
  };

  const handleSubmit = async () => {
    try {
      const { name, code, rentRate } = formData;
      if (!name || !code || !rentRate) {
        alert("Please fill in all required fields"); // Use alert for simplicity
        return;
      }

      const payload = {
        master: selectedMaster,
        ...formData,
        rentRate: parseFloat(formData.rentRate),
        status: "Available"
      };

      await axios.post("/api/sub-items", payload);
      await onAdd(); // Call the onAdd function to fetch sub-items and show snackbar
      resetForm();
      handleClose();
    } catch (error) {
      alert("Failed to add sub item"); // Use alert for simplicity
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Sub Item</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel>Master Item</InputLabel>
          <Select value={selectedMaster} disabled>
            {selectedMasterItem && (
              <MenuItem value={selectedMasterItem._id}>
                {selectedMasterItem.name} ({selectedMasterItem.code})
              </MenuItem>
            )}
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
          name="code"
          value={formData.code}
          onChange={handleChange}
          fullWidth
          required
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
        />

        <TextField
          margin="normal"
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
        />

        <input
          accept="image/*"
          id="image-upload"
          type="file"
          onChange={handleImageChange}
          style={{ display: "none" }}
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
  );
};

export default AddSubItemForm;
