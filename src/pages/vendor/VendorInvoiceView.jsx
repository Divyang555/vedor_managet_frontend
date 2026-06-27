import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import VendorLayout from "../../components/vendor_layout/VendorLayout";
import vendorInvoiceService from "../../services/vendorInvoiceService";
import { toast } from "react-toastify";

const VendorInvoiceView = () => {
  const { purchaseOrderId } = useParams();
  const navigate = useNavigate();

  // Component Hooks State
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // 🚀 FIXED: Isolated dual loading tracking mechanisms
  const [downloading, setDownloading] = useState(false);
  const [viewingPdf, setViewingPDF] = useState(false);

  // Utility: Date formatter logic converting YYYY-MM-DD to standard DD MMM YYYY
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Lifecycle data loading loop
  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await vendorInvoiceService.viewInvoice(purchaseOrderId);
        setInvoice(data);
      } catch (err) {
        console.error("Invoice details fetch failure block:", err);
        setError("Unable to load Invoice Details.");
        toast.error("Unable to load Invoice Details.");
      } finally {
        setLoading(false);
      }
    };

    if (purchaseOrderId) fetchInvoiceDetails();
  }, [purchaseOrderId]);

  // Invoice Status Badge Renderer
  const getStatusBadgeClass = (status) => {
    const s = (status || "PENDING_REVIEW").toUpperCase();
    if (s === "APPROVED") return "bg-success-subtle text-success border border-success-subtle";
    if (s === "REJECTED") return "bg-danger-subtle text-danger border border-danger-subtle";
    if (s === "PAID") return "bg-primary-subtle text-primary border border-primary-subtle";
    return "bg-warning-subtle text-warning border border-warning-subtle"; // PENDING_REVIEW
  };

  // 🚀 FIXED: Direct Binary Blob Download Handler using exact invoice.id
  const handleDownloadInvoice = async () => {
    if (!invoice || !invoice.id) {
      toast.error("Invoice identifier execution token is missing.");
      return;
    }
    try {
      setDownloading(true);
      // Calling download api using invoice.id instead of purchaseOrderId
      const response = await vendorInvoiceService.downloadInvoice(invoice.id);
      
      if (!response.data || response.data.size === 0) {
        toast.error("Invoice PDF not found.");
        return;
      }

      let filename = `Invoice_${invoice.invoiceNumber || "Data"}.pdf`;
      const disposition = response.headers["content-disposition"];
      if (disposition && disposition.includes("filename=")) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) { 
          filename = matches[1].replace(/['"]/g, "");
        }
      }

      const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const tempAnchor = document.createElement("a");
      tempAnchor.href = blobUrl;
      tempAnchor.setAttribute("download", filename);
      document.body.appendChild(tempAnchor);
      tempAnchor.click();
      
      tempAnchor.parentNode.removeChild(tempAnchor);
      window.URL.revokeObjectURL(blobUrl);
      toast.success("Download initialized successfully.");
    } catch (err) {
      console.error("PDF download crashed:", err);
      toast.error("Unable to download Invoice.");
    } finally {
      setDownloading(false);
    }
  };

  // 🚀 FIXED: Direct Tab Preview View PDF trigger configuration utilizing invoice.id
  const handleViewPDF = async () => {
    if (!invoice || !invoice.id) {
      toast.error("Invoice identifier execution token is missing.");
      return;
    }
    try {
      setViewingPDF(true);
      // Calling download api using invoice.id instead of purchaseOrderId
      const response = await vendorInvoiceService.downloadInvoice(invoice.id);
      
      if (!response.data || response.data.size === 0) {
        toast.error("Invoice PDF template stream is currently empty.");
        return;
      }
      
      const fileBlob = new Blob([response.data], { type: "application/pdf" });
      const fileViewUrl = window.URL.createObjectURL(fileBlob);
      window.open(fileViewUrl, "_blank");
    } catch (err) {
      console.error("PDF presentation viewport fault:", err);
      toast.error("Unable to load PDF document snapshot.");
    } finally {
      setViewingPDF(false);
    }
  };

  if (loading) {
    return (
      <VendorLayout pageTitle="View Invoice">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "350px" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading data streams...</span>
          </div>
        </div>
      </VendorLayout>
    );
  }

  if (error || !invoice) {
    return (
      <VendorLayout pageTitle="View Invoice">
        <div className="alert alert-danger py-3 px-4 rounded-3 text-start mb-4">
          <h5 className="fw-bold mb-1">Error</h5>
          <p className="m-0 small">{error || "Requested Invoice records cannot be generated."}</p>
        </div>
        <button className="btn btn-secondary px-4 py-2" onClick={() => navigate("/vendor/purchase-orders/list")} style={{ fontSize: "13px", borderRadius: "6px" }}>
          ← Back to Purchase Orders
        </button>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout 
      pageTitle="View Invoice" 
      pageSubtitle="View complete invoice information submitted against this purchase order."
    >
      
      {/* BREADCRUMB SYSTEM LINK TRACE */}
      <nav aria-label="breadcrumb" className="text-start mb-4">
        <ol className="breadcrumb small fw-medium" style={{ fontSize: "12px" }}>
          <li className="breadcrumb-item"><Link to="/vendor/dashboard" className="text-decoration-none text-muted">Dashboard</Link></li>
          <li className="breadcrumb-item"><Link to="/vendor/purchase-orders/list" className="text-decoration-none text-muted">My Purchase Orders</Link></li>
          <li className="breadcrumb-item active text-primary" aria-current="page">View Invoice</li>
        </ol>
      </nav>

      {/* ==================== SECTION 1: INVOICE INFORMATION CARD ==================== */}
      <div className="card shadow-sm border border-light-subtle rounded-3 text-start mb-4 bg-white">
        <div className="p-3 bg-light border-bottom text-dark fw-bold small d-flex align-items-center gap-2">
          <span className="material-symbols-outlined text-secondary" style={{ fontSize: "18px" }}>description</span>
          Invoice Information
        </div>
        <div className="card-body p-4">
          <div className="row g-4">
            <div className="col-md-3">
              <label className="text-muted d-block small mb-1">Invoice Number</label>
              <strong className="text-dark font-monospace" style={{ fontSize: "14px" }}>{invoice.invoiceNumber || "—"}</strong>
            </div>
            <div className="col-md-2">
              <label className="text-muted d-block small mb-1">Invoice Date</label>
              <strong className="text-dark">{formatDate(invoice.invoiceDate)}</strong>
            </div>
            <div className="col-md-2">
              <label className="text-muted d-block small mb-1">Due Date</label>
              <strong className="text-dark">{formatDate(invoice.dueDate)}</strong>
            </div>
            <div className="col-md-3">
              <label className="text-muted d-block small mb-1">Invoice Amount</label>
              <strong className="text-primary font-monospace" style={{ fontSize: "15px" }}>
                ₹{parseFloat(invoice.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </strong>
            </div>
            <div className="col-md-2">
              <label className="text-muted d-block small mb-1">Invoice Status</label>
              <div className="pt-0.5">
                <span className={`badge px-3 py-1.5 fw-bold rounded-2 text-uppercase ${getStatusBadgeClass(invoice.status)}`} style={{ fontSize: "11px" }}>
                  {invoice.status ? invoice.status.replace("_", " ") : "PENDING REVIEW"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== SECTION 2 & 3: PURCHASE ORDER & VENDOR SPLIT MATRIX ==================== */}
      <div className="row g-4 text-start mb-4">
        
        {/* Left Side: PO Info */}
        <div className="col-md-6">
          <div className="card shadow-sm border border-light-subtle rounded-3 bg-white h-100">
            <div className="p-3 bg-light border-bottom text-dark fw-bold small d-flex align-items-center gap-2">
              <span className="material-symbols-outlined text-secondary" style={{ fontSize: "18px" }}>article</span>
              Purchase Order Information
            </div>
            <div className="card-body p-4" style={{ fontSize: "13px" }}>
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="text-muted d-block small mb-1">PO Number</label>
                  <strong className="text-dark font-monospace text-primary">{invoice.poNumber || "—"}</strong>
                </div>
                <div className="col-6">
                  <label className="text-muted d-block small mb-1">Payment Terms</label>
                  <strong className="text-dark font-monospace">{invoice.paymentTerms || "—"}</strong>
                </div>
              </div>
              <div className="row g-3">
                <div className="col-6">
                  <label className="text-muted d-block small mb-1">Order Date</label>
                  <strong className="text-dark">{formatDate(invoice.orderDate)}</strong>
                </div>
                <div className="col-6">
                  <label className="text-muted d-block small mb-1">Expected Delivery Date</label>
                  <strong className="text-dark">{formatDate(invoice.expectedDeliveryDate)}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Vendor Info */}
        <div className="col-md-6">
          <div className="card shadow-sm border border-light-subtle rounded-3 bg-white h-100">
            <div className="p-3 bg-light border-bottom text-dark fw-bold small d-flex align-items-center gap-2">
              <span className="material-symbols-outlined text-secondary" style={{ fontSize: "18px" }}>store</span>
              Vendor Information
            </div>
            <div className="card-body p-4" style={{ fontSize: "13px" }}>
              <div className="mb-3">
                <label className="text-muted d-block small mb-1">Vendor Name</label>
                <strong className="text-dark">{invoice.vendorName || "—"}</strong>
              </div>
              <div className="row g-3">
                <div className="col-6">
                  <label className="text-muted d-block small mb-1">Billing Address</label>
                  <p className="text-secondary m-0 small" style={{ lineHeight: "1.4" }}>{invoice.billingAddress || "—"}</p>
                </div>
                <div className="col-6">
                  <label className="text-muted d-block small mb-1">Delivery Address</label>
                  <p className="text-secondary m-0 small" style={{ lineHeight: "1.4" }}>{invoice.deliveryAddress || "—"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ==================== SECTION 4 & 5: AMOUNT SUMMARY & REMARKS SPLIT SECTION ==================== */}
      <div className="row g-4 text-start mb-4">
        
        {/* Remarks Input Textarea Section */}
        <div className="col-md-6">
          <div className="card shadow-sm border border-light-subtle rounded-3 p-4 h-100 bg-white" style={{ fontSize: "13px" }}>
            <label className="form-label text-secondary small fw-bold text-uppercase mb-2" style={{ letterSpacing: "0.5px" }}>Remarks / Vendor Notes</label>
            <textarea 
              className="form-control bg-light-subtle text-secondary small" 
              rows="4" 
              value={invoice.remarks || "No supplementary remarks left against this invoice profile."} 
              readOnly 
              style={{ cursor: "default", resize: "none", fontSize: "13px", lineHeight: "1.5" }}
            />
          </div>
        </div>

        {/* Amount Summary Layout Panel */}
        <div className="col-md-6">
          <div className="card shadow-sm border border-light-subtle rounded-3 p-4 bg-white h-100" style={{ fontSize: "13px" }}>
            <label className="text-secondary small fw-bold text-uppercase mb-3" style={{ letterSpacing: "0.5px" }}>Amount Summary</label>
            <div className="d-flex justify-content-between align-items-center mb-2.5">
              <span className="text-muted">Sub-Total Remittance:</span>
              <span className="font-monospace text-secondary fw-medium">
                ₹{parseFloat(invoice.subTotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted">Taxation Assessment Component (GST):</span>
              <span className="font-monospace text-danger fw-medium">
                + ₹{parseFloat(invoice.taxAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <hr className="my-2 text-muted" />
            <div className="d-flex justify-content-between align-items-center pt-1">
              <strong className="text-dark" style={{ fontSize: "14px" }}>Grand Total Payable:</strong>
              <strong className="text-primary font-monospace" style={{ fontSize: "16px" }}>
                ₹{parseFloat(invoice.grandTotal || invoice.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </strong>
            </div>
          </div>
        </div>

      </div>

      {/* ==================== SECTION 6: INVOICE PDF EXTRA PANEL ==================== */}
      <div className="card shadow-sm border border-light-subtle rounded-3 text-start mb-5 bg-white">
        <div className="p-3 bg-light border-bottom text-dark fw-bold small d-flex align-items-center gap-2">
          <span className="material-symbols-outlined text-secondary" style={{ fontSize: "18px" }}>picture_as_pdf</span>
          Invoice PDF Document
        </div>
        <div className="card-body p-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="rounded-2 bg-danger-subtle text-danger d-flex align-items-center justify-content-center" style={{ width: "42px", height: "42px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>picture_as_pdf</span>
            </div>
            <div>
              <strong className="text-dark d-block mb-0.5">{invoice.invoiceNumber ? `${invoice.invoiceNumber}.pdf` : "Invoice_Document.pdf"}</strong>
              <span className="text-muted small" style={{ fontSize: "11px" }}>Format: PDF File • Click actions to trigger view/download</span>
            </div>
          </div>
          <div className="d-flex gap-2">
            {/* 🚀 FIXED: Disabled while processing with inline bootstrap loading state spinner layout */}
            <button 
              type="button" 
              disabled={downloading || viewingPdf}
              className="btn btn-sm btn-outline-secondary px-3 py-2 d-flex align-items-center gap-1" 
              onClick={handleViewPDF} 
              style={{ borderRadius: "6px", fontSize: "12px", fontWeight: "600" }}
            >
              {viewingPdf ? (
                <span className="spinner-border spinner-border-sm me-1" role="status" style={{ width: "12px", height: "12px" }}></span>
              ) : (
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>visibility</span>
              )}
              {viewingPdf ? "Loading Preview..." : "View PDF"}
            </button>
            
            <button 
              type="button" 
              disabled={downloading || viewingPdf}
              className="btn btn-sm btn-outline-success px-3 py-2 d-flex align-items-center gap-1" 
              onClick={handleDownloadInvoice} 
              style={{ borderRadius: "6px", fontSize: "12px", fontWeight: "600" }}
            >
              {downloading ? (
                <span className="spinner-border spinner-border-sm me-1" role="status" style={{ width: "12px", height: "12px" }}></span>
              ) : (
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>download</span>
              )}
              {downloading ? "Downloading..." : "Download PDF"}
            </button>
          </div>
        </div>
      </div>

      {/* INTERACTIVE ACTION PANEL TOOLBAR CONTROL FOOTER */}
      <div className="d-flex justify-content-end align-items-center gap-2 border-top pt-4 mb-4">
        <button 
          type="button" 
          className="btn btn-outline-secondary px-4 py-2" 
          onClick={() => navigate("/vendor/purchase-orders/list")}
          style={{ borderRadius: "6px", fontWeight: "600", fontSize: "13px", backgroundColor: "#ffffff" }}
        >
          ← Back to Purchase Orders
        </button>
        
       
      </div>

    </VendorLayout>
  );
};

export default VendorInvoiceView;