import React from 'react';

const Pagination = ({
  current = 1,
  total = 1,
  pageSize = 10,
  onChange,
  className = '',
  showTotal = true,
  pageSizeOptions = [10, 20, 50, 100, 500, 1000],
  onPageSizeChange,
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
    return pages;
  }

  pages.push(1);

  if (current > 3) pages.push('left-ellipsis');

  const start = Math.max(2, current - 1);
  const end = Math.min(totalPages - 1, current + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (current < totalPages - 2) pages.push('right-ellipsis');

  pages.push(totalPages);
  return pages;
};
  return (
    <div className={`flex items-center justify-center gap-2 mt-3 ${className}`}>
      <label className="flex items-center gap-1">
        <span className="text-sm text-gray-600">Rows per page:</span>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={pageSize}
          onChange={e => {
            if (onPageSizeChange) onPageSizeChange(Number(e.target.value));
          }}
        >
          {pageSizeOptions.map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </label>
      <button
        className="px-2 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
        onClick={() => handleClick(current - 1)}
        disabled={current === 1}
      >
        &lt;
      </button>
      {getPages().map((page, idx) =>
  typeof page === "string" ? (
    <span key={`ellipsis-${idx}`} className="px-2">...</span>
  ) : (
    <button
      key={`page-${idx}`}
      className={`px-3 py-1 rounded border ${
        Number(current) === page ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-100"
      }`}
      onClick={() => handleClick(page)}  
      disabled={Number(current) === page}
    >
      {page}
    </button>
  )
)}
      <button
        className="px-2 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
        onClick={() => handleClick(current + 1)}
        disabled={current === totalPages}
      >
        &gt;
      </button>
      {showTotal && (
        <span className="ml-4 text-sm text-gray-600">
          Showing {(current - 1) * pageSize + 1} - {Math.min(current * pageSize, total)} of {total}
        </span>
      )}
    </div>
  );
};

export default Pagination;
