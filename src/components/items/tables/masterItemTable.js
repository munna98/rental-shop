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
  Box,
  Stack,
  useTheme,
  useMediaQuery,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const MasterItemTable = ({ items, onEdit, onDelete, onAddSubItem }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleMoreClick = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleMenuAction = (action) => {
    if (selectedItem) {
      if (action === 'edit') {
        onEdit(selectedItem);
      } else if (action === 'delete') {
        onDelete(selectedItem._id, selectedItem.name);
      }
    }
    handleMenuClose();
  };

  // Desktop view remains unchanged
  const DesktopView = () => (
    <TableContainer component={Paper} sx={{ display: { xs: 'none', md: 'block' } }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Image</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Item Name</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Code</TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item._id}>
              <TableCell>
                <Avatar alt={item.name} src={item.image} sx={{ width: 56, height: 56 }} />
              </TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.code}</TableCell>
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
                  <Button
                    variant="outlined"
                    color="success"
                    startIcon={<AddIcon />}
                    onClick={() => onAddSubItem(item)}
                  >
                    Add
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // Updated Mobile view
  const MobileView = () => (
    <Box sx={{ display: { xs: 'block', md: 'none' } }}>
      {items.map((item) => (
        <Card key={item._id} sx={{ 
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
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
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
                    Code: {item.code}
                  </Typography>
                </Box>
              </Box>
              <IconButton 
                onClick={(e) => handleMoreClick(e, item)}
                sx={{ ml: 1 }}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>

            <Button
              fullWidth
              variant="outlined"
              color="success"
              startIcon={<AddIcon />}
              onClick={() => onAddSubItem(item)}
              size="small"
            >
              Add Sub Item
            </Button>
          </CardContent>
        </Card>
      ))}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => handleMenuAction('edit')}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('delete')}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );

  return (
    <>
      <DesktopView />
      <MobileView />
    </>
  );
};

export default MasterItemTable;