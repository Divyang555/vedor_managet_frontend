import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../../dashboard.css";

const AdminLayout = ({ children, pageTitle, pageSubtitle }) => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="content-layout">
        <Navbar />
        <main className="main-wrapper">
          {/* FIXED: Dynamic Header Section exactly matching Admin Dashboard banner */}
          {pageTitle && (
            <div className="dashboard-header" style={{ marginBottom: "8px", paddingTop: "10px" }}> 
              {/* marginBottom ko 24px se ghata kar 8px kar diya hai */}
              <div className="header-title">
                <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", margin: 0 }}>{pageTitle}</h2>
                {pageSubtitle && <p style={{ color: "#64748b", marginTop: "2px", marginBottom: 0, fontSize: "14px" }}>{pageSubtitle}</p>}
              </div>
            </div>
          )}
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;