import React, { useState } from "react";
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
  Card,
  CardContent,
  Typography,
  Collapse,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import StatusChip from "@/components/StatusChip";

const SubItemTable = ({ items, onEdit, onDelete }) => {
  const [expandedItem, setExpandedItem] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));


  // Desktop view
  const DesktopView = () => (
    <TableContainer component={Paper} sx={{ display: { xs: 'none', md: 'block' } }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Image</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Item Name</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Code</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Master Item</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Rent Rate</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item._id}>
              <TableCell>
                <Avatar
                  alt={item.name}
                  src={item.image}
                  sx={{ width: 56, height: 56 }}
                />
              </TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.code}</TableCell>
              <TableCell>{item.master?.name || "Unknown"}</TableCell>
              <TableCell>{`₹${item.rentRate}`}</TableCell>
              <TableCell>
              <StatusChip status={item.status} />
              </TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell align="center">
                <Stack direction="row" spacing={1} justifyContent="center">
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => onEdit(item)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => onDelete(item._id, item.name)}
                  >
                    Delete
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // Mobile view
  const MobileView = () => (
    <Box sx={{ display: { xs: 'block', md: 'none' } }}>
      {items.map((item) => (
        <Card key={item._id} sx={{ mb: 1,
            boxShadow: theme.palette.mode === "light" 
            ? "0 8px 20px rgba(0, 0, 0, 0.1)" 
            : "0 8px 20px rgba(0, 0, 0, 0.2)", // Adjusted shadow for dark mode
          borderRadius: "8px",
          background: theme.palette.mode === "light"
            ? "rgba(255, 255, 255, 0.6)" // Light mode glassmorphic background
            : "rgba(42, 42, 42, 0.6)", // Dark mode glassmorphic background
          border: `1px solid ${
            theme.palette.mode === "light"
              ? "rgba(255, 255, 255, 0.2)"
              : "rgba(255, 255, 255, 0.1)"
          }`,
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  alt={item.name}
                  src={item.image}
                  sx={{ width: 56, height: 56 }}
                />
                <Box>   
                  <Typography variant="subtitle1" component="div">
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.code}
                  </Typography>
                </Box>
              </Box>
              <IconButton
                onClick={() => setExpandedItem(expandedItem === item._id ? null : item._id)}
              >
                {expandedItem === item._id ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )}
              </IconButton>
            </Box>

            <Collapse in={expandedItem === item._id}>
              <Box sx={{ mt: 2 }}>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Master Item
                    </Typography>
                    <Typography variant="body2">
                      {item.master?.name || "Unknown"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Rent Rate
                    </Typography>
                    <Typography variant="body2">
                      ₹{item.rentRate}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <StatusChip status={item.status} />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Description
                    </Typography>
                    <Typography variant="body2">
                      {item.description}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<EditIcon />}
                      size="small"
                      onClick={() => onEdit(item)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      size="small"
                      onClick={() => onDelete(item._id, item.name)}
                    >
                      Delete
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </Collapse>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  return (
    <>
      <DesktopView />
      <MobileView />
    </>
  );
};

export default SubItemTable;