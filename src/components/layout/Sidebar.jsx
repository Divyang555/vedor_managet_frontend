import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  // Helper check function to highlight active tab gracefully
  const isActive = (path) => (location.pathname.startsWith(path) ? "active" : "");

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-box">
          <span className="material-symbols-outlined">dataset</span>
        </div>
        <div className="brand-text">
          <h1>ProcureManage</h1>
          <p>Vendor Management System</p>
        </div>
      </div>
      
      <div className="sidebar-menu-wrapper">
        <p className="menu-category-title">MANAGEMENT</p>
        <nav className="nav-section">
          <Link className={`nav-item ${location.pathname === "/admin/dashboard" ? "active" : ""}`} to="/admin/dashboard">
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </Link>
          <a className="nav-item" href="#employees">
            <span className="material-symbols-outlined">group</span>
            Employees
          </a>
          
          {/* Linked directly to vendor module base endpoints route */}
          <Link className={`nav-item ${isActive("/vendors")}`} to="/vendors">
            <span className="material-symbols-outlined">store</span>
            Vendors
          </Link>
          
          {/* FIXED: Linked to your new Purchase Order Dashboard route with active state tracker */}
          <Link className={`nav-item ${isActive("/admin/purchase-orders")}`} to="/admin/purchase-orders">
            <span className="material-symbols-outlined">shopping_cart</span>
            Purchase Orders
          </Link>

          <a className="nav-item" href="#invoices">
            <span className="material-symbols-outlined">description</span>
            Invoices
          </a>
          <a className="nav-item" href="#payments">
            <span className="material-symbols-outlined">payments</span>
            Payments
          </a>
          <a className="nav-item" href="#deliveries">
            <span className="material-symbols-outlined">local_shipping</span>
            Deliveries
          </a>
        </nav>

        <p className="menu-category-title">REPORTS</p>
        <nav className="nav-section">
          <a className="nav-item" href="#analytics">
            <span className="material-symbols-outlined">analytics</span>
            Reports &amp; Analytics
          </a>
          <a className="nav-item" href="#performance">
            <span className="material-symbols-outlined">trending_up</span>
            Vendor Performance
          </a>
        </nav>

        <p className="menu-category-title">SYSTEM</p>
        <nav className="nav-section">
          <a className="nav-item" href="#settings">
            <span className="material-symbols-outlined">settings</span>
            Settings
          </a>
          <a className="nav-item" href="#profile">
            <span className="material-symbols-outlined">person</span>
            Profile
          </a>
          <a className="nav-item" href="#logout">
            <span className="material-symbols-outlined">logout</span>
            Logout
          </a>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;