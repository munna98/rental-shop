import React from "react";
import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useAccounts } from "@/context/AccountsContext";

const Transactions = () => {
  const { transactions } = useAccounts();

  return (
    <Box>
      <Typography variant="h6">Transactions</Typography>
      <List>
        {transactions.map((transaction) => (
          <ListItem key={transaction.id}>
            <ListItemText
              primary={`${transaction.type === "income" ? "Payment" : "Receipt"}: ${transaction.amount}`}
              secondary={`Date: ${transaction.date.toLocaleDateString()} | ${transaction.description}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Transactions;
