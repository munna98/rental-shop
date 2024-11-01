import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Grid,
  Collapse
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { useInvoice } from '@/context/InvoiceContext';

const SelectedItems = () => {
  const { selectedItems, handleRemoveItem, dispatch } = useInvoice();
  const [editItem, setEditItem] = useState(null);
  const [editRate, setEditRate] = useState('');
  const [editMeasurements, setEditMeasurements] = useState({
    item: '',
    sleeve: '',
    waist: '',
    length: '',
    pantsize: '',
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRowExpansion = (uniqueId) => {
    setExpandedRows(prev => ({
      ...prev,
      [uniqueId]: !prev[uniqueId]
    }));
  };

  const handleEditClick = (item) => {
    setEditItem(item);
    setEditRate(item.rentRate.toString());
    // Set measurements from the first measurement object in the array
    const measurementData = item.measurement?.[0] || {
      item: '',
      sleeve: '',
      waist: '',
      length: '',
      pantsize: '',
    };
    setEditMeasurements(measurementData);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditItem(null);
    setEditRate('');
    setEditMeasurements({
      item: '',
      sleeve: '',
      waist: '',
      length: '',
      pantsize: '',
    });
  };

  const handleMeasurementChange = (field) => (e) => {
    setEditMeasurements(prev => ({
      ...prev,
      [field]: e.target.value ? Number(e.target.value) : ''
    }));
  };

  const handleSaveEdit = () => {
    if (!editItem) return;

    // Remove old item
    handleRemoveItem(editItem.uniqueId);

    // Add updated item
    const updatedItem = {
      ...editItem,
      measurement: [{ ...editMeasurements }],
      rentRate: parseFloat(editRate)
    };

    dispatch({
      type: 'ADD_ITEM',
      payload: updatedItem
    });

    handleCloseDialog();
  };

  const isValidRate = (rate) => {
    const parsedRate = parseFloat(rate);
    return !isNaN(parsedRate) && parsedRate > 0;
  };

  const formatMeasurements = (measurements) => {
    if (!measurements || !measurements[0]) return 'No measurements';
    
    const measurementObj = measurements[0];
    const formatted = [];
    
    if (measurementObj.item) formatted.push(`Item: ${measurementObj.item}`);
    if (measurementObj.sleeve) formatted.push(`Sleeve: ${measurementObj.sleeve}`);
    if (measurementObj.waist) formatted.push(`Waist: ${measurementObj.waist}`);
    if (measurementObj.length) formatted.push(`Length: ${measurementObj.length}`);
    if (measurementObj.pantsize) formatted.push(`Pant: ${measurementObj.pantsize}`);
    
    return formatted.length > 0 ? formatted.join(' | ') : 'No measurements';
  };

  return (
    <>
      <TableContainer 
        component={Paper} 
        sx={{ 
          marginBottom: 2,
          boxShadow: 2,
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
          <Typography variant="h6" color="#CE5A67">
            Selected Items ({selectedItems.length})
          </Typography>
        </Box>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#fafafa' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Item</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Rate</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Measurements</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                  <Typography color="text.secondary">
                    No items selected. Please add items from the selection above.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              selectedItems.map((item) => (
                <React.Fragment key={item.uniqueId}>
                  <TableRow 
                    sx={{ '&:hover': { backgroundColor: '#fafafa' } }}
                  >
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{`₹${item.rentRate.toLocaleString()}`}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => toggleRowExpansion(item.uniqueId)}>
                          {formatMeasurements(item.measurement)}
                        </Typography>
                        <IconButton size="small" onClick={() => toggleRowExpansion(item.uniqueId)}>
                          {expandedRows[item.uniqueId] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit item">
                        <IconButton
                          color="primary"
                          size="small"
                          sx={{ mr: 1 }}
                          onClick={() => handleEditClick(item)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Remove item">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleRemoveItem(item.uniqueId)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2, backgroundColor: '#f5f5f5' }}>
          Edit Item: {editItem?.name}
          <IconButton
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Rate (₹)"
                fullWidth
                value={editRate}
                onChange={(e) => setEditRate(e.target.value)}
                error={!isValidRate(editRate)}
                helperText={!isValidRate(editRate) && "Please enter a valid rate"}
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Measurements
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Item Size"
                fullWidth
                type="number"
                value={editMeasurements.item}
                onChange={handleMeasurementChange('item')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Sleeve"
                fullWidth
                type="number"
                value={editMeasurements.sleeve}
                onChange={handleMeasurementChange('sleeve')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Waist"
                fullWidth
                type="number"
                value={editMeasurements.waist}
                onChange={handleMeasurementChange('waist')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Length"
                fullWidth
                type="number"
                value={editMeasurements.length}
                onChange={handleMeasurementChange('length')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Pant Size"
                fullWidth
                type="number"
                value={editMeasurements.pantsize}
                onChange={handleMeasurementChange('pantsize')}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleSaveEdit}
            variant="contained"
            disabled={!isValidRate(editRate)}
            sx={{
              backgroundColor: '#CE5A67',
              '&:hover': {
                backgroundColor: '#b44851',
              },
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SelectedItems;