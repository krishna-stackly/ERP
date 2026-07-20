// import React, { useState } from "react";
// import "./createNewStockReturn.css";

// // ─── Props ────────────────────────────────────────────────────────────────────
// // index        : row number (1-based)
// // rowData      : {
// //   id, product_name, product_id, uom,
// //   qty_ordered, rejected_qty, return_qty,
// //   unit_price, tax_rate, discount_rate,
// //   return_reason,
// //   selected_serials : number[]   (array of serial ids currently selected)
// //   available_serials: [{id, serial_no}]
// //   all_serials      : [{id, serial_no}]  (selected + available combined)
// // }
// // buttonAcs    : boolean — true = all inputs disabled (Submitted / Cancelled)
// // onFieldChange: (rowId, field, value) => void
// // ─────────────────────────────────────────────────────────────────────────────
// export default function ReturnListItem({ index, rowData, buttonAcs, onFieldChange }) {
//   const [showSerialModal, setShowSerialModal] = useState(false);

//   // Local draft selection state inside the modal
//   const [draftSelected, setDraftSelected] = useState([]);

//   // ── computed line total ────────────────────────────────────────────────────
//   const qty      = parseFloat(rowData.return_qty)    || 0;
//   const price    = parseFloat(rowData.unit_price)    || 0;
//   const tax      = parseFloat(rowData.tax_rate)      || 0;
//   const discount = parseFloat(rowData.discount_rate) || 0;

//   const lineTotal       = qty * price;
//   const afterDiscount   = lineTotal - (lineTotal * discount) / 100;
//   const total           = afterDiscount + (afterDiscount * tax) / 100;

//   // ── serial helpers ─────────────────────────────────────────────────────────
//   const allSerials      = rowData.all_serials       || [];
//   const selectedSerials = rowData.selected_serials  || [];
//   const maxReturn       = parseFloat(rowData.return_qty) || 0;

//   const openSerialModal = () => {
//     setDraftSelected([...selectedSerials]);
//     setShowSerialModal(true);
//   };

//   const toggleSerial = (id) => {
//     setDraftSelected((prev) => {
//       if (prev.includes(id)) return prev.filter((s) => s !== id);
//       if (prev.length >= maxReturn) return prev; // cap at return_qty
//       return [...prev, id];
//     });
//   };

//   const confirmSerials = () => {
//     onFieldChange(rowData.id, "selected_serials", draftSelected);
//     setShowSerialModal(false);
//   };

//   // ── label shown on the serial button ──────────────────────────────────────
//   const serialLabel =
//     selectedSerials.length > 0
//       ? `${selectedSerials.length} selected`
//       : "Select Serials";

//   // ── render ─────────────────────────────────────────────────────────────────
//   return (
//     <>
//       <tr>
//         {/* # */}
//         <td>{index}</td>

//         {/* Product Name */}
//         <td>{rowData.product_name || "—"}</td>

//         {/* Product ID */}
//         <td>{rowData.product_id || "—"}</td>

//         {/* UOM */}
//         <td><pre>{rowData.uom || "—"}</pre></td>

//         {/* Qty Ordered */}
//         <td>{rowData.qty_ordered}</td>

//         {/* Rejected Qty */}
//         <td>{rowData.rejected_qty}</td>

//         {/* Return Qty */}
//         <td>
//           <input
//             type="number"
//             min={0}
//             max={rowData.rejected_qty}
//             value={rowData.return_qty}
//             onChange={(e) => onFieldChange(rowData.id, "return_qty", e.target.value)}
//             disabled={buttonAcs}
//             style={{ width: "70px" }}
//           />
//         </td>

//         {/* Serial Nos */}
//         <td>
//           {allSerials.length > 0 ? (
//             <button
//               type="button"
//               style={{ width: "max-content" }}
//               onClick={openSerialModal}
//               disabled={buttonAcs || maxReturn === 0}
//             >
//               {serialLabel}
//             </button>
//           ) : (
//             <span style={{ color: "#999", fontSize: "13px" }}>N/A</span>
//           )}
//         </td>

//         {/* Return Reason */}
//         <td>
//           <input
//             type="text"
//             value={rowData.return_reason}
//             onChange={(e) => onFieldChange(rowData.id, "return_reason", e.target.value)}
//             disabled={buttonAcs}
//             placeholder="Enter return reason..."
//             style={{ minWidth: "160px" }}
//           />
//         </td>

//         {/* Unit Price */}
//         <td>{parseFloat(rowData.unit_price || 0).toFixed(2)}</td>

//         {/* Tax % */}
//         <td>{rowData.tax_rate}</td>

//         {/* Discount % */}
//         <td>{rowData.discount_rate}</td>

//         {/* Total */}
//         <td>{total.toFixed(2)}</td>

//         {/* Action — no delete for loaded GRN items in this flow */}
//         <td>
//           <svg
//             className={`createNewReturn-table-delete-logo ${buttonAcs ? "disabled" : ""}`}
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 14 16"
//             style={{ opacity: 0.3, cursor: "not-allowed" }}
//             title="GRN items cannot be removed"
//           >
//             <path d="M2.625 16C2.14375 16 1.73192 15.8261 1.3895 15.4782C1.04708 15.1304 0.875583 14.7117 0.875 14.2222V2.66667H0V0.888889H4.375V0H9.625V0.888889H14V2.66667H13.125V14.2222C13.125 14.7111 12.9538 15.1298 12.6114 15.4782C12.269 15.8267 11.8568 16.0006 11.375 16H2.625ZM4.375 12.4444H6.125V4.44444H4.375V12.4444ZM7.875 12.4444H9.625V4.44444H7.875V12.4444Z" />
//           </svg>
//         </td>
//       </tr>

//       {/* ── SERIAL SELECTION MODAL ── */}
//       {showSerialModal && (
//         <tr>
//           <td colSpan={14} style={{ padding: 0 }}>
//             <div className="stockReturn-delete-modal" style={{ maxWidth: "480px", width: "100%", height: "auto", minHeight: "unset", paddingBottom: "16px" }}>

//               {/* close */}
//               <svg
//                 className="stockReturn-close-icon"
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 384 512"
//                 onClick={() => setShowSerialModal(false)}
//                 style={{ cursor: "pointer" }}
//               >
//                 <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
//               </svg>

//               <div className="stockReturn-modal-head">
//                 <p>Select Serial Numbers</p>
//               </div>

//               <div className="stockReturn-modal-body" style={{ padding: "12px 20px", height: "auto" }}>
//                 <p style={{ marginBottom: "8px", fontSize: "13px", color: "#555" }}>
//                   Select up to <strong>{maxReturn}</strong> serials
//                   &nbsp;({draftSelected.length} selected)
//                 </p>

//                 <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", maxHeight: "200px", overflowY: "auto" }}>
//                   {allSerials.map((s) => {
//                     const isSelected = draftSelected.includes(s.id);
//                     const isDisabled = !isSelected && draftSelected.length >= maxReturn;
//                     return (
//                       <label
//                         key={s.id}
//                         style={{
//                           display: "flex", alignItems: "center", gap: "4px",
//                           padding: "4px 10px",
//                           borderRadius: "4px",
//                           border: `1px solid ${isSelected ? "#234E70" : "#ccc"}`,
//                           background: isSelected ? "#e8f0fe" : "#fff",
//                           cursor: isDisabled ? "not-allowed" : "pointer",
//                           opacity: isDisabled ? 0.5 : 1,
//                           fontSize: "13px",
//                         }}
//                       >
//                         <input
//                           type="checkbox"
//                           checked={isSelected}
//                           disabled={isDisabled}
//                           onChange={() => toggleSerial(s.id)}
//                           style={{ accentColor: "#234E70" }}
//                         />
//                         {s.serial_no}
//                       </label>
//                     );
//                   })}
//                 </div>

//                 <div className="stockReturn-modal-actions" style={{ justifyContent: "center", gap: "14px", marginTop: "16px" }}>
//                   <button
//                     type="button"
//                     className="stockReturn-cancel-btn"
//                     onClick={() => setShowSerialModal(false)}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="button"
//                     className="stockReturn-delete-btn"
//                     style={{ background: "#234E70" }}
//                     onClick={confirmSerials}
//                   >
//                     Confirm
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </td>
//         </tr>
//       )}
//     </>
//   );
// }
import React, { useState } from "react";
import "./createNewStockReturn.css";
import ReturnSerialModal from "./stock-serial-num/stockSerialNumber"

// ─── Props ────────────────────────────────────────────────────────────────────
// index        : row number (1-based)
// rowData      : {
//   id, product_name, product_id, uom,
//   qty_ordered, rejected_qty, return_qty,
//   unit_price, tax_rate, discount_rate,
//   return_reason,
//   selected_serials : number[]          — IDs of serials chosen to return
//   available_serials: [{id, serial_no}] — serials still in stock (not yet returned)
//   all_serials      : [{id, serial_no}] — selected + available combined
// }
// buttonAcs    : boolean — true = all inputs disabled (Submitted / Cancelled)
// onFieldChange: (rowId, field, value) => void
// ─────────────────────────────────────────────────────────────────────────────
export default function ReturnListItem({ index, rowData, buttonAcs, onFieldChange }) {
  const [showSerialModal, setShowSerialModal] = useState(false);

  // ── computed line total ────────────────────────────────────────────────────
  const qty      = parseFloat(rowData.return_qty)    || 0;
  const price    = parseFloat(rowData.unit_price)    || 0;
  const tax      = parseFloat(rowData.tax_rate)      || 0;
  const discount = parseFloat(rowData.discount_rate) || 0;

  const lineTotal     = qty * price;
  const afterDiscount = lineTotal - (lineTotal * discount) / 100;
  const total         = afterDiscount + (afterDiscount * tax) / 100;

  // ── serial helpers ─────────────────────────────────────────────────────────
  const allSerials      = rowData.all_serials      || [];
  const selectedSerials = rowData.selected_serials || [];
  const maxReturn       = parseInt(rowData.return_qty) || 0;

  const hasSerials = allSerials.length > 0;

  const handleSerialConfirm = (newIds) => {
    onFieldChange(rowData.id, "selected_serials", newIds);
  };

  // ── return qty change — auto-trim serials if qty reduced ──────────────────
  const handleReturnQtyChange = (e) => {
    const newQty = parseInt(e.target.value) || 0;
    const trimmed = selectedSerials.slice(0, newQty);
    onFieldChange(rowData.id, "return_qty", e.target.value);
    if (trimmed.length < selectedSerials.length) {
      onFieldChange(rowData.id, "selected_serials", trimmed);
    }
  };

  // ── label on serial button ─────────────────────────────────────────────────
  const serialLabel =
    selectedSerials.length > 0
      ? `${selectedSerials.length} selected`
      : allSerials.length > 0
      ? "Select Serials"
      : "N/A";

  const serialBtnStyle = {
    padding: "4px 10px",
    borderRadius: "5px",
    border: selectedSerials.length > 0
      ? "1.5px solid rgba(35,78,112,1)"
      : "1.5px solid #ccc",
    background: selectedSerials.length > 0
      ? "rgba(35,78,112,0.08)"
      : "#fff",
    color: selectedSerials.length > 0
      ? "rgba(35,78,112,1)"
      : "#666",
    fontSize: "12px",
    fontWeight: selectedSerials.length > 0 ? 600 : 400,
    cursor: (buttonAcs || maxReturn === 0 || !hasSerials) ? "not-allowed" : "pointer",
    whiteSpace: "nowrap",
    opacity: (buttonAcs || !hasSerials) ? 0.5 : 1,
  };

  return (
    <>
      <tr>
        {/* # */}
        <td>{index}</td>

        {/* Product Name */}
        <td>{rowData.product_name || "—"}</td>

        {/* Product ID */}
        <td>{rowData.product_id || "—"}</td>

        {/* UOM */}
        <td><pre>{rowData.uom || "—"}</pre></td>

        {/* Qty Ordered */}
        <td>{rowData.qty_ordered}</td>

        {/* Rejected Qty */}
        <td>{rowData.rejected_qty}</td>

        {/* Return Qty */}
        <td>
          <input
            type="number"
            min={0}
            max={rowData.rejected_qty}
            value={rowData.return_qty}
            onChange={handleReturnQtyChange}
            disabled={buttonAcs}
            style={{ width: "70px" }}
          />
        </td>

        {/* Serial Nos */}
        <td>
          {hasSerials ? (
            <button
              type="button"
              style={serialBtnStyle}
              onClick={() => setShowSerialModal(true)}
              disabled={buttonAcs || maxReturn === 0}
              title={
                maxReturn === 0
                  ? "Set a return qty first"
                  : buttonAcs
                  ? "View only"
                  : `${allSerials.length} serial(s) available`
              }
            >
              {serialLabel}
            </button>
          ) : (
            <span style={{ color: "#bbb", fontSize: "12px" }}>N/A</span>
          )}
        </td>

        {/* Return Reason */}
        <td>
          <input
            type="text"
            value={rowData.return_reason}
            onChange={(e) => onFieldChange(rowData.id, "return_reason", e.target.value)}
            disabled={buttonAcs}
            placeholder="Enter reason..."
            style={{ minWidth: "150px" }}
          />
        </td>

        {/* Unit Price */}
        <td>{parseFloat(rowData.unit_price || 0).toFixed(2)}</td>

        {/* Tax % */}
        <td>{rowData.tax_rate}</td>

        {/* Discount % */}
        <td>{rowData.discount_rate}</td>

        {/* Total */}
        <td>{total.toFixed(2)}</td>

        {/* Action */}
        <td>
          <svg
            className={`createNewReturn-table-delete-logo ${buttonAcs ? "disabled" : ""}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 14 16"
            style={{ opacity: 0.3, cursor: "not-allowed" }}
            title="GRN items cannot be removed"
          >
            <path d="M2.625 16C2.14375 16 1.73192 15.8261 1.3895 15.4782C1.04708 15.1304 0.875583 14.7117 0.875 14.2222V2.66667H0V0.888889H4.375V0H9.625V0.888889H14V2.66667H13.125V14.2222C13.125 14.7111 12.9538 15.1298 12.6114 15.4782C12.269 15.8267 11.8568 16.0006 11.375 16H2.625ZM4.375 12.4444H6.125V4.44444H4.375V12.4444ZM7.875 12.4444H9.625V4.44444H7.875V12.4444Z" />
          </svg>
        </td>
      </tr>

      {/* ── SERIAL SELECTION MODAL (portal — renders outside table) ── */}
      {showSerialModal && (
        <ReturnSerialModal
          rowData={rowData}
          onConfirm={handleSerialConfirm}
          onClose={() => setShowSerialModal(false)}
          disabled={buttonAcs}
        />
      )}
    </>
  );
}