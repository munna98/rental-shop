// src/contexts/RentalsContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useSnackbar } from '@/hooks/useSnackbar';

const DELIVERY_STATUSES = {
    PENDING: 'Pending Delivery',
    DELIVERED: 'Delivered',
    YET_TO_DELIVER: 'Yet to Deliver'
  };

const RentalsContext = createContext();

export const useRentals = () => {
  const context = useContext(RentalsContext);
  if (!context) {
    throw new Error('useRentals must be used within a RentalsProvider');
  }
  return context;
};

export const RentalsProvider = ({ children }) => {
  const [rentedItems, setRentedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({
    totalRented: 0,
    returningSoon: 0,
    overdue: 0,
  });
  const { showSnackbar } = useSnackbar();

  const fetchRentedItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/invoices?status=rented');
      const invoices = await response.json();

      const items = invoices.flatMap(invoice => 
        invoice.items
          .filter(item => item.item.status === 'Rented')
          .map(item => ({
            id: item.item._id,
            customer: invoice.customer.name,
            item: item.item.name,
            code: item.item.code,
            deliveryDate: new Date(invoice.deliveryDate).toISOString().split('T')[0],
            weddingDate: new Date(invoice.weddingDate).toISOString().split('T')[0],
            deliveryStatus: item.item.deliveryStatus || DELIVERY_STATUSES.PENDING,
            invoiceId: invoice._id,
            invoiceNumber: invoice.invoiceNumber,
          }))
      );

      const today = new Date();
      const stats = {
        totalRented: items.length,
        returningSoon: items.filter(item => {
          const deliveryDate = new Date(item.deliveryDate);
          const daysUntilReturn = Math.ceil((deliveryDate - today) / (1000 * 60 * 60 * 24));
          return daysUntilReturn <= 7 && daysUntilReturn > 0;
        }).length,
        overdue: items.filter(item => 
          new Date(item.deliveryDate) < today && 
          item.deliveryStatus === DELIVERY_STATUSES.DELIVERED
        ).length,
      };

      setRentedItems(items);
      setStats(stats);
    } catch (error) {
      console.error('Error fetching rented items:', error);
      showSnackbar('Error fetching rental data', 'error');
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  const handleReturn = async (item) => {
    try {
      const getResponse = await fetch(`/api/sub-items/${item.id}`);
      if (!getResponse.ok) {
        throw new Error('Failed to fetch item details');
      }
      const currentItem = await getResponse.json();

      const updateResponse = await fetch(`/api/sub-items/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...currentItem,
          status: 'Available'
        }),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update item status');
      }
      showSnackbar('Item returned successfully', 'success');
      fetchRentedItems();
    } catch (error) {
      console.error('Error returning item:', error);
      showSnackbar(error.message || 'Error returning item', 'error');
    }
  };

  const handleDeliveryStatusChange = async (item, newStatus) => {
    try {
      const response = await fetch(`/api/invoices/${item.invoiceId}/items/${item.id}/delivery-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deliveryStatus: newStatus
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update delivery status');
      }

      showSnackbar('Delivery status updated successfully', 'success');
      fetchRentedItems();
    } catch (error) {
      console.error('Error updating delivery status:', error);
      showSnackbar(error.message || 'Error updating delivery status', 'error');
    }
  };

  const getFilteredItems = useCallback(() => {
    return rentedItems.filter(item => {
      const matchesSearch = 
        item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase());

      const today = new Date();
      const deliveryDate = new Date(item.deliveryDate);
      const daysUntilReturn = Math.ceil((deliveryDate - today) / (1000 * 60 * 60 * 24));

      if (filterStatus === 'returningSoon') {
        return matchesSearch && daysUntilReturn <= 7 && daysUntilReturn > 0;
      } else if (filterStatus === 'overdue') {
        return matchesSearch && 
               deliveryDate < today && 
               item.deliveryStatus === DELIVERY_STATUSES.DELIVERED;
      } else if (filterStatus === 'pending') {
        return matchesSearch && item.deliveryStatus === DELIVERY_STATUSES.PENDING;
      } else if (filterStatus === 'delivered') {
        return matchesSearch && item.deliveryStatus === DELIVERY_STATUSES.DELIVERED;
      }
      return matchesSearch;
    });
  }, [rentedItems, searchTerm, filterStatus]);

  const value = {
    rentedItems,
    loading,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    stats,
    fetchRentedItems,
    handleReturn,
    handleDeliveryStatusChange,
    getFilteredItems,
  };

  return (
    <RentalsContext.Provider value={value}>
      {children}
    </RentalsContext.Provider>
  );
};