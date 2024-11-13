import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create the context
const AccountsContext = createContext();

// Provider component for accounts
export const AccountsProvider = ({ children }) => {
  // Initialize accounts as an empty array to avoid "not iterable" errors
  const [accounts, setAccounts] = useState([]);

  // Fetch accounts from the API
  const fetchAccounts = async () => {
    try {
      const response = await axios.get("/api/accounts");
      setAccounts(response.data); // Update accounts state with fetched data
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  // Fetch accounts on component mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  // Add a new account and update the context
  const addAccount = async (account) => {
    try {
      const response = await axios.post("/api/accounts", account);
      setAccounts((prev) => [...prev, response.data]); // Append new account to the existing accounts list
    } catch (error) {
      console.error("Error adding account:", error);
    }
  };

  // Update an existing account
  const updateAccount = async (accountId, updatedAccount) => {
    try {
      const response = await axios.put(`/api/accounts/${accountId}`, updatedAccount);
      setAccounts((prev) =>
        prev.map((account) =>
          account._id === accountId ? response.data : account
        )
      );
    } catch (error) {
      console.error("Error updating account:", error);
    }
  };

  // Delete an account
  const deleteAccount = async (accountId) => {
    try {
      await axios.delete(`/api/accounts/${accountId}`);
      setAccounts((prev) => prev.filter((account) => account._id !== accountId)); // Remove the deleted account from the list
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  // Provide context values
  return (
    <AccountsContext.Provider
      value={{
        accounts,
        fetchAccounts,
        addAccount,
        updateAccount,
        deleteAccount,
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
};

// Custom hook to use the AccountsContext
export const useAccounts = () => useContext(AccountsContext);
