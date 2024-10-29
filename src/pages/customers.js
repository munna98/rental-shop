// CustomerPage.js
import React, { useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import AddCustomerForm from "@/components/forms/AddCustomerForm";
import StyledButton from "@/components/buttons/StyledButton";
import CustomerList from "@/components/CustomerList";

const CustomerPage = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddCustomerOpen = () => {
    setOpen(true);
  };

  const handleAddCustomerClose = () => {
    setOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 1200, margin: "0 auto" }}>
      {/* Page Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <Typography variant="h4" gutterBottom>
          Customers
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          {/* Search Bar */}
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
            sx={{ marginBottom: 2, width: "100%", maxWidth: 300 }}
          />

          {/* Add Customer Button using StyledButton */}
          <StyledButton variant="icon" onClick={handleAddCustomerOpen}>
            <AddIcon />
          </StyledButton>
        </Box>
      </Box>

      {/* Customer List Display */}
      <CustomerList searchQuery={searchQuery} />

      {/* Add Customer Modal */}
      <AddCustomerForm open={open} handleClose={handleAddCustomerClose} />
    </Box>
  );
};

export default CustomerPage;
