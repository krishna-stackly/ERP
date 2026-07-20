// // // import React, { useState, useEffect } from "react";
// // // import "./stockBatchNumber.css";

// // // export default function stockBatchNumber({ setStockDim }) {
// // //   const [batchInp, setbatchInp] = useState({
// // //     stock_dim: "",
// // //     batch_no: "",
// // //     batch_qty: "",
// // //     mfg_date: "",
// // //     expiry_date: "",
// // //   });

// // //   const handelBatchChange = (e) => {
// // //     setbatchInp((prev) => {
// // //       return { ...prev, [e.target.id]: e.target.value };
// // //     });
// // //   };

// // //   return (
// // //     <>
// // //       <div className="createNewStockBatch-container">
// // //         <h3>Generate Batch Numbers</h3>
// // //         <div className="createNewStockBatch-input-container">
// // //           <div>
// // //             <label htmlFor="product_name">Product Name</label>
// // //             <input id="product_name" disabled />
// // //           </div>
// // //           <div>
// // //             <label htmlFor="product_id">Product ID</label>
// // //             <input id="product_id" disabled />
// // //           </div>
// // //           <div>
// // //             <label htmlFor="uom">UOM</label>
// // //             <input id="uom" disabled />
// // //           </div>
// // //           <div>
// // //             <label htmlFor="stock_dim">Stock Dim.</label>
// // //             <select
// // //               id="stock_dim"
// // //               value={batchInp.stock_dim}
// // //               onChange={() => {
// // //                 handelBatchChange;
// // //                 setStockDim({
// // //                   serialBox: true,
// // //                   batchBox: false,
// // //                 });
// // //               }}
// // //             >
// // //               <option value="Batch">Batch</option>
// // //               <option value="Serial">Serial</option>
// // //             </select>
// // //           </div>
// // //           <div>
// // //             <label htmlFor="qty_received">Qty Received</label>
// // //             <input id="qty_received" disabled />
// // //           </div>
// // //           <div>
// // //             <label htmlFor="accepted_qty">Accepted Qty</label>
// // //             <input id="accepted_qty" disabled />
// // //           </div>
// // //           <div>
// // //             <label htmlFor="batch_qty">Batched Qty</label>
// // //             <input id="batch_qty" disabled />
// // //           </div>
// // //         </div>
// // //         <div className="createNewStockBatch-division">
// // //           <nav>
// // //             <form className="createNewStockBatch-serial-inp">
// // //               <div className="createNewStockBatch-serial-inp-box">
// // //                 <label htmlFor="batch_no">
// // //                   Batch No<sup style={{ color: "red" }}>*</sup> :
// // //                 </label>
// // //                 <input
// // //                   value={batchInp.batch_no}
// // //                   onChange={handelBatchChange}
// // //                   type="text"
// // //                   id="batch_no"
// // //                   placeholder="Enter Batch Number"
// // //                 />
// // //               </div>
// // //               <div className="createNewStockBatch-serial-inp-box">
// // //                 <label htmlFor="batch_qty">
// // //                   Batch Qty<sup style={{ color: "red" }}>*</sup> :
// // //                 </label>
// // //                 <input
// // //                   value={batchInp.batch_qty}
// // //                   onChange={handelBatchChange}
// // //                   type="number"
// // //                   id="batch_qty"
// // //                   placeholder="Enter quantity for this batch"
// // //                 />
// // //               </div>
// // //               <div className="createNewStockBatch-serial-inp-box">
// // //                 <label htmlFor="mfg_date">Mfg. Date :</label>
// // //                 <input
// // //                   value={batchInp.mfg_date}
// // //                   onChange={handelBatchChange}
// // //                   type="date"
// // //                   id="mfg_date"
// // //                 />
// // //               </div>
// // //               <div className="createNewStockBatch-serial-inp-box">
// // //                 <label htmlFor="expiry_date">Expiry Date :</label>
// // //                 <input
// // //                   value={batchInp.expiry_date}
// // //                   onChange={handelBatchChange}
// // //                   type="date"
// // //                   id="expiry_date"
// // //                 />
// // //               </div>
// // //               <button
// // //                 className={
// // //                   batchInp.batch_no === "" || batchInp.batch_qty === ""
// // //                     ? "createNewStockBatch-serial-inactive"
// // //                     : "createNewStockBatch-serial-active"
// // //                 }
// // //                 disabled={batchInp.batch_no === "" || batchInp.batch_qty === ""}
// // //               >
// // //                 Add Batch
// // //               </button>
// // //             </form>
// // //             <p className="createNewStockBatch-duplicate-tit">
// // //               Duplicate Numbers
// // //             </p>
// // //             <textarea
// // //               className="createNewStockBatch-duplicate-box"
// // //               placeholder="Not found"
// // //               disabled
// // //             />
// // //           </nav>
// // //           <div className="createNewStockBatch-table">
// // //             <table>
// // //               <thead className="createNewStockBatch-table-head">
// // //                 <tr>
// // //                   <th>S.No</th>
// // //                   <th>
// // //                     <pre>Serial No</pre>
// // //                   </th>
// // //                   <th>
// // //                     <pre>Expiry Date</pre>
// // //                   </th>
// // //                   <th>B.Qty</th>
// // //                   <th>S.Qty</th>
// // //                   <th>Action</th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody className="createNewStockBatch-table-body">
// // //                 <tr>
// // //                   <td>1</td>
// // //                   <td>UK-001</td>
// // //                   <td>
// // //                     <pre>20-06-2025</pre>
// // //                   </td>
// // //                   <td>25</td>
// // //                   <td>2</td>
// // //                   <td id="createNewStockBatch-table-action">
// // //                     <nav className="createNewStockBatch-dot-container">
// // //                       <button
// // //                       // onClick={() => {
// // //                       //   navigate(`/?tab=editNewSales/${ele.po_id}`);
// // //                       //   setCurrentPage("editPurchase");
// // //                       // }}
// // //                       >
// // //                         View Serial. No
// // //                       </button>
// // //                       <button
// // //                         onClick={() => {
// // //                           setStockDim({ batchSerialNO: true });
// // //                         }}
// // //                       >
// // //                         Generate Serial. No
// // //                       </button>
// // //                       <button>Remove</button>
// // //                     </nav>
// // //                     <svg
// // //                       className="createNewStockBatch-delete-logo"
// // //                       xmlns="http://www.w3.org/2000/svg"
// // //                       width="24"
// // //                       height="24"
// // //                       viewBox="0 0 24 24"
// // //                       fill="none"
// // //                     >
// // //                       <path
// // //                         d="M12 16C12.5304 16 13.0391 16.2107 13.4142 16.5858C13.7893 16.9609 14 17.4696 14 18C14 18.5304 13.7893 19.0391 13.4142 19.4142C13.0391 19.7893 12.5304 20 12 20C11.4696 20 10.9609 19.7893 10.5858 19.4142C10.2107 19.0391 10 18.5304 10 18C10 17.4696 10.2107 16.9609 10.5858 16.5858C10.9609 16.2107 11.4696 16 12 16ZM12 10C12.5304 10 13.0391 10.2107 13.4142 10.5858C13.7893 10.9609 14 11.4696 14 12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14C11.4696 14 10.9609 13.7893 10.5858 13.4142C10.2107 13.0391 10 12.5304 10 12C10 11.4696 10.2107 10.9609 10.5858 10.5858C10.9609 10.2107 11.4696 10 12 10ZM12 4C12.5304 4 13.0391 4.21071 13.4142 4.58579C13.7893 4.96086 14 5.46957 14 6C14 6.53043 13.7893 7.03914 13.4142 7.41421C13.0391 7.78929 12.5304 8 12 8C11.4696 8 10.9609 7.78929 10.5858 7.41421C10.2107 7.03914 10 6.53043 10 6C10 5.46957 10.2107 4.96086 10.5858 4.58579C10.9609 4.21071 11.4696 4 12 4Z"
// // //                         fill="#2A2A2A"
// // //                       />
// // //                     </svg>
// // //                   </td>
// // //                 </tr>
// // //               </tbody>
// // //             </table>
// // //           </div>
// // //         </div>
// // //         <div className="createNewStockBatch-btn-container">
// // //           <button
// // //             className="createNewStockBatch-cancel-btn"
// // //             onClick={() => {
// // //               setStockDim({ batchBox: false });
// // //             }}
// // //           >
// // //             Cancel
// // //           </button>
// // //           <button className="createNewStockBatch-inactive-btn ">Apply</button>
// // //         </div>
// // //       </div>
// // //     </>
// // //   );
// // // }
// // import React, { useState } from "react";
// // import "./stockBatchNumber.css";
// // import { toast } from "react-toastify";
// // import stockReceiptApiProvider from "../../../../network/stockReceipt-api-provider"

// // export default function StockBatchNumber({
// //   setStockDim,
// //   activeProduct,     // { product_name, product_id, uom, qty_received, accepted_qty }
// //   stockReceiptId,    // GRN numeric id (set after first save)
// //   itemId,            // line item numeric id from backend
// //   onApply,           // callback(batchList) → parent stores batch list locally
// // }) {
// //   const [batchInp, setBatchInp] = useState({
// //     batch_no:    "",
// //     batch_qty:   "",
// //     mfg_date:    "",
// //     expiry_date: "",
// //   });
// //   const [batchList, setBatchList]       = useState([]);
// //   const [duplicates, setDuplicates]     = useState([]);
// //   const [isSubmitting, setIsSubmitting] = useState(false);

// //   const handleBatchChange = (e) => {
// //     setBatchInp((prev) => ({ ...prev, [e.target.id]: e.target.value }));
// //   };

// //   // ── Add batch row ─────────────────────────────────────────────────────────
// //   const handleAddBatch = (e) => {
// //     e.preventDefault();
// //     if (!batchInp.batch_no || !batchInp.batch_qty) return;

// //     const isDup = batchList.some((b) => b.batch_no === batchInp.batch_no);
// //     if (isDup) {
// //       setDuplicates((prev) =>
// //         prev.includes(batchInp.batch_no) ? prev : [...prev, batchInp.batch_no]
// //       );
// //       toast.warning(`Batch number "${batchInp.batch_no}" already exists`);
// //       return;
// //     }

// //     setBatchList((prev) => [
// //       ...prev,
// //       {
// //         id:          Date.now(),
// //         batch_no:    batchInp.batch_no,
// //         batch_qty:   parseInt(batchInp.batch_qty),
// //         mfg_date:    batchInp.mfg_date,
// //         expiry_date: batchInp.expiry_date,
// //         serials:     [],   // populated later via Generate Serial No
// //       },
// //     ]);
// //     setBatchInp({ batch_no: "", batch_qty: "", mfg_date: "", expiry_date: "" });
// //     setDuplicates([]);
// //   };

// //   const handleRemoveBatch = (id) => {
// //     setBatchList((prev) => prev.filter((b) => b.id !== id));
// //   };

// //   // ── Totals ────────────────────────────────────────────────────────────────
// //   const totalBatched  = batchList.reduce((acc, b) => acc + (parseInt(b.batch_qty) || 0), 0);
// //   const acceptedQty   = parseInt(activeProduct?.accepted_qty) || 0;
// //   const isOverLimit   = totalBatched > acceptedQty;

// //   // ── APPLY: POST to API if stockReceiptId exists ───────────────────────────
// //   const handleApply = async (e) => {
// //     e.preventDefault();
// //     if (batchList.length === 0) {
// //       toast.error("Please add at least one batch");
// //       return;
// //     }

// //     if (stockReceiptId && itemId) {
// //       setIsSubmitting(true);
// //       try {
// //         const result = await stockReceiptApiProvider.addBatchNumbers(
// //           stockReceiptId,
// //           itemId,
// //           batchList
// //         );
// //         if (result) {
// //           toast.success("Batch numbers saved successfully");
// //           onApply?.(batchList);
// //           setStockDim({ serialBox: false, batchBox: false, batchSerialNO: false, activeRow: null, activeProduct: null });
// //         }
// //       } catch (err) {
// //         toast.error("Failed to save batch numbers");
// //       } finally {
// //         setIsSubmitting(false);
// //       }
// //     } else {
// //       toast.info("Batch numbers will be submitted when you save the draft");
// //       onApply?.(batchList);
// //       setStockDim({ serialBox: false, batchBox: false, batchSerialNO: false, activeRow: null, activeProduct: null });
// //     }
// //   };

// //   return (
// //     <div className="createNewStockBatch-container">
// //       <h3>Generate Batch Numbers</h3>

// //       {/* ── Product Info ── */}
// //       <div className="createNewStockBatch-input-container">
// //         <div>
// //           <label>Product Name</label>
// //           <input value={activeProduct?.product_name || ""} disabled />
// //         </div>
// //         <div>
// //           <label>Product ID</label>
// //           <input value={activeProduct?.product_id || ""} disabled />
// //         </div>
// //         <div>
// //           <label>UOM</label>
// //           <input value={activeProduct?.uom || ""} disabled />
// //         </div>
// //         <div>
// //           <label>Stock Dim.</label>
// //           <select
// //             value="Batch"
// //             onChange={() =>
// //               setStockDim({
// //                 serialBox: true,
// //                 batchBox: false,
// //                 batchSerialNO: false,
// //                 activeRow: null,
// //                 activeProduct: activeProduct,
// //               })
// //             }
// //           >
// //             <option value="Batch">Batch</option>
// //             <option value="Serial">Serial</option>
// //           </select>
// //         </div>
// //         <div>
// //           <label>Qty Received</label>
// //           <input value={activeProduct?.qty_received || ""} disabled />
// //         </div>
// //         <div>
// //           <label>Accepted Qty</label>
// //           <input value={activeProduct?.accepted_qty || ""} disabled />
// //         </div>
// //         <div>
// //           <label>Batched Qty</label>
// //           <input
// //             value={totalBatched}
// //             disabled
// //             style={{ color: isOverLimit ? "red" : "inherit" }}
// //           />
// //         </div>
// //       </div>

// //       {isOverLimit && (
// //         <p style={{ color: "red", fontSize: "12px", margin: "4px 0 8px" }}>
// //           ⚠ Batched quantity exceeds accepted quantity ({acceptedQty})
// //         </p>
// //       )}

// //       {/* ── Input + Table ── */}
// //       <div className="createNewStockBatch-division">
// //         <nav>
// //           <form className="createNewStockBatch-serial-inp" onSubmit={handleAddBatch}>
// //             <div className="createNewStockBatch-serial-inp-box">
// //               <label htmlFor="batch_no">
// //                 Batch No<sup style={{ color: "red" }}>*</sup> :
// //               </label>
// //               <input
// //                 value={batchInp.batch_no}
// //                 onChange={handleBatchChange}
// //                 type="text"
// //                 id="batch_no"
// //                 placeholder="Enter Batch Number"
// //               />
// //             </div>
// //             <div className="createNewStockBatch-serial-inp-box">
// //               <label htmlFor="batch_qty">
// //                 Batch Qty<sup style={{ color: "red" }}>*</sup> :
// //               </label>
// //               <input
// //                 value={batchInp.batch_qty}
// //                 onChange={handleBatchChange}
// //                 type="number"
// //                 id="batch_qty"
// //                 placeholder="Enter quantity for this batch"
// //               />
// //             </div>
// //             <div className="createNewStockBatch-serial-inp-box">
// //               <label htmlFor="mfg_date">Mfg. Date :</label>
// //               <input
// //                 value={batchInp.mfg_date}
// //                 onChange={handleBatchChange}
// //                 type="date"
// //                 id="mfg_date"
// //               />
// //             </div>
// //             <div className="createNewStockBatch-serial-inp-box">
// //               <label htmlFor="expiry_date">Expiry Date :</label>
// //               <input
// //                 value={batchInp.expiry_date}
// //                 onChange={handleBatchChange}
// //                 type="date"
// //                 id="expiry_date"
// //               />
// //             </div>
// //             <button
// //               type="submit"
// //               className={
// //                 !batchInp.batch_no || !batchInp.batch_qty
// //                   ? "createNewStockBatch-serial-inactive"
// //                   : "createNewStockBatch-serial-active"
// //               }
// //               disabled={!batchInp.batch_no || !batchInp.batch_qty}
// //             >
// //               Add Batch
// //             </button>
// //           </form>

// //           <p className="createNewStockBatch-duplicate-tit">Duplicate Numbers</p>
// //           <textarea
// //             className="createNewStockBatch-duplicate-box"
// //             value={duplicates.join(", ")}
// //             placeholder="Not found"
// //             disabled
// //             style={{ color: duplicates.length > 0 ? "red" : "inherit" }}
// //           />
// //         </nav>

// //         {/* Batch table */}
// //         <div className="createNewStockBatch-table">
// //           <table>
// //             <thead className="createNewStockBatch-table-head">
// //               <tr>
// //                 <th>S.No</th>
// //                 <th><pre>Batch No</pre></th>
// //                 <th><pre>Expiry Date</pre></th>
// //                 <th>B.Qty</th>
// //                 <th>Mfg Date</th>
// //                 <th>Action</th>
// //               </tr>
// //             </thead>
// //             <tbody className="createNewStockBatch-table-body">
// //               {batchList.length === 0 ? (
// //                 <tr>
// //                   <td colSpan={6} style={{ textAlign: "center", color: "#999" }}>
// //                     No batches added
// //                   </td>
// //                 </tr>
// //               ) : (
// //                 batchList.map((batch, idx) => (
// //                   <tr key={batch.id}>
// //                     <td>{idx + 1}</td>
// //                     <td>{batch.batch_no}</td>
// //                     <td><pre>{batch.expiry_date || "—"}</pre></td>
// //                     <td>{batch.batch_qty}</td>
// //                     <td><pre>{batch.mfg_date || "—"}</pre></td>
// //                     <td id="createNewStockBatch-table-action">
// //                       <nav className="createNewStockBatch-dot-container">
// //                         <button type="button" onClick={() => handleRemoveBatch(batch.id)}>
// //                           Remove
// //                         </button>
// //                       </nav>
// //                       <svg
// //                         className="createNewStockBatch-delete-logo"
// //                         xmlns="http://www.w3.org/2000/svg"
// //                         width="24"
// //                         height="24"
// //                         viewBox="0 0 24 24"
// //                         fill="none"
// //                       >
// //                         <path
// //                           d="M12 16C12.5304 16 13.0391 16.2107 13.4142 16.5858C13.7893 16.9609 14 17.4696 14 18C14 18.5304 13.7893 19.0391 13.4142 19.4142C13.0391 19.7893 12.5304 20 12 20C11.4696 20 10.9609 19.7893 10.5858 19.4142C10.2107 19.0391 10 18.5304 10 18C10 17.4696 10.2107 16.9609 10.5858 16.5858C10.9609 16.2107 11.4696 16 12 16ZM12 10C12.5304 10 13.0391 10.2107 13.4142 10.5858C13.7893 10.9609 14 11.4696 14 12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14C11.4696 14 10.9609 13.7893 10.5858 13.4142C10.2107 13.0391 10 12.5304 10 12C10 11.4696 10.2107 10.9609 10.5858 10.5858C10.9609 10.2107 11.4696 10 12 10ZM12 4C12.5304 4 13.0391 4.21071 13.4142 4.58579C13.7893 4.96086 14 5.46957 14 6C14 6.53043 13.7893 7.03914 13.4142 7.41421C13.0391 7.78929 12.5304 8 12 8C11.4696 8 10.9609 7.78929 10.5858 7.41421C10.2107 7.03914 10 6.53043 10 6C10 5.46957 10.2107 4.96086 10.5858 4.58579C10.9609 4.21071 11.4696 4 12 4Z"
// //                           fill="#2A2A2A"
// //                         />
// //                       </svg>
// //                     </td>
// //                   </tr>
// //                 ))
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>

// //       {/* ── Buttons ── */}
// //       <div className="createNewStockBatch-btn-container">
// //         <button
// //           type="button"
// //           className="createNewStockBatch-cancel-btn"
// //           onClick={() =>
// //             setStockDim({ serialBox: false, batchBox: false, batchSerialNO: false, activeRow: null, activeProduct: null })
// //           }
// //         >
// //           Cancel
// //         </button>
// //         <button
// //           type="button"
// //           className={
// //             batchList.length === 0 || isOverLimit || isSubmitting
// //               ? "createNewStockBatch-inactive-btn"
// //               : "createNewStockBatch-active-btn"
// //           }
// //           disabled={batchList.length === 0 || isOverLimit || isSubmitting}
// //           onClick={handleApply}
// //         >
// //           {isSubmitting ? "Saving..." : "Apply"}
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// import React, { useState } from "react";
// import "./stockBatchNumber.css";
// import { toast } from "react-toastify";
// import stockReceiptApiProvider from "../../../../network/stockReceipt-api-provider";
// import StockSerialNumber from "../stock-serial-num/stockSerialNumber";

// export default function StockBatchNumber({
//   setStockDim,
//   activeProduct,
//   stockReceiptId,
//   itemId,
//   onApply,
// }) {
//   const [batchInp, setBatchInp] = useState({
//     batch_no: "", batch_qty: "", mfg_date: "", expiry_date: "",
//   });
//   const [batchList, setBatchList]       = useState([]);
//   const [duplicates, setDuplicates]     = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // ── Batch-level serial sub-modal state ───────────────────────────────────
//   // activeBatchForSerial: the batch object currently having serials generated
//   const [activeBatchForSerial, setActiveBatchForSerial] = useState(null);

//   const handleBatchChange = (e) => {
//     setBatchInp((prev) => ({ ...prev, [e.target.id]: e.target.value }));
//   };

//   // ── Add batch row ─────────────────────────────────────────────────────────
//   const handleAddBatch = (e) => {
//     e.preventDefault();
//     if (!batchInp.batch_no || !batchInp.batch_qty) return;

//     const isDup = batchList.some((b) => b.batch_no === batchInp.batch_no);
//     if (isDup) {
//       setDuplicates((prev) =>
//         prev.includes(batchInp.batch_no) ? prev : [...prev, batchInp.batch_no]
//       );
//       toast.warning(`Batch "${batchInp.batch_no}" already exists`);
//       return;
//     }

//     setBatchList((prev) => [
//       ...prev,
//       {
//         id:          Date.now(),
//         batch_no:    batchInp.batch_no,
//         batch_qty:   parseInt(batchInp.batch_qty),
//         mfg_date:    batchInp.mfg_date,
//         expiry_date: batchInp.expiry_date,
//         serials:     [],
//       },
//     ]);
//     setBatchInp({ batch_no: "", batch_qty: "", mfg_date: "", expiry_date: "" });
//     setDuplicates([]);
//   };

//   const handleRemoveBatch = (id) => {
//     setBatchList((prev) => prev.filter((b) => b.id !== id));
//   };

//   // ── Open serial sub-modal for a specific batch ───────────────────────────
//   const handleGenerateSerials = (batch) => {
//     setActiveBatchForSerial(batch);
//   };

//   // ── Called when StockSerialNumber applies/cancels in batch mode ──────────
//   const handleBatchSerialApply = (serials) => {
//     if (serials !== null && activeBatchForSerial) {
//       setBatchList((prev) =>
//         prev.map((b) =>
//           b.id === activeBatchForSerial.id ? { ...b, serials } : b
//         )
//       );
//     }
//     setActiveBatchForSerial(null);
//   };

//   // ── Totals ────────────────────────────────────────────────────────────────
//   const totalBatched = batchList.reduce((acc, b) => acc + (parseInt(b.batch_qty) || 0), 0);
//   const acceptedQty  = parseInt(activeProduct?.accepted_qty) || 0;
//   const isOverLimit  = totalBatched > acceptedQty;

//   // ── APPLY: POST to API if stockReceiptId exists ───────────────────────────
//   const handleApply = async (e) => {
//     e.preventDefault();
//     if (batchList.length === 0) {
//       toast.error("Please add at least one batch");
//       return;
//     }

//     if (stockReceiptId && itemId) {
//       setIsSubmitting(true);
//       try {
//         const result = await stockReceiptApiProvider.addBatchNumbers(
//           stockReceiptId, itemId, batchList
//         );
//         if (result) {
//           // For each batch that has serials, post them too
//           const apiResults = Array.isArray(result) ? result : [result];
//           for (let i = 0; i < batchList.length; i++) {
//             const b       = batchList[i];
//             const apiBatch = apiResults[i];
//             if (b.serials?.length > 0 && apiBatch?.id && stockReceiptId && itemId) {
//               await stockReceiptApiProvider.addBatchSerialNumbers(
//                 stockReceiptId, itemId, apiBatch.id, b.serials
//               );
//             }
//           }
//           toast.success("Batch numbers saved successfully");
//           onApply?.(batchList);
//           setStockDim({
//             serialBox: false, batchBox: false,
//             activeRow: null, activeProduct: null, activeItemId: null,
//           });
//         }
//       } catch {
//         toast.error("Failed to save batch numbers");
//       } finally {
//         setIsSubmitting(false);
//       }
//     } else {
//       toast.info("Batch numbers will be submitted when you save the draft");
//       onApply?.(batchList);
//       setStockDim({
//         serialBox: false, batchBox: false,
//         activeRow: null, activeProduct: null, activeItemId: null,
//       });
//     }
//   };

//   // ── If serial sub-modal is open, render it on top ─────────────────────────
//   if (activeBatchForSerial) {
//     return (
//       <StockSerialNumber
//         setStockDim={setStockDim}
//         batchMode={true}
//         batchNo={activeBatchForSerial.batch_no}
//         batchQty={activeBatchForSerial.batch_qty}
//         onBatchSerialApply={handleBatchSerialApply}
//       />
//     );
//   }

//   return (
//     <div className="createNewStockBatch-container">
//       <h3>Generate Batch Numbers</h3>

//       {/* ── Product Info ── */}
//       <div className="createNewStockBatch-input-container">
//         <div>
//           <label>Product Name</label>
//           <input value={activeProduct?.product_name || ""} disabled />
//         </div>
//         <div>
//           <label>Product ID</label>
//           <input value={activeProduct?.product_id || ""} disabled />
//         </div>
//         <div>
//           <label>UOM</label>
//           <input value={activeProduct?.uom || ""} disabled />
//         </div>
//         <div>
//           <label>Stock Dim.</label>
//           <select
//             value="Batch"
//             onChange={() =>
//               setStockDim({
//                 serialBox: true, batchBox: false,
//                 activeRow: null, activeProduct: activeProduct, activeItemId: itemId,
//               })
//             }
//           >
//             <option value="Batch">Batch</option>
//             <option value="Serial">Serial</option>
//           </select>
//         </div>
//         <div>
//           <label>Qty Received</label>
//           <input value={activeProduct?.qty_received || ""} disabled />
//         </div>
//         <div>
//           <label>Accepted Qty</label>
//           <input value={activeProduct?.accepted_qty || ""} disabled />
//         </div>
//         <div>
//           <label>Batched Qty</label>
//           <input
//             value={totalBatched}
//             disabled
//             style={{ color: isOverLimit ? "red" : "inherit" }}
//           />
//         </div>
//       </div>

//       {isOverLimit && (
//         <p style={{ color: "red", fontSize: "12px", margin: "4px 0 8px" }}>
//           ⚠ Batched quantity exceeds accepted quantity ({acceptedQty})
//         </p>
//       )}

//       {/* ── Input + Table ── */}
//       <div className="createNewStockBatch-division">

//         {/* LEFT — form */}
//         <nav>
//           <form className="createNewStockBatch-serial-inp" onSubmit={handleAddBatch}>
//             <div className="createNewStockBatch-serial-inp-box">
//               <label htmlFor="batch_no">Batch No<sup style={{ color: "red" }}>*</sup> :</label>
//               <input
//                 value={batchInp.batch_no}
//                 onChange={handleBatchChange}
//                 type="text"
//                 id="batch_no"
//                 placeholder="Enter Batch Number"
//               />
//             </div>
//             <div className="createNewStockBatch-serial-inp-box">
//               <label htmlFor="batch_qty">Batch Qty<sup style={{ color: "red" }}>*</sup> :</label>
//               <input
//                 value={batchInp.batch_qty}
//                 onChange={handleBatchChange}
//                 type="number"
//                 id="batch_qty"
//                 placeholder="Enter quantity for this batch"
//               />
//             </div>
//             <div className="createNewStockBatch-serial-inp-box">
//               <label htmlFor="mfg_date">Mfg. Date :</label>
//               <input
//                 value={batchInp.mfg_date}
//                 onChange={handleBatchChange}
//                 type="date"
//                 id="mfg_date"
//               />
//             </div>
//             <div className="createNewStockBatch-serial-inp-box">
//               <label htmlFor="expiry_date">Expiry Date :</label>
//               <input
//                 value={batchInp.expiry_date}
//                 onChange={handleBatchChange}
//                 type="date"
//                 id="expiry_date"
//               />
//             </div>
//             <button
//               type="submit"
//               className={
//                 !batchInp.batch_no || !batchInp.batch_qty
//                   ? "createNewStockBatch-serial-inactive"
//                   : "createNewStockBatch-serial-active"
//               }
//               disabled={!batchInp.batch_no || !batchInp.batch_qty}
//             >
//               Add Batch
//             </button>
//           </form>

//           <p className="createNewStockBatch-duplicate-tit">Duplicate Numbers</p>
//           <textarea
//             className="createNewStockBatch-duplicate-box"
//             value={duplicates.join(", ")}
//             placeholder="Not found"
//             disabled
//             style={{ color: duplicates.length > 0 ? "red" : "inherit" }}
//           />
//         </nav>

//         {/* RIGHT — batch table */}
//         <div className="createNewStockBatch-table">
//           <table>
//             <thead className="createNewStockBatch-table-head">
//               <tr>
//                 <th>S.No</th>
//                 <th><pre>Batch No</pre></th>
//                 <th><pre>Expiry Date</pre></th>
//                 <th>B.Qty</th>
//                 <th>S.Qty</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody className="createNewStockBatch-table-body">
//               {batchList.length === 0 ? (
//                 <tr>
//                   <td colSpan={6} style={{ textAlign: "center", color: "#999" }}>
//                     No batches added
//                   </td>
//                 </tr>
//               ) : (
//                 batchList.map((batch, idx) => (
//                   <tr key={batch.id}>
//                     <td>{idx + 1}</td>
//                     <td>{batch.batch_no}</td>
//                     <td><pre>{batch.expiry_date || "—"}</pre></td>
//                     <td>{batch.batch_qty}</td>
//                     {/* S.Qty = how many serials generated for this batch */}
//                     <td>{batch.serials?.length || 0}</td>
//                     <td id="createNewStockBatch-table-action">
//                       {/* Three-dot menu */}
//                       <nav className="createNewStockBatch-dot-container">
//                         <button
//                           type="button"
//                           onClick={() => handleGenerateSerials(batch)}
//                         >
//                           Generate Serial No
//                         </button>
//                         {batch.serials?.length > 0 && (
//                           <button
//                             type="button"
//                             onClick={() => handleGenerateSerials(batch)}
//                           >
//                             View Serial No
//                           </button>
//                         )}
//                         <button
//                           type="button"
//                           onClick={() => handleRemoveBatch(batch.id)}
//                         >
//                           Remove
//                         </button>
//                       </nav>
//                       <svg
//                         className="createNewStockBatch-delete-logo"
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="24"
//                         height="24"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                       >
//                         <path
//                           d="M12 16C12.5304 16 13.0391 16.2107 13.4142 16.5858C13.7893 16.9609 14 17.4696 14 18C14 18.5304 13.7893 19.0391 13.4142 19.4142C13.0391 19.7893 12.5304 20 12 20C11.4696 20 10.9609 19.7893 10.5858 19.4142C10.2107 19.0391 10 18.5304 10 18C10 17.4696 10.2107 16.9609 10.5858 16.5858C10.9609 16.2107 11.4696 16 12 16ZM12 10C12.5304 10 13.0391 10.2107 13.4142 10.5858C13.7893 10.9609 14 11.4696 14 12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14C11.4696 14 10.9609 13.7893 10.5858 13.4142C10.2107 13.0391 10 12.5304 10 12C10 11.4696 10.2107 10.9609 10.5858 10.5858C10.9609 10.2107 11.4696 10 12 10ZM12 4C12.5304 4 13.0391 4.21071 13.4142 4.58579C13.7893 4.96086 14 5.46957 14 6C14 6.53043 13.7893 7.03914 13.4142 7.41421C13.0391 7.78929 12.5304 8 12 8C11.4696 8 10.9609 7.78929 10.5858 7.41421C10.2107 7.03914 10 6.53043 10 6C10 5.46957 10.2107 4.96086 10.5858 4.58579C10.9609 4.21071 11.4696 4 12 4Z"
//                           fill="#2A2A2A"
//                         />
//                       </svg>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* ── Buttons ── */}
//       <div className="createNewStockBatch-btn-container">
//         <button
//           type="button"
//           className="createNewStockBatch-cancel-btn"
//           onClick={() =>
//             setStockDim({
//               serialBox: false, batchBox: false,
//               activeRow: null, activeProduct: null, activeItemId: null,
//             })
//           }
//         >
//           Cancel
//         </button>
//         <button
//           type="button"
//           className={
//             batchList.length === 0 || isOverLimit || isSubmitting
//               ? "createNewStockBatch-inactive-btn"
//               : "createNewStockBatch-active-btn"
//           }
//           disabled={batchList.length === 0 || isOverLimit || isSubmitting}
//           onClick={handleApply}
//         >
//           {isSubmitting ? "Saving..." : "Apply"}
//         </button>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import { createPortal } from "react-dom";
import "./stockBatchNumber.css";
import { toast } from "react-toastify";
import stockReceiptApiProvider from "../../../../network/stockReceipt-api-provider";
import StockSerialNumber from "../stock-serial-num/stockSerialNumber";

export default function StockBatchNumber({
  setStockDim,
  activeProduct,
  stockReceiptId,
  itemId,
  onApply,
}) {
  const [batchInp, setBatchInp] = useState({
    batch_no: "", batch_qty: "", mfg_date: "", expiry_date: "",
  });
  const [batchList, setBatchList]       = useState([]);
  const [duplicates, setDuplicates]     = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Batch-level serial sub-modal state ───────────────────────────────────
  // activeBatchForSerial: the batch object currently having serials generated
  const [activeBatchForSerial, setActiveBatchForSerial] = useState(null);

  const handleBatchChange = (e) => {
    setBatchInp((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  // ── Add batch row ─────────────────────────────────────────────────────────
  const handleAddBatch = (e) => {
    e.preventDefault();
    if (!batchInp.batch_no || !batchInp.batch_qty) return;

    const isDup = batchList.some((b) => b.batch_no === batchInp.batch_no);
    if (isDup) {
      setDuplicates((prev) =>
        prev.includes(batchInp.batch_no) ? prev : [...prev, batchInp.batch_no]
      );
      toast.warning(`Batch "${batchInp.batch_no}" already exists`);
      return;
    }

    setBatchList((prev) => [
      ...prev,
      {
        id:          Date.now(),
        batch_no:    batchInp.batch_no,
        batch_qty:   parseInt(batchInp.batch_qty),
        mfg_date:    batchInp.mfg_date,
        expiry_date: batchInp.expiry_date,
        serials:     [],
      },
    ]);
    setBatchInp({ batch_no: "", batch_qty: "", mfg_date: "", expiry_date: "" });
    setDuplicates([]);
  };

  const handleRemoveBatch = (id) => {
    setBatchList((prev) => prev.filter((b) => b.id !== id));
  };

  // ── Open serial sub-modal for a specific batch ───────────────────────────
  const handleGenerateSerials = (batch) => {
    setActiveBatchForSerial(batch);
  };

  // ── Called when StockSerialNumber applies/cancels in batch mode ──────────
  const handleBatchSerialApply = (serials) => {
    if (serials !== null && activeBatchForSerial) {
      setBatchList((prev) =>
        prev.map((b) =>
          b.id === activeBatchForSerial.id ? { ...b, serials } : b
        )
      );
    }
    setActiveBatchForSerial(null);
  };

  // ── Totals ────────────────────────────────────────────────────────────────
  const totalBatched = batchList.reduce((acc, b) => acc + (parseInt(b.batch_qty) || 0), 0);
  const acceptedQty  = parseInt(activeProduct?.accepted_qty) || 0;
  const isOverLimit  = totalBatched > acceptedQty;

  // ── APPLY: POST to API if stockReceiptId exists ───────────────────────────
  const handleApply = async (e) => {
    e.preventDefault();
    if (batchList.length === 0) {
      toast.error("Please add at least one batch");
      return;
    }

    if (stockReceiptId && itemId) {
      setIsSubmitting(true);
      try {
        const result = await stockReceiptApiProvider.addBatchNumbers(
          stockReceiptId, itemId, batchList
        );
        if (result) {
          // For each batch that has serials, post them too
          const apiResults = Array.isArray(result) ? result : [result];
          for (let i = 0; i < batchList.length; i++) {
            const b       = batchList[i];
            const apiBatch = apiResults[i];
            if (b.serials?.length > 0 && apiBatch?.id && stockReceiptId && itemId) {
              await stockReceiptApiProvider.addBatchSerialNumbers(
                stockReceiptId, itemId, apiBatch.id, b.serials
              );
            }
          }
          toast.success("Batch numbers saved successfully");
          onApply?.(batchList);
          setStockDim({
            serialBox: false, batchBox: false,
            activeRow: null, activeProduct: null, activeItemId: null,
          });
        }
      } catch {
        toast.error("Failed to save batch numbers");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.info("Batch numbers will be submitted when you save the draft");
      onApply?.(batchList);
      setStockDim({
        serialBox: false, batchBox: false,
        activeRow: null, activeProduct: null, activeItemId: null,
      });
    }
  };

  // ── If serial sub-modal is open, render it on top ─────────────────────────
  if (activeBatchForSerial) {
    return (
      <StockSerialNumber
        setStockDim={setStockDim}
        batchMode={true}
        batchNo={activeBatchForSerial.batch_no}
        batchQty={activeBatchForSerial.batch_qty}
        onBatchSerialApply={handleBatchSerialApply}
      />
    );
  }

  return createPortal(
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", justifyContent:"center", alignItems:"center", zIndex:9999, padding:"20px", boxSizing:"border-box" }}>
    <div className="createNewStockBatch-container" style={{ maxWidth:"900px", width:"100%", maxHeight:"90vh", overflowY:"auto" }}>
      <h3>Generate Batch Numbers</h3>

      {/* ── Product Info ── */}
      <div className="createNewStockBatch-input-container">
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
            value="Batch"
            onChange={() =>
              setStockDim({
                serialBox: true, batchBox: false,
                activeRow: null, activeProduct: activeProduct, activeItemId: itemId,
              })
            }
          >
            <option value="Batch">Batch</option>
            <option value="Serial">Serial</option>
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
          <label>Batched Qty</label>
          <input
            value={totalBatched}
            disabled
            style={{ color: isOverLimit ? "red" : "inherit" }}
          />
        </div>
      </div>

      {isOverLimit && (
        <p style={{ color: "red", fontSize: "12px", margin: "4px 0 8px" }}>
          ⚠ Batched quantity exceeds accepted quantity ({acceptedQty})
        </p>
      )}

      {/* ── Input + Table ── */}
      <div className="createNewStockBatch-division">

        {/* LEFT — form */}
        <nav>
          <form className="createNewStockBatch-serial-inp" onSubmit={handleAddBatch}>
            <div className="createNewStockBatch-serial-inp-box">
              <label htmlFor="batch_no">Batch No<sup style={{ color: "red" }}>*</sup> :</label>
              <input
                value={batchInp.batch_no}
                onChange={handleBatchChange}
                type="text"
                id="batch_no"
                placeholder="Enter Batch Number"
              />
            </div>
            <div className="createNewStockBatch-serial-inp-box">
              <label htmlFor="batch_qty">Batch Qty<sup style={{ color: "red" }}>*</sup> :</label>
              <input
                value={batchInp.batch_qty}
                onChange={handleBatchChange}
                type="number"
                id="batch_qty"
                placeholder="Enter quantity for this batch"
              />
            </div>
            <div className="createNewStockBatch-serial-inp-box">
              <label htmlFor="mfg_date">Mfg. Date :</label>
              <input
                value={batchInp.mfg_date}
                onChange={handleBatchChange}
                type="date"
                id="mfg_date"
              />
            </div>
            <div className="createNewStockBatch-serial-inp-box">
              <label htmlFor="expiry_date">Expiry Date :</label>
              <input
                value={batchInp.expiry_date}
                onChange={handleBatchChange}
                type="date"
                id="expiry_date"
              />
            </div>
            <button
              type="submit"
              className={
                !batchInp.batch_no || !batchInp.batch_qty
                  ? "createNewStockBatch-serial-inactive"
                  : "createNewStockBatch-serial-active"
              }
              disabled={!batchInp.batch_no || !batchInp.batch_qty}
            >
              Add Batch
            </button>
          </form>

          <p className="createNewStockBatch-duplicate-tit">Duplicate Numbers</p>
          <textarea
            className="createNewStockBatch-duplicate-box"
            value={duplicates.join(", ")}
            placeholder="Not found"
            disabled
            style={{ color: duplicates.length > 0 ? "red" : "inherit" }}
          />
        </nav>

        {/* RIGHT — batch table */}
        <div className="createNewStockBatch-table">
          <table>
            <thead className="createNewStockBatch-table-head">
              <tr>
                <th>S.No</th>
                <th><pre>Batch No</pre></th>
                <th><pre>Expiry Date</pre></th>
                <th>B.Qty</th>
                <th>S.Qty</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="createNewStockBatch-table-body">
              {batchList.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", color: "#999" }}>
                    No batches added
                  </td>
                </tr>
              ) : (
                batchList.map((batch, idx) => (
                  <tr key={batch.id}>
                    <td>{idx + 1}</td>
                    <td>{batch.batch_no}</td>
                    <td><pre>{batch.expiry_date || "—"}</pre></td>
                    <td>{batch.batch_qty}</td>
                    {/* S.Qty = how many serials generated for this batch */}
                    <td>{batch.serials?.length || 0}</td>
                    <td id="createNewStockBatch-table-action">
                      {/* Three-dot menu */}
                      <nav className="createNewStockBatch-dot-container">
                        <button
                          type="button"
                          onClick={() => handleGenerateSerials(batch)}
                        >
                          Generate Serial No
                        </button>
                        {batch.serials?.length > 0 && (
                          <button
                            type="button"
                            onClick={() => handleGenerateSerials(batch)}
                          >
                            View Serial No
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveBatch(batch.id)}
                        >
                          Remove
                        </button>
                      </nav>
                      <svg
                        className="createNewStockBatch-delete-logo"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12 16C12.5304 16 13.0391 16.2107 13.4142 16.5858C13.7893 16.9609 14 17.4696 14 18C14 18.5304 13.7893 19.0391 13.4142 19.4142C13.0391 19.7893 12.5304 20 12 20C11.4696 20 10.9609 19.7893 10.5858 19.4142C10.2107 19.0391 10 18.5304 10 18C10 17.4696 10.2107 16.9609 10.5858 16.5858C10.9609 16.2107 11.4696 16 12 16ZM12 10C12.5304 10 13.0391 10.2107 13.4142 10.5858C13.7893 10.9609 14 11.4696 14 12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14C11.4696 14 10.9609 13.7893 10.5858 13.4142C10.2107 13.0391 10 12.5304 10 12C10 11.4696 10.2107 10.9609 10.5858 10.5858C10.9609 10.2107 11.4696 10 12 10ZM12 4C12.5304 4 13.0391 4.21071 13.4142 4.58579C13.7893 4.96086 14 5.46957 14 6C14 6.53043 13.7893 7.03914 13.4142 7.41421C13.0391 7.78929 12.5304 8 12 8C11.4696 8 10.9609 7.78929 10.5858 7.41421C10.2107 7.03914 10 6.53043 10 6C10 5.46957 10.2107 4.96086 10.5858 4.58579C10.9609 4.21071 11.4696 4 12 4Z"
                          fill="#2A2A2A"
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
      <div className="createNewStockBatch-btn-container">
        <button
          type="button"
          className="createNewStockBatch-cancel-btn"
          onClick={() =>
            setStockDim({
              serialBox: false, batchBox: false,
              activeRow: null, activeProduct: null, activeItemId: null,
            })
          }
        >
          Cancel
        </button>
        <button
          type="button"
          className={
            batchList.length === 0 || isOverLimit || isSubmitting
              ? "createNewStockBatch-inactive-btn"
              : "createNewStockBatch-active-btn"
          }
          disabled={batchList.length === 0 || isOverLimit || isSubmitting}
          onClick={handleApply}
        >
          {isSubmitting ? "Saving..." : "Apply"}
        </button>
      </div>
    </div>
    </div>,
    document.body
  );
}