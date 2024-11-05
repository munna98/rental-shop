import React, { useState, useCallback } from "react";
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
  Snackbar,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useInvoice } from "@/context/InvoiceContext";
import { createReceipts } from "@/services/api";

const PAYMENT_METHODS = {
  cash: 'Cash',
  upi: 'UPI',
  card: 'Card',
  bank_transfer: 'Bank Transfer'
};

const ReceiptDetails = () => {
  const { 
    totalAmount, 
    selectedCustomer, 
    invoiceNumber,
    dispatch 
  } = useInvoice();
  
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' // 'success' | 'error'
  });

  const [receipts, setReceipts] = useState([{
    id: Date.now(),
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    method: 'cash',
    note: ''
  }]);

  // Handle snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Show snackbar message
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleReceiptChange = useCallback((id, field, value) => {
    setReceipts(prev => prev.map(receipt => 
      receipt.id === id ? { ...receipt, [field]: value } : receipt
    ));
    setError('');
  }, []);

  const addReceipt = useCallback(() => {
    const newId = Date.now();
    setReceipts(prev => [...prev, {
      id: newId,
      amount: '',
      date: new Date().toISOString().slice(0, 10),
      method: 'cash',
      note: ''
    }]);
    setExpanded(prev => ({ ...prev, [newId]: true }));
  }, []);

  const removeReceipt = useCallback((id) => {
    setReceipts(prev => prev.filter(receipt => receipt.id !== id));
    setExpanded(prev => {
      const newExpanded = { ...prev };
      delete newExpanded[id];
      return newExpanded;
    });
  }, []);

  const toggleExpand = useCallback((id) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }, []);

  const totalPaid = receipts.reduce((sum, receipt) => 
    sum + (parseFloat(receipt.amount) || 0), 0
  );
  const balanceAmount = totalAmount - totalPaid;

  const handleSubmit = async () => {
    // Validation checks
    if (receipts.some(receipt => !receipt.amount || isNaN(receipt.amount))) {
      setError('Please enter valid amounts for all receipts');
      showSnackbar('Please enter valid amounts for all receipts', 'error');
      return;
    }

    if (totalPaid > totalAmount) {
      setError('Total paid amount cannot exceed the invoice amount');
      showSnackbar('Total paid amount cannot exceed the invoice amount', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createReceipts({
        receipts: receipts,
        customerId: selectedCustomer._id,
        invoiceNumber: invoiceNumber
      });

      // Update invoice context with new payment status
      dispatch({ 
        type: "UPDATE_PAYMENT_STATUS", 
        payload: result.invoice 
      });

      // Show success message
      showSnackbar('Receipts created successfully');
      
      // Reset form
      setReceipts([{
        id: Date.now(),
        amount: '',
        date: new Date().toISOString().slice(0, 10),
        method: 'cash',
        note: ''
      }]);
      setError('');
      
    } catch (error) {
      setError(error.message || 'Failed to create receipts');
      showSnackbar(error.message || 'Failed to create receipts', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      component={Paper}
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: theme => theme.palette.mode === 'dark' 
          ? 'rgba(206, 90, 103, 0.1)'
          : 'rgba(206, 90, 103, 0.05)',
      }}
    >
      {/* Summary Section */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 1.5 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle2" color="text.secondary">
                Total Amount
              </Typography>
              <Typography variant="h6" fontWeight="medium">
                ₹{totalAmount.toLocaleString()}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 1.5 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle2" color="text.secondary">
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

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          onClose={() => setError('')} 
          sx={{ mb: 2 }}
          style={{ padding: '0 8px' }}
        >
          {error}
        </Alert>
      )}

      {/* Receipts List */}
      <Stack spacing={1.5} sx={{ mb: 2 }}>
        {receipts.map((receipt) => (
          <Paper 
            key={receipt.id}
            elevation={1}
            sx={{ 
              p: 1.5, 
              position: 'relative',
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            {/* Main Row */}
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
                    startAdornment: <Typography>₹</Typography>,
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
              <Grid item xs={10} sm={3}>
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
              <Grid item xs={2} sm={1}>
                <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                  {receipts.length > 1 && (
                    <IconButton
                      size="small"
                      onClick={() => removeReceipt(receipt.id)}
                      sx={{ color: 'error.main' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                  <IconButton
                    size="small"
                    onClick={() => toggleExpand(receipt.id)}
                  >
                    {expanded[receipt.id] ? 
                      <KeyboardArrowUpIcon fontSize="small" /> : 
                      <KeyboardArrowDownIcon fontSize="small" />
                    }
                  </IconButton>
                </Stack>
              </Grid>
            </Grid>

            {/* Collapsible Notes */}
            <Collapse in={expanded[receipt.id]}>
              <Box sx={{ mt: 2 }}>
                <TextField
                  label="Notes"
                  value={receipt.note}
                  onChange={(e) => handleReceiptChange(receipt.id, 'note', e.target.value)}
                  fullWidth
                  size="small"
                  multiline
                  rows={2}
                />
              </Box>
            </Collapse>
          </Paper>
        ))}
      </Stack>

      {/* Actions */}
      <Stack spacing={1}>
        <Button
          startIcon={<AddIcon />}
          onClick={addReceipt}
          variant="outlined"
          size="small"
        >
          Add Another Receipt
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting}
          sx={{
            bgcolor: '#CE5A67',
            '&:hover': {
              bgcolor: '#b44851',
            },
          }}
        >
          {isSubmitting ? 'Updating...' : 'Update Receipt Details'}
        </Button>
      </Stack>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReceiptDetails;