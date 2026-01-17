import axiosInstance from './axiosConfig';

// ====================================
// Authentication APIs
// ====================================
export const authAPI = {
  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('superadmin_token');
    localStorage.removeItem('superadmin_user');
  },

  getProfile: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },

  refreshToken: async () => {
    const response = await axiosInstance.post('/auth/refresh');
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await axiosInstance.post('/auth/change-password', passwordData);
    return response.data;
  },
};

// ====================================
// User Management APIs
// ====================================
export const usersAPI = {
  getAll: async (params = {}) => {
    const { page = 1, limit = 10, search = '', status = '' } = params;
    const response = await axiosInstance.get('/superadmin/users', {
      params: { page, limit, search, status },
    });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/superadmin/users/${id}`);
    return response.data;
  },

  create: async (userData) => {
    const response = await axiosInstance.post('/superadmin/users', userData);
    return response.data;
  },

  update: async (id, userData) => {
    const response = await axiosInstance.put(`/superadmin/users/${id}`, userData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/superadmin/users/${id}`);
    return response.data;
  },

  updateStatus: async (id, isActive) => {
    const response = await axiosInstance.patch(`/superadmin/users/${id}/status`, { isActive });
    return response.data;
  },

  getUserOrders: async (userId, params = {}) => {
    const { page = 1, limit = 10 } = params;
    const response = await axiosInstance.get(`/superadmin/users/${userId}/orders`, {
      params: { page, limit },
    });
    return response.data;
  },

  getUserActivity: async (userId, params = {}) => {
    const { page = 1, limit = 10 } = params;
    const response = await axiosInstance.get(`/superadmin/users/${userId}/activity`, {
      params: { page, limit },
    });
    return response.data;
  },
};

// ====================================
// Admin Management APIs
// ====================================
export const adminsAPI = {
  getAll: async (params = {}) => {
    const { page = 1, limit = 10, search = '' } = params;
    const response = await axiosInstance.get('/superadmin/admins', {
      params: { page, limit, search },
    });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/superadmin/admins/${id}`);
    return response.data;
  },

  promote: async (userId, adminData) => {
    const response = await axiosInstance.post(`/superadmin/admins/promote/${userId}`, adminData);
    return response.data;
  },

  demote: async (adminId) => {
    const response = await axiosInstance.post(`/superadmin/admins/demote/${adminId}`);
    return response.data;
  },

  create: async (adminData) => {
    const response = await axiosInstance.post('/superadmin/admins', adminData);
    return response.data;
  },

  update: async (id, adminData) => {
    const response = await axiosInstance.put(`/superadmin/admins/${id}`, adminData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/superadmin/admins/${id}`);
    return response.data;
  },

  updatePermissions: async (id, permissions) => {
    const response = await axiosInstance.patch(`/superadmin/admins/${id}/permissions`, { permissions });
    return response.data;
  },

  getActivityLogs: async (adminId, params = {}) => {
    const { page = 1, limit = 10 } = params;
    const response = await axiosInstance.get(`/superadmin/admins/${adminId}/activity-logs`, {
      params: { page, limit },
    });
    return response.data;
  },
};

// ====================================
// Analytics APIs
// ====================================
export const analyticsAPI = {
  getDashboard: async () => {
    const response = await axiosInstance.get('/superadmin/analytics/dashboard');
    return response.data;
  },

  getSalesAnalytics: async (params = {}) => {
    const { period = 30 } = params;
    const response = await axiosInstance.get('/superadmin/analytics/products', {
      params: { period },
    });
    return response.data;
  },

  getUserGrowth: async (params = {}) => {
    const { period = 30 } = params;
    const response = await axiosInstance.get('/superadmin/analytics/users', {
      params: { period },
    });
    return response.data;
  },

  getRevenueAnalytics: async (params = {}) => {
    const { period = 30 } = params;
    const response = await axiosInstance.get('/superadmin/analytics/revenue', {
      params: { period },
    });
    return response.data;
  },

  getTopProducts: async (params = {}) => {
    const { limit = 10, startDate, endDate } = params;
    const response = await axiosInstance.get('/superadmin/analytics/top-products', {
      params: { limit, startDate, endDate },
    });
    return response.data;
  },

  getTopCustomers: async (params = {}) => {
    const { limit = 10, startDate, endDate } = params;
    const response = await axiosInstance.get('/superadmin/analytics/top-customers', {
      params: { limit, startDate, endDate },
    });
    return response.data;
  },

  generateReport: async (reportConfig) => {
    const response = await axiosInstance.post('/superadmin/analytics/reports/generate', reportConfig);
    return response.data;
  },

  getReports: async (params = {}) => {
    const { page = 1, limit = 10 } = params;
    const response = await axiosInstance.get('/superadmin/analytics/reports', {
      params: { page, limit },
    });
    return response.data;
  },

  downloadReport: async (reportId, format = 'pdf') => {
    const response = await axiosInstance.get(`/superadmin/analytics/reports/${reportId}/download`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },
};

// ====================================
// Settings APIs
// ====================================
export const settingsAPI = {
  getAll: async () => {
    const response = await axiosInstance.get('/superadmin/settings');
    return response.data;
  },

  getByKey: async (key) => {
    const response = await axiosInstance.get(`/superadmin/settings/${key}`);
    return response.data;
  },

  update: async (key, value) => {
    const response = await axiosInstance.put(`/superadmin/settings/${key}`, { value });
    return response.data;
  },

  updateBulk: async (settings) => {
    const response = await axiosInstance.put('/superadmin/settings/bulk', { settings });
    return response.data;
  },

  getSystemConfig: async () => {
    const response = await axiosInstance.get('/superadmin/settings/system');
    return response.data;
  },

  updateSystemConfig: async (config) => {
    const response = await axiosInstance.put('/superadmin/settings/system', config);
    return response.data;
  },

  getEmailTemplates: async () => {
    const response = await axiosInstance.get('/superadmin/settings/email-templates');
    return response.data;
  },

  updateEmailTemplate: async (templateId, templateData) => {
    const response = await axiosInstance.put(`/superadmin/settings/email-templates/${templateId}`, templateData);
    return response.data;
  },
};

// ====================================
// Audit Logs APIs
// ====================================
export const auditLogsAPI = {
  getAll: async (params = {}) => {
    const { page = 1, limit = 20, startDate, endDate, userId, action, resource } = params;
    const response = await axiosInstance.get('/superadmin/audit', {
      params: { page, limit, startDate, endDate, userId, action, resource },
    });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/superadmin/audit/${id}`);
    return response.data;
  },

  getByUser: async (userId, params = {}) => {
    const { page = 1, limit = 20 } = params;
    const response = await axiosInstance.get(`/superadmin/audit`, {
      params: { page, limit, userId },
    });
    return response.data;
  },

  getByResource: async (resource, resourceId, params = {}) => {
    const { page = 1, limit = 20 } = params;
    const response = await axiosInstance.get(`/superadmin/audit`, {
      params: { page, limit, entity: resource, entityId: resourceId },
    });
    return response.data;
  },

  export: async (params = {}) => {
    const { startDate, endDate, format = 'csv' } = params;
    const response = await axiosInstance.get('/superadmin/audit/export', {
      params: { startDate, endDate, format },
      responseType: 'blob',
    });
    return response.data;
  },

  getStats: async (params = {}) => {
    const { startDate, endDate } = params;
    const response = await axiosInstance.get('/superadmin/audit/stats', {
      params: { startDate, endDate },
    });
    return response.data;
  },
};

// ====================================
// Product Management APIs
// ====================================
export const productsAPI = {
  getAll: async (params = {}) => {
    const { page = 1, limit = 10, search = '' } = params;
    const response = await axiosInstance.get('/superadmin/products', {
      params: { page, limit, search },
    });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/superadmin/products/${id}`);
    return response.data;
  },

  create: async (productData) => {
    const response = await axiosInstance.post('/superadmin/products', productData);
    return response.data;
  },

  update: async (id, productData) => {
    const response = await axiosInstance.put(`/superadmin/products/${id}`, productData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/superadmin/products/${id}`);
    return response.data;
  },

  uploadImage: async (formData) => {
    const response = await axiosInstance.post('/superadmin/products/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// ====================================
// Category Management APIs
// ====================================
export const categoriesAPI = {
  getAll: async () => {
    const response = await axiosInstance.get('/superadmin/categories');
    return response.data;
  },

  create: async (categoryData) => {
    const response = await axiosInstance.post('/superadmin/categories', categoryData);
    return response.data;
  },

  update: async (id, categoryData) => {
    const response = await axiosInstance.put(`/superadmin/categories/${id}`, categoryData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/superadmin/categories/${id}`);
    return response.data;
  },
};

// ====================================
// Order Management APIs
// ====================================
export const ordersAPI = {
  getAll: async (params = {}) => {
    const { page = 1, limit = 10, status = '' } = params;
    const response = await axiosInstance.get('/superadmin/orders', {
      params: { page, limit, status },
    });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/superadmin/orders/${id}`);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await axiosInstance.patch(`/superadmin/orders/${id}/status`, { status });
    return response.data;
  },
};

// ====================================
// Legacy exports for backward compatibility
// ====================================
export const login = authAPI.login;
export const logout = authAPI.logout;
export const getDashboardStats = analyticsAPI.getDashboard;
export const getSalesData = analyticsAPI.getSalesAnalytics;
export const getUserGrowthData = analyticsAPI.getUserGrowth;
export const getProducts = productsAPI.getAll;
export const getProductById = productsAPI.getById;
export const createProduct = productsAPI.create;
export const updateProduct = productsAPI.update;
export const deleteProduct = productsAPI.delete;
export const uploadProductImage = productsAPI.uploadImage;
export const getCategories = categoriesAPI.getAll;
export const createCategory = categoriesAPI.create;
export const updateCategory = categoriesAPI.update;
export const deleteCategory = categoriesAPI.delete;
export const getOrders = ordersAPI.getAll;
export const getOrderById = ordersAPI.getById;
export const updateOrderStatus = ordersAPI.updateStatus;
export const getUsers = usersAPI.getAll;
export const getUserById = usersAPI.getById;
export const updateUserStatus = usersAPI.updateStatus;
export const updateUserRole = async (id, role) => {
  const response = await axiosInstance.put(`/superadmin/users/${id}/role`, { role });
  return response.data;
};
export const deleteUser = usersAPI.delete;
export const getUserOrders = usersAPI.getUserOrders;
export const getAdmins = adminsAPI.getAll;
export const createAdmin = adminsAPI.create;
export const deleteAdmin = adminsAPI.delete;
export const updateAdmin = adminsAPI.update;
export const promoteUserToAdmin = adminsAPI.promote;
export const demoteAdminToUser = adminsAPI.demote;
export const getAdminActivityLogs = adminsAPI.getActivityLogs;
export const updateAdminPermissions = adminsAPI.updatePermissions;
export const getSalesReport = analyticsAPI.getSalesAnalytics;
export const getUserAnalytics = analyticsAPI.getUserGrowth;
export const getRevenueAnalytics = analyticsAPI.getRevenueAnalytics;
export const getTopProducts = analyticsAPI.getTopProducts;
export const getAuditLogs = auditLogsAPI.getAll;
export const exportAuditLogs = auditLogsAPI.export;

// ====================================
// Reports APIs
// ====================================
export const reportsAPI = {
  getSalesReport: async (startDate, endDate, period = 'monthly') => {
    const response = await axiosInstance.get('/superadmin/reports/sales', {
      params: { startDate, endDate, period }
    });
    return response.data;
  },

  getUserReport: async (startDate, endDate, metric = 'registrations') => {
    const response = await axiosInstance.get('/superadmin/reports/users', {
      params: { startDate, endDate, metric }
    });
    return response.data;
  },

  getProductReport: async (startDate, endDate, metric = 'best-sellers', limit = 10) => {
    const response = await axiosInstance.get('/superadmin/reports/products', {
      params: { startDate, endDate, metric, limit }
    });
    return response.data;
  },

  getOrderReport: async (startDate, endDate, status = 'all') => {
    const response = await axiosInstance.get('/superadmin/reports/orders', {
      params: { startDate, endDate, status }
    });
    return response.data;
  },

  getCustomReport: async (startDate, endDate, metrics) => {
    const response = await axiosInstance.post('/superadmin/reports/custom', {
      startDate,
      endDate,
      metrics
    });
    return response.data;
  },

  exportToCSV: (reportType, data) => {
    if (!data) return new Blob(['No data available'], { type: 'text/csv' });

    const convertToCSV = (data) => {
      if (reportType === 'sales' && data.chartData) {
        const headers = ['Period', 'Revenue', 'Orders'];
        const rows = data.chartData.map(item => [item.period, item.revenue, item.orders]);
        return [headers, ...rows].map(row => row.join(',')).join('\n');
      }

      if (reportType === 'users' && data.chartData) {
        const headers = ['Period', 'New Users', 'Active Users'];
        const rows = data.chartData.map(item => [item.period, item.newUsers, item.activeUsers]);
        return [headers, ...rows].map(row => row.join(',')).join('\n');
      }

      if (reportType === 'products' && data.products) {
        const headers = ['Rank', 'Product', 'Category', 'Units Sold', 'Revenue', 'Price'];
        const rows = data.products.map((item, idx) => [
          idx + 1,
          `"${item.name}"`,
          item.category,
          item.unitsSold || item.quantity || 0,
          item.revenue || (item.quantity * item.price) || 0,
          item.price || 0
        ]);
        return [headers, ...rows].map(row => row.join(',')).join('\n');
      }

      if (reportType === 'orders' && data.chartData) {
        const headers = ['Period', 'Total Orders', 'Delivered', 'Cancelled'];
        const rows = data.chartData.map(item => [item.period, item.orders, item.delivered, item.cancelled]);
        return [headers, ...rows].map(row => row.join(',')).join('\n');
      }

      if (reportType === 'custom' && data.combinedData) {
        const headers = ['Period', 'Revenue', 'Orders', 'Users', 'Products Sold'];
        const rows = data.combinedData.map(item => [
          item.period,
          item.revenue || '',
          item.orders || '',
          item.users || '',
          item.productsSold || ''
        ]);
        return [headers, ...rows].map(row => row.join(',')).join('\n');
      }

      return 'No data available';
    };

    const csvContent = convertToCSV(data);
    return new Blob([csvContent], { type: 'text/csv' });
  },

  exportToPDF: (reportType, data, dateRange) => {
    return new Promise((resolve) => {
      const pdfContent = `
Report Type: ${reportType.toUpperCase()}
Date Range: ${dateRange.startDate} to ${dateRange.endDate}
Generated: ${new Date().toLocaleString()}

Note: For full PDF export functionality, use the Print button.
This will open the browser's print dialog where you can save as PDF.
      `;

      const blob = new Blob([pdfContent], { type: 'text/plain' });
      resolve(blob);
    });
  }
};

// Reports API legacy exports
export const getUserReport = reportsAPI.getUserReport;
export const getProductReport = reportsAPI.getProductReport;
export const getOrderReport = reportsAPI.getOrderReport;
export const getCustomReport = reportsAPI.getCustomReport;
export const exportReportToCSV = reportsAPI.exportToCSV;
export const exportReportToPDF = reportsAPI.exportToPDF;

// ====================================
// System Settings APIs (Extended)
// ====================================
export const getSystemSettings = async () => {
  const response = await axiosInstance.get('/superadmin/settings');
  return response.data;
};

export const updateGeneralSettings = async (settingsData) => {
  const response = await axiosInstance.put('/superadmin/settings/general', settingsData);
  return response.data;
};

export const updateEmailSettings = async (settingsData) => {
  const response = await axiosInstance.put('/superadmin/settings/email', settingsData);
  return response.data;
};

export const updatePaymentSettings = async (settingsData) => {
  const response = await axiosInstance.put('/superadmin/settings/payment', settingsData);
  return response.data;
};

export const updateShippingSettings = async (settingsData) => {
  const response = await axiosInstance.put('/superadmin/settings/shipping', settingsData);
  return response.data;
};

export const updateSecuritySettings = async (settingsData) => {
  const response = await axiosInstance.put('/superadmin/settings/security', settingsData);
  return response.data;
};

export const updateAppearanceSettings = async (settingsData) => {
  const response = await axiosInstance.put('/superadmin/settings/appearance', settingsData);
  return response.data;
};

export const testEmailConnection = async () => {
  const response = await axiosInstance.post('/superadmin/settings/email/test');
  return response.data;
};

export const uploadLogo = async (formData) => {
  const response = await axiosInstance.post('/superadmin/settings/upload-logo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// ====================================
// Pincode Management APIs
// ====================================
export const pincodesAPI = {
  getAll: async (params = {}) => {
    const { page = 1, limit = 10, search = '', deliveryZone = '', isServiceable = '' } = params;
    const response = await axiosInstance.get('/superadmin/pincodes', {
      params: { page, limit, search, deliveryZone, isServiceable },
    });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/superadmin/pincodes/${id}`);
    return response.data;
  },

  create: async (pincodeData) => {
    const response = await axiosInstance.post('/superadmin/pincodes', pincodeData);
    return response.data;
  },

  update: async (id, pincodeData) => {
    const response = await axiosInstance.put(`/superadmin/pincodes/${id}`, pincodeData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/superadmin/pincodes/${id}`);
    return response.data;
  },

  bulkUpload: async (formData) => {
    const response = await axiosInstance.post('/superadmin/pincodes/bulk-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getStats: async () => {
    const response = await axiosInstance.get('/superadmin/pincodes/stats');
    return response.data;
  },

  downloadTemplate: async () => {
    const response = await axiosInstance.get('/superadmin/pincodes/download-template', {
      responseType: 'blob',
    });
    return response.data;
  },
};

// Legacy exports for backward compatibility
export const getPincodes = pincodesAPI.getAll;
export const getPincodeById = pincodesAPI.getById;
export const createPincode = pincodesAPI.create;
export const updatePincode = pincodesAPI.update;
export const deletePincode = pincodesAPI.delete;
export const bulkUploadPincodes = pincodesAPI.bulkUpload;
export const getPincodeStats = pincodesAPI.getStats;
export const downloadPincodeTemplate = pincodesAPI.downloadTemplate;
