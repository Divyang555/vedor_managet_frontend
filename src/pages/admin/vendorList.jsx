import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import vendorService from "../../services/vendorService";

const VendorList = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // CUSTOM HTML MODAL STATES FOR DEACTIVATION
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  useEffect(() => { 
    fetchVendors(); 
  }, []);

  const fetchVendors = () => {
    setLoading(true);
    vendorService.getAllVendors()
      .then(data => setVendors(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error("Error fetching vendors:", err);
        setVendors([]);
      })
      .finally(() => setLoading(false));
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      if (String(currentStatus).toLowerCase() === "active") {
        await vendorService.deactivateVendor(id);
      } else {
        await vendorService.activateVendor(id);
      }
      fetchVendors();
    } catch (err) { 
      console.error("Error toggling status:", err); 
    }
  };

  // ✅ FIXED: Delete modal open karne ki jagah ab Soft Deactivate confirmation state target karenge
  const openDeactivateModal = (vendorObject) => {
    setSelectedVendor(vendorObject);
    setModalOpen(true);
  };

  // ✅ FIXED: Physical deletion payload trigger ko update karke status field toggle hook mein change kiya
  const confirmDeactivateAction = async () => {
    if (!selectedVendor) return;
    try {
      // Direct dynamic deactivation status service integration hit
      await vendorService.deactivateVendor(selectedVendor.id);
      fetchVendors();
    } catch (err) { 
      console.error("Error updates on structural status constraint:", err); 
    } finally {
      setModalOpen(false);
      setSelectedVendor(null);
    }
  };

  // FIXED: Pure Dynamic Boolean Filter (true = Active, false = Inactive)
  const filtered = vendors.filter(v => {
    const matchStr = ((v.vendorName || "") + (v.companyName || "") + (v.vendorCode || "")).toLowerCase().includes(search.toLowerCase());
    
    // Exact API boolean status check 
    const isVendorActive = v.active === true || v.active === 1 || String(v.status).toLowerCase() === "active";

    const selectedFilter = filter.toLowerCase();
    
    if (selectedFilter === "all") {
      return matchStr; 
    } else if (selectedFilter === "active") {
      return matchStr && isVendorActive === true; 
    } else if (selectedFilter === "inactive") {
      return matchStr && isVendorActive === false; 
    }
    
    return matchStr;
  });

  return (
    <AdminLayout pageTitle="Vendor Management List" pageSubtitle="View, manage, and monitor all registered active vendor profiles.">
      <div className="data-table-card" style={{ position: "relative" }}>
        
        {/* FIXED: Balanced UI Action Flex bar wrapping perfect spacing and inline height overrides */}
        <div 
          className="data-grid-action-bar" 
          style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between", 
            gap: "16px",
            padding: "16px",
            flexWrap: "wrap"
          }}
        >
          <input 
            type="text" 
            className="search-input-field" 
            placeholder="Search by vendor name, code, company..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            style={{ minWidth: "280px" }}
          />
          
          {/* Action elements right side flex grid wrapper */}
          <div 
            className="action-flex-right" 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "12px",
              height: "40px" 
            }}
          >
            <span style={{ fontSize: "13px", color: "var(--txt-slate)", fontWeight: "500", whiteSpace: "nowrap" }}>Status:</span>
            
            <select 
              className="filter-dropdown-select" 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                backgroundColor: "#ffffff",
                fontSize: "14px",
                height: "100%",
                outline: "none",
                cursor: "pointer",
                minWidth: "100px"
              }}
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            
            <button 
              className="btn-action-trigger" 
              onClick={() => navigate("/vendors/add")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 16px",
                borderRadius: "6px",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                border: "none",
                fontWeight: "600",
                fontSize: "14px",
                height: "100%",
                cursor: "pointer",
                whiteSpace: "nowrap",
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1d4ed8"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
            >
              + Add Vendor
            </button>
          </div>
        </div>

        {loading ? (
          <div className="overlay-loader-shell"><div className="loader-circle"></div></div>
        ) : (
          <table className="master-data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Vendor Code</th>
                <th>Vendor Name</th>
                <th>Company Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((v, i) => {
                  const isActive = v.active === true || v.active === 1 || String(v.status).toLowerCase() === "active";
                  
                  return (
                    <tr key={v.id || i}>
                      <td>{i + 1}</td>
                      <td style={{ fontWeight: 700, color: "var(--accent-blue)" }}>{v.vendorCode || "N/A"}</td>
                      <td>{v.vendorName || "N/A"}</td>
                      <td style={{ fontWeight: 600, color: "#1e293b" }}>
                        {v.companyName || v.company || v.company_name || "—"}
                      </td>
                      <td>{v.email || "—"}</td>
                      <td>{v.mobile || "—"}</td>
                      <td>
                        <span className={`badge-status-pill ${isActive ? 'badge-active' : 'badge-inactive'}`}>
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="table-ops-group">
                          <button className="op-btn" onClick={() => navigate(`/vendors/view/${v.id}`)} title="View">
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>visibility</span>
                          </button>
                          <button className="op-btn" onClick={() => navigate(`/vendors/edit/${v.id}`)} title="Edit">
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
                          </button>
                          
                          <button 
                            className="op-btn" 
                            onClick={() => handleToggleStatus(v.id, isActive ? "Active" : "Inactive")} 
                            title="Toggle Status"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>lock_reset</span>
                          </button>
                          
                          {/* ✅ FIXED: Trigger modal window using safe structural object passing parameters */}
                          <button 
                            className="op-btn" 
                            onClick={() => openDeactivateModal(v)} 
                            title="Mark Inactive"
                            disabled={!isActive}
                            style={{ opacity: isActive ? 1 : 0.4 }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 16, color: isActive ? 'var(--status-inactive-txt)' : '#cbd5e1' }}>person_remove</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "24px", color: "#64748b" }}>
                    No matching records found for selected filter attributes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* DYNAMIC HTML OVERLAY MODAL FOR DEACTIVATION STATUS FLIP */}
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999
          }}
        >
          <div 
            className="custom-html-modal"
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              width: "420px",
              padding: "24px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              textAlign: "center",
              boxSizing: "border-box"
            }}
          >
            {/* Warning Alert Crimson Icon */}
            <div 
              style={{
                width: "56px",
                height: "56px",
                backgroundColor: "#fef2f2",
                color: "#ef4444",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px auto"
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "32px" }}>warning</span>
            </div>

            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: "0 0 8px 0" }}>
              Deactivate Vendor Profile
            </h3>
            
            <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 24px 0", lineHeight: "1.5" }}>
              Are you sure you want to mark vendor <strong className="text-dark">{selectedVendor?.vendorCode}</strong> as Inactive? This will suspend active transactions access layers safely.
            </p>

            {/* Modal Actions Footer Row */}
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button 
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
                onClick={confirmDeactivateAction}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#ef4444",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  outline: "none"
                }}
              >
                Yes, Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default VendorList;