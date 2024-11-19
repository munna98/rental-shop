import React, { useState } from "react";
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

const ReceiptPage = () => {
  const { showSnackbar, SnackbarComponent } = useSnackbar();
  const { 
    customers, 
    accounts,
    receipts, 
    loading, 
    error, 
    addReceipt, 
    submitReceipts 
  } = useReceipt();

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

  // Group receipts by entity
  const groupedReceipts = receipts.reduce((groups, receipt) => {
    const key = `${receipt.entityType}-${receipt.entityId}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(receipt);
    return groups;
  }, {});

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
    if (receipts.length === 0) {
      showSnackbar("Please add at least one receipt", "error");
      return;
    }
  
    let hasError = false;
    for (const [key, groupReceipts] of Object.entries(groupedReceipts)) {
      const entityId = groupReceipts[0].entityId;
      const entityType = groupReceipts[0].entityType;
      
      const result = await submitReceipts(entityId, entityType);
      
      if (!result.success) {
        hasError = true;
        showSnackbar(`Error submitting receipts for ${groupReceipts[0].entityName}: ${result.error}`, "error");
      }
    }
  
    if (!hasError) {
      showSnackbar("All receipts submitted successfully", "success");
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
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
              Pending Receipts
            </Typography>
            
            {Object.entries(groupedReceipts).map(([key, groupReceipts]) => (
              <Box key={key} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                    {groupReceipts[0].entityName}
                  </Typography>
                  <Chip 
                    label={groupReceipts[0].entityType === 'customer' ? 'Customer' : 'Account'}
                    color={groupReceipts[0].entityType === 'customer' ? 'primary' : 'secondary'}
                    size="small"
                  />
                </Box>
                
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell>Method</TableCell>
                        <TableCell>Note</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {groupReceipts.map((receipt, index) => (
                        <TableRow key={index}>
                          <TableCell>{receipt.date}</TableCell>
                          <TableCell align="right">
                            {receipt.amount.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {receipt.method.charAt(0).toUpperCase() + 
                             receipt.method.slice(1).replace('_', ' ')}
                          </TableCell>
                          <TableCell>{receipt.note}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={1}><strong>Total</strong></TableCell>
                        <TableCell align="right">
                          <strong>
                            {groupReceipts
                              .reduce((sum, receipt) => sum + receipt.amount, 0)
                              .toFixed(2)}
                          </strong>
                        </TableCell>
                        <TableCell colSpan={2} />
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            ))}

            {receipts.length > 0 && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitReceipts}
                fullWidth
              >
                Submit All Receipts
              </Button>
            )}

            {receipts.length === 0 && (
              <Typography color="text.secondary" align="center">
                No pending receipts
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      <SnackbarComponent />
    </Box>
  );
};

export default ReceiptPage;