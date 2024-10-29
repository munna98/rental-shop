// CustomerList.js
import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

// Sample list of customers
const sampleCustomers = [
  { id: 1, code: "CUST0001", name: "Munavir T", address: "Kavanur", mobile: "8086046399", whatsapp: "8086046399" },
  { id: 2, code: "CUST0002", name: "Lionel Messi", address: "Rosario", mobile: "9999999999", whatsapp: "9999999999" },
  { id: 3, code: "CUST0003", name: "Johan Cruyff", address: "Holland", mobile: "9999999999", whatsapp: "9999999999" },
  { id: 4, code: "CUST0004", name: "Pep Guardiola", address: "Spain", mobile: "9999999999", whatsapp: "9999999999" },
];

const CustomerList = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter customers based on search query
  const filteredCustomers = sampleCustomers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.mobile.includes(searchQuery) ||
      customer.whatsapp.includes(searchQuery)
  );

  return (
    <Box>
      {/* Customer Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Code</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Mobile Number</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>WhatsApp Number</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.code}</TableCell>
                  <TableCell>{customer.address}</TableCell>
                  <TableCell>{customer.mobile}</TableCell>
                  <TableCell>{customer.whatsapp}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<EditIcon />}
                      sx={{ marginRight: 1 }} // Add space between buttons
                      onClick={() => console.log("Edit", customer.id)} // Placeholder action
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => console.log("Delete", customer.id)} // Placeholder action
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>
                  <Box textAlign="center" color="text.secondary">
                    No customers found
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CustomerList;
