import { createContext, useState, useContext } from 'react';
import { itemService } from '../services';

const ItemContext = createContext();

export const useItems = () => {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error('useItems must be used within ItemProvider');
  }
  return context;
};

export const ItemProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchItems = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await itemService.getItems(params);
      setItems(response.items);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch items');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchItemById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await itemService.getItemById(id);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (itemData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await itemService.createItem(itemData);
      setItems([response.item, ...items]);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (id, itemData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await itemService.updateItem(id, itemData);
      setItems(items.map(item => item._id === id ? response.item : item));
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await itemService.deleteItem(id);
      setItems(items.filter(item => item._id !== id));
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    items,
    loading,
    error,
    fetchItems,
    fetchItemById,
    createItem,
    updateItem,
    deleteItem
  };

  return <ItemContext.Provider value={value}>{children}</ItemContext.Provider>;
};