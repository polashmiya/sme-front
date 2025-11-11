export default function Table({ columns, data }) {
  return (
    <table className="table-base">
      <thead>
        <tr>
          {columns.map(c => (
            <th key={c.key} className={c.className}>{c.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx}>
            {columns.map(c => (
              <td key={c.key} className={c.className}>{c.render ? c.render(row[c.dataIndex], row) : row[c.dataIndex]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
