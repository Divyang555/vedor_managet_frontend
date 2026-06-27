import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import axios from "axios";

const InvoiceCreate = () => {
  const navigate = useNavigate();
  const VENDORS_API = "http://localhost:8080/admin/vendors";
  const PO_API = "http://localhost:8080/purchase-orders/approved"; // 🚀 FIXED: Pointing to exact backend endpoint path
  const BASE_URL = "http://localhost:8080/admin/invoices";

  // Framework Pipeline Structural States
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");
  const [vendors, setVendors] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);

  // Controlled Elements State Schema Mappings
  const [formData, setFormData] = useState({
    vendorId: "",
    vendorName: "", // Maintained inside UI state context for read-only view rendering mapping
    purchaseOrderId: "",
    invoiceDate: "",
    dueDate: "",
    amount: "0.00",
    remarks: "",
    invoiceFileBase64: "",
    invoiceFileName: "",
    invoiceFileSize: ""
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

  // Pre-load vendors and purchase orders metadata arrays on component initialize
  useEffect(() => {
    const fetchRequiredMetadata = async () => {
      try {
        setLoading(true);
        setApiError("");
        
        // Parallel API extraction layer trigger
        const [vendorsResponse, poResponse] = await Promise.all([
          axios.get(VENDORS_API, getRequestConfig()).catch(() => ({ data: [] })),
          axios.get(PO_API, getRequestConfig()).catch(() => ({ data: [] }))
        ]);

        setVendors(Array.isArray(vendorsResponse.data) ? vendorsResponse.data : []);
        setPurchaseOrders(Array.isArray(poResponse.data) ? poResponse.data : []);
      } catch (err) {
        console.error("ERP metadata catalog synchronizer failure loop:", err);
        setApiError("Failed to fetch prerequisite master entities catalog records from database.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequiredMetadata();
  }, []);

  // Structural dynamic tracking input events change processor
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "purchaseOrderId") {
      const selectedPO = purchaseOrders.find(
        (po) => String(po.id) === String(value)
      );

      console.log("Selected PO Metadata node slice:", selectedPO);

      // 🚀 FIXED: Auto populate mapping properties context variables directly from server item object values
      setFormData((prev) => ({
        ...prev,
        purchaseOrderId: value,
        vendorId: selectedPO ? selectedPO.vendorId : "",
        vendorName: selectedPO ? selectedPO.vendorName : "",
        amount: selectedPO ? selectedPO.grandTotal : "0.00"
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Direct binary asset serialization stream parser engine
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File memory blueprint layout overflow bounds! Choose an asset under 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          invoiceFileBase64: reader.result,
          invoiceFileName: file.name,
          invoiceFileSize: `${(file.size / 1024).toFixed(0)} KB`
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset form clean states trigger
  const handleReset = () => {
    if (window.confirm("Are you sure you want to revert all ledger file creation changes?")) {
      setFormData({
        vendorId: "",
        vendorName: "",
        purchaseOrderId: "",
        invoiceDate: "",
        dueDate: "",
        amount: "0.00",
        remarks: "",
        invoiceFileBase64: "",
        invoiceFileName: "",
        invoiceFileSize: ""
      });
    }
  };

  // Form submission network pipeline core handler block
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.invoiceFileBase64) {
      alert("Validation Constraint Warning: Missing required structural Invoice File resource asset.");
      return;
    }

    try {
      setSaving(true);
      setApiError("");

      // 🚀 FIXED: Strict data schema payload mapping compilation - completely omitting vendorName and amount parameters
      const payload = {
        vendorId: Number(formData.vendorId),
        purchaseOrderId: Number(formData.purchaseOrderId),
        invoiceDate: formData.invoiceDate,
        dueDate: formData.dueDate,
        invoiceFileUrl: formData.invoiceFileBase64,
        remarks: formData.remarks
      };

      await axios.post(BASE_URL, payload, getRequestConfig());
      navigate("/admin/invoice/list"); 
    } catch (err) {
      console.error("Invoice transactional state storage failure logging registry:", err);
      setApiError(err.response?.data?.message || "Failed to finalize structural ledger invoice save operation.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout pageTitle="Upload Invoice" pageSubtitle="Home / Invoices / Asset Creation Ledger">
      
      {loading ? (
        <div style={{ padding: "60px", textAlign: "center", color: "#64748b", fontWeight: "500" }}>
          <div style={{ width: "24px", height: "24px", border: "2px solid #cbd5e1", borderTopColor: "#2563eb", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite", marginRight: "12px", verticalAlign: "middle" }}></div>
          <span>Synchronizing infrastructure catalog matrix keys...</span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-4 bg-white border rounded-3 shadow-sm mx-auto w-100" style={{ maxWidth: "1350px", borderRadius: "10px" }}>
          {apiError && <div className="alert alert-danger py-2 fs-6 mb-3">{apiError}</div>}

          {/* ==================== ROW 1: CORE IDENTIFIERS MATCHING MATRIX ==================== */}
          <div className="row g-4 mb-4">
            {/* Invoice Number */}
            <div className="col-md-4">
              <label className="form-label fw-semibold text-dark small mb-2">Invoice Number *</label>
              <input
                type="text"
                className="form-control"
                value="Will be generated automatically"
                readOnly
                style={{ backgroundColor: "#f8fafc", color: "#64748b", cursor: "not-allowed" }}
              />
            </div>

            {/* Purchase Order Selection box */}
            <div className="col-md-4">
              <label className="form-label fw-semibold text-dark small mb-2">
                Purchase Order *
              </label>

              <select
                className="form-select"
                name="purchaseOrderId"
                value={formData.purchaseOrderId}
                onChange={handleChange}
                required
              >
                <option value="">Select Purchase Order</option>
                {purchaseOrders.map((po) => (
                  /* 🚀 FIXED: Displays exactly and only the standalone dynamic Purchase Order Number string now */
                  <option key={po.id} value={po.id}>
                    {po.poNumber}
                  </option>
                ))}
              </select>
            </div>

            {/* Vendor Display Input Box */}
            <div className="col-md-4">
              <label className="form-label fw-semibold text-dark small mb-2">Vendor *</label>
              <input
                className="form-control"
                value={formData.vendorName}
                readOnly
                placeholder="Select PO to populate"
                style={{ backgroundColor: "#f8fafc", cursor: "not-allowed" }}
              />
            </div>
          </div>

          {/* ==================== ROW 2: TIMESTAMPS & AUTOMATED NUMERICAL VALUATIONS ==================== */}
          <div className="row g-4 mb-4">
            {/* Invoice Date */}
            <div className="col-md-4">
              <label className="form-label fw-semibold text-dark small mb-2">Invoice Date *</label>
              <input 
                type="date" 
                className="form-control py-2" 
                name="invoiceDate" 
                value={formData.invoiceDate} 
                onChange={handleChange} 
                required 
                style={{ borderRadius: "6px", fontSize: "14px", color: "#475569" }} 
              />
            </div>

            {/* Due Date */}
            <div className="col-md-4">
              <label className="form-label fw-semibold text-dark small mb-2">Due Date *</label>
              <input 
                type="date" 
                className="form-control py-2" 
                name="dueDate" 
                value={formData.dueDate} 
                onChange={handleChange} 
                required 
                style={{ borderRadius: "6px", fontSize: "14px", color: "#475569" }} 
              />
            </div>

            {/* Amount Field Box (Read Only representation wrapper) */}
            <div className="col-md-4">
              <label className="form-label fw-semibold text-muted small mb-2">Amount (Auto-Populated Read Only)</label>
              <div className="input-group">
                <span className="input-group-text bg-light text-secondary fw-semibold border-dashed" style={{ fontSize: "14px" }}>₹</span>
                <input 
                  type="text" 
                  className="form-control py-2 bg-light text-secondary font-monospace fw-bold border-dashed" 
                  value={formData.amount !== "0.00" && formData.amount ? Number(formData.amount).toLocaleString("en-IN") : "0.00"} 
                  readOnly 
                  style={{ borderRadius: "0 6px 6px 0", fontSize: "14px", cursor: "not-allowed" }} 
                />
              </div>
            </div>
          </div>

          {/* ==================== ROW 3: DRAG & DROP MEDIA FILE BINARY UPLOAD PIPELINE ==================== */}
          <div className="row g-4 mb-4">
            <div className="col-md-12">
              <label className="form-label fw-semibold text-dark small mb-2">Invoice File *</label>
              
              <div 
                className="p-4 text-center border border-dashed rounded-3 bg-light position-relative" 
                style={{ borderStyle: "dashed", borderWidth: "2px", borderColor: "#cbd5e1", minHeight: "180px", display: "flex", justifyContent: "center", alignItems: "center" }}
              >
                {formData.invoiceFileBase64 ? (
                  <div className="d-flex align-items-center gap-4 p-3 bg-white border rounded shadow-sm position-relative w-100 mx-auto" style={{ maxWidth: "550px" }}>
                    <div style={{ width: "48px", height: "48px", backgroundColor: "#fef2f2", color: "#dc2626", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>description</span>
                    </div>
                    <div className="text-start flex-grow-1" style={{ minWidth: 0 }}>
                      <strong className="text-dark d-block text-truncate" style={{ fontSize: "14px" }}>{formData.invoiceFileName}</strong>
                      <small className="text-muted" style={{ fontSize: "12px" }}>{formData.invoiceFileSize}</small>
                    </div>
                    <button 
                      type="button" 
                      className="btn btn-sm btn-danger rounded-circle position-absolute" 
                      onClick={() => setFormData(p => ({ ...p, invoiceFileBase64: "", invoiceFileName: "", invoiceFileSize: "" }))} 
                      style={{ top: "-10px", right: "-10px", width: "22px", height: "22px", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div>
                    <span className="material-symbols-outlined text-primary mb-2" style={{ fontSize: "40px" }}>cloud_upload</span>
                    <div style={{ fontSize: "14px" }}>
                      <label htmlFor="invoiceFileInput" className="text-primary fw-semibold text-decoration-none" style={{ cursor: "pointer" }}>
                        Drag & drop file here or click to browse
                      </label>
                    </div>
                    <div className="text-muted mt-2" style={{ fontSize: "12px" }}>Supports: PDF, DOC, DOCX, JPG, PNG (Max size: 5MB)</div>
                  </div>
                )}
                <input type="file" id="invoiceFileInput" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" className="d-none" onChange={handleFileUpload} />
              </div>

            </div>
          </div>

          {/* ==================== ROW 4: REMARKS OBSERVATIONS TEXT AREA ==================== */}
          <div className="row g-4 mb-4">
            <div className="col-md-12">
              <label className="form-label fw-semibold text-dark small mb-2">Remarks</label>
              <textarea 
                className="form-control py-2" 
                name="remarks" 
                rows="4" 
                placeholder="Enter remarks (optional)..." 
                value={formData.remarks} 
                onChange={handleChange} 
                style={{ borderRadius: "6px", fontSize: "14px", resize: "none" }}
              ></textarea>
            </div>
          </div>

          {/* ==================== BOTTOM BUTTON ACTIONS PANEL LAYER ==================== */}
          <div className="d-flex justify-content-start align-items-center gap-2 border-top pt-4 mt-2">
            <button 
              type="submit" 
              className="btn btn-primary px-4 py-2 d-flex align-items-center gap-2 shadow-sm" 
              disabled={saving} 
              style={{ borderRadius: "6px", fontWeight: "600", fontSize: "14px", backgroundColor: "#2563eb", borderColor: "#2563eb" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>save</span>
              {saving ? "Saving Record..." : "Save Invoice"}
            </button>
            
            <button 
              type="button" 
              className="btn btn-outline-secondary px-4 py-2 d-flex align-items-center gap-2" 
              onClick={handleReset} 
              style={{ borderRadius: "6px", fontWeight: "600", fontSize: "14px", backgroundColor: "#ffffff" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>restart_alt</span>
              Reset
            </button>
            
            <button 
              type="button" 
              className="btn btn-outline-danger px-4 py-2 d-flex align-items-center gap-2" 
              onClick={() => navigate("/admin/invoice/list")} 
              style={{ borderRadius: "6px", fontWeight: "600", fontSize: "14px", backgroundColor: "#ffffff" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>close</span>
              Cancel
            </button>
          </div>

        </form>
      )}
    </AdminLayout>
  );
};

export default InvoiceCreate;