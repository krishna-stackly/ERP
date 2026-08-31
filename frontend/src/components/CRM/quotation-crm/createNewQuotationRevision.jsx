// import React, { useState, useEffect } from "react";
// import "./createNewQuotation.css";
// import useAuthStore from "./authStore"; // ✅ Zustand instead of Redux

// export default function CreateNewQuotationRevision({
//   showRevise,
//   setshowRevise,
//   reviseCount,
//   setreviseCount,
//   status,
//   setStatus,
// }) {
//   const { user } = useAuthStore(); // ✅ replaces useSelector(state => state.auth)
//   const [currentDate, setCurrentDate] = useState("");

//   useEffect(() => {
//     setCurrentDate(new Date().toISOString().split("T")[0]);
//   }, []);

//   const handleXLogo = (e) => {
//     e.preventDefault();
//     setshowRevise(false);
//     setreviseCount((prev) => prev - 1);
//   };

//   const handleCancelBtn = (e) => {
//     e.preventDefault();
//     setshowRevise(false);
//     setreviseCount((prev) => prev - 1);
//   };

//   const handleSubmitBtn = (e) => {
//     e.preventDefault();
//     setStatus("Draft");
//     setshowRevise(false);
//   };

//   return (
//     <div className="newQuotation-revision-container">
//       <svg
//         className="newQuotation-x-logo"
//         xmlns="http://www.w3.org/2000/svg"
//         viewBox="0 0 384 512"
//         onClick={handleXLogo}
//         style={{ width: "16px", height: "16px", cursor: "pointer" }}
//       >
//         <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
//       </svg>

//       <form onSubmit={handleSubmitBtn}>
//         <div className="newQuotation-revision-head">
//           <p>Revision {reviseCount}</p>
//         </div>
//         <div className="newQuotation-input-container">
//           <div className="newQuotation-input-box">
//             <label htmlFor="revision_number">Revision Number</label>
//             <input id="revision_number" type="number" value={reviseCount} disabled />
//           </div>
//           <div className="newQuotation-input-box">
//             <label htmlFor="date">Date</label>
//             <input id="date" value={currentDate} type="date" disabled />
//           </div>
//         </div>
//         <div className="newQuotation-input-container">
//           <div className="newQuotation-input-box">
//             <label htmlFor="created_by">Created by</label>
//             <input id="created_by" value={user?.name || ""} type="text" disabled />
//           </div>
//           <div className="newQuotation-input-box">
//             <label htmlFor="status">Status (Default)</label>
//             <input id="status" type="text" value="Draft" disabled />
//           </div>
//         </div>
//         <div className="newQuotation-input-container">
//           <div className="newQuotation-input-box">
//             <label htmlFor="comment">Comment<sup>*</sup></label>
//             <input id="comment" type="text" placeholder="Enter Comment" required />
//           </div>
//         </div>
//         <div className="newQuotation-revision-btn-container">
//           <button onClick={handleCancelBtn} className="newQuotation-cancel-btn">Cancel</button>
//           <button className="newQuotation-active-btn" type="submit">Submit</button>
//         </div>
//       </form>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import "./createNewQuotation.css";
import { useSelector } from "react-redux";

export default function CreateNewQuotationRevision({
  showRevise,
  setshowRevise,
  reviseCount,
  setreviseCount,
  status,
  setStatus,
}) {
  const { user }       = useSelector((state) => state.auth);
  const [currentDate, setCurrentDate] = useState("");
  const [comment,     setComment]     = useState("");

  useEffect(() => {
    setCurrentDate(new Date().toISOString().split("T")[0]);
  }, []);

  const handleClose = (e) => {
    e.preventDefault();
    setshowRevise(false);
    setreviseCount((prev) => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setStatus("Draft");
    setshowRevise(false);
  };

  return (
    <div className="newQuotation-revision-container">
      {/* Close X */}
      <svg
        className="newQuotation-x-logo"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 384 512"
        onClick={handleClose}
        style={{ width: "16px", height: "16px", cursor: "pointer" }}
      >
        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
      </svg>

      <form onSubmit={handleSubmit}>
        <div className="newQuotation-revision-head">
          <p>Revision {reviseCount}</p>
        </div>

        <div className="newQuotation-input-container">
          <div className="newQuotation-input-box">
            <label htmlFor="revision_number">Revision Number</label>
            <input id="revision_number" type="number" value={reviseCount} disabled />
          </div>
          <div className="newQuotation-input-box">
            <label htmlFor="rev_date">Date</label>
            <input id="rev_date" type="date" value={currentDate} disabled />
          </div>
        </div>

        <div className="newQuotation-input-container">
          <div className="newQuotation-input-box">
            <label htmlFor="created_by">Created By</label>
            <input id="created_by" type="text" value={user?.name || ""} disabled />
          </div>
          <div className="newQuotation-input-box">
            <label htmlFor="rev_status">Status</label>
            <input id="rev_status" type="text" value="Draft" disabled />
          </div>
        </div>

        <div className="newQuotation-input-container">
          <div className="newQuotation-input-box">
            <label htmlFor="rev_comment">Comment<sup>*</sup></label>
            <input
              id="rev_comment"
              type="text"
              placeholder="Enter revision comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="newQuotation-revision-btn-container">
          <button onClick={handleClose} className="newQuotation-cancel-btn">Cancel</button>
          <button type="submit" className="newQuotation-active-btn">Submit</button>
        </div>
      </form>
    </div>
  );
}