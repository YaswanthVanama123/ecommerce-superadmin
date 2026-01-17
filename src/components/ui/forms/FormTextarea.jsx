import { forwardRef } from 'react';

/**
 * FormTextarea Component
 * Accessible textarea with label, error, and character count
 *
 * @param {Object} props
 * @param {string} props.label - Textarea label
 * @param {string} props.error - Error message
 * @param {string} props.helperText - Helper text
 * @param {boolean} props.required - Required field
 * @param {boolean} props.disabled - Disabled state
 * @param {number} props.maxLength - Maximum character length
 * @param {number} props.rows - Number of rows
 * @param {boolean} props.showCount - Show character count
 */
const FormTextarea = forwardRef(
  (
    {
      label,
      error,
      helperText,
      required = false,
      disabled = false,
      maxLength,
      rows = 4,
      showCount = false,
      className = '',
      value = '',
      ...props
    },
    ref
  ) => {
    const textareaId = props.id || props.name;
    const currentLength = value?.length || 0;

    return (
      <div className={`mb-4 ${className}`}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          required={required}
          rows={rows}
          maxLength={maxLength}
          value={value}
          className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-y ${
            error
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300'
          }`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
          }
          {...props}
        />

        <div className="flex justify-between items-center mt-1">
          <div className="flex-1">
            {error && (
              <p id={`${textareaId}-error`} className="text-sm text-red-600">
                {error}
              </p>
            )}

            {!error && helperText && (
              <p id={`${textareaId}-helper`} className="text-sm text-gray-500">
                {helperText}
              </p>
            )}
          </div>

          {showCount && maxLength && (
            <p
              className={`text-sm ${
                currentLength > maxLength ? 'text-red-600' : 'text-gray-500'
              }`}
            >
              {currentLength}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

FormTextarea.displayName = 'FormTextarea';

export default FormTextarea;
