import api from "./api";
import { getAuthHeaders } from "../utils/auth";

export const getProducts = async () => {
  const headers = getAuthHeaders();
  return await api.get("/products", { headers });
};

export const createProduct = async (data) => {
  const headers = getAuthHeaders();
  return await api.post("/products", data, { headers });
};

export const updateProduct = async (id, data) => {
  const headers = getAuthHeaders();
  return await api.put(`/products/${id}`, data, { headers });
};

export const deleteProduct = async (id) => {
  const headers = getAuthHeaders();
  return await api.delete(`/products/${id}`, { headers });
};
