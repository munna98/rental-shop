import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import axios from "axios";
import { useSnackbar } from "@/hooks/useSnackbar";

const EditSubItemForm = ({ open, handleClose, item, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    rentRate: "",
    description: "",
    image: "",
    status: "Available"
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || "",
        code: item.code || "",
        rentRate: item.rentRate || "",
        description: item.description || "",
        image: item.image || "",
        status: item.status || "Available"
      });
      setErrors({});
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.code.trim()) newErrors.code = "Code is required";
    if (!formData.rentRate) newErrors.rentRate = "Rent rate is required";
    if (parseFloat(formData.rentRate) <= 0) newErrors.rentRate = "Rent rate must be greater than 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        showSnackbar("Image size should be less than 5MB", "error");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const updatedItemData = {
        ...formData,
        rentRate: parseFloat(formData.rentRate),
        master: item.master._id
      };

      const response = await axios.put(`/api/sub-items/${item._id}`, updatedItemData);

      if (response.data) {
        showSnackbar("Sub item updated successfully!", "success");
        onUpdate(response.data);
        handleClose();
      }
    } catch (error) {
      console.error("Error updating sub item:", error);
      showSnackbar(error.response?.data?.message || "Failed to update sub item", "error");
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = ["Available", "Damaged", "Maintanance"];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Sub Item</DialogTitle>
      <DialogContent>
        <TextField
          margin="normal"
          label="Master Item"
          value={item?.master?.name || ""}
          fullWidth
          disabled
        />
        <TextField
          margin="normal"
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          margin="normal"
          label="Code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          fullWidth
          required
          disabled
          error={!!errors.code}
          helperText={errors.code}
        />
        <TextField
          margin="normal"
          label="Rent Rate"
          name="rentRate"
          value={formData.rentRate}
          onChange={handleChange}
          fullWidth
          required
          type="number"
          error={!!errors.rentRate}
          helperText={errors.rentRate}
          InputProps={{
            startAdornment: <Typography>₹</Typography>,
          }}
        />
        <TextField
          margin="normal"
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          rows={3}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            name="status"
            value={formData.status}
            onChange={handleChange}
            label="Status"
          >
            {statusOptions.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="edit-image-upload"
          type="file"
          onChange={handleImageChange}
        />
        <label htmlFor="edit-image-upload">
          <IconButton component="span" color="primary">
            <AttachFileIcon />
          </IconButton>
          <Typography variant="body2" component="span">
            Upload Image
          </Typography>
        </label>
        {formData.image && (
          <img
            src={formData.image}
            alt="Sub Item"
            style={{ width: "100%", maxHeight: 200, objectFit: "contain", marginTop: 10 }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
          {loading ? "Updating..." : "Update Sub Item"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSubItemForm;
