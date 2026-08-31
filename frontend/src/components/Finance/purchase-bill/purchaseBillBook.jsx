import React, { useState, useEffect } from "react";
import "./purchaseBillBook.css";

export default function PurchaseBillBook({ setCurrentPage }) {
  const [purchaseBillCurrentPage, setpurchaseBillCurrentPage] = useState(1);
  const purchaseBillPerPage = 10;
  const [ApiPurchaseBillBook, setApiPurchaseBillBook] = useState({});
  const [purchaseBillData, setpurchaseBillData] = useState([]);

  const purchaseBillFromApi = {
    purchaseBillData: [
      {
        dn_id: "DN-0001",
        sales_order_ref: "SO-0001",
        customer_name: "Mandy",
        purchaseBill_type: "Regular", 
        purchaseBill_date: "28-05-2025",
        status: "Draft",
      },
      {
        dn_id: "DN-0002",
        sales_order_ref: "SO-0002",
        customer_name: "Sans",
        purchaseBill_type: "Regular",
        purchaseBill_date: "28-05-2025",
        status: "Partially Delivered",
      },
      {
        dn_id: "DN-0003",
        sales_order_ref: "SO-0002",
        customer_name: "Jon",
        purchaseBill_type: "Regular",
        purchaseBill_date: "28-05-2025",
        status: "Delivered",
      },
      {
        dn_id: "DN-0004",
        sales_order_ref: "SO-0002",
        customer_name: "Wick",
        purchaseBill_type: "Regular",
        purchaseBill_date: "28-05-2025",
        status: "Partially Delivered",
      },
      {
        dn_id: "DN-0005",
        sales_order_ref: "SO-0005",
        customer_name: "Mandy",
        purchaseBill_type: "Regular",
        purchaseBill_date: "28-05-2025",
        status: "Delivered",
      },
      {
        dn_id: "DN-0006",
        sales_order_ref: "SO-0006",
        customer_name: "Kamal",
        purchaseBill_type: "Regular",
        purchaseBill_date: "28-05-2025",
        status: "Draft",
      },
      {
        dn_id: "DN-0007",
        sales_order_ref: "SO-0007",
        customer_name: "Rahul",
        purchaseBill_type: "Regular",
        purchaseBill_date: "28-05-2025",
        status: "Returned",
      },
      {
        dn_id: "DN-0008",
        sales_order_ref: "SO-0008",
        customer_name: "Dhoni",
        purchaseBill_type: "Regular",
        purchaseBill_date: "28-05-2025",
        status: "Cancelled",
      },
    ],
  };

  const [filter, setFilter] = useState({
    purchaseBill_status: "",
    purchaseBill_type: "",
    purchaseBill_from_date: "",
    purchaseBill_to_date: "",
  });

  const [buttonAct, setButtonAct] = useState({
    checkbox: {},
    purchaseBill_return: true,
    invoice: true,
  });

  useEffect(() => {
    setApiPurchaseBillBook(purchaseBillFromApi);
  }, []);
  useEffect(() => {
    if (Object.keys(ApiPurchaseBillBook).length > 0) {
      setpurchaseBillData(ApiPurchaseBillBook.purchaseBillData);
    }
  }, [ApiPurchaseBillBook]);

  useEffect(() => {
    const selectedOrders = purchaseBillData.filter(
      (order) => buttonAct.checkbox[order.dn_id]
    );
    const hasMultiple = selectedOrders.length > 1;
    //valid DN_ID
    const firstDN_ID = selectedOrders[0]?.sales_order_ref;
    const sameDN_ID =
      hasMultiple &&
      selectedOrders.every((order) => order.sales_order_ref === firstDN_ID);

    //purchaseBill return and invoice valid states
    const validStatus =
      hasMultiple &&
      selectedOrders.every(
        (order) =>
          order.status === "Partially Delivered" ||
          order.status === "Delivered" ||
          order.status === "Returned"
      );
    setButtonAct((prev) => ({
      ...prev,
      purchaseBill_return: selectedOrders.length > 0 && validStatus && sameDN_ID,
      invoice: selectedOrders.length > 0 && validStatus && sameDN_ID,
    }));
  }, [buttonAct.checkbox, purchaseBillData]);

  // checkbox
  const handlecheckbox = (e, ele) => {
    const { id, checked } = e.target;
    setButtonAct((prev) => ({
      checkbox: {
        ...prev.checkbox,
        [ele.dn_id]: checked,
      },
    }));
  };
  //page calculation
  const totalPages = Math.ceil(purchaseBillData.length / purchaseBillPerPage);

  const currentData = purchaseBillData.slice(
    (purchaseBillCurrentPage - 1) * purchaseBillPerPage,
    purchaseBillCurrentPage * purchaseBillPerPage
  );

  const handleNext = () => {
    if (purchaseBillCurrentPage < totalPages) {
      setpurchaseBillCurrentPage((prev) => prev + 1);
    }
  };
  const handlePrev = () => {
    if (purchaseBillCurrentPage > 1) {
      setpurchaseBillCurrentPage((prev) => prev - 1);
    }
  };
  const handleClearFilter = () => {
    setFilter({
      purchaseBill_status: "",
      purchaseBill_type: "",
      purchaseBill_from_date: "",
      purchaseBill_to_date: "",
    });
  };
  console.log(buttonAct.checkbox);

  return (
    <>
      <div className="purchaseBillCRM-container">
        <div className="purchaseBillCRM-header">
          <p>purchaseBill Note Return List</p>
          <button
            onClick={() => {
              setCurrentPage("createNewpurchaseBillReturn");
            }}
          >
            + New purchaseBill Note Return
          </button>
        </div>
        <div className="purchaseBillCRM-search-box">
          <label htmlFor="searchByID">
            <svg
              className="purchaseBillCRM-search-logo"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
            </svg>
          </label>
          <input
            id="searchByID"
            placeholder="Search by DNR number, Customer name,Customer ID..."
          />
        </div>
        <div className="purchaseBillCRM-clearfilter">
          <p onClick={handleClearFilter}>Clear Filter</p>
        </div>
        <div className="purchaseBillCRM-search-category">
          <div className="purchaseBillCRM-input-box">
            <label htmlFor="purchaseBill_status">DNR Status</label>
            <select
              value={filter.purchaseBill_status}
              onChange={(e) => {
                setFilter((prev) => ({
                  ...prev,
                  purchaseBill_status: e.target.value,
                }));
              }}
              id="purchaseBill_status"
            >
              <option value="">All</option>
              <option value="Draft">Draft</option>
              <option value="Pending">Pending</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
              <option value="Partially Delivered">Partially Delivered</option>
              <option value="Returned">Returned</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="purchaseBillCRM-input-box">
            <label htmlFor="purchaseBill_type">purchaseBill Type</label>
            <select
              value={filter.purchaseBill_type}
              onChange={(e) => {
                setFilter((prev) => ({
                  ...prev,
                  purchaseBill_type: e.target.value,
                }));
              }}
              id="purchaseBill_type"
            >
              <option value="">All Types</option>
              <option value="Regular">Regular</option>
              <option value="Urgent">Urgent</option>
              <option value="Return">Return</option>
            </select>
          </div>
          <div className="purchaseBillCRM-input-box">
            <label htmlFor="purchaseBill_date">purchaseBill Date</label>
            <nav id="deldvery_date">
              <div>
                <span>From </span>
                <input
                  value={filter.purchaseBill_from_date}
                  onChange={(e) => {
                    setFilter((prev) => ({
                      ...prev,
                      purchaseBill_from_date: e.target.value,
                    }));
                  }}
                  className="purchaseBillCRM-date"
                  type="date"
                />
              </div>
              <div>
                <span>to </span>
                <input
                  value={filter.purchaseBill_to_date}
                  onChange={(e) => {
                    setFilter((prev) => ({
                      ...prev,
                      purchaseBill_to_date: e.target.value,
                    }));
                  }}
                  className="purchaseBillCRM-date"
                  type="date"
                />
              </div>
            </nav>
          </div>
        </div>
        <div className="purchaseBillCRM-table-cointainer">
          <table>
            <thead className="purchaseBillCRM-table-head">
              <tr>
                <th></th>
                <th>DNR ID</th>
                <th className="purchaseBillCRM-maxhead-width">Invoice Return Ref.</th>
                <th className="purchaseBillCRM-maxhead-width">Customer Name</th>
                <th className="purchaseBillCRM-minhead-width">DNR Date</th>
                <th>
                  <div className="purchaseBillCRM-status-filter">
                    Status
                    <nav className="purchaseBillCRM-filter-box">
                      <p>Newest First</p>
                      <p>Oldest First</p>
                      <p>Progressing {`(Draft → Cancelled)`}</p>
                      <p>Reverse Progressing{`(Cancelled → Draft)`} </p>
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="purchaseBillCRM-table-body">
              {currentData.length > 0 ? (
                currentData.map((ele, ind) => (
                  <tr key={ind}>
                    <td>
                      <input
                        className="purchaseBillCRM-table-check"
                        type="checkbox"
                        onChange={(e) => handlecheckbox(e, ele)}
                        checked={!!buttonAct.checkbox[ele.dn_id]}
                      />
                    </td>
                    <td className="purchaseBillCRM-minbody-width">{ele.dn_id}</td>
                    <td>{ele.sales_order_ref}</td>
                    <td>{ele.customer_name}</td>
                    <td>{ele.purchaseBill_date}</td>
                    <td>
                      <p
                        className={`purchaseBillCRM-Status ${
                          ele.status === "Draft"
                            ? "purchaseBillCRM-Status-draft"
                            : ele.status === "Delivered"
                            ? "purchaseBillCRM-Status-Delivered"
                            : ele.status === "Cancelled"
                            ? "purchaseBillCRM-Status-Cancelled"
                            : ele.status === "Partially Delivered"
                            ? "purchaseBillCRM-Status-partiallyDelivered"
                            : ele.status === "Returned"
                            ? "purchaseBillCRM-Status-Returned"
                            : ""
                        }`}
                      >
                        {ele.status}
                      </p>
                    </td>
                    <td id="purchaseBillCRM-table-action">
                      <nav className="purchaseBillCRM-dot-container">
                        <button
                          disabled={ele.status !== "" ? false : true}
                          onClick={() => {
                            setCurrentPage("editpurchaseBill");
                          }}
                        >
                          {ele.status === "Draft" ? "Edit" : "View"} details
                        </button>
                        <button
                          disabled={
                            ele.status === "Partially Delivered" ||
                            ele.status === "Delivered" ||
                            ele.status === "Returned"
                              ? false
                              : true
                          }
                        >
                          Generate purchaseBill Return
                        </button>
                        <button
                          disabled={
                            ele.status === "Partially Delivered" ||
                            ele.status === "Delivered" ||
                            ele.status === "Returned"
                              ? false
                              : true
                          }
                        >
                          Generate Invoice
                        </button>
                      </nav>
                      <svg
                        className="purchaseBillCRM-delete-logo"
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
                  <td>No Data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <nav className="purchaseBillCRM-table-bottem">
          <p className="purchaseBillCRM-num-entries">
            Showing {currentData.length} entries
          </p>
          <div className="purchaseBillCRM-manage-control-box">
            <button
              className="purchaseBillCRM-manage-btn"
              onClick={handlePrev}
              disabled={purchaseBillCurrentPage === 1}
            >
              Prev
            </button>
            <nav className="purchaseBillCRM-num-page">
              {" "}
              Page {purchaseBillCurrentPage} of {totalPages}{" "}
            </nav>
            <button
              className="purchaseBillCRM-manage-btn"
              onClick={handleNext}
              disabled={purchaseBillCurrentPage === totalPages}
            >
              Next
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
