# SuperAdmin WebApp

A comprehensive SuperAdmin dashboard built with React, featuring advanced analytics, user management, and complete e-commerce administration capabilities.

## Features

### Admin Features (All Admins)
- **Dashboard**: Advanced analytics with sales trends, user growth, and revenue charts
- **Product Management**: Full CRUD operations for products
- **Order Management**: View, update, and track customer orders
- **Category Management**: Manage product categories

### SuperAdmin Features (SuperAdmin Only)
- **User Management**:
  - View all registered users
  - Search and filter users
  - Activate/deactivate user accounts
  - View detailed user profiles and order history

- **Admin Management**:
  - Create new admin accounts
  - Manage existing administrators
  - Role-based access control (Admin vs SuperAdmin)

- **Advanced Analytics**:
  - Sales reports with date filtering
  - Top-selling products analysis
  - User analytics and growth metrics
  - User behavior and engagement tracking

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM v6
- **State Management**: React Context API
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Notifications**: React Toastify

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on http://localhost:5000

## Installation

1. Navigate to the project directory:
```bash
cd /Users/yaswanthgandhi/Documents/validatesharing/superadmin-webapp
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
The `.env` file is already configured with:
```
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The application will run on **http://localhost:5175**

## Project Structure

```
superadmin-webapp/
├── src/
│   ├── api/
│   │   ├── axiosConfig.js      # Axios instance with JWT interceptors
│   │   └── index.js            # API functions
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx      # Header component
│   │   │   ├── Sidebar.jsx     # Navigation sidebar
│   │   │   └── Layout.jsx      # Main layout wrapper
│   │   ├── products/           # Product-related components
│   │   ├── orders/             # Order-related components
│   │   ├── categories/         # Category components
│   │   ├── users/              # User management components
│   │   ├── admins/             # Admin management components
│   │   └── analytics/          # Analytics components
│   ├── context/
│   │   └── AuthContext.jsx     # Authentication context
│   ├── pages/
│   │   ├── Login.jsx           # Login page
│   │   ├── Dashboard.jsx       # Main dashboard
│   │   ├── Products/           # Product pages
│   │   ├── Orders/             # Order pages
│   │   ├── Categories/         # Category pages
│   │   ├── Users/              # User management pages
│   │   ├── Admins/             # Admin management pages
│   │   └── Analytics/          # Analytics pages
│   ├── routes/
│   │   └── PrivateRoute.jsx    # Protected route wrapper
│   ├── App.jsx                 # Main app component
│   ├── main.jsx               # App entry point
│   └── index.css              # Global styles
├── .env                       # Environment variables
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind configuration
└── package.json              # Dependencies
```

## Authentication

The app uses JWT-based authentication with the following features:
- Token stored in localStorage
- Automatic token refresh on API requests
- Automatic redirect to login on token expiration
- Role-based access control (Admin vs SuperAdmin)

## API Endpoints

The frontend expects the following backend endpoints:

### Auth
- `POST /api/admin/login` - Admin/SuperAdmin login

### Dashboard
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/dashboard/sales` - Sales data
- `GET /api/admin/dashboard/user-growth` - User growth data

### Products
- `GET /api/admin/products` - List products
- `GET /api/admin/products/:id` - Get product by ID
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

### Orders
- `GET /api/admin/orders` - List orders
- `GET /api/admin/orders/:id` - Get order by ID
- `PUT /api/admin/orders/:id/status` - Update order status

### Categories
- `GET /api/admin/categories` - List categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category

### Users (SuperAdmin Only)
- `GET /api/admin/users` - List all users
- `GET /api/admin/users/:id` - Get user by ID
- `PUT /api/admin/users/:id/status` - Update user status
- `GET /api/admin/users/:id/orders` - Get user orders

### Admins (SuperAdmin Only)
- `GET /api/admin/admins` - List admins
- `POST /api/admin/admins` - Create admin
- `PUT /api/admin/admins/:id` - Update admin
- `DELETE /api/admin/admins/:id` - Delete admin

### Analytics (SuperAdmin Only)
- `GET /api/admin/analytics/sales` - Sales report
- `GET /api/admin/analytics/users` - User analytics
- `GET /api/admin/analytics/revenue` - Revenue analytics
- `GET /api/admin/analytics/top-products` - Top products

## User Roles

### Admin
- Can manage products, orders, and categories
- Cannot access user management or admin management
- Cannot access advanced analytics

### SuperAdmin
- Full access to all admin features
- Can manage users (view, activate/deactivate)
- Can manage admins (create, delete)
- Can access advanced analytics
- Can view detailed user profiles and order history

## Features Overview

### Dashboard
- Real-time statistics (revenue, orders, products, users)
- Sales trend chart (line chart)
- Order status distribution (pie chart)
- User growth over time (bar chart)

### Product Management
- List all products with pagination
- Search products
- Add new products
- Edit existing products
- Delete products
- Product images
- Stock management
- Category assignment

### Order Management
- List all orders with filtering by status
- View detailed order information
- Update order status
- View customer information
- View shipping details
- Track order items

### Category Management
- Create categories
- Edit categories
- Delete categories
- View product count per category

### User Management (SuperAdmin)
- List all users with search
- View user details
- View user order history
- Activate/deactivate users
- User statistics (total spent, order count)

### Admin Management (SuperAdmin)
- List all admins
- Create new admin accounts
- Assign roles (Admin/SuperAdmin)
- Delete admin accounts
- Protected SuperAdmin accounts

### Analytics (SuperAdmin)
- Sales report with date filtering
- Revenue trends
- Order volume analysis
- Top-selling products
- User growth metrics
- User behavior analytics
- Engagement metrics

## Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## Environment Variables

- `VITE_API_URL`: Backend API URL (default: http://localhost:5000/api)

## Security

- JWT tokens for authentication
- Role-based access control
- Protected routes
- Automatic token expiration handling
- Secure API communication

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Private - All rights reserved

## Support

For support, contact the development team.

