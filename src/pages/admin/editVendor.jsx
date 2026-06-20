import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import vendorService from "../../services/vendorService.js";
import "../../vendor.css";

const EditVendor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [errorBanner, setErrorBanner] = useState("");
  const [formData, setFormData] = useState({
    vendorCode: "",
    companyName: "",
    vendorName: "",
    email: "",
    mobile: "",
    gstNumber: "",
    address: "",
    username: "",
    status: "Active"
  });

  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    vendorService.getVendorById(id)
      .then((data) => {
        if (data) {
          // NESTED USER OBJECT CHECK:
          // Agar data.user ek object hai, toh uske andar se `.username` nikalega.
          // Agar plain string hai ya directly data.username hai, toh use le lega.
          let extractedUsername = "";
          if (data.user && typeof data.user === "object") {
            extractedUsername = data.user.username || "";
          } else {
            extractedUsername = data.username || data.user || data.userName || "";
          }

          setFormData({
            id: data.id,
            vendorCode: data.vendorCode || "",
            companyName: data.companyName || data.company || data.company_name || "",
            vendorName: data.vendorName || "",
            email: data.email || "",
            mobile: data.mobile || "",
            gstNumber: data.gstNumber || "",
            address: data.address || data.addressLocation || "",
            username: extractedUsername, // <-- FIXED HERE
            status: data.status || "Active"
          });
        }
      })
      .catch((err) => {
        console.error("Fetch Edit Data Error: ", err);
        setErrorBanner("Failed to retrieve existing vendor data details.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await vendorService.updateVendor(id, formData);
      navigate("/vendors");
    } catch (err) {
      console.error("Update Error: ", err);
      setErrorBanner("Failed to push update requests modification data.");
    }
  };

  if (loading) {
    return (
      <AdminLayout pageTitle="Edit Vendor" breadcrumbs={["Dashboard", "Vendors", "Edit"]}>
        <div className="overlay-loader-shell"><div className="loader-circle"></div></div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Edit Vendor" breadcrumbs={["Dashboard", "Vendors", "Edit Vendor"]}>
      {errorBanner && <div className="alert-msg alert-error">{errorBanner}</div>}
      
      <form onSubmit={handleUpdate} className="form-layout-frame" style={{ flexDirection: "column", width: "100%" }}>
        <div style={{ display: "flex", gap: "24px", width: "100%", flexWrap: "wrap" }}>
          
          {/* Left Column: Vendor Information */}
          <div className="form-section-column" style={{ minWidth: "300px" }}>
            <h4 className="section-headline">Vendor Information</h4>
            
            <div className="input-group-item">
              <label>Vendor Code</label>
              <input type="text" className="base-input-text" value={formData.vendorCode} disabled style={{ backgroundColor: "#f1f5f9", cursor: "not-allowed" }}/>
            </div>
            
            <div className="input-group-item">
              <label>Company Name *</label>
              <input type="text" name="companyName" className="base-input-text" value={formData.companyName} onChange={handleInputChange} placeholder="Enter company name"/>
            </div>
            
            <div className="input-group-item">
              <label>Vendor Name *</label>
              <input type="text" name="vendorName" className="base-input-text" value={formData.vendorName} onChange={handleInputChange}/>
            </div>
            
            <div className="input-group-item">
              <label>Email address *</label>
              <input type="text" name="email" className="base-input-text" value={formData.email} onChange={handleInputChange}/>
            </div>
            
            <div className="input-group-item">
              <label>Mobile *</label>
              <input type="text" name="mobile" className="base-input-text" value={formData.mobile} onChange={handleInputChange}/>
            </div>
            
            <div className="input-group-item">
              <label>GST Number *</label>
              <input type="text" name="gstNumber" className="base-input-text" value={formData.gstNumber} onChange={handleInputChange}/>
            </div>
            
            <div className="input-group-item">
              <label>Address Location</label>
              <textarea name="address" className="base-textarea-text" rows="2" value={formData.address} onChange={handleInputChange}></textarea>
            </div>
          </div>
          
          {/* Right Column: Account & Status */}
          <div className="form-section-column" style={{ minWidth: "300px" }}>
            <h4 className="section-headline">Account Information</h4>
            
            <div className="input-group-item">
              <label>Username</label>
              <input type="text" name="username" className="base-input-text" value={formData.username || ""} onChange={handleInputChange} placeholder="Enter username"/>
            </div>
            
            <h4 className="section-headline" style={{ marginTop: "24px" }}>Status Configuration</h4>
            <div className="switch-container">
              <span style={{ fontSize: "13px", fontWeight: "500" }}>Active State:</span>
              <input type="checkbox" id="statusToggleEdit" className="switch-input" checked={String(formData.status).toLowerCase() === "active"} onChange={e => setFormData({...formData, status: e.target.checked ? "Active" : "Inactive"})} />
              <label htmlFor="statusToggleEdit" className="switch-label"></label>
            </div>
          </div>
          
        </div>
        
        <div className="form-footer-action-row">
          <button type="button" className="btn-ui-dismiss" onClick={() => navigate("/vendors")}>Cancel</button>
          <button type="submit" className="btn-action-trigger">Update Vendor</button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default EditVendor;