import axios from "axios";

// Match exactly your backend Spring boot @RequestMapping controllers endpoint mapping token context configurations
const BASE_URL = "http://localhost:8080/admin/vendors";

const getRequestConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json"
    }
  };
};

const vendorService = {
  getAllVendors: async () => {
    const res = await axios.get(BASE_URL, getRequestConfig());
    return res.data;
  },

  // Ensure matching this specific profile path string template concatenation format
  getVendorById: async (id) => {
    // Clear trace logs validation to make sure path compiles correctly
    console.log("Request processing targets verification parameter ID code index: ", id);
    const res = await axios.get(`${BASE_URL}/${id}`, getRequestConfig());
    return res.data;
  },

  createVendor: async (data) => {
    const res = await axios.post(BASE_URL, data, getRequestConfig());
    return res.data;
  },

  updateVendor: async (id, data) => {
    const res = await axios.put(`${BASE_URL}/${id}`, data, getRequestConfig());
    return res.data;
  },

  deleteVendor: async (id) => {
    const res = await axios.delete(`${BASE_URL}/${id}`, getRequestConfig());
    return res.data;
  },

  activateVendor: async (id) => {
    const res = await axios.put(`${BASE_URL}/${id}/activate`, {}, getRequestConfig());
    return res.data;
  },

  deactivateVendor: async (id) => {
    const res = await axios.put(`${BASE_URL}/${id}/deactivate`, {}, getRequestConfig());
    return res.data;
  },

  // FIXED: Added your dynamic dashboard total analytics counter method here seamlessly
  getTotalVendorsCount: async () => {
    const res = await axios.get(`${BASE_URL}/total`, getRequestConfig());
    return res.data;
  }
};

export default vendorService;