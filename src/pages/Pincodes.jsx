import { useState, useEffect, useRef } from 'react';
import {
  getPincodes,
  getPincodeStats,
  createPincode,
  updatePincode,
  deletePincode,
  bulkUploadPincodes,
  downloadPincodeTemplate,
  getCategories,
} from '../api';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

const Pincodes = () => {
  const [pincodes, setPincodes] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    serviceable: 0,
    nonServiceable: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedPincode, setSelectedPincode] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deliveryZoneFilter, setDeliveryZoneFilter] = useState('');
  const [serviceabilityFilter, setServiceabilityFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedRestrictedCategories, setSelectedRestrictedCategories] = useState([]);
  const fileInputRef = useRef(null);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  useEffect(() => {
    fetchPincodes();
    fetchStats();
    fetchCategories();
  }, [currentPage, itemsPerPage, searchTerm, deliveryZoneFilter, serviceabilityFilter]);

  const fetchPincodes = async () => {
    setLoading(true);
    try {
      const response = await getPincodes({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        deliveryZone: deliveryZoneFilter,
        isServiceable: serviceabilityFilter,
      });

      // Handle backend structure: { success: true, data: { pincodes: [...], pagination: {...} } }
      const responseData = response.data || response;
      const pincodeData = responseData.data || responseData;

      setPincodes(pincodeData.pincodes || []);

      // Extract pagination info from nested pagination object
      const pagination = pincodeData.pagination || {};
      setTotalPages(pagination.totalPages || 1);
      setTotalRecords(pagination.totalPincodes || 0);
    } catch (error) {
      console.error('Error fetching pincodes:', error);
      toast.error('Failed to load pincodes');
      setPincodes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getPincodeStats();
      const data = response.data || response;
      setStats({
        total: data.total || 0,
        serviceable: data.serviceable || 0,
        nonServiceable: data.nonServiceable || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      const data = response.data || response;
      setCategories(data.categories || data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCreatePincode = async (data) => {
    try {
      await createPincode({
        pincode: data.pincode,
        city: data.city,
        district: data.district,
        state: data.state,
        deliveryZone: data.deliveryZone,
        isServiceable: data.isServiceable === 'true' || data.isServiceable === true,
        deliveryDays: parseInt(data.deliveryDays) || 0,
        restrictedCategories: selectedRestrictedCategories,
      });
      toast.success('Pincode created successfully');
      setShowModal(false);
      reset();
      setSelectedRestrictedCategories([]);
      fetchPincodes();
      fetchStats();
    } catch (error) {
      console.error('Error creating pincode:', error);
      toast.error(error.response?.data?.message || 'Failed to create pincode');
    }
  };

  const handleUpdatePincode = async (data) => {
    try {
      await updatePincode(selectedPincode._id, {
        pincode: data.pincode,
        city: data.city,
        district: data.district,
        state: data.state,
        deliveryZone: data.deliveryZone,
        isServiceable: data.isServiceable === 'true' || data.isServiceable === true,
        deliveryDays: parseInt(data.deliveryDays) || 0,
        restrictedCategories: selectedRestrictedCategories,
      });
      toast.success('Pincode updated successfully');
      setShowModal(false);
      reset();
      setSelectedPincode(null);
      setSelectedRestrictedCategories([]);
      fetchPincodes();
      fetchStats();
    } catch (error) {
      console.error('Error updating pincode:', error);
      toast.error(error.response?.data?.message || 'Failed to update pincode');
    }
  };

  const handleDeletePincode = async (pincode) => {
    if (!window.confirm(`Are you sure you want to delete pincode ${pincode.pincode}? This action cannot be undone.`)) {
      return;
    }

    try {
      await deletePincode(pincode._id);
      toast.success('Pincode deleted successfully');
      fetchPincodes();
      fetchStats();
    } catch (error) {
      console.error('Error deleting pincode:', error);
      toast.error(error.response?.data?.message || 'Failed to delete pincode');
    }
  };

  const handleBulkUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await bulkUploadPincodes(formData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      const data = response.data || response;
      toast.success(data.message || 'Pincodes uploaded successfully');

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        fetchPincodes();
        fetchStats();
      }, 1000);
    } catch (error) {
      console.error('Error uploading pincodes:', error);
      toast.error(error.response?.data?.message || 'Failed to upload pincodes');
      setIsUploading(false);
      setUploadProgress(0);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const blob = await downloadPincodeTemplate();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'pincode_template.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Template downloaded successfully');
    } catch (error) {
      console.error('Error downloading template:', error);
      toast.error('Failed to download template');
    }
  };

  const openModal = (type, pincode = null) => {
    setModalType(type);
    setSelectedPincode(pincode);

    if (type === 'edit' && pincode) {
      setValue('pincode', pincode.pincode);
      setValue('city', pincode.city);
      setValue('district', pincode.district);
      setValue('state', pincode.state);
      setValue('deliveryZone', pincode.deliveryZone);
      setValue('isServiceable', pincode.isServiceable.toString());
      // Handle both old and new formats: deliveryDays virtual or estimatedDeliveryDays.min
      const days = pincode.deliveryDays || pincode.estimatedDeliveryDays?.min || 0;
      setValue('deliveryDays', days);
      // Set restricted categories
      const restrictedIds = (pincode.restrictedCategories || []).map(cat =>
        typeof cat === 'string' ? cat : cat._id
      );
      setSelectedRestrictedCategories(restrictedIds);
    } else {
      reset();
      setSelectedRestrictedCategories([]);
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedPincode(null);
    setSelectedRestrictedCategories([]);
    reset();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded ${
            currentPage === i
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-700">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalRecords)} of {totalRecords} entries
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {startPage > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="px-3 py-1 rounded bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              >
                1
              </button>
              {startPage > 2 && <span className="px-2">...</span>}
            </>
          )}
          {pages}
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-2">...</span>}
              <button
                onClick={() => handlePageChange(totalPages)}
                className="px-3 py-1 rounded bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              >
                {totalPages}
              </button>
            </>
          )}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  if (loading && currentPage === 1) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Pincode Management</h1>
        <p className="text-gray-600 mt-1">Manage delivery pincodes and serviceability</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Pincodes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Serviceable</p>
              <p className="text-2xl font-bold text-gray-900">{stats.serviceable}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Non-Serviceable</p>
              <p className="text-2xl font-bold text-gray-900">{stats.nonServiceable}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          {/* Search and Filters Row */}
          <div className="mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
              <input
                type="text"
                placeholder="Search by pincode, city, or state..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="lg:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <select
                value={deliveryZoneFilter}
                onChange={(e) => {
                  setDeliveryZoneFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Zones</option>
                <option value="metro">Metro</option>
                <option value="urban">Urban</option>
                <option value="semi-urban">Semi-Urban</option>
                <option value="rural">Rural</option>
              </select>

              <select
                value={serviceabilityFilter}
                onChange={(e) => {
                  setServiceabilityFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="true">Serviceable</option>
                <option value="false">Non-Serviceable</option>
              </select>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => openModal('create')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Pincode</span>
              </button>

              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleBulkUpload}
                  className="hidden"
                  id="bulk-upload"
                />
                <label
                  htmlFor="bulk-upload"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition flex items-center space-x-2 cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span>Bulk Upload</span>
                </label>
              </div>

              <button
                onClick={handleDownloadTemplate}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Template</span>
              </button>
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900">Uploading pincodes...</span>
                <span className="text-sm font-medium text-blue-900">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Items per page selector */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-700">Show</label>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <label className="text-sm text-gray-700">entries</label>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pincode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    State
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery Zone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery Days
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Restrictions
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : pincodes.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                      No pincodes found
                    </td>
                  </tr>
                ) : (
                  pincodes.map((pincode) => (
                    <tr key={pincode._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{pincode.pincode}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{pincode.city}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{pincode.state}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          pincode.deliveryZone === 'metro' ? 'bg-purple-100 text-purple-800' :
                          pincode.deliveryZone === 'urban' ? 'bg-blue-100 text-blue-800' :
                          pincode.deliveryZone === 'semi-urban' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {pincode.deliveryZone === 'metro' ? 'Metro' :
                           pincode.deliveryZone === 'urban' ? 'Urban' :
                           pincode.deliveryZone === 'semi-urban' ? 'Semi-Urban' :
                           pincode.deliveryZone === 'rural' ? 'Rural' :
                           pincode.deliveryZone}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {pincode.deliveryDays || pincode.estimatedDeliveryDays?.min || 0} days
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          pincode.isServiceable
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {pincode.isServiceable ? 'Serviceable' : 'Non-Serviceable'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {pincode.restrictedCategories && pincode.restrictedCategories.length > 0 ? (
                          <div className="flex items-center space-x-1">
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                              {pincode.restrictedCategories.length} restricted
                            </span>
                            <div className="group relative">
                              <svg className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div className="hidden group-hover:block absolute z-10 w-48 p-2 mt-2 text-xs bg-gray-900 text-white rounded shadow-lg">
                                {pincode.restrictedCategories.map(cat => (
                                  <div key={cat._id || cat}>{cat.name || cat}</div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">None</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => openModal('edit', pincode)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit Pincode"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeletePincode(pincode)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Pincode"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && pincodes.length > 0 && renderPagination()}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {modalType === 'create' ? 'Add New Pincode' : 'Edit Pincode'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit(modalType === 'create' ? handleCreatePincode : handleUpdatePincode)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode
                    </label>
                    <input
                      type="text"
                      {...register('pincode', {
                        required: 'Pincode is required',
                        pattern: {
                          value: /^[0-9]{6}$/,
                          message: 'Pincode must be 6 digits',
                        },
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="123456"
                      disabled={modalType === 'edit'}
                    />
                    {errors.pincode && (
                      <p className="mt-1 text-sm text-red-600">{errors.pincode.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      {...register('city', { required: 'City is required' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter city name"
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District
                    </label>
                    <input
                      type="text"
                      {...register('district', { required: 'District is required' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter district name"
                    />
                    {errors.district && (
                      <p className="mt-1 text-sm text-red-600">{errors.district.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      {...register('state', { required: 'State is required' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter state name"
                    />
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Zone
                    </label>
                    <select
                      {...register('deliveryZone', { required: 'Delivery zone is required' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Zone</option>
                      <option value="metro">Metro (1-2 days)</option>
                      <option value="urban">Urban (2-3 days)</option>
                      <option value="semi-urban">Semi-Urban (3-5 days)</option>
                      <option value="rural">Rural (5-7 days)</option>
                    </select>
                    {errors.deliveryZone && (
                      <p className="mt-1 text-sm text-red-600">{errors.deliveryZone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Days
                    </label>
                    <input
                      type="number"
                      min="0"
                      {...register('deliveryDays', {
                        required: 'Delivery days is required',
                        min: { value: 0, message: 'Delivery days cannot be negative' },
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                    {errors.deliveryDays && (
                      <p className="mt-1 text-sm text-red-600">{errors.deliveryDays.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Serviceability Status
                    </label>
                    <select
                      {...register('isServiceable', { required: 'Status is required' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Status</option>
                      <option value="true">Serviceable</option>
                      <option value="false">Non-Serviceable</option>
                    </select>
                    {errors.isServiceable && (
                      <p className="mt-1 text-sm text-red-600">{errors.isServiceable.message}</p>
                    )}
                  </div>
                </div>

                {/* Restricted Categories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Restricted Categories (Optional)
                  </label>
                  <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
                    {categories.length === 0 ? (
                      <p className="text-sm text-gray-500">No categories available</p>
                    ) : (
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <label
                            key={category._id}
                            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                          >
                            <input
                              type="checkbox"
                              checked={selectedRestrictedCategories.includes(category._id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedRestrictedCategories([...selectedRestrictedCategories, category._id]);
                                } else {
                                  setSelectedRestrictedCategories(
                                    selectedRestrictedCategories.filter(id => id !== category._id)
                                  );
                                }
                              }}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-900">{category.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Products in selected categories will NOT be deliverable to this pincode
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex">
                    <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">Delivery Zone Information</p>
                      <ul className="mt-1 list-disc list-inside">
                        <li>Metro: Major cities (1-2 day delivery)</li>
                        <li>Urban: Tier 2 cities (2-3 day delivery)</li>
                        <li>Semi-Urban: Tier 3 cities (3-5 day delivery)</li>
                        <li>Rural: Remote areas (5-7 day delivery)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    {modalType === 'create' ? 'Create Pincode' : 'Update Pincode'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pincodes;
