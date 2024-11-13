import React from "react";
import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useAccounts } from "@/context/AccountsContext";

const Overview = () => {
  const { overviews } = useAccounts();

  return (
    <Box>
      <Typography variant="h6">Overview</Typography>
      <List>
        {overviews.map((overview) => (
          <ListItem key={overview.id}>
            <ListItemText
              primary={`${overview.type === "income" ? "Payment" : "Receipt"}: ${overview.amount}`}
              secondary={`Date: ${overview.date.toLocaleDateString()} | ${overview.description}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Overview;
