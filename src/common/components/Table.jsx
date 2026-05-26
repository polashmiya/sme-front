import React from 'react';

const Table = ({
  columns = [],
  data = [],
  className = '',
  rowKey = (row, i) => i,
  emptyText = 'No data',
  maxHeight,
  footer,
  ...props
}) => (
  <div
    className={`border-r overflow-x-auto overflow-y-auto relative ${className}`}
    style={{
      maxHeight: maxHeight || 'calc(100vh - 320px)',
      marginTop: 0,
      background: 'var(--bg-surface)',
      borderColor: 'var(--border)',
      transition: 'background-color 0.2s ease',
    }}
  >
    <table className="w-full" {...props}>
      <thead className="sticky top-0 z-20" style={{ background: 'var(--bg-elevated)' }}>
        <tr>
          {columns.map(col => (
            <th
              key={col.key || col.dataIndex}
              style={{
                fontSize: 13,
                textAlign: col.textAlign ?? 'left',
                padding: '7px 8px',
                background: 'var(--bg-elevated)',
                borderColor: 'var(--border-strong)',
                color: 'var(--text-secondary)',
                fontWeight: 600,
                borderWidth: 1,
                borderStyle: 'solid',
                whiteSpace: 'nowrap',
              }}
            >
              {col.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td
              colSpan={columns.length}
              className="px-2 py-8 text-center text-sm"
              style={{ color: 'var(--text-muted)' }}
            >
              {emptyText}
            </td>
          </tr>
        ) : (
          data.map((row, i) => (
            <tr
              key={rowKey(row, i)}
              style={{ transition: 'background-color 0.1s' }}
              className="hover:bg-primary/5"
            >
              {columns.map(col => (
                <td
                  key={col.key || col.dataIndex}
                  style={{
                    fontSize: 13,
                    padding: '5px 8px',
                    textAlign: col.textAlign ?? 'left',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)',
                    borderWidth: 1,
                    borderStyle: 'solid',
                  }}
                >
                  {col.render ? col.render(row[col.dataIndex], row, i) : row[col.dataIndex]}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
      {footer && <tfoot>{footer}</tfoot>}
    </table>
  </div>
);

export default Table;
