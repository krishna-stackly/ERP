// // // import React, { useEffect, useState } from "react";
// // // import "./createNewQuotation.css";
// // // import QuotationList from "./QuotationList";
// // // import CreateNewQuotationComments from "./createNewQuotationComments";
// // // import CreateNewQuotationHistory from "./createNewQuotationHistory";
// // // import CreateNewQuotationAttachment from "./createNewQuotationAttachment";
// // // import CreateNewQuotationRevision from "./createNewQuotationRevision";
// // // import CreateNewQuptationRevisionHistory from "./createNewQuptationRevisionHistory";
// // // import { toast } from "react-toastify";

// // // export default function createNewQuotation({
// // //   setshowNewQuotation,
// // //   status,
// // //   setStatus,
// // // }) {
// // //   const [comment, setComment] = useState(true);
// // //   const [history, sethistory] = useState(false);
// // //   const [attachment, setattachment] = useState(false);
// // //   //new quotationdata
// // //   const [newQuotationData, setNewQuotationData] = useState({
// // //     quotation_id: "",
// // //     quotation_type: "",
// // //     quotation_date: "",
// // //     expiry_date: "",
// // //     customer_name: "",
// // //     customer_po_referance: "",
// // //     sales_rep: "",
// // //     currency: "",
// // //     payment_terms: "",
// // //     expected_delivery: "",
// // //   });

// // //   const [ApiNewQuotation, setApiNewQuotation] = useState({});
// // //   const [customer_name, setcustomer_name] = useState([]);
// // //   const [sales_rep, setsales_rep] = useState([]);
// // //   const [currency, setcurrency] = useState([]);
// // //   const [quotation_table_data, setquotation_table_data] = useState([]);
// // //   const [descriptions, setdescriptions] = useState([]);
// // //   //total summery
// // //   const [globalDiscount, setGlobalDiscount] = useState(0);
// // //   const [shippingCharges, setShippingCharges] = useState(0);
// // //   //button
// // //   const [buttonState, setButtonState] = useState({
// // //     saveDraft: false,
// // //     submit: false,
// // //     approve: true,
// // //     reject: true,
// // //     salesOrder: true,
// // //     pdf: true,
// // //     email: true,
// // //     historyBtn: true,
// // //     reviseBtn: true,
// // //   });

// // //   const [inputDisable, setinputDisable] = useState(false);

// // //   const [showHistory, setshowHistory] = useState(false);
// // //   const [showRevise, setshowRevise] = useState(false);

// // //   const [reviseCount, setreviseCount] = useState(1);

// // //   // QuotationList Data
// // //   const [numberOfQuotationList, setnumberOfQuotationList] = useState(1);
// // //   const [QuotationList_data, setQuotationList_data] = useState([
// // //     { unique_key: 0 },
// // //   ]);

// // //   const newQuotationFromApi = {
// // //     customer_name: [
// // //       "Mandy",
// // //       "Rose",
// // //       "Sans",
// // //       "Mandy",
// // //       "Rose",
// // //       "Sans",
// // //       "Mandy",
// // //       "Rose",
// // //       "Sans",
// // //       "Mandy",
// // //       "Rose",
// // //       "Sans",
// // //       "Mandy",
// // //       "Rose",
// // //       "Sans",
// // //       "Mandy",
// // //       "Rose",
// // //       "Sans",
// // //       "Mandy",
// // //       "Rose",
// // //       "Sans",
// // //       "Mandy",
// // //       "Rose",
// // //       "Sans",
// // //     ],
// // //     sales_rep: ["Sans", "rose", "Mandy"],
// // //     currency: ["USD", "IND", "ERU", "GBP", "SGD"],

// // //     descriptions: [
// // //       "E-shirt",
// // //       "M-shirt",
// // //       "T-shirt",
// // //       "AlphaWear",
// // //       "MetroStyle",
// // //       "TrendTee",
// // //       "EcoFit",
// // //       "UrbanMode",
// // //       "ClassicEdge",
// // //       "BoldThread",
// // //       "FlexLine",
// // //       "NeoFabric",
// // //       "ZenAttire",
// // //       "PulseWear",
// // //       "VibeCloth",
// // //     ],
// // //     quotation_table_data: [
// // //       {
// // //         product_id: "PRO001",
// // //         description: "E-shirt",
// // //         uom: ["Set (5)", "Box (5)"],
// // //         unit_price: "120",
// // //         discount: "5",
// // //         tax: ["18", "12"],
// // //       },
// // //       {
// // //         product_id: "PRO002",
// // //         description: "M-shirt",
// // //         uom: ["Set (5)", "Box (5)"],
// // //         unit_price: "130",
// // //         discount: "5",
// // //         tax: ["18", "12"],
// // //       },
// // //       {
// // //         product_id: "PRO003",
// // //         description: "T-shirt",
// // //         uom: ["Set (5)", "Box (5)"],
// // //         unit_price: "150",
// // //         discount: "5",
// // //         tax: ["18", "12"],
// // //       },
// // //     ],
// // //   };
// // //   const handleNewQuotationDataChange = (e) => {
// // //     setNewQuotationData((prev) => {
// // //       return { ...prev, [e.target.id]: e.target.value };
// // //     });
// // //   };
// // //   //only for currency Symbol change
// // //   const handleNewQuotationCurrencyChange = (e) => {
// // //     const selected = e.target.value;
// // //     setNewQuotationData((prev) => ({
// // //       ...prev,
// // //       currency: selected,
// // //     }));
// // //   };

// // //   useEffect(() => {
// // //     setApiNewQuotation(newQuotationFromApi);
// // //   }, []);
// // //   useEffect(() => {
// // //     if (Object.keys(ApiNewQuotation).length > 0) {
// // //       setcustomer_name(ApiNewQuotation.customer_name);
// // //       setsales_rep(ApiNewQuotation.sales_rep);
// // //       setcurrency(ApiNewQuotation.currency);
// // //       setdescriptions(ApiNewQuotation.descriptions);
// // //       setquotation_table_data(ApiNewQuotation.quotation_table_data);
// // //     }
// // //   }, [ApiNewQuotation]);

// // //   useEffect(() => {
// // //     const defaultState = {
// // //       saveDraft: true,
// // //       submit: true,
// // //       approve: true,
// // //       reject: true,
// // //       salesOrder: true,
// // //       pdf: false,
// // //       email: false,
// // //       historyBtn: true,
// // //       reviseBtn: false,
// // //     };

// // //     switch (status) {
// // //       case "Draft":
// // //         setButtonState({
// // //           saveDraft: false,
// // //           submit: false,
// // //           approve: true,
// // //           reject: true,
// // //           salesOrder: true,
// // //           pdf: false,
// // //           email: false,
// // //           historyBtn: reviseCount > 1 ? false : true,
// // //           reviseBtn: true,
// // //         });
// // //         break;

// // //       case "Send":
// // //         setButtonState({
// // //           ...defaultState,
// // //           approve: false,
// // //           reject: false,
// // //         });
// // //         break;

// // //       case "Approved":
// // //         setButtonState({
// // //           ...defaultState,
// // //           salesOrder: false,
// // //         });
// // //         break;

// // //       case "Rejected":
// // //       case "Converted (SO)":
// // //       case "Expired":
// // //         setButtonState(defaultState);
// // //         break;

// // //       default:
// // //         break;
// // //     }
// // //   }, [status, reviseCount]);
// // //   useEffect(() => {
// // //     if (
// // //       status === "Send" ||
// // //       status === "Approved" ||
// // //       status === "Rejected" ||
// // //       status === "Converted (SO)" ||
// // //       status === "Expired"
// // //     ) {
// // //       setinputDisable(true);
// // //     } else {
// // //       setinputDisable(false);
// // //     }
// // //   }, [status]);

// // //   // button submit functionality
// // //   const handleSaveDraftState = (e) => {
// // //     e.preventDefault();
// // //     setStatus("Draft");
// // //     toast.success("Quotation Item in Save Draft State");
// // //   };
// // //   const handleSubmitState = (e) => {
// // //     e.preventDefault();
// // //     setStatus("Send");
// // //     toast.success("Quotation Item in send State");
// // //   };
// // //   const handleApprovedState = (e) => {
// // //     e.preventDefault();
// // //     setStatus("Approved");
// // //     toast.success("Quotation Item in Apporved State");
// // //     return "Approved";
// // //   };
// // //   const handleRejectedState = (e) => {
// // //     e.preventDefault();
// // //     setStatus("Rejected");
// // //     toast.success("Quotation Item in Rejected State");
// // //   };
// // //   const handleSalseState = (e) => {
// // //     e.preventDefault();
// // //     setStatus("Converted (SO)");
// // //     toast.success("Quotation Item in Converted (SO) State");
// // //   };
// // //   const handleHistory = (e) => {
// // //     e.preventDefault();
// // //     setshowHistory(true);
// // //   };
// // //   const handleRevise = (e) => {
// // //     e.preventDefault();
// // //     setshowRevise(true);
// // //     setreviseCount((prevCount) => prevCount + 1);
// // //   };

// // //   const handleCancelNewQuotation = (e) => {
// // //     e.preventDefault();
// // //     const okDel = window.confirm(
// // //       "Are you sure you want to Cancel New Quotation?"
// // //     );
// // //     if (okDel) {
// // //       setshowNewQuotation(false);
// // //       setNewQuotationData({
// // //         quotation_id: "",
// // //         quotation_type: "",
// // //         quotation_date: "",
// // //         expiry_date: "",
// // //         customer_name: "",
// // //         customer_po_referance: "",
// // //         sales_rep: "",
// // //         currency: "",
// // //         payment_terms: "",
// // //         expected_delivery: "",
// // //       });
// // //       toast.success("Product Item deleted!");
// // //     }
// // //   };
// // //   function productTotal(ind) {
// // //     const data = QuotationList_data[ind];
// // //     const quantity = parseFloat(data.quantity) || 0;
// // //     const unitPrice = parseFloat(data.unit_price) || 0;
// // //     const discount = parseFloat(data.discount) || 0;
// // //     const tax = parseFloat(data.tax) || 0;

// // //     const subtotal = quantity * unitPrice;
// // //     const taxAmount = (subtotal * tax) / 100;
// // //     const taxedAmount = subtotal + taxAmount;

// // //     const discountAmount = (taxedAmount * discount) / 100;
// // //     const total = taxedAmount - discountAmount;

// // //     return total.toFixed(2); // Total after tax, then discount
// // //   }

// // //   function calculateSubtotal() {
// // //     const total = QuotationList_data.reduce((acc, data) => {
// // //       const quantity = parseFloat(data.quantity) || 0;
// // //       const unitPrice = parseFloat(data.unit_price) || 0;
// // //       const discount = parseFloat(data.discount) || 0;
// // //       const tax = parseFloat(data.tax) || 0;

// // //       const subtotal = quantity * unitPrice;
// // //       const taxAmount = (subtotal * tax) / 100;
// // //       const taxedAmount = subtotal + taxAmount;
// // //       const discountAmount = (taxedAmount * discount) / 100;
// // //       const total = taxedAmount - discountAmount;

// // //       return acc + total;
// // //     }, 0);

// // //     return total.toFixed(2);
// // //   }

// // //   function calculateTaxSummery() {
// // //     const taxTotal = QuotationList_data.reduce((acc, data) => {
// // //       const quantity = parseFloat(data.quantity) || 0;
// // //       const unitPrice = parseFloat(data.unit_price) || 0;
// // //       const tax = parseFloat(data.tax) || 0;

// // //       const subtotal = quantity * unitPrice;
// // //       const taxAmount = (subtotal * tax) / 100;

// // //       return acc + taxAmount;
// // //     }, 0);

// // //     return taxTotal.toFixed(2);
// // //   }

// // //   function calculateGrandTotal() {
// // //     const subtotal = parseFloat(calculateSubtotal()) || 0;
// // //     const discountAmount = (subtotal * globalDiscount) / 100;
// // //     const grandTotal = subtotal - discountAmount + shippingCharges;

// // //     return grandTotal.toFixed(2);
// // //   }

// // //   function roundedGrandTotal() {
// // //     const total = calculateGrandTotal();
// // //     const roundedtotal = total % 1 > 0.5 ? Math.ceil(total) : Math.floor(total);
// // //     return roundedtotal;
// // //   }
// // //   function roundedvalue() {
// // //     const rounded_total = roundedGrandTotal();
// // //     const unrounded_total = parseFloat(calculateGrandTotal()) || 0;
// // //     return (rounded_total - unrounded_total).toFixed(2);
// // //   }

// // //   // deleteQuotationProduct
// // //   function deleteQuotationProduct(ind) {
// // //     const okDel = window.confirm(
// // //       "Are you sure you want to delete this Product?"
// // //     );
// // //     if (okDel) {
// // //       setQuotationList_data((prev) => prev.filter((_, index) => index !== ind));
// // //       setnumberOfQuotationList((prev) => prev - 1);

// // //       toast.success("Product Item deleted!");
// // //     }
// // //   }
// // //   console.log(newQuotationData);

// // //   return (
// // //     <>
// // //       {showRevise && (
// // //         <div className="newQuotation-revisionBtn">
// // //           <CreateNewQuotationRevision
// // //             showRevise={showRevise}
// // //             setshowRevise={setshowRevise}
// // //             reviseCount={reviseCount}
// // //             setreviseCount={setreviseCount}
// // //             status={status}
// // //             setStatus={setStatus}
// // //           />
// // //         </div>
// // //       )}
// // //       {showHistory && (
// // //         <div className="newQuotation-historyBtn">
// // //           <CreateNewQuptationRevisionHistory setshowHistory={setshowHistory} />
// // //         </div>
// // //       )}
// // //       <div
// // //         className={`newQuotation-container ${
// // //           (showRevise || showHistory) && "newQuotation-blur"
// // //         }`}
// // //       >
// // //         <form onSubmit={handleSubmitState}>
// // //           <div className="newQuotation-tit">
// // //             <nav>
// // //               <p>Create New Quotation</p>
// // //               {status !== "" && (
// // //                 <h3
// // //                   className={
// // //                     (status === "Draft" && "newQuotation-status-bg-draft") ||
// // //                     (status === "Send" && "newQuotation-status-bg-send") ||
// // //                     (status === "Approved" &&
// // //                       "newQuotation-status-bg-approved") ||
// // //                     (status === "Rejected" &&
// // //                       "newQuotation-status-bg-rejected") ||
// // //                     (status === "Converted (SO)" &&
// // //                       "newQuotation-status-bg-converted") ||
// // //                     (status === "Expired" && "newQuotation-status-bg-expired")
// // //                   }
// // //                 >
// // //                   Rev:
// // //                   {`${
// // //                     status === "Draft" || status === "Send" ? reviseCount : ""
// // //                   } (${status})`}
// // //                 </h3>
// // //               )}
// // //             </nav>
// // //             <div>
// // //               {(status === "Draft" || status === "Send") && (
// // //                 <>
// // //                   <button
// // //                     className={
// // //                       status === "Draft" && reviseCount > 1
// // //                         ? "newQuotation-active-btn"
// // //                         : "newQuotation-line-btn"
// // //                     }
// // //                     onClick={handleHistory}
// // //                     disabled={buttonState.historyBtn}
// // //                   >
// // //                     Revision History
// // //                   </button>
// // //                   <button
// // //                     className={
// // //                       status === "Send"
// // //                         ? "newQuotation-active-btn"
// // //                         : "newQuotation-line-btn"
// // //                     }
// // //                     onClick={handleRevise}
// // //                     disabled={buttonState.reviseBtn}
// // //                   >
// // //                     Revise
// // //                   </button>
// // //                 </>
// // //               )}

// // //               <div
// // //                 onClick={() => {
// // //                   setshowNewQuotation(false);
// // //                   setStatus("");
// // //                 }}
// // //                 className="close-newQuotation-container"
// // //               >
// // //                 <svg
// // //                   className="circle-x-logo-newQuotation"
// // //                   xmlns="http://www.w3.org/2000/svg"
// // //                   viewBox="0 0 512 512"
// // //                 >
// // //                   <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
// // //                 </svg>
// // //                 <nav>Close</nav>
// // //               </div>
// // //             </div>
// // //           </div>
// // //           <div className="newQuotation-input-container">
// // //             <div className="newQuotation-input-box">
// // //               <label htmlFor="quotation_id">
// // //                 Quotation ID {"(Auto Generate)"}
// // //               </label>
// // //               <input
// // //                 id="quotation_id"
// // //                 type="text"
// // //                 placeholder="Quotation ID"
// // //                 value={newQuotationData.quotation_id}
// // //                 disabled
// // //               />
// // //             </div>
// // //             <div className="newQuotation-input-box">
// // //               <label htmlFor="quotation_type">
// // //                 Quotation Type<sup>*</sup>
// // //               </label>
// // //               <select
// // //                 id="quotation_type"
// // //                 value={newQuotationData.quotation_type}
// // //                 onChange={handleNewQuotationDataChange}
// // //                 disabled={inputDisable}
// // //                 required
// // //               >
// // //                 <option value="">Select Quotation Type</option>
// // //                 <option value="Standard">Standard</option>
// // //                 <option value="Blanket">Blanket</option>
// // //                 <option value="Service">Service</option>
// // //               </select>
// // //             </div>
// // //           </div>
// // //           <div className="newQuotation-input-container">
// // //             <div className="newQuotation-input-box">
// // //               <label htmlFor="quotation_date">
// // //                 Quotation Date<sup>*</sup>
// // //               </label>
// // //               <input
// // //                 id="quotation_date"
// // //                 value={newQuotationData.quotation_date}
// // //                 onChange={handleNewQuotationDataChange}
// // //                 type="date"
// // //                 placeholder="Select Date"
// // //                 required
// // //                 disabled={inputDisable}
// // //               />
// // //             </div>
// // //             <div className="newQuotation-input-box">
// // //               <label htmlFor="expiry_date">
// // //                 Expiry Date<sup>*</sup>
// // //               </label>
// // //               <input
// // //                 id="expiry_date"
// // //                 value={newQuotationData.expiry_date}
// // //                 onChange={handleNewQuotationDataChange}
// // //                 type="date"
// // //                 placeholder="Select Date"
// // //                 required
// // //                 disabled={inputDisable}
// // //               />
// // //             </div>
// // //           </div>
// // //           <div className="newQuotation-input-container">
// // //             <div className="newQuotation-input-box">
// // //               <label htmlFor="customer_name">
// // //                 Customer Name<sup>*</sup>
// // //               </label>
// // //               <select
// // //                 id="customer_name"
// // //                 value={newQuotationData.customer_name}
// // //                 onChange={handleNewQuotationDataChange}
// // //                 required
// // //                 disabled={inputDisable}
// // //               >
// // //                 <option value="">Select Customer</option>
// // //                 {customer_name.map((ele, ind) => (
// // //                   <option key={ind} value={ele}>
// // //                     {ele}
// // //                   </option>
// // //                 ))}
// // //               </select>
// // //             </div>
// // //             <div className="newQuotation-input-box">
// // //               <label htmlFor="customer_po_referance">
// // //                 Customer PO Reference
// // //               </label>
// // //               <input
// // //                 id="customer_po_referance"
// // //                 value={newQuotationData.customer_po_referance}
// // //                 onChange={handleNewQuotationDataChange}
// // //                 type="text"
// // //                 placeholder="PO-45678"
// // //                 disabled={inputDisable}
// // //               />
// // //             </div>
// // //           </div>
// // //           <div className="newQuotation-input-container">
// // //             <div className="newQuotation-input-box">
// // //               <label htmlFor="sales_rep">
// // //                 Sales Rep<sup>*</sup>
// // //               </label>
// // //               <select
// // //                 id="sales_rep"
// // //                 value={newQuotationData.sales_rep}
// // //                 onChange={handleNewQuotationDataChange}
// // //                 required
// // //                 disabled={inputDisable}
// // //               >
// // //                 <option value="">Select Salesperson</option>
// // //                 {sales_rep.map((ele, ind) => (
// // //                   <option key={ind} value={ele}>
// // //                     {ele}
// // //                   </option>
// // //                 ))}
// // //               </select>
// // //             </div>
// // //             <div className="newQuotation-input-box">
// // //               <label htmlFor="currency">
// // //                 Currency<sup>*</sup>
// // //               </label>
// // //               <select
// // //                 id="currency"
// // //                 value={newQuotationData.currency}
// // //                 onChange={handleNewQuotationCurrencyChange}
// // //                 required
// // //                 disabled={inputDisable}
// // //               >
// // //                 <option value="">Select Currency</option>
// // //                 {currency.map((ele, ind) => (
// // //                   <option key={ind} value={ele}>
// // //                     {ele}
// // //                   </option>
// // //                 ))}
// // //               </select>
// // //             </div>
// // //           </div>
// // //           <div className="newQuotation-input-container">
// // //             <div className="newQuotation-input-box">
// // //               <label htmlFor="payment_terms">Payment Terms</label>
// // //               <select
// // //                 id="payment_terms"
// // //                 value={newQuotationData.payment_terms}
// // //                 onChange={handleNewQuotationDataChange}
// // //                 disabled={inputDisable}
// // //               >
// // //                 <option value="">Select Terms</option>
// // //                 <option value="Net 15">Net 15</option>
// // //                 <option value="Net 30">Net 30</option>
// // //                 <option value="Net 45">Net 45</option>
// // //                 <option value="Net 60">Net 60</option>
// // //                 <option value="Advance">Advance</option>
// // //                 <option value="COD">COD</option>
// // //               </select>
// // //             </div>

// // //             <div className="newQuotation-input-box">
// // //               <label htmlFor="expected_delivery">
// // //                 Expected Delivery<sup>*</sup>
// // //               </label>
// // //               <input
// // //                 id="expected_delivery"
// // //                 value={newQuotationData.expected_delivery}
// // //                 onChange={handleNewQuotationDataChange}
// // //                 type="date"
// // //                 placeholder="Select Expected Delivery"
// // //                 required
// // //                 disabled={inputDisable}
// // //               />
// // //             </div>
// // //           </div>
// // //           <nav className="newQuotation-subtit">
// // //             Quotation Items<sup>*</sup>
// // //           </nav>
// // //           <div className="newQuotation-table-container">
// // //             <table>
// // //               <thead className="newQuotation-table-head">
// // //                 <tr>
// // //                   <th id="newQuotation-table-smallwidth">#</th>
// // //                   <th>Product Name</th>
// // //                   <th id="newQuotation-table-minwidth">Product ID</th>
// // //                   <th>Quantity</th>
// // //                   <th>UOM</th>
// // //                   <th>Unit Price</th>
// // //                   <th>Tax {"(%)"}</th>
// // //                   <th>Discount {"(%)"}</th>
// // //                   <th>Total</th>
// // //                   <th>Action</th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody className="newQuotation-table-body">
// // //                 {[...Array(numberOfQuotationList)].map((ele, ind) => (
// // //                   <QuotationList
// // //                     key={ind}
// // //                     unique_key={ind}
// // //                     descriptions={descriptions}
// // //                     quotation_table_data={quotation_table_data}
// // //                     setQuotationList_data={setQuotationList_data}
// // //                     inputDisable={inputDisable}
// // //                     // functions
// // //                     productTotal={productTotal}
// // //                     deleteQuotationProduct={deleteQuotationProduct}
// // //                     //currency
// // //                     newQuotationData={newQuotationData}
// // //                   />
// // //                 ))}
// // //                 <tr>
// // //                   <td></td>
// // //                   <td>
// // //                     <button
// // //                       onClick={(e) => {
// // //                         e.preventDefault();
// // //                         setQuotationList_data((prev) => {
// // //                           return [
// // //                             ...prev,
// // //                             { unique_key: numberOfQuotationList },
// // //                           ];
// // //                         });
// // //                         setnumberOfQuotationList((prev) => ++prev);
// // //                       }}
// // //                       disabled={inputDisable}
// // //                     >
// // //                       + Add Item
// // //                     </button>
// // //                   </td>
// // //                 </tr>
// // //               </tbody>
// // //             </table>
// // //           </div>
// // //           <nav className="newQuotation-subtit">Tax & Totals</nav>
// // //           <div className="newQuotation-totals-container">
// // //             <nav>
// // //               <h5>Subtotal</h5>
// // //               <p> {calculateSubtotal()}</p>
// // //             </nav>
// // //             <nav>
// // //               <h5>Global Discount {"(%)"}</h5>
// // //               <input
// // //                 type="number"
// // //                 value={globalDiscount}
// // //                 onChange={(e) =>
// // //                   setGlobalDiscount(parseFloat(e.target.value) || 0)
// // //                 }
// // //                 disabled={inputDisable}
// // //               />
// // //             </nav>
// // //             <nav>
// // //               <h5>Tax Summary</h5>
// // //               <p> {calculateTaxSummery()}</p>
// // //             </nav>
// // //             <nav>
// // //               <h5>
// // //                 Shipping Charges{" "}
// // //                 {newQuotationData.currency === "IND" && <span>{`(₹)`}</span>}
// // //                 {newQuotationData.currency === "USD" && <span>{`($)`}</span>}
// // //                 {newQuotationData.currency === "GBP" && <span>{`(£)`}</span>}
// // //                 {newQuotationData.currency === "SGD" && <span>{`(S$)`}</span>}
// // //                 {newQuotationData.currency === "ERU" && <span>{`(€)`}</span>}
// // //               </h5>
// // //               <input
// // //                 type="number"
// // //                 value={shippingCharges}
// // //                 onChange={(e) =>
// // //                   setShippingCharges(parseFloat(e.target.value) || 0)
// // //                 }
// // //                 disabled={inputDisable}
// // //               />
// // //             </nav>
// // //             <nav>
// // //               <h5>Rounding Adjustment</h5>
// // //               <p>{roundedvalue()}</p>
// // //             </nav>
// // //             <nav className="newQuotation-totals-container-bg">
// // //               <h5>Grand Total</h5>
// // //               <p>
// // //                 {newQuotationData.currency === "IND" && <span>₹</span>}
// // //                 {newQuotationData.currency === "USD" && <span>$</span>}
// // //                 {newQuotationData.currency === "GBP" && <span>£</span>}
// // //                 {newQuotationData.currency === "SGD" && <span>S$</span>}
// // //                 {newQuotationData.currency === "ERU" && <span>€</span>}
// // //                 {roundedGrandTotal()}
// // //               </p>
// // //             </nav>
// // //           </div>
// // //           <div className="newQuotation-hub-container">
// // //             <div className="newQuotation-hub-head">
// // //               <p
// // //                 className={
// // //                   comment
// // //                     ? "newQuotation-hub-head-bg-black"
// // //                     : "newQuotation-hub-head-tit"
// // //                 }
// // //                 onClick={() => {
// // //                   setComment(true);
// // //                   setattachment(false);
// // //                   sethistory(false);
// // //                 }}
// // //               >
// // //                 Comments
// // //               </p>
// // //               <p
// // //                 className={
// // //                   history
// // //                     ? "newQuotation-hub-head-bg-black"
// // //                     : "newQuotation-hub-head-tit"
// // //                 }
// // //                 onClick={() => {
// // //                   setComment(false);
// // //                   setattachment(false);
// // //                   sethistory(true);
// // //                 }}
// // //               >
// // //                 History
// // //               </p>
// // //               <p
// // //                 className={
// // //                   attachment
// // //                     ? "newQuotation-hub-head-bg-black"
// // //                     : "newQuotation-hub-head-tit"
// // //                 }
// // //                 onClick={() => {
// // //                   setComment(false);
// // //                   setattachment(true);
// // //                   sethistory(false);
// // //                 }}
// // //               >
// // //                 Attachments
// // //               </p>
// // //             </div>
// // //             <div className="newQuotation-hub-body">
// // //               {comment && <CreateNewQuotationComments />}
// // //               {history && <CreateNewQuotationHistory />}
// // //               {attachment && (
// // //                 <CreateNewQuotationAttachment inputDisable={inputDisable} />
// // //               )}
// // //             </div>
// // //           </div>
// // //           <div className="newQuotation-btn-container">
// // //             <button
// // //               className="newQuotation-cancel-btn"
// // //               onClick={handleCancelNewQuotation}
// // //             >
// // //               Cancel
// // //             </button>
// // //             <button
// // //               className={`newQuotation-active-btn ${
// // //                 buttonState.saveDraft && "newQuotation-passed-btn"
// // //               }`}
// // //               onClick={handleSaveDraftState}
// // //               disabled={buttonState.saveDraft}
// // //             >
// // //               Save Draft
// // //             </button>
// // //             <button
// // //               className={`newQuotation-active-btn ${
// // //                 buttonState.submit && "newQuotation-passed-btn"
// // //               }`}
// // //               disabled={buttonState.submit}
// // //             >
// // //               {buttonState.submit ? "Submitted" : "Submit"}
// // //             </button>
// // //             <button
// // //               className={`newQuotation-active-btn ${
// // //                 buttonState.saveDraft &&
// // //                 buttonState.submit &&
// // //                 buttonState.approve &&
// // //                 buttonState.reject
// // //                   ? "newQuotation-passed-btn"
// // //                   : buttonState.approve
// // //                   ? "newQuotation-line-btn"
// // //                   : "newQuotation-active-btn"
// // //               }`}
// // //               onClick={handleApprovedState}
// // //               disabled={buttonState.approve}
// // //             >
// // //               {status === "Approved" || status === "Converted (SO)"
// // //                 ? "Approved"
// // //                 : "Approve"}
// // //             </button>
// // //             <button
// // //               className={`newQuotation-active-btn ${
// // //                 buttonState.saveDraft &&
// // //                 buttonState.submit &&
// // //                 buttonState.approve &&
// // //                 buttonState.reject
// // //                   ? "newQuotation-passed-btn"
// // //                   : buttonState.reject
// // //                   ? "newQuotation-line-btn"
// // //                   : "newQuotation-active-btn"
// // //               }`}
// // //               onClick={handleRejectedState}
// // //               disabled={buttonState.reject}
// // //             >
// // //               {status === "Rejected" ? "Rejected" : "Reject"}
// // //             </button>
// // //             <button
// // //               className={` ${
// // //                 buttonState.saveDraft &&
// // //                 buttonState.submit &&
// // //                 buttonState.approve &&
// // //                 buttonState.salesOrder &&
// // //                 status !== "Rejected"
// // //                   ? "newQuotation-passed-btn"
// // //                   : buttonState.salesOrder
// // //                   ? "newQuotation-line-btn"
// // //                   : "newQuotation-active-btn"
// // //               }`}
// // //               onClick={handleSalseState}
// // //               disabled={buttonState.salesOrder}
// // //             >
// // //               {status === "Converted (SO)"
// // //                 ? "Converted (SO)"
// // //                 : "Convert to (SO)"}
// // //             </button>
// // //             <svg
// // //               disabled={buttonState.pdf}
// // //               className={`newQuotation-pdf-mail-activelogo ${
// // //                 buttonState.pdf && "newQuotation-pdf-mail-futurelogo"
// // //               }`}
// // //               xmlns="http://www.w3.org/2000/svg"
// // //               viewBox="0 0 22 24"
// // //               fill="none"
// // //             >
// // //               <path
// // //                 fillRule="evenodd"
// // //                 clipRule="evenodd"
// // //                 d="M0.600098 2.4C0.600098 1.76348 0.852954 1.15303 1.30304 0.702944C1.75313 0.252856 2.36358 0 3.0001 0L16.1313 0L21.4001 5.2688V21.6C21.4001 22.2365 21.1472 22.847 20.6972 23.2971C20.2471 23.7471 19.6366 24 19.0001 24H3.0001C2.36358 24 1.75313 23.7471 1.30304 23.2971C0.852954 22.847 0.600098 22.2365 0.600098 21.6V2.4ZM4.6001 9.6H2.2001V17.6H3.8001V14.4H4.6001C5.23662 14.4 5.84707 14.1471 6.29715 13.6971C6.74724 13.247 7.0001 12.6365 7.0001 12C7.0001 11.3635 6.74724 10.753 6.29715 10.3029C5.84707 9.85286 5.23662 9.6 4.6001 9.6ZM11.0001 9.6H8.6001V17.6H11.0001C11.6366 17.6 12.2471 17.3471 12.6972 16.8971C13.1472 16.447 13.4001 15.8365 13.4001 15.2V12C13.4001 11.3635 13.1472 10.753 12.6972 10.3029C12.2471 9.85286 11.6366 9.6 11.0001 9.6ZM15.0001 17.6V9.6H19.8001V11.2H16.6001V12.8H18.2001V14.4H16.6001V17.6H15.0001Z"
// // //               />
// // //             </svg>
// // //             <svg
// // //               disabled={buttonState.email}
// // //               className={`newQuotation-pdf-mail-activelogo ${
// // //                 buttonState.email && "newQuotation-pdf-mail-futurelogo"
// // //               }`}
// // //               xmlns="http://www.w3.org/2000/svg"
// // //               viewBox="0 0 20 16"
// // //               fill="none"
// // //             >
// // //               <path d="M2 16C1.45 16 0.979333 15.8043 0.588 15.413C0.196667 15.0217 0.000666667 14.5507 0 14V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196666 1.45067 0.000666667 2 0H18C18.55 0 19.021 0.196 19.413 0.588C19.805 0.98 20.0007 1.45067 20 2V14C20 14.55 19.8043 15.021 19.413 15.413C19.0217 15.805 18.5507 16.0007 18 16H2ZM10 8.825C10.0833 8.825 10.171 8.81233 10.263 8.787C10.355 8.76167 10.4423 8.72433 10.525 8.675L17.6 4.25C17.7333 4.16667 17.8333 4.06267 17.9 3.938C17.9667 3.81333 18 3.67567 18 3.525C18 3.19167 17.8583 2.94167 17.575 2.775C17.2917 2.60833 17 2.61667 16.7 2.8L10 7L3.3 2.8C3 2.61667 2.70833 2.61267 2.425 2.788C2.14167 2.96333 2 3.209 2 3.525C2 3.69167 2.03333 3.83767 2.1 3.963C2.16667 4.08833 2.26667 4.184 2.4 4.25L9.475 8.675C9.55833 8.725 9.646 8.76267 9.738 8.788C9.83 8.81333 9.91733 8.82567 10 8.825Z" />
// // //             </svg>
// // //           </div>
// // //         </form>
// // //       </div>
// // //     </>
// // //   );
// // // }
// // import React, { useEffect, useState } from "react";
// // import "./createNewQuotation.css";
// // import QuotationList from "./QuotationList";
// // import CreateNewQuotationComments from "./createNewQuotationComments";
// // import CreateNewQuotationHistory from "./createNewQuotationHistory";
// // import CreateNewQuotationAttachment from "./createNewQuotationAttachment";
// // import CreateNewQuotationRevision from "./createNewQuotationRevision";
// // import CreateNewQuptationRevisionHistory from "./createNewQuptationRevisionHistory";
// // import quotationApiProvider from "../../../network/quotation-api-provider";
// // import { toast } from "react-toastify";

// // // ✅ Props: pass editQuotationData + isEdit=true for edit mode, omit for create
// // export default function CreateNewQuotation({
// //   setshowNewQuotation,
// //   editQuotationData = {},
// //   isEdit = false,
// // }) {
// //   const isEditMode = isEdit && Object.keys(editQuotationData).length > 0;

// //   const [status, setStatus] = useState(isEditMode ? editQuotationData.status || "" : "");
// //   const [submitting, setSubmitting] = useState(false);

// //   const [comment, setComment] = useState(true);
// //   const [history, sethistory] = useState(false);
// //   const [attachment, setattachment] = useState(false);

// //   const emptyForm = {
// //     quotation_id: "",
// //     quotation_type: "",
// //     quotation_date: "",
// //     expiry_date: "",
// //     customer_name: "",
// //     customer_po_referance: "",
// //     sales_rep: "",
// //     currency: "",
// //     payment_terms: "",
// //     expected_delivery: "",
// //   };

// //   const [newQuotationData, setNewQuotationData] = useState(
// //     isEditMode ? { ...emptyForm, ...editQuotationData } : emptyForm
// //   );

// //   // Dropdown options from API
// //   const [customer_name, setcustomer_name] = useState([]);
// //   const [sales_rep, setsales_rep] = useState([]);
// //   const [currency, setcurrency] = useState([]);
// //   const [quotation_table_data, setquotation_table_data] = useState([]);
// //   const [descriptions, setdescriptions] = useState([]);

// //   // Total summary
// //   const [globalDiscount, setGlobalDiscount] = useState(0);
// //   const [shippingCharges, setShippingCharges] = useState(0);

// //   const [buttonState, setButtonState] = useState({
// //     saveDraft: false,
// //     submit: false,
// //     approve: true,
// //     reject: true,
// //     salesOrder: true,
// //     pdf: true,
// //     email: true,
// //     historyBtn: true,
// //     reviseBtn: true,
// //   });

// //   const [inputDisable, setinputDisable] = useState(false);
// //   const [showHistory, setshowHistory] = useState(false);
// //   const [showRevise, setshowRevise] = useState(false);
// //   const [reviseCount, setreviseCount] = useState(
// //     isEditMode ? editQuotationData.revise_count || 1 : 1
// //   );

// //   const [numberOfQuotationList, setnumberOfQuotationList] = useState(1);
// //   const [QuotationList_data, setQuotationList_data] = useState([{ unique_key: 0 }]);

// //   // ✅ Fetch dropdown options from API
// //   useEffect(() => {
// //     async function loadDropdowns() {
// //       try {
// //         // Replace with your actual endpoints
// //         const res = await quotationApiProvider.fetchDropdownOptions?.();
// //         if (res) {
// //           setcustomer_name(res.customer_name || []);
// //           setsales_rep(res.sales_rep || []);
// //           setcurrency(res.currency || []);
// //           setdescriptions(res.descriptions || []);
// //           setquotation_table_data(res.quotation_table_data || []);
// //         }
// //       } catch (err) {
// //         // Fallback dummy options if endpoint not ready
// //         setcustomer_name(["Mandy", "Rose", "Sans"]);
// //         setsales_rep(["Sans", "Rose", "Mandy"]);
// //         setcurrency(["USD", "IND", "ERU", "GBP", "SGD"]);
// //         setdescriptions(["E-shirt", "M-shirt", "T-shirt"]);
// //       }
// //     }
// //     loadDropdowns();
// //   }, []);

// //   // ✅ Prefill form in edit mode
// //   useEffect(() => {
// //     if (isEditMode) {
// //       setNewQuotationData((prev) => ({ ...prev, ...editQuotationData }));
// //       setStatus(editQuotationData.status || "");
// //       setreviseCount(editQuotationData.revise_count || 1);
// //     }
// //   }, [editQuotationData, isEditMode]);

// //   // Button state based on status
// //   useEffect(() => {
// //     const defaultState = {
// //       saveDraft: true,
// //       submit: true,
// //       approve: true,
// //       reject: true,
// //       salesOrder: true,
// //       pdf: false,
// //       email: false,
// //       historyBtn: true,
// //       reviseBtn: false,
// //     };

// //     switch (status) {
// //       case "Draft":
// //         setButtonState({
// //           saveDraft: false,
// //           submit: false,
// //           approve: true,
// //           reject: true,
// //           salesOrder: true,
// //           pdf: false,
// //           email: false,
// //           historyBtn: reviseCount > 1 ? false : true,
// //           reviseBtn: true,
// //         });
// //         break;
// //       case "Send":
// //         setButtonState({ ...defaultState, approve: false, reject: false });
// //         break;
// //       case "Approved":
// //         setButtonState({ ...defaultState, salesOrder: false });
// //         break;
// //       case "Rejected":
// //       case "Converted (SO)":
// //       case "Expired":
// //         setButtonState(defaultState);
// //         break;
// //       default:
// //         break;
// //     }
// //   }, [status, reviseCount]);

// //   useEffect(() => {
// //     setinputDisable(["Send", "Approved", "Rejected", "Converted (SO)", "Expired"].includes(status));
// //   }, [status]);

// //   const handleNewQuotationDataChange = (e) => {
// //     setNewQuotationData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
// //   };

// //   const handleNewQuotationCurrencyChange = (e) => {
// //     setNewQuotationData((prev) => ({ ...prev, currency: e.target.value }));
// //   };

// //   // ✅ CREATE or UPDATE
// //   async function saveQuotation(newStatus) {
// //     setSubmitting(true);
// //     try {
// //       const payload = {
// //         ...newQuotationData,
// //         status: newStatus,
// //         items: QuotationList_data,
// //         grand_total: roundedGrandTotal(),
// //       };

// //       let result;
// //       if (isEditMode && editQuotationData.id) {
// //         result = await quotationApiProvider.updateQuotation(editQuotationData.id, payload);
// //       } else {
// //         result = await quotationApiProvider.createQuotation(payload);
// //       }

// //       if (result) {
// //         setStatus(newStatus);
// //         toast.success(`Quotation ${newStatus === "Draft" ? "saved as Draft" : newStatus}!`);
// //       }
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   }

// //   const handleSaveDraftState = (e) => { e.preventDefault(); saveQuotation("Draft"); };
// //   const handleSubmitState = (e) => { e.preventDefault(); saveQuotation("Send"); };
// //   const handleApprovedState = (e) => { e.preventDefault(); saveQuotation("Approved"); };
// //   const handleRejectedState = (e) => { e.preventDefault(); saveQuotation("Rejected"); };
// //   const handleSalseState = (e) => { e.preventDefault(); saveQuotation("Converted (SO)"); };

// //   const handleHistory = (e) => { e.preventDefault(); setshowHistory(true); };
// //   const handleRevise = (e) => { e.preventDefault(); setshowRevise(true); setreviseCount((prev) => prev + 1); };

// //   const handleCancelNewQuotation = (e) => {
// //     e.preventDefault();
// //     if (window.confirm("Are you sure you want to cancel?")) {
// //       setshowNewQuotation(false);
// //     }
// //   };

// //   // Calculation helpers
// //   function productTotal(ind) {
// //     const data = QuotationList_data[ind];
// //     const quantity = parseFloat(data?.quantity) || 0;
// //     const unitPrice = parseFloat(data?.unit_price) || 0;
// //     const discount = parseFloat(data?.discount) || 0;
// //     const tax = parseFloat(data?.tax) || 0;
// //     const subtotal = quantity * unitPrice;
// //     const taxAmount = (subtotal * tax) / 100;
// //     const taxedAmount = subtotal + taxAmount;
// //     const discountAmount = (taxedAmount * discount) / 100;
// //     return (taxedAmount - discountAmount).toFixed(2);
// //   }

// //   function calculateSubtotal() {
// //     return QuotationList_data.reduce((acc, data) => {
// //       const q = parseFloat(data?.quantity) || 0;
// //       const u = parseFloat(data?.unit_price) || 0;
// //       const d = parseFloat(data?.discount) || 0;
// //       const t = parseFloat(data?.tax) || 0;
// //       const sub = q * u;
// //       const taxAmt = (sub * t) / 100;
// //       const taxed = sub + taxAmt;
// //       const disc = (taxed * d) / 100;
// //       return acc + (taxed - disc);
// //     }, 0).toFixed(2);
// //   }

// //   function calculateTaxSummery() {
// //     return QuotationList_data.reduce((acc, data) => {
// //       const q = parseFloat(data?.quantity) || 0;
// //       const u = parseFloat(data?.unit_price) || 0;
// //       const t = parseFloat(data?.tax) || 0;
// //       return acc + (q * u * t) / 100;
// //     }, 0).toFixed(2);
// //   }

// //   function calculateGrandTotal() {
// //     const subtotal = parseFloat(calculateSubtotal()) || 0;
// //     const discountAmount = (subtotal * globalDiscount) / 100;
// //     return (subtotal - discountAmount + parseFloat(shippingCharges || 0)).toFixed(2);
// //   }

// //   function roundedGrandTotal() {
// //     const total = parseFloat(calculateGrandTotal());
// //     return total % 1 > 0.5 ? Math.ceil(total) : Math.floor(total);
// //   }

// //   function roundedvalue() {
// //     return (roundedGrandTotal() - parseFloat(calculateGrandTotal())).toFixed(2);
// //   }

// //   function deleteQuotationProduct(ind) {
// //     if (window.confirm("Are you sure you want to delete this Product?")) {
// //       setQuotationList_data((prev) => prev.filter((_, i) => i !== ind));
// //       setnumberOfQuotationList((prev) => prev - 1);
// //     }
// //   }

// //   const currencySymbol = {
// //     IND: "₹", USD: "$", GBP: "£", SGD: "S$", ERU: "€",
// //   }[newQuotationData.currency] || "";

// //   return (
// //     <>
// //       {showRevise && (
// //         <div className="newQuotation-revisionBtn">
// //           <CreateNewQuotationRevision
// //             showRevise={showRevise}
// //             setshowRevise={setshowRevise}
// //             reviseCount={reviseCount}
// //             setreviseCount={setreviseCount}
// //             status={status}
// //             setStatus={setStatus}
// //           />
// //         </div>
// //       )}
// //       {showHistory && (
// //         <div className="newQuotation-historyBtn">
// //           <CreateNewQuptationRevisionHistory setshowHistory={setshowHistory} />
// //         </div>
// //       )}

// //       <div className={`newQuotation-container ${(showRevise || showHistory) ? "newQuotation-blur" : ""}`}>
// //         <form onSubmit={handleSubmitState}>
// //           {/* Header */}
// //           <div className="newQuotation-tit">
// //             <nav>
// //               <p>{isEditMode ? "Edit Quotation" : "Create New Quotation"}</p>
// //               {status !== "" && (
// //                 <h3 className={`newQuotation-status-bg-${status.toLowerCase().replace(/[^a-z]/g, "")}`}>
// //                   Rev:{`${["Draft", "Send"].includes(status) ? reviseCount : ""} (${status})`}
// //                 </h3>
// //               )}
// //             </nav>
// //             <div>
// //               {["Draft", "Send"].includes(status) && (
// //                 <>
// //                   <button
// //                     className={status === "Draft" && reviseCount > 1 ? "newQuotation-active-btn" : "newQuotation-line-btn"}
// //                     onClick={handleHistory}
// //                     disabled={buttonState.historyBtn}
// //                   >
// //                     Revision History
// //                   </button>
// //                   <button
// //                     className={status === "Send" ? "newQuotation-active-btn" : "newQuotation-line-btn"}
// //                     onClick={handleRevise}
// //                     disabled={buttonState.reviseBtn}
// //                   >
// //                     Revise
// //                   </button>
// //                 </>
// //               )}
// //               <div
// //                 onClick={() => setshowNewQuotation(false)}
// //                 className="close-newQuotation-container"
// //               >
// //                 <svg className="circle-x-logo-newQuotation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
// //                   <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
// //                 </svg>
// //                 <nav>Close</nav>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Form Inputs */}
// //           <div className="newQuotation-input-container">
// //             <div className="newQuotation-input-box">
// //               <label htmlFor="quotation_id">Quotation ID (Auto Generate)</label>
// //               <input id="quotation_id" type="text" placeholder="Quotation ID" value={newQuotationData.quotation_id} disabled />
// //             </div>
// //             <div className="newQuotation-input-box">
// //               <label htmlFor="quotation_type">Quotation Type<sup>*</sup></label>
// //               <select id="quotation_type" value={newQuotationData.quotation_type} onChange={handleNewQuotationDataChange} disabled={inputDisable} required>
// //                 <option value="">Select Quotation Type</option>
// //                 <option value="Standard">Standard</option>
// //                 <option value="Blanket">Blanket</option>
// //                 <option value="Service">Service</option>
// //               </select>
// //             </div>
// //           </div>

// //           <div className="newQuotation-input-container">
// //             <div className="newQuotation-input-box">
// //               <label htmlFor="quotation_date">Quotation Date<sup>*</sup></label>
// //               <input id="quotation_date" value={newQuotationData.quotation_date} onChange={handleNewQuotationDataChange} type="date" required disabled={inputDisable} />
// //             </div>
// //             <div className="newQuotation-input-box">
// //               <label htmlFor="expiry_date">Expiry Date<sup>*</sup></label>
// //               <input id="expiry_date" value={newQuotationData.expiry_date} onChange={handleNewQuotationDataChange} type="date" required disabled={inputDisable} />
// //             </div>
// //           </div>

// //           <div className="newQuotation-input-container">
// //             <div className="newQuotation-input-box">
// //               <label htmlFor="customer_name">Customer Name<sup>*</sup></label>
// //               <select id="customer_name" value={newQuotationData.customer_name} onChange={handleNewQuotationDataChange} required disabled={inputDisable}>
// //                 <option value="">Select Customer</option>
// //                 {customer_name.map((ele, ind) => <option key={ind} value={ele}>{ele}</option>)}
// //               </select>
// //             </div>
// //             <div className="newQuotation-input-box">
// //               <label htmlFor="customer_po_referance">Customer PO Reference</label>
// //               <input id="customer_po_referance" value={newQuotationData.customer_po_referance} onChange={handleNewQuotationDataChange} type="text" placeholder="PO-45678" disabled={inputDisable} />
// //             </div>
// //           </div>

// //           <div className="newQuotation-input-container">
// //             <div className="newQuotation-input-box">
// //               <label htmlFor="sales_rep">Sales Rep<sup>*</sup></label>
// //               <select id="sales_rep" value={newQuotationData.sales_rep} onChange={handleNewQuotationDataChange} required disabled={inputDisable}>
// //                 <option value="">Select Salesperson</option>
// //                 {sales_rep.map((ele, ind) => <option key={ind} value={ele}>{ele}</option>)}
// //               </select>
// //             </div>
// //             <div className="newQuotation-input-box">
// //               <label htmlFor="currency">Currency<sup>*</sup></label>
// //               <select id="currency" value={newQuotationData.currency} onChange={handleNewQuotationCurrencyChange} required disabled={inputDisable}>
// //                 <option value="">Select Currency</option>
// //                 {currency.map((ele, ind) => <option key={ind} value={ele}>{ele}</option>)}
// //               </select>
// //             </div>
// //           </div>

// //           <div className="newQuotation-input-container">
// //             <div className="newQuotation-input-box">
// //               <label htmlFor="payment_terms">Payment Terms</label>
// //               <select id="payment_terms" value={newQuotationData.payment_terms} onChange={handleNewQuotationDataChange} disabled={inputDisable}>
// //                 <option value="">Select Terms</option>
// //                 <option value="Net 15">Net 15</option>
// //                 <option value="Net 30">Net 30</option>
// //                 <option value="Net 45">Net 45</option>
// //                 <option value="Net 60">Net 60</option>
// //                 <option value="Advance">Advance</option>
// //                 <option value="COD">COD</option>
// //               </select>
// //             </div>
// //             <div className="newQuotation-input-box">
// //               <label htmlFor="expected_delivery">Expected Delivery<sup>*</sup></label>
// //               <input id="expected_delivery" value={newQuotationData.expected_delivery} onChange={handleNewQuotationDataChange} type="date" required disabled={inputDisable} />
// //             </div>
// //           </div>

// //           {/* Quotation Items Table */}
// //           <nav className="newQuotation-subtit">Quotation Items<sup>*</sup></nav>
// //           <div className="newQuotation-table-container">
// //             <table>
// //               <thead className="newQuotation-table-head">
// //                 <tr>
// //                   <th id="newQuotation-table-smallwidth">#</th>
// //                   <th>Product Name</th>
// //                   <th id="newQuotation-table-minwidth">Product ID</th>
// //                   <th>Quantity</th>
// //                   <th>UOM</th>
// //                   <th>Unit Price</th>
// //                   <th>Tax (%)</th>
// //                   <th>Discount (%)</th>
// //                   <th>Total</th>
// //                   <th>Action</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="newQuotation-table-body">
// //                 {[...Array(numberOfQuotationList)].map((_, ind) => (
// //                   <QuotationList
// //                     key={ind}
// //                     unique_key={ind}
// //                     descriptions={descriptions}
// //                     quotation_table_data={quotation_table_data}
// //                     setQuotationList_data={setQuotationList_data}
// //                     inputDisable={inputDisable}
// //                     productTotal={productTotal}
// //                     deleteQuotationProduct={deleteQuotationProduct}
// //                     newQuotationData={newQuotationData}
// //                   />
// //                 ))}
// //                 <tr>
// //                   <td></td>
// //                   <td>
// //                     <button
// //                       onClick={(e) => {
// //                         e.preventDefault();
// //                         setQuotationList_data((prev) => [...prev, { unique_key: numberOfQuotationList }]);
// //                         setnumberOfQuotationList((prev) => prev + 1);
// //                       }}
// //                       disabled={inputDisable}
// //                     >
// //                       + Add Item
// //                     </button>
// //                   </td>
// //                 </tr>
// //               </tbody>
// //             </table>
// //           </div>

// //           {/* Tax & Totals */}
// //           <nav className="newQuotation-subtit">Tax & Totals</nav>
// //           <div className="newQuotation-totals-container">
// //             <nav><h5>Subtotal</h5><p>{calculateSubtotal()}</p></nav>
// //             <nav>
// //               <h5>Global Discount (%)</h5>
// //               <input type="number" value={globalDiscount} onChange={(e) => setGlobalDiscount(parseFloat(e.target.value) || 0)} disabled={inputDisable} />
// //             </nav>
// //             <nav><h5>Tax Summary</h5><p>{calculateTaxSummery()}</p></nav>
// //             <nav>
// //               <h5>Shipping Charges {currencySymbol && `(${currencySymbol})`}</h5>
// //               <input type="number" value={shippingCharges} onChange={(e) => setShippingCharges(parseFloat(e.target.value) || 0)} disabled={inputDisable} />
// //             </nav>
// //             <nav><h5>Rounding Adjustment</h5><p>{roundedvalue()}</p></nav>
// //             <nav className="newQuotation-totals-container-bg">
// //               <h5>Grand Total</h5>
// //               <p>{currencySymbol}{roundedGrandTotal()}</p>
// //             </nav>
// //           </div>

// //           {/* Hub: Comments / History / Attachments */}
// //           <div className="newQuotation-hub-container">
// //             <div className="newQuotation-hub-head">
// //               {[["Comments", comment, () => { setComment(true); setattachment(false); sethistory(false); }],
// //                 ["History", history, () => { setComment(false); setattachment(false); sethistory(true); }],
// //                 ["Attachments", attachment, () => { setComment(false); setattachment(true); sethistory(false); }]
// //               ].map(([label, active, onClick]) => (
// //                 <p key={label} className={active ? "newQuotation-hub-head-bg-black" : "newQuotation-hub-head-tit"} onClick={onClick}>{label}</p>
// //               ))}
// //             </div>
// //             <div className="newQuotation-hub-body">
// //               {comment && <CreateNewQuotationComments />}
// //               {history && <CreateNewQuotationHistory />}
// //               {attachment && <CreateNewQuotationAttachment inputDisable={inputDisable} />}
// //             </div>
// //           </div>

// //           {/* Action Buttons */}
// //           <div className="newQuotation-btn-container">
// //             <button className="newQuotation-cancel-btn" onClick={handleCancelNewQuotation}>Cancel</button>
// //             <button
// //               className={`newQuotation-active-btn ${buttonState.saveDraft ? "newQuotation-passed-btn" : ""}`}
// //               onClick={handleSaveDraftState}
// //               disabled={buttonState.saveDraft || submitting}
// //             >
// //               Save Draft
// //             </button>
// //             <button
// //               className={`newQuotation-active-btn ${buttonState.submit ? "newQuotation-passed-btn" : ""}`}
// //               disabled={buttonState.submit || submitting}
// //             >
// //               {buttonState.submit ? "Submitted" : submitting ? "Saving..." : "Submit"}
// //             </button>
// //             <button
// //               className={`newQuotation-active-btn ${buttonState.approve ? "newQuotation-line-btn" : ""}`}
// //               onClick={handleApprovedState}
// //               disabled={buttonState.approve || submitting}
// //             >
// //               {["Approved", "Converted (SO)"].includes(status) ? "Approved" : "Approve"}
// //             </button>
// //             <button
// //               className={`newQuotation-active-btn ${buttonState.reject ? "newQuotation-line-btn" : ""}`}
// //               onClick={handleRejectedState}
// //               disabled={buttonState.reject || submitting}
// //             >
// //               {status === "Rejected" ? "Rejected" : "Reject"}
// //             </button>
// //             <button
// //               className={`${buttonState.salesOrder ? "newQuotation-line-btn" : "newQuotation-active-btn"}`}
// //               onClick={handleSalseState}
// //               disabled={buttonState.salesOrder || submitting}
// //             >
// //               {status === "Converted (SO)" ? "Converted (SO)" : "Convert to (SO)"}
// //             </button>
// //             <svg disabled={buttonState.pdf} className={`newQuotation-pdf-mail-activelogo ${buttonState.pdf ? "newQuotation-pdf-mail-futurelogo" : ""}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 24" fill="none">
// //               <path fillRule="evenodd" clipRule="evenodd" d="M0.600098 2.4C0.600098 1.76348 0.852954 1.15303 1.30304 0.702944C1.75313 0.252856 2.36358 0 3.0001 0L16.1313 0L21.4001 5.2688V21.6C21.4001 22.2365 21.1472 22.847 20.6972 23.2971C20.2471 23.7471 19.6366 24 19.0001 24H3.0001C2.36358 24 1.75313 23.7471 1.30304 23.2971C0.852954 22.847 0.600098 22.2365 0.600098 21.6V2.4ZM4.6001 9.6H2.2001V17.6H3.8001V14.4H4.6001C5.23662 14.4 5.84707 14.1471 6.29715 13.6971C6.74724 13.247 7.0001 12.6365 7.0001 12C7.0001 11.3635 6.74724 10.753 6.29715 10.3029C5.84707 9.85286 5.23662 9.6 4.6001 9.6ZM11.0001 9.6H8.6001V17.6H11.0001C11.6366 17.6 12.2471 17.3471 12.6972 16.8971C13.1472 16.447 13.4001 15.8365 13.4001 15.2V12C13.4001 11.3635 13.1472 10.753 12.6972 10.3029C12.2471 9.85286 11.6366 9.6 11.0001 9.6ZM15.0001 17.6V9.6H19.8001V11.2H16.6001V12.8H18.2001V14.4H16.6001V17.6H15.0001Z" />
// //             </svg>
// //             <svg disabled={buttonState.email} className={`newQuotation-pdf-mail-activelogo ${buttonState.email ? "newQuotation-pdf-mail-futurelogo" : ""}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 16" fill="none">
// //               <path d="M2 16C1.45 16 0.979333 15.8043 0.588 15.413C0.196667 15.0217 0.000666667 14.5507 0 14V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196666 1.45067 0.000666667 2 0H18C18.55 0 19.021 0.196 19.413 0.588C19.805 0.98 20.0007 1.45067 20 2V14C20 14.55 19.8043 15.021 19.413 15.413C19.0217 15.805 18.5507 16.0007 18 16H2ZM10 8.825C10.0833 8.825 10.171 8.81233 10.263 8.787C10.355 8.76167 10.4423 8.72433 10.525 8.675L17.6 4.25C17.7333 4.16667 17.8333 4.06267 17.9 3.938C17.9667 3.81333 18 3.67567 18 3.525C18 3.19167 17.8583 2.94167 17.575 2.775C17.2917 2.60833 17 2.61667 16.7 2.8L10 7L3.3 2.8C3 2.61667 2.70833 2.61267 2.425 2.788C2.14167 2.96333 2 3.209 2 3.525C2 3.69167 2.03333 3.83767 2.1 3.963C2.16667 4.08833 2.26667 4.184 2.4 4.25L9.475 8.675C9.55833 8.725 9.646 8.76267 9.738 8.788C9.83 8.81333 9.91733 8.82567 10 8.825Z" />
// //             </svg>
// //           </div>
// //         </form>
// //       </div>
// //     </>
// //   );
// // }
// import React, { useEffect, useRef, useState } from "react";
// import "./createNewQuotation.css";
// import ApiClient from "../../../network/api-client";
// import QuotationList from "./QuotationList";
// import CreateNewQuotationComments from "./createNewQuotationComments";
// import CreateNewQuotationHistory from "./createNewQuotationHistory";
// import CreateNewQuotationAttachment from "./createNewQuotationAttachment";
// import CreateNewQuotationRevision from "./createNewQuotationRevision";
// import CreateNewQuptationRevisionHistory from "./createNewQuptationRevisionHistory";
// import quotationApiProvider from "../../../network/quotation-api-provider";
// import { toast } from "react-toastify";

// // ─── map full API quotation response → flat form ──────────────────────────────
// function mapQuotationToForm(q) {
//   if (!q || !Object.keys(q).length) return null;
//   const cus = q.customer || {};

//   return {
//     quotation_id:          q.quotation_id          || "",
//     quotation_type:        q.quotation_type        || "",
//     quotation_date:        q.quotation_date        || "",
//     expiry_date:           q.expiry_date           || "",
//     customer_name:         cus.id                  || "",   // ✅ ID for API payload
//     customer_display:      cus.first_name
//       ? `${cus.first_name} ${cus.last_name || ""}`.trim()
//       : "",
//     customer_po_referance: q.customer_po_reference || "",
//     sales_rep:             q.sales_rep_id          || "",   // ✅ ID — see note below
//     sales_rep_display:     q.sales_rep             || "",   // ✅ display name string
//     currency:              q.currency              || "",
//     payment_terms:         q.payment_terms         || "",
//     expected_delivery:     q.expected_delivery     || "",
//     status:                q.status                || "",
//     revise_count:          q.revise_count          || 0,
//     global_discount:       parseFloat(q.global_discount)  || 0,
//     shipping_charges:      parseFloat(q.shipping_charges) || 0,
//   };
// }

// // ─── map API items → QuotationList rows ──────────────────────────────────────
// function mapItemsToRows(items = []) {
//   return items.map((item, index) => ({
//     unique_key:    index,
//     item_id:       item.id,
//     product:       item.product,
//     product_name:  item.product_name       || "",
//     product_id:    item.product_id_display  || "",
//     uom:           item.uom,
//     unit_price:    item.unit_price          || 0,
//     discount:      item.discount            || 0,
//     tax:           item.tax,
//     tax_rate:      item.tax_rate            || 0,
//     quantity:      item.quantity            || 0,
//     total:         item.total               || 0,
//   }));
// }

// const emptyForm = {
//   quotation_id:          "",
//   quotation_type:        "",
//   quotation_date:        "",
//   expiry_date:           "",
//   customer_name:         "",
//   customer_display:      "",
//   customer_po_referance: "",
//   sales_rep:             "",
//   sales_rep_display:     "",
//   currency:              "",
//   payment_terms:         "",
//   expected_delivery:     "",
//   status:                "",
//   revise_count:          1,
//   global_discount:       0,
//   shipping_charges:      0,
// };

// export default function CreateNewQuotation({
//   setshowNewQuotation,
//   editQuotationData = {},
//   isEdit = false,
// }) {
//   const isEditMode = isEdit && Object.keys(editQuotationData).length > 0;

//   const [pageLoading, setPageLoading] = useState(isEditMode);
//   const [submitting,  setSubmitting]  = useState(false);
//   const [dbId,        setDbId]        = useState(
//     isEditMode ? editQuotationData.id || null : null
//   );

//   const [formData,     setFormData]     = useState(emptyForm);
//   const [status,       setStatus]       = useState("");
//   const [reviseCount,  setreviseCount]  = useState(1);

//   // line items
//   const [QuotationList_data,      setQuotationList_data]      = useState([{ unique_key: 0 }]);
//   const [numberOfQuotationList,   setnumberOfQuotationList]   = useState(1);

//   // hub data (real)
//   const [comments,    setComments]    = useState([]);
//   const [history,     setHistory]     = useState([]);
//   const [attachments, setAttachments] = useState([]);
//   const [revisions,   setRevisions]   = useState([]);
//   const [newComment,  setNewComment]  = useState("");

//   // dropdown options
//   const [customers,    setCustomers]    = useState([]);
//   const [salesReps,    setSalesReps]    = useState([]);
//   const [currencies,   setCurrencies]   = useState([]);
//   const [descriptions, setdescriptions] = useState([]);
//   const [quotation_table_data, setquotation_table_data] = useState([]);

//   // totals
//   const [globalDiscount,  setGlobalDiscount]  = useState(0);
//   const [shippingCharges, setShippingCharges] = useState(0);

//   // UI state
//   const [inputDisable,  setinputDisable]  = useState(false);
//   const [showHistory,   setshowHistory]   = useState(false);
//   const [showRevise,    setshowRevise]    = useState(false);
//   const [activeTab,     setActiveTab]     = useState("comments");
//   const fileInputRef = useRef(null);

//   const [buttonState, setButtonState] = useState({
//     saveDraft: false,
//     submit:    false,
//     approve:   true,
//     reject:    true,
//     salesOrder: true,
//     pdf:       true,
//     email:     true,
//     historyBtn: true,
//     reviseBtn:  true,
//   });

//   // ─── apply full quotation object to all state ───────────────────────────────
//   function applyQuotationToState(q) {
//   const mapped = mapQuotationToForm(q);
//   if (!mapped) return;

//   // ✅ try to find sales_rep ID from the loaded salesReps list by matching display name
//   // We'll do this after salesReps are loaded — store the display name for now
//   setFormData(mapped);
//   setStatus(mapped.status);
//   setreviseCount(mapped.revise_count);
//   setGlobalDiscount(mapped.global_discount);
//   setShippingCharges(mapped.shipping_charges);
//   setDbId(q.id || null);
//   setComments(q.comments    || []);
//   setHistory(q.history      || []);
//   setAttachments(q.attachments || []);
//   setRevisions(q.revisions   || []);

//   if (q.items?.length > 0) {
//     const rows = mapItemsToRows(q.items);
//     setQuotationList_data(rows);
//     setnumberOfQuotationList(rows.length);
//   }
// }

//   // ─── ON MOUNT ───────────────────────────────────────────────────────────────
//   // useEffect(() => {
//   //   async function init() {
//   //     // load master dropdown data
//   //     try {
//   //       const [cusRes, repRes, prodRes] = await Promise.all([
//   //         fetch("/api/masters/customers/").then((r) => r.json()).catch(() => null),
//   //         fetch("/api/masters/users/").then((r) => r.json()).catch(() => null),
//   //         fetch("/api/masters/products/").then((r) => r.json()).catch(() => null),
//   //       ]);

//   //       if (cusRes) {
//   //         const list = cusRes?.data?.data ?? cusRes?.data ?? cusRes?.results ?? [];
//   //         setCustomers(list);
//   //       }
//   //       if (repRes) {
//   //         const list = repRes?.data?.data ?? repRes?.data ?? repRes?.results ?? [];
//   //         setSalesReps(list);
//   //       }
//   //       if (prodRes) {
//   //         const list = prodRes?.data?.data ?? prodRes?.data ?? prodRes?.results ?? [];
//   //         setdescriptions(list.map((p) => p.name || p.product_name || ""));
//   //         setquotation_table_data(list);
//   //       }
//   //       setCurrencies(["INR", "USD", "EUR", "GBP", "SGD"]);
//   //     } catch (err) {
//   //       // fallback
//   //       setCurrencies(["INR", "USD", "EUR", "GBP", "SGD"]);
//   //     }

//   //     // edit mode — fetch full detail
//   //     if (isEditMode) {
//   //       const id     = editQuotationData.id;
//   //       const detail = id
//   //         ? await quotationApiProvider.fetchSingleQuotation(id)
//   //         : null;
//   //       applyQuotationToState(detail?.data || detail || editQuotationData);
//   //     }
//   //     setPageLoading(false);
//   //   }
//   //   init();
//   //   // eslint-disable-next-line react-hooks/exhaustive-deps
//   // }, []);
//   useEffect(() => {
//   async function init() {
//     let loadedCustomers = [];
//     let loadedSalesReps = [];

//     try {
//       const [cusRes, repRes, prodRes] = await Promise.all([
//         ApiClient.get("/masters/customers/").catch(() => null),
//         ApiClient.get("/masters/users/").catch(() => null),
//         ApiClient.get("/masters/products/").catch(() => null),
//       ]);

//       if (cusRes?.status === 200) {
//         loadedCustomers =
//           cusRes.data?.data?.data ??
//           cusRes.data?.data       ??
//           cusRes.data?.results    ??
//           cusRes.data             ?? [];
//         setCustomers(loadedCustomers);
//       }

//       if (repRes?.status === 200) {
//         loadedSalesReps =
//           repRes.data?.data?.data ??
//           repRes.data?.data       ??
//           repRes.data?.results    ??
//           repRes.data             ?? [];
//         setSalesReps(loadedSalesReps);
//       }

//       if (prodRes?.status === 200) {
//         const list =
//           prodRes.data?.data?.data ??
//           prodRes.data?.data       ??
//           prodRes.data?.results    ??
//           prodRes.data             ?? [];
//         setdescriptions(list.map((p) => p.product_name || p.name || ""));
//         setquotation_table_data(list);
//       }

//       setCurrencies(["INR", "USD", "EUR", "GBP", "SGD"]);
//     } catch (err) {
//       setCurrencies(["INR", "USD", "EUR", "GBP", "SGD"]);
//     }

//     // edit mode — fetch full detail then resolve IDs
//     if (isEditMode) {
//       const id     = editQuotationData.id;
//       const detail = id
//         ? await quotationApiProvider.fetchSingleQuotation(id)
//         : null;

//       const q = detail || editQuotationData;
//       applyQuotationToState(q);

//       // ✅ resolve sales_rep ID by matching display name against loaded users
//       if (q.sales_rep && loadedSalesReps.length > 0) {
//         const match = loadedSalesReps.find(
//           (r) =>
//             `${r.first_name || ""} ${r.last_name || ""}`.trim() === q.sales_rep ||
//             r.first_name === q.sales_rep
//         );
//         if (match) {
//           setFormData((prev) => ({ ...prev, sales_rep: match.id }));
//         }
//       }

//       // ✅ resolve customer ID (already set from cus.id but set display too)
//       if (q.customer?.id && loadedCustomers.length > 0) {
//         setFormData((prev) => ({
//           ...prev,
//           customer_name:    q.customer.id,
//           customer_display: q.customer.first_name
//             ? `${q.customer.first_name} ${q.customer.last_name || ""}`.trim()
//             : "",
//         }));
//       }
//     }

//     setPageLoading(false);
//   }
//   init();
//   // eslint-disable-next-line react-hooks/exhaustive-deps
// }, []);

//   // ─── button state by status ─────────────────────────────────────────────────
//   useEffect(() => {
//     switch (status) {
//       case "":
//       case "Draft":
//         setButtonState({
//           saveDraft:  false,
//           submit:     false,
//           approve:    true,
//           reject:     true,
//           salesOrder: true,
//           pdf:        status === "Draft" ? false : true,
//           email:      status === "Draft" ? false : true,
//           historyBtn: reviseCount > 1 ? false : true,
//           reviseBtn:  status === "Draft" ? false : true,
//         });
//         setinputDisable(false);
//         break;
//       case "Submitted":
//         setButtonState({
//           saveDraft:  true,
//           submit:     true,
//           approve:    false,
//           reject:     false,
//           salesOrder: true,
//           pdf:        false,
//           email:      false,
//           historyBtn: false,
//           reviseBtn:  false,
//         });
//         setinputDisable(true);
//         break;
//       case "Approved":
//         setButtonState({
//           saveDraft:  true,
//           submit:     true,
//           approve:    true,
//           reject:     true,
//           salesOrder: false,
//           pdf:        false,
//           email:      false,
//           historyBtn: false,
//           reviseBtn:  true,
//         });
//         setinputDisable(true);
//         break;
//       case "Rejected":
//       case "Converted (SO)":
//       case "Expired":
//         setButtonState({
//           saveDraft:  true,
//           submit:     true,
//           approve:    true,
//           reject:     true,
//           salesOrder: true,
//           pdf:        false,
//           email:      false,
//           historyBtn: false,
//           reviseBtn:  true,
//         });
//         setinputDisable(true);
//         break;
//       default:
//         break;
//     }
//   }, [status, reviseCount]);

//   const handleFormChange = (e) => {
//     setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
//   };

//   // ─── build payload ──────────────────────────────────────────────────────────
//   function buildPayload(newStatus) {
//     return {
//       customer:          parseInt(formData.customer_name) || undefined,
//       sales_rep:         parseInt(formData.sales_rep)     || undefined,
//       quotation_type:    formData.quotation_type,
//       quotation_date:    formData.quotation_date          || null,
//       expiry_date:       formData.expiry_date             || null,
//       expected_delivery: formData.expected_delivery       || null,
//       currency:          formData.currency,
//       payment_terms:     formData.payment_terms,
//       customer_po_reference: formData.customer_po_referance,
//       status:            newStatus || undefined,
//       global_discount:   globalDiscount,
//       shipping_charges:  shippingCharges,
//       items: QuotationList_data
//         .filter((r) => r.product || r.product_id)
//         .map((row) => ({
//           ...(row.item_id ? { id: row.item_id } : {}),
//           product:    row.product,
//           uom:        row.uom,
//           tax:        row.tax,
//           unit_price: parseFloat(row.unit_price) || 0,
//           discount:   parseFloat(row.discount)   || 0,
//           quantity:   parseInt(row.quantity)     || 0,
//         })),
//     };
//   }

//   // ─── save draft ─────────────────────────────────────────────────────────────
//   async function handleSaveDraft(e) {
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       const payload = buildPayload("Draft");
//       let result;
//       if (dbId) {
//         result = await quotationApiProvider.updateQuotation(dbId, payload);
//       } else {
//         result = await quotationApiProvider.createQuotation(payload);
//         if (result?.data?.id || result?.id) {
//           setDbId(result?.data?.id || result?.id);
//           if (result?.data?.quotation_id || result?.quotation_id) {
//             setFormData((p) => ({
//               ...p,
//               quotation_id: result?.data?.quotation_id || result?.quotation_id,
//             }));
//           }
//         }
//       }
//       if (result) setStatus("Draft");
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   // ─── submit ─────────────────────────────────────────────────────────────────
//   async function handleSubmit(e) {
//     e.preventDefault();
//     if (!formData.customer_name) { toast.error("Please select a customer"); return; }
//     setSubmitting(true);
//     try {
//       // save first then action
//       let saved;
//       if (dbId) {
//         saved = await quotationApiProvider.updateQuotation(dbId, buildPayload());
//       } else {
//         saved = await quotationApiProvider.createQuotation(buildPayload());
//         const id = saved?.data?.id || saved?.id;
//         if (id) setDbId(id);
//       }
//       if (!saved) return;

//       const id = dbId || saved?.data?.id || saved?.id;
//       const actionRes = await quotationApiProvider.performAction(id, "submit");
//       if (actionRes) {
//         const fresh = await quotationApiProvider.fetchSingleQuotation(id);
//         if (fresh) applyQuotationToState(fresh?.data || fresh);
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   // ─── approve ────────────────────────────────────────────────────────────────
//   async function handleApprove(e) {
//     e.preventDefault();
//     if (!dbId) return;
//     setSubmitting(true);
//     try {
//       const res = await quotationApiProvider.performAction(dbId, "approve");
//       if (res) {
//         const fresh = await quotationApiProvider.fetchSingleQuotation(dbId);
//         if (fresh) applyQuotationToState(fresh?.data || fresh);
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   // ─── reject ─────────────────────────────────────────────────────────────────
//   async function handleReject(e) {
//     e.preventDefault();
//     if (!dbId) return;
//     setSubmitting(true);
//     try {
//       const res = await quotationApiProvider.performAction(dbId, "reject");
//       if (res) {
//         const fresh = await quotationApiProvider.fetchSingleQuotation(dbId);
//         if (fresh) applyQuotationToState(fresh?.data || fresh);
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   // ─── convert to SO ──────────────────────────────────────────────────────────
//   async function handleConvertToSO(e) {
//     e.preventDefault();
//     if (!dbId) return;
//     setSubmitting(true);
//     try {
//       const res = await quotationApiProvider.performAction(dbId, "convert_to_so");
//       if (res) setStatus("Converted (SO)");
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   // ─── revise ─────────────────────────────────────────────────────────────────
//   async function handleRevise(e) {
//     e.preventDefault();
//     setshowRevise(true);
//     setreviseCount((prev) => prev + 1);
//   }

//   // ─── pdf ────────────────────────────────────────────────────────────────────
//   async function handlePdf(e) {
//     e.preventDefault();
//     if (!dbId) return;
//     await quotationApiProvider.generatePdf(dbId);
//   }

//   // ─── email ──────────────────────────────────────────────────────────────────
//   async function handleEmail(e) {
//     e.preventDefault();
//     if (!dbId) return;
//     await quotationApiProvider.sendEmail(dbId);
//   }

//   // ─── comment ────────────────────────────────────────────────────────────────
//   async function handleAddComment(e) {
//     e.preventDefault();
//     if (!newComment.trim()) return;
//     if (!dbId) { toast.error("Save the quotation first"); return; }
//     const res = await quotationApiProvider.addComment(dbId, newComment.trim());
//     if (res) {
//       const entry = res?.data || res;
//       setComments((prev) => [...prev, entry]);
//       setNewComment("");
//     }
//   }

//   // ─── attachment ─────────────────────────────────────────────────────────────
//   async function handleAttachmentUpload(e) {
//     const file = e.target.files[0];
//     if (!file || !dbId) return;
//     const res = await quotationApiProvider.uploadAttachment(dbId, file);
//     if (res) {
//       const entry = res?.data || res;
//       setAttachments((prev) => [...prev, entry]);
//     }
//   }

//   async function handleRemoveAttachment(attachmentId) {
//     if (!window.confirm("Remove this attachment?")) return;
//     const ok = await quotationApiProvider.deleteAttachment(dbId, attachmentId);
//     if (ok) setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
//   }

//   // ─── delete product row ─────────────────────────────────────────────────────
//   function deleteQuotationProduct(ind) {
//     if (!window.confirm("Delete this item?")) return;
//     setQuotationList_data((prev) => prev.filter((_, i) => i !== ind));
//     setnumberOfQuotationList((prev) => prev - 1);
//   }

//   // ─── close / cancel ─────────────────────────────────────────────────────────
//   function handleClose(e) {
//     e.preventDefault();
//     if (window.confirm("Are you sure you want to close?")) {
//       setshowNewQuotation(false);
//     }
//   }

//   // ─── calculation helpers ────────────────────────────────────────────────────
//   function productTotal(ind) {
//     const data        = QuotationList_data[ind];
//     const quantity    = parseFloat(data?.quantity)   || 0;
//     const unitPrice   = parseFloat(data?.unit_price) || 0;
//     const discount    = parseFloat(data?.discount)   || 0;
//     const tax         = parseFloat(data?.tax_rate || data?.tax)   || 0;
//     const subtotal    = quantity * unitPrice;
//     const taxAmount   = (subtotal * tax) / 100;
//     const taxed       = subtotal + taxAmount;
//     const discountAmt = (taxed * discount) / 100;
//     return (taxed - discountAmt).toFixed(2);
//   }

//   function calculateSubtotal() {
//     return QuotationList_data.reduce((acc, data) => {
//       const q    = parseFloat(data?.quantity)   || 0;
//       const u    = parseFloat(data?.unit_price) || 0;
//       const d    = parseFloat(data?.discount)   || 0;
//       const t    = parseFloat(data?.tax_rate || data?.tax) || 0;
//       const sub  = q * u;
//       const tax  = (sub * t) / 100;
//       const taxed = sub + tax;
//       const disc  = (taxed * d) / 100;
//       return acc + (taxed - disc);
//     }, 0).toFixed(2);
//   }

//   function calculateTaxSummary() {
//     return QuotationList_data.reduce((acc, data) => {
//       const q = parseFloat(data?.quantity)   || 0;
//       const u = parseFloat(data?.unit_price) || 0;
//       const t = parseFloat(data?.tax_rate || data?.tax) || 0;
//       return acc + (q * u * t) / 100;
//     }, 0).toFixed(2);
//   }

//   function calculateGrandTotal() {
//     const sub  = parseFloat(calculateSubtotal()) || 0;
//     const disc = (sub * globalDiscount) / 100;
//     return (sub - disc + parseFloat(shippingCharges || 0)).toFixed(2);
//   }

//   function roundedGrandTotal() {
//     const total = parseFloat(calculateGrandTotal());
//     return total % 1 > 0.5 ? Math.ceil(total) : Math.floor(total);
//   }

//   function roundedValue() {
//     return (roundedGrandTotal() - parseFloat(calculateGrandTotal())).toFixed(2);
//   }

//   const currencySymbol = { INR: "₹", USD: "$", GBP: "£", SGD: "S$", EUR: "€" }[formData.currency] || "";

//   if (pageLoading) {
//     return (
//       <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
//         <p style={{ fontSize: "15px", color: "#888" }}>Loading quotation…</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* ── Revision Modal ─────────────────────────────────────────────── */}
//       {showRevise && (
//         <div className="newQuotation-revisionBtn">
//           <CreateNewQuotationRevision
//             showRevise={showRevise}
//             setshowRevise={setshowRevise}
//             reviseCount={reviseCount}
//             setreviseCount={setreviseCount}
//             status={status}
//             setStatus={setStatus}
//           />
//         </div>
//       )}

//       {/* ── Revision History Modal ─────────────────────────────────────── */}
//       {showHistory && (
//         <div className="newQuotation-historyBtn">
//           <CreateNewQuptationRevisionHistory
//             setshowHistory={setshowHistory}
//             revisions={revisions}
//           />
//         </div>
//       )}

//       <div className={`newQuotation-container ${(showRevise || showHistory) ? "newQuotation-blur" : ""}`}>
//         <form onSubmit={handleSubmit}>

//           {/* ── HEAD ─────────────────────────────────────────────────────── */}
//           <div className="newQuotation-tit">
//             <nav>
//               <p>{isEditMode
//                 ? (["Draft",""].includes(status) ? "Edit Quotation" : "View Quotation")
//                 : "New Quotation"}</p>
//               {status && (
//                 <h3 className={`newQuotation-status-bg-${status.toLowerCase().replace(/[^a-z]/g, "")}`}>
//                   Rev:{["Draft","Submitted"].includes(status) ? reviseCount : ""}
//                   {" "}({status})
//                 </h3>
//               )}
//             </nav>
//             <div>
//               {["Draft","Submitted"].includes(status) && (
//                 <>
//                   <button
//                     className={reviseCount > 1 ? "newQuotation-active-btn" : "newQuotation-line-btn"}
//                     onClick={(e) => { e.preventDefault(); setshowHistory(true); }}
//                     disabled={buttonState.historyBtn}
//                   >
//                     Revision History
//                   </button>
//                   <button
//                     className={status === "Submitted" ? "newQuotation-active-btn" : "newQuotation-line-btn"}
//                     onClick={handleRevise}
//                     disabled={buttonState.reviseBtn}
//                   >
//                     Revise
//                   </button>
//                 </>
//               )}
//               <div onClick={handleClose} className="close-newQuotation-container">
//                 <svg className="circle-x-logo-newQuotation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
//                   <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
//                 </svg>
//                 <nav>Close</nav>
//               </div>
//             </div>
//           </div>

//           {/* ── BASIC INFO ────────────────────────────────────────────────── */}
//           <div className="newQuotation-input-container">
//             <div className="newQuotation-input-box">
//               <label>Quotation ID (Auto Generate)</label>
//               <input type="text" value={formData.quotation_id} placeholder="Auto Generate" disabled />
//             </div>
//             <div className="newQuotation-input-box">
//               <label htmlFor="quotation_type">Quotation Type<sup>*</sup></label>
//               <select id="quotation_type" value={formData.quotation_type}
//                 onChange={handleFormChange} required disabled={inputDisable}>
//                 <option value="">Select Quotation Type</option>
//                 <option value="Standard">Standard</option>
//                 <option value="Blanket">Blanket</option>
//                 <option value="Service">Service</option>
//               </select>
//             </div>
//           </div>

//           <div className="newQuotation-input-container">
//             <div className="newQuotation-input-box">
//               <label htmlFor="quotation_date">Quotation Date<sup>*</sup></label>
//               <input id="quotation_date" type="date" value={formData.quotation_date}
//                 onChange={handleFormChange} required disabled={inputDisable}
//                 placeholder="Select quotation date" />
//             </div>
//             <div className="newQuotation-input-box">
//               <label htmlFor="expiry_date">Expiry Date<sup>*</sup></label>
//               <input id="expiry_date" type="date" value={formData.expiry_date}
//                 onChange={handleFormChange} required disabled={inputDisable}
//                 placeholder="Select expiry date" />
//             </div>
//           </div>

//           <div className="newQuotation-input-container">
//             <div className="newQuotation-input-box">
//               <label htmlFor="customer_name">Customer Name<sup>*</sup></label>
//               {isEditMode && inputDisable ? (
//                 <input type="text" value={formData.customer_display} disabled />
//               ) : (
//                 <select id="customer_name" value={formData.customer_name}
//                   onChange={handleFormChange} required disabled={inputDisable}>
//                   <option value="">Select Customer</option>
//                   {customers.map((c) => (
//                     <option key={c.id} value={c.id}>
//                       {c.first_name ? `${c.first_name} ${c.last_name || ""}`.trim() : c.company_name || c.id}
//                     </option>
//                   ))}
//                 </select>
//               )}
//             </div>
//             <div className="newQuotation-input-box">
//               <label htmlFor="customer_po_referance">Customer PO Reference</label>
//               <input id="customer_po_referance" type="text" value={formData.customer_po_referance}
//                 onChange={handleFormChange} disabled={inputDisable}
//                 placeholder="e.g. PO-45678" />
//             </div>
//           </div>

//           <div className="newQuotation-input-container">
//             <div className="newQuotation-input-box">
//               <label htmlFor="sales_rep">Sales Rep<sup>*</sup></label>
//               {isEditMode && inputDisable ? (
//                 <input type="text" value={formData.sales_rep_display} disabled />
//               ) : (
//                 <select id="sales_rep" value={formData.sales_rep}
//                   onChange={handleFormChange} required disabled={inputDisable}>
//                   <option value="">Select Sales Rep</option>
//                   {salesReps.map((r) => (
//                     <option key={r.id} value={r.id}>
//                       {r.first_name ? `${r.first_name} ${r.last_name || ""}`.trim() : r.id}
//                     </option>
//                   ))}
//                 </select>
//               )}
//             </div>
//             <div className="newQuotation-input-box">
//               <label htmlFor="currency">Currency<sup>*</sup></label>
//               <select id="currency" value={formData.currency}
//                 onChange={handleFormChange} required disabled={inputDisable}>
//                 <option value="">Select Currency</option>
//                 {currencies.map((c) => (
//                   <option key={c} value={c}>{c}</option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className="newQuotation-input-container">
//             <div className="newQuotation-input-box">
//               <label htmlFor="payment_terms">Payment Terms</label>
//               <select id="payment_terms" value={formData.payment_terms}
//                 onChange={handleFormChange} disabled={inputDisable}>
//                 <option value="">Select Terms</option>
//                 <option value="Net 15">Net 15</option>
//                 <option value="Net 30">Net 30</option>
//                 <option value="Net 45">Net 45</option>
//                 <option value="Net 60">Net 60</option>
//                 <option value="Advance">Advance</option>
//                 <option value="COD">COD</option>
//               </select>
//             </div>
//             <div className="newQuotation-input-box">
//               <label htmlFor="expected_delivery">Expected Delivery<sup>*</sup></label>
//               <input id="expected_delivery" type="date" value={formData.expected_delivery}
//                 onChange={handleFormChange} required disabled={inputDisable}
//                 placeholder="Select expected delivery date" />
//             </div>
//           </div>

//           {/* ── LINE ITEMS ────────────────────────────────────────────────── */}
//           <nav className="newQuotation-subtit">Quotation Items<sup>*</sup></nav>
//           <div className="newQuotation-table-container">
//             <table>
//               <thead className="newQuotation-table-head">
//                 <tr>
//                   <th id="newQuotation-table-smallwidth">#</th>
//                   <th>Product Name</th>
//                   <th id="newQuotation-table-minwidth">Product ID</th>
//                   <th>Quantity</th>
//                   <th>UOM</th>
//                   <th>Unit Price</th>
//                   <th>Tax (%)</th>
//                   <th>Discount (%)</th>
//                   <th>Total</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody className="newQuotation-table-body">
//                 {[...Array(numberOfQuotationList)].map((_, ind) => (
//                   <QuotationList
//                     key={QuotationList_data[ind]?.unique_key ?? ind}
//                     unique_key={ind}
//                     rowData={QuotationList_data[ind] || { unique_key: ind }}
//                     descriptions={descriptions}
//                     quotation_table_data={quotation_table_data}
//                     setQuotationList_data={setQuotationList_data}
//                     inputDisable={inputDisable}
//                     productTotal={productTotal}
//                     deleteQuotationProduct={deleteQuotationProduct}
//                     newQuotationData={formData}
//                   />
//                 ))}
//                 {!inputDisable && (
//                   <tr>
//                     <td></td>
//                     <td>
//                       <button
//                         onClick={(e) => {
//                           e.preventDefault();
//                           setQuotationList_data((prev) => [
//                             ...prev,
//                             { unique_key: numberOfQuotationList },
//                           ]);
//                           setnumberOfQuotationList((prev) => prev + 1);
//                         }}
//                       >
//                         + Add Item
//                       </button>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* ── TAX & TOTALS ─────────────────────────────────────────────── */}
//           <nav className="newQuotation-subtit">Tax & Totals</nav>
//           <div className="newQuotation-totals-container">
//             <nav>
//               <h5>Subtotal</h5>
//               <p>{currencySymbol}{calculateSubtotal()}</p>
//             </nav>
//             <nav>
//               <h5>Global Discount (%)</h5>
//               <input type="number" value={globalDiscount} min={0} max={100}
//                 onChange={(e) => setGlobalDiscount(parseFloat(e.target.value) || 0)}
//                 disabled={inputDisable} />
//             </nav>
//             <nav>
//               <h5>Tax Summary</h5>
//               <p>{currencySymbol}{calculateTaxSummary()}</p>
//             </nav>
//             <nav>
//               <h5>Shipping Charges {currencySymbol && `(${currencySymbol})`}</h5>
//               <input type="number" value={shippingCharges} min={0}
//                 onChange={(e) => setShippingCharges(parseFloat(e.target.value) || 0)}
//                 disabled={inputDisable} />
//             </nav>
//             <nav>
//               <h5>Rounding Adjustment</h5>
//               <p>{roundedValue()}</p>
//             </nav>
//             <nav className="newQuotation-totals-container-bg">
//               <h5>Grand Total</h5>
//               <p>{currencySymbol}{roundedGrandTotal()}</p>
//             </nav>
//           </div>

//           {/* ── COMMENTS / HISTORY / ATTACHMENTS ─────────────────────────── */}
//           <div className="newQuotation-hub-container">
//             <div className="newQuotation-hub-head">
//               {["comments", "history", "attachments"].map((tab) => (
//                 <p key={tab}
//                   className={activeTab === tab ? "newQuotation-hub-head-bg-black" : "newQuotation-hub-head-tit"}
//                   onClick={() => setActiveTab(tab)}
//                   style={{ textTransform: "capitalize" }}
//                 >
//                   {tab}
//                 </p>
//               ))}
//             </div>
//             <div className="newQuotation-hub-body">

//               {/* Comments */}
//               {activeTab === "comments" && (
//                 <div className="newQuotation-comment-container">
//                   <p>Add Comment:</p>
//                   <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
//                     <input type="text" value={newComment}
//                       onChange={(e) => setNewComment(e.target.value)}
//                       placeholder="Enter your comment…"
//                       style={{ flex: 1, padding: "8px 12px", borderRadius: "6px", border: "1px solid #ddd" }} />
//                     <button
//                       onClick={handleAddComment}
//                       className="newQuotation-active-btn"
//                       style={{ padding: "8px 16px" }}
//                     >
//                       + Add
//                     </button>
//                   </div>
//                   <div className="newQuotation-comment-brline" />
//                   <div className="newQuotation-showarea">
//                     {comments.map((c, i) => (
//                       <div key={i} className="newQuotation-message-container">
//                         <svg className="newQuotation-comment-profile-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
//                           <rect width="24" height="24" rx="12" fill="#E0E4E7" />
//                           <path d="M7 17.33V16.6219C7 15.3072 7.52224 14.0464 8.45184 13.1168C9.38143 12.1872 10.6422 11.665 11.9569 11.665M11.9569 11.665C13.2715 11.665 14.5323 12.1872 15.4619 13.1168C16.3915 14.0464 16.9138 15.3072 16.9138 16.6219V17.33M11.9569 11.665C12.7081 11.665 13.4286 11.3666 13.9598 10.8354C14.491 10.3042 14.7894 9.58373 14.7894 8.8325C14.7894 8.08127 14.491 7.36082 13.9598 6.82962C13.4286 6.29842 12.7081 6 11.9569 6C11.2057 6 10.4852 6.29842 9.954 6.82962C9.4228 7.36082 9.12438 8.08127 9.12438 8.8325C9.12438 9.58373 9.4228 10.3042 9.954 10.8354C10.4852 11.3666 11.2057 11.665 11.9569 11.665Z"
//                             stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                         </svg>
//                         <div className="newQuotation-message-box">
//                           <p>{c.comment_by || c.created_by} · {new Date(c.timestamp).toLocaleString()}</p>
//                           <nav>{c.comment}</nav>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* History */}
//               {activeTab === "history" && (
//                 <div className="newQuotation-history-container">
//                   {history.length === 0 ? (
//                     <p style={{ color: "#888", padding: "12px" }}>No history yet.</p>
//                   ) : history.map((h, i) => (
//                     <div key={i} style={{ padding: "10px 12px", background: "#f9f9f9", borderRadius: "6px", marginBottom: "6px" }}>
//                       <p style={{ fontSize: "13px", margin: 0 }}>
//                         <strong>{h.event_type}</strong>
//                         {h.status ? ` → ${h.status}` : ""}
//                         {h.extra_info ? ` — ${h.extra_info}` : ""}
//                       </p>
//                       <p style={{ fontSize: "11px", color: "#888", margin: "4px 0 0" }}>
//                         {h.action_by} · {new Date(h.timestamp).toLocaleString()}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* Attachments */}
//               {activeTab === "attachments" && (
//                 <div className="newQuotation-attachment-container">
//                   <input type="file" ref={fileInputRef} hidden onChange={handleAttachmentUpload} />
//                   <div className="newQuotation-upload-container">
//                     <div
//                       className="newQuotation-upload-btn"
//                       onClick={() => !inputDisable && fileInputRef.current.click()}
//                       style={{ cursor: inputDisable ? "not-allowed" : "pointer", opacity: inputDisable ? 0.5 : 1 }}
//                     >
//                       <nav>Upload Files</nav>
//                     </div>
//                   </div>
//                   {attachments.length === 0 ? (
//                     <p style={{ color: "#888", fontSize: "13px", marginTop: "8px" }}>No attachments yet.</p>
//                   ) : attachments.map((att, i) => (
//                     <div key={i} className="newQuotation-file-item">
//                       <nav>{att.description || att.file?.split("/").pop()}</nav>
//                       <div className="newQuotation-file-actions">
//                         <a href={att.file} target="_blank" rel="noreferrer" download>Download</a>
//                         <button onClick={() => handleRemoveAttachment(att.id)}
//                           disabled={inputDisable}>Remove</button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* ── ACTION BUTTONS ────────────────────────────────────────────── */}
//           <div className="newQuotation-btn-container">
//             <button className="newQuotation-cancel-btn" onClick={handleClose}>
//               Cancel
//             </button>

//             <button
//               className={`newQuotation-active-btn ${buttonState.saveDraft ? "newQuotation-passed-btn" : ""}`}
//               onClick={handleSaveDraft}
//               disabled={buttonState.saveDraft || submitting}
//             >
//               {submitting ? "Saving…" : "Save Draft"}
//             </button>

//             <button
//               className={`newQuotation-active-btn ${buttonState.submit ? "newQuotation-passed-btn" : ""}`}
//               disabled={buttonState.submit || submitting}
//             >
//               {status === "Submitted" ? "Submitted" : submitting ? "Submitting…" : "Submit"}
//             </button>

//             <button
//               className={`newQuotation-active-btn ${buttonState.approve ? "newQuotation-line-btn" : ""}`}
//               onClick={handleApprove}
//               disabled={buttonState.approve || submitting}
//             >
//               {["Approved","Converted (SO)"].includes(status) ? "Approved" : "Approve"}
//             </button>

//             <button
//               className={`newQuotation-active-btn ${buttonState.reject ? "newQuotation-line-btn" : ""}`}
//               onClick={handleReject}
//               disabled={buttonState.reject || submitting}
//             >
//               {status === "Rejected" ? "Rejected" : "Reject"}
//             </button>

//             <button
//               className={buttonState.salesOrder ? "newQuotation-line-btn" : "newQuotation-active-btn"}
//               onClick={handleConvertToSO}
//               disabled={buttonState.salesOrder || submitting}
//             >
//               {status === "Converted (SO)" ? "Converted (SO)" : "Convert to SO"}
//             </button>

//             {/* PDF */}
//             <svg
//               className={!buttonState.pdf ? "newQuotation-pdf-mail-activelogo" : "newQuotation-pdf-mail-futurelogo"}
//               style={{ cursor: !buttonState.pdf ? "pointer" : "not-allowed", opacity: buttonState.pdf ? 0.4 : 1 }}
//               onClick={!buttonState.pdf ? handlePdf : undefined}
//               xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 24" fill="none"
//             >
//               <path fillRule="evenodd" clipRule="evenodd" d="M0.600098 2.4C0.600098 1.76348 0.852954 1.15303 1.30304 0.702944C1.75313 0.252856 2.36358 0 3.0001 0L16.1313 0L21.4001 5.2688V21.6C21.4001 22.2365 21.1472 22.847 20.6972 23.2971C20.2471 23.7471 19.6366 24 19.0001 24H3.0001C2.36358 24 1.75313 23.7471 1.30304 23.2971C0.852954 22.847 0.600098 22.2365 0.600098 21.6V2.4ZM4.6001 9.6H2.2001V17.6H3.8001V14.4H4.6001C5.23662 14.4 5.84707 14.1471 6.29715 13.6971C6.74724 13.247 7.0001 12.6365 7.0001 12C7.0001 11.3635 6.74724 10.753 6.29715 10.3029C5.84707 9.85286 5.23662 9.6 4.6001 9.6ZM11.0001 9.6H8.6001V17.6H11.0001C11.6366 17.6 12.2471 17.3471 12.6972 16.8971C13.1472 16.447 13.4001 15.8365 13.4001 15.2V12C13.4001 11.3635 13.1472 10.753 12.6972 10.3029C12.2471 9.85286 11.6366 9.6 11.0001 9.6ZM15.0001 17.6V9.6H19.8001V11.2H16.6001V12.8H18.2001V14.4H16.6001V17.6H15.0001Z" />
//             </svg>

//             {/* Email */}
//             <svg
//               className={!buttonState.email ? "newQuotation-pdf-mail-activelogo" : "newQuotation-pdf-mail-futurelogo"}
//               style={{ cursor: !buttonState.email ? "pointer" : "not-allowed", opacity: buttonState.email ? 0.4 : 1 }}
//               onClick={!buttonState.email ? handleEmail : undefined}
//               xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 16" fill="none"
//             >
//               <path d="M2 16C1.45 16 0.979333 15.8043 0.588 15.413C0.196667 15.0217 0.000666667 14.5507 0 14V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196666 1.45067 0.000666667 2 0H18C18.55 0 19.021 0.196 19.413 0.588C19.805 0.98 20.0007 1.45067 20 2V14C20 14.55 19.8043 15.021 19.413 15.413C19.0217 15.805 18.5507 16.0007 18 16H2ZM10 8.825C10.0833 8.825 10.171 8.81233 10.263 8.787C10.355 8.76167 10.4423 8.72433 10.525 8.675L17.6 4.25C17.7333 4.16667 17.8333 4.06267 17.9 3.938C17.9667 3.81333 18 3.67567 18 3.525C18 3.19167 17.8583 2.94167 17.575 2.775C17.2917 2.60833 17 2.61667 16.7 2.8L10 7L3.3 2.8C3 2.61667 2.70833 2.61267 2.425 2.788C2.14167 2.96333 2 3.209 2 3.525C2 3.69167 2.03333 3.83767 2.1 3.963C2.16667 4.08833 2.26667 4.184 2.4 4.25L9.475 8.675C9.55833 8.725 9.646 8.76267 9.738 8.788C9.83 8.81333 9.91733 8.82567 10 8.825Z" />
//             </svg>
//           </div>

//         </form>
//       </div>
//     </>
//   );
// }
import React, { useEffect, useRef, useState } from "react";
import "./createNewQuotation.css";
import QuotationList from "./QuotationList";
import CreateNewQuotationRevision from "./createNewQuotationRevision";
import CreateNewQuptationRevisionHistory from "./createNewQuptationRevisionHistory";
import quotationApiProvider from "../../../network/quotation-api-provider";
import ApiClient from "../../../network/api-client";
import { toast } from "react-toastify";

// ─── map flat API response → form state ──────────────────────────────────────
function mapQuotationToForm(q) {
  if (!q || !Object.keys(q).length) return null;
  const cus = q.customer || {};
  return {
    quotation_id:          q.quotation_id          || "",
    quotation_type:        q.quotation_type        || "",
    quotation_date:        q.quotation_date        || "",
    expiry_date:           q.expiry_date           || "",
    customer_name:         cus.id                  || "",
    customer_display:      cus.first_name
      ? `${cus.first_name} ${cus.last_name || ""}`.trim()
      : "",
    customer_po_referance: q.customer_po_reference || "",
    sales_rep:             "",                         // resolved after reps load
    sales_rep_display:     q.sales_rep             || "",
    currency:              q.currency              || "",
    payment_terms:         q.payment_terms         || "",
    expected_delivery:     q.expected_delivery     || "",
    status:                q.status                || "",
    revise_count:          q.revise_count          || 0,
    global_discount:       parseFloat(q.global_discount)  || 0,
    shipping_charges:      parseFloat(q.shipping_charges) || 0,
  };
}

// ─── map API items → table rows ───────────────────────────────────────────────
function mapItemsToRows(items = []) {
  return items.map((item, index) => ({
    unique_key:   index,
    item_id:      item.id,
    product:      item.product,
    product_name: item.product_name      || "",
    product_id:   item.product_id_display || "",
    uom:          item.uom,
    unit_price:   item.unit_price         || 0,
    discount:     item.discount           || 0,
    tax:          item.tax,
    tax_rate:     item.tax_rate           || 0,
    quantity:     item.quantity           || 0,
    total:        item.total              || 0,
  }));
}

const emptyForm = {
  quotation_id:          "",
  quotation_type:        "",
  quotation_date:        "",
  expiry_date:           "",
  customer_name:         "",
  customer_display:      "",
  customer_po_referance: "",
  sales_rep:             "",
  sales_rep_display:     "",
  currency:              "",
  payment_terms:         "",
  expected_delivery:     "",
  status:                "",
  revise_count:          0,
  global_discount:       0,
  shipping_charges:      0,
};

export default function CreateNewQuotation({
  setshowNewQuotation,
  editQuotationData = {},
  isEdit = false,
}) {
  const isEditMode = isEdit && Object.keys(editQuotationData).length > 0;

  const [pageLoading, setPageLoading] = useState(isEditMode);
  const [submitting,  setSubmitting]  = useState(false);
  const [dbId,        setDbId]        = useState(
    isEditMode ? editQuotationData.id || null : null
  );

  const [formData,    setFormData]    = useState(emptyForm);
  const [status,      setStatus]      = useState("");
  const [reviseCount, setreviseCount] = useState(0);

  // line items
  const [QuotationList_data,    setQuotationList_data]    = useState([{ unique_key: 0 }]);
  const [numberOfQuotationList, setnumberOfQuotationList] = useState(1);

  // hub data
  const [comments,    setComments]    = useState([]);
  const [history,     setHistory]     = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [revisions,   setRevisions]   = useState([]);
  const [newComment,  setNewComment]  = useState("");

  // dropdown options
  const [customers,            setCustomers]            = useState([]);
  const [salesReps,            setSalesReps]            = useState([]);
  const [currencies,           setCurrencies]           = useState([]);
  const [descriptions,         setdescriptions]         = useState([]);
  const [quotation_table_data, setquotation_table_data] = useState([]);

  // totals
  const [globalDiscount,  setGlobalDiscount]  = useState(0);
  const [shippingCharges, setShippingCharges] = useState(0);

  // UI
  const [inputDisable, setinputDisable] = useState(false);
  const [showHistory,  setshowHistory]  = useState(false);
  const [showRevise,   setshowRevise]   = useState(false);
  const [activeTab,    setActiveTab]    = useState("comments");
  const fileInputRef = useRef(null);

  const [buttonState, setButtonState] = useState({
    saveDraft:  false,
    submit:     false,
    approve:    true,
    reject:     true,
    salesOrder: true,
    pdf:        true,
    email:      true,
    historyBtn: true,
    reviseBtn:  true,
  });

  // ─── apply quotation object → all state ──────────────────────────────────
  function applyQuotationToState(q, loadedReps = []) {
    const mapped = mapQuotationToForm(q);
    if (!mapped) return;

    // resolve sales_rep ID from display name
    if (q.sales_rep && loadedReps.length > 0) {
      const match = loadedReps.find(
        (r) =>
          `${r.first_name || ""} ${r.last_name || ""}`.trim() === q.sales_rep ||
          r.first_name === q.sales_rep
      );
      if (match) mapped.sales_rep = String(match.id);
    }

    setFormData(mapped);
    setStatus(mapped.status);
    setreviseCount(mapped.revise_count);
    setGlobalDiscount(mapped.global_discount);
    setShippingCharges(mapped.shipping_charges);
    setDbId(q.id || null);
    setComments(q.comments    || []);
    setHistory(q.history      || []);
    setAttachments(q.attachments || []);
    setRevisions(q.revisions   || []);

    if (q.items?.length > 0) {
      const rows = mapItemsToRows(q.items);
      setQuotationList_data(rows);
      setnumberOfQuotationList(rows.length);
    }
  }

  // ─── ON MOUNT ─────────────────────────────────────────────────────────────
  useEffect(() => {
    async function init() {
      let loadedReps = [];

      try {
        const [cusRes, repRes, prodRes] = await Promise.all([
          ApiClient.get("/masters/customers/").catch(() => null),
          ApiClient.get("/masters/users/").catch(() => null),
          ApiClient.get("/masters/products/").catch(() => null),
        ]);

        if (cusRes?.status === 200) {
          const list =
            cusRes.data?.data?.data ??
            cusRes.data?.data       ??
            cusRes.data?.results    ??
            (Array.isArray(cusRes.data) ? cusRes.data : []);
          setCustomers(list);
        }

        if (repRes?.status === 200) {
          loadedReps =
            repRes.data?.data?.data ??
            repRes.data?.data       ??
            repRes.data?.results    ??
            (Array.isArray(repRes.data) ? repRes.data : []);
          setSalesReps(loadedReps);
        }

        if (prodRes?.status === 200) {
          const list =
            prodRes.data?.data?.data ??
            prodRes.data?.data       ??
            prodRes.data?.results    ??
            (Array.isArray(prodRes.data) ? prodRes.data : []);
          setdescriptions(list.map((p) => p.product_name || p.name || ""));
          setquotation_table_data(list);
        }
      } catch {
        // silent — currencies still set below
      }

      setCurrencies(["INR", "USD", "EUR", "GBP", "SGD"]);

      // edit — fetch full detail
      if (isEditMode) {
        const id     = editQuotationData.id;
        const detail = id
          ? await quotationApiProvider.fetchSingleQuotation(id)
          : null;
        applyQuotationToState(detail || editQuotationData, loadedReps);
      }

      setPageLoading(false);
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── button state ─────────────────────────────────────────────────────────
  useEffect(() => {
    switch (status) {
      case "":
      case "Draft":
        setButtonState({
          saveDraft:  false,
          submit:     false,
          approve:    true,
          reject:     true,
          salesOrder: true,
          pdf:        status === "Draft" ? false : true,
          email:      status === "Draft" ? false : true,
          historyBtn: reviseCount > 0 ? false : true,
          reviseBtn:  status === "Draft" ? false : true,
        });
        setinputDisable(false);
        break;
      case "Submitted":
        setButtonState({
          saveDraft:  true,
          submit:     true,
          approve:    false,
          reject:     false,
          salesOrder: true,
          pdf:        false,
          email:      false,
          historyBtn: false,
          reviseBtn:  false,
        });
        setinputDisable(true);
        break;
      case "Approved":
        setButtonState({
          saveDraft:  true,
          submit:     true,
          approve:    true,
          reject:     true,
          salesOrder: false,
          pdf:        false,
          email:      false,
          historyBtn: false,
          reviseBtn:  true,
        });
        setinputDisable(true);
        break;
      case "Rejected":
      case "Converted (SO)":
      case "Expired":
        setButtonState({
          saveDraft:  true,
          submit:     true,
          approve:    true,
          reject:     true,
          salesOrder: true,
          pdf:        false,
          email:      false,
          historyBtn: false,
          reviseBtn:  true,
        });
        setinputDisable(true);
        break;
      default:
        break;
    }
  }, [status, reviseCount]);

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  // ─── build payload ────────────────────────────────────────────────────────
  function buildPayload(newStatus) {
    return {
      customer:              parseInt(formData.customer_name) || undefined,
      sales_rep:             parseInt(formData.sales_rep)     || undefined,
      quotation_type:        formData.quotation_type          || undefined,
      quotation_date:        formData.quotation_date          || null,
      expiry_date:           formData.expiry_date             || null,
      expected_delivery:     formData.expected_delivery       || null,
      currency:              formData.currency                || undefined,
      payment_terms:         formData.payment_terms,
      customer_po_reference: formData.customer_po_referance,
      status:                newStatus                        || undefined,
      global_discount:       globalDiscount,
      shipping_charges:      shippingCharges,
      items: QuotationList_data
        .filter((r) => r.product)
        .map((row) => ({
          ...(row.item_id ? { id: row.item_id } : {}),
          product:    row.product,
          uom:        row.uom,
          tax:        row.tax,
          unit_price: parseFloat(row.unit_price) || 0,
          discount:   parseFloat(row.discount)   || 0,
          quantity:   parseInt(row.quantity)     || 0,
        })),
    };
  }

  // ─── save draft ───────────────────────────────────────────────────────────
  async function handleSaveDraft(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = buildPayload("Draft");
      let result;
      if (dbId) {
        result = await quotationApiProvider.updateQuotation(dbId, payload);
      } else {
        result = await quotationApiProvider.createQuotation(payload);
        if (result?.id) {
          setDbId(result.id);
          setFormData((p) => ({
            ...p,
            quotation_id: result.quotation_id || p.quotation_id,
          }));
        }
      }
      if (result) setStatus("Draft");
    } finally {
      setSubmitting(false);
    }
  }

  // ─── submit ───────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.customer_name) {
      toast.error("Please select a customer");
      return;
    }
    setSubmitting(true);
    try {
      let saved;
      if (dbId) {
        saved = await quotationApiProvider.updateQuotation(dbId, buildPayload());
      } else {
        saved = await quotationApiProvider.createQuotation(buildPayload());
        if (saved?.id) setDbId(saved.id);
      }
      if (!saved) return;

      const id = dbId || saved.id;
      const actionRes = await quotationApiProvider.performAction(id, "submit");
      if (actionRes) {
        const fresh = await quotationApiProvider.fetchSingleQuotation(id);
        if (fresh) applyQuotationToState(fresh, salesReps);
      }
    } finally {
      setSubmitting(false);
    }
  }

  // ─── approve ──────────────────────────────────────────────────────────────
  async function handleApprove(e) {
    e.preventDefault();
    if (!dbId) return;
    setSubmitting(true);
    try {
      const res = await quotationApiProvider.performAction(dbId, "approve");
      if (res) {
        const fresh = await quotationApiProvider.fetchSingleQuotation(dbId);
        if (fresh) applyQuotationToState(fresh, salesReps);
      }
    } finally {
      setSubmitting(false);
    }
  }

  // ─── reject ───────────────────────────────────────────────────────────────
  async function handleReject(e) {
    e.preventDefault();
    if (!dbId) return;
    setSubmitting(true);
    try {
      const res = await quotationApiProvider.performAction(dbId, "reject");
      if (res) {
        const fresh = await quotationApiProvider.fetchSingleQuotation(dbId);
        if (fresh) applyQuotationToState(fresh, salesReps);
      }
    } finally {
      setSubmitting(false);
    }
  }

  // ─── convert to SO ────────────────────────────────────────────────────────
  async function handleConvertToSO(e) {
    e.preventDefault();
    if (!dbId) return;
    setSubmitting(true);
    try {
      const res = await quotationApiProvider.performAction(dbId, "convert_to_so");
      if (res) {
        const fresh = await quotationApiProvider.fetchSingleQuotation(dbId);
        if (fresh) applyQuotationToState(fresh, salesReps);
      }
    } finally {
      setSubmitting(false);
    }
  }

  // ─── revise ───────────────────────────────────────────────────────────────
  async function handleRevise(e) {
    e.preventDefault();
    setshowRevise(true);
    setreviseCount((prev) => prev + 1);
  }

  // ─── pdf ──────────────────────────────────────────────────────────────────
  async function handlePdf(e) {
    e.preventDefault();
    if (!dbId) return;
    await quotationApiProvider.generatePdf(dbId, formData.quotation_id);
  }

  // ─── email ────────────────────────────────────────────────────────────────
  async function handleEmail(e) {
    e.preventDefault();
    if (!dbId) return;
    await quotationApiProvider.sendEmail(dbId);
  }

  // ─── comment ──────────────────────────────────────────────────────────────
  async function handleAddComment(e) {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!dbId) { toast.error("Save the quotation first"); return; }
    const res = await quotationApiProvider.addComment(dbId, newComment.trim());
    if (res) {
      setComments((prev) => [...prev, res?.data || res]);
      setNewComment("");
    }
  }

  // ─── attachment ───────────────────────────────────────────────────────────
  async function handleAttachmentUpload(e) {
    const file = e.target.files[0];
    if (!file || !dbId) return;
    const res = await quotationApiProvider.uploadAttachment(dbId, file);
    if (res) setAttachments((prev) => [...prev, res?.data || res]);
    e.target.value = "";
  }

  async function handleRemoveAttachment(attachmentId) {
    if (!window.confirm("Remove this attachment?")) return;
    const ok = await quotationApiProvider.deleteAttachment(dbId, attachmentId);
    if (ok) setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
  }

  // ─── delete item row ──────────────────────────────────────────────────────
  function deleteQuotationProduct(ind) {
    if (!window.confirm("Delete this item?")) return;
    setQuotationList_data((prev) => prev.filter((_, i) => i !== ind));
    setnumberOfQuotationList((prev) => prev - 1);
  }

  // ─── close ────────────────────────────────────────────────────────────────
  function handleClose(e) {
    e.preventDefault();
    if (window.confirm("Are you sure you want to close?")) {
      setshowNewQuotation(false);
    }
  }

  // ─── calculations ─────────────────────────────────────────────────────────
  function productTotal(ind) {
    const data      = QuotationList_data[ind];
    const q         = parseFloat(data?.quantity)                  || 0;
    const u         = parseFloat(data?.unit_price)                || 0;
    const d         = parseFloat(data?.discount)                  || 0;
    const t         = parseFloat(data?.tax_rate || data?.tax)     || 0;
    const sub       = q * u;
    const taxAmt    = (sub * t) / 100;
    const taxed     = sub + taxAmt;
    const discAmt   = (taxed * d) / 100;
    return (taxed - discAmt).toFixed(2);
  }

  function calculateSubtotal() {
    return QuotationList_data.reduce((acc, data) => {
      const q     = parseFloat(data?.quantity)              || 0;
      const u     = parseFloat(data?.unit_price)            || 0;
      const d     = parseFloat(data?.discount)              || 0;
      const t     = parseFloat(data?.tax_rate || data?.tax) || 0;
      const sub   = q * u;
      const tax   = (sub * t) / 100;
      const taxed = sub + tax;
      const disc  = (taxed * d) / 100;
      return acc + (taxed - disc);
    }, 0).toFixed(2);
  }

  function calculateTaxSummary() {
    return QuotationList_data.reduce((acc, data) => {
      const q = parseFloat(data?.quantity)              || 0;
      const u = parseFloat(data?.unit_price)            || 0;
      const t = parseFloat(data?.tax_rate || data?.tax) || 0;
      return acc + (q * u * t) / 100;
    }, 0).toFixed(2);
  }

  function calculateGrandTotal() {
    const sub  = parseFloat(calculateSubtotal()) || 0;
    const disc = (sub * globalDiscount) / 100;
    return (sub - disc + parseFloat(shippingCharges || 0)).toFixed(2);
  }

  function roundedGrandTotal() {
    const total = parseFloat(calculateGrandTotal());
    return total % 1 > 0.5 ? Math.ceil(total) : Math.floor(total);
  }

  function roundedValue() {
    return (roundedGrandTotal() - parseFloat(calculateGrandTotal())).toFixed(2);
  }

  const currencySymbol =
    { INR: "₹", USD: "$", GBP: "£", SGD: "S$", EUR: "€" }[formData.currency] || "";

  // ─── loading ──────────────────────────────────────────────────────────────
  if (pageLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <p style={{ fontSize: "15px", color: "#888" }}>Loading quotation…</p>
      </div>
    );
  }

  return (
    <>
      {/* ── Revision Modal ──────────────────────────────────────────────── */}
      {showRevise && (
        <div className="newQuotation-revisionBtn">
          <CreateNewQuotationRevision
            showRevise={showRevise}
            setshowRevise={setshowRevise}
            reviseCount={reviseCount}
            setreviseCount={setreviseCount}
            status={status}
            setStatus={setStatus}
          />
        </div>
      )}

      {/* ── Revision History Modal ───────────────────────────────────────── */}
      {showHistory && (
        <div className="newQuotation-historyBtn">
          <CreateNewQuptationRevisionHistory
            setshowHistory={setshowHistory}
            revisions={revisions}
          />
        </div>
      )}

      <div className={`newQuotation-container ${(showRevise || showHistory) ? "newQuotation-blur" : ""}`}>
        <form onSubmit={handleSubmit}>

          {/* ── HEAD ───────────────────────────────────────────────────────── */}
          <div className="newQuotation-tit">
            <nav>
              <p>
                {isEditMode
                  ? ["Draft", ""].includes(status) ? "Edit Quotation" : "View Quotation"
                  : "New Quotation"}
              </p>
              {status && (
                <h3 className={`newQuotation-status-bg-${status.toLowerCase().replace(/[^a-z]/g, "")}`}>
                  {reviseCount > 0 && `Rev:${reviseCount} `}({status})
                </h3>
              )}
            </nav>
            <div>
              {["Draft", "Submitted"].includes(status) && (
                <>
                  <button
                    className={reviseCount > 0 ? "newQuotation-active-btn" : "newQuotation-line-btn"}
                    onClick={(e) => { e.preventDefault(); setshowHistory(true); }}
                    disabled={buttonState.historyBtn}
                  >
                    Revision History
                  </button>
                  <button
                    className={status === "Submitted" ? "newQuotation-active-btn" : "newQuotation-line-btn"}
                    onClick={handleRevise}
                    disabled={buttonState.reviseBtn}
                  >
                    Revise
                  </button>
                </>
              )}
              <div onClick={handleClose} className="close-newQuotation-container">
                <svg className="circle-x-logo-newQuotation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
                </svg>
                <nav>Close</nav>
              </div>
            </div>
          </div>

          {/* ── BASIC INFO ─────────────────────────────────────────────────── */}
          <div className="newQuotation-input-container">
            <div className="newQuotation-input-box">
              <label>Quotation ID (Auto Generate)</label>
              <input type="text" value={formData.quotation_id} placeholder="Auto Generate" disabled />
            </div>
            <div className="newQuotation-input-box">
              <label htmlFor="quotation_type">Quotation Type<sup>*</sup></label>
              <select
                id="quotation_type"
                value={formData.quotation_type}
                onChange={handleFormChange}
                required
                disabled={inputDisable}
              >
                <option value="">Select Quotation Type</option>
                <option value="Standard">Standard</option>
                <option value="Blanket">Blanket</option>
                <option value="Service">Service</option>
              </select>
            </div>
          </div>

          <div className="newQuotation-input-container">
            <div className="newQuotation-input-box">
              <label htmlFor="quotation_date">Quotation Date<sup>*</sup></label>
              <input
                id="quotation_date"
                type="date"
                value={formData.quotation_date}
                onChange={handleFormChange}
                required
                disabled={inputDisable}
              />
            </div>
            <div className="newQuotation-input-box">
              <label htmlFor="expiry_date">Expiry Date<sup>*</sup></label>
              <input
                id="expiry_date"
                type="date"
                value={formData.expiry_date}
                onChange={handleFormChange}
                required
                disabled={inputDisable}
              />
            </div>
          </div>

          <div className="newQuotation-input-container">
            <div className="newQuotation-input-box">
              <label htmlFor="customer_name">Customer Name<sup>*</sup></label>
              {inputDisable ? (
                <input type="text" value={formData.customer_display} disabled />
              ) : (
                <select
                  id="customer_name"
                  value={formData.customer_name}
                  onChange={handleFormChange}
                  required
                  disabled={inputDisable}
                >
                  <option value="">Select Customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.first_name
                        ? `${c.first_name} ${c.last_name || ""}`.trim()
                        : c.company_name || c.customer_id || c.id}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="newQuotation-input-box">
              <label htmlFor="customer_po_referance">Customer PO Reference</label>
              <input
                id="customer_po_referance"
                type="text"
                value={formData.customer_po_referance}
                onChange={handleFormChange}
                disabled={inputDisable}
                placeholder="e.g. PO-45678"
              />
            </div>
          </div>

          <div className="newQuotation-input-container">
            <div className="newQuotation-input-box">
              <label htmlFor="sales_rep">Sales Rep<sup>*</sup></label>
              {inputDisable ? (
                <input type="text" value={formData.sales_rep_display} disabled />
              ) : (
                <select
                  id="sales_rep"
                  value={formData.sales_rep}
                  onChange={handleFormChange}
                  required
                  disabled={inputDisable}
                >
                  <option value="">Select Sales Rep</option>
                  {salesReps.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.first_name
                        ? `${r.first_name} ${r.last_name || ""}`.trim()
                        : r.username || r.id}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="newQuotation-input-box">
              <label htmlFor="currency">Currency<sup>*</sup></label>
              <select
                id="currency"
                value={formData.currency}
                onChange={handleFormChange}
                required
                disabled={inputDisable}
              >
                <option value="">Select Currency</option>
                {currencies.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="newQuotation-input-container">
            <div className="newQuotation-input-box">
              <label htmlFor="payment_terms">Payment Terms</label>
              <select
                id="payment_terms"
                value={formData.payment_terms}
                onChange={handleFormChange}
                disabled={inputDisable}
              >
                <option value="">Select Terms</option>
                <option value="Net 15">Net 15</option>
                <option value="Net 30">Net 30</option>
                <option value="Net 45">Net 45</option>
                <option value="Net 60">Net 60</option>
                <option value="Advance">Advance</option>
                <option value="COD">COD</option>
              </select>
            </div>
            <div className="newQuotation-input-box">
              <label htmlFor="expected_delivery">Expected Delivery<sup>*</sup></label>
              <input
                id="expected_delivery"
                type="date"
                value={formData.expected_delivery}
                onChange={handleFormChange}
                required
                disabled={inputDisable}
              />
            </div>
          </div>

          {/* ── LINE ITEMS ─────────────────────────────────────────────────── */}
          <nav className="newQuotation-subtit">Quotation Items<sup>*</sup></nav>
          <div className="newQuotation-table-container">
            <table>
              <thead className="newQuotation-table-head">
                <tr>
                  <th id="newQuotation-table-smallwidth">#</th>
                  <th>Product Name</th>
                  <th id="newQuotation-table-minwidth">Product ID</th>
                  <th>Quantity</th>
                  <th>UOM</th>
                  <th>Unit Price</th>
                  <th>Tax (%)</th>
                  <th>Discount (%)</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="newQuotation-table-body">
                {[...Array(numberOfQuotationList)].map((_, ind) => (
                  <QuotationList
                    key={QuotationList_data[ind]?.unique_key ?? ind}
                    unique_key={ind}
                    rowData={QuotationList_data[ind] || { unique_key: ind }}
                    descriptions={descriptions}
                    quotation_table_data={quotation_table_data}
                    setQuotationList_data={setQuotationList_data}
                    inputDisable={inputDisable}
                    productTotal={productTotal}
                    deleteQuotationProduct={deleteQuotationProduct}
                    newQuotationData={formData}
                  />
                ))}
                {!inputDisable && (
                  <tr>
                    <td></td>
                    <td>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setQuotationList_data((prev) => [
                            ...prev,
                            { unique_key: numberOfQuotationList },
                          ]);
                          setnumberOfQuotationList((prev) => prev + 1);
                        }}
                      >
                        + Add Item
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ── TAX & TOTALS ───────────────────────────────────────────────── */}
          <nav className="newQuotation-subtit">Tax & Totals</nav>
          <div className="newQuotation-totals-container">
            <nav>
              <h5>Subtotal</h5>
              <p>{currencySymbol}{calculateSubtotal()}</p>
            </nav>
            <nav>
              <h5>Global Discount (%)</h5>
              <input
                type="number"
                value={globalDiscount}
                min={0}
                max={100}
                onChange={(e) => setGlobalDiscount(parseFloat(e.target.value) || 0)}
                disabled={inputDisable}
              />
            </nav>
            <nav>
              <h5>Tax Summary</h5>
              <p>{currencySymbol}{calculateTaxSummary()}</p>
            </nav>
            <nav>
              <h5>Shipping Charges {currencySymbol && `(${currencySymbol})`}</h5>
              <input
                type="number"
                value={shippingCharges}
                min={0}
                onChange={(e) => setShippingCharges(parseFloat(e.target.value) || 0)}
                disabled={inputDisable}
              />
            </nav>
            <nav>
              <h5>Rounding Adjustment</h5>
              <p>{roundedValue()}</p>
            </nav>
            <nav className="newQuotation-totals-container-bg">
              <h5>Grand Total</h5>
              <p>{currencySymbol}{roundedGrandTotal()}</p>
            </nav>
          </div>

          {/* ── COMMENTS / HISTORY / ATTACHMENTS ──────────────────────────── */}
          <div className="newQuotation-hub-container">
            <div className="newQuotation-hub-head">
              {["comments", "history", "attachments"].map((tab) => (
                <p
                  key={tab}
                  className={activeTab === tab
                    ? "newQuotation-hub-head-bg-black"
                    : "newQuotation-hub-head-tit"}
                  onClick={() => setActiveTab(tab)}
                  style={{ textTransform: "capitalize" }}
                >
                  {tab}
                </p>
              ))}
            </div>

            <div className="newQuotation-hub-body">

              {/* ── Comments ─────────────────────────────────────────────── */}
              {activeTab === "comments" && (
                <div className="newQuotation-comment-container">
                  <p>Add Comment:</p>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Enter your comment…"
                      style={{ flex: 1, padding: "8px 12px", borderRadius: "6px", border: "1px solid #ddd" }}
                    />
                    <button
                      onClick={handleAddComment}
                      className="newQuotation-active-btn"
                      style={{ padding: "8px 16px" }}
                    >
                      + Add
                    </button>
                  </div>
                  <div className="newQuotation-comment-brline" />
                  <div className="newQuotation-showarea">
                    {comments.length === 0 ? (
                      <p style={{ color: "#888", padding: "12px", fontSize: "13px" }}>No comments yet.</p>
                    ) : (
                      comments.map((c, i) => (
                        <div key={i} className="newQuotation-message-container">
                          <svg className="newQuotation-comment-profile-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                            <rect width="24" height="24" rx="12" fill="#E0E4E7" />
                            <path
                              d="M7 17.33V16.6219C7 15.3072 7.52224 14.0464 8.45184 13.1168C9.38143 12.1872 10.6422 11.665 11.9569 11.665M11.9569 11.665C13.2715 11.665 14.5323 12.1872 15.4619 13.1168C16.3915 14.0464 16.9138 15.3072 16.9138 16.6219V17.33M11.9569 11.665C12.7081 11.665 13.4286 11.3666 13.9598 10.8354C14.491 10.3042 14.7894 9.58373 14.7894 8.8325C14.7894 8.08127 14.491 7.36082 13.9598 6.82962C13.4286 6.29842 12.7081 6 11.9569 6C11.2057 6 10.4852 6.29842 9.954 6.82962C9.4228 7.36082 9.12438 8.08127 9.12438 8.8325C9.12438 9.58373 9.4228 10.3042 9.954 10.8354C10.4852 11.3666 11.2057 11.665 11.9569 11.665Z"
                              stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                            />
                          </svg>
                          <div className="newQuotation-message-box">
                            <p>
                              {c.comment_by || c.created_by || "Unknown"} ·{" "}
                              {c.timestamp ? new Date(c.timestamp).toLocaleString() : ""}
                            </p>
                            <nav>{c.comment}</nav>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ── History ──────────────────────────────────────────────── */}
              {activeTab === "history" && (
                <div className="newQuotation-history-container">
                  {history.length === 0 ? (
                    <p style={{ color: "#888", padding: "12px", fontSize: "13px" }}>No history yet.</p>
                  ) : (
                    history.map((h, i) => (
                      <div key={i} style={{
                        padding: "10px 12px", background: "#f9f9f9",
                        borderRadius: "6px", marginBottom: "6px",
                      }}>
                        <p style={{ fontSize: "13px", margin: 0 }}>
                          <strong>{h.event_type}</strong>
                          {h.status    ? ` → ${h.status}`    : ""}
                          {h.extra_info ? ` — ${h.extra_info}` : ""}
                        </p>
                        <p style={{ fontSize: "11px", color: "#888", margin: "4px 0 0" }}>
                          {h.action_by} · {new Date(h.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* ── Attachments ──────────────────────────────────────────── */}
              {activeTab === "attachments" && (
                <div className="newQuotation-attachment-container">
                  <input
                    type="file"
                    ref={fileInputRef}
                    hidden
                    onChange={handleAttachmentUpload}
                  />
                  <div className="newQuotation-upload-container">
                    <div
                      className="newQuotation-upload-btn"
                      onClick={() => !inputDisable && fileInputRef.current.click()}
                      style={{
                        cursor:  inputDisable ? "not-allowed" : "pointer",
                        opacity: inputDisable ? 0.5 : 1,
                      }}
                    >
                      <nav>Upload Files</nav>
                    </div>
                  </div>
                  {attachments.length === 0 ? (
                    <p style={{ color: "#888", fontSize: "13px", marginTop: "8px" }}>
                      No attachments yet.
                    </p>
                  ) : (
                    attachments.map((att, i) => (
                      <div key={i} className="newQuotation-file-item">
                        <nav>{att.description || att.file?.split("/").pop()}</nav>
                        <div className="newQuotation-file-actions">
                          <a href={att.file} target="_blank" rel="noreferrer" download>
                            Download
                          </a>
                          <button
                            onClick={() => handleRemoveAttachment(att.id)}
                            disabled={inputDisable}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── ACTION BUTTONS ─────────────────────────────────────────────── */}
          <div className="newQuotation-btn-container">

            <button className="newQuotation-cancel-btn" onClick={handleClose}>
              Cancel
            </button>

            <button
              className={`newQuotation-active-btn ${buttonState.saveDraft ? "newQuotation-passed-btn" : ""}`}
              onClick={handleSaveDraft}
              disabled={buttonState.saveDraft || submitting}
            >
              {submitting ? "Saving…" : "Save Draft"}
            </button>

            <button
              className={`newQuotation-active-btn ${buttonState.submit ? "newQuotation-passed-btn" : ""}`}
              disabled={buttonState.submit || submitting}
            >
              {status === "Submitted"
                ? "Submitted"
                : submitting ? "Submitting…" : "Submit"}
            </button>

            <button
              className={`newQuotation-active-btn ${buttonState.approve ? "newQuotation-line-btn" : ""}`}
              onClick={handleApprove}
              disabled={buttonState.approve || submitting}
            >
              {["Approved", "Converted (SO)"].includes(status) ? "Approved" : "Approve"}
            </button>

            <button
              className={`newQuotation-active-btn ${buttonState.reject ? "newQuotation-line-btn" : ""}`}
              onClick={handleReject}
              disabled={buttonState.reject || submitting}
            >
              {status === "Rejected" ? "Rejected" : "Reject"}
            </button>

            <button
              className={buttonState.salesOrder ? "newQuotation-line-btn" : "newQuotation-active-btn"}
              onClick={handleConvertToSO}
              disabled={buttonState.salesOrder || submitting}
            >
              {status === "Converted (SO)" ? "Converted (SO)" : "Convert to SO"}
            </button>

            {/* PDF icon */}
            <svg
              className={!buttonState.pdf
                ? "newQuotation-pdf-mail-activelogo"
                : "newQuotation-pdf-mail-futurelogo"}
              style={{
                cursor:  !buttonState.pdf ? "pointer" : "not-allowed",
                opacity: buttonState.pdf ? 0.4 : 1,
              }}
              onClick={!buttonState.pdf ? handlePdf : undefined}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 22 24"
              fill="none"
            >
              <path fillRule="evenodd" clipRule="evenodd" d="M0.600098 2.4C0.600098 1.76348 0.852954 1.15303 1.30304 0.702944C1.75313 0.252856 2.36358 0 3.0001 0L16.1313 0L21.4001 5.2688V21.6C21.4001 22.2365 21.1472 22.847 20.6972 23.2971C20.2471 23.7471 19.6366 24 19.0001 24H3.0001C2.36358 24 1.75313 23.7471 1.30304 23.2971C0.852954 22.847 0.600098 22.2365 0.600098 21.6V2.4ZM4.6001 9.6H2.2001V17.6H3.8001V14.4H4.6001C5.23662 14.4 5.84707 14.1471 6.29715 13.6971C6.74724 13.247 7.0001 12.6365 7.0001 12C7.0001 11.3635 6.74724 10.753 6.29715 10.3029C5.84707 9.85286 5.23662 9.6 4.6001 9.6ZM11.0001 9.6H8.6001V17.6H11.0001C11.6366 17.6 12.2471 17.3471 12.6972 16.8971C13.1472 16.447 13.4001 15.8365 13.4001 15.2V12C13.4001 11.3635 13.1472 10.753 12.6972 10.3029C12.2471 9.85286 11.6366 9.6 11.0001 9.6ZM15.0001 17.6V9.6H19.8001V11.2H16.6001V12.8H18.2001V14.4H16.6001V17.6H15.0001Z" />
            </svg>

            {/* Email icon */}
            <svg
              className={!buttonState.email
                ? "newQuotation-pdf-mail-activelogo"
                : "newQuotation-pdf-mail-futurelogo"}
              style={{
                cursor:  !buttonState.email ? "pointer" : "not-allowed",
                opacity: buttonState.email ? 0.4 : 1,
              }}
              onClick={!buttonState.email ? handleEmail : undefined}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 16"
              fill="none"
            >
              <path d="M2 16C1.45 16 0.979333 15.8043 0.588 15.413C0.196667 15.0217 0.000666667 14.5507 0 14V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196666 1.45067 0.000666667 2 0H18C18.55 0 19.021 0.196 19.413 0.588C19.805 0.98 20.0007 1.45067 20 2V14C20 14.55 19.8043 15.021 19.413 15.413C19.0217 15.805 18.5507 16.0007 18 16H2ZM10 8.825C10.0833 8.825 10.171 8.81233 10.263 8.787C10.355 8.76167 10.4423 8.72433 10.525 8.675L17.6 4.25C17.7333 4.16667 17.8333 4.06267 17.9 3.938C17.9667 3.81333 18 3.67567 18 3.525C18 3.19167 17.8583 2.94167 17.575 2.775C17.2917 2.60833 17 2.61667 16.7 2.8L10 7L3.3 2.8C3 2.61667 2.70833 2.61267 2.425 2.788C2.14167 2.96333 2 3.209 2 3.525C2 3.69167 2.03333 3.83767 2.1 3.963C2.16667 4.08833 2.26667 4.184 2.4 4.25L9.475 8.675C9.55833 8.725 9.646 8.76267 9.738 8.788C9.83 8.81333 9.91733 8.82567 10 8.825Z" />
            </svg>

          </div>
        </form>
      </div>
    </>
  );
}