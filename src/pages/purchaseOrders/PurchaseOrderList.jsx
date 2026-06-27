import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import purchaseOrderService from "../../services/purchaseOrderService";
import axios from "axios";

const PurchaseOrderList = () => {
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:8080/purchase-orders";

  // Dynamic Database Data States
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  // States for Filter & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateRange, setDateRange] = useState("01/05/2025 - 31/05/2025");

  // Custom Inline Confirmation Modal State matching Invoice List workflow
  const [modalConfig, setModalConfig] = useState({
    show: false,
    id: null,
    targetStatus: "",
    message: ""
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

  // Fetch metrics data dynamically from database on mount
  const loadPurchaseOrders = async () => {
    try {
      setLoading(true);
      setApiError("");
      const response = await purchaseOrderService.getAllPurchaseOrders();
      
      if (Array.isArray(response)) {
        setPurchaseOrders(response);
      } else if (response && Array.isArray(response.content)) {
        setPurchaseOrders(response.content);
      } else if (response && typeof response === "object") {
        const structuralArray = response.data || Object.values(response).find(Array.isArray);
        setPurchaseOrders(structuralArray || []);
      } else {
        setPurchaseOrders([]);
      }
    } catch (err) {
      console.error("Error fetching purchase orders:", err);
      setApiError("Failed to sync purchase orders list from database servers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    loadPurchaseOrders();
  }, [navigate]);

  // Open center modal handler block with exact prompt text constraints
  const openConfirmationModal = (id, targetStatus) => {
    const customMessage = targetStatus === "APPROVED"
      ? "Are you sure you want to approve this Purchase Order?"
      : "Are you sure you want to reject this Purchase Order?";
    
    setModalConfig({
      show: true,
      id: id,
      targetStatus: targetStatus,
      message: customMessage
    });
  };

  // Connects directly into standard PUT approval endpoints paths with dynamic UI refresh
 const handleConfirmStatusChange = async () => {
    const { id, targetStatus } = modalConfig;

    try {

        if (targetStatus === "APPROVED") {

            await purchaseOrderService.approvePurchaseOrder(id);

        } else {

            await purchaseOrderService.rejectPurchaseOrder(id);

        }

        setModalConfig(prev => ({
            ...prev,
            show: false
        }));

        alert(
            targetStatus === "APPROVED"
                ? "Purchase Order approved successfully."
                : "Purchase Order rejected successfully."
        );

        loadPurchaseOrders();

    } catch (err) {

        console.error(
            "Failed to update Purchase Order status",
            err
        );

    }
};

  // Dynamic filter conditions mapped directly over live state parameters
  const filteredOrders = purchaseOrders.filter(order => {
    const searchTarget = searchTerm.toLowerCase();
    
    const matchesSearch = 
      (order.poNumber && order.poNumber.toLowerCase().includes(searchTarget)) || 
      (order.vendorName && order.vendorName.toLowerCase().includes(searchTarget)) ||
      (order.employeeName && order.employeeName.toLowerCase().includes(searchTarget)) ||
      (order.vendor?.vendorName && order.vendor.vendorName.toLowerCase().includes(searchTarget));

    const orderStatus = order.status ? order.status.toUpperCase() : "PENDING";
    const matchesStatus = statusFilter === "All" || orderStatus === statusFilter.toUpperCase();
    
    return matchesSearch && matchesStatus;
  });

  // Calculate live summary indicators counters dashboard aggregates from database arrays
  const totalCount = purchaseOrders.length;
  const approvedCount = purchaseOrders.filter(o => o.status?.toUpperCase() === "APPROVED").length;
  const pendingCount = purchaseOrders.filter(o => o.status?.toUpperCase() === "PENDING" || !o.status).length;
  const rejectedCount = purchaseOrders.filter(o => o.status?.toUpperCase() === "REJECTED").length;

  return (
    <AdminLayout pageTitle="Purchase Orders" pageSubtitle="Home > Purchase Orders">
      
      {/* Top Header Navigation Utility Panel */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px", marginTop: "-16px" }}>
        <button 
          onClick={() => navigate("/admin/purchase-orders/add")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "10px 18px",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            border: "none",
            borderRadius: "6px",
            fontWeight: "600",
            fontSize: "13px",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(37, 99, 235, 0.15)",
            transition: "background-color 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1d4ed8"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add</span>
          Create Purchase Order
        </button>
      </div>

      {/* ==================== TOP COUNTERS METRICS BLOCK ==================== */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "24px" }}>
        
        {/* Total Orders */}
        <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "42px", height: "42px", backgroundColor: "#eef2ff", color: "#4f46e5", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>assignment</span>
          </div>
          <div>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block" }}>Total Orders</span>
            <strong style={{ fontSize: "20px", color: "#0f172a" }}>{totalCount}</strong>
          </div>
        </div>

        {/* Approved */}
        <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "42px", height: "42px", backgroundColor: "#f0fdf4", color: "#16a34a", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>check_circle</span>
          </div>
          <div>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block" }}>Approved</span>
            <strong style={{ fontSize: "20px", color: "#0f172a" }}>{approvedCount}</strong>
          </div>
        </div>

        {/* Pending */}
        <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "42px", height: "42px", backgroundColor: "#fffbeb", color: "#d97706", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>pending</span>
          </div>
          <div>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block" }}>Pending</span>
            <strong style={{ fontSize: "20px", color: "#0f172a" }}>{pendingCount}</strong>
          </div>
        </div>

        {/* Rejected */}
        <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "42px", height: "42px", backgroundColor: "#fef2f2", color: "#dc2626", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>cancel</span>
          </div>
          <div>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block" }}>Rejected</span>
            <strong style={{ fontSize: "20px", color: "#0f172a" }}>{rejectedCount}</strong>
          </div>
        </div>

      </div>

      {/* ==================== MAIN PURCHASE ORDER CARD LIST TABLE ==================== */}
      <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "20px", boxSizing: "border-box" }}>
        
        {/* DATA UTILITIES CONTROL ROW ACTION BAR */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "20px", flexWrap: "wrap" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Purchase Orders List</h3>
          
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <input type="text" placeholder="Search PO, Vendor, Employee..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: "8px 12px", fontSize: "13px", border: "1px solid #cbd5e1", borderRadius: "6px", outline: "none", minWidth: "220px" }} />
            
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: "8px 12px", fontSize: "13px", border: "1px solid #cbd5e1", borderRadius: "6px", outline: "none", backgroundColor: "#fff", cursor: "pointer" }}>
              <option value="All">Status: All</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>

            <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px", color: "#334155" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#64748b" }}>calendar_today</span>
              <span>{dateRange}</span>
            </div>

            <button onClick={loadPurchaseOrders} style={{ padding: "8px", border: "1px solid #cbd5e1", borderRadius: "6px", backgroundColor: "#ffffff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} title="Sync Database Data">
              <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#64748b" }}>refresh</span>
            </button>
          </div>
        </div>

        {apiError && (
          <div style={{ padding: "12px 16px", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "6px", color: "#991b1b", marginBottom: "20px", fontSize: "13.5px", fontWeight: "600" }}>
            {apiError}
          </div>
        )}

        {/* DATA TABLE BLOCK */}
        <div style={{ overflowX: "auto", margin: "0 -20px" }}>
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#64748b", fontWeight: "600" }}>
              <div style={{ width: "24px", height: "24px", border: "3px solid #cbd5e1", borderTopColor: "#2563eb", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite", marginRight: "10px", verticalAlign: "middle" }}></div>
              <span>Fetching live transactional rows from database...</span>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
                  <th style={{ padding: "12px 20px", color: "#475569", fontWeight: "600" }}>PO Number ⇅</th>
                  <th style={{ padding: "12px 12px", color: "#475569", fontWeight: "600" }}>Vendor ⇅</th>
                  <th style={{ padding: "12px 12px", color: "#475569", fontWeight: "600" }}>Employee ⇅</th>
                  <th style={{ padding: "12px 12px", color: "#475569", fontWeight: "600" }}>Order Date ⇅</th>
                  <th style={{ padding: "12px 12px", color: "#475569", fontWeight: "600" }}>Expected Delivery ⇅</th>
                  <th style={{ padding: "12px 12px", color: "#475569", fontWeight: "600" }}>Status ⇅</th>
                  <th style={{ padding: "12px 12px", color: "#475569", fontWeight: "600" }}>Total Amount ⇅</th>
                  <th style={{ padding: "12px 20px", color: "#475569", fontWeight: "600", textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order, i) => {
                    const statusStr = order.status ? order.status.toUpperCase() : "PENDING";
                    
                    const displayAmt = typeof order.grandTotal === "number" 
                      ? `₹${order.grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` 
                      : "₹0.00";

                    const displayVendor = order.vendorName || "N/A";
                    const displayEmployee = order.employeeName || "Unassigned";
                    const displayDeliveryDate = order.expectedDeliveryDate || "N/A";

                    let badgeClass = "badge-warning";
                    if (statusStr === "APPROVED") badgeClass = "badge-active";
                    else if (statusStr === "REJECTED" || statusStr === "CANCELLED") badgeClass = "badge-inactive";

                    return (
                      <tr key={order.id || i} style={{ borderBottom: "1px solid #f1f5f9", verticalAlign: "middle" }}>
                        <td 
                          onClick={() => navigate(`/admin/purchase-orders/view/${order.id}`)} 
                          style={{ padding: "14px 20px", fontWeight: "600", color: "#2563eb", cursor: "pointer" }}
                        >
                          {order.poNumber}
                        </td>
                        <td style={{ padding: "14px 12px", color: "#0f172a", fontWeight: "500" }}>{displayVendor}</td>
                        <td style={{ padding: "14px 12px", color: "#334155" }}>{displayEmployee}</td>
                        <td style={{ padding: "14px 12px", color: "#64748b" }}>{order.orderDate}</td>
                        <td style={{ padding: "14px 12px", color: "#64748b" }}>{displayDeliveryDate}</td>
                        <td style={{ padding: "14px 12px" }}>
                          <span 
                            className={`badge-status-pill ${badgeClass}`} 
                            style={{ 
                              padding: "4px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "700",
                              backgroundColor: statusStr === "APPROVED" ? "#f0fdf4" : statusStr === "PENDING" ? "#fffbeb" : "#fef2f2",
                              color: statusStr === "APPROVED" ? "#16a34a" : statusStr === "PENDING" ? "#d97706" : "#ef4444",
                              display: "inline-block"
                            }}
                          >
                            {statusStr}
                          </span>
                        </td>
                        <td style={{ padding: "14px 12px", fontWeight: "700", color: "#0f172a" }}>{displayAmt}</td>
                        
                        <td style={{ padding: "14px 20px" }}>
                          <div style={{ display: "flex", gap: "14px", justifyContent: "center", alignItems: "center" }}>
                            {/* 👁️ VIEW ICON */}
                            <button onClick={() => navigate(`/admin/purchase-orders/view/${order.id}`)} style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", padding: 0 }} title="View Details">
                              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>visibility</span>
                            </button>
                            
                            {/* ✏️ EDIT ICON: 🚀 FIXED - Hamesha har haal mein render hoga, bina status check ke! */}
                            <button 
                              onClick={() => navigate(`/admin/purchase-orders/edit/${order.id}`)} 
                              style={{ background: "none", border: "none", color: "#d97706", cursor: "pointer", padding: 0 }} 
                              title="Edit Record"
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>edit</span>
                            </button>

                            {/* CONDITIONAL APPROVE/REJECT TEXT BADGES FOR TRACKING VIEWS ONLY */}
                            {statusStr === "PENDING" ? (
                              <>
                                <button 
                                  onClick={() => openConfirmationModal(order.id, "APPROVED")} 
                                  style={{ background: "none", border: "none", color: "#16a34a", cursor: "pointer", padding: 0, display: "inline-flex" }} 
                                  title="Approve Purchase Order"
                                >
                                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>check_circle</span>
                                </button>
                                <button 
                                  onClick={() => openConfirmationModal(order.id, "REJECTED")} 
                                  style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", padding: 0, display: "inline-flex" }} 
                                  title="Reject Purchase Order"
                                >
                                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>cancel</span>
                                </button>
                              </>
                            ) : (
                              <>
                                {statusStr === "APPROVED" && (
                                  <span className="text-success fw-semibold small d-flex align-items-center gap-1" style={{ fontSize: "11.5px" }}><span className="material-symbols-outlined" style={{ fontSize: "14px" }}>done</span>Approved</span>
                                )}
                                {statusStr === "REJECTED" && (
                                  <span className="text-danger fw-semibold small d-flex align-items-center gap-1" style={{ fontSize: "11.5px" }}><span className="material-symbols-outlined" style={{ fontSize: "14px" }}>close</span>Rejected</span>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" style={{ padding: "24px", textAlign: "center", color: "#64748b" }}>No purchase orders found in the system.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* PAGINATION CONTROLS FOOTER BLOCK */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", flexWrap: "wrap", gap: "12px", fontSize: "13px", color: "#64748b" }}>
          <span>Showing 1 to {filteredOrders.length} of {purchaseOrders.length} entries</span>
          
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <button style={{ padding: "6px 12px", border: "1px solid #e2e8f0", backgroundColor: "#fff", borderRadius: "6px", cursor: "pointer", color: "#94a3b8" }} disabled>Previous</button>
              <button style={{ padding: "6px 12px", border: "none", backgroundColor: "#2563eb", color: "#fff", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}>1</button>
              <button style={{ padding: "6px 12px", border: "1px solid #e2e8f0", backgroundColor: "#fff", borderRadius: "6px", cursor: "pointer" }}>2</button>
              <button style={{ padding: "6px 12px", border: "1px solid #e2e8f0", backgroundColor: "#fff", borderRadius: "6px", cursor: "pointer" }}>3</button>
              <span style={{ padding: "0 4px" }}>...</span>
              <button style={{ padding: "6px 12px", border: "1px solid #e2e8f0", backgroundColor: "#fff", borderRadius: "6px", cursor: "pointer" }}>18</button>
              <button style={{ padding: "6px 12px", border: "1px solid #e2e8f0", backgroundColor: "#fff", borderRadius: "6px", cursor: "pointer" }}>Next</button>
            </div>

            <select style={{ padding: "6px 8px", border: "1px solid #cbd5e1", borderRadius: "6px", backgroundColor: "#fff" }}>
              <option value="10">10 / page</option>
              <option value="25">25 / page</option>
              <option value="50">50 / page</option>
            </select>
          </div>
        </div>

      </div>

      {/* SCREEN-CENTER INTEGRATED INLINE MODAL OVERLAY */}
      {modalConfig.show && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(4px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 }}>
          <div className="bg-white border rounded shadow-lg" style={{ width: "100%", maxWidth: "440px", overflow: "hidden", borderRadius: "10px" }}>
            
            <div className="px-4 py-3 border-bottom d-flex align-items-center justify-content-between" style={{ backgroundColor: "#f8fafc" }}>
              <h6 className="m-0 fw-bold text-dark" style={{ fontSize: "15px" }}>
                {modalConfig.targetStatus === "APPROVED" ? "Approve Confirmation" : "Reject Confirmation"}
              </h6>
              <button type="button" className="btn-close" onClick={() => setModalConfig(prev => ({ ...prev, show: false }))} style={{ fontSize: "12px", border: "none", background: "none", outline: "none" }}>×</button>
            </div>

            <div className="p-4 text-center">
              <div style={{ 
                width: "56px", height: "56px", 
                backgroundColor: modalConfig.targetStatus === "APPROVED" ? "#f0fdf4" : "#fef2f2", 
                color: modalConfig.targetStatus === "APPROVED" ? "#16a34a" : "#dc2626", 
                borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px auto" 
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: "32px" }}>
                  {modalConfig.targetStatus === "APPROVED" ? "verified_user" : "gavel"}
                </span>
              </div>
              <p className="text-dark fw-medium mb-1" style={{ fontSize: "14.5px" }}>{modalConfig.message}</p>
              <small className="text-muted d-block px-2">This transition will directly sync records parameters across live database layers instantly.</small>
            </div>

            <div className="px-4 py-3 bg-light border-top d-flex justify-content-end gap-2">
              <button 
                type="button" 
                className="btn btn-sm btn-outline-secondary px-3" 
                onClick={() => setModalConfig(prev => ({ ...prev, show: false }))}
                style={{ fontSize: "13px", fontWeight: "600", borderRadius: "6px" }}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className={`btn btn-sm px-3 text-white`}
                onClick={handleConfirmStatusChange}
                style={{ fontSize: "13px", fontWeight: "600", borderRadius: "6px", backgroundColor: modalConfig.targetStatus === "APPROVED" ? "#16a34a" : "#dc2626", borderColor: modalConfig.targetStatus === "APPROVED" ? "#16a34a" : "#dc2626" }}
              >
                {modalConfig.targetStatus === "APPROVED" ? "Yes" : "Reject"}
              </button>
            </div>

          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default PurchaseOrderList;