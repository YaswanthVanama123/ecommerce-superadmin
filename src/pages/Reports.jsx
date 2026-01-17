import { useState, useEffect, useRef } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, ComposedChart
} from 'recharts';
import { toast } from 'react-toastify';
import {
  reportsAPI,
  getUserReport,
  getProductReport,
  getOrderReport,
  getCustomReport,
  exportReportToCSV,
  exportReportToPDF
} from '../api';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Date range state
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  // Report data state
  const [salesReport, setSalesReport] = useState(null);
  const [userReport, setUserReport] = useState(null);
  const [productReport, setProductReport] = useState(null);
  const [orderReport, setOrderReport] = useState(null);
  const [customReport, setCustomReport] = useState(null);

  // Sales report filters
  const [salesPeriod, setSalesPeriod] = useState('monthly');

  // User report filters
  const [userMetric, setUserMetric] = useState('registrations');

  // Product report filters
  const [productMetric, setProductMetric] = useState('best-sellers');
  const [productLimit, setProductLimit] = useState(10);

  // Order report filters
  const [orderStatus, setOrderStatus] = useState('all');

  // Custom report filters
  const [customMetrics, setCustomMetrics] = useState({
    sales: true,
    users: true,
    products: true,
    orders: true
  });

  const printRef = useRef();

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

  useEffect(() => {
    fetchReportData();
  }, [activeTab, dateRange, salesPeriod, userMetric, productMetric, orderStatus, productLimit]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'sales':
          const salesResponse = await reportsAPI.getSalesReport(dateRange.startDate, dateRange.endDate, salesPeriod);
          // Backend returns: { success: true, data: {...} }
          setSalesReport(salesResponse.data || salesResponse);
          break;
        case 'users':
          const userResponse = await getUserReport(dateRange.startDate, dateRange.endDate, userMetric);
          setUserReport(userResponse.data || userResponse);
          break;
        case 'products':
          const productResponse = await getProductReport(dateRange.startDate, dateRange.endDate, productMetric, productLimit);
          setProductReport(productResponse.data || productResponse);
          break;
        case 'orders':
          const orderResponse = await getOrderReport(dateRange.startDate, dateRange.endDate, orderStatus);
          setOrderReport(orderResponse.data || orderResponse);
          break;
        case 'custom':
          const customResponse = await getCustomReport(dateRange.startDate, dateRange.endDate, customMetrics);
          setCustomReport(customResponse.data || customResponse);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
      toast.error('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const reportData = {
        sales: salesReport,
        users: userReport,
        products: productReport,
        orders: orderReport,
        custom: customReport
      }[activeTab];

      const blob = await exportReportToCSV(activeTab, reportData, dateRange);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${activeTab}-report-${dateRange.startDate}-to-${dateRange.endDate}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Report exported to CSV successfully');
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      toast.error('Failed to export report to CSV');
    } finally {
      setExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const reportData = {
        sales: salesReport,
        users: userReport,
        products: productReport,
        orders: orderReport,
        custom: customReport
      }[activeTab];

      const blob = await exportReportToPDF(activeTab, reportData, dateRange);
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${activeTab}-report-${dateRange.startDate}-to-${dateRange.endDate}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Report exported to PDF successfully');
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast.error('Failed to export report to PDF');
    } finally {
      setExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const tabs = [
    { id: 'sales', name: 'Sales Reports', icon: '📊' },
    { id: 'users', name: 'User Reports', icon: '👥' },
    { id: 'products', name: 'Product Reports', icon: '📦' },
    { id: 'orders', name: 'Order Reports', icon: '🛒' },
    { id: 'custom', name: 'Custom Reports', icon: '⚙️' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">Comprehensive analytics and reporting</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>
          <button
            onClick={handleExportCSV}
            disabled={exporting}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            {exporting ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white rounded-xl shadow-md p-4 print:hidden">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">From:</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">To:</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={fetchReportData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply
          </button>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => {
                const today = new Date();
                setDateRange({
                  startDate: today.toISOString().split('T')[0],
                  endDate: today.toISOString().split('T')[0]
                });
              }}
              className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => {
                const today = new Date();
                const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                setDateRange({
                  startDate: weekAgo.toISOString().split('T')[0],
                  endDate: today.toISOString().split('T')[0]
                });
              }}
              className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Last 7 Days
            </button>
            <button
              onClick={() => {
                const today = new Date();
                const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                setDateRange({
                  startDate: monthAgo.toISOString().split('T')[0],
                  endDate: today.toISOString().split('T')[0]
                });
              }}
              className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Last 30 Days
            </button>
            <button
              onClick={() => {
                const today = new Date();
                const yearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
                setDateRange({
                  startDate: yearAgo.toISOString().split('T')[0],
                  endDate: today.toISOString().split('T')[0]
                });
              }}
              className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Last Year
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-md print:shadow-none">
        <div className="border-b border-gray-200 print:hidden">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div ref={printRef} className="p-6">
          {/* Print Header */}
          <div className="hidden print:block mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {tabs.find(t => t.id === activeTab)?.name}
            </h1>
            <p className="text-gray-600 mt-1">
              Period: {dateRange.startDate} to {dateRange.endDate}
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {activeTab === 'sales' && <SalesReportContent
                report={salesReport}
                period={salesPeriod}
                setPeriod={setSalesPeriod}
                colors={COLORS}
              />}
              {activeTab === 'users' && <UserReportContent
                report={userReport}
                metric={userMetric}
                setMetric={setUserMetric}
                colors={COLORS}
              />}
              {activeTab === 'products' && <ProductReportContent
                report={productReport}
                metric={productMetric}
                setMetric={setProductMetric}
                limit={productLimit}
                setLimit={setProductLimit}
                colors={COLORS}
              />}
              {activeTab === 'orders' && <OrderReportContent
                report={orderReport}
                status={orderStatus}
                setStatus={setOrderStatus}
                colors={COLORS}
              />}
              {activeTab === 'custom' && <CustomReportContent
                report={customReport}
                metrics={customMetrics}
                setMetrics={setCustomMetrics}
                colors={COLORS}
              />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Sales Report Component
const SalesReportContent = ({ report, period, setPeriod, colors }) => {
  if (!report) return <div className="text-center text-gray-500 py-12">No sales data available</div>;

  const { summary, chartData, topProducts, salesByCategory } = report;

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex gap-2 print:hidden">
        {['daily', 'weekly', 'monthly', 'yearly'].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-lg capitalize transition-colors ${
              period === p
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white print:border print:border-blue-300">
          <div className="text-sm opacity-90 mb-1">Total Revenue</div>
          <div className="text-3xl font-bold">${summary?.totalRevenue?.toLocaleString() || 0}</div>
          <div className="text-sm opacity-80 mt-2">
            {summary?.revenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(summary?.revenueGrowth || 0).toFixed(1)}% from previous period
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white print:border print:border-green-300">
          <div className="text-sm opacity-90 mb-1">Total Orders</div>
          <div className="text-3xl font-bold">{summary?.totalOrders?.toLocaleString() || 0}</div>
          <div className="text-sm opacity-80 mt-2">
            {summary?.ordersGrowth >= 0 ? '↑' : '↓'} {Math.abs(summary?.ordersGrowth || 0).toFixed(1)}% from previous period
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-md p-6 text-white print:border print:border-yellow-300">
          <div className="text-sm opacity-90 mb-1">Average Order Value</div>
          <div className="text-3xl font-bold">${summary?.averageOrderValue?.toFixed(2) || 0}</div>
          <div className="text-sm opacity-80 mt-2">
            {summary?.aovGrowth >= 0 ? '↑' : '↓'} {Math.abs(summary?.aovGrowth || 0).toFixed(1)}% from previous period
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white print:border print:border-purple-300">
          <div className="text-sm opacity-90 mb-1">Items Sold</div>
          <div className="text-3xl font-bold">{summary?.totalItemsSold?.toLocaleString() || 0}</div>
          <div className="text-sm opacity-80 mt-2">
            {summary?.itemsGrowth >= 0 ? '↑' : '↓'} {Math.abs(summary?.itemsGrowth || 0).toFixed(1)}% from previous period
          </div>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="bg-white rounded-xl shadow-md p-6 print:break-inside-avoid">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Revenue & Orders Trend</h3>
        {chartData && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="revenue" fill="#3B82F6" stroke="#3B82F6" fillOpacity={0.3} name="Revenue ($)" />
              <Bar yAxisId="right" dataKey="orders" fill="#10B981" name="Orders" />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[350px] flex items-center justify-center text-gray-500">No chart data available</div>
        )}
      </div>

      {/* Top Products and Sales by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-md p-6 print:break-inside-avoid">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Top Products</h3>
          {topProducts && topProducts.length > 0 ? (
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-600">{product.sold} units sold</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">${product.revenue?.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">revenue</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">No product data available</div>
          )}
        </div>

        {/* Sales by Category */}
        <div className="bg-white rounded-xl shadow-md p-6 print:break-inside-avoid">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Sales by Category</h3>
          {salesByCategory && salesByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={salesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {salesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">No category data available</div>
          )}
        </div>
      </div>
    </div>
  );
};

// User Report Component
const UserReportContent = ({ report, metric, setMetric, colors }) => {
  if (!report) return <div className="text-center text-gray-500 py-12">No user data available</div>;

  const { summary, chartData, demographics, topUsers } = report;

  return (
    <div className="space-y-6">
      {/* Metric Selector */}
      <div className="flex gap-2 print:hidden">
        {['registrations', 'retention', 'demographics', 'activity'].map((m) => (
          <button
            key={m}
            onClick={() => setMetric(m)}
            className={`px-4 py-2 rounded-lg capitalize transition-colors ${
              metric === m
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white print:border print:border-blue-300">
          <div className="text-sm opacity-90 mb-1">Total Users</div>
          <div className="text-3xl font-bold">{summary?.totalUsers?.toLocaleString() || 0}</div>
          <div className="text-sm opacity-80 mt-2">
            {summary?.userGrowth >= 0 ? '↑' : '↓'} {Math.abs(summary?.userGrowth || 0).toFixed(1)}% growth
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white print:border print:border-green-300">
          <div className="text-sm opacity-90 mb-1">Active Users</div>
          <div className="text-3xl font-bold">{summary?.activeUsers?.toLocaleString() || 0}</div>
          <div className="text-sm opacity-80 mt-2">
            {((summary?.activeUsers / summary?.totalUsers) * 100).toFixed(1)}% of total
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-md p-6 text-white print:border print:border-yellow-300">
          <div className="text-sm opacity-90 mb-1">New Users</div>
          <div className="text-3xl font-bold">{summary?.newUsers?.toLocaleString() || 0}</div>
          <div className="text-sm opacity-80 mt-2">in selected period</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white print:border print:border-purple-300">
          <div className="text-sm opacity-90 mb-1">Retention Rate</div>
          <div className="text-3xl font-bold">{summary?.retentionRate?.toFixed(1) || 0}%</div>
          <div className="text-sm opacity-80 mt-2">30-day retention</div>
        </div>
      </div>

      {/* User Growth Chart */}
      <div className="bg-white rounded-xl shadow-md p-6 print:break-inside-avoid">
        <h3 className="text-xl font-bold text-gray-900 mb-4">User Growth Trend</h3>
        {chartData && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="newUsers" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} name="New Users" />
              <Area type="monotone" dataKey="activeUsers" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Active Users" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[350px] flex items-center justify-center text-gray-500">No chart data available</div>
        )}
      </div>

      {/* Demographics and Top Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demographics */}
        <div className="bg-white rounded-xl shadow-md p-6 print:break-inside-avoid">
          <h3 className="text-xl font-bold text-gray-900 mb-4">User Demographics</h3>
          {demographics ? (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">By Age Group</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={demographics.ageGroups || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">By Location (Top 5)</h4>
                <div className="space-y-2">
                  {demographics.locations?.slice(0, 5).map((location, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700">{location.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(location.count / demographics.locations[0].count) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">{location.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">No demographic data available</div>
          )}
        </div>

        {/* Top Users */}
        <div className="bg-white rounded-xl shadow-md p-6 print:break-inside-avoid">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Top Customers</h3>
          {topUsers && topUsers.length > 0 ? (
            <div className="space-y-3">
              {topUsers.map((user, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">${user.totalSpent?.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">{user.orderCount} orders</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">No user data available</div>
          )}
        </div>
      </div>
    </div>
  );
};

// Product Report Component
const ProductReportContent = ({ report, metric, setMetric, limit, setLimit, colors }) => {
  if (!report) return <div className="text-center text-gray-500 py-12">No product data available</div>;

  const { summary, products, categoryPerformance, inventoryStatus } = report;

  return (
    <div className="space-y-6">
      {/* Metric Selector */}
      <div className="flex items-center gap-4 flex-wrap print:hidden">
        <div className="flex gap-2">
          {['best-sellers', 'low-stock', 'performance', 'inventory'].map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                metric === m
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {m.replace('-', ' ')}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <label className="text-sm font-medium text-gray-700">Show:</label>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
            <option value={20}>Top 20</option>
            <option value={50}>Top 50</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white print:border print:border-blue-300">
          <div className="text-sm opacity-90 mb-1">Total Products</div>
          <div className="text-3xl font-bold">{summary?.totalProducts?.toLocaleString() || 0}</div>
          <div className="text-sm opacity-80 mt-2">{summary?.activeProducts || 0} active</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white print:border print:border-green-300">
          <div className="text-sm opacity-90 mb-1">Products Sold</div>
          <div className="text-3xl font-bold">{summary?.productsSold?.toLocaleString() || 0}</div>
          <div className="text-sm opacity-80 mt-2">in selected period</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-md p-6 text-white print:border print:border-yellow-300">
          <div className="text-sm opacity-90 mb-1">Low Stock Items</div>
          <div className="text-3xl font-bold">{summary?.lowStockCount?.toLocaleString() || 0}</div>
          <div className="text-sm opacity-80 mt-2">need restocking</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white print:border print:border-purple-300">
          <div className="text-sm opacity-90 mb-1">Avg. Product Rating</div>
          <div className="text-3xl font-bold">{summary?.averageRating?.toFixed(1) || 0}</div>
          <div className="text-sm opacity-80 mt-2">out of 5.0</div>
        </div>
      </div>

      {/* Products List */}
      <div className="bg-white rounded-xl shadow-md p-6 print:break-inside-avoid">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {metric === 'best-sellers' && 'Best Selling Products'}
          {metric === 'low-stock' && 'Low Stock Products'}
          {metric === 'performance' && 'Product Performance'}
          {metric === 'inventory' && 'Inventory Status'}
        </h3>
        {products && products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {metric === 'best-sellers' && 'Units Sold'}
                    {metric === 'low-stock' && 'Stock Level'}
                    {metric === 'performance' && 'Revenue'}
                    {metric === 'inventory' && 'Quantity'}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {metric === 'best-sellers' && 'Revenue'}
                    {metric === 'low-stock' && 'Status'}
                    {metric === 'performance' && 'Orders'}
                    {metric === 'inventory' && 'Value'}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {metric === 'performance' && 'Avg. Rating'}
                    {metric !== 'performance' && 'Price'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.sku}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{product.category}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {metric === 'best-sellers' && product.unitsSold?.toLocaleString()}
                      {metric === 'low-stock' && (
                        <span className={product.stock < 10 ? 'text-red-600' : 'text-yellow-600'}>
                          {product.stock}
                        </span>
                      )}
                      {metric === 'performance' && `$${product.revenue?.toLocaleString()}`}
                      {metric === 'inventory' && product.quantity?.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {metric === 'best-sellers' && `$${product.revenue?.toLocaleString()}`}
                      {metric === 'low-stock' && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          product.stock < 5 ? 'bg-red-100 text-red-800' :
                          product.stock < 10 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {product.stock < 5 ? 'Critical' : product.stock < 10 ? 'Low' : 'Normal'}
                        </span>
                      )}
                      {metric === 'performance' && product.orderCount}
                      {metric === 'inventory' && `$${(product.quantity * product.price)?.toLocaleString()}`}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {metric === 'performance' ? (
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          {product.rating?.toFixed(1) || 'N/A'}
                        </div>
                      ) : (
                        `$${product.price?.toFixed(2)}`
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">No product data available</div>
        )}
      </div>

      {/* Category Performance */}
      {metric === 'performance' && categoryPerformance && (
        <div className="bg-white rounded-xl shadow-md p-6 print:break-inside-avoid">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Category Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#3B82F6" name="Revenue ($)" />
              <Bar dataKey="sales" fill="#10B981" name="Sales" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Inventory Status Chart */}
      {metric === 'inventory' && inventoryStatus && (
        <div className="bg-white rounded-xl shadow-md p-6 print:break-inside-avoid">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Inventory Status Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={inventoryStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {inventoryStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

// Order Report Component
const OrderReportContent = ({ report, status, setStatus, colors }) => {
  if (!report) return <div className="text-center text-gray-500 py-12">No order data available</div>;

  const { summary, chartData, ordersByStatus, recentOrders } = report;

  return (
    <div className="space-y-6">
      {/* Status Selector */}
      <div className="flex gap-2 print:hidden">
        {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-4 py-2 rounded-lg capitalize transition-colors ${
              status === s
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white print:border print:border-blue-300">
          <div className="text-sm opacity-90 mb-1">Total Orders</div>
          <div className="text-3xl font-bold">{summary?.totalOrders?.toLocaleString() || 0}</div>
          <div className="text-sm opacity-80 mt-2">
            {summary?.orderGrowth >= 0 ? '↑' : '↓'} {Math.abs(summary?.orderGrowth || 0).toFixed(1)}% growth
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white print:border print:border-green-300">
          <div className="text-sm opacity-90 mb-1">Total Revenue</div>
          <div className="text-3xl font-bold">${summary?.totalRevenue?.toLocaleString() || 0}</div>
          <div className="text-sm opacity-80 mt-2">from all orders</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-md p-6 text-white print:border print:border-yellow-300">
          <div className="text-sm opacity-90 mb-1">Average Order Value</div>
          <div className="text-3xl font-bold">${summary?.averageOrderValue?.toFixed(2) || 0}</div>
          <div className="text-sm opacity-80 mt-2">per order</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white print:border print:border-purple-300">
          <div className="text-sm opacity-90 mb-1">Completion Rate</div>
          <div className="text-3xl font-bold">{summary?.completionRate?.toFixed(1) || 0}%</div>
          <div className="text-sm opacity-80 mt-2">delivered orders</div>
        </div>
      </div>

      {/* Orders Trend Chart */}
      <div className="bg-white rounded-xl shadow-md p-6 print:break-inside-avoid">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Order Trend</h3>
        {chartData && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="orders" stroke="#3B82F6" strokeWidth={2} name="Total Orders" />
              <Line type="monotone" dataKey="delivered" stroke="#10B981" strokeWidth={2} name="Delivered" />
              <Line type="monotone" dataKey="cancelled" stroke="#EF4444" strokeWidth={2} name="Cancelled" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[350px] flex items-center justify-center text-gray-500">No chart data available</div>
        )}
      </div>

      {/* Orders by Status and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by Status */}
        <div className="bg-white rounded-xl shadow-md p-6 print:break-inside-avoid">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Orders by Status</h3>
          {ordersByStatus && ordersByStatus.length > 0 ? (
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={ordersByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {ordersByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {ordersByStatus.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[index % colors.length] }}></div>
                      <span className="text-sm font-medium text-gray-700">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-500">No status data available</div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-md p-6 print:break-inside-avoid">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h3>
          {recentOrders && recentOrders.length > 0 ? (
            <div className="space-y-3 max-h-[350px] overflow-y-auto">
              {recentOrders.map((order, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-900">#{order.orderNumber}</div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{order.customer}</span>
                    <span className="font-bold text-gray-900">${order.total?.toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{order.date}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">No recent orders</div>
          )}
        </div>
      </div>
    </div>
  );
};

// Custom Report Component
const CustomReportContent = ({ report, metrics, setMetrics, colors }) => {
  if (!report) return <div className="text-center text-gray-500 py-12">No custom report data available</div>;

  const { overview, combinedData } = report;

  return (
    <div className="space-y-6">
      {/* Metrics Selector */}
      <div className="bg-white rounded-xl shadow-md p-4 print:hidden">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Select Metrics to Include:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.keys(metrics).map((metric) => (
            <label key={metric} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={metrics[metric]}
                onChange={(e) => setMetrics({ ...metrics, [metric]: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 capitalize">{metric}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.sales && overview?.sales && (
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white print:border print:border-blue-300">
            <div className="text-sm opacity-90 mb-1">Total Sales</div>
            <div className="text-3xl font-bold">${overview.sales.revenue?.toLocaleString() || 0}</div>
            <div className="text-sm opacity-80 mt-2">{overview.sales.orders || 0} orders</div>
          </div>
        )}
        {metrics.users && overview?.users && (
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white print:border print:border-green-300">
            <div className="text-sm opacity-90 mb-1">Total Users</div>
            <div className="text-3xl font-bold">{overview.users.total?.toLocaleString() || 0}</div>
            <div className="text-sm opacity-80 mt-2">{overview.users.active || 0} active</div>
          </div>
        )}
        {metrics.products && overview?.products && (
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-md p-6 text-white print:border print:border-yellow-300">
            <div className="text-sm opacity-90 mb-1">Products</div>
            <div className="text-3xl font-bold">{overview.products.total?.toLocaleString() || 0}</div>
            <div className="text-sm opacity-80 mt-2">{overview.products.sold || 0} sold</div>
          </div>
        )}
        {metrics.orders && overview?.orders && (
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white print:border print:border-purple-300">
            <div className="text-sm opacity-90 mb-1">Orders</div>
            <div className="text-3xl font-bold">{overview.orders.total?.toLocaleString() || 0}</div>
            <div className="text-sm opacity-80 mt-2">{overview.orders.completed || 0} completed</div>
          </div>
        )}
      </div>

      {/* Combined Chart */}
      <div className="bg-white rounded-xl shadow-md p-6 print:break-inside-avoid">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Combined Metrics Overview</h3>
        {combinedData && combinedData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              {metrics.sales && <Area yAxisId="left" type="monotone" dataKey="revenue" fill="#3B82F6" stroke="#3B82F6" fillOpacity={0.3} name="Revenue ($)" />}
              {metrics.orders && <Bar yAxisId="right" dataKey="orders" fill="#10B981" name="Orders" />}
              {metrics.users && <Line yAxisId="right" type="monotone" dataKey="users" stroke="#F59E0B" strokeWidth={2} name="New Users" />}
              {metrics.products && <Line yAxisId="right" type="monotone" dataKey="productsSold" stroke="#EF4444" strokeWidth={2} name="Products Sold" />}
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[400px] flex items-center justify-center text-gray-500">
            No combined data available. Please select at least one metric.
          </div>
        )}
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Breakdown */}
        {metrics.sales && overview?.salesBreakdown && (
          <div className="bg-white rounded-xl shadow-md p-6 print:break-inside-avoid">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Sales Breakdown</h3>
            <div className="space-y-3">
              {overview.salesBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">{item.category}</span>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">${item.amount?.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Activity */}
        {metrics.users && overview?.userActivity && (
          <div className="bg-white rounded-xl shadow-md p-6 print:break-inside-avoid">
            <h3 className="text-xl font-bold text-gray-900 mb-4">User Activity</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={overview.userActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="active" fill="#3B82F6" name="Active Users" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Additional Insights */}
      <div className="bg-white rounded-xl shadow-md p-6 print:break-inside-avoid">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {overview?.insights?.map((insight, index) => (
            <div key={index} className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="text-2xl">{insight.icon}</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{insight.title}</h4>
                  <p className="text-sm text-gray-600">{insight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
