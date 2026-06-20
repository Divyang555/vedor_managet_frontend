import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// Default navigation menu used by the admin shell.
// Exported so other layouts/tests can reuse or override it if needed.
export const ADMIN_NAV_ITEMS = [
  { name: "Dashboard", path: "/admin/dashboard", icon: "dashboard" },
  { name: "Vendors", path: "/vendors", icon: "store" },
  { name: "Purchase Orders", path: "/purchase-orders", icon: "shopping_cart" },
  { name: "Invoices", path: "/invoices", icon: "description" },
  { name: "Payments", path: "/payments", icon: "payments" },
  { name: "Reports", path: "/reports", icon: "analytics" },
  { name: "Users", path: "/users", icon: "group" },
  { name: "Settings", path: "/settings", icon: "settings" }
];

/**
 * Sidebar
 * Reusable admin navigation sidebar. Highlights the active section based on
 * the current route and exposes a logout action.
 *
 * Props:
 * - navItems: optional override for the list of nav links (defaults to ADMIN_NAV_ITEMS)
 * - brandTitle / brandSubtitle: optional override for the brand block text
 * - onLogout: optional override for the logout handler (defaults to clearing
 *   the auth token and redirecting to /login)
 */
const Sidebar = ({
  navItems = ADMIN_NAV_ITEMS,
  brandTitle = "ProcureManage",
  brandSubtitle = "Vendor Management System",
  onLogout
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      return;
    }
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="sidebar-shell">
      <div className="brand-container">
        <h1 className="brand-title">{brandTitle}</h1>
        <p className="brand-subtitle">{brandSubtitle}</p>
      </div>
      <nav className="menu-nav-list">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`menu-link ${isActive ? "active" : ""}`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="menu-link"
          style={{ background: "none", border: "none", width: "100%", textAlign: "left", cursor: "pointer" }}
        >
          <span className="material-symbols-outlined">logout</span>
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
