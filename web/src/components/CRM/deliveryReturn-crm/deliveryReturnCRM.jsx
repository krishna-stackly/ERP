// // // import React, { useState, useEffect } from "react";
// // // import "./deliveryReturnCRM.css";

// // // export default function DeliveryReturnCRM({ setCurrentPage }) {
// // //   const [deliveryCurrentPage, setDeliveryCurrentPage] = useState(1);
// // //   const deliveryPerPage = 10;
// // //   const [ApiDelivery, setApiDelivery] = useState({});
// // //   const [deliveryData, setDeliveryData] = useState([]);

// // //   const deliveryFromApi = {
// // //     deliveryData: [
// // //       {
// // //         dn_id: "DN-0001",
// // //         sales_order_ref: "SO-0001",
// // //         customer_name: "Mandy",
// // //         delivery_type: "Regular", 
// // //         delivery_date: "28-05-2025",
// // //         status: "Draft",
// // //       },
// // //       {
// // //         dn_id: "DN-0002",
// // //         sales_order_ref: "SO-0002",
// // //         customer_name: "Sans",
// // //         delivery_type: "Regular",
// // //         delivery_date: "28-05-2025",
// // //         status: "Partially Delivered",
// // //       },
// // //       {
// // //         dn_id: "DN-0003",
// // //         sales_order_ref: "SO-0002",
// // //         customer_name: "Jon",
// // //         delivery_type: "Regular",
// // //         delivery_date: "28-05-2025",
// // //         status: "Delivered",
// // //       },
// // //       {
// // //         dn_id: "DN-0004",
// // //         sales_order_ref: "SO-0002",
// // //         customer_name: "Wick",
// // //         delivery_type: "Regular",
// // //         delivery_date: "28-05-2025",
// // //         status: "Partially Delivered",
// // //       },
// // //       {
// // //         dn_id: "DN-0005",
// // //         sales_order_ref: "SO-0005",
// // //         customer_name: "Mandy",
// // //         delivery_type: "Regular",
// // //         delivery_date: "28-05-2025",
// // //         status: "Delivered",
// // //       },
// // //       {
// // //         dn_id: "DN-0006",
// // //         sales_order_ref: "SO-0006",
// // //         customer_name: "Kamal",
// // //         delivery_type: "Regular",
// // //         delivery_date: "28-05-2025",
// // //         status: "Draft",
// // //       },
// // //       {
// // //         dn_id: "DN-0007",
// // //         sales_order_ref: "SO-0007",
// // //         customer_name: "Rahul",
// // //         delivery_type: "Regular",
// // //         delivery_date: "28-05-2025",
// // //         status: "Returned",
// // //       },
// // //       {
// // //         dn_id: "DN-0008",
// // //         sales_order_ref: "SO-0008",
// // //         customer_name: "Dhoni",
// // //         delivery_type: "Regular",
// // //         delivery_date: "28-05-2025",
// // //         status: "Cancelled",
// // //       },
// // //     ],
// // //   };

// // //   const [filter, setFilter] = useState({
// // //     delivery_status: "",
// // //     delivery_type: "",
// // //     delivery_from_date: "",
// // //     delivery_to_date: "",
// // //   });

// // //   const [buttonAct, setButtonAct] = useState({
// // //     checkbox: {},
// // //     delivery_return: true,
// // //     invoice: true,
// // //   });

// // //   useEffect(() => {
// // //     setApiDelivery(deliveryFromApi);
// // //   }, []);
// // //   useEffect(() => {
// // //     if (Object.keys(ApiDelivery).length > 0) {
// // //       setDeliveryData(ApiDelivery.deliveryData);
// // //     }
// // //   }, [ApiDelivery]);

// // //   useEffect(() => {
// // //     const selectedOrders = deliveryData.filter(
// // //       (order) => buttonAct.checkbox[order.dn_id]
// // //     );
// // //     const hasMultiple = selectedOrders.length > 1;
// // //     //valid DN_ID
// // //     const firstDN_ID = selectedOrders[0]?.sales_order_ref;
// // //     const sameDN_ID =
// // //       hasMultiple &&
// // //       selectedOrders.every((order) => order.sales_order_ref === firstDN_ID);

// // //     //delivery return and invoice valid states
// // //     const validStatus =
// // //       hasMultiple &&
// // //       selectedOrders.every(
// // //         (order) =>
// // //           order.status === "Partially Delivered" ||
// // //           order.status === "Delivered" ||
// // //           order.status === "Returned"
// // //       );
// // //     setButtonAct((prev) => ({
// // //       ...prev,
// // //       delivery_return: selectedOrders.length > 0 && validStatus && sameDN_ID,
// // //       invoice: selectedOrders.length > 0 && validStatus && sameDN_ID,
// // //     }));
// // //   }, [buttonAct.checkbox, deliveryData]);

// // //   // checkbox
// // //   const handlecheckbox = (e, ele) => {
// // //     const { id, checked } = e.target;
// // //     setButtonAct((prev) => ({
// // //       checkbox: {
// // //         ...prev.checkbox,
// // //         [ele.dn_id]: checked,
// // //       },
// // //     }));
// // //   };
// // //   //page calculation
// // //   const totalPages = Math.ceil(deliveryData.length / deliveryPerPage);

// // //   const currentData = deliveryData.slice(
// // //     (deliveryCurrentPage - 1) * deliveryPerPage,
// // //     deliveryCurrentPage * deliveryPerPage
// // //   );

// // //   const handleNext = () => {
// // //     if (deliveryCurrentPage < totalPages) {
// // //       setDeliveryCurrentPage((prev) => prev + 1);
// // //     }
// // //   };
// // //   const handlePrev = () => {
// // //     if (deliveryCurrentPage > 1) {
// // //       setDeliveryCurrentPage((prev) => prev - 1);
// // //     }
// // //   };
// // //   const handleClearFilter = () => {
// // //     setFilter({
// // //       delivery_status: "",
// // //       delivery_type: "",
// // //       delivery_from_date: "",
// // //       delivery_to_date: "",
// // //     });
// // //   };
// // //   console.log(buttonAct.checkbox);

// // //   return (
// // //     <>
// // //       <div className="deliveryCRM-container">
// // //         <div className="deliveryCRM-header">
// // //           <p>Delivery Note Return List</p>
// // //           <button
// // //             onClick={() => {
// // //               setCurrentPage("createNewDeliveryReturn");
// // //             }}
// // //           >
// // //             + New Delivery Note Return
// // //           </button>
// // //         </div>
// // //         <div className="deliveryCRM-search-box">
// // //           <label htmlFor="searchByID">
// // //             <svg
// // //               className="deliveryCRM-search-logo"
// // //               xmlns="http://www.w3.org/2000/svg"
// // //               viewBox="0 0 512 512"
// // //             >
// // //               <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
// // //             </svg>
// // //           </label>
// // //           <input
// // //             id="searchByID"
// // //             placeholder="Search by DNR number, Customer name,Customer ID..."
// // //           />
// // //         </div>
// // //         <div className="deliveryCRM-clearfilter">
// // //           <p onClick={handleClearFilter}>Clear Filter</p>
// // //         </div>
// // //         <div className="deliveryCRM-search-category">
// // //           <div className="deliveryCRM-input-box">
// // //             <label htmlFor="delivery_status">DNR Status</label>
// // //             <select
// // //               value={filter.delivery_status}
// // //               onChange={(e) => {
// // //                 setFilter((prev) => ({
// // //                   ...prev,
// // //                   delivery_status: e.target.value,
// // //                 }));
// // //               }}
// // //               id="delivery_status"
// // //             >
// // //               <option value="">All</option>
// // //               <option value="Draft">Draft</option>
// // //               <option value="Pending">Pending</option>
// // //               <option value="In Transit">In Transit</option>
// // //               <option value="Delivered">Delivered</option>
// // //               <option value="Partially Delivered">Partially Delivered</option>
// // //               <option value="Returned">Returned</option>
// // //               <option value="Cancelled">Cancelled</option>
// // //             </select>
// // //           </div>
// // //           <div className="deliveryCRM-input-box">
// // //             <label htmlFor="delivery_type">Delivery Type</label>
// // //             <select
// // //               value={filter.delivery_type}
// // //               onChange={(e) => {
// // //                 setFilter((prev) => ({
// // //                   ...prev,
// // //                   delivery_type: e.target.value,
// // //                 }));
// // //               }}
// // //               id="delivery_type"
// // //             >
// // //               <option value="">All Types</option>
// // //               <option value="Regular">Regular</option>
// // //               <option value="Urgent">Urgent</option>
// // //               <option value="Return">Return</option>
// // //             </select>
// // //           </div>
// // //           <div className="deliveryCRM-input-box">
// // //             <label htmlFor="delivery_date">Delivery Date</label>
// // //             <nav id="deldvery_date">
// // //               <div>
// // //                 <span>From </span>
// // //                 <input
// // //                   value={filter.delivery_from_date}
// // //                   onChange={(e) => {
// // //                     setFilter((prev) => ({
// // //                       ...prev,
// // //                       delivery_from_date: e.target.value,
// // //                     }));
// // //                   }}
// // //                   className="deliveryCRM-date"
// // //                   type="date"
// // //                 />
// // //               </div>
// // //               <div>
// // //                 <span>to </span>
// // //                 <input
// // //                   value={filter.delivery_to_date}
// // //                   onChange={(e) => {
// // //                     setFilter((prev) => ({
// // //                       ...prev,
// // //                       delivery_to_date: e.target.value,
// // //                     }));
// // //                   }}
// // //                   className="deliveryCRM-date"
// // //                   type="date"
// // //                 />
// // //               </div>
// // //             </nav>
// // //           </div>
// // //         </div>
// // //         <div className="deliveryCRM-table-cointainer">
// // //           <table>
// // //             <thead className="deliveryCRM-table-head">
// // //               <tr>
// // //                 <th></th>
// // //                 <th>DNR ID</th>
// // //                 <th className="deliveryCRM-maxhead-width">Invoice Return Ref.</th>
// // //                 <th className="deliveryCRM-maxhead-width">Customer Name</th>
// // //                 <th className="deliveryCRM-minhead-width">DNR Date</th>
// // //                 <th>
// // //                   <div className="deliveryCRM-status-filter">
// // //                     Status
// // //                     <nav className="deliveryCRM-filter-box">
// // //                       <p>Newest First</p>
// // //                       <p>Oldest First</p>
// // //                       <p>Progressing {`(Draft → Cancelled)`}</p>
// // //                       <p>Reverse Progressing{`(Cancelled → Draft)`} </p>
// // //                     </nav>
// // //                     <svg
// // //                       xmlns="http://www.w3.org/2000/svg"
// // //                       width="14"
// // //                       height="18"
// // //                       viewBox="0 0 14 18"
// // //                       fill="none"
// // //                     >
// // //                       <path
// // //                         d="M3.66683 12.3346H0.333496L5.3335 17.3346V0.667969H3.66683V12.3346ZM8.66683 3.16797V17.3346H10.3335V5.66797H13.6668L8.66683 0.667969V3.16797Z"
// // //                         fill="#234E70"
// // //                       />
// // //                     </svg>
// // //                   </div>
// // //                 </th>
// // //                 <th>Action</th>
// // //               </tr>
// // //             </thead>
// // //             <tbody className="deliveryCRM-table-body">
// // //               {currentData.length > 0 ? (
// // //                 currentData.map((ele, ind) => (
// // //                   <tr key={ind}>
// // //                     <td>
// // //                       <input
// // //                         className="deliveryCRM-table-check"
// // //                         type="checkbox"
// // //                         onChange={(e) => handlecheckbox(e, ele)}
// // //                         checked={!!buttonAct.checkbox[ele.dn_id]}
// // //                       />
// // //                     </td>
// // //                     <td className="deliveryCRM-minbody-width">{ele.dn_id}</td>
// // //                     <td>{ele.sales_order_ref}</td>
// // //                     <td>{ele.customer_name}</td>
// // //                     <td>{ele.delivery_date}</td>
// // //                     <td>
// // //                       <p
// // //                         className={`deliveryCRM-Status ${
// // //                           ele.status === "Draft"
// // //                             ? "deliveryCRM-Status-draft"
// // //                             : ele.status === "Delivered"
// // //                             ? "deliveryCRM-Status-Delivered"
// // //                             : ele.status === "Cancelled"
// // //                             ? "deliveryCRM-Status-Cancelled"
// // //                             : ele.status === "Partially Delivered"
// // //                             ? "deliveryCRM-Status-partiallyDelivered"
// // //                             : ele.status === "Returned"
// // //                             ? "deliveryCRM-Status-Returned"
// // //                             : ""
// // //                         }`}
// // //                       >
// // //                         {ele.status}
// // //                       </p>
// // //                     </td>
// // //                     <td id="deliveryCRM-table-action">
// // //                       <nav className="deliveryCRM-dot-container">
// // //                         <button
// // //                           disabled={ele.status !== "" ? false : true}
// // //                           onClick={() => {
// // //                             setCurrentPage("editDelivery");
// // //                           }}
// // //                         >
// // //                           {ele.status === "Draft" ? "Edit" : "View"} details
// // //                         </button>
// // //                         <button
// // //                           disabled={
// // //                             ele.status === "Partially Delivered" ||
// // //                             ele.status === "Delivered" ||
// // //                             ele.status === "Returned"
// // //                               ? false
// // //                               : true
// // //                           }
// // //                         >
// // //                           Generate Delivery Return
// // //                         </button>
// // //                         <button
// // //                           disabled={
// // //                             ele.status === "Partially Delivered" ||
// // //                             ele.status === "Delivered" ||
// // //                             ele.status === "Returned"
// // //                               ? false
// // //                               : true
// // //                           }
// // //                         >
// // //                           Generate Invoice
// // //                         </button>
// // //                       </nav>
// // //                       <svg
// // //                         className="deliveryCRM-delete-logo"
// // //                         xmlns="http://www.w3.org/2000/svg"
// // //                         width="24"
// // //                         height="24"
// // //                         viewBox="0 0 24 24"
// // //                         fill="none"
// // //                       >
// // //                         <path
// // //                           d="M12 16C12.5304 16 13.0391 16.2107 13.4142 16.5858C13.7893 16.9609 14 17.4696 14 18C14 18.5304 13.7893 19.0391 13.4142 19.4142C13.0391 19.7893 12.5304 20 12 20C11.4696 20 10.9609 19.7893 10.5858 19.4142C10.2107 19.0391 10 18.5304 10 18C10 17.4696 10.2107 16.9609 10.5858 16.5858C10.9609 16.2107 11.4696 16 12 16ZM12 10C12.5304 10 13.0391 10.2107 13.4142 10.5858C13.7893 10.9609 14 11.4696 14 12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14C11.4696 14 10.9609 13.7893 10.5858 13.4142C10.2107 13.0391 10 12.5304 10 12C10 11.4696 10.2107 10.9609 10.5858 10.5858C10.9609 10.2107 11.4696 10 12 10ZM12 4C12.5304 4 13.0391 4.21071 13.4142 4.58579C13.7893 4.96086 14 5.46957 14 6C14 6.53043 13.7893 7.03914 13.4142 7.41421C13.0391 7.78929 12.5304 8 12 8C11.4696 8 10.9609 7.78929 10.5858 7.41421C10.2107 7.03914 10 6.53043 10 6C10 5.46957 10.2107 4.96086 10.5858 4.58579C10.9609 4.21071 11.4696 4 12 4Z"
// // //                           fill="#2A2A2A"
// // //                         />
// // //                       </svg>
// // //                     </td>
// // //                   </tr>
// // //                 ))
// // //               ) : (
// // //                 <tr>
// // //                   <td>No Data</td>
// // //                 </tr>
// // //               )}
// // //             </tbody>
// // //           </table>
// // //         </div>
// // //         <nav className="deliveryCRM-table-bottem">
// // //           <p className="deliveryCRM-num-entries">
// // //             Showing {currentData.length} entries
// // //           </p>
// // //           <div className="deliveryCRM-manage-control-box">
// // //             <button
// // //               className="deliveryCRM-manage-btn"
// // //               onClick={handlePrev}
// // //               disabled={deliveryCurrentPage === 1}
// // //             >
// // //               Prev
// // //             </button>
// // //             <nav className="deliveryCRM-num-page">
// // //               {" "}
// // //               Page {deliveryCurrentPage} of {totalPages}{" "}
// // //             </nav>
// // //             <button
// // //               className="deliveryCRM-manage-btn"
// // //               onClick={handleNext}
// // //               disabled={deliveryCurrentPage === totalPages}
// // //             >
// // //               Next
// // //             </button>
// // //           </div>
// // //         </nav>
// // //       </div>
// // //     </>
// // //   );
// // // }
// // import React, { useState, useEffect } from "react";
// // import "./deliveryReturnCRM.css";
// // import useDeliveryReturnStore from "./deliveryReturnStore";

// // export default function DeliveryReturnCRM({ setCurrentPage }) {

// //   // =====================================================
// //   // ZUSTAND STORE
// //   // =====================================================
// //   const {
// //     deliveryReturns,
// //     loading,
// //     currentPage,
// //     totalPages,
// //     search,
// //     setSearch,
// //     fetchDeliveryReturns,
// //     deleteDeliveryReturn,
// //   } = useDeliveryReturnStore();

// //   // =====================================================
// //   // LOCAL STATE
// //   // =====================================================
// //   const [filter, setFilter] = useState({
// //     delivery_status: "",
// //     delivery_type: "",
// //     delivery_from_date: "",
// //     delivery_to_date: "",
// //   });

// //   const [buttonAct, setButtonAct] = useState({
// //     checkbox: {},
// //     delivery_return: false,
// //     invoice: false,
// //   });

// //   // Delete modal state
// //   const [showDeleteModal, setShowDeleteModal] = useState(false);
// //   const [deleteDNRData, setDeleteDNRData] = useState(null);

// //   // =====================================================
// //   // FETCH ON MOUNT
// //   // =====================================================
// //   useEffect(() => {
// //     fetchDeliveryReturns(1, "");
// //   }, []);

// //   // =====================================================
// //   // CHECKBOX BUTTON LOGIC
// //   // =====================================================
// //   useEffect(() => {
// //     const selectedOrders = deliveryReturns.filter(
// //       (order) => buttonAct.checkbox[order.dn_id]
// //     );
// //     const hasMultiple = selectedOrders.length > 1;
// //     const firstDN_ID = selectedOrders[0]?.sales_order_ref;
// //     const sameDN_ID =
// //       hasMultiple &&
// //       selectedOrders.every((order) => order.sales_order_ref === firstDN_ID);

// //     const validStatus =
// //       hasMultiple &&
// //       selectedOrders.every(
// //         (order) =>
// //           order.status === "Partially Delivered" ||
// //           order.status === "Delivered" ||
// //           order.status === "Returned"
// //       );

// //     setButtonAct((prev) => ({
// //       ...prev,
// //       delivery_return: selectedOrders.length > 0 && validStatus && sameDN_ID,
// //       invoice: selectedOrders.length > 0 && validStatus && sameDN_ID,
// //     }));
// //   }, [buttonAct.checkbox, deliveryReturns]);

// //   // =====================================================
// //   // CHECKBOX HANDLER
// //   // =====================================================
// //   const handleCheckbox = (e, ele) => {
// //     const { checked } = e.target;
// //     setButtonAct((prev) => ({
// //       ...prev,
// //       checkbox: {
// //         ...prev.checkbox,
// //         [ele.dn_id]: checked,
// //       },
// //     }));
// //   };

// //   // =====================================================
// //   // SEARCH HANDLER
// //   // =====================================================
// //   const handleSearch = (e) => {
// //     const value = e.target.value;
// //     setSearch(value);
// //     fetchDeliveryReturns(1, value);
// //   };

// //   // =====================================================
// //   // PAGINATION HANDLERS
// //   // =====================================================
// //   const handleNext = () => {
// //     if (currentPage < totalPages) fetchDeliveryReturns(currentPage + 1, search);
// //   };

// //   const handlePrev = () => {
// //     if (currentPage > 1) fetchDeliveryReturns(currentPage - 1, search);
// //   };

// //   // =====================================================
// //   // FILTER HANDLER
// //   // =====================================================
// //   const handleClearFilter = () => {
// //     setFilter({
// //       delivery_status: "",
// //       delivery_type: "",
// //       delivery_from_date: "",
// //       delivery_to_date: "",
// //     });
// //   };

// //   // =====================================================
// //   // DELETE HANDLERS
// //   // =====================================================
// //   const handleDeleteClick = (row) => {
// //     setDeleteDNRData(row);
// //     setShowDeleteModal(true);
// //   };

// //   const confirmDelete = async () => {
// //     if (!deleteDNRData) return;
// //     await deleteDeliveryReturn(deleteDNRData.dn_id);
// //     fetchDeliveryReturns(currentPage, search);
// //     setShowDeleteModal(false);
// //     setDeleteDNRData(null);
// //   };

// //   // =====================================================
// //   // CLIENT-SIDE FILTERING
// //   // =====================================================
// //   const filteredData = deliveryReturns.filter((item) => {
// //     const matchStatus = filter.delivery_status
// //       ? item.status === filter.delivery_status
// //       : true;
// //     const matchType = filter.delivery_type
// //       ? item.delivery_type === filter.delivery_type
// //       : true;
// //     const matchFrom = filter.delivery_from_date
// //       ? new Date(item.delivery_date) >= new Date(filter.delivery_from_date)
// //       : true;
// //     const matchTo = filter.delivery_to_date
// //       ? new Date(item.delivery_date) <= new Date(filter.delivery_to_date)
// //       : true;
// //     const matchSearch =
// //       !search ||
// //       item.dn_id?.toLowerCase().includes(search.toLowerCase()) ||
// //       item.customer_name?.toLowerCase().includes(search.toLowerCase());
// //     return matchStatus && matchType && matchFrom && matchTo && matchSearch;
// //   });

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
// //           className="deliveryCRM-delete-modal"
// //           style={{
// //             maxWidth: "420px",
// //             width: "100%",
// //             paddingBottom: "10px",
// //             height: "auto",
// //             minHeight: "unset",
// //           }}
// //         >
// //           <svg
// //             className="deliveryCRM-close-icon"
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

// //           <div className="deliveryCRM-modal-head">
// //             <p>Delete Delivery Return</p>
// //           </div>

// //           <div
// //             className="deliveryCRM-modal-body"
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
// //               Are you sure you want to delete delivery return <br />
// //               <strong>{deleteDNRData?.dn_id}</strong>
// //               <br />
// //               (Customer: {deleteDNRData?.customer_name})?
// //             </p>

// //             <div
// //               className="deliveryCRM-modal-actions"
// //               style={{ justifyContent: "center", gap: "14px" }}
// //             >
// //               <button
// //                 type="button"
// //                 className="deliveryCRM-cancel-btn"
// //                 onClick={() => setShowDeleteModal(false)}
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 type="button"
// //                 className="deliveryCRM-delete-btn"
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
// //       <div className={`deliveryCRM-container ${showDeleteModal ? "blur" : ""}`}>

// //         {/* HEADER */}
// //         <div className="deliveryCRM-header">
// //           <p>Delivery Note Return List</p>
// //           <button onClick={() => setCurrentPage("createNewDeliveryReturn")}>
// //             + New Delivery Note Return
// //           </button>
// //         </div>

// //         {/* SEARCH BOX */}
// //         <div className="deliveryCRM-search-box">
// //           <label htmlFor="searchByID">
// //             <svg
// //               className="deliveryCRM-search-logo"
// //               xmlns="http://www.w3.org/2000/svg"
// //               viewBox="0 0 512 512"
// //             >
// //               <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
// //             </svg>
// //           </label>
// //           <input
// //             id="searchByID"
// //             placeholder="Search by DNR number, Customer name..."
// //             value={search}
// //             onChange={handleSearch}
// //           />
// //         </div>

// //         {/* CLEAR FILTER */}
// //         <div className="deliveryCRM-clearfilter">
// //           <p onClick={handleClearFilter}>Clear Filter</p>
// //         </div>

// //         {/* FILTERS */}
// //         <div className="deliveryCRM-search-category">

// //           {/* Status Filter */}
// //           <div className="deliveryCRM-input-box">
// //             <label htmlFor="delivery_status">DNR Status</label>
// //             <select
// //               value={filter.delivery_status}
// //               onChange={(e) =>
// //                 setFilter((prev) => ({ ...prev, delivery_status: e.target.value }))
// //               }
// //               id="delivery_status"
// //             >
// //               <option value="">All</option>
// //               <option value="Draft">Draft</option>
// //               <option value="Pending">Pending</option>
// //               <option value="In Transit">In Transit</option>
// //               <option value="Delivered">Delivered</option>
// //               <option value="Partially Delivered">Partially Delivered</option>
// //               <option value="Returned">Returned</option>
// //               <option value="Cancelled">Cancelled</option>
// //             </select>
// //           </div>

// //           {/* Delivery Type Filter */}
// //           <div className="deliveryCRM-input-box">
// //             <label htmlFor="delivery_type">Delivery Type</label>
// //             <select
// //               value={filter.delivery_type}
// //               onChange={(e) =>
// //                 setFilter((prev) => ({ ...prev, delivery_type: e.target.value }))
// //               }
// //               id="delivery_type"
// //             >
// //               <option value="">All Types</option>
// //               <option value="Regular">Regular</option>
// //               <option value="Urgent">Urgent</option>
// //               <option value="Return">Return</option>
// //             </select>
// //           </div>

// //           {/* Date Range Filter */}
// //           <div className="deliveryCRM-input-box">
// //             <label htmlFor="delivery_date">Delivery Date</label>
// //             <nav id="delivery_date">
// //               <div>
// //                 <span>From </span>
// //                 <input
// //                   value={filter.delivery_from_date}
// //                   onChange={(e) =>
// //                     setFilter((prev) => ({
// //                       ...prev,
// //                       delivery_from_date: e.target.value,
// //                     }))
// //                   }
// //                   className="deliveryCRM-date"
// //                   type="date"
// //                 />
// //               </div>
// //               <div>
// //                 <span>To </span>
// //                 <input
// //                   value={filter.delivery_to_date}
// //                   onChange={(e) =>
// //                     setFilter((prev) => ({
// //                       ...prev,
// //                       delivery_to_date: e.target.value,
// //                     }))
// //                   }
// //                   className="deliveryCRM-date"
// //                   type="date"
// //                 />
// //               </div>
// //             </nav>
// //           </div>
// //         </div>

// //         {/* TABLE */}
// //         <div className="deliveryCRM-table-cointainer">
// //           <table>
// //             <thead className="deliveryCRM-table-head">
// //               <tr>
// //                 <th></th>
// //                 <th>DNR ID</th>
// //                 <th className="deliveryCRM-maxhead-width">Invoice Return Ref.</th>
// //                 <th className="deliveryCRM-maxhead-width">Customer Name</th>
// //                 <th className="deliveryCRM-minhead-width">DNR Date</th>
// //                 <th>
// //                   <div className="deliveryCRM-status-filter">
// //                     Status
// //                     <nav className="deliveryCRM-filter-box">
// //                       <p>Newest First</p>
// //                       <p>Oldest First</p>
// //                       <p>Progressing {`(Draft → Cancelled)`}</p>
// //                       <p>Reverse Progressing{`(Cancelled → Draft)`}</p>
// //                     </nav>
// //                     <svg
// //                       xmlns="http://www.w3.org/2000/svg"
// //                       width="14"
// //                       height="18"
// //                       viewBox="0 0 14 18"
// //                       fill="none"
// //                     >
// //                       <path
// //                         d="M3.66683 12.3346H0.333496L5.3335 17.3346V0.667969H3.66683V12.3346ZM8.66683 3.16797V17.3346H10.3335V5.66797H13.6668L8.66683 0.667969V3.16797Z"
// //                         fill="#234E70"
// //                       />
// //                     </svg>
// //                   </div>
// //                 </th>
// //                 <th>Action</th>
// //               </tr>
// //             </thead>

// //             <tbody className="deliveryCRM-table-body">
// //               {loading ? (
// //                 <tr>
// //                   <td colSpan={7} style={{ textAlign: "center" }}>
// //                     Loading...
// //                   </td>
// //                 </tr>
// //               ) : filteredData.length > 0 ? (
// //                 filteredData.map((ele, ind) => (
// //                   <tr key={ind}>
// //                     <td>
// //                       <input
// //                         className="deliveryCRM-table-check"
// //                         type="checkbox"
// //                         onChange={(e) => handleCheckbox(e, ele)}
// //                         checked={!!buttonAct.checkbox[ele.dn_id]}
// //                       />
// //                     </td>
// //                     <td className="deliveryCRM-minbody-width">{ele.dn_id}</td>
// //                     <td>{ele.sales_order_ref}</td>
// //                     <td>{ele.customer_name}</td>
// //                     <td>{ele.delivery_date}</td>
// //                     <td>
// //                       <p
// //                         className={`deliveryCRM-Status ${
// //                           ele.status === "Draft"
// //                             ? "deliveryCRM-Status-draft"
// //                             : ele.status === "Delivered"
// //                             ? "deliveryCRM-Status-Delivered"
// //                             : ele.status === "Cancelled"
// //                             ? "deliveryCRM-Status-Cancelled"
// //                             : ele.status === "Partially Delivered"
// //                             ? "deliveryCRM-Status-partiallyDelivered"
// //                             : ele.status === "Returned"
// //                             ? "deliveryCRM-Status-Returned"
// //                             : ""
// //                         }`}
// //                       >
// //                         {ele.status}
// //                       </p>
// //                     </td>
// //                     <td id="deliveryCRM-table-action">
// //                       <nav className="deliveryCRM-dot-container">
// //                         <button
// //                           onClick={() => setCurrentPage("editDelivery")}
// //                         >
// //                           {ele.status === "Draft" ? "Edit" : "View"} details
// //                         </button>
// //                         <button
// //                           disabled={
// //                             ele.status === "Partially Delivered" ||
// //                             ele.status === "Delivered" ||
// //                             ele.status === "Returned"
// //                               ? false
// //                               : true
// //                           }
// //                         >
// //                           Generate Delivery Return
// //                         </button>
// //                         <button
// //                           disabled={
// //                             ele.status === "Partially Delivered" ||
// //                             ele.status === "Delivered" ||
// //                             ele.status === "Returned"
// //                               ? false
// //                               : true
// //                           }
// //                         >
// //                           Generate Invoice
// //                         </button>
// //                         <button
// //                           onClick={() => handleDeleteClick(ele)}
// //                           style={{ color: "red" }}
// //                         >
// //                           Delete
// //                         </button>
// //                       </nav>
// //                       <svg
// //                         className="deliveryCRM-delete-logo"
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
// //               ) : (
// //                 <tr>
// //                   <td colSpan={7} style={{ textAlign: "center" }}>
// //                     No Data Found
// //                   </td>
// //                 </tr>
// //               )}
// //             </tbody>
// //           </table>
// //         </div>

// //         {/* PAGINATION */}
// //         <nav className="deliveryCRM-table-bottem">
// //           <p className="deliveryCRM-num-entries">
// //             Showing {filteredData.length} entries
// //           </p>
// //           <div className="deliveryCRM-manage-control-box">
// //             <button
// //               className="deliveryCRM-manage-btn"
// //               onClick={handlePrev}
// //               disabled={currentPage <= 1}
// //             >
// //               Prev
// //             </button>
// //             <nav className="deliveryCRM-num-page">
// //               Page {currentPage} of {totalPages}
// //             </nav>
// //             <button
// //               className="deliveryCRM-manage-btn"
// //               onClick={handleNext}
// //               disabled={currentPage >= totalPages}
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
// import "./deliveryReturnCRM.css";
// import useDeliveryReturnStore from "./deliveryReturnStore";

// export default function DeliveryReturnCRM({ setCurrentPage }) {

//   const {
//     deliveryReturns,
//     loading,
//     currentPage,
//     totalPages,
//     search,
//     setSearch,
//     fetchDeliveryReturns,
//     deleteDeliveryReturn,
//   } = useDeliveryReturnStore();

//   const [filter, setFilter] = useState({
//     delivery_status: "",
//     delivery_type: "",
//     delivery_from_date: "",
//     delivery_to_date: "",
//   });

//   const [buttonAct, setButtonAct] = useState({
//     checkbox: {},
//     delivery_return: false,
//     invoice: false,
//   });

//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteDNRData, setDeleteDNRData] = useState(null);

//   // ── Kebab menu state ──────────────────────────────
//   const [openMenuId, setOpenMenuId] = useState(null);

//   // ── Fetch on mount ────────────────────────────────
//   useEffect(() => {
//     fetchDeliveryReturns(1, "");
//   }, []);

//   // ── Close kebab on outside click ──────────────────
//   useEffect(() => {
//     const close = () => setOpenMenuId(null);
//     document.addEventListener("click", close);
//     return () => document.removeEventListener("click", close);
//   }, []);

//   // ── Checkbox button logic ─────────────────────────
//   useEffect(() => {
//     const selectedOrders = deliveryReturns.filter(
//       (order) => buttonAct.checkbox[order.dn_id]
//     );
//     const hasMultiple = selectedOrders.length > 1;
//     const firstRef = selectedOrders[0]?.invoice_return_ref;
//     const sameDN_ID =
//       hasMultiple &&
//       selectedOrders.every((o) => o.invoice_return_ref === firstRef);
//     const validStatus =
//       hasMultiple &&
//       selectedOrders.every(
//         (o) =>
//           o.status === "Partially Delivered" ||
//           o.status === "Delivered" ||
//           o.status === "Returned"
//       );
//     setButtonAct((prev) => ({
//       ...prev,
//       delivery_return: selectedOrders.length > 0 && validStatus && sameDN_ID,
//       invoice: selectedOrders.length > 0 && validStatus && sameDN_ID,
//     }));
//   }, [buttonAct.checkbox, deliveryReturns]);

//   const handleCheckbox = (e, ele) => {
//     const { checked } = e.target;
//     setButtonAct((prev) => ({
//       ...prev,
//       checkbox: { ...prev.checkbox, [ele.dn_id]: checked },
//     }));
//   };

//   const handleSearch = (e) => {
//     const value = e.target.value;
//     setSearch(value);
//     fetchDeliveryReturns(1, value);
//   };

//   const handleNext = () => {
//     if (currentPage < totalPages) fetchDeliveryReturns(currentPage + 1, search);
//   };
//   const handlePrev = () => {
//     if (currentPage > 1) fetchDeliveryReturns(currentPage - 1, search);
//   };

//   const handleClearFilter = () => {
//     setFilter({
//       delivery_status: "",
//       delivery_type: "",
//       delivery_from_date: "",
//       delivery_to_date: "",
//     });
//   };

//   const handleDeleteClick = (row) => {
//     setOpenMenuId(null);
//     setDeleteDNRData(row);
//     setShowDeleteModal(true);
//   };

//   const confirmDelete = async () => {
//     if (!deleteDNRData) return;
//     await deleteDeliveryReturn(deleteDNRData.dn_id);
//     fetchDeliveryReturns(currentPage, search);
//     setShowDeleteModal(false);
//     setDeleteDNRData(null);
//   };

//   // ── Client-side filter ────────────────────────────
//   const filteredData = deliveryReturns.filter((item) => {
//     const matchStatus = filter.delivery_status
//       ? item.status === filter.delivery_status
//       : true;
//     const matchType = filter.delivery_type
//       ? item.delivery_type === filter.delivery_type
//       : true;
//     const matchFrom = filter.delivery_from_date
//       ? new Date(item.delivery_date) >= new Date(filter.delivery_from_date)
//       : true;
//     const matchTo = filter.delivery_to_date
//       ? new Date(item.delivery_date) <= new Date(filter.delivery_to_date)
//       : true;
//     const matchSearch =
//       !search ||
//       item.dn_id?.toLowerCase().includes(search.toLowerCase()) ||
//       item.customer_name?.toLowerCase().includes(search.toLowerCase());
//     return matchStatus && matchType && matchFrom && matchTo && matchSearch;
//   });

//   // ── Reusable valid-status check ───────────────────
//   const isActionable = (status) =>
//     ["Partially Delivered", "Delivered", "Returned"].includes(status);

//   return (
//     <>
//       {/* ── Delete Modal ─────────────────────────────── */}
//       {showDeleteModal && (
//         <>
//           <div
//             onClick={() => setShowDeleteModal(false)}
//             style={{
//               position: "fixed",
//               inset: 0,
//               background: "rgba(0,0,0,0.4)",
//               zIndex: 999,
//             }}
//           />
//           <div
//             style={{
//               position: "fixed",
//               top: "50%",
//               left: "50%",
//               transform: "translate(-50%,-50%)",
//               background: "#fff",
//               borderRadius: "10px",
//               width: "400px",
//               padding: "28px 24px",
//               zIndex: 1000,
//               boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
//             }}
//           >
//             <p
//               style={{
//                 fontWeight: 600,
//                 fontSize: "17px",
//                 textAlign: "center",
//                 marginBottom: "14px",
//               }}
//             >
//               Delete Delivery Return
//             </p>
//             <p
//               style={{
//                 textAlign: "center",
//                 fontSize: "14px",
//                 lineHeight: "22px",
//                 marginBottom: "24px",
//                 color: "#444",
//               }}
//             >
//               Are you sure you want to delete <br />
//               <strong>{deleteDNRData?.dn_id}</strong>
//               <br />
//               <span style={{ color: "#888" }}>
//                 Customer: {deleteDNRData?.customer_name}
//               </span>
//             </p>
//             <div
//               style={{ display: "flex", justifyContent: "center", gap: "12px" }}
//             >
//               <button
//                 onClick={() => setShowDeleteModal(false)}
//                 style={{
//                   padding: "8px 24px",
//                   borderRadius: "6px",
//                   border: "1px solid #ccc",
//                   background: "#f5f5f5",
//                   cursor: "pointer",
//                   fontWeight: 500,
//                 }}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmDelete}
//                 style={{
//                   padding: "8px 24px",
//                   borderRadius: "6px",
//                   border: "none",
//                   background: "#e53935",
//                   color: "#fff",
//                   cursor: "pointer",
//                   fontWeight: 500,
//                 }}
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </>
//       )}

//       {/* ── Main Container ──────────────────────────── */}
//       <div className="deliveryCRM-container">

//         {/* HEADER */}
//         <div className="deliveryCRM-header">
//           <p>Delivery Note Return List</p>
//           <button onClick={() => setCurrentPage("createNewDeliveryReturn")}>
//             + New Delivery Note Return
//           </button>
//         </div>

//         {/* SEARCH */}
//         <div className="deliveryCRM-search-box">
//           <label htmlFor="searchByID">
//             <svg
//               className="deliveryCRM-search-logo"
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 512 512"
//             >
//               <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
//             </svg>
//           </label>
//           <input
//             id="searchByID"
//             placeholder="Search by DNR number, Customer name..."
//             value={search}
//             onChange={handleSearch}
//           />
//         </div>

//         {/* CLEAR FILTER */}
//         <div className="deliveryCRM-clearfilter">
//           <p onClick={handleClearFilter}>Clear Filter</p>
//         </div>

//         {/* FILTERS */}
//         <div className="deliveryCRM-search-category">
//           <div className="deliveryCRM-input-box">
//             <label htmlFor="delivery_status">DNR Status</label>
//             <select
//               value={filter.delivery_status}
//               onChange={(e) =>
//                 setFilter((p) => ({ ...p, delivery_status: e.target.value }))
//               }
//               id="delivery_status"
//             >
//               <option value="">All</option>
//               <option value="Draft">Draft</option>
//               <option value="Pending">Pending</option>
//               <option value="In Transit">In Transit</option>
//               <option value="Delivered">Delivered</option>
//               <option value="Partially Delivered">Partially Delivered</option>
//               <option value="Returned">Returned</option>
//               <option value="Cancelled">Cancelled</option>
//             </select>
//           </div>

//           <div className="deliveryCRM-input-box">
//             <label htmlFor="delivery_type">Delivery Type</label>
//             <select
//               value={filter.delivery_type}
//               onChange={(e) =>
//                 setFilter((p) => ({ ...p, delivery_type: e.target.value }))
//               }
//               id="delivery_type"
//             >
//               <option value="">All Types</option>
//               <option value="Regular">Regular</option>
//               <option value="Urgent">Urgent</option>
//               <option value="Return">Return</option>
//             </select>
//           </div>

//           <div className="deliveryCRM-input-box">
//             <label>Delivery Date</label>
//             <nav id="delivery_date">
//               <div>
//                 <span>From </span>
//                 <input
//                   value={filter.delivery_from_date}
//                   onChange={(e) =>
//                     setFilter((p) => ({
//                       ...p,
//                       delivery_from_date: e.target.value,
//                     }))
//                   }
//                   className="deliveryCRM-date"
//                   type="date"
//                 />
//               </div>
//               <div>
//                 <span>To </span>
//                 <input
//                   value={filter.delivery_to_date}
//                   onChange={(e) =>
//                     setFilter((p) => ({
//                       ...p,
//                       delivery_to_date: e.target.value,
//                     }))
//                   }
//                   className="deliveryCRM-date"
//                   type="date"
//                 />
//               </div>
//             </nav>
//           </div>
//         </div>

//         {/* TABLE */}
//         <div className="deliveryCRM-table-cointainer">
//           <table>
//             <thead className="deliveryCRM-table-head">
//               <tr>
//                 <th></th>
//                 <th>DNR ID</th>
//                 <th className="deliveryCRM-maxhead-width">
//                   Invoice Return Ref.
//                 </th>
//                 <th className="deliveryCRM-maxhead-width">Customer Name</th>
//                 <th className="deliveryCRM-minhead-width">DNR Date</th>
//                 <th>
//                   <div className="deliveryCRM-status-filter">
//                     Status
//                     <nav className="deliveryCRM-filter-box">
//                       <p>Newest First</p>
//                       <p>Oldest First</p>
//                       <p>Progressing {`(Draft → Cancelled)`}</p>
//                       <p>Reverse Progressing {`(Cancelled → Draft)`}</p>
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
//                 <th>Action</th>
//               </tr>
//             </thead>

//             <tbody className="deliveryCRM-table-body">
//               {loading ? (
//                 <tr>
//                   <td
//                     colSpan={7}
//                     style={{ textAlign: "center", padding: "20px" }}
//                   >
//                     Loading...
//                   </td>
//                 </tr>
//               ) : filteredData.length > 0 ? (
//                 filteredData.map((ele, ind) => (
//                   <tr key={ele.dn_id || ind}>
//                     <td>
//                       <input
//                         className="deliveryCRM-table-check"
//                         type="checkbox"
//                         onChange={(e) => handleCheckbox(e, ele)}
//                         checked={!!buttonAct.checkbox[ele.dn_id]}
//                       />
//                     </td>
//                     <td className="deliveryCRM-minbody-width">{ele.dn_id}</td>
//                     <td>{ele.invoice_return_ref}</td>
//                     <td>{ele.customer_name}</td>
//                     <td>{ele.delivery_date}</td>
//                     <td>
//                       <p
//                         className={`deliveryCRM-Status ${
//                           ele.status === "Draft"
//                             ? "deliveryCRM-Status-draft"
//                             : ele.status === "Delivered"
//                             ? "deliveryCRM-Status-Delivered"
//                             : ele.status === "Cancelled"
//                             ? "deliveryCRM-Status-Cancelled"
//                             : ele.status === "Partially Delivered"
//                             ? "deliveryCRM-Status-partiallyDelivered"
//                             : ele.status === "Returned"
//                             ? "deliveryCRM-Status-Returned"
//                             : ""
//                         }`}
//                       >
//                         {ele.status}
//                       </p>
//                     </td>

//                     {/* ── Kebab Action Menu ── */}
//                     <td style={{ position: "relative", textAlign: "center" }}>
//                       {/* 3-dot trigger */}
//                       <div
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setOpenMenuId(
//                             openMenuId === ele.dn_id ? null : ele.dn_id
//                           );
//                         }}
//                         style={{
//                           display: "inline-flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           width: "32px",
//                           height: "32px",
//                           borderRadius: "50%",
//                           cursor: "pointer",
//                           background:
//                             openMenuId === ele.dn_id
//                               ? "#f0f0f0"
//                               : "transparent",
//                         }}
//                       >
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           viewBox="0 0 24 24"
//                           style={{ width: "18px", height: "18px", fill: "#555" }}
//                         >
//                           <path d="M12 16C12.5304 16 13.0391 16.2107 13.4142 16.5858C13.7893 16.9609 14 17.4696 14 18C14 18.5304 13.7893 19.0391 13.4142 19.4142C13.0391 19.7893 12.5304 20 12 20C11.4696 20 10.9609 19.7893 10.5858 19.4142C10.2107 19.0391 10 18.5304 10 18C10 17.4696 10.2107 16.9609 10.5858 16.5858C10.9609 16.2107 11.4696 16 12 16ZM12 10C12.5304 10 13.0391 10.2107 13.4142 10.5858C13.7893 10.9609 14 11.4696 14 12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14C11.4696 14 10.9609 13.7893 10.5858 13.4142C10.2107 13.0391 10 12.5304 10 12C10 11.4696 10.2107 10.9609 10.5858 10.5858C10.9609 10.2107 11.4696 10 12 10ZM12 4C12.5304 4 13.0391 4.21071 13.4142 4.58579C13.7893 4.96086 14 5.46957 14 6C14 6.53043 13.7893 7.03914 13.4142 7.41421C13.0391 7.78929 12.5304 8 12 8C11.4696 8 10.9609 7.78929 10.5858 7.41421C10.2107 7.03914 10 6.53043 10 6C10 5.46957 10.2107 4.96086 10.5858 4.58579C10.9609 4.21071 11.4696 4 12 4Z" />
//                         </svg>
//                       </div>

//                       {/* Dropdown */}
//                       {openMenuId === ele.dn_id && (
//                         <div
//                           onClick={(e) => e.stopPropagation()}
//                           style={{
//                             position: "absolute",
//                             top: "38px",
//                             right: "8px",
//                             background: "#fff",
//                             border: "1px solid #e0e0e0",
//                             borderRadius: "8px",
//                             boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
//                             zIndex: 999,
//                             minWidth: "160px",
//                             overflow: "hidden",
//                           }}
//                         >
//                           {/* View / Edit */}
//                           <div
//                             onClick={() => {
//                               setOpenMenuId(null);
//                               setCurrentPage("editDeliveryReturn");
//                             }}
//                             style={{
//                               padding: "10px 16px",
//                               cursor: "pointer",
//                               fontSize: "14px",
//                               color: "#333",
//                             }}
//                             onMouseEnter={(e) =>
//                               (e.currentTarget.style.background = "#f5f5f5")
//                             }
//                             onMouseLeave={(e) =>
//                               (e.currentTarget.style.background = "transparent")
//                             }
//                           >
//                             {ele.status === "Draft" ? "✏️ Edit" : "👁️ View"}{" "}
//                             Details
//                           </div>

//                           <div
//                             style={{ height: "1px", background: "#f0f0f0" }}
//                           />

//                           {/* Generate Invoice */}
//                           <div
//                             onClick={() => {
//                               if (isActionable(ele.status)) {
//                                 setOpenMenuId(null);
//                                 // handle generate invoice
//                               }
//                             }}
//                             style={{
//                               padding: "10px 16px",
//                               cursor: isActionable(ele.status)
//                                 ? "pointer"
//                                 : "not-allowed",
//                               fontSize: "14px",
//                               color: isActionable(ele.status) ? "#333" : "#bbb",
//                             }}
//                             onMouseEnter={(e) => {
//                               if (isActionable(ele.status))
//                                 e.currentTarget.style.background = "#f5f5f5";
//                             }}
//                             onMouseLeave={(e) =>
//                               (e.currentTarget.style.background = "transparent")
//                             }
//                           >
//                             🧾 Generate Invoice
//                           </div>

//                           <div
//                             style={{ height: "1px", background: "#f0f0f0" }}
//                           />

//                           {/* Delete */}
//                           <div
//                             onClick={() => handleDeleteClick(ele)}
//                             style={{
//                               padding: "10px 16px",
//                               cursor: "pointer",
//                               fontSize: "14px",
//                               color: "#e53935",
//                             }}
//                             onMouseEnter={(e) =>
//                               (e.currentTarget.style.background = "#fff5f5")
//                             }
//                             onMouseLeave={(e) =>
//                               (e.currentTarget.style.background = "transparent")
//                             }
//                           >
//                             🗑️ Delete
//                           </div>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan={7}
//                     style={{ textAlign: "center", padding: "20px" }}
//                   >
//                     No Data Found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* PAGINATION */}
//         <nav className="deliveryCRM-table-bottem">
//           <p className="deliveryCRM-num-entries">
//             Showing {filteredData.length} entries
//           </p>
//           <div className="deliveryCRM-manage-control-box">
//             <button
//               className="deliveryCRM-manage-btn"
//               onClick={handlePrev}
//               disabled={currentPage <= 1}
//             >
//               Prev
//             </button>
//             <nav className="deliveryCRM-num-page">
//               Page {currentPage} of {totalPages}
//             </nav>
//             <button
//               className="deliveryCRM-manage-btn"
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
import "./deliveryReturnCRM.css";
import useDeliveryReturnStore from "./deliveryReturnStore";

export default function DeliveryReturnCRM({ setCurrentPage }) {
  const {
    deliveryReturns, loading, currentPage, totalPages,
    search, setSearch, fetchDeliveryReturns, deleteDeliveryReturn,
  } = useDeliveryReturnStore();

  const [filter, setFilter] = useState({
    status: "", from_date: "", to_date: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteDNRData,   setDeleteDNRData]   = useState(null);
  const [openMenuId,      setOpenMenuId]       = useState(null);

  useEffect(() => { fetchDeliveryReturns(1, ""); }, []);

  useEffect(() => {
    const close = () => setOpenMenuId(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const handleSearch = (e) => {
    const v = e.target.value;
    setSearch(v);
    fetchDeliveryReturns(1, v);
  };

  const handleNext = () => {
    if (currentPage < totalPages) fetchDeliveryReturns(currentPage + 1, search);
  };
  const handlePrev = () => {
    if (currentPage > 1) fetchDeliveryReturns(currentPage - 1, search);
  };

  const handleDeleteClick = (row) => {
    setOpenMenuId(null);
    setDeleteDNRData(row);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteDNRData) return;
    await deleteDeliveryReturn(deleteDNRData.id || deleteDNRData.dn_id);
    fetchDeliveryReturns(currentPage, search);
    setShowDeleteModal(false);
    setDeleteDNRData(null);
  };

  const filteredData = deliveryReturns.filter((item) => {
    const matchStatus = filter.status ? item.status === filter.status : true;
    const matchFrom   = filter.from_date
      ? new Date(item.delivery_date) >= new Date(filter.from_date) : true;
    const matchTo     = filter.to_date
      ? new Date(item.delivery_date) <= new Date(filter.to_date)   : true;
    const matchSearch = !search ||
      item.dn_id?.toString().toLowerCase().includes(search.toLowerCase()) ||
      item.customer_name?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchFrom && matchTo && matchSearch;
  });

  return (
    <>
      {/* ── Delete Modal ────────────────────────────────────────────── */}
      {showDeleteModal && (
        <>
          <div
            onClick={() => setShowDeleteModal(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 999 }}
          />
          <div style={{
            position: "fixed", top: "50%", left: "50%",
            transform: "translate(-50%,-50%)", background: "#fff",
            borderRadius: "10px", width: "400px", padding: "28px 24px",
            zIndex: 1000, boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          }}>
            <p style={{ fontWeight: 600, fontSize: "17px", textAlign: "center", marginBottom: "14px" }}>
              Delete Delivery Return
            </p>
            <p style={{ textAlign: "center", fontSize: "14px", lineHeight: "22px", marginBottom: "24px", color: "#444" }}>
              Are you sure you want to delete <br />
              <strong>{deleteDNRData?.dn_id}</strong>
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

      <div className="deliveryCRM-container">
        <div className="deliveryCRM-header">
          <p>Delivery Note Returns</p>
          {/* ✅ create — no data */}
          <button onClick={() => setCurrentPage("deliveryReturnForm", null)}>
            + New Delivery Return
          </button>
        </div>

        <div className="deliveryCRM-search-box">
          <label htmlFor="searchDNR">
            <svg className="deliveryCRM-search-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
            </svg>
          </label>
          <input id="searchDNR" placeholder="Search by DNR ID, Customer..." value={search} onChange={handleSearch} />
        </div>

        <div className="deliveryCRM-clearfilter">
          <p onClick={() => setFilter({ status: "", from_date: "", to_date: "" })}>Clear Filter</p>
        </div>

        <div className="deliveryCRM-search-category">
          <div className="deliveryCRM-input-box">
            <label>Status</label>
            <select value={filter.status} onChange={(e) => setFilter((p) => ({ ...p, status: e.target.value }))}>
              <option value="">All</option>
              <option value="Draft">Draft</option>
              <option value="Submitted">Submitted</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="deliveryCRM-input-box">
            <label>Date Range</label>
            <nav style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span style={{ fontSize: "12px" }}>From</span>
              <input className="deliveryCRM-date" type="date"
                value={filter.from_date}
                onChange={(e) => setFilter((p) => ({ ...p, from_date: e.target.value }))} />
              <span style={{ fontSize: "12px" }}>To</span>
              <input className="deliveryCRM-date" type="date"
                value={filter.to_date}
                onChange={(e) => setFilter((p) => ({ ...p, to_date: e.target.value }))} />
            </nav>
          </div>
        </div>

        <div className="deliveryCRM-table-cointainer">
          <table>
            <thead className="deliveryCRM-table-head">
              <tr>
                <th>DNR ID</th>
                <th className="deliveryCRM-maxhead-width">Invoice Return Ref.</th>
                <th className="deliveryCRM-maxhead-width">Customer Name</th>
                <th className="deliveryCRM-minhead-width">DNR Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="deliveryCRM-table-body">
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: "20px" }}>Loading...</td></tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((ele, ind) => (
                  <tr key={ele.id || ind}>
                    <td>{ele.dn_id}</td>
                    <td>{ele.invoice_return_ref}</td>
                    <td>{ele.customer_name}</td>
                    <td>{ele.delivery_date}</td>
                    <td>
                      <p className={`deliveryCRM-Status ${
                        ele.status === "Draft"      ? "deliveryCRM-Status-draft"     :
                        ele.status === "Submitted"  ? "deliveryCRM-Status-submitted" :
                        ele.status === "Cancelled"  ? "deliveryCRM-Status-Cancelled" : ""
                      }`}>{ele.status}</p>
                    </td>
                    <td style={{ position: "relative", textAlign: "center" }}>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === ele.id ? null : ele.id);
                        }}
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
                          zIndex: 999, minWidth: "160px", overflow: "hidden",
                        }}>
                          {/* ✅ edit — pass full row */}
                          <div
                            onClick={() => { setOpenMenuId(null); setCurrentPage("deliveryReturnForm", ele); }}
                            style={{ padding: "10px 16px", cursor: "pointer", fontSize: "14px", color: "#333" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            {ele.status === "Draft" ? "✏️ Edit" : "👁️ View"} Details
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
                <tr><td colSpan={6} style={{ textAlign: "center", padding: "20px" }}>No Data Found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <nav className="deliveryCRM-table-bottem">
          <p className="deliveryCRM-num-entries">Showing {filteredData.length} entries</p>
          <div className="deliveryCRM-manage-control-box">
            <button className="deliveryCRM-manage-btn" onClick={handlePrev} disabled={currentPage <= 1}>Prev</button>
            <nav className="deliveryCRM-num-page">Page {currentPage} of {totalPages}</nav>
            <button className="deliveryCRM-manage-btn" onClick={handleNext} disabled={currentPage >= totalPages}>Next</button>
          </div>
        </nav>
      </div>
    </>
  );
}