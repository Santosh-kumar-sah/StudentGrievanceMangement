import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Refactor: auth APIs moved to /api/register and /api/login.
export const registerStudent = (payload) => api.post("/register", payload);
export const loginStudent = (payload) => api.post("/login", payload);

// Refactor: grievance APIs.
export const getGrievances = () => api.get("/grievances");
export const getGrievanceById = (id) => api.get(`/grievances/${id}`);
export const createGrievance = (payload) => api.post("/grievances", payload);
export const updateGrievance = (id, payload) => api.put(`/grievances/${id}`, payload);
export const deleteGrievance = (id) => api.delete(`/grievances/${id}`);
export const searchGrievancesByTitle = (title) =>
  api.get("/grievances/search", {
    params: { title }
  });

export default api;
