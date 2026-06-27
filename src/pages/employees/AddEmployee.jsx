import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import employeeService from "../../services/employeeService";

const AddEmployee = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  
  const [formData, setFormData] = useState({
    employeeCode: "", firstName: "", lastName: "", email: "", mobile: "",
    department: "", designation: "", joiningDate: "", salary: "", profileImageUrl: "", active: true
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File memory footprint layout out of bounds! Choose an image under 2MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profileImageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStatusChange = (statusValue) => {
    setFormData((prev) => ({ ...prev, active: statusValue }));
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to clear all dynamic inputs?")) {
      setFormData({
        employeeCode: "", firstName: "", lastName: "", email: "", mobile: "",
        department: "", designation: "", joiningDate: "", salary: "", profileImageUrl: "", active: true
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setApiError("");
      const payload = { ...formData, salary: parseFloat(formData.salary) || 0.0 };
      await employeeService.saveEmployee(payload);
      navigate("/admin/employees/list"); 
    } catch (err) {
      console.error("Database schema transaction rejected payload:", err);
      setApiError(err.response?.data || "Database integrity validation rejected the structural entries.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout pageTitle="Add New Employee" pageSubtitle="Home / Employees / Add New">
      <form onSubmit={handleSubmit} className="p-4 bg-white border rounded-3 shadow-sm mx-auto" style={{ maxWidth: "1150px" }}>
        
        {apiError && <div className="alert alert-danger py-2 fs-6 mb-3">{apiError}</div>}
        
        <h5 className="text-primary fw-bold mb-4">Employee Information</h5>
        
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <label className="form-label fw-semibold text-dark small mb-2">Employee Code *</label>
            <input type="text" className="form-control py-2" name="employeeCode" placeholder="Enter employee code" value={formData.employeeCode} onChange={handleChange} required style={{ borderRadius: "6px", fontSize: "14px" }} />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold text-dark small mb-2">First Name *</label>
            <input type="text" className="form-control py-2" name="firstName" placeholder="Enter first name" value={formData.firstName} onChange={handleChange} required style={{ borderRadius: "6px", fontSize: "14px" }} />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold text-dark small mb-2">Last Name *</label>
            <input type="text" className="form-control py-2" name="lastName" placeholder="Enter last name" value={formData.lastName} onChange={handleChange} required style={{ borderRadius: "6px", fontSize: "14px" }} />
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold text-dark small mb-2">Email *</label>
            <input type="email" className="form-control py-2" name="email" placeholder="Enter email address" value={formData.email} onChange={handleChange} required style={{ borderRadius: "6px", fontSize: "14px" }} />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold text-dark small mb-2">Mobile *</label>
            <input type="text" className="form-control py-2" name="mobile" placeholder="Enter mobile number" value={formData.mobile} onChange={handleChange} required style={{ borderRadius: "6px", fontSize: "14px" }} />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold text-dark small mb-2">Department *</label>
            <select className="form-select py-2" name="department" value={formData.department} onChange={handleChange} required style={{ borderRadius: "6px", fontSize: "14px", backgroundColor: "#ffffff" }}>
              <option value="">Select Department</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Procurement">Procurement</option>
              <option value="Finance">Finance</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold text-dark small mb-2">Designation *</label>
            <select className="form-select py-2" name="designation" value={formData.designation} onChange={handleChange} required style={{ borderRadius: "6px", fontSize: "14px", backgroundColor: "#ffffff" }}>
              <option value="">Select Designation</option>
              <option value="Software Engineer">Software Engineer</option>
              <option value="HR Manager">HR Manager</option>
              <option value="Purchase Officer">Purchase Officer</option>
              <option value="Financial Analyst">Financial Analyst</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold text-dark small mb-2">Joining Date *</label>
            <input type="date" className="form-control py-2" name="joiningDate" value={formData.joiningDate} onChange={handleChange} required style={{ borderRadius: "6px", fontSize: "14px", color: "#475569" }} />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold text-dark small mb-2">Salary *</label>
            <input type="number" className="form-control py-2" name="salary" placeholder="Enter salary" value={formData.salary} onChange={handleChange} required style={{ borderRadius: "6px", fontSize: "14px" }} />
          </div>
        </div>

        <div className="row align-items-start g-4 mb-4">
          <div className="col-md-6">
            <label className="form-label fw-semibold text-dark small mb-2">Profile Image *</label>
            <div className="p-4 text-center border border-dashed rounded-3 bg-light position-relative" style={{ borderStyle: "dashed", borderWidth: "2px", borderColor: "#cbd5e1" }}>
              {formData.profileImageUrl ? (
                <div className="mb-2">
                  <img src={formData.profileImageUrl} alt="Preview" className="rounded-circle border" style={{ width: "70px", height: "70px", objectFit: "cover" }} />
                  <div className="text-success small mt-1 fw-semibold">✓ Image Memory Frame Buffered</div>
                </div>
              ) : (
                <span className="material-symbols-outlined text-primary mb-2" style={{ fontSize: "32px" }}>image</span>
              )}

              <label htmlFor="systemFileInput" className="text-primary fw-semibold small mb-1 d-block" style={{ cursor: "pointer" }}>
                Click to select image from system
              </label>
              <input type="file" id="systemFileInput" accept="image/*" className="d-none" onChange={handleFileChange} />
              
              <div className="text-muted" style={{ fontSize: "11px" }}>JPG, PNG, GIF up to 2MB</div>
              <div className="mt-3 text-secondary text-center small fw-medium">— OR —</div>
              
              <input type="url" placeholder="Paste absolute online image url here" className="form-control form-control-sm mt-2 text-center" name="profileImageUrl" value={formData.profileImageUrl.startsWith("data:image") ? "" : formData.profileImageUrl} onChange={handleChange} style={{ fontSize: "12px", borderRadius: "4px" }} />
            </div>
          </div>
          
          <div className="col-md-6">
            <label className="form-label fw-semibold text-dark small mb-2">Status *</label>
            <div className="d-flex flex-column gap-3 mt-2">
              <div className="form-check d-flex align-items-center gap-2 m-0">
                <input className="form-check-input p-2" type="radio" name="statusRadio" id="statusActive" checked={formData.active === true} onChange={() => handleStatusChange(true)} style={{ cursor: "pointer" }} />
                <label className="form-check-label text-dark fw-medium small ms-1" htmlFor="statusActive" style={{ cursor: "pointer" }}>Active</label>
              </div>
              <div className="form-check d-flex align-items-center gap-2 m-0">
                <input className="form-check-input p-2" type="radio" name="statusRadio" id="statusInactive" checked={formData.active === false} onChange={() => handleStatusChange(false)} style={{ cursor: "pointer" }} />
                <label className="form-check-label text-dark fw-medium small ms-1" htmlFor="statusInactive" style={{ cursor: "pointer" }}>Inactive</label>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== BUTTON TOOLBAR CONTAINER BAR ==================== */}
        {/* ✅ FIXED: Layout now aligns action buttons properly with View Directory strictly shifted right side */}
        <div className="d-flex justify-content-between align-items-center border-top pt-4 mt-2">
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary px-4 py-2 d-flex align-items-center gap-2 shadow-sm" disabled={loading} style={{ borderRadius: "6px", fontWeight: "600", fontSize: "14px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>save</span>
              {loading ? "Saving Records..." : "Save Employee"}
            </button>
            
            <button type="button" className="btn btn-outline-secondary px-4 py-2 d-flex align-items-center gap-2" onClick={handleReset} style={{ borderRadius: "6px", fontWeight: "600", fontSize: "14px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>restart_alt</span>
              Reset
            </button>
            
            <button type="button" className="btn btn-outline-danger px-4 py-2 d-flex align-items-center gap-2" onClick={() => navigate("/admin/employees/list")} style={{ borderRadius: "6px", fontWeight: "600", fontSize: "14px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>close</span>
              Cancel
            </button>
          </div>

          {/* ✅ SHIFTED TO BOTTOM RIGHT */}
          <button 
            type="button" 
            className="btn btn-link text-primary d-flex align-items-center gap-2 text-decoration-none fw-semibold"
            onClick={() => navigate("/admin/employees/list")}
            style={{ fontSize: "14px" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "19px" }}>format_list_bulleted</span>
            View Employee Directory →
          </button>
        </div>

      </form>
    </AdminLayout>
  );
};

export default AddEmployee;