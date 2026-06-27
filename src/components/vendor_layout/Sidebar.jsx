import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => (location.pathname.startsWith(path) ? "active" : "");

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-box">
          <span className="material-symbols-outlined">store</span>
        </div>
        <div className="brand-text">
          <h1>Vendor Portal</h1>
          <p>ProcureManage ERP</p>
        </div>
      </div>
      
      <div className="sidebar-menu-wrapper">
        <p className="menu-category-title">OPERATIONS</p>
        <nav className="nav-section">
          
          {/* Vendor Dashboard Node */}
          <Link className={`nav-item ${location.pathname === "/vendor/dashboard" ? "active" : ""}`} to="/vendor/dashboard">
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </Link>
          
          {/* 🚀 FIXED TARGET LINK: Now securely pointing to navigate and open the Purchase Orders system page structure */}
          <Link className={`nav-item ${isActive("/vendor/purchase-orders")}`} to="/vendor/purchase-orders/list">
            <span className="material-symbols-outlined">shopping_bag</span>
            My Purchase Orders
          </Link>

          {/* Invoices uploaded by this Vendor */}
          <Link className={`nav-item ${isActive("/vendor/invoices")}`} to="/vendor/invoices/list">
            <span className="material-symbols-outlined">description</span>
            My Invoices
          </Link>
          
          {/* Supply chain dispatch tracking */}
          <Link className={`nav-item ${isActive("/vendor/deliveries")}`} to="/vendor/deliveries/list">
            <span className="material-symbols-outlined">local_shipping</span>
            Shipments &amp; Delivery
          </Link>
        </nav>

        <p className="menu-category-title">FINANCIALS</p>
        <nav className="nav-section">
          <Link className={`nav-item ${isActive("/vendor/payments")}`} to="/vendor/payments/list">
            <span className="material-symbols-outlined">payments</span>
            Payment History
          </Link>
        </nav>

        <p className="menu-category-title">ACCOUNT SYSTEM</p>
        <nav className="nav-section">
          <Link className={`nav-item ${isActive("/vendor/profile")}`} to="/vendor/profile">
            <span className="material-symbols-outlined">account_box</span>
            Company Profile
          </Link>
          
          <Link className={`nav-item ${isActive("/vendor/settings")}`} to="/vendor/settings">
            <span className="material-symbols-outlined">settings</span>
            Settings
          </Link>
          
          <button 
            className="nav-item border-0 text-start w-100 bg-transparent" 
            onClick={handleLogout}
            style={{ padding: "inherit", cursor: "pointer", outline: "none" }}
          >
            <span className="material-symbols-outlined" style={{ color: "#ef4444" }}>logout</span>
            <span style={{ color: "#ef4444" }}>Logout</span>
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;