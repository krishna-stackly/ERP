import { useState, useEffect, useRef } from "react";
import "./assetSale.css";

const DUMMY = [
  { id: 1, sale_no: "ASL-2025-001", asset_id: "AST-001", asset_name: "Generator Unit A",  type: "Electrical",   dept: "Admin",     buyer: "Suresh Enterprises",   sale_date: "10-Jan-2025", book_value: "1,20,000.00", sale_price: "95,000.00",  gain_loss: "-25,000.00", status: "Completed" },
  { id: 2, sale_no: "ASL-2025-002", asset_id: "AST-004", asset_name: "HVAC System",        type: "Mechanical",   dept: "Facilities",buyer: "Blue Air Pvt Ltd",      sale_date: "18-Jan-2025", book_value: "2,50,000.00", sale_price: "2,80,000.00",gain_loss: "30,000.00",  status: "Approved"   },
  { id: 3, sale_no: "ASL-2025-003", asset_id: "AST-007", asset_name: "Compressor #2",      type: "Mechanical",   dept: "Production",buyer: "TechParts Co",          sale_date: "22-Jan-2025", book_value: "80,000.00",  sale_price: "60,000.00",  gain_loss: "-20,000.00", status: "Submitted"  },
  { id: 4, sale_no: "ASL-2025-004", asset_id: "AST-012", asset_name: "Server Rack B",      type: "IT / Network", dept: "IT",        buyer: "DataEdge Solutions",    sale_date: "05-Feb-2025", book_value: "45,000.00",  sale_price: "50,000.00",  gain_loss: "5,000.00",   status: "Draft"      },
  { id: 5, sale_no: "ASL-2025-005", asset_id: "AST-015", asset_name: "Fork Lift #1",       type: "Vehicle",      dept: "Warehouse", buyer: "Logistics Hub Ltd",     sale_date: "12-Feb-2025", book_value: "3,50,000.00", sale_price: "3,00,000.00",gain_loss: "-50,000.00", status: "Rejected"   },
];

const STATUS_OPTIONS = ["All", "Draft", "Submitted", "Approved", "Completed", "Rejected"];
const TYPE_OPTIONS   = ["All", "Electrical", "Mechanical", "Civil", "IT / Network", "Vehicle", "HVAC", "Furniture"];
const DEPT_OPTIONS   = ["All", "Admin", "Facilities", "Production", "IT", "Warehouse", "Finance", "HR"];
const BUYER_OPTIONS  = ["All", "Internal", "External"];
const REPORT_OPTIONS = ["Asset Sale Register", "Gain / Loss Summary", "Department-wise Sale Report", "Buyer-wise Report", "Monthly Sale Summary"];

function statusClass(s) {
  switch (s) {
    case "Draft":     return "asl-badge asl-badge-draft";
    case "Submitted": return "asl-badge asl-badge-submitted";
    case "Approved":  return "asl-badge asl-badge-approved";
    case "Completed": return "asl-badge asl-badge-completed";
    case "Rejected":  return "asl-badge asl-badge-rejected";
    default:          return "asl-badge";
  }
}

function FilterDropdown({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div className="asl-input-box" ref={ref}>
      <label>{label}</label>
      <div className={`asl-dropdown-trigger${open ? " open" : ""}`} onClick={() => setOpen((o) => !o)}>
        <span>{value}</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
          <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9S301 192 288 192L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/>
        </svg>
      </div>
      {open && (
        <div className="asl-dropdown-panel">
          {options.map((o) => (
            <div key={o} className={`asl-dropdown-option${value === o ? " asl-selected" : ""}`}
              onClick={() => { onChange(o); setOpen(false); }}>
              {o}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AssetSale({ setCurrentPage }) {
  const [search,     setSearch]     = useState("");
  const [status,     setStatus]     = useState("All");
  const [type,       setType]       = useState("All");
  const [dept,       setDept]       = useState("All");
  const [buyerType,  setBuyerType]  = useState("All");
  const [fromDate,   setFromDate]   = useState("");
  const [toDate,     setToDate]     = useState("");
  const [report,     setReport]     = useState("Asset Sale Register");
  const [page,       setPage]       = useState(1);
  const perPage = 10;

  const filtered = DUMMY.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.sale_no.toLowerCase().includes(q) || r.asset_name.toLowerCase().includes(q) || r.buyer.toLowerCase().includes(q) || r.asset_id.toLowerCase().includes(q);
    const matchStatus = status    === "All" || r.status === status;
    const matchType   = type      === "All" || r.type   === type;
    const matchDept   = dept      === "All" || r.dept   === dept;
    return matchSearch && matchStatus && matchType && matchDept;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const current    = filtered.slice((page - 1) * perPage, page * perPage);

  const handleClear = () => { setSearch(""); setStatus("All"); setType("All"); setDept("All"); setBuyerType("All"); setFromDate(""); setToDate(""); setPage(1); };

  return (
    <div className="asl-container">
      {/* Header */}
      <div className="asl-header">
        <p>Asset Sale Dashboard</p>
        <button onClick={() => setCurrentPage("assetSaleForm", null)}>+ New Asset Sale</button>
      </div>

      {/* Search */}
      <div className="asl-search-box">
        <label>
          <svg className="asl-search-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
          </svg>
        </label>
        <input placeholder="Search by Sale No, Asset ID, Name or Buyer..." value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
      </div>

      {/* Clear Filters */}
      <div className="asl-clearfilter"><p onClick={handleClear}>Clear Filters</p></div>

      {/* Filters */}
      <div className="asl-filter-row">
        <FilterDropdown label="Status"      value={status}    options={STATUS_OPTIONS}  onChange={(v) => { setStatus(v);    setPage(1); }} />
        <FilterDropdown label="Asset Type"  value={type}      options={TYPE_OPTIONS}    onChange={(v) => { setType(v);      setPage(1); }} />
        <FilterDropdown label="Department"  value={dept}      options={DEPT_OPTIONS}    onChange={(v) => { setDept(v);      setPage(1); }} />
        <FilterDropdown label="Buyer Type"  value={buyerType} options={BUYER_OPTIONS}   onChange={(v) => { setBuyerType(v); setPage(1); }} />

        <div className="asl-period-box">
          <label>Sale Date</label>
          <div className="asl-period-inputs">
            <div>
              <span>From</span>
              <input type="date" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setPage(1); }} />
            </div>
            <div>
              <span>to</span>
              <input type="date" value={toDate}   onChange={(e) => { setToDate(e.target.value);   setPage(1); }} />
            </div>
          </div>
        </div>
      </div>

      {/* Generate Report */}
      <div className="asl-generate-row">
        <label>Generate Report</label>
        <select className="asl-report-select" value={report} onChange={(e) => setReport(e.target.value)}>
          {REPORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
        </select>
        <button className="asl-generate-btn">Generate</button>
      </div>

      {/* Table */}
      <div className="asl-table-container">
        <table>
          <thead>
            <tr>
              <th><input type="checkbox" className="asl-check" /></th>
              <th>Sale No</th>
              <th>Asset ID</th>
              <th>Asset Name</th>
              <th>Type</th>
              <th>Department</th>
              <th>Buyer</th>
              <th>Sale Date</th>
              <th>Book Value (₹)</th>
              <th>Sale Price (₹)</th>
              <th>Gain / Loss (₹)</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {current.length > 0 ? current.map((row) => (
              <tr key={row.id}>
                <td><input type="checkbox" className="asl-check" /></td>
                <td className="asl-id-cell">{row.sale_no}</td>
                <td>{row.asset_id}</td>
                <td>{row.asset_name}</td>
                <td>{row.type}</td>
                <td>{row.dept}</td>
                <td>{row.buyer}</td>
                <td>{row.sale_date}</td>
                <td>{row.book_value}</td>
                <td>{row.sale_price}</td>
                <td className={parseFloat(row.gain_loss.replace(/,/g, "")) >= 0 ? "asl-gain" : "asl-loss"}>{row.gain_loss}</td>
                <td><span className={statusClass(row.status)}>{row.status}</span></td>
                <td id="asl-action-cell">
                  <nav className="asl-dot-container">
                    <button onClick={() => setCurrentPage("assetSaleForm", row)}>Edit</button>
                    <button onClick={() => setCurrentPage("assetSaleForm", row)}>View</button>
                    <button disabled={row.status !== "Draft"} style={{ color: row.status === "Draft" ? "rgba(255,77,79,1)" : "rgba(176,176,176,1)" }}>Delete</button>
                  </nav>
                  <svg className="asl-dots-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 16C12.5304 16 13.0391 16.2107 13.4142 16.5858C13.7893 16.9609 14 17.4696 14 18C14 18.5304 13.7893 19.0391 13.4142 19.4142C13.0391 19.7893 12.5304 20 12 20C11.4696 20 10.9609 19.7893 10.5858 19.4142C10.2107 19.0391 10 18.5304 10 18C10 17.4696 10.2107 16.9609 10.5858 16.5858C10.9609 16.2107 11.4696 16 12 16ZM12 10C12.5304 10 13.0391 10.2107 13.4142 10.5858C13.7893 10.9609 14 11.4696 14 12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14C11.4696 14 10.9609 13.7893 10.5858 13.4142C10.2107 13.0391 10 12.5304 10 12C10 11.4696 10.2107 10.9609 10.5858 10.5858C10.9609 10.2107 11.4696 10 12 10ZM12 4C12.5304 4 13.0391 4.21071 13.4142 4.58579C13.7893 4.96086 14 5.46957 14 6C14 6.53043 13.7893 7.03914 13.4142 7.41421C13.0391 7.78929 12.5304 8 12 8C11.4696 8 10.9609 7.78929 10.5858 7.41421C10.2107 7.03914 10 6.53043 10 6C10 5.46957 10.2107 4.96086 10.5858 4.58579C10.9609 4.21071 11.4696 4 12 4Z"/>
                  </svg>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={13} style={{ textAlign: "center", padding: 30, color: "rgba(176,176,176,1)" }}>No records found</td></tr>
            )}
          </tbody>
          {current.length > 0 && (
            <tfoot>
              <tr>
                <td></td><td>Totals</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td>
                <td>8,45,000.00</td>
                <td>7,85,000.00</td>
                <td className="asl-loss">-60,000.00</td>
                <td>—</td><td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Pagination */}
      <div className="asl-table-bottom">
        <div className="asl-entries-info">
          Showing entries
          <select value={perPage} readOnly><option>{filtered.length}</option></select>
        </div>
        <div className="asl-pagination-controls">
          <button className="asl-page-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <span key={p} className={`asl-page-num${p === page ? " asl-page-btn asl-page-active" : ""}`} onClick={() => setPage(p)}>{p}</span>
          ))}
          <button className="asl-page-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
        </div>
      </div>
    </div>
  );
}
