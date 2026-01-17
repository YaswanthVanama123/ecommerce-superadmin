import { useState, useRef, useEffect } from 'react';

/**
 * DropdownMenu Component
 * Accessible dropdown menu with keyboard navigation
 *
 * @param {Object} props
 * @param {React.ReactNode} props.trigger - Trigger element
 * @param {Array} props.items - Menu items [{label, onClick, icon, disabled, divider}]
 * @param {string} props.align - Alignment: 'left', 'right'
 * @param {string} props.position - Position: 'bottom', 'top'
 */
const DropdownMenu = ({
  trigger,
  items = [],
  align = 'right',
  position = 'bottom',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleItemClick = (item) => {
    if (!item.disabled && item.onClick) {
      item.onClick();
      setIsOpen(false);
    }
  };

  const alignClasses = {
    left: 'left-0',
    right: 'right-0',
  };

  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* Trigger */}
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className={`absolute ${alignClasses[align]} ${positionClasses[position]} z-50 min-w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1`}
          role="menu"
          aria-orientation="vertical"
        >
          {items.map((item, index) => {
            if (item.divider) {
              return (
                <div
                  key={`divider-${index}`}
                  className="my-1 border-t border-gray-200"
                  role="separator"
                ></div>
              );
            }

            return (
              <button
                key={index}
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
                className={`w-full flex items-center px-4 py-2 text-sm text-left transition-colors ${
                  item.disabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                } ${item.danger ? 'text-red-600 hover:bg-red-50' : ''}`}
                role="menuitem"
              >
                {item.icon && <span className="mr-3">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
