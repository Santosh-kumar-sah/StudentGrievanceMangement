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

export const registerUser = (payload) => api.post("/auth/register", payload);
export const loginUser = (payload) => api.post("/auth/login", payload);

export const getExpenses = (category = "") =>
  api.get("/expense", {
    params: category ? { category } : {}
  });

export const addExpense = (payload) => api.post("/expense", payload);
export const updateExpense = (id, payload) => api.put(`/expense/${id}`, payload);
export const deleteExpense = (id) => api.delete(`/expense/${id}`);

export default api;
