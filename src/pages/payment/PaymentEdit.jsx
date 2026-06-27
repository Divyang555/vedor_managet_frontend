import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import axios from "axios";

const PaymentEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const BASE_URL = `http://localhost:8080/admin/payments/${id}`;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");
  
  // 🚀 FIXED: All keys pre-initialized with empty strings to eliminate the controlled vs uncontrolled warnings entirely
  const [formData, setFormData] = useState({
    paymentNumber: "",
    invoiceNumber: "",
    poNumber: "",
    vendorName: "",
    amount: 0,
    paymentDate: "",
    paymentMethod: "",
    referenceNumber: "",
    remarks: "",
    status: ""
  });

  // Bearer Authentication authorization headers configuration helper
  const getRequestConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        ...(token && token !== "null" ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json"
      }
    };
  };

  // FETCH LOGIC: Fetch existing payment log on mount phase
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        setLoading(true);
        setApiError("");
        
        const response = await axios.get(BASE_URL, getRequestConfig());
        
        // 🚀 FIXED: Logging response here right before state modifications
        console.log("Payment Edit API Response:", response.data);

        if (response.data) {
          setFormData({
            paymentNumber: response.data.paymentNumber ?? "",
            invoiceNumber: response.data.invoiceNumber ?? "",
            poNumber: response.data.poNumber ?? "",
            vendorName: response.data.vendorName ?? "",
            // 🚀 FIXED: Exact nullish coalescing configurations checks
            amount: response.data.amount ?? 0,
            paymentDate: response.data.paymentDate ?? "",
            paymentMethod: response.data.paymentMethod ?? "",
            referenceNumber: response.data.referenceNumber ?? "",
            remarks: response.data.remarks ?? "",
            status: response.data.status ?? ""
          });
        }
      } catch (err) {
        console.error("Standard template mode fallback dynamic layer mapping active.", err);
        setApiError("Failed to fetch payment record from the server.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPaymentDetails();
  }, [id, BASE_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // UPDATE LOGIC: Submit filtered payload fields parameters to Spring Boot
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setApiError("");

      // 🚀 FIXED: Put request transmits exactly only the editable scope components attributes parameters payload
      const filteredPayload = {
        paymentDate: formData.paymentDate,
        paymentMethod: formData.paymentMethod,
        referenceNumber: formData.referenceNumber,
        remarks: formData.remarks
      };

      await axios.put(BASE_URL, filteredPayload, getRequestConfig());
      alert("Payment updated successfully.");
      navigate("/admin/payment/list");
    } catch (err) {
      console.error("Payload commit execution crash error loop:", err);
      setApiError(err.response?.data?.message || "Failed to commit modified treasury log updates.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout pageTitle="Modify Payment Entry" pageSubtitle="Loading structure...">
        <div style={{ padding: "60px", textAlign: "center", color: "#64748b" }}>
          <div style={{ width: "20px", height: "20px", border: "2px solid #cbd5e1", borderTopColor: "#2563eb", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite", marginRight: "10px", verticalAlign: "middle" }}></div>
          <span>Loading repository dataset records parameters...</span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Modify Payment Entry" pageSubtitle={`Home / Corporate Treasury / Modification Ledger Entry #${id}`}>
      <form onSubmit={handleSubmit} className="p-4 bg-white border rounded-3 shadow-sm mx-auto w-100" style={{ maxWidth: "1350px", borderRadius: "10px" }}>
        
        {apiError && (
          <div className="alert alert-danger py-2 fs-6 mb-3" style={{ fontSize: "14px", fontWeight: "500" }}>
            {apiError}
          </div>
        )}

        {/* ==================== ROW 1: SYSTEM READ-ONLY IDENTIFIERS ==================== */}
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <label className="form-label fw-semibold text-muted small mb-2">Payment Number (Read Only)</label>
            {/* 🚀 FIXED: Standard dynamic controlled string fallback mapping assignments */}
            <input type="text" className="form-control py-2 bg-light border-dashed text-secondary font-monospace" value={formData.paymentNumber || ""} readOnly style={{ fontSize: "14px", cursor: "not-allowed" }} />
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold text-muted small mb-2">Invoice Number (Read Only)</label>
            <input type="text" className="form-control py-2 bg-light border-dashed text-secondary" value={formData.invoiceNumber || ""} readOnly style={{ fontSize: "14px", cursor: "not-allowed" }} />
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold text-muted small mb-2">Purchase Order Number (Read Only)</label>
            <input type="text" className="form-control py-2 bg-light border-dashed text-secondary font-monospace" value={formData.poNumber || ""} readOnly style={{ fontSize: "14px", cursor: "not-allowed" }} />
          </div>
        </div>

        {/* ==================== ROW 2: PARTY DETAILS & VALUATION LOCKS ==================== */}
        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <label className="form-label fw-semibold text-muted small mb-2">Vendor Target Entity (Read Only)</label>
            <input type="text" className="form-control py-2 bg-light border-dashed text-secondary" value={formData.vendorName || ""} readOnly style={{ fontSize: "14px", cursor: "not-allowed" }} />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold text-muted small mb-2">Amount Lock (Read Only)</label>
            <input type="text" className="form-control py-2 bg-light border-dashed text-secondary font-monospace fw-bold" value={`₹${parseFloat(formData.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`} readOnly style={{ fontSize: "14px", cursor: "not-allowed" }} />
          </div>
        </div>

        {/* ==================== ROW 3: EDITABLE TRANSACTION MECHANICS ==================== */}
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <label className="form-label fw-semibold text-dark small mb-2">Payment Date *</label>
            <input type="date" className="form-control py-2" name="paymentDate" value={formData.paymentDate || ""} onChange={handleChange} required style={{ fontSize: "14px", borderRadius: "6px" }} />
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold text-dark small mb-2">Payment Method *</label>
            <select className="form-select py-2" name="paymentMethod" value={formData.paymentMethod || ""} onChange={handleChange} required style={{ fontSize: "14px" }}>
              <option value="">-- Select Payment Method --</option>
              <option value="BANK_TRANSFER">BANK TRANSFER</option>
              <option value="NEFT">NEFT Payment</option>
              <option value="RTGS">RTGS Settlement</option>
              <option value="IMPS">IMPS Instant Core</option>
              <option value="UPI">UPI Digital Link</option>
              <option value="CHEQUE">CHEQUE clearing</option>
              <option value="CASH">CASH Treasury</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold text-dark small mb-2">Reference Number *</label>
            <input type="text" className="form-control py-2" name="referenceNumber" value={formData.referenceNumber || ""} onChange={handleChange} required style={{ fontSize: "14px", borderRadius: "6px" }} />
          </div>
        </div>

        {/* ==================== ROW 4: REMARKS OBSERVATIONS TEXT AREA ==================== */}
        <div className="row g-4 mb-4">
          <div className="col-md-12">
            <label className="form-label fw-semibold text-dark small mb-2">Transaction Remarks</label>
            <textarea className="form-control py-2" name="remarks" rows="3" value={formData.remarks || ""} onChange={handleChange} placeholder="Enter payment remarks..." style={{ fontSize: "14px", resize: "none" }}></textarea>
          </div>
        </div>

        {/* ==================== ACTION FOOTER TOOLBAR ==================== */}
        <div className="d-flex justify-content-start align-items-center gap-2 border-top pt-4">
          <button type="submit" className="btn btn-primary px-4 py-2 d-flex align-items-center gap-2 shadow-sm" disabled={saving} style={{ borderRadius: "6px", fontWeight: "600", fontSize: "14px", backgroundColor: "#2563eb", borderColor: "#2563eb" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>save_as</span>
            {saving ? "Updating..." : "Update Transaction Log"}
          </button>
          <button type="button" className="btn btn-outline-secondary px-4 py-2" onClick={() => navigate("/admin/payment/list")} style={{ borderRadius: "6px", fontWeight: "600", fontSize: "14px", backgroundColor: "#ffffff" }}>Cancel</button>
        </div>

      </form>
    </AdminLayout>
  );
};

export default PaymentEdit;