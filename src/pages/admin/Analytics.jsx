import React from "react";
import { Navigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../hooks/useAuth.js";
import { useAnalytics } from "../../hooks/useAnalytics";
import SalesAnalytics from "../../components/features/analytics/SalesAnalytics";
import SalesByCategory from "../../components/features/analytics/SalesByCategory";
import TopProductsList from "../../components/features/analytics/TopProductsList";
import "../../styles/admin/analytic/analytics.css";

const Analytics = () => {
    // Sử dụng hooks
    const { user, loading, isAdmin } = useAuth();
    const {
        isLoading,
        error,
        salesData,
        categoryData,
        summary,
        topProducts,
        formatCurrency
    } = useAnalytics();

    // Kiểm tra đăng nhập/loading
    if (loading) {
        return <div>Đang tải...</div>;
    }

    // Kiểm tra quyền
    if (!user || !isAdmin()) {
        return <Navigate to="/login" replace />;
    }

    // Hiển thị giao diện
    return (
        <Layout>
            <div className="analytics-container">
                {isLoading ? (
                    <div className="loading-message">Đang tải dữ liệu phân tích...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    <>
                        {/* Hiển thị thống kê tổng quan */}
                        <div className="stats-summary">
                            <div className="summary-card">
                                <div className="stat-value">{summary.totalProducts}</div>
                                <div className="stat-title">Tổng số sản phẩm</div>
                            </div>
                            <div className="summary-card">
                                <div className="stat-value">{formatCurrency(summary.totalSales)}</div>
                                <div className="stat-title">Tổng doanh thu</div>
                            </div>
                        </div>

                        {/* Bảng top sản phẩm bán chạy - đã tách thành component */}
                        <TopProductsList
                            products={topProducts}
                            formatCurrency={formatCurrency}
                        />

                        {/* Các biểu đồ phân tích */}
                        <SalesAnalytics data={salesData} />

                        {/* Phân bổ doanh thu theo danh mục */}
                        {Array.isArray(categoryData) ? (
                            <SalesByCategory data={categoryData} />
                        ) : (
                            <SalesByCategory
                                data={Object.entries(categoryData).map(([name, value]) => ({
                                    name,
                                    revenue: value
                                }))}
                            />
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
};

export default Analytics;