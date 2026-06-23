import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import vendorService from "../../services/vendorService";
import "../../vendor.css";

const AddVendor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    vendorCode: "",
    vendorName: "",
    companyName: "",
    email: "",
    mobile: "",
    gstNumber: "",
    address: "",
    username: "",
    password: "",
    status: "Active"
  });
  const [errors, setErrors] = useState({});

  // Clean common input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    let err = {};
    if (!formData.vendorCode.trim()) err.vendorCode = "Vendor Code is required";
    if (!formData.vendorName.trim()) err.vendorName = "Vendor Name is required";
    if (!formData.companyName.trim()) err.companyName = "Company Name is required";
    if (!formData.username.trim()) err.username = "Username mapping token required";
    if (!formData.password.trim()) err.password = "Password authentication required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) err.email = "Invalid format structure matching targets";
    if (!/^\d{10}$/.test(formData.mobile)) err.mobile = "Mobile sequence pattern must be 10 numeric digits";
    if (formData.gstNumber.length !== 15) err.gstNumber = "GST element string length must be 15 characters";
    
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await vendorService.createVendor(formData);
      navigate("/vendors");
    } catch (err) { 
      console.error("Error creating vendor:", err); 
    }
  };

  return (
    <AdminLayout 
    pageTitle="Add New Vendor" 
    pageSubtitle="Create a secure entry portal configuration profile for registered entities."
  >
      <form onSubmit={handleSave} className="form-layout-frame" style={{ flexDirection: "column" }}>
        <div style={{ display: "flex", gap: "24px", width: "100%", flexWrap: "wrap" }}>
          
          {/* Left Column: Vendor Information */}
          <div className="form-section-column" style={{ minWidth: "300px" }}>
            <h4 className="section-headline">Vendor Information</h4>
            
            <div className="input-group-item">
              <label>Vendor Code *</label>
              <input type="text" name="vendorCode" className="base-input-text" value={formData.vendorCode} onChange={handleInputChange} placeholder="Enter vendor code"/>
              {errors.vendorCode && <span className="input-err-msg">{errors.vendorCode}</span>}
            </div>
            
            <div className="input-group-item">
              <label>Company Name *</label>
              <input type="text" name="companyName" className="base-input-text" value={formData.companyName} onChange={handleInputChange} placeholder="Enter company name"/>
              {errors.companyName && <span className="input-err-msg">{errors.companyName}</span>}
            </div>
            
            <div className="input-group-item">
              <label>Vendor Name *</label>
              <input type="text" name="vendorName" className="base-input-text" value={formData.vendorName} onChange={handleInputChange} placeholder="Enter vendor name"/>
              {errors.vendorName && <span className="input-err-msg">{errors.vendorName}</span>}
            </div>
            
            <div className="input-group-item">
              <label>Email address *</label>
              <input type="text" name="email" className="base-input-text" value={formData.email} onChange={handleInputChange} placeholder="Enter email address"/>
              {errors.email && <span className="input-err-msg">{errors.email}</span>}
            </div>
            
            <div className="input-group-item">
              <label>Mobile Number *</label>
              <input type="text" name="mobile" className="base-input-text" value={formData.mobile} onChange={handleInputChange} placeholder="Enter mobile number"/>
              {errors.mobile && <span className="input-err-msg">{errors.mobile}</span>}
            </div>
            
            <div className="input-group-item">
              <label>GST Number *</label>
              <input type="text" name="gstNumber" className="base-input-text" value={formData.gstNumber} onChange={handleInputChange} placeholder="Enter 15-digit GST number"/>
              {errors.gstNumber && <span className="input-err-msg">{errors.gstNumber}</span>}
            </div>
            
            <div className="input-group-item">
              <label>Address Location</label>
              <textarea name="address" className="base-textarea-text" rows="2" value={formData.address} onChange={handleInputChange} placeholder="Enter address details"></textarea>
              {errors.address && <span className="input-err-msg">{errors.address}</span>}
            </div>
          </div>
          
          {/* Right Column: Account Information & Status */}
          <div className="form-section-column" style={{ minWidth: "300px" }}>
            <h4 className="section-headline">Account Information</h4>
            
            <div className="input-group-item">
              <label>Username *</label>
              <input 
                type="text" 
                name="username" 
                className="base-input-text" 
                value={formData.username || ""} 
                onChange={handleInputChange} 
                placeholder="Enter username"
              />
              {errors.username && <span className="input-err-msg">{errors.username}</span>}
            </div>
            
            <div className="input-group-item">
              <label>Password *</label>
              <input type="password" name="password" className="base-input-text" value={formData.password} onChange={handleInputChange} placeholder="Enter password"/>
              {errors.password && <span className="input-err-msg">{errors.password}</span>}
            </div>
            
            <h4 className="section-headline" style={{ marginTop: "24px" }}>Status</h4>
            <div className="switch-container">
              <span style={{ fontSize: "13px", fontWeight: "500" }}>Active Status:</span>
              <input type="checkbox" id="statusToggle" className="switch-input" checked={formData.status === "Active"} onChange={e => setFormData({...formData, status: e.target.checked ? "Active" : "Inactive"})} />
              <label htmlFor="statusToggle" className="switch-label"></label>
            </div>
          </div>
          
        </div>
        
        {/* Footer Action Buttons */}
        <div className="form-footer-action-row">
          <button type="button" className="btn-ui-dismiss" onClick={() => navigate("/vendors")} style={{ marginRight: "auto" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "16px", verticalAlign: "middle", marginRight: "4px" }}>list</span>
            View List
          </button>
          <button type="button" className="btn-ui-dismiss" onClick={() => navigate("/admin/dashboard")}>Cancel</button>
          <button type="button" className="btn-ui-reset" onClick={() => setFormData({vendorCode:"", vendorName:"", companyName:"", email:"", mobile:"", gstNumber:"", address:"", username:"", password:"", status:"Active"})}>Reset</button>
          <button type="submit" className="btn-action-trigger">Save Vendor</button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AddVendor;