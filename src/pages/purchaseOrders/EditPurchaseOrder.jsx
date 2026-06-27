import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import purchaseOrderService from "../../services/purchaseOrderService";
import axios from "axios";

const EditPurchaseOrder = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Holds the database Primary Key ID context

  // Core Form States
  const [formData, setFormData] = useState({
    id: null,
    poNumber: "",
    orderDate: "",
    referenceNumber: "",
    paymentTerms: "Net 30",
    expectedDeliveryDate: "",
    notes: "",
    vendorId: "",
    employeeId: "",
    deliveryAddress: "",
    billingAddress: "",
    items: []
  });

  // Dropdowns state lists
  const [vendorsList, setVendorsList] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [apiError, setApiError] = useState("");

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

  // 1. Fetch form dependencies and existing order data on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const initEditPageData = async () => {
      try {
        setLoading(true);
        setApiError("");

        // Parallel API calls for dropdown lookups
        const [vendors, employees] = await Promise.all([
          purchaseOrderService.getVendors(),
          purchaseOrderService.getEmployees()
        ]);

        setVendorsList(vendors || []);
        setEmployeesList(employees || []);

        // 🚀 FIXED: Calling the explicit database ID endpoint directly via axios to match your Spring Boot controller
        const response = await axios.get(`http://localhost:8080/purchase-orders/view/id/${id}`, getRequestConfig());
        const existingPo = response.data;

        if (existingPo) {
          setFormData({
            id: existingPo.id,
            poNumber: existingPo.poNumber || "",
            orderDate: existingPo.orderDate || "",
            referenceNumber: existingPo.referenceNumber || "",
            paymentTerms: existingPo.paymentTerms || "Net 30",
            expectedDeliveryDate: existingPo.expectedDeliveryDate || "",
            notes: existingPo.notes || "",
            vendorId: existingPo.vendorId || (existingPo.vendor ? existingPo.vendor.id : ""),
            employeeId: existingPo.employeeId || "",
            deliveryAddress: existingPo.deliveryAddress || "",
            billingAddress: existingPo.billingAddress || "",
            items: existingPo.items || []
          });
        }
      } catch (err) {
        console.error("Failed loading configurations for edit wizard:", err);
        setApiError("Failed to pull operational data logs from central server.");
      } finally {
        setLoading(false);
      }
    };

    if (id) initEditPageData();
  }, [id, navigate]);

  // Handle generic inputs change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 2. Grid Items Handlers
  const handleItemRowChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;

    // Auto calculate individual row total if qty or price changes
    if (field === "quantity" || field === "unitPrice" || field === "tax") {
      const q = parseFloat(updatedItems[index].quantity) || 0;
      const p = parseFloat(updatedItems[index].unitPrice) || 0;
      const t = parseFloat(updatedItems[index].tax) || 0;
      
      const baseTotal = q * p;
      const taxComponent = baseTotal * (t / 100);
      updatedItems[index].total = baseTotal + taxComponent;
    }

    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const addNewItemRow = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { itemName: "", description: "", quantity: 1, unitPrice: 0, tax: 18, total: 0 }]
    }));
  };

  const removeItemRow = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  // 3. Dynamic Totals Computations
  const calculateOrderTotals = () => {
    let subTotal = 0;
    let totalTax = 0;

    if (Array.isArray(formData.items)) {
      formData.items.forEach((item) => {
        const q = parseFloat(item.quantity) || 0;
        const p = parseFloat(item.unitPrice) || 0;
        const t = parseFloat(item.tax) || 0;

        const base = q * p;
        subTotal += base;
        totalTax += base * (t / 100);
      });
    }

    return {
      subTotal,
      totalTax,
      grandTotal: subTotal + totalTax
    };
  };

  const totals = calculateOrderTotals();

  // 4. Submit Updated Data Payload to Backend REST PUT endpoint
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitLoading(true);
      setApiError("");

      const finalPayload = {
        ...formData,
        subTotal: totals.subTotal,
        taxAmount: totals.totalTax,
        grandTotal: totals.grandTotal
      };

      // 🚀 FIXED: Pointing PUT request exactly to match your backend update mapping base URL without admin prefix
      await axios.put(`http://localhost:8080/purchase-orders/${formData.id}`, finalPayload, getRequestConfig());
      navigate("/admin/purchase-orders");
    } catch (err) {
      console.error("Failed to commit update data flow:", err);
      setApiError("Backend rejected the modified purchase order payload parameters.");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout pageTitle="Edit Purchase Order" pageSubtitle="Loading structure...">
        <div style={{ padding: "60px", textAlign: "center", color: "#64748b" }}>
          <div style={{ width: "20px", height: "20px", border: "2px solid #cbd5e1", borderTopColor: "#2563eb", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite", marginRight: "10px", verticalAlign: "middle" }}></div>
          <span>Loading database state configurations...</span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Edit Purchase Order" pageSubtitle={`Modify data entries for ${formData.poNumber}`}>
      <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        
        {apiError && (
          <div style={{ padding: "12px 16px", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "6px", color: "#991b1b", fontWeight: "600", fontSize: "13px" }}>
            {apiError}
          </div>
        )}

        {/* ==================== SECTION 1: ORDER INFORMATION ==================== */}
        <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px" }}>
          <h3 style={{ color: "#2563eb", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>1. Order Information</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>PO Number *</label>
              <input type="text" name="poNumber" value={formData.poNumber} disabled style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "6px", backgroundColor: "#f8fafc", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>Order Date *</label>
              <input type="date" name="orderDate" value={formData.orderDate} onChange={handleInputChange} required style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "6px", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>Reference Number</label>
              <input type="text" name="referenceNumber" value={formData.referenceNumber} onChange={handleInputChange} style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "6px", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>Payment Terms *</label>
              <select name="paymentTerms" value={formData.paymentTerms} onChange={handleInputChange} style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "6px", boxSizing: "border-box" }}>
                <option value="Net 15">Net 15</option>
                <option value="Net 30">Net 30</option>
                <option value="Net 45">Net 45</option>
                <option value="Due on Receipt">Due on Receipt</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>Expected Delivery Date *</label>
              <input type="date" name="expectedDeliveryDate" value={formData.expectedDeliveryDate} onChange={handleInputChange} required style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "6px", boxSizing: "border-box" }} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows="2" style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "6px", boxSizing: "border-box", resize: "vertical" }}></textarea>
            </div>
          </div>
        </div>

        {/* ==================== SECTION 2: VENDOR & EMPLOYEE INFORMATION ==================== */}
        <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px" }}>
          <h3 style={{ color: "#2563eb", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>2. Vendor & Employee Information</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>Vendor *</label>
              <select name="vendorId" value={formData.vendorId} onChange={handleInputChange} required style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "6px", boxSizing: "border-box" }}>
                <option value="">Select Vendor</option>
                {vendorsList.map((v) => <option key={v.id} value={v.id}>{v.vendorName}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>Assigned Employee *</label>
              <select name="employeeId" value={formData.employeeId} onChange={handleInputChange} required style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "6px", boxSizing: "border-box" }}>
                <option value="">Select Employee</option>
                {employeesList.map((e) => <option key={e.id} value={e.id}>{`${e.firstName} ${e.lastName}`}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>Delivery Address *</label>
              <textarea name="deliveryAddress" value={formData.deliveryAddress} onChange={handleInputChange} required rows="2" style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "6px", boxSizing: "border-box" }}></textarea>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>Billing Address *</label>
              <textarea name="billingAddress" value={formData.billingAddress} onChange={handleInputChange} required rows="2" style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "6px", boxSizing: "border-box" }}></textarea>
            </div>
          </div>
        </div>

        {/* ==================== SECTION 3 & 4: ITEMS & SUMMARY MANAGEMENT ==================== */}
        <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" }}>
          
          {/* Table Grid list view */}
          <div style={{ flex: "3 1 600px", backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px" }}>
            <h3 style={{ color: "#2563eb", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>3. Order Items</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>
                    <th style={{ padding: "10px", width: "40px" }}>#</th>
                    <th style={{ padding: "10px" }}>Item Name</th>
                    <th style={{ padding: "10px" }}>Description</th>
                    <th style={{ padding: "10px", width: "70px" }}>Quantity</th>
                    <th style={{ padding: "10px", width: "100px" }}>Unit Price</th>
                    <th style={{ padding: "10px", width: "70px" }}>Tax (%)</th>
                    <th style={{ padding: "10px", width: "100px" }}>Total</th>
                    <th style={{ padding: "10px", width: "50px", textAlign: "center" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(formData.items) && formData.items.map((item, index) => (
                    <tr key={index} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "10px", color: "#64748b" }}>{index + 1}</td>
                      <td style={{ padding: "6px" }}><input type="text" value={item.itemName} onChange={(e) => handleItemRowChange(index, "itemName", e.target.value)} required style={{ width: "100%", padding: "6px", border: "1px solid #cbd5e1", borderRadius: "4px" }} /></td>
                      <td style={{ padding: "6px" }}><input type="text" value={item.description || ""} onChange={(e) => handleItemRowChange(index, "description", e.target.value)} style={{ width: "100%", padding: "6px", border: "1px solid #cbd5e1", borderRadius: "4px" }} /></td>
                      <td style={{ padding: "6px" }}><input type="number" value={item.quantity} onChange={(e) => handleItemRowChange(index, "quantity", parseInt(e.target.value) || 0)} min="1" required style={{ width: "100%", padding: "6px", border: "1px solid #cbd5e1", borderRadius: "4px" }} /></td>
                      <td style={{ padding: "6px" }}><input type="number" value={item.unitPrice} onChange={(e) => handleItemRowChange(index, "unitPrice", parseFloat(e.target.value) || 0)} min="0" required style={{ width: "100%", padding: "6px", border: "1px solid #cbd5e1", borderRadius: "4px" }} /></td>
                      <td style={{ padding: "6px" }}><input type="number" value={item.tax} onChange={(e) => handleItemRowChange(index, "tax", parseFloat(e.target.value) || 0)} style={{ width: "100%", padding: "6px", border: "1px solid #cbd5e1", borderRadius: "4px" }} /></td>
                      <td style={{ padding: "10px", fontWeight: "600" }}>₹{(item.total || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                      <td style={{ padding: "6px", textAlign: "center" }}>
                        <button type="button" onClick={() => removeItemRow(index)} disabled={formData.items.length === 1} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}><span className="material-symbols-outlined" style={{ fontSize: "18px" }}>delete</span></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button type="button" onClick={addNewItemRow} style={{ marginTop: "16px", padding: "8px 14px", border: "1px dashed #2563eb", borderRadius: "6px", color: "#2563eb", backgroundColor: "transparent", fontWeight: "600", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>add</span> Add New Item
            </button>
          </div>

          {/* Totals computation sidebar summary */}
          <div style={{ flex: "1 1 250px", backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px" }}>
            <h3 style={{ color: "#2563eb", fontSize: "14px", fontWeight: "700", margin: "0 0 16px 0" }}>4. Order Summary</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#475569" }}><span>Sub Total (₹)</span><strong style={{ color: "#0f172a" }}>{totals.subTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong></div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#475569" }}><span>Total Tax (₹)</span><strong style={{ color: "#0f172a" }}>{totals.totalTax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong></div>
              <hr style={{ border: 0, borderTop: "1px solid #e2e8f0", margin: "4px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", color: "#16a34a", fontWeight: "700" }}><span>Grand Total (₹)</span><span>{totals.grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span></div>
            </div>
          </div>

        </div>

        {/* ==================== ACTION FOOTER TOOLBAR ==================== */}
        <div style={{ display: "flex", gap: "12px", borderTop: "1px solid #e2e8f0", paddingTop: "20px", marginTop: "10px" }}>
          <button type="submit" disabled={submitLoading} style={{ padding: "10px 20px", backgroundColor: "#16a34a", color: "#ffffff", border: "none", borderRadius: "6px", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>save</span> {submitLoading ? "Updating..." : "Update Purchase Order"}
          </button>
          <button type="button" onClick={() => navigate("/admin/purchase-orders")} style={{ padding: "10px 20px", backgroundColor: "#ffffff", color: "#475569", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>Cancel</button>
        </div>

      </form>
    </AdminLayout>
  );
};

export default EditPurchaseOrder;