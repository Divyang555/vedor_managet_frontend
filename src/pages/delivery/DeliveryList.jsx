import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import axios from "axios";

const DeliveryList = () => {
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:8080/admin/deliveries";

  // Dynamic Component State Buckets
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Bearer Authentication authorization headers configuration helper
  const getRequestConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        ...(token && token !== "null" ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
        "Cache-Control": "no-cache", 
        "Pragma": "no-cache"
      }
    };
  };

  // Sync transactional ledger rows on initial structural component initialization
  useEffect(() => {
    fetchDeliveriesLedger();
  }, []);

  const fetchDeliveriesLedger = async () => {
    try {
      setLoading(true);
      setApiError("");
      const response = await axios.get(BASE_URL, getRequestConfig());
      
      console.log("🚀 Flat Live Server API Response Data Stack:", response.data);
      
      const responseData = response.data;
      if (Array.isArray(responseData)) {
        setDeliveries(responseData);
      } else if (responseData && Array.isArray(responseData.content)) {
        setDeliveries(responseData.content);
      } else {
        setDeliveries([]);
      }
    } catch (err) {
      console.error("Database retrieval matrix mapping failure:", err);
      setApiError("Failed to sync structural deliveries data matrix from database servers.");
      setDeliveries([]); 
    } finally {
      setLoading(false);
    }
  };

  // Safe soft deactivation status toggle request layer trigger
  const handleToggleDeliveryStatus = async (id, currentStatus) => {
    const safeStatus = currentStatus ? currentStatus.toString().toUpperCase() : "PENDING";
    const nextStatus = safeStatus === "CANCELLED" ? "PENDING" : "CANCELLED";
    if (window.confirm(`Are you sure you want to change this delivery status to ${nextStatus}?`)) {
      try {
        const targetEndpoint = nextStatus === "CANCELLED" ? "deactivate" : "activate";
        await axios.put(`${BASE_URL}/${id}/${targetEndpoint}`, {}, getRequestConfig());
        fetchDeliveriesLedger(); 
      } catch (err) {
        console.error("Pipeline checkpoint status assignment rollback rejection:", err);
        alert("Failed to safely alter transaction lifecycle status attribute.");
      }
    }
  };

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

  // Global dynamic filter searching across direct flat payload parameters
  const filteredDeliveries = Array.isArray(deliveries) 
    ? deliveries.filter((item) => {
        const matchesSearch = 
          (item.deliveryCode?.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.poNumber?.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.vendorName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.employeeName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.currentLocation?.toLowerCase().includes(searchTerm.toLowerCase()));

        const itemStatus = item.status ? item.status.toString().toUpperCase() : "PENDING";
        const currentFilter = statusFilter.toUpperCase();
        const matchesStatus = currentFilter === "ALL" || itemStatus === currentFilter;

        return matchesSearch && matchesStatus;
      })
    : [];

  // Dynamic Aggregates Calculators Mapping from Live Database State
  const totalCount = Array.isArray(deliveries) ? deliveries.length : 0;
  const pendingCount = Array.isArray(deliveries) ? deliveries.filter((d) => (d.status || "PENDING").toString().toUpperCase() === "PENDING").length : 0;
  const inTransitCount = Array.isArray(deliveries) ? deliveries.filter((d) => {
    const s = (d.status || "").toString().toUpperCase();
    return s === "IN_TRANSIT" || s === "DISPATCHED";
  }).length : 0;
  const deliveredCount = Array.isArray(deliveries) ? deliveries.filter((d) => (d.status || "").toString().toUpperCase() === "DELIVERED").length : 0;
  const cancelledCount = Array.isArray(deliveries) ? deliveries.filter((d) => (d.status || "").toString().toUpperCase() === "CANCELLED").length : 0;

  return (
    <AdminLayout pageTitle="Deliveries" pageSubtitle="Home / Deliveries">
      
      {/* ==================== 🚀 FIXED: UPPER ANALYTICS CARDS (EXACTLY 1 ROW FOR ALL 5 BOXES) ==================== */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(5, minmax(0, 1fr))", 
        gap: "12px", 
        marginBottom: "24px" 
      }}>
        
        {/* Total Deliveries */}
        <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "14px", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ width: "40px", height: "40px", backgroundColor: "#eef2ff", color: "#4f46e5", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>local_shipping</span>
          </div>
          <div style={{ minWidth: 0 }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Total Deliveries</span>
            <strong style={{ fontSize: "18px", color: "#0f172a", fontWeight: "700" }}>{totalCount}</strong>
          </div>
        </div>

        {/* Pending */}
        <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "14px", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ width: "40px", height: "40px", backgroundColor: "#fffbeb", color: "#d97706", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>pending_actions</span>
          </div>
          <div style={{ minWidth: 0 }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Pending</span>
            <strong style={{ fontSize: "18px", color: "#0f172a", fontWeight: "700" }}>{pendingCount}</strong>
          </div>
        </div>

        {/* In Transit */}
        <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "14px", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ width: "40px", height: "40px", backgroundColor: "#eff6ff", color: "#2563eb", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>departure_board</span>
          </div>
          <div style={{ minWidth: 0 }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>In Transit</span>
            <strong style={{ fontSize: "18px", color: "#0f172a", fontWeight: "700" }}>{inTransitCount}</strong>
          </div>
        </div>

        {/* Delivered */}
        <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "14px", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ width: "40px", height: "40px", backgroundColor: "#f0fdf4", color: "#16a34a", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>check_box</span>
          </div>
          <div style={{ minWidth: 0 }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Delivered</span>
            <strong style={{ fontSize: "18px", color: "#0f172a", fontWeight: "700" }}>{deliveredCount}</strong>
          </div>
        </div>

        {/* Cancelled */}
        <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "14px", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ width: "40px", height: "40px", backgroundColor: "#fef2f2", color: "#dc2626", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>disabled_by_default</span>
          </div>
          <div style={{ minWidth: 0 }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Cancelled</span>
            <strong style={{ fontSize: "18px", color: "#0f172a", fontWeight: "700" }}>{cancelledCount}</strong>
          </div>
        </div>

      </div>

      {/* ==================== ACTION UTILITIES HEADER BAR CONTROLS ==================== */}
      <div style={{ padding: "16px", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px 12px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <input 
            type="text" 
            placeholder="Search by delivery code, PO number, vendor, employee..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "8px 12px", fontSize: "13px", border: "1px solid #cbd5e1", borderRadius: "6px", outline: "none", minWidth: "320px" }} 
          />
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: "8px 12px", fontSize: "13px", border: "1px solid #cbd5e1", borderRadius: "6px", outline: "none", backgroundColor: "#fff", cursor: "pointer" }}
          >
            <option value="All">Status: All</option>
            <option value="PENDING">PENDING</option>
            <option value="DISPATCHED">DISPATCHED</option>
            <option value="IN_TRANSIT">IN TRANSIT</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>

        <button 
          onClick={() => navigate("/admin/delivery/add")}
          style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 18px", backgroundColor: "#2563eb", color: "#ffffff", border: "none", borderRadius: "6px", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add</span>
          Add Delivery
        </button>
      </div>

      {/* ==================== FLAT ENGINE CORE LOGISTICS DIRECT MATRIX TABLE ==================== */}
      <div style={{ backgroundColor: "#ffffff", borderRadius: "0 0 12px 12px", border: "1px solid #e2e8f0", borderTop: "none", overflowX: "auto" }}>
        {apiError && <div style={{ margin: "16px", padding: "12px", backgroundColor: "#fef2f2", color: "#991b1b", fontSize: "13px", fontWeight: "600", borderRadius: "6px" }}>{apiError}</div>}

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#64748b", fontWeight: "500" }}>
            <div style={{ width: "20px", height: "20px", border: "2px solid #cbd5e1", borderTopColor: "#2563eb", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite", marginRight: "10px", verticalAlign: "middle" }}></div>
            <span>Synchronizing live flat logistical records from database...</span>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
                <th style={{ padding: "14px 20px", color: "#475569", fontWeight: "600" }}>#</th>
                <th style={{ padding: "14px 12px", color: "#475569", fontWeight: "600" }}>Delivery Code</th>
                <th style={{ padding: "14px 12px", color: "#475569", fontWeight: "600" }}>PO Number</th>
                <th style={{ padding: "14px 12px", color: "#475569", fontWeight: "600" }}>Vendor</th>
                <th style={{ padding: "14px 12px", color: "#475569", fontWeight: "600" }}>Assigned Employee</th>
                <th style={{ padding: "14px 12px", color: "#475569", fontWeight: "600" }}>Dispatch Date</th>
                <th style={{ padding: "14px 12px", color: "#475569", fontWeight: "600" }}>Expected Date</th>
                <th style={{ padding: "14px 12px", color: "#475569", fontWeight: "600" }}>Status</th>
                <th style={{ padding: "14px 12px", color: "#475569", fontWeight: "600" }}>Current Location</th>
                <th style={{ padding: "14px 20px", color: "#475569", fontWeight: "600", textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeliveries.length > 0 ? (
                filteredDeliveries.map((item, index) => {
                  const safeStatus = (item.status || "PENDING").toString().toUpperCase();
                  
                  let badgeBg = "#fffbeb"; let badgeColor = "#d97706";
                  if (safeStatus === "DELIVERED") { badgeBg = "#f0fdf4"; badgeColor = "#16a34a"; }
                  else if (safeStatus === "CANCELLED") { badgeBg = "#fef2f2"; badgeColor = "#ef4444"; }
                  else if (safeStatus === "IN_TRANSIT" || safeStatus === "DISPATCHED") { badgeBg = "#eff6ff"; badgeColor = "#2563eb"; }

                  return (
                    <tr key={item.id || index} style={{ borderBottom: "1px solid #f1f5f9", verticalAlign: "middle" }}>
                      <td style={{ padding: "14px 20px", color: "#64748b" }}>{index + 1}</td>
                      <td style={{ padding: "14px 12px", fontWeight: "600", color: "#2563eb" }}>{item.deliveryCode || "—"}</td>
                      <td style={{ padding: "14px 12px", color: "#334155", fontWeight: "500" }}>{item.poNumber || "—"}</td>
                      <td style={{ padding: "14px 12px", color: "#475569" }}>{item.vendorName || "—"}</td>
                      
                      <td style={{ padding: "14px 12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <img
                            src={item.employeeProfileImageUrl || "https://ui-avatars.com/api/?name=Employee"}
                            alt="Employee"
                            style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", border: "1px solid #e2e8f0" }}
                          />
                          <div>
                            <span style={{ color: "#0f172a", fontWeight: "500", display: "block" }}>{item.employeeName || "—"}</span>
                            {item.employeeCode && <small style={{ color: "#64748b", fontSize: "11px" }}>{item.employeeCode}</small>}
                          </div>
                        </div>
                      </td>
                      
                      <td style={{ padding: "14px 12px", color: "#475569" }}>{formatDate(item.dispatchDate)}</td>
                      <td style={{ padding: "14px 12px", color: "#475569" }}>{formatDate(item.expectedDate)}</td>
                      
                      <td style={{ padding: "14px 12px" }}>
                        <span style={{ padding: "4px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: "700", backgroundColor: badgeBg, color: badgeColor, display: "inline-block" }}>
                          {safeStatus}
                        </span>
                      </td>
                      
                      <td style={{ padding: "14px 12px", color: "#0f172a", fontWeight: "500" }}>{item.currentLocation || "Not Dispatched"}</td>
                      
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                          <button onClick={() => navigate(`/admin/delivery/view/${item.id}`)} style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", padding: 0 }} title="View Specs"><span className="material-symbols-outlined" style={{ fontSize: "18px" }}>visibility</span></button>
                          <button onClick={() => navigate(`/admin/delivery/edit/${item.id}`)} style={{ background: "none", border: "none", color: "#d97706", cursor: "pointer", padding: 0 }} title="Edit Config"><span className="material-symbols-outlined" style={{ fontSize: "18px" }}>edit</span></button>
                          <button 
                            onClick={() => handleToggleDeliveryStatus(item.id, item.status)} 
                            style={{ background: "none", border: "none", color: safeStatus === "CANCELLED" ? "#16a34a" : "#dc2626", cursor: "pointer", padding: 0 }} 
                            title={safeStatus === "CANCELLED" ? "Re-Activate" : "Cancel Delivery"}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                              {safeStatus === "CANCELLED" ? "published_with_changes" : "delete"}
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="10" style={{ padding: "24px", textAlign: "center", color: "#64748b" }}>No sequential delivery nodes mapped over selected criteria parameters.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

    </AdminLayout>
  );
};

export default DeliveryList;