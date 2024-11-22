import React, { useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useSnackbar } from "@/hooks/useSnackbar";
import { useReceipt } from "@/context/ReceiptContext";
import { ReceiptForm } from "@/components/accounts/transactions/ReceiptForm";
import { ReceiptList } from "@/components/accounts/transactions/ReceiptList";

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

  console.log(groupedReceipts,"groupedReceipts");
  console.log(receipts,"receipts");

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
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ReceiptForm
            selectedEntity={selectedEntity}
            setSelectedEntity={setSelectedEntity}
            entityError={entityError}
            setEntityError={setEntityError}
            entities={entities}
            amount={amount}
            setAmount={setAmount}
            isValidAmount={isValidAmount}
            setIsValidAmount={setIsValidAmount}
            receiptMethod={receiptMethod}
            setReceiptMethod={setReceiptMethod}
            note={note}
            setNote={setNote}
            receiptDate={receiptDate}
            setReceiptDate={setReceiptDate}
            handleAddReceipt={handleAddReceipt}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ReceiptList
            groupedReceipts={groupedReceipts}
            receipts={receipts}
            handleSubmitReceipts={handleSubmitReceipts}
          />
        </Grid>
      </Grid>
      
      <SnackbarComponent />
    </Box>
  );
};

export default ReceiptPage;