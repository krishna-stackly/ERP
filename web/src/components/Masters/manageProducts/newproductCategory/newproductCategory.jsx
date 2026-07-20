// // // // // // import React, { useState, useEffect } from "react";
// // // // // // import "./newproductCategory.css";
// // // // // // import axios from "axios";

// // // // // // export default function newproductCategory({
// // // // // //   newproductCategory,
// // // // // //   setnewproductCategory,
// // // // // //   editnewproductCategory,
// // // // // //   setEditnewproductCategory,
// // // // // //   editDropDown,
// // // // // // }) {
// // // // // //   const [CategoryData, setCategoryData] = useState({
// // // // // //     category_name: "",
// // // // // //     update_category_name: "",
// // // // // //   });
// // // // // //   const handleCategoryDataChange = (e) => {
// // // // // //     setCategoryData((prev) => {
// // // // // //       return { ...prev, [e.target.id]: e.target.value };
// // // // // //     });
// // // // // //   };

// // // // // //   function handleCategorydataSubmit(e) {
// // // // // //     e.preventDefault();
// // // // // //     setCategoryData({
// // // // // //       category_name: "",
// // // // // //       update_category_name: "",
// // // // // //     });
// // // // // //     console.log(CategoryData);
// // // // // //     setnewproductCategory(false);
// // // // // //     setEditnewproductCategory(false);
// // // // // //   }

// // // // // //   async function handleCategorydataSubmit(e) {
// // // // // //   e.preventDefault();

// // // // // //   try {
// // // // // //     const token = localStorage.getItem("token"); // Or however you store the token

// // // // // //     if (newproductCategory) {
// // // // // //       // ADD NEW CATEGORY
// // // // // //       const res = await axios.post(
// // // // // //         "http://127.0.0.1:8000/api/categories/",
// // // // // //         { name: CategoryData.category_name },
// // // // // //         {
// // // // // //           headers: {
// // // // // //             Authorization: `Bearer ${token}`,
// // // // // //           },
// // // // // //         }
// // // // // //       );
// // // // // //       console.log("Added:", res.data);
// // // // // //     } else {
// // // // // //       // EDIT EXISTING CATEGORY
// // // // // //       const selectedCategory = editDropDown.find(
// // // // // //         (item) => item === CategoryData.category_name
// // // // // //       );

// // // // // //       if (!selectedCategory) {
// // // // // //         alert("Please select a valid category to update.");
// // // // // //         return;
// // // // // //       }

// // // // // //       // Get the category ID (assume you change dropdown to {id, name})
// // // // // //       const selectedId = editDropDown.find(
// // // // // //         (item) => item.name === CategoryData.category_name
// // // // // //       )?.id;

// // // // // //       if (!selectedId) {
// // // // // //         alert("Invalid category selected.");
// // // // // //         return;
// // // // // //       }

// // // // // //       const res = await axios.put(
// // // // // //         `http://127.0.0.1:8000/api/categories/${selectedId}/`,
// // // // // //         { name: CategoryData.update_category_name },
// // // // // //         {
// // // // // //           headers: {
// // // // // //             Authorization: `Bearer ${token}`,
// // // // // //           },
// // // // // //         }
// // // // // //       );
// // // // // //       console.log("Updated:", res.data);
// // // // // //     }

// // // // // //     // Reset state
// // // // // //     setCategoryData({
// // // // // //       category_name: "",
// // // // // //       update_category_name: "",
// // // // // //     });
// // // // // //     setnewproductCategory(false);
// // // // // //     setEditnewproductCategory(false);
// // // // // //   } catch (error) {
// // // // // //     console.error("Category error:", error.response?.data || error.message);
// // // // // //   }
// // // // // // }
// // // // // //   return (
// // // // // //     <>
// // // // // //       <div className="productCategory-container">
// // // // // //         <div className="category-head">
// // // // // //           <div className="category-headleft">
// // // // // //             <svg
// // // // // //               onClick={() => {
// // // // // //                 setnewproductCategory(false);
// // // // // //                 setEditnewproductCategory(false);
// // // // // //               }}
// // // // // //               className="left-logo-category"
// // // // // //               xmlns="http://www.w3.org/2000/svg"
// // // // // //               viewBox="0 0 320 512"
// // // // // //             >
// // // // // //               <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
// // // // // //             </svg>
// // // // // //             <p>{editnewproductCategory ? "Edit" : "Add New"} Category</p>
// // // // // //           </div>
// // // // // //           <div className="category-headright">
// // // // // //             {editnewproductCategory && (
// // // // // //               <div
// // // // // //                 className="add-category-1"
// // // // // //                 onClick={() => {
// // // // // //                   setnewproductCategory(true);
// // // // // //                   setEditnewproductCategory(false);
// // // // // //                 }}
// // // // // //               >
// // // // // //                 + Add New
// // // // // //               </div>
// // // // // //             )}
// // // // // //             {newproductCategory && (
// // // // // //               <div
// // // // // //                 className="add-category-2"
// // // // // //                 onClick={() => {
// // // // // //                   setEditnewproductCategory(true);
// // // // // //                   setnewproductCategory(false);
// // // // // //                 }}
// // // // // //               >
// // // // // //                 Edit Existing
// // // // // //               </div>
// // // // // //             )}
// // // // // //           </div>
// // // // // //         </div>
// // // // // //         <div className="category-form">
// // // // // //           <form onSubmit={handleCategorydataSubmit}>
// // // // // //             {newproductCategory ? (
// // // // // //               <div className="category-box">
// // // // // //                 <label htmlFor="category_name">Category Name</label>
// // // // // //                 <input
// // // // // //                   type="text"
// // // // // //                   value={CategoryData.category_name}
// // // // // //                   onChange={handleCategoryDataChange}
// // // // // //                   id="category_name"
// // // // // //                   placeholder="Electronics"
// // // // // //                   required
// // // // // //                 />
// // // // // //               </div>
// // // // // //             ) : (
// // // // // //               <>
// // // // // //                 <div className="category-box">
// // // // // //                   <label htmlFor="category_name">Select Category</label>
// // // // // //                   <select
// // // // // //                     id="category_name"
// // // // // //                     value={CategoryData.category_name}
// // // // // //                     onChange={handleCategoryDataChange}
// // // // // //                     required
// // // // // //                   >
// // // // // //                     <option value="">Select Option</option>
// // // // // //                     {editDropDown.map((ele, ind) => (
// // // // // //                       <option key={ind} value={ele}>
// // // // // //                         {ele}
// // // // // //                       </option>
// // // // // //                     ))}
// // // // // //                   </select>
// // // // // //                 </div>
// // // // // //                 <div className="category-box">
// // // // // //                   <label htmlFor="update_category_name">
// // // // // //                     Update Category Name
// // // // // //                   </label>
// // // // // //                   <input
// // // // // //                     type="text"
// // // // // //                     value={CategoryData.update_category_name}
// // // // // //                     onChange={handleCategoryDataChange}
// // // // // //                     id="update_category_name"
// // // // // //                     placeholder="Fashion"
// // // // // //                     required
// // // // // //                   />
// // // // // //                 </div>
// // // // // //               </>
// // // // // //             )}

// // // // // //             <div className="category-submit-container">
// // // // // //               <nav
// // // // // //                 onClick={() => {
// // // // // //                   setnewproductCategory(false);
// // // // // //                   setEditnewproductCategory(false);
// // // // // //                 }}
// // // // // //               >
// // // // // //                 Canael
// // // // // //               </nav>
// // // // // //               <button type="submit">Create</button>
// // // // // //               {editnewproductCategory && <div>Remove</div>}
// // // // // //             </div>
// // // // // //           </form>
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     </>
// // // // // //   );
// // // // // // }

// // // // // import React, { useState, useEffect } from "react";
// // // // // import "./newproductCategory.css";
// // // // // import axios from "axios";
// // // // // import { ToastContainer, toast } from "react-toastify";

// // // // // export default function NewProductCategory({
// // // // //   newproductCategory,
// // // // //   setnewproductCategory,
// // // // //   editnewproductCategory,
// // // // //   setEditnewproductCategory,
// // // // //   editDropDown, // Expected to be passed as [{id, name}, ...] or fetched
// // // // // }) {
// // // // //   const [CategoryData, setCategoryData] = useState({
// // // // //     category_name: "",
// // // // //     update_category_name: "",
// // // // //   });
// // // // //   const [categories, setCategories] = useState([]); // Store fetched categories

// // // // //   // Fetch categories on component mount
// // // // //   useEffect(() => {
// // // // //     const fetchCategories = async () => {
// // // // //       try {
// // // // //         const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
// // // // //         const authState = JSON.parse(persistedAuth.auth || "{}");
// // // // //         const token = authState?.user?.token;
// // // // //         if (!token) {
// // // // //           toast.error("No authentication token found. Please log in.");
// // // // //           return;
// // // // //         }
// // // // //         const res = await axios.get("http://127.0.0.1:8000/api/categories/", {
// // // // //           headers: {
// // // // //             Authorization: `Token ${token}`,
// // // // //           },
// // // // //         });

// // // // //         setCategories(res.data.categories); // Backend returns { categories: [{id, name}, ...], ... }
// // // // //       } catch (error) {
// // // // //         toast.error("Failed to fetch categories: " + (error.response?.data?.error || error.message));
// // // // //       }
// // // // //     };
// // // // //     fetchCategories();
// // // // //   }, []);

// // // // //   const handleCategoryDataChange = (e) => {
// // // // //     setCategoryData((prev) => ({
// // // // //       ...prev,
// // // // //       [e.target.id]: e.target.value,
// // // // //     }));
// // // // //   };

// // // // //   const handleCategorydataSubmit = async (e) => {
// // // // //     e.preventDefault();

// // // // //     try {
// // // // //       const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
// // // // //       const authState = JSON.parse(persistedAuth.auth || "{}");
// // // // //       const token = authState?.user?.token;
// // // // //       if (!token) {
// // // // //         toast.error("No authentication token found. Please log in.");
// // // // //         return;
// // // // //       }

// // // // //       if (newproductCategory) {
// // // // //         // ADD NEW CATEGORY
// // // // //         const res = await axios.post(
// // // // //           "http://127.0.0.1:8000/api/categories/",
// // // // //           { name: CategoryData.category_name },
// // // // //           {
// // // // //             headers: {
// // // // //               Authorization: `Token ${token}`,
// // // // //             },
// // // // //           }
// // // // //         );
// // // // //         toast.success("Category created successfully!");
// // // // //         setCategories([...categories, res.data]); // Update local categories
// // // // //         setTimeout(() => {
// // // // //           setnewproductCategory(false);
// // // // //           setEditnewproductCategory(false);
// // // // //         }, 3000);
// // // // //       } else {
// // // // //         // EDIT EXISTING CATEGORY
// // // // //         const selectedCategory = categories.find(
// // // // //           (item) => item.name === CategoryData.category_name
// // // // //         );

// // // // //         if (!selectedCategory) {
// // // // //           toast.error("Please select a valid category to update.");
// // // // //           return;
// // // // //         }

// // // // //         const res = await axios.put(
// // // // //           `http://127.0.0.1:8000/api/categories/${selectedCategory.id}/`,
// // // // //           { name: CategoryData.update_category_name },
// // // // //           {
// // // // //             headers: {
// // // // //               Authorization: `Token ${token}`,
// // // // //             },
// // // // //           }
// // // // //         );
// // // // //         toast.success("Category updated successfully!");
// // // // //         setCategories(
// // // // //           categories.map((cat) =>
// // // // //             cat.id === selectedCategory.id ? res.data : cat
// // // // //           )
// // // // //         ); // Update local categories
// // // // //         setTimeout(() => {
// // // // //           setnewproductCategory(false);
// // // // //           setEditnewproductCategory(false);
// // // // //         }, 3000);
// // // // //       }

// // // // //       // Reset form
// // // // //       setCategoryData({
// // // // //         category_name: "",
// // // // //         update_category_name: "",
// // // // //       });
// // // // //     } catch (error) {
// // // // //       const errorMsg = error.response?.data?.error || error.message;
// // // // //       toast.error(
// // // // //         newproductCategory
// // // // //           ? "Failed to create category: " + errorMsg
// // // // //           : "Failed to update category: " + errorMsg
// // // // //       );
// // // // //     }
// // // // //   };

// // // // //   const handleDeleteCategory = async () => {
// // // // //     if (!editnewproductCategory) return;

// // // // //     const selectedCategory = categories.find(
// // // // //       (item) => item.name === CategoryData.category_name
// // // // //     );

// // // // //     if (!selectedCategory) {
// // // // //       toast.error("Please select a valid category to delete.");
// // // // //       return;
// // // // //     }

// // // // //     try {
// // // // //       const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
// // // // //       const authState = JSON.parse(persistedAuth.auth || "{}");
// // // // //       const token = authState?.user?.token;
// // // // //       if (!token) {
// // // // //         toast.error("No authentication token found. Please log in.");
// // // // //         return;
// // // // //       }

// // // // //       await axios.delete(`http://127.0.0.1:8000/api/categories/${selectedCategory.id}/`, {
// // // // //         headers: {
// // // // //           Authorization: `Token ${token}`,
// // // // //         },
// // // // //       });
// // // // //       toast.success("Category deleted successfully!");
// // // // //       setCategories(categories.filter((cat) => cat.id !== selectedCategory.id));
// // // // //       setCategoryData({
// // // // //         category_name: "",
// // // // //         update_category_name: "",
// // // // //       });
// // // // //       setTimeout (() => {
// // // // //         setEditnewproductCategory(false);
// // // // //         setnewproductCategory(false);
// // // // //       }, 3000);
// // // // //     } catch (error) {
// // // // //       const errorMsg = error.response?.data?.error || error.message;
// // // // //       toast.error("Failed to delete category: " + errorMsg);
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <div className="productCategory-container">
// // // // //       <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
// // // // //       <div className="category-head">
// // // // //         <div className="category-headleft">
// // // // //           <svg
// // // // //             onClick={() => {
// // // // //               setnewproductCategory(false);
// // // // //               setEditnewproductCategory(false);
// // // // //               toast.dismiss(); // Clear toasts on cancel
// // // // //             }}
// // // // //             className="left-logo-category"
// // // // //             xmlns="http://www.w3.org/2000/svg"
// // // // //             viewBox="0 0 320 512"
// // // // //           >
// // // // //             <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
// // // // //           </svg>
// // // // //           <p>{editnewproductCategory ? "Edit" : "Add New"} Category</p>
// // // // //         </div>
// // // // //         <div className="category-headright">
// // // // //           {editnewproductCategory && (
// // // // //             <div
// // // // //               className="add-category-1"
// // // // //               onClick={() => {
// // // // //                 setnewproductCategory(true);
// // // // //                 setEditnewproductCategory(false);
// // // // //                 toast.dismiss(); // Clear toasts on mode switch
// // // // //               }}
// // // // //             >
// // // // //               + Add New
// // // // //             </div>
// // // // //           )}
// // // // //           {newproductCategory && (
// // // // //             <div
// // // // //               className="add-category-2"
// // // // //               onClick={() => {
// // // // //                 setEditnewproductCategory(true);
// // // // //                 setnewproductCategory(false);
// // // // //                 toast.dismiss(); // Clear toasts on mode switch
// // // // //               }}
// // // // //             >
// // // // //               Edit Existing
// // // // //             </div>
// // // // //           )}
// // // // //         </div>
// // // // //       </div>
// // // // //       <div className="category-form">
// // // // //         <form onSubmit={handleCategorydataSubmit}>
// // // // //           {newproductCategory ? (
// // // // //             <div className="category-box">
// // // // //               <label htmlFor="category_name">Category Name</label>
// // // // //               <input
// // // // //                 type="text"
// // // // //                 value={CategoryData.category_name}
// // // // //                 onChange={handleCategoryDataChange}
// // // // //                 id="category_name"
// // // // //                 placeholder="Electronics"
// // // // //                 required
// // // // //               />
// // // // //             </div>
// // // // //           ) : (
// // // // //             <>
// // // // //               <div className="category-box">
// // // // //                 <label htmlFor="category_name">Select Category</label>
// // // // //                 <select
// // // // //                   id="category_name"
// // // // //                   value={CategoryData.category_name}
// // // // //                   onChange={handleCategoryDataChange}
// // // // //                   required
// // // // //                 >
// // // // //                   <option value="">Select Option</option>
// // // // //                   {categories.map((ele) => (
// // // // //                     <option key={ele.id} value={ele.name}>
// // // // //                       {ele.name}
// // // // //                     </option>
// // // // //                   ))}
// // // // //                 </select>
// // // // //               </div>
// // // // //               <div className="category-box">
// // // // //                 <label htmlFor="update_category_name">Update Category Name</label>
// // // // //                 <input
// // // // //                   type="text"
// // // // //                   value={CategoryData.update_category_name}
// // // // //                   onChange={handleCategoryDataChange}
// // // // //                   id="update_category_name"
// // // // //                   placeholder="Fashion"
// // // // //                   required
// // // // //                 />
// // // // //               </div>
// // // // //             </>
// // // // //           )}
// // // // //           <div className="category-submit-container">
// // // // //             <nav
// // // // //               onClick={() => {
// // // // //                 setnewproductCategory(false);
// // // // //                 setEditnewproductCategory(false);
// // // // //                 toast.dismiss(); // Clear toasts on cancel
// // // // //               }}
// // // // //             >
// // // // //               Cancel
// // // // //             </nav>
// // // // //             <button type="submit">{editnewproductCategory ? "Update" : "Create"}</button>
// // // // //             {editnewproductCategory && (
// // // // //               <div className="remove-category" onClick={handleDeleteCategory}>
// // // // //                 Remove
// // // // //               </div>
// // // // //             )}
// // // // //           </div>
// // // // //         </form>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // }
// // // // // import React, { useState, useEffect } from "react";
// // // // // import "./newproductCategory.css";
// // // // // import { ToastContainer, toast } from "react-toastify";
// // // // // import productApiProvider from "../../../../network/product-api-provider";

// // // // // export default function NewProductCategory({
// // // // //   newproductCategory,
// // // // //   setnewproductCategory,
// // // // //   editnewproductCategory,
// // // // //   setEditnewproductCategory,
// // // // // }) {
// // // // //   const [CategoryData, setCategoryData] = useState({
// // // // //     category_name: "",
// // // // //     update_category_name: "",
// // // // //   });
// // // // //   const [categories, setCategories] = useState([]);

// // // // //   useEffect(() => {
// // // // //     const load = async () => {
// // // // //       const data = await productApiProvider.fetchCategories();
// // // // //       setCategories(Array.isArray(data) ? data : []);
// // // // //     };
// // // // //     load();
// // // // //   }, []);

// // // // //   const handleCategoryDataChange = (e) => {
// // // // //     setCategoryData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
// // // // //   };

// // // // //   const handleCategorydataSubmit = async (e) => {
// // // // //     e.preventDefault();
// // // // //     if (newproductCategory) {
// // // // //       const res = await productApiProvider.createCategory(CategoryData.category_name);
// // // // //       if (res) {
// // // // //         setCategories((prev) => [...prev, res]);
// // // // //         setCategoryData({ category_name: "", update_category_name: "" });
// // // // //         setTimeout(() => { setnewproductCategory(false); setEditnewproductCategory(false); }, 3000);
// // // // //       }
// // // // //     } else {
// // // // //       const selected = categories.find((c) => c.name === CategoryData.category_name);
// // // // //       if (!selected) { toast.error("Please select a valid category"); return; }
// // // // //       const res = await productApiProvider.updateCategory(selected.id, CategoryData.update_category_name);
// // // // //       if (res) {
// // // // //         setCategories((prev) => prev.map((c) => c.id === selected.id ? res : c));
// // // // //         setCategoryData({ category_name: "", update_category_name: "" });
// // // // //         setTimeout(() => { setnewproductCategory(false); setEditnewproductCategory(false); }, 3000);
// // // // //       }
// // // // //     }
// // // // //   };

// // // // //   const handleDeleteCategory = async () => {
// // // // //     const selected = categories.find((c) => c.name === CategoryData.category_name);
// // // // //     if (!selected) { toast.error("Please select a valid category"); return; }
// // // // //     const ok = await productApiProvider.deleteCategory(selected.id);
// // // // //     if (ok) {
// // // // //       setCategories((prev) => prev.filter((c) => c.id !== selected.id));
// // // // //       setCategoryData({ category_name: "", update_category_name: "" });
// // // // //       setTimeout(() => { setEditnewproductCategory(false); setnewproductCategory(false); }, 3000);
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <div className="productCategory-container">
// // // // //       <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
// // // // //       <div className="category-head">
// // // // //         <div className="category-headleft">
// // // // //           <svg onClick={() => { setnewproductCategory(false); setEditnewproductCategory(false); toast.dismiss(); }} className="left-logo-category" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
// // // // //             <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
// // // // //           </svg>
// // // // //           <p>{editnewproductCategory ? "Edit" : "Add New"} Category</p>
// // // // //         </div>
// // // // //         <div className="category-headright">
// // // // //           {editnewproductCategory && (
// // // // //             <div className="add-category-1" onClick={() => { setnewproductCategory(true); setEditnewproductCategory(false); toast.dismiss(); }}>+ Add New</div>
// // // // //           )}
// // // // //           {newproductCategory && (
// // // // //             <div className="add-category-2" onClick={() => { setEditnewproductCategory(true); setnewproductCategory(false); toast.dismiss(); }}>Edit Existing</div>
// // // // //           )}
// // // // //         </div>
// // // // //       </div>
// // // // //       <div className="category-form">
// // // // //         <form onSubmit={handleCategorydataSubmit}>
// // // // //           {newproductCategory ? (
// // // // //             <div className="category-box">
// // // // //               <label htmlFor="category_name">Category Name</label>
// // // // //               <input type="text" value={CategoryData.category_name} onChange={handleCategoryDataChange} id="category_name" placeholder="Electronics" required />
// // // // //             </div>
// // // // //           ) : (
// // // // //             <>
// // // // //               <div className="category-box">
// // // // //                 <label htmlFor="category_name">Select Category</label>
// // // // //                 <select id="category_name" value={CategoryData.category_name} onChange={handleCategoryDataChange} required>
// // // // //                   <option value="">Select Option</option>
// // // // //                   {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
// // // // //                 </select>
// // // // //               </div>
// // // // //               <div className="category-box">
// // // // //                 <label htmlFor="update_category_name">Update Category Name</label>
// // // // //                 <input type="text" value={CategoryData.update_category_name} onChange={handleCategoryDataChange} id="update_category_name" placeholder="Fashion" required />
// // // // //               </div>
// // // // //             </>
// // // // //           )}
// // // // //           <div className="category-submit-container">
// // // // //             <nav onClick={() => { setnewproductCategory(false); setEditnewproductCategory(false); toast.dismiss(); }}>Cancel</nav>
// // // // //             <button type="submit">{editnewproductCategory ? "Update" : "Create"}</button>
// // // // //             {editnewproductCategory && <div className="remove-category" onClick={handleDeleteCategory}>Remove</div>}
// // // // //           </div>
// // // // //         </form>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // }
// // // // import React, { useState, useEffect } from "react";
// // // // import "./newproductCategory.css";
// // // // import { ToastContainer, toast } from "react-toastify";
// // // // import productApiProvider from "../../../../network/product-api-provider";

// // // // // Flatten nested tree into a flat list for dropdowns
// // // // // e.g. [{ id, name, level, indent: "— — Name" }, ...]
// // // // function flattenTree(nodes, result = []) {
// // // //   for (const node of nodes) {
// // // //     result.push({
// // // //       id: node.id,
// // // //       name: node.name,
// // // //       level: node.level ?? 0,
// // // //       indent: "\u00A0\u00A0".repeat(node.level ?? 0) + (node.level > 0 ? "— " : "") + node.name,
// // // //     });
// // // //     if (Array.isArray(node.children) && node.children.length > 0) {
// // // //       flattenTree(node.children, result);
// // // //     }
// // // //   }
// // // //   return result;
// // // // }

// // // // export default function NewProductCategory({
// // // //   newproductCategory,
// // // //   setnewproductCategory,
// // // //   editnewproductCategory,
// // // //   setEditnewproductCategory,
// // // // }) {
// // // //   const [CategoryData, setCategoryData] = useState({
// // // //     category_name: "",       // for create: new name
// // // //     parent_id: "",           // for create: parent ID (null = root)
// // // //     select_category: "",     // for edit/delete: selected category ID
// // // //     update_name: "",         // for edit: new name
// // // //     update_parent_id: "",    // for edit: new parent ID
// // // //   });

// // // //   // flatList is used in <select> dropdowns
// // // //   const [flatList, setFlatList] = useState([]);
// // // //   // rawTree kept for re-flattening after mutations
// // // //   const [rawTree, setRawTree] = useState([]);

// // // //   const loadCategories = async () => {
// // // //     const data = await productApiProvider.fetchCategories();
// // // //     // API returns a tree array directly
// // // //     const tree = Array.isArray(data) ? data : [];
// // // //     setRawTree(tree);
// // // //     setFlatList(flattenTree(tree));
// // // //   };

// // // //   useEffect(() => {
// // // //     loadCategories();
// // // //   }, []);

// // // //   // When edit mode + category selected, prefill update fields
// // // //   useEffect(() => {
// // // //     if (editnewproductCategory && CategoryData.select_category) {
// // // //       const found = flatList.find((c) => String(c.id) === String(CategoryData.select_category));
// // // //       if (found) {
// // // //         setCategoryData((prev) => ({
// // // //           ...prev,
// // // //           update_name: found.name,
// // // //           update_parent_id: "",   // parent change is optional; leave blank unless user changes it
// // // //         }));
// // // //       }
// // // //     }
// // // //   }, [CategoryData.select_category, editnewproductCategory]);

// // // //   const handleChange = (e) =>
// // // //     setCategoryData((prev) => ({ ...prev, [e.target.id]: e.target.value }));

// // // //   // ── CREATE ──────────────────────────────────────────────────────
// // // //   const handleCreate = async (e) => {
// // // //     e.preventDefault();
// // // //     if (!CategoryData.category_name.trim()) {
// // // //       toast.error("Category name is required");
// // // //       return;
// // // //     }
// // // //     const payload = {
// // // //       name: CategoryData.category_name.trim(),
// // // //       parent: CategoryData.parent_id ? Number(CategoryData.parent_id) : null,
// // // //     };
// // // //     const res = await productApiProvider.createCategory(payload.name, payload.parent);
// // // //     if (res) {
// // // //       setCategoryData({ category_name: "", parent_id: "", select_category: "", update_name: "", update_parent_id: "" });
// // // //       await loadCategories();
// // // //       setTimeout(() => { setnewproductCategory(false); setEditnewproductCategory(false); }, 3000);
// // // //     }
// // // //   };

// // // //   // ── UPDATE ──────────────────────────────────────────────────────
// // // //   const handleUpdate = async (e) => {
// // // //     e.preventDefault();
// // // //     if (!CategoryData.select_category) { toast.error("Please select a category to update"); return; }
// // // //     if (!CategoryData.update_name.trim()) { toast.error("Updated name is required"); return; }

// // // //     const payload = {
// // // //       name: CategoryData.update_name.trim(),
// // // //       // Only send parent if user explicitly changed it
// // // //       ...(CategoryData.update_parent_id !== ""
// // // //         ? { parent: CategoryData.update_parent_id === "null" ? null : Number(CategoryData.update_parent_id) }
// // // //         : {}),
// // // //     };

// // // //     const res = await productApiProvider.updateCategory(Number(CategoryData.select_category), payload.name);
// // // //     if (res) {
// // // //       setCategoryData({ category_name: "", parent_id: "", select_category: "", update_name: "", update_parent_id: "" });
// // // //       await loadCategories();
// // // //       setTimeout(() => { setnewproductCategory(false); setEditnewproductCategory(false); }, 3000);
// // // //     }
// // // //   };

// // // //   // ── DELETE ──────────────────────────────────────────────────────
// // // //   const handleDelete = async () => {
// // // //     if (!CategoryData.select_category) { toast.error("Please select a category to remove"); return; }
// // // //     const ok = await productApiProvider.deleteCategory(Number(CategoryData.select_category));
// // // //     if (ok) {
// // // //       setCategoryData({ category_name: "", parent_id: "", select_category: "", update_name: "", update_parent_id: "" });
// // // //       await loadCategories();
// // // //       setTimeout(() => { setEditnewproductCategory(false); setnewproductCategory(false); }, 3000);
// // // //     }
// // // //   };

// // // //   const handleClose = () => {
// // // //     setnewproductCategory(false);
// // // //     setEditnewproductCategory(false);
// // // //     toast.dismiss();
// // // //   };

// // // //   return (
// // // //     <div className="productCategory-container">
// // // //       <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

// // // //       {/* ── HEAD ── */}
// // // //       <div className="category-head">
// // // //         <div className="category-headleft">
// // // //           <svg onClick={handleClose} className="left-logo-category" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
// // // //             <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
// // // //           </svg>
// // // //           <p>{editnewproductCategory ? "Edit" : "Add New"} Category</p>
// // // //         </div>
// // // //         <div className="category-headright">
// // // //           {editnewproductCategory && (
// // // //             <div className="add-category-1" onClick={() => { setnewproductCategory(true); setEditnewproductCategory(false); toast.dismiss(); }}>
// // // //               + Add New
// // // //             </div>
// // // //           )}
// // // //           {newproductCategory && (
// // // //             <div className="add-category-2" onClick={() => { setEditnewproductCategory(true); setnewproductCategory(false); toast.dismiss(); }}>
// // // //               Edit Existing
// // // //             </div>
// // // //           )}
// // // //         </div>
// // // //       </div>

// // // //       {/* ── FORM ── */}
// // // //       <div className="category-form">

// // // //         {/* ── CREATE MODE ── */}
// // // //         {newproductCategory && (
// // // //           <form onSubmit={handleCreate}>
// // // //             <div className="category-box">
// // // //               <label htmlFor="category_name">Category Name<sup>*</sup></label>
// // // //               <input
// // // //                 type="text"
// // // //                 id="category_name"
// // // //                 value={CategoryData.category_name}
// // // //                 onChange={handleChange}
// // // //                 placeholder="e.g., Electronics"
// // // //                 required
// // // //               />
// // // //             </div>

// // // //             <div className="category-box">
// // // //               <label htmlFor="parent_id">Parent Category <span style={{ color: "#888", fontWeight: 400 }}>(optional — leave blank for root)</span></label>
// // // //               <select id="parent_id" value={CategoryData.parent_id} onChange={handleChange}>
// // // //                 <option value="">None (Root Category)</option>
// // // //                 {flatList.map((c) => (
// // // //                   <option key={c.id} value={c.id}>{c.indent}</option>
// // // //                 ))}
// // // //               </select>
// // // //             </div>

// // // //             <div className="category-submit-container">
// // // //               <nav onClick={handleClose}>Cancel</nav>
// // // //               <button type="submit">Create</button>
// // // //             </div>
// // // //           </form>
// // // //         )}

// // // //         {/* ── EDIT / DELETE MODE ── */}
// // // //         {editnewproductCategory && (
// // // //           <form onSubmit={handleUpdate}>
// // // //             <div className="category-box">
// // // //               <label htmlFor="select_category">Select Category<sup>*</sup></label>
// // // //               <select id="select_category" value={CategoryData.select_category} onChange={handleChange} required>
// // // //                 <option value="">Select Option</option>
// // // //                 {flatList.map((c) => (
// // // //                   <option key={c.id} value={c.id}>{c.indent}</option>
// // // //                 ))}
// // // //               </select>
// // // //             </div>

// // // //             <div className="category-box">
// // // //               <label htmlFor="update_name">New Name<sup>*</sup></label>
// // // //               <input
// // // //                 type="text"
// // // //                 id="update_name"
// // // //                 value={CategoryData.update_name}
// // // //                 onChange={handleChange}
// // // //                 placeholder="Updated category name"
// // // //                 required
// // // //               />
// // // //             </div>

// // // //             <div className="category-box">
// // // //               <label htmlFor="update_parent_id">Move Under <span style={{ color: "#888", fontWeight: 400 }}>(optional — leave blank to keep current parent)</span></label>
// // // //               <select id="update_parent_id" value={CategoryData.update_parent_id} onChange={handleChange}>
// // // //                 <option value="">Keep Current Parent</option>
// // // //                 <option value="null">None (Make Root)</option>
// // // //                 {flatList
// // // //                   .filter((c) => String(c.id) !== String(CategoryData.select_category))
// // // //                   .map((c) => (
// // // //                     <option key={c.id} value={c.id}>{c.indent}</option>
// // // //                   ))}
// // // //               </select>
// // // //             </div>

// // // //             <div className="category-submit-container">
// // // //               <nav onClick={handleClose}>Cancel</nav>
// // // //               <button type="submit">Update</button>
// // // //               <div className="remove-category" onClick={handleDelete}>Remove</div>
// // // //             </div>
// // // //           </form>
// // // //         )}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }
// // // import React, { useState, useEffect } from "react";
// // // import "./newproductCategory.css";
// // // import { toast } from "react-toastify";
// // // import productApiProvider from "../../../../network/product-api-provider";

// // // // ─── flatten nested tree for dropdowns ───────────────────────────────────────
// // // function flattenTree(nodes, result = [], depth = 0) {
// // //   for (const node of nodes) {
// // //     result.push({
// // //       id:     node.id,
// // //       name:   node.name,
// // //       indent: "\u00A0\u00A0".repeat(depth) + (depth > 0 ? "— " : "") + node.name,
// // //     });
// // //     if (Array.isArray(node.children) && node.children.length > 0) {
// // //       flattenTree(node.children, result, depth + 1);
// // //     }
// // //   }
// // //   return result;
// // // }

// // // // ─── unique local ID ─────────────────────────────────────────────────────────
// // // let _uid = 0;
// // // function uid() { return ++_uid; }

// // // // ─── make a blank node ───────────────────────────────────────────────────────
// // // function mkNode(name = "") {
// // //   return { _id: uid(), name, children: [] };
// // // }

// // // // ─── recursive helpers (immutable) ───────────────────────────────────────────
// // // function addChild(nodes, parentId) {
// // //   return nodes.map((n) => {
// // //     if (n._id === parentId) return { ...n, children: [...n.children, mkNode()] };
// // //     return { ...n, children: addChild(n.children, parentId) };
// // //   });
// // // }
// // // function setName(nodes, id, val) {
// // //   return nodes.map((n) => {
// // //     if (n._id === id) return { ...n, name: val };
// // //     return { ...n, children: setName(n.children, id, val) };
// // //   });
// // // }
// // // function removeNode(nodes, id) {
// // //   return nodes
// // //     .filter((n) => n._id !== id)
// // //     .map((n) => ({ ...n, children: removeNode(n.children, id) }));
// // // }

// // // // ─── recursive save: returns map of _id→serverId ─────────────────────────────
// // // async function saveNodes(nodes, parentServerId) {
// // //   for (const node of nodes) {
// // //     if (!node.name.trim()) continue;
// // //     const res = await productApiProvider.createCategory(node.name.trim(), parentServerId);
// // //     const newId = res?.id ?? res?.data?.id ?? null;
// // //     if (newId && node.children.length > 0) {
// // //       await saveNodes(node.children, newId);
// // //     }
// // //   }
// // // }

// // // // ─── Sub-item row (recursive) ─────────────────────────────────────────────────
// // // function ItemRow({ node, depth, onNameChange, onRemove, onAddSub, sub1Label }) {
// // //   return (
// // //     <div style={{ marginLeft: depth > 0 ? 16 : 0 }}>
// // //       {/* Section header */}
// // //       {node.children.length > 0 && (
// // //         <div className="category-tree-section-head">
// // //           <span className="category-tree-label">
// // //             Sub {depth + 2} : Subcategory({node.name || "…"})
// // //           </span>
// // //           <button
// // //             type="button"
// // //             className="add-category-1 category-tree-addmore"
// // //             onClick={() => onAddSub(node._id)}
// // //           >
// // //             + Add more
// // //           </button>
// // //         </div>
// // //       )}
// // //       {node.children.map((child, idx) => (
// // //         <div key={child._id} className="category-tree-item-wrapper">
// // //           <div className="category-tree-item-row">
// // //             <span className="category-tree-item-num">{idx + 1}.</span>
// // //             <input
// // //               className="category-tree-item-input"
// // //               placeholder="Enter item name..."
// // //               value={child.name}
// // //               onChange={(e) => onNameChange(child._id, e.target.value)}
// // //             />
// // //             <button
// // //               type="button"
// // //               className="add-category-1 category-tree-addsub"
// // //               onClick={() => onAddSub(child._id)}
// // //             >
// // //               + Add Sub
// // //             </button>
// // //             <button
// // //               type="button"
// // //               className="category-tree-remove"
// // //               onClick={() => onRemove(child._id)}
// // //             >
// // //               Remove
// // //             </button>
// // //           </div>
// // //           {/* Recurse */}
// // //           {child.children.length > 0 && (
// // //             <ItemRow
// // //               node={child}
// // //               depth={depth + 1}
// // //               onNameChange={onNameChange}
// // //               onRemove={onRemove}
// // //               onAddSub={onAddSub}
// // //             />
// // //           )}
// // //         </div>
// // //       ))}
// // //     </div>
// // //   );
// // // }

// // // // ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
// // // export default function NewproductCategory({
// // //   newproductCategory,
// // //   setnewproductCategory,
// // //   editnewproductCategory,
// // //   setEditnewproductCategory,
// // //   onCategoryCreated,
// // // }) {
// // //   // ── server tree (for edit/add-to-existing dropdowns) ──
// // //   const [flatList, setFlatList] = useState([]);

// // //   // ── CREATE mode state ──────────────────────────────────
// // //   // Array of "main blocks": { _id, mainName, sub1Name, children: [...] }
// // //   const [mains, setMains] = useState([
// // //     { _id: uid(), mainName: "", sub1Name: "", children: [] },
// // //   ]);
// // //   const [saving, setSaving] = useState(false);

// // //   // ── EDIT mode state ────────────────────────────────────
// // //   const [editForm, setEditForm] = useState({
// // //     select_category: "",
// // //     update_name:     "",
// // //     update_parent_id: "",
// // //   });

// // //   // ── ADD-TO-EXISTING state ──────────────────────────────
// // //   const [showAddExisting, setShowAddExisting] = useState(false);
// // //   const [addExistingForm, setAddExistingForm] = useState({ parentId: "", name: "" });
// // //   const [addExistingSaving, setAddExistingSaving] = useState(false);

// // //   const loadCategories = async () => {
// // //     const data = await productApiProvider.fetchCategories();
// // //     const tree = Array.isArray(data) ? data : [];
// // //     setFlatList(flattenTree(tree));
// // //   };

// // //   useEffect(() => { loadCategories(); }, []);

// // //   // Prefill edit name when category selected
// // //   useEffect(() => {
// // //     if (editnewproductCategory && editForm.select_category) {
// // //       const found = flatList.find((c) => String(c.id) === String(editForm.select_category));
// // //       if (found) setEditForm((prev) => ({ ...prev, update_name: found.name }));
// // //     }
// // //   }, [editForm.select_category, editnewproductCategory]);

// // //   const handleClose = () => {
// // //     setnewproductCategory(false);
// // //     setEditnewproductCategory(false);
// // //     setShowAddExisting(false);
// // //   };

// // //   // ── CREATE handlers ────────────────────────────────────
// // //   const setMainField = (id, field, val) =>
// // //     setMains((prev) => prev.map((m) => m._id === id ? { ...m, [field]: val } : m));

// // //   const addSub2Item = (mainId) =>
// // //     setMains((prev) =>
// // //       prev.map((m) =>
// // //         m._id === mainId ? { ...m, children: [...m.children, mkNode()] } : m
// // //       )
// // //     );

// // //   const addSubUnder = (mainId, nodeId) =>
// // //     setMains((prev) =>
// // //       prev.map((m) =>
// // //         m._id === mainId ? { ...m, children: addChild(m.children, nodeId) } : m
// // //       )
// // //     );

// // //   const changeNodeName = (mainId, nodeId, val) =>
// // //     setMains((prev) =>
// // //       prev.map((m) =>
// // //         m._id === mainId ? { ...m, children: setName(m.children, nodeId, val) } : m
// // //       )
// // //     );

// // //   const removeFromMain = (mainId, nodeId) =>
// // //     setMains((prev) =>
// // //       prev.map((m) =>
// // //         m._id === mainId ? { ...m, children: removeNode(m.children, nodeId) } : m
// // //       )
// // //     );

// // //   const addAnotherMain = () =>
// // //     setMains((prev) => [...prev, { _id: uid(), mainName: "", sub1Name: "", children: [] }]);

// // //   const removeMain = (id) =>
// // //     setMains((prev) => prev.filter((m) => m._id !== id));

// // //   const handleCreate = async (e) => {
// // //     e.preventDefault();
// // //     for (const m of mains) {
// // //       if (!m.mainName.trim()) { toast.error("Enter main category name"); return; }
// // //     }
// // //     setSaving(true);
// // //     try {
// // //       for (const m of mains) {
// // //         const mainRes = await productApiProvider.createCategory(m.mainName.trim(), null);
// // //         const mainId  = mainRes?.id ?? mainRes?.data?.id;
// // //         if (!mainId) throw new Error("Failed to create main category");

// // //         let parentId = mainId;
// // //         if (m.sub1Name.trim()) {
// // //           const sub1Res = await productApiProvider.createCategory(m.sub1Name.trim(), mainId);
// // //           parentId = sub1Res?.id ?? sub1Res?.data?.id ?? mainId;
// // //         }

// // //         if (m.children.length > 0) await saveNodes(m.children, parentId);
// // //       }
// // //       toast.success("Categories created successfully");
// // //       await loadCategories();
// // //       onCategoryCreated?.();
// // //       handleClose();
// // //     } catch {
// // //       toast.error("Failed to save categories");
// // //     } finally {
// // //       setSaving(false);
// // //     }
// // //   };

// // //   // ── EDIT handlers ──────────────────────────────────────
// // //   const handleUpdate = async (e) => {
// // //     e.preventDefault();
// // //     if (!editForm.select_category) { toast.error("Select a category"); return; }
// // //     if (!editForm.update_name.trim()) { toast.error("Enter new name"); return; }
// // //     const res = await productApiProvider.updateCategory(
// // //       Number(editForm.select_category),
// // //       editForm.update_name.trim()
// // //     );
// // //     if (res) {
// // //       toast.success("Category updated");
// // //       await loadCategories();
// // //       onCategoryCreated?.();
// // //       handleClose();
// // //     }
// // //   };

// // //   const handleDelete = async () => {
// // //     if (!editForm.select_category) { toast.error("Select a category to remove"); return; }
// // //     if (!window.confirm("Delete this category?")) return;
// // //     const ok = await productApiProvider.deleteCategory(Number(editForm.select_category));
// // //     if (ok) {
// // //       toast.success("Category removed");
// // //       await loadCategories();
// // //       onCategoryCreated?.();
// // //       handleClose();
// // //     }
// // //   };

// // //   // ── ADD-TO-EXISTING handler ────────────────────────────
// // //   const handleAddToExisting = async (e) => {
// // //     e.preventDefault();
// // //     if (!addExistingForm.parentId) { toast.error("Select a parent category"); return; }
// // //     if (!addExistingForm.name.trim()) { toast.error("Enter category name"); return; }
// // //     setAddExistingSaving(true);
// // //     const res = await productApiProvider.createCategory(
// // //       addExistingForm.name.trim(),
// // //       Number(addExistingForm.parentId)
// // //     );
// // //     setAddExistingSaving(false);
// // //     if (res) {
// // //       toast.success("Added successfully");
// // //       setAddExistingForm({ parentId: "", name: "" });
// // //       await loadCategories();
// // //       onCategoryCreated?.();
// // //       setShowAddExisting(false);
// // //     }
// // //   };

// // //   // ─────────────────────────────────────────────────────────────────────────
// // //   // RENDER
// // //   // ─────────────────────────────────────────────────────────────────────────
// // //   return (
// // //     <div className="productCategory-container">

// // //       {/* ── HEAD ── */}
// // //       <div className="category-head">
// // //         <div className="category-headleft">
// // //           <svg onClick={handleClose} className="left-logo-category" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
// // //             <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
// // //           </svg>
// // //           <p>
// // //             {showAddExisting ? "Add to Existing Category" :
// // //              editnewproductCategory ? "Edit Category" : "Categorization Setup"}
// // //           </p>
// // //         </div>
// // //         <div className="category-headright">
// // //           {!showAddExisting && newproductCategory && (
// // //             <>
// // //               <div className="add-category-1" onClick={addAnotherMain}>+ Add new</div>
// // //               <div className="add-category-2" onClick={() => setShowAddExisting(true)}>+ Add to Existing</div>
// // //             </>
// // //           )}
// // //           {editnewproductCategory && (
// // //             <div className="add-category-1"
// // //               onClick={() => { setnewproductCategory(true); setEditnewproductCategory(false); }}>
// // //               + Add New
// // //             </div>
// // //           )}
// // //           {newproductCategory && !showAddExisting && (
// // //             <div className="add-category-2"
// // //               onClick={() => { setEditnewproductCategory(true); setnewproductCategory(false); }}>
// // //               Edit Existing
// // //             </div>
// // //           )}
// // //         </div>
// // //       </div>

// // //       {/* ══ ADD-TO-EXISTING FORM ══════════════════════════════════════ */}
// // //       {showAddExisting && (
// // //         <form className="category-form" onSubmit={handleAddToExisting} style={{ marginTop: 20 }}>
// // //           <div className="category-box" style={{ marginBottom: 14 }}>
// // //             <label htmlFor="parentId">Select Parent Category<sup>*</sup></label>
// // //             <select
// // //               id="parentId"
// // //               value={addExistingForm.parentId}
// // //               onChange={(e) => setAddExistingForm((p) => ({ ...p, parentId: e.target.value }))}
// // //               required
// // //             >
// // //               <option value="">— Select —</option>
// // //               {flatList.map((c) => (
// // //                 <option key={c.id} value={c.id}>{c.indent}</option>
// // //               ))}
// // //             </select>
// // //           </div>
// // //           <div className="category-box" style={{ marginBottom: 20 }}>
// // //             <label htmlFor="addExistingName">New Subcategory Name<sup>*</sup></label>
// // //             <input
// // //               id="addExistingName"
// // //               placeholder="e.g., Casual Dress"
// // //               value={addExistingForm.name}
// // //               onChange={(e) => setAddExistingForm((p) => ({ ...p, name: e.target.value }))}
// // //               required
// // //             />
// // //           </div>
// // //           <div className="category-submit-container">
// // //             <nav onClick={() => setShowAddExisting(false)}>Cancel</nav>
// // //             <button type="submit" disabled={addExistingSaving}>
// // //               {addExistingSaving ? "Saving…" : "Add"}
// // //             </button>
// // //           </div>
// // //         </form>
// // //       )}

// // //       {/* ══ CREATE FORM ═══════════════════════════════════════════════ */}
// // //       {newproductCategory && !showAddExisting && (
// // //         <form className="category-form" onSubmit={handleCreate}>
// // //           {mains.map((m, mIdx) => (
// // //             <div key={m._id} className="category-main-block">
// // //               {mains.length > 1 && (
// // //                 <button
// // //                   type="button"
// // //                   className="category-remove-main"
// // //                   onClick={() => removeMain(m._id)}
// // //                 >✕</button>
// // //               )}

// // //               {/* Main name */}
// // //               <div className="category-box">
// // //                 <label>New Main Category</label>
// // //                 <input
// // //                   className="category-box-input"
// // //                   placeholder="e.g., Fashion"
// // //                   value={m.mainName}
// // //                   onChange={(e) => setMainField(m._id, "mainName", e.target.value)}
// // //                 />
// // //               </div>

// // //               {/* Sub 1 */}
// // //               <div className="category-tree-section-head" style={{ marginTop: 14 }}>
// // //                 <span className="category-tree-label">Sub 1 : Add Main Subcategory</span>
// // //                 <button
// // //                   type="button"
// // //                   className={m.sub1Name ? "add-category-2 category-tree-addsub" : "add-category-1 category-tree-addsub"}
// // //                   onClick={() => {}}
// // //                   style={{ cursor: "default" }}
// // //                 >
// // //                   + Add Sub
// // //                 </button>
// // //               </div>
// // //               <input
// // //                 className="category-box-input"
// // //                 placeholder="e.g., Dresses"
// // //                 value={m.sub1Name}
// // //                 onChange={(e) => setMainField(m._id, "sub1Name", e.target.value)}
// // //               />

// // //               {/* Sub 2+ section */}
// // //               {m.sub1Name.trim() && (
// // //                 <div className="category-tree-sub2">
// // //                   <div className="category-tree-section-head">
// // //                     <span className="category-tree-label">
// // //                       Sub 2 : Subcategory({m.sub1Name})
// // //                     </span>
// // //                     <button
// // //                       type="button"
// // //                       className="add-category-1 category-tree-addmore"
// // //                       onClick={() => addSub2Item(m._id)}
// // //                     >
// // //                       + Add more
// // //                     </button>
// // //                   </div>

// // //                   {m.children.length === 0 && (
// // //                     <p className="category-tree-hint">
// // //                       No subcategories yet — click "+ Add more" to get started.
// // //                     </p>
// // //                   )}

// // //                   {m.children.map((child, idx) => (
// // //                     <div key={child._id} className="category-tree-item-wrapper">
// // //                       <div className="category-tree-item-row">
// // //                         <span className="category-tree-item-num">{idx + 1}.</span>
// // //                         <input
// // //                           className="category-tree-item-input"
// // //                           placeholder="Enter item name..."
// // //                           value={child.name}
// // //                           onChange={(e) => changeNodeName(m._id, child._id, e.target.value)}
// // //                         />
// // //                         <button type="button" className="add-category-1 category-tree-addsub"
// // //                           onClick={() => addSubUnder(m._id, child._id)}>
// // //                           + Add Sub
// // //                         </button>
// // //                         <button type="button" className="category-tree-remove"
// // //                           onClick={() => removeFromMain(m._id, child._id)}>
// // //                           Remove
// // //                         </button>
// // //                       </div>
// // //                       {child.children.length > 0 && (
// // //                         <ItemRow
// // //                           node={child}
// // //                           depth={1}
// // //                           onNameChange={(nodeId, val) => changeNodeName(m._id, nodeId, val)}
// // //                           onRemove={(nodeId) => removeFromMain(m._id, nodeId)}
// // //                           onAddSub={(nodeId) => addSubUnder(m._id, nodeId)}
// // //                         />
// // //                       )}
// // //                     </div>
// // //                   ))}
// // //                 </div>
// // //               )}

// // //               {mIdx < mains.length - 1 && <hr className="category-divider" />}
// // //             </div>
// // //           ))}

// // //           <button type="button" className="category-add-another" onClick={addAnotherMain}>
// // //             + Add Another Main Subcategory
// // //           </button>

// // //           <div className="category-submit-container" style={{ marginTop: 20 }}>
// // //             <nav onClick={handleClose}>Cancel</nav>
// // //             <button type="submit" disabled={saving}>
// // //               {saving ? "Saving…" : "Create"}
// // //             </button>
// // //           </div>
// // //         </form>
// // //       )}

// // //       {/* ══ EDIT FORM ═════════════════════════════════════════════════ */}
// // //       {editnewproductCategory && !showAddExisting && (
// // //         <form className="category-form" onSubmit={handleUpdate} style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 15 }}>
// // //           <div className="category-box">
// // //             <label htmlFor="select_category">Select Category<sup>*</sup></label>
// // //             <select
// // //               id="select_category"
// // //               value={editForm.select_category}
// // //               onChange={(e) => setEditForm((p) => ({ ...p, select_category: e.target.value }))}
// // //               required
// // //             >
// // //               <option value="">Select Option</option>
// // //               {flatList.map((c) => (
// // //                 <option key={c.id} value={c.id}>{c.indent}</option>
// // //               ))}
// // //             </select>
// // //           </div>
// // //           <div className="category-box">
// // //             <label htmlFor="update_name">New Name<sup>*</sup></label>
// // //             <input
// // //               id="update_name"
// // //               placeholder="Updated category name"
// // //               value={editForm.update_name}
// // //               onChange={(e) => setEditForm((p) => ({ ...p, update_name: e.target.value }))}
// // //               required
// // //             />
// // //           </div>
// // //           <div className="category-submit-container">
// // //             <nav onClick={handleClose}>Cancel</nav>
// // //             <button type="submit">Update</button>
// // //             <div className="remove-category" onClick={handleDelete}>Remove</div>
// // //           </div>
// // //         </form>
// // //       )}

// // //     </div>
// // //   );
// // // }

// // // // ─── recursive row component (defined outside to avoid re-creation) ───────────
// // // function ItemRow({ node, depth, onNameChange, onRemove, onAddSub }) {
// // //   return (
// // //     <div style={{ marginLeft: 16, borderLeft: "2px solid rgba(35,78,112,0.1)", paddingLeft: 10, marginTop: 6 }}>
// // //       <div className="category-tree-section-head">
// // //         <span className="category-tree-label">
// // //           Sub {depth + 2} : Subcategory({node.name || "…"})
// // //         </span>
// // //         <button type="button" className="add-category-1 category-tree-addmore"
// // //           onClick={() => onAddSub(node._id)}>
// // //           + Add more
// // //         </button>
// // //       </div>
// // //       {node.children.map((child, idx) => (
// // //         <div key={child._id} className="category-tree-item-wrapper">
// // //           <div className="category-tree-item-row">
// // //             <span className="category-tree-item-num">{idx + 1}.</span>
// // //             <input
// // //               className="category-tree-item-input"
// // //               placeholder="Enter item name..."
// // //               value={child.name}
// // //               onChange={(e) => onNameChange(child._id, e.target.value)}
// // //             />
// // //             <button type="button" className="add-category-1 category-tree-addsub"
// // //               onClick={() => onAddSub(child._id)}>+ Add Sub</button>
// // //             <button type="button" className="category-tree-remove"
// // //               onClick={() => onRemove(child._id)}>Remove</button>
// // //           </div>
// // //           {child.children.length > 0 && (
// // //             <ItemRow node={child} depth={depth + 1}
// // //               onNameChange={onNameChange} onRemove={onRemove} onAddSub={onAddSub} />
// // //           )}
// // //         </div>
// // //       ))}
// // //     </div>
// // //   );
// // // }
// // import React, { useState, useEffect } from "react";
// // import "./newproductCategory.css";
// // import { toast } from "react-toastify";
// // import productApiProvider from "../../../../network/product-api-provider";

// // // ─── flatten nested tree for dropdowns ───────────────────────────────────────
// // function flattenTree(nodes, result = [], depth = 0) {
// //   for (const node of nodes) {
// //     result.push({
// //       id:     node.id,
// //       name:   node.name,
// //       indent: "\u00A0\u00A0".repeat(depth) + (depth > 0 ? "— " : "") + node.name,
// //     });
// //     if (Array.isArray(node.children) && node.children.length > 0) {
// //       flattenTree(node.children, result, depth + 1);
// //     }
// //   }
// //   return result;
// // }

// // // ─── unique local ID ─────────────────────────────────────────────────────────
// // let _uid = 0;
// // function uid() { return ++_uid; }

// // // ─── make a blank node ───────────────────────────────────────────────────────
// // function mkNode(name = "") {
// //   return { _id: uid(), name, children: [] };
// // }

// // // ─── recursive helpers (immutable) ───────────────────────────────────────────
// // function addChild(nodes, parentId) {
// //   return nodes.map((n) => {
// //     if (n._id === parentId) return { ...n, children: [...n.children, mkNode()] };
// //     return { ...n, children: addChild(n.children, parentId) };
// //   });
// // }
// // function setName(nodes, id, val) {
// //   return nodes.map((n) => {
// //     if (n._id === id) return { ...n, name: val };
// //     return { ...n, children: setName(n.children, id, val) };
// //   });
// // }
// // function removeNode(nodes, id) {
// //   return nodes
// //     .filter((n) => n._id !== id)
// //     .map((n) => ({ ...n, children: removeNode(n.children, id) }));
// // }

// // // ─── recursive save: returns map of _id→serverId ─────────────────────────────
// // async function saveNodes(nodes, parentServerId) {
// //   for (const node of nodes) {
// //     if (!node.name.trim()) continue;
// //     const res = await productApiProvider.createCategory(node.name.trim(), parentServerId);
// //     const newId = res?.id ?? res?.data?.id ?? null;
// //     if (newId && node.children.length > 0) {
// //       await saveNodes(node.children, newId);
// //     }
// //   }
// // }

// // // ─── Sub-item row (recursive) ─────────────────────────────────────────────────
// // function ItemRow({ node, depth, onNameChange, onRemove, onAddSub, sub1Label }) {
// //   return (
// //     <div style={{ marginLeft: depth > 0 ? 16 : 0 }}>
// //       {/* Section header */}
// //       {node.children.length > 0 && (
// //         <div className="category-tree-section-head">
// //           <span className="category-tree-label">
// //             Sub {depth + 2} : Subcategory({node.name || "…"})
// //           </span>
// //           <button
// //             type="button"
// //             className="add-category-1 category-tree-addmore"
// //             onClick={() => onAddSub(node._id)}
// //           >
// //             + Add more
// //           </button>
// //         </div>
// //       )}
// //       {node.children.map((child, idx) => (
// //         <div key={child._id} className="category-tree-item-wrapper">
// //           <div className="category-tree-item-row">
// //             <span className="category-tree-item-num">{idx + 1}.</span>
// //             <input
// //               className="category-tree-item-input"
// //               placeholder="Enter item name..."
// //               value={child.name}
// //               onChange={(e) => onNameChange(child._id, e.target.value)}
// //             />
// //             <button
// //               type="button"
// //               className="add-category-1 category-tree-addsub"
// //               onClick={() => onAddSub(child._id)}
// //             >
// //               + Add Sub
// //             </button>
// //             <button
// //               type="button"
// //               className="category-tree-remove"
// //               onClick={() => onRemove(child._id)}
// //             >
// //               Remove
// //             </button>
// //           </div>
// //           {/* Recurse */}
// //           {child.children.length > 0 && (
// //             <ItemRow
// //               node={child}
// //               depth={depth + 1}
// //               onNameChange={onNameChange}
// //               onRemove={onRemove}
// //               onAddSub={onAddSub}
// //             />
// //           )}
// //         </div>
// //       ))}
// //     </div>
// //   );
// // }

// // // ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
// // export default function NewproductCategory({
// //   newproductCategory,
// //   setnewproductCategory,
// //   editnewproductCategory,
// //   setEditnewproductCategory,
// //   onCategoryCreated,
// // }) {
// //   // ── server tree (for edit/add-to-existing dropdowns) ──
// //   const [flatList, setFlatList] = useState([]);

// //   // ── CREATE mode state ──────────────────────────────────
// //   // Array of "main blocks": { _id, mainName, sub1Name, children: [...] }
// //   const [mains, setMains] = useState([
// //     { _id: uid(), mainName: "", sub1Name: "", children: [] },
// //   ]);
// //   const [saving, setSaving] = useState(false);

// //   // ── EDIT mode state ────────────────────────────────────
// //   const [editForm, setEditForm] = useState({
// //     select_category: "",
// //     update_name:     "",
// //     update_parent_id: "",
// //   });

// //   // ── ADD-TO-EXISTING state ──────────────────────────────
// //   const [showAddExisting, setShowAddExisting] = useState(false);
// //   const [addExistingForm, setAddExistingForm] = useState({ parentId: "", name: "" });
// //   const [addExistingSaving, setAddExistingSaving] = useState(false);

// //   const loadCategories = async () => {
// //     const data = await productApiProvider.fetchCategories();
// //     const tree = Array.isArray(data) ? data : [];
// //     setFlatList(flattenTree(tree));
// //   };

// //   useEffect(() => { loadCategories(); }, []);

// //   // Prefill edit name when category selected
// //   useEffect(() => {
// //     if (editnewproductCategory && editForm.select_category) {
// //       const found = flatList.find((c) => String(c.id) === String(editForm.select_category));
// //       if (found) setEditForm((prev) => ({ ...prev, update_name: found.name }));
// //     }
// //   }, [editForm.select_category, editnewproductCategory]);

// //   const handleClose = () => {
// //     setnewproductCategory(false);
// //     setEditnewproductCategory(false);
// //     setShowAddExisting(false);
// //   };

// //   // ── CREATE handlers ────────────────────────────────────
// //   const setMainField = (id, field, val) =>
// //     setMains((prev) => prev.map((m) => m._id === id ? { ...m, [field]: val } : m));

// //   const addSub2Item = (mainId) =>
// //     setMains((prev) =>
// //       prev.map((m) =>
// //         m._id === mainId ? { ...m, children: [...m.children, mkNode()] } : m
// //       )
// //     );

// //   const addSubUnder = (mainId, nodeId) =>
// //     setMains((prev) =>
// //       prev.map((m) =>
// //         m._id === mainId ? { ...m, children: addChild(m.children, nodeId) } : m
// //       )
// //     );

// //   const changeNodeName = (mainId, nodeId, val) =>
// //     setMains((prev) =>
// //       prev.map((m) =>
// //         m._id === mainId ? { ...m, children: setName(m.children, nodeId, val) } : m
// //       )
// //     );

// //   const removeFromMain = (mainId, nodeId) =>
// //     setMains((prev) =>
// //       prev.map((m) =>
// //         m._id === mainId ? { ...m, children: removeNode(m.children, nodeId) } : m
// //       )
// //     );

// //   const addAnotherMain = () =>
// //     setMains((prev) => [...prev, { _id: uid(), mainName: "", sub1Name: "", children: [] }]);

// //   const removeMain = (id) =>
// //     setMains((prev) => prev.filter((m) => m._id !== id));

// //   const handleCreate = async (e) => {
// //     e.preventDefault();
// //     for (const m of mains) {
// //       if (!m.mainName.trim()) { toast.error("Enter main category name"); return; }
// //     }
// //     setSaving(true);
// //     try {
// //       for (const m of mains) {
// //         const mainRes = await productApiProvider.createCategory(m.mainName.trim(), null);
// //         const mainId  = mainRes?.id ?? mainRes?.data?.id;
// //         if (!mainId) throw new Error("Failed to create main category");

// //         let parentId = mainId;
// //         if (m.sub1Name.trim()) {
// //           const sub1Res = await productApiProvider.createCategory(m.sub1Name.trim(), mainId);
// //           parentId = sub1Res?.id ?? sub1Res?.data?.id ?? mainId;
// //         }

// //         if (m.children.length > 0) await saveNodes(m.children, parentId);
// //       }
// //       toast.success("Categories created successfully");
// //       await loadCategories();
// //       onCategoryCreated?.();
// //       handleClose();
// //     } catch {
// //       toast.error("Failed to save categories");
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   // ── EDIT handlers ──────────────────────────────────────
// //   const handleUpdate = async (e) => {
// //     e.preventDefault();
// //     if (!editForm.select_category) { toast.error("Select a category"); return; }
// //     if (!editForm.update_name.trim()) { toast.error("Enter new name"); return; }
// //     const res = await productApiProvider.updateCategory(
// //       Number(editForm.select_category),
// //       editForm.update_name.trim()
// //     );
// //     if (res) {
// //       toast.success("Category updated");
// //       await loadCategories();
// //       onCategoryCreated?.();
// //       handleClose();
// //     }
// //   };

// //   const handleDelete = async () => {
// //     if (!editForm.select_category) { toast.error("Select a category to remove"); return; }
// //     if (!window.confirm("Delete this category?")) return;
// //     const ok = await productApiProvider.deleteCategory(Number(editForm.select_category));
// //     if (ok) {
// //       toast.success("Category removed");
// //       await loadCategories();
// //       onCategoryCreated?.();
// //       handleClose();
// //     }
// //   };

// //   // ── ADD-TO-EXISTING handler ────────────────────────────
// //   const handleAddToExisting = async (e) => {
// //     e.preventDefault();
// //     if (!addExistingForm.parentId) { toast.error("Select a parent category"); return; }
// //     if (!addExistingForm.name.trim()) { toast.error("Enter category name"); return; }
// //     setAddExistingSaving(true);
// //     const res = await productApiProvider.createCategory(
// //       addExistingForm.name.trim(),
// //       Number(addExistingForm.parentId)
// //     );
// //     setAddExistingSaving(false);
// //     if (res) {
// //       toast.success("Added successfully");
// //       setAddExistingForm({ parentId: "", name: "" });
// //       await loadCategories();
// //       onCategoryCreated?.();
// //       setShowAddExisting(false);
// //     }
// //   };

// //   // ─────────────────────────────────────────────────────────────────────────
// //   // RENDER
// //   // ─────────────────────────────────────────────────────────────────────────
// //   return (
// //     <div className="productCategory-container">

// //       {/* ── HEAD ── */}
// //       <div className="category-head">
// //         <div className="category-headleft">
// //           <svg onClick={handleClose} className="left-logo-category" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="20" height="20">
// //             <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
// //           </svg>
// //           <p>
// //             {showAddExisting ? "Add to Existing Category" :
// //              editnewproductCategory ? "Edit Category" : "Categorization Setup"}
// //           </p>
// //         </div>
// //         <div className="category-headright">
// //           {!showAddExisting && newproductCategory && (
// //             <>
// //               <div className="add-category-1" onClick={addAnotherMain}>+ Add new</div>
// //               <div className="add-category-2" onClick={() => setShowAddExisting(true)}>+ Add to Existing</div>
// //             </>
// //           )}
// //           {editnewproductCategory && (
// //             <div className="add-category-1"
// //               onClick={() => { setnewproductCategory(true); setEditnewproductCategory(false); }}>
// //               + Add New
// //             </div>
// //           )}
// //           {newproductCategory && !showAddExisting && (
// //             <div className="add-category-2"
// //               onClick={() => { setEditnewproductCategory(true); setnewproductCategory(false); }}>
// //               Edit Existing
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* ══ ADD-TO-EXISTING FORM ══════════════════════════════════════ */}
// //       {showAddExisting && (
// //         <form className="category-form" onSubmit={handleAddToExisting} style={{ marginTop: 20 }}>
// //           <div className="category-box" style={{ marginBottom: 14 }}>
// //             <label htmlFor="parentId">Select Parent Category<sup>*</sup></label>
// //             <select
// //               id="parentId"
// //               value={addExistingForm.parentId}
// //               onChange={(e) => setAddExistingForm((p) => ({ ...p, parentId: e.target.value }))}
// //               required
// //             >
// //               <option value="">— Select —</option>
// //               {flatList.map((c) => (
// //                 <option key={c.id} value={c.id}>{c.indent}</option>
// //               ))}
// //             </select>
// //           </div>
// //           <div className="category-box" style={{ marginBottom: 20 }}>
// //             <label htmlFor="addExistingName">New Subcategory Name<sup>*</sup></label>
// //             <input
// //               id="addExistingName"
// //               placeholder="e.g., Casual Dress"
// //               value={addExistingForm.name}
// //               onChange={(e) => setAddExistingForm((p) => ({ ...p, name: e.target.value }))}
// //               required
// //             />
// //           </div>
// //           <div className="category-submit-container">
// //             <nav onClick={() => setShowAddExisting(false)}>Cancel</nav>
// //             <button type="submit" disabled={addExistingSaving}>
// //               {addExistingSaving ? "Saving…" : "Add"}
// //             </button>
// //           </div>
// //         </form>
// //       )}

// //       {/* ══ CREATE FORM ═══════════════════════════════════════════════ */}
// //       {newproductCategory && !showAddExisting && (
// //         <form className="category-form" onSubmit={handleCreate}>
// //           {mains.map((m, mIdx) => (
// //             <div key={m._id} className="category-main-block">
// //               {mains.length > 1 && (
// //                 <button
// //                   type="button"
// //                   className="category-remove-main"
// //                   onClick={() => removeMain(m._id)}
// //                 >✕</button>
// //               )}

// //               {/* Main name */}
// //               <div className="category-box">
// //                 <label>New Main Category</label>
// //                 <input
// //                   className="category-box-input"
// //                   placeholder="e.g., Fashion"
// //                   value={m.mainName}
// //                   onChange={(e) => setMainField(m._id, "mainName", e.target.value)}
// //                 />
// //               </div>

// //               {/* Sub 1 */}
// //               <div className="category-tree-section-head" style={{ marginTop: 14 }}>
// //                 <span className="category-tree-label">Sub 1 : Add Main Subcategory</span>
// //                 <button
// //                   type="button"
// //                   className={m.sub1Name ? "add-category-2 category-tree-addsub" : "add-category-1 category-tree-addsub"}
// //                   onClick={() => {}}
// //                   style={{ cursor: "default" }}
// //                 >
// //                   + Add Sub
// //                 </button>
// //               </div>
// //               <input
// //                 className="category-box-input"
// //                 placeholder="e.g., Dresses"
// //                 value={m.sub1Name}
// //                 onChange={(e) => setMainField(m._id, "sub1Name", e.target.value)}
// //               />

// //               {/* Sub 2+ section */}
// //               {m.sub1Name.trim() && (
// //                 <div className="category-tree-sub2">
// //                   <div className="category-tree-section-head">
// //                     <span className="category-tree-label">
// //                       Sub 2 : Subcategory({m.sub1Name})
// //                     </span>
// //                     <button
// //                       type="button"
// //                       className="add-category-1 category-tree-addmore"
// //                       onClick={() => addSub2Item(m._id)}
// //                     >
// //                       + Add more
// //                     </button>
// //                   </div>

// //                   {m.children.length === 0 && (
// //                     <p className="category-tree-hint">
// //                       No subcategories yet — click "+ Add more" to get started.
// //                     </p>
// //                   )}

// //                   {m.children.map((child, idx) => (
// //                     <div key={child._id} className="category-tree-item-wrapper">
// //                       <div className="category-tree-item-row">
// //                         <span className="category-tree-item-num">{idx + 1}.</span>
// //                         <input
// //                           className="category-tree-item-input"
// //                           placeholder="Enter item name..."
// //                           value={child.name}
// //                           onChange={(e) => changeNodeName(m._id, child._id, e.target.value)}
// //                         />
// //                         <button type="button" className="add-category-1 category-tree-addsub"
// //                           onClick={() => addSubUnder(m._id, child._id)}>
// //                           + Add Sub
// //                         </button>
// //                         <button type="button" className="category-tree-remove"
// //                           onClick={() => removeFromMain(m._id, child._id)}>
// //                           Remove
// //                         </button>
// //                       </div>
// //                       {child.children.length > 0 && (
// //                         <ItemRow
// //                           node={child}
// //                           depth={1}
// //                           onNameChange={(nodeId, val) => changeNodeName(m._id, nodeId, val)}
// //                           onRemove={(nodeId) => removeFromMain(m._id, nodeId)}
// //                           onAddSub={(nodeId) => addSubUnder(m._id, nodeId)}
// //                         />
// //                       )}
// //                     </div>
// //                   ))}
// //                 </div>
// //               )}

// //               {mIdx < mains.length - 1 && <hr className="category-divider" />}
// //             </div>
// //           ))}

// //           <button type="button" className="category-add-another" onClick={addAnotherMain}>
// //             + Add Another Main Subcategory
// //           </button>

// //           <div className="category-submit-container" style={{ marginTop: 20 }}>
// //             <nav onClick={handleClose}>Cancel</nav>
// //             <button type="submit" disabled={saving}>
// //               {saving ? "Saving…" : "Create"}
// //             </button>
// //           </div>
// //         </form>
// //       )}

// //       {/* ══ EDIT FORM ═════════════════════════════════════════════════ */}
// //       {editnewproductCategory && !showAddExisting && (
// //         <form className="category-form" onSubmit={handleUpdate} style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 15 }}>
// //           <div className="category-box">
// //             <label htmlFor="select_category">Select Category<sup>*</sup></label>
// //             <select
// //               id="select_category"
// //               value={editForm.select_category}
// //               onChange={(e) => setEditForm((p) => ({ ...p, select_category: e.target.value }))}
// //               required
// //             >
// //               <option value="">Select Option</option>
// //               {flatList.map((c) => (
// //                 <option key={c.id} value={c.id}>{c.indent}</option>
// //               ))}
// //             </select>
// //           </div>
// //           <div className="category-box">
// //             <label htmlFor="update_name">New Name<sup>*</sup></label>
// //             <input
// //               id="update_name"
// //               placeholder="Updated category name"
// //               value={editForm.update_name}
// //               onChange={(e) => setEditForm((p) => ({ ...p, update_name: e.target.value }))}
// //               required
// //             />
// //           </div>
// //           <div className="category-submit-container">
// //             <nav onClick={handleClose}>Cancel</nav>
// //             <button type="submit">Update</button>
// //             <div className="remove-category" onClick={handleDelete}>Remove</div>
// //           </div>
// //         </form>
// //       )}

// //     </div>
// //   );
// // }

// // // ─── recursive row component (defined outside to avoid re-creation) ───────────
// // function ItemRow({ node, depth, onNameChange, onRemove, onAddSub }) {
// //   return (
// //     <div style={{ marginLeft: 16, borderLeft: "2px solid rgba(35,78,112,0.1)", paddingLeft: 10, marginTop: 6 }}>
// //       <div className="category-tree-section-head">
// //         <span className="category-tree-label">
// //           Sub {depth + 2} : Subcategory({node.name || "…"})
// //         </span>
// //         <button type="button" className="add-category-1 category-tree-addmore"
// //           onClick={() => onAddSub(node._id)}>
// //           + Add more
// //         </button>
// //       </div>
// //       {node.children.map((child, idx) => (
// //         <div key={child._id} className="category-tree-item-wrapper">
// //           <div className="category-tree-item-row">
// //             <span className="category-tree-item-num">{idx + 1}.</span>
// //             <input
// //               className="category-tree-item-input"
// //               placeholder="Enter item name..."
// //               value={child.name}
// //               onChange={(e) => onNameChange(child._id, e.target.value)}
// //             />
// //             <button type="button" className="add-category-1 category-tree-addsub"
// //               onClick={() => onAddSub(child._id)}>+ Add Sub</button>
// //             <button type="button" className="category-tree-remove"
// //               onClick={() => onRemove(child._id)}>Remove</button>
// //           </div>
// //           {child.children.length > 0 && (
// //             <ItemRow node={child} depth={depth + 1}
// //               onNameChange={onNameChange} onRemove={onRemove} onAddSub={onAddSub} />
// //           )}
// //         </div>
// //       ))}
// //     </div>
// //   );
// // }
// import React, { useState, useEffect } from "react";
// import "./newproductCategory.css";
// import { toast } from "react-toastify";
// import productApiProvider from "../../../../network/product-api-provider";

// // ─── flatten nested tree for dropdowns ───────────────────────────────────────
// function flattenTree(nodes, result = [], depth = 0) {
//   for (const node of nodes) {
//     result.push({
//       id:     node.id,
//       name:   node.name,
//       indent: "\u00A0\u00A0".repeat(depth) + (depth > 0 ? "— " : "") + node.name,
//     });
//     if (Array.isArray(node.children) && node.children.length > 0) {
//       flattenTree(node.children, result, depth + 1);
//     }
//   }
//   return result;
// }

// // ─── unique local ID ─────────────────────────────────────────────────────────
// let _uid = 0;
// function uid() { return ++_uid; }

// // ─── make a blank node ───────────────────────────────────────────────────────
// function mkNode(name = "") {
//   return { _id: uid(), name, children: [] };
// }

// // ─── recursive helpers (immutable) ───────────────────────────────────────────
// function addChild(nodes, parentId) {
//   return nodes.map((n) => {
//     if (n._id === parentId) return { ...n, children: [...n.children, mkNode()] };
//     return { ...n, children: addChild(n.children, parentId) };
//   });
// }
// function setName(nodes, id, val) {
//   return nodes.map((n) => {
//     if (n._id === id) return { ...n, name: val };
//     return { ...n, children: setName(n.children, id, val) };
//   });
// }
// function removeNode(nodes, id) {
//   return nodes
//     .filter((n) => n._id !== id)
//     .map((n) => ({ ...n, children: removeNode(n.children, id) }));
// }

// // ─── recursive save: returns map of _id→serverId ─────────────────────────────
// async function saveNodes(nodes, parentServerId) {
//   for (const node of nodes) {
//     if (!node.name.trim()) continue;
//     const res = await productApiProvider.createCategory(node.name.trim(), parentServerId);
//     const newId = res?.id ?? res?.data?.id ?? null;
//     if (newId && node.children.length > 0) {
//       await saveNodes(node.children, newId);
//     }
//   }
// }

// // ─── Sub-item row (recursive) ─────────────────────────────────────────────────
// function ItemRow({ node, depth, onNameChange, onRemove, onAddSub, sub1Label }) {
//   return (
//     <div style={{ marginLeft: depth > 0 ? 16 : 0 }}>
//       {/* Section header */}
//       {node.children.length > 0 && (
//         <div className="category-tree-section-head">
//           <span className="category-tree-label">
//             Sub {depth + 2} : Subcategory({node.name || "…"})
//           </span>
//           <button
//             type="button"
//             className="add-category-1 category-tree-addmore"
//             onClick={() => onAddSub(node._id)}
//           >
//             + Add more
//           </button>
//         </div>
//       )}
//       {node.children.map((child, idx) => (
//         <div key={child._id} className="category-tree-item-wrapper">
//           <div className="category-tree-item-row">
//             <span className="category-tree-item-num">{idx + 1}.</span>
//             <input
//               className="category-tree-item-input"
//               placeholder="Enter item name..."
//               value={child.name}
//               onChange={(e) => onNameChange(child._id, e.target.value)}
//             />
//             <button
//               type="button"
//               className="add-category-1 category-tree-addsub"
//               onClick={() => onAddSub(child._id)}
//             >
//               + Add Sub
//             </button>
//             <button
//               type="button"
//               className="category-tree-remove"
//               onClick={() => onRemove(child._id)}
//             >
//               Remove
//             </button>
//           </div>
//           {/* Recurse */}
//           {child.children.length > 0 && (
//             <ItemRow
//               node={child}
//               depth={depth + 1}
//               onNameChange={onNameChange}
//               onRemove={onRemove}
//               onAddSub={onAddSub}
//             />
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }

// // ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
// export default function NewproductCategory({
//   newproductCategory,
//   setnewproductCategory,
//   editnewproductCategory,
//   setEditnewproductCategory,
//   onCategoryCreated,
// }) {
//   // ── server tree (for edit/add-to-existing dropdowns) ──
//   const [flatList, setFlatList] = useState([]);

//   // ── CREATE mode state ──────────────────────────────────
//   // Array of "main blocks": { _id, mainName, sub1Name, children: [...] }
//   const [mains, setMains] = useState([
//     { _id: uid(), mainName: "", sub1Name: "", children: [] },
//   ]);
//   const [saving, setSaving] = useState(false);

//   // ── EDIT mode state ────────────────────────────────────
//   const [editForm, setEditForm] = useState({
//     select_category: "",
//     update_name:     "",
//     update_parent_id: "",
//   });

//   // ── ADD-TO-EXISTING state ──────────────────────────────
//   const [showAddExisting, setShowAddExisting] = useState(false);
//   const [addExistingForm, setAddExistingForm] = useState({ parentId: "", name: "" });
//   const [addExistingSaving, setAddExistingSaving] = useState(false);

//   const loadCategories = async () => {
//     const data = await productApiProvider.fetchCategories();
//     const tree = Array.isArray(data) ? data : [];
//     setFlatList(flattenTree(tree));
//   };

//   useEffect(() => { loadCategories(); }, []);

//   // Prefill edit name when category selected
//   useEffect(() => {
//     if (editnewproductCategory && editForm.select_category) {
//       const found = flatList.find((c) => String(c.id) === String(editForm.select_category));
//       if (found) setEditForm((prev) => ({ ...prev, update_name: found.name }));
//     }
//   }, [editForm.select_category, editnewproductCategory]);

//   const handleClose = () => {
//     setnewproductCategory(false);
//     setEditnewproductCategory(false);
//     setShowAddExisting(false);
//   };

//   // ── CREATE handlers ────────────────────────────────────
//   const setMainField = (id, field, val) =>
//     setMains((prev) => prev.map((m) => m._id === id ? { ...m, [field]: val } : m));

//   const addSub2Item = (mainId) =>
//     setMains((prev) =>
//       prev.map((m) =>
//         m._id === mainId ? { ...m, children: [...m.children, mkNode()] } : m
//       )
//     );

//   const addSubUnder = (mainId, nodeId) =>
//     setMains((prev) =>
//       prev.map((m) =>
//         m._id === mainId ? { ...m, children: addChild(m.children, nodeId) } : m
//       )
//     );

//   const changeNodeName = (mainId, nodeId, val) =>
//     setMains((prev) =>
//       prev.map((m) =>
//         m._id === mainId ? { ...m, children: setName(m.children, nodeId, val) } : m
//       )
//     );

//   const removeFromMain = (mainId, nodeId) =>
//     setMains((prev) =>
//       prev.map((m) =>
//         m._id === mainId ? { ...m, children: removeNode(m.children, nodeId) } : m
//       )
//     );

//   const addAnotherMain = () =>
//     setMains((prev) => [...prev, { _id: uid(), mainName: "", sub1Name: "", children: [] }]);

//   const removeMain = (id) =>
//     setMains((prev) => prev.filter((m) => m._id !== id));

//   const handleCreate = async (e) => {
//     e.preventDefault();
//     for (const m of mains) {
//       if (!m.mainName.trim()) { toast.error("Enter main category name"); return; }
//     }
//     setSaving(true);
//     try {
//       for (const m of mains) {
//         const mainRes = await productApiProvider.createCategory(m.mainName.trim(), null);
//         const mainId  = mainRes?.id ?? mainRes?.data?.id;
//         if (!mainId) throw new Error("Failed to create main category");

//         let parentId = mainId;
//         if (m.sub1Name.trim()) {
//           const sub1Res = await productApiProvider.createCategory(m.sub1Name.trim(), mainId);
//           parentId = sub1Res?.id ?? sub1Res?.data?.id ?? mainId;
//         }

//         if (m.children.length > 0) await saveNodes(m.children, parentId);
//       }
//       toast.success("Categories created successfully");
//       await loadCategories();
//       onCategoryCreated?.();
//       handleClose();
//     } catch {
//       toast.error("Failed to save categories");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ── EDIT handlers ──────────────────────────────────────
//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     if (!editForm.select_category) { toast.error("Select a category"); return; }
//     if (!editForm.update_name.trim()) { toast.error("Enter new name"); return; }
//     const res = await productApiProvider.updateCategory(
//       Number(editForm.select_category),
//       editForm.update_name.trim()
//     );
//     if (res) {
//       toast.success("Category updated");
//       await loadCategories();
//       onCategoryCreated?.();
//       handleClose();
//     }
//   };

//   const handleDelete = async () => {
//     if (!editForm.select_category) { toast.error("Select a category to remove"); return; }
//     if (!window.confirm("Delete this category?")) return;
//     const ok = await productApiProvider.deleteCategory(Number(editForm.select_category));
//     if (ok) {
//       toast.success("Category removed");
//       await loadCategories();
//       onCategoryCreated?.();
//       handleClose();
//     }
//   };

//   // ── ADD-TO-EXISTING handler ────────────────────────────
//   const handleAddToExisting = async (e) => {
//     e.preventDefault();
//     if (!addExistingForm.parentId) { toast.error("Select a parent category"); return; }
//     if (!addExistingForm.name.trim()) { toast.error("Enter category name"); return; }
//     setAddExistingSaving(true);
//     const res = await productApiProvider.createCategory(
//       addExistingForm.name.trim(),
//       Number(addExistingForm.parentId)
//     );
//     setAddExistingSaving(false);
//     if (res) {
//       toast.success("Added successfully");
//       setAddExistingForm({ parentId: "", name: "" });
//       await loadCategories();
//       onCategoryCreated?.();
//       setShowAddExisting(false);
//     }
//   };

//   // ─────────────────────────────────────────────────────────────────────────
//   // RENDER
//   // ─────────────────────────────────────────────────────────────────────────
//   return (
//     <div className="productCategory-container">

//       {/* ── HEAD ── */}
//       <div className="category-head">
//         <div className="category-headleft">
//           <svg onClick={handleClose} className="left-logo-category" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="20" height="20" style={{width:"20px",height:"20px",minWidth:"20px",flexShrink:0}}>
//             <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
//           </svg>
//           <p>
//             {showAddExisting ? "Add to Existing Category" :
//              editnewproductCategory ? "Edit Category" : "Categorization Setup"}
//           </p>
//         </div>
//         <div className="category-headright">
//           {!showAddExisting && newproductCategory && (
//             <>
//               <div className="add-category-1" onClick={addAnotherMain}>+ Add new</div>
//               <div className="add-category-2" onClick={() => setShowAddExisting(true)}>+ Add to Existing</div>
//             </>
//           )}
//           {editnewproductCategory && (
//             <div className="add-category-1"
//               onClick={() => { setnewproductCategory(true); setEditnewproductCategory(false); }}>
//               + Add New
//             </div>
//           )}
//           {newproductCategory && !showAddExisting && (
//             <div className="add-category-2"
//               onClick={() => { setEditnewproductCategory(true); setnewproductCategory(false); }}>
//               Edit Existing
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ══ ADD-TO-EXISTING FORM ══════════════════════════════════════ */}
//       {showAddExisting && (
//         <form className="category-form" onSubmit={handleAddToExisting} style={{ marginTop: 20 }}>
//           <div className="category-box" style={{ marginBottom: 14 }}>
//             <label htmlFor="parentId">Select Parent Category<sup>*</sup></label>
//             <select
//               id="parentId"
//               value={addExistingForm.parentId}
//               onChange={(e) => setAddExistingForm((p) => ({ ...p, parentId: e.target.value }))}
//               required
//             >
//               <option value="">— Select —</option>
//               {flatList.map((c) => (
//                 <option key={c.id} value={c.id}>{c.indent}</option>
//               ))}
//             </select>
//           </div>
//           <div className="category-box" style={{ marginBottom: 20 }}>
//             <label htmlFor="addExistingName">New Subcategory Name<sup>*</sup></label>
//             <input
//               id="addExistingName"
//               placeholder="e.g., Casual Dress"
//               value={addExistingForm.name}
//               onChange={(e) => setAddExistingForm((p) => ({ ...p, name: e.target.value }))}
//               required
//             />
//           </div>
//           <div className="category-submit-container">
//             <nav onClick={() => setShowAddExisting(false)}>Cancel</nav>
//             <button type="submit" disabled={addExistingSaving}>
//               {addExistingSaving ? "Saving…" : "Add"}
//             </button>
//           </div>
//         </form>
//       )}

//       {/* ══ CREATE FORM ═══════════════════════════════════════════════ */}
//       {newproductCategory && !showAddExisting && (
//         <form className="category-form" onSubmit={handleCreate}>
//           {mains.map((m, mIdx) => (
//             <div key={m._id} className="category-main-block">
//               {mains.length > 1 && (
//                 <button
//                   type="button"
//                   className="category-remove-main"
//                   onClick={() => removeMain(m._id)}
//                 >✕</button>
//               )}

//               {/* Main name */}
//               <div className="category-box">
//                 <label>New Main Category</label>
//                 <input
//                   className="category-box-input"
//                   placeholder="e.g., Fashion"
//                   value={m.mainName}
//                   onChange={(e) => setMainField(m._id, "mainName", e.target.value)}
//                 />
//               </div>

//               {/* Sub 1 */}
//               <div className="category-tree-section-head" style={{ marginTop: 14 }}>
//                 <span className="category-tree-label">Sub 1 : Add Main Subcategory</span>
//                 <button
//                   type="button"
//                   className={m.sub1Name ? "add-category-2 category-tree-addsub" : "add-category-1 category-tree-addsub"}
//                   onClick={() => {}}
//                   style={{ cursor: "default" }}
//                 >
//                   + Add Sub
//                 </button>
//               </div>
//               <input
//                 className="category-box-input"
//                 placeholder="e.g., Dresses"
//                 value={m.sub1Name}
//                 onChange={(e) => setMainField(m._id, "sub1Name", e.target.value)}
//               />

//               {/* Sub 2+ section */}
//               {m.sub1Name.trim() && (
//                 <div className="category-tree-sub2">
//                   <div className="category-tree-section-head">
//                     <span className="category-tree-label">
//                       Sub 2 : Subcategory({m.sub1Name})
//                     </span>
//                     <button
//                       type="button"
//                       className="add-category-1 category-tree-addmore"
//                       onClick={() => addSub2Item(m._id)}
//                     >
//                       + Add more
//                     </button>
//                   </div>

//                   {m.children.length === 0 && (
//                     <p className="category-tree-hint">
//                       No subcategories yet — click "+ Add more" to get started.
//                     </p>
//                   )}

//                   {m.children.map((child, idx) => (
//                     <div key={child._id} className="category-tree-item-wrapper">
//                       <div className="category-tree-item-row">
//                         <span className="category-tree-item-num">{idx + 1}.</span>
//                         <input
//                           className="category-tree-item-input"
//                           placeholder="Enter item name..."
//                           value={child.name}
//                           onChange={(e) => changeNodeName(m._id, child._id, e.target.value)}
//                         />
//                         <button type="button" className="add-category-1 category-tree-addsub"
//                           onClick={() => addSubUnder(m._id, child._id)}>
//                           + Add Sub
//                         </button>
//                         <button type="button" className="category-tree-remove"
//                           onClick={() => removeFromMain(m._id, child._id)}>
//                           Remove
//                         </button>
//                       </div>
//                       {child.children.length > 0 && (
//                         <ItemRow
//                           node={child}
//                           depth={1}
//                           onNameChange={(nodeId, val) => changeNodeName(m._id, nodeId, val)}
//                           onRemove={(nodeId) => removeFromMain(m._id, nodeId)}
//                           onAddSub={(nodeId) => addSubUnder(m._id, nodeId)}
//                         />
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {mIdx < mains.length - 1 && <hr className="category-divider" />}
//             </div>
//           ))}

//           <button type="button" className="category-add-another" onClick={addAnotherMain}>
//             + Add Another Main Subcategory
//           </button>

//           <div className="category-submit-container" style={{ marginTop: 20 }}>
//             <nav onClick={handleClose}>Cancel</nav>
//             <button type="submit" disabled={saving}>
//               {saving ? "Saving…" : "Create"}
//             </button>
//           </div>
//         </form>
//       )}

//       {/* ══ EDIT FORM ═════════════════════════════════════════════════ */}
//       {editnewproductCategory && !showAddExisting && (
//         <form className="category-form" onSubmit={handleUpdate} style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 15 }}>
//           <div className="category-box">
//             <label htmlFor="select_category">Select Category<sup>*</sup></label>
//             <select
//               id="select_category"
//               value={editForm.select_category}
//               onChange={(e) => setEditForm((p) => ({ ...p, select_category: e.target.value }))}
//               required
//             >
//               <option value="">Select Option</option>
//               {flatList.map((c) => (
//                 <option key={c.id} value={c.id}>{c.indent}</option>
//               ))}
//             </select>
//           </div>
//           <div className="category-box">
//             <label htmlFor="update_name">New Name<sup>*</sup></label>
//             <input
//               id="update_name"
//               placeholder="Updated category name"
//               value={editForm.update_name}
//               onChange={(e) => setEditForm((p) => ({ ...p, update_name: e.target.value }))}
//               required
//             />
//           </div>
//           <div className="category-submit-container">
//             <nav onClick={handleClose}>Cancel</nav>
//             <button type="submit">Update</button>
//             <div className="remove-category" onClick={handleDelete}>Remove</div>
//           </div>
//         </form>
//       )}

//     </div>
//   );
// }

// // ─── recursive row component (defined outside to avoid re-creation) ───────────
// function ItemRow({ node, depth, onNameChange, onRemove, onAddSub }) {
//   return (
//     <div style={{ marginLeft: 16, borderLeft: "2px solid rgba(35,78,112,0.1)", paddingLeft: 10, marginTop: 6 }}>
//       <div className="category-tree-section-head">
//         <span className="category-tree-label">
//           Sub {depth + 2} : Subcategory({node.name || "…"})
//         </span>
//         <button type="button" className="add-category-1 category-tree-addmore"
//           onClick={() => onAddSub(node._id)}>
//           + Add more
//         </button>
//       </div>
//       {node.children.map((child, idx) => (
//         <div key={child._id} className="category-tree-item-wrapper">
//           <div className="category-tree-item-row">
//             <span className="category-tree-item-num">{idx + 1}.</span>
//             <input
//               className="category-tree-item-input"
//               placeholder="Enter item name..."
//               value={child.name}
//               onChange={(e) => onNameChange(child._id, e.target.value)}
//             />
//             <button type="button" className="add-category-1 category-tree-addsub"
//               onClick={() => onAddSub(child._id)}>+ Add Sub</button>
//             <button type="button" className="category-tree-remove"
//               onClick={() => onRemove(child._id)}>Remove</button>
//           </div>
//           {child.children.length > 0 && (
//             <ItemRow node={child} depth={depth + 1}
//               onNameChange={onNameChange} onRemove={onRemove} onAddSub={onAddSub} />
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import "./newproductCategory.css";
import { toast } from "react-toastify";
import productApiProvider from "../../../../network/product-api-provider";

// ─── flatten tree for "Add to Existing" dropdown ─────────────────────────────
function flattenTree(nodes, result = [], depth = 0) {
  for (const node of nodes) {
    result.push({
      id: node.id,
      name: node.name,
      indent: "\u00A0\u00A0".repeat(depth) + (depth > 0 ? "— " : "") + node.name,
    });
    if (Array.isArray(node.children) && node.children.length > 0)
      flattenTree(node.children, result, depth + 1);
  }
  return result;
}

let _uid = 0;
const uid = () => ++_uid;
const mkNode = (name = "") => ({ _id: uid(), name, children: [] });

function addChild(nodes, parentId) {
  return nodes.map((n) =>
    n._id === parentId
      ? { ...n, children: [...n.children, mkNode()] }
      : { ...n, children: addChild(n.children, parentId) }
  );
}
function setName(nodes, id, val) {
  return nodes.map((n) =>
    n._id === id ? { ...n, name: val } : { ...n, children: setName(n.children, id, val) }
  );
}
function removeNode(nodes, id) {
  return nodes
    .filter((n) => n._id !== id)
    .map((n) => ({ ...n, children: removeNode(n.children, id) }));
}
async function saveNodes(nodes, parentId) {
  for (const node of nodes) {
    if (!node.name.trim()) continue;
    const res = await productApiProvider.createCategory(node.name.trim(), parentId);
    const newId = res?.id ?? res?.data?.id ?? null;
    if (newId && node.children.length > 0) await saveNodes(node.children, newId);
  }
}

// ─── Recursive sub-item rows ──────────────────────────────────────────────────
function SubRows({ node, depth, onName, onRemove, onAddSub }) {
  return (
    <div className="npc2-sublevel">
      <div className="npc2-row-header">
        <span className="npc2-sub-label">
          Sub {depth + 2} : Subcategory({node.name || "…"})
        </span>
        <button type="button" className="npc2-btn-addmore" onClick={() => onAddSub(node._id)}>
          + Add more
        </button>
      </div>
      {node.children.map((child, idx) => (
        <div key={child._id} className="npc2-item-block">
          <div className="npc2-item-row">
            <span className="npc2-item-num">{idx + 1}.</span>
            <input
              className="npc2-item-input"
              placeholder="Enter item name..."
              value={child.name}
              onChange={(e) => onName(child._id, e.target.value)}
            />
            <button type="button" className="npc2-btn-addsub" onClick={() => onAddSub(child._id)}>
              +Add Sub
            </button>
            <button type="button" className="npc2-btn-remove" onClick={() => onRemove(child._id)}>
              Remove
            </button>
          </div>
          {child.children.length > 0 && (
            <SubRows node={child} depth={depth + 1} onName={onName} onRemove={onRemove} onAddSub={onAddSub} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function NewproductCategory({
  newproductCategory,
  setnewproductCategory,
  editnewproductCategory,
  setEditnewproductCategory,
  onCategoryCreated,
}) {
  const [flatList, setFlatList] = useState([]);
  const [saving, setSaving] = useState(false);

  // View: "create" | "addExisting" | "edit"
  const [view, setView] = useState(newproductCategory ? "create" : "edit");

  // Create state
  const [mains, setMains] = useState([
    { _id: uid(), mainName: "", sub1Name: "", children: [] },
  ]);

  // Edit state
  const [editForm, setEditForm] = useState({ select_category: "", update_name: "" });

  // Add-to-existing state
  const [addForm, setAddForm] = useState({ parentId: "", name: "" });

  const loadCategories = async () => {
    const data = await productApiProvider.fetchCategories();
    setFlatList(flattenTree(Array.isArray(data) ? data : []));
  };

  useEffect(() => { loadCategories(); }, []);

  useEffect(() => {
    if (editnewproductCategory && editForm.select_category) {
      const found = flatList.find((c) => String(c.id) === String(editForm.select_category));
      if (found) setEditForm((p) => ({ ...p, update_name: found.name }));
    }
  }, [editForm.select_category, editnewproductCategory]);

  const handleClose = () => {
    setnewproductCategory(false);
    setEditnewproductCategory(false);
  };

  // ── CREATE helpers ────────────────────────────────────────────────────────
  const setMainField = (id, field, val) =>
    setMains((prev) => prev.map((m) => m._id === id ? { ...m, [field]: val } : m));

  const addSub2 = (mainId) =>
    setMains((prev) => prev.map((m) =>
      m._id === mainId ? { ...m, children: [...m.children, mkNode()] } : m
    ));

  const addSubUnder = (mainId, nodeId) =>
    setMains((prev) => prev.map((m) =>
      m._id === mainId ? { ...m, children: addChild(m.children, nodeId) } : m
    ));

  const changeName = (mainId, nodeId, val) =>
    setMains((prev) => prev.map((m) =>
      m._id === mainId ? { ...m, children: setName(m.children, nodeId, val) } : m
    ));

  const removeFrom = (mainId, nodeId) =>
    setMains((prev) => prev.map((m) =>
      m._id === mainId ? { ...m, children: removeNode(m.children, nodeId) } : m
    ));

  const addAnotherMain = () =>
    setMains((prev) => [...prev, { _id: uid(), mainName: "", sub1Name: "", children: [] }]);

  const removeMain = (id) =>
    setMains((prev) => prev.filter((m) => m._id !== id));

  // ── SAVE ─────────────────────────────────────────────────────────────────
  const handleCreate = async (e) => {
    e.preventDefault();
    for (const m of mains) {
      if (!m.mainName.trim()) { toast.error("Enter main category name"); return; }
    }
    setSaving(true);
    try {
      for (const m of mains) {
        const mainRes = await productApiProvider.createCategory(m.mainName.trim(), null);
        const mainId = mainRes?.id ?? mainRes?.data?.id;
        if (!mainId) throw new Error();
        let parentId = mainId;
        if (m.sub1Name.trim()) {
          const s1 = await productApiProvider.createCategory(m.sub1Name.trim(), mainId);
          parentId = s1?.id ?? s1?.data?.id ?? mainId;
        }
        if (m.children.length > 0) await saveNodes(m.children, parentId);
      }
      toast.success("Categories created");
      await loadCategories();
      onCategoryCreated?.();
      handleClose();
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editForm.select_category) { toast.error("Select a category"); return; }
    if (!editForm.update_name.trim()) { toast.error("Enter new name"); return; }
    const res = await productApiProvider.updateCategory(Number(editForm.select_category), editForm.update_name.trim());
    if (res) { toast.success("Updated"); await loadCategories(); onCategoryCreated?.(); handleClose(); }
  };

  const handleDelete = async () => {
    if (!editForm.select_category) { toast.error("Select a category"); return; }
    if (!window.confirm("Delete this category?")) return;
    const ok = await productApiProvider.deleteCategory(Number(editForm.select_category));
    if (ok) { toast.success("Deleted"); await loadCategories(); onCategoryCreated?.(); handleClose(); }
  };

  const handleAddExisting = async (e) => {
    e.preventDefault();
    if (!addForm.parentId) { toast.error("Select parent"); return; }
    if (!addForm.name.trim()) { toast.error("Enter name"); return; }
    setSaving(true);
    const res = await productApiProvider.createCategory(addForm.name.trim(), Number(addForm.parentId));
    setSaving(false);
    if (res) { toast.success("Added"); setAddForm({ parentId: "", name: "" }); await loadCategories(); onCategoryCreated?.(); setView("create"); }
  };

  const title = view === "addExisting" ? "Add to Existing" : "Categorization Setup";

  return (
    <div className="npc2-overlay">
      <div className="npc2-card">

        {/* ── HEADER ── */}
        <div className="npc2-header">
          <div className="npc2-header-left">
            <button type="button" className="npc2-back" onClick={handleClose}>‹</button>
            <span className="npc2-title">{title}</span>
          </div>
          <div className="npc2-header-right">
            {view !== "addExisting" && (
              <>
                <button type="button" className="npc2-btn-primary" onClick={addAnotherMain}>
                  + Add new
                </button>
                <button type="button" className="npc2-btn-outline" onClick={() => setView("addExisting")}>
                  +Add to Existing
                </button>
              </>
            )}
            {view === "addExisting" && (
              <button type="button" className="npc2-btn-outline" onClick={() => setView("create")}>
                ← Back
              </button>
            )}
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="npc2-body">

          {/* ══ ADD TO EXISTING ══════════════════════════════════════════ */}
          {view === "addExisting" && (
            <form onSubmit={handleAddExisting} className="npc2-form">
              <div className="npc2-field">
                <label>Select Parent Category <sup>*</sup></label>
                <select value={addForm.parentId} onChange={(e) => setAddForm((p) => ({ ...p, parentId: e.target.value }))} required>
                  <option value="">— Select —</option>
                  {flatList.map((c) => <option key={c.id} value={c.id}>{c.indent}</option>)}
                </select>
              </div>
              <div className="npc2-field">
                <label>New Subcategory Name <sup>*</sup></label>
                <input placeholder="e.g., Casual Dress" value={addForm.name}
                  onChange={(e) => setAddForm((p) => ({ ...p, name: e.target.value }))} required />
              </div>
              <div className="npc2-footer">
                <button type="button" className="npc2-cancel" onClick={() => setView("create")}>Cancel</button>
                <button type="submit" className="npc2-create" disabled={saving}>{saving ? "Saving…" : "Add"}</button>
              </div>
            </form>
          )}

          {/* ══ EDIT ═════════════════════════════════════════════════════ */}
          {view === "edit" && (
            <form onSubmit={handleUpdate} className="npc2-form">
              <div className="npc2-field">
                <label>Select Category <sup>*</sup></label>
                <select value={editForm.select_category}
                  onChange={(e) => setEditForm((p) => ({ ...p, select_category: e.target.value }))} required>
                  <option value="">Select Option</option>
                  {flatList.map((c) => <option key={c.id} value={c.id}>{c.indent}</option>)}
                </select>
              </div>
              <div className="npc2-field">
                <label>New Name <sup>*</sup></label>
                <input placeholder="Updated name" value={editForm.update_name}
                  onChange={(e) => setEditForm((p) => ({ ...p, update_name: e.target.value }))} required />
              </div>
              <div className="npc2-footer npc2-footer-edit">
                <button type="button" className="npc2-delete" onClick={handleDelete}>Remove</button>
                <div style={{ display: "flex", gap: 10 }}>
                  <button type="button" className="npc2-cancel" onClick={handleClose}>Cancel</button>
                  <button type="submit" className="npc2-create">Update</button>
                </div>
              </div>
            </form>
          )}

          {/* ══ CREATE ═══════════════════════════════════════════════════ */}
          {view === "create" && (
            <form onSubmit={handleCreate} className="npc2-form">
              {mains.map((m, mIdx) => (
                <div key={m._id} className="npc2-main-block">
                  {mains.length > 1 && (
                    <button type="button" className="npc2-remove-main" onClick={() => removeMain(m._id)}>✕</button>
                  )}

                  {/* Main name */}
                  <div className="npc2-field">
                    <label>New Main Category</label>
                    <input
                      placeholder="e.g., Fashion"
                      value={m.mainName}
                      onChange={(e) => setMainField(m._id, "mainName", e.target.value)}
                    />
                  </div>

                  {/* Sub 1 */}
                  <div className="npc2-row-header" style={{ marginTop: 12 }}>
                    <span className="npc2-sub-label">Sub 1 : Add Main Subcategory</span>
                    <button
                      type="button"
                      className={m.sub1Name.trim() ? "npc2-btn-addsub-grey" : "npc2-btn-addsub"}
                    >
                      +Add Sub
                    </button>
                  </div>
                  <input
                    className="npc2-full-input"
                    placeholder="e.g., Dresses"
                    value={m.sub1Name}
                    onChange={(e) => setMainField(m._id, "sub1Name", e.target.value)}
                  />

                  {/* Sub 2+ */}
                  {m.sub1Name.trim() && (
                    <div className="npc2-sub2-box">
                      <div className="npc2-row-header">
                        <span className="npc2-sub-label">Sub 2 : Subcategory({m.sub1Name})</span>
                        <button type="button" className="npc2-btn-addmore" onClick={() => addSub2(m._id)}>
                          +Add more
                        </button>
                      </div>

                      {m.children.length === 0 && (
                        <p className="npc2-hint">No subcategories yet — click "+Add more" to get started.</p>
                      )}

                      {m.children.map((child, idx) => (
                        <div key={child._id} className="npc2-item-block">
                          <div className="npc2-item-row">
                            <span className="npc2-item-num">{idx + 1}.</span>
                            <input
                              className="npc2-item-input"
                              placeholder="Enter item name..."
                              value={child.name}
                              onChange={(e) => changeName(m._id, child._id, e.target.value)}
                            />
                            <button type="button" className="npc2-btn-addsub"
                              onClick={() => addSubUnder(m._id, child._id)}>+Add Sub</button>
                            <button type="button" className="npc2-btn-remove"
                              onClick={() => removeFrom(m._id, child._id)}>Remove</button>
                          </div>
                          {child.children.length > 0 && (
                            <SubRows
                              node={child} depth={1}
                              onName={(nodeId, val) => changeName(m._id, nodeId, val)}
                              onRemove={(nodeId) => removeFrom(m._id, nodeId)}
                              onAddSub={(nodeId) => addSubUnder(m._id, nodeId)}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {mIdx < mains.length - 1 && <hr className="npc2-divider" />}
                </div>
              ))}

              <button type="button" className="npc2-add-another" onClick={addAnotherMain}>
                + Add Another Main Subcategory
              </button>

              <div className="npc2-footer">
                <button type="button" className="npc2-cancel" onClick={handleClose}>Cancel</button>
                <button type="submit" className="npc2-create" disabled={saving}>
                  {saving ? "Saving…" : editnewproductCategory ? "Update" : "Create"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}