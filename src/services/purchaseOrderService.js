import axios from "axios";

const BASE_URL = "http://localhost:8080"; // Apne Spring Boot Server port ke mutabik check karein

const getRequestConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json"
    }
  };
};

const purchaseOrderService = {
  // GET /admin/vendors
  getVendors: async () => {
    const res = await axios.get(`${BASE_URL}/admin/vendors`, getRequestConfig());
    return res.data;
  },

  // GET /admin/employees
  getEmployees: async () => {
    const res = await axios.get(`${BASE_URL}/admin/employees`, getRequestConfig());
    return res.data;
  },

  // POST /purchase-orders/add
  createPurchaseOrder: async (poPayload) => {
    const res = await axios.post(`${BASE_URL}/purchase-orders/add`, poPayload, getRequestConfig());
    return res.data;
  },

  // GET /purchase-orders (List Page ke liye)
  getAllPurchaseOrders: async () => {
    const res = await axios.get(`${BASE_URL}/purchase-orders`, getRequestConfig());
    return res.data;
  },

  // FIXED/ADDED: Yeh method miss hone ki wajah se view details page crash ho raha tha
  // GET /purchase-orders/{id}
  getPurchaseOrderById: async (id) => {
    const res = await axios.get(`${BASE_URL}/purchase-orders/${id}`, getRequestConfig());
    return res.data;
  },

  // src/services/purchaseOrderService.js ke andar:
  getPurchaseOrderById: async (poNumber) => {
    const res = await axios.get(`${BASE_URL}/purchase-orders/view/po/${poNumber}`, getRequestConfig());
    return res.data;
  },

  // DELETE /purchase-orders/{id}
  deletePurchaseOrder: async (id) => {
    const res = await axios.delete(`${BASE_URL}/purchase-orders/${id}`, getRequestConfig());
    return res.data;
  }
};

export default purchaseOrderService;