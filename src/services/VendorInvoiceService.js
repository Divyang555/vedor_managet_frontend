import axios from "axios";

const BASE_URL = "http://localhost:8080/vendor";

const getRequestConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...(token && token !== "null" ? { Authorization: `Bearer ${token}` } : {})
    }
  };
};

const vendorInvoiceService = {
  // Existing methods...
  createInvoice: async (formData) => {
    const response = await axios.post(`${BASE_URL}/invoices`, formData, getRequestConfig());
    return response.data?.data || response.data;
  },

  downloadInvoice: async (id) => {
    return await axios.get(`${BASE_URL}/invoices/download/${id}`, {
      ...getRequestConfig(),
      responseType: "blob"
    });
  },

  // 🚀 NEW METHOD: Fetch complete Invoice & PO relational details for view mode
  viewInvoice: async (purchaseOrderId) => {
    const response = await axios.get(`${BASE_URL}/invoices/view/${purchaseOrderId}`, getRequestConfig());
    return response.data?.data || response.data;
  }
};

export default vendorInvoiceService;