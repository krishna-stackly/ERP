// // import React, { useEffect, useState } from "react";
// // import MainSidebar from "../../components/MainComponents/mainSidebar/mainSidebar";
// // import Body from "../../components/MainComponents/body/body";
// // import { Navigate, useSearchParams } from "react-router-dom";
// // import { useSelector } from "react-redux";
// // import "./userDashboard.css";
// // import Sidebar from "../../components/MainComponents/sidebar/sidebar";

// // export default function userDashboard() {
// //   const { user, isAuthenticated } = useSelector((state) => state.auth);

// //   const [searchParam, setSearchParam] = useSearchParams();

// //   const [expanded, setexpanded] = useState(false);
// //   const [currentPage, setCurrentPage] = useState("");
// //   const [showSidebar, setShowSidebar] = useState(false);

// //   const [mastersDropdown, setmastersDropdown] = useState(false);
// //   const [crmDropdown, setcrmDropdown] = useState(false);
// //   const [salesDropDown, setSalesDropDown] = useState(false);
// //   const [purchaseDropdown, setPurchaseDropdown] = useState(false);
// //   const [financeDropdown, setFinanceDropdown] = useState(false);


// //   useEffect(() => {
// //     setCurrentPage(searchParam.get("tab") || "dashboard");
// //   }, [searchParam]);

// //   const updateCurrentPage = (tab) => {
// //     setSearchParam({ tab });
// //     setCurrentPage(tab);
// //   };

// //   return isAuthenticated ? (
// //     <div className="userDashboard">
// //       <MainSidebar
// //         expanded={expanded}
// //         currentPage={currentPage}
// //         setCurrentPage={updateCurrentPage}
// //         mastersDropdown={mastersDropdown}
// //         setmastersDropdown={setmastersDropdown}
// //         crmDropdown={crmDropdown}
// //         setcrmDropdown={setcrmDropdown}
// //         salesDropDown={salesDropDown}
// //         setSalesDropDown={setSalesDropDown}
// //         purchaseDropdown={purchaseDropdown}
// //         setPurchaseDropdown={setPurchaseDropdown}
// //         financeDropdown={financeDropdown}
// //         setFinanceDropdown={setFinanceDropdown}
// //       />

// //       {showSidebar && (
// //         <Sidebar
// //           setShowSidebar={setShowSidebar}
// //           currentPage={currentPage}
// //           setCurrentPage={updateCurrentPage}
// //           mastersDropdown={mastersDropdown}
// //           setmastersDropdown={setmastersDropdown}
// //           crmDropdown={crmDropdown}
// //           setcrmDropdown={setcrmDropdown}
// //           salesDropDown={salesDropDown}
// //           setSalesDropDown={setSalesDropDown}
// //           purchaseDropdown={purchaseDropdown}
// //           setPurchaseDropdown={setPurchaseDropdown}
// //           financeDropdown={financeDropdown}
// //           setFinanceDropdown={setFinanceDropdown}
// //         />
// //       )}

// //       <Body
// //         setCurrentPage={updateCurrentPage}
// //         user={user}
// //         expanded={expanded}
// //         setexpanded={setexpanded}
// //         currentPage={currentPage}
// //         setShowSidebar={setShowSidebar}
// //       />
// //     </div>
// //   ) : (
// //     <Navigate to={"/signin"} />
// //   );
// // }
// import React, { useEffect, useState } from "react";
// import { Navigate, useSearchParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import MainSidebar from "../../components/MainComponents/mainSidebar/mainSidebar";
// import Body from "../../components/MainComponents/body/body";
// import Sidebar from "../../components/MainComponents/sidebar/sidebar";
// import "./userDashboard.css";

// export default function UserDashboard() {
//   const { user, isAuthenticated } = useSelector((state) => state.auth);
//   const [searchParams] = useSearchParams();
//   const [expanded, setexpanded] = useState(false);
//   const [currentPage, setCurrentPage] = useState("");
//   const [showSidebar, setShowSidebar] = useState(false);

//   const [mastersDropdown, setmastersDropdown] = useState(false);
//   const [crmDropdown, setcrmDropdown] = useState(false);
//   const [salesDropDown, setSalesDropDown] = useState(false);
//   const [purchaseDropdown, setPurchaseDropdown] = useState(false);
//   const [financeDropdown, setFinanceDropdown] = useState(false);

//   // Set default page when component loads
//   useEffect(() => {
//     setCurrentPage(searchParams.get("tab") || "dashboard");
//   }, [searchParams]);

//   const updateCurrentPage = (tab) => {
//     const params = new URLSearchParams(searchParams);
//     params.set("tab", tab);
//     window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
//     setCurrentPage(tab);
//   };

//   // ✅ Only redirect if NOT authenticated
//   if (!isAuthenticated) {
//     return <Navigate to="/signin" replace />;
//   }

//   useEffect(() => {
//     console.log("UserDashboard render, isAuthenticated=", isAuthenticated, "user=", user);
//   }, [isAuthenticated, user]);

//   return (
//     <div className="userDashboard">
//       <MainSidebar
//         expanded={expanded}
//         currentPage={currentPage}
//         setCurrentPage={updateCurrentPage}
//         mastersDropdown={mastersDropdown}
//         setmastersDropdown={setmastersDropdown}
//         crmDropdown={crmDropdown}
//         setcrmDropdown={setcrmDropdown}
//         salesDropDown={salesDropDown}
//         setSalesDropDown={setSalesDropDown}
//         purchaseDropdown={purchaseDropdown}
//         setPurchaseDropdown={setPurchaseDropdown}
//         financeDropdown={financeDropdown}
//         setFinanceDropdown={setFinanceDropdown}
//       />

//       {showSidebar && (
//         <Sidebar
//           setShowSidebar={setShowSidebar}
//           currentPage={currentPage}
//           setCurrentPage={updateCurrentPage}
//           mastersDropdown={mastersDropdown}
//           setmastersDropdown={setmastersDropdown}
//           crmDropdown={crmDropdown}
//           setcrmDropdown={setcrmDropdown}
//           salesDropDown={salesDropDown}
//           setSalesDropDown={setSalesDropDown}
//           purchaseDropdown={purchaseDropdown}
//           setPurchaseDropdown={setPurchaseDropdown}
//           financeDropdown={financeDropdown}
//           setFinanceDropdown={setFinanceDropdown}
//         />
//       )}

//       <Body
//         setCurrentPage={updateCurrentPage}
//         user={user}
//         expanded={expanded}
//         setexpanded={setexpanded}
//         currentPage={currentPage}
//         setShowSidebar={setShowSidebar}
//       />
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import MainSidebar from "../../components/MainComponents/mainSidebar/mainSidebar";
import Body from "../../components/MainComponents/body/body";
import Sidebar from "../../components/MainComponents/sidebar/sidebar";
import "./userDashboard.css";

export default function UserDashboard() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const [expanded, setexpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(
    searchParams.get("tab") || "dashboard" // ✅ initialise directly, no flash
  );
  const [showSidebar, setShowSidebar] = useState(false);

  const [mastersDropdown, setmastersDropdown] = useState(false);
  const [crmDropdown, setcrmDropdown] = useState(false);
  const [salesDropDown, setSalesDropDown] = useState(false);
  const [purchaseDropdown, setPurchaseDropdown] = useState(false);
  const [financeDropdown, setFinanceDropdown] = useState(false);

  // Sync tab from URL when it changes externally (e.g. back/forward)
  useEffect(() => {
    const tab = searchParams.get("tab") || "dashboard";
    setCurrentPage(tab);
  }, [searchParams]);

  const updateCurrentPage = (tab) => {
    setSearchParams({ tab }); // ✅ use setSearchParams — keeps React Router in sync
    setCurrentPage(tab);
  };

  // ✅ Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="userDashboard">
      <MainSidebar
        expanded={expanded}
        currentPage={currentPage}
        setCurrentPage={updateCurrentPage}
        mastersDropdown={mastersDropdown}
        setmastersDropdown={setmastersDropdown}
        crmDropdown={crmDropdown}
        setcrmDropdown={setcrmDropdown}
        salesDropDown={salesDropDown}
        setSalesDropDown={setSalesDropDown}
        purchaseDropdown={purchaseDropdown}
        setPurchaseDropdown={setPurchaseDropdown}
        financeDropdown={financeDropdown}
        setFinanceDropdown={setFinanceDropdown}
      />

      {showSidebar && (
        <Sidebar
          setShowSidebar={setShowSidebar}
          currentPage={currentPage}
          setCurrentPage={updateCurrentPage}
          mastersDropdown={mastersDropdown}
          setmastersDropdown={setmastersDropdown}
          crmDropdown={crmDropdown}
          setcrmDropdown={setcrmDropdown}
          salesDropDown={salesDropDown}
          setSalesDropDown={setSalesDropDown}
          purchaseDropdown={purchaseDropdown}
          setPurchaseDropdown={setPurchaseDropdown}
          financeDropdown={financeDropdown}
          setFinanceDropdown={setFinanceDropdown}
        />
      )}

      <Body
        setCurrentPage={updateCurrentPage}
        user={user}
        expanded={expanded}
        setexpanded={setexpanded}
        currentPage={currentPage}
        setShowSidebar={setShowSidebar}
      />
    </div>
  );
}