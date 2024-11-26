
// MasterItems.jsx
import React, { useState } from "react";
import { useConfirmation } from "@/hooks/useConfirmation";
import { useItems } from "@/context/ItemsContext";
import { useSnackbar } from "@/hooks/useSnackbar";
import axios from 'axios';
import EditMasterItemForm from "../forms/EditMasterItemForm";
import AddSubItemForm from "@/components/forms/AddSubItemForm";
import MasterItemTable from "./tables/masterItemTable";

const MasterItems = ({ items, }) => {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const { masterItems, fetchMasterItems, fetchSubItems } = useItems();
  const [selectedMaster, setSelectedMaster] = useState(""); 
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
        if (error.response) {
          if (error.response.status === 400) {
            showSnackbar("Cannot delete item: it is referenced by subitems.", "error");
          } else if (error.response.status === 404) {
            showSnackbar("Master item not found.", "error");
          } else {
            showSnackbar("Failed to delete master item. Please try again.", "error");
          }
        } else if (error.request) {
          showSnackbar("No response from server. Please check your network connection.", "error");
        } else {
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
      <MasterItemTable
        items={items}
        onEdit={handleEditOpen}
        onDelete={handleDelete}
        onAddSubItem={handleAddSubItemOpen}
      />

      <AddSubItemForm 
        open={open} 
        handleClose={handleAddSubItemClose} 
        masterItems={masterItems} 
        selectedMaster={selectedMaster}
        onAdd={async () => {
          await fetchSubItems();
          showSnackbar("Sub item added successfully!", "success");
        }}
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