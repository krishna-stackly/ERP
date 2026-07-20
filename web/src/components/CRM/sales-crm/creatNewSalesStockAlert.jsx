// import React, { useState, useEffect } from "react";
// import "./createNewSales.css";
// import { toast } from "react-toastify";

// export default function creatNewSalesStockAlert({
//   setStockAlert,
//   setSalesStatus,
//   purchase_order,
//   SalesList_data,
//   setCurrentPage,
// }) {
//   const hasZeroStock = SalesList_data.some(
//     ({ stock_level = 0 }) => Number(stock_level) === 0
//   );

//   return (
//     <>
//       <div className="createNewSales-stock-container">
//         <h3>
//           <span>Stock Alert </span>– Insufficient Stock
//         </h3>
//         <p>
//           {hasZeroStock
//             ? "Some products in your sales order still have insufficient stock. A purchase order has already been generated. "
//             : " Some products in your sales order still have insufficient stock. A partially purchase order has already been generated. You can proceed with partial delivery for available items."}
//         </p>
//         <nav>
//           <button
//             className="createNewSales-cancel-btn"
//             onClick={(e) => {
//               e.preventDefault;
//               setStockAlert(false);
//             }}
//           >
//             Cancel
//           </button>
//           <button
//             className={
//               purchase_order === "Purchase Ordered"
//                 ? "createNewSales-completed-btn"
//                 : "createNewSales-active-btn "
//             }
//             disabled={purchase_order === "Purchase Ordered" ? true : false}
//             onClick={() => {
//               setCurrentPage("createNewPurchase");
//             }}
//           >
//             Generate Purchase Order
//           </button>
//           <button
//             className={
//               hasZeroStock
//                 ? "createNewSales-inactive-btn"
//                 : "createNewSales-active-btn"
//             }
//             onClick={(e) => {
//               e.preventDefault;
//               setSalesStatus("Submitted(PD)");
//               toast.success("Sales order has been submitted(PD)");
//               setStockAlert(false);
//             }}
//             disabled={hasZeroStock ? true : false}
//           >
//             Proceed with Partial Delivery
//           </button>
//         </nav>
//       </div>
//     </>
//   );
// }
import React from "react";
import "./createNewSales.css";
import { toast } from "react-toastify";
import salesOrderApiProvider from "../../../network/salesOrder-api-provider";

export default function CreatNewSalesStockAlert({
  setStockAlert,
  setSalesStatus,
  purchase_order,
  SalesList_data,
  setCurrentPage,
  orderId = null,
}) {
  // Items with zero stock — completely unavailable
  const zeroStockItems = SalesList_data.filter(
    ({ stock_level = 0 }) => Number(stock_level) === 0
  );

  // Items with some stock but less than requested quantity
  const partialStockItems = SalesList_data.filter(
    ({ stock_level = 0, quantity = 0 }) =>
      Number(stock_level) > 0 && Number(stock_level) < Number(quantity)
  );

  const hasZeroStock = zeroStockItems.length > 0;

  // =====================================================
  // PROCEED WITH PARTIAL DELIVERY
  // POST /crm/sales-orders/:id/action/ { action: "submit" }
  // The backend will have already responded with insufficient_stock —
  // here we tell it to proceed anyway as Submitted(PD)
  // =====================================================
  const handleProceedPartial = async (e) => {
    e.preventDefault();

    if (orderId) {
      try {
        const result = await salesOrderApiProvider.salesOrderAction(
          orderId,
          "submit",
          { partial: true }
        );
        if (result) {
          setSalesStatus("Submitted(PD)");
          toast.success("Sales order submitted with partial delivery");
          setStockAlert(false);
        }
      } catch (err) {
        console.error("Partial delivery error:", err);
        toast.error("Failed to proceed with partial delivery");
      }
    } else {
      // New order — set status locally, will be sent on save
      setSalesStatus("Submitted(PD)");
      toast.success("Sales order has been submitted (PD)");
      setStockAlert(false);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================
  return (
    <div className="createNewSales-stock-container">
      <h3>
        <span>Stock Alert </span>— Insufficient Stock
      </h3>

      {/* Stock summary */}
      {hasZeroStock && (
        <p>
          The following products have <strong>no stock available</strong> and
          cannot be included in a partial delivery:
        </p>
      )}
      {zeroStockItems.length > 0 && (
        <ul style={{ margin: "6px 0 12px 16px", fontSize: "13px" }}>
          {zeroStockItems.map((item, ind) => (
            <li key={ind}>
              {item.product_name || item.product_id} — stock: 0, requested:{" "}
              {item.quantity}
            </li>
          ))}
        </ul>
      )}

      {partialStockItems.length > 0 && (
        <>
          <p>
            The following products have <strong>partial stock</strong>. You can
            proceed with a partial delivery for available quantities:
          </p>
          <ul style={{ margin: "6px 0 12px 16px", fontSize: "13px" }}>
            {partialStockItems.map((item, ind) => (
              <li key={ind}>
                {item.product_name || item.product_id} — available:{" "}
                {item.stock_level}, requested: {item.quantity}
              </li>
            ))}
          </ul>
        </>
      )}

      <p style={{ fontSize: "13px", color: "#555", marginBottom: "16px" }}>
        {hasZeroStock
          ? "Please generate a Purchase Order to restock before proceeding."
          : "You can proceed with partial delivery for available items, or generate a Purchase Order to fulfil the full quantity."}
      </p>

      <nav>
        {/* CANCEL */}
        <button
          className="createNewSales-cancel-btn"
          onClick={(e) => {
            e.preventDefault();
            setStockAlert(false);
          }}
        >
          Cancel
        </button>

        {/* GENERATE PURCHASE ORDER */}
        <button
          className={
            purchase_order === "Purchase Ordered"
              ? "createNewSales-completed-btn"
              : "createNewSales-active-btn"
          }
          disabled={purchase_order === "Purchase Ordered"}
          onClick={(e) => {
            e.preventDefault();
            setCurrentPage("createNewPurchase");
          }}
        >
          Generate Purchase Order
        </button>

        {/* PROCEED WITH PARTIAL DELIVERY — only enabled if at least some items have stock */}
        <button
          className={
            hasZeroStock
              ? "createNewSales-inactive-btn"
              : "createNewSales-active-btn"
          }
          disabled={hasZeroStock}
          onClick={handleProceedPartial}
        >
          Proceed with Partial Delivery
        </button>
      </nav>
    </div>
  );
}