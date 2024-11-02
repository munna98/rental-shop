// src/context/ItemsContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ItemsContext = createContext();

export const ItemsProvider = ({ children }) => {
  const [itemType, setItemType] = useState("Master Items");
  const [masterItems, setMasterItems] = useState([]);
  const [subItems, setSubItems] = useState([]);

  const fetchMasterItems = async () => {
    try {
      const response = await axios.get('/api/master-items');
      setMasterItems(response.data);
    } catch (error) {
      console.error("Error fetching master items:", error);
    }
  };

  const fetchSubItems = async () => {
    try {
      const response = await axios.get('/api/sub-items');
      setSubItems(response.data);
    } catch (error) {
      console.error("Error fetching sub items:", error);
    }
  };

  useEffect(() => {
    fetchMasterItems();
    fetchSubItems(); // Add this line to fetch sub items on initial load
  }, []);
  
  return (
    <ItemsContext.Provider value={{ itemType, setItemType, masterItems, subItems, fetchMasterItems, fetchSubItems }}>
      {children}
    </ItemsContext.Provider>
  );
};

export const useItems = () => {
  return useContext(ItemsContext);
};
