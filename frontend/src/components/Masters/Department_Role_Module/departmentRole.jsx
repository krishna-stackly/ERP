// // // import React, { useEffect, useState } from "react";
// // // import "./departmentRole.css";
// // // import CreateDepartmentRole from "./createDepartmentRole";
// // // import CreateNewRole from "./createNewRole";
// // // import useDepartmentStore from "./useDepartmentRoleStore";

// // // export default function DepartmentRole() {
// // //   const {
// // //     departments,
// // //     fetchDepartments,
// // //     deleteDepartment,
// // //     currentPage,
// // //     totalPages,
// // //     loading,
// // //     setSearch,
// // //   } = useDepartmentStore();

// // //   const [showNewRole, setShowNewRole] = useState(false);
// // //   const [editRoleOnly, setEditRoleOnly] = useState(false);
// // //   const [editRole, setEditRole] = useState({});

// // //   const [showDepartmentRole, setShowDepartmentRole] = useState(false);
// // //   const [editDepartmentRole, setEditDepartmentRole] = useState(false);
// // //   const [editDept, setEditDept] = useState({});

// // //   const [searchTerm, setSearchTerm] = useState("");

// // //   // Fetch departments on mount
// // //   useEffect(() => {
// // //     fetchDepartments();
// // //   }, [fetchDepartments]);

// // //   // Handle search
// // //   const handleSearch = (e) => {
// // //     const value = e.target.value;
// // //     setSearchTerm(value);
// // //     setSearch(value);
// // //     fetchDepartments(1, value); // always reset to page 1
// // //   };

// // //   const handleNext = () => {
// // //     if (currentPage < totalPages) fetchDepartments(currentPage + 1, searchTerm);
// // //   };

// // //   const handlePrev = () => {
// // //     if (currentPage > 1) fetchDepartments(currentPage - 1, searchTerm);
// // //   };

// // //   const showEditDepartmentRole = (code) => {
// // //     const departmentToEdit = departments.find((d) => d.code === code);
// // //     if (departmentToEdit) {
// // //       setEditDept(departmentToEdit);
// // //       setEditDepartmentRole(true);
// // //       setShowDepartmentRole(false);
// // //     }
// // //   };

// // //   const handleCloseModal = () => {
// // //     setEditDepartmentRole(false);
// // //     setShowDepartmentRole(false);
// // //     setEditDept({});
// // //   };

// // //   return (
// // //     <>
// // //       {showNewRole && (
// // //         <div className="createNewRole-btn">
// // //           <CreateNewRole
// // //             editRoleOnly={editRoleOnly}
// // //             setShowNewRole={setShowNewRole}
// // //             editRole={editRole}
// // //             setEditRole={setEditRole}
// // //             setEditRoleOnly={setEditRoleOnly}
// // //           />
// // //         </div>
// // //       )}

// // //       {(showDepartmentRole || editDepartmentRole) && (
// // //         <div className="create-department-role-btn">
// // //           <CreateDepartmentRole
// // //             setEditRole={setEditRole}
// // //             setEditRoleOnly={setEditRoleOnly}
// // //             editDept={editDept}
// // //             editDepartmentRole={editDepartmentRole}
// // //             setEditDept={setEditDept}
// // //             setShowDepartmentRole={setShowDepartmentRole}
// // //             setEditDepartmentRole={setEditDepartmentRole}
// // //             setShowNewRole={setShowNewRole}
// // //             setDepartmentTableData={null} // handled by store now
// // //             onClose={handleCloseModal}
// // //           />
// // //         </div>
// // //       )}

// // //       <div
// // //         className={`department-role-container ${
// // //           showDepartmentRole || editDepartmentRole ? "blur-department" : ""
// // //         }`}
// // //       >
// // //         <p>Department & Roles</p>

// // //         <div className="department-header">
// // //           <p className="department-headleft">
// // //             Efficiently manage and organize Department & Roles with ease.
// // //           </p>
// // //           <div className="department-headright">
// // //             <div className="department-search-cointainer">
// // //               <input
// // //                 placeholder="Search departments"
// // //                 value={searchTerm}
// // //                 onChange={handleSearch}
// // //               />
// // //             </div>
// // //             <button
// // //               onClick={() => {
// // //                 setShowDepartmentRole(true);
// // //                 setEditDepartmentRole(false);
// // //                 setEditDept({});
// // //               }}
// // //             >
// // //               + Create New Department
// // //             </button>
// // //           </div>
// // //         </div>

// // //         <div className="department-table-container">
// // //           <table>
// // //             <thead className="department-thead">
// // //               <tr>
// // //                  <th>S.No.</th>
// // //                 <th>Code</th>
// // //                 <th>Department Name</th>
// // //                 <th id="department-width-description">Description</th>
// // //                 <th id="department-width-action">Action</th>
// // //               </tr>
// // //             </thead>

// // //             <tbody className="department-tbody">
// // //               {!loading && departments.length > 0 ? (
// // //                 departments.map((dept,index) => (
// // //                   <tr key={dept.id}>
// // //                     <td>{index+1}</td>
// // //                     <td>{dept.code}</td>
// // //                     <td>{dept.department_name}</td>
// // //                     <td id="department-width-description">{dept.description}</td>
// // //                     <td id="department-width-action">
// // //                       <svg
// // //                         className="dot-logo-department"
// // //                         xmlns="http://www.w3.org/2000/svg"
// // //                         viewBox="0 0 128 512"
// // //                       >
// // //                         <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
// // //                       </svg>

// // //                       <nav className="department-dot-container">
// // //                         <div onClick={() => showEditDepartmentRole(dept.code)}>Edit</div>
// // //                         <div onClick={() => deleteDepartment(dept.id)}>Delete</div>
// // //                       </nav>
// // //                     </td>
// // //                   </tr>
// // //                 ))
// // //               ) : (
// // //                 <tr>
// // //                   <td colSpan="4" style={{ textAlign: "center" }}>
// // //                     {loading ? "Loading..." : "No Data Found"}
// // //                   </td>
// // //                 </tr>
// // //               )}
// // //             </tbody>
// // //           </table>
// // //         </div>

// // //         <nav className="table-bottem-department">
// // //           <p className="num-entries-department">
// // //             Showing {departments.length} entries
// // //           </p>

// // //           <div className="department-control-box">
// // //             <button
// // //               className="department-btn"
// // //               onClick={handlePrev}
// // //               disabled={currentPage === 1}
// // //             >
// // //               Prev
// // //             </button>
// // //             <nav className="num-page-department">
// // //               Page {currentPage} of {totalPages}
// // //             </nav>
// // //             <button
// // //               className="department-btn"
// // //               onClick={handleNext}
// // //               disabled={currentPage === totalPages}
// // //             >
// // //               Next
// // //             </button>
// // //           </div>
// // //         </nav>
// // //       </div>
// // //     </>
// // //   );
// // // }
// // import React, { useEffect, useState } from "react";
// // import "./departmentRole.css";
// // import CreateDepartmentRole from "./createDepartmentRole";
// // import CreateNewRole from "./createNewRole";
// // import useDepartmentStore from "./useDepartmentRoleStore";
// // import { toast } from "react-toastify";

// // export default function DepartmentRole() {
// //   const {
// //     departments,
// //     fetchDepartments,
// //     deleteDepartment,
// //     currentPage,
// //     totalPages,
// //     loading,
// //     search,
// //     setSearch,
// //   } = useDepartmentStore();

// //   const [showDepartmentRole, setShowDepartmentRole] = useState(false);
// //   const [editDepartmentRole, setEditDepartmentRole] = useState(false);
// //   const [editDept, setEditDept] = useState({});

// //   const [showNewRole, setShowNewRole] = useState(false);
// //   const [editRoleOnly, setEditRoleOnly] = useState(false);
// //   const [editRole, setEditRole] = useState({});

// //   /* ==============================
// //      Fetch on mount
// //   ============================== */
// //   useEffect(() => {
// //     fetchDepartments();
// //   }, []);

// //   /* ==============================
// //      Pagination
// //   ============================== */
// //   const handleNext = () => {
// //     if (currentPage < totalPages) {
// //       fetchDepartments(currentPage + 1, search);
// //     }
// //   };

// //   const handlePrev = () => {
// //     if (currentPage > 1) {
// //       fetchDepartments(currentPage - 1, search);
// //     }
// //   };

// //   /* ==============================
// //      Search
// //   ============================== */
// //   const handleSearch = (e) => {
// //     const value = e.target.value;
// //     setSearch(value);
// //     fetchDepartments(1, value);
// //   };

// //   /* ==============================
// //      Edit Department
// //   ============================== */
// //   const showEditDepartment = (id) => {
// //     const dept = departments.find((d) => d.id === id);
// //     if (!dept) {
// //       toast.error("Department not found");
// //       return;
// //     }

// //     setEditDept(dept);
// //     setEditDepartmentRole(true);
// //     setShowDepartmentRole(false);
// //   };

// //   /* ==============================
// //      Close Modal (SINGLE SOURCE)
// //   ============================== */
// //   const closeModal = () => {
// //     setShowDepartmentRole(false);
// //     setEditDepartmentRole(false);
// //     setEditDept({});
// //   };

// //   /* ==============================
// //      UI
// //   ============================== */
// //   return (
// //     <>
// //       {/* CREATE / EDIT DEPARTMENT MODAL */}
// //       {(showDepartmentRole || editDepartmentRole) && (
// //         <CreateDepartmentRole
// //           showDepartmentRole={showDepartmentRole}
// //           editDepartmentRole={editDepartmentRole}
// //           editDept={editDept}
// //           setShowNewRole={setShowNewRole}
// //           setEditRoleOnly={setEditRoleOnly}
// //           setEditRole={setEditRole}
// //           onClose={closeModal}
// //         />
// //       )}

// //       {/* CREATE ROLE MODAL */}
// //       {showNewRole && (
// //         <CreateNewRole
// //           editRoleOnly={editRoleOnly}
// //           setShowNewRole={setShowNewRole}
// //           editRole={editRole}
// //           setEditRole={setEditRole}
// //           setEditRoleOnly={setEditRoleOnly}
// //         />
// //       )}

// //       {/* MAIN CONTENT */}
// //       <div
// //         className={`department-role-container ${
// //           showDepartmentRole || editDepartmentRole || showNewRole
// //             ? "blur-department"
// //             : ""
// //         }`}
// //       >
// //         <p>Department & Roles</p>

// //         {/* HEADER */}
// //         <div className="department-header">
// //           <p className="department-headleft">
// //             Efficiently manage and organize Department & Roles with ease.
// //           </p>

// //           <div className="department-headright">
// //             {/* <div className="department-search-cointainer">
// //               <input
// //                 value={search}
// //                 onChange={handleSearch}
// //                 placeholder="Search departments"
// //               />
// //             </div> */}
// //             <div className="manage-search-cointainer">
// //               <input
// //                 value={search}
// //                 onChange={(e) => {
// //                   setSearch(e.target.value);
// //                   fetchDepartments(1, e.target.value);
// //                 }}
// //                 placeholder="Search departments"
// //               />
// //               <label>
// //                 <svg
// //                   className="search-logo-manageuser"
// //                   xmlns="http://www.w3.org/2000/svg"
// //                   viewBox="0 0 512 512"
// //                 >
// //                   <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 
// //                   457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 
// //                   12.5-45.3 0L330.7 376c-34.4 25.2-76.8 
// //                   40-122.7 40C93.1 416 0 322.9 0 208S93.1 
// //                   0 208 0S416 93.1 416 208z" />
// //                 </svg>
// //               </label>
// //             </div>

// //             <button
// //               onClick={() => {
// //                 setShowDepartmentRole(
                
// //                 );
// //                 setEditDepartmentRole(false);
// //                 setEditDept({});
// //               }}
// //             >
// //               + Create New Department
// //             </button>
// //           </div>
// //         </div>

// //         {/* TABLE */}
// //         <div className="department-table-container">
// //           <table>
// //             <thead className="department-thead">
// //               <tr>
// //                 <th>S.No.</th>
// //                 <th>Code</th>
// //                 <th>Department Name</th>
// //                 <th id="department-width-description">Description</th>
// //                 <th id="department-width-action">Action</th>
// //               </tr>
// //             </thead>

// //             <tbody className="department-tbody">
// //               {loading ? (
// //                 <tr>
// //                   <td colSpan="5" style={{ textAlign: "center" }}>
// //                     Loading...
// //                   </td>
// //                 </tr>
// //               ) : departments.length ? (
// //                 departments.map((dept, index) => (
// //                   <tr key={dept.id}>
// //                     <td>{index + 1}</td>
// //                     <td>{dept.code}</td>
// //                     <td>{dept.department_name}</td>
// //                     <td id="department-width-description">
// //                       {dept.description || "—"}
// //                     </td>
// //                     <td id="department-width-action">
// //                       <svg
// //                         className="dot-logo-department"
// //                         xmlns="http://www.w3.org/2000/svg"
// //                         viewBox="0 0 128 512"
// //                       >
// //                         <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
// //                       </svg>

// //                       <nav className="department-dot-container">
// //                         <div onClick={() => showEditDepartment(dept.id)}>
// //                           Edit
// //                         </div>
// //                         <div onClick={() => deleteDepartment(dept.id)}>
// //                           Delete
// //                         </div>
// //                       </nav>
// //                     </td>
// //                   </tr>
// //                 ))
// //               ) : (
// //                 <tr>
// //                   <td colSpan="5" style={{ textAlign: "center" }}>
// //                     No Data Found
// //                   </td>
// //                 </tr>
// //               )}
// //             </tbody>
// //           </table>
// //         </div>

// //         {/* PAGINATION */}
// //         <nav className="table-bottem-department">
// //           <p className="num-entries-department">
// //             Showing {departments.length} entries
// //           </p>

// //           <div className="department-control-box">
// //             <button
// //               className="department-btn"
// //               onClick={handlePrev}
// //               disabled={currentPage === 1}
// //             >
// //               Prev
// //             </button>

// //             <nav className="num-page-department">
// //               Page {currentPage} of {totalPages}
// //             </nav>

// //             <button
// //               className="department-btn"
// //               onClick={handleNext}
// //               disabled={currentPage === totalPages}
// //             >
// //               Next
// //             </button>
// //           </div>
// //         </nav>
// //       </div>
// //     </>
// //   );
// // }

// import React, { useEffect, useState } from "react";
// import "./departmentRole.css";
// import CreateDepartmentRole from "./createDepartmentRole";
// import CreateNewRole from "./createNewRole";
// import useDepartmentStore from "./useDepartmentRoleStore";
// import { toast } from "react-toastify";

// export default function DepartmentRole() {
//   const {
//     departments,
//     fetchDepartments,
//     deleteDepartment,
//     currentPage,
//     totalPages,
//     loading,
//     search,
//     setSearch,
//   } = useDepartmentStore();

//   const [showDepartmentRole, setShowDepartmentRole] = useState(false);
//   const [editDepartmentRole, setEditDepartmentRole] = useState(false);
//   const [editDept, setEditDept] = useState({});

//   const [showNewRole, setShowNewRole] = useState(false);
//   const [editRoleOnly, setEditRoleOnly] = useState(false);
//   const [editRole, setEditRole] = useState({});

//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteDepartmentData, setDeleteDepartmentData] = useState(null);

//   /* Fetch on mount */
//   useEffect(() => {
//     fetchDepartments();
//   }, []);

//   /* Pagination */
//   const handleNext = () => {
//     if (currentPage < totalPages) {
//       fetchDepartments(currentPage + 1, search);
//     }
//   };

//   const handlePrev = () => {
//     if (currentPage > 1) {
//       fetchDepartments(currentPage - 1, search);
//     }
//   };

//   /* Search */
//   const handleSearch = (e) => {
//     const value = e.target.value;
//     setSearch(value);
//     fetchDepartments(1, value);
//   };

//   /* Edit Department */
//   const showEditDepartment = (dept) => {
//     setEditDept(dept);
//     setEditDepartmentRole(true);
//     setShowDepartmentRole(false);
//   };

//   /* Delete Department */
//   const handleDeleteClick = (dept) => {
//     setDeleteDepartmentData(dept);
//     setShowDeleteModal(true);
//   };

//   const confirmDelete = async () => {
//     if (!deleteDepartmentData) return;

//     await deleteDepartment(deleteDepartmentData.id);

//     setShowDeleteModal(false);
//     setDeleteDepartmentData(null);
//   };

//   /* Close Modal */
//   const closeModal = () => {
//     setShowDepartmentRole(false);
//     setEditDepartmentRole(false);
//     setEditDept({});
//   };

//   return (
//     <>
//       {/* Delete Confirmation Modal */}
//       {showDeleteModal && (
//         <div
//           className="department-delete-modal"
//           style={{
//             maxWidth: "420px",
//             width: "100%",
//             paddingBottom: "10px",
//             height: "auto",
//             minHeight: "unset",
//           }}
//         >
//           <svg
//             className="department-close-icon"
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 384 512"
//             onClick={() => setShowDeleteModal(false)}
//           >
//             <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 
//             0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 
//             0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 
//             12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 
//             0L192 301.3 297.4 406.6c12.5 12.5 
//             32.8 12.5 45.3 0s12.5-32.8 
//             0-45.3L237.3 256 342.6 150.6z" />
//           </svg>

//           <div className="department-modal-head">
//             <p>Delete Department</p>
//           </div>

//           <div
//             className="department-modal-body"
//             style={{
//               padding: "16px 20px",
//               height: "auto",
//             }}
//           >
//             <p
//               style={{
//                 textAlign: "center",
//                 fontSize: "15px",
//                 lineHeight: "22px",
//                 marginBottom: "20px",
//               }}
//             >
//               Are you sure you want to delete <br />
//               <strong>{deleteDepartmentData?.department_name}</strong>
//               <br />
//               ({deleteDepartmentData?.code})?
//             </p>

//             <div
//               className="department-modal-actions"
//               style={{ justifyContent: "center", gap: "14px" }}
//             >
//               <button
//                 type="button"
//                 className="department-cancel-btn"
//                 onClick={() => setShowDeleteModal(false)}
//               >
//                 Cancel
//               </button>

//               <button
//                 type="button"
//                 className="department-delete-btn"
//                 onClick={confirmDelete}
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* CREATE / EDIT DEPARTMENT MODAL */}
//       {(showDepartmentRole || editDepartmentRole) && (
//         <CreateDepartmentRole
//           showDepartmentRole={showDepartmentRole}
//           editDepartmentRole={editDepartmentRole}
//           editDept={editDept}
//           setShowNewRole={setShowNewRole}
//           setEditRoleOnly={setEditRoleOnly}
//           setEditRole={setEditRole}
//           onClose={closeModal}
//         />
//       )}

//       {/* CREATE ROLE MODAL */}
//       {showNewRole && (
//         <CreateNewRole
//           editRoleOnly={editRoleOnly}
//           setShowNewRole={setShowNewRole}
//           editRole={editRole}
//           setEditRole={setEditRole}
//           setEditRoleOnly={setEditRoleOnly}
//         />
//       )}

//       {/* MAIN CONTENT */}
//       <div
//         className={`department-role-container ${
//           showDepartmentRole || editDepartmentRole || showNewRole || showDeleteModal
//             ? "blur-department"
//             : ""
//         }`}
//       >
//         <p>Department & Roles</p>

//         {/* HEADER */}
//         <div className="department-header">
//           <p className="department-headleft">
//             Efficiently manage and organize Department & Roles with ease.
//           </p>

//           <div className="department-headright">
//             <div className="manage-search-cointainer">
//               <input
//                 value={search}
//                 onChange={handleSearch}
//                 placeholder="Search departments"
//               />
//               <label>
//                 <svg
//                   className="search-logo-manageuser"
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 512 512"
//                 >
//                   <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 
//                   457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 
//                   12.5-45.3 0L330.7 376c-34.4 25.2-76.8 
//                   40-122.7 40C93.1 416 0 322.9 0 208S93.1 
//                   0 208 0S416 93.1 416 208z" />
//                 </svg>
//               </label>
//             </div>

//             <button
//               onClick={() => {
//                 setShowDepartmentRole(true);
//                 setEditDepartmentRole(false);
//                 setEditDept({});
//               }}
//             >
//               + Create New Department
//             </button>
//           </div>
//         </div>

//         {/* TABLE */}
//         <div className="department-table-container">
//           <table>
//             <thead className="department-thead">
//               <tr>
//                 <th>S.No.</th>
//                 <th>Code</th>
//                 <th>Department Name</th>
//                 <th id="department-width-description">Description</th>
//                 <th>Branch</th>
//                 <th>Roles</th>
//                 <th id="department-width-action">Action</th>
//               </tr>
//             </thead>

//             <tbody className="department-tbody">
//               {loading ? (
//                 <tr>
//                   <td colSpan="5" style={{ textAlign: "center" }}>
//                     Loading...
//                   </td>
//                 </tr>
//               ) : departments.length ? (
//                 departments.map((dept, index) => (
//                   <tr key={dept.id}>
//                     <td>{(currentPage - 1) * 10 + index + 1}</td>
//                     <td>{dept.code || 'N/A'}</td>
//                     <td>
//                       <abbr title={dept.department_name}>
//                         {dept.department_name || 'N/A'}
//                       </abbr>
//                     </td>
//                     <td id="department-width-description">
//                       <abbr title={dept.description || '—'}>
//                         {dept.description
//                           ? dept.description.length > 50
//                             ? dept.description.slice(0, 50) + "..."
//                             : dept.description
//                           : '—'}
//                       </abbr>
//                     </td>
//                     <td>{dept.branch?.name || 'N/A'}</td>
//                     <td>{dept.roles?.length || 0} roles</td>
//                     <td id="department-width-action">
//                       <svg
//                         className="dot-logo-department"
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 128 512"
//                       >
//                         <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
//                       </svg>

//                       <nav className="department-dot-container">
//                         <div onClick={() => showEditDepartment(dept)}>
//                           Edit
//                         </div>
//                         <div onClick={() => handleDeleteClick(dept)}>
//                           Delete
//                         </div>
//                       </nav>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="5" style={{ textAlign: "center" }}>
//                     No Data Found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* PAGINATION */}
//         <nav className="table-bottem-department">
//           <p className="num-entries-department">
//             Showing {departments.length} entries
//           </p>

//           <div className="department-control-box">
//             <button
//               className="department-btn"
//               onClick={handlePrev}
//               disabled={currentPage === 1}
//             >
//               Prev
//             </button>

//             <nav className="num-page-department">
//               Page {currentPage} of {totalPages}
//             </nav>

//             <button
//               className="department-btn"
//               onClick={handleNext}
//               disabled={currentPage === totalPages}
//             >
//               Next
//             </button>
//           </div>
//         </nav>
//       </div>
//     </>
//   );
// }
import React, { useEffect, useState, useRef } from "react";
import "./departmentRole.css";
import CreateDepartmentRole from "./createDepartmentRole";
import useDepartmentStore from "./useDepartmentRoleStore";

export default function DepartmentRole() {
  const {
    departments,
    fetchDepartments,
    deleteDepartment,
    currentPage,
    totalPages,
    loading,
    search,
    setSearch,
  } = useDepartmentStore();

  const [showDepartmentRole, setShowDepartmentRole] = useState(false);
  const [editDepartmentRole, setEditDepartmentRole] = useState(false);
  const [editDept, setEditDept] = useState({});

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteDepartmentData, setDeleteDepartmentData] = useState(null);

  /* Dropdown */
  const [activeActionId, setActiveActionId] = useState(null);
  const actionRef = useRef(null);

  /* Fetch on mount */
  useEffect(() => {
    fetchDepartments();
  }, []);

  /* Close dropdown when clicking outside */
  useEffect(() => {
    function handleClickOutside(event) {
      if (actionRef.current && !actionRef.current.contains(event.target)) {
        setActiveActionId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* Pagination */
  const handleNext = () => {
    if (currentPage < totalPages) {
      fetchDepartments(currentPage + 1, search);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      fetchDepartments(currentPage - 1, search);
    }
  };

  /* Search */
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchDepartments(1, value);
  };

  /* Edit */
  const showEditDepartment = (dept) => {
    setEditDept(dept);
    setEditDepartmentRole(true);
    setShowDepartmentRole(false);
    setActiveActionId(null);
  };

  /* Delete */
  const handleDeleteClick = (dept) => {
    setDeleteDepartmentData(dept);
    setShowDeleteModal(true);
    setActiveActionId(null);
  };

  const confirmDelete = async () => {
    if (!deleteDepartmentData) return;
    await deleteDepartment(deleteDepartmentData.id);
    setShowDeleteModal(false);
    setDeleteDepartmentData(null);
  };

  const closeModal = () => {
    setShowDepartmentRole(false);
    setEditDepartmentRole(false);
    setEditDept({});
  };

  return (
    <div className="department-role-page">
      {/* CREATE / EDIT DEPARTMENT */}
      {(showDepartmentRole || editDepartmentRole) && (
        <div className="modal-overlay">
          <div className="modal-popup-container">
            <CreateDepartmentRole
              showDepartmentRole={showDepartmentRole}
              editDept={editDept}
              onClose={() => {
                closeModal();
                fetchDepartments(currentPage, search);
              }}
            />
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-popup-container modal-delete">
            <div className="department-modal-head">
              <p>Delete Department</p>
            </div>

            <div className="department-modal-body">
              <p style={{ textAlign: "center" }}>
                Are you sure you want to delete <br />
                <strong>{deleteDepartmentData?.department_name}</strong>
                <br />({deleteDepartmentData?.code})?
              </p>

              <div className="department-modal-actions">
                <button
                  className="department-cancel-btn"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="department-delete-btn"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="department-role-container">
        <p>Department & Roles</p>

        {/* HEADER */}
        <div className="department-header">
          <p className="department-headleft">
            Efficiently manage and organize Department & Roles with ease.
          </p>

          <div className="department-headright">
            <div className="manage-search-cointainer">
              <input
                value={search}
                onChange={handleSearch}
                placeholder="Search departments"
              />
            </div>

            <button
              onClick={() => {
                setShowDepartmentRole(true);
                setEditDepartmentRole(false);
                setEditDept({});
              }}
            >
              + Create New Department
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="department-table-container">
          <table>
            <thead className="department-thead">
              <tr>
                <th>Code</th>
                <th>Department Name</th>
                <th>Description</th>
                <th>Roles</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody className="department-tbody">
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    Loading...
                  </td>
                </tr>
              ) : departments.length ? (
                departments.map((dept) => (
                  <tr key={dept.id}>
                    <td>{dept.code || "N/A"}</td>
                    <td>{dept.department_name || "N/A"}</td>
                    <td>{dept.description || "—"}</td>
                    <td>{dept.roles?.length || 0} roles</td>

                    <td id="department-width-action">
                      <div
                        className="action-wrapper"
                        ref={activeActionId === dept.id ? actionRef : null}
                      >
                        <svg
                          className="dot-logo-department"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 128 512"
                          style={{ cursor: "pointer", width: "16px" }}
                          onClick={() =>
                            setActiveActionId(
                              activeActionId === dept.id ? null : dept.id
                            )
                          }
                        >
                          <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                        </svg>

                        {activeActionId === dept.id && (
                          <div className="department-dot-container">
                            <div onClick={() => showEditDepartment(dept)}>
                              Edit
                            </div>
                            <div onClick={() => handleDeleteClick(dept)}>
                              Delete
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No Data Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <nav className="table-bottem-department">
          <p className="num-entries-department">
            Showing {departments.length} entries
          </p>

          <div className="department-control-box">
            <button
              className="department-btn"
              onClick={handlePrev}
              disabled={currentPage <= 1}
            >
              Prev
            </button>

            <nav className="num-page-department">
              Page {currentPage} of {totalPages}
            </nav>

            <button
              className="department-btn"
              onClick={handleNext}
              disabled={currentPage >= totalPages}
            >
              Next
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
