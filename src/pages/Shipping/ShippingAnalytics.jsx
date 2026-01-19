import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ChartBarIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import api from '../../api';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const ShippingAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  // Analytics Data
  const [overview, setOverview] = useState(null);
  const [carriers, setCarriers] = useState([]);
  const [performanceTrends, setPerformanceTrends] = useState([]);
  const [successRate, setSuccessRate] = useState(null);
  const [topCarriers, setTopCarriers] = useState([]);
  const [failedDeliveries, setFailedDeliveries] = useState([]);
  const [delayedShipments, setDelayedShipments] = useState([]);
  const [regionalData, setRegionalData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const [
        overviewRes,
        carriersRes,
        performanceRes,
        topCarriersRes,
        failedRes,
        delayedRes,
        regionalRes,
        revenueRes
      ] = await Promise.all([
        api.get('/analytics/shipping/overview', { params: dateRange }),
        api.get('/analytics/shipping/carriers', { params: dateRange }),
        api.get('/analytics/shipping/performance', { params: { ...dateRange, interval: 'day' } }),
        api.get('/analytics/shipping/top-carriers', { params: { ...dateRange, limit: 5 } }),
        api.get('/analytics/shipping/failed-deliveries', { params: { ...dateRange, limit: 10 } }),
        api.get('/analytics/shipping/delayed-shipments', { params: { limit: 10 } }),
        api.get('/analytics/shipping/regional', { params: { ...dateRange, groupBy: 'state' } }),
        api.get('/analytics/shipping/revenue', { params: dateRange })
      ]);

      setOverview(overviewRes.data.data);
      setCarriers(carriersRes.data.data);
      setPerformanceTrends(performanceRes.data.data.trends);
      setSuccessRate(performanceRes.data.data.successRate);
      setTopCarriers(topCarriersRes.data.data);
      setFailedDeliveries(failedRes.data.data);
      setDelayedShipments(delayedRes.data.data);
      setRegionalData(regionalRes.data.data);
      setRevenueData(revenueRes.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load shipping analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  const exportReport = () => {
    const reportData = {
      overview,
      carriers,
      successRate,
      topCarriers,
      failedDeliveries,
      delayedShipments,
      regionalData,
      revenueData,
      dateRange
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `shipping-analytics-${dateRange.startDate}-to-${dateRange.endDate}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Report exported successfully');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shipping Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive delivery and carrier performance metrics</p>
        </div>
        <button
          onClick={exportReport}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <ArrowDownTrayIcon className="h-5 w-5" />
          Export Report
        </button>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={fetchAnalytics}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Shipments</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{overview.totalShipments}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <TruckIcon className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Transit</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{overview.statusBreakdown.inTransit}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <ClockIcon className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{overview.statusBreakdown.delivered}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{overview.statusBreakdown.failed}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <XCircleIcon className="h-8 w-8 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Rate and Delivery Metrics */}
      {successRate && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Success Rate</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Success Rate</span>
                  <span className="text-sm font-semibold text-green-600">{successRate.successRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${successRate.successRate}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Failure Rate</span>
                  <span className="text-sm font-semibold text-red-600">{successRate.failureRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{ width: `${successRate.failureRate}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Return Rate</span>
                  <span className="text-sm font-semibold text-orange-600">{successRate.returnRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full"
                    style={{ width: `${successRate.returnRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {overview && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Average Delivery Time</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Average</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {overview.deliveryMetrics.averageDeliveryTime} days
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Fastest</span>
                  <span className="text-lg font-semibold text-green-600">
                    {overview.deliveryMetrics.minDeliveryTime} days
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Slowest</span>
                  <span className="text-lg font-semibold text-red-600">
                    {overview.deliveryMetrics.maxDeliveryTime} days
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Carrier Performance Chart */}
      {carriers.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Carrier Performance Comparison</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={carriers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="carrier" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="successRate" fill="#10B981" name="Success Rate (%)" />
              <Bar dataKey="averageDeliveryTime" fill="#3B82F6" name="Avg Delivery Time (days)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Delivery Time Trends */}
      {performanceTrends.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Time Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="averageDeliveryTime"
                stroke="#3B82F6"
                strokeWidth={2}
                name="Avg Delivery Time (days)"
              />
              <Line
                type="monotone"
                dataKey="totalDeliveries"
                stroke="#10B981"
                strokeWidth={2}
                name="Total Deliveries"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top Performing Carriers */}
      {topCarriers.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Performing Carriers</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Carrier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Success Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Delivery</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Shipments</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topCarriers.map((carrier, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900">{carrier.carrier}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded-full">
                        {carrier.performanceScore}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{carrier.successRate}%</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{carrier.averageDeliveryTime} days</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{carrier.totalShipments}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Revenue by Carrier */}
      {revenueData.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Revenue by Shipping Carrier</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueData}
                  dataKey="totalRevenue"
                  nameKey="carrier"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {revenueData.map((carrier, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="font-medium">{carrier.carrier}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">₹{carrier.totalRevenue.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">{carrier.totalOrders} orders</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Failed Deliveries */}
      {failedDeliveries.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Failed Deliveries</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tracking</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Carrier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {failedDeliveries.map((delivery, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {delivery.trackingNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {delivery.orderNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {delivery.carrier}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {delivery.recipientName} - {delivery.recipientCity}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {delivery.failureReason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(delivery.failureDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delayed Shipments */}
      {delayedShipments.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Delayed Shipments</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tracking</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Carrier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delay</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expected</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {delayedShipments.map((shipment, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {shipment.trackingNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {shipment.carrier}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">
                        {shipment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {shipment.currentLocation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">
                        {shipment.delayInDays} days
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(shipment.estimatedDeliveryDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Regional Analytics */}
      {regionalData.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Regional Delivery Performance</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Region</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Shipments</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivered</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Success Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Delivery</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Carriers Used</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {regionalData.slice(0, 10).map((region, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {region.region}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {region.totalShipments}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {region.delivered}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        region.successRate >= 90 ? 'text-green-800 bg-green-100' :
                        region.successRate >= 70 ? 'text-yellow-800 bg-yellow-100' :
                        'text-red-800 bg-red-100'
                      }`}>
                        {region.successRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {region.averageDeliveryTime} days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {region.carriersUsed}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingAnalytics;
