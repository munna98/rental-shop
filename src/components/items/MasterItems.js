import React, { useState } from "react";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import AddSubItemForm from "@/components/forms/AddSubItemForm";
import axios from 'axios';
import { useConfirmation } from "@/hooks/useConfirmation";
import EditMasterItemForm from "@/components/forms/EditMasterItemForm";
import { useItems } from "@/context/ItemsContext"; // Import the context hook

const MasterItems = ({ selectedMaster, setSelectedMaster }) => {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  
  // Get context values
  const { masterItems, fetchMasterItems, fetchSubItems } = useItems();
  
  const { showConfirmation, ConfirmationDialog } = useConfirmation();

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const handleDelete = async (id, itemName) => {
    const isConfirmed = await showConfirmation({
      title: "Delete Confirmation",
      message: `Are you sure you want to delete "${itemName}"?`,
    });

    if (isConfirmed) {
      try {
        await axios.delete(`/api/master-items/${id}`);
        // Fetch updated items after deletion
        fetchMasterItems();
        fetchSubItems(); // Also fetch sub-items as they might be affected

        setSnackbar({
          open: true,
          message: "Master item deleted successfully!",
          severity: "success",
        });
      } catch (error) {
        console.error("Error deleting master item:", error);
        setSnackbar({
          open: true,
          message: "Failed to delete master item.",
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
      await axios.put(`/api/master-items/${updatedItem._id}`, updatedItem);
      fetchMasterItems(); // Fetch updated items
      setSnackbar({
        open: true,
        message: "Item updated successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating master item:", error);
      setSnackbar({
        open: true,
        message: "Failed to update master item.",
        severity: "error",
      });
    }
  };

  const handleAddSubItemOpen = (item) => {
    setOpen(true);
    setSelectedMaster(item._id);
  };

  const handleAddSubItemClose = () => setOpen(false);
  const handleEditClose = () => setOpenEdit(false);

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Image</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Item Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Code</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {masterItems.map((item) => (
              <TableRow key={item._id}>
                <TableCell>
                  <Avatar alt={item.name} src={item.image} sx={{ width: 56, height: 56 }} />
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.code}</TableCell>
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
                  <Button
                    variant="outlined"
                    color="success"
                    startIcon={<AddIcon />}
                    onClick={() => handleAddSubItemOpen(item)}
                    sx={{ marginLeft: 1 }}
                  >
                    Add 
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AddSubItemForm 
        open={open} 
        handleClose={handleAddSubItemClose} 
        masterItems={masterItems} 
        selectedMaster={selectedMaster}
        onAdd={fetchSubItems} // Pass the fetchSubItems function to refresh after adding
      />
      <EditMasterItemForm 
        open={openEdit} 
        handleClose={handleEditClose} 
        item={currentItem} 
        onUpdate={handleUpdate}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <ConfirmationDialog />
    </>
  );
};

export default MasterItems;