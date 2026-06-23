import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import vendorService from "../../services/vendorService.js";
import "../../vendor.css";

const ViewVendor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("No Vendor ID provided in the URL.");
      setLoading(false);
      return;
    }

    setLoading(true);
    vendorService.getVendorById(id)
      .then((data) => {
        if (data) {
          setVendor(data);
        } else {
          setError("Vendor profile record not found on server.");
        }
      })
      .catch((err) => {
        console.error("View Vendor API Error: ", err);
        setError("Failed to fetch data or Server token session expired.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <AdminLayout pageTitle="Vendor Details" pageSubtitle="Loading comprehensive workspace entity logs...">
        <div className="overlay-loader-shell">
          <div className="loader-circle"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !vendor) {
    return (
      <AdminLayout pageTitle="Vendor Error" pageSubtitle="Workspace profiling validation failed.">
        <div className="form-layout-frame" style={{ flexDirection: "column", padding: "40px", textAlign: "center", backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#ef4444" }}>error</span>
          <p style={{ marginTop: "16px", fontSize: "15px", fontWeight: "600", color: "#334155" }}>
            {error || "Unable to display target vendor data information details."}
          </p>
          <button className="btn-ui-dismiss" style={{ marginTop: "20px", alignSelf: "center", padding: "8px 16px", backgroundColor: "#f1f5f9", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }} onClick={() => navigate("/vendors")}>
            Back to Vendor List
          </button>
        </div>
      </AdminLayout>
    );
  }

  // NESTED USER OBJECT CHECK FOR USERNAME FIELD
  const extractedUsername = vendor.user && typeof vendor.user === "object" 
    ? (vendor.user.username || "—") 
    : (vendor.username || vendor.user || "—");

  // FIXED: Handles native backend true/false boolean flags perfectly matching list modules
  const isActive = vendor.active === true || vendor.active === 1 || String(vendor.status).toLowerCase() === "active";

  return (
    <AdminLayout 
      pageTitle="Vendor Profile Details" 
      pageSubtitle="Comprehensive overview of official vendor workspace meta information configurations."
    >
      <div 
        style={{ 
          backgroundColor: "#ffffff", 
          borderRadius: "12px", 
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
          border: "1px solid #e2e8f0",
          padding: "28px",
          width: "100%",
          boxSizing: "border-box"
        }}
      >
        {/* Profile Card Header Segment */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px", borderBottom: "1px solid #f1f5f9", paddingBottom: "20px" }}>
          <div style={{ width: "52px", height: "52px", backgroundColor: "#f0fdf4", color: "#16a34a", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>store</span>
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#0f172a" }}>{vendor.vendorName || "N/A"}</h3>
            <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748b", fontWeight: "500" }}>Code: <span style={{ color: "#2563eb", fontWeight: "700" }}>{vendor.vendorCode || "N/A"}</span></p>
          </div>
        </div>

        {/* Info Columns Wrapper Grid */}
        <div style={{ display: "flex", gap: "40px", width: "100%", flexWrap: "wrap" }}>
          
          {/* Left Column: Vendor Information */}
          <div style={{ flex: "1 1 340px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "700", color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Vendor Information
            </h4>
            
            <div style={{ borderBottom: "1px solid #f8fafc", paddingBottom: "10px" }}>
              <span style={{ fontSize: "12px", fontWeight: "500", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Vendor Name</span>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>{vendor.vendorName || "—"}</span>
            </div>

            <div style={{ borderBottom: "1px solid #f8fafc", paddingBottom: "10px" }}>
              <span style={{ fontSize: "12px", fontWeight: "500", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Company Name</span>
              {/* FIXED: Dynamic fallback parsing database specific structural column keys (company_name) */}
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>
                {vendor.companyName || vendor.company || vendor.company_name || "—"}
              </span>
            </div>

            <div style={{ borderBottom: "1px solid #f8fafc", paddingBottom: "10px" }}>
              <span style={{ fontSize: "12px", fontWeight: "500", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Email ID</span>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>{vendor.email || "—"}</span>
            </div>

            <div style={{ borderBottom: "1px solid #f8fafc", paddingBottom: "10px" }}>
              <span style={{ fontSize: "12px", fontWeight: "500", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Mobile Contact</span>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>{vendor.mobile || "—"}</span>
            </div>

            <div style={{ borderBottom: "1px solid #f8fafc", paddingBottom: "10px" }}>
              <span style={{ fontSize: "12px", fontWeight: "500", color: "#94a3b8", display: "block", marginBottom: "4px" }}>GST Number</span>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>{vendor.gstNumber || "—"}</span>
            </div>

            <div style={{ borderBottom: "1px solid #f8fafc", paddingBottom: "10px" }}>
              <span style={{ fontSize: "12px", fontWeight: "500", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Address Location</span>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b", lineHeight: "1.4" }}>{vendor.address || "—"}</span>
            </div>
          </div>
          
          {/* Right Column: Account Meta Details */}
          <div style={{ flex: "1 1 340px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "700", color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Account Information
            </h4>
            
            <div style={{ borderBottom: "1px solid #f8fafc", paddingBottom: "10px" }}>
              <span style={{ fontSize: "12px", fontWeight: "500", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Username Token</span>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>{extractedUsername}</span>
            </div>
            
            <div style={{ borderBottom: "1px solid #f8fafc", paddingBottom: "10px" }}>
              <span style={{ fontSize: "12px", fontWeight: "500", color: "#94a3b8", display: "block", marginBottom: "6px" }}>Status State</span>
              <div>
                <span className={`badge-status-pill ${isActive ? 'badge-active' : 'badge-inactive'}`}>
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            
            <div style={{ borderBottom: "1px solid #f8fafc", paddingBottom: "10px" }}>
              <span style={{ fontSize: "12px", fontWeight: "500", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Created Date</span>
              <span style={{ fontSize: "14px", fontWeight: "500", color: "#475569" }}>{vendor.createdDate || "20 Jun 2026"}</span>
            </div>
            
            <div style={{ borderBottom: "1px solid #f8fafc", paddingBottom: "10px" }}>
              <span style={{ fontSize: "12px", fontWeight: "500", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Created By</span>
              <span style={{ fontSize: "14px", fontWeight: "500", color: "#475569" }}>{vendor.createdBy || "Super Admin"}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions Row Element */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "32px", borderTop: "1px solid #f1f5f9", paddingTop: "20px" }}>
          <button 
            className="btn-ui-dismiss" 
            onClick={() => navigate("/vendors")}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 18px", borderRadius: "8px", border: "1px solid #cbd5e1", backgroundColor: "#ffffff", color: "#334155", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_back</span>
            Back to List
          </button>
          
          <button 
            className="btn-action-trigger" 
            onClick={() => navigate(`/vendors/edit/${vendor.id}`)}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 18px", borderRadius: "8px", border: "none", backgroundColor: "#2563eb", color: "#ffffff", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>edit</span>
            Edit Vendor
          </button>
        </div>

      </div>
    </AdminLayout>
  );
};

export default ViewVendor;