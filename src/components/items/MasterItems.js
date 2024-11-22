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
  Button
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import AddSubItemForm from "@/components/forms/AddSubItemForm";
import { useConfirmation } from "@/hooks/useConfirmation";
import { useItems } from "@/context/ItemsContext";
import { useSnackbar } from "@/hooks/useSnackbar";
import axios from 'axios';
import EditMasterItemForm from "../forms/EditMasterItemForm";

const MasterItems = ({ items, selectedMaster, setSelectedMaster }) => {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const { masterItems, fetchMasterItems, fetchSubItems } = useItems();
  const { showSnackbar, SnackbarComponent } = useSnackbar();
  const { showConfirmation, ConfirmationDialog } = useConfirmation();

  const handleDelete = async (id, itemName) => {
    const isConfirmed = await showConfirmation({
      title: "Delete Confirmation",
      message: `Are you sure you want to delete "${itemName}"?`,
    });
  
    if (isConfirmed) {
      try {
        await axios.delete(`/api/master-items/${id}`);
        await fetchMasterItems();
        await fetchSubItems();
        showSnackbar("Master item deleted successfully!", "success");
      } catch (error) {
        console.error("Error deleting master item:", error);
  
        // Check if the error response exists and has a status
        if (error.response) {
          // Handle different error status codes
          if (error.response.status === 400) {
            showSnackbar("Cannot delete item: it is referenced by subitems.", "error");
          } else if (error.response.status === 404) {
            showSnackbar("Master item not found.", "error");
          } else {
            showSnackbar("Failed to delete master item. Please try again.", "error");
          }
        } else if (error.request) {
          // The request was made but no response was received
          showSnackbar("No response from server. Please check your network connection.", "error");
        } else {
          // Something happened in setting up the request that triggered an Error
          showSnackbar("An error occurred while deleting the master item.", "error");
        }
      }
    }
  };
  

  const handleEditOpen = (item) => {
    setCurrentItem(item);
    setOpenEdit(true);
  };

  const handleUpdate = async (updatedItem) => {
    try {
      await fetchMasterItems();
      showSnackbar("Item updated successfully!", "success");
    } catch (error) {
      console.error("Error updating master item:", error);
      showSnackbar("Failed to update master item.", "error");
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
          {items.map((item) => (
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
        onAdd={async () => {
          await fetchSubItems();
          showSnackbar("Sub item added successfully!", "success");
        }} // Show snackbar here
      />

      <EditMasterItemForm
        open={openEdit}
        handleClose={handleEditClose}
        item={currentItem}
        onUpdate={handleUpdate}
      />

      <SnackbarComponent />
      <ConfirmationDialog />
    </>
  );
};

export default MasterItems;
