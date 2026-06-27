import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../../dashboard.css"; // 🚀 FIXED PATH: Vendor_layout folder ke hisab se css ka path set kiya hai

const VendorLayout = ({ children, pageTitle, pageSubtitle }) => {
  return (
    <div className="dashboard-container">
      {/* 🚀 Vendor Specific Sidebar */}
      <Sidebar />
      
      <div className="content-layout">
        {/* 🚀 Vendor Specific Top Navbar */}
        <Navbar />
        
        <main className="main-wrapper">
          {/* Dynamic Header Section matching Vendor Dashboard banner exactly */}
          {pageTitle && (
            <div className="dashboard-header" style={{ marginBottom: "8px", paddingTop: "10px" }}> 
              <div className="header-title">
                <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", margin: 0 }}>{pageTitle}</h2>
                {pageSubtitle && <p style={{ color: "#64748b", marginTop: "2px", marginBottom: 0, fontSize: "14px" }}>{pageSubtitle}</p>}
              </div>
            </div>
          )}
          {children}
        </main>
        
        {/* 🚀 Vendor Specific Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default VendorLayout;