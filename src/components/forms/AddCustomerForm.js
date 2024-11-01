import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

const AddCustomerForm = ({ open, handleClose, onAddCustomer }) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const handleSubmit = () => {
    onAddCustomer({
      name,
      code,
      address,
      mobile,
      whatsapp,
    });
    // Clear form and close modal
    setName("");
    setCode("");
    setAddress("");
    setMobile("");
    setWhatsapp("");
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
          onChange={(e) => setMobile(e.target.value)}
          fullWidth
        />
        <TextField
          margin="normal"
          label="WhatsApp Number"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          fullWidth
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
