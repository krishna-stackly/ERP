// // import React, { useEffect, useState } from "react";
// // import "./createNewRole.css";
// // import { toast } from "react-toastify";

// // const DEFAULT_ACCESS = {
// //   dashboard: { fullAccess: false, view: false, create: false, edit: false, delete: false },
// //   task: { fullAccess: false, view: false, create: false, edit: false, delete: false },
// //   projectTracker: { fullAccess: false, view: false, create: false, edit: false, delete: false },
// //   onboarding: { fullAccess: false, view: false, create: false, edit: false, delete: false },
// //   attendance: { fullAccess: false, view: false, create: false, edit: false, delete: false },
// // };

// // export default function CreateNewRole({
// //   setShowNewRole,
// //   editRole,
// //   editRoleOnly,
// //   setEditRole,
// //   setEditRoleOnly,
// //   onRoleSaved,
// // }) {
// //   const [inputRoleAccess, setInputRoleAccess] = useState({
// //     role: "",
// //     description: "",
// //     department: "",
// //     branch: "",
// //     access: DEFAULT_ACCESS,
// //   });

// //   /* ================= PREFILL ================= */
// //   useEffect(() => {
// //     if (!editRole) return;

// //     if (editRoleOnly && editRole?.id) {
// //       setInputRoleAccess({
// //         role: editRole.role || "",
// //         description: editRole.description || "",
// //         department: editRole.department || "",
// //         branch: editRole.branch || "",
// //         access: buildAccess(editRole.permissions),
// //       });
// //     } else {
// //       setInputRoleAccess({
// //         role: "",
// //         description: "",
// //         department: editRole.department || "",
// //         branch: editRole.branch || "",
// //         access: DEFAULT_ACCESS,
// //       });
// //     }
// //   }, [editRoleOnly, editRole]);

// //   function buildAccess(permissions) {
// //     if (!permissions) return DEFAULT_ACCESS;
// //     const merged = {};
// //     Object.keys(DEFAULT_ACCESS).forEach((page) => {
// //       merged[page] = { ...DEFAULT_ACCESS[page], ...(permissions[page] || {}) };
// //     });
// //     return merged;
// //   }

// //   /* ================= PERMISSION CHANGE ================= */
// //   const handlePermissionChange = (e, page) => {
// //     const { id, checked } = e.target;
// //     setInputRoleAccess((prev) => {
// //       const updated = { ...prev.access[page], [id]: checked };
// //       if (id === "fullAccess") {
// //         Object.keys(updated).forEach((k) => (updated[k] = checked));
// //       }
// //       return { ...prev, access: { ...prev.access, [page]: updated } };
// //     });
// //   };

// //   const resetPermissions = () => {
// //     setInputRoleAccess((prev) => ({ ...prev, access: DEFAULT_ACCESS }));
// //   };

// //   /* ================= SUBMIT (local only — no API) ================= */
// //   const handleSubmit = (e) => {
// //     e.preventDefault();

// //     const { role, description, department, branch, access } = inputRoleAccess;

// //     if (!role.trim() || !description.trim()) {
// //       toast.error("Please fill all required fields");
// //       return;
// //     }

// //     const hasPermission = Object.values(access).some((p) =>
// //       Object.values(p).some(Boolean)
// //     );
// //     if (!hasPermission) {
// //       toast.error("Assign at least one permission");
// //       return;
// //     }

// //     // ✅ pass role data back to CreateDepartmentRole — no API call
// //     if (onRoleSaved) {
// //       onRoleSaved({
// //         ...(editRoleOnly && editRole?.id ? { id: editRole.id } : {}),
// //         ...(editRole?._localId ? { _localId: editRole._localId } : {}),
// //         role,
// //         description,
// //         department,
// //         branch,
// //         permissions: access,
// //       });
// //     }

// //     toast.success(editRoleOnly ? "Role updated" : "Role added");
// //     closeModal();
// //   };

// //   /* ================= CLOSE ================= */
// //   const closeModal = () => {
// //     setShowNewRole(false);
// //     setEditRoleOnly(false);
// //     setEditRole({});
// //   };

// //   /* ================= UI ================= */
// //   return (
// //     <div className="create-role-overlay">
// //       <div className="create-newrole-cointainer">
// //         <div className="create-role-head">
// //           <p>{editRoleOnly ? "Edit" : "Create"} Role</p>
// //           <svg
// //             className="x-logo-create-role"
// //             xmlns="http://www.w3.org/2000/svg"
// //             viewBox="0 0 384 512"
// //             onClick={closeModal}
// //             style={{ width: "16px", height: "16px", cursor: "pointer" }}
// //           >
// //             <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 
// //               86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 
// //               41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 
// //               297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 
// //               342.6 150.6z"
// //             />
// //           </svg>
// //         </div>

// //         <form onSubmit={handleSubmit}>
// //           <div className="create-role-grid">
// //             <div className="create-role-box">
// //               <label>Role Name<sup>*</sup></label>
// //               <input
// //                 value={inputRoleAccess.role}
// //                 placeholder="Enter Role Name"
// //                 onChange={(e) =>
// //                   setInputRoleAccess((prev) => ({ ...prev, role: e.target.value }))
// //                 }
// //               />
// //             </div>
// //             <div className="create-role-box">
// //               <label>Description<sup>*</sup></label>
// //               <input
// //                 value={inputRoleAccess.description}
// //                 placeholder="Enter Description"
// //                 onChange={(e) =>
// //                   setInputRoleAccess((prev) => ({ ...prev, description: e.target.value }))
// //                 }
// //               />
// //             </div>
// //           </div>

// //           {/* read-only dept + branch context */}
// //           {editRole?.department_name && (
// //             <div className="create-role-grid">
// //               <div className="create-role-box">
// //                 <label>Department</label>
// //                 <input value={editRole.department_name} disabled />
// //               </div>
// //               {editRole?.branch_name && (
// //                 <div className="create-role-box">
// //                   <label>Branch</label>
// //                   <input value={editRole.branch_name} disabled />
// //                 </div>
// //               )}
// //             </div>
// //           )}

// //           <div className="role-permission-title">
// //             <p>Permission</p>
// //             <button type="button" onClick={resetPermissions}>Reset</button>
// //           </div>

// //           <div className="create-role-table">
// //             <table>
// //               <thead>
// //                 <tr>
// //                   <th>Menu</th>
// //                   <th>Full</th>
// //                   <th>View</th>
// //                   <th>Create</th>
// //                   <th>Edit</th>
// //                   <th>Delete</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {Object.keys(inputRoleAccess.access).map((page) => (
// //                   <tr key={page}>
// //                     <td style={{ textTransform: "capitalize" }}>
// //                       {page.replace(/([A-Z])/g, " $1")}
// //                     </td>
// //                     {["fullAccess", "view", "create", "edit", "delete"].map((perm) => (
// //                       <td key={perm}>
// //                         <input
// //                           type="checkbox"
// //                           id={perm}
// //                           checked={inputRoleAccess.access[page][perm] || false}
// //                           onChange={(e) => handlePermissionChange(e, page)}
// //                         />
// //                       </td>
// //                     ))}
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>

// //           <div className="create-role-submit-container">
// //             <button type="button" className="create-role-cancel" onClick={closeModal}>
// //               Cancel
// //             </button>
// //             <button type="submit" className="create-role-save">
// //               Save
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }
// import React, { useEffect, useState } from "react";
// import "./createNewRole.css";
// import { toast } from "react-toastify";

// const DEFAULT_ACCESS = {
//   dashboard:      { fullAccess: false, view: false, create: false, edit: false, delete: false },
//   task:           { fullAccess: false, view: false, create: false, edit: false, delete: false },
//   projectTracker: { fullAccess: false, view: false, create: false, edit: false, delete: false },
//   onboarding:     { fullAccess: false, view: false, create: false, edit: false, delete: false },
//   attendance:     { fullAccess: false, view: false, create: false, edit: false, delete: false },
// };

// export default function CreateNewRole({
//   setShowNewRole,
//   editRole,
//   editRoleOnly,
//   setEditRole,
//   setEditRoleOnly,
//   onRoleSaved,
// }) {
//   const [inputRoleAccess, setInputRoleAccess] = useState({
//     role:        "",
//     description: "",
//     department:  "",
//     branch:      "",
//     access:      DEFAULT_ACCESS,
//   });

//   /* ── PREFILL ── */
//   useEffect(() => {
//     if (!editRole) return;
//     if (editRoleOnly && editRole?.id) {
//       setInputRoleAccess({
//         role:        editRole.role        || "",
//         description: editRole.description || "",
//         department:  editRole.department  || "",
//         branch:      editRole.branch      || "",
//         access:      buildAccess(editRole.permissions),
//       });
//     } else {
//       setInputRoleAccess({
//         role:        "",
//         description: "",
//         department:  editRole.department || "",
//         branch:      editRole.branch     || "",
//         access:      DEFAULT_ACCESS,
//       });
//     }
//   }, [editRoleOnly, editRole]);

//   function buildAccess(permissions) {
//     if (!permissions) return DEFAULT_ACCESS;
//     const merged = {};
//     Object.keys(DEFAULT_ACCESS).forEach((page) => {
//       merged[page] = { ...DEFAULT_ACCESS[page], ...(permissions[page] || {}) };
//     });
//     return merged;
//   }

//   /* ── PERMISSION CHANGE ── */
//   const handlePermissionChange = (e, page) => {
//     const { id, checked } = e.target;
//     setInputRoleAccess((prev) => {
//       const updated = { ...prev.access[page], [id]: checked };
//       if (id === "fullAccess") {
//         Object.keys(updated).forEach((k) => (updated[k] = checked));
//       }
//       return { ...prev, access: { ...prev.access, [page]: updated } };
//     });
//   };

//   const resetPermissions = () => {
//     setInputRoleAccess((prev) => ({ ...prev, access: DEFAULT_ACCESS }));
//   };

//   /* ── SUBMIT ── */
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const { role, description, department, branch, access } = inputRoleAccess;

//     if (!role.trim() || !description.trim()) {
//       toast.error("Please fill all required fields");
//       return;
//     }
//     const hasPermission = Object.values(access).some((p) =>
//       Object.values(p).some(Boolean)
//     );
//     if (!hasPermission) {
//       toast.error("Assign at least one permission");
//       return;
//     }

//     if (onRoleSaved) {
//       onRoleSaved({
//         ...(editRoleOnly && editRole?.id ? { id: editRole.id } : {}),
//         ...(editRole?._localId ? { _localId: editRole._localId } : {}),
//         role, description, department, branch,
//         permissions: access,
//       });
//     }

//     toast.success(editRoleOnly ? "Role updated" : "Role added");
//     closeModal();
//   };

//   /* ── CLOSE ── */
//   const closeModal = () => {
//     setShowNewRole(false);
//     setEditRoleOnly(false);
//     setEditRole({});
//   };

//   const PERMS = ["fullAccess", "view", "create", "edit", "delete"];
//   const PERM_LABELS = { fullAccess: "Full", view: "View", create: "Create", edit: "Edit", delete: "Delete" };

//   /* ── RENDER ── */
//   return (
//     <div className="create-role-overlay">
//       <div className="create-newrole-cointainer">

//         {/* HEAD */}
//         <div className="create-role-head">
//           <p>{editRoleOnly ? "Edit" : "Create"} Role</p>
//           <svg
//             className="x-logo-create-role"
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 384 512"
//             onClick={closeModal}
//           >
//             <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7
//               86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256
//               41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3
//               297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256
//               342.6 150.6z"
//             />
//           </svg>
//         </div>

//         <form onSubmit={handleSubmit}>

//           {/* Role + Description */}
//           <div className="create-role-grid">
//             <div className="create-role-box">
//               <label>Role Name<sup>*</sup></label>
//               <input
//                 value={inputRoleAccess.role}
//                 placeholder="Enter Role Name"
//                 onChange={(e) =>
//                   setInputRoleAccess((prev) => ({ ...prev, role: e.target.value }))
//                 }
//               />
//             </div>
//             <div className="create-role-box">
//               <label>Description<sup>*</sup></label>
//               <input
//                 value={inputRoleAccess.description}
//                 placeholder="Enter Description"
//                 onChange={(e) =>
//                   setInputRoleAccess((prev) => ({ ...prev, description: e.target.value }))
//                 }
//               />
//             </div>
//           </div>

//           {/* Department + Branch (read-only context) */}
//           {editRole?.department_name && (
//             <div className="create-role-grid">
//               <div className="create-role-box">
//                 <label>Department</label>
//                 <input value={editRole.department_name} disabled />
//               </div>
//               {editRole?.branch_name && (
//                 <div className="create-role-box">
//                   <label>Branch</label>
//                   <input value={editRole.branch_name} disabled />
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Permission heading */}
//           <div className="role-permission-title">
//             <p>Permission</p>
//             <button type="button" onClick={resetPermissions}>Reset</button>
//           </div>

//           {/* Permission table */}
//           <div className="create-role-table">
//             <table>
//               <thead>
//                 <tr>
//                   <th>Menu</th>
//                   {PERMS.map((p) => (
//                     <th key={p}>{PERM_LABELS[p]}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {Object.keys(inputRoleAccess.access).map((page) => (
//                   <tr key={page}>
//                     <td>{page.replace(/([A-Z])/g, " $1").replace(/^\w/, (c) => c.toUpperCase())}</td>
//                     {PERMS.map((perm) => (
//                       <td key={perm}>
//                         <input
//                           type="checkbox"
//                           id={perm}
//                           checked={inputRoleAccess.access[page][perm] || false}
//                           onChange={(e) => handlePermissionChange(e, page)}
//                         />
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Buttons */}
//           <div className="create-role-submit-container">
//             <button type="button" className="create-role-cancel" onClick={closeModal}>
//               Cancel
//             </button>
//             <button type="submit" className="create-role-save">
//               Save
//             </button>
//           </div>

//         </form>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import "./createNewRole.css";
import { toast } from "react-toastify";

const DEFAULT_ACCESS = {
  dashboard:      { fullAccess: false, view: false, create: false, edit: false, delete: false },
  task:           { fullAccess: false, view: false, create: false, edit: false, delete: false },
  projectTracker: { fullAccess: false, view: false, create: false, edit: false, delete: false },
  onboarding:     { fullAccess: false, view: false, create: false, edit: false, delete: false },
  attendance:     { fullAccess: false, view: false, create: false, edit: false, delete: false },
};

const PERMS       = ["fullAccess", "view", "create", "edit", "delete"];
const PERM_LABELS = { fullAccess: "Full", view: "View", create: "Create", edit: "Edit", delete: "Delete" };

function formatPageName(key) {
  return key.replace(/([A-Z])/g, " $1").replace(/^\w/, (c) => c.toUpperCase());
}

export default function CreateNewRole({
  setShowNewRole,
  editRole,
  editRoleOnly,
  setEditRole,
  setEditRoleOnly,
  onRoleSaved,
}) {
  const [inputRoleAccess, setInputRoleAccess] = useState({
    role: "", description: "", department: "", branch: "", access: DEFAULT_ACCESS,
  });
  const [roleErrors, setRoleErrors] = useState({});

  useEffect(() => {
    if (!editRole) return;
    if (editRoleOnly && editRole?.id) {
      setInputRoleAccess({
        role:        editRole.role        || "",
        description: editRole.description || "",
        department:  editRole.department  || "",
        branch:      editRole.branch      || "",
        access:      buildAccess(editRole.permissions),
      });
    } else {
      setInputRoleAccess({
        role: "", description: "",
        department: editRole.department || "",
        branch:     editRole.branch     || "",
        access: DEFAULT_ACCESS,
      });
    }
  }, [editRoleOnly, editRole]);

  function buildAccess(permissions) {
    if (!permissions) return DEFAULT_ACCESS;
    const merged = {};
    Object.keys(DEFAULT_ACCESS).forEach((page) => {
      merged[page] = { ...DEFAULT_ACCESS[page], ...(permissions[page] || {}) };
    });
    return merged;
  }

  const handlePermissionChange = (e, page) => {
    const { id, checked } = e.target;
    setInputRoleAccess((prev) => {
      const updated = { ...prev.access[page], [id]: checked };
      if (id === "fullAccess") Object.keys(updated).forEach((k) => (updated[k] = checked));
      return { ...prev, access: { ...prev.access, [page]: updated } };
    });
  };

  const resetPermissions = () =>
    setInputRoleAccess((prev) => ({ ...prev, access: DEFAULT_ACCESS }));

  const handleRoleChange = (e) => {
    const { value } = e.target;
    if (value && !/^[a-zA-Z0-9\s]*$/.test(value)) return;
    setRoleErrors((prev) => ({ ...prev, role: "" }));
    setInputRoleAccess((prev) => ({ ...prev, role: value }));
  };

  const handleDescChange = (e) => {
    const { value } = e.target;
    if (value.length > 500) {
      setRoleErrors((prev) => ({ ...prev, description: "Description cannot exceed 500 characters" }));
      return;
    }
    setRoleErrors((prev) => ({ ...prev, description: "" }));
    setInputRoleAccess((prev) => ({ ...prev, description: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { role, description, department, branch, access } = inputRoleAccess;
    const errors = {};
    if (!role.trim()) errors.role = "Role name is required";
    else if (!/^[a-zA-Z0-9\s]+$/.test(role.trim())) errors.role = "Role name must contain only letters and numbers";
    if (Object.keys(errors).length) { setRoleErrors(errors); return; }
    const hasPermission = Object.values(access).some((p) => Object.values(p).some(Boolean));
    if (!hasPermission) { toast.error("Assign at least one permission"); return; }
    if (onRoleSaved) {
      onRoleSaved({
        ...(editRoleOnly && editRole?.id ? { id: editRole.id } : {}),
        ...(editRole?._localId ? { _localId: editRole._localId } : {}),
        role, description, department, branch, permissions: access,
      });
    }
    toast.success(editRoleOnly ? "Role updated" : "Role added");
    closeModal();
  };

  const closeModal = () => {
    setShowNewRole(false);
    setEditRoleOnly(false);
    setEditRole({});
  };

  return (
    <div className="create-role-overlay">
      <div className="create-newrole-cointainer">

        <div className="create-role-head">
          <p>{editRoleOnly ? "Edit" : "Create"} Role</p>
          <nav className="create-role-close" onClick={closeModal}>
            <svg className="x-logo-create-role" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
            </svg>
            <p>Close</p>
          </nav>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Role + Description */}
          <div className="create-role-grid">
            <div className="create-role-box">
              <label>Role Name<sup>*</sup></label>
              <input
                value={inputRoleAccess.role}
                placeholder="Enter Role Name"
                onChange={handleRoleChange}
              />
              {roleErrors.role && <span style={{ color: "#ff4d4f", fontSize: "11px" }}>{roleErrors.role}</span>}
            </div>
            <div className="create-role-box">
              <label>Description</label>
              <input
                value={inputRoleAccess.description}
                placeholder="Enter Description"
                onChange={handleDescChange}
                maxLength={500}
              />
              <span style={{ fontSize: "11px", color: inputRoleAccess.description.length >= 490 ? "#ff4d4f" : "#888", textAlign: "right" }}>
                {inputRoleAccess.description.length}/500
              </span>
              {roleErrors.description && <span style={{ color: "#ff4d4f", fontSize: "11px" }}>{roleErrors.description}</span>}
            </div>
          </div>

          {/* Department + Branch (read-only) */}
          {editRole?.department_name && (
            <div className="create-role-grid">
              <div className="create-role-box">
                <label>Department</label>
                <input value={editRole.department_name} disabled />
              </div>
              {editRole?.branch_name && (
                <div className="create-role-box">
                  <label>Branch</label>
                  <input value={editRole.branch_name} disabled />
                </div>
              )}
            </div>
          )}

          {/* Permission title */}
          <div className="role-permission-title">
            <p>Permissions</p>
            <button type="button" onClick={resetPermissions}>Reset</button>
          </div>

          {/* Permission table */}
          <div className="create-role-table">
            <table>
              <colgroup>
                <col style={{ width: "36%" }} />
                {PERMS.map((p) => <col key={p} style={{ width: "12.8%" }} />)}
              </colgroup>
              <thead>
                <tr>
                  <th>Menu</th>
                  {PERMS.map((p) => <th key={p}>{PERM_LABELS[p]}</th>)}
                </tr>
              </thead>
              <tbody>
                {Object.keys(inputRoleAccess.access).map((page) => (
                  <tr key={page}>
                    <td>{formatPageName(page)}</td>
                    {PERMS.map((perm) => (
                      <td key={perm}>
                        <input
                          type="checkbox"
                          id={perm}
                          checked={inputRoleAccess.access[page][perm] || false}
                          onChange={(e) => handlePermissionChange(e, page)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Buttons */}
          <div className="create-role-submit-container">
            <button type="button" className="create-role-cancel" onClick={closeModal}>Cancel</button>
            <button type="submit" className="create-role-save">Save</button>
          </div>

        </form>
      </div>
    </div>
  );
}