# SuperAdmin UI Component Library

A comprehensive, reusable UI component library for the SuperAdmin web application. Built with React, Tailwind CSS, and accessibility best practices.

## Table of Contents

- [Installation](#installation)
- [Components](#components)
  - [Layout](#layout)
  - [Data Display](#data-display)
  - [Forms](#forms)
  - [Feedback](#feedback)
  - [Actions](#actions)
- [Usage Examples](#usage-examples)
- [Design System](#design-system)

## Installation

Import components from the UI library:

```javascript
import { ActionButton, Modal, DataTable } from '@/components/ui';
```

Or import from specific categories:

```javascript
import { ActionButton } from '@/components/ui/actions';
import { Modal } from '@/components/ui/feedback';
```

## Components

### Layout

#### SuperadminLayout
Main layout wrapper for the application with sidebar, header, and footer.

```javascript
import { SuperadminLayout } from '@/components/ui';

<SuperadminLayout>
  <YourPageContent />
</SuperadminLayout>
```

**Props:**
- `children` (ReactNode): Content to render
- `className` (string): Additional CSS classes

#### Sidebar
Navigation sidebar with menu items and role-based access.

```javascript
import { Sidebar } from '@/components/ui';

<Sidebar isOpen={true} onToggle={toggleSidebar} />
```

**Props:**
- `isOpen` (boolean): Sidebar visibility state
- `onToggle` (function): Toggle sidebar callback

#### Header
Top navigation bar with user info and actions.

```javascript
import { Header } from '@/components/ui';

<Header onMenuClick={handleMenuClick} />
```

**Props:**
- `onMenuClick` (function): Mobile menu toggle callback

#### Breadcrumbs
Navigation breadcrumb trail.

```javascript
import { Breadcrumbs } from '@/components/ui';

<Breadcrumbs
  items={[
    { label: 'Products', path: '/products' },
    { label: 'Edit Product' }
  ]}
/>
```

**Props:**
- `items` (array): Breadcrumb items `[{label, path}]`
- `className` (string): Additional CSS classes

---

### Data Display

#### DataTable
Responsive data table with sorting and actions.

```javascript
import { DataTable } from '@/components/ui';

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  {
    key: 'status',
    label: 'Status',
    render: (value) => <Badge>{value}</Badge>
  }
];

<DataTable
  columns={columns}
  data={users}
  loading={loading}
  onSort={(key, direction) => handleSort(key, direction)}
  onRowClick={(row) => handleRowClick(row)}
/>
```

**Props:**
- `columns` (array): Column definitions `[{key, label, sortable, render}]`
- `data` (array): Table data
- `loading` (boolean): Loading state
- `onSort` (function): Sort callback
- `onRowClick` (function): Row click callback
- `emptyMessage` (string): Message when no data
- `striped` (boolean): Striped rows

#### StatsCard
Display statistics with icon, title, value, and trend.

```javascript
import { StatsCard } from '@/components/ui';

<StatsCard
  title="Total Users"
  value="1,234"
  icon={<UserIcon />}
  trend="up"
  trendValue="+12%"
  description="vs last month"
  color="blue"
/>
```

**Props:**
- `title` (string): Card title
- `value` (string|number): Main value
- `icon` (ReactNode): Icon element
- `trend` (string): 'up', 'down', 'neutral'
- `trendValue` (string): Trend percentage
- `description` (string): Additional description
- `color` (string): 'blue', 'green', 'red', 'yellow', 'purple'
- `loading` (boolean): Loading state

#### Charts
Wrapper for recharts with common configurations.

```javascript
import { Charts } from '@/components/ui';

<Charts
  type="line"
  title="Sales Overview"
  data={salesData}
  series={[
    { dataKey: 'sales', color: '#3B82F6', name: 'Sales' },
    { dataKey: 'revenue', color: '#10B981', name: 'Revenue' }
  ]}
  xAxisKey="month"
  height={400}
/>
```

**Props:**
- `type` (string): 'line', 'bar', 'area', 'pie'
- `data` (array): Chart data
- `series` (array): Series configuration `[{dataKey, color, name}]`
- `xAxisKey` (string): X-axis data key
- `title` (string): Chart title
- `height` (number): Chart height in pixels
- `loading` (boolean): Loading state

#### EmptyState
Display empty state with icon, message, and action.

```javascript
import { EmptyState } from '@/components/ui';

<EmptyState
  title="No products found"
  description="Get started by creating a new product"
  icon={<BoxIcon />}
  action={<ActionButton onClick={handleCreate}>Create Product</ActionButton>}
/>
```

**Props:**
- `title` (string): Main message
- `description` (string): Detailed description
- `icon` (ReactNode): Custom icon
- `action` (ReactNode): Action button
- `size` (string): 'sm', 'md', 'lg'

#### LoadingSkeleton
Skeleton loading placeholders.

```javascript
import { LoadingSkeleton, SkeletonCard, SkeletonTable } from '@/components/ui';

<LoadingSkeleton variant="card" count={3} />
<SkeletonTable />
```

**Props:**
- `variant` (string): 'card', 'table', 'text', 'circle', 'rectangle'
- `count` (number): Number of skeleton items
- `height` (number): Custom height
- `width` (number): Custom width

---

### Forms

#### FormInput
Accessible form input with label, error, and helper text.

```javascript
import { FormInput } from '@/components/ui';

<FormInput
  label="Email"
  type="email"
  name="email"
  placeholder="Enter your email"
  error={errors.email}
  helperText="We'll never share your email"
  required
  leftIcon={<MailIcon />}
/>
```

**Props:**
- `label` (string): Input label
- `error` (string): Error message
- `helperText` (string): Helper text
- `type` (string): Input type
- `required` (boolean): Required field
- `disabled` (boolean): Disabled state
- `leftIcon` (ReactNode): Icon on the left
- `rightIcon` (ReactNode): Icon on the right

#### FormSelect
Accessible select dropdown.

```javascript
import { FormSelect } from '@/components/ui';

<FormSelect
  label="Category"
  name="category"
  options={[
    { value: '1', label: 'Electronics' },
    { value: '2', label: 'Clothing' }
  ]}
  placeholder="Select a category"
  error={errors.category}
  required
/>
```

**Props:**
- `label` (string): Select label
- `error` (string): Error message
- `options` (array): Options `[{value, label, disabled}]`
- `placeholder` (string): Placeholder text
- `required` (boolean): Required field
- `disabled` (boolean): Disabled state

#### FormTextarea
Accessible textarea with character count.

```javascript
import { FormTextarea } from '@/components/ui';

<FormTextarea
  label="Description"
  name="description"
  rows={5}
  maxLength={500}
  showCount
  error={errors.description}
/>
```

**Props:**
- `label` (string): Textarea label
- `error` (string): Error message
- `required` (boolean): Required field
- `maxLength` (number): Maximum character length
- `rows` (number): Number of rows
- `showCount` (boolean): Show character count

#### DatePicker
Date and time input.

```javascript
import { DatePicker } from '@/components/ui';

<DatePicker
  label="Date"
  name="date"
  mode="date"
  min="2024-01-01"
  max="2024-12-31"
  error={errors.date}
/>
```

**Props:**
- `label` (string): Input label
- `mode` (string): 'date', 'time', 'datetime-local'
- `min` (string): Minimum date/time
- `max` (string): Maximum date/time
- `error` (string): Error message

#### ImageUpload
Image upload with preview and validation.

```javascript
import { ImageUpload } from '@/components/ui';

<ImageUpload
  label="Product Image"
  name="image"
  onChange={(file, error) => handleImageChange(file, error)}
  value={currentImage}
  maxSize={5}
  error={errors.image}
/>
```

**Props:**
- `label` (string): Upload label
- `onChange` (function): Change callback `(file, error) => {}`
- `value` (string): Current image URL
- `accept` (string): Accepted file types
- `maxSize` (number): Maximum file size in MB
- `error` (string): Error message

---

### Feedback

#### Modal
Accessible modal dialog.

```javascript
import { Modal } from '@/components/ui';

<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Edit User"
  size="lg"
  footer={
    <>
      <ActionButton variant="secondary" onClick={handleClose}>Cancel</ActionButton>
      <ActionButton onClick={handleSave}>Save</ActionButton>
    </>
  }
>
  <YourFormContent />
</Modal>
```

**Props:**
- `isOpen` (boolean): Modal open state
- `onClose` (function): Close callback
- `title` (string): Modal title
- `children` (ReactNode): Modal content
- `footer` (ReactNode): Modal footer
- `size` (string): 'sm', 'md', 'lg', 'xl', 'full'
- `closeOnOverlay` (boolean): Close on overlay click
- `showCloseButton` (boolean): Show close button

#### ConfirmDialog
Confirmation dialog for destructive actions.

```javascript
import { ConfirmDialog } from '@/components/ui';

<ConfirmDialog
  isOpen={isOpen}
  onClose={handleClose}
  onConfirm={handleDelete}
  title="Delete Product"
  message="Are you sure you want to delete this product? This action cannot be undone."
  variant="danger"
  confirmText="Delete"
  loading={loading}
/>
```

**Props:**
- `isOpen` (boolean): Dialog open state
- `onConfirm` (function): Confirm callback
- `title` (string): Dialog title
- `message` (string): Confirmation message
- `variant` (string): 'danger', 'warning', 'info'
- `confirmText` (string): Confirm button text
- `loading` (boolean): Loading state

#### Toast
Toast notification system.

```javascript
import { Toast, ToastContainer } from '@/components/ui';

// Single toast
<Toast
  message="User created successfully"
  type="success"
  duration={5000}
  onClose={handleClose}
/>

// Toast container for multiple toasts
<ToastContainer toasts={toasts} onRemove={handleRemove} />
```

**Props:**
- `message` (string): Toast message
- `type` (string): 'success', 'error', 'warning', 'info'
- `duration` (number): Duration in milliseconds
- `position` (string): 'top-right', 'top-left', 'bottom-right', 'bottom-left'

#### LoadingSpinner
Loading spinner component.

```javascript
import { LoadingSpinner, ButtonSpinner } from '@/components/ui';

<LoadingSpinner size="lg" color="blue" text="Loading..." />
<LoadingSpinner fullScreen text="Processing..." />
```

**Props:**
- `size` (string): 'sm', 'md', 'lg', 'xl'
- `color` (string): 'blue', 'white', 'gray'
- `text` (string): Loading text
- `fullScreen` (boolean): Full screen overlay

#### ErrorMessage
Display error messages with retry action.

```javascript
import { ErrorMessage } from '@/components/ui';

<ErrorMessage
  title="Failed to load data"
  message="Unable to fetch products. Please try again."
  onRetry={handleRetry}
  variant="card"
/>
```

**Props:**
- `title` (string): Error title
- `message` (string): Error message
- `onRetry` (function): Retry callback
- `variant` (string): 'inline', 'card', 'page'

---

### Actions

#### ActionButton
Button component with variants and states.

```javascript
import { ActionButton, IconButton } from '@/components/ui';

<ActionButton
  variant="primary"
  size="md"
  loading={loading}
  onClick={handleClick}
  leftIcon={<PlusIcon />}
>
  Create Product
</ActionButton>

<IconButton variant="ghost" size="sm">
  <EditIcon />
</IconButton>
```

**Props:**
- `variant` (string): 'primary', 'secondary', 'danger', 'warning', 'success', 'ghost'
- `size` (string): 'sm', 'md', 'lg'
- `loading` (boolean): Loading state
- `disabled` (boolean): Disabled state
- `fullWidth` (boolean): Full width button
- `leftIcon` (ReactNode): Icon on the left
- `rightIcon` (ReactNode): Icon on the right

#### DropdownMenu
Accessible dropdown menu.

```javascript
import { DropdownMenu } from '@/components/ui';

<DropdownMenu
  trigger={<ActionButton variant="ghost">Actions</ActionButton>}
  items={[
    { label: 'Edit', onClick: handleEdit, icon: <EditIcon /> },
    { label: 'Delete', onClick: handleDelete, icon: <DeleteIcon />, danger: true },
    { divider: true },
    { label: 'Archive', onClick: handleArchive, disabled: true }
  ]}
  align="right"
/>
```

**Props:**
- `trigger` (ReactNode): Trigger element
- `items` (array): Menu items `[{label, onClick, icon, disabled, divider, danger}]`
- `align` (string): 'left', 'right'
- `position` (string): 'bottom', 'top'

#### Tabs
Accessible tabs with keyboard navigation.

```javascript
import { Tabs } from '@/components/ui';

<Tabs
  tabs={[
    { id: 'details', label: 'Details', content: <DetailsTab /> },
    { id: 'settings', label: 'Settings', content: <SettingsTab />, icon: <SettingsIcon /> }
  ]}
  defaultTab="details"
  onChange={(tabId) => console.log(tabId)}
  variant="line"
/>
```

**Props:**
- `tabs` (array): Tab definitions `[{id, label, content, icon, disabled}]`
- `defaultTab` (string): Default active tab ID
- `onChange` (function): Tab change callback
- `variant` (string): 'line', 'pill', 'enclosed'

#### Pagination
Accessible pagination component.

```javascript
import { Pagination } from '@/components/ui';

<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  totalItems={totalItems}
  itemsPerPage={10}
  onPageChange={handlePageChange}
  showInfo
/>
```

**Props:**
- `currentPage` (number): Current page (1-indexed)
- `totalPages` (number): Total number of pages
- `totalItems` (number): Total number of items
- `itemsPerPage` (number): Items per page
- `onPageChange` (function): Page change callback
- `maxVisiblePages` (number): Maximum visible page numbers
- `showInfo` (boolean): Show items info

---

## Usage Examples

### Complete Form Example

```javascript
import {
  FormInput,
  FormSelect,
  FormTextarea,
  ImageUpload,
  ActionButton
} from '@/components/ui';
import { useForm } from 'react-hook-form';

function ProductForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormInput
        label="Product Name"
        {...register('name', { required: 'Name is required' })}
        error={errors.name?.message}
        required
      />

      <FormSelect
        label="Category"
        {...register('category', { required: 'Category is required' })}
        options={categories}
        error={errors.category?.message}
        required
      />

      <FormTextarea
        label="Description"
        {...register('description')}
        rows={5}
        maxLength={500}
        showCount
      />

      <ImageUpload
        label="Product Image"
        onChange={handleImageChange}
      />

      <ActionButton type="submit" fullWidth>
        Create Product
      </ActionButton>
    </form>
  );
}
```

### Dashboard Example

```javascript
import {
  SuperadminLayout,
  Breadcrumbs,
  StatsCard,
  Charts,
  DataTable
} from '@/components/ui';

function Dashboard() {
  return (
    <SuperadminLayout>
      <div className="p-6">
        <Breadcrumbs items={[{ label: 'Dashboard' }]} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatsCard
            title="Total Users"
            value="1,234"
            trend="up"
            trendValue="+12%"
            color="blue"
          />
          <StatsCard
            title="Revenue"
            value="$45,231"
            trend="up"
            trendValue="+8%"
            color="green"
          />
        </div>

        <Charts
          type="line"
          title="Sales Overview"
          data={salesData}
          series={[{ dataKey: 'sales', color: '#3B82F6' }]}
        />

        <DataTable
          columns={columns}
          data={orders}
          onRowClick={handleRowClick}
        />
      </div>
    </SuperadminLayout>
  );
}
```

---

## Design System

### Color Palette

- **Primary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Danger**: Red (#EF4444)
- **Gray**: Various shades for backgrounds and text

### Typography

- **Headings**: Font-semibold to Font-bold
- **Body**: Font-normal (text-sm to text-base)
- **Labels**: Font-medium (text-sm)

### Spacing

Following Tailwind's spacing scale (0.25rem increments):
- Tight: p-2, p-3
- Normal: p-4, p-6
- Loose: p-8, p-12

### Accessibility

All components follow WCAG 2.1 AA standards:
- Proper ARIA labels and roles
- Keyboard navigation support
- Focus indicators
- Screen reader friendly
- Semantic HTML

### Responsive Design

All components are mobile-first and responsive:
- Mobile: Base styles
- Tablet: sm: and md: breakpoints
- Desktop: lg: and xl: breakpoints

---

## Contributing

When adding new components:
1. Follow existing patterns and conventions
2. Add proper PropTypes or TypeScript definitions
3. Include accessibility features
4. Document props and usage examples
5. Update this README

## License

Internal use only - SuperAdmin Web Application
