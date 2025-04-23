import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../contexts/AuthContext";
import { orderService } from "../../services/api";
import OrderList from "../../components/features/orders/OrderList";
import OrderStats from "../../components/features/orders/OrderStats";
import OrderFilters from "../../components/features/orders/OrderFilters";
import "../../styles/admin/orders.css";

const OrdersManagement = () => {
    const { user, loading, isAdmin } = useAuth();
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("all"); // all, pending, shipped, delivered, cancelled

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Lấy tất cả đơn hàng
                const response = await orderService.getAllOrders();
                if (response.status === 200) {
                    setOrders(response.data.data || []);
                } else {
                    throw new Error("Không thể tải dữ liệu đơn hàng");
                }

                // Lấy thống kê đơn hàng
                const today = new Date();
                const oneMonthAgo = new Date();
                oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

                const startDate = oneMonthAgo.toISOString().split('T')[0];
                const endDate = today.toISOString().split('T')[0];

                const statsResponse = await orderService.getOrderStats(startDate, endDate);
                if (statsResponse.status === 200) {
                    setStats(statsResponse.data.data || {});
                }
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu đơn hàng:", err);
                setError("Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.");
            } finally {
                setIsLoading(false);
            }
        };

        if (!loading && user) {
            fetchOrders();
        }
    }, [loading, user]);

    // Xử lý thay đổi trạng thái đơn hàng
    const handleStatusChange = async (orderId, action) => {
        try {
            let response;

            switch (action) {
                case "confirm":
                    response = await orderService.confirmOrder(orderId);
                    break;
                case "ship":
                    response = await orderService.shipOrder(orderId);
                    break;
                case "deliver":
                    response = await orderService.deliverOrder(orderId);
                    break;
                case "cancel":
                    response = await orderService.cancelOrder(orderId);
                    break;
                default:
                    throw new Error("Hành động không hợp lệ");
            }

            if (response.status === 200) {
                // Cập nhật lại danh sách đơn hàng để thấy trạng thái mới
                const updatedOrders = orders.map(order =>
                    order.id === orderId ? response.data.data : order
                );
                setOrders(updatedOrders);
            }
        } catch (err) {
            console.error(`Lỗi khi thay đổi trạng thái đơn hàng ${orderId}:`, err);
            setError(`Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại sau.`);
        }
    };

    // Xử lý xóa đơn hàng
    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
            return;
        }

        try {
            const response = await orderService.deleteOrder(orderId);
            if (response.status === 200) {
                // Xóa đơn hàng khỏi danh sách
                const updatedOrders = orders.filter(order => order.id !== orderId);
                setOrders(updatedOrders);
            }
        } catch (err) {
            console.error(`Lỗi khi xóa đơn hàng ${orderId}:`, err);
            setError(`Không thể xóa đơn hàng. Vui lòng thử lại sau.`);
        }
    };

    // Lọc đơn hàng theo trạng thái
    const filteredOrders = filter === "all"
        ? orders
        : orders.filter(order => order.orderStatus.toLowerCase() === filter);

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
            <div className="orders-container">
                <div className="orders-header">
                    <h1>Quản lý đơn hàng</h1>
                    <p>Theo dõi và xử lý các đơn hàng trong hệ thống</p>
                </div>

                {/* Hiển thị thống kê đơn hàng */}
                <OrderStats stats={stats} />

                {/* Bộ lọc đơn hàng */}
                <OrderFilters
                    currentFilter={filter}
                    onFilterChange={setFilter}
                />

                {error && <div className="error-message">{error}</div>}

                {/* Danh sách đơn hàng */}
                <OrderList
                    orders={filteredOrders}
                    isLoading={isLoading}
                    onStatusChange={handleStatusChange}
                    onDeleteOrder={handleDeleteOrder}
                />
            </div>
        </Layout>
    );
};

export default OrdersManagement;