import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../contexts/AuthContext";
import { orderService } from "../../services/api";
import OrderList from "../../components/features/orders/OrderList";
import OrderStats from "../../components/features/orders/OrderStats";
import OrderFilters from "../../components/features/orders/OrderFilters";
import "../../styles/admin/order/orders.css";

const OrdersManagement = () => {
    const { user, loading, isAdmin } = useAuth();
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("all"); // all, pending, shipped, delivered, cancelled
    const [searchTerm, setSearchTerm] = useState("");
    const [dateRange, setDateRange] = useState({ start: "", end: "" });

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Lấy tất cả đơn hàng
                const response = await orderService.getAllOrders();
                if (response.status === 200) {
                    const ordersData = response.data.data || [];
                    setOrders(ordersData);

                    // Tạo thống kê từ dữ liệu orders
                    const pendingOrders = ordersData.filter(order => order.orderStatus === "PENDING").length;
                    const completedOrders = ordersData.filter(order => order.orderStatus === "DELIVERED").length;
                    const cancelledOrders = ordersData.filter(order => order.orderStatus === "CANCELLED").length;
                    const totalRevenue = ordersData
                        .filter(order => order.orderStatus === "DELIVERED")
                        .reduce((sum, order) => sum + order.totalAmount, 0);

                    setStats({
                        totalOrders: ordersData.length,
                        pendingOrders,
                        completedOrders,
                        cancelledOrders,
                        totalRevenue,
                        averageOrderValue: completedOrders ? totalRevenue / completedOrders : 0
                    });
                } else {
                    throw new Error("Không thể tải dữ liệu đơn hàng");
                }
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu đơn hàng:", err);
                setError("Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.");

                setOrders([]);
                setStats({
                    totalOrders: 0,
                    pendingOrders: 0,
                    completedOrders: 0,
                    cancelledOrders: 0,
                    totalRevenue: 0,
                    averageOrderValue: 0
                });
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

    // Hàm xử lý tìm kiếm
    const handleSearch = (term, startDate, endDate) => {
        setSearchTerm(term);
        if (startDate && endDate) {
            setDateRange({ start: startDate, end: endDate });
        }
    };

    // Điều chỉnh lọc đơn hàng
    const filteredOrders = orders.filter(order => {
        // Lọc theo trạng thái
        if (filter !== "all" && order.orderStatus !== filter.toUpperCase()) {
            return false;
        }

        // Lọc theo từ khóa tìm kiếm
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            const customerName = `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.toLowerCase();
            const orderId = order.id.toString();

            if (!orderId.includes(searchLower) &&
                !customerName.includes(searchLower) &&
                !(order.user?.email || '').toLowerCase().includes(searchLower)) {
                return false;
            }
        }

        // Lọc theo khoảng thời gian
        if (dateRange.start && dateRange.end) {
            const orderDate = new Date(order.orderDate);
            const startDate = new Date(dateRange.start);
            const endDate = new Date(dateRange.end);
            endDate.setHours(23, 59, 59); // Đặt thời gian kết thúc là cuối ngày

            if (orderDate < startDate || orderDate > endDate) {
                return false;
            }
        }

        return true;
    });

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
                {/* Hiển thị thống kê đơn hàng */}
                <OrderStats stats={stats} />

                {/* Bộ lọc đơn hàng */}
                <OrderFilters
                    currentFilter={filter}
                    onFilterChange={setFilter}
                    onSearch={handleSearch}
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