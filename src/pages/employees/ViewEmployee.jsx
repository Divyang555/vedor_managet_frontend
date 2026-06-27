import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import employeeService from "../../services/employeeService";

const ViewEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Component States
  const [emp, setEmp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    if (id) {
      fetchEmployeeDetails();
    }
  }, [id]);

  const fetchEmployeeDetails = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getEmployeeById(id);
      setEmp(data);
    } catch (err) {
      console.error("Error retrieving employee schema profile context:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to permanently purge this employee record?")) {
      try {
        await employeeService.deleteEmployee(id);
        navigate("/admin/employees/list");
      } catch (err) {
        console.error("Purge instruction constraints error:", err);
        alert("Failed to delete the profile database entry.");
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout pageTitle="Employee Details" pageSubtitle="Home / Employees / View">
        <div className="text-center p-5 text-muted fw-medium">
          <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
          Loading structural employee profile blueprint specifications...
        </div>
      </AdminLayout>
    );
  }

  if (!emp) {
    return (
      <AdminLayout pageTitle="Employee Details" pageSubtitle="Home / Employees / View">
        <div className="alert alert-warning text-center m-4">Structural entry ledger row not found in database registry.</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Employee Details" pageSubtitle={`Home / Employees / ${emp.employeeCode || 'View'}`}>
      
      {/* ==================== ACTIONS CONTROL TOOLBAR ROW ==================== */}
      <div className="d-flex justify-content-end align-items-center gap-2 mb-4">
        <button className="btn btn-white border px-3 py-2 d-flex align-items-center gap-2 small fw-medium bg-white" onClick={() => navigate("/admin/employees/list")} style={{ borderRadius: "6px" }}>
          <span className="material-symbols-outlined fs-6">arrow_back</span> Back to List
        </button>
        <button className="btn btn-primary px-3 py-2 d-flex align-items-center gap-2 small fw-semibold" onClick={() => navigate(`/admin/employees/edit/${emp.id}`)} style={{ borderRadius: "6px" }}>
          <span className="material-symbols-outlined fs-6">edit</span> Edit
        </button>
        <button className="btn btn-danger px-3 py-2 d-flex align-items-center gap-2 small fw-semibold" onClick={handleDelete} style={{ borderRadius: "6px" }}>
          <span className="material-symbols-outlined fs-6">delete</span> Delete
        </button>
      </div>

      {/* ==================== CENTRALIZED MASTER SPECIFICATION CONTAINER ==================== */}
      <div className="p-4 bg-white border rounded-3 shadow-sm mb-4">
        <div className="row g-4 align-items-start">
          
          {/* Avatar Profile Left Box Block */}
          <div className="col-md-3 text-center border-end pe-md-4">
            <img 
              src={emp.profileImageUrl || "https://via.placeholder.com/130"} 
              alt="Avatar Profile" 
              className="rounded-3 border mb-3 shadow-sm"
              style={{ width: "135px", height: "135px", objectFit: "cover" }}
            />
            <div>
              <span className={`badge px-3 py-1 text-capitalize ${emp.active ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"}`} style={{ fontSize: "12px", borderRadius: "4px" }}>
                {emp.active ? "Active Status" : "Inactive Status"}
              </span>
            </div>
          </div>

          {/* Dynamic Descriptive Fields Matrices Row Columns */}
          <div className="col-md-9 ps-md-4">
            <div className="row g-3 fs-14">
              <div className="col-md-6 d-flex">
                <span className="text-muted fw-medium" style={{ width: "140px" }}>Employee ID</span>
                <span className="text-dark fw-bold">: &nbsp; {emp.employeeCode}</span>
              </div>
              <div className="col-md-6 d-flex">
                <span className="text-muted fw-medium" style={{ width: "140px" }}>Department</span>
                <span className="text-dark fw-semibold">: &nbsp; {emp.department}</span>
              </div>

              <div className="col-md-6 d-flex">
                <span className="text-muted fw-medium" style={{ width: "140px" }}>Full Name</span>
                <span className="text-dark fw-semibold">: &nbsp; {`${emp.firstName} ${emp.lastName}`}</span>
              </div>
              <div className="col-md-6 d-flex">
                <span className="text-muted fw-medium" style={{ width: "140px" }}>Designation</span>
                <span className="text-dark fw-semibold">: &nbsp; {emp.designation}</span>
              </div>

              <div className="col-md-6 d-flex">
                <span className="text-muted fw-medium" style={{ width: "140px" }}>Email</span>
                <span className="text-primary">: &nbsp; {emp.email}</span>
              </div>
              <div className="col-md-6 d-flex">
                <span className="text-muted fw-medium" style={{ width: "140px" }}>Joining Date</span>
                <span className="text-dark fw-semibold">: &nbsp; {emp.joiningDate || "N/A"}</span>
              </div>

              <div className="col-md-6 d-flex">
                <span className="text-muted fw-medium" style={{ width: "140px" }}>Phone</span>
                <span className="text-dark">: &nbsp; {emp.mobile || "N/A"}</span>
              </div>
              <div className="col-md-6 d-flex">
                <span className="text-muted fw-medium" style={{ width: "140px" }}>Salary</span>
                <span className="text-dark fw-bold">: &nbsp; ₹{(emp.salary || 0).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ==================== SUB-TAB MATRIX CHANNELS SELECTION ==================== */}
      <div className="row g-4 align-items-start">
        
        <div className="col-md-8">
          <div className="card border rounded-3 bg-white shadow-sm p-4">
            
            {/* Header Tabs Controls Selection */}
            <div className="d-flex border-bottom gap-4 mb-4 pb-2" style={{ fontSize: "14px" }}>
              {["general", "address", "documents", "purchaseOrders"].map((tab) => (
                <span 
                  key={tab}
                  className={`fw-semibold pb-2 text-capitalize`}
                  onClick={() => setActiveTab(tab)}
                  style={{ 
                    cursor: "pointer", 
                    color: activeTab === tab ? "#2563eb" : "#64748b",
                    borderBottom: activeTab === tab ? "2px solid #2563eb" : "none",
                    marginBottom: "-10px"
                  }}
                >
                  {tab === "purchaseOrders" ? "Purchase Orders" : `${tab} info`}
                </span>
              ))}
            </div>

            {/* Dynamic Segment Rendering Target Output */}
            <div className="fs-14 text-secondary">
              {activeTab === "general" && (
                <div className="row g-3">
                  <div className="col-md-6"><strong>Gender:</strong> <span className="ms-2 text-dark">Male</span></div>
                  <div className="col-md-6"><strong>Date of Birth:</strong> <span className="ms-2 text-dark">15 March 1995</span></div>
                  <div className="col-md-12"><strong>Account Note Structure:</strong> <span className="ms-2 text-muted">Central structural database employee schema file loaded successfully.</span></div>
                </div>
              )}

              {activeTab === "address" && (
                <div className="row g-3">
                  <div className="col-md-12"><strong>Address:</strong> <span className="ms-2 text-dark">123, Shyam Nagar, Anand, Gujarat - 388001, India</span></div>
                  <div className="col-md-4"><strong>City:</strong> <span className="ms-2 text-dark">Anand</span></div>
                  <div className="col-md-4"><strong>State:</strong> <span className="ms-2 text-dark">Gujarat</span></div>
                  <div className="col-md-4"><strong>Country:</strong> <span className="ms-2 text-dark">India</span></div>
                </div>
              )}

              {activeTab === "documents" && (
                <div className="text-muted p-2">No uploaded PDF/DOC artifacts linked onto this entity matrix registry column yet.</div>
              )}

              {activeTab === "purchaseOrders" && (
                <div className="text-muted p-2">No cross-referenced active purchase orders items registered under this employee code structure.</div>
              )}
            </div>

          </div>
        </div>

        {/* Right Quick Info Stats Card Bar Panel */}
        <div className="col-md-4">
          <div className="card p-4 border bg-white rounded-3 shadow-sm" style={{ fontSize: "13px" }}>
            <h6 className="fw-bold text-dark mb-3">Quick Info Matrix</h6>
            <div className="d-flex justify-content-between py-2 border-bottom text-secondary">
              <span>Total Purchase Orders</span>
              <span className="fw-bold text-dark">12</span>
            </div>
            <div className="d-flex justify-content-between py-2 border-bottom text-secondary">
              <span>Approved Orders</span>
              <span className="fw-bold text-success">9</span>
            </div>
            <div className="d-flex justify-content-between py-2 border-bottom text-secondary">
              <span>Pending Orders</span>
              <span className="fw-bold text-warning">3</span>
            </div>
            <div className="d-flex justify-content-between py-2 mt-1 text-secondary">
              <span>Total Order Value</span>
              <span className="fw-bold text-dark">₹8,75,000.00</span>
            </div>
          </div>
        </div>

      </div>

    </AdminLayout>
  );
};

export default ViewEmployee;