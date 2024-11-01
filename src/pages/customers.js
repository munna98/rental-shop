import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import AddCustomerForm from "@/components/forms/AddCustomerForm";
import EditCustomerForm from "@/components/forms/EditCustomerForm";
import StyledButton from "@/components/buttons/StyledButton";
import CustomerList from "@/components/customers/CustomerList";


const CustomerPage = () => {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch customers on component mount
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("/api/customers");
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  const handleAddCustomerOpen = () => setOpen(true);
  const handleAddCustomerClose = () => setOpen(false);

  // Handle adding new customer
  const handleAddCustomer = async (newCustomer) => {
    try {
      const response = await axios.post("/api/customers", {
        name: newCustomer.name,
        code: newCustomer.code, // Add any other fields required by your schema
        address: newCustomer.address,
        mobile: newCustomer.mobile,
        whatsapp: newCustomer.whatsapp,
      });
      setCustomers((prev) => [...prev, response.data]);
      setSnackbar({
        open: true,
        message: "Customer added successfully!",
        severity: "success",
      });
      handleAddCustomerClose(); // Close modal on success
    } catch (error) {
      console.error("Error adding customer:", error);
      setSnackbar({
        open: true,
        message: "Failed to add customer.",
        severity: "error",
      });
    }
  };

  const handleEditCustomer = async (updatedCustomer) => {
    try {
      // Use _id instead of id
      const response = await axios.put(
        `/api/customers/${updatedCustomer._id}`, // Change from .id to ._id
        updatedCustomer
      );
      setCustomers((prev) =>
        prev.map((customer) =>
          customer._id === updatedCustomer._id ? response.data : customer
        )
      );
      setSnackbar({
        open: true,
        message: "Customer updated successfully!",
        severity: "success",
      });
      handleEditCustomerClose();
    } catch (error) {
      console.error("Error updating customer:", error);
      setSnackbar({
        open: true,
        message: "Failed to update customer.",
        severity: "error",
      });
    }
  };

  const handleEditCustomerOpen = (customer) => {
    setSelectedCustomer(customer);
    setOpenEdit(true);
  };
  const handleEditCustomerClose = () => setOpenEdit(false);

  const handleDeleteCustomer = async (customerId) => {
    try {
      await axios.delete(`/api/customers/${customerId}`);
      setCustomers((prev) =>
        prev.filter((customer) => customer._id !== customerId)
      ); // Adjusted for MongoDB `_id`
      setSnackbar({
        open: true,
        message: "Customer deleted successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting customer:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete customer.",
        severity: "error",
      });
    }
  };

  const handleSearchChange = (event) => setSearchQuery(event.target.value);

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  // Filter customers based on search query
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ padding: 4, maxWidth: 1200, margin: "0 auto" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Customers
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            variant="outlined"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: "100%", maxWidth: 300 }}
          />
          <StyledButton variant="icon" onClick={handleAddCustomerOpen}>
            <AddIcon />
          </StyledButton>
        </Box>
      </Box>

      {/* Render filtered customers */}
      <CustomerList
        customers={filteredCustomers}
        onEditCustomer={handleEditCustomerOpen}
        onDeleteCustomer={handleDeleteCustomer}
      />

      {/* Add Customer Modal */}
      <AddCustomerForm
        open={open}
        handleClose={handleAddCustomerClose}
        onAddCustomer={handleAddCustomer}
      />
      <EditCustomerForm
        open={openEdit}
        handleClose={handleEditCustomerClose}
        onEditCustomer={handleEditCustomer}
        customer={selectedCustomer}
      />

      {/* Snackbar for success/error messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CustomerPage;
