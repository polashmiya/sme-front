import React from 'react';

const VARIANTS = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  outline: 'bg-white border border-gray-300 text-gray-800 hover:bg-gray-50',
};

const Button = ({
  children,
  variant = 'primary',
  className = '',
  loading = false,
  disabled = false,
  ...props
}) => (
  <button
    className={`px-4 rounded font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${VARIANTS[variant] || VARIANTS.primary} ${className} ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
    style={{ height: '30px' }}
    disabled={disabled || loading}
    {...props}
  >
    {loading ? (
      <span className="flex items-center justify-center">
        <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
        Loading...
      </span>
    ) : (
      <span className="flex items-center justify-center gap-2 w-full">{children}</span>
    )}
  </button>
);

export default Button;
