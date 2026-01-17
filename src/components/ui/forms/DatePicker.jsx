import { forwardRef, useState } from 'react';

/**
 * DatePicker Component
 * Date and time input with validation
 *
 * @param {Object} props
 * @param {string} props.label - Input label
 * @param {string} props.error - Error message
 * @param {string} props.helperText - Helper text
 * @param {string} props.mode - 'date', 'time', 'datetime-local'
 * @param {boolean} props.required - Required field
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.min - Minimum date/time
 * @param {string} props.max - Maximum date/time
 */
const DatePicker = forwardRef(
  (
    {
      label,
      error,
      helperText,
      mode = 'date',
      required = false,
      disabled = false,
      min,
      max,
      className = '',
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    const inputId = props.id || props.name;

    const getInputType = () => {
      switch (mode) {
        case 'time':
          return 'time';
        case 'datetime-local':
          return 'datetime-local';
        case 'date':
        default:
          return 'date';
      }
    };

    return (
      <div className={`mb-4 ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={getInputType()}
            disabled={disabled}
            required={required}
            min={min}
            max={max}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
              error
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300'
            }`}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />

          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg
              className={`w-5 h-5 ${focused ? 'text-blue-500' : 'text-gray-400'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={`${inputId}-helper`} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';

export default DatePicker;
