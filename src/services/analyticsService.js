// src/services/analyticsService.js
import api from './api';

export const getSalesAnalytics = (startDate, endDate) =>
    api.get(
        `/admin/dashboard/sales-analytics?startDate=${startDate || ""}&endDate=${endDate || ""}`
    );

export const getProductTrends = () => api.get("/admin/dashboard/product-trends");
export const getCustomerInsights = () => api.get("/admin/dashboard/customer-insights");