import React, { useState, useEffect } from "react";
import "./stockReceipt.css";
import { useNavigate } from "react-router-dom";
import useStockReceiptStore from "./stockReceiptStore";

export default function StockReceipt({ setCurrentPage }) {
  const navigate = useNavigate();

  // =====================================================
  // ZUSTAND STORE
  // =====================================================
  const {
    stockReceipts,
    loading,
    currentPage,
    totalPages,
    search,
    setSearch,
    fetchStockReceipts,
    deleteStockReceipt,
  } = useStockReceiptStore();

  // =====================================================
  // LOCAL STATE
  // =====================================================
  const [filter, setFilter] = useState({
    status: "",
    supplier_name: "",
    stock_from_date: "",
    stock_to_date: "",
  });

  const [supplierList, setSupplierList] = useState([]);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteGRNData, setDeleteGRNData] = useState(null);

  // =====================================================
  // FETCH ON MOUNT
  // =====================================================
  useEffect(() => {
    fetchStockReceipts(1, "");
  }, []);

  // =====================================================
  // EXTRACT UNIQUE SUPPLIERS FROM API DATA
  // =====================================================
  useEffect(() => {
    if (stockReceipts.length > 0) {
      // API returns supplier as nested object: item.supplier.supplier_name
      const uniqueSuppliers = [
        ...new Set(
          stockReceipts.map((sr) => sr.supplier?.supplier_name).filter(Boolean)
        ),
      ];
      setSupplierList(uniqueSuppliers);
    }
  }, [stockReceipts]);

  // =====================================================
  // HELPER: normalize raw API item to component shape
  // Call this in your store's fetchStockReceipts before
  // storing into state, OR use it here inline.
  // =====================================================
  const normalize = (item) => ({
    // internal DB id (used for delete API call)
    id: item.id,

    // display fields — mapped from actual API keys
    grn_id: item.GRN_ID,                             // API: "GRN_ID"
    po_ref: item.po_reference,                        // API: "po_reference"
    received_date: item.received_date,                // API: "received_date" (no typo)
    supplier_name: item.supplier?.supplier_name ?? "", // API: nested object
    total_items: item.items?.length ?? 0,             // API: items array length
    received_by: item.received_by,                    // API: integer user id
    qc_done_by: item.qc_done_by,                      // API: integer user id
    status: item.status,

    // keep raw for any other usage
    _raw: item,
  });

  // =====================================================
  // NORMALIZED DATA
  // If your store already normalizes, remove this and
  // use stockReceipts directly.
  // =====================================================
  const normalizedReceipts = stockReceipts.map(normalize);

  // =====================================================
  // SEARCH HANDLER
  // =====================================================
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchStockReceipts(1, value);
  };

  // =====================================================
  // PAGINATION HANDLERS
  // =====================================================
  const handleNext = () => {
    if (currentPage < totalPages) {
      fetchStockReceipts(currentPage + 1, search);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      fetchStockReceipts(currentPage - 1, search);
    }
  };

  // =====================================================
  // FILTER HANDLERS
  // =====================================================
  const handleClearFilter = () => {
    setFilter({
      status: "",
      supplier_name: "",
      stock_from_date: "",
      stock_to_date: "",
    });
  };

  // =====================================================
  // DELETE HANDLERS
  // =====================================================
  const handleDeleteClick = (grn) => {
    setDeleteGRNData(grn);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteGRNData) return;
    // Use numeric `id` for the delete API call, not GRN_ID string
    await deleteStockReceipt(deleteGRNData.id);
    fetchStockReceipts(currentPage, search);
    setShowDeleteModal(false);
    setDeleteGRNData(null);
  };

  // =====================================================
  // CLIENT-SIDE FILTERING
  // =====================================================
  const filteredData = normalizedReceipts.filter((item) => {
    const matchStatus = filter.status ? item.status === filter.status : true;
    const matchSupplier = filter.supplier_name
      ? item.supplier_name === filter.supplier_name
      : true;
    const matchFrom = filter.stock_from_date
      ? new Date(item.received_date) >= new Date(filter.stock_from_date)
      : true;
    const matchTo = filter.stock_to_date
      ? new Date(item.received_date) <= new Date(filter.stock_to_date)
      : true;
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
          className="stockReceipt-delete-modal"
          style={{
            maxWidth: "420px",
            width: "100%",
            paddingBottom: "10px",
            height: "auto",
            minHeight: "unset",
          }}
        >
          <svg
            className="stockReceipt-close-icon"
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

          <div className="stockReceipt-modal-head">
            <p>Delete Stock Receipt</p>
          </div>

          <div
            className="stockReceipt-modal-body"
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
              Are you sure you want to delete stock receipt <br />
              <strong>{deleteGRNData?.grn_id}</strong>
              <br />
              (Supplier: {deleteGRNData?.supplier_name})?
            </p>

            <div
              className="stockReceipt-modal-actions"
              style={{ justifyContent: "center", gap: "14px" }}
            >
              <button
                type="button"
                className="stockReceipt-cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="stockReceipt-delete-btn"
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
      <div className={`stockReceipt-container ${showDeleteModal ? "blur" : ""}`}>

        {/* HEADER */}
        <div className="stockReceipt-header">
          <p>Stock Receipt Note</p>
          <button onClick={() => setCurrentPage("stockReceiptForm", null)}>
            + New Stock Receipt
          </button>
        </div>

        {/* SEARCH BOX */}
        <div className="stockReceipt-search-box">
          <label htmlFor="searchByID">
            <svg
              className="stockReceipt-search-logo"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
            </svg>
          </label>
          <input
            id="searchByID"
            placeholder="Search by GRN number, Supplier name...."
            value={search}
            onChange={handleSearch}
          />
        </div>

        {/* CLEAR FILTER */}
        <div className="stockReceipt-clearfilter">
          <p onClick={handleClearFilter}>Clear Filter</p>
        </div>

        {/* FILTERS */}
        <div className="stockReceipt-search-category">

          {/* Status Filter */}
          <div className="stockReceipt-input-box">
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
              <option value="Returned">Returned</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Supplier Filter — dynamic from API data */}
          <div className="stockReceipt-input-box">
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

          {/* Date Range Filter */}
          <div className="stockReceipt-input-box">
            <label htmlFor="received_date">Received Date</label>
            <nav id="received_date">
              <div>
                <span>From </span>
                <input
                  value={filter.stock_from_date}
                  onChange={(e) =>
                    setFilter((prev) => ({
                      ...prev,
                      stock_from_date: e.target.value,
                    }))
                  }
                  className="stockReceipt-date"
                  type="date"
                />
              </div>
              <div>
                <span>To </span>
                <input
                  value={filter.stock_to_date}
                  onChange={(e) =>
                    setFilter((prev) => ({
                      ...prev,
                      stock_to_date: e.target.value,
                    }))
                  }
                  className="stockReceipt-date"
                  type="date"
                />
              </div>
            </nav>
          </div>
        </div>

        {/* TABLE */}
        <div className="stockReceipt-table-cointainer">
          <table>
            <thead className="stockReceipt-table-head">
              <tr>
                <th></th>
                <th><pre>GRN ID</pre></th>
                <th><pre>PO Ref.</pre></th>
                <th><pre>Received Date</pre></th>
                <th><pre>Supplier Name</pre></th>
                <th><pre>Total Items</pre></th>
                <th><pre>Received By</pre></th>
                <th><pre>QC Done By</pre></th>
                <th><pre>Status</pre></th>
                <th><pre>Action</pre></th>
              </tr>
            </thead>

            <tbody className="stockReceipt-table-body">
              {loading ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: "center" }}>
                    Loading...
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((ele, ind) => (
                  <tr key={ind}>
                    <td>
                      <input
                        type="checkbox"
                        className="stockReceipt-table-check"
                      />
                    </td>
                    {/* grn_id mapped from GRN_ID */}
                    <td><pre>{ele.grn_id}</pre></td>
                    {/* po_ref mapped from po_reference */}
                    <td><pre>{ele.po_ref}</pre></td>
                    {/* received_date mapped from received_date (fixed typo) */}
                    <td>{ele.received_date}</td>
                    {/* supplier_name mapped from supplier.supplier_name */}
                    <td>{ele.supplier_name}</td>
                    {/* total_items derived from items.length */}
                    <td>{ele.total_items}</td>
                    {/* received_by / qc_done_by are user IDs from API */}
                    <td>{ele.received_by}</td>
                    <td>{ele.qc_done_by}</td>
                    <td>
                      <p
                        className={`stockReceipt-Status ${
                          ele.status === "Draft"
                            ? "stockReceipt-Status-draft"
                            : ele.status === "Submitted"
                            ? "stockReceipt-Status-Submitted"
                            : ele.status === "Cancelled"
                            ? "stockReceipt-Status-Cancelled"
                            : ele.status === "Returned"
                            ? "stockReceipt-Status-Returned"
                            : ""
                        }`}
                      >
                        {ele.status}
                      </p>
                    </td>
                    <td id="stockReceipt-table-action">
                      <nav className="stockReceipt-dot-container">
                        <button
                          onClick={() => { setCurrentPage("stockReceiptForm", ele); }}
                        >
                          {ele.status === "Draft" ? "Edit" : "View"} details
                        </button>
                        <button disabled={ele.status !== "Submitted"}>
                          Generate Stock Return
                        </button>
                        <button
                          onClick={() => handleDeleteClick(ele)}
                          style={{ color: "red" }}
                        >
                          Delete
                        </button>
                      </nav>
                      <svg
                        className="stockReceipt-delete-logo"
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
                  <td colSpan={10} style={{ textAlign: "center" }}>
                    No Data Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <nav className="stockReceipt-table-bottem">
          <p className="stockReceipt-num-entries">
            Showing {filteredData.length} entries
          </p>
          <div className="stockReceipt-manage-control-box">
            <button
              className="stockReceipt-manage-btn"
              onClick={handlePrev}
              disabled={currentPage <= 1}
            >
              Prev
            </button>
            <nav className="stockReceipt-num-page">
              Page {currentPage} of {totalPages}
            </nav>
            <button
              className="stockReceipt-manage-btn"
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