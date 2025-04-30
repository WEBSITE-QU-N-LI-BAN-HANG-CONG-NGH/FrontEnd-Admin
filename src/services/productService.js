// src/services/productService.js
import api from './api';

export const getAllProducts = () => api.get("/admin/products/all");
export const createProduct = (productData) => api.post("/admin/products/create", productData);
export const updateProduct = (productId, productData) => api.put(`/admin/products/${productId}/update`, productData);
export const deleteProduct = (productId) => api.delete(`/admin/products/${productId}/delete`);
export const getTopSellingProducts = (limit = 10) => api.get(`/admin/products/top-selling?limit=${limit}`);
export const getRevenueByCateogry = () => api.get("/admin/products/revenue-by-category");