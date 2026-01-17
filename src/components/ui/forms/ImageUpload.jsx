import { useState, useRef } from 'react';

/**
 * ImageUpload Component
 * Image upload with preview and validation
 *
 * @param {Object} props
 * @param {string} props.label - Upload label
 * @param {string} props.error - Error message
 * @param {string} props.helperText - Helper text
 * @param {Function} props.onChange - Change callback
 * @param {string} props.value - Current image URL
 * @param {string} props.accept - Accepted file types
 * @param {number} props.maxSize - Maximum file size in MB
 * @param {boolean} props.required - Required field
 * @param {boolean} props.disabled - Disabled state
 */
const ImageUpload = ({
  label,
  error,
  helperText,
  onChange,
  value,
  accept = 'image/*',
  maxSize = 5,
  required = false,
  disabled = false,
  className = '',
  name,
  id,
}) => {
  const [preview, setPreview] = useState(value || null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const inputId = id || name || 'image-upload';

  const validateFile = (file) => {
    if (!file) return false;

    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxSize}MB`;
    }

    if (!file.type.startsWith('image/')) {
      return 'Please upload an image file';
    }

    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file);
    if (validation !== true) {
      if (onChange) onChange(null, validation);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      if (onChange) onChange(file, null);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const validation = validateFile(file);
    if (validation !== true) {
      if (onChange) onChange(null, validation);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      if (onChange) onChange(file, null);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onChange) onChange(null, null);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg transition-colors ${
          dragOver
            ? 'border-blue-500 bg-blue-50'
            : error
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 bg-white'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <input
          ref={fileInputRef}
          id={inputId}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={disabled}
          required={required}
          className="hidden"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
        />

        {preview ? (
          <div className="relative p-4">
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 mx-auto rounded-lg"
            />
            {!disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-6 right-6 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                aria-label="Remove image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ) : (
          <div
            onClick={handleClick}
            className="p-8 text-center"
          >
            <svg
              className="w-12 h-12 mx-auto mb-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm text-gray-600 mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF up to {maxSize}MB
            </p>
          </div>
        )}
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
};

export default ImageUpload;
