// // import React, { useState, useEffect } from "react";
// // import SearchBar from "../../reuse-components/search.jsx";
// // import FilterGroup from "../../reuse-components/filter.jsx";
// // import DataTable from "../../reuse-components/table.jsx";
// // import Pagination from "../../reuse-components/pagination.jsx";
// // import "./invoiceReturnCRM.css";

// // export default function InvoiceReturnCRM({ setCurrentPage }) {
// //   const [search, setSearch] = useState("");
// //   const [filters, setFilters] = useState({
// //     invoice_status: "",
// //     customer_name: "",
// //     invoice_from_date: "",
// //     invoice_to_date: "",
// //   });
// //   const [invoiceData, setInvoiceData] = useState([]);
// //   const [page, setPage] = useState(1);
// //   const pageSize = 10;

// //   const invoiceFromAPI = {
// //     invoiceData: [
// //       {
// //         invoice_id: "INV-0001",
// //         sales_order_ref: "SO-0001",
// //         customer_name: "Acme Corp",
// //         invoice_date: "28-05-2025",
// //         return_date: "28-05-2025",
// //         status: "Draft",
// //         payment_status: "Unpaid",
// //       },
// //       {
// //         invoice_id: "INV-0002",
// //         sales_order_ref: "SO-0002",
// //         customer_name: "Acme Corp",
// //         invoice_date: "28-05-2025",
// //         return_date: "28-05-2025",
// //         status: "Send",
// //         payment_status: "Unpaid",
// //       },
// //       {
// //         invoice_id: "INV-0003",
// //         sales_order_ref: "SO-0003",
// //         customer_name: "Acme",
// //         invoice_date: "28-05-2025",
// //         return_date: "28-05-2025",
// //         status: "Send",
// //         payment_status: "Partial",
// //       },
// //       {
// //         invoice_id: "INV-0004",
// //         sales_order_ref: "SO-0004",
// //         customer_name: "Corp",
// //         invoice_date: "28-05-2025",
// //         return_date: "28-05-2025",
// //         status: "Paid",
// //         payment_status: "Paid",
// //       },
// //       {
// //         invoice_id: "INV-0005",
// //         sales_order_ref: "SO-0005",
// //         customer_name: "Sai Kumar",
// //         invoice_date: "28-05-2025",
// //         return_date: "28-05-2025",
// //         status: "Overdue",
// //         payment_status: "Unpaid",
// //       },
// //       {
// //         invoice_id: "INV-0006",
// //         sales_order_ref: "SO-0006",
// //         customer_name: "Kishore",
// //         invoice_date: "28-05-2025",
// //         return_date: "28-05-2025",
// //         status: "Cancelled",
// //         payment_status: "",
// //       },
// //     ],
// //   };

// //   useEffect(() => {
// //     setInvoiceData(invoiceFromAPI.invoiceData);
// //   }, []);

// //   // handle filter changes
// //   const handleFilterChange = (name, value) => {
// //     setFilters((prev) => ({ ...prev, [name]: value }));
// //   };

// //   const clearFilters = () => {
// //     setFilters({
// //       invoice_status: "",
// //       customer_name: "",
// //       invoice_from_date: "",
// //       invoice_to_date: "",
// //     });
// //   };

// //   const filtered = invoiceData
// //     .filter((item) => {
// //       return (
// //         (!filters.invoice_status || item.status === filters.invoice_status) &&
// //         (!filters.customer_name || item.customer_name === filters.customer_name) &&
// //         (!search ||
// //           item.invoice_id.includes(search) ||
// //           item.customer_name.toLowerCase().includes(search.toLowerCase()))
// //       );
// //     });

// //   const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
// //   const totalPages = Math.ceil(filtered.length / pageSize);

// //   const tableColumns = [
// //     { header: "", render: () => <input type="checkbox" /> },
// //     { header: "INVR ID", accessor: "sales_order_ref" },
// //     { header: "Invoice Ref ID", accessor: "invoice_id" },
// //     { header: "Customer Name", accessor: "customer_name" },
// //     { header: "Return Date", accessor: "return_date" },
// //     {
// //       header: "Status",
// //       render: (row) => (
// //         <span className={`status status-${row.status.toLowerCase()}`}>
// //           {row.status}
// //         </span>
// //       ),
// //     },
// //     {
// //   header: "Action",
// //   render: (row) => (
// //     <td id="invoiceCRM-table-action">
// //       <nav className="invoiceCRM-dot-container">
// //         <button
// //           onClick={() => setCurrentPage("editInvoiceReturn")}
// //         >
// //           {row.status === "Draft" ? "Edit" : "View"} Details
// //         </button>
// //         <button disabled={["Draft", "Cancelled"].includes(row.status)}>
// //           Generate Return
// //         </button>
// //       </nav>
// //       <svg
// //         className="invoiceCRM-delete-logo"
// //         xmlns="http://www.w3.org/2000/svg"
// //         width="24"
// //         height="24"
// //         viewBox="0 0 24 24"
// //         fill="none"
// //       >
// //         <path
// //           d="M12 16C12.5304 16 13.0391 16.2107 13.4142 16.5858C13.7893 16.9609 14 17.4696 14 18C14 18.5304 13.7893 19.0391 13.4142 19.4142C13.0391 19.7893 12.5304 20 12 20C11.4696 20 10.9609 19.7893 10.5858 19.4142C10.2107 19.0391 10 18.5304 10 18C10 17.4696 10.2107 16.9609 10.5858 16.5858C10.9609 16.2107 11.4696 16 12 16ZM12 10C12.5304 10 13.0391 10.2107 13.4142 10.5858C13.7893 10.9609 14 11.4696 14 12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14C11.4696 14 10.9609 13.7893 10.5858 13.4142C10.2107 13.0391 10 12.5304 10 12C10 11.4696 10.2107 10.9609 10.5858 10.5858C10.9609 10.2107 11.4696 10 12 10ZM12 4C12.5304 4 13.0391 4.21071 13.4142 4.58579C13.7893 4.96086 14 5.46957 14 6C14 6.53043 13.7893 7.03914 13.4142 7.41421C13.0391 7.78929 12.5304 8 12 8C11.4696 8 10.9609 7.78929 10.5858 7.41421C10.2107 7.03914 10 6.53043 10 6C10 5.46957 10.2107 4.96086 10.5858 4.58579C10.9609 4.21071 11.4696 4 12 4Z"
// //           fill="#2A2A2A"
// //         />
// //       </svg>
// //     </td>
// //   ),
// // },

// //   ];

// //   const filterConfig = [
// //     {
// //       name: "invoice_status",
// //       label: "Invoice Status",
// //       type: "select",
// //       value: filters.invoice_status,
// //       options: [
// //         { label: "All", value: "" },
// //         { label: "Draft", value: "Draft" },
// //         { label: "Send", value: "Send" },
// //         { label: "Paid", value: "Paid" },
// //         { label: "Overdue", value: "Overdue" },
// //         { label: "Cancelled", value: "Cancelled" },
// //       ],
// //     },
// //     {
// //       name: "customer_name",
// //       label: "Customer Name",
// //       type: "select",
// //       value: filters.customer_name,
// //       options: [
// //         { label: "All", value: "" },
// //         { label: "Acme Corp", value: "Acme Corp" },
// //         { label: "Freelance Writer", value:"Freelance Writer" },
// //         { label: "Green Intiatives", value: "Green Intiatives" },
// //       ],
// //     },
// //     {
// //       name: "invoice_from_date",
// //       label: "From Date",
// //       type: "date",
// //       value: filters.invoice_from_date,
// //     },
// //     {
// //       name: "invoice_to_date",
// //       label: "To Date",
// //       type: "date",
// //       value: filters.invoice_to_date,
// //     },
// //   ];

// //   return (
// //     <div className="invoiceCRM-container">
// //       <div className="invoiceCRM-header">
// //         <h2>Invoice Return List</h2>
// //         <button onClick={() => setCurrentPage("createNewInvoiceReturn")}>+ New Invoice Return</button>
// //       </div>

// //       <SearchBar value={search} onChange={setSearch} placeholder="Search by Invoice ID or Name" />

// //       <FilterGroup filters={filterConfig} onChange={handleFilterChange} onClear={clearFilters} />

// //       <DataTable columns={tableColumns} rows={paginated} />

// //       <Pagination
// //         currentPage={page}
// //         totalPages={totalPages}
// //         onNext={() => setPage((prev) => prev + 1)}
// //         onPrev={() => setPage((prev) => prev - 1)}
// //       />
// //     </div>
 
// //   )
// // }
// import React, { useState, useEffect } from "react";
// import SearchBar from "../../reuse-components/search.jsx";
// import FilterGroup from "../../reuse-components/filter.jsx";
// import DataTable from "../../reuse-components/table.jsx";
// import Pagination from "../../reuse-components/pagination.jsx";
// import "./invoiceReturnCRM.css";
// import useInvoiceReturnStore from "./invoiceReturnStore";

// export default function InvoiceReturnCRM({ setCurrentPage }) {

//   // =====================================================
//   // ZUSTAND STORE
//   // =====================================================
//   const {
//     invoiceReturns,
//     loading,
//     currentPage,
//     totalPages,
//     search,
//     setSearch,
//     fetchInvoiceReturns,
//     deleteInvoiceReturn,
//   } = useInvoiceReturnStore();

//   // =====================================================
//   // LOCAL STATE
//   // =====================================================
//   const [filters, setFilters] = useState({
//     invoice_status: "",
//     customer_name: "",
//     invoice_from_date: "",
//     invoice_to_date: "",
//   });

//   const [customerList, setCustomerList] = useState([]);

//   // Delete modal state
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteInvoiceData, setDeleteInvoiceData] = useState(null);

//   // =====================================================
//   // FETCH ON MOUNT
//   // =====================================================
//   useEffect(() => {
//     fetchInvoiceReturns(1, "");
//   }, []);

//   // =====================================================
//   // EXTRACT UNIQUE CUSTOMERS FROM API DATA
//   // =====================================================
//   useEffect(() => {
//     if (invoiceReturns.length > 0) {
//       const uniqueCustomers = [
//         ...new Set(invoiceReturns.map((inv) => inv.customer_name)),
//       ];
//       setCustomerList(uniqueCustomers);
//     }
//   }, [invoiceReturns]);

//   // =====================================================
//   // FILTER HANDLER
//   // =====================================================
//   const handleFilterChange = (name, value) => {
//     setFilters((prev) => ({ ...prev, [name]: value }));
//   };

//   const clearFilters = () => {
//     setFilters({
//       invoice_status: "",
//       customer_name: "",
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
//     await deleteInvoiceReturn(deleteInvoiceData.invoice_id);
//     fetchInvoiceReturns(currentPage, search);
//     setShowDeleteModal(false);
//     setDeleteInvoiceData(null);
//   };

//   // =====================================================
//   // CLIENT-SIDE FILTERING
//   // =====================================================
//   const filteredData = invoiceReturns.filter((item) => {
//     const matchStatus = filters.invoice_status
//       ? item.status === filters.invoice_status
//       : true;
//     const matchCustomer = filters.customer_name
//       ? item.customer_name === filters.customer_name
//       : true;
//     const matchFrom = filters.invoice_from_date
//       ? new Date(item.invoice_date) >= new Date(filters.invoice_from_date)
//       : true;
//     const matchTo = filters.invoice_to_date
//       ? new Date(item.invoice_date) <= new Date(filters.invoice_to_date)
//       : true;
//     const matchSearch =
//       !search ||
//       item.invoice_id?.toLowerCase().includes(search.toLowerCase()) ||
//       item.customer_name?.toLowerCase().includes(search.toLowerCase());
//     return matchStatus && matchCustomer && matchFrom && matchTo && matchSearch;
//   });

//   // =====================================================
//   // TABLE COLUMNS
//   // =====================================================
//   const tableColumns = [
//     { header: "", render: () => <input type="checkbox" /> },
//     { header: "INVR ID", accessor: "sales_order_ref" },
//     { header: "Invoice Ref ID", accessor: "invoice_id" },
//     { header: "Customer Name", accessor: "customer_name" },
//     { header: "Return Date", accessor: "return_date" },
//     {
//       header: "Status",
//       render: (row) => (
//         <span className={`status status-${row.status?.toLowerCase()}`}>
//           {row.status}
//         </span>
//       ),
//     },
//     {
//       header: "Action",
//       render: (row) => (
//         <td id="invoiceCRM-table-action">
//           <nav className="invoiceCRM-dot-container">
//             <button onClick={() => setCurrentPage("editInvoiceReturn")}>
//               {row.status === "Draft" ? "Edit" : "View"} Details
//             </button>
//             <button disabled={["Draft", "Cancelled"].includes(row.status)}>
//               Generate Return
//             </button>
//             <button
//               onClick={() => handleDeleteClick(row)}
//               style={{ color: "red" }}
//             >
//               Delete
//             </button>
//           </nav>
//           <svg
//             className="invoiceCRM-delete-logo"
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//           >
//             <path
//               d="M12 16C12.5304 16 13.0391 16.2107 13.4142 16.5858C13.7893 16.9609 14 17.4696 14 18C14 18.5304 13.7893 19.0391 13.4142 19.4142C13.0391 19.7893 12.5304 20 12 20C11.4696 20 10.9609 19.7893 10.5858 19.4142C10.2107 19.0391 10 18.5304 10 18C10 17.4696 10.2107 16.9609 10.5858 16.5858C10.9609 16.2107 11.4696 16 12 16ZM12 10C12.5304 10 13.0391 10.2107 13.4142 10.5858C13.7893 10.9609 14 11.4696 14 12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14C11.4696 14 10.9609 13.7893 10.5858 13.4142C10.2107 13.0391 10 12.5304 10 12C10 11.4696 10.2107 10.9609 10.5858 10.5858C10.9609 10.2107 11.4696 10 12 10ZM12 4C12.5304 4 13.0391 4.21071 13.4142 4.58579C13.7893 4.96086 14 5.46957 14 6C14 6.53043 13.7893 7.03914 13.4142 7.41421C13.0391 7.78929 12.5304 8 12 8C11.4696 8 10.9609 7.78929 10.5858 7.41421C10.2107 7.03914 10 6.53043 10 6C10 5.46957 10.2107 4.96086 10.5858 4.58579C10.9609 4.21071 11.4696 4 12 4Z"
//               fill="#2A2A2A"
//             />
//           </svg>
//         </td>
//       ),
//     },
//   ];

//   // =====================================================
//   // FILTER CONFIG — customer options dynamic from API
//   // =====================================================
//   const filterConfig = [
//     {
//       name: "invoice_status",
//       label: "Invoice Status",
//       type: "select",
//       value: filters.invoice_status,
//       options: [
//         { label: "All", value: "" },
//         { label: "Draft", value: "Draft" },
//         { label: "Send", value: "Send" },
//         { label: "Paid", value: "Paid" },
//         { label: "Overdue", value: "Overdue" },
//         { label: "Cancelled", value: "Cancelled" },
//       ],
//     },
//     {
//       name: "customer_name",
//       label: "Customer Name",
//       type: "select",
//       value: filters.customer_name,
//       options: [
//         { label: "All", value: "" },
//         ...customerList.map((name) => ({ label: name, value: name })),
//       ],
//     },
//     {
//       name: "invoice_from_date",
//       label: "From Date",
//       type: "date",
//       value: filters.invoice_from_date,
//     },
//     {
//       name: "invoice_to_date",
//       label: "To Date",
//       type: "date",
//       value: filters.invoice_to_date,
//     },
//   ];

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
//             <p>Delete Invoice Return</p>
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
//               Are you sure you want to delete invoice return <br />
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
//         <div className="invoiceCRM-header">
//           <h2>Invoice Return List</h2>
//           <button onClick={() => setCurrentPage("createNewInvoiceReturn")}>
//             + New Invoice Return
//           </button>
//         </div>

//         <SearchBar
//           value={search}
//           onChange={(val) => {
//             setSearch(val);
//             fetchInvoiceReturns(1, val);
//           }}
//           placeholder="Search by Invoice ID or Customer Name"
//         />

//         <FilterGroup
//           filters={filterConfig}
//           onChange={handleFilterChange}
//           onClear={clearFilters}
//         />

//         {loading ? (
//           <p style={{ textAlign: "center", padding: "20px" }}>Loading...</p>
//         ) : (
//           <DataTable columns={tableColumns} rows={filteredData} />
//         )}

//         <Pagination
//           currentPage={currentPage}
//           totalPages={totalPages}
//           onNext={handleNext}
//           onPrev={handlePrev}
//         />
//       </div>
//     </>
//   );

//   function handleNext() {
//     if (currentPage < totalPages) fetchInvoiceReturns(currentPage + 1, search);
//   }
//   function handlePrev() {
//     if (currentPage > 1) fetchInvoiceReturns(currentPage - 1, search);
//   }
// }
import React, { useState, useEffect } from "react";
import "./invoiceReturnCRM.css";
import useInvoiceReturnStore from "./invoiceReturnStore";

export default function InvoiceReturnCRM({ setCurrentPage }) {
  const {
    invoiceReturns,
    loading,
    currentPage,
    totalPages,
    search,
    setSearch,
    fetchInvoiceReturns,
    deleteInvoiceReturn,
  } = useInvoiceReturnStore();

  const [filters, setFilters] = useState({
    invoice_status: "",
    invoice_from_date: "",
    invoice_to_date: "",
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteInvoiceData, setDeleteInvoiceData] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => { fetchInvoiceReturns(1, ""); }, []);

  useEffect(() => {
    const close = () => setOpenMenuId(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const handleSearch = (e) => {
    const v = e.target.value;
    setSearch(v);
    fetchInvoiceReturns(1, v);
  };

  const handleNext = () => { if (currentPage < totalPages) fetchInvoiceReturns(currentPage + 1, search); };
  const handlePrev = () => { if (currentPage > 1) fetchInvoiceReturns(currentPage - 1, search); };

  const handleDeleteClick = (row) => {
    setOpenMenuId(null);
    setDeleteInvoiceData(row);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteInvoiceData) return;
    await deleteInvoiceReturn(deleteInvoiceData.id || deleteInvoiceData.invoice_return_id);
    fetchInvoiceReturns(currentPage, search);
    setShowDeleteModal(false);
    setDeleteInvoiceData(null);
  };

  // ── Client-side filtering ───────────────────────────────────────────────
  const filteredData = (Array.isArray(invoiceReturns) ? invoiceReturns : []).filter((item) => {
    const matchStatus = filters.invoice_status
      ? item.status === filters.invoice_status : true;
    const matchFrom = filters.invoice_from_date
      ? new Date(item.invoice_return_date) >= new Date(filters.invoice_from_date) : true;
    const matchTo = filters.invoice_to_date
      ? new Date(item.invoice_return_date) <= new Date(filters.invoice_to_date) : true;
    const customerName = item.customer?.first_name
      ? `${item.customer.first_name} ${item.customer.last_name || ""}`.trim()
      : "—";
    const matchSearch = !search ||
      item.invoice_return_id?.toLowerCase().includes(search.toLowerCase()) ||
      customerName.toLowerCase().includes(search.toLowerCase()) ||
      item.invoice?.invoice_id?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchFrom && matchTo && matchSearch;
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
              Delete Invoice Return
            </p>
            <p style={{ textAlign: "center", fontSize: "14px", lineHeight: "22px", marginBottom: "24px", color: "#444" }}>
              Are you sure you want to delete<br />
              <strong>{deleteInvoiceData?.invoice_return_id}</strong><br />
              <span style={{ color: "#888" }}>
                Invoice Ref: {deleteInvoiceData?.invoice?.invoice_id || "—"}
              </span>
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
          <p>Invoice Return List</p>
          <button onClick={() => setCurrentPage("invoiceReturnForm", null)}>
            + New Invoice Return
          </button>
        </div>

        {/* ── Search ── */}
        <div className="invoiceCRM-search-box">
          <label htmlFor="searchReturnByID">
            <svg className="invoiceCRM-search-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
            </svg>
          </label>
          <input
            id="searchReturnByID"
            placeholder="Search by Return ID, Invoice ID, Customer..."
            value={search}
            onChange={handleSearch}
          />
        </div>

        {/* ── Filters ── */}
        <div className="invoiceCRM-clearfilter">
          <p onClick={() => setFilters({ invoice_status: "", invoice_from_date: "", invoice_to_date: "" })}>
            Clear Filter
          </p>
        </div>

        <div className="invoiceCRM-search-category">
          <div className="invoiceCRM-input-box">
            <label>Status</label>
            <select value={filters.invoice_status}
              onChange={(e) => setFilters((p) => ({ ...p, invoice_status: e.target.value }))}>
              <option value="">All</option>
              <option value="Draft">Draft</option>
              <option value="Submitted">Submitted</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="invoiceCRM-input-box">
            <label>Return Date</label>
            <nav id="invoice_date">
              <div>
                <span>From </span>
                <input className="invoiceCRM-date" type="date" value={filters.invoice_from_date}
                  onChange={(e) => setFilters((p) => ({ ...p, invoice_from_date: e.target.value }))} />
              </div>
              <div>
                <span>To </span>
                <input className="invoiceCRM-date" type="date" value={filters.invoice_to_date}
                  onChange={(e) => setFilters((p) => ({ ...p, invoice_to_date: e.target.value }))} />
              </div>
            </nav>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="invoiceCRM-table-cointainer">
          <table>
            <thead className="invoiceCRM-table-head">
              <tr>
                <th>Return ID</th>
                <th>Invoice Ref.</th>
                <th>Customer Name</th>
                <th>Return Date</th>
                <th>Amount to Refund</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="invoiceCRM-table-body">
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: "20px" }}>Loading...</td></tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((ele, ind) => {
                  // ── Derive display values from nested API shape ──
                  const customerName = ele.customer?.first_name
                    ? `${ele.customer.first_name} ${ele.customer.last_name || ""}`.trim()
                    : "—";
                  const invoiceRef = ele.invoice?.invoice_id || "—";
                  const status = ele.status || "—";

                  return (
                    <tr key={ele.id || ind}>
                      <td>{ele.invoice_return_id || "—"}</td>
                      <td>{invoiceRef}</td>
                      <td>{customerName}</td>
                      <td>{ele.invoice_return_date || "—"}</td>
                      <td>{ele.amount_to_refund ?? "—"}</td>
                      <td>
                        <p className={`invoiceCRM-Status ${
                          status === "Draft"      ? "invoiceCRM-Status-draft"     :
                          status === "Submitted"  ? "invoiceCRM-Status-Send"      :
                          status === "Cancelled"  ? "invoiceCRM-Status-Cancelled" : ""
                        }`}>{status}</p>
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
                            zIndex: 999, minWidth: "160px", overflow: "hidden",
                          }}>
                            <div
                              onClick={() => { setOpenMenuId(null); setCurrentPage("invoiceReturnForm", ele); }}
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
                  );
                })
              ) : (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: "20px" }}>No Data Found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
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