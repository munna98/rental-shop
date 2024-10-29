// src/components/items/SubItems.js
import React from "react";
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
import StatusChip from '@/components/StatusChip';

const SubItems = ({ items }) => { // Accept items as props
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Image</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Item Name</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Code</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Rent Rate</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => ( // Render items from props
            <TableRow key={item._id}>
              <TableCell>
                <Avatar alt={item.name} src={item.image} sx={{ width: 56, height: 56 }} />
              </TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.code}</TableCell>
              <TableCell>{`₹${item.rentRate}`}</TableCell>
              <TableCell>
                  <StatusChip status={item.status} /> {/* Use StatusChip */}
                </TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell align="center">
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<EditIcon />}
                  sx={{ marginRight: 1 }} // Add space between buttons
                  onClick={() => console.log("Edit", item._id)} // Placeholder action
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => console.log("Delete", item._id)} // Placeholder action
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SubItems;
