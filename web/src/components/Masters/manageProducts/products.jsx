// import React, { useState, useEffect } from "react";
// import "./products.css";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import productApiProvider from "../../../network/product-api-provider";
// import CreateNewProduct from "./createNewProduct";
// import ProductImport from "./productImport/productImport";

// export default function Products() {

//   const [loading, setLoading]   = useState(false);
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [brands, setBrands]     = useState([]);

//   const [searchID, setSearchID] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedBrand, setSelectedBrand]       = useState("");
//   const [selectedStatus, setSelectedStatus]     = useState("");
//   const [selectedProductType, setSelectedProductType] = useState("");

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages]   = useState(1);
//   const [totalCount, setTotalCount]   = useState(0);
//   const rowsPerPage = 10;

//   const [showNewProduct, setShowNewProduct]   = useState(false);
//   const [editNewProduct, setEditNewProduct]   = useState(false);
//   const [editProduct, setEditProduct]         = useState({});
//   const [showProductImport, setShowProductImport] = useState(false);

//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteProductData, setDeleteProductData] = useState(null);

//   // ======================================================
//   // FETCH — server-side pagination + search
//   // ======================================================
//   const loadProducts = async (page = 1, search = "") => {
//     setLoading(true);
//     const res = await productApiProvider.fetchProducts(page, search);
//     // Response: { message, data: { from, to, totalCount, totalPages, data: [...] } }
//     const inner        = res?.data ?? {};
//     const productArray = inner?.data ?? [];
//     setProducts(Array.isArray(productArray) ? productArray : []);
//     setTotalPages(inner?.totalPages ?? 1);
//     setTotalCount(inner?.totalCount ?? 0);
//     setLoading(false);
//   };

//   useEffect(() => {
//     const loadDropdowns = async () => {
//       const [categoryRes, brandRes] = await Promise.all([
//         productApiProvider.fetchCategories(),
//         productApiProvider.fetchBrands(),
//       ]);
//       setCategories(Array.isArray(categoryRes) ? categoryRes : []);
//       setBrands(Array.isArray(brandRes) ? brandRes : []);
//     };
//     loadDropdowns();
//     loadProducts(1, "");
//   }, []);

//   // Re-fetch when page changes
//   useEffect(() => {
//     loadProducts(currentPage, searchID);
//   }, [currentPage]);

//   // Reset to page 1 and re-fetch when search changes
//   const handleSearch = (value) => {
//     setSearchID(value);
//     setCurrentPage(1);
//     loadProducts(1, value);
//   };

//   // ======================================================
//   // CLIENT-SIDE FILTER (category / brand / status / type)
//   // ======================================================
//   const filtered = products
//     .filter((p) =>
//       selectedCategory ? p.category_detail?.name === selectedCategory : true
//     )
//     .filter((p) =>
//       selectedBrand ? p.supplier_detail?.name === selectedBrand : true
//     )
//     .filter((p) => (selectedStatus ? p.status === selectedStatus : true))
//     .filter((p) => (selectedProductType ? p.product_type === selectedProductType : true));

//   const handleNext = () => currentPage < totalPages && setCurrentPage((p) => p + 1);
//   const handlePrev = () => currentPage > 1 && setCurrentPage((p) => p - 1);

//   // ======================================================
//   // DELETE
//   // ======================================================
//   const handleDeleteClick = (product) => {
//     setDeleteProductData(product);
//     setShowDeleteModal(true);
//   };

//   const confirmDelete = async () => {
//     if (!deleteProductData) return;
//     const success = await productApiProvider.deleteProduct(deleteProductData.id);
//     if (success) {
//       await loadProducts(currentPage, searchID);
//     }
//     setShowDeleteModal(false);
//     setDeleteProductData(null);
//   };

//   // ======================================================
//   // EDIT — unwrap the nested response
//   // ======================================================
//   const loadEditProduct = async (id) => {
//     const res = await productApiProvider.fetchSingleProduct(id);
//     if (res) {
//       // API may return { message, data: { ...product } } or the product directly
//       const product = res?.data ?? res;
//       setEditProduct(product);
//       setEditNewProduct(true);
//     }
//   };

//   // ======================================================
//   // DROPDOWNS FOR FILTERS
//   // ======================================================
//   const categoryOptions = categories.length > 0
//     ? categories
//     : [...new Map(products.map((p) => [p.category_detail?.name, p.category_detail])).values()].filter(Boolean);

//   const brandOptions = brands.length > 0
//     ? brands
//     : [...new Map(products.map((p) => [p.supplier_detail?.name, p.supplier_detail])).values()].filter(Boolean);

//   const resetFilters = () => {
//     setSearchID("");
//     setSelectedCategory("");
//     setSelectedBrand("");
//     setSelectedStatus("");
//     setSelectedProductType("");
//     setCurrentPage(1);
//     loadProducts(1, "");
//   };

//   // After create/edit, reload list
//   const handleCloseCreate = () => {
//     setShowNewProduct(false);
//     setEditNewProduct(false);
//     setEditProduct({});
//     loadProducts(currentPage, searchID);
//   };

//   // ======================================================
//   // RENDER
//   // ======================================================
//   return (
//     <>
//       <ToastContainer />

//       {showDeleteModal && (
//         <div
//           className="product-delete-modal"
//           style={{ maxWidth: "420px", width: "100%", paddingBottom: "10px", height: "auto", minHeight: "unset" }}
//         >
//           <svg
//             className="product-close-icon"
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

//           <div className="product-modal-head">
//             <p>Delete Product</p>
//           </div>

//           <div className="product-modal-body" style={{ padding: "16px 20px", height: "auto" }}>
//             <p style={{ textAlign: "center", fontSize: "15px", lineHeight: "22px", marginBottom: "20px" }}>
//               Are you sure you want to delete <br />
//               <strong>{deleteProductData?.name}</strong>
//               <br />
//               (ID: {deleteProductData?.product_id})?
//             </p>
//             <div className="product-modal-actions" style={{ justifyContent: "center", gap: "14px" }}>
//               <button type="button" className="product-cancel-btn" onClick={() => setShowDeleteModal(false)}>
//                 Cancel
//               </button>
//               <button type="button" className="product-delete-confirm-btn" onClick={confirmDelete}>
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showNewProduct ? (
//         <CreateNewProduct
//           setshowNewProduct={handleCloseCreate}
//           editNewProduct={false}
//           editProduct={{}}
//           setEditProduct={setEditProduct}
//         />
//       ) : editNewProduct ? (
//         <CreateNewProduct
//           setshowNewProduct={handleCloseCreate}
//           editNewProduct={editNewProduct}
//           editProduct={editProduct}
//           setEditProduct={setEditProduct}
//         />
//       ) : showProductImport ? (
//         <ProductImport
//           setshowProductImport={setShowProductImport}
//           setProducts={setProducts}
//         />
//       ) : (
//         <div className={`product-container ${showDeleteModal ? "blur" : ""}`}>

//           <div className="product-header">
//             <p>Product Master</p>
//             <nav>
//               <button onClick={() => setShowNewProduct(true)}>+ Add New Product</button>
//               <button onClick={() => setShowProductImport(true)}>Import</button>
//             </nav>
//           </div>

//           <div className="product-search-box">
//             <label htmlFor="searchByID">
//               <svg className="product-search-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
//                 <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
//               </svg>
//             </label>
//             <input
//               id="searchByID"
//               placeholder="Search by Product ID or Name..."
//               value={searchID}
//               onChange={(e) => handleSearch(e.target.value)}
//             />
//           </div>

//           <div className="product-clearfilter">
//             <p onClick={resetFilters}>Clear Filter</p>
//           </div>

//           <div className="product-search-category">
//             <div className="product-input-box">
//               <label>Category</label>
//               <select value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}>
//                 <option value="">All</option>
//                 {categoryOptions.map((c, i) => (
//                   <option key={i} value={typeof c === "object" ? c.name : c}>
//                     {typeof c === "object" ? c.name : c}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="product-input-box">
//               <label>Brand / Supplier</label>
//               <select value={selectedBrand} onChange={(e) => { setSelectedBrand(e.target.value); setCurrentPage(1); }}>
//                 <option value="">All</option>
//                 {brandOptions.map((b, i) => (
//                   <option key={i} value={typeof b === "object" ? b.name : b}>
//                     {typeof b === "object" ? b.name : b}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="product-input-box">
//               <label>Status</label>
//               <select value={selectedStatus} onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}>
//                 <option value="">All</option>
//                 <option value="Active">Active</option>
//                 <option value="Inactive">Inactive</option>
//                 <option value="Discontinued">Discontinued</option>
//               </select>
//             </div>

//             <div className="product-input-box">
//               <label>Type</label>
//               <select value={selectedProductType} onChange={(e) => { setSelectedProductType(e.target.value); setCurrentPage(1); }}>
//                 <option value="">All</option>
//                 <option value="Goods">Goods</option>
//                 <option value="Services">Services</option>
//                 <option value="Combo">Combo</option>
//               </select>
//             </div>
//           </div>

//           <div className="product-table-cointainer">
//             <table>
//               <thead className="product-thead">
//                 <tr>
//                   <th>S.No</th>
//                   <th>Product ID</th>
//                   <th>Name</th>
//                   <th>Type</th>
//                   <th>Category</th>
//                   <th>Status</th>
//                   <th>Stock Level</th>
//                   <th>Price</th>
//                   <th id="product_tData_width_action">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="product-tbody">
//                 {loading ? (
//                   <tr>
//                     <td colSpan={9} style={{ textAlign: "center" }}>Loading...</td>
//                   </tr>
//                 ) : filtered.length > 0 ? (
//                   filtered.map((p, i) => (
//                     <tr key={p.id ?? i}>
//                       <td>{(currentPage - 1) * rowsPerPage + i + 1}</td>
//                       <td>{p.product_id}</td>
//                       <td>{p.name}</td>
//                       <td>{p.product_type}</td>
//                       <td>{p.category_detail?.name ?? "-"}</td>
//                       <td>
//                         <div className={p.status === "Active" ? "productStatus-active" : "productStatus-inactive"}>
//                           {p.status}
//                         </div>
//                       </td>
//                       <td>{p.stock_level}</td>
//                       <td>{p.unit_price}</td>
//                       <td id="product_tData_width_action">
//                         <svg className="product-dot-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512">
//                           <path d="M64 360a56 56 0 1 0 0 112 56 56 
//                           0 1 0 0-112zm0-160a56 56 0 1 
//                           0 0 112 56 56 0 1 0 0-112zM120 96A56 56 
//                           0 1 0 8 96a56 56 0 1 0 112 0z" />
//                         </svg>
//                         <nav className="product-dot-container">
//                           <div onClick={() => loadEditProduct(p.id)}>Edit</div>
//                           <div onClick={() => handleDeleteClick(p)}>Delete</div>
//                         </nav>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={9} style={{ textAlign: "center" }}>No Data Found</td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           <nav className="productImport-table-bottem">
//             <p className="productImport-num-entries">
//               Showing {products.length} of {totalCount} entries
//             </p>
//             <div className="productImport-manage-control-box">
//               <button className="productImport-manage-btn" onClick={handlePrev} disabled={currentPage === 1}>
//                 Prev
//               </button>
//               <nav className="productImport-num-page">
//                 Page {currentPage} of {totalPages}
//               </nav>
//               <button className="productImport-manage-btn" onClick={handleNext} disabled={currentPage === totalPages}>
//                 Next
//               </button>
//             </div>
//           </nav>

//         </div>
//       )}
//     </>
//   );
// }
import React, { useState, useEffect } from "react";
import "./products.css";
import "react-toastify/dist/ReactToastify.css";

import productApiProvider from "../../../network/product-api-provider";
import CreateNewProduct from "./createNewProduct";
import ProductImport from "./productImport/productImport";

export default function Products() {

  const [loading, setLoading]   = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands]     = useState([]);

  const [searchID, setSearchID] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand]       = useState("");
  const [selectedStatus, setSelectedStatus]     = useState("");
  const [selectedProductType, setSelectedProductType] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [totalCount, setTotalCount]   = useState(0);
  const rowsPerPage = 10;

  const [showNewProduct, setShowNewProduct]   = useState(false);
  const [editNewProduct, setEditNewProduct]   = useState(false);
  const [editProduct, setEditProduct]         = useState({});
  const [showProductImport, setShowProductImport] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteProductData, setDeleteProductData] = useState(null);

  // ======================================================
  // FETCH — server-side pagination + search
  // ======================================================
  const loadProducts = async (page = 1, search = "") => {
    setLoading(true);
    const res = await productApiProvider.fetchProducts(page, search);
    const inner        = res?.data ?? {};
    const productArray = inner?.data ?? [];
    setProducts(Array.isArray(productArray) ? productArray : []);
    setTotalPages(inner?.totalPages ?? 1);
    setTotalCount(inner?.totalCount ?? 0);
    setLoading(false);
  };

  useEffect(() => {
    const loadDropdowns = async () => {
      const [categoryRes, brandRes] = await Promise.all([
        productApiProvider.fetchCategories(),
        productApiProvider.fetchBrands(),
      ]);
      setCategories(Array.isArray(categoryRes) ? categoryRes : []);
      setBrands(Array.isArray(brandRes) ? brandRes : []);
    };
    loadDropdowns();
    loadProducts(1, "");
  }, []);

  useEffect(() => {
    loadProducts(currentPage, searchID);
  }, [currentPage]);

  const handleSearch = (value) => {
    setSearchID(value);
    setCurrentPage(1);
    loadProducts(1, value);
  };

  // ======================================================
  // CLIENT-SIDE FILTER (category / brand / status / type)
  // ======================================================
  const filtered = products
    .filter((p) =>
      selectedCategory ? p.category_detail?.name === selectedCategory : true
    )
    .filter((p) =>
      selectedBrand ? p.supplier_detail?.name === selectedBrand : true
    )
    .filter((p) => (selectedStatus ? p.status === selectedStatus : true))
    .filter((p) => (selectedProductType ? p.product_type === selectedProductType : true));

  const handleNext = () => currentPage < totalPages && setCurrentPage((p) => p + 1);
  const handlePrev = () => currentPage > 1 && setCurrentPage((p) => p - 1);

  // ======================================================
  // DELETE
  // ======================================================
  const handleDeleteClick = (product) => {
    setDeleteProductData(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteProductData) return;
    const success = await productApiProvider.deleteProduct(deleteProductData.id);
    if (success) {
      await loadProducts(currentPage, searchID);
    }
    setShowDeleteModal(false);
    setDeleteProductData(null);
  };

  // ======================================================
  // EDIT — unwrap the nested response
  // ======================================================
  const loadEditProduct = async (id) => {
    const res = await productApiProvider.fetchSingleProduct(id);
    if (res) {
      const product = res?.data ?? res;
      setEditProduct(product);
      setEditNewProduct(true);
    }
  };

  // ======================================================
  // DROPDOWNS FOR FILTERS
  // ======================================================
  const categoryOptions = categories.length > 0
    ? categories
    : [...new Map(products.map((p) => [p.category_detail?.name, p.category_detail])).values()].filter(Boolean);

  const brandOptions = brands.length > 0
    ? brands
    : [...new Map(products.map((p) => [p.supplier_detail?.name, p.supplier_detail])).values()].filter(Boolean);

  const resetFilters = () => {
    setSearchID("");
    setSelectedCategory("");
    setSelectedBrand("");
    setSelectedStatus("");
    setSelectedProductType("");
    setCurrentPage(1);
    loadProducts(1, "");
  };

  const handleCloseCreate = () => {
    setShowNewProduct(false);
    setEditNewProduct(false);
    setEditProduct({});
    loadProducts(currentPage, searchID);
  };

  // ======================================================
  // RENDER
  // ======================================================
  return (
    <>
      {/* ❌ REMOVED: <ToastContainer /> — only one should exist in App.jsx */}

      {showDeleteModal && (
        <div
          className="product-delete-modal"
          style={{ maxWidth: "420px", width: "100%", paddingBottom: "10px", height: "auto", minHeight: "unset" }}
        >
          <svg
            className="product-close-icon"
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

          <div className="product-modal-head">
            <p>Delete Product</p>
          </div>

          <div className="product-modal-body" style={{ padding: "16px 20px", height: "auto" }}>
            <p style={{ textAlign: "center", fontSize: "15px", lineHeight: "22px", marginBottom: "20px" }}>
              Are you sure you want to delete <br />
              <strong>{deleteProductData?.name}</strong>
              <br />
              (ID: {deleteProductData?.product_id})?
            </p>
            <div className="product-modal-actions" style={{ justifyContent: "center", gap: "14px" }}>
              <button type="button" className="product-cancel-btn" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button type="button" className="product-delete-confirm-btn" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showNewProduct ? (
        <CreateNewProduct
          setshowNewProduct={handleCloseCreate}
          editNewProduct={false}
          editProduct={{}}
          setEditProduct={setEditProduct}
        />
      ) : editNewProduct ? (
        <CreateNewProduct
          setshowNewProduct={handleCloseCreate}
          editNewProduct={editNewProduct}
          editProduct={editProduct}
          setEditProduct={setEditProduct}
        />
      ) : showProductImport ? (
        <ProductImport
          setshowProductImport={setShowProductImport}
          setProducts={setProducts}
        />
      ) : (
        <div className={`product-container ${showDeleteModal ? "blur" : ""}`}>

          <div className="product-header">
            <p>Product Master</p>
            <nav>
              <button onClick={() => setShowNewProduct(true)}>+ Add New Product</button>
              <button onClick={() => setShowProductImport(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style={{ width: "13px", height: "13px", fill: "#fff", marginRight: "6px", verticalAlign: "middle" }}>
                  <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 242.7-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7 288 32zM64 352c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-101.5 0-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352 64 352zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
                </svg>
                Import
              </button>
            </nav>
          </div>

          <div className="product-search-box">
            <label htmlFor="searchByID">
              <svg className="product-search-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
              </svg>
            </label>
            <input
              id="searchByID"
              placeholder="Search by Product ID or Name..."
              value={searchID}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <div className="product-clearfilter">
            <p onClick={resetFilters}>Clear Filters</p>
          </div>

          <div className="product-search-category">
            <div className="product-input-box">
              <label>Category</label>
              <select value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}>
                <option value="">All</option>
                {categoryOptions.map((c, i) => (
                  <option key={i} value={typeof c === "object" ? c.name : c}>
                    {typeof c === "object" ? c.name : c}
                  </option>
                ))}
              </select>
            </div>

            <div className="product-input-box">
              <label>Brands</label>
              <select value={selectedBrand} onChange={(e) => { setSelectedBrand(e.target.value); setCurrentPage(1); }}>
                <option value="">All</option>
                {brandOptions.map((b, i) => (
                  <option key={i} value={typeof b === "object" ? b.name : b}>
                    {typeof b === "object" ? b.name : b}
                  </option>
                ))}
              </select>
            </div>

            <div className="product-input-box">
              <label>Status</label>
              <select value={selectedStatus} onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}>
                <option value="">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Discontinued">Discontinued</option>
              </select>
            </div>

            <div className="product-input-box">
              <label>Type</label>
              <select value={selectedProductType} onChange={(e) => { setSelectedProductType(e.target.value); setCurrentPage(1); }}>
                <option value="">All</option>
                <option value="Goods">Goods</option>
                <option value="Services">Services</option>
                <option value="Combo">Combo</option>
              </select>
            </div>
          </div>

          <div className="product-table-cointainer">
            <table>
              <thead className="product-thead">
                <tr>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Stock Level</th>
                  <th>Price</th>
                  <th id="product_tData_width_action">Action</th>
                </tr>
              </thead>
              <tbody className="product-tbody">
                {loading ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center" }}>Loading...</td>
                  </tr>
                ) : filtered.length > 0 ? (
                  filtered.map((p, i) => (
                    <tr key={p.id ?? i}>
                      <td>{p.product_id}</td>
                      <td>{p.name}</td>
                      <td>{p.product_type}</td>
                      <td>{p.category_detail?.name ?? "-"}</td>
                      <td>
                        <div className={p.status === "Active" ? "productStatus-active" : "productStatus-inactive"}>
                          {p.status}
                        </div>
                      </td>
                      <td>{p.stock_level}</td>
                      <td>₹{p.unit_price}</td>
                      <td id="product_tData_width_action">
                        <svg className="product-dot-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512">
                          <path d="M64 360a56 56 0 1 0 0 112 56 56 
                          0 1 0 0-112zm0-160a56 56 0 1 
                          0 0 112 56 56 0 1 0 0-112zM120 96A56 56 
                          0 1 0 8 96a56 56 0 1 0 112 0z" />
                        </svg>
                        <nav className="product-dot-container">
                          <div onClick={() => loadEditProduct(p.id)}>Edit</div>
                          <div onClick={() => handleDeleteClick(p)}>Delete</div>
                        </nav>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center" }}>No Data Found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <nav className="productImport-table-bottem">
            <p className="productImport-num-entries">
              Showing {products.length} of {totalCount} entries
            </p>
            <div className="productImport-manage-control-box">
              <button className="productImport-manage-btn" onClick={handlePrev} disabled={currentPage === 1}>
                Prev
              </button>
              <nav className="productImport-num-page">
                Page {currentPage} of {totalPages}
              </nav>
              <button className="productImport-manage-btn" onClick={handleNext} disabled={currentPage === totalPages}>
                Next
              </button>
            </div>
          </nav>

        </div>
      )}
    </>
  );
}