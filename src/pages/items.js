import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Button,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import AddMasterItemForm from "@/components/forms/AddMasterItemForm";
import MasterItems from "@/components/items/MasterItems";
import AddSubItemForm from "@/components/forms/AddSubItemForm";
import SubItems from "@/components/items/SubItems";
import { useItems } from "@/context/ItemsContext";
import { useSnackbar } from "@/hooks/useSnackbar";
import { useDebounce } from "@/hooks/useDebounce";
import axios from "axios";

const ItemsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    itemType,
    setItemType,
    masterItems,
    subItems,
    loading,
    fetchMasterItems,
    fetchSubItems,
  } = useItems();

  const { showSnackbar, SnackbarComponent } = useSnackbar();

  const [open, setOpen] = useState(false); // Master Item Modal
  const [openSubItem, setOpenSubItem] = useState(false); // Sub Item Modal
  const [selectedMaster, setSelectedMaster] = useState(""); 
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingSubItems, setLoadingSubItems] = useState(false); // Subitems loading state
  const [subItemsLoaded, setSubItemsLoaded] = useState(false); // Prevent repeated fetch

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Fetch subitems when tab is switched to "Sub Items"
  useEffect(() => {
    const fetchSubItemsWithLoading = async () => {
      if (!subItemsLoaded) { // Only fetch if not already loaded
        setLoadingSubItems(true);
        try {
          await fetchSubItems(); // Fetch subitems from context function
          setSubItemsLoaded(true); // Mark as loaded
        } catch (error) {
          console.error("Error fetching subitems:", error);
          showSnackbar("Failed to load sub items.", "error");
        } finally {
          setLoadingSubItems(false);
        }
      }
    };

    if (itemType === "Sub Items") {
      fetchSubItemsWithLoading();
    }
  }, [itemType, subItemsLoaded, fetchSubItems, showSnackbar]);

  const filteredMasterItems = useMemo(() => {
    return masterItems.filter((item) =>
      item.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [debouncedSearchQuery, masterItems]);

  const filteredSubItems = useMemo(() => {
    return subItems.filter((item) =>
      item.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [debouncedSearchQuery, subItems]);

  const handleAddMasterItem = async (newItem) => {
    try {
      await axios.post("/api/master-items", newItem);
      await fetchMasterItems();
      showSnackbar("Master item added successfully!", "success");
      setOpen(false);
    } catch (error) {
      console.error("Error adding master item:", error);
      showSnackbar("Failed to add master item.", "error");
    }
  };

  const handleAddSubItem = async (newSubItem) => {
    try {
      await axios.post("/api/sub-items", newSubItem);
      await fetchSubItems();
      showSnackbar("Sub item added successfully!", "success");
      setOpenSubItem(false);
    } catch (error) {
      console.error("Error adding sub item:", error);
      showSnackbar("Failed to add sub item.", "error");
    }
  };

  return (
    <Box sx={{ padding: 3, maxWidth: 1200, margin: "0 auto" }}>
      {/* Header Section */}
      <Typography
        variant="h4"
        sx={{
          fontSize: { xs: "1.5rem", sm: "2rem" },
          marginBottom: 3,
        }}
      >
        Items
      </Typography>

      {/* Tabs Section */}
      <Tabs
        value={itemType}
        onChange={(_, newValue) => setItemType(newValue)}
        variant={isMobile ? "fullWidth" : "standard"}
        sx={{ marginBottom: 2 }}
      >
        <Tab label="Master Items" value="Master Items" />
        <Tab label="Sub Items" value="Sub Items" />
      </Tabs>

      {/* Search and Add Button Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: { xs: "stretch", sm: "space-between" },
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
          marginBottom: 3,
        }}
      >
        <TextField
          variant="outlined"
          placeholder={`Search ${itemType.toLowerCase()}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            width: { xs: "100%", sm: 300 },
          }}
        />

        {itemType === "Master Items" && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            sx={{
              width: { xs: "100%", sm: "auto" },
              whiteSpace: "nowrap",
            }}
          >
            Add Master Item
          </Button>
        )}
      </Box>

      {/* Loading Spinner */}
      {(loading && itemType === "Master Items") ||
      (loadingSubItems && itemType === "Sub Items") ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        /* Items List */
        <Box>
          {itemType === "Master Items" ? (
            <MasterItems items={filteredMasterItems} />
          ) : (
            <SubItems items={filteredSubItems} />
          )}
        </Box>
      )}

      {/* Modals */}
      <AddMasterItemForm
        open={open}
        handleClose={() => setOpen(false)}
        onAddNewMasterItem={handleAddMasterItem}
      />

      <AddSubItemForm
        open={openSubItem}
        handleClose={() => setOpenSubItem(false)}
        masterItems={masterItems}
        selectedMaster={selectedMaster}
        setSelectedMaster={setSelectedMaster}
        onAdd={handleAddSubItem}
      />

      <SnackbarComponent />
    </Box>
  );
};

export default ItemsPage;
