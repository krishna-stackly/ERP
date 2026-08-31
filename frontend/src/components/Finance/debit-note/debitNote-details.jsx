import { useEffect, useState } from "react";
import "./createNewInvoice.css";
import InvoiceComment from "./invoiceComment";
import InvoiceHistory from "./invoiceHistory";
import InvoiceAttachment from "./invoiceAttachment";
import { toast } from "react-toastify";
import debitNoteApiProvider from "../../../network/debitNote-api-provider";

export default function DebitNoteDetails({
  setCurrentPage,
  editDebitNoteData = {},
  isEdit = false,
}) {
  const [debitNoteStatus, setdebitNoteStatus] = useState("");
  const [recordId, setRecordId] = useState(null);
  const [debitNoteListData, setdebitNoteListData] = useState([]);
  const [saving, setSaving] = useState(false);

  const [debitNoteInput, setdebitNoteInput] = useState({
    debitNote_id: "",
    invoiceReference_id: "",
    debitNote_date: "",
    created_by: "",
    branch: "",
    currency: "",
    supplier_id: "",
    custoner_name: "",
    PO_date: "",
    due_date: "",
    payment_terms: "",
    inco_terms: "",
    invoice_status: "",
    credit_limit: "",
    purchase_total: "",
    refund_mode: "",
    refund_received: "",
    refund_date: "",
    adjusted_invoice_ref: "",
  });

  const [detail, setDetail] = useState({
    comment: true,
    history: false,
    attachment: false,
  });

  const [InvoiceBtn, setInvoiceBtn] = useState({
    buttonAcs: true,
    cancel_invoice: true,
    save_draft: false,
    send_invoice: false,
    paid: true,
    pdf: true,
    mail: true,
  });

  // Pre-fill when editing an existing debit note
  useEffect(() => {
    if (isEdit && Object.keys(editDebitNoteData).length > 0) {
      const raw = editDebitNoteData._raw || editDebitNoteData;
      setRecordId(editDebitNoteData.id || raw.id || null);
      setdebitNoteInput((prev) => ({
        ...prev,
        debitNote_id:        editDebitNoteData.debitNote_id        || raw.DBN_ID           || "",
        invoiceReference_id: editDebitNoteData.purchase_order_ref  || raw.po_ref            || "",
        debitNote_date:      editDebitNoteData.debitNote_date      || raw.debit_note_date   || "",
        custoner_name:       editDebitNoteData.supplier_name       || raw.supplier_name     || "",
        supplier_id:         raw.supplier_id                                                || "",
        due_date:            editDebitNoteData.due_date            || raw.due_date          || "",
        currency:            raw.currency                                                   || "",
        branch:              raw.branch                                                     || "",
        created_by:          raw.created_by                                                 || "",
        PO_date:             raw.po_date                                                    || "",
        payment_terms:       raw.payment_terms                                              || "",
        inco_terms:          raw.inco_terms                                                 || "",
        invoice_status:      raw.payment_status                                             || "",
        credit_limit:        raw.credit_limit                                               || "",
        purchase_total:      raw.purchase_total || raw.grand_total                          || "",
      }));
      setdebitNoteStatus(editDebitNoteData.status || raw.status || "");

      if (Array.isArray(raw.items)) setdebitNoteListData(raw.items);
    }
  }, [isEdit]);

  // Button visibility based on status
  useEffect(() => {
    const statusMap = {
      "": {
        buttonAcs: false, cancel_invoice: true, save_draft: false,
        send_invoice: false, paid: true, pdf: true, mail: true,
      },
      Draft: {
        buttonAcs: false, cancel_invoice: true, save_draft: false,
        send_invoice: false, paid: true, pdf: true, mail: true,
      },
      Send: {
        buttonAcs: true, cancel_invoice: false, save_draft: true,
        send_invoice: true, paid: false, pdf: false, mail: false,
      },
      Paid: {
        buttonAcs: true, cancel_invoice: false, save_draft: true,
        send_invoice: true, paid: true, pdf: false, mail: false,
      },
      Cancelled: {
        buttonAcs: true, cancel_invoice: true, save_draft: true,
        send_invoice: true, paid: true, pdf: false, mail: false,
      },
    };
    setInvoiceBtn((prev) => statusMap[debitNoteStatus] || prev);
  }, [debitNoteStatus]);

  const handledebitNoteInputChanges = (e) => {
    const { id, value } = e.target;
    setdebitNoteInput((prev) => ({ ...prev, [id]: value }));
  };

  const buildPayload = () => ({
    debit_note_date:  debitNoteInput.debitNote_date,
    po_ref:           debitNoteInput.invoiceReference_id,
    created_by:       debitNoteInput.created_by,
    branch:           debitNoteInput.branch,
    currency:         debitNoteInput.currency,
    supplier_name:    debitNoteInput.custoner_name,
    supplier_id:      debitNoteInput.supplier_id,
    po_date:          debitNoteInput.PO_date,
    due_date:         debitNoteInput.due_date,
    payment_terms:    debitNoteInput.payment_terms,
    inco_terms:       debitNoteInput.inco_terms,
    payment_status:   debitNoteInput.invoice_status,
    credit_limit:     debitNoteInput.credit_limit,
    purchase_total:   debitNoteInput.purchase_total,
    refund_mode:      debitNoteInput.refund_mode,
    refund_received:  debitNoteInput.refund_received,
    refund_date:      debitNoteInput.refund_date,
    adjusted_invoice_ref: debitNoteInput.adjusted_invoice_ref,
  });

  // Save Draft — create or update
  const handleSaveDraftState = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let result;
      if (recordId) {
        result = await debitNoteApiProvider.updateDebitNote(recordId, buildPayload());
      } else {
        result = await debitNoteApiProvider.createDebitNote(buildPayload());
        if (result?.id) setRecordId(result.id);
      }
      if (result) setdebitNoteStatus("Draft");
    } finally {
      setSaving(false);
    }
  };

  // Mark as Settled
  const handlePaidState = async (e) => {
    e.preventDefault();
    if (!recordId) {
      toast.error("Save the debit note first before marking as settled.");
      return;
    }
    setSaving(true);
    try {
      const result = await debitNoteApiProvider.performAction(recordId, "mark_paid");
      if (result) setdebitNoteStatus("Paid");
    } finally {
      setSaving(false);
    }
  };

  // Cancel debit note
  const handleCancelledState = async (e) => {
    e.preventDefault();
    if (!recordId) {
      toast.error("Save the debit note first before cancelling.");
      return;
    }
    const confirmed = window.confirm("Are you sure you want to cancel this debit note? This action cannot be undone.");
    if (!confirmed) return;
    setSaving(true);
    try {
      const result = await debitNoteApiProvider.performAction(recordId, "cancel");
      if (result) setdebitNoteStatus("Cancelled");
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = async (e) => {
    e.preventDefault();
    if (!recordId) return;
    await debitNoteApiProvider.downloadPDF(recordId, debitNoteInput.debitNote_id);
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!recordId) return;
    await debitNoteApiProvider.sendEmail(recordId);
  };

  const handleGoBack = (e) => {
    e.preventDefault();
    setCurrentPage("debitNote");
  };

  return (
    <div className="createNewInvoice-container">
      <form onSubmit={(e) => e.preventDefault()}>
        {/* Header */}
        <div className="createNewInvoice-head">
          <nav>
            <p>Debit Note</p>
            {debitNoteStatus !== "" && (
              <h3 className={`createNewInvoice-Status-${debitNoteStatus}`}>
                Status: {debitNoteStatus}
              </h3>
            )}
          </nav>
          <div>
            <nav className="createNewInvoice-close" onClick={handleGoBack}>
              <svg
                className="createNewInvoice-circle-x-logo"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
              </svg>
              <p>Close</p>
            </nav>
          </div>
        </div>

        {/* Basic Info */}
        <div className="createNewInvoice-input-container">
          <div className="createNewInvoice-input-box">
            <label htmlFor="debitNote_id">Debit Note ID (Auto Generate)</label>
            <input
              id="debitNote_id"
              type="text"
              placeholder="Auto Generate"
              value={debitNoteInput.debitNote_id}
              disabled
            />
          </div>
          <div className="createNewInvoice-input-box">
            <label htmlFor="debitNote_date">
              Debit Note Date<sup>*</sup>
            </label>
            <input
              id="debitNote_date"
              type="date"
              value={debitNoteInput.debitNote_date}
              onChange={handledebitNoteInputChanges}
              required
              disabled={InvoiceBtn.buttonAcs}
            />
          </div>
        </div>

        <div className="createNewInvoice-input-container">
          <div className="createNewInvoice-input-box">
            <label htmlFor="invoiceReference_id">PO Reference ID (Auto Generate)</label>
            <input
              id="invoiceReference_id"
              type="text"
              placeholder="Auto Generate"
              value={debitNoteInput.invoiceReference_id}
              disabled
            />
          </div>
          <div className="createNewInvoice-input-box">
            <label htmlFor="created_by">
              Created By<sup>*</sup>
            </label>
            <input
              id="created_by"
              type="text"
              placeholder="Enter user"
              value={debitNoteInput.created_by}
              onChange={handledebitNoteInputChanges}
              required
              disabled={InvoiceBtn.buttonAcs}
            />
          </div>
        </div>

        <div className="createNewInvoice-input-container">
          <div className="createNewInvoice-input-box">
            <label htmlFor="branch">
              Branch/Location<sup>*</sup>
            </label>
            <select
              id="branch"
              value={debitNoteInput.branch}
              onChange={handledebitNoteInputChanges}
              required
              disabled={InvoiceBtn.buttonAcs}
            >
              <option value="" disabled hidden>Select Branch</option>
              <option value="Branch 1">Branch 1</option>
              <option value="Branch 2">Branch 2</option>
              <option value="Branch 3">Branch 3</option>
            </select>
          </div>
          <div className="createNewInvoice-input-box">
            <label htmlFor="currency">
              Currency<sup>*</sup>
            </label>
            <select
              id="currency"
              value={debitNoteInput.currency}
              onChange={handledebitNoteInputChanges}
              required
              disabled={InvoiceBtn.buttonAcs}
            >
              <option value="" disabled hidden>Select Currency</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="IND">IND</option>
              <option value="GBP">GBP</option>
              <option value="SGD">SGD</option>
            </select>
          </div>
        </div>

        {/* Supplier Information */}
        <nav className="createNewInvoice-subtit">Supplier Information</nav>

        <div className="createNewInvoice-input-container">
          <div className="createNewInvoice-input-box">
            <label htmlFor="supplier_id">Supplier ID (Auto Generate)</label>
            <input
              id="supplier_id"
              type="text"
              placeholder="Auto Generate"
              disabled
              value={debitNoteInput.supplier_id}
            />
          </div>
          <div className="createNewInvoice-input-box">
            <label htmlFor="custoner_name">
              Supplier Name<sup>*</sup>
            </label>
            <input
              id="custoner_name"
              type="text"
              placeholder="Enter supplier name"
              required
              value={debitNoteInput.custoner_name}
              onChange={handledebitNoteInputChanges}
              disabled={InvoiceBtn.buttonAcs}
            />
          </div>
        </div>

        <div className="createNewInvoice-input-container">
          <div className="createNewInvoice-input-box">
            <label htmlFor="PO_date">
              PO Date<sup>*</sup>
            </label>
            <input
              id="PO_date"
              type="date"
              value={debitNoteInput.PO_date}
              onChange={handledebitNoteInputChanges}
              required
              disabled={InvoiceBtn.buttonAcs}
            />
          </div>
          <div className="createNewInvoice-input-box">
            <label htmlFor="due_date">
              Due Date<sup>*</sup>
            </label>
            <input
              id="due_date"
              type="date"
              value={debitNoteInput.due_date}
              onChange={handledebitNoteInputChanges}
              required
              disabled={InvoiceBtn.buttonAcs}
            />
          </div>
        </div>

        <div className="createNewInvoice-input-container">
          <div className="createNewInvoice-input-box">
            <label htmlFor="payment_terms">
              Payment Terms<sup>*</sup>
            </label>
            <select
              id="payment_terms"
              value={debitNoteInput.payment_terms}
              onChange={handledebitNoteInputChanges}
              required
              disabled={InvoiceBtn.buttonAcs}
            >
              <option value="" disabled hidden>Select Payment Terms</option>
              <option value="Net 15">Net 15</option>
              <option value="Net 30">Net 30</option>
              <option value="Net 45">Net 45</option>
              <option value="Due on Receipt">Due on Receipt</option>
            </select>
          </div>
          <div className="createNewInvoice-input-box">
            <label htmlFor="inco_terms">
              Inco Terms<sup>*</sup>
            </label>
            <select
              id="inco_terms"
              value={debitNoteInput.inco_terms}
              onChange={handledebitNoteInputChanges}
              required
              disabled={InvoiceBtn.buttonAcs}
            >
              <option value="" disabled hidden>Select Inco Terms</option>
              <option value="EXW">EXW</option>
              <option value="FOB">FOB</option>
              <option value="CIF">CIF</option>
              <option value="DDP">DDP</option>
            </select>
          </div>
        </div>

        <div className="createNewInvoice-input-container">
          <div className="createNewInvoice-input-box">
            <label htmlFor="invoice_status">
              Payment Status<sup>*</sup>
            </label>
            <input
              id="invoice_status"
              type="text"
              placeholder="Enter payment status"
              value={debitNoteInput.invoice_status}
              onChange={handledebitNoteInputChanges}
              required
              disabled={InvoiceBtn.buttonAcs}
            />
          </div>
          <div className="createNewInvoice-input-box">
            <label htmlFor="credit_limit">
              Credit Limit<sup>*</sup>
            </label>
            <input
              id="credit_limit"
              type="text"
              placeholder="Eg: 50000"
              value={debitNoteInput.credit_limit}
              onChange={handledebitNoteInputChanges}
              required
              disabled={InvoiceBtn.buttonAcs}
            />
          </div>
        </div>

        <div className="createNewInvoice-input-container">
          <div className="createNewInvoice-input-box">
            <label htmlFor="purchase_total">
              Purchase Total<sup>*</sup>
            </label>
            <input
              id="purchase_total"
              type="text"
              placeholder="Eg: 50000"
              value={debitNoteInput.purchase_total}
              onChange={handledebitNoteInputChanges}
              required
              disabled={InvoiceBtn.buttonAcs}
            />
          </div>
        </div>

        {/* Returned Line Items */}
        <nav className="createNewInvoice-subtit">Returned Line Items</nav>
        <div className="createNewInvoice-table-container">
          <table>
            <thead className="createNewInvoice-table-head">
              <tr>
                <th>#</th>
                <th><pre>Product Name</pre></th>
                <th><pre>Product ID</pre></th>
                <th>Returned Quantity</th>
                <th>UOM</th>
                <th>Return Reason</th>
                <th><pre>Unit Price</pre></th>
                <th><pre>Tax (%)</pre></th>
                <th><pre>Discount (%)</pre></th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody className="createNewInvoice-table-body">
              {debitNoteListData.length > 0 ? (
                debitNoteListData.map((ele, ind) => (
                  <tr key={ind}>
                    <td>{ind + 1}</td>
                    <td>{ele.product_name}</td>
                    <td>{ele.product_id}</td>
                    <td>{ele.return_quantity ?? "-"}</td>
                    <td>{ele.umo}</td>
                    <td>{ele.return_reason ?? "-"}</td>
                    <td>{ele.unit_price}</td>
                    <td>{ele.tax}</td>
                    <td>{ele.discount}</td>
                    <td>{ele.total}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10}><pre>No Data Found</pre></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Payment & Refund Details */}
        <nav className="createNewInvoice-subtit">Payment & Refund Details</nav>
        <div className="credit-note-container">
          <div className="credit-note-box">
            <div className="credit-note-field">
              <label>Purchased Total:</label>
              <div className="readonly-value">{debitNoteInput.purchase_total || "—"}</div>
            </div>
            <div className="credit-note-field">
              <label>Amount Paid to Vendor:</label>
              <input
                id="refund_received"
                type="text"
                placeholder="Enter paid amount"
                value={debitNoteInput.refund_received}
                onChange={handledebitNoteInputChanges}
                disabled={InvoiceBtn.buttonAcs}
              />
            </div>
            <div className="credit-note-field">
              <label>Balance Due to Vendor:</label>
              <div className="readonly-value">—</div>
            </div>
            <div className="credit-note-field">
              <label>Purchase Return Amount:</label>
              <div className="readonly-value">—</div>
            </div>
            <div className="credit-note-field">
              <label>Balance to Recover:</label>
              <div className="readonly-value">—</div>
            </div>
          </div>
          <div className="credit-note-box">
            <div className="credit-note-field">
              <label>Refund Mode:</label>
              <select
                id="refund_mode"
                value={debitNoteInput.refund_mode}
                onChange={handledebitNoteInputChanges}
                disabled={InvoiceBtn.buttonAcs}
              >
                <option value="">None</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="UPI">UPI</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
            <div className="credit-note-field">
              <label>Refund Date:</label>
              <input
                id="refund_date"
                type="date"
                value={debitNoteInput.refund_date}
                onChange={handledebitNoteInputChanges}
                disabled={InvoiceBtn.buttonAcs}
              />
            </div>
            <div className="credit-note-field credit-note-adjusted-reference">
              <label>Adjusted Invoice Reference:</label>
              <textarea
                id="adjusted_invoice_ref"
                placeholder="Not yet adjusted"
                value={debitNoteInput.adjusted_invoice_ref}
                onChange={handledebitNoteInputChanges}
                disabled={InvoiceBtn.buttonAcs}
              />
            </div>
          </div>
        </div>

        {/* Comments / History / Attachments */}
        <div className="createNewInvoice-hub-container">
          <div className="createNewInvoice-hub-head">
            <p
              className={detail.comment ? "createNewInvoice-hub-head-bg-black" : "createNewInvoice-hub-head-tit"}
              onClick={() => setDetail({ history: false, attachment: false, comment: true })}
            >
              Comments
            </p>
            <p
              className={detail.history ? "createNewInvoice-hub-head-bg-black" : "createNewInvoice-hub-head-tit"}
              onClick={() => setDetail({ history: true, attachment: false, comment: false })}
            >
              History
            </p>
            <p
              className={detail.attachment ? "createNewInvoice-hub-head-bg-black" : "createNewInvoice-hub-head-tit"}
              onClick={() => setDetail({ history: false, attachment: true, comment: false })}
            >
              Attachments
            </p>
          </div>
          <div className="createNewInvoice-hub-body">
            {detail.comment && <InvoiceComment debitNoteId={recordId} apiProvider={debitNoteApiProvider} />}
            {detail.history && <InvoiceHistory debitNoteId={recordId} apiProvider={debitNoteApiProvider} />}
            {detail.attachment && <InvoiceAttachment debitNoteId={recordId} apiProvider={debitNoteApiProvider} />}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="createNewInvoice-btn-container">
          <button
            className={
              debitNoteStatus === "Send" || debitNoteStatus === "Paid"
                ? "createNewInvoice-order-active-btn"
                : "createNewInvoice-inactive-btn"
            }
            onClick={handleCancelledState}
            disabled={InvoiceBtn.cancel_invoice || saving}
          >
            {debitNoteStatus === "Cancelled" ? "Cancelled" : "Cancel Debit Note"}
          </button>
          <nav>
            <button
              className="createNewInvoice-cancel-btn"
              onClick={handleGoBack}
            >
              Cancel
            </button>
            <button
              className={
                debitNoteStatus === "" || debitNoteStatus === "Draft"
                  ? "createNewInvoice-active-btn"
                  : "createNewInvoice-completed-btn"
              }
              onClick={handleSaveDraftState}
              disabled={InvoiceBtn.save_draft || saving}
            >
              {saving ? "Saving..." : "Save Draft"}
            </button>
            <button
              className={
                debitNoteStatus === "Send"
                  ? "createNewInvoice-active-btn"
                  : debitNoteStatus === "" || debitNoteStatus === "Draft"
                  ? "createNewInvoice-inactive-btn"
                  : "createNewInvoice-completed-btn"
              }
              onClick={handlePaidState}
              disabled={InvoiceBtn.paid || saving}
            >
              Mark as Settled
            </button>
            <button
              className="createNewInvoice-icon-btn"
              onClick={handleDownloadPDF}
              disabled={InvoiceBtn.pdf || saving}
              title="Download PDF"
            >
              <svg
                className={
                  !InvoiceBtn.pdf
                    ? "createNewInvoice-pdf-mail-activelogo"
                    : "createNewInvoice-pdf-mail-futurelogo"
                }
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 22 24"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.600098 2.4C0.600098 1.76348 0.852954 1.15303 1.30304 0.702944C1.75313 0.252856 2.36358 0 3.0001 0L16.1313 0L21.4001 5.2688V21.6C21.4001 22.2365 21.1472 22.847 20.6972 23.2971C20.2471 23.7471 19.6366 24 19.0001 24H3.0001C2.36358 24 1.75313 23.7471 1.30304 23.2971C0.852954 22.847 0.600098 22.2365 0.600098 21.6V2.4ZM4.6001 9.6H2.2001V17.6H3.8001V14.4H4.6001C5.23662 14.4 5.84707 14.1471 6.29715 13.6971C6.74724 13.247 7.0001 12.6365 7.0001 12C7.0001 11.3635 6.74724 10.753 6.29715 10.3029C5.84707 9.85286 5.23662 9.6 4.6001 9.6ZM11.0001 9.6H8.6001V17.6H11.0001C11.6366 17.6 12.2471 17.3471 12.6972 16.8971C13.1472 16.447 13.4001 15.8365 13.4001 15.2V12C13.4001 11.3635 13.1472 10.753 12.6972 10.3029C12.2471 9.85286 11.6366 9.6 11.0001 9.6ZM15.0001 17.6V9.6H19.8001V11.2H16.6001V12.8H18.2001V14.4H16.6001V17.6H15.0001Z"
                />
              </svg>
            </button>
            <button
              className="createNewInvoice-icon-btn"
              onClick={handleSendEmail}
              disabled={InvoiceBtn.mail || saving}
              title="Send Email"
            >
              <svg
                className={
                  !InvoiceBtn.mail
                    ? "createNewInvoice-pdf-mail-activelogo"
                    : "createNewInvoice-pdf-mail-futurelogo"
                }
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 16"
                fill="none"
              >
                <path d="M2 16C1.45 16 0.979333 15.8043 0.588 15.413C0.196667 15.0217 0.000666667 14.5507 0 14V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196666 1.45067 0.000666667 2 0H18C18.55 0 19.021 0.196 19.413 0.588C19.805 0.98 20.0007 1.45067 20 2V14C20 14.55 19.8043 15.021 19.413 15.413C19.0217 15.805 18.5507 16.0007 18 16H2ZM10 8.825C10.0833 8.825 10.171 8.81233 10.263 8.787C10.355 8.76167 10.4423 8.72433 10.525 8.675L17.6 4.25C17.7333 4.16667 17.8333 4.06267 17.9 3.938C17.9667 3.81333 18 3.67567 18 3.525C18 3.19167 17.8583 2.94167 17.575 2.775C17.2917 2.60833 17 2.61667 16.7 2.8L10 7L3.3 2.8C3 2.61667 2.70833 2.61267 2.425 2.788C2.14167 2.96333 2 3.209 2 3.525C2 3.19167 2.03333 3.83767 2.1 3.963C2.16667 4.08833 2.26667 4.184 2.4 4.25L9.475 8.675C9.55833 8.725 9.646 8.76267 9.738 8.788C9.83 8.81333 9.91733 8.82567 10 8.825Z" />
              </svg>
            </button>
          </nav>
        </div>
      </form>
    </div>
  );
}
