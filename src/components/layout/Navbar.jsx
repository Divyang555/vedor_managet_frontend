import React from "react";

/**
 * Navbar
 * Reusable top bar for the admin shell. Shows the current page title,
 * breadcrumb trail, and the signed-in user's info.
 *
 * Props:
 * - pageTitle: string shown as the page heading
 * - breadcrumbs: array of breadcrumb labels, rendered "A / B / C"
 * - userName / userRole: optional override for the displayed user
 */
const Navbar = ({
  pageTitle,
  breadcrumbs = [],
  userName = "Admin User",
  userRole = "Super Admin"
}) => {
  return (
    <header className="navbar-shell">
      <div className="navbar-left">
        <h2>{pageTitle}</h2>
        <div className="breadcrumbs-row">
          {breadcrumbs.map((b, idx) => (
            <span key={idx}>
              {idx > 0 && " / "} {b}
            </span>
          ))}
        </div>
      </div>
      <div className="navbar-right">
        <span
          className="material-symbols-outlined"
          style={{ color: "var(--txt-slate)", cursor: "pointer" }}
        >
          notifications
        </span>
        <div className="user-profile" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ textAlign: "right" }}>
            <p className="user-name" style={{ fontSize: "13px", fontWeight: 600 }}>{userName}</p>
            <p className="user-role" style={{ fontSize: "11px", color: "var(--txt-slate)" }}>{userRole}</p>
          </div>
          <div className="profile-badge-avatar">{userName.charAt(0)}</div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
