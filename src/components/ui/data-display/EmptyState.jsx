/**
 * EmptyState Component
 * Display empty state with icon, message, and optional action
 *
 * @param {Object} props
 * @param {string} props.title - Main message
 * @param {string} props.description - Detailed description
 * @param {React.ReactNode} props.icon - Custom icon
 * @param {React.ReactNode} props.action - Action button or element
 * @param {string} props.size - Size: 'sm', 'md', 'lg'
 */
const EmptyState = ({
  title = 'No data found',
  description,
  icon,
  action,
  size = 'md',
  className = '',
}) => {
  const sizes = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
  };

  const iconSizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const defaultIcon = (
    <svg
      className={`${iconSizes[size]} text-gray-400 mx-auto mb-4`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
  );

  return (
    <div className={`text-center ${sizes[size]} ${className}`}>
      {icon || defaultIcon}

      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>

      {description && <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">{description}</p>}

      {action && <div className="flex justify-center">{action}</div>}
    </div>
  );
};

export default EmptyState;
