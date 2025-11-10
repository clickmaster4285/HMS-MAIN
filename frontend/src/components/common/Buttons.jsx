// src/components/common/Buttons.js
import React from 'react';

export const ButtonGroup = ({ children, className = '' }) => (
  <div className={`flex space-x-4 ${className}`}>
    {children}
  </div>
);

// Enhanced Button component
export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  icon: Icon,
  isLoading = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'rounded-md shadow-sm font-medium focus:outline-none focus:ring-1 focus:ring-offset-2 flex items-center justify-center transition-all duration-200';

  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 border border-primary-600',
    secondary: 'bg-white border text-gray-700 hover:bg-gray-50 focus:ring-gray-500 border-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border-red-600',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
  };

  const sizeClasses = {
    small: 'px-3 py-1.5 text-xs',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${sizeClasses[size]} 
        ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
        ${className}
      `}
      {...props} // This is safe now since we've extracted custom props
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : (
        <>
          {Icon && <Icon className="mr-2" />}
          {children}
        </>
      )}
    </button>
  );
};