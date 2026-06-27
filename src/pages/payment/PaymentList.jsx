import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import axios from "axios";
import { jsPDF } from "jspdf";

const PaymentList = () => {
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:8080/admin/payments";

  // State Management Buckets
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Bearer Authentication helper
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

  // Sync rows on initial component rendering phase
  useEffect(() => {
    fetchPaymentsLedger();
  }, []);

  const fetchPaymentsLedger = async () => {
    try {
      setLoading(true);
      setApiError("");
      const response = await axios.get(BASE_URL, getRequestConfig());
      
      console.log("🚀 Live Server Payment API Response Data Stack:", response.data);
      
      const responseData = response.data;
      if (Array.isArray(responseData)) {
        setPayments(responseData);
      } else if (responseData && Array.isArray(responseData.content)) {
        setPayments(responseData.content);
      } else {
        setPayments([]);
      }
    } catch (err) {
      console.error("Database retrieval payment registry failure:", err);
      setApiError("Failed to load payment records from the server.");
      setPayments([]); 
    } finally {
      setLoading(false);
    }
  };

  // Dynamic PUT Status mutations triggers handlers with explicit message alerts
  const handleAlterPaymentStatus = async (id, targetStatus) => {
    const confirmMessage = targetStatus === "SUCCESS"
      ? "Are you sure you want to approve this Payment as SUCCESS?"
      : "Are you sure you want to mark this Payment as FAILED?";

    if (window.confirm(confirmMessage)) {
      try {
        const endpoint = targetStatus === "SUCCESS" ? "success" : "failed";
        await axios.put(`${BASE_URL}/${id}/${endpoint}`, {}, getRequestConfig());
        
        alert(targetStatus === "SUCCESS" ? "Payment status updated to SUCCESS successfully." : "Payment status updated to FAILED.");
        fetchPaymentsLedger(); 
      } catch (err) {
        console.error("Pipeline status transition crash loop error:", err);
        alert("Failed to alter payment milestone checklist status attribute.");
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

  // Dynamic jsPDF Voucher Generation Matrix Engine with correct data properties mapping
  const generateVoucherPDF = (item) => {
    const safeStatus = (item.status || "PENDING").toString().toUpperCase();
    if (safeStatus !== "SUCCESS") {
      alert("Payment voucher can only be downloaded after successful payment.");
      return;
    }

    const doc = new jsPDF("p", "mm", "a4");
    
    // Top Brand Frame Accent Line
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 4, "F");

    // Header Metadata
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(22);
    doc.textColor = [15, 23, 42];
    doc.text("ProcureManage ERP", 14, 20);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.textColor = [100, 116, 139];
    doc.text("Corporate Treasury & Modification Ledger", 14, 28);

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(16);
    doc.textColor = [15, 23, 42];
    doc.text("PURCHASE ORDER PAYMENT", 196, 22, { align: "right" });

    doc.setDrawColor(226, 232, 240);
    doc.line(14, 40, 196, 40);

    // Metadata Strip Box Grid
    doc.setFillColor(248, 250, 252);
    doc.rect(14, 50, 182, 65, "F");
    doc.setDrawColor(226, 232, 240);
    doc.rect(14, 50, 182, 65, "S");

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.textColor = [71, 85, 105];
    doc.text("Payment Metrics Ref:", 24, 65);
    doc.text("Invoice Allocation Number:", 24, 80);
    doc.text("Associated Vendor Node:", 24, 95);

    const currentInvoiceNum = item.invoiceNumber || item.invoice?.invoiceNumber || "—";
    const currentVendorName = item.vendorName || item.invoice?.purchaseOrder?.vendorName || "—";

    doc.setFont("Helvetica", "normal");
    doc.textColor = [15, 23, 42];
    doc.text(item.paymentNumber || "—", 80, 65);
    doc.text(currentInvoiceNum, 80, 80);
    doc.text(currentVendorName, 80, 95);

    // Bottom Table Values Alignment Matrix
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 130, 196, 130);
    
    doc.setFont("Helvetica", "normal");
    doc.textColor = [100, 116, 139];
    doc.text("Disbursement Value Amount Summary:", 14, 145);
    
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.textColor = [37, 99, 235];
    doc.text(`INR ${parseFloat(item.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, 14, 155);

    doc.save(`Payment_Log_${item.paymentNumber || item.id}.pdf`);
  };

  // Robust deep object resolution for client side filtering
  const filteredPayments = Array.isArray(payments) 
    ? payments.filter((item) => {
        const searchTarget = searchTerm.toLowerCase();
        
        const itemPaymentNumber = (item.paymentNumber || "").toLowerCase();
        const itemInvoiceNumber = (item.invoiceNumber || item.invoice?.invoiceNumber || "").toLowerCase();
        const itemPoNumber = (item.poNumber || item.invoice?.purchaseOrder?.poNumber || "").toLowerCase();
        const itemVendorName = (item.vendorName || item.invoice?.purchaseOrder?.vendorName || "").toLowerCase();
        const itemRefNumber = (item.referenceNumber || "").toLowerCase();

        const matchesSearch = 
          itemPaymentNumber.includes(searchTarget) ||
          itemInvoiceNumber.includes(searchTarget) ||
          itemPoNumber.includes(searchTarget) ||
          itemVendorName.includes(searchTarget) ||
          itemRefNumber.includes(searchTarget);

        const itemStatus = item.status ? item.status.toString().toUpperCase() : "PENDING";
        const currentFilter = statusFilter.toUpperCase();
        const matchesStatus = currentFilter === "ALL" || itemStatus === currentFilter;

        return matchesSearch && matchesStatus;
      })
    : [];

  const totalCount = payments.length;
  const successCount = payments.filter((p) => (p.status || "").toString().toUpperCase() === "SUCCESS").length;
  const pendingCount = payments.filter((p) => (p.status || "").toString().toUpperCase() === "PENDING").length;
  const failedCount = payments.filter((p) => (p.status || "").toString().toUpperCase() === "FAILED").length;

  const totalPaidValue = payments
    .filter(p => (p.status || "").toString().toUpperCase() === "SUCCESS")
    .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

  return (
    <AdminLayout pageTitle="Payments" pageSubtitle="Home / Treasury Ledgers">
      
      {/* ==================== UPPER ANALYTICS CARDS (EXACTLY 1 ROW GRID FOR ALL 4 BOXES) ==================== */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "16px", marginBottom: "24px" }}>
        {/* Total Payments */}
        <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "18px", display: "flex", alignItems: "center", gap: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ width: "42px", height: "42px", backgroundColor: "#eef2ff", color: "#2563eb", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>payments</span>
          </div>
          <div>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "2px" }}>Total Payments</span>
            <strong style={{ fontSize: "20px", color: "#0f172a", fontWeight: "700" }}>{totalCount}</strong>
          </div>
        </div>

        {/* Paid Amount */}
        <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "18px", display: "flex", alignItems: "center", gap: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ width: "42px", height: "42px", backgroundColor: "#f0fdf4", color: "#16a34a", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>check_circle</span>
          </div>
          <div>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "2px" }}>Paid Amount</span>
            <strong style={{ fontSize: "18px", color: "#16a34a", fontWeight: "700" }}>₹{totalPaidValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong>
          </div>
        </div>

        {/* Pending Payments */}
        <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "18px", display: "flex", alignItems: "center", gap: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ width: "42px", height: "42px", backgroundColor: "#fffbeb", color: "#d97706", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>hourglass_empty</span>
          </div>
          <div>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "2px" }}>Pending Payments</span>
            <strong style={{ fontSize: "20px", color: "#0f172a", fontWeight: "700" }}>{pendingCount}</strong>
          </div>
        </div>

        {/* Failed Payments */}
        <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "18px", display: "flex", alignItems: "center", gap: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ width: "42px", height: "42px", backgroundColor: "#fef2f2", color: "#ef4444", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>error</span>
          </div>
          <div>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "2px" }}>Failed Payments</span>
            <strong style={{ fontSize: "20px", color: "#0f172a", fontWeight: "700" }}>{failedCount}</strong>
          </div>
        </div>
      </div>

      {/* ==================== ACTION UTILITIES HEADER BAR CONTROLS ==================== */}
      <div style={{ padding: "16px", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px 12px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <div className="position-relative">
            <input 
              type="text" 
              placeholder="Search by payment no, invoice, PO, vendor..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: "8px 12px", paddingLeft: "36px", fontSize: "13px", border: "1px solid #cbd5e1", borderRadius: "6px", outline: "none", minWidth: "320px" }} 
            />
            <span className="material-symbols-outlined position-absolute" style={{ left: "10px", top: "9px", fontSize: "18px", color: "#94a3b8" }}>search</span>
          </div>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: "8px 12px", fontSize: "13px", border: "1px solid #cbd5e1", borderRadius: "6px", outline: "none", backgroundColor: "#fff", cursor: "pointer", color: "#334155" }}
          >
            <option value="All">All Statuses</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="PENDING">PENDING</option>
            <option value="FAILED">FAILED</option>
          </select>
        </div>

        {/* 🚀 ADDED: Create Payment Header Action Button matching ERP spec styles */}
        <button 
          onClick={() => navigate("/admin/payment/add")}
          className="btn btn-primary"
          style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 18px", backgroundColor: "#2563eb", border: "none", borderRadius: "6px", fontWeight: "600", fontSize: "13px" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add</span>
          Create Payment
        </button>
      </div>

      {/* ==================== CORE DATATABLE RENDERING CONTAINER ==================== */}
      <div style={{ backgroundColor: "#ffffff", borderRadius: "0 0 12px 12px", border: "1px solid #e2e8f0", borderTop: "none", overflowX: "auto" }}>
        {apiError && <div style={{ margin: "16px", padding: "12px", backgroundColor: "#fef2f2", color: "#991b1b", fontSize: "13px", fontWeight: "600", borderRadius: "6px" }}>{apiError}</div>}

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#64748b", fontWeight: "500" }}>
            <div style={{ width: "20px", height: "20px", border: "2px solid #cbd5e1", borderTopColor: "#2563eb", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite", marginRight: "10px", verticalAlign: "middle" }}></div>
            <span>Synchronizing live treasury ledger datasets rows...</span>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
                <th style={{ padding: "14px 20px", color: "#475569", fontWeight: "600" }}>Payment Number</th>
                <th style={{ padding: "14px 12px", color: "#475569", fontWeight: "600" }}>Invoice Number</th>
                <th style={{ padding: "14px 12px", color: "#475569", fontWeight: "600" }}>PO Number</th>
                <th style={{ padding: "14px 12px", color: "#475569", fontWeight: "600" }}>Vendor</th>
                <th style={{ padding: "14px 12px", color: "#475569", fontWeight: "600" }}>Payment Date</th>
                <th style={{ padding: "14px 12px", color: "#475569", fontWeight: "600" }}>Amount</th>
                <th style={{ padding: "14px 12px", color: "#475569", fontWeight: "600" }}>Payment Method</th>
                <th style={{ padding: "14px 12px", color: "#475569", fontWeight: "600" }}>Reference Number</th>
                <th style={{ padding: "14px 12px", color: "#475569", fontWeight: "600" }}>Status</th>
                <th style={{ padding: "14px 20px", color: "#475569", fontWeight: "600", textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((item) => {
                  const safeStatus = (item.status || "PENDING").toString().toUpperCase();
                  const resolvedInvoiceNum = item.invoiceNumber || item.invoice?.invoiceNumber || "—";
                  const resolvedPoNum = item.poNumber || item.invoice?.purchaseOrder?.poNumber || "—";
                  const resolvedVendorName = item.vendorName || item.invoice?.purchaseOrder?.vendorName || "—";

                  let badgeBg = "#fffbeb"; let badgeColor = "#d97706";
                  if (safeStatus === "SUCCESS") { badgeBg = "#f0fdf4"; badgeColor = "#16a34a"; }
                  else if (safeStatus === "FAILED") { badgeBg = "#fef2f2"; badgeColor = "#ef4444"; }

                  return (
                    <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9", verticalAlign: "middle" }}>
                      <td style={{ padding: "14px 20px", fontWeight: "600", color: "#0f172a" }}>{item.paymentNumber}</td>
                      <td style={{ padding: "14px 12px", color: "#2563eb", fontWeight: "600" }}>{resolvedInvoiceNum}</td>
                      <td style={{ padding: "14px 12px", color: "#334155", fontWeight: "500" }}>{resolvedPoNum}</td>
                      <td style={{ padding: "14px 12px", color: "#475569" }}>{resolvedVendorName}</td>
                      <td style={{ padding: "14px 12px", color: "#64748b" }}>{formatDate(item.paymentDate)}</td>
                      <td style={{ padding: "14px 12px", color: "#0f172a", fontWeight: "700" }}>₹{parseFloat(item.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                      <td style={{ padding: "14px 12px", color: "#334155" }}>
                        <span style={{ padding: "2px 8px", backgroundColor: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "11px", fontWeight: "500" }}>{item.paymentMethod || "—"}</span>
                      </td>
                      <td style={{ padding: "14px 12px", color: "#475569", fontFamily: "monospace" }}>{item.referenceNumber || "—"}</td>
                      <td style={{ padding: "14px 12px" }}>
                        <span style={{ padding: "4px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: "700", backgroundColor: badgeBg, color: badgeColor, display: "inline-block" }}>{safeStatus}</span>
                      </td>
                      
                      <td style={{ padding: "14px 20px", textAlign: "center" }}>
                        <div style={{ display: "flex", gap: "12px", justifyContent: "center", alignItems: "center" }}>
                          
                          <button onClick={() => navigate(`/admin/payment/view/${item.id}`)} style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", padding: 0 }} title="View Voucher">
                            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>visibility</span>
                          </button>

                          <button 
                            onClick={() => generateVoucherPDF(item)} 
                            style={{ background: "none", border: "none", color: safeStatus === "SUCCESS" ? "#16a34a" : "#94a3b8", cursor: safeStatus === "SUCCESS" ? "pointer" : "not-allowed" }} 
                            title="Download Receipt PDF"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>download</span>
                          </button>

                          {safeStatus === "PENDING" && (
                            <>
                              <button onClick={() => handleAlterPaymentStatus(item.id, "SUCCESS")} style={{ background: "none", border: "none", color: "#16a34a", cursor: "pointer", padding: 0 }} title="Mark Success"><span className="material-symbols-outlined" style={{ fontSize: "19px" }}>check_circle</span></button>
                              <button onClick={() => handleAlterPaymentStatus(item.id, "FAILED")} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: 0 }} title="Mark Failed"><span className="material-symbols-outlined" style={{ fontSize: "19px" }}>cancel</span></button>
                            </>
                          )}

                          {safeStatus === "SUCCESS" && (
                            <span className="text-success fw-semibold small d-flex align-items-center gap-1" style={{ fontSize: "11.5px" }}><span className="material-symbols-outlined" style={{ fontSize: "14px" }}>done</span>✔ Success</span>
                          )}

                          {safeStatus === "FAILED" && (
                            <span className="text-danger fw-semibold small d-flex align-items-center gap-1" style={{ fontSize: "11.5px" }}><span className="material-symbols-outlined" style={{ fontSize: "14px" }}>close</span>✖ Failed</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="10" style={{ padding: "24px", textAlign: "center", color: "#64748b", fontWeight: "500" }}>No Payment Records Found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

    </AdminLayout>
  );
};

export default PaymentList;