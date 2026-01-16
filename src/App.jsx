import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import Layout from './components/common/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Products
import ProductList from './pages/Products/ProductList';
import AddProduct from './pages/Products/AddProduct';
import EditProduct from './pages/Products/EditProduct';

// Orders
import OrderList from './pages/Orders/OrderList';
import OrderDetail from './pages/Orders/OrderDetail';

// Categories
import CategoryManagement from './pages/Categories/CategoryManagement';

// Users
import UserList from './pages/Users/UserList';
import UserDetail from './pages/Users/UserDetail';

// Admins
import AdminList from './pages/Admins/AdminList';
import AddAdmin from './pages/Admins/AddAdmin';

// Analytics
import SalesReport from './pages/Analytics/SalesReport';
import UserAnalytics from './pages/Analytics/UserAnalytics';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />

                    {/* Products */}
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/products/add" element={<AddProduct />} />
                    <Route path="/products/edit/:id" element={<EditProduct />} />

                    {/* Orders */}
                    <Route path="/orders" element={<OrderList />} />
                    <Route path="/orders/:id" element={<OrderDetail />} />

                    {/* Categories */}
                    <Route path="/categories" element={<CategoryManagement />} />

                    {/* Users - SuperAdmin only */}
                    <Route
                      path="/users"
                      element={
                        <PrivateRoute requireSuperAdmin={true}>
                          <UserList />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/users/:id"
                      element={
                        <PrivateRoute requireSuperAdmin={true}>
                          <UserDetail />
                        </PrivateRoute>
                      }
                    />

                    {/* Admins - SuperAdmin only */}
                    <Route
                      path="/admins"
                      element={
                        <PrivateRoute requireSuperAdmin={true}>
                          <AdminList />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/admins/add"
                      element={
                        <PrivateRoute requireSuperAdmin={true}>
                          <AddAdmin />
                        </PrivateRoute>
                      }
                    />

                    {/* Analytics - SuperAdmin only */}
                    <Route
                      path="/analytics"
                      element={
                        <PrivateRoute requireSuperAdmin={true}>
                          <SalesReport />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/analytics/users"
                      element={
                        <PrivateRoute requireSuperAdmin={true}>
                          <UserAnalytics />
                        </PrivateRoute>
                      }
                    />
                  </Routes>
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </AuthProvider>
    </Router>
  );
}

export default App;
