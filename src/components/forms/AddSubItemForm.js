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
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import axios from 'axios'; // Import axios for API calls

const AddSubItemForm = ({ open, handleClose, masterItems }) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [rentRate, setRentRate] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [selectedMaster, setSelectedMaster] = useState("");

  const handleSubmit = async () => {
    try {
      await axios.post('/api/sub-items', { // Adjust the API endpoint as needed
        master: selectedMaster,
        name,
        code,
        rentRate,
        description,
        image,
      });
      handleClose(); // Close the dialog after submission
      // Optionally, you can reset the fields here or show a success message
      setName("");
      setCode("");
      setRentRate("");
      setDescription("");
      setImage("");
      setSelectedMaster("");
    } catch (error) {
      console.error("Error adding sub item:", error);
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
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Sub Item</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel id="master-item-label">Master Item</InputLabel>
          <Select
            labelId="master-item-label"
            value={selectedMaster}
            onChange={(e) => setSelectedMaster(e.target.value)}
          >
            {masterItems.map((item) => (
              <MenuItem key={item._id} value={item.name}>
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
        />
        
        {/* Custom File Input */}
        <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', marginTop: 16 }}>
          <IconButton component="span" size="small" sx={{ marginRight: 1 }}>
            <AttachFileIcon />
          </IconButton>
          <Typography>Select Image</Typography>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }} // Hide the default input
          />
        </label>

        {image && <img src={image} alt="Selected" style={{ marginTop: 16, width: '100%', height: 'auto' }} />}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSubItemForm;
