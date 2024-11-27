import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StyledButton from "@/components/buttons/StyledButton";
import AddAccountForm from "@/components/forms/AddAccountForm"; // Import form component for adding accounts
import { useAccounts } from "@/context/AccountsContext";
import { useSnackbar } from "@/hooks/useSnackbar";
import axios from "axios";

// Custom hook for search functionality
const useSearch = (accounts = []) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAccounts = Array.isArray(accounts)
    ? accounts.filter(account =>
        account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        account.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return { searchQuery, setSearchQuery, filteredAccounts };
};

const Accounts = () => {
  const { accounts = [], fetchAccounts } = useAccounts(); // Default to an empty array if undefined
  const { showSnackbar, SnackbarComponent } = useSnackbar();
  const { searchQuery, setSearchQuery, filteredAccounts } = useSearch(accounts);

  const [open, setOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    fetchAccounts(); // Fetch accounts when component mounts
  }, [fetchAccounts]);

  const handleAddAccountOpen = () => {
    setSelectedAccount(null); // Clear selection for adding new account
    setOpen(true);
  };

  const handleEditAccountOpen = (account) => {
    setSelectedAccount(account); // Set selected account for editing
    setOpen(true);
  };

  const handleAddAccountClose = () => setOpen(false);

  const handleSearchChange = (event) => setSearchQuery(event.target.value);

  const handleDeleteAccount = async (accountId) => {
    try {
      await axios.delete(`/api/accounts/${accountId}`);
      await fetchAccounts();
      showSnackbar("Account deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting account:", error);
      showSnackbar("Failed to delete account.", "error");
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <Typography variant="h5" gutterBottom>Accounts</Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            variant="outlined"
            placeholder="Search accounts..."
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

          <StyledButton variant="icon" onClick={handleAddAccountOpen}>
            <AddIcon />
          </StyledButton>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Account Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAccounts.map((account) => (
              <TableRow key={account._id}>
                <TableCell>{account.name}</TableCell>
                <TableCell>{account.type}</TableCell>
                <TableCell>₹{account.balance}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditAccountOpen(account)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteAccount(account._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog to add or edit accounts */}
      <AddAccountForm
        open={open}
        handleClose={handleAddAccountClose}
        selectedAccount={selectedAccount}
      />

      <SnackbarComponent />
    </Box>
  );
};

export default Accounts;
