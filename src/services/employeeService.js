import axios from "axios";

const BASE_URL = "http://localhost:8080/admin/employees";

const getRequestConfig = () => {
  const token = localStorage.getItem("token");
  const hasValidToken = token && token !== "null" && token !== "undefined";

  return {
    headers: {
      ...(hasValidToken ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json"
    }
  };
};

const employeeService = {
  // Save/Create New Employee
  saveEmployee: async (employeePayload) => {
    const response = await axios.post(`${BASE_URL}`, employeePayload, getRequestConfig());
    return response.data;
  },

  // ✅ NEW: Fetch all employees from database
  getAllEmployees: async () => {
    const response = await axios.get(`${BASE_URL}`, getRequestConfig());
    return response.data;
  },

  // ✅ NEW: Get single employee profile details by ID
  getEmployeeById: async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`, getRequestConfig());
    return response.data;
  },

  // ✅ NEW: Update existing employee record
  updateEmployee: async (id, payload) => {
  // Ensure boolean remains intact before sending
  const response = await axios.put(`${BASE_URL}/${id}`, payload, getRequestConfig());
  return response.data;
},

  // ✅ NEW: Delete employee record
  deleteEmployee: async (id) => {
    const response = await axios.delete(`${BASE_URL}/${id}`, getRequestConfig());
    return response.data;
  },

  // Apne employeeService object ke andar ye do functions add kar lijiye:
activateEmployee: async (id) => {
  const response = await axios.put(`${BASE_URL}/${id}/activate`, {}, getRequestConfig());
  return response.data;
},

deactivateEmployee: async (id) => {
  const response = await axios.put(`${BASE_URL}/${id}/deactivate`, {}, getRequestConfig());
  return response.data;
}
};

export default employeeService;