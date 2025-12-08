import { createContext, useState, useContext } from 'react';
import { reviewService } from '../services';

const ReviewContext = createContext();

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReviews must be used within ReviewProvider');
  }
  return context;
};

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createReview = async (reviewData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reviewService.createReview(reviewData);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create review');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reviewService.deleteReview(id);
      setReviews(reviews.filter(review => review._id !== id));
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete review');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    reviews,
    loading,
    error,
    createReview,
    deleteReview
  };

  return (
    <ReviewContext.Provider value={value}>
      {children}
    </ReviewContext.Provider>
  );
};