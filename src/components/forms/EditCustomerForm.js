// src/components/forms/EditCustomerForm.js
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

const EditCustomerForm = ({ open, customer, handleClose, onEditCustomer }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [code, setCode] = useState("");

  // Load customer data when form opens
  useEffect(() => {
    if (customer) {
      setName(customer.name || "");
      setAddress(customer.address || "");
      setMobile(customer.mobile || "");
      setWhatsapp(customer.whatsapp || "");
      setCode(customer.code || "");
    }
  }, [customer]);

  
  const handleSubmit = () => {
    onEditCustomer({
      _id: customer._id,
      name,
      code,
      address,
      mobile,
      whatsapp,
    });
    handleClose();
  };
  console.log(customer,"custemer from edit form");
  

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Customer</DialogTitle>
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
          label="Code"
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
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCustomerForm;
