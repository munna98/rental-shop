import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import AddCustomerForm from "@/components/forms/AddCustomerForm";
import EditCustomerForm from "@/components/forms/EditCustomerForm";
import CustomerList from "@/components/customers/CustomerList";
import { useConfirmation } from "@/hooks/useConfirmation";
import { useSnackbar } from "@/hooks/useSnackbar";

const CustomerPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true); // New loading state
  const { showSnackbar, SnackbarComponent } = useSnackbar();
  const { showConfirmation, ConfirmationDialog } = useConfirmation();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true); // Set loading to true when fetching starts
        const response = await axios.get("/api/customers");
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
        showSnackbar("Failed to fetch customers.", "error");
      } finally {
        setLoading(false); // Set loading to false once fetching is done
      }
    };
    fetchCustomers();
  }, []);

  const handleAddCustomerOpen = () => setOpen(true);
  const handleAddCustomerClose = () => setOpen(false);

  const handleAddCustomer = async (newCustomer) => {
    try {
      const response = await axios.post("/api/customers", newCustomer);
      setCustomers((prev) => [...prev, response.data]);
      showSnackbar("Customer added successfully!", "success");
      handleAddCustomerClose();
    } catch (error) {
      console.error("Error adding customer:", error);
      showSnackbar("Failed to add customer.", "error");
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
      showSnackbar("Customer updated successfully!", "success");
      handleEditCustomerClose();
    } catch (error) {
      console.error("Error updating customer:", error);
      showSnackbar("Failed to update customer.", "error");
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
        showSnackbar("Customer deleted successfully!", "success");
      } catch (error) {
        console.error("Error deleting customer:", error);
        showSnackbar("Failed to delete customer.", "error");
      }
    }
  };

  const handleSearchChange = (event) => setSearchQuery(event.target.value);

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      sx={{
        padding: { xs: 2, sm: 3, md: 4 },
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
          marginBottom: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: "1.5rem", sm: "2rem" },
            marginBottom: { xs: 2, sm: 0 },
          }}
        >
          Customers
        </Typography>

        {/* Search Box */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            width: { xs: "100%", sm: "auto" },
          }}
        >
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
            sx={{
              width: "100%",
              maxWidth: { xs: "100%", sm: 300 },
            }}
          />
        </Box>
      </Box>

      {/* Add Customer Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "stretch", sm: "flex-end" },
          marginBottom: 2,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddCustomerOpen}
          sx={{
            width: { xs: "100%", sm: "auto" },
          }}
        >
          Add Customer
        </Button>
      </Box>

      {/* Content Section */}
      <Box
        sx={{
          overflowX: "auto",
          "& .MuiTableContainer-root": {
            maxWidth: "100%",
          },
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <CustomerList
            customers={filteredCustomers}
            onEditCustomer={handleEditCustomerOpen}
            onDeleteCustomer={handleDeleteCustomer}
            isMobile={isMobile}
          />
        )}
      </Box>

      {/* Modals */}
      <AddCustomerForm
        open={open}
        handleClose={handleAddCustomerClose}
        onAddCustomer={handleAddCustomer}
        existingCustomers={customers}
        fullScreen={isMobile}
      />

      <EditCustomerForm
        open={openEdit}
        handleClose={handleEditCustomerClose}
        onEditCustomer={handleEditCustomer}
        customer={selectedCustomer}
        fullScreen={isMobile}
      />

      {/* Snackbar and Confirmation Dialog */}
      <SnackbarComponent />
      <ConfirmationDialog />
    </Box>
  );
};

export default CustomerPage;
