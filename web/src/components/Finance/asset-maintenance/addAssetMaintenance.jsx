import { useState, useEffect, useRef } from "react";
import "./addAssetMaintenance.css";
import AssetMaintenanceComment    from "./assetMaintenanceComment";
import AssetMaintenanceHistory    from "./assetMaintenanceHistory";
import AssetMaintenanceAttachment from "./assetMaintenanceAttachment";

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
    <div className="aam-field" ref={ref}>
      {label && <label>{label}{required && <sup>*</sup>}</label>}
      <div className="aam-dropdown-wrap">
        <div className={`aam-dropdown-trigger${open ? " open" : ""}${disabled ? " disabled" : ""}`}
          onClick={() => !disabled && setOpen((o) => !o)}>
          <span className={value ? "val" : "ph"}>{value || placeholder}</span>
          <svg className="aam-dd-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
            <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9S301 192 288 192L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/>
          </svg>
        </div>
        {open && (
          <div className="aam-dropdown-panel">
            <div className="aam-dd-search">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
              </svg>
              <input placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} autoFocus />
            </div>
            <div className="aam-dd-options">
              {filtered.length > 0 ? filtered.map((opt) => (
                <div key={opt} className={`aam-dd-option${value === opt ? " aam-selected" : ""}`}
                  onClick={() => { onChange(opt); setOpen(false); setQ(""); }}>
                  {opt}
                </div>
              )) : <div className="aam-dd-option" style={{ color: "#98a2b3" }}>No results</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Status → button visibility ─── */
const BTN = {
  "":           { draft: true,  schedule: true,  start: false, complete: false, sendback: false },
  Draft:        { draft: true,  schedule: true,  start: false, complete: false, sendback: false },
  Scheduled:    { draft: false, schedule: false, start: true,  complete: false, sendback: true  },
  "In Progress":{ draft: false, schedule: false, start: false, complete: true,  sendback: true  },
  Completed:    { draft: false, schedule: false, start: false, complete: false, sendback: false },
  Overdue:      { draft: true,  schedule: true,  start: false, complete: false, sendback: false },
};

const ASSET_OPTIONS      = ["AST-001 — Generator Unit A", "AST-004 — HVAC System", "AST-007 — Compressor #2", "AST-012 — Server Rack B", "AST-015 — Fork Lift #1"];
const TYPE_OPTIONS       = ["Preventive", "Corrective", "Predictive", "Condition-Based", "Emergency"];
const DEPT_OPTIONS       = ["Admin", "Facilities", "Production", "IT / Network", "Warehouse", "Finance", "HR"];
const TECHNICIAN_OPTIONS = ["Ramesh K — Tech-001", "Priya S — Tech-002", "Arjun R — Tech-003", "Neha T — Tech-004", "Vikram L — Tech-005"];
const VENDOR_OPTIONS     = ["ABC Services Pvt Ltd", "XYZ Maintenance Co", "TechFix Solutions", "BuildCare Enterprises"];
const PRIORITY_OPTIONS   = ["Low", "Medium", "High", "Critical"];

const DUMMY_PARTS = [
  { id: 1, part_no: "PRT-001", name: "Oil Filter",         qty: 2, unit: "Nos", unit_cost: "450.00",   total: "900.00"   },
  { id: 2, part_no: "PRT-008", name: "V-Belt Drive",       qty: 1, unit: "Nos", unit_cost: "1200.00",  total: "1200.00"  },
  { id: 3, part_no: "PRT-022", name: "Lubricant (500ml)",  qty: 4, unit: "Pcs", unit_cost: "320.00",   total: "1280.00"  },
];

export default function AddAssetMaintenance({ setCurrentPage, editData = {}, isEdit = false }) {
  const [status,    setStatus]    = useState("");
  const [recordId,  setRecordId]  = useState(null);
  const [saving,    setSaving]    = useState(false);
  const [activeTab, setActiveTab] = useState("Comments");
  const [parts,     setParts]     = useState(DUMMY_PARTS);

  const [form, setForm] = useState({
    maintenance_no:    "",
    asset_id:          "",
    asset_name:        "",
    asset_type:        "",
    location:          "",
    department:        "",
    maintenance_type:  "",
    description:       "",
    scheduled_date:    "",
    completion_date:   "",
    next_due_date:     "",
    technician:        "",
    vendor:            "",
    priority:          "",
    estimated_cost:    "",
    actual_cost:       "",
    approved_by:       "",
    remarks:           "",
  });

  useEffect(() => {
    if (isEdit && Object.keys(editData).length > 0) {
      const raw = editData._raw || editData;
      setRecordId(editData.id || raw.id || null);
      setStatus(editData.status || raw.status || "");
      setForm((p) => ({
        ...p,
        maintenance_no:  editData.maintenance_no  || raw.maintenance_no  || "",
        asset_id:        editData.asset_id         || raw.asset_id         || "",
        asset_name:      editData.asset_name       || raw.asset_name       || "",
        asset_type:      editData.type             || raw.asset_type       || "",
        department:      editData.dept             || raw.department       || "",
        scheduled_date:  editData.scheduled_date   || raw.scheduled_date   || "",
        technician:      editData.technician       || raw.technician       || "",
        estimated_cost:  editData.cost             || raw.estimated_cost   || "",
      }));
    }
  }, [isEdit]);

  const btn      = BTN[status] || BTN[""];
  const isLocked = ["Completed"].includes(status);
  const delay    = () => new Promise((r) => setTimeout(r, 400));
  const f        = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSaveDraft  = async (e) => { e.preventDefault(); setSaving(true); try { await delay(); setStatus("Draft");       } finally { setSaving(false); } };
  const handleSchedule   = async (e) => { e.preventDefault(); setSaving(true); try { await delay(); setStatus("Scheduled");   } finally { setSaving(false); } };
  const handleStart      = async (e) => { e.preventDefault(); setSaving(true); try { await delay(); setStatus("In Progress"); } finally { setSaving(false); } };
  const handleComplete   = async (e) => { e.preventDefault(); setSaving(true); try { await delay(); setStatus("Completed");   } finally { setSaving(false); } };
  const handleSendBack   = async (e) => { e.preventDefault(); setSaving(true); try { await delay(); setStatus("Draft");       } finally { setSaving(false); } };
  const handleClose      = (e) => { e.preventDefault(); setCurrentPage("assetMaintenance"); };

  const deletePart = (id) => setParts((p) => p.filter((l) => l.id !== id));
  const addPart    = () => setParts((p) => [...p, { id: Date.now(), part_no: "", name: "", qty: "", unit: "", unit_cost: "", total: "" }]);

  const statusColor = {
    Draft:         "rgba(255,214,56,1)",
    Scheduled:     "rgba(140,180,255,1)",
    "In Progress": "rgba(255,175,56,1)",
    Completed:     "rgba(140,216,188,1)",
    Overdue:       "rgba(255,77,79,0.3)",
  };
  const statusTextColor = { Completed: "#065f46" };

  return (
    <div className="aam-container">
      {/* Header */}
      <div className="aam-head">
        <p>New Asset Maintenance Record
          {status && (
            <span style={{ marginLeft: 12, fontSize: 13, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
              background: statusColor[status] || "#eee", color: statusTextColor[status] || "#1a1a2e" }}>
              Status: {status}
            </span>
          )}
        </p>
        <button className="aam-close-btn" onClick={handleClose}>
          <svg className="aam-close-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/>
          </svg>
          <span>Close</span>
        </button>
      </div>

      {/* ── Section 1: Asset Info ── */}
      <p className="aam-section-title">Asset Information</p>
      <div className="aam-grid">
        <div className="aam-field">
          <label>Maintenance No.</label>
          <input placeholder="Auto-generate (e.g., AMR-2025-001)" value={form.maintenance_no} disabled />
        </div>
        <SearchDropdown label="Asset ID / Name" required value={form.asset_id}
          onChange={(v) => {
            const name = v.includes("—") ? v.split("—")[1].trim() : "";
            const id   = v.includes("—") ? v.split("—")[0].trim() : v;
            setForm((p) => ({ ...p, asset_id: id, asset_name: name }));
          }}
          options={ASSET_OPTIONS} placeholder="e.g., AST-001" disabled={isLocked} />
      </div>
      <div className="aam-grid">
        <div className="aam-field">
          <label>Asset Name</label>
          <input placeholder="Auto-filled from Asset ID" value={form.asset_name} disabled />
        </div>
        <div className="aam-field">
          <label>Asset Type / Category</label>
          <input placeholder="e.g., Generator, HVAC, Forklift" value={form.asset_type} onChange={f("asset_type")} disabled={isLocked} />
        </div>
      </div>
      <div className="aam-grid">
        <div className="aam-field">
          <label>Location</label>
          <input placeholder="e.g., Block A - Floor 2" value={form.location} onChange={f("location")} disabled={isLocked} />
        </div>
        <SearchDropdown label="Department" required value={form.department}
          onChange={(v) => setForm((p) => ({ ...p, department: v }))}
          options={DEPT_OPTIONS} placeholder="e.g., Production" disabled={isLocked} />
      </div>

      {/* ── Section 2: Maintenance Details ── */}
      <p className="aam-section-title">Maintenance Details</p>
      <div className="aam-grid">
        <SearchDropdown label="Maintenance Type" required value={form.maintenance_type}
          onChange={(v) => setForm((p) => ({ ...p, maintenance_type: v }))}
          options={TYPE_OPTIONS} placeholder="e.g., Preventive" disabled={isLocked} />
        <SearchDropdown label="Priority" required value={form.priority}
          onChange={(v) => setForm((p) => ({ ...p, priority: v }))}
          options={PRIORITY_OPTIONS} placeholder="e.g., High" disabled={isLocked} />
      </div>
      <div className="aam-grid">
        <div className="aam-field" style={{ gridColumn: "span 2" }}>
          <label>Description / Scope of Work<sup>*</sup></label>
          <textarea rows={3} placeholder="Describe the maintenance work to be performed..." value={form.description} onChange={f("description")} disabled={isLocked} />
        </div>
      </div>
      <div className="aam-grid">
        <div className="aam-field">
          <label>Scheduled Date<sup>*</sup></label>
          <input type="date" value={form.scheduled_date} onChange={f("scheduled_date")} disabled={isLocked} />
        </div>
        <div className="aam-field">
          <label>Completion Date</label>
          <input type="date" value={form.completion_date} onChange={f("completion_date")} disabled={isLocked} />
        </div>
      </div>
      <div className="aam-grid">
        <div className="aam-field">
          <label>Next Due Date</label>
          <input type="date" value={form.next_due_date} onChange={f("next_due_date")} disabled={isLocked} />
        </div>
        <div className="aam-field" />
      </div>

      {/* ── Section 3: Technician & Vendor ── */}
      <p className="aam-section-title">Technician & Vendor</p>
      <div className="aam-grid">
        <SearchDropdown label="Assigned Technician" required value={form.technician}
          onChange={(v) => setForm((p) => ({ ...p, technician: v }))}
          options={TECHNICIAN_OPTIONS} placeholder="e.g., Ramesh K" disabled={isLocked} />
        <SearchDropdown label="External Vendor (if any)" value={form.vendor}
          onChange={(v) => setForm((p) => ({ ...p, vendor: v }))}
          options={VENDOR_OPTIONS} placeholder="e.g., ABC Services Pvt Ltd" disabled={isLocked} />
      </div>

      {/* ── Section 4: Cost & Approval ── */}
      <p className="aam-section-title">Cost & Approval</p>
      <div className="aam-grid">
        <div className="aam-field">
          <label>Estimated Cost (₹)<sup>*</sup></label>
          <input type="number" min="0" placeholder="e.g., 5000.00" value={form.estimated_cost} onChange={f("estimated_cost")} disabled={isLocked} />
        </div>
        <div className="aam-field">
          <label>Actual Cost (₹)</label>
          <input type="number" min="0" placeholder="Filled on completion" value={form.actual_cost} onChange={f("actual_cost")} disabled={isLocked} />
        </div>
      </div>
      <div className="aam-grid">
        <div className="aam-field">
          <label>Approved By</label>
          <input placeholder="Auto-linked (e.g., MGR-2025-045)" value={form.approved_by} disabled />
        </div>
        <div className="aam-field">
          <label>Status</label>
          <input placeholder="Read-only (e.g., Draft / Scheduled / Completed)" value={status} disabled />
        </div>
      </div>
      <div className="aam-grid">
        <div className="aam-field" style={{ gridColumn: "span 2" }}>
          <label>Remarks</label>
          <textarea rows={2} placeholder="Any additional remarks or special instructions..." value={form.remarks} onChange={f("remarks")} disabled={isLocked} />
        </div>
      </div>

      {/* ── Section 5: Parts / Materials Used ── */}
      <div className="aam-line-section">
        <p className="aam-section-title">Parts / Materials Used</p>
        <div className="aam-line-table-wrap">
          <table className="aam-line-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Part No.</th>
                <th>Part Name / Description</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Unit Cost (₹)</th>
                <th>Total (₹)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {parts.map((l, i) => (
                <tr key={l.id}>
                  <td>{i + 1}</td>
                  <td>{l.part_no  || <input placeholder="PRT-..."   style={{ border: "1px solid #ddd", borderRadius: 6, padding: "4px 8px", fontSize: 13, width: 90  }} />}</td>
                  <td>{l.name     || <input placeholder="Part name..." style={{ border: "1px solid #ddd", borderRadius: 6, padding: "4px 8px", fontSize: 13, width: 150 }} />}</td>
                  <td>{l.qty      || <input type="number" placeholder="0" style={{ border: "1px solid #ddd", borderRadius: 6, padding: "4px 8px", fontSize: 13, width: 60  }} />}</td>
                  <td>{l.unit     || <input placeholder="Nos"        style={{ border: "1px solid #ddd", borderRadius: 6, padding: "4px 8px", fontSize: 13, width: 60  }} />}</td>
                  <td>{l.unit_cost|| <input type="number" placeholder="0.00" style={{ border: "1px solid #ddd", borderRadius: 6, padding: "4px 8px", fontSize: 13, width: 90  }} />}</td>
                  <td>{l.total    || <input type="number" placeholder="0.00" style={{ border: "1px solid #ddd", borderRadius: 6, padding: "4px 8px", fontSize: 13, width: 90  }} />}</td>
                  <td>
                    <button className="aam-delete-btn" onClick={() => deletePart(l.id)} disabled={isLocked} title="Remove">🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isLocked && (
          <button className="aam-add-item-btn" onClick={addPart}>+ Add Part / Material</button>
        )}
      </div>

      {/* ── Tabs: Comments / History / Attachments ── */}
      <div className="aam-hub-container">
        <div className="aam-hub-head">
          {["Comments", "History", "Attachments"].map((tab) => (
            <p key={tab} className={activeTab === tab ? "aam-tab-active" : ""} onClick={() => setActiveTab(tab)}>{tab}</p>
          ))}
        </div>
        <div className="aam-hub-body">
          {activeTab === "Comments"    && <AssetMaintenanceComment    recordId={recordId} apiProvider={null} />}
          {activeTab === "History"     && <AssetMaintenanceHistory    recordId={recordId} apiProvider={null} />}
          {activeTab === "Attachments" && <AssetMaintenanceAttachment recordId={recordId} apiProvider={null} />}
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="aam-btn-container">
        <button className="aam-btn aam-btn-cancel" onClick={handleClose}>Cancel</button>
        <div className="aam-btn-right">
          <button className="aam-btn aam-btn-draft"    onClick={handleSaveDraft} disabled={!btn.draft    || saving}>{saving ? "Saving..." : "Save Draft"}</button>
          <button className="aam-btn aam-btn-schedule" onClick={handleSchedule}  disabled={!btn.schedule || saving}>Schedule</button>
          <button className="aam-btn aam-btn-start"    onClick={handleStart}     disabled={!btn.start    || saving}>Start Work</button>
          <button className="aam-btn aam-btn-complete" onClick={handleComplete}  disabled={!btn.complete || saving}>Mark Complete</button>
          <button className="aam-btn aam-btn-sendback" onClick={handleSendBack}  disabled={!btn.sendback || saving}>Send Back</button>
          <button className="aam-icon-btn" disabled={!recordId || status === "" || status === "Draft"} title="Download PDF">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M0.600098 2.4C0.600098 1.76348 0.852954 1.15303 1.30304 0.702944C1.75313 0.252856 2.36358 0 3.0001 0L16.1313 0L21.4001 5.2688V21.6C21.4001 22.2365 21.1472 22.847 20.6972 23.2971C20.2471 23.7471 19.6366 24 19.0001 24H3.0001C2.36358 24 1.75313 23.7471 1.30304 23.2971C0.852954 22.847 0.600098 22.2365 0.600098 21.6V2.4ZM4.6001 9.6H2.2001V17.6H3.8001V14.4H4.6001C5.23662 14.4 5.84707 14.1471 6.29715 13.6971C6.74724 13.247 7.0001 12.6365 7.0001 12C7.0001 11.3635 6.74724 10.753 6.29715 10.3029C5.84707 9.85286 5.23662 9.6 4.6001 9.6ZM11.0001 9.6H8.6001V17.6H11.0001C11.6366 17.6 12.2471 17.3471 12.6972 16.8971C13.1472 16.447 13.4001 15.8365 13.4001 15.2V12C13.4001 11.3635 13.1472 10.753 12.6972 10.3029C12.2471 9.85286 11.6366 9.6 11.0001 9.6ZM15.0001 17.6V9.6H19.8001V11.2H16.6001V12.8H18.2001V14.4H16.6001V17.6H15.0001Z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
