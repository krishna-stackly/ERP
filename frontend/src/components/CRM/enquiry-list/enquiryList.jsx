// // import React, { useState, useEffect } from "react";
// // import "./enquiryList.css";
// // import NewEnquiry from "./newEnquiry";
// // import { Link } from "react-router-dom";
// // import { toast } from "react-toastify";

// // export default function enquiryList() {
// //   const [APIenquirylist, setAPIenquirylist] = useState({});
// //   const [enquirylist, setenquirylist] = useState([]);

// //   const [currentpageEnquirylist, setcurrentpageEnquirylist] = useState(1);
// //   const rowsPerPageEnquirylist = 10;

// //   const [EditNewEnquiry, setEditNewEnquiry] = useState(false);
// //   const [EditNewEnquiryData, setEditNewEnquiryData] = useState({});

// //   const enquirylistFromAPI = {
// //     enquirylist: [
// //       {
// //         id: "1",
// //         enquiry_id: "ENQ001",
// //         first_name: "Ram",
// //         last_name: "raj",
// //         email: "example@gmailkamalalan.com",
// //         phone_number: "1234667895",
// //         status: "New",
// //       },
// //       {
// //         id: "2",
// //         enquiry_id: "ENQ002",
// //         first_name: "Vijay",
// //         last_name: "raj",
// //         email: "example@gmail.com",
// //         phone_number: "1234667895",
// //         status: "New",
// //       },
// //       {
// //         id: "3",
// //         enquiry_id: "ENQ003",
// //         first_name: "AK",
// //         last_name: "raj",
// //         email: "example@gmail.com",
// //         phone_number: "1234667895",
// //         status: "New",
// //       },
// //       {
// //         id: "4",
// //         enquiry_id: "ENQ004",
// //         first_name: "Rajani",
// //         last_name: "raj",
// //         email: "example@gmail.com",
// //         phone_number: "1234667895",
// //         status: "New",
// //       },
// //     ],
// //   };
// //   useEffect(() => {
// //     setAPIenquirylist(enquirylistFromAPI);
// //   }, []);
// //   useEffect(() => {
// //     if (Object.keys(APIenquirylist).length > 0) {
// //       setenquirylist(APIenquirylist.enquirylist);
// //     }
// //   }, [APIenquirylist]);
// //   // Calculate total pages
// //   const totalpages = Math.ceil(enquirylist.length / rowsPerPageEnquirylist);

// //   const currentData = enquirylist.slice(
// //     (currentpageEnquirylist - 1) * rowsPerPageEnquirylist,
// //     currentpageEnquirylist * rowsPerPageEnquirylist
// //   );

// //   const handleNext = () => {
// //     if (currentpageEnquirylist < totalpages) {
// //       setcurrentpageEnquirylist((prev) => prev + 1);
// //     }
// //   };
// //   const handlePrev = () => {
// //     if (currentpageEnquirylist > 1) {
// //       setcurrentpageEnquirylist((prev) => prev - 1);
// //     }
// //   };
// //   //delete
// //   function deleteEnquiryList(ind) {
// //     const okDel = window.confirm("Are you sure you want to delete this task?");
// //     if (okDel) {
// //       setAPIenquirylist((prev) => ({
// //         ...prev,
// //         enquirylist: prev.enquirylist.filter((_, index) => index !== ind),
// //       }));
// //       toast.success("Task deleted!");
// //     }
// //   }

// //   const showEditNewProjest = (id) => {
// //     setEditNewEnquiryData(
// //       currentData.find((ele) => {
// //         return ele.id === id;
// //       })
// //     );
// //     setEditNewEnquiry(true);
// //   };
// //   return (
// //     <>
// //       {EditNewEnquiry && (
// //         <NewEnquiry
// //           EditNewEnquiry={EditNewEnquiry}
// //           EditNewEnquiryData={EditNewEnquiryData}
// //           setEditNewEnquiry={setEditNewEnquiry}
// //           setEditNewEnquiryData={setEditNewEnquiryData}
// //         />
// //       )}
// //       <div className="enquiryList-cointainer">
// //         <p className="enquiryList-title">Enquiry List</p>
// //         <div className="enquiryList-header">
// //           <p className="enquiryList-headleft">
// //             Easily view, manage, and track all customer enquiries in one
// //             organized place.
// //           </p>
// //           <div className="enquiryList-headright">
// //             <div className="enquiryList-search-cointainer">
// //               <input id="enquiryList-focus" placeholder="Search users" />
// //               <label htmlFor="enquiryList-focus">
// //                 <svg
// //                   className="search-logo-enquiryList"
// //                   xmlns="http://www.w3.org/2000/svg"
// //                   viewBox="0 0 512 512"
// //                 >
// //                   <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
// //                 </svg>
// //               </label>
// //             </div>
// //             <Link to={"?tab=newEnquiry"}>
// //               <button className="create-enquirylist-btn">+ Create New</button>
// //             </Link>
// //           </div>
// //         </div>
// //         <div className="enquiryList-table-container">
// //           <table>
// //             <thead className="enquirylist-thead">
// //               <tr>
// //                 <th id="id-enquirylist-width">Enquiry ID</th>
// //                 <th id="coustomer-enquirylist-width">First Name</th>
// //                 <th id="coustomer-enquirylist-width">Last Name</th>
// //                 <th id="email-enquirylist-width">Email</th>
// //                 <th id="phone-enquirylist-width">Phone Number</th>
// //                 <th>Stauts</th>
// //                 <th>Action</th>
// //               </tr>
// //             </thead>
// //             <tbody className="enquirylist-tbody">
// //               {currentData.length > 0 ? (
// //                 currentData.map((ele, ind) => (
// //                   <tr key={ind}>
// //                     <td id="id-enquirylist-width">{ele.enquiry_id}</td>
// //                     <td id="coustomer-enquirylist-width">{ele.first_name}</td>
// //                     <td id="coustomer-enquirylist-width">{ele.last_name}</td>
// //                     <td id="email-enquirylist-width">{ele.email}</td>
// //                     <td id="phone-enquirylist-width">{ele.phone_number}</td>
// //                     <td>{ele.status}</td>
// //                     <td id="enquirylist-width-action">
// //                       <svg
// //                         className="dot-logo-enquirylist"
// //                         xmlns="http://www.w3.org/2000/svg"
// //                         viewBox="0 0 128 512"
// //                       >
// //                         <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
// //                       </svg>
// //                       <nav className="enquirylist-dot-container">
// //                         <div
// //                           onClick={() => {
// //                             showEditNewProjest(ele.id);
// //                           }}
// //                         >
// //                           Edit
// //                         </div>
// //                         <div
// //                           onClick={() => {
// //                             deleteEnquiryList(ind);
// //                           }}
// //                         >
// //                           Delete
// //                         </div>
// //                       </nav>
// //                     </td>
// //                   </tr>
// //                 ))
// //               ) : (
// //                 <p>No Data Found</p>
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
// //         <nav className="enquirylist-table-bottem">
// //           <p className="enquirylist-num-entries">
// //             Showing {currentData.length} entries
// //           </p>
// //           <div className="enquirylist-control-box">
// //             <button
// //               className="enquirylist-btn"
// //               onClick={handlePrev}
// //               disabled={currentpageEnquirylist === 1}
// //             >
// //               Prev
// //             </button>
// //             <nav className="enquirylist-num-page">
// //               {" "}
// //               Page {currentpageEnquirylist} of {totalpages}{" "}
// //             </nav>
// //             <button
// //               className="enquirylist-btn"
// //               onClick={handleNext}
// //               disabled={currentpageEnquirylist === totalpages}
// //             >
// //               Next
// //             </button>
// //           </div>
// //         </nav>
// //       </div>
// //     </>
// //   );
// // }
// import React, { useState, useEffect } from "react";
// import "./enquiryList.css";
// import NewEnquiry from "./newEnquiry";
// import { useSearchParams } from "react-router-dom";
// import { toast } from "react-toastify";

// export default function EnquiryList() {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [APIenquirylist, setAPIenquirylist] = useState({});
//   const [enquirylist, setenquirylist] = useState([]);

//   const [currentpageEnquirylist, setcurrentpageEnquirylist] = useState(1);
//   const rowsPerPageEnquirylist = 10;

//   const [showCreateEnquiry, setShowCreateEnquiry] = useState(false);
//   const [editShowEnquiry, setEditShowEnquiry] = useState(false);
//   const [editEnquiryData, setEditEnquiryData] = useState({});
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteEnquiryData, setDeleteEnquiryData] = useState(null);

//   const enquirylistFromAPI = {
//     enquirylist: [
//       {
//         id: "1",
//         enquiry_id: "ENQ001",
//         first_name: "Ram",
//         last_name: "raj",
//         email: "example@gmailkamalalan.com",
//         phone_number: "1234667895",
//         status: "New",
//       },
//       {
//         id: "2",
//         enquiry_id: "ENQ002",
//         first_name: "Vijay",
//         last_name: "raj",
//         email: "example@gmail.com",
//         phone_number: "1234667895",
//         status: "New",
//       },
//       {
//         id: "3",
//         enquiry_id: "ENQ003",
//         first_name: "AK",
//         last_name: "raj",
//         email: "example@gmail.com",
//         phone_number: "1234667895",
//         status: "New",
//       },
//       {
//         id: "4",
//         enquiry_id: "ENQ004",
//         first_name: "Rajani",
//         last_name: "raj",
//         email: "example@gmail.com",
//         phone_number: "1234667895",
//         status: "New",
//       },
//     ],
//   };

//   useEffect(() => {
//     setAPIenquirylist(enquirylistFromAPI);
//   }, []);

//   useEffect(() => {
//     if (Object.keys(APIenquirylist).length > 0) {
//       setenquirylist(APIenquirylist.enquirylist);
//     }
//   }, [APIenquirylist]);

//   // Check URL params for tab
//   useEffect(() => {
//     const tab = searchParams.get("tab");
//     if (tab === "newEnquiry") {
//       setShowCreateEnquiry(true);
//     }
//   }, [searchParams]);

//   // Calculate total pages
//   const totalpages = Math.ceil(enquirylist.length / rowsPerPageEnquirylist);

//   const currentData = enquirylist.slice(
//     (currentpageEnquirylist - 1) * rowsPerPageEnquirylist,
//     currentpageEnquirylist * rowsPerPageEnquirylist
//   );

//   const handleNext = () => {
//     if (currentpageEnquirylist < totalpages) {
//       setcurrentpageEnquirylist((prev) => prev + 1);
//     }
//   };

//   const handlePrev = () => {
//     if (currentpageEnquirylist > 1) {
//       setcurrentpageEnquirylist((prev) => prev - 1);
//     }
//   };

//   // Delete confirmation
//   const handleDeleteClick = (enquiry) => {
//     setDeleteEnquiryData(enquiry);
//     setShowDeleteModal(true);
//   };

//   const confirmDelete = () => {
//     if (!deleteEnquiryData) return;

//     const index = enquirylist.findIndex((e) => e.id === deleteEnquiryData.id);
//     if (index !== -1) {
//       setAPIenquirylist((prev) => ({
//         ...prev,
//         enquirylist: prev.enquirylist.filter((_, i) => i !== index),
//       }));
//       toast.success("Enquiry deleted successfully!");
//     }

//     setShowDeleteModal(false);
//     setDeleteEnquiryData(null);
//   };

//   const showEditEnquiry = (enquiry) => {
//     setEditEnquiryData(enquiry);
//     setEditShowEnquiry(true);
//   };

//   const handleCloseCreateEnquiry = () => {
//     setShowCreateEnquiry(false);
//     setSearchParams({}); // Clear URL params
//   };

//   const handleCloseEditEnquiry = () => {
//     setEditShowEnquiry(false);
//     setEditEnquiryData({});
//   };

//   return (
//     <>
//       {/* Delete Confirmation Modal */}
//       {showDeleteModal && (
//         <div
//           className="enquiryList-delete-modal"
//           style={{
//             maxWidth: "420px",
//             width: "100%",
//             paddingBottom: "10px",
//             height: "auto",
//             minHeight: "unset",
//           }}
//         >
//           <svg
//             className="enquiryList-close-icon"
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

//           <div className="enquiryList-modal-head">
//             <p>Delete Enquiry</p>
//           </div>

//           <div
//             className="enquiryList-modal-body"
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
//               Are you sure you want to delete enquiry <br />
//               <strong>{deleteEnquiryData?.enquiry_id}</strong>
//               <br />
//               ({deleteEnquiryData?.first_name} {deleteEnquiryData?.last_name})?
//             </p>

//             <div
//               className="enquiryList-modal-actions"
//               style={{ justifyContent: "center", gap: "14px" }}
//             >
//               <button
//                 type="button"
//                 className="enquiryList-cancel-btn"
//                 onClick={() => setShowDeleteModal(false)}
//               >
//                 Cancel
//               </button>

//               <button
//                 type="button"
//                 className="enquiryList-delete-btn"
//                 onClick={confirmDelete}
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Create/Edit Enquiry Modals */}
//       {showCreateEnquiry ? (
//         <NewEnquiry
//           setShowCreateEnquiry={handleCloseCreateEnquiry}
//         />
//       ) : editShowEnquiry ? (
//         <NewEnquiry
//           setShowCreateEnquiry={handleCloseEditEnquiry}
//           editShowEnquiry={editShowEnquiry}
//           editEnquiryData={editEnquiryData}
//           setEditEnquiryData={setEditEnquiryData}
//         />
//       ) : (
//         <div
//           className={`enquiryList-cointainer ${
//             showDeleteModal ? "blur" : ""
//           }`}
//         >
//           <p className="enquiryList-title">Enquiry List</p>
//           <div className="enquiryList-header">
//             <p className="enquiryList-headleft">
//               Easily view, manage, and track all customer enquiries in one
//               organized place.
//             </p>
//             <div className="enquiryList-headright">
//               <div className="enquiryList-search-cointainer">
//                 <input id="enquiryList-focus" placeholder="Search users" />
//                 <label htmlFor="enquiryList-focus">
//                   <svg
//                     className="search-logo-enquiryList"
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 512 512"
//                   >
//                     <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
//                   </svg>
//                 </label>
//               </div>
//               <button
//                 className="create-enquirylist-btn"
//                 onClick={() => setShowCreateEnquiry(true)}
//               >
//                 + Create New
//               </button>
//             </div>
//           </div>
//           <div className="enquiryList-table-container">
//             <table>
//               <thead className="enquirylist-thead">
//                 <tr>
//                   <th>S.No.</th>
//                   <th id="id-enquirylist-width">Enquiry ID</th>
//                   <th id="coustomer-enquirylist-width">First Name</th>
//                   <th id="coustomer-enquirylist-width">Last Name</th>
//                   <th id="email-enquirylist-width">Email</th>
//                   <th id="phone-enquirylist-width">Phone Number</th>
//                   <th>Status</th>
//                   <th id="enquirylist-width-action">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="enquirylist-tbody">
//                 {currentData.length > 0 ? (
//                   currentData.map((ele, ind) => (
//                     <tr key={ele.id}>
//                       <td>
//                         {(currentpageEnquirylist - 1) * rowsPerPageEnquirylist +
//                           ind +
//                           1}
//                       </td>
//                       <td id="id-enquirylist-width">{ele.enquiry_id}</td>
//                       <td id="coustomer-enquirylist-width">
//                         <abbr title={ele.first_name}>{ele.first_name}</abbr>
//                       </td>
//                       <td id="coustomer-enquirylist-width">
//                         <abbr title={ele.last_name}>{ele.last_name}</abbr>
//                       </td>
//                       <td id="email-enquirylist-width">
//                         <abbr title={ele.email}>
//                           {ele.email.length > 25
//                             ? ele.email.slice(0, 25) + "..."
//                             : ele.email}
//                         </abbr>
//                       </td>
//                       <td id="phone-enquirylist-width">{ele.phone_number}</td>
//                       <td>
//                         <span
//                           className={`enquiryList-status-${ele.status.toLowerCase()}`}
//                         >
//                           {ele.status}
//                         </span>
//                       </td>
//                       <td id="enquirylist-width-action">
//                         <svg
//                           className="dot-logo-enquirylist"
//                           xmlns="http://www.w3.org/2000/svg"
//                           viewBox="0 0 128 512"
//                         >
//                           <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
//                         </svg>
//                         <nav className="enquirylist-dot-container">
//                           <div onClick={() => showEditEnquiry(ele)}>Edit</div>
//                           <div onClick={() => handleDeleteClick(ele)}>
//                             Delete
//                           </div>
//                         </nav>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="8" style={{ textAlign: "center" }}>
//                       No Data Found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//           <nav className="enquirylist-table-bottem">
//             <p className="enquirylist-num-entries">
//               Showing {currentData.length} entries
//             </p>
//             <div className="enquirylist-control-box">
//               <button
//                 className="enquirylist-btn"
//                 onClick={handlePrev}
//                 disabled={currentpageEnquirylist === 1}
//               >
//                 Prev
//               </button>
//               <nav className="enquirylist-num-page">
//                 Page {currentpageEnquirylist} of {totalpages}
//               </nav>
//               <button
//                 className="enquirylist-btn"
//                 onClick={handleNext}
//                 disabled={currentpageEnquirylist === totalpages}
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
import "./enquiryList.css";
import NewEnquiry from "./newEnquiry";
import { useSearchParams } from "react-router-dom";
import useEnquiryStore from "./enquiryStore";

export default function EnquiryList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    fetchEnquiries,
    enquiries,
    loading,
    currentPage,
    totalPages,
    search,
    setSearch,
    deleteEnquiry,
  } = useEnquiryStore();

  const [showCreateEnquiry, setShowCreateEnquiry] = useState(false);
  const [editShowEnquiry, setEditShowEnquiry] = useState(false);
  const [editEnquiryData, setEditEnquiryData] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteEnquiryData, setDeleteEnquiryData] = useState(null);

  // ✅ Fetch on mount
  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  // ✅ Handle URL tab param
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "newEnquiry") {
      setShowCreateEnquiry(true);
    }
  }, [searchParams]);

  const handleNext = () => {
    if (currentPage < totalPages) {
      fetchEnquiries(currentPage + 1, search);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      fetchEnquiries(currentPage - 1, search);
    }
  };

  const handleDeleteClick = (enquiry) => {
    setDeleteEnquiryData(enquiry);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteEnquiryData) return;
    await deleteEnquiry(deleteEnquiryData.id);
    fetchEnquiries(currentPage, search);
    setShowDeleteModal(false);
    setDeleteEnquiryData(null);
  };

  const showEditEnquiry = (enquiry) => {
    setEditEnquiryData(enquiry);
    setEditShowEnquiry(true);
  };

  const handleCloseCreateEnquiry = () => {
    setShowCreateEnquiry(false);
    setSearchParams({});
    fetchEnquiries(currentPage, search); // ✅ Refresh after create
  };

  const handleCloseEditEnquiry = () => {
    setEditShowEnquiry(false);
    setEditEnquiryData({});
    fetchEnquiries(currentPage, search); // ✅ Refresh after edit
  };

  return (
    <>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="enquiryList-delete-modal"
          style={{
            maxWidth: "420px",
            width: "100%",
            paddingBottom: "10px",
            height: "auto",
            minHeight: "unset",
          }}
        >
          <svg
            className="enquiryList-close-icon"
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

          <div className="enquiryList-modal-head">
            <p>Delete Enquiry</p>
          </div>

          <div className="enquiryList-modal-body" style={{ padding: "16px 20px", height: "auto" }}>
            <p style={{ textAlign: "center", fontSize: "15px", lineHeight: "22px", marginBottom: "20px" }}>
              Are you sure you want to delete enquiry <br />
              <strong>{deleteEnquiryData?.enquiry_id}</strong>
              <br />
              ({deleteEnquiryData?.first_name} {deleteEnquiryData?.last_name})?
            </p>

            <div className="enquiryList-modal-actions" style={{ justifyContent: "center", gap: "14px" }}>
              <button
                type="button"
                className="enquiryList-cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="enquiryList-delete-btn"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Enquiry Modal */}
      {showCreateEnquiry && (
        <NewEnquiry setShowCreateEnquiry={handleCloseCreateEnquiry} />
      )}

      {/* Edit Enquiry Modal */}
      {editShowEnquiry && (
        <NewEnquiry
          setShowCreateEnquiry={handleCloseEditEnquiry}
          editShowEnquiry={editShowEnquiry}
          editEnquiryData={editEnquiryData}
          setEditEnquiryData={setEditEnquiryData}
        />
      )}

      {/* Main Content */}
      {!showCreateEnquiry && !editShowEnquiry && (
        <div className={`enquiryList-cointainer ${showDeleteModal ? "blur" : ""}`}>
          <p className="enquiryList-title">Enquiry List</p>

          <div className="enquiryList-header">
            <p className="enquiryList-headleft">
              Easily view, manage, and track all customer enquiries in one organized place.
            </p>
            <div className="enquiryList-headright">
              <div className="enquiryList-search-cointainer">
                <input
                  id="enquiryList-focus"
                  placeholder="Search enquiries"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    fetchEnquiries(1, e.target.value);
                  }}
                />
                <label htmlFor="enquiryList-focus">
                  <svg
                    className="search-logo-enquiryList"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                  </svg>
                </label>
              </div>
              <button
                className="create-enquirylist-btn"
                onClick={() => setShowCreateEnquiry(true)}
              >
                + Create New
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="enquiryList-table-container">
            <table>
              <thead className="enquirylist-thead">
                <tr>
                  <th>S.No.</th>
                  <th id="id-enquirylist-width">Enquiry ID</th>
                  <th id="coustomer-enquirylist-width">First Name</th>
                  <th id="coustomer-enquirylist-width">Last Name</th>
                  <th id="email-enquirylist-width">Email</th>
                  <th id="phone-enquirylist-width">Phone Number</th>
                  <th>Status</th>
                  <th id="enquirylist-width-action">Action</th>
                </tr>
              </thead>
              <tbody className="enquirylist-tbody">
                {loading ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center" }}>Loading...</td>
                  </tr>
                ) : enquiries.length > 0 ? (
                  enquiries.map((ele, ind) => (
                    <tr key={ele.id}>
                      <td>{(currentPage - 1) * 10 + ind + 1}</td>
                      <td id="id-enquirylist-width">{ele.enquiry_id}</td>
                      <td id="coustomer-enquirylist-width">
                        <abbr title={ele.first_name}>{ele.first_name}</abbr>
                      </td>
                      <td id="coustomer-enquirylist-width">
                        <abbr title={ele.last_name}>{ele.last_name}</abbr>
                      </td>
                      <td id="email-enquirylist-width">
                        <abbr title={ele.email}>
                          {ele.email?.length > 25 ? ele.email.slice(0, 25) + "..." : ele.email}
                        </abbr>
                      </td>
                      <td id="phone-enquirylist-width">{ele.phone_number}</td>
                      <td>
                        <span className={`enquiryList-status-${ele.status?.toLowerCase()}`}>
                          {ele.status}
                        </span>
                      </td>
                      <td id="enquirylist-width-action">
                        <svg
                          className="dot-logo-enquirylist"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 128 512"
                        >
                          <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                        </svg>
                        <nav className="enquirylist-dot-container">
                          <div onClick={() => showEditEnquiry(ele)}>Edit</div>
                          <div onClick={() => handleDeleteClick(ele)}>Delete</div>
                        </nav>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center" }}>No Data Found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <nav className="enquirylist-table-bottem">
            <p className="enquirylist-num-entries">
              Showing {enquiries.length} entries
            </p>
            <div className="enquirylist-control-box">
              <button
                className="enquirylist-btn"
                onClick={handlePrev}
                disabled={currentPage <= 1}
              >
                Prev
              </button>
              <nav className="enquirylist-num-page">
                Page {currentPage} of {totalPages}
              </nav>
              <button
                className="enquirylist-btn"
                onClick={handleNext}
                disabled={currentPage >= totalPages}
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