# Backend Implementation Guide

## Required API Endpoints

The Users.jsx component requires the following backend endpoints to be implemented:

## 1. Update User Role (NEW)

**Endpoint**: `PUT /api/superadmin/users/:id/role`

**Request Body**:
```json
{
  "role": "admin"
}
```

**Response**:
```json
{
  "success": true,
  "message": "User role updated successfully",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-17T14:20:00Z"
  }
}
```

**Implementation Example (Node.js/Express)**:

```javascript
// PUT /api/superadmin/users/:id/role
router.put('/users/:id/role', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role
    const validRoles = ['customer', 'admin', 'superadmin'];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be one of: customer, admin, superadmin'
      });
    }

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent changing own role
    if (req.user.id === id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own role'
      });
    }

    // Update role
    user.role = role;
    await user.save();

    // Log the action (optional but recommended)
    await AuditLog.create({
      userId: req.user.id,
      action: 'UPDATE_USER_ROLE',
      resource: 'User',
      resourceId: id,
      details: {
        previousRole: user.role,
        newRole: role
      }
    });

    res.json({
      success: true,
      message: 'User role updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user role',
      error: error.message
    });
  }
});
```

---

## 2. Delete User (NEW)

**Endpoint**: `DELETE /api/superadmin/users/:id`

**Response**:
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Implementation Example (Node.js/Express)**:

```javascript
// DELETE /api/superadmin/users/:id
router.delete('/users/:id', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting yourself
    if (req.user.id === id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    // Prevent deleting other superadmins (optional security measure)
    if (user.role === 'superadmin' && user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete other superadmin accounts'
      });
    }

    // Optional: Soft delete instead of hard delete
    // user.isDeleted = true;
    // user.deletedAt = new Date();
    // await user.save();

    // Hard delete
    await User.findByIdAndDelete(id);

    // Optional: Delete related data
    // await Order.deleteMany({ userId: id });
    // await Cart.deleteMany({ userId: id });
    // await Review.deleteMany({ userId: id });

    // Log the action (optional but recommended)
    await AuditLog.create({
      userId: req.user.id,
      action: 'DELETE_USER',
      resource: 'User',
      resourceId: id,
      details: {
        deletedUser: {
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
});
```

---

## 3. Get Users (Already Exists - Verify Format)

**Endpoint**: `GET /api/superadmin/users?page=1&limit=10&search=`

**Response** (Verify this matches your current implementation):
```json
{
  "success": true,
  "users": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "role": "customer",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 45,
  "totalPages": 5,
  "currentPage": 1,
  "limit": 10
}
```

---

## 4. Update User Status (Already Exists - Verify Format)

**Endpoint**: `PATCH /api/superadmin/users/:id/status`

**Request Body**:
```json
{
  "isActive": true
}
```

**Response**:
```json
{
  "success": true,
  "message": "User status updated successfully",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "isActive": true
  }
}
```

---

## Middleware Required

### 1. Authentication Middleware

```javascript
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    req.user = user;
    next();
  });
};
```

### 2. SuperAdmin Authorization Middleware

```javascript
const requireSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({
      success: false,
      message: 'Superadmin access required'
    });
  }
  next();
};
```

---

## User Model (Mongoose Example)

```javascript
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['customer', 'admin', 'superadmin'],
    default: 'customer'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for search functionality
userSchema.index({ name: 'text', email: 'text' });

const User = mongoose.model('User', userSchema);
```

---

## Complete Route Setup

```javascript
const express = require('express');
const router = express.Router();
const { authenticateToken, requireSuperAdmin } = require('../middleware/auth');

// Get all users
router.get('/users', authenticateToken, requireSuperAdmin, async (req, res) => {
  // Implementation from existing code
});

// Get user by ID
router.get('/users/:id', authenticateToken, requireSuperAdmin, async (req, res) => {
  // Implementation from existing code
});

// Update user status
router.patch('/users/:id/status', authenticateToken, requireSuperAdmin, async (req, res) => {
  // Implementation from existing code
});

// Update user role (NEW)
router.put('/users/:id/role', authenticateToken, requireSuperAdmin, async (req, res) => {
  // Implementation shown above
});

// Delete user (NEW)
router.delete('/users/:id', authenticateToken, requireSuperAdmin, async (req, res) => {
  // Implementation shown above
});

module.exports = router;
```

---

## Testing with Postman/Thunder Client

### Test Update Role
```
PUT http://localhost:5000/api/superadmin/users/USER_ID/role
Headers:
  Authorization: Bearer YOUR_TOKEN
  Content-Type: application/json
Body:
  {
    "role": "admin"
  }
```

### Test Delete User
```
DELETE http://localhost:5000/api/superadmin/users/USER_ID
Headers:
  Authorization: Bearer YOUR_TOKEN
```

---

## Error Codes Reference

| Status Code | Meaning |
|-------------|---------|
| 200 | Success |
| 400 | Bad Request (invalid data) |
| 401 | Unauthorized (no token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found (user doesn't exist) |
| 500 | Internal Server Error |

---

## Security Considerations

1. **Prevent Self-Modification**: Users shouldn't be able to delete themselves or change their own role
2. **Superadmin Protection**: Consider preventing deletion of other superadmins
3. **Audit Logging**: Log all user modifications for compliance
4. **Input Validation**: Validate all inputs before processing
5. **Rate Limiting**: Implement rate limiting on these endpoints
6. **CORS**: Ensure proper CORS configuration
7. **Token Expiry**: Implement token refresh mechanism

---

## Optional Enhancements

### Soft Delete Implementation
```javascript
// Instead of hard delete
user.isDeleted = true;
user.deletedAt = new Date();
await user.save();
```

### Cascade Delete Related Data
```javascript
// Delete user's orders, reviews, etc.
await Promise.all([
  Order.deleteMany({ userId: id }),
  Cart.deleteMany({ userId: id }),
  Review.deleteMany({ userId: id }),
  Wishlist.deleteMany({ userId: id })
]);
```

### Email Notifications
```javascript
// Notify user when role changes
await sendEmail({
  to: user.email,
  subject: 'Your account role has been updated',
  template: 'role-change',
  data: { userName: user.name, newRole: role }
});
```

---

## Troubleshooting

### Issue: "Cannot read property 'role' of undefined"
**Solution**: Ensure authentication middleware is setting `req.user` correctly

### Issue: 404 on endpoints
**Solution**:
- Check route prefix in app.js: `app.use('/api/superadmin', superadminRoutes)`
- Verify route is registered correctly

### Issue: CORS errors
**Solution**: Add CORS configuration
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### Issue: Token not found
**Solution**: Check if token is being sent in Authorization header as "Bearer TOKEN"

---

## Database Migration (If Needed)

If you need to add the `role` field to existing users:

```javascript
// Migration script
const migrateUsers = async () => {
  await User.updateMany(
    { role: { $exists: false } },
    { $set: { role: 'customer' } }
  );
  console.log('Migration completed');
};
```

---

## Testing Checklist

- [ ] Create user with different roles
- [ ] Update user role (customer → admin)
- [ ] Update user role (admin → superadmin)
- [ ] Try changing own role (should fail)
- [ ] Delete regular user
- [ ] Try deleting self (should fail)
- [ ] Try deleting superadmin as non-superadmin (should fail)
- [ ] Verify audit logs are created
- [ ] Test with invalid role
- [ ] Test with non-existent user ID
- [ ] Test without authentication token
- [ ] Test with expired token

---

**Implementation Priority**: HIGH
**Estimated Time**: 2-4 hours including testing
**Dependencies**: Existing user management endpoints
**Risk Level**: Medium (involves user role changes and deletion)
