import { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { authService } from '../services';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        // Set user from localStorage first for immediate UI
        setUser(currentUser);
        
        // Then refresh from server to get latest data (role changes, etc.)
        try {
          const response = await authService.getMe();
          setUser(response.user);
          if (import.meta.env.DEV) {
            console.log('User data refreshed from server:', response.user.role);
          }
        } catch (error) {
          if (import.meta.env.DEV) {
            console.error('Failed to refresh user data from server:', error);
          }
          // If refresh fails, keep the localStorage data but it might be stale
        }
      }
      setLoading(false);
    };
    
    initAuth();
  }, []);

  const signup = useCallback(async (userData) => {
    try {
      const response = await authService.signup(userData);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const isAuthenticated = useCallback(() => {
    return !!user;
  }, [user]);

  const hasRole = useCallback((...roles) => {
    return user && roles.includes(user.role);
  }, [user]);
  
  const updateProfile = useCallback(async (userData) => {
    try {
      const response = await authService.updateMe(userData);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const response = await authService.getMe();
      setUser(response.user);
      return response;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to refresh user data:', error);
      }
      throw error;
    }
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    signup,
    login,
    logout,
    isAuthenticated,
    hasRole,
    updateProfile,
    refreshUser
  }), [user, loading, signup, login, logout, isAuthenticated, hasRole, updateProfile, refreshUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
