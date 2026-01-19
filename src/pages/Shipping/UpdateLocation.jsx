import { useState } from 'react';
import { toast } from 'react-toastify';
import Modal from '../../components/ui/feedback/Modal';

const UpdateLocation = ({ isOpen, onClose, shipment, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    location: '',
    status: 'in_transit',
    description: '',
    latitude: '',
    longitude: '',
  });

  const [errors, setErrors] = useState({});

  const statusOptions = [
    { value: 'picked_up', label: 'Picked Up', color: 'blue' },
    { value: 'in_transit', label: 'In Transit', color: 'purple' },
    { value: 'out_for_delivery', label: 'Out for Delivery', color: 'indigo' },
    { value: 'delivered', label: 'Delivered', color: 'green' },
    { value: 'failed', label: 'Failed Delivery', color: 'red' },
    { value: 'returned', label: 'Returned', color: 'orange' },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
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

      const locationUpdate = {
        shipmentId: shipment._id,
        location: formData.location,
        status: formData.status,
        description: formData.description,
        coordinates: formData.latitude && formData.longitude ? {
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
        } : null,
        timestamp: new Date().toISOString(),
      };

      console.log('Updating location:', locationUpdate);

      toast.success('Location updated successfully');
      onSuccess();
    } catch (error) {
      console.error('Error updating location:', error);
      toast.error('Failed to update location');
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

  const handleGetCurrentLocation = () => {
    if ('geolocation' in navigator) {
      toast.info('Getting your location...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
          }));
          toast.success('Location coordinates captured');
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.error('Failed to get location. Please enter manually.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
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
        form="update-location-form"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Updating...
          </>
        ) : (
          'Update Location'
        )}
      </button>
    </>
  );

  const getStatusColor = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.color : 'gray';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Shipment Location"
      footer={footer}
      size="lg"
      closeOnOverlay={false}
    >
      <form id="update-location-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Shipment Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Shipment Information</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-600">Tracking:</span>
              <span className="ml-2 font-medium text-gray-900">{shipment.trackingNumber}</span>
            </div>
            <div>
              <span className="text-gray-600">Carrier:</span>
              <span className="ml-2 font-medium text-gray-900">{shipment.carrier}</span>
            </div>
            <div>
              <span className="text-gray-600">Current Location:</span>
              <span className="ml-2 font-medium text-gray-900">{shipment.currentLocation}</span>
            </div>
            <div>
              <span className="text-gray-600">Destination:</span>
              <span className="ml-2 font-medium text-gray-900">{shipment.destination}</span>
            </div>
          </div>
        </div>

        {/* Status Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Update Status <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleChange('status', option.value)}
                className={`p-3 border-2 rounded-lg text-left transition-all ${
                  formData.status === option.value
                    ? `border-${option.color}-500 bg-${option.color}-50`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${
                    formData.status === option.value ? `text-${option.color}-900` : 'text-gray-700'
                  }`}>
                    {option.label}
                  </span>
                  {formData.status === option.value && (
                    <svg className={`w-5 h-5 text-${option.color}-600`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
          {errors.status && <p className="mt-1 text-sm text-red-500">{errors.status}</p>}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="e.g., Distribution Center, Chicago, IL 60601"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.location ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
          <p className="mt-1 text-xs text-gray-500">
            Enter the full address or facility name where the package is currently located
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Update Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="e.g., Package arrived at sorting facility"
            rows="4"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
          <p className="mt-1 text-xs text-gray-500">
            Provide details about the current status and any relevant information
          </p>
        </div>

        {/* GPS Coordinates (Optional) */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">GPS Coordinates (Optional)</h3>
            <button
              type="button"
              onClick={handleGetCurrentLocation}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Use My Location
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Latitude
              </label>
              <input
                type="text"
                value={formData.latitude}
                onChange={(e) => handleChange('latitude', e.target.value)}
                placeholder="41.8781"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Longitude
              </label>
              <input
                type="text"
                value={formData.longitude}
                onChange={(e) => handleChange('longitude', e.target.value)}
                placeholder="-87.6298"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {formData.latitude && formData.longitude && (
            <div className="bg-white p-3 rounded border border-gray-200">
              <p className="text-xs text-gray-600 mb-2">Map Preview Placeholder</p>
              <div className="bg-gray-100 h-32 rounded flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <svg className="w-8 h-8 mx-auto text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <p className="text-xs text-gray-500">
                    Location: {formData.latitude}, {formData.longitude}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Location Suggestions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick Suggestions
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              'Sorting Facility',
              'Distribution Center',
              'Local Hub',
              'Out for Delivery',
              'Delivery Attempted',
            ].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  handleChange('description', `Package ${suggestion.toLowerCase()}`);
                }}
                className="px-3 py-1 text-xs bg-white border border-gray-300 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        {formData.location && formData.description && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Update Preview
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start">
                <span className="text-blue-700 font-medium min-w-24">Status:</span>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-${getStatusColor(formData.status)}-100 text-${getStatusColor(formData.status)}-800`}>
                  {statusOptions.find(opt => opt.value === formData.status)?.label}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-700 font-medium min-w-24">Location:</span>
                <span className="text-blue-900">{formData.location}</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-700 font-medium min-w-24">Description:</span>
                <span className="text-blue-900">{formData.description}</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-700 font-medium min-w-24">Timestamp:</span>
                <span className="text-blue-900">{new Date().toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default UpdateLocation;
