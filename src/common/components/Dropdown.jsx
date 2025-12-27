import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({ label, options = [], value, onChange, placeholder = 'Select...', searchable = true, className = '', renderOption }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState(options);
  const ref = useRef(null);

  useEffect(() => {
    if (searchable && search) {
      setFiltered(
        options.filter(opt =>
          opt.label.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFiltered(options);
    }
  }, [search, options, searchable]);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setOpen(false);
    setSearch('');
  };

  return (
    <div className={`relative w-full ${className}`} ref={ref}>
      {label && <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>}
      <button
        type="button"
        className="w-full px-2 border rounded bg-white text-left focus:outline-none focus:ring-2 focus:ring-primary/50 flex justify-between items-center"
        style={{ height: '30px' }}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{value ? value.label : <span className="text-gray-400">{placeholder}</span>}</span>
        <svg className="w-4 h-4 ml-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border rounded shadow-lg max-h-60 overflow-auto">
          {searchable && (
            <input
              className="w-full px-3 py-2 border-b focus:outline-none"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
          )}
          <ul>
            {filtered.length === 0 && (
              <li className="px-4 py-2 text-gray-400">No options</li>
            )}
            {filtered.map(option => (
              <li
                key={option.value}
                className={`px-4 py-2 cursor-pointer hover:bg-primary/10 ${value && value.value === option.value ? 'bg-primary/5 font-semibold' : ''}`}
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
