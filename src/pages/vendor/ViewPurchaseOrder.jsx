import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VendorLayout from "../../components/vendor_layout/VendorLayout";
import vendorPurchaseOrderService from "../../services/vendorPurchaseOrderService";

const ViewPurchaseOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Component Hooks State 
  const [purchaseOrder, setPurchaseOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  // Fetching dynamic lifecycle records stack
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await vendorPurchaseOrderService.getPurchaseOrderById(id);
        setPurchaseOrder(data);
      } catch (err) {
        console.error("Order details fetch failure block:", err);
        setError("Unable to resolve purchase order data profile stack from server.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  // Utility: Dynamic badge styles calculation mapper for system statuses
  const getPOStatusBadge = (status) => {
    const s = (status || "PENDING").toUpperCase();
    if (s === "APPROVED") return "bg-success-subtle text-success border border-success-subtle";
    if (s === "REJECTED") return "bg-danger-subtle text-danger border border-danger-subtle";
    return "bg-warning-subtle text-warning border border-warning-subtle";
  };

  const getInvoiceStatusBadge = (status) => {
    const s = (status || "NOT_CREATED").toUpperCase();
    if (s === "APPROVED") return "bg-success-subtle text-success border border-success-subtle";
    if (s === "REJECTED") return "bg-danger-subtle text-danger border border-danger-subtle";
    if (s === "PENDING_REVIEW") return "bg-warning-subtle text-warning border border-warning-subtle";
    if (s === "PAID") return "bg-primary-subtle text-primary border border-primary-subtle";
    return "bg-secondary-subtle text-secondary border border-secondary-subtle";
  };

  if (loading) {
    return (
      <VendorLayout pageTitle="Loading Order Details...">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "350px" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading system data...</span>
          </div>
        </div>
      </VendorLayout>
    );
  }

  if (error || !purchaseOrder) {
    return (
      <VendorLayout pageTitle="Data Pipeline Disconnected">
        <div className="alert alert-danger py-3 px-4 rounded-3 text-start mb-4">
          <h5 className="fw-bold mb-1">Integration Framework Fault</h5>
          <p className="m-0 small">{error || "Requested Purchase Order profile cannot be generated."}</p>
        </div>
        <button className="btn btn-secondary px-4 py-2 small" onClick={() => navigate("/vendor/purchase-orders")} style={{ fontSize: "13px" }}>
          ← Back to Purchase Orders
        </button>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout pageTitle={`Purchase Order: ${purchaseOrder.poNumber}`} pageSubtitle="Operations / Purchase Orders / Details Summary">
      
      {/* TOP COMPONENT NAVIGATION LINE BAR BUTTON */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button 
          type="button" 
          className="btn btn-link text-decoration-none p-0 d-flex align-items-center gap-1 text-secondary fw-semibold" 
          onClick={() => navigate("/vendor/purchase-orders")}
          style={{ fontSize: "13px" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_back</span>
          Back to Purchase Orders
        </button>
      </div>

      {/* CORE INFO SPLIT PANEL CONTAINER METADATA WIDGET */}
      <div className="card shadow-sm border border-light-subtle rounded-3 overflow-hidden text-start mb-4" style={{ backgroundColor: "#ffffff" }}>
        <div className="p-3 bg-light border-bottom d-flex justify-content-between align-items-center">
          <span className="fw-bold text-dark text-uppercase small" style={{ letterSpacing: "0.5px" }}>Transaction Tracking Parameters</span>
          <div className="d-flex gap-2">
            <span className={`badge px-3 py-1.5 fw-bold rounded-2 ${getPOStatusBadge(purchaseOrder.status)}`} style={{ fontSize: "11px" }}>
              PO: {purchaseOrder.status || "PENDING"}
            </span>
            <span className={`badge px-3 py-1.5 fw-bold rounded-2 ${getInvoiceStatusBadge(purchaseOrder.invoiceStatus)}`} style={{ fontSize: "11px" }}>
              Invoice: {purchaseOrder.invoiceStatus ? purchaseOrder.invoiceStatus.replace("_", " ") : "NOT CREATED"}
            </span>
          </div>
        </div>
        
        <div className="card-body p-4" style={{ fontSize: "13px" }}>
          <div className="row g-4 mb-4">
            <div className="col-md-3">
              <label className="text-muted d-block small mb-1">PO Number</label>
              <strong className="text-dark font-monospace">{purchaseOrder.poNumber}</strong>
            </div>
            <div className="col-md-3">
              <label className="text-muted d-block small mb-1">Vendor Entity</label>
              <strong className="text-dark">{purchaseOrder.vendorName || "—"}</strong>
            </div>
            <div className="col-md-3">
              <label className="text-muted d-block small mb-1">Assigned Employee</label>
              <strong className="text-dark">{purchaseOrder.employeeName || "—"}</strong>
            </div>
            <div className="col-md-3">
              <label className="text-muted d-block small mb-1">Payment Terms</label>
              <strong className="text-dark font-monospace">{purchaseOrder.paymentTerms || "—"}</strong>
            </div>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-md-3">
              <label className="text-muted d-block small mb-1">Order Log Date</label>
              <strong className="text-dark">{formatDate(purchaseOrder.orderDate)}</strong>
            </div>
            <div className="col-md-3">
              <label className="text-muted d-block small mb-1">Expected Delivery Date</label>
              <strong className="text-dark">{formatDate(purchaseOrder.expectedDeliveryDate)}</strong>
            </div>
            <div className="col-md-3">
              <label className="text-muted d-block small mb-1">Billing Address</label>
              <p className="text-secondary m-0" style={{ lineHeight: "1.4" }}>{purchaseOrder.billingAddress || "—"}</p>
            </div>
            <div className="col-md-3">
              <label className="text-muted d-block small mb-1">Delivery Destination</label>
              <p className="text-secondary m-0" style={{ lineHeight: "1.4" }}>{purchaseOrder.deliveryAddress || "—"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ITEM SPECIFICATIONS LINE ENTRIES TABLE BLOCK */}
      <div className="card shadow-sm border border-light-subtle rounded-3 overflow-hidden text-start mb-4" style={{ backgroundColor: "#ffffff" }}>
        <div className="p-3 bg-light border-bottom">
          <span className="fw-bold text-dark text-uppercase small" style={{ letterSpacing: "0.5px" }}>Line Item Inventory Specifications</span>
        </div>
        <div className="table-responsive">
          <table className="table align-middle m-0" style={{ fontSize: "13px" }}>
            <thead className="table-light text-secondary">
              <tr>
                <th style={{ padding: "12px 16px" }}>Item Name</th>
                <th className="text-center" style={{ padding: "12px 16px" }}>Quantity</th>
                <th className="text-end" style={{ padding: "12px 16px" }}>Unit Price</th>
                <th className="text-end" style={{ padding: "12px 16px" }}>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {purchaseOrder.items && purchaseOrder.items.length > 0 ? (
                purchaseOrder.items.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: "12px 16px", fontWeight: "500", color: "#1e293b" }}>{item.itemName}</td>
                    <td className="text-center font-monospace text-secondary" style={{ padding: "12px 16px" }}>{item.quantity}</td>
                    <td className="text-end font-monospace text-secondary" style={{ padding: "12px 16px" }}>₹{parseFloat(item.unitPrice || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                    <td className="text-end font-monospace fw-semibold text-dark" style={{ padding: "12px 16px" }}>₹{parseFloat(item.totalPrice || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted p-4">No line item entries configured inside this purchase record segment.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* LOWER TOTAL SPLIT BILLING BLOCK ROW WIDGET */}
      <div className="row g-4 text-start mb-5">
        <div className="col-md-6">
          <div className="card shadow-sm border border-light-subtle rounded-3 p-4 h-100" style={{ backgroundColor: "#ffffff", fontSize: "13px" }}>
            <label className="text-muted d-block small mb-2 fw-semibold text-uppercase" style={{ letterSpacing: "0.5px" }}>Remarks / Corporate Notes</label>
            <p className="text-secondary m-0 border rounded-3 p-3 bg-light-subtle" style={{ lineHeight: "1.5", minHeight: "75px", fontStyle: purchaseOrder.notes ? "normal" : "italic" }}>
              {purchaseOrder.notes || "No supplemental remarks or urgency descriptors left by procurement officer."}
            </p>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card shadow-sm border border-light-subtle rounded-3 p-4" style={{ backgroundColor: "#ffffff", fontSize: "13px" }}>
            <div className="d-flex justify-content-between align-items-center mb-2.5">
              <span className="text-muted">Sub-Total Remittance:</span>
              <span className="font-monospace text-secondary fw-medium">₹{parseFloat(purchaseOrder.subTotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted">Taxation Assessment Component (GST):</span>
              <span className="font-monospace text-danger fw-medium">+ ₹{parseFloat(purchaseOrder.taxAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
            <hr className="my-2 text-muted" />
            <div className="d-flex justify-content-between align-items-center pt-1">
              <strong className="text-dark" style={{ fontSize: "14px" }}>Grand Total Payable:</strong>
              <strong className="text-primary font-monospace" style={{ fontSize: "16px" }}>
                ₹{parseFloat(purchaseOrder.grandTotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE ACTION BUTTON CONTROLS TOOLBAR PANEL */}
      <div className="d-flex justify-content-end align-items-center gap-2 border-top pt-4 mb-4">
        <button 
          type="button" 
          className="btn btn-outline-secondary px-4 py-2 d-flex align-items-center gap-1.5"
          style={{ borderRadius: "6px", fontWeight: "600", fontSize: "13px", backgroundColor: "#ffffff" }}
          onClick={() => alert("Initializing dispatch print payload execution...")}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>download</span>
          Download Purchase Order
        </button>

        {(purchaseOrder.invoiceStatus || "NOT_CREATED").toUpperCase() === "NOT_CREATED" ? (
          <button 
            type="button" 
            className="btn btn-primary px-4 py-2 text-white d-flex align-items-center gap-1.5"
            style={{ borderRadius: "6px", fontWeight: "600", fontSize: "13px", backgroundColor: "#2563eb", border: "none" }}
            onClick={() => navigate(`/vendor/invoices/create?po=${purchaseOrder.id}`)}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add_notes</span>
            Create Invoice
          </button>
        ) : (
          <button 
            type="button" 
            className="btn btn-success px-4 py-2 text-white d-flex align-items-center gap-1.5"
            style={{ borderRadius: "6px", fontWeight: "600", fontSize: "13px", backgroundColor: "#16a34a", border: "none" }}
            onClick={() => navigate(`/vendor/invoices/view/${purchaseOrder.id}`)}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>visibility</span>
            View Invoice
          </button>
        )}
      </div>

    </VendorLayout>
  );
};

export default ViewPurchaseOrder;