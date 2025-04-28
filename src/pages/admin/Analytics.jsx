// src/pages/admin/Analytics.jsx - Cấu trúc lại trang với top selling products
import React, {useEffect, useState} from "react";
import {Navigate} from "react-router-dom";
import Layout from "../../components/layout/Layout";
import {useAuth} from "../../contexts/AuthContext";
import SalesAnalytics from "../../components/features/analytics/SalesAnalytics";
import SalesByCategory from "../../components/features/analytics/SalesByCategory";
import "../../styles/admin/analytic/analytics.css";
import {dashboardService, productService} from "../../services/api";

const Analytics = () => {
    const {user, loading, isAdmin} = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [salesData, setSalesData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [summary, setSummary] = useState({
        totalProducts: 0,
        totalSales: 0
    });
    const [topProducts, setTopProducts] = useState([]);

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Lấy dữ liệu doanh thu theo tháng từ API
                try {
                    const salesResponse = await dashboardService.getMonthlyRevenue();
                    if (salesResponse.status === 200) {
                        setSalesData(salesResponse.data.data.monthlyData || []);
                    }
                } catch (err) {
                    console.warn("Không thể tải dữ liệu doanh thu theo tháng:", err);
                }

                // Lấy dữ liệu doanh thu theo danh mục
                try {
                    const categoryResponse = await dashboardService.getRevenueDistribution();
                    if (categoryResponse.status === 200) {
                        setCategoryData(categoryResponse.data.data || {});
                    }
                } catch (err) {
                    console.warn("Không thể tải dữ liệu phân bổ doanh thu:", err);
                }

                // Lấy dữ liệu sản phẩm và tính toán tổng số, tổng doanh thu
                try {
                    const productsResponse = await productService.getAllProducts();
                    if (productsResponse.status === 200) {
                        const products = productsResponse.data.data || [];

                        // Tính tổng số sản phẩm
                        const totalProducts = products.length;

                        // Tính tổng doanh thu
                        let totalSales = 0;

                        // Tạo mảng dữ liệu cho top products với total sales = price * quantitySold
                        const topSellingProducts = products.map(product => {
                            const price = product.discountedPrice || product.price || 0;
                            const quantitySold = product.quantitySold || 0;
                            const totalSalesProduct = price * quantitySold;

                            // Cộng vào tổng doanh thu
                            totalSales += totalSalesProduct;

                            return {
                                id: product.id,
                                name: product.title,
                                price: price,
                                quantitySold: quantitySold,
                                totalSales: totalSalesProduct,
                                category: product.category?.name || "Chưa phân loại"
                            };
                        });

                        // Sắp xếp theo doanh thu giảm dần
                        topSellingProducts.sort((a, b) => b.totalSales - a.totalSales);

                        // Cập nhật state
                        setSummary({
                            totalProducts,
                            totalSales
                        });

                        setTopProducts(topSellingProducts);
                    }
                } catch (err) {
                    console.warn("Không thể tải dữ liệu sản phẩm:", err);
                }

            } catch (err) {
                console.error("Lỗi khi tải dữ liệu phân tích:", err);
                setError("Không thể tải dữ liệu phân tích. Vui lòng thử lại sau.");
            } finally {
                setIsLoading(false);
            }
        };

        if (!loading && user) {
            fetchAnalyticsData();
        }
    }, [loading, user]);

    // Hàm định dạng số tiền thành VND
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
    };

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
                        {/* 2 ô tổng quan: Total Products và Total Sales */}
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

                        {/* Top Selling Products */}
                        <div className="analytics-card">
                            <h2 className="analytics-card-title">Top sản phẩm bán chạy nhất</h2>

                            <table className="top-selling-table">
                                <thead>
                                <tr>
                                    <th className="rank-column">Thứ hạng</th>
                                    <th>Sản phẩm</th>
                                    <th>Danh mục</th>
                                    <th>Giá bán</th>
                                    <th>Số lượng bán</th>
                                    <th>Doanh thu</th>
                                </tr>
                                </thead>
                                <tbody>
                                {topProducts.slice(0, 10).map((product, index) => (
                                    <tr key={product.id} className={`${index < 3 ? 'top-' + (index + 1) : ''}`}>
                                        <td className="rank-column">
                                            <span className="rank-number">{index + 1}</span>
                                        </td>
                                        <td>{product.name}</td>
                                        <td>{product.category}</td>
                                        <td>{formatCurrency(product.price)}</td>
                                        <td>{product.quantitySold}</td>
                                        <td>{formatCurrency(product.totalSales)}</td>
                                    </tr>
                                ))}

                                {topProducts.length === 0 && (
                                    <tr>
                                        <td colSpan="6" style={{textAlign: "center", padding: "20px"}}>
                                            Không có dữ liệu sản phẩm
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        {/* Biểu đồ doanh thu theo tháng */}
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