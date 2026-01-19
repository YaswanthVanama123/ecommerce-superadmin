# Shipping Management Module

## Overview

A comprehensive shipping management system for the SuperAdmin webapp that provides full control over shipment tracking, location updates, carrier analytics, and real-time status monitoring.

## Features

### 1. ShippingManagement.jsx (Main Dashboard)
- **Shipment Listing**: View all shipments with detailed information
- **Advanced Filters**:
  - Search by tracking number, order ID, or customer name
  - Filter by status (pending, in_transit, delivered, etc.)
  - Filter by carrier (FedEx, UPS, DHL, USPS)
  - Date range filtering
- **Bulk Operations**: Select multiple shipments and update status in bulk
- **Statistics Cards**:
  - Total shipments
  - Pending shipments
  - In transit shipments
  - Delivered shipments
  - Cancelled shipments
- **Carrier Analytics**: Real-time analytics for each carrier showing delivery rates
- **Export Functionality**: Export shipment data to CSV
- **Quick Actions**:
  - Create new shipment
  - View details
  - Update location
  - Print shipping label
- **Pagination**: Navigate through large datasets

### 2. ShippingDetail.jsx (Detailed Tracking View)
- **Comprehensive Shipment Overview**:
  - Tracking number
  - Current status with color-coded badges
  - Carrier information
  - Estimated and actual delivery dates
- **Interactive Tracking Timeline**:
  - Visual timeline showing package journey
  - Location history with timestamps
  - Status updates with descriptions
  - Staff member who handled each update
- **Live Tracking Map Placeholder**: Ready for integration with mapping services
- **Package Information**:
  - Items included in shipment
  - Weight and dimensions
  - Shipping cost and insurance
  - Signature requirements
- **Customer Information**:
  - Name, email, phone
  - Delivery address
- **Shipping Route Visualization**:
  - Origin point
  - Current location (animated)
  - Destination point
- **Shipment Notes**: Important notes and special instructions
- **Edit Tracking Information**: Update tracking number and carrier
- **Quick Actions**: Update location, print label

### 3. CreateShipment.jsx (Shipment Creation Modal)
- **Order Selection**: Choose from existing orders
- **Auto-generation**: Automatic tracking number generation
- **Carrier Selection**: Choose from multiple carriers
- **Address Management**:
  - Origin address input
  - Destination address input
- **Package Details**:
  - Weight input (kg)
  - Dimensions (length, width, height in cm)
- **Delivery Options**:
  - Estimated delivery date
  - Insurance amount
  - Signature requirement toggle
- **Additional Notes**: Special handling instructions
- **Form Validation**: Comprehensive validation with error messages
- **Summary Preview**: Review shipment details before creation

### 4. UpdateLocation.jsx (Location Update Modal)
- **Status Updates**:
  - Picked Up
  - In Transit
  - Out for Delivery
  - Delivered
  - Failed Delivery
  - Returned
- **Location Input**: Full address or facility name
- **Description Field**: Detailed update description
- **GPS Coordinates** (Optional):
  - Manual entry
  - Automatic location detection using browser geolocation
  - Map preview placeholder
- **Quick Suggestions**: Pre-filled description templates
- **Update Preview**: See how the update will appear
- **Real-time Information**: Shows current shipment details

### 5. ShippingAnalytics.jsx (Already exists)
- Comprehensive analytics and reporting
- Carrier performance metrics
- Regional data analysis
- Revenue tracking

## File Structure

```
src/pages/Shipping/
├── index.js                    # Export barrel file
├── ShippingManagement.jsx      # Main shipment listing page
├── ShippingDetail.jsx          # Detailed shipment view
├── CreateShipment.jsx          # Shipment creation modal
├── UpdateLocation.jsx          # Location update modal
└── ShippingAnalytics.jsx       # Analytics dashboard (existing)
```

## Usage

### Importing Components

```javascript
// Import all components
import {
  ShippingManagement,
  ShippingDetail,
  CreateShipment,
  UpdateLocation
} from './pages/Shipping';

// Or import individually
import ShippingManagement from './pages/Shipping/ShippingManagement';
```

### Route Configuration

Add these routes to your React Router configuration:

```javascript
import { ShippingManagement, ShippingDetail } from './pages/Shipping';

// In your routes
<Route path="/shipping" element={<ShippingManagement />} />
<Route path="/shipping/:id" element={<ShippingDetail />} />
```

### Using the Modals

```javascript
// CreateShipment Modal
<CreateShipment
  isOpen={showCreateModal}
  onClose={() => setShowCreateModal(false)}
  onSuccess={() => {
    setShowCreateModal(false);
    fetchShipments(); // Refresh shipments list
  }}
/>

// UpdateLocation Modal
<UpdateLocation
  isOpen={showUpdateModal}
  onClose={() => setShowUpdateModal(false)}
  shipment={selectedShipment}
  onSuccess={() => {
    setShowUpdateModal(false);
    fetchShipmentDetails(); // Refresh shipment details
  }}
/>
```

## Data Structure

### Shipment Object

```javascript
{
  _id: 'string',
  trackingNumber: 'string',
  orderId: 'string',
  orderNumber: 'string',
  carrier: 'FedEx' | 'UPS' | 'DHL' | 'USPS',
  status: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed' | 'cancelled' | 'returned',
  origin: 'string',
  destination: 'string',
  estimatedDelivery: 'ISO Date String',
  actualDelivery: 'ISO Date String' | null,
  currentLocation: 'string',
  customer: {
    name: 'string',
    email: 'string',
    phone: 'string',
    address: 'string'
  },
  items: [
    {
      name: 'string',
      quantity: number,
      weight: 'string',
      sku: 'string'
    }
  ],
  weight: 'string',
  dimensions: 'string',
  cost: number,
  insurance: number,
  signatureRequired: boolean,
  createdAt: 'ISO Date String',
  updatedAt: 'ISO Date String',
  locationHistory: [
    {
      id: 'string',
      location: 'string',
      timestamp: 'ISO Date String',
      status: 'string',
      description: 'string',
      staff: 'string'
    }
  ],
  notes: [
    {
      id: 'string',
      text: 'string',
      createdBy: 'string',
      createdAt: 'ISO Date String'
    }
  ]
}
```

## Status Badges

The system uses color-coded status badges:

- **Pending**: Yellow
- **Picked Up**: Blue
- **In Transit**: Purple
- **Out for Delivery**: Indigo
- **Delivered**: Green
- **Failed**: Red
- **Cancelled**: Gray
- **Returned**: Orange

## Features in Detail

### Search and Filter
- Real-time search across tracking numbers, order IDs, and customer names
- Multiple filter combinations for precise results
- Reset filters functionality

### Bulk Operations
- Select multiple shipments using checkboxes
- Select all functionality
- Bulk status updates (Mark as In Transit, Mark as Delivered)
- Clear selection option

### Export Functionality
- One-click CSV export
- Includes all relevant shipment data
- Filename includes current date

### Print Labels
- Quick print access from both list and detail views
- Triggers browser print dialog

### Real-time Updates
- Live status tracking
- Animated current location indicator
- Timeline visualization

### Responsive Design
- Mobile-friendly interface
- Responsive grid layouts
- Touch-friendly controls

## Mock Data

The module currently uses mock data for development. To integrate with a real backend:

1. Replace mock data with API calls
2. Update the `fetchShipments()` function in ShippingManagement.jsx
3. Update the `fetchShipmentDetails()` function in ShippingDetail.jsx
4. Implement actual API endpoints for:
   - `GET /api/shipments` - List shipments
   - `GET /api/shipments/:id` - Get shipment details
   - `POST /api/shipments` - Create shipment
   - `PATCH /api/shipments/:id/location` - Update location
   - `PATCH /api/shipments/:id/tracking` - Update tracking info
   - `PATCH /api/shipments/bulk-update` - Bulk status update

## Dependencies

- React 18+
- React Router DOM
- React Toastify (for notifications)
- Tailwind CSS (for styling)
- Recharts (for analytics in ShippingAnalytics.jsx)

## Styling

The module uses:
- Tailwind CSS utility classes
- Custom color scheme matching the superadmin theme
- Hover effects and transitions
- Shadow and rounded corner styling
- Gradient backgrounds for headers

## Error Handling

- Form validation with clear error messages
- Try-catch blocks for async operations
- Toast notifications for success/error feedback
- Loading states for async operations

## Accessibility

- Semantic HTML structure
- ARIA labels where appropriate
- Keyboard navigation support
- Focus states for interactive elements
- Screen reader friendly

## Future Enhancements

1. **Real-time Tracking**:
   - WebSocket integration for live updates
   - Push notifications for status changes

2. **Map Integration**:
   - Google Maps or Mapbox integration
   - Real-time location tracking on map
   - Route visualization

3. **Advanced Analytics**:
   - Delivery time predictions
   - Carrier performance comparisons
   - Cost optimization suggestions

4. **Label Printing**:
   - PDF generation for shipping labels
   - QR code integration
   - Batch label printing

5. **API Integration**:
   - Direct carrier API integration (FedEx, UPS, etc.)
   - Automatic tracking updates
   - Rate calculation

6. **Notifications**:
   - Email notifications to customers
   - SMS updates
   - In-app notifications

7. **Document Management**:
   - Upload POD (Proof of Delivery)
   - Attach invoice documents
   - Customs documentation

## Support

For issues or questions regarding the Shipping Management module, please contact the development team.

## License

Copyright © 2026 SuperAdmin Platform. All rights reserved.
