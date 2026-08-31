// // import React, { useState, useEffect } from "react";
// // import "./salesCRM.css";
// // import { useNavigate } from "react-router-dom";
// // import useSalesOrderStore from "./salesOrderStore";

// // export default function SalesCRM({ setCurrentPage }) {
// //   const navigate = useNavigate();

// //   // =====================================================
// //   // ZUSTAND STORE
// //   // =====================================================
// //   const {
// //     salesOrders,
// //     loading,
// //     currentPage,
// //     totalPages,
// //     search,
// //     setSearch,
// //     fetchSalesOrders,
// //     deleteSalesOrder,
// //   } = useSalesOrderStore();

// //   // =====================================================
// //   // LOCAL STATE
// //   // =====================================================
// //   const [filter, setFilter] = useState({
// //     status: "",
// //     order: "",
// //     sales_rep: "",
// //   });

// //   const [salesRepList, setSalesRepList] = useState([]);

// //   const [buttonAct, setButtonAct] = useState({
// //     chechbox: {},
// //     purchase_order: false,
// //     delivery: false,
// //     invoice: false,
// //   });

// //   const [showDeleteModal, setShowDeleteModal] = useState(false);
// //   const [deleteOrderData, setDeleteOrderData] = useState(null);

// //   // =====================================================
// //   // FETCH ON MOUNT
// //   // =====================================================
// //   useEffect(() => {
// //     fetchSalesOrders(1, "");
// //   }, []);

// //   // =====================================================
// //   // EXTRACT UNIQUE SALES REPS FROM API DATA
// //   // =====================================================
// //   useEffect(() => {
// //     if (salesOrders.length > 0) {
// //       const uniqueReps = [
// //         ...new Set(salesOrders.map((o) => o.sales_rep).filter(Boolean)),
// //       ];
// //       setSalesRepList(uniqueReps);
// //     }
// //   }, [salesOrders]);

// //   // =====================================================
// //   // CHECKBOX BUTTON LOGIC
// //   // =====================================================
// //   useEffect(() => {
// //     const selectedOrders = salesOrders.filter(
// //       (order) => buttonAct.chechbox[order.sales_order_id]
// //     );
// //     const hasMultiple = selectedOrders.length > 1;

// //     const firstCustomer = selectedOrders[0]?.customer_name;
// //     const sameCustomer =
// //       hasMultiple &&
// //       selectedOrders.every((order) => order.customer_name === firstCustomer);

// //     const generateDelivery =
// //       hasMultiple &&
// //       selectedOrders.every(
// //         (order) =>
// //           order.status === "Submitted" || order.status === "Submitted(PD)"
// //       );

// //     const generateInvoice =
// //       hasMultiple &&
// //       selectedOrders.every((order) => order.status === "Submitted");

// //     const allValidForPO =
// //       hasMultiple &&
// //       selectedOrders.every(
// //         (order) =>
// //           (order.status === "Draft" &&
// //             order.purchase_order !== "Purchase Ordered") ||
// //           (order.status === "Submitted(PD)" &&
// //             order.purchase_order !== "Purchase Ordered")
// //       );

// //     setButtonAct((prev) => ({
// //       ...prev,
// //       delivery: selectedOrders.length > 0 && sameCustomer && generateDelivery,
// //       invoice: selectedOrders.length > 0 && sameCustomer && generateInvoice,
// //       purchase_order:
// //         selectedOrders.length > 0 && !sameCustomer && allValidForPO,
// //     }));
// //   }, [buttonAct.chechbox, salesOrders]);

// //   // =====================================================
// //   // HANDLERS
// //   // =====================================================
// //   const handlecheckbox = (e, ele) => {
// //     const { checked } = e.target;
// //     setButtonAct((prev) => ({
// //       ...prev,
// //       chechbox: {
// //         ...prev.chechbox,
// //         [ele.sales_order_id]: checked,
// //       },
// //     }));
// //   };

// //   const handleClearFilter = () => {
// //     setFilter({ status: "", order: "", sales_rep: "" });
// //   };

// //   const handleDeleteClick = (row) => {
// //     setDeleteOrderData(row);
// //     setShowDeleteModal(true);
// //   };

// //   const confirmDelete = async () => {
// //     if (!deleteOrderData) return;
// //     await deleteSalesOrder(deleteOrderData.sales_order_id);
// //     fetchSalesOrders(currentPage, search);
// //     setShowDeleteModal(false);
// //     setDeleteOrderData(null);
// //   };

// //   // =====================================================
// //   // CLIENT-SIDE FILTERING
// //   // =====================================================
// //   const filteredData = salesOrders.filter((item) => {
// //     const matchStatus = filter.status ? item.status === filter.status : true;
// //     const matchOrder = filter.order ? item.order_type === filter.order : true;
// //     const matchRep = filter.sales_rep
// //       ? item.sales_rep === filter.sales_rep
// //       : true;
// //     const matchSearch =
// //       !search ||
// //       item.sales_order_id?.toLowerCase().includes(search.toLowerCase()) ||
// //       item.customer_name?.toLowerCase().includes(search.toLowerCase());
// //     return matchStatus && matchOrder && matchRep && matchSearch;
// //   });

// //   // =====================================================
// //   // PAGINATION
// //   // =====================================================
// //   const handleNext = () => {
// //     if (currentPage < totalPages) fetchSalesOrders(currentPage + 1, search);
// //   };
// //   const handlePrev = () => {
// //     if (currentPage > 1) fetchSalesOrders(currentPage - 1, search);
// //   };

// //   // =====================================================
// //   // RENDER
// //   // =====================================================
// //   return (
// //     <>
// //       {/* ================================================ */}
// //       {/* DELETE CONFIRMATION MODAL                         */}
// //       {/* ================================================ */}
// //       {showDeleteModal && (
// //         <div
// //           className="salesCRM-delete-modal"
// //           style={{ maxWidth: "420px", width: "100%", height: "auto" }}
// //         >
// //           <svg
// //             className="salesCRM-close-icon"
// //             xmlns="http://www.w3.org/2000/svg"
// //             viewBox="0 0 384 512"
// //             onClick={() => setShowDeleteModal(false)}
// //             style={{ cursor: "pointer" }}
// //           >
// //             <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 
// //             0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 
// //             0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 
// //             12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 
// //             0L192 301.3 297.4 406.6c12.5 12.5 
// //             32.8 12.5 45.3 0s12.5-32.8 
// //             0-45.3L237.3 256 342.6 150.6z" />
// //           </svg>
// //           <div className="salesCRM-modal-head">
// //             <p>Delete Sales Order</p>
// //           </div>
// //           <div
// //             className="salesCRM-modal-body"
// //             style={{ padding: "16px 20px", height: "auto" }}
// //           >
// //             <p
// //               style={{
// //                 textAlign: "center",
// //                 fontSize: "15px",
// //                 lineHeight: "22px",
// //                 marginBottom: "20px",
// //               }}
// //             >
// //               Are you sure you want to delete sales order <br />
// //               <strong>{deleteOrderData?.sales_order_id}</strong>
// //               <br />
// //               (Customer: {deleteOrderData?.customer_name})?
// //             </p>
// //             <div
// //               className="salesCRM-modal-actions"
// //               style={{ justifyContent: "center", gap: "14px" }}
// //             >
// //               <button
// //                 type="button"
// //                 className="salesCRM-cancel-btn"
// //                 onClick={() => setShowDeleteModal(false)}
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 type="button"
// //                 className="salesCRM-delete-btn"
// //                 onClick={confirmDelete}
// //               >
// //                 Delete
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* ================================================ */}
// //       {/* MAIN CONTENT                                      */}
// //       {/* ================================================ */}
// //       <div className={`salesCRM-container ${showDeleteModal ? "blur" : ""}`}>
// //         <div className="salesCRM-header">
// //           <p>Sales Order</p>
// //           <button onClick={() => setCurrentPage("createNewSales")}>
// //             + New Sales Order
// //           </button>
// //         </div>

// //         {/* SEARCH */}
// //         <div className="salesCRM-search-box">
// //           <label htmlFor="searchByID">
// //             <svg
// //               className="salesCRM-search-logo"
// //               xmlns="http://www.w3.org/2000/svg"
// //               viewBox="0 0 512 512"
// //             >
// //               <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
// //             </svg>
// //           </label>
// //           <input
// //             id="searchByID"
// //             placeholder="Search by ID, Name..."
// //             value={search}
// //             onChange={(e) => {
// //               setSearch(e.target.value);
// //               fetchSalesOrders(1, e.target.value);
// //             }}
// //           />
// //         </div>

// //         {/* FILTERS */}
// //         <div className="salesCRM-clearfilter">
// //           <p onClick={handleClearFilter}>Clear Filter</p>
// //         </div>
// //         <div className="salesCRM-search-category">
// //           <div className="salesCRM-input-box">
// //             <label htmlFor="status">Status</label>
// //             <select
// //               id="status"
// //               value={filter.status}
// //               onChange={(e) =>
// //                 setFilter((prev) => ({ ...prev, status: e.target.value }))
// //               }
// //             >
// //               <option value="">All Statuses</option>
// //               <option value="Draft">Draft</option>
// //               <option value="Submitted">Submitted</option>
// //               <option value="Submitted(PD)">Submitted(PD)</option>
// //               <option value="Delivered">Delivered</option>
// //               <option value="Partially Delivered">Partially Delivered</option>
// //               <option value="Cancelled">Cancelled</option>
// //             </select>
// //           </div>
// //           <div className="salesCRM-input-box">
// //             <label htmlFor="order_type">Order Type</label>
// //             <select
// //               id="order_type"
// //               value={filter.order}
// //               onChange={(e) =>
// //                 setFilter((prev) => ({ ...prev, order: e.target.value }))
// //               }
// //             >
// //               <option value="">All Types</option>
// //               <option value="Standard">Standard</option>
// //               <option value="Rush">Rush</option>
// //               <option value="Backorder">Backorder</option>
// //             </select>
// //           </div>
// //           <div className="salesCRM-input-box">
// //             <label htmlFor="sales_rep">Sales Rep</label>
// //             <select
// //               id="sales_rep"
// //               value={filter.sales_rep}
// //               onChange={(e) =>
// //                 setFilter((prev) => ({ ...prev, sales_rep: e.target.value }))
// //               }
// //             >
// //               <option value="">All</option>
// //               {salesRepList.map((rep, ind) => (
// //                 <option key={ind} value={rep}>
// //                   {rep}
// //                 </option>
// //               ))}
// //             </select>
// //           </div>
// //         </div>

// //         {/* BULK ACTION BUTTONS */}
// //         <div className="salesCRM-table-title">
// //           <p>Select orders to enable actions</p>
// //           <nav>
// //             <button
// //               className={
// //                 buttonAct.purchase_order
// //                   ? "salesCRM-active-btn"
// //                   : "salesCRM-inactive-btn"
// //               }
// //               disabled={!buttonAct.purchase_order}
// //               onClick={() => setCurrentPage("createNewPurchase")}
// //             >
// //               Generate Purchase order
// //             </button>
// //             <button
// //               className={
// //                 buttonAct.delivery
// //                   ? "salesCRM-active-btn"
// //                   : "salesCRM-inactive-btn"
// //               }
// //               disabled={!buttonAct.delivery}
// //               onClick={() => setCurrentPage("createNewDelivery")}
// //             >
// //               Generate Delivery Note
// //             </button>
// //             <button
// //               className={
// //                 buttonAct.invoice
// //                   ? "salesCRM-active-btn"
// //                   : "salesCRM-inactive-btn"
// //               }
// //               disabled={!buttonAct.invoice}
// //               onClick={() => setCurrentPage("createNewInvoice")}
// //             >
// //               Generate Invoice
// //             </button>
// //           </nav>
// //         </div>

// //         {/* TABLE */}
// //         <div className="salesCRM-table-cointainer">
// //           {loading ? (
// //             <p style={{ textAlign: "center", padding: "20px" }}>Loading...</p>
// //           ) : (
// //             <table>
// //               <thead className="salesCRM-table-head">
// //                 <tr>
// //                   <th></th>
// //                   <th className="salesCRM-table-maxwidth">Sales Order ID</th>
// //                   <th className="salesCRM-table-minwidth">Order Type</th>
// //                   <th className="salesCRM-table-largwidth">Customer Name</th>
// //                   <th className="salesCRM-table-minwidth">Sales Rep</th>
// //                   <th className="salesCRM-table-minwidth">Order Date</th>
// //                   <th>
// //                     <div className="salesCRM-status-filter">
// //                       Status
// //                       <nav className="salesCRM-filter-box">
// //                         <p>Newest First</p>
// //                         <p>Oldest First</p>
// //                         <p>Progressing {`(Draft → Cancelled)`}</p>
// //                         <p>Reverse Progressing{`(Cancelled → Draft)`}</p>
// //                       </nav>
// //                       <svg
// //                         className="salesCRM-status-filter-logo"
// //                         xmlns="http://www.w3.org/2000/svg"
// //                         width="14"
// //                         height="18"
// //                         viewBox="0 0 14 18"
// //                         fill="none"
// //                       >
// //                         <path
// //                           d="M3.66683 12.3346H0.333496L5.3335 17.3346V0.667969H3.66683V12.3346ZM8.66683 3.16797V17.3346H10.3335V5.66797H13.6668L8.66683 0.667969V3.16797Z"
// //                           fill="#234E70"
// //                         />
// //                       </svg>
// //                     </div>
// //                   </th>
// //                   <th className="salesCRM-table-minwidth">Stock status</th>
// //                   <th className="salesCRM-table-minwidth">Grand Total</th>
// //                   <th>Action</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="salesCRM-table-body">
// //                 {filteredData.length > 0 ? (
// //                   filteredData.map((ele, ind) => (
// //                     <tr key={ind}>
// //                       <td>
// //                         <input
// //                           className="salesCRM-table-check"
// //                           type="checkbox"
// //                           onChange={(e) => handlecheckbox(e, ele)}
// //                           checked={!!buttonAct.chechbox[ele.sales_order_id]}
// //                         />
// //                       </td>

// //                       {/* SALES ORDER ID + PURCHASE TAG */}
// //                       <td>
// //                         <div className="salesCRM-table-tag-container">
// //                           <nav className="salesCRM-table-hoverON">
// //                             <svg
// //                               className={
// //                                 ele.purchase_order === "Purchase Ordered"
// //                                   ? "salesCRM-purchase-order-tag"
// //                                   : ele.purchase_order ===
// //                                     "Purchase Ordered(PP)"
// //                                   ? "salesCRM-purchase-orderPP-tag"
// //                                   : ele.purchase_order === "Ready to Submit"
// //                                   ? "salesCRM-readyTOsubmit-tag"
// //                                   : "salesCRM-purchase-tag"
// //                               }
// //                               xmlns="http://www.w3.org/2000/svg"
// //                               width="20"
// //                               height="20"
// //                               viewBox="0 0 20 20"
// //                               fill="none"
// //                             >
// //                               <path
// //                                 fillRule="evenodd"
// //                                 clipRule="evenodd"
// //                                 d="M0.123245 10.8159C0.410245 11.8189 1.18325 12.5909 2.72825 14.1359L4.55825 15.9659C7.24825 18.6569 8.59225 19.9999 10.2622 19.9999C11.9332 19.9999 13.2772 18.6559 15.9662 15.9669C18.6562 13.2769 20.0002 11.9329 20.0002 10.2619C20.0002 8.59187 18.6562 7.24687 15.9672 4.55787L14.1372 2.72787C12.5912 1.18287 11.8192 0.409866 10.8162 0.122866C9.81324 -0.165134 8.74825 0.0808662 6.61925 0.572866L5.39125 0.855866C3.59925 1.26887 2.70325 1.47587 2.08925 2.08887C1.47525 2.70187 1.27025 3.59987 0.856245 5.39087L0.572245 6.61887C0.0812454 8.74887 -0.163755 9.81287 0.123245 10.8159ZM8.12224 5.27087C8.31512 5.45687 8.469 5.67944 8.5749 5.92558C8.6808 6.17172 8.73659 6.4365 8.73902 6.70444C8.74145 6.97238 8.69046 7.23812 8.58904 7.48614C8.48763 7.73416 8.33781 7.95948 8.14833 8.14896C7.95886 8.33843 7.73354 8.48825 7.48552 8.58967C7.2375 8.69108 6.97176 8.74207 6.70382 8.73964C6.43588 8.73721 6.1711 8.68142 5.92496 8.57552C5.67882 8.46962 5.45625 8.31574 5.27025 8.12287C4.9033 7.74237 4.70039 7.23303 4.70518 6.70444C4.70998 6.17585 4.92208 5.67027 5.29587 5.29649C5.66965 4.9227 6.17523 4.7106 6.70382 4.7058C7.23241 4.70101 7.74175 4.90392 8.12224 5.27087ZM17.0502 10.0509L10.0712 17.0309C9.92973 17.1674 9.74024 17.2429 9.54359 17.2411C9.34695 17.2393 9.15887 17.1604 9.01988 17.0212C8.88089 16.8821 8.8021 16.694 8.80049 16.4973C8.79887 16.3007 8.87456 16.1113 9.01124 15.9699L15.9892 8.98987C16.1299 8.84917 16.3208 8.77013 16.5197 8.77013C16.7187 8.77013 16.9095 8.84917 17.0502 8.98987C17.1909 9.13056 17.27 9.32139 17.27 9.52037C17.27 9.71934 17.1909 9.91017 17.0502 10.0509Z"
// //                               />
// //                             </svg>
// //                             <div
// //                               className={
// //                                 [
// //                                   "Purchase Ordered",
// //                                   "Purchase Ordered(PP)",
// //                                   "Ready to Submit",
// //                                 ].includes(ele.purchase_order)
// //                                   ? "salesCRM-table-hoverdata"
// //                                   : "salesCRM-table-hoverOFF"
// //                               }
// //                             >
// //                               <p>{ele.purchase_order || ""}</p>
// //                             </div>
// //                           </nav>
// //                           {ele.sales_order_id}
// //                         </div>
// //                       </td>

// //                       <td>{ele.order_type}</td>
// //                       <td>{ele.customer_name}</td>
// //                       <td>{ele.sales_rep}</td>
// //                       <td>{ele.order_date}</td>

// //                       {/* STATUS */}
// //                       <td>
// //                         <p
// //                           className={`salesCRM-Status ${
// //                             ele.status === "Draft"
// //                               ? "salesCRM-Status-draft"
// //                               : ele.status === "Submitted"
// //                               ? "salesCRM-Status-submitted"
// //                               : ele.status === "Submitted(PD)"
// //                               ? "salesCRM-Status-SubmittedPD"
// //                               : ele.status === "Delivered"
// //                               ? "salesCRM-Status-Delivered"
// //                               : ele.status === "Cancelled"
// //                               ? "salesCRM-Status-Cancelled"
// //                               : ele.status === "Partially Delivered"
// //                               ? "salesCRM-Status-partiallyDelivered"
// //                               : ""
// //                           }`}
// //                         >
// //                           {ele.status}
// //                         </p>
// //                       </td>

// //                       {/* STOCK STATUS */}
// //                       <td>
// //                         <nav
// //                           className={
// //                             ele.stock_status === "In stock"
// //                               ? "salesCRM-in-stock"
// //                               : ele.stock_status === "Insufficient Stock"
// //                               ? "salesCRM-Insufficient-Stock"
// //                               : ele.stock_status === "Waiting for Stock"
// //                               ? "salesCRM-Waiting-for-Stock"
// //                               : ele.stock_status === "Partially In Stock"
// //                               ? "salesCRM-Partially"
// //                               : ""
// //                           }
// //                         >
// //                           {ele.stock_status || "-"}
// //                         </nav>
// //                       </td>

// //                       <td>{ele.grand_total}</td>

// //                       {/* ACTION */}
// //                       <td id="salesCRM-table-action">
// //                         <nav className="salesCRM-dot-container">
// //                           <button
// //                             disabled={!ele.status}
// //                             onClick={() => {
// //                               navigate(
// //                                 `/?tab=editNewSales/${ele.sales_order_id}`
// //                               );
// //                               setCurrentPage("editNewSales");
// //                             }}
// //                           >
// //                             {ele.status === "Draft" ? "Edit" : "View"} details
// //                           </button>
// //                           <button
// //                             disabled={
// //                               !(
// //                                 (ele.status === "Draft" &&
// //                                   ele.purchase_order !== "Purchase Ordered") ||
// //                                 (ele.status === "Submitted(PD)" &&
// //                                   ele.purchase_order !== "Purchase Ordered") ||
// //                                 ele.status === "Submitted" ||
// //                                 ele.status === "Partially Delivered"
// //                               )
// //                             }
// //                             onClick={() => setCurrentPage("createNewPurchase")}
// //                           >
// //                             Generate Purchase order
// //                           </button>
// //                           <button
// //                             disabled={
// //                               ![
// //                                 "Submitted(PD)",
// //                                 "Submitted",
// //                                 "Partially Delivered",
// //                               ].includes(ele.status)
// //                             }
// //                             onClick={() => setCurrentPage("createNewDelivery")}
// //                           >
// //                             Generate Delivery Note
// //                           </button>
// //                           <button
// //                             disabled={ele.status !== "Submitted"}
// //                             onClick={() => setCurrentPage("createNewInvoice")}
// //                           >
// //                             Generate Invoice
// //                           </button>
// //                           <button
// //                             onClick={() => handleDeleteClick(ele)}
// //                             style={{ color: "red" }}
// //                           >
// //                             Delete
// //                           </button>
// //                         </nav>
// //                         <svg
// //                           className="salesCRM-delete-logo"
// //                           xmlns="http://www.w3.org/2000/svg"
// //                           width="24"
// //                           height="24"
// //                           viewBox="0 0 24 24"
// //                           fill="none"
// //                         >
// //                           <path
// //                             d="M12 16C12.5304 16 13.0391 16.2107 13.4142 16.5858C13.7893 16.9609 14 17.4696 14 18C14 18.5304 13.7893 19.0391 13.4142 19.4142C13.0391 19.7893 12.5304 20 12 20C11.4696 20 10.9609 19.7893 10.5858 19.4142C10.2107 19.0391 10 18.5304 10 18C10 17.4696 10.2107 16.9609 10.5858 16.5858C10.9609 16.2107 11.4696 16 12 16ZM12 10C12.5304 10 13.0391 10.2107 13.4142 10.5858C13.7893 10.9609 14 11.4696 14 12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14C11.4696 14 10.9609 13.7893 10.5858 13.4142C10.2107 13.0391 10 12.5304 10 12C10 11.4696 10.2107 10.9609 10.5858 10.5858C10.9609 10.2107 11.4696 10 12 10ZM12 4C12.5304 4 13.0391 4.21071 13.4142 4.58579C13.7893 4.96086 14 5.46957 14 6C14 6.53043 13.7893 7.03914 13.4142 7.41421C13.0391 7.78929 12.5304 8 12 8C11.4696 8 10.9609 7.78929 10.5858 7.41421C10.2107 7.03914 10 6.53043 10 6C10 5.46957 10.2107 4.96086 10.5858 4.58579C10.9609 4.21071 11.4696 4 12 4Z"
// //                             fill="#2A2A2A"
// //                           />
// //                         </svg>
// //                       </td>
// //                     </tr>
// //                   ))
// //                 ) : (
// //                   <tr>
// //                     <td
// //                       colSpan="10"
// //                       style={{ textAlign: "center", padding: "20px" }}
// //                     >
// //                       No Data
// //                     </td>
// //                   </tr>
// //                 )}
// //               </tbody>
// //             </table>
// //           )}
// //         </div>

// //         {/* PAGINATION */}
// //         <nav className="salesCRM-table-bottem">
// //           <p className="salesCRM-num-entries">
// //             Showing {filteredData.length} entries
// //           </p>
// //           <div className="salesCRM-manage-control-box">
// //             <button
// //               className="salesCRM-manage-btn"
// //               onClick={handlePrev}
// //               disabled={currentPage === 1}
// //             >
// //               Prev
// //             </button>
// //             <nav className="salesCRM-num-page">
// //               Page {currentPage} of {totalPages}
// //             </nav>
// //             <button
// //               className="salesCRM-manage-btn"
// //               onClick={handleNext}
// //               disabled={currentPage === totalPages}
// //             >
// //               Next
// //             </button>
// //           </div>
// //         </nav>
// //       </div>
// //     </>
// //   );
// // }
// import React, { useState, useEffect } from "react";
// import "./salesCRM.css";
// import { useNavigate } from "react-router-dom";
// import useSalesOrderStore from "./salesOrderStore";

// export default function SalesCRM({ setCurrentPage }) {
//   const navigate = useNavigate();

//   // =====================================================
//   // ZUSTAND STORE
//   // =====================================================
//   const {
//     salesOrders,
//     loading,
//     currentPage,
//     totalPages,
//     search,
//     setSearch,
//     fetchSalesOrders,
//     deleteSalesOrder,
//   } = useSalesOrderStore();

//   // =====================================================
//   // LOCAL STATE
//   // =====================================================
//   const [filter, setFilter] = useState({
//     status: "",
//     order: "",
//     sales_rep: "",
//   });

//   const [salesRepList, setSalesRepList] = useState([]);

//   const [buttonAct, setButtonAct] = useState({
//     chechbox: {},
//     purchase_order: false,
//     delivery: false,
//     invoice: false,
//   });

//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteOrderData, setDeleteOrderData] = useState(null);

//   // =====================================================
//   // FETCH ON MOUNT
//   // =====================================================
//   useEffect(() => {
//     fetchSalesOrders(1, "");
//   }, []);

//   // =====================================================
//   // EXTRACT UNIQUE SALES REPS FROM API DATA
//   // =====================================================
//   useEffect(() => {
//     if (salesOrders.length > 0) {
//       const uniqueReps = [
//         ...new Set(salesOrders.map((o) => o.sales_rep).filter(Boolean)),
//       ];
//       setSalesRepList(uniqueReps);
//     }
//   }, [salesOrders]);

//   // =====================================================
//   // CHECKBOX BUTTON LOGIC
//   // =====================================================
//   useEffect(() => {
//     const selectedOrders = salesOrders.filter(
//       (order) => buttonAct.chechbox[order.sales_order_id]
//     );
//     const hasMultiple = selectedOrders.length > 1;

//     const firstCustomer = selectedOrders[0]?.customer_name;
//     const sameCustomer =
//       hasMultiple &&
//       selectedOrders.every((order) => order.customer_name === firstCustomer);

//     const generateDelivery =
//       hasMultiple &&
//       selectedOrders.every(
//         (order) =>
//           order.status === "Submitted" || order.status === "Submitted(PD)"
//       );

//     const generateInvoice =
//       hasMultiple &&
//       selectedOrders.every((order) => order.status === "Submitted");

//     const allValidForPO =
//       hasMultiple &&
//       selectedOrders.every(
//         (order) =>
//           order.status === "Draft" ||
//           order.status === "Submitted(PD)" ||
//           order.status === "Submitted" ||
//           order.status === "Partially Delivered"
//       );

//     setButtonAct((prev) => ({
//       ...prev,
//       delivery: selectedOrders.length > 0 && sameCustomer && generateDelivery,
//       invoice: selectedOrders.length > 0 && sameCustomer && generateInvoice,
//       purchase_order:
//         selectedOrders.length > 0 && !sameCustomer && allValidForPO,
//     }));
//   }, [buttonAct.chechbox, salesOrders]);

//   // =====================================================
//   // HANDLERS
//   // =====================================================
//   const handlecheckbox = (e, ele) => {
//     const { checked } = e.target;
//     setButtonAct((prev) => ({
//       ...prev,
//       chechbox: {
//         ...prev.chechbox,
//         [ele.sales_order_id]: checked,
//       },
//     }));
//   };

//   const handleClearFilter = () => {
//     setFilter({ status: "", order: "", sales_rep: "" });
//   };

//   const handleDeleteClick = (row) => {
//     setDeleteOrderData(row);
//     setShowDeleteModal(true);
//   };

//   const confirmDelete = async () => {
//     if (!deleteOrderData) return;
//     await deleteSalesOrder(deleteOrderData.id);
//     fetchSalesOrders(currentPage, search);
//     setShowDeleteModal(false);
//     setDeleteOrderData(null);
//   };

//   // =====================================================
//   // CLIENT-SIDE FILTERING
//   // =====================================================
//   const filteredData = salesOrders.filter((item) => {
//     const matchStatus = filter.status ? item.status === filter.status : true;
//     const matchOrder  = filter.order  ? item.order_type === filter.order : true;
//     const matchRep    = filter.sales_rep ? item.sales_rep === filter.sales_rep : true;
//     const matchSearch =
//       !search ||
//       item.sales_order_id?.toLowerCase().includes(search.toLowerCase()) ||
//       item.customer_name?.toLowerCase().includes(search.toLowerCase());
//     return matchStatus && matchOrder && matchRep && matchSearch;
//   });

//   // =====================================================
//   // PAGINATION
//   // =====================================================
//   const handleNext = () => {
//     if (currentPage < totalPages) fetchSalesOrders(currentPage + 1, search);
//   };
//   const handlePrev = () => {
//     if (currentPage > 1) fetchSalesOrders(currentPage - 1, search);
//   };

//   // =====================================================
//   // RENDER
//   // =====================================================
//   return (
//     <>
//       {/* ── DELETE CONFIRMATION MODAL ─────────────────────────────────── */}
//       {showDeleteModal && (
//         <div
//           className="salesCRM-delete-modal"
//           style={{ maxWidth: "420px", width: "100%", height: "auto" }}
//         >
//           <svg
//             className="salesCRM-close-icon"
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 384 512"
//             onClick={() => setShowDeleteModal(false)}
//             style={{ cursor: "pointer" }}
//           >
//             <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
//           </svg>
//           <div className="salesCRM-modal-head">
//             <p>Delete Sales Order</p>
//           </div>
//           <div
//             className="salesCRM-modal-body"
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
//               Are you sure you want to delete sales order <br />
//               <strong>{deleteOrderData?.sales_order_id}</strong>
//               <br />
//               (Customer: {deleteOrderData?.customer_name})?
//             </p>
//             <div
//               className="salesCRM-modal-actions"
//               style={{ justifyContent: "center", gap: "14px" }}
//             >
//               <button
//                 type="button"
//                 className="salesCRM-cancel-btn"
//                 onClick={() => setShowDeleteModal(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 className="salesCRM-delete-btn"
//                 onClick={confirmDelete}
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
//       <div className={`salesCRM-container ${showDeleteModal ? "blur" : ""}`}>
//         <div className="salesCRM-header">
//           <p>Sales Order</p>
//           <button onClick={() => setCurrentPage("createNewSales")}>
//             + New Sales Order
//           </button>
//         </div>

//         {/* SEARCH */}
//         <div className="salesCRM-search-box">
//           <label htmlFor="searchByID">
//             <svg
//               className="salesCRM-search-logo"
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 512 512"
//             >
//               <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
//             </svg>
//           </label>
//           <input
//             id="searchByID"
//             placeholder="Search by ID, Name..."
//             value={search}
//             onChange={(e) => {
//               setSearch(e.target.value);
//               fetchSalesOrders(1, e.target.value);
//             }}
//           />
//         </div>

//         {/* FILTERS */}
//         <div className="salesCRM-clearfilter">
//           <p onClick={handleClearFilter}>Clear Filter</p>
//         </div>
//         <div className="salesCRM-search-category">
//           <div className="salesCRM-input-box">
//             <label htmlFor="status">Status</label>
//             <select
//               id="status"
//               value={filter.status}
//               onChange={(e) =>
//                 setFilter((prev) => ({ ...prev, status: e.target.value }))
//               }
//             >
//               <option value="">All Statuses</option>
//               <option value="Draft">Draft</option>
//               <option value="Submitted">Submitted</option>
//               <option value="Submitted(PD)">Submitted(PD)</option>
//               <option value="Delivered">Delivered</option>
//               <option value="Partially Delivered">Partially Delivered</option>
//               <option value="Cancelled">Cancelled</option>
//             </select>
//           </div>
//           <div className="salesCRM-input-box">
//             <label htmlFor="order_type">Order Type</label>
//             <select
//               id="order_type"
//               value={filter.order}
//               onChange={(e) =>
//                 setFilter((prev) => ({ ...prev, order: e.target.value }))
//               }
//             >
//               <option value="">All Types</option>
//               <option value="Standard">Standard</option>
//               <option value="Rush">Rush</option>
//               <option value="Backorder">Backorder</option>
//             </select>
//           </div>
//           <div className="salesCRM-input-box">
//             <label htmlFor="sales_rep">Sales Rep</label>
//             <select
//               id="sales_rep"
//               value={filter.sales_rep}
//               onChange={(e) =>
//                 setFilter((prev) => ({ ...prev, sales_rep: e.target.value }))
//               }
//             >
//               <option value="">All</option>
//               {salesRepList.map((rep, ind) => (
//                 <option key={ind} value={rep}>
//                   {rep}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* BULK ACTION BUTTONS */}
//         <div className="salesCRM-table-title">
//           <p>Select orders to enable actions</p>
//           <nav>
//             <button
//               className={
//                 buttonAct.purchase_order
//                   ? "salesCRM-active-btn"
//                   : "salesCRM-inactive-btn"
//               }
//               disabled={!buttonAct.purchase_order}
//               onClick={() => setCurrentPage("createNewPurchase")}
//             >
//               Generate Purchase order
//             </button>
//             <button
//               className={
//                 buttonAct.delivery
//                   ? "salesCRM-active-btn"
//                   : "salesCRM-inactive-btn"
//               }
//               disabled={!buttonAct.delivery}
//               onClick={() => setCurrentPage("createNewDelivery")}
//             >
//               Generate Delivery Note
//             </button>
//             <button
//               className={
//                 buttonAct.invoice
//                   ? "salesCRM-active-btn"
//                   : "salesCRM-inactive-btn"
//               }
//               disabled={!buttonAct.invoice}
//               onClick={() => setCurrentPage("createNewInvoice")}
//             >
//               Generate Invoice
//             </button>
//           </nav>
//         </div>

//         {/* TABLE */}
//         <div className="salesCRM-table-cointainer">
//           {loading ? (
//             <p style={{ textAlign: "center", padding: "20px" }}>Loading...</p>
//           ) : (
//             <table>
//               <thead className="salesCRM-table-head">
//                 <tr>
//                   <th></th>
//                   <th className="salesCRM-table-maxwidth">Sales Order ID</th>
//                   <th className="salesCRM-table-minwidth">Order Type</th>
//                   <th className="salesCRM-table-largwidth">Customer Name</th>
//                   <th className="salesCRM-table-minwidth">Sales Rep</th>
//                   <th className="salesCRM-table-minwidth">Order Date</th>
//                   <th>
//                     <div className="salesCRM-status-filter">
//                       Status
//                       <nav className="salesCRM-filter-box">
//                         <p>Newest First</p>
//                         <p>Oldest First</p>
//                         <p>Progressing {`(Draft → Cancelled)`}</p>
//                         <p>Reverse Progressing{`(Cancelled → Draft)`}</p>
//                       </nav>
//                       <svg
//                         className="salesCRM-status-filter-logo"
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="14"
//                         height="18"
//                         viewBox="0 0 14 18"
//                         fill="none"
//                       >
//                         <path
//                           d="M3.66683 12.3346H0.333496L5.3335 17.3346V0.667969H3.66683V12.3346ZM8.66683 3.16797V17.3346H10.3335V5.66797H13.6668L8.66683 0.667969V3.16797Z"
//                           fill="#234E70"
//                         />
//                       </svg>
//                     </div>
//                   </th>
//                   <th className="salesCRM-table-minwidth">Grand Total</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody className="salesCRM-table-body">
//                 {filteredData.length > 0 ? (
//                   filteredData.map((ele, ind) => (
//                     <tr key={ind}>
//                       {/* CHECKBOX */}
//                       <td>
//                         <input
//                           className="salesCRM-table-check"
//                           type="checkbox"
//                           onChange={(e) => handlecheckbox(e, ele)}
//                           checked={!!buttonAct.chechbox[ele.sales_order_id]}
//                         />
//                       </td>

//                       <td>{ele.sales_order_id}</td>
//                       <td>{ele.order_type}</td>
//                       <td>{ele.customer_name}</td>
//                       <td>{ele.sales_rep}</td>
//                       <td>{ele.order_date}</td>

//                       {/* STATUS */}
//                       <td>
//                         <p
//                           className={`salesCRM-Status ${
//                             ele.status === "Draft"
//                               ? "salesCRM-Status-draft"
//                               : ele.status === "Submitted"
//                               ? "salesCRM-Status-submitted"
//                               : ele.status === "Submitted(PD)"
//                               ? "salesCRM-Status-SubmittedPD"
//                               : ele.status === "Delivered"
//                               ? "salesCRM-Status-Delivered"
//                               : ele.status === "Cancelled"
//                               ? "salesCRM-Status-Cancelled"
//                               : ele.status === "Partially Delivered"
//                               ? "salesCRM-Status-partiallyDelivered"
//                               : ""
//                           }`}
//                         >
//                           {ele.status}
//                         </p>
//                       </td>

//                       <td>{ele.grand_total}</td>

//                       {/* ACTION */}
//                       <td id="salesCRM-table-action">
//                         <nav className="salesCRM-dot-container">

//                           {/*
//                             FIX: pass ele.id (numeric PK e.g. 7) as the second
//                             argument to setCurrentPage so Body.jsx stores it in
//                             selectedOrderId and passes it to CreateNewSales as
//                             orderId. Previously only the page name was passed
//                             and orderId was always null → loadOrder bailed out.
//                           */}
//                           <button
//                             disabled={!ele.status}
//                             onClick={() =>
//                               setCurrentPage("editNewSales", ele.id)
//                             }
//                           >
//                             {ele.status === "Draft" ? "Edit" : "View"} details
//                           </button>

//                           <button
//                             disabled={
//                               !(
//                                 ele.status === "Draft" ||
//                                 ele.status === "Submitted(PD)" ||
//                                 ele.status === "Submitted" ||
//                                 ele.status === "Partially Delivered"
//                               )
//                             }
//                             onClick={() => setCurrentPage("createNewPurchase")}
//                           >
//                             Generate Purchase order
//                           </button>
//                           <button
//                             disabled={
//                               !["Submitted(PD)", "Submitted", "Partially Delivered"].includes(
//                                 ele.status
//                               )
//                             }
//                             onClick={() => setCurrentPage("createNewDelivery")}
//                           >
//                             Generate Delivery Note
//                           </button>
//                           <button
//                             disabled={ele.status !== "Submitted"}
//                             onClick={() => setCurrentPage("createNewInvoice")}
//                           >
//                             Generate Invoice
//                           </button>
//                           <button
//                             onClick={() => handleDeleteClick(ele)}
//                             style={{ color: "red" }}
//                           >
//                             Delete
//                           </button>
//                         </nav>
//                         <svg
//                           className="salesCRM-delete-logo"
//                           xmlns="http://www.w3.org/2000/svg"
//                           width="24"
//                           height="24"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                         >
//                           <path
//                             d="M12 16C12.5304 16 13.0391 16.2107 13.4142 16.5858C13.7893 16.9609 14 17.4696 14 18C14 18.5304 13.7893 19.0391 13.4142 19.4142C13.0391 19.7893 12.5304 20 12 20C11.4696 20 10.9609 19.7893 10.5858 19.4142C10.2107 19.0391 10 18.5304 10 18C10 17.4696 10.2107 16.9609 10.5858 16.5858C10.9609 16.2107 11.4696 16 12 16ZM12 10C12.5304 10 13.0391 10.2107 13.4142 10.5858C13.7893 10.9609 14 11.4696 14 12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14C11.4696 14 10.9609 13.7893 10.5858 13.4142C10.2107 13.0391 10 12.5304 10 12C10 11.4696 10.2107 10.9609 10.5858 10.5858C10.9609 10.2107 11.4696 10 12 10ZM12 4C12.5304 4 13.0391 4.21071 13.4142 4.58579C13.7893 4.96086 14 5.46957 14 6C14 6.53043 13.7893 7.03914 13.4142 7.41421C13.0391 7.78929 12.5304 8 12 8C11.4696 8 10.9609 7.78929 10.5858 7.41421C10.2107 7.03914 10 6.53043 10 6C10 5.46957 10.2107 4.96086 10.5858 4.58579C10.9609 4.21071 11.4696 4 12 4Z"
//                             fill="#2A2A2A"
//                           />
//                         </svg>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan="9"
//                       style={{ textAlign: "center", padding: "20px" }}
//                     >
//                       No Data
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           )}
//         </div>

//         {/* PAGINATION */}
//         <nav className="salesCRM-table-bottem">
//           <p className="salesCRM-num-entries">
//             Showing {filteredData.length} entries
//           </p>
//           <div className="salesCRM-manage-control-box">
//             <button
//               className="salesCRM-manage-btn"
//               onClick={handlePrev}
//               disabled={currentPage === 1}
//             >
//               Prev
//             </button>
//             <nav className="salesCRM-num-page">
//               Page {currentPage} of {totalPages}
//             </nav>
//             <button
//               className="salesCRM-manage-btn"
//               onClick={handleNext}
//               disabled={currentPage === totalPages}
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
import "./salesCRM.css";
import useSalesOrderStore from "./salesOrderStore";

export default function SalesCRM({ setCurrentPage }) {
  const {
    salesOrders,
    loading,
    currentPage,
    totalPages,
    search,
    setSearch,
    fetchSalesOrders,
    deleteSalesOrder,
  } = useSalesOrderStore();

  const [filter, setFilter] = useState({
    status: "",
    order: "",
    sales_rep: "",
  });

  const [salesRepList, setSalesRepList] = useState([]);

  const [buttonAct, setButtonAct] = useState({
    chechbox: {},
    purchase_order: false,
    delivery: false,
    invoice: false,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteOrderData, setDeleteOrderData] = useState(null);

  useEffect(() => {
    fetchSalesOrders(1, "");
  }, []);

  useEffect(() => {
    if (salesOrders.length > 0) {
      const uniqueReps = [
        ...new Set(salesOrders.map((o) => o.sales_rep).filter(Boolean)),
      ];
      setSalesRepList(uniqueReps);
    }
  }, [salesOrders]);

  useEffect(() => {
    const selectedOrders = salesOrders.filter(
      (order) => buttonAct.chechbox[order.sales_order_id]
    );
    const hasMultiple = selectedOrders.length > 1;
    const firstCustomer = selectedOrders[0]?.customer_name;
    const sameCustomer =
      hasMultiple &&
      selectedOrders.every((order) => order.customer_name === firstCustomer);

    const generateDelivery =
      hasMultiple &&
      selectedOrders.every(
        (order) =>
          order.status === "Submitted" || order.status === "Submitted(PD)"
      );

    const generateInvoice =
      hasMultiple &&
      selectedOrders.every((order) => order.status === "Submitted");

    const allValidForPO =
      hasMultiple &&
      selectedOrders.every(
        (order) =>
          order.status === "Draft" ||
          order.status === "Submitted(PD)" ||
          order.status === "Submitted" ||
          order.status === "Partially Delivered"
      );

    setButtonAct((prev) => ({
      ...prev,
      delivery: selectedOrders.length > 0 && sameCustomer && generateDelivery,
      invoice: selectedOrders.length > 0 && sameCustomer && generateInvoice,
      purchase_order:
        selectedOrders.length > 0 && !sameCustomer && allValidForPO,
    }));
  }, [buttonAct.chechbox, salesOrders]);

  const handlecheckbox = (e, ele) => {
    const { checked } = e.target;
    setButtonAct((prev) => ({
      ...prev,
      chechbox: {
        ...prev.chechbox,
        [ele.sales_order_id]: checked,
      },
    }));
  };

  const handleClearFilter = () => {
    setFilter({ status: "", order: "", sales_rep: "" });
  };

  const handleDeleteClick = (row) => {
    setDeleteOrderData(row);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteOrderData) return;
    await deleteSalesOrder(deleteOrderData.id);
    fetchSalesOrders(currentPage, search);
    setShowDeleteModal(false);
    setDeleteOrderData(null);
  };

  const filteredData = salesOrders.filter((item) => {
    const matchStatus = filter.status ? item.status === filter.status : true;
    const matchOrder = filter.order ? item.order_type === filter.order : true;
    const matchRep = filter.sales_rep
      ? item.sales_rep === filter.sales_rep
      : true;
    const matchSearch =
      !search ||
      item.sales_order_id?.toLowerCase().includes(search.toLowerCase()) ||
      item.customer_name?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchOrder && matchRep && matchSearch;
  });

  const handleNext = () => {
    if (currentPage < totalPages) fetchSalesOrders(currentPage + 1, search);
  };
  const handlePrev = () => {
    if (currentPage > 1) fetchSalesOrders(currentPage - 1, search);
  };

  return (
    <>
      {showDeleteModal && (
        <div
          className="salesCRM-delete-modal"
          style={{ maxWidth: "420px", width: "100%", height: "auto" }}
        >
          <svg
            className="salesCRM-close-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            onClick={() => setShowDeleteModal(false)}
            style={{ cursor: "pointer" }}
          >
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
          <div className="salesCRM-modal-head">
            <p>Delete Sales Order</p>
          </div>
          <div
            className="salesCRM-modal-body"
            style={{ padding: "16px 20px", height: "auto" }}
          >
            <p
              style={{
                textAlign: "center",
                fontSize: "15px",
                lineHeight: "22px",
                marginBottom: "20px",
              }}
            >
              Are you sure you want to delete sales order <br />
              <strong>{deleteOrderData?.sales_order_id}</strong>
              <br />
              (Customer: {deleteOrderData?.customer_name})?
            </p>
            <div
              className="salesCRM-modal-actions"
              style={{ justifyContent: "center", gap: "14px" }}
            >
              <button
                type="button"
                className="salesCRM-cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="salesCRM-delete-btn"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`salesCRM-container ${showDeleteModal ? "blur" : ""}`}>
        <div className="salesCRM-header">
          <p>Sales Order</p>
          {/* ✅ create: no order data passed */}
          <button onClick={() => setCurrentPage("salesForm", null)}>
            + New Sales Order
          </button>
        </div>

        <div className="salesCRM-search-box">
          <label htmlFor="searchByID">
            <svg
              className="salesCRM-search-logo"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
            </svg>
          </label>
          <input
            id="searchByID"
            placeholder="Search by ID, Name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              fetchSalesOrders(1, e.target.value);
            }}
          />
        </div>

        <div className="salesCRM-clearfilter">
          <p onClick={handleClearFilter}>Clear Filter</p>
        </div>
        <div className="salesCRM-search-category">
          <div className="salesCRM-input-box">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={filter.status}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              <option value="">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Submitted">Submitted</option>
              <option value="Submitted(PD)">Submitted(PD)</option>
              <option value="Delivered">Delivered</option>
              <option value="Partially Delivered">Partially Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="salesCRM-input-box">
            <label htmlFor="order_type">Order Type</label>
            <select
              id="order_type"
              value={filter.order}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, order: e.target.value }))
              }
            >
              <option value="">All Types</option>
              <option value="Standard">Standard</option>
              <option value="Rush">Rush</option>
              <option value="Backorder">Backorder</option>
            </select>
          </div>
          <div className="salesCRM-input-box">
            <label htmlFor="sales_rep">Sales Rep</label>
            <select
              id="sales_rep"
              value={filter.sales_rep}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, sales_rep: e.target.value }))
              }
            >
              <option value="">All</option>
              {salesRepList.map((rep, ind) => (
                <option key={ind} value={rep}>
                  {rep}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="salesCRM-table-title">
          <p>Select orders to enable actions</p>
          <nav>
            <button
              className={
                buttonAct.purchase_order
                  ? "salesCRM-active-btn"
                  : "salesCRM-inactive-btn"
              }
              disabled={!buttonAct.purchase_order}
              onClick={() => setCurrentPage("createNewPurchase")}
            >
              Generate Purchase order
            </button>
            <button
              className={
                buttonAct.delivery
                  ? "salesCRM-active-btn"
                  : "salesCRM-inactive-btn"
              }
              disabled={!buttonAct.delivery}
              onClick={() => setCurrentPage("createNewDelivery")}
            >
              Generate Delivery Note
            </button>
            <button
              className={
                buttonAct.invoice
                  ? "salesCRM-active-btn"
                  : "salesCRM-inactive-btn"
              }
              disabled={!buttonAct.invoice}
              onClick={() => setCurrentPage("createNewInvoice")}
            >
              Generate Invoice
            </button>
          </nav>
        </div>

        <div className="salesCRM-table-cointainer">
          {loading ? (
            <p style={{ textAlign: "center", padding: "20px" }}>Loading...</p>
          ) : (
            <table>
              <thead className="salesCRM-table-head">
                <tr>
                  <th></th>
                  <th className="salesCRM-table-maxwidth">Sales Order ID</th>
                  <th className="salesCRM-table-minwidth">Order Type</th>
                  <th className="salesCRM-table-largwidth">Customer Name</th>
                  <th className="salesCRM-table-minwidth">Sales Rep</th>
                  <th className="salesCRM-table-minwidth">Order Date</th>
                  <th>
                    <div className="salesCRM-status-filter">
                      Status
                      <nav className="salesCRM-filter-box">
                        <p>Newest First</p>
                        <p>Oldest First</p>
                        <p>Progressing {`(Draft → Cancelled)`}</p>
                        <p>Reverse Progressing{`(Cancelled → Draft)`}</p>
                      </nav>
                      <svg
                        className="salesCRM-status-filter-logo"
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="18"
                        viewBox="0 0 14 18"
                        fill="none"
                      >
                        <path
                          d="M3.66683 12.3346H0.333496L5.3335 17.3346V0.667969H3.66683V12.3346ZM8.66683 3.16797V17.3346H10.3335V5.66797H13.6668L8.66683 0.667969V3.16797Z"
                          fill="#234E70"
                        />
                      </svg>
                    </div>
                  </th>
                  <th className="salesCRM-table-minwidth">Grand Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="salesCRM-table-body">
                {filteredData.length > 0 ? (
                  filteredData.map((ele, ind) => (
                    <tr key={ind}>
                      <td>
                        <input
                          className="salesCRM-table-check"
                          type="checkbox"
                          onChange={(e) => handlecheckbox(e, ele)}
                          checked={!!buttonAct.chechbox[ele.sales_order_id]}
                        />
                      </td>
                      <td>{ele.sales_order_id}</td>
                      <td>{ele.order_type}</td>
                      <td>{ele.customer_name}</td>
                      <td>{ele.sales_rep}</td>
                      <td>{ele.order_date}</td>
                      <td>
                        <p
                          className={`salesCRM-Status ${
                            ele.status === "Draft"
                              ? "salesCRM-Status-draft"
                              : ele.status === "Submitted"
                              ? "salesCRM-Status-submitted"
                              : ele.status === "Submitted(PD)"
                              ? "salesCRM-Status-SubmittedPD"
                              : ele.status === "Delivered"
                              ? "salesCRM-Status-Delivered"
                              : ele.status === "Cancelled"
                              ? "salesCRM-Status-Cancelled"
                              : ele.status === "Partially Delivered"
                              ? "salesCRM-Status-partiallyDelivered"
                              : ""
                          }`}
                        >
                          {ele.status}
                        </p>
                      </td>
                      <td>{ele.grand_total}</td>
                      <td id="salesCRM-table-action">
                        <nav className="salesCRM-dot-container">
                          {/* ✅ edit: pass the full row object */}
                          <button
                            disabled={!ele.status}
                            onClick={() => setCurrentPage("salesForm", ele)}
                          >
                            {ele.status === "Draft" ? "Edit" : "View"} details
                          </button>

                          <button
                            disabled={
                              !(
                                ele.status === "Draft" ||
                                ele.status === "Submitted(PD)" ||
                                ele.status === "Submitted" ||
                                ele.status === "Partially Delivered"
                              )
                            }
                            onClick={() => setCurrentPage("createNewPurchase")}
                          >
                            Generate Purchase order
                          </button>
                          <button
                            disabled={
                              ![
                                "Submitted(PD)",
                                "Submitted",
                                "Partially Delivered",
                              ].includes(ele.status)
                            }
                            onClick={() => setCurrentPage("createNewDelivery")}
                          >
                            Generate Delivery Note
                          </button>
                          <button
                            disabled={ele.status !== "Submitted"}
                            onClick={() => setCurrentPage("createNewInvoice")}
                          >
                            Generate Invoice
                          </button>
                          <button
                            onClick={() => handleDeleteClick(ele)}
                            style={{ color: "red" }}
                          >
                            Delete
                          </button>
                        </nav>
                        <svg
                          className="salesCRM-delete-logo"
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
                ) : (
                  <tr>
                    <td
                      colSpan="9"
                      style={{ textAlign: "center", padding: "20px" }}
                    >
                      No Data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <nav className="salesCRM-table-bottem">
          <p className="salesCRM-num-entries">
            Showing {filteredData.length} entries
          </p>
          <div className="salesCRM-manage-control-box">
            <button
              className="salesCRM-manage-btn"
              onClick={handlePrev}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <nav className="salesCRM-num-page">
              Page {currentPage} of {totalPages}
            </nav>
            <button
              className="salesCRM-manage-btn"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}