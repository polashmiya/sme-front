import React from 'react';

const Pagination = ({
  current = 1,
  total = 1,
  pageSize = 10,
  onChange,
  className = '',
  showTotal = true,
}) => {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const handleClick = (page) => {
    if (page !== current && page > 0 && page <= totalPages) {
      onChange(page);
    }
  };

  const getPages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 4) pages.push('...');
      for (let i = Math.max(2, current - 1); i <= Math.min(totalPages - 1, current + 1); i++) pages.push(i);
      if (current < totalPages - 3) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className={`flex items-center justify-center gap-2 mt-1 ${className}`}>
      <button
        className="px-2 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
        onClick={() => handleClick(current - 1)}
        disabled={current === 1}
      >
        &lt;
      </button>
      {getPages().map((page, idx) =>
        page === '...'
          ? <span key={idx} className="px-2">...</span>
          : <button
              key={page}
              className={`px-3 py-1 rounded border ${current === page ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100'}`}
              onClick={() => handleClick(page)}
              disabled={current === page}
            >
              {page}
            </button>
      )}
      <button
        className="px-2 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
        onClick={() => handleClick(current + 1)}
        disabled={current === totalPages}
      >
        &gt;
      </button>
      {showTotal && (
        <span className="ml-4 text-sm text-gray-500">Page {current} of {totalPages}</span>
      )}
    </div>
  );
};

export default Pagination;
