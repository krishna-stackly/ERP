import { useState, useEffect, useRef } from "react";
import "./pettyCash.css";

const DUMMY = [
  { id: 1, voucher: "PCV-2025-001", date: "05-Nov-2025", paid_to: "Rajesh K",  dept: "Admin",     desc: "Stationery",           debit: "1,200.00", credit: "1,200.00", status: "Draft" },
  { id: 2, voucher: "PCV-2025-002", date: "06-Nov-2025", paid_to: "Priya S",   dept: "HR",        desc: "Travel reimbursement",  debit: "1,500.00", credit: "1,500.00", status: "Submitted" },
  { id: 3, voucher: "PCV-2025-003", date: "07-Nov-2025", paid_to: "Arjun R",   dept: "Marketing", desc: "Snacks & tea",          debit: "800.00",   credit: "800.00",   status: "Paid" },
  { id: 4, voucher: "PCV-2025-004", date: "08-Nov-2025", paid_to: "Neha T",    dept: "Finance",   desc: "Office maintenance",    debit: "1,000.00", credit: "1,000.00", status: "Ledger Updated" },
  { id: 5, voucher: "PCV-2025-005", date: "09-Nov-2025", paid_to: "Vikram L",  dept: "Admin",     desc: "Printer consumables",   debit: "500.00",   credit: "500.00",   status: "Draft" },
];

const APPROVAL_OPTIONS = ["All", "Draft", "Submitted", "Paid", "Ledger Updated"];
const DEPT_OPTIONS     = ["All", "Sales", "Engineering", "Admin", "Technicians", "HR", "Finance", "Marketing"];
const REPORT_OPTIONS   = ["Petty Cash Register", "Daily / Monthly Summary", "Department-wise Expense Report", "Expense Category-wise Analysis", "Cash Balance Report"];

function statusClass(s) {
  switch (s) {
    case "Draft":          return "pc-badge pc-badge-draft";
    case "Submitted":      return "pc-badge pc-badge-submitted";
    case "Paid":           return "pc-badge pc-badge-paid";
    case "Ledger Updated": return "pc-badge pc-badge-ledgerupdated";
    case "Approved":       return "pc-badge pc-badge-approved";
    case "Rejected":       return "pc-badge pc-badge-rejected";
    default:               return "pc-badge";
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
    <div className="pc-input-box" ref={ref}>
      <label>{label}</label>
      <div className={`pc-dropdown-trigger${open ? " open" : ""}`} onClick={() => setOpen((o) => !o)}>
        <span>{value}</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
          <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9S301 192 288 192L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/>
        </svg>
      </div>
      {open && (
        <div className="pc-dropdown-panel">
          {options.map((o) => (
            <div key={o} className={`pc-dropdown-option${value === o ? " pc-selected" : ""}`}
              onClick={() => { onChange(o); setOpen(false); }}>
              {o}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PettyCash({ setCurrentPage }) {
  const [search,   setSearch]   = useState("");
  const [approval, setApproval] = useState("All");
  const [dept,     setDept]     = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate,   setToDate]   = useState("");
  const [report,   setReport]   = useState("Petty Cash Register");
  const [page,     setPage]     = useState(1);
  const perPage = 10;

  const filtered = DUMMY.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.voucher.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q) || r.paid_to.toLowerCase().includes(q);
    const matchApproval = approval === "All" || r.status === approval;
    const matchDept     = dept === "All"     || r.dept === dept;
    return matchSearch && matchApproval && matchDept;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const current    = filtered.slice((page - 1) * perPage, page * perPage);

  const handleClear = () => { setSearch(""); setApproval("All"); setDept("All"); setFromDate(""); setToDate(""); setPage(1); };

  return (
    <div className="pc-container">
      {/* Header */}
      <div className="pc-header">
        <p>Petty Cash Register</p>
        <button onClick={() => setCurrentPage("pettyCashForm", null)}>+ New Voucher</button>
      </div>

      {/* Search */}
      <div className="pc-search-box">
        <label>
          <svg className="pc-search-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
          </svg>
        </label>
        <input placeholder="Search by Voucher No, Ledger, or Description, etc..." value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
      </div>

      {/* Clear filter */}
      <div className="pc-clearfilter"><p onClick={handleClear}>Clear Filters</p></div>

      {/* Filters */}
      <div className="pc-filter-row">
        <FilterDropdown label="Approval Status" value={approval} options={APPROVAL_OPTIONS} onChange={(v) => { setApproval(v); setPage(1); }} />
        <FilterDropdown label="Department"      value={dept}     options={DEPT_OPTIONS}     onChange={(v) => { setDept(v);     setPage(1); }} />

        <div className="pc-period-box">
          <label>Voucher Date</label>
          <div className="pc-period-inputs">
            <div>
              <span>From</span>
              <input type="date" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setPage(1); }} />
            </div>
            <div>
              <span>to</span>
              <input type="date" value={toDate} onChange={(e) => { setToDate(e.target.value); setPage(1); }} />
            </div>
          </div>
        </div>
      </div>

      {/* Generate Report */}
      <div className="pc-generate-row">
        <label>Generate Report</label>
        <select className="pc-report-select" value={report} onChange={(e) => setReport(e.target.value)}>
          {REPORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
        </select>
        <button className="pc-generate-btn">Generate</button>
      </div>

      {/* Table */}
      <div className="pc-table-container">
        <table>
          <thead>
            <tr>
              <th><input type="checkbox" className="pc-check" /></th>
              <th>Voucher No</th>
              <th>Date</th>
              <th>Paid To</th>
              <th>Department</th>
              <th>Description</th>
              <th>Debit (₹)</th>
              <th>Credit (₹)</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {current.length > 0 ? current.map((row) => (
              <tr key={row.id}>
                <td><input type="checkbox" className="pc-check" /></td>
                <td className="pc-id-cell">{row.voucher}</td>
                <td>{row.date}</td>
                <td>{row.paid_to}</td>
                <td>{row.dept}</td>
                <td>{row.desc}</td>
                <td>{row.debit}</td>
                <td>{row.credit}</td>
                <td><span className={statusClass(row.status)}>{row.status}</span></td>
                <td id="pc-action-cell">
                  <nav className="pc-dot-container">
                    <button onClick={() => setCurrentPage("pettyCashForm", row)}>Edit</button>
                    <button onClick={() => setCurrentPage("pettyCashForm", row)}>View</button>
                    <button disabled={row.status !== "Draft"} style={{ color: row.status === "Draft" ? "rgba(255,77,79,1)" : "rgba(176,176,176,1)" }}>Delete</button>
                  </nav>
                  <svg className="pc-dots-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 16C12.5304 16 13.0391 16.2107 13.4142 16.5858C13.7893 16.9609 14 17.4696 14 18C14 18.5304 13.7893 19.0391 13.4142 19.4142C13.0391 19.7893 12.5304 20 12 20C11.4696 20 10.9609 19.7893 10.5858 19.4142C10.2107 19.0391 10 18.5304 10 18C10 17.4696 10.2107 16.9609 10.5858 16.5858C10.9609 16.2107 11.4696 16 12 16ZM12 10C12.5304 10 13.0391 10.2107 13.4142 10.5858C13.7893 10.9609 14 11.4696 14 12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14C11.4696 14 10.9609 13.7893 10.5858 13.4142C10.2107 13.0391 10 12.5304 10 12C10 11.4696 10.2107 10.9609 10.5858 10.5858C10.9609 10.2107 11.4696 10 12 10ZM12 4C12.5304 4 13.0391 4.21071 13.4142 4.58579C13.7893 4.96086 14 5.46957 14 6C14 6.53043 13.7893 7.03914 13.4142 7.41421C13.0391 7.78929 12.5304 8 12 8C11.4696 8 10.9609 7.78929 10.5858 7.41421C10.2107 7.03914 10 6.53043 10 6C10 5.46957 10.2107 4.96086 10.5858 4.58579C10.9609 4.21071 11.4696 4 12 4Z"/>
                  </svg>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={10} style={{ textAlign: "center", padding: 30, color: "rgba(176,176,176,1)" }}>No records found</td></tr>
            )}
          </tbody>
          {current.length > 0 && (
            <tfoot>
              <tr>
                <td></td><td>Totals</td><td>—</td><td>—</td><td>—</td><td>—</td>
                <td>5,000.00</td><td>5,000.00</td><td>Balanced</td><td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Pagination */}
      <div className="pc-table-bottom">
        <div className="pc-entries-info">
          Showing entries
          <select value={perPage} readOnly><option>{filtered.length}</option></select>
        </div>
        <div className="pc-pagination-controls">
          <button className="pc-page-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <span key={p} className={`pc-page-num${p === page ? " pc-page-btn pc-page-active" : ""}`} onClick={() => setPage(p)}>{p}</span>
          ))}
          <button className="pc-page-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
        </div>
      </div>
    </div>
  );
}
