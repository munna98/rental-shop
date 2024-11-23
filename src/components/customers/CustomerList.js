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
  Card,
  CardContent,
  Typography,
  Collapse,
  IconButton,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const CustomerList = ({ customers, onEditCustomer, onDeleteCustomer }) => {
  const [expandedCustomer, setExpandedCustomer] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Desktop view component
  const DesktopView = () => (
    <TableContainer 
      component={Paper} 
      sx={{ 
        display: { xs: 'none', md: 'block' },
        boxShadow: theme.palette.mode === "light" 
          ? "0 8px 20px rgba(0, 0, 0, 0.1)" 
          : "0 8px 20px rgba(0, 0, 0, 0.2)",
      }}
    >
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
          {customers.length > 0 ? (
            customers.map((customer) => (
              <TableRow key={customer._id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.code}</TableCell>
                <TableCell>{customer.address}</TableCell>
                <TableCell>{customer.mobile}</TableCell>
                <TableCell>{customer.whatsapp}</TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<EditIcon />}
                      onClick={() => onEditCustomer(customer)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => onDeleteCustomer(customer._id)}
                    >
                      Delete
                    </Button>
                  </Stack>
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
  );

  // Mobile view component
  const MobileView = () => (
    <Box sx={{ display: { xs: 'block', md: 'none' } }}>
      {customers.length > 0 ? (
        customers.map((customer) => (
          <Card 
            key={customer._id} 
            sx={{ 
              mb: 2,
              boxShadow: theme.palette.mode === "light" 
                ? "0 8px 20px rgba(0, 0, 0, 0.1)" 
                : "0 8px 20px rgba(0, 0, 0, 0.2)",
              borderRadius: "8px",
              background: theme.palette.mode === "light"
                ? "rgba(255, 255, 255, 0.6)"
                : "rgba(42, 42, 42, 0.6)",
              border: `1px solid ${
                theme.palette.mode === "light"
                  ? "rgba(255, 255, 255, 0.2)"
                  : "rgba(255, 255, 255, 0.1)"
              }`,
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="subtitle1" component="div">
                    {customer.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Code: {customer.code}
                  </Typography>
                </Box>
                <IconButton
                  onClick={() => setExpandedCustomer(
                    expandedCustomer === customer._id ? null : customer._id
                  )}
                >
                  {expandedCustomer === customer._id ? (
                    <KeyboardArrowUpIcon />
                  ) : (
                    <KeyboardArrowDownIcon />
                  )}
                </IconButton>
              </Box>

              <Collapse in={expandedCustomer === customer._id}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Address
                    </Typography>
                    <Typography variant="body2">
                      {customer.address}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Contact Information
                    </Typography>
                    <Typography variant="body2">
                      Mobile: {customer.mobile}
                    </Typography>
                    <Typography variant="body2">
                      WhatsApp: {customer.whatsapp}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<EditIcon />}
                      size="small"
                      onClick={() => onEditCustomer(customer)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      size="small"
                      onClick={() => onDeleteCustomer(customer._id)}
                    >
                      Delete
                    </Button>
                  </Stack>
                </Stack>
              </Collapse>
            </CardContent>
          </Card>
        ))
      ) : (
        <Box textAlign="center" color="text.secondary" mt={2}>
          No customers found
        </Box>
      )}
    </Box>
  );

  return (
    <>
      <DesktopView />
      <MobileView />
    </>
  );
};

export default CustomerList;