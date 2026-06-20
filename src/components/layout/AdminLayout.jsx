import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../../vendor.css";

/**
 * AdminLayout
 * Top-level shell for all admin/vendor pages. Composes the Sidebar, Navbar,
 * and Footer around the page's own content (`children`).
 *
 * This replaces the old `pages/admin/layout.jsx`. The public API
 * (`pageTitle`, `breadcrumbs`, `children`) is unchanged, so existing pages
 * only need to update their import path — no other code changes required.
 *
 * Props:
 * - pageTitle: string shown in the Navbar heading
 * - breadcrumbs: array of breadcrumb labels for the Navbar
 * - children: page content rendered in the main workspace area
 */
const AdminLayout = ({ children, pageTitle, breadcrumbs = [] }) => {
  return (
    <div className="app-shell">
      <Sidebar />

      <div className="main-content-area">
        <Navbar pageTitle={pageTitle} breadcrumbs={breadcrumbs} />

        <main className="workspace-wrapper">{children}</main>

        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;
