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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import AddMasterItemForm from "@/components/forms/AddMasterItemForm";
import StyledButton from "@/components/buttons/StyledButton";
import MasterItems from "@/components/items/MasterItems";
import AddSubItemForm from "@/components/forms/AddSubItemForm";
import SubItems from "@/components/items/SubItems";
import { useItems } from "@/context/ItemsContext";
import { useSnackbar } from "@/hooks/useSnackbar"; // New custom hook
import axios from "axios";

// Custom hook for search functionality
const useSearch = (masterItems, subItems) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = {
    master: masterItems.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    sub: subItems.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase())
    )
  };

  return { searchQuery, setSearchQuery, filteredItems };
};

const ItemsPage = () => {
  const { 
    itemType, 
    setItemType, 
    masterItems, 
    subItems, 
    fetchMasterItems, 
    fetchSubItems 
  } = useItems();

  const { showSnackbar, SnackbarComponent } = useSnackbar();
  const { searchQuery, setSearchQuery, filteredItems } = useSearch(masterItems, subItems);
  
  const [open, setOpen] = useState(false);
  const [openSubItem, setOpenSubItem] = useState(false);
  const [selectedMaster, setSelectedMaster] = useState("");

  const handleItemTypeChange = (event) => setItemType(event.target.value);
  const handleAddMasterItemOpen = () => setOpen(true);
  const handleAddMasterItemClose = () => setOpen(false);
  const handleAddSubItemClose = () => setOpenSubItem(false);
  const handleSearchChange = (event) => setSearchQuery(event.target.value);

  const handleAddMasterItem = async (newItem) => {
    try {
      await axios.post('/api/master-items', newItem);
      await fetchMasterItems();
      showSnackbar("Master item added successfully!", "success");
      handleAddMasterItemClose();
    } catch (error) {
      console.error("Error adding master item:", error);
      showSnackbar("Failed to add master item.", "error");
    }
  };

  const handleAddSubItem = async (newSubItem) => {
    try {
      await axios.post('/api/sub-items', newSubItem);
      await fetchSubItems();
      showSnackbar("Sub item added successfully!", "success");
      handleAddSubItemClose();
    } catch (error) {
      console.error("Error adding sub item:", error);
      showSnackbar("Failed to add sub item.", "error");
    }
  };

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
                  <SearchIcon className="h-5 w-5" />
                </InputAdornment>
              ),
            }}
            sx={{ marginBottom: 2, width: "100%", maxWidth: 300 }}
          />

          <StyledButton variant="icon" onClick={handleAddMasterItemOpen}>
            <AddIcon className="h-5 w-5" />
          </StyledButton>
        </Box>
      </Box>

      {itemType === "Master Items" ? (
        <MasterItems 
          items={filteredItems.master}
          selectedMaster={selectedMaster}
          setSelectedMaster={setSelectedMaster}
        />
      ) : (
        <SubItems items={filteredItems.sub} />
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

      <SnackbarComponent />
    </Box>
  );
};

export default ItemsPage;