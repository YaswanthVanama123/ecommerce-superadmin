# Admin Management Page Documentation

## Overview
The Admin Management page (`/src/pages/Admins.jsx`) provides a comprehensive interface for managing administrators and superadmins with full CRUD operations, role management, and activity tracking.

## Features Implemented

### 1. Dashboard Statistics
- Total Admins count
- Super Admins count
- Regular Admins count
- Active Admins count

### 2. Admin List Management
- View all admins and superadmins
- Search functionality (by name or email)
- Display admin details (name, email, role, status, created date)
- Color-coded role badges
- Status indicators (Active/Inactive)

### 3. Create New Admin Accounts
- Modal-based form with validation
- Fields: Name, Email, Role (Admin/Super Admin), Password
- Password confirmation
- Form validation using react-hook-form
- Security warning notification

### 4. Promote Users to Admin
- Dedicated "Promote Users" tab
- View all regular users eligible for promotion
- Search functionality for users
- Two promotion options:
  - Promote to Admin
  - Promote to Super Admin
- Confirmation dialogs for security

### 5. Demote Admins to Users
- Demote regular admins back to user role
- Confirmation dialog for destructive action
- Super admins are protected from demotion

### 6. Edit Admin Permissions
- Granular permission control:
  - Manage Products
  - Manage Orders
  - Manage Categories
  - View Analytics
  - Manage Users
- Modal-based permission editor
- Real-time updates

### 7. View Admin Activity Logs
- Modal view for individual admin activity
- Displays action history with timestamps
- IP address tracking
- Loading states and empty states

### 8. Admin Removal
- Delete admin accounts
- Confirmation dialog
- Super admins are protected from deletion

## Technical Implementation

### Technologies Used
- React with Hooks (useState, useEffect)
- React Hook Form for form validation
- React Router for navigation
- React Toastify for notifications
- Tailwind CSS for styling
- Axios for API communication

### Component Structure
```
Admins.jsx
├── State Management
│   ├── admins (list of all admins)
│   ├── users (list of regular users)
│   ├── activeTab (list/promote tabs)
│   ├── showModal (modal visibility)
│   ├── modalType (create/edit/activity)
│   └── selectedAdmin (current admin in focus)
├── Tabs
│   ├── Admin List Tab
│   └── Promote Users Tab
└── Modals
    ├── Create Admin Modal
    ├── Edit Permissions Modal
    └── Activity Logs Modal
```

### API Endpoints Required

The backend must implement the following API endpoints:

#### Admin Management
```
GET    /admin/admins                        - Get all admins
POST   /admin/admins                        - Create new admin
PUT    /admin/admins/:id                    - Update admin
DELETE /admin/admins/:id                    - Delete admin
POST   /admin/admins/:id/demote             - Demote admin to user
PUT    /admin/admins/:id/permissions        - Update admin permissions
GET    /admin/admins/:id/activity-logs      - Get admin activity logs
```

#### User Promotion
```
GET    /admin/users                         - Get all users
POST   /admin/users/:id/promote             - Promote user to admin/superadmin
```

### Request/Response Examples

#### Create Admin
**Request:**
```json
POST /admin/admins
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "admin"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Admin created successfully",
  "admin": {
    "_id": "65abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "isActive": true,
    "createdAt": "2024-01-17T10:30:00Z"
  }
}
```

#### Update Admin Permissions
**Request:**
```json
PUT /admin/admins/:id/permissions
{
  "permissions": {
    "canManageProducts": true,
    "canManageOrders": true,
    "canManageCategories": true,
    "canViewAnalytics": false,
    "canManageUsers": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Permissions updated successfully",
  "admin": {
    "_id": "65abc123...",
    "permissions": {
      "canManageProducts": true,
      "canManageOrders": true,
      "canManageCategories": true,
      "canViewAnalytics": false,
      "canManageUsers": false
    }
  }
}
```

#### Promote User to Admin
**Request:**
```json
POST /admin/users/:userId/promote
{
  "role": "admin"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User promoted successfully",
  "user": {
    "_id": "65xyz456...",
    "role": "admin",
    "updatedAt": "2024-01-17T10:35:00Z"
  }
}
```

#### Get Activity Logs
**Request:**
```
GET /admin/admins/:id/activity-logs?page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "logs": [
    {
      "_id": "65log789...",
      "action": "Product Created",
      "description": "Created product: iPhone 15 Pro",
      "ipAddress": "192.168.1.1",
      "createdAt": "2024-01-17T09:15:00Z"
    },
    {
      "_id": "65log790...",
      "action": "Order Updated",
      "description": "Updated order #12345 status to 'Shipped'",
      "ipAddress": "192.168.1.1",
      "createdAt": "2024-01-17T08:45:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalLogs": 48
  }
}
```

## Security Features

1. **Confirmation Dialogs**: All destructive actions (delete, demote) require user confirmation
2. **Role Protection**: Super admins cannot be demoted or deleted
3. **Form Validation**: All inputs are validated before submission
4. **Password Requirements**: Minimum 6 characters, confirmation required
5. **Access Control**: Page requires SuperAdmin role (handled by PrivateRoute)

## Styling Features

1. **Gradient Avatars**: Color-coded user avatars with initials
2. **Status Badges**: Visual indicators for roles and active status
3. **Hover Effects**: Interactive table rows and buttons
4. **Loading States**: Spinners for async operations
5. **Empty States**: User-friendly messages when no data
6. **Modal Overlays**: Clean, centered modals with backdrop
7. **Responsive Design**: Mobile-friendly layout with Tailwind CSS
8. **Color Coding**:
   - Purple: Admin-related elements
   - Red: Super Admin indicators
   - Blue: Primary actions
   - Green: Active/success states
   - Orange: Warning actions (demote)

## Usage

### Accessing the Page
Navigate to `/admins` in your application. Only users with the SuperAdmin role can access this page.

### Managing Admins
1. View the admin list in the default "Admin List" tab
2. Use the search bar to find specific admins
3. Click action icons to:
   - View activity logs (document icon)
   - Edit permissions (pencil icon)
   - Demote to user (down arrow icon)
   - Delete admin (trash icon)

### Creating New Admins
1. Click the "Add Admin" button
2. Fill in the form with name, email, role, and password
3. Confirm the password
4. Click "Create Admin"

### Promoting Users
1. Switch to the "Promote Users" tab
2. Search for users if needed
3. Click either "Promote to Admin" or "Promote to Super Admin"
4. Confirm the action in the dialog

### Editing Permissions
1. Click the edit icon (pencil) next to an admin
2. Toggle the permission checkboxes
3. Click "Update Permissions"

## File Locations

- **Main Component**: `/src/pages/Admins.jsx`
- **API Functions**: `/src/api/index.js`
- **Routing**: `/src/App.jsx`

## Dependencies

Ensure these packages are installed:
```json
{
  "react": "^18.x",
  "react-router-dom": "^6.x",
  "react-hook-form": "^7.x",
  "react-toastify": "^9.x",
  "axios": "^1.x"
}
```

## Backend Database Schema Recommendations

### Admin Model
```javascript
{
  name: String,
  email: { type: String, unique: true },
  password: String, // hashed
  role: { type: String, enum: ['admin', 'superadmin'] },
  isActive: { type: Boolean, default: true },
  permissions: {
    canManageProducts: { type: Boolean, default: true },
    canManageOrders: { type: Boolean, default: true },
    canManageCategories: { type: Boolean, default: true },
    canViewAnalytics: { type: Boolean, default: true },
    canManageUsers: { type: Boolean, default: false }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

### Activity Log Model
```javascript
{
  adminId: { type: ObjectId, ref: 'Admin' },
  action: String,
  description: String,
  ipAddress: String,
  createdAt: { type: Date, default: Date.now }
}
```

## Notes

- The page is fully dynamic and communicates with the backend API
- All state updates trigger re-fetches to ensure data consistency
- Error handling is implemented with user-friendly toast notifications
- The component follows React best practices with proper hooks usage
- Tailwind CSS classes are used throughout for styling
- The page is responsive and works on all screen sizes
