// src/services/dashboardService.js
import api from './api';

export const getOverview = () => api.get("/admin/dashboard/overview");
export const getRevenue = () => api.get("/admin/dashboard/revenue");
export const getMonthlyRevenue = () => api.get("/admin/dashboard/revenue/monthly");
export const getTopSellers = () => api.get("/admin/dashboard/top-sellers");
export const getRevenueDistribution = () => api.get("/admin/dashboard/revenue-distribution");