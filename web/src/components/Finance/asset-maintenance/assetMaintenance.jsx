import { useState, useEffect, useRef } from "react";
import "./assetMaintenance.css";

const DUMMY = [
  { id: 1, maintenance_no: "AMR-2025-001", asset_id: "AST-001", asset_name: "Generator Unit A", type: "Electrical", dept: "Admin", scheduled_date: "10-Jan-2025", next_due: "10-Apr-2025", technician: "Ramesh K", cost: "5,200.00", status: "Completed" },
  { id: 2, maintenance_no: "AMR-2025-002", asset_id: "AST-004", asset_name: "HVAC System",      type: "Mechanical", dept: "Facilities", scheduled_date: "15-Jan-2025", next_due: "15-Jul-2025", technician: "Priya S", cost: "3,800.00", status: "Scheduled" },
  { id: 3, maintenance_no: "AMR-2025-003", asset_id: "AST-007", asset_name: "Compressor #2",    type: "Mechanical", dept: "Production", scheduled_date: "20-Jan-2025", next_due: "20-Apr-2025", technician: "Arjun R", cost: "7,500.00", status: "In Progress" },
  { id: 4, maintenance_no: "AMR-2025-004", asset_id: "AST-012", asset_name: "Server Rack B",    type: "IT / Network", dept: "IT", scheduled_date: "05-Feb-2025", next_due: "05-May-2025", technician: "Neha T", cost: "1,200.00", status: "Overdue" },
  { id: 5, maintenance_no: "AMR-2025-005", asset_id: "AST-015", asset_name: "Fork Lift #1",     type: "Vehicle", dept: "Warehouse", scheduled_date: "12-Feb-2025", next_due: "12-Aug-2025", technician: "Vikram L", cost: "9,000.00", status: "Draft" },
];

const STATUS_OPTIONS = ["All", "Draft", "Scheduled", "In Progress", "Completed", "Overdue"];
const TYPE_OPTIONS   = ["All", "Electrical", "Mechanical", "Civil", "IT / Network", "Vehicle", "HVAC"];
const DEPT_OPTIONS   = ["All", "Admin", "Facilities", "Production", "IT", "Warehouse", "Finance", "HR"];
const REPORT_OPTIONS = ["Asset Maintenance Register", "Maintenance Cost Summary", "Department-wise Report", "Overdue Assets Report", "Scheduled Maintenance Calendar"];

function statusClass(s) {
  switch (s) {
    case "Draft":       return "am-badge am-badge-draft";
    case "Scheduled":   return "am-badge am-badge-scheduled";
    case "In Progress": return "am-badge am-badge-inprogress";
    case "Completed":   return "am-badge am-badge-completed";
    case "Overdue":     return "am-badge am-badge-overdue";
    default:            return "am-badge";
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
    <div className="am-input-box" ref={ref}>
      <label>{label}</label>
      <div className={`am-dropdown-trigger${open ? " open" : ""}`} onClick={() => setOpen((o) => !o)}>
        <span>{value}</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
          <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9S301 192 288 192L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/>
        </svg>
      </div>
      {open && (
        <div className="am-dropdown-panel">
          {options.map((o) => (
            <div key={o} className={`am-dropdown-option${value === o ? " am-selected" : ""}`}
              onClick={() => { onChange(o); setOpen(false); }}>
              {o}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AssetMaintenance({ setCurrentPage }) {
  const [search,   setSearch]   = useState("");
  const [status,   setStatus]   = useState("All");
  const [type,     setType]     = useState("All");
  const [dept,     setDept]     = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate,   setToDate]   = useState("");
  const [report,   setReport]   = useState("Asset Maintenance Register");
  const [page,     setPage]     = useState(1);
  const perPage = 10;

  const filtered = DUMMY.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.maintenance_no.toLowerCase().includes(q) || r.asset_name.toLowerCase().includes(q) || r.asset_id.toLowerCase().includes(q);
    const matchStatus = status === "All" || r.status === status;
    const matchType   = type   === "All" || r.type   === type;
    const matchDept   = dept   === "All" || r.dept   === dept;
    return matchSearch && matchStatus && matchType && matchDept;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const current    = filtered.slice((page - 1) * perPage, page * perPage);

  const handleClear = () => { setSearch(""); setStatus("All"); setType("All"); setDept("All"); setFromDate(""); setToDate(""); setPage(1); };

  return (
    <div className="am-container">
      {/* Header */}
      <div className="am-header">
        <p>Asset Maintenance Register</p>
        <button onClick={() => setCurrentPage("assetMaintenanceForm", null)}>+ New Maintenance</button>
      </div>

      {/* Search */}
      <div className="am-search-box">
        <label>
          <svg className="am-search-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
          </svg>
        </label>
        <input placeholder="Search by Maintenance No, Asset ID or Name..." value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
      </div>

      {/* Clear Filters */}
      <div className="am-clearfilter"><p onClick={handleClear}>Clear Filters</p></div>

      {/* Filters */}
      <div className="am-filter-row">
        <FilterDropdown label="Status"      value={status} options={STATUS_OPTIONS} onChange={(v) => { setStatus(v); setPage(1); }} />
        <FilterDropdown label="Asset Type"  value={type}   options={TYPE_OPTIONS}   onChange={(v) => { setType(v);   setPage(1); }} />
        <FilterDropdown label="Department"  value={dept}   options={DEPT_OPTIONS}   onChange={(v) => { setDept(v);   setPage(1); }} />

        <div className="am-period-box">
          <label>Scheduled Date</label>
          <div className="am-period-inputs">
            <div>
              <span>From</span>
              <input type="date" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setPage(1); }} />
            </div>
            <div>
              <span>to</span>
              <input type="date" value={toDate}   onChange={(e) => { setToDate(e.target.value); setPage(1); }} />
            </div>
          </div>
        </div>
      </div>

      {/* Generate Report */}
      <div className="am-generate-row">
        <label>Generate Report</label>
        <select className="am-report-select" value={report} onChange={(e) => setReport(e.target.value)}>
          {REPORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
        </select>
        <button className="am-generate-btn">Generate</button>
      </div>

      {/* Table */}
      <div className="am-table-container">
        <table>
          <thead>
            <tr>
              <th><input type="checkbox" className="am-check" /></th>
              <th>Maintenance No</th>
              <th>Asset ID</th>
              <th>Asset Name</th>
              <th>Type</th>
              <th>Department</th>
              <th>Scheduled Date</th>
              <th>Next Due</th>
              <th>Technician</th>
              <th>Cost (₹)</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {current.length > 0 ? current.map((row) => (
              <tr key={row.id}>
                <td><input type="checkbox" className="am-check" /></td>
                <td className="am-id-cell">{row.maintenance_no}</td>
                <td>{row.asset_id}</td>
                <td>{row.asset_name}</td>
                <td>{row.type}</td>
                <td>{row.dept}</td>
                <td>{row.scheduled_date}</td>
                <td>{row.next_due}</td>
                <td>{row.technician}</td>
                <td>{row.cost}</td>
                <td><span className={statusClass(row.status)}>{row.status}</span></td>
                <td id="am-action-cell">
                  <nav className="am-dot-container">
                    <button onClick={() => setCurrentPage("assetMaintenanceForm", row)}>Edit</button>
                    <button onClick={() => setCurrentPage("assetMaintenanceForm", row)}>View</button>
                    <button disabled={row.status !== "Draft"} style={{ color: row.status === "Draft" ? "rgba(255,77,79,1)" : "rgba(176,176,176,1)" }}>Delete</button>
                  </nav>
                  <svg className="am-dots-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 16C12.5304 16 13.0391 16.2107 13.4142 16.5858C13.7893 16.9609 14 17.4696 14 18C14 18.5304 13.7893 19.0391 13.4142 19.4142C13.0391 19.7893 12.5304 20 12 20C11.4696 20 10.9609 19.7893 10.5858 19.4142C10.2107 19.0391 10 18.5304 10 18C10 17.4696 10.2107 16.9609 10.5858 16.5858C10.9609 16.2107 11.4696 16 12 16ZM12 10C12.5304 10 13.0391 10.2107 13.4142 10.5858C13.7893 10.9609 14 11.4696 14 12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14C11.4696 14 10.9609 13.7893 10.5858 13.4142C10.2107 13.0391 10 12.5304 10 12C10 11.4696 10.2107 10.9609 10.5858 10.5858C10.9609 10.2107 11.4696 10 12 10ZM12 4C12.5304 4 13.0391 4.21071 13.4142 4.58579C13.7893 4.96086 14 5.46957 14 6C14 6.53043 13.7893 7.03914 13.4142 7.41421C13.0391 7.78929 12.5304 8 12 8C11.4696 8 10.9609 7.78929 10.5858 7.41421C10.2107 7.03914 10 6.53043 10 6C10 5.46957 10.2107 4.96086 10.5858 4.58579C10.9609 4.21071 11.4696 4 12 4Z"/>
                  </svg>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={12} style={{ textAlign: "center", padding: 30, color: "rgba(176,176,176,1)" }}>No records found</td></tr>
            )}
          </tbody>
          {current.length > 0 && (
            <tfoot>
              <tr>
                <td></td><td>Totals</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td>
                <td>26,700.00</td><td>—</td><td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Pagination */}
      <div className="am-table-bottom">
        <div className="am-entries-info">
          Showing entries
          <select value={perPage} readOnly><option>{filtered.length}</option></select>
        </div>
        <div className="am-pagination-controls">
          <button className="am-page-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <span key={p} className={`am-page-num${p === page ? " am-page-btn am-page-active" : ""}`} onClick={() => setPage(p)}>{p}</span>
          ))}
          <button className="am-page-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
        </div>
      </div>
    </div>
  );
}
