import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Button,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StatusChip from "@/components/StatusChip";
import { useConfirmation } from "@/hooks/useConfirmation";
import EditSubItemForm from "../forms/EditSubItemForm";
import axios from "axios";
import { useItems } from "@/context/ItemsContext";

const SubItems = () => {
  const [openEdit, setOpenEdit] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [selectedMasterFilter, setSelectedMasterFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Get context values
  const { subItems, masterItems, fetchSubItems } = useItems();
  
  const { showConfirmation, ConfirmationDialog } = useConfirmation();

  // // Filtered items based on selected master item and status
  // const filteredItems = useMemo(() => {
  //   return subItems.filter(item => {
  //     const masterMatch = selectedMasterFilter === "all" || item.masterId === selectedMasterFilter;
  //     const statusMatch = statusFilter === "all" || item.status === statusFilter;
  //     return masterMatch && statusMatch;
  //   });
  // }, [subItems, selectedMasterFilter, statusFilter]);

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const handleDelete = async (id, itemName) => {
    const isConfirmed = await showConfirmation({
      title: "Delete Confirmation",
      message: `Are you sure you want to delete "${itemName}"?`,
    });

    if (isConfirmed) {
      try {
        await axios.delete(`/api/sub-items/${id}`);
        fetchSubItems();

        setSnackbar({
          open: true,
          message: "Sub item deleted successfully!",
          severity: "success",
        });
      } catch (error) {
        console.error("Error deleting sub item:", error);
        setSnackbar({
          open: true,
          message: "Failed to delete sub item.",
          severity: "error",
        });
      }
    }
  };

  const handleEditOpen = (item) => {
    setCurrentItem(item);
    setOpenEdit(true);
  };

  const handleUpdate = async (updatedItem) => {
    try {
      await axios.put(`/api/sub-items/${updatedItem._id}`, updatedItem);
      fetchSubItems();
      setSnackbar({
        open: true,
        message: "Item updated successfully!",
        severity: "success",
      });
      setOpenEdit(false);
    } catch (error) {
      console.error("Error updating sub item:", error);
      setSnackbar({
        open: true,
        message: "Failed to update sub item.",
        severity: "error",
      });
    }
  };

  const handleEditClose = () => setOpenEdit(false);

  return (
    <>
      {/* <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Master Item</InputLabel>
          <Select
            value={selectedMasterFilter}
            onChange={(e) => setSelectedMasterFilter(e.target.value)}
            label="Filter by Master Item"
          >
            <MenuItem value="all">All Master Items</MenuItem>
            {masterItems.map((master) => (
              <MenuItem key={master._id} value={master._id}>
                {master.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Status"
          >
            <MenuItem value="all">All Statuses</MenuItem>
            <MenuItem value="available">Available</MenuItem>
            <MenuItem value="rented">Rented</MenuItem>
            <MenuItem value="maintenance">Maintenance</MenuItem>
          </Select>
        </FormControl>
      </Box> */}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Image</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Item Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Code</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Master Item</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Rent Rate</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subItems.map((item) => {
              // const masterItem = masterItems.find(master => master._id === item.masterId);
              // console.log(masterItem,"masateritem");
              
              return (
                <TableRow key={item._id}>
                  <TableCell>
                    <Avatar
                      alt={item.name}
                      src={item.image}
                      sx={{ width: 56, height: 56 }}
                    />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>{item.master.name || 'Unknown'}</TableCell>
                  <TableCell>{`₹${item.rentRate}`}</TableCell>
                  <TableCell>
                    <StatusChip status={item.status} />
                  </TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<EditIcon />}
                      sx={{ marginRight: 1 }}
                      onClick={() => handleEditOpen(item)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(item._id, item.name)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <EditSubItemForm
        open={openEdit} 
        handleClose={handleEditClose} 
        item={currentItem} 
        masterItems={masterItems}
        onUpdate={handleUpdate}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <ConfirmationDialog />
    </>
  );
};

export default SubItems;