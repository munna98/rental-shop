import React, { useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Snackbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import AddMasterItemForm from "@/components/forms/AddMasterItemForm";
import StyledButton from "@/components/buttons/StyledButton";
import MasterItems from "@/components/items/MasterItems";
import AddSubItemForm from "@/components/forms/AddSubItemForm";
import SubItems from "@/components/items/SubItems";
import { useItems } from "@/context/ItemsContext"; // Import the context hook

const ItemsPage = () => {
  // Get values from context
  const { 
    itemType, 
    setItemType, 
    masterItems, 
    subItems, 
    fetchMasterItems, 
    fetchSubItems 
  } = useItems();

  // Local state
  const [open, setOpen] = useState(false);
  const [openSubItem, setOpenSubItem] = useState(false);
  const [selectedMaster, setSelectedMaster] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Added for search functionality

  const handleItemTypeChange = (event) => {
    setItemType(event.target.value);
  };

  const handleAddMasterItemOpen = () => {
    setOpen(true);
  };

  const handleAddMasterItemClose = () => {
    setOpen(false);
  };

  const handleAddSubItemClose = () => {
    setOpenSubItem(false);
  };

  const handleAddMasterItem = async (newItem) => {
    try {
      await axios.post('/api/master-items', newItem);
      fetchMasterItems(); // Refresh master items
      setSnackbarMessage("Master item added successfully!");
      setSnackbarOpen(true);
      handleAddMasterItemClose();
    } catch (error) {
      console.error("Error adding master item:", error);
      setSnackbarMessage("Failed to add master item");
      setSnackbarOpen(true);
    }
  };

  const handleAddSubItem = async (newSubItem) => {
    try {
      await axios.post('/api/sub-items', newSubItem);
      fetchSubItems(); // Refresh sub items
      setSnackbarMessage("Sub item added successfully!");
      setSnackbarOpen(true);
      handleAddSubItemClose();
    } catch (error) {
      console.error("Error adding sub item:", error);
      setSnackbarMessage("Failed to add sub item");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter items based on search query
  const filteredMasterItems = masterItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSubItems = subItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ padding: 4, maxWidth: 1200, margin: "0 auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <Typography variant="h4" gutterBottom>Items</Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <FormControl variant="outlined" sx={{ minWidth: 150 }}>
            <InputLabel id="item-type-label">Item Type</InputLabel>
            <Select
              labelId="item-type-label"
              value={itemType}
              onChange={handleItemTypeChange}
              label="Item Type"
            >
              <MenuItem value="Sub Items">Sub Items</MenuItem>
              <MenuItem value="Master Items">Master Items</MenuItem>
            </Select>
          </FormControl>

          <TextField
            variant="outlined"
            placeholder="Search items..."
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

          <StyledButton variant="icon" onClick={handleAddMasterItemOpen}>
            <AddIcon />
          </StyledButton>
        </Box>
      </Box>

      {itemType === "Master Items" ? (
        <MasterItems 
          selectedMaster={selectedMaster}
          setSelectedMaster={setSelectedMaster}
        />
      ) : (
        <SubItems />
      )}

      <AddMasterItemForm 
        open={open} 
        handleClose={handleAddMasterItemClose} 
        onAddNewMasterItem={handleAddMasterItem} 
      />

      <AddSubItemForm
        open={openSubItem}
        handleClose={handleAddSubItemClose}
        masterItems={masterItems}
        selectedMaster={selectedMaster}
        onAdd={handleAddSubItem}
      />

      <Snackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        autoHideDuration={3000}
      />
    </Box>
  );
};

export default ItemsPage;