import { createContext, useState } from "react";
import UserDashboard from "./pages/userDashboard/userDashboard";
import Signin from "./pages/signin/signin";
import Signup from "./pages/signUp/signup";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BugDetailPage from "./components/projectMenu/bug-detail-page/bugDetailPage";
import AddNewCandidate from "./components/onboardMenu/add-new-candidate/addNewCandidate";
import CreateNewSales from "./components/CRM/sales-crm/createNewSales.jsx"
import EditNewSales from "./components/CRM/sales-crm/editNewSales.jsx"
import CreateNewDelivery from "./components/CRM/deliveryNote-crm/createNewDelivery.jsx"
import EditDelivery from "./components//CRM/deliveryNote-crm/editDelivery.jsx"
import CreateNewInvoice from "./components/CRM/invoice-crm/createNewInvoice.jsx"
import EditInvoice from "./components/CRM/invoice-crm/editInvoice.jsx"
import CreateNewPurchase from "./components/purchase/purchase-order/createNewPurchase.jsx";
import EditPurchase from "./components/purchase/purchase-order/editPurchase.jsx"
import CreateNewStockReceipt from "./components/purchase/stock-receipt/createNewStockReceipt.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/" element={<UserDashboard />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/bug-detalis/:errorId" element={<BugDetailPage />} />
        <Route path="/add-new-candidate" element={<AddNewCandidate />} />
        <Route
          path="/edit-candidate/:candidateId"
          element={<AddNewCandidate />}
        />
        <Route path="/new-sales" element={<CreateNewSales />} />
        <Route path="/edit-sales" element={<EditNewSales />} />
        <Route path="/new-delivery-note" element={<CreateNewDelivery />} />
        <Route path="/eddit-delivery" element={<EditDelivery />} />
        <Route path="/new-invoice" element={<CreateNewInvoice />} />
        <Route path="/edit-invoice" element={<EditInvoice />} />
        <Route path="/new-purchase" element={<CreateNewPurchase />} />
        <Route path="/edit-purchase" element={<EditPurchase />} />
        <Route path="/new-stock-receipt" element={<CreateNewStockReceipt />} />
      </Routes>
    </BrowserRouter>
  );
}