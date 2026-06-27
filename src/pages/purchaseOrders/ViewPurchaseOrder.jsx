import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import axios from "axios";

const PurchaseOrderView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 🚀 Spring Boot Mapping endpoint reference node matching class properties definitions
  const BASE_URL = `http://localhost:8080/purchase-orders/view/id/${id}`;

  // State Management Buckets
  const [poDetails, setPoDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  // Bearer Authentication helper
  const getRequestConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        ...(token && token !== "null" ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json"
      }
    };
  };

  // Fetch Purchase Order Specs on Mount Phase
  useEffect(() => {
    const fetchPoSpecifications = async () => {
      try {
        setLoading(true);
        setApiError("");
        const response = await axios.get(BASE_URL, getRequestConfig());
        if (response.data) {
          setPoDetails(response.data);
        }
      } catch (err) {
        console.error("Error connecting to PO backend node:", err);
        setApiError("Failed to fetch purchase order specifications from data servers.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPoSpecifications();
    }
  }, [id, BASE_URL]);

  // Status Color badge mapping matrix variables
  const currentStatus = (poDetails?.status || "PENDING").toUpperCase();
  let badgeBg = "#fffbeb"; let badgeColor = "#d97706";
  if (currentStatus === "APPROVED") { badgeBg = "#f0fdf4"; badgeColor = "#16a34a"; }
  else if (currentStatus === "REJECTED" || currentStatus === "CANCELLED") { badgeBg = "#fef2f2"; badgeColor = "#ef4444"; }

  const subtotalAmount = parseFloat(poDetails?.grandTotal || poDetails?.amount || 0);

  return (
    <AdminLayout pageTitle="Purchase Order Details" pageSubtitle="Home / Purchase Orders / Overview">
      
      {/* Top Utility Nav Controls Strip Bar */}
      <div className="d-flex justify-content-between align-items-center mb-4 mx-auto w-100" style={{ maxWidth: "900px" }}>
        <button 
          onClick={() => navigate("/admin/purchase-orders")} 
          className="btn btn-outline-secondary d-flex align-items-center gap-2"
          style={{ fontSize: "13px", fontWeight: "600", borderRadius: "6px", backgroundColor: "#ffffff" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_back</span>
          Back to List
        </button>
      </div>

      {loading ? (
        <div style={{ padding: "60px", textAlign: "center", color: "#64748b" }}>
          <div style={{ width: "24px", height: "24px", border: "2px solid #cbd5e1", borderTopColor: "#2563eb", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }}></div>
          <p className="mt-2 small fw-semibold">Fetching core enterprise PO records metadata...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : apiError ? (
        <div className="card p-4 mx-auto w-100 border-0 shadow-sm text-start" style={{ maxWidth: "900px", borderRadius: "10px" }}>
          <h4 className="fw-bold text-dark mb-3">Purchase Order Details</h4>
          <span className="text-muted d-block small mb-3">Error</span>
          <div className="alert alert-danger p-3 d-flex flex-column align-items-start gap-3" style={{ backgroundColor: "#fff5f5", borderColor: "#ffe3e3", color: "#e53e3e", borderRadius: "8px" }}>
            <span style={{ fontSize: "14.5px", fontWeight: "500" }}>{apiError}</span>
            <button onClick={() => navigate("/admin/purchase-orders")} className="btn btn-sm btn-outline-secondary" style={{ backgroundColor: "#ffffff", fontSize: "13px", fontWeight: "600" }}>Back to List</button>
          </div>
        </div>
      ) : (
        
        /* Professional Procurement ERP Sheet Printable Template View Card */
        <div className="mx-auto shadow-sm border bg-white" style={{ maxWidth: "900px", minHeight: "1000px", padding: "50px", borderRadius: "8px", boxSizing: "border-box" }}>
          
          {/* ==================== HEADER STRIP ROW BLOCK ==================== */}
          <div className="d-flex justify-content-between align-items-start mb-5 pb-4 border-bottom">
            <div className="d-flex align-items-center gap-3">
              <div style={{ width: "44px", height: "44px", backgroundColor: "#eef2ff", color: "#2563eb", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "26px" }}>dataset</span>
              </div>
              <div>
                <h4 className="m-0 fw-bold text-dark" style={{ letterSpacing: "-0.5px" }}>ProcureManage</h4>
                <small className="text-muted fw-semibold uppercase" style={{ fontSize: "10.5px", letterSpacing: "0.5px" }}>Vendor Management System</small>
              </div>
            </div>

            <div className="text-end">
              <span className="d-block fw-bold text-dark mb-1" style={{ fontSize: "19px" }}>PURCHASE ORDER</span>
              {/* 🚀 FIXED: Pointed strictly to poDetails to break the undefined crash loop */}
              <span className="font-monospace text-secondary fw-semibold small d-block mb-2">{poDetails?.poNumber || "—"}</span>
              <span className="badge" style={{ backgroundColor: badgeBg, color: badgeColor, padding: "5px 12px", borderRadius: "4px", fontSize: "11px", fontWeight: "700" }}>
                {currentStatus}
              </span>
            </div>
          </div>

          {/* ==================== CORE PARTY ADDRESS BLOCK PROPERTIES ==================== */}
          <div className="row g-4 mb-5" style={{ fontSize: "14px" }}>
            <div className="col-sm-6">
              <span className="text-muted small fw-bold d-block mb-2 uppercase" style={{ letterSpacing: "0.5px" }}>Issued By (Buyer):</span>
              <strong className="text-dark d-block mb-1">ProcureManage Enterprise Corp</strong>
              <span className="text-secondary d-block lh-base">
                102, Synergy Tech Park, Gorwa Road<br />
                Vadodara, Gujarat, India - 390016<br />
                <strong>Purchaser:</strong> {poDetails?.employeeName || "Corporate Accounts Desk"}
              </span>
            </div>

            <div className="col-sm-6">
              <span className="text-muted small fw-bold d-block mb-2 uppercase" style={{ letterSpacing: "0.5px" }}>Vendor Entity Node:</span>
              <strong className="text-dark d-block mb-1">{poDetails?.vendorName || "Associated Supplier Group"}</strong>
              <span className="text-secondary d-block lh-base">
                <strong>Vendor ID:</strong> #{poDetails?.vendorId || "—"}<br />
                GIDC Industrial Processing Zone Cluster<br />
                Gujarat, India
              </span>
            </div>
          </div>

          {/* ==================== REQUISITION TIMES STRIP METADATA ==================== */}
          <div className="row g-3 p-3 mb-5 border rounded-3 bg-light text-start" style={{ fontSize: "13px" }}>
            <div className="col-sm-4">
              <span className="text-muted d-block small mb-1">Order Date</span>
              <strong className="text-dark font-monospace">{poDetails?.orderDate || "—"}</strong>
            </div>
            <div className="col-sm-4">
              <span className="text-muted d-block small mb-1">Expected Delivery Date</span>
              <strong className="text-dark font-monospace">{poDetails?.expectedDeliveryDate || "—"}</strong>
            </div>
            <div className="col-sm-4">
              <span className="text-muted d-block small mb-1">Total Valuation Ledger Amount</span>
              <strong className="text-primary fs-6">₹{subtotalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong>
            </div>
          </div>

          {/* ==================== INVENTORY LINE ITEMS SUMMARY ==================== */}
          <table className="table table-bordered mb-5 text-start align-middle" style={{ fontSize: "13.5px" }}>
            <thead className="table-light text-secondary">
              <tr>
                <th className="fw-semibold">Line Allocation Description Details</th>
                <th className="text-end fw-semibold" style={{ width: "200px" }}>Total Net Valuations Sum</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3">
                  <strong className="text-dark d-block mb-1">Bulk Component Supply Sourcing Order</strong>
                  <span className="text-muted small">Standard inventory contract item request generated securely through Procurement Management system.</span>
                </td>
                <td className="text-end font-monospace fw-bold p-3 text-dark fs-6">
                  ₹{subtotalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Footer Component Verification Seals */}
          <div className="d-flex justify-content-between align-items-end pt-5 mt-5 border-top" style={{ fontSize: "12px" }}>
            <div className="text-start text-muted lh-base">
              <span className="d-block"><strong>System Reference:</strong> PO-NODE-ID #{id}</span>
              <small className="text-secondary d-block mt-2">✓ This is a computer system generated purchase contract requisition log validation entry sheet.</small>
            </div>
            
            <div className="text-center" style={{ width: "180px" }}>
              <div className="mx-auto border-bottom mb-2" style={{ height: "40px", width: "100%", borderColor: "#cbd5e1" }}></div>
              <span className="text-dark fw-bold d-block">Procurement Auditor</span>
              <small className="text-muted font-monospace" style={{ fontSize: "10px" }}>[ Secure Digitally Signed ]</small>
            </div>
          </div>

        </div>
      )}
    </AdminLayout>
  );
};

export default PurchaseOrderView;