// import React, { useState, useEffect } from "react";
// import "./invoiceCRM.css";

// export default function invoiceCRM({ setCurrentPage }) {
//   const [invoiceCurrentPage, setInvoiceCurrentPage] = useState(1);
//   const invoicePerPage = 10;

//   const [filter, setFilter] = useState({
//     invoice_status: "",
//     payment_status: "",
//     invoice_from_date: "",
//     invoice_to_date: "",
//   });

//   const [ApiInvoice, setApiInvoice] = useState({});
//   const [invoiceData, setInvoiceData] = useState([]);

//   const invoiceFromAPI = {
//     invoiceData: [
//       {
//         invoice_id: "INV-0001",
//         sales_order_ref: "SO-0001",
//         customer_name: "Acme Corp",
//         invoice_date: "28-05-2025",
//         due_date: "28-05-2025",
//         status: "Draft",
//         payment_status: "Unpaid",
//       },
//       {
//         invoice_id: "INV-0002",
//         sales_order_ref: "SO-0002",
//         customer_name: "Acme Corp",
//         invoice_date: "28-05-2025",
//         due_date: "28-05-2025",
//         status: "Send",
//         payment_status: "Unpaid",
//       },
//       {
//         invoice_id: "INV-0003",
//         sales_order_ref: "SO-0003",
//         customer_name: "Acme",
//         invoice_date: "28-05-2025",
//         due_date: "28-05-2025",
//         status: "Send",
//         payment_status: "Partial",
//       },
//       {
//         invoice_id: "INV-0004",
//         sales_order_ref: "SO-0004",
//         customer_name: "Corp",
//         invoice_date: "28-05-2025",
//         due_date: "28-05-2025",
//         status: "Paid",
//         payment_status: "Paid",
//       },
//       {
//         invoice_id: "INV-0005",
//         sales_order_ref: "SO-0005",
//         customer_name: "Sai Kumar",
//         invoice_date: "28-05-2025",
//         due_date: "28-05-2025",
//         status: "Overdue",
//         payment_status: "Unpaid",
//       },
//       {
//         invoice_id: "INV-0006",
//         sales_order_ref: "SO-0006",
//         customer_name: "Kishore",
//         invoice_date: "28-05-2025",
//         due_date: "28-05-2025",
//         status: "Cancelled",
//         payment_status: "",
//       },
//     ],
//   };
//   useEffect(() => {
//     setApiInvoice(invoiceFromAPI);
//   }, []);
//   useEffect(() => {
//     if (Object.keys(ApiInvoice).length > 0) {
//       setInvoiceData(ApiInvoice.invoiceData);
//     }
//   }, [ApiInvoice]);

//   //page calculation
//   const totalPages = Math.ceil(invoiceData.length / invoicePerPage);

//   const currentData = invoiceData.slice(
//     (invoiceCurrentPage - 1) * invoicePerPage,
//     invoiceCurrentPage * invoicePerPage
//   );
//   const handleNext = () => {
//     if (invoiceCurrentPage < totalPages) {
//       setInvoiceCurrentPage((prev) => prev + 1);
//     }
//   };
//   const handlePrev = () => {
//     if (invoiceCurrentPage > 1) {
//       setInvoiceCurrentPage((prev) => prev - 1);
//     }
//   };
//   const handleClearFilter = () => {
//     setFilter({
//       invoice_status: "",
//       payment_status: "",
//       invoice_from_date: "",
//       invoice_to_date: "",
//     });
//   };
//   return (
//     <>
//       <div className="invoiceCRM-container">
//         <div className="invoiceCRM-header">
//           <p>Invoice List</p>
//           <button
//             onClick={() => {
//               setCurrentPage("createNewInvoice");
//             }}
//           >
//             + New Invoice
//           </button>
//         </div>
//         <div className="invoiceCRM-search-box">
//           <label htmlFor="searchByID">
//             <svg
//               className="invoiceCRM-search-logo"
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 512 512"
//             >
//               <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
//             </svg>
//           </label>
//           <input
//             id="searchByID"
//             placeholder="Search by Invoice ID, Customer name...."
//           />
//         </div>
//         <div className="invoiceCRM-clearfilter">
//           <p onClick={handleClearFilter}>Clear Filter</p>
//         </div>
//         <div className="invoiceCRM-search-category">
//           <div className="invoiceCRM-input-box">
//             <label htmlFor="invoice_status">Invoice Status</label>
//             <select
//               value={filter.invoice_status}
//               onChange={(e) => {
//                 setFilter((prev) => ({
//                   ...prev,
//                   invoice_status: e.target.value,
//                 }));
//               }}
//               id="invoice_status"
//             >
//               <option value="">All</option>
//               <option value="Draft">Draft</option>
//               <option value="Send">Send</option>
//               <option value="Paid">Paid</option>
//               <option value="Overdue">Overdue</option>
//               <option value="Cancelled">Cancelled</option>
//             </select>
//           </div>
//           <div className="invoiceCRM-input-box">
//             <label htmlFor="payment_status">Payment Status</label>
//             <select
//               id="payment_status"
//               value={filter.payment_status}
//               onChange={(e) => {
//                 setFilter((prev) => ({
//                   ...prev,
//                   payment_status: e.target.value,
//                 }));
//               }}
//             >
//               <option value="">All Types</option>
//               <option value="Paid">Paid</option>
//               <option value="Partial">Partial</option>
//               <option value="Unpaid">Unpaid</option>
//             </select>
//           </div>
//           <div className="invoiceCRM-input-box">
//             <label htmlFor="invoice_date">Invoice Date</label>
//             <nav id="invoice_date">
//               <div>
//                 <span>From </span>
//                 <input
//                   value={filter.invoice_from_date}
//                   onChange={(e) => {
//                     setFilter((prev) => ({
//                       ...prev,
//                       invoice_from_date: e.target.value,
//                     }));
//                   }}
//                   className="invoiceCRM-date"
//                   type="date"
//                 />
//               </div>
//               <div>
//                 <span>to </span>
//                 <input
//                   value={filter.invoice_to_date}
//                   onChange={(e) => {
//                     setFilter((prev) => ({
//                       ...prev,
//                       invoice_to_date: e.target.value,
//                     }));
//                   }}
//                   className="invoiceCRM-date"
//                   type="date"
//                 />
//               </div>
//             </nav>
//           </div>
//         </div>

//         <div className="invoiceCRM-table-cointainer">
//           <table>
//             <thead className="invoiceCRM-table-head">
//               <tr>
//                 <th></th>
//                 <th>
//                   <pre>Invoice ID</pre>
//                 </th>
//                 <th>
//                   <pre>Sales Order Ref.</pre>
//                 </th>
//                 <th>
//                   <pre>Customer Name</pre>
//                 </th>
//                 <th>
//                   <pre>Invoice Date</pre>
//                 </th>
//                 <th>
//                   <pre>Due Date</pre>
//                 </th>
//                 <th>
//                   <div className="invoiceCRM-status-filter">
//                     Status
//                     <nav className="invoiceCRM-filter-box">
//                       <p>Newest First</p>
//                       <p>Oldest First</p>
//                       <p>Progressing {`(Draft → Cancelled)`}</p>
//                       <p>Reverse Progressing{`(Cancelled → Draft)`} </p>
//                     </nav>
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="14"
//                       height="18"
//                       viewBox="0 0 14 18"
//                       fill="none"
//                     >
//                       <path
//                         d="M3.66683 12.3346H0.333496L5.3335 17.3346V0.667969H3.66683V12.3346ZM8.66683 3.16797V17.3346H10.3335V5.66797H13.6668L8.66683 0.667969V3.16797Z"
//                         fill="#234E70"
//                       />
//                     </svg>
//                   </div>
//                 </th>
//                 <th>
//                   <pre>Payment status</pre>
//                 </th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody className="invoiceCRM-table-body">
//               {currentData.length > 0 ? (
//                 currentData.map((ele, ind) => (
//                   <tr key={ind}>
//                     <td>
//                       <input
//                         className="invoiceCRM-table-check"
//                         type="checkbox"
//                       />
//                     </td>
//                     <td>{ele.invoice_id}</td>
//                     <td>{ele.sales_order_ref}</td>
//                     <td>{ele.customer_name}</td>
//                     <td>
//                       <pre>{ele.invoice_date}</pre>
//                     </td>
//                     <td>
//                       <pre>{ele.due_date}</pre>
//                     </td>
//                     <td>
//                       <p
//                         className={`invoiceCRM-Status ${
//                           ele.status === "Draft"
//                             ? "invoiceCRM-Status-draft"
//                             : ele.status === "Send"
//                             ? "invoiceCRM-Status-Send"
//                             : ele.status === "Cancelled"
//                             ? "invoiceCRM-Status-Cancelled"
//                             : ele.status === "Paid"
//                             ? "invoiceCRM-Status-Paid"
//                             : ele.status === "Overdue"
//                             ? "invoiceCRM-Status-Overdue"
//                             : ""
//                         }`}
//                       >
//                         {ele.status}
//                       </p>
//                     </td>
//                     <td>
//                       <p
//                         className={
//                           ele.payment_status === "Paid"
//                             ? "invoiceCRM-Paid"
//                             : ele.payment_status === "Unpaid"
//                             ? "invoiceCRM-Unpaid"
//                             : ele.payment_status === "Partial"
//                             ? "invoiceCRM-Partial"
//                             : ""
//                         }
//                       >
//                         {ele.payment_status === "" ? "-" : ele.payment_status}
//                       </p>
//                     </td>
//                     <td id="invoiceCRM-table-action">
//                       <nav className="invoiceCRM-dot-container">
//                         <button
//                           onClick={() => {
//                             setCurrentPage("editInvoice");
//                           }}
//                         >
//                           {ele.status === "Draft" ? "Edit" : "View"} details
//                         </button>
//                         <button
//                           disabled={
//                             ele.status === "Draft" || ele.status === "Cancelled"
//                               ? true
//                               : false
//                           }
//                         >
//                           Generate Invoice Return
//                         </button>
//                       </nav>
//                       <svg
//                         className="invoiceCRM-delete-logo"
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
//               ) : (
//                 <tr>
//                   <td>
//                     <pre>No Data Found</pre>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//         <nav className="invoiceCRM-table-bottem">
//           <p className="invoiceCRM-num-entries">
//             Showing {currentData.length} entries
//           </p>
//           <div className="invoiceCRM-manage-control-box">
//             <button
//               className="invoiceCRM-manage-btn"
//               onClick={handlePrev}
//               disabled={invoiceCurrentPage === 1}
//             >
//               Prev
//             </button>
//             <nav className="invoiceCRM-num-page">
//               Page {invoiceCurrentPage} of {totalPages}
//             </nav>
//             <button
//               className="invoiceCRM-manage-btn"
//               onClick={handleNext}
//               disabled={invoiceCurrentPage === totalPages}
//             >
//               Next
//             </button>
//           </div>
//         </nav>
//       </div>
//     </>
//   );
// }
// import React, { useState, useEffect } from "react";
// import "./invoiceCRM.css";
// import useInvoiceStore from "./invoiceStore";

// export default function InvoiceCRM({ setCurrentPage }) {

//   // =====================================================
//   // ZUSTAND STORE
//   // =====================================================
//   const {
//     invoices,
//     loading,
//     currentPage,
//     totalPages,
//     search,
//     setSearch,
//     fetchInvoices,
//     deleteInvoice,
//   } = useInvoiceStore();

//   // =====================================================
//   // LOCAL STATE
//   // =====================================================
//   const [filter, setFilter] = useState({
//     invoice_status: "",
//     payment_status: "",
//     invoice_from_date: "",
//     invoice_to_date: "",
//   });

//   // Delete modal state
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteInvoiceData, setDeleteInvoiceData] = useState(null);

//   // =====================================================
//   // FETCH ON MOUNT
//   // =====================================================
//   useEffect(() => {
//     fetchInvoices(1, "");
//   }, []);

//   // =====================================================
//   // SEARCH HANDLER
//   // =====================================================
//   const handleSearch = (e) => {
//     const value = e.target.value;
//     setSearch(value);
//     fetchInvoices(1, value);
//   };

//   // =====================================================
//   // PAGINATION HANDLERS
//   // =====================================================
//   const handleNext = () => {
//     if (currentPage < totalPages) fetchInvoices(currentPage + 1, search);
//   };

//   const handlePrev = () => {
//     if (currentPage > 1) fetchInvoices(currentPage - 1, search);
//   };

//   // =====================================================
//   // FILTER HANDLER
//   // =====================================================
//   const handleClearFilter = () => {
//     setFilter({
//       invoice_status: "",
//       payment_status: "",
//       invoice_from_date: "",
//       invoice_to_date: "",
//     });
//   };

//   // =====================================================
//   // DELETE HANDLERS
//   // =====================================================
//   const handleDeleteClick = (row) => {
//     setDeleteInvoiceData(row);
//     setShowDeleteModal(true);
//   };

//   const confirmDelete = async () => {
//     if (!deleteInvoiceData) return;
//     await deleteInvoice(deleteInvoiceData.invoice_id);
//     fetchInvoices(currentPage, search);
//     setShowDeleteModal(false);
//     setDeleteInvoiceData(null);
//   };

//   // =====================================================
//   // CLIENT-SIDE FILTERING
//   // =====================================================
//   const filteredData = (Array.isArray(invoices) ? invoices : []).filter((item) => {
//     const matchStatus = filter.invoice_status
//       ? item.status === filter.invoice_status
//       : true;
//     const matchPayment = filter.payment_status
//       ? item.payment_status === filter.payment_status
//       : true;
//     const matchFrom = filter.invoice_from_date
//       ? new Date(item.invoice_date) >= new Date(filter.invoice_from_date)
//       : true;
//     const matchTo = filter.invoice_to_date
//       ? new Date(item.invoice_date) <= new Date(filter.invoice_to_date)
//       : true;
//     const matchSearch =
//       !search ||
//       item.invoice_id?.toLowerCase().includes(search.toLowerCase()) ||
//       item.customer_name?.toLowerCase().includes(search.toLowerCase());
//     return matchStatus && matchPayment && matchFrom && matchTo && matchSearch;
//   });

//   // =====================================================
//   // RENDER
//   // =====================================================
//   return (
//     <>
//       {/* ================================================ */}
//       {/* DELETE CONFIRMATION MODAL                         */}
//       {/* ================================================ */}
//       {showDeleteModal && (
//         <div
//           className="invoiceCRM-delete-modal"
//           style={{
//             maxWidth: "420px",
//             width: "100%",
//             paddingBottom: "10px",
//             height: "auto",
//             minHeight: "unset",
//           }}
//         >
//           <svg
//             className="invoiceCRM-close-icon"
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 384 512"
//             onClick={() => setShowDeleteModal(false)}
//             style={{ cursor: "pointer" }}
//           >
//             <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 
//             0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 
//             0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 
//             12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 
//             0L192 301.3 297.4 406.6c12.5 12.5 
//             32.8 12.5 45.3 0s12.5-32.8 
//             0-45.3L237.3 256 342.6 150.6z" />
//           </svg>

//           <div className="invoiceCRM-modal-head">
//             <p>Delete Invoice</p>
//           </div>

//           <div
//             className="invoiceCRM-modal-body"
//             style={{ padding: "16px 20px", height: "auto" }}
//           >
//             <p
//               style={{
//                 textAlign: "center",
//                 fontSize: "15px",
//                 lineHeight: "22px",
//                 marginBottom: "20px",
//               }}
//             >
//               Are you sure you want to delete invoice <br />
//               <strong>{deleteInvoiceData?.invoice_id}</strong>
//               <br />
//               (Customer: {deleteInvoiceData?.customer_name})?
//             </p>

//             <div
//               className="invoiceCRM-modal-actions"
//               style={{ justifyContent: "center", gap: "14px" }}
//             >
//               <button
//                 type="button"
//                 className="invoiceCRM-cancel-btn"
//                 onClick={() => setShowDeleteModal(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 className="invoiceCRM-delete-btn"
//                 onClick={confirmDelete}
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ================================================ */}
//       {/* MAIN CONTENT                                      */}
//       {/* ================================================ */}
//       <div className={`invoiceCRM-container ${showDeleteModal ? "blur" : ""}`}>

//         {/* HEADER */}
//         <div className="invoiceCRM-header">
//           <p>Invoice List</p>
//           <button onClick={() => setCurrentPage("createNewInvoice")}>
//             + New Invoice
//           </button>
//         </div>

//         {/* SEARCH BOX */}
//         <div className="invoiceCRM-search-box">
//           <label htmlFor="searchByID">
//             <svg
//               className="invoiceCRM-search-logo"
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 512 512"
//             >
//               <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
//             </svg>
//           </label>
//           <input
//             id="searchByID"
//             placeholder="Search by Invoice ID, Customer name...."
//             value={search}
//             onChange={handleSearch}
//           />
//         </div>

//         {/* CLEAR FILTER */}
//         <div className="invoiceCRM-clearfilter">
//           <p onClick={handleClearFilter}>Clear Filter</p>
//         </div>

//         {/* FILTERS */}
//         <div className="invoiceCRM-search-category">

//           {/* Invoice Status Filter */}
//           <div className="invoiceCRM-input-box">
//             <label htmlFor="invoice_status">Invoice Status</label>
//             <select
//               value={filter.invoice_status}
//               onChange={(e) =>
//                 setFilter((prev) => ({ ...prev, invoice_status: e.target.value }))
//               }
//               id="invoice_status"
//             >
//               <option value="">All</option>
//               <option value="Draft">Draft</option>
//               <option value="Send">Send</option>
//               <option value="Paid">Paid</option>
//               <option value="Overdue">Overdue</option>
//               <option value="Cancelled">Cancelled</option>
//             </select>
//           </div>

//           {/* Payment Status Filter */}
//           <div className="invoiceCRM-input-box">
//             <label htmlFor="payment_status">Payment Status</label>
//             <select
//               id="payment_status"
//               value={filter.payment_status}
//               onChange={(e) =>
//                 setFilter((prev) => ({ ...prev, payment_status: e.target.value }))
//               }
//             >
//               <option value="">All Types</option>
//               <option value="Paid">Paid</option>
//               <option value="Partial">Partial</option>
//               <option value="Unpaid">Unpaid</option>
//             </select>
//           </div>

//           {/* Date Range Filter */}
//           <div className="invoiceCRM-input-box">
//             <label htmlFor="invoice_date">Invoice Date</label>
//             <nav id="invoice_date">
//               <div>
//                 <span>From </span>
//                 <input
//                   value={filter.invoice_from_date}
//                   onChange={(e) =>
//                     setFilter((prev) => ({
//                       ...prev,
//                       invoice_from_date: e.target.value,
//                     }))
//                   }
//                   className="invoiceCRM-date"
//                   type="date"
//                 />
//               </div>
//               <div>
//                 <span>To </span>
//                 <input
//                   value={filter.invoice_to_date}
//                   onChange={(e) =>
//                     setFilter((prev) => ({
//                       ...prev,
//                       invoice_to_date: e.target.value,
//                     }))
//                   }
//                   className="invoiceCRM-date"
//                   type="date"
//                 />
//               </div>
//             </nav>
//           </div>
//         </div>

//         {/* TABLE */}
//         <div className="invoiceCRM-table-cointainer">
//           <table>
//             <thead className="invoiceCRM-table-head">
//               <tr>
//                 <th></th>
//                 <th><pre>Invoice ID</pre></th>
//                 <th><pre>Sales Order Ref.</pre></th>
//                 <th><pre>Customer Name</pre></th>
//                 <th><pre>Invoice Date</pre></th>
//                 <th><pre>Due Date</pre></th>
//                 <th>
//                   <div className="invoiceCRM-status-filter">
//                     Status
//                     <nav className="invoiceCRM-filter-box">
//                       <p>Newest First</p>
//                       <p>Oldest First</p>
//                       <p>Progressing {`(Draft → Cancelled)`}</p>
//                       <p>Reverse Progressing{`(Cancelled → Draft)`}</p>
//                     </nav>
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="14"
//                       height="18"
//                       viewBox="0 0 14 18"
//                       fill="none"
//                     >
//                       <path
//                         d="M3.66683 12.3346H0.333496L5.3335 17.3346V0.667969H3.66683V12.3346ZM8.66683 3.16797V17.3346H10.3335V5.66797H13.6668L8.66683 0.667969V3.16797Z"
//                         fill="#234E70"
//                       />
//                     </svg>
//                   </div>
//                 </th>
//                 <th><pre>Payment Status</pre></th>
//                 <th>Action</th>
//               </tr>
//             </thead>

//             <tbody className="invoiceCRM-table-body">
//               {loading ? (
//                 <tr>
//                   <td colSpan={9} style={{ textAlign: "center" }}>
//                     Loading...
//                   </td>
//                 </tr>
//               ) : filteredData.length > 0 ? (
//                 filteredData.map((ele, ind) => (
//                   <tr key={ind}>
//                     <td>
//                       <input className="invoiceCRM-table-check" type="checkbox" />
//                     </td>
//                     <td>{ele.invoice_id}</td>
//                     <td>{ele.sales_order_ref}</td>
//                     <td>{ele.customer_name}</td>
//                     <td><pre>{ele.invoice_date}</pre></td>
//                     <td><pre>{ele.due_date}</pre></td>
//                     <td>
//                       <p
//                         className={`invoiceCRM-Status ${
//                           ele.status === "Draft"
//                             ? "invoiceCRM-Status-draft"
//                             : ele.status === "Send"
//                             ? "invoiceCRM-Status-Send"
//                             : ele.status === "Cancelled"
//                             ? "invoiceCRM-Status-Cancelled"
//                             : ele.status === "Paid"
//                             ? "invoiceCRM-Status-Paid"
//                             : ele.status === "Overdue"
//                             ? "invoiceCRM-Status-Overdue"
//                             : ""
//                         }`}
//                       >
//                         {ele.status}
//                       </p>
//                     </td>
//                     <td>
//                       <p
//                         className={
//                           ele.payment_status === "Paid"
//                             ? "invoiceCRM-Paid"
//                             : ele.payment_status === "Unpaid"
//                             ? "invoiceCRM-Unpaid"
//                             : ele.payment_status === "Partial"
//                             ? "invoiceCRM-Partial"
//                             : ""
//                         }
//                       >
//                         {ele.payment_status === "" ? "-" : ele.payment_status}
//                       </p>
//                     </td>
//                     <td id="invoiceCRM-table-action">
//                       <nav className="invoiceCRM-dot-container">
//                         <button onClick={() => setCurrentPage("editInvoice")}>
//                           {ele.status === "Draft" ? "Edit" : "View"} details
//                         </button>
//                         <button
//                           disabled={
//                             ele.status === "Draft" || ele.status === "Cancelled"
//                           }
//                         >
//                           Generate Invoice Return
//                         </button>
//                         <button
//                           onClick={() => handleDeleteClick(ele)}
//                           style={{ color: "red" }}
//                         >
//                           Delete
//                         </button>
//                       </nav>
//                       <svg
//                         className="invoiceCRM-delete-logo"
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
//               ) : (
//                 <tr>
//                   <td colSpan={9} style={{ textAlign: "center" }}>
//                     No Data Found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* PAGINATION */}
//         <nav className="invoiceCRM-table-bottem">
//           <p className="invoiceCRM-num-entries">
//             Showing {filteredData.length} entries
//           </p>
//           <div className="invoiceCRM-manage-control-box">
//             <button
//               className="invoiceCRM-manage-btn"
//               onClick={handlePrev}
//               disabled={currentPage <= 1}
//             >
//               Prev
//             </button>
//             <nav className="invoiceCRM-num-page">
//               Page {currentPage} of {totalPages}
//             </nav>
//             <button
//               className="invoiceCRM-manage-btn"
//               onClick={handleNext}
//               disabled={currentPage >= totalPages}
//             >
//               Next
//             </button>
//           </div>
//         </nav>

//       </div>
//     </>
//   );
// }
import React, { useState, useEffect } from "react";
import "./invoiceCRM.css";
import useInvoiceStore from "./invoiceStore";

export default function InvoiceCRM({ setCurrentPage }) {
  const {
    invoices, loading, currentPage, totalPages,
    search, setSearch, fetchInvoices, deleteInvoice,
  } = useInvoiceStore();

  const [filter, setFilter] = useState({
    invoice_status: "", payment_status: "",
    invoice_from_date: "", invoice_to_date: "",
  });
  const [showDeleteModal,   setShowDeleteModal]   = useState(false);
  const [deleteInvoiceData, setDeleteInvoiceData] = useState(null);
  const [openMenuId,        setOpenMenuId]        = useState(null);

  useEffect(() => { fetchInvoices(1, ""); }, []);

  useEffect(() => {
    const close = () => setOpenMenuId(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const handleSearch = (e) => {
    const v = e.target.value;
    setSearch(v);
    fetchInvoices(1, v);
  };

  const handleNext = () => { if (currentPage < totalPages) fetchInvoices(currentPage + 1, search); };
  const handlePrev = () => { if (currentPage > 1) fetchInvoices(currentPage - 1, search); };

  const handleDeleteClick = (row) => {
    setOpenMenuId(null);
    setDeleteInvoiceData(row);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteInvoiceData) return;
    await deleteInvoice(deleteInvoiceData.id || deleteInvoiceData.invoice_id);
    fetchInvoices(currentPage, search);
    setShowDeleteModal(false);
    setDeleteInvoiceData(null);
  };

  const filteredData = (Array.isArray(invoices) ? invoices : []).filter((item) => {
    const matchStatus  = filter.invoice_status  ? item.invoice_status  === filter.invoice_status  : true;
    const matchPayment = filter.payment_status  ? item.payment_status  === filter.payment_status  : true;
    const matchFrom    = filter.invoice_from_date
      ? new Date(item.invoice_date) >= new Date(filter.invoice_from_date) : true;
    const matchTo      = filter.invoice_to_date
      ? new Date(item.invoice_date) <= new Date(filter.invoice_to_date)   : true;
    const matchSearch  = !search ||
      item.invoice_id?.toLowerCase().includes(search.toLowerCase()) ||
      item.customer_name?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchPayment && matchFrom && matchTo && matchSearch;
  });

  return (
    <>
      {/* ── Delete Modal ──────────────────────────────────────────── */}
      {showDeleteModal && (
        <>
          <div onClick={() => setShowDeleteModal(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 999 }} />
          <div style={{
            position: "fixed", top: "50%", left: "50%",
            transform: "translate(-50%,-50%)", background: "#fff",
            borderRadius: "10px", width: "400px", padding: "28px 24px",
            zIndex: 1000, boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          }}>
            <p style={{ fontWeight: 600, fontSize: "17px", textAlign: "center", marginBottom: "14px" }}>
              Delete Invoice
            </p>
            <p style={{ textAlign: "center", fontSize: "14px", lineHeight: "22px", marginBottom: "24px", color: "#444" }}>
              Are you sure you want to delete <br />
              <strong>{deleteInvoiceData?.invoice_id}</strong><br />
              <span style={{ color: "#888" }}>Customer: {deleteInvoiceData?.customer_name}</span>
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
              <button onClick={() => setShowDeleteModal(false)}
                style={{ padding: "8px 24px", borderRadius: "6px", border: "1px solid #ccc", background: "#f5f5f5", cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={confirmDelete}
                style={{ padding: "8px 24px", borderRadius: "6px", border: "none", background: "#e53935", color: "#fff", cursor: "pointer" }}>
                Delete
              </button>
            </div>
          </div>
        </>
      )}

      <div className="invoiceCRM-container">
        <div className="invoiceCRM-header">
          <p>Invoice List</p>
          {/* ✅ create — no data */}
          <button onClick={() => setCurrentPage("invoiceForm", null)}>
            + New Invoice
          </button>
        </div>

        <div className="invoiceCRM-search-box">
          <label htmlFor="searchByID">
            <svg className="invoiceCRM-search-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
            </svg>
          </label>
          <input id="searchByID" placeholder="Search by Invoice ID, Customer name..." value={search} onChange={handleSearch} />
        </div>

        <div className="invoiceCRM-clearfilter">
          <p onClick={() => setFilter({ invoice_status: "", payment_status: "", invoice_from_date: "", invoice_to_date: "" })}>
            Clear Filter
          </p>
        </div>

        <div className="invoiceCRM-search-category">
          <div className="invoiceCRM-input-box">
            <label>Invoice Status</label>
            <select value={filter.invoice_status}
              onChange={(e) => setFilter((p) => ({ ...p, invoice_status: e.target.value }))}>
              <option value="">All</option>
              <option value="Draft">Draft</option>
              <option value="Sent">Sent</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="invoiceCRM-input-box">
            <label>Payment Status</label>
            <select value={filter.payment_status}
              onChange={(e) => setFilter((p) => ({ ...p, payment_status: e.target.value }))}>
              <option value="">All</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
          <div className="invoiceCRM-input-box">
            <label>Invoice Date</label>
            <nav id="invoice_date">
              <div>
                <span>From </span>
                <input className="invoiceCRM-date" type="date" value={filter.invoice_from_date}
                  onChange={(e) => setFilter((p) => ({ ...p, invoice_from_date: e.target.value }))} />
              </div>
              <div>
                <span>To </span>
                <input className="invoiceCRM-date" type="date" value={filter.invoice_to_date}
                  onChange={(e) => setFilter((p) => ({ ...p, invoice_to_date: e.target.value }))} />
              </div>
            </nav>
          </div>
        </div>

        <div className="invoiceCRM-table-cointainer">
          <table>
            <thead className="invoiceCRM-table-head">
              <tr>
                <th>Invoice ID</th>
                <th>Sales Order Ref.</th>
                <th>Customer Name</th>
                <th>Invoice Date</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Payment Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="invoiceCRM-table-body">
              {loading ? (
                <tr><td colSpan={8} style={{ textAlign: "center", padding: "20px" }}>Loading...</td></tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((ele, ind) => (
                  <tr key={ele.id || ind}>
                    <td>{ele.invoice_id}</td>
                    <td>{ele.sales_order?.sales_order_id || "—"}</td>
                    <td>{ele.customer?.first_name
                      ? `${ele.customer.first_name} ${ele.customer.last_name || ""}`.trim()
                      : ele.customer_name || "—"}</td>
                    <td>{ele.invoice_date}</td>
                    <td>{ele.due_date}</td>
                    <td>
                      <p className={`invoiceCRM-Status ${
                        ele.invoice_status === "Draft"      ? "invoiceCRM-Status-draft"     :
                        ele.invoice_status === "Sent"       ? "invoiceCRM-Status-Send"      :
                        ele.invoice_status === "Paid"       ? "invoiceCRM-Status-Paid"      :
                        ele.invoice_status === "Overdue"    ? "invoiceCRM-Status-Overdue"   :
                        ele.invoice_status === "Cancelled"  ? "invoiceCRM-Status-Cancelled" : ""
                      }`}>{ele.invoice_status}</p>
                    </td>
                    <td>
                      <p className={
                        ele.payment_status === "Paid"    ? "invoiceCRM-Paid"    :
                        ele.payment_status === "Unpaid"  ? "invoiceCRM-Unpaid"  :
                        ele.payment_status === "Partial" ? "invoiceCRM-Partial" : ""
                      }>{ele.payment_status || "—"}</p>
                    </td>
                    <td style={{ position: "relative", textAlign: "center" }}>
                      <div
                        onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === ele.id ? null : ele.id); }}
                        style={{
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer",
                          background: openMenuId === ele.id ? "#f0f0f0" : "transparent",
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                          style={{ width: "18px", height: "18px", fill: "#555" }}>
                          <path d="M12 16C12.5304 16 13.0391 16.2107 13.4142 16.5858C13.7893 16.9609 14 17.4696 14 18C14 18.5304 13.7893 19.0391 13.4142 19.4142C13.0391 19.7893 12.5304 20 12 20C11.4696 20 10.9609 19.7893 10.5858 19.4142C10.2107 19.0391 10 18.5304 10 18C10 17.4696 10.2107 16.9609 10.5858 16.5858C10.9609 16.2107 11.4696 16 12 16ZM12 10C12.5304 10 13.0391 10.2107 13.4142 10.5858C13.7893 10.9609 14 11.4696 14 12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14C11.4696 14 10.9609 13.7893 10.5858 13.4142C10.2107 13.0391 10 12.5304 10 12C10 11.4696 10.2107 10.9609 10.5858 10.5858C10.9609 10.2107 11.4696 10 12 10ZM12 4C12.5304 4 13.0391 4.21071 13.4142 4.58579C13.7893 4.96086 14 5.46957 14 6C14 6.53043 13.7893 7.03914 13.4142 7.41421C13.0391 7.78929 12.5304 8 12 8C11.4696 8 10.9609 7.78929 10.5858 7.41421C10.2107 7.03914 10 6.53043 10 6C10 5.46957 10.2107 4.96086 10.5858 4.58579C10.9609 4.21071 11.4696 4 12 4Z" />
                        </svg>
                      </div>

                      {openMenuId === ele.id && (
                        <div onClick={(e) => e.stopPropagation()} style={{
                          position: "absolute", top: "38px", right: "8px",
                          background: "#fff", border: "1px solid #e0e0e0",
                          borderRadius: "8px", boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                          zIndex: 999, minWidth: "180px", overflow: "hidden",
                        }}>
                          {/* ✅ edit — pass full row */}
                          <div
                            onClick={() => { setOpenMenuId(null); setCurrentPage("invoiceForm", ele); }}
                            style={{ padding: "10px 16px", cursor: "pointer", fontSize: "14px", color: "#333" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            {ele.invoice_status === "Draft" ? "✏️ Edit" : "👁️ View"} Details
                          </div>
                          <div style={{ height: "1px", background: "#f0f0f0" }} />
                          <div
                            onClick={() => {
                              if (!["Draft", "Cancelled"].includes(ele.invoice_status)) {
                                setOpenMenuId(null);
                                setCurrentPage("invoiceReturnCRM");
                              }
                            }}
                            style={{
                              padding: "10px 16px", fontSize: "14px",
                              cursor: !["Draft", "Cancelled"].includes(ele.invoice_status) ? "pointer" : "not-allowed",
                              color:  !["Draft", "Cancelled"].includes(ele.invoice_status) ? "#333"    : "#bbb",
                            }}
                            onMouseEnter={(e) => {
                              if (!["Draft","Cancelled"].includes(ele.invoice_status))
                                e.currentTarget.style.background = "#f5f5f5";
                            }}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            🔄 Generate Invoice Return
                          </div>
                          <div style={{ height: "1px", background: "#f0f0f0" }} />
                          <div
                            onClick={() => handleDeleteClick(ele)}
                            style={{ padding: "10px 16px", cursor: "pointer", fontSize: "14px", color: "#e53935" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#fff5f5")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            🗑️ Delete
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={8} style={{ textAlign: "center", padding: "20px" }}>No Data Found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <nav className="invoiceCRM-table-bottem">
          <p className="invoiceCRM-num-entries">Showing {filteredData.length} entries</p>
          <div className="invoiceCRM-manage-control-box">
            <button className="invoiceCRM-manage-btn" onClick={handlePrev} disabled={currentPage <= 1}>Prev</button>
            <nav className="invoiceCRM-num-page">Page {currentPage} of {totalPages}</nav>
            <button className="invoiceCRM-manage-btn" onClick={handleNext} disabled={currentPage >= totalPages}>Next</button>
          </div>
        </nav>
      </div>
    </>
  );
}