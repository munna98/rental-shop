import React from "react";
import { Box, Typography } from "@mui/material";
import { useAccounts } from "@/context/AccountsContext";

const Balances = () => {
  const { balances } = useAccounts();

  return (
    <Box>
      <Typography variant="h6">Balances</Typography>
      {/* <Typography>Total Income: {balances.totalIncome}</Typography>
      <Typography>Total Expense: {balances.totalExpense}</Typography>
      <Typography>Net Balance: {balances.netBalance}</Typography> */}
    </Box>
  );
};

export default Balances;
