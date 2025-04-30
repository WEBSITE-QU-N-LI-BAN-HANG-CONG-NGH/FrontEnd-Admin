// src/hooks/useDashboard.js
import { useState, useEffect, useCallback } from "react";
import * as dashboardService from "../services/dashboardService";
import * as orderService from "../services/orderService";
import * as productService from "../services/productService";

export const useDashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        revenueStats: {},
        revenueDistribution: {},
        topProducts: [],
        recentOrders: [],
        productStats: {}
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState("month"); // month, quarter, year

    const fetchDashboardData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Gọi API dashboard overview
            const overviewResponse = await dashboardService.getOverview();
            if (overviewResponse.status === 200) {
                const data = overviewResponse.data.data || {};

                // Cập nhật state với dữ liệu dashboard
                setDashboardData(prevData => ({
                    ...prevData,
                    revenueStats: data.revenue || {},
                    revenueDistribution: data.distribution || {},
                    productStats: data.productStats || {}
                }));
            }

            // Gọi API lấy sản phẩm bán chạy
            try {
                const topProductsResponse = await productService.getTopSellingProducts(5);
                if (topProductsResponse.status === 200) {
                    setDashboardData(prevData => ({
                        ...prevData,
                        topProducts: topProductsResponse.data.data || []
                    }));
                }
            } catch (err) {
                console.warn("Không thể tải dữ liệu sản phẩm bán chạy:", err);
            }

            // Gọi API lấy đơn hàng gần đây
            try {
                const ordersResponse = await orderService.getAllOrders();
                if (ordersResponse.status === 200) {
                    const recentOrders = (ordersResponse.data.data || [])
                        .slice(0, 5)
                        .map(order => {
                            // Chuyển đổi dữ liệu đơn hàng thành định dạng cần thiết cho component
                            if (order.orderItems && order.orderItems.length > 0) {
                                const firstItem = order.orderItems[0];
                                return {
                                    id: order.id,
                                    trackingNo: `TN-${order.id}`,
                                    productName: firstItem.product?.title || "Sản phẩm không xác định",
                                    productImg: firstItem.product?.images?.[0]?.downloadUrl || "https://placehold.co/200",
                                    price: firstItem.price,
                                    quantity: firstItem.quantity,
                                    totalAmount: order.totalAmount,
                                    date: order.orderDate
                                };
                            }
                            return null;
                        })
                        .filter(Boolean); // Lọc bỏ các giá trị null

                    setDashboardData(prevData => ({
                        ...prevData,
                        recentOrders
                    }));
                }
            } catch (err) {
                console.warn("Không thể tải dữ liệu đơn hàng gần đây:", err);
            }

        } catch (err) {
            console.error("Lỗi khi tải dữ liệu dashboard:", err);
            setError("Không thể tải dữ liệu dashboard. Vui lòng thử lại sau.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    // Xử lý thay đổi khoảng thời gian
    const handleTimeRangeChange = useCallback((range) => {
        setTimeRange(range);
    }, []);

    return {
        dashboardData,
        isLoading,
        error,
        timeRange,
        handleTimeRangeChange,
        refreshData: fetchDashboardData
    };
};