import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import VendorList from "./pages/admin/vendorList";
import AddVendor from "./pages/admin/addVendor";
import EditVendor from "./pages/admin/editVendor";
import ViewVendor from "./pages/admin/viewVendor";

import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/vendors" element={<VendorList />} />
      <Route path="/vendors/add" element={<AddVendor />} />
      <Route path="/vendors/edit/:id" element={<EditVendor />} />
      <Route path="/vendors/view/:id" element={<ViewVendor />} />
      <Route path="*" element={<Navigate replace to="/login" />} />
    </Routes>
  );
}

export default App;
