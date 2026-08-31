import { useState } from "react";
import "./formReceivable.css";

const DUMMY = [
  { id: 1, fr_id: "FR-2025-001", date: "05-Nov-2025", due_date: "05-Dec-2025", customer: "Arjun Enterprises",  ref_invoice: "INV-2025-041", amount: "45,000.00",   received: "45,000.00",   outstanding: "0.00",      status: "Posted"    },
  { id: 2, fr_id: "FR-2025-002", date: "06-Nov-2025", due_date: "06-Dec-2025", customer: "Priya Traders",      ref_invoice: "INV-2025-042", amount: "22,500.00",   received: "10,000.00",   outstanding: "12,500.00", status: "Submitted" },
  { id: 3, fr_id: "FR-2025-003", date: "07-Nov-2025", due_date: "07-Dec-2025", customer: "Neha Industries",    ref_invoice: "INV-2025-043", amount: "78,000.00",   received: "0.00",        outstanding: "78,000.00", status: "Draft"     },
  { id: 4, fr_id: "FR-2025-004", date: "08-Nov-2025", due_date: "08-Dec-2025", customer: "Vikram Solutions",   ref_invoice: "INV-2025-044", amount: "1,20,000.00", received: "1,20,000.00", outstanding: "0.00",      status: "Approved"  },
  { id: 5, fr_id: "FR-2025-005", date: "09-Nov-2025", due_date: "09-Oct-2025", customer: "Rajesh & Co",        ref_invoice: "INV-2025-045", amount: "33,000.00",   received: "0.00",        outstanding: "33,000.00", status: "Overdue"   },
];

function statusClass(s) {
  switch (s) {
    case "Draft":     return "fr-badge fr-badge-draft";
    case "Submitted": return "fr-badge fr-badge-submitted";
    case "Approved":  return "fr-badge fr-badge-approved";
    case "Posted":    return "fr-badge fr-badge-posted";
    case "Overdue":   return "fr-badge fr-badge-overdue";
    case "Cancelled": return "fr-badge fr-badge-cancelled";
    default:          return "fr-badge";
  }
}

export default function FormReceivable({ setCurrentPage }) {
  const [search,   setSearch]   = useState("");
  const [status,   setStatus]   = useState("");
  const [customer, setCustomer] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate,   setToDate]   = useState("");
  const [page,     setPage]     = useState(1);
  const perPage = 10;

  const filtered = DUMMY.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch   = !q || r.fr_id.toLowerCase().includes(q) || r.customer.toLowerCase().includes(q) || r.ref_invoice.toLowerCase().includes(q);
    const matchStatus   = !status   || r.status   === status;
    const matchCustomer = !customer || r.customer === customer;
    return matchSearch && matchStatus && matchCustomer;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const current    = filtered.slice((page - 1) * perPage, page * perPage);

  const handleClear = () => { setSearch(""); setStatus(""); setCustomer(""); setFromDate(""); setToDate(""); setPage(1); };

  return (
    <div className="fr-container">
      {/* Header */}
      <div className="fr-header">
        <p>Form Receivable</p>
        <button onClick={() => setCurrentPage("formReceivableForm", null)}>+ New Form Receivable</button>
      </div>

      {/* Search */}
      <div className="fr-search-box">
        <label htmlFor="fr-search">
          <svg className="fr-search-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
          </svg>
        </label>
        <input
          id="fr-search"
          placeholder="Search by Form Receivable ID, Customer, Reference Invoice, etc..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {/* Clear filter */}
      <div className="fr-clearfilter">
        <p onClick={handleClear}>Clear Filters</p>
      </div>

      {/* Filters */}
      <div className="fr-filter-row">
        <div className="fr-input-box">
          <label>Status</label>
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            <option value="">All</option>
            <option value="Draft">Draft</option>
            <option value="Submitted">Submitted</option>
            <option value="Approved">Approved</option>
            <option value="Posted">Posted</option>
            <option value="Overdue">Overdue</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="fr-input-box">
          <label>Customer</label>
          <select value={customer} onChange={(e) => { setCustomer(e.target.value); setPage(1); }}>
            <option value="">All</option>
            <option value="Arjun Enterprises">Arjun Enterprises</option>
            <option value="Priya Traders">Priya Traders</option>
            <option value="Neha Industries">Neha Industries</option>
            <option value="Vikram Solutions">Vikram Solutions</option>
            <option value="Rajesh & Co">Rajesh &amp; Co</option>
          </select>
        </div>

        <div className="fr-input-box">
          <label>Period</label>
          <nav>
            <div>
              <span>From </span>
              <input
                className="fr-date"
                type="date"
                value={fromDate}
                onChange={(e) => { setFromDate(e.target.value); setPage(1); }}
              />
            </div>
            <div>
              <span>to </span>
              <input
                className="fr-date"
                type="date"
                value={toDate}
                onChange={(e) => { setToDate(e.target.value); setPage(1); }}
              />
            </div>
          </nav>
        </div>
      </div>

      {/* Table */}
      <div className="fr-table-container">
        <table>
          <thead>
            <tr>
              <th><input type="checkbox" className="fr-check" /></th>
              <th>Form Receivable ID</th>
              <th>Date</th>
              <th>Due Date</th>
              <th>Customer</th>
              <th>Ref. Invoice</th>
              <th>Total Amount (₹)</th>
              <th>Amount Received (₹)</th>
              <th>Outstanding (₹)</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {current.length > 0 ? current.map((row) => (
              <tr key={row.id}>
                <td><input type="checkbox" className="fr-check" /></td>
                <td className="fr-id-cell" onClick={() => setCurrentPage("formReceivableForm", row)}>{row.fr_id}</td>
                <td>{row.date}</td>
                <td>{row.due_date}</td>
                <td>{row.customer}</td>
                <td>{row.ref_invoice}</td>
                <td>{row.amount}</td>
                <td>{row.received}</td>
                <td className={row.outstanding !== "0.00" ? "fr-outstanding-cell" : ""}>{row.outstanding}</td>
                <td><span className={statusClass(row.status)}>{row.status}</span></td>
                <td id="fr-action-cell">
                  <nav className="fr-dot-container">
                    <button onClick={() => setCurrentPage("formReceivableForm", row)}>Edit</button>
                    <button onClick={() => setCurrentPage("formReceivableForm", row)}>View</button>
                    <button
                      className="fr-btn-danger"
                      disabled={row.status === "Posted" || row.status === "Cancelled"}
                    >
                      Cancel
                    </button>
                  </nav>
                  <svg className="fr-dots-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 16C12.5304 16 13.0391 16.2107 13.4142 16.5858C13.7893 16.9609 14 17.4696 14 18C14 18.5304 13.7893 19.0391 13.4142 19.4142C13.0391 19.7893 12.5304 20 12 20C11.4696 20 10.9609 19.7893 10.5858 19.4142C10.2107 19.0391 10 18.5304 10 18C10 17.4696 10.2107 16.9609 10.5858 16.5858C10.9609 16.2107 11.4696 16 12 16ZM12 10C12.5304 10 13.0391 10.2107 13.4142 10.5858C13.7893 10.9609 14 11.4696 14 12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14C11.4696 14 10.9609 13.7893 10.5858 13.4142C10.2107 13.0391 10 12.5304 10 12C10 11.4696 10.2107 10.9609 10.5858 10.5858C10.9609 10.2107 11.4696 10 12 10ZM12 4C12.5304 4 13.0391 4.21071 13.4142 4.58579C13.7893 4.96086 14 5.46957 14 6C14 6.53043 13.7893 7.03914 13.4142 7.41421C13.0391 7.78929 12.5304 8 12 8C11.4696 8 10.9609 7.78929 10.5858 7.41421C10.2107 7.03914 10 6.53043 10 6C10 5.46957 10.2107 4.96086 10.5858 4.58579C10.9609 4.21071 11.4696 4 12 4Z"/>
                  </svg>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={11} style={{ textAlign: "center", padding: "30px", color: "rgba(176,176,176,1)" }}>
                  No records found
                </td>
              </tr>
            )}
          </tbody>
          {current.length > 0 && (
            <tfoot>
              <tr>
                <td></td><td>Totals</td><td>—</td><td>—</td><td>—</td><td>—</td>
                <td>2,98,500.00</td><td>1,75,000.00</td><td>1,23,500.00</td>
                <td></td><td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Pagination */}
      <div className="fr-table-bottom">
        <div className="fr-entries-info">
          Showing {current.length} of {filtered.length} entries
        </div>
        <div className="fr-pagination-controls">
          <button className="fr-page-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>Prev</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <span
              key={p}
              className={`fr-page-num${p === page ? " fr-page-btn fr-page-active" : ""}`}
              onClick={() => setPage(p)}
            >
              {p}
            </span>
          ))}
          <button className="fr-page-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Next</button>
        </div>
      </div>
    </div>
  );
}
