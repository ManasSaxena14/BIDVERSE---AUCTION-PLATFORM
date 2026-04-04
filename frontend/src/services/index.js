import api from './api';


export const authService = {

  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },


  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },


  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },


  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },


  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },


  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },


  updateMe: async (userData) => {
    const response = await api.put('/auth/me', userData);

    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  }
};


export const itemService = {

  getItems: async (params = {}) => {
    const response = await api.get('/items', { params });
    return response.data;
  },


  getItemById: async (id) => {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },


  createItem: async (itemData) => {
    const response = await api.post('/items', itemData);
    return response.data;
  },


  updateItem: async (id, itemData) => {
    const response = await api.put(`/items/${id}`, itemData);
    return response.data;
  },


  deleteItem: async (id) => {
    const response = await api.delete(`/items/${id}`);
    return response.data;
  }
};


export const bidService = {

  getBids: async (params = {}) => {
    const response = await api.get('/bids', { params });
    return response.data;
  },


  getBidById: async (id) => {
    const response = await api.get(`/bids/${id}`);
    return response.data;
  },


  createBid: async (bidData) => {
    const response = await api.post('/bids', bidData);
    return response.data;
  },


  updateBid: async (id, bidData) => {
    const response = await api.put(`/bids/${id}`, bidData);
    return response.data;
  },

  deleteBid: async (id) => {
    const response = await api.delete(`/bids/${id}`);
    return response.data;
  }
};

export const reviewService = {
  createReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  getReviewsByAuction: async (auctionId) => {
    const response = await api.get(`/reviews/auction/${auctionId}`);
    return response.data;
  },

  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  }
};

export const adminService = {
  getStats: async () => {
    const response = await api.get('/superadmin/stats');
    return response.data;
  },

  getActivities: async (limit = 20) => {
    const response = await api.get('/superadmin/activities', { params: { limit } });
    return response.data;
  },

  getAllUsers: async (params = {}) => {
    const response = await api.get('/superadmin/users', { params });
    return response.data;
  },

  updateUserRole: async (id, role) => {
    const response = await api.put(`/superadmin/users/${id}/role`, { role });
    return response.data;
  },

  toggleUserStatus: async (id) => {
    const response = await api.put(`/superadmin/users/${id}/status`);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/superadmin/users/${id}`);
    return response.data;
  },

  forceDeleteItem: async (id) => {
    const response = await api.delete(`/superadmin/items/${id}`);
    return response.data;
  },

  forceDeleteBid: async (id) => {
    const response = await api.delete(`/superadmin/bids/${id}`);
    return response.data;
  }
};
