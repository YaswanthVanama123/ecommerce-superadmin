import { createContext, useState, useContext, useEffect } from 'react';
import { login as loginAPI } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('superadmin_token');
    const userData = localStorage.getItem('superadmin_user');

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('superadmin_token');
        localStorage.removeItem('superadmin_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await loginAPI({ email, password });

      if (response.token && response.user) {
        // Check if user has admin or superadmin role
        if (response.user.role === 'admin' || response.user.role === 'superadmin') {
          localStorage.setItem('superadmin_token', response.token);
          localStorage.setItem('superadmin_user', JSON.stringify(response.user));
          setUser(response.user);
          return { success: true };
        } else {
          return { success: false, message: 'Access denied. Admin privileges required.' };
        }
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('superadmin_token');
    localStorage.removeItem('superadmin_user');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isSuperAdmin: user?.role === 'superadmin',
    isAdmin: user?.role === 'admin' || user?.role === 'superadmin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
