import React from 'react';

const SearchInput = ({ value, onChange, onClear, placeholder = 'Search...', className = '', ...props }) => (
  <div className={`relative w-full ${className}`}>
    <input
      type="text"
      className="w-full px-4 border rounded focus:outline-none focus:ring-2 focus:ring-primary/50 pr-10"
      style={{ height: '30px' }}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      {...props}
    />
    {value && (
      <button
        type="button"
        className="absolute right-8 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
        onClick={onClear}
        tabIndex={-1}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    )}
    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
    </span>
  </div>
);

export default SearchInput;
