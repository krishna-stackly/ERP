// // import React, { useState, useEffect } from "react";
// // import "./quotationCRM.css";
// // import CreateNewQuotation from "../create-new-quotation/createNewQuotation";
// // import CreateNewQuotationEdit from "../create-new-quotation/createNewQuotationEdit";

// // export default function quotation() {
// //   const [status, setStatus] = useState("");

// //   console.log(status);

// //   const [selectStatus, setselectStatus] = useState("");
// //   const [seleQuotationType, setseleQuotationType] = useState("");
// //   const [selectSales, setselectSales] = useState("");

// //   const [quotationCurrentPage, setquotationCurrentPage] = useState(1);
// //   const quotationRowPerPage = 10;

// //   const [showNewQuotation, setshowNewQuotation] = useState(false);
// //   const [showEditNewQuotation, setshowEditNewQuotation] = useState(false);
// //   const [editQuotationData, setEditQuotationData] = useState({});

// //   const [ApiQuotation, setApiQuotation] = useState({});
// //   const [quotation, setQuotation] = useState([]);
// //   const [searchSalseRep, setsearchSalseRep] = useState([]);
// //   const quotationFromAPI = {
// //     quotation: [
// //       {
// //         id: "1",
// //         quotation_id: "QUO0001",
// //         quotation_type: "Service",
// //         customer_name: "Mandy",
// //         sales_rep: "Sans",
// //         quotation_date: "2025-10-10",
// //         status: "Draft",
// //         currency: "USD",
// //         revise_count: 1,
// //         grand_total: "50000",
// //         product_id: "PRO0005",
// //         description: "M-shirt",
// //         uom: "Set (5)",
// //         unit_price: "130",
// //         discount: "5",
// //         tax: "12",
// //         quantity: "50",
// //       },

// //       {
// //         id: "2",
// //         quotation_id: "QUO0002",
// //         quotation_type: "Service",
// //         customer_name: "Mandy",
// //         sales_rep: "Sans",
// //         quotation_date: "2025-10-10",
// //         status: "Send",
// //         revise_count: 2,
// //         grand_total: "50000",
// //         products: [
// //           {
// //             product_id: "PRO0005",
// //             description: "M-shirt",
// //             uom: "Set (5)",
// //             unit_price: "5",
// //             discount: "5",
// //             tax: "18",
// //             quantity: "9",
// //           },
// //           {
// //             product_id: "PRO0005",
// //             description: "M-shirt",
// //             uom: "Set (5)",
// //             unit_price: "5",
// //             discount: "5",
// //             tax: "18",
// //             quantity: "9",
// //           },
// //         ],
// //       },
// //       {
// //         id: "3",
// //         quotation_id: "QUO0003",
// //         quotation_type: "Service",
// //         customer_name: "Sans",
// //         sales_rep: "Sans",
// //         quotation_date: "2025-10-10",
// //         status: "Rejected",
// //         grand_total: "50000",
// //         product_id: "PRO0005",
// //         description: "M-shirt",
// //         uom: "Set (5)",
// //         unit_price: "130",
// //         discount: "5",
// //         tax: "12",
// //         quantity: "5",
// //       },
// //       {
// //         id: "4",
// //         quotation_id: "QUO0004",
// //         quotation_type: "Service",
// //         customer_name: "Mandy",
// //         sales_rep: "Sans",
// //         quotation_date: "2025-10-10",
// //         status: "Approved",
// //         grand_total: "50000",
// //       },
// //       {
// //         id: "5",
// //         quotation_id: "QUO0005",
// //         quotation_type: "Service",
// //         customer_name: "Naveen",
// //         sales_rep: "Sans",
// //         quotation_date: "2025-10-10",
// //         status: "Expired",
// //         grand_total: "50000",
// //       },
// //       {
// //         id: "6",
// //         quotation_id: "QUO0006",
// //         quotation_type: "Service",
// //         customer_name: "rahul",
// //         sales_rep: "Sans",
// //         quotation_date: "2025-10-10",
// //         status: "Expired",
// //         grand_total: "50000",
// //       },
// //       {
// //         id: "7",
// //         quotation_id: "QUO0007",
// //         quotation_type: "Service",
// //         customer_name: "Mandy",
// //         sales_rep: "Sans",
// //         quotation_date: "2025-10-10",
// //         status: "Draft",
// //         revise_count: 5,
// //         grand_total: "50000",
// //       },
// //     ],
// //     searchSalseRep: ["Michael", "Harish", "Michael"],
// //   };
// //   useEffect(() => {
// //     setApiQuotation(quotationFromAPI);
// //   }, []);
// //   useEffect(() => {
// //     if (Object.keys(ApiQuotation).length) {
// //       setQuotation(ApiQuotation.quotation);
// //       setsearchSalseRep(ApiQuotation.searchSalseRep);
// //     }
// //   }, [ApiQuotation]);

// //   //page calculation
// //   const totalPages = Math.ceil(quotation.length / quotationRowPerPage);

// //   const currentData = quotation.slice(
// //     (quotationCurrentPage - 1) * quotationRowPerPage,
// //     quotationCurrentPage * quotationRowPerPage
// //   );

// //   const handleNext = () => {
// //     if (quotationCurrentPage < totalPages) {
// //       setquotationCurrentPage((prev) => prev + 1);
// //     }
// //   };
// //   const handlePrev = () => {
// //     if (quotationCurrentPage > 1) {
// //       setquotationCurrentPage((prev) => prev - 1);
// //     }
// //   };

// //   const showEditQuotation = (id) => {
// //     setEditQuotationData(
// //       currentData.find((ele) => {
// //         return ele.id === id;
// //       })
// //     );
// //   };
// //   function resetSearchBox() {
// //     setselectSales("");
// //     setseleQuotationType("");
// //     setselectStatus("");
// //     console.log(seleQuotationType, selectSales, selectStatus);
// //   }

// //   return (
// //     <>
// //       {showNewQuotation ? (
// //         <CreateNewQuotation
// //           setshowNewQuotation={setshowNewQuotation}
// //           showEditNewQuotation={showEditNewQuotation}
// //           setEditQuotationData={setEditQuotationData}
// //           status={status}
// //           setStatus={setStatus}
// //         />
// //       ) : showEditNewQuotation ? (
// //         <CreateNewQuotationEdit
// //           setshowNewQuotation={setshowEditNewQuotation}
// //           showEditNewQuotation={showEditNewQuotation}
// //           editQuotationData={editQuotationData}
// //           setEditQuotationData={setEditQuotationData}
// //           status={status}
// //           setStatus={setStatus}
// //         />
// //       ) : (
// //         <div className="quotationCRM-container">
// //           <div className="quotationCRM-header">
// //             <p>Quotation</p>
// //             <button onClick={() => setshowNewQuotation(true)}>
// //               + Add New Quotation
// //             </button>
// //           </div>
// //           <div className="quotationCRM-search-box">
// //             <label htmlFor="searchByID">
// //               <svg
// //                 className="quotationCRM-search-logo"
// //                 xmlns="http://www.w3.org/2000/svg"
// //                 viewBox="0 0 512 512"
// //               >
// //                 <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
// //               </svg>
// //             </label>
// //             <input id="searchByID" placeholder="Search by ID,Name..." />
// //           </div>
// //           <div className="quotationCRM-clearfilter">
// //             <p onClick={resetSearchBox}>Clear Filter</p>
// //           </div>
// //           <div className="quotationCRM-search-category">
// //             <div className="quotationCRM-input-box">
// //               <label htmlFor="status">Status</label>
// //               <select
// //                 id="status"
// //                 value={selectStatus}
// //                 onChange={(e) => setselectStatus(e.target.value)}
// //               >
// //                 <option value="">All</option>
// //                 <option value="Draft">Draft</option>
// //                 <option value="Send">Send</option>
// //                 <option value="Approved">Approved</option>
// //                 <option value="Rejected">Rejected</option>
// //                 <option value="Expired">Expired</option>
// //               </select>
// //             </div>
// //             <div className="quotationCRM-input-box">
// //               <label htmlFor="quotation_type">Quotation Type</label>
// //               <select
// //                 id="quotation_type"
// //                 value={seleQuotationType}
// //                 onChange={(e) => setseleQuotationType(e.target.value)}
// //               >
// //                 <option value="">All</option>
// //                 <option value="Standard">Standard</option>
// //                 <option value="Blanket">Blanket</option>
// //                 <option value="Service">Service</option>
// //               </select>
// //             </div>

// //             <div className="quotationCRM-input-box">
// //               <label htmlFor="sales_rep">Sales Rep</label>
// //               <select
// //                 id="sales_rep"
// //                 value={selectSales}
// //                 onChange={(e) => setselectSales(e.target.value)}
// //               >
// //                 <option value="">All</option>
// //                 {searchSalseRep.map((ele, ind) => (
// //                   <option key={ind} value={ele}>
// //                     {ele}
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>
// //           </div>
// //           <div className="quotationCRM-table-cointainer">
// //             <table>
// //               <thead className="quotationCRM-thead">
// //                 <tr>
// //                   <th id="quotationCRM-table-max-width">Quotation ID</th>
// //                   <th id="quotationCRM-table-max-width">Quotation Type</th>
// //                   <th id="quotationCRM-table-max-width">Customer Name</th>
// //                   <th id="quotationCRM-table-min-width">Sales Rep</th>
// //                   <th id="quotationCRM-table-max-width">Quotation Date</th>
// //                   <th>Status</th>
// //                   <th id="quotationCRM-table-min-width">Grand Total</th>
// //                   <th>Action</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="quotationCRM-tbody">
// //                 {currentData.length > 0 ? (
// //                   currentData.map((ele, ind) => (
// //                     <tr key={ind}>
// //                       <td id="quotationCRM-table-max-width">
// //                         {ele.quotation_id}
// //                       </td>
// //                       <td id="quotationCRM-table-max-width">
// //                         {ele.quotation_type}
// //                       </td>
// //                       <td id="quotationCRM-table-max-width">
// //                         {ele.customer_name}
// //                       </td>
// //                       <td id="quotationCRM-table-min-width">{ele.sales_rep}</td>
// //                       <td id="quotationCRM-table-max-width">
// //                         {ele.quotation_date}
// //                       </td>
// //                       <td>
// //                         <div
// //                           className={`quotationCRM-status ${
// //                             ele.status === "Draft"
// //                               ? "quotationCRM-status-Draft"
// //                               : ele.status === "Send"
// //                               ? "quotationCRM-status-Send"
// //                               : ele.status === "Approved"
// //                               ? "quotationCRM-status-Approved"
// //                               : ele.status === "Rejected"
// //                               ? "quotationCRM-status-Rejected"
// //                               : ele.status === "Expired"
// //                               ? "quotationCRM-status-Expired"
// //                               : ""
// //                           }`}
// //                         >
// //                           {ele.status}
// //                         </div>
// //                       </td>
// //                       <td id="quotationCRM-table-min-width">
// //                         {ele.grand_total}
// //                       </td>
// //                       <td>
// //                         <div
// //                           className="quotationCRM-table-view"
// //                           onClick={() => {
// //                             showEditQuotation(ele.id);
// //                             setshowEditNewQuotation(true);
// //                           }}
// //                         >
// //                           {ele.status === "Draft" ? "Edit" : "View"}
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   ))
// //                 ) : (
// //                   <tr>
// //                     <td>No Data Found</td>
// //                   </tr>
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>
// //           <nav className="quotationCRM-table-bottem">
// //             <p className="quotationCRM-num-entries">
// //               Showing {currentData.length} entries
// //             </p>
// //             <div className="quotationCRM-manage-control-box">
// //               <button
// //                 className="quotationCRM-manage-btn"
// //                 onClick={handlePrev}
// //                 disabled={quotationCurrentPage === 1}
// //               >
// //                 Prev
// //               </button>
// //               <nav className="quotationCRM-num-page">
// //                 {" "}
// //                 Page {quotationCurrentPage} of {totalPages}{" "}
// //               </nav>
// //               <button
// //                 className="quotationCRM-manage-btn"
// //                 onClick={handleNext}
// //                 disabled={quotationCurrentPage === totalPages}
// //               >
// //                 Next
// //               </button>
// //             </div>
// //           </nav>
// //         </div>
// //       )}
// //     </>
// //   );
// // }
// import React, { useState, useEffect } from "react";
// import "./quotationCRM.css";
// import CreateNewQuotation from "../create-new-quotation/createNewQuotation";
// import CreateNewQuotationEdit from "../create-new-quotation/createNewQuotationEdit";
// import useQuotationStore from "./quotationStore";

// export default function Quotation() {
//   const {
//     fetchQuotations,
//     quotations,
//     loading,
//     currentPage,
//     totalPages,
//     search,
//     setSearch,
//   } = useQuotationStore();

//   const [selectStatus, setselectStatus] = useState("");
//   const [seleQuotationType, setseleQuotationType] = useState("");
//   const [selectSales, setselectSales] = useState("");

//   const [showNewQuotation, setshowNewQuotation] = useState(false);
//   const [showEditNewQuotation, setshowEditNewQuotation] = useState(false);
//   const [editQuotationData, setEditQuotationData] = useState({});

//   // ✅ Fetch on mount
//   useEffect(() => {
//     fetchQuotations();
//   }, [fetchQuotations]);

//   const handleNext = () => {
//     if (currentPage < totalPages) {
//       fetchQuotations(currentPage + 1, search);
//     }
//   };

//   const handlePrev = () => {
//     if (currentPage > 1) {
//       fetchQuotations(currentPage - 1, search);
//     }
//   };

//   const showEditQuotation = (id) => {
//     const found = quotations.find((ele) => ele.id === id);
//     if (found) setEditQuotationData(found);
//   };

//   const handleCloseCreate = () => {
//     setshowNewQuotation(false);
//     fetchQuotations(currentPage, search); // ✅ Refresh after create
//   };

//   const handleCloseEdit = () => {
//     setshowEditNewQuotation(false);
//     setEditQuotationData({});
//     fetchQuotations(currentPage, search); // ✅ Refresh after edit
//   };

//   function resetSearchBox() {
//     setselectSales("");
//     setseleQuotationType("");
//     setselectStatus("");
//     setSearch("");
//     fetchQuotations(1, "");
//   }

//   // ✅ Client-side filter for status, type, sales rep
//   const filteredQuotations = quotations.filter((ele) => {
//     const matchStatus = selectStatus ? ele.status === selectStatus : true;
//     const matchType = seleQuotationType ? ele.quotation_type === seleQuotationType : true;
//     const matchSales = selectSales ? ele.sales_rep === selectSales : true;
//     return matchStatus && matchType && matchSales;
//   });

//   // ✅ Unique sales reps from current data
//   const salesReps = [...new Set(quotations.map((q) => q.sales_rep).filter(Boolean))];

//   return (
//     <>
//       {showNewQuotation ? (
//         <CreateNewQuotation
//           setshowNewQuotation={handleCloseCreate}
//           showEditNewQuotation={showEditNewQuotation}
//           setEditQuotationData={setEditQuotationData}
//         />
//       ) : showEditNewQuotation ? (
//         <CreateNewQuotationEdit
//           setshowNewQuotation={handleCloseEdit}
//           showEditNewQuotation={showEditNewQuotation}
//           editQuotationData={editQuotationData}
//           setEditQuotationData={setEditQuotationData}
//         />
//       ) : (
//         <div className="quotationCRM-container">
//           <div className="quotationCRM-header">
//             <p>Quotation</p>
//             <button onClick={() => setshowNewQuotation(true)}>
//               + Add New Quotation
//             </button>
//           </div>

//           {/* Search */}
//           <div className="quotationCRM-search-box">
//             <label htmlFor="searchByID">
//               <svg
//                 className="quotationCRM-search-logo"
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 512 512"
//               >
//                 <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
//               </svg>
//             </label>
//             <input
//               id="searchByID"
//               placeholder="Search by ID, Name..."
//               value={search}
//               onChange={(e) => {
//                 setSearch(e.target.value);
//                 fetchQuotations(1, e.target.value);
//               }}
//             />
//           </div>

//           <div className="quotationCRM-clearfilter">
//             <p onClick={resetSearchBox}>Clear Filter</p>
//           </div>

//           {/* Filters */}
//           <div className="quotationCRM-search-category">
//             <div className="quotationCRM-input-box">
//               <label htmlFor="status">Status</label>
//               <select
//                 id="status"
//                 value={selectStatus}
//                 onChange={(e) => setselectStatus(e.target.value)}
//               >
//                 <option value="">All</option>
//                 <option value="Draft">Draft</option>
//                 <option value="Send">Send</option>
//                 <option value="Approved">Approved</option>
//                 <option value="Rejected">Rejected</option>
//                 <option value="Expired">Expired</option>
//               </select>
//             </div>
//             <div className="quotationCRM-input-box">
//               <label htmlFor="quotation_type">Quotation Type</label>
//               <select
//                 id="quotation_type"
//                 value={seleQuotationType}
//                 onChange={(e) => setseleQuotationType(e.target.value)}
//               >
//                 <option value="">All</option>
//                 <option value="Standard">Standard</option>
//                 <option value="Blanket">Blanket</option>
//                 <option value="Service">Service</option>
//               </select>
//             </div>
//             <div className="quotationCRM-input-box">
//               <label htmlFor="sales_rep">Sales Rep</label>
//               <select
//                 id="sales_rep"
//                 value={selectSales}
//                 onChange={(e) => setselectSales(e.target.value)}
//               >
//                 <option value="">All</option>
//                 {salesReps.map((rep, ind) => (
//                   <option key={ind} value={rep}>
//                     {rep}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Table */}
//           <div className="quotationCRM-table-cointainer">
//             <table>
//               <thead className="quotationCRM-thead">
//                 <tr>
//                   <th id="quotationCRM-table-max-width">Quotation ID</th>
//                   <th id="quotationCRM-table-max-width">Quotation Type</th>
//                   <th id="quotationCRM-table-max-width">Customer Name</th>
//                   <th id="quotationCRM-table-min-width">Sales Rep</th>
//                   <th id="quotationCRM-table-max-width">Quotation Date</th>
//                   <th>Status</th>
//                   <th id="quotationCRM-table-min-width">Grand Total</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody className="quotationCRM-tbody">
//                 {loading ? (
//                   <tr>
//                     <td colSpan="8" style={{ textAlign: "center" }}>Loading...</td>
//                   </tr>
//                 ) : filteredQuotations.length > 0 ? (
//                   filteredQuotations.map((ele, ind) => (
//                     <tr key={ele.id || ind}>
//                       <td id="quotationCRM-table-max-width">{ele.quotation_id}</td>
//                       <td id="quotationCRM-table-max-width">{ele.quotation_type}</td>
//                       <td id="quotationCRM-table-max-width">{ele.customer_name}</td>
//                       <td id="quotationCRM-table-min-width">{ele.sales_rep}</td>
//                       <td id="quotationCRM-table-max-width">{ele.quotation_date}</td>
//                       <td>
//                         <div
//                           className={`quotationCRM-status ${
//                             ele.status === "Draft"
//                               ? "quotationCRM-status-Draft"
//                               : ele.status === "Send"
//                               ? "quotationCRM-status-Send"
//                               : ele.status === "Approved"
//                               ? "quotationCRM-status-Approved"
//                               : ele.status === "Rejected"
//                               ? "quotationCRM-status-Rejected"
//                               : ele.status === "Expired"
//                               ? "quotationCRM-status-Expired"
//                               : ""
//                           }`}
//                         >
//                           {ele.status}
//                         </div>
//                       </td>
//                       <td id="quotationCRM-table-min-width">{ele.grand_total}</td>
//                       <td>
//                         <div
//                           className="quotationCRM-table-view"
//                           onClick={() => {
//                             showEditQuotation(ele.id);
//                             setshowEditNewQuotation(true);
//                           }}
//                         >
//                           {ele.status === "Draft" ? "Edit" : "View"}
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="8" style={{ textAlign: "center" }}>No Data Found</td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <nav className="quotationCRM-table-bottem">
//             <p className="quotationCRM-num-entries">
//               Showing {filteredQuotations.length} entries
//             </p>
//             <div className="quotationCRM-manage-control-box">
//               <button
//                 className="quotationCRM-manage-btn"
//                 onClick={handlePrev}
//                 disabled={currentPage <= 1}
//               >
//                 Prev
//               </button>
//               <nav className="quotationCRM-num-page">
//                 Page {currentPage} of {totalPages}
//               </nav>
//               <button
//                 className="quotationCRM-manage-btn"
//                 onClick={handleNext}
//                 disabled={currentPage >= totalPages}
//               >
//                 Next
//               </button>
//             </div>
//           </nav>
//         </div>
//       )}
//     </>
//   );
// }
// import React, { useState, useEffect } from "react";
// import "./quotationCRM.css";
// import CreateNewQuotation from "../create-new-quotation/createNewQuotation";
// import CreateNewQuotationEdit from "../create-new-quotation/createNewQuotationEdit";

// export default function quotation() {
//   const [status, setStatus] = useState("");

//   console.log(status);

//   const [selectStatus, setselectStatus] = useState("");
//   const [seleQuotationType, setseleQuotationType] = useState("");
//   const [selectSales, setselectSales] = useState("");

//   const [quotationCurrentPage, setquotationCurrentPage] = useState(1);
//   const quotationRowPerPage = 10;

//   const [showNewQuotation, setshowNewQuotation] = useState(false);
//   const [showEditNewQuotation, setshowEditNewQuotation] = useState(false);
//   const [editQuotationData, setEditQuotationData] = useState({});

//   const [ApiQuotation, setApiQuotation] = useState({});
//   const [quotation, setQuotation] = useState([]);
//   const [searchSalseRep, setsearchSalseRep] = useState([]);
//   const quotationFromAPI = {
//     quotation: [
//       {
//         id: "1",
//         quotation_id: "QUO0001",
//         quotation_type: "Service",
//         customer_name: "Mandy",
//         sales_rep: "Sans",
//         quotation_date: "2025-10-10",
//         status: "Draft",
//         currency: "USD",
//         revise_count: 1,
//         grand_total: "50000",
//         product_id: "PRO0005",
//         description: "M-shirt",
//         uom: "Set (5)",
//         unit_price: "130",
//         discount: "5",
//         tax: "12",
//         quantity: "50",
//       },

//       {
//         id: "2",
//         quotation_id: "QUO0002",
//         quotation_type: "Service",
//         customer_name: "Mandy",
//         sales_rep: "Sans",
//         quotation_date: "2025-10-10",
//         status: "Send",
//         revise_count: 2,
//         grand_total: "50000",
//         products: [
//           {
//             product_id: "PRO0005",
//             description: "M-shirt",
//             uom: "Set (5)",
//             unit_price: "5",
//             discount: "5",
//             tax: "18",
//             quantity: "9",
//           },
//           {
//             product_id: "PRO0005",
//             description: "M-shirt",
//             uom: "Set (5)",
//             unit_price: "5",
//             discount: "5",
//             tax: "18",
//             quantity: "9",
//           },
//         ],
//       },
//       {
//         id: "3",
//         quotation_id: "QUO0003",
//         quotation_type: "Service",
//         customer_name: "Sans",
//         sales_rep: "Sans",
//         quotation_date: "2025-10-10",
//         status: "Rejected",
//         grand_total: "50000",
//         product_id: "PRO0005",
//         description: "M-shirt",
//         uom: "Set (5)",
//         unit_price: "130",
//         discount: "5",
//         tax: "12",
//         quantity: "5",
//       },
//       {
//         id: "4",
//         quotation_id: "QUO0004",
//         quotation_type: "Service",
//         customer_name: "Mandy",
//         sales_rep: "Sans",
//         quotation_date: "2025-10-10",
//         status: "Approved",
//         grand_total: "50000",
//       },
//       {
//         id: "5",
//         quotation_id: "QUO0005",
//         quotation_type: "Service",
//         customer_name: "Naveen",
//         sales_rep: "Sans",
//         quotation_date: "2025-10-10",
//         status: "Expired",
//         grand_total: "50000",
//       },
//       {
//         id: "6",
//         quotation_id: "QUO0006",
//         quotation_type: "Service",
//         customer_name: "rahul",
//         sales_rep: "Sans",
//         quotation_date: "2025-10-10",
//         status: "Expired",
//         grand_total: "50000",
//       },
//       {
//         id: "7",
//         quotation_id: "QUO0007",
//         quotation_type: "Service",
//         customer_name: "Mandy",
//         sales_rep: "Sans",
//         quotation_date: "2025-10-10",
//         status: "Draft",
//         revise_count: 5,
//         grand_total: "50000",
//       },
//     ],
//     searchSalseRep: ["Michael", "Harish", "Michael"],
//   };
//   useEffect(() => {
//     setApiQuotation(quotationFromAPI);
//   }, []);
//   useEffect(() => {
//     if (Object.keys(ApiQuotation).length) {
//       setQuotation(ApiQuotation.quotation);
//       setsearchSalseRep(ApiQuotation.searchSalseRep);
//     }
//   }, [ApiQuotation]);

//   //page calculation
//   const totalPages = Math.ceil(quotation.length / quotationRowPerPage);

//   const currentData = quotation.slice(
//     (quotationCurrentPage - 1) * quotationRowPerPage,
//     quotationCurrentPage * quotationRowPerPage
//   );

//   const handleNext = () => {
//     if (quotationCurrentPage < totalPages) {
//       setquotationCurrentPage((prev) => prev + 1);
//     }
//   };
//   const handlePrev = () => {
//     if (quotationCurrentPage > 1) {
//       setquotationCurrentPage((prev) => prev - 1);
//     }
//   };

//   const showEditQuotation = (id) => {
//     setEditQuotationData(
//       currentData.find((ele) => {
//         return ele.id === id;
//       })
//     );
//   };
//   function resetSearchBox() {
//     setselectSales("");
//     setseleQuotationType("");
//     setselectStatus("");
//     console.log(seleQuotationType, selectSales, selectStatus);
//   }

//   return (
//     <>
//       {showNewQuotation ? (
//         <CreateNewQuotation
//           setshowNewQuotation={setshowNewQuotation}
//           showEditNewQuotation={showEditNewQuotation}
//           setEditQuotationData={setEditQuotationData}
//           status={status}
//           setStatus={setStatus}
//         />
//       ) : showEditNewQuotation ? (
//         <CreateNewQuotationEdit
//           setshowNewQuotation={setshowEditNewQuotation}
//           showEditNewQuotation={showEditNewQuotation}
//           editQuotationData={editQuotationData}
//           setEditQuotationData={setEditQuotationData}
//           status={status}
//           setStatus={setStatus}
//         />
//       ) : (
//         <div className="quotationCRM-container">
//           <div className="quotationCRM-header">
//             <p>Quotation</p>
//             <button onClick={() => setshowNewQuotation(true)}>
//               + Add New Quotation
//             </button>
//           </div>
//           <div className="quotationCRM-search-box">
//             <label htmlFor="searchByID">
//               <svg
//                 className="quotationCRM-search-logo"
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 512 512"
//               >
//                 <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
//               </svg>
//             </label>
//             <input id="searchByID" placeholder="Search by ID,Name..." />
//           </div>
//           <div className="quotationCRM-clearfilter">
//             <p onClick={resetSearchBox}>Clear Filter</p>
//           </div>
//           <div className="quotationCRM-search-category">
//             <div className="quotationCRM-input-box">
//               <label htmlFor="status">Status</label>
//               <select
//                 id="status"
//                 value={selectStatus}
//                 onChange={(e) => setselectStatus(e.target.value)}
//               >
//                 <option value="">All</option>
//                 <option value="Draft">Draft</option>
//                 <option value="Send">Send</option>
//                 <option value="Approved">Approved</option>
//                 <option value="Rejected">Rejected</option>
//                 <option value="Expired">Expired</option>
//               </select>
//             </div>
//             <div className="quotationCRM-input-box">
//               <label htmlFor="quotation_type">Quotation Type</label>
//               <select
//                 id="quotation_type"
//                 value={seleQuotationType}
//                 onChange={(e) => setseleQuotationType(e.target.value)}
//               >
//                 <option value="">All</option>
//                 <option value="Standard">Standard</option>
//                 <option value="Blanket">Blanket</option>
//                 <option value="Service">Service</option>
//               </select>
//             </div>

//             <div className="quotationCRM-input-box">
//               <label htmlFor="sales_rep">Sales Rep</label>
//               <select
//                 id="sales_rep"
//                 value={selectSales}
//                 onChange={(e) => setselectSales(e.target.value)}
//               >
//                 <option value="">All</option>
//                 {searchSalseRep.map((ele, ind) => (
//                   <option key={ind} value={ele}>
//                     {ele}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//           <div className="quotationCRM-table-cointainer">
//             <table>
//               <thead className="quotationCRM-thead">
//                 <tr>
//                   <th id="quotationCRM-table-max-width">Quotation ID</th>
//                   <th id="quotationCRM-table-max-width">Quotation Type</th>
//                   <th id="quotationCRM-table-max-width">Customer Name</th>
//                   <th id="quotationCRM-table-min-width">Sales Rep</th>
//                   <th id="quotationCRM-table-max-width">Quotation Date</th>
//                   <th>Status</th>
//                   <th id="quotationCRM-table-min-width">Grand Total</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody className="quotationCRM-tbody">
//                 {currentData.length > 0 ? (
//                   currentData.map((ele, ind) => (
//                     <tr key={ind}>
//                       <td id="quotationCRM-table-max-width">
//                         {ele.quotation_id}
//                       </td>
//                       <td id="quotationCRM-table-max-width">
//                         {ele.quotation_type}
//                       </td>
//                       <td id="quotationCRM-table-max-width">
//                         {ele.customer_name}
//                       </td>
//                       <td id="quotationCRM-table-min-width">{ele.sales_rep}</td>
//                       <td id="quotationCRM-table-max-width">
//                         {ele.quotation_date}
//                       </td>
//                       <td>
//                         <div
//                           className={`quotationCRM-status ${
//                             ele.status === "Draft"
//                               ? "quotationCRM-status-Draft"
//                               : ele.status === "Send"
//                               ? "quotationCRM-status-Send"
//                               : ele.status === "Approved"
//                               ? "quotationCRM-status-Approved"
//                               : ele.status === "Rejected"
//                               ? "quotationCRM-status-Rejected"
//                               : ele.status === "Expired"
//                               ? "quotationCRM-status-Expired"
//                               : ""
//                           }`}
//                         >
//                           {ele.status}
//                         </div>
//                       </td>
//                       <td id="quotationCRM-table-min-width">
//                         {ele.grand_total}
//                       </td>
//                       <td>
//                         <div
//                           className="quotationCRM-table-view"
//                           onClick={() => {
//                             showEditQuotation(ele.id);
//                             setshowEditNewQuotation(true);
//                           }}
//                         >
//                           {ele.status === "Draft" ? "Edit" : "View"}
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td>No Data Found</td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//           <nav className="quotationCRM-table-bottem">
//             <p className="quotationCRM-num-entries">
//               Showing {currentData.length} entries
//             </p>
//             <div className="quotationCRM-manage-control-box">
//               <button
//                 className="quotationCRM-manage-btn"
//                 onClick={handlePrev}
//                 disabled={quotationCurrentPage === 1}
//               >
//                 Prev
//               </button>
//               <nav className="quotationCRM-num-page">
//                 {" "}
//                 Page {quotationCurrentPage} of {totalPages}{" "}
//               </nav>
//               <button
//                 className="quotationCRM-manage-btn"
//                 onClick={handleNext}
//                 disabled={quotationCurrentPage === totalPages}
//               >
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
import "./quotationCRM.css";
import CreateNewQuotation from "../create-new-quotation/createNewQuotation";
import useQuotationStore from "./quotationStore";
import quotationApiProvider from "../../../network/quotation-api-provider";

export default function QuotationCRM() {
  const {
    fetchQuotations,
    quotations,
    loading,
    currentPage,
    totalPages,
    search,
    setSearch,
  } = useQuotationStore();

  const [selectStatus,       setselectStatus]       = useState("");
  const [seleQuotationType,  setseleQuotationType]  = useState("");
  const [selectSales,        setselectSales]        = useState("");

  // ── unified create/edit state ─────────────────────────────────────────────
  const [showForm,          setShowForm]          = useState(false);
  const [editQuotationData, setEditQuotationData] = useState({});
  const [isEditMode,        setIsEditMode]        = useState(false);

  // ── kebab menu ────────────────────────────────────────────────────────────
  const [openMenuId,      setOpenMenuId]      = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget,    setDeleteTarget]    = useState(null);

  useEffect(() => {
    fetchQuotations(1, "");
  }, []);

  useEffect(() => {
    const close = () => setOpenMenuId(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  // ── open create ───────────────────────────────────────────────────────────
  function handleCreate() {
    setEditQuotationData({});
    setIsEditMode(false);
    setShowForm(true);
  }

  // ── open edit/view ────────────────────────────────────────────────────────
  function handleEdit(ele) {
    setOpenMenuId(null);
    setEditQuotationData(ele);
    setIsEditMode(true);
    setShowForm(true);
  }

  // ── close form and refresh ────────────────────────────────────────────────
  function handleCloseForm() {
    setShowForm(false);
    setEditQuotationData({});
    setIsEditMode(false);
    fetchQuotations(currentPage, search);
  }

  // ── delete ────────────────────────────────────────────────────────────────
  function handleDeleteClick(ele) {
    setOpenMenuId(null);
    setDeleteTarget(ele);
    setShowDeleteModal(true);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await quotationApiProvider.deleteQuotation(deleteTarget.id);
    fetchQuotations(currentPage, search);
    setShowDeleteModal(false);
    setDeleteTarget(null);
  }

  // ── pagination ────────────────────────────────────────────────────────────
  const handleNext = () => {
    if (currentPage < totalPages) fetchQuotations(currentPage + 1, search);
  };
  const handlePrev = () => {
    if (currentPage > 1) fetchQuotations(currentPage - 1, search);
  };

  function resetFilters() {
    setselectSales("");
    setseleQuotationType("");
    setselectStatus("");
    setSearch("");
    fetchQuotations(1, "");
  }

  // ── client-side filter ────────────────────────────────────────────────────
  const filteredQuotations = quotations.filter((ele) => {
    const matchStatus = selectStatus       ? ele.status         === selectStatus       : true;
    const matchType   = seleQuotationType  ? ele.quotation_type === seleQuotationType  : true;
    const matchSales  = selectSales        ? ele.sales_rep      === selectSales        : true;
    return matchStatus && matchType && matchSales;
  });

  const salesReps = [...new Set(quotations.map((q) => q.sales_rep).filter(Boolean))];

  // ── show form ─────────────────────────────────────────────────────────────
  if (showForm) {
    return (
      <CreateNewQuotation
        setshowNewQuotation={handleCloseForm}
        editQuotationData={editQuotationData}
        isEdit={isEditMode}
      />
    );
  }

  return (
    <>
      {/* ── Delete Modal ──────────────────────────────────────────────── */}
      {showDeleteModal && (
        <>
          <div
            onClick={() => setShowDeleteModal(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 999 }}
          />
          <div style={{
            position: "fixed", top: "50%", left: "50%",
            transform: "translate(-50%,-50%)", background: "#fff",
            borderRadius: "10px", width: "400px", padding: "28px 24px",
            zIndex: 1000, boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          }}>
            <p style={{ fontWeight: 600, fontSize: "17px", textAlign: "center", marginBottom: "14px" }}>
              Delete Quotation
            </p>
            <p style={{ textAlign: "center", fontSize: "14px", lineHeight: "22px", marginBottom: "24px", color: "#444" }}>
              Are you sure you want to delete <br />
              <strong>{deleteTarget?.quotation_id}</strong>
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{ padding: "8px 24px", borderRadius: "6px", border: "1px solid #ccc", background: "#f5f5f5", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                style={{ padding: "8px 24px", borderRadius: "6px", border: "none", background: "#e53935", color: "#fff", cursor: "pointer" }}
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Main List ─────────────────────────────────────────────────── */}
      <div className="quotationCRM-container">

        <div className="quotationCRM-header">
          <p>Quotation</p>
          <button onClick={handleCreate}>+ Add New Quotation</button>
        </div>

        {/* Search */}
        <div className="quotationCRM-search-box">
          <label htmlFor="searchByID">
            <svg className="quotationCRM-search-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
            </svg>
          </label>
          <input
            id="searchByID"
            placeholder="Search by Quotation ID, Customer..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); fetchQuotations(1, e.target.value); }}
          />
        </div>

        <div className="quotationCRM-clearfilter">
          <p onClick={resetFilters}>Clear Filter</p>
        </div>

        {/* Filters */}
        <div className="quotationCRM-search-category">
          <div className="quotationCRM-input-box">
            <label>Status</label>
            <select value={selectStatus} onChange={(e) => setselectStatus(e.target.value)}>
              <option value="">All</option>
              <option value="Draft">Draft</option>
              <option value="Submitted">Submitted</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Expired">Expired</option>
              <option value="Converted (SO)">Converted (SO)</option>
            </select>
          </div>
          <div className="quotationCRM-input-box">
            <label>Quotation Type</label>
            <select value={seleQuotationType} onChange={(e) => setseleQuotationType(e.target.value)}>
              <option value="">All</option>
              <option value="Standard">Standard</option>
              <option value="Blanket">Blanket</option>
              <option value="Service">Service</option>
            </select>
          </div>
          <div className="quotationCRM-input-box">
            <label>Sales Rep</label>
            <select value={selectSales} onChange={(e) => setselectSales(e.target.value)}>
              <option value="">All</option>
              {salesReps.map((rep, ind) => (
                <option key={ind} value={rep}>{rep}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="quotationCRM-table-cointainer">
          <table>
            <thead className="quotationCRM-thead">
              <tr>
                <th>S.No.</th>
                <th id="quotationCRM-table-max-width">Quotation ID</th>
                <th id="quotationCRM-table-max-width">Quotation Type</th>
                <th id="quotationCRM-table-max-width">Customer Name</th>
                <th id="quotationCRM-table-min-width">Sales Rep</th>
                <th id="quotationCRM-table-max-width">Quotation Date</th>
                <th>Status</th>
                <th id="quotationCRM-table-min-width">Grand Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="quotationCRM-tbody">
              {loading ? (
                <tr><td colSpan={9} style={{ textAlign: "center", padding: "20px" }}>Loading...</td></tr>
              ) : filteredQuotations.length > 0 ? (
                filteredQuotations.map((ele, ind) => (
                  <tr key={ele.id || ind}>
                    <td>{(currentPage - 1) * 10 + ind + 1}</td>
                    <td id="quotationCRM-table-max-width">{ele.quotation_id}</td>
                    <td id="quotationCRM-table-max-width">{ele.quotation_type}</td>
                    <td id="quotationCRM-table-max-width">
                      {ele.customer?.first_name
                        ? `${ele.customer.first_name} ${ele.customer.last_name || ""}`.trim()
                        : "—"}
                    </td>
                    <td id="quotationCRM-table-min-width">{ele.sales_rep}</td>
                    <td id="quotationCRM-table-max-width">{ele.quotation_date}</td>
                    <td>
                      <div className={`quotationCRM-status ${
                        ele.status === "Draft"          ? "quotationCRM-status-Draft"     :
                        ele.status === "Submitted"      ? "quotationCRM-status-Send"      :
                        ele.status === "Approved"       ? "quotationCRM-status-Approved"  :
                        ele.status === "Rejected"       ? "quotationCRM-status-Rejected"  :
                        ele.status === "Expired"        ? "quotationCRM-status-Expired"   :
                        ele.status === "Converted (SO)" ? "quotationCRM-status-Approved"  : ""
                      }`}>
                        {ele.status}
                      </div>
                    </td>
                    <td id="quotationCRM-table-min-width">{ele.grand_total}</td>

                    {/* ── Kebab Action Menu ──────────────────────────── */}
                    <td style={{ position: "relative", textAlign: "center" }}>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === ele.id ? null : ele.id);
                        }}
                        style={{
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer",
                          background: openMenuId === ele.id ? "#f0f0f0" : "transparent",
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                          style={{ width: "18px", height: "18px", fill: "#555" }}>
                          <path d="M12 16C12.5304 16 13.0391 16.2107 13.4142 16.5858C13.7893 16.9609 14 17.4696 14 18C14 18.5304 13.7893 19.0391 13.4142 19.4142C13.0391 19.7893 12.5304 20 12 20C11.4696 20 10.9609 19.7893 10.5858 19.4142C10.2107 19.0391 10 18.5304 10 18C10 17.4696 10.2107 16.9609 10.5858 16.5858C10.9609 16.2107 11.4696 16 12 16ZM12 10C12.5304 10 13.0391 10.2107 13.4142 10.5858C13.7893 10.9609 14 11.4696 14 12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14C11.4696 14 10.9609 13.7893 10.5858 13.4142C10.2107 13.0391 10 12.5304 10 12C10 11.4696 10.2107 10.9609 10.5858 10.5858C10.9609 10.2107 11.4696 10 12 10ZM12 4C12.5304 4 13.0391 4.21071 13.4142 4.58579C13.7893 4.96086 14 5.46957 14 6C14 6.53043 13.7893 7.03914 13.4142 7.41421C13.0391 7.78929 12.5304 8 12 8C11.4696 8 10.9609 7.78929 10.5858 7.41421C10.2107 7.03914 10 6.53043 10 6C10 5.46957 10.2107 4.96086 10.5858 4.58579C10.9609 4.21071 11.4696 4 12 4Z" />
                        </svg>
                      </div>

                      {openMenuId === ele.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            position: "absolute", top: "38px", right: "8px",
                            background: "#fff", border: "1px solid #e0e0e0",
                            borderRadius: "8px", boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                            zIndex: 999, minWidth: "160px", overflow: "hidden",
                          }}
                        >
                          {/* Edit / View */}
                          <div
                            onClick={() => handleEdit(ele)}
                            style={{ padding: "10px 16px", cursor: "pointer", fontSize: "14px", color: "#333" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            {ele.status === "Draft" ? "✏️ Edit" : "👁️ View"} Details
                          </div>

                          <div style={{ height: "1px", background: "#f0f0f0" }} />

                          {/* Delete — only for Draft */}
                          <div
                            onClick={() => {
                              if (ele.status === "Draft") handleDeleteClick(ele);
                            }}
                            style={{
                              padding: "10px 16px", fontSize: "14px",
                              cursor:  ele.status === "Draft" ? "pointer"     : "not-allowed",
                              color:   ele.status === "Draft" ? "#e53935"     : "#bbb",
                            }}
                            onMouseEnter={(e) => {
                              if (ele.status === "Draft")
                                e.currentTarget.style.background = "#fff5f5";
                            }}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            🗑️ Delete
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={9} style={{ textAlign: "center", padding: "20px" }}>No Data Found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <nav className="quotationCRM-table-bottem">
          <p className="quotationCRM-num-entries">
            Showing {filteredQuotations.length} entries
          </p>
          <div className="quotationCRM-manage-control-box">
            <button className="quotationCRM-manage-btn" onClick={handlePrev} disabled={currentPage <= 1}>
              Prev
            </button>
            <nav className="quotationCRM-num-page">
              Page {currentPage} of {totalPages}
            </nav>
            <button className="quotationCRM-manage-btn" onClick={handleNext} disabled={currentPage >= totalPages}>
              Next
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}