// src/components/items/MasterItems.js
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

const MasterItems = ({ items, onDelete }) => {
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/master-items/${id}`);
      onDelete(id);

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
  };

  const handleAddSubItemOpen = () => setOpen(true);
  const handleAddSubItemClose = () => setOpen(false);

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Image</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Item Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Code</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Actions
              </TableCell>
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
                    onClick={() => console.log("Edit", item._id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="outlined"
                    color="success"
                    startIcon={<AddIcon />}
                    onClick={handleAddSubItemOpen}
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

      <AddSubItemForm open={open} handleClose={handleAddSubItemClose} masterItems={items} />

      {/* Snackbar for delete success or error messages */}
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
    </>
  );
};

export default MasterItems;
