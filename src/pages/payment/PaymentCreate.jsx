import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import axios from "axios";

const PaymentCreate = () => {
  const navigate = useNavigate();
  const AVAILABLE_INVOICES_API = "http://localhost:8080/admin/payments/available-invoices";
  
  // 🚀 FIXED: Endpoint updated from /admin/payments/add to matching pure @PostMapping base path /admin/payments
  const SAVE_PAYMENT_API = "http://localhost:8080/admin/payments";

  // System States
  const [availableInvoices, setAvailableInvoices] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  // Controlled input form state bucket
  const [formData, setFormData] = useState({
    invoiceId: "",
    invoiceNumber: "",
    poNumber: "",
    vendorId: "",
    vendorName: "",
    amount: "",
    invoiceDate: "",
    paymentDate: "2026-06-25", // Synced with June 2026 corporate calendar timeline
    paymentMethod: "BANK_TRANSFER",
    referenceNumber: "",
    remarks: ""
  });

  // Bearer Authentication helper
  const getRequestConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        ...(token && token !== "null" ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
      }
    };
  };

  // Standardized fetch logic pointing correctly to AVAILABLE_INVOICES_API
  useEffect(() => {
    const fetchAvailableInvoices = async () => {
      try {
        setLoadingInvoices(true);
        setApiError("");
        const response = await axios.get(AVAILABLE_INVOICES_API, getRequestConfig());
        
        console.log("🚀 Available Invoices API Data Payload Stack:", response.data);
        
        // Dynamic handling for flat array responses or page wrapped contents
        const data = response.data?.content || response.data || [];
        setAvailableInvoices(Array.isArray(data) ? data : []);
        
      } catch (err) {
        console.error("Pipeline failure requesting clear approved invoices stack:", err);
        setApiError("Unable to load approved invoices. Please try again.");
      } finally {
        setLoadingInvoices(false);
      }
    };
    fetchAvailableInvoices();
  }, []);

  // Auto-populate mappings from the correct availableInvoices array state node using invoiceId
  const handleInvoiceChange = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) {
      setFormData(prev => ({
        ...prev,
        invoiceId: "",
        invoiceNumber: "",
        poNumber: "",
        vendorId: "",
        vendorName: "",
        amount: "",
        invoiceDate: "",
        remarks: ""
      }));
      return;
    }

    const matchedInvoice = availableInvoices.find(inv => inv.id.toString() === selectedId.toString());
    if (matchedInvoice) {
      setFormData(prev => ({
        ...prev,
        invoiceId: matchedInvoice.id,
        invoiceNumber: matchedInvoice.invoiceNumber || "",
        poNumber: matchedInvoice.poNumber || "—",
        vendorId: matchedInvoice.vendorId || "",
        vendorName: matchedInvoice.vendorName || "—",
        amount: matchedInvoice.amount ?? 0,
        invoiceDate: matchedInvoice.invoiceDate || "",
        remarks: `Payment for Invoice ${matchedInvoice.invoiceNumber || ""}`
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.invoiceId || !formData.paymentMethod || !formData.referenceNumber) {
      alert("Please fill up all fields with explicit red asterisks annotations.");
      return;
    }

    try {
      setSubmitting(true);
      setApiError("");

      const sanitizedPayload = {
        invoiceId: Number(formData.invoiceId), // 🚀 VERIFIED: Validation and assignment mapping strictly via raw invoiceId
        vendorId: Number(formData.vendorId),
        paymentDate: formData.paymentDate,
        paymentMethod: formData.paymentMethod,
        referenceNumber: formData.referenceNumber,
        remarks: formData.remarks
      };

      await axios.post(SAVE_PAYMENT_API, sanitizedPayload, getRequestConfig());
      alert("Payment Created Successfully.");
      navigate("/admin/payment/list");
    } catch (err) {
  console.error("Voucher submission failure block:", err);

  console.log("Status:", err.response?.status);
  console.log("Response:", err.response?.data);

  setApiError(
    typeof err.response?.data === "string"
      ? err.response.data
      : err.response?.data?.message ||
        `Request Failed (${err.response?.status})`
  );
} finally {
      setSubmitting(false); 
    }
  };

  const formattedAmount = formData.amount 
    ? parseFloat(formData.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })
    : "";

  return (
    <AdminLayout pageTitle="Add Payment" pageSubtitle="Home / Payments / Add Payment">
      <form onSubmit={handleFormSubmit} className="text-start mx-auto w-100" style={{ fontSize: "13px" }}>
        
        {apiError && (
          <div className="alert alert-danger py-2 px-3 fw-semibold mb-3 rounded-3" role="alert">
            {apiError}
          </div>
        )}

        {/* Two-Column Horizontal Master Grid Panel */}
        <div className="row g-4 mb-4">
          
          {/* LEFT BLOCK: Invoice & Vendor Details */}
          <div className="col-md-6">
            <div className="p-2 mb-2"><strong style={{ color: "#2563eb", fontSize: "14px" }}>Invoice & Vendor Details</strong></div>
            
            <div className="mb-3">
              <label className="form-label text-secondary small fw-medium mb-1">Invoice Number *</label>
              <select 
                className="form-select py-2 bg-white" 
                name="invoiceId" 
                value={formData.invoiceId} 
                onChange={handleInvoiceChange} 
                disabled={loadingInvoices}
                required 
                style={{ fontSize: "13px" }}
              >
                <option value="">{loadingInvoices ? "Loading invoices..." : "-- Select Approved Invoice --"}</option>
                {availableInvoices.map(inv => (
                  <option key={inv.id} value={inv.id}>{inv.invoiceNumber}</option>
                ))}
              </select>
              {!loadingInvoices && availableInvoices.length === 0 && (
                <div className="text-danger small mt-1">No approved invoices available for payment.</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label text-secondary small fw-medium mb-1">Payment Number</label>
              <input type="text" className="form-control py-2 bg-light text-muted font-monospace" value="Will be generated automatically" readOnly style={{ fontSize: "13px", cursor: "not-allowed" }} />
            </div>

            <div className="mb-3">
              <label className="form-label text-secondary small fw-medium mb-1">PO Number</label>
              <input type="text" className="form-control py-2 bg-light text-secondary font-monospace" value={formData.poNumber} readOnly style={{ fontSize: "13px", cursor: "not-allowed" }} />
            </div>

            <div className="mb-3">
              <label className="form-label text-secondary small fw-medium mb-1">Vendor Name</label>
              <input type="text" className="form-control py-2 bg-light text-secondary" value={formData.vendorName} readOnly style={{ fontSize: "13px", cursor: "not-allowed" }} />
            </div>

            <div className="row g-3">
              <div className="col-6">
                <label className="form-label text-secondary small fw-medium mb-1">Invoice Amount (₹)</label>
                <input type="text" className="form-control py-2 bg-light text-dark font-monospace fw-bold" value={formattedAmount} readOnly style={{ fontSize: "13px", cursor: "not-allowed" }} />
              </div>
              <div className="col-6">
                <label className="form-label text-secondary small fw-medium mb-1">Balance Amount (₹)</label>
                <input type="text" className="form-control py-2 bg-light text-dark font-monospace fw-bold" value={formattedAmount} readOnly style={{ fontSize: "13px", cursor: "not-allowed" }} />
              </div>
            </div>
          </div>

          {/* RIGHT BLOCK: Payment Details Parameters */}
          <div className="col-md-6">
            <div className="p-2 mb-2"><strong style={{ color: "#2563eb", fontSize: "14px" }}>Payment Details</strong></div>
            
            <div className="row g-3 mb-3">
              <div className="col-6">
                <label className="form-label text-secondary small fw-medium mb-1">Payment Date *</label>
                <input type="date" className="form-control py-2 bg-white text-dark" name="paymentDate" value={formData.paymentDate} onChange={handleInputChange} required style={{ fontSize: "13px" }} />
              </div>
              <div className="col-6">
                <label className="form-label text-secondary small fw-medium mb-1">Payment Method *</label>
                <select className="form-select py-2 bg-white" name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} required style={{ fontSize: "13px" }}>
                  <option value="BANK_TRANSFER">BANK_TRANSFER</option>
                  <option value="NEFT">NEFT</option>
                  <option value="RTGS">RTGS</option>
                  <option value="IMPS">IMPS</option>
                  <option value="UPI">UPI</option>
                  <option value="CHEQUE">CHEQUE</option>
                  <option value="CASH">CASH</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-secondary small fw-medium mb-1">Reference Number / UTR *</label>
              <input type="text" className="form-control py-2 bg-white font-monospace text-dark" name="referenceNumber" value={formData.referenceNumber} onChange={handleInputChange} required placeholder="REF1234444" style={{ fontSize: "13px" }} />
            </div>

            <div className="mb-3">
              <label className="form-label text-secondary small fw-medium mb-1">Amount (₹) *</label>
              <input type="text" className="form-control py-2 bg-white font-monospace text-dark fw-bold" name="amount" value={formData.amount} onChange={handleInputChange} required placeholder="296800.00" style={{ fontSize: "13px" }} />
            </div>

            <div className="mb-0">
              <label className="form-label text-secondary small fw-medium mb-1">Remarks</label>
              <textarea className="form-control py-2 bg-white text-dark" name="remarks" rows="2" value={formData.remarks} onChange={handleInputChange} placeholder="Payment for Invoice" style={{ fontSize: "13px", resize: "none" }}></textarea>
              <div className="text-end text-muted mt-1" style={{ fontSize: "11px" }}>
                {formData.remarks ? formData.remarks.length : 0} / 250
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM SECTION: Audit Information */}
        <div className="p-3 border rounded-3 bg-light mb-4">
          <div className="p-1 mb-2"><strong style={{ color: "#2563eb", fontSize: "14px" }}>Other Information</strong></div>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label text-secondary small fw-medium mb-1 d-block">Payment Status</label>
              <span className="badge d-inline-block px-3 py-2 bg-white border text-warning fw-bold" style={{ fontSize: "11px", borderRadius: "5px" }}>
                PENDING
              </span>
            </div>
            <div className="col-md-6">
              <span className="text-muted d-block small mb-1">Created By</span>
              <strong className="text-dark">Admin User</strong>
            </div>
          </div>
        </div>

        {/* ACTION BOTTOM TOOLBAR */}
        <div className="d-flex justify-content-end align-items-center gap-2 border-top pt-4">
          <button type="button" className="btn btn-outline-secondary px-4 py-2" onClick={() => navigate("/admin/payment/list")} style={{ borderRadius: "6px", fontWeight: "600", fontSize: "13px", backgroundColor: "#fff" }}>Cancel</button>
          <button 
            type="submit" 
            disabled={submitting || loadingInvoices || availableInvoices.length === 0} 
            className="btn btn-primary px-4 py-2 text-white" 
            style={{ borderRadius: "6px", fontWeight: "600", fontSize: "13px", backgroundColor: (submitting || availableInvoices.length === 0) ? "#94a3b8" : "#2563eb", border: "none" }}
          >
            {submitting ? "Saving Payment..." : "Save Payment"}
          </button>
        </div>

      </form>
    </AdminLayout>
  );
};

export default PaymentCreate;