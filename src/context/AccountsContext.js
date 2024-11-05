import React, { createContext, useContext, useState } from "react";

const AccountsContext = createContext();

export const AccountsProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [balances, setBalances] = useState({ totalIncome: 0, totalExpense: 0, netBalance: 0 });

  const addTransaction = (transaction) => {
    setTransactions((prev) => [...prev, transaction]);
    updateBalances(transaction);
  };

  const updateBalances = (transaction) => {
    let { totalIncome, totalExpense } = balances;
    if (transaction.type === "income") {
      totalIncome += transaction.amount;
    } else {
      totalExpense += transaction.amount;
    }
    setBalances({ totalIncome, totalExpense, netBalance: totalIncome - totalExpense });
  };

  return (
    <AccountsContext.Provider value={{ transactions, balances, addTransaction }}>
      {children}
    </AccountsContext.Provider>
  );
};

export const useAccounts = () => useContext(AccountsContext);
