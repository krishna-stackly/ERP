// // import React, { useState, useEffect, useRef } from "react";
// // import { ToastContainer, toast } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";
// // import "./createNewProduct.css";
// // import CategoryInput from "./customInput";
// // import NewproductCategory from "./newproductCategory/newproductCategory";
// // import NewproductTaxCode from "./newproduct-tax-code/newproductTaxCode";
// // import NewproductUOM from "./newproduct-uom/newproductUOM";
// // import NewproductWarehouse from "./newproductWarehouse/newproductWarehouse";
// // import NewproductSupplier from "./newproductSupplier/newproductSupplier";
// // import NewproductSize from "./newproductSize/newproductSize";
// // import NewproductColor from "./newproductColor/newproductColor";
// // import productApiProvider from "../../../network/product-api-provider";

// // export default function CreateNewProduct({
// //   setshowNewProduct,
// //   editNewProduct,
// //   editProduct,
// //   setEditProduct,
// // }) {
// //   const [categoryApi, setcategoryApi] = useState([]);
// //   const [tax_codeApi, settax_codeApi] = useState([]);
// //   const [uomApi, setuomApi] = useState([]);
// //   const [warehouseApi, setwarehouseApi] = useState([]);
// //   const [sizeApi, setsizeApi] = useState([]);
// //   const [colorApi, setcolorApi] = useState([]);
// //   const [supplierApi, setsupplierApi] = useState([]);
// //   const [related_productsApi, setrelated_productsApi] = useState([]);

// //   const [newproduct_tax_code, setnewproduct_tax_code] = useState(false);
// //   const [newproduct_edit_tax_code, setnewproduct_edit_tax_code] = useState(false);
// //   const [newProductUOM, setnewProductUOM] = useState(false);
// //   const [editNewproductUOM, seteditNewproductUOM] = useState(false);
// //   const [newproductWarehouse, setnewproductWarehouse] = useState(false);
// //   const [editnewproductWarehouse, setEditnewproductWarehouse] = useState(false);
// //   const [newproductSupplier, setnewproductSupplier] = useState(false);
// //   const [editnewproductSupplier, setEditnewproductSupplier] = useState(false);
// //   const [newproductSize, setnewproductSize] = useState(false);
// //   const [editnewproductSize, setEditnewproductSize] = useState(false);
// //   const [newproductColor, setnewproductColor] = useState(false);
// //   const [editnewproductColor, setEditnewproductColor] = useState(false);
// //   const [newproductCategory, setnewproductCategory] = useState(false);
// //   const [editnewproductCategory, setEditnewproductCategory] = useState(false);
// //   const [newrelatedproduct, setnewrelatedproduct] = useState(false);
// //   const [editnewrelatedproduct, setEditnewrelatedproduct] = useState(false);

// //   const [newProductImage, setnewProductImage] = useState(true);
// //   const [imageURL, setImageURL] = useState("");
// //   const [imageFile, setImageFile] = useState(null);
// //   const inputRef = useRef(null);

// //   const handleImageChange = (event) => {
// //     const file = event.target.files[0];
// //     if (file) {
// //       setImageURL(URL.createObjectURL(file));
// //       setImageFile(file);
// //       toast.success("Product image uploaded successfully");
// //       setnewProductImage(false);
// //     }
// //   };

// //   const [newProductcustom, setnewProductCustom] = useState({
// //     category: "", tax_code: "", uom: "", warehouse: "",
// //     size: "", color: "", supplier: "", related_products: "",
// //   });

// //   const [newProductData, setnewProductData] = useState({
// //     id: "", name: "", product_type: "", description: "",
// //     category: "", tax_code: "", unit_price: "", discount: "",
// //     uom: "", quantity: "", stock_level: "", reorder_level: "",
// //     warehouse: "", size: "", color: "", weight: "",
// //     specifications: "", supplier: "", status: "", product_usage: "",
// //     related_products: [], sub_category: "",
// //   });

// //   // ── FETCH ALL DROPDOWNS ─────────────────────────────────────────
// //   useEffect(() => {
// //     const loadDropdowns = async () => {
// //       const [categories, taxCodes, uoms, warehouses, sizes, colors, suppliers, productsRes] =
// //         await Promise.all([
// //           productApiProvider.fetchCategories(),
// //           productApiProvider.fetchTaxCodes(),
// //           productApiProvider.fetchUOMs(),
// //           productApiProvider.fetchWarehouses(),
// //           productApiProvider.fetchSizes(),
// //           productApiProvider.fetchColors(),
// //           productApiProvider.fetchBrands(),
// //           productApiProvider.fetchProducts(),
// //         ]);

// //       setcategoryApi(Array.isArray(categories) ? categories : []);
// //       settax_codeApi(Array.isArray(taxCodes) ? taxCodes : []);
// //       setuomApi(Array.isArray(uoms) ? uoms : []);
// //       setwarehouseApi(Array.isArray(warehouses) ? warehouses : []);
// //       setsizeApi(Array.isArray(sizes) ? sizes : []);
// //       setcolorApi(Array.isArray(colors) ? colors : []);
// //       setsupplierApi(Array.isArray(suppliers) ? suppliers : []);
// //       const productArray = productsRes?.data?.data ?? productsRes?.data ?? [];
// //       setrelated_productsApi(Array.isArray(productArray) ? productArray : []);
// //     };
// //     loadDropdowns();
// //   }, []);

// //   // ── PREFILL ON EDIT ─────────────────────────────────────────────
// //   useEffect(() => {
// //     if (editProduct && Object.keys(editProduct).length > 0) {
// //       setnewProductData({
// //         id:            editProduct.id            || "",
// //         name:          editProduct.name          || "",
// //         product_type:  editProduct.product_type  || "",
// //         description:   editProduct.description   || "",
// //         category:      editProduct.is_custom_category  ? "custom" : String(editProduct.category  || ""),
// //         tax_code:      editProduct.is_custom_tax_code  ? "custom" : String(editProduct.tax_code  || ""),
// //         unit_price:    editProduct.unit_price    || "",
// //         discount:      editProduct.discount      || "",
// //         uom:           editProduct.is_custom_uom       ? "custom" : String(editProduct.uom       || ""),
// //         quantity:      editProduct.quantity      || "",
// //         stock_level:   editProduct.stock_level   || "",
// //         reorder_level: editProduct.reorder_level || "",
// //         warehouse:     editProduct.is_custom_warehouse ? "custom" : String(editProduct.warehouse || ""),
// //         size:          editProduct.is_custom_size      ? "custom" : String(editProduct.size      || ""),
// //         color:         editProduct.is_custom_color     ? "custom" : String(editProduct.color     || ""),
// //         weight:        editProduct.weight        || "",
// //         specifications: editProduct.specifications || "",
// //         supplier:      editProduct.is_custom_supplier  ? "custom" : String(editProduct.supplier  || ""),
// //         status:        editProduct.status        || "",
// //         product_usage: editProduct.product_usage || "",
// //         related_products: Array.isArray(editProduct.related_products) ? editProduct.related_products : [],
// //         sub_category:  editProduct.sub_category  || "",
// //       });
// //       setnewProductCustom({
// //         category:         editProduct.custom_category         || "",
// //         tax_code:         editProduct.custom_tax_code         || "",
// //         uom:              editProduct.custom_uom              || "",
// //         warehouse:        editProduct.custom_warehouse        || "",
// //         size:             editProduct.custom_size             || "",
// //         color:            editProduct.custom_color            || "",
// //         supplier:         editProduct.custom_supplier         || "",
// //         related_products: editProduct.custom_related_products || "",
// //       });
// //       if (editProduct.image) { setImageURL(editProduct.image); setnewProductImage(false); }
// //     }
// //   }, [editProduct]);

// //   // ── HANDLERS ────────────────────────────────────────────────────
// //   const handleCustomChange = (e) => {
// //     const { id, value } = e.target;
// //     setnewProductData((prev) => ({ ...prev, [id]: value }));
// //     if (value !== "custom") setnewProductCustom((prev) => ({ ...prev, [id]: "" }));
// //   };

// //   const handleNewProjectDataChange = (e) =>
// //     setnewProductData((prev) => ({ ...prev, [e.target.id]: e.target.value }));

// //   const handleNewProjectCustomData = (e) =>
// //     setnewProductCustom((prev) => ({ ...prev, [e.target.id]: e.target.value }));

// //   const handleRelatedProductsChange = (e) => {
// //     const selected = Array.from(e.target.selectedOptions, (opt) => Number(opt.value));
// //     setnewProductData((prev) => ({ ...prev, related_products: selected }));
// //   };

// //   const resetForm = () => {
// //     setnewProductData({
// //       id: "", name: "", product_type: "", description: "",
// //       category: "", tax_code: "", unit_price: "", discount: "",
// //       uom: "", quantity: "", stock_level: "", reorder_level: "",
// //       warehouse: "", size: "", color: "", weight: "",
// //       specifications: "", supplier: "", status: "",
// //       product_usage: "", related_products: [], sub_category: "",
// //     });
// //     setnewProductCustom({
// //       category: "", tax_code: "", uom: "", warehouse: "",
// //       size: "", color: "", supplier: "", related_products: "",
// //     });
// //     setImageURL(""); setImageFile(null); setnewProductImage(true);
// //   };

// //   // ── BUILD PAYLOAD ────────────────────────────────────────────────
// //   const buildPayload = () => {
// //     const dropdownFields = ["category", "tax_code", "uom", "warehouse", "size", "color", "supplier"];
// //     for (const field of dropdownFields) {
// //       if (newProductData[field] === "custom" && !newProductcustom[field]) {
// //         toast.error(`Custom value for ${field} is required`);
// //         return null;
// //       }
// //     }

// //     if (imageFile) {
// //       const fd = new FormData();
// //       fd.append("name",          newProductData.name);
// //       fd.append("product_type",  newProductData.product_type);
// //       fd.append("description",   newProductData.description   || "");
// //       fd.append("unit_price",    newProductData.unit_price);
// //       fd.append("discount",      newProductData.discount      || "0");
// //       fd.append("quantity",      newProductData.quantity);
// //       fd.append("stock_level",   newProductData.stock_level);
// //       fd.append("reorder_level", newProductData.reorder_level || "0");
// //       fd.append("weight",        newProductData.weight        || "");
// //       fd.append("specifications",newProductData.specifications|| "");
// //       fd.append("status",        newProductData.status);
// //       fd.append("product_usage", newProductData.product_usage);
// //       fd.append("sub_category",  newProductData.sub_category  || "");
// //       fd.append("image",         imageFile);
// //       for (const field of dropdownFields) {
// //         if (newProductData[field] === "custom") {
// //           fd.append(field, ""); fd.append(`is_custom_${field}`, "true"); fd.append(`custom_${field}`, newProductcustom[field]);
// //         } else {
// //           fd.append(field, newProductData[field] || ""); fd.append(`is_custom_${field}`, "false"); fd.append(`custom_${field}`, "");
// //         }
// //       }
// //       const relatedIds = Array.isArray(newProductData.related_products) ? newProductData.related_products : [];
// //       relatedIds.forEach((id) => fd.append("related_products", id));
// //       fd.append("is_custom_related_products", "false");
// //       fd.append("custom_related_products", "");
// //       return fd;
// //     } else {
// //       const body = {
// //         name: newProductData.name, product_type: newProductData.product_type,
// //         description: newProductData.description || "", unit_price: newProductData.unit_price,
// //         discount: newProductData.discount || "0", quantity: Number(newProductData.quantity),
// //         stock_level: Number(newProductData.stock_level), reorder_level: Number(newProductData.reorder_level) || 0,
// //         weight: newProductData.weight || "", specifications: newProductData.specifications || "",
// //         status: newProductData.status, product_usage: newProductData.product_usage,
// //         sub_category: newProductData.sub_category || "",
// //       };
// //       for (const field of dropdownFields) {
// //         if (newProductData[field] === "custom") {
// //           body[field] = null; body[`is_custom_${field}`] = true; body[`custom_${field}`] = newProductcustom[field];
// //         } else {
// //           body[field] = newProductData[field] ? Number(newProductData[field]) : null;
// //           body[`is_custom_${field}`] = false; body[`custom_${field}`] = "";
// //         }
// //       }
// //       body.related_products = Array.isArray(newProductData.related_products) ? newProductData.related_products.map(Number) : [];
// //       body.is_custom_related_products = false; body.custom_related_products = "";
// //       return body;
// //     }
// //   };

// //   // ── SUBMIT ───────────────────────────────────────────────────────
// //   const handleNewProductSubmit = async (e) => {
// //     e.preventDefault();
// //     const payload = buildPayload();
// //     if (!payload) return;
// //     let res;
// //     if (editNewProduct && newProductData.id) res = await productApiProvider.updateProduct(newProductData.id, payload);
// //     else res = await productApiProvider.createProduct(payload);
// //     if (res) { setTimeout(() => { resetForm(); setshowNewProduct(false); setEditProduct({}); }, 3000); }
// //   };

// //   const handleNewProductReset = (e) => {
// //     e.preventDefault(); resetForm(); setshowNewProduct(false); setEditProduct({});
// //   };

// //   // anyModalOpen — only non-category modals blur the background
// //   // Category has its own overlay so doesn't need to blur
// //   const anyModalOpen =
// //     newproduct_tax_code || newproduct_edit_tax_code ||
// //     editNewproductUOM   || newProductUOM ||
// //     editnewproductWarehouse || newproductWarehouse ||
// //     newproductSupplier  || editnewproductSupplier ||
// //     newproductSize      || editnewproductSize ||
// //     newproductColor     || editnewproductColor ||
// //     newrelatedproduct   || editnewrelatedproduct;

// //   return (
// //     <>
// //       <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

// //       {/* ── CATEGORY MODAL — has its own fixed overlay, must be OUTSIDE blur container ── */}
// //       {(newproductCategory || editnewproductCategory) && (
// //         <NewproductCategory
// //           newproductCategory={newproductCategory}
// //           setnewproductCategory={setnewproductCategory}
// //           editnewproductCategory={editnewproductCategory}
// //           setEditnewproductCategory={setEditnewproductCategory}
// //           onCategoryCreated={async () => {
// //             const cats = await productApiProvider.fetchCategories();
// //             setcategoryApi(Array.isArray(cats) ? cats : []);
// //           }}
// //         />
// //       )}

// //       {/* ── OTHER MODALS — inside fixed positioned divs ── */}
// //       {(newproduct_tax_code || newproduct_edit_tax_code) && (
// //         <div className="product-bg-btn">
// //           <NewproductTaxCode
// //             newproduct_tax_code={newproduct_tax_code}
// //             setnewproduct_tax_code={setnewproduct_tax_code}
// //             newproduct_edit_tax_code={newproduct_edit_tax_code}
// //             setnewproduct_edit_tax_code={setnewproduct_edit_tax_code}
// //           />
// //         </div>
// //       )}

// //       {(newProductUOM || editNewproductUOM) && (
// //         <div className="product-bg-btn">
// //           <NewproductUOM
// //             newProductUOM={newProductUOM}
// //             setnewProductUOM={setnewProductUOM}
// //             editNewproductUOM={editNewproductUOM}
// //             seteditNewproductUOM={seteditNewproductUOM}
// //           />
// //         </div>
// //       )}

// //       {(newproductWarehouse || editnewproductWarehouse) && (
// //         <div className="product-bg-btn">
// //           <NewproductWarehouse
// //             newproductWarehouse={newproductWarehouse}
// //             setnewproductWarehouse={setnewproductWarehouse}
// //             editnewproductWarehouse={editnewproductWarehouse}
// //             setEditnewproductWarehouse={setEditnewproductWarehouse}
// //           />
// //         </div>
// //       )}

// //       {(newproductSupplier || editnewproductSupplier) && (
// //         <div className="product-bg-btn">
// //           <NewproductSupplier
// //             newproductSupplier={newproductSupplier}
// //             setnewproductSupplier={setnewproductSupplier}
// //             editnewproductSupplier={editnewproductSupplier}
// //             setEditnewproductSupplier={setEditnewproductSupplier}
// //           />
// //         </div>
// //       )}

// //       {(newproductSize || editnewproductSize) && (
// //         <div className="product-bg-autoheight-btn">
// //           <NewproductSize
// //             newproductSize={newproductSize}
// //             setnewproductSize={setnewproductSize}
// //             editnewproductSize={editnewproductSize}
// //             setEditnewproductSize={setEditnewproductSize}
// //           />
// //         </div>
// //       )}

// //       {(newproductColor || editnewproductColor) && (
// //         <div className="product-bg-autoheight-btn">
// //           <NewproductColor
// //             newproductColor={newproductColor}
// //             setnewproductColor={setnewproductColor}
// //             editnewproductColor={editnewproductColor}
// //             setEditnewproductColor={setEditnewproductColor}
// //           />
// //         </div>
// //       )}

// //       {/* ── MAIN CONTENT — blurs when any non-category modal is open ── */}
// //       <div className={`newProduct-container ${anyModalOpen ? "product-bg-blur" : ""}`}>
// //         <form onSubmit={handleNewProductSubmit}>

// //           {/* ── HEADER ── */}
// //           <div className="newProduct-title">
// //             <p>{editNewProduct ? "Edit" : "Create New"} Product</p>
// //             <div className="close-newproduct-container"
// //               onClick={() => { setshowNewProduct(false); setEditProduct({}); }}>
// //               <svg className="circle-x-logo-newproduct" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="15" height="15">
// //                 <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
// //               </svg>
// //               <nav className="close-newproduct">Close</nav>
// //             </div>
// //           </div>

// //           {/* ── IMAGE + BASIC INFO ── */}
// //           <div className="createNewProduct-cointainer">
// //             <input type="file" accept="image/*" ref={inputRef} hidden onChange={handleImageChange} />
// //             {newProductImage ? (
// //               <div className="newProduct-photo-cointainer" onClick={() => inputRef.current?.click()}>
// //                 <div className="newProduct-photo-bg">
// //                   <nav className="newProduct-photo-bg-up">
// //                     <svg className="newProject-camera-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="25" height="25">
// //                       <path d="M220.6 121.2L271.1 96 448 96l0 96-114.8 0c-21.9-15.1-48.5-24-77.2-24s-55.2 8.9-77.2 24L64 192l0-64 128 0c9.9 0 19.7-2.3 28.6-6.8zM0 128L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L271.1 32c-9.9 0-19.7 2.3-28.6 6.8L192 64l-32 0 0-16c0-8.8-7.2-16-16-16L80 32c-8.8 0-16 7.2-16 16l0 16C28.7 64 0 92.7 0 128zM168 304a88 88 0 1 1 176 0 88 88 0 1 1 -176 0z" />
// //                     </svg>
// //                     <p>Upload Photo</p>
// //                   </nav>
// //                   <nav className="newProduct-photo-bg-down">
// //                     <div>
// //                       <nav><p className="newProduct-photo-title">Allowed Format</p><p className="newProduct-photo-content">JPG, JPEG, PNG</p></nav>
// //                       <nav><p className="newProduct-photo-title">Max File Size</p><p className="newProduct-photo-content">2MB</p></nav>
// //                     </div>
// //                   </nav>
// //                 </div>
// //               </div>
// //             ) : (
// //               <img className="newProduct-image" src={imageURL} alt="Product Preview" onClick={() => inputRef.current?.click()} />
// //             )}

// //             <div className="createNewProduct-right">
// //               <div className="createNewProduct-box">
// //                 <label htmlFor="name">Product Name<sup>*</sup></label>
// //                 <input id="name" type="text" value={newProductData.name} onChange={handleNewProjectDataChange} placeholder="Headphones" required />
// //               </div>
// //               <div className="createNewProduct-box">
// //                 <label htmlFor="product_type">Product Type<sup>*</sup></label>
// //                 <select id="product_type" value={newProductData.product_type} onChange={handleNewProjectDataChange} required>
// //                   <option value="">Select Product Type</option>
// //                   <option value="Goods">Goods</option>
// //                   <option value="Services">Services</option>
// //                   <option value="Combo">Combo</option>
// //                 </select>
// //               </div>
// //               <div className="createNewProduct-box">
// //                 <label>Product ID (Auto Generate)</label>
// //                 <input type="text" value={newProductData.id} placeholder="Auto Generate" disabled />
// //               </div>
// //               <div className="createNewProduct-box">
// //                 <label htmlFor="description">Description<sup>*</sup></label>
// //                 <input id="description" value={newProductData.description} onChange={handleNewProjectDataChange} type="text" placeholder="Text Area" required />
// //               </div>
// //             </div>
// //           </div>

// //           {/* ── CATEGORY ── */}
// //           <div className="newProduct-title"><div>Create New Product</div></div>
// //           <div className="NewProduct-input-cointainer">
// //             <div className="newProduct-box">
// //               <label htmlFor="category">
// //                 <p>Category<sup>*</sup></p>
// //                 <nav onClick={() => setnewproductCategory(true)}>+ Add New</nav>
// //               </label>
// //               <CategoryInput
// //                 handleCustomChange={handleCustomChange} newProductData={newProductData}
// //                 handleNewProjectCustomData={handleNewProjectCustomData}
// //                 newProductcustom={newProductcustom} id="category" customApi={categoryApi} required
// //               />
// //             </div>
// //             <div className="newProduct-box">
// //               <label htmlFor="sub_category">Sub Category<sup>*</sup></label>
// //               <input type="text" id="sub_category" value={newProductData.sub_category} onChange={handleNewProjectDataChange} placeholder="e.g., Laptop" required />
// //             </div>
// //           </div>

// //           {/* ── PRICING & TAX ── */}
// //           <div className="newProduct-title"><div>Pricing & Tax</div></div>
// //           <div className="NewProduct-input-cointainer">
// //             <div className="newProduct-box">
// //               <label htmlFor="unit_price">Unit Price<sup>*</sup></label>
// //               <input className="increment-decrement-newProduct" type="number" id="unit_price" placeholder="Enter Price" value={newProductData.unit_price} onChange={handleNewProjectDataChange} min="0" step="0.01" required />
// //             </div>
// //             <div className="newProduct-box">
// //               <label htmlFor="discount">Discount (%)</label>
// //               <input className="increment-decrement-newProduct" type="number" id="discount" value={newProductData.discount} onChange={handleNewProjectDataChange} placeholder="e.g., 10" min="0" max="100" step="0.01" />
// //             </div>
// //             <div className="newProduct-box">
// //               <label htmlFor="tax_code">
// //                 <p>Tax Code<sup>*</sup></p>
// //                 <nav onClick={() => setnewproduct_tax_code(true)}>+ Add New</nav>
// //               </label>
// //               <CategoryInput
// //                 handleCustomChange={handleCustomChange} newProductData={newProductData}
// //                 handleNewProjectCustomData={handleNewProjectCustomData}
// //                 newProductcustom={newProductcustom} id="tax_code" customApi={tax_codeApi} required
// //               />
// //             </div>
// //           </div>

// //           {/* ── UNIT & STOCK ── */}
// //           <div className="newProduct-title"><div>Unit & Stock</div></div>
// //           <div className="NewProduct-input-cointainer">
// //             <div className="newProduct-box">
// //               <label htmlFor="quantity">Quantity<sup>*</sup></label>
// //               <input id="quantity" type="number" className="increment-decrement-newProduct" value={newProductData.quantity} onChange={handleNewProjectDataChange} placeholder="e.g., 50" min="0" required />
// //             </div>
// //             <div className="newProduct-box">
// //               <label htmlFor="uom">
// //                 <p>UOM (Unit Of Measurement)<sup>*</sup></p>
// //                 <nav onClick={() => setnewProductUOM(true)}>+ Add New</nav>
// //               </label>
// //               <CategoryInput
// //                 handleCustomChange={handleCustomChange} newProductData={newProductData}
// //                 handleNewProjectCustomData={handleNewProjectCustomData}
// //                 newProductcustom={newProductcustom} id="uom" customApi={uomApi} required
// //               />
// //             </div>
// //           </div>

// //           {/* ── INVENTORY ── */}
// //           <div className="newProduct-title"><div>Inventory Details</div></div>
// //           <div className="NewProduct-input-cointainer">
// //             <div className="newProduct-box">
// //               <label htmlFor="stock_level">Stock Level<sup>*</sup></label>
// //               <input className="increment-decrement-newProduct" type="number" id="stock_level" placeholder="e.g., 120" value={newProductData.stock_level} onChange={handleNewProjectDataChange} min="0" required />
// //             </div>
// //             <div className="newProduct-box">
// //               <label htmlFor="reorder_level">Reorder Level</label>
// //               <input className="increment-decrement-newProduct" type="number" id="reorder_level" value={newProductData.reorder_level} onChange={handleNewProjectDataChange} placeholder="e.g., 30" min="0" />
// //             </div>
// //             <div className="newProduct-box">
// //               <label htmlFor="warehouse">
// //                 <p>Warehouse<sup>*</sup></p>
// //                 <nav onClick={() => setnewproductWarehouse(true)}>+ Add New</nav>
// //               </label>
// //               <CategoryInput
// //                 handleCustomChange={handleCustomChange} newProductData={newProductData}
// //                 handleNewProjectCustomData={handleNewProjectCustomData}
// //                 newProductcustom={newProductcustom} id="warehouse" customApi={warehouseApi} required
// //               />
// //             </div>
// //           </div>

// //           {/* ── ATTRIBUTES ── */}
// //           <div className="newProduct-title"><div>Product Attributes & Specifications</div></div>
// //           <div className="NewProduct-input-cointainer">
// //             <div className="newProduct-box">
// //               <label htmlFor="size">
// //                 <p>Size</p>
// //                 <nav onClick={() => setnewproductSize(true)}>+ Add New</nav>
// //               </label>
// //               <CategoryInput handleCustomChange={handleCustomChange} newProductData={newProductData} handleNewProjectCustomData={handleNewProjectCustomData} newProductcustom={newProductcustom} id="size" customApi={sizeApi} />
// //             </div>
// //             <div className="newProduct-box">
// //               <label htmlFor="color">
// //                 <p>Color</p>
// //                 <nav onClick={() => setnewproductColor(true)}>+ Add New</nav>
// //               </label>
// //               <CategoryInput handleCustomChange={handleCustomChange} newProductData={newProductData} handleNewProjectCustomData={handleNewProjectCustomData} newProductcustom={newProductcustom} id="color" customApi={colorApi} />
// //             </div>
// //             <div className="newProduct-box">
// //               <label htmlFor="weight">Weight</label>
// //               <input type="text" id="weight" value={newProductData.weight} onChange={handleNewProjectDataChange} placeholder="e.g., 300g" />
// //             </div>
// //           </div>
// //           <div className="NewProduct-input-cointainer">
// //             <div className="newProduct-box">
// //               <label htmlFor="specifications">Specifications</label>
// //               <input type="text" id="specifications" value={newProductData.specifications} onChange={handleNewProjectDataChange} placeholder="Text area" />
// //             </div>
// //           </div>

// //           {/* ── RELATED PRODUCTS & SUPPLIER ── */}
// //           <div className="newProduct-title"><div>Related Products & Supplier Info</div></div>
// //           <div className="NewProduct-input-cointainer">
// //             <div className="newProduct-box">
// //               <label htmlFor="related_products"><p>Related Products</p></label>
// //               <select id="related_products" multiple value={newProductData.related_products.map(String)} onChange={handleRelatedProductsChange} style={{ minHeight: "80px" }}>
// //                 {related_productsApi.filter((p) => p.id !== Number(newProductData.id)).map((p) => (
// //                   <option key={p.id} value={p.id}>{p.product_id ? `${p.product_id} – ` : ""}{p.name}</option>
// //                 ))}
// //               </select>
// //               <small style={{ color: "#888" }}>Hold Ctrl / Cmd to select multiple</small>
// //             </div>
// //             <div className="newProduct-box">
// //               <label htmlFor="supplier">
// //                 <p>Supplier<sup>*</sup></p>
// //                 <nav onClick={() => setnewproductSupplier(true)}>+ Add New</nav>
// //               </label>
// //               <CategoryInput handleCustomChange={handleCustomChange} newProductData={newProductData} handleNewProjectCustomData={handleNewProjectCustomData} newProductcustom={newProductcustom} id="supplier" customApi={supplierApi} required />
// //             </div>
// //           </div>

// //           {/* ── SETTINGS ── */}
// //           <div className="newProduct-title"><div>Settings</div></div>
// //           <div className="NewProduct-input-cointainer">
// //             <div className="newProduct-box">
// //               <label htmlFor="status"><p>Status<sup>*</sup></p></label>
// //               <select id="status" value={newProductData.status} onChange={handleNewProjectDataChange} required>
// //                 <option value="">Select Status</option>
// //                 <option value="Active">Active</option>
// //                 <option value="Inactive">Inactive</option>
// //                 <option value="Discontinued">Discontinued</option>
// //               </select>
// //             </div>
// //             <div className="newProduct-box">
// //               <label htmlFor="product_usage"><p>Product Usage<sup>*</sup></p></label>
// //               <select id="product_usage" value={newProductData.product_usage} onChange={handleNewProjectDataChange} required>
// //                 <option value="">Select Product Usage</option>
// //                 <option value="Purchase">Purchase</option>
// //                 <option value="Sale">Sale</option>
// //                 <option value="Both">Both</option>
// //               </select>
// //             </div>
// //           </div>

// //           {/* ── ACTIONS ── */}
// //           <div className="newProduct-submit-cointainer">
// //             <button className="newProduct-reset-btn" type="reset" onClick={handleNewProductReset}>Discard</button>
// //             <button className="newProduct-submit-btn" type="submit">
// //               {editNewProduct ? "Update Product" : "Add Product"}
// //             </button>
// //           </div>

// //         </form>
// //       </div>
// //     </>
// //   );
// // }
// import React, { useState, useEffect, useRef } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "./createNewProduct.css";
// import CategoryInput from "./customInput";
// import NewproductCategory from "./newproductCategory/newproductCategory";
// import NewproductTaxCode from "./newproduct-tax-code/newproductTaxCode";
// import NewproductUOM from "./newproduct-uom/newproductUOM";
// import NewproductWarehouse from "./newproductWarehouse/newproductWarehouse";
// import NewproductSupplier from "./newproductSupplier/newproductSupplier";
// import NewproductSize from "./newproductSize/newproductSize";
// import NewproductColor from "./newproductColor/newproductColor";
// import productApiProvider from "../../../network/product-api-provider";

// export default function CreateNewProduct({
//   setshowNewProduct,
//   editNewProduct,
//   editProduct,
//   setEditProduct,
// }) {
//   const [categoryApi, setcategoryApi] = useState([]);
//   const [tax_codeApi, settax_codeApi] = useState([]);
//   const [uomApi, setuomApi] = useState([]);
//   const [warehouseApi, setwarehouseApi] = useState([]);
//   const [sizeApi, setsizeApi] = useState([]);
//   const [colorApi, setcolorApi] = useState([]);
//   const [supplierApi, setsupplierApi] = useState([]);
//   const [related_productsApi, setrelated_productsApi] = useState([]);

//   // ── subcategory children from selected category ──
//   const [selectedCategoryChildren, setSelectedCategoryChildren] = useState([]);

//   const [newproduct_tax_code, setnewproduct_tax_code] = useState(false);
//   const [newproduct_edit_tax_code, setnewproduct_edit_tax_code] = useState(false);
//   const [newProductUOM, setnewProductUOM] = useState(false);
//   const [editNewproductUOM, seteditNewproductUOM] = useState(false);
//   const [newproductWarehouse, setnewproductWarehouse] = useState(false);
//   const [editnewproductWarehouse, setEditnewproductWarehouse] = useState(false);
//   const [newproductSupplier, setnewproductSupplier] = useState(false);
//   const [editnewproductSupplier, setEditnewproductSupplier] = useState(false);
//   const [newproductSize, setnewproductSize] = useState(false);
//   const [editnewproductSize, setEditnewproductSize] = useState(false);
//   const [newproductColor, setnewproductColor] = useState(false);
//   const [editnewproductColor, setEditnewproductColor] = useState(false);
//   const [newproductCategory, setnewproductCategory] = useState(false);
//   const [editnewproductCategory, setEditnewproductCategory] = useState(false);

//   const [newProductImage, setnewProductImage] = useState(true);
//   const [imageURL, setImageURL] = useState("");
//   const [imageFile, setImageFile] = useState(null);
//   const inputRef = useRef(null);

//   const handleImageChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setImageURL(URL.createObjectURL(file));
//       setImageFile(file);
//       toast.success("Product image uploaded successfully");
//       setnewProductImage(false);
//     }
//   };

//   const [newProductcustom, setnewProductCustom] = useState({
//     category: "", tax_code: "", uom: "", warehouse: "",
//     size: "", color: "", supplier: "", related_products: "",
//   });

//   const [newProductData, setnewProductData] = useState({
//     id: "", name: "", product_type: "", description: "",
//     category: "", tax_code: "", unit_price: "", discount: "",
//     uom: "", quantity: "", stock_level: "", reorder_level: "",
//     warehouse: "", size: "", color: "", weight: "",
//     specifications: "", supplier: "", status: "", product_usage: "",
//     related_products: [], sub_category: "",
//   });

//   // ── FETCH ALL DROPDOWNS ─────────────────────────────────────────
//   useEffect(() => {
//     const loadDropdowns = async () => {
//       const [categories, taxCodes, uoms, warehouses, sizes, colors, suppliers, productsRes] =
//         await Promise.all([
//           productApiProvider.fetchCategories(),
//           productApiProvider.fetchTaxCodes(),
//           productApiProvider.fetchUOMs(),
//           productApiProvider.fetchWarehouses(),
//           productApiProvider.fetchSizes(),
//           productApiProvider.fetchColors(),
//           productApiProvider.fetchBrands(),
//           productApiProvider.fetchProducts(),
//         ]);

//       setcategoryApi(Array.isArray(categories) ? categories : []);
//       settax_codeApi(Array.isArray(taxCodes) ? taxCodes : []);
//       setuomApi(Array.isArray(uoms) ? uoms : []);
//       setwarehouseApi(Array.isArray(warehouses) ? warehouses : []);
//       setsizeApi(Array.isArray(sizes) ? sizes : []);
//       setcolorApi(Array.isArray(colors) ? colors : []);
//       setsupplierApi(Array.isArray(suppliers) ? suppliers : []);
//       const productArray = productsRes?.data?.data ?? productsRes?.data ?? [];
//       setrelated_productsApi(Array.isArray(productArray) ? productArray : []);
//     };
//     loadDropdowns();
//   }, []);

//   // ── PREFILL ON EDIT ─────────────────────────────────────────────
//   useEffect(() => {
//     if (editProduct && Object.keys(editProduct).length > 0) {
//       setnewProductData({
//         id:            editProduct.id            || "",
//         name:          editProduct.name          || "",
//         product_type:  editProduct.product_type  || "",
//         description:   editProduct.description   || "",
//         category:      editProduct.is_custom_category  ? "custom" : String(editProduct.category  || ""),
//         tax_code:      editProduct.is_custom_tax_code  ? "custom" : String(editProduct.tax_code  || ""),
//         unit_price:    editProduct.unit_price    || "",
//         discount:      editProduct.discount      || "",
//         uom:           editProduct.is_custom_uom       ? "custom" : String(editProduct.uom       || ""),
//         quantity:      editProduct.quantity      || "",
//         stock_level:   editProduct.stock_level   || "",
//         reorder_level: editProduct.reorder_level || "",
//         warehouse:     editProduct.is_custom_warehouse ? "custom" : String(editProduct.warehouse || ""),
//         size:          editProduct.is_custom_size      ? "custom" : String(editProduct.size      || ""),
//         color:         editProduct.is_custom_color     ? "custom" : String(editProduct.color     || ""),
//         weight:        editProduct.weight        || "",
//         specifications: editProduct.specifications || "",
//         supplier:      editProduct.is_custom_supplier  ? "custom" : String(editProduct.supplier  || ""),
//         status:        editProduct.status        || "",
//         product_usage: editProduct.product_usage || "",
//         related_products: Array.isArray(editProduct.related_products) ? editProduct.related_products : [],
//         sub_category:  editProduct.sub_category  || "",
//       });
//       setnewProductCustom({
//         category:         editProduct.custom_category         || "",
//         tax_code:         editProduct.custom_tax_code         || "",
//         uom:              editProduct.custom_uom              || "",
//         warehouse:        editProduct.custom_warehouse        || "",
//         size:             editProduct.custom_size             || "",
//         color:            editProduct.custom_color            || "",
//         supplier:         editProduct.custom_supplier         || "",
//         related_products: editProduct.custom_related_products || "",
//       });
//       if (editProduct.image) { setImageURL(editProduct.image); setnewProductImage(false); }

//       // ── restore subcategory children when editing ──
//       if (editProduct.category && !editProduct.is_custom_category) {
//         const found = categoryApi.find(
//           (cat) => String(cat.id) === String(editProduct.category)
//         );
//         setSelectedCategoryChildren(found?.children || []);
//       }
//     }
//   }, [editProduct, categoryApi]);

//   // ── HANDLERS ────────────────────────────────────────────────────
//   const handleCustomChange = (e) => {
//     const { id, value } = e.target;
//     setnewProductData((prev) => ({ ...prev, [id]: value }));
//     if (value !== "custom") setnewProductCustom((prev) => ({ ...prev, [id]: "" }));
//   };

//   const handleNewProjectDataChange = (e) =>
//     setnewProductData((prev) => ({ ...prev, [e.target.id]: e.target.value }));

//   const handleNewProjectCustomData = (e) =>
//     setnewProductCustom((prev) => ({ ...prev, [e.target.id]: e.target.value }));

//   const handleRelatedProductsChange = (e) => {
//     const selected = Array.from(e.target.selectedOptions, (opt) => Number(opt.value));
//     setnewProductData((prev) => ({ ...prev, related_products: selected }));
//   };

//   // ── CATEGORY CHANGE — populates subcategory dropdown ────────────
//   const handleCategoryChange = (e) => {
//     const selectedId = e.target.value;
//     setnewProductData((prev) => ({ ...prev, category: selectedId, sub_category: "" }));
//     if (selectedId === "custom") {
//       setnewProductCustom((prev) => ({ ...prev, category: "" }));
//       setSelectedCategoryChildren([]);
//       return;
//     }
//     setnewProductCustom((prev) => ({ ...prev, category: "" }));
//     const found = categoryApi.find((cat) => String(cat.id) === String(selectedId));
//     setSelectedCategoryChildren(found?.children || []);
//   };

//   const resetForm = () => {
//     setnewProductData({
//       id: "", name: "", product_type: "", description: "",
//       category: "", tax_code: "", unit_price: "", discount: "",
//       uom: "", quantity: "", stock_level: "", reorder_level: "",
//       warehouse: "", size: "", color: "", weight: "",
//       specifications: "", supplier: "", status: "",
//       product_usage: "", related_products: [], sub_category: "",
//     });
//     setnewProductCustom({
//       category: "", tax_code: "", uom: "", warehouse: "",
//       size: "", color: "", supplier: "", related_products: "",
//     });
//     setSelectedCategoryChildren([]);
//     setImageURL(""); setImageFile(null); setnewProductImage(true);
//   };

//   // ── BUILD PAYLOAD ────────────────────────────────────────────────
//   const buildPayload = () => {
//     const dropdownFields = ["category", "tax_code", "uom", "warehouse", "size", "color", "supplier"];
//     for (const field of dropdownFields) {
//       if (newProductData[field] === "custom" && !newProductcustom[field]) {
//         toast.error(`Custom value for ${field} is required`);
//         return null;
//       }
//     }

//     if (imageFile) {
//       const fd = new FormData();
//       fd.append("name",          newProductData.name);
//       fd.append("product_type",  newProductData.product_type);
//       fd.append("description",   newProductData.description   || "");
//       fd.append("unit_price",    newProductData.unit_price);
//       fd.append("discount",      newProductData.discount      || "0");
//       fd.append("quantity",      newProductData.quantity);
//       fd.append("stock_level",   newProductData.stock_level);
//       fd.append("reorder_level", newProductData.reorder_level || "0");
//       fd.append("weight",        newProductData.weight        || "");
//       fd.append("specifications",newProductData.specifications|| "");
//       fd.append("status",        newProductData.status);
//       fd.append("product_usage", newProductData.product_usage);
//       fd.append("sub_category",  newProductData.sub_category  || "");
//       fd.append("image",         imageFile);
//       for (const field of dropdownFields) {
//         if (newProductData[field] === "custom") {
//           fd.append(field, ""); fd.append(`is_custom_${field}`, "true"); fd.append(`custom_${field}`, newProductcustom[field]);
//         } else {
//           fd.append(field, newProductData[field] || ""); fd.append(`is_custom_${field}`, "false"); fd.append(`custom_${field}`, "");
//         }
//       }
//       const relatedIds = Array.isArray(newProductData.related_products) ? newProductData.related_products : [];
//       relatedIds.forEach((id) => fd.append("related_products", id));
//       fd.append("is_custom_related_products", "false");
//       fd.append("custom_related_products", "");
//       return fd;
//     } else {
//       const body = {
//         name: newProductData.name, product_type: newProductData.product_type,
//         description: newProductData.description || "", unit_price: newProductData.unit_price,
//         discount: newProductData.discount || "0", quantity: Number(newProductData.quantity),
//         stock_level: Number(newProductData.stock_level), reorder_level: Number(newProductData.reorder_level) || 0,
//         weight: newProductData.weight || "", specifications: newProductData.specifications || "",
//         status: newProductData.status, product_usage: newProductData.product_usage,
//         sub_category: newProductData.sub_category || "",
//       };
//       for (const field of dropdownFields) {
//         if (newProductData[field] === "custom") {
//           body[field] = null; body[`is_custom_${field}`] = true; body[`custom_${field}`] = newProductcustom[field];
//         } else {
//           body[field] = newProductData[field] ? Number(newProductData[field]) : null;
//           body[`is_custom_${field}`] = false; body[`custom_${field}`] = "";
//         }
//       }
//       body.related_products = Array.isArray(newProductData.related_products) ? newProductData.related_products.map(Number) : [];
//       body.is_custom_related_products = false; body.custom_related_products = "";
//       return body;
//     }
//   };

//   // ── SUBMIT ───────────────────────────────────────────────────────
//   const handleNewProductSubmit = async (e) => {
//     e.preventDefault();
//     const payload = buildPayload();
//     if (!payload) return;
//     let res;
//     if (editNewProduct && newProductData.id) res = await productApiProvider.updateProduct(newProductData.id, payload);
//     else res = await productApiProvider.createProduct(payload);
//     if (res) { setTimeout(() => { resetForm(); setshowNewProduct(false); setEditProduct({}); }, 3000); }
//   };

//   const handleNewProductReset = (e) => {
//     e.preventDefault(); resetForm(); setshowNewProduct(false); setEditProduct({});
//   };

//   const anyModalOpen =
//     newproduct_tax_code || newproduct_edit_tax_code ||
//     editNewproductUOM   || newProductUOM ||
//     editnewproductWarehouse || newproductWarehouse ||
//     newproductSupplier  || editnewproductSupplier ||
//     newproductSize      || editnewproductSize ||
//     newproductColor     || editnewproductColor;

//   return (
//     <>
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

//       {/* ── CATEGORY MODAL ── */}
//       {(newproductCategory || editnewproductCategory) && (
//         <NewproductCategory
//           newproductCategory={newproductCategory}
//           setnewproductCategory={setnewproductCategory}
//           editnewproductCategory={editnewproductCategory}
//           setEditnewproductCategory={setEditnewproductCategory}
//           onCategoryCreated={async () => {
//             const cats = await productApiProvider.fetchCategories();
//             setcategoryApi(Array.isArray(cats) ? cats : []);
//           }}
//         />
//       )}

//       {/* ── OTHER MODALS ── */}
//       {(newproduct_tax_code || newproduct_edit_tax_code) && (
//         <div className="product-bg-btn">
//           <NewproductTaxCode
//             newproduct_tax_code={newproduct_tax_code}
//             setnewproduct_tax_code={setnewproduct_tax_code}
//             newproduct_edit_tax_code={newproduct_edit_tax_code}
//             setnewproduct_edit_tax_code={setnewproduct_edit_tax_code}
//           />
//         </div>
//       )}
//       {(newProductUOM || editNewproductUOM) && (
//         <div className="product-bg-btn">
//           <NewproductUOM
//             newProductUOM={newProductUOM}
//             setnewProductUOM={setnewProductUOM}
//             editNewproductUOM={editNewproductUOM}
//             seteditNewproductUOM={seteditNewproductUOM}
//           />
//         </div>
//       )}
//       {(newproductWarehouse || editnewproductWarehouse) && (
//         <div className="product-bg-btn">
//           <NewproductWarehouse
//             newproductWarehouse={newproductWarehouse}
//             setnewproductWarehouse={setnewproductWarehouse}
//             editnewproductWarehouse={editnewproductWarehouse}
//             setEditnewproductWarehouse={setEditnewproductWarehouse}
//           />
//         </div>
//       )}
//       {(newproductSupplier || editnewproductSupplier) && (
//         <div className="product-bg-btn">
//           <NewproductSupplier
//             newproductSupplier={newproductSupplier}
//             setnewproductSupplier={setnewproductSupplier}
//             editnewproductSupplier={editnewproductSupplier}
//             setEditnewproductSupplier={setEditnewproductSupplier}
//           />
//         </div>
//       )}
//       {(newproductSize || editnewproductSize) && (
//         <div className="product-bg-autoheight-btn">
//           <NewproductSize
//             newproductSize={newproductSize}
//             setnewproductSize={setnewproductSize}
//             editnewproductSize={editnewproductSize}
//             setEditnewproductSize={setEditnewproductSize}
//           />
//         </div>
//       )}
//       {(newproductColor || editnewproductColor) && (
//         <div className="product-bg-autoheight-btn">
//           <NewproductColor
//             newproductColor={newproductColor}
//             setnewproductColor={setnewproductColor}
//             editnewproductColor={editnewproductColor}
//             setEditnewproductColor={setEditnewproductColor}
//           />
//         </div>
//       )}

//       {/* ── MAIN CONTENT ── */}
//       <div className={`newProduct-container ${anyModalOpen ? "product-bg-blur" : ""}`}>
//         <form onSubmit={handleNewProductSubmit}>

//           {/* ── HEADER ── */}
//           <div className="newProduct-title">
//             <p>{editNewProduct ? "Edit" : "Create New"} Product</p>
//             <div className="close-newproduct-container"
//               onClick={() => { setshowNewProduct(false); setEditProduct({}); }}>
//               <svg className="circle-x-logo-newproduct" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
//                 <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
//               </svg>
//               <nav className="close-newproduct">Close</nav>
//             </div>
//           </div>

//           {/* ── IMAGE + BASIC INFO ── */}
//           <div className="createNewProduct-cointainer">
//             <input type="file" accept="image/*" ref={inputRef} hidden onChange={handleImageChange} />
//             {newProductImage ? (
//               <div className="newProduct-photo-cointainer" onClick={() => inputRef.current?.click()}>
//                 <div className="newProduct-photo-bg">
//                   <nav className="newProduct-photo-bg-up">
//                     <svg className="newProject-camera-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
//                       <path d="M220.6 121.2L271.1 96 448 96l0 96-114.8 0c-21.9-15.1-48.5-24-77.2-24s-55.2 8.9-77.2 24L64 192l0-64 128 0c9.9 0 19.7-2.3 28.6-6.8zM0 128L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L271.1 32c-9.9 0-19.7 2.3-28.6 6.8L192 64l-32 0 0-16c0-8.8-7.2-16-16-16L80 32c-8.8 0-16 7.2-16 16l0 16C28.7 64 0 92.7 0 128zM168 304a88 88 0 1 1 176 0 88 88 0 1 1 -176 0z" />
//                     </svg>
//                     <p>Upload Photo</p>
//                   </nav>
//                   <nav className="newProduct-photo-bg-down">
//                     <div>
//                       <nav><p className="newProduct-photo-title">Allowed Format</p><p className="newProduct-photo-content">JPG, JPEG, PNG</p></nav>
//                       <nav><p className="newProduct-photo-title">Max File Size</p><p className="newProduct-photo-content">2MB</p></nav>
//                     </div>
//                   </nav>
//                 </div>
//               </div>
//             ) : (
//               <img className="newProduct-image" src={imageURL} alt="Product Preview" onClick={() => inputRef.current?.click()} />
//             )}

//             <div className="createNewProduct-right">
//               <div className="createNewProduct-box">
//                 <label htmlFor="name">Product Name<sup>*</sup></label>
//                 <input id="name" type="text" value={newProductData.name} onChange={handleNewProjectDataChange} placeholder="Headphones" required />
//               </div>
//               <div className="createNewProduct-box">
//                 <label htmlFor="product_type">Product Type<sup>*</sup></label>
//                 <select id="product_type" value={newProductData.product_type} onChange={handleNewProjectDataChange} required>
//                   <option value="">Select Product Type</option>
//                   <option value="Goods">Goods</option>
//                   <option value="Services">Services</option>
//                   <option value="Combo">Combo</option>
//                 </select>
//               </div>
//               <div className="createNewProduct-box">
//                 <label>Product ID (Auto Generate)</label>
//                 <input type="text" value={newProductData.id} placeholder="Auto Generate" disabled />
//               </div>
//               <div className="createNewProduct-box">
//                 <label htmlFor="description">Description<sup>*</sup></label>
//                 <input id="description" value={newProductData.description} onChange={handleNewProjectDataChange} type="text" placeholder="Text Area" required />
//               </div>
//             </div>
//           </div>

//           {/* ── CATEGORIZATION ── */}
//           <div className="newProduct-title">
//             <div>Categorization</div>
//             <nav onClick={() => setnewproductCategory(true)}>+ Add New Category</nav>
//           </div>

//           <div className="NewProduct-input-cointainer">

//             {/* Category Dropdown */}
//             <div className="newProduct-box">
//               <label htmlFor="category">
//                 <p>Category<sup>*</sup></p>
//               </label>
//               <select
//                 id="category"
//                 value={newProductData.category}
//                 onChange={handleCategoryChange}
//                 required={newProductData.category !== "custom"}
//               >
//                 <option value="" disabled>Select Category</option>
//                 {categoryApi.map((cat) => (
//                   <option key={cat.id} value={cat.id}>{cat.name}</option>
//                 ))}
//                 <option value="custom">+ Custom</option>
//               </select>
//               {/* Custom category text input */}
//               {newProductData.category === "custom" && (
//                 <input
//                   type="text"
//                   id="category"
//                   placeholder="Enter custom category"
//                   value={newProductcustom.category}
//                   onChange={handleNewProjectCustomData}
//                   style={{ marginTop: 6 }}
//                   required
//                 />
//               )}
//             </div>

//             {/* Subcategory Dropdown */}
//             <div className="newProduct-box">
//               <label htmlFor="sub_category">
//                 <p>Subcategory<sup>*</sup></p>
//               </label>
//               <select
//                 id="sub_category"
//                 value={newProductData.sub_category}
//                 onChange={handleNewProjectDataChange}
//                 required
//                 disabled={
//                   !newProductData.category ||
//                   newProductData.category === "custom" ||
//                   selectedCategoryChildren.length === 0
//                 }
//               >
//                 <option value="" disabled>
//                   {!newProductData.category
//                     ? "Select a category first"
//                     : newProductData.category === "custom"
//                     ? "N/A for custom category"
//                     : selectedCategoryChildren.length === 0
//                     ? "No subcategories available"
//                     : "Select Subcategory"}
//                 </option>
//                 {selectedCategoryChildren.map((child) => (
//                   <option key={child.id} value={child.name}>
//                     {child.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//           </div>

//           {/* ── PRICING & TAX ── */}
//           <div className="newProduct-title"><div>Pricing & Tax</div></div>
//           <div className="NewProduct-input-cointainer">
//             <div className="newProduct-box">
//               <label htmlFor="unit_price">Unit Price<sup>*</sup></label>
//               <input className="increment-decrement-newProduct" type="number" id="unit_price" placeholder="Enter Price" value={newProductData.unit_price} onChange={handleNewProjectDataChange} min="0" step="0.01" required />
//             </div>
//             <div className="newProduct-box">
//               <label htmlFor="discount">Discount (%)</label>
//               <input className="increment-decrement-newProduct" type="number" id="discount" value={newProductData.discount} onChange={handleNewProjectDataChange} placeholder="e.g., 10" min="0" max="100" step="0.01" />
//             </div>
//             <div className="newProduct-box">
//               <label htmlFor="tax_code">
//                 <p>Tax Code<sup>*</sup></p>
//                 <nav onClick={() => setnewproduct_tax_code(true)}>+ Add New</nav>
//               </label>
//               <CategoryInput
//                 handleCustomChange={handleCustomChange} newProductData={newProductData}
//                 handleNewProjectCustomData={handleNewProjectCustomData}
//                 newProductcustom={newProductcustom} id="tax_code" customApi={tax_codeApi} required
//               />
//             </div>
//           </div>

//           {/* ── UNIT & STOCK ── */}
//           <div className="newProduct-title"><div>Unit & Stock</div></div>
//           <div className="NewProduct-input-cointainer">
//             <div className="newProduct-box">
//               <label htmlFor="quantity">Quantity<sup>*</sup></label>
//               <input id="quantity" type="number" className="increment-decrement-newProduct" value={newProductData.quantity} onChange={handleNewProjectDataChange} placeholder="e.g., 50" min="0" required />
//             </div>
//             <div className="newProduct-box">
//               <label htmlFor="uom">
//                 <p>UOM (Unit Of Measurement)<sup>*</sup></p>
//                 <nav onClick={() => setnewProductUOM(true)}>+ Add New</nav>
//               </label>
//               <CategoryInput
//                 handleCustomChange={handleCustomChange} newProductData={newProductData}
//                 handleNewProjectCustomData={handleNewProjectCustomData}
//                 newProductcustom={newProductcustom} id="uom" customApi={uomApi} required
//               />
//             </div>
//           </div>

//           {/* ── INVENTORY ── */}
//           <div className="newProduct-title"><div>Inventory Details</div></div>
//           <div className="NewProduct-input-cointainer">
//             <div className="newProduct-box">
//               <label htmlFor="stock_level">Stock Level<sup>*</sup></label>
//               <input className="increment-decrement-newProduct" type="number" id="stock_level" placeholder="e.g., 120" value={newProductData.stock_level} onChange={handleNewProjectDataChange} min="0" required />
//             </div>
//             <div className="newProduct-box">
//               <label htmlFor="reorder_level">Reorder Level</label>
//               <input className="increment-decrement-newProduct" type="number" id="reorder_level" value={newProductData.reorder_level} onChange={handleNewProjectDataChange} placeholder="e.g., 30" min="0" />
//             </div>
//             <div className="newProduct-box">
//               <label htmlFor="warehouse">
//                 <p>Warehouse<sup>*</sup></p>
//                 <nav onClick={() => setnewproductWarehouse(true)}>+ Add New</nav>
//               </label>
//               <CategoryInput
//                 handleCustomChange={handleCustomChange} newProductData={newProductData}
//                 handleNewProjectCustomData={handleNewProjectCustomData}
//                 newProductcustom={newProductcustom} id="warehouse" customApi={warehouseApi} required
//               />
//             </div>
//           </div>

//           {/* ── ATTRIBUTES ── */}
//           <div className="newProduct-title"><div>Product Attributes & Specifications</div></div>
//           <div className="NewProduct-input-cointainer">
//             <div className="newProduct-box">
//               <label htmlFor="size">
//                 <p>Size</p>
//                 <nav onClick={() => setnewproductSize(true)}>+ Add New</nav>
//               </label>
//               <CategoryInput handleCustomChange={handleCustomChange} newProductData={newProductData} handleNewProjectCustomData={handleNewProjectCustomData} newProductcustom={newProductcustom} id="size" customApi={sizeApi} />
//             </div>
//             <div className="newProduct-box">
//               <label htmlFor="color">
//                 <p>Color</p>
//                 <nav onClick={() => setnewproductColor(true)}>+ Add New</nav>
//               </label>
//               <CategoryInput handleCustomChange={handleCustomChange} newProductData={newProductData} handleNewProjectCustomData={handleNewProjectCustomData} newProductcustom={newProductcustom} id="color" customApi={colorApi} />
//             </div>
//             <div className="newProduct-box">
//               <label htmlFor="weight">Weight</label>
//               <input type="text" id="weight" value={newProductData.weight} onChange={handleNewProjectDataChange} placeholder="e.g., 300g" />
//             </div>
//           </div>
//           <div className="NewProduct-input-cointainer">
//             <div className="newProduct-box">
//               <label htmlFor="specifications">Specifications</label>
//               <input type="text" id="specifications" value={newProductData.specifications} onChange={handleNewProjectDataChange} placeholder="Text area" />
//             </div>
//           </div>

//           {/* ── RELATED PRODUCTS & SUPPLIER ── */}
//           <div className="newProduct-title"><div>Related Products & Supplier Info</div></div>
//           <div className="NewProduct-input-cointainer">
//             <div className="newProduct-box">
//               <label htmlFor="related_products"><p>Related Products</p></label>
//               <select id="related_products" multiple value={newProductData.related_products.map(String)} onChange={handleRelatedProductsChange} style={{ minHeight: "80px" }}>
//                 {related_productsApi.filter((p) => p.id !== Number(newProductData.id)).map((p) => (
//                   <option key={p.id} value={p.id}>{p.product_id ? `${p.product_id} – ` : ""}{p.name}</option>
//                 ))}
//               </select>
//               <small style={{ color: "#888" }}>Hold Ctrl / Cmd to select multiple</small>
//             </div>
//             <div className="newProduct-box">
//               <label htmlFor="supplier">
//                 <p>Supplier<sup>*</sup></p>
//                 <nav onClick={() => setnewproductSupplier(true)}>+ Add New</nav>
//               </label>
//               <CategoryInput handleCustomChange={handleCustomChange} newProductData={newProductData} handleNewProjectCustomData={handleNewProjectCustomData} newProductcustom={newProductcustom} id="supplier" customApi={supplierApi} required />
//             </div>
//           </div>

//           {/* ── SETTINGS ── */}
//           <div className="newProduct-title"><div>Settings</div></div>
//           <div className="NewProduct-input-cointainer">
//             <div className="newProduct-box">
//               <label htmlFor="status"><p>Status<sup>*</sup></p></label>
//               <select id="status" value={newProductData.status} onChange={handleNewProjectDataChange} required>
//                 <option value="">Select Status</option>
//                 <option value="Active">Active</option>
//                 <option value="Inactive">Inactive</option>
//                 <option value="Discontinued">Discontinued</option>
//               </select>
//             </div>
//             <div className="newProduct-box">
//               <label htmlFor="product_usage"><p>Product Usage<sup>*</sup></p></label>
//               <select id="product_usage" value={newProductData.product_usage} onChange={handleNewProjectDataChange} required>
//                 <option value="">Select Product Usage</option>
//                 <option value="Purchase">Purchase</option>
//                 <option value="Sale">Sale</option>
//                 <option value="Both">Both</option>
//               </select>
//             </div>
//           </div>

//           {/* ── ACTIONS ── */}
//           <div className="newProduct-submit-cointainer">
//             <button className="newProduct-reset-btn" type="reset" onClick={handleNewProductReset}>Discard</button>
//             <button className="newProduct-submit-btn" type="submit">
//               {editNewProduct ? "Update Product" : "Add Product"}
//             </button>
//           </div>

//         </form>
//       </div>
//     </>
//   );
// }
import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./createNewProduct.css";
import CategoryInput from "./customInput";
import NewproductCategory from "./newproductCategory/newproductCategory";
import NewproductTaxCode from "./newproduct-tax-code/newproductTaxCode";
import NewproductUOM from "./newproduct-uom/newproductUOM";
import NewproductWarehouse from "./newproductWarehouse/newproductWarehouse";
import NewproductSupplier from "./newproductSupplier/newproductSupplier";
import NewproductSize from "./newproductSize/newproductSize";
import NewproductColor from "./newproductColor/newproductColor";
import productApiProvider from "../../../network/product-api-provider";

export default function CreateNewProduct({
  setshowNewProduct,
  editNewProduct,
  editProduct,
  setEditProduct,
}) {
  const [categoryApi, setcategoryApi] = useState([]);
  const [tax_codeApi, settax_codeApi] = useState([]);
  const [uomApi, setuomApi] = useState([]);
  const [warehouseApi, setwarehouseApi] = useState([]);
  const [sizeApi, setsizeApi] = useState([]);
  const [colorApi, setcolorApi] = useState([]);
  const [supplierApi, setsupplierApi] = useState([]);
  const [related_productsApi, setrelated_productsApi] = useState([]);

  // ── subcategory children from selected category ──
  const [selectedCategoryChildren, setSelectedCategoryChildren] = useState([]);

  const [newproduct_tax_code, setnewproduct_tax_code] = useState(false);
  const [newproduct_edit_tax_code, setnewproduct_edit_tax_code] = useState(false);
  const [newProductUOM, setnewProductUOM] = useState(false);
  const [editNewproductUOM, seteditNewproductUOM] = useState(false);
  const [newproductWarehouse, setnewproductWarehouse] = useState(false);
  const [editnewproductWarehouse, setEditnewproductWarehouse] = useState(false);
  const [newproductSupplier, setnewproductSupplier] = useState(false);
  const [editnewproductSupplier, setEditnewproductSupplier] = useState(false);
  const [newproductSize, setnewproductSize] = useState(false);
  const [editnewproductSize, setEditnewproductSize] = useState(false);
  const [newproductColor, setnewproductColor] = useState(false);
  const [editnewproductColor, setEditnewproductColor] = useState(false);
  const [newproductCategory, setnewproductCategory] = useState(false);
  const [editnewproductCategory, setEditnewproductCategory] = useState(false);

  const [newProductImage, setnewProductImage] = useState(true);
  const [imageURL, setImageURL] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const inputRef = useRef(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageURL(URL.createObjectURL(file));
      setImageFile(file);
      toast.success("Product image uploaded successfully");
      setnewProductImage(false);
    }
  };

  // ── REMOVE IMAGE ────────────────────────────────────────────────
  const handleImageRemove = (e) => {
    e.stopPropagation();
    setImageURL("");
    setImageFile(null);
    setnewProductImage(true);
    if (inputRef.current) inputRef.current.value = "";
  };

  const [newProductcustom, setnewProductCustom] = useState({
    category: "", tax_code: "", uom: "", warehouse: "",
    size: "", color: "", supplier: "", related_products: "",
  });

  const [newProductData, setnewProductData] = useState({
    id: "", name: "", product_type: "", description: "",
    category: "", tax_code: "", unit_price: "", discount: "",
    uom: "", quantity: "", stock_level: "", reorder_level: "",
    warehouse: "", size: "", color: "", weight: "",
    specifications: "", supplier: "", status: "", product_usage: "",
    related_products: [], sub_category: "",
  });

  // ── FETCH ALL DROPDOWNS ─────────────────────────────────────────
  useEffect(() => {
    const loadDropdowns = async () => {
      const [categories, taxCodes, uoms, warehouses, sizes, colors, suppliers, productsRes] =
        await Promise.all([
          productApiProvider.fetchCategories(),
          productApiProvider.fetchTaxCodes(),
          productApiProvider.fetchUOMs(),
          productApiProvider.fetchWarehouses(),
          productApiProvider.fetchSizes(),
          productApiProvider.fetchColors(),
          productApiProvider.fetchBrands(),
          productApiProvider.fetchProducts(),
        ]);

      setcategoryApi(Array.isArray(categories) ? categories : []);
      settax_codeApi(Array.isArray(taxCodes) ? taxCodes : []);
      setuomApi(Array.isArray(uoms) ? uoms : []);
      setwarehouseApi(Array.isArray(warehouses) ? warehouses : []);
      setsizeApi(Array.isArray(sizes) ? sizes : []);
      setcolorApi(Array.isArray(colors) ? colors : []);
      setsupplierApi(Array.isArray(suppliers) ? suppliers : []);
      const productArray = productsRes?.data?.data ?? productsRes?.data ?? [];
      setrelated_productsApi(Array.isArray(productArray) ? productArray : []);
    };
    loadDropdowns();
  }, []);

  // ── PREFILL ON EDIT ─────────────────────────────────────────────
  useEffect(() => {
    if (editProduct && Object.keys(editProduct).length > 0) {
      setnewProductData({
        id:            editProduct.id            || "",
        name:          editProduct.name          || "",
        product_type:  editProduct.product_type  || "",
        description:   editProduct.description   || "",
        category:      editProduct.is_custom_category  ? "custom" : String(editProduct.category  || ""),
        tax_code:      editProduct.is_custom_tax_code  ? "custom" : String(editProduct.tax_code  || ""),
        unit_price:    editProduct.unit_price    || "",
        discount:      editProduct.discount      || "",
        uom:           editProduct.is_custom_uom       ? "custom" : String(editProduct.uom       || ""),
        quantity:      editProduct.quantity      || "",
        stock_level:   editProduct.stock_level   || "",
        reorder_level: editProduct.reorder_level || "",
        warehouse:     editProduct.is_custom_warehouse ? "custom" : String(editProduct.warehouse || ""),
        size:          editProduct.is_custom_size      ? "custom" : String(editProduct.size      || ""),
        color:         editProduct.is_custom_color     ? "custom" : String(editProduct.color     || ""),
        weight:        editProduct.weight        || "",
        specifications: editProduct.specifications || "",
        supplier:      editProduct.is_custom_supplier  ? "custom" : String(editProduct.supplier  || ""),
        status:        editProduct.status        || "",
        product_usage: editProduct.product_usage || "",
        related_products: Array.isArray(editProduct.related_products) ? editProduct.related_products : [],
        sub_category:  editProduct.sub_category  || "",
      });
      setnewProductCustom({
        category:         editProduct.custom_category         || "",
        tax_code:         editProduct.custom_tax_code         || "",
        uom:              editProduct.custom_uom              || "",
        warehouse:        editProduct.custom_warehouse        || "",
        size:             editProduct.custom_size             || "",
        color:            editProduct.custom_color            || "",
        supplier:         editProduct.custom_supplier         || "",
        related_products: editProduct.custom_related_products || "",
      });
      if (editProduct.image) { setImageURL(editProduct.image); setnewProductImage(false); }

      // ── restore subcategory children when editing ──
      if (editProduct.category && !editProduct.is_custom_category) {
        const found = categoryApi.find(
          (cat) => String(cat.id) === String(editProduct.category)
        );
        setSelectedCategoryChildren(found?.children || []);
      }
    }
  }, [editProduct, categoryApi]);

  // ── HANDLERS ────────────────────────────────────────────────────
  const handleCustomChange = (e) => {
    const { id, value } = e.target;
    setnewProductData((prev) => ({ ...prev, [id]: value }));
    if (value !== "custom") setnewProductCustom((prev) => ({ ...prev, [id]: "" }));
  };

  const handleNewProjectDataChange = (e) =>
    setnewProductData((prev) => ({ ...prev, [e.target.id]: e.target.value }));

  const handleNewProjectCustomData = (e) =>
    setnewProductCustom((prev) => ({ ...prev, [e.target.id]: e.target.value }));

  const handleRelatedProductsChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (opt) => Number(opt.value));
    setnewProductData((prev) => ({ ...prev, related_products: selected }));
  };

  // ── CATEGORY CHANGE — populates subcategory dropdown ────────────
  const handleCategoryChange = (e) => {
    const selectedId = e.target.value;
    setnewProductData((prev) => ({ ...prev, category: selectedId, sub_category: "" }));
    if (selectedId === "custom") {
      setnewProductCustom((prev) => ({ ...prev, category: "" }));
      setSelectedCategoryChildren([]);
      return;
    }
    setnewProductCustom((prev) => ({ ...prev, category: "" }));
    const found = categoryApi.find((cat) => String(cat.id) === String(selectedId));
    setSelectedCategoryChildren(found?.children || []);
  };

  const resetForm = () => {
    setnewProductData({
      id: "", name: "", product_type: "", description: "",
      category: "", tax_code: "", unit_price: "", discount: "",
      uom: "", quantity: "", stock_level: "", reorder_level: "",
      warehouse: "", size: "", color: "", weight: "",
      specifications: "", supplier: "", status: "",
      product_usage: "", related_products: [], sub_category: "",
    });
    setnewProductCustom({
      category: "", tax_code: "", uom: "", warehouse: "",
      size: "", color: "", supplier: "", related_products: "",
    });
    setSelectedCategoryChildren([]);
    setImageURL(""); setImageFile(null); setnewProductImage(true);
  };

  // ── BUILD PAYLOAD ────────────────────────────────────────────────
  const buildPayload = () => {
    const dropdownFields = ["category", "tax_code", "uom", "warehouse", "size", "color", "supplier"];
    for (const field of dropdownFields) {
      if (newProductData[field] === "custom" && !newProductcustom[field]) {
        toast.error(`Custom value for ${field} is required`);
        return null;
      }
    }

    if (imageFile) {
      const fd = new FormData();
      fd.append("name",          newProductData.name);
      fd.append("product_type",  newProductData.product_type);
      fd.append("description",   newProductData.description   || "");
      fd.append("unit_price",    newProductData.unit_price);
      fd.append("discount",      newProductData.discount      || "0");
      fd.append("quantity",      newProductData.quantity);
      fd.append("stock_level",   newProductData.stock_level);
      fd.append("reorder_level", newProductData.reorder_level || "0");
      fd.append("weight",        newProductData.weight        || "");
      fd.append("specifications",newProductData.specifications|| "");
      fd.append("status",        newProductData.status);
      fd.append("product_usage", newProductData.product_usage);
      fd.append("sub_category",  newProductData.sub_category  || "");
      fd.append("image",         imageFile);
      for (const field of dropdownFields) {
        if (newProductData[field] === "custom") {
          fd.append(field, ""); fd.append(`is_custom_${field}`, "true"); fd.append(`custom_${field}`, newProductcustom[field]);
        } else {
          fd.append(field, newProductData[field] || ""); fd.append(`is_custom_${field}`, "false"); fd.append(`custom_${field}`, "");
        }
      }
      const relatedIds = Array.isArray(newProductData.related_products) ? newProductData.related_products : [];
      relatedIds.forEach((id) => fd.append("related_products", id));
      fd.append("is_custom_related_products", "false");
      fd.append("custom_related_products", "");
      return fd;
    } else {
      const body = {
        name: newProductData.name, product_type: newProductData.product_type,
        description: newProductData.description || "", unit_price: newProductData.unit_price,
        discount: newProductData.discount || "0", quantity: Number(newProductData.quantity),
        stock_level: Number(newProductData.stock_level), reorder_level: Number(newProductData.reorder_level) || 0,
        weight: newProductData.weight || "", specifications: newProductData.specifications || "",
        status: newProductData.status, product_usage: newProductData.product_usage,
        sub_category: newProductData.sub_category || "",
      };
      for (const field of dropdownFields) {
        if (newProductData[field] === "custom") {
          body[field] = null; body[`is_custom_${field}`] = true; body[`custom_${field}`] = newProductcustom[field];
        } else {
          body[field] = newProductData[field] ? Number(newProductData[field]) : null;
          body[`is_custom_${field}`] = false; body[`custom_${field}`] = "";
        }
      }
      body.related_products = Array.isArray(newProductData.related_products) ? newProductData.related_products.map(Number) : [];
      body.is_custom_related_products = false; body.custom_related_products = "";
      return body;
    }
  };

  // ── SUBMIT ───────────────────────────────────────────────────────
  const handleNewProductSubmit = async (e) => {
    e.preventDefault();
    const payload = buildPayload();
    if (!payload) return;
    let res;
    if (editNewProduct && newProductData.id) res = await productApiProvider.updateProduct(newProductData.id, payload);
    else res = await productApiProvider.createProduct(payload);
    if (res) { setTimeout(() => { resetForm(); setshowNewProduct(false); setEditProduct({}); }, 3000); }
  };

  const handleNewProductReset = (e) => {
    e.preventDefault(); resetForm(); setshowNewProduct(false); setEditProduct({});
  };

  const anyModalOpen =
    newproduct_tax_code || newproduct_edit_tax_code ||
    editNewproductUOM   || newProductUOM ||
    editnewproductWarehouse || newproductWarehouse ||
    newproductSupplier  || editnewproductSupplier ||
    newproductSize      || editnewproductSize ||
    newproductColor     || editnewproductColor;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      {/* ── CATEGORY MODAL ── */}
      {(newproductCategory || editnewproductCategory) && (
        <NewproductCategory
          newproductCategory={newproductCategory}
          setnewproductCategory={setnewproductCategory}
          editnewproductCategory={editnewproductCategory}
          setEditnewproductCategory={setEditnewproductCategory}
          onCategoryCreated={async () => {
            const cats = await productApiProvider.fetchCategories();
            setcategoryApi(Array.isArray(cats) ? cats : []);
          }}
        />
      )}

      {/* ── OTHER MODALS ── */}
      {(newproduct_tax_code || newproduct_edit_tax_code) && (
        <div className="product-bg-btn">
          <NewproductTaxCode
            newproduct_tax_code={newproduct_tax_code}
            setnewproduct_tax_code={setnewproduct_tax_code}
            newproduct_edit_tax_code={newproduct_edit_tax_code}
            setnewproduct_edit_tax_code={setnewproduct_edit_tax_code}
          />
        </div>
      )}
      {(newProductUOM || editNewproductUOM) && (
        <div className="product-bg-btn">
          <NewproductUOM
            newProductUOM={newProductUOM}
            setnewProductUOM={setnewProductUOM}
            editNewproductUOM={editNewproductUOM}
            seteditNewproductUOM={seteditNewproductUOM}
          />
        </div>
      )}
      {(newproductWarehouse || editnewproductWarehouse) && (
        <div className="product-bg-btn">
          <NewproductWarehouse
            newproductWarehouse={newproductWarehouse}
            setnewproductWarehouse={setnewproductWarehouse}
            editnewproductWarehouse={editnewproductWarehouse}
            setEditnewproductWarehouse={setEditnewproductWarehouse}
          />
        </div>
      )}
      {(newproductSupplier || editnewproductSupplier) && (
        <div className="product-bg-btn">
          <NewproductSupplier
            newproductSupplier={newproductSupplier}
            setnewproductSupplier={setnewproductSupplier}
            editnewproductSupplier={editnewproductSupplier}
            setEditnewproductSupplier={setEditnewproductSupplier}
          />
        </div>
      )}
      {(newproductSize || editnewproductSize) && (
        <div className="product-bg-autoheight-btn">
          <NewproductSize
            newproductSize={newproductSize}
            setnewproductSize={setnewproductSize}
            editnewproductSize={editnewproductSize}
            setEditnewproductSize={setEditnewproductSize}
          />
        </div>
      )}
      {(newproductColor || editnewproductColor) && (
        <div className="product-bg-autoheight-btn">
          <NewproductColor
            newproductColor={newproductColor}
            setnewproductColor={setnewproductColor}
            editnewproductColor={editnewproductColor}
            setEditnewproductColor={setEditnewproductColor}
          />
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div className={`newProduct-container ${anyModalOpen ? "product-bg-blur" : ""}`}>
        <form onSubmit={handleNewProductSubmit}>

          {/* ── HEADER ── */}
          <div className="newProduct-title">
            <p>{editNewProduct ? "Edit" : "Create New"} Product</p>
            <div
              className="close-newproduct-container"
              onClick={() => { setshowNewProduct(false); setEditProduct({}); }}
            >
              <svg className="circle-x-logo-newproduct" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
              </svg>
              <nav className="close-newproduct">Close</nav>
            </div>
          </div>

          {/* ── IMAGE + BASIC INFO ── */}
          <div className="createNewProduct-cointainer">
            <input type="file" accept="image/*" ref={inputRef} hidden onChange={handleImageChange} />

            {/* ── UPLOAD PLACEHOLDER ── */}
            {newProductImage ? (
              <div className="newProduct-photo-cointainer" onClick={() => inputRef.current?.click()}>
                <div className="newProduct-photo-bg">
                  <nav className="newProduct-photo-bg-up">
                    <svg className="newProject-camera-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                      <path d="M220.6 121.2L271.1 96 448 96l0 96-114.8 0c-21.9-15.1-48.5-24-77.2-24s-55.2 8.9-77.2 24L64 192l0-64 128 0c9.9 0 19.7-2.3 28.6-6.8zM0 128L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L271.1 32c-9.9 0-19.7 2.3-28.6 6.8L192 64l-32 0 0-16c0-8.8-7.2-16-16-16L80 32c-8.8 0-16 7.2-16 16l0 16C28.7 64 0 92.7 0 128zM168 304a88 88 0 1 1 176 0 88 88 0 1 1 -176 0z" />
                    </svg>
                    <p>Upload Photo</p>
                  </nav>
                  <nav className="newProduct-photo-bg-down">
                    <div>
                      <nav>
                        <p className="newProduct-photo-title">Allowed Format</p>
                        <p className="newProduct-photo-content">JPG, JPEG, PNG</p>
                      </nav>
                      <nav>
                        <p className="newProduct-photo-title">Max File Size</p>
                        <p className="newProduct-photo-content">2MB</p>
                      </nav>
                    </div>
                  </nav>
                </div>
              </div>
            ) : (
              /* ── IMAGE PREVIEW WITH REMOVE BUTTON ── */
              <div className="newProduct-image-wrapper">
                <img
                  className="newProduct-image"
                  src={imageURL}
                  alt="Product Preview"
                  onClick={() => inputRef.current?.click()}
                />
                <button
                  type="button"
                  className="newProduct-image-remove"
                  onClick={handleImageRemove}
                  title="Remove image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
                  </svg>
                </button>
              </div>
            )}

            {/* ── RIGHT SIDE BASIC INFO ── */}
            <div className="createNewProduct-right">
              <div className="createNewProduct-box">
                <label htmlFor="name">Product Name<sup>*</sup></label>
                <input
                  id="name"
                  type="text"
                  value={newProductData.name}
                  onChange={handleNewProjectDataChange}
                  placeholder="Headphones"
                  required
                />
              </div>
              <div className="createNewProduct-box">
                <label htmlFor="product_type">Product Type<sup>*</sup></label>
                <select
                  id="product_type"
                  value={newProductData.product_type}
                  onChange={handleNewProjectDataChange}
                  required
                >
                  <option value="">Select Product Type</option>
                  <option value="Goods">Goods</option>
                  <option value="Services">Servicess</option>
                  <option value="Combo">Combos</option>
                </select>
              </div>
              <div className="createNewProduct-box">
                <label>Product IDs (Auto Generate)</label>
                <input type="text" value={newProductData.id} placeholder="Auto Generate" disabled />
              </div>
              <div className="createNewProduct-box">
                <label htmlFor="description">Descriptions<sup>*</sup></label>
                <textarea
                  id="description"
                  value={newProductData.description}
                  onChange={handleNewProjectDataChange}
                  placeholder="Enter product description..."
                  required
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* ── CATEGORIZATION ── */}
          <div className="newProduct-title">
            <div>Categorization</div>
            <nav onClick={() => setnewproductCategory(true)}>+ Add New Category</nav>
          </div>

          <div className="NewProduct-input-cointainer">

            {/* Category Dropdown */}
            <div className="newProduct-box">
              <label htmlFor="category">
                <p>Category<sup>*</sup></p>
              </label>
              <select
                id="category"
                value={newProductData.category}
                onChange={handleCategoryChange}
                required={newProductData.category !== "custom"}
              >
                <option value="" disabled>Select Category</option>
                {categoryApi.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
                <option value="custom">+ Custom</option>
              </select>
              {newProductData.category === "custom" && (
                <input
                  type="text"
                  id="category"
                  placeholder="Enter custom category"
                  value={newProductcustom.category}
                  onChange={handleNewProjectCustomData}
                  style={{ marginTop: 6 }}
                  required
                />
              )}
            </div>

            {/* Subcategory Dropdown */}
            <div className="newProduct-box">
              <label htmlFor="sub_category">
                <p>Subcategory<sup>*</sup></p>
              </label>
              <select
                id="sub_category"
                value={newProductData.sub_category}
                onChange={handleNewProjectDataChange}
                required
                disabled={
                  !newProductData.category ||
                  newProductData.category === "custom" ||
                  selectedCategoryChildren.length === 0
                }
              >
                <option value="" disabled>
                  {!newProductData.category
                    ? "Select a category first"
                    : newProductData.category === "custom"
                    ? "N/A for custom category"
                    : selectedCategoryChildren.length === 0
                    ? "No subcategories available"
                    : "Select Subcategory"}
                </option>
                {selectedCategoryChildren.map((child) => (
                  <option key={child.id} value={child.name}>
                    {child.name}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* ── PRICING & TAX ── */}
          <div className="newProduct-title"><div>Pricing & Tax</div></div>
          <div className="NewProduct-input-cointainer">
            <div className="newProduct-box">
              <label htmlFor="unit_price">Unit Price<sup>*</sup></label>
              <input
                className="increment-decrement-newProduct"
                type="number"
                id="unit_price"
                placeholder="Enter Price"
                value={newProductData.unit_price}
                onChange={handleNewProjectDataChange}
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="newProduct-box">
              <label htmlFor="discount">Discount (%)</label>
              <input
                className="increment-decrement-newProduct"
                type="number"
                id="discount"
                value={newProductData.discount}
                onChange={handleNewProjectDataChange}
                placeholder="e.g., 10"
                min="0"
                max="100"
                step="0.01"
              />
            </div>
            <div className="newProduct-box">
              <label htmlFor="tax_code">
                <p>Tax Code<sup>*</sup></p>
                <nav onClick={() => setnewproduct_tax_code(true)}>+ Add New</nav>
              </label>
              <CategoryInput
                handleCustomChange={handleCustomChange}
                newProductData={newProductData}
                handleNewProjectCustomData={handleNewProjectCustomData}
                newProductcustom={newProductcustom}
                id="tax_code"
                customApi={tax_codeApi}
                required
              />
            </div>
          </div>

          {/* ── UNIT & STOCK ── */}
          <div className="newProduct-title"><div>Unit & Stock</div></div>
          <div className="NewProduct-input-cointainer">
            <div className="newProduct-box">
              <label htmlFor="quantity">Quantity<sup>*</sup></label>
              <input
                id="quantity"
                type="number"
                className="increment-decrement-newProduct"
                value={newProductData.quantity}
                onChange={handleNewProjectDataChange}
                placeholder="e.g., 50"
                min="0"
                required
              />
            </div>
            <div className="newProduct-box">
              <label htmlFor="uom">
                <p>UOM (Unit Of Measurement)<sup>*</sup></p>
                <nav onClick={() => setnewProductUOM(true)}>+ Add New</nav>
              </label>
              <CategoryInput
                handleCustomChange={handleCustomChange}
                newProductData={newProductData}
                handleNewProjectCustomData={handleNewProjectCustomData}
                newProductcustom={newProductcustom}
                id="uom"
                customApi={uomApi}
                required
              />
            </div>
          </div>

          {/* ── INVENTORY ── */}
          <div className="newProduct-title"><div>Inventory Details</div></div>
          <div className="NewProduct-input-cointainer">
            <div className="newProduct-box">
              <label htmlFor="stock_level">Stock Level<sup>*</sup></label>
              <input
                className="increment-decrement-newProduct"
                type="number"
                id="stock_level"
                placeholder="e.g., 120"
                value={newProductData.stock_level}
                onChange={handleNewProjectDataChange}
                min="0"
                required
              />
            </div>
            <div className="newProduct-box">
              <label htmlFor="reorder_level">Reorder Level</label>
              <input
                className="increment-decrement-newProduct"
                type="number"
                id="reorder_level"
                value={newProductData.reorder_level}
                onChange={handleNewProjectDataChange}
                placeholder="e.g., 30"
                min="0"
              />
            </div>
            <div className="newProduct-box">
              <label htmlFor="warehouse">
                <p>Warehouse<sup>*</sup></p>
                <nav onClick={() => setnewproductWarehouse(true)}>+ Add New</nav>
              </label>
              <CategoryInput
                handleCustomChange={handleCustomChange}
                newProductData={newProductData}
                handleNewProjectCustomData={handleNewProjectCustomData}
                newProductcustom={newProductcustom}
                id="warehouse"
                customApi={warehouseApi}
                required
              />
            </div>
          </div>

          {/* ── ATTRIBUTES ── */}
          <div className="newProduct-title"><div>Product Attributes & Specifications</div></div>
          <div className="NewProduct-input-cointainer">
            <div className="newProduct-box">
              <label htmlFor="size">
                <p>Size</p>
                <nav onClick={() => setnewproductSize(true)}>+ Add New</nav>
              </label>
              <CategoryInput
                handleCustomChange={handleCustomChange}
                newProductData={newProductData}
                handleNewProjectCustomData={handleNewProjectCustomData}
                newProductcustom={newProductcustom}
                id="size"
                customApi={sizeApi}
              />
            </div>
            <div className="newProduct-box">
              <label htmlFor="color">
                <p>Color</p>
                <nav onClick={() => setnewproductColor(true)}>+ Add New</nav>
              </label>
              <CategoryInput
                handleCustomChange={handleCustomChange}
                newProductData={newProductData}
                handleNewProjectCustomData={handleNewProjectCustomData}
                newProductcustom={newProductcustom}
                id="color"
                customApi={colorApi}
              />
            </div>
            <div className="newProduct-box">
              <label htmlFor="weight">Weight</label>
              <input
                type="text"
                id="weight"
                value={newProductData.weight}
                onChange={handleNewProjectDataChange}
                placeholder="e.g., 300g"
              />
            </div>
          </div>
          <div className="NewProduct-input-cointainer">
            <div className="newProduct-box">
              <label htmlFor="specifications">Specifications</label>
              <input
                type="text"
                id="specifications"
                value={newProductData.specifications}
                onChange={handleNewProjectDataChange}
                placeholder="Text area"
              />
            </div>
          </div>

          {/* ── RELATED PRODUCTS & SUPPLIER ── */}
          <div className="newProduct-title"><div>Related Products & Supplier Info</div></div>
          <div className="NewProduct-input-cointainer">
            <div className="newProduct-box">
              <label htmlFor="related_products"><p>Related Products</p></label>
              <select
                id="related_products"
                multiple
                value={newProductData.related_products.map(String)}
                onChange={handleRelatedProductsChange}
                style={{ minHeight: "80px" }}
              >
                {related_productsApi
                  .filter((p) => p.id !== Number(newProductData.id))
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.product_id ? `${p.product_id} – ` : ""}{p.name}
                    </option>
                  ))}
              </select>
              <small style={{ color: "#888" }}>Hold Ctrl / Cmd to select multiple</small>
            </div>
            <div className="newProduct-box">
              <label htmlFor="supplier">
                <p>Supplier<sup>*</sup></p>
                <nav onClick={() => setnewproductSupplier(true)}>+ Add New</nav>
              </label>
              <CategoryInput
                handleCustomChange={handleCustomChange}
                newProductData={newProductData}
                handleNewProjectCustomData={handleNewProjectCustomData}
                newProductcustom={newProductcustom}
                id="supplier"
                customApi={supplierApi}
                required
              />
            </div>
          </div>

          {/* ── SETTINGS ── */}
          <div className="newProduct-title"><div>Settings</div></div>
          <div className="NewProduct-input-cointainer">
            <div className="newProduct-box">
              <label htmlFor="status"><p>Status<sup>*</sup></p></label>
              <select
                id="status"
                value={newProductData.status}
                onChange={handleNewProjectDataChange}
                required
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Discontinued">Discontinued</option>
              </select>
            </div>
            <div className="newProduct-box">
              <label htmlFor="product_usage"><p>Product Usage<sup>*</sup></p></label>
              <select
                id="product_usage"
                value={newProductData.product_usage}
                onChange={handleNewProjectDataChange}
                required
              >
                <option value="">Select Product Usage</option>
                <option value="Purchase">Purchase</option>
                <option value="Sale">Sale</option>
                <option value="Both">Both</option>
              </select>
            </div>
          </div>

          {/* ── ACTIONS ── */}
          <div className="newProduct-submit-cointainer">
            <button className="newProduct-reset-btn" type="reset" onClick={handleNewProductReset}>
              Discard
            </button>
            <button className="newProduct-submit-btn" type="submit">
              {editNewProduct ? "Update Product" : "Add Product"}
            </button>
          </div>

        </form>
      </div>
    </>
  );
}