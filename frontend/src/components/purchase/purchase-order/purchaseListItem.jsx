// import React, { useState, useEffect } from "react";
// import "./createNewPurchase.css";
// import PurchaseSearchOption from "./purchaseSearchOption";

// /**
//  * PurchaseListItem — one row in the line items table.
//  *
//  * Props (new API — passed from createNewPurchase):
//  *   unique_key     {number}   row number displayed in # column
//  *   purchaseInput  {object}   parent form state (used for currency symbol)
//  *   purchaseItem   {array}    full product list from API  ← was mock data before
//  *   buttonAcs      {boolean}  true = all inputs disabled
//  *   onLineItemChange(unique_key, updatedRowData)  ← lifted state up so parent
//  *                                                    can compute order summary
//  */
// export default function PurchaseListItem({
//   unique_key,
//   purchaseInput,
//   purchaseItem = [],
//   buttonAcs,
//   onLineItemChange,   // optional — if parent wants to track totals
//   onRemove,           // optional — called with unique_key when delete clicked
// }) {
//   const [uomOptions, setUomOptions] = useState([]);
//   const [productData, setProductData] = useState({
//     product_name:       "",
//     product_id:         "--",
//     uom:                "--",
//     in_stock:           "--",
//     qty_ordered:        "",
//     insufficient_stock: "--",
//     unit_price:         "",
//     tax:                "",
//     discount:           "",
//     total:              "--",
//   });

//   // ── Generic field change handler ─────────────────────────────────────────
//   const handleItemDataChanges = (e) => {
//     setProductData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
//   };

//   // ── Recalculate total whenever any numeric field changes ─────────────────
//   useEffect(() => {
//     const qty   = parseFloat(productData.qty_ordered) || 0;
//     const price = parseFloat(productData.unit_price)  || 0;
//     const tax   = parseFloat(productData.tax)         || 0;
//     const disc  = parseFloat(productData.discount)    || 0;

//     if (qty > 0 && price > 0) {
//       const total = qty * price * (1 + tax / 100) * (1 - disc / 100);
//       const rounded = parseFloat(total.toFixed(2));

//       // Only update if total actually changed (avoids infinite loop)
//       if (rounded !== parseFloat(productData.total)) {
//         setProductData((prev) => ({ ...prev, total: rounded }));
//       }
//     }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [
//     productData.qty_ordered,
//     productData.unit_price,
//     productData.tax,
//     productData.discount,
//   ]);

//   // ── Notify parent whenever row data changes ──────────────────────────────
//   useEffect(() => {
//     if (onLineItemChange) {
//       onLineItemChange(unique_key, productData);
//     }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [productData]);

//   // ── Auto-fill when a product is selected ─────────────────────────────────
//   useEffect(() => {
//     const selected = productData.product_name;

//     if (!selected) {
//       // Reset row
//       setProductData((prev) => ({
//         ...prev,
//         product_id:         "--",
//         uom:                "--",
//         in_stock:           "--",
//         qty_ordered:        "",
//         insufficient_stock: "--",
//         unit_price:         "",
//         tax:                "",
//         discount:           "",
//         total:              "--",
//       }));
//       setUomOptions([]);
//       return;
//     }

//     // Match by product name (the field the search option returns)
//     const product = purchaseItem.find(
//       (p) => (p.name || p.product_name) === selected
//     );

//     if (!product) {
//       setUomOptions([]);
//       return;
//     }

//     // Map API response fields → row state
//     // Fields present in the API response (doc 3):
//     //   product_id, name, uom_detail.name, stock_level,
//     //   unit_price, tax_code_detail.percentage, discount
//     // Fields that might come from old mock data:
//     //   product_name, uom (array), in_stock, qty_ordered,
//     //   insufficient_stock, unit_price, tax, discount, total

//     const uom = product.uom_detail?.name          // API shape
//       || (Array.isArray(product.uom) ? "" : product.uom)  // mock shape fallback
//       || "--";

//     const uomOpts = Array.isArray(product.uom)    // mock had array of UOM options
//       ? product.uom
//       : product.uom_detail?.name
//         ? [product.uom_detail.name]
//         : [];

//     const inStock = product.stock_level !== undefined
//       ? product.stock_level                        // API field
//       : product.in_stock ?? "--";                  // mock field

//     const unitPrice = product.unit_price || product.unit_price || "";
//     const tax       = product.tax_code_detail?.percentage  // API field
//       || product.tax || "";
//     const discount  = product.discount || "";

//     setProductData((prev) => ({
//       ...prev,
//       product_id:         product.product_id || "--",
//       uom,
//       in_stock:           inStock,
//       qty_ordered:        product.qty_ordered || "",
//       insufficient_stock: product.insufficient_stock || "--",
//       unit_price:         unitPrice,
//       tax,
//       discount,
//       // total will be recalculated by the effect above once qty / price are set
//     }));
//     setUomOptions(uomOpts);
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [productData.product_name, purchaseItem]);

//   // ── Insufficient stock — recalculate when qty changes ────────────────────
//   useEffect(() => {
//     const inStock = parseFloat(productData.in_stock) || 0;
//     const ordered = parseFloat(productData.qty_ordered) || 0;
//     if (inStock !== "--" && ordered > 0) {
//       const insufficient = Math.max(0, ordered - inStock);
//       setProductData((prev) => ({
//         ...prev,
//         insufficient_stock: insufficient > 0 ? insufficient : "--",
//       }));
//     }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [productData.qty_ordered, productData.in_stock]);

//   // ── Product name options for the search component ─────────────────────────
//   const productNameOptions = purchaseItem.map((p) => p.name || p.product_name);

//   return (
//     <tr>
//       {/* # */}
//       <td>{unique_key + 1}</td>

//       {/* Product Name — searchable dropdown */}
//       <td>
//         <PurchaseSearchOption
//           value={productData.product_name}
//           onChange={(value) =>
//             setProductData((prev) => ({ ...prev, product_name: value }))
//           }
//           productOptions={productNameOptions}
//           buttonAcs={buttonAcs}
//         />
//       </td>

//       {/* Product ID — auto-filled, read-only */}
//       <td>{productData.product_id}</td>

//       {/* UOM — auto-filled; dropdown if multiple options available */}
//       <td>
//         <select
//           id="uom"
//           value={productData.uom === "--" ? "" : productData.uom}
//           onChange={handleItemDataChanges}
//           disabled={buttonAcs}
//         >
//           <option value="">Select UOM</option>
//           {uomOptions.map((ele, ind) => (
//             <option value={ele} key={ind}>
//               {ele}
//             </option>
//           ))}
//         </select>
//       </td>

//       {/* In Stock — auto-filled, read-only */}
//       <td>{productData.in_stock}</td>

//       {/* Qty Ordered — user input; drives total & insufficient stock */}
//       <td>
//         <input
//           id="qty_ordered"
//           type="number"
//           min="0"
//           value={productData.qty_ordered}
//           onChange={handleItemDataChanges}
//           disabled={buttonAcs}
//         />
//       </td>

//       {/* Insufficient Stock — calculated, read-only */}
//       <td style={{ color: "red" }}>{productData.insufficient_stock}</td>

//       {/* Unit Price — auto-filled from product, allow override */}
//       <td>
//         <input
//           type="number"
//           id="unit_price"
//           min="0"
//           value={productData.unit_price}
//           onChange={handleItemDataChanges}
//           disabled={buttonAcs}
//         />
//       </td>

//       {/* Tax (%) — auto-filled from tax_code_detail.percentage, allow override */}
//       <td>
//         <input
//           type="number"
//           id="tax"
//           min="0"
//           max="100"
//           value={productData.tax}
//           onChange={handleItemDataChanges}
//           disabled={buttonAcs}
//         />
//       </td>

//       {/* Discount (%) — auto-filled from product.discount, allow override */}
//       <td>
//         <input
//           id="discount"
//           type="number"
//           min="0"
//           max="100"
//           value={productData.discount}
//           onChange={handleItemDataChanges}
//           disabled={buttonAcs}
//         />
//       </td>

//       {/* Total — calculated, read-only; currency symbol from parent */}
//       <td>
//         {purchaseInput?.currency === "IND" && <span>₹</span>}
//         {purchaseInput?.currency === "USD" && <span>$</span>}
//         {purchaseInput?.currency === "GBP" && <span>£</span>}
//         {purchaseInput?.currency === "SGD" && <span>S$</span>}
//         {purchaseInput?.currency === "EUR" && <span>€</span>}
//         {productData.total}
//       </td>

//       {/* Action — Delete row */}
//       <td>
//         <svg
//           className={`createNewPurchase-table-delete-logo ${buttonAcs ? "disabled" : ""}`}
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 14 16"
//           onClick={() => {
//             if (!buttonAcs && onRemove) onRemove(unique_key);
//           }}
//           style={{ cursor: buttonAcs ? "not-allowed" : "pointer" }}
//         >
//           <path d="M2.625 16C2.14375 16 1.73192 15.8261 1.3895 15.4782C1.04708 15.1304 0.875583 14.7117 0.875 14.2222V2.66667H0V0.888889H4.375V0H9.625V0.888889H14V2.66667H13.125V14.2222C13.125 14.7111 12.9538 15.1298 12.6114 15.4782C12.269 15.8267 11.8568 16.0006 11.375 16H2.625ZM4.375 12.4444H6.125V4.44444H4.375V12.4444ZM7.875 12.4444H9.625V4.44444H7.875V12.4444Z" />
//         </svg>
//       </td>
//     </tr>
//   );
// }
import React, { useState, useEffect } from "react";
import "./createNewPurchase.css";

export default function PurchaseListItem({
  index,
  rowData,
  purchaseItem = [],
  buttonAcs,
  onProductSelect,
  onFieldChange,
  onRemove,
}) {
  // ── Local search state ────────────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Sync searchTerm with parent rowData product_name
  useEffect(() => {
    setSearchTerm(rowData.product_name || "");
  }, [rowData.product_name]);

  // Filtered product options
  const filteredProducts = purchaseItem.filter((p) =>
    (p.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductSelect = (product) => {
    setSearchTerm(product.name);
    setShowDropdown(false);
    if (onProductSelect) onProductSelect(rowData.id, product.id);
  };

  const handleFieldChange = (field, value) => {
    if (onFieldChange) onFieldChange(rowData.id, field, value);
  };

  // Insufficient stock calculation
  const insufficientStock =
    rowData.in_stock !== "" && rowData.qty_ordered !== ""
      ? Math.max(0, parseFloat(rowData.qty_ordered) - parseFloat(rowData.in_stock))
      : "--";

  return (
    <tr>
      {/* # */}
      <td>{index}</td>

      {/* Product Name — searchable dropdown */}
      <td style={{ position: "relative", minWidth: "160px" }}>
        <input
          type="text"
          value={searchTerm}
          placeholder="Search product..."
          disabled={buttonAcs}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          style={{ width: "100%" }}
        />
        {showDropdown && filteredProducts.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: "6px",
              zIndex: 999,
              maxHeight: "180px",
              overflowY: "auto",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                onMouseDown={() => handleProductSelect(p)}
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  fontSize: "13px",
                  borderBottom: "1px solid #f0f0f0",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#f0f4ff")}
                onMouseLeave={(e) => (e.target.style.background = "#fff")}
              >
                {p.product_id} — {p.name}
              </div>
            ))}
          </div>
        )}
      </td>

      {/* Product ID — auto-filled */}
      <td>{rowData.product_id || "—"}</td>

      {/* UOM — auto-filled */}
      <td>{rowData.uom || "—"}</td>

      {/* In Stock — auto-filled */}
      <td>{rowData.in_stock !== "" ? rowData.in_stock : "—"}</td>

      {/* Qty Ordered */}
      <td>
        <input
          type="number"
          min="0"
          value={rowData.qty_ordered}
          onChange={(e) => handleFieldChange("qty_ordered", e.target.value)}
          disabled={buttonAcs}
          style={{ width: "80px" }}
        />
      </td>

      {/* Insufficient Stock */}
      <td style={{ color: insufficientStock > 0 ? "red" : "inherit" }}>
        {insufficientStock}
      </td>

      {/* Unit Price */}
      <td>
        <input
          type="number"
          min="0"
          value={rowData.unit_price}
          onChange={(e) => handleFieldChange("unit_price", e.target.value)}
          disabled={buttonAcs}
          style={{ width: "90px" }}
        />
      </td>

      {/* Tax (%) */}
      <td>
        <input
          type="number"
          min="0"
          max="100"
          value={rowData.tax}
          onChange={(e) => handleFieldChange("tax", e.target.value)}
          disabled={buttonAcs}
          style={{ width: "70px" }}
        />
      </td>

      {/* Discount (%) */}
      <td>
        <input
          type="number"
          min="0"
          max="100"
          value={rowData.discount}
          onChange={(e) => handleFieldChange("discount", e.target.value)}
          disabled={buttonAcs}
          style={{ width: "70px" }}
        />
      </td>

      {/* Total — calculated by parent */}
      <td>{rowData.total ?? "—"}</td>

      {/* Delete */}
      <td>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 14 16"
          style={{
            width: "16px",
            height: "16px",
            cursor: buttonAcs ? "not-allowed" : "pointer",
            fill: buttonAcs ? "#ccc" : "#e74c3c",
          }}
          onClick={() => {
            if (!buttonAcs && onRemove) onRemove(rowData.id);
          }}
        >
          <path d="M2.625 16C2.14375 16 1.73192 15.8261 1.3895 15.4782C1.04708 15.1304 0.875583 14.7117 0.875 14.2222V2.66667H0V0.888889H4.375V0H9.625V0.888889H14V2.66667H13.125V14.2222C13.125 14.7111 12.9538 15.1298 12.6114 15.4782C12.269 15.8267 11.8568 16.0006 11.375 16H2.625ZM4.375 12.4444H6.125V4.44444H4.375V12.4444ZM7.875 12.4444H9.625V4.44444H7.875V12.4444Z" />
        </svg>
      </td>
    </tr>
  );
}