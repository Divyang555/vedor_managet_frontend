import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [dropdownActive, setDropdownActive] = useState(false);
  
  const [userData, setUserData] = useState({
    name: "Admin User",
    email: "admin@procuremanage.com",
    role: "Super Admin"
  });

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserData({
          name: parsedUser.name || "Admin User",
          email: parsedUser.email || "admin@procuremanage.com",
          role: parsedUser.role || "Super Admin"
        });
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const userInitial = userData.name ? userData.name.charAt(0).toUpperCase() : "A";

  return (
    <header 
      className="top-navbar" 
      style={{
        height: "70px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #f1f5f9", // Subtle soft divider instead of harsh line
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
      {/* Left Search Container */}
      <div className="search-container" style={{ display: "flex", alignItems: "center", position: "relative" }}>
        <span className="material-symbols-outlined" style={{ position: "absolute", left: "14px", color: "#94a3b8", fontSize: "20px" }}>search</span>
        <input 
          className="search-input" 
          placeholder="Search anything..." 
          type="text" 
          style={{ 
            padding: "10px 16px 10px 44px", 
            width: "320px", 
            backgroundColor: "#f8fafc", 
            border: "1px solid #e2e8f0", 
            borderRadius: "24px", 
            fontSize: "14px", 
            outline: "none",
            transition: "all 0.2s"
          }}
        />
      </div>
      
      {/* Right Actions Wrapper Block */}
      <div className="top-actions" style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        
        {/* Notifications Icon Button */}
        <button className="icon-btn" style={{ background: "none", border: "none", outline: "none", position: "relative", cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center", padding: "4px" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>notifications</span>
          <span style={{ position: "absolute", top: "-2px", right: "-2px", backgroundColor: "#ef4444", color: "white", fontSize: "10px", fontWeight: "700", borderRadius: "50%", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>5</span>
        </button>
        
        {/* Chat Icon Button */}
        <button className="icon-btn" style={{ background: "none", border: "none", outline: "none", position: "relative", cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center", padding: "4px" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>chat_bubble</span>
          <span style={{ position: "absolute", top: "-2px", right: "-2px", backgroundColor: "#3b82f6", color: "white", fontSize: "10px", fontWeight: "700", borderRadius: "50%", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>3</span>
        </button>

        {/* SOFT SEPARATOR (Clean minimal grey hairline box) */}
        <div style={{ width: "1px", height: "20px", backgroundColor: "#e2e8f0" }}></div>

        {/* FIXED USER PROFILE: Borders completely removed, layout paddings aligned horizontally */}
        <div 
          className="user-profile"
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "14px", 
            position: "relative", 
            cursor: "pointer",
            border: "none", // Erasing any inherited css outline borders
            padding: "4px 0"
          }}
          onMouseEnter={() => setDropdownActive(true)}
          onMouseLeave={() => setDropdownActive(false)}
        >
          {/* Text Labels Stack Container with zero outer line boundaries */}
          <div className="user-info" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", border: "none", padding: 0, margin: 0 }}>
            <p className="user-name" style={{ margin: 0, padding: 0, fontSize: "14px", fontWeight: "600", color: "#1e293b", lineHeight: "1.3" }}>
              {userData.name}
            </p>
            <p className="user-role" style={{ margin: "2px 0 0 0", padding: 0, fontSize: "12px", fontWeight: "500", color: "#64748b", lineHeight: "1.2" }}>
              {userData.role}
            </p>
          </div>
          
          {/* Modern Circle Initial Profile Badge */}
          <div 
            className="avatar-fallback" 
            style={{ 
              width: "38px", 
              height: "38px", 
              backgroundColor: "#7c3aed", 
              color: "#ffffff", 
              borderRadius: "50%", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              fontWeight: "600", 
              fontSize: "14px",
              boxShadow: "0 2px 4px rgba(124, 58, 237, 0.15)",
              border: "none"
            }}
          >
            {userInitial}
          </div>

          {/* Premium Shadow Dropdown Portal */}
          {dropdownActive && (
            <div 
              className="profile-floating-dropdown"
              style={{ 
                position: "absolute", 
                top: "100%", 
                right: "0", 
                backgroundColor: "#ffffff", 
                border: "1px solid #e2e8f0", 
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)", 
                borderRadius: "12px", 
                width: "240px", 
                padding: "12px 8px", 
                marginTop: "12px", 
                display: "flex", 
                flexDirection: "column", 
                gap: "4px", 
                zIndex: 9999, 
                boxSizing: "border-box" 
              }}
            >
              <div className="dropdown-info-header" style={{ padding: "8px 12px", textAlign: "left" }}>
                <strong style={{ fontSize: "14px", color: "#0f172a", display: "block", fontWeight: "600" }}>{userData.name} Workspace</strong>
                <p style={{ fontSize: "11px", color: "#64748b", margin: "4px 0 0 0", wordBreak: "break-all" }}>{userData.email}</p>
              </div>
              
              <hr style={{ border: "0", borderTop: "1px solid #f1f5f9", margin: "8px 0" }}/>
              
              <button 
                onClick={() => navigate("/admin/dashboard")}
                style={{ display: "flex", alignItems: "center", gap: "12px", background: "none", border: "none", width: "100%", padding: "10px 12px", textAlign: "left", fontSize: "13px", fontWeight: "500", color: "#475569", borderRadius: "8px", cursor: "pointer", outline: "none" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f1f5f9"; e.currentTarget.style.color = "#0f172a"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#475569"; }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#64748b" }}>dashboard</span> 
                Dashboard
              </button>
              
              <button 
                onClick={handleLogout}
                style={{ display: "flex", alignItems: "center", gap: "12px", background: "none", border: "none", width: "100%", padding: "10px 12px", textAlign: "left", fontSize: "13px", fontWeight: "500", color: "#ef4444", borderRadius: "8px", cursor: "pointer", outline: "none" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#fef2f2"; e.currentTarget.style.color = "#991b1b"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#ef4444"; }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>logout</span> 
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;