import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import axios from "axios";

const DeliveryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const BASE_URL = `http://localhost:8080/admin/deliveries/${id}`;

  // System Pipeline Operational States
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

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

  // Pre-load Delivery details from backend on mounting phase
  useEffect(() => {
    const fetchDeliveryDetails = async () => {
      try {
        setLoading(true);
        setApiError("");
        const response = await axios.get(BASE_URL, getRequestConfig());
        if (response.data) {
          setDelivery(response.data);
        }
      } catch (err) {
        console.error("Error fetching delivery specs:", err);
        setApiError("Failed to load delivery specifications from server.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryDetails();
  }, [id]);

  // Helper utility to format raw API dates (YYYY-MM-DD) to frontend style (DD/MM/YYYY)
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      const [year, month, day] = dateString.split("-");
      if (year && month && day) return `${day}/${month}/${year}`;
      return dateString;
    } catch (e) {
      return dateString;
    }
  };

  // Helper logic to build timeline active/inactive status sequence
  const getTimelineMilestones = (currentStatus) => {
    const status = (currentStatus || "PENDING").toUpperCase();
    const stages = ["PENDING", "DISPATCHED", "IN_TRANSIT", "DELIVERED"];
    
    const descriptions = {
      PENDING: "Delivery created & awaiting dispatch initialization.",
      DISPATCHED: "Goods successfully dispatched from the central warehouse.",
      IN_TRANSIT: "Consignment reached shipment hub and is moving towards final destination.",
      DELIVERED: "Shipment successfully handed over and completed."
    };

    const currentIdx = stages.indexOf(status);

    return stages.map((stage, idx) => ({
      title: stage,
      description: idx === currentIdx && delivery?.remarks ? delivery.remarks : descriptions[stage],
      isCompleted: idx <= currentIdx && status !== "CANCELLED",
      isActive: idx === currentIdx && status !== "CANCELLED",
      isCancelled: status === "CANCELLED" && stage === "PENDING"
    }));
  };

  const milestones = getTimelineMilestones(delivery?.status);

  return (
    <AdminLayout pageTitle="Delivery Details" pageSubtitle={`Home / Deliveries / Overview #${id}`}>
      
      {loading ? (
        <div style={{ padding: "60px", textAlign: "center", color: "#64748b", fontWeight: "500" }}>
          <div style={{ width: "24px", height: "24px", border: "2px solid #cbd5e1", borderTopColor: "#2563eb", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite", marginRight: "12px", verticalAlign: "middle" }}></div>
          <span>Loading logistics parameters...</span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : apiError ? (
        <div className="alert alert-danger mx-auto" style={{ maxWidth: "1350px" }}>{apiError}</div>
      ) : (
        <div style={{ maxWidth: "1350px", margin: "0 auto", width: "100%" }}>

          {/* ==================== 🚀 CONTAINER INSIDE POSITIONING BLOCK ==================== */}
          <div className="card p-4 bg-white border shadow-sm w-100" style={{ borderRadius: "12px", position: "relative" }}>
            
            {/* 🚀 FIXED: "Back to List" button shifted clean INSIDE the master card container wrapper */}
            <button 
              onClick={() => navigate("/admin/delivery/list")} 
              style={{ 
                position: "absolute", 
                top: "24px", 
                right: "24px", 
                display: "flex", 
                alignItems: "center", 
                gap: "8px", 
                borderRadius: "6px", 
                fontWeight: "600", 
                fontSize: "13px", 
                backgroundColor: "#ffffff", 
                border: "1px solid #cbd5e1", 
                padding: "8px 16px", 
                color: "#334155", 
                cursor: "pointer", 
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                zIndex: 10
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px", verticalAlign: "middle" }}>arrow_back</span>
              Back to List
            </button>

            <div className="row g-5">
              
              {/* ==================== LEFT SIDE: TIMELINE TRACKING BLOCK ==================== */}
              <div className="col-lg-5 border-end pr-lg-4" style={{ marginTop: "40px" }}>
                <div className="p-3 mb-4 rounded-3 d-flex align-items-center justify-content-between" style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <div className="d-flex align-items-center gap-3">
                    <div style={{ width: "42px", height: "42px", backgroundColor: "#eef2ff", color: "#2563eb", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>local_shipping</span>
                    </div>
                    <div>
                      <h5 className="mb-0 fw-bold text-dark" style={{ fontSize: "16px" }}>{delivery?.deliveryCode || "—"}</h5>
                      <small className="text-muted" style={{ fontSize: "12px" }}>Logistics Node ID: #{delivery?.id}</small>
                    </div>
                  </div>
                  
                  <span style={{
                    padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "700",
                    backgroundColor: delivery?.status === "CANCELLED" ? "#fef2f2" : "#eff6ff",
                    color: delivery?.status === "CANCELLED" ? "#ef4444" : "#2563eb",
                    marginRight: "10px" // Prevents overlapping with outer container
                  }}>
                    {delivery?.status || "PENDING"}
                  </span>
                </div>

                <div style={{ position: "relative", paddingLeft: "32px", marginTop: "24px" }}>
                  <div style={{
                    position: "absolute", left: "11px", top: "8px", bottom: "8px",
                    width: "2px", backgroundColor: delivery?.status === "CANCELLED" ? "#fecaca" : "#e2e8f0", zIndex: 1
                  }}></div>

                  {delivery?.status === "CANCELLED" && (
                    <div className="d-flex gap-3 mb-4" style={{ position: "relative", zIndex: 2 }}>
                      <div style={{ position: "absolute", left: "-32px", width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#fef2f2", border: "2px solid #ef4444", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "#ef4444", fontWeight: "bold" }}>close</span>
                      </div>
                      <div>
                        <h6 className="mb-1 fw-bold text-danger" style={{ fontSize: "14px" }}>CANCELLED</h6>
                        <p className="text-muted small mb-0" style={{ fontSize: "12px" }}>{delivery?.remarks || "This transactional delivery lifecycle has been cancelled."}</p>
                      </div>
                    </div>
                  )}

                  {milestones.map((m, index) => (
                    <div key={index} className="d-flex gap-3 mb-4" style={{ position: "relative", zIndex: 2, opacity: delivery?.status === "CANCELLED" && !m.isCancelled ? 0.4 : 1 }}>
                      <div style={{
                        position: "absolute", left: "-32px", width: "24px", height: "24px", borderRadius: "50%",
                        backgroundColor: m.isActive ? "#2563eb" : m.isCompleted ? "#eef2ff" : "#ffffff",
                        border: m.isActive || m.isCompleted ? "2px solid #2563eb" : "2px solid #cbd5e1",
                        display: "flex", alignItems: "center", justifyContent: "center"
                      }}>
                        {m.isCompleted && (
                          <span className="material-symbols-outlined" style={{ fontSize: "14px", color: m.isActive ? "#ffffff" : "#2563eb", fontWeight: "bold" }}>check</span>
                        )}
                      </div>

                      <div>
                        <h6 className="mb-1 fw-bold" style={{ fontSize: "14px", color: m.isActive ? "#2563eb" : "#0f172a" }}>
                          {m.title}
                        </h6>
                        <p className="text-muted small mb-0" style={{ fontSize: "12px", lineHeight: "1.5" }}>
                          {m.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ==================== RIGHT SIDE: DATA GRID REPRESENTATION ==================== */}
              <div className="col-lg-7" style={{ marginTop: "40px" }}>
                <h5 className="fw-bold text-dark mb-4" style={{ fontSize: "18px", borderBottom: "2px solid #f1f5f9", paddingBottom: "10px" }}>
                  Delivery Specifications
                </h5>

                <div className="row g-4" style={{ fontSize: "14px" }}>
                  <div className="col-6 col-sm-4 fw-semibold text-muted">Delivery Code</div>
                  <div className="col-6 col-sm-8 text-dark fw-bold">{delivery?.deliveryCode || "—"}</div>

                  <div className="col-6 col-sm-4 fw-semibold text-muted">PO Number</div>
                  <div className="col-6 col-sm-8 text-dark fw-medium">{delivery?.poNumber || "—"}</div>

                  <div className="col-6 col-sm-4 fw-semibold text-muted">Vendor</div>
                  <div className="col-6 col-sm-8 text-dark">{delivery?.vendorName || "—"}</div>

                  <div className="col-6 col-sm-4 fw-semibold text-muted">Assigned Employee</div>
                  <div className="col-6 col-sm-8 text-dark fw-medium">
                    {delivery?.employeeName ? `${delivery.employeeName} (${delivery?.employeeCode || "N/A"})` : "—"}
                  </div>

                  <div className="col-6 col-sm-4 fw-semibold text-muted">Dispatch Date</div>
                  <div className="col-6 col-sm-8 text-dark">{formatDate(delivery?.dispatchDate)}</div>

                  <div className="col-6 col-sm-4 fw-semibold text-muted">Expected Date</div>
                  <div className="col-6 col-sm-8 text-dark">{formatDate(delivery?.expectedDate)}</div>

                  <div className="col-6 col-sm-4 fw-semibold text-muted">Delivery Date</div>
                  <div className="col-6 col-sm-8 text-dark">{formatDate(delivery?.deliveryDate) || "—"}</div>

                  <div className="col-6 col-sm-4 fw-semibold text-muted">Status</div>
                  <div className="col-6 col-sm-8">
                    <span style={{
                      padding: "4px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: "700",
                      backgroundColor: delivery?.status === "DELIVERED" ? "#f0fdf4" : delivery?.status === "CANCELLED" ? "#fef2f2" : "#fffbeb",
                      color: delivery?.status === "DELIVERED" ? "#16a34a" : delivery?.status === "CANCELLED" ? "#ef4444" : "#d97706"
                    }}>
                      {delivery?.status || "PENDING"}
                    </span>
                  </div>

                  <div className="col-6 col-sm-4 fw-semibold text-muted">Current Location</div>
                  <div className="col-6 col-sm-8 text-dark fw-medium">{delivery?.currentLocation || "Not Dispatched"}</div>

                  <div className="col-6 col-sm-4 fw-semibold text-muted">Remarks</div>
                  <div className="col-6 col-sm-8 text-secondary" style={{ whiteSpace: "pre-wrap", lineHeight: "1.5" }}>
                    {delivery?.remarks || "No additional comments appended."}
                  </div>

                  <div className="col-12 mt-4">
                    <div className="fw-semibold text-muted mb-2">Proof Image</div>
                    <div className="p-2 border rounded bg-light d-inline-block" style={{ borderRadius: "8px" }}>
                      {delivery?.proofImageUrl ? (
                        <div className="text-center">
                          <img 
                            src={delivery.proofImageUrl} 
                            alt="Logistical Proof Registry Preview" 
                            className="rounded border" 
                            style={{ maxWidth: "100%", maxHeight: "220px", objectFit: "contain", display: "block" }} 
                          />
                          <a 
                            href={delivery.proofImageUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-primary small fw-semibold mt-2 d-inline-block text-decoration-none"
                            style={{ fontSize: "12px" }}
                          >
                            Open Original Image ↗
                          </a>
                        </div>
                      ) : (
                        <div className="p-4 text-center text-muted" style={{ minWidth: "260px", fontSize: "13px" }}>
                          <span className="material-symbols-outlined d-block mb-1 text-secondary" style={{ fontSize: "28px" }}>image_not_supported</span>
                          No active proof graphics stream mapping uploaded.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default DeliveryView;