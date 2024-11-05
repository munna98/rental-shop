import React, { useState } from "react";
import { 
  Modal, 
  Box, 
  TextField, 
  Button, 
  Typography 
} from "@mui/material";

const AddMasterItemForm = ({ open, handleClose, onAddNewMasterItem }) => {
  const [itemName, setItemName] = useState("");
  const [itemCode, setItemCode] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    onAddNewMasterItem({
      name: itemName,
      code: itemCode,
    });

    // Clear form
    setItemName("");
    setItemCode("");
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="add-master-item-modal"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Add New Master Item
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Item Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Item Code"
            value={itemCode}
            onChange={(e) => setItemCode(e.target.value)}
            margin="normal"
            required
          />
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Add Item
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default AddMasterItemForm;