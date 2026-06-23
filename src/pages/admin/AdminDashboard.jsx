import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import vendorService from "../../services/vendorService";
import VendorBarChart from "../../components/VendorBarChart";
import OutlayChart from "../../components/OutlayChart"; 
import StatusChart from "../../components/StatusChart";

const AdminDashboard = () => {
  // DYNAMIC STATE COUNTERS
  const [totalVendors, setTotalVendors] = useState(0);
  const [loading, setLoading] = useState(true);

  // FETCH DYNAMIC DATA ON COMPONENT MOUNT
  useEffect(() => {
    vendorService.getTotalVendorsCount()
      .then((data) => {
        // Backend direct long number ya object handle parsing format
        const count = typeof data === "object" ? data.count || 0 : data;
        setTotalVendors(count);
      })
      .catch((err) => {
        console.error("Dashboard total counters fetch error: ", err);
        setTotalVendors(0); // Fallback state metrics
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <AdminLayout 
      pageTitle="Admin Dashboard" 
      pageSubtitle="Welcome back, Admin! Here's what's happening with your procurement system."
    >
     {/* AdminDashboard.jsx ke return block me sabse upar is div ko dekhein aur update karein */}
<div className="dashboard-header" style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0px", marginTop: "-20px" }}>
  {/* marginBottom ko 16px se 0px kar diya aur marginTop ko aur tight kar diya */}
  <div className="header-buttons">
    <button className="btn btn-secondary date-picker-btn">
      <span className="material-symbols-outlined">calendar_today</span>
      22 May 2024
      <span className="material-symbols-outlined dropdown-arrow">expand_more</span>
    </button>
  </div>
</div>

      {/* Metric Cards Top Grid */}
      <div className="metric-grid" style={{ marginTop: "0px" }}>
        
        {/* FIXED: Dynamic Total Vendors State Configuration Card */}
        <div className="card metric-card">
          <div className="metric-flex-box">
            <div className="metric-icon-wrapper circle-blue">
              <span className="material-symbols-outlined">group</span>
            </div>
            <div className="metric-content">
              <p className="metric-label">Total Vendors</p>
              <h2 className="metric-value" style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                {loading ? "..." : totalVendors}
              </h2>
            </div>
          </div>
          <span className="trend-badge trend-up">
            <span className="material-symbols-outlined">arrow_upward</span> 12.5% <span className="trend-lbl">from last month</span>
          </span>
        </div>

        <div className="card metric-card">
          <div className="metric-flex-box">
            <div className="metric-icon-wrapper circle-green">
              <span className="material-symbols-outlined">person</span>
            </div>
            <div className="metric-content">
              <p className="metric-label">Total Employees</p>
              <p className="metric-value">25</p>
            </div>
          </div>
          <span className="trend-badge trend-up">
            <span className="material-symbols-outlined">arrow_upward</span> 8.3% <span className="trend-lbl">from last month</span>
          </span>
        </div>

        <div className="card metric-card">
          <div className="metric-flex-box">
            <div className="metric-icon-wrapper circle-orange">
              <span className="material-symbols-outlined">shopping_cart</span>
            </div>
            <div className="metric-content">
              <p className="metric-label">Total Orders</p>
              <p className="metric-value">150</p>
            </div>
          </div>
          <span className="trend-badge trend-up">
            <span className="material-symbols-outlined">arrow_upward</span> 15.2% <span className="trend-lbl">from last month</span>
          </span>
        </div>

        <div className="card metric-card">
          <div className="metric-flex-box">
            <div className="metric-icon-wrapper circle-purple">
              <span className="material-symbols-outlined">description</span>
            </div>
            <div className="metric-content">
              <p className="metric-label">Pending Orders</p>
              <p className="metric-value">12</p>
            </div>
          </div>
          <span className="trend-badge trend-down">
            <span className="material-symbols-outlined">arrow_downward</span> 7.4% <span className="trend-lbl">from last month</span>
          </span>
        </div>

        <div className="card metric-card">
          <div className="metric-flex-box">
            <div className="metric-icon-wrapper circle-red">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <div className="metric-content">
              <p className="metric-label">Pending Payments</p>
              <p className="metric-value">₹2,10,000</p>
            </div>
          </div>
          <span className="trend-badge trend-down">
            <span className="material-symbols-outlined">arrow_downward</span> 10.6% <span className="trend-lbl">from last month</span>
          </span>
        </div>

        <div className="card metric-card">
          <div className="metric-flex-box">
            <div className="metric-icon-wrapper circle-teal">
              <span className="material-symbols-outlined">account_balance_wallet</span>
            </div>
            <div className="metric-content">
              <p className="metric-label">Monthly Expenses</p>
              <p className="metric-value">₹4,50,000</p>
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
            <VendorBarChart />
          </div>
        </div>

        <div className="card table-card-block">
          <div className="card-header">
            <h3>Recent Purchase Orders</h3>
            <a className="view-all-link" href="#">View All</a>
          </div>
          <div className="table-responsive-box">
            <table className="dashboard-data-table">
              <thead>
                <tr>
                  <th>PO Number</th>
                  <th>Vendor</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>PO-1001</td>
                  <td>Dell India</td>
                  <td>₹50,000</td>
                  <td><span className="badge-pill pill-warning">Pending</span></td>
                  <td>22 May 2024</td>
                </tr>
                <tr>
                  <td>PO-1002</td>
                  <td>HP India</td>
                  <td>₹20,000</td>
                  <td><span className="badge-pill pill-success">Approved</span></td>
                  <td>21 May 2024</td>
                </tr>
                <tr>
                  <td>PO-1003</td>
                  <td>Lenovo India</td>
                  <td>₹35,000</td>
                  <td><span className="badge-pill pill-primary">Shipped</span></td>
                  <td>20 May 2024</td>
                </tr>
                <tr>
                  <td>PO-1004</td>
                  <td>Canon India</td>
                  <td>₹15,000</td>
                  <td><span className="badge-pill pill-warning">Pending</span></td>
                  <td>19 May 2024</td>
                </tr>
                <tr>
                  <td>PO-1005</td>
                  <td>Samsung India</td>
                  <td>₹60,000</td>
                  <td><span className="badge-pill pill-success">Delivered</span></td>
                  <td>18 May 2024</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="card chart-card">
          <div className="card-header">
            <h3>Order Status Distribution</h3>
          </div>
          <div className="chart-wrapper-box donut-layout-wrapper">
            <StatusChart />
            <div className="donut-center-info">
              <span className="donut-value-lbl">150</span>
              <span className="donut-sub-lbl">Total Orders</span>
            </div>
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
            <OutlayChart />
          </div>
        </div>

        <div className="bottom-right-stack-wrapper">
          <div className="card ledger-card-block">
            <div className="card-header">
              <h3>Pending Payments</h3>
              <a className="view-all-link" href="#">View All</a>
            </div>
            <div className="table-responsive-box">
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
                  <tr>
                    <td className="bold-text">Dell India</td>
                    <td className="muted-text">INV-2024-101</td>
                    <td className="bold-text">₹50,000</td>
                    <td className="muted-text">28 May 2024</td>
                  </tr>
                  <tr>
                    <td className="bold-text">HP India</td>
                    <td className="muted-text">INV-2024-102</td>
                    <td className="bold-text">₹30,000</td>
                    <td className="muted-text">30 May 2024</td>
                  </tr>
                  <tr>
                    <td className="bold-text">Lenovo India</td>
                    <td className="muted-text">INV-2024-103</td>
                    <td className="bold-text">₹40,000</td>
                    <td className="muted-text">02 Jun 2024</td>
                  </tr>
                  <tr>
                    <td className="bold-text">Canon India</td>
                    <td className="muted-text">INV-2024-104</td>
                    <td className="bold-text">₹25,000</td>
                    <td className="muted-text">05 Jun 2024</td>
                  </tr>
                  <tr>
                    <td className="bold-text">Samsung India</td>
                    <td className="muted-text">INV-2024-105</td>
                    <td className="bold-text">₹35,000</td>
                    <td className="muted-text">07 Jun 2024</td>
                  </tr>
                </tbody>
              </table>
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
              <button className="action-tile-btn bg-soft-red">
                <span className="material-symbols-outlined text-red">credit_score</span>
                <span>Manage Payments</span>
              </button>
              <button className="action-tile-btn bg-soft-navy">
                <span className="material-symbols-outlined text-navy">settings</span>
                <span>System Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;