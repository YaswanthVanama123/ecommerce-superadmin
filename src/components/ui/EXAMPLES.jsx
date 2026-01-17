/**
 * Example Usage of UI Components
 *
 * This file demonstrates how to use the UI component library
 * in a real-world scenario.
 */

import { useState } from 'react';
import {
  // Layout
  SuperadminLayout,
  Breadcrumbs,

  // Data Display
  DataTable,
  StatsCard,
  Charts,
  EmptyState,

  // Forms
  FormInput,
  FormSelect,
  FormTextarea,
  ImageUpload,

  // Feedback
  Modal,
  ConfirmDialog,
  ToastContainer,
  LoadingSpinner,
  ErrorMessage,

  // Actions
  ActionButton,
  DropdownMenu,
  Tabs,
  Pagination,

  // Hooks
  useToast,
  useModal,
  usePagination,
} from '@/components/ui';

// ============================================================================
// Example 1: Product List Page
// ============================================================================

export function ProductListExample() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const { toasts, success, error, removeToast } = useToast();
  const { isOpen, open, close } = useModal();
  const { currentPage, goToPage, getTotalPages } = usePagination(1, 10);

  const columns = [
    { key: 'name', label: 'Product Name', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'price', label: 'Price', sortable: true, render: (value) => `$${value}` },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded text-xs ${
          value === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <DropdownMenu
          trigger={
            <ActionButton variant="ghost" size="sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </ActionButton>
          }
          items={[
            { label: 'Edit', onClick: () => handleEdit(row.id) },
            { label: 'View Details', onClick: () => handleView(row.id) },
            { divider: true },
            { label: 'Delete', onClick: () => handleDelete(row.id), danger: true }
          ]}
        />
      )
    }
  ];

  const handleEdit = (id) => {
    console.log('Edit product:', id);
    open();
  };

  const handleView = (id) => {
    console.log('View product:', id);
  };

  const handleDelete = (id) => {
    console.log('Delete product:', id);
    success('Product deleted successfully');
  };

  return (
    <SuperadminLayout>
      <div className="p-6">
        <Breadcrumbs
          items={[
            { label: 'Products', path: '/products' },
            { label: 'All Products' }
          ]}
        />

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <ActionButton
            variant="primary"
            onClick={open}
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Add Product
          </ActionButton>
        </div>

        <DataTable
          columns={columns}
          data={products}
          loading={loading}
          onRowClick={(row) => handleView(row.id)}
          emptyMessage="No products found"
        />

        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={getTotalPages(products.length)}
            totalItems={products.length}
            itemsPerPage={10}
            onPageChange={goToPage}
          />
        </div>

        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </SuperadminLayout>
  );
}

// ============================================================================
// Example 2: Dashboard with Stats and Charts
// ============================================================================

export function DashboardExample() {
  const salesData = [
    { month: 'Jan', sales: 4000, revenue: 2400 },
    { month: 'Feb', sales: 3000, revenue: 1398 },
    { month: 'Mar', sales: 2000, revenue: 9800 },
    { month: 'Apr', sales: 2780, revenue: 3908 },
    { month: 'May', sales: 1890, revenue: 4800 },
    { month: 'Jun', sales: 2390, revenue: 3800 },
  ];

  return (
    <SuperadminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatsCard
            title="Total Users"
            value="1,234"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            trend="up"
            trendValue="+12%"
            description="vs last month"
            color="blue"
          />

          <StatsCard
            title="Revenue"
            value="$45,231"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            trend="up"
            trendValue="+8%"
            description="vs last month"
            color="green"
          />

          <StatsCard
            title="Orders"
            value="324"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            }
            trend="down"
            trendValue="-3%"
            description="vs last month"
            color="yellow"
          />

          <StatsCard
            title="Products"
            value="89"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
            trend="neutral"
            description="Active products"
            color="purple"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Charts
            type="line"
            title="Sales Overview"
            data={salesData}
            series={[
              { dataKey: 'sales', color: '#3B82F6', name: 'Sales' },
              { dataKey: 'revenue', color: '#10B981', name: 'Revenue' }
            ]}
            xAxisKey="month"
            height={300}
          />

          <Charts
            type="bar"
            title="Monthly Revenue"
            data={salesData}
            series={[
              { dataKey: 'revenue', color: '#10B981', name: 'Revenue' }
            ]}
            xAxisKey="month"
            height={300}
          />
        </div>
      </div>
    </SuperadminLayout>
  );
}

// ============================================================================
// Example 3: Form with Validation
// ============================================================================

export function ProductFormExample() {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  const categories = [
    { value: '1', label: 'Electronics' },
    { value: '2', label: 'Clothing' },
    { value: '3', label: 'Books' },
    { value: '4', label: 'Home & Garden' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (file, error) => {
    if (error) {
      setErrors(prev => ({ ...prev, image: error }));
    } else {
      setFormData(prev => ({ ...prev, image: file }));
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Product name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (formData.price && isNaN(formData.price)) newErrors.price = 'Price must be a number';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      success('Product created successfully');
      setFormData({ name: '', category: '', price: '', description: '', image: null });
    } catch (err) {
      error('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SuperadminLayout>
      <div className="p-6 max-w-2xl mx-auto">
        <Breadcrumbs
          items={[
            { label: 'Products', path: '/products' },
            { label: 'Add Product' }
          ]}
        />

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Product</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <FormInput
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Enter product name"
            required
          />

          <FormSelect
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={categories}
            error={errors.category}
            placeholder="Select a category"
            required
          />

          <FormInput
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            error={errors.price}
            placeholder="0.00"
            leftIcon={
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            required
          />

          <FormTextarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            placeholder="Enter product description"
            rows={5}
            maxLength={500}
            showCount
          />

          <ImageUpload
            label="Product Image"
            name="image"
            onChange={handleImageChange}
            error={errors.image}
            maxSize={5}
          />

          <div className="flex gap-3 justify-end mt-6">
            <ActionButton
              type="button"
              variant="secondary"
              onClick={() => window.history.back()}
            >
              Cancel
            </ActionButton>
            <ActionButton
              type="submit"
              variant="primary"
              loading={loading}
            >
              Create Product
            </ActionButton>
          </div>
        </form>
      </div>
    </SuperadminLayout>
  );
}

// ============================================================================
// Example 4: Modal and Confirm Dialog
// ============================================================================

export function ModalExample() {
  const { isOpen: isModalOpen, open: openModal, close: closeModal } = useModal();
  const { isOpen: isConfirmOpen, open: openConfirm, close: closeConfirm } = useModal();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { success } = useToast();

  const handleDelete = async () => {
    setDeleteLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setDeleteLoading(false);
    closeConfirm();
    success('Item deleted successfully');
  };

  return (
    <div className="p-6">
      <div className="space-x-4">
        <ActionButton onClick={openModal}>Open Modal</ActionButton>
        <ActionButton variant="danger" onClick={openConfirm}>Delete Item</ActionButton>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Edit Profile"
        size="md"
        footer={
          <>
            <ActionButton variant="secondary" onClick={closeModal}>
              Cancel
            </ActionButton>
            <ActionButton onClick={closeModal}>
              Save Changes
            </ActionButton>
          </>
        }
      >
        <div className="space-y-4">
          <FormInput label="Name" placeholder="Enter your name" />
          <FormInput label="Email" type="email" placeholder="Enter your email" />
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={closeConfirm}
        onConfirm={handleDelete}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        variant="danger"
        confirmText="Delete"
        loading={deleteLoading}
      />
    </div>
  );
}

// ============================================================================
// Example 5: Tabs
// ============================================================================

export function TabsExample() {
  const tabs = [
    {
      id: 'details',
      label: 'Details',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      content: (
        <div className="p-4 bg-white rounded-lg">
          <h3 className="font-semibold mb-2">Product Details</h3>
          <p className="text-gray-600">This is the details tab content.</p>
        </div>
      )
    },
    {
      id: 'pricing',
      label: 'Pricing',
      content: (
        <div className="p-4 bg-white rounded-lg">
          <h3 className="font-semibold mb-2">Pricing Information</h3>
          <p className="text-gray-600">This is the pricing tab content.</p>
        </div>
      )
    },
    {
      id: 'inventory',
      label: 'Inventory',
      content: (
        <div className="p-4 bg-white rounded-lg">
          <h3 className="font-semibold mb-2">Inventory Status</h3>
          <p className="text-gray-600">This is the inventory tab content.</p>
        </div>
      )
    }
  ];

  return (
    <div className="p-6">
      <Tabs
        tabs={tabs}
        defaultTab="details"
        variant="line"
        onChange={(tabId) => console.log('Active tab:', tabId)}
      />
    </div>
  );
}
