import React, { createContext, useContext, useState } from "react";

// Create a context for accounts
const AccountsContext = createContext();

// AccountsProvider to wrap your app and provide context
export const AccountsProvider = ({ children }) => {
  const [accounts, setAccounts] = useState([]); // List of accounts (e.g., Rent, Commission)
  const [transactions, setTransactions] = useState([]); // Transactions (income/expense)
  const [balances, setBalances] = useState({ totalIncome: 0, totalExpense: 0, netBalance: 0 });

  // Add a new account
  const addAccount = (account) => {
    setAccounts((prev) => [...prev, account]);
  };

  // Add a new transaction (income or expense)
  const addTransaction = (transaction) => {
    setTransactions((prev) => [...prev, transaction]);
    updateBalances(transaction); // Update balances after each transaction
  };

  // Update the balances based on transaction type (income or expense)
  const updateBalances = (transaction) => {
    let { totalIncome, totalExpense } = balances;
    if (transaction.type === "income") {
      totalIncome += transaction.amount;
    } else if (transaction.type === "expense") {
      totalExpense += transaction.amount;
    }
    setBalances({ totalIncome, totalExpense, netBalance: totalIncome - totalExpense });
  };

  return (
    <AccountsContext.Provider value={{ accounts, transactions, balances, addAccount, addTransaction }}>
      {children}
    </AccountsContext.Provider>
  );
};

// Custom hook to use AccountsContext
export const useAccounts = () => useContext(AccountsContext);
