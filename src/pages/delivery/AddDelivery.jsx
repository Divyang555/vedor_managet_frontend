import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import axios from "axios";

const AddDelivery = () => {
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:8080/admin/deliveries";

  // Operational System Pipeline States
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // Foreign Matrix Master Reference States - CORRECTLY INITIALIZED
  const [employees, setEmployees] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);

  // Controlled Elements Parameters Schema Layout
  const [formData, setFormData] = useState({
    deliveryCode: "",
    employeeId: "",
    purchaseOrderId: "",
    expectedDate: "",
    dispatchDate: "",
    status: "PENDING",
    currentLocation: "",
    remarks: "",
    proofImage: ""
  });

  // Bearer Authentication configuration helper utilities
  const getRequestConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        ...(token && token !== "null" ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json"
      }
    };
  };

  // Pre-load essential matrix metadata arrays on mounting phase
  useEffect(() => {
    fetchForeignMasterReferences();
  }, []);

  // 🚀 FIXED: Only one clean fetch function with a single try-catch block and clean state storage
  const fetchForeignMasterReferences = async () => {
    try {
      // 1. Fetch available employees exactly once
      const empRes = await axios.get("http://localhost:8080/admin/deliveries/available-employees", getRequestConfig());
      setEmployees(Array.isArray(empRes.data) ? empRes.data : []);

      // 2. Fetch available purchase orders exactly once
      const poRes = await axios.get("http://localhost:8080/admin/deliveries/available-purchase-orders", getRequestConfig());
      setPurchaseOrders(Array.isArray(poRes.data) ? poRes.data : []);

      // 🚀 FIXED: Single debugging log tracking successful master data telemetry fetch
      console.log("Master references synchronized safely. Total POs loaded:", Array.isArray(poRes.data) ? poRes.data.length : 0);

    } catch (err) {
      console.error("Framework failure synchronizing foreign master resources stack:", err);
      setEmployees([]);
      setPurchaseOrders([]);
      setApiError("Failed to fetch initial dropdown master list data parameters.");
    }
  };

  // Text inputs fields state handler updates
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // System filesystem absolute file upload stream parsing layout down to base64 binary
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File memory layout footprint out of bounds! Choose an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, proofImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to clear all operational form contents?")) {
      setFormData({
        deliveryCode: "", employeeId: "", purchaseOrderId: "", expectedDate: "",
        dispatchDate: "", status: "PENDING", currentLocation: "", remarks: "", proofImage: ""
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setApiError("");

      const finalPayload = {
        ...formData,
        employeeId: parseInt(formData.employeeId) || null,
        purchaseOrderId: parseInt(formData.purchaseOrderId) || null,
        proofImageUrl: formData.proofImage 
      };

      await axios.post(BASE_URL, finalPayload, getRequestConfig());
      navigate("/admin/delivery/list");
    } catch (err) {
      console.error("Spring Boot processing structural exception error:", err);
      setApiError(err.response?.data?.message || "Failed to commit delivery data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout pageTitle="Add New Delivery" pageSubtitle="Home / Deliveries / New Entry">
      
      {/* ==================== CORE FORM LAYOUT MATRIX GRID ==================== */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border rounded-3 shadow-sm mx-auto" style={{ maxWidth: "1000px" }}>
        {apiError && <div className="alert alert-danger py-2 fs-6 mb-3">{apiError}</div>}

        <div className="row g-4 mb-4">
          {/* Delivery Code */}
          <div className="col-md-6">
            <label className="form-label fw-semibold text-dark small mb-2">Delivery Code *</label>
            <input type="text" className="form-control py-2" name="deliveryCode" placeholder="Enter delivery code" value={formData.deliveryCode} onChange={handleChange} required style={{ borderRadius: "6px", fontSize: "14px" }} />
          </div>

          {/* Assign Employee Dropdown */}
          <div className="col-md-6">
            <label className="form-label fw-semibold text-dark small mb-2">Assign Employee *</label>
            <select className="form-select py-2" name="employeeId" value={formData.employeeId} onChange={handleChange} required style={{ borderRadius: "6px", fontSize: "14px", backgroundColor: "#ffffff" }}>
              <option value="">Select Employee</option>
              {Array.isArray(employees) && employees.map((e) => (
                <option key={e.id} value={e.id}>{`${e.firstName} ${e.lastName}`}</option>
              ))}
            </select>
          </div>

          {/* Purchase Order reference link */}
          <div className="col-md-6">
            <label className="form-label fw-semibold text-dark small mb-2">Purchase Order *</label>
            <select className="form-select py-2" name="purchaseOrderId" value={formData.purchaseOrderId} onChange={handleChange} required style={{ borderRadius: "6px", fontSize: "14px", backgroundColor: "#ffffff" }}>
              <option value="">Select Purchase Order</option>
              {/* 🚀 FIXED: Safe Array assertion checks to completely avoid crashes */}
              {Array.isArray(purchaseOrders) && purchaseOrders.map((po) => (
                <option key={po.id} value={po.id}>
                  {po.poNumber}
                </option>
              ))}
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
              <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          {/* Current Location */}
          <div className="col-md-12">
            <label className="form-label fw-semibold text-dark small mb-2">Current Location</label>
            <input type="text" className="form-control py-2" name="currentLocation" placeholder="Enter current location" value={formData.currentLocation} onChange={handleChange} style={{ borderRadius: "6px", fontSize: "14px" }} />
          </div>

          {/* Remarks text block */}
          <div className="col-md-6">
            <label className="form-label fw-semibold text-dark small mb-2">Remarks</label>
            <textarea className="form-control py-2" name="remarks" rows="4" placeholder="Enter remarks" value={formData.remarks} onChange={handleChange} style={{ borderRadius: "6px", fontSize: "14px", resize: "none" }}></textarea>
          </div>

          {/* Proof Image Box */}
          <div className="col-md-6">
            <label className="form-label fw-semibold text-dark small mb-2">Proof Image</label>
            <div className="p-3 text-center border border-dashed rounded-3 bg-light position-relative" style={{ borderStyle: "dashed", borderWidth: "2px", borderColor: "#cbd5e1" }}>
              {formData.proofImage ? (
                <div className="mb-1">
                  <img src={formData.proofImage} alt="Preview" className="rounded border shadow-sm mb-1" style={{ width: "60px", height: "60px", objectFit: "cover" }} />
                  <div className="text-success small fw-semibold" style={{ fontSize: "11px" }}>✓ Image Stream Binary Buffered</div>
                </div>
              ) : (
                <span className="material-symbols-outlined text-primary mb-1" style={{ fontSize: "28px" }}>upload_file</span>
              )}

              <label htmlFor="deliveryFileInput" className="text-primary fw-semibold small mb-1 d-block" style={{ cursor: "pointer", fontSize: "13px" }}>
                Click to select image
              </label>
              <input type="file" id="deliveryFileInput" accept="image/*" className="d-none" onChange={handleFileChange} />
              <div className="text-muted" style={{ fontSize: "11px" }}>JPG, PNG, GIF up to 2MB</div>
            </div>
          </div>
        </div>

        {/* ==================== BOTTOM SYSTEM ACTIONS BAR CONTAINER TOOLBAR ==================== */}
        <div className="d-flex justify-content-between align-items-center border-top pt-4 mt-2">
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary px-4 py-2 d-flex align-items-center gap-2 shadow-sm" disabled={loading} style={{ borderRadius: "6px", fontWeight: "600", fontSize: "14px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>save</span>
              {loading ? "Processing..." : "Save Delivery"}
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
    </AdminLayout>
  );
};

export default AddDelivery;