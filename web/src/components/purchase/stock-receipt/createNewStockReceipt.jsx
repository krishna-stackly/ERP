
// // // // import React, { useEffect, useState } from "react";
// // // // import "./createNewStockReceipt.css";
// // // // import { useNavigate } from "react-router-dom";
// // // // import StockListItem from "./stockListItem";
// // // // import StockComment from "./stockComment";
// // // // import StockHistory from "./stockHistory";
// // // // import StockAttachment from "./stockAttachment";
// // // // import StockSerialNumber from "./stock-serial-num/stockSerialNumber";
// // // // import StockBatchNumber from "./stock-batch-num/stockBatchNumber";
// // // // import { toast } from "react-toastify";
// // // // import stockReceiptApiProvider from "../../../network/stockReceipt-api-provider";
// // // // import purchaseOrderApiProvider from "../../../network/purchaseOrder-api-provider";

// // // // export default function CreateNewStockReceipt({ setCurrentPage }) {
// // // //   const prevpg = useNavigate();

// // // //   const [stockReceiptStatus, setStockReceiptStatus] = useState("");
// // // //   const [createdGrnId, setCreatedGrnId]             = useState(null);
// // // //   const [isLoading, setIsLoading]                   = useState(false);

// // // //   const [poList, setPoList]     = useState([]);
// // // //   const [lineItems, setLineItems] = useState([]);

// // // //   const [stockInput, setStockInput] = useState({
// // // //     grn_id:              "",
// // // //     po_reference_id:     "",
// // // //     received_date:       "",
// // // //     supplier_name:       "",
// // // //     supplier_dn_no:      "",
// // // //     supplier_invoice_no: "",
// // // //     received_by:         "",
// // // //     qc_done_by:          "",
// // // //   });

// // // //   const [detail, setDetail] = useState({
// // // //     comment: true, history: false, attachment: false,
// // // //   });

// // // //   const [stockBtn, setStockBtn] = useState({
// // // //     BtnAccess:    false,
// // // //     cancal_grn:   true,
// // // //     draft:        false,
// // // //     submit:       false,
// // // //     pdf:          true,
// // // //     mail:         true,
// // // //     stock_return: true,
// // // //   });

// // // //   const [stockDim, setStockDim] = useState({
// // // //     serialBox:     false,
// // // //     batchBox:      false,
// // // //     batchSerialNO: false,
// // // //     activeRow:     null,
// // // //     activeProduct: null,
// // // //     activeItemId:  null,
// // // //   });

// // // //   // =========================================================================
// // // //   // LOAD PO LIST ON MOUNT
// // // //   // API returns: { message, data: { from, to, totalCount, totalPages, data: [...] } }
// // // //   // =========================================================================
// // // //   useEffect(() => {
// // // //     const loadPos = async () => {
// // // //       try {
// // // //        const res = await purchaseOrderApiProvider.fetchPurchaseOrders(1, "");
// // // // const allPos = Array.isArray(res?.data?.data) ? res.data.data : [];
// // // //         // const available = allPos.filter((po) =>
// // // //         //   ["Submitted", "Partially Received"].includes(po.status)
// // // //         // );
// // // //         const available = allPos; // no filter
// // // //         setPoList(available);
// // // //       } catch (err) {
// // // //         console.error("Failed to load PO list:", err);
// // // //       }
// // // //     };
// // // //     loadPos();
// // // //   }, []);

// // // //   // =========================================================================
// // // //   // WHEN PO REFERENCE CHANGES — fetch PO and populate line items + supplier
// // // //   // API returns: { message, data: { id, PO_ID, supplier, items, ... } }
// // // //   // =========================================================================
// // // //   useEffect(() => {
// // // //     const fetchPoItems = async () => {
// // // //       if (!stockInput.po_reference_id) {
// // // //         setLineItems([]);
// // // //         setStockInput((prev) => ({ ...prev, supplier_name: "" }));
// // // //         return;
// // // //       }

// // // //       try {
// // // //         const res = await purchaseOrderApiProvider.fetchSinglePurchaseOrder(
// // // //           stockInput.po_reference_id
// // // //         );
// // // //         console.log("Single PO res:", res);

// // // //         // ✅ Unwrap: provider returns res.data from axios
// // // //         // API shape: { message, data: { supplier, items, ... } }
// // // //         const po = res?.data || res;
// // // //         if (!po) return;

// // // //         // Auto-fill supplier name
// // // //         setStockInput((prev) => ({
// // // //           ...prev,
// // // //           supplier_name: po.supplier?.supplier_name || po.supplier_name || "",
// // // //         }));

// // // //         // Build line items from PO items
// // // //         const rows = (po.items || []).map((item, idx) => ({
// // // //           id:                 idx,
// // // //           backend_item_id:    item.id || null,
// // // //           product_id:         String(item.product),       // ✅ numeric id for payload
// // // //           product_display_id: item.product_id || "",      // "CVB005" for display only
// // // //           product_name:       item.product_name || "",
// // // //           uom:                item.uom || "",
// // // //           qty_ordered:        item.qty_ordered  || 0,
// // // //           qty_received:       item.qty_ordered  || 0,     // default = ordered qty
// // // //           accepted_qty:       item.qty_ordered  || 0,     // default = ordered qty
// // // //           rejected_qty:       0,
// // // //           qty_returned:       0,
// // // //           stock_dim:          "None",
// // // //           selected_warehouse: "",
// // // //           unit_price:         item.unit_price   || 0,
// // // //           tax_rate:           item.tax_rate     || 0,
// // // //           discount_rate:      item.discount_rate || 0,
// // // //           serials:            [],
// // // //           batches:            [],
// // // //         }));

// // // //         setLineItems(rows);
// // // //       } catch (err) {
// // // //         console.error("Failed to fetch PO details:", err);
// // // //       }
// // // //     };

// // // //     fetchPoItems();
// // // //   }, [stockInput.po_reference_id]);

// // // //   // =========================================================================
// // // //   // BUTTON ACCESS CONTROL
// // // //   // =========================================================================
// // // //   useEffect(() => {
// // // //     switch (stockReceiptStatus) {
// // // //       case "":
// // // //         setStockBtn({ BtnAccess: false, cancal_grn: true,  draft: false, submit: false, pdf: true,  mail: true,  stock_return: true });
// // // //         break;
// // // //       case "Draft":
// // // //         setStockBtn({ BtnAccess: false, cancal_grn: true,  draft: false, submit: false, pdf: false, mail: false, stock_return: true });
// // // //         break;
// // // //       case "Submitted":
// // // //         setStockBtn({ BtnAccess: true,  cancal_grn: false, draft: true,  submit: true,  pdf: false, mail: false, stock_return: false });
// // // //         break;
// // // //       case "Cancelled":
// // // //       case "Returned":
// // // //         setStockBtn({ BtnAccess: true,  cancal_grn: true,  draft: true,  submit: true,  pdf: false, mail: false, stock_return: true });
// // // //         break;
// // // //       default:
// // // //         break;
// // // //     }
// // // //   }, [stockReceiptStatus]);

// // // //   // =========================================================================
// // // //   // div>UT HANDLER
// // // //   // =========================================================================
// // // //   const handleStockInputChange = (e) => {
// // // //     setStockInput((prev) => ({ ...prev, [e.target.id]: e.target.value }));
// // // //   };

// // // //   // =========================================================================
// // // //   // LINE ITEM CHANGE HANDLER
// // // //   // =========================================================================
// // // //   const handleLineItemChange = (rowId, field, value) => {
// // // //     setLineItems((prev) =>
// // // //       prev.map((row) => {
// // // //         if (row.id !== rowId) return row;
// // // //         const updated = { ...row, [field]: value };
// // // //         if (field === "qty_received" || field === "accepted_qty") {
// // // //           const received = parseInt(field === "qty_received" ? value : updated.qty_received) || 0;
// // // //           const accepted = parseInt(field === "accepted_qty"  ? value : updated.accepted_qty) || 0;
// // // //           updated.rejected_qty = Math.max(0, received - accepted);
// // // //         }
// // // //         return updated;
// // // //       })
// // // //     );
// // // //   };

// // // //   // =========================================================================
// // // //   // SERIAL / BATCH CALLBACKS
// // // //   // =========================================================================
// // // //   const handleSerialApply = (serials) => {
// // // //     const rowId = stockDim.activeRow;
// // // //     setLineItems((prev) =>
// // // //       prev.map((row) => (row.id === rowId ? { ...row, serials } : row))
// // // //     );
// // // //   };

// // // //   const handleBatchApply = (batches) => {
// // // //     const rowId = stockDim.activeRow;
// // // //     setLineItems((prev) =>
// // // //       prev.map((row) => (row.id === rowId ? { ...row, batches } : row))
// // // //     );
// // // //   };

// // // //   // =========================================================================
// // // //   // BUILD PAYLOAD
// // // //   // =========================================================================
// // // //   const buildPayload = () => ({
// // // //     po_reference:        parseInt(stockInput.po_reference_id),
// // // //     received_date:       stockInput.received_date,
// // // //     supplier_dn_no:      stockInput.supplier_dn_no,
// // // //     supplier_invoice_no: stockInput.supplier_invoice_no,
// // // //     received_by:         stockInput.received_by,
// // // //     qc_done_by:          stockInput.qc_done_by,
// // // //     status:              "Draft",
// // // //     items: lineItems.map((row) => ({
// // // //       product:       parseInt(row.product_id),          // ✅ numeric id
// // // //       uom:           row.uom,
// // // //       qty_ordered:   parseFloat(row.qty_ordered)  || 0,
// // // //       qty_received:  parseFloat(row.qty_received) || 0,
// // // //       accepted_qty:  parseFloat(row.accepted_qty) || 0,
// // // //       rejected_qty:  parseFloat(row.rejected_qty) || 0,
// // // //       qty_returned:  parseFloat(row.qty_returned) || 0,
// // // //       stock_dim:     row.stock_dim || "None",
// // // //       warehouse:     row.selected_warehouse || "",
// // // //       unit_price:    parseFloat(row.unit_price)    || 0,
// // // //       tax_rate:      parseFloat(row.tax_rate)      || 0,
// // // //       discount_rate: parseFloat(row.discount_rate) || 0,
// // // //     })),
// // // //   });

// // // //   // =========================================================================
// // // //   // SAVE DRAFT
// // // //   // =========================================================================
// // // //   const handleDraftState = async (e) => {
// // // //     e.preventDefault();

// // // //     if (!stockInput.po_reference_id) { toast.error("Please select a PO Reference"); return; }
// // // //     if (!stockInput.received_date)   { toast.error("Please select a Received Date"); return; }
// // // //     if (lineItems.length === 0)      { toast.error("No line items found");           return; }

// // // //     setIsLoading(true);
// // // //     try {
// // // //       const payload = buildPayload();
// // // //       let grnId     = createdGrnId;
// // // //       let savedItems = [];

// // // //       if (!grnId) {
// // // //         console.log("Creating stock receipt...", payload);
// // // //         const result = await stockReceiptApiProvider.createStockReceipt(payload);
// // // //         console.log("Create result:", result);
// // // //         if (!result) return;

// // // //         // ✅ Unwrap response: { message, data: { id, GRN_ID, items } }
// // // //         const data = result?.data || result;
// // // //         grnId = data?.id;
// // // //         savedItems = data?.items || [];
// // // //         const grnIdDisplay = data?.GRN_ID || "";

// // // //         setCreatedGrnId(grnId);
// // // //         if (grnIdDisplay) setStockInput((prev) => ({ ...prev, grn_id: grnIdDisplay }));

// // // //         if (savedItems.length > 0) {
// // // //           setLineItems((prev) =>
// // // //             prev.map((row, idx) => ({
// // // //               ...row,
// // // //               backend_item_id: savedItems[idx]?.id || row.backend_item_id,
// // // //             }))
// // // //           );
// // // //         }
// // // //       } else {
// // // //         const result = await stockReceiptApiProvider.updateStockReceipt(grnId, payload);
// // // //         if (!result) return;
// // // //         const data = result?.data || result;
// // // //         savedItems = data?.items || [];
// // // //       }

// // // //       setStockReceiptStatus("Draft");
// // // //       toast.success("Stock Receipt saved as Draft!");

// // // //       // Post serial numbers
// // // //       for (let i = 0; i < lineItems.length; i++) {
// // // //         const row    = lineItems[i];
// // // //         const itemId = savedItems[i]?.id || row.backend_item_id;
// // // //         if (row.stock_dim === "Serial" && row.serials?.length > 0 && itemId) {
// // // //           await stockReceiptApiProvider.addSerialNumbers(grnId, itemId, row.serials);
// // // //         }
// // // //       }

// // // //       // Post batch numbers
// // // //       for (let i = 0; i < lineItems.length; i++) {
// // // //         const row    = lineItems[i];
// // // //         const itemId = savedItems[i]?.id || row.backend_item_id;
// // // //         if (row.stock_dim === "Batch" && row.batches?.length > 0 && itemId) {
// // // //           await stockReceiptApiProvider.addBatchNumbers(grnId, itemId, row.batches);
// // // //         }
// // // //       }

// // // //     } catch (err) {
// // // //       console.error("handleDraftState error:", err);
// // // //       toast.error("Failed to save draft");
// // // //     } finally {
// // // //       setIsLoading(false);
// // // //     }
// // // //   };

// // // //   // =========================================================================
// // // //   // SUBMIT GRN
// // // //   // =========================================================================
// // // //   const handleSubmittedState = async (e) => {
// // // //     e.preventDefault();
// // // //     if (!createdGrnId) { toast.error("Please save as Draft first before submitting."); return; }
// // // //     setIsLoading(true);
// // // //     try {
// // // //       const result = await stockReceiptApiProvider.perdiv>on(createdGrnId, "submit");
// // // //       if (result) {
// // // //         setStockReceiptStatus("Submitted");
// // // //         toast.success("Stock Receipt submitted successfully");
// // // //       }
// // // //     } finally {
// // // //       setIsLoading(false);
// // // //     }
// // // //   };

// // // //   // =========================================================================
// // // //   // CANCEL GRN
// // // //   // =========================================================================
// // // //   const handleCancelledState = async (e) => {
// // // //     e.preventDefault();
// // // //     if (!createdGrnId) return;
// // // //     setIsLoading(true);
// // // //     try {
// // // //       const result = await stockReceiptApiProvider.perdiv>on(createdGrnId, "cancel");
// // // //       if (result) {
// // // //         setStockReceiptStatus("Cancelled");
// // // //         toast.success("Stock Receipt cancelled");
// // // //       }
// // // //     } finally {
// // // //       setIsLoading(false);
// // // //     }
// // // //   };

// // // //   // =========================================================================
// // // //   // STATUS BADGE CLASS
// // // //   // =========================================================================
// // // //   const statusClass = {
// // // //     Draft:     "cerateNewStock-Status-draft",
// // // //     Submitted: "cerateNewStock-Status-Submitted",
// // // //     Cancelled: "cerateNewStock-Status-Cancelled",
// // // //     Returned:  "cerateNewStock-Status-Returned",
// // // //   }[stockReceiptStatus] || "";

// // // //   const isModalOpen = stockDim.serialBox || stockDim.batchBox || stockDim.batchSerialNO;

// // // //   // =========================================================================
// // // //   // RENDER
// // // //   // =========================================================================
// // // //   return (
// // // //     <>
// // // //       {stockDim.serialBox && (
// // // //         <div className="cerateNewStock-btn">
// // // //           <StockSerialNumber
// // // //             setStockDim={setStockDim}
// // // //             activeProduct={stockDim.activeProduct}
// // // //             stockReceiptId={createdGrnId}
// // // //             itemId={stockDim.activeItemId}
// // // //             onApply={handleSerialApply}
// // // //           />
// // // //         </div>
// // // //       )}

// // // //       {stockDim.batchBox && (
// // // //         <div className="cerateNewStock-btn">
// // // //           <StockBatchNumber
// // // //             setStockDim={setStockDim}
// // // //             activeProduct={stockDim.activeProduct}
// // // //             stockReceiptId={createdGrnId}
// // // //             itemId={stockDim.activeItemId}
// // // //             onApply={handleBatchApply}
// // // //           />
// // // //         </div>
// // // //       )}

// // // //       <div className={`cerateNewStock-container ${isModalOpen ? "cerateNewStock-blur" : ""}`}>
// // // //         <div submit={handleSubmittedState}>

// // // //           {/* ── HEADER ── */}
// // // //           <div className="cerateNewStock-head">
// // // //             <nav>
// // // //               <p>{stockReceiptStatus === "" ? "New Stock Receipt" : "Stock Receipt"}</p>
// // // //               {stockReceiptStatus !== "" && (
// // // //                 <h3 className={statusClass}>Status: {stockReceiptStatus}</h3>
// // // //               )}
// // // //             </nav>
// // // //             <div>
// // // //               <button
// // // //                 type="button"
// // // //                 className={stockReceiptStatus === "Submitted" ? "cerateNewStock-active-btn" : "cerateNewStock-inactive-btn"}
// // // //                 disabled={stockBtn.stock_return}
// // // //               >
// // // //                 Stock Return
// // // //               </button>
// // // //               <nav className="cerateNewStock-close" onClick={(e) => { e.preventDefault(); prevpg(-1); }}>
// // // //                 <svg className="cerateNewStock-circle-x-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
// // // //                   <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
// // // //                 </svg>
// // // //                 <p>Close</p>
// // // //               </nav>
// // // //             </div>
// // // //           </div>

// // // //           {/* ── GRN DETAILS ── */}
// // // //           <div className="cerateNewStock-input-container">
// // // //             <div className="cerateNewStock-input-box">
// // // //               <label>GRN ID (Auto Generate)</label>
// // // //               <input type="text" value={stockInput.grn_id} placeholder="Auto Generate" disabled />
// // // //             </div>
// // // //             <div className="cerateNewStock-input-box">
// // // //               <label htmlFor="po_reference_id">PO Reference ID<sup>*</sup></label>
// // // //               <select
// // // //                 id="po_reference_id"
// // // //                 value={stockInput.po_reference_id}
// // // //                 onChange={handleStockInputChange}
// // // //                 disabled={stockBtn.BtnAccess}
// // // //               >
// // // //                 <option value="">Select PO Reference</option>
// // // //                 {poList.map((po) => (
// // // //                   <option key={po.id} value={po.id}>
// // // //                     {po.PO_ID || po.po_id || `PO-${po.id}`}
// // // //                   </option>
// // // //                 ))}
// // // //               </select>
// // // //             </div>
// // // //           </div>

// // // //           <div className="cerateNewStock-input-container">
// // // //             <div className="cerateNewStock-input-box">
// // // //               <label htmlFor="received_date">Received Date<sup>*</sup></label>
// // // //               <input id="received_date" type="date" value={stockInput.received_date} onChange={handleStockInputChange} disabled={stockBtn.BtnAccess} />
// // // //             </div>
// // // //             <div className="cerateNewStock-input-box">
// // // //               <label htmlFor="supplier_name">Supplier Name<sup>*</sup></label>
// // // //               <input id="supplier_name" type="text" value={stockInput.supplier_name} onChange={handleStockInputChange} placeholder="Auto-filled from PO" disabled={stockBtn.BtnAccess} />
// // // //             </div>
// // // //           </div>

// // // //           <div className="cerateNewStock-input-container">
// // // //             <div className="cerateNewStock-input-box">
// // // //               <label htmlFor="supplier_dn_no">Supplier DN No.</label>
// // // //               <input id="supplier_dn_no" type="text" value={stockInput.supplier_dn_no} onChange={handleStockInputChange} placeholder="Enter Supplier DN No." disabled={stockBtn.BtnAccess} />
// // // //             </div>
// // // //             <div className="cerateNewStock-input-box">
// // // //               <label htmlFor="supplier_invoice_no">Supplier Invoice No.</label>
// // // //               <input id="supplier_invoice_no" type="text" value={stockInput.supplier_invoice_no} onChange={handleStockInputChange} placeholder="Enter Supplier Invoice No." disabled={stockBtn.BtnAccess} />
// // // //             </div>
// // // //           </div>

// // // //           <div className="cerateNewStock-input-container">
// // // //             <div className="cerateNewStock-input-box">
// // // //               <label htmlFor="received_by">Received By</label>
// // // //               <input id="received_by" type="text" value={stockInput.received_by} onChange={handleStockInputChange} placeholder="Enter name" disabled={stockBtn.BtnAccess} />
// // // //             </div>
// // // //             <div className="cerateNewStock-input-box">
// // // //               <label htmlFor="qc_done_by">QC Done By</label>
// // // //               <input id="qc_done_by" type="text" value={stockInput.qc_done_by} onChange={handleStockInputChange} placeholder="Enter name" disabled={stockBtn.BtnAccess} />
// // // //             </div>
// // // //           </div>

// // // //           {/* ── LINE ITEMS ── */}
// // // //           <nav className="cerateNewStock-subtit">Line Items<sup>*</sup></nav>
// // // //           <div className="cerateNewStock-table-container">
// // // //             <table>
// // // //               <thead className="cerateNewStock-table-head">
// // // //                 <tr>
// // // //                   <th>#</th>
// // // //                   <th><pre>Product Name</pre></th>
// // // //                   <th><pre>Product ID</pre></th>
// // // //                   <th>UOM</th>
// // // //                   <th><pre>Qty Ordered</pre></th>
// // // //                   <th><pre>Qty Received</pre></th>
// // // //                   <th><pre>Accepted Qty</pre></th>
// // // //                   <th><pre>Rejected Qty</pre></th>
// // // //                   <th><pre>Qty Returned</pre></th>
// // // //                   <th><pre>Stock Dim.</pre></th>
// // // //                   <th>Warehouse</th>
// // // //                   <th><pre>Unit Price</pre></th>
// // // //                   <th><pre>Tax (%)</pre></th>
// // // //                   <th><pre>Discount (%)</pre></th>
// // // //                   <th>Total</th>
// // // //                   <th>Action</th>
// // // //                 </tr>
// // // //               </thead>
// // // //               <tbody className="cerateNewStock-table-body">
// // // //                 {lineItems.length === 0 ? (
// // // //                   <tr>
// // // //                     <td colSpan={16} style={{ textAlign: "center", color: "#999" }}>
// // // //                       {stockInput.po_reference_id
// // // //                         ? "Loading items..."
// // // //                         : "Select a PO Reference to load items"}
// // // //                     </td>
// // // //                   </tr>
// // // //                 ) : (
// // // //                   lineItems.map((row, idx) => (
// // // //                     <StockListItem
// // // //                       key={row.id}
// // // //                       index={idx + 1}
// // // //                       rowData={row}
// // // //                       BtnAccess={stockBtn.BtnAccess}
// // // //                       onFieldChange={handleLineItemChange}
// // // //                        stockInput={stockInput}
// // // //                       onOpenDim={(dimType) => {
// // // //                         setStockDim({
// // // //                           serialBox:     dimType === "Serial",
// // // //                           batchBox:      dimType === "Batch",
// // // //                           batchSerialNO: false,
// // // //                           activeRow:     row.id,
// // // //                           activeProduct: {
// // // //                             product_name: row.product_name,
// // // //                             product_id:   row.product_display_id || row.product_id,
// // // //                             uom:          row.uom,
// // // //                             qty_received: row.qty_received,
// // // //                             accepted_qty: row.accepted_qty,
// // // //                           },
// // // //                           activeItemId: row.backend_item_id,
// // // //                         });
// // // //                       }}
// // // //                     />
// // // //                   ))
// // // //                 )}
// // // //               </tbody>
// // // //             </table>
// // // //           </div>

// // // //           {/* ── COMMENTS / HISTORY / ATTACHMENTS ── */}
// // // //           <div className="cerateNewStock-hub-container">
// // // //             <div className="cerateNewStock-hub-head">
// // // //               <p className={detail.comment    ? "cerateNewStock-hub-head-bg-black" : "cerateNewStock-hub-head-tit"} onClick={() => setDetail({ history: false, attachment: false, comment: true })}>Comments</p>
// // // //               <p className={detail.history    ? "cerateNewStock-hub-head-bg-black" : "cerateNewStock-hub-head-tit"} onClick={() => setDetail({ history: true,  attachment: false, comment: false })}>History</p>
// // // //               <p className={detail.attachment ? "cerateNewStock-hub-head-bg-black" : "cerateNewStock-hub-head-tit"} onClick={() => setDetail({ history: false, attachment: true,  comment: false })}>Attachments</p>
// // // //             </div>
// // // //             <div className="cerateNewStock-hub-body">
// // // //               {detail.comment    && <StockComment />}
// // // //               {detail.history    && <StockHistory />}
// // // //               {detail.attachment && <StockAttachment inputDisable={stockBtn.BtnAccess} />}
// // // //             </div>
// // // //           </div>

// // // //           {/* ── ACTION BUTTONS ── */}
// // // //           <div className="cerateNewStock-btn-container">
// // // //             <button
// // // //               type="button"
// // // //               onClick={handleCancelledState}
// // // //               className={["Submitted", "Cancelled"].includes(stockReceiptStatus) ? "cerateNewStock-order-active-btn" : "cerateNewStock-inactive-btn"}
// // // //               disabled={stockBtn.cancal_grn}
// // // //             >
// // // //               {stockReceiptStatus === "Cancelled" ? "Cancelled GRN" : "Cancel GRN"}
// // // //             </button>

// // // //             <nav>
// // // //               <button type="button" className="cerateNewStock-cancel-btn" onClick={(e) => { e.preventDefault(); prevpg(-1); }}>
// // // //                 Cancel
// // // //               </button>

// // // //               <button
// // // //                 type="button"
// // // //                 onClick={handleDraftState}
// // // //                 className={["", "Draft"].includes(stockReceiptStatus) ? "cerateNewStock-active-btn" : "cerateNewStock-completed-btn"}
// // // //                 disabled={stockBtn.draft || isLoading}
// // // //               >
// // // //                 {isLoading ? "Saving..." : "Save Draft"}
// // // //               </button>

// // // //               <button
// // // //                 type="submit"
// // // //                 className={["", "Draft"].includes(stockReceiptStatus) ? "cerateNewStock-active-btn" : "cerateNewStock-completed-btn"}
// // // //                 disabled={stockBtn.submit || isLoading}
// // // //               >
// // // //                 {stockReceiptStatus === "Submitted" ? "Submitted" : "Submit"}
// // // //               </button>

// // // //               <svg
// // // //                 className={!stockBtn.pdf ? "cerateNewStock-pdf-mail-activelogo" : "cerateNewStock-pdf-mail-futurelogo"}
// // // //                 style={{ cursor: !stockBtn.pdf ? "pointer" : "default" }}
// // // //                 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 24" fill="none"
// // // //               >
// // // //                 <path fillRule="evenodd" clipRule="evenodd" d="M0.600098 2.4C0.600098 1.76348 0.852954 1.15303 1.30304 0.702944C1.75313 0.252856 2.36358 0 3.0001 0L16.1313 0L21.4001 5.2688V21.6C21.4001 22.2365 21.1472 22.847 20.6972 23.2971C20.2471 23.7471 19.6366 24 19.0001 24H3.0001C2.36358 24 1.75313 23.7471 1.30304 23.2971C0.852954 22.847 0.600098 22.2365 0.600098 21.6V2.4ZM4.6001 9.6H2.2001V17.6H3.8001V14.4H4.6001C5.23662 14.4 5.84707 14.1471 6.29715 13.6971C6.74724 13.247 7.0001 12.6365 7.0001 12C7.0001 11.3635 6.74724 10.753 6.29715 10.3029C5.84707 9.85286 5.23662 9.6 4.6001 9.6ZM11.0001 9.6H8.6001V17.6H11.0001C11.6366 17.6 12.2471 17.3471 12.6972 16.8971C13.1472 16.447 13.4001 15.8365 13.4001 15.2V12C13.4001 11.3635 13.1472 10.753 12.6972 10.3029C12.2471 9.85286 11.6366 9.6 11.0001 9.6ZM15.0001 17.6V9.6H19.8001V11.2H16.6001V12.8H18.2001V14.4H16.6001V17.6H15.0001Z" />
// // // //               </svg>

// // // //               <svg
// // // //                 className={!stockBtn.mail ? "cerateNewStock-pdf-mail-activelogo" : "cerateNewStock-pdf-mail-futurelogo"}
// // // //                 style={{ cursor: !stockBtn.mail ? "pointer" : "default" }}
// // // //                 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 16" fill="none"
// // // //               >
// // // //                 <path d="M2 16C1.45 16 0.979333 15.8043 0.588 15.413C0.196667 15.0217 0.000666667 14.5507 0 14V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196666 1.45067 0.000666667 2 0H18C18.55 0 19.021 0.196 19.413 0.588C19.805 0.98 20.0007 1.45067 20 2V14C20 14.55 19.8043 15.021 19.413 15.413C19.0217 15.805 18.5507 16.0007 18 16H2ZM10 8.825C10.0833 8.825 10.171 8.81233 10.263 8.787C10.355 8.76167 10.4423 8.72433 10.525 8.675L17.6 4.25C17.7333 4.16667 17.8333 4.06267 17.9 3.938C17.9667 3.81333 18 3.67567 18 3.525C18 3.19167 17.8583 2.94167 17.575 2.775C17.2917 2.60833 17 2.61667 16.7 2.8L10 7L3.3 2.8C3 2.61667 2.70833 2.61267 2.425 2.788C2.14167 2.96333 2 3.209 2 3.525C2 3.69167 2.03333 3.83767 2.1 3.963C2.16667 4.08833 2.26667 4.184 2.4 4.25L9.475 8.675C9.55833 8.725 9.646 8.76267 9.738 8.788C9.83 8.81333 9.91733 8.82567 10 8.825Z" />
// // // //               </svg>
// // // //             </nav>
// // // //           </div>

// // // //         </div>
// // // //       </div>
// // // //     </>
// // // //   );
// // // // }
// // // import React, { useEffect, useRef, useState } from "react";
// // // import "./createNewStockReceipt.css";
// // // import { useNavigate } from "react-router-dom";
// // // import StockListItem from "./stockListItem";
// // // import StockSerialNumber from "./stock-serial-num/stockSerialNumber";
// // // import StockBatchNumber from "./stock-batch-num/stockBatchNumber";
// // // import { toast } from "react-toastify";
// // // import stockReceiptApiProvider from "../../../network/stockReceipt-api-provider";
// // // import purchaseOrderApiProvider from "../../../network/purchaseOrder-api-provider";

// // // // ─── map API response → form + line items ─────────────────────────────────────
// // // function mapGRNToState(grn) {
// // //   if (!grn || !Object.keys(grn).length) return null;
// // //   return {
// // //     form: {
// // //       grn_id:              grn.GRN_ID             || "",
// // //       po_reference_id:     grn.po_reference_id    || "",
// // //       po_reference_display: grn.po_reference      || "",
// // //       received_date:       grn.received_date      || "",
// // //       supplier_name:       grn.supplier?.supplier_name || "",
// // //       supplier_dn_no:      grn.supplier_dn_no     || "",
// // //       supplier_invoice_no: grn.supplier_invoice_no || "",
// // //       received_by:         grn.received_by        || "",
// // //       qc_done_by:          grn.qc_done_by         || "",
// // //     },
// // //     lineItems: (grn.items || []).map((item, idx) => ({
// // //       id:                 idx,
// // //       backend_item_id:    item.id,
// // //       product_id:         String(item.product),
// // //       product_display_id: item.product_id   || "",
// // //       product_name:       item.product_name || "",
// // //       uom:                item.uom          || "",
// // //       qty_ordered:        item.qty_ordered  || 0,
// // //       qty_received:       item.qty_received || 0,
// // //       accepted_qty:       item.accepted_qty || 0,
// // //       rejected_qty:       item.rejected_qty || 0,
// // //       qty_returned:       item.qty_returned || 0,
// // //       stock_dim:          item.stock_dim    || "None",
// // //       selected_warehouse: item.warehouse    || "",
// // //       unit_price:         item.unit_price   || 0,
// // //       tax_rate:           item.tax_rate     || 0,
// // //       discount_rate:      item.discount_rate || 0,
// // //       serials:            (item.serial_numbers || []).map((s) => s.serial_no),
// // //       batches:            item.batch_numbers  || [],
// // //     })),
// // //     comments:    grn.comments    || [],
// // //     history:     grn.history     || [],
// // //     attachments: grn.attachments || [],
// // //     status:      grn.status      || "",
// // //     dbId:        grn.id          || null,
// // //   };
// // // }

// // // export default function CreateNewStockReceipt({
// // //   setCurrentPage,
// // //   editGRNData = {},
// // //   isEdit = false,
// // // }) {
// // //   const isEditMode = isEdit && Object.keys(editGRNData).length > 0;
// // //   const prevpg     = useNavigate();

// // //   const [pageLoading, setPageLoading] = useState(isEditMode);
// // //   const [isLoading,   setIsLoading]   = useState(false);

// // //   const [stockReceiptStatus, setStockReceiptStatus] = useState("");
// // //   const [createdGrnId,       setCreatedGrnId]       = useState(
// // //     isEditMode ? editGRNData.id || null : null
// // //   );

// // //   const [poList,     setPoList]     = useState([]);
// // //   const [lineItems,  setLineItems]  = useState([]);
// // //   const [comments,   setComments]   = useState([]);
// // //   const [history,    setHistory]    = useState([]);
// // //   const [attachments,setAttachments]= useState([]);
// // //   const [newComment, setNewComment] = useState("");

// // //   const [stockInput, setStockInput] = useState({
// // //     grn_id:               "",
// // //     po_reference_id:      "",
// // //     po_reference_display: "",
// // //     received_date:        "",
// // //     supplier_name:        "",
// // //     supplier_dn_no:       "",
// // //     supplier_invoice_no:  "",
// // //     received_by:          "",
// // //     qc_done_by:           "",
// // //   });

// // //   const [activeTab, setActiveTab] = useState("comments");
// // //   const fileInputRef = useRef(null);

// // //   const [stockBtn, setStockBtn] = useState({
// // //     BtnAccess:    false,
// // //     cancal_grn:   true,
// // //     draft:        false,
// // //     submit:       false,
// // //     pdf:          true,
// // //     mail:         true,
// // //     stock_return: true,
// // //   });

// // //   const [stockDim, setStockDim] = useState({
// // //     serialBox:     false,
// // //     batchBox:      false,
// // //     activeRow:     null,
// // //     activeProduct: null,
// // //     activeItemId:  null,
// // //   });

// // //   // ─── apply full GRN object → all state ─────────────────────────────────────
// // //   function applyGRNToState(grn) {
// // //     const mapped = mapGRNToState(grn);
// // //     if (!mapped) return;
// // //     setStockInput(mapped.form);
// // //     setLineItems(mapped.lineItems);
// // //     setComments(mapped.comments);
// // //     setHistory(mapped.history);
// // //     setAttachments(mapped.attachments);
// // //     setStockReceiptStatus(mapped.status);
// // //     setCreatedGrnId(mapped.dbId);
// // //   }

// // //   // ─── ON MOUNT ───────────────────────────────────────────────────────────────
// // //   useEffect(() => {
// // //     async function init() {
// // //       // load PO list
// // //       try {
// // //         const res    = await purchaseOrderApiProvider.fetchPurchaseOrders(1, "");
// // //         const allPos = Array.isArray(res?.data?.data) ? res.data.data
// // //                      : Array.isArray(res?.data)       ? res.data
// // //                      : Array.isArray(res)             ? res : [];
// // //         setPoList(allPos);
// // //       } catch (err) {
// // //         console.error("Failed to load PO list:", err);
// // //       }

// // //       // edit mode — fetch full GRN detail
// // //       if (isEditMode) {
// // //         const id     = editGRNData.id;
// // //         const detail = id
// // //           ? await stockReceiptApiProvider.fetchSingleStockReceipt(id)
// // //           : null;
// // //         applyGRNToState(detail || editGRNData);
// // //       }

// // //       setPageLoading(false);
// // //     }
// // //     init();
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, []);

// // //   // ─── autofill from PO when selected (create only) ────────────────────────
// // //   useEffect(() => {
// // //     if (!stockInput.po_reference_id || isEditMode) return;

// // //     async function loadPO() {
// // //       try {
// // //         const res = await purchaseOrderApiProvider.fetchSinglePurchaseOrder(
// // //           stockInput.po_reference_id
// // //         );
// // //         const po = res?.data || res;
// // //         if (!po) return;

// // //         setStockInput((prev) => ({
// // //           ...prev,
// // //           supplier_name: po.supplier?.supplier_name || po.supplier_name || "",
// // //         }));

// // //         const rows = (po.items || []).map((item, idx) => ({
// // //           id:                 idx,
// // //           backend_item_id:    null,
// // //           product_id:         String(item.product),
// // //           product_display_id: item.product_id     || item.product_id_display || "",
// // //           product_name:       item.product_name   || "",
// // //           uom:                item.uom            || "",
// // //           qty_ordered:        item.qty_ordered    || item.quantity || 0,
// // //           qty_received:       item.qty_ordered    || item.quantity || 0,
// // //           accepted_qty:       item.qty_ordered    || item.quantity || 0,
// // //           rejected_qty:       0,
// // //           qty_returned:       0,
// // //           stock_dim:          "None",
// // //           selected_warehouse: "",
// // //           unit_price:         item.unit_price     || 0,
// // //           tax_rate:           item.tax_rate       || 0,
// // //           discount_rate:      item.discount_rate  || 0,
// // //           serials:            [],
// // //           batches:            [],
// // //         }));

// // //         setLineItems(rows);
// // //       } catch (err) {
// // //         console.error("Failed to fetch PO details:", err);
// // //       }
// // //     }
// // //     loadPO();
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, [stockInput.po_reference_id]);

// // //   // ─── button access by status ─────────────────────────────────────────────
// // //   useEffect(() => {
// // //     switch (stockReceiptStatus) {
// // //       case "":
// // //         setStockBtn({ BtnAccess: false, cancal_grn: true,  draft: false, submit: false, pdf: true,  mail: true,  stock_return: true });
// // //         break;
// // //       case "Draft":
// // //         setStockBtn({ BtnAccess: false, cancal_grn: true,  draft: false, submit: false, pdf: false, mail: false, stock_return: true });
// // //         break;
// // //       case "Submitted":
// // //         setStockBtn({ BtnAccess: true,  cancal_grn: false, draft: true,  submit: true,  pdf: false, mail: false, stock_return: false });
// // //         break;
// // //       case "Cancelled":
// // //       case "Returned":
// // //         setStockBtn({ BtnAccess: true,  cancal_grn: true,  draft: true,  submit: true,  pdf: false, mail: false, stock_return: true });
// // //         break;
// // //       default:
// // //         break;
// // //     }
// // //   }, [stockReceiptStatus]);

// // //   const handleStockInputChange = (e) => {
// // //     setStockInput((prev) => ({ ...prev, [e.target.id]: e.target.value }));
// // //   };

// // //   const handleLineItemChange = (rowId, field, value) => {
// // //     setLineItems((prev) =>
// // //       prev.map((row) => {
// // //         if (row.id !== rowId) return row;
// // //         const updated = { ...row, [field]: value };
// // //         if (field === "qty_received" || field === "accepted_qty") {
// // //           const received = parseInt(field === "qty_received" ? value : updated.qty_received) || 0;
// // //           const accepted = parseInt(field === "accepted_qty"  ? value : updated.accepted_qty) || 0;
// // //           updated.rejected_qty = Math.max(0, received - accepted);
// // //         }
// // //         return updated;
// // //       })
// // //     );
// // //   };

// // //   const handleSerialApply = (serials) => {
// // //     setLineItems((prev) =>
// // //       prev.map((row) => row.id === stockDim.activeRow ? { ...row, serials } : row)
// // //     );
// // //   };

// // //   const handleBatchApply = (batches) => {
// // //     setLineItems((prev) =>
// // //       prev.map((row) => row.id === stockDim.activeRow ? { ...row, batches } : row)
// // //     );
// // //   };

// // //   // ─── build payload ──────────────────────────────────────────────────────────
// // //   function buildPayload() {
// // //     return {
// // //       po_reference:        parseInt(stockInput.po_reference_id) || undefined,
// // //       received_date:       stockInput.received_date             || null,
// // //       supplier_dn_no:      stockInput.supplier_dn_no,
// // //       supplier_invoice_no: stockInput.supplier_invoice_no,
// // //       received_by:         stockInput.received_by,
// // //       qc_done_by:          stockInput.qc_done_by,
// // //       status:              "Draft",
// // //       items: lineItems.map((row) => ({
// // //         ...(row.backend_item_id ? { id: row.backend_item_id } : {}),
// // //         product:       parseInt(row.product_id),
// // //         uom:           row.uom,
// // //         qty_ordered:   parseFloat(row.qty_ordered)  || 0,
// // //         qty_received:  parseFloat(row.qty_received) || 0,
// // //         accepted_qty:  parseFloat(row.accepted_qty) || 0,
// // //         rejected_qty:  parseFloat(row.rejected_qty) || 0,
// // //         qty_returned:  parseFloat(row.qty_returned) || 0,
// // //         stock_dim:     row.stock_dim               || "None",
// // //         warehouse:     row.selected_warehouse      || "",
// // //         unit_price:    parseFloat(row.unit_price)   || 0,
// // //         tax_rate:      parseFloat(row.tax_rate)     || 0,
// // //         discount_rate: parseFloat(row.discount_rate)|| 0,
// // //       })),
// // //     };
// // //   }

// // //   // ─── save draft ─────────────────────────────────────────────────────────────
// // //   const handleDraftState = async (e) => {
// // //     e.preventDefault();
// // //     if (!stockInput.po_reference_id) { toast.error("Please select a PO Reference"); return; }
// // //     if (!stockInput.received_date)   { toast.error("Please select a Received Date"); return; }
// // //     if (lineItems.length === 0)      { toast.error("No line items found");           return; }

// // //     setIsLoading(true);
// // //     try {
// // //       const payload  = buildPayload();
// // //       let grnId      = createdGrnId;
// // //       let savedItems = [];

// // //       if (!grnId) {
// // //         const result = await stockReceiptApiProvider.createStockReceipt(payload);
// // //         if (!result) return;
// // //         const data = result?.data || result;
// // //         grnId = data?.id;
// // //         savedItems = data?.items || [];

// // //         setCreatedGrnId(grnId);
// // //         if (data?.GRN_ID) setStockInput((prev) => ({ ...prev, grn_id: data.GRN_ID }));
// // //         if (savedItems.length > 0) {
// // //           setLineItems((prev) =>
// // //             prev.map((row, idx) => ({
// // //               ...row,
// // //               backend_item_id: savedItems[idx]?.id || row.backend_item_id,
// // //             }))
// // //           );
// // //         }
// // //       } else {
// // //         const result = await stockReceiptApiProvider.updateStockReceipt(grnId, payload);
// // //         if (!result) return;
// // //         savedItems = (result?.data || result)?.items || [];
// // //       }

// // //       setStockReceiptStatus("Draft");

// // //       // post serial numbers
// // //       for (let i = 0; i < lineItems.length; i++) {
// // //         const row    = lineItems[i];
// // //         const itemId = savedItems[i]?.id || row.backend_item_id;
// // //         if (row.stock_dim === "Serial" && row.serials?.length > 0 && itemId) {
// // //           await stockReceiptApiProvider.addSerialNumbers(grnId, itemId, row.serials);
// // //         }
// // //       }

// // //       // post batch numbers
// // //       for (let i = 0; i < lineItems.length; i++) {
// // //         const row    = lineItems[i];
// // //         const itemId = savedItems[i]?.id || row.backend_item_id;
// // //         if (row.stock_dim === "Batch" && row.batches?.length > 0 && itemId) {
// // //           await stockReceiptApiProvider.addBatchNumbers(grnId, itemId, row.batches);
// // //         }
// // //       }

// // //     } catch (err) {
// // //       console.error("handleDraftState error:", err);
// // //       toast.error("Failed to save draft");
// // //     } finally {
// // //       setIsLoading(false);
// // //     }
// // //   };

// // //   // ─── submit ─────────────────────────────────────────────────────────────────
// // //   const handleSubmittedState = async (e) => {
// // //     e.preventDefault();
// // //     if (!createdGrnId) { toast.error("Please save as Draft first"); return; }
// // //     setIsLoading(true);
// // //     try {
// // //       const result = await stockReceiptApiProvider.performAction(createdGrnId, "submit");
// // //       if (result) {
// // //         setStockReceiptStatus("Submitted");
// // //         // refresh to get updated history
// // //         const fresh = await stockReceiptApiProvider.fetchSingleStockReceipt(createdGrnId);
// // //         if (fresh) {
// // //           setHistory(fresh.history      || []);
// // //           setComments(fresh.comments    || []);
// // //           setAttachments(fresh.attachments || []);
// // //         }
// // //       }
// // //     } finally {
// // //       setIsLoading(false);
// // //     }
// // //   };

// // //   // ─── cancel ──────────────────────────────────────────────────────────────────
// // //   const handleCancelledState = async (e) => {
// // //     e.preventDefault();
// // //     if (!createdGrnId) return;
// // //     if (!window.confirm("Are you sure you want to cancel this GRN?")) return;
// // //     setIsLoading(true);
// // //     try {
// // //       const result = await stockReceiptApiProvider.performAction(createdGrnId, "cancel");
// // //       if (result) setStockReceiptStatus("Cancelled");
// // //     } finally {
// // //       setIsLoading(false);
// // //     }
// // //   };

// // //   // ─── comment ─────────────────────────────────────────────────────────────────
// // //   const handleAddComment = async (e) => {
// // //     e.preventDefault();
// // //     if (!newComment.trim()) return;
// // //     if (!createdGrnId) { toast.error("Save the GRN first"); return; }
// // //     const res = await stockReceiptApiProvider.addComment(createdGrnId, newComment.trim());
// // //     if (res) {
// // //       setComments((prev) => [...prev, res?.data || res]);
// // //       setNewComment("");
// // //     }
// // //   };

// // //   // ─── attachment ───────────────────────────────────────────────────────────────
// // //   const handleAttachmentUpload = async (e) => {
// // //     const file = e.target.files[0];
// // //     if (!file || !createdGrnId) return;
// // //     const res = await stockReceiptApiProvider.uploadAttachment(createdGrnId, file);
// // //     if (res) setAttachments((prev) => [...prev, res?.data || res]);
// // //     e.target.value = "";
// // //   };

// // //   // ─── pdf & email ──────────────────────────────────────────────────────────────
// // //   const handlePdf = async (e) => {
// // //     e.preventDefault();
// // //     if (!createdGrnId) return;
// // //     await stockReceiptApiProvider.downloadPDF(createdGrnId, stockInput.grn_id);
// // //   };

// // //   const handleEmail = async (e) => {
// // //     e.preventDefault();
// // //     if (!createdGrnId) return;
// // //     await stockReceiptApiProvider.sendEmail(createdGrnId);
// // //   };

// // //   const statusClass = {
// // //     Draft:     "cerateNewStock-Status-draft",
// // //     Submitted: "cerateNewStock-Status-Submitted",
// // //     Cancelled: "cerateNewStock-Status-Cancelled",
// // //     Returned:  "cerateNewStock-Status-Returned",
// // //   }[stockReceiptStatus] || "";

// // //   const isModalOpen = stockDim.serialBox || stockDim.batchBox;

// // //   if (pageLoading) {
// // //     return (
// // //       <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
// // //         <p style={{ fontSize: "15px", color: "#888" }}>Loading stock receipt…</p>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <>
// // //       {stockDim.serialBox && (
// // //         <div className="cerateNewStock-btn">
// // //           <StockSerialNumber
// // //             setStockDim={setStockDim}
// // //             activeProduct={stockDim.activeProduct}
// // //             stockReceiptId={createdGrnId}
// // //             itemId={stockDim.activeItemId}
// // //             onApply={handleSerialApply}
// // //           />
// // //         </div>
// // //       )}

// // //       {stockDim.batchBox && (
// // //         <div className="cerateNewStock-btn">
// // //           <StockBatchNumber
// // //             setStockDim={setStockDim}
// // //             activeProduct={stockDim.activeProduct}
// // //             stockReceiptId={createdGrnId}
// // //             itemId={stockDim.activeItemId}
// // //             onApply={handleBatchApply}
// // //           />
// // //         </div>
// // //       )}

// // //       <div className={`cerateNewStock-container ${isModalOpen ? "cerateNewStock-blur" : ""}`}>

// // //         {/* ── HEAD ───────────────────────────────────────────────────────── */}
// // //         <div className="cerateNewStock-head">
// // //           <nav>
// // //             <p>
// // //               {isEditMode
// // //                 ? stockReceiptStatus === "Draft" ? "Edit Stock Receipt" : "View Stock Receipt"
// // //                 : "New Stock Receipt"}
// // //             </p>
// // //             {stockReceiptStatus && (
// // //               <h3 className={statusClass}>Status: {stockReceiptStatus}</h3>
// // //             )}
// // //           </nav>
// // //           <div>
// // //             <button
// // //               type="button"
// // //               className={stockReceiptStatus === "Submitted" ? "cerateNewStock-active-btn" : "cerateNewStock-inactive-btn"}
// // //               disabled={stockBtn.stock_return}
// // //             >
// // //               Stock Return
// // //             </button>
// // //             <nav className="cerateNewStock-close" onClick={(e) => { e.preventDefault(); prevpg(-1); }}>
// // //               <svg className="cerateNewStock-circle-x-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
// // //                 <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
// // //               </svg>
// // //               <p>Close</p>
// // //             </nav>
// // //           </div>
// // //         </div>

// // //         {/* ── GRN DETAILS ─────────────────────────────────────────────────── */}
// // //         <div className="cerateNewStock-input-container">
// // //           <div className="cerateNewStock-input-box">
// // //             <label>GRN ID (Auto Generate)</label>
// // //             <input type="text" value={stockInput.grn_id} placeholder="Auto Generate" disabled />
// // //           </div>
// // //           <div className="cerateNewStock-input-box">
// // //             <label htmlFor="po_reference_id">PO Reference ID<sup>*</sup></label>
// // //             {isEditMode ? (
// // //               <input type="text" value={stockInput.po_reference_display || stockInput.po_reference_id} disabled />
// // //             ) : (
// // //               <select
// // //                 id="po_reference_id"
// // //                 value={stockInput.po_reference_id}
// // //                 onChange={handleStockInputChange}
// // //                 disabled={stockBtn.BtnAccess}
// // //               >
// // //                 <option value="">Select PO Reference</option>
// // //                 {poList.map((po) => (
// // //                   <option key={po.id} value={po.id}>
// // //                     {po.PO_ID || po.po_id || `PO-${po.id}`}
// // //                   </option>
// // //                 ))}
// // //               </select>
// // //             )}
// // //           </div>
// // //         </div>

// // //         <div className="cerateNewStock-input-container">
// // //           <div className="cerateNewStock-input-box">
// // //             <label htmlFor="received_date">Received Date<sup>*</sup></label>
// // //             <input
// // //               id="received_date"
// // //               type="date"
// // //               value={stockInput.received_date}
// // //               onChange={handleStockInputChange}
// // //               disabled={stockBtn.BtnAccess}
// // //             />
// // //           </div>
// // //           <div className="cerateNewStock-input-box">
// // //             <label htmlFor="supplier_name">Supplier Name</label>
// // //             <input
// // //               id="supplier_name"
// // //               type="text"
// // //               value={stockInput.supplier_name}
// // //               onChange={handleStockInputChange}
// // //               placeholder="Auto-filled from PO"
// // //               disabled={stockBtn.BtnAccess}
// // //             />
// // //           </div>
// // //         </div>

// // //         <div className="cerateNewStock-input-container">
// // //           <div className="cerateNewStock-input-box">
// // //             <label htmlFor="supplier_dn_no">Supplier DN No.</label>
// // //             <input
// // //               id="supplier_dn_no"
// // //               type="text"
// // //               value={stockInput.supplier_dn_no}
// // //               onChange={handleStockInputChange}
// // //               placeholder="Enter Supplier DN No."
// // //               disabled={stockBtn.BtnAccess}
// // //             />
// // //           </div>
// // //           <div className="cerateNewStock-input-box">
// // //             <label htmlFor="supplier_invoice_no">Supplier Invoice No.</label>
// // //             <input
// // //               id="supplier_invoice_no"
// // //               type="text"
// // //               value={stockInput.supplier_invoice_no}
// // //               onChange={handleStockInputChange}
// // //               placeholder="Enter Supplier Invoice No."
// // //               disabled={stockBtn.BtnAccess}
// // //             />
// // //           </div>
// // //         </div>

// // //         <div className="cerateNewStock-input-container">
// // //           <div className="cerateNewStock-input-box">
// // //             <label htmlFor="received_by">Received By</label>
// // //             <input
// // //               id="received_by"
// // //               type="text"
// // //               value={stockInput.received_by}
// // //               onChange={handleStockInputChange}
// // //               placeholder="Enter name or user ID"
// // //               disabled={stockBtn.BtnAccess}
// // //             />
// // //           </div>
// // //           <div className="cerateNewStock-input-box">
// // //             <label htmlFor="qc_done_by">QC Done By</label>
// // //             <input
// // //               id="qc_done_by"
// // //               type="text"
// // //               value={stockInput.qc_done_by}
// // //               onChange={handleStockInputChange}
// // //               placeholder="Enter name or user ID"
// // //               disabled={stockBtn.BtnAccess}
// // //             />
// // //           </div>
// // //         </div>

// // //         {/* ── LINE ITEMS ──────────────────────────────────────────────────── */}
// // //         <nav className="cerateNewStock-subtit">Line Items<sup>*</sup></nav>
// // //         <div className="cerateNewStock-table-container">
// // //           <table>
// // //             <thead className="cerateNewStock-table-head">
// // //               <tr>
// // //                 <th>#</th>
// // //                 <th><pre>Product Name</pre></th>
// // //                 <th><pre>Product ID</pre></th>
// // //                 <th>UOM</th>
// // //                 <th><pre>Qty Ordered</pre></th>
// // //                 <th><pre>Qty Received</pre></th>
// // //                 <th><pre>Accepted Qty</pre></th>
// // //                 <th><pre>Rejected Qty</pre></th>
// // //                 <th><pre>Qty Returned</pre></th>
// // //                 <th><pre>Stock Dim.</pre></th>
// // //                 <th>Warehouse</th>
// // //                 <th><pre>Unit Price</pre></th>
// // //                 <th><pre>Tax (%)</pre></th>
// // //                 <th><pre>Discount (%)</pre></th>
// // //                 <th>Total</th>
// // //                 <th>Action</th>
// // //               </tr>
// // //             </thead>
// // //             <tbody className="cerateNewStock-table-body">
// // //               {lineItems.length === 0 ? (
// // //                 <tr>
// // //                   <td colSpan={16} style={{ textAlign: "center", color: "#999", padding: "20px" }}>
// // //                     {stockInput.po_reference_id
// // //                       ? "Loading items from PO…"
// // //                       : "Select a PO Reference to load items"}
// // //                   </td>
// // //                 </tr>
// // //               ) : (
// // //                 lineItems.map((row, idx) => (
// // //                   <StockListItem
// // //                     key={row.id}
// // //                     index={idx + 1}
// // //                     rowData={row}
// // //                     BtnAccess={stockBtn.BtnAccess}
// // //                     onFieldChange={handleLineItemChange}
// // //                     onOpenDim={(dimType) => {
// // //                       setStockDim({
// // //                         serialBox:     dimType === "Serial",
// // //                         batchBox:      dimType === "Batch",
// // //                         activeRow:     row.id,
// // //                         activeProduct: {
// // //                           product_name: row.product_name,
// // //                           product_id:   row.product_display_id || row.product_id,
// // //                           uom:          row.uom,
// // //                           qty_received: row.qty_received,
// // //                           accepted_qty: row.accepted_qty,
// // //                         },
// // //                         activeItemId: row.backend_item_id,
// // //                       });
// // //                     }}
// // //                   />
// // //                 ))
// // //               )}
// // //             </tbody>
// // //           </table>
// // //         </div>

// // //         {/* ── COMMENTS / HISTORY / ATTACHMENTS ────────────────────────────── */}
// // //         <div className="cerateNewStock-hub-container">
// // //           <div className="cerateNewStock-hub-head">
// // //             {["comments", "history", "attachments"].map((tab) => (
// // //               <p
// // //                 key={tab}
// // //                 className={activeTab === tab
// // //                   ? "cerateNewStock-hub-head-bg-black"
// // //                   : "cerateNewStock-hub-head-tit"}
// // //                 onClick={() => setActiveTab(tab)}
// // //                 style={{ textTransform: "capitalize" }}
// // //               >
// // //                 {tab}
// // //               </p>
// // //             ))}
// // //           </div>

// // //           <div className="cerateNewStock-hub-body">

// // //             {/* Comments */}
// // //             {activeTab === "comments" && (
// // //               <div className="cerateNewStock-comment-container">
// // //                 <p>Add Comment:</p>
// // //                 <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
// // //                   <input
// // //                     type="text"
// // //                     value={newComment}
// // //                     onChange={(e) => setNewComment(e.target.value)}
// // //                     placeholder="Enter your comment…"
// // //                     style={{ flex: 1, padding: "8px 12px", borderRadius: "6px", border: "1px solid #ddd" }}
// // //                   />
// // //                   <button
// // //                     onClick={handleAddComment}
// // //                     className="cerateNewStock-active-btn"
// // //                     style={{ padding: "8px 16px" }}
// // //                   >
// // //                     + Add
// // //                   </button>
// // //                 </div>
// // //                 <div className="cerateNewStock-comment-brline" />
// // //                 <div className="cerateNewStock-showarea">
// // //                   {comments.length === 0 ? (
// // //                     <p style={{ color: "#888", fontSize: "13px", padding: "8px" }}>No comments yet.</p>
// // //                   ) : comments.map((c, i) => (
// // //                     <div key={i} className="cerateNewStock-message-container">
// // //                       <svg className="cerateNewStock-comment-profile-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
// // //                         <rect width="24" height="24" rx="12" fill="#E0E4E7" />
// // //                         <path d="M7 17.33V16.6219C7 15.3072 7.52224 14.0464 8.45184 13.1168C9.38143 12.1872 10.6422 11.665 11.9569 11.665M11.9569 11.665C13.2715 11.665 14.5323 12.1872 15.4619 13.1168C16.3915 14.0464 16.9138 15.3072 16.9138 16.6219V17.33M11.9569 11.665C12.7081 11.665 13.4286 11.3666 13.9598 10.8354C14.491 10.3042 14.7894 9.58373 14.7894 8.8325C14.7894 8.08127 14.491 7.36082 13.9598 6.82962C13.4286 6.29842 12.7081 6 11.9569 6C11.2057 6 10.4852 6.29842 9.954 6.82962C9.4228 7.36082 9.12438 8.08127 9.12438 8.8325C9.12438 9.58373 9.4228 10.3042 9.954 10.8354C10.4852 11.3666 11.2057 11.665 11.9569 11.665Z"
// // //                           stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
// // //                       </svg>
// // //                       <div className="cerateNewStock-message-box">
// // //                         <p>{c.created_by || c.comment_by} · {new Date(c.timestamp).toLocaleString()}</p>
// // //                         <nav>{c.comment}</nav>
// // //                       </div>
// // //                     </div>
// // //                   ))}
// // //                 </div>
// // //               </div>
// // //             )}

// // //             {/* History */}
// // //             {activeTab === "history" && (
// // //               <div className="cerateNewStock-history-container">
// // //                 {history.length === 0 ? (
// // //                   <p style={{ color: "#888", fontSize: "13px", padding: "12px" }}>No history yet.</p>
// // //                 ) : history.map((h, i) => (
// // //                   <div key={i} style={{
// // //                     padding: "10px 12px", background: "#f9f9f9",
// // //                     borderRadius: "6px", marginBottom: "6px",
// // //                   }}>
// // //                     <p style={{ fontSize: "13px", margin: 0 }}>
// // //                       <strong>{h.event_type}</strong>
// // //                       {h.details ? ` — ${h.details}` : ""}
// // //                     </p>
// // //                     <p style={{ fontSize: "11px", color: "#888", margin: "4px 0 0" }}>
// // //                       {h.action_by} · {new Date(h.timestamp).toLocaleString()}
// // //                     </p>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             )}

// // //             {/* Attachments */}
// // //             {activeTab === "attachments" && (
// // //               <div className="cerateNewStock-attachment-container">
// // //                 <input type="file" ref={fileInputRef} hidden onChange={handleAttachmentUpload} />
// // //                 <div className="cerateNewStock-upload-container">
// // //                   <div
// // //                     className="cerateNewStock-upload-btn"
// // //                     onClick={() => !stockBtn.BtnAccess && fileInputRef.current.click()}
// // //                     style={{ cursor: stockBtn.BtnAccess ? "not-allowed" : "pointer", opacity: stockBtn.BtnAccess ? 0.5 : 1 }}
// // //                   >
// // //                     <nav>Upload Files</nav>
// // //                   </div>
// // //                 </div>
// // //                 {attachments.length === 0 ? (
// // //                   <p style={{ color: "#888", fontSize: "13px", marginTop: "8px" }}>No attachments yet.</p>
// // //                 ) : attachments.map((att, i) => (
// // //                   <div key={i} className="cerateNewStock-file-item">
// // //                     <nav>{att.description || att.file?.split("/").pop()}</nav>
// // //                     <div className="cerateNewStock-file-actions">
// // //                       <a href={att.file} target="_blank" rel="noreferrer" download>Download</a>
// // //                       <span style={{ fontSize: "11px", color: "#888" }}>
// // //                         {att.uploaded_by} · {new Date(att.uploaded_at).toLocaleDateString()}
// // //                       </span>
// // //                     </div>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             )}
// // //           </div>
// // //         </div>

// // //         {/* ── ACTION BUTTONS ────────────────────────────────────────────────── */}
// // //         <div className="cerateNewStock-btn-container">
// // //           <button
// // //             type="button"
// // //             onClick={handleCancelledState}
// // //             className={["Submitted"].includes(stockReceiptStatus)
// // //               ? "cerateNewStock-order-active-btn"
// // //               : "cerateNewStock-inactive-btn"}
// // //             disabled={stockBtn.cancal_grn || isLoading}
// // //           >
// // //             {stockReceiptStatus === "Cancelled" ? "Cancelled GRN" : "Cancel GRN"}
// // //           </button>

// // //           <nav>
// // //             <button type="button" className="cerateNewStock-cancel-btn"
// // //               onClick={(e) => { e.preventDefault(); prevpg(-1); }}>
// // //               Cancel
// // //             </button>

// // //             <button
// // //               type="button"
// // //               onClick={handleDraftState}
// // //               className={["", "Draft"].includes(stockReceiptStatus)
// // //                 ? "cerateNewStock-active-btn"
// // //                 : "cerateNewStock-completed-btn"}
// // //               disabled={stockBtn.draft || isLoading}
// // //             >
// // //               {isLoading ? "Saving…" : "Save Draft"}
// // //             </button>

// // //             <button
// // //               type="button"
// // //               onClick={handleSubmittedState}
// // //               className={["", "Draft"].includes(stockReceiptStatus)
// // //                 ? "cerateNewStock-active-btn"
// // //                 : "cerateNewStock-completed-btn"}
// // //               disabled={stockBtn.submit || isLoading}
// // //             >
// // //               {stockReceiptStatus === "Submitted" ? "Submitted" : isLoading ? "Submitting…" : "Submit"}
// // //             </button>

// // //             <svg
// // //               className={!stockBtn.pdf ? "cerateNewStock-pdf-mail-activelogo" : "cerateNewStock-pdf-mail-futurelogo"}
// // //               style={{ cursor: !stockBtn.pdf ? "pointer" : "not-allowed", opacity: stockBtn.pdf ? 0.4 : 1 }}
// // //               onClick={!stockBtn.pdf ? handlePdf : undefined}
// // //               xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 24" fill="none"
// // //             >
// // //               <path fillRule="evenodd" clipRule="evenodd" d="M0.600098 2.4C0.600098 1.76348 0.852954 1.15303 1.30304 0.702944C1.75313 0.252856 2.36358 0 3.0001 0L16.1313 0L21.4001 5.2688V21.6C21.4001 22.2365 21.1472 22.847 20.6972 23.2971C20.2471 23.7471 19.6366 24 19.0001 24H3.0001C2.36358 24 1.75313 23.7471 1.30304 23.2971C0.852954 22.847 0.600098 22.2365 0.600098 21.6V2.4ZM4.6001 9.6H2.2001V17.6H3.8001V14.4H4.6001C5.23662 14.4 5.84707 14.1471 6.29715 13.6971C6.74724 13.247 7.0001 12.6365 7.0001 12C7.0001 11.3635 6.74724 10.753 6.29715 10.3029C5.84707 9.85286 5.23662 9.6 4.6001 9.6ZM11.0001 9.6H8.6001V17.6H11.0001C11.6366 17.6 12.2471 17.3471 12.6972 16.8971C13.1472 16.447 13.4001 15.8365 13.4001 15.2V12C13.4001 11.3635 13.1472 10.753 12.6972 10.3029C12.2471 9.85286 11.6366 9.6 11.0001 9.6ZM15.0001 17.6V9.6H19.8001V11.2H16.6001V12.8H18.2001V14.4H16.6001V17.6H15.0001Z" />
// // //             </svg>

// // //             <svg
// // //               className={!stockBtn.mail ? "cerateNewStock-pdf-mail-activelogo" : "cerateNewStock-pdf-mail-futurelogo"}
// // //               style={{ cursor: !stockBtn.mail ? "pointer" : "not-allowed", opacity: stockBtn.mail ? 0.4 : 1 }}
// // //               onClick={!stockBtn.mail ? handleEmail : undefined}
// // //               xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 16" fill="none"
// // //             >
// // //               <path d="M2 16C1.45 16 0.979333 15.8043 0.588 15.413C0.196667 15.0217 0.000666667 14.5507 0 14V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196666 1.45067 0.000666667 2 0H18C18.55 0 19.021 0.196 19.413 0.588C19.805 0.98 20.0007 1.45067 20 2V14C20 14.55 19.8043 15.021 19.413 15.413C19.0217 15.805 18.5507 16.0007 18 16H2ZM10 8.825C10.0833 8.825 10.171 8.81233 10.263 8.787C10.355 8.76167 10.4423 8.72433 10.525 8.675L17.6 4.25C17.7333 4.16667 17.8333 4.06267 17.9 3.938C17.9667 3.81833 18 3.67567 18 3.525C18 3.19167 17.8583 2.94167 17.575 2.775C17.2917 2.60833 17 2.61667 16.7 2.8L10 7L3.3 2.8C3 2.61667 2.70833 2.61267 2.425 2.788C2.14167 2.96333 2 3.209 2 3.525C2 3.69167 2.03333 3.83767 2.1 3.963C2.16667 4.08833 2.26667 4.184 2.4 4.25L9.475 8.675C9.55833 8.725 9.646 8.76267 9.738 8.788C9.83 8.81333 9.91733 8.82567 10 8.825Z" />
// // //             </svg>
// // //           </nav>
// // //         </div>

// // //       </div>
// // //     </>
// // //   );
// // // }
// // import React, { useEffect, useRef, useState } from "react";
// // import "./createNewStockReceipt.css";
// // import { useNavigate } from "react-router-dom";
// // import StockListItem from "./stockListItem";
// // import StockSerialNumber from "./stock-serial-num/stockSerialNumber";
// // import StockBatchNumber from "./stock-batch-num/stockBatchNumber";
// // import { toast } from "react-toastify";
// // import stockReceiptApiProvider from "../../../network/stockReceipt-api-provider";
// // import purchaseOrderApiProvider from "../../../network/purchaseOrder-api-provider";

// // // ─── map API response → form + line items ─────────────────────────────────────
// // function mapGRNToState(grn) {
// //   if (!grn || !Object.keys(grn).length) return null;
// //   return {
// //     form: {
// //       grn_id:              grn.GRN_ID             || "",
// //       po_reference_id:     grn.po_reference_id    || "",
// //       po_reference_display: grn.po_reference      || "",
// //       received_date:       grn.received_date      || "",
// //       supplier_name:       grn.supplier?.supplier_name || "",
// //       supplier_dn_no:      grn.supplier_dn_no     || "",
// //       supplier_invoice_no: grn.supplier_invoice_no || "",
// //       received_by:         grn.received_by        || "",
// //       qc_done_by:          grn.qc_done_by         || "",
// //     },
// //     lineItems: (grn.items || []).map((item, idx) => ({
// //       id:                 idx,
// //       backend_item_id:    item.id,
// //       product_id:         String(item.product),
// //       product_display_id: item.product_id   || "",
// //       product_name:       item.product_name || "",
// //       uom:                item.uom          || "",
// //       qty_ordered:        item.qty_ordered  || 0,
// //       qty_received:       item.qty_received || 0,
// //       accepted_qty:       item.accepted_qty || 0,
// //       rejected_qty:       item.rejected_qty || 0,
// //       qty_returned:       item.qty_returned || 0,
// //       stock_dim:          item.stock_dim    || "None",
// //       selected_warehouse: item.warehouse    || "",
// //       unit_price:         item.unit_price   || 0,
// //       tax_rate:           item.tax_rate     || 0,
// //       discount_rate:      item.discount_rate || 0,
// //       serials:            (item.serial_numbers || []).map((s) => s.serial_no),
// //       batches:            item.batch_numbers  || [],
// //     })),
// //     comments:    grn.comments    || [],
// //     history:     grn.history     || [],
// //     attachments: grn.attachments || [],
// //     status:      grn.status      || "",
// //     dbId:        grn.id          || null,
// //   };
// // }

// // export default function CreateNewStockReceipt({
// //   setCurrentPage,
// //   editGRNData = {},
// //   isEdit = false,
// // }) {
// //   const isEditMode = isEdit && Object.keys(editGRNData).length > 0;
// //   const prevpg     = useNavigate();

// //   const [pageLoading, setPageLoading] = useState(isEditMode);
// //   const [isLoading,   setIsLoading]   = useState(false);

// //   const [stockReceiptStatus, setStockReceiptStatus] = useState("");
// //   const [createdGrnId,       setCreatedGrnId]       = useState(
// //     isEditMode ? editGRNData.id || null : null
// //   );

// //   const [poList,     setPoList]     = useState([]);
// //   const [lineItems,  setLineItems]  = useState([]);
// //   const [comments,   setComments]   = useState([]);
// //   const [history,    setHistory]    = useState([]);
// //   const [attachments,setAttachments]= useState([]);
// //   const [newComment, setNewComment] = useState("");

// //   const [stockInput, setStockInput] = useState({
// //     grn_id:               "",
// //     po_reference_id:      "",
// //     po_reference_display: "",
// //     received_date:        "",
// //     supplier_name:        "",
// //     supplier_dn_no:       "",
// //     supplier_invoice_no:  "",
// //     received_by:          "",
// //     qc_done_by:           "",
// //   });

// //   const [activeTab, setActiveTab] = useState("comments");
// //   const fileInputRef = useRef(null);

// //   const [stockBtn, setStockBtn] = useState({
// //     BtnAccess:    false,
// //     cancal_grn:   true,
// //     draft:        false,
// //     submit:       false,
// //     pdf:          true,
// //     mail:         true,
// //     stock_return: true,
// //   });

// //   const [stockDim, setStockDim] = useState({
// //     serialBox:     false,
// //     batchBox:      false,
// //     activeRow:     null,
// //     activeProduct: null,
// //     activeItemId:  null,
// //   });

// //   // ─── apply full GRN object → all state ─────────────────────────────────────
// //   function applyGRNToState(grn) {
// //     const mapped = mapGRNToState(grn);
// //     if (!mapped) return;
// //     setStockInput(mapped.form);
// //     setLineItems(mapped.lineItems);
// //     setComments(mapped.comments);
// //     setHistory(mapped.history);
// //     setAttachments(mapped.attachments);
// //     setStockReceiptStatus(mapped.status);
// //     setCreatedGrnId(mapped.dbId);
// //   }

// //   // ─── ON MOUNT ───────────────────────────────────────────────────────────────
// //   useEffect(() => {
// //     async function init() {
// //       // load PO list
// //       try {
// //         const res    = await purchaseOrderApiProvider.fetchPurchaseOrders(1, "");
// //         const allPos = Array.isArray(res?.data?.data) ? res.data.data
// //                      : Array.isArray(res?.data)       ? res.data
// //                      : Array.isArray(res)             ? res : [];
// //         setPoList(allPos);
// //       } catch (err) {
// //         console.error("Failed to load PO list:", err);
// //       }

// //       // edit mode — fetch full GRN detail
// //       if (isEditMode) {
// //         const id     = editGRNData.id;
// //         const detail = id
// //           ? await stockReceiptApiProvider.fetchSingleStockReceipt(id)
// //           : null;
// //         applyGRNToState(detail || editGRNData);
// //       }

// //       setPageLoading(false);
// //     }
// //     init();
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   // ─── autofill from PO when selected (create only) ────────────────────────
// //   useEffect(() => {
// //     if (!stockInput.po_reference_id || isEditMode) return;

// //     async function loadPO() {
// //       try {
// //         const res = await purchaseOrderApiProvider.fetchSinglePurchaseOrder(
// //           stockInput.po_reference_id
// //         );
// //         const po = res?.data || res;
// //         if (!po) return;

// //         setStockInput((prev) => ({
// //           ...prev,
// //           supplier_name: po.supplier?.supplier_name || po.supplier_name || "",
// //         }));

// //         const rows = (po.items || []).map((item, idx) => ({
// //           id:                 idx,
// //           backend_item_id:    null,
// //           product_id:         String(item.product),
// //           product_display_id: item.product_id     || item.product_id_display || "",
// //           product_name:       item.product_name   || "",
// //           uom:                item.uom            || "",
// //           qty_ordered:        item.qty_ordered    || item.quantity || 0,
// //           qty_received:       item.qty_ordered    || item.quantity || 0,
// //           accepted_qty:       item.qty_ordered    || item.quantity || 0,
// //           rejected_qty:       0,
// //           qty_returned:       0,
// //           stock_dim:          "None",
// //           selected_warehouse: "",
// //           unit_price:         item.unit_price     || 0,
// //           tax_rate:           item.tax_rate       || 0,
// //           discount_rate:      item.discount_rate  || 0,
// //           serials:            [],
// //           batches:            [],
// //         }));

// //         setLineItems(rows);
// //       } catch (err) {
// //         console.error("Failed to fetch PO details:", err);
// //       }
// //     }
// //     loadPO();
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [stockInput.po_reference_id]);

// //   // ─── button access by status ─────────────────────────────────────────────
// //   useEffect(() => {
// //     switch (stockReceiptStatus) {
// //       case "":
// //         setStockBtn({ BtnAccess: false, cancal_grn: true,  draft: false, submit: false, pdf: true,  mail: true,  stock_return: true });
// //         break;
// //       case "Draft":
// //         setStockBtn({ BtnAccess: false, cancal_grn: true,  draft: false, submit: false, pdf: false, mail: false, stock_return: true });
// //         break;
// //       case "Submitted":
// //         setStockBtn({ BtnAccess: true,  cancal_grn: false, draft: true,  submit: true,  pdf: false, mail: false, stock_return: false });
// //         break;
// //       case "Cancelled":
// //       case "Returned":
// //         setStockBtn({ BtnAccess: true,  cancal_grn: true,  draft: true,  submit: true,  pdf: false, mail: false, stock_return: true });
// //         break;
// //       default:
// //         break;
// //     }
// //   }, [stockReceiptStatus]);

// //   const handleStockInputChange = (e) => {
// //     setStockInput((prev) => ({ ...prev, [e.target.id]: e.target.value }));
// //   };

// //   const handleLineItemChange = (rowId, field, value) => {
// //     setLineItems((prev) =>
// //       prev.map((row) => {
// //         if (row.id !== rowId) return row;
// //         const updated = { ...row, [field]: value };
// //         if (field === "qty_received" || field === "accepted_qty") {
// //           const received = parseInt(field === "qty_received" ? value : updated.qty_received) || 0;
// //           const accepted = parseInt(field === "accepted_qty"  ? value : updated.accepted_qty) || 0;
// //           updated.rejected_qty = Math.max(0, received - accepted);
// //         }
// //         return updated;
// //       })
// //     );
// //   };

// //   const handleSerialApply = (serials) => {
// //     setLineItems((prev) =>
// //       prev.map((row) => row.id === stockDim.activeRow ? { ...row, serials } : row)
// //     );
// //   };

// //   const handleBatchApply = (batches) => {
// //     setLineItems((prev) =>
// //       prev.map((row) => row.id === stockDim.activeRow ? { ...row, batches } : row)
// //     );
// //   };

// //   // ─── build payload ──────────────────────────────────────────────────────────
// //   function buildPayload() {
// //     return {
// //       po_reference:        parseInt(stockInput.po_reference_id) || undefined,
// //       received_date:       stockInput.received_date             || null,
// //       supplier_dn_no:      stockInput.supplier_dn_no,
// //       supplier_invoice_no: stockInput.supplier_invoice_no,
// //       received_by:         stockInput.received_by,
// //       qc_done_by:          stockInput.qc_done_by,
// //       status:              "Draft",
// //       items: lineItems.map((row) => ({
// //         ...(row.backend_item_id ? { id: row.backend_item_id } : {}),
// //         product:       parseInt(row.product_id),
// //         uom:           row.uom,
// //         qty_ordered:   parseFloat(row.qty_ordered)  || 0,
// //         qty_received:  parseFloat(row.qty_received) || 0,
// //         accepted_qty:  parseFloat(row.accepted_qty) || 0,
// //         rejected_qty:  parseFloat(row.rejected_qty) || 0,
// //         qty_returned:  parseFloat(row.qty_returned) || 0,
// //         stock_dim:     row.stock_dim               || "None",
// //         warehouse:     row.selected_warehouse      || "",
// //         unit_price:    parseFloat(row.unit_price)   || 0,
// //         tax_rate:      parseFloat(row.tax_rate)     || 0,
// //         discount_rate: parseFloat(row.discount_rate)|| 0,
// //       })),
// //     };
// //   }

// //   // ─── save draft ─────────────────────────────────────────────────────────────
// //   const handleDraftState = async (e) => {
// //     e.preventDefault();
// //     if (!stockInput.po_reference_id) { toast.error("Please select a PO Reference"); return; }
// //     if (!stockInput.received_date)   { toast.error("Please select a Received Date"); return; }
// //     if (lineItems.length === 0)      { toast.error("No line items found");           return; }

// //     setIsLoading(true);
// //     try {
// //       const payload  = buildPayload();
// //       let grnId      = createdGrnId;
// //       let savedItems = [];

// //       if (!grnId) {
// //         const result = await stockReceiptApiProvider.createStockReceipt(payload);
// //         if (!result) return;
// //         const data = result?.data || result;
// //         grnId = data?.id;
// //         savedItems = data?.items || [];

// //         setCreatedGrnId(grnId);
// //         if (data?.GRN_ID) setStockInput((prev) => ({ ...prev, grn_id: data.GRN_ID }));
// //         if (savedItems.length > 0) {
// //           setLineItems((prev) =>
// //             prev.map((row, idx) => ({
// //               ...row,
// //               backend_item_id: savedItems[idx]?.id || row.backend_item_id,
// //             }))
// //           );
// //         }
// //       } else {
// //         const result = await stockReceiptApiProvider.updateStockReceipt(grnId, payload);
// //         if (!result) return;
// //         savedItems = (result?.data || result)?.items || [];
// //       }

// //       setStockReceiptStatus("Draft");

// //       // post serial numbers
// //       for (let i = 0; i < lineItems.length; i++) {
// //         const row    = lineItems[i];
// //         const itemId = savedItems[i]?.id || row.backend_item_id;
// //         if (row.stock_dim === "Serial" && row.serials?.length > 0 && itemId) {
// //           await stockReceiptApiProvider.addSerialNumbers(grnId, itemId, row.serials);
// //         }
// //       }

// //       // post batch numbers
// //       for (let i = 0; i < lineItems.length; i++) {
// //         const row    = lineItems[i];
// //         const itemId = savedItems[i]?.id || row.backend_item_id;
// //         if (row.stock_dim === "Batch" && row.batches?.length > 0 && itemId) {
// //           await stockReceiptApiProvider.addBatchNumbers(grnId, itemId, row.batches);
// //         }
// //       }

// //     } catch (err) {
// //       console.error("handleDraftState error:", err);
// //       toast.error("Failed to save draft");
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   // ─── submit ─────────────────────────────────────────────────────────────────
// //   const handleSubmittedState = async (e) => {
// //     e.preventDefault();
// //     if (!createdGrnId) { toast.error("Please save as Draft first"); return; }
// //     setIsLoading(true);
// //     try {
// //       const result = await stockReceiptApiProvider.performAction(createdGrnId, "submit");
// //       if (result) {
// //         setStockReceiptStatus("Submitted");
// //         // refresh to get updated history
// //         const fresh = await stockReceiptApiProvider.fetchSingleStockReceipt(createdGrnId);
// //         if (fresh) {
// //           setHistory(fresh.history      || []);
// //           setComments(fresh.comments    || []);
// //           setAttachments(fresh.attachments || []);
// //         }
// //       }
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   // ─── cancel ──────────────────────────────────────────────────────────────────
// //   const handleCancelledState = async (e) => {
// //     e.preventDefault();
// //     if (!createdGrnId) return;
// //     if (!window.confirm("Are you sure you want to cancel this GRN?")) return;
// //     setIsLoading(true);
// //     try {
// //       const result = await stockReceiptApiProvider.performAction(createdGrnId, "cancel");
// //       if (result) setStockReceiptStatus("Cancelled");
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   // ─── stock return ─────────────────────────────────────────────────────────────
// //   const handleStockReturn = async (e) => {
// //     e.preventDefault();
// //     if (!createdGrnId) return;
// //     if (!window.confirm("Are you sure you want to generate a stock return for this GRN?")) return;
// //     setIsLoading(true);
// //     try {
// //       const result = await stockReceiptApiProvider.generateReturn(createdGrnId);
// //       if (result) {
// //         setStockReceiptStatus("Returned");
// //         // refresh to get updated history/comments after return
// //         const fresh = await stockReceiptApiProvider.fetchSingleStockReceipt(createdGrnId);
// //         if (fresh) {
// //           setHistory(fresh.history      || []);
// //           setComments(fresh.comments    || []);
// //           setAttachments(fresh.attachments || []);
// //         }
// //       }
// //     } catch (err) {
// //       console.error("handleStockReturn error:", err);
// //       toast.error("Failed to generate stock return");
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   // ─── comment ─────────────────────────────────────────────────────────────────
// //   const handleAddComment = async (e) => {
// //     e.preventDefault();
// //     if (!newComment.trim()) return;
// //     if (!createdGrnId) { toast.error("Save the GRN first"); return; }
// //     const res = await stockReceiptApiProvider.addComment(createdGrnId, newComment.trim());
// //     if (res) {
// //       setComments((prev) => [...prev, res?.data || res]);
// //       setNewComment("");
// //     }
// //   };

// //   // ─── attachment ───────────────────────────────────────────────────────────────
// //   const handleAttachmentUpload = async (e) => {
// //     const file = e.target.files[0];
// //     if (!file || !createdGrnId) return;
// //     const res = await stockReceiptApiProvider.uploadAttachment(createdGrnId, file);
// //     if (res) setAttachments((prev) => [...prev, res?.data || res]);
// //     e.target.value = "";
// //   };

// //   // ─── pdf & email ──────────────────────────────────────────────────────────────
// //   const handlePdf = async (e) => {
// //     e.preventDefault();
// //     if (!createdGrnId) return;
// //     await stockReceiptApiProvider.downloadPDF(createdGrnId, stockInput.grn_id);
// //   };

// //   const handleEmail = async (e) => {
// //     e.preventDefault();
// //     if (!createdGrnId) return;
// //     await stockReceiptApiProvider.sendEmail(createdGrnId);
// //   };

// //   const statusClass = {
// //     Draft:     "cerateNewStock-Status-draft",
// //     Submitted: "cerateNewStock-Status-Submitted",
// //     Cancelled: "cerateNewStock-Status-Cancelled",
// //     Returned:  "cerateNewStock-Status-Returned",
// //   }[stockReceiptStatus] || "";

// //   const isModalOpen = stockDim.serialBox || stockDim.batchBox;

// //   if (pageLoading) {
// //     return (
// //       <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
// //         <p style={{ fontSize: "15px", color: "#888" }}>Loading stock receipt…</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <>
// //      // REMOVE the wrapper divs — render modals directly at the top level

// // {stockDim.serialBox && (
// //   <StockSerialNumber
// //     setStockDim={setStockDim}
// //     activeProduct={stockDim.activeProduct}
// //     stockReceiptId={createdGrnId}
// //     itemId={stockDim.activeItemId}
// //     onApply={handleSerialApply}
// //     existingSerials={lineItems.find((r) => r.id === stockDim.activeRow)?.serials || []}
// //   />
// // {stockDim.serialBox && (
// //   <StockSerialNumber
// //     setStockDim={setStockDim}
// //     activeProduct={stockDim.activeProduct}
// //     stockReceiptId={createdGrnId}
// //     itemId={stockDim.activeItemId}
// //     onApply={handleSerialApply}
// //     existingSerials={lineItems.find((r) => r.id === stockDim.activeRow)?.serials || []}
// //   />
// // )}

// // {stockDim.batchBox && (
// //   <StockBatchNumber
// //     setStockDim={setStockDim}
// //     activeProduct={stockDim.activeProduct}
// //     stockReceiptId={createdGrnId}
// //     itemId={stockDim.activeItemId}
// //     onApply={handleBatchApply}
// //   />
// // )}

// //       <div className={`cerateNewStock-container ${isModalOpen ? "cerateNewStock-blur" : ""}`}>

// //         {/* ── HEAD ───────────────────────────────────────────────────────── */}
// //         <div className="cerateNewStock-head">
// //           <nav>
// //             <p>
// //               {isEditMode
// //                 ? stockReceiptStatus === "Draft" ? "Edit Stock Receipt" : "View Stock Receipt"
// //                 : "New Stock Receipt"}
// //             </p>
// //             {stockReceiptStatus && (
// //               <h3 className={statusClass}>Status: {stockReceiptStatus}</h3>
// //             )}
// //           </nav>
// //           <div>
// //             <button
// //               type="button"
// //               onClick={handleStockReturn}
// //               className={stockReceiptStatus === "Submitted" ? "cerateNewStock-order-active-btn" : "cerateNewStock-inactive-btn"}
// //               disabled={stockBtn.stock_return || isLoading}
// //             >
// //               {isLoading && !stockBtn.stock_return ? "Processing…" : "Stock Return"}
// //             </button>
// //             <nav className="cerateNewStock-close" onClick={(e) => { e.preventDefault(); prevpg(-1); }}>
// //               <svg className="cerateNewStock-circle-x-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
// //                 <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
// //               </svg>
// //               <p>Close</p>
// //             </nav>
// //           </div>
// //         </div>

// //         {/* ── GRN DETAILS ─────────────────────────────────────────────────── */}
// //         <div className="cerateNewStock-input-container">
// //           <div className="cerateNewStock-input-box">
// //             <label>GRN ID (Auto Generate)</label>
// //             <input type="text" value={stockInput.grn_id} placeholder="Auto Generate" disabled />
// //           </div>
// //           <div className="cerateNewStock-input-box">
// //             <label htmlFor="po_reference_id">PO Reference ID<sup>*</sup></label>
// //             {isEditMode ? (
// //               <input type="text" value={stockInput.po_reference_display || stockInput.po_reference_id} disabled />
// //             ) : (
// //               <select
// //                 id="po_reference_id"
// //                 value={stockInput.po_reference_id}
// //                 onChange={handleStockInputChange}
// //                 disabled={stockBtn.BtnAccess}
// //               >
// //                 <option value="">Select PO Reference</option>
// //                 {poList.map((po) => (
// //                   <option key={po.id} value={po.id}>
// //                     {po.PO_ID || po.po_id || `PO-${po.id}`}
// //                   </option>
// //                 ))}
// //               </select>
// //             )}
// //           </div>
// //         </div>

// //         <div className="cerateNewStock-input-container">
// //           <div className="cerateNewStock-input-box">
// //             <label htmlFor="received_date">Received Date<sup>*</sup></label>
// //             <input
// //               id="received_date"
// //               type="date"
// //               value={stockInput.received_date}
// //               onChange={handleStockInputChange}
// //               disabled={stockBtn.BtnAccess}
// //             />
// //           </div>
// //           <div className="cerateNewStock-input-box">
// //             <label htmlFor="supplier_name">Supplier Name</label>
// //             <input
// //               id="supplier_name"
// //               type="text"
// //               value={stockInput.supplier_name}
// //               onChange={handleStockInputChange}
// //               placeholder="Auto-filled from PO"
// //               disabled={stockBtn.BtnAccess}
// //             />
// //           </div>
// //         </div>

// //         <div className="cerateNewStock-input-container">
// //           <div className="cerateNewStock-input-box">
// //             <label htmlFor="supplier_dn_no">Supplier DN No.</label>
// //             <input
// //               id="supplier_dn_no"
// //               type="text"
// //               value={stockInput.supplier_dn_no}
// //               onChange={handleStockInputChange}
// //               placeholder="Enter Supplier DN No."
// //               disabled={stockBtn.BtnAccess}
// //             />
// //           </div>
// //           <div className="cerateNewStock-input-box">
// //             <label htmlFor="supplier_invoice_no">Supplier Invoice No.</label>
// //             <input
// //               id="supplier_invoice_no"
// //               type="text"
// //               value={stockInput.supplier_invoice_no}
// //               onChange={handleStockInputChange}
// //               placeholder="Enter Supplier Invoice No."
// //               disabled={stockBtn.BtnAccess}
// //             />
// //           </div>
// //         </div>

// //         <div className="cerateNewStock-input-container">
// //           <div className="cerateNewStock-input-box">
// //             <label htmlFor="received_by">Received By</label>
// //             <input
// //               id="received_by"
// //               type="text"
// //               value={stockInput.received_by}
// //               onChange={handleStockInputChange}
// //               placeholder="Enter name or user ID"
// //               disabled={stockBtn.BtnAccess}
// //             />
// //           </div>
// //           <div className="cerateNewStock-input-box">
// //             <label htmlFor="qc_done_by">QC Done By</label>
// //             <input
// //               id="qc_done_by"
// //               type="text"
// //               value={stockInput.qc_done_by}
// //               onChange={handleStockInputChange}
// //               placeholder="Enter name or user ID"
// //               disabled={stockBtn.BtnAccess}
// //             />
// //           </div>
// //         </div>

// //         {/* ── LINE ITEMS ──────────────────────────────────────────────────── */}
// //         <nav className="cerateNewStock-subtit">Line Items<sup>*</sup></nav>
// //         <div className="cerateNewStock-table-container">
// //           <table>
// //             <thead className="cerateNewStock-table-head">
// //               <tr>
// //                 <th>#</th>
// //                 <th><pre>Product Name</pre></th>
// //                 <th><pre>Product ID</pre></th>
// //                 <th>UOM</th>
// //                 <th><pre>Qty Ordered</pre></th>
// //                 <th><pre>Qty Received</pre></th>
// //                 <th><pre>Accepted Qty</pre></th>
// //                 <th><pre>Rejected Qty</pre></th>
// //                 <th><pre>Qty Returned</pre></th>
// //                 <th><pre>Stock Dim.</pre></th>
// //                 <th>Warehouse</th>
// //                 <th><pre>Unit Price</pre></th>
// //                 <th><pre>Tax (%)</pre></th>
// //                 <th><pre>Discount (%)</pre></th>
// //                 <th>Total</th>
// //                 <th>Action</th>
// //               </tr>
// //             </thead>
// //             <tbody className="cerateNewStock-table-body">
// //               {lineItems.length === 0 ? (
// //                 <tr>
// //                   <td colSpan={16} style={{ textAlign: "center", color: "#999", padding: "20px" }}>
// //                     {stockInput.po_reference_id
// //                       ? "Loading items from PO…"
// //                       : "Select a PO Reference to load items"}
// //                   </td>
// //                 </tr>
// //               ) : (
// //                 lineItems.map((row, idx) => (
// //                   <StockListItem
// //                     key={row.id}
// //                     index={idx + 1}
// //                     rowData={row}
// //                     BtnAccess={stockBtn.BtnAccess}
// //                     onFieldChange={handleLineItemChange}
// //                     onOpenDim={(dimType) => {
// //                       setStockDim({
// //                         serialBox:     dimType === "Serial",
// //                         batchBox:      dimType === "Batch",
// //                         activeRow:     row.id,
// //                         activeProduct: {
// //                           product_name: row.product_name,
// //                           product_id:   row.product_display_id || row.product_id,
// //                           uom:          row.uom,
// //                           qty_received: row.qty_received,
// //                           accepted_qty: row.accepted_qty,
// //                         },
// //                         activeItemId: row.backend_item_id,
// //                       });
// //                     }}
// //                   />
// //                 ))
// //               )}
// //             </tbody>
// //           </table>
// //         </div>

// //         {/* ── COMMENTS / HISTORY / ATTACHMENTS ────────────────────────────── */}
// //         <div className="cerateNewStock-hub-container">
// //           <div className="cerateNewStock-hub-head">
// //             {["comments", "history", "attachments"].map((tab) => (
// //               <p
// //                 key={tab}
// //                 className={activeTab === tab
// //                   ? "cerateNewStock-hub-head-bg-black"
// //                   : "cerateNewStock-hub-head-tit"}
// //                 onClick={() => setActiveTab(tab)}
// //                 style={{ textTransform: "capitalize" }}
// //               >
// //                 {tab}
// //               </p>
// //             ))}
// //           </div>

// //           <div className="cerateNewStock-hub-body">

// //             {/* Comments */}
// //             {activeTab === "comments" && (
// //               <div className="cerateNewStock-comment-container">
// //                 <p>Add Comment:</p>
// //                 <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
// //                   <input
// //                     type="text"
// //                     value={newComment}
// //                     onChange={(e) => setNewComment(e.target.value)}
// //                     placeholder="Enter your comment…"
// //                     style={{ flex: 1, padding: "8px 12px", borderRadius: "6px", border: "1px solid #ddd" }}
// //                   />
// //                   <button
// //                     onClick={handleAddComment}
// //                     className="cerateNewStock-active-btn"
// //                     style={{ padding: "8px 16px" }}
// //                   >
// //                     + Add
// //                   </button>
// //                 </div>
// //                 <div className="cerateNewStock-comment-brline" />
// //                 <div className="cerateNewStock-showarea">
// //                   {comments.length === 0 ? (
// //                     <p style={{ color: "#888", fontSize: "13px", padding: "8px" }}>No comments yet.</p>
// //                   ) : comments.map((c, i) => (
// //                     <div key={i} className="cerateNewStock-message-container">
// //                       <svg className="cerateNewStock-comment-profile-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
// //                         <rect width="24" height="24" rx="12" fill="#E0E4E7" />
// //                         <path d="M7 17.33V16.6219C7 15.3072 7.52224 14.0464 8.45184 13.1168C9.38143 12.1872 10.6422 11.665 11.9569 11.665M11.9569 11.665C13.2715 11.665 14.5323 12.1872 15.4619 13.1168C16.3915 14.0464 16.9138 15.3072 16.9138 16.6219V17.33M11.9569 11.665C12.7081 11.665 13.4286 11.3666 13.9598 10.8354C14.491 10.3042 14.7894 9.58373 14.7894 8.8325C14.7894 8.08127 14.491 7.36082 13.9598 6.82962C13.4286 6.29842 12.7081 6 11.9569 6C11.2057 6 10.4852 6.29842 9.954 6.82962C9.4228 7.36082 9.12438 8.08127 9.12438 8.8325C9.12438 9.58373 9.4228 10.3042 9.954 10.8354C10.4852 11.3666 11.2057 11.665 11.9569 11.665Z"
// //                           stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
// //                       </svg>
// //                       <div className="cerateNewStock-message-box">
// //                         <p>{c.created_by || c.comment_by} · {new Date(c.timestamp).toLocaleString()}</p>
// //                         <nav>{c.comment}</nav>
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //             )}

// //             {/* History */}
// //             {activeTab === "history" && (
// //               <div className="cerateNewStock-history-container">
// //                 {history.length === 0 ? (
// //                   <p style={{ color: "#888", fontSize: "13px", padding: "12px" }}>No history yet.</p>
// //                 ) : history.map((h, i) => (
// //                   <div key={i} style={{
// //                     padding: "10px 12px", background: "#f9f9f9",
// //                     borderRadius: "6px", marginBottom: "6px",
// //                   }}>
// //                     <p style={{ fontSize: "13px", margin: 0 }}>
// //                       <strong>{h.event_type}</strong>
// //                       {h.details ? ` — ${h.details}` : ""}
// //                     </p>
// //                     <p style={{ fontSize: "11px", color: "#888", margin: "4px 0 0" }}>
// //                       {h.action_by} · {new Date(h.timestamp).toLocaleString()}
// //                     </p>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}

// //             {/* Attachments */}
// //             {activeTab === "attachments" && (
// //               <div className="cerateNewStock-attachment-container">
// //                 <input type="file" ref={fileInputRef} hidden onChange={handleAttachmentUpload} />
// //                 <div className="cerateNewStock-upload-container">
// //                   <div
// //                     className="cerateNewStock-upload-btn"
// //                     onClick={() => !stockBtn.BtnAccess && fileInputRef.current.click()}
// //                     style={{ cursor: stockBtn.BtnAccess ? "not-allowed" : "pointer", opacity: stockBtn.BtnAccess ? 0.5 : 1 }}
// //                   >
// //                     <nav>Upload Files</nav>
// //                   </div>
// //                 </div>
// //                 {attachments.length === 0 ? (
// //                   <p style={{ color: "#888", fontSize: "13px", marginTop: "8px" }}>No attachments yet.</p>
// //                 ) : attachments.map((att, i) => (
// //                   <div key={i} className="cerateNewStock-file-item">
// //                     <nav>{att.description || att.file?.split("/").pop()}</nav>
// //                     <div className="cerateNewStock-file-actions">
// //                       <a href={att.file} target="_blank" rel="noreferrer" download>Download</a>
// //                       <span style={{ fontSize: "11px", color: "#888" }}>
// //                         {att.uploaded_by} · {new Date(att.uploaded_at).toLocaleDateString()}
// //                       </span>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </div>
// //         </div>

// //         {/* ── ACTION BUTTONS ────────────────────────────────────────────────── */}
// //         <div className="cerateNewStock-btn-container">
// //           <button
// //             type="button"
// //             onClick={handleCancelledState}
// //             className={["Submitted"].includes(stockReceiptStatus)
// //               ? "cerateNewStock-order-active-btn"
// //               : "cerateNewStock-inactive-btn"}
// //             disabled={stockBtn.cancal_grn || isLoading}
// //           >
// //             {stockReceiptStatus === "Cancelled" ? "Cancelled GRN" : "Cancel GRN"}
// //           </button>

// //           <nav>
// //             <button type="button" className="cerateNewStock-cancel-btn"
// //               onClick={(e) => { e.preventDefault(); prevpg(-1); }}>
// //               Cancel
// //             </button>

// //             <button
// //               type="button"
// //               onClick={handleDraftState}
// //               className={["", "Draft"].includes(stockReceiptStatus)
// //                 ? "cerateNewStock-active-btn"
// //                 : "cerateNewStock-completed-btn"}
// //               disabled={stockBtn.draft || isLoading}
// //             >
// //               {isLoading ? "Saving…" : "Save Draft"}
// //             </button>

// //             <button
// //               type="button"
// //               onClick={handleSubmittedState}
// //               className={["", "Draft"].includes(stockReceiptStatus)
// //                 ? "cerateNewStock-active-btn"
// //                 : "cerateNewStock-completed-btn"}
// //               disabled={stockBtn.submit || isLoading}
// //             >
// //               {stockReceiptStatus === "Submitted" ? "Submitted" : isLoading ? "Submitting…" : "Submit"}
// //             </button>

// //             <svg
// //               className={!stockBtn.pdf ? "cerateNewStock-pdf-mail-activelogo" : "cerateNewStock-pdf-mail-futurelogo"}
// //               style={{ cursor: !stockBtn.pdf ? "pointer" : "not-allowed", opacity: stockBtn.pdf ? 0.4 : 1 }}
// //               onClick={!stockBtn.pdf ? handlePdf : undefined}
// //               xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 24" fill="none"
// //             >
// //               <path fillRule="evenodd" clipRule="evenodd" d="M0.600098 2.4C0.600098 1.76348 0.852954 1.15303 1.30304 0.702944C1.75313 0.252856 2.36358 0 3.0001 0L16.1313 0L21.4001 5.2688V21.6C21.4001 22.2365 21.1472 22.847 20.6972 23.2971C20.2471 23.7471 19.6366 24 19.0001 24H3.0001C2.36358 24 1.75313 23.7471 1.30304 23.2971C0.852954 22.847 0.600098 22.2365 0.600098 21.6V2.4ZM4.6001 9.6H2.2001V17.6H3.8001V14.4H4.6001C5.23662 14.4 5.84707 14.1471 6.29715 13.6971C6.74724 13.247 7.0001 12.6365 7.0001 12C7.0001 11.3635 6.74724 10.753 6.29715 10.3029C5.84707 9.85286 5.23662 9.6 4.6001 9.6ZM11.0001 9.6H8.6001V17.6H11.0001C11.6366 17.6 12.2471 17.3471 12.6972 16.8971C13.1472 16.447 13.4001 15.8365 13.4001 15.2V12C13.4001 11.3635 13.1472 10.753 12.6972 10.3029C12.2471 9.85286 11.6366 9.6 11.0001 9.6ZM15.0001 17.6V9.6H19.8001V11.2H16.6001V12.8H18.2001V14.4H16.6001V17.6H15.0001Z" />
// //             </svg>

// //             <svg
// //               className={!stockBtn.mail ? "cerateNewStock-pdf-mail-activelogo" : "cerateNewStock-pdf-mail-futurelogo"}
// //               style={{ cursor: !stockBtn.mail ? "pointer" : "not-allowed", opacity: stockBtn.mail ? 0.4 : 1 }}
// //               onClick={!stockBtn.mail ? handleEmail : undefined}
// //               xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 16" fill="none"
// //             >
// //               <path d="M2 16C1.45 16 0.979333 15.8043 0.588 15.413C0.196667 15.0217 0.000666667 14.5507 0 14V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196666 1.45067 0.000666667 2 0H18C18.55 0 19.021 0.196 19.413 0.588C19.805 0.98 20.0007 1.45067 20 2V14C20 14.55 19.8043 15.021 19.413 15.413C19.0217 15.805 18.5507 16.0007 18 16H2ZM10 8.825C10.0833 8.825 10.171 8.81233 10.263 8.787C10.355 8.76167 10.4423 8.72433 10.525 8.675L17.6 4.25C17.7333 4.16667 17.8333 4.06267 17.9 3.938C17.9667 3.81833 18 3.67567 18 3.525C18 3.19167 17.8583 2.94167 17.575 2.775C17.2917 2.60833 17 2.61667 16.7 2.8L10 7L3.3 2.8C3 2.61667 2.70833 2.61267 2.425 2.788C2.14167 2.96333 2 3.209 2 3.525C2 3.69167 2.03333 3.83767 2.1 3.963C2.16667 4.08833 2.26667 4.184 2.4 4.25L9.475 8.675C9.55833 8.725 9.646 8.76267 9.738 8.788C9.83 8.81333 9.91733 8.82567 10 8.825Z" />
// //             </svg>
// //           </nav>
// //         </div>

// //       </div>
// //     </>
// //   );
// // }
// import React, { useEffect, useRef, useState } from "react";
// import "./createNewStockReceipt.css";
// import { useNavigate } from "react-router-dom";
// import StockListItem from "./stockListItem";
// import StockSerialNumber from "./stock-serial-num/stockSerialNumber";
// import StockBatchNumber from "./stock-batch-num/stockBatchNumber";
// import { toast } from "react-toastify";
// import stockReceiptApiProvider from "../../../network/stockReceipt-api-provider";
// import purchaseOrderApiProvider from "../../../network/purchaseOrder-api-provider";

// function mapGRNToState(grn) {
//   if (!grn || !Object.keys(grn).length) return null;
//   return {
//     form: {
//       grn_id:               grn.GRN_ID             || "",
//       po_reference_id:      grn.po_reference_id    || "",
//       po_reference_display: grn.po_reference       || "",
//       received_date:        grn.received_date       || "",
//       supplier_name:        grn.supplier?.supplier_name || "",
//       supplier_dn_no:       grn.supplier_dn_no      || "",
//       supplier_invoice_no:  grn.supplier_invoice_no || "",
//       received_by:          grn.received_by         || "",
//       qc_done_by:           grn.qc_done_by          || "",
//     },
//     lineItems: (grn.items || []).map((item, idx) => ({
//       id:                 idx,
//       backend_item_id:    item.id,
//       product_id:         String(item.product),
//       product_display_id: item.product_id    || "",
//       product_name:       item.product_name  || "",
//       uom:                item.uom           || "",
//       qty_ordered:        item.qty_ordered   || 0,
//       qty_received:       item.qty_received  || 0,
//       accepted_qty:       item.accepted_qty  || 0,
//       rejected_qty:       item.rejected_qty  || 0,
//       qty_returned:       item.qty_returned  || 0,
//       stock_dim:          item.stock_dim     || "None",
//       selected_warehouse: item.warehouse     || "",
//       unit_price:         item.unit_price    || 0,
//       tax_rate:           item.tax_rate      || 0,
//       discount_rate:      item.discount_rate || 0,
//       serials:            (item.serial_numbers || []).map((s) => s.serial_no),
//       batches:            item.batch_numbers  || [],
//     })),
//     comments:    grn.comments    || [],
//     history:     grn.history     || [],
//     attachments: grn.attachments || [],
//     status:      grn.status      || "",
//     dbId:        grn.id          || null,
//   };
// }

// export default function CreateNewStockReceipt({
//   setCurrentPage,
//   editGRNData = {},
//   isEdit = false,
// }) {
//   const isEditMode = isEdit && Object.keys(editGRNData).length > 0;
//   const prevpg     = useNavigate();

//   const [pageLoading, setPageLoading] = useState(isEditMode);
//   const [isLoading,   setIsLoading]   = useState(false);

//   const [stockReceiptStatus, setStockReceiptStatus] = useState("");
//   const [createdGrnId,       setCreatedGrnId]       = useState(
//     isEditMode ? editGRNData.id || null : null
//   );

//   const [poList,      setPoList]      = useState([]);
//   const [lineItems,   setLineItems]   = useState([]);
//   const [comments,    setComments]    = useState([]);
//   const [history,     setHistory]     = useState([]);
//   const [attachments, setAttachments] = useState([]);
//   const [newComment,  setNewComment]  = useState("");

//   const [stockInput, setStockInput] = useState({
//     grn_id:               "",
//     po_reference_id:      "",
//     po_reference_display: "",
//     received_date:        "",
//     supplier_name:        "",
//     supplier_dn_no:       "",
//     supplier_invoice_no:  "",
//     received_by:          "",
//     qc_done_by:           "",
//   });

//   const [activeTab, setActiveTab] = useState("comments");
//   const fileInputRef = useRef(null);

//   const [stockBtn, setStockBtn] = useState({
//     BtnAccess:    false,
//     cancal_grn:   true,
//     draft:        false,
//     submit:       false,
//     pdf:          true,
//     mail:         true,
//     stock_return: true,
//   });

//   const [stockDim, setStockDim] = useState({
//     serialBox:     false,
//     batchBox:      false,
//     activeRow:     null,
//     activeProduct: null,
//     activeItemId:  null,
//   });

//   function applyGRNToState(grn) {
//     const mapped = mapGRNToState(grn);
//     if (!mapped) return;
//     setStockInput(mapped.form);
//     setLineItems(mapped.lineItems);
//     setComments(mapped.comments);
//     setHistory(mapped.history);
//     setAttachments(mapped.attachments);
//     setStockReceiptStatus(mapped.status);
//     setCreatedGrnId(mapped.dbId);
//   }

//   useEffect(() => {
//     async function init() {
//       try {
//         const res    = await purchaseOrderApiProvider.fetchPurchaseOrders(1, "");
//         const allPos = Array.isArray(res?.data?.data) ? res.data.data
//                      : Array.isArray(res?.data)       ? res.data
//                      : Array.isArray(res)             ? res : [];
//         setPoList(allPos);
//       } catch (err) {
//         console.error("Failed to load PO list:", err);
//       }

//       if (isEditMode) {
//         const id     = editGRNData.id;
//         const detail = id
//           ? await stockReceiptApiProvider.fetchSingleStockReceipt(id)
//           : null;
//         applyGRNToState(detail || editGRNData);
//       }

//       setPageLoading(false);
//     }
//     init();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     if (!stockInput.po_reference_id || isEditMode) return;
//     async function loadPO() {
//       try {
//         const res = await purchaseOrderApiProvider.fetchSinglePurchaseOrder(
//           stockInput.po_reference_id
//         );
//         const po = res?.data || res;
//         if (!po) return;
//         setStockInput((prev) => ({
//           ...prev,
//           supplier_name: po.supplier?.supplier_name || po.supplier_name || "",
//         }));
//         const rows = (po.items || []).map((item, idx) => ({
//           id:                 idx,
//           backend_item_id:    null,
//           product_id:         String(item.product),
//           product_display_id: item.product_id          || item.product_id_display || "",
//           product_name:       item.product_name        || "",
//           uom:                item.uom                 || "",
//           qty_ordered:        item.qty_ordered         || item.quantity || 0,
//           qty_received:       item.qty_ordered         || item.quantity || 0,
//           accepted_qty:       item.qty_ordered         || item.quantity || 0,
//           rejected_qty:       0,
//           qty_returned:       0,
//           stock_dim:          "None",
//           selected_warehouse: "",
//           unit_price:         item.unit_price          || 0,
//           tax_rate:           item.tax_rate            || 0,
//           discount_rate:      item.discount_rate       || 0,
//           serials:            [],
//           batches:            [],
//         }));
//         setLineItems(rows);
//       } catch (err) {
//         console.error("Failed to fetch PO details:", err);
//       }
//     }
//     loadPO();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [stockInput.po_reference_id]);

//   useEffect(() => {
//     switch (stockReceiptStatus) {
//       case "":
//         setStockBtn({ BtnAccess: false, cancal_grn: true,  draft: false, submit: false, pdf: true,  mail: true,  stock_return: true });
//         break;
//       case "Draft":
//         setStockBtn({ BtnAccess: false, cancal_grn: true,  draft: false, submit: false, pdf: false, mail: false, stock_return: true });
//         break;
//       case "Submitted":
//         setStockBtn({ BtnAccess: true,  cancal_grn: false, draft: true,  submit: true,  pdf: false, mail: false, stock_return: false });
//         break;
//       case "Cancelled":
//       case "Returned":
//         setStockBtn({ BtnAccess: true,  cancal_grn: true,  draft: true,  submit: true,  pdf: false, mail: false, stock_return: true });
//         break;
//       default:
//         break;
//     }
//   }, [stockReceiptStatus]);

//   const handleStockInputChange = (e) => {
//     setStockInput((prev) => ({ ...prev, [e.target.id]: e.target.value }));
//   };

//   const handleLineItemChange = (rowId, field, value) => {
//     setLineItems((prev) =>
//       prev.map((row) => {
//         if (row.id !== rowId) return row;
//         const updated = { ...row, [field]: value };
//         if (field === "qty_received" || field === "accepted_qty") {
//           const received = parseInt(field === "qty_received" ? value : updated.qty_received) || 0;
//           const accepted = parseInt(field === "accepted_qty"  ? value : updated.accepted_qty) || 0;
//           updated.rejected_qty = Math.max(0, received - accepted);
//         }
//         return updated;
//       })
//     );
//   };

//   const handleSerialApply = (serials) => {
//     setLineItems((prev) =>
//       prev.map((row) => row.id === stockDim.activeRow ? { ...row, serials } : row)
//     );
//     setStockDim({ serialBox: false, batchBox: false, activeRow: null, activeProduct: null, activeItemId: null });
//   };

//   const handleBatchApply = (batches) => {
//     setLineItems((prev) =>
//       prev.map((row) => row.id === stockDim.activeRow ? { ...row, batches } : row)
//     );
//     setStockDim({ serialBox: false, batchBox: false, activeRow: null, activeProduct: null, activeItemId: null });
//   };

//   function buildPayload() {
//     return {
//       po_reference:        parseInt(stockInput.po_reference_id) || undefined,
//       received_date:       stockInput.received_date              || null,
//       supplier_dn_no:      stockInput.supplier_dn_no,
//       supplier_invoice_no: stockInput.supplier_invoice_no,
//       received_by:         stockInput.received_by,
//       qc_done_by:          stockInput.qc_done_by,
//       status:              "Draft",
//       items: lineItems.map((row) => ({
//         ...(row.backend_item_id ? { id: row.backend_item_id } : {}),
//         product:       parseInt(row.product_id),
//         uom:           row.uom,
//         qty_ordered:   parseFloat(row.qty_ordered)   || 0,
//         qty_received:  parseFloat(row.qty_received)  || 0,
//         accepted_qty:  parseFloat(row.accepted_qty)  || 0,
//         rejected_qty:  parseFloat(row.rejected_qty)  || 0,
//         qty_returned:  parseFloat(row.qty_returned)  || 0,
//         stock_dim:     row.stock_dim                 || "None",
//         warehouse:     row.selected_warehouse        || "",
//         unit_price:    parseFloat(row.unit_price)    || 0,
//         tax_rate:      parseFloat(row.tax_rate)      || 0,
//         discount_rate: parseFloat(row.discount_rate) || 0,
//       })),
//     };
//   }

//   const handleDraftState = async (e) => {
//     e.preventDefault();
//     if (!stockInput.po_reference_id) { toast.error("Please select a PO Reference"); return; }
//     if (!stockInput.received_date)   { toast.error("Please select a Received Date"); return; }
//     if (lineItems.length === 0)      { toast.error("No line items found");           return; }

//     setIsLoading(true);
//     try {
//       const payload  = buildPayload();
//       let grnId      = createdGrnId;
//       let savedItems = [];

//       if (!grnId) {
//         const result = await stockReceiptApiProvider.createStockReceipt(payload);
//         if (!result) return;
//         const data = result?.data || result;
//         grnId      = data?.id;
//         savedItems = data?.items || [];
//         setCreatedGrnId(grnId);
//         if (data?.GRN_ID) setStockInput((prev) => ({ ...prev, grn_id: data.GRN_ID }));
//         if (savedItems.length > 0) {
//           setLineItems((prev) =>
//             prev.map((row, idx) => ({
//               ...row,
//               backend_item_id: savedItems[idx]?.id || row.backend_item_id,
//             }))
//           );
//         }
//       } else {
//         const result = await stockReceiptApiProvider.updateStockReceipt(grnId, payload);
//         if (!result) return;
//         savedItems = (result?.data || result)?.items || [];
//       }

//       setStockReceiptStatus("Draft");

//       for (let i = 0; i < lineItems.length; i++) {
//         const row    = lineItems[i];
//         const itemId = savedItems[i]?.id || row.backend_item_id;
//         if (row.stock_dim === "Serial" && row.serials?.length > 0 && itemId) {
//           await stockReceiptApiProvider.addSerialNumbers(grnId, itemId, row.serials);
//         }
//       }

//       for (let i = 0; i < lineItems.length; i++) {
//         const row    = lineItems[i];
//         const itemId = savedItems[i]?.id || row.backend_item_id;
//         if (row.stock_dim === "Batch" && row.batches?.length > 0 && itemId) {
//           await stockReceiptApiProvider.addBatchNumbers(grnId, itemId, row.batches);
//         }
//       }

//     } catch (err) {
//       console.error("handleDraftState error:", err);
//       toast.error("Failed to save draft");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSubmittedState = async (e) => {
//     e.preventDefault();
//     if (!createdGrnId) { toast.error("Please save as Draft first"); return; }
//     setIsLoading(true);
//     try {
//       const result = await stockReceiptApiProvider.performAction(createdGrnId, "submit");
//       if (result) {
//         setStockReceiptStatus("Submitted");
//         const fresh = await stockReceiptApiProvider.fetchSingleStockReceipt(createdGrnId);
//         if (fresh) {
//           setHistory(fresh.history       || []);
//           setComments(fresh.comments     || []);
//           setAttachments(fresh.attachments || []);
//         }
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCancelledState = async (e) => {
//     e.preventDefault();
//     if (!createdGrnId) return;
//     if (!window.confirm("Are you sure you want to cancel this GRN?")) return;
//     setIsLoading(true);
//     try {
//       const result = await stockReceiptApiProvider.performAction(createdGrnId, "cancel");
//       if (result) setStockReceiptStatus("Cancelled");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleStockReturn = async (e) => {
//     e.preventDefault();
//     if (!createdGrnId) return;
//     if (!window.confirm("Are you sure you want to generate a stock return for this GRN?")) return;
//     setIsLoading(true);
//     try {
//       const result = await stockReceiptApiProvider.generateReturn(createdGrnId);
//       if (result) {
//         setStockReceiptStatus("Returned");
//         const fresh = await stockReceiptApiProvider.fetchSingleStockReceipt(createdGrnId);
//         if (fresh) {
//           setHistory(fresh.history       || []);
//           setComments(fresh.comments     || []);
//           setAttachments(fresh.attachments || []);
//         }
//       }
//     } catch (err) {
//       console.error("handleStockReturn error:", err);
//       toast.error("Failed to generate stock return");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAddComment = async (e) => {
//     e.preventDefault();
//     if (!newComment.trim()) return;
//     if (!createdGrnId) { toast.error("Save the GRN first"); return; }
//     const res = await stockReceiptApiProvider.addComment(createdGrnId, newComment.trim());
//     if (res) {
//       setComments((prev) => [...prev, res?.data || res]);
//       setNewComment("");
//     }
//   };

//   const handleAttachmentUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file || !createdGrnId) return;
//     const res = await stockReceiptApiProvider.uploadAttachment(createdGrnId, file);
//     if (res) setAttachments((prev) => [...prev, res?.data || res]);
//     e.target.value = "";
//   };

//   const handlePdf = async (e) => {
//     e.preventDefault();
//     if (!createdGrnId) return;
//     await stockReceiptApiProvider.downloadPDF(createdGrnId, stockInput.grn_id);
//   };

//   const handleEmail = async (e) => {
//     e.preventDefault();
//     if (!createdGrnId) return;
//     await stockReceiptApiProvider.sendEmail(createdGrnId);
//   };

//   const statusClass = {
//     Draft:     "cerateNewStock-Status-draft",
//     Submitted: "cerateNewStock-Status-Submitted",
//     Cancelled: "cerateNewStock-Status-Cancelled",
//     Returned:  "cerateNewStock-Status-Returned",
//   }[stockReceiptStatus] || "";

//   const isModalOpen = stockDim.serialBox || stockDim.batchBox;

//   if (pageLoading) {
//     return (
//       <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
//         <p style={{ fontSize: "15px", color: "#888" }}>Loading stock receipt…</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* ── SERIAL NUMBER MODAL — rendered at fragment root, no wrapper div ── */}
//       {stockDim.serialBox && (
//         <StockSerialNumber
//           setStockDim={setStockDim}
//           activeProduct={stockDim.activeProduct}
//           stockReceiptId={createdGrnId}
//           itemId={stockDim.activeItemId}
//           onApply={handleSerialApply}
//           existingSerials={lineItems.find((r) => r.id === stockDim.activeRow)?.serials || []}
//         />
//       )}

//       {/* ── BATCH NUMBER MODAL — rendered at fragment root, no wrapper div ── */}
//       {stockDim.batchBox && (
//         <StockBatchNumber
//           setStockDim={setStockDim}
//           activeProduct={stockDim.activeProduct}
//           stockReceiptId={createdGrnId}
//           itemId={stockDim.activeItemId}
//           onApply={handleBatchApply}
//         />
//       )}

//       <div className={`cerateNewStock-container ${isModalOpen ? "cerateNewStock-blur" : ""}`}>

//         {/* ── HEAD ── */}
//         <div className="cerateNewStock-head">
//           <nav>
//             <p>
//               {isEditMode
//                 ? stockReceiptStatus === "Draft" ? "Edit Stock Receipt" : "View Stock Receipt"
//                 : "New Stock Receipt"}
//             </p>
//             {stockReceiptStatus && (
//               <h3 className={statusClass}>Status: {stockReceiptStatus}</h3>
//             )}
//           </nav>
//           <div>
//             <button
//               type="button"
//               onClick={handleStockReturn}
//               className={stockReceiptStatus === "Submitted" ? "cerateNewStock-order-active-btn" : "cerateNewStock-inactive-btn"}
//               disabled={stockBtn.stock_return || isLoading}
//             >
//               {isLoading && !stockBtn.stock_return ? "Processing…" : "Stock Return"}
//             </button>
//             <nav className="cerateNewStock-close" onClick={(e) => { e.preventDefault(); prevpg(-1); }}>
//               <svg className="cerateNewStock-circle-x-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
//                 <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
//               </svg>
//               <p>Close</p>
//             </nav>
//           </div>
//         </div>

//         {/* ── GRN DETAILS ── */}
//         <div className="cerateNewStock-input-container">
//           <div className="cerateNewStock-input-box">
//             <label>GRN ID (Auto Generate)</label>
//             <input type="text" value={stockInput.grn_id} placeholder="Auto Generate" disabled />
//           </div>
//           <div className="cerateNewStock-input-box">
//             <label htmlFor="po_reference_id">PO Reference ID<sup>*</sup></label>
//             {isEditMode ? (
//               <input type="text" value={stockInput.po_reference_display || stockInput.po_reference_id} disabled />
//             ) : (
//               <select
//                 id="po_reference_id"
//                 value={stockInput.po_reference_id}
//                 onChange={handleStockInputChange}
//                 disabled={stockBtn.BtnAccess}
//               >
//                 <option value="">Select PO Reference</option>
//                 {poList.map((po) => (
//                   <option key={po.id} value={po.id}>
//                     {po.PO_ID || po.po_id || `PO-${po.id}`}
//                   </option>
//                 ))}
//               </select>
//             )}
//           </div>
//         </div>

//         <div className="cerateNewStock-input-container">
//           <div className="cerateNewStock-input-box">
//             <label htmlFor="received_date">Received Date<sup>*</sup></label>
//             <input id="received_date" type="date" value={stockInput.received_date} onChange={handleStockInputChange} disabled={stockBtn.BtnAccess} />
//           </div>
//           <div className="cerateNewStock-input-box">
//             <label htmlFor="supplier_name">Supplier Name</label>
//             <input id="supplier_name" type="text" value={stockInput.supplier_name} onChange={handleStockInputChange} placeholder="Auto-filled from PO" disabled={stockBtn.BtnAccess} />
//           </div>
//         </div>

//         <div className="cerateNewStock-input-container">
//           <div className="cerateNewStock-input-box">
//             <label htmlFor="supplier_dn_no">Supplier DN No.</label>
//             <input id="supplier_dn_no" type="text" value={stockInput.supplier_dn_no} onChange={handleStockInputChange} placeholder="Enter Supplier DN No." disabled={stockBtn.BtnAccess} />
//           </div>
//           <div className="cerateNewStock-input-box">
//             <label htmlFor="supplier_invoice_no">Supplier Invoice No.</label>
//             <input id="supplier_invoice_no" type="text" value={stockInput.supplier_invoice_no} onChange={handleStockInputChange} placeholder="Enter Supplier Invoice No." disabled={stockBtn.BtnAccess} />
//           </div>
//         </div>

//         <div className="cerateNewStock-input-container">
//           <div className="cerateNewStock-input-box">
//             <label htmlFor="received_by">Received By</label>
//             <input id="received_by" type="text" value={stockInput.received_by} onChange={handleStockInputChange} placeholder="Enter name or user ID" disabled={stockBtn.BtnAccess} />
//           </div>
//           <div className="cerateNewStock-input-box">
//             <label htmlFor="qc_done_by">QC Done By</label>
//             <input id="qc_done_by" type="text" value={stockInput.qc_done_by} onChange={handleStockInputChange} placeholder="Enter name or user ID" disabled={stockBtn.BtnAccess} />
//           </div>
//         </div>

//         {/* ── LINE ITEMS ── */}
//         <nav className="cerateNewStock-subtit">Line Items<sup>*</sup></nav>
//         <div className="cerateNewStock-table-container">
//           <table>
//             <thead className="cerateNewStock-table-head">
//               <tr>
//                 <th>#</th>
//                 <th><pre>Product Name</pre></th>
//                 <th><pre>Product ID</pre></th>
//                 <th>UOM</th>
//                 <th><pre>Qty Ordered</pre></th>
//                 <th><pre>Qty Received</pre></th>
//                 <th><pre>Accepted Qty</pre></th>
//                 <th><pre>Rejected Qty</pre></th>
//                 <th><pre>Qty Returned</pre></th>
//                 <th><pre>Stock Dim.</pre></th>
//                 <th>Warehouse</th>
//                 <th><pre>Unit Price</pre></th>
//                 <th><pre>Tax (%)</pre></th>
//                 <th><pre>Discount (%)</pre></th>
//                 <th>Total</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody className="cerateNewStock-table-body">
//               {lineItems.length === 0 ? (
//                 <tr>
//                   <td colSpan={16} style={{ textAlign: "center", color: "#999", padding: "20px" }}>
//                     {stockInput.po_reference_id ? "Loading items from PO…" : "Select a PO Reference to load items"}
//                   </td>
//                 </tr>
//               ) : (
//                 lineItems.map((row, idx) => (
//                   <StockListItem
//                     key={row.id}
//                     index={idx + 1}
//                     rowData={row}
//                     BtnAccess={stockBtn.BtnAccess}
//                     onFieldChange={handleLineItemChange}
//                     onOpenDim={(dimType) => {
//                       setStockDim({
//                         serialBox:     dimType === "Serial",
//                         batchBox:      dimType === "Batch",
//                         activeRow:     row.id,
//                         activeProduct: {
//                           product_name: row.product_name,
//                           product_id:   row.product_display_id || row.product_id,
//                           uom:          row.uom,
//                           qty_received: row.qty_received,
//                           accepted_qty: row.accepted_qty,
//                         },
//                         activeItemId: row.backend_item_id,
//                       });
//                     }}
//                   />
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* ── COMMENTS / HISTORY / ATTACHMENTS ── */}
//         <div className="cerateNewStock-hub-container">
//           <div className="cerateNewStock-hub-head">
//             {["comments", "history", "attachments"].map((tab) => (
//               <p
//                 key={tab}
//                 className={activeTab === tab ? "cerateNewStock-hub-head-bg-black" : "cerateNewStock-hub-head-tit"}
//                 onClick={() => setActiveTab(tab)}
//                 style={{ textTransform: "capitalize" }}
//               >
//                 {tab}
//               </p>
//             ))}
//           </div>

//           <div className="cerateNewStock-hub-body">
//             {activeTab === "comments" && (
//               <div className="cerateNewStock-comment-container">
//                 <p>Add Comment:</p>
//                 <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
//                   <input
//                     type="text"
//                     value={newComment}
//                     onChange={(e) => setNewComment(e.target.value)}
//                     placeholder="Enter your comment…"
//                     style={{ flex: 1, padding: "8px 12px", borderRadius: "6px", border: "1px solid #ddd" }}
//                   />
//                   <button onClick={handleAddComment} className="cerateNewStock-active-btn" style={{ padding: "8px 16px" }}>
//                     + Add
//                   </button>
//                 </div>
//                 <div className="cerateNewStock-comment-brline" />
//                 <div className="cerateNewStock-showarea">
//                   {comments.length === 0 ? (
//                     <p style={{ color: "#888", fontSize: "13px", padding: "8px" }}>No comments yet.</p>
//                   ) : comments.map((c, i) => (
//                     <div key={i} className="cerateNewStock-message-container">
//                       <svg className="cerateNewStock-comment-profile-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
//                         <rect width="24" height="24" rx="12" fill="#E0E4E7" />
//                         <path d="M7 17.33V16.6219C7 15.3072 7.52224 14.0464 8.45184 13.1168C9.38143 12.1872 10.6422 11.665 11.9569 11.665M11.9569 11.665C13.2715 11.665 14.5323 12.1872 15.4619 13.1168C16.3915 14.0464 16.9138 15.3072 16.9138 16.6219V17.33M11.9569 11.665C12.7081 11.665 13.4286 11.3666 13.9598 10.8354C14.491 10.3042 14.7894 9.58373 14.7894 8.8325C14.7894 8.08127 14.491 7.36082 13.9598 6.82962C13.4286 6.29842 12.7081 6 11.9569 6C11.2057 6 10.4852 6.29842 9.954 6.82962C9.4228 7.36082 9.12438 8.08127 9.12438 8.8325C9.12438 9.58373 9.4228 10.3042 9.954 10.8354C10.4852 11.3666 11.2057 11.665 11.9569 11.665Z" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                       </svg>
//                       <div className="cerateNewStock-message-box">
//                         <p>{c.created_by || c.comment_by} · {new Date(c.timestamp).toLocaleString()}</p>
//                         <nav>{c.comment}</nav>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {activeTab === "history" && (
//               <div className="cerateNewStock-history-container">
//                 {history.length === 0 ? (
//                   <p style={{ color: "#888", fontSize: "13px", padding: "12px" }}>No history yet.</p>
//                 ) : history.map((h, i) => (
//                   <div key={i} style={{ padding: "10px 12px", background: "#f9f9f9", borderRadius: "6px", marginBottom: "6px" }}>
//                     <p style={{ fontSize: "13px", margin: 0 }}>
//                       <strong>{h.event_type}</strong>{h.details ? ` — ${h.details}` : ""}
//                     </p>
//                     <p style={{ fontSize: "11px", color: "#888", margin: "4px 0 0" }}>
//                       {h.action_by} · {new Date(h.timestamp).toLocaleString()}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {activeTab === "attachments" && (
//               <div className="cerateNewStock-attachment-container">
//                 <input type="file" ref={fileInputRef} hidden onChange={handleAttachmentUpload} />
//                 <div className="cerateNewStock-upload-container">
//                   <div
//                     className="cerateNewStock-upload-btn"
//                     onClick={() => !stockBtn.BtnAccess && fileInputRef.current.click()}
//                     style={{ cursor: stockBtn.BtnAccess ? "not-allowed" : "pointer", opacity: stockBtn.BtnAccess ? 0.5 : 1 }}
//                   >
//                     <nav>Upload Files</nav>
//                   </div>
//                 </div>
//                 {attachments.length === 0 ? (
//                   <p style={{ color: "#888", fontSize: "13px", marginTop: "8px" }}>No attachments yet.</p>
//                 ) : attachments.map((att, i) => (
//                   <div key={i} className="cerateNewStock-file-item">
//                     <nav>{att.description || att.file?.split("/").pop()}</nav>
//                     <div className="cerateNewStock-file-actions">
//                       <a href={att.file} target="_blank" rel="noreferrer" download>Download</a>
//                       <span style={{ fontSize: "11px", color: "#888" }}>
//                         {att.uploaded_by} · {new Date(att.uploaded_at).toLocaleDateString()}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ── ACTION BUTTONS ── */}
//         <div className="cerateNewStock-btn-container">
//           <button
//             type="button"
//             onClick={handleCancelledState}
//             className={["Submitted"].includes(stockReceiptStatus) ? "cerateNewStock-order-active-btn" : "cerateNewStock-inactive-btn"}
//             disabled={stockBtn.cancal_grn || isLoading}
//           >
//             {stockReceiptStatus === "Cancelled" ? "Cancelled GRN" : "Cancel GRN"}
//           </button>

//           <nav>
//             <button type="button" className="cerateNewStock-cancel-btn" onClick={(e) => { e.preventDefault(); prevpg(-1); }}>
//               Cancel
//             </button>

//             <button
//               type="button"
//               onClick={handleDraftState}
//               className={["", "Draft"].includes(stockReceiptStatus) ? "cerateNewStock-active-btn" : "cerateNewStock-completed-btn"}
//               disabled={stockBtn.draft || isLoading}
//             >
//               {isLoading ? "Saving…" : "Save Draft"}
//             </button>

//             <button
//               type="button"
//               onClick={handleSubmittedState}
//               className={["", "Draft"].includes(stockReceiptStatus) ? "cerateNewStock-active-btn" : "cerateNewStock-completed-btn"}
//               disabled={stockBtn.submit || isLoading}
//             >
//               {stockReceiptStatus === "Submitted" ? "Submitted" : isLoading ? "Submitting…" : "Submit"}
//             </button>

//             <svg
//               className={!stockBtn.pdf ? "cerateNewStock-pdf-mail-activelogo" : "cerateNewStock-pdf-mail-futurelogo"}
//               style={{ cursor: !stockBtn.pdf ? "pointer" : "not-allowed", opacity: stockBtn.pdf ? 0.4 : 1 }}
//               onClick={!stockBtn.pdf ? handlePdf : undefined}
//               xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 24" fill="none"
//             >
//               <path fillRule="evenodd" clipRule="evenodd" d="M0.600098 2.4C0.600098 1.76348 0.852954 1.15303 1.30304 0.702944C1.75313 0.252856 2.36358 0 3.0001 0L16.1313 0L21.4001 5.2688V21.6C21.4001 22.2365 21.1472 22.847 20.6972 23.2971C20.2471 23.7471 19.6366 24 19.0001 24H3.0001C2.36358 24 1.75313 23.7471 1.30304 23.2971C0.852954 22.847 0.600098 22.2365 0.600098 21.6V2.4ZM4.6001 9.6H2.2001V17.6H3.8001V14.4H4.6001C5.23662 14.4 5.84707 14.1471 6.29715 13.6971C6.74724 13.247 7.0001 12.6365 7.0001 12C7.0001 11.3635 6.74724 10.753 6.29715 10.3029C5.84707 9.85286 5.23662 9.6 4.6001 9.6ZM11.0001 9.6H8.6001V17.6H11.0001C11.6366 17.6 12.2471 17.3471 12.6972 16.8971C13.1472 16.447 13.4001 15.8365 13.4001 15.2V12C13.4001 11.3635 13.1472 10.753 12.6972 10.3029C12.2471 9.85286 11.6366 9.6 11.0001 9.6ZM15.0001 17.6V9.6H19.8001V11.2H16.6001V12.8H18.2001V14.4H16.6001V17.6H15.0001Z" />
//             </svg>

//             <svg
//               className={!stockBtn.mail ? "cerateNewStock-pdf-mail-activelogo" : "cerateNewStock-pdf-mail-futurelogo"}
//               style={{ cursor: !stockBtn.mail ? "pointer" : "not-allowed", opacity: stockBtn.mail ? 0.4 : 1 }}
//               onClick={!stockBtn.mail ? handleEmail : undefined}
//               xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 16" fill="none"
//             >
//               <path d="M2 16C1.45 16 0.979333 15.8043 0.588 15.413C0.196667 15.0217 0.000666667 14.5507 0 14V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196666 1.45067 0.000666667 2 0H18C18.55 0 19.021 0.196 19.413 0.588C19.805 0.98 20.0007 1.45067 20 2V14C20 14.55 19.8043 15.021 19.413 15.413C19.0217 15.805 18.5507 16.0007 18 16H2ZM10 8.825C10.0833 8.825 10.171 8.81233 10.263 8.787C10.355 8.76167 10.4423 8.72433 10.525 8.675L17.6 4.25C17.7333 4.16667 17.8333 4.06267 17.9 3.938C17.9667 3.81833 18 3.67567 18 3.525C18 3.19167 17.8583 2.94167 17.575 2.775C17.2917 2.60833 17 2.61667 16.7 2.8L10 7L3.3 2.8C3 2.61667 2.70833 2.61267 2.425 2.788C2.14167 2.96333 2 3.209 2 3.525C2 3.69167 2.03333 3.83767 2.1 3.963C2.16667 4.08833 2.26667 4.184 2.4 4.25L9.475 8.675C9.55833 8.725 9.646 8.76267 9.738 8.788C9.83 8.81333 9.91733 8.82567 10 8.825Z" />
//             </svg>
//           </nav>
//         </div>

//       </div>
//     </>
//   );
// }
import React, { useEffect, useRef, useState } from "react";
import "./createNewStockReceipt.css";
import { useNavigate } from "react-router-dom";
import StockListItem from "./stockListItem";
import StockSerialNumber from "./stock-serial-num/stockSerialNumber";
import StockBatchNumber from "./stock-batch-num/stockBatchNumber";
import { toast } from "react-toastify";
import stockReceiptApiProvider from "../../../network/stockReceipt-api-provider";
import purchaseOrderApiProvider from "../../../network/purchaseOrder-api-provider";
import userApiProvider from "../../../network/user-api-provider";

function mapGRNToState(grn) {
  if (!grn || !Object.keys(grn).length) return null;
  return {
    form: {
      grn_id:               grn.GRN_ID             || "",
      po_reference_id:      grn.po_reference_id    || "",
      po_reference_display: grn.po_reference       || "",
      received_date:        grn.received_date       || "",
      supplier_name:        grn.supplier?.supplier_name || "",
      supplier_dn_no:       grn.supplier_dn_no      || "",
      supplier_invoice_no:  grn.supplier_invoice_no || "",
      // Store the user id (backend returns id in these fields)
      received_by:          grn.received_by         || "",
      qc_done_by:           grn.qc_done_by          || "",
    },
    lineItems: (grn.items || []).map((item, idx) => ({
      id:                 idx,
      backend_item_id:    item.id,
      product_id:         String(item.product),
      product_display_id: item.product_id    || "",
      product_name:       item.product_name  || "",
      uom:                item.uom           || "",
      qty_ordered:        item.qty_ordered   || 0,
      qty_received:       item.qty_received  || 0,
      accepted_qty:       item.accepted_qty  || 0,
      rejected_qty:       item.rejected_qty  || 0,
      qty_returned:       item.qty_returned  || 0,
      stock_dim:          item.stock_dim     || "None",
      selected_warehouse: item.warehouse     || "",
      unit_price:         item.unit_price    || 0,
      tax_rate:           item.tax_rate      || 0,
      discount_rate:      item.discount_rate || 0,
      serials:            (item.serial_numbers || []).map((s) => s.serial_no),
      batches:            item.batch_numbers  || [],
    })),
    comments:    grn.comments    || [],
    history:     grn.history     || [],
    attachments: grn.attachments || [],
    status:      grn.status      || "",
    dbId:        grn.id          || null,
  };
}

export default function CreateNewStockReceipt({
  setCurrentPage,
  editGRNData = {},
  isEdit = false,
}) {
  const isEditMode = isEdit && Object.keys(editGRNData).length > 0;
  const prevpg     = useNavigate();

  const [pageLoading, setPageLoading] = useState(isEditMode);
  const [isLoading,   setIsLoading]   = useState(false);

  const [stockReceiptStatus, setStockReceiptStatus] = useState("");
  const [createdGrnId,       setCreatedGrnId]       = useState(
    isEditMode ? editGRNData.id || null : null
  );

  const [poList,      setPoList]      = useState([]);
  const [users,       setUsers]       = useState([]);   // ← NEW: user list for dropdowns
  const [lineItems,   setLineItems]   = useState([]);
  const [comments,    setComments]    = useState([]);
  const [history,     setHistory]     = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [newComment,  setNewComment]  = useState("");

  const [stockInput, setStockInput] = useState({
    grn_id:               "",
    po_reference_id:      "",
    po_reference_display: "",
    received_date:        "",
    supplier_name:        "",
    supplier_dn_no:       "",
    supplier_invoice_no:  "",
    received_by:          "",   // stores user id
    qc_done_by:           "",   // stores user id
  });

  const [activeTab, setActiveTab] = useState("comments");
  const fileInputRef = useRef(null);

  const [stockBtn, setStockBtn] = useState({
    BtnAccess:    false,
    cancal_grn:   true,
    draft:        false,
    submit:       false,
    pdf:          true,
    mail:         true,
    stock_return: true,
  });

  const [stockDim, setStockDim] = useState({
    serialBox:     false,
    batchBox:      false,
    activeRow:     null,
    activeProduct: null,
    activeItemId:  null,
  });

  function applyGRNToState(grn) {
    const mapped = mapGRNToState(grn);
    if (!mapped) return;
    setStockInput(mapped.form);
    setLineItems(mapped.lineItems);
    setComments(mapped.comments);
    setHistory(mapped.history);
    setAttachments(mapped.attachments);
    setStockReceiptStatus(mapped.status);
    setCreatedGrnId(mapped.dbId);
  }

  useEffect(() => {
    async function init() {
      try {
        // Fetch PO list
        const res    = await purchaseOrderApiProvider.fetchPurchaseOrders(1, "");
        const allPos = Array.isArray(res?.data?.data) ? res.data.data
                     : Array.isArray(res?.data)       ? res.data
                     : Array.isArray(res)             ? res : [];
        setPoList(allPos);
      } catch (err) {
        console.error("Failed to load PO list:", err);
      }

      try {
        // ← NEW: Fetch all users for received_by / qc_done_by dropdowns
        const allUsers = await userApiProvider.fetchAllUsers();
        setUsers(allUsers);
      } catch (err) {
        console.error("Failed to load users:", err);
      }

      if (isEditMode) {
        const id     = editGRNData.id;
        const detail = id
          ? await stockReceiptApiProvider.fetchSingleStockReceipt(id)
          : null;
        applyGRNToState(detail || editGRNData);
      }

      setPageLoading(false);
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!stockInput.po_reference_id || isEditMode) return;
    async function loadPO() {
      try {
        const res = await purchaseOrderApiProvider.fetchSinglePurchaseOrder(
          stockInput.po_reference_id
        );
        const po = res?.data || res;
        if (!po) return;
        setStockInput((prev) => ({
          ...prev,
          supplier_name: po.supplier?.supplier_name || po.supplier_name || "",
        }));
        const rows = (po.items || []).map((item, idx) => ({
          id:                 idx,
          backend_item_id:    null,
          product_id:         String(item.product),
          product_display_id: item.product_id          || item.product_id_display || "",
          product_name:       item.product_name        || "",
          uom:                item.uom                 || "",
          qty_ordered:        item.qty_ordered         || item.quantity || 0,
          qty_received:       item.qty_ordered         || item.quantity || 0,
          accepted_qty:       item.qty_ordered         || item.quantity || 0,
          rejected_qty:       0,
          qty_returned:       0,
          stock_dim:          "None",
          selected_warehouse: "",
          unit_price:         item.unit_price          || 0,
          tax_rate:           item.tax_rate            || 0,
          discount_rate:      item.discount_rate       || 0,
          serials:            [],
          batches:            [],
        }));
        setLineItems(rows);
      } catch (err) {
        console.error("Failed to fetch PO details:", err);
      }
    }
    loadPO();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stockInput.po_reference_id]);

  useEffect(() => {
    switch (stockReceiptStatus) {
      case "":
        setStockBtn({ BtnAccess: false, cancal_grn: true,  draft: false, submit: false, pdf: true,  mail: true,  stock_return: true });
        break;
      case "Draft":
        setStockBtn({ BtnAccess: false, cancal_grn: true,  draft: false, submit: false, pdf: false, mail: false, stock_return: true });
        break;
      case "Submitted":
        setStockBtn({ BtnAccess: true,  cancal_grn: false, draft: true,  submit: true,  pdf: false, mail: false, stock_return: false });
        break;
      case "Cancelled":
      case "Returned":
        setStockBtn({ BtnAccess: true,  cancal_grn: true,  draft: true,  submit: true,  pdf: false, mail: false, stock_return: true });
        break;
      default:
        break;
    }
  }, [stockReceiptStatus]);

  const handleStockInputChange = (e) => {
    setStockInput((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleLineItemChange = (rowId, field, value) => {
    setLineItems((prev) =>
      prev.map((row) => {
        if (row.id !== rowId) return row;
        const updated = { ...row, [field]: value };
        if (field === "qty_received" || field === "accepted_qty") {
          const received = parseInt(field === "qty_received" ? value : updated.qty_received) || 0;
          const accepted = parseInt(field === "accepted_qty"  ? value : updated.accepted_qty) || 0;
          updated.rejected_qty = Math.max(0, received - accepted);
        }
        return updated;
      })
    );
  };

  const handleSerialApply = (serials) => {
    setLineItems((prev) =>
      prev.map((row) => row.id === stockDim.activeRow ? { ...row, serials } : row)
    );
    setStockDim({ serialBox: false, batchBox: false, activeRow: null, activeProduct: null, activeItemId: null });
  };

  const handleBatchApply = (batches) => {
    setLineItems((prev) =>
      prev.map((row) => row.id === stockDim.activeRow ? { ...row, batches } : row)
    );
    setStockDim({ serialBox: false, batchBox: false, activeRow: null, activeProduct: null, activeItemId: null });
  };

  function buildPayload() {
    return {
      po_reference:        parseInt(stockInput.po_reference_id) || undefined,
      received_date:       stockInput.received_date              || null,
      supplier_dn_no:      stockInput.supplier_dn_no,
      supplier_invoice_no: stockInput.supplier_invoice_no,
      // ← CHANGED: send integer user ids to backend
      received_by:         parseInt(stockInput.received_by)      || null,
      qc_done_by:          parseInt(stockInput.qc_done_by)       || null,
      status:              "Draft",
      items: lineItems.map((row) => ({
        ...(row.backend_item_id ? { id: row.backend_item_id } : {}),
        product:       parseInt(row.product_id),
        uom:           row.uom,
        qty_ordered:   parseFloat(row.qty_ordered)   || 0,
        qty_received:  parseFloat(row.qty_received)  || 0,
        accepted_qty:  parseFloat(row.accepted_qty)  || 0,
        rejected_qty:  parseFloat(row.rejected_qty)  || 0,
        qty_returned:  parseFloat(row.qty_returned)  || 0,
        stock_dim:     row.stock_dim                 || "None",
        warehouse:     row.selected_warehouse        || "",
        unit_price:    parseFloat(row.unit_price)    || 0,
        tax_rate:      parseFloat(row.tax_rate)      || 0,
        discount_rate: parseFloat(row.discount_rate) || 0,
      })),
    };
  }

  const handleDraftState = async (e) => {
    e.preventDefault();
    if (!stockInput.po_reference_id) { toast.error("Please select a PO Reference"); return; }
    if (!stockInput.received_date)   { toast.error("Please select a Received Date"); return; }
    if (lineItems.length === 0)      { toast.error("No line items found");           return; }

    setIsLoading(true);
    try {
      const payload  = buildPayload();
      let grnId      = createdGrnId;
      let savedItems = [];

      if (!grnId) {
        const result = await stockReceiptApiProvider.createStockReceipt(payload);
        if (!result) return;
        const data = result?.data || result;
        grnId      = data?.id;
        savedItems = data?.items || [];
        setCreatedGrnId(grnId);
        if (data?.GRN_ID) setStockInput((prev) => ({ ...prev, grn_id: data.GRN_ID }));
        if (savedItems.length > 0) {
          setLineItems((prev) =>
            prev.map((row, idx) => ({
              ...row,
              backend_item_id: savedItems[idx]?.id || row.backend_item_id,
            }))
          );
        }
      } else {
        const result = await stockReceiptApiProvider.updateStockReceipt(grnId, payload);
        if (!result) return;
        savedItems = (result?.data || result)?.items || [];
      }

      setStockReceiptStatus("Draft");

      for (let i = 0; i < lineItems.length; i++) {
        const row    = lineItems[i];
        const itemId = savedItems[i]?.id || row.backend_item_id;
        if (row.stock_dim === "Serial" && row.serials?.length > 0 && itemId) {
          await stockReceiptApiProvider.addSerialNumbers(grnId, itemId, row.serials);
        }
      }

      for (let i = 0; i < lineItems.length; i++) {
        const row    = lineItems[i];
        const itemId = savedItems[i]?.id || row.backend_item_id;
        if (row.stock_dim === "Batch" && row.batches?.length > 0 && itemId) {
          await stockReceiptApiProvider.addBatchNumbers(grnId, itemId, row.batches);
        }
      }

    } catch (err) {
      console.error("handleDraftState error:", err);
      toast.error("Failed to save draft");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmittedState = async (e) => {
    e.preventDefault();
    if (!createdGrnId) { toast.error("Please save as Draft first"); return; }
    setIsLoading(true);
    try {
      const result = await stockReceiptApiProvider.performAction(createdGrnId, "submit");
      if (result) {
        setStockReceiptStatus("Submitted");
        const fresh = await stockReceiptApiProvider.fetchSingleStockReceipt(createdGrnId);
        if (fresh) {
          setHistory(fresh.history       || []);
          setComments(fresh.comments     || []);
          setAttachments(fresh.attachments || []);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelledState = async (e) => {
    e.preventDefault();
    if (!createdGrnId) return;
    if (!window.confirm("Are you sure you want to cancel this GRN?")) return;
    setIsLoading(true);
    try {
      const result = await stockReceiptApiProvider.performAction(createdGrnId, "cancel");
      if (result) setStockReceiptStatus("Cancelled");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStockReturn = async (e) => {
    e.preventDefault();
    if (!createdGrnId) return;
    if (!window.confirm("Are you sure you want to generate a stock return for this GRN?")) return;
    setIsLoading(true);
    try {
      const result = await stockReceiptApiProvider.generateReturn(createdGrnId);
      if (result) {
        setStockReceiptStatus("Returned");
        const fresh = await stockReceiptApiProvider.fetchSingleStockReceipt(createdGrnId);
        if (fresh) {
          setHistory(fresh.history       || []);
          setComments(fresh.comments     || []);
          setAttachments(fresh.attachments || []);
        }
      }
    } catch (err) {
      console.error("handleStockReturn error:", err);
      toast.error("Failed to generate stock return");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!createdGrnId) { toast.error("Save the GRN first"); return; }
    const res = await stockReceiptApiProvider.addComment(createdGrnId, newComment.trim());
    if (res) {
      setComments((prev) => [...prev, res?.data || res]);
      setNewComment("");
    }
  };

  const handleAttachmentUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !createdGrnId) return;
    const res = await stockReceiptApiProvider.uploadAttachment(createdGrnId, file);
    if (res) setAttachments((prev) => [...prev, res?.data || res]);
    e.target.value = "";
  };

  const handlePdf = async (e) => {
    e.preventDefault();
    if (!createdGrnId) return;
    await stockReceiptApiProvider.downloadPDF(createdGrnId, stockInput.grn_id);
  };

  const handleEmail = async (e) => {
    e.preventDefault();
    if (!createdGrnId) return;
    await stockReceiptApiProvider.sendEmail(createdGrnId);
  };

  const statusClass = {
    Draft:     "cerateNewStock-Status-draft",
    Submitted: "cerateNewStock-Status-Submitted",
    Cancelled: "cerateNewStock-Status-Cancelled",
    Returned:  "cerateNewStock-Status-Returned",
  }[stockReceiptStatus] || "";

  const isModalOpen = stockDim.serialBox || stockDim.batchBox;

  if (pageLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <p style={{ fontSize: "15px", color: "#888" }}>Loading stock receipt…</p>
      </div>
    );
  }

  return (
    <>
      {/* ── SERIAL NUMBER MODAL ── */}
      {stockDim.serialBox && (
        <StockSerialNumber
          setStockDim={setStockDim}
          activeProduct={stockDim.activeProduct}
          stockReceiptId={createdGrnId}
          itemId={stockDim.activeItemId}
          onApply={handleSerialApply}
          existingSerials={lineItems.find((r) => r.id === stockDim.activeRow)?.serials || []}
        />
      )}

      {/* ── BATCH NUMBER MODAL ── */}
      {stockDim.batchBox && (
        <StockBatchNumber
          setStockDim={setStockDim}
          activeProduct={stockDim.activeProduct}
          stockReceiptId={createdGrnId}
          itemId={stockDim.activeItemId}
          onApply={handleBatchApply}
        />
      )}

      <div className={`cerateNewStock-container ${isModalOpen ? "cerateNewStock-blur" : ""}`}>

        {/* ── HEAD ── */}
        <div className="cerateNewStock-head">
          <nav>
            <p>
              {isEditMode
                ? stockReceiptStatus === "Draft" ? "Edit Stock Receipt" : "View Stock Receipt"
                : "New Stock Receipt"}
            </p>
            {stockReceiptStatus && (
              <h3 className={statusClass}>Status: {stockReceiptStatus}</h3>
            )}
          </nav>
          <div>
            <button
              type="button"
              onClick={handleStockReturn}
              className={stockReceiptStatus === "Submitted" ? "cerateNewStock-order-active-btn" : "cerateNewStock-inactive-btn"}
              disabled={stockBtn.stock_return || isLoading}
            >
              {isLoading && !stockBtn.stock_return ? "Processing…" : "Stock Return"}
            </button>
            <nav className="cerateNewStock-close" onClick={(e) => { e.preventDefault(); prevpg(-1); }}>
              <svg className="cerateNewStock-circle-x-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
              </svg>
              <p>Close</p>
            </nav>
          </div>
        </div>

        {/* ── GRN DETAILS ── */}
        <div className="cerateNewStock-input-container">
          <div className="cerateNewStock-input-box">
            <label>GRN ID (Auto Generate)</label>
            <input type="text" value={stockInput.grn_id} placeholder="Auto Generate" disabled />
          </div>
          <div className="cerateNewStock-input-box">
            <label htmlFor="po_reference_id">PO Reference ID<sup>*</sup></label>
            {isEditMode ? (
              <input type="text" value={stockInput.po_reference_display || stockInput.po_reference_id} disabled />
            ) : (
              <select
                id="po_reference_id"
                value={stockInput.po_reference_id}
                onChange={handleStockInputChange}
                disabled={stockBtn.BtnAccess}
              >
                <option value="">Select PO Reference</option>
                {poList.map((po) => (
                  <option key={po.id} value={po.id}>
                    {po.PO_ID || po.po_id || `PO-${po.id}`}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="cerateNewStock-input-container">
          <div className="cerateNewStock-input-box">
            <label htmlFor="received_date">Received Date<sup>*</sup></label>
            <input
              id="received_date"
              type="date"
              value={stockInput.received_date}
              onChange={handleStockInputChange}
              disabled={stockBtn.BtnAccess}
            />
          </div>
          <div className="cerateNewStock-input-box">
            <label htmlFor="supplier_name">Supplier Name</label>
            <input
              id="supplier_name"
              type="text"
              value={stockInput.supplier_name}
              onChange={handleStockInputChange}
              placeholder="Auto-filled from PO"
              disabled={stockBtn.BtnAccess}
            />
          </div>
        </div>

        <div className="cerateNewStock-input-container">
          <div className="cerateNewStock-input-box">
            <label htmlFor="supplier_dn_no">Supplier DN No.</label>
            <input
              id="supplier_dn_no"
              type="text"
              value={stockInput.supplier_dn_no}
              onChange={handleStockInputChange}
              placeholder="Enter Supplier DN No."
              disabled={stockBtn.BtnAccess}
            />
          </div>
          <div className="cerateNewStock-input-box">
            <label htmlFor="supplier_invoice_no">Supplier Invoice No.</label>
            <input
              id="supplier_invoice_no"
              type="text"
              value={stockInput.supplier_invoice_no}
              onChange={handleStockInputChange}
              placeholder="Enter Supplier Invoice No."
              disabled={stockBtn.BtnAccess}
            />
          </div>
        </div>

        {/* ── RECEIVED BY & QC DONE BY — now dropdowns ── */}
        <div className="cerateNewStock-input-container">
          <div className="cerateNewStock-input-box">
            <label htmlFor="received_by">Received By</label>
            <select
              id="received_by"
              value={stockInput.received_by}
              onChange={handleStockInputChange}
              disabled={stockBtn.BtnAccess}
            >
              <option value="">Select User</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.first_name}{u.last_name ? ` ${u.last_name}` : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="cerateNewStock-input-box">
            <label htmlFor="qc_done_by">QC Done By</label>
            <select
              id="qc_done_by"
              value={stockInput.qc_done_by}
              onChange={handleStockInputChange}
              disabled={stockBtn.BtnAccess}
            >
              <option value="">Select User</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.first_name}{u.last_name ? ` ${u.last_name}` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ── LINE ITEMS ── */}
        <nav className="cerateNewStock-subtit">Line Items<sup>*</sup></nav>
        <div className="cerateNewStock-table-container">
          <table>
            <thead className="cerateNewStock-table-head">
              <tr>
                <th>#</th>
                <th><pre>Product Name</pre></th>
                <th><pre>Product ID</pre></th>
                <th>UOM</th>
                <th><pre>Qty Ordered</pre></th>
                <th><pre>Qty Received</pre></th>
                <th><pre>Accepted Qty</pre></th>
                <th><pre>Rejected Qty</pre></th>
                <th><pre>Qty Returned</pre></th>
                <th><pre>Stock Dim.</pre></th>
                <th>Warehouse</th>
                <th><pre>Unit Price</pre></th>
                <th><pre>Tax (%)</pre></th>
                <th><pre>Discount (%)</pre></th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="cerateNewStock-table-body">
              {lineItems.length === 0 ? (
                <tr>
                  <td colSpan={16} style={{ textAlign: "center", color: "#999", padding: "20px" }}>
                    {stockInput.po_reference_id ? "Loading items from PO…" : "Select a PO Reference to load items"}
                  </td>
                </tr>
              ) : (
                lineItems.map((row, idx) => (
                  <StockListItem
                    key={row.id}
                    index={idx + 1}
                    rowData={row}
                    BtnAccess={stockBtn.BtnAccess}
                    onFieldChange={handleLineItemChange}
                    onOpenDim={(dimType) => {
                      setStockDim({
                        serialBox:     dimType === "Serial",
                        batchBox:      dimType === "Batch",
                        activeRow:     row.id,
                        activeProduct: {
                          product_name: row.product_name,
                          product_id:   row.product_display_id || row.product_id,
                          uom:          row.uom,
                          qty_received: row.qty_received,
                          accepted_qty: row.accepted_qty,
                        },
                        activeItemId: row.backend_item_id,
                      });
                    }}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── COMMENTS / HISTORY / ATTACHMENTS ── */}
        <div className="cerateNewStock-hub-container">
          <div className="cerateNewStock-hub-head">
            {["comments", "history", "attachments"].map((tab) => (
              <p
                key={tab}
                className={activeTab === tab ? "cerateNewStock-hub-head-bg-black" : "cerateNewStock-hub-head-tit"}
                onClick={() => setActiveTab(tab)}
                style={{ textTransform: "capitalize" }}
              >
                {tab}
              </p>
            ))}
          </div>

          <div className="cerateNewStock-hub-body">
            {activeTab === "comments" && (
              <div className="cerateNewStock-comment-container">
                <p>Add Comment:</p>
                <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Enter your comment…"
                    style={{ flex: 1, padding: "8px 12px", borderRadius: "6px", border: "1px solid #ddd" }}
                  />
                  <button onClick={handleAddComment} className="cerateNewStock-active-btn" style={{ padding: "8px 16px" }}>
                    + Add
                  </button>
                </div>
                <div className="cerateNewStock-comment-brline" />
                <div className="cerateNewStock-showarea">
                  {comments.length === 0 ? (
                    <p style={{ color: "#888", fontSize: "13px", padding: "8px" }}>No comments yet.</p>
                  ) : comments.map((c, i) => (
                    <div key={i} className="cerateNewStock-message-container">
                      <svg className="cerateNewStock-comment-profile-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                        <rect width="24" height="24" rx="12" fill="#E0E4E7" />
                        <path d="M7 17.33V16.6219C7 15.3072 7.52224 14.0464 8.45184 13.1168C9.38143 12.1872 10.6422 11.665 11.9569 11.665M11.9569 11.665C13.2715 11.665 14.5323 12.1872 15.4619 13.1168C16.3915 14.0464 16.9138 15.3072 16.9138 16.6219V17.33M11.9569 11.665C12.7081 11.665 13.4286 11.3666 13.9598 10.8354C14.491 10.3042 14.7894 9.58373 14.7894 8.8325C14.7894 8.08127 14.491 7.36082 13.9598 6.82962C13.4286 6.29842 12.7081 6 11.9569 6C11.2057 6 10.4852 6.29842 9.954 6.82962C9.4228 7.36082 9.12438 8.08127 9.12438 8.8325C9.12438 9.58373 9.4228 10.3042 9.954 10.8354C10.4852 11.3666 11.2057 11.665 11.9569 11.665Z" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="cerateNewStock-message-box">
                        <p>{c.created_by || c.comment_by} · {new Date(c.timestamp).toLocaleString()}</p>
                        <nav>{c.comment}</nav>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "history" && (
              <div className="cerateNewStock-history-container">
                {history.length === 0 ? (
                  <p style={{ color: "#888", fontSize: "13px", padding: "12px" }}>No history yet.</p>
                ) : history.map((h, i) => (
                  <div key={i} style={{ padding: "10px 12px", background: "#f9f9f9", borderRadius: "6px", marginBottom: "6px" }}>
                    <p style={{ fontSize: "13px", margin: 0 }}>
                      <strong>{h.event_type}</strong>{h.details ? ` — ${h.details}` : ""}
                    </p>
                    <p style={{ fontSize: "11px", color: "#888", margin: "4px 0 0" }}>
                      {h.action_by} · {new Date(h.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "attachments" && (
              <div className="cerateNewStock-attachment-container">
                <input type="file" ref={fileInputRef} hidden onChange={handleAttachmentUpload} />
                <div className="cerateNewStock-upload-container">
                  <div
                    className="cerateNewStock-upload-btn"
                    onClick={() => !stockBtn.BtnAccess && fileInputRef.current.click()}
                    style={{ cursor: stockBtn.BtnAccess ? "not-allowed" : "pointer", opacity: stockBtn.BtnAccess ? 0.5 : 1 }}
                  >
                    <nav>Upload Files</nav>
                  </div>
                </div>
                {attachments.length === 0 ? (
                  <p style={{ color: "#888", fontSize: "13px", marginTop: "8px" }}>No attachments yet.</p>
                ) : attachments.map((att, i) => (
                  <div key={i} className="cerateNewStock-file-item">
                    <nav>{att.description || att.file?.split("/").pop()}</nav>
                    <div className="cerateNewStock-file-actions">
                      <a href={att.file} target="_blank" rel="noreferrer" download>Download</a>
                      <span style={{ fontSize: "11px", color: "#888" }}>
                        {att.uploaded_by} · {new Date(att.uploaded_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── ACTION BUTTONS ── */}
        <div className="cerateNewStock-btn-container">
          <button
            type="button"
            onClick={handleCancelledState}
            className={["Submitted"].includes(stockReceiptStatus) ? "cerateNewStock-order-active-btn" : "cerateNewStock-inactive-btn"}
            disabled={stockBtn.cancal_grn || isLoading}
          >
            {stockReceiptStatus === "Cancelled" ? "Cancelled GRN" : "Cancel GRN"}
          </button>

          <nav>
            <button type="button" className="cerateNewStock-cancel-btn" onClick={(e) => { e.preventDefault(); prevpg(-1); }}>
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDraftState}
              className={["", "Draft"].includes(stockReceiptStatus) ? "cerateNewStock-active-btn" : "cerateNewStock-completed-btn"}
              disabled={stockBtn.draft || isLoading}
            >
              {isLoading ? "Saving…" : "Save Draft"}
            </button>

            <button
              type="button"
              onClick={handleSubmittedState}
              className={["", "Draft"].includes(stockReceiptStatus) ? "cerateNewStock-active-btn" : "cerateNewStock-completed-btn"}
              disabled={stockBtn.submit || isLoading}
            >
              {stockReceiptStatus === "Submitted" ? "Submitted" : isLoading ? "Submitting…" : "Submit"}
            </button>

            <svg
              className={!stockBtn.pdf ? "cerateNewStock-pdf-mail-activelogo" : "cerateNewStock-pdf-mail-futurelogo"}
              style={{ cursor: !stockBtn.pdf ? "pointer" : "not-allowed", opacity: stockBtn.pdf ? 0.4 : 1 }}
              onClick={!stockBtn.pdf ? handlePdf : undefined}
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 24" fill="none"
            >
              <path fillRule="evenodd" clipRule="evenodd" d="M0.600098 2.4C0.600098 1.76348 0.852954 1.15303 1.30304 0.702944C1.75313 0.252856 2.36358 0 3.0001 0L16.1313 0L21.4001 5.2688V21.6C21.4001 22.2365 21.1472 22.847 20.6972 23.2971C20.2471 23.7471 19.6366 24 19.0001 24H3.0001C2.36358 24 1.75313 23.7471 1.30304 23.2971C0.852954 22.847 0.600098 22.2365 0.600098 21.6V2.4ZM4.6001 9.6H2.2001V17.6H3.8001V14.4H4.6001C5.23662 14.4 5.84707 14.1471 6.29715 13.6971C6.74724 13.247 7.0001 12.6365 7.0001 12C7.0001 11.3635 6.74724 10.753 6.29715 10.3029C5.84707 9.85286 5.23662 9.6 4.6001 9.6ZM11.0001 9.6H8.6001V17.6H11.0001C11.6366 17.6 12.2471 17.3471 12.6972 16.8971C13.1472 16.447 13.4001 15.8365 13.4001 15.2V12C13.4001 11.3635 13.1472 10.753 12.6972 10.3029C12.2471 9.85286 11.6366 9.6 11.0001 9.6ZM15.0001 17.6V9.6H19.8001V11.2H16.6001V12.8H18.2001V14.4H16.6001V17.6H15.0001Z" />
            </svg>

            <svg
              className={!stockBtn.mail ? "cerateNewStock-pdf-mail-activelogo" : "cerateNewStock-pdf-mail-futurelogo"}
              style={{ cursor: !stockBtn.mail ? "pointer" : "not-allowed", opacity: stockBtn.mail ? 0.4 : 1 }}
              onClick={!stockBtn.mail ? handleEmail : undefined}
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 16" fill="none"
            >
              <path d="M2 16C1.45 16 0.979333 15.8043 0.588 15.413C0.196667 15.0217 0.000666667 14.5507 0 14V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196666 1.45067 0.000666667 2 0H18C18.55 0 19.021 0.196 19.413 0.588C19.805 0.98 20.0007 1.45067 18 2V14C20 14.55 19.8043 15.021 19.413 15.413C19.0217 15.805 18.5507 16.0007 18 16H2ZM10 8.825C10.0833 8.825 10.171 8.81233 10.263 8.787C10.355 8.76167 10.4423 8.72433 10.525 8.675L17.6 4.25C17.7333 4.16667 17.8333 4.06267 17.9 3.938C17.9667 3.81833 18 3.67567 18 3.525C18 3.19167 17.8583 2.94167 17.575 2.775C17.2917 2.60833 17 2.61667 16.7 2.8L10 7L3.3 2.8C3 2.61667 2.70833 2.61267 2.425 2.788C2.14167 2.96333 2 3.209 2 3.525C2 3.69167 2.03333 3.83767 2.1 3.963C2.16667 4.08833 2.26667 4.184 2.4 4.25L9.475 8.675C9.55833 8.725 9.646 8.76267 9.738 8.788C9.83 8.81333 9.91733 8.82567 10 8.825Z" />
            </svg>
          </nav>
        </div>

      </div>
    </>
  );
}