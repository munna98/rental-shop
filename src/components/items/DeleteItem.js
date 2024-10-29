// src/components/items/DeleteItem.js
import React, { useState } from "react";
import { Button, Snackbar } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import ConfirmationModal from "@/components/modals/ConfirmationModal";

const DeleteItem = ({ itemId, itemName, onDeleteSuccess }) => {
  const [openModal, setOpenModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/master-items/${itemId}`);
      onDeleteSuccess(itemId); // Callback to update parent state after deletion
      handleCloseModal(); // Close modal on successful delete
      setSnackbarOpen(true); // Show snackbar on successful deletion
    } catch (error) {
      console.error("Failed to delete item:", error);
      // Optionally, show an error snackbar here if desired
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={handleOpenModal}
      >
        Delete
      </Button>
      <ConfirmationModal
        open={openModal}
        title="Delete Confirmation"
        message={`Are you sure you want to delete ${itemName}?`}
        onCancel={handleCloseModal}
        onConfirm={handleDelete}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={`${itemName} has been deleted.`}
      />
    </>
  );
};

export default DeleteItem;
