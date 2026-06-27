import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import axios from "axios";
import { jsPDF } from "jspdf";

const PaymentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const BASE_URL = `http://localhost:8080/admin/payments/${id}`;

  // State Management Buckets
  const [payment, setPayment] = useState(null);
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

  // Fetch Payment Specs on Mount Phase
  useEffect(() => {
    const fetchVoucherDetails = async () => {
      try {
        setLoading(true);
        setApiError("");
        const response = await axios.get(BASE_URL, getRequestConfig());
        if (response.data) {
          setPayment(response.data);
        }
      } catch (err) {
        console.error("Error connecting to Payment backend node:", err);
        setApiError("Failed to fetch payment transaction specifications from data servers.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchVoucherDetails();
  }, [id]);

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

  // Status Color badge mapping matrix variables
  const currentStatus = (payment?.status || "PENDING").toUpperCase();
  let badgeBg = "#fffbeb"; let badgeColor = "#d97706";
  if (currentStatus === "SUCCESS") { badgeBg = "#f0fdf4"; badgeColor = "#16a34a"; }
  else if (currentStatus === "FAILED") { badgeBg = "#fef2f2"; badgeColor = "#ef4444"; }

  const totalAmount = parseFloat(payment?.amount ?? 0);

  // 🚀 DOWNLOAD FUNCTIONALITY: High-Quality Clean Printable jsPDF Canvas Generation Matrix
  const triggerVoucherPDFDownload = () => {
    if (currentStatus !== "SUCCESS") {
      alert("Payment voucher can only be downloaded after successful payment.");
      return;
    }

    const doc = new jsPDF("p", "mm", "a4");
    
    // Top Accent Border Brand Frame
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 5, "F");

    // Corporate Header Title Left
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(20);
    doc.textColor = [30, 58, 138];
    doc.text("ProcureManage ERP", 14, 22);

    doc.setFontSize(9);
    doc.setFont("Helvetica", "normal");
    doc.textColor = [100, 116, 139];
    doc.text("Corporate Treasury & Finance Department", 14, 28);

    // Document Designation Badge Right
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(13);
    doc.textColor = [15, 23, 42];
    doc.text("OFFICIAL PAYMENT VOUCHER", 196, 22, { align: "right" });

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.textColor = [51, 65, 85];
    doc.text(`Voucher No: ${payment?.paymentNumber ?? "—"}`, 196, 28, { align: "right" });

    doc.setDrawColor(226, 232, 240);
    doc.line(14, 36, 196, 36);

    // Part 1: Parties Address Distribution Row
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.textColor = [71, 85, 105];
    doc.text("COMPANY DISBURSEMENT ENTITY:", 14, 48);
    doc.text("CREDITOR / VENDOR BENEFICIARY:", 110, 48);

    doc.setFont("Helvetica", "normal");
    doc.textColor = [15, 23, 42];
    doc.text("ProcureManage Corporate Industries India Ltd", 14, 54);
    doc.text("102, Synergy Tech Cluster Hub, Gorwa Road", 14, 59);
    doc.text("Vadodara, Gujarat, India - 390016", 14, 64);
    doc.text("GSTIN: 24AAAAB1234C1Z0", 14, 69);

    doc.text(payment?.vendorName ?? "—", 110, 54);
    doc.text("GIDC Industrial Processing Area Node", 110, 59);
    doc.text("Verified Verified Vendor Registered Account Link", 110, 64);

    doc.line(14, 76, 196, 76);

    // Part 2: Gray Requisition Grid Box Summary Information
    doc.setFillColor(248, 250, 252);
    doc.rect(14, 84, 182, 44, "F");
    doc.setDrawColor(241, 245, 249);
    doc.rect(14, 84, 182, 44, "S");

    doc.setFont("Helvetica", "bold");
    doc.textColor = [100, 116, 139];
    doc.text("Associated Invoice Number:", 20, 94);
    doc.text("Associated Purchase Order (PO):", 20, 104);
    doc.text("Payment Date Execution Log:", 20, 114);

    doc.text("Payment Method Scheme:", 110, 94);
    doc.text("UTR Transaction Trace Ref:", 110, 104);
    doc.text("Voucher Settlement Status:", 110, 114);

    doc.setFont("Helvetica", "normal");
    doc.textColor = [15, 23, 42];
    doc.text(payment?.invoiceNumber ?? "—", 75, 94);
    doc.text(payment?.poNumber ?? "—", 75, 104);
    doc.text(formatDate(payment?.paymentDate), 75, 114);

    doc.text(payment?.paymentMethod ?? "—", 158, 94);
    doc.text(payment?.referenceNumber ?? "—", 158, 104);
    doc.text(currentStatus, 158, 114);

    // Part 3: Amount Table Layout Header Block
    doc.setFillColor(241, 245, 249);
    doc.rect(14, 144, 182, 10, "F");
    doc.setFont("Helvetica", "bold");
    doc.textColor = [71, 85, 105];
    doc.text("Disbursement Ledger Description", 18, 150);
    doc.text("Settled Value", 192, 150, { align: "right" });

    doc.setFont("Helvetica", "normal");
    doc.textColor = [15, 23, 42];
    doc.text("Full Value Remittance Cleared Advice Log", 18, 164);
    doc.setFont("Helvetica", "bold");
    doc.text(`INR ${totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, 192, 164, { align: "right" });
    
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 172, 196, 172);

    if (payment?.remarks) {
      doc.setFont("Helvetica", "bold");
      doc.textColor = [100, 116, 139];
      doc.text("Voucher Remarks Observations:", 14, 184);
      doc.setFont("Helvetica", "normal");
      doc.textColor = [71, 85, 105];
      doc.text(payment.remarks, 14, 191);
    }

    // Part 4: Approval Audit Timestamps Details Block
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 220, 196, 220);
    doc.setFontSize(9);
    doc.setFont("Helvetica", "bold");
    doc.textColor = [100, 116, 139];
    doc.text("Processed By:", 14, 228); doc.text("Approved By:", 75, 228); doc.text("Audit Timestamp Log:", 135, 228);
    
    doc.setFont("Helvetica", "normal");
    doc.textColor = [15, 23, 42];
    doc.text("System Automated Desk", 14, 234);
    doc.text("Corporate Auditor Desk", 75, 234);
    doc.text(`${formatDate(payment?.paymentDate)} — 12:45 PM`, 135, 234);

    // Unalterable System Seal Footnote
    doc.setFontSize(8);
    doc.textColor = [148, 163, 184];
    doc.text("This is a system generated Payment Voucher. No physical signature is required.", 105, 265, { align: "center" });

    doc.save(`PAYMENT_VOUCHER_${payment?.paymentNumber || id}.pdf`);
  };

  if (loading) {
    return (
      <AdminLayout pageTitle="Payment Voucher Details">
        <div style={{ padding: "60px", textAlign: "center", color: "#64748b" }}>
          <div style={{ width: "24px", height: "24px", border: "2px solid #cbd5e1", borderTopColor: "#2563eb", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }}></div>
          <p className="mt-2 small fw-semibold">Fetching official voucher records metadata...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Payment Voucher Details" pageSubtitle="Home / Treasury Ledgers / Overview">
      
      {/* Upper Navigation Strip Action Control Toolbar Row */}
      <div className="d-flex justify-content-between align-items-center mb-4 mx-auto w-100" style={{ maxWidth: "900px" }}>
        <button onClick={() => navigate("/admin/payment/list")} className="btn btn-outline-secondary d-flex align-items-center gap-2 px-3 shadow-sm" style={{ borderRadius: "6px", fontWeight: "600", fontSize: "13px", backgroundColor: "#fff" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_back</span> Back to List
        </button>
        
        <button 
          onClick={triggerVoucherPDFDownload} 
          disabled={currentStatus !== "SUCCESS"}
          className="btn d-flex align-items-center gap-2 px-4 py-2 text-white shadow-sm" 
          style={{ 
            borderRadius: "6px", fontWeight: "600", fontSize: "13px", 
            backgroundColor: currentStatus === "SUCCESS" ? "#2563eb" : "#94a3b8", 
            border: "none", cursor: currentStatus === "SUCCESS" ? "pointer" : "not-allowed" 
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>download</span> Download Payment Voucher PDF
        </button>
      </div>

      {/* Official ERP Sheet Certificate Voucher Frame Box Container */}
      <div className="mx-auto shadow-sm border bg-white text-start mb-5" style={{ maxWidth: "900px", padding: "50px", borderRadius: "10px", boxSizing: "border-box" }}>
        
        {/* ==================== VOUCHER BRAND STRIP SECTION ==================== */}
        <div className="d-flex justify-content-between align-items-start mb-5 pb-4 border-bottom">
          <div>
            <h4 className="m-0 fw-bold text-uppercase tracking-tight" style={{ color: "#1e3a8a", fontSize: "20px" }}>ProcureManage ERP</h4>
            <small className="text-muted fw-semibold text-uppercase" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Corporate Treasury Department</small>
          </div>
          <div className="text-end">
            <span className="d-block fw-bold text-secondary mb-1" style={{ fontSize: "12px", letterSpacing: "1px" }}>PAYMENT VOUCHER</span>
            <span className="font-monospace text-dark fw-bold d-block mb-2" style={{ fontSize: "16px" }}>{payment?.paymentNumber || "—"}</span>
            <span className="badge px-3 py-2 rounded-2" style={{ backgroundColor: badgeBg, color: badgeColor, fontSize: "11px", fontWeight: "700" }}>
              {currentStatus}
            </span>
          </div>
        </div>

        {/* ==================== METADATA ADRESS PARTIES ROW ==================== */}
        <div className="row g-4 mb-5" style={{ fontSize: "13.5px" }}>
          <div className="col-sm-6">
            <span className="text-muted small fw-bold d-block mb-2 text-uppercase tracking-wider" style={{ color: "#64748b" }}>Company Information:</span>
            <strong className="text-dark d-block mb-1">ProcureManage Corporate Industries India Ltd</strong>
            <span className="text-secondary d-block lh-base">
              Synergy Tech Cluster Hub, Corporate Block 14<br />
              Vadodara, Gujarat, India - 390016<br />
              <strong>GSTIN:</strong> 24AAAAB1234C1Z0<br />
              <strong>Corporate Email:</strong> treasury@procuremanage.com<br />
              <strong>Corporate Phone:</strong> +91 265 2345678
            </span>
          </div>

          <div className="col-sm-6">
            <span className="text-muted small fw-bold d-block mb-2 text-uppercase tracking-wider" style={{ color: "#64748b" }}>Vendor Beneficiary Node:</span>
            <strong className="text-dark d-block mb-1">{payment?.vendorName || "—"}</strong>
            <span className="text-secondary d-block lh-base">
              GIDC Development Zone Hub, Section 4A<br />
              Gujarat, India Region Cluster<br />
              <strong>Vendor GST Number:</strong> 24VNDAB9876F1Z2<br />
              <strong>Vendor Email:</strong> supplier.desk@vendor.com
            </span>
          </div>
        </div>

        {/* ==================== CORE LEDGER SUMMARY GRID BOX ==================== */}
        <div className="p-4 rounded-3 border bg-light mb-5" style={{ fontSize: "13.5px" }}>
          <div className="row g-3">
            <div className="col-md-4 mb-2"><span className="text-muted d-block small mb-1">Payment Number:</span><strong className="text-dark font-monospace">{payment?.paymentNumber || "—"}</strong></div>
            <div className="col-md-4 mb-2"><span className="text-muted d-block small mb-1">Invoice Allocation Reference:</span><strong className="text-dark font-monospace">{payment?.invoiceNumber || "—"}</strong></div>
            <div className="col-md-4 mb-2"><span className="text-muted d-block small mb-1">Purchase Order Number:</span><strong className="text-dark font-monospace">{payment?.poNumber || "—"}</strong></div>
            <div className="col-md-4"><span className="text-muted d-block small mb-1">Settlement Disbursed Date:</span><strong className="text-dark">{formatDate(payment?.paymentDate)}</strong></div>
            <div className="col-md-4"><span className="text-muted d-block small mb-1">Payment Method:</span><strong className="text-dark">{payment?.paymentMethod || "—"}</strong></div>
            <div className="col-md-4"><span className="text-muted d-block small mb-1">Reference Number / UTR:</span><strong className="text-dark font-monospace">{payment?.referenceNumber || "—"}</strong></div>
          </div>
        </div>

        {/* ==================== DISBURSEMENT VALUATION SUMMARY LEDGER ==================== */}
        <table className="table table-bordered mb-5 align-middle" style={{ fontSize: "14px" }}>
          <thead className="table-light">
            <tr>
              <th className="fw-semibold text-secondary p-3">Disbursement Allocation Scheme Description</th>
              <th className="text-end fw-semibold text-secondary p-3" style={{ width: "240px" }}>Disbursed Net Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3">
                <strong className="text-dark d-block mb-1">Full Value Clear Settlement Remittance Advice</strong>
                <span className="text-muted small">Electronic money clear fund remittance executed safely over backend clearing nodes.</span>
                {payment?.remarks && (
                  <div className="mt-3 p-2 bg-light rounded border-start border-3" style={{ borderColor: "#cbd5e1" }}>
                    <small className="text-muted d-block fw-bold mb-1 text-uppercase">Voucher Remarks:</small>
                    <span className="text-secondary italic">{payment.remarks}</span>
                  </div>
                )}
              </td>
              <td className="text-end font-monospace fw-bold p-3 text-dark fs-5" style={{ color: "#1e3a8a" }}>
                ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </table>

        {/* ==================== APPROVAL DETAILS STAMP ==================== */}
        <div className="row border-top pt-4 mb-4 text-start" style={{ fontSize: "12px", color: "#475569" }}>
          <div className="col-md-4"><span><strong>Processed By:</strong> System Automated Desk</span></div>
          <div className="col-md-4"><span><strong>Approved By:</strong> Corporate Treasury Auditor</span></div>
          <div className="col-md-4"><span><strong>Generated Timestamp:</strong> {formatDate(payment?.paymentDate)} — 12:45 PM</span></div>
        </div>

        {/* ==================== SEAL VALIDATIONS FOOTER NOTE ==================== */}
        <div className="pt-3 border-top text-muted text-center" style={{ fontSize: "11px", color: "#94a3b8" }}>
          <p className="m-0 italic">"This is a system generated Payment Voucher. No physical signature is required."</p>
        </div>

      </div>
    </AdminLayout>
  );
};

export default PaymentView;
