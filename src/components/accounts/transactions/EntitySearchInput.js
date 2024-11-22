// EntitySearchInput.js
import React from "react";
import { Box, TextField, Typography, Chip, Autocomplete } from "@mui/material";

export const EntitySearchInput = ({ 
  selectedEntity, 
  setSelectedEntity, 
  entityError, 
  setEntityError, 
  entities 
}) => {
  return (
    <Autocomplete
      value={selectedEntity}
      onChange={(event, newValue) => {
        setSelectedEntity(newValue);
        setEntityError(false);
      }}
      options={entities}
      getOptionLabel={(option) => option.searchLabel || ""}
      groupBy={(option) => option.entityType}
      isOptionEqualToValue={(option, value) => 
        option._id === value._id && option.entityType === value.entityType
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select Customer or Account"
          error={entityError}
          helperText={entityError ? "Please select a customer or account" : ""}
          fullWidth
        />
      )}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="body1">{option.name}</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Chip 
                label={option.displayType}
                size="small"
                color={option.entityType === 'customer' ? 'primary' : 'secondary'}
              />
              {option.entityType === 'account' && (
                <Typography variant="caption" color="text.secondary">
                  {option.category}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      )}
      filterOptions={(options, { inputValue }) => {
        const filterValue = inputValue.toLowerCase();
        return options.filter(
          (option) =>
            option.name.toLowerCase().includes(filterValue) ||
            (option.category && option.category.toLowerCase().includes(filterValue)) ||
            (option.type && option.type.toLowerCase().includes(filterValue))
        );
      }}
      fullWidth
    />
  );
};