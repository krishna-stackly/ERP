// // // // // import React, { useEffect, useState } from "react";
// // // // // import CreateNewSalesSearchOption from "./createNewSalesSearchOption";

// // // // // export default function SalesListItems({
// // // // //   unique_key,
// // // // //   sales_table_data,
// // // // //   setSalesList_data,
// // // // //   deleteSalesProduct,
// // // // //   productTotal,
// // // // //   salesData,
// // // // //   btnAccess,
// // // // // }) {
// // // // //   const [uomOptions, setuomOptions] = useState([]);
// // // // //   const [taxOptions, settaxOptions] = useState([]);
// // // // //   const [product_details, setproduct_details] = useState({
// // // // //     unique_key: unique_key,
// // // // //     product_id: "--",
// // // // //     product_name: "",
// // // // //     stock_level: "--",
// // // // //     uom: "--",
// // // // //     unit_price: 0,
// // // // //     discount: 0,
// // // // //     tax: "--",
// // // // //     quantity: 0,
// // // // //   });
// // // // //   useEffect(() => {
// // // // //     setSalesList_data((prev) => {
// // // // //       return prev.map((ele) => {
// // // // //         if (ele.unique_key === unique_key) {
// // // // //           return product_details;
// // // // //         }
// // // // //         return ele;
// // // // //       });
// // // // //     });
// // // // //   }, [product_details]);

// // // // //   // Update product details on name selection
// // // // //   useEffect(() => {
// // // // //     const selected = product_details.product_name;
// // // // //     if (!selected) {
// // // // //       setproduct_details((prev) => ({
// // // // //         ...prev,
// // // // //         product_id: "",
// // // // //         stock_level: "",
// // // // //         uom: "--",
// // // // //         unit_price: 0,
// // // // //         discount: "--",
// // // // //         tax: 0,
// // // // //         quantity: 0,
// // // // //       }));
// // // // //       setuomOptions([]);
// // // // //       settaxOptions([]);
// // // // //       return;
// // // // //     }

// // // // //     const product = sales_table_data.find(
// // // // //       (ele) => ele.product_name === selected
// // // // //     );

// // // // //     if (product) {
// // // // //       setproduct_details((prev) => ({
// // // // //         ...prev,
// // // // //         product_id: product.product_id,
// // // // //         stock_level: product.stock_level,
// // // // //         uom: product.uom,
// // // // //         unit_price: product.unit_price,
// // // // //         discount: product.discount,
// // // // //         tax: product.tax,
// // // // //         quantity: product.quantity,
// // // // //       }));
// // // // //       setuomOptions(product.uom || []);
// // // // //       settaxOptions(product.tax || []);
// // // // //     } else {
// // // // //       setuomOptions([]);
// // // // //       settaxOptions([]);
// // // // //     }
// // // // //   }, [product_details.product_name, sales_table_data]);

// // // // //   return (
// // // // //     <tr>
// // // // //       <td>{unique_key + 1}</td>

// // // // //       <td style={{ position: "relative", minWidth: "200px" }}>
// // // // //         <CreateNewSalesSearchOption
// // // // //           value={product_details.product_name}
// // // // //           onChange={(value) =>
// // // // //             setproduct_details((prev) => ({
// // // // //               ...prev,
// // // // //               product_name: value,
// // // // //             }))
// // // // //           }
// // // // //           productOptions={sales_table_data.map((p) => p.product_name)}
// // // // //           btnAccess={btnAccess}
// // // // //         />
// // // // //       </td>

// // // // //       <td>{product_details.product_id}</td>
// // // // //       <td>{product_details.stock_level}</td>

// // // // //       <td>
// // // // //         <input
// // // // //           type="number"
// // // // //           value={product_details.quantity}
// // // // //           onChange={(e) => {
// // // // //             setproduct_details((prev) => {
// // // // //               return { ...prev, quantity: e.target.value };
// // // // //             });
// // // // //           }}
// // // // //           required
// // // // //           disabled={btnAccess}
// // // // //         />
// // // // //       </td>
// // // // //       <td>
// // // // //         <select
// // // // //           value={product_details.uom}
// // // // //           onChange={(e) => {
// // // // //             setproduct_details((prev) => {
// // // // //               return { ...prev, uom: e.target.value };
// // // // //             });
// // // // //           }}
// // // // //           required
// // // // //           disabled={btnAccess}
// // // // //         >
// // // // //           <option value="">Select UOM</option>
// // // // //           {uomOptions.map((ele, ind) => (
// // // // //             <option key={ind} value={ele}>
// // // // //               {ele}
// // // // //             </option>
// // // // //           ))}
// // // // //         </select>
// // // // //       </td>
// // // // //       <td>
// // // // //         <input
// // // // //           type="number"
// // // // //           onChange={(e) => {
// // // // //             setproduct_details((prev) => {
// // // // //               return { ...prev, unit_price: e.target.value };
// // // // //             });
// // // // //           }}
// // // // //           value={product_details.unit_price}
// // // // //           required
// // // // //           disabled={btnAccess}
// // // // //         />
// // // // //       </td>
// // // // //       <td>
// // // // //         <select
// // // // //           value={product_details.tax}
// // // // //           onChange={(e) => {
// // // // //             setproduct_details((prev) => {
// // // // //               return { ...prev, tax: e.target.value };
// // // // //             });
// // // // //           }}
// // // // //           required
// // // // //           disabled={btnAccess}
// // // // //         >
// // // // //           <option value="">Select Tax</option>

// // // // //           {taxOptions.map((ele, ind) => (
// // // // //             <option key={ind} value={ele}>
// // // // //               {ele}
// // // // //             </option>
// // // // //           ))}
// // // // //         </select>
// // // // //       </td>
// // // // //       <td>
// // // // //         <input
// // // // //           type="number"
// // // // //           value={product_details.discount}
// // // // //           onChange={(e) => {
// // // // //             setproduct_details((prev) => {
// // // // //               return { ...prev, discount: e.target.value };
// // // // //             });
// // // // //           }}
// // // // //           required
// // // // //           disabled={btnAccess}
// // // // //         />
// // // // //       </td>
// // // // //       <td>
// // // // //         {salesData.currency === "IND" && <span>₹</span>}
// // // // //         {salesData.currency === "USD" && <span>$</span>}
// // // // //         {salesData.currency === "GBP" && <span>£</span>}
// // // // //         {salesData.currency === "SGD" && <span>S$</span>}
// // // // //         {salesData.currency === "EUR" && <span>€</span>}
// // // // //         {productTotal(unique_key)}
// // // // //       </td>
// // // // //       <td id="createNewSales-table-content-center">
// // // // //         <svg
// // // // //           onClick={() => deleteSalesProduct(unique_key)}
// // // // //           className={`createNewSales-table-delete-logo ${
// // // // //             btnAccess ? "disabled" : ""
// // // // //           }`}
// // // // //           xmlns="http://www.w3.org/2000/svg"
// // // // //           viewBox="0 0 14 16"
// // // // //         >
// // // // //           <path d="M2.625 16C2.14375 16 1.73192 15.8261 1.3895 15.4782C1.04708 15.1304 0.875583 14.7117 0.875 14.2222V2.66667H0V0.888889H4.375V0H9.625V0.888889H14V2.66667H13.125V14.2222C13.125 14.7111 12.9538 15.1298 12.6114 15.4782C12.269 15.8267 11.8568 16.0006 11.375 16H2.625ZM4.375 12.4444H6.125V4.44444H4.375V12.4444ZM7.875 12.4444H9.625V4.44444H7.875V12.4444Z" />
// // // // //         </svg>
// // // // //       </td>
// // // // //     </tr>
// // // // //   );
// // // // // }
// // // // import React, { useEffect, useState } from "react";
// // // // import CreateNewSalesSearchOption from "./createNewSalesSearchOption";

// // // // export default function SalesListItems({
// // // //   unique_key,
// // // //   sales_table_data,
// // // //   setSalesList_data,
// // // //   deleteSalesProduct,
// // // //   productTotal,
// // // //   salesData,
// // // //   btnAccess,
// // // // }) {
// // // //   const [uomOptions, setuomOptions] = useState([]);
// // // //   const [taxOptions, settaxOptions] = useState([]);

// // // //   const [product_details, setproduct_details] = useState({
// // // //     unique_key: unique_key,
// // // //     product_id: "",        // ✅ FIX: was "--", must be "" so filter(i => i.product_id) works
// // // //     product_name: "",
// // // //     stock_level: 0,        // ✅ FIX: was "--", must be 0 (number) for stock check
// // // //     uom: "",
// // // //     uom_id: "",
// // // //     unit_price: 0,
// // // //     discount: 0,
// // // //     tax: "",
// // // //     tax_id: "",
// // // //     quantity: 0,
// // // //   });

// // // //   // =====================================================
// // // //   // SYNC LOCAL STATE → PARENT SalesList_data
// // // //   // =====================================================
// // // //   useEffect(() => {
// // // //     setSalesList_data((prev) =>
// // // //       prev.map((ele) =>
// // // //         ele.unique_key === unique_key ? product_details : ele
// // // //       )
// // // //     );
// // // //   }, [product_details]);

// // // //   // =====================================================
// // // //   // WHEN PRODUCT NAME CHANGES → FILL ALL FIELDS
// // // //   // =====================================================
// // // //   useEffect(() => {
// // // //     const selected = product_details.product_name;

// // // //     if (!selected) {
// // // //       setproduct_details((prev) => ({
// // // //         ...prev,
// // // //         product_id: "",        // ✅ empty string so filter catches it
// // // //         stock_level: 0,        // ✅ number 0
// // // //         uom: "",
// // // //         uom_id: "",
// // // //         unit_price: 0,
// // // //         discount: 0,
// // // //         tax: "",
// // // //         tax_id: "",
// // // //         quantity: 0,
// // // //       }));
// // // //       setuomOptions([]);
// // // //       settaxOptions([]);
// // // //       return;
// // // //     }

// // // //     const product = sales_table_data.find(
// // // //       (ele) => ele.product_name === selected
// // // //     );

// // // //     if (product) {
// // // //       // ✅ FIX: store stock_level as a real NUMBER so stock check works
// // // //       // ✅ FIX: store product_id (not product.id) — adjust key to match your API response
// // // //       const resolvedProductId =
// // // //         product.product_id || product.id || "";

// // // //       const resolvedStockLevel =
// // // //         Number(product.stock_level ?? product.stock ?? 0);

// // // //       const uomList = Array.isArray(product.uom)
// // // //         ? product.uom
// // // //         : product.uom
// // // //         ? [product.uom]
// // // //         : [];

// // // //       const taxList = Array.isArray(product.tax)
// // // //         ? product.tax
// // // //         : product.tax
// // // //         ? [product.tax]
// // // //         : [];

// // // //       setproduct_details((prev) => ({
// // // //         ...prev,
// // // //         product_id: resolvedProductId,
// // // //         stock_level: resolvedStockLevel,   // ✅ number
// // // //         uom: uomList[0] || "",
// // // //         uom_id: product.uom_id || uomList[0] || "",
// // // //         unit_price: product.unit_price || 0,
// // // //         discount: product.discount || 0,
// // // //         tax: taxList[0] || "",
// // // //         tax_id: product.tax_id || taxList[0] || "",
// // // //         quantity: 0,                        // reset qty on product change
// // // //       }));

// // // //       setuomOptions(uomList);
// // // //       settaxOptions(taxList);
// // // //     } else {
// // // //       setuomOptions([]);
// // // //       settaxOptions([]);
// // // //     }
// // // //   }, [product_details.product_name, sales_table_data]);

// // // //   // =====================================================
// // // //   // RENDER
// // // //   // =====================================================
// // // //   return (
// // // //     <tr>
// // // //       <td>{unique_key + 1}</td>

// // // //       <td style={{ position: "relative", minWidth: "200px" }}>
// // // //         <CreateNewSalesSearchOption
// // // //           value={product_details.product_name}
// // // //           onChange={(value) =>
// // // //             setproduct_details((prev) => ({ ...prev, product_name: value }))
// // // //           }
// // // //           productOptions={sales_table_data.map((p) => p.product_name)}
// // // //           btnAccess={btnAccess}
// // // //         />
// // // //       </td>

// // // //       {/* Product ID display */}
// // // //       <td>{product_details.product_id || "--"}</td>

// // // //       {/* In Stock display */}
// // // //       <td>{product_details.stock_level !== 0 ? product_details.stock_level : "--"}</td>

// // // //       {/* Quantity */}
// // // //       <td>
// // // //         <input
// // // //           type="number"
// // // //           min={0}
// // // //           value={product_details.quantity}
// // // //           onChange={(e) =>
// // // //             setproduct_details((prev) => ({
// // // //               ...prev,
// // // //               quantity: e.target.value,
// // // //             }))
// // // //           }
// // // //           required
// // // //           disabled={btnAccess}
// // // //         />
// // // //       </td>

// // // //       {/* UOM */}
// // // //       <td>
// // // //         <select
// // // //           value={product_details.uom}
// // // //           onChange={(e) =>
// // // //             setproduct_details((prev) => ({
// // // //               ...prev,
// // // //               uom: e.target.value,
// // // //               uom_id: e.target.value,   // ✅ keep uom_id in sync
// // // //             }))
// // // //           }
// // // //           required
// // // //           disabled={btnAccess}
// // // //         >
// // // //           <option value="">Select UOM</option>
// // // //           {uomOptions.map((ele, ind) => (
// // // //             <option key={ind} value={ele}>
// // // //               {ele}
// // // //             </option>
// // // //           ))}
// // // //         </select>
// // // //       </td>

// // // //       {/* Unit Price */}
// // // //       <td>
// // // //         <input
// // // //           type="number"
// // // //           min={0}
// // // //           value={product_details.unit_price}
// // // //           onChange={(e) =>
// // // //             setproduct_details((prev) => ({
// // // //               ...prev,
// // // //               unit_price: e.target.value,
// // // //             }))
// // // //           }
// // // //           required
// // // //           disabled={btnAccess}
// // // //         />
// // // //       </td>

// // // //       {/* Tax */}
// // // //       <td>
// // // //         <select
// // // //           value={product_details.tax}
// // // //           onChange={(e) =>
// // // //             setproduct_details((prev) => ({
// // // //               ...prev,
// // // //               tax: e.target.value,
// // // //               tax_id: e.target.value,   // ✅ keep tax_id in sync
// // // //             }))
// // // //           }
// // // //           required
// // // //           disabled={btnAccess}
// // // //         >
// // // //           <option value="">Select Tax</option>
// // // //           {taxOptions.map((ele, ind) => (
// // // //             <option key={ind} value={ele}>
// // // //               {ele}
// // // //             </option>
// // // //           ))}
// // // //         </select>
// // // //       </td>

// // // //       {/* Discount */}
// // // //       <td>
// // // //         <input
// // // //           type="number"
// // // //           min={0}
// // // //           max={100}
// // // //           value={product_details.discount}
// // // //           onChange={(e) =>
// // // //             setproduct_details((prev) => ({
// // // //               ...prev,
// // // //               discount: e.target.value,
// // // //             }))
// // // //           }
// // // //           required
// // // //           disabled={btnAccess}
// // // //         />
// // // //       </td>

// // // //       {/* Total */}
// // // //       <td>
// // // //         {salesData.currency === "INR" && <span>₹</span>}
// // // //         {salesData.currency === "USD" && <span>$</span>}
// // // //         {salesData.currency === "GBP" && <span>£</span>}
// // // //         {salesData.currency === "SGD" && <span>S$</span>}
// // // //         {salesData.currency === "EUR" && <span>€</span>}
// // // //         {productTotal(unique_key)}
// // // //       </td>

// // // //       {/* Delete */}
// // // //       <td id="createNewSales-table-content-center">
// // // //         <svg
// // // //           onClick={() => !btnAccess && deleteSalesProduct(unique_key)}
// // // //           className={`createNewSales-table-delete-logo ${btnAccess ? "disabled" : ""}`}
// // // //           xmlns="http://www.w3.org/2000/svg"
// // // //           viewBox="0 0 14 16"
// // // //         >
// // // //           <path d="M2.625 16C2.14375 16 1.73192 15.8261 1.3895 15.4782C1.04708 15.1304 0.875583 14.7117 0.875 14.2222V2.66667H0V0.888889H4.375V0H9.625V0.888889H14V2.66667H13.125V14.2222C13.125 14.7111 12.9538 15.1298 12.6114 15.4782C12.269 15.8267 11.8568 16.0006 11.375 16H2.625ZM4.375 12.4444H6.125V4.44444H4.375V12.4444ZM7.875 12.4444H9.625V4.44444H7.875V12.4444Z" />
// // // //         </svg>
// // // //       </td>
// // // //     </tr>
// // // //   );
// // // // }
// // // import React, { useState, useEffect } from "react";
// // // import CreateNewSalesSearchOption from "./createNewSalesSearchOption";

// // // export default function SalesListItems({
// // //   unique_key,
// // //   sales_table_data,        // productList from productApiProvider
// // //   setSalesList_data,
// // //   deleteSalesProduct,
// // //   productTotal,
// // //   salesData,
// // //   btnAccess,
// // // }) {
// // //   const [uomOptions, setuomOptions] = useState([]);
// // //   const [taxOptions, settaxOptions] = useState([]);

// // //   const [product_details, setproduct_details] = useState({
// // //     unique_key,
// // //     id:           undefined,   // item id for PATCH (edit mode)
// // //     product_id:   "",
// // //     product_name: "",
// // //     stock_level:  0,
// // //     uom:          "",
// // //     uom_id:       "",
// // //     unit_price:   0,
// // //     discount:     0,
// // //     tax:          "",
// // //     tax_id:       "",
// // //     quantity:     0,
// // //   });

// // //   // =====================================================
// // //   // PRE-FILL ROW WHEN LOADING EXISTING ORDER ITEMS
// // //   // Parent passes initialData via SalesList_data[ind]
// // //   // =====================================================
// // //   useEffect(() => {
// // //     const existing = sales_table_data.__initialRow;
// // //     // initialRow is not a real approach — pre-fill is handled via
// // //     // setSalesList_data in the parent; local state stays in sync via the
// // //     // useEffect below that syncs product_details → parent.
// // //   }, []);

// // //   // =====================================================
// // //   // SYNC LOCAL STATE → PARENT SalesList_data
// // //   // =====================================================
// // //   useEffect(() => {
// // //     setSalesList_data((prev) =>
// // //       prev.map((ele) =>
// // //         ele.unique_key === unique_key ? { ...ele, ...product_details } : ele
// // //       )
// // //     );
// // //   }, [product_details]);

// // //   // =====================================================
// // //   // INITIALISE FROM PARENT (edit mode pre-fill)
// // //   // When the parent loads an existing order it sets SalesList_data
// // //   // with full item data. Sync that into local state once on mount.
// // //   // =====================================================
// // //   useEffect(() => {
// // //     setSalesList_data((prev) => {
// // //       const existing = prev.find((e) => e.unique_key === unique_key);
// // //       if (existing && existing.product_id && !product_details.product_id) {
// // //         setproduct_details((p) => ({
// // //           ...p,
// // //           id:           existing.id,
// // //           product_id:   existing.product_id,
// // //           product_name: existing.product_name || "",
// // //           stock_level:  Number(existing.stock_level) || 0,
// // //           uom:          existing.uom    || "",
// // //           uom_id:       existing.uom_id || existing.uom || "",
// // //           unit_price:   existing.unit_price || 0,
// // //           discount:     existing.discount   || 0,
// // //           tax:          existing.tax        || "",
// // //           tax_id:       existing.tax_id     || existing.tax || "",
// // //           quantity:     existing.quantity   || 0,
// // //         }));
// // //       }
// // //       return prev;
// // //     });
// // //   // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, []);

// // //   // =====================================================
// // //   // WHEN PRODUCT NAME CHANGES → FILL ALL FIELDS
// // //   // API product shape (from productApiProvider):
// // //   // {
// // //   //   id, product_id_display, product_name,
// // //   //   unit_price, discount,
// // //   //   uom: { id, name } | [{ id, name }],
// // //   //   tax: { id, rate } | [{ id, rate }],
// // //   //   stock_level
// // //   // }
// // //   // =====================================================
// // //   useEffect(() => {
// // //     const selected = product_details.product_name;

// // //     if (!selected) {
// // //       setproduct_details((prev) => ({
// // //         ...prev,
// // //         product_id:  "",
// // //         stock_level: 0,
// // //         uom:         "",
// // //         uom_id:      "",
// // //         unit_price:  0,
// // //         discount:    0,
// // //         tax:         "",
// // //         tax_id:      "",
// // //         quantity:    0,
// // //       }));
// // //       setuomOptions([]);
// // //       settaxOptions([]);
// // //       return;
// // //     }

// // //     const product = sales_table_data.find(
// // //       (p) => p.product_name === selected
// // //     );
// // //     if (!product) return;

// // //     // ── UOM — handle both object and array shapes ──────────────────────────
// // //     const rawUom    = product.uom;
// // //     const uomList   = Array.isArray(rawUom)
// // //       ? rawUom
// // //       : rawUom && typeof rawUom === "object"
// // //       ? [rawUom]
// // //       : [];

// // //     // Normalise to { id, name } objects
// // //     const normUom   = uomList.map((u) =>
// // //       typeof u === "object" ? u : { id: u, name: u }
// // //     );

// // //     // ── TAX — handle both object and array shapes ──────────────────────────
// // //     const rawTax    = product.tax;
// // //     const taxList   = Array.isArray(rawTax)
// // //       ? rawTax
// // //       : rawTax && typeof rawTax === "object"
// // //       ? [rawTax]
// // //       : [];

// // //     // Normalise to { id, rate } objects
// // //     const normTax   = taxList.map((t) =>
// // //       typeof t === "object" ? t : { id: t, rate: t }
// // //     );

// // //     // ── Stock level ────────────────────────────────────────────────────────
// // //     const stock = Number(product.stock_level ?? product.stock ?? 0);

// // //     // ── Product display ID ─────────────────────────────────────────────────
// // //     const displayId = product.product_id_display || product.product_id || product.id || "";

// // //     setproduct_details((prev) => ({
// // //       ...prev,
// // //       product_id:  displayId,
// // //       stock_level: stock,
// // //       uom:         normUom[0]?.name || "",
// // //       uom_id:      normUom[0]?.id   || "",
// // //       unit_price:  product.unit_price || 0,
// // //       discount:    product.discount   || 0,
// // //       tax:         normTax[0]?.rate !== undefined
// // //                      ? String(normTax[0].rate)
// // //                      : "",
// // //       tax_id:      normTax[0]?.id || "",
// // //       quantity:    0,
// // //     }));

// // //     setuomOptions(normUom);
// // //     settaxOptions(normTax);
// // //   }, [product_details.product_name, sales_table_data]);

// // //   // =====================================================
// // //   // RENDER
// // //   // =====================================================
// // //   return (
// // //     <tr>
// // //       {/* # */}
// // //       <td>{unique_key + 1}</td>

// // //       {/* Product Name — searchable dropdown */}
// // //       <td style={{ position: "relative", minWidth: "200px" }}>
// // //         <CreateNewSalesSearchOption
// // //           value={product_details.product_name}
// // //           onChange={(value) =>
// // //             setproduct_details((prev) => ({ ...prev, product_name: value }))
// // //           }
// // //           productOptions={sales_table_data.map((p) => p.product_name)}
// // //           btnAccess={btnAccess}
// // //         />
// // //       </td>

// // //       {/* Product ID */}
// // //       <td>{product_details.product_id || "--"}</td>

// // //       {/* In Stock */}
// // //       <td>
// // //         {product_details.stock_level > 0 ? product_details.stock_level : "--"}
// // //       </td>

// // //       {/* Quantity */}
// // //       <td>
// // //         <input
// // //           type="number"
// // //           min={0}
// // //           value={product_details.quantity}
// // //           onChange={(e) =>
// // //             setproduct_details((prev) => ({ ...prev, quantity: e.target.value }))
// // //           }
// // //           required
// // //           disabled={btnAccess}
// // //         />
// // //       </td>

// // //       {/* UOM */}
// // //       <td>
// // //         <select
// // //           value={product_details.uom_id}
// // //           onChange={(e) => {
// // //             const selected = uomOptions.find(
// // //               (u) => String(u.id) === String(e.target.value)
// // //             );
// // //             setproduct_details((prev) => ({
// // //               ...prev,
// // //               uom_id: e.target.value,
// // //               uom:    selected?.name || e.target.value,
// // //             }));
// // //           }}
// // //           required
// // //           disabled={btnAccess}
// // //         >
// // //           <option value="">Select UOM</option>
// // //           {uomOptions.map((u, ind) => (
// // //             <option key={ind} value={u.id}>
// // //               {u.name}
// // //             </option>
// // //           ))}
// // //         </select>
// // //       </td>

// // //       {/* Unit Price */}
// // //       <td>
// // //         <input
// // //           type="number"
// // //           min={0}
// // //           value={product_details.unit_price}
// // //           onChange={(e) =>
// // //             setproduct_details((prev) => ({ ...prev, unit_price: e.target.value }))
// // //           }
// // //           required
// // //           disabled={btnAccess}
// // //         />
// // //       </td>

// // //       {/* Tax */}
// // //       <td>
// // //         <select
// // //           value={product_details.tax_id}
// // //           onChange={(e) => {
// // //             const selected = taxOptions.find(
// // //               (t) => String(t.id) === String(e.target.value)
// // //             );
// // //             setproduct_details((prev) => ({
// // //               ...prev,
// // //               tax_id: e.target.value,
// // //               tax:    selected?.rate !== undefined
// // //                         ? String(selected.rate)
// // //                         : e.target.value,
// // //             }));
// // //           }}
// // //           required
// // //           disabled={btnAccess}
// // //         >
// // //           <option value="">Select Tax</option>
// // //           {taxOptions.map((t, ind) => (
// // //             <option key={ind} value={t.id}>
// // //               {t.rate}%
// // //             </option>
// // //           ))}
// // //         </select>
// // //       </td>

// // //       {/* Discount */}
// // //       <td>
// // //         <input
// // //           type="number"
// // //           min={0}
// // //           max={100}
// // //           value={product_details.discount}
// // //           onChange={(e) =>
// // //             setproduct_details((prev) => ({ ...prev, discount: e.target.value }))
// // //           }
// // //           required
// // //           disabled={btnAccess}
// // //         />
// // //       </td>

// // //       {/* Total */}
// // //       <td>
// // //         {salesData.currency === "INR" && <span>₹</span>}
// // //         {salesData.currency === "USD" && <span>$</span>}
// // //         {salesData.currency === "GBP" && <span>£</span>}
// // //         {salesData.currency === "SGD" && <span>S$</span>}
// // //         {salesData.currency === "EUR" && <span>€</span>}
// // //         {productTotal(unique_key)}
// // //       </td>

// // //       {/* Delete */}
// // //       <td id="createNewSales-table-content-center">
// // //         <svg
// // //           onClick={() => !btnAccess && deleteSalesProduct(unique_key)}
// // //           className={`createNewSales-table-delete-logo ${btnAccess ? "disabled" : ""}`}
// // //           xmlns="http://www.w3.org/2000/svg"
// // //           viewBox="0 0 14 16"
// // //         >
// // //           <path d="M2.625 16C2.14375 16 1.73192 15.8261 1.3895 15.4782C1.04708 15.1304 0.875583 14.7117 0.875 14.2222V2.66667H0V0.888889H4.375V0H9.625V0.888889H14V2.66667H13.125V14.2222C13.125 14.7111 12.9538 15.1298 12.6114 15.4782C12.269 15.8267 11.8568 16.0006 11.375 16H2.625ZM4.375 12.4444H6.125V4.44444H4.375V12.4444ZM7.875 12.4444H9.625V4.44444H7.875V12.4444Z" />
// // //         </svg>
// // //       </td>
// // //     </tr>
// // //   );
// // // }
// // import React, { useState, useEffect, useRef } from "react";
// // import CreateNewSalesSearchOption from "./createNewSalesSearchOption";

// // // ─────────────────────────────────────────────────────────────────────────────
// // // SalesListItems — one row in the Order Line Items table
// // //
// // // KEY FIXES:
// // //  1. `initialized` ref prevents the sync useEffect from overwriting the
// // //     parent's pre-filled data before the edit-mode pre-fill fires.
// // //     Root cause of Issue 1 (data not populating in edit mode).
// // //  2. Product lookup uses p.name (API field) not p.product_name.
// // //  3. product_id display uses p.product_id ("CVB012"), numeric PK in product_numeric_id.
// // //  4. UOM comes from p.uom_detail { id, name } — single object, not array.
// // //  5. TAX comes from p.tax_code_detail { id, percentage } — single object.
// // //  6. Edit-mode pre-fill reads initial row data set by parent in SalesList_data.
// // // ─────────────────────────────────────────────────────────────────────────────

// // export default function SalesListItems({
// //   unique_key,
// //   sales_table_data,       // productList from productApiProvider (data.data array)
// //   setSalesList_data,
// //   deleteSalesProduct,
// //   productTotal,
// //   salesData,
// //   btnAccess,
// // }) {
// //   // ── UOM / Tax option lists for selects ──────────────────────────────────
// //   const [uomOptions, setuomOptions] = useState([]);  // [{ id, name }]
// //   const [taxOptions, settaxOptions] = useState([]);  // [{ id, percentage }]

// //   // ── Guards against the sync useEffect overwriting pre-filled edit data ──
// //   // Set to false initially. The pre-fill effect runs on mount and sets it to
// //   // true. The sync effect checks this before writing back to the parent.
// //   const initialized = useRef(false);

// //   const [product_details, setproduct_details] = useState({
// //     unique_key,
// //     product_id: "",          // display string e.g. "CVB001" — UI only
// //     product_numeric_id: "",  // numeric PK e.g. 12 — sent to API as "product"
// //     product_name: "",        // display string e.g. "laptop" — matches p.name
// //     stock_level: 0,          // number — used for stock check
// //     uom: "",                 // display name
// //     uom_id: "",              // numeric id sent to API
// //     unit_price: 0,
// //     discount: 0,
// //     tax: "",                 // percentage string e.g. "18.00"
// //     tax_id: "",              // numeric id sent to API
// //     quantity: 0,
// //   });

// //   // =====================================================
// //   // EDIT MODE PRE-FILL  (runs once on mount)
// //   //
// //   // When the parent loads an existing order it sets SalesList_data with
// //   // full item data before this component mounts.
// //   // We read the matching entry once and hydrate local state.
// //   //
// //   // IMPORTANT: this effect sets initialized.current = true so the sync
// //   // effect below knows it is now safe to write back to the parent.
// //   // =====================================================
// //   useEffect(() => {
// //     setSalesList_data((prev) => {
// //       const existing = prev.find((e) => e.unique_key === unique_key);

// //       if (existing && existing.product_id && !initialized.current) {
// //         // Pre-fill local state from the data already placed by the parent.
// //         setproduct_details((p) => ({
// //           ...p,
// //           product_id: existing.product_id || "",
// //           product_numeric_id: existing.product_numeric_id || "",
// //           product_name: existing.product_name || "",
// //           stock_level: Number(existing.stock_level) || 0,
// //           uom: existing.uom || "",
// //           uom_id: existing.uom_id || existing.uom || "",
// //           unit_price: existing.unit_price || 0,
// //           discount: existing.discount || 0,
// //           tax: existing.tax || "",
// //           tax_id: existing.tax_id || existing.tax || "",
// //           quantity: existing.quantity || 0,
// //         }));
// //       }

// //       // Always mark as initialized so the sync effect activates after this.
// //       initialized.current = true;
// //       return prev;
// //     });
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   // =====================================================
// //   // SYNC LOCAL STATE → PARENT SalesList_data
// //   //
// //   // FIX: Only runs AFTER initialized.current is true.
// //   // This stops the blank initial state from overwriting pre-filled
// //   // edit-mode data before the pre-fill effect can fire.
// //   // =====================================================
// //   useEffect(() => {
// //     if (!initialized.current) return;

// //     setSalesList_data((prev) =>
// //       prev.map((ele) =>
// //         ele.unique_key === unique_key
// //           ? { ...ele, ...product_details }
// //           : ele
// //       )
// //     );
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [product_details]);

// //   // =====================================================
// //   // WHEN PRODUCT NAME CHANGES → FILL ALL FIELDS
// //   //
// //   // API product shape (from productApiProvider, data.data array):
// //   // {
// //   //   id:              12,
// //   //   product_id:      "CVB012",              ← display ID shown in UI
// //   //   name:            "Industrial Fastener M8",  ← display name (NOT product_name)
// //   //   unit_price:      "45.00",
// //   //   discount:        "0.00",
// //   //   stock_level:     500,
// //   //   uom_detail:      { id: 1, name: "Piece" },  ← single object
// //   //   tax_code_detail: { id: 1, name: "GST 18%", percentage: "18.00" },
// //   // }
// //   // =====================================================
// //   useEffect(() => {
// //     // Do not run before the component has been properly initialized.
// //     // This prevents a product-name change (from "" to "") on mount from
// //     // clearing fields that were just pre-filled.
// //     if (!initialized.current) return;

// //     const selected = product_details.product_name;

// //     if (!selected) {
// //       setproduct_details((prev) => ({
// //         ...prev,
// //         product_id: "",
// //         product_numeric_id: "",
// //         stock_level: 0,
// //         uom: "",
// //         uom_id: "",
// //         unit_price: 0,
// //         discount: 0,
// //         tax: "",
// //         tax_id: "",
// //         quantity: 0,
// //       }));
// //       setuomOptions([]);
// //       settaxOptions([]);
// //       return;
// //     }

// //     // FIX: API uses "name" field, not "product_name"
// //     const product = sales_table_data.find((p) => p.name === selected);
// //     if (!product) return;

// //     // ── UOM ────────────────────────────────────────────────────────────────
// //     // API returns uom_detail as a single object { id, name }.
// //     // Wrap it in an array so the select renders uniformly.
// //     const uomList = product.uom_detail
// //       ? [{ id: product.uom_detail.id, name: product.uom_detail.name }]
// //       : product.uom
// //       ? [{ id: product.uom, name: String(product.uom) }]
// //       : [];

// //     // ── TAX ────────────────────────────────────────────────────────────────
// //     // API returns tax_code_detail as a single object { id, name, percentage }.
// //     const taxList = product.tax_code_detail
// //       ? [
// //           {
// //             id: product.tax_code_detail.id,
// //             percentage: product.tax_code_detail.percentage,
// //           },
// //         ]
// //       : product.tax_code
// //       ? [{ id: product.tax_code, percentage: String(product.tax_code) }]
// //       : [];

// //     const stock = Number(product.stock_level ?? 0);

// //     // FIX: use product.product_id ("CVB012"), NOT product.id (12)
// //     const displayId = product.product_id || String(product.id) || "";

// //     setproduct_details((prev) => ({
// //       ...prev,
// //       product_id: displayId,
// //       product_numeric_id: product.id,      // numeric PK — what the API expects
// //       stock_level: stock,
// //       uom: uomList[0]?.name || "",
// //       uom_id:
// //         uomList[0]?.id !== undefined ? String(uomList[0].id) : "",
// //       unit_price: parseFloat(product.unit_price) || 0,
// //       discount: parseFloat(product.discount) || 0,
// //       tax: taxList[0]?.percentage || "",
// //       tax_id:
// //         taxList[0]?.id !== undefined ? String(taxList[0].id) : "",
// //       quantity: 0,
// //     }));

// //     setuomOptions(uomList);
// //     settaxOptions(taxList);
// //   }, [product_details.product_name, sales_table_data]);

// //   // =====================================================
// //   // RENDER
// //   // =====================================================
// //   return (
// //     <tr>
// //       {/* # */}
// //       <td>{unique_key + 1}</td>

// //       {/* Product Name — searchable dropdown
// //           FIX: productOptions maps to p.name (API field), not p.product_name */}
// //       <td style={{ position: "relative", minWidth: "200px" }}>
// //         <CreateNewSalesSearchOption
// //           value={product_details.product_name}
// //           onChange={(value) =>
// //             setproduct_details((prev) => ({ ...prev, product_name: value }))
// //           }
// //           productOptions={sales_table_data.map((p) => p.name)}
// //           btnAccess={btnAccess}
// //         />
// //       </td>

// //       {/* Product ID — shows "CVB012" style display ID */}
// //       <td>{product_details.product_id || "--"}</td>

// //       {/* In Stock */}
// //       <td>
// //         {product_details.stock_level > 0
// //           ? product_details.stock_level
// //           : "--"}
// //       </td>

// //       {/* Quantity */}
// //       <td>
// //         <input
// //           type="number"
// //           min={0}
// //           value={product_details.quantity}
// //           onChange={(e) =>
// //             setproduct_details((prev) => ({
// //               ...prev,
// //               quantity: e.target.value,
// //             }))
// //           }
// //           required
// //           disabled={btnAccess}
// //         />
// //       </td>

// //       {/* UOM — populated from uom_detail on the selected product */}
// //       <td>
// //         <select
// //           value={product_details.uom_id}
// //           onChange={(e) => {
// //             const chosen = uomOptions.find(
// //               (u) => String(u.id) === String(e.target.value)
// //             );
// //             setproduct_details((prev) => ({
// //               ...prev,
// //               uom_id: e.target.value,
// //               uom: chosen?.name || e.target.value,
// //             }));
// //           }}
// //           required
// //           disabled={btnAccess}
// //         >
// //           <option value="">Select UOM</option>
// //           {uomOptions.map((u, ind) => (
// //             <option key={ind} value={u.id}>
// //               {u.name}
// //             </option>
// //           ))}
// //         </select>
// //       </td>

// //       {/* Unit Price */}
// //       <td>
// //         <input
// //           type="number"
// //           min={0}
// //           value={product_details.unit_price}
// //           onChange={(e) =>
// //             setproduct_details((prev) => ({
// //               ...prev,
// //               unit_price: e.target.value,
// //             }))
// //           }
// //           required
// //           disabled={btnAccess}
// //         />
// //       </td>

// //       {/* Tax — populated from tax_code_detail on the selected product */}
// //       <td>
// //         <select
// //           value={product_details.tax_id}
// //           onChange={(e) => {
// //             const chosen = taxOptions.find(
// //               (t) => String(t.id) === String(e.target.value)
// //             );
// //             setproduct_details((prev) => ({
// //               ...prev,
// //               tax_id: e.target.value,
// //               tax: chosen?.percentage || e.target.value,
// //             }));
// //           }}
// //           required
// //           disabled={btnAccess}
// //         >
// //           <option value="">Select Tax</option>
// //           {taxOptions.map((t, ind) => (
// //             <option key={ind} value={t.id}>
// //               {t.percentage}%
// //             </option>
// //           ))}
// //         </select>
// //       </td>

// //       {/* Discount */}
// //       <td>
// //         <input
// //           type="number"
// //           min={0}
// //           max={100}
// //           value={product_details.discount}
// //           onChange={(e) =>
// //             setproduct_details((prev) => ({
// //               ...prev,
// //               discount: e.target.value,
// //             }))
// //           }
// //           required
// //           disabled={btnAccess}
// //         />
// //       </td>

// //       {/* Row Total */}
// //       <td>
// //         {salesData.currency === "INR" && <span>₹</span>}
// //         {salesData.currency === "USD" && <span>$</span>}
// //         {salesData.currency === "GBP" && <span>£</span>}
// //         {salesData.currency === "SGD" && <span>S$</span>}
// //         {salesData.currency === "EUR" && <span>€</span>}
// //         {productTotal(unique_key)}
// //       </td>

// //       {/* Delete */}
// //       <td id="createNewSales-table-content-center">
// //         <svg
// //           onClick={() => !btnAccess && deleteSalesProduct(unique_key)}
// //           className={`createNewSales-table-delete-logo ${
// //             btnAccess ? "disabled" : ""
// //           }`}
// //           xmlns="http://www.w3.org/2000/svg"
// //           viewBox="0 0 14 16"
// //         >
// //           <path d="M2.625 16C2.14375 16 1.73192 15.8261 1.3895 15.4782C1.04708 15.1304 0.875583 14.7117 0.875 14.2222V2.66667H0V0.888889H4.375V0H9.625V0.888889H14V2.66667H13.125V14.2222C13.125 14.7111 12.9538 15.1298 12.6114 15.4782C12.269 15.8267 11.8568 16.0006 11.375 16H2.625ZM4.375 12.4444H6.125V4.44444H4.375V12.4444ZM7.875 12.4444H9.625V4.44444H7.875V12.4444Z" />
// //         </svg>
// //       </td>
// //     </tr>
// //   );
// // }
// import React, { useState, useEffect, useRef } from "react";
// import CreateNewSalesSearchOption from "./createNewSalesSearchOption";

// export default function SalesListItems({
//   unique_key,
//   sales_table_data,
//   setSalesList_data,
//   deleteSalesProduct,
//   productTotal,
//   salesData,
//   btnAccess,
// }) {
//   const [uomOptions, setuomOptions] = useState([]);
//   const [taxOptions, settaxOptions] = useState([]);

//   // Tracks whether the initial pre-fill (edit mode) has already run.
//   // Prevents the blank-state sync effect from overwriting pre-filled data.
//   const initialized = useRef(false);

//   // Tracks the last product_name the "product changed" effect ran for.
//   // Prevents it from wiping fields when product_name is set during pre-fill.
//   const lastAutoFilledProduct = useRef("");

//   const [product_details, setproduct_details] = useState({
//     unique_key,
//     product_id: "",
//     product_numeric_id: "",
//     product_name: "",
//     stock_level: 0,
//     uom: "",
//     uom_id: "",
//     unit_price: 0,
//     discount: 0,
//     tax: "",
//     tax_id: "",
//     quantity: 0,
//   });

//   // ─────────────────────────────────────────────────────────────
//   // Helper: given a product object from sales_table_data, build
//   // the uom/tax option lists and the flat field values.
//   // Centralised here so both edit-prefill and user-select reuse it.
//   // ─────────────────────────────────────────────────────────────
//   function deriveOptionsFromProduct(product) {
//     const uomList = product.uom_detail
//       ? [{ id: product.uom_detail.id, name: product.uom_detail.name }]
//       : product.uom
//       ? [{ id: product.uom, name: String(product.uom) }]
//       : [];

//     const taxList = product.tax_code_detail
//       ? [{ id: product.tax_code_detail.id, percentage: product.tax_code_detail.percentage }]
//       : product.tax_code
//       ? [{ id: product.tax_code, percentage: String(product.tax_code) }]
//       : [];

//     return { uomList, taxList };
//   }

//   // ─────────────────────────────────────────────────────────────
//   // EDIT-MODE PRE-FILL
//   //
//   // Runs once on mount (and re-runs when sales_table_data arrives,
//   // because in edit mode the product list may load after the row mounts).
//   //
//   // Flow:
//   //  1. Read the pre-populated row from parent SalesList_data.
//   //  2. Find the matching product in sales_table_data to rebuild
//   //     uomOptions / taxOptions so the <select> has options to show.
//   //  3. Set local state — mark lastAutoFilledProduct so the
//   //     "product changed" effect below knows NOT to reset the fields.
//   //  4. Mark initialized = true so the sync effect activates.
//   // ─────────────────────────────────────────────────────────────
//   useEffect(() => {
//     // Nothing to prefill if sales_table_data hasn't arrived yet.
//     if (!sales_table_data || sales_table_data.length === 0) return;

//     setSalesList_data((prev) => {
//       const existing = prev.find((e) => e.unique_key === unique_key);

//       if (existing && (existing.product_name || existing.product_id) && !initialized.current) {
//         // Find the matching product to rebuild option lists
//         const product = sales_table_data.find(
//           (p) =>
//             p.name === existing.product_name ||
//             p.product_id === existing.product_id ||
//             String(p.id) === String(existing.product_numeric_id)
//         );

//         if (product) {
//           const { uomList, taxList } = deriveOptionsFromProduct(product);

//           setuomOptions(uomList);
//           settaxOptions(taxList);

//           // Tell the "product changed" effect this product name was set
//           // by us — so it must NOT reset fields.
//           lastAutoFilledProduct.current = existing.product_name || "";

//           setproduct_details({
//             unique_key,
//             product_id:         product.product_id || String(product.id) || "",
//             product_numeric_id: product.id,
//             product_name:       existing.product_name || product.name || "",
//             stock_level:        Number(product.stock_level ?? existing.stock_level ?? 0),
//             uom:                uomList[0]?.name  || existing.uom  || "",
//             uom_id:             uomList[0]?.id !== undefined ? String(uomList[0].id) : String(existing.uom_id || existing.uom || ""),
//             unit_price:         parseFloat(existing.unit_price)  || parseFloat(product.unit_price)  || 0,
//             discount:           parseFloat(existing.discount)    || parseFloat(product.discount)    || 0,
//             tax:                taxList[0]?.percentage || existing.tax || "",
//             tax_id:             taxList[0]?.id !== undefined ? String(taxList[0].id) : String(existing.tax_id || existing.tax || ""),
//             quantity:           Number(existing.quantity) || 0,
//           });
//         } else {
//           // Product master not found — still restore the raw values so
//           // text fields at least show correct data.
//           lastAutoFilledProduct.current = existing.product_name || "";

//           setproduct_details({
//             unique_key,
//             product_id:         existing.product_id         || "",
//             product_numeric_id: existing.product_numeric_id || "",
//             product_name:       existing.product_name       || "",
//             stock_level:        Number(existing.stock_level) || 0,
//             uom:                existing.uom                || "",
//             uom_id:             String(existing.uom_id      || existing.uom || ""),
//             unit_price:         parseFloat(existing.unit_price)  || 0,
//             discount:           parseFloat(existing.discount)    || 0,
//             tax:                existing.tax                || "",
//             tax_id:             String(existing.tax_id      || existing.tax || ""),
//             quantity:           Number(existing.quantity)   || 0,
//           });
//         }
//       }

//       initialized.current = true;
//       return prev; // no mutation — just reading
//     });
//     // Re-run when sales_table_data arrives (async load case)
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [sales_table_data]);

//   // ─────────────────────────────────────────────────────────────
//   // SYNC LOCAL STATE → PARENT
//   // Only after initialization to avoid wiping pre-filled data.
//   // ─────────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!initialized.current) return;

//     setSalesList_data((prev) =>
//       prev.map((ele) =>
//         ele.unique_key === unique_key ? { ...ele, ...product_details } : ele
//       )
//     );
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [product_details]);

//   // ─────────────────────────────────────────────────────────────
//   // PRODUCT NAME CHANGED BY USER → AUTO-FILL FIELDS
//   //
//   // Guard: if the name matches lastAutoFilledProduct (set during
//   // pre-fill) skip the reset — the fields are already correct.
//   // ─────────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!initialized.current) return;

//     const selected = product_details.product_name;

//     // Skip if this is the product we just pre-filled (edit mode)
//     if (selected === lastAutoFilledProduct.current) {
//       lastAutoFilledProduct.current = ""; // clear so future user changes work
//       return;
//     }

//     if (!selected) {
//       setproduct_details((prev) => ({
//         ...prev,
//         product_id: "",
//         product_numeric_id: "",
//         stock_level: 0,
//         uom: "",
//         uom_id: "",
//         unit_price: 0,
//         discount: 0,
//         tax: "",
//         tax_id: "",
//         quantity: 0,
//       }));
//       setuomOptions([]);
//       settaxOptions([]);
//       return;
//     }

//     const product = sales_table_data.find((p) => p.name === selected);
//     if (!product) return;

//     const { uomList, taxList } = deriveOptionsFromProduct(product);

//     setuomOptions(uomList);
//     settaxOptions(taxList);

//     setproduct_details((prev) => ({
//       ...prev,
//       product_id:         product.product_id || String(product.id) || "",
//       product_numeric_id: product.id,
//       stock_level:        Number(product.stock_level ?? 0),
//       uom:                uomList[0]?.name || "",
//       uom_id:             uomList[0]?.id !== undefined ? String(uomList[0].id) : "",
//       unit_price:         parseFloat(product.unit_price) || 0,
//       discount:           parseFloat(product.discount)   || 0,
//       tax:                taxList[0]?.percentage || "",
//       tax_id:             taxList[0]?.id !== undefined ? String(taxList[0].id) : "",
//       quantity:           0,
//     }));
//   }, [product_details.product_name, sales_table_data]);

//   // ─────────────────────────────────────────────────────────────
//   // RENDER
//   // ─────────────────────────────────────────────────────────────
//   return (
//     <tr>
//       {/* # */}
//       <td>{unique_key + 1}</td>

//       {/* Product Name */}
//       <td style={{ position: "relative", minWidth: "200px" }}>
//         <CreateNewSalesSearchOption
//           value={product_details.product_name}
//           onChange={(value) =>
//             setproduct_details((prev) => ({ ...prev, product_name: value }))
//           }
//           productOptions={sales_table_data.map((p) => p.name)}
//           btnAccess={btnAccess}
//         />
//       </td>

//       {/* Product ID */}
//       <td>{product_details.product_id || "--"}</td>

//       {/* In Stock */}
//       <td>{product_details.stock_level > 0 ? product_details.stock_level : "--"}</td>

//       {/* Quantity */}
//       <td>
//         <input
//           type="number"
//           min={0}
//           value={product_details.quantity}
//           onChange={(e) =>
//             setproduct_details((prev) => ({ ...prev, quantity: e.target.value }))
//           }
//           required
//           disabled={btnAccess}
//         />
//       </td>

//       {/* UOM */}
//       <td>
//         <select
//           value={product_details.uom_id}
//           onChange={(e) => {
//             const chosen = uomOptions.find((u) => String(u.id) === String(e.target.value));
//             setproduct_details((prev) => ({
//               ...prev,
//               uom_id: e.target.value,
//               uom: chosen?.name || e.target.value,
//             }));
//           }}
//           required
//           disabled={btnAccess}
//         >
//           <option value="">Select UOM</option>
//           {uomOptions.map((u, ind) => (
//             <option key={ind} value={u.id}>{u.name}</option>
//           ))}
//         </select>
//       </td>

//       {/* Unit Price */}
//       <td>
//         <input
//           type="number"
//           min={0}
//           value={product_details.unit_price}
//           onChange={(e) =>
//             setproduct_details((prev) => ({ ...prev, unit_price: e.target.value }))
//           }
//           required
//           disabled={btnAccess}
//         />
//       </td>

//       {/* Tax */}
//       <td>
//         <select
//           value={product_details.tax_id}
//           onChange={(e) => {
//             const chosen = taxOptions.find((t) => String(t.id) === String(e.target.value));
//             setproduct_details((prev) => ({
//               ...prev,
//               tax_id: e.target.value,
//               tax: chosen?.percentage || e.target.value,
//             }));
//           }}
//           required
//           disabled={btnAccess}
//         >
//           <option value="">Select Tax</option>
//           {taxOptions.map((t, ind) => (
//             <option key={ind} value={t.id}>{t.percentage}%</option>
//           ))}
//         </select>
//       </td>

//       {/* Discount */}
//       <td>
//         <input
//           type="number"
//           min={0}
//           max={100}
//           value={product_details.discount}
//           onChange={(e) =>
//             setproduct_details((prev) => ({ ...prev, discount: e.target.value }))
//           }
//           required
//           disabled={btnAccess}
//         />
//       </td>

//       {/* Row Total */}
//       <td>
//         {salesData.currency === "INR" && <span>₹</span>}
//         {salesData.currency === "USD" && <span>$</span>}
//         {salesData.currency === "GBP" && <span>£</span>}
//         {salesData.currency === "SGD" && <span>S$</span>}
//         {salesData.currency === "EUR" && <span>€</span>}
//         {productTotal(unique_key)}
//       </td>

//       {/* Delete */}
//       <td id="createNewSales-table-content-center">
//         <svg
//           onClick={() => !btnAccess && deleteSalesProduct(unique_key)}
//           className={`createNewSales-table-delete-logo ${btnAccess ? "disabled" : ""}`}
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 14 16"
//         >
//           <path d="M2.625 16C2.14375 16 1.73192 15.8261 1.3895 15.4782C1.04708 15.1304 0.875583 14.7117 0.875 14.2222V2.66667H0V0.888889H4.375V0H9.625V0.888889H14V2.66667H13.125V14.2222C13.125 14.7111 12.9538 15.1298 12.6114 15.4782C12.269 15.8267 11.8568 16.0006 11.375 16H2.625ZM4.375 12.4444H6.125V4.44444H4.375V12.4444ZM7.875 12.4444H9.625V4.44444H7.875V12.4444Z" />
//         </svg>
//       </td>
//     </tr>
//   );
// }
import React, { useState, useEffect, useRef } from "react";
import CreateNewSalesSearchOption from "./createNewSalesSearchOption";

export default function SalesListItems({
  unique_key,
  sales_table_data,
  setSalesList_data,
  deleteSalesProduct,
  productTotal,
  salesData,
  btnAccess,
  allUoms  = [],   // [{ id, name }, ...]       from masters/uoms/
  allTaxes = [],   // [{ id, percentage }, ...]  from masters/taxcodes/
}) {
  const initialized           = useRef(false);
  const lastAutoFilledProduct = useRef("");

  const [product_details, setproduct_details] = useState({
    unique_key,
    product_id:         "",
    product_numeric_id: "",
    product_name:       "",
    stock_level:        0,
    uom:                "",
    uom_id:             "",
    unit_price:         0,
    discount:           0,
    tax:                "",
    tax_id:             "",
    quantity:           0,
  });

  // ── Always use full lists for the dropdowns ─────────────────────────────
  // uomOptions and taxOptions ARE the full allUoms/allTaxes lists.
  // We just default-select the product's assigned one.
  // No need for separate uomOptions state.

  // ─── helper: get default uom_id / tax_id for a product ──────────────────
  function getProductDefaults(product) {
    const uomId  = product.uom_detail?.id  ?? product.uom  ?? "";
    const taxId  = product.tax_code_detail?.id ?? product.tax_code ?? "";

    const uomName = allUoms.find((u) => String(u.id) === String(uomId))?.name
                  || product.uom_detail?.name
                  || "";
    const taxPct  = allTaxes.find((t) => String(t.id) === String(taxId))?.percentage
                  ?? product.tax_code_detail?.percentage
                  ?? product.tax_rate
                  ?? "";

    return {
      uom_id:  String(uomId),
      uom:     uomName,
      tax_id:  String(taxId),
      tax:     String(taxPct),
    };
  }

  // ─── EDIT-MODE PRE-FILL ───────────────────────────────────────────────────
  useEffect(() => {
    if (!sales_table_data || sales_table_data.length === 0) return;

    setSalesList_data((prev) => {
      const existing = prev.find((e) => e.unique_key === unique_key);

      if (existing && (existing.product_name || existing.product_id) && !initialized.current) {
        const product = sales_table_data.find(
          (p) =>
            p.name === existing.product_name ||
            p.product_id === existing.product_id ||
            String(p.id) === String(existing.product_numeric_id)
        );

        lastAutoFilledProduct.current = existing.product_name || "";

        const defaults = product ? getProductDefaults(product) : {};

        setproduct_details({
          unique_key,
          product_id:         product?.product_id || String(product?.id || existing.product_id || ""),
          product_numeric_id: product?.id         || existing.product_numeric_id || "",
          product_name:       existing.product_name || product?.name || "",
          stock_level:        Number(product?.stock_level ?? existing.stock_level ?? 0),
          uom_id:             String(existing.uom_id  || existing.uom  || defaults.uom_id  || ""),
          uom:                existing.uom   || defaults.uom   || "",
          unit_price:         parseFloat(existing.unit_price)  || parseFloat(product?.unit_price) || 0,
          discount:           parseFloat(existing.discount)    || 0,
          tax_id:             String(existing.tax_id  || existing.tax  || defaults.tax_id  || ""),
          tax:                existing.tax   || defaults.tax   || "",
          quantity:           Number(existing.quantity) || 0,
        });
      }

      initialized.current = true;
      return prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sales_table_data]);

  // ─── When allUoms/allTaxes arrive, update display names if needed ─────────
  useEffect(() => {
    if (!initialized.current) return;
    if (!product_details.product_numeric_id && !product_details.uom_id) return;

    // Refresh uom name from full list
    if (product_details.uom_id && allUoms.length > 0) {
      const uomName = allUoms.find((u) => String(u.id) === String(product_details.uom_id))?.name;
      if (uomName && uomName !== product_details.uom) {
        setproduct_details((prev) => ({ ...prev, uom: uomName }));
      }
    }
    // Refresh tax percentage from full list
    if (product_details.tax_id && allTaxes.length > 0) {
      const taxPct = allTaxes.find((t) => String(t.id) === String(product_details.tax_id))?.percentage;
      if (taxPct !== undefined && String(taxPct) !== product_details.tax) {
        setproduct_details((prev) => ({ ...prev, tax: String(taxPct) }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allUoms, allTaxes]);

  // ─── SYNC LOCAL → PARENT ─────────────────────────────────────────────────
  useEffect(() => {
    if (!initialized.current) return;
    setSalesList_data((prev) =>
      prev.map((ele) =>
        ele.unique_key === unique_key ? { ...ele, ...product_details } : ele
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product_details]);

  // ─── PRODUCT CHANGED BY USER → AUTO-FILL ─────────────────────────────────
  useEffect(() => {
    if (!initialized.current) return;

    const selected = product_details.product_name;

    if (selected === lastAutoFilledProduct.current) {
      lastAutoFilledProduct.current = "";
      return;
    }

    if (!selected) {
      setproduct_details((prev) => ({
        ...prev,
        product_id: "", product_numeric_id: "", stock_level: 0,
        uom: "", uom_id: "", unit_price: 0, discount: 0,
        tax: "", tax_id: "", quantity: 0,
      }));
      return;
    }

    const product = sales_table_data.find((p) => p.name === selected);
    if (!product) return;

    const defaults = getProductDefaults(product);

    setproduct_details((prev) => ({
      ...prev,
      product_id:         product.product_id || String(product.id) || "",
      product_numeric_id: product.id,
      stock_level:        Number(product.stock_level ?? 0),
      uom_id:             defaults.uom_id,
      uom:                defaults.uom,
      unit_price:         parseFloat(product.unit_price) || 0,
      discount:           parseFloat(product.discount)   || 0,
      tax_id:             defaults.tax_id,
      tax:                defaults.tax,
      quantity:           0,
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product_details.product_name, sales_table_data, allUoms, allTaxes]);

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <tr>
      <td>{unique_key + 1}</td>

      {/* Product Name */}
      <td style={{ position: "relative", minWidth: "200px" }}>
        <CreateNewSalesSearchOption
          value={product_details.product_name}
          onChange={(value) =>
            setproduct_details((prev) => ({ ...prev, product_name: value }))
          }
          productOptions={sales_table_data.map((p) => p.name)}
          btnAccess={btnAccess}
        />
      </td>

      {/* Product ID */}
      <td>{product_details.product_id || "--"}</td>

      {/* In Stock */}
      <td>{product_details.stock_level > 0 ? product_details.stock_level : "--"}</td>

      {/* Quantity */}
      <td>
        <input
          type="number" min={0}
          value={product_details.quantity}
          onChange={(e) => setproduct_details((prev) => ({ ...prev, quantity: e.target.value }))}
          required disabled={btnAccess}
        />
      </td>

      {/* UOM — always shows full allUoms list, defaults to product's assigned UOM */}
      <td>
        <select
          value={product_details.uom_id}
          onChange={(e) => {
            const chosen = allUoms.find((u) => String(u.id) === String(e.target.value));
            setproduct_details((prev) => ({
              ...prev,
              uom_id: e.target.value,
              uom:    chosen?.name || e.target.value,
            }));
          }}
          required disabled={btnAccess}
        >
          <option value="">Select UOM</option>
          {allUoms.map((u) => (
            <option key={u.id} value={String(u.id)}>{u.name}</option>
          ))}
        </select>
      </td>

      {/* Unit Price */}
      <td>
        <input
          type="number" min={0}
          value={product_details.unit_price}
          onChange={(e) => setproduct_details((prev) => ({ ...prev, unit_price: e.target.value }))}
          required disabled={btnAccess}
        />
      </td>

      {/* Tax — always shows full allTaxes list */}
      <td>
        <select
          value={product_details.tax_id}
          onChange={(e) => {
            const chosen = allTaxes.find((t) => String(t.id) === String(e.target.value));
            setproduct_details((prev) => ({
              ...prev,
              tax_id: e.target.value,
              tax:    chosen?.percentage !== undefined ? String(chosen.percentage) : e.target.value,
            }));
          }}
          required disabled={btnAccess}
        >
          <option value="">Select Tax</option>
          {allTaxes.map((t) => (
            <option key={t.id} value={String(t.id)}>{t.percentage}%</option>
          ))}
        </select>
      </td>

      {/* Discount */}
      <td>
        <input
          type="number" min={0} max={100}
          value={product_details.discount}
          onChange={(e) => setproduct_details((prev) => ({ ...prev, discount: e.target.value }))}
          required disabled={btnAccess}
        />
      </td>

      {/* Row Total */}
      <td>
        {salesData.currency === "INR" && <span>₹</span>}
        {salesData.currency === "USD" && <span>$</span>}
        {salesData.currency === "GBP" && <span>£</span>}
        {salesData.currency === "SGD" && <span>S$</span>}
        {salesData.currency === "EUR" && <span>€</span>}
        {productTotal(unique_key)}
      </td>

      {/* Delete */}
      <td id="createNewSales-table-content-center">
        <svg
          onClick={() => !btnAccess && deleteSalesProduct(unique_key)}
          className={`createNewSales-table-delete-logo ${btnAccess ? "disabled" : ""}`}
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 16"
        >
          <path d="M2.625 16C2.14375 16 1.73192 15.8261 1.3895 15.4782C1.04708 15.1304 0.875583 14.7117 0.875 14.2222V2.66667H0V0.888889H4.375V0H9.625V0.888889H14V2.66667H13.125V14.2222C13.125 14.7111 12.9538 15.1298 12.6114 15.4782C12.269 15.8267 11.8568 16.0006 11.375 16H2.625ZM4.375 12.4444H6.125V4.44444H4.375V12.4444ZM7.875 12.4444H9.625V4.44444H7.875V12.4444Z" />
        </svg>
      </td>
    </tr>
  );
}