// src/services/orderService.js
import api from './api';

export const getAllOrders = () => api.get("/admin/orders/all");
export const confirmOrder = (orderId) => api.put(`/admin/orders/${orderId}/confirm`);
export const shipOrder = (orderId) => api.put(`/admin/orders/${orderId}/ship`);
export const deliverOrder = (orderId) => api.put(`/admin/orders/${orderId}/deliver`);
export const cancelOrder = (orderId) => api.put(`/admin/orders/${orderId}/cancel`);
export const deleteOrder = (orderId) => api.delete(`/admin/orders/${orderId}`);

export const getOrderStats = (startDate, endDate) => {
    // Tạo ngày mặc định là 30 ngày trước và ngày hiện tại
    const today = new Date();
    const defaultStart = new Date(today);
    defaultStart.setDate(today.getDate() - 30);

    // Format thành YYYY-MM-DD
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const start = startDate || formatDate(defaultStart);
    const end = endDate || formatDate(today);

    return api.get(
        `/admin/orders/stats?startDate=${start}&endDate=${end}`
    );
};