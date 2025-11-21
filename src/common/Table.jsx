import React from 'react';

const Table = ({ columns = [], data = [], className = '', rowKey = (row, i) => i, emptyText = 'No data', ...props }) => (
  <div className={`overflow-x-auto ${className}`}>
    <table className="min-w-full bg-white border rounded shadow-sm" {...props}>
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.key || col.dataIndex} className="border border-gray-300 bg-gray-50 text-left font-semibold text-gray-700" style={{
              fontSize:"13px",
              textAlign: col.textAlign??"left",
              padding:"6px"
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
