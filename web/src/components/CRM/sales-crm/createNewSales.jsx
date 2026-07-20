// // // import React, { useState, useEffect } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import "./createNewSales.css";
// // // import SalesListItems from "./salesListItems";
// // // import CreatNewSalesStockAlert from "./creatNewSalesStockAlert";
// // // import CreateNewSalesHistory from "./createNewSalesHistory";
// // // import CreateNewSalesComment from "./createNewSalesComment";
// // // import { toast } from "react-toastify";

// // // // ── Each API concern comes from its own provider ──────────────────────────────
// // // import salesOrderApiProvider from "../../../network/salesOrder-api-provider";
// // // import userApiProvider       from "../../../network/user-api-provider";
// // // import productApiProvider    from "../../../network/product-api-provider";
// // // import customerApiProvider   from "../../../network/customer-api-provider";
// // // // ─────────────────────────────────────────────────────────────────────────────

// // // export default function CreateNewSales({ setCurrentPage, orderId = null }) {
// // //   const prevPage = useNavigate();

// // //   // =====================================================
// // //   // LOCAL STATE
// // //   // =====================================================
// // //   const [salesStatus,  setSalesStatus]  = useState("");
// // //   const [feacher,      setFeacher]      = useState({ showChat: true, showHistory: false });
// // //   const [stockAlert,   setStockAlert]   = useState(false);
// // //   const [submitting,   setSubmitting]   = useState(false);
// // //   const [loading,      setLoading]      = useState(true); // dropdown loading

// // //   // =====================================================
// // //   // DROPDOWN DATA
// // //   // =====================================================
// // //   const [salesRepList,  setSalesRepList]  = useState([]);
// // //   const [customerList,  setCustomerList]  = useState([]);
// // //   const [productList,   setProductList]   = useState([]);
// // //   const [purchase_order, setPurchase_order] = useState("");

// // //   // =====================================================
// // //   // FORM DATA
// // //   // =====================================================
// // //   const [salesData, setSalesData] = useState({
// // //     sales_order_id:   "",
// // //     order_date:       "",
// // //     sales_rep:        "",   // stores user ID
// // //     order_type:       "",
// // //     customer:         "",   // stores customer ID
// // //     customer_name:    "",   // display only
// // //     billing_address:  "",
// // //     shipping_address: "",
// // //     email_id:         "",
// // //     phone_number:     "",
// // //     payment_method:   "",
// // //     currency:         "",
// // //     due_date:         "",
// // //     terms_conditions: "",
// // //     shipping_method:  "",
// // //     expected_delivery:"",
// // //     tracking_number:  "",
// // //     internal_notes:   "",
// // //     customer_notes:   "",
// // //     global_discount:  0,
// // //     shipping_charges: 0,
// // //   });

// // //   const [salesBtn, setSalesBtn] = useState({
// // //     BtnAccess:              false,
// // //     cancel:                 false,
// // //     cancel_order:           true,
// // //     save_draft:             false,
// // //     submit:                 false,
// // //     Generate_po:            false,
// // //     pdf:                    true,
// // //     email:                  true,
// // //     generate_delivery_note: true,
// // //     generate_invoice:       true,
// // //   });

// // //   // =====================================================
// // //   // PRODUCT LINE ITEMS
// // //   // =====================================================
// // //   const [numOfSalesList, setnumOfSalesList] = useState(1);
// // //   const [SalesList_data, setSalesList_data] = useState([{ unique_key: 0 }]);

// // //   // =====================================================
// // //   // FETCH DROPDOWNS ON MOUNT
// // //   // userApiProvider   → sales rep list
// // //   // productApiProvider → product list for line items
// // //   // customerApiProvider → customer dropdown + autofill
// // //   // =====================================================
// // //   useEffect(() => {
// // //     const loadDropdowns = async () => {
// // //       setLoading(true);
// // //       try {
// // //         const [usersRes, customersRes, productsRes] = await Promise.all([
// // //           userApiProvider.fetchUsers(),          // { users: [], total_pages, current_page }
// // //           customerApiProvider.fetchCustomers(),  // { customers: [], total_pages }
// // //           productApiProvider.fetchProducts(),    // { products: [], total_pages, current_page }
// // //         ]);

// // //         // ── Sales Reps ──────────────────────────────────────────────────────
// // //         // userApiProvider.fetchUsers() returns { users: [...], total_pages, current_page }
// // //         const usersArray = usersRes?.users || usersRes?.data || [];
// // //         setSalesRepList(Array.isArray(usersArray) ? usersArray : []);

// // //         // ── Customers ───────────────────────────────────────────────────────
// // //         // customerApiProvider.fetchCustomers() returns { customers: [...], total_pages }
// // //         const customersArray = customersRes?.customers || customersRes?.data || [];
// // //         setCustomerList(Array.isArray(customersArray) ? customersArray : []);

// // //         // ── Products ────────────────────────────────────────────────────────
// // //         // productApiProvider.fetchProducts() returns { products: [...], total_pages, current_page }
// // //         const productsArray = productsRes?.products || productsRes?.data || [];
// // //         setProductList(Array.isArray(productsArray) ? productsArray : []);

// // //       } catch (err) {
// // //         console.error("Failed to load dropdowns:", err);
// // //         toast.error("Failed to load form data. Please refresh.");
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };

// // //     loadDropdowns();
// // //   }, []);

// // //   // =====================================================
// // //   // EDIT MODE — FETCH EXISTING ORDER
// // //   // salesOrderApiProvider.fetchSalesOrderById(orderId)
// // //   // =====================================================
// // //   useEffect(() => {
// // //     if (!orderId) return;

// // //     const loadOrder = async () => {
// // //       try {
// // //         const result = await salesOrderApiProvider.fetchSalesOrderById(orderId);
// // //         if (!result) return;

// // //         setSalesStatus(result.status || "");
// // //         setPurchase_order(result.purchase_order || "");

// // //         setSalesData({
// // //           sales_order_id:   result.sales_order_id || result.id || "",
// // //           order_date:       result.order_date        || "",
// // //           sales_rep:        result.sales_rep         || "",
// // //           order_type:       result.order_type        || "",
// // //           customer:         result.customer          || "",
// // //           customer_name:    result.customer_name     || "",
// // //           billing_address:  result.billing_address   || "",
// // //           shipping_address: result.shipping_address  || "",
// // //           email_id:         result.email_id          || "",
// // //           phone_number:     result.phone_number      || "",
// // //           payment_method:   result.payment_method    || "",
// // //           currency:         result.currency          || "",
// // //           due_date:         result.due_date          || "",
// // //           terms_conditions: result.terms_conditions  || "",
// // //           shipping_method:  result.shipping_method   || "",
// // //           expected_delivery:result.expected_delivery || "",
// // //           tracking_number:  result.tracking_number   || "",
// // //           internal_notes:   result.internal_notes    || "",
// // //           customer_notes:   result.customer_notes    || "",
// // //           global_discount:  result.global_discount   || 0,
// // //           shipping_charges: result.shipping_charges  || 0,
// // //         });

// // //         if (result.items?.length > 0) {
// // //           setSalesList_data(
// // //             result.items.map((item, ind) => ({
// // //               unique_key:   ind,
// // //               product_id:   item.product,
// // //               product_name: item.product_name  || "",
// // //               quantity:     item.quantity,
// // //               uom:          item.uom,
// // //               uom_id:       item.uom,
// // //               unit_price:   item.unit_price,
// // //               discount:     item.discount,
// // //               tax:          item.tax,
// // //               tax_id:       item.tax,
// // //               stock_level:  Number(item.stock_level) || 0,
// // //             }))
// // //           );
// // //           setnumOfSalesList(result.items.length);
// // //         }
// // //       } catch (err) {
// // //         console.error("Failed to load order:", err);
// // //         toast.error("Failed to load order details.");
// // //       }
// // //     };

// // //     loadOrder();
// // //   }, [orderId]);

// // //   // =====================================================
// // //   // GENERIC FORM FIELD CHANGE
// // //   // =====================================================
// // //   const handleSalesDataChange = (e) => {
// // //     setSalesData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
// // //   };

// // //   // =====================================================
// // //   // AUTOFILL CUSTOMER FIELDS ON DROPDOWN SELECT
// // //   // customerApiProvider data is already in customerList
// // //   // =====================================================
// // //   useEffect(() => {
// // //     if (!salesData.customer) {
// // //       setSalesData((prev) => ({
// // //         ...prev,
// // //         customer_name:    "",
// // //         billing_address:  "",
// // //         shipping_address: "",
// // //         email_id:         "",
// // //         phone_number:     "",
// // //       }));
// // //       return;
// // //     }

// // //     const customer = customerList.find(
// // //       (c) => String(c.id) === String(salesData.customer)
// // //     );

// // //     if (customer) {
// // //       setSalesData((prev) => ({
// // //         ...prev,
// // //         customer_name:    customer.customer_name     || customer.name  || "",
// // //         billing_address:  customer.billing_address   || "",
// // //         shipping_address: customer.shipping_address  || "",
// // //         email_id:         customer.email_id          || customer.email || "",
// // //         phone_number:     customer.phone_number      || customer.phone || "",
// // //       }));
// // //     }
// // //   }, [salesData.customer, customerList]);

// // //   // =====================================================
// // //   // BUTTON STATE BASED ON ORDER STATUS
// // //   // =====================================================
// // //   useEffect(() => {
// // //     if (salesStatus === "") {
// // //       setSalesBtn((prev) => ({ ...prev, BtnAccess: false }));
// // //       return;
// // //     }

// // //     switch (salesStatus) {
// // //       case "Draft":
// // //         setSalesBtn({
// // //           BtnAccess:              false,
// // //           cancel:                 false,
// // //           cancel_order:           true,
// // //           save_draft:             false,
// // //           submit:                 false,
// // //           Generate_po:            purchase_order === "Purchase Ordered",
// // //           pdf:                    false,
// // //           email:                  false,
// // //           generate_delivery_note: true,
// // //           generate_invoice:       true,
// // //         });
// // //         break;

// // //       case "Submitted(PD)":
// // //         setSalesBtn({
// // //           BtnAccess:              false,
// // //           cancel:                 false,
// // //           cancel_order:           false,
// // //           save_draft:             true,
// // //           submit:                 false,
// // //           Generate_po:            purchase_order === "Purchase Ordered",
// // //           pdf:                    false,
// // //           email:                  false,
// // //           generate_delivery_note: false,
// // //           generate_invoice:       true,
// // //         });
// // //         break;

// // //       case "Submitted":
// // //         setSalesBtn({
// // //           BtnAccess:              true,
// // //           cancel:                 false,
// // //           cancel_order:           false,
// // //           save_draft:             true,
// // //           submit:                 true,
// // //           Generate_po:            false,
// // //           pdf:                    false,
// // //           email:                  false,
// // //           generate_delivery_note: false,
// // //           generate_invoice:       false,
// // //         });
// // //         break;

// // //       case "Cancelled":
// // //         setSalesBtn({
// // //           BtnAccess:              true,
// // //           cancel:                 false,
// // //           cancel_order:           true,
// // //           save_draft:             true,
// // //           submit:                 true,
// // //           Generate_po:            true,
// // //           pdf:                    false,
// // //           email:                  false,
// // //           generate_delivery_note: true,
// // //           generate_invoice:       true,
// // //         });
// // //         break;

// // //       default:
// // //         setSalesBtn((prev) => ({ ...prev, BtnAccess: false }));
// // //     }
// // //   }, [salesStatus, purchase_order]);

// // //   // =====================================================
// // //   // BUILD PAYLOAD for create / update
// // //   // =====================================================
// // //   const buildPayload = (status) => {
// // //     const items = SalesList_data
// // //       .filter((item) => item.product_id && item.product_id !== "--")
// // //       .map((item) => ({
// // //         product:    item.product_id,
// // //         quantity:   Number(item.quantity)        || 0,
// // //         uom:        item.uom_id                  || item.uom,
// // //         unit_price: parseFloat(item.unit_price)  || 0,
// // //         discount:   parseFloat(item.discount)    || 0,
// // //         tax:        item.tax_id                  || item.tax,
// // //       }));

// // //     return {
// // //       order_date:       salesData.order_date,
// // //       sales_rep:        salesData.sales_rep,
// // //       order_type:       salesData.order_type,
// // //       customer:         salesData.customer,
// // //       payment_method:   salesData.payment_method,
// // //       currency:         salesData.currency,
// // //       due_date:         salesData.due_date         || null,
// // //       terms_conditions: salesData.terms_conditions,
// // //       shipping_method:  salesData.shipping_method,
// // //       expected_delivery:salesData.expected_delivery || null,
// // //       tracking_number:  salesData.tracking_number,
// // //       internal_notes:   salesData.internal_notes,
// // //       customer_notes:   salesData.customer_notes,
// // //       global_discount:  parseFloat(salesData.global_discount)  || 0,
// // //       shipping_charges: parseFloat(salesData.shipping_charges) || 0,
// // //       status,
// // //       items,
// // //     };
// // //   };

// // //   // =====================================================
// // //   // SAVE DRAFT
// // //   // Calls salesOrderApiProvider.createSalesOrder  (new)
// // //   //       salesOrderApiProvider.updateSalesOrder  (edit)
// // //   // =====================================================
// // //   const handleSaveDraftState = async (e) => {
// // //     e.preventDefault();
// // //     e.stopPropagation();

// // //     const payload = buildPayload("Draft");
// // //     console.log("DRAFT PAYLOAD:", payload);

// // //     setSubmitting(true);
// // //     try {
// // //       const result = orderId
// // //         ? await salesOrderApiProvider.updateSalesOrder(orderId, payload)
// // //         : await salesOrderApiProvider.createSalesOrder(payload);

// // //       console.log("DRAFT RESULT:", result);

// // //       if (result) setSalesStatus("Draft");

// // //     } catch (err) {
// // //       console.error("Save draft error:", err);
// // //       toast.error("An error occurred while saving draft.");
// // //     } finally {
// // //       setSubmitting(false);
// // //     }
// // //   };

// // //   // =====================================================
// // //   // SUBMIT
// // //   // Calls salesOrderApiProvider.createSalesOrder  (new)
// // //   //       salesOrderApiProvider.updateSalesOrder  (edit)
// // //   // =====================================================
// // //   const handleSubmitState = async (e) => {
// // //     e.preventDefault();
// // //     e.stopPropagation();

// // //     // Guard — at least one real product row
// // //     const validItems = SalesList_data.filter(
// // //       (i) => i.product_id && i.product_id !== "--"
// // //     );

// // //     if (validItems.length === 0) {
// // //       toast.error("Add at least one product before submitting");
// // //       return;
// // //     }

// // //     // Stock check — only when backend actually returned stock data
// // //     const stockDataAvailable = validItems.some((i) => Number(i.stock_level) > 0);
// // //     if (stockDataAvailable) {
// // //       const isStockOK = validItems.every(
// // //         ({ quantity = 0, stock_level = 0 }) =>
// // //           Number(stock_level) >= Number(quantity)
// // //       );
// // //       if (!isStockOK) {
// // //         setStockAlert(true);
// // //         return;
// // //       }
// // //     }

// // //     const payload = buildPayload("Submitted");
// // //     console.log("SUBMIT PAYLOAD:", payload);

// // //     setSubmitting(true);
// // //     try {
// // //       const result = orderId
// // //         ? await salesOrderApiProvider.updateSalesOrder(orderId, payload)
// // //         : await salesOrderApiProvider.createSalesOrder(payload);

// // //       console.log("SUBMIT RESULT:", result);

// // //       if (result) setSalesStatus("Submitted");

// // //     } catch (err) {
// // //       console.error("Submit error:", err);
// // //       toast.error("An error occurred while submitting the order.");
// // //     } finally {
// // //       setSubmitting(false);
// // //     }
// // //   };

// // //   // =====================================================
// // //   // CANCEL ORDER
// // //   // =====================================================
// // //   const handleCancelOrderState = async (e) => {
// // //     e.preventDefault();
// // //     e.stopPropagation();

// // //     if (!window.confirm("Are you sure you want to Cancel Order?")) return;

// // //     const payload = buildPayload("Cancelled");
// // //     console.log("CANCEL PAYLOAD:", payload);

// // //     setSubmitting(true);
// // //     try {
// // //       const result = orderId
// // //         ? await salesOrderApiProvider.updateSalesOrder(orderId, payload)
// // //         : await salesOrderApiProvider.createSalesOrder(payload);

// // //       if (result) setSalesStatus("Cancelled");

// // //     } catch (err) {
// // //       console.error("Cancel order error:", err);
// // //       toast.error("An error occurred while cancelling the order.");
// // //     } finally {
// // //       setSubmitting(false);
// // //     }
// // //   };

// // //   // =====================================================
// // //   // CALCULATIONS
// // //   // =====================================================
// // //   function productTotal(ind) {
// // //     const data      = SalesList_data[ind];
// // //     const quantity  = parseFloat(data?.quantity)   || 0;
// // //     const unitPrice = parseFloat(data?.unit_price) || 0;
// // //     const discount  = parseFloat(data?.discount)   || 0;
// // //     const tax       = parseFloat(data?.tax)        || 0;
// // //     const subtotal  = quantity * unitPrice;
// // //     const taxAmount = (subtotal * tax) / 100;
// // //     const taxed     = subtotal + taxAmount;
// // //     return (taxed - (taxed * discount) / 100).toFixed(2);
// // //   }

// // //   function calculateSubtotal() {
// // //     return SalesList_data.reduce((acc, data) => {
// // //       const quantity  = parseFloat(data?.quantity)   || 0;
// // //       const unitPrice = parseFloat(data?.unit_price) || 0;
// // //       const discount  = parseFloat(data?.discount)   || 0;
// // //       const tax       = parseFloat(data?.tax)        || 0;
// // //       const subtotal  = quantity * unitPrice;
// // //       const taxAmount = (subtotal * tax) / 100;
// // //       const taxed     = subtotal + taxAmount;
// // //       return acc + taxed - (taxed * discount) / 100;
// // //     }, 0).toFixed(2);
// // //   }

// // //   function calculateTaxSummery() {
// // //     return SalesList_data.reduce((acc, data) => {
// // //       const quantity  = parseFloat(data?.quantity)   || 0;
// // //       const unitPrice = parseFloat(data?.unit_price) || 0;
// // //       const tax       = parseFloat(data?.tax)        || 0;
// // //       return acc + (quantity * unitPrice * tax) / 100;
// // //     }, 0).toFixed(2);
// // //   }

// // //   function calculateGrandTotal() {
// // //     const subtotal = parseFloat(calculateSubtotal()) || 0;
// // //     const discount = (subtotal * (parseFloat(salesData.global_discount) || 0)) / 100;
// // //     const shipping = parseFloat(salesData.shipping_charges) || 0;
// // //     return (subtotal - discount + shipping).toFixed(2);
// // //   }

// // //   function roundedGrandTotal() {
// // //     const total = parseFloat(calculateGrandTotal());
// // //     return total % 1 > 0.5 ? Math.ceil(total) : Math.floor(total);
// // //   }

// // //   function roundedvalue() {
// // //     return (roundedGrandTotal() - parseFloat(calculateGrandTotal())).toFixed(2);
// // //   }

// // //   function deleteSalesProduct(ind) {
// // //     if (!window.confirm("Are you sure you want to delete this Product?")) return;
// // //     setSalesList_data((prev) => prev.filter((_, i) => i !== ind));
// // //     setnumOfSalesList((prev) => prev - 1);
// // //     toast.success("Product Item deleted!");
// // //   }

// // //   // =====================================================
// // //   // RENDER
// // //   // =====================================================
// // //   return (
// // //     <>
// // //       {stockAlert && (
// // //         <div className="createNewSales-btn">
// // //           <CreatNewSalesStockAlert
// // //             setStockAlert={setStockAlert}
// // //             setSalesStatus={setSalesStatus}
// // //             purchase_order={purchase_order}
// // //             SalesList_data={SalesList_data}
// // //             setCurrentPage={setCurrentPage}
// // //           />
// // //         </div>
// // //       )}

// // //       <div className={`createNewSales-container ${stockAlert ? "createNewSales-blur" : ""}`}>
// // //         <form onSubmit={handleSubmitState}>

// // //           {/* ── HEADER ──────────────────────────────────────── */}
// // //           <div className="createNewSales-head">
// // //             <nav>
// // //               {salesStatus !== "" && (
// // //                 <svg
// // //                   className={
// // //                     purchase_order === "Purchase Ordered"      ? "createNewSales-purchase-order-tag"
// // //                     : purchase_order === "Purchase Ordered(PP)"? "createNewSales-purchase-orderPP-tag"
// // //                     : purchase_order === "Ready to Submit"     ? "createNewSales-readyTOsubmit-tag"
// // //                     : "createNewSales-purchase-tag"
// // //                   }
// // //                   xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"
// // //                 >
// // //                   <path fillRule="evenodd" clipRule="evenodd" d="M0.123245 10.8159C0.410245 11.8189 1.18325 12.5909 2.72825 14.1359L4.55825 15.9659C7.24825 18.6569 8.59225 19.9999 10.2622 19.9999C11.9332 19.9999 13.2772 18.6559 15.9662 15.9669C18.6562 13.2769 20.0002 11.9329 20.0002 10.2619C20.0002 8.59187 18.6562 7.24687 15.9672 4.55787L14.1372 2.72787C12.5912 1.18287 11.8192 0.409866 10.8162 0.122866C9.81324 -0.165134 8.74825 0.0808662 6.61925 0.572866L5.39125 0.855866C3.59925 1.26887 2.70325 1.47587 2.08925 2.08887C1.47525 2.70187 1.27025 3.59987 0.856245 5.39087L0.572245 6.61887C0.0812454 8.74887 -0.163755 9.81287 0.123245 10.8159ZM8.12224 5.27087C8.31512 5.45687 8.469 5.67944 8.5749 5.92558C8.6808 6.17172 8.73659 6.4365 8.73902 6.70444C8.74145 6.97238 8.69046 7.23812 8.58904 7.48614C8.48763 7.73416 8.33781 7.95948 8.14833 8.14896C7.95886 8.33843 7.73354 8.48825 7.48552 8.58967C7.2375 8.69108 6.97176 8.74207 6.70382 8.73964C6.43588 8.73721 6.1711 8.68142 5.92496 8.57552C5.67882 8.46962 5.45625 8.31574 5.27025 8.12287C4.9033 7.74237 4.70039 7.23303 4.70518 6.70444C4.70998 6.17585 4.92208 5.67027 5.29587 5.29649C5.66965 4.9227 6.17523 4.7106 6.70382 4.7058C7.23241 4.70101 7.74175 4.90392 8.12224 5.27087ZM17.0502 10.0509L10.0712 17.0309C9.92973 17.1674 9.74024 17.2429 9.54359 17.2411C9.34695 17.2393 9.15887 17.1604 9.01988 17.0212C8.88089 16.8821 8.8021 16.694 8.80049 16.4973C8.79887 16.3007 8.87456 16.1113 9.01124 15.9699L15.9892 8.98987C16.1299 8.84917 16.3208 8.77013 16.5197 8.77013C16.7187 8.77013 16.9095 8.84917 17.0502 8.98987C17.1909 9.13056 17.27 9.32139 17.27 9.52037C17.27 9.71934 17.1909 9.91017 17.0502 10.0509Z" />
// // //                 </svg>
// // //               )}
// // //               <p>{orderId ? "Edit Sales Order" : "New Sales Order"}</p>
// // //               {salesStatus && (
// // //                 <h3 className={
// // //                   salesStatus === "Draft"              ? "createNewSales-Status-draft"
// // //                   : salesStatus === "Submitted"        ? "createNewSales-Status-submitted"
// // //                   : salesStatus === "Submitted(PD)"    ? "createNewSales-Status-SubmittedPD"
// // //                   : salesStatus === "Delivered"        ? "createNewSales-Status-Delivered"
// // //                   : salesStatus === "Cancelled"        ? "createNewSales-Status-Cancelled"
// // //                   : salesStatus === "Partially Delivered" ? "createNewSales-Status-partiallyDelivered"
// // //                   : ""
// // //                 }>
// // //                   Status: {salesStatus}
// // //                 </h3>
// // //               )}
// // //             </nav>
// // //             <div>
// // //               <button
// // //                 type="button"
// // //                 className={["Submitted", "Submitted(PD)"].includes(salesStatus) ? "createNewSales-active-btn" : "createNewSales-inactive-btn"}
// // //                 disabled={salesBtn.generate_delivery_note}
// // //                 onClick={() => setCurrentPage("createNewDelivery")}
// // //               >
// // //                 Generate Delivery Note
// // //               </button>
// // //               <button
// // //                 type="button"
// // //                 className={salesStatus === "Submitted" ? "createNewSales-active-btn" : "createNewSales-inactive-btn"}
// // //                 disabled={salesBtn.generate_invoice}
// // //                 onClick={() => setCurrentPage("createNewInvoice")}
// // //               >
// // //                 Generate Invoice
// // //               </button>
// // //               <div className="createNewSales-close" onClick={() => prevPage(-1)}>
// // //                 <svg className="createNewSales-circle-x-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
// // //                   <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
// // //                 </svg>
// // //                 <p>Close</p>
// // //               </div>
// // //             </div>
// // //           </div>

// // //           {/* ── LOADING OVERLAY ──────────────────────────────── */}
// // //           {loading && (
// // //             <p style={{ textAlign: "center", padding: "12px", color: "#888" }}>
// // //               Loading form data…
// // //             </p>
// // //           )}

// // //           {/* ── ORDER INFO ──────────────────────────────────── */}
// // //           <div className="createNewSales-input-container">
// // //             <div className="createNewSales-input-box">
// // //               <label htmlFor="sales_order_id">Sales Order ID (Auto Generate)</label>
// // //               <input id="sales_order_id" type="text" value={salesData.sales_order_id} placeholder="Auto Generate" disabled />
// // //             </div>
// // //             <div className="createNewSales-input-box">
// // //               <label htmlFor="order_date">Order Date<sup>*</sup></label>
// // //               <input id="order_date" value={salesData.order_date} onChange={handleSalesDataChange} type="date" required disabled={salesBtn.BtnAccess} />
// // //             </div>
// // //           </div>

// // //           <div className="createNewSales-input-container">
// // //             <div className="createNewSales-input-box">
// // //               {/* Sales Rep dropdown — populated from userApiProvider.fetchUsers() */}
// // //               <label htmlFor="sales_rep">Sales Rep<sup>*</sup></label>
// // //               <select id="sales_rep" value={salesData.sales_rep} onChange={handleSalesDataChange} required disabled={salesBtn.BtnAccess || loading}>
// // //                 <option value="">Select Sales Rep</option>
// // //                 {salesRepList.map((rep) => (
// // //                   <option key={rep.id} value={rep.id}>
// // //                     {rep.name || rep.username || rep.full_name}
// // //                   </option>
// // //                 ))}
// // //               </select>
// // //             </div>
// // //             <div className="createNewSales-input-box">
// // //               <label htmlFor="order_type">Order Type<sup>*</sup></label>
// // //               <select id="order_type" value={salesData.order_type} onChange={handleSalesDataChange} required disabled={salesBtn.BtnAccess}>
// // //                 <option value="">Select Order</option>
// // //                 <option value="Standard">Standard</option>
// // //                 <option value="Rush">Rush</option>
// // //                 <option value="Backorder">Backorder</option>
// // //               </select>
// // //             </div>
// // //           </div>

// // //           {/* ── CUSTOMER INFORMATION ────────────────────────── */}
// // //           <nav className="createNewSales-subtit">Customer Information</nav>
// // //           <div className="createNewSales-input-container">
// // //             <div className="createNewSales-input-box">
// // //               {/* Customer dropdown — populated from customerApiProvider.fetchCustomers() */}
// // //               <label htmlFor="customer">Customer Name<sup>*</sup></label>
// // //               <select id="customer" value={salesData.customer} onChange={handleSalesDataChange} required disabled={salesBtn.BtnAccess || loading}>
// // //                 <option value="">Select Customer</option>
// // //                 {customerList.map((c) => (
// // //                   <option key={c.id} value={c.id}>
// // //                     {c.customer_name || c.name}
// // //                   </option>
// // //                 ))}
// // //               </select>
// // //             </div>
// // //             <div className="createNewSales-input-box">
// // //               <label>Customer ID (Auto Generate)</label>
// // //               <input type="text" value={salesData.customer} placeholder="Auto Generate" disabled />
// // //             </div>
// // //           </div>

// // //           <div className="createNewSales-input-container">
// // //             <div className="createNewSales-input-box">
// // //               <label htmlFor="billing_address">Billing Address<sup>*</sup></label>
// // //               <input id="billing_address" value={salesData.billing_address} onChange={handleSalesDataChange} type="text" placeholder="Enter Address" required disabled={salesBtn.BtnAccess} />
// // //             </div>
// // //             <div className="createNewSales-input-box">
// // //               <label htmlFor="shipping_address">Shipping Address<sup>*</sup></label>
// // //               <input id="shipping_address" value={salesData.shipping_address} onChange={handleSalesDataChange} type="text" placeholder="Enter Address" required disabled={salesBtn.BtnAccess} />
// // //             </div>
// // //           </div>

// // //           <div className="createNewSales-input-container">
// // //             <div className="createNewSales-input-box">
// // //               <label htmlFor="email_id">Email ID<sup>*</sup></label>
// // //               <input id="email_id" value={salesData.email_id} onChange={handleSalesDataChange} type="email" placeholder="Enter Email" required disabled={salesBtn.BtnAccess} />
// // //             </div>
// // //             <div className="createNewSales-input-box">
// // //               <label htmlFor="phone_number">Phone Number<sup>*</sup></label>
// // //               <input id="phone_number" value={salesData.phone_number} onChange={handleSalesDataChange} type="number" placeholder="Enter Phone" required disabled={salesBtn.BtnAccess} />
// // //             </div>
// // //           </div>

// // //           {/* ── PAYMENT DETAILS ─────────────────────────────── */}
// // //           <nav className="createNewSales-subtit">Payment Details</nav>
// // //           <div className="createNewSales-input-container">
// // //             <div className="createNewSales-input-box">
// // //               <label htmlFor="payment_method">Payment Method</label>
// // //               <select id="payment_method" value={salesData.payment_method} onChange={handleSalesDataChange} disabled={salesBtn.BtnAccess}>
// // //                 <option value="">Select Payment</option>
// // //                 <option value="Credit Card">Credit Card</option>
// // //                 <option value="Bank Transfer">Bank Transfer</option>
// // //                 <option value="COD">COD</option>
// // //                 <option value="PayPal">PayPal</option>
// // //               </select>
// // //             </div>
// // //             <div className="createNewSales-input-box">
// // //               <label htmlFor="currency">Currency<sup>*</sup></label>
// // //               <select id="currency" value={salesData.currency} onChange={handleSalesDataChange} required disabled={salesBtn.BtnAccess}>
// // //                 <option value="">Select Currency</option>
// // //                 <option value="USD">USD</option>
// // //                 <option value="EUR">EUR</option>
// // //                 <option value="INR">INR</option>
// // //                 <option value="GBP">GBP</option>
// // //                 <option value="SGD">SGD</option>
// // //               </select>
// // //             </div>
// // //           </div>

// // //           <div className="createNewSales-input-container">
// // //             <div className="createNewSales-input-box">
// // //               <label htmlFor="due_date">Due Date</label>
// // //               <input id="due_date" value={salesData.due_date} onChange={handleSalesDataChange} type="date" disabled={salesBtn.BtnAccess} />
// // //             </div>
// // //             <div className="createNewSales-input-box">
// // //               <label htmlFor="terms_conditions">Terms & Conditions</label>
// // //               <input id="terms_conditions" value={salesData.terms_conditions} onChange={handleSalesDataChange} type="text" placeholder="Enter Terms & Conditions" disabled={salesBtn.BtnAccess} />
// // //             </div>
// // //           </div>

// // //           {/* ── LOGISTICS & NOTES ───────────────────────────── */}
// // //           <nav className="createNewSales-subtit">Logistics & Notes</nav>
// // //           <div className="createNewSales-input-container">
// // //             <div className="createNewSales-input-box">
// // //               <label htmlFor="shipping_method">Shipping Method</label>
// // //               <select id="shipping_method" value={salesData.shipping_method} onChange={handleSalesDataChange} disabled={salesBtn.BtnAccess}>
// // //                 <option value="">Select Shipping</option>
// // //                 <option value="DHL">DHL</option>
// // //                 <option value="FedEx">FedEx</option>
// // //                 <option value="UPS">UPS</option>
// // //                 <option value="Local Courier">Local Courier</option>
// // //               </select>
// // //             </div>
// // //             <div className="createNewSales-input-box">
// // //               <label htmlFor="expected_delivery">Expected Delivery</label>
// // //               <input id="expected_delivery" value={salesData.expected_delivery} onChange={handleSalesDataChange} type="date" disabled={salesBtn.BtnAccess} />
// // //             </div>
// // //           </div>

// // //           <div className="createNewSales-input-container">
// // //             <div className="createNewSales-input-box">
// // //               <label htmlFor="tracking_number">Tracking Number</label>
// // //               <input id="tracking_number" value={salesData.tracking_number} onChange={handleSalesDataChange} type="text" placeholder="Enter tracking number" disabled={salesBtn.BtnAccess} />
// // //             </div>
// // //             <div className="createNewSales-input-box">
// // //               <label htmlFor="internal_notes">Internal Notes</label>
// // //               <input id="internal_notes" value={salesData.internal_notes} onChange={handleSalesDataChange} type="text" placeholder="Enter Internal Notes" disabled={salesBtn.BtnAccess} />
// // //             </div>
// // //           </div>

// // //           <div className="createNewSales-input-container">
// // //             <div className="createNewSales-input-box">
// // //               <label htmlFor="customer_notes">Customer Notes</label>
// // //               <input id="customer_notes" value={salesData.customer_notes} onChange={handleSalesDataChange} type="text" placeholder="Enter Customer Notes" disabled={salesBtn.BtnAccess} />
// // //             </div>
// // //           </div>

// // //           {/* ── ORDER LINE ITEMS ────────────────────────────── */}
// // //           <nav className="createNewSales-subtit">Order Line Items<sup>*</sup></nav>
// // //           <div className="createNewSales-table-container">
// // //             <table>
// // //               <thead className="createNewSales-table-head">
// // //                 <tr>
// // //                   <th id="createNewSales-table-smallwidth">#</th>
// // //                   <th>Product Name</th>
// // //                   <th id="createNewSales-table-minwidth">Product ID</th>
// // //                   <th id="createNewSales-table-minwidth">In Stock</th>
// // //                   <th>Quantity</th>
// // //                   <th>UOM</th>
// // //                   <th>Unit Price</th>
// // //                   <th>Tax (%)</th>
// // //                   <th>Discount (%)</th>
// // //                   <th>Total</th>
// // //                   <th>Action</th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody className="createNewSales-table-body">
// // //                 {[...Array(numOfSalesList)].map((_, ind) => (
// // //                   <SalesListItems
// // //                     key={SalesList_data[ind]?.unique_key ?? ind}
// // //                     unique_key={ind}
// // //                     // productList is populated from productApiProvider.fetchProducts()
// // //                     sales_table_data={productList}
// // //                     setSales_table_data={setProductList}
// // //                     setSalesList_data={setSalesList_data}
// // //                     productTotal={productTotal}
// // //                     deleteSalesProduct={deleteSalesProduct}
// // //                     salesData={salesData}
// // //                     btnAccess={salesBtn.BtnAccess}
// // //                   />
// // //                 ))}
// // //                 <tr>
// // //                   <td></td>
// // //                   <td>
// // //                     <button
// // //                       type="button"
// // //                       disabled={salesBtn.BtnAccess}
// // //                       onClick={() => {
// // //                         setSalesList_data((prev) => [...prev, { unique_key: numOfSalesList }]);
// // //                         setnumOfSalesList((prev) => prev + 1);
// // //                       }}
// // //                     >
// // //                       + Add Item
// // //                     </button>
// // //                   </td>
// // //                 </tr>
// // //               </tbody>
// // //             </table>
// // //           </div>

// // //           {/* ── ORDER SUMMARY ───────────────────────────────── */}
// // //           <nav className="createNewSales-subtit">Order Summary</nav>
// // //           <div className="createNewSales-totals-container">
// // //             <nav><h5>Subtotal</h5><p>{calculateSubtotal()}</p></nav>
// // //             <nav>
// // //               <h5>Global Discount (%)</h5>
// // //               <input type="number" value={salesData.global_discount}
// // //                 onChange={(e) => setSalesData((prev) => ({ ...prev, global_discount: parseFloat(e.target.value) || 0 }))}
// // //                 disabled={salesBtn.BtnAccess} />
// // //             </nav>
// // //             <nav><h5>Tax Summary</h5><p>{calculateTaxSummery()}</p></nav>
// // //             <nav>
// // //               <h5>
// // //                 Shipping Charges
// // //                 {salesData.currency === "INR" && <span> (₹)</span>}
// // //                 {salesData.currency === "USD" && <span> ($)</span>}
// // //                 {salesData.currency === "GBP" && <span> (£)</span>}
// // //                 {salesData.currency === "SGD" && <span> (S$)</span>}
// // //                 {salesData.currency === "EUR" && <span> (€)</span>}
// // //               </h5>
// // //               <input type="number" value={salesData.shipping_charges}
// // //                 onChange={(e) => setSalesData((prev) => ({ ...prev, shipping_charges: parseFloat(e.target.value) || 0 }))}
// // //                 disabled={salesBtn.BtnAccess} />
// // //             </nav>
// // //             <nav><h5>Rounding Adjustment</h5><p>{roundedvalue()}</p></nav>
// // //             <nav className="createNewSales-totals-container-bg">
// // //               <h5>Grand Total</h5>
// // //               <p>
// // //                 {salesData.currency === "INR" && <span>₹</span>}
// // //                 {salesData.currency === "USD" && <span>$</span>}
// // //                 {salesData.currency === "GBP" && <span>£</span>}
// // //                 {salesData.currency === "SGD" && <span>S$</span>}
// // //                 {salesData.currency === "EUR" && <span>€</span>}
// // //                 {roundedGrandTotal()}
// // //               </p>
// // //             </nav>
// // //           </div>

// // //           {/* ── COMMENTS / HISTORY ──────────────────────────── */}
// // //           <div className="createNewSales-hub-container">
// // //             <div className="createNewSales-hub-head">
// // //               <p className={feacher.showChat ? "createNewSales-hub-head-bg-black" : "createNewSales-hub-head-tit"}
// // //                 onClick={() => setFeacher({ showChat: true, showHistory: false })}>Comments</p>
// // //               <p className={feacher.showHistory ? "createNewSales-hub-head-bg-black" : "createNewSales-hub-head-tit"}
// // //                 onClick={() => setFeacher({ showChat: false, showHistory: true })}>History</p>
// // //             </div>
// // //             <div className="createNewSales-hub-body">
// // //               {feacher.showChat    && <CreateNewSalesComment />}
// // //               {feacher.showHistory && <CreateNewSalesHistory />}
// // //             </div>
// // //           </div>

// // //           {/* ── ACTION BUTTONS ──────────────────────────────── */}
// // //           <div className="createNewSales-btn-container">
// // //             <button
// // //               type="button"
// // //               style={{ width: "max-content" }}
// // //               className={["Submitted", "Submitted(PD)", "Cancelled"].includes(salesStatus) ? "createNewSales-order-active-btn" : "createNewSales-inactive-btn"}
// // //               onClick={handleCancelOrderState}
// // //               disabled={salesBtn.cancel_order || submitting}
// // //             >
// // //               {salesStatus === "Cancelled" ? "Cancelled" : "Cancel Order"}
// // //             </button>

// // //             <nav>
// // //               <button type="button" className="createNewSales-cancel-btn" onClick={() => prevPage(-1)} disabled={salesBtn.cancel}>
// // //                 Cancel
// // //               </button>

// // //               {/* SAVE DRAFT → salesOrderApiProvider.createSalesOrder / updateSalesOrder */}
// // //               <button
// // //                 type="button"
// // //                 className={["Draft", ""].includes(salesStatus) ? "createNewSales-active-btn" : "createNewSales-completed-btn"}
// // //                 onClick={handleSaveDraftState}
// // //                 disabled={salesBtn.save_draft || submitting}
// // //               >
// // //                 {submitting ? "Saving..." : "Save Draft"}
// // //               </button>

// // //               {/* SUBMIT → salesOrderApiProvider.createSalesOrder / updateSalesOrder */}
// // //               <button
// // //                 type="submit"
// // //                 className={["Draft", "Submitted(PD)", ""].includes(salesStatus) ? "createNewSales-active-btn" : "createNewSales-completed-btn"}
// // //                 disabled={salesBtn.submit || submitting}
// // //               >
// // //                 {submitting ? "Submitting..." : "Submit"}
// // //               </button>

// // //               <button
// // //                 type="button"
// // //                 className={
// // //                   salesStatus === "" ||
// // //                   salesStatus === "Submitted" ||
// // //                   (salesStatus === "Submitted(PD)" && purchase_order !== "Purchase Ordered") ||
// // //                   (salesStatus === "Draft"         && purchase_order !== "Purchase Ordered")
// // //                     ? "createNewSales-active-btn" : "createNewSales-completed-btn"
// // //                 }
// // //                 disabled={salesBtn.Generate_po || submitting}
// // //                 onClick={() => setCurrentPage("createNewPurchase")}
// // //               >
// // //                 Generate (PO)
// // //               </button>

// // //               <svg className={salesStatus !== "" ? "createNewSales-pdf-mail-activelogo" : "createNewSales-pdf-mail-futurelogo"}
// // //                 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 24" fill="none">
// // //                 <path fillRule="evenodd" clipRule="evenodd" d="M0.600098 2.4C0.600098 1.76348 0.852954 1.15303 1.30304 0.702944C1.75313 0.252856 2.36358 0 3.0001 0L16.1313 0L21.4001 5.2688V21.6C21.4001 22.2365 21.1472 22.847 20.6972 23.2971C20.2471 23.7471 19.6366 24 19.0001 24H3.0001C2.36358 24 1.75313 23.7471 1.30304 23.2971C0.852954 22.847 0.600098 22.2365 0.600098 21.6V2.4ZM4.6001 9.6H2.2001V17.6H3.8001V14.4H4.6001C5.23662 14.4 5.84707 14.1471 6.29715 13.6971C6.74724 13.247 7.0001 12.6365 7.0001 12C7.0001 11.3635 6.74724 10.753 6.29715 10.3029C5.84707 9.85286 5.23662 9.6 4.6001 9.6ZM11.0001 9.6H8.6001V17.6H11.0001C11.6366 17.6 12.2471 17.3471 12.6972 16.8971C13.1472 16.447 13.4001 15.8365 13.4001 15.2V12C13.4001 11.3635 13.1472 10.753 12.6972 10.3029C12.2471 9.85286 11.6366 9.6 11.0001 9.6ZM15.0001 17.6V9.6H19.8001V11.2H16.6001V12.8H18.2001V14.4H16.6001V17.6H15.0001Z" />
// // //               </svg>

// // //               <svg className={salesStatus !== "" ? "createNewSales-pdf-mail-activelogo" : "createNewSales-pdf-mail-futurelogo"}
// // //                 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 16" fill="none">
// // //                 <path d="M2 16C1.45 16 0.979333 15.8043 0.588 15.413C0.196667 15.0217 0.000666667 14.5507 0 14V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196666 1.45067 0.000666667 2 0H18C18.55 0 19.021 0.196 19.413 0.588C19.805 0.98 20.0007 1.45067 20 2V14C20 14.55 19.8043 15.021 19.413 15.413C19.0217 15.805 18.5507 16.0007 18 16H2ZM10 8.825C10.0833 8.825 10.171 8.81233 10.263 8.787C10.355 8.76167 10.4423 8.72433 10.525 8.675L17.6 4.25C17.7333 4.16667 17.8333 4.06267 17.9 3.938C17.9667 3.81333 18 3.67567 18 3.525C18 3.19167 17.8583 2.94167 17.575 2.775C17.2917 2.60833 17 2.61667 16.7 2.8L10 7L3.3 2.8C3 2.61667 2.70833 2.61267 2.425 2.788C2.14167 2.96333 2 3.209 2 3.525C2 3.69167 2.03333 3.83767 2.1 3.963C2.16667 4.08833 2.26667 4.184 2.4 4.25L9.475 8.675C9.55833 8.725 9.646 8.76267 9.738 8.788C9.83 8.81333 9.91733 8.82567 10 8.825Z" />
// // //               </svg>
// // //             </nav>
// // //           </div>

// // //         </form>
// // //       </div>
// // //     </>
// // //   );
// // // }
// // import React, { useState, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import "./createNewSales.css";
// // import SalesListItems from "./salesListItems";
// // import CreatNewSalesStockAlert from "./creatNewSalesStockAlert";
// // import CreateNewSalesHistory from "./createNewSalesHistory";
// // import CreateNewSalesComment from "./createNewSalesComment";
// // import { toast } from "react-toastify";
// // import salesOrderApiProvider from "../api-providers/salesOrderApiProvider";

// // // ─────────────────────────────────────────────────────────────
// // // Helper: map API response → local salesData shape
// // // ─────────────────────────────────────────────────────────────
// // function mapApiOrderToForm(order) {
// //   return {
// //     sales_order_id: order.sales_order_id || "",
// //     order_date: order.order_date || "",
// //     sales_rep: order.sales_rep || "",
// //     order_type: order.order_type || "",
// //     customer_name: order.customer
// //       ? `${order.customer.first_name} ${order.customer.last_name || ""}`.trim()
// //       : "",
// //     customer_id: order.customer?.customer_id || "",
// //     billing_address: order.customer?.billing_address || "",
// //     shipping_address: order.customer?.shipping_address || "",
// //     email_id: order.customer?.email || "",
// //     phone_number: order.customer?.phone_number || "",
// //     payment_method: order.payment_method || "",
// //     currency: order.currency || "",
// //     due_date: order.due_date || "",
// //     terms_conditions: order.terms_conditions || "",
// //     shipping_method: order.shipping_method || "",
// //     expected_delivery: order.expected_delivery || "",
// //     tracking_number: order.tracking_number || "",
// //     internal_notes: order.internal_notes || "",
// //     customer_notes: order.customer_notes || "",
// //     global_discount: parseFloat(order.global_discount) || 0,
// //     shipping_charges: parseFloat(order.shipping_charges) || 0,
// //   };
// // }

// // // ─────────────────────────────────────────────────────────────
// // // Helper: map API items → local SalesList_data shape
// // // ─────────────────────────────────────────────────────────────
// // function mapApiItemsToList(items = []) {
// //   return items.map((item, index) => ({
// //     unique_key: index,
// //     // IDs needed for PATCH
// //     item_id: item.id,
// //     product: item.product,
// //     product_id: item.product_id_display,
// //     product_name: item.product_name,
// //     uom: item.uom,
// //     unit_price: item.unit_price,
// //     discount: item.discount,
// //     tax: item.tax_rate,
// //     tax_id: item.tax,
// //     quantity: item.quantity,
// //     stock_level: 999, // will be refreshed from product master if needed
// //     total: item.total,
// //   }));
// // }

// // // ─────────────────────────────────────────────────────────────
// // // Helper: build API payload from local state
// // // ─────────────────────────────────────────────────────────────
// // function buildPayload(salesData, SalesList_data, status) {
// //   return {
// //     customer: salesData._customerId, // raw numeric id stored separately
// //     sales_rep: salesData._salesRepId || null,
// //     order_date: salesData.order_date,
// //     order_type: salesData.order_type,
// //     payment_method: salesData.payment_method,
// //     currency: salesData.currency,
// //     due_date: salesData.due_date || null,
// //     terms_conditions: salesData.terms_conditions,
// //     shipping_method: salesData.shipping_method,
// //     expected_delivery: salesData.expected_delivery || null,
// //     tracking_number: salesData.tracking_number,
// //     internal_notes: salesData.internal_notes,
// //     customer_notes: salesData.customer_notes,
// //     global_discount: salesData.global_discount,
// //     shipping_charges: salesData.shipping_charges,
// //     status: status || undefined,
// //     items: SalesList_data.filter((r) => r.product).map((row) => ({
// //       ...(row.item_id ? { id: row.item_id } : {}),
// //       product: row.product,
// //       uom: row.uom,
// //       unit_price: row.unit_price,
// //       discount: row.discount || 0,
// //       tax: row.tax_id,
// //       quantity: row.quantity,
// //     })),
// //   };
// // }

// // // ═════════════════════════════════════════════════════════════
// // // COMPONENT
// // // Props:
// // //   setCurrentPage  – page router setter
// // //   editOrderId     – if set, component runs in EDIT mode
// // // ═════════════════════════════════════════════════════════════
// // export default function CreateNewSales({ setCurrentPage, editOrderId = null }) {
// //   const isEditMode = Boolean(editOrderId);

// //   const [salesStatus, setSalesStatus] = useState("");
// //   const [isLoading, setIsLoading] = useState(isEditMode); // loading spinner for edit fetch
// //   const [isSaving, setIsSaving] = useState(false);

// //   const [feacher, setFeacher] = useState({ showChat: true, showHistory: false });

// //   const prevPage = useNavigate();
// //   const [prevsalesData, setprevsalesData] = useState([]); // customer list
// //   const [sales_table_data, setSales_table_data] = useState([]); // product master list
// //   const [sales_rep, setSales_rep] = useState([]);
// //   const [purchase_order, setPurchase_order] = useState("");

// //   // history / comments fetched from API (edit mode)
// //   const [orderHistory, setOrderHistory] = useState([]);
// //   const [orderComments, setOrderComments] = useState([]);

// //   // stock alert overlay
// //   const [stockAlert, setStockAlert] = useState(false);

// //   // numeric DB id for edit (needed for PATCH)
// //   const [dbOrderId, setDbOrderId] = useState(null);

// //   const [salesData, setSalesData] = useState({
// //     sales_order_id: "",
// //     order_date: "",
// //     sales_rep: "",
// //     order_type: "",
// //     customer_name: "",
// //     customer_id: "",
// //     billing_address: "",
// //     shipping_address: "",
// //     email_id: "",
// //     phone_number: "",
// //     payment_method: "",
// //     currency: "",
// //     due_date: "",
// //     terms_conditions: "",
// //     shipping_method: "",
// //     expected_delivery: "",
// //     tracking_number: "",
// //     internal_notes: "",
// //     customer_notes: "",
// //     global_discount: 0,
// //     shipping_charges: 0,
// //     // hidden helpers – not rendered directly
// //     _customerId: null,
// //     _salesRepId: null,
// //   });

// //   const [salesBtn, setSalesBtn] = useState({
// //     BtnAccess: false,
// //     cancel: false,
// //     cancel_order: true,
// //     save_draft: false,
// //     submit: false,
// //     Generate_po: false,
// //     pdf: true,
// //     email: true,
// //     generate_delivery_note: true,
// //     generate_invoice: true,
// //   });

// //   const [numOfSalesList, setnumOfSalesList] = useState(1);
// //   const [SalesList_data, setSalesList_data] = useState([{ unique_key: 0 }]);

// //   // ───────────────────────────────────────────────────────────
// //   // MOCK product / customer / rep master (replace with real API)
// //   // ───────────────────────────────────────────────────────────
// //   const salesFromApi = {
// //     prevsalesData: [
// //       { customer_name: "Sans", customer_id: "ABC001", billing_address: "123, A colony,Chennai", shipping_address: "123, B colony,Chennai", email_id: "ASD@gmail.com", phone_number: "1234567890" },
// //       { customer_name: "Mandy", customer_id: "ABC002", billing_address: "123, A colony,madurai", shipping_address: "123, B colony,AP", email_id: "Mandy@gmail.com", phone_number: "8838511968" },
// //     ],
// //     sales_table_data: [
// //       { product_id: "PRO001", product_name: "E-shirt", stock_level: "50", uom: ["Set (5)", "Box (5)"], unit_price: "120", discount: "5", tax: ["18", "12"] },
// //       { product_id: "PRO002", product_name: "M-shirt", stock_level: "40", uom: ["Set (5)", "Box (5)"], unit_price: "130", discount: "5", tax: ["18", "12"] },
// //     ],
// //     sales_rep: ["Sans", "rose", "Mandy"],
// //   };

// //   // ───────────────────────────────────────────────────────────
// //   // INIT: load master data + (if edit) fetch order
// //   // ───────────────────────────────────────────────────────────
// //   useEffect(() => {
// //     setprevsalesData(salesFromApi.prevsalesData);
// //     setSales_table_data(salesFromApi.sales_table_data);
// //     setSales_rep(salesFromApi.sales_rep);

// //     if (isEditMode) {
// //       loadOrderForEdit(editOrderId);
// //     }
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   async function loadOrderForEdit(orderId) {
// //     setIsLoading(true);
// //     try {
// //       const res = await salesOrderApiProvider.fetchSalesOrderById(orderId);
// //       if (!res) {
// //         toast.error("Failed to load order for editing");
// //         return;
// //       }

// //       // Support both response shapes:
// //       // { id, sales_order_id, ... }  OR  { data: { id, ... } }
// //       const order = res?.data || res;

// //       setDbOrderId(order.id);
// //       setSalesStatus(order.status || "");

// //       // ── form fields ──────────────────────────────────────
// //       const formData = mapApiOrderToForm(order);
// //       // stash numeric IDs for payload building
// //       formData._customerId = order.customer?.id || null;
// //       formData._salesRepId = order.sales_rep_id || null;
// //       setSalesData(formData);

// //       // ── line items ───────────────────────────────────────
// //       if (order.items?.length > 0) {
// //         const mapped = mapApiItemsToList(order.items);
// //         setSalesList_data(mapped);
// //         setnumOfSalesList(mapped.length);
// //       } else {
// //         setSalesList_data([{ unique_key: 0 }]);
// //         setnumOfSalesList(1);
// //       }

// //       // ── history & comments ───────────────────────────────
// //       setOrderHistory(order.history || []);
// //       setOrderComments(order.comments || []);

// //       // ── purchase order tag ───────────────────────────────
// //       setPurchase_order(order.purchase_order_status || "");
// //     } catch (err) {
// //       console.error("Error loading order:", err);
// //       toast.error("Unexpected error loading order");
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   }

// //   // ───────────────────────────────────────────────────────────
// //   // Auto-fill customer fields when customer dropdown changes
// //   // ───────────────────────────────────────────────────────────
// //   const handleSalesDataChange = (e) => {
// //     setSalesData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
// //   };

// //   useEffect(() => {
// //     const selected = salesData.customer_name;
// //     if (!selected) return;

// //     const customer = prevsalesData.find((ele) => ele.customer_name === selected);
// //     if (customer) {
// //       setSalesData((prev) => ({
// //         ...prev,
// //         customer_id: customer.customer_id,
// //         billing_address: customer.billing_address,
// //         shipping_address: customer.shipping_address,
// //         email_id: customer.email_id,
// //         phone_number: customer.phone_number,
// //       }));
// //     }
// //   }, [salesData.customer_name, prevsalesData]);

// //   // ───────────────────────────────────────────────────────────
// //   // Button access rules (same logic as before)
// //   // ───────────────────────────────────────────────────────────
// //   useEffect(() => {
// //     if (salesStatus === "") {
// //       setSalesBtn((prev) => ({ ...prev, BtnAccess: false }));
// //       return;
// //     }
// //     switch (salesStatus) {
// //       case "Draft":
// //         setSalesBtn((prev) => ({
// //           ...prev,
// //           BtnAccess: false,
// //           cancel: false,
// //           cancel_order: true,
// //           save_draft: false,
// //           submit: false,
// //           Generate_po: purchase_order === "Purchase Ordered",
// //           pdf: false,
// //           email: false,
// //           generate_delivery_note: true,
// //           generate_invoice: true,
// //         }));
// //         break;
// //       case "Submitted(PD)":
// //         setSalesBtn((prev) => ({
// //           ...prev,
// //           cancel: false,
// //           cancel_order: false,
// //           save_draft: true,
// //           submit: false,
// //           Generate_po: purchase_order === "Purchase Ordered",
// //           pdf: false,
// //           email: false,
// //           generate_delivery_note: false,
// //           generate_invoice: true,
// //         }));
// //         break;
// //       case "Submitted":
// //         setSalesBtn((prev) => ({
// //           ...prev,
// //           cancel: false,
// //           cancel_order: false,
// //           save_draft: true,
// //           submit: true,
// //           Generate_po: false,
// //           pdf: false,
// //           email: false,
// //           generate_delivery_note: false,
// //           generate_invoice: false,
// //           BtnAccess: true,
// //         }));
// //         break;
// //       case "Cancelled":
// //         setSalesBtn((prev) => ({
// //           ...prev,
// //           cancel: false,
// //           cancel_order: true,
// //           save_draft: true,
// //           submit: true,
// //           Generate_po: true,
// //           pdf: false,
// //           email: false,
// //           generate_delivery_note: true,
// //           generate_invoice: true,
// //         }));
// //         break;
// //       default:
// //         setSalesBtn((prev) => ({ ...prev, BtnAccess: false }));
// //     }
// //   }, [salesStatus, purchase_order]);

// //   // ───────────────────────────────────────────────────────────
// //   // SAVE DRAFT
// //   // ───────────────────────────────────────────────────────────
// //   const handleSaveDraftState = async (e) => {
// //     e.preventDefault();
// //     setIsSaving(true);
// //     try {
// //       const payload = buildPayload(salesData, SalesList_data, "Draft");

// //       let result;
// //       if (isEditMode && dbOrderId) {
// //         result = await salesOrderApiProvider.updateSalesOrder(dbOrderId, payload);
// //       } else {
// //         result = await salesOrderApiProvider.createSalesOrder(payload);
// //         if (result?.id) setDbOrderId(result.id);
// //       }

// //       if (result) setSalesStatus("Draft");
// //     } finally {
// //       setIsSaving(false);
// //     }
// //   };

// //   // ───────────────────────────────────────────────────────────
// //   // SUBMIT
// //   // ───────────────────────────────────────────────────────────
// //   const handleSubmitState = async (e) => {
// //     e.preventDefault();

// //     if (SalesList_data.filter((r) => r.product).length === 0) {
// //       toast.error("Add at least one product before submitting");
// //       return;
// //     }

// //     const isStockOK = SalesList_data.every(
// //       ({ quantity = 0, stock_level = 0 }) =>
// //         Number(stock_level) > 0 && Number(stock_level) >= Number(quantity)
// //     );

// //     if (!isStockOK) {
// //       setStockAlert(true);
// //       return;
// //     }

// //     setIsSaving(true);
// //     try {
// //       // 1. Save / update the order first
// //       const payload = buildPayload(salesData, SalesList_data);
// //       let savedOrder;

// //       if (isEditMode && dbOrderId) {
// //         savedOrder = await salesOrderApiProvider.updateSalesOrder(dbOrderId, payload);
// //       } else {
// //         savedOrder = await salesOrderApiProvider.createSalesOrder(payload);
// //         if (savedOrder?.id) setDbOrderId(savedOrder.id);
// //       }

// //       if (!savedOrder) return;

// //       const targetId = savedOrder.id || dbOrderId;

// //       // 2. Fire the submit action
// //       const actionRes = await salesOrderApiProvider.salesOrderAction(targetId, "submit");

// //       if (actionRes?.status === "Submitted" || actionRes?.message?.toLowerCase().includes("submitted")) {
// //         setSalesStatus("Submitted");
// //         toast.success("Sales order submitted successfully");
// //       } else if (actionRes?.error_code === "insufficient_stock") {
// //         setStockAlert(true);
// //       } else {
// //         toast.error(actionRes?.message || "Submission failed");
// //       }
// //     } finally {
// //       setIsSaving(false);
// //     }
// //   };

// //   // ───────────────────────────────────────────────────────────
// //   // CANCEL ORDER
// //   // ───────────────────────────────────────────────────────────
// //   const handleCancelOrderState = async (e) => {
// //     e.preventDefault();
// //     const ok = window.confirm("Are you sure you want to Cancel Order?");
// //     if (!ok) return;

// //     if (dbOrderId) {
// //       setIsSaving(true);
// //       try {
// //         const res = await salesOrderApiProvider.salesOrderAction(dbOrderId, "cancel");
// //         if (res) {
// //           setSalesStatus("Cancelled");
// //           toast.success("Sales order cancelled");
// //         }
// //       } finally {
// //         setIsSaving(false);
// //       }
// //     } else {
// //       // Not yet saved – just clear local state
// //       setSalesStatus("Cancelled");
// //       toast.success("Sales order cancelled");
// //     }
// //   };

// //   // ───────────────────────────────────────────────────────────
// //   // GENERATE DELIVERY NOTE
// //   // ───────────────────────────────────────────────────────────
// //   const handleGenerateDeliveryNote = async (e) => {
// //     e.preventDefault();
// //     if (!dbOrderId) {
// //       toast.error("Save the order before generating a delivery note");
// //       return;
// //     }
// //     setIsSaving(true);
// //     try {
// //       const res = await salesOrderApiProvider.generateDeliveryNote(dbOrderId);
// //       if (res) setCurrentPage("createNewDelivery");
// //     } finally {
// //       setIsSaving(false);
// //     }
// //   };

// //   // ───────────────────────────────────────────────────────────
// //   // Totals
// //   // ───────────────────────────────────────────────────────────
// //   function productTotal(ind) {
// //     const data = SalesList_data[ind];
// //     const quantity = parseFloat(data.quantity) || 0;
// //     const unitPrice = parseFloat(data.unit_price) || 0;
// //     const discount = parseFloat(data.discount) || 0;
// //     const tax = parseFloat(data.tax) || 0;

// //     const subtotal = quantity * unitPrice;
// //     const taxAmount = (subtotal * tax) / 100;
// //     const taxedAmount = subtotal + taxAmount;
// //     const discountAmount = (taxedAmount * discount) / 100;
// //     return (taxedAmount - discountAmount).toFixed(2);
// //   }

// //   function calculateSubtotal() {
// //     return SalesList_data.reduce((acc, data) => {
// //       const quantity = parseFloat(data.quantity) || 0;
// //       const unitPrice = parseFloat(data.unit_price) || 0;
// //       const discount = parseFloat(data.discount) || 0;
// //       const tax = parseFloat(data.tax) || 0;

// //       const subtotal = quantity * unitPrice;
// //       const taxAmount = (subtotal * tax) / 100;
// //       const taxedAmount = subtotal + taxAmount;
// //       const discountAmount = (taxedAmount * discount) / 100;
// //       return acc + (taxedAmount - discountAmount);
// //     }, 0).toFixed(2);
// //   }

// //   function calculateTaxSummery() {
// //     return SalesList_data.reduce((acc, data) => {
// //       const quantity = parseFloat(data.quantity) || 0;
// //       const unitPrice = parseFloat(data.unit_price) || 0;
// //       const tax = parseFloat(data.tax) || 0;
// //       return acc + (quantity * unitPrice * tax) / 100;
// //     }, 0).toFixed(2);
// //   }

// //   function calculateGrandTotal() {
// //     const subtotal = parseFloat(calculateSubtotal()) || 0;
// //     const discount = (subtotal * (parseFloat(salesData.global_discount) || 0)) / 100;
// //     const shipping = parseFloat(salesData.shipping_charges) || 0;
// //     return (subtotal - discount + shipping).toFixed(2);
// //   }

// //   function roundedGrandTotal() {
// //     const total = parseFloat(calculateGrandTotal());
// //     return total % 1 > 0.5 ? Math.ceil(total) : Math.floor(total);
// //   }

// //   function roundedvalue() {
// //     return (roundedGrandTotal() - parseFloat(calculateGrandTotal())).toFixed(2);
// //   }

// //   // ───────────────────────────────────────────────────────────
// //   // DELETE product row
// //   // ───────────────────────────────────────────────────────────
// //   function deleteSalesProduct(ind) {
// //     const ok = window.confirm("Are you sure you want to delete this Product?");
// //     if (ok) {
// //       setSalesList_data((prev) => prev.filter((_, i) => i !== ind));
// //       setnumOfSalesList((prev) => prev - 1);
// //       toast.success("Product Item deleted!");
// //     }
// //   }

// //   // ───────────────────────────────────────────────────────────
// //   // Loading state
// //   // ───────────────────────────────────────────────────────────
// //   if (isLoading) {
// //     return (
// //       <div className="createNewSales-container" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "300px" }}>
// //         <p style={{ color: "#666", fontSize: "16px" }}>Loading order…</p>
// //       </div>
// //     );
// //   }

// //   // ═══════════════════════════════════════════════════════════
// //   // RENDER
// //   // ═══════════════════════════════════════════════════════════
// //   return (
// //     <>
// //       {stockAlert && (
// //         <div className="createNewSales-btn">
// //           <CreatNewSalesStockAlert
// //             setStockAlert={setStockAlert}
// //             setSalesStatus={setSalesStatus}
// //             purchase_order={purchase_order}
// //             SalesList_data={SalesList_data}
// //           />
// //         </div>
// //       )}

// //       <div className={`createNewSales-container ${stockAlert && "createNewSales-blur"}`}>
// //         <form onSubmit={handleSubmitState}>
// //           {/* ── HEAD ── */}
// //           <div className="createNewSales-head">
// //             <nav>
// //               {salesStatus !== "" && (
// //                 <svg
// //                   className={
// //                     purchase_order === ""
// //                       ? "createNewSales-purchase-tag"
// //                       : purchase_order === "Purchase Ordered"
// //                       ? "createNewSales-purchase-order-tag"
// //                       : purchase_order === "Purchase Ordered(PP)"
// //                       ? "createNewSales-purchase-orderPP-tag"
// //                       : purchase_order === "Ready to Submit"
// //                       ? "createNewSales-readyTOsubmit-tag"
// //                       : "createNewSales-purchase-tag"
// //                   }
// //                   xmlns="http://www.w3.org/2000/svg"
// //                   width="20"
// //                   height="20"
// //                   viewBox="0 0 20 20"
// //                   fill="none"
// //                 >
// //                   <path fillRule="evenodd" clipRule="evenodd" d="M0.123245 10.8159C0.410245 11.8189 1.18325 12.5909 2.72825 14.1359L4.55825 15.9659C7.24825 18.6569 8.59225 19.9999 10.2622 19.9999C11.9332 19.9999 13.2772 18.6559 15.9662 15.9669C18.6562 13.2769 20.0002 11.9329 20.0002 10.2619C20.0002 8.59187 18.6562 7.24687 15.9672 4.55787L14.1372 2.72787C12.5912 1.18287 11.8192 0.409866 10.8162 0.122866C9.81324 -0.165134 8.74825 0.0808662 6.61925 0.572866L5.39125 0.855866C3.59925 1.26887 2.70325 1.47587 2.08925 2.08887C1.47525 2.70187 1.27025 3.59987 0.856245 5.39087L0.572245 6.61887C0.0812454 8.74887 -0.163755 9.81287 0.123245 10.8159ZM8.12224 5.27087C8.31512 5.45687 8.469 5.67944 8.5749 5.92558C8.6808 6.17172 8.73659 6.4365 8.73902 6.70444C8.74145 6.97238 8.69046 7.23812 8.58904 7.48614C8.48763 7.73416 8.33781 7.95948 8.14833 8.14896C7.95886 8.33843 7.73354 8.48825 7.48552 8.58967C7.2375 8.69108 6.97176 8.74207 6.70382 8.73964C6.43588 8.73721 6.1711 8.68142 5.92496 8.57552C5.67882 8.46962 5.45625 8.31574 5.27025 8.12287C4.9033 7.74237 4.70039 7.23303 4.70518 6.70444C4.70998 6.17585 4.92208 5.67027 5.29587 5.29649C5.66965 4.9227 6.17523 4.7106 6.70382 4.7058C7.23241 4.70101 7.74175 4.90392 8.12224 5.27087ZM17.0502 10.0509L10.0712 17.0309C9.92973 17.1674 9.74024 17.2429 9.54359 17.2411C9.34695 17.2393 9.15887 17.1604 9.01988 17.0212C8.88089 16.8821 8.8021 16.694 8.80049 16.4973C8.79887 16.3007 8.87456 16.1113 9.01124 15.9699L15.9892 8.98987C16.1299 8.84917 16.3208 8.77013 16.5197 8.77013C16.7187 8.77013 16.9095 8.84917 17.0502 8.98987C17.1909 9.13056 17.27 9.32139 17.27 9.52037C17.27 9.71934 17.1909 9.91017 17.0502 10.0509Z" />
// //                 </svg>
// //               )}
// //               <p>{isEditMode ? "Edit Sales Order" : "New Sales Order"}</p>
// //               {salesStatus && (
// //                 <h3
// //                   className={
// //                     salesStatus === "Draft" ? "createNewSales-Status-draft"
// //                     : salesStatus === "Submitted" ? "createNewSales-Status-submitted"
// //                     : salesStatus === "Submitted(PD)" ? "createNewSales-Status-SubmittedPD"
// //                     : salesStatus === "Delivered" ? "createNewSales-Status-Delivered"
// //                     : salesStatus === "Cancelled" ? "createNewSales-Status-Cancelled"
// //                     : salesStatus === "Partially Delivered" ? "createNewSales-Status-partiallyDelivered"
// //                     : ""
// //                   }
// //                 >
// //                   Status: {salesStatus}
// //                 </h3>
// //               )}
// //             </nav>
// //             <div>
// //               <button
// //                 className={
// //                   salesStatus === "Submitted" || salesStatus === "Submitted(PD)"
// //                     ? "createNewSales-active-btn"
// //                     : "createNewSales-inactive-btn"
// //                 }
// //                 disabled={salesBtn.generate_delivery_note}
// //                 onClick={handleGenerateDeliveryNote}
// //               >
// //                 Generate Delivery Note
// //               </button>
// //               <button
// //                 className={
// //                   salesStatus === "Submitted"
// //                     ? "createNewSales-active-btn"
// //                     : "createNewSales-inactive-btn"
// //                 }
// //                 disabled={salesBtn.generate_invoice}
// //                 onClick={(e) => { e.preventDefault(); setCurrentPage("createNewInvoice"); }}
// //               >
// //                 Generate Invoice
// //               </button>
// //               <div className="createNewSales-close" onClick={() => prevPage(-1)}>
// //                 <svg className="createNewSales-circle-x-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
// //                   <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
// //                 </svg>
// //                 <p>Close</p>
// //               </div>
// //             </div>
// //           </div>

// //           {/* ── BASIC INFO ── */}
// //           <div className="createNewSales-input-container">
// //             <div className="createNewSales-input-box">
// //               <label htmlFor="sales_order_id">Sales Order ID {`(Auto Generate)`}</label>
// //               <input id="sales_order_id" type="text" value={salesData.sales_order_id} onChange={handleSalesDataChange} placeholder="Auto Generate" disabled />
// //             </div>
// //             <div className="createNewSales-input-box">
// //               <label htmlFor="order_date">Order Date<sup>*</sup></label>
// //               <input id="order_date" value={salesData.order_date} onChange={handleSalesDataChange} type="date" required disabled={salesBtn.BtnAccess} />
// //             </div>
// //           </div>
// //           <div className="createNewSales-input-container">
// //             <div className="createNewSales-input-box">
// //               <label htmlFor="sales_rep">Sales Rep<sup>*</sup></label>
// //               <select id="sales_rep" value={salesData.sales_rep} onChange={handleSalesDataChange} required disabled={salesBtn.BtnAccess}>
// //                 <option value="">Select Sales Rep</option>
// //                 {sales_rep.map((ele, ind) => (<option key={ind} value={ele}>{ele}</option>))}
// //               </select>
// //             </div>
// //             <div className="createNewSales-input-box">
// //               <label htmlFor="order_type">Order Type<sup>*</sup></label>
// //               <select id="order_type" value={salesData.order_type} onChange={handleSalesDataChange} required disabled={salesBtn.BtnAccess}>
// //                 <option value="">Select Order</option>
// //                 <option value="Standard">Standard</option>
// //                 <option value="Rush">Rush</option>
// //                 <option value="Backorder">Backorder</option>
// //               </select>
// //             </div>
// //           </div>

// //           {/* ── CUSTOMER INFORMATION ── */}
// //           <nav className="createNewSales-subtit">Customer Information</nav>
// //           <div className="createNewSales-input-container">
// //             <div className="createNewSales-input-box">
// //               <label htmlFor="customer_name">Customer Name<sup>*</sup></label>
// //               <select id="customer_name" value={salesData.customer_name} onChange={handleSalesDataChange} disabled={salesBtn.BtnAccess}>
// //                 <option value="">Select Customer</option>
// //                 {prevsalesData.map((ele, ind) => (<option key={ind} value={ele.customer_name}>{ele.customer_name}</option>))}
// //               </select>
// //             </div>
// //             <div className="createNewSales-input-box">
// //               <label htmlFor="customer_id">Customer ID {`(Auto Generate)`}</label>
// //               <input id="customer_id" value={salesData.customer_id} onChange={handleSalesDataChange} type="text" placeholder="Auto Generate" disabled />
// //             </div>
// //           </div>
// //           <div className="createNewSales-input-container">
// //             <div className="createNewSales-input-box">
// //               <label htmlFor="billing_address">Billing Address<sup>*</sup></label>
// //               <input id="billing_address" value={salesData.billing_address} onChange={handleSalesDataChange} type="text" placeholder="Enter Address" required disabled={salesBtn.BtnAccess} />
// //             </div>
// //             <div className="createNewSales-input-box">
// //               <label htmlFor="shipping_address">Shipping Address<sup>*</sup></label>
// //               <input id="shipping_address" value={salesData.shipping_address} onChange={handleSalesDataChange} type="text" placeholder="Enter Address" required disabled={salesBtn.BtnAccess} />
// //             </div>
// //           </div>
// //           <div className="createNewSales-input-container">
// //             <div className="createNewSales-input-box">
// //               <label htmlFor="email_id">Email ID<sup>*</sup></label>
// //               <input id="email_id" value={salesData.email_id} onChange={handleSalesDataChange} type="email" placeholder="Enter Email" required disabled={salesBtn.BtnAccess} />
// //             </div>
// //             <div className="createNewSales-input-box">
// //               <label htmlFor="phone_number">Phone Number<sup>*</sup></label>
// //               <input id="phone_number" value={salesData.phone_number} onChange={handleSalesDataChange} className="increment-decrement-createNewSales" type="number" placeholder="Enter Phone" required disabled={salesBtn.BtnAccess} />
// //             </div>
// //           </div>

// //           {/* ── PAYMENT DETAILS ── */}
// //           <nav className="createNewSales-subtit">Payment Details</nav>
// //           <div className="createNewSales-input-container">
// //             <div className="createNewSales-input-box">
// //               <label htmlFor="payment_method">Payment Method</label>
// //               <select id="payment_method" value={salesData.payment_method} onChange={handleSalesDataChange} disabled={salesBtn.BtnAccess}>
// //                 <option value="">Select Payment</option>
// //                 <option value="Credit Card">Credit Card</option>
// //                 <option value="Bank Transfer">Bank Transfer</option>
// //                 <option value="COD">COD</option>
// //                 <option value="PayPal">PayPal</option>
// //               </select>
// //             </div>
// //             <div className="createNewSales-input-box">
// //               <label htmlFor="currency">Currency<sup>*</sup></label>
// //               <select id="currency" value={salesData.currency} onChange={handleSalesDataChange} required disabled={salesBtn.BtnAccess}>
// //                 <option value="">Select Currency</option>
// //                 <option value="USD">USD</option>
// //                 <option value="EUR">EUR</option>
// //                 <option value="INR">INR</option>
// //                 <option value="GBP">GBP</option>
// //                 <option value="SGD">SGD</option>
// //               </select>
// //             </div>
// //           </div>
// //           <div className="createNewSales-input-container">
// //             <div className="createNewSales-input-box">
// //               <label htmlFor="due_date">Due Date</label>
// //               <input id="due_date" value={salesData.due_date} onChange={handleSalesDataChange} type="date" disabled={salesBtn.BtnAccess} />
// //             </div>
// //             <div className="createNewSales-input-box">
// //               <label htmlFor="terms_conditions">Terms & Conditions</label>
// //               <input id="terms_conditions" value={salesData.terms_conditions} onChange={handleSalesDataChange} type="text" placeholder="Enter Terms & Conditions" disabled={salesBtn.BtnAccess} />
// //             </div>
// //           </div>

// //           {/* ── LOGISTICS & NOTES ── */}
// //           <nav className="createNewSales-subtit">Logistics & Notes</nav>
// //           <div className="createNewSales-input-container">
// //             <div className="createNewSales-input-box">
// //               <label htmlFor="shipping_method">Shipping Method</label>
// //               <select id="shipping_method" value={salesData.shipping_method} onChange={handleSalesDataChange} disabled={salesBtn.BtnAccess}>
// //                 <option value="">Select Shipping</option>
// //                 <option value="DHL">DHL</option>
// //                 <option value="FedEx">FedEx</option>
// //                 <option value="UPS">UPS</option>
// //                 <option value="Local Courier">Local Courier</option>
// //               </select>
// //             </div>
// //             <div className="createNewSales-input-box">
// //               <label htmlFor="expected_delivery">Expected Delivery</label>
// //               <input id="expected_delivery" value={salesData.expected_delivery} onChange={handleSalesDataChange} disabled={salesBtn.BtnAccess} type="date" />
// //             </div>
// //           </div>
// //           <div className="createNewSales-input-container">
// //             <div className="createNewSales-input-box">
// //               <label htmlFor="tracking_number">Tracking Number</label>
// //               <input id="tracking_number" type="text" value={salesData.tracking_number} onChange={handleSalesDataChange} disabled={salesBtn.BtnAccess} placeholder="Enter tracking number" />
// //             </div>
// //             <div className="createNewSales-input-box">
// //               <label htmlFor="internal_notes">Internal Notes</label>
// //               <input id="internal_notes" type="text" value={salesData.internal_notes} onChange={handleSalesDataChange} placeholder="Enter Internal Notes" disabled={salesBtn.BtnAccess} />
// //             </div>
// //           </div>
// //           <div className="createNewSales-input-container">
// //             <div className="createNewSales-input-box">
// //               <label htmlFor="customer_notes">Customer Notes</label>
// //               <input id="customer_notes" type="text" value={salesData.customer_notes} onChange={handleSalesDataChange} placeholder="Enter Customer Notes" disabled={salesBtn.BtnAccess} />
// //             </div>
// //           </div>

// //           {/* ── ORDER LINE ITEMS ── */}
// //           <nav className="createNewSales-subtit">Order Line Items<sup>*</sup></nav>
// //           <div className="createNewSales-table-container">
// //             <table>
// //               <thead className="createNewSales-table-head">
// //                 <tr>
// //                   <th id="createNewSales-table-smallwidth">#</th>
// //                   <th>Product Name</th>
// //                   <th id="createNewSales-table-minwidth">Product ID</th>
// //                   <th id="createNewSales-table-minwidth">In Stock</th>
// //                   <th>Quantity</th>
// //                   <th>UOM</th>
// //                   <th>Unit Price</th>
// //                   <th>Tax {`(%)`}</th>
// //                   <th>Discount {`(%)`}</th>
// //                   <th>Total</th>
// //                   <th>Action</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="createNewSales-table-body">
// //                 {[...Array(numOfSalesList)].map((_, ind) => (
// //                   <SalesListItems
// //                     key={SalesList_data[ind]?.unique_key ?? ind}
// //                     unique_key={ind}
// //                     // Pre-populated row data (edit mode)
// //                     initialData={SalesList_data[ind] || null}
// //                     sales_table_data={sales_table_data}
// //                     setSales_table_data={setSales_table_data}
// //                     setSalesList_data={setSalesList_data}
// //                     productTotal={productTotal}
// //                     deleteSalesProduct={deleteSalesProduct}
// //                     salesData={salesData}
// //                     btnAccess={salesBtn.BtnAccess}
// //                   />
// //                 ))}
// //                 <tr>
// //                   <td></td>
// //                   <td>
// //                     <button
// //                       onClick={(e) => {
// //                         e.preventDefault();
// //                         setSalesList_data((prev) => [...prev, { unique_key: numOfSalesList }]);
// //                         setnumOfSalesList((prev) => prev + 1);
// //                       }}
// //                       disabled={salesBtn.BtnAccess}
// //                     >
// //                       + Add Item
// //                     </button>
// //                   </td>
// //                 </tr>
// //               </tbody>
// //             </table>
// //           </div>

// //           {/* ── ORDER SUMMARY ── */}
// //           <nav className="createNewSales-subtit">Order Summary</nav>
// //           <div className="createNewSales-totals-container">
// //             <nav>
// //               <h5>Subtotal</h5>
// //               <p>{calculateSubtotal()}</p>
// //             </nav>
// //             <nav>
// //               <h5>Global Discount {`(%)`}</h5>
// //               <input
// //                 type="number"
// //                 value={salesData.global_discount}
// //                 onChange={(e) => setSalesData((prev) => ({ ...prev, global_discount: parseFloat(e.target.value) || 0 }))}
// //                 disabled={salesBtn.BtnAccess}
// //               />
// //             </nav>
// //             <nav>
// //               <h5>Tax Summary</h5>
// //               <p>{calculateTaxSummery()}</p>
// //             </nav>
// //             <nav>
// //               <h5>
// //                 Shipping Charges
// //                 {salesData.currency === "INR" && <span>{` (₹)`}</span>}
// //                 {salesData.currency === "USD" && <span>{` ($)`}</span>}
// //                 {salesData.currency === "GBP" && <span>{` (£)`}</span>}
// //                 {salesData.currency === "SGD" && <span>{` (S$)`}</span>}
// //                 {salesData.currency === "EUR" && <span>{` (€)`}</span>}
// //               </h5>
// //               <input
// //                 type="number"
// //                 value={salesData.shipping_charges}
// //                 onChange={(e) => setSalesData((prev) => ({ ...prev, shipping_charges: parseFloat(e.target.value) || 0 }))}
// //                 disabled={salesBtn.BtnAccess}
// //               />
// //             </nav>
// //             <nav>
// //               <h5>Rounding Adjustment</h5>
// //               <p>{roundedvalue()}</p>
// //             </nav>
// //             <nav className="createNewSales-totals-container-bg">
// //               <h5>Grand Total</h5>
// //               <p>
// //                 {salesData.currency === "INR" && <span>₹</span>}
// //                 {salesData.currency === "USD" && <span>$</span>}
// //                 {salesData.currency === "GBP" && <span>£</span>}
// //                 {salesData.currency === "SGD" && <span>S$</span>}
// //                 {salesData.currency === "EUR" && <span>€</span>}
// //                 {roundedGrandTotal()}
// //               </p>
// //             </nav>
// //           </div>

// //           {/* ── COMMENTS / HISTORY HUB ── */}
// //           <div className="createNewSales-hub-container">
// //             <div className="createNewSales-hub-head">
// //               <p
// //                 className={feacher.showChat ? "createNewSales-hub-head-bg-black" : "createNewSales-hub-head-tit"}
// //                 onClick={() => setFeacher({ showChat: true, showHistory: false })}
// //               >
// //                 Comments
// //               </p>
// //               <p
// //                 className={feacher.showHistory ? "createNewSales-hub-head-bg-black" : "createNewSales-hub-head-tit"}
// //                 onClick={() => setFeacher({ showChat: false, showHistory: true })}
// //               >
// //                 History
// //               </p>
// //             </div>
// //             <div className="createNewSales-hub-body">
// //               {feacher.showChat && (
// //                 <CreateNewSalesComment
// //                   orderId={dbOrderId}
// //                   initialComments={orderComments}
// //                 />
// //               )}
// //               {feacher.showHistory && (
// //                 <CreateNewSalesHistory
// //                   initialHistory={orderHistory}
// //                 />
// //               )}
// //             </div>
// //           </div>

// //           {/* ── ACTION BUTTONS ── */}
// //           <div className="createNewSales-btn-container">
// //             <button
// //               style={{ width: "max-content" }}
// //               className={
// //                 salesStatus === "Submitted" || salesStatus === "Submitted(PD)" || salesStatus === "Cancelled"
// //                   ? "createNewSales-order-active-btn"
// //                   : "createNewSales-inactive-btn"
// //               }
// //               onClick={handleCancelOrderState}
// //               disabled={salesBtn.cancel_order || isSaving}
// //             >
// //               {salesStatus === "Cancelled" ? "Cancelled" : "Cancel Order"}
// //             </button>
// //             <nav>
// //               <button
// //                 className="createNewSales-cancel-btn"
// //                 onClick={(e) => { e.preventDefault(); prevPage(-1); }}
// //                 disabled={salesBtn.cancel}
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 className={
// //                   salesStatus === "Draft" || salesStatus === ""
// //                     ? "createNewSales-active-btn"
// //                     : "createNewSales-completed-btn"
// //                 }
// //                 onClick={handleSaveDraftState}
// //                 disabled={salesBtn.save_draft || isSaving}
// //               >
// //                 {isSaving ? "Saving…" : "Save Draft"}
// //               </button>
// //               <button
// //                 className={
// //                   salesStatus === "Draft" || salesStatus === "Submitted(PD)" || salesStatus === ""
// //                     ? "createNewSales-active-btn"
// //                     : "createNewSales-completed-btn"
// //                 }
// //                 disabled={salesBtn.submit || isSaving}
// //               >
// //                 {isSaving ? "Submitting…" : "Submit"}
// //               </button>
// //               <button
// //                 className={
// //                   salesStatus === "" || salesStatus === "Submitted" ||
// //                   (salesStatus === "Submitted(PD)" && purchase_order !== "Purchase Ordered") ||
// //                   (salesStatus === "Draft" && purchase_order !== "Purchase Ordered")
// //                     ? "createNewSales-active-btn"
// //                     : "createNewSales-completed-btn"
// //                 }
// //                 disabled={salesBtn.Generate_po || isSaving}
// //               >
// //                 Generate (PO)
// //               </button>

// //               {/* PDF icon */}
// //               <svg
// //                 className={salesStatus !== "" ? "createNewSales-pdf-mail-activelogo" : "createNewSales-pdf-mail-futurelogo"}
// //                 xmlns="http://www.w3.org/2000/svg"
// //                 viewBox="0 0 22 24"
// //                 fill="none"
// //               >
// //                 <path fillRule="evenodd" clipRule="evenodd" d="M0.600098 2.4C0.600098 1.76348 0.852954 1.15303 1.30304 0.702944C1.75313 0.252856 2.36358 0 3.0001 0L16.1313 0L21.4001 5.2688V21.6C21.4001 22.2365 21.1472 22.847 20.6972 23.2971C20.2471 23.7471 19.6366 24 19.0001 24H3.0001C2.36358 24 1.75313 23.7471 1.30304 23.2971C0.852954 22.847 0.600098 22.2365 0.600098 21.6V2.4ZM4.6001 9.6H2.2001V17.6H3.8001V14.4H4.6001C5.23662 14.4 5.84707 14.1471 6.29715 13.6971C6.74724 13.247 7.0001 12.6365 7.0001 12C7.0001 11.3635 6.74724 10.753 6.29715 10.3029C5.84707 9.85286 5.23662 9.6 4.6001 9.6ZM11.0001 9.6H8.6001V17.6H11.0001C11.6366 17.6 12.2471 17.3471 12.6972 16.8971C13.1472 16.447 13.4001 15.8365 13.4001 15.2V12C13.4001 11.3635 13.1472 10.753 12.6972 10.3029C12.2471 9.85286 11.6366 9.6 11.0001 9.6ZM15.0001 17.6V9.6H19.8001V11.2H16.6001V12.8H18.2001V14.4H16.6001V17.6H15.0001Z" />
// //               </svg>

// //               {/* Email icon */}
// //               <svg
// //                 className={salesStatus !== "" ? "createNewSales-pdf-mail-activelogo" : "createNewSales-pdf-mail-futurelogo"}
// //                 xmlns="http://www.w3.org/2000/svg"
// //                 viewBox="0 0 20 16"
// //                 fill="none"
// //               >
// //                 <path d="M2 16C1.45 16 0.979333 15.8043 0.588 15.413C0.196667 15.0217 0.000666667 14.5507 0 14V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196666 1.45067 0.000666667 2 0H18C18.55 0 19.021 0.196 19.413 0.588C19.805 0.98 20.0007 1.45067 20 2V14C20 14.55 19.8043 15.021 19.413 15.413C19.0217 15.805 18.5507 16.0007 18 16H2ZM10 8.825C10.0833 8.825 10.171 8.81233 10.263 8.787C10.355 8.76167 10.4423 8.72433 10.525 8.675L17.6 4.25C17.7333 4.16667 17.8333 4.06267 17.9 3.938C17.9667 3.81333 18 3.67567 18 3.525C18 3.19167 17.8583 2.94167 17.575 2.775C17.2917 2.60833 17 2.61667 16.7 2.8L10 7L3.3 2.8C3 2.61667 2.70833 2.61267 2.425 2.788C2.14167 2.96333 2 3.209 2 3.525C2 3.69167 2.03333 3.83767 2.1 3.963C2.16667 4.08833 2.26667 4.184 2.4 4.25L9.475 8.675C9.55833 8.725 9.646 8.76267 9.738 8.788C9.83 8.81333 9.91733 8.82567 10 8.825Z" />
// //               </svg>
// //             </nav>
// //           </div>
// //         </form>
// //       </div>
// //     </>
// //   );
// // }
// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import "./createNewSales.css";
// import SalesListItems from "./salesListItems";
// import CreatNewSalesStockAlert from "./creatNewSalesStockAlert";
// import CreateNewSalesHistory from "./createNewSalesHistory";
// import CreateNewSalesComment from "./createNewSalesComment";
// import { toast } from "react-toastify";
// import salesOrderApiProvider from "../../../network/salesOrder-api-provider";

// // ─────────────────────────────────────────────────────────────
// // Props:
// //   setCurrentPage      – page router setter
// //   editSalesOrderData  – full order object from the list page (edit mode)
// //   isEdit              – true when editing an existing order
// //
// // HOW TO CALL FROM LIST PAGE:
// //   Create:  <CreateNewSales setCurrentPage={setCurrentPage} />
// //   Edit:    <CreateNewSales setCurrentPage={setCurrentPage} isEdit={true} editSalesOrderData={rowData} />
// // ─────────────────────────────────────────────────────────────
// export default function CreateNewSales({
//   setCurrentPage,
//   editSalesOrderData = {},
//   isEdit = false,
// }) {
//   const isEditMode = isEdit && Object.keys(editSalesOrderData).length > 0;
//   const prevPage = useNavigate();

//   // Prevents the customer-name→autofill effect from overwriting
//   // the address fields we already populated from editSalesOrderData.
//   const suppressCustomerEffect = useRef(isEditMode);

//   // ── Empty form shape ──────────────────────────────────────
//   const emptyForm = {
//     sales_order_id: "",
//     order_date: "",
//     sales_rep: "",
//     order_type: "",
//     customer_name: "",
//     customer_id: "",
//     billing_address: "",
//     shipping_address: "",
//     email_id: "",
//     phone_number: "",
//     payment_method: "",
//     currency: "",
//     due_date: "",
//     terms_conditions: "",
//     shipping_method: "",
//     expected_delivery: "",
//     tracking_number: "",
//     internal_notes: "",
//     customer_notes: "",
//     global_discount: 0,
//     shipping_charges: 0,
//     _customerId: null,  // numeric PK — sent to API
//     _salesRepId: null,
//   };

//   // ── Map full API order object → flat form fields ──────────
//   function mapOrderToForm(order) {
//     return {
//       sales_order_id:    order.sales_order_id   || "",
//       order_date:        order.order_date        || "",
//       sales_rep:         order.sales_rep         || "",
//       order_type:        order.order_type        || "",
//       customer_name:     order.customer
//         ? `${order.customer.first_name} ${order.customer.last_name || ""}`.trim()
//         : "",
//       customer_id:       order.customer?.customer_id    || "",
//       billing_address:   order.customer?.billing_address  || "",
//       shipping_address:  order.customer?.shipping_address || "",
//       email_id:          order.customer?.email           || "",
//       phone_number:      order.customer?.phone_number    || "",
//       payment_method:    order.payment_method    || "",
//       currency:          order.currency          || "",
//       due_date:          order.due_date          || "",
//       terms_conditions:  order.terms_conditions  || "",
//       shipping_method:   order.shipping_method   || "",
//       expected_delivery: order.expected_delivery || "",
//       tracking_number:   order.tracking_number   || "",
//       internal_notes:    order.internal_notes    || "",
//       customer_notes:    order.customer_notes    || "",
//       global_discount:   parseFloat(order.global_discount)  || 0,
//       shipping_charges:  parseFloat(order.shipping_charges) || 0,
//       _customerId:       order.customer?.id      || null,
//       _salesRepId:       order.sales_rep_id      || null,
//     };
//   }

//   // ── Map API items → SalesList_data rows ──────────────────
//   function mapItemsToList(items = []) {
//     return items.map((item, index) => ({
//       unique_key:         index,
//       item_id:            item.id,
//       product_numeric_id: item.product,
//       product_id:         item.product_id_display || "",
//       product_name:       item.product_name       || "",
//       uom:                String(item.uom  ?? ""),
//       uom_id:             String(item.uom  ?? ""),
//       unit_price:         item.unit_price,
//       discount:           item.discount,
//       tax:                item.tax_rate,
//       tax_id:             String(item.tax  ?? ""),
//       quantity:           item.quantity,
//       stock_level:        999,
//       total:              item.total,
//     }));
//   }

//   // ── Initialise state directly from prop — NO async fetch ──
//   // This is the same pattern used in CreateNewQuotation.
//   const [salesData, setSalesData] = useState(
//     isEditMode ? mapOrderToForm(editSalesOrderData) : emptyForm
//   );

//   const [salesStatus, setSalesStatus] = useState(
//     isEditMode ? editSalesOrderData.status || "" : ""
//   );

//   const [SalesList_data, setSalesList_data] = useState(() =>
//     isEditMode && editSalesOrderData.items?.length > 0
//       ? mapItemsToList(editSalesOrderData.items)
//       : [{ unique_key: 0 }]
//   );

//   const [numOfSalesList, setnumOfSalesList] = useState(
//     isEditMode && editSalesOrderData.items?.length > 0
//       ? editSalesOrderData.items.length
//       : 1
//   );

//   const [dbOrderId, setDbOrderId] = useState(
//     isEditMode ? editSalesOrderData.id || null : null
//   );

//   const [purchase_order, setPurchase_order] = useState(
//     isEditMode ? editSalesOrderData.purchase_order_status || "" : ""
//   );

//   const [orderHistory,  setOrderHistory]  = useState(isEditMode ? editSalesOrderData.history  || [] : []);
//   const [orderComments, setOrderComments] = useState(isEditMode ? editSalesOrderData.comments || [] : []);

//   // ── Dropdown master lists ─────────────────────────────────
//   const [prevsalesData,    setprevsalesData]    = useState([]);
//   const [sales_table_data, setSales_table_data] = useState([]);
//   const [sales_rep,        setSales_rep]        = useState([]);

//   const [feacher,    setFeacher]    = useState({ showChat: true, showHistory: false });
//   const [stockAlert, setStockAlert] = useState(false);
//   const [isSaving,   setIsSaving]   = useState(false);

//   const [salesBtn, setSalesBtn] = useState({
//     BtnAccess: false,
//     cancel: false,
//     cancel_order: true,
//     save_draft: false,
//     submit: false,
//     Generate_po: false,
//     pdf: true,
//     email: true,
//     generate_delivery_note: true,
//     generate_invoice: true,
//   });

//   // ─────────────────────────────────────────────────────────
//   // LOAD DROPDOWN MASTER DATA on mount
//   // Replace mock below with your real API calls.
//   // ─────────────────────────────────────────────────────────
//   useEffect(() => {
//     async function loadMasterData() {
//       try {
//         // ── TODO: replace with real API calls ───────────────
//         // const customers = await customerApiProvider.fetchAll();
//         // const products  = await productApiProvider.fetchAll();
//         // const reps      = await userApiProvider.fetchSalesReps();
//         // ────────────────────────────────────────────────────

//         const mockCustomers = [
//           { customer_name: "Sans",  customer_id: "ABC001", billing_address: "123, A colony,Chennai",    shipping_address: "123, B colony,Chennai", email_id: "ASD@gmail.com",   phone_number: "1234567890" },
//           { customer_name: "Mandy", customer_id: "ABC002", billing_address: "123, A colony,Madurai",    shipping_address: "123, B colony,AP",      email_id: "Mandy@gmail.com", phone_number: "8838511968" },
//           { customer_name: "Rose",  customer_id: "ABC003", billing_address: "123, A colony,Coimbatore", shipping_address: "123, B colony,Salem",   email_id: "rose@gmail.com",  phone_number: "8888867890" },
//         ];
//         const mockProducts = [
//           { id: 1, product_id: "PRO001", name: "E-shirt", stock_level: 50, uom_detail: { id: 1, name: "Set (5)" }, tax_code_detail: { id: 1, percentage: "18.00" }, unit_price: "120", discount: "5" },
//           { id: 2, product_id: "PRO002", name: "M-shirt", stock_level: 40, uom_detail: { id: 1, name: "Set (5)" }, tax_code_detail: { id: 1, percentage: "18.00" }, unit_price: "130", discount: "5" },
//           { id: 3, product_id: "PRO003", name: "T-shirt", stock_level: 0,  uom_detail: { id: 1, name: "Set (5)" }, tax_code_detail: { id: 2, percentage: "12.00" }, unit_price: "150", discount: "5" },
//         ];
//         const mockReps = ["Sans", "rose", "Mandy"];

//         // In edit mode inject the API customer + rep so the
//         // <select> has a matching <option> for the saved value.
//         if (isEditMode && editSalesOrderData.customer) {
//           const c = editSalesOrderData.customer;
//           const apiCustomer = {
//             customer_name:    `${c.first_name} ${c.last_name || ""}`.trim(),
//             customer_id:      c.customer_id,
//             billing_address:  c.billing_address  || "",
//             shipping_address: c.shipping_address || "",
//             email_id:         c.email            || "",
//             phone_number:     c.phone_number     || "",
//           };
//           if (!mockCustomers.some((x) => x.customer_id === apiCustomer.customer_id)) {
//             mockCustomers.unshift(apiCustomer);
//           }
//         }
//         if (isEditMode && editSalesOrderData.sales_rep) {
//           if (!mockReps.includes(editSalesOrderData.sales_rep)) {
//             mockReps.unshift(editSalesOrderData.sales_rep);
//           }
//         }

//         setprevsalesData(mockCustomers);
//         setSales_table_data(mockProducts);
//         setSales_rep(mockReps);
//       } catch (err) {
//         console.error("Failed to load master data", err);
//       }
//     }
//     loadMasterData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ─────────────────────────────────────────────────────────
//   // Re-apply edit data if the prop object changes
//   // (same pattern as CreateNewQuotation's second useEffect)
//   // ─────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (isEditMode) {
//       suppressCustomerEffect.current = true;
//       setSalesData(mapOrderToForm(editSalesOrderData));
//       setSalesStatus(editSalesOrderData.status || "");
//       setDbOrderId(editSalesOrderData.id || null);
//       setPurchase_order(editSalesOrderData.purchase_order_status || "");
//       setOrderHistory(editSalesOrderData.history   || []);
//       setOrderComments(editSalesOrderData.comments || []);

//       if (editSalesOrderData.items?.length > 0) {
//         const mapped = mapItemsToList(editSalesOrderData.items);
//         setSalesList_data(mapped);
//         setnumOfSalesList(mapped.length);
//       }
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [editSalesOrderData]);

//   // ─────────────────────────────────────────────────────────
//   // Form field change handler
//   // ─────────────────────────────────────────────────────────
//   const handleSalesDataChange = (e) => {
//     setSalesData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
//   };

//   // ─────────────────────────────────────────────────────────
//   // Customer name → autofill address/contact fields
//   // Skips the first run in edit mode (suppressCustomerEffect)
//   // ─────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (suppressCustomerEffect.current) {
//       suppressCustomerEffect.current = false;
//       return;
//     }
//     const selected = salesData.customer_name;
//     if (!selected) return;

//     const customer = prevsalesData.find((c) => c.customer_name === selected);
//     if (customer) {
//       setSalesData((prev) => ({
//         ...prev,
//         customer_id:      customer.customer_id,
//         billing_address:  customer.billing_address,
//         shipping_address: customer.shipping_address,
//         email_id:         customer.email_id,
//         phone_number:     customer.phone_number,
//       }));
//     }
//   }, [salesData.customer_name]); // intentionally omits prevsalesData

//   // ─────────────────────────────────────────────────────────
//   // Button state from salesStatus
//   // ─────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (salesStatus === "") {
//       setSalesBtn((prev) => ({ ...prev, BtnAccess: false }));
//       return;
//     }
//     switch (salesStatus) {
//       case "Draft":
//         setSalesBtn((prev) => ({
//           ...prev,
//           BtnAccess: false, cancel: false, cancel_order: true,
//           save_draft: false, submit: false,
//           Generate_po: purchase_order === "Purchase Ordered",
//           pdf: false, email: false,
//           generate_delivery_note: true, generate_invoice: true,
//         }));
//         break;
//       case "Submitted(PD)":
//         setSalesBtn((prev) => ({
//           ...prev,
//           cancel: false, cancel_order: false,
//           save_draft: true, submit: false,
//           Generate_po: purchase_order === "Purchase Ordered",
//           pdf: false, email: false,
//           generate_delivery_note: false, generate_invoice: true,
//         }));
//         break;
//       case "Submitted":
//         setSalesBtn((prev) => ({
//           ...prev,
//           BtnAccess: true, cancel: false, cancel_order: false,
//           save_draft: true, submit: true, Generate_po: false,
//           pdf: false, email: false,
//           generate_delivery_note: false, generate_invoice: false,
//         }));
//         break;
//       case "Cancelled":
//         setSalesBtn((prev) => ({
//           ...prev,
//           cancel: false, cancel_order: true,
//           save_draft: true, submit: true, Generate_po: true,
//           pdf: false, email: false,
//           generate_delivery_note: true, generate_invoice: true,
//         }));
//         break;
//       default:
//         setSalesBtn((prev) => ({ ...prev, BtnAccess: false }));
//     }
//   }, [salesStatus, purchase_order]);

//   // ─────────────────────────────────────────────────────────
//   // Build API payload from current state
//   // ─────────────────────────────────────────────────────────
//   function buildPayload(status) {
//     return {
//       customer:          salesData._customerId,
//       sales_rep:         salesData._salesRepId || null,
//       order_date:        salesData.order_date,
//       order_type:        salesData.order_type,
//       payment_method:    salesData.payment_method,
//       currency:          salesData.currency,
//       due_date:          salesData.due_date          || null,
//       terms_conditions:  salesData.terms_conditions,
//       shipping_method:   salesData.shipping_method,
//       expected_delivery: salesData.expected_delivery || null,
//       tracking_number:   salesData.tracking_number,
//       internal_notes:    salesData.internal_notes,
//       customer_notes:    salesData.customer_notes,
//       global_discount:   salesData.global_discount,
//       shipping_charges:  salesData.shipping_charges,
//       status:            status || undefined,
//       items: SalesList_data
//         .filter((r) => r.product_numeric_id || r.product)
//         .map((row) => ({
//           ...(row.item_id ? { id: row.item_id } : {}),
//           product:    row.product_numeric_id || row.product,
//           uom:        row.uom_id  || row.uom,
//           unit_price: row.unit_price,
//           discount:   row.discount || 0,
//           tax:        row.tax_id   || row.tax,
//           quantity:   row.quantity,
//         })),
//     };
//   }

//   // ─────────────────────────────────────────────────────────
//   // SAVE DRAFT
//   // ─────────────────────────────────────────────────────────
//   const handleSaveDraftState = async (e) => {
//     e.preventDefault();
//     setIsSaving(true);
//     try {
//       const payload = buildPayload("Draft");
//       let result;
//       if (dbOrderId) {
//         result = await salesOrderApiProvider.updateSalesOrder(dbOrderId, payload);
//       } else {
//         result = await salesOrderApiProvider.createSalesOrder(payload);
//         if (result?.id) setDbOrderId(result.id);
//       }
//       if (result) { setSalesStatus("Draft"); toast.success("Saved as Draft"); }
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   // ─────────────────────────────────────────────────────────
//   // SUBMIT
//   // ─────────────────────────────────────────────────────────
//   const handleSubmitState = async (e) => {
//     e.preventDefault();
//     const validRows = SalesList_data.filter((r) => r.product_numeric_id || r.product);
//     if (validRows.length === 0) { toast.error("Add at least one product before submitting"); return; }

//     const isStockOK = validRows.every(
//       ({ quantity = 0, stock_level = 0 }) =>
//         Number(stock_level) > 0 && Number(stock_level) >= Number(quantity)
//     );
//     if (!isStockOK) { setStockAlert(true); return; }

//     setIsSaving(true);
//     try {
//       let savedOrder;
//       if (dbOrderId) {
//         savedOrder = await salesOrderApiProvider.updateSalesOrder(dbOrderId, buildPayload());
//       } else {
//         savedOrder = await salesOrderApiProvider.createSalesOrder(buildPayload());
//         if (savedOrder?.id) setDbOrderId(savedOrder.id);
//       }
//       if (!savedOrder) return;

//       const actionRes = await salesOrderApiProvider.salesOrderAction(savedOrder.id || dbOrderId, "submit");
//       if (actionRes?.status === "Submitted" || actionRes?.message?.toLowerCase().includes("submitted")) {
//         setSalesStatus("Submitted");
//         toast.success("Sales order submitted successfully");
//       } else if (actionRes?.error_code === "insufficient_stock") {
//         setStockAlert(true);
//       } else {
//         toast.error(actionRes?.message || "Submission failed");
//       }
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   // ─────────────────────────────────────────────────────────
//   // CANCEL ORDER
//   // ─────────────────────────────────────────────────────────
//   const handleCancelOrderState = async (e) => {
//     e.preventDefault();
//     if (!window.confirm("Are you sure you want to Cancel Order?")) return;
//     setIsSaving(true);
//     try {
//       if (dbOrderId) {
//         const res = await salesOrderApiProvider.salesOrderAction(dbOrderId, "cancel");
//         if (res) { setSalesStatus("Cancelled"); toast.success("Sales order cancelled"); }
//       } else {
//         setSalesStatus("Cancelled");
//         toast.success("Sales order cancelled");
//       }
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   // ─────────────────────────────────────────────────────────
//   // GENERATE DELIVERY NOTE
//   // ─────────────────────────────────────────────────────────
//   const handleGenerateDeliveryNote = async (e) => {
//     e.preventDefault();
//     if (!dbOrderId) { toast.error("Save the order first"); return; }
//     setIsSaving(true);
//     try {
//       const res = await salesOrderApiProvider.generateDeliveryNote(dbOrderId);
//       if (res) setCurrentPage("createNewDelivery");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   // ─────────────────────────────────────────────────────────
//   // TOTALS
//   // ─────────────────────────────────────────────────────────
//   function productTotal(ind) {
//     const data = SalesList_data[ind];
//     if (!data) return "0.00";
//     const q = parseFloat(data.quantity)   || 0;
//     const u = parseFloat(data.unit_price) || 0;
//     const d = parseFloat(data.discount)   || 0;
//     const t = parseFloat(data.tax)        || 0;
//     const taxed = q * u + (q * u * t) / 100;
//     return (taxed - (taxed * d) / 100).toFixed(2);
//   }

//   function calculateSubtotal() {
//     return SalesList_data.reduce((acc, data) => {
//       const q = parseFloat(data.quantity)   || 0;
//       const u = parseFloat(data.unit_price) || 0;
//       const d = parseFloat(data.discount)   || 0;
//       const t = parseFloat(data.tax)        || 0;
//       const taxed = q * u + (q * u * t) / 100;
//       return acc + taxed - (taxed * d) / 100;
//     }, 0).toFixed(2);
//   }

//   function calculateTaxSummery() {
//     return SalesList_data.reduce((acc, data) => {
//       const q = parseFloat(data.quantity)   || 0;
//       const u = parseFloat(data.unit_price) || 0;
//       const t = parseFloat(data.tax)        || 0;
//       return acc + (q * u * t) / 100;
//     }, 0).toFixed(2);
//   }

//   function calculateGrandTotal() {
//     const sub = parseFloat(calculateSubtotal()) || 0;
//     return (sub - (sub * (parseFloat(salesData.global_discount) || 0)) / 100 + (parseFloat(salesData.shipping_charges) || 0)).toFixed(2);
//   }

//   function roundedGrandTotal() {
//     const t = parseFloat(calculateGrandTotal());
//     return t % 1 > 0.5 ? Math.ceil(t) : Math.floor(t);
//   }

//   function roundedvalue() {
//     return (roundedGrandTotal() - parseFloat(calculateGrandTotal())).toFixed(2);
//   }

//   // ─────────────────────────────────────────────────────────
//   // DELETE product row
//   // ─────────────────────────────────────────────────────────
//   function deleteSalesProduct(ind) {
//     if (!window.confirm("Are you sure you want to delete this Product?")) return;
//     setSalesList_data((prev) => prev.filter((_, i) => i !== ind));
//     setnumOfSalesList((prev) => prev - 1);
//     toast.success("Product Item deleted!");
//   }

//   // ═══════════════════════════════════════════════════════════
//   // RENDER
//   // ═══════════════════════════════════════════════════════════
//   return (
//     <>
//       {stockAlert && (
//         <div className="createNewSales-btn">
//           <CreatNewSalesStockAlert
//             setStockAlert={setStockAlert}
//             setSalesStatus={setSalesStatus}
//             purchase_order={purchase_order}
//             SalesList_data={SalesList_data}
//           />
//         </div>
//       )}

//       <div className={`createNewSales-container ${stockAlert ? "createNewSales-blur" : ""}`}>
//         <form onSubmit={handleSubmitState}>

//           {/* ── HEAD ── */}
//           <div className="createNewSales-head">
//             <nav>
//               {salesStatus !== "" && (
//                 <svg
//                   className={
//                     purchase_order === "Purchase Ordered"     ? "createNewSales-purchase-order-tag"   :
//                     purchase_order === "Purchase Ordered(PP)" ? "createNewSales-purchase-orderPP-tag" :
//                     purchase_order === "Ready to Submit"      ? "createNewSales-readyTOsubmit-tag"    :
//                     "createNewSales-purchase-tag"
//                   }
//                   xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"
//                 >
//                   <path fillRule="evenodd" clipRule="evenodd" d="M0.123245 10.8159C0.410245 11.8189 1.18325 12.5909 2.72825 14.1359L4.55825 15.9659C7.24825 18.6569 8.59225 19.9999 10.2622 19.9999C11.9332 19.9999 13.2772 18.6559 15.9662 15.9669C18.6562 13.2769 20.0002 11.9329 20.0002 10.2619C20.0002 8.59187 18.6562 7.24687 15.9672 4.55787L14.1372 2.72787C12.5912 1.18287 11.8192 0.409866 10.8162 0.122866C9.81324 -0.165134 8.74825 0.0808662 6.61925 0.572866L5.39125 0.855866C3.59925 1.26887 2.70325 1.47587 2.08925 2.08887C1.47525 2.70187 1.27025 3.59987 0.856245 5.39087L0.572245 6.61887C0.0812454 8.74887 -0.163755 9.81287 0.123245 10.8159ZM8.12224 5.27087C8.31512 5.45687 8.469 5.67944 8.5749 5.92558C8.6808 6.17172 8.73659 6.4365 8.73902 6.70444C8.74145 6.97238 8.69046 7.23812 8.58904 7.48614C8.48763 7.73416 8.33781 7.95948 8.14833 8.14896C7.95886 8.33843 7.73354 8.48825 7.48552 8.58967C7.2375 8.69108 6.97176 8.74207 6.70382 8.73964C6.43588 8.73721 6.1711 8.68142 5.92496 8.57552C5.67882 8.46962 5.45625 8.31574 5.27025 8.12287C4.9033 7.74237 4.70039 7.23303 4.70518 6.70444C4.70998 6.17585 4.92208 5.67027 5.29587 5.29649C5.66965 4.9227 6.17523 4.7106 6.70382 4.7058C7.23241 4.70101 7.74175 4.90392 8.12224 5.27087ZM17.0502 10.0509L10.0712 17.0309C9.92973 17.1674 9.74024 17.2429 9.54359 17.2411C9.34695 17.2393 9.15887 17.1604 9.01988 17.0212C8.88089 16.8821 8.8021 16.694 8.80049 16.4973C8.79887 16.3007 8.87456 16.1113 9.01124 15.9699L15.9892 8.98987C16.1299 8.84917 16.3208 8.77013 16.5197 8.77013C16.7187 8.77013 16.9095 8.84917 17.0502 8.98987C17.1909 9.13056 17.27 9.32139 17.27 9.52037C17.27 9.71934 17.1909 9.91017 17.0502 10.0509Z" />
//                 </svg>
//               )}
//               <p>{isEditMode ? "Edit Sales Order" : "New Sales Order"}</p>
//               {salesStatus && (
//                 <h3 className={
//                   salesStatus === "Draft"               ? "createNewSales-Status-draft"              :
//                   salesStatus === "Submitted"           ? "createNewSales-Status-submitted"          :
//                   salesStatus === "Submitted(PD)"       ? "createNewSales-Status-SubmittedPD"        :
//                   salesStatus === "Delivered"           ? "createNewSales-Status-Delivered"          :
//                   salesStatus === "Cancelled"           ? "createNewSales-Status-Cancelled"          :
//                   salesStatus === "Partially Delivered" ? "createNewSales-Status-partiallyDelivered" : ""
//                 }>Status: {salesStatus}</h3>
//               )}
//             </nav>
//             <div>
//               <button
//                 className={["Submitted","Submitted(PD)"].includes(salesStatus) ? "createNewSales-active-btn" : "createNewSales-inactive-btn"}
//                 disabled={salesBtn.generate_delivery_note}
//                 onClick={handleGenerateDeliveryNote}
//               >Generate Delivery Note</button>
//               <button
//                 className={salesStatus === "Submitted" ? "createNewSales-active-btn" : "createNewSales-inactive-btn"}
//                 disabled={salesBtn.generate_invoice}
//                 onClick={(e) => { e.preventDefault(); setCurrentPage("createNewInvoice"); }}
//               >Generate Invoice</button>
//               <div className="createNewSales-close" onClick={() => prevPage(-1)}>
//                 <svg className="createNewSales-circle-x-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
//                   <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
//                 </svg>
//                 <p>Close</p>
//               </div>
//             </div>
//           </div>

//           {/* ── BASIC INFO ── */}
//           <div className="createNewSales-input-container">
//             <div className="createNewSales-input-box">
//               <label>Sales Order ID (Auto Generate)</label>
//               <input type="text" value={salesData.sales_order_id} placeholder="Auto Generate" disabled />
//             </div>
//             <div className="createNewSales-input-box">
//               <label htmlFor="order_date">Order Date<sup>*</sup></label>
//               <input id="order_date" value={salesData.order_date} onChange={handleSalesDataChange} type="date" required disabled={salesBtn.BtnAccess} />
//             </div>
//           </div>
//           <div className="createNewSales-input-container">
//             <div className="createNewSales-input-box">
//               <label htmlFor="sales_rep">Sales Rep<sup>*</sup></label>
//               <select id="sales_rep" value={salesData.sales_rep} onChange={handleSalesDataChange} required disabled={salesBtn.BtnAccess}>
//                 <option value="">Select Sales Rep</option>
//                 {sales_rep.map((ele, ind) => <option key={ind} value={ele}>{ele}</option>)}
//               </select>
//             </div>
//             <div className="createNewSales-input-box">
//               <label htmlFor="order_type">Order Type<sup>*</sup></label>
//               <select id="order_type" value={salesData.order_type} onChange={handleSalesDataChange} required disabled={salesBtn.BtnAccess}>
//                 <option value="">Select Order</option>
//                 <option value="Standard">Standard</option>
//                 <option value="Rush">Rush</option>
//                 <option value="Backorder">Backorder</option>
//               </select>
//             </div>
//           </div>

//           {/* ── CUSTOMER INFORMATION ── */}
//           <nav className="createNewSales-subtit">Customer Information</nav>
//           <div className="createNewSales-input-container">
//             <div className="createNewSales-input-box">
//               <label htmlFor="customer_name">Customer Name<sup>*</sup></label>
//               <select id="customer_name" value={salesData.customer_name} onChange={handleSalesDataChange} disabled={salesBtn.BtnAccess}>
//                 <option value="">Select Customer</option>
//                 {prevsalesData.map((ele, ind) => <option key={ind} value={ele.customer_name}>{ele.customer_name}</option>)}
//               </select>
//             </div>
//             <div className="createNewSales-input-box">
//               <label>Customer ID (Auto Generate)</label>
//               <input type="text" value={salesData.customer_id} placeholder="Auto Generate" disabled />
//             </div>
//           </div>
//           <div className="createNewSales-input-container">
//             <div className="createNewSales-input-box">
//               <label htmlFor="billing_address">Billing Address<sup>*</sup></label>
//               <input id="billing_address" value={salesData.billing_address} onChange={handleSalesDataChange} type="text" placeholder="Enter Address" required disabled={salesBtn.BtnAccess} />
//             </div>
//             <div className="createNewSales-input-box">
//               <label htmlFor="shipping_address">Shipping Address<sup>*</sup></label>
//               <input id="shipping_address" value={salesData.shipping_address} onChange={handleSalesDataChange} type="text" placeholder="Enter Address" required disabled={salesBtn.BtnAccess} />
//             </div>
//           </div>
//           <div className="createNewSales-input-container">
//             <div className="createNewSales-input-box">
//               <label htmlFor="email_id">Email ID<sup>*</sup></label>
//               <input id="email_id" value={salesData.email_id} onChange={handleSalesDataChange} type="email" placeholder="Enter Email" required disabled={salesBtn.BtnAccess} />
//             </div>
//             <div className="createNewSales-input-box">
//               <label htmlFor="phone_number">Phone Number<sup>*</sup></label>
//               <input id="phone_number" value={salesData.phone_number} onChange={handleSalesDataChange} className="increment-decrement-createNewSales" type="number" placeholder="Enter Phone" required disabled={salesBtn.BtnAccess} />
//             </div>
//           </div>

//           {/* ── PAYMENT DETAILS ── */}
//           <nav className="createNewSales-subtit">Payment Details</nav>
//           <div className="createNewSales-input-container">
//             <div className="createNewSales-input-box">
//               <label htmlFor="payment_method">Payment Method</label>
//               <select id="payment_method" value={salesData.payment_method} onChange={handleSalesDataChange} disabled={salesBtn.BtnAccess}>
//                 <option value="">Select Payment</option>
//                 <option value="Credit Card">Credit Card</option>
//                 <option value="Bank Transfer">Bank Transfer</option>
//                 <option value="COD">COD</option>
//                 <option value="PayPal">PayPal</option>
//               </select>
//             </div>
//             <div className="createNewSales-input-box">
//               <label htmlFor="currency">Currency<sup>*</sup></label>
//               <select id="currency" value={salesData.currency} onChange={handleSalesDataChange} required disabled={salesBtn.BtnAccess}>
//                 <option value="">Select Currency</option>
//                 <option value="USD">USD</option>
//                 <option value="EUR">EUR</option>
//                 <option value="INR">INR</option>
//                 <option value="GBP">GBP</option>
//                 <option value="SGD">SGD</option>
//               </select>
//             </div>
//           </div>
//           <div className="createNewSales-input-container">
//             <div className="createNewSales-input-box">
//               <label htmlFor="due_date">Due Date</label>
//               <input id="due_date" value={salesData.due_date} onChange={handleSalesDataChange} type="date" disabled={salesBtn.BtnAccess} />
//             </div>
//             <div className="createNewSales-input-box">
//               <label htmlFor="terms_conditions">Terms & Conditions</label>
//               <input id="terms_conditions" value={salesData.terms_conditions} onChange={handleSalesDataChange} type="text" placeholder="Enter Terms & Conditions" disabled={salesBtn.BtnAccess} />
//             </div>
//           </div>

//           {/* ── LOGISTICS & NOTES ── */}
//           <nav className="createNewSales-subtit">Logistics & Notes</nav>
//           <div className="createNewSales-input-container">
//             <div className="createNewSales-input-box">
//               <label htmlFor="shipping_method">Shipping Method</label>
//               <select id="shipping_method" value={salesData.shipping_method} onChange={handleSalesDataChange} disabled={salesBtn.BtnAccess}>
//                 <option value="">Select Shipping</option>
//                 <option value="DHL">DHL</option>
//                 <option value="FedEx">FedEx</option>
//                 <option value="UPS">UPS</option>
//                 <option value="Local Courier">Local Courier</option>
//               </select>
//             </div>
//             <div className="createNewSales-input-box">
//               <label htmlFor="expected_delivery">Expected Delivery</label>
//               <input id="expected_delivery" value={salesData.expected_delivery} onChange={handleSalesDataChange} type="date" disabled={salesBtn.BtnAccess} />
//             </div>
//           </div>
//           <div className="createNewSales-input-container">
//             <div className="createNewSales-input-box">
//               <label htmlFor="tracking_number">Tracking Number</label>
//               <input id="tracking_number" type="text" value={salesData.tracking_number} onChange={handleSalesDataChange} disabled={salesBtn.BtnAccess} placeholder="Enter tracking number" />
//             </div>
//             <div className="createNewSales-input-box">
//               <label htmlFor="internal_notes">Internal Notes</label>
//               <input id="internal_notes" type="text" value={salesData.internal_notes} onChange={handleSalesDataChange} placeholder="Enter Internal Notes" disabled={salesBtn.BtnAccess} />
//             </div>
//           </div>
//           <div className="createNewSales-input-container">
//             <div className="createNewSales-input-box">
//               <label htmlFor="customer_notes">Customer Notes</label>
//               <input id="customer_notes" type="text" value={salesData.customer_notes} onChange={handleSalesDataChange} placeholder="Enter Customer Notes" disabled={salesBtn.BtnAccess} />
//             </div>
//           </div>

//           {/* ── ORDER LINE ITEMS ── */}
//           <nav className="createNewSales-subtit">Order Line Items<sup>*</sup></nav>
//           <div className="createNewSales-table-container">
//             <table>
//               <thead className="createNewSales-table-head">
//                 <tr>
//                   <th id="createNewSales-table-smallwidth">#</th>
//                   <th>Product Name</th>
//                   <th id="createNewSales-table-minwidth">Product ID</th>
//                   <th id="createNewSales-table-minwidth">In Stock</th>
//                   <th>Quantity</th>
//                   <th>UOM</th>
//                   <th>Unit Price</th>
//                   <th>Tax (%)</th>
//                   <th>Discount (%)</th>
//                   <th>Total</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody className="createNewSales-table-body">
//                 {[...Array(numOfSalesList)].map((_, ind) => (
//                   <SalesListItems
//                     key={SalesList_data[ind]?.unique_key ?? ind}
//                     unique_key={ind}
//                     sales_table_data={sales_table_data}
//                     setSalesList_data={setSalesList_data}
//                     productTotal={productTotal}
//                     deleteSalesProduct={deleteSalesProduct}
//                     salesData={salesData}
//                     btnAccess={salesBtn.BtnAccess}
//                   />
//                 ))}
//                 <tr>
//                   <td></td>
//                   <td>
//                     <button
//                       onClick={(e) => {
//                         e.preventDefault();
//                         setSalesList_data((prev) => [...prev, { unique_key: numOfSalesList }]);
//                         setnumOfSalesList((prev) => prev + 1);
//                       }}
//                       disabled={salesBtn.BtnAccess}
//                     >+ Add Item</button>
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>

//           {/* ── ORDER SUMMARY ── */}
//           <nav className="createNewSales-subtit">Order Summary</nav>
//           <div className="createNewSales-totals-container">
//             <nav><h5>Subtotal</h5><p>{calculateSubtotal()}</p></nav>
//             <nav>
//               <h5>Global Discount (%)</h5>
//               <input type="number" value={salesData.global_discount}
//                 onChange={(e) => setSalesData((prev) => ({ ...prev, global_discount: parseFloat(e.target.value) || 0 }))}
//                 disabled={salesBtn.BtnAccess} />
//             </nav>
//             <nav><h5>Tax Summary</h5><p>{calculateTaxSummery()}</p></nav>
//             <nav>
//               <h5>
//                 Shipping Charges
//                 {salesData.currency === "INR" && <span> (₹)</span>}
//                 {salesData.currency === "USD" && <span> ($)</span>}
//                 {salesData.currency === "GBP" && <span> (£)</span>}
//                 {salesData.currency === "SGD" && <span> (S$)</span>}
//                 {salesData.currency === "EUR" && <span> (€)</span>}
//               </h5>
//               <input type="number" value={salesData.shipping_charges}
//                 onChange={(e) => setSalesData((prev) => ({ ...prev, shipping_charges: parseFloat(e.target.value) || 0 }))}
//                 disabled={salesBtn.BtnAccess} />
//             </nav>
//             <nav><h5>Rounding Adjustment</h5><p>{roundedvalue()}</p></nav>
//             <nav className="createNewSales-totals-container-bg">
//               <h5>Grand Total</h5>
//               <p>
//                 {salesData.currency === "INR" && <span>₹</span>}
//                 {salesData.currency === "USD" && <span>$</span>}
//                 {salesData.currency === "GBP" && <span>£</span>}
//                 {salesData.currency === "SGD" && <span>S$</span>}
//                 {salesData.currency === "EUR" && <span>€</span>}
//                 {roundedGrandTotal()}
//               </p>
//             </nav>
//           </div>

//           {/* ── COMMENTS / HISTORY HUB ── */}
//           <div className="createNewSales-hub-container">
//             <div className="createNewSales-hub-head">
//               <p className={feacher.showChat    ? "createNewSales-hub-head-bg-black" : "createNewSales-hub-head-tit"} onClick={() => setFeacher({ showChat: true,  showHistory: false })}>Comments</p>
//               <p className={feacher.showHistory ? "createNewSales-hub-head-bg-black" : "createNewSales-hub-head-tit"} onClick={() => setFeacher({ showChat: false, showHistory: true  })}>History</p>
//             </div>
//             <div className="createNewSales-hub-body">
//               {feacher.showChat    && <CreateNewSalesComment orderId={dbOrderId} initialComments={orderComments} />}
//               {feacher.showHistory && <CreateNewSalesHistory initialHistory={orderHistory} />}
//             </div>
//           </div>

//           {/* ── ACTION BUTTONS ── */}
//           <div className="createNewSales-btn-container">
//             <button
//               style={{ width: "max-content" }}
//               className={["Submitted","Submitted(PD)","Cancelled"].includes(salesStatus) ? "createNewSales-order-active-btn" : "createNewSales-inactive-btn"}
//               onClick={handleCancelOrderState}
//               disabled={salesBtn.cancel_order || isSaving}
//             >{salesStatus === "Cancelled" ? "Cancelled" : "Cancel Order"}</button>

//             <nav>
//               <button className="createNewSales-cancel-btn" onClick={(e) => { e.preventDefault(); prevPage(-1); }} disabled={salesBtn.cancel}>Cancel</button>
//               <button
//                 className={["Draft",""].includes(salesStatus) ? "createNewSales-active-btn" : "createNewSales-completed-btn"}
//                 onClick={handleSaveDraftState} disabled={salesBtn.save_draft || isSaving}
//               >{isSaving ? "Saving…" : "Save Draft"}</button>
//               <button
//                 className={["Draft","Submitted(PD)",""].includes(salesStatus) ? "createNewSales-active-btn" : "createNewSales-completed-btn"}
//                 disabled={salesBtn.submit || isSaving}
//               >{isSaving ? "Submitting…" : "Submit"}</button>
//               <button
//                 className={
//                   salesStatus === "" || salesStatus === "Submitted" ||
//                   (salesStatus === "Submitted(PD)" && purchase_order !== "Purchase Ordered") ||
//                   (salesStatus === "Draft"         && purchase_order !== "Purchase Ordered")
//                     ? "createNewSales-active-btn" : "createNewSales-completed-btn"
//                 }
//                 disabled={salesBtn.Generate_po || isSaving}
//               >Generate (PO)</button>

//               <svg className={salesStatus !== "" ? "createNewSales-pdf-mail-activelogo" : "createNewSales-pdf-mail-futurelogo"}
//                 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 24" fill="none">
//                 <path fillRule="evenodd" clipRule="evenodd" d="M0.600098 2.4C0.600098 1.76348 0.852954 1.15303 1.30304 0.702944C1.75313 0.252856 2.36358 0 3.0001 0L16.1313 0L21.4001 5.2688V21.6C21.4001 22.2365 21.1472 22.847 20.6972 23.2971C20.2471 23.7471 19.6366 24 19.0001 24H3.0001C2.36358 24 1.75313 23.7471 1.30304 23.2971C0.852954 22.847 0.600098 22.2365 0.600098 21.6V2.4ZM4.6001 9.6H2.2001V17.6H3.8001V14.4H4.6001C5.23662 14.4 5.84707 14.1471 6.29715 13.6971C6.74724 13.247 7.0001 12.6365 7.0001 12C7.0001 11.3635 6.74724 10.753 6.29715 10.3029C5.84707 9.85286 5.23662 9.6 4.6001 9.6ZM11.0001 9.6H8.6001V17.6H11.0001C11.6366 17.6 12.2471 17.3471 12.6972 16.8971C13.1472 16.447 13.4001 15.8365 13.4001 15.2V12C13.4001 11.3635 13.1472 10.753 12.6972 10.3029C12.2471 9.85286 11.6366 9.6 11.0001 9.6ZM15.0001 17.6V9.6H19.8001V11.2H16.6001V12.8H18.2001V14.4H16.6001V17.6H15.0001Z" />
//               </svg>
//               <svg className={salesStatus !== "" ? "createNewSales-pdf-mail-activelogo" : "createNewSales-pdf-mail-futurelogo"}
//                 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 16" fill="none">
//                 <path d="M2 16C1.45 16 0.979333 15.8043 0.588 15.413C0.196667 15.0217 0.000666667 14.5507 0 14V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196666 1.45067 0.000666667 2 0H18C18.55 0 19.021 0.196 19.413 0.588C19.805 0.98 20.0007 1.45067 20 2V14C20 14.55 19.8043 15.021 19.413 15.413C19.0217 15.805 18.5507 16.0007 18 16H2ZM10 8.825C10.0833 8.825 10.171 8.81233 10.263 8.787C10.355 8.76167 10.4423 8.72433 10.525 8.675L17.6 4.25C17.7333 4.16667 17.8333 4.06267 17.9 3.938C17.9667 3.81333 18 3.67567 18 3.525C18 3.19167 17.8583 2.94167 17.575 2.775C17.2917 2.60833 17 2.61667 16.7 2.8L10 7L3.3 2.8C3 2.61667 2.70833 2.61267 2.425 2.788C2.14167 2.96333 2 3.209 2 3.525C2 3.69167 2.03333 3.83767 2.1 3.963C2.16667 4.08833 2.26667 4.184 2.4 4.25L9.475 8.675C9.55833 8.725 9.646 8.76267 9.738 8.788C9.83 8.81333 9.91733 8.82567 10 8.825Z" />
//               </svg>
//             </nav>
//           </div>

//         </form>
//       </div>
//     </>
//   );
// }
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./createNewSales.css";
import SalesListItems from "./salesListItems";
import CreatNewSalesStockAlert from "./creatNewSalesStockAlert";
import CreateNewSalesHistory from "./createNewSalesHistory";
import CreateNewSalesComment from "./createNewSalesComment";
import { toast } from "react-toastify";
import salesOrderApiProvider from "../../../network/salesOrder-api-provider";
import productApiProvider from "../../../network/product-api-provider";
import userApiProvider from "../../../network/user-api-provider";
import ApiClient from "../../../network/api-client";

// ─── build initial customer+rep lists synchronously from order data ───────────
function buildInitialDropdowns(order) {
  const customers = [];
  const reps      = [];
  if (!order || !Object.keys(order).length) return { customers, reps };

  const c = order.customer;
  if (c) {
    const lastName     = c.last_name || "";
    const customerName = lastName
      ? `${c.first_name || ""} ${lastName}`.trim()
      : c.first_name || "";
    customers.push({
      id:               c.id,
      customer_name:    customerName,
      customer_id:      c.customer_id      || "",
      billing_address:  c.billing_address  || "",
      shipping_address: c.shipping_address || "",
      email_id:         c.email            || "",
      phone_number:     c.phone_number     || "",
    });
  }
  if (order.sales_rep) reps.push(order.sales_rep);

  return { customers, reps };
}

// ─── map API order object → flat form fields ──────────────────────────────────
function mapOrderToForm(order) {
  if (!order || !Object.keys(order).length) return null;
  const c        = order.customer || {};
  const lastName = c.last_name   || "";
  const customerName = lastName
    ? `${c.first_name || ""} ${lastName}`.trim()
    : c.first_name || "";

  return {
    sales_order_id:    order.sales_order_id    || "",
    order_date:        order.order_date         || "",
    sales_rep:         order.sales_rep          || "",
    order_type:        order.order_type         || "",
    customer_name:     customerName,
    customer_id:       c.customer_id            || "",
    billing_address:   c.billing_address        || "",
    shipping_address:  c.shipping_address       || "",
    email_id:          c.email                  || "",
    phone_number:      c.phone_number           || "",
    payment_method:    order.payment_method     || "",
    currency:          order.currency           || "",
    due_date:          order.due_date           || "",
    terms_conditions:  order.terms_conditions   || "",
    shipping_method:   order.shipping_method    || "",
    expected_delivery: order.expected_delivery  || "",
    tracking_number:   order.tracking_number    || "",
    internal_notes:    order.internal_notes     || "",
    customer_notes:    order.customer_notes     || "",
    global_discount:   parseFloat(order.global_discount)  || 0,
    shipping_charges:  parseFloat(order.shipping_charges) || 0,
    _customerId:       c.id                     || null,
    _salesRepId:       order.sales_rep_id       || null,
  };
}

// ─── map API items → table rows ───────────────────────────────────────────────
function mapItemsToList(items = []) {
  return items.map((item, index) => ({
    unique_key:         index,
    item_id:            item.id,
    product_numeric_id: item.product,
    product_id:         item.product_id_display || "",
    product_name:       item.product_name       || "",
    uom:                String(item.uom  ?? ""),
    uom_id:             String(item.uom  ?? ""),
    unit_price:         item.unit_price,
    discount:           item.discount,
    tax:                item.tax_rate,
    tax_id:             String(item.tax  ?? ""),
    quantity:           item.quantity,
    stock_level:        999,
    total:              item.total,
  }));
}

const emptyForm = {
  sales_order_id:    "",
  order_date:        "",
  sales_rep:         "",
  order_type:        "",
  customer_name:     "",
  customer_id:       "",
  billing_address:   "",
  shipping_address:  "",
  email_id:          "",
  phone_number:      "",
  payment_method:    "",
  currency:          "",
  due_date:          "",
  terms_conditions:  "",
  shipping_method:   "",
  expected_delivery: "",
  tracking_number:   "",
  internal_notes:    "",
  customer_notes:    "",
  global_discount:   0,
  shipping_charges:  0,
  _customerId:       null,
  _salesRepId:       null,
};

export default function CreateNewSales({
  setCurrentPage,
  editSalesOrderData = {},
  isEdit = false,
}) {
  const isEditMode = isEdit && Object.keys(editSalesOrderData).length > 0;
  const prevPage   = useNavigate();

  const [pageLoading,   setPageLoading]   = useState(isEditMode);
  const [masterLoading, setMasterLoading] = useState(true);

  const suppressCustomerEffect = useRef(isEditMode);

  // seed dropdowns synchronously so <select> has options on frame 1
  const { customers: initialCustomers, reps: initialReps } =
    buildInitialDropdowns(isEditMode ? editSalesOrderData : null);

  // ─── core state ───────────────────────────────────────────────────────────
  const [salesData,      setSalesData]      = useState(emptyForm);
  const [salesStatus,    setSalesStatus]    = useState("");
  const [SalesList_data, setSalesList_data] = useState([{ unique_key: 0 }]);
  const [numOfSalesList, setnumOfSalesList] = useState(1);
  const [dbOrderId,      setDbOrderId]      = useState(
    isEditMode ? editSalesOrderData.id || null : null
  );
  const [purchase_order,  setPurchase_order]  = useState("");
  const [orderHistory,    setOrderHistory]    = useState([]);
  const [orderComments,   setOrderComments]   = useState([]);

  // ─── dropdown lists ───────────────────────────────────────────────────────
  const [prevsalesData,    setprevsalesData]    = useState(initialCustomers);
  const [sales_table_data, setSales_table_data] = useState([]);
  const [sales_rep,        setSales_rep]        = useState(initialReps);

  const [feacher,    setFeacher]    = useState({ showChat: true, showHistory: false });
  const [stockAlert, setStockAlert] = useState(false);
  const [isSaving,   setIsSaving]   = useState(false);

  const [salesBtn, setSalesBtn] = useState({
    BtnAccess:              false,
    cancel:                 false,
    cancel_order:           true,
    save_draft:             false,
    submit:                 false,
    Generate_po:            false,
    pdf:                    true,
    email:                  true,
    generate_delivery_note: true,
    generate_invoice:       true,
  });

  // ─── apply a full order object into all state ─────────────────────────────
  function applyOrderToState(order) {
    const mapped = mapOrderToForm(order);
    if (!mapped) return;

    suppressCustomerEffect.current = true;
    setSalesData(mapped);
    setSalesStatus(order.status || "");
    setDbOrderId(order.id || null);
    setPurchase_order(order.purchase_order_status || "");
    setOrderHistory(order.history   || []);
    setOrderComments(order.comments || []);

    if (order.items?.length > 0) {
      const rows = mapItemsToList(order.items);
      setSalesList_data(rows);
      setnumOfSalesList(rows.length);
    } else {
      setSalesList_data([{ unique_key: 0 }]);
      setnumOfSalesList(1);
    }

    // ensure this order's customer + rep exist in dropdown
    const { customers, reps } = buildInitialDropdowns(order);
    if (customers.length) {
      setprevsalesData((prev) => {
        const merged = [...prev];
        for (const c of customers) {
          if (!merged.some((x) => x.customer_id === c.customer_id)) {
            merged.unshift(c);
          }
        }
        return merged;
      });
    }
    if (reps.length) {
      setSales_rep((prev) => {
        const merged = [...prev];
        for (const r of reps) {
          if (!merged.includes(r)) merged.unshift(r);
        }
        return merged;
      });
    }
  }

  // ─── fetch single order detail ────────────────────────────────────────────
  async function fetchOrderDetail(id) {
    try {
      const res = await ApiClient.get(`crm/sales-orders/${id}/`);
      if (res.status === 200) {
        return res.data?.data ?? res.data;
      }
      return null;
    } catch (err) {
      console.error("Failed to fetch order detail", err);
      return null;
    }
  }

  // ─── fetch products, customers, sales reps ────────────────────────────────
  async function loadMasterData() {
    setMasterLoading(true);
    try {
      // ── Products ──────────────────────────────────────────────────────────
      const productRes = await productApiProvider.fetchProducts(1, "");
      const rawProducts =
        productRes?.data?.data ??
        productRes?.data ??
        productRes?.results ??
        [];
      setSales_table_data(rawProducts);

      // ── Customers ─────────────────────────────────────────────────────────
      try {
        const custRes = await ApiClient.get("masters/customers/");
        const rawCustomers =
          custRes?.data?.data?.data ??
          custRes?.data?.data ??
          custRes?.data?.results ??
          custRes?.data ??
          [];

        const mappedCustomers = rawCustomers.map((c) => {
          const lastName     = c.last_name || "";
          const customerName = lastName
            ? `${c.first_name || ""} ${lastName}`.trim()
            : c.first_name || c.customer_name || "";
          return {
            id:               c.id,
            customer_name:    customerName,
            customer_id:      c.customer_id      || "",
            billing_address:  c.billing_address  || "",
            shipping_address: c.shipping_address || "",
            email_id:         c.email            || "",
            phone_number:     c.phone_number     || "",
          };
        });

        setprevsalesData((prev) => {
          const merged = [...prev];
          for (const c of mappedCustomers) {
            if (!merged.some((x) => x.customer_id === c.customer_id)) {
              merged.push(c);
            }
          }
          return merged;
        });
      } catch (err) {
        console.error("Failed to load customers", err);
      }

      // ── Sales Reps — from /masters/users/, Sales department only ──────────
      // name stored in sales order is just first_name e.g. "Sales1", "Sales2"
     // ── Sales Reps — fetch all users, filter Sales dept ──────────────────
try {
  const allUsers = await userApiProvider.fetchAllUsers();

  const repNames = allUsers
    .filter((u) => {
      const deptName = u.department?.department_name || "";
      return deptName.toLowerCase().includes("sales");
    })
    .map((u) => u.first_name)
    .filter(Boolean);

  setSales_rep((prev) => {
    const merged = [...prev];
    for (const name of repNames) {
      if (!merged.includes(name)) merged.push(name);
    }
    return merged;
  });
} catch (err) {
  console.error("Failed to load sales reps", err);
}

    } catch (err) {
      console.error("Failed to load master data", err);
      toast.error("Failed to load form data");
    } finally {
      setMasterLoading(false);
    }
  }

  // ─── ON MOUNT: fetch master data + order detail in parallel ───────────────
  useEffect(() => {
    async function init() {
      const orderId = isEditMode ? editSalesOrderData.id : null;

      const [, orderDetail] = await Promise.all([
        loadMasterData(),
        orderId ? fetchOrderDetail(orderId) : Promise.resolve(null),
      ]);

      if (orderDetail) {
        applyOrderToState(orderDetail);
      } else if (isEditMode) {
        // fallback to prop data if detail fetch fails
        applyOrderToState(editSalesOrderData);
      }

      setPageLoading(false);
    }

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── field change ─────────────────────────────────────────────────────────
  const handleSalesDataChange = (e) => {
    setSalesData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  // ─── customer autofill ────────────────────────────────────────────────────
  useEffect(() => {
    if (suppressCustomerEffect.current) {
      suppressCustomerEffect.current = false;
      return;
    }
    const selected = salesData.customer_name;
    if (!selected) return;

    const customer = prevsalesData.find((c) => c.customer_name === selected);
    if (customer) {
      setSalesData((prev) => ({
        ...prev,
        customer_id:      customer.customer_id,
        billing_address:  customer.billing_address,
        shipping_address: customer.shipping_address,
        email_id:         customer.email_id,
        phone_number:     customer.phone_number,
        _customerId:      customer.id || null,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salesData.customer_name]);

  // ─── button state from salesStatus ───────────────────────────────────────
  useEffect(() => {
    if (salesStatus === "") {
      setSalesBtn({
        BtnAccess:              false,
        cancel:                 false,
        cancel_order:           true,
        save_draft:             false,
        submit:                 false,
        Generate_po:            false,
        pdf:                    true,
        email:                  true,
        generate_delivery_note: true,
        generate_invoice:       true,
      });
      return;
    }
    switch (salesStatus) {
      case "Draft":
        setSalesBtn({
          BtnAccess:              false,
          cancel:                 false,
          cancel_order:           false,
          save_draft:             false,
          submit:                 false,
          Generate_po:            purchase_order === "Purchase Ordered",
          pdf:                    false,
          email:                  false,
          generate_delivery_note: true,
          generate_invoice:       true,
        });
        break;
      case "Submitted(PD)":
        setSalesBtn({
          BtnAccess:              false,
          cancel:                 false,
          cancel_order:           false,
          save_draft:             true,
          submit:                 true,
          Generate_po:            purchase_order === "Purchase Ordered",
          pdf:                    false,
          email:                  false,
          generate_delivery_note: false,
          generate_invoice:       true,
        });
        break;
      case "Submitted":
        setSalesBtn({
          BtnAccess:              true,
          cancel:                 false,
          cancel_order:           false,
          save_draft:             true,
          submit:                 true,
          Generate_po:            false,
          pdf:                    false,
          email:                  false,
          generate_delivery_note: false,
          generate_invoice:       false,
        });
        break;
      case "Partially Delivered":
        setSalesBtn({
          BtnAccess:              true,
          cancel:                 false,
          cancel_order:           false,
          save_draft:             true,
          submit:                 true,
          Generate_po:            false,
          pdf:                    false,
          email:                  false,
          generate_delivery_note: false,
          generate_invoice:       true,
        });
        break;
      case "Delivered":
        setSalesBtn({
          BtnAccess:              true,
          cancel:                 true,
          cancel_order:           true,
          save_draft:             true,
          submit:                 true,
          Generate_po:            true,
          pdf:                    false,
          email:                  false,
          generate_delivery_note: true,
          generate_invoice:       true,
        });
        break;
      case "Cancelled":
        setSalesBtn({
          BtnAccess:              true,
          cancel:                 false,
          cancel_order:           true,
          save_draft:             true,
          submit:                 true,
          Generate_po:            true,
          pdf:                    false,
          email:                  false,
          generate_delivery_note: true,
          generate_invoice:       true,
        });
        break;
      default:
        setSalesBtn((prev) => ({ ...prev, BtnAccess: false }));
    }
  }, [salesStatus, purchase_order]);

  // ─── build payload ────────────────────────────────────────────────────────
  function buildPayload(status) {
  return {
    customer:          salesData._customerId,
    sales_rep:         salesData._salesRepId || null,
    order_date:        salesData.order_date,
    order_type:        salesData.order_type,
    payment_method:    salesData.payment_method,
    currency:          salesData.currency,
    due_date:          salesData.due_date          || null,
    terms_conditions:  salesData.terms_conditions,
    shipping_method:   salesData.shipping_method,
    expected_delivery: salesData.expected_delivery || null,
    tracking_number:   salesData.tracking_number,
    internal_notes:    salesData.internal_notes,
    customer_notes:    salesData.customer_notes,
    global_discount:   salesData.global_discount,
    shipping_charges:  salesData.shipping_charges,
    status:            status || undefined,
    items: SalesList_data
  .filter((r) => r.product_numeric_id || r.product)
  .map((row) => {
    const uomVal = parseInt(row.uom_id || row.uom);
    const taxVal = parseInt(row.tax_id || row.tax);
    return {
      ...(row.item_id ? { id: parseInt(row.item_id) } : {}),
      product:    parseInt(row.product_numeric_id || row.product),
      // only include uom/tax if they parsed to a valid number
      ...(Number.isFinite(uomVal) ? { uom: uomVal } : {}),
      unit_price: parseFloat(row.unit_price)  || 0,
      discount:   parseFloat(row.discount)    || 0,
      ...(Number.isFinite(taxVal) ? { tax: taxVal } : {}),
      quantity:   parseInt(row.quantity)      || 0,
    };
  }),
  };
}

  // ─── save draft ───────────────────────────────────────────────────────────
  const handleSaveDraftState = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = buildPayload("Draft");
      let result;
      if (dbOrderId) {
        result = await salesOrderApiProvider.updateSalesOrder(dbOrderId, payload);
      } else {
        result = await salesOrderApiProvider.createSalesOrder(payload);
        if (result?.id) setDbOrderId(result.id);
      }
      if (result) { setSalesStatus("Draft"); toast.success("Saved as Draft"); }
    } finally {
      setIsSaving(false);
    }
  };

  // ─── submit ───────────────────────────────────────────────────────────────
  const handleSubmitState = async (e) => {
    e.preventDefault();
    const validRows = SalesList_data.filter((r) => r.product_numeric_id || r.product);
    if (validRows.length === 0) {
      toast.error("Add at least one product before submitting");
      return;
    }
    const isStockOK = validRows.every(
      ({ quantity = 0, stock_level = 0 }) =>
        Number(stock_level) > 0 && Number(stock_level) >= Number(quantity)
    );
    if (!isStockOK) { setStockAlert(true); return; }

    setIsSaving(true);
    try {
      let savedOrder;
      if (dbOrderId) {
        savedOrder = await salesOrderApiProvider.updateSalesOrder(dbOrderId, buildPayload());
      } else {
        savedOrder = await salesOrderApiProvider.createSalesOrder(buildPayload());
        if (savedOrder?.id) setDbOrderId(savedOrder.id);
      }
      if (!savedOrder) return;

      const actionRes = await salesOrderApiProvider.salesOrderAction(
        savedOrder.id || dbOrderId, "submit"
      );
      if (
        actionRes?.status === "Submitted" ||
        actionRes?.message?.toLowerCase().includes("submitted")
      ) {
        setSalesStatus("Submitted");
        toast.success("Sales order submitted successfully");
      } else if (actionRes?.error_code === "insufficient_stock") {
        setStockAlert(true);
      } else {
        toast.error(actionRes?.message || "Submission failed");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // ─── cancel order ─────────────────────────────────────────────────────────
  const handleCancelOrderState = async (e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to Cancel Order?")) return;
    setIsSaving(true);
    try {
      if (dbOrderId) {
        const res = await salesOrderApiProvider.salesOrderAction(dbOrderId, "cancel");
        if (res) { setSalesStatus("Cancelled"); toast.success("Sales order cancelled"); }
      } else {
        setSalesStatus("Cancelled");
        toast.success("Sales order cancelled");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // ─── generate delivery note ───────────────────────────────────────────────
  const handleGenerateDeliveryNote = async (e) => {
    e.preventDefault();
    if (!dbOrderId) { toast.error("Save the order first"); return; }
    setIsSaving(true);
    try {
      const res = await salesOrderApiProvider.generateDeliveryNote(dbOrderId);
      if (res) setCurrentPage("createNewDelivery");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePdf = async (e) => {
    e.preventDefault();
    if (!dbOrderId) return;
    try { await salesOrderApiProvider.downloadPdf(dbOrderId); }
    catch { toast.error("Failed to download PDF"); }
  };

  const handleEmail = async (e) => {
    e.preventDefault();
    if (!dbOrderId) return;
    try { await salesOrderApiProvider.sendEmail(dbOrderId); toast.success("Email sent"); }
    catch { toast.error("Failed to send email"); }
  };

  // ─── totals ───────────────────────────────────────────────────────────────
  function productTotal(ind) {
    const data = SalesList_data[ind];
    if (!data) return "0.00";
    const q = parseFloat(data.quantity)   || 0;
    const u = parseFloat(data.unit_price) || 0;
    const d = parseFloat(data.discount)   || 0;
    const t = parseFloat(data.tax)        || 0;
    const taxed = q * u + (q * u * t) / 100;
    return (taxed - (taxed * d) / 100).toFixed(2);
  }
  function calculateSubtotal() {
    return SalesList_data.reduce((acc, data) => {
      const q = parseFloat(data.quantity)   || 0;
      const u = parseFloat(data.unit_price) || 0;
      const d = parseFloat(data.discount)   || 0;
      const t = parseFloat(data.tax)        || 0;
      const taxed = q * u + (q * u * t) / 100;
      return acc + taxed - (taxed * d) / 100;
    }, 0).toFixed(2);
  }
  function calculateTaxSummery() {
    return SalesList_data.reduce((acc, data) => {
      const q = parseFloat(data.quantity)   || 0;
      const u = parseFloat(data.unit_price) || 0;
      const t = parseFloat(data.tax)        || 0;
      return acc + (q * u * t) / 100;
    }, 0).toFixed(2);
  }
  function calculateGrandTotal() {
    const sub = parseFloat(calculateSubtotal()) || 0;
    return (
      sub -
      (sub * (parseFloat(salesData.global_discount) || 0)) / 100 +
      (parseFloat(salesData.shipping_charges) || 0)
    ).toFixed(2);
  }
  function roundedGrandTotal() {
    const t = parseFloat(calculateGrandTotal());
    return t % 1 > 0.5 ? Math.ceil(t) : Math.floor(t);
  }
  function roundedvalue() {
    return (roundedGrandTotal() - parseFloat(calculateGrandTotal())).toFixed(2);
  }
  function deleteSalesProduct(ind) {
    if (!window.confirm("Are you sure you want to delete this Product?")) return;
    setSalesList_data((prev) => prev.filter((_, i) => i !== ind));
    setnumOfSalesList((prev) => prev - 1);
    toast.success("Product Item deleted!");
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  if (pageLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <p style={{ fontSize: "15px", color: "#888" }}>Loading order details…</p>
      </div>
    );
  }

  return (
    <>
      {stockAlert && (
        <div className="createNewSales-btn">
          <CreatNewSalesStockAlert
            setStockAlert={setStockAlert}
            setSalesStatus={setSalesStatus}
            purchase_order={purchase_order}
            SalesList_data={SalesList_data}
          />
        </div>
      )}

      <div className={`createNewSales-container ${stockAlert ? "createNewSales-blur" : ""}`}>
        <form onSubmit={handleSubmitState}>

          {/* ── HEAD ───────────────────────────────────────────────────── */}
          <div className="createNewSales-head">
            <nav>
              {salesStatus !== "" && (
                <svg
                  className={
                    purchase_order === "Purchase Ordered"     ? "createNewSales-purchase-order-tag"   :
                    purchase_order === "Purchase Ordered(PP)" ? "createNewSales-purchase-orderPP-tag" :
                    purchase_order === "Ready to Submit"      ? "createNewSales-readyTOsubmit-tag"    :
                    "createNewSales-purchase-tag"
                  }
                  xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"
                >
                  <path fillRule="evenodd" clipRule="evenodd" d="M0.123245 10.8159C0.410245 11.8189 1.18325 12.5909 2.72825 14.1359L4.55825 15.9659C7.24825 18.6569 8.59225 19.9999 10.2622 19.9999C11.9332 19.9999 13.2772 18.6559 15.9662 15.9669C18.6562 13.2769 20.0002 11.9329 20.0002 10.2619C20.0002 8.59187 18.6562 7.24687 15.9672 4.55787L14.1372 2.72787C12.5912 1.18287 11.8192 0.409866 10.8162 0.122866C9.81324 -0.165134 8.74825 0.0808662 6.61925 0.572866L5.39125 0.855866C3.59925 1.26887 2.70325 1.47587 2.08925 2.08887C1.47525 2.70187 1.27025 3.59987 0.856245 5.39087L0.572245 6.61887C0.0812454 8.74887 -0.163755 9.81287 0.123245 10.8159ZM8.12224 5.27087C8.31512 5.45687 8.469 5.67944 8.5749 5.92558C8.6808 6.17172 8.73659 6.4365 8.73902 6.70444C8.74145 6.97238 8.69046 7.23812 8.58904 7.48614C8.48763 7.73416 8.33781 7.95948 8.14833 8.14896C7.95886 8.33843 7.73354 8.48825 7.48552 8.58967C7.2375 8.69108 6.97176 8.74207 6.70382 8.73964C6.43588 8.73721 6.1711 8.68142 5.92496 8.57552C5.67882 8.46962 5.45625 8.31574 5.27025 8.12287C4.9033 7.74237 4.70039 7.23303 4.70518 6.70444C4.70998 6.17585 4.92208 5.67027 5.29587 5.29649C5.66965 4.9227 6.17523 4.7106 6.70382 4.7058C7.23241 4.70101 7.74175 4.90392 8.12224 5.27087ZM17.0502 10.0509L10.0712 17.0309C9.92973 17.1674 9.74024 17.2429 9.54359 17.2411C9.34695 17.2393 9.15887 17.1604 9.01988 17.0212C8.88089 16.8821 8.8021 16.694 8.80049 16.4973C8.79887 16.3007 8.87456 16.1113 9.01124 15.9699L15.9892 8.98987C16.1299 8.84917 16.3208 8.77013 16.5197 8.77013C16.7187 8.77013 16.9095 8.84917 17.0502 8.98987C17.1909 9.13056 17.27 9.32139 17.27 9.52037C17.27 9.71934 17.1909 9.91017 17.0502 10.0509Z" />
                </svg>
              )}
              <p>{isEditMode ? (salesStatus === "Draft" ? "Edit Sales Order" : "View Sales Order") : "New Sales Order"}</p>
              {salesStatus && (
                <h3 className={
                  salesStatus === "Draft"               ? "createNewSales-Status-draft"              :
                  salesStatus === "Submitted"           ? "createNewSales-Status-submitted"          :
                  salesStatus === "Submitted(PD)"       ? "createNewSales-Status-SubmittedPD"        :
                  salesStatus === "Delivered"           ? "createNewSales-Status-Delivered"          :
                  salesStatus === "Cancelled"           ? "createNewSales-Status-Cancelled"          :
                  salesStatus === "Partially Delivered" ? "createNewSales-Status-partiallyDelivered" : ""
                }>Status: {salesStatus}</h3>
              )}
            </nav>
            <div>
              <button
                className={["Submitted","Submitted(PD)","Partially Delivered"].includes(salesStatus) ? "createNewSales-active-btn" : "createNewSales-inactive-btn"}
                disabled={salesBtn.generate_delivery_note}
                onClick={handleGenerateDeliveryNote}
              >Generate Delivery Note</button>
              <button
                className={salesStatus === "Submitted" ? "createNewSales-active-btn" : "createNewSales-inactive-btn"}
                disabled={salesBtn.generate_invoice}
                onClick={(e) => { e.preventDefault(); setCurrentPage("createNewInvoice"); }}
              >Generate Invoice</button>
              <div className="createNewSales-close" onClick={() => prevPage(-1)}>
                <svg className="createNewSales-circle-x-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
                </svg>
                <p>Close</p>
              </div>
            </div>
          </div>

          {masterLoading && (
            <p style={{ textAlign: "center", padding: "8px", color: "#888", fontSize: "13px" }}>
              Loading dropdown data…
            </p>
          )}

          {/* ── BASIC INFO ─────────────────────────────────────────────── */}
          <div className="createNewSales-input-container">
            <div className="createNewSales-input-box">
              <label>Sales Order ID (Auto Generate)</label>
              <input type="text" value={salesData.sales_order_id} placeholder="Auto Generate" disabled />
            </div>
            <div className="createNewSales-input-box">
              <label htmlFor="order_date">Order Date<sup>*</sup></label>
              <input id="order_date" value={salesData.order_date} onChange={handleSalesDataChange} type="date" required disabled={salesBtn.BtnAccess} />
            </div>
          </div>
          <div className="createNewSales-input-container">
            <div className="createNewSales-input-box">
              <label htmlFor="sales_rep">Sales Rep<sup>*</sup></label>
              <select id="sales_rep" value={salesData.sales_rep} onChange={handleSalesDataChange} required disabled={salesBtn.BtnAccess}>
                <option value="">Select Sales Rep</option>
                {sales_rep.map((ele, ind) => (
                  <option key={ind} value={ele}>{ele}</option>
                ))}
              </select>
            </div>
            <div className="createNewSales-input-box">
              <label htmlFor="order_type">Order Type<sup>*</sup></label>
              <select id="order_type" value={salesData.order_type} onChange={handleSalesDataChange} required disabled={salesBtn.BtnAccess}>
                <option value="">Select Order</option>
                <option value="Standard">Standard</option>
                <option value="Rush">Rush</option>
                <option value="Backorder">Backorder</option>
              </select>
            </div>
          </div>

          {/* ── CUSTOMER INFORMATION ───────────────────────────────────── */}
          <nav className="createNewSales-subtit">Customer Information</nav>
          <div className="createNewSales-input-container">
            <div className="createNewSales-input-box">
              <label htmlFor="customer_name">Customer Name<sup>*</sup></label>
              <select id="customer_name" value={salesData.customer_name} onChange={handleSalesDataChange} disabled={salesBtn.BtnAccess}>
                <option value="">Select Customer</option>
                {prevsalesData.map((ele, ind) => (
                  <option key={ind} value={ele.customer_name}>{ele.customer_name}</option>
                ))}
              </select>
            </div>
            <div className="createNewSales-input-box">
              <label>Customer ID</label>
              <input type="text" value={salesData.customer_id} placeholder="Auto Generate" disabled />
            </div>
          </div>
          <div className="createNewSales-input-container">
            <div className="createNewSales-input-box">
              <label htmlFor="billing_address">Billing Address<sup>*</sup></label>
              <input id="billing_address" value={salesData.billing_address} onChange={handleSalesDataChange} type="text" placeholder="Enter Address" required disabled={salesBtn.BtnAccess} />
            </div>
            <div className="createNewSales-input-box">
              <label htmlFor="shipping_address">Shipping Address<sup>*</sup></label>
              <input id="shipping_address" value={salesData.shipping_address} onChange={handleSalesDataChange} type="text" placeholder="Enter Address" required disabled={salesBtn.BtnAccess} />
            </div>
          </div>
          <div className="createNewSales-input-container">
            <div className="createNewSales-input-box">
              <label htmlFor="email_id">Email ID<sup>*</sup></label>
              <input id="email_id" value={salesData.email_id} onChange={handleSalesDataChange} type="email" placeholder="Enter Email" required disabled={salesBtn.BtnAccess} />
            </div>
            <div className="createNewSales-input-box">
              <label htmlFor="phone_number">Phone Number<sup>*</sup></label>
              <input id="phone_number" value={salesData.phone_number} onChange={handleSalesDataChange} className="increment-decrement-createNewSales" type="number" placeholder="Enter Phone" required disabled={salesBtn.BtnAccess} />
            </div>
          </div>

          {/* ── PAYMENT DETAILS ────────────────────────────────────────── */}
          <nav className="createNewSales-subtit">Payment Details</nav>
          <div className="createNewSales-input-container">
            <div className="createNewSales-input-box">
              <label htmlFor="payment_method">Payment Method</label>
              <select id="payment_method" value={salesData.payment_method} onChange={handleSalesDataChange} disabled={salesBtn.BtnAccess}>
                <option value="">Select Payment</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="COD">COD</option>
                <option value="PayPal">PayPal</option>
              </select>
            </div>
            <div className="createNewSales-input-box">
              <label htmlFor="currency">Currency<sup>*</sup></label>
              <select id="currency" value={salesData.currency} onChange={handleSalesDataChange} required disabled={salesBtn.BtnAccess}>
                <option value="">Select Currency</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="INR">INR</option>
                <option value="GBP">GBP</option>
                <option value="SGD">SGD</option>
              </select>
            </div>
          </div>
          <div className="createNewSales-input-container">
            <div className="createNewSales-input-box">
              <label htmlFor="due_date">Due Date</label>
              <input id="due_date" value={salesData.due_date} onChange={handleSalesDataChange} type="date" disabled={salesBtn.BtnAccess} />
            </div>
            <div className="createNewSales-input-box">
              <label htmlFor="terms_conditions">Terms & Conditions</label>
              <input id="terms_conditions" value={salesData.terms_conditions} onChange={handleSalesDataChange} type="text" placeholder="Enter Terms & Conditions" disabled={salesBtn.BtnAccess} />
            </div>
          </div>

          {/* ── LOGISTICS & NOTES ──────────────────────────────────────── */}
          <nav className="createNewSales-subtit">Logistics & Notes</nav>
          <div className="createNewSales-input-container">
            <div className="createNewSales-input-box">
              <label htmlFor="shipping_method">Shipping Method</label>
              <select id="shipping_method" value={salesData.shipping_method} onChange={handleSalesDataChange} disabled={salesBtn.BtnAccess}>
                <option value="">Select Shipping</option>
                <option value="DHL">DHL</option>
                <option value="FedEx">FedEx</option>
                <option value="UPS">UPS</option>
                <option value="Local Courier">Local Courier</option>
              </select>
            </div>
            <div className="createNewSales-input-box">
              <label htmlFor="expected_delivery">Expected Delivery</label>
              <input id="expected_delivery" value={salesData.expected_delivery} onChange={handleSalesDataChange} type="date" disabled={salesBtn.BtnAccess} />
            </div>
          </div>
          <div className="createNewSales-input-container">
            <div className="createNewSales-input-box">
              <label htmlFor="tracking_number">Tracking Number</label>
              <input id="tracking_number" type="text" value={salesData.tracking_number} onChange={handleSalesDataChange} disabled={salesBtn.BtnAccess} placeholder="Enter tracking number" />
            </div>
            <div className="createNewSales-input-box">
              <label htmlFor="internal_notes">Internal Notes</label>
              <input id="internal_notes" type="text" value={salesData.internal_notes} onChange={handleSalesDataChange} placeholder="Enter Internal Notes" disabled={salesBtn.BtnAccess} />
            </div>
          </div>
          <div className="createNewSales-input-container">
            <div className="createNewSales-input-box">
              <label htmlFor="customer_notes">Customer Notes</label>
              <input id="customer_notes" type="text" value={salesData.customer_notes} onChange={handleSalesDataChange} placeholder="Enter Customer Notes" disabled={salesBtn.BtnAccess} />
            </div>
          </div>

          {/* ── ORDER LINE ITEMS ───────────────────────────────────────── */}
          <nav className="createNewSales-subtit">Order Line Items<sup>*</sup></nav>
          <div className="createNewSales-table-container">
            <table>
              <thead className="createNewSales-table-head">
                <tr>
                  <th id="createNewSales-table-smallwidth">#</th>
                  <th>Product Name</th>
                  <th id="createNewSales-table-minwidth">Product ID</th>
                  <th id="createNewSales-table-minwidth">In Stock</th>
                  <th>Quantity</th>
                  <th>UOM</th>
                  <th>Unit Price</th>
                  <th>Tax (%)</th>
                  <th>Discount (%)</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="createNewSales-table-body">
                {[...Array(numOfSalesList)].map((_, ind) => (
                  <SalesListItems
                    key={SalesList_data[ind]?.unique_key ?? ind}
                    unique_key={ind}
                    sales_table_data={sales_table_data}
                    setSalesList_data={setSalesList_data}
                    productTotal={productTotal}
                    deleteSalesProduct={deleteSalesProduct}
                    salesData={salesData}
                    btnAccess={salesBtn.BtnAccess}
                  />
                ))}
                <tr>
                  <td></td>
                  <td>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setSalesList_data((prev) => [...prev, { unique_key: numOfSalesList }]);
                        setnumOfSalesList((prev) => prev + 1);
                      }}
                      disabled={salesBtn.BtnAccess}
                    >+ Add Item</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ── ORDER SUMMARY ──────────────────────────────────────────── */}
          <nav className="createNewSales-subtit">Order Summary</nav>
          <div className="createNewSales-totals-container">
            <nav><h5>Subtotal</h5><p>{calculateSubtotal()}</p></nav>
            <nav>
              <h5>Global Discount (%)</h5>
              <input type="number" value={salesData.global_discount}
                onChange={(e) => setSalesData((prev) => ({ ...prev, global_discount: parseFloat(e.target.value) || 0 }))}
                disabled={salesBtn.BtnAccess} />
            </nav>
            <nav><h5>Tax Summary</h5><p>{calculateTaxSummery()}</p></nav>
            <nav>
              <h5>
                Shipping Charges
                {salesData.currency === "INR" && <span> (₹)</span>}
                {salesData.currency === "USD" && <span> ($)</span>}
                {salesData.currency === "GBP" && <span> (£)</span>}
                {salesData.currency === "SGD" && <span> (S$)</span>}
                {salesData.currency === "EUR" && <span> (€)</span>}
              </h5>
              <input type="number" value={salesData.shipping_charges}
                onChange={(e) => setSalesData((prev) => ({ ...prev, shipping_charges: parseFloat(e.target.value) || 0 }))}
                disabled={salesBtn.BtnAccess} />
            </nav>
            <nav><h5>Rounding Adjustment</h5><p>{roundedvalue()}</p></nav>
            <nav className="createNewSales-totals-container-bg">
              <h5>Grand Total</h5>
              <p>
                {salesData.currency === "INR" && <span>₹</span>}
                {salesData.currency === "USD" && <span>$</span>}
                {salesData.currency === "GBP" && <span>£</span>}
                {salesData.currency === "SGD" && <span>S$</span>}
                {salesData.currency === "EUR" && <span>€</span>}
                {roundedGrandTotal()}
              </p>
            </nav>
          </div>

          {/* ── COMMENTS / HISTORY ─────────────────────────────────────── */}
          <div className="createNewSales-hub-container">
            <div className="createNewSales-hub-head">
              <p className={feacher.showChat ? "createNewSales-hub-head-bg-black" : "createNewSales-hub-head-tit"} onClick={() => setFeacher({ showChat: true, showHistory: false })}>Comments</p>
              <p className={feacher.showHistory ? "createNewSales-hub-head-bg-black" : "createNewSales-hub-head-tit"} onClick={() => setFeacher({ showChat: false, showHistory: true })}>History</p>
            </div>
            <div className="createNewSales-hub-body">
              {feacher.showChat    && <CreateNewSalesComment orderId={dbOrderId} initialComments={orderComments} />}
              {feacher.showHistory && <CreateNewSalesHistory initialHistory={orderHistory} />}
            </div>
          </div>

          {/* ── ACTION BUTTONS ─────────────────────────────────────────── */}
          <div className="createNewSales-btn-container">
            <button
              style={{ width: "max-content" }}
              className={["Submitted","Submitted(PD)","Partially Delivered"].includes(salesStatus) ? "createNewSales-order-active-btn" : "createNewSales-inactive-btn"}
              onClick={handleCancelOrderState}
              disabled={salesBtn.cancel_order || isSaving}
            >{salesStatus === "Cancelled" ? "Cancelled" : "Cancel Order"}</button>

            <nav>
              <button className="createNewSales-cancel-btn" onClick={(e) => { e.preventDefault(); prevPage(-1); }} disabled={salesBtn.cancel}>Cancel</button>
              <button
                className={["Draft",""].includes(salesStatus) ? "createNewSales-active-btn" : "createNewSales-completed-btn"}
                onClick={handleSaveDraftState} disabled={salesBtn.save_draft || isSaving}
              >{isSaving ? "Saving…" : "Save Draft"}</button>
              <button
                className={["Draft","Submitted(PD)",""].includes(salesStatus) ? "createNewSales-active-btn" : "createNewSales-completed-btn"}
                disabled={salesBtn.submit || isSaving}
              >{isSaving ? "Submitting…" : "Submit"}</button>
              <button
                className={
                  salesStatus === "" || salesStatus === "Submitted" ||
                  (salesStatus === "Submitted(PD)" && purchase_order !== "Purchase Ordered") ||
                  (salesStatus === "Draft"         && purchase_order !== "Purchase Ordered")
                    ? "createNewSales-active-btn" : "createNewSales-completed-btn"
                }
                disabled={salesBtn.Generate_po || isSaving}
              >Generate (PO)</button>

              <svg
                className={!salesBtn.pdf ? "createNewSales-pdf-mail-activelogo" : "createNewSales-pdf-mail-futurelogo"}
                style={{ cursor: !salesBtn.pdf ? "pointer" : "not-allowed", opacity: salesBtn.pdf ? 0.4 : 1 }}
                onClick={!salesBtn.pdf ? handlePdf : undefined}
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 24" fill="none"
              >
                <path fillRule="evenodd" clipRule="evenodd" d="M0.600098 2.4C0.600098 1.76348 0.852954 1.15303 1.30304 0.702944C1.75313 0.252856 2.36358 0 3.0001 0L16.1313 0L21.4001 5.2688V21.6C21.4001 22.2365 21.1472 22.847 20.6972 23.2971C20.2471 23.7471 19.6366 24 19.0001 24H3.0001C2.36358 24 1.75313 23.7471 1.30304 23.2971C0.852954 22.847 0.600098 22.2365 0.600098 21.6V2.4ZM4.6001 9.6H2.2001V17.6H3.8001V14.4H4.6001C5.23662 14.4 5.84707 14.1471 6.29715 13.6971C6.74724 13.247 7.0001 12.6365 7.0001 12C7.0001 11.3635 6.74724 10.753 6.29715 10.3029C5.84707 9.85286 5.23662 9.6 4.6001 9.6ZM11.0001 9.6H8.6001V17.6H11.0001C11.6366 17.6 12.2471 17.3471 12.6972 16.8971C13.1472 16.447 13.4001 15.8365 13.4001 15.2V12C13.4001 11.3635 13.1472 10.753 12.6972 10.3029C12.2471 9.85286 11.6366 9.6 11.0001 9.6ZM15.0001 17.6V9.6H19.8001V11.2H16.6001V12.8H18.2001V14.4H16.6001V17.6H15.0001Z" />
              </svg>

              <svg
                className={!salesBtn.email ? "createNewSales-pdf-mail-activelogo" : "createNewSales-pdf-mail-futurelogo"}
                style={{ cursor: !salesBtn.email ? "pointer" : "not-allowed", opacity: salesBtn.email ? 0.4 : 1 }}
                onClick={!salesBtn.email ? handleEmail : undefined}
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 16" fill="none"
              >
                <path d="M2 16C1.45 16 0.979333 15.8043 0.588 15.413C0.196667 15.0217 0.000666667 14.5507 0 14V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196666 1.45067 0.000666667 2 0H18C18.55 0 19.021 0.196 19.413 0.588C19.805 0.98 20.0007 1.45067 20 2V14C20 14.55 19.8043 15.021 19.413 15.413C19.0217 15.805 18.5507 16.0007 18 16H2ZM10 8.825C10.0833 8.825 10.171 8.81233 10.263 8.787C10.355 8.76167 10.4423 8.72433 10.525 8.675L17.6 4.25C17.7333 4.16667 17.8333 4.06267 17.9 3.938C17.9667 3.81333 18 3.67567 18 3.525C18 3.19167 17.8583 2.94167 17.575 2.775C17.2917 2.60833 17 2.61667 16.7 2.8L10 7L3.3 2.8C3 2.61667 2.70833 2.61267 2.425 2.788C2.14167 2.96333 2 3.209 2 3.525C2 3.69167 2.03333 3.83767 2.1 3.963C2.16667 4.08833 2.26667 4.184 2.4 4.25L9.475 8.675C9.55833 8.725 9.646 8.76267 9.738 8.788C9.83 8.81333 9.91733 8.82567 10 8.825Z" />
              </svg>
            </nav>
          </div>

        </form>
      </div>
    </>
  );
}