import React from 'react';

const Input = React.forwardRef(({ label, type = 'text', className = '', error, ...props }, ref) => (
  <div className={`w-full ${className}`}>
    {label && <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>}
    <input
      ref={ref}
      type={type}
      className={`w-full px-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
      style={{ height: '30px' }}
      {...props}
    />
    {error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}
  </div>
));

export default Input;
