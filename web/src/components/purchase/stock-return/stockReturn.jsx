// // import React, { useEffect, useState } from "react";
// // import "./stockReturn.css";

// // export default function stockReturn({ setCurrentPage }) {
// //   const [returnCurrentPage, setReturnCurrentPage] = useState(1);
// //   const retuenPerPage = 10;

// //   const [ApiReturn, setApiReturn] = useState({});
// //   const [returnData, setReturnData] = useState([]);
// //   const returnFromAPI = {
// //     returnData: [
// //       {
// //         srn_id: "SRN-0001",
// //         grn_ref: "GRN-0001",
// //         return_date: "28-05-2025",
// //         supplier_name: "Mandy",
// //         return_initiated_by: "Kamal",
// //         status: "Draft",
// //       },
// //       {
// //         srn_id: "SRN-0002",
// //         grn_ref: "GRN-0002",
// //         return_date: "28-05-2025",
// //         supplier_name: "Mandy",
// //         return_initiated_by: "Kamal",
// //         status: "Draft",
// //       },
// //       {
// //         srn_id: "SRN-0003",
// //         grn_ref: "GRN-0003",
// //         return_date: "28-05-2025",
// //         supplier_name: "Mandy",
// //         return_initiated_by: "Kamal",
// //         status: "Submitted",
// //       },
// //       {
// //         srn_id: "SRN-0004",
// //         grn_ref: "GRN-0004",
// //         return_date: "28-05-2025",
// //         supplier_name: "Mandy",
// //         return_initiated_by: "Kamal",
// //         status: "Cancelled",
// //       },
// //       {
// //         srn_id: "SRN-0005",
// //         grn_ref: "GRN-0005",
// //         return_date: "28-05-2025",
// //         supplier_name: "Mandy",
// //         return_initiated_by: "Kamal",
// //         status: "Submitted(PR)",
// //       },
// //       {
// //         srn_id: "SRN-0005",
// //         grn_ref: "GRN-0005",
// //         return_date: "28-05-2025",
// //         supplier_name: "Mandy",
// //         return_initiated_by: "Kamal",
// //         status: "Submitted(PR)",
// //       },
// //       {
// //         srn_id: "SRN-0005",
// //         grn_ref: "GRN-0005",
// //         return_date: "28-05-2025",
// //         supplier_name: "Mandy",
// //         return_initiated_by: "Kamal",
// //         status: "Submitted(PR)",
// //       },
// //       {
// //         srn_id: "SRN-0005",
// //         grn_ref: "GRN-0005",
// //         return_date: "28-05-2025",
// //         supplier_name: "Mandy",
// //         return_initiated_by: "Kamal",
// //         status: "Submitted(PR)",
// //       },
// //       {
// //         srn_id: "SRN-0005",
// //         grn_ref: "GRN-0005",
// //         return_date: "28-05-2025",
// //         supplier_name: "Mandy",
// //         return_initiated_by: "Kamal",
// //         status: "Submitted(PR)",
// //       },
// //       {
// //         srn_id: "SRN-0005",
// //         grn_ref: "GRN-0005",
// //         return_date: "28-05-2025",
// //         supplier_name: "Mandy",
// //         return_initiated_by: "Kamal",
// //         status: "Submitted(PR)",
// //       },
// //       {
// //         srn_id: "SRN-0005",
// //         grn_ref: "GRN-0005",
// //         return_date: "28-05-2025",
// //         supplier_name: "Mandy",
// //         return_initiated_by: "Kamal",
// //         status: "Submitted(PR)",
// //       },
// //     ],
// //   };
// //   useEffect(() => {
// //     setApiReturn(returnFromAPI);
// //   }, []);
// //   useEffect(() => {
// //     if (Object.keys(ApiReturn).length > 0) {
// //       setReturnData(ApiReturn.returnData);
// //     }
// //   }, [ApiReturn]);

// //   const [filter, setFilter] = useState({
// //     status: "",
// //     supplier_name: "",
// //     return_from_date: "",
// //     return_to_date: "",
// //   });

// //   //page calculation
// //   const totalPages = Math.ceil(returnData.length / retuenPerPage);

// //   const currentData = returnData.slice(
// //     (returnCurrentPage - 1) * retuenPerPage,
// //     returnCurrentPage * retuenPerPage
// //   );

// //   const handleNext = () => {
// //     if (returnCurrentPage < totalPages) {
// //       setReturnCurrentPage((prev) => prev + 1);
// //     }
// //   };
// //   const handlePrev = () => {
// //     if (returnCurrentPage > 1) {
// //       setReturnCurrentPage((prev) => prev - 1);
// //     }
// //   };

// //   const handleClearFilter = () => {
// //     setFilter({
// //       status: "",
// //       supplier_name: "",
// //       return_from_date: "",
// //       return_to_date: "",
// //     });
// //   };
// //   return (
// //     <>
// //       <div className="stockReturn-container">
// //         <div className="stockReturn-header">
// //           <p>Stock Return Note</p>
// //           <button
// //             onClick={() => {
// //               setCurrentPage("createNewStockReturn");
// //             }}
// //           >
// //             + New Stock Return
// //           </button>
// //         </div>
// //         <div className="stockReturn-search-box">
// //           <label htmlFor="">
// //             <svg
// //               id="searchByID"
// //               className="stockReturn-search-logo"
// //               xmlns="http://www.w3.org/2000/svg"
// //               viewBox="0 0 512 512"
// //             >
// //               <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
// //             </svg>
// //           </label>
// //           <input
// //             id="searchByID"
// //             placeholder="Search by Stock Return ID, Supplier name...."
// //           />
// //         </div>
// //         <div className="stockReturn-clearfilter">
// //           <p onClick={handleClearFilter}>Clear Filter</p>
// //         </div>
// //         <div className="stockReturn-search-category">
// //           <div className="stockReturn-input-box">
// //             <label htmlFor="supplier_name">Supplier name</label>
// //             <select
// //               value={filter.supplier_name}
// //               onChange={(e) => {
// //                 setFilter((prev) => ({
// //                   ...prev,
// //                   supplier_name: e.target.value,
// //                 }));
// //               }}
// //               id="supplier_name"
// //             >
// //               <option value="">Select name</option>
// //               <option value="All">All</option>
// //               <option value="Supplier 1">Supplier 1</option>
// //               <option value="Supplier 2">Supplier 2</option>
// //             </select>
// //           </div>
// //           <div className="stockReturn-input-box">
// //             <label htmlFor="status">Status</label>
// //             <select
// //               value={filter.status}
// //               onChange={(e) => {
// //                 setFilter((prev) => ({
// //                   ...prev,
// //                   status: e.target.value,
// //                 }));
// //               }}
// //               id="status"
// //             >
// //               <option value="">select status</option>
// //               <option value="All">All</option>
// //               <option value="Draft">Draft</option>
// //               <option value="Submitted">Submitted</option>
// //               <option value="Submitted (PR)">Submitted (PR)</option>
// //               <option value="Returned">Returned</option>
// //               <option value="Cancelled">Cancelled</option>
// //             </select>
// //           </div>
// //           <div className="stockReturn-input-box">
// //             <label htmlFor="received_date">Received Date</label>
// //             <nav id="received_date">
// //               <div>
// //                 <span>From </span>
// //                 <input
// //                   value={filter.return_from_date}
// //                   onChange={(e) => {
// //                     setFilter((prev) => ({
// //                       ...prev,
// //                       return_from_date: e.target.value,
// //                     }));
// //                   }}
// //                   className="stockReturn-date"
// //                   type="date"
// //                 />
// //               </div>
// //               <div>
// //                 <span>to </span>
// //                 <input
// //                   value={filter.return_to_date}
// //                   onChange={(e) => {
// //                     setFilter((prev) => ({
// //                       ...prev,
// //                       return_to_date: e.target.value,
// //                     }));
// //                   }}
// //                   className="stockReturn-date"
// //                   type="date"
// //                 />
// //               </div>
// //             </nav>
// //           </div>
// //         </div>
// //         <div className="stockReturn-table-cointainer">
// //           <table>
// //             <thead className="stockReturn-table-head">
// //               <tr>
// //                 <th>
// //                   <pre>SRN ID</pre>
// //                 </th>
// //                 <th>
// //                   <pre>GRN Ref.</pre>
// //                 </th>
// //                 <th>
// //                   <pre>Return Date</pre>
// //                 </th>
// //                 <th>
// //                   <pre>Supplier Name</pre>
// //                 </th>
// //                 <th>
// //                   <pre>Return Initiated By</pre>
// //                 </th>
// //                 <th>Status</th>
// //                 <th>Action</th>
// //               </tr>
// //             </thead>
// //             <tbody className="stockReturn-table-body">
// //               {currentData.length > 0 ? (
// //                 currentData.map((ele, ind) => (
// //                   <tr key={ind}>
// //                     <td>{ele.srn_id}</td>
// //                     <td>{ele.grn_ref}</td>
// //                     <td>{ele.return_date}</td>
// //                     <td>{ele.supplier_name}</td>
// //                     <td>{ele.return_initiated_by}</td>
// //                     <td>
// //                       <p
// //                         className={`stockReturn-Status ${
// //                           ele.status === "Draft"
// //                             ? "stockReturn-Status-draft"
// //                             : ele.status === "Submitted"
// //                             ? "stockReturn-Status-Submitted"
// //                             : ele.status === "Cancelled"
// //                             ? "stockReturn-Status-Cancelled"
// //                             : ele.status === "Returned"
// //                             ? "stockReturn-Status-Returned"
// //                             : ele.status === "Submitted(PR)"
// //                             ? "stockReturn-Status-Submitted-PR"
// //                             : ""
// //                         }`}
// //                       >
// //                         {ele.status}
// //                       </p>
// //                     </td>
// //                     <td id="stockReturn-table-action">
// //                       <nav className="stockReturn-dot-container">
// //                         <button
// //                           onClick={() => {
// //                             navigate(`/?tab=editNewSales/${ele.srn_id}`);
// //                             setCurrentPage("editStockReturn");
// //                           }}
// //                         >
// //                           {ele.status === "Draft" ? "Edit" : "View"} details
// //                         </button>
// //                         <button disabled={ele.status !== "Submitted"}>
// //                           View Debit note
// //                         </button>
// //                       </nav>
// //                       <svg
// //                         className="stockReturn-delete-logo"
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
// //                   <td></td>
// //                   <td>
// //                     <pre>No Data Found</pre>
// //                   </td>
// //                 </tr>
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
// //         <nav className="stockReturn-table-bottem">
// //           <p className="stockReturn-num-entries">
// //             Showing {currentData.length} entries
// //           </p>
// //           <div className="stockReturn-manage-control-box">
// //             <button
// //               className="stockReturn-manage-btn"
// //               onClick={handlePrev}
// //               disabled={returnCurrentPage === 1}
// //             >
// //               Prev
// //             </button>
// //             <nav className="stockReturn-num-page">
// //               {" "}
// //               Page {returnCurrentPage} of {totalPages}{" "}
// //             </nav>
// //             <button
// //               className="stockReturn-manage-btn"
// //               onClick={handleNext}
// //               disabled={returnCurrentPage === totalPages}
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
// import "./stockReturn.css";
// import { useNavigate } from "react-router-dom";
// import useStockReturnStore from "./stockReturnStore";

// export default function StockReturn({ setCurrentPage }) {
//   const navigate = useNavigate();

//   // =====================================================
//   // ZUSTAND STORE
//   // =====================================================
//   const {
//     stockReturns,
//     loading,
//     currentPage,
//     totalPages,
//     search,
//     setSearch,
//     fetchStockReturns,
//     deleteStockReturn,
//   } = useStockReturnStore();

//   // =====================================================
//   // LOCAL STATE
//   // =====================================================
//   const [filter, setFilter] = useState({
//     status: "",
//     supplier_name: "",
//     return_from_date: "",
//     return_to_date: "",
//   });

//   const [supplierList, setSupplierList] = useState([]);

//   // Delete modal state
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteSRNData, setDeleteSRNData] = useState(null);

//   // =====================================================
//   // FETCH ON MOUNT
//   // =====================================================
//   useEffect(() => {
//     fetchStockReturns(1, "");
//   }, []);

//   // =====================================================
//   // EXTRACT UNIQUE SUPPLIERS FROM API DATA
//   // =====================================================
//   useEffect(() => {
//     if (stockReturns.length > 0) {
//       const uniqueSuppliers = [
//         ...new Set(stockReturns.map((sr) => sr.supplier_name)),
//       ];
//       setSupplierList(uniqueSuppliers);
//     }
//   }, [stockReturns]);

//   // =====================================================
//   // SEARCH HANDLER
//   // =====================================================
//   const handleSearch = (e) => {
//     const value = e.target.value;
//     setSearch(value);
//     fetchStockReturns(1, value);
//   };

//   // =====================================================
//   // PAGINATION HANDLERS
//   // =====================================================
//   const handleNext = () => {
//     if (currentPage < totalPages) {
//       fetchStockReturns(currentPage + 1, search);
//     }
//   };

//   const handlePrev = () => {
//     if (currentPage > 1) {
//       fetchStockReturns(currentPage - 1, search);
//     }
//   };

//   // =====================================================
//   // FILTER HANDLER
//   // =====================================================
//   const handleClearFilter = () => {
//     setFilter({
//       status: "",
//       supplier_name: "",
//       return_from_date: "",
//       return_to_date: "",
//     });
//   };

//   // =====================================================
//   // DELETE HANDLERS
//   // =====================================================
//   const handleDeleteClick = (srn) => {
//     setDeleteSRNData(srn);
//     setShowDeleteModal(true);
//   };

//   const confirmDelete = async () => {
//     if (!deleteSRNData) return;
//     await deleteStockReturn(deleteSRNData.srn_id);
//     fetchStockReturns(currentPage, search);
//     setShowDeleteModal(false);
//     setDeleteSRNData(null);
//   };

//   // =====================================================
//   // CLIENT-SIDE FILTERING
//   // =====================================================
//   const filteredData = stockReturns.filter((item) => {
//     const matchStatus = filter.status ? item.status === filter.status : true;
//     const matchSupplier = filter.supplier_name
//       ? item.supplier_name === filter.supplier_name
//       : true;
//     const matchFrom = filter.return_from_date
//       ? new Date(item.return_date) >= new Date(filter.return_from_date)
//       : true;
//     const matchTo = filter.return_to_date
//       ? new Date(item.return_date) <= new Date(filter.return_to_date)
//       : true;
//     return matchStatus && matchSupplier && matchFrom && matchTo;
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
//           className="stockReturn-delete-modal"
//           style={{
//             maxWidth: "420px",
//             width: "100%",
//             paddingBottom: "10px",
//             height: "auto",
//             minHeight: "unset",
//           }}
//         >
//           <svg
//             className="stockReturn-close-icon"
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

//           <div className="stockReturn-modal-head">
//             <p>Delete Stock Return</p>
//           </div>

//           <div
//             className="stockReturn-modal-body"
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
//               Are you sure you want to delete stock return <br />
//               <strong>{deleteSRNData?.srn_id}</strong>
//               <br />
//               (Supplier: {deleteSRNData?.supplier_name})?
//             </p>

//             <div
//               className="stockReturn-modal-actions"
//               style={{ justifyContent: "center", gap: "14px" }}
//             >
//               <button
//                 type="button"
//                 className="stockReturn-cancel-btn"
//                 onClick={() => setShowDeleteModal(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 className="stockReturn-delete-btn"
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
//       <div className={`stockReturn-container ${showDeleteModal ? "blur" : ""}`}>

//         {/* HEADER */}
//         <div className="stockReturn-header">
//           <p>Stock Return Note</p>
//           <button onClick={() => setCurrentPage("createNewStockReturn")}>
//             + New Stock Return
//           </button>
//         </div>

//         {/* SEARCH BOX */}
//         <div className="stockReturn-search-box">
//           <label htmlFor="searchByID">
//             <svg
//               className="stockReturn-search-logo"
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 512 512"
//             >
//               <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
//             </svg>
//           </label>
//           <input
//             id="searchByID"
//             placeholder="Search by SRN ID, Supplier name...."
//             value={search}
//             onChange={handleSearch}
//           />
//         </div>

//         {/* CLEAR FILTER */}
//         <div className="stockReturn-clearfilter">
//           <p onClick={handleClearFilter}>Clear Filter</p>
//         </div>

//         {/* FILTERS */}
//         <div className="stockReturn-search-category">

//           {/* Supplier Filter — dynamic from API */}
//           <div className="stockReturn-input-box">
//             <label htmlFor="supplier_name">Supplier Name</label>
//             <select
//               value={filter.supplier_name}
//               onChange={(e) =>
//                 setFilter((prev) => ({ ...prev, supplier_name: e.target.value }))
//               }
//               id="supplier_name"
//             >
//               <option value="">All Suppliers</option>
//               {supplierList.map((name, ind) => (
//                 <option key={ind} value={name}>
//                   {name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Status Filter */}
//           <div className="stockReturn-input-box">
//             <label htmlFor="status">Status</label>
//             <select
//               value={filter.status}
//               onChange={(e) =>
//                 setFilter((prev) => ({ ...prev, status: e.target.value }))
//               }
//               id="status"
//             >
//               <option value="">Select status</option>
//               <option value="Draft">Draft</option>
//               <option value="Submitted">Submitted</option>
//               <option value="Submitted (PR)">Submitted (PR)</option>
//               <option value="Returned">Returned</option>
//               <option value="Cancelled">Cancelled</option>
//             </select>
//           </div>

//           {/* Date Range Filter */}
//           <div className="stockReturn-input-box">
//             <label htmlFor="return_date">Return Date</label>
//             <nav id="return_date">
//               <div>
//                 <span>From </span>
//                 <input
//                   value={filter.return_from_date}
//                   onChange={(e) =>
//                     setFilter((prev) => ({
//                       ...prev,
//                       return_from_date: e.target.value,
//                     }))
//                   }
//                   className="stockReturn-date"
//                   type="date"
//                 />
//               </div>
//               <div>
//                 <span>To </span>
//                 <input
//                   value={filter.return_to_date}
//                   onChange={(e) =>
//                     setFilter((prev) => ({
//                       ...prev,
//                       return_to_date: e.target.value,
//                     }))
//                   }
//                   className="stockReturn-date"
//                   type="date"
//                 />
//               </div>
//             </nav>
//           </div>
//         </div>

//         {/* TABLE */}
//         <div className="stockReturn-table-cointainer">
//           <table>
//             <thead className="stockReturn-table-head">
//               <tr>
//                 <th><pre>SRN ID</pre></th>
//                 <th><pre>GRN Ref.</pre></th>
//                 <th><pre>Return Date</pre></th>
//                 <th><pre>Supplier Name</pre></th>
//                 <th><pre>Return Initiated By</pre></th>
//                 <th>Status</th>
//                 <th>Action</th>
//               </tr>
//             </thead>

//             <tbody className="stockReturn-table-body">
//               {loading ? (
//                 <tr>
//                   <td colSpan={7} style={{ textAlign: "center" }}>
//                     Loading...
//                   </td>
//                 </tr>
//               ) : filteredData.length > 0 ? (
//                 filteredData.map((ele, ind) => (
//                   <tr key={ind}>
//                     <td>{ele.srn_id}</td>
//                     <td>{ele.grn_ref}</td>
//                     <td>{ele.return_date}</td>
//                     <td>{ele.supplier_name}</td>
//                     <td>{ele.return_initiated_by}</td>
//                     <td>
//                       <p
//                         className={`stockReturn-Status ${
//                           ele.status === "Draft"
//                             ? "stockReturn-Status-draft"
//                             : ele.status === "Submitted"
//                             ? "stockReturn-Status-Submitted"
//                             : ele.status === "Cancelled"
//                             ? "stockReturn-Status-Cancelled"
//                             : ele.status === "Returned"
//                             ? "stockReturn-Status-Returned"
//                             : ele.status === "Submitted(PR)"
//                             ? "stockReturn-Status-Submitted-PR"
//                             : ""
//                         }`}
//                       >
//                         {ele.status}
//                       </p>
//                     </td>
//                     <td id="stockReturn-table-action">
//                       <nav className="stockReturn-dot-container">
//                         <button
//                           onClick={() => {
//                             navigate(`/?tab=editNewSales/${ele.srn_id}`);
//                             setCurrentPage("editStockReturn");
//                           }}
//                         >
//                           {ele.status === "Draft" ? "Edit" : "View"} details
//                         </button>
//                         <button disabled={ele.status !== "Submitted"}>
//                           View Debit Note
//                         </button>
//                         <button
//                           onClick={() => handleDeleteClick(ele)}
//                           style={{ color: "red" }}
//                         >
//                           Delete
//                         </button>
//                       </nav>
//                       <svg
//                         className="stockReturn-delete-logo"
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
//                   <td colSpan={7} style={{ textAlign: "center" }}>
//                     No Data Found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* PAGINATION */}
//         <nav className="stockReturn-table-bottem">
//           <p className="stockReturn-num-entries">
//             Showing {filteredData.length} entries
//           </p>
//           <div className="stockReturn-manage-control-box">
//             <button
//               className="stockReturn-manage-btn"
//               onClick={handlePrev}
//               disabled={currentPage <= 1}
//             >
//               Prev
//             </button>
//             <nav className="stockReturn-num-page">
//               Page {currentPage} of {totalPages}
//             </nav>
//             <button
//               className="stockReturn-manage-btn"
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
import "./stockReturn.css";
import useStockReturnStore from "./stockReturnStore";

export default function StockReturn({ setCurrentPage }) {
  // =====================================================
  // ZUSTAND STORE
  // =====================================================
  const {
    stockReturns,
    loading,
    currentPage,
    totalPages,
    search,
    setSearch,
    fetchStockReturns,
    deleteStockReturn,
  } = useStockReturnStore();

  // =====================================================
  // LOCAL STATE
  // =====================================================
  const [filter, setFilter] = useState({
    status: "",
    supplier_name: "",
    return_from_date: "",
    return_to_date: "",
  });

  const [supplierList, setSupplierList] = useState([]);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSRNData, setDeleteSRNData] = useState(null);

  // =====================================================
  // FETCH ON MOUNT
  // =====================================================
  useEffect(() => {
    fetchStockReturns(1, "");
  }, []);

  // =====================================================
  // EXTRACT UNIQUE SUPPLIERS FROM API DATA
  // API shape: item.supplier?.supplier_name (supplier can be null)
  // =====================================================
  useEffect(() => {
    if (stockReturns.length > 0) {
      const uniqueSuppliers = [
        ...new Set(
          stockReturns
            .map((sr) => sr.supplier?.supplier_name)
            .filter(Boolean)
        ),
      ];
      setSupplierList(uniqueSuppliers);
    }
  }, [stockReturns]);

  // =====================================================
  // SEARCH HANDLER
  // =====================================================
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchStockReturns(1, value);
  };

  // =====================================================
  // PAGINATION HANDLERS
  // =====================================================
  const handleNext = () => {
    if (currentPage < totalPages) fetchStockReturns(currentPage + 1, search);
  };

  const handlePrev = () => {
    if (currentPage > 1) fetchStockReturns(currentPage - 1, search);
  };

  // =====================================================
  // FILTER HANDLER
  // =====================================================
  const handleClearFilter = () => {
    setFilter({
      status: "",
      supplier_name: "",
      return_from_date: "",
      return_to_date: "",
    });
  };

  // =====================================================
  // DELETE HANDLERS
  // =====================================================
  const handleDeleteClick = (srn) => {
    setDeleteSRNData(srn);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteSRNData) return;
    await deleteStockReturn(deleteSRNData.id); // use numeric `id` for API call
    fetchStockReturns(currentPage, search);
    setShowDeleteModal(false);
    setDeleteSRNData(null);
  };

  // =====================================================
  // CLIENT-SIDE FILTERING
  // API shape: supplier?.supplier_name, SRN_ID, grn_reference, return_date
  // =====================================================
  const filteredData = stockReturns.filter((item) => {
    const supplierName = item.supplier?.supplier_name || "";
    const matchStatus   = filter.status        ? item.status === filter.status           : true;
    const matchSupplier = filter.supplier_name ? supplierName === filter.supplier_name   : true;
    const matchFrom     = filter.return_from_date
      ? new Date(item.return_date) >= new Date(filter.return_from_date) : true;
    const matchTo       = filter.return_to_date
      ? new Date(item.return_date) <= new Date(filter.return_to_date)   : true;
    return matchStatus && matchSupplier && matchFrom && matchTo;
  });

  // =====================================================
  // RENDER
  // =====================================================
  return (
    <>
      {/* ================================================ */}
      {/* DELETE CONFIRMATION MODAL                         */}
      {/* ================================================ */}
      {showDeleteModal && (
        <div
          className="stockReturn-delete-modal"
          style={{
            maxWidth: "420px",
            width: "100%",
            paddingBottom: "10px",
            height: "auto",
            minHeight: "unset",
          }}
        >
          <svg
            className="stockReturn-close-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            onClick={() => setShowDeleteModal(false)}
            style={{ cursor: "pointer" }}
          >
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 
            0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 
            0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 
            12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 
            0L192 301.3 297.4 406.6c12.5 12.5 
            32.8 12.5 45.3 0s12.5-32.8 
            0-45.3L237.3 256 342.6 150.6z" />
          </svg>

          <div className="stockReturn-modal-head">
            <p>Delete Stock Return</p>
          </div>

          <div
            className="stockReturn-modal-body"
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
              Are you sure you want to delete stock return <br />
              {/* API field: SRN_ID (uppercase) */}
              <strong>{deleteSRNData?.SRN_ID}</strong>
              <br />
              (Supplier: {deleteSRNData?.supplier?.supplier_name || "N/A"})
            </p>

            <div
              className="stockReturn-modal-actions"
              style={{ justifyContent: "center", gap: "14px" }}
            >
              <button
                type="button"
                className="stockReturn-cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="stockReturn-delete-btn"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================ */}
      {/* MAIN CONTENT                                      */}
      {/* ================================================ */}
      <div className={`stockReturn-container ${showDeleteModal ? "blur" : ""}`}>

        {/* HEADER */}
        <div className="stockReturn-header">
          <p>Stock Return Note</p>
          <button onClick={() => setCurrentPage("createNewStockReturn")}>
            + New Stock Return
          </button>
        </div>

        {/* SEARCH BOX */}
        <div className="stockReturn-search-box">
          <label htmlFor="searchByID">
            <svg
              className="stockReturn-search-logo"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
            </svg>
          </label>
          <input
            id="searchByID"
            placeholder="Search by SRN ID, Supplier name...."
            value={search}
            onChange={handleSearch}
          />
        </div>

        {/* CLEAR FILTER */}
        <div className="stockReturn-clearfilter">
          <p onClick={handleClearFilter}>Clear Filter</p>
        </div>

        {/* FILTERS */}
        <div className="stockReturn-search-category">

          {/* Supplier Filter — dynamic from API (supplier?.supplier_name) */}
          <div className="stockReturn-input-box">
            <label htmlFor="supplier_name">Supplier Name</label>
            <select
              value={filter.supplier_name}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, supplier_name: e.target.value }))
              }
              id="supplier_name"
            >
              <option value="">All Suppliers</option>
              {supplierList.map((name, ind) => (
                <option key={ind} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="stockReturn-input-box">
            <label htmlFor="status">Status</label>
            <select
              value={filter.status}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, status: e.target.value }))
              }
              id="status"
            >
              <option value="">Select status</option>
              <option value="Draft">Draft</option>
              <option value="Submitted">Submitted</option>
              <option value="Submitted (PR)">Submitted (PR)</option>
              <option value="Returned">Returned</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="stockReturn-input-box">
            <label htmlFor="return_date">Return Date</label>
            <nav id="return_date">
              <div>
                <span>From </span>
                <input
                  value={filter.return_from_date}
                  onChange={(e) =>
                    setFilter((prev) => ({ ...prev, return_from_date: e.target.value }))
                  }
                  className="stockReturn-date"
                  type="date"
                />
              </div>
              <div>
                <span>To </span>
                <input
                  value={filter.return_to_date}
                  onChange={(e) =>
                    setFilter((prev) => ({ ...prev, return_to_date: e.target.value }))
                  }
                  className="stockReturn-date"
                  type="date"
                />
              </div>
            </nav>
          </div>
        </div>

        {/* TABLE */}
        <div className="stockReturn-table-cointainer">
          <table>
            <thead className="stockReturn-table-head">
              <tr>
                <th><pre>SRN ID</pre></th>
                <th><pre>GRN Ref.</pre></th>
                <th><pre>Return Date</pre></th>
                <th><pre>Supplier Name</pre></th>
                <th><pre>Return Initiated By</pre></th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody className="stockReturn-table-body">
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center" }}>
                    Loading...
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((ele, ind) => (
                  <tr key={ind}>
                    {/* API: SRN_ID (uppercase) */}
                    <td>{ele.SRN_ID}</td>
                    {/* API: grn_reference (not grn_ref) */}
                    <td>{ele.grn_reference}</td>
                    <td>{ele.return_date}</td>
                    {/* API: supplier?.supplier_name (nested object, can be null) */}
                    <td>{ele.supplier?.supplier_name || "—"}</td>
                    <td>{ele.return_initiated_by}</td>
                    <td>
                      <p
                        className={`stockReturn-Status ${
                          ele.status === "Draft"
                            ? "stockReturn-Status-draft"
                            : ele.status === "Submitted"
                            ? "stockReturn-Status-Submitted"
                            : ele.status === "Cancelled"
                            ? "stockReturn-Status-Cancelled"
                            : ele.status === "Returned"
                            ? "stockReturn-Status-Returned"
                            : ele.status === "Submitted(PR)"
                            ? "stockReturn-Status-Submitted-PR"
                            : ""
                        }`}
                      >
                        {ele.status}
                      </p>
                    </td>
                    <td id="stockReturn-table-action">
                      <nav className="stockReturn-dot-container">
                        <button
                          onClick={() =>
                            // Pass the numeric `id` (DB primary key) for edit/view
                            setCurrentPage("editStockReturn", ele.id)
                          }
                        >
                          {ele.status === "Draft" ? "Edit" : "View"} details
                        </button>
                        <button disabled={ele.status !== "Submitted"}>
                          View Debit Note
                        </button>
                        <button
                          onClick={() => handleDeleteClick(ele)}
                          style={{ color: "red" }}
                        >
                          Delete
                        </button>
                      </nav>
                      <svg
                        className="stockReturn-delete-logo"
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
                  <td colSpan={7} style={{ textAlign: "center" }}>
                    No Data Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <nav className="stockReturn-table-bottem">
          <p className="stockReturn-num-entries">
            Showing {filteredData.length} entries
          </p>
          <div className="stockReturn-manage-control-box">
            <button
              className="stockReturn-manage-btn"
              onClick={handlePrev}
              disabled={currentPage <= 1}
            >
              Prev
            </button>
            <nav className="stockReturn-num-page">
              Page {currentPage} of {totalPages}
            </nav>
            <button
              className="stockReturn-manage-btn"
              onClick={handleNext}
              disabled={currentPage >= totalPages}
            >
              Next
            </button>
          </div>
        </nav>

      </div>
    </>
  );
}