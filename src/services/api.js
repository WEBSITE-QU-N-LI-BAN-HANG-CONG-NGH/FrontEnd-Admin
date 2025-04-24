// src/services/api.js
import axios from "axios";

// Khởi tạo axios instance với cấu hình cơ bản
const API_URL = "http://localhost:8080/api/v1"; // Thay đổi URL này theo cấu hình server của bạn

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Thêm dòng này để gửi và nhận cookie
});

// Thêm interceptor để xử lý token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor xử lý refresh token khi token hết hạn
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Gọi API refresh token
                const res = await axios.post(
                    `${API_URL}/auth/refresh-token`,
                    {},
                    {
                        withCredentials: true, // Để gửi cookies (refresh token)
                    }
                );

                if (res.data) {
                    // Lưu token mới
                    localStorage.setItem("accessToken", res.data.data.accessToken);
                    // Gán token mới vào header
                    api.defaults.headers.common["Authorization"] =
                        "Bearer " + res.data.data.accessToken;

                    // Thực hiện lại request ban đầu
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Nếu refresh token cũng hết hạn, chuyển hướng về trang đăng nhập
                localStorage.removeItem("accessToken");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

// Định nghĩa các service cơ bản
const authService = {
    login: (credentials) => api.post("/auth/login", credentials),
    logout: () => api.post("/auth/logout"),
    getCurrentUser: () => api.get("/users/profile"),
};

const userService = {
    getAllUsers: (page = 0, size = 10, search = "", role = "") =>
        api.get(
            `/admin/users/all?page=${page}&size=${size}&search=${search}&role=${role}`
        ),
    getUserDetails: (userId) => api.get(`/admin/users/${userId}`),
    changeUserRole: (userId, role) =>
        api.put(`/admin/users/${userId}/change-role`, {role}),
    updateUserStatus: (userId, active) =>
        api.put(`/admin/users/${userId}/status`, {active}),
    deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
    getCustomerStats: () => api.get("/admin/users/customers/stats"),
};

const dashboardService = {
    getOverview: () => api.get("/admin/dashboard/overview"),
    getRevenue: () => api.get("/admin/dashboard/revenue"),
    getMonthlyRevenue: () => api.get("/admin/dashboard/revenue/monthly"),
    getTopSellers: () => api.get("/admin/dashboard/top-sellers"),
    getRevenueDistribution: () =>
        api.get("/admin/dashboard/revenue-distribution"),
};

const productService = {
    getAllProducts: () => api.get("/admin/products/all"),
    createProduct: (productData) =>
        api.post("/admin/products/create", productData),
    updateProduct: (productId, productData) =>
        api.put(`/admin/products/${productId}/update`, productData),
    deleteProduct: (productId) =>
        api.delete(`/admin/products/${productId}/delete`),
    getTopSellingProducts: (limit = 10) =>
        api.get(`/admin/products/top-selling?limit=${limit}`),
    getRevenueByCateogry: () => api.get("/admin/products/revenue-by-category"),
};

const orderService = {
    getAllOrders: () => api.get("/admin/orders/all"),
    confirmOrder: (orderId) => api.put(`/admin/orders/${orderId}/confirm`),
    shipOrder: (orderId) => api.put(`/admin/orders/${orderId}/ship`),
    deliverOrder: (orderId) => api.put(`/admin/orders/${orderId}/deliver`),
    cancelOrder: (orderId) => api.put(`/admin/orders/${orderId}/cancel`),
    deleteOrder: (orderId) => api.delete(`/admin/orders/${orderId}`),
    getOrderStats: (startDate, endDate) => {
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
    },
};

const reportService = {
    getProductReports: (startDate, endDate) =>
        api.get(
            `/admin/reports/products?startDate=${startDate || ""}&endDate=${
                endDate || ""
            }`
        ),
    getProductStats: () => api.get("/admin/reports/products/stats"),
};

const categoryService = {
    getAllCategories: () => api.get("/admin/categories/"),
    updateCategory: (categoryData) =>
        api.put("/admin/categories/update", categoryData),
    getCategoryRevenue: () => api.get("/admin/categories/revenue"),
};

const analyticsService = {
    getSalesAnalytics: (startDate, endDate) =>
        api.get(
            `/admin/dashboard/sales-analytics?startDate=${startDate || ""}&endDate=${
                endDate || ""
            }`
        ),
    getProductTrends: () => api.get("/admin/dashboard/product-trends"),
    getCustomerInsights: () => api.get("/admin/dashboard/customer-insights"),
};

export {
    api,
    authService,
    categoryService,
    dashboardService,
    orderService,
    productService,
    reportService,
    userService,
    analyticsService,
};
