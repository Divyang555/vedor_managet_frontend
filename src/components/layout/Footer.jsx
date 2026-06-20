import React from "react";

/**
 * Footer
 * Reusable footer for the admin shell.
 *
 * Props:
 * - companyName: text shown in the copyright line
 * - version: app version label
 */
const Footer = ({ companyName = "Vendor Management System", version = "1.0" }) => {
  return (
    <footer className="footer-bar-shell">
      <p>© 2026 {companyName}. All rights reserved.</p>
      <p>Version {version}</p>
    </footer>
  );
};

export default Footer;
