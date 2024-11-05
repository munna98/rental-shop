import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import AddCustomerForm from "@/components/forms/AddCustomerForm";
import EditCustomerForm from "@/components/forms/EditCustomerForm";
import StyledButton from "@/components/buttons/StyledButton";
import CustomerList from "@/components/customers/CustomerList";
import { useConfirmation } from "@/hooks/useConfirmation"; // Import the useConfirmation hook
import { useSnackbar } from "@/hooks/useSnackbar"; // Import the useSnackbar hook

const CustomerPage = () => {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const { showSnackbar, SnackbarComponent } = useSnackbar(); // Use the snackbar hook
  const { showConfirmation, ConfirmationDialog } = useConfirmation(); // Use the confirmation hook

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
        code: newCustomer.code,
        address: newCustomer.address,
        mobile: newCustomer.mobile,
        whatsapp: newCustomer.whatsapp,
      });
      setCustomers((prev) => [...prev, response.data]);
      showSnackbar("Customer added successfully!", "success"); // Use the snackbar hook
      handleAddCustomerClose(); // Close modal on success
    } catch (error) {
      console.error("Error adding customer:", error);
      showSnackbar("Failed to add customer.", "error"); // Use the snackbar hook
    }
  };

  const handleEditCustomer = async (updatedCustomer) => {
    try {
      const response = await axios.put(
        `/api/customers/${updatedCustomer._id}`,
        updatedCustomer
      );
      setCustomers((prev) =>
        prev.map((customer) =>
          customer._id === updatedCustomer._id ? response.data : customer
        )
      );
      showSnackbar("Customer updated successfully!", "success"); // Use the snackbar hook
      handleEditCustomerClose();
    } catch (error) {
      console.error("Error updating customer:", error);
      showSnackbar("Failed to update customer.", "error"); // Use the snackbar hook
    }
  };

  const handleEditCustomerOpen = (customer) => {
    setSelectedCustomer(customer);
    setOpenEdit(true);
  };
  const handleEditCustomerClose = () => setOpenEdit(false);

  const handleDeleteCustomer = async (customerId) => {
    const isConfirmed = await showConfirmation({
      title: "Delete Confirmation",
      message: "Are you sure you want to delete this customer?",
    });

    if (isConfirmed) {
      try {
        await axios.delete(`/api/customers/${customerId}`);
        setCustomers((prev) =>
          prev.filter((customer) => customer._id !== customerId)
        );
        showSnackbar("Customer deleted successfully!", "success"); // Use the snackbar hook
      } catch (error) {
        console.error("Error deleting customer:", error);
        showSnackbar("Failed to delete customer.", "error"); // Use the snackbar hook
      }
    }
  };

  const handleSearchChange = (event) => setSearchQuery(event.target.value);

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
        existingCustomers={customers} 
      />
      <EditCustomerForm
        open={openEdit}
        handleClose={handleEditCustomerClose}
        onEditCustomer={handleEditCustomer}
        customer={selectedCustomer}
      />

      {/* Snackbar for success/error messages */}
      <SnackbarComponent /> {/* Use the snackbar component */}

      {/* Confirmation Dialog */}
      <ConfirmationDialog />
    </Box>
  );
};

export default CustomerPage;
