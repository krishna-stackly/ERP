// import React, { useEffect, useState } from "react";
// import "./manageUsers.css";
// import CreateUser from "./createUser";
// import { toast } from "react-toastify";
// import useUserStore from "./userStore";

// export default function ManageUsers() {
//   const {
//     fetchUsers,
//     users,
//     loading,
//     currentPage,
//     totalPages,
//     search,
//     setSearch,
//     deleteUser,
//   } = useUserStore();

//   const [showCreateUser, setshowCreateUser] = useState(false);
//   const [editCreateUser, seteditCreateUser] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteUserData, setDeleteUserData] = useState(null);

//   const [edituser, setedituser] = useState({});

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const handleNext = () => {
//     if (currentPage < totalPages) {
//       fetchUsers(currentPage + 1, search);
//     }
//   };

//   const handlePrev = () => {
//     if (currentPage > 1) {
//       fetchUsers(currentPage - 1, search);
//     }
//   };

//   // const handleDelete = async (user) => {
//   //   const confirmDel = window.confirm(
//   //     `Are you sure you want to delete ${user.email}?`
//   //   );
//   //   if (!confirmDel) return;

//   //   await deleteUser(user.id);
//   //   fetchUsers(currentPage, search);
//   // };
//   const handleDelete = (user) => {
//   setDeleteUserData(user);
//   setShowDeleteModal(true);
// };

// const confirmDelete = async () => {
//   if (!deleteUserData) return;

//   await deleteUser(deleteUserData.id);
//   fetchUsers(currentPage, search);

//   setShowDeleteModal(false);
//   setDeleteUserData(null);
// };


//   const showEditUser = (id) => {
//     const user = users.find((u) => u.id === id);
//     if (!user) {
//       toast.error("User not found");
//       return;
//     }

//     setedituser(user);
//     seteditCreateUser(true);
//   };

//   // ✅ SINGLE CLOSE FUNCTION (VERY IMPORTANT)
//   const closeModal = () => {
//     setshowCreateUser(false);
//     seteditCreateUser(false);
//     setedituser({});
//   };

//   return (
//     <>
//    {showDeleteModal && (
//   <div
//     className="createuser-container"
//     style={{
//       maxWidth: "420px",
//       width: "100%",
//       paddingBottom: "10px",
//       height: "auto",        // 🔑 important
//       minHeight: "unset",    // 🔑 important
//     }}
//   >
//     <svg
//       className="x-logo-createuser"
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 384 512"
//       onClick={() => setShowDeleteModal(false)}
//     >
//       <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 
//       0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 
//       0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 
//       12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 
//       0L192 301.3 297.4 406.6c12.5 12.5 
//       32.8 12.5 45.3 0s12.5-32.8 
//       0-45.3L237.3 256 342.6 150.6z" />
//     </svg>

//     <div className="createuser-head">
//       <p>Delete User</p>
//     </div>

//     <div
//       className="createuser-body"
//       style={{
//         padding: "16px 20px",
//         height: "auto",
//       }}
//     >
//       <p
//         style={{
//           textAlign: "center",
//           fontSize: "15px",
//           lineHeight: "22px",
//           marginBottom: "20px",
//         }}
//       >
//         Are you sure you want to delete <br />
//         <strong>{deleteUserData?.email}</strong>?
//       </p>

//       <div
//         className="createuser-submit-container"
//         style={{ justifyContent: "center", gap: "14px" }}
//       >
//         <button
//           type="button"
//           className="createuser-cancel"
//           onClick={() => setShowDeleteModal(false)}
//         >
//           Cancel
//         </button>

//         <button
//           type="button"
//           className="createuser-save"
//           onClick={confirmDelete}
//         >
//           Delete
//         </button>
//       </div>
//     </div>
//   </div>
// )}
//       {/* ✅ MODAL — NO EXTRA WRAPPER */}
//       {(showCreateUser || editCreateUser) && (
//         <CreateUser
//           showCreateUser={showCreateUser}
//           editCreateUser={editCreateUser}
//           edituser={edituser}
//           onClose={closeModal}
//         />
//       )}

//       {/* MAIN CONTENT */}
//       <div
//         className={`manageusers-container ${
//           (showCreateUser || editCreateUser || showDeleteModal) ? "blur" : ""
//         }`}
//       >
//         <p>Manage Users</p>

//         <div className="manage-header">
//           <p className="manage-headleft">
//             Efficiently manage and organize user accounts with ease.
//           </p>

//           <div className="manage-headright">
//             <div className="manage-search-cointainer">
//               <input
//                 value={search}
//                 onChange={(e) => {
//                   setSearch(e.target.value);
//                   fetchUsers(1, e.target.value);
//                 }}
//                 placeholder="Search users"
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

//             <button onClick={() => setshowCreateUser(true)}>
//               + Create New User
//             </button>
//           </div>
//         </div>
//         {/* TABLE */}
//         <div className="manage-table-container">
//           <table>
//             <thead className="manage-thead">
//               <tr>
//                 <th>S.No.</th>
//                 <th>Email</th>
//                 <th id="managa-width-firstname">First Name</th>
//                 <th id="managa-width-lastname">Last Name</th>
//                 <th id="managa-width-role">Role</th>
//                 <th id="manage-width-action">Action</th>
//               </tr>
//             </thead>

//             <tbody className="manage-tbody">
//               {loading ? (
//                 <tr>
//                   <td colSpan="6">Loading...</td>
//                 </tr>
//               ) : users.length ? (
//                 users.map((ele, ind) => (
//                   <tr key={ele.id}>
//                     <td>{ind + 1}</td>

//                     <td>
//                       <abbr title={ele.email}>
//                         {ele.email.length < 18
//                           ? ele.email
//                           : ele.email.slice(0, 30)}
//                       </abbr>
//                     </td>

//                     <td id="managa-width-firstname">
//                       <abbr title={ele.first_name}>
//                         {ele.first_name.length < 16
//                           ? ele.first_name
//                           : ele.first_name.slice(0, 16) + "..."}
//                       </abbr>
//                     </td>

//                     <td id="managa-width-lastname">
//                       <abbr title={ele.last_name || "None"}>
//                         {ele.last_name
//                           ? ele.last_name.length < 16
//                             ? ele.last_name
//                             : ele.last_name.slice(0, 16) + "..."
//                           : "None"}
//                       </abbr>
//                     </td>

//                     <td id="managa-width-role">
//                       <abbr title={ele.role?.role || "No Role"}>
//                         {ele.role?.role
//                           ? ele.role.role.length < 16
//                             ? ele.role.role
//                             : ele.role.role.slice(0, 16) + "..."
//                           : "No Role"}
//                       </abbr>
//                     </td>

//                     <td id="manage-width-action">
//                       <svg
//                         className="dot-logo-manage"
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 128 512"
//                       >
//                         <path d="M64 360a56 56 0 1 0 0 112 56 56 
//                         0 1 0 0-112zm0-160a56 56 0 1 
//                         0 0 112 56 56 0 1 0 0-112zM120 96A56 56 
//                         0 1 0 8 96a56 56 0 1 0 112 0z" />
//                       </svg>

//                       <nav className="manageuser-dot-container">
//                         <div onClick={() => showEditUser(ele.id)}>Edit</div>
//                         <div onClick={() => handleDelete(ele)}>Delete</div>
//                       </nav>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6">No data found</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* PAGINATION */}
//         <nav className="table-bottem">
//           <p className="num-entries">Showing {users.length} entries</p>

//           <div className="manage-control-box">
//             <button
//               className="manage-btn"
//               onClick={handlePrev}
//               disabled={totalPages <= 1}
//             >
//               Prev
//             </button>

//             <nav className="num-page">
//               Page {currentPage} of {totalPages}
//             </nav>

//             <button
//               className="manage-btn"
//               onClick={handleNext}
//               disabled={currentPage >= totalPages}
//             >
//               Next
//             </button>
//           </div>
//         </nav>
//       </div>
//     </>
//   );
// }
import React, { useEffect, useState } from "react";
import "./manageUsers.css";
import CreateUser from "./createUser";
import { toast } from "react-toastify";
import useUserStore from "./userStore";

export default function ManageUsers() {
  const {
    fetchUsers,
    users,
    loading,
    currentPage,
    totalPages,
    search,
    setSearch,
    deleteUser,
  } = useUserStore();

  const [showCreateUser, setshowCreateUser] = useState(false);
  const [editCreateUser, seteditCreateUser] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUserData, setDeleteUserData] = useState(null);
  const [edituser, setedituser] = useState({});

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleNext = () => {
    if (currentPage < totalPages) {
      fetchUsers(currentPage + 1, search);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      fetchUsers(currentPage - 1, search);
    }
  };

  const handleDelete = (user) => {
    setDeleteUserData(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteUserData) return;
    await deleteUser(deleteUserData.id);
    fetchUsers(currentPage, search);
    setShowDeleteModal(false);
    setDeleteUserData(null);
  };

  const showEditUser = (id) => {
    const user = users.find((u) => u.id === id);
    if (!user) {
      toast.error("User not found");
      return;
    }
    setedituser(user);
    seteditCreateUser(true);
  };

  const closeModal = () => {
    setshowCreateUser(false);
    seteditCreateUser(false);
    setedituser({});
  };

  return (
    <div className="manageusers-page">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-popup-container modal-delete">
            <div className="createuser-head">
              <p>Delete User</p>
              <nav className="createuser-close" onClick={() => setShowDeleteModal(false)}>
                <svg className="x-logo-createuser" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
                </svg>
                <p>Close</p>
              </nav>
            </div>
            <div className="createuser-body" style={{ padding: "16px 20px" }}>
              <p style={{ textAlign: "center", fontSize: "15px", lineHeight: "22px", marginBottom: "20px" }}>
                Are you sure you want to delete <br />
                <strong>{deleteUserData?.email}</strong>?
              </p>
              <div className="createuser-submit-container" style={{ justifyContent: "center", gap: "14px" }}>
                <button type="button" className="createuser-cancel" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <button type="button" className="createuser-save" onClick={confirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit User Popup */}
      {(showCreateUser || editCreateUser) && (
        <div className="modal-overlay">
          <div className="modal-popup-container">
            <CreateUser
              showCreateUser={showCreateUser}
              editCreateUser={editCreateUser}
              edituser={edituser}
              fetchUsers={fetchUsers}
              onClose={closeModal}
            />
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="manageusers-container">
        <p>Manage Users</p>

        <div className="manage-header">
          <p className="manage-headleft">
            Efficiently manage and organize user accounts with ease.
          </p>

          <div className="manage-headright">
            <div className="manage-search-cointainer">
              <label>
                <svg className="search-logo-manageuser" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6
                  457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8
                  12.5-45.3 0L330.7 376c-34.4 25.2-76.8
                  40-122.7 40C93.1 416 0 322.9 0 208S93.1
                  0 208 0S416 93.1 416 208z" />
                </svg>
              </label>
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  fetchUsers(1, e.target.value);
                }}
                placeholder="Search users"
              />
            </div>
            <button onClick={() => setshowCreateUser(true)}>+ Create New User</button>
          </div>
        </div>

        {/* TABLE */}
        <div className="manage-table-container">
          <table>
            <thead className="manage-thead">
              <tr>
                <th>Email</th>
                <th id="managa-width-firstname">First Name</th>
                <th id="managa-width-lastname">Last Name</th>
                <th id="managa-width-role">Role</th>
                <th id="manage-width-action">Action</th>
              </tr>
            </thead>

            <tbody className="manage-tbody">
              {loading ? (
                <tr><td colSpan="5">Loading...</td></tr>
              ) : users.length ? (
                users.map((ele) => {
                  const roleName = ele.role?.role || ele.role?.name || ele.role?.role_name || "";
                  return (
                    <tr key={ele.id}>
                      <td>
                        <abbr title={ele.email}>
                          {ele.email.length < 30 ? ele.email : ele.email.slice(0, 30) + "..."}
                        </abbr>
                      </td>
                      <td id="managa-width-firstname">
                        <abbr title={ele.first_name}>
                          {ele.first_name.length < 16 ? ele.first_name : ele.first_name.slice(0, 16) + "..."}
                        </abbr>
                      </td>
                      <td id="managa-width-lastname">
                        <abbr title={ele.last_name || "—"}>
                          {ele.last_name
                            ? ele.last_name.length < 16 ? ele.last_name : ele.last_name.slice(0, 16) + "..."
                            : "—"}
                        </abbr>
                      </td>
                      <td id="managa-width-role">
                        <abbr title={roleName || "No Role"}>
                          {roleName
                            ? roleName.length < 16 ? roleName : roleName.slice(0, 16) + "..."
                            : "No Role"}
                        </abbr>
                      </td>
                      <td id="manage-width-action">
                        <div className="action-wrapper">
                          <svg className="dot-logo-manage" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512">
                            <path d="M64 360a56 56 0 1 0 0 112 56 56
                            0 1 0 0-112zm0-160a56 56 0 1
                            0 0 112 56 56 0 1 0 0-112zM120 96A56 56
                            0 1 0 8 96a56 56 0 1 0 112 0z" />
                          </svg>
                          <nav className="manageuser-dot-container">
                            <div onClick={() => showEditUser(ele.id)}>Edit</div>
                            <div onClick={() => handleDelete(ele)}>Delete</div>
                          </nav>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan="5">No results found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <nav className="table-bottem">
          <p className="num-entries">Showing {users.length} entries</p>
          <div className="manage-control-box">
            <button className="manage-btn" onClick={handlePrev} disabled={currentPage <= 1}>
              Prev
            </button>
            <nav className="num-page">Page {currentPage} of {totalPages}</nav>
            <button className="manage-btn" onClick={handleNext} disabled={currentPage >= totalPages}>
              Next
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}