// src/hooks/useDashboard.jsx
import { useState, useEffect, useCallback } from "react";
import * as dashboardService from "../services/dashboardService";

export const useDashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        productStats: {},
        weeklyRevenue: {},
        monthlyRevenue: {},
        categoryRevenue: {},
        recentOrders: [],
        topSellingProducts: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Lấy thống kê sản phẩm
            const productStatsResponse = await dashboardService.getProductStats();
            if (productStatsResponse.status === 200) {
                setDashboardData(prevData => ({
                    ...prevData,
                    productStats: productStatsResponse.data.data || {}
                }));
            }

            // Lấy doanh thu theo tuần
            const weeklyRevenueResponse = await dashboardService.getWeeklyRevenue();
            if (weeklyRevenueResponse.status === 200) {
                setDashboardData(prevData => ({
                    ...prevData,
                    weeklyRevenue: weeklyRevenueResponse.data.data || {}
                }));
            }

            // Lấy doanh thu theo tháng
            const monthlyRevenueResponse = await dashboardService.getMonthlyRevenue();
            if (monthlyRevenueResponse.status === 200) {
                setDashboardData(prevData => ({
                    ...prevData,
                    monthlyRevenue: monthlyRevenueResponse.data.data || {}
                }));
            }

            // Lấy doanh thu theo category
            const categoryRevenueResponse = await dashboardService.getRevenueByCategory();
            if (categoryRevenueResponse.status === 200) {
                setDashboardData(prevData => ({
                    ...prevData,
                    categoryRevenue: categoryRevenueResponse.data.data || {}
                }));
            }

            // Lấy đơn hàng gần đây
            const recentOrdersResponse = await dashboardService.getRecentOrders();
            if (recentOrdersResponse.status === 200) {
                setDashboardData(prevData => ({
                    ...prevData,
                    recentOrders: recentOrdersResponse.data.data || []
                }));
            }

            /// Lấy sản phẩm bán chạy
            const topSellingProductsResponse = await dashboardService.getTopSellingProducts();
            if (topSellingProductsResponse.status === 200) {
                setDashboardData(prevData => ({
                    ...prevData,
                    topSellingProducts: topSellingProductsResponse.data.data || []
                }));
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

    return {
        dashboardData,
        isLoading,
        error,
        refreshData: fetchDashboardData
    };
};