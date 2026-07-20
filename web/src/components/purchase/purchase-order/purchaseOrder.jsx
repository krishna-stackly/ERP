// import React, { useState, useEffect } from "react";
// import "./purchaseOrder.css";
// import { useNavigate } from "react-router-dom";
// import usePurchaseOrderStore from "./purchaseStore"; // adjust path

// export default function PurchaseOrder({ setCurrentPage }) {
//   console.log("Hi")
//   const navigate = useNavigate();

//   // =====================================================
//   // ZUSTAND STORE
//   // =====================================================
//   const {
//     purchaseOrders,
//     loading,
//     currentPage,
//     totalPages,
//     search,
//     setSearch,
//     fetchPurchaseOrders,
//   } = usePurchaseOrderStore();

//   // =====================================================
//   // LOCAL STATE
//   // =====================================================
//   const [filter, setFilter] = useState({
//     status: "",
//     supplier: "",
//     payment_method: "",
//   });

//   const [supplierList, setSupplierList] = useState([]);

//   // =====================================================
//   // FETCH ON MOUNT
//   // =====================================================
//   useEffect(() => {
//     fetchPurchaseOrders(1, "");
//   }, []);

//   // =====================================================
//   // EXTRACT UNIQUE SUPPLIERS FROM API DATA
//   // =====================================================
//   useEffect(() => {
//     if (purchaseOrders.length > 0) {
//       const uniqueSuppliers = [
//         ...new Set(purchaseOrders.map((po) => po.supplier_name)),
//       ];
//       setSupplierList(uniqueSuppliers);
//     }
//   }, [purchaseOrders]);

//   // =====================================================
//   // SEARCH HANDLER
//   // =====================================================
//   const handleSearch = (e) => {
//     const value = e.target.value;
//     setSearch(value);
//     fetchPurchaseOrders(1, value);
//   };

//   // =====================================================
//   // PAGINATION HANDLERS
//   // =====================================================
//   const handleNext = () => {
//     if (currentPage < totalPages) {
//       fetchPurchaseOrders(currentPage + 1, search);
//     }
//   };

//   const handlePrev = () => {
//     if (currentPage > 1) {
//       fetchPurchaseOrders(currentPage - 1, search);
//     }
//   };

//   // =====================================================
//   // FILTER HANDLER
//   // =====================================================
//   const handleClearFilter = () => {
//     setFilter({
//       status: "",
//       supplier: "",
//       payment_method: "",
//     });
//   };

//   // =====================================================
//   // CLIENT-SIDE FILTERING
//   // =====================================================
//   const filteredData = purchaseOrders.filter((item) => {
//     const matchStatus = filter.status ? item.status === filter.status : true;
//     const matchSupplier = filter.supplier
//       ? item.supplier_name === filter.supplier
//       : true;
//     const matchPayment = filter.payment_method
//       ? item.payment_terms === filter.payment_method
//       : true;
//     return matchStatus && matchSupplier && matchPayment;
//   });

//   // =====================================================
//   // RENDER
//   // =====================================================
//   return (
//     <>
//       <div className="purchaseOrder-container">

//         {/* HEADER */}
//         <div className="purchaseOrder-header">
//           <p>Purchase Order</p>
//           <button
//             onClick={(e) => {
//               e.preventDefault();
//               setCurrentPage("createNewPurchase");
//             }}
//           >
//             + New Purchase Order
//           </button>
//         </div>

//         {/* SEARCH BOX */}
//         <div className="purchaseOrder-search-box">
//           <label htmlFor="searchByID">
//             <svg
//               className="purchaseOrder-search-logo"
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 512 512"
//             >
//               <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
//             </svg>
//           </label>
//           <input
//             id="searchByID"
//             placeholder="Search by PO number, Supplier name...."
//             value={search}
//             onChange={handleSearch}
//           />
//         </div>

//         {/* CLEAR FILTER */}
//         <div className="purchaseOrder-clearfilter">
//           <p onClick={handleClearFilter}>Clear Filter</p>
//         </div>

//         {/* FILTERS */}
//         <div className="purchaseOrder-search-category">

//           {/* Status Filter */}
//           <div className="purchaseOrder-input-box">
//             <label htmlFor="status">Status</label>
//             <select
//               value={filter.status}
//               onChange={(e) =>
//                 setFilter((prev) => ({ ...prev, status: e.target.value }))
//               }
//               id="status"
//             >
//               <option value="">All</option>
//               <option value="Draft">Draft</option>
//               <option value="Open">Open</option>
//               <option value="Partially Received">Partially Received</option>
//               <option value="Closed">Closed</option>
//               <option value="Cancelled">Cancelled</option>
//             </select>
//           </div>

//           {/* Supplier Filter */}
//           <div className="purchaseOrder-input-box">
//             <label htmlFor="supplier">Supplier</label>
//             <select
//               id="supplier"
//               value={filter.supplier}
//               onChange={(e) =>
//                 setFilter((prev) => ({ ...prev, supplier: e.target.value }))
//               }
//             >
//               <option value="">All Types</option>
//               {supplierList.map((ele, ind) => (
//                 <option key={ind} value={ele}>
//                   {ele}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Payment Method Filter */}
//           <div className="purchaseOrder-input-box">
//             <label htmlFor="payment_method">Payment Method</label>
//             <select
//               id="payment_method"
//               value={filter.payment_method}
//               onChange={(e) =>
//                 setFilter((prev) => ({
//                   ...prev,
//                   payment_method: e.target.value,
//                 }))
//               }
//             >
//               <option value="">All Types</option>
//               <option value="Net 30">Net 30</option>
//               <option value="Net 45">Net 45</option>
//               <option value="Net 90">Net 90</option>
//               <option value="Credit">Credit</option>
//               <option value="Partial Advance">Partial Advance</option>
//               <option value="Advance">Advance</option>
//               <option value="On Delivery (COD)">On Delivery (COD)</option>
//               <option value="Upon Invoice">Upon Invoice</option>
//             </select>
//           </div>
//         </div>

//         {/* TABLE */}
//         <div className="purchaseOrder-table-cointainer">
//           <table>
//             <thead className="purchaseOrder-table-head">
//               <tr>
//                 <th></th>
//                 <th><pre>PO ID</pre></th>
//                 <th><pre>Supplier Name</pre></th>
//                 <th><pre>PO Date</pre></th>
//                 <th><pre>Delivery Date</pre></th>
//                 <th>
//                   <div className="purchaseOrder-status-filter">
//                     Status
//                     <nav className="purchaseOrder-filter-box">
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
//                 <th><pre>Payment Terms</pre></th>
//                 <th><pre>Total Value</pre></th>
//                 <th>Action</th>
//               </tr>
//             </thead>

//             <tbody className="purchaseOrder-table-body">
//               {/* LOADING STATE */}
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
//                       <input
//                         className="purchaseOrder-delete-logo"
//                         type="checkbox"
//                       />
//                     </td>
//                     <td><pre>{ele.po_id}</pre></td>
//                     <td><pre>{ele.supplier_name}</pre></td>
//                     <td><pre>{ele.po_date}</pre></td>
//                     <td><pre>{ele.delivery_date}</pre></td>
//                     <td>
//                       <p
//                         className={`purchaseOrder-Status ${
//                           ele.status === "Draft"
//                             ? "purchaseOrder-Status-draft"
//                             : ele.status === "Submitted"
//                             ? "purchaseOrder-Status-Submitted"
//                             : ele.status === "Partially Received"
//                             ? "purchaseOrder-Status-PartiallyReceived"
//                             : ele.status === "Received"
//                             ? "purchaseOrder-Status-Received"
//                             : ele.status === "Cancelled"
//                             ? "purchaseOrder-Status-Cancelled"
//                             : ""
//                         }`}
//                       >
//                         <pre>{ele.status}</pre>
//                       </p>
//                     </td>
//                     <td><pre>{ele.payment_terms}</pre></td>
//                     <td><pre>{ele.total_value}</pre></td>
//                     <td id="purchaseOrder-table-action">
//                       <nav className="purchaseOrder-dot-container">
//                         <button
//                           onClick={() => {
//                             navigate(`/?tab=editNewSales/${ele.po_id}`);
//                             setCurrentPage("editPurchase");
//                           }}
//                         >
//                           {ele.status === "Draft" ? "Edit" : "View"} details
//                         </button>
//                         <button
//                           disabled={
//                             ele.status === "Draft" || ele.status === "Cancelled"
//                           }
//                         >
//                           Generate Stock Receipt
//                         </button>
//                       </nav>
//                       <svg
//                         className="purchaseOrder-delete-logo"
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
//                   <td colSpan={9}>No Data Found</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* PAGINATION */}
//         <nav className="purchaseOrder-table-bottem">
//           <p className="purchaseOrder-num-entries">
//             Showing {filteredData.length} entries
//           </p>
//           <div className="purchaseOrder-manage-control-box">
//             <button
//               className="purchaseOrder-manage-btn"
//               onClick={handlePrev}
//               disabled={currentPage === 1}
//             >
//               Prev
//             </button>
//             <nav className="purchaseOrder-num-page">
//               Page {currentPage} of {totalPages}
//             </nav>
//             <button
//               className="purchaseOrder-manage-btn"
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
import "./purchaseOrder.css";
import { useNavigate } from "react-router-dom";
import usePurchaseOrderStore from "./purchaseStore";

export default function PurchaseOrder({ setCurrentPage, setSelectedPoId }) {
  console.log("HII")
  const navigate = useNavigate();

  // =====================================================
  // ZUSTAND STORE
  // =====================================================
  const {
    purchaseOrders,
    loading,
    currentPage,
    totalPages,
    search,
    setSearch,
    fetchPurchaseOrders,
    deletePurchaseOrder,
  } = usePurchaseOrderStore();

  // =====================================================
  // LOCAL STATE
  // =====================================================
  const [filter, setFilter] = useState({
    status: "",
    supplier: "",
    payment_method: "",
  });

  const [supplierList, setSupplierList] = useState([]);

  // Delete modal state — same pattern as EnquiryList
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePOData, setDeletePOData] = useState(null);
  // Add this state at the top with your other local states
  // const [selectedPoId, setSelectedPoId] = useState(null);

  // =====================================================
  // FETCH ON MOUNT
  // =====================================================
  useEffect(() => {
    fetchPurchaseOrders(1, "");
  }, []);

  // =====================================================
  // EXTRACT UNIQUE SUPPLIERS FROM API DATA
  // =====================================================
  useEffect(() => {
    if (purchaseOrders.length > 0) {
      const uniqueSuppliers = [
        ...new Set(purchaseOrders.map((po) => po.supplier_name)),
      ];
      setSupplierList(uniqueSuppliers);
    }
  }, [purchaseOrders]);

  // =====================================================
  // SEARCH HANDLER
  // =====================================================
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchPurchaseOrders(1, value);
  };

  // =====================================================
  // PAGINATION HANDLERS
  // =====================================================
  const handleNext = () => {
    if (currentPage < totalPages) {
      fetchPurchaseOrders(currentPage + 1, search);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      fetchPurchaseOrders(currentPage - 1, search);
    }
  };

  // =====================================================
  // FILTER HANDLERS
  // =====================================================
  const handleClearFilter = () => {
    setFilter({ status: "", supplier: "", payment_method: "" });
  };

  // =====================================================
  // DELETE HANDLERS — same pattern as EnquiryList
  // =====================================================
  const handleDeleteClick = (po) => {
    setDeletePOData(po);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletePOData) return;
    await deletePurchaseOrder(deletePOData.po_id);
    fetchPurchaseOrders(currentPage, search);
    setShowDeleteModal(false);
    setDeletePOData(null);
  };

  // =====================================================
  // CLIENT-SIDE FILTERING
  // =====================================================
  const filteredData = purchaseOrders.filter((item) => {
    const matchStatus = filter.status ? item.status === filter.status : true;
    const matchSupplier = filter.supplier
      ? item.supplier_name === filter.supplier
      : true;
    const matchPayment = filter.payment_method
      ? item.payment_terms === filter.payment_method
      : true;
    return matchStatus && matchSupplier && matchPayment;
  });

  // =====================================================
  // RENDER
  // =====================================================
  return (
    <>
      {/* ================================================ */}
      {/* DELETE CONFIRMATION MODAL — same as EnquiryList  */}
      {/* ================================================ */}
      {showDeleteModal && (
        <div
          className="purchaseOrder-delete-modal"
          style={{
            maxWidth: "420px",
            width: "100%",
            paddingBottom: "10px",
            height: "auto",
            minHeight: "unset",
          }}
        >
          {/* Close Icon */}
          <svg
            className="purchaseOrder-close-icon"
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

          <div className="purchaseOrder-modal-head">
            <p>Delete Purchase Order</p>
          </div>

          <div
            className="purchaseOrder-modal-body"
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
              Are you sure you want to delete purchase order <br />
              <strong>{deletePOData?.po_id}</strong>
              <br />
              (Supplier: {deletePOData?.supplier_name})?
            </p>

            <div
              className="purchaseOrder-modal-actions"
              style={{ justifyContent: "center", gap: "14px" }}
            >
              <button
                type="button"
                className="purchaseOrder-cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="purchaseOrder-delete-btn"
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
      <div className={`purchaseOrder-container ${showDeleteModal ? "blur" : ""}`}>

        {/* HEADER */}
        <div className="purchaseOrder-header">
          <p>Purchase Order</p>
          <button
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage("createNewPurchase");
            }}
          >
            + New Purchase Order
          </button>
        </div>

        {/* SEARCH BOX */}
        <div className="purchaseOrder-search-box">
          <label htmlFor="searchByID">
            <svg
              className="purchaseOrder-search-logo"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
            </svg>
          </label>
          <input
            id="searchByID"
            placeholder="Search by PO number, Supplier name...."
            value={search}
            onChange={handleSearch}
          />
        </div>

        {/* CLEAR FILTER */}
        <div className="purchaseOrder-clearfilter">
          <p onClick={handleClearFilter}>Clear Filter</p>
        </div>

        {/* FILTERS */}
        <div className="purchaseOrder-search-category">

          {/* Status Filter */}
          <div className="purchaseOrder-input-box">
            <label htmlFor="status">Status</label>
            <select
              value={filter.status}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, status: e.target.value }))
              }
              id="status"
            >
              <option value="">All</option>
              <option value="Draft">Draft</option>
              <option value="Open">Open</option>
              <option value="Partially Received">Partially Received</option>
              <option value="Closed">Closed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Supplier Filter */}
          <div className="purchaseOrder-input-box">
            <label htmlFor="supplier">Supplier</label>
            <select
              id="supplier"
              value={filter.supplier}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, supplier: e.target.value }))
              }
            >
              <option value="">All Types</option>
              {supplierList.map((ele, ind) => (
                <option key={ind} value={ele}>
                  {ele}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method Filter */}
          <div className="purchaseOrder-input-box">
            <label htmlFor="payment_method">Payment Method</label>
            <select
              id="payment_method"
              value={filter.payment_method}
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  payment_method: e.target.value,
                }))
              }
            >
              <option value="">All Types</option>
              <option value="Net 30">Net 30</option>
              <option value="Net 45">Net 45</option>
              <option value="Net 90">Net 90</option>
              <option value="Credit">Credit</option>
              <option value="Partial Advance">Partial Advance</option>
              <option value="Advance">Advance</option>
              <option value="On Delivery (COD)">On Delivery (COD)</option>
              <option value="Upon Invoice">Upon Invoice</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="purchaseOrder-table-cointainer">
          <table>
            <thead className="purchaseOrder-table-head">
              <tr>
                <th></th>
                <th><pre>PO ID</pre></th>
                <th><pre>Supplier Name</pre></th>
                <th><pre>PO Date</pre></th>
                <th><pre>Delivery Date</pre></th>
                <th>
                  <div className="purchaseOrder-status-filter">
                    Status
                    <nav className="purchaseOrder-filter-box">
                      <p>Newest First</p>
                      <p>Oldest First</p>
                      <p>Progressing {`(Draft → Cancelled)`}</p>
                      <p>Reverse Progressing{`(Cancelled → Draft)`}</p>
                    </nav>
                    <svg
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
                <th><pre>Payment Terms</pre></th>
                <th><pre>Total Value</pre></th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody className="purchaseOrder-table-body">
              {loading ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center" }}>
                    Loading...
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((ele, ind) => (
                  <tr key={ind}>
                    <td>
                      <input
                        className="purchaseOrder-checkbox"
                        type="checkbox"
                      />
                    </td>
                    <td><pre>{ele.PO_ID}</pre></td>
                    <td><pre>{ele.supplier_name}</pre></td>
                    <td><pre>{ele.po_date}</pre></td>
                    <td><pre>{ele.delivery_date}</pre></td>
                    <td>
                      <p
                        className={`purchaseOrder-Status ${
                          ele.status === "Draft"
                            ? "purchaseOrder-Status-draft"
                            : ele.status === "Submitted"
                            ? "purchaseOrder-Status-Submitted"
                            : ele.status === "Partially Received"
                            ? "purchaseOrder-Status-PartiallyReceived"
                            : ele.status === "Received"
                            ? "purchaseOrder-Status-Received"
                            : ele.status === "Cancelled"
                            ? "purchaseOrder-Status-Cancelled"
                            : ""
                        }`}
                      >
                        <pre>{ele.status}</pre>
                      </p>
                    </td>
                    <td><pre>{ele.payment_terms}</pre></td>
                    <td><pre>{ele.total_order_value}</pre></td>
                    <td id="purchaseOrder-table-action">
                      <nav className="purchaseOrder-dot-container">
                       <button
                          onClick={() => {
                            setSelectedPoId(ele.id);        // numeric id e.g. 1 or 2
                            setCurrentPage("editPurchase");
                          }}
                        >
                          {ele.status === "Draft" ? "Edit" : "View"} details
                        </button>
                        <button
                          disabled={
                            ele.status === "Draft" || ele.status === "Cancelled"
                          }
                        >
                          Generate Stock Receipt
                        </button>
                        {/* DELETE — triggers modal like EnquiryList */}
                        <button
                          onClick={() => handleDeleteClick(ele)}
                          style={{ color: "red" }}
                        >
                          Delete
                        </button>
                      </nav>

                      {/* Three-dot SVG trigger */}
                      <svg
                        className="purchaseOrder-delete-logo"
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
                  <td colSpan={9} style={{ textAlign: "center" }}>
                    No Data Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <nav className="purchaseOrder-table-bottem">
          <p className="purchaseOrder-num-entries">
            Showing {filteredData.length} entries
          </p>
          <div className="purchaseOrder-manage-control-box">
            <button
              className="purchaseOrder-manage-btn"
              onClick={handlePrev}
              disabled={currentPage <= 1}
            >
              Prev
            </button>
            <nav className="purchaseOrder-num-page">
              Page {currentPage} of {totalPages}
            </nav>
            <button
              className="purchaseOrder-manage-btn"
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