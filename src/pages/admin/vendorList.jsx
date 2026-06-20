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

  useEffect(() => { fetchVendors(); }, []);

  const fetchVendors = () => {
    setLoading(true);
    vendorService.getAllVendors()
      .then(data => setVendors(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error(err);
        setVendors([]);
      })
      .finally(() => setLoading(false));
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      if (currentStatus === "Active") {
        await vendorService.deactivateVendor(id);
      } else {
        await vendorService.activateVendor(id);
      }
      fetchVendors();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Confirm delete operation vendor profile record?")) {
      try {
        await vendorService.deleteVendor(id);
        fetchVendors();
      } catch (err) { console.error(err); }
    }
  };

  const filtered = vendors.filter(v => {
    const matchStr = ((v.vendorName || "") + (v.companyName || "") + (v.vendorCode || "")).toLowerCase().includes(search.toLowerCase());
    const matchStatus = filter === "All" || v.status === filter;
    return matchStr && matchStatus;
  });

  return (
    <AdminLayout pageTitle="Vendor List" breadcrumbs={["Dashboard", "Vendors"]}>
      <div className="data-table-card">
        <div className="data-grid-action-bar">
          <input type="text" className="search-input-field" placeholder="Search by vendor name, code, company..." value={search} onChange={(e) => setSearch(e.target.value)}/>
          <div className="action-flex-right">
            <span style={{ fontSize: "13px", color: "var(--txt-slate)" }}>Status:</span>
            <select className="filter-dropdown-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <button className="btn-action-trigger" onClick={() => navigate("/vendors/add")}>+ Add Vendor</button>
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
            {/* Table body section ko dhundhein aur use is code se replace karein */}
{/* vendorList.jsx ke tbody block me is exact column segment ko overwrite karein */}
<tbody>
  {filtered.map((v, i) => {
    const currentStatus = v.status || "Active"; 
    
    return (
      <tr key={v.id || i}>
        <td>{i + 1}</td>
        <td style={{ fontWeight: 700, color: "var(--accent-blue)" }}>{v.vendorCode || "N/A"}</td>
        <td>{v.vendorName || "N/A"}</td>
        
        {/* SAFE MAPPING CHECK: Yeh niche diye gaye kisi bhi possible column key structure ko parse kar lega */}
        <td style={{ fontWeight: 600, color: "#1e293b" }}>
          {v.companyName || v.company || v.company_name || "—"}
        </td>
        
        <td>{v.email || "—"}</td>
        <td>{v.mobile || "—"}</td>
        <td>
          <span className={`badge-status-pill ${
            String(currentStatus).toLowerCase() === 'active' ? 'badge-active' : 'badge-inactive'
          }`}>
            {currentStatus}
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
            <button className="op-btn" onClick={() => handleToggleStatus(v.id, currentStatus)} title="Toggle Status">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>lock_reset</span>
            </button>
            <button className="op-btn" onClick={() => handleDelete(v.id)} title="Delete">
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--status-inactive-txt)' }}>delete</span>
            </button>
          </div>
        </td>
      </tr>
    );
  })}
</tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default VendorList;