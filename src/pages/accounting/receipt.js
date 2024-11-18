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
  Autocomplete,
  Chip
} from "@mui/material";
import { useSnackbar } from "@/hooks/useSnackbar";
import { useReceipt } from "@/context/ReceiptContext";
import { useAccounts } from "@/context/AccountsContext";

const ReceiptPage = () => {
  const { showSnackbar, SnackbarComponent } = useSnackbar();
  const { customers, receipts, loading: receiptLoading, error, addReceipt, submitReceipts } = useReceipt();
  const { accounts, loading: accountsLoading } = useAccounts();

  // Local form state
  const [amount, setAmount] = useState("");
  const [receiptMethod, setReceiptMethod] = useState("cash");
  const [note, setNote] = useState("");
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [isValidAmount, setIsValidAmount] = useState(true);
  const [entityError, setEntityError] = useState(false);
  const [receiptDate, setReceiptDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  // Combine customers and accounts into a single array with type identification
  const entities = [
    ...customers.map(customer => ({
      ...customer,
      entityType: 'customer',
      displayType: 'Customer',
      searchLabel: customer.name
    })),
    ...accounts.map(account => ({
      ...account,
      entityType: 'account',
      displayType: `Account (${account.type})`,
      searchLabel: `${account.name} - ${account.category}`
    }))
  ];

  const resetForm = () => {
    setAmount("");
    setReceiptMethod("cash");
    setNote("");
    setIsValidAmount(true);
    setEntityError(false);
    setSelectedEntity(null);
  };

  const EntitySearchInput = () => {
    return (
      <Autocomplete
        value={selectedEntity}
        onChange={(event, newValue) => {
          setSelectedEntity(newValue);
          setEntityError(false);
        }}
        options={entities}
        getOptionLabel={(option) => option.searchLabel || ""}
        groupBy={(option) => option.entityType}
        isOptionEqualToValue={(option, value) => 
          option._id === value._id && option.entityType === value.entityType
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Customer or Account"
            error={entityError}
            helperText={entityError ? "Please select a customer or account" : ""}
            fullWidth
          />
        )}
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="body1">{option.name}</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip 
                  label={option.displayType}
                  size="small"
                  color={option.entityType === 'customer' ? 'primary' : 'secondary'}
                />
                {option.entityType === 'account' && (
                  <Typography variant="caption" color="text.secondary">
                    {option.category}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        )}
        filterOptions={(options, { inputValue }) => {
          const filterValue = inputValue.toLowerCase();
          return options.filter(
            (option) =>
              option.name.toLowerCase().includes(filterValue) ||
              (option.category && option.category.toLowerCase().includes(filterValue)) ||
              (option.type && option.type.toLowerCase().includes(filterValue))
          );
        }}
        fullWidth
      />
    );
  };

  const validateForm = () => {
    let isValid = true;

    if (!selectedEntity) {
      setEntityError(true);
      isValid = false;
    }

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setIsValidAmount(false);
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
      entityType: selectedEntity.entityType,
      entityId: selectedEntity._id,
      entityName: selectedEntity.name,
      entityDetails: selectedEntity.entityType === 'account' ? {
        type: selectedEntity.type,
        category: selectedEntity.category
      } : null
    };

    const result = addReceipt(newReceipt);
    
    if (result.success) {
      resetForm();
    } else {
      showSnackbar(result.error, "error");
    }
  };

  const handleSubmitReceipts = async () => {
    if (!selectedEntity) {
      showSnackbar("Please select a customer or account", "error");
      return;
    }

    if (receipts.length === 0) {
      showSnackbar("Please add at least one receipt", "error");
      return;
    }

    const result = await submitReceipts(selectedEntity._id, selectedEntity.entityType);
    
    if (result.success) {
      showSnackbar("Receipts submitted successfully", "success");
      resetForm();
    } else {
      showSnackbar(result.error, "error");
    }
  };

  if (receiptLoading || accountsLoading) {
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
              <EntitySearchInput />
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
                      <TableCell>Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Method</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {receipts.map((receipt, index) => (
                      <TableRow key={index}>
                        <TableCell>{receipt.entityName}</TableCell>
                        <TableCell>
                          <Chip 
                            label={receipt.entityType === 'customer' ? 'Customer' : `Account (${receipt.entityDetails?.type})`}
                            size="small"
                            color={receipt.entityType === 'customer' ? 'primary' : 'secondary'}
                          />
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
                disabled={!selectedEntity}
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