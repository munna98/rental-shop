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
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import AddMasterItemForm from "@/components/forms/AddMasterItemForm";
import MasterItems from "@/components/items/MasterItems";
import AddSubItemForm from "@/components/forms/AddSubItemForm";
import SubItems from "@/components/items/SubItems";
import { useItems } from "@/context/ItemsContext";
import { useSnackbar } from "@/hooks/useSnackbar";
import axios from "axios";
import { useSearchIitems } from "@/hooks/useSearchItems";

const ItemsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { 
    itemType, 
    setItemType, 
    masterItems, 
    subItems, 
    fetchMasterItems, 
    fetchSubItems 
  } = useItems();

  const { showSnackbar, SnackbarComponent } = useSnackbar();
  const { searchQuery, setSearchQuery, filteredItems } = useSearchIitems(
    masterItems,
    subItems,
    itemType
  );
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
    <Box sx={{ 
      padding: { xs: 2, sm: 3, md: 4 },
      maxWidth: 1200, 
      margin: "0 auto"
    }}>
      {/* Header Section */}
      <Box sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "stretch", sm: "center" },
        gap: 2,
        marginBottom: 3
      }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontSize: { xs: '1.5rem', sm: '2rem' },
            marginBottom: { xs: 2, sm: 0 }
          }}
        >
          Items
        </Typography>

        {/* Controls Container */}
        <Box sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          width: { xs: "100%", sm: "auto" }
        }}>
          <FormControl 
            variant="outlined" 
            sx={{ 
              minWidth: { xs: "100%", sm: 150 }
            }}
          >
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
            placeholder={`Search ${itemType.toLowerCase()}...`}
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
              maxWidth: { xs: "100%", sm: 300 }
            }}
          />
        </Box>
      </Box>

      {/* Add Master Item Button */}
      {itemType === "Master Items" && (
        <Box sx={{ 
          display: "flex", 
          justifyContent: { xs: "stretch", sm: "flex-end" },
          marginBottom: 2
        }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddMasterItemOpen}
            sx={{ 
              width: { xs: "100%", sm: "auto" }
            }}
          >
            Add Master Item
          </Button>
        </Box>
      )}

      {/* Content Section */}
      <Box sx={{ 
        overflowX: "auto",
        "& .MuiTableContainer-root": {
          maxWidth: "100%"
        }
      }}>
        {itemType === "Master Items" ? (
          <MasterItems 
            items={filteredItems}
            selectedMaster={selectedMaster}
            setSelectedMaster={setSelectedMaster}
            isMobile={isMobile}
          />
        ) : (
          <SubItems 
            items={filteredItems}
            isMobile={isMobile}
          />
        )}
      </Box>

      {/* Modals */}
      <AddMasterItemForm 
        open={open} 
        handleClose={handleAddMasterItemClose} 
        onAddNewMasterItem={handleAddMasterItem} 
        fullScreen={isMobile}
      />

      <AddSubItemForm
        open={openSubItem}
        handleClose={handleAddSubItemClose}
        masterItems={masterItems}
        selectedMaster={selectedMaster}
        onAdd={handleAddSubItem}
        fullScreen={isMobile}
      />

      <SnackbarComponent />
    </Box>
  );
};

export default ItemsPage;