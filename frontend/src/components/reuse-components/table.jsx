export default function DataTable({ columns, rows }) {
  return (
    <div className="invoiceCRM-table-cointainer">
      <table>
        <thead className="invoiceCRM-table-head">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="invoiceCRM-table-body">
          {rows.length > 0 ? (
            rows.map((row, i) => (
              <tr key={i}>
                {columns.map((col, j) => (
                  <td key={j}>
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length}>
                <pre>No Data Found</pre>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
