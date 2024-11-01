import React, { useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Autocomplete,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useInvoice } from "@/context/InvoiceContext";

const ItemSelection = () => {
  // Local state for form fields
  const [selectedItem, setSelectedItem] = useState(null);
  const [rate, setRate] = useState("");
  const [measurements, setMeasurements] = useState({
    item: "",
    sleeve: "",
    waist: "",
    length: "",
    pantsize: "",
  });

  // Get items and dispatch from context
  const { items = [], dispatch } = useInvoice();

  const handleItemChange = (event, newValue) => {
    setSelectedItem(newValue);
    
    // If an item is selected, set its default rate
    if (newValue) {
      setRate(newValue.rentRate.toString());
    } else {
      setRate("");
    }
  };

  const handleMeasurementChange = (field) => (e) => {
    setMeasurements(prev => ({
      ...prev,
      [field]: e.target.value ? Number(e.target.value) : ""
    }));
  };

  const handleAddItem = () => {
    if (selectedItem && rate) {
      // Create new item object with measurements
      const newItem = {
        ...selectedItem,
        measurement: [{ ...measurements }], // Match the schema structure
        rentRate: parseFloat(rate),
        customRate: parseFloat(rate)
      };

      // Dispatch to add item
      dispatch({
        type: "ADD_ITEM",
        payload: newItem
      });

      // Reset form
      setSelectedItem(null);
      setRate("");
      setMeasurements({
        item: "",
        sleeve: "",
        waist: "",
        length: "",
        pantsize: "",
      });
    }
  };

  // Check if any measurement is filled
  const hasMeasurements = Object.values(measurements).some(value => value !== "");

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" color="#CE5A67" gutterBottom>
        Select Items
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Autocomplete
            options={items}
            getOptionLabel={(option) => 
              option ? `${option.code} - ${option.name} - ₹${option.rentRate}` : ''
            }
            value={selectedItem}
            onChange={handleItemChange}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Item"
                variant="outlined"
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="body1">
                    {option.code} - {option.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Rent Rate: ₹{option.rentRate}
                  </Typography>
                </Box>
              </Box>
            )}
            fullWidth
            filterOptions={(options, { inputValue }) => {
              const filterValue = inputValue.toLowerCase();
              return options.filter(
                option => 
                  option.name.toLowerCase().includes(filterValue) ||
                  option.code.toLowerCase().includes(filterValue)
              );
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Rate"
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            fullWidth
          />
        </Grid>
        
        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="measurements-content"
              id="measurements-header"
            >
              <Typography>
                Measurements {hasMeasurements ? '(Added)' : ''}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Item Type"
                    type="number"
                    value={measurements.item}
                    onChange={handleMeasurementChange('item')}
                    fullWidth
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Sleeve"
                    type="number"
                    value={measurements.sleeve}
                    onChange={handleMeasurementChange('sleeve')}
                    fullWidth
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Waist"
                    type="number"
                    value={measurements.waist}
                    onChange={handleMeasurementChange('waist')}
                    fullWidth
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Length"
                    type="number"
                    value={measurements.length}
                    onChange={handleMeasurementChange('length')}
                    fullWidth
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Pant Size"
                    type="number"
                    value={measurements.pantsize}
                    onChange={handleMeasurementChange('pantsize')}
                    fullWidth
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddItem}
            fullWidth
            disabled={!selectedItem || !rate}
            sx={{ height: '56px' }}
          >
            Add Item
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ItemSelection;