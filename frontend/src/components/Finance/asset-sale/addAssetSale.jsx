import { useState, useEffect, useRef } from "react";
import "./addAssetSale.css";
import AssetSaleComment    from "./assetSaleComment";
import AssetSaleHistory    from "./assetSaleHistory";
import AssetSaleAttachment from "./assetSaleAttachment";

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
    <div className="aas-field" ref={ref}>
      {label && <label>{label}{required && <sup>*</sup>}</label>}
      <div className="aas-dropdown-wrap">
        <div className={`aas-dropdown-trigger${open ? " open" : ""}${disabled ? " disabled" : ""}`}
          onClick={() => !disabled && setOpen((o) => !o)}>
          <span className={value ? "val" : "ph"}>{value || placeholder}</span>
          <svg className="aas-dd-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
            <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9S301 192 288 192L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/>
          </svg>
        </div>
        {open && (
          <div className="aas-dropdown-panel">
            <div className="aas-dd-search">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
              </svg>
              <input placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} autoFocus />
            </div>
            <div className="aas-dd-options">
              {filtered.length > 0 ? filtered.map((opt) => (
                <div key={opt} className={`aas-dd-option${value === opt ? " aas-selected" : ""}`}
                  onClick={() => { onChange(opt); setOpen(false); setQ(""); }}>
                  {opt}
                </div>
              )) : <div className="aas-dd-option" style={{ color: "#98a2b3" }}>No results</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Status → button visibility ─── */
const BTN = {
  "":         { draft: true,  submit: true,  approve: false, complete: false, reject: false, sendback: false },
  Draft:      { draft: true,  submit: true,  approve: false, complete: false, reject: false, sendback: false },
  Submitted:  { draft: false, submit: false, approve: true,  complete: false, reject: true,  sendback: true  },
  Approved:   { draft: false, submit: false, approve: false, complete: true,  reject: true,  sendback: true  },
  Completed:  { draft: false, submit: false, approve: false, complete: false, reject: false, sendback: false },
  Rejected:   { draft: true,  submit: true,  approve: false, complete: false, reject: false, sendback: false },
};

const ASSET_OPTIONS    = ["AST-001 — Generator Unit A", "AST-004 — HVAC System", "AST-007 — Compressor #2", "AST-012 — Server Rack B", "AST-015 — Fork Lift #1"];
const DEPT_OPTIONS     = ["Admin", "Facilities", "Production", "IT / Network", "Warehouse", "Finance", "HR"];
const SALE_MODE_OPT    = ["Auction", "Tender", "Negotiation", "Direct Sale", "Write-off"];
const BUYER_TYPE_OPT   = ["Internal", "External"];
const PAYMENT_MODE_OPT = ["Cash", "Cheque", "NEFT / RTGS", "Bank Transfer", "DD"];

const DUMMY_LINES = [
  { id: 1, asset_id: "AST-001", asset_name: "Generator Unit A", book_value: "1,20,000.00", sale_price: "95,000.00",  gain_loss: "-25,000.00" },
];

export default function AddAssetSale({ setCurrentPage, editData = {}, isEdit = false }) {
  const [status,    setStatus]    = useState("");
  const [recordId,  setRecordId]  = useState(null);
  const [saving,    setSaving]    = useState(false);
  const [activeTab, setActiveTab] = useState("Comments");
  const [lines,     setLines]     = useState(DUMMY_LINES);

  const [form, setForm] = useState({
    sale_no:         "",
    asset_id:        "",
    asset_name:      "",
    asset_type:      "",
    location:        "",
    department:      "",
    sale_date:       "",
    sale_mode:       "",
    reason:          "",
    buyer_name:      "",
    buyer_type:      "",
    contact_no:      "",
    address:         "",
    book_value:      "",
    depreciation:    "",
    wdv:             "",
    sale_price:      "",
    gain_loss:       "",
    payment_mode:    "",
    payment_date:    "",
    approved_by:     "",
    remarks:         "",
  });

  useEffect(() => {
    if (isEdit && Object.keys(editData).length > 0) {
      const raw = editData._raw || editData;
      setRecordId(editData.id || raw.id || null);
      setStatus(editData.status || raw.status || "");
      setForm((p) => ({
        ...p,
        sale_no:     editData.sale_no    || raw.sale_no    || "",
        asset_id:    editData.asset_id   || raw.asset_id   || "",
        asset_name:  editData.asset_name || raw.asset_name || "",
        asset_type:  editData.type       || raw.asset_type || "",
        department:  editData.dept       || raw.department || "",
        sale_date:   editData.sale_date  || raw.sale_date  || "",
        buyer_name:  editData.buyer      || raw.buyer_name || "",
        book_value:  editData.book_value || raw.book_value || "",
        sale_price:  editData.sale_price || raw.sale_price || "",
        gain_loss:   editData.gain_loss  || raw.gain_loss  || "",
      }));
    }
  }, [isEdit]);

  /* Auto-calculate gain/loss whenever sale_price or book_value changes */
  useEffect(() => {
    const sp = parseFloat((form.sale_price || "").replace(/,/g, ""));
    const bv = parseFloat((form.book_value || "").replace(/,/g, ""));
    if (!isNaN(sp) && !isNaN(bv)) {
      const gl = sp - bv;
      setForm((p) => ({ ...p, gain_loss: gl.toFixed(2) }));
    }
  }, [form.sale_price, form.book_value]);

  const btn      = BTN[status] || BTN[""];
  const isLocked = ["Completed"].includes(status);
  const delay    = () => new Promise((r) => setTimeout(r, 400));
  const f        = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSaveDraft = async (e) => { e.preventDefault(); setSaving(true); try { await delay(); setStatus("Draft");     } finally { setSaving(false); } };
  const handleSubmit    = async (e) => { e.preventDefault(); setSaving(true); try { await delay(); setStatus("Submitted"); } finally { setSaving(false); } };
  const handleApprove   = async (e) => { e.preventDefault(); setSaving(true); try { await delay(); setStatus("Approved");  } finally { setSaving(false); } };
  const handleComplete  = async (e) => { e.preventDefault(); setSaving(true); try { await delay(); setStatus("Completed"); } finally { setSaving(false); } };
  const handleReject    = async (e) => { e.preventDefault(); setSaving(true); try { await delay(); setStatus("Rejected");  } finally { setSaving(false); } };
  const handleSendBack  = async (e) => { e.preventDefault(); setSaving(true); try { await delay(); setStatus("Draft");     } finally { setSaving(false); } };
  const handleClose     = (e) => { e.preventDefault(); setCurrentPage("assetSale"); };

  const deleteLine = (id) => setLines((p) => p.filter((l) => l.id !== id));
  const addLine    = () => setLines((p) => [...p, { id: Date.now(), asset_id: "", asset_name: "", book_value: "", sale_price: "", gain_loss: "" }]);

  const gainLossNum = parseFloat((form.gain_loss || "").replace(/,/g, ""));
  const glColor = isNaN(gainLossNum) ? "inherit" : gainLossNum >= 0 ? "rgba(22,163,74,1)" : "rgba(220,38,38,1)";

  const statusColor = {
    Draft:     "rgba(255,214,56,1)",
    Submitted: "rgba(140,180,255,1)",
    Approved:  "rgba(140,216,188,1)",
    Completed: "rgba(6,95,70,1)",
    Rejected:  "rgba(255,77,79,0.25)",
  };
  const statusTextColor = { Completed: "#fff", Rejected: "rgba(255,77,79,1)" };

  return (
    <div className="aas-container">
      {/* Header */}
      <div className="aas-head">
        <p>New Asset Sale Record
          {status && (
            <span style={{ marginLeft: 12, fontSize: 13, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
              background: statusColor[status] || "#eee", color: statusTextColor[status] || "#1a1a2e" }}>
              Status: {status}
            </span>
          )}
        </p>
        <button className="aas-close-btn" onClick={handleClose}>
          <svg className="aas-close-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/>
          </svg>
          <span>Close</span>
        </button>
      </div>

      {/* ── Section 1: Asset Information ── */}
      <p className="aas-section-title">Asset Information</p>
      <div className="aas-grid">
        <div className="aas-field">
          <label>Sale No.</label>
          <input placeholder="Auto-generate (e.g., ASL-2025-001)" value={form.sale_no} disabled />
        </div>
        <SearchDropdown label="Asset ID / Name" required value={form.asset_id}
          onChange={(v) => {
            const name = v.includes("—") ? v.split("—")[1].trim() : "";
            const id   = v.includes("—") ? v.split("—")[0].trim() : v;
            setForm((p) => ({ ...p, asset_id: id, asset_name: name }));
          }}
          options={ASSET_OPTIONS} placeholder="e.g., AST-001" disabled={isLocked} />
      </div>
      <div className="aas-grid">
        <div className="aas-field">
          <label>Asset Name</label>
          <input placeholder="Auto-filled from Asset ID" value={form.asset_name} disabled />
        </div>
        <div className="aas-field">
          <label>Asset Type / Category</label>
          <input placeholder="e.g., Electrical, Vehicle, IT" value={form.asset_type} onChange={f("asset_type")} disabled={isLocked} />
        </div>
      </div>
      <div className="aas-grid">
        <div className="aas-field">
          <label>Location</label>
          <input placeholder="e.g., Block A - Warehouse" value={form.location} onChange={f("location")} disabled={isLocked} />
        </div>
        <SearchDropdown label="Department" required value={form.department}
          onChange={(v) => setForm((p) => ({ ...p, department: v }))}
          options={DEPT_OPTIONS} placeholder="e.g., Production" disabled={isLocked} />
      </div>

      {/* ── Section 2: Sale Details ── */}
      <p className="aas-section-title">Sale Details</p>
      <div className="aas-grid">
        <div className="aas-field">
          <label>Sale Date<sup>*</sup></label>
          <input type="date" value={form.sale_date} onChange={f("sale_date")} disabled={isLocked} />
        </div>
        <SearchDropdown label="Mode of Sale" required value={form.sale_mode}
          onChange={(v) => setForm((p) => ({ ...p, sale_mode: v }))}
          options={SALE_MODE_OPT} placeholder="e.g., Auction, Negotiation" disabled={isLocked} />
      </div>
      <div className="aas-grid">
        <div className="aas-field" style={{ gridColumn: "span 2" }}>
          <label>Reason for Sale</label>
          <textarea rows={3} placeholder="Describe the reason for selling this asset..." value={form.reason} onChange={f("reason")} disabled={isLocked} />
        </div>
      </div>

      {/* ── Section 3: Buyer Information ── */}
      <p className="aas-section-title">Buyer Information</p>
      <div className="aas-grid">
        <div className="aas-field">
          <label>Buyer Name<sup>*</sup></label>
          <input placeholder="e.g., Suresh Enterprises" value={form.buyer_name} onChange={f("buyer_name")} disabled={isLocked} />
        </div>
        <SearchDropdown label="Buyer Type" required value={form.buyer_type}
          onChange={(v) => setForm((p) => ({ ...p, buyer_type: v }))}
          options={BUYER_TYPE_OPT} placeholder="Internal / External" disabled={isLocked} />
      </div>
      <div className="aas-grid">
        <div className="aas-field">
          <label>Contact No.</label>
          <input placeholder="e.g., +91 98765 43210" value={form.contact_no} onChange={f("contact_no")} disabled={isLocked} />
        </div>
        <div className="aas-field">
          <label>Address / GST No.</label>
          <input placeholder="e.g., Chennai, Tamil Nadu / 33AAAA..." value={form.address} onChange={f("address")} disabled={isLocked} />
        </div>
      </div>

      {/* ── Section 4: Financial Summary ── */}
      <p className="aas-section-title">Financial Summary</p>
      <div className="aas-grid">
        <div className="aas-field">
          <label>Book Value (₹)<sup>*</sup></label>
          <input type="number" min="0" placeholder="e.g., 1,20,000.00" value={form.book_value} onChange={f("book_value")} disabled={isLocked} />
        </div>
        <div className="aas-field">
          <label>Accumulated Depreciation (₹)</label>
          <input type="number" min="0" placeholder="e.g., 30,000.00" value={form.depreciation} onChange={f("depreciation")} disabled={isLocked} />
        </div>
      </div>
      <div className="aas-grid">
        <div className="aas-field">
          <label>Written Down Value / WDV (₹)</label>
          <input placeholder="Auto-calculated" value={
            (() => {
              const bv  = parseFloat((form.book_value   || "").replace(/,/g, ""));
              const dep = parseFloat((form.depreciation || "").replace(/,/g, ""));
              if (!isNaN(bv) && !isNaN(dep)) return (bv - dep).toFixed(2);
              return "";
            })()
          } disabled />
        </div>
        <div className="aas-field">
          <label>Sale Price (₹)<sup>*</sup></label>
          <input type="number" min="0" placeholder="e.g., 95,000.00" value={form.sale_price} onChange={f("sale_price")} disabled={isLocked} />
        </div>
      </div>
      <div className="aas-grid">
        <div className="aas-field">
          <label>Gain / Loss (₹)</label>
          <input placeholder="Auto-calculated" value={form.gain_loss} disabled
            style={{ color: glColor, fontWeight: form.gain_loss ? 600 : 400 }} />
        </div>
        <div className="aas-field" />
      </div>

      {/* ── Section 5: Payment & Approval ── */}
      <p className="aas-section-title">Payment & Approval</p>
      <div className="aas-grid">
        <SearchDropdown label="Payment Mode" value={form.payment_mode}
          onChange={(v) => setForm((p) => ({ ...p, payment_mode: v }))}
          options={PAYMENT_MODE_OPT} placeholder="e.g., NEFT / Cheque" disabled={isLocked} />
        <div className="aas-field">
          <label>Payment Date</label>
          <input type="date" value={form.payment_date} onChange={f("payment_date")} disabled={isLocked} />
        </div>
      </div>
      <div className="aas-grid">
        <div className="aas-field">
          <label>Approved By</label>
          <input placeholder="Auto-linked (e.g., MGR-2025-045)" value={form.approved_by} disabled />
        </div>
        <div className="aas-field">
          <label>Status</label>
          <input placeholder="Read-only (e.g., Draft / Submitted / Approved)" value={status} disabled />
        </div>
      </div>
      <div className="aas-grid">
        <div className="aas-field" style={{ gridColumn: "span 2" }}>
          <label>Remarks</label>
          <textarea rows={2} placeholder="Any additional notes or terms of sale..." value={form.remarks} onChange={f("remarks")} disabled={isLocked} />
        </div>
      </div>

      {/* ── Section 6: Assets Being Sold ── */}
      <div className="aas-line-section">
        <p className="aas-section-title">Assets Being Sold</p>
        <div className="aas-line-table-wrap">
          <table className="aas-line-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Asset ID</th>
                <th>Asset Name</th>
                <th>Book Value (₹)</th>
                <th>Sale Price (₹)</th>
                <th>Gain / Loss (₹)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l, i) => (
                <tr key={l.id}>
                  <td>{i + 1}</td>
                  <td>{l.asset_id   || <input placeholder="AST-..." style={{ border: "1px solid #ddd", borderRadius: 6, padding: "4px 8px", fontSize: 13, width: 90  }} />}</td>
                  <td>{l.asset_name || <input placeholder="Asset name..." style={{ border: "1px solid #ddd", borderRadius: 6, padding: "4px 8px", fontSize: 13, width: 150 }} />}</td>
                  <td>{l.book_value || <input type="number" placeholder="0.00" style={{ border: "1px solid #ddd", borderRadius: 6, padding: "4px 8px", fontSize: 13, width: 100 }} />}</td>
                  <td>{l.sale_price || <input type="number" placeholder="0.00" style={{ border: "1px solid #ddd", borderRadius: 6, padding: "4px 8px", fontSize: 13, width: 100 }} />}</td>
                  <td style={{ color: l.gain_loss ? (parseFloat(l.gain_loss.replace(/,/g, "")) >= 0 ? "rgba(22,163,74,1)" : "rgba(220,38,38,1)") : "inherit", fontWeight: l.gain_loss ? 600 : 400 }}>
                    {l.gain_loss || <input type="number" placeholder="0.00" style={{ border: "1px solid #ddd", borderRadius: 6, padding: "4px 8px", fontSize: 13, width: 100 }} />}
                  </td>
                  <td>
                    <button className="aas-delete-btn" onClick={() => deleteLine(l.id)} disabled={isLocked} title="Remove">🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isLocked && (
          <button className="aas-add-item-btn" onClick={addLine}>+ Add Asset</button>
        )}
      </div>

      {/* ── Tabs: Comments / History / Attachments ── */}
      <div className="aas-hub-container">
        <div className="aas-hub-head">
          {["Comments", "History", "Attachments"].map((tab) => (
            <p key={tab} className={activeTab === tab ? "aas-tab-active" : ""} onClick={() => setActiveTab(tab)}>{tab}</p>
          ))}
        </div>
        <div className="aas-hub-body">
          {activeTab === "Comments"    && <AssetSaleComment    recordId={recordId} apiProvider={null} />}
          {activeTab === "History"     && <AssetSaleHistory    recordId={recordId} apiProvider={null} />}
          {activeTab === "Attachments" && <AssetSaleAttachment recordId={recordId} apiProvider={null} />}
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="aas-btn-container">
        <button className="aas-btn aas-btn-cancel" onClick={handleClose}>Cancel</button>
        <div className="aas-btn-right">
          <button className="aas-btn aas-btn-draft"    onClick={handleSaveDraft} disabled={!btn.draft    || saving}>{saving ? "Saving..." : "Save Draft"}</button>
          <button className="aas-btn aas-btn-submit"   onClick={handleSubmit}    disabled={!btn.submit   || saving}>Submit</button>
          <button className="aas-btn aas-btn-approve"  onClick={handleApprove}   disabled={!btn.approve  || saving}>Approve</button>
          <button className="aas-btn aas-btn-complete" onClick={handleComplete}  disabled={!btn.complete || saving}>Mark Complete</button>
          <button className="aas-btn aas-btn-reject"   onClick={handleReject}    disabled={!btn.reject   || saving}>Reject</button>
          <button className="aas-btn aas-btn-sendback" onClick={handleSendBack}  disabled={!btn.sendback || saving}>Send Back</button>
          <button className="aas-icon-btn" disabled={!recordId || status === "" || status === "Draft"} title="Download PDF">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M0.600098 2.4C0.600098 1.76348 0.852954 1.15303 1.30304 0.702944C1.75313 0.252856 2.36358 0 3.0001 0L16.1313 0L21.4001 5.2688V21.6C21.4001 22.2365 21.1472 22.847 20.6972 23.2971C20.2471 23.7471 19.6366 24 19.0001 24H3.0001C2.36358 24 1.75313 23.7471 1.30304 23.2971C0.852954 22.847 0.600098 22.2365 0.600098 21.6V2.4ZM4.6001 9.6H2.2001V17.6H3.8001V14.4H4.6001C5.23662 14.4 5.84707 14.1471 6.29715 13.6971C6.74724 13.247 7.0001 12.6365 7.0001 12C7.0001 11.3635 6.74724 10.753 6.29715 10.3029C5.84707 9.85286 5.23662 9.6 4.6001 9.6ZM11.0001 9.6H8.6001V17.6H11.0001C11.6366 17.6 12.2471 17.3471 12.6972 16.8971C13.1472 16.447 13.4001 15.8365 13.4001 15.2V12C13.4001 11.3635 13.1472 10.753 12.6972 10.3029C12.2471 9.85286 11.6366 9.6 11.0001 9.6ZM15.0001 17.6V9.6H19.8001V11.2H16.6001V12.8H18.2001V14.4H16.6001V17.6H15.0001Z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
