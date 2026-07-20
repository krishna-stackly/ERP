import { useState, useEffect, useRef } from "react";
import "./addFormReceivable.css";
import FormReceivableComment    from "./formReceivableComment";
import FormReceivableHistory    from "./formReceivableHistory";
import FormReceivableAttachment from "./formReceivableAttachment";

/* ─── Searchable dropdown ─── */
function SearchDropdown({ label, value, onChange, options, placeholder, disabled, required }) {
  const [open, setOpen] = useState(false);
  const [q, setQ]       = useState("");
  const ref             = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = options.filter((o) => o.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="afr-field" ref={ref}>
      {label && <label>{label}{required && <sup>*</sup>}</label>}
      <div className="afr-dropdown-wrap">
        <div className={`afr-dropdown-trigger${open ? " open" : ""}${disabled ? " disabled" : ""}`}
          onClick={() => !disabled && setOpen((o) => !o)}>
          <span className={value ? "val" : "ph"}>{value || placeholder}</span>
          <svg className="afr-dd-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
            <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9S301 192 288 192L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/>
          </svg>
        </div>
        {open && (
          <div className="afr-dropdown-panel">
            <div className="afr-dd-search">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
              </svg>
              <input placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} autoFocus />
            </div>
            <div className="afr-dd-options">
              {filtered.length > 0 ? filtered.map((opt) => (
                <div key={opt} className={`afr-dd-option${value === opt ? " afr-selected" : ""}`}
                  onClick={() => { onChange(opt); setOpen(false); setQ(""); }}>
                  {opt}
                </div>
              )) : <div className="afr-dd-option" style={{ color: "#98a2b3" }}>No results</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Status → button visibility ─── */
const BTN = {
  "":        { draft: true,  submit: true,  approve: false, sendback: false, post: false },
  Draft:     { draft: true,  submit: true,  approve: false, sendback: false, post: false },
  Submitted: { draft: false, submit: false, approve: true,  sendback: true,  post: false },
  Approved:  { draft: false, submit: false, approve: false, sendback: true,  post: true  },
  Posted:    { draft: false, submit: false, approve: false, sendback: false, post: false },
  Cancelled: { draft: false, submit: false, approve: false, sendback: false, post: false },
  Overdue:   { draft: false, submit: false, approve: false, sendback: false, post: false },
};

const STATUS_COLOR = {
  Draft:     { bg: "rgba(255,214,56,0.25)",    color: "#92660a" },
  Submitted: { bg: "rgba(140,180,255,0.3)",    color: "#1a4da3" },
  Approved:  { bg: "rgba(140,216,188,0.35)",   color: "#0e6b3f" },
  Posted:    { bg: "rgba(34,197,94,0.25)",     color: "#15803d" },
  Overdue:   { bg: "rgba(255,77,79,0.2)",      color: "#c91c1c" },
  Cancelled: { bg: "rgba(176,176,176,0.25)",   color: "#555"    },
};

const CUSTOMER_OPTIONS   = ["Arjun Enterprises", "Priya Traders", "Neha Industries", "Vikram Solutions", "Rajesh & Co", "Sita Corp", "Kumar & Associates"];
const PAYMENT_TERMS      = ["Immediate", "Net 15", "Net 30", "Net 45", "Net 60", "Net 90"];
const PAYMENT_MODES      = ["Cash", "Cheque", "Bank Transfer / NEFT / RTGS", "UPI", "Demand Draft (DD)"];
const BANK_ACCOUNTS      = ["HDFC Bank — A/c 001234567890", "ICICI Bank — A/c 009876543210", "SBI — A/c 123456789012", "Axis Bank — A/c 567890123456"];
const EXPENSE_CATEGORIES = ["Product Sale", "Service Charges", "Consulting Fees", "Maintenance", "Other"];

const DUMMY_LINES = [
  { id: 1, description: "Software License — Annual", category: "Service Charges", qty: 2,   unit_price: "15,000.00", tax_pct: 18, discount: "0.00",    amount: "35,400.00" },
  { id: 2, description: "Implementation Support",    category: "Consulting Fees", qty: 1,   unit_price: "8,000.00",  tax_pct: 18, discount: "500.00",  amount: "8,940.00"  },
  { id: 3, description: "Hardware Supply",           category: "Product Sale",    qty: 5,   unit_price: "1,200.00",  tax_pct: 12, discount: "0.00",    amount: "6,720.00"  },
];

export default function AddFormReceivable({ setCurrentPage, editData = {}, isEdit = false }) {
  const [status,    setStatus]    = useState("");
  const [recordId,  setRecordId]  = useState(null);
  const [saving,    setSaving]    = useState(false);
  const [activeTab, setActiveTab] = useState("Comments");
  const [lines,     setLines]     = useState(DUMMY_LINES);

  const [form, setForm] = useState({
    fr_id: "", transaction_date: "", due_date: "", payment_terms: "",
    customer_name: "", customer_code: "", contact_no: "", billing_address: "",
    ref_invoice_no: "", ref_invoice_date: "", ref_invoice_amount: "",
    payment_mode: "", bank_account: "", notes: "",
  });

  useEffect(() => {
    if (isEdit && Object.keys(editData).length > 0) {
      const raw = editData._raw || editData;
      setRecordId(editData.id || raw.id || null);
      setStatus(editData.status || raw.status || "");
      setForm((p) => ({
        ...p,
        fr_id:              editData.fr_id        || raw.fr_id            || "",
        transaction_date:   raw.transaction_date  || editData.date        || "",
        due_date:           raw.due_date           || editData.due_date    || "",
        customer_name:      editData.customer      || raw.customer_name    || "",
        ref_invoice_no:     editData.ref_invoice   || raw.ref_invoice_no   || "",
      }));
    }
  }, [isEdit]);

  const btn      = BTN[status] || BTN[""];
  const isLocked = ["Approved", "Posted", "Overdue", "Cancelled"].includes(status);
  const delay    = () => new Promise((r) => setTimeout(r, 400));

  const f = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSaveDraft = async (e) => { e.preventDefault(); setSaving(true); try { await delay(); setStatus("Draft"); } finally { setSaving(false); } };
  const handleSubmit    = async (e) => { e.preventDefault(); setSaving(true); try { await delay(); setStatus("Submitted"); } finally { setSaving(false); } };
  const handleApprove   = async (e) => { e.preventDefault(); setSaving(true); try { await delay(); setStatus("Approved"); } finally { setSaving(false); } };
  const handleSendBack  = async (e) => { e.preventDefault(); setSaving(true); try { await delay(); setStatus("Draft"); } finally { setSaving(false); } };
  const handlePost      = async (e) => { e.preventDefault(); setSaving(true); try { await delay(); setStatus("Posted"); } finally { setSaving(false); } };
  const handleClose     = (e) => { e.preventDefault(); setCurrentPage("formReceivable"); };

  /* Line items */
  const deleteLine = (id) => setLines((p) => p.filter((l) => l.id !== id));
  const addLine    = () => setLines((p) => [...p, { id: Date.now(), description: "", category: "", qty: 1, unit_price: "", tax_pct: 18, discount: "0.00", amount: "" }]);
  const updateLine = (id, key, val) => setLines((p) => p.map((l) => l.id === id ? { ...l, [key]: val } : l));

  /* Summary totals (dummy static for now) */
  const subtotal = "51,060.00";
  const taxTotal = "8,978.40";
  const discountTotal = "500.00";
  const netTotal = "59,538.40";

  const statusStyle = STATUS_COLOR[status] || {};

  return (
    <div className="afr-container">
      {/* Header */}
      <div className="afr-head">
        <p>
          {isEdit && editData?.fr_id ? `Form Receivable — ${editData.fr_id}` : "New Form Receivable"}
          {status && (
            <span className="afr-status-badge" style={{ background: statusStyle.bg, color: statusStyle.color }}>
              {status}
            </span>
          )}
        </p>
        <button className="afr-close-btn" onClick={handleClose}>
          <svg className="afr-close-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/>
          </svg>
          <span>Close</span>
        </button>
      </div>

      {/* ── Section 1: Form Receivable Info ── */}
      <p className="afr-section-title">Form Receivable Info</p>
      <div className="afr-grid">
        <div className="afr-field">
          <label>Form Receivable ID</label>
          <input placeholder="Auto-generate (e.g., FR-2025-001)" value={form.fr_id} disabled />
        </div>
        <div className="afr-field">
          <label>Status</label>
          <input value={status || "Draft (Pending)"} disabled />
        </div>
      </div>
      <div className="afr-grid">
        <div className="afr-field">
          <label>Transaction Date<sup>*</sup></label>
          <input type="date" value={form.transaction_date} onChange={f("transaction_date")} disabled={isLocked} />
        </div>
        <div className="afr-field">
          <label>Due Date<sup>*</sup></label>
          <input type="date" value={form.due_date} onChange={f("due_date")} disabled={isLocked} />
        </div>
      </div>
      <div className="afr-grid">
        <SearchDropdown label="Payment Terms" value={form.payment_terms}
          onChange={(v) => setForm((p) => ({ ...p, payment_terms: v }))}
          options={PAYMENT_TERMS} placeholder="e.g., Net 30" disabled={isLocked} />
        <div className="afr-field" />
      </div>

      {/* ── Section 2: Customer Details ── */}
      <p className="afr-section-title">Customer Details</p>
      <div className="afr-grid">
        <SearchDropdown label="Customer Name" required value={form.customer_name}
          onChange={(v) => setForm((p) => ({ ...p, customer_name: v, customer_code: `CUST-${Math.floor(Math.random() * 9000 + 1000)}` }))}
          options={CUSTOMER_OPTIONS} placeholder="Select Customer" disabled={isLocked} />
        <div className="afr-field">
          <label>Customer Code</label>
          <input placeholder="Auto-linked (e.g., CUST-1001)" value={form.customer_code} disabled />
        </div>
      </div>
      <div className="afr-grid">
        <div className="afr-field">
          <label>Contact No.</label>
          <input placeholder="e.g., +91 98765 43210" value={form.contact_no} onChange={f("contact_no")} disabled={isLocked} />
        </div>
        <div className="afr-field">
          <label>Billing Address</label>
          <input placeholder="e.g., 123 MG Road, Chennai — 600001" value={form.billing_address} onChange={f("billing_address")} disabled={isLocked} />
        </div>
      </div>

      {/* ── Section 3: Reference Invoice ── */}
      <p className="afr-section-title">Reference Invoice Details</p>
      <div className="afr-grid">
        <div className="afr-field">
          <label>Reference Invoice No.<sup>*</sup></label>
          <input placeholder="e.g., INV-2025-041" value={form.ref_invoice_no} onChange={f("ref_invoice_no")} disabled={isLocked} />
        </div>
        <div className="afr-field">
          <label>Invoice Date</label>
          <input type="date" value={form.ref_invoice_date} onChange={f("ref_invoice_date")} disabled={isLocked} />
        </div>
      </div>
      <div className="afr-grid">
        <div className="afr-field">
          <label>Invoice Amount (₹)</label>
          <input type="number" placeholder="e.g., 45000.00" value={form.ref_invoice_amount} onChange={f("ref_invoice_amount")} disabled={isLocked} />
        </div>
        <div className="afr-field" />
      </div>

      {/* ── Section 4: Line Items ── */}
      <div className="afr-line-section">
        <p className="afr-section-title">Line Items<sup style={{ color: "red" }}>*</sup></p>
        <div className="afr-line-table-wrap">
          <table className="afr-line-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Description / Product</th>
                <th>Category</th>
                <th>Qty</th>
                <th>Unit Price (₹)</th>
                <th>Tax %</th>
                <th>Discount (₹)</th>
                <th>Amount (₹)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l, i) => (
                <tr key={l.id}>
                  <td>{i + 1}</td>
                  <td>
                    {l.description
                      ? l.description
                      : <input placeholder="Description..." style={{ border: "1px solid #ddd", borderRadius: 6, padding: "4px 8px", fontSize: 13, width: 160 }}
                          onChange={(e) => updateLine(l.id, "description", e.target.value)} />}
                  </td>
                  <td>
                    {l.category
                      ? l.category
                      : <select style={{ border: "1px solid #ddd", borderRadius: 6, padding: "4px 8px", fontSize: 13 }}
                          onChange={(e) => updateLine(l.id, "category", e.target.value)}>
                          <option value="">Select</option>
                          {EXPENSE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                        </select>}
                  </td>
                  <td>
                    {isLocked ? l.qty
                      : <input type="number" value={l.qty} min="1"
                          onChange={(e) => updateLine(l.id, "qty", e.target.value)}
                          style={{ border: "1px solid #ddd", borderRadius: 6, padding: "4px 8px", fontSize: 13, width: 60 }} />}
                  </td>
                  <td>
                    {isLocked ? l.unit_price
                      : <input placeholder="0.00" value={l.unit_price}
                          onChange={(e) => updateLine(l.id, "unit_price", e.target.value)}
                          style={{ border: "1px solid #ddd", borderRadius: 6, padding: "4px 8px", fontSize: 13, width: 90 }} />}
                  </td>
                  <td>
                    {isLocked ? `${l.tax_pct}%`
                      : <input type="number" value={l.tax_pct} min="0" max="100"
                          onChange={(e) => updateLine(l.id, "tax_pct", e.target.value)}
                          style={{ border: "1px solid #ddd", borderRadius: 6, padding: "4px 8px", fontSize: 13, width: 55 }} />}
                  </td>
                  <td>
                    {isLocked ? l.discount
                      : <input placeholder="0.00" value={l.discount}
                          onChange={(e) => updateLine(l.id, "discount", e.target.value)}
                          style={{ border: "1px solid #ddd", borderRadius: 6, padding: "4px 8px", fontSize: 13, width: 80 }} />}
                  </td>
                  <td className="afr-amount-cell">{l.amount || "—"}</td>
                  <td>
                    <button className="afr-delete-btn" onClick={() => deleteLine(l.id)} disabled={isLocked} title="Remove">✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isLocked && (
          <button className="afr-add-item-btn" onClick={addLine}>+ Add Line Item</button>
        )}
      </div>

      {/* ── Section 5: Payment Summary ── */}
      <div className="afr-summary-section">
        <p className="afr-section-title">Payment Summary</p>
        <div className="afr-summary-grid">
          <div className="afr-summary-left">
            <SearchDropdown label="Payment Mode" required value={form.payment_mode}
              onChange={(v) => setForm((p) => ({ ...p, payment_mode: v }))}
              options={PAYMENT_MODES} placeholder="e.g., Bank Transfer" disabled={isLocked} />
            <SearchDropdown label="Bank / Account" value={form.bank_account}
              onChange={(v) => setForm((p) => ({ ...p, bank_account: v }))}
              options={BANK_ACCOUNTS} placeholder="Select Bank Account" disabled={isLocked} />
            <div className="afr-field">
              <label>Notes / Remarks</label>
              <textarea placeholder="Enter any notes or remarks..." value={form.notes} onChange={f("notes")}
                disabled={isLocked} rows={3} />
            </div>
          </div>
          <div className="afr-summary-right">
            <div className="afr-summary-card">
              <div className="afr-summary-row">
                <span>Sub Total</span>
                <span>₹ {subtotal}</span>
              </div>
              <div className="afr-summary-row">
                <span>Tax Amount</span>
                <span>₹ {taxTotal}</span>
              </div>
              <div className="afr-summary-row">
                <span>Discount</span>
                <span className="afr-discount-val">— ₹ {discountTotal}</span>
              </div>
              <div className="afr-summary-divider" />
              <div className="afr-summary-row afr-summary-total">
                <span>Net Total</span>
                <span>₹ {netTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="afr-hub-container">
        <div className="afr-hub-head">
          {["Comments", "History", "Attachments"].map((tab) => (
            <p key={tab} className={activeTab === tab ? "afr-tab-active" : ""} onClick={() => setActiveTab(tab)}>{tab}</p>
          ))}
        </div>
        <div className="afr-hub-body">
          {activeTab === "Comments"    && <FormReceivableComment    recordId={recordId} apiProvider={null} />}
          {activeTab === "History"     && <FormReceivableHistory    recordId={recordId} apiProvider={null} />}
          {activeTab === "Attachments" && <FormReceivableAttachment recordId={recordId} apiProvider={null} />}
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="afr-btn-container">
        <button className="afr-btn afr-btn-cancel" onClick={handleClose}>Cancel</button>
        <div className="afr-btn-right">
          <button className="afr-btn afr-btn-draft"    onClick={handleSaveDraft} disabled={!btn.draft    || saving}>{saving ? "Saving..." : "Save Draft"}</button>
          <button className="afr-btn afr-btn-submit"   onClick={handleSubmit}    disabled={!btn.submit   || saving}>Submit</button>
          <button className="afr-btn afr-btn-approve"  onClick={handleApprove}   disabled={!btn.approve  || saving}>Approve</button>
          <button className="afr-btn afr-btn-sendback" onClick={handleSendBack}  disabled={!btn.sendback || saving}>Send Back</button>
          <button className="afr-btn afr-btn-post"     onClick={handlePost}      disabled={!btn.post     || saving}>Post</button>
          <button className="afr-icon-btn" disabled={!recordId || !status || status === "Draft"} title="Download PDF">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M0.600098 2.4C0.600098 1.76348 0.852954 1.15303 1.30304 0.702944C1.75313 0.252856 2.36358 0 3.0001 0L16.1313 0L21.4001 5.2688V21.6C21.4001 22.2365 21.1472 22.847 20.6972 23.2971C20.2471 23.7471 19.6366 24 19.0001 24H3.0001C2.36358 24 1.75313 23.7471 1.30304 23.2971C0.852954 22.847 0.600098 22.2365 0.600098 21.6V2.4ZM4.6001 9.6H2.2001V17.6H3.8001V14.4H4.6001C5.23662 14.4 5.84707 14.1471 6.29715 13.6971C6.74724 13.247 7.0001 12.6365 7.0001 12C7.0001 11.3635 6.74724 10.753 6.29715 10.3029C5.84707 9.85286 5.23662 9.6 4.6001 9.6ZM11.0001 9.6H8.6001V17.6H11.0001C11.6366 17.6 12.2471 17.3471 12.6972 16.8971C13.1472 16.447 13.4001 15.8365 13.4001 15.2V12C13.4001 11.3635 13.1472 10.753 12.6972 10.3029C12.2471 9.85286 11.6366 9.6 11.0001 9.6ZM15.0001 17.6V9.6H19.8001V11.2H16.6001V12.8H18.2001V14.4H16.6001V17.6H15.0001Z"/>
            </svg>
          </button>
          <button className="afr-icon-btn" disabled={!recordId || !status || status === "Draft"} title="Send Email">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 16">
              <path d="M2 16C1.45 16 0.979333 15.8043 0.588 15.413C0.196667 15.0217 0.000666667 14.5507 0 14V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196666 1.45067 0.000666667 2 0H18C18.55 0 19.021 0.196 19.413 0.588C19.805 0.98 20.0007 1.45067 20 2V14C20 14.55 19.8043 15.021 19.413 15.413C19.0217 15.805 18.5507 16.0007 18 16H2ZM10 8.825C10.0833 8.825 10.171 8.81233 10.263 8.787C10.355 8.76167 10.4423 8.72433 10.525 8.675L17.6 4.25C17.7333 4.16667 17.8333 4.06267 17.9 3.938C17.9667 3.81333 18 3.67567 18 3.525C18 3.19167 17.8583 2.94167 17.575 2.775C17.2917 2.60833 17 2.61667 16.7 2.8L10 7L3.3 2.8C3 2.61667 2.70833 2.61267 2.425 2.788C2.14167 2.96333 2 3.209 2 3.525C2 3.19167 2.03333 3.83767 2.1 3.963C2.16667 4.08833 2.26667 4.184 2.4 4.25L9.475 8.675C9.55833 8.725 9.646 8.76267 9.738 8.788C9.83 8.81333 9.91733 8.82567 10 8.825Z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
