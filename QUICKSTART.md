# SuperAdmin WebApp - Quick Start Guide

## Overview
Complete SuperAdmin dashboard with role-based access control for managing an e-commerce platform.

## Quick Setup

```bash
cd /Users/yaswanthgandhi/Documents/validatesharing/superadmin-webapp
npm install
npm run dev
```

Access at: **http://localhost:5175**

## Project Location
`/Users/yaswanthgandhi/Documents/validatesharing/superadmin-webapp`

## Key Features

### All Admins
- Dashboard with analytics
- Product management (CRUD)
- Order management
- Category management

### SuperAdmin Only
- User management
- Admin management
- Advanced analytics
- User/Admin CRUD operations

## File Structure

### API Layer (`src/api/`)
- `axiosConfig.js` - JWT interceptors
- `index.js` - All API functions

### Components (`src/components/`)
- `common/` - Sidebar, Header, Layout
- Other component folders ready for expansion

### Pages (`src/pages/`)
- `Login.jsx` - Authentication
- `Dashboard.jsx` - Main dashboard
- `Products/` - ProductList, AddProduct, EditProduct
- `Orders/` - OrderList, OrderDetail
- `Categories/` - CategoryManagement
- `Users/` - UserList, UserDetail (SuperAdmin)
- `Admins/` - AdminList, AddAdmin (SuperAdmin)
- `Analytics/` - SalesReport, UserAnalytics (SuperAdmin)

### Context & Routes
- `context/AuthContext.jsx` - Authentication state
- `routes/PrivateRoute.jsx` - Route protection

## Important Notes

1. **Backend Required**: Ensure backend API is running on http://localhost:5000
2. **Port**: Frontend runs on port 5175 (configured in vite.config.js)
3. **Authentication**: Uses JWT tokens stored in localStorage
4. **Role-Based Access**:
   - Admin: Products, Orders, Categories
   - SuperAdmin: Everything + Users, Admins, Analytics

## API Endpoints Required

The backend must implement these endpoints:

### Authentication
- POST `/api/admin/login`

### Dashboard
- GET `/api/admin/dashboard/stats`
- GET `/api/admin/dashboard/sales`
- GET `/api/admin/dashboard/user-growth`

### Products
- GET `/api/admin/products`
- GET `/api/admin/products/:id`
- POST `/api/admin/products`
- PUT `/api/admin/products/:id`
- DELETE `/api/admin/products/:id`

### Orders
- GET `/api/admin/orders`
- GET `/api/admin/orders/:id`
- PUT `/api/admin/orders/:id/status`

### Categories
- GET `/api/admin/categories`
- POST `/api/admin/categories`
- PUT `/api/admin/categories/:id`
- DELETE `/api/admin/categories/:id`

### Users (SuperAdmin Only)
- GET `/api/admin/users`
- GET `/api/admin/users/:id`
- PUT `/api/admin/users/:id/status`
- GET `/api/admin/users/:id/orders`

### Admins (SuperAdmin Only)
- GET `/api/admin/admins`
- POST `/api/admin/admins`
- PUT `/api/admin/admins/:id`
- DELETE `/api/admin/admins/:id`

### Analytics (SuperAdmin Only)
- GET `/api/admin/analytics/sales`
- GET `/api/admin/analytics/users`
- GET `/api/admin/analytics/revenue`
- GET `/api/admin/analytics/top-products`

## Technologies

- React 18
- Vite
- React Router DOM v6
- Tailwind CSS
- Recharts
- Axios
- React Hook Form
- React Toastify

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Environment Variables

`.env` file:
```
VITE_API_URL=http://localhost:5000/api
```

## Navigation Structure

```
Login
  └─ Dashboard
      ├─ Products
      │   ├─ Product List
      │   ├─ Add Product
      │   └─ Edit Product
      ├─ Orders
      │   ├─ Order List
      │   └─ Order Detail
      ├─ Categories
      ├─ Users (SuperAdmin Only)
      │   ├─ User List
      │   └─ User Detail
      ├─ Admins (SuperAdmin Only)
      │   ├─ Admin List
      │   └─ Add Admin
      └─ Analytics (SuperAdmin Only)
          ├─ Sales Report
          └─ User Analytics
```

## Security Features

- JWT authentication
- Role-based access control
- Protected routes
- Automatic token refresh
- Token expiration handling

## Troubleshooting

1. **Port already in use**: Change port in `vite.config.js`
2. **API connection failed**: Ensure backend is running on localhost:5000
3. **Login fails**: Check backend credentials and JWT configuration
4. **Missing data**: Backend may need seed data

## Next Steps

1. Start backend API server
2. Run `npm run dev` in this directory
3. Navigate to http://localhost:5175
4. Login with admin/superadmin credentials
5. Begin managing your e-commerce platform!
