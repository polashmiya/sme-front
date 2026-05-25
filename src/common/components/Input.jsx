import React from 'react';

const Input = React.forwardRef(({ label, type = 'text', className = '', error, ...props }, ref) => (
  <div className={`w-full ${className}`}>
    {label && (
      <label className="block mb-1 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </label>
    )}
    <input
      ref={ref}
      type={type}
      className={`ctrl-input${error ? ' error' : ''}`}
      {...props}
    />
    {error && (
      <span className="text-xs mt-1 block" style={{ color: '#ef4444' }}>{error}</span>
    )}
  </div>
));

export default Input;
