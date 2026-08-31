// // // import React, { useEffect, useState } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import "./createNewInvoice.css";
// // // import InvoiceTagsSelector from "./invoiceCheckBoxInput";
// // // import InvoiceComment from "./invoiceComment";
// // // import InvoiceHistory from "./invoiceHistory";
// // // import InvoiceAttachment from "./invoiceAttachment";
// // // import { toast } from "react-toastify";

// // // export default function CreateNewInvoiceReturn() {
// // //   const prevpg = useNavigate();
// // //   const [invoiceStatus, setInvoiceStatus] = useState("");

// // //   const [ApiInvoice, setApiInvoice] = useState({});
// // //   const [invoiceListData, setInvoiceListData] = useState([]);
// // //   const [salesOederData, setSalesOederData] = useState([]);

// // //   const invoiceFromAPI = {
// // //     invoiceListData: [
// // //       {
// // //         product_name: "T-shirt",
// // //         product_id: "CT101",
// // //         quantity: "17",
// // //         umo: "PCS",
// // //         unit_price: "120.0",
// // //         tax: "18",
// // //         discount: "20",
// // //         total: "10009",
// // //       },
// // //       {
// // //         product_name: "T-shirt",
// // //         product_id: "CT101",
// // //         quantity: "17",
// // //         umo: "PCS",
// // //         unit_price: "120.0",
// // //         tax: "18",
// // //         discount: "20",
// // //         total: "10009",
// // //       },
// // //       {
// // //         product_name: "T-shirt",
// // //         product_id: "CT101",
// // //         quantity: "17",
// // //         umo: "PCS",
// // //         unit_price: "120.0",
// // //         tax: "18",
// // //         discount: "20",
// // //         total: "10009",
// // //       },
// // //     ],
// // //     salesOederData: [
// // //       {
// // //         sales_order_ref: "SO-1001",
// // //         due_date: "2025-07-01",
// // //         payment_terms: "Net 30",
// // //         trems_and_conditions: "Payment within 30 days.",
// // //         custoner_name: "Acme Corp",
// // //         customer_id: "CUST-001",
// // //         billing_address: "123 Market St, New York, NY 10001",
// // //         shipping_address: "456 Industrial Rd, Brooklyn, NY 11222",
// // //         email_id: "orders@acmecorp.com",
// // //         phone_number: "+1-212-555-1010",
// // //         payment_method: "Credit Card",
// // //         currency: "IND",
// // //       },
// // //       {
// // //         sales_order_ref: "SO-1002",
// // //         due_date: "2025-07-05",
// // //         payment_terms: "Net 15",
// // //         trems_and_conditions: "No returns after 15 days.",
// // //         custoner_name: "Beta Industries",
// // //         customer_id: "CUST-002",
// // //         billing_address: "22 Park Ave, San Francisco, CA 94110",
// // //         shipping_address: "88 Bay St, Oakland, CA 94607",
// // //         email_id: "sales@betaind.com",
// // //         phone_number: "+1-415-555-2020",
// // //         payment_method: "Credit Card",
// // //         currency: "IND",
// // //       },
// // //       {
// // //         sales_order_ref: "SO-1003",
// // //         due_date: "2025-06-30",
// // //         payment_terms: "Prepaid",
// // //         trems_and_conditions: "Prepayment required before dispatch.",
// // //         custoner_name: "Gamma Ltd",
// // //         customer_id: "CUST-003",
// // //         billing_address: "77 King St, Toronto, ON M5V 1M9",
// // //         shipping_address: "12 Queen St, Toronto, ON M5H 2N2",
// // //         email_id: "contact@gammaltd.ca",
// // //         phone_number: "+1-647-555-3030",
// // //         payment_method: "Credit Card",
// // //         currency: "IND",
// // //       },
// // //       {
// // //         sales_order_ref: "SO-1004",
// // //         due_date: "2025-07-10",
// // //         payment_terms: "Net 45",
// // //         trems_and_conditions: "Late fee of 2% after 45 days.",
// // //         custoner_name: "Delta Traders",
// // //         customer_id: "CUST-004",
// // //         billing_address: "101 Broadway, Los Angeles, CA 90012",
// // //         shipping_address: "202 Sunset Blvd, LA, CA 90026",
// // //         email_id: "accounts@deltatraders.com",
// // //         phone_number: "+1-323-555-4040",
// // //         payment_method: "Credit Card",
// // //         currency: "IND",
// // //       },
// // //       {
// // //         sales_order_ref: "SO-1005",
// // //         due_date: "2025-07-03",
// // //         payment_terms: "COD",
// // //         trems_and_conditions: "Cash on Delivery only.",
// // //         custoner_name: "Epsilon Enterprises",
// // //         customer_id: "CUST-005",
// // //         billing_address: "14 Main St, Austin, TX 78701",
// // //         shipping_address: "33 Elm St, Austin, TX 78702",
// // //         email_id: "info@epsilonent.com",
// // //         phone_number: "+1-512-555-5050",
// // //         payment_method: "Credit Card",
// // //         currency: "IND",
// // //       },
// // //       {
// // //         sales_order_ref: "SO-1006",
// // //         due_date: "2025-07-15",
// // //         payment_terms: "Net 60",
// // //         trems_and_conditions: "No penalty until 60 days.",
// // //         custoner_name: "Zeta Global",
// // //         customer_id: "CUST-006",
// // //         billing_address: "999 Broadway, Seattle, WA 98101",
// // //         shipping_address: "1111 1st Ave, Seattle, WA 98104",
// // //         email_id: "support@zetaglobal.com",
// // //         phone_number: "+1-206-555-6060",
// // //         payment_method: "Credit Card",
// // //         currency: "IND",
// // //       },
// // //       {
// // //         sales_order_ref: "SO-1007",
// // //         due_date: "2025-07-08",
// // //         payment_terms: "Net 20",
// // //         trems_and_conditions: "20 days to settle payment.",
// // //         custoner_name: "Theta Systems",
// // //         customer_id: "CUST-007",
// // //         billing_address: "85 Tech Rd, Denver, CO 80202",
// // //         shipping_address: "90 Data Ln, Boulder, CO 80301",
// // //         email_id: "billing@thetasystems.io",
// // //         phone_number: "+1-303-555-7070",
// // //         payment_method: "Credit Card",
// // //         currency: "IND",
// // //       },
// // //       {
// // //         sales_order_ref: "SO-1008",
// // //         due_date: "2025-06-28",
// // //         payment_terms: "Advance 50%",
// // //         trems_and_conditions: "50% advance, 50% on delivery.",
// // //         custoner_name: "Iota Innovations",
// // //         customer_id: "CUST-008",
// // //         billing_address: "18 Sky Dr, Miami, FL 33101",
// // //         shipping_address: "27 Coral Blvd, Miami, FL 33132",
// // //         email_id: "orders@iotainnov.com",
// // //         phone_number: "+1-786-555-8080",
// // //         payment_method: "Credit Card",
// // //         currency: "IND",
// // //       },
// // //       {
// // //         sales_order_ref: "SO-1009",
// // //         due_date: "2025-07-12",
// // //         payment_terms: "Net 10",
// // //         trems_and_conditions: "Strict 10-day policy.",
// // //         custoner_name: "Kappa Solutions",
// // //         customer_id: "CUST-009",
// // //         billing_address: "350 Innovation Way, Boston, MA 02115",
// // //         shipping_address: "99 Science Park, Boston, MA 02118",
// // //         email_id: "kappa@solutions.com",
// // //         phone_number: "+1-617-555-9090",
// // //         payment_method: "Credit Card",
// // //         currency: "IND",
// // //       },
// // //       {
// // //         sales_order_ref: "SO-1010",
// // //         due_date: "2025-07-20",
// // //         payment_terms: "Net 30",
// // //         trems_and_conditions: "Standard 30-day billing.",
// // //         custoner_name: "Lambda Tech",
// // //         customer_id: "CUST-010",
// // //         billing_address: "42 Orbit St, Chicago, IL 60601",
// // //         shipping_address: "73 Galaxy Ave, Chicago, IL 60611",
// // //         email_id: "contact@lambdatech.org",
// // //         phone_number: "+1-312-555-0001",
// // //         payment_method: "Credit Card",
// // //         currency: "IND",
// // //       },
// // //     ],
// // //   };
// // //   const [detail, setDetail] = useState({
// // //     comment: true,
// // //     history: false,
// // //     attachment: false,
// // //   });

// // //   const [invoiceInput, setInvoiceInput] = useState({
// // //     invoice_id: "",
// // //     sales_order_ref: "",
// // //     invoice_date: "",
// // //     due_date: "",
// // //     invoice_status: "",
// // //     payment_terms: "",
// // //     customer_ref_no: "",
// // //     invoice_tag: [],
// // //     trems_and_conditions: "",
// // //     custoner_name: "",
// // //     customer_id: "",
// // //     email_id: "",
// // //     phone_number: "",
// // //     contact_person: "",
// // //     payment_method: "",
// // //     currency: "",
// // //     payment_ref_number: "",
// // //     transaction_date: "",
// // //     payment_status: "",
// // //     shipping_charges: "",
// // //     global_discount: "",
// // //     amount_paid: "",
// // //   });

// // //   const handleInvoiceInputChanges = (e) => {
// // //     setInvoiceInput((prev) => {
// // //       return { ...prev, [e.target.id]: e.target.value };
// // //     });
// // //   };

// // //   useEffect(() => {
// // //     setApiInvoice(invoiceFromAPI);
// // //   }, []);
// // //   useEffect(() => {
// // //     if (Object.keys(ApiInvoice).length > 0) {
// // //       setInvoiceListData(ApiInvoice.invoiceListData);
// // //       setSalesOederData(ApiInvoice.salesOederData);
// // //     }
// // //   }, [ApiInvoice]);

// // //   //button status
// // //   const [InvoiceBtn, setInvoiceBtn] = useState({
// // //     buttonAcs: true,
// // //     invoice_return: true,
// // //     cancel_invoice: true,
// // //     save_draft: false,
// // //     send_invoice: false,
// // //     paid: true,
// // //     pdf: true,
// // //     mail: true,
// // //   });
// // //   useEffect(() => {
// // //     const selected = invoiceInput.sales_order_ref;
// // //     if (selected) {
// // //       const salesRef = salesOederData.find(
// // //         (ele) => ele.sales_order_ref === selected
// // //       );
// // //       if (salesRef) {
// // //         setInvoiceInput((prev) => ({
// // //           ...prev,
// // //           sales_order_ref: salesRef.sales_order_ref,
// // //           due_date: salesRef.due_date,
// // //           payment_terms: salesRef.payment_terms,
// // //           trems_and_conditions: salesRef.trems_and_conditions,
// // //           custoner_name: salesRef.custoner_name,
// // //           customer_id: salesRef.customer_id,
// // //           billing_address: salesRef.billing_address,
// // //           shipping_address: salesRef.shipping_address,
// // //           email_id: salesRef.email_id,
// // //           phone_number: salesRef.phone_number,
// // //           payment_method: salesRef.payment_method,
// // //           currency: salesRef.currency,
// // //         }));
// // //       }
// // //     }
// // //   }, [invoiceInput.sales_order_ref, salesOederData]);
// // //   useEffect(() => {
// // //     if (invoiceStatus === "") {
// // //       setInvoiceBtn((prev) => ({
// // //         ...prev,
// // //         buttonAcs: false,
// // //         cancel_invoice: true,
// // //         save_draft: false,
// // //         send_invoice: false,
// // //         paid: true,
// // //         pdf: true,
// // //         mail: true,
// // //       }));
// // //       return;
// // //     }

// // //     switch (invoiceStatus) {
// // //       case "Draft":
// // //         setInvoiceBtn((prev) => ({
// // //           ...prev,
// // //           buttonAcs: false,
// // //           cancel_invoice: true,
// // //           save_draft: false,
// // //           send_invoice: false,
// // //           paid: true,
// // //           pdf: false,
// // //           mail: false,
// // //         }));
// // //         break;
// // //       case "Send":
// // //         setInvoiceBtn((prev) => ({
// // //           ...prev,
// // //           buttonAcs: true,
// // //           invoice_return: false,
// // //           cancel_invoice: false,
// // //           save_draft: true,
// // //           send_invoice: true,
// // //           paid: false,
// // //           pdf: false,
// // //           mail: false,
// // //         }));
// // //         break;
// // //       case "Paid":
// // //         setInvoiceBtn((prev) => ({
// // //           ...prev,
// // //           cancel_invoice: false,
// // //           invoice_return: false,
// // //           save_draft: true,
// // //           send_invoice: true,
// // //           paid: true,
// // //           pdf: false,
// // //           mail: false,
// // //         }));
// // //         break;
// // //       case "Cancelled":
// // //         setInvoiceBtn((prev) => ({
// // //           ...prev,
// // //           invoice_return: true,
// // //           cancel_invoice: true,
// // //           save_draft: true,
// // //           send_invoice: true,
// // //           paid: true,
// // //           pdf: false,
// // //           mail: false,
// // //         }));
// // //         break;

// // //       default:
// // //         setInvoiceBtn((prev) => ({ ...prev, buttonAcss: true }));
// // //     }
// // //   }, [invoiceStatus]);

// // //   const handleSaveDraftState = (e) => {
// // //     e.preventDefault();
// // //     setInvoiceStatus("Draft");
// // //     toast.success("Invoice Item in Save Draft State");
// // //   };
// // //   const handleSendInvoiceState = (e) => {
// // //     e.preventDefault();
// // //     setInvoiceStatus("Send");
// // //     toast.success("Invoice Item in Send State");
// // //   };
// // //   const handlePaidState = (e) => {
// // //     e.preventDefault();
// // //     setInvoiceStatus("Paid");
// // //     toast.success("Invoice Item in Paid State");
// // //   };
// // //   const handleCancelledState = (e) => {
// // //     e.preventDefault();
// // //     setInvoiceStatus("Cancelled");
// // //     toast.success("Invoice Item in Cancelled State");
// // //   };
// // //   console.log(invoiceInput);
// // //   return (
// // //     <>
// // //       <div className="createNewInvoice-container">
// // //         <form onSubmit={handleSendInvoiceState}>
// // //           <div className="createNewInvoice-head">
// // //             <nav>
// // //               <p>{invoiceStatus !== "" ? "Invoice Return" : "New Invoice Return"} </p>
// // //               {invoiceStatus !== "" && (
// // //                 <h3
// // //                   className={
// // //                     invoiceStatus === "Draft"
// // //                       ? "createNewInvoice-Status-draft"
// // //                       : invoiceStatus === "Send"
// // //                       ? "createNewInvoice-Status-Send"
// // //                       : invoiceStatus === "Paid"
// // //                       ? "createNewInvoice-Status-Paid"
// // //                       : invoiceStatus === "Cancelled"
// // //                       ? "createNewInvoice-Status-Cancelled"
// // //                       : "createNewInvoice-Status-empty"
// // //                   }
// // //                 >
// // //                   Status: {invoiceStatus}
// // //                 </h3>
// // //               )}
// // //             </nav>

// // //             <div>
// // //               <button
// // //                 className={
// // //                   invoiceStatus === "Send" || invoiceStatus === "Paid"
// // //                     ? "createNewInvoice-active-btn"
// // //                     : "createNewInvoice-inactive-btn"
// // //                 }
// // //                 disabled={InvoiceBtn.invoice_return}
// // //               >
// // //                 Invoice Return
// // //               </button>
// // //               <nav
// // //                 className="createNewInvoice-close"
// // //                 onClick={(e) => {
// // //                   e.preventDefault();
// // //                   prevpg(-1);
// // //                 }}
// // //               >
// // //                 <svg
// // //                   className="createNewInvoice-circle-x-logo"
// // //                   xmlns="http://www.w3.org/2000/svg"
// // //                   viewBox="0 0 512 512"
// // //                 >
// // //                   <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
// // //                 </svg>
// // //                 <p>Close</p>
// // //               </nav>
// // //             </div>
// // //           </div>
// // //           <div className="createNewInvoice-input-container">
// // //             <div className="createNewInvoice-input-box">
// // //               <label htmlFor="invoice_id">Invoice ID {`(Auto Generate)`}</label>
// // //               <input
// // //                 id="invoice_id"
// // //                 type="text"
// // //                 placeholder="Auto Generate"
// // //                 value={invoiceInput.invoice_id}
// // //                 onChange={handleInvoiceInputChanges}
// // //                 disabled
// // //               />
// // //             </div>
// // //             <div className="createNewInvoice-input-box">
// // //               <label htmlFor="sales_order_ref">
// // //                 Sales Order Reference<sup>*</sup>
// // //               </label>
// // //               <select
// // //                 id="sales_order_ref"
// // //                 value={invoiceInput.sales_order_ref}
// // //                 onChange={handleInvoiceInputChanges}
// // //                 required
// // //                 disabled={InvoiceBtn.buttonAcs}
// // //               >
// // //                 <option value="">Select Order Reference</option>
// // //                 {salesOederData.map((ele, ind) => (
// // //                   <option key={ind} value={ele.sales_order_ref}>
// // //                     {ele.sales_order_ref}
// // //                   </option>
// // //                 ))}
// // //               </select>
// // //             </div>
// // //           </div>
// // //           <div className="createNewInvoice-input-container">
// // //             <div className="createNewInvoice-input-box">
// // //               <label htmlFor="invoice_date">
// // //                 Invoice Date<sup>*</sup>
// // //               </label>
// // //               <input
// // //                 id="invoice_date"
// // //                 type="date"
// // //                 placeholder="Select Date"
// // //                 value={invoiceInput.invoice_date}
// // //                 onChange={handleInvoiceInputChanges}
// // //                 required
// // //                 disabled={InvoiceBtn.buttonAcs}
// // //               />
// // //             </div>
// // //            <div className="createNewInvoice-input-box">
// // //               <label htmlFor="customer_ref_no">Customer Ref.No</label>
// // //               <input
// // //                 id="customer_ref_no"
// // //                 type="text"
// // //                 placeholder="Enter customer reference number"
// // //                 value={invoiceInput.customer_ref_no}
// // //                 onChange={handleInvoiceInputChanges}
// // //                 disabled={InvoiceBtn.buttonAcs}
// // //               />
// // //             </div>
// // //           </div>
// // //           <nav className="createNewInvoice-subtit">Customer Information</nav>
// // //           <div className="createNewInvoice-input-container">
// // //             <div className="createNewInvoice-input-box">
// // //               <label htmlFor="custoner_name">
// // //                 Customer Name<sup>*</sup>
// // //               </label>
// // //               <select
// // //                 id="custoner_name"
// // //                 required
// // //                 value={invoiceInput.custoner_name}
// // //                 onChange={handleInvoiceInputChanges}
// // //                 disabled={InvoiceBtn.buttonAcs}
// // //               >
// // //                 <option value="">Select Customer </option>
// // //                 {salesOederData.map((ele, ind) => (
// // //                   <option key={ind} value={ele.custoner_name}>
// // //                     {ele.custoner_name}
// // //                   </option>
// // //                 ))}
// // //               </select>
// // //             </div>
// // //             <div className="createNewInvoice-input-box">
// // //               <label htmlFor="customer_id">
// // //                 Customer ID {`(Auto Generate)`}
// // //               </label>
// // //               <input
// // //                 id="customer_id"
// // //                 type="text"
// // //                 placeholder="Auto Generate"
// // //                 disabled
// // //                 value={invoiceInput.customer_id}
// // //                 onChange={handleInvoiceInputChanges}
// // //               />
// // //             </div>
// // //           </div>
// // //           <div className="createNewInvoice-input-container">
// // //             <div className="createNewInvoice-input-box">
// // //               <label htmlFor="email_id">
// // //                 Email ID<sup>*</sup>
// // //               </label>
// // //               <input
// // //                 id="email_id"
// // //                 type="email"
// // //                 placeholder="Enter Email ID"
// // //                 value={invoiceInput.email_id}
// // //                 onChange={handleInvoiceInputChanges}
// // //                 required
// // //                 disabled={InvoiceBtn.buttonAcs}
// // //               />
// // //             </div>
// // //             <div className="createNewInvoice-input-box">
// // //               <label htmlFor="phone_number">
// // //                 Phone Number<sup>*</sup>
// // //               </label>
// // //               <input
// // //                 id="phone_number"
// // //                 type="number"
// // //                 placeholder="Enter Phone Number"
// // //                 value={invoiceInput.phone_number}
// // //                 onChange={handleInvoiceInputChanges}
// // //                 required
// // //                 disabled={InvoiceBtn.buttonAcs}
// // //               />
// // //             </div>
// // //           </div>
// // //           <div className="createNewInvoice-input-container">
// // //             <div className="createNewInvoice-input-box">
// // //               <label htmlFor="contact_person">Contact Person</label>
// // //               <input
// // //                 id="contact_person"
// // //                 type="text"
// // //                 placeholder="Enter contact person name "
// // //                 value={invoiceInput.contact_person}
// // //                 onChange={handleInvoiceInputChanges}
// // //                 disabled={InvoiceBtn.buttonAcs}
// // //               />
// // //             </div>
// // //           </div>
// // //           <nav className="createNewInvoice-subtit">Line Items</nav>
// // //           <div className="createNewInvoice-table-container">
// // //             <table>
// // //               <thead className="createNewInvoice-table-head">
// // //                 <tr>
// // //                   <th>#</th>
// // //                   <th>
// // //                     <pre>Product name</pre>
// // //                   </th>
// // //                   <th>
// // //                     <pre>Product ID</pre>
// // //                   </th>
// // //                   <th>Quantity</th>
// // //                   <th>UOM</th>
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
// // //                 </tr>
// // //               </thead>
// // //               <tbody className="createNewInvoice-table-body">
// // //                 {invoiceListData.length > 0 ? (
// // //                   invoiceListData.map((ele, ind) => (
// // //                     <tr key={ind}>
// // //                       <td>{ind + 1}</td>
// // //                       <td>{ele.product_name}</td>
// // //                       <td>{ele.product_id}</td>
// // //                       <td>{ele.quantity}</td>
// // //                       <td>{ele.umo}</td>
// // //                       <td>{ele.unit_price}</td>
// // //                       <td>{ele.tax}</td>
// // //                       <td>{ele.discount}</td>
// // //                       <td>{ele.total}</td>
// // //                     </tr>
// // //                   ))
// // //                 ) : (
// // //                   <tr>
// // //                     <td></td>
// // //                     <td>
// // //                       <pre>No Data Found</pre>
// // //                     </td>
// // //                   </tr>
// // //                 )}
// // //               </tbody>
// // //             </table>
// // //           </div>
// // //           <nav className="createNewInvoice-subtit">Order Summary</nav>
// // //           <div className="createNewInvoice-totals-container">
// // //             <nav>
// // //               <h5>Subtotal</h5>
// // //               <p> 1223</p>
// // //             </nav>
// // //             <nav>
// // //               <h5>Global Discount {"(%)"}</h5>
// // //               <input
// // //                 type="number"
// // //                 value={invoiceInput.global_discount}
// // //                 onChange={(e) =>
// // //                   setInvoiceStatus((prev) => ({
// // //                     ...prev,
// // //                     global_discount: parseFloat(e.target.value) || 0,
// // //                   }))
// // //                 }
// // //                 disabled={InvoiceBtn.buttonAcs}
// // //               />
// // //             </nav>
// // //             <nav>
// // //               <h5>Tax Summary</h5>
// // //               <p> 254</p>
// // //             </nav>
// // //             <nav>
// // //               <h5>
// // //                 Shipping Charges{""}
// // //                 {invoiceInput.currency === "IND" && <span>{`(₹)`}</span>}
// // //                 {invoiceInput.currency === "USD" && <span>{`($)`}</span>}
// // //                 {invoiceInput.currency === "GBP" && <span>{`(£)`}</span>}
// // //                 {invoiceInput.currency === "SGD" && <span>{`(S$)`}</span>}
// // //                 {invoiceInput.currency === "EUR" && <span>{`(€)`}</span>}
// // //               </h5>
// // //               <input
// // //                 type="number"
// // //                 value={invoiceInput.shipping_charges}
// // //                 onChange={(e) =>
// // //                   setInvoiceInput((prev) => ({
// // //                     ...prev,
// // //                     shipping_charges: parseFloat(e.target.value) || 0,
// // //                   }))
// // //                 }
// // //                 disabled={InvoiceBtn.buttonAcs}
// // //               />
// // //             </nav>
// // //             <nav>
// // //               <h5>Rounding Adjustment</h5>
// // //               <p>025</p>
// // //             </nav>
// // //             <nav>
// // //               <h5>
// // //                 Amount Paid{" "}
// // //                 {invoiceInput.currency === "IND" && <span>{`(₹)`}</span>}
// // //                 {invoiceInput.currency === "USD" && <span>{`($)`}</span>}
// // //                 {invoiceInput.currency === "GBP" && <span>{`(£)`}</span>}
// // //                 {invoiceInput.currency === "SGD" && <span>{`(S$)`}</span>}
// // //                 {invoiceInput.currency === "EUR" && <span>{`(€)`}</span>}
// // //               </h5>
// // //               <input
// // //                 type="number"
// // //                 value={invoiceInput.amount_paid}
// // //                 onChange={(e) =>
// // //                   setInvoiceInput((prev) => ({
// // //                     ...prev,
// // //                     amount_paid: parseFloat(e.target.value) || 0,
// // //                   }))
// // //                 }
// // //                 disabled={InvoiceBtn.buttonAcs}
// // //               />
// // //             </nav>
// // //             <nav className="createNewInvoice-totals-container-bg">
// // //               <h5>Grand Total</h5>
// // //               <p>
// // //                 {invoiceInput.currency === "IND" && <span>₹</span>}
// // //                 {invoiceInput.currency === "USD" && <span>$</span>}
// // //                 {invoiceInput.currency === "GBP" && <span>£</span>}
// // //                 {invoiceInput.currency === "SGD" && <span>S$</span>}
// // //                 {invoiceInput.currency === "EUR" && <span>€</span>}
// // //                 555
// // //               </p>
// // //             </nav>
// // //             <nav className="createNewInvoice-totals-container-bg">
// // //               <h5>Balance Due</h5>
// // //               <p>
// // //                 {invoiceInput.currency === "IND" && <span>₹</span>}
// // //                 {invoiceInput.currency === "USD" && <span>$</span>}
// // //                 {invoiceInput.currency === "GBP" && <span>£</span>}
// // //                 {invoiceInput.currency === "SGD" && <span>S$</span>}
// // //                 {invoiceInput.currency === "EUR" && <span>€</span>}
// // //                 555
// // //               </p>
// // //             </nav>
// // //           </div>
// // //           <div className="createNewInvoice-hub-container">
// // //             <div className="createNewInvoice-hub-head">
// // //               <p
// // //                 className={
// // //                   detail.comment
// // //                     ? "createNewInvoice-hub-head-bg-black"
// // //                     : "createNewInvoice-hub-head-tit"
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
// // //                     ? "createNewInvoice-hub-head-bg-black"
// // //                     : "createNewInvoice-hub-head-tit"
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
// // //                     ? "createNewInvoice-hub-head-bg-black"
// // //                     : "createNewInvoice-hub-head-tit"
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
// // //             <div className="createNewInvoice-hub-body">
// // //               {detail.comment && <InvoiceComment />}
// // //               {detail.history && <InvoiceHistory />}
// // //               {detail.attachment && <InvoiceAttachment />}
// // //             </div>
// // //           </div>
// // //           <div className="createNewInvoice-btn-container">
// // //             <button
// // //               className={
// // //                 invoiceStatus === "Send" || invoiceStatus === "Paid"
// // //                   ? "createNewInvoice-order-active-btn"
// // //                   : "createNewInvoice-inactive-btn"
// // //               }
// // //               onClick={handleCancelledState}
// // //               disabled={InvoiceBtn.cancel_invoice}
// // //             >
// // //               {invoiceStatus === "Cancelled" ? "Cancelled" : "Cancel Invoice"}
// // //             </button>
// // //             <nav>
// // //               <button
// // //                 className="createNewInvoice-cancel-btn"
// // //                 onClick={(e) => {
// // //                   e.preventDefault();
// // //                   prevpg(-1);
// // //                 }}
// // //               >
// // //                 Cancel
// // //               </button>
// // //               <button
// // //                 className={
// // //                   invoiceStatus === "" || invoiceStatus === "Draft"
// // //                     ? "createNewInvoice-active-btn"
// // //                     : "createNewInvoice-completed-btn"
// // //                 }
// // //                 onClick={handleSaveDraftState}
// // //                 disabled={InvoiceBtn.save_draft}
// // //               >
// // //                 Save Draft
// // //               </button>
// // //               <button
// // //                 className={
// // //                   invoiceStatus === "" || invoiceStatus === "Draft"
// // //                     ? "createNewInvoice-active-btn"
// // //                     : "createNewInvoice-completed-btn"
// // //                 }
// // //                 disabled={InvoiceBtn.send_invoice}
// // //               >
// // //                 {invoiceStatus === "" || invoiceStatus === "Draft"
// // //                   ? "Submit"
// // //                   : "Submitted"}
// // //               </button>
// // //               {/* <button
// // //                 className={
// // //                   invoiceStatus === "Send"
// // //                     ? "createNewInvoice-active-btn"
// // //                     : invoiceStatus === "" || invoiceStatus === "Draft"
// // //                     ? "createNewInvoice-inactive-btn"
// // //                     : "createNewInvoice-completed-btn"
// // //                 }
// // //                 onClick={handlePaidState}
// // //                 disabled={InvoiceBtn.paid}
// // //               >
// // //                 Mark as Paid
// // //               </button> */}
// // //               <svg
// // //                 className={
// // //                   invoiceStatus !== ""
// // //                     ? "createNewInvoice-pdf-mail-activelogo"
// // //                     : "createNewInvoice-pdf-mail-futurelogo"
// // //                 }
// // //                 disabled={InvoiceBtn.pdf}
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
// // //                   invoiceStatus !== ""
// // //                     ? "createNewInvoice-pdf-mail-activelogo"
// // //                     : "createNewInvoice-pdf-mail-futurelogo"
// // //                 }
// // //                 disabled={InvoiceBtn.mail}
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
// // import React, { useEffect, useState } from "react";
// // import "./createNewInvoice.css";
// // import { toast } from "react-toastify";
// // import InvoiceComment from "./invoiceComment";
// // import InvoiceHistory from "./invoiceHistory";
// // import InvoiceAttachment from "./invoiceAttachment";
// // import invoiceReturnApiProvider from "../../../network/invoiceReturn-api-provider";
// // import ApiClient from "../../../network/api-client";

// // export default function CreateNewInvoiceReturn({ setCurrentPage, editInvoiceReturnData = {}, isEdit = false }) {
// //   const isView = isEdit && editInvoiceReturnData?.status !== "Draft";

// //   // ── IDs ────────────────────────────────────────────────────────────────────
// //   const returnId = editInvoiceReturnData?.id || null;

// //   // ── Status ─────────────────────────────────────────────────────────────────
// //   const [returnStatus, setReturnStatus] = useState(editInvoiceReturnData?.status || "");

// //   // ── Invoice list (for dropdown when creating) ──────────────────────────────
// //   const [invoiceList, setInvoiceList] = useState([]);

// //   // ── Selected invoice details (fetched after selection) ────────────────────
// //   const [selectedInvoice, setSelectedInvoice] = useState(
// //     isEdit ? editInvoiceReturnData?.invoice : null
// //   );

// //   // ── Line items (editable) ──────────────────────────────────────────────────
// //   const [lineItems, setLineItems] = useState(
// //     isEdit
// //       ? (editInvoiceReturnData?.items || []).map((item) => ({
// //           id: item.id,
// //           invoice_item: item.invoice_item,
// //           product_name: item.product_name,
// //           uom: item.uom?.name || "",
// //           invoiced_qty: item.invoiced_qty,
// //           returned_qty_cus: item.returned_qty_cus,
// //           available_serials: item.available_serials || [],
// //           selected_serials: (item.serial_numbers || []).map((s) => s.serial_no),
// //           return_reason: item.return_reason || "",
// //           unit_price: item.unit_price,
// //           tax_rate: item.tax_rate,
// //           discount_rate: item.discount_rate,
// //           total: item.total,
// //         }))
// //       : []
// //   );

// //   // ── Form header fields ─────────────────────────────────────────────────────
// //   const [formInput, setFormInput] = useState({
// //     invoice: isEdit ? (editInvoiceReturnData?.invoice?.id || "") : "",
// //     invoice_return_date: editInvoiceReturnData?.invoice_return_date || "",
// //     customer_ref_no: editInvoiceReturnData?.customer_ref_no || "",
// //   });

// //   // ── Totals ─────────────────────────────────────────────────────────────────
// //   const returnSubtotal = editInvoiceReturnData?.return_subtotal ?? "";
// //   const amountToRefund = editInvoiceReturnData?.amount_to_refund ?? "";

// //   // ── Tab ────────────────────────────────────────────────────────────────────
// //   const [detail, setDetail] = useState({ comment: true, history: false, attachment: false });

// //   // ── Loading ────────────────────────────────────────────────────────────────
// //   const [submitting, setSubmitting] = useState(false);

// //   // ── Fetch invoice list (only needed when creating) ─────────────────────────
// //   useEffect(() => {
// //     if (!isEdit) {
// //       ApiClient.get("/crm/invoices/", { params: { page: 1, limit: 100 } })
// //         .then((res) => {
// //           if (res.status === 200) {
// //             const data = res.data?.data?.data || [];
// //             setInvoiceList(data);
// //           }
// //         })
// //         .catch(() => toast.error("Failed to load invoices"));
// //     }
// //   }, [isEdit]);

// //   // ── When invoice selected from dropdown, populate line items ───────────────
// //   const handleInvoiceSelect = async (invoiceId) => {
// //     setFormInput((p) => ({ ...p, invoice: invoiceId }));
// //     if (!invoiceId) {
// //       setSelectedInvoice(null);
// //       setLineItems([]);
// //       return;
// //     }
// //     try {
// //       const res = await ApiClient.get(`/crm/invoices/${invoiceId}/`);
// //       if (res.status === 200) {
// //         const inv = res.data?.data || res.data;
// //         setSelectedInvoice(inv);
// //         // Pre-populate line items from invoice items
// //         setLineItems(
// //           (inv.items || []).map((item) => ({
// //             id: null,               // no return-item id yet
// //             invoice_item: item.id,
// //             product_name: item.product_name,
// //             uom: item.uom?.name || "",
// //             invoiced_qty: item.quantity,
// //             returned_qty_cus: 0,
// //             available_serials: [],
// //             selected_serials: [],
// //             return_reason: "",
// //             unit_price: item.unit_price,
// //             tax_rate: item.tax_rate,
// //             discount_rate: item.discount_rate,
// //             total: item.total,
// //           }))
// //         );
// //       }
// //     } catch {
// //       toast.error("Failed to load invoice details");
// //     }
// //   };

// //   // ── Line item change helpers ───────────────────────────────────────────────
// //   const handleQtyChange = (index, value) => {
// //     setLineItems((prev) =>
// //       prev.map((item, i) =>
// //         i === index ? { ...item, returned_qty_cus: Number(value) } : item
// //       )
// //     );
// //   };

// //   const handleReasonChange = (index, value) => {
// //     setLineItems((prev) =>
// //       prev.map((item, i) =>
// //         i === index ? { ...item, return_reason: value } : item
// //       )
// //     );
// //   };

// //   const handleSerialToggle = (index, serial) => {
// //     setLineItems((prev) =>
// //       prev.map((item, i) => {
// //         if (i !== index) return item;
// //         const already = item.selected_serials.includes(serial);
// //         return {
// //           ...item,
// //           selected_serials: already
// //             ? item.selected_serials.filter((s) => s !== serial)
// //             : [...item.selected_serials, serial],
// //         };
// //       })
// //     );
// //   };

// //   // ── Build payload ──────────────────────────────────────────────────────────
// //   const buildPayload = (action = null) => {
// //     const payload = {
// //       invoice: Number(formInput.invoice),
// //       invoice_return_date: formInput.invoice_return_date,
// //       customer_ref_no: formInput.customer_ref_no,
// //       items: lineItems
// //         .filter((item) => item.returned_qty_cus > 0)
// //         .map((item) => {
// //           const base = {
// //             invoice_item: item.invoice_item,
// //             returned_qty_cus: item.returned_qty_cus,
// //             return_reason: item.return_reason,
// //           };
// //           if (item.id) base.id = item.id;  // needed for PATCH
// //           if (item.selected_serials.length > 0) {
// //             base.serial_numbers = item.selected_serials.map((s) => ({ serial_no: s }));
// //           }
// //           return base;
// //         }),
// //     };
// //     if (action) payload.status = action === "save_draft" ? "Draft" : "Submitted";
// //     return payload;
// //   };

// //   // ── Save Draft ─────────────────────────────────────────────────────────────
// //   const handleSaveDraft = async (e) => {
// //     e.preventDefault();
// //     setSubmitting(true);
// //     try {
// //       if (isEdit && returnId) {
// //         // PATCH + action
// //         await invoiceReturnApiProvider.updateInvoiceReturn(returnId, buildPayload());
// //         await ApiClient.post(`/crm/invoice-returns/${returnId}/action/`, { action: "save_draft" });
// //         toast.success("Saved as Draft");
// //         setReturnStatus("Draft");
// //       } else {
// //         const res = await invoiceReturnApiProvider.createInvoiceReturn({ ...buildPayload(), status: "Draft" });
// //         if (res) {
// //           toast.success("Invoice Return saved as Draft");
// //           setReturnStatus("Draft");
// //         }
// //       }
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   // ── Submit ─────────────────────────────────────────────────────────────────
// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!formInput.invoice || !formInput.invoice_return_date) {
// //       toast.error("Please fill required fields");
// //       return;
// //     }
// //     if (lineItems.filter((i) => i.returned_qty_cus > 0).length === 0) {
// //       toast.error("Please enter at least one return quantity");
// //       return;
// //     }
// //     setSubmitting(true);
// //     try {
// //       if (isEdit && returnId) {
// //         await invoiceReturnApiProvider.updateInvoiceReturn(returnId, buildPayload());
// //         await ApiClient.post(`/crm/invoice-returns/${returnId}/action/`, { action: "submit" });
// //         toast.success("Invoice Return submitted");
// //         setReturnStatus("Submitted");
// //       } else {
// //         const res = await invoiceReturnApiProvider.createInvoiceReturn({ ...buildPayload(), status: "Draft" });
// //         if (res?.data?.id) {
// //           await ApiClient.post(`/crm/invoice-returns/${res.data.id}/action/`, { action: "submit" });
// //           toast.success("Invoice Return submitted");
// //           setReturnStatus("Submitted");
// //         }
// //       }
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   // ── Cancel Invoice Return ──────────────────────────────────────────────────
// //   const handleCancel = async (e) => {
// //     e.preventDefault();
// //     if (!returnId) return;
// //     setSubmitting(true);
// //     try {
// //       await ApiClient.post(`/crm/invoice-returns/${returnId}/action/`, { action: "cancel" });
// //       toast.success("Invoice Return cancelled");
// //       setReturnStatus("Cancelled");
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   const isLocked = returnStatus === "Submitted" || returnStatus === "Cancelled";
// //   const customerName = selectedInvoice?.customer?.first_name
// //     ? `${selectedInvoice.customer.first_name} ${selectedInvoice.customer.last_name || ""}`.trim()
// //     : isEdit ? (editInvoiceReturnData?.customer?.first_name
// //         ? `${editInvoiceReturnData.customer.first_name} ${editInvoiceReturnData.customer.last_name || ""}`.trim()
// //         : "—") : "—";

// //   return (
// //     <div className="createNewInvoice-container">
// //       <form onSubmit={handleSubmit}>

// //         {/* ── Header ── */}
// //         <div className="createNewInvoice-head">
// //           <nav>
// //             <p>{isEdit ? "Invoice Return" : "New Invoice Return"}</p>
// //             {returnStatus && (
// //               <h3 className={
// //                 returnStatus === "Draft"     ? "createNewInvoice-Status-draft"     :
// //                 returnStatus === "Submitted" ? "createNewInvoice-Status-Send"      :
// //                 returnStatus === "Cancelled" ? "createNewInvoice-Status-Cancelled" :
// //                 "createNewInvoice-Status-empty"
// //               }>
// //                 Status: {returnStatus}
// //               </h3>
// //             )}
// //           </nav>
// //           <div>
// //             <nav
// //               className="createNewInvoice-close"
// //               onClick={(e) => { e.preventDefault(); setCurrentPage("invoiceReturnCRM"); }}
// //             >
// //               <svg className="createNewInvoice-circle-x-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
// //                 <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
// //               </svg>
// //               <p>Close</p>
// //             </nav>
// //           </div>
// //         </div>

// //         {/* ── Basic Info ── */}
// //         <div className="createNewInvoice-input-container">
// //           <div className="createNewInvoice-input-box">
// //             <label htmlFor="invoice_return_id">Return ID (Auto Generate)</label>
// //             <input
// //               id="invoice_return_id"
// //               type="text"
// //               placeholder="Auto Generate"
// //               value={editInvoiceReturnData?.invoice_return_id || ""}
// //               disabled
// //             />
// //           </div>
// //           <div className="createNewInvoice-input-box">
// //             <label htmlFor="invoice_select">Invoice Reference<sup>*</sup></label>
// //             {isEdit ? (
// //               <input
// //                 id="invoice_select"
// //                 type="text"
// //                 value={editInvoiceReturnData?.invoice?.invoice_id || "—"}
// //                 disabled
// //               />
// //             ) : (
// //               <select
// //                 id="invoice_select"
// //                 value={formInput.invoice}
// //                 onChange={(e) => handleInvoiceSelect(e.target.value)}
// //                 required
// //                 disabled={isLocked}
// //               >
// //                 <option value="">Select Invoice</option>
// //                 {invoiceList.map((inv) => (
// //                   <option key={inv.id} value={inv.id}>
// //                     {inv.invoice_id} — {inv.customer?.first_name || ""}
// //                   </option>
// //                 ))}
// //               </select>
// //             )}
// //           </div>
// //         </div>

// //         <div className="createNewInvoice-input-container">
// //           <div className="createNewInvoice-input-box">
// //             <label htmlFor="invoice_return_date">Return Date<sup>*</sup></label>
// //             <input
// //               id="invoice_return_date"
// //               type="date"
// //               value={formInput.invoice_return_date}
// //               onChange={(e) => setFormInput((p) => ({ ...p, invoice_return_date: e.target.value }))}
// //               required
// //               disabled={isLocked}
// //             />
// //           </div>
// //           <div className="createNewInvoice-input-box">
// //             <label htmlFor="customer_ref_no">Customer Ref. No</label>
// //             <input
// //               id="customer_ref_no"
// //               type="text"
// //               placeholder="Enter customer reference number"
// //               value={formInput.customer_ref_no}
// //               onChange={(e) => setFormInput((p) => ({ ...p, customer_ref_no: e.target.value }))}
// //               disabled={isLocked}
// //             />
// //           </div>
// //         </div>

// //         {/* ── Customer Info (read-only, derived from invoice) ── */}
// //         {(selectedInvoice || isEdit) && (
// //           <>
// //             <nav className="createNewInvoice-subtit">Customer Information</nav>
// //             <div className="createNewInvoice-input-container">
// //               <div className="createNewInvoice-input-box">
// //                 <label>Customer Name</label>
// //                 <input type="text" value={customerName} disabled />
// //               </div>
// //               <div className="createNewInvoice-input-box">
// //                 <label>Email</label>
// //                 <input type="text"
// //                   value={selectedInvoice?.customer?.email || editInvoiceReturnData?.email_id || "—"}
// //                   disabled />
// //               </div>
// //             </div>
// //             <div className="createNewInvoice-input-container">
// //               <div className="createNewInvoice-input-box">
// //                 <label>Phone</label>
// //                 <input type="text"
// //                   value={selectedInvoice?.customer?.phone_number || editInvoiceReturnData?.phone_number || "—"}
// //                   disabled />
// //               </div>
// //               <div className="createNewInvoice-input-box">
// //                 <label>Contact Person</label>
// //                 <input type="text"
// //                   value={editInvoiceReturnData?.contact_person || customerName}
// //                   disabled />
// //               </div>
// //             </div>
// //           </>
// //         )}

// //         {/* ── Line Items ── */}
// //         <nav className="createNewInvoice-subtit">Return Items</nav>
// //         <div className="createNewInvoice-table-container">
// //           <table>
// //             <thead className="createNewInvoice-table-head">
// //               <tr>
// //                 <th>#</th>
// //                 <th>Product Name</th>
// //                 <th>UOM</th>
// //                 <th>Invoiced Qty</th>
// //                 <th>Return Qty<sup>*</sup></th>
// //                 <th>Unit Price</th>
// //                 <th>Tax (%)</th>
// //                 <th>Total</th>
// //                 <th>Return Reason</th>
// //                 {!isLocked && <th>Serials</th>}
// //               </tr>
// //             </thead>
// //             <tbody className="createNewInvoice-table-body">
// //               {lineItems.length > 0 ? (
// //                 lineItems.map((item, ind) => (
// //                   <tr key={ind}>
// //                     <td>{ind + 1}</td>
// //                     <td>{item.product_name}</td>
// //                     <td>{item.uom}</td>
// //                     <td>{item.invoiced_qty}</td>
// //                     <td>
// //                       <input
// //                         type="number"
// //                         min={0}
// //                         max={item.invoiced_qty}
// //                         value={item.returned_qty_cus}
// //                         onChange={(e) => handleQtyChange(ind, e.target.value)}
// //                         disabled={isLocked}
// //                         style={{ width: "70px", padding: "4px" }}
// //                       />
// //                     </td>
// //                     <td>{item.unit_price}</td>
// //                     <td>{item.tax_rate}</td>
// //                     <td>{item.total}</td>
// //                     <td>
// //                       <input
// //                         type="text"
// //                         value={item.return_reason}
// //                         placeholder="Reason..."
// //                         onChange={(e) => handleReasonChange(ind, e.target.value)}
// //                         disabled={isLocked}
// //                         style={{ width: "140px", padding: "4px" }}
// //                       />
// //                     </td>
// //                     {!isLocked && item.available_serials?.length > 0 && (
// //                       <td>
// //                         <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", maxWidth: "180px" }}>
// //                           {item.available_serials.map((s) => (
// //                             <label key={s.serial_no} style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "3px" }}>
// //                               <input
// //                                 type="checkbox"
// //                                 checked={item.selected_serials.includes(s.serial_no)}
// //                                 onChange={() => handleSerialToggle(ind, s.serial_no)}
// //                                 disabled={
// //                                   !item.selected_serials.includes(s.serial_no) &&
// //                                   item.selected_serials.length >= item.returned_qty_cus
// //                                 }
// //                               />
// //                               {s.serial_no}
// //                             </label>
// //                           ))}
// //                         </div>
// //                       </td>
// //                     )}
// //                     {!isLocked && item.available_serials?.length === 0 && <td>—</td>}
// //                   </tr>
// //                 ))
// //               ) : (
// //                 <tr>
// //                   <td colSpan={10} style={{ textAlign: "center", padding: "16px", color: "#888" }}>
// //                     {isEdit ? "No items" : "Select an invoice to load items"}
// //                   </td>
// //                 </tr>
// //               )}
// //             </tbody>
// //           </table>
// //         </div>

// //         {/* ── Order Summary ── */}
// //         <nav className="createNewInvoice-subtit">Return Summary</nav>
// //         <div className="createNewInvoice-totals-container">
// //           <nav>
// //             <h5>Return Subtotal</h5>
// //             <p>{returnSubtotal !== "" ? returnSubtotal : "—"}</p>
// //           </nav>
// //           <nav>
// //             <h5>Global Discount Amount</h5>
// //             <p>{editInvoiceReturnData?.global_discount_amount ?? "—"}</p>
// //           </nav>
// //           <nav className="createNewInvoice-totals-container-bg">
// //             <h5>Amount to Refund</h5>
// //             <p>{amountToRefund !== "" ? amountToRefund : "—"}</p>
// //           </nav>
// //         </div>

// //         {/* ── Comments / History / Attachments ── */}
// //         <div className="createNewInvoice-hub-container">
// //           <div className="createNewInvoice-hub-head">
// //             {["comment", "history", "attachment"].map((tab) => (
// //               <p key={tab}
// //                 className={detail[tab] ? "createNewInvoice-hub-head-bg-black" : "createNewInvoice-hub-head-tit"}
// //                 onClick={() => setDetail({ comment: false, history: false, attachment: false, [tab]: true })}
// //               >
// //                 {tab.charAt(0).toUpperCase() + tab.slice(1)}{tab === "attachment" ? "s" : tab === "comment" ? "s" : ""}
// //               </p>
// //             ))}
// //           </div>
// //           <div className="createNewInvoice-hub-body">
// //             {detail.comment    && <InvoiceComment returnId={returnId} />}
// //             {detail.history    && <InvoiceHistory returnId={returnId} />}
// //             {detail.attachment && <InvoiceAttachment returnId={returnId} />}
// //           </div>
// //         </div>

// //         {/* ── Action Buttons ── */}
// //         <div className="createNewInvoice-btn-container">
// //           {/* Cancel Invoice Return — only when Submitted */}
// //           <button
// //             className={returnStatus === "Submitted" ? "createNewInvoice-order-active-btn" : "createNewInvoice-inactive-btn"}
// //             onClick={handleCancel}
// //             disabled={returnStatus !== "Submitted" || submitting}
// //             type="button"
// //           >
// //             {returnStatus === "Cancelled" ? "Cancelled" : "Cancel Return"}
// //           </button>

// //           <nav>
// //             <button
// //               type="button"
// //               className="createNewInvoice-cancel-btn"
// //               onClick={() => setCurrentPage("invoiceReturnCRM")}
// //             >
// //               Close
// //             </button>

// //             {/* Save Draft — only when Draft or new */}
// //             {(returnStatus === "" || returnStatus === "Draft") && (
// //               <button
// //                 type="button"
// //                 className="createNewInvoice-active-btn"
// //                 onClick={handleSaveDraft}
// //                 disabled={submitting}
// //               >
// //                 Save Draft
// //               </button>
// //             )}

// //             {/* Submit */}
// //             {!isLocked && (
// //               <button
// //                 type="submit"
// //                 className="createNewInvoice-active-btn"
// //                 disabled={submitting}
// //               >
// //                 {submitting ? "Submitting..." : "Submit"}
// //               </button>
// //             )}

// //             {isLocked && (
// //               <button type="button" className="createNewInvoice-completed-btn" disabled>
// //                 {returnStatus}
// //               </button>
// //             )}
// //           </nav>
// //         </div>

// //       </form>
// //     </div>
// //   );
// // }
// import React, { useEffect, useState } from "react";
// import "./createNewInvoice.css";
// import { toast } from "react-toastify";
// import InvoiceComment from "./invoiceComment";
// import InvoiceHistory from "./invoiceHistory";
// import InvoiceAttachment from "./invoiceAttachment";
// import invoiceReturnApiProvider from "../../../network/invoiceReturn-api-provider";
// import ApiClient from "../../../network/api-client";

// export default function CreateNewInvoiceReturn({ setCurrentPage, editInvoiceReturnData = {}, isEdit = false }) {
//   const isView = isEdit && editInvoiceReturnData?.status !== "Draft";

//   // ── IDs ────────────────────────────────────────────────────────────────────
//   const returnId = editInvoiceReturnData?.id || null;

//   // ── Status ─────────────────────────────────────────────────────────────────
//   const [returnStatus, setReturnStatus] = useState(editInvoiceReturnData?.status || "");

//   // ── Invoice list (for dropdown when creating) ──────────────────────────────
//   const [invoiceList, setInvoiceList] = useState([]);

//   // ── Selected invoice details (fetched after selection) ────────────────────
//   const [selectedInvoice, setSelectedInvoice] = useState(
//     isEdit ? editInvoiceReturnData?.invoice : null
//   );

//   // ── Line items (editable) ──────────────────────────────────────────────────
//   const [lineItems, setLineItems] = useState([]);

//   // ── Form header fields ─────────────────────────────────────────────────────
//   const [formInput, setFormInput] = useState({
//     invoice: "",
//     invoice_return_date: "",
//     customer_ref_no: "",
//   });

//   // ── Sync state when editInvoiceReturnData arrives ─────────────────────────
//   // useState initializer runs only once; this useEffect handles data that
//   // arrives after mount (e.g. passed from parent after async load)
//   useEffect(() => {
//     if (!isEdit || !editInvoiceReturnData?.id) return;
//     setReturnStatus(editInvoiceReturnData.status || "");
//     setFormInput({
//       invoice: editInvoiceReturnData.invoice?.id || "",
//       invoice_return_date: editInvoiceReturnData.invoice_return_date || "",
//       customer_ref_no: editInvoiceReturnData.customer_ref_no || "",
//     });
//     setSelectedInvoice(editInvoiceReturnData.invoice || null);
//     setLineItems(
//       (editInvoiceReturnData.items || []).map((item) => ({
//         id: item.id,
//         invoice_item: item.invoice_item,
//         product_name: item.product_name,
//         uom: item.uom?.name || "",
//         invoiced_qty: item.invoiced_qty,
//         returned_qty_cus: item.returned_qty_cus,
//         available_serials: item.available_serials || [],
//         selected_serials: (item.serial_numbers || []).map((s) => s.serial_no),
//         return_reason: item.return_reason || "",
//         unit_price: item.unit_price,
//         tax_rate: item.tax_rate,
//         discount_rate: item.discount_rate,
//         total: item.total,
//       }))
//     );
//   }, [editInvoiceReturnData?.id]);

//   // ── Dynamic totals — calculated from current line item qtys ───────────────
//   const returnSubtotal = lineItems
//     .reduce((sum, item) => {
//       const qty  = parseFloat(item.returned_qty_cus) || 0;
//       const price = parseFloat(item.unit_price) || 0;
//       const disc  = parseFloat(item.discount_rate) || 0;
//       const tax   = parseFloat(item.tax_rate) || 0;
//       const base  = price * qty * (1 - disc / 100);
//       return sum + base * (1 + tax / 100);
//     }, 0).toFixed(2);

//   // In edit mode use API's amount_to_refund; in create mode mirror subtotal
//   const amountToRefund = (isEdit && editInvoiceReturnData?.amount_to_refund != null)
//     ? editInvoiceReturnData.amount_to_refund
//     : returnSubtotal;

//   // ── Tab ────────────────────────────────────────────────────────────────────
//   const [detail, setDetail] = useState({ comment: true, history: false, attachment: false });

//   // ── Loading ────────────────────────────────────────────────────────────────
//   const [submitting, setSubmitting] = useState(false);

//   // ── Fetch invoice list (only needed when creating) ─────────────────────────
//   useEffect(() => {
//     if (!isEdit) {
//       ApiClient.get("/crm/invoices/", { params: { page: 1, limit: 100 } })
//         .then((res) => {
//           if (res.status === 200) {
//             const data = res.data?.data?.data || [];
//             setInvoiceList(data);
//           }
//         })
//         .catch(() => toast.error("Failed to load invoices"));
//     }
//   }, [isEdit]);

//   // ── When invoice selected from dropdown, populate line items ───────────────
//   const handleInvoiceSelect = async (invoiceId) => {
//     setFormInput((p) => ({ ...p, invoice: invoiceId }));
//     if (!invoiceId) {
//       setSelectedInvoice(null);
//       setLineItems([]);
//       return;
//     }
//     try {
//       const res = await ApiClient.get(`/crm/invoices/${invoiceId}/`);
//       if (res.status === 200) {
//         const inv = res.data?.data || res.data;
//         setSelectedInvoice(inv);
//         // Pre-populate line items from invoice items
//         setLineItems(
//           (inv.items || []).map((item) => ({
//             id: null,               // no return-item id yet
//             invoice_item: item.id,
//             product_name: item.product_name,
//             uom: item.uom?.name || "",
//             invoiced_qty: item.quantity,
//             returned_qty_cus: 0,
//             available_serials: [],
//             selected_serials: [],
//             return_reason: "",
//             unit_price: item.unit_price,
//             tax_rate: item.tax_rate,
//             discount_rate: item.discount_rate,
//             total: item.total,
//           }))
//         );
//       }
//     } catch {
//       toast.error("Failed to load invoice details");
//     }
//   };

//   // ── Line item change helpers ───────────────────────────────────────────────
//   const handleQtyChange = (index, value) => {
//     setLineItems((prev) =>
//       prev.map((item, i) =>
//         i === index ? { ...item, returned_qty_cus: Number(value) } : item
//       )
//     );
//   };

//   const handleReasonChange = (index, value) => {
//     setLineItems((prev) =>
//       prev.map((item, i) =>
//         i === index ? { ...item, return_reason: value } : item
//       )
//     );
//   };

//   const handleSerialToggle = (index, serial) => {
//     setLineItems((prev) =>
//       prev.map((item, i) => {
//         if (i !== index) return item;
//         const already = item.selected_serials.includes(serial);
//         return {
//           ...item,
//           selected_serials: already
//             ? item.selected_serials.filter((s) => s !== serial)
//             : [...item.selected_serials, serial],
//         };
//       })
//     );
//   };

//   // ── Build payload ──────────────────────────────────────────────────────────
//   const buildPayload = (action = null) => {
//     const payload = {
//       invoice: Number(formInput.invoice),
//       invoice_return_date: formInput.invoice_return_date,
//       customer_ref_no: formInput.customer_ref_no,
//       items: lineItems
//         .filter((item) => item.returned_qty_cus > 0)
//         .map((item) => {
//           const base = {
//             invoice_item: item.invoice_item,
//             returned_qty_cus: item.returned_qty_cus,
//             return_reason: item.return_reason,
//           };
//           if (item.id) base.id = item.id;  // needed for PATCH
//           if (item.selected_serials.length > 0) {
//             base.serial_numbers = item.selected_serials.map((s) => ({ serial_no: s }));
//           }
//           return base;
//         }),
//     };
//     if (action) payload.status = action === "save_draft" ? "Draft" : "Submitted";
//     return payload;
//   };

//   // ── Save Draft ─────────────────────────────────────────────────────────────
//   const handleSaveDraft = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       if (isEdit && returnId) {
//         // PATCH + action
//         await invoiceReturnApiProvider.updateInvoiceReturn(returnId, buildPayload());
//         await ApiClient.post(`/crm/invoice-returns/${returnId}/action/`, { action: "save_draft" });
//         toast.success("Saved as Draft");
//         setReturnStatus("Draft");
//       } else {
//         const res = await invoiceReturnApiProvider.createInvoiceReturn({ ...buildPayload(), status: "Draft" });
//         if (res) {
//           toast.success("Invoice Return saved as Draft");
//           setReturnStatus("Draft");
//         }
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // ── Submit ─────────────────────────────────────────────────────────────────
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formInput.invoice || !formInput.invoice_return_date) {
//       toast.error("Please fill required fields");
//       return;
//     }
//     if (lineItems.filter((i) => i.returned_qty_cus > 0).length === 0) {
//       toast.error("Please enter at least one return quantity");
//       return;
//     }
//     setSubmitting(true);
//     try {
//       if (isEdit && returnId) {
//         await invoiceReturnApiProvider.updateInvoiceReturn(returnId, buildPayload());
//         await ApiClient.post(`/crm/invoice-returns/${returnId}/action/`, { action: "submit" });
//         toast.success("Invoice Return submitted");
//         setReturnStatus("Submitted");
//       } else {
//         const res = await invoiceReturnApiProvider.createInvoiceReturn({ ...buildPayload(), status: "Draft" });
//         if (res?.data?.id) {
//           await ApiClient.post(`/crm/invoice-returns/${res.data.id}/action/`, { action: "submit" });
//           toast.success("Invoice Return submitted");
//           setReturnStatus("Submitted");
//         }
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // ── Cancel Invoice Return ──────────────────────────────────────────────────
//   const handleCancel = async (e) => {
//     e.preventDefault();
//     if (!returnId) return;
//     setSubmitting(true);
//     try {
//       await ApiClient.post(`/crm/invoice-returns/${returnId}/action/`, { action: "cancel" });
//       toast.success("Invoice Return cancelled");
//       setReturnStatus("Cancelled");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const isLocked = returnStatus === "Submitted" || returnStatus === "Cancelled";
//   const customerName = selectedInvoice?.customer?.first_name
//     ? `${selectedInvoice.customer.first_name} ${selectedInvoice.customer.last_name || ""}`.trim()
//     : isEdit ? (editInvoiceReturnData?.customer?.first_name
//         ? `${editInvoiceReturnData.customer.first_name} ${editInvoiceReturnData.customer.last_name || ""}`.trim()
//         : "—") : "—";

//   return (
//     <div className="createNewInvoice-container">
//       <form onSubmit={handleSubmit}>

//         {/* ── Header ── */}
//         <div className="createNewInvoice-head">
//           <nav>
//             <p>{isEdit ? "Invoice Return" : "New Invoice Return"}</p>
//             {returnStatus && (
//               <h3 className={
//                 returnStatus === "Draft"     ? "createNewInvoice-Status-draft"     :
//                 returnStatus === "Submitted" ? "createNewInvoice-Status-Send"      :
//                 returnStatus === "Cancelled" ? "createNewInvoice-Status-Cancelled" :
//                 "createNewInvoice-Status-empty"
//               }>
//                 Status: {returnStatus}
//               </h3>
//             )}
//           </nav>
//           <div>
//             <nav
//               className="createNewInvoice-close"
//               onClick={(e) => { e.preventDefault(); setCurrentPage("invoiceReturnCRM"); }}
//             >
//               <svg className="createNewInvoice-circle-x-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
//                 <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
//               </svg>
//               <p>Close</p>
//             </nav>
//           </div>
//         </div>

//         {/* ── Basic Info ── */}
//         <div className="createNewInvoice-input-container">
//           <div className="createNewInvoice-input-box">
//             <label htmlFor="invoice_return_id">Return ID (Auto Generate)</label>
//             <input
//               id="invoice_return_id"
//               type="text"
//               placeholder="Auto Generate"
//               value={editInvoiceReturnData?.invoice_return_id || ""}
//               disabled
//             />
//           </div>
//           <div className="createNewInvoice-input-box">
//             <label htmlFor="invoice_select">Invoice Reference<sup>*</sup></label>
//             {isEdit ? (
//               <input
//                 id="invoice_select"
//                 type="text"
//                 value={editInvoiceReturnData?.invoice?.invoice_id || "—"}
//                 disabled
//               />
//             ) : (
//               <select
//                 id="invoice_select"
//                 value={formInput.invoice}
//                 onChange={(e) => handleInvoiceSelect(e.target.value)}
//                 required
//                 disabled={isLocked}
//               >
//                 <option value="">Select Invoice</option>
//                 {invoiceList.map((inv) => (
//                   <option key={inv.id} value={inv.id}>
//                     {inv.invoice_id} — {inv.customer?.first_name || ""}
//                   </option>
//                 ))}
//               </select>
//             )}
//           </div>
//         </div>

//         <div className="createNewInvoice-input-container">
//           <div className="createNewInvoice-input-box">
//             <label htmlFor="invoice_return_date">Return Date<sup>*</sup></label>
//             <input
//               id="invoice_return_date"
//               type="date"
//               value={formInput.invoice_return_date}
//               onChange={(e) => setFormInput((p) => ({ ...p, invoice_return_date: e.target.value }))}
//               required
//               disabled={isLocked}
//             />
//           </div>
//           <div className="createNewInvoice-input-box">
//             <label htmlFor="customer_ref_no">Customer Ref. No</label>
//             <input
//               id="customer_ref_no"
//               type="text"
//               placeholder="Enter customer reference number"
//               value={formInput.customer_ref_no}
//               onChange={(e) => setFormInput((p) => ({ ...p, customer_ref_no: e.target.value }))}
//               disabled={isLocked}
//             />
//           </div>
//         </div>

//         {/* ── Customer Info (read-only, derived from invoice) ── */}
//         {(selectedInvoice || isEdit) && (
//           <>
//             <nav className="createNewInvoice-subtit">Customer Information</nav>
//             <div className="createNewInvoice-input-container">
//               <div className="createNewInvoice-input-box">
//                 <label>Customer Name</label>
//                 <input type="text" value={customerName} disabled />
//               </div>
//               <div className="createNewInvoice-input-box">
//                 <label>Email</label>
//                 <input type="text"
//                   value={selectedInvoice?.customer?.email || editInvoiceReturnData?.email_id || "—"}
//                   disabled />
//               </div>
//             </div>
//             <div className="createNewInvoice-input-container">
//               <div className="createNewInvoice-input-box">
//                 <label>Phone</label>
//                 <input type="text"
//                   value={selectedInvoice?.customer?.phone_number || editInvoiceReturnData?.phone_number || "—"}
//                   disabled />
//               </div>
//               <div className="createNewInvoice-input-box">
//                 <label>Contact Person</label>
//                 <input type="text"
//                   value={editInvoiceReturnData?.contact_person || customerName}
//                   disabled />
//               </div>
//             </div>
//           </>
//         )}

//         {/* ── Line Items ── */}
//         <nav className="createNewInvoice-subtit">Return Items</nav>
//         <div className="createNewInvoice-table-container">
//           <table>
//             <thead className="createNewInvoice-table-head">
//               <tr>
//                 <th>#</th>
//                 <th>Product Name</th>
//                 <th>UOM</th>
//                 <th>Invoiced Qty</th>
//                 <th>Return Qty<sup>*</sup></th>
//                 <th>Unit Price</th>
//                 <th>Tax (%)</th>
//                 <th>Total</th>
//                 <th>Return Reason</th>
//                 {!isLocked && <th>Serials</th>}
//               </tr>
//             </thead>
//             <tbody className="createNewInvoice-table-body">
//               {lineItems.length > 0 ? (
//                 lineItems.map((item, ind) => (
//                   <tr key={ind}>
//                     <td>{ind + 1}</td>
//                     <td>{item.product_name}</td>
//                     <td>{item.uom}</td>
//                     <td>{item.invoiced_qty}</td>
//                     <td>
//                       <input
//                         type="number"
//                         min={0}
//                         max={item.invoiced_qty}
//                         value={item.returned_qty_cus}
//                         onChange={(e) => handleQtyChange(ind, e.target.value)}
//                         disabled={isLocked}
//                         style={{ width: "70px", padding: "4px" }}
//                       />
//                     </td>
//                     <td>{item.unit_price}</td>
//                     <td>{item.tax_rate}</td>
//                     <td>{item.total}</td>
//                     <td>
//                       <input
//                         type="text"
//                         value={item.return_reason}
//                         placeholder="Reason..."
//                         onChange={(e) => handleReasonChange(ind, e.target.value)}
//                         disabled={isLocked}
//                         style={{ width: "140px", padding: "4px" }}
//                       />
//                     </td>
//                     {!isLocked && item.available_serials?.length > 0 && (
//                       <td>
//                         <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", maxWidth: "180px" }}>
//                           {item.available_serials.map((s) => (
//                             <label key={s.serial_no} style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "3px" }}>
//                               <input
//                                 type="checkbox"
//                                 checked={item.selected_serials.includes(s.serial_no)}
//                                 onChange={() => handleSerialToggle(ind, s.serial_no)}
//                                 disabled={
//                                   !item.selected_serials.includes(s.serial_no) &&
//                                   item.selected_serials.length >= item.returned_qty_cus
//                                 }
//                               />
//                               {s.serial_no}
//                             </label>
//                           ))}
//                         </div>
//                       </td>
//                     )}
//                     {!isLocked && item.available_serials?.length === 0 && <td>—</td>}
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={10} style={{ textAlign: "center", padding: "16px", color: "#888" }}>
//                     {isEdit ? "No items" : "Select an invoice to load items"}
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* ── Order Summary ── */}
//         <nav className="createNewInvoice-subtit">Return Summary</nav>
//         <div className="createNewInvoice-totals-container">
//           <nav>
//             <h5>Return Subtotal</h5>
//             <p>{returnSubtotal !== "" ? returnSubtotal : "—"}</p>
//           </nav>
//           <nav>
//             <h5>Global Discount Amount</h5>
//             <p>{editInvoiceReturnData?.global_discount_amount ?? "—"}</p>
//           </nav>
//           <nav className="createNewInvoice-totals-container-bg">
//             <h5>Amount to Refund</h5>
//             <p>{amountToRefund !== "" ? amountToRefund : "—"}</p>
//           </nav>
//         </div>

//         {/* ── Comments / History / Attachments ── */}
//         <div className="createNewInvoice-hub-container">
//           <div className="createNewInvoice-hub-head">
//             {["comment", "history", "attachment"].map((tab) => (
//               <p key={tab}
//                 className={detail[tab] ? "createNewInvoice-hub-head-bg-black" : "createNewInvoice-hub-head-tit"}
//                 onClick={() => setDetail({ comment: false, history: false, attachment: false, [tab]: true })}
//               >
//                 {tab.charAt(0).toUpperCase() + tab.slice(1)}{tab === "attachment" ? "s" : tab === "comment" ? "s" : ""}
//               </p>
//             ))}
//           </div>
//           <div className="createNewInvoice-hub-body">
//             {detail.comment    && <InvoiceComment returnId={returnId} />}
//             {detail.history    && <InvoiceHistory returnId={returnId} />}
//             {detail.attachment && <InvoiceAttachment returnId={returnId} />}
//           </div>
//         </div>

//         {/* ── Action Buttons ── */}
//         <div className="createNewInvoice-btn-container">
//           {/* Cancel Invoice Return — only when Submitted */}
//           <button
//             className={returnStatus === "Submitted" ? "createNewInvoice-order-active-btn" : "createNewInvoice-inactive-btn"}
//             onClick={handleCancel}
//             disabled={returnStatus !== "Submitted" || submitting}
//             type="button"
//           >
//             {returnStatus === "Cancelled" ? "Cancelled" : "Cancel Return"}
//           </button>

//           <nav>
//             <button
//               type="button"
//               className="createNewInvoice-cancel-btn"
//               onClick={() => setCurrentPage("invoiceReturnCRM")}
//             >
//               Close
//             </button>

//             {/* Save Draft — only when Draft or new */}
//             {(returnStatus === "" || returnStatus === "Draft") && (
//               <button
//                 type="button"
//                 className="createNewInvoice-active-btn"
//                 onClick={handleSaveDraft}
//                 disabled={submitting}
//               >
//                 Save Draft
//               </button>
//             )}

//             {/* Submit */}
//             {!isLocked && (
//               <button
//                 type="submit"
//                 className="createNewInvoice-active-btn"
//                 disabled={submitting}
//               >
//                 {submitting ? "Submitting..." : "Submit"}
//               </button>
//             )}

//             {isLocked && (
//               <button type="button" className="createNewInvoice-completed-btn" disabled>
//                 {returnStatus}
//               </button>
//             )}
//           </nav>
//         </div>

//       </form>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import "./createNewInvoice.css";
import { toast } from "react-toastify";
import InvoiceComment from "./invoiceComment";
import InvoiceHistory from "./invoiceHistory";
import InvoiceAttachment from "./invoiceAttachment";
import invoiceReturnApiProvider from "../../../network/invoiceReturn-api-provider";
import ApiClient from "../../../network/api-client";

export default function CreateNewInvoiceReturn({
  setCurrentPage,
  editInvoiceReturnData = {},
  isEdit = false,
}) {
  // ── IDs ────────────────────────────────────────────────────────────────────
  const returnId = editInvoiceReturnData?.id || null;

  // ── Status ─────────────────────────────────────────────────────────────────
  const [returnStatus, setReturnStatus] = useState(editInvoiceReturnData?.status || "");

  // ── Invoice list (for dropdown when creating) ──────────────────────────────
  const [invoiceList, setInvoiceList] = useState([]);

  // ── Selected invoice details (fetched after selection) ────────────────────
  const [selectedInvoice, setSelectedInvoice] = useState(
    isEdit ? editInvoiceReturnData?.invoice : null
  );

  // ── Line items ─────────────────────────────────────────────────────────────
  const [lineItems, setLineItems] = useState([]);

  // ── Form header fields ─────────────────────────────────────────────────────
  const [formInput, setFormInput] = useState({
    invoice:             "",
    invoice_return_date: "",
    customer_ref_no:     "",
  });

  // ── Tab ────────────────────────────────────────────────────────────────────
  const [detail, setDetail] = useState({ comment: true, history: false, attachment: false });

  // ── Loading ────────────────────────────────────────────────────────────────
  const [submitting, setSubmitting] = useState(false);

  // ── Button flags (false = active/clickable, true = greyed out)
  //    mirrors exact invoiceBtn pattern from CreateNewInvoice ─────────────────
  const [returnBtn, setReturnBtn] = useState({
    pdf:   true,
    email: true,
  });

  // ── Sync button flags whenever returnId or returnStatus changes ───────────
  // PDF & email become active as soon as record is saved (Draft onwards)
  // — same rule as CreateNewInvoice (pdf: false from "Draft" status)
  useEffect(() => {
    if (returnId && returnStatus !== "") {
      setReturnBtn({ pdf: false, email: false });
    } else {
      setReturnBtn({ pdf: true, email: true });
    }
  }, [returnId, returnStatus]);

  // ── Sync form state when editInvoiceReturnData arrives ────────────────────
  useEffect(() => {
    if (!isEdit || !editInvoiceReturnData?.id) return;
    setReturnStatus(editInvoiceReturnData.status || "");
    setFormInput({
      invoice:             editInvoiceReturnData.invoice?.id          || "",
      invoice_return_date: editInvoiceReturnData.invoice_return_date  || "",
      customer_ref_no:     editInvoiceReturnData.customer_ref_no      || "",
    });
    setSelectedInvoice(editInvoiceReturnData.invoice || null);
    setLineItems(
      (editInvoiceReturnData.items || []).map((item) => ({
        id:               item.id,
        invoice_item:     item.invoice_item,
        product_name:     item.product_name,
        uom:              item.uom?.name           || "",
        invoiced_qty:     item.invoiced_qty,
        returned_qty_cus: item.returned_qty_cus,
        available_serials: item.available_serials  || [],
        selected_serials: (item.serial_numbers || []).map((s) => s.serial_no),
        return_reason:    item.return_reason        || "",
        unit_price:       item.unit_price,
        tax_rate:         item.tax_rate,
        discount_rate:    item.discount_rate,
        total:            item.total,
      }))
    );
  }, [editInvoiceReturnData?.id]);

  // ── Dynamic totals ─────────────────────────────────────────────────────────
  const returnSubtotal = lineItems
    .reduce((sum, item) => {
      const qty   = parseFloat(item.returned_qty_cus) || 0;
      const price = parseFloat(item.unit_price)        || 0;
      const disc  = parseFloat(item.discount_rate)     || 0;
      const tax   = parseFloat(item.tax_rate)          || 0;
      const base  = price * qty * (1 - disc / 100);
      return sum + base * (1 + tax / 100);
    }, 0)
    .toFixed(2);

  const amountToRefund =
    isEdit && editInvoiceReturnData?.amount_to_refund != null
      ? editInvoiceReturnData.amount_to_refund
      : returnSubtotal;

  // ── Fetch invoice list (create mode only) ──────────────────────────────────
  useEffect(() => {
    if (!isEdit) {
      ApiClient.get("/crm/invoices/", { params: { page: 1, limit: 100 } })
        .then((res) => {
          if (res.status === 200) {
            setInvoiceList(res.data?.data?.data || []);
          }
        })
        .catch(() => toast.error("Failed to load invoices"));
    }
  }, [isEdit]);

  // ── Invoice select → populate line items ──────────────────────────────────
  const handleInvoiceSelect = async (invoiceId) => {
    setFormInput((p) => ({ ...p, invoice: invoiceId }));
    if (!invoiceId) {
      setSelectedInvoice(null);
      setLineItems([]);
      return;
    }
    try {
      const res = await ApiClient.get(`/crm/invoices/${invoiceId}/`);
      if (res.status === 200) {
        const inv = res.data?.data || res.data;
        setSelectedInvoice(inv);
        setLineItems(
          (inv.items || []).map((item) => ({
            id:               null,
            invoice_item:     item.id,
            product_name:     item.product_name,
            uom:              item.uom?.name || "",
            invoiced_qty:     item.quantity,
            returned_qty_cus: 0,
            available_serials: [],
            selected_serials: [],
            return_reason:    "",
            unit_price:       item.unit_price,
            tax_rate:         item.tax_rate,
            discount_rate:    item.discount_rate,
            total:            item.total,
          }))
        );
      }
    } catch {
      toast.error("Failed to load invoice details");
    }
  };

  // ── Line item helpers ──────────────────────────────────────────────────────
  const handleQtyChange = (index, value) =>
    setLineItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, returned_qty_cus: Number(value) } : item
      )
    );

  const handleReasonChange = (index, value) =>
    setLineItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, return_reason: value } : item
      )
    );

  const handleSerialToggle = (index, serial) =>
    setLineItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const already = item.selected_serials.includes(serial);
        return {
          ...item,
          selected_serials: already
            ? item.selected_serials.filter((s) => s !== serial)
            : [...item.selected_serials, serial],
        };
      })
    );

  // ── Build payload ──────────────────────────────────────────────────────────
  const buildPayload = () => ({
    invoice:             Number(formInput.invoice),
    invoice_return_date: formInput.invoice_return_date,
    customer_ref_no:     formInput.customer_ref_no,
    items: lineItems
      .filter((item) => item.returned_qty_cus > 0)
      .map((item) => {
        const base = {
          invoice_item:     item.invoice_item,
          returned_qty_cus: item.returned_qty_cus,
          return_reason:    item.return_reason,
        };
        if (item.id) base.id = item.id;
        if (item.selected_serials.length > 0) {
          base.serial_numbers = item.selected_serials.map((s) => ({ serial_no: s }));
        }
        return base;
      }),
  });

  // ── Save Draft ─────────────────────────────────────────────────────────────
  const handleSaveDraft = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEdit && returnId) {
        await invoiceReturnApiProvider.updateInvoiceReturn(returnId, buildPayload());
        await ApiClient.post(`/crm/invoice-returns/${returnId}/action/`, { action: "save_draft" });
        toast.success("Saved as Draft");
        setReturnStatus("Draft");
      } else {
        const res = await invoiceReturnApiProvider.createInvoiceReturn({
          ...buildPayload(),
          status: "Draft",
        });
        if (res) {
          toast.success("Invoice Return saved as Draft");
          setReturnStatus("Draft");
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formInput.invoice || !formInput.invoice_return_date) {
      toast.error("Please fill required fields");
      return;
    }
    if (lineItems.filter((i) => i.returned_qty_cus > 0).length === 0) {
      toast.error("Please enter at least one return quantity");
      return;
    }
    setSubmitting(true);
    try {
      if (isEdit && returnId) {
        await invoiceReturnApiProvider.updateInvoiceReturn(returnId, buildPayload());
        await ApiClient.post(`/crm/invoice-returns/${returnId}/action/`, { action: "submit" });
        toast.success("Invoice Return submitted");
        setReturnStatus("Submitted");
      } else {
        const res = await invoiceReturnApiProvider.createInvoiceReturn({
          ...buildPayload(),
          status: "Draft",
        });
        if (res?.data?.id) {
          await ApiClient.post(`/crm/invoice-returns/${res.data.id}/action/`, { action: "submit" });
          toast.success("Invoice Return submitted");
          setReturnStatus("Submitted");
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ── Cancel Invoice Return ──────────────────────────────────────────────────
  const handleCancel = async (e) => {
    e.preventDefault();
    if (!returnId) return;
    setSubmitting(true);
    try {
      await ApiClient.post(`/crm/invoice-returns/${returnId}/action/`, { action: "cancel" });
      toast.success("Invoice Return cancelled");
      setReturnStatus("Cancelled");
    } finally {
      setSubmitting(false);
    }
  };

  // ── PDF ────────────────────────────────────────────────────────────────────
  const handlePdf = async (e) => {
    e.preventDefault();
    if (!returnId) return;
    await invoiceReturnApiProvider.downloadPDF(
      returnId,
      editInvoiceReturnData?.invoice_return_id
    );
  };

  // ── Email ──────────────────────────────────────────────────────────────────
  const handleEmail = async (e) => {
    e.preventDefault();
    if (!returnId) return;
    const customerEmail =
      editInvoiceReturnData?.invoice?.customer?.email ||
      selectedInvoice?.customer?.email ||
      "";
    const email = window.prompt("Send invoice return to email:", customerEmail);
    if (!email || !email.trim()) return;
    await invoiceReturnApiProvider.sendEmail(returnId, email.trim());
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const isLocked = returnStatus === "Submitted" || returnStatus === "Cancelled";

  const customerName = selectedInvoice?.customer?.first_name
    ? `${selectedInvoice.customer.first_name} ${selectedInvoice.customer.last_name || ""}`.trim()
    : isEdit
    ? editInvoiceReturnData?.customer?.first_name
      ? `${editInvoiceReturnData.customer.first_name} ${editInvoiceReturnData.customer.last_name || ""}`.trim()
      : "—"
    : "—";

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="createNewInvoice-container">
      <form onSubmit={handleSubmit}>

        {/* ── Header ── */}
        <div className="createNewInvoice-head">
          <nav>
            <p>{isEdit ? "Invoice Return" : "New Invoice Return"}</p>
            {returnStatus && (
              <h3
                className={
                  returnStatus === "Draft"
                    ? "createNewInvoice-Status-draft"
                    : returnStatus === "Submitted"
                    ? "createNewInvoice-Status-Send"
                    : returnStatus === "Cancelled"
                    ? "createNewInvoice-Status-Cancelled"
                    : "createNewInvoice-Status-empty"
                }
              >
                Status: {returnStatus}
              </h3>
            )}
          </nav>
          <div>
            <nav
              className="createNewInvoice-close"
              onClick={(e) => { e.preventDefault(); setCurrentPage("invoiceReturnCRM"); }}
            >
              <svg
                className="createNewInvoice-circle-x-logo"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
              </svg>
              <p>Close</p>
            </nav>
          </div>
        </div>

        {/* ── Basic Info ── */}
        <div className="createNewInvoice-input-container">
          <div className="createNewInvoice-input-box">
            <label htmlFor="invoice_return_id">Return ID (Auto Generate)</label>
            <input
              id="invoice_return_id"
              type="text"
              placeholder="Auto Generate"
              value={editInvoiceReturnData?.invoice_return_id || ""}
              disabled
            />
          </div>
          <div className="createNewInvoice-input-box">
            <label htmlFor="invoice_select">
              Invoice Reference<sup>*</sup>
            </label>
            {isEdit ? (
              <input
                id="invoice_select"
                type="text"
                value={editInvoiceReturnData?.invoice?.invoice_id || "—"}
                disabled
              />
            ) : (
              <select
                id="invoice_select"
                value={formInput.invoice}
                onChange={(e) => handleInvoiceSelect(e.target.value)}
                required
                disabled={isLocked}
              >
                <option value="">Select Invoice</option>
                {invoiceList.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.invoice_id} — {inv.customer?.first_name || ""}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="createNewInvoice-input-container">
          <div className="createNewInvoice-input-box">
            <label htmlFor="invoice_return_date">
              Return Date<sup>*</sup>
            </label>
            <input
              id="invoice_return_date"
              type="date"
              value={formInput.invoice_return_date}
              onChange={(e) =>
                setFormInput((p) => ({ ...p, invoice_return_date: e.target.value }))
              }
              required
              disabled={isLocked}
            />
          </div>
          <div className="createNewInvoice-input-box">
            <label htmlFor="customer_ref_no">Customer Ref. No</label>
            <input
              id="customer_ref_no"
              type="text"
              placeholder="Enter customer reference number"
              value={formInput.customer_ref_no}
              onChange={(e) =>
                setFormInput((p) => ({ ...p, customer_ref_no: e.target.value }))
              }
              disabled={isLocked}
            />
          </div>
        </div>

        {/* ── Customer Info ── */}
        {(selectedInvoice || isEdit) && (
          <>
            <nav className="createNewInvoice-subtit">Customer Information</nav>
            <div className="createNewInvoice-input-container">
              <div className="createNewInvoice-input-box">
                <label>Customer Name</label>
                <input type="text" value={customerName} disabled />
              </div>
              <div className="createNewInvoice-input-box">
                <label>Email</label>
                <input
                  type="text"
                  value={
                    selectedInvoice?.customer?.email ||
                    editInvoiceReturnData?.email_id ||
                    "—"
                  }
                  disabled
                />
              </div>
            </div>
            <div className="createNewInvoice-input-container">
              <div className="createNewInvoice-input-box">
                <label>Phone</label>
                <input
                  type="text"
                  value={
                    selectedInvoice?.customer?.phone_number ||
                    editInvoiceReturnData?.phone_number ||
                    "—"
                  }
                  disabled
                />
              </div>
              <div className="createNewInvoice-input-box">
                <label>Contact Person</label>
                <input
                  type="text"
                  value={editInvoiceReturnData?.contact_person || customerName}
                  disabled
                />
              </div>
            </div>
          </>
        )}

        {/* ── Line Items ── */}
        <nav className="createNewInvoice-subtit">Return Items</nav>
        <div className="createNewInvoice-table-container">
          <table>
            <thead className="createNewInvoice-table-head">
              <tr>
                <th>#</th>
                <th>Product Name</th>
                <th>UOM</th>
                <th>Invoiced Qty</th>
                <th>Return Qty<sup>*</sup></th>
                <th>Unit Price</th>
                <th>Tax (%)</th>
                <th>Total</th>
                <th>Return Reason</th>
                {!isLocked && <th>Serials</th>}
              </tr>
            </thead>
            <tbody className="createNewInvoice-table-body">
              {lineItems.length > 0 ? (
                lineItems.map((item, ind) => (
                  <tr key={ind}>
                    <td>{ind + 1}</td>
                    <td>{item.product_name}</td>
                    <td>{item.uom}</td>
                    <td>{item.invoiced_qty}</td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        max={item.invoiced_qty}
                        value={item.returned_qty_cus}
                        onChange={(e) => handleQtyChange(ind, e.target.value)}
                        disabled={isLocked}
                        style={{ width: "70px", padding: "4px" }}
                      />
                    </td>
                    <td>{item.unit_price}</td>
                    <td>{item.tax_rate}</td>
                    <td>{item.total}</td>
                    <td>
                      <input
                        type="text"
                        value={item.return_reason}
                        placeholder="Reason..."
                        onChange={(e) => handleReasonChange(ind, e.target.value)}
                        disabled={isLocked}
                        style={{ width: "140px", padding: "4px" }}
                      />
                    </td>
                    {!isLocked && item.available_serials?.length > 0 && (
                      <td>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "4px",
                            maxWidth: "180px",
                          }}
                        >
                          {item.available_serials.map((s) => (
                            <label
                              key={s.serial_no}
                              style={{
                                fontSize: "12px",
                                display: "flex",
                                alignItems: "center",
                                gap: "3px",
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={item.selected_serials.includes(s.serial_no)}
                                onChange={() => handleSerialToggle(ind, s.serial_no)}
                                disabled={
                                  !item.selected_serials.includes(s.serial_no) &&
                                  item.selected_serials.length >= item.returned_qty_cus
                                }
                              />
                              {s.serial_no}
                            </label>
                          ))}
                        </div>
                      </td>
                    )}
                    {!isLocked && item.available_serials?.length === 0 && <td>—</td>}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={10}
                    style={{ textAlign: "center", padding: "16px", color: "#888" }}
                  >
                    {isEdit ? "No items" : "Select an invoice to load items"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Return Summary ── */}
        <nav className="createNewInvoice-subtit">Return Summary</nav>
        <div className="createNewInvoice-totals-container">
          <nav>
            <h5>Return Subtotal</h5>
            <p>{returnSubtotal !== "" ? returnSubtotal : "—"}</p>
          </nav>
          <nav>
            <h5>Global Discount Amount</h5>
            <p>{editInvoiceReturnData?.global_discount_amount ?? "—"}</p>
          </nav>
          <nav className="createNewInvoice-totals-container-bg">
            <h5>Amount to Refund</h5>
            <p>{amountToRefund !== "" ? amountToRefund : "—"}</p>
          </nav>
        </div>

        {/* ── Comments / History / Attachments ── */}
        <div className="createNewInvoice-hub-container">
          <div className="createNewInvoice-hub-head">
            {["comment", "history", "attachment"].map((tab) => (
              <p
                key={tab}
                className={
                  detail[tab]
                    ? "createNewInvoice-hub-head-bg-black"
                    : "createNewInvoice-hub-head-tit"
                }
                onClick={() =>
                  setDetail({
                    comment: false,
                    history: false,
                    attachment: false,
                    [tab]: true,
                  })
                }
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === "attachment" ? "s" : tab === "comment" ? "s" : ""}
              </p>
            ))}
          </div>
          <div className="createNewInvoice-hub-body">
            {detail.comment    && <InvoiceComment    returnId={returnId} />}
            {detail.history    && <InvoiceHistory    returnId={returnId} />}
            {detail.attachment && <InvoiceAttachment returnId={returnId} />}
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="createNewInvoice-btn-container">

          {/* Left: Cancel Return */}
          <button
            className={
              returnStatus === "Submitted"
                ? "createNewInvoice-order-active-btn"
                : "createNewInvoice-inactive-btn"
            }
            onClick={handleCancel}
            disabled={returnStatus !== "Submitted" || submitting}
            type="button"
          >
            {returnStatus === "Cancelled" ? "Cancelled" : "Cancel Return"}
          </button>

          {/* Right: action cluster */}
          <nav>
            <button
              type="button"
              className="createNewInvoice-cancel-btn"
              onClick={() => setCurrentPage("invoiceReturnCRM")}
            >
              Cancel
            </button>

            {/* Save Draft — only when not locked */}
            {(returnStatus === "" || returnStatus === "Draft") && (
              <button
                type="button"
                className={
                  ["", "Draft"].includes(returnStatus)
                    ? "createNewInvoice-active-btn"
                    : "createNewInvoice-completed-btn"
                }
                onClick={handleSaveDraft}
                disabled={submitting}
              >
                {submitting ? "Saving…" : "Save Draft"}
              </button>
            )}

            {/* Submit — only when not locked */}
            {!isLocked && (
              <button
                type="submit"
                className={
                  ["", "Draft"].includes(returnStatus)
                    ? "createNewInvoice-active-btn"
                    : "createNewInvoice-completed-btn"
                }
                disabled={submitting}
              >
                {submitting ? "Submitting…" : "Submit"}
              </button>
            )}

            {/* Locked status badge */}
            {isLocked && (
              <button type="button" className="createNewInvoice-completed-btn" disabled>
                {returnStatus}
              </button>
            )}

            {/* ── PDF icon — identical SVG + class logic to CreateNewInvoice ── */}
            <svg
              className={
                !returnBtn.pdf
                  ? "createNewInvoice-pdf-mail-activelogo"
                  : "createNewInvoice-pdf-mail-futurelogo"
              }
              style={{
                cursor:  !returnBtn.pdf ? "pointer" : "not-allowed",
                opacity: returnBtn.pdf  ? 0.4       : 1,
              }}
              onClick={!returnBtn.pdf ? handlePdf : undefined}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 22 24"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.600098 2.4C0.600098 1.76348 0.852954 1.15303 1.30304 0.702944C1.75313
                   0.252856 2.36358 0 3.0001 0L16.1313 0L21.4001 5.2688V21.6C21.4001 22.2365
                   21.1472 22.847 20.6972 23.2971C20.2471 23.7471 19.6366 24 19.0001 24H3.0001C2.36358
                   24 1.75313 23.7471 1.30304 23.2971C0.852954 22.847 0.600098 22.2365 0.600098
                   21.6V2.4ZM4.6001 9.6H2.2001V17.6H3.8001V14.4H4.6001C5.23662 14.4 5.84707 14.1471
                   6.29715 13.6971C6.74724 13.247 7.0001 12.6365 7.0001 12C7.0001 11.3635 6.74724
                   10.753 6.29715 10.3029C5.84707 9.85286 5.23662 9.6 4.6001 9.6ZM11.0001 9.6H8.6001
                   V17.6H11.0001C11.6366 17.6 12.2471 17.3471 12.6972 16.8971C13.1472 16.447 13.4001
                   15.8365 13.4001 15.2V12C13.4001 11.3635 13.1472 10.753 12.6972 10.3029C12.2471
                   9.85286 11.6366 9.6 11.0001 9.6ZM15.0001 17.6V9.6H19.8001V11.2H16.6001V12.8H18.2001
                   V14.4H16.6001V17.6H15.0001Z"
              />
            </svg>

            {/* ── Email icon — identical SVG + class logic to CreateNewInvoice ── */}
            <svg
              className={
                !returnBtn.email
                  ? "createNewInvoice-pdf-mail-activelogo"
                  : "createNewInvoice-pdf-mail-futurelogo"
              }
              style={{
                cursor:  !returnBtn.email ? "pointer" : "not-allowed",
                opacity: returnBtn.email  ? 0.4       : 1,
              }}
              onClick={!returnBtn.email ? handleEmail : undefined}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 16"
              fill="none"
            >
              <path d="M2 16C1.45 16 0.979333 15.8043 0.588 15.413C0.196667 15.0217 0.000666667
                 14.5507 0 14V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196666 1.45067
                 0.000666667 2 0H18C18.55 0 19.021 0.196 19.413 0.588C19.805 0.98 20.0007
                 1.45067 20 2V14C20 14.55 19.8043 15.021 19.413 15.413C19.0217 15.805 18.5507
                 16.0007 18 16H2ZM10 8.825C10.0833 8.825 10.171 8.81233 10.263 8.787C10.355
                 8.76167 10.4423 8.72433 10.525 8.675L17.6 4.25C17.7333 4.16667 17.8333 4.06267
                 17.9 3.938C17.9667 3.81833 18 3.67567 18 3.525C18 3.19167 17.8583 2.94167
                 17.575 2.775C17.2917 2.60833 17 2.61667 16.7 2.8L10 7L3.3 2.8C3 2.61667
                 2.70833 2.61267 2.425 2.788C2.14167 2.96333 2 3.209 2 3.525C2 3.69167 2.03333
                 3.83767 2.1 3.963C2.16667 4.08833 2.26667 4.184 2.4 4.25L9.475 8.675C9.55833
                 8.725 9.646 8.76267 9.738 8.788C9.83 8.81333 9.91733 8.82567 10 8.825Z" />
            </svg>
          </nav>
        </div>

      </form>
    </div>
  );
}