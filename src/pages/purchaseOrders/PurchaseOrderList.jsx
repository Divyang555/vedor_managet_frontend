import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import purchaseOrderService from "../../services/purchaseOrderService";

const PurchaseOrderList = () => {
  const navigate = useNavigate();

  // Dynamic Database Data States
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  // States for Filter & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateRange, setDateRange] = useState("01/05/2025 - 31/05/2025");

  // Fetch metrics data dynamically from database on mount
  const loadPurchaseOrders = async () => {
    try {
      setLoading(true);
      setApiError("");
      const response = await purchaseOrderService.getAllPurchaseOrders();
      
      // FIXED BOUNDARIES: Fallback safe parsing to completely prevent .filter() white screen crash
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
  const rejectedCount = purchaseOrders.filter(o => o.status?.toUpperCase() === "REJECTED" || o.status?.toUpperCase() === "CANCELLED").length;

  return (
    <AdminLayout pageTitle="Purchase Orders" pageSubtitle="Home > Purchase Orders">
      
      {/* FIXED: Top Header Navigation Utility Panel with matching Blue Create Button design overlay */}
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
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
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
             {/* PurchaseOrderList.jsx ke andar <tbody> mapping block ko is tarah link karein */}
<tbody>
  {filteredOrders.length > 0 ? (
    filteredOrders.map((order, i) => {
      // 1. Status String Mapping
      const statusStr = order.status ? order.status.toUpperCase() : "PENDING";
      
      // 2. FIXED: Backend se direct order.grandTotal field aa rahi hai 
      const displayAmt = typeof order.grandTotal === "number" 
        ? `₹${order.grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` 
        : "₹0.00";

      // 3. FIXED: Mapped with clean flat string keys directly fetched from PurchaseOrderResponse DTO
      const displayVendor = order.vendorName || "N/A";
      const displayEmployee = order.employeeName || "Unassigned";
      
      // 4. Expected Delivery Parameter
      const displayDeliveryDate = order.expectedDeliveryDate || "N/A";

      return (
        <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
          <td 
            onClick={() => navigate(`/admin/purchase-orders/view/${order.poNumber}`)} 
            style={{ padding: "14px 20px", fontWeight: "600", color: "#2563eb", cursor: "pointer" }}
          >
            {order.poNumber}
          </td>
          <td style={{ padding: "14px 12px", color: "#0f172a", fontWeight: "500" }}>{displayVendor}</td>
          <td style={{ padding: "14px 12px", color: "#334155" }}>{displayEmployee}</td>
          <td style={{ padding: "14px 12px", color: "#64748b" }}>{order.orderDate}</td>
          <td style={{ padding: "14px 12px", color: "#64748b" }}>{displayDeliveryDate}</td>
          <td style={{ padding: "14px 12px" }}>
            <span className={`badge-status-pill ${statusStr === "APPROVED" ? "badge-active" : statusStr === "PENDING" ? "badge-warning" : "badge-inactive"}`} style={{ padding: "4px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "700" }}>
              {statusStr}
            </span>
          </td>
          <td style={{ padding: "14px 12px", fontWeight: "700", color: "#0f172a" }}>{displayAmt}</td>
          <td style={{ padding: "14px 20px", textAlign: "center" }}>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
              <button onClick={() => navigate(`/admin/purchase-orders/view/${order.poNumber}`)} style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", padding: 0 }} title="View Details"><span className="material-symbols-outlined" style={{ fontSize: "18px" }}>visibility</span></button>
              <button style={{ background: "none", border: "none", color: "#059669", cursor: "pointer", padding: 0 }} title="Edit"><span className="material-symbols-outlined" style={{ fontSize: "18px" }}>edit</span></button>
              <button style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: 0 }} title="More Actions"><span className="material-symbols-outlined" style={{ fontSize: "18px" }}>more_vert</span></button>
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

        {/* ==================== PAGINATION CONTROLS FOOTER BLOCK ==================== */}
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
    </AdminLayout>
  );
};

export default PurchaseOrderList;