/**
 * Shipping Management API Integration Guide
 *
 * This file contains the API functions needed to integrate the Shipping Management
 * module with your backend. Add these functions to your src/api/index.js file.
 */

// ====================================
// Shipping Management APIs
// ====================================

export const shippingAPI = {
  /**
   * Get all shipments with filters and pagination
   * @param {Object} params - Query parameters
   * @returns {Promise} - Shipments data
   */
  getAll: async (params = {}) => {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      carrier = '',
      dateFrom = '',
      dateTo = '',
    } = params;

    const response = await axiosInstance.get('/superadmin/shipments', {
      params: { page, limit, search, status, carrier, dateFrom, dateTo },
    });
    return response.data;
  },

  /**
   * Get shipment by ID
   * @param {string} id - Shipment ID
   * @returns {Promise} - Shipment details
   */
  getById: async (id) => {
    const response = await axiosInstance.get(`/superadmin/shipments/${id}`);
    return response.data;
  },

  /**
   * Create new shipment
   * @param {Object} shipmentData - Shipment data
   * @returns {Promise} - Created shipment
   */
  create: async (shipmentData) => {
    const response = await axiosInstance.post('/superadmin/shipments', shipmentData);
    return response.data;
  },

  /**
   * Update shipment tracking information
   * @param {string} id - Shipment ID
   * @param {Object} trackingData - Updated tracking data
   * @returns {Promise} - Updated shipment
   */
  updateTracking: async (id, trackingData) => {
    const response = await axiosInstance.patch(
      `/superadmin/shipments/${id}/tracking`,
      trackingData
    );
    return response.data;
  },

  /**
   * Update shipment location
   * @param {string} id - Shipment ID
   * @param {Object} locationData - Location update data
   * @returns {Promise} - Updated shipment
   */
  updateLocation: async (id, locationData) => {
    const response = await axiosInstance.patch(
      `/superadmin/shipments/${id}/location`,
      locationData
    );
    return response.data;
  },

  /**
   * Bulk update shipment status
   * @param {Array<string>} shipmentIds - Array of shipment IDs
   * @param {string} status - New status
   * @returns {Promise} - Update result
   */
  bulkUpdateStatus: async (shipmentIds, status) => {
    const response = await axiosInstance.patch('/superadmin/shipments/bulk-update', {
      shipmentIds,
      status,
    });
    return response.data;
  },

  /**
   * Get shipment statistics
   * @returns {Promise} - Statistics data
   */
  getStats: async () => {
    const response = await axiosInstance.get('/superadmin/shipments/stats');
    return response.data;
  },

  /**
   * Get carrier analytics
   * @returns {Promise} - Carrier analytics data
   */
  getCarrierAnalytics: async () => {
    const response = await axiosInstance.get('/superadmin/shipments/carrier-analytics');
    return response.data;
  },

  /**
   * Delete shipment
   * @param {string} id - Shipment ID
   * @returns {Promise} - Delete result
   */
  delete: async (id) => {
    const response = await axiosInstance.delete(`/superadmin/shipments/${id}`);
    return response.data;
  },

  /**
   * Export shipments to CSV
   * @param {Object} filters - Export filters
   * @returns {Promise} - CSV data
   */
  exportCSV: async (filters = {}) => {
    const response = await axiosInstance.get('/superadmin/shipments/export', {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Generate shipping label
   * @param {string} id - Shipment ID
   * @returns {Promise} - Label PDF
   */
  generateLabel: async (id) => {
    const response = await axiosInstance.get(`/superadmin/shipments/${id}/label`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Get shipment location history
   * @param {string} id - Shipment ID
   * @returns {Promise} - Location history
   */
  getLocationHistory: async (id) => {
    const response = await axiosInstance.get(`/superadmin/shipments/${id}/location-history`);
    return response.data;
  },

  /**
   * Add note to shipment
   * @param {string} id - Shipment ID
   * @param {Object} noteData - Note data
   * @returns {Promise} - Updated shipment
   */
  addNote: async (id, noteData) => {
    const response = await axiosInstance.post(`/superadmin/shipments/${id}/notes`, noteData);
    return response.data;
  },

  /**
   * Get orders for shipment creation
   * @param {Object} params - Query parameters
   * @returns {Promise} - Orders data
   */
  getAvailableOrders: async (params = {}) => {
    const response = await axiosInstance.get('/superadmin/shipments/available-orders', {
      params,
    });
    return response.data;
  },
};

// ====================================
// Usage Examples
// ====================================

/**
 * Example 1: Fetch all shipments with filters
 */
/*
const fetchShipments = async () => {
  try {
    const data = await shippingAPI.getAll({
      page: 1,
      limit: 10,
      status: 'in_transit',
      carrier: 'FedEx',
      search: 'TRK123',
    });
    console.log('Shipments:', data);
  } catch (error) {
    console.error('Error:', error);
  }
};
*/

/**
 * Example 2: Create a new shipment
 */
/*
const createShipment = async () => {
  try {
    const shipmentData = {
      orderId: 'ORD001',
      carrier: 'FedEx',
      trackingNumber: 'TRK1234567890',
      origin: 'New York, NY 10001',
      destination: 'Los Angeles, CA 90001',
      weight: '2kg',
      dimensions: '30x20x10 cm',
      estimatedDelivery: '2026-01-25',
      insurance: 100.00,
      signatureRequired: true,
      notes: 'Handle with care',
    };

    const result = await shippingAPI.create(shipmentData);
    console.log('Created shipment:', result);
  } catch (error) {
    console.error('Error:', error);
  }
};
*/

/**
 * Example 3: Update shipment location
 */
/*
const updateLocation = async (shipmentId) => {
  try {
    const locationData = {
      location: 'Chicago, IL 60601',
      status: 'in_transit',
      description: 'Package arrived at sorting facility',
      coordinates: {
        latitude: 41.8781,
        longitude: -87.6298,
      },
    };

    const result = await shippingAPI.updateLocation(shipmentId, locationData);
    console.log('Updated location:', result);
  } catch (error) {
    console.error('Error:', error);
  }
};
*/

/**
 * Example 4: Bulk update status
 */
/*
const bulkUpdate = async () => {
  try {
    const shipmentIds = ['id1', 'id2', 'id3'];
    const result = await shippingAPI.bulkUpdateStatus(shipmentIds, 'delivered');
    console.log('Bulk update result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
};
*/

// ====================================
// Route Configuration for React Router
// ====================================

/**
 * Add these routes to your main routing configuration:
 *
 * import { ShippingManagement, ShippingDetail } from './pages/Shipping';
 *
 * <Route path="/shipping" element={<ShippingManagement />} />
 * <Route path="/shipping/:id" element={<ShippingDetail />} />
 */

// ====================================
// Sidebar/Navigation Menu Item
// ====================================

/**
 * Add this to your sidebar navigation:
 *
 * {
 *   title: 'Shipping',
 *   path: '/shipping',
 *   icon: TruckIcon, // from @heroicons/react/24/outline
 *   badge: pendingShipmentsCount,
 * }
 */
