import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import VendorList from "./pages/admin/vendorList";
import AddVendor from "./pages/admin/addVendor";
import EditVendor from "./pages/admin/editVendor";
import ViewVendor from "./pages/admin/viewVendor";
import PurchaseOrderDashboard from "./pages/purchaseOrders/PurchaseOrderDashboard";
import AddPurhcaseOrder from "./pages/purchaseOrders/AddPurchaseOrder";

import AdminDashboard from './pages/admin/AdminDashboard';
import PurchaseOrderList from "./pages/purchaseOrders/PurchaseOrderList";
import ViewPurchaseOrder from './pages/purchaseOrders/ViewPurchaseOrder';

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
      <Route path="/admin/purchase-orders" element={<PurchaseOrderDashboard />} />
      <Route path="/admin/purchase-orders/add" element={<AddPurhcaseOrder />} />
      <Route path="/admin/purchase-orders/list" element={<PurchaseOrderList />} />
      <Route path="/admin/purchase-orders/view/:id" element={<ViewPurchaseOrder />} />

    </Routes>
  );
}

export default App;
