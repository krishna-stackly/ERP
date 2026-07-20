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
import React, { useState } from "react";
import "./stockSerialNumber.css";
import { toast } from "react-toastify";
import stockReceiptApiProvider from "../../../network/stockReceipt-api-provider";

export default function StockSerialNumber({
  setStockDim,
  activeProduct,     // { product_name, product_id, uom, qty_received, accepted_qty }
  stockReceiptId,    // GRN numeric id (set after first save)
  itemId,            // line item numeric id from backend
  onApply,           // callback(serialList) → parent stores serial list locally
}) {
  const [serialInput, setSerialInput]       = useState("");
  const [importText, setImportText]         = useState("");
  const [importBox, setImportBox]           = useState(false);
  const [serialList, setSerialList]         = useState([]);
  const [duplicates, setDuplicates]         = useState([]);
  const [isSubmitting, setIsSubmitting]     = useState(false);

  // ── helpers ──────────────────────────────────────────────────────────────
  const addSerial = (raw) => {
    const incoming = raw
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const dups = [];
    const toAdd = [];

    incoming.forEach((s) => {
      if (serialList.includes(s)) {
        dups.push(s);
      } else {
        toAdd.push(s);
      }
    });

    setDuplicates(dups);
    setSerialList((prev) => [...prev, ...toAdd]);
    return toAdd.length;
  };

  const handleAddSerial = (e) => {
    e.preventDefault();
    if (!serialInput.trim()) return;
    addSerial(serialInput);
    setSerialInput("");
  };

  const handleImport = (e) => {
    e.preventDefault();
    if (!importText.trim()) return;
    const added = addSerial(importText);
    toast.success(`${added} serial number(s) imported`);
    setImportText("");
  };

  const handleRemove = (serial) => {
    setSerialList((prev) => prev.filter((s) => s !== serial));
  };

  // ── APPLY: POST to API if stockReceiptId exists, else just pass back locally ──
  const handleApply = async (e) => {
    e.preventDefault();
    if (serialList.length === 0) {
      toast.error("Please add at least one serial number");
      return;
    }

    if (stockReceiptId && itemId) {
      // ── API call ──────────────────────────────────────────────────────────
      setIsSubmitting(true);
      try {
        const result = await stockReceiptApiProvider.addSerialNumbers(
          stockReceiptId,
          itemId,
          serialList
        );
        if (result) {
          toast.success("Serial numbers saved successfully");
          onApply?.(serialList);
          setStockDim({ serialBox: false, batchBox: false, batchSerialNO: false, activeRow: null, activeProduct: null });
        }
      } catch (err) {
        toast.error("Failed to save serial numbers");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // ── Save locally (GRN not yet created) ───────────────────────────────
      toast.info("Serial numbers will be submitted when you save the draft");
      onApply?.(serialList);
      setStockDim({ serialBox: false, batchBox: false, batchSerialNO: false, activeRow: null, activeProduct: null });
    }
  };

  const acceptedQty = parseInt(activeProduct?.accepted_qty) || 0;
  const isOverLimit = serialList.length > acceptedQty;

  return (
    <div className="createNewStockSerial-container">
      <h3>Generate Serial Numbers</h3>

      {/* ── Product Info ── */}
      <div className="createNewStockSerial-input-container">
        <div>
          <label>Product Name</label>
          <input value={activeProduct?.product_name || ""} disabled />
        </div>
        <div>
          <label>Product ID</label>
          <input value={activeProduct?.product_id || ""} disabled />
        </div>
        <div>
          <label>UOM</label>
          <input value={activeProduct?.uom || ""} disabled />
        </div>
        <div>
          <label>Stock Dim.</label>
          <select
            value="Serial"
            onChange={() =>
              setStockDim({
                serialBox: false,
                batchBox: true,
                batchSerialNO: false,
                activeRow: null,
                activeProduct: activeProduct,
              })
            }
          >
            <option value="Serial">Serial</option>
            <option value="Batch">Batch</option>
          </select>
        </div>
        <div>
          <label>Qty Received</label>
          <input value={activeProduct?.qty_received || ""} disabled />
        </div>
        <div>
          <label>Accepted Qty</label>
          <input value={activeProduct?.accepted_qty || ""} disabled />
        </div>
        <div>
          <label>Serials Generated</label>
          <input
            value={serialList.length}
            disabled
            style={{ color: isOverLimit ? "red" : "inherit" }}
          />
        </div>
      </div>

      {isOverLimit && (
        <p style={{ color: "red", fontSize: "12px", margin: "4px 0 8px" }}>
          ⚠ Serial numbers exceed accepted quantity ({acceptedQty})
        </p>
      )}

      {/* ── Input + Table ── */}
      <div className="createNewStockSerial-division">
        <nav>
          {/* Add one serial */}
          <form className="createNewStockSerial-serial-inp" onSubmit={handleAddSerial}>
            <div className="createNewStockSerial-serial-inp-box">
              <label htmlFor="serial_no">Serial No :</label>
              <input
                value={serialInput}
                onChange={(e) => setSerialInput(e.target.value)}
                type="text"
                id="serial_no"
                placeholder="Enter Serial Number"
              />
            </div>
            <button
              type="submit"
              className={
                serialInput === ""
                  ? "createNewStockSerial-serial-inactive"
                  : "createNewStockSerial-serial-active"
              }
              disabled={serialInput === ""}
            >
              Add Serial
            </button>
          </form>

          {/* Import toggle */}
          <p
            className={`createNewStockSerial-imp-serialnum ${
              importBox
                ? "createNewStockSerial-imp-serialnum-black"
                : "createNewStockSerial-imp-serialnum-blue"
            }`}
            onClick={() => setImportBox(!importBox)}
          >
            Import Serial Numbers
          </p>

          {importBox && (
            <form className="createNewStockSerial-serial-inp" onSubmit={handleImport}>
              <div className="createNewStockSerial-serial-inp-box">
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Enter Serial Numbers (eg., Item-001, Item-002, etc.)"
                />
              </div>
              <button
                type="submit"
                className={
                  importText === ""
                    ? "createNewStockSerial-serial-inactive"
                    : "createNewStockSerial-serial-active"
                }
                disabled={importText === ""}
              >
                Import
              </button>
            </form>
          )}

          {/* Duplicates */}
          <p className="createNewStockSerial-duplicate-tit">Duplicate Numbers</p>
          <textarea
            className="createNewStockSerial-duplicate-box"
            value={duplicates.join(", ")}
            placeholder="Not found"
            disabled
            style={{ color: duplicates.length > 0 ? "red" : "inherit" }}
          />
        </nav>

        {/* Serial list table */}
        <div className="createNewStockSerial-table">
          <table>
            <thead className="createNewStockSerial-table-head">
              <tr>
                <th>S.No</th>
                <th><pre>Serial No</pre></th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="createNewStockSerial-table-body">
              {serialList.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center", color: "#999" }}>
                    No serial numbers generated
                  </td>
                </tr>
              ) : (
                serialList.map((serial, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{serial}</td>
                    <td>
                      <svg
                        style={{ cursor: "pointer" }}
                        onClick={() => handleRemove(serial)}
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M3.55729 16C3.0684 16 2.65003 15.8261 2.30218 15.4782C1.95433 15.1304 1.78011 14.7117 1.77951 14.2222V2.66667H0.890625V0.888889H5.33507V0H10.6684V0.888889H15.1128V2.66667H14.224V14.2222C14.224 14.7111 14.05 15.1298 13.7022 15.4782C13.3543 15.8267 12.9357 16.0006 12.4462 16H3.55729ZM5.33507 12.4444H7.11284V4.44444H5.33507V12.4444ZM8.89062 12.4444H10.6684V4.44444H8.89062V12.4444Z"
                          fill="#234E70"
                        />
                      </svg>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Buttons ── */}
      <div className="createNewStockSerial-btn-container">
        <button
          type="button"
          className="createNewStockSerial-cancel-btn"
          onClick={() =>
            setStockDim({ serialBox: false, batchBox: false, batchSerialNO: false, activeRow: null, activeProduct: null })
          }
        >
          Cancel
        </button>
        <button
          type="button"
          className={
            serialList.length === 0 || isOverLimit || isSubmitting
              ? "createNewStockSerial-inactive-btn"
              : "createNewStockSerial-active-btn"
          }
          disabled={serialList.length === 0 || isOverLimit || isSubmitting}
          onClick={handleApply}
        >
          {isSubmitting ? "Saving..." : "Apply"}
        </button>
      </div>
    </div>
  );
}