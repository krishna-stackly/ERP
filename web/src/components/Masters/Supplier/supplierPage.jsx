// // // import React, { useEffect } from "react";
// // // import "./supplierPage.css";
// // // import { useNavigate } from "react-router-dom";
// // // import { useSupplierStore } from "./supplierStore";

// // // export default function SupplierPage({ setCurrentPage }) {
// // //   const navigate = useNavigate();
  
// // //   const {
// // //     suppliers,
// // //     totalPages,
// // //     loading,
// // //     filters,
// // //     setFilter,
// // //     fetchSuppliers,
// // //     deleteSupplier,
// // //   } = useSupplierStore();

// // //   const {
// // //     page,
// // //     per_page,
// // //     status,
// // //     supplier_type,
// // //     supplier_tier,
// // //   } = filters;

// // //   // Load suppliers when filters change
// // //   useEffect(() => {
// // //     console.log("🎯 Effect triggered with filters:", filters);
// // //     fetchSuppliers();
// // //   }, [page, per_page, status, supplier_type, supplier_tier]);

// // //   const handleClearFilter = () => {
// // //     setFilter("page", 1);
// // //     setFilter("status", "");
// // //     setFilter("supplier_type", "");
// // //     setFilter("supplier_tier", "");
// // //   };

// // //   return (
// // //     <div className="supplier-container">
// // //       <div className="supplier-header">
// // //         <p>Supplier Master</p>
// // //         <button
// // //           onClick={(e) => {
// // //             e.preventDefault();
// // //             setCurrentPage("createNewSupplier");
// // //           }}
// // //         >
// // //           + New Supplier
// // //         </button>
// // //       </div>

// // //       <div className="supplier-search-box">
// // //         <label htmlFor="searchByID">
// // //           <svg
// // //             className="supplier-search-logo"
// // //             xmlns="http://www.w3.org/2000/svg"
// // //             viewBox="0 0 512 512"
// // //           >
// // //             <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
// // //           </svg>
// // //         </label>
// // //         <input
// // //           id="searchByID"
// // //           placeholder="Search by Supplier ID number, Supplier name...."
// // //           value={filters.search || ""}
// // //           onChange={(e) => setFilter("search", e.target.value)}
// // //         />
// // //       </div>

// // //       <div className="supplier-clearfilter">
// // //         <p onClick={handleClearFilter}>Clear Filter</p>
// // //       </div>

// // //       <div className="supplier-search-category">
// // //         <div className="supplier-input-box">
// // //           <label htmlFor="status">Status</label>
// // //           <select
// // //             value={status}
// // //             onChange={(e) => setFilter("status", e.target.value)}
// // //             id="status"
// // //           >
// // //             <option value="">All</option>
// // //             <option value="Active">Active</option>
// // //             <option value="Inactive">Inactive</option>
// // //           </select>
// // //         </div>

// // //         <div className="supplier-input-box">
// // //           <label htmlFor="supplier_type">Supplier Type</label>
// // //           <select
// // //             id="supplier_type"
// // //             value={supplier_type}
// // //             onChange={(e) => setFilter("supplier_type", e.target.value)}
// // //           >
// // //             <option value="">All Types</option>
// // //             <option value="Manufacturer">Manufacturer</option>
// // //             <option value="Distributor">Distributor</option>
// // //             <option value="Service Provider">Service Provider</option>
// // //           </select>
// // //         </div>

// // //         <div className="supplier-input-box">
// // //           <label htmlFor="supplier_tier">Supplier Tier</label>
// // //           <select
// // //             id="supplier_tier"
// // //             value={supplier_tier}
// // //             onChange={(e) => setFilter("supplier_tier", e.target.value)}
// // //           >
// // //             <option value="">All Types</option>
// // //             <option value="Strategic">Strategic</option>
// // //             <option value="Preferred">Preferred</option>
// // //             <option value="Backup">Backup</option>
// // //           </select>
// // //         </div>
// // //       </div>

// // //       <div className="supplier-table-cointainer">
// // //         {loading ? (
// // //           <p>Loading...</p>
// // //         ) : (
// // //           <table>
// // //             <thead className="supplier-table-head">
// // //               <tr>
// // //                 <th></th>
// // //                 <th>Supplier ID</th>
// // //                 <th>Supplier Name</th>
// // //                 <th>Created Date</th>
// // //                 <th>Status</th>
// // //                 <th>Supplier Type</th>
// // //                 <th>Action</th>
// // //               </tr>
// // //             </thead>
// // //             <tbody className="supplier-table-body">
// // //               {suppliers && suppliers.length > 0 ? (
// // //                 suppliers.map((supplier) => (
// // //                   <tr key={supplier.id}>
// // //                     <td>
// // //                       <input className="supplier-delete-logo" type="checkbox" />
// // //                     </td>
// // //                     <td>{supplier.supplier_id}</td>
// // //                     <td>{supplier.supplier_name}</td>
// // //                     <td>{supplier.created_date}</td>
// // //                     <td>
// // //                       <p
// // //                         className={`supplier-Status ${
// // //                           supplier.status === "Active"
// // //                             ? "supplier-Status-Active"
// // //                             : "supplier-Status-Inactive"
// // //                         }`}
// // //                       >
// // //                         {supplier.status}
// // //                       </p>
// // //                     </td>
// // //                     <td>{supplier.supplier_type}</td>
// // //                     <td id="supplier-table-action">
// // //                       <button
// // //                         onClick={() => {
// // //                           navigate(`/?tab=editSupplier/${supplier.id}`);
// // //                           setCurrentPage("editSupplier");
// // //                         }}
// // //                       >
// // //                         Edit
// // //                       </button>
// // //                       <button onClick={() => deleteSupplier(supplier.id)}>
// // //                         Delete
// // //                       </button>
// // //                     </td>
// // //                   </tr>
// // //                 ))
// // //               ) : (
// // //                 <tr>
// // //                   <td colSpan="7">No Data Found</td>
// // //                 </tr>
// // //               )}
// // //             </tbody>
// // //           </table>
// // //         )}
// // //       </div>

// // //       <nav className="supplier-table-bottem">
// // //         <p className="supplier-num-entries">
// // //           Showing {suppliers.length} entries
// // //         </p>
// // //         <div className="supplier-manage-control-box">
// // //           <button
// // //             className="supplier-manage-btn"
// // //             onClick={() => setFilter("page", page - 1)}
// // //             disabled={page <= 1}
// // //           >
// // //             Prev
// // //           </button>
// // //           <nav className="supplier-num-page">
// // //             Page {page} of {totalPages}
// // //           </nav>
// // //           <button
// // //             className="supplier-manage-btn"
// // //             onClick={() => setFilter("page", page + 1)}
// // //             disabled={page >= totalPages}
// // //           >
// // //             Next
// // //           </button>
// // //         </div>
// // //       </nav>
// // //     </div>
// // //   );
// // // }
// // import React, { useEffect, useState } from "react";
// // import "./supplierPage.css";
// // import { useNavigate } from "react-router-dom";
// // import { useSupplierStore } from "./supplierStore";
// // import CreateEditSupplier from "./createNewSupplier";

// // export default function SupplierPage({ setCurrentPage }) {
// //   const navigate = useNavigate();
  
// //   const {
// //     suppliers,
// //     totalPages,
// //     loading,
// //     filters,
// //     setFilter,
// //     fetchSuppliers,
// //     deleteSupplier,
// //   } = useSupplierStore();

// //   const {
// //     page,
// //     per_page,
// //     status,
// //     supplier_type,
// //     supplier_tier,
// //   } = filters;

// //   // Modal States
// //   const [showAddSupplier, setShowAddSupplier] = useState(false);
// //   const [editShowAddSupplier, setEditShowAddSupplier] = useState(false);
// //   const [editAddSupplierData, setEditAddSupplierData] = useState({});

// //   // Load suppliers when filters change
// //   useEffect(() => {
// //     console.log("🎯 Effect triggered with filters:", filters);
// //     fetchSuppliers();
// //   }, [page, per_page, status, supplier_type, supplier_tier]);

// //   // Close modal and refresh
// //   const handleCloseAddSupplier = () => {
// //     setShowAddSupplier(false);
// //     fetchSuppliers();
// //   };

// //   const handleCloseEditSupplier = () => {
// //     setEditShowAddSupplier(false);
// //     setEditAddSupplierData({});
// //     fetchSuppliers();
// //   };

// //   const handleEditClick = (supplier) => {
// //     setEditAddSupplierData(supplier);
// //     setEditShowAddSupplier(true);
// //   };

// //   const handleClearFilter = () => {
// //     setFilter("page", 1);
// //     setFilter("status", "");
// //     setFilter("supplier_type", "");
// //     setFilter("supplier_tier", "");
// //   };

// //   // If modals are open, show them
// //   if (showAddSupplier) {
// //     return <CreateEditSupplier setShowAddSupplier={handleCloseAddSupplier} />;
// //   }

// //   if (editShowAddSupplier) {
// //     return (
// //       <CreateEditSupplier
// //         setShowAddSupplier={handleCloseEditSupplier}
// //         editShowAddSupplier={editShowAddSupplier}
// //         editAddSupplierData={editAddSupplierData}
// //         setEditAddSupplierData={setEditAddSupplierData}
// //       />
// //     );
// //   }

// //   return (
// //     <div className="supplier-container">
// //       <div className="supplier-header">
// //         <p>Supplier Master</p>
// //         <button
// //           onClick={(e) => {
// //             e.preventDefault();
// //             setShowAddSupplier(true); // ✅ Changed to open modal
// //           }}
// //         >
// //           + New Supplier
// //         </button>
// //       </div>

// //       <div className="supplier-search-box">
// //         <label htmlFor="searchByID">
// //           <svg
// //             className="supplier-search-logo"
// //             xmlns="http://www.w3.org/2000/svg"
// //             viewBox="0 0 512 512"
// //           >
// //             <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
// //           </svg>
// //         </label>
// //         <input
// //           id="searchByID"
// //           placeholder="Search by Supplier ID number, Supplier name...."
// //           value={filters.search || ""}
// //           onChange={(e) => {
// //             setFilter("search", e.target.value);
// //             setFilter("page", 1);
// //           }}
// //         />
// //       </div>

// //       <div className="supplier-clearfilter">
// //         <p onClick={handleClearFilter}>Clear Filter</p>
// //       </div>

// //       <div className="supplier-search-category">
// //         <div className="supplier-input-box">
// //           <label htmlFor="status">Status</label>
// //           <select
// //             value={status}
// //             onChange={(e) => {
// //               setFilter("status", e.target.value);
// //               setFilter("page", 1);
// //             }}
// //             id="status"
// //           >
// //             <option value="">All</option>
// //             <option value="Active">Active</option>
// //             <option value="Inactive">Inactive</option>
// //           </select>
// //         </div>

// //         <div className="supplier-input-box">
// //           <label htmlFor="supplier_type">Supplier Type</label>
// //           <select
// //             id="supplier_type"
// //             value={supplier_type}
// //             onChange={(e) => {
// //               setFilter("supplier_type", e.target.value);
// //               setFilter("page", 1);
// //             }}
// //           >
// //             <option value="">All Types</option>
// //             <option value="Manufacturer">Manufacturer</option>
// //             <option value="Distributor">Distributor</option>
// //             <option value="Service Provider">Service Provider</option>
// //           </select>
// //         </div>

// //         <div className="supplier-input-box">
// //           <label htmlFor="supplier_tier">Supplier Tier</label>
// //           <select
// //             id="supplier_tier"
// //             value={supplier_tier}
// //             onChange={(e) => {
// //               setFilter("supplier_tier", e.target.value);
// //               setFilter("page", 1);
// //             }}
// //           >
// //             <option value="">All Types</option>
// //             <option value="Strategic">Strategic</option>
// //             <option value="Preferred">Preferred</option>
// //             <option value="Backup">Backup</option>
// //           </select>
// //         </div>
// //       </div>

// //       <div className="supplier-table-cointainer">
// //         {loading ? (
// //           <p>Loading...</p>
// //         ) : (
// //           <table>
// //             <thead className="supplier-table-head">
// //               <tr>
// //                 <th></th>
// //                 <th>Supplier ID</th>
// //                 <th>Supplier Name</th>
// //                 <th>Created Date</th>
// //                 <th>Status</th>
// //                 <th>Supplier Type</th>
// //                 <th>Action</th>
// //               </tr>
// //             </thead>
// //             <tbody className="supplier-table-body">
// //               {suppliers && suppliers.length > 0 ? (
// //                 suppliers.map((supplier) => (
// //                   <tr key={supplier.id}>
// //                     <td>
// //                       <input className="supplier-delete-logo" type="checkbox" />
// //                     </td>
// //                     <td>{supplier.supplier_id}</td>
// //                     <td>{supplier.supplier_name}</td>
// //                     <td>{supplier.created_date}</td>
// //                     <td>
// //                       <p
// //                         className={`supplier-Status ${
// //                           supplier.status === "Active"
// //                             ? "supplier-Status-Active"
// //                             : "supplier-Status-Inactive"
// //                         }`}
// //                       >
// //                         {supplier.status}
// //                       </p>
// //                     </td>
// //                     <td>{supplier.supplier_type}</td>
// //                     <td id="supplier-table-action">
// //                       <button onClick={() => handleEditClick(supplier)}>
// //                         Edit
// //                       </button>
// //                       <button onClick={() => deleteSupplier(supplier.id)}>
// //                         Delete
// //                       </button>
// //                     </td>
// //                   </tr>
// //                 ))
// //               ) : (
// //                 <tr>
// //                   <td colSpan="7">No Data Found</td>
// //                 </tr>
// //               )}
// //             </tbody>
// //           </table>
// //         )}
// //       </div>

// //       <nav className="supplier-table-bottem">
// //         <p className="supplier-num-entries">
// //           Showing {suppliers.length} entries
// //         </p>
// //         <div className="supplier-manage-control-box">
// //           <button
// //             className="supplier-manage-btn"
// //             onClick={() => setFilter("page", page - 1)}
// //             disabled={page <= 1}
// //           >
// //             Prev
// //           </button>
// //           <nav className="supplier-num-page">
// //             Page {page} of {totalPages}
// //           </nav>
// //           <button
// //             className="supplier-manage-btn"
// //             onClick={() => setFilter("page", page + 1)}
// //             disabled={page >= totalPages}
// //           >
// //             Next
// //           </button>
// //         </div>
// //       </nav>
// //     </div>
// //   );
// // }
// import React, { useEffect, useState } from "react";
// import "./supplierPage.css";
// import { useNavigate } from "react-router-dom";
// import { useSupplierStore } from "./supplierStore";
// import CreateEditSupplier from "./createNewSupplier";

// export default function SupplierPage({ setCurrentPage }) {
//   const navigate = useNavigate();

//   const {
//     suppliers,
//     totalPages,
//     loading,
//     filters,
//     setFilter,
//     fetchSuppliers,
//     deleteSupplier,
//   } = useSupplierStore();

//   const { page, per_page, status, supplier_type, supplier_tier } = filters;

//   // Modal States
//   const [showAddSupplier, setShowAddSupplier] = useState(false);
//   const [editShowAddSupplier, setEditShowAddSupplier] = useState(false);
//   const [editAddSupplierData, setEditAddSupplierData] = useState({});

//   // Load suppliers when filters change
//   useEffect(() => {
//     console.log("🎯 Effect triggered with filters:", filters);
//     fetchSuppliers();
//   }, [page, per_page, status, supplier_type, supplier_tier]);

//   // Close modal and refresh
//   const handleCloseAddSupplier = () => {
//     setShowAddSupplier(false);
//     fetchSuppliers();
//   };

//   const handleCloseEditSupplier = () => {
//     setEditShowAddSupplier(false);
//     setEditAddSupplierData({});
//     fetchSuppliers();
//   };

//   const handleEditClick = (supplier) => {
//     setEditAddSupplierData(supplier);
//     setEditShowAddSupplier(true);
//   };

//   const handleClearFilter = () => {
//     setFilter("page", 1);
//     setFilter("status", "");
//     setFilter("supplier_type", "");
//     setFilter("supplier_tier", "");
//   };

//   // If modals are open, show them
//   if (showAddSupplier) {
//     return <CreateEditSupplier setShowAddSupplier={handleCloseAddSupplier} />;
//   }

//   if (editShowAddSupplier) {
//     return (
//       <CreateEditSupplier
//         setShowAddSupplier={handleCloseEditSupplier}
//         editShowAddSupplier={editShowAddSupplier}
//         editAddSupplierData={editAddSupplierData}
//         setEditAddSupplierData={setEditAddSupplierData}
//       />
//     );
//   }

//   return (
//     <div className="supplier-container">
//       {/* ── Header ── */}
//       <div className="supplier-header">
//         <p>Supplier Master</p>
//         <button
//           onClick={(e) => {
//             e.preventDefault();
//             setShowAddSupplier(true);
//           }}
//         >
//           + New Supplier
//         </button>
//       </div>

//       {/* ── Search Box ── */}
//       <div className="supplier-search-box">
//         <label htmlFor="searchByID">
//           <svg
//             className="supplier-search-logo"
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 512 512"
//           >
//             <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
//           </svg>
//         </label>
//         <input
//           id="searchByID"
//           placeholder="Search by Supplier ID number, Supplier name...."
//           value={filters.search || ""}
//           onChange={(e) => {
//             setFilter("search", e.target.value);
//             setFilter("page", 1);
//           }}
//         />
//       </div>

//       {/* ── Clear Filter ── */}
//       <div className="supplier-clearfilter">
//         <p onClick={handleClearFilter}>Clear Filter</p>
//       </div>

//       {/* ── Filter Dropdowns ── */}
//       <div className="supplier-search-category">
//         <div className="supplier-input-box">
//           <label htmlFor="status">Status</label>
//           <select
//             value={status}
//             onChange={(e) => {
//               setFilter("status", e.target.value);
//               setFilter("page", 1);
//             }}
//             id="status"
//           >
//             <option value="">All</option>
//             <option value="Active">Active</option>
//             <option value="Inactive">Inactive</option>
//           </select>
//         </div>

//         <div className="supplier-input-box">
//           <label htmlFor="supplier_type">Supplier Type</label>
//           <select
//             id="supplier_type"
//             value={supplier_type}
//             onChange={(e) => {
//               setFilter("supplier_type", e.target.value);
//               setFilter("page", 1);
//             }}
//           >
//             <option value="">All Types</option>
//             <option value="Manufacturer">Manufacturer</option>
//             <option value="Distributor">Distributor</option>
//             <option value="Service Provider">Service Provider</option>
//           </select>
//         </div>

//         <div className="supplier-input-box">
//           <label htmlFor="supplier_tier">Supplier Tier</label>
//           <select
//             id="supplier_tier"
//             value={supplier_tier}
//             onChange={(e) => {
//               setFilter("supplier_tier", e.target.value);
//               setFilter("page", 1);
//             }}
//           >
//             <option value="">All Tiers</option>
//             <option value="Strategic">Strategic</option>
//             <option value="Preferred">Preferred</option>
//             <option value="Backup">Backup</option>
//           </select>
//         </div>
//       </div>

//       {/* ── Table ── */}
//       <div className="supplier-table-cointainer">
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           <table>
//             <thead className="supplier-table-head">
//               <tr>
//                 <th></th>
//                 <th>Supplier ID</th>
//                 <th>Supplier Name</th>
//                 <th>Created Date</th>
//                 <th>Status</th>
//                 <th>Supplier Type</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody className="supplier-table-body">
//               {suppliers && suppliers.length > 0 ? (
//                 suppliers.map((supplier) => (
//                   <tr key={supplier.id}>
//                     <td>
//                       <input
//                         className="supplier-delete-logo"
//                         type="checkbox"
//                       />
//                     </td>
//                     <td>{supplier.supplier_id}</td>
//                     <td>{supplier.supplier_name}</td>
//                     <td>{supplier.created_date}</td>
//                     <td>
//                       <p
//                         className={`supplier-Status ${
//                           supplier.status === "Active"
//                             ? "supplier-Status-Active"
//                             : "supplier-Status-Inactive"
//                         }`}
//                       >
//                         {supplier.status}
//                       </p>
//                     </td>
//                     <td>{supplier.supplier_type}</td>
//                     <td id="supplier-table-action">
//                       <button onClick={() => handleEditClick(supplier)}>
//                         Edit
//                       </button>
//                       <button onClick={() => deleteSupplier(supplier.id)}>
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="7">No Data Found</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* ── Pagination ── */}
//       <nav className="supplier-table-bottem">
//         <p className="supplier-num-entries">
//           Showing {suppliers.length} entries
//         </p>
//         <div className="supplier-manage-control-box">
//           <button
//             className="supplier-manage-btn"
//             onClick={() => setFilter("page", page - 1)}
//             disabled={page <= 1}
//           >
//             Prev
//           </button>
//           <nav className="supplier-num-page">
//             Page {page} of {totalPages}
//           </nav>
//           <button
//             className="supplier-manage-btn"
//             onClick={() => setFilter("page", page + 1)}
//             disabled={page >= totalPages}
//           >
//             Next
//           </button>
//         </div>
//       </nav>
//     </div>
//   );
// }
import React, { useEffect, useRef, useState } from "react";
import "./supplierPage.css";
import { useSupplierStore } from "./supplierStore";
import CreateEditSupplier from "./createNewSupplier";

export default function SupplierPage({ setCurrentPage }) {
  const {
    suppliers,
    totalPages,
    loading,
    filters,
    setFilter,
    fetchSuppliers,
    deleteSupplier,
  } = useSupplierStore();

  const { page, per_page, status, supplier_type, supplier_tier } = filters;

  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [editShowAddSupplier, setEditShowAddSupplier] = useState(false);
  const [editAddSupplierData, setEditAddSupplierData] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSupplierData, setDeleteSupplierData] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    fetchSuppliers();
  }, [page, per_page, status, supplier_type, supplier_tier]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleCloseAddSupplier = () => {
    setShowAddSupplier(false);
    fetchSuppliers();
  };

  const handleCloseEditSupplier = () => {
    setEditShowAddSupplier(false);
    setEditAddSupplierData({});
    fetchSuppliers();
  };

  const handleEditClick = (supplier) => {
    setOpenMenuId(null);
    setEditAddSupplierData(supplier);
    setEditShowAddSupplier(true);
  };

  const handleDeleteClick = (supplier) => {
    setOpenMenuId(null);
    setDeleteSupplierData(supplier);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteSupplierData) return;
    await deleteSupplier(deleteSupplierData.id);
    fetchSuppliers();
    setShowDeleteModal(false);
    setDeleteSupplierData(null);
  };

  const handleClearFilter = () => {
    setFilter("page", 1);
    setFilter("status", "");
    setFilter("supplier_type", "");
    setFilter("supplier_tier", "");
  };

  if (showAddSupplier) {
    return <CreateEditSupplier setShowAddSupplier={handleCloseAddSupplier} />;
  }

  if (editShowAddSupplier) {
    return (
      <CreateEditSupplier
        setShowAddSupplier={handleCloseEditSupplier}
        editShowAddSupplier={editShowAddSupplier}
        editAddSupplierData={editAddSupplierData}
        setEditAddSupplierData={setEditAddSupplierData}
      />
    );
  }

  return (
    <>
      {/* ── Delete Confirmation Modal ── */}
      {showDeleteModal && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setShowDeleteModal(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              zIndex: 999,
            }}
          />
          {/* Modal Box */}
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#fff",
              borderRadius: "10px",
              width: "400px",
              padding: "24px",
              zIndex: 1000,
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            }}
          >
            <p
              style={{
                fontWeight: 600,
                fontSize: "17px",
                marginBottom: "16px",
                textAlign: "center",
              }}
            >
              Delete Supplier
            </p>
            <p
              style={{
                textAlign: "center",
                fontSize: "14px",
                lineHeight: "22px",
                marginBottom: "24px",
                color: "#444",
              }}
            >
              Are you sure you want to delete <br />
              <strong>{deleteSupplierData?.supplier_name}</strong>
              <br />
              <span style={{ color: "#888" }}>
                ({deleteSupplierData?.supplier_id})
              </span>
              ?
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "12px",
              }}
            >
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  padding: "8px 24px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  background: "#f5f5f5",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  padding: "8px 24px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#e53935",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}

      <div className="supplier-container">
        {/* ── Header ── */}
        <div className="supplier-header">
          <p>Supplier Master</p>
          <button onClick={() => setShowAddSupplier(true)}>
            + New Supplier
          </button>
        </div>

        {/* ── Search Box ── */}
        <div className="supplier-search-box">
          <label htmlFor="searchByID">
            <svg
              className="supplier-search-logo"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
            </svg>
          </label>
          <input
            id="searchByID"
            placeholder="Search by Supplier ID number, Supplier name...."
            value={filters.search || ""}
            onChange={(e) => {
              setFilter("search", e.target.value);
              setFilter("page", 1);
            }}
          />
        </div>

        {/* ── Clear Filter ── */}
        <div className="supplier-clearfilter">
          <p onClick={handleClearFilter}>Clear Filter</p>
        </div>

        {/* ── Filter Dropdowns ── */}
        <div className="supplier-search-category">
          <div className="supplier-input-box">
            <label htmlFor="status">Status</label>
            <select
              value={status}
              onChange={(e) => {
                setFilter("status", e.target.value);
                setFilter("page", 1);
              }}
              id="status"
            >
              <option value="">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="supplier-input-box">
            <label htmlFor="supplier_type">Supplier Type</label>
            <select
              id="supplier_type"
              value={supplier_type}
              onChange={(e) => {
                setFilter("supplier_type", e.target.value);
                setFilter("page", 1);
              }}
            >
              <option value="">All Types</option>
              <option value="Manufacturer">Manufacturer</option>
              <option value="Distributor">Distributor</option>
              <option value="Service Provider">Service Provider</option>
            </select>
          </div>

          <div className="supplier-input-box">
            <label htmlFor="supplier_tier">Supplier Tier</label>
            <select
              id="supplier_tier"
              value={supplier_tier}
              onChange={(e) => {
                setFilter("supplier_tier", e.target.value);
                setFilter("page", 1);
              }}
            >
              <option value="">All Tiers</option>
              <option value="Strategic">Strategic</option>
              <option value="Preferred">Preferred</option>
              <option value="Backup">Backup</option>
            </select>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="supplier-table-cointainer">
          {loading ? (
            <p style={{ textAlign: "center", padding: "20px" }}>Loading...</p>
          ) : (
            <table>
              <thead className="supplier-table-head">
                <tr>
                  <th></th>
                  <th>Supplier ID</th>
                  <th>Supplier Name</th>
                  <th>Created Date</th>
                  <th>Status</th>
                  <th>Supplier Type</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="supplier-table-body">
                {suppliers && suppliers.length > 0 ? (
                  suppliers.map((supplier) => (
                    <tr key={supplier.id}>
                      <td>
                        <input
                          className="supplier-delete-logo"
                          type="checkbox"
                        />
                      </td>
                      <td>{supplier.supplier_id}</td>
                      <td>{supplier.supplier_name}</td>
                      <td>{supplier.created_date}</td>
                      <td>
                        <p
                          className={`supplier-Status ${
                            supplier.status === "Active"
                              ? "supplier-Status-Active"
                              : "supplier-Status-Inactive"
                          }`}
                        >
                          {supplier.status}
                        </p>
                      </td>
                      <td>{supplier.supplier_type}</td>

                      {/* ── Kebab Menu ── */}
                      <td style={{ position: "relative", textAlign: "center" }}>
                        {/* 3-dot icon */}
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(
                              openMenuId === supplier.id ? null : supplier.id
                            );
                          }}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            cursor: "pointer",
                            background:
                              openMenuId === supplier.id
                                ? "#f0f0f0"
                                : "transparent",
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 128 512"
                            style={{ width: "14px", height: "14px", fill: "#555" }}
                          >
                            <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                          </svg>
                        </div>

                        {/* Dropdown Menu */}
                        {openMenuId === supplier.id && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              position: "absolute",
                              top: "38px",
                              right: "8px",
                              background: "#fff",
                              border: "1px solid #e0e0e0",
                              borderRadius: "8px",
                              boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                              zIndex: 999,
                              minWidth: "120px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              onClick={() => handleEditClick(supplier)}
                              style={{
                                padding: "10px 16px",
                                cursor: "pointer",
                                fontSize: "14px",
                                color: "#333",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "#f5f5f5")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.background = "transparent")
                              }
                            >
                              ✏️ Edit
                            </div>
                            <div
                              style={{
                                height: "1px",
                                background: "#f0f0f0",
                              }}
                            />
                            <div
                              onClick={() => handleDeleteClick(supplier)}
                              style={{
                                padding: "10px 16px",
                                cursor: "pointer",
                                fontSize: "14px",
                                color: "#e53935",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "#fff5f5")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.background = "transparent")
                              }
                            >
                              🗑️ Delete
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Pagination ── */}
        <nav className="supplier-table-bottem">
          <p className="supplier-num-entries">
            Showing {suppliers.length} entries
          </p>
          <div className="supplier-manage-control-box">
            <button
              className="supplier-manage-btn"
              onClick={() => setFilter("page", page - 1)}
              disabled={page <= 1}
            >
              Prev
            </button>
            <nav className="supplier-num-page">
              Page {page} of {totalPages}
            </nav>
            <button
              className="supplier-manage-btn"
              onClick={() => setFilter("page", page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}