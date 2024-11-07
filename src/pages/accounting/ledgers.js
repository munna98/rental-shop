import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { useConfirmation } from "@/hooks/useConfirmation";
import { useSnackbar } from "@/hooks/useSnackbar";
import AddLedgerForm from "@/components/ledgers/AddLedgerForm";
import EditLedgerForm from "@/components/ledgers/EditLedgerForm";
import StyledButton from "@/components/buttons/StyledButton";
import { ACTIONS, useLedger } from "@/context/LedgerContext";
import LedgerList from "@/components/ledgers/LedgerList";

const Ledgers    = () => {
  const { ledgers, dispatch } = useLedger();
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLedger, setSelectedLedger] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const { showSnackbar, SnackbarComponent } = useSnackbar();
  const { showConfirmation, ConfirmationDialog } = useConfirmation();

  useEffect(() => {
    const fetchLedgers = async () => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        const response = await axios.get("/api/ledgers");
        dispatch({ type: ACTIONS.SET_LEDGERS, payload: response.data });
      } catch (error) {
        console.error("Error fetching ledgers:", error);
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
        showSnackbar("Failed to fetch ledgers.", "error");
      }
    };
    fetchLedgers();
  }, [dispatch]);

  const handleAddLedger = async (newLedger) => {
    try {
      const response = await axios.post("/api/ledgers", newLedger);
      dispatch({ type: ACTIONS.ADD_LEDGER, payload: response.data });
      showSnackbar("Ledger added successfully!", "success");
      setOpen(false);
    } catch (error) {
      console.error("Error adding ledger:", error);
      showSnackbar("Failed to add ledger.", "error");
    }
  };

  const handleEditLedger = async (updatedLedger) => {
    try {
      const response = await axios.put(
        `/api/ledgers/${updatedLedger._id}`,
        updatedLedger
      );
      dispatch({ type: ACTIONS.UPDATE_LEDGER, payload: response.data });
      showSnackbar("Ledger updated successfully!", "success");
      setOpenEdit(false);
    } catch (error) {
      console.error("Error updating ledger:", error);
      showSnackbar("Failed to update ledger.", "error");
    }
  };

  const handleDeleteLedger = async (ledgerId) => {
    const isConfirmed = await showConfirmation({
      title: "Delete Confirmation",
      message: "Are you sure you want to delete this ledger entry?",
    });

    if (isConfirmed) {
      try {
        await axios.delete(`/api/ledgers/${ledgerId}`);
        dispatch({ type: ACTIONS.DELETE_LEDGER, payload: ledgerId });
        showSnackbar("Ledger deleted successfully!", "success");
      } catch (error) {
        console.error("Error deleting ledger:", error);
        showSnackbar("Failed to delete ledger.", "error");
      }
    }
  };

  const handleSearchChange = (event) => setSearchQuery(event.target.value);
  const handleTabChange = (event, newValue) => setCurrentTab(newValue);

  const filteredLedgers = ledgers.filter((ledger) => {
    const matchesSearch = ledger.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ledger.party?.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    switch (currentTab) {
      case 0: // All
        return matchesSearch;
      case 1: // Income
        return matchesSearch && ledger.type === "income";
      case 2: // Expense
        return matchesSearch && ledger.type === "expense";
      case 3: // Party
        return matchesSearch && ledger.type === "party";
      default:
        return matchesSearch;
    }
  });

  return (
    <Box sx={{ padding: 4, maxWidth: 1200, margin: "0 auto" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Ledgers
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            variant="outlined"
            placeholder="Search ledgers..."
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
          <StyledButton variant="icon" onClick={() => setOpen(true)}>
            <AddIcon />
          </StyledButton>
        </Box>
      </Box>

      <Paper sx={{ marginBottom: 4 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="All Transactions" />
          <Tab label="Income" />
          <Tab label="Expenses" />
          <Tab label="Party Transactions" />
        </Tabs>
      </Paper>

      <LedgerList
        ledgers={filteredLedgers}
        onEditLedger={(ledger) => {
          setSelectedLedger(ledger);
          setOpenEdit(true);
        }}
        onDeleteLedger={handleDeleteLedger}
      />

      <AddLedgerForm
        open={open}
        handleClose={() => setOpen(false)}
        onAddLedger={handleAddLedger}
      />

      <EditLedgerForm
        open={openEdit}
        handleClose={() => setOpenEdit(false)}
        onEditLedger={handleEditLedger}
        ledger={selectedLedger}
      />

      <SnackbarComponent />
      <ConfirmationDialog />
    </Box>
  );
};

export default Ledgers  ;