// Custom search hook (useSearchIitems.js)
import { useState, useMemo } from 'react';

export const useSearchIitems = (masterItems, subItems, itemType) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    if (itemType === "Master Items") {
      return masterItems.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query)
      );
    } else {
      return subItems.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query) ||
        item.master?.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
      );
    }
  }, [searchQuery, masterItems, subItems, itemType]);

  return {
    searchQuery,
    setSearchQuery,
    filteredItems
  };
};