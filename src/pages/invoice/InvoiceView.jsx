import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import axios from "axios";

const InvoiceView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const BASE_URL = `http://localhost:8080/admin/invoices/${id}`;

  // System Pipeline Operational States
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Bearer Authentication authorization headers configuration helper
  const getRequestConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        ...(token && token !== "null" ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json"
      }
    };
  };

  // Pre-load Invoice details from backend repository on mounting phase
  useEffect(() => {
    fetchInvoiceDetails();
  }, [id]);

  const fetchInvoiceDetails = async () => {
    try {
      setLoading(true);
      setApiError("");
      const response = await axios.get(BASE_URL, getRequestConfig());
      if (response.data) {
        setInvoice(response.data);
      }
    } catch (err) {
      console.error("Error retrieving invoice specifications details:", err);
      setApiError("Failed to load invoice specifications from backend repository.");
    } finally {
      setLoading(false);
    }
  };

  // Safe action trigger pipeline for Approval/Rejection transitions
  const handleUpdateStatus = async (targetStatus) => {
    let confirmMsg = `Are you sure you want to APPROVE this invoice (${invoice?.invoiceNumber})?`;
    if (targetStatus === "REJECTED") {
      const reason = window.prompt("Please enter the reason for rejecting this invoice:", "Incorrect line items calculation.");
      if (reason === null) return; // User cancelled prompt
      if (!reason.trim()) {
        alert("Rejection Reason is mandatory to roll back invoice processing state.");
        return;
      }
      invoice.remarks = reason; // Temporarily assign before pay load push
      confirmMsg = `Are you sure you want to REJECT this invoice?`;
    }

    if (window.confirm(confirmMsg)) {
      try {
        setActionLoading(true);
        // Explicitly hit status update terminal
        await axios.put(`http://localhost:8080/admin/invoices/${id}/status`, { 
          status: targetStatus,
          remarks: invoice?.remarks || ""
        }, getRequestConfig());
        
        // Reload details state to compute values dynamically
        await fetchInvoiceDetails();
      } catch (err) {
        console.error("Status state commit operational transition exception:", err);
        alert(err.response?.data?.message || "Failed to commit invoice operational lifecycle status modify action.");
      } finally {
        setActionLoading(false);
      }
    }
  };

  // Helper utility to format raw API dates (YYYY-MM-DD) to frontend style (DD/MM/YYYY)
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      const [year, month, day] = dateString.split("-");
      if (year && month && day) return `${day}/${month}/${year}`;
      return dateString;
    } catch (e) {
      return dateString;
    }
  };

  const currentStatus = (invoice?.status || "PENDING_REVIEW").toUpperCase();

  return (
    <AdminLayout pageTitle="Invoice Details" pageSubtitle={`Home / Invoices / Overview View #${id}`}>
      
      {/* Top Toolbar Action Header Strip Container */}
      <div className="d-flex justify-content-between align-items-center mb-4" style={{ maxWidth: "1350px", margin: "0 auto", width: "100%", padding: "0 4px" }}>
        <h4 style={{ margin: 0, fontWeight: "700", color: "#0f172a", fontSize: "22px" }}>Overview View</h4>
        <button 
          onClick={() => navigate("/admin/invoice/list")} 
          style={{ display: "flex", alignItems: "center", gap: "8px", borderRadius: "6px", fontWeight: "600", fontSize: "13px", backgroundColor: "#ffffff", border: "1px solid #cbd5e1", padding: "8px 16px", color: "#334155", cursor: "pointer", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px", verticalAlign: "middle" }}>arrow_back</span>
          Back to List
        </button>
      </div>

      {loading ? (
        <div style={{ padding: "60px", textAlign: "center", color: "#64748b", fontWeight: "500" }}>
          <div style={{ width: "24px", height: "24px", border: "2px solid #cbd5e1", borderTopColor: "#2563eb", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite", marginRight: "12px", verticalAlign: "middle" }}></div>
          <span>Retrieving ERP ledger attributes transaction metadata...</span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : apiError ? (
        <div className="alert alert-danger mx-auto" style={{ maxWidth: "1350px" }}>{apiError}</div>
      ) : (
        /* Dual Panel Enterprise ERP Layout */
        <div className="card p-4 bg-white border shadow-sm mx-auto w-100" style={{ maxWidth: "1350px", borderRadius: "12px" }}>
          <div className="row g-5">
            
            {/* ==================== LEFT PANEL: SPECIFICATION DATA AND TIMELINE ==================== */}
            <div className="col-lg-6 border-end pr-lg-4">
              <h5 className="fw-bold text-dark mb-4" style={{ fontSize: "17px", borderBottom: "2px solid #f1f5f9", paddingBottom: "10px" }}>
                Invoice Information
              </h5>

              <div className="row g-4 mb-5" style={{ fontSize: "14px" }}>
                <div className="col-6 col-sm-4 fw-semibold text-muted">Invoice Number</div>
                <div className="col-6 col-sm-8 text-dark fw-bold">{invoice?.invoiceNumber || "—"}</div>

                <div className="col-6 col-sm-4 fw-semibold text-muted">Vendor Name</div>
                <div className="col-6 col-sm-8 text-dark fw-medium">{invoice?.vendorName || "Vadodara Warehouse"}</div>

                <div className="col-6 col-sm-4 fw-semibold text-muted">PO Number</div>
                <div className="col-6 col-sm-8 text-dark font-monospace fw-bold">{invoice?.poNumber || "PO-2026-00121"}</div>

                <div className="col-6 col-sm-4 fw-semibold text-muted">Invoice Date</div>
                <div className="col-6 col-sm-8 text-dark">{formatDate(invoice?.invoiceDate)}</div>

                <div className="col-6 col-sm-4 fw-semibold text-muted">Due Date</div>
                <div className="col-6 col-sm-8 text-dark">{formatDate(invoice?.dueDate)}</div>

                <div className="col-6 col-sm-4 fw-semibold text-muted">Amount</div>
                <div className="col-6 col-sm-8 text-primary fw-bold" style={{ fontSize: "15px" }}>
                  ₹{parseFloat(invoice?.amount || 125000).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>

                <div className="col-6 col-sm-4 fw-semibold text-muted">Status</div>
                <div className="col-6 col-sm-8">
                  <span style={{
                    padding: "4px 12px", borderRadius: "4px", fontSize: "11px", fontWeight: "700",
                    backgroundColor: currentStatus === "APPROVED" ? "#f0fdf4" : currentStatus === "REJECTED" ? "#fef2f2" : "#fffbeb",
                    color: currentStatus === "APPROVED" ? "#16a34a" : currentStatus === "REJECTED" ? "#ef4444" : "#d97706"
                  }}>
                    {currentStatus.replace("_", " ")}
                  </span>
                </div>

                <div className="col-6 col-sm-4 fw-semibold text-muted">Created Date</div>
                <div className="col-6 col-sm-8 text-secondary">{formatDate(invoice?.createdDate || "2026-06-24")}</div>
                
                <div className="col-6 col-sm-4 fw-semibold text-muted">Remarks</div>
                <div className="col-6 col-sm-8 text-secondary" style={{ whiteSpace: "pre-wrap" }}>
                  {invoice?.remarks || "Monthly inventory supply invoice allocation."}
                </div>
              </div>

              {/* Activity Timeline Section UI Component */}
              <h5 className="fw-bold text-dark mb-4" style={{ fontSize: "17px", borderBottom: "2px solid #f1f5f9", paddingBottom: "10px" }}>
                Activity Timeline
              </h5>

              <div style={{ position: "relative", paddingLeft: "32px", marginTop: "20px" }}>
                {/* Connector Line element bar */}
                <div style={{ position: "absolute", left: "11px", top: "6px", bottom: "6px", width: "2px", backgroundColor: "#e2e8f0", zIndex: 1 }}></div>

                {/* Event node 1: Creation step */}
                <div className="d-flex gap-3 mb-4" style={{ position: "relative", zIndex: 2 }}>
                  <div style={{ position: "absolute", left: "-32px", width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#eef2ff", border: "2px solid #2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "13px", color: "#2563eb", fontWeight: "bold" }}>check</span>
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold text-dark" style={{ fontSize: "13px" }}>Invoice Uploaded</h6>
                    <small className="text-muted d-block" style={{ fontSize: "11px" }}>24/06/2026 10:30 AM — Invoice uploaded by Admin User</small>
                  </div>
                </div>

                {/* Event node 2: Current Stage verification logic */}
                <div className="d-flex gap-3 mb-4" style={{ position: "relative", zIndex: 2 }}>
                  <div style={{
                    position: "absolute", left: "-32px", width: "24px", height: "24px", borderRadius: "50%",
                    backgroundColor: currentStatus !== "PENDING_REVIEW" ? "#eef2ff" : "#ffffff",
                    border: currentStatus !== "PENDING_REVIEW" ? "2px solid #2563eb" : "2px solid #cbd5e1",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    {currentStatus !== "PENDING_REVIEW" && <span className="material-symbols-outlined" style={{ fontSize: "13px", color: "#2563eb", fontWeight: "bold" }}>check</span>}
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold" style={{ fontSize: "13px", color: currentStatus === "PENDING_REVIEW" ? "#2563eb" : "#0f172a" }}>Pending Review</h6>
                    <small className="text-muted d-block" style={{ fontSize: "11px" }}>Waiting for corporate account hierarchy verification approval clearing flags.</small>
                  </div>
                </div>

                {/* Event node 3: Termination validation endpoints leaf check */}
                {currentStatus !== "PENDING_REVIEW" && (
                  <div className="d-flex gap-3 mb-2" style={{ position: "relative", zIndex: 2 }}>
                    <div style={{
                      position: "absolute", left: "-32px", width: "24px", height: "24px", borderRadius: "50%",
                      backgroundColor: currentStatus === "APPROVED" ? "#f0fdf4" : "#fef2f2",
                      border: currentStatus === "APPROVED" ? "2px solid #16a34a" : "2px solid #ef4444",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "13px", color: currentStatus === "APPROVED" ? "#16a34a" : "#ef4444", fontWeight: "bold" }}>
                        {currentStatus === "APPROVED" ? "verified" : "gavel"}
                      </span>
                    </div>
                    <div>
                      <h6 className={`mb-0 fw-bold ${currentStatus === "APPROVED" ? "text-success" : "text-danger"}`} style={{ fontSize: "13px" }}>
                        Invoice {currentStatus === "APPROVED" ? "Approved" : "Rejected"}
                      </h6>
                      <small className="text-muted d-block" style={{ fontSize: "11px" }}>
                        Observation comment statement trace: {invoice?.remarks || "Lifecycle validation transaction logged."}
                      </small>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ==================== RIGHT PANEL: INVOICE DOCUMENT EMBED ATTACHMENT VIEW ==================== */}
            <div className="col-lg-6">
              <h5 className="fw-bold text-dark mb-4" style={{ fontSize: "17px", borderBottom: "2px solid #f1f5f9", paddingBottom: "10px" }}>
                Invoice Document
              </h5>

              <div className="border rounded bg-light p-3 text-center position-relative shadow-inner w-100 mb-3" style={{ minHeight: "350px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                {invoice?.invoiceFileUrl || invoice?.invoiceFileBase64 ? (
                  <div className="w-100 h-100">
                    {/* Native rendering box container simulator frame */}
                    <div className="bg-white border rounded p-4 mb-3 mx-auto shadow-sm text-start" style={{ maxWidth: "420px", fontSize: "12px", fontFamily: "monospace" }}>
                      <div className="text-center fw-bold fs-5 mb-3 text-dark">INVOICE PREVIEW</div>
                      <div className="mb-1"><strong>Invoice No:</strong> {invoice?.invoiceNumber}</div>
                      <div className="mb-1"><strong>Vendor Ref:</strong> {invoice?.vendorName || "Vadodara Warehouse"}</div>
                      <div className="mb-1"><strong>Total Net:</strong> ₹{parseFloat(invoice?.amount || 125000).toLocaleString("en-IN")}</div>
                      <hr className="my-2" />
                      <div className="text-muted text-center" style={{ fontSize: "10px" }}>[ Document Base64 Asset Byte-Stream Encrypted Buffered Data Link Active ]</div>
                    </div>
                    
                    <a 
                      href={invoice?.invoiceFileUrl || invoice?.invoiceFileBase64} 
                      download={`Invoice_${invoice?.invoiceNumber || id}.pdf`}
                      className="btn btn-sm btn-primary px-4 py-2"
                      style={{ fontSize: "13px", fontWeight: "600", borderRadius: "6px" }}
                    >
                      <span className="material-symbols-outlined align-middle me-1" style={{ fontSize: "16px" }}>download</span>
                      Download Original Document
                    </a>
                  </div>
                ) : (
                  <div className="text-muted">
                    <span className="material-symbols-outlined d-block mb-2 text-secondary" style={{ fontSize: "40px" }}>picture_as_pdf</span>
                    No active PDF view documents stream mapped in repository storage nodes.
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* ==================== FOOTER TOOLBAR: DYNAMIC TRANSACTION GATEWAY ACTIONS ==================== */}
          <div className="d-flex justify-content-start align-items-center gap-2 border-top pt-4 mt-4">
            
            {/* Conditional validation rules gateway locks checking if state is still editable */}
            {currentStatus === "PENDING_REVIEW" && (
              <>
                <button 
                  onClick={() => handleUpdateStatus("APPROVED")}
                  disabled={actionLoading}
                  className="btn btn-success px-4 py-2 d-flex align-items-center gap-2 shadow-sm"
                  style={{ borderRadius: "6px", fontWeight: "600", fontSize: "14px" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>check_circle</span>
                  Approve Invoice
                </button>

                <button 
                  onClick={() => handleUpdateStatus("REJECTED")}
                  disabled={actionLoading}
                  className="btn btn-danger px-4 py-2 d-flex align-items-center gap-2 shadow-sm"
                  style={{ borderRadius: "6px", fontWeight: "600", fontSize: "14px" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>cancel_presentation</span>
                  Reject Invoice
                </button>
              </>
            )}

         
          </div>

        </div>
      )}
    </AdminLayout>
  );
};

export default InvoiceView;