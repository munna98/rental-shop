import React from "react";
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Box,
  Typography,
  useTheme
} from "@mui/material";

const ItemSelection = ({
  selectedItem,
  setSelectedItem,
  measurements,
  setMeasurements,
  rate,
  setRate,
  handleAddItem,
  sampleItems = [],
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
       
        padding: 2,
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Typography variant="h6" color="#CE5A67" gutterBottom>
        Select Items
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Item</InputLabel>
            <Select
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {sampleItems.length > 0 ? (
                sampleItems.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name} - ₹{item.rentRate}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No Items Available</MenuItem>
              )}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Rate"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Measurements"
            value={measurements}
            onChange={(e) => setMeasurements(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddItem}
            fullWidth
          >
            Add Item
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ItemSelection;
