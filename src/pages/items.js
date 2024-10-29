// src/pages/ItemsPage.js
import React, { useState, useEffect } from "react";
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
import axios from 'axios';
import MasterItems from "@/components/items/MasterItems";
import SubItems from "@/components/items/SubItem";

const ItemsPage = () => {
  const [itemType, setItemType] = useState("Sub Items");
  const [open, setOpen] = useState(false);
  const [masterItems, setMasterItems] = useState([]);
  const [subItems, setSubItems] = useState([]);

  const handleItemTypeChange = (event) => {
    setItemType(event.target.value);
  };

  const handleAddMasterItemOpen = () => {
    setOpen(true);
  };

  const handleAddMasterItemClose = () => {
    setOpen(false);
  };

  const fetchMasterItems = async () => {
    try {
      const response = await axios.get('/api/master-items');
      setMasterItems(response.data);
    } catch (error) {
      console.error("Error fetching master items:", error);
    }
  };

  const fetchSubItems = async () => {
    try {
      const response = await axios.get('/api/sub-items');
      setSubItems(response.data);
    } catch (error) {
      console.error("Error fetching sub items:", error);
    }
  };

  const handleDeleteMasterItem = (id) => {
    setMasterItems((prevItems) => prevItems.filter((item) => item._id !== id));
  };

  useEffect(() => {
    if (itemType === "Sub Items") {
      fetchSubItems();
    } else if (itemType === "Master Items") {
      fetchMasterItems();
    }
  }, [itemType]);

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
        <MasterItems items={masterItems} onDelete={handleDeleteMasterItem} />
      ) : (
        <SubItems items={subItems} />
      )}

      <AddMasterItemForm open={open} handleClose={handleAddMasterItemClose} />
    </Box>
  );
};

export default ItemsPage;
