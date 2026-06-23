import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import purchaseOrderService from "../../services/purchaseOrderService";

const AddPurchaseOrder = () => {
  const navigate = useNavigate();

  // Master List arrays loaded dynamically from APIs
  const [vendorsList, setVendorsList] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);
  const [apiError, setApiError] = useState("");

  // Route security shield checkpoint
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Load Dropdown Options from Backend Service
    const loadMasterData = async () => {
      try {
        setApiError("");
        const [vendorsData, employeesData] = await Promise.all([
          purchaseOrderService.getVendors(),
          purchaseOrderService.getEmployees()
        ]);
        setVendorsList(vendorsData || []);
        setEmployeesList(employeesData || []);
      } catch (err) {
        console.error("Master lists dropdown loading failed:", err);
        setApiError("Failed to sync backend vendors or employees dropdown lists.");
      }
    };

    loadMasterData();
  }, [navigate]);

  // 1. Core Form States
  const [orderInfo, setOrderInfo] = useState({
    poNumber: "",
    orderDate: "2025-05-25", 
    referenceNumber: "",
    paymentTerms: "",
    expectedDeliveryDate: "",
    vendor: "", // Will hold selected vendor ID string
    employee: "", // Will hold selected employee ID string
    deliveryAddress: "",
    billingAddress: "",
    notes: ""
  });

  // 2. Dynamic Table Row State
  const [items, setItems] = useState([
    { itemId: "", description: "", quantity: 1, unitPrice: 0, tax: 0, total: 0 }
  ]);

  // 3. Validation Error State Elements
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToastNotification = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3500);
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setOrderInfo(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleItemRowChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;

    if (field === "quantity" || field === "unitPrice" || field === "tax") {
      const q = parseFloat(updatedItems[index].quantity) || 0;
      const p = parseFloat(updatedItems[index].unitPrice) || 0;
      const t = parseFloat(updatedItems[index].tax) || 0;
      
      const sub = q * p;
      updatedItems[index].total = sub + (sub * (t / 100));
    }

    setItems(updatedItems);
  };

  const addRowItem = () => {
    setItems([...items, { itemId: "", description: "", quantity: 1, unitPrice: 0, tax: 0, total: 0 }]);
  };

  const removeRowItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    if (!orderInfo.poNumber.trim()) tempErrors.poNumber = "PO Number is required.";
    if (!orderInfo.orderDate) tempErrors.orderDate = "Order Date is required.";
    if (!orderInfo.vendor) tempErrors.vendor = "Please select a vendor.";
    if (!orderInfo.employee) tempErrors.employee = "Please assign an employee.";
    if (!orderInfo.deliveryAddress.trim()) tempErrors.deliveryAddress = "Delivery Address is required.";
    if (!orderInfo.billingAddress.trim()) tempErrors.billingAddress = "Billing Address is required.";

    let itemErrors = [];
    items.forEach((item, index) => {
      let currentItemError = {};
      if (!item.itemId) {
        currentItemError.itemId = "Required";
        isValid = false;
      }
      if (parseFloat(item.quantity) <= 0) {
        currentItemError.quantity = "Must be > 0";
        isValid = false;
      }
      itemErrors[index] = currentItemError;
    });

    tempErrors.items = itemErrors;
    setErrors(tempErrors);

    return Object.keys(tempErrors).length <= 1 && isValid;
  };

  // FIXED: Connected handleSaveOrder directly to Axios Service API Block with custom layout mapping
  const handleSaveOrder = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Mapping flat fields object directly to your backend strict requirement DTO parameters 
        const poPayload = {
          poNumber: orderInfo.poNumber.trim(),
          orderDate: orderInfo.orderDate,
          referenceNumber: orderInfo.referenceNumber.trim() || null,
          paymentTerms: orderInfo.paymentTerms || null,
          expectedDeliveryDate: orderInfo.expectedDeliveryDate || null,
          deliveryAddress: orderInfo.deliveryAddress.trim(),
          billingAddress: orderInfo.billingAddress.trim(),
          notes: orderInfo.notes.trim() || null,
          vendorId: parseInt(orderInfo.vendor),
          employeeId: parseInt(orderInfo.employee),
          items: items.map(item => ({
            itemName: item.itemId, // Text input item name maps here
            description: item.description.trim() || null,
            quantity: parseInt(item.quantity),
            unitPrice: parseFloat(item.unitPrice),
            tax: parseFloat(item.tax) || 0
          }))
        };

        await purchaseOrderService.createPurchaseOrder(poPayload);
        showToastNotification("Success! Purchase Order saved successfully.", "success");
        
        // Timeout back shift to listings grid overview after 1.5 seconds
        setTimeout(() => {
          navigate("/admin/purchase-orders/list");
        }, 1500);

      } catch (err) {
        console.error("Backend Post Payload submission execution failed: ", err);
        const serverErrorMsg = err.response?.data?.message || "Server error while posting data.";
        showToastNotification(`Request Failed: ${serverErrorMsg}`, "error");
      }
    } else {
      showToastNotification("Validation Failed. Please review highlighted parameters.", "error");
    }
  };

  const subTotal = items.reduce((sum, item) => sum + ((parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0)), 0);
  const totalTax = items.reduce((sum, item) => sum + (((parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0)) * ((parseFloat(item.tax) || 0) / 100)), 0);
  const grandTotal = subTotal + totalTax;

  return (
    <AdminLayout pageTitle="Create Purchase Order" pageSubtitle="Basic Information">
      
      {/* TOAST PANEL */}
      {toast.show && (
        <div style={{ position: "fixed", top: "24px", right: "24px", backgroundColor: toast.type === "success" ? "#ecfdf5" : "#fef2f2", color: toast.type === "success" ? "#065f46" : "#991b1b", border: `1px solid ${toast.type === "success" ? "#a7f3d0" : "#fecaca"}`, borderRadius: "10px", padding: "14px 20px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)", zIndex: 99999, display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", fontWeight: "600" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>{toast.type === "success" ? "check_circle" : "error"}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Navigation Utility Bar to redirect back to list directly */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px", marginTop: "-16px" }}>
        <button 
          onClick={() => navigate("/admin/purchase-orders/list")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            backgroundColor: "#ffffff",
            color: "#475569",
            border: "1px solid #cbd5e1",
            borderRadius: "6px",
            fontWeight: "600",
            fontSize: "13px",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f8fafc"; e.currentTarget.style.color = "#0f172a"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#ffffff"; e.currentTarget.style.color = "#475569"; }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>list_alt</span>
          View Orders List
        </button>
      </div>

      <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "32px", border: "1px solid #e2e8f0", boxSizing: "border-box", width: "100%" }}>
        
        {/* Global API Connection Error display banner row */}
        {apiError && (
          <div style={{ padding: "12px 16px", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "6px", color: "#991b1b", marginBottom: "20px", fontSize: "13.5px", fontWeight: "600" }}>
            {apiError}
          </div>
        )}

        {/* ==================== BASIC INFORMATION SECTION ==================== */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 24px", marginBottom: "24px" }}>
          
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#1e293b", marginBottom: "6px" }}>PO Number <span style={{ color: "#ef4444" }}>*</span></label>
            <input type="text" name="poNumber" placeholder="Enter PO Number" value={orderInfo.poNumber} onChange={handleFieldChange} style={{ width: "100%", padding: "10px 12px", border: `1px solid ${errors.poNumber ? "#ef4444" : "#cbd5e1"}`, borderRadius: "6px", outline: "none", fontSize: "14px" }} />
            {errors.poNumber && <span style={{ color: "#ef4444", fontSize: "11px", display: "block", marginTop: "4px" }}>{errors.poNumber}</span>}
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#1e293b", marginBottom: "6px" }}>Order Date <span style={{ color: "#ef4444" }}>*</span></label>
            <input type="date" name="orderDate" value={orderInfo.orderDate} onChange={handleFieldChange} style={{ width: "100%", padding: "10px 12px", border: `1px solid ${errors.orderDate ? "#ef4444" : "#cbd5e1"}`, borderRadius: "6px", outline: "none", fontSize: "14px", color: "#334155" }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#1e293b", marginBottom: "6px" }}>Reference Number</label>
            <input type="text" name="referenceNumber" placeholder="Enter Reference Number" value={orderInfo.referenceNumber} onChange={handleFieldChange} style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", outline: "none", fontSize: "14px" }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#1e293b", marginBottom: "6px" }}>Payment Terms</label>
            <select name="paymentTerms" value={orderInfo.paymentTerms} onChange={handleFieldChange} style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", outline: "none", fontSize: "14px", backgroundColor: "#fff", cursor: "pointer" }}>
              <option value="">Select Payment Terms</option>
              <option value="Net 30">Net 30</option>
              <option value="Net 60">Net 60</option>
              <option value="COD">Cash On Delivery</option>
            </select>
          </div>

          <div style={{ gridColumn: "span 2" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#1e293b", marginBottom: "6px" }}>Expected Delivery Date</label>
            <input type="date" name="expectedDeliveryDate" value={orderInfo.expectedDeliveryDate} onChange={handleFieldChange} style={{ width: "49.2%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", outline: "none", fontSize: "14px" }} />
          </div>

          {/* VENDOR & EMPLOYEE ASSIGN DYNAMIC DROPDOWNS */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#1e293b", marginBottom: "6px" }}>Vendor <span style={{ color: "#ef4444" }}>*</span></label>
            <select name="vendor" value={orderInfo.vendor} onChange={handleFieldChange} style={{ width: "100%", padding: "10px 12px", border: `1px solid ${errors.vendor ? "#ef4444" : "#cbd5e1"}`, borderRadius: "6px", outline: "none", fontSize: "14px", backgroundColor: "#fff", cursor: "pointer" }}>
              <option value="">Select Vendor</option>
              {vendorsList.map(vendor => (
                <option key={vendor.id} value={vendor.id}>{vendor.vendorName}</option>
              ))}
            </select>
            {errors.vendor && <span style={{ color: "#ef4444", fontSize: "11px", display: "block", marginTop: "4px" }}>{errors.vendor}</span>}
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#1e293b", marginBottom: "6px" }}>Employee <span style={{ color: "#ef4444" }}>*</span></label>
            <select name="employee" value={orderInfo.employee} onChange={handleFieldChange} style={{ width: "100%", padding: "10px 12px", border: `1px solid ${errors.employee ? "#ef4444" : "#cbd5e1"}`, borderRadius: "6px", outline: "none", fontSize: "14px", backgroundColor: "#fff", cursor: "pointer" }}>
              <option value="">Assign Employee</option>
              {employeesList.map(emp => (
                <option key={emp.id} value={emp.id}>{`${emp.firstName} ${emp.lastName}`}</option>
              ))}
            </select>
            {errors.employee && <span style={{ color: "#ef4444", fontSize: "11px", display: "block", marginTop: "4px" }}>{errors.employee}</span>}
          </div>

        </div>

        {/* ==================== ADDRESSES & REMARKS (FULL-WIDTH FORMAT) ==================== */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "28px" }}>
          
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#2563eb", marginBottom: "8px" }}>Delivery Address <span style={{ color: "#ef4444" }}>*</span></label>
            <textarea name="deliveryAddress" placeholder="Enter delivery address" value={orderInfo.deliveryAddress} onChange={handleFieldChange} style={{ width: "100%", height: "70px", padding: "10px 12px", border: `1px solid ${errors.deliveryAddress ? "#ef4444" : "#cbd5e1"}`, borderRadius: "6px", outline: "none", fontSize: "14px", resize: "none" }}></textarea>
            {errors.deliveryAddress && <span style={{ color: "#ef4444", fontSize: "11px", display: "block", marginTop: "4px" }}>{errors.deliveryAddress}</span>}
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#2563eb", marginBottom: "8px" }}>Billing Address <span style={{ color: "#ef4444" }}>*</span></label>
            <textarea name="billingAddress" placeholder="Enter billing address" value={orderInfo.billingAddress} onChange={handleFieldChange} style={{ width: "100%", height: "70px", padding: "10px 12px", border: `1px solid ${errors.billingAddress ? "#ef4444" : "#cbd5e1"}`, borderRadius: "6px", outline: "none", fontSize: "14px", resize: "none" }}></textarea>
            {errors.billingAddress && <span style={{ color: "#ef4444", fontSize: "11px", display: "block", marginTop: "4px" }}>{errors.billingAddress}</span>}
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "8px" }}>Notes / Remarks</label>
            <textarea name="notes" placeholder="Enter any notes or remarks" value={orderInfo.notes} onChange={handleFieldChange} style={{ width: "100%", height: "70px", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", outline: "none", fontSize: "14px", resize: "none" }}></textarea>
          </div>

        </div>

        {/* ==================== ORDER ITEMS GRID LIST ==================== */}
        <div style={{ marginTop: "32px" }}>
          <h4 style={{ margin: "0 0 16px 0", color: "#2563eb", fontSize: "14px", fontWeight: "700", textTransform: "uppercase" }}>Order Items</h4>
          
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px", minWidth: "800px" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                  <th style={{ padding: "12px 8px", width: "40px" }}>#</th>
                  <th style={{ padding: "12px 8px", width: "220px" }}>Item Name <span style={{ color: "#ef4444" }}>*</span></th>
                  <th style={{ padding: "12px 8px" }}>Description</th>
                  <th style={{ padding: "12px 8px", width: "80px" }}>Qty</th>
                  <th style={{ padding: "12px 8px", width: "120px" }}>Unit Price</th>
                  <th style={{ padding: "12px 8px", width: "90px" }}>Tax (%)</th>
                  <th style={{ padding: "12px 8px", width: "110px" }}>Total</th>
                  <th style={{ padding: "12px 8px", width: "50px", textAlign: "center" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => {
                  const itemErr = (errors.items && errors.items[index]) || {};
                  return (
                    <tr key={index} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "12px 8px", color: "#64748b", fontWeight: "600" }}>{index + 1}</td>
                      <td style={{ padding: "12px 8px" }}>
                        {/* INPUT BOX AS STANDARD TEXT KEY FOR REUSE VALUE IN THE ASSIGNMENT CONTEXT RULES */}
                        <input type="text" placeholder="Enter item name" value={item.itemId} onChange={(e) => handleItemRowChange(index, "itemId", e.target.value)} style={{ width: "100%", padding: "8px", border: `1px solid ${itemErr.itemId ? "#ef4444" : "#cbd5e1"}`, borderRadius: "6px", outline: "none" }} />
                        {itemErr.itemId && <span style={{ color: "#ef4444", fontSize: "11px", display: "block", marginTop: "4px" }}>{itemErr.itemId}</span>}
                      </td>
                      <td style={{ padding: "12px 8px" }}><input type="text" placeholder="Description" value={item.description} onChange={(e) => handleItemRowChange(index, "description", e.target.value)} style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "6px", outline: "none", color: "#64748b" }} /></td>
                      <td style={{ padding: "12px 8px" }}><input type="number" value={item.quantity} onChange={(e) => handleItemRowChange(index, "quantity", e.target.value)} style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "6px", outline: "none" }} /></td>
                      <td style={{ padding: "12px 8px" }}><input type="number" placeholder="0.00" value={item.unitPrice || ""} onChange={(e) => handleItemRowChange(index, "unitPrice", e.target.value)} style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "6px", outline: "none" }} /></td>
                      <td style={{ padding: "12px 8px" }}><input type="number" placeholder="0" value={item.tax || ""} onChange={(e) => handleItemRowChange(index, "tax", e.target.value)} style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "6px", outline: "none" }} /></td>
                      <td style={{ padding: "12px 8px", fontWeight: "700", color: "#0f172a" }}>₹{(item.total || 0).toFixed(2)}</td>
                      <td style={{ padding: "12px 8px", textAlign: "center" }}>
                        <button type="button" onClick={() => removeRowItem(index)} disabled={items.length === 1} style={{ background: "none", border: "none", color: items.length === 1 ? "#cbd5e1" : "#ef4444", cursor: items.length === 1 ? "not-allowed" : "pointer" }}>
                          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>delete</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* TABLE ACTIONS */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
            <button type="button" onClick={addRowItem} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", backgroundColor: "#ffffff", color: "#2563eb", border: "1px solid #2563eb", borderRadius: "6px", fontWeight: "600", cursor: "pointer", fontSize: "13px" }}>
              + Add Item
            </button>
            
            <div style={{ width: "240px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#475569" }}><span>Sub Total:</span><strong>₹{subTotal.toFixed(2)}</strong></div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#475569" }}><span>Total Tax:</span><strong>₹{totalTax.toFixed(2)}</strong></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", color: "#0f172a", paddingTop: "6px", borderTop: "1px solid #e2e8f0" }}><span>Grand Total:</span><strong style={{ color: "#2563eb", fontWeight: "700" }}>₹{grandTotal.toFixed(2)}</strong></div>
            </div>
          </div>
          
          {/* FINAL SUBMIT BUTTONS PANEL */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "40px", borderTop: "1px solid #f1f5f9", paddingTop: "20px" }}>
            <button type="button" onClick={() => navigate("/admin/purchase-orders/list")} style={{ padding: "10px 24px", border: "1px solid #cbd5e1", borderRadius: "6px", backgroundColor: "#ffffff", color: "#334155", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>Cancel</button>
            <button type="submit" onClick={handleSaveOrder} style={{ padding: "10px 24px", border: "none", borderRadius: "6px", backgroundColor: "#2563eb", color: "#ffffff", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>Save Purchase Order</button>
          </div>

        </div>

      </div>
    </AdminLayout>
  );
};

export default AddPurchaseOrder;