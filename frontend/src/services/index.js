import api from './api';

// Auth services
export const authService = {
  // Signup
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Get user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  // Update current user
  updateMe: async (userData) => {
    const response = await api.put('/auth/me', userData);
    // Update user in localStorage
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  }
};

// Auction Item services
export const itemService = {
  // Get all items with filters
  getItems: async (params = {}) => {
    const response = await api.get('/items', { params });
    return response.data;
  },

  // Get single item
  getItemById: async (id) => {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },

  // Create item
  createItem: async (itemData) => {
    const response = await api.post('/items', itemData);
    return response.data;
  },

  // Update item
  updateItem: async (id, itemData) => {
    const response = await api.put(`/items/${id}`, itemData);
    return response.data;
  },

  // Delete item
  deleteItem: async (id) => {
    const response = await api.delete(`/items/${id}`);
    return response.data;
  }
};

// Bid services
export const bidService = {
  // Get all bids
  getBids: async (params = {}) => {
    const response = await api.get('/bids', { params });
    return response.data;
  },

  // Get single bid
  getBidById: async (id) => {
    const response = await api.get(`/bids/${id}`);
    return response.data;
  },

  // Create bid
  createBid: async (bidData) => {
    const response = await api.post('/bids', bidData);
    return response.data;
  },

  // Update bid
  updateBid: async (id, bidData) => {
    const response = await api.put(`/bids/${id}`, bidData);
    return response.data;
  },

  // Delete bid
  deleteBid: async (id) => {
    const response = await api.delete(`/bids/${id}`);
    return response.data;
  }
};

// Review services
export const reviewService = {
  // Create review
  createReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  // Delete review
  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  }
};
