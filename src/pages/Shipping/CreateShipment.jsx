import { useState } from 'react';
import { toast } from 'react-toastify';
import Modal from '../../components/ui/feedback/Modal';

const CreateShipment = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    orderId: '',
    carrier: 'FedEx',
    trackingNumber: '',
    origin: '',
    destination: '',
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: '',
    },
    estimatedDelivery: '',
    insurance: '',
    signatureRequired: false,
    notes: '',
  });

  const [errors, setErrors] = useState({});

  // Mock orders for selection
  const mockOrders = [
    { _id: 'ORD001', orderNumber: '#12345', customer: 'John Doe', total: 150.00 },
    { _id: 'ORD002', orderNumber: '#12346', customer: 'Jane Smith', total: 89.99 },
    { _id: 'ORD003', orderNumber: '#12347', customer: 'Bob Johnson', total: 250.00 },
  ];

  const carriers = ['FedEx', 'UPS', 'DHL', 'USPS'];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.orderId) newErrors.orderId = 'Order is required';
    if (!formData.carrier) newErrors.carrier = 'Carrier is required';
    if (!formData.trackingNumber) newErrors.trackingNumber = 'Tracking number is required';
    if (!formData.origin) newErrors.origin = 'Origin address is required';
    if (!formData.destination) newErrors.destination = 'Destination address is required';
    if (!formData.weight) newErrors.weight = 'Weight is required';
    if (!formData.estimatedDelivery) newErrors.estimatedDelivery = 'Estimated delivery date is required';

    // Validate dimensions
    if (!formData.dimensions.length || !formData.dimensions.width || !formData.dimensions.height) {
      newErrors.dimensions = 'All dimensions are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Format data for submission
      const submitData = {
        ...formData,
        dimensions: `${formData.dimensions.length}x${formData.dimensions.width}x${formData.dimensions.height} cm`,
        insurance: formData.insurance ? parseFloat(formData.insurance) : 0,
        weight: `${formData.weight}kg`,
      };

      console.log('Creating shipment:', submitData);

      toast.success('Shipment created successfully');
      onSuccess();
    } catch (error) {
      console.error('Error creating shipment:', error);
      toast.error('Failed to create shipment');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDimensionChange = (dimension, value) => {
    setFormData(prev => ({
      ...prev,
      dimensions: { ...prev.dimensions, [dimension]: value },
    }));
    // Clear dimension error
    if (errors.dimensions) {
      setErrors(prev => ({ ...prev, dimensions: '' }));
    }
  };

  const handleOrderSelect = (orderId) => {
    const order = mockOrders.find(o => o._id === orderId);
    if (order) {
      handleChange('orderId', orderId);
      // Auto-generate tracking number
      const trackingNum = `TRK${Date.now()}`;
      handleChange('trackingNumber', trackingNum);
    }
  };

  const footer = (
    <>
      <button
        type="button"
        onClick={onClose}
        disabled={loading}
        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Cancel
      </button>
      <button
        type="submit"
        form="create-shipment-form"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating...
          </>
        ) : (
          'Create Shipment'
        )}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Shipment"
      footer={footer}
      size="xl"
      closeOnOverlay={false}
    >
      <form id="create-shipment-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Order Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Order <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.orderId}
            onChange={(e) => handleOrderSelect(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.orderId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select an order</option>
            {mockOrders.map(order => (
              <option key={order._id} value={order._id}>
                {order.orderNumber} - {order.customer} - ${order.total.toFixed(2)}
              </option>
            ))}
          </select>
          {errors.orderId && <p className="mt-1 text-sm text-red-500">{errors.orderId}</p>}
        </div>

        {/* Carrier and Tracking */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Carrier <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.carrier}
              onChange={(e) => handleChange('carrier', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.carrier ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              {carriers.map(carrier => (
                <option key={carrier} value={carrier}>{carrier}</option>
              ))}
            </select>
            {errors.carrier && <p className="mt-1 text-sm text-red-500">{errors.carrier}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tracking Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.trackingNumber}
              onChange={(e) => handleChange('trackingNumber', e.target.value)}
              placeholder="TRK1234567890"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.trackingNumber ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.trackingNumber && <p className="mt-1 text-sm text-red-500">{errors.trackingNumber}</p>}
          </div>
        </div>

        {/* Origin and Destination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Origin Address <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.origin}
              onChange={(e) => handleChange('origin', e.target.value)}
              placeholder="123 Main St, New York, NY 10001"
              rows="3"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.origin ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.origin && <p className="mt-1 text-sm text-red-500">{errors.origin}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destination Address <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.destination}
              onChange={(e) => handleChange('destination', e.target.value)}
              placeholder="456 Oak Ave, Los Angeles, CA 90001"
              rows="3"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.destination ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.destination && <p className="mt-1 text-sm text-red-500">{errors.destination}</p>}
          </div>
        </div>

        {/* Package Details */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Package Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => handleChange('weight', e.target.value)}
                placeholder="2.5"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.weight ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.weight && <p className="mt-1 text-sm text-red-500">{errors.weight}</p>}
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dimensions (cm) <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={formData.dimensions.length}
                  onChange={(e) => handleDimensionChange('length', e.target.value)}
                  placeholder="Length"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.dimensions ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <input
                  type="number"
                  step="0.1"
                  value={formData.dimensions.width}
                  onChange={(e) => handleDimensionChange('width', e.target.value)}
                  placeholder="Width"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.dimensions ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <input
                  type="number"
                  step="0.1"
                  value={formData.dimensions.height}
                  onChange={(e) => handleDimensionChange('height', e.target.value)}
                  placeholder="Height"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.dimensions ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.dimensions && <p className="mt-1 text-sm text-red-500">{errors.dimensions}</p>}
            </div>
          </div>
        </div>

        {/* Delivery and Insurance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estimated Delivery Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.estimatedDelivery}
              onChange={(e) => handleChange('estimatedDelivery', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.estimatedDelivery ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.estimatedDelivery && <p className="mt-1 text-sm text-red-500">{errors.estimatedDelivery}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Insurance Amount ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.insurance}
              onChange={(e) => handleChange('insurance', e.target.value)}
              placeholder="100.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Signature Required */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="signatureRequired"
            checked={formData.signatureRequired}
            onChange={(e) => handleChange('signatureRequired', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="signatureRequired" className="ml-2 block text-sm text-gray-700">
            Signature required on delivery
          </label>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Any special handling instructions..."
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Summary */}
        {formData.orderId && formData.trackingNumber && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Shipment Summary</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-blue-700">Order:</span>
                <span className="ml-2 text-blue-900 font-medium">
                  {mockOrders.find(o => o._id === formData.orderId)?.orderNumber}
                </span>
              </div>
              <div>
                <span className="text-blue-700">Tracking:</span>
                <span className="ml-2 text-blue-900 font-medium">{formData.trackingNumber}</span>
              </div>
              <div>
                <span className="text-blue-700">Carrier:</span>
                <span className="ml-2 text-blue-900 font-medium">{formData.carrier}</span>
              </div>
              {formData.weight && (
                <div>
                  <span className="text-blue-700">Weight:</span>
                  <span className="ml-2 text-blue-900 font-medium">{formData.weight}kg</span>
                </div>
              )}
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default CreateShipment;
