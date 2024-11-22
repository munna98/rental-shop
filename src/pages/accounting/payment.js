import React, { useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useSnackbar } from "@/hooks/useSnackbar";
import { usePayment } from "@/context/PaymentContext";
import { PaymentForm } from "@/components/accounts/transactions/PaymentForm";
import { PaymentList } from "@/components/accounts/transactions/PaymentList";

const PaymentPage = () => {
  const { showSnackbar, SnackbarComponent } = useSnackbar();
  const { 
    customers, 
    accounts,
    payments, 
    loading, 
    error, 
    addPayment, 
    submitPayments 
  } = usePayment();

  // Local form state
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [note, setNote] = useState("");
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [isValidAmount, setIsValidAmount] = useState(true);
  const [entityError, setEntityError] = useState(false);
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  // Group payments by entity
  // const groupedPayments = payments?.reduce((groups, payment) => {
  //   const key = `${payment.entityType}-${payment.entityId}`;
  //   if (!groups[key]) {
  //     groups[key] = [];
  //   }
  //   groups[key].push(payment);
  //   return groups;
    
  // }, {});
  const groupedPayments = payments?.reduce((groups, payment) => {
    const key = `${payment.entityType}-${payment.entityId}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(payment);
    return groups;
  }, {}) || {};
  
  console.log(groupedPayments,"groupedPayments");
  console.log(payments,"payments");

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
    setPaymentMethod("cash");
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

  const handleAddPayment = () => {
    if (!validateForm()) {
      return;
    }

    const newPayment = {
      amount: parseFloat(amount),
      method: paymentMethod,
      date: paymentDate,
      note,
      entityType: selectedEntity.entityType,
      entityId: selectedEntity._id,
      entityName: selectedEntity.name,
      entityDetails: selectedEntity.entityType === 'account' ? {
        type: selectedEntity.type,
        category: selectedEntity.category
      } : null
    };
    console.log("clicked on add payment",newPayment);
    
    const result = addPayment(newPayment);
    console.log("result",result);
    
    if (result.success) {
      resetForm();
    } else {
      showSnackbar(result.error, "error");
    }
  };

  const handleSubmitPayments = async () => {
    if (payments.length === 0) {
      showSnackbar("Please add at least one payment", "error");
      return;
    }
  
    let hasError = false;
    for (const [key, groupPayments] of Object.entries(groupedPayments)) {
      const entityId = groupPayments[0].entityId;
      const entityType = groupPayments[0].entityType;
      
      const result = await submitPayments(entityId, entityType);
      
      if (!result.success) {
        hasError = true;
        showSnackbar(`Error submitting payments for ${groupPayments[0].entityName}: ${result.error}`, "error");
      }
    }
  
    if (!hasError) {
      showSnackbar("All payments submitted successfully", "success");
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
          <PaymentForm
            selectedEntity={selectedEntity}
            setSelectedEntity={setSelectedEntity}
            entityError={entityError}
            setEntityError={setEntityError}
            entities={entities}
            amount={amount}
            setAmount={setAmount}
            isValidAmount={isValidAmount}
            setIsValidAmount={setIsValidAmount}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            note={note}
            setNote={setNote}
            paymentDate={paymentDate}
            setPaymentDate={setPaymentDate}
            handleAddPayment={handleAddPayment}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <PaymentList
            groupedPayments={groupedPayments}
            payments={payments}
            handleSubmitPayments={handleSubmitPayments}
          />
        </Grid>
      </Grid>
      
      <SnackbarComponent />
    </Box>
  );
};

export default PaymentPage;