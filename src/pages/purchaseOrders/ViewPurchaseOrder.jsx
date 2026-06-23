import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import purchaseOrderService from "../../services/purchaseOrderService";

const ViewPurchaseOrder = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Holds alpha-numeric PO Number string passed from router configurations

  // Dynamic States Mappings
  const [poData, setPoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch target record logs from backend database on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchPODetails = async () => {
      try {
        setLoading(true);
        setApiError("");
        const data = await purchaseOrderService.getPurchaseOrderById(id);
        setPoData(data);
      } catch (err) {
        console.error("Error loading targeted purchase order details log:", err);
        setApiError("Failed to fetch purchase order specifications from data servers.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPODetails();
  }, [id, navigate]);

  // DELETE OPERATION EXECUTION TRACE
  const executeDeleteAction = async () => {
    try {
      setApiError("");
      if (poData && poData.id) {
        await purchaseOrderService.deletePurchaseOrder(poData.id);
        setModalOpen(false);
        navigate("/admin/purchase-orders/list");
      }
    } catch (err) {
      console.error("Deletion query crashed:", err);
      setApiError("Server verification pipeline rejected the metadata deletion request.");
      setModalOpen(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout pageTitle="Purchase Order Details" pageSubtitle="Loading...">
        <div style={{ padding: "40px", textAlign: "center", color: "#64748b", fontWeight: "600" }}>
          <div style={{ width: "24px", height: "24px", border: "3px solid #cbd5e1", borderTopColor: "#2563eb", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite", marginRight: "10px", verticalAlign: "middle" }}></div>
          <span>Loading specific purchase order data arrays...</span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </AdminLayout>
    );
  }

  if (apiError || !poData) {
    return (
      <AdminLayout pageTitle="Purchase Order Details" pageSubtitle="Error">
        <div style={{ padding: "20px", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", color: "#991b1b", fontWeight: "600" }}>
          {apiError || "Target procurement log file index not found."}
          <button onClick={() => navigate("/admin/purchase-orders/list")} style={{ display: "block", marginTop: "12px", padding: "6px 12px", backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "4px", cursor: "pointer", fontSize: "13px" }}>Back to List</button>
        </div>
      </AdminLayout>
    );
  }

  // Mappings directly matched with PurchaseOrderResponse attributes keys
  const statusStr = poData.status ? poData.status.toUpperCase() : "PENDING";
  const grandTotalAmt = typeof poData.grandTotal === "number" ? `₹${poData.grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "₹0.00";
  const subTotalAmt = typeof poData.subTotal === "number" ? `₹${poData.subTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "₹0.00";
  const taxAmtValue = typeof poData.taxAmount === "number" ? `₹${poData.taxAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "₹0.00";

  // FIXED: Clean corporate print styles mapping sheet injection config
  const printStyles = `
    @media print {
      /* 1. Hide unwanted components like sidebar, top bar, dynamic button icons */
      nav, 
      aside, 
      header,
      .sidebar,
      .navbar,
      button,
      span.material-symbols-outlined,
      div[style*="justify-content: flex-end"] { 
        display: none !important; 
      }

      /* 2. Stretch container to 100% full printable area and discard shadow depths */
      body, main, #root, div[style*="display: flex"] {
        background: #ffffff !important;
        color: #000000 !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
      }

      /* 3. Re-structure attributes cards layout box borders */
      div[style*="background-color: #ffffff"], 
      div[style*="background-color: #f8fafc"] {
        border: 1px solid #cbd5e1 !important;
        background-color: #ffffff !important;
        border-radius: 6px !important;
        padding: 16px !important;
      }

      /* 4. Fine-tune data table formatting lines consistency */
      table {
        width: 100% !important;
        border-collapse: collapse !important;
      }
      th {
        background-color: #f1f5f9 !important;
        color: #000000 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      tr {
        page-break-inside: avoid !important;
      }

      /* 5. Set up clean A4 portrait sheet margins */
      @page {
        size: A4 portrait;
        margin: 15mm 10mm 15mm 10mm;
      }
    }
  `;

  return (
    <AdminLayout pageTitle={`Purchase Order Details - ${poData.poNumber}`} pageSubtitle={`Home > Purchase Orders > ${poData.poNumber}`}>
      
      {/* CSS Styles Injection Layer Block */}
      <style>{printStyles}</style>

      {/* ==================== ACTION TOOLBAR OVERLAY HEADER ==================== */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginBottom: "20px", marginTop: "-16px" }}>
        <button 
          onClick={() => navigate("/admin/purchase-orders/list")} 
          style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px", fontWeight: "600", color: "#475569", cursor: "pointer" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_back</span> Back to List
        </button>
        
        <button 
          onClick={() => window.print()} 
          style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", backgroundColor: "#2563eb", color: "#ffffff", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>print</span> Print
        </button>

        <button 
          onClick={() => setModalOpen(true)} 
          style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "8px", backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", cursor: "pointer", color: "#ef4444" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>delete</span>
        </button>
      </div>

      {/* ==================== CONTENT CORE FLEX STRUCTURE SECTION ==================== */}
      <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap", width: "100%" }}>
        
        {/* LEFT COMPONENT: Primary Log Summary Data cards */}
        <div style={{ flex: "3 1 650px", display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* HORIZONTAL PROFILE ATTRIBUTES WRAPPER GRID */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "24px" }}>
            
            {/* Box 1: Calendar / PO Identifiers */}
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <div style={{ width: "38px", height: "38px", backgroundColor: "#f0f4fe", color: "#2563eb", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}><span className="material-symbols-outlined" style={{ fontSize: "20px" }}>calendar_today</span></div>
              <div style={{ fontSize: "13px" }}>
                <span style={{ color: "#64748b", display: "block", marginBottom: "2px", fontWeight: "500" }}>PO Number</span>
                <strong style={{ color: "#0f172a" }}>{poData.poNumber}</strong>
                <span style={{ color: "#64748b", display: "block", marginTop: "10px", marginBottom: "2px", fontWeight: "500" }}>Order Date</span>
                <strong style={{ color: "#0f172a" }}>{poData.orderDate}</strong>
                <span style={{ color: "#64748b", display: "block", marginTop: "10px", marginBottom: "2px", fontWeight: "500" }}>Expected Delivery Date</span>
                <strong style={{ color: "#0f172a" }}>{poData.expectedDeliveryDate || "N/A"}</strong>
              </div>
            </div>

            {/* Box 2: Vendor / Employee Contacts Stack */}
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <div style={{ width: "38px", height: "38px", backgroundColor: "#f0fdf4", color: "#16a34a", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}><span className="material-symbols-outlined" style={{ fontSize: "20px" }}>store</span></div>
              <div style={{ fontSize: "13px" }}>
                <span style={{ color: "#64748b", display: "block", marginBottom: "2px", fontWeight: "500" }}>Vendor</span>
                <strong style={{ color: "#0f172a", display: "block", marginBottom: "4px" }}>{poData.vendorName || "N/A"}</strong>
                
                <span style={{ color: "#64748b", display: "block", marginTop: "14px", marginBottom: "2px", fontWeight: "500" }}>Employee Assigned</span>
                <strong style={{ color: "#0f172a", display: "block", marginBottom: "4px" }}>{poData.employeeName || "Unassigned"}</strong>
              </div>
            </div>

            {/* Box 3: Terms Metadata Context */}
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <div style={{ width: "38px", height: "38px", backgroundColor: "#fffbeb", color: "#d97706", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}><span className="material-symbols-outlined" style={{ fontSize: "20px" }}>description</span></div>
              <div style={{ fontSize: "13px" }}>
                <span style={{ color: "#64748b", display: "block", marginBottom: "2px", fontWeight: "500" }}>Payment Terms</span>
                <strong style={{ color: "#0f172a" }}>{poData.paymentTerms || "N/A"}</strong>
                <span style={{ color: "#64748b", display: "block", marginTop: "10px", marginBottom: "2px", fontWeight: "500" }}>Reference Number</span>
                <strong style={{ color: "#0f172a" }}>{poData.referenceNumber || "N/A"}</strong>
                <span style={{ color: "#64748b", display: "block", marginTop: "12px", marginBottom: "4px", fontWeight: "500" }}>Status</span>
                <span className={`badge-status-pill ${statusStr === "APPROVED" ? "badge-active" : statusStr === "PENDING" ? "badge-warning" : "badge-inactive"}`} style={{ padding: "4px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "700" }}>{statusStr}</span>
              </div>
            </div>

            {/* Box 4: Nested Summary Financial Analytics Metrics Box */}
            <div style={{ backgroundColor: "#f8fafc", borderRadius: "10px", padding: "16px", fontSize: "13px", border: "1px solid #e2e8f0" }}>
              <span style={{ color: "#475569", fontWeight: "600", display: "block", marginBottom: "6px" }}>Total Amount</span>
              <h2 style={{ margin: "0 0 12px 0", color: "#2563eb", fontSize: "24px", fontWeight: "800" }}>{grandTotalAmt}</h2>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", marginBottom: "4px" }}><span>Tax Amount:</span><span style={{ fontWeight: "600", color: "#334155" }}>{taxAmtValue}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", paddingTop: "6px", borderTop: "1px solid #e2e8f0" }}><span>Grand Total:</span><span style={{ fontWeight: "700", color: "#2563eb" }}>{grandTotalAmt}</span></div>
            </div>

          </div>

          {/* DYNAMIC LINE ITEMS GRID LIST TABLE */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px 0" }}>Order Items</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
                    <th style={{ padding: "12px 10px", width: "40px", color: "#475569" }}>#</th>
                    <th style={{ padding: "12px 10px", color: "#475569" }}>Item Name</th>
                    <th style={{ padding: "12px 10px", color: "#475569" }}>Description</th>
                    <th style={{ padding: "12px 10px", width: "70px", color: "#475569" }}>Quantity</th>
                    <th style={{ padding: "12px 10px", width: "110px", color: "#475569" }}>Unit Price</th>
                    <th style={{ padding: "12px 10px", width: "75px", color: "#475569" }}>Tax (%)</th>
                    <th style={{ padding: "12px 10px", width: "110px", color: "#475569" }}>Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {poData.items && poData.items.length > 0 ? (
                    poData.items.map((item, index) => {
                      const itemPrice = typeof item.unitPrice === "number" ? `₹${item.unitPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "₹0.00";
                      const itemRowTotal = typeof item.total === "number" ? `₹${item.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "₹0.00";
                      
                      return (
                        <tr key={index} style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "14px 10px", color: "#64748b" }}>{index + 1}</td>
                          <td style={{ padding: "14px 10px", fontWeight: "600", color: "#0f172a" }}>{item.itemName}</td>
                          <td style={{ padding: "14px 10px", color: "#475569" }}>{item.description || "—"}</td>
                          <td style={{ padding: "14px 10px", fontWeight: "600", color: "#0f172a" }}>{item.quantity}</td>
                          <td style={{ padding: "14px 10px" }}>{itemPrice}</td>
                          <td style={{ padding: "14px 10px", color: "#64748b" }}>{item.tax}%</td>
                          <td style={{ padding: "14px 10px", fontWeight: "700", color: "#0f172a" }}>{itemRowTotal}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ padding: "16px", textAlign: "center", color: "#64748b" }}>No line items mapped to this procurement log.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* TOTAL COMPUTATION TABLE CALCULATOR STACK */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
              <div style={{ width: "240px", display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b" }}><span>Sub Total</span><strong style={{ color: "#0f172a" }}>{subTotalAmt}</strong></div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b" }}><span>Total Tax</span><strong style={{ color: "#0f172a" }}>{taxAmtValue}</strong></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", color: "#0f172a", paddingTop: "8px", borderTop: "1px solid #e2e8f0" }}><span>Grand Total</span><strong style={{ color: "#2563eb", fontWeight: "800" }}>{grandTotalAmt}</strong></div>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Sidebar Addresses & Dynamic Notes layout configurations */}
        <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Addresses Card Block */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px", fontSize: "13px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 18px 0", display: "flex", alignItems: "center", gap: "6px" }}><span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#2563eb" }}>location_on</span> Addresses</h3>
            
            <div style={{ marginBottom: "18px" }}>
              <span style={{ color: "#2563eb", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px", marginBottom: "6px" }}><span className="material-symbols-outlined" style={{ fontSize: "14px" }}>circle</span> Delivery Address</span>
              <p style={{ margin: 0, color: "#475569", lineHeight: "1.5", paddingLeft: "18px", whiteSpace: "pre-line" }}>{poData.deliveryAddress}</p>
            </div>

            <hr style={{ border: 0, borderTop: "1px solid #f1f5f9", margin: "18px 0" }} />

            <div>
              <span style={{ color: "#16a34a", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px", marginBottom: "6px" }}><span className="material-symbols-outlined" style={{ fontSize: "14px" }}>circle</span> Billing Address</span>
              <p style={{ margin: 0, color: "#475569", lineHeight: "1.5", paddingLeft: "18px", whiteSpace: "pre-line" }}>{poData.billingAddress}</p>
            </div>
          </div>

          {/* Notes Card Block */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px", fontSize: "13px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 12px 0", display: "flex", alignItems: "center", gap: "6px" }}><span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#eab308" }}>description</span> Notes / Remarks</h3>
            <p style={{ margin: 0, color: "#475569", lineHeight: "1.5" }}>{poData.notes || "No special extra meta description remarks added."}</p>
          </div>

        </div>

      </div>

      {/* ==================== DELETE HTML MODAL ==================== */}
      {modalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 99999 }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", width: "420px", padding: "24px", textAlign: "center", boxSizing: "border-box" }}>
            <div style={{ width: "56px", height: "56px", backgroundColor: "#fef2f2", color: "#ef4444", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px auto" }}><span className="material-symbols-outlined" style={{ fontSize: "32px" }}>warning</span></div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: "0 0 8px 0" }}>Delete Purchase Order</h3>
            <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 24px 0", lineHeight: "1.5" }}>Are you sure you want to delete purchase record logs for <strong>{poData.poNumber}</strong>? This metadata operation cannot be undone.</p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button onClick={() => setModalOpen(false)} style={{ flex: 1, padding: "10px 16px", borderRadius: "8px", border: "1px solid #e2e8f0", backgroundColor: "#ffffff", color: "#334155", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>No, Cancel</button>
              <button onClick={executeDeleteAction} style={{ flex: 1, padding: "10px 16px", borderRadius: "8px", border: "none", backgroundColor: "#ef4444", color: "#ffffff", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default ViewPurchaseOrder;