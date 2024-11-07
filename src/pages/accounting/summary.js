import React from "react";
import { Box, Typography } from "@mui/material";
import { useAccounts } from "@/context/AccountsContext";

const Summary = () => {
  const { balances } = useAccounts();

  return (
    <Box>
      <Typography variant="h6">Summary</Typography>
      <Typography>Income: {balances.totalIncome}</Typography>
      <Typography>Expenses: {balances.totalExpense}</Typography>
      <Typography>Net Balance: {balances.netBalance}</Typography>
    </Box>
  );
};

export default Summary;
