import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import axios from "axios";
import VendorBarChart from "../../components/VendorBarChart";
import OutlayChart from "../../components/OutlayChart"; 
import StatusChart from "../../components/StatusChart";

const AdminDashboard = () => {
  const DASHBOARD_API = "http://localhost:8080/admin/dashboard";

  // State Management
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  // Token Config Helper
  const getRequestConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        ...(token && token !== "null" ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json"
      }
    };
  };

  // Fetch Dashboard API
  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      try {
        setLoading(true);
        setApiError("");
        const response = await axios.get(DASHBOARD_API, getRequestConfig());
        
        console.log("🚀 Live Server Dashboard Response Data:", response.data);
        
        if (response.data) {
          const rawData = response.data.data || response.data;
          setDashboardData(rawData);
        }
      } catch (err) {
        console.error("Dashboard fetch error: ", err);
        setApiError("Unable to load dashboard records from the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardMetrics();
  }, []);

  const metrics = dashboardData || {};
  const recentOrdersList = metrics.recentOrders || [];
  const pendingPaymentList = metrics.pendingPaymentList || [];

  // Helper utility to format raw API dates (YYYY-MM-DD) to exact (DD/MM/YYYY)
  const formatDueDate = (dateString) => {
    if (!dateString) return "—";
    try {
      const parts = dateString.split("-");
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return dateString;
    } catch (e) {
      return dateString;
    }
  };

  return (
    <AdminLayout 
      pageTitle="Admin Dashboard" 
      pageSubtitle="Welcome back, Admin! Here's what's happening with your procurement system."
    >
      
      <div className="dashboard-header" style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0px", marginTop: "-20px" }}>
        <div className="header-buttons">
          <button className="btn btn-secondary date-picker-btn">
            <span className="material-symbols-outlined">calendar_today</span>
            22 May 2024
            <span className="material-symbols-outlined dropdown-arrow">expand_more</span>
          </button>
        </div>
      </div>

      {apiError && (
        <div className="alert alert-danger py-2 px-3 fw-semibold small mb-3 rounded-3" style={{ fontSize: "13px" }}>
          {apiError}
        </div>
      )}

      {/* Metric Cards Top Grid - EXACT 6 BOXES */}
      <div className="metric-grid" style={{ marginTop: "0px" }}>
        
        {/* 1. Total Vendors */}
        <div className="card metric-card">
          <div className="metric-flex-box">
            <div className="metric-icon-wrapper circle-blue">
              <span className="material-symbols-outlined">group</span>
            </div>
            <div className="metric-content">
              <p className="metric-label">Total Vendors</p>
              <h2 className="metric-value" style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                {loading ? "..." : (metrics.totalVendors ?? 0)}
              </h2>
            </div>
          </div>
          <span className="trend-badge trend-up">
            <span className="material-symbols-outlined">arrow_upward</span> 12.5% <span className="trend-lbl">from last month</span>
          </span>
        </div>

        {/* 2. Total Employees */}
        <div className="card metric-card">
          <div className="metric-flex-box">
            <div className="metric-icon-wrapper circle-green">
              <span className="material-symbols-outlined">person</span>
            </div>
            <div className="metric-content">
              <p className="metric-label">Total Employees</p>
              <h2 className="metric-value" style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                {loading ? "..." : (metrics.totalEmployees ?? 0)}
              </h2>
            </div>
          </div>
          <span className="trend-badge trend-up">
            <span className="material-symbols-outlined">arrow_upward</span> 8.3% <span className="trend-lbl">from last month</span>
          </span>
        </div>

        {/* 3. Total Orders */}
        <div className="card metric-card">
          <div className="metric-flex-box">
            <div className="metric-icon-wrapper circle-orange">
              <span className="material-symbols-outlined">shopping_cart</span>
            </div>
            <div className="metric-content">
              <p className="metric-label">Total Orders</p>
              <h2 className="metric-value" style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                {loading ? "..." : (metrics.totalPurchaseOrders ?? 0)}
              </h2>
            </div>
          </div>
          <span className="trend-badge trend-up">
            <span className="material-symbols-outlined">arrow_upward</span> 15.2% <span className="trend-lbl">from last month</span>
          </span>
        </div>

        {/* 4. Pending Orders */}
        <div className="card metric-card">
          <div className="metric-flex-box">
            <div className="metric-icon-wrapper circle-purple">
              <span className="material-symbols-outlined">description</span>
            </div>
            <div className="metric-content">
              <p className="metric-label">Pending Orders</p>
              <h2 className="metric-value" style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                {loading ? "..." : (metrics.pendingOrders ?? 0)}
              </h2>
            </div>
          </div>
          <span className="trend-badge trend-down">
            <span className="material-symbols-outlined">arrow_downward</span> 7.4% <span className="trend-lbl">from last month</span>
          </span>
        </div>

        {/* 5. Pending Payments */}
        <div className="card metric-card">
          <div className="metric-flex-box">
            <div className="metric-icon-wrapper circle-red">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <div className="metric-content">
              <p className="metric-label">Pending Payments</p>
              <h2 className="metric-value" style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                {loading ? "..." : (metrics.pendingPayments ?? 0)}
              </h2>
            </div>
          </div>
          <span className="trend-badge trend-down">
            <span className="material-symbols-outlined">arrow_downward</span> 10.6% <span className="trend-lbl">from last month</span>
          </span>
        </div>

        {/* 6. Monthly Expenses */}
        <div className="card metric-card">
          <div className="metric-flex-box">
            <div className="metric-icon-wrapper circle-teal">
              <span className="material-symbols-outlined">account_balance_wallet</span>
            </div>
            <div className="metric-content">
              <p className="metric-label">Monthly Expenses</p>
              <h2 className="metric-value" style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                {loading ? "..." : `₹${parseFloat(metrics.monthlyExpenses ?? 0).toLocaleString("en-IN")}`}
              </h2>
            </div>
          </div>
          <span className="trend-badge trend-up">
            <span className="material-symbols-outlined">arrow_upward</span> 11.3% <span className="trend-lbl">from last month</span>
          </span>
        </div>
      </div>

      {/* Middle Row Section Grid */}
      <div className="dashboard-row-grid grid-3-columns">
        <div className="card chart-card">
          <div className="card-header">
            <h3>Vendor Performance Overview</h3>
            <button className="filter-dropdown-btn">This Month <span className="material-symbols-outlined">expand_more</span></button>
          </div>
          <div className="chart-wrapper-box">
            {loading ? (
              <div className="p-4 text-center text-muted small mt-5">Loading performance data...</div>
            ) : !loading && (!metrics.vendorPerformance || metrics.vendorPerformance.length === 0) ? (
              <div className="p-4 text-center text-secondary small mt-5 fw-semibold">No Vendor Performance Data Available</div>
            ) : (
              <VendorBarChart performanceData={metrics.vendorPerformance} />
            )}
          </div>
        </div>

        {/* Recent Purchase Orders Table Block */}
        <div className="card table-card-block">
          <div className="card-header">
            <h3>Recent Purchase Orders</h3>
            <a className="view-all-link" href="#">View All</a>
          </div>
          <div className="table-responsive-box">
            {loading ? (
              <div className="p-4 text-center text-muted small">Loading records summary...</div>
            ) : (
              <table className="dashboard-data-table">
                <thead>
                  <tr>
                    <th>PO Number</th>
                    <th>Vendor</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrdersList.length > 0 ? (
                    recentOrdersList.map((order, index) => {
                      const orderStatus = (order.status || "Pending").toLowerCase();
                      let statusPill = "pill-warning";
                      if (orderStatus === "approved" || orderStatus === "delivered") statusPill = "pill-success";
                      else if (orderStatus === "shipped") statusPill = "pill-primary";

                      return (
                        <tr key={order.id || index}>
                          <td className="fw-semibold">{order.poNumber || "—"}</td>
                          <td>{order.vendorName || "—"}</td>
                          <td className="font-monospace fw-bold">₹{parseFloat(order.amount || 0).toLocaleString("en-IN")}</td>
                          <td><span className={`badge-pill ${statusPill}`}>{order.status || "Pending"}</span></td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center p-3 text-muted">No recent purchase orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* DOUGHNUT CHART CARD SECTION */}
        <div className="card chart-card">
          <div className="card-header">
            <h3>Order Status Distribution</h3>
          </div>
          <div className="chart-wrapper-box donut-layout-wrapper">
            {loading ? (
              <div className="p-4 text-center text-muted small mt-5">Loading distribution chart...</div>
            ) : (
              <>
                <StatusChart 
                  approved={metrics.approvedOrders ?? 0}
                  pending={metrics.pendingOrders ?? 0}
                  rejected={metrics.rejectedOrders ?? 0}
                />
                <div className="donut-center-info">
                  <span className="donut-value-lbl">{metrics.totalPurchaseOrders ?? 0}</span>
                  <span className="donut-sub-lbl">Total Orders</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Split Row Grid */}
      <div className="dashboard-row-grid grid-2-columns">
        <div className="card chart-card flex-grow-7">
          <div className="card-header">
            <h3>Monthly Expenses Overview</h3>
            <button className="filter-dropdown-btn">This Year <span className="material-symbols-outlined">expand_more</span></button>
          </div>
          <div className="chart-wrapper-box">
            {loading ? (
              <div className="p-4 text-center text-muted small mt-5">Loading expense outlay details...</div>
            ) : !loading && (!metrics.monthlyExpensesChart || metrics.monthlyExpensesChart.length === 0) ? (
              <div className="p-4 text-center text-secondary small mt-5 fw-semibold">No Monthly Expense Data Available</div>
            ) : (
              <OutlayChart chartDataList={metrics.monthlyExpensesChart} />
            )}
          </div>
        </div>

        <div className="bottom-right-stack-wrapper">
          
          {/* 🚀 FIXED: CONNECTED PENDING PAYMENTS TABLE BLOCK */}
          <div className="card ledger-card-block">
            <div className="card-header">
              <h3>Pending Payments</h3>
              <a className="view-all-link" href="#">View All</a>
            </div>
            <div className="table-responsive-box">
              {loading ? (
                <div className="p-4 text-center text-muted small">Loading ledger summary...</div>
              ) : (
                <table className="dashboard-data-table slim-table">
                  <thead>
                    <tr>
                      <th>Vendor</th>
                      <th>Invoice No.</th>
                      <th>Amount</th>
                      <th>Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingPaymentList && pendingPaymentList.length > 0 ? (
                      pendingPaymentList.map((payment, index) => (
                        <tr key={payment.id || index}>
                          <td className="bold-text">{payment.vendorName || "—"}</td>
                          <td className="muted-text">{payment.invoiceNumber || "—"}</td>
                          <td className="bold-text">
                            ₹{parseFloat(payment.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="muted-text">{formatDueDate(payment.dueDate)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center p-4 text-muted fw-medium">
                          No Pending Payments Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="card quick-actions-card">
            <div className="card-header">
              <h3>Quick Actions</h3>
            </div>
            <div className="actions-button-grid">
              <button className="action-tile-btn bg-soft-blue">
                <span className="material-symbols-outlined text-blue">person_add</span>
                <span>Add Vendor</span>
              </button>
              <button className="action-tile-btn bg-soft-green">
                <span className="material-symbols-outlined text-green">group_add</span>
                <span>Add Employee</span>
              </button>
              <button className="action-tile-btn bg-soft-orange">
                <span className="material-symbols-outlined text-orange">note_add</span>
                <span>Create Purchase Order</span>
              </button>
              <button className="action-tile-btn bg-soft-purple">
                <span className="material-symbols-outlined text-purple">bar_chart</span>
                <span>View Reports</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;