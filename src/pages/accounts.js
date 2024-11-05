import React, { useState } from "react";
import { Box, Grid, Tabs, Tab, Typography } from "@mui/material";
import Payment from "./accounts/payment";
import Receipt from "./accounts/receipt";
import Transactions from "./accounts/transactions";
import Summary from "./accounts/summary";
import Balances from "./accounts/balances";
import { AccountsProvider } from "@/context/AccountsContext";

const AccountingPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <AccountsProvider>
      <Box sx={{ padding: 4, maxWidth: 1200, margin: "0 auto" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
          <Typography variant="h4">Accounts</Typography>
        </Box>

        <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
          <Tab label="Payment" />
          <Tab label="Receipt" />
          <Tab label="Transactions" />
          <Tab label="Summary" />
          <Tab label="Balances" />
        </Tabs>

        <Grid container spacing={3} sx={{ marginTop: 2 }}>
          <Grid item xs={12}>
            {activeTab === 0 && <Payment />}
            {activeTab === 1 && <Receipt />}
            {activeTab === 2 && <Transactions />}
            {activeTab === 3 && <Summary />}
            {activeTab === 4 && <Balances />}
          </Grid>
        </Grid>
      </Box>
    </AccountsProvider>
  );
};

export default AccountingPage;
