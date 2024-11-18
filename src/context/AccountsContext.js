// context/AccountsContext.js
import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";

const AccountsContext = createContext();

export const AccountsProvider = ({ children }) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // Memoize fetchAccounts to prevent unnecessary re-renders
  const fetchAccounts = useCallback(async (force = false) => {
    // Skip fetching if already initialized and not forced
    if (initialized && !force) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/accounts");
      setAccounts(response.data.data);
      setInitialized(true);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to fetch accounts");
    } finally {
      setLoading(false);
    }
  }, [initialized]);

  const addAccount = async (account) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/accounts", account);
      setAccounts((prev) => [...prev, response.data.data]);
      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to add account";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateAccount = async (accountId, updatedAccount) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`/api/accounts/${accountId}`, updatedAccount);
      setAccounts((prev) =>
        prev.map((account) =>
          account._id === accountId ? response.data.data : account
        )
      );
      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to update account";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async (accountId) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/api/accounts/${accountId}`);
      setAccounts((prev) => prev.filter((account) => account._id !== accountId));
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to delete account";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    accounts,
    loading,
    error,
    initialized,
    fetchAccounts,
    addAccount,
    updateAccount,
    deleteAccount,
  };

  return (
    <AccountsContext.Provider value={value}>
      {children}
    </AccountsContext.Provider>
  );
};

export const useAccounts = () => {
  const context = useContext(AccountsContext);
  if (!context) {
    throw new Error("useAccounts must be used within an AccountsProvider");
  }
  return context;
};