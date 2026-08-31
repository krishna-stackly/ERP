// // // // import React, { useEffect, useState } from "react";
// // // // import "./createDepartmentrole.css";
// // // // import { toast } from "react-toastify";
// // // // import departmentRoleApiProvider from "../../../network/departmentRole-api-provider";

// // // // export default function CreateDepartmentRole({
// // // //   showDepartmentRole,
// // // //   editDept,
// // // //   onClose,
// // // //   setShowNewRole,
// // // //   setEditRoleOnly,
// // // //   setEditRole,
// // // // }) {
// // // //   const initialForm = {
// // // //     department_name: "",
// // // //     code: "",
// // // //     branch: "",
// // // //     description: "",
// // // //   };

// // // //   const [form, setForm] = useState(initialForm);
// // // //   const [roles, setRoles] = useState([]);
// // // //   const [branchList, setBranchList] = useState([]);
// // // //   const [isLoading, setIsLoading] = useState(false);
// // // //   const [rolesLoading, setRolesLoading] = useState(false);

// // // //   /* LOAD BRANCHES */
// // // //   useEffect(() => {
// // // //     departmentRoleApiProvider
// // // //       .fetchBranches()
// // // //       .then((res) => setBranchList(res || []))
// // // //       .catch(() => toast.error("Failed to load branches"));
// // // //   }, []);

// // // //   /* PREFILL EDIT MODE */
// // // //   useEffect(() => {
// // // //     if (!editDept?.id) {
// // // //       setForm(initialForm);
// // // //       setRoles([]);
// // // //       return;
// // // //     }

// // // //     setForm({
// // // //       department_name: editDept.department_name || "",
// // // //       code: editDept.code || "",
// // // //       branch:
// // // //         typeof editDept.branch === "object"
// // // //           ? editDept.branch.id
// // // //           : editDept.branch || "",
// // // //       description: editDept.description || "",
// // // //     });

// // // //     fetchRoles(editDept.id);
// // // //   }, [editDept]);

// // // //   /* FETCH ROLES (EDIT ONLY) */
// // // //   const fetchRoles = async (id) => {
// // // //     setRolesLoading(true);
// // // //     try {
// // // //       const res = await departmentRoleApiProvider.fetchRoles(id);
// // // //       setRoles(res || []);
// // // //     } catch {
// // // //       toast.error("Failed to load roles");
// // // //     } finally {
// // // //       setRolesLoading(false);
// // // //     }
// // // //   };

// // // //   /* INPUT CHANGE */
// // // //   const handleChange = (e) => {
// // // //     const { id, value } = e.target;

// // // //     if (id === "department_name" && !/^[a-zA-Z\s]*$/.test(value)) return;
// // // //     if (id === "code" && !/^[a-zA-Z0-9]*$/.test(value)) return;
// // // //     if (id === "description" && value.length > 500) return;

// // // //     setForm((prev) => ({
// // // //       ...prev,
// // // //       [id]: id === "branch" ? Number(value) : value,
// // // //     }));
// // // //   };

// // // //   /* SAVE DEPARTMENT */
// // // //   const handleSubmit = async (e) => {
// // // //     e.preventDefault();
// // // //     setIsLoading(true);

// // // //     try {
// // // //       if (editDept?.id) {
// // // //         await departmentRoleApiProvider.updateDepartment(editDept.id, form);
// // // //       } else {
// // // //         await departmentRoleApiProvider.createDepartment(form);
// // // //       }
// // // //       onClose();
// // // //     } catch {
// // // //       toast.error("Save failed");
// // // //     } finally {
// // // //       setIsLoading(false);
// // // //     }
// // // //   };

// // // //   /* ROLE TABLE */
// // // //   const renderRolesUI = () => (
// // // //     <table className="role-table">
// // // //       <thead>
// // // //         <tr>
// // // //           <th>Role Name</th>
// // // //           <th>Description</th>
// // // //           <th>Action</th>
// // // //         </tr>
// // // //       </thead>
// // // //       <tbody>
// // // //         {rolesLoading ? (
// // // //           <tr>
// // // //             <td colSpan="3" className="table-empty">
// // // //               Loading roles...
// // // //             </td>
// // // //           </tr>
// // // //         ) : roles.length === 0 ? (
// // // //           <tr>
// // // //             <td colSpan="3" className="table-empty">
// // // //               No roles added
// // // //             </td>
// // // //           </tr>
// // // //         ) : (
// // // //           roles.map((role) => (
// // // //             <tr key={role.id}>
// // // //               <td>{role.role}</td>
// // // //               <td>{role.description || "—"}</td>
// // // //               <td>
// // // //                 <span
// // // //                   className="role-edit"
// // // //                   onClick={() => {
// // // //                     setEditRole(role);
// // // //                     setEditRoleOnly(true);
// // // //                     setShowNewRole(true);
// // // //                   }}
// // // //                 >
// // // //                   Edit Role
// // // //                 </span>
// // // //               </td>
// // // //             </tr>
// // // //           ))
// // // //         )}
// // // //       </tbody>
// // // //     </table>
// // // //   );

// // // //   return (
// // // //     <div
// // // //       className={`create-department-role-container ${
// // // //         showDepartmentRole ? "block" : ""
// // // //       }`}
// // // //     >
// // // //       <div className="create-department-head">
// // // //         <p>{editDept?.id ? "Edit" : "Create New"} Department</p>
// // // //       </div>

// // // //       <form onSubmit={handleSubmit} className="create-department-body">
// // // //         <div className="create-department-content">
// // // //           <Input
// // // //             id="department_name"
// // // //             label="Department Name"
// // // //             placeholder="Enter Your Department Name"
// // // //             required
// // // //             value={form.department_name}
// // // //             onChange={handleChange}
// // // //           />
// // // //           <Input
// // // //             id="code"
// // // //             label="Code"
// // // //             placeholder="Enter Your Department Code"
// // // //             required
// // // //             value={form.code}
// // // //             onChange={handleChange}
// // // //           />
// // // //         </div>

// // // //         <Select
// // // //           id="branch"
// // // //           label="Branch"
// // // //           placeholder="Select Branch"
// // // //           required
// // // //           value={form.branch}
// // // //           onChange={handleChange}
// // // //           options={branchList}
// // // //         />

// // // //         <Input
// // // //           id="description"
// // // //           label="Description"
// // // //           placeholder="Enter Your Description"
// // // //           value={form.description}
// // // //           onChange={handleChange}
// // // //         />

// // // //         {/* ROLES */}
// // // //         <div className="display-role-cointainer-title">
// // // //           <nav>
// // // //             <p>Roles</p>
// // // //             <button
// // // //               type="button"
// // // //               onClick={() => {
// // // //                 setEditRole({});
// // // //                 setEditRoleOnly(false);
// // // //                 setShowNewRole(true);
// // // //               }}
// // // //             >
// // // //               + Add Role
// // // //             </button>
// // // //           </nav>
// // // //         </div>

// // // //         <div className="display-role-cointainer">{renderRolesUI()}</div>

// // // //         <div className="create-department-submit-container">
// // // //           <button
// // // //             type="button"
// // // //             className="create-department-cancel"
// // // //             onClick={onClose}
// // // //           >
// // // //             Cancel
// // // //           </button>
// // // //           <button
// // // //             type="submit"
// // // //             className="create-department-save"
// // // //             disabled={isLoading}
// // // //           >
// // // //             {isLoading ? "Saving..." : "Save"}
// // // //           </button>
// // // //         </div>
// // // //       </form>
// // // //     </div>
// // // //   );
// // // // }

// // // // /* INPUT */
// // // // const Input = ({ label, id, ...props }) => (
// // // //   <div className="create-department-box">
// // // //     <label htmlFor={id}>
// // // //       {label} {props.required && <sup>*</sup>}
// // // //     </label>
// // // //     <input id={id} {...props} />
// // // //   </div>
// // // // );

// // // // /* SELECT */
// // // // const Select = ({ label, id, options, ...props }) => (
// // // //   <div className="create-department-box" id="create-department-box-fullwidth">
// // // //     <label htmlFor={id}>
// // // //       {label} {props.required && <sup>*</sup>}
// // // //     </label>
// // // //     <select id={id} {...props}>
// // // //       <option value="">Select {label}</option>
// // // //       {options.map((o) => (
// // // //         <option key={o.id} value={o.id}>
// // // //           {o.name}
// // // //         </option>
// // // //       ))}
// // // //     </select>
// // // //   </div>
// // // // );
// // // import React, { useEffect, useState } from "react";
// // // import "./createDepartmentrole.css";
// // // import { toast } from "react-toastify";
// // // import departmentRoleApiProvider from "../../../network/departmentRole-api-provider";

// // // export default function CreateDepartmentRole({
// // //   showDepartmentRole,
// // //   editDepartmentRole,
// // //   editDept,
// // //   onClose,
// // //   setShowNewRole,
// // //   setEditRoleOnly,
// // //   setEditRole,
// // // }) {
// // //   const initialForm = {
// // //     department_name: "",
// // //     code: "",
// // //     branch: "",
// // //     description: "",
// // //   };

// // //   const [form, setForm] = useState(initialForm);
// // //   const [roles, setRoles] = useState([]);
// // //   const [branchList, setBranchList] = useState([]);
// // //   const [isLoading, setIsLoading] = useState(false);

// // //   /* LOAD BRANCHES */
// // //   useEffect(() => {
// // //     const loadBranches = async () => {
// // //       try {
// // //         const response = await departmentRoleApiProvider.fetchBranches();
// // //         console.log('Branches Response:', response);
        
// // //         // Handle nested response structure
// // //         const branches = response?.data?.data || response?.data || response?.branches || response || [];
        
// // //         // Ensure it's an array
// // //         if (Array.isArray(branches)) {
// // //           setBranchList(branches);
// // //         } else {
// // //           console.error('Branches is not an array:', branches);
// // //           setBranchList([]);
// // //         }
// // //       } catch (error) {
// // //         console.error('Failed to load branches:', error);
// // //         toast.error("Failed to load branches");
// // //         setBranchList([]);
// // //       }
// // //     };
    
// // //     loadBranches();
// // //   }, []);

// // //   /* PREFILL EDIT MODE */
// // //   useEffect(() => {
// // //     if (!editDept?.id) {
// // //       setForm(initialForm);
// // //       setRoles([]);
// // //       return;
// // //     }

// // //     console.log('Edit Department Data:', editDept);

// // //     setForm({
// // //       department_name: editDept.department_name || "",
// // //       code: editDept.code || "",
// // //       branch: editDept.branch?.id || editDept.branch || "",
// // //       description: editDept.description || "",
// // //     });

// // //     if (editDept.roles && Array.isArray(editDept.roles)) {
// // //       setRoles(editDept.roles);
// // //     } else {
// // //       setRoles([]);
// // //     }
// // //   }, [editDept]);

// // //   /* INPUT CHANGE */
// // //   const handleChange = (e) => {
// // //     const { id, value } = e.target;

// // //     if (id === "department_name" && !/^[a-zA-Z\s]*$/.test(value)) return;
// // //     if (id === "code" && !/^[a-zA-Z0-9]*$/.test(value)) return;
// // //     if (id === "description" && value.length > 500) return;

// // //     setForm((prev) => ({
// // //       ...prev,
// // //       [id]: id === "branch" ? (value ? Number(value) : "") : value,
// // //     }));
// // //   };

// // //   /* SAVE DEPARTMENT */
// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setIsLoading(true);

// // //     try {
// // //       let response;
      
// // //       if (editDept?.id) {
// // //         response = await departmentRoleApiProvider.updateDepartment(editDept.id, form);
// // //         toast.success("Department updated successfully!");
// // //       } else {
// // //         response = await departmentRoleApiProvider.createDepartment(form);
// // //         toast.success("Department created successfully!");
// // //       }
      
// // //       console.log('Save Response:', response);
// // //       onClose();
// // //     } catch (error) {
// // //       console.error('Save failed:', error);
// // //       toast.error(error.response?.data?.message || "Failed to save department");
// // //     } finally {
// // //       setIsLoading(false);
// // //     }
// // //   };

// // //   /* DELETE ROLE */
// // //   const handleDeleteRole = async (roleId) => {
// // //     const confirmDelete = window.confirm("Are you sure you want to delete this role?");
// // //     if (!confirmDelete) return;

// // //     try {
// // //       await departmentRoleApiProvider.deleteRole(roleId);
// // //       toast.success("Role deleted successfully!");
// // //       setRoles((prevRoles) => prevRoles.filter((role) => role.id !== roleId));
// // //     } catch (error) {
// // //       console.error('Failed to delete role:', error);
// // //       toast.error("Failed to delete role");
// // //     }
// // //   };

// // //   /* ROLE TABLE */
// // //   const renderRolesUI = () => (
// // //     <table className="role-table">
// // //       <thead>
// // //         <tr>
// // //           <th>S.No.</th>
// // //           <th>Role Name</th>
// // //           <th>Description</th>
// // //           <th>Status</th>
// // //           <th>Action</th>
// // //         </tr>
// // //       </thead>
// // //       <tbody>
// // //         {roles.length === 0 ? (
// // //           <tr>
// // //             <td colSpan="5" className="table-empty">
// // //               No roles added yet. Click "+ Add Role" to create one.
// // //             </td>
// // //           </tr>
// // //         ) : (
// // //           roles.map((role, index) => (
// // //             <tr key={role.id}>
// // //               <td>{index + 1}</td>
// // //               <td>
// // //                 <abbr title={role.role}>
// // //                   {role.role || "—"}
// // //                 </abbr>
// // //               </td>
// // //               <td>
// // //                 <abbr title={role.description || "—"}>
// // //                   {role.description
// // //                     ? role.description.length > 50
// // //                       ? role.description.slice(0, 50) + "..."
// // //                       : role.description
// // //                     : "—"}
// // //                 </abbr>
// // //               </td>
// // //               <td>
// // //                 <span className={`role-status ${role.is_active ? 'active' : 'inactive'}`}>
// // //                   {role.is_active ? "Active" : "Inactive"}
// // //                 </span>
// // //               </td>
// // //               <td className="role-actions">
// // //                 <span
// // //                   className="role-edit-btn"
// // //                   onClick={() => {
// // //                     setEditRole(role);
// // //                     setEditRoleOnly(true);
// // //                     setShowNewRole(true);
// // //                   }}
// // //                 >
// // //                   Edit
// // //                 </span>
// // //                 <span
// // //                   className="role-delete-btn"
// // //                   onClick={() => handleDeleteRole(role.id)}
// // //                 >
// // //                   Delete
// // //                 </span>
// // //               </td>
// // //             </tr>
// // //           ))
// // //         )}
// // //       </tbody>
// // //     </table>
// // //   );

// // //   return (
// // //     <div className="create-department-overlay">
// // //       <div className="create-department-role-container">
// // //         <div className="create-department-head">
// // //           <p>{editDept?.id ? "Edit" : "Create New"} Department</p>
// // //           <svg
// // //             className="create-department-close-icon"
// // //             xmlns="http://www.w3.org/2000/svg"
// // //             viewBox="0 0 384 512"
// // //             onClick={onClose}
// // //           >
// // //             <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 
// // //             0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 
// // //             0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 
// // //             12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 
// // //             0L192 301.3 297.4 406.6c12.5 12.5 
// // //             32.8 12.5 45.3 0s12.5-32.8 
// // //             0-45.3L237.3 256 342.6 150.6z" />
// // //           </svg>
// // //         </div>

// // //         <form onSubmit={handleSubmit} className="create-department-body">
// // //           <div className="create-department-content">
// // //             <Input
// // //               id="department_name"
// // //               label="Department Name"
// // //               placeholder="Enter Department Name (e.g., Human Resources)"
// // //               required
// // //               value={form.department_name}
// // //               onChange={handleChange}
// // //             />
// // //             <Input
// // //               id="code"
// // //               label="Code"
// // //               placeholder="Enter Department Code (e.g., HR001)"
// // //               required
// // //               value={form.code}
// // //               onChange={handleChange}
// // //               disabled={editDept?.id}
// // //             />
// // //           </div>

// // //           <Select
// // //             id="branch"
// // //             label="Branch"
// // //             placeholder="Select Branch"
// // //             required
// // //             value={form.branch}
// // //             onChange={handleChange}
// // //             options={branchList}
// // //           />

// // //           <Input
// // //             id="description"
// // //             label="Description"
// // //             placeholder="Enter department description (max 500 characters)"
// // //             value={form.description}
// // //             onChange={handleChange}
// // //             maxLength={500}
// // //           />

// // //           {/* ROLES SECTION - Only show in edit mode */}
// // //           {editDept?.id && (
// // //             <>
// // //               <div className="display-role-cointainer-title">
// // //                 <nav>
// // //                   <p>Roles ({roles.length})</p>
// // //                   <button
// // //                     type="button"
// // //                     className="add-role-btn"
// // //                     onClick={() => {
// // //                       setEditRole({
// // //                         department_id: editDept.id,
// // //                         department_name: editDept.department_name,
// // //                         branch_id: editDept.branch?.id,
// // //                         branch_name: editDept.branch?.name,
// // //                       });
// // //                       setEditRoleOnly(false);
// // //                       setShowNewRole(true);
// // //                     }}
// // //                   >
// // //                     + Add Role
// // //                   </button>
// // //                 </nav>
// // //               </div>

// // //               <div className="display-role-cointainer">{renderRolesUI()}</div>
// // //             </>
// // //           )}

// // //           <div className="create-department-submit-container">
// // //             <button
// // //               type="button"
// // //               className="create-department-cancel"
// // //               onClick={onClose}
// // //             >
// // //               Cancel
// // //             </button>
// // //             <button
// // //               type="submit"
// // //               className="create-department-save"
// // //               disabled={isLoading}
// // //             >
// // //               {isLoading ? "Saving..." : editDept?.id ? "Update" : "Create"}
// // //             </button>
// // //           </div>
// // //         </form>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // /* INPUT COMPONENT */
// // // const Input = ({ label, id, ...props }) => (
// // //   <div className="create-department-box">
// // //     <label htmlFor={id}>
// // //       {label} {props.required && <sup>*</sup>}
// // //     </label>
// // //     <input id={id} {...props} />
// // //   </div>
// // // );

// // // /* SELECT COMPONENT */
// // // const Select = ({ label, id, options = [], ...props }) => {
// // //   // Ensure options is always an array
// // //   const safeOptions = Array.isArray(options) ? options : [];
  
// // //   return (
// // //     <div className="create-department-box" id="create-department-box-fullwidth">
// // //       <label htmlFor={id}>
// // //         {label} {props.required && <sup>*</sup>}
// // //       </label>
// // //       <select id={id} {...props}>
// // //         <option value="">Select {label}</option>
// // //         {safeOptions.map((o) => (
// // //           <option key={o.id} value={o.id}>
// // //             {o.name}
// // //           </option>
// // //         ))}
// // //       </select>
// // //     </div>
// // //   );
// // // };
// // import React, { useEffect, useState } from "react";
// // import "./createDepartmentrole.css";
// // import { toast } from "react-toastify";
// // import departmentRoleApiProvider from "../../../network/departmentRole-api-provider";

// // export default function CreateDepartmentRole({
// //   showDepartmentRole,
// //   editDept,
// //   onClose,
// //   setShowNewRole,
// //   setEditRoleOnly,
// //   setEditRole,
// // }) {
// //   const initialForm = {
// //     department_name: "",
// //     code: "",
// //     branch: "",
// //     description: "",
// //   };

// //   const [form, setForm] = useState(initialForm);
// //   const [roles, setRoles] = useState([]);
// //   const [branchList, setBranchList] = useState([]);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [rolesLoading, setRolesLoading] = useState(false);

// //   /* LOAD BRANCHES */
// //   useEffect(() => {
// //     const loadBranches = async () => {
// //       try {
// //         const res = await departmentRoleApiProvider.fetchBranches();
// //         console.log('Branches Response:', res);
        
// //         // Handle nested response structure - ONLY FIX
// //         const branches = res?.data?.data || res?.data || res?.branches || res || [];
// //         setBranchList(Array.isArray(branches) ? branches : []);
// //       } catch (error) {
// //         console.error('Failed to load branches:', error);
// //         toast.error("Failed to load branches");
// //         setBranchList([]);
// //       }
// //     };
    
// //     loadBranches();
// //   }, []);

// //   /* PREFILL EDIT MODE */
// //   useEffect(() => {
// //     if (!editDept?.id) {
// //       setForm(initialForm);
// //       setRoles([]);
// //       return;
// //     }

// //     setForm({
// //       department_name: editDept.department_name || "",
// //       code: editDept.code || "",
// //       branch:
// //         typeof editDept.branch === "object"
// //           ? editDept.branch.id
// //           : editDept.branch || "",
// //       description: editDept.description || "",
// //     });

// //     fetchRoles(editDept.id);
// //   }, [editDept]);

// //   /* FETCH ROLES (EDIT ONLY) */
// //   const fetchRoles = async (id) => {
// //     setRolesLoading(true);
// //     try {
// //       const res = await departmentRoleApiProvider.fetchRoles(id);
// //       setRoles(res || []);
// //     } catch {
// //       toast.error("Failed to load roles");
// //     } finally {
// //       setRolesLoading(false);
// //     }
// //   };

// //   /* INPUT CHANGE */
// //   const handleChange = (e) => {
// //     const { id, value } = e.target;

// //     if (id === "department_name" && !/^[a-zA-Z\s]*$/.test(value)) return;
// //     if (id === "code" && !/^[a-zA-Z0-9]*$/.test(value)) return;
// //     if (id === "description" && value.length > 500) return;

// //     setForm((prev) => ({
// //       ...prev,
// //       [id]: id === "branch" ? Number(value) : value,
// //     }));
// //   };

// //   /* SAVE DEPARTMENT */
// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setIsLoading(true);

// //     try {
// //       if (editDept?.id) {
// //         await departmentRoleApiProvider.updateDepartment(editDept.id, form);
// //       } else {
// //         await departmentRoleApiProvider.createDepartment(form);
// //       }
// //       onClose();
// //     } catch {
// //       toast.error("Save failed");
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   /* ROLE TABLE */
// //   const renderRolesUI = () => (
// //     <table className="role-table">
// //       <thead>
// //         <tr>
// //           <th>Role Name</th>
// //           <th>Description</th>
// //           <th>Action</th>
// //         </tr>
// //       </thead>
// //       <tbody>
// //         {rolesLoading ? (
// //           <tr>
// //             <td colSpan="3" className="table-empty">
// //               Loading roles...
// //             </td>
// //           </tr>
// //         ) : roles.length === 0 ? (
// //           <tr>
// //             <td colSpan="3" className="table-empty">
// //               No roles added
// //             </td>
// //           </tr>
// //         ) : (
// //           roles.map((role) => (
// //             <tr key={role.id}>
// //               <td>{role.role}</td>
// //               <td>{role.description || "—"}</td>
// //               <td>
// //                 <span
// //                   className="role-edit"
// //                   onClick={() => {
// //                     setEditRole(role);
// //                     setEditRoleOnly(true);
// //                     setShowNewRole(true);
// //                   }}
// //                 >
// //                   Edit Role
// //                 </span>
// //               </td>
// //             </tr>
// //           ))
// //         )}
// //       </tbody>
// //     </table>
// //   );

// //   return (
// //     <div
// //       className={`create-department-role-container ${
// //         showDepartmentRole ? "block" : ""
// //       }`}
// //     >
// //       <div className="create-department-head">
// //         <p>{editDept?.id ? "Edit" : "Create New"} Department</p>
// //       </div>

// //       <form onSubmit={handleSubmit} className="create-department-body">
// //         <div className="create-department-content">
// //           <Input
// //             id="department_name"
// //             label="Department Name"
// //             placeholder="Enter Your Department Name"
// //             required
// //             value={form.department_name}
// //             onChange={handleChange}
// //           />
// //           <Input
// //             id="code"
// //             label="Code"
// //             placeholder="Enter Your Department Code"
// //             required
// //             value={form.code}
// //             onChange={handleChange}
// //           />
// //         </div>

// //         <Select
// //           id="branch"
// //           label="Branch"
// //           placeholder="Select Branch"
// //           required
// //           value={form.branch}
// //           onChange={handleChange}
// //           options={branchList}
// //         />

// //         <Input
// //           id="description"
// //           label="Description"
// //           placeholder="Enter Your Description"
// //           value={form.description}
// //           onChange={handleChange}
// //         />

// //         {/* ROLES */}
// //         <div className="display-role-cointainer-title">
// //           <nav>
// //             <p>Roles</p>
// //             <button
// //               type="button"
// //               onClick={() => {
// //                 setEditRole({});
// //                 setEditRoleOnly(false);
// //                 setShowNewRole(true);
// //               }}
// //             >
// //               + Add Role
// //             </button>
// //           </nav>
// //         </div>

// //         <div className="display-role-cointainer">{renderRolesUI()}</div>

// //         <div className="create-department-submit-container">
// //           <button
// //             type="button"
// //             className="create-department-cancel"
// //             onClick={onClose}
// //           >
// //             Cancel
// //           </button>
// //           <button
// //             type="submit"
// //             className="create-department-save"
// //             disabled={isLoading}
// //           >
// //             {isLoading ? "Saving..." : "Save"}
// //           </button>
// //         </div>
// //       </form>
// //     </div>
// //   );
// // }

// // /* INPUT */
// // const Input = ({ label, id, ...props }) => (
// //   <div className="create-department-box">
// //     <label htmlFor={id}>
// //       {label} {props.required && <sup>*</sup>}
// //     </label>
// //     <input id={id} {...props} />
// //   </div>
// // );

// // /* SELECT - ONLY FIX HERE */
// // const Select = ({ label, id, options = [], ...props }) => (
// //   <div className="create-department-box" id="create-department-box-fullwidth">
// //     <label htmlFor={id}>
// //       {label} {props.required && <sup>*</sup>}
// //     </label>
// //     <select id={id} {...props}>
// //       <option value="">Select {label}</option>
// //       {Array.isArray(options) && options.map((o) => (
// //         <option key={o.id} value={o.id}>
// //           {o.name}
// //         </option>
// //       ))}
// //     </select>
// //   </div>
// // );
// import React, { useEffect, useState } from "react";
// import "./createDepartmentrole.css";
// import { toast } from "react-toastify";
// import departmentRoleApiProvider from "../../../network/departmentRole-api-provider";

// export default function CreateDepartmentRole({
//   showDepartmentRole,
//   editDept,
//   onClose,
//   setShowNewRole,
//   setEditRoleOnly,
//   setEditRole,
//   onRoleSaved, // ✅ received from parent to pass down to CreateNewRole
// }) {
//   const initialForm = {
//     department_name: "",
//     code: "",
//     branch: "",
//     description: "",
//   };

//   const [form, setForm] = useState(initialForm);
//   const [roles, setRoles] = useState([]);          // ✅ local roles state
//   const [branchList, setBranchList] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [rolesLoading, setRolesLoading] = useState(false);

//   /* LOAD BRANCHES */
//  /* LOAD BRANCHES */
// useEffect(() => {
//   const loadBranches = async () => {
//     try {
//       const res = await departmentRoleApiProvider.fetchBranches();
//       // ✅ branches are at res.data.data
//       const branches = res?.data?.data || [];
//       setBranchList(Array.isArray(branches) ? branches : []);
//     } catch {
//       toast.error("Failed to load branches");
//       setBranchList([]);
//     }
//   };
//   loadBranches();
// }, []);

//   /* PREFILL EDIT MODE */
//   useEffect(() => {
//     if (!editDept?.id) {
//       setForm(initialForm);
//       setRoles([]);
//       return;
//     }

//     setForm({
//       department_name: editDept.department_name || "",
//       code: editDept.code || "",
//       branch:
//         typeof editDept.branch === "object"
//           ? editDept.branch.id
//           : editDept.branch || "",
//       description: editDept.description || "",
//     });

//     fetchRoles(editDept.id);
//   }, [editDept]);

//   /* FETCH ROLES (edit mode — load existing roles from API) */
//   const fetchRoles = async (id) => {
//     setRolesLoading(true);
//     try {
//       const res = await departmentRoleApiProvider.fetchRoles(id);
//       setRoles(Array.isArray(res) ? res : []);
//     } catch {
//       toast.error("Failed to load roles");
//     } finally {
//       setRolesLoading(false);
//     }
//   };

//   /* ✅ Called by CreateNewRole instead of hitting API directly */
//   const handleRoleSaved = (roleData) => {
//     setRoles((prev) => {
//       // editing an existing role (has real id or _localId)
//       const existingIndex = prev.findIndex((r) =>
//         r.id ? r.id === roleData.id : r._localId === roleData._localId
//       );

//       if (existingIndex !== -1) {
//         // replace
//         const updated = [...prev];
//         updated[existingIndex] = roleData;
//         return updated;
//       }

//       // new role — assign a temp local id
//       return [...prev, { ...roleData, _localId: Date.now() }];
//     });
//   };

//   /* ✅ Delete role locally */
//   const handleDeleteRole = (role) => {
//     if (!window.confirm("Delete this role?")) return;
//     setRoles((prev) =>
//       prev.filter((r) =>
//         r.id ? r.id !== role.id : r._localId !== role._localId
//       )
//     );
//   };

//   /* INPUT CHANGE */
//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     if (id === "department_name" && !/^[a-zA-Z\s]*$/.test(value)) return;
//     if (id === "code" && !/^[a-zA-Z0-9]*$/.test(value)) return;
//     if (id === "description" && value.length > 500) return;
//     setForm((prev) => ({
//       ...prev,
//       [id]: id === "branch" ? Number(value) : value,
//     }));
//   };

//   /* SAVE DEPARTMENT — roles submitted nested */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     // ✅ Strip _localId before sending, keep real id for updates
//     const cleanRoles = roles.map(({ _localId, department_name, branch_name, is_active, created_at, updated_at, created_by, updated_by, ...rest }) => rest);

//     const payload = {
//       ...form,
//       roles: cleanRoles,
//     };

//     try {
//       if (editDept?.id) {
//         await departmentRoleApiProvider.updateDepartment(editDept.id, payload);
//         toast.success("Department updated successfully");
//       } else {
//         await departmentRoleApiProvider.createDepartment(payload);
//         toast.success("Department created successfully");
//       }
//       onClose();
//     } catch {
//       toast.error("Save failed");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   /* ROLE TABLE */
//   const renderRolesUI = () => (
//     <table className="role-table">
//       <thead>
//         <tr>
//           <th>Role Name</th>
//           <th>Description</th>
//           <th>Action</th>
//         </tr>
//       </thead>
//       <tbody>
//         {rolesLoading ? (
//           <tr>
//             <td colSpan="3" className="table-empty">Loading roles...</td>
//           </tr>
//         ) : roles.length === 0 ? (
//           <tr>
//             <td colSpan="3" className="table-empty">No roles added</td>
//           </tr>
//         ) : (
//           roles.map((role, index) => (
//             <tr key={role.id || role._localId}>
//               <td>{role.role}</td>
//               <td>{role.description || "—"}</td>
//               <td>
//                 <span
//                   className="role-edit"
//                   onClick={() => {
//                     // ✅ Pass role + dept/branch context to CreateNewRole
//                     setEditRole({
//                       ...role,
//                       department: form.branch ? editDept?.id : "",
//                       department_name: editDept?.department_name || "",
//                       branch: form.branch,
//                       branch_name: branchList.find((b) => b.id === Number(form.branch))?.name || "",
//                     });
//                     setEditRoleOnly(true);
//                     setShowNewRole(true);
//                   }}
//                 >
//                   Edit
//                 </span>
//                 <span
//                   className="role-delete-btn"
//                   style={{ marginLeft: 8, cursor: "pointer", color: "red" }}
//                   onClick={() => handleDeleteRole(role)}
//                 >
//                   Delete
//                 </span>
//               </td>
//             </tr>
//           ))
//         )}
//       </tbody>
//     </table>
//   );

//   return (
//     <div className={`create-department-role-container ${showDepartmentRole ? "block" : ""}`}>
//       <div className="create-department-head">
//         <p>{editDept?.id ? "Edit" : "Create New"} Department</p>
//       </div>

//       <form onSubmit={handleSubmit} className="create-department-body">
//         <div className="create-department-content">
//           <Input id="department_name" label="Department Name" placeholder="Enter Department Name" required value={form.department_name} onChange={handleChange} />
//           <Input id="code" label="Code" placeholder="Enter Department Code" required value={form.code} onChange={handleChange} />
//         </div>

//         <Select id="branch" label="Branch" placeholder="Select Branch" required value={form.branch} onChange={handleChange} options={branchList} />

//         <Input id="description" label="Description" placeholder="Enter Description" value={form.description} onChange={handleChange} />

//         <div className="display-role-cointainer-title">
//           <nav>
//             <p>Roles ({roles.length})</p>
//             <button
//               type="button"
//               onClick={() => {
//                 // ✅ Pass dept + branch context so CreateNewRole can inherit them
//                 setEditRole({
//                   department: editDept?.id || null,
//                   department_name: form.department_name,
//                   branch: form.branch,
//                   branch_name: branchList.find((b) => b.id === Number(form.branch))?.name || "",
//                 });
//                 setEditRoleOnly(false);
//                 setShowNewRole(true);
//               }}
//             >
//               + Add Role
//             </button>
//           </nav>
//         </div>

//         <div className="display-role-cointainer">{renderRolesUI()}</div>

//         <div className="create-department-submit-container">
//           <button type="button" className="create-department-cancel" onClick={onClose}>Cancel</button>
//           <button type="submit" className="create-department-save" disabled={isLoading}>
//             {isLoading ? "Saving..." : editDept?.id ? "Update" : "Save"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// const Input = ({ label, id, ...props }) => (
//   <div className="create-department-box">
//     <label htmlFor={id}>{label} {props.required && <sup>*</sup>}</label>
//     <input id={id} {...props} />
//   </div>
// );

// const Select = ({ label, id, options = [], ...props }) => (
//   <div className="create-department-box" id="create-department-box-fullwidth">
//     <label htmlFor={id}>{label} {props.required && <sup>*</sup>}</label>
//     <select id={id} {...props}>
//       <option value="">Select {label}</option>
//       {Array.isArray(options) && options.map((o) => (
//         <option key={o.id} value={o.id}>{o.name}</option>
//       ))}
//     </select>
//   </div>
// );
// import React, { useEffect, useState } from "react";
// import "./createDepartmentrole.css";
// import { toast } from "react-toastify";
// import departmentRoleApiProvider from "../../../network/departmentRole-api-provider";
// import CreateNewRole from "./createNewRole";

// export default function CreateDepartmentRole({
//   showDepartmentRole,
//   editDept,
//   onClose,
// }) {
//   const initialForm = {
//     department_name: "",
//     code: "",
//     branch: "",
//     description: "",
//   };

//   const [form, setForm] = useState(initialForm);
//   const [roles, setRoles] = useState([]);
//   const [branchList, setBranchList] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [rolesLoading, setRolesLoading] = useState(false);

//   // ✅ CreateNewRole state managed internally
//   const [showNewRole, setShowNewRole] = useState(false);
//   const [editRoleOnly, setEditRoleOnly] = useState(false);
//   const [editRole, setEditRole] = useState({});

//   /* ================= LOAD BRANCHES ================= */
//   useEffect(() => {
//     const loadBranches = async () => {
//       try {
//         const res = await departmentRoleApiProvider.fetchBranches();
//         const branches = res?.data?.data || [];
//         setBranchList(Array.isArray(branches) ? branches : []);
//       } catch {
//         toast.error("Failed to load branches");
//         setBranchList([]);
//       }
//     };
//     loadBranches();
//   }, []);

//   /* ================= PREFILL EDIT MODE ================= */
//   useEffect(() => {
//   if (!editDept?.id) {
//     setForm(initialForm);
//     setRoles([]);
//     return;
//   }

//   setForm({
//     department_name: editDept.department_name || "",
//     code: editDept.code || "",
//     branch: typeof editDept.branch === "object" ? editDept.branch.id : editDept.branch || "",
//     description: editDept.description || "",
//   });

//   // ✅ Fetch full department with roles
//  const loadDepartment = async () => {
//   setRolesLoading(true);
//   try {
//     const res = await departmentRoleApiProvider.fetchDepartmentById(editDept.id);
//     console.log("FULL RES:", res);
//     console.log("res.data:", res?.data);
//     console.log("res.data.data:", res?.data?.data);
//     console.log("res.data.roles:", res?.data?.roles);
//     console.log("res.data.data.roles:", res?.data?.data?.roles);
    
//     const roles = res?.data?.roles || res?.data?.data?.roles || [];
//     console.log("FINAL ROLES:", roles);
//     setRoles(roles);
//   } catch (err) {
//     console.log("ERROR:", err);
//     toast.error("Failed to load roles");
//   } finally {
//     setRolesLoading(false);
//   }
// };

//   loadDepartment();
// }, [editDept]);

//   /* ================= FETCH ROLES (edit mode) ================= */
//   // const fetchRoles = async (id) => {
//   //   setRolesLoading(true);
//   //   try {
//   //     const res = await departmentRoleApiProvider.fetchRoles(id);
//   //     setRoles(Array.isArray(res) ? res : []);
//   //   } catch {
//   //     toast.error("Failed to load roles");
//   //   } finally {
//   //     setRolesLoading(false);
//   //   }
//   // };

//   /* ================= ROLE SAVED (from CreateNewRole) ================= */
//   const handleRoleSaved = (roleData) => {
//     setRoles((prev) => {
//       const existingIndex = prev.findIndex((r) =>
//         r.id ? r.id === roleData.id : r._localId === roleData._localId
//       );

//       if (existingIndex !== -1) {
//         // ✅ update existing
//         const updated = [...prev];
//         updated[existingIndex] = roleData;
//         return updated;
//       }

//       // ✅ add new with temp local id
//       return [...prev, { ...roleData, _localId: Date.now() }];
//     });
//   };

//   /* ================= DELETE ROLE (local) ================= */
//   const handleDeleteRole = (role) => {
//     if (!window.confirm("Delete this role?")) return;
//     setRoles((prev) =>
//       prev.filter((r) =>
//         r.id ? r.id !== role.id : r._localId !== role._localId
//       )
//     );
//   };

//   /* ================= INPUT CHANGE ================= */
//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     if (id === "department_name" && !/^[a-zA-Z\s]*$/.test(value)) return;
//     if (id === "code" && !/^[a-zA-Z0-9]*$/.test(value)) return;
//     if (id === "description" && value.length > 500) return;
//     setForm((prev) => ({
//       ...prev,
//       [id]: id === "branch" ? Number(value) : value,
//     }));
//   };

//   /* ================= SUBMIT DEPARTMENT ================= */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     // ✅ strip local-only fields before sending
//     const cleanRoles = roles.map(
//       ({
//         _localId,
//         department_name,
//         branch_name,
//         is_active,
//         created_at,
//         updated_at,
//         created_by,
//         updated_by,
//         ...rest
//       }) => rest
//     );

//     const payload = {
//       ...form,
//       roles: cleanRoles,
//     };

//     console.log("Department payload:", payload);

//     try {
//       if (editDept?.id) {
//         await departmentRoleApiProvider.updateDepartment(editDept.id, payload);
//         toast.success("Department updated successfully");
//       } else {
//         await departmentRoleApiProvider.createDepartment(payload);
//         toast.success("Department created successfully");
//       }
//       onClose();
//     } catch {
//       toast.error("Save failed");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   /* ================= OPEN ADD ROLE ================= */
//   const openAddRole = () => {
//     setEditRole({
//       department: editDept?.id || null,
//       department_name: form.department_name,
//       branch: form.branch,
//       branch_name:
//         branchList.find((b) => b.id === Number(form.branch))?.name || "",
//     });
//     setEditRoleOnly(false);
//     setShowNewRole(true);
//   };

//   /* ================= OPEN EDIT ROLE ================= */
//   const openEditRole = (role) => {
//     setEditRole({
//       ...role,
//       department: editDept?.id || null,
//       department_name: form.department_name,
//       branch: form.branch,
//       branch_name:
//         branchList.find((b) => b.id === Number(form.branch))?.name || "",
//     });
//     setEditRoleOnly(true);
//     setShowNewRole(true);
//   };

//   /* ================= ROLE TABLE ================= */
//   const renderRolesUI = () => (
//     <table className="role-table">
//       <thead>
//         <tr>
//           <th>S.No.</th>
//           <th>Role Name</th>
//           <th>Description</th>
//           <th>Action</th>
//         </tr>
//       </thead>
//       <tbody>
//         {rolesLoading ? (
//           <tr>
//             <td colSpan="4" className="table-empty">
//               Loading roles...
//             </td>
//           </tr>
//         ) : roles.length === 0 ? (
//           <tr>
//             <td colSpan="4" className="table-empty">
//               No roles added
//             </td>
//           </tr>
//         ) : (
//           roles.map((role, index) => (
//             <tr key={role.id || role._localId}>
//               <td>{index + 1}</td>
//               <td>{role.role || "—"}</td>
//               <td>
//                 {role.description
//                   ? role.description.length > 50
//                     ? role.description.slice(0, 50) + "..."
//                     : role.description
//                   : "—"}
//               </td>
//               <td className="role-actions">
//                 <span
//                   className="role-edit"
//                   onClick={() => openEditRole(role)}
//                 >
//                   Edit
//                 </span>
//                 <span
//                   className="role-delete-btn"
//                   onClick={() => handleDeleteRole(role)}
//                 >
//                   Delete
//                 </span>
//               </td>
//             </tr>
//           ))
//         )}
//       </tbody>
//     </table>
//   );

//   /* ================= UI ================= */
//   return (
//     <div
//       className={`create-department-role-container ${
//         showDepartmentRole ? "block" : ""
//       }`}
//     >
//       {/* ✅ CreateNewRole rendered inside — directly wired to handleRoleSaved */}
//       {showNewRole && (
//         <CreateNewRole
//           setShowNewRole={setShowNewRole}
//           editRole={editRole}
//           editRoleOnly={editRoleOnly}
//           setEditRole={setEditRole}
//           setEditRoleOnly={setEditRoleOnly}
//           onRoleSaved={handleRoleSaved}
//         />
//       )}

//       <div className="create-department-head">
//         <p>{editDept?.id ? "Edit" : "Create New"} Department</p>
//       </div>

//       <form onSubmit={handleSubmit} className="create-department-body">
//         <div className="create-department-content">
//           <Input
//             id="department_name"
//             label="Department Name"
//             placeholder="Enter Department Name"
//             required
//             value={form.department_name}
//             onChange={handleChange}
//           />
//           <Input
//             id="code"
//             label="Code"
//             placeholder="Enter Department Code"
//             required
//             value={form.code}
//             onChange={handleChange}
//           />
//         </div>

//         <Select
//           id="branch"
//           label="Branch"
//           required
//           value={form.branch}
//           onChange={handleChange}
//           options={branchList}
//         />

//         <Input
//           id="description"
//           label="Description"
//           placeholder="Enter Description"
//           value={form.description}
//           onChange={handleChange}
//         />

//         {/* ROLES */}
//         <div className="display-role-cointainer-title">
//           <nav>
//             <p>Roles ({roles.length})</p>
//             <button type="button" onClick={openAddRole}>
//               + Add Role
//             </button>
//           </nav>
//         </div>

//         <div className="display-role-cointainer">{renderRolesUI()}</div>

//         <div className="create-department-submit-container">
//           <button
//             type="button"
//             className="create-department-cancel"
//             onClick={onClose}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="create-department-save"
//             disabled={isLoading}
//           >
//             {isLoading ? "Saving..." : editDept?.id ? "Update" : "Save"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// /* ================= INPUT ================= */
// const Input = ({ label, id, ...props }) => (
//   <div className="create-department-box">
//     <label htmlFor={id}>
//       {label} {props.required && <sup>*</sup>}
//     </label>
//     <input id={id} {...props} />
//   </div>
// );

// /* ================= SELECT ================= */
// const Select = ({ label, id, options = [], ...props }) => (
//   <div className="create-department-box" id="create-department-box-fullwidth">
//     <label htmlFor={id}>
//       {label} {props.required && <sup>*</sup>}
//     </label>
//     <select id={id} {...props}>
//       <option value="">Select {label}</option>
//       {Array.isArray(options) &&
//         options.map((o) => (
//           <option key={o.id} value={o.id}>
//             {o.name}
//           </option>
//         ))}
//     </select>
//   </div>
// );
import { useEffect, useRef, useState } from "react";
import "./createDepartmentrole.css";
import { toast } from "react-toastify";
import departmentRoleApiProvider from "../../../network/departmentRole-api-provider";
import CreateNewRole from "./createNewRole";

export default function CreateDepartmentRole({
  showDepartmentRole,
  editDept,
  onClose,
}) {
  const initialForm = {
    department_name: "",
    code: "",
    branch: "",
    description: "",
  };

  const [form, setForm] = useState(initialForm);
  const [roles, setRoles] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [descError, setDescError] = useState("");
  const [showNewRole, setShowNewRole] = useState(false);
  const [editRoleOnly, setEditRoleOnly] = useState(false);
  const [editRole, setEditRole] = useState({});

  /* Three-dot dropdown */
  const [activeActionId, setActiveActionId] = useState(null);
  const actionRef = useRef(null);

  /* ================= CLOSE DROPDOWN ON OUTSIDE CLICK ================= */
  useEffect(() => {
    function handleClickOutside(event) {
      if (actionRef.current && !actionRef.current.contains(event.target)) {
        setActiveActionId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= LOAD BRANCHES ================= */
  useEffect(() => {
    const loadBranches = async () => {
      try {
        const res = await departmentRoleApiProvider.fetchBranches();
        const branches = res?.data?.data || [];
        setBranchList(Array.isArray(branches) ? branches : []);
      } catch {
        toast.error("Failed to load branches");
        setBranchList([]);
      }
    };
    loadBranches();
  }, []);

  /* ================= PREFILL EDIT MODE ================= */
  useEffect(() => {
    if (!editDept?.id) {
      setForm(initialForm);
      setRoles([]);
      return;
    }

    setForm({
      department_name: editDept.department_name || "",
      code: editDept.code || "",
      branch:
        typeof editDept.branch === "object"
          ? editDept.branch.id
          : editDept.branch || "",
      description: editDept.description || "",
    });

    const loadDepartment = async () => {
  setRolesLoading(true);
  try {
    const res = await departmentRoleApiProvider.fetchDepartmentById(editDept.id);
    const dept =
      res?.data?.data ||
      res?.data ||
      res ||
      {};

    // ── update form with FRESH data from detail API ──────────────
    setForm({
      department_name: dept.department_name || editDept.department_name || "",
      code:            dept.code            || editDept.code            || "",
      branch:
        typeof dept.branch === "object"
          ? dept.branch?.id
          : dept.branch || (typeof editDept.branch === "object" ? editDept.branch?.id : editDept.branch) || "",
      description:     dept.description     || editDept.description     || "",
    });

    const roles =
      dept.roles ||
      res?.data?.roles ||
      res?.roles ||
      [];
    setRoles(roles);
  } catch (err) {
    console.log("ERROR:", err);
    toast.error("Failed to load roles");
  } finally {
    setRolesLoading(false);
  }
};

    loadDepartment();
  }, [editDept]);

  /* ================= ROLE SAVED ================= */
  const handleRoleSaved = (roleData) => {
    setRoles((prev) => {
      const existingIndex = prev.findIndex((r) =>
        r.id ? r.id === roleData.id : r._localId === roleData._localId
      );
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = roleData;
        return updated;
      }
      return [...prev, { ...roleData, _localId: Date.now() }];
    });
  };

  /* ================= DELETE ROLE ================= */
  const handleDeleteRole = (role) => {
    if (!window.confirm("Delete this role?")) return;
    setRoles((prev) =>
      prev.filter((r) =>
        r.id ? r.id !== role.id : r._localId !== role._localId
      )
    );
  };

  /* ================= INPUT CHANGE ================= */
  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "department_name" && !/^[a-zA-Z\s]*$/.test(value)) return;
    if (id === "code" && !/^[a-zA-Z0-9]*$/.test(value)) return;
    if (id === "description") {
      if (value.length > 500) {
        setDescError("Description cannot exceed 500 characters");
        return;
      }
      setDescError("");
    }
    setForm((prev) => ({
      ...prev,
      [id]: id === "branch" ? Number(value) : value,
    }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const cleanRoles = roles.map(
      ({
        _localId,
        department_name,
        branch_name,
        is_active,
        created_at,
        updated_at,
        created_by,
        updated_by,
        ...rest
      }) => rest
    );

    const payload = { ...form, roles: cleanRoles };
    console.log("Department payload:", payload);

    try {
      if (editDept?.id) {
        await departmentRoleApiProvider.updateDepartment(editDept.id, payload);
        toast.success("Department updated successfully");
      } else {
        await departmentRoleApiProvider.createDepartment(payload);
        toast.success("Department created successfully");
      }
      onClose();
    } catch {
      toast.error("Save failed");
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= OPEN ADD ROLE ================= */
  const openAddRole = () => {
    setEditRole({
      department: editDept?.id || null,
      department_name: form.department_name,
      branch: form.branch,
      branch_name:
        branchList.find((b) => b.id === Number(form.branch))?.name || "",
    });
    setEditRoleOnly(false);
    setShowNewRole(true);
  };

  /* ================= OPEN EDIT ROLE ================= */
  const openEditRole = (role) => {
    setEditRole({
      ...role,
      department: editDept?.id || null,
      department_name: form.department_name,
      branch: form.branch,
      branch_name:
        branchList.find((b) => b.id === Number(form.branch))?.name || "",
    });
    setEditRoleOnly(true);
    setShowNewRole(true);
  };

  /* ================= ROLE TABLE ================= */
  const renderRolesUI = () => (
    <table className="role-table">
      <thead>
        <tr>
          <th>S.No.</th>
          <th>Role Name</th>
          <th>Description</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {rolesLoading ? (
          <tr>
            <td colSpan="4" className="table-empty">
              Loading roles...
            </td>
          </tr>
        ) : roles.length === 0 ? (
          <tr>
            <td colSpan="4" className="table-empty">
              No roles added
            </td>
          </tr>
        ) : (
          roles.map((role, index) => {
            const roleKey = role.id || role._localId;
            return (
              <tr key={roleKey}>
                <td>{index + 1}</td>
                <td>{role.role || "—"}</td>
                <td>
                  {role.description
                    ? role.description.length > 50
                      ? role.description.slice(0, 50) + "..."
                      : role.description
                    : "—"}
                </td>
                <td className="role-actions">
                  <div
                    className="action-wrapper"
                    ref={activeActionId === roleKey ? actionRef : null}
                  >
                    {/* ✅ Three dot SVG — same as department table */}
                    <svg
                      className="dot-logo-department"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 128 512"
                      style={{ cursor: "pointer", width: "16px" }}
                      onClick={() =>
                        setActiveActionId(
                          activeActionId === roleKey ? null : roleKey
                        )
                      }
                    >
                      <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                    </svg>

                    {activeActionId === roleKey && (
                      <div className="department-dot-container">
                        <div
                          onClick={() => {
                            openEditRole(role);
                            setActiveActionId(null);
                          }}
                        >
                          Edit
                        </div>
                        <div
                          onClick={() => {
                            handleDeleteRole(role);
                            setActiveActionId(null);
                          }}
                        >
                          Delete
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );

  /* ================= UI ================= */
  return (
    <div
      className={`create-department-role-container ${
        showDepartmentRole ? "block" : ""
      }`}
    >
      {showNewRole && (
        <CreateNewRole
          setShowNewRole={setShowNewRole}
          editRole={editRole}
          editRoleOnly={editRoleOnly}
          setEditRole={setEditRole}
          setEditRoleOnly={setEditRoleOnly}
          onRoleSaved={handleRoleSaved}
        />
      )}

      <div className="create-department-head">
        <p>{editDept?.id ? "Edit" : "Create New"} Department</p>
        <nav className="create-department-close" onClick={onClose}>
          <svg className="x-logo-create-department" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
          </svg>
          <p>Close</p>
        </nav>
      </div>

      <form onSubmit={handleSubmit} className="create-department-body">
        <div className="create-department-content">
          <Input
            id="department_name"
            label="Department Name"
            placeholder="Enter Department Name"
            required
            value={form.department_name}
            onChange={handleChange}
          />
          <Input
            id="code"
            label="Code"
            placeholder="Enter Department Code"
            required
            value={form.code}
            onChange={handleChange}
          />
        </div>

        <Select
          id="branch"
          label="Branch"
          required
          value={form.branch}
          onChange={handleChange}
          options={branchList}
        />

        <div className="create-department-box" id="create-department-box-fullwidth">
          <label htmlFor="description">Description</label>
          <input
            id="description"
            placeholder="Enter Description"
            value={form.description}
            onChange={handleChange}
            maxLength={500}
          />
          <span style={{ fontSize: "11px", color: form.description.length >= 490 ? "#ff4d4f" : "#888", textAlign: "right" }}>
            {form.description.length}/500
          </span>
          {descError && <span className="field-error-dept">{descError}</span>}
        </div>

        <div className="display-role-cointainer-title">
          <nav>
            <p>Roles ({roles.length})</p>
            <button type="button" onClick={openAddRole}>
              + Add Role
            </button>
          </nav>
        </div>

        <div className="display-role-cointainer">{renderRolesUI()}</div>

        <div className="create-department-submit-container">
          <button
            type="button"
            className="create-department-cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="create-department-save"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : editDept?.id ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

const Input = ({ label, id, ...props }) => (
  <div className="create-department-box">
    <label htmlFor={id}>
      {label} {props.required && <sup>*</sup>}
    </label>
    <input id={id} {...props} />
  </div>
);

const Select = ({ label, id, options = [], ...props }) => (
  <div className="create-department-box" id="create-department-box-fullwidth">
    <label htmlFor={id}>
      {label} {props.required && <sup>*</sup>}
    </label>
    <select id={id} {...props}>
      <option value="" disabled hidden>Select {label}</option>
      {Array.isArray(options) &&
        options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
    </select>
  </div>
);