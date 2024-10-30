// src/components/items/SubItems.js
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
import StatusChip from "@/components/StatusChip";
import { useConfirmation } from "@/hooks/useConfirmation";
import EditSubItemForm from "../forms/EditSubItemForm";
import axios from "axios";

const SubItems = ({ items, onUpdate, onDelete, masterItems}) => {
  const [openEdit, setOpenEdit] = useState(false); // State for edit form
  const [currentItem, setCurrentItem] = useState(null); // Track the current item being edited
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { showConfirmation, ConfirmationDialog } = useConfirmation();

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const handleDelete = async (id, itemName) => {
    const isConfirmed = await showConfirmation({
      title: "Delete Confirmation",
      message: `Are you sure you want to delete "${itemName}"?`,
    });

    if (isConfirmed) {
      try {
        await axios.delete(`/api/sub-items/${id}`);
        // Call the onDelete prop to update sub items in ItemsPage
        onDelete(id);

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

  const handleUpdate = (updatedItem) => {
    onUpdate(updatedItem); // Call the onUpdate prop to update the item in ItemsPage
    setSnackbar({
      open: true,
      message: "Item updated successfully!",
      severity: "success",
    });
    console.log(updatedItem,"tyuio");
    
  };

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
              <TableCell sx={{ fontWeight: "bold" }}>Rent Rate</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(
              (
                item // Render items from props
              ) => (
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
                  <TableCell>{`₹${item.rentRate}`}</TableCell>
                  <TableCell>
                    <StatusChip status={item.status} /> {/* Use StatusChip */}
                  </TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<EditIcon />}
                      sx={{ marginRight: 1 }} // Add space between buttons
                      onClick={() => handleEditOpen(item)} // Call the onEdit function with the item
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
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <EditSubItemForm
        open={openEdit} 
        handleClose={handleEditClose} 
        item={currentItem} 
        masterItems={masterItems}
        onUpdate={handleUpdate} // Pass the update handler
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
