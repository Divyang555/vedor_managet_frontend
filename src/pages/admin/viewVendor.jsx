import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import vendorService from "../../services/vendorService.js";
import "../../vendor.css";

const ViewVendor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("No Vendor ID provided in the URL.");
      setLoading(false);
      return;
    }

    setLoading(true);
    vendorService.getVendorById(id)
      .then((data) => {
        if (data) {
          setVendor(data);
        } else {
          setError("Vendor profile record not found on server.");
        }
      })
      .catch((err) => {
        console.error("View Vendor API Error: ", err);
        setError("Failed to fetch data or Server token session expired.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // Loading wrapper token check
  if (loading) {
    return (
      <AdminLayout pageTitle="Vendor Details" breadcrumbs={["Dashboard", "Vendors", "Details"]}>
        <div className="overlay-loader-shell">
          <div className="loader-circle"></div>
        </div>
      </AdminLayout>
    );
  }

  // Error condition handling screen (Prevents Blank Page Whiteout)
  if (error || !vendor) {
    return (
      <AdminLayout pageTitle="Vendor Error" breadcrumbs={["Dashboard", "Vendors", "Error"]}>
        <div className="form-layout-frame" style={{ flexDirection: "column", padding: "30px", textAlign: "center" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--status-inactive-txt)" }}>error</span>
          <p style={{ marginTop: "12px", fontSize: "15px", fontWeight: "600", color: "#475569" }}>
            {error || "Unable to display target vendor data information details."}
          </p>
          <button className="btn-ui-dismiss" style={{ marginTop: "20px", alignSelf: "center" }} onClick={() => navigate("/vendors")}>
            Back to Vendor List
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Vendor Details" breadcrumbs={["Dashboard", "Vendors", "Details"]}>
      <div className="form-layout-frame" style={{ flexDirection: "column", width: "100%" }}>
        <div style={{ display: "flex", gap: "24px", width: "100%", flexWrap: "wrap" }}>
          
          {/* Vendor Details Form Cards Stack rendering section */}
          <div className="form-section-column" style={{ minWidth: "300px" }}>
            <h4 className="section-headline">Vendor Information</h4>
            <div className="detail-item"><p>Vendor Code</p><p className="bold-text">{vendor.vendorCode || "N/A"}</p></div>
            <div className="detail-item"><p>Vendor Name</p><p>{vendor.vendorName || "—"}</p></div>
            <div className="detail-item"><p>Company Name</p><p style={{ fontWeight: 600 }}>{vendor.companyName || vendor.company || "—"}</p></div>
            <div className="detail-item"><p>Email ID</p><p>{vendor.email || "—"}</p></div>
            <div className="detail-item"><p>Mobile Contact</p><p>{vendor.mobile || "—"}</p></div>
            <div className="detail-item"><p>GST Number</p><p>{vendor.gstNumber || "—"}</p></div>
            <div className="detail-item"><p>Address Location</p><p>{vendor.address || "—"}</p></div>
          </div>
          
          <div className="form-section-column" style={{ minWidth: "300px" }}>
            <h4 className="section-headline">Account Information</h4>
            <div className="detail-item"><p>Username Token</p><p>{vendor.username || "—"}</p></div>
            <div className="detail-item">
              <p>Status</p>
              <p>
                <span className={`badge-status-pill ${
                  String(vendor.status).toLowerCase() === 'active' ? 'badge-active' : 'badge-inactive'
                }`}>
                  {vendor.status || "Active"}
                </span>
              </p>
            </div>
            <div className="detail-item"><p>Created Date</p><p className="muted-text">{vendor.createdDate || "20 Jun 2026"}</p></div>
            <div className="detail-item"><p>Created By</p><p className="muted-text">{vendor.createdBy || "Super Admin"}</p></div>
          </div>
        </div>

        <div className="form-footer-action-row">
          <button className="btn-ui-dismiss" onClick={() => navigate("/vendors")}>
            <span className="material-symbols-outlined" style={{ fontSize: "16px", verticalAlign: "middle", marginRight: "4px" }}>arrow_back</span>
            Back
          </button>
          <button className="btn-action-trigger" onClick={() => navigate(`/vendors/edit/${vendor.id}`)}>
            <span className="material-symbols-outlined" style={{ fontSize: "16px", verticalAlign: "middle", marginRight: "4px" }}>edit</span>
            Edit Vendor
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ViewVendor;