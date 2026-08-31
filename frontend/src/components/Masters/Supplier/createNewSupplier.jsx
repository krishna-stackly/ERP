import React, { useState, useEffect } from "react";
import "./createNewSupplier.css";
import { toast } from "react-toastify";
import supplierApiProvider from "../../../network/supplier-api-provider";
import SupplierComment from "./supplierComment";
import SupplierHistory from "./supplierHistory";
import SupplierAttachment from "./supplierAttachment";

export default function CreateEditSupplier({
  setShowAddSupplier,
  editShowAddSupplier,
  editAddSupplierData,
  setEditAddSupplierData,
}) {
  const [purchasingRepList, setPurchasingRepList] = useState([]);
  const [lastEditDate, setLastEditDate] = useState("");

  const [detail, setDetail] = useState({
    comment: true,
    history: false,
    attachment: false,
  });

  const [NewSupplier, setNewSupplier] = useState({
    supplier_id: "",
    tax_id: "",
    supplier_name: "",
    company_registration_number: "",
    legal_entity_name: "",
    country_of_registration: "",
    supplier_type: "",
    status: "",
    supplier_tier: "",
    product_details: "",
    primary_contact_first_name: "",
    primary_contact_last_name: "",
    designation_role: "",
    alternate_contact_no: "",
    primary_contact_email: "",
    website: "",
    primary_contact_phone: "",
    relationship_manager: "",
    registered_address: "",
    mailing_address: "",
    warehouse_delivery_address: "",
    billing_address: "",
    bank_name: "",
    payment_method: "",
    bank_account_no: "",
    payment_terms: "",
    iban_swift_code: "",
    tax_withholding_setup: "",
    currency: "",
    categories_served: "",
    inco_terms: "",
    product_service_catalog: "",
    freight_terms: "",
    minimum_order_quantity: "",
    return_replacement_policy: "",
    average_delivery_time: "",
    contract_references: "",
    certifications: "",
    risk_notes: "",
    compliance_status: "",
    last_risk_assessment_date: "",
    insurance_documents: null,
    mitigation_plans: null,
    risk_ratings: "",
    on_time_delivery_rate: "",
    quality_ratings: "",
    defect_return_rate: "",
    last_evaluation_date: "",
    contract_breaches: "",
    improvement_plans: "",
    complaints_registered: "",
    external_key_contact: "",
    dispute_resolutions: null,
    interaction_logs: null,
    feedback_surveys: null,
    visit_history: "",
  });

  // File-only fields — must never be sent as strings or plain objects
  const FILE_FIELDS = [
    "insurance_documents",
    "mitigation_plans",
    "dispute_resolutions",
    "interaction_logs",
    "feedback_surveys",
  ];

  // Guard: true only for real browser File objects
  const isRealFile = (val) => typeof File !== "undefined" && val instanceof File;

  // Fetch Purchasing Representatives
  useEffect(() => {
    const loadPurchasingReps = async () => {
      const purchasingReps = await supplierApiProvider.fetchPurchasingReps();
      setPurchasingRepList(purchasingReps);
    };
    loadPurchasingReps();
  }, []);

  // Pre-fill form in edit mode
  useEffect(() => {
    if (
      editShowAddSupplier &&
      editAddSupplierData &&
      Object.keys(editAddSupplierData).length > 0
    ) {
      setNewSupplier({
        supplier_id: editAddSupplierData.supplier_id || "",
        tax_id: editAddSupplierData.tax_id || editAddSupplierData.tin_id || "",
        supplier_name: editAddSupplierData.supplier_name || "",
        company_registration_number: editAddSupplierData.company_registration_number || "",
        legal_entity_name: editAddSupplierData.legal_entity_name || "",
        country_of_registration: editAddSupplierData.country_of_registration || "",
        supplier_type: editAddSupplierData.supplier_type || "",
        status: editAddSupplierData.status || "",
        supplier_tier: editAddSupplierData.supplier_tier || "",
        product_details: editAddSupplierData.product_details || "",
        primary_contact_first_name: editAddSupplierData.primary_contact_first_name || "",
        primary_contact_last_name: editAddSupplierData.primary_contact_last_name || "",
        designation_role: editAddSupplierData.designation_role || "",
        alternate_contact_no: editAddSupplierData.alternate_contact_no || "",
        primary_contact_email: editAddSupplierData.primary_contact_email || editAddSupplierData.email || "",
        website: editAddSupplierData.website || "",
        primary_contact_phone: editAddSupplierData.primary_contact_phone || editAddSupplierData.phone_number || "",
        relationship_manager: editAddSupplierData.relationship_manager || "",
        registered_address: editAddSupplierData.registered_address || editAddSupplierData.registered_office_address || "",
        mailing_address: editAddSupplierData.mailing_address || "",
        warehouse_delivery_address: editAddSupplierData.warehouse_delivery_address || "",
        billing_address: editAddSupplierData.billing_address || "",
        bank_name: editAddSupplierData.bank_name || "",
        payment_method: editAddSupplierData.payment_method || "",
        bank_account_no: editAddSupplierData.bank_account_no || "",
        payment_terms: editAddSupplierData.payment_terms || "",
        iban_swift_code: editAddSupplierData.iban_swift_code || "",
        tax_withholding_setup: editAddSupplierData.tax_withholding_setup || "",
        currency: editAddSupplierData.currency || "",
        categories_served: editAddSupplierData.categories_served || "",
        inco_terms: editAddSupplierData.inco_terms || "",
        product_service_catalog: editAddSupplierData.product_service_catalog || "",
        freight_terms: editAddSupplierData.freight_terms || "",
        minimum_order_quantity: editAddSupplierData.minimum_order_quantity || "",
        return_replacement_policy: editAddSupplierData.return_replacement_policy || "",
        average_delivery_time: editAddSupplierData.average_delivery_time || "",
        contract_references: editAddSupplierData.contract_references || "",
        certifications: editAddSupplierData.certifications || "",
        risk_notes: editAddSupplierData.risk_notes || "",
        compliance_status: editAddSupplierData.compliance_status || "",
        last_risk_assessment_date: editAddSupplierData.last_risk_assessment_date || "",
        // File fields are ALWAYS null in state regardless of server value.
        // Browser security prevents pre-filling file inputs.
        // Existing server files are preserved because we skip these unless
        // the user picks a new file.
        insurance_documents: null,
        mitigation_plans: null,
        risk_ratings: editAddSupplierData.risk_ratings || "",
        on_time_delivery_rate: editAddSupplierData.on_time_delivery_rate || "",
        quality_ratings: editAddSupplierData.quality_ratings || "",
        defect_return_rate: editAddSupplierData.defect_return_rate || "",
        last_evaluation_date: editAddSupplierData.last_evaluation_date || "",
        contract_breaches: editAddSupplierData.contract_breaches || "",
        improvement_plans: editAddSupplierData.improvement_plans || "",
        complaints_registered: editAddSupplierData.complaints_registered || "",
        external_key_contact: editAddSupplierData.external_key_contact || "",
        dispute_resolutions: null,
        interaction_logs: null,
        feedback_surveys: null,
        visit_history: editAddSupplierData.visit_history || "",
      });
      setLastEditDate(editAddSupplierData.last_edit_date || "");
    } else {
      const today = new Date();
      const options = { month: "long", day: "numeric", year: "numeric" };
      setLastEditDate(today.toLocaleDateString("en-US", options));
    }
  }, [editAddSupplierData, editShowAddSupplier]);

  const handleNewSupplierDataChange = (e) => {
    const { id, value, type, files } = e.target;
    if (type === "file") {
      setNewSupplier((prev) => ({ ...prev, [id]: files[0] || null }));
    } else {
      setNewSupplier((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleCreateEditSupplierReset = (e) => {
    e.preventDefault();
    setShowAddSupplier(false);
    if (setEditAddSupplierData) setEditAddSupplierData({});
  };

  const handleCreateEditSupplierSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      Object.keys(NewSupplier).forEach((key) => {
        const value = NewSupplier[key];

        // --- File fields: only append real File objects ---
        if (FILE_FIELDS.includes(key)) {
          if (isRealFile(value)) {
            formData.append(key, value);
          }
          // null / {} / string → silently skipped; backend keeps existing file
          return;
        }

        // --- Phone: strip country code, send only 10 digits ---
        if (key === "primary_contact_phone" && value) {
          const digitsOnly = String(value).replace(/\D/g, "");
          const tenDigit = digitsOnly.slice(-10);
          if (tenDigit) formData.append(key, tenDigit);
          return;
        }

        // --- Website: ensure https:// prefix ---
        if (key === "website" && value) {
          formData.append(
            key,
            value.startsWith("http") ? value : `https://${value}`
          );
          return;
        }

        // --- All other fields: skip null / undefined / "" / plain objects ---
        if (
          value === null ||
          value === undefined ||
          value === "" ||
          (typeof value === "object" && !isRealFile(value))
        ) {
          return;
        }

        formData.append(key, value);
      });

      formData.append("last_edit_date", lastEditDate);

      // Uncomment to verify exactly what is sent (no {} or strings for file fields):
      // for (let [k, v] of formData.entries()) console.log(k, v);

      let response;
      if (editShowAddSupplier && editAddSupplierData.id) {
        response = await supplierApiProvider.updateSupplier(editAddSupplierData.id, formData);
        toast.success("Supplier updated successfully!");
      } else {
        response = await supplierApiProvider.createSupplier(formData);
        toast.success("Supplier created successfully!");
      }

      if (response) {
        setShowAddSupplier(false);
        if (setEditAddSupplierData) setEditAddSupplierData({});
      }
    } catch (error) {
      console.error("Error submitting supplier:", error);
      if (error.response?.data) {
        const errors = error.response.data;
        Object.keys(errors).forEach((field) => {
          const messages = Array.isArray(errors[field]) ? errors[field] : [errors[field]];
          messages.forEach((msg) => toast.error(`${field}: ${msg}`));
        });
      } else {
        toast.error("Failed to submit supplier. Please try again.");
      }
    }
  };

  return (
    <div className="createNewSupplier-container">
      <form onSubmit={handleCreateEditSupplierSubmit}>
        <div className="createNewSupplier-tit">
          <p>{editShowAddSupplier ? "Edit" : "Create New"} Supplier</p>
          <div onClick={handleCreateEditSupplierReset} className="close-createNewSupplier-container">
            <nav>Close</nav>
          </div>
        </div>

        <nav className="createNewSupplier-subtit">Basic Info</nav>
        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="supplier_id">Supplier ID (Auto Generate)<sup>*</sup></label>
            <input id="supplier_id" type="text" value={NewSupplier.supplier_id} onChange={handleNewSupplierDataChange} placeholder="Auto Generate" disabled />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="tax_id">Tax Identification Number (Tax ID/GST IN/VAT ID)<sup>*</sup></label>
            <input id="tax_id" type="text" value={NewSupplier.tax_id} onChange={handleNewSupplierDataChange} placeholder="Eg: ABCD17CD98D5678E" required />
          </div>
        </div>

        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="supplier_name">Supplier Name<sup>*</sup></label>
            <input id="supplier_name" type="text" value={NewSupplier.supplier_name} onChange={handleNewSupplierDataChange} placeholder="Eg: ABC Industrial Supplies Private Limited" required />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="company_registration_number">Company Registration Number<sup>*</sup></label>
            <input id="company_registration_number" type="text" value={NewSupplier.company_registration_number} onChange={handleNewSupplierDataChange} placeholder="Eg: CIN:U23DRE456YUOU98" required />
          </div>
        </div>

        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="legal_entity_name">Legal Entity Name<sup>*</sup></label>
            <input id="legal_entity_name" value={NewSupplier.legal_entity_name} onChange={handleNewSupplierDataChange} type="text" placeholder="Eg: ABC Industrial Supplies Private Limited" required />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="country_of_registration">Country of Registration<sup>*</sup></label>
            <select id="country_of_registration" value={NewSupplier.country_of_registration} onChange={handleNewSupplierDataChange} required>
              <option value="">Select Country</option>
              <option value="US">USA</option>
              <option value="IN">India</option>
              <option value="GB">UK</option>
              <option value="CN">China</option>
              <option value="DE">Germany</option>
            </select>
          </div>
        </div>

        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="supplier_type">Supplier Type<sup>*</sup></label>
            <select id="supplier_type" value={NewSupplier.supplier_type} onChange={handleNewSupplierDataChange} required>
              <option value="">Select Supplier Type</option>
              <option value="Manufacturer">Manufacturer</option>
              <option value="Distributor">Distributor</option>
              <option value="Service Provider">Service Provider</option>
              <option value="Wholesaler">Wholesaler</option>
            </select>
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="status">Status<sup>*</sup></label>
            <select id="status" value={NewSupplier.status} onChange={handleNewSupplierDataChange} required>
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="supplier_tier">Supplier Tier<sup>*</sup></label>
            <select id="supplier_tier" value={NewSupplier.supplier_tier} onChange={handleNewSupplierDataChange} required>
              <option value="">Select Tier</option>
              <option value="Strategic">Strategic</option>
              <option value="Preferred">Preferred</option>
              <option value="Backup">Backup</option>
            </select>
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="product_details">Product Details</label>
            <input id="product_details" value={NewSupplier.product_details} onChange={handleNewSupplierDataChange} type="text" placeholder="Enter Product Details" />
          </div>
        </div>

        <nav className="createNewSupplier-subtit">Contact Information</nav>
        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="primary_contact_first_name">Primary Contact First Name<sup>*</sup></label>
            <input id="primary_contact_first_name" value={NewSupplier.primary_contact_first_name} onChange={handleNewSupplierDataChange} type="text" placeholder="Enter First Name" required />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="primary_contact_last_name">Last Name<sup>*</sup></label>
            <input id="primary_contact_last_name" value={NewSupplier.primary_contact_last_name} onChange={handleNewSupplierDataChange} type="text" placeholder="Enter Last Name" required />
          </div>
        </div>

        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="designation_role">Designation / Role</label>
            <input id="designation_role" value={NewSupplier.designation_role} onChange={handleNewSupplierDataChange} type="text" placeholder="Enter Designation/Role" />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="alternate_contact_no">Alternate Contact No</label>
            <input id="alternate_contact_no" value={NewSupplier.alternate_contact_no} onChange={handleNewSupplierDataChange} type="text" placeholder="+91 9988998823" />
          </div>
        </div>

        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="primary_contact_email">Email<sup>*</sup></label>
            <input id="primary_contact_email" value={NewSupplier.primary_contact_email} onChange={handleNewSupplierDataChange} type="email" placeholder="Eg: supplier@example.com" required />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="website">Website</label>
            <input id="website" value={NewSupplier.website} onChange={handleNewSupplierDataChange} type="text" placeholder="Enter Website URL (e.g., www.example.com)" />
          </div>
        </div>

        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="primary_contact_phone">Phone Number<sup>*</sup></label>
            <input id="primary_contact_phone" value={NewSupplier.primary_contact_phone} onChange={handleNewSupplierDataChange} type="text" placeholder="+91 9876545789" required />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="relationship_manager">Relationship Manager (Internal)</label>
            <select id="relationship_manager" value={NewSupplier.relationship_manager} onChange={handleNewSupplierDataChange}>
              <option value="">Select Manager</option>
              {purchasingRepList.length > 0 ? (
                purchasingRepList.map((rep) => (
                  <option key={rep.id} value={rep.id}>{rep.first_name} {rep.last_name || ""}</option>
                ))
              ) : (
                <option value="" disabled>No managers available</option>
              )}
            </select>
          </div>
        </div>

        <nav className="createNewSupplier-subtit">Addresses</nav>
        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="registered_address">Registered Office Address<sup>*</sup></label>
            <input id="registered_address" value={NewSupplier.registered_address} onChange={handleNewSupplierDataChange} type="text" placeholder="Enter Office Address" required />
          </div>
        </div>
        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="mailing_address">Mailing Address</label>
            <input id="mailing_address" value={NewSupplier.mailing_address} onChange={handleNewSupplierDataChange} type="text" placeholder="Enter Mailing Address" />
          </div>
        </div>
        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="warehouse_delivery_address">Warehouse/Delivery Address</label>
            <input id="warehouse_delivery_address" value={NewSupplier.warehouse_delivery_address} onChange={handleNewSupplierDataChange} type="text" placeholder="Enter Delivery Address" />
          </div>
        </div>
        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="billing_address">Billing Address</label>
            <input id="billing_address" value={NewSupplier.billing_address} onChange={handleNewSupplierDataChange} type="text" placeholder="Enter Billing Address" />
          </div>
        </div>

        <nav className="createNewSupplier-subtit">Banking & Payment Information</nav>
        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="bank_name">Bank Name</label>
            <input id="bank_name" value={NewSupplier.bank_name} onChange={handleNewSupplierDataChange} type="text" placeholder="Enter Bank Name" />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="payment_method">Payment Method</label>
            <select id="payment_method" value={NewSupplier.payment_method} onChange={handleNewSupplierDataChange}>
              <option value="">Select Payment Method</option>
              <option value="ACH">ACH</option>
              <option value="Wire">Wire Transfer</option>
              <option value="Check">Check</option>
              <option value="Card">Credit/Debit Card</option>
              <option value="Cash">Cash</option>
            </select>
          </div>
        </div>
        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="bank_account_no">Bank Account No</label>
            <input id="bank_account_no" value={NewSupplier.bank_account_no} onChange={handleNewSupplierDataChange} type="text" placeholder="Enter Bank Account Number" />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="payment_terms">Payment Terms</label>
            <select id="payment_terms" value={NewSupplier.payment_terms} onChange={handleNewSupplierDataChange}>
              <option value="">Select Payment Terms</option>
              <option value="Net 15">Net 15</option>
              <option value="Net 30">Net 30</option>
              <option value="Net 45">Net 45</option>
              <option value="Net 60">Net 60</option>
              <option value="Due on Receipt">Due on Receipt</option>
            </select>
          </div>
        </div>
        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="iban_swift_code">IBAN/SWIFT Code</label>
            <input id="iban_swift_code" value={NewSupplier.iban_swift_code} onChange={handleNewSupplierDataChange} type="text" placeholder="Enter IBAN/SWIFT Code" />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="tax_withholding_setup">Tax Withholding Setup</label>
            <input id="tax_withholding_setup" value={NewSupplier.tax_withholding_setup} onChange={handleNewSupplierDataChange} type="text" placeholder="Tax Withholding Setup" />
          </div>
        </div>
        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="currency">Currency</label>
            <select id="currency" value={NewSupplier.currency} onChange={handleNewSupplierDataChange}>
              <option value="">Select Currency</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="INR">INR</option>
              <option value="GBP">GBP</option>
              <option value="SGD">SGD</option>
            </select>
          </div>
        </div>

        <nav className="createNewSupplier-subtit">Procurement & Operational Data</nav>
        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="categories_served">Categories Served</label>
            <input id="categories_served" value={NewSupplier.categories_served} onChange={handleNewSupplierDataChange} type="text" placeholder="Eg: Goods/Services" />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="inco_terms">Inco Terms</label>
            <input id="inco_terms" value={NewSupplier.inco_terms} onChange={handleNewSupplierDataChange} type="text" placeholder="Eg: FOB, CIF, CIP" />
          </div>
        </div>
        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="product_service_catalog">Product/Service Catalog</label>
            <input id="product_service_catalog" value={NewSupplier.product_service_catalog} onChange={handleNewSupplierDataChange} type="text" placeholder="Product/Service Catalog" />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="freight_terms">Freight Terms</label>
            <input id="freight_terms" value={NewSupplier.freight_terms} onChange={handleNewSupplierDataChange} type="text" placeholder="FOB origin / DDP" />
          </div>
        </div>
        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="minimum_order_quantity">Minimum Order Quantity</label>
            <input id="minimum_order_quantity" value={NewSupplier.minimum_order_quantity} onChange={handleNewSupplierDataChange} type="text" placeholder="Eg: 1/5/10 units" />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="return_replacement_policy">Return & Replacement Policy</label>
            <input id="return_replacement_policy" value={NewSupplier.return_replacement_policy} onChange={handleNewSupplierDataChange} type="text" placeholder="Return accepted within 10 days of delivery" />
          </div>
        </div>
        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="average_delivery_time">Average Delivery Time (Days)</label>
            <input id="average_delivery_time" value={NewSupplier.average_delivery_time} onChange={handleNewSupplierDataChange} type="text" placeholder="Eg: 1-3 days or 4-7 days" />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="contract_references">Contract References</label>
            <input id="contract_references" value={NewSupplier.contract_references} onChange={handleNewSupplierDataChange} type="text" placeholder="Contract References" />
          </div>
        </div>

        <nav className="createNewSupplier-subtit">Compliance & Risk Management</nav>
        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="certifications">Certifications</label>
            <input id="certifications" value={NewSupplier.certifications} onChange={handleNewSupplierDataChange} type="text" placeholder="Certifications (ISO 9001)" />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="risk_notes">Risk Notes/Flags</label>
            <input id="risk_notes" value={NewSupplier.risk_notes} onChange={handleNewSupplierDataChange} type="text" placeholder="Enter risk details or observations" />
          </div>
        </div>
        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="compliance_status">Compliance Status</label>
            <input id="compliance_status" value={NewSupplier.compliance_status} onChange={handleNewSupplierDataChange} type="text" placeholder="Compliance Status" />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="last_risk_assessment_date">Last Risk Assessment Date</label>
            <input id="last_risk_assessment_date" value={NewSupplier.last_risk_assessment_date} onChange={handleNewSupplierDataChange} type="date" />
          </div>
        </div>
        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="insurance_documents">Insurance Documents/Info</label>
            <input id="insurance_documents" onChange={handleNewSupplierDataChange} type="file" accept=".pdf,.doc,.docx" />
            {NewSupplier.insurance_documents && (
              <small>Selected: {NewSupplier.insurance_documents.name || "File uploaded"}</small>
            )}
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="mitigation_plans">Mitigation Plans</label>
            <input id="mitigation_plans" onChange={handleNewSupplierDataChange} type="file" accept=".pdf,.doc,.docx" />
            {NewSupplier.mitigation_plans && (
              <small>Selected: {NewSupplier.mitigation_plans.name || "File uploaded"}</small>
            )}
          </div>
        </div>
        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="risk_ratings">Risk Ratings</label>
            <input id="risk_ratings" value={NewSupplier.risk_ratings} onChange={handleNewSupplierDataChange} type="text" placeholder="Enter risk ratings" />
          </div>
        </div>

        <nav className="createNewSupplier-subtit">Performance & Evaluation</nav>
        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="on_time_delivery_rate">On-Time Delivery Rate (%)</label>
            <input id="on_time_delivery_rate" value={NewSupplier.on_time_delivery_rate} onChange={handleNewSupplierDataChange} type="text" placeholder="Eg: 98.5%" />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="quality_ratings">Quality Ratings (1-5 stars / % Score)</label>
            <input id="quality_ratings" value={NewSupplier.quality_ratings} onChange={handleNewSupplierDataChange} type="text" placeholder="Eg: 4.2/5 stars / 92%" />
          </div>
        </div>
        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="defect_return_rate">Defect/Return Rate (%)</label>
            <input id="defect_return_rate" value={NewSupplier.defect_return_rate} onChange={handleNewSupplierDataChange} type="text" placeholder="Eg: 1.2%" />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="last_evaluation_date">Last Evaluation Date</label>
            <input id="last_evaluation_date" value={NewSupplier.last_evaluation_date} onChange={handleNewSupplierDataChange} type="date" />
          </div>
        </div>
        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="contract_breaches">Contract Breaches (Y/N)</label>
            <input id="contract_breaches" value={NewSupplier.contract_breaches} onChange={handleNewSupplierDataChange} type="text" placeholder="Eg: N (No breaches) or Y (2025-09-28)" />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="improvement_plans">Improvement Plans</label>
            <input id="improvement_plans" value={NewSupplier.improvement_plans} onChange={handleNewSupplierDataChange} type="text" placeholder="Eg: Action: review packaging to reduce damage" />
          </div>
        </div>
        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="complaints_registered">Complaints Registered</label>
            <input id="complaints_registered" value={NewSupplier.complaints_registered} onChange={handleNewSupplierDataChange} type="text" placeholder="Enter Total Complaints" />
          </div>
        </div>

        <nav className="createNewSupplier-subtit">Relationship & Communication History</nav>
        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="external_key_contact">External Key Contact</label>
            <input id="external_key_contact" value={NewSupplier.external_key_contact} onChange={handleNewSupplierDataChange} type="text" placeholder="Primary contact name/Title" />
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="dispute_resolutions">Dispute Resolutions</label>
            <input id="dispute_resolutions" onChange={handleNewSupplierDataChange} type="file" accept=".pdf,.doc,.docx" />
            {NewSupplier.dispute_resolutions && (
              <small>Selected: {NewSupplier.dispute_resolutions.name || "File uploaded"}</small>
            )}
          </div>
        </div>
        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="interaction_logs">Interaction Logs (Link to CRM logs)</label>
            <input id="interaction_logs" onChange={handleNewSupplierDataChange} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" />
            {NewSupplier.interaction_logs && (
              <small>Selected: {NewSupplier.interaction_logs.name || "File uploaded"}</small>
            )}
          </div>
          <div className="createNewSupplier-input-box">
            <label htmlFor="feedback_surveys">Feedback/Surveys</label>
            <input id="feedback_surveys" onChange={handleNewSupplierDataChange} type="file" accept=".pdf,.doc,.docx" />
            {NewSupplier.feedback_surveys && (
              <small>Selected: {NewSupplier.feedback_surveys.name || "File uploaded"}</small>
            )}
          </div>
        </div>
        <div className="createNewSupplier-input-container">
          <div className="createNewSupplier-input-box">
            <label htmlFor="visit_history">Visit History/Meeting Notes</label>
            <input id="visit_history" value={NewSupplier.visit_history} onChange={handleNewSupplierDataChange} type="text" placeholder="Discuss last meeting date, discussion summary" />
          </div>
        </div>

        <div className="createNewSupplier-hub-container">
          <div className="createNewSupplier-hub-head">
            <p
              className={detail.comment ? "createNewSupplier-hub-head-bg-black" : "createNewSupplier-hub-head-tit"}
              onClick={() => setDetail({ history: false, attachment: false, comment: true })}
            >Comments</p>
            <p
              className={detail.history ? "createNewSupplier-hub-head-bg-black" : "createNewSupplier-hub-head-tit"}
              onClick={() => setDetail({ history: true, attachment: false, comment: false })}
            >History</p>
            <p
              className={detail.attachment ? "createNewSupplier-hub-head-bg-black" : "createNewSupplier-hub-head-tit"}
              onClick={() => setDetail({ history: false, attachment: true, comment: false })}
            >Attachments</p>
          </div>
          <div className="createNewSupplier-hub-body">
            {detail.comment && <SupplierComment />}
            {detail.history && <SupplierHistory />}
            {detail.attachment && <SupplierAttachment inputDisable={false} />}
          </div>
        </div>

        <p className="createNewSupplier-editdate">
          Last edited: <span>{lastEditDate}</span> | By Admin
        </p>

        <div className="createNewSupplier-submit-container">
          <nav onClick={handleCreateEditSupplierReset}>Discard</nav>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}