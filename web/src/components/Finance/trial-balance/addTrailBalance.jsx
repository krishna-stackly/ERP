import { useState, useEffect, useRef } from "react";
import "./addTrailBalance.css";
import TrailBalanceComment    from "./trailBalanceComment";
import TrailBalanceHistory    from "./trailBalanceHistory";
import TrailBalanceAttachment from "./trailBalanceAttachment";

/* ─── Dummy data ─── */
const DEBIT_ROWS = [
  { id: 1, code: "1001", name: "Cash Account",  group: "Assets",      opening: "₹ 50,000", period: "₹ 30,000", closing: "₹ 70,000" },
  { id: 2, code: "3001", name: "Inventory",      group: "Assets",      opening: "₹ 75,000", period: "₹ 20,000", closing: "₹ 80,000" },
];
const CREDIT_ROWS = [
  { id: 1, code: "2001", name: "Accounts Payable", group: "Liabilities", opening: "₹ 40,000", period: "₹ 25,000", closing: "₹ 52,000" },
  { id: 2, code: "4001", name: "Sales Revenue",    group: "Income",      opening: "₹ 0",       period: "₹ 1,05,000", closing: "₹ 1,05,000" },
];
const CONSOLIDATED_ROWS = [
  { id: 1, code: "1001", name: "Cash Account",    group: "Assets",       od: "₹ 50,000", oc: "₹ 0",     pd: "₹ 30,000", pc: "₹ 0",       cd: "₹ 70,000", cc: "₹ 0" },
  { id: 2, code: "2001", name: "Accounts Payable",group: "Liabilities",  od: "₹ 0",     oc: "₹ 40,000", pd: "₹ 0",      pc: "₹ 25,000",  cd: "₹ 0",      cc: "₹ 52,000" },
  { id: 3, code: "3001", name: "Inventory",        group: "Assets",       od: "₹ 75,000", oc: "₹ 0",     pd: "₹ 20,000", pc: "₹ 0",       cd: "₹ 80,000", cc: "₹ 0" },
  { id: 4, code: "4001", name: "Sales Revenue",    group: "Income",       od: "₹ 0",     oc: "₹ 0",      pd: "₹ 0",      pc: "₹ 1,05,000",cd: "₹ 0",      cc: "₹ 1,05,000" },
];
const LEDGER_DATA = {
  "1001": { title: "Cash Account",     rows: [
    { date: "01-Apr-2025", voucher: "V001", particulars: "Opening Balance", debit: "₹ 50,000", credit: "₹ 0",      balance: "₹ 50,000" },
    { date: "10-Apr-2025", voucher: "V015", particulars: "Cash Sales",      debit: "₹ 30,000", credit: "₹ 0",      balance: "₹ 80,000" },
    { date: "15-Apr-2025", voucher: "V020", particulars: "Rent Payment",    debit: "₹ 0",      credit: "₹ 10,000", balance: "₹ 70,000" },
  ]},
  "2001": { title: "Accounts Payable", rows: [
    { date: "01-Apr-2025", voucher: "V002", particulars: "Opening Balance",   debit: "₹ 0",      credit: "₹ 40,000", balance: "₹ 40,000" },
    { date: "12-Apr-2025", voucher: "V018", particulars: "Supplier Invoice",  debit: "₹ 0",      credit: "₹ 25,000", balance: "₹ 65,000" },
    { date: "20-Apr-2025", voucher: "V025", particulars: "Payment to Vendor", debit: "₹ 15,000", credit: "₹ 0",      balance: "₹ 50,000" },
  ]},
  "3001": { title: "Inventory",        rows: [
    { date: "01-Apr-2025", voucher: "V003", particulars: "Opening Balance", debit: "₹ 75,000", credit: "₹ 0",     balance: "₹ 75,000" },
    { date: "09-Apr-2025", voucher: "V012", particulars: "Purchase Goods",  debit: "₹ 20,000", credit: "₹ 0",     balance: "₹ 95,000" },
    { date: "14-Apr-2025", voucher: "V019", particulars: "Goods Returned",  debit: "₹ 0",      credit: "₹ 5,000", balance: "₹ 90,000" },
  ]},
  "4001": { title: "Sales Revenue",   rows: [
    { date: "01-Apr-2025", voucher: "V004", particulars: "Opening Balance", debit: "₹ 0", credit: "₹ 0",        balance: "₹ 0" },
    { date: "10-Apr-2025", voucher: "V015", particulars: "Cash Sales",      debit: "₹ 0", credit: "₹ 1,05,000", balance: "₹ 1,05,000" },
  ]},
};

/* ─── Searchable custom dropdown ─── */
function CustomDropdown({ label, value, onChange, options, placeholder, disabled, required }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div className="atb-input-box" ref={ref}>
      <label>{label}{required && <sup>*</sup>}</label>
      <div className="atb-dropdown-wrap">
        <div
          className={`atb-dropdown-trigger${open ? " open" : ""}${disabled ? " disabled" : ""}`}
          onClick={() => !disabled && setOpen((o) => !o)}
        >
          <span className={value ? "has-value" : ""}>{value || placeholder}</span>
          <svg className="atb-dropdown-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
            <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9S301 192 288 192L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/>
          </svg>
        </div>
        {open && (
          <div className="atb-dropdown-panel">
            {options.map((opt) => (
              <div key={opt} className={`atb-dropdown-option${value === opt ? " selected" : ""}`}
                onClick={() => { onChange(opt); setOpen(false); }}>
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Summary card row ─── */
function SRow({ label, value, onView }) {
  return (
    <div className="atb-summary-row">
      <label>{label}</label>
      {onView ? <a href="#" onClick={(e) => { e.preventDefault(); onView(); }}>View</a>
               : <span>{value || "₹0"}</span>}
    </div>
  );
}

/* ─── Modal wrapper ─── */
function Modal({ title, onClose, children }) {
  return (
    <div className="atb-modal-overlay" onClick={onClose}>
      <div className="atb-modal" onClick={(e) => e.stopPropagation()}>
        <div className="atb-modal-header">
          <h3>{title}</h3>
          <button className="atb-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="atb-modal-body">{children}</div>
      </div>
    </div>
  );
}

/* ─── Debit Summary View Table ─── */
function DebitSummaryModal({ onClose, onViewLedger }) {
  return (
    <Modal title="Debit Summary View" onClose={onClose}>
      <table className="atb-modal-table">
        <thead>
          <tr>
            <th>#</th><th>Account Code</th><th>Account Name</th><th>Group Name</th>
            <th>Opening Debit</th><th>Period Debit</th><th>Closing Debit</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {DEBIT_ROWS.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td><td>{r.code}</td><td>{r.name}</td><td>{r.group}</td>
              <td>{r.opening}</td><td>{r.period}</td><td>{r.closing}</td>
              <td className="atb-row-action">
                <span className="atb-row-dots">⋮</span>
                <div className="atb-row-menu">
                  <button onClick={() => onViewLedger(r.code, r.name)}>View Ledger</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4}>Total (X)</td>
            <td>₹ 1,25,000</td><td>₹ 50,000</td><td>₹ 1,75,000</td><td></td>
          </tr>
        </tfoot>
      </table>
    </Modal>
  );
}

/* ─── Credit Summary View Table ─── */
function CreditSummaryModal({ onClose, onViewLedger }) {
  return (
    <Modal title="Credit Summary View" onClose={onClose}>
      <table className="atb-modal-table">
        <thead>
          <tr>
            <th>#</th><th>Account Code</th><th>Account Name</th><th>Group Name</th>
            <th>Opening Credit</th><th>Period Credit</th><th>Closing Credit</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {CREDIT_ROWS.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td><td>{r.code}</td><td>{r.name}</td><td>{r.group}</td>
              <td>{r.opening}</td><td>{r.period}</td><td>{r.closing}</td>
              <td className="atb-row-action">
                <span className="atb-row-dots">⋮</span>
                <div className="atb-row-menu">
                  <button onClick={() => onViewLedger(r.code, r.name)}>View Ledger</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4}>Total (Y)</td>
            <td>₹ 40,000</td><td>₹ 1,30,000</td><td>₹ 1,57,000</td><td></td>
          </tr>
        </tfoot>
      </table>
    </Modal>
  );
}

/* ─── Full Consolidated Table ─── */
function ConsolidatedModal({ onClose, onViewLedger }) {
  return (
    <Modal title="Full Consolidated Table" onClose={onClose}>
      <div style={{ overflowX: "auto" }}>
        <table className="atb-modal-table">
          <thead>
            <tr>
              <th>#</th><th>Account Code</th><th>Account Name</th><th>Group Name</th>
              <th>Opening Debit</th><th>Opening Credit</th>
              <th>Period Debit</th><th>Period Credit</th>
              <th>Closing Debit</th><th>Closing Credit</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {CONSOLIDATED_ROWS.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td><td>{r.code}</td><td>{r.name}</td><td>{r.group}</td>
                <td>{r.od}</td><td>{r.oc}</td>
                <td>{r.pd}</td><td>{r.pc}</td>
                <td>{r.cd}</td><td>{r.cc}</td>
                <td className="atb-row-action">
                  <span className="atb-row-dots">⋮</span>
                  <div className="atb-row-menu">
                    <button onClick={() => onViewLedger(r.code, r.name)}>View Ledger</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4}>Total</td>
              <td>₹ 1,25,000</td><td>₹ 40,000</td>
              <td>₹ 50,000</td><td>₹ 1,30,000</td>
              <td>₹ 1,75,000</td><td>₹ 1,57,000</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Modal>
  );
}

/* ─── Ledger Drill-down ─── */
function LedgerModal({ code, name, onClose }) {
  const ledger = LEDGER_DATA[code];
  return (
    <Modal title={`View Ledger — Account Code ${code} (${name})`} onClose={onClose}>
      <table className="atb-modal-table">
        <thead>
          <tr>
            <th>#</th><th>Date</th><th>Voucher No</th>
            <th>Particulars</th><th>Debit</th><th>Credit</th><th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {ledger?.rows.map((r, i) => (
            <tr key={i}>
              <td>{i + 1}</td><td>{r.date}</td><td>{r.voucher}</td>
              <td>{r.particulars}</td><td>{r.debit}</td><td>{r.credit}</td><td>{r.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Modal>
  );
}

/* ─── Button state per status ─── */
const BTN = {
  "":        { draft: true,  submit: true,  approve: false, post: false },
  Draft:     { draft: true,  submit: true,  approve: false, post: false },
  Submitted: { draft: false, submit: false, approve: true,  post: false },
  Approved:  { draft: false, submit: false, approve: false, post: true  },
  Posted:    { draft: false, submit: false, approve: false, post: false },
  Cancelled: { draft: false, submit: false, approve: false, post: false },
};

const FY_FROM = ["01-01-2026", "01-04-2025", "01-04-2024"];
const FY_TO   = ["31-01-2026", "31-03-2026", "31-03-2025"];

export default function AddTrailBalance({ setCurrentPage, editData = {}, isEdit = false }) {
  const [status,    setStatus]    = useState("");
  const [recordId,  setRecordId]  = useState(null);
  const [saving,    setSaving]    = useState(false);
  const [activeTab, setActiveTab] = useState("Attachments");

  /* Modal state */
  const [modal, setModal]           = useState(null); // 'debit' | 'credit' | 'consolidated' | 'ledger'
  const [ledgerInfo, setLedgerInfo] = useState({ code: "", name: "" });

  const openLedger = (code, name) => { setLedgerInfo({ code, name }); setModal("ledger"); };

  const [form, setForm] = useState({
    company: "", fy_from: "01-01-2026", fy_to: "31-01-2026",
    currency: "", as_on_date: "", include_unposted: "", level_of_detail: "",
  });

  useEffect(() => {
    if (isEdit && Object.keys(editData).length > 0) {
      const raw = editData._raw || editData;
      setRecordId(editData.id || raw.id || null);
      setStatus(editData.status || raw.status || "");
      setForm((p) => ({
        ...p,
        company: raw.company || "", fy_from: raw.fy_from || p.fy_from, fy_to: raw.fy_to || p.fy_to,
        currency: raw.currency || "", as_on_date: raw.as_on_date || "",
        include_unposted: raw.include_unposted || "", level_of_detail: raw.level_of_detail || "",
      }));
    }
  }, [isEdit]);

  const btn      = BTN[status] || BTN[""];
  const isLocked = status === "Approved" || status === "Posted" || status === "Cancelled";
  const delay    = () => new Promise((r) => setTimeout(r, 400));

  const handleSaveDraft = async (e) => { e.preventDefault(); setSaving(true); try { await delay(); setStatus("Draft"); } finally { setSaving(false); } };
  const handleSubmit    = async (e) => { e.preventDefault(); setSaving(true); try { await delay(); setStatus("Submitted"); } finally { setSaving(false); } };
  const handleApprove   = async (e) => { e.preventDefault(); setSaving(true); try { await delay(); setStatus("Approved"); } finally { setSaving(false); } };
  const handlePost      = async (e) => { e.preventDefault(); setSaving(true); try { await delay(); setStatus("Posted"); } finally { setSaving(false); } };
  const handleClose     = (e) => { e.preventDefault(); setCurrentPage("trailBalance"); };

  return (
    <div className="atb-container">
      {/* Modals */}
      {modal === "debit"        && <DebitSummaryModal  onClose={() => setModal(null)} onViewLedger={(c, n) => openLedger(c, n)} />}
      {modal === "credit"       && <CreditSummaryModal onClose={() => setModal(null)} onViewLedger={(c, n) => openLedger(c, n)} />}
      {modal === "consolidated" && <ConsolidatedModal  onClose={() => setModal(null)} onViewLedger={(c, n) => openLedger(c, n)} />}
      {modal === "ledger"       && <LedgerModal code={ledgerInfo.code} name={ledgerInfo.name} onClose={() => setModal(null)} />}

      {/* Header */}
      <div className="atb-head">
        <nav>
          <p>Trial Balance Report</p>
          {status && <h3 className={`atb-status-${status}`}>Status: {status}</h3>}
        </nav>
        <button className="atb-close-btn" onClick={handleClose}>
          <svg className="atb-close-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/>
          </svg>
          <span>Close</span>
        </button>
      </div>

      {/* Report Parameters */}
      <div className="atb-params-card">
        <p className="atb-section-title">Report Parameters</p>

        <div className="atb-input-grid">
          <CustomDropdown label="Company" required value={form.company}
            onChange={(v) => setForm((p) => ({ ...p, company: v }))}
            options={["Head Office – Chennai", "Branch – Coimbatore", "Branch – Madurai", "Branch – Salem", "Branch – Bangalore"]}
            placeholder="Manual (eg., Head Office – Chennai)" disabled={isLocked} />

          <div className="atb-input-box">
            <label>Financial Year / Period<sup>*</sup></label>
            <div className="atb-date-range-row">
              <span>From</span>
              <select value={form.fy_from} onChange={(e) => setForm((p) => ({ ...p, fy_from: e.target.value }))} disabled={isLocked}>
                {FY_FROM.map((o) => <option key={o}>{o}</option>)}
              </select>
              <span>To</span>
              <select value={form.fy_to} onChange={(e) => setForm((p) => ({ ...p, fy_to: e.target.value }))} disabled={isLocked}>
                {FY_TO.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="atb-input-grid">
          <CustomDropdown label="Currency" required value={form.currency}
            onChange={(v) => setForm((p) => ({ ...p, currency: v }))}
            options={["INR", "USD", "EUR", "GBP", "JPY"]}
            placeholder="Manual (eg., INR)" disabled={isLocked} />

          <div className="atb-input-box">
            <label>As on Date<sup>*</sup></label>
            <input type="date" value={form.as_on_date}
              onChange={(e) => setForm((p) => ({ ...p, as_on_date: e.target.value }))} disabled={isLocked} />
          </div>
        </div>

        <div className="atb-input-grid">
          <CustomDropdown label="Include Unposted Txns" value={form.include_unposted}
            onChange={(v) => setForm((p) => ({ ...p, include_unposted: v }))}
            options={["Yes", "No"]}
            placeholder="Manual (eg., Yes)" disabled={isLocked} />

          <CustomDropdown label="Level of Detail" value={form.level_of_detail}
            onChange={(v) => setForm((p) => ({ ...p, level_of_detail: v }))}
            options={["Summary", "Grouped", "Detailed"]}
            placeholder="Manual (eg., Detailed)" disabled={isLocked} />
        </div>
      </div>

      {/* Line Items */}
      <p className="atb-section-title">Line Items<sup style={{ color: "red" }}>*</sup></p>

      <div className="atb-summary-grid">
        {/* Debit Summary */}
        <div className="atb-summary-card">
          <div className="atb-summary-header">Debit Summary</div>
          <SRow label="Account Code:"  value="1001" />
          <SRow label="Account Name:"  value="Cash Account" />
          <SRow label="Group Name:"    value="Assets" />
          <div className="atb-summary-divider" />
          <SRow label="Opening Debit:" value="₹ 50,000" />
          <SRow label="Period Debit:"  value="₹ 30,000" />
          <SRow label="Closing Debit:" value="₹ 70,000" />
          <div className="atb-summary-divider" />
          <SRow label="Totals:" onView={() => setModal("debit")} />
          <SRow label="Opening Debit Total (X):" value="₹ 1,25,000" />
          <SRow label="Period Debit Total (A):"  value="₹ 50,000" />
          <SRow label="Closing Debit Total (M):" value="₹ 1,75,000" />
        </div>

        {/* Credit Summary */}
        <div className="atb-summary-card">
          <div className="atb-summary-header">Credit Summary</div>
          <SRow label="Account Code:"    value="1001" />
          <SRow label="Account Name:"    value="Cash Account" />
          <SRow label="Group Name:"      value="Assets" />
          <div className="atb-summary-divider" />
          <SRow label="Opening Credit:"  value="₹ 10,000" />
          <SRow label="Period Credit:"   value="₹ 5,000" />
          <SRow label="Closing Credit:"  value="₹ 85,000" />
          <div className="atb-summary-divider" />
          <SRow label="Totals:" onView={() => setModal("credit")} />
          <SRow label="Opening Credit Total (Y):" value="₹ 1,40,000" />
          <SRow label="Period Credit Total (B):"  value="₹ 1,30,000" />
          <SRow label="Closing Credit Total (N):" value="₹ 1,57,000" />
        </div>
      </div>

      {/* Grand Totals */}
      <div className="atb-grand-card">
        <div className="atb-grand-header">
          Grand Totals (Combined Field)
          <a href="#" onClick={(e) => { e.preventDefault(); setModal("consolidated"); }}>View</a>
        </div>
        <div className="atb-grand-row">
          <label>Debit Grand Total:</label>  <span>₹ 1,75,000</span>
        </div>
        <div className="atb-grand-row">
          <label>Credit Grand Total:</label> <span>₹ 2,00,000</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="atb-hub-container">
        <div className="atb-hub-head">
          {["Attachments", "Comments", "History"].map((tab) => (
            <p key={tab} className={activeTab === tab ? "atb-tab-active" : ""} onClick={() => setActiveTab(tab)}>
              {tab}
            </p>
          ))}
        </div>
        <div className="atb-hub-body">
          {activeTab === "Attachments" && <TrailBalanceAttachment recordId={recordId} apiProvider={null} />}
          {activeTab === "Comments"    && <TrailBalanceComment    recordId={recordId} apiProvider={null} />}
          {activeTab === "History"     && <TrailBalanceHistory    recordId={recordId} apiProvider={null} />}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="atb-btn-container">
        <button className="atb-btn atb-btn-cancel" onClick={handleClose}>Cancel</button>
        <div className="atb-btn-right">
          <button className="atb-btn atb-btn-draft"   onClick={handleSaveDraft} disabled={!btn.draft   || saving}>{saving ? "Saving..." : "Save Draft"}</button>
          <button className="atb-btn atb-btn-submit"  onClick={handleSubmit}    disabled={!btn.submit  || saving}>Submit (Trial Balance)</button>
          <button className="atb-btn atb-btn-approve" onClick={handleApprove}   disabled={!btn.approve || saving}>Approve</button>
          <button className="atb-btn atb-btn-post"    onClick={handlePost}      disabled={!btn.post    || saving}>Post</button>
          <button className="atb-icon-btn" disabled={!recordId || status === "" || status === "Draft"} title="Download PDF">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M0.600098 2.4C0.600098 1.76348 0.852954 1.15303 1.30304 0.702944C1.75313 0.252856 2.36358 0 3.0001 0L16.1313 0L21.4001 5.2688V21.6C21.4001 22.2365 21.1472 22.847 20.6972 23.2971C20.2471 23.7471 19.6366 24 19.0001 24H3.0001C2.36358 24 1.75313 23.7471 1.30304 23.2971C0.852954 22.847 0.600098 22.2365 0.600098 21.6V2.4ZM4.6001 9.6H2.2001V17.6H3.8001V14.4H4.6001C5.23662 14.4 5.84707 14.1471 6.29715 13.6971C6.74724 13.247 7.0001 12.6365 7.0001 12C7.0001 11.3635 6.74724 10.753 6.29715 10.3029C5.84707 9.85286 5.23662 9.6 4.6001 9.6ZM11.0001 9.6H8.6001V17.6H11.0001C11.6366 17.6 12.2471 17.3471 12.6972 16.8971C13.1472 16.447 13.4001 15.8365 13.4001 15.2V12C13.4001 11.3635 13.1472 10.753 12.6972 10.3029C12.2471 9.85286 11.6366 9.6 11.0001 9.6ZM15.0001 17.6V9.6H19.8001V11.2H16.6001V12.8H18.2001V14.4H16.6001V17.6H15.0001Z"/>
            </svg>
          </button>
          <button className="atb-icon-btn" disabled={!recordId || status === "" || status === "Draft"} title="Send Email">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 16">
              <path d="M2 16C1.45 16 0.979333 15.8043 0.588 15.413C0.196667 15.0217 0.000666667 14.5507 0 14V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196666 1.45067 0.000666667 2 0H18C18.55 0 19.021 0.196 19.413 0.588C19.805 0.98 20.0007 1.45067 20 2V14C20 14.55 19.8043 15.021 19.413 15.413C19.0217 15.805 18.5507 16.0007 18 16H2ZM10 8.825C10.0833 8.825 10.171 8.81233 10.263 8.787C10.355 8.76167 10.4423 8.72433 10.525 8.675L17.6 4.25C17.7333 4.16667 17.8333 4.06267 17.9 3.938C17.9667 3.81333 18 3.67567 18 3.525C18 3.19167 17.8583 2.94167 17.575 2.775C17.2917 2.60833 17 2.61667 16.7 2.8L10 7L3.3 2.8C3 2.61667 2.70833 2.61267 2.425 2.788C2.14167 2.96333 2 3.209 2 3.525C2 3.19167 2.03333 3.83767 2.1 3.963C2.16667 4.08833 2.26667 4.184 2.4 4.25L9.475 8.675C9.55833 8.725 9.646 8.76267 9.738 8.788C9.83 8.81333 9.91733 8.82567 10 8.825Z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
