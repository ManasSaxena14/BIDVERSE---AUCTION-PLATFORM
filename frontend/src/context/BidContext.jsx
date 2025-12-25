import { createContext, useState, useContext } from 'react';
import { bidService } from '../services';

const BidContext = createContext();

export const useBids = () => {
  const context = useContext(BidContext);
  if (!context) {
    throw new Error('useBids must be used within BidProvider');
  }
  return context;
};

export const BidProvider = ({ children }) => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBids = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      
      const response = await bidService.getBids({ ...params, limit: 1000, sort: 'amount_desc' });
      setBids(response.bids);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bids');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createBid = async (bidData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await bidService.createBid(bidData);
      setBids([response.bid, ...bids]);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place bid');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBid = async (id, bidData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await bidService.updateBid(id, bidData);
      setBids(bids.map(bid => bid._id === id ? response.bid : bid));
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update bid');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBid = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await bidService.deleteBid(id);
      setBids(bids.filter(bid => bid._id !== id));
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete bid');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    bids,
    loading,
    error,
    fetchBids,
    createBid,
    updateBid,
    deleteBid
  };

  return <BidContext.Provider value={value}>{children}</BidContext.Provider>;
};
