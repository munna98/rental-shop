import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';

const AddCustomerForm = ({ open, handleClose, onAddCustomer, existingCustomers }) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [isWhatsappEdited, setIsWhatsappEdited] = useState(false);

  // Generate the next customer code based on existing customers
  const generateCustomerCode = () => {
    // Extract numeric parts from existing customer codes
    const existingCodes = existingCustomers.map((customer) => 
      parseInt(customer.code.replace("CUST", ""), 10)
    );
    
    // Find the highest code number and increment it for the next code
    const nextCodeNumber = existingCodes.length > 0
      ? Math.max(...existingCodes) + 1
      : 1;
    
    return `CUST${String(nextCodeNumber).padStart(4, '0')}`;
  };

  useEffect(() => {
    if (open) {
      const newCode = generateCustomerCode();
      setCode(newCode);
      setName("");
      setAddress("");
      setMobile("");
      setWhatsapp("");
      setIsWhatsappEdited(false);
    }
  }, [open, existingCustomers]);

  const handleMobileChange = (e) => {
    const value = e.target.value;
    setMobile(value);

    if (!isWhatsappEdited) {
      setWhatsapp(value);
    }
  };

  const handleWhatsappChange = (e) => {
    setWhatsapp(e.target.value);
    setIsWhatsappEdited(true);
  };

  const clearWhatsapp = () => {
    setWhatsapp("");
    setIsWhatsappEdited(false);
  };

  const handleSubmit = () => {
    onAddCustomer({
      name,
      code,
      address,
      mobile,
      whatsapp,
    });
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Customer</DialogTitle>
      <DialogContent>
        <TextField
          margin="normal"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
        <TextField
          margin="normal"
          label="Customer Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          fullWidth
        />
        <TextField
          margin="normal"
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          fullWidth
        />
        <TextField
          margin="normal"
          label="Mobile Number"
          value={mobile}
          onChange={handleMobileChange}
          fullWidth
        />
        <TextField
          margin="normal"
          label="WhatsApp Number"
          value={whatsapp}
          onChange={handleWhatsappChange}
          fullWidth
          InputProps={{
            endAdornment: (
              <IconButton onClick={clearWhatsapp} edge="end">
                <ClearIcon />
              </IconButton>
            ),
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCustomerForm;
