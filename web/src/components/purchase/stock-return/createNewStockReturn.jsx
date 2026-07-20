// // // import React, { useState, useEffect } from "react";
// // // import "./createNewStockReturn.css";
// // // import { useNavigate } from "react-router-dom";
// // // import ReturnListItem from "./returnListItem";
// // // import ReturnComment from "./returnComment";
// // // import ReturnHistory from "./returnHistory";
// // // import ReturnAttachment from "./returnAttachment";
// // // import { toast } from "react-toastify";

// // // export default function createNewStockReturn() {
// // //   const [ReturnStatus, setReturnStatus] = useState("");
// // //   const prevpg = useNavigate();

// // //   const [detail, setDetail] = useState({
// // //     comment: true,
// // //     history: false,
// // //     attachment: false,
// // //   });

// // //   const [numOfReturnList, setnumOfReturnList] = useState(1);
// // //   const [returnListData, setReturnListData] = useState([{ unique_key: 0 }]);

// // //   // status
// // //   const [returnBtn, setReturnBtn] = useState({
// // //     buttonAcs: true,
// // //     cancel_order: true,
// // //     draft: false,
// // //     submit: false,
// // //     pdf: true,
// // //     mail: true,
// // //   });

// // //   useEffect(() => {
// // //     if (ReturnStatus === "") {
// // //       setReturnBtn((prev) => ({
// // //         ...prev,
// // //         buttonAcs: false,
// // //         cancel_order: true,
// // //         draft: false,
// // //         submit: false,
// // //         pdf: true,
// // //         mail: true,
// // //       }));
// // //     }
// // //     switch (ReturnStatus) {
// // //       case "Draft":
// // //         setReturnBtn((prev) => ({
// // //           ...prev,
// // //           buttonAcs: false,
// // //           cancel_order: true,
// // //           draft: false,
// // //           submit: false,
// // //           pdf: false,
// // //           mail: false,
// // //         }));
// // //         break;
// // //       case "Submitted":
// // //         setReturnBtn((prev) => ({
// // //           ...prev,
// // //           buttonAcs: true,
// // //           cancel_order: false,
// // //           draft: true,
// // //           submit: true,
// // //           pdf: false,
// // //           mail: false,
// // //         }));
// // //         break;
// // //       case "Submitted(PR)":
// // //         setReturnBtn((prev) => ({
// // //           ...prev,
// // //           buttonAcs: true,
// // //           cancel_order: false,
// // //           draft: true,
// // //           submit: true,
// // //           pdf: false,
// // //           mail: false,
// // //         }));
// // //         break;
// // //       case "Cancelled":
// // //         setReturnBtn((prev) => ({
// // //           ...prev,
// // //           buttonAcs: true,
// // //           cancel_order: true,
// // //           draft: true,
// // //           submit: true,
// // //           pdf: false,
// // //           mail: false,
// // //         }));
// // //         break;
// // //       default:
// // //         setReturnBtn((prev) => ({
// // //           ...prev,
// // //           BtnAccess: false,
// // //         }));
// // //     }
// // //   }, [ReturnStatus]);

// // //   const handleSaveDraftState = (e) => {
// // //     e.preventDefault();
// // //     setReturnStatus("Draft");
// // //     toast.success("Stock Return Item in Save Draft State");
// // //   };
// // //   const handleSubmittedState = (e) => {
// // //     e.preventDefault();
// // //     setReturnStatus("Submitted");
// // //     toast.success("Stock Return Item in Send State");
// // //   };
// // //   const handleCancelledState = (e) => {
// // //     e.preventDefault();
// // //     setReturnStatus("Cancelled");
// // //     toast.success("Stock Return Item in Cancelled State");
// // //   };
// // //   return (
// // //     <>
// // //       <div className="createNewReturn-container">
// // //         <form onSubmit={handleSubmittedState}>
// // //           <div className="createNewReturn-head">
// // //             <nav>
// // //               <p>{ReturnStatus === "" ? "New Stock Return" : "Stock Return"}</p>
// // //               {ReturnStatus !== "" && (
// // //                 <h3
// // //                   className={
// // //                     ReturnStatus === "Draft"
// // //                       ? "createNewReturn-Status-draft"
// // //                       : ReturnStatus === "Submitted"
// // //                       ? "createNewReturn-Status-Submitted"
// // //                       : ReturnStatus === "Cancelled"
// // //                       ? "createNewReturn-Status-Cancelled"
// // //                       : ReturnStatus === "Submitted(PR)"
// // //                       ? "createNewReturn-Status-SubmittedPR"
// // //                       : "createNewReturn-Status-template"
// // //                   }
// // //                 >
// // //                   Status: {ReturnStatus}
// // //                 </h3>
// // //               )}
// // //             </nav>
// // //             <div>
// // //               <nav
// // //                 className="createNewReturn-close"
// // //                 onClick={(e) => {
// // //                   e.preventDefault();
// // //                   prevpg(-1);
// // //                 }}
// // //               >
// // //                 <svg
// // //                   className="createNewReturn-circle-x-logo"
// // //                   xmlns="http://www.w3.org/2000/svg"
// // //                   viewBox="0 0 512 512"
// // //                 >
// // //                   <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
// // //                 </svg>
// // //                 <p>Close</p>
// // //               </nav>
// // //             </div>
// // //           </div>
// // //           <div className="createNewReturn-input-container">
// // //             <div className="createNewReturn-input-box">
// // //               <label htmlFor="srn_id">SRN ID {`(Auto Generate)`}</label>
// // //               <input
// // //                 id="srn_id"
// // //                 type="text"
// // //                 placeholder="Auto Generate"
// // //                 disabled
// // //               />
// // //             </div>
// // //             <div className="createNewReturn-input-box">
// // //               <label htmlFor="grn_referance_id">
// // //                 GRN Reference ID<sup>*</sup>
// // //               </label>
// // //               <select
// // //                 name=""
// // //                 id="grn_referance_id"
// // //                 required
// // //                 disabled={returnBtn.buttonAcs}
// // //               >
// // //                 <option value="">Select Purchase Order Ref</option>
// // //                 <option value="PO-0001">PO-0001</option>
// // //                 <option value="PO-0002">PO-0002</option>
// // //               </select>
// // //             </div>
// // //           </div>
// // //           <div className="createNewReturn-input-container">
// // //             <div className="createNewReturn-input-box">
// // //               <label htmlFor="po_referance_id">
// // //                 PO Reference ID<sup>*</sup>
// // //               </label>
// // //               <select
// // //                 name=""
// // //                 id="po_referance_id"
// // //                 required
// // //                 disabled={returnBtn.buttonAcs}
// // //               >
// // //                 <option value="">Select PO Ref ID</option>
// // //                 <option value="PO-0001">PO-0001</option>
// // //                 <option value="PO-0002">PO-0002</option>
// // //               </select>
// // //             </div>
// // //             <div className="createNewReturn-input-box">
// // //               <label htmlFor="received_date">Received Date</label>
// // //               <input
// // //                 id="received_date"
// // //                 type="date"
// // //                 disabled={returnBtn.buttonAcs}
// // //               />
// // //             </div>
// // //           </div>
// // //           <div className="createNewReturn-input-container">
// // //             <div className="createNewReturn-input-box">
// // //               <label htmlFor="return_date">
// // //                 Return Date<sup>*</sup>
// // //               </label>
// // //               <input
// // //                 id="return_date"
// // //                 type="date"
// // //                 required
// // //                 disabled={returnBtn.buttonAcs}
// // //               />
// // //             </div>
// // //             <div className="createNewReturn-input-box">
// // //               <label htmlFor="return_initiated_by">Return Initiated By</label>
// // //               <select
// // //                 name=""
// // //                 id="return_initiated_by"
// // //                 disabled={returnBtn.buttonAcs}
// // //               >
// // //                 <option value="">Select PO Ref ID</option>
// // //                 <option value="PO-0001">PO-0001</option>
// // //                 <option value="PO-0002">PO-0002</option>
// // //               </select>
// // //             </div>
// // //           </div>
// // //           <div className="createNewReturn-input-container">
// // //             <div className="createNewReturn-input-box">
// // //               <label htmlFor="supplier_name">
// // //                 Supplier Name<sup>*</sup>
// // //               </label>
// // //               <select
// // //                 name=""
// // //                 id="supplier_name"
// // //                 required
// // //                 disabled={returnBtn.buttonAcs}
// // //               >
// // //                 <option value="">Select Supplier Name</option>
// // //                 <option value="Mandy">Mandy</option>
// // //                 <option value="Sans">Sans</option>
// // //               </select>
// // //             </div>
// // //           </div>
// // //           <nav className="createNewReturn-subtit">
// // //             Line Items<sup>*</sup>
// // //           </nav>
// // //           <div className="createNewReturn-table-container">
// // //             <table>
// // //               <thead className="createNewReturn-table-head">
// // //                 <tr>
// // //                   <th>#</th>
// // //                   <th>
// // //                     <pre>Product Name</pre>
// // //                   </th>
// // //                   <th>
// // //                     <pre>Product ID</pre>
// // //                   </th>
// // //                   <th>UOM</th>
// // //                   <th>
// // //                     <pre>Qty Ordered</pre>
// // //                   </th>
// // //                   <th>
// // //                     <pre>Rejected Qty</pre>
// // //                   </th>
// // //                   <th>
// // //                     <pre>Return Qty</pre>
// // //                   </th>
// // //                   <th>
// // //                     <pre>Serial No(s)</pre>
// // //                   </th>
// // //                   <th>
// // //                     <pre>Return Reason</pre>
// // //                   </th>
// // //                   <th>
// // //                     <pre>Unit Price</pre>
// // //                   </th>
// // //                   <th>
// // //                     <pre>Tax (%)</pre>
// // //                   </th>
// // //                   <th>
// // //                     <pre>Discount (%)</pre>
// // //                   </th>
// // //                   <th>Total</th>
// // //                   <th>Action</th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody className="createNewReturn-table-body">
// // //                 {[...Array(numOfReturnList)].map((ele, ind) => (
// // //                   <ReturnListItem key={ind} buttonAcs={returnBtn.buttonAcs} />
// // //                 ))}
// // //                 <tr>
// // //                   <td></td>
// // //                   <td>
// // //                     <button
// // //                       onClick={(e) => {
// // //                         e.preventDefault();
// // //                         setReturnListData((prev) => {
// // //                           return [...prev, { unique_key: numOfReturnList }];
// // //                         });
// // //                         setnumOfReturnList((prev) => ++prev);
// // //                       }}
// // //                     >
// // //                       + Add Item
// // //                     </button>
// // //                   </td>
// // //                 </tr>
// // //               </tbody>
// // //             </table>
// // //           </div>
// // //           <div className="createNewReturn-totals-container">
// // //             <nav>
// // //               <h5>Original Purchased Total</h5>
// // //               <p> 418</p>
// // //             </nav>
// // //             <nav>
// // //               <h5>Global Discount {"(%)"}</h5>
// // //               <p>5%</p>
// // //             </nav>
// // //             <nav>
// // //               <h5>Tax Summary</h5>
// // //               <p> 254</p>
// // //             </nav>
// // //             <nav>
// // //               <h5>
// // //                 Returned Subtotal
// // //                 {/* {purchaseInput.currency === "IND" && <span>{`(₹)`}</span>}
// // //               {purchaseInput.currency === "USD" && <span>{`($)`}</span>}
// // //               {purchaseInput.currency === "GBP" && <span>{`(£)`}</span>}
// // //               {purchaseInput.currency === "SGD" && <span>{`(S$)`}</span>}
// // //               {purchaseInput.currency === "EUR" && <span>{`(€)`}</span>} */}
// // //               </h5>
// // //               <p>557</p>
// // //             </nav>
// // //             <nav>
// // //               <h5>Global Discount Amount</h5>
// // //               <p>025</p>
// // //             </nav>
// // //             <nav>
// // //               <h5>Rounding Adjustment</h5>
// // //               <p>456</p>
// // //             </nav>
// // //             <nav className="createNewReturn-totals-container-bg">
// // //               <h5>Amount to Recover</h5>
// // //               <p>
// // //                 {/* {purchaseInput.currency === "IND" && <span>₹</span>}
// // //               {purchaseInput.currency === "USD" && <span>$</span>}
// // //               {purchaseInput.currency === "GBP" && <span>£</span>}
// // //               {purchaseInput.currency === "SGD" && <span>S$</span>}
// // //               {purchaseInput.currency === "EUR" && <span>€</span>} */}
// // //                 555
// // //               </p>
// // //             </nav>
// // //           </div>
// // //           <div className="createNewReturn-hub-container">
// // //             <div className="createNewReturn-hub-head">
// // //               <p
// // //                 className={
// // //                   detail.comment
// // //                     ? "createNewReturn-hub-head-bg-black"
// // //                     : "createNewReturn-hub-head-tit"
// // //                 }
// // //                 onClick={() => {
// // //                   setDetail({
// // //                     history: false,
// // //                     attachment: false,
// // //                     comment: true,
// // //                   });
// // //                 }}
// // //               >
// // //                 Comments
// // //               </p>
// // //               <p
// // //                 className={
// // //                   detail.history
// // //                     ? "createNewReturn-hub-head-bg-black"
// // //                     : "createNewReturn-hub-head-tit"
// // //                 }
// // //                 onClick={() => {
// // //                   setDetail({
// // //                     history: true,
// // //                     attachment: false,
// // //                     comment: false,
// // //                   });
// // //                 }}
// // //               >
// // //                 History
// // //               </p>
// // //               <p
// // //                 className={
// // //                   detail.attachment
// // //                     ? "createNewReturn-hub-head-bg-black"
// // //                     : "createNewReturn-hub-head-tit"
// // //                 }
// // //                 onClick={() => {
// // //                   setDetail({
// // //                     history: false,
// // //                     attachment: true,
// // //                     comment: false,
// // //                   });
// // //                 }}
// // //               >
// // //                 Attachments
// // //               </p>
// // //             </div>
// // //             <div className="createNewReturn-hub-body">
// // //               {detail.comment && <ReturnComment />}
// // //               {detail.history && <ReturnHistory />}
// // //               {detail.attachment && (
// // //                 <ReturnAttachment inputDisable={returnBtn.buttonAcs} />
// // //               )}
// // //             </div>
// // //           </div>
// // //           <div className="createNewReturn-btn-container">
// // //             <button
// // //               className={
// // //                 ReturnStatus === "Submitted" ||
// // //                 ReturnStatus === "Submitted(PR)" ||
// // //                 ReturnStatus === "Cancelled"
// // //                   ? "createNewReturn-order-active-btn"
// // //                   : "createNewReturn-inactive-btn"
// // //               }
// // //               onClick={handleCancelledState}
// // //               disabled={returnBtn.cancel_order}
// // //             >
// // //               {ReturnStatus === "Cancelled" ? "Cancel Return" : "Cancelled"}
// // //             </button>
// // //             <nav>
// // //               <button
// // //                 className="createNewReturn-cancel-btn"
// // //                 onClick={(e) => {
// // //                   e.preventDefault();
// // //                   prevpg(-1);
// // //                 }}
// // //               >
// // //                 Cancel
// // //               </button>
// // //               <button
// // //                 className={
// // //                   ReturnStatus === "" || ReturnStatus === "Draft"
// // //                     ? "createNewReturn-active-btn"
// // //                     : "createNewReturn-completed-btn"
// // //                 }
// // //                 onClick={handleSaveDraftState}
// // //                 disabled={returnBtn.draft}
// // //               >
// // //                 Save Draft
// // //               </button>
// // //               <button
// // //                 className={
// // //                   ReturnStatus === "" || ReturnStatus === "Draft"
// // //                     ? "createNewReturn-active-btn"
// // //                     : "createNewReturn-completed-btn"
// // //                 }
// // //                 disabled={returnBtn.submit}
// // //               >
// // //                 {ReturnStatus === "Submitted" ? "Submitted" : "Submit"}
// // //               </button>
// // //               <svg
// // //                 className={
// // //                   ReturnStatus !== ""
// // //                     ? "createNewReturn-pdf-mail-activelogo"
// // //                     : "createNewReturn-pdf-mail-futurelogo"
// // //                 }
// // //                 disabled={returnBtn.pdf}
// // //                 xmlns="http://www.w3.org/2000/svg"
// // //                 viewBox="0 0 22 24"
// // //                 fill="none"
// // //               >
// // //                 <path
// // //                   fillRule="evenodd"
// // //                   clipRule="evenodd"
// // //                   d="M0.600098 2.4C0.600098 1.76348 0.852954 1.15303 1.30304 0.702944C1.75313 0.252856 2.36358 0 3.0001 0L16.1313 0L21.4001 5.2688V21.6C21.4001 22.2365 21.1472 22.847 20.6972 23.2971C20.2471 23.7471 19.6366 24 19.0001 24H3.0001C2.36358 24 1.75313 23.7471 1.30304 23.2971C0.852954 22.847 0.600098 22.2365 0.600098 21.6V2.4ZM4.6001 9.6H2.2001V17.6H3.8001V14.4H4.6001C5.23662 14.4 5.84707 14.1471 6.29715 13.6971C6.74724 13.247 7.0001 12.6365 7.0001 12C7.0001 11.3635 6.74724 10.753 6.29715 10.3029C5.84707 9.85286 5.23662 9.6 4.6001 9.6ZM11.0001 9.6H8.6001V17.6H11.0001C11.6366 17.6 12.2471 17.3471 12.6972 16.8971C13.1472 16.447 13.4001 15.8365 13.4001 15.2V12C13.4001 11.3635 13.1472 10.753 12.6972 10.3029C12.2471 9.85286 11.6366 9.6 11.0001 9.6ZM15.0001 17.6V9.6H19.8001V11.2H16.6001V12.8H18.2001V14.4H16.6001V17.6H15.0001Z"
// // //                 />
// // //               </svg>
// // //               <svg
// // //                 className={
// // //                   ReturnStatus !== ""
// // //                     ? "createNewReturn-pdf-mail-activelogo"
// // //                     : "createNewReturn-pdf-mail-futurelogo"
// // //                 }
// // //                 disabled={returnBtn.mail}
// // //                 xmlns="http://www.w3.org/2000/svg"
// // //                 viewBox="0 0 20 16"
// // //                 fill="none"
// // //               >
// // //                 <path d="M2 16C1.45 16 0.979333 15.8043 0.588 15.413C0.196667 15.0217 0.000666667 14.5507 0 14V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196666 1.45067 0.000666667 2 0H18C18.55 0 19.021 0.196 19.413 0.588C19.805 0.98 20.0007 1.45067 20 2V14C20 14.55 19.8043 15.021 19.413 15.413C19.0217 15.805 18.5507 16.0007 18 16H2ZM10 8.825C10.0833 8.825 10.171 8.81233 10.263 8.787C10.355 8.76167 10.4423 8.72433 10.525 8.675L17.6 4.25C17.7333 4.16667 17.8333 4.06267 17.9 3.938C17.9667 3.81333 18 3.67567 18 3.525C18 3.19167 17.8583 2.94167 17.575 2.775C17.2917 2.60833 17 2.61667 16.7 2.8L10 7L3.3 2.8C3 2.61667 2.70833 2.61267 2.425 2.788C2.14167 2.96333 2 3.209 2 3.525C2 3.69167 2.03333 3.83767 2.1 3.963C2.16667 4.08833 2.26667 4.184 2.4 4.25L9.475 8.675C9.55833 8.725 9.646 8.76267 9.738 8.788C9.83 8.81333 9.91733 8.82567 10 8.825Z" />
// // //               </svg>
// // //             </nav>
// // //           </div>
// // //         </form>
// // //       </div>
// // //     </>
// // //   );
// // // }
// // import React, { useState, useEffect } from "react";
// // import "./createNewStockReturn.css";
// // import { useNavigate } from "react-router-dom";
// // import ReturnListItem from "./returnListItem";
// // import ReturnComment from "./returnComment";
// // import ReturnHistory from "./returnHistory";
// // import ReturnAttachment from "./returnAttachment";
// // import { toast } from "react-toastify";
// // import stockReturnApiProvider from "../../../network/stockReturn-api-provider";
// // import stockReceiptApiProvider from "../../../network/stockReceipt-api-provider";

// // export default function CreateNewStockReturn() {
// //   const prevpg = useNavigate();

// //   // ── Core state ─────────────────────────────────────────────────────────────
// //   const [ReturnStatus, setReturnStatus] = useState("");
// //   const [createdSrnId, setCreatedSrnId] = useState(null);  // numeric DB id after POST
// //   const [isLoading, setIsLoading]       = useState(false);

// //   // ── Reference data ─────────────────────────────────────────────────────────
// //   const [grnList, setGrnList] = useState([]);   // submitted GRNs available for return
// //   const [poList, setPoList]   = useState([]);   // POs linked to selected GRN

// //   // ── Line items state ───────────────────────────────────────────────────────
// //   const [lineItems, setLineItems] = useState([]);

// //   // ── Header form ────────────────────────────────────────────────────────────
// //   const [returnInput, setReturnInput] = useState({
// //     srn_id:              "",
// //     grn_reference_id:    "",   // numeric GRN id
// //     po_reference_id:     "",   // numeric PO id (auto-filled from GRN)
// //     received_date:       "",
// //     return_date:         "",
// //     return_initiated_by: "",
// //     supplier_name:       "",   // auto-filled from GRN
// //   });

// //   // ── Tab state ──────────────────────────────────────────────────────────────
// //   const [detail, setDetail] = useState({
// //     comment: true, history: false, attachment: false,
// //   });

// //   // ── Button control ─────────────────────────────────────────────────────────
// //   const [returnBtn, setReturnBtn] = useState({
// //     buttonAcs:    false,
// //     cancel_order: true,
// //     draft:        false,
// //     submit:       false,
// //     pdf:          true,
// //     mail:         true,
// //   });

// //   // =========================================================================
// //   // LOAD GRN LIST ON MOUNT
// //   // Fetch submitted GRNs to populate "GRN Reference ID" dropdown
// //   // =========================================================================
// //   useEffect(() => {
// //     const loadGrns = async () => {
// //       try {
// //         const res = await stockReceiptApiProvider.fetchStockReceipts(1, "");
// //         // filter only Submitted GRNs
// //         const available = (res?.results || res?.data || []).filter((grn) =>
// //           ["Submitted"].includes(grn.status)
// //         );
// //         setGrnList(available);
// //       } catch (err) {
// //         console.error("Failed to load GRN list:", err);
// //       }
// //     };
// //     loadGrns();
// //   }, []);

// //   // =========================================================================
// //   // WHEN GRN REFERENCE CHANGES — auto-fill PO ref, supplier & line items
// //   // =========================================================================
// //   useEffect(() => {
// //     const fetchGrnItems = async () => {
// //       if (!returnInput.grn_reference_id) {
// //         setLineItems([]);
// //         setReturnInput((prev) => ({
// //           ...prev,
// //           po_reference_id: "",
// //           supplier_name:   "",
// //           received_date:   "",
// //         }));
// //         return;
// //       }

// //       try {
// //         const grn = await stockReceiptApiProvider.fetchSingleStockReceipt(
// //           returnInput.grn_reference_id
// //         );
// //         if (!grn) return;

// //         // Auto-fill header fields from GRN
// //         setReturnInput((prev) => ({
// //           ...prev,
// //           po_reference_id: grn.po_reference_id || grn.po_reference || "",
// //           supplier_name:   grn.supplier_name || "",
// //           received_date:   grn.received_date || "",
// //         }));

// //         // Build return line items from GRN accepted items
// //         const rows = (grn.items || grn.line_items || []).map((item, idx) => ({
// //           id:             idx,
// //           backend_item_id: item.id || null,
// //           product_id:     item.product_id || item.product || "",
// //           product_name:   item.product_name || item.name || "",
// //           uom:            item.uom || "",
// //           qty_ordered:    item.qty_ordered || 0,
// //           rejected_qty:   item.rejected_qty || 0,
// //           return_qty:     0,                             // user fills this
// //           serial_nos:     item.serial_nos || "",
// //           return_reason:  "",                            // user fills this
// //           unit_price:     item.unit_price || 0,
// //           tax_rate:       item.tax_rate || 0,
// //           discount_rate:  item.discount_rate || 0,
// //         }));
// //         setLineItems(rows);
// //       } catch (err) {
// //         console.error("Failed to fetch GRN details:", err);
// //       }
// //     };
// //     fetchGrnItems();
// //   }, [returnInput.grn_reference_id]);

// //   // =========================================================================
// //   // BUTTON ACCESS CONTROL
// //   // =========================================================================
// //   useEffect(() => {
// //     switch (ReturnStatus) {
// //       case "":
// //         setReturnBtn({
// //           buttonAcs: false, cancel_order: true, draft: false,
// //           submit: false, pdf: true, mail: true,
// //         });
// //         break;
// //       case "Draft":
// //         setReturnBtn({
// //           buttonAcs: false, cancel_order: true, draft: false,
// //           submit: false, pdf: false, mail: false,
// //         });
// //         break;
// //       case "Submitted":
// //         setReturnBtn({
// //           buttonAcs: true, cancel_order: false, draft: true,
// //           submit: true, pdf: false, mail: false,
// //         });
// //         break;
// //       case "Submitted(PR)":
// //         setReturnBtn({
// //           buttonAcs: true, cancel_order: false, draft: true,
// //           submit: true, pdf: false, mail: false,
// //         });
// //         break;
// //       case "Cancelled":
// //         setReturnBtn({
// //           buttonAcs: true, cancel_order: true, draft: true,
// //           submit: true, pdf: false, mail: false,
// //         });
// //         break;
// //       default:
// //         break;
// //     }
// //   }, [ReturnStatus]);

// //   // =========================================================================
// //   // FORM INPUT HANDLER
// //   // =========================================================================
// //   const handleReturnInputChange = (e) => {
// //     setReturnInput((prev) => ({ ...prev, [e.target.id]: e.target.value }));
// //   };

// //   // =========================================================================
// //   // LINE ITEM CHANGE HANDLER (called from ReturnListItem)
// //   // =========================================================================
// //   const handleLineItemChange = (rowId, field, value) => {
// //     setLineItems((prev) =>
// //       prev.map((row) => (row.id !== rowId ? row : { ...row, [field]: value }))
// //     );
// //   };

// //   // =========================================================================
// //   // TOTALS CALCULATION
// //   // =========================================================================
// //   const computedTotals = lineItems.reduce(
// //     (acc, row) => {
// //       const qty      = parseFloat(row.return_qty)    || 0;
// //       const price    = parseFloat(row.unit_price)    || 0;
// //       const tax      = parseFloat(row.tax_rate)      || 0;
// //       const discount = parseFloat(row.discount_rate) || 0;

// //       const lineTotal    = qty * price;
// //       const taxAmount    = (lineTotal * tax) / 100;
// //       const discountAmt  = (lineTotal * discount) / 100;

// //       acc.subtotal       += lineTotal;
// //       acc.totalTax       += taxAmount;
// //       acc.totalDiscount  += discountAmt;
// //       return acc;
// //     },
// //     { subtotal: 0, totalTax: 0, totalDiscount: 0 }
// //   );

// //   const roundingAdj  = parseFloat(
// //     (Math.round(computedTotals.subtotal + computedTotals.totalTax - computedTotals.totalDiscount) -
// //      (computedTotals.subtotal + computedTotals.totalTax - computedTotals.totalDiscount)).toFixed(2)
// //   );
// //   const amountToRecover =
// //     computedTotals.subtotal + computedTotals.totalTax - computedTotals.totalDiscount + roundingAdj;

// //   // =========================================================================
// //   // BUILD PAYLOAD
// //   // =========================================================================
// //   const buildPayload = (status = "Draft") => ({
// //     grn_reference:       parseInt(returnInput.grn_reference_id),
// //     po_reference:        parseInt(returnInput.po_reference_id) || undefined,
// //     received_date:       returnInput.received_date,
// //     return_date:         returnInput.return_date,
// //     return_initiated_by: returnInput.return_initiated_by,
// //     status,
// //     items: lineItems.map((row) => ({
// //       product:       parseInt(row.product_id),
// //       uom:           row.uom,
// //       qty_ordered:   parseFloat(row.qty_ordered)   || 0,
// //       rejected_qty:  parseFloat(row.rejected_qty)  || 0,
// //       return_qty:    parseFloat(row.return_qty)     || 0,
// //       serial_nos:    row.serial_nos || "",
// //       return_reason: row.return_reason || "",
// //       unit_price:    parseFloat(row.unit_price)     || 0,
// //       tax_rate:      parseFloat(row.tax_rate)       || 0,
// //       discount_rate: parseFloat(row.discount_rate)  || 0,
// //     })),
// //   });

// //   // =========================================================================
// //   // ✅ SAVE DRAFT
// //   // Step 1: POST createStockReturn → get SRN id
// //   // Step 2: If already created → PUT updateStockReturn
// //   // =========================================================================
// //   const handleSaveDraftState = async (e) => {
// //     e.preventDefault();

// //     if (!returnInput.grn_reference_id) {
// //       toast.error("Please select a GRN Reference");
// //       return;
// //     }
// //     if (!returnInput.return_date) {
// //       toast.error("Please select a Return Date");
// //       return;
// //     }
// //     if (lineItems.length === 0) {
// //       toast.error("No line items found");
// //       return;
// //     }

// //     setIsLoading(true);
// //     try {
// //       const payload = buildPayload("Draft");
// //       let srnId = createdSrnId;

// //       // ── Step 1: Create or Update SRN ─────────────────────────────────────
// //       if (!srnId) {
// //         console.log("Creating stock return...", payload);
// //         const result = await stockReturnApiProvider.createStockReturn(payload);
// //         console.log("Create result:", result);

// //         if (!result) return;

// //         srnId = result?.data?.id || result?.id;
// //         const srnIdDisplay = result?.data?.SRN_ID || result?.SRN_ID || "";

// //         setCreatedSrnId(srnId);
// //         if (srnIdDisplay) {
// //           setReturnInput((prev) => ({ ...prev, srn_id: srnIdDisplay }));
// //         }
// //       } else {
// //         console.log("Updating stock return...", payload);
// //         const result = await stockReturnApiProvider.updateStockReturn(srnId, payload);
// //         if (!result) return;
// //       }

// //       setReturnStatus("Draft");
// //       toast.success("Stock Return saved as Draft!");

// //     } catch (err) {
// //       console.error("handleSaveDraftState error:", err);
// //       toast.error("Failed to save draft");
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   // =========================================================================
// //   // SUBMIT STOCK RETURN
// //   // =========================================================================
// //   const handleSubmittedState = async (e) => {
// //     e.preventDefault();

// //     if (!createdSrnId) {
// //       toast.error("Please save as Draft first before submitting.");
// //       return;
// //     }

// //     setIsLoading(true);
// //     try {
// //       const result = await stockReturnApiProvider.updateStockReturn(
// //         createdSrnId,
// //         buildPayload("Submitted")
// //       );
// //       if (result) {
// //         setReturnStatus("Submitted");
// //         toast.success("Stock Return submitted successfully");
// //       }
// //     } catch (err) {
// //       console.error("handleSubmittedState error:", err);
// //       toast.error("Failed to submit stock return");
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   // =========================================================================
// //   // CANCEL STOCK RETURN
// //   // =========================================================================
// //   const handleCancelledState = async (e) => {
// //     e.preventDefault();

// //     if (!createdSrnId) return;

// //     setIsLoading(true);
// //     try {
// //       const result = await stockReturnApiProvider.updateStockReturn(
// //         createdSrnId,
// //         buildPayload("Cancelled")
// //       );
// //       if (result) {
// //         setReturnStatus("Cancelled");
// //         toast.success("Stock Return cancelled");
// //       }
// //     } catch (err) {
// //       console.error("handleCancelledState error:", err);
// //       toast.error("Failed to cancel stock return");
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   // =========================================================================
// //   // STATUS BADGE CLASS
// //   // =========================================================================
// //   const statusClass = {
// //     Draft:           "createNewReturn-Status-draft",
// //     Submitted:       "createNewReturn-Status-Submitted",
// //     Cancelled:       "createNewReturn-Status-Cancelled",
// //     "Submitted(PR)": "createNewReturn-Status-SubmittedPR",
// //   }[ReturnStatus] || "";

// //   // =========================================================================
// //   // RENDER
// //   // =========================================================================
// //   return (
// //     <>
// //       <div className="createNewReturn-container">
// //         <form onSubmit={handleSubmittedState}>

// //           {/* ── HEADER ── */}
// //           <div className="createNewReturn-head">
// //             <nav>
// //               <p>{ReturnStatus === "" ? "New Stock Return" : "Stock Return"}</p>
// //               {ReturnStatus !== "" && (
// //                 <h3 className={statusClass}>Status: {ReturnStatus}</h3>
// //               )}
// //             </nav>
// //             <div>
// //               <nav
// //                 className="createNewReturn-close"
// //                 onClick={(e) => { e.preventDefault(); prevpg(-1); }}
// //               >
// //                 <svg
// //                   className="createNewReturn-circle-x-logo"
// //                   xmlns="http://www.w3.org/2000/svg"
// //                   viewBox="0 0 512 512"
// //                 >
// //                   <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
// //                 </svg>
// //                 <p>Close</p>
// //               </nav>
// //             </div>
// //           </div>

// //           {/* ── HEADER FORM FIELDS ── */}
// //           <div className="createNewReturn-input-container">
// //             <div className="createNewReturn-input-box">
// //               <label htmlFor="srn_id">SRN ID {`(Auto Generate)`}</label>
// //               <input
// //                 id="srn_id"
// //                 type="text"
// //                 value={returnInput.srn_id}
// //                 placeholder="Auto Generate"
// //                 disabled
// //               />
// //             </div>
// //             <div className="createNewReturn-input-box">
// //               <label htmlFor="grn_reference_id">
// //                 GRN Reference ID<sup>*</sup>
// //               </label>
// //               <select
// //                 id="grn_reference_id"
// //                 value={returnInput.grn_reference_id}
// //                 onChange={handleReturnInputChange}
// //                 required
// //                 disabled={returnBtn.buttonAcs}
// //               >
// //                 <option value="">Select GRN Reference</option>
// //                 {grnList.map((grn) => (
// //                   <option key={grn.id} value={grn.id}>
// //                     {grn.grn_id || grn.GRN_ID || `GRN-${grn.id}`}
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>
// //           </div>

// //           <div className="createNewReturn-input-container">
// //             <div className="createNewReturn-input-box">
// //               <label htmlFor="po_reference_id">
// //                 PO Reference ID<sup>*</sup>
// //               </label>
// //               <input
// //                 id="po_reference_id"
// //                 type="text"
// //                 value={returnInput.po_reference_id}
// //                 placeholder="Auto-filled from GRN"
// //                 disabled
// //               />
// //             </div>
// //             <div className="createNewReturn-input-box">
// //               <label htmlFor="received_date">Received Date</label>
// //               <input
// //                 id="received_date"
// //                 type="date"
// //                 value={returnInput.received_date}
// //                 onChange={handleReturnInputChange}
// //                 disabled={returnBtn.buttonAcs}
// //               />
// //             </div>
// //           </div>

// //           <div className="createNewReturn-input-container">
// //             <div className="createNewReturn-input-box">
// //               <label htmlFor="return_date">
// //                 Return Date<sup>*</sup>
// //               </label>
// //               <input
// //                 id="return_date"
// //                 type="date"
// //                 value={returnInput.return_date}
// //                 onChange={handleReturnInputChange}
// //                 required
// //                 disabled={returnBtn.buttonAcs}
// //               />
// //             </div>
// //             <div className="createNewReturn-input-box">
// //               <label htmlFor="return_initiated_by">Return Initiated By</label>
// //               <input
// //                 id="return_initiated_by"
// //                 type="text"
// //                 value={returnInput.return_initiated_by}
// //                 onChange={handleReturnInputChange}
// //                 placeholder="Enter name"
// //                 disabled={returnBtn.buttonAcs}
// //               />
// //             </div>
// //           </div>

// //           <div className="createNewReturn-input-container">
// //             <div className="createNewReturn-input-box">
// //               <label htmlFor="supplier_name">
// //                 Supplier Name<sup>*</sup>
// //               </label>
// //               <input
// //                 id="supplier_name"
// //                 type="text"
// //                 value={returnInput.supplier_name}
// //                 placeholder="Auto-filled from GRN"
// //                 disabled
// //               />
// //             </div>
// //           </div>

// //           {/* ── LINE ITEMS ── */}
// //           <nav className="createNewReturn-subtit">
// //             Line Items<sup>*</sup>
// //           </nav>
// //           <div className="createNewReturn-table-container">
// //             <table>
// //               <thead className="createNewReturn-table-head">
// //                 <tr>
// //                   <th>#</th>
// //                   <th><pre>Product Name</pre></th>
// //                   <th><pre>Product ID</pre></th>
// //                   <th>UOM</th>
// //                   <th><pre>Qty Ordered</pre></th>
// //                   <th><pre>Rejected Qty</pre></th>
// //                   <th><pre>Return Qty</pre></th>
// //                   <th><pre>Serial No(s)</pre></th>
// //                   <th><pre>Return Reason</pre></th>
// //                   <th><pre>Unit Price</pre></th>
// //                   <th><pre>Tax (%)</pre></th>
// //                   <th><pre>Discount (%)</pre></th>
// //                   <th>Total</th>
// //                   <th>Action</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="createNewReturn-table-body">
// //                 {lineItems.length === 0 ? (
// //                   <tr>
// //                     <td colSpan={14} style={{ textAlign: "center", color: "#999" }}>
// //                       {returnInput.grn_reference_id
// //                         ? "Loading items..."
// //                         : "Select a GRN Reference to load items"}
// //                     </td>
// //                   </tr>
// //                 ) : (
// //                   lineItems.map((row, idx) => (
// //                     <ReturnListItem
// //                       key={row.id}
// //                       index={idx + 1}
// //                       rowData={row}
// //                       buttonAcs={returnBtn.buttonAcs}
// //                       onFieldChange={handleLineItemChange}
// //                     />
// //                   ))
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>

// //           {/* ── TOTALS ── */}
// //           <div className="createNewReturn-totals-container">
// //             <nav>
// //               <h5>Returned Subtotal</h5>
// //               <p>{computedTotals.subtotal.toFixed(2)}</p>
// //             </nav>
// //             <nav>
// //               <h5>Tax Summary</h5>
// //               <p>{computedTotals.totalTax.toFixed(2)}</p>
// //             </nav>
// //             <nav>
// //               <h5>Global Discount Amount</h5>
// //               <p>{computedTotals.totalDiscount.toFixed(2)}</p>
// //             </nav>
// //             <nav>
// //               <h5>Rounding Adjustment</h5>
// //               <p>{roundingAdj.toFixed(2)}</p>
// //             </nav>
// //             <nav className="createNewReturn-totals-container-bg">
// //               <h5>Amount to Recover</h5>
// //               <p>{amountToRecover.toFixed(2)}</p>
// //             </nav>
// //           </div>

// //           {/* ── COMMENTS / HISTORY / ATTACHMENTS ── */}
// //           <div className="createNewReturn-hub-container">
// //             <div className="createNewReturn-hub-head">
// //               <p
// //                 className={detail.comment ? "createNewReturn-hub-head-bg-black" : "createNewReturn-hub-head-tit"}
// //                 onClick={() => setDetail({ history: false, attachment: false, comment: true })}
// //               >
// //                 Comments
// //               </p>
// //               <p
// //                 className={detail.history ? "createNewReturn-hub-head-bg-black" : "createNewReturn-hub-head-tit"}
// //                 onClick={() => setDetail({ history: true, attachment: false, comment: false })}
// //               >
// //                 History
// //               </p>
// //               <p
// //                 className={detail.attachment ? "createNewReturn-hub-head-bg-black" : "createNewReturn-hub-head-tit"}
// //                 onClick={() => setDetail({ history: false, attachment: true, comment: false })}
// //               >
// //                 Attachments
// //               </p>
// //             </div>
// //             <div className="createNewReturn-hub-body">
// //               {detail.comment    && <ReturnComment />}
// //               {detail.history    && <ReturnHistory />}
// //               {detail.attachment && <ReturnAttachment inputDisable={returnBtn.buttonAcs} />}
// //             </div>
// //           </div>

// //           {/* ── ACTION BUTTONS ── */}
// //           <div className="createNewReturn-btn-container">
// //             <button
// //               type="button"
// //               className={
// //                 ReturnStatus === "Submitted" ||
// //                 ReturnStatus === "Submitted(PR)" ||
// //                 ReturnStatus === "Cancelled"
// //                   ? "createNewReturn-order-active-btn"
// //                   : "createNewReturn-inactive-btn"
// //               }
// //               onClick={handleCancelledState}
// //               disabled={returnBtn.cancel_order || isLoading}
// //             >
// //               {ReturnStatus === "Cancelled" ? "Cancelled" : "Cancel Return"}
// //             </button>

// //             <nav>
// //               <button
// //                 type="button"
// //                 className="createNewReturn-cancel-btn"
// //                 onClick={(e) => { e.preventDefault(); prevpg(-1); }}
// //               >
// //                 Cancel
// //               </button>

// //               {/* ✅ type="button" — Save Draft triggers API */}
// //               <button
// //                 type="button"
// //                 className={
// //                   ReturnStatus === "" || ReturnStatus === "Draft"
// //                     ? "createNewReturn-active-btn"
// //                     : "createNewReturn-completed-btn"
// //                 }
// //                 onClick={handleSaveDraftState}
// //                 disabled={returnBtn.draft || isLoading}
// //               >
// //                 {isLoading ? "Saving..." : "Save Draft"}
// //               </button>

// //               {/* ✅ type="submit" — Submit triggers form onSubmit */}
// //               <button
// //                 type="submit"
// //                 className={
// //                   ReturnStatus === "" || ReturnStatus === "Draft"
// //                     ? "createNewReturn-active-btn"
// //                     : "createNewReturn-completed-btn"
// //                 }
// //                 disabled={returnBtn.submit || isLoading}
// //               >
// //                 {ReturnStatus === "Submitted" ? "Submitted" : "Submit"}
// //               </button>

// //               {/* PDF icon */}
// //               <svg
// //                 className={
// //                   !returnBtn.pdf
// //                     ? "createNewReturn-pdf-mail-activelogo"
// //                     : "createNewReturn-pdf-mail-futurelogo"
// //                 }
// //                 style={{ cursor: !returnBtn.pdf ? "pointer" : "default" }}
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

// //               {/* Mail icon */}
// //               <svg
// //                 className={
// //                   !returnBtn.mail
// //                     ? "createNewReturn-pdf-mail-activelogo"
// //                     : "createNewReturn-pdf-mail-futurelogo"
// //                 }
// //                 style={{ cursor: !returnBtn.mail ? "pointer" : "default" }}
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
// import React, { useState, useEffect } from "react";
// import "./createNewStockReturn.css";
// import { useNavigate } from "react-router-dom";
// import ReturnListItem from "./returnListItem";
// import ReturnComment from "./returnComment";
// import ReturnHistory from "./returnHistory";
// import ReturnAttachment from "./returnAttachment";
// import { toast } from "react-toastify";
// import stockReturnApiProvider from "../../../network/stockReturn-api-provider";
// import stockReceiptApiProvider from "../../../network/stockReceipt-api-provider";

// // ─── Props ────────────────────────────────────────────────────────────────────
// // mode      : "create" | "edit"   (default: "create")
// // srnId     : numeric DB id       (required when mode === "edit")
// // ─────────────────────────────────────────────────────────────────────────────
// export default function CreateNewStockReturn({ mode = "create", srnId = null }) {
//   const prevpg = useNavigate();

//   const isEditMode = mode === "edit" && srnId != null;

//   // ── Core state ──────────────────────────────────────────────────────────────
//   const [ReturnStatus, setReturnStatus] = useState("");
//   const [createdSrnId, setCreatedSrnId] = useState(isEditMode ? srnId : null);
//   const [isLoading, setIsLoading]       = useState(false);
//   const [isFetching, setIsFetching]     = useState(isEditMode); // true while loading existing SRN

//   // ── Reference data ──────────────────────────────────────────────────────────
//   const [grnList, setGrnList] = useState([]);

//   // ── Line items ──────────────────────────────────────────────────────────────
//   const [lineItems, setLineItems] = useState([]);

//   // ── Comments / History / Attachments (passed into child components) ─────────
//   const [comments,    setComments]    = useState([]);
//   const [history,     setHistory]     = useState([]);
//   const [attachments, setAttachments] = useState([]);

//   // ── Header form ─────────────────────────────────────────────────────────────
//   const [returnInput, setReturnInput] = useState({
//     srn_id:              "",
//     grn_reference_id:    "",
//     po_reference_id:     "",
//     received_date:       "",
//     return_date:         "",
//     return_initiated_by: "",
//     supplier_name:       "",
//     global_discount:     "",
//   });

//   // ── Tab state ────────────────────────────────────────────────────────────────
//   const [detail, setDetail] = useState({
//     comment: true, history: false, attachment: false,
//   });

//   // ── Button control ───────────────────────────────────────────────────────────
//   const [returnBtn, setReturnBtn] = useState({
//     buttonAcs:    false,
//     cancel_order: true,
//     draft:        false,
//     submit:       false,
//     pdf:          true,
//     mail:         true,
//   });

//   // ===========================================================================
//   // LOAD GRN LIST ON MOUNT
//   // ===========================================================================
//   useEffect(() => {
//     const loadGrns = async () => {
//       try {
//         const res = await stockReceiptApiProvider.fetchStockReceipts(1, "");
//         const available = (res?.results || res?.data || []).filter((grn) =>
//           ["Submitted"].includes(grn.status)
//         );
//         setGrnList(available);
//       } catch (err) {
//         console.error("Failed to load GRN list:", err);
//       }
//     };
//     loadGrns();
//   }, []);

//   // ===========================================================================
//   // EDIT MODE — LOAD EXISTING SRN
//   // ===========================================================================
//   useEffect(() => {
//     if (!isEditMode) return;

//     const loadSrn = async () => {
//       setIsFetching(true);
//       try {
//         const res = await stockReturnApiProvider.fetchSingleStockReturn(srnId);
//         const d   = res?.data || res;
//         if (!d) return;

//         // Header
//         setReturnInput({
//           srn_id:              d.SRN_ID              || "",
//           grn_reference_id:    d.grn_reference_id    || d.grn_reference || "",
//           po_reference_id:     d.po_reference_id     || d.po_reference  || "",
//           received_date:       d.received_date       || "",
//           return_date:         d.return_date         || "",
//           return_initiated_by: d.return_initiated_by || "",
//           supplier_name:       d.supplier?.supplier_name || d.supplier_name || "",
//           global_discount:     d.global_discount     || "",
//         });

//         setReturnStatus(d.status || "");

//         // Line items — map API shape → internal shape
//         const rows = (d.items || [])
//           .filter((item) => item.stock_receipt_item != null) // skip ghost rows
//           .map((item, idx) => ({
//             id:               idx,
//             backend_item_id:  item.id                   || null,
//             stock_receipt_item: item.stock_receipt_item || null,
//             product_id:       item.product              || item.product_id || "",
//             product_name:     item.product_name         || "",
//             uom:              item.uom                  || "",
//             qty_ordered:      item.qty_ordered           || 0,
//             rejected_qty:     item.qty_rejected          || item.rejected_qty || 0,
//             return_qty:       item.qty_returned           || 0,
//             unit_price:       item.unit_price            || 0,
//             tax_rate:         item.tax_rate              || 0,
//             discount_rate:    item.discount_rate         || 0,
//             return_reason:    item.return_reason         || "",
//             // serial handling
//             selected_serials:  (item.serial_numbers  || []).map((s) => s.id),
//             available_serials: item.available_serials || [],
//             all_serials:       [
//               ...(item.serial_numbers  || []),
//               ...(item.available_serials || []),
//             ],
//           }));

//         setLineItems(rows);
//         setComments(d.comments       || []);
//         setHistory(d.history         || []);
//         setAttachments(d.attachments || []);

//       } catch (err) {
//         console.error("Failed to load SRN:", err);
//         toast.error("Failed to load stock return");
//       } finally {
//         setIsFetching(false);
//       }
//     };

//     loadSrn();
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ===========================================================================
//   // CREATE MODE — when GRN selection changes, auto-fill fields & line items
//   // ===========================================================================
//   useEffect(() => {
//     // Skip this side-effect while in edit mode or while fetching
//     if (isEditMode) return;

//     const fetchGrnItems = async () => {
//       if (!returnInput.grn_reference_id) {
//         setLineItems([]);
//         setReturnInput((prev) => ({
//           ...prev,
//           po_reference_id: "",
//           supplier_name:   "",
//           received_date:   "",
//         }));
//         return;
//       }

//       try {
//         const grn = await stockReceiptApiProvider.fetchSingleStockReceipt(
//           returnInput.grn_reference_id
//         );
//         if (!grn) return;

//         setReturnInput((prev) => ({
//           ...prev,
//           po_reference_id: grn.po_reference_id || grn.po_reference || "",
//           supplier_name:   grn.supplier_name   || "",
//           received_date:   grn.received_date   || "",
//         }));

//         const rows = (grn.items || grn.line_items || []).map((item, idx) => ({
//           id:                idx,
//           backend_item_id:   null,
//           stock_receipt_item: item.id || null,
//           product_id:        item.product_id   || item.product || "",
//           product_name:      item.product_name || item.name    || "",
//           uom:               item.uom          || "",
//           qty_ordered:       item.qty_ordered  || 0,
//           rejected_qty:      item.rejected_qty || item.qty_rejected || 0,
//           return_qty:        0,
//           unit_price:        item.unit_price   || 0,
//           tax_rate:          item.tax_rate     || 0,
//           discount_rate:     item.discount_rate || 0,
//           return_reason:     "",
//           selected_serials:  [],
//           available_serials: item.available_serials || item.serial_nos || [],
//           all_serials:       item.available_serials || item.serial_nos || [],
//         }));
//         setLineItems(rows);
//       } catch (err) {
//         console.error("Failed to fetch GRN details:", err);
//       }
//     };

//     fetchGrnItems();
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [returnInput.grn_reference_id]);

//   // ===========================================================================
//   // BUTTON ACCESS CONTROL
//   // ===========================================================================
//   useEffect(() => {
//     switch (ReturnStatus) {
//       case "":
//         setReturnBtn({ buttonAcs: false, cancel_order: true,  draft: false, submit: false, pdf: true,  mail: true  }); break;
//       case "Draft":
//         setReturnBtn({ buttonAcs: false, cancel_order: true,  draft: false, submit: false, pdf: false, mail: false }); break;
//       case "Submitted":
//       case "Submitted(PR)":
//         setReturnBtn({ buttonAcs: true,  cancel_order: false, draft: true,  submit: true,  pdf: false, mail: false }); break;
//       case "Cancelled":
//         setReturnBtn({ buttonAcs: true,  cancel_order: true,  draft: true,  submit: true,  pdf: false, mail: false }); break;
//       default: break;
//     }
//   }, [ReturnStatus]);

//   // ===========================================================================
//   // FORM INPUT HANDLER
//   // ===========================================================================
//   const handleReturnInputChange = (e) => {
//     setReturnInput((prev) => ({ ...prev, [e.target.id]: e.target.value }));
//   };

//   // ===========================================================================
//   // LINE ITEM CHANGE HANDLER
//   // ===========================================================================
//   const handleLineItemChange = (rowId, field, value) => {
//     setLineItems((prev) =>
//       prev.map((row) => (row.id !== rowId ? row : { ...row, [field]: value }))
//     );
//   };

//   // ===========================================================================
//   // TOTALS
//   // ===========================================================================
//   const computedTotals = lineItems.reduce(
//     (acc, row) => {
//       const qty      = parseFloat(row.return_qty)    || 0;
//       const price    = parseFloat(row.unit_price)    || 0;
//       const tax      = parseFloat(row.tax_rate)      || 0;
//       const discount = parseFloat(row.discount_rate) || 0;

//       const lineTotal   = qty * price;
//       acc.subtotal      += lineTotal;
//       acc.totalTax      += (lineTotal * tax)      / 100;
//       acc.totalDiscount += (lineTotal * discount) / 100;
//       return acc;
//     },
//     { subtotal: 0, totalTax: 0, totalDiscount: 0 }
//   );

//   const globalDiscountAmt =
//     (computedTotals.subtotal * (parseFloat(returnInput.global_discount) || 0)) / 100;

//   const preRound =
//     computedTotals.subtotal +
//     computedTotals.totalTax -
//     computedTotals.totalDiscount -
//     globalDiscountAmt;

//   const roundingAdj     = parseFloat((Math.round(preRound) - preRound).toFixed(2));
//   const amountToRecover = preRound + roundingAdj;

//   // ===========================================================================
//   // BUILD PAYLOAD  —  uses action API (save_draft / submit / cancel)
//   // ===========================================================================
//   const buildPayload = () => ({
//     grn_reference:       parseInt(returnInput.grn_reference_id) || undefined,
//     po_reference:        parseInt(returnInput.po_reference_id)  || undefined,
//     received_date:       returnInput.received_date              || undefined,
//     return_date:         returnInput.return_date,
//     return_initiated_by: returnInput.return_initiated_by,
//     global_discount:     parseFloat(returnInput.global_discount) || 0,
//     items: lineItems.map((row) => ({
//       ...(row.backend_item_id ? { id: row.backend_item_id } : {}),
//       stock_receipt_item: row.stock_receipt_item,
//       qty_returned:  parseFloat(row.return_qty)    || 0,
//       return_reason: row.return_reason             || "",
//       serial_numbers: (row.selected_serials || []).map((id) => {
//         const found = (row.all_serials || []).find((s) => s.id === id);
//         return found ? { serial_no: found.serial_no } : null;
//       }).filter(Boolean),
//     })),
//   });

//   // ===========================================================================
//   // SAVE / SUBMIT / CANCEL  — all go through the Action API
//   // ===========================================================================
//   const executeSave = async (action) => {
//     if (!returnInput.return_date) { toast.error("Please select a Return Date"); return; }
//     if (!returnInput.grn_reference_id && !isEditMode) { toast.error("Please select a GRN Reference"); return; }
//     if (lineItems.length === 0) { toast.error("No line items found"); return; }

//     setIsLoading(true);
//     try {
//       let currentId = createdSrnId;

//       // ── Step 1: ensure SRN exists (create if brand-new) ─────────────────
//       if (!currentId) {
//         const createRes = await stockReturnApiProvider.createStockReturn(buildPayload());
//         if (!createRes) return;
//         currentId = createRes?.data?.id || createRes?.id;
//         const displayId = createRes?.data?.SRN_ID || createRes?.SRN_ID || "";
//         setCreatedSrnId(currentId);
//         if (displayId) setReturnInput((prev) => ({ ...prev, srn_id: displayId }));
//       } else {
//         // ── Step 2: patch latest item data ─────────────────────────────────
//         await stockReturnApiProvider.updateStockReturn(currentId, buildPayload());
//       }

//       // ── Step 3: fire action (save_draft / submit / cancel) ───────────────
//       await stockReturnApiProvider.actionStockReturn(currentId, action);

//       const nextStatus =
//         action === "save_draft" ? "Draft"
//         : action === "submit"   ? "Submitted"
//         : action === "cancel"   ? "Cancelled"
//         : ReturnStatus;

//       setReturnStatus(nextStatus);

//       const label =
//         action === "save_draft" ? "Draft saved!"
//         : action === "submit"   ? "Submitted successfully!"
//         : "Cancelled.";
//       toast.success(`Stock Return ${label}`);

//     } catch (err) {
//       console.error("executeSave error:", err);
//       toast.error("Operation failed");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSaveDraftState  = (e) => { e.preventDefault(); executeSave("save_draft"); };
//   const handleSubmittedState  = (e) => { e.preventDefault(); executeSave("submit");     };
//   const handleCancelledState  = (e) => { e.preventDefault(); executeSave("cancel");     };

//   // ===========================================================================
//   // COMMENT SUBMIT
//   // ===========================================================================
//   const handleAddComment = async (text) => {
//     if (!createdSrnId || !text.trim()) return;
//     try {
//       await stockReturnApiProvider.addComment(createdSrnId, text);
//       setComments((prev) => [
//         { comment: text, created_by: "You", timestamp: new Date().toISOString() },
//         ...prev,
//       ]);
//     } catch (err) {
//       console.error("Comment error:", err);
//       toast.error("Failed to add comment");
//     }
//   };

//   // ===========================================================================
//   // ATTACHMENT UPLOAD / DELETE
//   // ===========================================================================
//   const handleUploadAttachment = async (file, description = "") => {
//     if (!createdSrnId) return;
//     try {
//       const res = await stockReturnApiProvider.uploadAttachment(createdSrnId, file, description);
//       setAttachments((prev) => [...prev, res?.data || res]);
//     } catch (err) {
//       console.error("Upload error:", err);
//       toast.error("Failed to upload attachment");
//     }
//   };

//   const handleDeleteAttachment = async (attachmentId) => {
//     if (!createdSrnId) return;
//     try {
//       await stockReturnApiProvider.deleteAttachment(createdSrnId, attachmentId);
//       setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
//     } catch (err) {
//       console.error("Delete attachment error:", err);
//       toast.error("Failed to delete attachment");
//     }
//   };

//   // ===========================================================================
//   // STATUS BADGE
//   // ===========================================================================
//   const statusClass = {
//     Draft:           "createNewReturn-Status-draft",
//     Submitted:       "createNewReturn-Status-Submitted",
//     Cancelled:       "createNewReturn-Status-Cancelled",
//     "Submitted(PR)": "createNewReturn-Status-SubmittedPR",
//   }[ReturnStatus] || "";

//   // ===========================================================================
//   // RENDER
//   // ===========================================================================
//   if (isFetching) {
//     return (
//       <div className="createNewReturn-container">
//         <p style={{ textAlign: "center", padding: "40px" }}>Loading...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="createNewReturn-container">
//       <form onSubmit={handleSubmittedState}>

//         {/* ── HEADER ── */}
//         <div className="createNewReturn-head">
//           <nav>
//             <p>
//               {isEditMode
//                 ? "Edit Stock Return"
//                 : ReturnStatus === ""
//                 ? "New Stock Return"
//                 : "Stock Return"}
//             </p>
//             {ReturnStatus !== "" && (
//               <h3 className={statusClass}>Status: {ReturnStatus}</h3>
//             )}
//           </nav>
//           <div>
//             <nav
//               className="createNewReturn-close"
//               onClick={(e) => { e.preventDefault(); prevpg(-1); }}
//             >
//               <svg
//                 className="createNewReturn-circle-x-logo"
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 512 512"
//               >
//                 <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
//               </svg>
//               <p>Close</p>
//             </nav>
//           </div>
//         </div>

//         {/* ── HEADER FORM ── */}
//         <div className="createNewReturn-input-container">
//           <div className="createNewReturn-input-box">
//             <label htmlFor="srn_id">SRN ID (Auto Generate)</label>
//             <input id="srn_id" type="text" value={returnInput.srn_id} placeholder="Auto Generate" disabled />
//           </div>
//           <div className="createNewReturn-input-box">
//             <label htmlFor="grn_reference_id">GRN Reference ID<sup>*</sup></label>
//             {isEditMode ? (
//               /* In edit mode show read-only text — GRN can't be changed */
//               <input
//                 id="grn_reference_id"
//                 type="text"
//                 value={returnInput.grn_reference_id}
//                 placeholder="GRN Reference"
//                 disabled
//               />
//             ) : (
//               <select
//                 id="grn_reference_id"
//                 value={returnInput.grn_reference_id}
//                 onChange={handleReturnInputChange}
//                 required
//                 disabled={returnBtn.buttonAcs}
//               >
//                 <option value="">Select GRN Reference</option>
//                 {grnList.map((grn) => (
//                   <option key={grn.id} value={grn.id}>
//                     {grn.grn_id || grn.GRN_ID || `GRN-${grn.id}`}
//                   </option>
//                 ))}
//               </select>
//             )}
//           </div>
//         </div>

//         <div className="createNewReturn-input-container">
//           <div className="createNewReturn-input-box">
//             <label htmlFor="po_reference_id">PO Reference ID<sup>*</sup></label>
//             <input id="po_reference_id" type="text" value={returnInput.po_reference_id} placeholder="Auto-filled from GRN" disabled />
//           </div>
//           <div className="createNewReturn-input-box">
//             <label htmlFor="received_date">Received Date</label>
//             <input id="received_date" type="date" value={returnInput.received_date} onChange={handleReturnInputChange} disabled={returnBtn.buttonAcs} />
//           </div>
//         </div>

//         <div className="createNewReturn-input-container">
//           <div className="createNewReturn-input-box">
//             <label htmlFor="return_date">Return Date<sup>*</sup></label>
//             <input id="return_date" type="date" value={returnInput.return_date} onChange={handleReturnInputChange} required disabled={returnBtn.buttonAcs} />
//           </div>
//           <div className="createNewReturn-input-box">
//             <label htmlFor="return_initiated_by">Return Initiated By</label>
//             <input id="return_initiated_by" type="text" value={returnInput.return_initiated_by} onChange={handleReturnInputChange} placeholder="Enter name" disabled={returnBtn.buttonAcs} />
//           </div>
//         </div>

//         <div className="createNewReturn-input-container">
//           <div className="createNewReturn-input-box">
//             <label htmlFor="supplier_name">Supplier Name<sup>*</sup></label>
//             <input id="supplier_name" type="text" value={returnInput.supplier_name} placeholder="Auto-filled from GRN" disabled />
//           </div>
//           <div className="createNewReturn-input-box">
//             <label htmlFor="global_discount">Global Discount (%)</label>
//             <input id="global_discount" type="number" min="0" max="100" value={returnInput.global_discount} onChange={handleReturnInputChange} placeholder="0" disabled={returnBtn.buttonAcs} />
//           </div>
//         </div>

//         {/* ── LINE ITEMS ── */}
//         <nav className="createNewReturn-subtit">Line Items<sup>*</sup></nav>
//         <div className="createNewReturn-table-container">
//           <table>
//             <thead className="createNewReturn-table-head">
//               <tr>
//                 <th>#</th>
//                 <th><pre>Product Name</pre></th>
//                 <th><pre>Product ID</pre></th>
//                 <th>UOM</th>
//                 <th><pre>Qty Ordered</pre></th>
//                 <th><pre>Rejected Qty</pre></th>
//                 <th><pre>Return Qty</pre></th>
//                 <th><pre>Serial No(s)</pre></th>
//                 <th><pre>Return Reason</pre></th>
//                 <th><pre>Unit Price</pre></th>
//                 <th><pre>Tax (%)</pre></th>
//                 <th><pre>Discount (%)</pre></th>
//                 <th>Total</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody className="createNewReturn-table-body">
//               {lineItems.length === 0 ? (
//                 <tr>
//                   <td colSpan={14} style={{ textAlign: "center", color: "#999" }}>
//                     {returnInput.grn_reference_id
//                       ? "Loading items..."
//                       : "Select a GRN Reference to load items"}
//                   </td>
//                 </tr>
//               ) : (
//                 lineItems.map((row, idx) => (
//                   <ReturnListItem
//                     key={row.id}
//                     index={idx + 1}
//                     rowData={row}
//                     buttonAcs={returnBtn.buttonAcs}
//                     onFieldChange={handleLineItemChange}
//                   />
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* ── TOTALS ── */}
//         <div className="createNewReturn-totals-container">
//           <nav>
//             <h5>Returned Subtotal</h5>
//             <p>{computedTotals.subtotal.toFixed(2)}</p>
//           </nav>
//           <nav>
//             <h5>Tax Summary</h5>
//             <p>{computedTotals.totalTax.toFixed(2)}</p>
//           </nav>
//           <nav>
//             <h5>Line Discount Amount</h5>
//             <p>{computedTotals.totalDiscount.toFixed(2)}</p>
//           </nav>
//           <nav>
//             <h5>Global Discount Amount</h5>
//             <p>{globalDiscountAmt.toFixed(2)}</p>
//           </nav>
//           <nav>
//             <h5>Rounding Adjustment</h5>
//             <p>{roundingAdj.toFixed(2)}</p>
//           </nav>
//           <nav className="createNewReturn-totals-container-bg">
//             <h5>Amount to Recover</h5>
//             <p>{amountToRecover.toFixed(2)}</p>
//           </nav>
//         </div>

//         {/* ── COMMENTS / HISTORY / ATTACHMENTS ── */}
//         <div className="createNewReturn-hub-container">
//           <div className="createNewReturn-hub-head">
//             <p
//               className={detail.comment    ? "createNewReturn-hub-head-bg-black" : "createNewReturn-hub-head-tit"}
//               onClick={() => setDetail({ history: false, attachment: false, comment: true })}
//             >Comments</p>
//             <p
//               className={detail.history    ? "createNewReturn-hub-head-bg-black" : "createNewReturn-hub-head-tit"}
//               onClick={() => setDetail({ history: true,  attachment: false, comment: false })}
//             >History</p>
//             <p
//               className={detail.attachment ? "createNewReturn-hub-head-bg-black" : "createNewReturn-hub-head-tit"}
//               onClick={() => setDetail({ history: false, attachment: true,  comment: false })}
//             >Attachments</p>
//           </div>
//           <div className="createNewReturn-hub-body">
//             {detail.comment    && (
//               <ReturnComment
//                 comments={comments}
//                 onAddComment={handleAddComment}
//                 disabled={!createdSrnId}
//               />
//             )}
//             {detail.history    && <ReturnHistory history={history} />}
//             {detail.attachment && (
//               <ReturnAttachment
//                 inputDisable={returnBtn.buttonAcs}
//                 backendFiles={attachments}
//                 onUpload={handleUploadAttachment}
//                 onDelete={handleDeleteAttachment}
//               />
//             )}
//           </div>
//         </div>

//         {/* ── ACTION BUTTONS ── */}
//         <div className="createNewReturn-btn-container">
//           <button
//             type="button"
//             className={
//               ReturnStatus === "Submitted" ||
//               ReturnStatus === "Submitted(PR)" ||
//               ReturnStatus === "Cancelled"
//                 ? "createNewReturn-order-active-btn"
//                 : "createNewReturn-inactive-btn"
//             }
//             onClick={handleCancelledState}
//             disabled={returnBtn.cancel_order || isLoading}
//           >
//             {ReturnStatus === "Cancelled" ? "Cancelled" : "Cancel Return"}
//           </button>

//           <nav>
//             <button
//               type="button"
//               className="createNewReturn-cancel-btn"
//               onClick={(e) => { e.preventDefault(); prevpg(-1); }}
//             >
//               Cancel
//             </button>

//             <button
//               type="button"
//               className={
//                 ReturnStatus === "" || ReturnStatus === "Draft"
//                   ? "createNewReturn-active-btn"
//                   : "createNewReturn-completed-btn"
//               }
//               onClick={handleSaveDraftState}
//               disabled={returnBtn.draft || isLoading}
//             >
//               {isLoading ? "Saving..." : "Save Draft"}
//             </button>

//             <button
//               type="submit"
//               className={
//                 ReturnStatus === "" || ReturnStatus === "Draft"
//                   ? "createNewReturn-active-btn"
//                   : "createNewReturn-completed-btn"
//               }
//               disabled={returnBtn.submit || isLoading}
//             >
//               {ReturnStatus === "Submitted" ? "Submitted" : "Submit"}
//             </button>

//             {/* PDF */}
//             <svg
//               className={!returnBtn.pdf ? "createNewReturn-pdf-mail-activelogo" : "createNewReturn-pdf-mail-futurelogo"}
//               style={{ cursor: !returnBtn.pdf ? "pointer" : "default" }}
//               xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 24" fill="none"
//             >
//               <path fillRule="evenodd" clipRule="evenodd" d="M0.600098 2.4C0.600098 1.76348 0.852954 1.15303 1.30304 0.702944C1.75313 0.252856 2.36358 0 3.0001 0L16.1313 0L21.4001 5.2688V21.6C21.4001 22.2365 21.1472 22.847 20.6972 23.2971C20.2471 23.7471 19.6366 24 19.0001 24H3.0001C2.36358 24 1.75313 23.7471 1.30304 23.2971C0.852954 22.847 0.600098 22.2365 0.600098 21.6V2.4ZM4.6001 9.6H2.2001V17.6H3.8001V14.4H4.6001C5.23662 14.4 5.84707 14.1471 6.29715 13.6971C6.74724 13.247 7.0001 12.6365 7.0001 12C7.0001 11.3635 6.74724 10.753 6.29715 10.3029C5.84707 9.85286 5.23662 9.6 4.6001 9.6ZM11.0001 9.6H8.6001V17.6H11.0001C11.6366 17.6 12.2471 17.3471 12.6972 16.8971C13.1472 16.447 13.4001 15.8365 13.4001 15.2V12C13.4001 11.3635 13.1472 10.753 12.6972 10.3029C12.2471 9.85286 11.6366 9.6 11.0001 9.6ZM15.0001 17.6V9.6H19.8001V11.2H16.6001V12.8H18.2001V14.4H16.6001V17.6H15.0001Z" />
//             </svg>

//             {/* Mail */}
//             <svg
//               className={!returnBtn.mail ? "createNewReturn-pdf-mail-activelogo" : "createNewReturn-pdf-mail-futurelogo"}
//               style={{ cursor: !returnBtn.mail ? "pointer" : "default" }}
//               xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 16" fill="none"
//             >
//               <path d="M2 16C1.45 16 0.979333 15.8043 0.588 15.413C0.196667 15.0217 0.000666667 14.5507 0 14V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196666 1.45067 0.000666667 2 0H18C18.55 0 19.021 0.196 19.413 0.588C19.805 0.98 20.0007 1.45067 20 2V14C20 14.55 19.8043 15.021 19.413 15.413C19.0217 15.805 18.5507 16.0007 18 16H2ZM10 8.825C10.0833 8.825 10.171 8.81233 10.263 8.787C10.355 8.76167 10.4423 8.72433 10.525 8.675L17.6 4.25C17.7333 4.16667 17.8333 4.06267 17.9 3.938C17.9667 3.81333 18 3.67567 18 3.525C18 3.19167 17.8583 2.94167 17.575 2.775C17.2917 2.60833 17 2.61667 16.7 2.8L10 7L3.3 2.8C3 2.61667 2.70833 2.61267 2.425 2.788C2.14167 2.96333 2 3.209 2 3.525C2 3.69167 2.03333 3.83767 2.1 3.963C2.16667 4.08833 2.26667 4.184 2.4 4.25L9.475 8.675C9.55833 8.725 9.646 8.76267 9.738 8.788C9.83 8.81333 9.91733 8.82567 10 8.825Z" />
//             </svg>
//           </nav>
//         </div>

//       </form>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import "./createNewStockReturn.css";
import { useNavigate } from "react-router-dom";
import ReturnListItem from "./returnListItem";
import ReturnComment from "./returnComment";
import ReturnHistory from "./returnHistory";
import ReturnAttachment from "./returnAttachment";
import { toast } from "react-toastify";
import stockReturnApiProvider from "../../../network/stockReturn-api-provider";
import stockReceiptApiProvider from "../../../network/stockReceipt-api-provider";

// ─── Props ────────────────────────────────────────────────────────────────────
// mode      : "create" | "edit"   (default: "create")
// srnId     : numeric DB id       (required when mode === "edit")
// ─────────────────────────────────────────────────────────────────────────────
export default function CreateNewStockReturn({ mode = "create", srnId = null }) {
  const prevpg = useNavigate();

  const isEditMode = mode === "edit" && srnId != null;

  // ── Core state ──────────────────────────────────────────────────────────────
  const [ReturnStatus, setReturnStatus] = useState("");
  const [createdSrnId, setCreatedSrnId] = useState(isEditMode ? srnId : null);
  const [isLoading, setIsLoading]       = useState(false);
  const [isFetching, setIsFetching]     = useState(isEditMode);

  // ── Reference data ──────────────────────────────────────────────────────────
  const [grnList, setGrnList] = useState([]);

  // ── Line items ──────────────────────────────────────────────────────────────
  const [lineItems, setLineItems] = useState([]);

  // ── Comments / History / Attachments ────────────────────────────────────────
  const [comments,    setComments]    = useState([]);
  const [history,     setHistory]     = useState([]);
  const [attachments, setAttachments] = useState([]);

  // ── Header form ─────────────────────────────────────────────────────────────
  const [returnInput, setReturnInput] = useState({
    srn_id:              "",
    grn_reference_id:    "",
    po_reference_id:     "",
    received_date:       "",
    return_date:         "",
    return_initiated_by: "",
    supplier_name:       "",
    global_discount:     "",
  });

  // ── Tab state ────────────────────────────────────────────────────────────────
  const [detail, setDetail] = useState({
    comment: true, history: false, attachment: false,
  });

  // ── Button control ───────────────────────────────────────────────────────────
  const [returnBtn, setReturnBtn] = useState({
    buttonAcs:    false,
    cancel_order: true,
    draft:        false,
    submit:       false,
    pdf:          true,
    mail:         true,
  });

  // ===========================================================================
  // LOAD GRN LIST ON MOUNT
  // ===========================================================================
  useEffect(() => {
    const loadGrns = async () => {
      try {
        const res = await stockReceiptApiProvider.fetchStockReceipts(1, "");
        const available = (res?.results || res?.data || []).filter((grn) =>
          ["Submitted"].includes(grn.status)
        );
        setGrnList(available);
      } catch (err) {
        console.error("Failed to load GRN list:", err);
      }
    };
    loadGrns();
  }, []);

  // ===========================================================================
  // EDIT MODE — LOAD EXISTING SRN
  // ===========================================================================
  useEffect(() => {
    if (!isEditMode) return;

    const loadSrn = async () => {
      setIsFetching(true);
      try {
        const res = await stockReturnApiProvider.fetchSingleStockReturn(srnId);
        const d   = res?.data || res;
        if (!d) return;

        // Header
        setReturnInput({
          srn_id:              d.SRN_ID              || "",
          grn_reference_id:    d.grn_reference_id    || d.grn_reference || "",
          po_reference_id:     d.po_reference_id     || d.po_reference  || "",
          received_date:       d.received_date       || "",
          return_date:         d.return_date         || "",
          return_initiated_by: d.return_initiated_by || "",
          supplier_name:       d.supplier?.supplier_name || d.supplier_name || "",
          global_discount:     d.global_discount     || "",
        });

        setReturnStatus(d.status || "");

        // ── Line items — map API shape → internal shape ──────────────────────
        //
        // API shape per item:
        //   serial_numbers   : [{id, serial_no}]  — serials chosen for THIS return
        //   available_serials: [{id, serial_no}]  — serials still in GRN stock
        //
        // Internal shape:
        //   selected_serials : number[]           — IDs being returned
        //   available_serials: [{id,serial_no}]   — remaining pool
        //   all_serials      : [{id,serial_no}]   — selected + available (full choosable set)
        // ─────────────────────────────────────────────────────────────────────
        const rows = (d.items || []).map((item, idx) => {
            const returnedSerials  = item.serial_numbers   || [];
            const availableSerials = item.available_serials || [];

            const availableIds   = new Set(availableSerials.map((s) => s.id));
            const uniqueReturned = returnedSerials.filter((s) => !availableIds.has(s.id));
            const allSerials     = [...uniqueReturned, ...availableSerials];

            return {
              id:                idx,
              backend_item_id:   item.id              || null,
              stock_receipt_item: item.stock_receipt_item || null,
              product:           item.product          || null,   // integer product ID
              product_id:        item.product_id       || "",
              product_name:      item.product_name     || "",
              uom:               item.uom              || "",
              qty_ordered:       item.qty_ordered      || 0,
              rejected_qty:      item.qty_rejected     || item.rejected_qty || 0,
              return_qty:        item.qty_returned      || 0,
              unit_price:        item.unit_price        || 0,
              tax_rate:          item.tax_rate          || 0,
              discount_rate:     item.discount_rate     || 0,
              return_reason:     item.return_reason     || "",
              selected_serials:  returnedSerials.map((s) => s.id),
              available_serials: availableSerials,
              all_serials:       allSerials,
            };
          });

        setLineItems(rows);
        setComments(d.comments       || []);
        setHistory(d.history         || []);
        setAttachments(d.attachments || []);

      } catch (err) {
        console.error("Failed to load SRN:", err);
        toast.error("Failed to load stock return");
      } finally {
        setIsFetching(false);
      }
    };

    loadSrn();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===========================================================================
  // CREATE MODE — when GRN selection changes, auto-fill fields & line items
  // ===========================================================================
  useEffect(() => {
    if (isEditMode) return;

    const fetchGrnItems = async () => {
      if (!returnInput.grn_reference_id) {
        setLineItems([]);
        setReturnInput((prev) => ({
          ...prev,
          po_reference_id: "",
          supplier_name:   "",
          received_date:   "",
        }));
        return;
      }

      try {
        const grn = await stockReceiptApiProvider.fetchSingleStockReceipt(
          returnInput.grn_reference_id
        );
        if (!grn) return;

        setReturnInput((prev) => ({
          ...prev,
          po_reference_id: grn.po_reference_id || grn.po_reference || "",
          supplier_name:   grn.supplier_name   || "",
          received_date:   grn.received_date   || "",
        }));

        // ── Map GRN items → return line items ────────────────────────────────
        //
        // In create mode, none have been returned yet.
        // serial_numbers on a GRN item = serials assigned at receipt time
        // available_serials on a GRN item = serials that are available to return
        //
        // Strategy: use available_serials (or serial_nos) as the choosable pool.
        // selected_serials starts empty — user picks which ones to return.
        // ─────────────────────────────────────────────────────────────────────
        const rows = (grn.items || grn.line_items || []).map((item, idx) => {
          const availableSerials =
            item.available_serials ||
            item.serial_nos       ||
            item.serial_numbers   ||
            [];

          return {
            id:                idx,
            backend_item_id:   null,
            stock_receipt_item: item.id || null,
            product:           item.product || null,          // integer product ID for API
            product_id:        item.product_id || "",
            product_name:      item.product_name || item.name || "",
            uom:               item.uom          || "",
            qty_ordered:       item.qty_ordered  || 0,
            rejected_qty:      item.rejected_qty || item.qty_rejected || 0,
            return_qty:        0,
            unit_price:        item.unit_price   || 0,
            tax_rate:          item.tax_rate     || 0,
            discount_rate:     item.discount_rate || 0,
            return_reason:     "",
            selected_serials:  [],
            available_serials: availableSerials,
            all_serials:       availableSerials,
          };
        });

        setLineItems(rows);
      } catch (err) {
        console.error("Failed to fetch GRN details:", err);
      }
    };

    fetchGrnItems();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnInput.grn_reference_id]);

  // ===========================================================================
  // BUTTON ACCESS CONTROL
  // ===========================================================================
  useEffect(() => {
    switch (ReturnStatus) {
      case "":
        setReturnBtn({ buttonAcs: false, cancel_order: true,  draft: false, submit: false, pdf: true,  mail: true  }); break;
      case "Draft":
        setReturnBtn({ buttonAcs: false, cancel_order: true,  draft: false, submit: false, pdf: false, mail: false }); break;
      case "Submitted":
      case "Submitted(PR)":
        setReturnBtn({ buttonAcs: true,  cancel_order: false, draft: true,  submit: true,  pdf: false, mail: false }); break;
      case "Cancelled":
        setReturnBtn({ buttonAcs: true,  cancel_order: true,  draft: true,  submit: true,  pdf: false, mail: false }); break;
      default: break;
    }
  }, [ReturnStatus]);

  // ===========================================================================
  // FORM INPUT HANDLER
  // ===========================================================================
  const handleReturnInputChange = (e) => {
    setReturnInput((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  // ===========================================================================
  // LINE ITEM CHANGE HANDLER
  // ===========================================================================
  const handleLineItemChange = (rowId, field, value) => {
    setLineItems((prev) =>
      prev.map((row) => (row.id !== rowId ? row : { ...row, [field]: value }))
    );
  };

  // ===========================================================================
  // TOTALS
  // ===========================================================================
  const computedTotals = lineItems.reduce(
    (acc, row) => {
      const qty      = parseFloat(row.return_qty)    || 0;
      const price    = parseFloat(row.unit_price)    || 0;
      const tax      = parseFloat(row.tax_rate)      || 0;
      const discount = parseFloat(row.discount_rate) || 0;

      const lineTotal   = qty * price;
      acc.subtotal      += lineTotal;
      acc.totalTax      += (lineTotal * tax)      / 100;
      acc.totalDiscount += (lineTotal * discount) / 100;
      return acc;
    },
    { subtotal: 0, totalTax: 0, totalDiscount: 0 }
  );

  const globalDiscountAmt =
    (computedTotals.subtotal * (parseFloat(returnInput.global_discount) || 0)) / 100;

  const preRound =
    computedTotals.subtotal +
    computedTotals.totalTax -
    computedTotals.totalDiscount -
    globalDiscountAmt;

  const roundingAdj     = parseFloat((Math.round(preRound) - preRound).toFixed(2));
  const amountToRecover = preRound + roundingAdj;

  // ===========================================================================
  // BUILD PAYLOAD
  // ===========================================================================
  const buildPayload = () => {
    const items = lineItems.map((row) => {
      const selectedSerials = (row.selected_serials || []).map(Number).filter(Boolean);
      const item = {
        ...(row.backend_item_id ? { id: row.backend_item_id } : {}),
        product:       row.product || undefined,
        qty_returned:  parseFloat(row.return_qty) || 0,
        return_reason: row.return_reason || "",
      };
      if (selectedSerials.length > 0) item.serial_numbers = selectedSerials;
      return item;
    });

    const payload = {
      return_date:         returnInput.return_date,
      return_initiated_by: returnInput.return_initiated_by || undefined,
      global_discount:     parseFloat(returnInput.global_discount) || 0,
      items,
    };

    if (returnInput.grn_reference_id)
      payload.grn_reference = Number(returnInput.grn_reference_id);
    if (returnInput.po_reference_id)
      payload.po_reference = returnInput.po_reference_id;
    if (returnInput.received_date)
      payload.received_date = returnInput.received_date;

    return payload;
  };

  // ===========================================================================
  // SAVE / SUBMIT / CANCEL
  // ===========================================================================
  const executeSave = async (action) => {
    if (!returnInput.return_date) { toast.error("Please select a Return Date"); return; }
    if (!returnInput.grn_reference_id && !isEditMode) { toast.error("Please select a GRN Reference"); return; }
    if (lineItems.length === 0) { toast.error("No line items found"); return; }

    // Validate serials: if a row has serials available, selected count must equal return_qty
    const serialMismatch = lineItems.find(
      (row) =>
        row.all_serials?.length > 0 &&
        parseInt(row.return_qty) > 0 &&
        row.selected_serials?.length !== parseInt(row.return_qty)
    );
    if (serialMismatch && action === "submit") {
      toast.warning(
        `"${serialMismatch.product_name}" has ${serialMismatch.return_qty} return qty but ${serialMismatch.selected_serials?.length || 0} serial(s) selected. Please match them before submitting.`
      );
      return;
    }

    setIsLoading(true);
    try {
      let currentId = createdSrnId;

      if (!currentId) {
        const createRes = await stockReturnApiProvider.createStockReturn(buildPayload());
        if (!createRes) return;
        currentId = createRes?.data?.id || createRes?.id;
        const displayId = createRes?.data?.SRN_ID || createRes?.SRN_ID || "";
        setCreatedSrnId(currentId);
        if (displayId) setReturnInput((prev) => ({ ...prev, srn_id: displayId }));
      } else {
        await stockReturnApiProvider.updateStockReturn(currentId, buildPayload());
      }

      await stockReturnApiProvider.actionStockReturn(currentId, action);

      const nextStatus =
        action === "save_draft" ? "Draft"
        : action === "submit"   ? "Submitted"
        : action === "cancel"   ? "Cancelled"
        : ReturnStatus;

      setReturnStatus(nextStatus);

      const label =
        action === "save_draft" ? "Draft saved!"
        : action === "submit"   ? "Submitted successfully!"
        : "Cancelled.";
      toast.success(`Stock Return ${label}`);

    } catch (err) {
      console.error("executeSave error:", err);
      toast.error("Operation failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraftState  = (e) => { e.preventDefault(); executeSave("save_draft"); };
  const handleSubmittedState  = (e) => { e.preventDefault(); executeSave("submit");     };
  const handleCancelledState  = (e) => { e.preventDefault(); executeSave("cancel");     };

  // ===========================================================================
  // COMMENT SUBMIT
  // ===========================================================================
  const handleAddComment = async (text) => {
    if (!createdSrnId || !text.trim()) return;
    try {
      await stockReturnApiProvider.addComment(createdSrnId, text);
      setComments((prev) => [
        { comment: text, created_by: "You", timestamp: new Date().toISOString() },
        ...prev,
      ]);
    } catch (err) {
      console.error("Comment error:", err);
      toast.error("Failed to add comment");
    }
  };

  // ===========================================================================
  // ATTACHMENT UPLOAD / DELETE
  // ===========================================================================
  const handleUploadAttachment = async (file, description = "") => {
    if (!createdSrnId) return;
    try {
      const res = await stockReturnApiProvider.uploadAttachment(createdSrnId, file, description);
      setAttachments((prev) => [...prev, res?.data || res]);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload attachment");
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    if (!createdSrnId) return;
    try {
      await stockReturnApiProvider.deleteAttachment(createdSrnId, attachmentId);
      setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
    } catch (err) {
      console.error("Delete attachment error:", err);
      toast.error("Failed to delete attachment");
    }
  };

  // ===========================================================================
  // STATUS BADGE
  // ===========================================================================
  const statusClass = {
    Draft:           "createNewReturn-Status-draft",
    Submitted:       "createNewReturn-Status-Submitted",
    Cancelled:       "createNewReturn-Status-Cancelled",
    "Submitted(PR)": "createNewReturn-Status-SubmittedPR",
  }[ReturnStatus] || "";

  // ===========================================================================
  // RENDER
  // ===========================================================================
  if (isFetching) {
    return (
      <div className="createNewReturn-container">
        <p style={{ textAlign: "center", padding: "40px" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="createNewReturn-container">
      <form onSubmit={handleSubmittedState}>

        {/* ── HEADER ── */}
        <div className="createNewReturn-head">
          <nav>
            <p>
              {isEditMode
                ? "Edit Stock Return"
                : ReturnStatus === ""
                ? "New Stock Return"
                : "Stock Return"}
            </p>
            {ReturnStatus !== "" && (
              <h3 className={statusClass}>Status: {ReturnStatus}</h3>
            )}
          </nav>
          <div>
            <nav
              className="createNewReturn-close"
              onClick={(e) => { e.preventDefault(); prevpg(-1); }}
            >
              <svg
                className="createNewReturn-circle-x-logo"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
              </svg>
              <p>Close</p>
            </nav>
          </div>
        </div>

        {/* ── HEADER FORM ── */}
        <div className="createNewReturn-input-container">
          <div className="createNewReturn-input-box">
            <label htmlFor="srn_id">SRN ID (Auto Generate)</label>
            <input id="srn_id" type="text" value={returnInput.srn_id} placeholder="Auto Generate" disabled />
          </div>
          <div className="createNewReturn-input-box">
            <label htmlFor="grn_reference_id">GRN Reference ID<sup>*</sup></label>
            {isEditMode ? (
              <input
                id="grn_reference_id"
                type="text"
                value={returnInput.grn_reference_id}
                placeholder="GRN Reference"
                disabled
              />
            ) : (
              <select
                id="grn_reference_id"
                value={returnInput.grn_reference_id}
                onChange={handleReturnInputChange}
                required
                disabled={returnBtn.buttonAcs}
              >
                <option value="">Select GRN Reference</option>
                {grnList.map((grn) => (
                  <option key={grn.id} value={grn.id}>
                    {grn.grn_id || grn.GRN_ID || `GRN-${grn.id}`}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="createNewReturn-input-container">
          <div className="createNewReturn-input-box">
            <label htmlFor="po_reference_id">PO Reference ID<sup>*</sup></label>
            <input id="po_reference_id" type="text" value={returnInput.po_reference_id} placeholder="Auto-filled from GRN" disabled />
          </div>
          <div className="createNewReturn-input-box">
            <label htmlFor="received_date">Received Date</label>
            <input id="received_date" type="date" value={returnInput.received_date} onChange={handleReturnInputChange} disabled={returnBtn.buttonAcs} />
          </div>
        </div>

        <div className="createNewReturn-input-container">
          <div className="createNewReturn-input-box">
            <label htmlFor="return_date">Return Date<sup>*</sup></label>
            <input id="return_date" type="date" value={returnInput.return_date} onChange={handleReturnInputChange} required disabled={returnBtn.buttonAcs} />
          </div>
          <div className="createNewReturn-input-box">
            <label htmlFor="return_initiated_by">Return Initiated By</label>
            <input id="return_initiated_by" type="text" value={returnInput.return_initiated_by} onChange={handleReturnInputChange} placeholder="Enter name" disabled={returnBtn.buttonAcs} />
          </div>
        </div>

        <div className="createNewReturn-input-container">
          <div className="createNewReturn-input-box">
            <label htmlFor="supplier_name">Supplier Name<sup>*</sup></label>
            <input id="supplier_name" type="text" value={returnInput.supplier_name} placeholder="Auto-filled from GRN" disabled />
          </div>
          <div className="createNewReturn-input-box">
            <label htmlFor="global_discount">Global Discount (%)</label>
            <input id="global_discount" type="number" min="0" max="100" value={returnInput.global_discount} onChange={handleReturnInputChange} placeholder="0" disabled={returnBtn.buttonAcs} />
          </div>
        </div>

        {/* ── LINE ITEMS ── */}
        <nav className="createNewReturn-subtit">Line Items<sup>*</sup></nav>
        <div className="createNewReturn-table-container">
          <table>
            <thead className="createNewReturn-table-head">
              <tr>
                <th>#</th>
                <th><pre>Product Name</pre></th>
                <th><pre>Product ID</pre></th>
                <th>UOM</th>
                <th><pre>Qty Ordered</pre></th>
                <th><pre>Rejected Qty</pre></th>
                <th><pre>Return Qty</pre></th>
                <th><pre>Serial No(s)</pre></th>
                <th><pre>Return Reason</pre></th>
                <th><pre>Unit Price</pre></th>
                <th><pre>Tax (%)</pre></th>
                <th><pre>Discount (%)</pre></th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="createNewReturn-table-body">
              {lineItems.length === 0 ? (
                <tr>
                  <td colSpan={14} style={{ textAlign: "center", color: "#999" }}>
                    {returnInput.grn_reference_id
                      ? "Loading items..."
                      : "Select a GRN Reference to load items"}
                  </td>
                </tr>
              ) : (
                lineItems.map((row, idx) => (
                  <ReturnListItem
                    key={row.id}
                    index={idx + 1}
                    rowData={row}
                    buttonAcs={returnBtn.buttonAcs}
                    onFieldChange={handleLineItemChange}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── TOTALS ── */}
        <div className="createNewReturn-totals-container">
          <nav>
            <h5>Returned Subtotal</h5>
            <p>{computedTotals.subtotal.toFixed(2)}</p>
          </nav>
          <nav>
            <h5>Tax Summary</h5>
            <p>{computedTotals.totalTax.toFixed(2)}</p>
          </nav>
          <nav>
            <h5>Line Discount Amount</h5>
            <p>{computedTotals.totalDiscount.toFixed(2)}</p>
          </nav>
          <nav>
            <h5>Global Discount Amount</h5>
            <p>{globalDiscountAmt.toFixed(2)}</p>
          </nav>
          <nav>
            <h5>Rounding Adjustment</h5>
            <p>{roundingAdj.toFixed(2)}</p>
          </nav>
          <nav className="createNewReturn-totals-container-bg">
            <h5>Amount to Recover</h5>
            <p>{amountToRecover.toFixed(2)}</p>
          </nav>
        </div>

        {/* ── COMMENTS / HISTORY / ATTACHMENTS ── */}
        <div className="createNewReturn-hub-container">
          <div className="createNewReturn-hub-head">
            <p
              className={detail.comment    ? "createNewReturn-hub-head-bg-black" : "createNewReturn-hub-head-tit"}
              onClick={() => setDetail({ history: false, attachment: false, comment: true })}
            >Comments</p>
            <p
              className={detail.history    ? "createNewReturn-hub-head-bg-black" : "createNewReturn-hub-head-tit"}
              onClick={() => setDetail({ history: true,  attachment: false, comment: false })}
            >History</p>
            <p
              className={detail.attachment ? "createNewReturn-hub-head-bg-black" : "createNewReturn-hub-head-tit"}
              onClick={() => setDetail({ history: false, attachment: true,  comment: false })}
            >Attachments</p>
          </div>
          <div className="createNewReturn-hub-body">
            {detail.comment    && (
              <ReturnComment
                comments={comments}
                onAddComment={handleAddComment}
                disabled={!createdSrnId}
              />
            )}
            {detail.history    && <ReturnHistory history={history} />}
            {detail.attachment && (
              <ReturnAttachment
                inputDisable={returnBtn.buttonAcs}
                backendFiles={attachments}
                onUpload={handleUploadAttachment}
                onDelete={handleDeleteAttachment}
              />
            )}
          </div>
        </div>

        {/* ── ACTION BUTTONS ── */}
        <div className="createNewReturn-btn-container">
          <button
            type="button"
            className={
              ReturnStatus === "Submitted" ||
              ReturnStatus === "Submitted(PR)" ||
              ReturnStatus === "Cancelled"
                ? "createNewReturn-order-active-btn"
                : "createNewReturn-inactive-btn"
            }
            onClick={handleCancelledState}
            disabled={returnBtn.cancel_order || isLoading}
          >
            {ReturnStatus === "Cancelled" ? "Cancelled" : "Cancel Return"}
          </button>

          <nav>
            <button
              type="button"
              className="createNewReturn-cancel-btn"
              onClick={(e) => { e.preventDefault(); prevpg(-1); }}
            >
              Cancel
            </button>

            <button
              type="button"
              className={
                ReturnStatus === "" || ReturnStatus === "Draft"
                  ? "createNewReturn-active-btn"
                  : "createNewReturn-completed-btn"
              }
              onClick={handleSaveDraftState}
              disabled={returnBtn.draft || isLoading}
            >
              {isLoading ? "Saving..." : "Save Draft"}
            </button>

            <button
              type="submit"
              className={
                ReturnStatus === "" || ReturnStatus === "Draft"
                  ? "createNewReturn-active-btn"
                  : "createNewReturn-completed-btn"
              }
              disabled={returnBtn.submit || isLoading}
            >
              {ReturnStatus === "Submitted" ? "Submitted" : "Submit"}
            </button>

            {/* PDF */}
            <svg
              className={!returnBtn.pdf ? "createNewReturn-pdf-mail-activelogo" : "createNewReturn-pdf-mail-futurelogo"}
              style={{ cursor: !returnBtn.pdf ? "pointer" : "default" }}
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 24" fill="none"
            >
              <path fillRule="evenodd" clipRule="evenodd" d="M0.600098 2.4C0.600098 1.76348 0.852954 1.15303 1.30304 0.702944C1.75313 0.252856 2.36358 0 3.0001 0L16.1313 0L21.4001 5.2688V21.6C21.4001 22.2365 21.1472 22.847 20.6972 23.2971C20.2471 23.7471 19.6366 24 19.0001 24H3.0001C2.36358 24 1.75313 23.7471 1.30304 23.2971C0.852954 22.847 0.600098 22.2365 0.600098 21.6V2.4ZM4.6001 9.6H2.2001V17.6H3.8001V14.4H4.6001C5.23662 14.4 5.84707 14.1471 6.29715 13.6971C6.74724 13.247 7.0001 12.6365 7.0001 12C7.0001 11.3635 6.74724 10.753 6.29715 10.3029C5.84707 9.85286 5.23662 9.6 4.6001 9.6ZM11.0001 9.6H8.6001V17.6H11.0001C11.6366 17.6 12.2471 17.3471 12.6972 16.8971C13.1472 16.447 13.4001 15.8365 13.4001 15.2V12C13.4001 11.3635 13.1472 10.753 12.6972 10.3029C12.2471 9.85286 11.6366 9.6 11.0001 9.6ZM15.0001 17.6V9.6H19.8001V11.2H16.6001V12.8H18.2001V14.4H16.6001V17.6H15.0001Z" />
            </svg>

            {/* Mail */}
            <svg
              className={!returnBtn.mail ? "createNewReturn-pdf-mail-activelogo" : "createNewReturn-pdf-mail-futurelogo"}
              style={{ cursor: !returnBtn.mail ? "pointer" : "default" }}
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 16" fill="none"
            >
              <path d="M2 16C1.45 16 0.979333 15.8043 0.588 15.413C0.196667 15.0217 0.000666667 14.5507 0 14V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196666 1.45067 0.000666667 2 0H18C18.55 0 19.021 0.196 19.413 0.588C19.805 0.98 20.0007 1.45067 18 2V14C20 14.55 19.8043 15.021 19.413 15.413C19.0217 15.805 18.5507 16.0007 18 16H2ZM10 8.825C10.0833 8.825 10.171 8.81233 10.263 8.787C10.355 8.76167 10.4423 8.72433 10.525 8.675L17.6 4.25C17.7333 4.16667 17.8333 4.06267 17.9 3.938C17.9667 3.81333 18 3.67567 18 3.525C18 3.19167 17.8583 2.94167 17.575 2.775C17.2917 2.60833 17 2.61667 16.7 2.8L10 7L3.3 2.8C3 2.61667 2.70833 2.61267 2.425 2.788C2.14167 2.96333 2 3.209 2 3.525C2 3.69167 2.03333 3.83767 2.1 3.963C2.16667 4.08833 2.26667 4.184 2.4 4.25L9.475 8.675C9.55833 8.725 9.646 8.76267 9.738 8.788C9.83 8.81333 9.91733 8.82567 10 8.825Z" />
            </svg>
          </nav>
        </div>

      </form>
    </div>
  );
}