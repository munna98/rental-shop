import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ItemsContext = createContext();

export const ItemsProvider = ({ children }) => {
  const [itemType, setItemType] = useState("Master Items");
  const [masterItems, setMasterItems] = useState([]);
  const [subItems, setSubItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMasterItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/master-items');
      setMasterItems(response.data);
    } catch (error) {
      console.error("Error fetching master items:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/sub-items');
      setSubItems(response.data);
    } catch (error) {
      console.error("Error fetching sub items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterItems();
    fetchSubItems();
  }, []);

  return (
    <ItemsContext.Provider
      value={{
        itemType,
        setItemType,
        masterItems,
        subItems,
        fetchMasterItems,
        fetchSubItems,
        loading,
      }}
    >
      {children}
    </ItemsContext.Provider>
  );
};

export const useItems = () => {
  return useContext(ItemsContext);
};
