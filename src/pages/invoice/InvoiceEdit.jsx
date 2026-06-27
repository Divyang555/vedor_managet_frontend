import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import axios from "axios";

const InvoiceEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const BASE_URL = `http://localhost:8080/admin/invoices/${id}`;

  // System Pipeline Operational States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");

  // Controlled Elements State Schema Layout
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    vendorName: "",
    poNumber: "",
    invoiceDate: "",
    dueDate: "",
    amount: "0.00",
    remarks: "",
    invoiceFileBase64: "",
    invoiceFileName: "",
    invoiceFileSize: "",
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

  // Pre-load current active Invoice record parameters on mounting phase
  useEffect(() => {
    const loadInvoiceDetails = async () => {
      try {
        setLoading(true);
        setApiError("");
        const response = await axios.get(BASE_URL, getRequestConfig());
        if (response.data) {
          const d = response.data;
          setFormData({
            invoiceNumber: d.invoiceNumber || "",
            vendorName: d.vendorName || "Vadodara Warehouse",
            poNumber: d.poNumber || "PO-2026-00121",
            invoiceDate: d.invoiceDate || "",
            dueDate: d.dueDate || "",
            amount: parseFloat(d.amount || 125000).toFixed(2),
            remarks: d.remarks || "",
            invoiceFileBase64: d.invoiceFileUrl || d.invoiceFileBase64 || "",
            invoiceFileName: d.invoiceFileName || "invoice_sample.pdf",
            invoiceFileSize: d.invoiceFileSize || "512 KB",
            status: d.status || "PENDING_REVIEW"
          });
        }
      } catch (err) {
        console.error("Error pulling database metadata sequence map:", err);
        setApiError("Failed to sync structural invoice records from repository.");
      } finally {
        setLoading(false);
      }
    };

    loadInvoiceDetails();
  }, [id]);

  // Handle standard input variations update state attributes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // File binary payload stream allocation converter block
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File memory footprint bounds overflow! Select an asset under 5MB.");
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

  // Form submission network core update pipeline trigger
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setApiError("");

      const payload = {
        invoiceDate: formData.invoiceDate,
        dueDate: formData.dueDate,
        remarks: formData.remarks,
        invoiceFileUrl: formData.invoiceFileBase64, // Keep base64 stream synchronized
        status: formData.status // Maintain same lifecycle stage flag
      };

      await axios.put(`http://localhost:8080/admin/invoices/${id}`, payload, getRequestConfig());
      // Direct navigation bypass as required
      navigate("/admin/invoice/list");
    } catch (err) {
      console.error("ERP transaction rollback exception:", err);
      setApiError(err.response?.data?.message || "Failed to commit local form updates to database backend.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout pageTitle="Edit Invoice" pageSubtitle={`Home / Invoices / Modify Entry #${id}`}>
      
      {loading ? (
        <div style={{ padding: "60px", textAlign: "center", color: "#64748b", fontWeight: "500" }}>
          <div style={{ width: "24px", height: "24px", border: "2px solid #cbd5e1", borderTopColor: "#2563eb", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite", marginRight: "12px", verticalAlign: "middle" }}></div>
          <span>Retrieving matrix tracking parameters...</span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-4 bg-white border rounded-3 shadow-sm mx-auto w-100" style={{ maxWidth: "1350px", borderRadius: "10px" }}>
          {apiError && <div className="alert alert-danger py-2 fs-6 mb-3">{apiError}</div>}

          {/* ==================== ROW 1: READ-ONLY STATIC CRITERIA KEYS ==================== */}
          <div className="row g-4 mb-4">
            {/* Invoice Number (Read Only) */}
            <div className="col-md-4">
              <label className="form-label fw-semibold text-muted small mb-2">Invoice Number (Read Only)</label>
              <input type="text" className="form-control py-2 bg-light text-secondary border-dashed" value={formData.invoiceNumber} readOnly style={{ borderRadius: "6px", fontSize: "14px", cursor: "not-allowed" }} />
            </div>

            {/* Vendor Name (Read Only) */}
            <div className="col-md-4">
              <label className="form-label fw-semibold text-muted small mb-2">Vendor (Read Only)</label>
              <input type="text" className="form-control py-2 bg-light text-secondary border-dashed" value={formData.vendorName} readOnly style={{ borderRadius: "6px", fontSize: "14px", cursor: "not-allowed" }} />
            </div>

            {/* Purchase Order (Read Only) */}
            <div className="col-md-4">
              <label className="form-label fw-semibold text-muted small mb-2">Purchase Order (Read Only)</label>
              <input type="text" className="form-control py-2 bg-light text-secondary border-dashed" value={formData.poNumber} readOnly style={{ borderRadius: "6px", fontSize: "14px", cursor: "not-allowed" }} />
            </div>
          </div>

          {/* ==================== ROW 2: EDITABLE SCHEDULES & AUTO VALUE LOCK ==================== */}
          <div className="row g-4 mb-4">
            {/* Invoice Date * (Editable) */}
            <div className="col-md-4">
              <label className="form-label fw-semibold text-dark small mb-2">Invoice Date *</label>
              <input type="date" className="form-control py-2" name="invoiceDate" value={formData.invoiceDate} onChange={handleChange} required style={{ borderRadius: "6px", fontSize: "14px", color: "#475569" }} />
            </div>

            {/* Due Date * (Editable) */}
            <div className="col-md-4">
              <label className="form-label fw-semibold text-dark small mb-2">Due Date *</label>
              <input type="date" className="form-control py-2" name="dueDate" value={formData.dueDate} onChange={handleChange} required style={{ borderRadius: "6px", fontSize: "14px", color: "#475569" }} />
            </div>

            {/* Amount (Read Only Lock) */}
            <div className="col-md-4">
              <label className="form-label fw-semibold text-muted small mb-2">Amount (Read Only)</label>
              <div className="input-group">
                <span className="input-group-text bg-light text-secondary fw-semibold border-dashed" style={{ fontSize: "14px" }}>₹</span>
                <input type="text" className="form-control py-2 bg-light text-secondary font-monospace fw-bold border-dashed" value={formData.amount} readOnly style={{ borderRadius: "0 6px 6px 0", fontSize: "14px", cursor: "not-allowed" }} />
              </div>
            </div>
          </div>

          {/* ==================== ROW 3: DRAG & DROP MEDIA ASSET OVERWRITE STACK ==================== */}
          <div className="row g-4 mb-4">
            <div className="col-md-12">
              <label className="form-label fw-semibold text-dark small mb-2">Invoice File *</label>
              
              <div className="p-4 text-center border border-dashed rounded-3 bg-light position-relative" style={{ borderStyle: "dashed", borderWidth: "2px", borderColor: "#cbd5e1", minHeight: "170px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                {formData.invoiceFileBase64 ? (
                  <div className="d-flex align-items-center gap-4 p-3 bg-white border rounded shadow-sm position-relative w-100 mx-auto" style={{ maxWidth: "550px" }}>
                    <div style={{ width: "42px", height: "42px", backgroundColor: "#fef2f2", color: "#dc2626", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>description</span>
                    </div>
                    <div className="text-start flex-grow-1" style={{ minWidth: 0 }}>
                      <strong className="text-dark d-block text-truncate" style={{ fontSize: "13px" }}>{formData.invoiceFileName}</strong>
                      <small className="text-muted" style={{ fontSize: "11px" }}>{formData.invoiceFileSize}</small>
                    </div>
                    <button type="button" className="btn btn-sm btn-danger rounded-circle position-absolute" onClick={() => setFormData(p => ({ ...p, invoiceFileBase64: "", invoiceFileName: "", invoiceFileSize: "" }))} style={{ top: "-10px", right: "-10px", width: "22px", height: "22px", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>×</button>
                  </div>
                ) : (
                  <div>
                    <span className="material-symbols-outlined text-primary mb-2" style={{ fontSize: "36px" }}>cloud_upload</span>
                    <div style={{ fontSize: "13px" }}>
                      <label htmlFor="invoiceEditFileInput" className="text-primary fw-semibold" style={{ cursor: "pointer" }}>
                        Drag & drop file here or click to browse
                      </label>
                    </div>
                    <div className="text-muted mt-1" style={{ fontSize: "11px" }}>Supports: PDF, DOC, DOCX, JPG, PNG (Max size: 5MB)</div>
                  </div>
                )}
                <input type="file" id="invoiceEditFileInput" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" className="d-none" onChange={handleFileUpload} />
              </div>

            </div>
          </div>

          {/* ==================== ROW 4: REMARKS MANIFESTATION BLOCKS ==================== */}
          <div className="row g-4 mb-4">
            <div className="col-md-12">
              <label className="form-label fw-semibold text-dark small mb-2">Remarks</label>
              <textarea className="form-control py-2" name="remarks" rows="4" placeholder="Enter modification comments..." value={formData.remarks} onChange={handleChange} style={{ borderRadius: "6px", fontSize: "14px", resize: "none" }}></textarea>
            </div>
          </div>

          {/* ==================== FORM FOOTER MANAGEMENT SUBMIT UTILITIES ==================== */}
          <div className="d-flex justify-content-start align-items-center gap-2 border-top pt-4 mt-2">
            <button type="submit" className="btn btn-primary px-4 py-2 d-flex align-items-center gap-2 shadow-sm" disabled={saving} style={{ borderRadius: "6px", fontWeight: "600", fontSize: "14px", backgroundColor: "#2563eb", borderColor: "#2563eb" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>save_as</span>
              {saving ? "Updating Core Server Entries..." : "Update Invoice"}
            </button>
            
            <button type="button" className="btn btn-outline-danger px-4 py-2 d-flex align-items-center gap-2" onClick={() => navigate("/admin/invoice/list")} style={{ borderRadius: "6px", fontWeight: "600", fontSize: "14px", backgroundColor: "#ffffff" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>close</span>
              Cancel Changes
            </button>
          </div>

        </form>
      )}
    </AdminLayout>
  );
};

export default InvoiceEdit;