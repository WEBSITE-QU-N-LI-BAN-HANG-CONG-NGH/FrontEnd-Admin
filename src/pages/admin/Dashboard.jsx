// src/pages/admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import RevenueBreakdown from "../../components/features/dashboard/RevenueBreakdown";
import RevenueOverview from "../../components/features/dashboard/RevenueOverview";
import StoreRevenue from "../../components/features/dashboard/StoreRevenue";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../contexts/AuthContext";
import { dashboardService } from "../../services/api";
import DashboardStats from "../../components/features/dashboard/DashboardStats";
import { orderService, reportService, userService } from "../../services/api";
import "../../styles/admin/dashboard/dashboard.css";

const Dashboard = () => {
    const { user, loading, isAdmin } = useAuth();
    const [dashboardData, setDashboardData] = useState({
        revenue: {},
        topSellers: [],
        distribution: {}
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [statsData, setStatsData] = useState({
        totalOrders: 0,
        orderGrowth: 0,
        totalRevenue: 0,
        revenueGrowth: 0,
        totalProducts: 0,
        outOfStockProducts: 0,
        totalCustomers: 0,
        newCustomers: 0
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Lấy tổng quan doanh thu
                let dashboardDataTemp = {
                    revenue: {},
                    topSellers: [],
                    distribution: {}
                };
                let statsDataTemp = {
                    totalOrders: 0,
                    orderGrowth: 0,
                    totalRevenue: 0,
                    revenueGrowth: 0,
                    totalProducts: 0,
                    outOfStockProducts: 0,
                    totalCustomers: 0,
                    newCustomers: 0
                };

                try {
                    const overviewResponse = await dashboardService.getOverview();
                    if (overviewResponse.status === 200) {
                        const data = overviewResponse.data.data || {};
                        dashboardDataTemp = {
                            revenue: data.revenue || {},
                            topSellers: data.topSellers || [],
                            distribution: data.distribution || {}
                        };
                    }
                } catch (err) {
                    console.warn("Không thể tải dữ liệu tổng quan:", err);
                }

                // Lấy các thống kê khác với xử lý lỗi riêng biệt
                try {
                    // Tạo ngày mặc định
                    const today = new Date();
                    const lastMonth = new Date(today);
                    lastMonth.setMonth(lastMonth.getMonth() - 1);

                    const formatDate = (date) => {
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        return `${year}-${month}-${day}`;
                    };

                    const orderStatsResponse = await orderService.getOrderStats(
                        formatDate(lastMonth),
                        formatDate(today)
                    );

                    if (orderStatsResponse.status === 200) {
                        statsDataTemp.totalOrders = orderStatsResponse.data?.data?.totalOrders || 0;
                    }
                } catch (err) {
                    console.warn("Không thể tải thống kê đơn hàng:", err);
                }

                try {
                    const productStatsResponse = await reportService.getProductStats();
                    if (productStatsResponse.status === 200) {
                        statsDataTemp.totalProducts = productStatsResponse.data?.data?.totalProducts || 0;
                        statsDataTemp.outOfStockProducts = productStatsResponse.data?.data?.outOfStockProducts || 0;
                    }
                } catch (err) {
                    console.warn("Không thể tải thống kê sản phẩm:", err);
                }

                try {
                    const customerStatsResponse = await userService.getCustomerStats();
                    if (customerStatsResponse.status === 200) {
                        statsDataTemp.totalCustomers = customerStatsResponse.data?.data?.totalCustomers || 0;
                    }
                } catch (err) {
                    console.warn("Không thể tải thống kê khách hàng:", err);
                }

                // Cập nhật dữ liệu doanh thu từ dashboardDataTemp
                statsDataTemp.totalRevenue = dashboardDataTemp.revenue?.currentMonthIncome || 0;
                statsDataTemp.revenueGrowth = dashboardDataTemp.revenue?.comparePercent || 0;

                // Cập nhật state
                setDashboardData(dashboardDataTemp);
                setStatsData(statsDataTemp);
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu dashboard:", err);
                setError("Không thể tải dữ liệu dashboard. Vui lòng thử lại sau.");
            } finally {
                setIsLoading(false);
            }
        };

        if (!loading && user) {
            fetchDashboardData();
        }
    }, [loading, user]);

    // Nếu đang tải thông tin người dùng
    if (loading) {
        return <div>Đang tải...</div>;
    }

    // Nếu người dùng không đăng nhập hoặc không phải admin
    if (!user || !isAdmin()) {
        return <Navigate to="/login" replace />;
    }

    return (
        <Layout>
            <div className="content-wrapper">
                {isLoading ? (
                    <div className="loading-message">Đang tải dữ liệu dashboard...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    <>
                        <div className="dashboard-overview">
                            <DashboardStats stats={statsData} />

                            <div className="dashboard-filters">
                                <div className="filter-options">
                                    <button className="filter-option active">Tháng này</button>
                                    <button className="filter-option">Quý này</button>
                                    <button className="filter-option">Năm nay</button>
                                </div>
                                <button className="refresh-btn">🔄 Làm mới</button>
                            </div>
                        </div>
                        <div className="dashboard-grid">
                            <RevenueOverview data={dashboardData.revenue} />
                            <RevenueBreakdown data={dashboardData.distribution} />
                        </div>
                        <StoreRevenue data={dashboardData.topSellers} />
                    </>
                )}
            </div>
        </Layout>
    );
};

export default Dashboard;