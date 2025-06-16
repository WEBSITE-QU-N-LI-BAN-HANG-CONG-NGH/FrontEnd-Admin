// src/services/api.js
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
const API_URL = `${BACKEND_URL}/api/v1`;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
    timeout: 10000, // Thêm timeout 10 giây
});

// Interceptor xử lý request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Log request để debug
        console.log("Making request to:", config.baseURL + config.url);
        console.log("Request config:", config);
        
        return config;
    },
    (error) => {
        console.error("Request interceptor error:", error);
        return Promise.reject(error);
    }
);

// Interceptor xử lý response và refresh token
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        console.error("API Error:", error);
        
        const originalRequest = error.config;
        
        // Kiểm tra nếu là lỗi 401 và chưa retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                console.log("Attempting to refresh token...");
                
                // Tạo một instance axios mới để tránh loop
                const refreshApi = axios.create({
                    withCredentials: true,
                    timeout: 5000,
                });
                
                const refreshResponse = await refreshApi.post(
                    `${API_URL}/auth/refresh-token`,
                    {},
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (refreshResponse.data?.data?.accessToken) {
                    const newToken = refreshResponse.data.data.accessToken;
                    
                    // Lưu token mới
                    localStorage.setItem("accessToken", newToken);
                    
                    // Cập nhật header cho request gốc
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    
                    console.log("Token refreshed successfully");
                    
                    // Thực hiện lại request ban đầu
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.error("Refresh token failed:", refreshError);
                
                // Clear token và redirect về login
                localStorage.removeItem("accessToken");
                
                // Kiểm tra nếu không phải đã ở trang login
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = "/login";
                }
                
                return Promise.reject(refreshError);
            }
        }
        
        // Xử lý các lỗi khác
        if (error.response?.status === 405) {
            console.error("Method not allowed - check your API endpoint and HTTP method");
        }
        
        if (!error.response) {
            console.error("Network error or server unreachable");
        }
        
        return Promise.reject(error);
    }
);

// Utility functions để xử lý lỗi
export const handleApiError = (error) => {
    if (error.response) {
        // Server responded with error status
        const { status, data } = error.response;
        
        switch (status) {
            case 400:
                return data.message || "Dữ liệu không hợp lệ";
            case 401:
                return "Không có quyền truy cập";
            case 403:
                return "Bị cấm truy cập";
            case 404:
                return "Không tìm thấy tài nguyên";
            case 405:
                return "Phương thức không được phép";
            case 500:
                return "Lỗi server nội bộ";
            default:
                return data.message || `Lỗi HTTP ${status}`;
        }
    } else if (error.request) {
        // Request was made but no response received
        return "Không thể kết nối đến server";
    } else {
        // Something else happened
        return error.message || "Có lỗi xảy ra";
    }
};

// Test connection function
export const testConnection = async () => {
    try {
        const response = await axios.get(`${API_URL}/health`, { timeout: 5000 });
        console.log("Backend connection successful:", response.data);
        return true;
    } catch (error) {
        console.error("Backend connection failed:", error);
        return false;
    }
};

export default api;