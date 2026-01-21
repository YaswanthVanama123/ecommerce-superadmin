import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('superadmin_token');
    const userData = localStorage.getItem('superadmin_user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);

        // Validate that user has superadmin role
        if (parsedUser.role === 'superadmin') {
          setUser(parsedUser);
        } else {
          // User doesn't have superadmin role, clear storage
          localStorage.removeItem('superadmin_token');
          localStorage.removeItem('superadmin_user');
          toast.error('Access denied. Superadmin privileges required.');
        }
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
      setLoading(true);
      console.log('[AuthContext] Making login API call...');
      const response = await authAPI.login({ email, password });
      console.log('[AuthContext] Login API response:', response);

      // Backend sends: { success: true, data: { user, accessToken, refreshToken } }
      if (response.success && response.data?.accessToken && response.data?.user) {
        const { user, accessToken } = response.data;
        console.log('[AuthContext] User data:', user);
        console.log('[AuthContext] User role:', user.role);

        // Check if user has superadmin role
        if (user.role === 'superadmin') {
          console.log('[AuthContext] User is superadmin, storing credentials...');
          localStorage.setItem('superadmin_token', accessToken);
          localStorage.setItem('superadmin_user', JSON.stringify(user));
          setUser(user);
          console.log('[AuthContext] User state updated');

          toast.success('Login successful!', {
            position: 'top-right',
            autoClose: 2000,
          });

          return { success: true, user };
        } else {
          console.log('[AuthContext] User is not superadmin, role:', user.role);
          toast.error('Access denied. Superadmin privileges required.', {
            position: 'top-right',
            autoClose: 3000,
          });
          return {
            success: false,
            message: 'Access denied. Superadmin privileges required.'
          };
        }
      }

      console.log('[AuthContext] Invalid response structure');
      return {
        success: false,
        message: response.message || 'Invalid response from server'
      };
    } catch (error) {
      console.error('[AuthContext] Login error:', error);
      console.error('[AuthContext] Error response:', error.response?.data);

      const errorMessage = error.response?.data?.message ||
                          error.message ||
                          'Login failed. Please try again.';

      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
      });

      return {
        success: false,
        message: errorMessage
      };
    } finally {
      console.log('[AuthContext] Setting loading to false');
      setLoading(false);
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);

    toast.info('Logged out successfully', {
      position: 'top-right',
      autoClose: 2000,
    });

    navigate('/login');
  };

  const updateProfile = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('superadmin_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    logout,
    updateProfile,
    loading,
    isAuthenticated: !!user,
    isSuperAdmin: user?.role === 'superadmin',
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
