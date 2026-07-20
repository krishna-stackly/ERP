// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./createNewSupplier.css";
// import SupplierComment from "./supplierComment";
// import SupplierHistory from "./supplierHistory";
// import SupplierAttachment from "./supplierAttachment";
// import { toast } from "react-toastify";

// export default function createNewSupplier() {
//   const [SupplierStatus, setSupplierStatus] = useState("");

//   const [ApiSupplier, SetApiSupplier] = useState({});
//   const [SupplierData, setSupplierData] = useState([]);
//   const [SupplierItem, setSupplierItem] = useState([]);

//   const [numOfSupplierList, setnumOfSupplierList] = useState(1);
//   const [SupplierListData, setSupplierListData] = useState([{ unique_key: 0 }]);
//   const prevpg = useNavigate();

//   const SupplierFromApi = {
//     SupplierItem: [
//       {
//         product_name: "T-shirt",
//         product_id: "UKB-101",
//         uom: ["PCS", "TCS"],
//         in_stock: "20",
//         qty_ordered: "100",
//         insufficient_stock: "20",
//         total: "1000",
//       },
//       {
//         product_name: "M-shirt",
//         product_id: "UKB-102",
//         uom: ["EPS", "TCS"],
//         in_stock: "10",
//         qty_ordered: "50",
//         insufficient_stock: "20",
//         total: "1000",
//       },
//       {
//         product_name: "E-shirt",
//         product_id: "UKB-103",
//         uom: ["OPS", "DRS"],
//         in_stock: "20",
//         qty_ordered: "10",
//         insufficient_stock: "20",
//         total: "1000",
//       },
//     ],
//     SupplierData: [
//       // Fixed from 'purchasData' to 'SupplierData'
//       {
//         supplier_id: "SUP-001 - Microtronix Pvt Ltd",
//         supplier_name: "Microtronix Pvt Ltd",
//       },
//       {
//         supplier_id: "SUP-002 – Bright Office Supplies",
//         supplier_name: "Bright Office Supplies",
//       },
//     ],
//   };
//   const [detail, setDetail] = useState({
//     comment: true,
//     history: false,
//     attachment: false,
//   });

//   const [SupplierInput, setSupplierInput] = useState({
//     po_id: "",
//     po_date: "",
//     sales_order_ref: "",
//     delivery_date: "",
//     supplier_id: "",
//     supplier_name: "",
//     payment_trems: "",
//     inco_terms: "",
//     notes_comments: "",
//     currency: "",
//     global_discount: "",
//     shipping_charges: "",
//   });

//   useEffect(() => {
//     SetApiSupplier(SupplierFromApi);
//   }, []);

//   useEffect(() => {
//     if (Object.keys(ApiSupplier).length > 0) {
//       setSupplierData(ApiSupplier.SupplierData);
//       setSupplierItem(ApiSupplier.SupplierItem);
//     }
//   }, [ApiSupplier]);
//   useEffect(() => {
//     const selected = SupplierInput.supplier_id;

//     if (selected && SupplierData.length > 0) {
//       const supplier = SupplierData.find((ele) => ele.supplier_id === selected);
//       if (supplier) {
//         setSupplierInput((prev) => ({
//           ...prev,
//           supplier_name: supplier.supplier_name,
//           supplier_id: supplier.supplier_id,
//         }));
//       }
//     }
//   }, [SupplierInput.supplier_id, SupplierData]);

//   const handleSupplierInputChange = (e) => {
//     setSupplierInput((prev) => {
//       return { ...prev, [e.target.id]: e.target.value };
//     });
//   };

//   //status
//   const [SupplierBtn, setSupplierBtn] = useState({
//     buttonAcs: true,
//     cancel_order: true,
//     draft: false,
//     submit_po: false,
//     pdf: true,
//     mail: true,
//     stock_receipt: true,
//   });

//   useEffect(() => {
//     if (SupplierStatus === "") {
//       setSupplierBtn((prev) => ({
//         ...prev,
//         buttonAcs: false,
//         cancel_order: true,
//         draft: false,
//         submit_po: false,
//         pdf: true,
//         mail: true,
//         stock_receipt: true,
//       }));
//     }
//     switch (SupplierStatus) {
//       case "Draft":
//         setSupplierBtn((prev) => ({
//           ...prev,
//           buttonAcs: false,
//           cancel_order: true,
//           draft: false,
//           submit_po: false,
//           pdf: false,
//           mail: false,
//           stock_receipt: true,
//         }));
//         break;
//       case "Submitted":
//         setSupplierBtn((prev) => ({
//           ...prev,
//           buttonAcs: true,
//           cancel_order: false,
//           draft: true,
//           submit_po: true,
//           pdf: false,
//           mail: false,
//           stock_receipt: false,
//         }));
//         break;
//       case "Partially Received":
//         setSupplierBtn((prev) => ({
//           ...prev,
//           buttonAcs: true,
//           cancel_order: false,
//           draft: true,
//           submit_po: true,
//           pdf: false,
//           mail: false,
//           stock_receipt: false,
//         }));
//         break;
//       case "Received":
//         setSupplierBtn((prev) => ({
//           ...prev,
//           buttonAcs: true,
//           cancel_order: false,
//           draft: true,
//           submit_po: true,
//           pdf: false,
//           mail: false,
//           stock_receipt: false,
//         }));
//         break;
//       case "Cancelled":
//         setSupplierBtn((prev) => ({
//           ...prev,
//           buttonAcs: true,
//           cancel_order: true,
//           draft: true,
//           submit_po: true,
//           pdf: false,
//           mail: false,
//           stock_receipt: true,
//         }));
//         break;
//     }
//   }, [SupplierStatus]);

//   const handleSaveDraftState = (e) => {
//     e.preventDefault();
//     setSupplierStatus("Draft");
//     toast.success("Supplier Item in Save Draft State");
//   };
//   const handleSubmittedInvoiceState = (e) => {
//     e.preventDefault();
//     setSupplierStatus("Submitted");
//     toast.success("Supplier Item in Send State");
//   };
//   const handleCancelledState = (e) => {
//     e.preventDefault();
//     setSupplierStatus("Cancelled");
//     toast.success("Supplier Item in Cancelled State");
//   };
//   console.log(SupplierInput);

//   return (
//     <>
//       <div className="createNewSupplier-container">
//         <form onSubmit={handleSubmittedInvoiceState}>
//           <div className="createNewSupplier-head">
//             <nav>
//               <p>
//                 {SupplierStatus === ""
//                   ? "New Supplier Order"
//                   : "Supplier Order"}
//               </p>
//               {SupplierStatus !== "" && (
//                 <h3
//                   className={
//                     SupplierStatus === "Draft"
//                       ? "createNewSupplier-Status-draft"
//                       : SupplierStatus === "Submitted"
//                       ? "createNewSupplier-Status-Submitted"
//                       : SupplierStatus === "Cancelled"
//                       ? "createNewSupplier-Status-Cancelled"
//                       : SupplierStatus === "Partially Received"
//                       ? "createNewSupplier-Status-PartiallyReceived"
//                       : SupplierStatus === "Received"
//                       ? "createNewSupplier-Status-Received"
//                       : ""
//                   }
//                 >
//                   Status: {SupplierStatus}
//                 </h3>
//               )}
//             </nav>
//             <div>
//               <nav
//                 className="createNewSupplier-close"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   prevpg(-1);
//                 }}
//               >
//                 <svg
//                   className="createNewSupplier-circle-x-logo"
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 512 512"
//                 >
//                   <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
//                 </svg>
//                 <p>Close</p>
//               </nav>
//             </div>
//           </div>
//           <div className="createNewSupplier-input-container">
//             <div className="createNewSupplier-input-box">
//               <label htmlFor="po_id">Supplier ID {`(Auto Generate)`}<sup>*</sup></label>
//               <input
//                 id="supplier_id"
//                 type="text"
//                 value={SupplierInput.po_id}
//                 onChange={handleSupplierInputChange}
//                 placeholder="Auto Generate"
//                 disabled
//               />
//             </div>
//             <div className="createNewSupplier-input-box">
//               <label htmlFor="po_id">Tax Identification Number(Tax ID/GST IN/VAT ID)<sup>*</sup></label>
//               <input
//                 id="tin_id"
//                 type="text"
//                 value={SupplierInput.tin_id}
//                 onChange={handleSupplierInputChange}
//                 placeholder="Eg:ABCD17CD98D5678E"
//                 required
//               />
//             </div>
//           </div>
//           <div className="createNewSupplier-input-container">
//             <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_id">Supplier Name<sup>*</sup></label>
//               <input
//                 id="supplier_id"
//                 type="text"
//                 value={SupplierInput.supplier_id}
//                 onChange={handleSupplierInputChange}
//                 placeholder="Eg: ABC Industrial Supplies Private Limited"
//               />
//             </div>
//             <div className="createNewSupplier-input-box">
//               <label htmlFor="po_id">Company Registration Number<sup>*</sup></label>
//               <input
//                 id="tin_id"
//                 type="text"
//                 value={SupplierInput.tin_id}
//                 onChange={handleSupplierInputChange}
//                 placeholder="Eg: CIN:U23DRE456YUOU98"
//               />
//             </div>
//           </div>
//           <div className="createNewSupplier-input-container">
//             <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">Legal Entity Name<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Eg: ABC Industrial Supplies Private Limited"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//             <div className="createNewSupplier-input-box">
//               <label htmlFor="country_id">
//                 Country of Registration<sup>*</sup>
//               </label>
//               <select
//                 id="supplier_id"
//                 value={SupplierInput.supplier_id}
//                 onChange={handleSupplierInputChange}
//                 disabled={SupplierBtn.buttonAcs}
//                 required
//               >
//                 <option>Select Country</option>
//                 {SupplierData &&
//                   SupplierData.length > 0 &&
//                   SupplierData.map((ele, ind) => (
//                     <option key={ind} value={ele.supplier_id}>
//                       {ele.supplier_id}
//                     </option>
//                   ))}
//               </select>
//             </div>
            
//           </div>
//            <div className="createNewSupplier-input-container">
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="country_id">
//                 Supplier Type<sup>*</sup>
//               </label>
//               <select
//                 id="supplier_id"
//                 value={SupplierInput.supplier_id}
//                 onChange={handleSupplierInputChange}
//                 disabled={SupplierBtn.buttonAcs}
//                 required
//               >
//                 <option>Select Supplier Type</option>
//                 {SupplierData &&
//                   SupplierData.length > 0 &&
//                   SupplierData.map((ele, ind) => (
//                     <option key={ind} value={ele.supplier_id}>
//                       {ele.supplier_id}
//                     </option>
//                   ))}
//               </select>
//             </div>
//             <div className="createNewSupplier-input-box">
//               <label htmlFor="country_id">
//                 Status<sup>*</sup>
//               </label>
//               <select
//                 id="supplier_id"
//                 value={SupplierInput.supplier_id}
//                 onChange={handleSupplierInputChange}
//                 disabled={SupplierBtn.buttonAcs}
//                 required
//               >
//                 <option>Select Status</option>
//                 {SupplierData &&
//                   SupplierData.length > 0 &&
//                   SupplierData.map((ele, ind) => (
//                     <option key={ind} value={ele.supplier_id}>
//                       {ele.supplier_id}
//                     </option>
//                   ))}
//               </select>
//             </div>
            
//           </div>
//           <div className="createNewSupplier-input-container">
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="country_id">
//                 Supplier Tier<sup>*</sup>
//               </label>
//               <select
//                 id="supplier_id"
//                 value={SupplierInput.supplier_id}
//                 onChange={handleSupplierInputChange}
//                 disabled={SupplierBtn.buttonAcs}
//                 required
//               >
//                 <option>Select Tier</option>
//                 {SupplierData &&
//                   SupplierData.length > 0 &&
//                   SupplierData.map((ele, ind) => (
//                     <option key={ind} value={ele.supplier_id}>
//                       {ele.supplier_id}
//                     </option>
//                   ))}
//               </select>
//             </div>
//             <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">Product Details<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Enter Supplier Name"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//           </div>
//           <nav className="createNewSupplier-subtit">Contact Information</nav>
//           <div className="createNewSupplier-input-container">
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">Primary Contact Name<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Enter First name"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">Last Name<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Enter Last Name"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//           </div>
//           <div className="createNewSupplier-input-container">
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">Designation / Role<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Enter your Designation/Role"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">Alternate Contact No<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="+91 9988998823"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//           </div>
//           <div className="createNewSupplier-input-container">
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">Email<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Eg: pp@gmail.com"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">Website<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Enter Website Name"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//           </div>
//           <div className="createNewSupplier-input-container">
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">Phone Number<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="+91 9876545789"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">Relationship Manager(Internal)<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Enter Manager Name"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//           </div>
//           <nav className="createNewSupplier-subtit">Addresses</nav>
//           <div className="createNewSupplier-input-container">
//             <div className="createNewSupplier-input-box">
//               <label htmlFor="sales_order_reference">
//                 Registered Office Address<sup>*</sup>
//               </label>
//               <input
//                 id="sales_order_reference"
//                 value={SupplierInput.sales_order_ref}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Enter Office Address"
//                 disabled
//               />
//             </div>
//           </div>
//           <div className="createNewSupplier-input-container">
//             <div className="createNewSupplier-input-box">
//               <label htmlFor="sales_order_reference">
//                 Mailing Address<sup>*</sup>
//               </label>
//               <input
//                 id="sales_order_reference"
//                 value={SupplierInput.sales_order_ref}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Enter mailing Address"
//                 disabled
//               />
//             </div>
//           </div>
//           <div className="createNewSupplier-input-container">
//             <div className="createNewSupplier-input-box">
//               <label htmlFor="sales_order_reference">
//                 Warehouse/Delivery Address<sup>*</sup>
//             </label>
//               <input
//                 id="sales_order_reference"
//                 value={SupplierInput.sales_order_ref}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Enter Delivery Address"
//                 disabled
//               />
//             </div>
//           </div>
//           <div className="createNewSupplier-input-container">
//             <div className="createNewSupplier-input-box">
//               <label htmlFor="sales_order_reference">
//                 Billing Address<sup>*</sup>
//               <sup>*</sup></label>
//               <input
//                 id="sales_order_reference"
//                 value={SupplierInput.sales_order_ref}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Enter Billing Address"
//                 disabled
//               />
//             </div>
//           </div>
//            <div className="createNewSupplier-input-container">
//             <div className="createNewSupplier-input-box">
//               <label htmlFor="country_id">
//                 Country of Registration<sup>*</sup>
//               <sup>*</sup></label>
//               <select
//                 id="supplier_id"
//                 value={SupplierInput.supplier_id}
//                 onChange={handleSupplierInputChange}
//                 disabled={SupplierBtn.buttonAcs}
//                 required
//               >
//                 <option>Select Country</option>
//                 {SupplierData &&
//                   SupplierData.length > 0 &&
//                   SupplierData.map((ele, ind) => (
//                     <option key={ind} value={ele.supplier_id}>
//                       {ele.supplier_id}
//                     </option>
//                   ))}
//               </select>
//             </div>
//           </div>
//           <nav className="createNewSupplier-subtit">Banking & Payment Information</nav>
//           <div className="createNewSupplier-input-container">
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">Bank Name<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Enter Bank Name"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">Payment Method<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Payment Method(ACH,Wire,Check,etc..)"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//           </div>
//           <div className="createNewSupplier-input-container">
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">Bank Account No<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Enter Bank Account Number"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//                <div className="createNewInvoice-input-box">
//               <label htmlFor="payment_terms">
//                 Payment Terms<sup>*</sup>
//               </label>
//               <select
//                 id="payment_terms"
//                 value={SupplierInput.payment_terms}
//                 onChange={handleSupplierInputChange}
//                 required
//                 disabled={SupplierBtn.buttonAcs}
//               >
//                 <option value="">Select Payment</option>
//                 <option value="Net 15">Net 15</option>
//                 <option value="Net 30">Net 30</option>
//                 <option value="Net 45">Net 45</option>
//                 <option value="Due on Receipt">Due on Receipt</option>
//               </select>
//             </div>
//           </div>
//           <div className="createNewSupplier-input-container">
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">IBAN/SWIFT Code<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Enter IBAN/SWIFT code"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">Tax Withholding Setup<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Tax Withholding Setup"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//           </div>
//           <div className="createNewSupplier-input-container">
//              <div className="createNewSupplier-input-box">
//                <label htmlFor="currency">
//                 Currency<sup>*</sup>
//               </label>
//               <select
//                 id="currency"
//                 value={SupplierInput.currency}
//                 onChange={handleSupplierInputChange}
//                 required
//                 disabled={SupplierBtn.BtnAccess}
//               >
//                 <option value="">Select Currency</option>
//                 <option value="USD">USD</option>
//                 <option value="EUR">EUR</option>
//                 <option value="IND">IND</option>
//                 <option value="GBP">GBP</option>
//                 <option value="SGD">SGD</option>
//               </select>
//             </div>
//           </div>
//           <nav className="createNewSupplier-subtit">Procurement & Operational Data</nav>
//           <div className="createNewSupplier-input-container">
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">Categories Served<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Eg: Goods/Services"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">Inco Terms<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Eg: FOB,CIF,CIP"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//           </div>
//           <div className="createNewSupplier-input-container">
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">Product/Service Catalog<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Product/Service Catalog"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">Freight Items<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="FOB origin / DDP"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//           </div>
//           <div className="createNewSupplier-input-container">
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">Minimum order Quantity<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Eg: 1/5/10 units"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">Return & Replacement Policy<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Return accepted within 10 days of delivery"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//           </div>
//           <div className="createNewSupplier-input-container">
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">Average Time (Days)<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Eg : 1-3 days or 4-7 days"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">Contract References<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Contract References"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//           </div>
//           <nav className="createNewSupplier-subtit">Compliance & Risk Management</nav>
//           <div className="createNewSupplier-input-container">
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">Certifications<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Certifications (ISO 9001)"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">Risk Notes/Flags<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Enter risk details or observations"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//           </div>
//           <div className="createNewSupplier-input-container">
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">Compliance Status<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Compliance Status"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">Last Risk Assessment Date<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="DD/MM/YYYY"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//           </div>
//           <div className="createNewSupplier-input-container">
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">Insurance Documents/Info<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="PDF or Document Link"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">Migration Plans<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Migration Plans"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//           </div>
//           <div className="createNewSupplier-input-container">
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">Risk Ratings<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Enter risk ratings"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//           </div>
//            <nav className="createNewSupplier-subtit">Performance & Evaluation</nav>
//           <div className="createNewSupplier-input-container">
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">On-Time Delivery Rate(%)<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Eg: 98.5%"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">Quality Ratings(1-5 stars/ % Score)<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Eg : 4.2/5 stars / 92%"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//           </div>
//           <div className="createNewSupplier-input-container">
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">Defect/Return Rate(%)<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Eg:1.2%"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">Last Evaluation Date<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Eg: 2025-09-20"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//           </div>
//           <div className="createNewSupplier-input-container">
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">Contract Breaches(Y/N)<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Eg: N(No breaches) or Y(2025-09-28)"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">Improvement Plans<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Eg: Action:review packaging to reduce damage"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//           </div>
//           <div className="createNewSupplier-input-container">
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">Compliants Registered<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Enter Total Complaints"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//           </div>
//           <nav className="createNewSupplier-subtit">Relationship & Communication History</nav>
//           <div className="createNewSupplier-input-container">
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">External Key Contact<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Primary contact name/Title"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">Dispute Resolutions<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Attach documnets to Past disputes and resolutions"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//           </div>
//           <div className="createNewSupplier-input-container">
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">Interaction Logs(Link to CRM logs)<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Attach or link record of calls / emails"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">Feedback/Surveys<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Attach supplier performance survey results"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//           </div>
//           <div className="createNewSupplier-input-container">
//              <div className="createNewSupplier-input-box">
//               <label htmlFor="supplier_name">Visit History/Meeting Notes<sup>*</sup></label>
//               <input
//                 id="supplier_name"
//                 value={SupplierInput.supplier_name}
//                 onChange={handleSupplierInputChange}
//                 type="text"
//                 placeholder="Discuss last meeting date,discussion summary"
//                 disabled={SupplierBtn.buttonAcs}
//               />
//             </div>
//           </div>
//           <div className="createNewSupplier-hub-container">
//             <div className="createNewSupplier-hub-head">
//               <p
//                 className={
//                   detail.comment
//                     ? "createNewSupplier-hub-head-bg-black"
//                     : "createNewSupplier-hub-head-tit"
//                 }
//                 onClick={() => {
//                   setDetail({
//                     history: false,
//                     attachment: false,
//                     comment: true,
//                   });
//                 }}
//               >
//                 Comments
//               </p>
//               <p
//                 className={
//                   detail.history
//                     ? "createNewSupplier-hub-head-bg-black"
//                     : "createNewSupplier-hub-head-tit"
//                 }
//                 onClick={() => {
//                   setDetail({
//                     history: true,
//                     attachment: false,
//                     comment: false,
//                   });
//                 }}
//               >
//                 History
//               </p>
//               <p
//                 className={
//                   detail.attachment
//                     ? "createNewSupplier-hub-head-bg-black"
//                     : "createNewSupplier-hub-head-tit"
//                 }
//                 onClick={() => {
//                   setDetail({
//                     history: false,
//                     attachment: true,
//                     comment: false,
//                   });
//                 }}
//               >
//                 Attachments
//               </p>
//             </div>
//             <div className="createNewSupplier-hub-body">
//               {detail.comment && <SupplierComment />}
//               {detail.history && <SupplierHistory />}
//               {detail.attachment && (
//                 <SupplierAttachment inputDisable={SupplierBtn.buttonAcs} />
//               )}
//             </div>
//           </div>
//           <div className="createNewSupplier-btn-container">
//             <button
//               className={
//                 SupplierStatus === "Submitted" || SupplierStatus === "Cancelled"
//                   ? "createNewSupplier-order-active-btn"
//                   : "createNewSupplier-inactive-btn"
//               }
//               onClick={handleCancelledState}
//               disabled={SupplierBtn.cancel_order}
//             >
//               {SupplierStatus === "Cancelled" ? "Cancel Order" : "Delete SP"}
//             </button>
//             <nav>
//               <button
//                 className="createNewSupplier-cancel-btn"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   prevpg(-1);
//                 }}
//               >
//                 Cancel
//               </button>
//               <button
//                 className={
//                   SupplierStatus === "" || SupplierStatus === "Draft"
//                     ? "createNewSupplier-active-btn"
//                     : "createNewSupplier-completed-btn"
//                 }
//                 onClick={handleSaveDraftState}
//                 disabled={SupplierBtn.draft}
//               >
//                 Save Draft
//               </button>
//               <button
//                 className={
//                   SupplierStatus === "" || SupplierStatus === "Draft"
//                     ? "createNewSupplier-active-btn"
//                     : "createNewSupplier-completed-btn"
//                 }
//                 disabled={SupplierBtn.submit_po}
//               >
//                 {SupplierStatus === "Submitted" ? "Submitted PO" : "Submit PO"}
//               </button>
//               <svg
//                 className={
//                   SupplierStatus !== ""
//                     ? "createNewSupplier-pdf-mail-activelogo"
//                     : "createNewSupplier-pdf-mail-futurelogo"
//                 }
//                 disabled={SupplierBtn.pdf}
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 22 24"
//                 fill="none"
//               >
//                 <path
//                   fillRule="evenodd"
//                   clipRule="evenodd"
//                   d="M0.600098 2.4C0.600098 1.76348 0.852954 1.15303 1.30304 0.702944C1.75313 0.252856 2.36358 0 3.0001 0L16.1313 0L21.4001 5.2688V21.6C21.4001 22.2365 21.1472 22.847 20.6972 23.2971C20.2471 23.7471 19.6366 24 19.0001 24H3.0001C2.36358 24 1.75313 23.7471 1.30304 23.2971C0.852954 22.847 0.600098 22.2365 0.600098 21.6V2.4ZM4.6001 9.6H2.2001V17.6H3.8001V14.4H4.6001C5.23662 14.4 5.84707 14.1471 6.29715 13.6971C6.74724 13.247 7.0001 12.6365 7.0001 12C7.0001 11.3635 6.74724 10.753 6.29715 10.3029C5.84707 9.85286 5.23662 9.6 4.6001 9.6ZM11.0001 9.6H8.6001V17.6H11.0001C11.6366 17.6 12.2471 17.3471 12.6972 16.8971C13.1472 16.447 13.4001 15.8365 13.4001 15.2V12C13.4001 11.3635 13.1472 10.753 12.6972 10.3029C12.2471 9.85286 11.6366 9.6 11.0001 9.6ZM15.0001 17.6V9.6H19.8001V11.2H16.6001V12.8H18.2001V14.4H16.6001V17.6H15.0001Z"
//                 />
//               </svg>
//               <svg
//                 className={
//                   SupplierStatus !== ""
//                     ? "createNewSupplier-pdf-mail-activelogo"
//                     : "createNewSupplier-pdf-mail-futurelogo"
//                 }
//                 disabled={SupplierBtn.mail}
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 20 16"
//                 fill="none"
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
import React, { useState, useEffect } from "react";
import "./createNewSupplier.css";
import { toast } from "react-toastify";
import supplierApiProvider from "../../../network/supplier-api-provider";

export default function CreateEditSupplier({
  setShowAddSupplier,
  editShowAddSupplier,
  editAddSupplierData,
  setEditAddSupplierData,
}) {
  const [purchasingRepList, setPurchasingRepList] = useState([]);
  const [lastEditDate, setLastEditDate] = useState("");

  const [NewSupplier, setNewSupplier] = useState({
    supplier_id: "",
    tin_id: "",
    supplier_name: "",
    company_registration_number: "",
    legal_entity_name: "",
    country_of_registration: "",
    supplier_type: "",
    status: "",
    supplier_tier: "",
    product_details: "",
    
    // Contact Information
    primary_contact_first_name: "",
    primary_contact_last_name: "",
    designation_role: "",
    alternate_contact_no: "",
    email: "",
    website: "",
    phone_number: "",
    relationship_manager: "",
    
    // Addresses
    registered_office_address: "",
    mailing_address: "",
    warehouse_delivery_address: "",
    billing_address: "",
    
    // Banking & Payment
    bank_name: "",
    payment_method: "",
    bank_account_no: "",
    payment_terms: "",
    iban_swift_code: "",
    tax_withholding_setup: "",
    currency: "",
    
    // Procurement & Operational
    categories_served: "",
    inco_terms: "",
    product_service_catalog: "",
    freight_terms: "",
    minimum_order_quantity: "",
    return_replacement_policy: "",
    average_delivery_time: "",
    contract_references: "",
    
    // Compliance & Risk
    certifications: "",
    risk_notes: "",
    compliance_status: "",
    last_risk_assessment_date: "",
    insurance_documents: "",
    mitigation_plans: "",
    risk_ratings: "",
    
    // Performance & Evaluation
    on_time_delivery_rate: "",
    quality_ratings: "",
    defect_return_rate: "",
    last_evaluation_date: "",
    contract_breaches: "",
    improvement_plans: "",
    complaints_registered: "",
    
    // Relationship & Communication
    external_key_contact: "",
    dispute_resolutions: "",
    interaction_logs: "",
    feedback_surveys: "",
    visit_history: "",
  });

  // Fetch Purchasing Representatives
  useEffect(() => {
    const loadPurchasingReps = async () => {
      const purchasingReps = await supplierApiProvider.fetchPurchasingReps();
      setPurchasingRepList(purchasingReps);
    };

    loadPurchasingReps();
  }, []);

  // Pre-fill form in edit mode
  useEffect(() => {
    if (editShowAddSupplier && editAddSupplierData && Object.keys(editAddSupplierData).length > 0) {
      setNewSupplier({
        supplier_id: editAddSupplierData.supplier_id || "",
        tin_id: editAddSupplierData.tin_id || "",
        supplier_name: editAddSupplierData.supplier_name || "",
        company_registration_number: editAddSupplierData.company_registration_number || "",
        legal_entity_name: editAddSupplierData.legal_entity_name || "",
        country_of_registration: editAddSupplierData.country_of_registration || "",
        supplier_type: editAddSupplierData.supplier_type || "",
        status: editAddSupplierData.status || "",
        supplier_tier: editAddSupplierData.supplier_tier || "",
        product_details: editAddSupplierData.product_details || "",
        
        primary_contact_first_name: editAddSupplierData.primary_contact_first_name || "",
        primary_contact_last_name: editAddSupplierData.primary_contact_last_name || "",
        designation_role: editAddSupplierData.designation_role || "",
        alternate_contact_no: editAddSupplierData.alternate_contact_no || "",
        email: editAddSupplierData.email || "",
        website: editAddSupplierData.website || "",
        phone_number: editAddSupplierData.phone_number || "",
        relationship_manager: editAddSupplierData.relationship_manager || "",
        
        registered_office_address: editAddSupplierData.registered_office_address || "",
        mailing_address: editAddSupplierData.mailing_address || "",
        warehouse_delivery_address: editAddSupplierData.warehouse_delivery_address || "",
        billing_address: editAddSupplierData.billing_address || "",
        
        bank_name: editAddSupplierData.bank_name || "",
        payment_method: editAddSupplierData.payment_method || "",
        bank_account_no: editAddSupplierData.bank_account_no || "",
        payment_terms: editAddSupplierData.payment_terms || "",
        iban_swift_code: editAddSupplierData.iban_swift_code || "",
        tax_withholding_setup: editAddSupplierData.tax_withholding_setup || "",
        currency: editAddSupplierData.currency || "",
        
        categories_served: editAddSupplierData.categories_served || "",
        inco_terms: editAddSupplierData.inco_terms || "",
        product_service_catalog: editAddSupplierData.product_service_catalog || "",
        freight_terms: editAddSupplierData.freight_terms || "",
        minimum_order_quantity: editAddSupplierData.minimum_order_quantity || "",
        return_replacement_policy: editAddSupplierData.return_replacement_policy || "",
        average_delivery_time: editAddSupplierData.average_delivery_time || "",
        contract_references: editAddSupplierData.contract_references || "",
        
        certifications: editAddSupplierData.certifications || "",
        risk_notes: editAddSupplierData.risk_notes || "",
        compliance_status: editAddSupplierData.compliance_status || "",
        last_risk_assessment_date: editAddSupplierData.last_risk_assessment_date || "",
        insurance_documents: editAddSupplierData.insurance_documents || "",
        mitigation_plans: editAddSupplierData.mitigation_plans || "",
        risk_ratings: editAddSupplierData.risk_ratings || "",
        
        on_time_delivery_rate: editAddSupplierData.on_time_delivery_rate || "",
        quality_ratings: editAddSupplierData.quality_ratings || "",
        defect_return_rate: editAddSupplierData.defect_return_rate || "",
        last_evaluation_date: editAddSupplierData.last_evaluation_date || "",
        contract_breaches: editAddSupplierData.contract_breaches || "",
        improvement_plans: editAddSupplierData.improvement_plans || "",
        complaints_registered: editAddSupplierData.complaints_registered || "",
        
        external_key_contact: editAddSupplierData.external_key_contact || "",
        dispute_resolutions: editAddSupplierData.dispute_resolutions || "",
        interaction_logs: editAddSupplierData.interaction_logs || "",
        feedback_surveys: editAddSupplierData.feedback_surveys || "",
        visit_history: editAddSupplierData.visit_history || "",
      });
      setLastEditDate(editAddSupplierData.last_edit_date || "");
    } else {
      const today = new Date();
      const options = { month: "long", day: "numeric", year: "numeric" };
      setLastEditDate(today.toLocaleDateString("en-US", options));
    }
  }, [editAddSupplierData, editShowAddSupplier]);

  const handleNewSupplierDataChange = (e) => {
    const { id, value } = e.target;
    setNewSupplier((prev) => ({ ...prev, [id]: value }));
  };

  const handleCreateEditSupplierReset = (e) => {
    e.preventDefault();
    setNewSupplier({
      supplier_id: "",
      tin_id: "",
      supplier_name: "",
      company_registration_number: "",
      legal_entity_name: "",
      country_of_registration: "",
      supplier_type: "",
      status: "",
      supplier_tier: "",
      product_details: "",
      primary_contact_first_name: "",
      primary_contact_last_name: "",
      designation_role: "",
      alternate_contact_no: "",
      email: "",
      website: "",
      phone_number: "",
      relationship_manager: "",
      registered_office_address: "",
      mailing_address: "",
      warehouse_delivery_address: "",
      billing_address: "",
      bank_name: "",
      payment_method: "",
      bank_account_no: "",
      payment_terms: "",
      iban_swift_code: "",
      tax_withholding_setup: "",
      currency: "",
      categories_served: "",
      inco_terms: "",
      product_service_catalog: "",
      freight_terms: "",
      minimum_order_quantity: "",
      return_replacement_policy: "",
      average_delivery_time: "",
      contract_references: "",
      certifications: "",
      risk_notes: "",
      compliance_status: "",
      last_risk_assessment_date: "",
      insurance_documents: "",
      mitigation_plans: "",
      risk_ratings: "",
      on_time_delivery_rate: "",
      quality_ratings: "",
      defect_return_rate: "",
      last_evaluation_date: "",
      contract_breaches: "",
      improvement_plans: "",
      complaints_registered: "",
      external_key_contact: "",
      dispute_resolutions: "",
      interaction_logs: "",
      feedback_surveys: "",
      visit_history: "",
    });
    setShowAddSupplier(false);
    if (setEditAddSupplierData) {
      setEditAddSupplierData({});
    }
  };

  const handleCreateEditSupplierSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = { 
        ...NewSupplier, 
        last_edit_date: lastEditDate 
      };

      let response;

      if (editShowAddSupplier && editAddSupplierData.id) {
        // Update existing supplier
        response = await supplierApiProvider.updateSupplier(
          editAddSupplierData.id,
          formData
        );
      } else {
        // Create new supplier
        response = await supplierApiProvider.createSupplier(formData);
      }

      if (response) {
        // Success - reset form and close modal
        setNewSupplier({
          supplier_id: "",
          tin_id: "",
          supplier_name: "",
          company_registration_number: "",
          legal_entity_name: "",
          country_of_registration: "",
          supplier_type: "",
          status: "",
          supplier_tier: "",
          product_details: "",
          primary_contact_first_name: "",
          primary_contact_last_name: "",
          designation_role: "",
          alternate_contact_no: "",
          email: "",
          website: "",
          phone_number: "",
          relationship_manager: "",
          registered_office_address: "",
          mailing_address: "",
          warehouse_delivery_address: "",
          billing_address: "",
          bank_name: "",
          payment_method: "",
          bank_account_no: "",
          payment_terms: "",
          iban_swift_code: "",
          tax_withholding_setup: "",
          currency: "",
          categories_served: "",
          inco_terms: "",
          product_service_catalog: "",
          freight_terms: "",
          minimum_order_quantity: "",
          return_replacement_policy: "",
          average_delivery_time: "",
          contract_references: "",
          certifications: "",
          risk_notes: "",
          compliance_status: "",
          last_risk_assessment_date: "",
          insurance_documents: "",
          mitigation_plans: "",
          risk_ratings: "",
          on_time_delivery_rate: "",
          quality_ratings: "",
          defect_return_rate: "",
          last_evaluation_date: "",
          contract_breaches: "",
          improvement_plans: "",
          complaints_registered: "",
          external_key_contact: "",
          dispute_resolutions: "",
          interaction_logs: "",
          feedback_surveys: "",
          visit_history: "",
        });
        setShowAddSupplier(false);
        if (setEditAddSupplierData) {
          setEditAddSupplierData({});
        }
      }
    } catch (error) {
      console.error("Error submitting supplier:", error);
    }
  };

  return (
    <div className="createNewSupplier-container">
      <form onSubmit={handleCreateEditSupplierSubmit}>
        <div className="createNewSupplier-tit">
          <p>{editShowAddSupplier ? "Edit" : "Create New"} Supplier</p>
          <div
            onClick={() => {
              setShowAddSupplier(false);
              if (setEditAddSupplierData) {
                setEditAddSupplierData({});
              }
            }}
            className="close-createNewSupplier-container"
          >
            {/* <svg
              className="circle-x-logo-createNewSupplier"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
            </svg> */}
            <nav>Close</nav>
          </div>
        </div>

        <nav className="createNewSupplier-subtit">Basic Info</nav>
        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="supplier_id">
              Supplier ID (Auto Generate)<sup>*</sup>
            </label>
            <input
              id="supplier_id"
              type="text"
              value={NewSupplier.supplier_id}
              onChange={handleNewSupplierDataChange}
              placeholder="Auto Generate"
              disabled
            />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="tin_id">
              Tax Identification Number (Tax ID/GST IN/VAT ID)<sup>*</sup>
            </label>
            <input
              id="tin_id"
              type="text"
              value={NewSupplier.tin_id}
              onChange={handleNewSupplierDataChange}
              placeholder="Eg: ABCD17CD98D5678E"
              required
            />
          </div>
        </div>

        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="supplier_name">
              Supplier Name<sup>*</sup>
            </label>
            <input
              id="supplier_name"
              type="text"
              value={NewSupplier.supplier_name}
              onChange={handleNewSupplierDataChange}
              placeholder="Eg: ABC Industrial Supplies Private Limited"
              required
            />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="company_registration_number">
              Company Registration Number<sup>*</sup>
            </label>
            <input
              id="company_registration_number"
              type="text"
              value={NewSupplier.company_registration_number}
              onChange={handleNewSupplierDataChange}
              placeholder="Eg: CIN:U23DRE456YUOU98"
              required
            />
          </div>
        </div>

        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="legal_entity_name">
              Legal Entity Name<sup>*</sup>
            </label>
            <input
              id="legal_entity_name"
              value={NewSupplier.legal_entity_name}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="Eg: ABC Industrial Supplies Private Limited"
              required
            />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="country_of_registration">
              Country of Registration<sup>*</sup>
            </label>
            <select
              id="country_of_registration"
              value={NewSupplier.country_of_registration}
              onChange={handleNewSupplierDataChange}
              required
            >
              <option value="">Select Country</option>
              <option value="USA">USA</option>
              <option value="India">India</option>
              <option value="UK">UK</option>
              <option value="China">China</option>
              <option value="Germany">Germany</option>
            </select>
          </div>
        </div>

        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="supplier_type">
              Supplier Type<sup>*</sup>
            </label>
            <select
              id="supplier_type"
              value={NewSupplier.supplier_type}
              onChange={handleNewSupplierDataChange}
              required
            >
              <option value="">Select Supplier Type</option>
              <option value="Manufacturer">Manufacturer</option>
              <option value="Distributor">Distributor</option>
              <option value="Service Provider">Service Provider</option>
              <option value="Wholesaler">Wholesaler</option>
            </select>
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="status">
              Status<sup>*</sup>
            </label>
            <select
              id="status"
              value={NewSupplier.status}
              onChange={handleNewSupplierDataChange}
              required
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="supplier_tier">
              Supplier Tier<sup>*</sup>
            </label>
            <select
              id="supplier_tier"
              value={NewSupplier.supplier_tier}
              onChange={handleNewSupplierDataChange}
              required
            >
              <option value="">Select Tier</option>
              <option value="Strategic">Strategic</option>
              <option value="Preferred">Preferred</option>
              <option value="Backup">Backup</option>
            </select>
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="product_details">Product Details</label>
            <input
              id="product_details"
              value={NewSupplier.product_details}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="Enter Product Details"
            />
          </div>
        </div>

        <nav className="createNewSupplier-subtit">Contact Information</nav>
        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="primary_contact_first_name">
              Primary Contact First Name<sup>*</sup>
            </label>
            <input
              id="primary_contact_first_name"
              value={NewSupplier.primary_contact_first_name}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="Enter First Name"
              required
            />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="primary_contact_last_name">
              Last Name<sup>*</sup>
            </label>
            <input
              id="primary_contact_last_name"
              value={NewSupplier.primary_contact_last_name}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="Enter Last Name"
              required
            />
          </div>
        </div>

        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="designation_role">Designation / Role</label>
            <input
              id="designation_role"
              value={NewSupplier.designation_role}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="Enter Designation/Role"
            />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="alternate_contact_no">Alternate Contact No</label>
            <input
              id="alternate_contact_no"
              value={NewSupplier.alternate_contact_no}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="+91 9988998823"
            />
          </div>
        </div>

        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="email">
              Email<sup>*</sup>
            </label>
            <input
              id="email"
              value={NewSupplier.email}
              onChange={handleNewSupplierDataChange}
              type="email"
              placeholder="Eg: supplier@example.com"
              required
            />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              value={NewSupplier.website}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="Enter Website URL"
            />
          </div>
        </div>

        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="phone_number">
              Phone Number<sup>*</sup>
            </label>
            <input
              id="phone_number"
              value={NewSupplier.phone_number}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="+91 9876545789"
              required
            />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="relationship_manager">
              Relationship Manager (Internal)
            </label>
            <select
              id="relationship_manager"
              value={NewSupplier.relationship_manager}
              onChange={handleNewSupplierDataChange}
            >
              <option value="">Select Manager</option>
              {purchasingRepList.length > 0 ? (
                purchasingRepList.map((rep) => (
                  <option key={rep.id} value={rep.id}>
                    {rep.first_name} {rep.last_name || ""}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No managers available
                </option>
              )}
            </select>
          </div>
        </div>

        <nav className="createNewSupplier-subtit">Addresses</nav>
        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="registered_office_address">
              Registered Office Address<sup>*</sup>
            </label>
            <input
              id="registered_office_address"
              value={NewSupplier.registered_office_address}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="Enter Office Address"
              required
            />
          </div>
        </div>

        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="mailing_address">Mailing Address</label>
            <input
              id="mailing_address"
              value={NewSupplier.mailing_address}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="Enter Mailing Address"
            />
          </div>
        </div>

        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="warehouse_delivery_address">
              Warehouse/Delivery Address
            </label>
            <input
              id="warehouse_delivery_address"
              value={NewSupplier.warehouse_delivery_address}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="Enter Delivery Address"
            />
          </div>
        </div>

        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="billing_address">Billing Address</label>
            <input
              id="billing_address"
              value={NewSupplier.billing_address}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="Enter Billing Address"
            />
          </div>
        </div>

        <nav className="createNewSupplier-subtit">Banking & Payment Information</nav>
        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="bank_name">Bank Name</label>
            <input
              id="bank_name"
              value={NewSupplier.bank_name}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="Enter Bank Name"
            />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="payment_method">Payment Method</label>
            <input
              id="payment_method"
              value={NewSupplier.payment_method}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="Payment Method (ACH, Wire, Check, etc.)"
            />
          </div>
        </div>

        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="bank_account_no">Bank Account No</label>
            <input
              id="bank_account_no"
              value={NewSupplier.bank_account_no}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="Enter Bank Account Number"
            />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="payment_terms">Payment Terms</label>
            <select
              id="payment_terms"
              value={NewSupplier.payment_terms}
              onChange={handleNewSupplierDataChange}
            >
              <option value="">Select Payment Terms</option>
              <option value="Net 15">Net 15</option>
              <option value="Net 30">Net 30</option>
              <option value="Net 45">Net 45</option>
              <option value="Net 60">Net 60</option>
              <option value="Due on Receipt">Due on Receipt</option>
            </select>
          </div>
        </div>

        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="iban_swift_code">IBAN/SWIFT Code</label>
            <input
              id="iban_swift_code"
              value={NewSupplier.iban_swift_code}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="Enter IBAN/SWIFT Code"
            />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="tax_withholding_setup">Tax Withholding Setup</label>
            <input
              id="tax_withholding_setup"
              value={NewSupplier.tax_withholding_setup}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="Tax Withholding Setup"
            />
          </div>
        </div>

        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="currency">Currency</label>
            <select
              id="currency"
              value={NewSupplier.currency}
              onChange={handleNewSupplierDataChange}
            >
              <option value="">Select Currency</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="INR">INR</option>
              <option value="GBP">GBP</option>
              <option value="SGD">SGD</option>
            </select>
          </div>
        </div>

        <nav className="createNewSupplier-subtit">Procurement & Operational Data</nav>
        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="categories_served">Categories Served</label>
            <input
              id="categories_served"
              value={NewSupplier.categories_served}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="Eg: Goods/Services"
            />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="inco_terms">Inco Terms</label>
            <input
              id="inco_terms"
              value={NewSupplier.inco_terms}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="Eg: FOB, CIF, CIP"
            />
          </div>
        </div>

        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="product_service_catalog">Product/Service Catalog</label>
            <input
              id="product_service_catalog"
              value={NewSupplier.product_service_catalog}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="Product/Service Catalog"
            />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="freight_terms">Freight Terms</label>
            <input
              id="freight_terms"
              value={NewSupplier.freight_terms}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="FOB origin / DDP"
            />
          </div>
        </div>

        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="minimum_order_quantity">Minimum Order Quantity</label>
            <input
              id="minimum_order_quantity"
              value={NewSupplier.minimum_order_quantity}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="Eg: 1/5/10 units"
            />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="return_replacement_policy">Return & Replacement Policy</label>
            <input
              id="return_replacement_policy"
              value={NewSupplier.return_replacement_policy}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="Return accepted within 10 days of delivery"
            />
          </div>
        </div>

        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="average_delivery_time">Average Delivery Time (Days)</label>
            <input
              id="average_delivery_time"
              value={NewSupplier.average_delivery_time}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="Eg: 1-3 days or 4-7 days"
            />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="contract_references">Contract References</label>
            <input
              id="contract_references"
              value={NewSupplier.contract_references}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="Contract References"
            />
          </div>
        </div>

        <nav className="createNewSupplier-subtit">Compliance & Risk Management</nav>
        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="certifications">Certifications</label>
            <input
              id="certifications"
              value={NewSupplier.certifications}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="Certifications (ISO 9001)"
            />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="risk_notes">Risk Notes/Flags</label>
            <input
              id="risk_notes"
              value={NewSupplier.risk_notes}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="Enter risk details or observations"
            />
          </div>
        </div>

        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="compliance_status">Compliance Status</label>
            <input
              id="compliance_status"
              value={NewSupplier.compliance_status}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="Compliance Status"
            />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="last_risk_assessment_date">Last Risk Assessment Date</label>
            <input
              id="last_risk_assessment_date"
              value={NewSupplier.last_risk_assessment_date}
              onChange={handleNewSupplierDataChange}
              type="date"
            />
          </div>
        </div>

        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="insurance_documents">Insurance Documents/Info</label>
            <input
              id="insurance_documents"
              value={NewSupplier.insurance_documents}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="PDF or Document Link"
            />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="mitigation_plans">Mitigation Plans</label>
            <input
              id="mitigation_plans"
              value={NewSupplier.mitigation_plans}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="Mitigation Plans"
            />
          </div>
        </div>

        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="risk_ratings">Risk Ratings</label>
            <input
              id="risk_ratings"
              value={NewSupplier.risk_ratings}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="Enter risk ratings"
            />
          </div>
        </div>

        <nav className="createNewSupplier-subtit">Performance & Evaluation</nav>
        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="on_time_delivery_rate">On-Time Delivery Rate (%)</label>
            <input
              id="on_time_delivery_rate"
              value={NewSupplier.on_time_delivery_rate}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="Eg: 98.5%"
            />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="quality_ratings">Quality Ratings (1-5 stars / % Score)</label>
            <input
              id="quality_ratings"
              value={NewSupplier.quality_ratings}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="Eg: 4.2/5 stars / 92%"
            />
          </div>
        </div>

        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="defect_return_rate">Defect/Return Rate (%)</label>
            <input
              id="defect_return_rate"
              value={NewSupplier.defect_return_rate}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="Eg: 1.2%"
            />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="last_evaluation_date">Last Evaluation Date</label>
            <input
              id="last_evaluation_date"
              value={NewSupplier.last_evaluation_date}
              onChange={handleNewSupplierDataChange}
              type="date"
            />
          </div>
        </div>

        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="contract_breaches">Contract Breaches (Y/N)</label>
            <input
              id="contract_breaches"
              value={NewSupplier.contract_breaches}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="Eg: N (No breaches) or Y (2025-09-28)"
            />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="improvement_plans">Improvement Plans</label>
            <input
              id="improvement_plans"
              value={NewSupplier.improvement_plans}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="Eg: Action: review packaging to reduce damage"
            />
          </div>
        </div>

        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="complaints_registered">Complaints Registered</label>
            <input
              id="complaints_registered"
              value={NewSupplier.complaints_registered}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="Enter Total Complaints"
            />
          </div>
        </div>

        <nav className="createNewSupplier-subtit">Relationship & Communication History</nav>
        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="external_key_contact">External Key Contact</label>
            <input
              id="external_key_contact"
              value={NewSupplier.external_key_contact}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="Primary contact name/Title"
            />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="dispute_resolutions">Dispute Resolutions</label>
            <input
              id="dispute_resolutions"
              value={NewSupplier.dispute_resolutions}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="Attach documents to past disputes and resolutions"
            />
          </div>
        </div>

        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="interaction_logs">Interaction Logs (Link to CRM logs)</label>
            <input
              id="interaction_logs"
              value={NewSupplier.interaction_logs}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="Attach or link record of calls/emails"
            />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="feedback_surveys">Feedback/Surveys</label>
            <input
              id="feedback_surveys"
              value={NewSupplier.feedback_surveys}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="Attach supplier performance survey results"
            />
          </div>
        </div>

        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="visit_history">Visit History/Meeting Notes</label>
            <input
              id="visit_history"
              value={NewSupplier.visit_history}
              onChange={handleNewSupplierDataChange}
              type="text"
              placeholder="Discuss last meeting date, discussion summary"
            />
          </div>
        </div>

        <p className="createNewSupplier-editdate">
          Last edited: <span>{lastEditDate}</span> | By Admin
        </p>

        <div className="createNewSupplier-submit-container">
          <nav onClick={handleCreateEditSupplierReset}>Discard</nav>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}