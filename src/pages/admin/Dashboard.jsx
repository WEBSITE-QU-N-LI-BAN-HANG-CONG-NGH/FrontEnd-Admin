import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import DashboardStats from "../../components/features/dashboard/DashboardStats";
import RecentOrders from "../../components/features/dashboard/RecentOrders";
import RevenueBreakdown from "../../components/features/dashboard/RevenueBreakdown";
import RevenueOverview from "../../components/features/dashboard/RevenueOverview";
import TopSellingProducts from "../../components/features/dashboard/TopSellingProducts";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../contexts/AuthContext";
import { dashboardService, orderService } from "../../services/api";
import "../../styles/admin/dashboard/dashboard.css";

const Dashboard = () => {
    const { user, loading, isAdmin } = useAuth();
    const [dashboardData, setDashboardData] = useState({
        revenueStats: {},
        revenueDistribution: {},
        topProducts: [],
        recentOrders: [],
        productStats: {}
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Gọi API dashboard overview
                const overviewResponse = await dashboardService.getOverview();
                if (overviewResponse.status === 200) {
                    const data = overviewResponse.data.data || {};

                    // Cập nhật state với dữ liệu đầy đủ từ API
                    setDashboardData({
                        revenueStats: data.revenue || {},
                        revenueDistribution: data.distribution || {},
                        topProducts: data.topProducts || [],
                        recentOrders: [],
                        productStats: data.productStats || {
                            totalProducts: 0,
                            inStock: 0,
                            soldItems: 0
                        }
                    });
                }

                // Vẫn giữ lại code lấy đơn hàng gần đây
                try {
                    const ordersResponse = await orderService.getAllOrders();
                    if (ordersResponse.status === 200) {
                        // Xử lý dữ liệu đơn hàng gần đây
                        const orderData = ordersResponse.data.data || [];

                        // Chuyển đổi dữ liệu đơn hàng sang định dạng cần thiết
                        const processedOrders = orderData
                            .slice(0, 5)
                            .map(order => {
                                // Chuyển đổi dữ liệu đơn hàng thành định dạng cần thiết cho component
                                if (order.orderItems && order.orderItems.length > 0) {
                                    const firstItem = order.orderItems[0];
                                    return {
                                        id: order.id,
                                        trackingNo: `TN-${order.id}`,
                                        productName: firstItem.product?.title || "Sản phẩm không xác định",
                                        productImg: firstItem.product?.images?.[0]?.downloadUrl || "https://res.cloudinary.com/dgygvrrjs/image/upload/v1745387610/ChatGPT_Image_Apr_5_2025_12_08_58_AM_ociguu.png",
                                        price: firstItem.price,
                                        quantity: firstItem.quantity,
                                        totalAmount: order.totalAmount,
                                        date: order.orderDate
                                    };
                                }
                                return null;
                            })
                            .filter(Boolean); // Lọc bỏ các giá trị null

                        setDashboardData(prev => ({
                            ...prev,
                            recentOrders: processedOrders
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
                    <div className="loading-message" style={{ textAlign: 'center', padding: '50px' }}>
                        Đang tải dữ liệu dashboard...
                    </div>
                ) : error ? (
                    <div className="error-message" style={{ textAlign: 'center', padding: '30px', color: 'var(--red-color)' }}>
                        {error}
                    </div>
                ) : (
                    <>
                        <DashboardStats stats={dashboardData.productStats} />

                        <div className="dashboard-grid">
                            <RevenueOverview data={dashboardData.revenueStats} />
                            <RevenueBreakdown data={dashboardData.revenueDistribution} />
                        </div>

                        <div className="dashboard-grid">
                            <RecentOrders orders={dashboardData.recentOrders} />
                            <TopSellingProducts products={dashboardData.topProducts} />
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
};

export default Dashboard;