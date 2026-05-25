import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select...',
  searchable = true,
  className = '',
  renderOption,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState(options);
  const ref = useRef(null);

  useEffect(() => {
    if (searchable && search) {
      setFiltered(options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase())));
    } else {
      setFiltered(options);
    }
  }, [search, options, searchable]);

  useEffect(() => {
    const handleClick = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = option => {
    onChange(option);
    setOpen(false);
    setSearch('');
  };

  return (
    <div className={`relative w-full ${className}`} ref={ref}>
      {label && (
        <label className="block mb-1 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </label>
      )}
      <button
        type="button"
        className="dropdown-trigger"
        onClick={() => setOpen(o => !o)}
      >
        <span className="truncate">
          {value
            ? <span>{value.label}</span>
            : <span style={{ color: 'var(--text-muted)' }}>{placeholder}</span>
          }
        </span>
        <svg className="icon-muted w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="dropdown-panel absolute z-50 mt-1 w-full max-h-60 overflow-auto">
          {searchable && (
            <input
              className="dropdown-search"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
          )}
          <ul>
            {filtered.length === 0 && (
              <li className="dropdown-item" style={{ cursor: 'default' }}>No options</li>
            )}
            {filtered.map(option => (
              <li
                key={option.value}
                className={`dropdown-item ${value && value.value === option.value ? 'selected' : ''}`}
                onClick={() => handleSelect(option)}
              >
                {renderOption ? renderOption(option) : option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
