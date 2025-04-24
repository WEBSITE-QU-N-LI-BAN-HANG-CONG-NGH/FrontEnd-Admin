// src/pages/admin/Analytics.jsx
import React, {useEffect, useState} from "react";
import {Navigate} from "react-router-dom";
import Layout from "../../components/layout/Layout";
import {useAuth} from "../../contexts/AuthContext";
import ProductAnalytics from "../../components/features/analytics/ProductAnalytics";
import SalesAnalytics from "../../components/features/analytics/SalesAnalytics";
import SalesByCategory from "../../components/features/analytics/SalesByCategory";
import CustomerAnalytics from "../../components/features/analytics/CustomerAnalytics";
import "../../styles/admin/analytics.css";
import {reportService, productService, dashboardService, userService} from "../../services/api";

const Analytics = () => {
    const {user, loading, isAdmin} = useAuth();
    const [productStats, setProductStats] = useState({});
    const [salesData, setSalesData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [customerData, setCustomerData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Lấy thống kê sản phẩm
                const productStatsResponse = await reportService.getProductStats();
                if (productStatsResponse.status === 200) {
                    setProductStats(productStatsResponse.data.data || {});
                }

                // Lấy dữ liệu doanh thu theo tháng từ API mới
                const salesResponse = await dashboardService.getMonthlyRevenue();
                if (salesResponse.status === 200) {
                    setSalesData(salesResponse.data.data.monthlyData || []);
                }

                // Lấy dữ liệu doanh thu theo danh mục
                const categoryResponse = await dashboardService.getRevenueDistribution();
                if (categoryResponse.status === 200) {
                    setCategoryData(categoryResponse.data.data || {});
                }

                // Lấy dữ liệu thống kê khách hàng
                const customerResponse = await userService.getCustomerStats();
                if (customerResponse.status === 200) {
                    setCustomerData(customerResponse.data.data || {});
                }
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu phân tích:", err);
                setError("Không thể tải dữ liệu phân tích. Vui lòng thử lại sau.");

                setSalesData([
                ]);

                setCategoryData({
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (!loading && user) {
            fetchAnalyticsData();
        }
    }, [loading, user]);

    // Nếu đang tải thông tin người dùng
    if (loading) {
        return <div>Đang tải...</div>;
    }

    // Nếu người dùng không đăng nhập hoặc không phải admin
    if (!user || !isAdmin()) {
        return <Navigate to="/login" replace/>;
    }

    return (
        <Layout>
            <div className="analytics-container">
                <div className="analytics-header">
                    <h1>Phân tích dữ liệu</h1>
                    <p>Các chỉ số thống kê, phân tích và báo cáo chi tiết</p>
                </div>

                {isLoading ? (
                    <div className="loading-message">Đang tải dữ liệu phân tích...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    <>
                        <div className="analytics-grid">
                            <ProductAnalytics data={productStats}/>
                            <CustomerAnalytics data={customerData}/>
                        </div>
                        <SalesAnalytics data={salesData}/>

                        {/* Hiển thị phân bổ doanh thu theo danh mục */}
                        {Array.isArray(categoryData) ? (
                            <SalesByCategory data={categoryData} />
                        ) : (
                            <SalesByCategory data={Object.entries(categoryData).map(([name, value]) => ({
                                name,
                                revenue: value
                            }))} />
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
};

export default Analytics;