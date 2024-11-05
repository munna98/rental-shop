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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StatusChip from "@/components/StatusChip";
import { useConfirmation } from "@/hooks/useConfirmation";
import EditSubItemForm from "../forms/EditSubItemForm";
import axios from "axios";
import { useItems } from "@/context/ItemsContext";
import { useSnackbar } from "@/hooks/useSnackbar";

const SubItems = () => {
  const [openEdit, setOpenEdit] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const { subItems, masterItems, fetchSubItems } = useItems();
  const { showConfirmation ,ConfirmationDialog} = useConfirmation();
  const { showSnackbar, SnackbarComponent } = useSnackbar();

  const handleDelete = async (id, itemName) => {
    const isConfirmed = await showConfirmation({
      title: "Delete Confirmation",
      message: `Are you sure you want to delete "${itemName}"?`,
    });

    if (isConfirmed) {
      try {
        await axios.delete(`/api/sub-items/${id}`);
        fetchSubItems();
        showSnackbar("Sub item deleted successfully!", "success");
      } catch (error) {
        console.error("Error deleting sub item:", error);
        showSnackbar("Failed to delete sub item.", "error");
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
      showSnackbar("Item updated successfully!", "success");
      setOpenEdit(false);
    } catch (error) {
      console.error("Error updating sub item:", error);
      showSnackbar("Failed to update sub item.", "error");
    }
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
                  <TableCell>{item.master?.name || 'Unknown'}</TableCell>
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

      <SnackbarComponent />

      <ConfirmationDialog />
    </>
  );
};

export default SubItems;