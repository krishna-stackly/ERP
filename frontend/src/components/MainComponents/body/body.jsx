// import React, { useState, useEffect, useRef } from "react";
// import "./body.css";
// import Attendance from "../../attendance/attendance";
// import Project from "../../projectMenu/project/project";
// import ManageUsers from "../../Masters/userModule/manageUsers.jsx";
// import DepartmentRole from "../../Masters/Department_Role_Module/departmentRole.jsx";
// import Task from "../../taskMenu/task/task";
// import Onboard from "../../onboardMenu/onboard/onboard";
// import Payslip from "../../payslip/payslip";
// import ApplyLeave from "../../apply-leave/applyLeave";
// import UserProfile from "../userProfile/userProfile";
// import { logout } from "../../../redux/authSlice";
// import { useDispatch } from "react-redux";
// import ProjectBugsPage from "../../projectMenu/project-bugs-page/projectBugsPage";
// import Dashboard from "../../dashboard/dashboard";
// import EnquiryList from "../../CRM/enquiry-list/enquiryList";
// import Products from "../../Masters/manageProducts/products";
// import CustomMaster from "../../Masters/CustomerModule/customMaster";
// import QuotationCRM from "../../CRM/quotation-crm/quotationCRM";
// import SalesCRM from "../../CRM/sales-crm/salesCRM";
// import CreateNewSales from "../../CRM/sales-crm/createNewSales.jsx";
// import DeliveryNoteCRM from "../../CRM/deliveryNote-crm/deliveryNoteCRM";
// import DeliveryReturnCRM from "../../CRM/deliveryReturn-crm/deliveryReturnCRM";
// import CreateNewDelivery from "../../CRM/deliveryNote-crm/createNewDelivery.jsx";
// import CreateNewDeliveryReturn from "../../CRM/deliveryReturn-crm/createNewDeliveryReturn";
// import InvoiceCRM from "../../CRM/invoice-crm/invoiceCRM";
// import InvoiceReturnCRM from "../../CRM/invoice-return/invoiceReturnCRM";
// import CreateNewInvoice from "../../CRM/invoice-crm/createNewInvoice.jsx";
// import CreateNewInvoiceReturn from "../../CRM/invoice-return/createNewInvoiceReturn";
// import PurchaseOrder from "../../purchase/purchase-order/purchaseOrder";
// import CreateNewPurchase from "../../purchase/purchase-order/createNewPurchase.jsx";
// import EditPurchase from "../../purchase/purchase-order/editPurchase.jsx";
// import StockReceipt from "../../purchase/stock-receipt/stockReceipt";
// import CreateNewStockReceipt from "../../purchase/stock-receipt/createNewStockReceipt.jsx";
// import StockReturn from "../../purchase/stock-return/stockReturn";
// import CreateNewStockReturn from "../../purchase/stock-return/createNewStockReturn.jsx";
// import CreditNote from "../../Finance/credit-note/creditNote";
// import CreditNoteDetails from "../../Finance/credit-note/creditNote-details";
// import DebitNote from "../../Finance/debit-note/debitNote";
// import DebitNoteDetails from "../../Finance/debit-note/debitNote-details";
// import SupplierPage from "../../Masters/Supplier/supplierPage.jsx";
// import CreateNewSupplier from "../../Masters/Supplier/createNewSupplier.jsx";

// export default function Body({
//   expanded,
//   setexpanded,
//   currentPage,
//   setShowSidebar,
//   user,
//   setCurrentPage,
// }) {
//   const [projectId,       setProjectId]       = useState(0);
//   const [showUserDetails, setShowUserDetails]  = useState(false);
//   const [selectedPoId,    setSelectedPoId]     = useState(null);

//   // ── Sales Order: null = create, object = edit ─────────────────────────────
//   const [selectedOrder,          setSelectedOrder]          = useState(null);

//   // ── Delivery Note: null = create, object = edit ───────────────────────────
//   const [selectedDelivery,       setSelectedDelivery]       = useState(null);

//   // ── Delivery Return: null = create, object = edit ─────────────────────────
//   const [selectedDeliveryReturn, setSelectedDeliveryReturn] = useState(null);

//   // ── Invoice: null = create, object = edit ─────────────────────────────────
//   const [selectedInvoice,        setSelectedInvoice]        = useState(null);

//   // ── Invoice Return: null = create, object = edit ──────────────────────────
//   const [selectedInvoiceReturn,  setSelectedInvoiceReturn]  = useState(null);

//   // ── Stock Receipt (GRN): null = create, object = edit ─────────────────────
//   const [selectedGRN,            setSelectedGRN]            = useState(null);

//   // ── Stock Return (SRN): null = create, numeric id = edit ──────────────────
//   // stockReturn.jsx passes the numeric DB `id` (not the display SRN_ID string)
//   const [selectedSRNId,          setSelectedSRNId]          = useState(null);
//   const [selectedCreditNote, setSelectedCreditNote] = useState(null); 

//   const profileRef = useRef(null);
//   const dispatch   = useDispatch();

//   function handleSignOut() {
//     dispatch(logout());
//   }

//   function openProjectBugsPage(proId) {
//     setCurrentPage("projectBugsPage");
//     setProjectId(proId);
//   }

//   // ── Unified page setter ───────────────────────────────────────────────────
//   // salesForm          → selectedOrder          (object | null)
//   // deliveryForm       → selectedDelivery       (object | null)
//   // deliveryReturnForm → selectedDeliveryReturn (object | null)
//   // invoiceForm        → selectedInvoice        (object | null)
//   // invoiceReturnForm  → selectedInvoiceReturn  (object | null)
//   // stockReceiptForm   → selectedGRN            (object | null)
//   // editStockReturn    → selectedSRNId          (numeric id | null)
//   function handleSetCurrentPage(page, data = null) {
//     if (page === "salesForm") {
//       setSelectedOrder(data);
//     } else if (page === "deliveryForm") {
//       setSelectedDelivery(data);
//     } else if (page === "deliveryReturnForm") {
//       setSelectedDeliveryReturn(data);
//     } else if (page === "invoiceForm") {
//       setSelectedInvoice(data);
//     } else if (page === "invoiceReturnForm") {
//       setSelectedInvoiceReturn(data);
//     } else if (page === "stockReceiptForm") {
//       setSelectedGRN(data);
//     } else if (page === "editStockReturn") {
//       // data = numeric DB id passed from stockReturn.jsx action button
//       setSelectedSRNId(data);
//     }else if (page === "editStockReturn") {
//   setSelectedSRNId(data);
//     } else if (page === "creditNoteForm") {   // ADD THIS BLOCK
//       setSelectedCreditNote(data);
//     }
//     setCurrentPage(page);
//   }

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (profileRef.current && !profileRef.current.contains(event.target)) {
//         setShowUserDetails(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className={`body-cointainer ${expanded ? "body-long" : ""}`}>

//       {/* ── HEADER ───────────────────────────────────────────────────── */}
//       <div className="header">
//         <div className="header-left">
//           <svg
//             className={expanded ? "right-arrow right-arrow-rot" : "right-arrow"}
//             onClick={() => setexpanded(!expanded)}
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 448 512"
//           >
//             <path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z" />
//           </svg>

//           <svg
//             className="toggler"
//             onClick={() => setShowSidebar(true)}
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 448 512"
//           >
//             <path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z" />
//           </svg>

//           <div className="search-cointainer">
//             <label htmlFor="search">
//               <svg className="search-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
//                 <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
//               </svg>
//             </label>
//             <input className="search" placeholder="Search..." id="search" />
//           </div>
//         </div>

//         <div className="header-right">
//           <svg className="bell-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
//             <path d="M224 0c-17.7 0-32 14.3-32 32l0 19.2C119 66 64 130.6 64 208l0 18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416l384 0c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8l0-18.8c0-77.4-55-142-128-156.8L256 32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3l-64 0-64 0c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" />
//           </svg>

//           <div className="profile-wrapper" ref={profileRef}>
//             <button
//               type="button"
//               className="profile-logo"
//               onClick={(e) => { e.stopPropagation(); setShowUserDetails((prev) => !prev); }}
//             >
//               {user?.profilePic || user?.profile_pic ? (
//                 <img src={user?.profilePic || user?.profile_pic} alt="user profile" />
//               ) : (
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
//                   <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464l349.5 0c-8.9-63.3-63.3-112-129-112l-91.4 0c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3z" />
//                 </svg>
//               )}
//             </button>

//             {showUserDetails && (
//               <div className="logo-container" onClick={(e) => e.stopPropagation()}>
//                 <p>{user?.name || "No name"}</p>
//                 <p>{user?.email || "No email"}</p>
//                 <h4 onClick={() => { setShowUserDetails(false); setCurrentPage("userProfile"); }}>Profile</h4>
//                 <h4 onClick={() => { setShowUserDetails(false); handleSignOut(); }}>Sign out</h4>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ── PAGE ROUTER ──────────────────────────────────────────────── */}
//       <div className="sub-body">
//         {currentPage === "dashboard" ? (
//           <Dashboard />

//         ) : currentPage === "manageUsers" ? (
//           <ManageUsers />

//         ) : currentPage === "departmentRole" ? (
//           <DepartmentRole />

//         ) : currentPage === "products" ? (
//           <Products />

//         ) : currentPage === "customMaster" ? (
//           <CustomMaster />

//         ) : currentPage === "enquiryList" ? (
//           <EnquiryList />

//         ) : currentPage === "quotationCRM" ? (
//           <QuotationCRM />

//         ) : currentPage === "salesCRM" ? (
//           <SalesCRM setCurrentPage={handleSetCurrentPage} />

//         ) : currentPage === "salesForm" ? (
//           <CreateNewSales
//             setCurrentPage={handleSetCurrentPage}
//             editSalesOrderData={selectedOrder || {}}
//             isEdit={!!selectedOrder}
//           />

//         ) : currentPage === "deliveryNoteCRM" ? (
//           <DeliveryNoteCRM setCurrentPage={handleSetCurrentPage} />

//         ) : currentPage === "deliveryForm" ? (
//           <CreateNewDelivery
//             setCurrentPage={handleSetCurrentPage}
//             editDeliveryData={selectedDelivery || {}}
//             isEdit={!!selectedDelivery}
//           />

//         ) : currentPage === "deliveryReturnCRM" ? (
//           <DeliveryReturnCRM setCurrentPage={handleSetCurrentPage} />

//         ) : currentPage === "deliveryReturnForm" ? (
//           <CreateNewDeliveryReturn
//             setCurrentPage={handleSetCurrentPage}
//             editDNRData={selectedDeliveryReturn || {}}
//             isEdit={!!selectedDeliveryReturn}
//           />

//         ) : currentPage === "invoiceCRM" ? (
//           <InvoiceCRM setCurrentPage={handleSetCurrentPage} />

//         ) : currentPage === "invoiceForm" ? (
//           <CreateNewInvoice
//             setCurrentPage={handleSetCurrentPage}
//             editInvoiceData={selectedInvoice || {}}
//             isEdit={!!selectedInvoice}
//           />

//         ) : currentPage === "invoiceReturnCRM" ? (
//           <InvoiceReturnCRM setCurrentPage={handleSetCurrentPage} />

//         ) : currentPage === "invoiceReturnForm" ? (
//           <CreateNewInvoiceReturn
//             setCurrentPage={handleSetCurrentPage}
//             editInvoiceReturnData={selectedInvoiceReturn || {}}
//             isEdit={!!selectedInvoiceReturn}
//           />

//                 )  : currentPage === "creditNote" ? (
//           <CreditNote setCurrentPage={handleSetCurrentPage} />

//         ) : currentPage === "creditNoteForm" ? (          // ADD THIS ROUTE
//           <CreditNoteDetails
//             setCurrentPage={handleSetCurrentPage}
//             editCreditNoteData={selectedCreditNote || {}}
//             isEdit={!!selectedCreditNote}
//           />

//         ) : currentPage === "viewCreditNote" ? (          // KEEP AS FALLBACK
//           <CreditNoteDetails
//             setCurrentPage={handleSetCurrentPage}
//             editCreditNoteData={{}}
//             isEdit={false}
//           />
//         ) : currentPage === "debitNote" ? (
//           <DebitNote setCurrentPage={handleSetCurrentPage} />

//         ) : currentPage === "viewDebitNote" ? (
//           <DebitNoteDetails />

//         ) : currentPage === "purchaseOrder" ? (
//           <PurchaseOrder
//             setCurrentPage={handleSetCurrentPage}
//             setSelectedPoId={setSelectedPoId}
//           />

//         ) : currentPage === "createNewPurchase" ? (
//           <CreateNewPurchase />

//         ) : currentPage === "editPurchase" ? (
//           <EditPurchase poId={selectedPoId} />

//         ) : currentPage === "supplierPage" ? (
//           <SupplierPage setCurrentPage={handleSetCurrentPage} />

//         ) : currentPage === "createNewSupplier" ? (
//           <CreateNewSupplier />

//         ) : currentPage === "editSupplier" ? (
//           <EditPurchase />

//         ) : currentPage === "stockReceipt" ? (
//           <StockReceipt setCurrentPage={handleSetCurrentPage} />

//         ) : currentPage === "stockReceiptForm" ? (
//           <CreateNewStockReceipt
//             setCurrentPage={handleSetCurrentPage}
//             editGRNData={selectedGRN || {}}
//             isEdit={!!selectedGRN}
//           />

//         ) : currentPage === "stockReturn" ? (
//           // Pass handleSetCurrentPage so Edit/View button can call
//           // setCurrentPage("editStockReturn", numericId)
//           <StockReturn setCurrentPage={handleSetCurrentPage} />

//         ) : currentPage === "createNewStockReturn" ? (
//           // Create mode — no srnId needed
//           <CreateNewStockReturn mode="create" />

//         ) : currentPage === "editStockReturn" ? (
//           // Edit/View mode — pass numeric DB id from selectedSRNId
//           <CreateNewStockReturn mode="edit" srnId={selectedSRNId} />

//         ) : currentPage === "task" ? (
//           <Task />

//         ) : currentPage === "attendance" ? (
//           <Attendance />

//         ) : currentPage === "onboarding" ? (
//           <Onboard />

//         ) : currentPage === "project" ? (
//           <Project openProjectBugsPage={openProjectBugsPage} />

//         ) : currentPage === "payslip" ? (
//           <Payslip />

//         ) : currentPage === "applyLeave" ? (
//           <ApplyLeave />

//         ) : currentPage === "projectBugsPage" ? (
//           <ProjectBugsPage projectId={projectId} />

//         ) : currentPage === "userProfile" ? (
//           <UserProfile />

//         ) : (
//           <p></p>
//         )}
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect, useRef } from "react";
import "./body.css";
import Attendance from "../../attendance/attendance";
import Project from "../../projectMenu/project/project";
import ManageUsers from "../../Masters/userModule/manageUsers.jsx";
import DepartmentRole from "../../Masters/Department_Role_Module/departmentRole.jsx";
import Task from "../../taskMenu/task/task";
import Onboard from "../../onboardMenu/onboard/onboard";
import Payslip from "../../payslip/payslip";
import ApplyLeave from "../../apply-leave/applyLeave";
import UserProfile from "../userProfile/userProfile";
import { logout } from "../../../redux/authSlice";
import { useDispatch } from "react-redux";
import ProjectBugsPage from "../../projectMenu/project-bugs-page/projectBugsPage";
import Dashboard from "../../dashboard/dashboard";
import EnquiryList from "../../CRM/enquiry-list/enquiryList";
import Products from "../../Masters/manageProducts/products";
import CustomMaster from "../../Masters/CustomerModule/customMaster";
import QuotationCRM from "../../CRM/quotation-crm/quotationCRM";
import SalesCRM from "../../CRM/sales-crm/salesCRM";
import CreateNewSales from "../../CRM/sales-crm/createNewSales.jsx";
import DeliveryNoteCRM from "../../CRM/deliveryNote-crm/deliveryNoteCRM";
import DeliveryReturnCRM from "../../CRM/deliveryReturn-crm/deliveryReturnCRM";
import CreateNewDelivery from "../../CRM/deliveryNote-crm/createNewDelivery.jsx";
import CreateNewDeliveryReturn from "../../CRM/deliveryReturn-crm/createNewDeliveryReturn";
import InvoiceCRM from "../../CRM/invoice-crm/invoiceCRM";
import InvoiceReturnCRM from "../../CRM/invoice-return/invoiceReturnCRM";
import CreateNewInvoice from "../../CRM/invoice-crm/createNewInvoice.jsx";
import CreateNewInvoiceReturn from "../../CRM/invoice-return/createNewInvoiceReturn";
import PurchaseOrder from "../../purchase/purchase-order/purchaseOrder";
import CreateNewPurchase from "../../purchase/purchase-order/createNewPurchase.jsx";
import EditPurchase from "../../purchase/purchase-order/editPurchase.jsx";
import StockReceipt from "../../purchase/stock-receipt/stockReceipt";
import CreateNewStockReceipt from "../../purchase/stock-receipt/createNewStockReceipt.jsx";
import StockReturn from "../../purchase/stock-return/stockReturn";
import CreateNewStockReturn from "../../purchase/stock-return/createNewStockReturn.jsx";
import CreditNote from "../../Finance/credit-note/creditNote";
import CreditNoteDetails from "../../Finance/credit-note/creditNote-details";
import DebitNote from "../../Finance/debit-note/debitNote";
import DebitNoteDetails from "../../Finance/debit-note/debitNote-details";
import TrailBalance from "../../Finance/trial-balance/trailBalance";
import AddTrailBalance from "../../Finance/trial-balance/addTrailBalance";
import PettyCash from "../../Finance/petty-cash/pettyCash";
import AddPettyCash from "../../Finance/petty-cash/addPettyCash";
import FormReceivable from "../../Finance/form-receivable/formReceivable";
import AddFormReceivable from "../../Finance/form-receivable/addFormReceivable";
import AssetMaintenance from "../../Finance/asset-maintenance/assetMaintenance";
import AddAssetMaintenance from "../../Finance/asset-maintenance/addAssetMaintenance";
import AssetSale from "../../Finance/asset-sale/assetSale";
import AddAssetSale from "../../Finance/asset-sale/addAssetSale";
import SupplierPage from "../../Masters/Supplier/supplierPage.jsx";
import CreateNewSupplier from "../../Masters/Supplier/createNewSupplier.jsx";

export default function Body({
  expanded,
  setexpanded,
  currentPage,
  setShowSidebar,
  user,
  setCurrentPage,
}) {
  const [projectId,       setProjectId]       = useState(0);
  const [showUserDetails, setShowUserDetails]  = useState(false);
  const [selectedPoId,    setSelectedPoId]     = useState(null);

  // ── Sales Order: null = create, object = edit ─────────────────────────────
  const [selectedOrder,          setSelectedOrder]          = useState(null);

  // ── Delivery Note: null = create, object = edit ───────────────────────────
  const [selectedDelivery,       setSelectedDelivery]       = useState(null);

  // ── Delivery Return: null = create, object = edit ─────────────────────────
  const [selectedDeliveryReturn, setSelectedDeliveryReturn] = useState(null);

  // ── Invoice: null = create, object = edit ─────────────────────────────────
  const [selectedInvoice,        setSelectedInvoice]        = useState(null);

  // ── Invoice Return: null = create, object = edit ──────────────────────────
  const [selectedInvoiceReturn,  setSelectedInvoiceReturn]  = useState(null);

  // ── Stock Receipt (GRN): null = create, object = edit ─────────────────────
  const [selectedGRN,            setSelectedGRN]            = useState(null);

  // ── Stock Return (SRN): null = create, numeric id = edit ──────────────────
  const [selectedSRNId,          setSelectedSRNId]          = useState(null);

  // ── Credit Note: null = create, object = edit ─────────────────────────────
  const [selectedCreditNote,     setSelectedCreditNote]     = useState(null);

  // ── Debit Note: null = create, object = edit ──────────────────────────────
  const [selectedDebitNote,      setSelectedDebitNote]      = useState(null);

  // ── Trial Balance: null = create, object = edit ───────────────────────────
  const [selectedTrailBalance,   setSelectedTrailBalance]   = useState(null);

  // ── Petty Cash: null = create, object = edit ──────────────────────────────
  const [selectedPettyCash,      setSelectedPettyCash]      = useState(null);

  // ── Form Receivable: null = create, object = edit ─────────────────────────
  const [selectedFormReceivable, setSelectedFormReceivable] = useState(null);

  // ── Asset Maintenance: null = create, object = edit ───────────────────────
  const [selectedAssetMaintenance, setSelectedAssetMaintenance] = useState(null);

  // ── Asset Sale: null = create, object = edit ──────────────────────────────
  const [selectedAssetSale, setSelectedAssetSale] = useState(null);

  const profileRef = useRef(null);
  const dispatch   = useDispatch();

  function handleSignOut() {
    dispatch(logout());
  }

  function openProjectBugsPage(proId) {
    setCurrentPage("projectBugsPage");
    setProjectId(proId);
  }

  // ── Unified page setter ───────────────────────────────────────────────────
  function handleSetCurrentPage(page, data = null) {
    if (page === "salesForm") {
      setSelectedOrder(data);
    } else if (page === "deliveryForm") {
      setSelectedDelivery(data);
    } else if (page === "deliveryReturnForm") {
      setSelectedDeliveryReturn(data);
    } else if (page === "invoiceForm") {
      setSelectedInvoice(data);
    } else if (page === "invoiceReturnForm") {
      setSelectedInvoiceReturn(data);
    } else if (page === "stockReceiptForm") {
      setSelectedGRN(data);
    } else if (page === "editStockReturn") {
      setSelectedSRNId(data);
    } else if (page === "creditNoteForm") {
      setSelectedCreditNote(data);
    } else if (page === "debitNoteForm") {
      setSelectedDebitNote(data);
    } else if (page === "trailBalanceForm") {
      setSelectedTrailBalance(data);
    } else if (page === "pettyCashForm") {
      setSelectedPettyCash(data);
    } else if (page === "formReceivableForm") {
      setSelectedFormReceivable(data);
    } else if (page === "assetMaintenanceForm") {
      setSelectedAssetMaintenance(data);
    } else if (page === "assetSaleForm") {
      setSelectedAssetSale(data);
    }
    setCurrentPage(page);
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowUserDetails(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`body-cointainer ${expanded ? "body-long" : ""}`}>

      {/* ── HEADER ───────────────────────────────────────────────────── */}
      <div className="header">
        <div className="header-left">
          <svg
            className={expanded ? "right-arrow right-arrow-rot" : "right-arrow"}
            onClick={() => setexpanded(!expanded)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z" />
          </svg>

          <svg
            className="toggler"
            onClick={() => setShowSidebar(true)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z" />
          </svg>

          <div className="search-cointainer">
            <label htmlFor="search">
              <svg className="search-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
              </svg>
            </label>
            <input className="search" placeholder="Search..." id="search" />
          </div>
        </div>

        <div className="header-right">
          <svg className="bell-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M224 0c-17.7 0-32 14.3-32 32l0 19.2C119 66 64 130.6 64 208l0 18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416l384 0c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8l0-18.8c0-77.4-55-142-128-156.8L256 32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3l-64 0-64 0c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" />
          </svg>

          <div className="profile-wrapper" ref={profileRef}>
            <button
              type="button"
              className="profile-logo"
              onClick={(e) => { e.stopPropagation(); setShowUserDetails((prev) => !prev); }}
            >
              {user?.profilePic || user?.profile_pic ? (
                <img src={user?.profilePic || user?.profile_pic} alt="user profile" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464l349.5 0c-8.9-63.3-63.3-112-129-112l-91.4 0c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3z" />
                </svg>
              )}
            </button>

            {showUserDetails && (
              <div className="logo-container" onClick={(e) => e.stopPropagation()}>
                <p>{user?.name || "No name"}</p>
                <p>{user?.email || "No email"}</p>
                <h4 onClick={() => { setShowUserDetails(false); setCurrentPage("userProfile"); }}>Profile</h4>
                <h4 onClick={() => { setShowUserDetails(false); handleSignOut(); }}>Sign out</h4>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── PAGE ROUTER ──────────────────────────────────────────────── */}
      <div className="sub-body">
        {currentPage === "dashboard" ? (
          <Dashboard />

        ) : currentPage === "manageUsers" ? (
          <ManageUsers />

        ) : currentPage === "departmentRole" ? (
          <DepartmentRole />

        ) : currentPage === "products" ? (
          <Products />

        ) : currentPage === "customMaster" ? (
          <CustomMaster />

        ) : currentPage === "enquiryList" ? (
          <EnquiryList />

        ) : currentPage === "quotationCRM" ? (
          <QuotationCRM />

        ) : currentPage === "salesCRM" ? (
          <SalesCRM setCurrentPage={handleSetCurrentPage} />

        ) : currentPage === "salesForm" ? (
          <CreateNewSales
            setCurrentPage={handleSetCurrentPage}
            editSalesOrderData={selectedOrder || {}}
            isEdit={!!selectedOrder}
          />

        ) : currentPage === "deliveryNoteCRM" ? (
          <DeliveryNoteCRM setCurrentPage={handleSetCurrentPage} />

        ) : currentPage === "deliveryForm" ? (
          <CreateNewDelivery
            setCurrentPage={handleSetCurrentPage}
            editDeliveryData={selectedDelivery || {}}
            isEdit={!!selectedDelivery}
          />

        ) : currentPage === "deliveryReturnCRM" ? (
          <DeliveryReturnCRM setCurrentPage={handleSetCurrentPage} />

        ) : currentPage === "deliveryReturnForm" ? (
          <CreateNewDeliveryReturn
            setCurrentPage={handleSetCurrentPage}
            editDNRData={selectedDeliveryReturn || {}}
            isEdit={!!selectedDeliveryReturn}
          />

        ) : currentPage === "invoiceCRM" ? (
          <InvoiceCRM setCurrentPage={handleSetCurrentPage} />

        ) : currentPage === "invoiceForm" ? (
          <CreateNewInvoice
            setCurrentPage={handleSetCurrentPage}
            editInvoiceData={selectedInvoice || {}}
            isEdit={!!selectedInvoice}
          />

        ) : currentPage === "invoiceReturnCRM" ? (
          <InvoiceReturnCRM setCurrentPage={handleSetCurrentPage} />

        ) : currentPage === "invoiceReturnForm" ? (
          <CreateNewInvoiceReturn
            setCurrentPage={handleSetCurrentPage}
            editInvoiceReturnData={selectedInvoiceReturn || {}}
            isEdit={!!selectedInvoiceReturn}
          />

        ) : currentPage === "creditNote" ? (
          <CreditNote setCurrentPage={handleSetCurrentPage} />

        ) : currentPage === "creditNoteForm" ? (
          <CreditNoteDetails
            setCurrentPage={handleSetCurrentPage}
            editCreditNoteData={selectedCreditNote || {}}
            isEdit={!!selectedCreditNote}
          />

        ) : currentPage === "viewCreditNote" ? (
          <CreditNoteDetails
            setCurrentPage={handleSetCurrentPage}
            editCreditNoteData={{}}
            isEdit={false}
          />

        ) : currentPage === "debitNote" ? (
          <DebitNote setCurrentPage={handleSetCurrentPage} />

        ) : currentPage === "debitNoteForm" ? (
          <DebitNoteDetails
            setCurrentPage={handleSetCurrentPage}
            editDebitNoteData={selectedDebitNote || {}}
            isEdit={!!selectedDebitNote}
          />

        ) : currentPage === "trailBalance" ? (
          <TrailBalance setCurrentPage={handleSetCurrentPage} />

        ) : currentPage === "trailBalanceForm" ? (
          <AddTrailBalance
            setCurrentPage={handleSetCurrentPage}
            editData={selectedTrailBalance || {}}
            isEdit={!!selectedTrailBalance}
          />

        ) : currentPage === "pettyCash" ? (
          <PettyCash setCurrentPage={handleSetCurrentPage} />

        ) : currentPage === "pettyCashForm" ? (
          <AddPettyCash
            setCurrentPage={handleSetCurrentPage}
            editData={selectedPettyCash || {}}
            isEdit={!!selectedPettyCash}
          />

        ) : currentPage === "formReceivable" ? (
          <FormReceivable setCurrentPage={handleSetCurrentPage} />

        ) : currentPage === "formReceivableForm" ? (
          <AddFormReceivable
            setCurrentPage={handleSetCurrentPage}
            editData={selectedFormReceivable || {}}
            isEdit={!!selectedFormReceivable}
          />

        ) : currentPage === "assetMaintenance" ? (
          <AssetMaintenance setCurrentPage={handleSetCurrentPage} />

        ) : currentPage === "assetMaintenanceForm" ? (
          <AddAssetMaintenance
            setCurrentPage={handleSetCurrentPage}
            editData={selectedAssetMaintenance || {}}
            isEdit={!!selectedAssetMaintenance}
          />

        ) : currentPage === "assetSale" ? (
          <AssetSale setCurrentPage={handleSetCurrentPage} />

        ) : currentPage === "assetSaleForm" ? (
          <AddAssetSale
            setCurrentPage={handleSetCurrentPage}
            editData={selectedAssetSale || {}}
            isEdit={!!selectedAssetSale}
          />

        ) : currentPage === "purchaseOrder" ? (
          <PurchaseOrder
            setCurrentPage={handleSetCurrentPage}
            setSelectedPoId={setSelectedPoId}
          />

        ) : currentPage === "createNewPurchase" ? (
          <CreateNewPurchase />

        ) : currentPage === "editPurchase" ? (
          <EditPurchase poId={selectedPoId} />

        ) : currentPage === "supplierPage" ? (
          <SupplierPage setCurrentPage={handleSetCurrentPage} />

        ) : currentPage === "createNewSupplier" ? (
          <CreateNewSupplier />

        ) : currentPage === "editSupplier" ? (
          <EditPurchase />

        ) : currentPage === "stockReceipt" ? (
          <StockReceipt setCurrentPage={handleSetCurrentPage} />

        ) : currentPage === "stockReceiptForm" ? (
          <CreateNewStockReceipt
            setCurrentPage={handleSetCurrentPage}
            editGRNData={selectedGRN || {}}
            isEdit={!!selectedGRN}
          />

        ) : currentPage === "stockReturn" ? (
          <StockReturn setCurrentPage={handleSetCurrentPage} />

        ) : currentPage === "createNewStockReturn" ? (
          <CreateNewStockReturn mode="create" />

        ) : currentPage === "editStockReturn" ? (
          <CreateNewStockReturn mode="edit" srnId={selectedSRNId} />

        ) : currentPage === "task" ? (
          <Task />

        ) : currentPage === "attendance" ? (
          <Attendance />

        ) : currentPage === "onboarding" ? (
          <Onboard />

        ) : currentPage === "project" ? (
          <Project openProjectBugsPage={openProjectBugsPage} />

        ) : currentPage === "payslip" ? (
          <Payslip />

        ) : currentPage === "applyLeave" ? (
          <ApplyLeave />

        ) : currentPage === "projectBugsPage" ? (
          <ProjectBugsPage projectId={projectId} />

        ) : currentPage === "userProfile" ? (
          <UserProfile />

        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
}