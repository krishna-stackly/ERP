// // import React, { useEffect, useState } from "react";
// // import "./customMaster.css";
// // import { useCustomerStore } from "./customerStore";

// // import CreateNewCustomer from "./createNewCustomer";
// // import CustomImport from "../custom-Import/customImport";
// // import CustomDuplicates from "../custom-merge-duplicates/customDuplicates";

// // export default function CustomMaster() {
// //   const {
// //     customers,
// //     totalPages,
// //     loading,
// //     filters,
// //     setFilter,
// //     fetchCustomers,
// //     deleteCustomer,
// //   } = useCustomerStore();

// //   const {
// //     page,
// //     per_page,
// //     status,
// //     customer_type,
// //     assigned_sales_rep,
// //     search,
// //   } = filters;

// //   // Load customers when filters change
// //   useEffect(() => {
// //     console.log("🎯 Effect triggered with filters:", filters);
// //     fetchCustomers();
// //   }, [page, per_page, status, customer_type, assigned_sales_rep, search]);

// //   // Modal States
// //   const [showAddCustomer, setShowAddCustomer] = useState(false);
// //   const [showCustomImport, setShowCustomImport] = useState(false);
// //   const [showCustomDuplicates, setShowCustomDuplicates] = useState(false);
// //   const [editShowAddCustom, setEditShowAddCustom] = useState(false);
// //   const [editAddCustomData, setEditAddCustomData] = useState({});

// //   // Close modal and refresh
// //   const handleCloseAddCustomer = () => {
// //     setShowAddCustomer(false);
// //     fetchCustomers(); // Refresh after adding
// //   };

// //   const handleCloseEditCustomer = () => {
// //     setEditShowAddCustom(false);
// //     setEditAddCustomData({});
// //     fetchCustomers(); // Refresh after editing
// //   };

// //   const resetSearchBox = () => {
// //     setFilter("page", 1);
// //     setFilter("status", "");
// //     setFilter("customer_type", "");
// //     setFilter("assigned_sales_rep", "");
// //     setFilter("search", "");
// //   };

// //   return (
// //     <>
// //       {/* Modals */}
// //       {showAddCustomer ? (
// //         <CreateNewCustomer setShowAddCustomer={handleCloseAddCustomer} />
// //       ) : editShowAddCustom ? (
// //         <CreateNewCustomer
// //           setShowAddCustomer={handleCloseEditCustomer}
// //           editShowAddCustom={editShowAddCustom}
// //           editAddCustomData={editAddCustomData}
// //           setEditAddCustomData={setEditAddCustomData}
// //         />
// //       ) : showCustomImport ? (
// //         <CustomImport setShowCustomImport={setShowCustomImport} />
// //       ) : showCustomDuplicates ? (
// //         <CustomDuplicates
// //           setShowCustomDuplicates={setShowCustomDuplicates}
// //           customMaster={customers}
// //         />
// //       ) : (
// //         <div className="customMaster-container">
// //           <div className="customMaster-header">
// //             <p>Customer Master</p>
// //             <nav>
// //               <button onClick={() => setShowAddCustomer(true)}>+ Add New Customer</button>
// //               <button onClick={() => setShowCustomImport(true)}>Import</button>
// //               <button onClick={() => setShowCustomDuplicates(true)}>Merge Duplicates</button>
// //             </nav>
// //           </div>

// //           {/* Search */}
// //           <div className="customMaster-search-box">
// //             <input
// //               placeholder="Search by Customer..."
// //               value={search}
// //               onChange={(e) => {
// //                 setFilter("search", e.target.value);
// //                 setFilter("page", 1); // Reset to page 1 on search
// //               }}
// //             />
// //           </div>

// //           <div className="customMaster-clearfilter">
// //             <p onClick={resetSearchBox}>Clear Filter</p>
// //           </div>

// //           {/* Filters */}
// //           <div className="customMaster-search-category">
// //             <div className="customMaster-input-box">
// //               <label>Status</label>
// //               <select
// //                 value={status}
// //                 onChange={(e) => {
// //                   setFilter("status", e.target.value);
// //                   setFilter("page", 1); // Reset to page 1 on filter change
// //                 }}
// //               >
// //                 <option value="">All</option>
// //                 <option value="Active">Active</option>
// //                 <option value="Inactive">Inactive</option>
// //               </select>
// //             </div>

// //             <div className="customMaster-input-box">
// //               <label>Customer Type</label>
// //               <select
// //                 value={customer_type}
// //                 onChange={(e) => {
// //                   setFilter("customer_type", e.target.value);
// //                   setFilter("page", 1); // Reset to page 1 on filter change
// //                 }}
// //               >
// //                 <option value="">All</option>
// //                 <option value="Business">Business</option>
// //                 <option value="Individual">Individual</option>
// //                 <option value="Organization">Organization</option>
// //               </select>
// //             </div>
// //           </div>

// //           {/* Table */}
// //           <div className="customMaster-table-cointainer">
// //             {loading ? (
// //               <p>Loading...</p>
// //             ) : (
// //               <table>
// //                 <thead>
// //                   <tr>
// //                     <th>Customer ID</th>
// //                     <th>Name</th>
// //                     <th>Company</th>
// //                     <th>Type</th>
// //                     <th>Email</th>
// //                     <th>Status</th>
// //                     <th>Credit Limit</th>
// //                     <th>City</th>
// //                     <th>Action</th>
// //                   </tr>
// //                 </thead>

// //                 <tbody>
// //                   {customers && customers.length > 0 ? (
// //                     customers.map((c) => (
// //                       <tr key={c.id}>
// //                         <td>{c.customer_id}</td>
// //                         <td>{c.first_name}</td>
// //                         <td>{c.company_name}</td>
// //                         <td>{c.customer_type}</td>
// //                         <td>{c.email}</td>
// //                         <td>{c.status}</td>
// //                         <td>{c.credit_limit}</td>
// //                         <td>{c.city}</td>

// //                         <td>
// //                           <button onClick={() => deleteCustomer(c.id)}>Delete</button>
// //                         </td>
// //                       </tr>
// //                     ))
// //                   ) : (
// //                     <tr>
// //                       <td colSpan="9">No Data Found</td>
// //                     </tr>
// //                   )}
// //                 </tbody>
// //               </table>
// //             )}
// //           </div>

// //           {/* Pagination */}
// //           <nav className="customMaster-table-bottem">
// //             <p>Showing {customers.length} entries</p>

// //             <div>
// //               <button
// //                 onClick={() => setFilter("page", page - 1)}
// //                 disabled={page <= 1}
// //               >
// //                 Prev
// //               </button>

// //               <span>Page {page} of {totalPages}</span>

// //               <button
// //                 onClick={() => setFilter("page", page + 1)}
// //                 disabled={page >= totalPages}
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
// import React, { useEffect, useState } from "react";
// import "./customMaster.css";
// import { useCustomerStore } from "./customerStore";

// import CreateNewCustomer from "./createNewCustomer";
// import CustomImport from "../custom-Import/customImport";
// import CustomDuplicates from "../custom-merge-duplicates/customDuplicates";

// export default function CustomMaster() {
//   const {
//     customers,
//     totalPages,
//     loading,
//     filters,
//     setFilter,
//     fetchCustomers,
//     deleteCustomer,
//   } = useCustomerStore();

//   const {
//     page,
//     per_page,
//     status,
//     customer_type,
//     assigned_sales_rep,
//     search,
//   } = filters;

//   // Load customers when filters change
//   useEffect(() => {
//     console.log("🎯 Effect triggered with filters:", filters);
//     fetchCustomers();
//   }, [page, per_page, status, customer_type, assigned_sales_rep, search]);

//   // Modal States
//   const [showAddCustomer, setShowAddCustomer] = useState(false);
//   const [showCustomImport, setShowCustomImport] = useState(false);
//   const [showCustomDuplicates, setShowCustomDuplicates] = useState(false);
//   const [editShowAddCustom, setEditShowAddCustom] = useState(false);
//   const [editAddCustomData, setEditAddCustomData] = useState({});

//   // Close modal and refresh
//   const handleCloseAddCustomer = () => {
//     setShowAddCustomer(false);
//     fetchCustomers(); // Refresh after adding
//   };

//   const handleCloseEditCustomer = () => {
//     setEditShowAddCustom(false);
//     setEditAddCustomData({});
//     fetchCustomers(); // Refresh after editing
//   };

//   const resetSearchBox = () => {
//     setFilter("page", 1);
//     setFilter("status", "");
//     setFilter("customer_type", "");
//     setFilter("assigned_sales_rep", "");
//     setFilter("search", "");
//   };

//   return (
//     <>
//       {/* Modals */}
//       {showAddCustomer ? (
//         <CreateNewCustomer setShowAddCustomer={handleCloseAddCustomer} />
//       ) : editShowAddCustom ? (
//         <CreateNewCustomer
//           setShowAddCustomer={handleCloseEditCustomer}
//           editShowAddCustom={editShowAddCustom}
//           editAddCustomData={editAddCustomData}
//           setEditAddCustomData={setEditAddCustomData}
//         />
//       ) : showCustomImport ? (
//         <CustomImport setShowCustomImport={setShowCustomImport} />
//       ) : showCustomDuplicates ? (
//         <CustomDuplicates
//           setShowCustomDuplicates={setShowCustomDuplicates}
//           customMaster={customers}
//         />
//       ) : (
//         <div className="customMaster-container">
//           <div className="customMaster-header">
//             <p>Customer Master</p>
//             <nav>
//               <button onClick={() => setShowAddCustomer(true)}>+ Add New Customer</button>
//               <button onClick={() => setShowCustomImport(true)}>Import</button>
//               <button onClick={() => setShowCustomDuplicates(true)}>Merge Duplicates</button>
//             </nav>
//           </div>

//           {/* Search */}
//           <div className="customMaster-search-box">
//             <input
//               placeholder="Search by Customer..."
//               value={search}
//               onChange={(e) => {
//                 setFilter("search", e.target.value);
//                 setFilter("page", 1); // Reset to page 1 on search
//               }}
//             />
//           </div>

//           <div className="customMaster-clearfilter">
//             <p onClick={resetSearchBox}>Clear Filter</p>
//           </div>

//           {/* Filters */}
//           <div className="customMaster-search-category">
//             <div className="customMaster-input-box">
//               <label>Status</label>
//               <select
//                 value={status}
//                 onChange={(e) => {
//                   setFilter("status", e.target.value);
//                   setFilter("page", 1); // Reset to page 1 on filter change
//                 }}
//               >
//                 <option value="">All</option>
//                 <option value="Active">Active</option>
//                 <option value="Inactive">Inactive</option>
//               </select>
//             </div>

//             <div className="customMaster-input-box">
//               <label>Customer Type</label>
//               <select
//                 value={customer_type}
//                 onChange={(e) => {
//                   setFilter("customer_type", e.target.value);
//                   setFilter("page", 1); // Reset to page 1 on filter change
//                 }}
//               >
//                 <option value="">All</option>
//                 <option value="Business">Business</option>
//                 <option value="Individual">Individual</option>
//                 <option value="Organization">Organization</option>
//               </select>
//             </div>
//           </div>

//           {/* Table */}
//           <div className="customMaster-table-cointainer">
//             {loading ? (
//               <p>Loading...</p>
//             ) : (
//               <table>
//                 <thead>
//                   <tr>
//                     <th>Customer ID</th>
//                     <th>Name</th>
//                     <th>Company</th>
//                     <th>Type</th>
//                     <th>Email</th>
//                     <th>Phone</th>
//                     <th>Status</th>
//                     <th>Credit Limit</th>
//                     <th>City</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {customers && customers.length > 0 ? (
//                     customers.map((c) => (
//                       <tr key={c.id}>
//                         <td>{c.customer_id || 'N/A'}</td>
//                         <td>{`${c.first_name || ''} ${c.last_name || ''}`}</td>
//                         <td>{c.company_name || 'N/A'}</td>
//                         <td>{c.customer_type || 'N/A'}</td>
//                         <td>{c.email || 'N/A'}</td>
//                         <td>{c.phone_number || 'N/A'}</td>
//                         <td>{c.status || 'N/A'}</td>
//                         <td>{c.credit_limit || '0.00'}</td>
//                         <td>{c.city || 'N/A'}</td>
//                         <td>
//                           <button 
//                             onClick={() => {
//                               setEditAddCustomData(c);
//                               setEditShowAddCustom(true);
//                             }}
//                             style={{ marginRight: '5px' }}
//                           >
//                             Edit
//                           </button>
//                           <button onClick={() => deleteCustomer(c.id)}>Delete</button>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="10">No Data Found</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             )}
//           </div>

//           {/* Pagination */}
//           <nav className="customMaster-table-bottem">
//             <p>Showing {customers.length} entries</p>

//             <div>
//               <button
//                 onClick={() => setFilter("page", page - 1)}
//                 disabled={page <= 1}
//               >
//                 Prev
//               </button>

//               <span>Page {page} of {totalPages}</span>

//               <button
//                 onClick={() => setFilter("page", page + 1)}
//                 disabled={page >= totalPages}
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
import React, { useEffect, useState } from "react";
import "./customMaster.css";
import { useCustomerStore } from "./customerStore";
import CreateNewCustomer from "./createNewCustomer";
import CustomImport from "./customImport";
import CustomDuplicates from "./customDuplicates";
import customerApiProvider from "../../../network/customer-api-provider";

export default function CustomMaster() {
  const {
    customers,
    totalPages,
    loading,
    filters,
    setFilter,
    fetchCustomers,
    deleteCustomer,
  } = useCustomerStore();

  const {
    page,
    per_page,
    status,
    customer_type,
    assigned_sales_rep,
    search,
  } = filters;

  // Load customers when filters change
  useEffect(() => {
    fetchCustomers();
  }, [page, per_page, status, customer_type, assigned_sales_rep, search]);

  // Load sales reps for filter dropdown
  useEffect(() => {
    const loadSalesReps = async () => {
      const reps = await customerApiProvider.fetchSalesReps();
      setSalesRepList(reps || []);
    };
    loadSalesReps();
  }, []);

  // Modal States
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showCustomImport, setShowCustomImport] = useState(false);
  const [showCustomDuplicates, setShowCustomDuplicates] = useState(false);
  const [editShowAddCustom, setEditShowAddCustom] = useState(false);
  const [editAddCustomData, setEditAddCustomData] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCustomerData, setDeleteCustomerData] = useState(null);
  const [salesRepList, setSalesRepList] = useState([]);

  // Close modal and refresh
  const handleCloseAddCustomer = () => {
    setShowAddCustomer(false);
    fetchCustomers(); // Refresh after adding
  };

  const handleCloseEditCustomer = () => {
    setEditShowAddCustom(false);
    setEditAddCustomData({});
    fetchCustomers(); // Refresh after editing
  };

  const resetSearchBox = () => {
    setFilter("page", 1);
    setFilter("status", "");
    setFilter("customer_type", "");
    setFilter("assigned_sales_rep", "");
    setFilter("search", "");
  };

  const handleDeleteClick = (customer) => {
    setDeleteCustomerData(customer);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteCustomerData) return;

    await deleteCustomer(deleteCustomerData.id);
    fetchCustomers();

    setShowDeleteModal(false);
    setDeleteCustomerData(null);
  };

  const showEditCustomer = (customer) => {
    setEditAddCustomData(customer);
    setEditShowAddCustom(true);
  };

  return (
    <>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="customMaster-delete-modal"
          style={{
            maxWidth: "420px",
            width: "100%",
            paddingBottom: "10px",
            height: "auto",
            minHeight: "unset",
          }}
        >
          <svg
            className="customMaster-close-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            onClick={() => setShowDeleteModal(false)}
          >
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 
            0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 
            0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 
            12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 
            0L192 301.3 297.4 406.6c12.5 12.5 
            32.8 12.5 45.3 0s12.5-32.8 
            0-45.3L237.3 256 342.6 150.6z" />
          </svg>

          <div className="customMaster-modal-head">
            <p>Delete Customer</p>
          </div>

          <div
            className="customMaster-modal-body"
            style={{
              padding: "16px 20px",
              height: "auto",
            }}
          >
            <p
              style={{
                textAlign: "center",
                fontSize: "15px",
                lineHeight: "22px",
                marginBottom: "20px",
              }}
            >
              Are you sure you want to delete <br />
              <strong>{deleteCustomerData?.first_name} {deleteCustomerData?.last_name}</strong>
              <br />
              ({deleteCustomerData?.email})?
            </p>

            <div
              className="customMaster-modal-actions"
              style={{ justifyContent: "center", gap: "14px" }}
            >
              <button
                type="button"
                className="customMaster-cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="customMaster-delete-btn"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showAddCustomer ? (
        <CreateNewCustomer setShowAddCustomer={handleCloseAddCustomer} />
      ) : editShowAddCustom ? (
        <CreateNewCustomer
          setShowAddCustomer={handleCloseEditCustomer}
          editShowAddCustom={editShowAddCustom}
          editAddCustomData={editAddCustomData}
          setEditAddCustomData={setEditAddCustomData}
        />
      ) : showCustomImport ? (
        <CustomImport setShowCustomImport={setShowCustomImport} />
      ) : showCustomDuplicates ? (
        <CustomDuplicates
          setShowCustomDuplicates={setShowCustomDuplicates}
          customMaster={customers}
        />
      ) : (
        <div 
          className={`customMaster-container ${
            showDeleteModal ? "blur" : ""
          }`}
        >
          <div className="customMaster-header">
            <p>Customer Master</p>
            <nav>
              <button onClick={() => setShowAddCustomer(true)}>+ Add New Customer</button>
              <button onClick={() => setShowCustomImport(true)}>Import</button>
              <button onClick={() => setShowCustomDuplicates(true)}>Merge Duplicates</button>
            </nav>
          </div>

          {/* Search */}
          <div className="customMaster-search-box">
            <label>
              <svg
                className="customMaster-search-logo"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 
                457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 
                12.5-45.3 0L330.7 376c-34.4 25.2-76.8 
                40-122.7 40C93.1 416 0 322.9 0 208S93.1 
                0 208 0S416 93.1 416 208z" />
              </svg>
            </label>
            <input
              placeholder="Search by Customer..."
              value={search}
              onChange={(e) => {
                setFilter("search", e.target.value);
                setFilter("page", 1); // Reset to page 1 on search
              }}
            />
          </div>

          <div className="customMaster-clearfilter">
            <p onClick={resetSearchBox}>Clear Filter</p>
          </div>

          {/* Filters */}
          <div className="customMaster-search-category">
            <div className="customMaster-input-box">
              <label>Status</label>
              <select
                value={status}
                onChange={(e) => {
                  setFilter("status", e.target.value);
                  setFilter("page", 1); // Reset to page 1 on filter change
                }}
              >
                <option value="">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="customMaster-input-box">
              <label>Customer Type</label>
              <select
                value={customer_type}
                onChange={(e) => {
                  setFilter("customer_type", e.target.value);
                  setFilter("page", 1);
                }}
              >
                <option value="">All</option>
                <option value="Business">Business</option>
                <option value="Individual">Individual</option>
                <option value="Organization">Organization</option>
              </select>
            </div>

            <div className="customMaster-input-box">
              <label>Sales Rep</label>
              <select
                value={assigned_sales_rep}
                onChange={(e) => {
                  setFilter("assigned_sales_rep", e.target.value);
                  setFilter("page", 1);
                }}
              >
                <option value="">All</option>
                {salesRepList.map(rep => (
                  <option key={rep.id} value={rep.id}>{rep.first_name} {rep.last_name || ""}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="customMaster-table-cointainer">
            {loading ? (
              <p style={{ textAlign: 'center', padding: '20px' }}>Loading...</p>
            ) : (
              <table>
                <thead className="customMaster-thead">
                  <tr>
                    <th id="custom_tData_width_id">Customer ID</th>
                    <th>Name</th>
                    <th>Company</th>
                    <th>Customer Type</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th id="custom_tData_width_limit">Credit Limit</th>
                    <th>City</th>
                    <th id="custom_tData_width_action">Action</th>
                  </tr>
                </thead>

                <tbody className="customMaster-tbody">
                  {customers && customers.length > 0 ? (
                    customers.map((c, index) => (
                      <tr key={c.id}>
                        <td id="custom_tData_width_id">{c.customer_id || 'N/A'}</td>
                        <td>
                          <abbr title={`${c.first_name || ''} ${c.last_name || ''}`.trim()}>
                            {`${c.first_name || ''} ${c.last_name || ''}`.trim() || 'N/A'}
                          </abbr>
                        </td>
                        <td>
                          <abbr title={c.company_name || 'N/A'}>
                            {c.company_name
                              ? c.company_name.length > 20
                                ? c.company_name.slice(0, 20) + "..."
                                : c.company_name
                              : 'N/A'}
                          </abbr>
                        </td>
                        <td>{c.customer_type || 'N/A'}</td>
                        <td>
                          <abbr title={c.email || 'N/A'}>
                            {c.email
                              ? c.email.length > 25
                                ? c.email.slice(0, 25) + "..."
                                : c.email
                              : 'N/A'}
                          </abbr>
                        </td>
                        <td>
                          <span className={c.status === 'Active' ? 'customMaster-Status-active' : 'customMaster-Status-inactive'}>
                            {c.status || 'N/A'}
                          </span>
                        </td>
                        <td id="custom_tData_width_limit">₹{c.credit_limit || '0.00'}</td>
                        <td>{c.city || 'N/A'}</td>
                        <td id="custom_tData_width_action">
                          <svg
                            className="customMaster-dot-logo"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 128 512"
                          >
                            <path d="M64 360a56 56 0 1 0 0 112 56 56 
                            0 1 0 0-112zm0-160a56 56 0 1 
                            0 0 112 56 56 0 1 0 0-112zM120 96A56 56 
                            0 1 0 8 96a56 56 0 1 0 112 0z" />
                          </svg>

                          <nav className="customMaster-dot-container">
                            <div onClick={() => showEditCustomer(c)}>Edit</div>
                            <div onClick={() => handleDeleteClick(c)}>Delete</div>
                          </nav>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" style={{ textAlign: 'center' }}>No Data Found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <nav className="customMaster-table-bottem">
            <p className="customMaster-num-entries">Showing {customers.length} entries</p>

            <div className="customMaster-manage-control-box">
              <button
                className="customMaster-manage-btn"
                onClick={() => setFilter("page", page - 1)}
                disabled={page <= 1}
              >
                Prev
              </button>

              <span className="customMaster-num-page">Page {page} of {totalPages}</span>

              <button
                className="customMaster-manage-btn"
                onClick={() => setFilter("page", page + 1)}
                disabled={page >= totalPages}
              >
                Next
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}