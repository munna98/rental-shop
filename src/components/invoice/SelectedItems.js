import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

const SelectedItems = ({ selectedItems, handleRemoveItem }) => {
  return (
    <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
      <Table> 
        <TableHead>
          <TableRow>
            <TableCell><strong>Item</strong></TableCell>
            <TableCell><strong>Rate</strong></TableCell>
            <TableCell><strong>Measurements</strong></TableCell>
            <TableCell align="center"><strong>Action</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {selectedItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{`₹${item.rentRate}`}</TableCell>
              <TableCell>{item.measurements}</TableCell>
              <TableCell align="center">
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<EditIcon />}
                  sx={{ marginRight: 1 }} // Add space between buttons
                  onClick={() => console.log("Edit", item.id)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleRemoveItem(item.id)}
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SelectedItems;
