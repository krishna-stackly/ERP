// // // // // // import React, { useState } from "react";
// // // // // // import "./stockSerialNumber.css";
// // // // // // import { toast } from "react-toastify";
// // // // // // import stockReceiptApiProvider from "../../../../network/stockReceipt-api-provider";

// // // // // // export default function StockSerialNumber({
// // // // // //   setStockDim,
// // // // // //   activeProduct,     // { product_name, product_id, uom, qty_received, accepted_qty }
// // // // // //   stockReceiptId,    // GRN numeric id (set after first save)
// // // // // //   itemId,            // line item numeric id from backend
// // // // // //   onApply,           // callback(serialList) → parent stores serial list locally
// // // // // // }) {
// // // // // //   const [serialInput, setSerialInput]       = useState("");
// // // // // //   const [importText, setImportText]         = useState("");
// // // // // //   const [importBox, setImportBox]           = useState(false);
// // // // // //   const [serialList, setSerialList]         = useState([]);
// // // // // //   const [duplicates, setDuplicates]         = useState([]);
// // // // // //   const [isSubmitting, setIsSubmitting]     = useState(false);

// // // // // //   // ── helpers ──────────────────────────────────────────────────────────────
// // // // // //   const addSerial = (raw) => {
// // // // // //     const incoming = raw
// // // // // //       .split(/[\n,]+/)
// // // // // //       .map((s) => s.trim())
// // // // // //       .filter(Boolean);

// // // // // //     const dups = [];
// // // // // //     const toAdd = [];

// // // // // //     incoming.forEach((s) => {
// // // // // //       if (serialList.includes(s)) {
// // // // // //         dups.push(s);
// // // // // //       } else {
// // // // // //         toAdd.push(s);
// // // // // //       }
// // // // // //     });

// // // // // //     setDuplicates(dups);
// // // // // //     setSerialList((prev) => [...prev, ...toAdd]);
// // // // // //     return toAdd.length;
// // // // // //   };

// // // // // //   const handleAddSerial = (e) => {
// // // // // //     e.preventDefault();
// // // // // //     if (!serialInput.trim()) return;
// // // // // //     addSerial(serialInput);
// // // // // //     setSerialInput("");
// // // // // //   };

// // // // // //   const handleImport = (e) => {
// // // // // //     e.preventDefault();
// // // // // //     if (!importText.trim()) return;
// // // // // //     const added = addSerial(importText);
// // // // // //     toast.success(`${added} serial number(s) imported`);
// // // // // //     setImportText("");
// // // // // //   };

// // // // // //   const handleRemove = (serial) => {
// // // // // //     setSerialList((prev) => prev.filter((s) => s !== serial));
// // // // // //   };

// // // // // //   // ── APPLY: POST to API if stockReceiptId exists, else just pass back locally ──
// // // // // //   const handleApply = async (e) => {
// // // // // //     e.preventDefault();
// // // // // //     if (serialList.length === 0) {
// // // // // //       toast.error("Please add at least one serial number");
// // // // // //       return;
// // // // // //     }

// // // // // //     if (stockReceiptId && itemId) {
// // // // // //       // ── API call ──────────────────────────────────────────────────────────
// // // // // //       setIsSubmitting(true);
// // // // // //       try {
// // // // // //         const result = await stockReceiptApiProvider.addSerialNumbers(
// // // // // //           stockReceiptId,
// // // // // //           itemId,
// // // // // //           serialList
// // // // // //         );
// // // // // //         if (result) {
// // // // // //           toast.success("Serial numbers saved successfully");
// // // // // //           onApply?.(serialList);
// // // // // //           setStockDim({ serialBox: false, batchBox: false, batchSerialNO: false, activeRow: null, activeProduct: null });
// // // // // //         }
// // // // // //       } catch (err) {
// // // // // //         toast.error("Failed to save serial numbers");
// // // // // //       } finally {
// // // // // //         setIsSubmitting(false);
// // // // // //       }
// // // // // //     } else {
// // // // // //       // ── Save locally (GRN not yet created) ───────────────────────────────
// // // // // //       toast.info("Serial numbers will be submitted when you save the draft");
// // // // // //       onApply?.(serialList);
// // // // // //       setStockDim({ serialBox: false, batchBox: false, batchSerialNO: false, activeRow: null, activeProduct: null });
// // // // // //     }
// // // // // //   };

// // // // // //   const acceptedQty = parseInt(activeProduct?.accepted_qty) || 0;
// // // // // //   const isOverLimit = serialList.length > acceptedQty;

// // // // // //   return (
// // // // // //     <div className="createNewStockSerial-container">
// // // // // //       <h3>Generate Serial Numbers</h3>

// // // // // //       {/* ── Product Info ── */}
// // // // // //       <div className="createNewStockSerial-input-container">
// // // // // //         <div>
// // // // // //           <label>Product Name</label>
// // // // // //           <input value={activeProduct?.product_name || ""} disabled />
// // // // // //         </div>
// // // // // //         <div>
// // // // // //           <label>Product ID</label>
// // // // // //           <input value={activeProduct?.product_id || ""} disabled />
// // // // // //         </div>
// // // // // //         <div>
// // // // // //           <label>UOM</label>
// // // // // //           <input value={activeProduct?.uom || ""} disabled />
// // // // // //         </div>
// // // // // //         <div>
// // // // // //           <label>Stock Dim.</label>
// // // // // //           <select
// // // // // //             value="Serial"
// // // // // //             onChange={() =>
// // // // // //               setStockDim({
// // // // // //                 serialBox: false,
// // // // // //                 batchBox: true,
// // // // // //                 batchSerialNO: false,
// // // // // //                 activeRow: null,
// // // // // //                 activeProduct: activeProduct,
// // // // // //               })
// // // // // //             }
// // // // // //           >
// // // // // //             <option value="Serial">Serial</option>
// // // // // //             <option value="Batch">Batch</option>
// // // // // //           </select>
// // // // // //         </div>
// // // // // //         <div>
// // // // // //           <label>Qty Received</label>
// // // // // //           <input value={activeProduct?.qty_received || ""} disabled />
// // // // // //         </div>
// // // // // //         <div>
// // // // // //           <label>Accepted Qty</label>
// // // // // //           <input value={activeProduct?.accepted_qty || ""} disabled />
// // // // // //         </div>
// // // // // //         <div>
// // // // // //           <label>Serials Generated</label>
// // // // // //           <input
// // // // // //             value={serialList.length}
// // // // // //             disabled
// // // // // //             style={{ color: isOverLimit ? "red" : "inherit" }}
// // // // // //           />
// // // // // //         </div>
// // // // // //       </div>

// // // // // //       {isOverLimit && (
// // // // // //         <p style={{ color: "red", fontSize: "12px", margin: "4px 0 8px" }}>
// // // // // //           ⚠ Serial numbers exceed accepted quantity ({acceptedQty})
// // // // // //         </p>
// // // // // //       )}

// // // // // //       {/* ── Input + Table ── */}
// // // // // //       <div className="createNewStockSerial-division">
// // // // // //         <nav>
// // // // // //           {/* Add one serial */}
// // // // // //           <form className="createNewStockSerial-serial-inp" onSubmit={handleAddSerial}>
// // // // // //             <div className="createNewStockSerial-serial-inp-box">
// // // // // //               <label htmlFor="serial_no">Serial No :</label>
// // // // // //               <input
// // // // // //                 value={serialInput}
// // // // // //                 onChange={(e) => setSerialInput(e.target.value)}
// // // // // //                 type="text"
// // // // // //                 id="serial_no"
// // // // // //                 placeholder="Enter Serial Number"
// // // // // //               />
// // // // // //             </div>
// // // // // //             <button
// // // // // //               type="submit"
// // // // // //               className={
// // // // // //                 serialInput === ""
// // // // // //                   ? "createNewStockSerial-serial-inactive"
// // // // // //                   : "createNewStockSerial-serial-active"
// // // // // //               }
// // // // // //               disabled={serialInput === ""}
// // // // // //             >
// // // // // //               Add Serial
// // // // // //             </button>
// // // // // //           </form>

// // // // // //           {/* Import toggle */}
// // // // // //           <p
// // // // // //             className={`createNewStockSerial-imp-serialnum ${
// // // // // //               importBox
// // // // // //                 ? "createNewStockSerial-imp-serialnum-black"
// // // // // //                 : "createNewStockSerial-imp-serialnum-blue"
// // // // // //             }`}
// // // // // //             onClick={() => setImportBox(!importBox)}
// // // // // //           >
// // // // // //             Import Serial Numbers
// // // // // //           </p>

// // // // // //           {importBox && (
// // // // // //             <form className="createNewStockSerial-serial-inp" onSubmit={handleImport}>
// // // // // //               <div className="createNewStockSerial-serial-inp-box">
// // // // // //                 <textarea
// // // // // //                   value={importText}
// // // // // //                   onChange={(e) => setImportText(e.target.value)}
// // // // // //                   placeholder="Enter Serial Numbers (eg., Item-001, Item-002, etc.)"
// // // // // //                 />
// // // // // //               </div>
// // // // // //               <button
// // // // // //                 type="submit"
// // // // // //                 className={
// // // // // //                   importText === ""
// // // // // //                     ? "createNewStockSerial-serial-inactive"
// // // // // //                     : "createNewStockSerial-serial-active"
// // // // // //                 }
// // // // // //                 disabled={importText === ""}
// // // // // //               >
// // // // // //                 Import
// // // // // //               </button>
// // // // // //             </form>
// // // // // //           )}

// // // // // //           {/* Duplicates */}
// // // // // //           <p className="createNewStockSerial-duplicate-tit">Duplicate Numbers</p>
// // // // // //           <textarea
// // // // // //             className="createNewStockSerial-duplicate-box"
// // // // // //             value={duplicates.join(", ")}
// // // // // //             placeholder="Not found"
// // // // // //             disabled
// // // // // //             style={{ color: duplicates.length > 0 ? "red" : "inherit" }}
// // // // // //           />
// // // // // //         </nav>

// // // // // //         {/* Serial list table */}
// // // // // //         <div className="createNewStockSerial-table">
// // // // // //           <table>
// // // // // //             <thead className="createNewStockSerial-table-head">
// // // // // //               <tr>
// // // // // //                 <th>S.No</th>
// // // // // //                 <th><pre>Serial No</pre></th>
// // // // // //                 <th>Action</th>
// // // // // //               </tr>
// // // // // //             </thead>
// // // // // //             <tbody className="createNewStockSerial-table-body">
// // // // // //               {serialList.length === 0 ? (
// // // // // //                 <tr>
// // // // // //                   <td colSpan={3} style={{ textAlign: "center", color: "#999" }}>
// // // // // //                     No serial numbers generated
// // // // // //                   </td>
// // // // // //                 </tr>
// // // // // //               ) : (
// // // // // //                 serialList.map((serial, idx) => (
// // // // // //                   <tr key={idx}>
// // // // // //                     <td>{idx + 1}</td>
// // // // // //                     <td>{serial}</td>
// // // // // //                     <td>
// // // // // //                       <svg
// // // // // //                         style={{ cursor: "pointer" }}
// // // // // //                         onClick={() => handleRemove(serial)}
// // // // // //                         xmlns="http://www.w3.org/2000/svg"
// // // // // //                         width="14"
// // // // // //                         height="14"
// // // // // //                         viewBox="0 0 16 16"
// // // // // //                         fill="none"
// // // // // //                       >
// // // // // //                         <path
// // // // // //                           d="M3.55729 16C3.0684 16 2.65003 15.8261 2.30218 15.4782C1.95433 15.1304 1.78011 14.7117 1.77951 14.2222V2.66667H0.890625V0.888889H5.33507V0H10.6684V0.888889H15.1128V2.66667H14.224V14.2222C14.224 14.7111 14.05 15.1298 13.7022 15.4782C13.3543 15.8267 12.9357 16.0006 12.4462 16H3.55729ZM5.33507 12.4444H7.11284V4.44444H5.33507V12.4444ZM8.89062 12.4444H10.6684V4.44444H8.89062V12.4444Z"
// // // // // //                           fill="#234E70"
// // // // // //                         />
// // // // // //                       </svg>
// // // // // //                     </td>
// // // // // //                   </tr>
// // // // // //                 ))
// // // // // //               )}
// // // // // //             </tbody>
// // // // // //           </table>
// // // // // //         </div>
// // // // // //       </div>

// // // // // //       {/* ── Buttons ── */}
// // // // // //       <div className="createNewStockSerial-btn-container">
// // // // // //         <button
// // // // // //           type="button"
// // // // // //           className="createNewStockSerial-cancel-btn"
// // // // // //           onClick={() =>
// // // // // //             setStockDim({ serialBox: false, batchBox: false, batchSerialNO: false, activeRow: null, activeProduct: null })
// // // // // //           }
// // // // // //         >
// // // // // //           Cancel
// // // // // //         </button>
// // // // // //         <button
// // // // // //           type="button"
// // // // // //           className={
// // // // // //             serialList.length === 0 || isOverLimit || isSubmitting
// // // // // //               ? "createNewStockSerial-inactive-btn"
// // // // // //               : "createNewStockSerial-active-btn"
// // // // // //           }
// // // // // //           disabled={serialList.length === 0 || isOverLimit || isSubmitting}
// // // // // //           onClick={handleApply}
// // // // // //         >
// // // // // //           {isSubmitting ? "Saving..." : "Apply"}
// // // // // //         </button>
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );
// // // // // // }
// // // // // import React, { useState } from "react";
// // // // // import "./stockSerialNumber.css";
// // // // // import { toast } from "react-toastify";
// // // // // import stockReceiptApiProvider from "../../../../network/stockReceipt-api-provider";

// // // // // export default function StockSerialNumber({
// // // // //   setStockDim,
// // // // //   activeProduct,     // { product_name, product_id, uom, qty_received, accepted_qty }
// // // // //   stockReceiptId,    // GRN numeric id (set after first save)
// // // // //   itemId,            // line item numeric id from backend
// // // // //   onApply,           // callback(serialList) → parent stores serial list locally
// // // // // }) {
// // // // //   const [serialInput, setSerialInput]   = useState("");
// // // // //   const [importText, setImportText]     = useState("");
// // // // //   const [importBox, setImportBox]       = useState(false);
// // // // //   const [serialList, setSerialList]     = useState([]);
// // // // //   const [duplicates, setDuplicates]     = useState([]);
// // // // //   const [isSubmitting, setIsSubmitting] = useState(false);

// // // // //   // ── helpers ──────────────────────────────────────────────────────────────
// // // // //   const addSerial = (raw) => {
// // // // //     const incoming = raw
// // // // //       .split(/[\n,]+/)
// // // // //       .map((s) => s.trim())
// // // // //       .filter(Boolean);

// // // // //     const dups  = [];
// // // // //     const toAdd = [];

// // // // //     incoming.forEach((s) => {
// // // // //       if (serialList.includes(s)) dups.push(s);
// // // // //       else toAdd.push(s);
// // // // //     });

// // // // //     setDuplicates(dups);
// // // // //     setSerialList((prev) => [...prev, ...toAdd]);
// // // // //     return toAdd.length;
// // // // //   };

// // // // //   const handleAddSerial = (e) => {
// // // // //     e.preventDefault();
// // // // //     if (!serialInput.trim()) return;
// // // // //     addSerial(serialInput);
// // // // //     setSerialInput("");
// // // // //   };

// // // // //   const handleImport = (e) => {
// // // // //     e.preventDefault();
// // // // //     if (!importText.trim()) return;
// // // // //     const added = addSerial(importText);
// // // // //     toast.success(`${added} serial number(s) imported`);
// // // // //     setImportText("");
// // // // //     setImportBox(false);
// // // // //   };

// // // // //   const handleRemove = (serial) => {
// // // // //     setSerialList((prev) => prev.filter((s) => s !== serial));
// // // // //   };

// // // // //   const handleClose = () => {
// // // // //     setStockDim({
// // // // //       serialBox:     false,
// // // // //       batchBox:      false,
// // // // //       batchSerialNO: false,
// // // // //       activeRow:     null,
// // // // //       activeProduct: null,
// // // // //       activeItemId:  null,
// // // // //     });
// // // // //   };

// // // // //   // ── APPLY ─────────────────────────────────────────────────────────────────
// // // // //   const handleApply = async (e) => {
// // // // //     e.preventDefault();
// // // // //     if (serialList.length === 0) {
// // // // //       toast.error("Please add at least one serial number");
// // // // //       return;
// // // // //     }

// // // // //     if (stockReceiptId && itemId) {
// // // // //       setIsSubmitting(true);
// // // // //       try {
// // // // //         const result = await stockReceiptApiProvider.addSerialNumbers(
// // // // //           stockReceiptId,
// // // // //           itemId,
// // // // //           serialList
// // // // //         );
// // // // //         if (result) {
// // // // //           toast.success("Serial numbers saved successfully");
// // // // //           onApply?.(serialList);
// // // // //           handleClose();
// // // // //         }
// // // // //       } catch (err) {
// // // // //         toast.error("Failed to save serial numbers");
// // // // //       } finally {
// // // // //         setIsSubmitting(false);
// // // // //       }
// // // // //     } else {
// // // // //       toast.info("Serial numbers will be submitted when you save the draft");
// // // // //       onApply?.(serialList);
// // // // //       handleClose();
// // // // //     }
// // // // //   };

// // // // //   const acceptedQty = parseInt(activeProduct?.accepted_qty) || 0;
// // // // //   const isOverLimit = serialList.length > acceptedQty;

// // // // //   return (
// // // // //     <div className="ssn-overlay">
// // // // //       <div className="ssn-modal">

// // // // //         {/* ── TITLE ── */}
// // // // //         <div className="ssn-title-row">
// // // // //           <h3 className="ssn-title">Generate Serial Numbers</h3>
// // // // //         </div>

// // // // //         {/* ── PRODUCT INFO GRID ── */}
// // // // //         <div className="ssn-info-grid">
// // // // //           <div className="ssn-info-field">
// // // // //             <label>Product Name</label>
// // // // //             <input value={activeProduct?.product_name || ""} disabled />
// // // // //           </div>
// // // // //           <div className="ssn-info-field">
// // // // //             <label>Product ID</label>
// // // // //             <input value={activeProduct?.product_id || ""} disabled />
// // // // //           </div>
// // // // //           <div className="ssn-info-field">
// // // // //             <label>UOM</label>
// // // // //             <input value={activeProduct?.uom || ""} disabled />
// // // // //           </div>
// // // // //           <div className="ssn-info-field">
// // // // //             <label>Stock Dim.</label>
// // // // //             <select
// // // // //               value="Serial"
// // // // //               onChange={() =>
// // // // //                 setStockDim({
// // // // //                   serialBox:     false,
// // // // //                   batchBox:      true,
// // // // //                   batchSerialNO: false,
// // // // //                   activeRow:     null,
// // // // //                   activeProduct: activeProduct,
// // // // //                   activeItemId:  itemId,
// // // // //                 })
// // // // //               }
// // // // //             >
// // // // //               <option value="Serial">Serial</option>
// // // // //               <option value="Batch">Batch</option>
// // // // //             </select>
// // // // //           </div>
// // // // //           <div className="ssn-info-field">
// // // // //             <label>Qty Received</label>
// // // // //             <input value={activeProduct?.qty_received ?? ""} disabled />
// // // // //           </div>
// // // // //           <div className="ssn-info-field">
// // // // //             <label>Accepted Qty</label>
// // // // //             <input value={activeProduct?.accepted_qty ?? ""} disabled />
// // // // //           </div>
// // // // //           <div className="ssn-info-field">
// // // // //             <label>Serials Generated</label>
// // // // //             <input
// // // // //               value={serialList.length}
// // // // //               disabled
// // // // //               className={isOverLimit ? "ssn-over-limit" : ""}
// // // // //             />
// // // // //           </div>
// // // // //         </div>

// // // // //         {isOverLimit && (
// // // // //           <p className="ssn-overlimit-msg">
// // // // //             ⚠ Serial numbers exceed accepted quantity ({acceptedQty})
// // // // //           </p>
// // // // //         )}

// // // // //         {/* ── BODY: LEFT (inputs) + RIGHT (table) ── */}
// // // // //         <div className="ssn-body">

// // // // //           {/* LEFT PANEL */}
// // // // //           <div className="ssn-left">

// // // // //             {/* Add Serial Input */}
// // // // //             <div className="ssn-input-card">
// // // // //               <div className="ssn-input-row">
// // // // //                 <label htmlFor="ssn-serial-no">Serial No :</label>
// // // // //                 <input
// // // // //                   id="ssn-serial-no"
// // // // //                   type="text"
// // // // //                   placeholder="Enter Serial Number"
// // // // //                   value={serialInput}
// // // // //                   onChange={(e) => setSerialInput(e.target.value)}
// // // // //                   onKeyDown={(e) => { if (e.key === "Enter") handleAddSerial(e); }}
// // // // //                 />
// // // // //               </div>
// // // // //               <button
// // // // //                 type="button"
// // // // //                 className={serialInput.trim() ? "ssn-add-btn ssn-add-btn--active" : "ssn-add-btn ssn-add-btn--inactive"}
// // // // //                 disabled={!serialInput.trim()}
// // // // //                 onClick={handleAddSerial}
// // // // //               >
// // // // //                 Add Serial
// // // // //               </button>
// // // // //             </div>

// // // // //             {/* Import Toggle */}
// // // // //             <p
// // // // //               className={`ssn-import-toggle ${importBox ? "ssn-import-toggle--open" : ""}`}
// // // // //               onClick={() => setImportBox(!importBox)}
// // // // //             >
// // // // //               {importBox ? "▾" : "▸"} Import Serial Numbers
// // // // //             </p>

// // // // //             {/* Import Box */}
// // // // //             {importBox && (
// // // // //               <div className="ssn-input-card ssn-import-card">
// // // // //                 <div className="ssn-input-row ssn-input-row--textarea">
// // // // //                   <textarea
// // // // //                     placeholder="Enter Serial Numbers (e.g., Item-001, Item-002, ...)"
// // // // //                     value={importText}
// // // // //                     onChange={(e) => setImportText(e.target.value)}
// // // // //                     rows={4}
// // // // //                   />
// // // // //                 </div>
// // // // //                 <button
// // // // //                   type="button"
// // // // //                   className={importText.trim() ? "ssn-add-btn ssn-add-btn--active" : "ssn-add-btn ssn-add-btn--inactive"}
// // // // //                   disabled={!importText.trim()}
// // // // //                   onClick={handleImport}
// // // // //                 >
// // // // //                   Import
// // // // //                 </button>
// // // // //               </div>
// // // // //             )}

// // // // //             {/* Duplicates */}
// // // // //             <div className="ssn-dup-section">
// // // // //               <p className="ssn-dup-label">Duplicate Numbers</p>
// // // // //               <textarea
// // // // //                 className="ssn-dup-box"
// // // // //                 value={duplicates.join(", ")}
// // // // //                 placeholder="Not found"
// // // // //                 disabled
// // // // //                 style={{ color: duplicates.length > 0 ? "#e53e3e" : "#b0b0b0" }}
// // // // //                 rows={3}
// // // // //               />
// // // // //             </div>
// // // // //           </div>

// // // // //           {/* RIGHT PANEL — Serial Table */}
// // // // //           <div className="ssn-right">
// // // // //             <table className="ssn-table">
// // // // //               <thead>
// // // // //                 <tr>
// // // // //                   <th>S.No</th>
// // // // //                   <th>Serial No</th>
// // // // //                   <th>Action</th>
// // // // //                 </tr>
// // // // //               </thead>
// // // // //               <tbody>
// // // // //                 {serialList.length === 0 ? (
// // // // //                   <tr>
// // // // //                     <td colSpan={3} className="ssn-empty-row">
// // // // //                       No serial numbers generated
// // // // //                     </td>
// // // // //                   </tr>
// // // // //                 ) : (
// // // // //                   serialList.map((serial, idx) => (
// // // // //                     <tr key={idx}>
// // // // //                       <td>{idx + 1}</td>
// // // // //                       <td>{serial}</td>
// // // // //                       <td>
// // // // //                         <button
// // // // //                           type="button"
// // // // //                           className="ssn-remove-btn"
// // // // //                           onClick={() => handleRemove(serial)}
// // // // //                           title="Remove"
// // // // //                         >
// // // // //                           {/* Trash icon */}
// // // // //                           <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 16" fill="none">
// // // // //                             <path d="M2.625 16C2.14375 16 1.73192 15.8261 1.3895 15.4782C1.04708 15.1304 0.875583 14.7117 0.875 14.2222V2.66667H0V0.888889H4.375V0H9.625V0.888889H14V2.66667H13.125V14.2222C13.125 14.7111 12.9538 15.1298 12.6114 15.4782C12.269 15.8267 11.8568 16.0006 11.375 16H2.625ZM4.375 12.4444H6.125V4.44444H4.375V12.4444ZM7.875 12.4444H9.625V4.44444H7.875V12.4444Z" fill="#234E70"/>
// // // // //                           </svg>
// // // // //                         </button>
// // // // //                       </td>
// // // // //                     </tr>
// // // // //                   ))
// // // // //                 )}
// // // // //               </tbody>
// // // // //             </table>
// // // // //           </div>
// // // // //         </div>

// // // // //         {/* ── FOOTER BUTTONS ── */}
// // // // //         <div className="ssn-footer">
// // // // //           <button type="button" className="ssn-cancel-btn" onClick={handleClose}>
// // // // //             Cancel
// // // // //           </button>
// // // // //           <button
// // // // //             type="button"
// // // // //             className={
// // // // //               serialList.length === 0 || isOverLimit || isSubmitting
// // // // //                 ? "ssn-apply-btn ssn-apply-btn--disabled"
// // // // //                 : "ssn-apply-btn ssn-apply-btn--active"
// // // // //             }
// // // // //             disabled={serialList.length === 0 || isOverLimit || isSubmitting}
// // // // //             onClick={handleApply}
// // // // //           >
// // // // //             {isSubmitting ? "Saving..." : "Apply"}
// // // // //           </button>
// // // // //         </div>

// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // }
// // // // import React, { useState } from "react";
// // // // import "./stockSerialNumber.css";
// // // // import { toast } from "react-toastify";
// // // // import stockReceiptApiProvider from "../../../../network/stockReceipt-api-provider";

// // // // export default function StockSerialNumber({
// // // //   setStockDim,
// // // //   activeProduct,
// // // //   stockReceiptId,
// // // //   itemId,
// // // //   onApply,
// // // //   // When used inside batch flow, these are set
// // // //   batchMode = false,       // true when generating serials FOR a batch
// // // //   batchNo = "",            // batch number label
// // // //   batchQty = 0,            // max serials for this batch
// // // //   onBatchSerialApply,      // callback(serials) for batch mode
// // // // }) {
// // // //   const [serialInput, setSerialInput] = useState("");
// // // //   const [importText, setImportText]   = useState("");
// // // //   const [importBox, setImportBox]     = useState(false);
// // // //   const [serialList, setSerialList]   = useState([]);
// // // //   const [duplicates, setDuplicates]   = useState([]);
// // // //   const [isSubmitting, setIsSubmitting] = useState(false);

// // // //   // ── helpers ───────────────────────────────────────────────────────────────
// // // //   const addSerials = (raw) => {
// // // //     const incoming = raw
// // // //       .split(/[\n,]+/)
// // // //       .map((s) => s.trim())
// // // //       .filter(Boolean);

// // // //     const dups  = [];
// // // //     const toAdd = [];

// // // //     incoming.forEach((s) => {
// // // //       if (serialList.includes(s)) dups.push(s);
// // // //       else toAdd.push(s);
// // // //     });

// // // //     setDuplicates(dups);
// // // //     if (toAdd.length > 0) setSerialList((prev) => [...prev, ...toAdd]);
// // // //     return toAdd.length;
// // // //   };

// // // //   const handleAddSerial = (e) => {
// // // //     e.preventDefault();
// // // //     if (!serialInput.trim()) return;
// // // //     // check if already in list
// // // //     if (serialList.includes(serialInput.trim())) {
// // // //       setDuplicates([serialInput.trim()]);
// // // //       return;
// // // //     }
// // // //     setDuplicates([]);
// // // //     setSerialList((prev) => [...prev, serialInput.trim()]);
// // // //     setSerialInput("");
// // // //   };

// // // //   const handleImport = (e) => {
// // // //     e.preventDefault();
// // // //     if (!importText.trim()) return;
// // // //     const added = addSerials(importText);
// // // //     if (added > 0) toast.success(`${added} serial number(s) imported`);
// // // //     setImportText("");
// // // //     setImportBox(false);
// // // //   };

// // // //   const handleRemove = (serial) => {
// // // //     setSerialList((prev) => prev.filter((s) => s !== serial));
// // // //     setDuplicates((prev) => prev.filter((s) => s !== serial));
// // // //   };

// // // //   const handleClose = () => {
// // // //     if (batchMode) {
// // // //       onBatchSerialApply?.(null); // signal cancel
// // // //     } else {
// // // //       setStockDim({
// // // //         serialBox: false, batchBox: false,
// // // //         activeRow: null, activeProduct: null, activeItemId: null,
// // // //       });
// // // //     }
// // // //   };

// // // //   // ── APPLY ─────────────────────────────────────────────────────────────────
// // // //   const handleApply = async (e) => {
// // // //     e.preventDefault();
// // // //     if (serialList.length === 0) {
// // // //       toast.error("Please add at least one serial number");
// // // //       return;
// // // //     }

// // // //     // Batch mode — just return serials to parent, no API call here
// // // //     if (batchMode) {
// // // //       onBatchSerialApply?.(serialList);
// // // //       return;
// // // //     }

// // // //     // Normal mode — POST to API if GRN already saved
// // // //     if (stockReceiptId && itemId) {
// // // //       setIsSubmitting(true);
// // // //       try {
// // // //         const result = await stockReceiptApiProvider.addSerialNumbers(
// // // //           stockReceiptId, itemId, serialList
// // // //         );
// // // //         if (result) {
// // // //           toast.success("Serial numbers saved successfully");
// // // //           onApply?.(serialList);
// // // //           setStockDim({
// // // //             serialBox: false, batchBox: false,
// // // //             activeRow: null, activeProduct: null, activeItemId: null,
// // // //           });
// // // //         }
// // // //       } catch {
// // // //         toast.error("Failed to save serial numbers");
// // // //       } finally {
// // // //         setIsSubmitting(false);
// // // //       }
// // // //     } else {
// // // //       toast.info("Serial numbers will be submitted when you save the draft");
// // // //       onApply?.(serialList);
// // // //       setStockDim({
// // // //         serialBox: false, batchBox: false,
// // // //         activeRow: null, activeProduct: null, activeItemId: null,
// // // //       });
// // // //     }
// // // //   };

// // // //   const limitQty    = batchMode ? parseInt(batchQty) || 0 : parseInt(activeProduct?.accepted_qty) || 0;
// // // //   const isOverLimit = serialList.length > limitQty && limitQty > 0;

// // // //   return (
// // // //     <div className="ssn-overlay">
// // // //       <div className="ssn-modal">

// // // //         {/* ── TITLE ── */}
// // // //         <div className="ssn-title-row">
// // // //           <h3 className="ssn-title">
// // // //             {batchMode
// // // //               ? `Generate Serial Numbers by Batch`
// // // //               : "Generate Serial Numbers"}
// // // //           </h3>
// // // //         </div>

// // // //         {/* ── PRODUCT / BATCH INFO GRID ── */}
// // // //         {batchMode ? (
// // // //           <div className="ssn-info-grid ssn-info-grid--batch">
// // // //             <div className="ssn-info-field">
// // // //               <label>Batch number</label>
// // // //               <input value={batchNo} disabled />
// // // //             </div>
// // // //             <div className="ssn-info-field">
// // // //               <label>Batch Quantity</label>
// // // //               <input value={batchQty} disabled />
// // // //             </div>
// // // //             <div className="ssn-info-field">
// // // //               <label>Serials Generated</label>
// // // //               <input
// // // //                 value={serialList.length}
// // // //                 disabled
// // // //                 className={isOverLimit ? "ssn-over-limit" : ""}
// // // //               />
// // // //             </div>
// // // //           </div>
// // // //         ) : (
// // // //           <div className="ssn-info-grid">
// // // //             <div className="ssn-info-field">
// // // //               <label>Product Name</label>
// // // //               <input value={activeProduct?.product_name || ""} disabled />
// // // //             </div>
// // // //             <div className="ssn-info-field">
// // // //               <label>Product ID</label>
// // // //               <input value={activeProduct?.product_id || ""} disabled />
// // // //             </div>
// // // //             <div className="ssn-info-field">
// // // //               <label>UOM</label>
// // // //               <input value={activeProduct?.uom || ""} disabled />
// // // //             </div>
// // // //             <div className="ssn-info-field">
// // // //               <label>Stock Dim.</label>
// // // //               <select
// // // //                 value="Serial"
// // // //                 onChange={() =>
// // // //                   setStockDim({
// // // //                     serialBox: false, batchBox: true,
// // // //                     activeRow: null, activeProduct: activeProduct, activeItemId: itemId,
// // // //                   })
// // // //                 }
// // // //               >
// // // //                 <option value="Serial">Serial</option>
// // // //                 <option value="Batch">Batch</option>
// // // //               </select>
// // // //             </div>
// // // //             <div className="ssn-info-field">
// // // //               <label>Qty Received</label>
// // // //               <input value={activeProduct?.qty_received ?? ""} disabled />
// // // //             </div>
// // // //             <div className="ssn-info-field">
// // // //               <label>Accepted Qty</label>
// // // //               <input value={activeProduct?.accepted_qty ?? ""} disabled />
// // // //             </div>
// // // //             <div className="ssn-info-field">
// // // //               <label>Serials Generated</label>
// // // //               <input
// // // //                 value={serialList.length}
// // // //                 disabled
// // // //                 className={isOverLimit ? "ssn-over-limit" : ""}
// // // //               />
// // // //             </div>
// // // //           </div>
// // // //         )}

// // // //         {isOverLimit && (
// // // //           <p className="ssn-overlimit-msg">
// // // //             ⚠ Serial numbers exceed {batchMode ? "batch" : "accepted"} quantity ({limitQty})
// // // //           </p>
// // // //         )}

// // // //         {/* ── BODY ── */}
// // // //         <div className="ssn-body">

// // // //           {/* LEFT PANEL */}
// // // //           <div className="ssn-left">

// // // //             {/* Add Serial Input */}
// // // //             <div className="ssn-input-card">
// // // //               <div className="ssn-input-row">
// // // //                 <label htmlFor="ssn-serial-no">Serial No :</label>
// // // //                 <input
// // // //                   id="ssn-serial-no"
// // // //                   type="text"
// // // //                   placeholder="Enter Serial Number"
// // // //                   value={serialInput}
// // // //                   onChange={(e) => setSerialInput(e.target.value)}
// // // //                   onKeyDown={(e) => { if (e.key === "Enter") handleAddSerial(e); }}
// // // //                 />
// // // //               </div>
// // // //               <button
// // // //                 type="button"
// // // //                 className={serialInput.trim() ? "ssn-add-btn ssn-add-btn--active" : "ssn-add-btn ssn-add-btn--inactive"}
// // // //                 disabled={!serialInput.trim()}
// // // //                 onClick={handleAddSerial}
// // // //               >
// // // //                 Add Serial
// // // //               </button>
// // // //             </div>

// // // //             {/* Import Toggle */}
// // // //             <p
// // // //               className={`ssn-import-toggle ${importBox ? "ssn-import-toggle--open" : ""}`}
// // // //               onClick={() => setImportBox(!importBox)}
// // // //             >
// // // //               Import Serial Numbers
// // // //             </p>

// // // //             {/* Import Box */}
// // // //             {importBox && (
// // // //               <div className="ssn-input-card ssn-import-card">
// // // //                 <div className="ssn-input-row ssn-input-row--textarea">
// // // //                   <textarea
// // // //                     placeholder="Enter Serial Numbers (e.g., Item-001, Item-002, ...)"
// // // //                     value={importText}
// // // //                     onChange={(e) => setImportText(e.target.value)}
// // // //                     rows={4}
// // // //                   />
// // // //                 </div>
// // // //                 <button
// // // //                   type="button"
// // // //                   className={importText.trim() ? "ssn-add-btn ssn-add-btn--active" : "ssn-add-btn ssn-add-btn--inactive"}
// // // //                   disabled={!importText.trim()}
// // // //                   onClick={handleImport}
// // // //                 >
// // // //                   Import
// // // //                 </button>
// // // //               </div>
// // // //             )}

// // // //             {/* Duplicates */}
// // // //             <div className="ssn-dup-section">
// // // //               <p className="ssn-dup-label">Duplicate Numbers</p>
// // // //               <textarea
// // // //                 className="ssn-dup-box"
// // // //                 value={duplicates.join(", ")}
// // // //                 placeholder="Not found"
// // // //                 disabled
// // // //                 style={{ color: duplicates.length > 0 ? "#e53e3e" : "#b0b0b0" }}
// // // //                 rows={3}
// // // //               />
// // // //             </div>
// // // //           </div>

// // // //           {/* RIGHT PANEL — Serial Table */}
// // // //           <div className="ssn-right">
// // // //             <table className="ssn-table">
// // // //               <thead>
// // // //                 <tr>
// // // //                   <th>S.No</th>
// // // //                   <th>Serial No</th>
// // // //                   <th>Action</th>
// // // //                 </tr>
// // // //               </thead>
// // // //               <tbody>
// // // //                 {serialList.length === 0 ? (
// // // //                   <tr>
// // // //                     <td colSpan={3} className="ssn-empty-row">
// // // //                       No serial numbers generated
// // // //                     </td>
// // // //                   </tr>
// // // //                 ) : (
// // // //                   serialList.map((serial, idx) => (
// // // //                     <tr key={idx}>
// // // //                       <td>{idx + 1}</td>
// // // //                       <td>{serial}</td>
// // // //                       <td>
// // // //                         <button
// // // //                           type="button"
// // // //                           className="ssn-remove-btn"
// // // //                           onClick={() => handleRemove(serial)}
// // // //                           title="Remove"
// // // //                         >
// // // //                           <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 16" fill="none">
// // // //                             <path d="M2.625 16C2.14375 16 1.73192 15.8261 1.3895 15.4782C1.04708 15.1304 0.875583 14.7117 0.875 14.2222V2.66667H0V0.888889H4.375V0H9.625V0.888889H14V2.66667H13.125V14.2222C13.125 14.7111 12.9538 15.1298 12.6114 15.4782C12.269 15.8267 11.8568 16.0006 11.375 16H2.625ZM4.375 12.4444H6.125V4.44444H4.375V12.4444ZM7.875 12.4444H9.625V4.44444H7.875V12.4444Z" fill="#234E70"/>
// // // //                           </svg>
// // // //                         </button>
// // // //                       </td>
// // // //                     </tr>
// // // //                   ))
// // // //                 )}
// // // //               </tbody>
// // // //             </table>
// // // //           </div>
// // // //         </div>

// // // //         {/* ── FOOTER ── */}
// // // //         <div className="ssn-footer">
// // // //           <button type="button" className="ssn-cancel-btn" onClick={handleClose}>
// // // //             Cancel
// // // //           </button>
// // // //           <button
// // // //             type="button"
// // // //             className={
// // // //               serialList.length === 0 || isOverLimit || isSubmitting
// // // //                 ? "ssn-apply-btn ssn-apply-btn--disabled"
// // // //                 : "ssn-apply-btn ssn-apply-btn--active"
// // // //             }
// // // //             disabled={serialList.length === 0 || isOverLimit || isSubmitting}
// // // //             onClick={handleApply}
// // // //           >
// // // //             {isSubmitting ? "Saving..." : "Apply"}
// // // //           </button>
// // // //         </div>

// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }
// // // import React, { useState } from "react";
// // // import "./stockSerialNumber.css";
// // // import { toast } from "react-toastify";
// // // import stockReceiptApiProvider from "../../../../network/stockReceipt-api-provider";

// // // export default function StockSerialNumber({
// // //   setStockDim,
// // //   activeProduct,
// // //   stockReceiptId,
// // //   itemId,
// // //   onApply,
// // //   // When used inside batch flow, these are set
// // //   batchMode = false,       // true when generating serials FOR a batch
// // //   batchNo = "",            // batch number label
// // //   batchQty = 0,            // max serials for this batch
// // //   onBatchSerialApply,      // callback(serials) for batch mode
// // // }) {
// // //   const [serialInput, setSerialInput] = useState("");
// // //   const [importText, setImportText]   = useState("");
// // //   const [importBox, setImportBox]     = useState(false);
// // //   const [serialList, setSerialList]   = useState([]);
// // //   const [duplicates, setDuplicates]   = useState([]);
// // //   const [isSubmitting, setIsSubmitting] = useState(false);

// // //   // ── helpers ───────────────────────────────────────────────────────────────
// // //   const addSerials = (raw) => {
// // //     const incoming = raw
// // //       .split(/[\n,]+/)
// // //       .map((s) => s.trim())
// // //       .filter(Boolean);

// // //     const dups  = [];
// // //     const toAdd = [];

// // //     incoming.forEach((s) => {
// // //       if (serialList.includes(s)) dups.push(s);
// // //       else toAdd.push(s);
// // //     });

// // //     setDuplicates(dups);
// // //     if (toAdd.length > 0) setSerialList((prev) => [...prev, ...toAdd]);
// // //     return toAdd.length;
// // //   };

// // //   const handleAddSerial = (e) => {
// // //     e.preventDefault();
// // //     if (!serialInput.trim()) return;
// // //     // check if already in list
// // //     if (serialList.includes(serialInput.trim())) {
// // //       setDuplicates([serialInput.trim()]);
// // //       return;
// // //     }
// // //     setDuplicates([]);
// // //     setSerialList((prev) => [...prev, serialInput.trim()]);
// // //     setSerialInput("");
// // //   };

// // //   const handleImport = (e) => {
// // //     e.preventDefault();
// // //     if (!importText.trim()) return;
// // //     const added = addSerials(importText);
// // //     if (added > 0) toast.success(`${added} serial number(s) imported`);
// // //     setImportText("");
// // //     setImportBox(false);
// // //   };

// // //   const handleRemove = (serial) => {
// // //     setSerialList((prev) => prev.filter((s) => s !== serial));
// // //     setDuplicates((prev) => prev.filter((s) => s !== serial));
// // //   };

// // //   const handleClose = () => {
// // //     if (batchMode) {
// // //       onBatchSerialApply?.(null); // signal cancel
// // //     } else {
// // //       setStockDim({
// // //         serialBox: false, batchBox: false,
// // //         activeRow: null, activeProduct: null, activeItemId: null,
// // //       });
// // //     }
// // //   };

// // //   // ── APPLY ─────────────────────────────────────────────────────────────────
// // //   const handleApply = async (e) => {
// // //     e.preventDefault();
// // //     if (serialList.length === 0) {
// // //       toast.error("Please add at least one serial number");
// // //       return;
// // //     }

// // //     // Batch mode — just return serials to parent, no API call here
// // //     if (batchMode) {
// // //       onBatchSerialApply?.(serialList);
// // //       return;
// // //     }

// // //     // Normal mode — POST to API if GRN already saved
// // //     if (stockReceiptId && itemId) {
// // //       setIsSubmitting(true);
// // //       try {
// // //         const result = await stockReceiptApiProvider.addSerialNumbers(
// // //           stockReceiptId, itemId, serialList
// // //         );
// // //         if (result) {
// // //           toast.success("Serial numbers saved successfully");
// // //           onApply?.(serialList);
// // //           setStockDim({
// // //             serialBox: false, batchBox: false,
// // //             activeRow: null, activeProduct: null, activeItemId: null,
// // //           });
// // //         }
// // //       } catch {
// // //         toast.error("Failed to save serial numbers");
// // //       } finally {
// // //         setIsSubmitting(false);
// // //       }
// // //     } else {
// // //       toast.info("Serial numbers will be submitted when you save the draft");
// // //       onApply?.(serialList);
// // //       setStockDim({
// // //         serialBox: false, batchBox: false,
// // //         activeRow: null, activeProduct: null, activeItemId: null,
// // //       });
// // //     }
// // //   };

// // //   const limitQty    = batchMode ? parseInt(batchQty) || 0 : parseInt(activeProduct?.accepted_qty) || 0;
// // //   const isOverLimit = serialList.length > limitQty && limitQty > 0;

// // //   return (
// // //     <div className="ssn-overlay">
// // //       <div className="ssn-modal">

// // //         {/* ── TITLE ── */}
// // //         <div className="ssn-title-row">
// // //           <h3 className="ssn-title">
// // //             {batchMode
// // //               ? `Generate Serial Numbers by Batch`
// // //               : "Generate Serial Numbers"}
// // //           </h3>
// // //         </div>

// // //         {/* ── PRODUCT / BATCH INFO GRID ── */}
// // //         {batchMode ? (
// // //           /* Batch mode: 3 fields in one row */
// // //           <div className="ssn-info-grid">
// // //             <div className="ssn-info-field">
// // //               <label>Batch number</label>
// // //               <input value={batchNo} disabled />
// // //             </div>
// // //             <div className="ssn-info-field">
// // //               <label>Batch Quantity</label>
// // //               <input value={batchQty} disabled />
// // //             </div>
// // //             <div className="ssn-info-field">
// // //               <label>Serials Generated</label>
// // //               <input
// // //                 value={serialList.length}
// // //                 disabled
// // //                 className={isOverLimit ? "ssn-over-limit" : ""}
// // //               />
// // //             </div>
// // //           </div>
// // //         ) : (
// // //           /* Normal mode: row1 = 4 fields, row2 = 3 fields */
// // //           <>
// // //             <div className="ssn-info-grid">
// // //               <div className="ssn-info-field">
// // //                 <label>Product Name</label>
// // //                 <input value={activeProduct?.product_name || ""} disabled />
// // //               </div>
// // //               <div className="ssn-info-field">
// // //                 <label>Product ID</label>
// // //                 <input value={activeProduct?.product_id || ""} disabled />
// // //               </div>
// // //               <div className="ssn-info-field">
// // //                 <label>UOM</label>
// // //                 <input value={activeProduct?.uom || ""} disabled />
// // //               </div>
// // //               <div className="ssn-info-field">
// // //                 <label>Stock Dim.</label>
// // //                 <select
// // //                   value="Serial"
// // //                   onChange={() =>
// // //                     setStockDim({
// // //                       serialBox: false, batchBox: true,
// // //                       activeRow: null, activeProduct: activeProduct, activeItemId: itemId,
// // //                     })
// // //                   }
// // //                 >
// // //                   <option value="Serial">Serial</option>
// // //                   <option value="Batch">Batch</option>
// // //                 </select>
// // //               </div>
// // //             </div>
// // //             <div className="ssn-info-grid">
// // //               <div className="ssn-info-field">
// // //                 <label>Qty Received</label>
// // //                 <input value={activeProduct?.qty_received ?? ""} disabled />
// // //               </div>
// // //               <div className="ssn-info-field">
// // //                 <label>Accepted Qty</label>
// // //                 <input value={activeProduct?.accepted_qty ?? ""} disabled />
// // //               </div>
// // //               <div className="ssn-info-field ssn-info-field--full">
// // //                 <label>Serials Generated</label>
// // //                 <input
// // //                   value={serialList.length}
// // //                   disabled
// // //                   className={isOverLimit ? "ssn-over-limit" : ""}
// // //                 />
// // //               </div>
// // //             </div>
// // //           </>
// // //         )}

// // //         {isOverLimit && (
// // //           <p className="ssn-overlimit-msg">
// // //             ⚠ Serial numbers exceed {batchMode ? "batch" : "accepted"} quantity ({limitQty})
// // //           </p>
// // //         )}

// // //         {/* ── BODY ── */}
// // //         <div className="ssn-body">

// // //           {/* LEFT PANEL */}
// // //           <div className="ssn-left">

// // //             {/* Add Serial Input */}
// // //             <div className="ssn-input-card">
// // //               <div className="ssn-input-row">
// // //                 <label htmlFor="ssn-serial-no">Serial No :</label>
// // //                 <input
// // //                   id="ssn-serial-no"
// // //                   type="text"
// // //                   placeholder="Enter Serial Number"
// // //                   value={serialInput}
// // //                   onChange={(e) => setSerialInput(e.target.value)}
// // //                   onKeyDown={(e) => { if (e.key === "Enter") handleAddSerial(e); }}
// // //                 />
// // //               </div>
// // //               <button
// // //                 type="button"
// // //                 className={serialInput.trim() ? "ssn-add-btn ssn-add-btn--active" : "ssn-add-btn ssn-add-btn--inactive"}
// // //                 disabled={!serialInput.trim()}
// // //                 onClick={handleAddSerial}
// // //               >
// // //                 Add Serial
// // //               </button>
// // //             </div>

// // //             {/* Import Toggle */}
// // //             <p
// // //               className={`ssn-import-toggle ${importBox ? "ssn-import-toggle--open" : ""}`}
// // //               onClick={() => setImportBox(!importBox)}
// // //             >
// // //               Import Serial Numbers
// // //             </p>

// // //             {/* Import Box */}
// // //             {importBox && (
// // //               <div className="ssn-input-card ssn-import-card">
// // //                 <div className="ssn-input-row ssn-input-row--textarea">
// // //                   <textarea
// // //                     placeholder="Enter Serial Numbers (e.g., Item-001, Item-002, ...)"
// // //                     value={importText}
// // //                     onChange={(e) => setImportText(e.target.value)}
// // //                     rows={4}
// // //                   />
// // //                 </div>
// // //                 <button
// // //                   type="button"
// // //                   className={importText.trim() ? "ssn-add-btn ssn-add-btn--active" : "ssn-add-btn ssn-add-btn--inactive"}
// // //                   disabled={!importText.trim()}
// // //                   onClick={handleImport}
// // //                 >
// // //                   Import
// // //                 </button>
// // //               </div>
// // //             )}

// // //             {/* Duplicates */}
// // //             <div className="ssn-dup-section">
// // //               <p className="ssn-dup-label">Duplicate Numbers</p>
// // //               <textarea
// // //                 className="ssn-dup-box"
// // //                 value={duplicates.join(", ")}
// // //                 placeholder="Not found"
// // //                 disabled
// // //                 style={{ color: duplicates.length > 0 ? "#e53e3e" : "#b0b0b0" }}
// // //                 rows={3}
// // //               />
// // //             </div>
// // //           </div>

// // //           {/* RIGHT PANEL — Serial Table */}
// // //           <div className="ssn-right">
// // //             <table className="ssn-table">
// // //               <thead>
// // //                 <tr>
// // //                   <th>S.No</th>
// // //                   <th>Serial No</th>
// // //                   <th>Action</th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody>
// // //                 {serialList.length === 0 ? (
// // //                   <tr>
// // //                     <td colSpan={3} className="ssn-empty-row">
// // //                       No serial numbers generated
// // //                     </td>
// // //                   </tr>
// // //                 ) : (
// // //                   serialList.map((serial, idx) => (
// // //                     <tr key={idx}>
// // //                       <td>{idx + 1}</td>
// // //                       <td>{serial}</td>
// // //                       <td>
// // //                         <button
// // //                           type="button"
// // //                           className="ssn-remove-btn"
// // //                           onClick={() => handleRemove(serial)}
// // //                           title="Remove"
// // //                         >
// // //                           <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 16" fill="none">
// // //                             <path d="M2.625 16C2.14375 16 1.73192 15.8261 1.3895 15.4782C1.04708 15.1304 0.875583 14.7117 0.875 14.2222V2.66667H0V0.888889H4.375V0H9.625V0.888889H14V2.66667H13.125V14.2222C13.125 14.7111 12.9538 15.1298 12.6114 15.4782C12.269 15.8267 11.8568 16.0006 11.375 16H2.625ZM4.375 12.4444H6.125V4.44444H4.375V12.4444ZM7.875 12.4444H9.625V4.44444H7.875V12.4444Z" fill="#234E70"/>
// // //                           </svg>
// // //                         </button>
// // //                       </td>
// // //                     </tr>
// // //                   ))
// // //                 )}
// // //               </tbody>
// // //             </table>
// // //           </div>
// // //         </div>

// // //         {/* ── FOOTER ── */}
// // //         <div className="ssn-footer">
// // //           <button type="button" className="ssn-cancel-btn" onClick={handleClose}>
// // //             Cancel
// // //           </button>
// // //           <button
// // //             type="button"
// // //             className={
// // //               serialList.length === 0 || isOverLimit || isSubmitting
// // //                 ? "ssn-apply-btn ssn-apply-btn--disabled"
// // //                 : "ssn-apply-btn ssn-apply-btn--active"
// // //             }
// // //             disabled={serialList.length === 0 || isOverLimit || isSubmitting}
// // //             onClick={handleApply}
// // //           >
// // //             {isSubmitting ? "Saving..." : "Apply"}
// // //           </button>
// // //         </div>

// // //       </div>
// // //     </div>
// // //   );
// // // }
// // import React, { useState } from "react";
// // import { toast } from "react-toastify";
// // import stockReceiptApiProvider from "../../../../network/stockReceipt-api-provider";

// // const S = {
// //   overlay: {
// //     position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
// //     display: "flex", justifyContent: "center", alignItems: "center",
// //     zIndex: 1000, padding: "20px", boxSizing: "border-box",
// //   },
// //   modal: {
// //     background: "#fff", borderRadius: "12px",
// //     boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
// //     width: "100%", maxWidth: "860px", maxHeight: "90vh",
// //     overflowY: "auto", padding: "24px 28px",
// //     display: "flex", flexDirection: "column", gap: "14px",
// //     boxSizing: "border-box",
// //   },
// //   title: {
// //     fontSize: "18px", fontWeight: 700,
// //     color: "rgba(35,78,112,1)", textAlign: "center", margin: 0,
// //   },
// //   infoGrid: {
// //     display: "grid", gap: "10px 14px",
// //     gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
// //     paddingBottom: "10px",
// //     borderBottom: "1px solid rgba(0,0,0,0.08)",
// //   },
// //   infoField: { display: "flex", flexDirection: "column", gap: "4px" },
// //   infoLabel: {
// //     fontSize: "12px", fontWeight: 500,
// //     color: "rgba(42,42,42,0.85)", whiteSpace: "nowrap",
// //   },
// //   infoInput: {
// //     border: "1px solid rgba(35,78,112,0.5)", borderRadius: "8px",
// //     padding: "6px 10px", fontSize: "13px", color: "#1a1a1a",
// //     background: "rgba(242,242,242,0.8)", width: "100%",
// //     outline: "none", boxSizing: "border-box", height: "36px",
// //     cursor: "default",
// //   },
// //   infoSelect: {
// //     border: "1px solid rgba(35,78,112,0.5)", borderRadius: "8px",
// //     padding: "6px 10px", fontSize: "13px", color: "#1a1a1a",
// //     background: "#fff", width: "100%", outline: "none",
// //     boxSizing: "border-box", height: "36px", cursor: "pointer",
// //   },
// //   overLimitInput: { borderColor: "#e53e3e", color: "#e53e3e" },
// //   overLimitMsg: { color: "#e53e3e", fontSize: "12px", fontWeight: 500, margin: 0 },
// //   body: { display: "flex", gap: "16px", minHeight: "300px" },
// //   left: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "12px" },
// //   inputCard: {
// //     border: "1px solid rgba(0,0,0,0.13)", borderRadius: "10px", overflow: "hidden",
// //   },
// //   inputRow: { display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px" },
// //   inputLabel: {
// //     fontSize: "13px", fontWeight: 500, color: "rgba(35,78,112,1)",
// //     whiteSpace: "nowrap", minWidth: "70px",
// //   },
// //   textInput: {
// //     flex: 1, minWidth: 0, border: "1px solid rgba(224,228,231,1)",
// //     borderRadius: "6px", padding: "5px 10px", fontSize: "13px",
// //     background: "transparent", outline: "none", color: "#1a1a1a",
// //     height: "32px", boxSizing: "border-box",
// //   },
// //   textarea: {
// //     width: "100%", border: "1px solid rgba(224,228,231,1)",
// //     borderRadius: "6px", padding: "6px 10px", fontSize: "13px",
// //     background: "transparent", outline: "none", resize: "vertical",
// //     color: "#1a1a1a", fontFamily: "inherit", minHeight: "72px",
// //     boxSizing: "border-box",
// //   },
// //   addBtnActive: {
// //     width: "100%", padding: "10px 0", border: "none", fontSize: "13px",
// //     fontWeight: 600, cursor: "pointer", display: "block",
// //     background: "rgba(34,197,94,1)", color: "#fff",
// //   },
// //   addBtnInactive: {
// //     width: "100%", padding: "10px 0", border: "none", fontSize: "13px",
// //     fontWeight: 600, cursor: "not-allowed", display: "block",
// //     background: "rgba(176,176,176,1)", color: "#fff",
// //   },
// //   importToggle: {
// //     fontSize: "13px", fontWeight: 500, color: "rgba(35,78,112,1)",
// //     cursor: "pointer", userSelect: "none", width: "max-content",
// //   },
// //   dupSection: { marginTop: "auto", display: "flex", flexDirection: "column", gap: "4px" },
// //   dupLabel: { fontSize: "13px", fontWeight: 500, color: "#1a1a1a", margin: 0 },
// //   dupBox: {
// //     width: "100%", background: "rgba(249,249,249,1)",
// //     border: "1px solid rgba(226,226,226,1)", borderRadius: "8px",
// //     padding: "10px 14px", fontSize: "13px", resize: "none",
// //     minHeight: "56px", fontFamily: "inherit", boxSizing: "border-box",
// //   },
// //   right: {
// //     flex: 1, minWidth: 0, background: "rgba(242,242,242,1)",
// //     borderRadius: "10px", border: "1px solid rgba(0,0,0,0.1)", overflow: "auto",
// //   },
// //   table: { width: "100%", borderCollapse: "collapse" },
// //   th: {
// //     fontSize: "13px", fontWeight: 600, color: "rgba(35,78,112,1)",
// //     background: "#fff", padding: "11px 16px",
// //     borderBottom: "1px solid rgba(0,0,0,0.1)", textAlign: "left",
// //     position: "sticky", top: 0, zIndex: 1,
// //   },
// //   td: {
// //     fontSize: "13px", fontWeight: 400, color: "#1a1a1a",
// //     background: "#fff", padding: "10px 16px",
// //     borderBottom: "1px solid rgba(0,0,0,0.07)", textAlign: "left",
// //   },
// //   emptyTd: {
// //     fontSize: "13px", color: "#999", padding: "32px 16px",
// //     textAlign: "center", background: "#fff",
// //   },
// //   removeBtn: {
// //     background: "none", border: "none", cursor: "pointer",
// //     padding: "3px 5px", display: "flex", alignItems: "center",
// //     borderRadius: "4px",
// //   },
// //   footer: {
// //     display: "flex", justifyContent: "flex-end", alignItems: "center",
// //     gap: "12px", paddingTop: "10px",
// //     borderTop: "1px solid rgba(0,0,0,0.07)",
// //   },
// //   cancelBtn: {
// //     padding: "6px 20px", borderRadius: "7px",
// //     border: "2px solid rgba(35,78,112,1)", color: "rgba(35,78,112,1)",
// //     fontSize: "14px", fontWeight: 600, background: "#fff", cursor: "pointer",
// //   },
// //   applyBtnActive: {
// //     padding: "6px 20px", borderRadius: "7px", fontSize: "14px",
// //     fontWeight: 600, cursor: "pointer",
// //     background: "rgba(35,78,112,1)", color: "#fff",
// //     border: "2px solid rgba(35,78,112,1)",
// //   },
// //   applyBtnDisabled: {
// //     padding: "6px 20px", borderRadius: "7px", fontSize: "14px",
// //     fontWeight: 600, cursor: "not-allowed",
// //     background: "#fff", color: "rgba(176,176,176,1)",
// //     border: "2px solid rgba(176,176,176,1)",
// //   },
// // };

// // export default function StockSerialNumber({
// //   setStockDim,
// //   activeProduct,
// //   stockReceiptId,
// //   itemId,
// //   onApply,
// //   batchMode = false,
// //   batchNo = "",
// //   batchQty = 0,
// //   onBatchSerialApply,
// // }) {
// //   const [serialInput, setSerialInput]   = useState("");
// //   const [importText, setImportText]     = useState("");
// //   const [importBox, setImportBox]       = useState(false);
// //   const [serialList, setSerialList]     = useState([]);
// //   const [duplicates, setDuplicates]     = useState([]);
// //   const [isSubmitting, setIsSubmitting] = useState(false);

// //   const addSerials = (raw) => {
// //     const incoming = raw.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
// //     const dups = [], toAdd = [];
// //     incoming.forEach((s) => {
// //       if (serialList.includes(s)) dups.push(s);
// //       else toAdd.push(s);
// //     });
// //     setDuplicates(dups);
// //     if (toAdd.length > 0) setSerialList((prev) => [...prev, ...toAdd]);
// //     return toAdd.length;
// //   };

// //   const handleAddSerial = (e) => {
// //     e.preventDefault();
// //     if (!serialInput.trim()) return;
// //     if (serialList.includes(serialInput.trim())) {
// //       setDuplicates([serialInput.trim()]);
// //       return;
// //     }
// //     setDuplicates([]);
// //     setSerialList((prev) => [...prev, serialInput.trim()]);
// //     setSerialInput("");
// //   };

// //   const handleImport = (e) => {
// //     e.preventDefault();
// //     if (!importText.trim()) return;
// //     const added = addSerials(importText);
// //     if (added > 0) toast.success(`${added} serial number(s) imported`);
// //     setImportText("");
// //     setImportBox(false);
// //   };

// //   const handleRemove = (serial) => {
// //     setSerialList((prev) => prev.filter((s) => s !== serial));
// //     setDuplicates((prev) => prev.filter((s) => s !== serial));
// //   };

// //   const handleClose = () => {
// //     if (batchMode) { onBatchSerialApply?.(null); return; }
// //     setStockDim({ serialBox: false, batchBox: false, activeRow: null, activeProduct: null, activeItemId: null });
// //   };

// //   const handleApply = async (e) => {
// //     e.preventDefault();
// //     if (serialList.length === 0) { toast.error("Please add at least one serial number"); return; }
// //     if (batchMode) { onBatchSerialApply?.(serialList); return; }
// //     if (stockReceiptId && itemId) {
// //       setIsSubmitting(true);
// //       try {
// //         const result = await stockReceiptApiProvider.addSerialNumbers(stockReceiptId, itemId, serialList);
// //         if (result) {
// //           toast.success("Serial numbers saved successfully");
// //           onApply?.(serialList);
// //           setStockDim({ serialBox: false, batchBox: false, activeRow: null, activeProduct: null, activeItemId: null });
// //         }
// //       } catch { toast.error("Failed to save serial numbers"); }
// //       finally { setIsSubmitting(false); }
// //     } else {
// //       toast.info("Serial numbers will be submitted when you save the draft");
// //       onApply?.(serialList);
// //       setStockDim({ serialBox: false, batchBox: false, activeRow: null, activeProduct: null, activeItemId: null });
// //     }
// //   };

// //   const limitQty    = batchMode ? parseInt(batchQty) || 0 : parseInt(activeProduct?.accepted_qty) || 0;
// //   const isOverLimit = limitQty > 0 && serialList.length > limitQty;

// //   return (
// //     <div style={S.overlay}>
// //       <div style={S.modal}>

// //         {/* TITLE */}
// //         <div style={{ textAlign: "center" }}>
// //           <h3 style={S.title}>{batchMode ? "Generate Serial Numbers by Batch" : "Generate Serial Numbers"}</h3>
// //         </div>

// //         {/* INFO GRID */}
// //         {batchMode ? (
// //           <div style={S.infoGrid}>
// //             {[
// //               { label: "Batch number",      value: batchNo },
// //               { label: "Batch Quantity",     value: batchQty },
// //               { label: "Serials Generated",  value: serialList.length, over: isOverLimit },
// //             ].map(({ label, value, over }) => (
// //               <div key={label} style={S.infoField}>
// //                 <label style={S.infoLabel}>{label}</label>
// //                 <input style={{ ...S.infoInput, ...(over ? S.overLimitInput : {}) }} value={value} disabled />
// //               </div>
// //             ))}
// //           </div>
// //         ) : (
// //           <>
// //             {/* Row 1 — 4 fields */}
// //             <div style={S.infoGrid}>
// //               <div style={S.infoField}>
// //                 <label style={S.infoLabel}>Product Name</label>
// //                 <input style={S.infoInput} value={activeProduct?.product_name || ""} disabled />
// //               </div>
// //               <div style={S.infoField}>
// //                 <label style={S.infoLabel}>Product ID</label>
// //                 <input style={S.infoInput} value={activeProduct?.product_id || ""} disabled />
// //               </div>
// //               <div style={S.infoField}>
// //                 <label style={S.infoLabel}>UOM</label>
// //                 <input style={S.infoInput} value={activeProduct?.uom || ""} disabled />
// //               </div>
// //               <div style={S.infoField}>
// //                 <label style={S.infoLabel}>Stock Dim.</label>
// //                 <select
// //                   style={S.infoSelect}
// //                   value="Serial"
// //                   onChange={() => setStockDim({ serialBox: false, batchBox: true, activeRow: null, activeProduct: activeProduct, activeItemId: itemId })}
// //                 >
// //                   <option value="Serial">Serial</option>
// //                   <option value="Batch">Batch</option>
// //                 </select>
// //               </div>
// //             </div>
// //             {/* Row 2 — 3 fields */}
// //             <div style={{ ...S.infoGrid, gridTemplateColumns: "1fr 1fr 1fr" }}>
// //               <div style={S.infoField}>
// //                 <label style={S.infoLabel}>Qty Received</label>
// //                 <input style={S.infoInput} value={activeProduct?.qty_received ?? ""} disabled />
// //               </div>
// //               <div style={S.infoField}>
// //                 <label style={S.infoLabel}>Accepted Qty</label>
// //                 <input style={S.infoInput} value={activeProduct?.accepted_qty ?? ""} disabled />
// //               </div>
// //               <div style={S.infoField}>
// //                 <label style={S.infoLabel}>Serials Generated</label>
// //                 <input style={{ ...S.infoInput, ...(isOverLimit ? S.overLimitInput : {}) }} value={serialList.length} disabled />
// //               </div>
// //             </div>
// //           </>
// //         )}

// //         {isOverLimit && (
// //           <p style={S.overLimitMsg}>⚠ Serial numbers exceed {batchMode ? "batch" : "accepted"} quantity ({limitQty})</p>
// //         )}

// //         {/* BODY */}
// //         <div style={S.body}>

// //           {/* LEFT */}
// //           <div style={S.left}>

// //             {/* Add Serial card */}
// //             <div style={S.inputCard}>
// //               <div style={S.inputRow}>
// //                 <label style={S.inputLabel}>Serial No :</label>
// //                 <input
// //                   style={S.textInput}
// //                   type="text"
// //                   placeholder="Enter Serial Number"
// //                   value={serialInput}
// //                   onChange={(e) => setSerialInput(e.target.value)}
// //                   onKeyDown={(e) => { if (e.key === "Enter") handleAddSerial(e); }}
// //                 />
// //               </div>
// //               <button
// //                 type="button"
// //                 style={serialInput.trim() ? S.addBtnActive : S.addBtnInactive}
// //                 disabled={!serialInput.trim()}
// //                 onClick={handleAddSerial}
// //               >
// //                 Add Serial
// //               </button>
// //             </div>

// //             {/* Import toggle */}
// //             <p style={S.importToggle} onClick={() => setImportBox(!importBox)}>
// //               Import Serial Numbers
// //             </p>

// //             {/* Import box */}
// //             {importBox && (
// //               <div style={S.inputCard}>
// //                 <div style={{ ...S.inputRow, alignItems: "flex-start", flexDirection: "column" }}>
// //                   <textarea
// //                     style={S.textarea}
// //                     placeholder="Enter Serial Numbers (e.g., Item-001, Item-002, ...)"
// //                     value={importText}
// //                     onChange={(e) => setImportText(e.target.value)}
// //                     rows={4}
// //                   />
// //                 </div>
// //                 <button
// //                   type="button"
// //                   style={importText.trim() ? S.addBtnActive : S.addBtnInactive}
// //                   disabled={!importText.trim()}
// //                   onClick={handleImport}
// //                 >
// //                   Import
// //                 </button>
// //               </div>
// //             )}

// //             {/* Duplicates */}
// //             <div style={S.dupSection}>
// //               <p style={S.dupLabel}>Duplicate Numbers</p>
// //               <textarea
// //                 style={{ ...S.dupBox, color: duplicates.length > 0 ? "#e53e3e" : "#b0b0b0" }}
// //                 value={duplicates.join(", ")}
// //                 placeholder="Not found"
// //                 disabled
// //                 rows={3}
// //               />
// //             </div>
// //           </div>

// //           {/* RIGHT — table */}
// //           <div style={S.right}>
// //             <table style={S.table}>
// //               <thead>
// //                 <tr>
// //                   <th style={S.th}>S.No</th>
// //                   <th style={S.th}>Serial No</th>
// //                   <th style={S.th}>Action</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {serialList.length === 0 ? (
// //                   <tr><td colSpan={3} style={S.emptyTd}>No serial numbers generated</td></tr>
// //                 ) : serialList.map((serial, idx) => (
// //                   <tr key={idx}>
// //                     <td style={S.td}>{idx + 1}</td>
// //                     <td style={S.td}>{serial}</td>
// //                     <td style={S.td}>
// //                       <button type="button" style={S.removeBtn} onClick={() => handleRemove(serial)} title="Remove">
// //                         <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 16" fill="none">
// //                           <path d="M2.625 16C2.14375 16 1.73192 15.8261 1.3895 15.4782C1.04708 15.1304 0.875583 14.7117 0.875 14.2222V2.66667H0V0.888889H4.375V0H9.625V0.888889H14V2.66667H13.125V14.2222C13.125 14.7111 12.9538 15.1298 12.6114 15.4782C12.269 15.8267 11.8568 16.0006 11.375 16H2.625ZM4.375 12.4444H6.125V4.44444H4.375V12.4444ZM7.875 12.4444H9.625V4.44444H7.875V12.4444Z" fill="#234E70"/>
// //                         </svg>
// //                       </button>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>

// //         {/* FOOTER */}
// //         <div style={S.footer}>
// //           <button type="button" style={S.cancelBtn} onClick={handleClose}>Cancel</button>
// //           <button
// //             type="button"
// //             style={serialList.length === 0 || isOverLimit || isSubmitting ? S.applyBtnDisabled : S.applyBtnActive}
// //             disabled={serialList.length === 0 || isOverLimit || isSubmitting}
// //             onClick={handleApply}
// //           >
// //             {isSubmitting ? "Saving..." : "Apply"}
// //           </button>
// //         </div>

// //       </div>
// //     </div>
// //   );
// // }
// import React, { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import stockReceiptApiProvider from "../../../../network/stockReceipt-api-provider";

// const S = {
//   overlay: {
//     position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
//     display: "flex", justifyContent: "center", alignItems: "center",
//     zIndex: 9999, padding: "20px", boxSizing: "border-box",
//   },
//   modal: {
//     background: "#fff", borderRadius: "12px",
//     boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
//     width: "100%", maxWidth: "860px", maxHeight: "90vh",
//     overflowY: "auto", padding: "24px 28px",
//     display: "flex", flexDirection: "column", gap: "14px",
//     boxSizing: "border-box",
//   },
//   title: {
//     fontSize: "18px", fontWeight: 700,
//     color: "rgba(35,78,112,1)", textAlign: "center", margin: 0,
//   },
//   infoGrid4: {
//     display: "grid", gap: "10px 14px",
//     gridTemplateColumns: "repeat(4, 1fr)",
//     paddingBottom: "10px",
//   },
//   infoGrid3: {
//     display: "grid", gap: "10px 14px",
//     gridTemplateColumns: "repeat(3, 1fr)",
//     paddingBottom: "10px",
//     borderBottom: "1px solid rgba(0,0,0,0.08)",
//     marginBottom: "4px",
//   },
//   infoGrid3Batch: {
//     display: "grid", gap: "10px 14px",
//     gridTemplateColumns: "repeat(3, 1fr)",
//     paddingBottom: "14px",
//     borderBottom: "1px solid rgba(0,0,0,0.08)",
//   },
//   infoField: { display: "flex", flexDirection: "column", gap: "4px" },
//   infoLabel: {
//     fontSize: "12px", fontWeight: 500,
//     color: "rgba(42,42,42,0.85)",
//   },
//   infoInput: {
//     border: "1px solid rgba(35,78,112,0.5)", borderRadius: "8px",
//     padding: "6px 10px", fontSize: "13px", color: "#555",
//     background: "rgba(242,242,242,0.8)", width: "100%",
//     outline: "none", boxSizing: "border-box", height: "36px",
//     cursor: "default",
//   },
//   infoSelect: {
//     border: "1px solid rgba(35,78,112,0.5)", borderRadius: "8px",
//     padding: "6px 10px", fontSize: "13px", color: "#1a1a1a",
//     background: "#fff", width: "100%", outline: "none",
//     boxSizing: "border-box", height: "36px", cursor: "pointer",
//   },
//   overLimitInput: { borderColor: "#e53e3e", color: "#e53e3e" },
//   overLimitMsg: { color: "#e53e3e", fontSize: "12px", fontWeight: 500, margin: 0 },
//   body: { display: "flex", gap: "16px", minHeight: "300px" },
//   left: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "12px" },
//   inputCard: { border: "1px solid rgba(0,0,0,0.13)", borderRadius: "10px", overflow: "hidden" },
//   inputRow: { display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px" },
//   inputLabel: {
//     fontSize: "13px", fontWeight: 500, color: "rgba(35,78,112,1)",
//     whiteSpace: "nowrap", minWidth: "70px",
//   },
//   textInput: {
//     flex: 1, minWidth: 0, border: "1px solid rgba(224,228,231,1)",
//     borderRadius: "6px", padding: "5px 10px", fontSize: "13px",
//     background: "transparent", outline: "none", color: "#1a1a1a",
//     height: "32px", boxSizing: "border-box",
//   },
//   textarea: {
//     width: "100%", border: "1px solid rgba(224,228,231,1)",
//     borderRadius: "6px", padding: "8px 10px", fontSize: "13px",
//     background: "transparent", outline: "none", resize: "vertical",
//     color: "#1a1a1a", fontFamily: "inherit", minHeight: "72px",
//     boxSizing: "border-box",
//   },
//   addBtnActive: {
//     width: "100%", padding: "10px 0", border: "none", fontSize: "13px",
//     fontWeight: 600, cursor: "pointer", display: "block",
//     background: "rgba(34,197,94,1)", color: "#fff",
//   },
//   addBtnInactive: {
//     width: "100%", padding: "10px 0", border: "none", fontSize: "13px",
//     fontWeight: 600, cursor: "not-allowed", display: "block",
//     background: "rgba(176,176,176,1)", color: "#fff",
//   },
//   importToggle: {
//     fontSize: "13px", fontWeight: 500, color: "rgba(35,78,112,1)",
//     cursor: "pointer", userSelect: "none", width: "max-content",
//   },
//   dupSection: { marginTop: "auto", display: "flex", flexDirection: "column", gap: "4px" },
//   dupLabel: { fontSize: "13px", fontWeight: 500, color: "#1a1a1a", margin: 0 },
//   dupBox: {
//     width: "100%", background: "rgba(249,249,249,1)",
//     border: "1px solid rgba(226,226,226,1)", borderRadius: "8px",
//     padding: "10px 14px", fontSize: "13px", resize: "none",
//     minHeight: "56px", fontFamily: "inherit", boxSizing: "border-box",
//   },
//   right: {
//     flex: 1, minWidth: 0, background: "rgba(242,242,242,1)",
//     borderRadius: "10px", border: "1px solid rgba(0,0,0,0.1)", overflow: "auto",
//   },
//   table: { width: "100%", borderCollapse: "collapse" },
//   th: {
//     fontSize: "13px", fontWeight: 600, color: "rgba(35,78,112,1)",
//     background: "#fff", padding: "11px 16px",
//     borderBottom: "1px solid rgba(0,0,0,0.1)", textAlign: "left",
//     position: "sticky", top: 0, zIndex: 1,
//   },
//   td: {
//     fontSize: "13px", color: "#1a1a1a", background: "#fff",
//     padding: "10px 16px", borderBottom: "1px solid rgba(0,0,0,0.07)", textAlign: "left",
//   },
//   emptyTd: {
//     fontSize: "13px", color: "#999", padding: "32px 16px",
//     textAlign: "center", background: "#fff",
//   },
//   removeBtn: {
//     background: "none", border: "none", cursor: "pointer",
//     padding: "3px 5px", display: "flex", alignItems: "center", borderRadius: "4px",
//   },
//   footer: {
//     display: "flex", justifyContent: "flex-end", alignItems: "center",
//     gap: "12px", paddingTop: "10px", borderTop: "1px solid rgba(0,0,0,0.07)",
//   },
//   cancelBtn: {
//     padding: "6px 20px", borderRadius: "7px",
//     border: "2px solid rgba(35,78,112,1)", color: "rgba(35,78,112,1)",
//     fontSize: "14px", fontWeight: 600, background: "#fff", cursor: "pointer",
//   },
//   applyBtnActive: {
//     padding: "6px 20px", borderRadius: "7px", fontSize: "14px",
//     fontWeight: 600, cursor: "pointer",
//     background: "rgba(35,78,112,1)", color: "#fff",
//     border: "2px solid rgba(35,78,112,1)",
//   },
//   applyBtnDisabled: {
//     padding: "6px 20px", borderRadius: "7px", fontSize: "14px",
//     fontWeight: 600, cursor: "not-allowed",
//     background: "#fff", color: "rgba(176,176,176,1)",
//     border: "2px solid rgba(176,176,176,1)",
//   },
//   loadingTd: {
//     fontSize: "13px", color: "#666", padding: "24px 16px",
//     textAlign: "center", background: "#fff",
//   },
// };

// export default function StockSerialNumber({
//   setStockDim,
//   activeProduct,
//   stockReceiptId,
//   itemId,
//   onApply,
//   batchMode = false,
//   batchNo = "",
//   batchQty = 0,
//   onBatchSerialApply,
//   // existing serials passed from parent line item (already mapped)
//   existingSerials = [],
// }) {
//   const [serialInput, setSerialInput]   = useState("");
//   const [importText, setImportText]     = useState("");
//   const [importBox, setImportBox]       = useState(false);
//   const [serialList, setSerialList]     = useState([]);
//   const [duplicates, setDuplicates]     = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isFetching, setIsFetching]     = useState(false);

//   // ── On open: load existing serials from API if itemId is available ─────
//   useEffect(() => {
//     const load = async () => {
//       // If parent already passed existing serials, use them directly
//       if (existingSerials && existingSerials.length > 0) {
//         setSerialList(existingSerials);
//         return;
//       }
//       // Otherwise fetch from API if we have the IDs
//       if (!stockReceiptId || !itemId || batchMode) return;
//       setIsFetching(true);
//       try {
//         const detail = await stockReceiptApiProvider.fetchSingleStockReceipt(stockReceiptId);
//         if (!detail) return;
//         const item = (detail.items || []).find((i) => i.id === itemId);
//         if (item?.serial_numbers?.length > 0) {
//           setSerialList(item.serial_numbers.map((s) => s.serial_no));
//         }
//       } catch (err) {
//         console.error("Failed to fetch existing serials:", err);
//       } finally {
//         setIsFetching(false);
//       }
//     };
//     load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ── helpers ───────────────────────────────────────────────────────────
//   const addSerials = (raw) => {
//     const incoming = raw.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
//     const dups = [], toAdd = [];
//     incoming.forEach((s) => {
//       if (serialList.includes(s)) dups.push(s);
//       else toAdd.push(s);
//     });
//     setDuplicates(dups);
//     if (toAdd.length > 0) setSerialList((prev) => [...prev, ...toAdd]);
//     return toAdd.length;
//   };

//   const handleAddSerial = (e) => {
//     e.preventDefault();
//     if (!serialInput.trim()) return;
//     if (serialList.includes(serialInput.trim())) {
//       setDuplicates([serialInput.trim()]);
//       return;
//     }
//     setDuplicates([]);
//     setSerialList((prev) => [...prev, serialInput.trim()]);
//     setSerialInput("");
//   };

//   const handleImport = (e) => {
//     e.preventDefault();
//     if (!importText.trim()) return;
//     const added = addSerials(importText);
//     if (added > 0) toast.success(`${added} serial number(s) imported`);
//     setImportText("");
//     setImportBox(false);
//   };

//   const handleRemove = (serial) => {
//     setSerialList((prev) => prev.filter((s) => s !== serial));
//     setDuplicates((prev) => prev.filter((s) => s !== serial));
//   };

//   const handleClose = () => {
//     if (batchMode) { onBatchSerialApply?.(null); return; }
//     setStockDim({ serialBox: false, batchBox: false, activeRow: null, activeProduct: null, activeItemId: null });
//   };

//   const handleApply = async (e) => {
//     e.preventDefault();
//     if (serialList.length === 0) { toast.error("Please add at least one serial number"); return; }
//     if (batchMode) { onBatchSerialApply?.(serialList); return; }
//     if (stockReceiptId && itemId) {
//       setIsSubmitting(true);
//       try {
//         const result = await stockReceiptApiProvider.addSerialNumbers(stockReceiptId, itemId, serialList);
//         if (result) {
//           toast.success("Serial numbers saved successfully");
//           onApply?.(serialList);
//           setStockDim({ serialBox: false, batchBox: false, activeRow: null, activeProduct: null, activeItemId: null });
//         }
//       } catch { toast.error("Failed to save serial numbers"); }
//       finally { setIsSubmitting(false); }
//     } else {
//       toast.info("Serial numbers will be submitted when you save the draft");
//       onApply?.(serialList);
//       setStockDim({ serialBox: false, batchBox: false, activeRow: null, activeProduct: null, activeItemId: null });
//     }
//   };

//   const limitQty    = batchMode ? parseInt(batchQty) || 0 : parseInt(activeProduct?.accepted_qty) || 0;
//   const isOverLimit = limitQty > 0 && serialList.length > limitQty;

//   return (
//     <div style={S.overlay}>
//       <div style={S.modal}>

//         {/* TITLE */}
//         <div style={{ textAlign: "center" }}>
//           <h3 style={S.title}>{batchMode ? "Generate Serial Numbers by Batch" : "Generate Serial Numbers"}</h3>
//         </div>

//         {/* INFO GRID */}
//         {batchMode ? (
//           <div style={S.infoGrid3Batch}>
//             {[
//               { label: "Batch number",     value: batchNo },
//               { label: "Batch Quantity",   value: batchQty },
//               { label: "Serials Generated", value: serialList.length, over: isOverLimit },
//             ].map(({ label, value, over }) => (
//               <div key={label} style={S.infoField}>
//                 <label style={S.infoLabel}>{label}</label>
//                 <input style={{ ...S.infoInput, ...(over ? S.overLimitInput : {}) }} value={value} disabled />
//               </div>
//             ))}
//           </div>
//         ) : (
//           <>
//             {/* Row 1 — 4 fields */}
//             <div style={S.infoGrid4}>
//               <div style={S.infoField}>
//                 <label style={S.infoLabel}>Product Name</label>
//                 <input style={S.infoInput} value={activeProduct?.product_name || ""} disabled />
//               </div>
//               <div style={S.infoField}>
//                 <label style={S.infoLabel}>Product ID</label>
//                 <input style={S.infoInput} value={activeProduct?.product_id || ""} disabled />
//               </div>
//               <div style={S.infoField}>
//                 <label style={S.infoLabel}>UOM</label>
//                 <input style={S.infoInput} value={activeProduct?.uom || ""} disabled />
//               </div>
//               <div style={S.infoField}>
//                 <label style={S.infoLabel}>Stock Dim.</label>
//                 <select
//                   style={S.infoSelect}
//                   value="Serial"
//                   onChange={() => setStockDim({
//                     serialBox: false, batchBox: true,
//                     activeRow: null, activeProduct: activeProduct, activeItemId: itemId,
//                   })}
//                 >
//                   <option value="Serial">Serial</option>
//                   <option value="Batch">Batch</option>
//                 </select>
//               </div>
//             </div>
//             {/* Row 2 — 3 fields */}
//             <div style={S.infoGrid3}>
//               <div style={S.infoField}>
//                 <label style={S.infoLabel}>Qty Received</label>
//                 <input style={S.infoInput} value={activeProduct?.qty_received ?? ""} disabled />
//               </div>
//               <div style={S.infoField}>
//                 <label style={S.infoLabel}>Accepted Qty</label>
//                 <input style={S.infoInput} value={activeProduct?.accepted_qty ?? ""} disabled />
//               </div>
//               <div style={S.infoField}>
//                 <label style={S.infoLabel}>Serials Generated</label>
//                 <input
//                   style={{ ...S.infoInput, ...(isOverLimit ? S.overLimitInput : {}) }}
//                   value={isFetching ? "Loading..." : serialList.length}
//                   disabled
//                 />
//               </div>
//             </div>
//           </>
//         )}

//         {isOverLimit && (
//           <p style={S.overLimitMsg}>⚠ Serial numbers exceed {batchMode ? "batch" : "accepted"} quantity ({limitQty})</p>
//         )}

//         {/* BODY */}
//         <div style={S.body}>

//           {/* LEFT */}
//           <div style={S.left}>
//             <div style={S.inputCard}>
//               <div style={S.inputRow}>
//                 <label style={S.inputLabel}>Serial No :</label>
//                 <input
//                   style={S.textInput}
//                   type="text"
//                   placeholder="Enter Serial Number"
//                   value={serialInput}
//                   onChange={(e) => setSerialInput(e.target.value)}
//                   onKeyDown={(e) => { if (e.key === "Enter") handleAddSerial(e); }}
//                 />
//               </div>
//               <button
//                 type="button"
//                 style={serialInput.trim() ? S.addBtnActive : S.addBtnInactive}
//                 disabled={!serialInput.trim()}
//                 onClick={handleAddSerial}
//               >
//                 Add Serial
//               </button>
//             </div>

//             <p style={S.importToggle} onClick={() => setImportBox(!importBox)}>
//               Import Serial Numbers
//             </p>

//             {importBox && (
//               <div style={S.inputCard}>
//                 <div style={{ padding: "10px 14px" }}>
//                   <textarea
//                     style={S.textarea}
//                     placeholder="Enter Serial Numbers (e.g., Item-001, Item-002, ...)"
//                     value={importText}
//                     onChange={(e) => setImportText(e.target.value)}
//                     rows={4}
//                   />
//                 </div>
//                 <button
//                   type="button"
//                   style={importText.trim() ? S.addBtnActive : S.addBtnInactive}
//                   disabled={!importText.trim()}
//                   onClick={handleImport}
//                 >
//                   Import
//                 </button>
//               </div>
//             )}

//             <div style={S.dupSection}>
//               <p style={S.dupLabel}>Duplicate Numbers</p>
//               <textarea
//                 style={{ ...S.dupBox, color: duplicates.length > 0 ? "#e53e3e" : "#b0b0b0" }}
//                 value={duplicates.join(", ")}
//                 placeholder="Not found"
//                 disabled
//                 rows={3}
//               />
//             </div>
//           </div>

//           {/* RIGHT */}
//           <div style={S.right}>
//             <table style={S.table}>
//               <thead>
//                 <tr>
//                   <th style={S.th}>S.No</th>
//                   <th style={S.th}>Serial No</th>
//                   <th style={S.th}>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {isFetching ? (
//                   <tr><td colSpan={3} style={S.loadingTd}>Loading existing serial numbers...</td></tr>
//                 ) : serialList.length === 0 ? (
//                   <tr><td colSpan={3} style={S.emptyTd}>No serial numbers generated</td></tr>
//                 ) : serialList.map((serial, idx) => (
//                   <tr key={idx}>
//                     <td style={S.td}>{idx + 1}</td>
//                     <td style={S.td}>{serial}</td>
//                     <td style={S.td}>
//                       <button type="button" style={S.removeBtn} onClick={() => handleRemove(serial)} title="Remove">
//                         <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 16" fill="none">
//                           <path d="M2.625 16C2.14375 16 1.73192 15.8261 1.3895 15.4782C1.04708 15.1304 0.875583 14.7117 0.875 14.2222V2.66667H0V0.888889H4.375V0H9.625V0.888889H14V2.66667H13.125V14.2222C13.125 14.7111 12.9538 15.1298 12.6114 15.4782C12.269 15.8267 11.8568 16.0006 11.375 16H2.625ZM4.375 12.4444H6.125V4.44444H4.375V12.4444ZM7.875 12.4444H9.625V4.44444H7.875V12.4444Z" fill="#234E70"/>
//                         </svg>
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* FOOTER */}
//         <div style={S.footer}>
//           <button type="button" style={S.cancelBtn} onClick={handleClose}>Cancel</button>
//           <button
//             type="button"
//             style={serialList.length === 0 || isOverLimit || isSubmitting ? S.applyBtnDisabled : S.applyBtnActive}
//             disabled={serialList.length === 0 || isOverLimit || isSubmitting}
//             onClick={handleApply}
//           >
//             {isSubmitting ? "Saving..." : "Apply"}
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import stockReceiptApiProvider from "../../../../network/stockReceipt-api-provider";

const S = {
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
    display: "flex", justifyContent: "center", alignItems: "center",
    zIndex: 9999, padding: "20px", boxSizing: "border-box",
  },
  modal: {
    background: "#fff", borderRadius: "12px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
    width: "100%", maxWidth: "860px", maxHeight: "90vh",
    overflowY: "auto", padding: "24px 28px",
    display: "flex", flexDirection: "column", gap: "14px",
    boxSizing: "border-box",
  },
  title: {
    fontSize: "18px", fontWeight: 700,
    color: "rgba(35,78,112,1)", textAlign: "center", margin: 0,
  },
  infoGrid4: {
    display: "grid", gap: "10px 14px",
    gridTemplateColumns: "repeat(4, 1fr)",
    paddingBottom: "10px",
  },
  infoGrid3: {
    display: "grid", gap: "10px 14px",
    gridTemplateColumns: "repeat(3, 1fr)",
    paddingBottom: "10px",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
    marginBottom: "4px",
  },
  infoGrid3Batch: {
    display: "grid", gap: "10px 14px",
    gridTemplateColumns: "repeat(3, 1fr)",
    paddingBottom: "14px",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
  },
  infoField: { display: "flex", flexDirection: "column", gap: "4px" },
  infoLabel: {
    fontSize: "12px", fontWeight: 500,
    color: "rgba(42,42,42,0.85)",
  },
  infoInput: {
    border: "1px solid rgba(35,78,112,0.5)", borderRadius: "8px",
    padding: "6px 10px", fontSize: "13px", color: "#555",
    background: "rgba(242,242,242,0.8)", width: "100%",
    outline: "none", boxSizing: "border-box", height: "36px",
    cursor: "default",
  },
  infoSelect: {
    border: "1px solid rgba(35,78,112,0.5)", borderRadius: "8px",
    padding: "6px 10px", fontSize: "13px", color: "#1a1a1a",
    background: "#fff", width: "100%", outline: "none",
    boxSizing: "border-box", height: "36px", cursor: "pointer",
  },
  overLimitInput: { borderColor: "#e53e3e", color: "#e53e3e" },
  overLimitMsg: { color: "#e53e3e", fontSize: "12px", fontWeight: 500, margin: 0 },
  body: { display: "flex", gap: "16px", minHeight: "300px" },
  left: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "12px" },
  inputCard: { border: "1px solid rgba(0,0,0,0.13)", borderRadius: "10px", overflow: "hidden" },
  inputRow: { display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px" },
  inputLabel: {
    fontSize: "13px", fontWeight: 500, color: "rgba(35,78,112,1)",
    whiteSpace: "nowrap", minWidth: "70px",
  },
  textInput: {
    flex: 1, minWidth: 0, border: "1px solid rgba(224,228,231,1)",
    borderRadius: "6px", padding: "5px 10px", fontSize: "13px",
    background: "transparent", outline: "none", color: "#1a1a1a",
    height: "32px", boxSizing: "border-box",
  },
  textarea: {
    width: "100%", border: "1px solid rgba(224,228,231,1)",
    borderRadius: "6px", padding: "8px 10px", fontSize: "13px",
    background: "transparent", outline: "none", resize: "vertical",
    color: "#1a1a1a", fontFamily: "inherit", minHeight: "72px",
    boxSizing: "border-box",
  },
  addBtnActive: {
    width: "100%", padding: "10px 0", border: "none", fontSize: "13px",
    fontWeight: 600, cursor: "pointer", display: "block",
    background: "rgba(34,197,94,1)", color: "#fff",
  },
  addBtnInactive: {
    width: "100%", padding: "10px 0", border: "none", fontSize: "13px",
    fontWeight: 600, cursor: "not-allowed", display: "block",
    background: "rgba(176,176,176,1)", color: "#fff",
  },
  importToggle: {
    fontSize: "13px", fontWeight: 500, color: "rgba(35,78,112,1)",
    cursor: "pointer", userSelect: "none", width: "max-content",
  },
  dupSection: { marginTop: "auto", display: "flex", flexDirection: "column", gap: "4px" },
  dupLabel: { fontSize: "13px", fontWeight: 500, color: "#1a1a1a", margin: 0 },
  dupBox: {
    width: "100%", background: "rgba(249,249,249,1)",
    border: "1px solid rgba(226,226,226,1)", borderRadius: "8px",
    padding: "10px 14px", fontSize: "13px", resize: "none",
    minHeight: "56px", fontFamily: "inherit", boxSizing: "border-box",
  },
  right: {
    flex: 1, minWidth: 0, background: "rgba(242,242,242,1)",
    borderRadius: "10px", border: "1px solid rgba(0,0,0,0.1)", overflow: "auto",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    fontSize: "13px", fontWeight: 600, color: "rgba(35,78,112,1)",
    background: "#fff", padding: "11px 16px",
    borderBottom: "1px solid rgba(0,0,0,0.1)", textAlign: "left",
    position: "sticky", top: 0, zIndex: 1,
  },
  td: {
    fontSize: "13px", color: "#1a1a1a", background: "#fff",
    padding: "10px 16px", borderBottom: "1px solid rgba(0,0,0,0.07)", textAlign: "left",
  },
  emptyTd: {
    fontSize: "13px", color: "#999", padding: "32px 16px",
    textAlign: "center", background: "#fff",
  },
  removeBtn: {
    background: "none", border: "none", cursor: "pointer",
    padding: "3px 5px", display: "flex", alignItems: "center", borderRadius: "4px",
  },
  footer: {
    display: "flex", justifyContent: "flex-end", alignItems: "center",
    gap: "12px", paddingTop: "10px", borderTop: "1px solid rgba(0,0,0,0.07)",
  },
  cancelBtn: {
    padding: "6px 20px", borderRadius: "7px",
    border: "2px solid rgba(35,78,112,1)", color: "rgba(35,78,112,1)",
    fontSize: "14px", fontWeight: 600, background: "#fff", cursor: "pointer",
  },
  applyBtnActive: {
    padding: "6px 20px", borderRadius: "7px", fontSize: "14px",
    fontWeight: 600, cursor: "pointer",
    background: "rgba(35,78,112,1)", color: "#fff",
    border: "2px solid rgba(35,78,112,1)",
  },
  applyBtnDisabled: {
    padding: "6px 20px", borderRadius: "7px", fontSize: "14px",
    fontWeight: 600, cursor: "not-allowed",
    background: "#fff", color: "rgba(176,176,176,1)",
    border: "2px solid rgba(176,176,176,1)",
  },
  loadingTd: {
    fontSize: "13px", color: "#666", padding: "24px 16px",
    textAlign: "center", background: "#fff",
  },
};

export default function StockSerialNumber({
  setStockDim,
  activeProduct,
  stockReceiptId,
  itemId,
  onApply,
  batchMode = false,
  batchNo = "",
  batchQty = 0,
  onBatchSerialApply,
  // existing serials passed from parent line item (already mapped)
  existingSerials = [],
}) {
  const [serialInput, setSerialInput]   = useState("");
  const [importText, setImportText]     = useState("");
  const [importBox, setImportBox]       = useState(false);
  const [serialList, setSerialList]     = useState([]);
  const [duplicates, setDuplicates]     = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching]     = useState(false);

  // ── On open: load existing serials from API if itemId is available ─────
  useEffect(() => {
    const load = async () => {
      // If parent already passed existing serials, use them directly
      if (existingSerials && existingSerials.length > 0) {
        setSerialList(existingSerials);
        return;
      }
      // Otherwise fetch from API if we have the IDs
      if (!stockReceiptId || !itemId || batchMode) return;
      setIsFetching(true);
      try {
        const detail = await stockReceiptApiProvider.fetchSingleStockReceipt(stockReceiptId);
        if (!detail) return;
        const item = (detail.items || []).find((i) => i.id === itemId);
        if (item?.serial_numbers?.length > 0) {
          setSerialList(item.serial_numbers.map((s) => s.serial_no));
        }
      } catch (err) {
        console.error("Failed to fetch existing serials:", err);
      } finally {
        setIsFetching(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── helpers ───────────────────────────────────────────────────────────
  const addSerials = (raw) => {
    const incoming = raw.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
    const dups = [], toAdd = [];
    incoming.forEach((s) => {
      if (serialList.includes(s)) dups.push(s);
      else toAdd.push(s);
    });
    setDuplicates(dups);
    if (toAdd.length > 0) setSerialList((prev) => [...prev, ...toAdd]);
    return toAdd.length;
  };

  const handleAddSerial = (e) => {
    e.preventDefault();
    if (!serialInput.trim()) return;
    if (serialList.includes(serialInput.trim())) {
      setDuplicates([serialInput.trim()]);
      return;
    }
    setDuplicates([]);
    setSerialList((prev) => [...prev, serialInput.trim()]);
    setSerialInput("");
  };

  const handleImport = (e) => {
    e.preventDefault();
    if (!importText.trim()) return;
    const added = addSerials(importText);
    if (added > 0) toast.success(`${added} serial number(s) imported`);
    setImportText("");
    setImportBox(false);
  };

  const handleRemove = (serial) => {
    setSerialList((prev) => prev.filter((s) => s !== serial));
    setDuplicates((prev) => prev.filter((s) => s !== serial));
  };

  const handleClose = () => {
    if (batchMode) { onBatchSerialApply?.(null); return; }
    setStockDim({ serialBox: false, batchBox: false, activeRow: null, activeProduct: null, activeItemId: null });
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (serialList.length === 0) { toast.error("Please add at least one serial number"); return; }
    if (batchMode) { onBatchSerialApply?.(serialList); return; }
    if (stockReceiptId && itemId) {
      setIsSubmitting(true);
      try {
        const result = await stockReceiptApiProvider.addSerialNumbers(stockReceiptId, itemId, serialList);
        if (result) {
          toast.success("Serial numbers saved successfully");
          onApply?.(serialList);
          setStockDim({ serialBox: false, batchBox: false, activeRow: null, activeProduct: null, activeItemId: null });
        }
      } catch { toast.error("Failed to save serial numbers"); }
      finally { setIsSubmitting(false); }
    } else {
      toast.info("Serial numbers will be submitted when you save the draft");
      onApply?.(serialList);
      setStockDim({ serialBox: false, batchBox: false, activeRow: null, activeProduct: null, activeItemId: null });
    }
  };

  const limitQty    = batchMode ? parseInt(batchQty) || 0 : parseInt(activeProduct?.accepted_qty) || 0;
  const isOverLimit = limitQty > 0 && serialList.length > limitQty;

  const modalContent = (
    <div style={S.overlay}>
      <div style={S.modal}>

        {/* TITLE */}
        <div style={{ textAlign: "center" }}>
          <h3 style={S.title}>{batchMode ? "Generate Serial Numbers by Batch" : "Generate Serial Numbers"}</h3>
        </div>

        {/* INFO GRID */}
        {batchMode ? (
          <div style={S.infoGrid3Batch}>
            {[
              { label: "Batch number",     value: batchNo },
              { label: "Batch Quantity",   value: batchQty },
              { label: "Serials Generated", value: serialList.length, over: isOverLimit },
            ].map(({ label, value, over }) => (
              <div key={label} style={S.infoField}>
                <label style={S.infoLabel}>{label}</label>
                <input style={{ ...S.infoInput, ...(over ? S.overLimitInput : {}) }} value={value} disabled />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Row 1 — 4 fields */}
            <div style={S.infoGrid4}>
              <div style={S.infoField}>
                <label style={S.infoLabel}>Product Name</label>
                <input style={S.infoInput} value={activeProduct?.product_name || ""} disabled />
              </div>
              <div style={S.infoField}>
                <label style={S.infoLabel}>Product ID</label>
                <input style={S.infoInput} value={activeProduct?.product_id || ""} disabled />
              </div>
              <div style={S.infoField}>
                <label style={S.infoLabel}>UOM</label>
                <input style={S.infoInput} value={activeProduct?.uom || ""} disabled />
              </div>
              <div style={S.infoField}>
                <label style={S.infoLabel}>Stock Dim.</label>
                <select
                  style={S.infoSelect}
                  value="Serial"
                  onChange={() => setStockDim({
                    serialBox: false, batchBox: true,
                    activeRow: null, activeProduct: activeProduct, activeItemId: itemId,
                  })}
                >
                  <option value="Serial">Serial</option>
                  <option value="Batch">Batch</option>
                </select>
              </div>
            </div>
            {/* Row 2 — 3 fields */}
            <div style={S.infoGrid3}>
              <div style={S.infoField}>
                <label style={S.infoLabel}>Qty Received</label>
                <input style={S.infoInput} value={activeProduct?.qty_received ?? ""} disabled />
              </div>
              <div style={S.infoField}>
                <label style={S.infoLabel}>Accepted Qty</label>
                <input style={S.infoInput} value={activeProduct?.accepted_qty ?? ""} disabled />
              </div>
              <div style={S.infoField}>
                <label style={S.infoLabel}>Serials Generated</label>
                <input
                  style={{ ...S.infoInput, ...(isOverLimit ? S.overLimitInput : {}) }}
                  value={isFetching ? "Loading..." : serialList.length}
                  disabled
                />
              </div>
            </div>
          </>
        )}

        {isOverLimit && (
          <p style={S.overLimitMsg}>⚠ Serial numbers exceed {batchMode ? "batch" : "accepted"} quantity ({limitQty})</p>
        )}

        {/* BODY */}
        <div style={S.body}>

          {/* LEFT */}
          <div style={S.left}>
            <div style={S.inputCard}>
              <div style={S.inputRow}>
                <label style={S.inputLabel}>Serial No :</label>
                <input
                  style={S.textInput}
                  type="text"
                  placeholder="Enter Serial Number"
                  value={serialInput}
                  onChange={(e) => setSerialInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleAddSerial(e); }}
                />
              </div>
              <button
                type="button"
                style={serialInput.trim() ? S.addBtnActive : S.addBtnInactive}
                disabled={!serialInput.trim()}
                onClick={handleAddSerial}
              >
                Add Serial
              </button>
            </div>

            <p style={S.importToggle} onClick={() => setImportBox(!importBox)}>
              Import Serial Numbers
            </p>

            {importBox && (
              <div style={S.inputCard}>
                <div style={{ padding: "10px 14px" }}>
                  <textarea
                    style={S.textarea}
                    placeholder="Enter Serial Numbers (e.g., Item-001, Item-002, ...)"
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    rows={4}
                  />
                </div>
                <button
                  type="button"
                  style={importText.trim() ? S.addBtnActive : S.addBtnInactive}
                  disabled={!importText.trim()}
                  onClick={handleImport}
                >
                  Import
                </button>
              </div>
            )}

            <div style={S.dupSection}>
              <p style={S.dupLabel}>Duplicate Numbers</p>
              <textarea
                style={{ ...S.dupBox, color: duplicates.length > 0 ? "#e53e3e" : "#b0b0b0" }}
                value={duplicates.join(", ")}
                placeholder="Not found"
                disabled
                rows={3}
              />
            </div>
          </div>

          {/* RIGHT */}
          <div style={S.right}>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>S.No</th>
                  <th style={S.th}>Serial No</th>
                  <th style={S.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {isFetching ? (
                  <tr><td colSpan={3} style={S.loadingTd}>Loading existing serial numbers...</td></tr>
                ) : serialList.length === 0 ? (
                  <tr><td colSpan={3} style={S.emptyTd}>No serial numbers generated</td></tr>
                ) : serialList.map((serial, idx) => (
                  <tr key={idx}>
                    <td style={S.td}>{idx + 1}</td>
                    <td style={S.td}>{serial}</td>
                    <td style={S.td}>
                      <button type="button" style={S.removeBtn} onClick={() => handleRemove(serial)} title="Remove">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 16" fill="none">
                          <path d="M2.625 16C2.14375 16 1.73192 15.8261 1.3895 15.4782C1.04708 15.1304 0.875583 14.7117 0.875 14.2222V2.66667H0V0.888889H4.375V0H9.625V0.888889H14V2.66667H13.125V14.2222C13.125 14.7111 12.9538 15.1298 12.6114 15.4782C12.269 15.8267 11.8568 16.0006 11.375 16H2.625ZM4.375 12.4444H6.125V4.44444H4.375V12.4444ZM7.875 12.4444H9.625V4.44444H7.875V12.4444Z" fill="#234E70"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER */}
        <div style={S.footer}>
          <button type="button" style={S.cancelBtn} onClick={handleClose}>Cancel</button>
          <button
            type="button"
            style={serialList.length === 0 || isOverLimit || isSubmitting ? S.applyBtnDisabled : S.applyBtnActive}
            disabled={serialList.length === 0 || isOverLimit || isSubmitting}
            onClick={handleApply}
          >
            {isSubmitting ? "Saving..." : "Apply"}
          </button>
        </div>

      </div>
    </div>
  );
  return createPortal(modalContent, document.body);
}