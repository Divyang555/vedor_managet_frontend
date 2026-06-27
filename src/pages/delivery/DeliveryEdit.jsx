import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import axios from "axios";

const DeliveryEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const BASE_URL = `http://localhost:8080/admin/deliveries/${id}`;
  const EMPLOYEES_API = "http://localhost:8080/admin/employees";

  // System Pipeline Operational States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");
  const [employees, setEmployees] = useState([]);

  // Controlled Elements State Schema Layout
  const [formData, setFormData] = useState({
    deliveryCode: "",
    purchaseOrderId: "",
    employeeId: "",
    poNumber: "",
    vendorName: "",
    employeeCode: "",
    employeeName: "",
    dispatchDate: "",
    expectedDate: "",
    currentLocation: "",
    status: "PENDING",
    remarks: "",
    proofImageUrl: ""
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

  // Pre-load essential matrix metadata arrays and active item states on mounting phase
  useEffect(() => {
    const loadRequiredDataMatrix = async () => {
      try {
        setLoading(true);
        setApiError("");

        // 🚀 STEP 1: Fetch Employee reference dictionary list first
        const empResponse = await axios.get(EMPLOYEES_API, getRequestConfig());
        const employeesList = Array.isArray(empResponse.data) ? empResponse.data : [];
        setEmployees(employeesList);

        // 🚀 STEP 2: Fetch Delivery entry object values
        const deliveryResponse = await axios.get(BASE_URL, getRequestConfig());
        
        if (deliveryResponse.data) {
          const d = deliveryResponse.data;
          console.log("📂 Edit Form Target Payload Loaded:", d);

          // Find employeeCode if only employeeName is shared by flat structure
          let targetEmpCode = d.employeeCode || "";
          if (!targetEmpCode && d.employeeName) {
            const foundEmp = employeesList.find(
              emp => `${emp.firstName || ""} ${emp.lastName || ""}`.trim().toLowerCase() === d.employeeName.trim().toLowerCase()
            );
            if (foundEmp) targetEmpCode = foundEmp.employeeCode;
          }

          // Apply clean state assignment with direct parameter falls
          setFormData({
            deliveryCode: d.deliveryCode || "",
            purchaseOrderId: d.purchaseOrderId || "",
            employeeId: d.employeeId || "",
            poNumber: d.poNumber || "",
            vendorName: d.vendorName || "",
            employeeCode: targetEmpCode,
            employeeName: d.employeeName || "",
            dispatchDate: d.dispatchDate || "",
            expectedDate: d.expectedDate || "",
            currentLocation: d.currentLocation || "",
            status: d.status || "PENDING",
            remarks: d.remarks || "",
            proofImageUrl: d.proofImageUrl || ""
          });
        }
      } catch (err) {
        console.error("Pipeline structural recovery tracking error matrix:", err);
        setApiError("Failed to sync structural logistical entries from server repository.");
      } finally {
        setLoading(false);
      }
    };

    loadRequiredDataMatrix();
  }, [id]);

  // Text inputs fields state handler updates
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "employeeCode") {
      const selectedEmp = employees.find(emp => emp.employeeCode === value);
      setFormData((prev) => ({
        ...prev,
        employeeCode: value,
        employeeName: selectedEmp ? `${selectedEmp.firstName} ${selectedEmp.lastName}` : ""
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // System filesystem upload stream parsing layout down to binary image preview asset
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File memory layout footprint out of bounds! Choose an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, proofImageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to clear all operational form contents?")) {
      setFormData(prev => ({
        ...prev,
        deliveryCode: "", employeeCode: "", dispatchDate: "", expectedDate: "",
        currentLocation: "", remarks: "", proofImageUrl: ""
      }));
    }
  };

  // Core Form Submit Request Handler Matrix Execution
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setApiError("");

      const payload = {
    deliveryCode: formData.deliveryCode,
    purchaseOrderId: formData.purchaseOrderId,
    employeeId: formData.employeeId,
    dispatchDate: formData.dispatchDate,
    expectedDate: formData.expectedDate,
    currentLocation: formData.currentLocation,
    status: formData.status,   // ✅ ADD THIS
    remarks: formData.remarks,
    proofImageUrl: formData.proofImageUrl
};

console.log("UPDATE PAYLOAD", payload);
      await axios.put(BASE_URL, payload, getRequestConfig());
      alert("System Ledger Entry updated successfully!");
      navigate("/admin/delivery/list");
    } catch (err) {
      console.error("Spring Boot processing structural configuration rollback:", err);
      setApiError(err.response?.data?.message || "Failed to commit localized operational form modifications.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout pageTitle="Edit Delivery" pageSubtitle="Home / Deliveries / Manage Entry">
      
      {loading ? (
        <div style={{ padding: "60px", textAlign: "center", color: "#64748b", fontWeight: "500" }}>
          <div style={{ width: "24px", height: "24px", border: "2px solid #cbd5e1", borderTopColor: "#2563eb", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite", marginRight: "12px", verticalAlign: "middle" }}></div>
          <span>Retrieving tracking attributes from repository...</span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-4 bg-white border rounded-3 shadow-sm mx-auto w-100" style={{ maxWidth: "1350px", borderRadius: "10px" }}>
          {apiError && <div className="alert alert-danger py-2 fs-6 mb-3">{apiError}</div>}

          {/* ==================== FORM FIELDS GRID ROW BLOCK ==================== */}
          <div className="row g-4 mb-4">
            
            {/* Delivery Code */}
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark small mb-2">Delivery Code *</label>
              <input type="text" className="form-control py-2" name="deliveryCode" placeholder="Enter delivery code" value={formData.deliveryCode} onChange={handleChange} required style={{ borderRadius: "6px", fontSize: "14px" }} />
            </div>

            {/* Assign Employee Dropdown */}
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark small mb-2">Assign Employee *</label>
              <input
    type="text"
    className="form-control"
    value={formData.employeeName}
    disabled
/>
            </div>

            {/* Purchase Order Info Block (Read-Only Representation Dropdown Style) */}
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark small mb-2">Purchase Order *</label>
              <select className="form-select py-2 bg-light text-secondary border" disabled style={{ borderRadius: "6px", fontSize: "14px", cursor: "not-allowed" }}>
                <option>
                  {formData.poNumber || formData.vendorName 
                    ? `${formData.poNumber} ${formData.vendorName ? `- ${formData.vendorName}` : ""}` 
                    : "No Referenced Purchase Order Map Found"}
                </option>
              </select>
            </div>

            {/* Expected Date */}
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark small mb-2">Expected Date *</label>
              <input type="date" className="form-control py-2" name="expectedDate" value={formData.expectedDate} onChange={handleChange} required style={{ borderRadius: "6px", fontSize: "14px", color: "#475569" }} />
            </div>

            {/* Dispatch Date */}
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark small mb-2">Dispatch Date *</label>
              <input type="date" className="form-control py-2" name="dispatchDate" value={formData.dispatchDate} onChange={handleChange} required style={{ borderRadius: "6px", fontSize: "14px", color: "#475569" }} />
            </div>

            {/* Status select dropdown */}
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark small mb-2">Status *</label>
              <select className="form-select py-2" name="status" value={formData.status} onChange={handleChange} required style={{ borderRadius: "6px", fontSize: "14px", backgroundColor: "#ffffff" }}>
                <option value="PENDING">PENDING</option>
                <option value="DISPATCHED">DISPATCHED</option>
                <option value="IN_TRANSIT">IN TRANSIT</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            {/* Current Location */}
            <div className="col-md-12">
              <label className="form-label fw-semibold text-dark small mb-2">Current Location *</label>
              <input type="text" className="form-control py-2" name="currentLocation" placeholder="Enter current location" value={formData.currentLocation} onChange={handleChange} required style={{ borderRadius: "6px", fontSize: "14px" }} />
            </div>

            {/* Remarks text block */}
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark small mb-2">Remarks</label>
              <textarea className="form-control py-2" name="remarks" rows="6" placeholder="Enter remarks" value={formData.remarks} onChange={handleChange} style={{ borderRadius: "6px", fontSize: "14px", resize: "none" }}></textarea>
            </div>

            {/* Proof Image Preview Box Grid Container */}
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark small mb-2">Proof Image</label>
              <div className="p-3 text-center border border-dashed rounded-3 bg-light position-relative" style={{ borderStyle: "dashed", borderWidth: "2px", borderColor: "#cbd5e1", minHeight: "165px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                {formData.proofImageUrl ? (
                  <div className="mb-1 position-relative d-inline-block">
                    <img src={formData.proofImageUrl} alt="Preview" className="rounded border shadow-sm mb-1" style={{ width: "120px", height: "90px", objectFit: "cover" }} />
                    <button type="button" className="btn btn-danger btn-sm rounded-circle position-absolute" onClick={() => setFormData(p => ({ ...p, proofImageUrl: "" }))} style={{ top: "-8px", right: "-12px", width: "20px", height: "20px", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" }}>×</button>
                    <div className="text-success small fw-semibold" style={{ fontSize: "11px" }}>✓ Image Stream Binary Buffered</div>
                  </div>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-primary mb-1" style={{ fontSize: "28px" }}>upload_file</span>
                    <label htmlFor="deliveryFileInput" className="text-primary fw-semibold small mb-1 d-block" style={{ cursor: "pointer", fontSize: "13px" }}>
                      Click to select image
                    </label>
                  </>
                )}
                <input type="file" id="deliveryFileInput" accept="image/*" className="d-none" onChange={handleFileChange} />
                <div className="text-muted" style={{ fontSize: "11px" }}>JPG, PNG, GIF up to 2MB</div>
              </div>
            </div>

          </div>

          {/* ==================== BOTTOM SYSTEM ACTIONS BAR CONTROLS ==================== */}
          <div className="d-flex justify-content-between align-items-center border-top pt-4 mt-2">
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary px-4 py-2 d-flex align-items-center gap-2 shadow-sm" disabled={saving} style={{ borderRadius: "6px", fontWeight: "600", fontSize: "14px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>save</span>
                {saving ? "Processing..." : "Update Delivery"}
              </button>
              
              <button type="button" className="btn btn-outline-secondary px-4 py-2 d-flex align-items-center gap-2" onClick={handleReset} style={{ borderRadius: "6px", fontWeight: "600", fontSize: "14px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>restart_alt</span>
                Reset
              </button>
              
              <button type="button" className="btn btn-outline-danger px-4 py-2 d-flex align-items-center gap-2" onClick={() => navigate("/admin/delivery/list")} style={{ borderRadius: "6px", fontWeight: "600", fontSize: "14px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>close</span>
                Cancel
              </button>
            </div>

            <button 
              type="button" 
              className="btn btn-link text-primary d-flex align-items-center gap-2 text-decoration-none fw-semibold"
              onClick={() => navigate("/admin/delivery/list")}
              style={{ fontSize: "14px" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "19px" }}>format_list_bulleted</span>
              View Delivery Directory →
            </button>
          </div>

        </form>
      )}
    </AdminLayout>
  );
};

export default DeliveryEdit;