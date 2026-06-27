import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import employeeService from "../../services/employeeService";

const EmployeeList = () => {
  const navigate = useNavigate();

  // Core Management States
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // 🚀 CUSTOM HTML MODAL STATES FOR STATUS TOGGLING
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalMode, setModalMode] = useState("deactivate"); // "activate" or "deactivate"

  // Quick Analytical Info Analytics Matrix
  const [stats, setStats] = useState({
    total: 0, active: 0, inactive: 0, onLeave: 3
  });

  useEffect(() => {
    loadEmployeeDirectory();
  }, []);

  const loadEmployeeDirectory = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getAllEmployees();
      setEmployees(data || []);

      const totalCount = data.length;
      const activeCount = data.filter((e) => e.active === true).length;
      const inactiveCount = totalCount - activeCount;

      setStats((prev) => ({
        ...prev,
        total: totalCount,
        active: activeCount,
        inactive: inactiveCount
      }));
    } catch (err) {
      console.error("Failed to load schema listings entries from database:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🚀 TRIGGER POPUP MODAL (Both Activate & Deactivate flow supported)
  const openStatusModal = (empObject, mode) => {
    setSelectedEmployee(empObject);
    setModalMode(mode);
    setModalOpen(true);
  };

  // 🚀 EXECUTE TOGGLE ACTION ON CUSTOM MODAL CONFIRMATION
  const handleStatusToggleAction = async () => {
    if (!selectedEmployee) return;
    try {
      if (modalMode === "deactivate") {
        await employeeService.deactivateEmployee(selectedEmployee.id);
      } else {
        await employeeService.activateEmployee(selectedEmployee.id);
      }
      loadEmployeeDirectory(); // Realtime state re-fetch matrix sync
    } catch (err) {
      console.error("Status modification constraint rejection layer:", err);
      alert("Could not update status. Please verify backend configurations.");
    } finally {
      setModalOpen(false);
      setSelectedEmployee(null);
    }
  };

  // Filter payload elements iteratively down through target search strings
  const filteredEmployees = employees.filter((emp) => {
    const searchString = searchTerm.toLowerCase();
    return (
      emp.employeeCode?.toLowerCase().includes(searchString) ||
      `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchString) ||
      emp.email?.toLowerCase().includes(searchString) ||
      emp.mobile?.toLowerCase().includes(searchString)
    );
  });

  return (
    <AdminLayout pageTitle="Employees" pageSubtitle="Home / Employees">
      
      {/* ==================== UPPER ANALYTICS CARDS ROW ==================== */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="p-3 bg-white border rounded-3 shadow-sm d-flex align-items-center gap-3">
            <div className="p-3 bg-primary-subtle rounded-3 text-primary d-flex align-items-center justify-content-center">
              <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>groups</span>
            </div>
            <div>
              <div className="text-muted small fw-medium">Total Employees</div>
              <h3 className="fw-bold m-0 text-dark">{stats.total}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="p-3 bg-white border rounded-3 shadow-sm d-flex align-items-center gap-3">
            <div className="p-3 bg-success-subtle rounded-3 text-success d-flex align-items-center justify-content-center">
              <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>person_add</span>
            </div>
            <div>
              <div className="text-muted small fw-medium">Active Employees</div>
              <h3 className="fw-bold m-0 text-dark">{stats.active}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="p-3 bg-white border rounded-3 shadow-sm d-flex align-items-center gap-3">
            <div className="p-3 bg-danger-subtle rounded-3 text-danger d-flex align-items-center justify-content-center">
              <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>person_remove</span>
            </div>
            <div>
              <div className="text-muted small fw-medium">Inactive Employees</div>
              <h3 className="fw-bold m-0 text-dark">{stats.inactive}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="p-3 bg-white border rounded-3 shadow-sm d-flex align-items-center gap-3">
            <div className="p-3 bg-info-subtle rounded-3 text-info d-flex align-items-center justify-content-center">
              <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>bento</span>
            </div>
            <div>
              <div className="text-muted small fw-medium">On Leave</div>
              <h3 className="fw-bold m-0 text-dark">{stats.onLeave}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== CONTROL FILTERS HEADER TOOLBAR ==================== */}
      <div className="p-3 bg-white border rounded-3 shadow-sm mb-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div className="d-flex align-items-center gap-2 bg-light border px-3 py-2 rounded-3" style={{ width: "350px" }}>
          <span className="material-symbols-outlined text-secondary" style={{ fontSize: "20px" }}>search</span>
          <input 
            type="text" 
            className="form-control border-0 bg-transparent p-0 shadow-none" 
            placeholder="Search by name, email, phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ fontSize: "14px" }}
          />
        </div>

        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-outline-secondary px-3 py-2 d-flex align-items-center gap-2" style={{ borderRadius: "6px", fontSize: "14px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>filter_list</span> Filters
          </button>
          <Link to="/admin/employees/add" className="btn btn-primary px-3 py-2 d-flex align-items-center gap-2 fw-semibold" style={{ borderRadius: "6px", fontSize: "14px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add</span> Add Employee
          </Link>
        </div>
      </div>

      {/* ==================== CORE DIRECTORY LEDGER DATA TABLE ==================== */}
      <div className="table-responsive bg-white rounded-3 border shadow-sm">
        <table className="table table-hover align-middle m-0" style={{ fontSize: "14px" }}>
          <thead className="table-light text-secondary fw-semibold border-bottom">
            <tr>
              <th className="py-3 px-4">Employee ID</th>
              <th className="py-3">Name</th>
              <th className="py-3">Email</th>
              <th className="py-3">Phone</th>
              <th className="py-3">Department</th>
              <th className="py-3">Designation</th>
              <th className="py-3">Status</th>
              <th className="py-3 text-center" style={{ width: "120px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center text-muted py-5">
                  <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                  Fetching dynamic rows from database...
                </td>
              </tr>
            ) : filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <tr key={emp.id} className="border-bottom">
                  <td className="px-4 fw-bold text-primary">
                    {emp.employeeCode || `EMP-${emp.id}`}
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <img 
                        src={emp.profileImageUrl || "https://via.placeholder.com/35"} 
                        alt="Profile" 
                        className="rounded-circle border" 
                        style={{ width: "35px", height: "35px", objectFit: "cover" }}
                      />
                      <span className="fw-semibold text-dark">{`${emp.firstName} ${emp.lastName}`}</span>
                    </div>
                  </td>
                  <td className="text-secondary">{emp.email}</td>
                  <td className="text-secondary">{emp.mobile || "N/A"}</td>
                  <td>
                    <span className="badge bg-light text-dark border px-2 py-1 fw-medium">{emp.department}</span>
                  </td>
                  <td className="text-muted">{emp.designation}</td>
                  <td>
                    <span className={`badge px-2 py-1 ${emp.active ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"}`} style={{ fontSize: "12px", borderRadius: "4px" }}>
                      {emp.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="d-flex align-items-center justify-content-center gap-1">
                      <button 
                        className="btn text-primary p-1 d-flex align-items-center" 
                        title="View Profile"
                        onClick={() => navigate(`/admin/employees/view/${emp.id}`)}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>visibility</span>
                      </button>
                      <button 
                        className="btn text-warning p-1 d-flex align-items-center" 
                        title="Edit Entry"
                        onClick={() => navigate(`/admin/employees/edit/${emp.id}`)}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>edit</span>
                      </button>
                      
                      {/* ✅ FIXED DYNAMIC BUTTON SYSTEM: Status evaluation check handles switching layouts natively */}
                      {emp.active ? (
                        <button 
                          className="btn text-danger p-1 d-flex align-items-center" 
                          title="Mark Inactive"
                          onClick={() => openStatusModal(emp, "deactivate")}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>person_remove</span>
                        </button>
                      ) : (
                        <button 
                          className="btn text-success p-1 d-flex align-items-center" 
                          title="Mark Active"
                          onClick={() => openStatusModal(emp, "activate")}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>person_check</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center text-muted py-5 fw-medium">
                  No matching structural records found in the database directory.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ==================== DYNAMIC HTML OVERLAY MODAL FOR TOGGLING ==================== */}
      {/* ==================== DYNAMIC HTML OVERLAY MODAL FOR TOGGLING ==================== */}
{modalOpen && (
  <div 
    className="modal-backdrop-blur"
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(15, 23, 42, 0.4)",
      backdropFilter: "blur(4px)",
      display: "flex",          // 🚀 FIXED: Flex layout enabled
      alignItems: "center",      // 🚀 FIXED: Perfectly vertically centered
      justifyContent: "center",  // 🚀 FIXED: Perfectly horizontally centered
      zIndex: 99999
    }}
  >
    <div 
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        width: "420px",
        padding: "24px",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        textAlign: "center",
        boxSizing: "border-box",
        margin: "auto"           // 🚀 FIXED: Fallback structural margins center override
      }}
    >
      {/* Context conditional UI themed colors alignment structure mapping */}
      <div 
        style={{
          width: "56px",
          height: "56px", 
          backgroundColor: modalMode === "deactivate" ? "#fef2f2" : "#f0fdf4", 
          color: modalMode === "deactivate" ? "#ef4444" : "#16a34a",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px auto"
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: "32px" }}>
          {modalMode === "deactivate" ? "warning" : "check_circle"}
        </span>
      </div>

      <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: "0 0 8px 0" }}>
        {modalMode === "deactivate" ? "Deactivate Employee Profile" : "Activate Employee Profile"}
      </h3>
      
      <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 24px 0", lineHeight: "1.5" }}>
        Are you sure you want to change employee <strong className="text-dark">{selectedEmployee?.employeeCode}</strong> status to{" "}
        <strong className={modalMode === "deactivate" ? "text-danger" : "text-success"}>
          {modalMode === "deactivate" ? "Inactive" : "Active"}
        </strong>?
      </p>

      {/* Modal Actions Buttons Toolbar */}
      <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
        <button 
          type="button"
          onClick={() => setModalOpen(false)}
          style={{
            flex: 1,
            padding: "10px 16px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            backgroundColor: "#ffffff",
            color: "#334155",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            outline: "none"
          }}
        >
          No, Cancel
        </button>
        
        <button 
          type="button"
          onClick={handleStatusToggleAction}
          style={{
            flex: 1,
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: modalMode === "deactivate" ? "#ef4444" : "#16a34a", 
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            outline: "none"
          }}
        >
          Yes, Confirm
        </button>
      </div>
    </div>
  </div>
)}
    </AdminLayout>
  );
};

export default EmployeeList;