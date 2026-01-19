import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UpdateLocation from './UpdateLocation';

const ShippingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpdateLocationModal, setShowUpdateLocationModal] = useState(false);
  const [editingTracking, setEditingTracking] = useState(false);
  const [trackingForm, setTrackingForm] = useState({
    trackingNumber: '',
    carrier: '',
  });

  // Mock data
  const mockShipment = {
    _id: id,
    trackingNumber: 'TRK1234567890',
    orderId: 'ORD001',
    orderNumber: '#12345',
    carrier: 'FedEx',
    status: 'in_transit',
    origin: 'New York, NY 10001',
    destination: 'Los Angeles, CA 90001',
    estimatedDelivery: '2026-01-25',
    actualDelivery: null,
    currentLocation: 'Chicago, IL 60601',
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (234) 567-8900',
      address: '123 Main St, Los Angeles, CA 90001',
    },
    items: [
      { name: 'Premium Headphones', quantity: 2, weight: '1kg', sku: 'SKU-001' },
      { name: 'USB Cable', quantity: 1, weight: '0.1kg', sku: 'SKU-002' },
    ],
    weight: '2.1kg',
    dimensions: '30x20x10 cm',
    cost: 25.50,
    insurance: 100.00,
    signatureRequired: true,
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-01-21T14:30:00Z',
    locationHistory: [
      {
        id: '1',
        location: 'New York, NY 10001',
        timestamp: '2026-01-20T10:00:00Z',
        status: 'picked_up',
        description: 'Package picked up from sender',
        staff: 'Driver #123',
      },
      {
        id: '2',
        location: 'Philadelphia, PA 19019',
        timestamp: '2026-01-20T18:00:00Z',
        status: 'in_transit',
        description: 'Arrived at sorting facility',
        staff: 'Facility Manager',
      },
      {
        id: '3',
        location: 'Chicago, IL 60601',
        timestamp: '2026-01-21T14:30:00Z',
        status: 'in_transit',
        description: 'In transit to next location',
        staff: 'Logistics Coordinator',
      },
    ],
    notes: [
      {
        id: '1',
        text: 'Package requires special handling - fragile items',
        createdBy: 'Admin User',
        createdAt: '2026-01-20T10:05:00Z',
      },
      {
        id: '2',
        text: 'Customer requested delivery before 5 PM',
        createdBy: 'Customer Service',
        createdAt: '2026-01-20T11:00:00Z',
      },
    ],
  };

  useEffect(() => {
    fetchShipmentDetails();
  }, [id]);

  const fetchShipmentDetails = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setShipment(mockShipment);
      setTrackingForm({
        trackingNumber: mockShipment.trackingNumber,
        carrier: mockShipment.carrier,
      });
    } catch (error) {
      console.error('Error fetching shipment details:', error);
      toast.error('Failed to load shipment details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTracking = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Tracking information updated successfully');
      setEditingTracking(false);
      fetchShipmentDetails();
    } catch (error) {
      console.error('Error updating tracking:', error);
      toast.error('Failed to update tracking information');
    }
  };

  const handlePrintLabel = () => {
    toast.info('Printing shipping label...');
    window.print();
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      picked_up: { color: 'bg-blue-100 text-blue-800', label: 'Picked Up' },
      in_transit: { color: 'bg-purple-100 text-purple-800', label: 'In Transit' },
      out_for_delivery: { color: 'bg-indigo-100 text-indigo-800', label: 'Out for Delivery' },
      delivered: { color: 'bg-green-100 text-green-800', label: 'Delivered' },
      failed: { color: 'bg-red-100 text-red-800', label: 'Failed' },
      cancelled: { color: 'bg-gray-100 text-gray-800', label: 'Cancelled' },
    };
    return badges[status] || badges.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      picked_up: (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      in_transit: (
        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
      ),
      delivered: (
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    };
    return icons[status] || icons.in_transit;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading shipment details...</p>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Shipment Not Found</h2>
          <p className="text-gray-600 text-center mb-6">The shipment you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/shipping')}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Back to Shipments
          </button>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(shipment.status);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/shipping')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shipment Details</h1>
              <p className="text-gray-600 mt-1">Track and manage shipment {shipment.trackingNumber}</p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={handlePrintLabel}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Label
            </button>
            <button
              onClick={() => setShowUpdateLocationModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Update Location
            </button>
          </div>
        </div>

        {/* Status Overview */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-blue-100 text-sm mb-1">Current Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusBadge.color}`}>
                {statusBadge.label}
              </span>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">Tracking Number</p>
              <p className="text-lg font-bold">{shipment.trackingNumber}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">Carrier</p>
              <p className="text-lg font-bold">{shipment.carrier}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">Est. Delivery</p>
              <p className="text-lg font-bold">
                {new Date(shipment.estimatedDelivery).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tracking Timeline */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Tracking Timeline</h2>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                {/* Timeline items */}
                <div className="space-y-6">
                  {shipment.locationHistory.map((location, index) => (
                    <div key={location.id} className="relative flex items-start space-x-4">
                      {/* Timeline dot */}
                      <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${
                        index === 0 ? 'bg-blue-600' : 'bg-gray-300'
                      }`}>
                        {getStatusIcon(location.status)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">{location.location}</h3>
                            <p className="text-sm text-gray-600 mt-1">{location.description}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(location.status).color}`}>
                            {getStatusBadge(location.status).label}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {new Date(location.timestamp).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                          {location.staff && (
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              {location.staff}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Live Tracking Map</h2>
              <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <p className="text-gray-600 font-medium">Interactive map will be displayed here</p>
                  <p className="text-gray-500 text-sm mt-2">Showing route from {shipment.origin} to {shipment.destination}</p>
                </div>
              </div>
            </div>

            {/* Package Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Package Items</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weight</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {shipment.items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{item.sku}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.quantity}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.weight}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Shipment Notes</h2>
              <div className="space-y-4">
                {shipment.notes.map((note) => (
                  <div key={note.id} className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{note.text}</p>
                        <div className="flex items-center space-x-3 mt-2 text-xs text-gray-600">
                          <span>{note.createdBy}</span>
                          <span>•</span>
                          <span>{new Date(note.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Tracking Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Tracking Info</h2>
                {editingTracking ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleUpdateTracking}
                      className="text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingTracking(false)}
                      className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingTracking(true)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Edit
                  </button>
                )}
              </div>

              {editingTracking ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tracking Number</label>
                    <input
                      type="text"
                      value={trackingForm.trackingNumber}
                      onChange={(e) => setTrackingForm({ ...trackingForm, trackingNumber: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Carrier</label>
                    <select
                      value={trackingForm.carrier}
                      onChange={(e) => setTrackingForm({ ...trackingForm, carrier: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="FedEx">FedEx</option>
                      <option value="UPS">UPS</option>
                      <option value="DHL">DHL</option>
                      <option value="USPS">USPS</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Tracking Number</p>
                    <p className="font-medium text-gray-900">{shipment.trackingNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Carrier</p>
                    <p className="font-medium text-gray-900">{shipment.carrier}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Order Number</p>
                    <p className="font-medium text-gray-900">{shipment.orderNumber}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Info</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium text-gray-900">{shipment.customer.name}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{shipment.customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{shipment.customer.phone}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-gray-400 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-600">Delivery Address</p>
                    <p className="font-medium text-gray-900">{shipment.customer.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Package Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Package Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Weight</span>
                  <span className="font-medium text-gray-900">{shipment.weight}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Dimensions</span>
                  <span className="font-medium text-gray-900">{shipment.dimensions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Shipping Cost</span>
                  <span className="font-medium text-gray-900">${shipment.cost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Insurance</span>
                  <span className="font-medium text-gray-900">${shipment.insurance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Signature Required</span>
                  <span className="font-medium text-gray-900">{shipment.signatureRequired ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>

            {/* Shipping Route */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Route</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-xs text-gray-600 uppercase font-medium">Origin</span>
                  </div>
                  <p className="font-medium text-gray-900 ml-5">{shipment.origin}</p>
                </div>
                <div className="ml-5 border-l-2 border-gray-300 h-8"></div>
                <div>
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-xs text-gray-600 uppercase font-medium">Current Location</span>
                  </div>
                  <p className="font-medium text-gray-900 ml-5">{shipment.currentLocation}</p>
                </div>
                <div className="ml-5 border-l-2 border-dashed border-gray-300 h-8"></div>
                <div>
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-xs text-gray-600 uppercase font-medium">Destination</span>
                  </div>
                  <p className="font-medium text-gray-900 ml-5">{shipment.destination}</p>
                </div>
              </div>
            </div>

            {/* Timeline Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Timeline</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Created</span>
                  <span className="font-medium text-gray-900">
                    {new Date(shipment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Updated</span>
                  <span className="font-medium text-gray-900">
                    {new Date(shipment.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Est. Delivery</span>
                  <span className="font-medium text-gray-900">
                    {new Date(shipment.estimatedDelivery).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                {shipment.actualDelivery && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Delivered</span>
                    <span className="font-medium text-green-600">
                      {new Date(shipment.actualDelivery).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Location Modal */}
      {showUpdateLocationModal && (
        <UpdateLocation
          isOpen={showUpdateLocationModal}
          onClose={() => setShowUpdateLocationModal(false)}
          shipment={shipment}
          onSuccess={() => {
            setShowUpdateLocationModal(false);
            fetchShipmentDetails();
          }}
        />
      )}
    </div>
  );
};

export default ShippingDetail;
