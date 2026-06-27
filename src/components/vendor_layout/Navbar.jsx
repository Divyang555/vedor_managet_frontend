import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [dropdownActive, setDropdownActive] = useState(false);
  
  const [vendorData, setVendorData] = useState({
    name: "Supplier Company",
    email: "supplier@vendorcorp.com",
    role: "Authorized Vendor"
  });

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setVendorData({
          name: parsedUser.name || "Supplier Company",
          email: parsedUser.email || "supplier@vendorcorp.com",
          role: parsedUser.role || "Authorized Vendor"
        });
      }
    } catch (error) {
      console.error("Error parsing vendor profile data:", error);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const userInitial = vendorData.name ? vendorData.name.charAt(0).toUpperCase() : "V";

  return (
    <header 
      className="top-navbar" 
      style={{
        height: "70px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #f1f5f9",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxSizing: "border-box"
      }}
    >
      {/* Left Search Bar Container */}
      <div className="search-container" style={{ display: "flex", alignItems: "center", position: "relative" }}>
        <span className="material-symbols-outlined" style={{ position: "absolute", left: "14px", color: "#94a3b8", fontSize: "20px" }}>search</span>
        <input 
          className="search-input" 
          placeholder="Search shipments, orders, invoices..." 
          type="text" 
          style={{ 
            padding: "10px 16px 10px 44px", 
            width: "320px", 
            backgroundColor: "#f8fafc", 
            border: "1px solid #e2e8f0", 
            borderRadius: "24px", 
            fontSize: "14px", 
            outline: "none"
          }}
        />
      </div>
      
      {/* Right Notifications & User Actions Wrapper Strip */}
      <div className="top-actions" style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        
        {/* Notifications */}
        <button className="icon-btn" style={{ background: "none", border: "none", outline: "none", position: "relative", cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center", padding: "4px" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>notifications</span>
          <span style={{ position: "absolute", top: "-2px", right: "-2px", backgroundColor: "#ef4444", color: "white", fontSize: "10px", fontWeight: "700", borderRadius: "50%", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>3</span>
        </button>

        <div style={{ width: "1px", height: "20px", backgroundColor: "#e2e8f0" }}></div>

        {/* Profile Dropdown Component */}
        <div 
          className="user-profile"
          style={{ display: "flex", alignItems: "center", gap: "14px", position: "relative", cursor: "pointer", border: "none", padding: "4px 0" }}
          onMouseEnter={() => setDropdownActive(true)}
          onMouseLeave={() => setDropdownActive(false)}
        >
          <div className="user-info" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", border: "none", padding: 0, margin: 0 }}>
            <p className="user-name" style={{ margin: 0, padding: 0, fontSize: "14px", fontWeight: "600", color: "#1e293b", lineHeight: "1.3" }}>
              {vendorData.name}
            </p>
            <p className="user-role" style={{ margin: "2px 0 0 0", padding: 0, fontSize: "12px", fontWeight: "500", color: "#64748b", lineHeight: "1.2" }}>
              {vendorData.role}
            </p>
          </div>
          
          <div 
            className="avatar-fallback" 
            style={{ 
              width: "38px", height: "38px", backgroundColor: "#2563eb", color: "#ffffff", 
              borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", 
              fontWeight: "600", fontSize: "14px", boxShadow: "0 2px 4px rgba(37, 99, 235, 0.15)", border: "none"
            }}
          >
            {userInitial}
          </div>

          {dropdownActive && (
            <div 
              className="profile-floating-dropdown"
              style={{ 
                position: "absolute", top: "100%", right: "0", backgroundColor: "#ffffff", 
                border: "1px solid #e2e8f0", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)", 
                borderRadius: "12px", width: "240px", padding: "12px 8px", marginTop: "12px", 
                display: "flex", flexDirection: "column", gap: "4px", zIndex: 9999, boxSizing: "border-box" 
              }}
            >
              <div className="dropdown-info-header" style={{ padding: "8px 12px", textAlign: "left" }}>
                <strong style={{ fontSize: "14px", color: "#0f172a", display: "block", fontWeight: "600" }}>Vendor Terminal</strong>
                <p style={{ fontSize: "11px", color: "#64748b", margin: "4px 0 0 0", wordBreak: "break-all" }}>{vendorData.email}</p>
              </div>
              
              <hr style={{ border: "0", borderTop: "1px solid #f1f5f9", margin: "8px 0" }}/>
              
              <button 
                onClick={() => navigate("/vendor/dashboard")}
                style={{ display: "flex", alignItems: "center", gap: "12px", background: "none", border: "none", width: "100%", padding: "10px 12px", textAlign: "left", fontSize: "13px", fontWeight: "500", color: "#475569", borderRadius: "8px", cursor: "pointer" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f1f5f9"; e.currentTarget.style.color = "#0f172a"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#fff"; e.currentTarget.style.color = "#475569"; }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>dashboard</span>
                <span>Vendor Dashboard</span>
              </button>
              
              <button 
                onClick={handleLogout}
                style={{ display: "flex", alignItems: "center", gap: "12px", background: "none", border: "none", width: "100%", padding: "10px 12px", textAlign: "left", fontSize: "13px", fontWeight: "500", color: "#ef4444", borderRadius: "8px", cursor: "pointer" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#fef2f2"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>logout</span> 
                Exit Session
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;