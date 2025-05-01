import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../hooks/useAuth.jsx";
import { dashboardService } from "../../services/index.js";
import RevenueByTime from "../../components/features/dashboard/RevenueByTime.jsx";
import SalesAnalytics from "../../components/features/analytics/SalesAnalytics";
import SalesByCategory from "../../components/features/analytics/SalesByCategory";

const Revenue = () => {
    const { user, loading, isAdmin } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState("month"); // month, quarter, year
    const [revenueData, setRevenueData] = useState({});
    const [salesData, setSalesData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);

    useEffect(() => {
        const fetchRevenueData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Tạo các ngày mặc định
                const today = new Date();
                let startDate, endDate;

                switch(timeRange) {
                    case 'quarter':
                        startDate = new Date(today);
                        startDate.setMonth(Math.floor(today.getMonth() / 3) * 3);
                        startDate.setDate(1);
                        break;
                    case 'year':
                        startDate = new Date(today.getFullYear(), 0, 1);
                        break;
                    case 'month':
                    default:
                        startDate = new Date(today);
                        startDate.setDate(1);
                        break;
                }

                endDate = new Date(today);

                const formatDate = (date) => {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                };

                // Các API call với xử lý lỗi riêng biệt
                try {
                    const revenueResponse = await dashboardService.getRevenue();
                    if (revenueResponse.status === 200) {
                        setRevenueData(revenueResponse.data.data || {});
                    }
                } catch (err) {
                    console.warn("Không thể tải dữ liệu doanh thu tổng quan:", err);
                }

                try {
                    const salesResponse = await dashboardService.getMonthlyRevenue();
                    if (salesResponse.status === 200) {
                        setSalesData(salesResponse.data.data.monthlyData || []);
                    }
                } catch (err) {
                    console.warn("Không thể tải dữ liệu doanh thu theo tháng:", err);
                }

                try {
                    const categoryResponse = await dashboardService.getRevenueDistribution();
                    if (categoryResponse.status === 200) {
                        setCategoryData(categoryResponse.data.data || {});
                    }
                } catch (err) {
                    console.warn("Không thể tải dữ liệu phân bổ doanh thu:", err);
                }

            } catch (err) {
                console.error("Lỗi khi tải dữ liệu doanh thu:", err);
                setError("Không thể tải dữ liệu doanh thu. Vui lòng thử lại sau.");
            } finally {
                setIsLoading(false);
            }
        };

        if (!loading && user) {
            fetchRevenueData();
        }
    }, [loading, user, timeRange]);

    // Xử lý thay đổi khoảng thời gian
    const handleTimeRangeChange = (range) => {
        setTimeRange(range);
    };

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
            <div className="revenue-page">
                <div className="revenue-header">
                    <h1>Phân tích doanh thu</h1>
                    <p>Chi tiết doanh thu theo thời gian và phân loại</p>
                </div>

                <div className="time-filter">
                    <button
                        className={`filter-btn ${timeRange === "month" ? "active" : ""}`}
                        onClick={() => handleTimeRangeChange("month")}
                    >
                        Tháng này
                    </button>
                    <button
                        className={`filter-btn ${timeRange === "quarter" ? "active" : ""}`}
                        onClick={() => handleTimeRangeChange("quarter")}
                    >
                        Quý này
                    </button>
                    <button
                        className={`filter-btn ${timeRange === "year" ? "active" : ""}`}
                        onClick={() => handleTimeRangeChange("year")}
                    >
                        Năm nay
                    </button>
                    <div className="date-range">
                        <input type="date" placeholder="Từ ngày" />
                        <input type="date" placeholder="Đến ngày" />
                        <button className="apply-btn">Áp dụng</button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="loading-message">Đang tải dữ liệu doanh thu...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    <>
                        <div className="revenue-overview-section">
                            <RevenueByTime data={revenueData} />
                        </div>

                        <div className="revenue-detail-section">
                            <SalesAnalytics data={salesData} />
                            <SalesByCategory data={Array.isArray(categoryData)
                                ? categoryData
                                : Object.entries(categoryData).map(([name, value]) => ({
                                    name,
                                    revenue: value
                                }))
                            } />
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
};

export default Revenue;