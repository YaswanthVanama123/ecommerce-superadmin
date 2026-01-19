import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DataTable from '../../components/ui/data-display/DataTable';
import CreateShipment from './CreateShipment';
import UpdateLocation from './UpdateLocation';

const ShippingManagement = () => {
  const navigate = useNavigate();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    carrier: '',
    dateFrom: '',
    dateTo: '',
    search: '',
  });
  const [selectedShipments, setSelectedShipments] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateLocationModal, setShowUpdateLocationModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inTransit: 0,
    delivered: 0,
    cancelled: 0,
  });
  const [carrierStats, setCarrierStats] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  // Mock data for development
  const mockShipments = [
    {
      _id: '1',
      trackingNumber: 'TRK1234567890',
      orderId: 'ORD001',
      orderNumber: '#12345',
      carrier: 'FedEx',
      status: 'in_transit',
      origin: 'New York, NY',
      destination: 'Los Angeles, CA',
      estimatedDelivery: '2026-01-25',
      actualDelivery: null,
      currentLocation: 'Chicago, IL',
      customer: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
      },
      items: [
        { name: 'Product A', quantity: 2, weight: '2kg' },
      ],
      weight: '2kg',
      dimensions: '30x20x10 cm',
      cost: 25.50,
      createdAt: '2026-01-20T10:00:00Z',
      updatedAt: '2026-01-21T14:30:00Z',
      locationHistory: [
        { location: 'New York, NY', timestamp: '2026-01-20T10:00:00Z', status: 'picked_up' },
        { location: 'Philadelphia, PA', timestamp: '2026-01-20T18:00:00Z', status: 'in_transit' },
        { location: 'Chicago, IL', timestamp: '2026-01-21T14:30:00Z', status: 'in_transit' },
      ],
    },
    {
      _id: '2',
      trackingNumber: 'TRK0987654321',
      orderId: 'ORD002',
      orderNumber: '#12346',
      carrier: 'UPS',
      status: 'delivered',
      origin: 'San Francisco, CA',
      destination: 'Seattle, WA',
      estimatedDelivery: '2026-01-22',
      actualDelivery: '2026-01-22T16:45:00Z',
      currentLocation: 'Seattle, WA',
      customer: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1987654321',
      },
      items: [
        { name: 'Product B', quantity: 1, weight: '1.5kg' },
      ],
      weight: '1.5kg',
      dimensions: '25x15x10 cm',
      cost: 18.75,
      createdAt: '2026-01-18T09:00:00Z',
      updatedAt: '2026-01-22T16:45:00Z',
      locationHistory: [
        { location: 'San Francisco, CA', timestamp: '2026-01-18T09:00:00Z', status: 'picked_up' },
        { location: 'Portland, OR', timestamp: '2026-01-19T12:00:00Z', status: 'in_transit' },
        { location: 'Seattle, WA', timestamp: '2026-01-22T16:45:00Z', status: 'delivered' },
      ],
    },
    {
      _id: '3',
      trackingNumber: 'TRK1122334455',
      orderId: 'ORD003',
      orderNumber: '#12347',
      carrier: 'DHL',
      status: 'pending',
      origin: 'Boston, MA',
      destination: 'Miami, FL',
      estimatedDelivery: '2026-01-28',
      actualDelivery: null,
      currentLocation: 'Boston, MA',
      customer: {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        phone: '+1122334455',
      },
      items: [
        { name: 'Product C', quantity: 3, weight: '4kg' },
      ],
      weight: '4kg',
      dimensions: '40x30x20 cm',
      cost: 35.00,
      createdAt: '2026-01-19T11:00:00Z',
      updatedAt: '2026-01-19T11:00:00Z',
      locationHistory: [
        { location: 'Boston, MA', timestamp: '2026-01-19T11:00:00Z', status: 'pending' },
      ],
    },
  ];

  const fetchShipments = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      // Filter mock data based on filters
      let filtered = [...mockShipments];

      if (filters.status) {
        filtered = filtered.filter(s => s.status === filters.status);
      }

      if (filters.carrier) {
        filtered = filtered.filter(s => s.carrier.toLowerCase() === filters.carrier.toLowerCase());
      }

      if (filters.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(s =>
          s.trackingNumber.toLowerCase().includes(search) ||
          s.orderNumber.toLowerCase().includes(search) ||
          s.customer.name.toLowerCase().includes(search)
        );
      }

      if (filters.dateFrom) {
        filtered = filtered.filter(s => new Date(s.createdAt) >= new Date(filters.dateFrom));
      }

      if (filters.dateTo) {
        filtered = filtered.filter(s => new Date(s.createdAt) <= new Date(filters.dateTo));
      }

      setShipments(filtered);

      // Calculate stats
      const statsData = {
        total: mockShipments.length,
        pending: mockShipments.filter(s => s.status === 'pending').length,
        inTransit: mockShipments.filter(s => s.status === 'in_transit').length,
        delivered: mockShipments.filter(s => s.status === 'delivered').length,
        cancelled: mockShipments.filter(s => s.status === 'cancelled').length,
      };
      setStats(statsData);

      // Calculate carrier stats
      const carriers = {};
      mockShipments.forEach(s => {
        if (!carriers[s.carrier]) {
          carriers[s.carrier] = { carrier: s.carrier, count: 0, delivered: 0, inTransit: 0 };
        }
        carriers[s.carrier].count++;
        if (s.status === 'delivered') carriers[s.carrier].delivered++;
        if (s.status === 'in_transit') carriers[s.carrier].inTransit++;
      });
      setCarrierStats(Object.values(carriers));

      setPagination({
        currentPage: 1,
        totalPages: Math.ceil(filtered.length / 10),
        totalItems: filtered.length,
        itemsPerPage: 10,
      });
    } catch (error) {
      console.error('Error fetching shipments:', error);
      toast.error('Failed to load shipments');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      status: '',
      carrier: '',
      dateFrom: '',
      dateTo: '',
      search: '',
    });
  };

  const handleBulkStatusUpdate = async (status) => {
    if (selectedShipments.length === 0) {
      toast.warning('Please select shipments to update');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success(`${selectedShipments.length} shipment(s) updated to ${status}`);
      setSelectedShipments([]);
      fetchShipments();
    } catch (error) {
      console.error('Error updating shipments:', error);
      toast.error('Failed to update shipments');
    }
  };

  const handleExportCSV = () => {
    const headers = ['Tracking Number', 'Order Number', 'Carrier', 'Status', 'Origin', 'Destination', 'Est. Delivery', 'Customer', 'Weight', 'Cost'];
    const rows = shipments.map(s => [
      s.trackingNumber,
      s.orderNumber,
      s.carrier,
      s.status,
      s.origin,
      s.destination,
      s.estimatedDelivery,
      s.customer.name,
      s.weight,
      s.cost,
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shipments_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Shipments exported successfully');
  };

  const handlePrintLabel = (shipment) => {
    toast.info('Printing shipping label...');
    // Placeholder for print functionality
    window.print();
  };

  const handleViewDetails = (shipment) => {
    navigate(`/shipping/${shipment._id}`);
  };

  const handleUpdateLocation = (shipment) => {
    setSelectedShipment(shipment);
    setShowUpdateLocationModal(true);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      picked_up: 'bg-blue-100 text-blue-800',
      in_transit: 'bg-purple-100 text-purple-800',
      out_for_delivery: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
      returned: 'bg-orange-100 text-orange-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const columns = [
    {
      key: 'select',
      label: (
        <input
          type="checkbox"
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          checked={selectedShipments.length === shipments.length && shipments.length > 0}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedShipments(shipments.map(s => s._id));
            } else {
              setSelectedShipments([]);
            }
          }}
        />
      ),
      render: (_, shipment) => (
        <input
          type="checkbox"
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          checked={selectedShipments.includes(shipment._id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedShipments([...selectedShipments, shipment._id]);
            } else {
              setSelectedShipments(selectedShipments.filter(id => id !== shipment._id));
            }
          }}
        />
      ),
    },
    {
      key: 'trackingNumber',
      label: 'Tracking Number',
      sortable: true,
      render: (value, shipment) => (
        <div>
          <div className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer" onClick={() => handleViewDetails(shipment)}>
            {value}
          </div>
          <div className="text-xs text-gray-500">{shipment.orderNumber}</div>
        </div>
      ),
    },
    {
      key: 'carrier',
      label: 'Carrier',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
            {value}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(value)}`}>
          {value.replace('_', ' ').toUpperCase()}
        </span>
      ),
    },
    {
      key: 'customer',
      label: 'Customer',
      render: (value) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{value.name}</div>
          <div className="text-xs text-gray-500">{value.email}</div>
        </div>
      ),
    },
    {
      key: 'route',
      label: 'Route',
      render: (_, shipment) => (
        <div className="text-sm">
          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {shipment.origin}
          </div>
          <div className="flex items-center text-gray-400 my-1">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {shipment.destination}
          </div>
        </div>
      ),
    },
    {
      key: 'estimatedDelivery',
      label: 'Est. Delivery',
      sortable: true,
      render: (value, shipment) => (
        <div>
          <div className="text-sm text-gray-900">
            {new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          {shipment.actualDelivery && (
            <div className="text-xs text-green-600">
              Delivered: {new Date(shipment.actualDelivery).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, shipment) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewDetails(shipment)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
            title="View Details"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            onClick={() => handleUpdateLocation(shipment)}
            className="p-1 text-purple-600 hover:bg-purple-50 rounded"
            title="Update Location"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button
            onClick={() => handlePrintLabel(shipment)}
            className="p-1 text-green-600 hover:bg-green-50 rounded"
            title="Print Label"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shipping Management</h1>
            <p className="text-gray-600 mt-1">Track and manage all shipments</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Shipment
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Shipments</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Pending</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">In Transit</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{stats.inTransit}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Delivered</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.delivered}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Cancelled</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{stats.cancelled}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Carrier Analytics */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Carrier Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {carrierStats.map((carrier, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{carrier.carrier}</h3>
                  <span className="text-2xl font-bold text-blue-600">{carrier.count}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">In Transit:</span>
                    <span className="font-medium text-purple-600">{carrier.inTransit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivered:</span>
                    <span className="font-medium text-green-600">{carrier.delivered}</span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(carrier.delivered / carrier.count) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {((carrier.delivered / carrier.count) * 100).toFixed(1)}% delivery rate
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tracking number, order..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="picked_up">Picked Up</option>
                <option value="in_transit">In Transit</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Carrier</label>
              <select
                value={filters.carrier}
                onChange={(e) => handleFilterChange('carrier', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Carriers</option>
                <option value="fedex">FedEx</option>
                <option value="ups">UPS</option>
                <option value="dhl">DHL</option>
                <option value="usps">USPS</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date From</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date To</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedShipments.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-blue-900 font-medium">
                {selectedShipments.length} shipment(s) selected
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBulkStatusUpdate('in_transit')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Mark In Transit
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('delivered')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Mark Delivered
                </button>
                <button
                  onClick={() => setSelectedShipments([])}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Shipments Table */}
        <DataTable
          columns={columns}
          data={shipments}
          loading={loading}
          emptyMessage="No shipments found"
        />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
              {pagination.totalItems} results
            </div>
            <div className="flex space-x-2">
              <button
                disabled={pagination.currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateShipment
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchShipments();
          }}
        />
      )}

      {showUpdateLocationModal && selectedShipment && (
        <UpdateLocation
          isOpen={showUpdateLocationModal}
          onClose={() => {
            setShowUpdateLocationModal(false);
            setSelectedShipment(null);
          }}
          shipment={selectedShipment}
          onSuccess={() => {
            setShowUpdateLocationModal(false);
            setSelectedShipment(null);
            fetchShipments();
          }}
        />
      )}
    </div>
  );
};

export default ShippingManagement;
