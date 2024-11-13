import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Alert,
  Paper,
  Collapse,
  TextField,
  Stack,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useInvoice } from '@/context/InvoiceContext';

const PAYMENT_METHODS = {
  cash: 'Cash',
  upi: 'UPI',
  card: 'Card',
  bank_transfer: 'Bank Transfer'
};

const InvoiceReceipts = () => {
  const { totalAmount, receipts, dispatch } = useInvoice();
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState({});

  const addReceipt = () => {
    const isFirst = receipts.length === 0;
    const newReceipt = {
      id: Date.now(),
      amount: '',
      date: new Date().toISOString().slice(0, 10),
      method: 'cash',
      note: isFirst ? 'Advance' : '' // Auto-fill "Advance" for first receipt
    };
    
    dispatch({ 
      type: 'ADD_RECEIPT', 
      payload: newReceipt 
    });
    
    setExpanded(prev => ({ ...prev, [newReceipt.id]: true }));
  };

  const handleReceiptChange = (id, field, value) => {
    const updatedReceipts = receipts.map(receipt =>
      receipt.id === id ? { ...receipt, [field]: value } : receipt
    );
    
    dispatch({ 
      type: 'SET_RECEIPTS', 
      payload: updatedReceipts 
    });
    
    setError('');
  };

  const removeReceipt = (id) => {
    const updatedReceipts = receipts.filter(receipt => receipt.id !== id);
    dispatch({ 
      type: 'SET_RECEIPTS', 
      payload: updatedReceipts 
    });
  };

  const toggleExpand = (id) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const totalPaid = receipts.reduce((sum, receipt) => 
    sum + (parseFloat(receipt.amount) || 0), 0
  );
  const balanceAmount = totalAmount - totalPaid;

  return (
    <Box
      component={Paper}
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: theme => theme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.05)'
          : 'rgba(0, 0, 0, 0.02)',
      }}
    >
      {/* Header with Title and Add Button */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3
        }}
      >
        <Typography variant="h5" fontWeight="medium">
          Receipt Details
        </Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addReceipt}
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
          }}
        >
          {receipts.length === 0 ? 'Add Receipt' : 'Add Another Receipt'}
        </Button>
      </Box>

      {/* Summary Section */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={1} 
            sx={{ 
              p: 2,
              bgcolor: theme => theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.05)'
                : '#fff'
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1" color="text.secondary">
                Total Amount
              </Typography>
              <Typography variant="h6" fontWeight="medium">
                ₹{totalAmount.toLocaleString()}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={1} 
            sx={{ 
              p: 2,
              bgcolor: theme => theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.05)'
                : '#fff'
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1" color="text.secondary">
                Balance Amount
              </Typography>
              <Typography 
                variant="h6" 
                fontWeight="medium"
                color={balanceAmount < 0 ? 'error.main' : 'success.main'}
              >
                ₹{balanceAmount.toLocaleString()}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {error && (
        <Alert 
          severity="error" 
          onClose={() => setError('')} 
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      )}

      {/* Receipts List */}
      <Stack spacing={2}>
        {receipts.map((receipt, index) => (
          <Paper 
            key={receipt.id}
            elevation={2}
            sx={{ 
              p: 2,
              border: '1px solid',
              borderColor: 'divider',
              position: 'relative',
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Amount"
                  type="number"
                  value={receipt.amount}
                  onChange={(e) => handleReceiptChange(receipt.id, 'amount', e.target.value)}
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <Typography color="text.secondary" sx={{ mr: 1 }}>₹</Typography>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Date"
                  type="date"
                  value={receipt.date}
                  onChange={(e) => handleReceiptChange(receipt.id, 'date', e.target.value)}
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    value={receipt.method}
                    onChange={(e) => handleReceiptChange(receipt.id, 'method', e.target.value)}
                    label="Payment Method"
                  >
                    {Object.entries(PAYMENT_METHODS).map(([value, label]) => (
                      <MenuItem key={value} value={value}>{label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={1}>
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  {receipts.length > 1 && (
                    <IconButton
                      size="small"
                      onClick={() => removeReceipt(receipt.id)}
                      sx={{ 
                        color: 'error.main',
                        '&:hover': {
                          bgcolor: 'error.lighter',
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                  <IconButton
                    size="small"
                    onClick={() => toggleExpand(receipt.id)}
                    sx={{
                      transition: 'transform 0.2s',
                      transform: expanded[receipt.id] ? 'rotate(180deg)' : 'none',
                    }}
                  >
                    <KeyboardArrowDownIcon />
                  </IconButton>
                </Stack>
              </Grid>
            </Grid>

            <Collapse in={expanded[receipt.id]}>
              <Divider sx={{ my: 2 }} />
              <TextField
                label="Notes"
                value={receipt.note}
                onChange={(e) => handleReceiptChange(receipt.id, 'note', e.target.value)}
                fullWidth
                size="small"
                multiline
                rows={2}
                sx={{ mt: 1 }}
              />
            </Collapse>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};

export default InvoiceReceipts;