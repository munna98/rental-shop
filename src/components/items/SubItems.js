import React, { useState, useMemo } from "react"; 
import { useConfirmation } from "@/hooks/useConfirmation";
import EditSubItemForm from "../forms/EditSubItemForm";
import axios from "axios";
import { useItems } from "@/context/ItemsContext";
import { useSnackbar } from "@/hooks/useSnackbar";
import SubItemTable from "./tables/subItemTable";

const SubItems = ({ items }) => {
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
      <SubItemTable
        items={items}
        onEdit={handleEditOpen}
        onDelete={handleDelete}
      />

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