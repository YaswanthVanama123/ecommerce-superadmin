import axiosInstance from './axiosConfig';

// Auth APIs
export const login = async (credentials) => {
  const response = await axiosInstance.post('/admin/login', credentials);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('superadmin_token');
  localStorage.removeItem('superadmin_user');
};

// Dashboard APIs
export const getDashboardStats = async () => {
  const response = await axiosInstance.get('/admin/dashboard/stats');
  return response.data;
};

export const getSalesData = async (startDate, endDate) => {
  const response = await axiosInstance.get('/admin/dashboard/sales', {
    params: { startDate, endDate }
  });
  return response.data;
};

export const getUserGrowthData = async () => {
  const response = await axiosInstance.get('/admin/dashboard/user-growth');
  return response.data;
};

// Product APIs
export const getProducts = async (page = 1, limit = 10, search = '') => {
  const response = await axiosInstance.get('/admin/products', {
    params: { page, limit, search }
  });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await axiosInstance.get(`/admin/products/${id}`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await axiosInstance.post('/admin/products', productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await axiosInstance.put(`/admin/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axiosInstance.delete(`/admin/products/${id}`);
  return response.data;
};

export const uploadProductImage = async (formData) => {
  const response = await axiosInstance.post('/admin/products/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Category APIs
export const getCategories = async () => {
  const response = await axiosInstance.get('/admin/categories');
  return response.data;
};

export const createCategory = async (categoryData) => {
  const response = await axiosInstance.post('/admin/categories', categoryData);
  return response.data;
};

export const updateCategory = async (id, categoryData) => {
  const response = await axiosInstance.put(`/admin/categories/${id}`, categoryData);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await axiosInstance.delete(`/admin/categories/${id}`);
  return response.data;
};

// Order APIs
export const getOrders = async (page = 1, limit = 10, status = '') => {
  const response = await axiosInstance.get('/admin/orders', {
    params: { page, limit, status }
  });
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await axiosInstance.get(`/admin/orders/${id}`);
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await axiosInstance.put(`/admin/orders/${id}/status`, { status });
  return response.data;
};

// User Management APIs (SuperAdmin only)
export const getUsers = async (page = 1, limit = 10, search = '') => {
  const response = await axiosInstance.get('/admin/users', {
    params: { page, limit, search }
  });
  return response.data;
};

export const getUserById = async (id) => {
  const response = await axiosInstance.get(`/admin/users/${id}`);
  return response.data;
};

export const updateUserStatus = async (id, isActive) => {
  const response = await axiosInstance.put(`/admin/users/${id}/status`, { isActive });
  return response.data;
};

export const getUserOrders = async (userId) => {
  const response = await axiosInstance.get(`/admin/users/${userId}/orders`);
  return response.data;
};

// Admin Management APIs (SuperAdmin only)
export const getAdmins = async () => {
  const response = await axiosInstance.get('/admin/admins');
  return response.data;
};

export const createAdmin = async (adminData) => {
  const response = await axiosInstance.post('/admin/admins', adminData);
  return response.data;
};

export const deleteAdmin = async (id) => {
  const response = await axiosInstance.delete(`/admin/admins/${id}`);
  return response.data;
};

export const updateAdmin = async (id, adminData) => {
  const response = await axiosInstance.put(`/admin/admins/${id}`, adminData);
  return response.data;
};

// Analytics APIs
export const getSalesReport = async (startDate, endDate) => {
  const response = await axiosInstance.get('/admin/analytics/sales', {
    params: { startDate, endDate }
  });
  return response.data;
};

export const getUserAnalytics = async () => {
  const response = await axiosInstance.get('/admin/analytics/users');
  return response.data;
};

export const getRevenueAnalytics = async (startDate, endDate) => {
  const response = await axiosInstance.get('/admin/analytics/revenue', {
    params: { startDate, endDate }
  });
  return response.data;
};

export const getTopProducts = async (limit = 10) => {
  const response = await axiosInstance.get('/admin/analytics/top-products', {
    params: { limit }
  });
  return response.data;
};
