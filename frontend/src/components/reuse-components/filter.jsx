export default function FilterGroup({ filters, onChange, onClear }) {
  return (
    <>
      <div className="invoiceCRM-clearfilter">
        <p onClick={onClear}>Clear Filter</p>
      </div>
      <div className="invoiceCRM-search-category">
        {filters.map((filter) => (
          <div key={filter.name} className="invoiceCRM-input-box">
            <label>{filter.label}</label>
            {filter.type === "select" ? (
              <select
                value={filter.value}
                onChange={(e) => onChange(filter.name, e.target.value)}
              >
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : filter.type === "dateRange" ? (
              <nav className="invoiceCRM-date-range">
                <input
                  type="date"
                  value={filter.value.from}
                  onChange={(e) => onChange(filter.name, { ...filter.value, from: e.target.value })}
                  className="invoiceCRM-date-input"
                />
                <span>To</span>
                <input
                  type="date"
                  value={filter.value.to}
                  onChange={(e) => onChange(filter.name, { ...filter.value, to: e.target.value })}
                  className="invoiceCRM-date-input"
                />
              </nav>
            ) : (
              <input
                type="date"
                value={filter.value}
                onChange={(e) => onChange(filter.name, e.target.value)}
                className="invoiceCRM-date"
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
}
