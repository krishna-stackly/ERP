import { useState } from "react";
import "./trailBalance.css";

const DUMMY_DATA = [
  { id: 1, tb_id: "TB-2026-001", date: "05-02-2026", ledger: "Ledger A", department: "Accounts Dept", prepared_by: "Ramesh Kumar", approved_by: "Suresh",  status: "Approved"  },
  { id: 2, tb_id: "TB-2026-002", date: "06-02-2026", ledger: "Ledger B", department: "Finance Dept",  prepared_by: "Meena",        approved_by: "Kumar",   status: "Submitted" },
  { id: 3, tb_id: "TB-2026-003", date: "06-02-2026", ledger: "Ledger C", department: "Audit Dept",   prepared_by: "Ravi",         approved_by: "—",       status: "Draft"     },
];

function statusClass(status) {
  switch (status) {
    case "Draft":     return "tb-badge tb-badge-draft";
    case "Submitted": return "tb-badge tb-badge-submitted";
    case "Approved":  return "tb-badge tb-badge-approved";
    case "Posted":    return "tb-badge tb-badge-posted";
    case "Cancelled": return "tb-badge tb-badge-cancelled";
    default:          return "tb-badge";
  }
}

export default function TrailBalance({ setCurrentPage }) {
  const [search,   setSearch]   = useState("");
  const [branch,   setBranch]   = useState("");
  const [currency, setCurrency] = useState("");
  const [status,   setStatus]   = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate,   setToDate]   = useState("");
  const [page,     setPage]     = useState(1);
  const perPage = 10;

  const filtered = DUMMY_DATA.filter((row) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      row.tb_id.toLowerCase().includes(q) ||
      row.ledger.toLowerCase().includes(q) ||
      row.department.toLowerCase().includes(q) ||
      row.prepared_by.toLowerCase().includes(q) ||
      row.approved_by.toLowerCase().includes(q);
    const matchStatus   = !status   || row.status === status;
    const matchFrom     = !fromDate || row.date >= fromDate;
    const matchTo       = !toDate   || row.date <= toDate;
    return matchSearch && matchStatus && matchFrom && matchTo;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const current    = filtered.slice((page - 1) * perPage, page * perPage);

  const handleClear = () => {
    setSearch(""); setBranch(""); setCurrency(""); setStatus("");
    setFromDate(""); setToDate(""); setPage(1);
  };

  return (
    <div className="tb-container">
      {/* Header */}
      <div className="tb-header">
        <p>Trial Balance Dashboard</p>
        <button onClick={() => setCurrentPage("trailBalanceForm", null)}>
          + Create Trial Balance
        </button>
      </div>

      {/* Search */}
      <div className="tb-search-box">
        <label htmlFor="tb-search">
          <svg className="tb-search-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
          </svg>
        </label>
        <input
          id="tb-search"
          placeholder="Search by Trial Balance ID / Document ID, Ledger / Account Code, Department / Branch, Prepared By / Approved By, etc..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {/* Clear filter */}
      <div className="tb-clearfilter">
        <p onClick={handleClear}>Clear Filters</p>
      </div>

      {/* Filters */}
      <div className="tb-filter-row">
        <div className="tb-input-box">
          <label>Branch / Company</label>
          <select value={branch} onChange={(e) => { setBranch(e.target.value); setPage(1); }}>
            <option value="">All</option>
            <option value="Head Office - Chennai">Head Office - Chennai</option>
            <option value="Branch - Coimbatore">Branch - Coimbatore</option>
            <option value="Branch - Madurai">Branch - Madurai</option>
            <option value="Branch - Salem">Branch - Salem</option>
            <option value="Branch - Bangalore">Branch - Bangalore</option>
          </select>
        </div>

        <div className="tb-input-box">
          <label>Currency</label>
          <select value={currency} onChange={(e) => { setCurrency(e.target.value); setPage(1); }}>
            <option value="">All</option>
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="JPY">JPY</option>
          </select>
        </div>

        <div className="tb-input-box">
          <label>Status</label>
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            <option value="">All</option>
            <option value="Draft">Draft</option>
            <option value="Submitted">Submitted</option>
            <option value="Approved">Approved</option>
            <option value="Posted">Posted</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="tb-input-box">
          <label>Period</label>
          <nav>
            <div>
              <span>From </span>
              <input
                className="tb-date"
                type="date"
                value={fromDate}
                onChange={(e) => { setFromDate(e.target.value); setPage(1); }}
              />
            </div>
            <div>
              <span>to </span>
              <input
                className="tb-date"
                type="date"
                value={toDate}
                onChange={(e) => { setToDate(e.target.value); setPage(1); }}
              />
            </div>
          </nav>
        </div>
      </div>

      {/* Table */}
      <div className="tb-table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Trial Balance ID</th>
              <th>Date</th>
              <th>Ledger / Account</th>
              <th>Department</th>
              <th>Prepared By</th>
              <th>Approved By</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {current.length > 0 ? (
              current.map((row, idx) => (
                <tr key={row.id}>
                  <td>{(page - 1) * perPage + idx + 1}</td>
                  <td className="tb-id-cell">{row.tb_id}</td>
                  <td>{row.date}</td>
                  <td>{row.ledger}</td>
                  <td>{row.department}</td>
                  <td>{row.prepared_by}</td>
                  <td>{row.approved_by}</td>
                  <td>
                    <span className={statusClass(row.status)}>{row.status}</span>
                  </td>
                  <td id="tb-action-cell">
                    <nav className="tb-dot-container">
                      <button onClick={() => setCurrentPage("trailBalanceForm", row)}>
                        Edit
                      </button>
                      <button onClick={() => setCurrentPage("trailBalanceForm", row)}>
                        View
                      </button>
                      <button
                        className="tb-btn-danger"
                        disabled={row.status === "Posted" || row.status === "Cancelled"}
                      >
                        Cancel
                      </button>
                    </nav>
                    <svg
                      className="tb-dots-svg"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 16C12.5304 16 13.0391 16.2107 13.4142 16.5858C13.7893 16.9609 14 17.4696 14 18C14 18.5304 13.7893 19.0391 13.4142 19.4142C13.0391 19.7893 12.5304 20 12 20C11.4696 20 10.9609 19.7893 10.5858 19.4142C10.2107 19.0391 10 18.5304 10 18C10 17.4696 10.2107 16.9609 10.5858 16.5858C10.9609 16.2107 11.4696 16 12 16ZM12 10C12.5304 10 13.0391 10.2107 13.4142 10.5858C13.7893 10.9609 14 11.4696 14 12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14C11.4696 14 10.9609 13.7893 10.5858 13.4142C10.2107 13.0391 10 12.5304 10 12C10 11.4696 10.2107 10.9609 10.5858 10.5858C10.9609 10.2107 11.4696 10 12 10ZM12 4C12.5304 4 13.0391 4.21071 13.4142 4.58579C13.7893 4.96086 14 5.46957 14 6C14 6.53043 13.7893 7.03914 13.4142 7.41421C13.0391 7.78929 12.5304 8 12 8C11.4696 8 10.9609 7.78929 10.5858 7.41421C10.2107 7.03914 10 6.53043 10 6C10 5.46957 10.2107 4.96086 10.5858 4.58579C10.9609 4.21071 11.4696 4 12 4Z"/>
                    </svg>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} style={{ textAlign: "center", padding: "30px", color: "rgba(176,176,176,1)" }}>
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="tb-table-bottom">
        <div className="tb-entries-info">
          Showing {current.length} entries
        </div>
        <div className="tb-pagination-controls">
          <button className="tb-page-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <span
              key={p}
              className={`tb-page-num ${p === page ? "tb-page-btn tb-page-active" : ""}`}
              onClick={() => setPage(p)}
              style={{ cursor: "pointer" }}
            >
              {p}
            </span>
          ))}
          <button className="tb-page-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
