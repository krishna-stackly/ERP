// // import React, { useEffect, useState } from "react";
// // import "./createNewStockReceipt.css";
// // import { useNavigate } from "react-router-dom";
// // import StockListItem from "./stockListItem";
// // import StockComment from "./stockComment";
// // import StockHistory from "./stockHistory";
// // import StockAttachment from "./stockAttachment";
// // import StockSerialNumber from "./stock-serial-num/stockSerialNumber";
// // import StockBatchNumber from "./stock-batch-num/stockBatchNumber";
// // import StockBatchSerialNum from "./stockBatchSerialNum";
// // import { toast } from "react-toastify";

// // export default function createNewStockReceipt({ setCurrentPage }) {
// //   const prevpg = useNavigate();
// //   const [stockReceiptStatus, setStockReceiptstatus] = useState("");
// //   const [numOfStockList, setNumOfStockList] = useState(1);
// //   const [StockListData, setStockListData] = useState([{ unique_key: 0 }]);

// //   const [ApiStockData, setApiStockData] = useState({});
// //   const [stockData, setStockData] = useState([]);

// //   const [stockBtn, setStockBtn] = useState({
// //     BtnAccess: false,
// //     cancal_grn: true,
// //     draft: false,
// //     submit: false,
// //     pdf: true,
// //     mail: true,
// //     stock_return: true,
// //   });

// //   // serial & batch
// //   const [stockDim, setStockDim] = useState({
// //     serialBox: false,
// //     batchBox: false,
// //     batchSerialNO: false,
// //     activeRow: null, // stores the row index
// //     activeProduct: null, // stores product data if needed
// //   });

// //   const [detail, setDetail] = useState({
// //     comment: true,
// //     history: false,
// //     attachment: false,
// //   });

// //   const stockFromApi = {
// //     stockData: [
// //       {
// //         po_reference_id: "PO-001",
// //         supplier_name: "Praveen",
// //         stock_table_data: [
// //           {
// //             product_name: "Key Board",
// //             product_id: "KEY-001",
// //             umo: "PCS",
// //             qty_ordered: "100",
// //             qty_received: "100",
// //             accepted_qty: "95",
// //             rejected_qty: "5",
// //             qty_returned: "0",
// //             warehouse: ["Rack A1", "Rack A2"],
// //           },
// //           {
// //             product_name: "Mouse",
// //             product_id: "MOU-001",
// //             umo: "PCS",
// //             qty_ordered: "100",
// //             qty_received: "100",
// //             accepted_qty: "85",
// //             rejected_qty: "15",
// //             qty_returned: "0",
// //             warehouse: ["Rack A1", "Rack A2"],
// //           },
// //           {
// //             product_name: "Mouse",
// //             product_id: "MOU-001",
// //             umo: "PCS",
// //             qty_ordered: "100",
// //             qty_received: "100",
// //             accepted_qty: "85",
// //             rejected_qty: "15",
// //             qty_returned: "0",
// //             warehouse: ["Rack A1", "Rack A2"],
// //           },
// //         ],
// //       },
// //       {
// //         po_reference_id: "PO-002",
// //         supplier_name: "Naveen",
// //         stock_table_data: [
// //           {
// //             product_name: "Pendrive",
// //             product_id: "PEN-001",
// //             umo: "PCS",
// //             qty_ordered: "100",
// //             qty_received: "100",
// //             accepted_qty: "95",
// //             rejected_qty: "5",
// //             qty_returned: "0",
// //             warehouse: ["Rack A1", "Rack A2"],
// //           },
// //           {
// //             product_name: "Moniter",
// //             product_id: "MON-001",
// //             umo: "PCS",
// //             qty_ordered: "100",
// //             qty_received: "100",
// //             accepted_qty: "85",
// //             rejected_qty: "15",
// //             qty_returned: "0",
// //             warehouse: ["Rack A1", "Rack A2"],
// //           },
// //         ],
// //       },
// //     ],
// //   };
// //   const [stockInput, setStockInput] = useState({
// //     grn_id: "",
// //     po_reference_id: "",
// //     received_date: "",
// //     supplier_name: "",
// //     supplier_dn_no: "",
// //     supplier_invoice_no: "",
// //     received_by: "",
// //     qc_done_by: "",
// //   });
// //   const handleStockInputChange = (e) => {
// //     setStockInput((prev) => {
// //       return { ...prev, [e.target.id]: e.target.value };
// //     });
// //   };

// //   useEffect(() => {
// //     setApiStockData(stockFromApi);
// //   }, []);
// //   useEffect(() => {
// //     if (Object.keys(ApiStockData).length > 0) {
// //       setStockData(ApiStockData.stockData);
// //     }
// //   }, [ApiStockData]);
// //   useEffect(() => {
// //     const selected = stockInput.po_reference_id;
// //     if (!selected) {
// //       setStockInput((prev) => ({
// //         ...prev,
// //         supplier_name: "",
// //       }));
// //       setNumOfStockList(0);
// //       return;
// //     }

// //     const po_id = stockData.find((ele) => ele.po_reference_id === selected);

// //     if (po_id) {
// //       setStockInput((prev) => ({
// //         ...prev,
// //         supplier_name: po_id.supplier_name,
// //       }));
// //       setNumOfStockList(po_id.stock_table_data.length);
// //     }
// //   }, [stockInput.po_reference_id]);

// //   const handleAddItem = (e) => {
// //     e.preventDefault();
// //     const po_id = stockData.find(
// //       (ele) => ele.po_reference_id === stockInput.po_reference_id
// //     );

// //     if (po_id) {
// //       // Add a new item to StockListData
// //       setStockListData((prev) => [
// //         ...prev,
// //         {
// //           unique_key: prev.length,
// //           // Include default values here if needed
// //         },
// //       ]);
// //       // Update the count
// //       setNumOfStockList((prev) => prev + 1);
// //     } else {
// //       toast.error("Please select a PO Reference first");
// //     }
// //   };

// //   // Calculate if add button should be disabled
// //   const isAddDisabled =
// //     stockBtn.BtnAccess ||
// //     !stockInput.po_reference_id ||
// //     (() => {
// //       const po_id = stockData.find(
// //         (ele) => ele.po_reference_id === stockInput.po_reference_id
// //       );
// //       return po_id ? numOfStockList >= po_id.stock_table_data.length : true;
// //     })();

// //   // status
// //   useEffect(() => {
// //     if (stockReceiptStatus === "") {
// //       setStockBtn((prev) => ({
// //         ...prev,
// //         BtnAccess: false,
// //       }));
// //       return;
// //     }
// //     switch (stockReceiptStatus) {
// //       case "Draft":
// //         setStockBtn((prev) => ({
// //           ...prev,
// //           BtnAccess: false,
// //           cancal_grn: true,
// //           draft: false,
// //           submit: false,
// //           stock_return: true,
// //           pdf: false,
// //           mail: false,
// //         }));
// //         break;
// //       case "Submitted":
// //         setStockBtn((prev) => ({
// //           ...prev,
// //           BtnAccess: true,
// //           stock_return: false,
// //           cancal_grn: false,
// //           draft: true,
// //           submit: true,
// //         }));
// //         break;
// //       case "Cancelled" || "Returned":
// //         setStockBtn((prev) => ({
// //           ...prev,
// //           stock_return: true,
// //           cancal_grn: true,
// //         }));
// //         break;
// //       default:
// //         setDeliveryBtn((prev) => ({
// //           ...prev,
// //           BtnAccess: false,
// //           delivery_return: true,
// //         }));
// //     }
// //   }, [stockReceiptStatus]);

// //   const handleDraftState = (e) => {
// //     e.preventDefault();
// //     setStockReceiptstatus("Draft");
// //     toast.success("Stock Receipt Item in Draft State");
// //   };
// //   const handleSubmittedState = (e) => {
// //     e.preventDefault();
// //     setStockReceiptstatus("Submitted");
// //     toast.success("Stock Receipt Item in Submitted State");
// //   };
// //   const handleCancelledState = (e) => {
// //     e.preventDefault();
// //     setStockReceiptstatus("Cancelled");
// //     toast.success("Stock Receipt Item in Cancelled GRN State");
// //   };
// //   console.log(stockDim.activeProduct);

// //   return (
// //     <>
// //       {stockDim.serialBox && (
// //         <div className="cerateNewStock-btn">
// //           <StockSerialNumber setStockDim={setStockDim} />
// //         </div>
// //       )}
// //       {stockDim.batchBox && (
// //         <div className="cerateNewStock-btn">
// //           <StockBatchNumber setStockDim={setStockDim} />
// //         </div>
// //       )}
// //       {stockDim.batchSerialNO && (
// //         <div className="cerateNewStock-btn">
// //           <StockBatchSerialNum setStockDim={setStockDim} />
// //         </div>
// //       )}

// //       <div
// //         className={`cerateNewStock-container ${
// //           (stockDim.serialBox || stockDim.batchBox || stockDim.batchSerialNO) &&
// //           "cerateNewStock-blur"
// //         }`}
// //       >
// //         <form onSubmit={handleSubmittedState}>
// //           <div className="cerateNewStock-head">
// //             <nav>
// //               <p>
// //                 {stockReceiptStatus === ""
// //                   ? "New Stock Receipt"
// //                   : "Stock Receipt"}
// //               </p>
// //               {stockReceiptStatus !== "" && (
// //                 <h3
// //                   className={
// //                     stockReceiptStatus === "Draft"
// //                       ? "cerateNewStock-Status-draft"
// //                       : stockReceiptStatus === "Submitted"
// //                       ? "cerateNewStock-Status-Submitted"
// //                       : stockReceiptStatus === "Cancelled"
// //                       ? "cerateNewStock-Status-Cancelled"
// //                       : stockReceiptStatus === "Returned"
// //                       ? "cerateNewStock-Status-Returned"
// //                       : ""
// //                   }
// //                 >
// //                   Status: {stockReceiptStatus}
// //                 </h3>
// //               )}
// //             </nav>
// //             <div>
// //               <button
// //                 className={
// //                   stockReceiptStatus === "Submitted"
// //                     ? "cerateNewStock-active-btn"
// //                     : "cerateNewStock-inactive-btn"
// //                 }
// //                 disabled={stockBtn.stock_return}
// //               >
// //                 Stock Return
// //               </button>
// //               <nav
// //                 className="cerateNewStock-close"
// //                 onClick={(e) => {
// //                   e.preventDefault();
// //                   prevpg(-1);
// //                 }}
// //               >
// //                 <svg
// //                   className="cerateNewStock-circle-x-logo"
// //                   xmlns="http://www.w3.org/2000/svg"
// //                   viewBox="0 0 512 512"
// //                 >
// //                   <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
// //                 </svg>
// //                 <p>Close</p>
// //               </nav>
// //             </div>
// //           </div>
// //           <div className="cerateNewStock-input-container">
// //             <div className="cerateNewStock-input-box">
// //               <label htmlFor="grn_id">GRN ID {`(Auto Generate)`}</label>
// //               <input
// //                 id="grn_id"
// //                 type="text"
// //                 value={stockInput.grn_id}
// //                 placeholder="Auto Generate"
// //                 disabled
// //               />
// //             </div>
// //             <div className="cerateNewStock-input-box">
// //               <label htmlFor="po_reference_id">
// //                 PO Reference ID<sup>*</sup>
// //               </label>
// //               <select
// //                 id="po_reference_id"
// //                 value={stockInput.po_reference_id}
// //                 onChange={handleStockInputChange}
// //                 required
// //                 disabled={stockBtn.BtnAccess}
// //               >
// //                 <option value="">Select Referance</option>
// //                 {stockData.map((ele, ind) => (
// //                   <option value={ele.po_reference_id} key={ind}>
// //                     {ele.po_reference_id}
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>
// //           </div>
// //           <div className="cerateNewStock-input-container">
// //             <div className="cerateNewStock-input-box">
// //               <label htmlFor="received_date">
// //                 Received Date<sup>*</sup>
// //               </label>
// //               <input
// //                 id="received_date"
// //                 value={stockInput.received_date}
// //                 onChange={handleStockInputChange}
// //                 type="date"
// //                 required
// //                 disabled={stockBtn.BtnAccess}
// //               />
// //             </div>
// //             <div className="cerateNewStock-input-box">
// //               <label htmlFor="supplier_name">
// //                 Supplier Name<sup>*</sup>
// //               </label>
// //               <input
// //                 type="text"
// //                 value={stockInput.supplier_name}
// //                 onChange={handleStockInputChange}
// //                 id="supplier_name"
// //                 placeholder="Enter Supplier Name"
// //                 required
// //                 disabled={stockBtn.BtnAccess}
// //               />
// //             </div>
// //           </div>
// //           <div className="cerateNewStock-input-container">
// //             <div className="cerateNewStock-input-box">
// //               <label htmlFor="supplier_dn_no">Supplier DN No.</label>
// //               <input
// //                 id="supplier_dn_no"
// //                 value={stockInput.supplier_dn_no}
// //                 onChange={handleStockInputChange}
// //                 type="text"
// //                 placeholder="Enter Supplier DN No."
// //                 disabled={stockBtn.BtnAccess}
// //               />
// //             </div>
// //             <div className="cerateNewStock-input-box">
// //               <label htmlFor="supplier_invoice_no">Supplier Invoice No.</label>
// //               <input
// //                 type="text"
// //                 value={stockInput.supplier_invoice_no}
// //                 onChange={handleStockInputChange}
// //                 id="supplier_invoice_no"
// //                 placeholder="Enter Supplier Invoice No."
// //                 disabled={stockBtn.BtnAccess}
// //               />
// //             </div>
// //           </div>
// //           <div className="cerateNewStock-input-container">
// //             <div className="cerateNewStock-input-box">
// //               <label htmlFor="received_by">Received By</label>
// //               <select
// //                 id="received_by"
// //                 value={stockInput.received_by}
// //                 onChange={handleStockInputChange}
// //                 disabled={stockBtn.BtnAccess}
// //               >
// //                 <option value="">Select Referance</option>
// //                 <option value="one">One</option>
// //               </select>
// //             </div>
// //             <div className="cerateNewStock-input-box">
// //               <label htmlFor="qc_done_by">QC Done By</label>
// //               <select
// //                 id="qc_done_by"
// //                 value={stockInput.qc_done_by}
// //                 onChange={handleStockInputChange}
// //                 disabled={stockBtn.BtnAccess}
// //               >
// //                 <option value="">Select Referance</option>
// //                 <option value="one">One</option>
// //               </select>
// //             </div>
// //           </div>
// //           <nav className="cerateNewStock-subtit">
// //             Line Items<sup>*</sup>
// //           </nav>
// //           <div className="cerateNewStock-table-container">
// //             <table>
// //               <thead className="cerateNewStock-table-head">
// //                 <tr>
// //                   <th>#</th>
// //                   <th>
// //                     <pre>Product Name</pre>
// //                   </th>
// //                   <th>
// //                     <pre>Product ID</pre>
// //                   </th>
// //                   <th>UMO</th>
// //                   <th>
// //                     <pre>Qty Ordered</pre>
// //                   </th>
// //                   <th>
// //                     <pre>Qty Received</pre>
// //                   </th>
// //                   <th>
// //                     <pre>Accepted Qty</pre>
// //                   </th>
// //                   <th>
// //                     <pre>Rejected Qty</pre>
// //                   </th>
// //                   <th>
// //                     <pre>Qty Returned</pre>
// //                   </th>
// //                   <th>
// //                     <pre>Stock Dim.</pre>
// //                   </th>
// //                   <th> Warehouse</th>
// //                   <th>Action</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="cerateNewStock-table-body">
// //                 {[...Array(numOfStockList)].map((ele, ind) => (
// //                   <StockListItem
// //                     key={ind}
// //                     unique_key={ind}
// //                     stockInput={stockInput}
// //                     //api data
// //                     stockData={stockData}
// //                     //disable
// //                     BtnAccess={stockBtn.BtnAccess}
// //                     //serial&batch
// //                     setStockDim={setStockDim}
// //                   />
// //                 ))}
// //                 <tr>
// //                   <td></td>
// //                   <td>
// //                     <button
// //                       onClick={(e) => {
// //                         e.preventDefault();
// //                         setStockListData((prev) => {
// //                           return [...prev, { unique_key: numOfStockList }];
// //                         });
// //                         setNumOfStockList((p) => ++p);
// //                         handleAddItem;
// //                       }}
// //                       disabled={stockBtn.BtnAccess || isAddDisabled}
// //                     >
// //                       + Add Item
// //                     </button>
// //                   </td>
// //                 </tr>
// //               </tbody>
// //             </table>
// //           </div>
// //           <div className="cerateNewStock-hub-container">
// //             <div className="cerateNewStock-hub-head">
// //               <p
// //                 className={
// //                   detail.comment
// //                     ? "cerateNewStock-hub-head-bg-black"
// //                     : "cerateNewStock-hub-head-tit"
// //                 }
// //                 onClick={() => {
// //                   setDetail({
// //                     history: false,
// //                     attachment: false,
// //                     comment: true,
// //                   });
// //                 }}
// //               >
// //                 Comments
// //               </p>
// //               <p
// //                 className={
// //                   detail.history
// //                     ? "cerateNewStock-hub-head-bg-black"
// //                     : "cerateNewStock-hub-head-tit"
// //                 }
// //                 onClick={() => {
// //                   setDetail({
// //                     history: true,
// //                     attachment: false,
// //                     comment: false,
// //                   });
// //                 }}
// //               >
// //                 History
// //               </p>
// //               <p
// //                 className={
// //                   detail.attachment
// //                     ? "cerateNewStock-hub-head-bg-black"
// //                     : "cerateNewStock-hub-head-tit"
// //                 }
// //                 onClick={() => {
// //                   setDetail({
// //                     history: false,
// //                     attachment: true,
// //                     comment: false,
// //                   });
// //                 }}
// //               >
// //                 Attachments
// //               </p>
// //             </div>
// //             <div className="cerateNewStock-hub-body">
// //               {detail.comment && <StockComment />}
// //               {detail.history && <StockHistory />}
// //               {detail.attachment && (
// //                 <StockAttachment inputDisable={stockBtn.BtnAccess} />
// //               )}
// //             </div>
// //           </div>
// //           <div className="cerateNewStock-btn-container">
// //             <button
// //               onClick={handleCancelledState}
// //               className={
// //                 stockReceiptStatus === "Submitted" ||
// //                 stockReceiptStatus === "Cancelled"
// //                   ? "cerateNewStock-order-active-btn"
// //                   : "cerateNewStock-inactive-btn"
// //               }
// //               disabled={stockBtn.cancal_grn}
// //             >
// //               {stockReceiptStatus === "Cancelled"
// //                 ? "Cancelled GRN"
// //                 : "Cancel GRN"}
// //             </button>
// //             <nav>
// //               <button
// //                 onClick={(e) => {
// //                   e.preventDefault();
// //                   prevpg(-1);
// //                 }}
// //                 className="cerateNewStock-cancel-btn"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 onClick={handleDraftState}
// //                 className={
// //                   stockReceiptStatus === "" || stockReceiptStatus === "Draft"
// //                     ? "cerateNewStock-active-btn"
// //                     : "cerateNewStock-completed-btn"
// //                 }
// //                 disabled={stockBtn.draft}
// //               >
// //                 Save Draft
// //               </button>
// //               <button
// //                 className={
// //                   stockReceiptStatus === "" || stockReceiptStatus === "Draft"
// //                     ? "cerateNewStock-active-btn"
// //                     : "cerateNewStock-completed-btn"
// //                 }
// //                 disabled={stockBtn.submit}
// //               >
// //                 {stockReceiptStatus === "Draft" || stockReceiptStatus === ""
// //                   ? "Submit"
// //                   : "Submitted"}
// //               </button>
// //               <svg
// //                 className={
// //                   stockReceiptStatus !== ""
// //                     ? "cerateNewStock-pdf-mail-activelogo"
// //                     : "cerateNewStock-pdf-mail-futurelogo"
// //                 }
// //                 disabled={stockBtn.pdf}
// //                 xmlns="http://www.w3.org/2000/svg"
// //                 viewBox="0 0 22 24"
// //                 fill="none"
// //               >
// //                 <path
// //                   fillRule="evenodd"
// //                   clipRule="evenodd"
// //                   d="M0.600098 2.4C0.600098 1.76348 0.852954 1.15303 1.30304 0.702944C1.75313 0.252856 2.36358 0 3.0001 0L16.1313 0L21.4001 5.2688V21.6C21.4001 22.2365 21.1472 22.847 20.6972 23.2971C20.2471 23.7471 19.6366 24 19.0001 24H3.0001C2.36358 24 1.75313 23.7471 1.30304 23.2971C0.852954 22.847 0.600098 22.2365 0.600098 21.6V2.4ZM4.6001 9.6H2.2001V17.6H3.8001V14.4H4.6001C5.23662 14.4 5.84707 14.1471 6.29715 13.6971C6.74724 13.247 7.0001 12.6365 7.0001 12C7.0001 11.3635 6.74724 10.753 6.29715 10.3029C5.84707 9.85286 5.23662 9.6 4.6001 9.6ZM11.0001 9.6H8.6001V17.6H11.0001C11.6366 17.6 12.2471 17.3471 12.6972 16.8971C13.1472 16.447 13.4001 15.8365 13.4001 15.2V12C13.4001 11.3635 13.1472 10.753 12.6972 10.3029C12.2471 9.85286 11.6366 9.6 11.0001 9.6ZM15.0001 17.6V9.6H19.8001V11.2H16.6001V12.8H18.2001V14.4H16.6001V17.6H15.0001Z"
// //                 />
// //               </svg>
// //               <svg
// //                 disabled={stockBtn.mail}
// //                 className={
// //                   stockReceiptStatus !== ""
// //                     ? "cerateNewStock-pdf-mail-activelogo"
// //                     : "cerateNewStock-pdf-mail-futurelogo"
// //                 }
// //                 xmlns="http://www.w3.org/2000/svg"
// //                 viewBox="0 0 20 16"
// //                 fill="none"
// //               >
// //                 <path d="M2 16C1.45 16 0.979333 15.8043 0.588 15.413C0.196667 15.0217 0.000666667 14.5507 0 14V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196666 1.45067 0.000666667 2 0H18C18.55 0 19.021 0.196 19.413 0.588C19.805 0.98 20.0007 1.45067 20 2V14C20 14.55 19.8043 15.021 19.413 15.413C19.0217 15.805 18.5507 16.0007 18 16H2ZM10 8.825C10.0833 8.825 10.171 8.81233 10.263 8.787C10.355 8.76167 10.4423 8.72433 10.525 8.675L17.6 4.25C17.7333 4.16667 17.8333 4.06267 17.9 3.938C17.9667 3.81333 18 3.67567 18 3.525C18 3.19167 17.8583 2.94167 17.575 2.775C17.2917 2.60833 17 2.61667 16.7 2.8L10 7L3.3 2.8C3 2.61667 2.70833 2.61267 2.425 2.788C2.14167 2.96333 2 3.209 2 3.525C2 3.69167 2.03333 3.83767 2.1 3.963C2.16667 4.08833 2.26667 4.184 2.4 4.25L9.475 8.675C9.55833 8.725 9.646 8.76267 9.738 8.788C9.83 8.81333 9.91733 8.82567 10 8.825Z" />
// //               </svg>
// //             </nav>
// //           </div>
// //         </form>
// //       </div>
// //     </>
// //   );
// // }
// import React, { useEffect, useState } from "react";
// import "./createNewStockReceipt.css";
// import { useNavigate } from "react-router-dom";
// import StockListItem from "./stockListItem";
// import StockComment from "./stockComment";
// import StockHistory from "./stockHistory";
// import StockAttachment from "./stockAttachment";
// import StockSerialNumber from "./stock-serial-num/stockSerialNumber";
// import StockBatchNumber from "./stock-batch-num/stockBatchNumber";
// import { toast } from "react-toastify";
// import stockReceiptApiProvider from "../../../network/stockReceipt-api-provider";
// import purchaseOrderApiProvider from "../../../network/purchaseOrder-api-provider";

// export default function CreateNewStockReceipt({ setCurrentPage }) {
//   const prevpg = useNavigate();

//   // ── Core state ─────────────────────────────────────────────────────────────
//   const [stockReceiptStatus, setStockReceiptStatus] = useState("");
//   const [createdGrnId, setCreatedGrnId]             = useState(null);  // numeric DB id after POST
//   const [isLoading, setIsLoading]                   = useState(false);

//   // ── Reference data ─────────────────────────────────────────────────────────
//   const [poList, setPoList]   = useState([]);   // submitted POs available for GRN
//   const [stockData, setStockData] = useState([]); // line items from selected PO

//   // ── Line items state ───────────────────────────────────────────────────────
//   // Each row carries all editable + computed fields plus local serial/batch lists
//   const [lineItems, setLineItems] = useState([]);

//   // ── Header form ────────────────────────────────────────────────────────────
//   const [stockInput, setStockInput] = useState({
//     grn_id:              "",
//     po_reference_id:     "",   // numeric PO id
//     received_date:       "",
//     supplier_name:       "",
//     supplier_dn_no:      "",
//     supplier_invoice_no: "",
//     received_by:         "",
//     qc_done_by:          "",
//   });

//   // ── Tab state ──────────────────────────────────────────────────────────────
//   const [detail, setDetail] = useState({
//     comment: true, history: false, attachment: false,
//   });

//   // ── Button control ─────────────────────────────────────────────────────────
//   const [stockBtn, setStockBtn] = useState({
//     BtnAccess:   false,
//     cancal_grn:  true,
//     draft:       false,
//     submit:      false,
//     pdf:         true,
//     mail:        true,
//     stock_return: true,
//   });

//   // ── Serial / Batch modal state ─────────────────────────────────────────────
//   const [stockDim, setStockDim] = useState({
//     serialBox:    false,
//     batchBox:     false,
//     batchSerialNO: false,
//     activeRow:    null,   // lineItems index
//     activeProduct: null,  // { product_name, product_id, uom, qty_received, accepted_qty }
//     activeItemId:  null,  // backend item id (null until GRN saved)
//   });

//   // =========================================================================
//   // LOAD PO LIST ON MOUNT
//   // Fetch submitted POs to populate "PO Reference ID" dropdown
//   // =========================================================================
//   useEffect(() => {
//     const loadPos = async () => {
//       try {
//         const res = await purchaseOrderApiProvider.fetchPurchaseOrders(1, "");
//         // filter only Submitted / Partially Received POs
//         const available = (res?.results || res?.data || []).filter((po) =>
//           ["Submitted", "Partially Received"].includes(po.status)
//         );
//         setPoList(available);
//       } catch (err) {
//         console.error("Failed to load PO list:", err);
//       }
//     };
//     loadPos();
//   }, []);

//   // =========================================================================
//   // WHEN PO REFERENCE CHANGES — fetch PO items & auto-fill supplier
//   // =========================================================================
//   useEffect(() => {
//     const fetchPoItems = async () => {
//       if (!stockInput.po_reference_id) {
//         setLineItems([]);
//         setStockInput((prev) => ({ ...prev, supplier_name: "" }));
//         return;
//       }

//       try {
//         const po = await purchaseOrderApiProvider.fetchSinglePurchaseOrder(
//           stockInput.po_reference_id
//         );
//         if (!po) return;

//         // Auto-fill supplier name
//         setStockInput((prev) => ({
//           ...prev,
//           supplier_name: po.supplier_name || "",
//         }));

//         // Build line items from PO items
//         const rows = (po.items || po.line_items || []).map((item, idx) => ({
//           id:              idx,                        // local row id
//           backend_item_id: item.id || null,           // backend item id (used for serial/batch API)
//           product_id:      item.product_id || item.product || "",
//           product_name:    item.product_name || item.name || "",
//           uom:             item.uom || "",
//           qty_ordered:     item.qty_ordered || 0,
//           qty_received:    item.qty_received || item.qty_ordered || 0,
//           accepted_qty:    item.accepted_qty || item.qty_ordered || 0,
//           rejected_qty:    item.rejected_qty || 0,
//           qty_returned:    item.qty_returned || 0,
//           stock_dim:       item.stock_dim || "None",
//           warehouse:       item.warehouse_options || [],
//           selected_warehouse: item.warehouse || "",
//           unit_price:      item.unit_price || 0,
//           tax_rate:        item.tax_rate || 0,
//           discount_rate:   item.discount_rate || 0,
//           serials:         [],   // locally stored serial numbers
//           batches:         [],   // locally stored batch numbers
//         }));
//         setLineItems(rows);
//       } catch (err) {
//         console.error("Failed to fetch PO details:", err);
//       }
//     };
//     fetchPoItems();
//   }, [stockInput.po_reference_id]);

//   // =========================================================================
//   // BUTTON ACCESS CONTROL
//   // =========================================================================
//   useEffect(() => {
//     switch (stockReceiptStatus) {
//       case "":
//         setStockBtn({ BtnAccess: false, cancal_grn: true, draft: false, submit: false, pdf: true, mail: true, stock_return: true });
//         break;
//       case "Draft":
//         setStockBtn({ BtnAccess: false, cancal_grn: true, draft: false, submit: false, pdf: false, mail: false, stock_return: true });
//         break;
//       case "Submitted":
//         setStockBtn({ BtnAccess: true, cancal_grn: false, draft: true, submit: true, pdf: false, mail: false, stock_return: false });
//         break;
//       case "Cancelled":
//       case "Returned":
//         setStockBtn({ BtnAccess: true, cancal_grn: true, draft: true, submit: true, pdf: false, mail: false, stock_return: true });
//         break;
//       default:
//         break;
//     }
//   }, [stockReceiptStatus]);

//   // =========================================================================
//   // FORM INPUT HANDLER
//   // =========================================================================
//   const handleStockInputChange = (e) => {
//     setStockInput((prev) => ({ ...prev, [e.target.id]: e.target.value }));
//   };

//   // =========================================================================
//   // LINE ITEM CHANGE HANDLER (called from StockListItem)
//   // =========================================================================
//   const handleLineItemChange = (rowId, field, value) => {
//     setLineItems((prev) =>
//       prev.map((row) => {
//         if (row.id !== rowId) return row;
//         const updated = { ...row, [field]: value };
//         // Auto-calculate rejected qty
//         if (field === "qty_received" || field === "accepted_qty") {
//           const received = parseInt(field === "qty_received" ? value : updated.qty_received) || 0;
//           const accepted = parseInt(field === "accepted_qty" ? value : updated.accepted_qty) || 0;
//           updated.rejected_qty = Math.max(0, received - accepted);
//         }
//         return updated;
//       })
//     );
//   };

//   // =========================================================================
//   // SERIAL / BATCH CALLBACKS — store locally on the line item
//   // =========================================================================
//   const handleSerialApply = (serials) => {
//     const rowId = stockDim.activeRow;
//     setLineItems((prev) =>
//       prev.map((row) => (row.id === rowId ? { ...row, serials } : row))
//     );
//   };

//   const handleBatchApply = (batches) => {
//     const rowId = stockDim.activeRow;
//     setLineItems((prev) =>
//       prev.map((row) => (row.id === rowId ? { ...row, batches } : row))
//     );
//   };

//   // =========================================================================
//   // BUILD PAYLOAD
//   // =========================================================================
//   const buildPayload = () => ({
//     po_reference:        parseInt(stockInput.po_reference_id),
//     received_date:       stockInput.received_date,
//     supplier_dn_no:      stockInput.supplier_dn_no,
//     supplier_invoice_no: stockInput.supplier_invoice_no,
//     received_by:         stockInput.received_by,
//     qc_done_by:          stockInput.qc_done_by,
//     status:              "Draft",
//     items: lineItems.map((row) => ({
//       product:       parseInt(row.product_id),
//       uom:           row.uom,
//       qty_ordered:   parseFloat(row.qty_ordered)  || 0,
//       qty_received:  parseFloat(row.qty_received) || 0,
//       accepted_qty:  parseFloat(row.accepted_qty) || 0,
//       rejected_qty:  parseFloat(row.rejected_qty) || 0,
//       qty_returned:  parseFloat(row.qty_returned) || 0,
//       stock_dim:     row.stock_dim || "None",
//       warehouse:     row.selected_warehouse || "",
//       unit_price:    parseFloat(row.unit_price)    || 0,
//       tax_rate:      parseFloat(row.tax_rate)      || 0,
//       discount_rate: parseFloat(row.discount_rate) || 0,
//     })),
//   });

//   // =========================================================================
//   // ✅ SAVE DRAFT
//   // Step 1: POST createStockReceipt → get GRN id + item ids
//   // Step 2: For each line item with serials → POST serial-numbers
//   // Step 3: For each line item with batches → POST batch-numbers
//   // =========================================================================
//   const handleDraftState = async (e) => {
//     e.preventDefault();

//     if (!stockInput.po_reference_id) {
//       toast.error("Please select a PO Reference");
//       return;
//     }
//     if (!stockInput.received_date) {
//       toast.error("Please select a Received Date");
//       return;
//     }
//     if (lineItems.length === 0) {
//       toast.error("No line items found");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const payload = buildPayload();
//       let grnId = createdGrnId;
//       let savedItems = [];

//       // ── Step 1: Create or Update GRN ──────────────────────────────────────
//       if (!grnId) {
//         console.log("Creating stock receipt...", payload);
//         const result = await stockReceiptApiProvider.createStockReceipt(payload);
//         console.log("Create result:", result);

//         if (!result) return;

//         grnId = result?.data?.id || result?.id;
//         savedItems = result?.data?.items || result?.items || [];
//         const grnIdDisplay = result?.data?.GRN_ID || result?.GRN_ID || "";

//         setCreatedGrnId(grnId);
//         if (grnIdDisplay) {
//           setStockInput((prev) => ({ ...prev, grn_id: grnIdDisplay }));
//         }
//         // Map backend item ids back to local lineItems
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
//         savedItems = result?.data?.items || result?.items || [];
//       }

//       setStockReceiptStatus("Draft");
//       toast.success("Stock Receipt saved as Draft!");

//       // ── Step 2: Post serial numbers for items with Stock Dim = Serial ──────
//       for (let i = 0; i < lineItems.length; i++) {
//         const row = lineItems[i];
//         const itemId = savedItems[i]?.id || row.backend_item_id;

//         if (row.stock_dim === "Serial" && row.serials?.length > 0 && itemId) {
//           console.log(`Posting serials for item ${itemId}:`, row.serials);
//           await stockReceiptApiProvider.addSerialNumbers(grnId, itemId, row.serials);
//         }
//       }

//       // ── Step 3: Post batch numbers for items with Stock Dim = Batch ────────
//       for (let i = 0; i < lineItems.length; i++) {
//         const row = lineItems[i];
//         const itemId = savedItems[i]?.id || row.backend_item_id;

//         if (row.stock_dim === "Batch" && row.batches?.length > 0 && itemId) {
//           console.log(`Posting batches for item ${itemId}:`, row.batches);
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

//   // =========================================================================
//   // SUBMIT GRN
//   // =========================================================================
//   const handleSubmittedState = async (e) => {
//     e.preventDefault();
//     if (!createdGrnId) {
//       toast.error("Please save as Draft first before submitting.");
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const result = await stockReceiptApiProvider.performAction(createdGrnId, "submit");
//       if (result) {
//         setStockReceiptStatus("Submitted");
//         toast.success("Stock Receipt submitted successfully");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // =========================================================================
//   // CANCEL GRN
//   // =========================================================================
//   const handleCancelledState = async (e) => {
//     e.preventDefault();
//     if (!createdGrnId) return;
//     setIsLoading(true);
//     try {
//       const result = await stockReceiptApiProvider.performAction(createdGrnId, "cancel");
//       if (result) {
//         setStockReceiptStatus("Cancelled");
//         toast.success("Stock Receipt cancelled");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // =========================================================================
//   // STATUS BADGE CLASS
//   // =========================================================================
//   const statusClass = {
//     Draft:     "cerateNewStock-Status-draft",
//     Submitted: "cerateNewStock-Status-Submitted",
//     Cancelled: "cerateNewStock-Status-Cancelled",
//     Returned:  "cerateNewStock-Status-Returned",
//   }[stockReceiptStatus] || "";

//   const isModalOpen = stockDim.serialBox || stockDim.batchBox || stockDim.batchSerialNO;

//   // =========================================================================
//   // RENDER
//   // =========================================================================
//   return (
//     <>
//       {/* ── Serial Number Modal ── */}
//       {stockDim.serialBox && (
//         <div className="cerateNewStock-btn">
//           <StockSerialNumber
//             setStockDim={setStockDim}
//             activeProduct={stockDim.activeProduct}
//             stockReceiptId={createdGrnId}
//             itemId={stockDim.activeItemId}
//             onApply={handleSerialApply}
//           />
//         </div>
//       )}

//       {/* ── Batch Number Modal ── */}
//       {stockDim.batchBox && (
//         <div className="cerateNewStock-btn">
//           <StockBatchNumber
//             setStockDim={setStockDim}
//             activeProduct={stockDim.activeProduct}
//             stockReceiptId={createdGrnId}
//             itemId={stockDim.activeItemId}
//             onApply={handleBatchApply}
//           />
//         </div>
//       )}

//       {/* ── Main Form ── */}
//       <div className={`cerateNewStock-container ${isModalOpen ? "cerateNewStock-blur" : ""}`}>
//         <form onSubmit={handleSubmittedState}>

//           {/* ── HEADER ── */}
//           <div className="cerateNewStock-head">
//             <nav>
//               <p>{stockReceiptStatus === "" ? "New Stock Receipt" : "Stock Receipt"}</p>
//               {stockReceiptStatus !== "" && (
//                 <h3 className={statusClass}>Status: {stockReceiptStatus}</h3>
//               )}
//             </nav>
//             <div>
//               <button
//                 type="button"
//                 className={
//                   stockReceiptStatus === "Submitted"
//                     ? "cerateNewStock-active-btn"
//                     : "cerateNewStock-inactive-btn"
//                 }
//                 disabled={stockBtn.stock_return}
//               >
//                 Stock Return
//               </button>
//               <nav
//                 className="cerateNewStock-close"
//                 onClick={(e) => { e.preventDefault(); prevpg(-1); }}
//               >
//                 <svg className="cerateNewStock-circle-x-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
//                   <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
//                 </svg>
//                 <p>Close</p>
//               </nav>
//             </div>
//           </div>

//           {/* ── GRN DETAILS ── */}
//           <div className="cerateNewStock-input-container">
//             <div className="cerateNewStock-input-box">
//               <label>GRN ID (Auto Generate)</label>
//               <input type="text" value={stockInput.grn_id} placeholder="Auto Generate" disabled />
//             </div>
//             <div className="cerateNewStock-input-box">
//               <label htmlFor="po_reference_id">
//                 PO Reference ID<sup>*</sup>
//               </label>
//               <select
//                 id="po_reference_id"
//                 value={stockInput.po_reference_id}
//                 onChange={handleStockInputChange}
//                 disabled={stockBtn.BtnAccess}
//               >
//                 <option value="">Select PO Reference</option>
//                 {poList.map((po) => (
//                   <option key={po.id} value={po.id}>
//                     {po.po_id || po.PO_ID || `PO-${po.id}`}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className="cerateNewStock-input-container">
//             <div className="cerateNewStock-input-box">
//               <label htmlFor="received_date">Received Date<sup>*</sup></label>
//               <input
//                 id="received_date"
//                 type="date"
//                 value={stockInput.received_date}
//                 onChange={handleStockInputChange}
//                 disabled={stockBtn.BtnAccess}
//               />
//             </div>
//             <div className="cerateNewStock-input-box">
//               <label htmlFor="supplier_name">Supplier Name<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 type="text"
//                 value={stockInput.supplier_name}
//                 onChange={handleStockInputChange}
//                 placeholder="Auto-filled from PO"
//                 disabled={stockBtn.BtnAccess}
//               />
//             </div>
//           </div>

//           <div className="cerateNewStock-input-container">
//             <div className="cerateNewStock-input-box">
//               <label htmlFor="supplier_dn_no">Supplier DN No.</label>
//               <input
//                 id="supplier_dn_no"
//                 type="text"
//                 value={stockInput.supplier_dn_no}
//                 onChange={handleStockInputChange}
//                 placeholder="Enter Supplier DN No."
//                 disabled={stockBtn.BtnAccess}
//               />
//             </div>
//             <div className="cerateNewStock-input-box">
//               <label htmlFor="supplier_invoice_no">Supplier Invoice No.</label>
//               <input
//                 id="supplier_invoice_no"
//                 type="text"
//                 value={stockInput.supplier_invoice_no}
//                 onChange={handleStockInputChange}
//                 placeholder="Enter Supplier Invoice No."
//                 disabled={stockBtn.BtnAccess}
//               />
//             </div>
//           </div>

//           <div className="cerateNewStock-input-container">
//             <div className="cerateNewStock-input-box">
//               <label htmlFor="received_by">Received By</label>
//               <input
//                 id="received_by"
//                 type="text"
//                 value={stockInput.received_by}
//                 onChange={handleStockInputChange}
//                 placeholder="Enter name"
//                 disabled={stockBtn.BtnAccess}
//               />
//             </div>
//             <div className="cerateNewStock-input-box">
//               <label htmlFor="qc_done_by">QC Done By</label>
//               <input
//                 id="qc_done_by"
//                 type="text"
//                 value={stockInput.qc_done_by}
//                 onChange={handleStockInputChange}
//                 placeholder="Enter name"
//                 disabled={stockBtn.BtnAccess}
//               />
//             </div>
//           </div>

//           {/* ── LINE ITEMS ── */}
//           <nav className="cerateNewStock-subtit">Line Items<sup>*</sup></nav>
//           <div className="cerateNewStock-table-container">
//             <table>
//               <thead className="cerateNewStock-table-head">
//                 <tr>
//                   <th>#</th>
//                   <th><pre>Product Name</pre></th>
//                   <th><pre>Product ID</pre></th>
//                   <th>UOM</th>
//                   <th><pre>Qty Ordered</pre></th>
//                   <th><pre>Qty Received</pre></th>
//                   <th><pre>Accepted Qty</pre></th>
//                   <th><pre>Rejected Qty</pre></th>
//                   <th><pre>Qty Returned</pre></th>
//                   <th><pre>Stock Dim.</pre></th>
//                   <th>Warehouse</th>
//                   <th><pre>Unit Price</pre></th>
//                   <th><pre>Tax (%)</pre></th>
//                   <th><pre>Discount (%)</pre></th>
//                   <th>Total</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody className="cerateNewStock-table-body">
//                 {lineItems.length === 0 ? (
//                   <tr>
//                     <td colSpan={16} style={{ textAlign: "center", color: "#999" }}>
//                       {stockInput.po_reference_id
//                         ? "Loading items..."
//                         : "Select a PO Reference to load items"}
//                     </td>
//                   </tr>
//                 ) : (
//                   lineItems.map((row, idx) => (
//                     <StockListItem
//                       key={row.id}
//                       index={idx + 1}
//                       rowData={row}
//                       BtnAccess={stockBtn.BtnAccess}
//                       onFieldChange={handleLineItemChange}
//                       // ── Opens serial/batch modal with product context ──
//                       onOpenDim={(dimType) => {
//                         setStockDim({
//                           serialBox:    dimType === "Serial",
//                           batchBox:     dimType === "Batch",
//                           batchSerialNO: false,
//                           activeRow:    row.id,
//                           activeProduct: {
//                             product_name: row.product_name,
//                             product_id:   row.product_id,
//                             uom:          row.uom,
//                             qty_received: row.qty_received,
//                             accepted_qty: row.accepted_qty,
//                           },
//                           activeItemId: row.backend_item_id,
//                         });
//                       }}
//                     />
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* ── COMMENTS / HISTORY / ATTACHMENTS ── */}
//           <div className="cerateNewStock-hub-container">
//             <div className="cerateNewStock-hub-head">
//               <p className={detail.comment ? "cerateNewStock-hub-head-bg-black" : "cerateNewStock-hub-head-tit"} onClick={() => setDetail({ history: false, attachment: false, comment: true })}>Comments</p>
//               <p className={detail.history ? "cerateNewStock-hub-head-bg-black" : "cerateNewStock-hub-head-tit"} onClick={() => setDetail({ history: true, attachment: false, comment: false })}>History</p>
//               <p className={detail.attachment ? "cerateNewStock-hub-head-bg-black" : "cerateNewStock-hub-head-tit"} onClick={() => setDetail({ history: false, attachment: true, comment: false })}>Attachments</p>
//             </div>
//             <div className="cerateNewStock-hub-body">
//               {detail.comment   && <StockComment />}
//               {detail.history   && <StockHistory />}
//               {detail.attachment && <StockAttachment inputDisable={stockBtn.BtnAccess} />}
//             </div>
//           </div>

//           {/* ── ACTION BUTTONS ── */}
//           <div className="cerateNewStock-btn-container">
//             <button
//               type="button"
//               onClick={handleCancelledState}
//               className={
//                 ["Submitted", "Cancelled"].includes(stockReceiptStatus)
//                   ? "cerateNewStock-order-active-btn"
//                   : "cerateNewStock-inactive-btn"
//               }
//               disabled={stockBtn.cancal_grn}
//             >
//               {stockReceiptStatus === "Cancelled" ? "Cancelled GRN" : "Cancel GRN"}
//             </button>

//             <nav>
//               <button
//                 type="button"
//                 className="cerateNewStock-cancel-btn"
//                 onClick={(e) => { e.preventDefault(); prevpg(-1); }}
//               >
//                 Cancel
//               </button>

//               {/* ✅ type="button" — Save Draft triggers API */}
//               <button
//                 type="button"
//                 onClick={handleDraftState}
//                 className={
//                   ["", "Draft"].includes(stockReceiptStatus)
//                     ? "cerateNewStock-active-btn"
//                     : "cerateNewStock-completed-btn"
//                 }
//                 disabled={stockBtn.draft || isLoading}
//               >
//                 {isLoading ? "Saving..." : "Save Draft"}
//               </button>

//               {/* ✅ type="submit" — Submit triggers form onSubmit */}
//               <button
//                 type="submit"
//                 className={
//                   ["", "Draft"].includes(stockReceiptStatus)
//                     ? "cerateNewStock-active-btn"
//                     : "cerateNewStock-completed-btn"
//                 }
//                 disabled={stockBtn.submit || isLoading}
//               >
//                 {stockReceiptStatus === "Submitted" ? "Submitted" : "Submit"}
//               </button>

//               {/* PDF icon */}
//               <svg
//                 className={!stockBtn.pdf ? "cerateNewStock-pdf-mail-activelogo" : "cerateNewStock-pdf-mail-futurelogo"}
//                 style={{ cursor: !stockBtn.pdf ? "pointer" : "default" }}
//                 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 24" fill="none"
//               >
//                 <path fillRule="evenodd" clipRule="evenodd" d="M0.600098 2.4C0.600098 1.76348 0.852954 1.15303 1.30304 0.702944C1.75313 0.252856 2.36358 0 3.0001 0L16.1313 0L21.4001 5.2688V21.6C21.4001 22.2365 21.1472 22.847 20.6972 23.2971C20.2471 23.7471 19.6366 24 19.0001 24H3.0001C2.36358 24 1.75313 23.7471 1.30304 23.2971C0.852954 22.847 0.600098 22.2365 0.600098 21.6V2.4ZM4.6001 9.6H2.2001V17.6H3.8001V14.4H4.6001C5.23662 14.4 5.84707 14.1471 6.29715 13.6971C6.74724 13.247 7.0001 12.6365 7.0001 12C7.0001 11.3635 6.74724 10.753 6.29715 10.3029C5.84707 9.85286 5.23662 9.6 4.6001 9.6ZM11.0001 9.6H8.6001V17.6H11.0001C11.6366 17.6 12.2471 17.3471 12.6972 16.8971C13.1472 16.447 13.4001 15.8365 13.4001 15.2V12C13.4001 11.3635 13.1472 10.753 12.6972 10.3029C12.2471 9.85286 11.6366 9.6 11.0001 9.6ZM15.0001 17.6V9.6H19.8001V11.2H16.6001V12.8H18.2001V14.4H16.6001V17.6H15.0001Z" />
//               </svg>

//               {/* Mail icon */}
//               <svg
//                 className={!stockBtn.mail ? "cerateNewStock-pdf-mail-activelogo" : "cerateNewStock-pdf-mail-futurelogo"}
//                 style={{ cursor: !stockBtn.mail ? "pointer" : "default" }}
//                 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 16" fill="none"
//               >
//                 <path d="M2 16C1.45 16 0.979333 15.8043 0.588 15.413C0.196667 15.0217 0.000666667 14.5507 0 14V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196666 1.45067 0.000666667 2 0H18C18.55 0 19.021 0.196 19.413 0.588C19.805 0.98 20.0007 1.45067 20 2V14C20 14.55 19.8043 15.021 19.413 15.413C19.0217 15.805 18.5507 16.0007 18 16H2ZM10 8.825C10.0833 8.825 10.171 8.81233 10.263 8.787C10.355 8.76167 10.4423 8.72433 10.525 8.675L17.6 4.25C17.7333 4.16667 17.8333 4.06267 17.9 3.938C17.9667 3.81333 18 3.67567 18 3.525C18 3.19167 17.8583 2.94167 17.575 2.775C17.2917 2.60833 17 2.61667 16.7 2.8L10 7L3.3 2.8C3 2.61667 2.70833 2.61267 2.425 2.788C2.14167 2.96333 2 3.209 2 3.525C2 3.69167 2.03333 3.83767 2.1 3.963C2.16667 4.08833 2.26667 4.184 2.4 4.25L9.475 8.675C9.55833 8.725 9.646 8.76267 9.738 8.788C9.83 8.81333 9.91733 8.82567 10 8.825Z" />
//               </svg>
//             </nav>
//           </div>

//         </form>
//       </div>
//     </>
//   );
// }
import React, { useEffect, useState } from "react";
import "./createNewStockReceipt.css";
import { useNavigate } from "react-router-dom";
import StockListItem from "./stockListItem";
import StockComment from "./stockComment";
import StockHistory from "./stockHistory";
import StockAttachment from "./stockAttachment";
import StockSerialNumber from "./stock-serial-num/stockSerialNumber";
import StockBatchNumber from "./stock-batch-num/stockBatchNumber";
import { toast } from "react-toastify";
import stockReceiptApiProvider from "../../../network/stockReceipt-api-provider";
import purchaseOrderApiProvider from "../../../network/purchaseOrder-api-provider";

export default function CreateNewStockReceipt({ setCurrentPage }) {
  const prevpg = useNavigate();

  // ── Core state ─────────────────────────────────────────────────────────────
  const [stockReceiptStatus, setStockReceiptStatus] = useState("");
  const [createdGrnId, setCreatedGrnId]             = useState(null);
  const [isLoading, setIsLoading]                   = useState(false);

  // ── Reference data ─────────────────────────────────────────────────────────
  const [poList, setPoList]     = useState([]);
  const [userList, setUserList] = useState([]); // ✅ for received_by / qc_done_by dropdowns

  // ── Line items state ───────────────────────────────────────────────────────
  const [lineItems, setLineItems] = useState([]);

  // ── Header form ────────────────────────────────────────────────────────────
  const [stockInput, setStockInput] = useState({
    grn_id:              "",
    po_reference_id:     "",
    received_date:       "",
    supplier_name:       "",
    supplier_dn_no:      "",
    supplier_invoice_no: "",
    received_by:         "",  // ✅ will store integer user id
    qc_done_by:          "",  // ✅ will store integer user id
  });

  // ── Tab state ──────────────────────────────────────────────────────────────
  const [detail, setDetail] = useState({
    comment: true, history: false, attachment: false,
  });

  // ── Button control ─────────────────────────────────────────────────────────
  const [stockBtn, setStockBtn] = useState({
    BtnAccess:    false,
    cancal_grn:   true,
    draft:        false,
    submit:       false,
    pdf:          true,
    mail:         true,
    stock_return: true,
  });

  // ── Serial / Batch modal state ─────────────────────────────────────────────
  const [stockDim, setStockDim] = useState({
    serialBox:     false,
    batchBox:      false,
    batchSerialNO: false,
    activeRow:     null,
    activeProduct: null,
    activeItemId:  null,
  });

  // =========================================================================
  // LOAD PO LIST + USER LIST ON MOUNT
  // =========================================================================
  useEffect(() => {
    const loadPos = async () => {
      try {
        const res = await purchaseOrderApiProvider.fetchPurchaseOrders(1, "");
        const available = (res?.results || res?.data || []).filter((po) =>
          ["Submitted", "Partially Received"].includes(po.status)
        );
        setPoList(available);
      } catch (err) {
        console.error("Failed to load PO list:", err);
      }
    };

    // ✅ Fetch users for received_by / qc_done_by dropdowns
    const loadUsers = async () => {
      try {
        const res = await purchaseOrderApiProvider.fetchUsers(); // adjust to your actual API method
        setUserList(res?.results || res?.data || res || []);
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    };

    loadPos();
    loadUsers();
  }, []);

  // =========================================================================
  // WHEN PO REFERENCE CHANGES — fetch PO items & auto-fill supplier
  // =========================================================================
  useEffect(() => {
    const fetchPoItems = async () => {
      if (!stockInput.po_reference_id) {
        setLineItems([]);
        setStockInput((prev) => ({ ...prev, supplier_name: "" }));
        return;
      }

      try {
        const po = await purchaseOrderApiProvider.fetchSinglePurchaseOrder(
          stockInput.po_reference_id
        );
        if (!po) return;

        setStockInput((prev) => ({
          ...prev,
          supplier_name: po.supplier_name || "",
        }));

        const rows = (po.items || po.line_items || []).map((item, idx) => ({
          id:                 idx,
          backend_item_id:    item.id || null,
          product_id:         item.product_id || item.product || "",
          product_name:       item.product_name || item.name || "",
          uom:                item.uom || "",
          qty_ordered:        item.qty_ordered || 0,
          qty_received:       item.qty_received || item.qty_ordered || 0,
          accepted_qty:       item.accepted_qty || item.qty_ordered || 0,
          rejected_qty:       item.rejected_qty || 0,
          qty_returned:       item.qty_returned || 0,
          stock_dim:          item.stock_dim || "None",
          warehouse:          item.warehouse_options || [],
          selected_warehouse: item.warehouse || "",
          unit_price:         item.unit_price || 0,
          tax_rate:           item.tax_rate || 0,
          discount_rate:      item.discount_rate || 0,
          serials:            [],
          batches:            [],
        }));
        setLineItems(rows);
      } catch (err) {
        console.error("Failed to fetch PO details:", err);
      }
    };
    fetchPoItems();
  }, [stockInput.po_reference_id]);

  // =========================================================================
  // BUTTON ACCESS CONTROL
  // =========================================================================
  useEffect(() => {
    switch (stockReceiptStatus) {
      case "":
        setStockBtn({ BtnAccess: false, cancal_grn: true,  draft: false, submit: false, pdf: true,  mail: true,  stock_return: true  });
        break;
      case "Draft":
        setStockBtn({ BtnAccess: false, cancal_grn: true,  draft: false, submit: false, pdf: false, mail: false, stock_return: true  });
        break;
      case "Submitted":
        setStockBtn({ BtnAccess: true,  cancal_grn: false, draft: true,  submit: true,  pdf: false, mail: false, stock_return: false });
        break;
      case "Cancelled":
      case "Returned":
        setStockBtn({ BtnAccess: true,  cancal_grn: true,  draft: true,  submit: true,  pdf: false, mail: false, stock_return: true  });
        break;
      default:
        break;
    }
  }, [stockReceiptStatus]);

  // =========================================================================
  // FORM INPUT HANDLER
  // =========================================================================
  const handleStockInputChange = (e) => {
    setStockInput((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  // =========================================================================
  // LINE ITEM CHANGE HANDLER
  // =========================================================================
  const handleLineItemChange = (rowId, field, value) => {
    setLineItems((prev) =>
      prev.map((row) => {
        if (row.id !== rowId) return row;
        const updated = { ...row, [field]: value };
        if (field === "qty_received" || field === "accepted_qty") {
          const received = parseInt(field === "qty_received" ? value : updated.qty_received) || 0;
          const accepted = parseInt(field === "accepted_qty" ? value : updated.accepted_qty) || 0;
          updated.rejected_qty = Math.max(0, received - accepted);
        }
        return updated;
      })
    );
  };

  // =========================================================================
  // SERIAL / BATCH CALLBACKS
  // =========================================================================
  const handleSerialApply = (serials) => {
    const rowId = stockDim.activeRow;
    setLineItems((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, serials } : row))
    );
  };

  const handleBatchApply = (batches) => {
    const rowId = stockDim.activeRow;
    setLineItems((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, batches } : row))
    );
  };

  // =========================================================================
  // BUILD PAYLOAD — ✅ received_by & qc_done_by sent as integers
  // =========================================================================
 const buildPayload = () => ({
  po_reference:        parseInt(stockInput.po_reference_id),
  received_date:       stockInput.received_date,
  supplier_dn_no:      stockInput.supplier_dn_no,
  supplier_invoice_no: stockInput.supplier_invoice_no,
  received_by:         stockInput.received_by ? Number(stockInput.received_by) : null,  // ✅
  qc_done_by:          stockInput.qc_done_by  ? Number(stockInput.qc_done_by)  : null,  // ✅
  status:              "Draft",
    items: lineItems.map((row) => ({
      product:       parseInt(row.product_id),
      uom:           row.uom,
      qty_ordered:   parseFloat(row.qty_ordered)  || 0,
      qty_received:  parseFloat(row.qty_received) || 0,
      accepted_qty:  parseFloat(row.accepted_qty) || 0,
      rejected_qty:  parseFloat(row.rejected_qty) || 0,
      qty_returned:  parseFloat(row.qty_returned) || 0,
      stock_dim:     row.stock_dim || "None",
      warehouse:     parseInt(row.selected_warehouse) || null, // ✅ integer FK
      unit_price:    parseFloat(row.unit_price)    || 0,
      tax_rate:      parseFloat(row.tax_rate)      || 0,
      discount_rate: parseFloat(row.discount_rate) || 0,
    })),
  });

  // =========================================================================
  // SAVE DRAFT
  // =========================================================================
  const handleDraftState = async (e) => {
    e.preventDefault();

    if (!stockInput.po_reference_id) {
      toast.error("Please select a PO Reference");
      return;
    }
    if (!stockInput.received_date) {
      toast.error("Please select a Received Date");
      return;
    }
    if (lineItems.length === 0) {
      toast.error("No line items found");
      return;
    }

    setIsLoading(true);
    try {
      const payload = buildPayload();
      let grnId     = createdGrnId;
      let savedItems = [];

      // ── Create or Update GRN ──────────────────────────────────────────────
      if (!grnId) {
        const result = await stockReceiptApiProvider.createStockReceipt(payload);
        if (!result) return;

        grnId      = result?.data?.id    || result?.id;
        savedItems = result?.data?.items || result?.items || [];
        const grnIdDisplay = result?.data?.GRN_ID || result?.GRN_ID || "";

        setCreatedGrnId(grnId);
        if (grnIdDisplay) {
          setStockInput((prev) => ({ ...prev, grn_id: grnIdDisplay }));
        }
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
        savedItems = result?.data?.items || result?.items || [];
      }

      setStockReceiptStatus("Draft");
      toast.success("Stock Receipt saved as Draft!");

      // ── Post serial numbers ───────────────────────────────────────────────
      for (let i = 0; i < lineItems.length; i++) {
        const row    = lineItems[i];
        const itemId = savedItems[i]?.id || row.backend_item_id;
        if (row.stock_dim === "Serial" && row.serials?.length > 0 && itemId) {
          await stockReceiptApiProvider.addSerialNumbers(grnId, itemId, row.serials);
        }
      }

      // ── Post batch numbers ────────────────────────────────────────────────
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

  // =========================================================================
  // SUBMIT GRN
  // =========================================================================
  const handleSubmittedState = async (e) => {
    e.preventDefault();
    if (!createdGrnId) {
      toast.error("Please save as Draft first before submitting.");
      return;
    }
    setIsLoading(true);
    try {
      const result = await stockReceiptApiProvider.performAction(createdGrnId, "submit");
      if (result) {
        setStockReceiptStatus("Submitted");
        toast.success("Stock Receipt submitted successfully");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================================
  // CANCEL GRN
  // =========================================================================
  const handleCancelledState = async (e) => {
    e.preventDefault();
    if (!createdGrnId) return;
    setIsLoading(true);
    try {
      const result = await stockReceiptApiProvider.performAction(createdGrnId, "cancel");
      if (result) {
        setStockReceiptStatus("Cancelled");
        toast.success("Stock Receipt cancelled");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================================
  // STATUS BADGE CLASS
  // =========================================================================
  const statusClass = {
    Draft:     "cerateNewStock-Status-draft",
    Submitted: "cerateNewStock-Status-Submitted",
    Cancelled: "cerateNewStock-Status-Cancelled",
    Returned:  "cerateNewStock-Status-Returned",
  }[stockReceiptStatus] || "";

  const isModalOpen = stockDim.serialBox || stockDim.batchBox || stockDim.batchSerialNO;

  // =========================================================================
  // RENDER
  // =========================================================================
  return (
    <>
      {/* ── Serial Number Modal ── */}
      {stockDim.serialBox && (
        <div className="cerateNewStock-btn">
          <StockSerialNumber
            setStockDim={setStockDim}
            activeProduct={stockDim.activeProduct}
            stockReceiptId={createdGrnId}
            itemId={stockDim.activeItemId}
            onApply={handleSerialApply}
          />
        </div>
      )}

      {/* ── Batch Number Modal ── */}
      {stockDim.batchBox && (
        <div className="cerateNewStock-btn">
          <StockBatchNumber
            setStockDim={setStockDim}
            activeProduct={stockDim.activeProduct}
            stockReceiptId={createdGrnId}
            itemId={stockDim.activeItemId}
            onApply={handleBatchApply}
          />
        </div>
      )}

      {/* ── Main Form ── */}
      <div className={`cerateNewStock-container ${isModalOpen ? "cerateNewStock-blur" : ""}`}>
        <form onSubmit={handleSubmittedState}>

          {/* ── HEADER ── */}
          <div className="cerateNewStock-head">
            <nav>
              <p>{stockReceiptStatus === "" ? "New Stock Receipt" : "Stock Receipt"}</p>
              {stockReceiptStatus !== "" && (
                <h3 className={statusClass}>Status: {stockReceiptStatus}</h3>
              )}
            </nav>
            <div>
              <button
                type="button"
                className={
                  stockReceiptStatus === "Submitted"
                    ? "cerateNewStock-active-btn"
                    : "cerateNewStock-inactive-btn"
                }
                disabled={stockBtn.stock_return}
              >
                Stock Return
              </button>
              <nav
                className="cerateNewStock-close"
                onClick={(e) => { e.preventDefault(); prevpg(-1); }}
              >
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
              <input
                type="text"
                value={stockInput.grn_id}
                placeholder="Auto Generate"
                disabled
              />
            </div>
            <div className="cerateNewStock-input-box">
              <label htmlFor="po_reference_id">
                PO Reference ID<sup>*</sup>
              </label>
              <select
                id="po_reference_id"
                value={stockInput.po_reference_id}
                onChange={handleStockInputChange}
                disabled={stockBtn.BtnAccess}
              >
                <option value="">Select PO Reference</option>
                {poList.map((po) => (
                  <option key={po.id} value={po.id}>
                    {po.po_id || po.PO_ID || `PO-${po.id}`}
                  </option>
                ))}
              </select>
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
              <label htmlFor="supplier_name">Supplier Name<sup>*</sup></label>
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

          {/* ✅ received_by and qc_done_by as user dropdowns (integer IDs) */}
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
                {userList.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name || u.username || u.email}
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
                {userList.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name || u.username || u.email}
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
                    <td colSpan={16} style={{ textAlign: "center", color: "#999" }}>
                      {stockInput.po_reference_id
                        ? "Loading items..."
                        : "Select a PO Reference to load items"}
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
                          batchSerialNO: false,
                          activeRow:     row.id,
                          activeProduct: {
                            product_name: row.product_name,
                            product_id:   row.product_id,
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
              <p
                className={detail.comment ? "cerateNewStock-hub-head-bg-black" : "cerateNewStock-hub-head-tit"}
                onClick={() => setDetail({ history: false, attachment: false, comment: true })}
              >
                Comments
              </p>
              <p
                className={detail.history ? "cerateNewStock-hub-head-bg-black" : "cerateNewStock-hub-head-tit"}
                onClick={() => setDetail({ history: true, attachment: false, comment: false })}
              >
                History
              </p>
              <p
                className={detail.attachment ? "cerateNewStock-hub-head-bg-black" : "cerateNewStock-hub-head-tit"}
                onClick={() => setDetail({ history: false, attachment: true, comment: false })}
              >
                Attachments
              </p>
            </div>
            <div className="cerateNewStock-hub-body">
              {/* ✅ Pass createdGrnId to all three child components */}
              {detail.comment    && <StockComment    stockReceiptId={createdGrnId} />}
              {detail.history    && <StockHistory    stockReceiptId={createdGrnId} />}
              {detail.attachment && <StockAttachment stockReceiptId={createdGrnId} inputDisable={stockBtn.BtnAccess} />}
            </div>
          </div>

          {/* ── ACTION BUTTONS ── */}
          <div className="cerateNewStock-btn-container">
            <button
              type="button"
              onClick={handleCancelledState}
              className={
                ["Submitted", "Cancelled"].includes(stockReceiptStatus)
                  ? "cerateNewStock-order-active-btn"
                  : "cerateNewStock-inactive-btn"
              }
              disabled={stockBtn.cancal_grn}
            >
              {stockReceiptStatus === "Cancelled" ? "Cancelled GRN" : "Cancel GRN"}
            </button>

            <nav>
              <button
                type="button"
                className="cerateNewStock-cancel-btn"
                onClick={(e) => { e.preventDefault(); prevpg(-1); }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDraftState}
                className={
                  ["", "Draft"].includes(stockReceiptStatus)
                    ? "cerateNewStock-active-btn"
                    : "cerateNewStock-completed-btn"
                }
                disabled={stockBtn.draft || isLoading}
              >
                {isLoading ? "Saving..." : "Save Draft"}
              </button>

              <button
                type="submit"
                className={
                  ["", "Draft"].includes(stockReceiptStatus)
                    ? "cerateNewStock-active-btn"
                    : "cerateNewStock-completed-btn"
                }
                disabled={stockBtn.submit || isLoading}
              >
                {stockReceiptStatus === "Submitted" ? "Submitted" : "Submit"}
              </button>

              {/* PDF icon */}
              <svg
                className={!stockBtn.pdf ? "cerateNewStock-pdf-mail-activelogo" : "cerateNewStock-pdf-mail-futurelogo"}
                style={{ cursor: !stockBtn.pdf ? "pointer" : "default" }}
                onClick={() => !stockBtn.pdf && stockReceiptApiProvider.generatePdf(createdGrnId)}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 22 24"
                fill="none"
              >
                <path fillRule="evenodd" clipRule="evenodd" d="M0.600098 2.4C0.600098 1.76348 0.852954 1.15303 1.30304 0.702944C1.75313 0.252856 2.36358 0 3.0001 0L16.1313 0L21.4001 5.2688V21.6C21.4001 22.2365 21.1472 22.847 20.6972 23.2971C20.2471 23.7471 19.6366 24 19.0001 24H3.0001C2.36358 24 1.75313 23.7471 1.30304 23.2971C0.852954 22.847 0.600098 22.2365 0.600098 21.6V2.4ZM4.6001 9.6H2.2001V17.6H3.8001V14.4H4.6001C5.23662 14.4 5.84707 14.1471 6.29715 13.6971C6.74724 13.247 7.0001 12.6365 7.0001 12C7.0001 11.3635 6.74724 10.753 6.29715 10.3029C5.84707 9.85286 5.23662 9.6 4.6001 9.6ZM11.0001 9.6H8.6001V17.6H11.0001C11.6366 17.6 12.2471 17.3471 12.6972 16.8971C13.1472 16.447 13.4001 15.8365 13.4001 15.2V12C13.4001 11.3635 13.1472 10.753 12.6972 10.3029C12.2471 9.85286 11.6366 9.6 11.0001 9.6ZM15.0001 17.6V9.6H19.8001V11.2H16.6001V12.8H18.2001V14.4H16.6001V17.6H15.0001Z" />
              </svg>

              {/* Mail icon */}
              <svg
                className={!stockBtn.mail ? "cerateNewStock-pdf-mail-activelogo" : "cerateNewStock-pdf-mail-futurelogo"}
                style={{ cursor: !stockBtn.mail ? "pointer" : "default" }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 16"
                fill="none"
              >
                <path d="M2 16C1.45 16 0.979333 15.8043 0.588 15.413C0.196667 15.0217 0.000666667 14.5507 0 14V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196666 1.45067 0.000666667 2 0H18C18.55 0 19.021 0.196 19.413 0.588C19.805 0.98 20.0007 1.45067 20 2V14C20 14.55 19.8043 15.021 19.413 15.413C19.0217 15.805 18.5507 16.0007 18 16H2ZM10 8.825C10.0833 8.825 10.171 8.81233 10.263 8.787C10.355 8.76167 10.4423 8.72433 10.525 8.675L17.6 4.25C17.7333 4.16667 17.8333 4.06267 17.9 3.938C17.9667 3.81333 18 3.67567 18 3.525C18 3.19167 17.8583 2.94167 17.575 2.775C17.2917 2.60833 17 2.61667 16.7 2.8L10 7L3.3 2.8C3 2.61667 2.70833 2.61267 2.425 2.788C2.14167 2.96333 2 3.209 2 3.525C2 3.69167 2.03333 3.83767 2.1 3.963C2.16667 4.08833 2.26667 4.184 2.4 4.25L9.475 8.675C9.55833 8.725 9.646 8.76267 9.738 8.788C9.83 8.81333 9.91733 8.82567 10 8.825Z" />
              </svg>
            </nav>
          </div>

        </form>
      </div>
    </>
  );
}