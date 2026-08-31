// import React, { useState, useEffect } from "react";
// import "./createNewStockReceipt.css";
// import StockSearchOption from "./stockSearchOption";

// export default function StockListItem({
//   unique_key,
//   stockData,
//   stockInput,
//   BtnAccess,
//   setStockDim,
// }) {
//   const [productData, setProductData] = useState({
//     product_name: "",
//     product_id: "",
//     umo: "", // Fixed case
//     qty_ordered: "",
//     qty_received: "",
//     accepted_qty: "",
//     rejected_qty: "",
//     qty_returned: "",
//     stock_dim: "",
//     warehouse: [],
//     selected_warehouse: "",
//   });

//   useEffect(() => {
//     const selected = stockData.find(
//       (order) => order.po_reference_id === stockInput.po_reference_id
//     );

//     if (selected && selected.stock_table_data?.length > unique_key) {
//       const product = selected.stock_table_data[unique_key];
//       setProductData({
//         product_name: product.product_name || "",
//         product_id: product.product_id || "",
//         umo: product.umo || "", // Fixed case
//         qty_ordered: product.qty_ordered || "",
//         qty_received: product.qty_received || "",
//         accepted_qty: product.accepted_qty || "",
//         rejected_qty: product.rejected_qty || "",
//         qty_returned: product.qty_returned || "",
//         stock_dim: product.stock_dim,
//         warehouse: product.warehouse || [],
//         selected_warehouse: "",
//       });
//     }
//   }, [stockInput.po_reference_id, unique_key, stockData]);

//   const handleProductSelect = (selectedProductName) => {
//     const selectedOrder = stockData.find(
//       (order) => order.po_reference_id === stockInput.po_reference_id
//     );

//     if (selectedOrder) {
//       const selectedProduct = selectedOrder.stock_table_data.find(
//         (p) => p.product_name === selectedProductName
//       );

//       if (selectedProduct) {
//         setProductData((prev) => ({
//           ...prev,
//           product_name: selectedProduct.product_name,
//           product_id: selectedProduct.product_id,
//           umo: selectedProduct.umo,
//           qty_ordered: selectedProduct.qty_ordered,
//           qty_received: selectedProduct.qty_received,
//           accepted_qty: selectedProduct.accepted_qty,
//           rejected_qty: selectedProduct.rejected_qty,
//           qty_returned: selectedProduct.qty_returned,
//           stock_dim: selectedProduct.stock_dim,
//           warehouse: selectedProduct.warehouse || [],
//           selected_warehouse: "",
//         }));
//       }
//     }
//   };

//   return (
//     <tr key={unique_key}>
//       <td>{unique_key + 1}</td>
//       <td>
//         <StockSearchOption
//           value={productData.product_name}
//           onChange={handleProductSelect}
//           productOptions={
//             stockData
//               .find(
//                 (order) => order.po_reference_id === stockInput.po_reference_id
//               )
//               ?.stock_table_data.map((p) => p.product_name) || []
//           }
//           BtnAccess={BtnAccess}
//         />
//       </td>
//       <td>
//         <p
//           className={
//             productData.stock_dim ? "cerateNewStock-stockDim-blue" : ""
//           }
//           onClick={() => {
//             setStockDim({
//               serialBox: productData.stock_dim === "Serial",
//               batchBox: productData.stock_dim === "Batch",
//               activeRow:
//                 productData.stock_dim === "Serial" ||
//                 productData.stock_dim === "Batch"
//                   ? unique_key
//                   : null,
//               activeProduct:
//                 productData.stock_dim === "Serial" ||
//                 productData.stock_dim === "Batch"
//                   ? productData
//                   : null,
//             });
//           }}
//         >
//           {productData.product_id}
//         </p>
//       </td>
//       <td>{productData.umo}</td>
//       <td>{productData.qty_ordered}</td>
//       <td>
//         <input
//           type="number"
//           min="0"
//           max={productData.qty_ordered}
//           value={productData.qty_received}
//           onChange={(e) => {
//             const received = parseInt(e.target.value) || 0;
//             const accepted = parseInt(productData.accepted_qty) || 0;
//             setProductData((prev) => ({
//               ...prev,
//               qty_received: received,
//               rejected_qty: Math.max(0, received - accepted),
//             }));
//           }}
//           required
//           disabled={BtnAccess}
//         />
//       </td>
//       <td>
//         <input
//           type="number"
//           min="0"
//           max={productData.qty_received}
//           value={productData.accepted_qty}
//           onChange={(e) => {
//             const accepted = parseInt(e.target.value) || 0;
//             const received = parseInt(productData.qty_received) || 0;
//             setProductData((prev) => ({
//               ...prev,
//               accepted_qty: accepted,
//               rejected_qty: Math.max(0, received - accepted),
//             }));
//           }}
//           required
//           disabled={BtnAccess}
//         />
//       </td>
//       <td>{productData.rejected_qty}</td>
//       <td>{productData.qty_returned}</td>
//       <td>
//         <select
//           id="stock_dim"
//           value={productData.stock_dim}
//           onChange={(e) => {
//             e.preventDefault();
//             setProductData((prev) => {
//               return { ...prev, [e.target.id]: e.target.value };
//             });
//           }}
//           required
//           disabled={BtnAccess}
//         >
//           <option value="">None</option>
//           <option value="Serial">Serial</option>
//           <option value="Batch">Batch</option>
//         </select>
//       </td>
//       <td>
//         <select
//           value={productData.selected_warehouse}
//           onChange={(e) =>
//             setProductData((prev) => ({
//               ...prev,
//               selected_warehouse: e.target.value,
//             }))
//           }
//           required
//           disabled={BtnAccess}
//         >
//           <option value="">None</option>
//           {productData.warehouse?.map((ele, ind) => (
//             <option value={ele} key={ind}>
//               {ele}
//             </option>
//           ))}
//         </select>
//       </td>
//       <td>
//         <svg
//           //   onClick={() => onDelete(unique_key)}
//           className={`cerateNewStock-table-delete-logo ${
//             BtnAccess ? "disabled" : ""
//           }`}
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 14 16"
//         >
//           <path d="M2.625 16C2.14375 16 1.73192 15.8261 1.3895 15.4782C1.04708 15.1304 0.875583 14.7117 0.875 14.2222V2.66667H0V0.888889H4.375V0H9.625V0.888889H14V2.66667H13.125V14.2222C13.125 14.7111 12.9538 15.1298 12.6114 15.4782C12.269 15.8267 11.8568 16.0006 11.375 16H2.625ZM4.375 12.4444H6.125V4.44444H4.375V12.4444ZM7.875 12.4444H9.625V4.44444H7.875V12.4444Z" />
//         </svg>
//       </td>
//     </tr>
//   );
// }
import React from "react";
import "./createNewStockReceipt.css";

export default function StockListItem({
  index,
  rowData,        // { id, product_name, product_id, uom, qty_ordered, qty_received,
                  //    accepted_qty, rejected_qty, qty_returned, stock_dim,
                  //    warehouse, selected_warehouse, unit_price, tax_rate, discount_rate,
                  //    serials, batches }
  BtnAccess,
  onFieldChange,  // (rowId, field, value) → update line item in parent
  onOpenDim,      // (dimType: "Serial" | "Batch") → open serial/batch modal
}) {
  const row = rowData;

  // ── Computed total for this row ──────────────────────────────────────────
  const qty   = parseFloat(row.qty_received)  || 0;
  const price = parseFloat(row.unit_price)    || 0;
  const tax   = parseFloat(row.tax_rate)      || 0;
  const disc  = parseFloat(row.discount_rate) || 0;
  const total = parseFloat(
    (qty * price * (1 + tax / 100) * (1 - disc / 100)).toFixed(2)
  );

  // ── Serial/batch badge label ─────────────────────────────────────────────
  const dimCount =
    row.stock_dim === "Serial"
      ? row.serials?.length || 0
      : row.stock_dim === "Batch"
      ? row.batches?.length || 0
      : 0;

  return (
    <tr>
      <td>{index}</td>

      {/* Product Name */}
      <td><pre>{row.product_name || "—"}</pre></td>

      {/* Product ID — clickable if stock_dim is Serial/Batch to open modal */}
      <td>
        <p
          className={
            row.stock_dim && row.stock_dim !== "None"
              ? "cerateNewStock-stockDim-blue"
              : ""
          }
          style={{
            cursor: row.stock_dim && row.stock_dim !== "None" ? "pointer" : "default",
          }}
          onClick={() => {
            if (row.stock_dim && row.stock_dim !== "None") {
              onOpenDim(row.stock_dim);
            }
          }}
          title={
            dimCount > 0
              ? `${dimCount} ${row.stock_dim} number(s) added — click to edit`
              : row.stock_dim !== "None"
              ? `Click to add ${row.stock_dim} numbers`
              : ""
          }
        >
          {row.product_id || "—"}
          {dimCount > 0 && (
            <span
              style={{
                marginLeft: "4px",
                background: "#234E70",
                color: "#fff",
                borderRadius: "10px",
                padding: "1px 6px",
                fontSize: "11px",
              }}
            >
              {dimCount}
            </span>
          )}
        </p>
      </td>

      {/* UOM */}
      <td>{row.uom || "—"}</td>

      {/* Qty Ordered — read only */}
      <td>{row.qty_ordered}</td>

      {/* Qty Received — editable */}
      <td>
        <input
          type="number"
          min="0"
          max={row.qty_ordered}
          value={row.qty_received}
          onChange={(e) => onFieldChange(row.id, "qty_received", parseFloat(e.target.value) || 0)}
          disabled={BtnAccess}
        />
      </td>

      {/* Accepted Qty — editable */}
      <td>
        <input
          type="number"
          min="0"
          max={row.qty_received}
          value={row.accepted_qty}
          onChange={(e) => onFieldChange(row.id, "accepted_qty", parseFloat(e.target.value) || 0)}
          disabled={BtnAccess}
        />
      </td>

      {/* Rejected Qty — auto computed */}
      <td style={{ color: row.rejected_qty > 0 ? "#e53e3e" : "inherit" }}>
        {row.rejected_qty}
      </td>

      {/* Qty Returned — editable */}
      <td>
        <input
          type="number"
          min="0"
          max={row.rejected_qty}
          value={row.qty_returned}
          onChange={(e) => onFieldChange(row.id, "qty_returned", parseFloat(e.target.value) || 0)}
          disabled={BtnAccess}
          style={{ color: row.qty_returned > 0 ? "#e53e3e" : "inherit" }}
        />
      </td>

      {/* Stock Dim — dropdown, triggers modal on Serial/Batch */}
      <td>
        <select
          value={row.stock_dim || "None"}
          onChange={(e) => {
            const val = e.target.value;
            onFieldChange(row.id, "stock_dim", val);
            if (val === "Serial" || val === "Batch") {
              onOpenDim(val);
            }
          }}
          disabled={BtnAccess}
        >
          <option value="None">None</option>
          <option value="Serial">Serial</option>
          <option value="Batch">Batch</option>
        </select>
      </td>

      {/* Warehouse */}
      <td>
        <select
          value={row.selected_warehouse}
          onChange={(e) => onFieldChange(row.id, "selected_warehouse", e.target.value)}
          disabled={BtnAccess}
        >
          <option value="">Select</option>
          {(row.warehouse || []).map((w, i) => (
            <option key={i} value={w}>{w}</option>
          ))}
        </select>
      </td>

      {/* Unit Price — editable */}
      <td>
        <input
          type="number"
          min="0"
          value={row.unit_price}
          onChange={(e) => onFieldChange(row.id, "unit_price", parseFloat(e.target.value) || 0)}
          disabled={BtnAccess}
        />
      </td>

      {/* Tax (%) — editable */}
      <td>
        <input
          type="number"
          min="0"
          max="100"
          value={row.tax_rate}
          onChange={(e) => onFieldChange(row.id, "tax_rate", parseFloat(e.target.value) || 0)}
          disabled={BtnAccess}
        />
      </td>

      {/* Discount (%) — editable */}
      <td>
        <input
          type="number"
          min="0"
          max="100"
          value={row.discount_rate}
          onChange={(e) => onFieldChange(row.id, "discount_rate", parseFloat(e.target.value) || 0)}
          disabled={BtnAccess}
        />
      </td>

      {/* Total — computed */}
      <td>{total.toFixed(2)}</td>

      {/* Action */}
      <td>
        <svg
          className={`cerateNewStock-table-delete-logo ${BtnAccess ? "disabled" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 14 16"
          style={{ cursor: BtnAccess ? "default" : "pointer", opacity: BtnAccess ? 0.4 : 1 }}
        >
          <path d="M2.625 16C2.14375 16 1.73192 15.8261 1.3895 15.4782C1.04708 15.1304 0.875583 14.7117 0.875 14.2222V2.66667H0V0.888889H4.375V0H9.625V0.888889H14V2.66667H13.125V14.2222C13.125 14.7111 12.9538 15.1298 12.6114 15.4782C12.269 15.8267 11.8568 16.0006 11.375 16H2.625ZM4.375 12.4444H6.125V4.44444H4.375V12.4444ZM7.875 12.4444H9.625V4.44444H7.875V12.4444Z" />
        </svg>
      </td>
    </tr>
  );
}