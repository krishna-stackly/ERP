import { useState, useEffect, useRef } from "react";
import "./addPettyCash.css";
import PettyCashComment    from "./pettyCashComment";
import PettyCashHistory    from "./pettyCashHistory";
import PettyCashAttachment from "./pettyCashAttachment";

/* ─── Searchable dropdown ─── */
function SearchDropdown({ label, value, onChange, options, placeholder, disabled, required }) {
  const [open, setOpen]   = useState(false);
  const [q, setQ]         = useState("");
  const ref               = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = options.filter((o) => o.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="apc-field" ref={ref}>
      {label && <label>{label}{required && <sup>*</sup>}</label>}
      <div className="apc-dropdown-wrap">
        <div className={`apc-dropdown-trigger${open ? " open" : ""}${disabled ? " disabled" : ""}`}
          onClick={() => !disabled && setOpen((o) => !o)}>
          <span className={value ? "val" : "ph"}>{value || placeholder}</span>
          <svg className="apc-dd-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
            <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9S301 192 288 192L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/>
          </svg>
        </div>
        {open && (
          <div className="apc-dropdown-panel">
            <div className="apc-dd-search">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
              </svg>
              <input placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} autoFocus />
            </div>
            <div className="apc-dd-options">
              {filtered.length > 0 ? filtered.map((opt) => (
                <div key={opt} className={`apc-dd-option${opt === "+ Custom" ? " apc-custom" : ""}${value === opt ? " apc-selected" : ""}`}
                  onClick={() => { onChange(opt === "+ Custom" ? "" : opt); setOpen(false); setQ(""); }}>
                  {opt}
                </div>
              )) : <div className="apc-dd-option" style={{ color: "#98a2b3" }}>No results</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Status → button visibility ─── */
const BTN = {
  "":          { draft: true,  submit: true,  approve: false, sendback: false, paid: false },
  Draft:       { draft: true,  submit: true,  approve: false, sendback: false, paid: false },
  Submitted:   { draft: false, submit: false, approve: true,  sendback: true,  paid: false },
  Approved:    { draft: false, submit: false, approve: false, sendback: true,  paid: true  },
  Rejected:    { draft: true,  submit: true,  approve: false, sendback: false, paid: false },
  Paid:        { draft: false, submit: false, approve: false, sendback: false, paid: false },
  "Ledger Updated": { draft: false, submit: false, approve: false, sendback: false, paid: false },
};

const EMPLOYEE_OPTIONS   = ["+ Custom", "EMP-00123 — John Doe", "EMP-00124 — Priya S", "EMP-00125 — Arjun R", "EMP-00126 — Neha T"];
const EXPENSE_OPTIONS    = ["+ Custom", "Travel", "Employee Reimbursement", "Project Expense", "Asset Purchase", "Telephone / Internet Bills"];
const DEPT_OPTIONS       = ["+ Custom", "IT / PRJ-001", "Production / CBE-02", "Finance / PKU-002", "Admin / CEN-01", "Marketing / MKT-005"];
const PAYMENT_OPTIONS    = ["+ Custom", "Cash", "Cheque", "Bank Transfer / NEFT / RTGS", "Demand Draft (DD)"];

const DUMMY_LINES = [
  { id: 1, voucher: "PCV-2025-001", type: "Travel",     desc: "Taxi fare from airport", date: "05-Nov-2025", amount: "1250.00", dept: "Finance", remarks: "Airport pickup" },
  { id: 2, voucher: "PCV-2025-008", type: "Meals",      desc: "Lunch with client",      date: "05-Nov-2025", amount: "600.00",  dept: "Finance", remarks: "Client meeting" },
  { id: 3, voucher: "PCV-2025-002", type: "Stationery", desc: "Office supplies",        date: "04-Nov-2025", amount: "450.00",  dept: "Finance", remarks: "Pens, notebooks" },
];

export default function AddPettyCash({ setCurrentPage, editData = {}, isEdit = false }) {
  const [status,    setStatus]    = useState("");
  const [recordId,  setRecordId]  = useState(null);
  const [saving,    setSaving]    = useState(false);
  const [activeTab, setActiveTab] = useState("Comments");
  const [lines,     setLines]     = useState(DUMMY_LINES);

  const [form, setForm] = useState({
    voucher_no: "", transaction_id: "", expense_date: "",
    employee_id: "", requested_by: "", sales_order_no: "", expense_type: "",
    description: "", amount: "", department: "",
    payment_mode: "", approved_by: "", reimbursement_date: "",
  });

  useEffect(() => {
    if (isEdit && Object.keys(editData).length > 0) {
      const raw = editData._raw || editData;
      setRecordId(editData.id || raw.id || null);
      setStatus(editData.status || raw.status || "");
      setForm((p) => ({
        ...p,
        voucher_no:    editData.voucher || raw.voucher_no        || "",
        expense_date:  raw.expense_date                          || "",
        description:   editData.desc   || raw.description        || "",
        amount:        raw.amount                                || "",
        department:    editData.dept   || raw.department         || "",
      }));
    }
  }, [isEdit]);

  const btn      = BTN[status] || BTN[""];
  const isLocked = ["Submitted", "Approved", "Paid", "Ledger Updated"].includes(status);
  const delay    = () => new Promise((r) => setTimeout(r, 400));

  const f = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSaveDraft = async (e) => { e.preventDefault(); setSaving(true); try { await delay(); setStatus("Draft"); } finally { setSaving(false); } };
  const handleSubmit    = async (e) => { e.preventDefault(); setSaving(true); try { await delay(); setStatus("Submitted"); } finally { setSaving(false); } };
  const handleApprove   = async (e) => { e.preventDefault(); setSaving(true); try { await delay(); setStatus("Approved"); } finally { setSaving(false); } };
  const handleSendBack  = async (e) => { e.preventDefault(); setSaving(true); try { await delay(); setStatus("Draft"); } finally { setSaving(false); } };
  const handleMarkPaid  = async (e) => { e.preventDefault(); setSaving(true); try { await delay(); setStatus("Paid"); } finally { setSaving(false); } };
  const handleClose     = (e) => { e.preventDefault(); setCurrentPage("pettyCash"); };

  const deleteLine = (id) => setLines((p) => p.filter((l) => l.id !== id));
  const addLine    = () => setLines((p) => [...p, { id: Date.now(), voucher: "", type: "", desc: "", date: "", amount: "", dept: "", remarks: "" }]);

  const statusColor = {
    Draft: "rgba(255,214,56,1)", Submitted: "rgba(140,180,255,1)",
    Approved: "rgba(140,216,188,1)", Paid: "rgba(34,197,94,1)",
    "Ledger Updated": "rgba(6,95,70,1)", Rejected: "rgba(255,77,79,0.3)",
  };
  const statusTextColor = { Paid: "#fff", "Ledger Updated": "#fff" };

  return (
    <div className="apc-container">
      {/* Header */}
      <div className="apc-head">
        <p>New Petty Cash Voucher Entry
          {status && (
            <span style={{ marginLeft: 12, fontSize: 13, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
              background: statusColor[status] || "#eee", color: statusTextColor[status] || "#1a1a2e" }}>
              Status: {status}
            </span>
          )}
        </p>
        <button className="apc-close-btn" onClick={handleClose}>
          <svg className="apc-close-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/>
          </svg>
          <span>Close</span>
        </button>
      </div>

      {/* Voucher & Transaction Info */}
      <p className="apc-section-title">Voucher & Transaction Info</p>
      <div className="apc-grid">
        <div className="apc-field">
          <label>Voucher No.</label>
          <input placeholder="Auto-generate (eg., PCV-2025-001)" value={form.voucher_no} disabled />
        </div>
        <div className="apc-field">
          <label>Transaction ID</label>
          <input placeholder="xxxxxxxxxx" value={form.transaction_id} onChange={f("transaction_id")} disabled={isLocked} />
        </div>
      </div>
      <div className="apc-grid">
        <div className="apc-field">
          <label>Expense Date / Voucher Date<sup>*</sup></label>
          <input type="date" value={form.expense_date} onChange={f("expense_date")} disabled={isLocked} />
        </div>
        <div className="apc-field" />
      </div>

      {/* Employee & Expense Details */}
      <p className="apc-section-title">Employee & Expense Details</p>
      <div className="apc-grid">
        <SearchDropdown label="Employee ID" required value={form.employee_id}
          onChange={(v) => { setForm((p) => ({ ...p, employee_id: v, requested_by: v.includes("—") ? v.split("—")[1].trim() : p.requested_by })); }}
          options={EMPLOYEE_OPTIONS} placeholder="eg., EMP-00123" disabled={isLocked} />
        <div className="apc-field">
          <label>Requested By<sup>*</sup></label>
          <input placeholder="read-only (eg., John Doe)" value={form.requested_by} disabled />
        </div>
      </div>
      <div className="apc-grid">
        <div className="apc-field">
          <label>Sales Order Number</label>
          <input placeholder="e.g., SO-2025-5015" value={form.sales_order_no} onChange={f("sales_order_no")} disabled={isLocked} />
        </div>
        <SearchDropdown label="Expense Type" required value={form.expense_type}
          onChange={(v) => setForm((p) => ({ ...p, expense_type: v }))}
          options={EXPENSE_OPTIONS} placeholder="eg., Travel" disabled={isLocked} />
      </div>
      <div className="apc-grid">
        <div className="apc-field">
          <label>Description / Purpose<sup>*</sup></label>
          <input placeholder="e.g., Taxi fare from airport to hotel" value={form.description} onChange={f("description")} disabled={isLocked} />
        </div>
        <div className="apc-field">
          <label>Amount<sup>*</sup></label>
          <input type="number" placeholder="eg., 1250.00" value={form.amount} onChange={f("amount")} disabled={isLocked} />
        </div>
      </div>
      <div className="apc-grid">
        <SearchDropdown label="Department / Cost Center" required value={form.department}
          onChange={(v) => setForm((p) => ({ ...p, department: v }))}
          options={DEPT_OPTIONS} placeholder="eg., Finance / CC102" disabled={isLocked} />
        <div className="apc-field" />
      </div>

      {/* Payment & Approval */}
      <p className="apc-section-title">Payment & Approval</p>
      <div className="apc-grid">
        <SearchDropdown label="Payment Mode" required value={form.payment_mode}
          onChange={(v) => setForm((p) => ({ ...p, payment_mode: v }))}
          options={PAYMENT_OPTIONS} placeholder="eg., Cash" disabled={isLocked} />
        <div className="apc-field">
          <label>Approved By<sup>*</sup></label>
          <input placeholder="Auto-linked from DBNo (eg., SRM-2035-045)" value={form.approved_by} disabled />
        </div>
      </div>
      <div className="apc-grid">
        <div className="apc-field">
          <label>Status<sup>*</sup></label>
          <input placeholder="Read-only (eg., Draft / Submitted / Approved)" value={status} disabled />
        </div>
        <div className="apc-field">
          <label>Reimbursement Date</label>
          <input type="date" value={form.reimbursement_date} onChange={f("reimbursement_date")} disabled={isLocked} />
        </div>
      </div>

      {/* Line Items */}
      <div className="apc-line-section">
        <p className="apc-section-title">Line Items<sup style={{ color: "red" }}>*</sup></p>
        <div className="apc-line-table-wrap">
          <table className="apc-line-table">
            <thead>
              <tr>
                <th>#</th><th>Voucher No.</th><th>Expense Type</th><th>Description</th>
                <th>Date</th><th>Amount (₹)</th><th>Department</th><th>Remarks</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l, i) => (
                <tr key={l.id}>
                  <td>{i + 1}</td>
                  <td>{l.voucher || <input placeholder="PCV-..." style={{ border: "1px solid #ddd", borderRadius: 6, padding: "4px 8px", fontSize: 13, width: 110 }} />}</td>
                  <td>{l.type    || <input placeholder="Type..."  style={{ border: "1px solid #ddd", borderRadius: 6, padding: "4px 8px", fontSize: 13, width: 90 }} />}</td>
                  <td>{l.desc   || <input placeholder="Desc..."   style={{ border: "1px solid #ddd", borderRadius: 6, padding: "4px 8px", fontSize: 13, width: 130 }} />}</td>
                  <td>{l.date   || <input type="date"             style={{ border: "1px solid #ddd", borderRadius: 6, padding: "4px 8px", fontSize: 13 }} />}</td>
                  <td>{l.amount || <input type="number" placeholder="0.00" style={{ border: "1px solid #ddd", borderRadius: 6, padding: "4px 8px", fontSize: 13, width: 80 }} />}</td>
                  <td>{l.dept   || <input placeholder="Dept..."   style={{ border: "1px solid #ddd", borderRadius: 6, padding: "4px 8px", fontSize: 13, width: 90 }} />}</td>
                  <td>{l.remarks|| <input placeholder="Remarks..."style={{ border: "1px solid #ddd", borderRadius: 6, padding: "4px 8px", fontSize: 13, width: 110 }} />}</td>
                  <td>
                    <button className="apc-delete-btn" onClick={() => deleteLine(l.id)} disabled={isLocked} title="Remove">
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isLocked && (
          <button className="apc-add-item-btn" onClick={addLine}>+ Add Item</button>
        )}
      </div>

      {/* Tabs */}
      <div className="apc-hub-container">
        <div className="apc-hub-head">
          {["Comments", "History", "Attachments"].map((tab) => (
            <p key={tab} className={activeTab === tab ? "apc-tab-active" : ""} onClick={() => setActiveTab(tab)}>{tab}</p>
          ))}
        </div>
        <div className="apc-hub-body">
          {activeTab === "Comments"    && <PettyCashComment    recordId={recordId} apiProvider={null} />}
          {activeTab === "History"     && <PettyCashHistory    recordId={recordId} apiProvider={null} />}
          {activeTab === "Attachments" && <PettyCashAttachment recordId={recordId} apiProvider={null} />}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="apc-btn-container">
        <button className="apc-btn apc-btn-cancel" onClick={handleClose}>Cancel</button>
        <div className="apc-btn-right">
          <button className="apc-btn apc-btn-draft"    onClick={handleSaveDraft} disabled={!btn.draft    || saving}>{saving ? "Saving..." : "Save Draft"}</button>
          <button className="apc-btn apc-btn-submit"   onClick={handleSubmit}    disabled={!btn.submit   || saving}>Submit (PCE)</button>
          <button className="apc-btn apc-btn-approve"  onClick={handleApprove}   disabled={!btn.approve  || saving}>Approve / Reject</button>
          <button className="apc-btn apc-btn-sendback" onClick={handleSendBack}  disabled={!btn.sendback || saving}>Send Back</button>
          <button className="apc-btn apc-btn-paid"     onClick={handleMarkPaid}  disabled={!btn.paid     || saving}>Mark as Paid</button>
          <button className="apc-icon-btn" disabled={!recordId || status === "" || status === "Draft"} title="Download PDF">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M0.600098 2.4C0.600098 1.76348 0.852954 1.15303 1.30304 0.702944C1.75313 0.252856 2.36358 0 3.0001 0L16.1313 0L21.4001 5.2688V21.6C21.4001 22.2365 21.1472 22.847 20.6972 23.2971C20.2471 23.7471 19.6366 24 19.0001 24H3.0001C2.36358 24 1.75313 23.7471 1.30304 23.2971C0.852954 22.847 0.600098 22.2365 0.600098 21.6V2.4ZM4.6001 9.6H2.2001V17.6H3.8001V14.4H4.6001C5.23662 14.4 5.84707 14.1471 6.29715 13.6971C6.74724 13.247 7.0001 12.6365 7.0001 12C7.0001 11.3635 6.74724 10.753 6.29715 10.3029C5.84707 9.85286 5.23662 9.6 4.6001 9.6ZM11.0001 9.6H8.6001V17.6H11.0001C11.6366 17.6 12.2471 17.3471 12.6972 16.8971C13.1472 16.447 13.4001 15.8365 13.4001 15.2V12C13.4001 11.3635 13.1472 10.753 12.6972 10.3029C12.2471 9.85286 11.6366 9.6 11.0001 9.6ZM15.0001 17.6V9.6H19.8001V11.2H16.6001V12.8H18.2001V14.4H16.6001V17.6H15.0001Z"/>
            </svg>
          </button>
          <button className="apc-icon-btn" disabled={!recordId || status === "" || status === "Draft"} title="Send Email">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 16">
              <path d="M2 16C1.45 16 0.979333 15.8043 0.588 15.413C0.196667 15.0217 0.000666667 14.5507 0 14V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196666 1.45067 0.000666667 2 0H18C18.55 0 19.021 0.196 19.413 0.588C19.805 0.98 20.0007 1.45067 20 2V14C20 14.55 19.8043 15.021 19.413 15.413C19.0217 15.805 18.5507 16.0007 18 16H2ZM10 8.825C10.0833 8.825 10.171 8.81233 10.263 8.787C10.355 8.76167 10.4423 8.72433 10.525 8.675L17.6 4.25C17.7333 4.16667 17.8333 4.06267 17.9 3.938C17.9667 3.81333 18 3.67567 18 3.525C18 3.19167 17.8583 2.94167 17.575 2.775C17.2917 2.60833 17 2.61667 16.7 2.8L10 7L3.3 2.8C3 2.61667 2.70833 2.61267 2.425 2.788C2.14167 2.96333 2 3.209 2 3.525C2 3.19167 2.03333 3.83767 2.1 3.963C2.16667 4.08833 2.26667 4.184 2.4 4.25L9.475 8.675C9.55833 8.725 9.646 8.76267 9.738 8.788C9.83 8.81333 9.91733 8.82567 10 8.825Z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
