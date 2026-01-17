/**
 * LoadingSkeleton Component
 * Skeleton loading placeholders for different content types
 *
 * @param {Object} props
 * @param {string} props.variant - Skeleton type: 'card', 'table', 'text', 'circle', 'rectangle'
 * @param {number} props.count - Number of skeleton items
 * @param {number} props.height - Custom height
 * @param {number} props.width - Custom width
 * @param {string} props.className - Additional CSS classes
 */
const LoadingSkeleton = ({
  variant = 'text',
  count = 1,
  height,
  width,
  className = '',
}) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        );

      case 'table':
        return (
          <div className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
            <div className="h-12 bg-gray-200"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 border-t border-gray-200"></div>
            ))}
          </div>
        );

      case 'circle':
        return (
          <div
            className="bg-gray-200 rounded-full animate-pulse"
            style={{
              width: width || '3rem',
              height: height || '3rem',
            }}
          ></div>
        );

      case 'rectangle':
        return (
          <div
            className="bg-gray-200 rounded animate-pulse"
            style={{
              width: width || '100%',
              height: height || '12rem',
            }}
          ></div>
        );

      case 'text':
      default:
        return (
          <div className="space-y-3 animate-pulse">
            {[...Array(count)].map((_, i) => (
              <div
                key={i}
                className="h-4 bg-gray-200 rounded"
                style={{
                  width: width || `${Math.random() * 30 + 70}%`,
                }}
              ></div>
            ))}
          </div>
        );
    }
  };

  return <div className={className}>{renderSkeleton()}</div>;
};

/**
 * Skeleton text line
 */
export const SkeletonText = ({ className = '' }) => (
  <div className={`h-4 bg-gray-200 rounded animate-pulse ${className}`}></div>
);

/**
 * Skeleton card
 */
export const SkeletonCard = ({ className = '' }) => (
  <LoadingSkeleton variant="card" className={className} />
);

/**
 * Skeleton table
 */
export const SkeletonTable = ({ className = '' }) => (
  <LoadingSkeleton variant="table" className={className} />
);

export default LoadingSkeleton;
