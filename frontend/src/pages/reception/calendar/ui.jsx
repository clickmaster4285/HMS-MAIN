import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { X, Loader2, Check, ChevronDown } from 'lucide-react';

// Button Component with loading state and icons
export const Button = forwardRef(({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  ...props
}, ref) => {
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-300',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'hover:bg-gray-100 text-gray-800',
    outline: 'border border-primary-600 text-primary-600 hover:bg-primary-50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      ref={ref}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center rounded-lg font-medium
        transition-all duration-200 focus:outline-none focus:ring-2
        focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-70
        disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="animate-spin mr-2" size={18} />
      ) : Icon && iconPosition === 'left' ? (
        <Icon className="mr-2" size={18} />
      ) : null}
      {children}
      {Icon && iconPosition === 'right' && !isLoading ? (
        <Icon className="ml-2" size={18} />
      ) : null}
    </button>
  );
});

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'ghost', 'outline']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  icon: PropTypes.elementType,
  iconPosition: PropTypes.oneOf(['left', 'right']),
};

// Input Component with floating labels and error state
export const Input = forwardRef(({
  label,
  value,
  onChange,
  error,
  className = '',
  containerClassName = '',
  floatingLabel = false,
  ...props
}, ref) => {
  return (
    <div className={`relative mb-4 ${containerClassName}`}>
      {!floatingLabel && label && (
        <label className="block text-sm font-medium mb-2 text-gray-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        value={value}
        onChange={onChange}
        className={`
          peer w-full px-4 py-3 border rounded-lg focus:ring-2
          focus:ring-primary-500 focus:border-primary-500 transition-all
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${floatingLabel ? 'pt-5' : ''} ${className}
        `}
        {...props}
      />
      {floatingLabel && (
        <label className={`
          absolute left-4 top-3 text-gray-500 transition-all duration-200
          peer-focus:text-primary-600 peer-focus:scale-90 peer-focus:-translate-y-2
          peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
          ${value ? 'scale-90 -translate-y-2' : ''}
        `}>
          {label}
        </label>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.propTypes = {
  label: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  error: PropTypes.string,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  floatingLabel: PropTypes.bool,
};

// Enhanced Textarea Component with auto-resize
export const Textarea = forwardRef(({
  label,
  value,
  onChange,
  error,
  className = '',
  containerClassName = '',
  minRows = 3,
  maxRows = 6,
  ...props
}, ref) => {
  const handleChange = (e) => {
    if (onChange) onChange(e);
    
    // Auto-resize
    const textarea = e.target;
    textarea.style.height = 'auto';
    const maxHeight = maxRows * 24; // Approximate line height
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  };

  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium mb-2 text-gray-700">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        value={value}
        onChange={handleChange}
        style={{ minHeight: `${minRows * 24}px` }}
        className={`
          w-full px-4 py-3 border rounded-lg focus:ring-2
          focus:ring-primary-500 focus:border-primary-500 transition-all
          ${error ? 'border-red-500' : 'border-gray-300'} ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Textarea.propTypes = {
  label: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  error: PropTypes.string,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  minRows: PropTypes.number,
  maxRows: PropTypes.number,
};

// Enhanced Select Component with custom dropdown
export const Select = forwardRef(({
  label,
  value,
  onChange,
  options,
  error,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium mb-2 text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          value={value}
          onChange={onChange}
          className={`
            appearance-none w-full px-4 py-3 pr-10 border rounded-lg
            focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            ${error ? 'border-red-500' : 'border-gray-300'} ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Select.propTypes = {
  label: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  error: PropTypes.string,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
};

// Enhanced Checkbox Component with toggle switch option
export const Checkbox = ({
  label,
  checked,
  onChange,
  className = '',
  containerClassName = '',
  asSwitch = false,
  ...props
}) => {
  return (
    <div className={`flex items-center mb-4 ${containerClassName}`}>
      <label className="flex items-center cursor-pointer">
        {asSwitch ? (
          <div className="relative">
            <input
              type="checkbox"
              checked={checked}
              onChange={onChange}
              className="sr-only"
              {...props}
            />
            <div className={`
              w-12 h-6 rounded-full shadow-inner transition-colors
              ${checked ? 'bg-primary-600' : 'bg-gray-300'}
            `}></div>
            <div className={`
              absolute left-1 top-1 w-4 h-4 rounded-full shadow
              bg-white transition-transform
              ${checked ? 'transform translate-x-6' : ''}
            `}></div>
          </div>
        ) : (
          <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className={`
              h-5 w-5 rounded border-gray-300 text-primary-600
              focus:ring-primary-500 transition-colors ${className}
            `}
            {...props}
          />
        )}
        {label && (
          <span className={`ml-3 text-sm ${asSwitch ? 'font-medium' : ''}`}>
            {label}
          </span>
        )}
      </label>
    </div>
  );
};

Checkbox.propTypes = {
  label: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  asSwitch: PropTypes.bool,
};

// Enhanced Badge Component with more variants and icons
export const Badge = ({
  children,
  variant = 'primary',
  className = '',
  icon: Icon,
  onRemove,
  ...props
}) => {
  const variantClasses = {
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-gray-100 text-gray-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    success: 'bg-green-100 text-green-800',
    info: 'bg-primary-100 text-primary-800',
    outline: 'border border-gray-300 text-gray-700',
  };

  return (
    <div
      className={`
        inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
        ${variantClasses[variant]} ${className}
      `}
      {...props}
    >
      {Icon && <Icon className="mr-1.5 h-4 w-4" />}
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1.5 p-0.5 rounded-full hover:bg-black/10 focus:outline-none"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'danger',
    'warning',
    'success',
    'info',
    'outline',
  ]),
  className: PropTypes.string,
  icon: PropTypes.elementType,
  onRemove: PropTypes.func,
};

// Enhanced Modal Component with animations and better structure
export const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  className = '',
  showCloseButton = true,
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center bg-white/15 backdrop-blur-lg min-h-screen lg:pt-10 pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay with transition */}
        <div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-white/15"></div>
        </div>

        {/* Modal panel with transition */}
        <div
          className={`
            inline-block align-bottom bg-white rounded-lg text-left
            overflow-hidden shadow-xl transform transition-all sm:my-8
            sm:align-middle w-full ${sizes[size]} ${className}
          `}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900"
                    id="modal-headline"
                  >
                    {title}
                  </h3>
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  )}
                </div>

                {/* Content */}
                <div className="mt-2">{children}</div>
              </div>
            </div>
          </div>

          {/* Footer - can be customized by children */}
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', '2xl', 'full']),
  className: PropTypes.string,
  showCloseButton: PropTypes.bool,
};