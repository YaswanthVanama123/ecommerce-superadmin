import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById, getUserOrders, updateUserStatus } from '../../api';
import { toast } from 'react-toastify';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const [userRes, ordersRes] = await Promise.all([
        getUserById(id),
        getUserOrders(id),
      ]);
      setUser(userRes.user);
      setOrders(ordersRes.orders || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load user details');
      navigate('/users');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async () => {
    const newStatus = !user.isActive;
    const action = newStatus ? 'activate' : 'deactivate';

    if (!window.confirm(`Are you sure you want to ${action} this user?`)) {
      return;
    }

    setUpdating(true);
    try {
      await updateUserStatus(id, newStatus);
      toast.success(`User ${action}d successfully`);
      fetchUserData();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">User not found</h1>
          <button
            onClick={() => navigate('/users')}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

  return (
    <div className="p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate('/users')}
          className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Users
        </button>
        <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-semibold">
                {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{user.name || 'N/A'}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>

            <div className="space-y-3 border-t border-gray-200 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Role:</span>
                <span className="font-medium text-gray-900">{user.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    user.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Joined:</span>
                <span className="font-medium text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              {user.phone && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium text-gray-900">{user.phone}</span>
                </div>
              )}
            </div>

            {user.role !== 'admin' && user.role !== 'superadmin' && (
              <div className="mt-6">
                <button
                  onClick={handleStatusToggle}
                  disabled={updating}
                  className={`w-full px-4 py-2 rounded-lg font-medium transition ${
                    user.isActive
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {updating ? 'Updating...' : user.isActive ? 'Deactivate User' : 'Activate User'}
                </button>
              </div>
            )}
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Statistics</h3>
            <div className="space-y-3">
              <div>
                <div className="text-gray-600 text-sm">Total Orders</div>
                <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
              </div>
              <div>
                <div className="text-gray-600 text-sm">Total Spent</div>
                <div className="text-2xl font-bold text-gray-900">${totalSpent.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-gray-600 text-sm">Average Order</div>
                <div className="text-2xl font-bold text-gray-900">
                  ${orders.length > 0 ? (totalSpent / orders.length).toFixed(2) : '0.00'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Order History</h3>
            {orders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No orders found for this user
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium text-gray-900">
                          Order #{order.orderNumber || order._id.slice(-8)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">
                          ${order.totalAmount?.toFixed(2)}
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === 'delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      {order.items?.length || 0} item(s)
                    </div>
                    <button
                      onClick={() => navigate(`/orders/${order._id}`)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
