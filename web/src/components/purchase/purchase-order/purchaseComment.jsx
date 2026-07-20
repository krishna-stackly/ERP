// // import React, { useState, useEffect } from "react";
// // import "./createNewPurchase.css";
// // import { useSelector } from "react-redux";

// // export default function purchaseComment() {
// //   const { user } = useSelector((state) => state.auth);
// //   const [apiComment, setApiComment] = useState({});
// //   const [commentData, setCommentData] = useState([]);
// //   const [newComment, setNewComment] = useState("");

// //   // console.log(user);

// //   const commentFromApi = {
// //     comment_data: [
// //       {
// //         person_name: "Mandy",
// //         comment: "Discussed discount approval with manager.",
// //         timestamp: "May 2, 2025, 09:45 AM",
// //       },
// //       {
// //         person_name: "Director",
// //         comment: "Discussed discount approval with manager.",
// //         timestamp: "May 3, 2025, 11:45 AM",
// //       },
// //       {
// //         person_name: "Rose",
// //         comment: "Customer asked for delivery date confirmation.",
// //         timestamp: "May 5, 2025, 12:45 AM",
// //       },
// //     ],
// //   };

// //   useEffect(() => {
// //     setApiComment(commentFromApi);
// //   }, []);

// //   useEffect(() => {
// //     if (Object.keys(apiComment).length > 0) {
// //       setCommentData(apiComment.comment_data);
// //     }
// //   }, [apiComment]);

// //   const handleCommentChange = (e) => {
// //     setNewComment(e.target.value);
// //   };

// //   const handleAddComment = (e) => {
// //     e.preventDefault();
// //     if (newComment === "") return;

// //     const newEntry = {
// //       person_name: user.name,
// //       comment: newComment,
// //     };

// //     setCommentData((prev) => [newEntry, ...prev]);

// //     setNewComment("");
// //   };

// //   return (
// //     <div className="createNewPurchase-comment-container">
// //       <p>Add Comment:</p>
// //       <form>
// //         <input
// //           id="createNewPurchaseComment"
// //           type="text"
// //           placeholder="Enter your comment...."
// //           value={newComment}
// //           onChange={handleCommentChange}
// //         />
// //         <button onClick={handleAddComment} type="submit">
// //           + Add
// //         </button>
// //       </form>

// //       <div className="createNewPurchase-comment-brline"></div>

// //       <div className="createNewPurchase-showarea">
// //         {commentData.length > 0 &&
// //           commentData.map((ele, ind) => (
// //             <div key={[-ind]} className="createNewPurchase-message-container">
// //               <svg
// //                 className="createNewPurchase-comment-profile-logo"
// //                 xmlns="http://www.w3.org/2000/svg"
// //                 viewBox="0 0 24 24"
// //                 fill="none"
// //               >
// //                 <rect width="24" height="24" rx="12" fill="#E0E4E7" />
// //                 <path
// //                   d="M7 17.33V16.6219C7 15.3072 7.52224 14.0464 8.45184 13.1168C9.38143 12.1872 10.6422 11.665 11.9569 11.665M11.9569 11.665C13.2715 11.665 14.5323 12.1872 15.4619 13.1168C16.3915 14.0464 16.9138 15.3072 16.9138 16.6219V17.33M11.9569 11.665C12.7081 11.665 13.4286 11.3666 13.9598 10.8354C14.491 10.3042 14.7894 9.58373 14.7894 8.8325C14.7894 8.08127 14.491 7.36082 13.9598 6.82962C13.4286 6.29842 12.7081 6 11.9569 6C11.2057 6 10.4852 6.29842 9.954 6.82962C9.4228 7.36082 9.12438 8.08127 9.12438 8.8325C9.12438 9.58373 9.4228 10.3042 9.954 10.8354C10.4852 11.3666 11.2057 11.665 11.9569 11.665Z"
// //                   stroke="#1A1A1A"
// //                   strokeWidth="1.5"
// //                   strokeLinecap="round"
// //                   strokeLinejoin="round"
// //                 />
// //               </svg>
// //               <div className="createNewPurchase-message-box">
// //                 <p>
// //                   {ele.person_name} - {ele.timestamp}
// //                 </p>
// //                 <nav>{ele.comment}</nav>
// //               </div>
// //             </div>
// //           ))}
// //       </div>
// //     </div>
// //   );
// // }
// import React, { useState, useEffect } from "react";
// import "./createNewPurchase.css";
// import { useSelector } from "react-redux";
// import purchaseOrderApiProvider from "../../../network/purchaseOrder-api-provider";

// export default function PurchaseComment({ poId }) {
//   const { user } = useSelector((state) => state.auth);
//   const [commentData, setCommentData] = useState([]);
//   const [newComment, setNewComment] = useState("");
//   const [loading, setLoading] = useState(false);

//   // ── Fetch existing comments when PO id is available ──────────────────────
//   useEffect(() => {
//     if (!poId) return;
//     const loadComments = async () => {
//       const res = await purchaseOrderApiProvider.fetchComments(poId);
//       // Normalise whatever shape the API returns
//       if (Array.isArray(res)) setCommentData(res);
//       else if (res?.results)      setCommentData(res.results);
//       else if (res?.comment_data) setCommentData(res.comment_data);
//     };
//     loadComments();
//   }, [poId]);

//   const handleCommentChange = (e) => setNewComment(e.target.value);

//   // ── Add new comment ───────────────────────────────────────────────────────
//   const handleAddComment = async (e) => {
//     e.preventDefault();
//     if (!newComment.trim()) return;

//     if (!poId) {
//       alert("Please save the Purchase Order as Draft first.");
//       return;
//     }

//     setLoading(true);
//     const result = await purchaseOrderApiProvider.addComment(poId, newComment.trim());
//     setLoading(false);

//     if (result) {
//       // Map API response to the shape used in rendering
//       const newEntry = {
//         person_name:
//           result?.created_by || result?.user || user?.name || "You",
//         comment:
//           result?.comment || result?.text || newComment.trim(),
//         timestamp: result?.created_at
//           ? new Date(result.created_at).toLocaleString()
//           : new Date().toLocaleString(),
//       };
//       // Prepend — newest comment appears first (matches original behaviour)
//       setCommentData((prev) => [newEntry, ...prev]);
//       setNewComment("");
//     }
//   };

//   return (
//     <div className="createNewPurchase-comment-container">
//       <p>Add Comment:</p>
//       <form>
//         <input
//           id="createNewPurchaseComment"
//           type="text"
//           placeholder={
//             poId
//               ? "Enter your comment...."
//               : "Save as Draft first to add comments"
//           }
//           value={newComment}
//           onChange={handleCommentChange}
//           disabled={!poId || loading}
//         />
//         <button
//           onClick={handleAddComment}
//           type="submit"
//           disabled={!poId || loading || !newComment.trim()}
//         >
//           {loading ? "Adding..." : "+ Add"}
//         </button>
//       </form>

//       <div className="createNewPurchase-comment-brline"></div>

//       <div className="createNewPurchase-showarea">
//         {commentData.length === 0 ? (
//           <p style={{ color: "#888", fontSize: "13px" }}>
//             {poId ? "No comments yet." : "Save as Draft to enable comments."}
//           </p>
//         ) : (
//           commentData.map((ele, ind) => (
//             <div key={ind} className="createNewPurchase-message-container">
//               {/* Profile icon — unchanged from original */}
//               <svg
//                 className="createNewPurchase-comment-profile-logo"
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 24 24"
//                 fill="none"
//               >
//                 <rect width="24" height="24" rx="12" fill="#E0E4E7" />
//                 <path
//                   d="M7 17.33V16.6219C7 15.3072 7.52224 14.0464 8.45184 13.1168C9.38143 12.1872 10.6422 11.665 11.9569 11.665M11.9569 11.665C13.2715 11.665 14.5323 12.1872 15.4619 13.1168C16.3915 14.0464 16.9138 15.3072 16.9138 16.6219V17.33M11.9569 11.665C12.7081 11.665 13.4286 11.3666 13.9598 10.8354C14.491 10.3042 14.7894 9.58373 14.7894 8.8325C14.7894 8.08127 14.491 7.36082 13.9598 6.82962C13.4286 6.29842 12.7081 6 11.9569 6C11.2057 6 10.4852 6.29842 9.954 6.82962C9.4228 7.36082 9.12438 8.08127 9.12438 8.8325C9.12438 9.58373 9.4228 10.3042 9.954 10.8354C10.4852 11.3666 11.2057 11.665 11.9569 11.665Z"
//                   stroke="#1A1A1A"
//                   strokeWidth="1.5"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//               <div className="createNewPurchase-message-box">
//                 <p>
//                   {ele.person_name || ele.created_by || ele.user || "User"} -{" "}
//                   {ele.timestamp ||
//                     (ele.created_at
//                       ? new Date(ele.created_at).toLocaleString()
//                       : "")}
//                 </p>
//                 <nav>{ele.comment || ele.text}</nav>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import "./createNewPurchase.css";
import { useSelector } from "react-redux";
import purchaseOrderApiProvider from "../../../network/purchaseOrder-api-provider";

export default function PurchaseComment({ poId }) {
  const { user } = useSelector((state) => state.auth);
  const [commentData, setCommentData] = useState([]);
  const [newComment, setNewComment]   = useState("");
  const [loading, setLoading]         = useState(false);

  // ── Fetch existing comments when PO id is available ──────────────────────
  useEffect(() => {
    if (!poId) return;
    const loadComments = async () => {
      const res = await purchaseOrderApiProvider.fetchComments(poId);
      if (Array.isArray(res))      setCommentData(res);
      else if (res?.results)       setCommentData(res.results);
      else if (res?.comment_data)  setCommentData(res.comment_data);
    };
    loadComments();
  }, [poId]);

  const handleCommentChange = (e) => setNewComment(e.target.value);

  // ── Add new comment ───────────────────────────────────────────────────────
  const handleAddComment = async (e) => {
    // ✅ e may be a button click event — always prevent default + stop propagation
    // so the parent <form> does NOT submit
    e.preventDefault();
    e.stopPropagation();

    if (!newComment.trim()) return;

    if (!poId) {
      alert("Please save the Purchase Order as Draft first.");
      return;
    }

    setLoading(true);
    const result = await purchaseOrderApiProvider.addComment(poId, newComment.trim());
    setLoading(false);

    if (result) {
      const newEntry = {
        person_name: result?.created_by || result?.user || user?.name || "You",
        comment:     result?.comment    || result?.text || newComment.trim(),
        timestamp:   result?.created_at
          ? new Date(result.created_at).toLocaleString()
          : new Date().toLocaleString(),
      };
      setCommentData((prev) => [newEntry, ...prev]);
      setNewComment("");
    }
  };

  return (
    <div className="createNewPurchase-comment-container">
      <p>Add Comment:</p>

      {/*
        ✅ FIXED: Changed <form> → <div> to prevent nested <form> error.
           The parent component (editPurchase / createNewPurchase) already
           wraps everything in a <form>. A second <form> inside is invalid HTML
           and causes React's "validateDOMNesting" warning.
           The button uses type="button" + onClick instead of form submit.
      */}
      <div className="createNewPurchase-comment-form">
        <input
          id="createNewPurchaseComment"
          type="text"
          placeholder={
            poId
              ? "Enter your comment...."
              : "Save as Draft first to add comments"
          }
          value={newComment}
          onChange={handleCommentChange}
          disabled={!poId || loading}
          // ✅ Allow pressing Enter to submit without a form
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (!loading && poId && newComment.trim()) handleAddComment(e);
            }
          }}
        />
        <button
          type="button"               // ✅ type="button" — never submits parent form
          onClick={handleAddComment}
          disabled={!poId || loading || !newComment.trim()}
        >
          {loading ? "Adding..." : "+ Add"}
        </button>
      </div>

      <div className="createNewPurchase-comment-brline"></div>

      <div className="createNewPurchase-showarea">
        {commentData.length === 0 ? (
          <p style={{ color: "#888", fontSize: "13px" }}>
            {poId ? "No comments yet." : "Save as Draft to enable comments."}
          </p>
        ) : (
          commentData.map((ele, ind) => (
            <div key={ind} className="createNewPurchase-message-container">
              <svg
                className="createNewPurchase-comment-profile-logo"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
              >
                <rect width="24" height="24" rx="12" fill="#E0E4E7" />
                <path
                  d="M7 17.33V16.6219C7 15.3072 7.52224 14.0464 8.45184 13.1168C9.38143 12.1872 10.6422 11.665 11.9569 11.665M11.9569 11.665C13.2715 11.665 14.5323 12.1872 15.4619 13.1168C16.3915 14.0464 16.9138 15.3072 16.9138 16.6219V17.33M11.9569 11.665C12.7081 11.665 13.4286 11.3666 13.9598 10.8354C14.491 10.3042 14.7894 9.58373 14.7894 8.8325C14.7894 8.08127 14.491 7.36082 13.9598 6.82962C13.4286 6.29842 12.7081 6 11.9569 6C11.2057 6 10.4852 6.29842 9.954 6.82962C9.4228 7.36082 9.12438 8.08127 9.12438 8.8325C9.12438 9.58373 9.4228 10.3042 9.954 10.8354C10.4852 11.3666 11.2057 11.665 11.9569 11.665Z"
                  stroke="#1A1A1A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="createNewPurchase-message-box">
                <p>
                  {ele.person_name || ele.created_by || ele.user || "User"} —{" "}
                  {ele.timestamp || (ele.created_at ? new Date(ele.created_at).toLocaleString() : "")}
                </p>
                <nav>{ele.comment || ele.text}</nav>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}