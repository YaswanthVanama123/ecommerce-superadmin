/**
 * ErrorMessage Component
 * Display error messages with optional retry action
 *
 * @param {Object} props
 * @param {string} props.title - Error title
 * @param {string} props.message - Error message
 * @param {Function} props.onRetry - Retry callback
 * @param {string} props.retryText - Retry button text
 * @param {string} props.variant - Variant: 'inline', 'card', 'page'
 */
const ErrorMessage = ({
  title = 'Error',
  message = 'Something went wrong. Please try again.',
  onRetry,
  retryText = 'Try Again',
  variant = 'inline',
  className = '',
}) => {
  const errorIcon = (
    <svg
      className="w-12 h-12 text-red-500 mx-auto mb-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  );

  if (variant === 'inline') {
    return (
      <div
        className={`flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}
        role="alert"
      >
        <svg
          className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-800">{title}</h3>
          <p className="text-sm text-red-700 mt-1">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 text-sm font-medium text-red-600 hover:text-red-800 underline"
            >
              {retryText}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div
        className={`bg-white rounded-lg shadow p-6 text-center ${className}`}
        role="alert"
      >
        {errorIcon}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            {retryText}
          </button>
        )}
      </div>
    );
  }

  if (variant === 'page') {
    return (
      <div
        className={`min-h-screen flex items-center justify-center bg-gray-50 ${className}`}
        role="alert"
      >
        <div className="text-center max-w-md px-4">
          {errorIcon}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600 mb-6">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {retryText}
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default ErrorMessage;
