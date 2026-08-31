// import React, { useState, useEffect } from "react";
// import "./newproductTaxCode.css";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";

// export default function NewProductTaxCode({
//   newproduct_tax_code,
//   setnewproduct_tax_code,
//   newproduct_edit_tax_code,
//   setnewproduct_edit_tax_code,
//   editDropDown, // Expected to be passed as [{id, name}, ...] or array of strings
// }) {
//   const [TaxCodeData, setTaxCodeData] = useState({
//     tax_name: "",
//     tax_percentage: "",
//     description: "",
//   });
//   const [taxCodes, setTaxCodes] = useState([]); // Store fetched tax codes

//   // Fetch tax codes on component mount
//   useEffect(() => {
//     const fetchTaxCodes = async () => {
//       try {
//         const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
//         const authState = JSON.parse(persistedAuth.auth || "{}");
//         const token = authState?.user?.token;
//         if (!token) {
//           toast.error("No authentication token found. Please log in.");
//           return;
//         }
//         const res = await axios.get("http://127.0.0.1:8000/api/tax-codes/", {
//           headers: {
//             Authorization: `Token ${token}`,
//           },
//         });

//         setTaxCodes(res.data.tax_codes); // Backend returns { tax_codes: [{id, name, percentage, description}, ...], ... }
//       } catch (error) {
//         toast.error("Failed to fetch tax codes: " + (error.response?.data?.error || error.message));
//       }
//     };
//     fetchTaxCodes();
//   }, []);

//   //prefill the edit form
//   useEffect(() => {
//   if (newproduct_edit_tax_code && TaxCodeData.tax_name && taxCodes.length > 0) {
//     const selected = taxCodes.find((tax) => tax.name === TaxCodeData.tax_name);
//     if (selected) {
//       setTaxCodeData({
//         tax_name: selected.name,
//         tax_percentage: selected.percentage?.toString() || "",
//         description: selected.description || "",
//       });
//     }
//   }
// }, [newproduct_edit_tax_code, TaxCodeData.tax_name, taxCodes]);

//   const handleTaxDataChange = (e) => {
//     setTaxCodeData((prev) => ({
//       ...prev,
//       [e.target.id]: e.target.value,
//     }));
//   };

//   const handleTaxDataSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
//       const authState = JSON.parse(persistedAuth.auth || "{}");
//       const token = authState?.user?.token;
//       if (!token) {
//         toast.error("No authentication token found. Please log in.");
//         return;
//       }

//       if (newproduct_tax_code) {
//         // ADD NEW TAX CODE
//         const res = await axios.post(
//           "http://127.0.0.1:8000/api/tax-codes/",
//           {
//             name: TaxCodeData.tax_name,
//             percentage: parseFloat(TaxCodeData.tax_percentage),
//             description: TaxCodeData.description || null,
//           },
//           {
//             headers: {
//               Authorization: `Token ${token}`,
//             },
//           }
//         );
//         toast.success("Tax code created successfully!");
//         setTaxCodes([...taxCodes, res.data]); // Update local tax codes
//         setTimeout(() => {
//           setnewproduct_tax_code(false);
//           setnewproduct_edit_tax_code(false);
//         }, 3000);
//       } else {
//         // EDIT EXISTING TAX CODE
//         const selectedTaxCode = taxCodes.find(
//           (item) => item.name === TaxCodeData.tax_name
//         );

//         if (!selectedTaxCode) {
//           toast.error("Please select a valid tax code to update.");
//           return;
//         }

//         const res = await axios.put(
//           `http://127.0.0.1:8000/api/tax-codes/${selectedTaxCode.id}/`,
//           {
//             name: TaxCodeData.tax_name,
//             percentage: parseFloat(TaxCodeData.tax_percentage),
//             description: TaxCodeData.description || null,
//           },
//           {
//             headers: {
//               Authorization: `Token ${token}`,
//             },
//           }
//         );
//         toast.success("Tax code updated successfully!");
//         setTaxCodes(
//           taxCodes.map((tax) =>
//             tax.id === selectedTaxCode.id ? res.data : tax
//           )
//         ); // Update local tax codes
//         setTimeout(() => {
//           setnewproduct_tax_code(false);
//           setnewproduct_edit_tax_code(false);
//         }, 3000);
//       }

//       // Reset form
//       setTaxCodeData({
//         tax_name: "",
//         tax_percentage: "",
//         description: "",
//       });
//     } catch (error) {
//       const errorMsg = error.response?.data?.error || error.message;
//       toast.error(
//         newproduct_tax_code
//           ? "Failed to create tax code: " + errorMsg
//           : "Failed to update tax code: " + errorMsg
//       );
//     }
//   };

//   const handleDeleteTaxCode = async () => {
//     if (!newproduct_edit_tax_code) return;

//     const selectedTaxCode = taxCodes.find(
//       (item) => item.name === TaxCodeData.tax_name
//     );

//     if (!selectedTaxCode) {
//       toast.error("Please select a valid tax code to delete.");
//       return;
//     }

//     try {
//       const persistedAuth = JSON.parse(localStorage.getItem("persist:root") || "{}");
//       const authState = JSON.parse(persistedAuth.auth || "{}");
//       const token = authState?.user?.token;
//       if (!token) {
//         toast.error("No authentication token found. Please log in.");
//         return;
//       }

//       await axios.delete(`http://127.0.0.1:8000/api/tax-codes/${selectedTaxCode.id}/`, {
//         headers: {
//           Authorization: `Token ${token}`,
//         },
//       });
//       toast.success("Tax code deleted successfully!");
//       setTaxCodes(taxCodes.filter((tax) => tax.id !== selectedTaxCode.id));
//       setTaxCodeData({
//         tax_name: "",
//         tax_percentage: "",
//         description: "",
//       });
//       setTimeout(() => {
//         setnewproduct_edit_tax_code(false);
//         setnewproduct_tax_code(false);
//       }, 3000);
//     } catch (error) {
//       const errorMsg = error.response?.data?.error || error.message;
//       toast.error("Failed to delete tax code: " + errorMsg);
//     }
//   };

//   return (
//     <>
//       <div className="tax-code-cointainer">
//         <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
//         <div className="tax-code-head">
//           <div className="tax-code-headleft">
//             <svg
//               onClick={() => {
//                 setnewproduct_tax_code(false);
//                 setnewproduct_edit_tax_code(false);
//                 toast.dismiss(); // Clear toasts on cancel
//               }}
//               className="left-logo-tax-code"
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 320 512"
//             >
//               <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
//             </svg>
//             <p>{newproduct_edit_tax_code ? "Edit" : "Add New"}Tax Code</p>
//           </div>
//           <div className="tax-code-headright">
//             {newproduct_edit_tax_code && (
//               <div
//                 className="add-tax-code-1"
//                 onClick={() => {
//                   setnewproduct_tax_code(true);
//                   setnewproduct_edit_tax_code(false);
//                   toast.dismiss(); // Clear toasts on mode switch
//                 }}
//               >
//                 + Add Tax Code
//               </div>
//             )}
//             {newproduct_tax_code && (
//               <div
//                 className="add-tax-code-2"
//                 onClick={() => {
//                   setnewproduct_edit_tax_code(true);
//                   setnewproduct_tax_code(false);
//                   toast.dismiss(); // Clear toasts on mode switch
//                 }}
//               >
//                 Edit Tax Code
//               </div>
//             )}
//           </div>
//         </div>
//         <div className="tax-code-form">
//           <form onSubmit={handleTaxDataSubmit}>
//             {newproduct_tax_code ? (
//               <div className="tax-code-box">
//                 <label htmlFor="tax_name">Tax Name</label>
//                 <input
//                   type="text"
//                   value={TaxCodeData.tax_name}
//                   onChange={handleTaxDataChange}
//                   id="tax_name"
//                   placeholder="e.g., GST"
//                   required
//                 />
//               </div>
//             ) : (
//               <div className="tax-code-box">
//                 <label htmlFor="tax_name">Tax Name</label>
//                 <select
//                   id="tax_name"
//                   value={TaxCodeData.tax_name}
//                   onChange={handleTaxDataChange}
//                   required
//                 >
//                   <option value="">Select Option</option>
//                   {taxCodes.map((ele, ind) => (
//                     <option key={ind} value={typeof ele === 'object' ? ele.name : ele}>
//                       {typeof ele === 'object' ? ele.name : ele}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             )}

//             <div className="tax-code-box">
//               <label htmlFor="tax_percentage">Tax Percentage {"(%)"}</label>
//               <input
//                 className="increment-decrement-tax-code"
//                 type="number"
//                 value={TaxCodeData.tax_percentage}
//                 onChange={handleTaxDataChange}
//                 id="tax_percentage"
//                 placeholder="e.g., 18"
//                 required
//               />
//             </div>
//             <div className="tax-code-box">
//               <label htmlFor="description">Description {"(optional)"}</label>
//               <input
//                 type="text"
//                 value={TaxCodeData.description}
//                 onChange={handleTaxDataChange}
//                 id="description"
//                 placeholder="Text Area"
//               />
//             </div>
//             <div className="tax-code-submit-container">
//               <nav
//                 onClick={() => {
//                   setnewproduct_tax_code(false);
//                   setnewproduct_edit_tax_code(false);
//                   toast.dismiss(); // Clear toasts on cancel
//                 }}
//               >
//                 Canael
//               </nav>
//               <button type="submit">{newproduct_edit_tax_code ? "Update" : "Create"}</button>
//               {newproduct_edit_tax_code && (
//                 <div className="remove-tax-code" onClick={handleDeleteTaxCode}>
//                   Remove
//                 </div>
//               )}
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// }
// import React, { useState, useEffect } from "react";
// import "./newproductTaxCode.css";
// import { ToastContainer, toast } from "react-toastify";
// import productApiProvider from "../../../../network/product-api-provider";

// export default function NewProductTaxCode({
//   newproduct_tax_code,
//   setnewproduct_tax_code,
//   newproduct_edit_tax_code,
//   setnewproduct_edit_tax_code,
// }) {
//   const [TaxCodeData, setTaxCodeData] = useState({ tax_name: "", tax_percentage: "", description: "" });
//   const [taxCodes, setTaxCodes] = useState([]);

//   useEffect(() => {
//     const load = async () => {
//       const data = await productApiProvider.fetchTaxCodes();
//       setTaxCodes(Array.isArray(data) ? data : []);
//     };
//     load();
//   }, []);

//   // Prefill on edit selection
//   useEffect(() => {
//     if (newproduct_edit_tax_code && TaxCodeData.tax_name && taxCodes.length > 0) {
//       const selected = taxCodes.find((t) => t.name === TaxCodeData.tax_name);
//       if (selected) {
//         setTaxCodeData({ tax_name: selected.name, tax_percentage: selected.percentage?.toString() || "", description: selected.description || "" });
//       }
//     }
//   }, [newproduct_edit_tax_code, TaxCodeData.tax_name, taxCodes]);

//   const handleTaxDataChange = (e) => setTaxCodeData((prev) => ({ ...prev, [e.target.id]: e.target.value }));

//   const handleTaxDataSubmit = async (e) => {
//     e.preventDefault();
//     const payload = { name: TaxCodeData.tax_name, percentage: parseFloat(TaxCodeData.tax_percentage), description: TaxCodeData.description || null };
//     if (newproduct_tax_code) {
//       const res = await productApiProvider.createTaxCode(payload);
//       if (res) {
//         setTaxCodes((prev) => [...prev, res]);
//         setTaxCodeData({ tax_name: "", tax_percentage: "", description: "" });
//         setTimeout(() => { setnewproduct_tax_code(false); setnewproduct_edit_tax_code(false); }, 3000);
//       }
//     } else {
//       const selected = taxCodes.find((t) => t.name === TaxCodeData.tax_name);
//       if (!selected) { toast.error("Please select a valid tax code"); return; }
//       const res = await productApiProvider.updateTaxCode(selected.id, payload);
//       if (res) {
//         setTaxCodes((prev) => prev.map((t) => t.id === selected.id ? res : t));
//         setTaxCodeData({ tax_name: "", tax_percentage: "", description: "" });
//         setTimeout(() => { setnewproduct_tax_code(false); setnewproduct_edit_tax_code(false); }, 3000);
//       }
//     }
//   };

//   const handleDeleteTaxCode = async () => {
//     const selected = taxCodes.find((t) => t.name === TaxCodeData.tax_name);
//     if (!selected) { toast.error("Please select a valid tax code"); return; }
//     const ok = await productApiProvider.deleteTaxCode(selected.id);
//     if (ok) {
//       setTaxCodes((prev) => prev.filter((t) => t.id !== selected.id));
//       setTaxCodeData({ tax_name: "", tax_percentage: "", description: "" });
//       setTimeout(() => { setnewproduct_edit_tax_code(false); setnewproduct_tax_code(false); }, 3000);
//     }
//   };

//   return (
//     <div className="tax-code-cointainer">
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
//       <div className="tax-code-head">
//         <div className="tax-code-headleft">
//           <svg onClick={() => { setnewproduct_tax_code(false); setnewproduct_edit_tax_code(false); toast.dismiss(); }} className="left-logo-tax-code" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
//             <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
//           </svg>
//           <p>{newproduct_edit_tax_code ? "Edit" : "Add New"} Tax Code</p>
//         </div>
//         <div className="tax-code-headright">
//           {newproduct_edit_tax_code && <div className="add-tax-code-1" onClick={() => { setnewproduct_tax_code(true); setnewproduct_edit_tax_code(false); toast.dismiss(); }}>+ Add Tax Code</div>}
//           {newproduct_tax_code && <div className="add-tax-code-2" onClick={() => { setnewproduct_edit_tax_code(true); setnewproduct_tax_code(false); toast.dismiss(); }}>Edit Tax Code</div>}
//         </div>
//       </div>
//       <div className="tax-code-form">
//         <form onSubmit={handleTaxDataSubmit}>
//           {newproduct_tax_code ? (
//             <div className="tax-code-box">
//               <label htmlFor="tax_name">Tax Name</label>
//               <input type="text" value={TaxCodeData.tax_name} onChange={handleTaxDataChange} id="tax_name" placeholder="e.g., GST" required />
//             </div>
//           ) : (
//             <div className="tax-code-box">
//               <label htmlFor="tax_name">Tax Name</label>
//               <select id="tax_name" value={TaxCodeData.tax_name} onChange={handleTaxDataChange} required>
//                 <option value="">Select Option</option>
//                 {taxCodes.map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
//               </select>
//             </div>
//           )}
//           <div className="tax-code-box">
//             <label htmlFor="tax_percentage">Tax Percentage (%)</label>
//             <input className="increment-decrement-tax-code" type="number" value={TaxCodeData.tax_percentage} onChange={handleTaxDataChange} id="tax_percentage" placeholder="e.g., 18" required />
//           </div>
//           <div className="tax-code-box">
//             <label htmlFor="description">Description (optional)</label>
//             <input type="text" value={TaxCodeData.description} onChange={handleTaxDataChange} id="description" placeholder="Text Area" />
//           </div>
//           <div className="tax-code-submit-container">
//             <nav onClick={() => { setnewproduct_tax_code(false); setnewproduct_edit_tax_code(false); toast.dismiss(); }}>Cancel</nav>
//             <button type="submit">{newproduct_edit_tax_code ? "Update" : "Create"}</button>
//             {newproduct_edit_tax_code && <div className="remove-tax-code" onClick={handleDeleteTaxCode}>Remove</div>}
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import "./newproductTaxCode.css";
import { ToastContainer, toast } from "react-toastify";
import productApiProvider from "../../../../network/product-api-provider";

export default function NewProductTaxCode({
  newproduct_tax_code,
  setnewproduct_tax_code,
  newproduct_edit_tax_code,
  setnewproduct_edit_tax_code,
}) {
  const [TaxCodeData, setTaxCodeData] = useState({
    name: "",
    percentage: "",
    description: "",
    select_tax_code: "",   // edit/delete: selected by ID
  });
  const [taxCodes, setTaxCodes] = useState([]);

  const loadTaxCodes = async () => {
    const data = await productApiProvider.fetchTaxCodes();
    setTaxCodes(Array.isArray(data) ? data : []);
  };

  useEffect(() => { loadTaxCodes(); }, []);

  // Prefill when a tax code is selected in edit mode
  useEffect(() => {
    if (newproduct_edit_tax_code && TaxCodeData.select_tax_code) {
      const found = taxCodes.find((t) => String(t.id) === String(TaxCodeData.select_tax_code));
      if (found) {
        setTaxCodeData((prev) => ({
          ...prev,
          name: found.name || "",
          percentage: found.percentage?.toString() || "",
          description: found.description || "",
        }));
      }
    }
  }, [TaxCodeData.select_tax_code, newproduct_edit_tax_code, taxCodes]);

  const handleChange = (e) =>
    setTaxCodeData((prev) => ({ ...prev, [e.target.id]: e.target.value }));

  const handleClose = () => {
    setnewproduct_tax_code(false);
    setnewproduct_edit_tax_code(false);
    toast.dismiss();
  };

  // ── CREATE ──────────────────────────────────────────────────────
  const handleCreate = async (e) => {
    e.preventDefault();
    const payload = {
      name: TaxCodeData.name.trim(),
      percentage: TaxCodeData.percentage,   // API accepts string "18.00"
      description: TaxCodeData.description.trim() || null,
    };
    const res = await productApiProvider.createTaxCode(payload);
    if (res) {
      setTaxCodeData({ name: "", percentage: "", description: "", select_tax_code: "" });
      await loadTaxCodes();
      setTimeout(handleClose, 3000);
    }
  };

  // ── UPDATE ──────────────────────────────────────────────────────
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!TaxCodeData.select_tax_code) { toast.error("Please select a tax code to update"); return; }
    const payload = {
      name: TaxCodeData.name.trim(),
      percentage: TaxCodeData.percentage,
      description: TaxCodeData.description.trim() || null,
    };
    const res = await productApiProvider.updateTaxCode(Number(TaxCodeData.select_tax_code), payload);
    if (res) {
      setTaxCodeData({ name: "", percentage: "", description: "", select_tax_code: "" });
      await loadTaxCodes();
      setTimeout(handleClose, 3000);
    }
  };

  // ── DELETE ──────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!TaxCodeData.select_tax_code) { toast.error("Please select a tax code to remove"); return; }
    const ok = await productApiProvider.deleteTaxCode(Number(TaxCodeData.select_tax_code));
    if (ok) {
      setTaxCodeData({ name: "", percentage: "", description: "", select_tax_code: "" });
      await loadTaxCodes();
      setTimeout(handleClose, 3000);
    }
  };

  return (
    <div className="tax-code-cointainer">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <div className="tax-code-head">
        <div className="tax-code-headleft">
          <svg onClick={handleClose} className="left-logo-tax-code" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
          </svg>
          <p>{newproduct_edit_tax_code ? "Edit" : "Add New"} Tax Code</p>
        </div>
        <div className="tax-code-headright">
          {newproduct_edit_tax_code && (
            <div className="add-tax-code-1" onClick={() => { setnewproduct_tax_code(true); setnewproduct_edit_tax_code(false); toast.dismiss(); }}>
              + Add Tax Code
            </div>
          )}
          {newproduct_tax_code && (
            <div className="add-tax-code-2" onClick={() => { setnewproduct_edit_tax_code(true); setnewproduct_tax_code(false); toast.dismiss(); }}>
              Edit Tax Code
            </div>
          )}
        </div>
      </div>

      <div className="tax-code-form">

        {/* ── CREATE MODE ── */}
        {newproduct_tax_code && (
          <form onSubmit={handleCreate}>
            <div className="tax-code-box">
              <label htmlFor="name">Tax Name<sup>*</sup></label>
              <input type="text" id="name" value={TaxCodeData.name} onChange={handleChange} placeholder="e.g., GST 18%" required />
            </div>
            <div className="tax-code-box">
              <label htmlFor="percentage">Tax Percentage (%)<sup>*</sup></label>
              <input className="increment-decrement-tax-code" type="number" id="percentage" value={TaxCodeData.percentage} onChange={handleChange} placeholder="e.g., 18" min="0" max="100" step="0.01" required />
            </div>
            <div className="tax-code-box">
              <label htmlFor="description">Description <span style={{ color: "#888", fontWeight: 400 }}>(optional)</span></label>
              <input type="text" id="description" value={TaxCodeData.description} onChange={handleChange} placeholder="e.g., Standard GST rate" />
            </div>
            <div className="tax-code-submit-container">
              <nav onClick={handleClose}>Cancel</nav>
              <button type="submit">Create</button>
            </div>
          </form>
        )}

        {/* ── EDIT / DELETE MODE ── */}
        {newproduct_edit_tax_code && (
          <form onSubmit={handleUpdate}>
            <div className="tax-code-box">
              <label htmlFor="select_tax_code">Select Tax Code<sup>*</sup></label>
              <select id="select_tax_code" value={TaxCodeData.select_tax_code} onChange={handleChange} required>
                <option value="">Select Option</option>
                {taxCodes.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} ({t.percentage}%)</option>
                ))}
              </select>
            </div>
            <div className="tax-code-box">
              <label htmlFor="name">Tax Name<sup>*</sup></label>
              <input type="text" id="name" value={TaxCodeData.name} onChange={handleChange} placeholder="e.g., GST 18%" required />
            </div>
            <div className="tax-code-box">
              <label htmlFor="percentage">Tax Percentage (%)<sup>*</sup></label>
              <input className="increment-decrement-tax-code" type="number" id="percentage" value={TaxCodeData.percentage} onChange={handleChange} placeholder="e.g., 18" min="0" max="100" step="0.01" required />
            </div>
            <div className="tax-code-box">
              <label htmlFor="description">Description <span style={{ color: "#888", fontWeight: 400 }}>(optional)</span></label>
              <input type="text" id="description" value={TaxCodeData.description} onChange={handleChange} placeholder="e.g., Standard GST rate" />
            </div>
            <div className="tax-code-submit-container">
              <nav onClick={handleClose}>Cancel</nav>
              <button type="submit">Update</button>
              <div className="remove-tax-code" onClick={handleDelete}>Remove</div>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}