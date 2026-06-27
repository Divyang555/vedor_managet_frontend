import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import axios from "axios";

const InvoiceList = () => {
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:8080/admin/invoices";

  // Framework Pipeline States
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // 🚀 FIXED: Beech mein custom modal control karne ke liye state variables
  const [modalConfig, setModalConfig] = useState({
    show: false,
    id: null,
    targetStatus: "",
    message: ""
  });

  // Bearer Authentication authorization headers configuration helper
  const getRequestConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        ...(token && token !== "null" ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
        "Cache-Control": "no-cache", 
        "Pragma": "no-cache"
      }
    };
  };

  // Sync rows data on initial structural component initialization
  useEffect(() => {
    fetchInvoicesLedger();
  }, []);

  const fetchInvoicesLedger = async () => {
    try {
      setLoading(true);
      setApiError("");
      const response = await axios.get(BASE_URL, getRequestConfig());
      
      console.log("🚀 Live Server Invoice API Response Data Stack:", response.data);
      
      const responseData = response.data;
      if (Array.isArray(responseData)) {
        setInvoices(responseData);
      } else if (responseData && Array.isArray(responseData.content)) {
        setInvoices(responseData.content);
      } else {
        setInvoices([]);
      }
    } catch (err) {
      console.error("Database retrieval invoice matrix failure:", err);
      setApiError("Failed to sync structural invoices records from core ERP servers.");
      setInvoices([]); 
    } finally {
      setLoading(false);
    }
  };

  // 🚀 FIXED: Browser pop-up block karke custom modal open karne ka logic
  const openConfirmationModal = (id, targetStatus) => {
    const customMessage = targetStatus === "APPROVED"
      ? "Are you sure you want to approve this invoice?"
      : "Are you sure you want to reject this invoice?";
    
    setModalConfig({
      show: true,
      id: id,
      targetStatus: targetStatus,
      message: customMessage
    });
  };

  // 🚀 FIXED: Modal ke "Confirm" button dabane par backend hit karne wala processing core
  const handleConfirmStatusChange = async () => {
    const { id, targetStatus } = modalConfig;
    try {
      const endpoint = targetStatus === "APPROVED" ? "approve" : "reject";
      await axios.put(`${BASE_URL}/${id}/${endpoint}`, {}, getRequestConfig());
      
      // Close modal first
      setModalConfig(prev => ({ ...prev, show: false }));
      
      alert(targetStatus === "APPROVED" ? "Invoice approved successfully." : "Invoice rejected successfully.");
      fetchInvoicesLedger(); 
    } catch (err) {
      console.error("Pipeline checkpoint status assignment validation rollback:", err);
      alert(`Failed to safely perform action: ${targetStatus.toLowerCase()}`);
      setModalConfig(prev => ({ ...prev, show: false }));
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

  // Global dynamic query filtering across direct payload parameters
  const filteredInvoices = Array.isArray(invoices) 
    ? invoices.filter((item) => {
        const matchesSearch = 
          (item.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.poNumber?.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.vendorName?.toLowerCase().includes(searchTerm.toLowerCase()));

        const itemStatus = item.status ? item.status.toString().toUpperCase() : "PENDING_REVIEW";
        const currentFilter = statusFilter.toUpperCase();
        const matchesStatus = currentFilter === "ALL" || itemStatus === currentFilter;

        return matchesSearch && matchesStatus;
      })
    : [];

  // Dynamic Aggregates Calculators Mapping from Live Database State
  const totalCount = Array.isArray(invoices) ? invoices.length : 0;
  const pendingCount = Array.isArray(invoices) ? invoices.filter((d) => (d.status || "PENDING_REVIEW").toString().toUpperCase() === "PENDING_REVIEW").length : 0;
  const approvedCount = Array.isArray(invoices) ? invoices.filter((d) => (d.status || "").toString().toUpperCase() === "APPROVED").length : 0;
  const rejectedCount = Array.isArray(invoices) ? invoices.filter((d) => (d.status || "").toString().toUpperCase() === "REJECTED").length : 0;
  
  // Calculate total evaluation financial metrics matrix securely
  const totalInvoiceValue = Array.isArray(invoices) 
    ? invoices.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0)
    : 0;

  return (
    <AdminLayout pageTitle="Invoices" pageSubtitle="Home / Invoice Registry">
      
      {/* ==================== UPPER ANALYTICS CARDS (EXACTLY 1 ROW GRID FOR ALL 5 BOXES) ==================== */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: "12px", marginBottom: "24px" }}>
        
        {/* Total Invoices */}
        <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "14px", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ width: "40px", height: "40px", backgroundColor: "#eef2ff", color: "#4f46e5", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>receipt_long</span>
          </div>
          <div style={{ minWidth: 0 }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block", textTruncate: "ellipsis", whiteSpace: "nowrap" }}>Total Invoices</span>
            <strong style={{ fontSize: "18px", color: "#0f172a", fontWeight: "700" }}>{totalCount}</strong>
          </div>
        </div>

        {/* Pending Review */}
        <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "14px", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ width: "40px", height: "40px", backgroundColor: "#fffbeb", color: "#d97706", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>rate_review</span>
          </div>
          <div style={{ minWidth: 0 }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block", textTruncate: "ellipsis", whiteSpace: "nowrap" }}>Pending Review</span>
            <strong style={{ fontSize: "18px", color: "#0f172a", fontWeight: "700" }}>{pendingCount}</strong>
          </div>
        </div>

        {/* Approved */}
        <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "14px", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ width: "40px", height: "40px", backgroundColor: "#f0fdf4", color: "#16a34a", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>verified</span>
          </div>
          <div style={{ minWidth: 0 }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block", textTruncate: "ellipsis", whiteSpace: "nowrap" }}>Approved</span>
            <strong style={{ fontSize: "18px", color: "#0f172a", fontWeight: "700" }}>{approvedCount}</strong>
          </div>
        </div>

        {/* Rejected */}
        <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "14px", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ width: "40px", height: "40px", backgroundColor: "#fef2f2", color: "#dc2626", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>cancel</span>
          </div>
          <div style={{ minWidth: 0 }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block", textTruncate: "ellipsis", whiteSpace: "nowrap" }}>Rejected</span>
            <strong style={{ fontSize: "18px", color: "#0f172a", fontWeight: "700" }}>{rejectedCount}</strong>
          </div>
        </div>

        {/* Total Invoice Value */}
        <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "14px", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ width: "40px", height: "40px", backgroundColor: "#f5f3ff", color: "#7c3aed", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>payments</span>
          </div>
          <div style={{ minWidth: 0 }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block", textTruncate: "ellipsis", whiteSpace: "nowrap" }}>Total Value</span>
            <strong style={{ fontSize: "16px", color: "#0f172a", fontWeight: "700" }}>
              ₹{totalInvoiceValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </strong>
          </div>
        </div>

      </div>

      {/* ==================== ACTION UTILITIES HEADER BAR CONTROLS ==================== */}
      <div style={{ padding: "16px", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px 12px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <input 
            type="text" 
            placeholder="Search by invoice number, PO, vendor..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "8px 12px", fontSize: "13px", border: "1px solid #cbd5e1", borderRadius: "6px", outline: "none", minWidth: "320px" }} 
          />
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: "8px 12px", fontSize: "13px", border: "1px solid #cbd5e1", borderRadius: "6px", outline: "none", backgroundColor: "#fff", cursor: "pointer" }}
          >
            <option value="All">Status: All</option>
            <option value="PENDING_REVIEW">PENDING REVIEW</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
            <option value="PAID">PAID</option>
          </select>
        </div>
      </div>

      {/* ==================== CORE INVOICE DATATABLE VIEW GRID ==================== */}
      <div style={{ backgroundColor: "#ffffff", borderRadius: "0 0 12px 12px", border: "1px solid #e2e8f0", borderTop: "none", overflowX: "auto" }}>
        {apiError && <div style={{ margin: "16px", padding: "12px", backgroundColor: "#fef2f2", color: "#991b1b", fontSize: "13px", fontWeight: "600", borderRadius: "6px" }}>{apiError}</div>}

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#64748b", fontWeight: "500" }}>
            <div style={{ width: "20px", height: "20px", border: "2px solid #cbd5e1", borderTopColor: "#2563eb", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite", marginRight: "10px", verticalAlign: "middle" }}></div>
            <span>Loading invoice master datasets records...</span>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
                <th style={{ padding: "14px 20px", color: "#475569", fontWeight: "600" }}>#</th>
                <th style={{ padding: "14px 12px", color: "#475569", fontWeight: "600" }}>Invoice Number</th>
                <th style={{ padding: "14px 12px", color: "#475569", fontWeight: "600" }}>PO Number</th>
                <th style={{ padding: "14px 12px", color: "#475569", fontWeight: "600" }}>Vendor</th>
                <th style={{ padding: "14px 12px", color: "#475569", fontWeight: "600" }}>Invoice Date</th>
                <th style={{ padding: "14px 12px", color: "#475569", fontWeight: "600" }}>Due Date</th>
                <th style={{ padding: "14px 12px", color: "#475569", fontWeight: "600" }}>Amount</th>
                <th style={{ padding: "14px 12px", color: "#475569", fontWeight: "600" }}>Status</th>
                <th style={{ padding: "14px 12px", color: "#475569", fontWeight: "600" }}>Invoice File</th>
                <th style={{ padding: "14px 20px", color: "#475569", fontWeight: "600", textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((item, index) => {
                  const currentStatus = (item.status || "PENDING_REVIEW").toString().toUpperCase();
                  
                  let badgeBg = "#fffbeb"; let badgeColor = "#d97706";
                  if (currentStatus === "APPROVED") { badgeBg = "#f0fdf4"; badgeColor = "#16a34a"; }
                  else if (currentStatus === "REJECTED") { badgeBg = "#fef2f2"; badgeColor = "#ef4444"; }
                  else if (currentStatus === "PAID") { badgeBg = "#eff6ff"; badgeColor = "#2563eb"; }

                  return (
                    <tr key={item.id || index} style={{ borderBottom: "1px solid #f1f5f9", verticalAlign: "middle" }}>
                      <td style={{ padding: "14px 20px", color: "#64748b" }}>{index + 1}</td>
                      <td style={{ padding: "14px 12px", fontWeight: "600", color: "#2563eb" }}>{item.invoiceNumber}</td>
                      <td style={{ padding: "14px 12px", color: "#334155", fontWeight: "500" }}>{item.poNumber || "—"}</td>
                      <td style={{ padding: "14px 12px", color: "#475569" }}>{item.vendorName || "—"}</td>
                      <td style={{ padding: "14px 12px", color: "#64748b" }}>{formatDate(item.invoiceDate)}</td>
                      <td style={{ padding: "14px 12px", color: "#64748b" }}>{formatDate(item.dueDate)}</td>
                      <td style={{ padding: "14px 12px", color: "#0f172a", fontWeight: "600" }}>
                        ₹{parseFloat(item.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                      
                      <td style={{ padding: "14px 12px" }}>
                        <span style={{ padding: "4px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: "700", backgroundColor: badgeBg, color: badgeColor, display: "inline-block" }}>
                          {currentStatus.replace("_", " ")}
                        </span>
                      </td>

                      {/* Invoice File Column */}
                      <td style={{ padding: "14px 12px" }}>
                        {item.invoiceFileUrl ? (
                          <button 
                            type="button"
                            onClick={() => window.open(item.invoiceFileUrl, "_blank")}
                            style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}
                            title="Open Invoice Document"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>picture_as_pdf</span>
                          </button>
                        ) : (
                          <span className="text-muted" style={{ fontSize: "11px" }}>No File</span>
                        )}
                      </td>
                      
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ display: "flex", gap: "12px", justifyContent: "center", alignItems: "center" }}>
                          <button onClick={() => navigate(`/admin/invoice/view/${item.id}`)} style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", padding: 0 }} title="View Specs"><span className="material-symbols-outlined" style={{ fontSize: "18px" }}>visibility</span></button>
                          
                          {/* 🚀 FIXED: Open intermediate modal wrapper on click events */}
                          {currentStatus === "PENDING_REVIEW" ? (
                            <>
                              <button 
                                onClick={() => openConfirmationModal(item.id, "APPROVED")} 
                                style={{ background: "none", border: "none", color: "#16a34a", cursor: "pointer", padding: 0, display: "inline-flex" }} 
                                title="Approve Invoice"
                              >
                                <span className="material-symbols-outlined" style={{ fontSize: "19px" }}>check_circle</span>
                              </button>
                              <button 
                                onClick={() => openConfirmationModal(item.id, "REJECTED")} 
                                style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", padding: 0, display: "inline-flex" }} 
                                title="Reject Invoice"
                              >
                                <span className="material-symbols-outlined" style={{ fontSize: "19px" }}>cancel</span>
                              </button>
                            </>
                          ) : (
                            <>
                              {currentStatus === "APPROVED" && (
                                <span className="text-success fw-semibold small d-flex align-items-center gap-1" style={{ fontSize: "11.5px" }}><span className="material-symbols-outlined" style={{ fontSize: "14px" }}>done</span>Approved</span>
                              )}
                              {currentStatus === "REJECTED" && (
                                <span className="text-danger fw-semibold small d-flex align-items-center gap-1" style={{ fontSize: "11.5px" }}><span className="material-symbols-outlined" style={{ fontSize: "14px" }}>close</span>Rejected</span>
                              )}
                              {currentStatus === "PAID" && (
                                <span className="text-primary fw-semibold small d-flex align-items-center gap-1" style={{ fontSize: "11.5px" }}><span className="material-symbols-outlined" style={{ fontSize: "14px" }}>paid</span>Paid</span>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="10" style={{ padding: "24px", textAlign: "center", color: "#64748b" }}>No sequential invoice nodes mapped over selected criteria parameters.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ==================== 🚀 FIXED: SCREEN-CENTER INLINE CONFIRMATION MODAL POPUP ==================== */}
      {modalConfig.show && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(4px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 }}>
          <div className="bg-white border rounded shadow-lg animate-fade-in" style={{ width: "100%", maxWidth: "440px", overflow: "hidden", borderRadius: "10px" }}>
            
            {/* Modal Header */}
            <div className="px-4 py-3 border-bottom d-flex align-items-center justify-content-between" style={{ backgroundColor: "#f8fafc" }}>
              <h6 className="m-0 fw-bold text-dark" style={{ fontSize: "15px" }}>
                {modalConfig.targetStatus === "APPROVED" ? "Approve Confirmation" : "Reject Confirmation"}
              </h6>
              <button type="button" className="btn-close" onClick={() => setModalConfig(prev => ({ ...prev, show: false }))} style={{ fontSize: "12px", outline: "none", boxShadow: "none" }}></button>
            </div>

            {/* Modal Body */}
            <div className="p-4 text-center">
              <div style={{ 
                width: "56px", height: "56px", 
                backgroundColor: modalConfig.targetStatus === "APPROVED" ? "#f0fdf4" : "#fef2f2", 
                color: modalConfig.targetStatus === "APPROVED" ? "#16a34a" : "#dc2626", 
                borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px auto" 
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: "32px" }}>
                  {modalConfig.targetStatus === "APPROVED" ? "verified_user" : "gavel"}
                </span>
              </div>
              <p className="text-dark fw-medium mb-1" style={{ fontSize: "14.5px" }}>{modalConfig.message}</p>
              <small className="text-muted d-block px-2">This change will immediately sync ledger data matrices parameters across the live server core repository nodes.</small>
            </div>

            {/* Modal Footer Controls */}
            <div className="px-4 py-3 bg-light border-top d-flex justify-content-end gap-2">
              <button 
                type="button" 
                className="btn btn-sm btn-outline-secondary px-3" 
                onClick={() => setModalConfig(prev => ({ ...prev, show: false }))}
                style={{ fontSize: "13px", fontWeight: "600", borderRadius: "6px" }}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className={`btn btn-sm px-3 text-white ${modalConfig.targetStatus === "APPROVED" ? "btn-success" : "btn-danger"}`}
                onClick={handleConfirmStatusChange}
                style={{ fontSize: "13px", fontWeight: "600", borderRadius: "6px", backgroundColor: modalConfig.targetStatus === "APPROVED" ? "#16a34a" : "#dc2626", borderColor: modalConfig.targetStatus === "APPROVED" ? "#16a34a" : "#dc2626" }}
              >
                Confirm Action
              </button>
            </div>

          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default InvoiceList;