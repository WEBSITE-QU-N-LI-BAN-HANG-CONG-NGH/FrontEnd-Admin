// src/pages/admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import RevenueBreakdown from "../../components/features/dashboard/RevenueBreakdown";
import RevenueOverview from "../../components/features/dashboard/RevenueOverview";
import StoreRevenue from "../../components/features/dashboard/StoreRevenue";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../contexts/AuthContext";
import { dashboardService } from "../../services/api";

const Dashboard = () => {
    const { user, loading, isAdmin } = useAuth();
    const [dashboardData, setDashboardData] = useState({
        revenue: {},
        topSellers: [],
        distribution: {}
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Gọi API tổng hợp tất cả dữ liệu dashboard
                const overviewResponse = await dashboardService.getOverview();
                if (overviewResponse.status === 200) {
                    const data = overviewResponse.data.data || {};
                    setDashboardData({
                        revenue: data.revenue || {},
                        topSellers: data.topSellers || [],
                        distribution: data.distribution || {}
                    });
                } else {
                    throw new Error("Không thể tải dữ liệu tổng quan");
                }
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu dashboard:", err);
                setError("Không thể tải dữ liệu dashboard. Vui lòng thử lại sau.");

                setDashboardData({
                    revenue: {},
                    topSellers: [],
                    distribution: {}
                });
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