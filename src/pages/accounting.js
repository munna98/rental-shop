import React, { useState } from "react";
import { 
  Box, 
  Grid, 
  Tabs, 
  Tab, 
  Typography, 
  useMediaQuery, 
  useTheme 
} from "@mui/material";
import Payment from "./accounting/payment";
import Receipt from "./accounting/receipt";
import Ledgers from "./accounting/ledgers";
import Transactions from "./accounting/transactionreports";
import Summary from "./accounting/summary";
import Balances from "./accounting/balances";
import Accounts from "./accounting/accounts";
import { AccountsProvider } from "@/context/AccountsContext";

const AccountingPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Define tabs with labels and corresponding components
  const tabs = [
    { label: "Payment", component: <Payment /> },
    { label: "Receipt", component: <Receipt /> },
    { label: "Accounts", component: <Accounts /> },
    { label: "Transactions", component: <Transactions /> },
    { label: "Summary", component: <Summary /> },
    { label: "Balances", component: <Balances /> }
  ];

  return (
    <AccountsProvider>
      <Box 
        sx={{ 
          padding: { xs: 2, sm: 3, md: 4 }, 
          maxWidth: 1200, 
          margin: "0 auto" 
        }}
      >
        <Box 
          sx={{ 
            display: "flex", 
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between", 
            alignItems: { xs: "flex-start", sm: "center" },
            marginBottom: 2 
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              marginBottom: { xs: 2, sm: 0 },
              width: { xs: "100%", sm: "auto" } 
            }}
          >
            Accounting
          </Typography>
        </Box>

        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons={isMobile}
          allowScrollButtonsMobile
          sx={{ 
            width: "100%",
            "& .MuiTabs-scrollButtons": {
              color: "primary.main"
            }
          }}
        >
          {tabs.map((tab, index) => (
            <Tab 
              key={tab.label} 
              label={tab.label} 
              sx={{ 
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                padding: { xs: "6px 12px", sm: "6px 16px" }
              }} 
            />
          ))}
        </Tabs>

        <Grid 
          container 
          spacing={{ xs: 1, sm: 2, md: 3 }} 
          sx={{ marginTop: { xs: 1, sm: 2 } }}
        >
          <Grid item xs={12}>
            {tabs[activeTab].component}
          </Grid>
        </Grid>
      </Box>
    </AccountsProvider>
  );
};

export default AccountingPage;