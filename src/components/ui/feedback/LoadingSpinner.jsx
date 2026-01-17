/**
 * LoadingSpinner Component
 * Loading spinner in various sizes and colors
 *
 * @param {Object} props
 * @param {string} props.size - Size: 'sm', 'md', 'lg', 'xl'
 * @param {string} props.color - Color: 'blue', 'white', 'gray'
 * @param {string} props.text - Loading text
 * @param {boolean} props.fullScreen - Full screen overlay
 */
const LoadingSpinner = ({
  size = 'md',
  color = 'blue',
  text,
  fullScreen = false,
  className = '',
}) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4',
  };

  const colors = {
    blue: 'border-blue-600 border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-600 border-t-transparent',
  };

  const spinner = (
    <div
      className={`inline-block rounded-full animate-spin ${sizes[size]} ${colors[color]} ${className}`}
      role="status"
      aria-label="Loading"
    ></div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="text-center">
          {spinner}
          {text && <p className="mt-4 text-white text-lg">{text}</p>}
        </div>
      </div>
    );
  }

  if (text) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {spinner}
        <span className="text-gray-700">{text}</span>
      </div>
    );
  }

  return spinner;
};

/**
 * Inline loading spinner for buttons
 */
export const ButtonSpinner = ({ className = '' }) => (
  <LoadingSpinner size="sm" color="white" className={className} />
);

export default LoadingSpinner;
