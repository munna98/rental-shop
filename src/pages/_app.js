import React, { useState, useMemo, useEffect } from "react";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import "../styles/global.css"; // Import global styles
import { lightTheme, darkTheme } from "../styles/theme"; // Import custom themes
import DashboardLayout from "../layouts/DashboardLayout"; // Import layout
import { ItemsProvider } from "@/context/ItemsContext";
import { InvoiceProvider } from "@/context/InvoiceContext"; // Import InvoiceProvider
import { LedgerProvider } from "@/context/LedgerContext";
import { AccountsProvider } from "@/context/AccountsContext";
import { ReceiptProvider } from "@/context/ReceiptContext";
import { RentalsProvider } from "@/context/RentalsContext";
import { PaymentProvider } from "@/context/PaymentContext";

function MyApp({ Component, pageProps }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Create the theme based on dark mode state
  const theme = useMemo(
    () => createTheme(isDarkMode ? darkTheme : lightTheme),
    [isDarkMode]
  );

  // Handle toggling between dark and light modes
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
    console.log(`Dark mode is now: ${!isDarkMode}`); // Debug log
  };

  // On initial load, set the correct mode class
  useEffect(() => {
    document.documentElement.classList.toggle("dark-mode", isDarkMode);
    document.documentElement.classList.toggle("light-mode", !isDarkMode);
  }, [isDarkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ItemsProvider>
        <InvoiceProvider>
          <RentalsProvider>
            <LedgerProvider>
              <ReceiptProvider>
                <PaymentProvider>
                  <AccountsProvider>
                    <DashboardLayout
                      toggleTheme={toggleTheme}
                      isDarkMode={isDarkMode}
                    >
                      <Component {...pageProps} />
                    </DashboardLayout>
                  </AccountsProvider>
                </PaymentProvider>
              </ReceiptProvider>
            </LedgerProvider>
          </RentalsProvider>
        </InvoiceProvider>
      </ItemsProvider>
    </ThemeProvider>
  );
}

export default MyApp;
