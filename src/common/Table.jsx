import React from 'react';

const Table = ({ columns = [], data = [], className = '', rowKey = (row, i) => i, emptyText = 'No data', maxHeight, ...props }) => (
  <div className={`bg-white border-r overflow-x-auto overflow-y-auto relative ${className}`} style={{maxHeight: maxHeight ? maxHeight: 'calc(100vh - 320px)'}}>
    <table className="w-full shadow-sm" {...props}>
  <thead className="sticky top-0 z-20" style={{background: '#f9fafb'}}>
        <tr>
          {columns.map(col => (
            <th key={col.key || col.dataIndex} className="border border-gray-300 bg-gray-50 text-left font-semibold text-gray-700" style={{
              fontSize:"13px",
              textAlign: col.textAlign??"left",
              padding:"6px",
              background: '#f9fafb',
              borderColor: '#e5e7eb',
            }} >
              {col.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="px-2 py-6 text-center text-gray-400">{emptyText}</td>
          </tr>
        ) : (
          data.map((row, i) => (
            <tr key={rowKey(row, i)} className="hover:bg-blue-50">
              {columns.map(col => (
                <td key={col.key || col.dataIndex} className="border border-gray-200 text-gray-700" style={{
                  fontSize:"13px",
                  padding:"6px",
                  textAlign: col.textAlign ??"left"
                }}>
                  {col.render ? col.render(row[col.dataIndex], row, i) : row[col.dataIndex]}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default Table;
