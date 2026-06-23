import React from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";

const PurchaseOrderDashboard = () => {
  const navigate = useNavigate();

  // Static placeholder metrics matching screenshot data logs
  const ordersLog = [
    { id: "PO-2026-00120", vendor: "Yash Solutions", date: "19 Jun 2026", amount: "₹1,25,000", status: "Approved" },
    { id: "PO-2026-00119", vendor: "Global Traders", date: "18 Jun 2026", amount: "₹85,500", status: "Pending" },
    { id: "PO-2026-00118", vendor: "SK Industries", date: "18 Jun 2026", amount: "₹45,000", status: "Approved" },
    { id: "PO-2026-00117", vendor: "Mehta Enterprises", date: "17 Jun 2026", amount: "₹75,000", status: "Pending" },
    { id: "PO-2026-00116", vendor: "Sharma & Co.", date: "17 Jun 2026", amount: "₹65,000", status: "Cancelled" },
  ];

  return (
    <AdminLayout 
      pageTitle="Purchase Order Dashboard" 
      pageSubtitle="Dashboard / Purchase Orders"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%", boxSizing: "border-box" }}>
        
        {/* FIXED: Dynamic Navigation Header Action Button Element */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-16px", marginBottom: "4px" }}>
          <button 
            onClick={() => navigate("/admin/purchase-orders/add")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 18px",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(37, 99, 235, 0.15)",
              transition: "background-color 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1d4ed8"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>add</span>
            Add Purchase Order
          </button>
        </div>

        {/* ==================== 1. COUNTER METRIC CARDS ROW ==================== */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
          
          {/* Total Orders Card */}
          <div style={{ backgroundColor: "#faf5ff", border: "1px solid #f3e8ff", borderRadius: "12px", padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "48px", height: "48px", backgroundColor: "#e9d5ff", color: "#6b21a8", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>description</span>
            </div>
            <div>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#6b7280", display: "block", marginBottom: "4px" }}>Total Orders</span>
              <h3 style={{ margin: 0, fontSize: "24px", fontWeight: "700", color: "#111827" }}>120</h3>
            </div>
          </div>

          {/* Pending Orders Card */}
          <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #dcfce7", borderRadius: "12px", padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "48px", height: "48px", backgroundColor: "#bbf7d0", color: "#166534", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>shopping_cart</span>
            </div>
            <div>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#6b7280", display: "block", marginBottom: "4px" }}>Pending Orders</span>
              <h3 style={{ margin: 0, fontSize: "24px", fontWeight: "700", color: "#111827" }}>45</h3>
            </div>
          </div>

          {/* Approved Orders Card */}
          <div style={{ backgroundColor: "#fffbeb", border: "1px solid #fef3c7", borderRadius: "12px", padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "48px", height: "48px", backgroundColor: "#fde68a", color: "#92400e", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>local_shipping</span>
            </div>
            <div>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#6b7280", display: "block", marginBottom: "4px" }}>Approved Orders</span>
              <h3 style={{ margin: 0, fontSize: "24px", fontWeight: "700", color: "#111827" }}>50</h3>
            </div>
          </div>

          {/* Cancelled Orders Card */}
          <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fee2e2", borderRadius: "12px", padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "48px", height: "48px", backgroundColor: "#fecaca", color: "#991b1b", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>cancel</span>
            </div>
            <div>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#6b7280", display: "block", marginBottom: "4px" }}>Cancelled Orders</span>
              <h3 style={{ margin: 0, fontSize: "24px", fontWeight: "700", color: "#111827" }}>25</h3>
            </div>
          </div>

        </div>

        {/* ==================== 2. TWO-COLUMN ANALYTICS BLOCKS ROW ==================== */}
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", width: "100%" }}>
          
          {/* Left Block: Recent Purchase Orders Table */}
          <div style={{ flex: "2 1 500px", backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", boxSizing: "border-box" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", margin: "0 0 16px 0" }}>Recent Purchase Orders</h3>
            
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <th style={{ padding: "12px 8px", color: "#4b5563", fontWeight: "600" }}>PO Number</th>
                    <th style={{ padding: "12px 8px", color: "#4b5563", fontWeight: "600" }}>Vendor Name</th>
                    <th style={{ padding: "12px 8px", color: "#4b5563", fontWeight: "600" }}>Order Date</th>
                    <th style={{ padding: "12px 8px", color: "#4b5563", fontWeight: "600" }}>Amount</th>
                    <th style={{ padding: "12px 8px", color: "#4b5563", fontWeight: "600" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersLog.map((order, index) => (
                    <tr key={index} style={{ borderBottom: index !== ordersLog.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                      <td style={{ padding: "14px 8px", fontWeight: "500", color: "#4b5563" }}>{order.id}</td>
                      <td style={{ padding: "14px 8px", fontWeight: "600", color: "#111827" }}>{order.vendor}</td>
                      <td style={{ padding: "14px 8px", color: "#6b7280" }}>{order.date}</td>
                      <td style={{ padding: "14px 8px", fontWeight: "600", color: "#111827" }}>{order.amount}</td>
                      <td style={{ padding: "14px 8px" }}>
                        <span className={`badge-status-pill ${
                          order.status === "Approved" ? "badge-active" : order.status === "Pending" ? "badge-warning" : "badge-inactive"
                        }`} style={{ padding: "4px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "600" }}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer View All Trigger Action */}
            <div style={{ marginTop: "16px", display: "flex" }}>
              <a href="/admin/purchase-orders/list" style={{ color: "#2563eb", textDecoration: "none", fontSize: "13px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
                View All Orders <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_right_alt</span>
              </a>
            </div>
          </div>

          {/* Right Block: Purchase Order Status Distribution Donut */}
          <div style={{ flex: "1 1 300px", backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", boxSizing: "border-box" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", margin: "0 0 24px 0" }}>Purchase Order Status</h3>
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px", flexWrap: "wrap", height: "100%" }}>
              
              {/* CSS Native Segment Donut Layout Mapping Layer */}
              <div style={{ position: "relative", width: "140px", height: "140px", borderRadius: "50%", background: "conic-gradient(#22c55e 0% 41.7%, #eab308 41.7% 79.2%, #ef4444 79.2% 100%)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
                <div style={{ width: "96px", height: "96px", backgroundColor: "#ffffff", borderRadius: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "22px", fontWeight: "800", color: "#111827" }}>120</span>
                  <span style={{ fontSize: "11px", color: "#9ca3af", fontWeight: "600", marginTop: "2px" }}>Total</span>
                </div>
              </div>

              {/* Legends Label Metadata Stack */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1, minWidth: "120px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#4b5563", fontWeight: "500" }}>
                    <span style={{ width: "8px", height: "8px", backgroundColor: "#22c55e", borderRadius: "50%" }}></span>
                    Approved
                  </div>
                  <strong style={{ color: "#111827" }}>50 (41.7%)</strong>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#4b5563", fontWeight: "500" }}>
                    <span style={{ width: "8px", height: "8px", backgroundColor: "#eab308", borderRadius: "50%" }}></span>
                    Pending
                  </div>
                  <strong style={{ color: "#111827" }}>45 (37.5%)</strong>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#4b5563", fontWeight: "500" }}>
                    <span style={{ width: "8px", height: "8px", backgroundColor: "#ef4444", borderRadius: "50%" }}></span>
                    Cancelled
                  </div>
                  <strong style={{ color: "#111827" }}>25 (20.8%)</strong>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </AdminLayout>
  );
};

export default PurchaseOrderDashboard;