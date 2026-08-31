// // // // import React, { useState, useEffect } from "react";
// // // // import "./createUser.css";
// // // // import { toast } from "react-toastify";
// // // // import userApiProvider from "../../../network/user-api-provider";

// // // // export default function CreateUser({
// // // //   showCreateUser,
// // // //   editCreateUser,
// // // //   edituser,
// // // //   fetchUsers,
// // // //   onClose,
// // // // }) {
// // // //   const initialForm = {
// // // //     first_name: "",
// // // //     last_name: "",
// // // //     email: "",
// // // //     contact_number: "",
// // // //     branch: "",
// // // //     department: "",
// // // //     role: "",
// // // //     reporting_to: "",
// // // //     available_branches: [],
// // // //     employee_id: "",
// // // //   };

// // // //   const [createUserForm, setcreateUserForm] = useState(initialForm);
// // // //   const [branchList, setBranchList] = useState([]);
// // // //   const [departmentList, setDepartmentList] = useState([]);
// // // //   const [roleList, setRoleList] = useState([]);
// // // //   const [reportingUsers, setReportingUsers] = useState([]);

// // // //   // ==========================
// // // //   // Prefill on Edit
// // // //   // ==========================
// // // //   useEffect(() => {
// // // //     if (!editCreateUser || !edituser?.id) {
// // // //       setcreateUserForm(initialForm);
// // // //       return;
// // // //     }

// // // //     setcreateUserForm({
// // // //       first_name: edituser.first_name || "",
// // // //       last_name: edituser.last_name || "",
// // // //       email: edituser.email || "",
// // // //       contact_number: edituser.contact_number || "",
// // // //       employee_id: edituser.employee_id || "",
// // // //       branch: edituser.branch?.id || "",
// // // //       department: edituser.department?.id || "",
// // // //       role: edituser.role?.id || "",
// // // //       reporting_to: edituser.reporting_to || "",
// // // //       available_branches: Array.isArray(edituser.available_branches)
// // // //         ? edituser.available_branches.join(", ")
// // // //         : "",
// // // //     });
// // // //   }, [editCreateUser, edituser]);

// // // //   // ==========================
// // // //   // Fetch Branches
// // // //   // ==========================
// // // //   useEffect(() => {
// // // //     const loadBranches = async () => {
// // // //       const branches = await userApiProvider.fetchBranches();
// // // //       setBranchList(branches || []);
// // // //     };
// // // //     loadBranches();
// // // //   }, []);

// // // //   // ==========================
// // // //   // Fetch Departments by Branch
// // // //   // ==========================
// // // //   useEffect(() => {
// // // //     if (!createUserForm.branch) {
// // // //       setDepartmentList([]);
// // // //       return;
// // // //     }

// // // //     const loadDepartments = async () => {
// // // //       const departments = await userApiProvider.fetchDepartments(
// // // //         createUserForm.branch // ✅ branchId
// // // //       );
// // // //       setDepartmentList(departments || []);
// // // //     };

// // // //     loadDepartments();
// // // //   }, [createUserForm.branch]);

// // // //   // ==========================
// // // //   // Fetch Roles by Department
// // // //   // ==========================
// // // //   useEffect(() => {
// // // //     if (!createUserForm.department) {
// // // //       setRoleList([]);
// // // //       return;
// // // //     }

// // // //     const loadRoles = async () => {
// // // //       const roles = await userApiProvider.fetchRoles(
// // // //         createUserForm.department // ✅ departmentId
// // // //       );
// // // //       setRoleList(roles || []);
// // // //     };

// // // //     loadRoles();
// // // //   }, [createUserForm.department]);

// // // //   // ==========================
// // // //   // Fetch Reporting Users
// // // //   // ==========================
// // // //   useEffect(() => {
// // // //     const loadReportingUsers = async () => {
// // // //       const res = await userApiProvider.fetchUsers(1, "");
// // // //       setReportingUsers(res?.users || []);
// // // //     };
// // // //     loadReportingUsers();
// // // //   }, []);

// // // //   // ==========================
// // // //   // Handle Input Change
// // // //   // ==========================
// // // //   const handleFormChange = (e) => {
// // // //     const { id, value } = e.target;

// // // //     setcreateUserForm((prev) => ({
// // // //       ...prev,
// // // //       [id]: value,
// // // //       ...(id === "branch" ? { department: "", role: "" } : {}),
// // // //       ...(id === "department" ? { role: "" } : {}),
// // // //     }));
// // // //   };

// // // //   // ==========================
// // // //   // Submit
// // // //   // ==========================
// // // //   const handleSubmit = async (e) => {
// // // //     e.preventDefault();

// // // //     const payload = {
// // // //       first_name: createUserForm.first_name,
// // // //       last_name: createUserForm.last_name,
// // // //       profile: {
// // // //         contact_number: createUserForm.contact_number,
// // // //         branch: createUserForm.branch,
// // // //         department: createUserForm.department,
// // // //         role: createUserForm.role,
// // // //         reporting_to: createUserForm.reporting_to || null,
// // // //         available_branches: createUserForm.available_branches
// // // //           .split(",")
// // // //           .map((b) => b.trim())
// // // //           .filter(Boolean),
// // // //         employee_id: createUserForm.employee_id,
// // // //       },
// // // //     };

// // // //     const response = editCreateUser
// // // //       ? await userApiProvider.updateUser(edituser.id, payload)
// // // //       : await userApiProvider.createUser({
// // // //           ...payload,
// // // //           email: createUserForm.email,
// // // //           password: "defaultPassword123",
// // // //         });

// // // //     if (response) {
// // // //       toast.success(editCreateUser ? "User updated" : "User created");
// // // //       onClose();
// // // //       fetchUsers();
// // // //     }
// // // //   };

// // // //   // ==========================
// // // //   // UI
// // // //   // ==========================
// // // //   return (
// // // //     <div className={`createuser-container ${showCreateUser ? "block" : ""}`}>
// // // //       <svg
// // // //         className="x-logo-createuser"
// // // //         xmlns="http://www.w3.org/2000/svg"
// // // //         viewBox="0 0 384 512"
// // // //         onClick={onClose}
// // // //       >
// // // //         <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 
// // // //         0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 
// // // //         0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 
// // // //         12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 
// // // //         0L192 301.3 297.4 406.6c12.5 12.5 
// // // //         32.8 12.5 45.3 0s12.5-32.8 
// // // //         0-45.3L237.3 256 342.6 150.6z" />
// // // //       </svg>

// // // //       <div className="createuser-head">
// // // //         <p>{editCreateUser ? "Edit" : "Create New"} User</p>
// // // //       </div>

// // // //       <div className="createuser-body">
// // // //         <form onSubmit={handleSubmit}>
// // // //           <div className="createuser-content">
// // // //             <Input label="First Names" placeholder="Enter Your First Name" required id="first_name" value={createUserForm.first_name} onChange={handleFormChange} />
// // // //             <Input label="Last Name" placeholder="Enter Your Last Name" required id="last_name" value={createUserForm.last_name} onChange={handleFormChange} />
// // // //           </div>

// // // //           <div className="createuser-content">
// // // //             <Input label="Email" placeholder="Enter Your Email" required id="email" disabled={editCreateUser} value={createUserForm.email} onChange={handleFormChange} />
// // // //             <Input label="Contact Number" placeholder="Enter Your Contact Number" id="contact_number" value={createUserForm.contact_number} onChange={handleFormChange} />
// // // //           </div>

// // // //           <div className="createuser-content">
// // // //             <Select label="Branch" placeholder="Select Branch" required id="branch" value={createUserForm.branch} onChange={handleFormChange}
// // // //               options={branchList.map(b => ({ id: b.id, name: b.name }))} />

// // // //             <Select label="Department" placeholder="Select Department" required id="department" value={createUserForm.department} onChange={handleFormChange}
// // // //               options={departmentList.map(d => ({ id: d.id, name: d.department_name }))} />
// // // //           </div>

// // // //           <div className="createuser-content">
// // // //             <Select label="Role" placeholder="Select Role" required id="role" value={createUserForm.role} onChange={handleFormChange}
// // // //               options={roleList.map(r => ({ id: r.id, name: r.role }))} />

// // // //             <Select label="Reporting To" placeholder="Enter Reporting Manager" id="reporting_to" value={createUserForm.reporting_to} onChange={handleFormChange}
// // // //               options={reportingUsers
// // // //                 .filter(u => u.id !== edituser?.id)
// // // //                 .map(u => ({ id: u.id, name: `${u.first_name} ${u.last_name} (${u.email})` }))} />
// // // //           </div>

// // // //           <div className="createuser-content">
// // // //             <Select label="Available Branches" placeholder="Select Avaliables Branch" required id="Available branches" value={createUserForm.available_branches} onChange={handleFormChange}
// // // //               options={branchList.map(b => ({ id: b.id, name: b.name }))} />
// // // //             <Input label="TMS User ID" id="employee_id" disabled={editCreateUser} value={createUserForm.employee_id} onChange={handleFormChange} />
// // // //           </div>

// // // //           <div className="createuser-submit-container">
// // // //             <button type="button" className="createuser-cancel" onClick={onClose}>Cancel</button>
// // // //             <button type="submit" className="createuser-save">Save</button>
// // // //           </div>
// // // //         </form>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // /* ---------- Helper Components ---------- */
// // // // const Input = ({ label, id, ...props }) => (
// // // //   <div className="createuser-box">
// // // //     <label htmlFor={id}>{label}{props.required && <sup>*</sup>}</label>
// // // //     <input id={id} {...props} />
// // // //   </div>
// // // // );

// // // // const Select = ({ label, id, options, ...props }) => (
// // // //   <div className="createuser-box">
// // // //     <label htmlFor={id}>{label}{props.required && <sup>*</sup>}</label>
// // // //     <select id={id} {...props}>
// // // //       <option value="">Select {label}</option>
// // // //       {options.map(opt => (
// // // //         <option key={opt.id} value={opt.id}>{opt.name}</option>
// // // //       ))}
// // // //     </select>
// // // //   </div>
// // // // );
// // // import React, { useState, useEffect } from "react";
// // // import "./createUser.css";
// // // import { toast } from "react-toastify";
// // // import userApiProvider from "../../../network/user-api-provider";

// // // export default function CreateUser({
// // //   showCreateUser,
// // //   editCreateUser,
// // //   edituser,
// // //   fetchUsers,
// // //   onClose,
// // // }) {
// // //   const initialForm = {
// // //     first_name: "",
// // //     last_name: "",
// // //     email: "",
// // //     contact_number: "",
// // //     branch: "",
// // //     department: "",
// // //     role: "",
// // //     reporting_to: "",
// // //     available_branches: [], // ✅ array
// // //     employee_id: "",
// // //   };

// // //   const [createUserForm, setcreateUserForm] = useState(initialForm);
// // //   const [branchList, setBranchList] = useState([]);
// // //   const [departmentList, setDepartmentList] = useState([]);
// // //   const [roleList, setRoleList] = useState([]);
// // //   const [reportingUsers, setReportingUsers] = useState([]);

// // //   /* ==========================
// // //      Prefill on Edit
// // //   ========================== */
// // //   useEffect(() => {
// // //     if (!editCreateUser || !edituser?.id) {
// // //       setcreateUserForm(initialForm);
// // //       return;
// // //     }

// // //     setcreateUserForm({
// // //       first_name: edituser.first_name || "",
// // //       last_name: edituser.last_name || "",
// // //       email: edituser.email || "",
// // //       contact_number: edituser.contact_number || "",
// // //       employee_id: edituser.employee_id || "",
// // //       branch: edituser.branch?.id || "",
// // //       department: edituser.department?.id || "",
// // //       role: edituser.role?.id || "",
// // //       reporting_to: edituser.reporting_to || "",
// // //       available_branches: Array.isArray(edituser.available_branches)
// // //         ? edituser.available_branches
// // //         : [],
// // //     });
// // //   }, [editCreateUser, edituser]);

// // //   /* ==========================
// // //      Fetch Branches
// // //   ========================== */
// // //   useEffect(() => {
// // //     const loadBranches = async () => {
// // //       const branches = await userApiProvider.fetchBranches();
// // //       setBranchList(branches || []);
// // //     };
// // //     loadBranches();
// // //   }, []);

// // //   /* ==========================
// // //      Fetch Departments
// // //   ========================== */
// // //   useEffect(() => {
// // //     if (!createUserForm.branch) {
// // //       setDepartmentList([]);
// // //       return;
// // //     }

// // //     userApiProvider
// // //       .fetchDepartments(createUserForm.branch)
// // //       .then(res => setDepartmentList(res || []));
// // //   }, [createUserForm.branch]);

// // //   /* ==========================
// // //      Fetch Roles
// // //   ========================== */
// // //   useEffect(() => {
// // //     if (!createUserForm.department) {
// // //       setRoleList([]);
// // //       return;
// // //     }

// // //     userApiProvider
// // //       .fetchRoles(createUserForm.department)
// // //       .then(res => setRoleList(res || []));
// // //   }, [createUserForm.department]);

// // //   /* ==========================
// // //      Fetch Reporting Users
// // //   ========================== */
// // //   useEffect(() => {
// // //     userApiProvider.fetchUsers(1, "").then(res => {
// // //       setReportingUsers(res?.users || []);
// // //     });
// // //   }, []);

// // //   /* ==========================
// // //      Handle Change
// // //   ========================== */
// // //   const handleFormChange = (e) => {
// // //     const { id, value, multiple, options } = e.target;

// // //     if (multiple) {
// // //       const selectedValues = Array.from(options)
// // //         .filter(opt => opt.selected)
// // //         .map(opt => opt.value);

// // //       setcreateUserForm(prev => ({
// // //         ...prev,
// // //         [id]: selectedValues,
// // //       }));
// // //       return;
// // //     }

// // //     setcreateUserForm(prev => ({
// // //       ...prev,
// // //       [id]: value,
// // //       ...(id === "branch" ? { department: "", role: "" } : {}),
// // //       ...(id === "department" ? { role: "" } : {}),
// // //     }));
// // //   };

// // //   /* ==========================
// // //      Submit
// // //   ========================== */
// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();

// // //     const payload = {
// // //       first_name: createUserForm.first_name,
// // //       last_name: createUserForm.last_name,
// // //       profile: {
// // //         contact_number: createUserForm.contact_number,
// // //         branch: createUserForm.branch,
// // //         department: createUserForm.department,
// // //         role: createUserForm.role,
// // //         reporting_to: createUserForm.reporting_to || null,
// // //         available_branches: createUserForm.available_branches, // ✅ array
// // //         employee_id: createUserForm.employee_id,
// // //       },
// // //     };

// // //     const response = editCreateUser
// // //       ? await userApiProvider.updateUser(edituser.id, payload)
// // //       : await userApiProvider.createUser({
// // //           ...payload,
// // //           email: createUserForm.email,
// // //           password: "defaultPassword123",
// // //         });

// // //     if (response) {
// // //       toast.success(editCreateUser ? "User updated" : "User created");
// // //       onClose();
// // //       fetchUsers();
// // //     }
// // //   };

// // //   /* ==========================
// // //      UI
// // //   ========================== */
// // //   return (
// // //     <div className={`createuser-container ${showCreateUser ? "block" : ""}`}>
// // //       <div className="createuser-head">
// // //         <p>{editCreateUser ? "Edit" : "Create New"} User</p>
// // //       </div>

// // //       <div className="createuser-body">
// // //         <form onSubmit={handleSubmit}>
// // //           <div className="createuser-content">
// // //             <Input label="First Name" placeholder="Enter Your First Name" required id="first_name" value={createUserForm.first_name} onChange={handleFormChange} />
// // //             <Input label="Last Name" placeholder="Enter Your Last Name" required id="last_name" value={createUserForm.last_name} onChange={handleFormChange} />
// // //           </div>

// // //           <div className="createuser-content">
// // //             <Input label="Email" placeholder="Enter Your Email" required id="email" disabled={editCreateUser} value={createUserForm.email} onChange={handleFormChange} />
// // //             <Input label="Contact Number" placeholder="Enter Your Contact Number" id="contact_number" value={createUserForm.contact_number} onChange={handleFormChange} />
// // //           </div>

// // //           <div className="createuser-content">
// // //             <Select label="Branch" placeholder="Select Branch" required id="branch" value={createUserForm.branch} onChange={handleFormChange}
// // //               options={branchList.map(b => ({ id: b.id, name: b.name }))} />

// // //             <Select label="Department" placeholder="Select Department" required id="department" value={createUserForm.department} onChange={handleFormChange}
// // //               options={departmentList.map(d => ({ id: d.id, name: d.department_name }))} />
// // //           </div>

// // //           <div className="createuser-content">
// // //             <Select label="Role" placeholder="Select Role" required id="role" value={createUserForm.role} onChange={handleFormChange}
// // //               options={roleList.map(r => ({ id: r.id, name: r.role }))} />

// // //             <Select label="Reporting To" placeholder="Enter Reporting Manager" id="reporting_to" value={createUserForm.reporting_to} onChange={handleFormChange}
// // //               options={reportingUsers.map(u => ({
// // //                 id: u.id,
// // //                 name: `${u.first_name} ${u.last_name}`,
// // //               }))} />
// // //           </div>

// // //           <div className="createuser-content">
// // //             {/* ✅ MULTI SELECT */}
// // //             <Select
// // //              label="Available Branches"
// // //              id="available_branches"
// // //              placeholder="Select Available Branches"
// // //               required
// // //                 // ✅ this is the ONLY difference
// // //              value={createUserForm.available_branches}
// // //              onChange={handleFormChange}
// // //              options={branchList.map(b => ({
// // //             id: b.id,
// // //             name: b.name,
// // //             }))}
// // //         />
// // //             <Input label="TMS User ID" placeholder="Enter Your TMS User ID" id="employee_id" disabled={editCreateUser} value={createUserForm.employee_id} onChange={handleFormChange} />
// // //           </div>

// // //           <div className="createuser-submit-container">
// // //             <button type="button" className="createuser-cancel" onClick={onClose}>Cancel</button>
// // //             <button type="submit" className="createuser-save">Save</button>
// // //           </div>
// // //         </form>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // /* ---------- Helper Components ---------- */
// // // const Input = ({ label, id, ...props }) => (
// // //   <div className="createuser-box">
// // //     <label htmlFor={id}>{label}{props.required && <sup>*</sup>}</label>
// // //     <input id={id} {...props} />
// // //   </div>
// // // );

// // // const Select = ({ label, id, options, ...props }) => (
// // //   <div className="createuser-box">
// // //     <label htmlFor={id}>{label}{props.required && <sup>*</sup>}</label>
// // //     <select id={id} {...props}>
// // //       {!props.multiple && <option value="">Select {label}</option>}
// // //       {options.map(opt => (
// // //         <option key={opt.id} value={opt.id}>{opt.name}</option>
// // //       ))}
// // //     </select>
// // //   </div>
// // // );
// // import React, { useState, useEffect } from "react";
// // import "./createUser.css";
// // import { toast } from "react-toastify";
// // import userApiProvider from "../../../network/user-api-provider";

// // export default function CreateUser({
// //   showCreateUser,
// //   editCreateUser,
// //   edituser,
// //   fetchUsers,
// //   onClose,
// // }) {
// //   const initialForm = {
// //     first_name: "",
// //     last_name: "",
// //     email: "",
// //     contact_number: "",
// //     branch: "",
// //     department: "",
// //     role: "",
// //     reporting_to: "",
// //     available_branches: "", // ✅ Changed back to string
// //     employee_id: "",
// //   };

// //   const [createUserForm, setcreateUserForm] = useState(initialForm);
// //   const [branchList, setBranchList] = useState([]);
// //   const [departmentList, setDepartmentList] = useState([]);
// //   const [roleList, setRoleList] = useState([]);
// //   const [reportingUsers, setReportingUsers] = useState([]);

// //   /* ==========================
// //      Prefill on Edit
// //   ========================== */
// //   useEffect(() => {
// //     if (!editCreateUser || !edituser?.id) {
// //       setcreateUserForm(initialForm);
// //       return;
// //     }

// //     setcreateUserForm({
// //       first_name: edituser.first_name || "",
// //       last_name: edituser.last_name || "",
// //       email: edituser.email || "",
// //       contact_number: edituser.contact_number || "",
// //       employee_id: edituser.employee_id || "",
// //       branch: edituser.branch?.id || "",
// //       department: edituser.department?.id || "",
// //       role: edituser.role?.id || "",
// //       reporting_to: edituser.reporting_to || "",
// //       // ✅ Convert array to comma-separated string
// //       available_branches: Array.isArray(edituser.available_branches)
// //         ? edituser.available_branches.join(", ")
// //         : "",
// //     });
// //   }, [editCreateUser, edituser]);

// //   /* ==========================
// //      Fetch Branches
// //   ========================== */
// //   useEffect(() => {
// //     const loadBranches = async () => {
// //       const branches = await userApiProvider.fetchBranches();
// //       console.log("Loaded branches:", branches);
// //       setBranchList(Array.isArray(branches) ? branches : []);
// //     };
// //     loadBranches();
// //   }, []);

// //   /* ==========================
// //      Fetch Departments
// //   ========================== */
// //   useEffect(() => {
// //     if (!createUserForm.branch) {
// //       setDepartmentList([]);
// //       return;
// //     }

// //     const loadDepartments = async () => {
// //       const departments = await userApiProvider.fetchDepartments(createUserForm.branch);
// //       console.log("Loaded departments:", departments);
// //       setDepartmentList(Array.isArray(departments) ? departments : []);
// //     };

// //     loadDepartments();
// //   }, [createUserForm.branch]);

// //   /* ==========================
// //      Fetch Roles
// //   ========================== */
// //   useEffect(() => {
// //     if (!createUserForm.department) {
// //       setRoleList([]);
// //       return;
// //     }

// //     const loadRoles = async () => {
// //       const roles = await userApiProvider.fetchRoles(createUserForm.department);
// //       console.log("Loaded roles:", roles);
// //       setRoleList(Array.isArray(roles) ? roles : []);
// //     };

// //     loadRoles();
// //   }, [createUserForm.department]);

// //   /* ==========================
// //      Fetch Reporting Users
// //   ========================== */
// //   useEffect(() => {
// //     const loadReportingUsers = async () => {
// //       const res = await userApiProvider.fetchUsers(1, "");
// //       console.log("Loaded reporting users:", res);
// //       setReportingUsers(Array.isArray(res?.users) ? res.users : []);
// //     };
// //     loadReportingUsers();
// //   }, []);

// //   /* ==========================
// //      Handle Change
// //   ========================== */
// //   const handleFormChange = (e) => {
// //     const { id, value } = e.target;

// //     setcreateUserForm(prev => ({
// //       ...prev,
// //       [id]: value,
// //       ...(id === "branch" ? { department: "", role: "" } : {}),
// //       ...(id === "department" ? { role: "" } : {}),
// //     }));
// //   };

// //   /* ==========================
// //      Submit
// //   ========================== */
// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     const payload = {
// //       first_name: createUserForm.first_name,
// //       last_name: createUserForm.last_name,
// //       profile: {
// //         contact_number: createUserForm.contact_number,
// //         branch: createUserForm.branch,
// //         department: createUserForm.department,
// //         role: createUserForm.role,
// //         reporting_to: createUserForm.reporting_to || null,
// //         // ✅ Convert comma-separated string to array
// //         available_branches: createUserForm.available_branches
// //           .split(",")
// //           .map(b => b.trim())
// //           .filter(Boolean),
// //         employee_id: createUserForm.employee_id,
// //       },
// //     };

// //     const response = editCreateUser
// //       ? await userApiProvider.updateUser(edituser.id, payload)
// //       : await userApiProvider.createUser({
// //           ...payload,
// //           email: createUserForm.email,
// //           password: "defaultPassword123",
// //         });

// //     if (response) {
// //       onClose();
// //       fetchUsers();
// //     }
// //   };

// //   /* ==========================
// //      UI
// //   ========================== */
// //   return (
// //     <div className={`createuser-container ${showCreateUser ? "block" : ""}`}>
// //       <div className="createuser-head">
// //         <p>{editCreateUser ? "Edit" : "Create New"} User</p>
// //         <svg
// //           className="x-logo-createuser"
// //           xmlns="http://www.w3.org/2000/svg"
// //           viewBox="0 0 384 512"
// //           onClick={onClose}
// //         >
// //           <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
// //         </svg>
// //       </div>

// //       <div className="createuser-body">
// //         <form onSubmit={handleSubmit}>
// //           <div className="createuser-content">
// //             <Input 
// //               label="First Name" 
// //               placeholder="Enter Your First Name" 
// //               required 
// //               id="first_name" 
// //               value={createUserForm.first_name} 
// //               onChange={handleFormChange} 
// //             />
// //             <Input 
// //               label="Last Name" 
// //               placeholder="Enter Your Last Name" 
// //               required 
// //               id="last_name" 
// //               value={createUserForm.last_name} 
// //               onChange={handleFormChange} 
// //             />
// //           </div>

// //           <div className="createuser-content">
// //             <Input 
// //               label="Email" 
// //               placeholder="Enter Your Email" 
// //               required 
// //               id="email" 
// //               type="email"
// //               disabled={editCreateUser} 
// //               value={createUserForm.email} 
// //               onChange={handleFormChange} 
// //             />
// //             <Input 
// //               label="Contact Number" 
// //               placeholder="Enter Your Contact Number" 
// //               id="contact_number" 
// //               value={createUserForm.contact_number} 
// //               onChange={handleFormChange} 
// //             />
// //           </div>

// //           <div className="createuser-content">
// //             <Select 
// //               label="Branch" 
// //               required 
// //               id="branch" 
// //               value={createUserForm.branch} 
// //               onChange={handleFormChange}
// //               options={branchList.map(b => ({ id: b.id, name: b.name }))} 
// //             />

// //             <Select 
// //               label="Department" 
// //               required 
// //               id="department" 
// //               value={createUserForm.department} 
// //               onChange={handleFormChange}
// //               options={departmentList.map(d => ({ id: d.id, name: d.department_name }))} 
// //             />
// //           </div>

// //           <div className="createuser-content">
// //             <Select 
// //               label="Role" 
// //               required 
// //               id="role" 
// //               value={createUserForm.role} 
// //               onChange={handleFormChange}
// //               options={roleList.map(r => ({ id: r.id, name: r.role }))} 
// //             />

// //             <Select 
// //               label="Reporting To" 
// //               id="reporting_to" 
// //               value={createUserForm.reporting_to} 
// //               onChange={handleFormChange}
// //               options={reportingUsers
// //                 .filter(u => u.id !== edituser?.id)
// //                 .map(u => ({ 
// //                   id: u.id, 
// //                   name: `${u.first_name} ${u.last_name}` 
// //                 }))} 
// //             />
// //           </div>

// //           <div className="createuser-content">
// //             {/* ✅ Changed back to regular Input (comma-separated) */}
// //              <Select 
// //               label="Available Branches" 
// //               required 
// //               id="available_branches" 
// //               value={createUserForm.branch} 
// //               onChange={handleFormChange}
// //               options={branchList.map(b => ({ id: b.id, name: b.name }))} 
// //             />
// //             <Input 
// //               label="TMS User ID" 
// //               placeholder="Enter Your TMS User ID" 
// //               id="employee_id" 
// //               disabled={editCreateUser} 
// //               value={createUserForm.employee_id} 
// //               onChange={handleFormChange} 
// //             />
// //           </div>

// //           <div className="createuser-submit-container">
// //             <button type="button" className="createuser-cancel" onClick={onClose}>
// //               Cancel
// //             </button>
// //             <button type="submit" className="createuser-save">
// //               Save
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }

// // /* ---------- Helper Components ---------- */
// // const Input = ({ label, id, ...props }) => (
// //   <div className="createuser-box">
// //     <label htmlFor={id}>
// //       {label}
// //       {props.required && <sup>*</sup>}
// //     </label>
// //     <input id={id} {...props} />
// //   </div>
// // );

// // const Select = ({ label, id, options, ...props }) => (
// //   <div className="createuser-box">
// //     <label htmlFor={id}>
// //       {label}
// //       {props.required && <sup>*</sup>}
// //     </label>
// //     <select id={id} {...props}>
// //       <option value="">Select {label}</option>
// //       {options.map(opt => (
// //         <option key={opt.id} value={opt.id}>
// //           {opt.name}
// //         </option>
// //       ))}
// //     </select>
// //   </div>
// // );
// import React, { useState, useEffect } from "react";
// import "./createUser.css";
// import { toast } from "react-toastify";
// import userApiProvider from "../../../network/user-api-provider";

// export default function CreateUser({
//   showCreateUser,
//   editCreateUser,
//   edituser,
//   fetchUsers,
//   onClose,
// }) {
//   const initialForm = {
//     first_name: "",
//     last_name: "",
//     email: "",
//     contact_number: "",
//     branch: "",
//     department: "",
//     role: "",
//     reporting_to: "",
//     available_branches: [], // ✅ Array for multi-select
//     employee_id: "",
//   };

//   const [createUserForm, setcreateUserForm] = useState(initialForm);
//   const [branchList, setBranchList] = useState([]);
//   const [departmentList, setDepartmentList] = useState([]);
//   const [roleList, setRoleList] = useState([]);
//   const [reportingUsers, setReportingUsers] = useState([]);

//   /* ==========================
//      Prefill on Edit
//   ========================== */
//   useEffect(() => {
//     if (!editCreateUser || !edituser?.id) {
//       setcreateUserForm(initialForm);
//       return;
//     }

//     // ✅ Extract branch IDs from available_branches array
//     const availableBranchIds = Array.isArray(edituser.available_branches)
//       ? edituser.available_branches.map(b => String(b.id))
//       : [];

//     setcreateUserForm({
//       first_name: edituser.first_name || "",
//       last_name: edituser.last_name || "",
//       email: edituser.email || "",
//       contact_number: edituser.contact_number || "",
//       employee_id: edituser.employee_id || "",
//       branch: edituser.branch?.id || "",
//       department: edituser.department?.id || "",
//       role: edituser.role?.id || "",
//       reporting_to: edituser.reporting_to || "",
//       available_branches: availableBranchIds, // ✅ Array of branch IDs
//     });
//   }, [editCreateUser, edituser]);

//   /* ==========================
//      Fetch Branches
//   ========================== */
//   useEffect(() => {
//     const loadBranches = async () => {
//       const branches = await userApiProvider.fetchBranches();
//       console.log("Loaded branches:", branches);
//       setBranchList(Array.isArray(branches) ? branches : []);
//     };
//     loadBranches();
//   }, []);

//   /* ==========================
//      Fetch Departments
//   ========================== */
//   useEffect(() => {
//     if (!createUserForm.branch) {
//       setDepartmentList([]);
//       return;
//     }

//     const loadDepartments = async () => {
//       const departments = await userApiProvider.fetchDepartments(createUserForm.branch);
//       console.log("Loaded departments:", departments);
//       setDepartmentList(Array.isArray(departments) ? departments : []);
//     };

//     loadDepartments();
//   }, [createUserForm.branch]);

//   /* ==========================
//      Fetch Roles
//   ========================== */
//   useEffect(() => {
//     if (!createUserForm.department) {
//       setRoleList([]);
//       return;
//     }

//     const loadRoles = async () => {
//       const roles = await userApiProvider.fetchRoles(createUserForm.department);
//       console.log("Loaded roles:", roles);
//       setRoleList(Array.isArray(roles) ? roles : []);
//     };

//     loadRoles();
//   }, [createUserForm.department]);

//   /* ==========================
//      Fetch Reporting Users
//   ========================== */
//   useEffect(() => {
//   const loadReportingUsers = async () => {
//     const res = await userApiProvider.fetchUsers(1, "");
//     console.log("Loaded reporting users:", res);
//     // ✅ FIX: API returns { users: { data: [...] } }
//     const users = res?.users?.data || [];
//     setReportingUsers(users);
//   };
//   loadReportingUsers();
// }, []);

//   /* ==========================
//      Handle Change
//   ========================== */
//   const handleFormChange = (e) => {
//     const { id, value, multiple, options } = e.target;

//     // ✅ Handle multi-select for available_branches
//     if (multiple && id === "available_branches") {
//       const selectedValues = Array.from(options)
//         .filter(opt => opt.selected)
//         .map(opt => opt.value);

//       setcreateUserForm(prev => ({
//         ...prev,
//         available_branches: selectedValues,
//       }));
//       return;
//     }

//     setcreateUserForm(prev => ({
//       ...prev,
//       [id]: value,
//       ...(id === "branch" ? { department: "", role: "" } : {}),
//       ...(id === "department" ? { role: "" } : {}),
//     }));
//   };

//   /* ==========================
//      Submit
//   ========================== */
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const payload = {
//       first_name: createUserForm.first_name,
//       last_name: createUserForm.last_name,
//       profile: {
//         contact_number: createUserForm.contact_number,
//         branch: createUserForm.branch,
//         department: createUserForm.department,
//         role: createUserForm.role,
//         reporting_to: createUserForm.reporting_to || null,
//         // ✅ Convert to numbers for API
//         available_branches: createUserForm.available_branches.map(id => Number(id)),
//         employee_id: createUserForm.employee_id,
//       },
//     };

//     const response = editCreateUser
//       ? await userApiProvider.updateUser(edituser.id, payload)
//       : await userApiProvider.createUser({
//           ...payload,
//           email: createUserForm.email,
//           password: "defaultPassword123",
//         });

//     if (response) {
//       onClose();
//       fetchUsers();
//     }
//   };

//   /* ==========================
//      UI
//   ========================== */
//   return (
//     <div className={`createuser-container ${showCreateUser ? "block" : ""}`}>
//       <div className="createuser-head">
//         <p>{editCreateUser ? "Edit" : "Create New"} User</p>
//         <svg
//           className="x-logo-createuser"
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 384 512"
//           onClick={onClose}
//         >
//           <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
//         </svg>
//       </div>

//       <div className="createuser-body">
//         <form onSubmit={handleSubmit}>
//           <div className="createuser-content">
//             <Input 
//               label="First Name" 
//               placeholder="Enter Your First Name" 
//               required 
//               id="first_name" 
//               value={createUserForm.first_name} 
//               onChange={handleFormChange} 
//             />
//             <Input 
//               label="Last Name" 
//               placeholder="Enter Your Last Name" 
//               required 
//               id="last_name" 
//               value={createUserForm.last_name} 
//               onChange={handleFormChange} 
//             />
//           </div>

//           <div className="createuser-content">
//             <Input 
//               label="Email" 
//               placeholder="Enter Your Email" 
//               required 
//               id="email" 
//               type="email"
//               disabled={editCreateUser} 
//               value={createUserForm.email} 
//               onChange={handleFormChange} 
//             />
//             <Input 
//               label="Contact Number" 
//               placeholder="Enter Your Contact Number" 
//               id="contact_number" 
//               value={createUserForm.contact_number} 
//               onChange={handleFormChange} 
//             />
//           </div>

//           <div className="createuser-content">
//             <Select 
//               label="Branch" 
//               required 
//               id="branch" 
//               value={createUserForm.branch} 
//               onChange={handleFormChange}
//               options={branchList.map(b => ({ id: b.id, name: b.name }))} 
//             />

//             <Select 
//               label="Department" 
//               required 
//               id="department" 
//               value={createUserForm.department} 
//               onChange={handleFormChange}
//               options={departmentList.map(d => ({ id: d.id, name: d.department_name }))} 
//             />
//           </div>

//           <div className="createuser-content">
//             <Select 
//               label="Role" 
//               required 
//               id="role" 
//               value={createUserForm.role} 
//               onChange={handleFormChange}
//               options={roleList.map(r => ({ id: r.id, name: r.role }))} 
//             />

//             {/* ✅ FIX 2: Reporting To - Uses fetched users */}
//             <Select 
//               label="Reporting To" 
//               id="reporting_to" 
//               value={createUserForm.reporting_to} 
//               onChange={handleFormChange}
//               options={reportingUsers
//                 .filter(u => u.id !== edituser?.id) // Don't report to yourself
//                 .map(u => ({ 
//                   id: u.id, 
//                   name: `${u.first_name} ${u.last_name}` 
//                 }))} 
//             />
//           </div>

//           <div className="createuser-content">
//             {/* ✅ FIX 1: Available Branches - Multi-select */}
//             <MultiSelect
//               label="Available Branches"
//               id="available_branches"
//               required
//               value={createUserForm.available_branches}
//               onChange={handleFormChange}
//               options={branchList.map(b => ({ id: b.id, name: b.name }))}
//             />
            
//             <Input 
//               label="TMS User ID" 
//               placeholder="Enter Your TMS User ID" 
//               id="employee_id" 
//               disabled={editCreateUser} 
//               value={createUserForm.employee_id} 
//               onChange={handleFormChange} 
//             />
//           </div>

//           <div className="createuser-submit-container">
//             <button type="button" className="createuser-cancel" onClick={onClose}>
//               Cancel
//             </button>
//             <button type="submit" className="createuser-save">
//               Save
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// /* ---------- Helper Components ---------- */
// const Input = ({ label, id, ...props }) => (
//   <div className="createuser-box">
//     <label htmlFor={id}>
//       {label}
//       {props.required && <sup>*</sup>}
//     </label>
//     <input id={id} {...props} />
//   </div>
// );

// const Select = ({ label, id, options, ...props }) => (
//   <div className="createuser-box">
//     <label htmlFor={id}>
//       {label}
//       {props.required && <sup>*</sup>}
//     </label>
//     <select id={id} {...props}>
//       <option value="">Select {label}</option>
//       {options.map(opt => (
//         <option key={opt.id} value={opt.id}>
//           {opt.name}
//         </option>
//       ))}
//     </select>
//   </div>
// );

// // ✅ NEW: Multi-Select Component for Available Branches
// const MultiSelect = ({ label, id, options, value, onChange, ...props }) => (
//   <div className="createuser-box">
//     <label htmlFor={id}>
//       {label}
//       {props.required && <sup>*</sup>}
//     </label>
//     <select 
//       id={id} 
//       multiple 
//       value={value || []} 
//       onChange={onChange}
//       {...props}
//       style={{ minHeight: '80px' }} // ✅ Better height for multi-select
//     >
//       {options.map(opt => (
//         <option key={opt.id} value={opt.id}>
//           {opt.name}
//         </option>
//       ))}
//     </select>
//     <small style={{ fontSize: '11px', color: '#666', marginTop: '4px', display: 'block' }}>
//       Hold Ctrl (Cmd on Mac) to select multiple branches
//     </small>
//   </div>
// );
import React, { useState, useEffect } from "react";
import "./createUser.css";
import userApiProvider from "../../../network/user-api-provider";

export default function CreateUser({
  showCreateUser,
  editCreateUser,
  edituser,
  fetchUsers,
  onClose,
}) {
  const initialForm = {
    first_name: "",
    last_name: "",
    email: "",
    contact_number: "",
    branch: "",
    department: "",
    role: "",
    reporting_to: "",
    available_branches: [],
    employee_id: "",
  };

  const [createUserForm, setcreateUserForm] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});
  const [branchList, setBranchList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [reportingUsers, setReportingUsers] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  /* ==========================
     Prefill on Edit — BUG_21
  ========================== */
  useEffect(() => {
    if (!editCreateUser || !edituser?.id) {
      setcreateUserForm(initialForm);
      setFormErrors({});
      return;
    }

    const availableBranchIds = Array.isArray(edituser.available_branches)
      ? edituser.available_branches.map((b) => String(b?.id ?? b))
      : [];

    setcreateUserForm({
      first_name: edituser.first_name || "",
      last_name: edituser.last_name || "",
      email: edituser.email || "",
      contact_number: edituser.contact_number || "",
      employee_id: edituser.employee_id || "",
      branch: edituser.branch?.id ? String(edituser.branch.id) : "",
      department: edituser.department?.id ? String(edituser.department.id) : "",
      role: edituser.role?.id ? String(edituser.role.id) : "",
      reporting_to: edituser.reporting_to?.id
        ? String(edituser.reporting_to.id)
        : edituser.reporting_to
        ? String(edituser.reporting_to)
        : "",
      available_branches: availableBranchIds,
    });
    setFormErrors({});

    // Pre-fetch cascading dropdowns so values are visible immediately
    if (edituser.branch?.id) {
      userApiProvider
        .fetchDepartments(edituser.branch.id)
        .then((deps) => setDepartmentList(Array.isArray(deps) ? deps : []));
    }
    if (edituser.department?.id) {
      userApiProvider
        .fetchRoles(edituser.department.id)
        .then((roles) => setRoleList(Array.isArray(roles) ? roles : []));
    }
  }, [editCreateUser, edituser]);

  /* ==========================
     Fetch Branches
  ========================== */
  useEffect(() => {
    userApiProvider.fetchBranches().then((b) => setBranchList(Array.isArray(b) ? b : []));
  }, []);

  /* ==========================
     Fetch Departments (on branch change)
  ========================== */
  useEffect(() => {
    if (!createUserForm.branch) {
      setDepartmentList([]);
      return;
    }
    userApiProvider
      .fetchDepartments(createUserForm.branch)
      .then((d) => setDepartmentList(Array.isArray(d) ? d : []));
  }, [createUserForm.branch]);

  /* ==========================
     Fetch Roles (on department change)
  ========================== */
  useEffect(() => {
    if (!createUserForm.department) {
      setRoleList([]);
      return;
    }
    userApiProvider
      .fetchRoles(createUserForm.department)
      .then((r) => setRoleList(Array.isArray(r) ? r : []));
  }, [createUserForm.department]);

  /* ==========================
     Fetch Reporting Users
  ========================== */
  useEffect(() => {
    userApiProvider
      .fetchAllUsers()
      .then((u) => setReportingUsers(Array.isArray(u) ? u : []));
  }, []);

  /* ==========================
     Handle Change
  ========================== */
  const handleFormChange = (e) => {
    const { id, value, multiple, options } = e.target;

    if (formErrors[id]) {
      setFormErrors((prev) => ({ ...prev, [id]: "" }));
    }

    if (multiple && id === "available_branches") {
      const selected = Array.from(options)
        .filter((o) => o.selected)
        .map((o) => o.value);
      setcreateUserForm((prev) => ({ ...prev, available_branches: selected }));
      return;
    }

    setcreateUserForm((prev) => ({
      ...prev,
      [id]: value,
      ...(id === "branch" ? { department: "", role: "" } : {}),
      ...(id === "department" ? { role: "" } : {}),
    }));
  };

  /* ==========================
     Validation — BUG_09/14/15/22
  ========================== */
  const validateForm = () => {
    const errors = {};
    const nameRegex = /^[a-zA-Z\s]+$/;
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    const digitRegex = /^\d+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!createUserForm.first_name.trim()) {
      errors.first_name = "First name is required";
    } else if (!nameRegex.test(createUserForm.first_name.trim())) {
      errors.first_name = "First name must contain only letters";
    }

    if (!createUserForm.last_name.trim()) {
      errors.last_name = "Last name is required";
    } else if (!nameRegex.test(createUserForm.last_name.trim())) {
      errors.last_name = "Last name must contain only letters";
    }

    if (!editCreateUser) {
      if (!createUserForm.email.trim()) {
        errors.email = "Email is required";
      } else if (!emailRegex.test(createUserForm.email.trim())) {
        errors.email = "Please enter a valid email address";
      }
    }

    if (createUserForm.contact_number) {
      if (!digitRegex.test(createUserForm.contact_number)) {
        errors.contact_number = "Contact number must contain digits only";
      } else if (createUserForm.contact_number.length < 10 || createUserForm.contact_number.length > 15) {
        errors.contact_number = "Contact number must be 10–15 digits";
      }
    }

    if (createUserForm.employee_id && !alphanumericRegex.test(createUserForm.employee_id)) {
      errors.employee_id = "TMS User ID must be alphanumeric only";
    }

    return errors;
  };

  /* ==========================
     Submit
  ========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const payload = {
      first_name: createUserForm.first_name.trim(),
      last_name: createUserForm.last_name.trim(),
      email: createUserForm.email.trim(),
      contact_number: createUserForm.contact_number,
      branch: Number(createUserForm.branch),
      department: Number(createUserForm.department),
      role: Number(createUserForm.role),
      reporting_to: createUserForm.reporting_to ? Number(createUserForm.reporting_to) : null,
      available_branches: createUserForm.available_branches.map((id) => Number(id)),
      employee_id: createUserForm.employee_id,
    };

    setSubmitting(true);
    try {
      const response = editCreateUser
        ? await userApiProvider.updateUser(edituser.id, payload)
        : await userApiProvider.createUser(payload);

      if (response) {
        onClose();
        fetchUsers(1);
      }
    } finally {
      setSubmitting(false);
    }
  };

  /* ==========================
     UI
  ========================== */
  return (
    <div className="createuser-container">
      <div className="createuser-head">
        <p>{editCreateUser ? "Edit User" : "Create New Branch User"}</p>
        <nav className="createuser-close" onClick={onClose}>
          <svg className="x-logo-createuser" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
          </svg>
        </nav>
      </div>

      <div className="createuser-body">
        <form onSubmit={handleSubmit}>
          <div className="createuser-content">
            <Input
              label="First Name" placeholder="Enter First Name" required
              id="first_name" value={createUserForm.first_name} onChange={handleFormChange}
              error={formErrors.first_name}
            />
            <Input
              label="Last Name" placeholder="Enter Last Name" required
              id="last_name" value={createUserForm.last_name} onChange={handleFormChange}
              error={formErrors.last_name}
            />
          </div>

          <div className="createuser-content">
            <Input
              label="Email" placeholder="Enter Email Address" required
              id="email" type="email" disabled={editCreateUser}
              value={createUserForm.email} onChange={handleFormChange}
              error={formErrors.email}
            />
            <Input
              label="Contact Number" placeholder="Enter Contact Number"
              id="contact_number" value={createUserForm.contact_number}
              onChange={handleFormChange} error={formErrors.contact_number}
            />
          </div>

          <div className="createuser-content">
            <Select
              label="Branch" required id="branch"
              value={createUserForm.branch} onChange={handleFormChange}
              options={branchList.map((b) => ({ id: b.id, name: b.name }))}
            />
            <Select
              label="Department" required id="department"
              value={createUserForm.department} onChange={handleFormChange}
              options={departmentList.map((d) => ({ id: d.id, name: d.department_name }))}
            />
          </div>

          <div className="createuser-content">
            <Select
              label="Role" required id="role"
              value={createUserForm.role} onChange={handleFormChange}
              options={roleList.map((r) => ({ id: r.id, name: r.role }))}
            />
            <Select
              label="Reporting To" id="reporting_to"
              value={createUserForm.reporting_to} onChange={handleFormChange}
              options={reportingUsers
                .filter((u) => u.id !== edituser?.id)
                .map((u) => ({ id: u.id, name: `${u.first_name || ""} ${u.last_name || ""}`.trim() }))}
            />
          </div>

          <div className="createuser-content">
            <MultiSelect
              label="Available Branches" id="available_branches"
              value={createUserForm.available_branches} onChange={handleFormChange}
              options={branchList.map((b) => ({ id: b.id, name: b.name }))}
            />
            <Input
              label="TMS User ID" placeholder="Enter TMS User ID"
              id="employee_id" disabled={editCreateUser}
              value={createUserForm.employee_id} onChange={handleFormChange}
              error={formErrors.employee_id}
            />
          </div>

          <div className="createuser-submit-container">
            <button type="button" className="createuser-cancel" onClick={onClose} disabled={submitting}>Cancel</button>
            <button type="submit" className="createuser-save" disabled={submitting}>
              {submitting ? (editCreateUser ? "Updating..." : "Saving...") : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------- Helper Components ---------- */
const Input = ({ label, id, error, ...props }) => (
  <div className="createuser-box">
    <label htmlFor={id}>
      {label}
      {props.required && <sup>*</sup>}
    </label>
    <input id={id} {...props} />
    {error && <span className="field-error">{error}</span>}
  </div>
);

/* BUG_23: placeholder option is disabled+hidden so it won't appear as a selectable item */
const Select = ({ label, id, options, error, ...props }) => (
  <div className="createuser-box">
    <label htmlFor={id}>
      {label}
      {props.required && <sup>*</sup>}
    </label>
    <select id={id} {...props}>
      <option value="" disabled hidden>Select {label}</option>
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>{opt.name}</option>
      ))}
    </select>
    {error && <span className="field-error">{error}</span>}
  </div>
);

const MultiSelect = ({ label, id, options, value, onChange, error, ...props }) => (
  <div className="createuser-box">
    <label htmlFor={id}>
      {label}
      {props.required && <sup>*</sup>}
    </label>
    <select id={id} multiple value={value || []} onChange={onChange} style={{ minHeight: "80px" }}>
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>{opt.name}</option>
      ))}
    </select>
    <small style={{ fontSize: "11px", color: "#666", marginTop: "4px", display: "block" }}>
      Hold Ctrl (Cmd on Mac) to select multiple
    </small>
    {error && <span className="field-error">{error}</span>}
  </div>
);