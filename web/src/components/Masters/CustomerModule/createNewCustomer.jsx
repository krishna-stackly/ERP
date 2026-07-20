import React, { useState, useEffect } from "react";
import "./createNewCustomer.css";
import { toast } from "react-toastify";
import customerApiProvider from "../../../network/customer-api-provider";

const COUNTRIES = [
  "India", "United States", "United Kingdom", "Canada", "Australia",
  "Germany", "France", "China", "Japan", "Brazil", "Russia",
  "Mexico", "South Korea", "Italy", "Spain", "Netherlands",
  "Saudi Arabia", "United Arab Emirates", "Singapore", "Malaysia",
  "Bangladesh", "Pakistan", "Sri Lanka", "Nepal", "Indonesia",
  "Philippines", "Thailand", "Vietnam", "South Africa", "Nigeria",
  "Egypt", "Kenya", "Argentina", "Colombia", "Chile", "Peru",
  "New Zealand", "Switzerland", "Sweden", "Norway", "Denmark",
  "Belgium", "Poland", "Portugal", "Turkey", "Israel",
];

const EMPTY_FORM = {
  first_name: "", last_name: "", customer_type: "", customer_id: "",
  status: "", assigned_sales_rep: "", email: "", phone_number: "",
  address: "", street: "", city: "", state: "", zip_code: "", country: "",
  company_name: "", industry: "", location: "", gst_tax_id: "",
  credit_limit: "", available_limit: "", billing_address: "",
  shipping_address: "", payment_terms: "", credit_term: "",
};

export default function CreateNewCustomer({
  setShowAddCustomer,
  editShowAddCustom,
  editAddCustomData,
  setEditAddCustomData,
}) {
  const [customIndustry, setCustomIndustry] = useState(false);
  const [customPayment, setCustomPayment] = useState(false);
  const [salesRepList, setSalesRepList] = useState([]);
  const [lastEditDate, setLastEditDate] = useState("");
  const [billingManuallySet, setBillingManuallySet] = useState(false);

  const [NewCustomer, setNewCustomer] = useState(EMPTY_FORM);

  useEffect(() => {
    const loadSalesReps = async () => {
      const salesReps = await customerApiProvider.fetchSalesReps();
      setSalesRepList(salesReps || []);
    };
    loadSalesReps();
  }, []);

  useEffect(() => {
    if (editShowAddCustom && editAddCustomData && Object.keys(editAddCustomData).length > 0) {
      setNewCustomer({
        first_name: editAddCustomData.first_name || "",
        last_name: editAddCustomData.last_name || "",
        customer_type: editAddCustomData.customer_type || "",
        customer_id: editAddCustomData.customer_id || "",
        status: editAddCustomData.status || "",
        assigned_sales_rep: editAddCustomData.assigned_sales_rep || "",
        email: editAddCustomData.email || "",
        phone_number: editAddCustomData.phone_number || "",
        address: editAddCustomData.address || "",
        street: editAddCustomData.street || "",
        city: editAddCustomData.city || "",
        state: editAddCustomData.state || "",
        zip_code: editAddCustomData.zip_code || "",
        country: editAddCustomData.country || "",
        company_name: editAddCustomData.company_name || "",
        industry: editAddCustomData.industry || "",
        location: editAddCustomData.location || "",
        gst_tax_id: editAddCustomData.gst_tax_id || "",
        credit_limit: editAddCustomData.credit_limit || "",
        available_limit: editAddCustomData.available_limit || "",
        billing_address: editAddCustomData.billing_address || "",
        shipping_address: editAddCustomData.shipping_address || "",
        payment_terms: editAddCustomData.payment_terms || "",
        credit_term: editAddCustomData.credit_term || "",
      });
      setBillingManuallySet(true);
      setLastEditDate(editAddCustomData.last_edit_date || "");

      if (editAddCustomData.industry && ![
        "Technology", "Manufacturing", "Healthcare", "Finance",
        "Education", "Construction", "Transportation", "Hospitality",
        "Energy", "Media & Comms", "Retail"
      ].includes(editAddCustomData.industry)) {
        setCustomIndustry(true);
      }
      if (editAddCustomData.payment_terms && ![
        "Net 15", "Net 30", "Net 45", "Net 60", "Due on Receipt"
      ].includes(editAddCustomData.payment_terms)) {
        setCustomPayment(true);
      }
    } else {
      const today = new Date();
      const options = { month: "long", day: "numeric", year: "numeric" };
      setLastEditDate(today.toLocaleDateString("en-US", options));
    }
  }, [editAddCustomData, editShowAddCustom]);

  // Auto-calculate available limit = credit limit (create mode only)
  useEffect(() => {
    if (!editShowAddCustom) {
      setNewCustomer(prev => ({ ...prev, available_limit: prev.credit_limit }));
    }
  }, [NewCustomer.credit_limit]);

  const handleNewCustomerDataChange = (e) => {
    const { id, value } = e.target;
    setNewCustomer((prev) => {
      const updated = { ...prev, [id]: value };
      if (!billingManuallySet && ['street', 'city', 'state', 'zip_code', 'country'].includes(id)) {
        const street  = id === 'street'   ? value : prev.street;
        const city    = id === 'city'     ? value : prev.city;
        const state   = id === 'state'    ? value : prev.state;
        const zip     = id === 'zip_code' ? value : prev.zip_code;
        const country = id === 'country'  ? value : prev.country;
        updated.billing_address = [street, city, state, zip, country].filter(Boolean).join(', ');
      }
      return updated;
    });
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setNewCustomer(prev => ({ ...prev, phone_number: val }));
  };

  const handleCreditLimitChange = (e) => {
    const val = e.target.value;
    if (val === '' || parseFloat(val) >= 0) {
      setNewCustomer(prev => ({ ...prev, credit_limit: val }));
    }
  };

  const handleBillingAddressChange = (e) => {
    setBillingManuallySet(true);
    setNewCustomer(prev => ({ ...prev, billing_address: e.target.value }));
  };

  const changeCustomIndustry = (e) => {
    const value = e.target.value;
    if (value === "custom") {
      setNewCustomer(prev => ({ ...prev, industry: "" }));
      setCustomIndustry(true);
    } else {
      setNewCustomer(prev => ({ ...prev, industry: value }));
      setCustomIndustry(false);
    }
  };

  const changeCustomPayment = (e) => {
    const value = e.target.value;
    if (value === "custom") {
      setNewCustomer(prev => ({ ...prev, payment_terms: "" }));
      setCustomPayment(true);
    } else {
      setNewCustomer(prev => ({ ...prev, payment_terms: value }));
      setCustomPayment(false);
    }
  };

  const handlecreateNewCustomerReset = (e) => {
    e.preventDefault();
    const hasData = Object.values(NewCustomer).some(v => v !== '');
    if (hasData && !window.confirm("Are you sure you want to discard all changes?")) return;
    setNewCustomer(EMPTY_FORM);
    setCustomIndustry(false);
    setCustomPayment(false);
    setBillingManuallySet(false);
    setShowAddCustomer(false);
    if (setEditAddCustomData) setEditAddCustomData({});
  };

  const handlecreateNewCustomerSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = { ...NewCustomer, last_edit_date: lastEditDate };
      let response;
      if (editShowAddCustom && editAddCustomData.id) {
        response = await customerApiProvider.updateCustomer(editAddCustomData.id, formData);
      } else {
        response = await customerApiProvider.createCustomer(formData);
      }
      if (response) {
        setNewCustomer(EMPTY_FORM);
        setCustomIndustry(false);
        setCustomPayment(false);
        setBillingManuallySet(false);
        setShowAddCustomer(false);
        if (setEditAddCustomData) setEditAddCustomData({});
      }
    } catch (error) {
      console.error("Error submitting customer:", error);
    }
  };

  return (
    <div className="createNewCustomer-container">
      <form onSubmit={handlecreateNewCustomerSubmit}>
        <div className="createNewCustomer-tit">
          <p>{editShowAddCustom ? "Edit" : "Create New"} Customer</p>
          <div
            onClick={() => {
              const hasData = Object.values(NewCustomer).some(v => v !== '');
              if (hasData && !window.confirm("Are you sure you want to discard all changes?")) return;
              setShowAddCustomer(false);
              if (setEditAddCustomData) setEditAddCustomData({});
            }}
            className="close-createNewCustomer-container"
          >
            <svg className="circle-x-logo-createNewCustomer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
            </svg>
            <nav>Close</nav>
          </div>
        </div>

        {/* Basic Info */}
        <nav className="createNewCustomer-subtit">Basic Info</nav>
        <div className="createNewCustomer-input-container">
          <div className="createNewCustomer-input-box">
            <label htmlFor="first_name">Primary Contact Name<sup>*</sup></label>
            <input
              value={NewCustomer.first_name}
              onChange={handleNewCustomerDataChange}
              id="first_name"
              type="text"
              placeholder="Full name"
              required
            />
          </div>
          <div className="createNewCustomer-input-box">
            <label htmlFor="customer_type">Customer Type<sup>*</sup></label>
            <select id="customer_type" value={NewCustomer.customer_type} onChange={handleNewCustomerDataChange} required>
              <option value="" disabled hidden>Select Type</option>
              <option value="Individual">Individual</option>
              <option value="Business">Business</option>
              <option value="Organization">Organization</option>
            </select>
          </div>
        </div>
        <div className="createNewCustomer-input-container">
          <div className="createNewCustomer-input-box">
            <label htmlFor="customer_id">Customer ID (Auto Generate)</label>
            <input value={NewCustomer.customer_id} id="customer_id" type="text" placeholder="Auto Generate" disabled />
          </div>
          <div className="createNewCustomer-input-box">
            <label htmlFor="status">Customer Status</label>
            <select value={NewCustomer.status} onChange={handleNewCustomerDataChange} id="status">
              <option value="" disabled hidden>Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div className="createNewCustomer-input-container">
          <div className="createNewCustomer-input-box">
            <label htmlFor="assigned_sales_rep">Assigned Sales Rep</label>
            <select id="assigned_sales_rep" value={NewCustomer.assigned_sales_rep} onChange={handleNewCustomerDataChange}>
              <option value="" disabled hidden>Select Sales Rep</option>
              {salesRepList.length > 0 ? (
                salesRepList.map(rep => (
                  <option key={rep.id} value={rep.id}>{rep.first_name} {rep.last_name || ""}</option>
                ))
              ) : (
                <option value="" disabled>No sales reps available</option>
              )}
            </select>
          </div>
        </div>

        {/* Contact Information */}
        <nav className="createNewCustomer-subtit">Contact Information</nav>
        <div className="createNewCustomer-input-container">
          <div className="createNewCustomer-input-box">
            <label htmlFor="email">Email<sup>*</sup></label>
            <input value={NewCustomer.email} onChange={handleNewCustomerDataChange} id="email" type="email" placeholder="e.g., john@acme.com" required />
          </div>
          <div className="createNewCustomer-input-box">
            <label htmlFor="phone_number">Phone Number<sup>*</sup></label>
            <input
              value={NewCustomer.phone_number}
              onChange={handlePhoneChange}
              id="phone_number"
              type="tel"
              placeholder="10-digit number"
              maxLength={10}
              required
            />
          </div>
        </div>
        <div className="createNewCustomer-input-container">
          <div className="createNewCustomer-input-box">
            <label htmlFor="address">Address</label>
            <input value={NewCustomer.address} onChange={handleNewCustomerDataChange} id="address" type="text" placeholder="123 Industrial Way, Chicago, IL, 60601, USA" />
          </div>
        </div>
        <div className="createNewCustomer-input-container">
          <div className="createNewCustomer-input-box">
            <label htmlFor="street">Street<sup>*</sup></label>
            <input value={NewCustomer.street} onChange={handleNewCustomerDataChange} id="street" type="text" placeholder="e.g., 123 Industrial Way" required />
          </div>
          <div className="createNewCustomer-input-box">
            <label htmlFor="city">City<sup>*</sup></label>
            <input value={NewCustomer.city} onChange={handleNewCustomerDataChange} id="city" type="text" placeholder="e.g., Chicago" required />
          </div>
        </div>
        <div className="createNewCustomer-input-container">
          <div className="createNewCustomer-input-box">
            <label htmlFor="state">State<sup>*</sup></label>
            <input value={NewCustomer.state} onChange={handleNewCustomerDataChange} id="state" type="text" placeholder="e.g., IL" required />
          </div>
          <div className="createNewCustomer-input-box">
            <label htmlFor="zip_code">Zip Code<sup>*</sup></label>
            <input className="increment-decrement-createNewCustomer" value={NewCustomer.zip_code} onChange={handleNewCustomerDataChange} id="zip_code" type="number" placeholder="e.g., 60601" required />
          </div>
        </div>
        <div className="createNewCustomer-input-container">
          <div className="createNewCustomer-input-box">
            <label htmlFor="country">Country<sup>*</sup></label>
            <select value={NewCustomer.country} onChange={handleNewCustomerDataChange} id="country" required>
              <option value="" disabled hidden>Select Country</option>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Company Information — shown for Business/Organization */}
        {NewCustomer.customer_type !== "Individual" && NewCustomer.customer_type !== "" && (
          <>
            <nav className="createNewCustomer-subtit">Company Information</nav>
            <div className="createNewCustomer-input-container">
              <div className="createNewCustomer-input-box">
                <label htmlFor="company_name">Company Name<sup>*</sup></label>
                <input value={NewCustomer.company_name} onChange={handleNewCustomerDataChange} id="company_name" type="text" placeholder="e.g., Acme Corp" required />
              </div>
              <div className="createNewCustomer-input-box">
                <label htmlFor="industry">Industry</label>
                {customIndustry ? (
                  <input value={NewCustomer.industry} onChange={handleNewCustomerDataChange} id="industry" placeholder="Enter industry name" type="text" />
                ) : (
                  <select id="industry" value={NewCustomer.industry} onChange={changeCustomIndustry}>
                    <option value="" disabled hidden>Select Industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Education">Education</option>
                    <option value="Construction">Construction</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Hospitality">Hospitality</option>
                    <option value="Energy">Energy</option>
                    <option value="Retail">Retail</option>
                    <option value="Media & Comms">Media & Comms</option>
                    <option value="custom">+ Custom</option>
                  </select>
                )}
              </div>
            </div>
            <div className="createNewCustomer-input-container">
              <div className="createNewCustomer-input-box">
                <label htmlFor="location">Location<sup>*</sup></label>
                <input value={NewCustomer.location} onChange={handleNewCustomerDataChange} id="location" type="text" placeholder="e.g., Chicago, IL" required />
              </div>
            </div>
          </>
        )}

        {/* Financial Info */}
        <nav className="createNewCustomer-subtit">Financial Info</nav>
        <div className="createNewCustomer-input-container">
          <div className="createNewCustomer-input-box">
            <label htmlFor="payment_terms">Payment Terms</label>
            {customPayment ? (
              <input id="payment_terms" value={NewCustomer.payment_terms} onChange={handleNewCustomerDataChange} placeholder="e.g., Net 30" />
            ) : (
              <select id="payment_terms" value={NewCustomer.payment_terms} onChange={changeCustomPayment}>
                <option value="" disabled hidden>Select Payment Terms</option>
                <option value="Net 15">Net 15</option>
                <option value="Net 30">Net 30</option>
                <option value="Net 45">Net 45</option>
                <option value="Net 60">Net 60</option>
                <option value="Due on Receipt">Due on Receipt</option>
                <option value="custom">+ Custom</option>
              </select>
            )}
          </div>
          <div className="createNewCustomer-input-box">
            <label htmlFor="credit_term">Credit Term</label>
            <select id="credit_term" value={NewCustomer.credit_term} onChange={handleNewCustomerDataChange}>
              <option value="" disabled hidden>Select Credit Term</option>
              <option value="Standard">Standard</option>
              <option value="Extended">Extended</option>
              <option value="Advance">Advance</option>
              <option value="Prepaid">Prepaid</option>
              <option value="COD (Cash on Delivery)">COD (Cash on Delivery)</option>
            </select>
          </div>
        </div>
        <div className="createNewCustomer-input-container">
          <div className="createNewCustomer-input-box">
            <label htmlFor="gst_tax_id">GST/Tax ID</label>
            <input value={NewCustomer.gst_tax_id} onChange={handleNewCustomerDataChange} id="gst_tax_id" type="text" placeholder="e.g., US-123456789" />
          </div>
        </div>
        <div className="createNewCustomer-input-container">
          <div className="createNewCustomer-input-box">
            <label htmlFor="credit_limit">Credit Limit</label>
            <input
              className="increment-decrement-createNewCustomer"
              value={NewCustomer.credit_limit}
              onChange={handleCreditLimitChange}
              id="credit_limit"
              type="number"
              min="0"
              placeholder="50000"
            />
          </div>
          <div className="createNewCustomer-input-box">
            <label htmlFor="available_limit">Available Limit (Auto-calculated)</label>
            <input
              value={NewCustomer.available_limit}
              id="available_limit"
              type="number"
              placeholder="45000"
              disabled
              readOnly
            />
          </div>
        </div>

        {/* Addresses */}
        <nav className="createNewCustomer-subtit">Addresses</nav>
        <div className="createNewCustomer-input-container">
          <div className="createNewCustomer-input-box">
            <label htmlFor="billing_address">Billing Address</label>
            <input
              value={NewCustomer.billing_address}
              onChange={handleBillingAddressChange}
              id="billing_address"
              type="text"
              placeholder="123 Industrial Way, Chicago, IL, 60601, USA"
            />
          </div>
        </div>
        <div className="createNewCustomer-input-container">
          <div className="createNewCustomer-input-box">
            <label htmlFor="shipping_address">Shipping Address</label>
            <input value={NewCustomer.shipping_address} onChange={handleNewCustomerDataChange} id="shipping_address" type="text" placeholder="456 Warehouse Lane, Chicago, IL, 60602, USA" />
          </div>
        </div>

        <p className="createNewCustomer-editdate">
          Last edited: <span className="createNewCustomer-editdate-date">{lastEditDate}</span> | <span className="createNewCustomer-editdate-admin">By Admin</span>
        </p>
        <div className="createNewCustomer-submit-container">
          <nav onClick={handlecreateNewCustomerReset}>Discard</nav>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}
