import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Grid,
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Autocomplete
} from "@mui/material";
import { useSnackbar } from "@/hooks/useSnackbar";
import { useReceipt } from "@/context/ReceiptContext";

const ReceiptPage = () => {
  const { showSnackbar, SnackbarComponent } = useSnackbar();
  const { customers, receipts, loading, error, addReceipt, submitReceipts } = useReceipt();

  // Local form state
  const [amount, setAmount] = useState("");
  const [receiptMethod, setReceiptMethod] = useState("cash");
  const [note, setNote] = useState("");
  const [customer, setCustomer] = useState("");
  const [isValidAmount, setIsValidAmount] = useState(true);
  const [customerError, setCustomerError] = useState(false);
  const [receiptDate, setReceiptDate] = useState(
    new Date().toISOString().split('T')[0]
  );  

  // Handle error notifications from context
  useEffect(() => {
    if (error) {
      showSnackbar(error, "error");
    }
  }, [error, showSnackbar]);

  const resetForm = () => {
    setAmount("");
    setReceiptMethod("cash");
    setNote("");
    setIsValidAmount(true);
    setCustomerError(false);
  };

  const CustomerSearchInput = ({
    value,
    onChange,
    error,
    helperText,
  }) => {
    return (
      <Autocomplete
        value={value ? customers.find((c) => c._id === value) || null : null}
        onChange={(event, newValue) => {
          onChange(newValue?._id || "");
          setCustomerError(false);
        }}
        options={customers}
        getOptionLabel={(option) => option.name || ""}
        isOptionEqualToValue={(option, value) => option._id === value._id}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Customer"
            error={error || customerError}
            helperText={helperText || (customerError && "Please select a customer first")}
            fullWidth
          />
        )}
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="body1">{option.name}</Typography>
              {option.code && (
                <Typography variant="caption" color="text.secondary">
                  {option.code}
                </Typography>
              )}
            </Box>
          </Box>
        )}
        filterOptions={(options, { inputValue }) => {
          const filterValue = inputValue.toLowerCase();
          return options.filter(
            (option) =>
              option.name.toLowerCase().includes(filterValue) ||
              (option.code && option.code.toLowerCase().includes(filterValue))
          );
        }}
        fullWidth
      />
    );
  };

  const validateForm = () => {
    let isValid = true;

    if (!customer) {
      setCustomerError(true);
      // showSnackbar("Please select a customer first", "error");
      isValid = false;
    }

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setIsValidAmount(false);
      // showSnackbar("Please enter a valid amount", "error");
      isValid = false;
    }

    return isValid;
  };

  const handleAddReceipt = () => {
    if (!validateForm()) {
      return;
    }

    const newReceipt = {
      amount: parseFloat(amount),
      method: receiptMethod,
      date: receiptDate,
      note,
      customerId: customer,
    };

    const result = addReceipt(newReceipt);
    
    if (result.success) {
      resetForm();
    } else {
      showSnackbar(result.error, "error");
    }
  };

  const handleSubmitReceipts = async () => {
    if (!customer) {
      showSnackbar("Please select a customer", "error");
      return;
    }

    if (receipts.length === 0) {
      showSnackbar("Please add at least one receipt", "error");
      return;
    }

    const result = await submitReceipts(customer);
    
    if (result.success) {
      showSnackbar("Receipts submitted successfully", "success");
      setCustomer("");
    } else {
      showSnackbar(result.error, "error");
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Receipt Entry Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              New Receipt Entry
            </Typography>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <CustomerSearchInput
                value={customer}
                onChange={(newValue) => setCustomer(newValue)}
                error={customerError || (!customer && receipts.length > 0)}
                helperText={
                  customerError
                    ? "Please select a customer first"
                    : (!customer && receipts.length > 0 && "Please select a customer") ||
                      "Select the customer for the receipt"
                }
              />
            </FormControl>

            <TextField
              label="Date"
              type="date"
              value={receiptDate}
              onChange={(e) => setReceiptDate(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <TextField
                  label="Amount"
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setIsValidAmount(true);
                  }}
                  fullWidth
                  error={!isValidAmount}
                  helperText={!isValidAmount && "Amount must be a positive number"}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="method-label">Receipt Method</InputLabel>
                  <Select
                    labelId="method-label"
                    value={receiptMethod}
                    onChange={(e) => setReceiptMethod(e.target.value)}
                    label="Receipt Method"
                  >
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="upi">UPI</MenuItem>
                    <MenuItem value="card">Card</MenuItem>
                    <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <TextField
              label="Note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleAddReceipt}
              fullWidth
            >
              Add Receipt
            </Button>
          </Paper>
        </Grid>

        {/* Receipts List Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Receipts List
            </Typography>

            {receipts.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Customer</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Method</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {receipts.map((receipt, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {customers.find(c => c._id === customer)?.name || ''}
                        </TableCell>
                        <TableCell>{receipt.date}</TableCell>
                        <TableCell>₹{receipt.amount}</TableCell>
                        <TableCell>
                          {receipt.method.replace("_", " ").toUpperCase()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography color="textSecondary" align="center">
                No receipts added yet
              </Typography>
            )}

            {receipts.length > 0 && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSubmitReceipts}
                disabled={!customer}
                fullWidth
                sx={{ mt: 2 }}
              >
                Submit All Receipts
              </Button>
            )}
          </Paper>
        </Grid>
      </Grid>

      <SnackbarComponent />
    </Box>
  );
};

export default ReceiptPage;