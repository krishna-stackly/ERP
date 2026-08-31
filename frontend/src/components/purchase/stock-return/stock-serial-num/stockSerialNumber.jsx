// import React, { useState, useEffect } from "react";
// import "./stockSerialNumber.css";

// export default function stockSerialNumber({ setStockDim }) {
//   const [importBox, setImportBox] = useState(false);

//   const [serialInp, setSerialInp] = useState({
//     stock_dim: "",
//     serial_no: "",
//     import_serial: "",
//   });

//   const handelSerialChange = (e) => {
//     setSerialInp((prev) => {
//       return { ...prev, [e.target.id]: e.target.value };
//     });
//   };

//   return (
//     <>
//       <div className="createNewStockSerial-container">
//         <h3>Generate Serial Numbers</h3>
//         <div className="createNewStockSerial-input-container">
//           <div>
//             <label htmlFor="product_name">Product Name</label>
//             <input id="product_name" disabled />
//           </div>
//           <div>
//             <label htmlFor="product_id">Product ID</label>
//             <input id="product_id" disabled />
//           </div>
//           <div>
//             <label htmlFor="uom">UOM</label>
//             <input id="uom" disabled />
//           </div>
//           <div>
//             <label htmlFor="stock_dim">Stock Dim.</label>
//             <select
//               id="stock_dim"
//               value={serialInp.stock_dim}
//               onChange={() => {
//                 handelSerialChange;
//                 setStockDim({
//                   serialBox: false,
//                   batchBox: true,
//                 });
//               }}
//             >
//               <option value="Serial">Serial</option>
//               <option value="Batch">Batch</option>
//             </select>
//           </div>
//           <div>
//             <label htmlFor="qty_received">Qty Received</label>
//             <input id="qty_received" disabled />
//           </div>
//           <div>
//             <label htmlFor="accepted_qty">Accepted Qty</label>
//             <input id="accepted_qty" disabled />
//           </div>
//           <div>
//             <label htmlFor="serials_generated">Serials Generated</label>
//             <input id="serials_generated" disabled />
//           </div>
//         </div>
//         <div className="createNewStockSerial-division">
//           <nav>
//             <form className="createNewStockSerial-serial-inp">
//               <div className="createNewStockSerial-serial-inp-box">
//                 <label htmlFor="serial_no">Serial No :</label>
//                 <input
//                   value={serialInp.serial_no}
//                   onChange={handelSerialChange}
//                   type="text"
//                   id="serial_no"
//                   placeholder="Enter Serial Number"
//                 />
//               </div>
//               <button
//                 className={
//                   serialInp.serial_no === ""
//                     ? "createNewStockSerial-serial-inactive"
//                     : "createNewStockSerial-serial-active"
//                 }
//                 disabled={serialInp.serial_no === ""}
//               >
//                 Add Serial
//               </button>
//             </form>
//             <p
//               className={`createNewStockSerial-imp-serialnum ${
//                 importBox === false
//                   ? "createNewStockSerial-imp-serialnum-blue"
//                   : "createNewStockSerial-imp-serialnum-black"
//               }`}
//               onClick={() => setImportBox(!importBox)}
//             >
//               Import Serial Numbers
//             </p>
//             {importBox && (
//               <form className="createNewStockSerial-serial-inp">
//                 <div className="createNewStockSerial-serial-inp-box">
//                   <textarea
//                     value={serialInp.import_serial}
//                     onChange={handelSerialChange}
//                     id="import_serial"
//                     type="text"
//                     placeholder="Enter Serial Numbers (eg., Item-001, Item-002, etc.)"
//                   />
//                 </div>
//                 <button
//                   className={
//                     serialInp.import_serial === ""
//                       ? "createNewStockSerial-serial-inactive"
//                       : "createNewStockSerial-serial-active"
//                   }
//                   disabled={serialInp.import_serial === ""}
//                 >
//                   Import
//                 </button>
//               </form>
//             )}

//             <p className="createNewStockSerial-duplicate-tit">
//               Duplicate Numbers
//             </p>
//             <textarea
//               className="createNewStockSerial-duplicate-box"
//               placeholder="Not found"
//               disabled
//             />
//           </nav>
//           <div className="createNewStockSerial-table">
//             <table>
//               <thead className="createNewStockSerial-table-head">
//                 <tr>
//                   <th>S.No</th>
//                   <th>
//                     <pre>Serial No</pre>
//                   </th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody className="createNewStockSerial-table-body">
//                 <tr>
//                   <td>1</td>
//                   <td>UK-001</td>
//                   <td>
//                     <svg
//                       style={{ cursor: "pointer" }}
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="14"
//                       height="14"
//                       viewBox="0 0 16 16"
//                       fill="none"
//                     >
//                       <path
//                         d="M3.55729 16C3.0684 16 2.65003 15.8261 2.30218 15.4782C1.95433 15.1304 1.78011 14.7117 1.77951 14.2222V2.66667H0.890625V0.888889H5.33507V0H10.6684V0.888889H15.1128V2.66667H14.224V14.2222C14.224 14.7111 14.05 15.1298 13.7022 15.4782C13.3543 15.8267 12.9357 16.0006 12.4462 16H3.55729ZM5.33507 12.4444H7.11284V4.44444H5.33507V12.4444ZM8.89062 12.4444H10.6684V4.44444H8.89062V12.4444Z"
//                         fill="#234E70"
//                       />
//                     </svg>
//                   </td>
//                 </tr>
//                 <tr>
//                   <td>1</td>
//                   <td>UK-001</td>
//                   <td>D</td>
//                 </tr>
//                 <tr>
//                   <td>1</td>
//                   <td>UK-001</td>
//                   <td>D</td>
//                 </tr>
//                 <tr>
//                   <td>1</td>
//                   <td>UK-001</td>
//                   <td>D</td>
//                 </tr>
//                 <tr>
//                   <td>1</td>
//                   <td>UK-001</td>
//                   <td>D</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//         <div className="createNewStockSerial-btn-container">
//           <button
//             className="createNewStockSerial-cancel-btn"
//             onClick={() => {
//               setStockDim({ serialBox: false });
//             }}
//           >
//             Cancel
//           </button>
//           <button className="createNewStockSerial-inactive-btn">Apply</button>
//         </div>
//       </div>
//     </>
//   );
// }
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

// ─── Props ────────────────────────────────────────────────────────────────────
// rowData        : full line-item object (all_serials, selected_serials, return_qty)
// onConfirm      : (newSelectedIds: number[]) => void
// onClose        : () => void
// disabled       : boolean
// ─────────────────────────────────────────────────────────────────────────────

const S = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99999,
    padding: "20px",
    boxSizing: "border-box",
  },
  modal: {
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
    width: "100%",
    maxWidth: "520px",
    maxHeight: "85vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxSizing: "border-box",
  },
  header: {
    padding: "18px 24px 14px",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: "16px",
    fontWeight: 700,
    color: "rgba(35,78,112,1)",
    margin: 0,
  },
  closeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    borderRadius: "4px",
  },
  meta: {
    padding: "10px 24px",
    display: "flex",
    gap: "24px",
    background: "rgba(242,246,250,1)",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
    fontSize: "13px",
    color: "#555",
  },
  metaItem: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  metaLabel: {
    fontSize: "11px",
    fontWeight: 600,
    color: "rgba(35,78,112,0.7)",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
  },
  metaValue: {
    fontSize: "14px",
    fontWeight: 600,
    color: "rgba(35,78,112,1)",
  },
  body: {
    flex: 1,
    overflowY: "auto",
    padding: "16px 24px",
  },
  sectionLabel: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "10px",
  },
  chipGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  chip: (selected, disabled) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    borderRadius: "20px",
    border: `1.5px solid ${selected ? "rgba(35,78,112,1)" : "#ddd"}`,
    background: selected ? "rgba(35,78,112,0.08)" : "#fff",
    color: selected ? "rgba(35,78,112,1)" : "#555",
    fontSize: "13px",
    fontWeight: selected ? 600 : 400,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    transition: "all 0.15s ease",
    userSelect: "none",
  }),
  chipDot: (selected) => ({
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: selected ? "rgba(35,78,112,1)" : "#ccc",
    transition: "background 0.15s",
  }),
  emptyMsg: {
    textAlign: "center",
    color: "#bbb",
    fontSize: "13px",
    padding: "32px 0",
  },
  footer: {
    padding: "14px 24px",
    borderTop: "1px solid rgba(0,0,0,0.08)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerHint: {
    fontSize: "12px",
    color: "#aaa",
  },
  footerBtns: {
    display: "flex",
    gap: "10px",
  },
  cancelBtn: {
    padding: "7px 20px",
    borderRadius: "7px",
    border: "1.5px solid rgba(35,78,112,1)",
    color: "rgba(35,78,112,1)",
    fontSize: "13px",
    fontWeight: 600,
    background: "#fff",
    cursor: "pointer",
  },
  confirmBtn: (disabled) => ({
    padding: "7px 20px",
    borderRadius: "7px",
    border: "1.5px solid " + (disabled ? "#ccc" : "rgba(35,78,112,1)"),
    background: disabled ? "#f5f5f5" : "rgba(35,78,112,1)",
    color: disabled ? "#aaa" : "#fff",
    fontSize: "13px",
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
  }),
};

export default function ReturnSerialModal({ rowData, onConfirm, onClose, disabled = false }) {
  const allSerials     = rowData.all_serials      || [];
  const initialSelected = rowData.selected_serials || [];
  const maxReturn      = parseInt(rowData.return_qty) || 0;

  const [draft, setDraft] = useState([...initialSelected]);

  // Sync when rowData changes (e.g. return_qty updated while modal open)
  useEffect(() => {
    setDraft((prev) => prev.slice(0, maxReturn));
  }, [maxReturn]);

  const toggle = (id) => {
    if (disabled) return;
    setDraft((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= maxReturn) return prev;
      return [...prev, id];
    });
  };

  const handleConfirm = () => {
    onConfirm(draft);
    onClose();
  };

  const isOverLimit = draft.length > maxReturn;
  const canConfirm  = !disabled && !isOverLimit && maxReturn > 0;

  const modal = (
    <div style={S.overlay} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={S.modal}>

        {/* Header */}
        <div style={S.header}>
          <h3 style={S.title}>Select Serial Numbers to Return</h3>
          <button type="button" style={S.closeBtn} onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 384 512" fill="#999">
              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
            </svg>
          </button>
        </div>

        {/* Meta */}
        <div style={S.meta}>
          <div style={S.metaItem}>
            <span style={S.metaLabel}>Product</span>
            <span style={S.metaValue}>{rowData.product_name || "—"}</span>
          </div>
          <div style={S.metaItem}>
            <span style={S.metaLabel}>Return Qty</span>
            <span style={S.metaValue}>{maxReturn}</span>
          </div>
          <div style={S.metaItem}>
            <span style={S.metaLabel}>Selected</span>
            <span style={{ ...S.metaValue, color: isOverLimit ? "#e53e3e" : "rgba(34,197,94,1)" }}>
              {draft.length} / {maxReturn}
            </span>
          </div>
        </div>

        {/* Body */}
        <div style={S.body}>
          {maxReturn === 0 && (
            <p style={{ ...S.emptyMsg, color: "#e53e3e" }}>
              Set a Return Qty greater than 0 before selecting serials.
            </p>
          )}

          {allSerials.length === 0 && maxReturn > 0 && (
            <p style={S.emptyMsg}>No serial numbers available for this item.</p>
          )}

          {allSerials.length > 0 && (
            <>
              <p style={S.sectionLabel}>
                Available &amp; Selected Serials ({allSerials.length} total)
              </p>
              <div style={S.chipGrid}>
                {allSerials.map((s) => {
                  const isSelected = draft.includes(s.id);
                  const isDisabled = disabled || (!isSelected && draft.length >= maxReturn);
                  return (
                    <div
                      key={s.id}
                      style={S.chip(isSelected, isDisabled)}
                      onClick={() => toggle(s.id)}
                      title={isDisabled && !isSelected ? `Max ${maxReturn} serials allowed` : ""}
                    >
                      <span style={S.chipDot(isSelected)} />
                      {s.serial_no}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {isOverLimit && (
            <p style={{ color: "#e53e3e", fontSize: "12px", marginTop: "10px" }}>
              ⚠ Selected serials exceed the return quantity ({maxReturn})
            </p>
          )}
        </div>

        {/* Footer */}
        <div style={S.footer}>
          <span style={S.footerHint}>
            {maxReturn > 0
              ? `Choose up to ${maxReturn} serial${maxReturn !== 1 ? "s" : ""}`
              : "No return qty set"}
          </span>
          <div style={S.footerBtns}>
            <button type="button" style={S.cancelBtn} onClick={onClose}>Cancel</button>
            <button
              type="button"
              style={S.confirmBtn(!canConfirm)}
              disabled={!canConfirm}
              onClick={handleConfirm}
            >
              Confirm ({draft.length})
            </button>
          </div>
        </div>

      </div>
    </div>
  );

  return createPortal(modal, document.body);
}