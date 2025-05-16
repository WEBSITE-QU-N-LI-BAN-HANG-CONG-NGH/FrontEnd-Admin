// src/hooks/useOrders.jsx
import { useState, useEffect, useCallback } from "react";
import {orderService} from "../services/index.js";

export const useOrders = () => {
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [dateRange, setDateRange] = useState({ start: "", end: "" });

    const fetchOrders = useCallback(async () => {
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
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // Xử lý thay đổi trạng thái đơn hàng
    const handleStatusChange = useCallback(async (orderId, action) => {
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
                return true;
            }
            return false;
        } catch (err) {
            console.error(`Lỗi khi thay đổi trạng thái đơn hàng ${orderId}:`, err);
            setError(`Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại sau.`);
            return false;
        }
    }, [orders]);

    // Xử lý xóa đơn hàng
    const handleDeleteOrder = useCallback(async (orderId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
            return false;
        }

        try {
            const response = await orderService.deleteOrder(orderId);
            if (response.status === 200) {
                // Xóa đơn hàng khỏi danh sách
                const updatedOrders = orders.filter(order => order.id !== orderId);
                setOrders(updatedOrders);
                return true;
            }
            return false;
        } catch (err) {
            console.error(`Lỗi khi xóa đơn hàng ${orderId}:`, err);
            setError(`Không thể xóa đơn hàng. Vui lòng thử lại sau.`);
            return false;
        }
    }, [orders]);

    // Hàm xử lý tìm kiếm
    const handleSearch = useCallback((term, startDate, endDate) => {
        setSearchTerm(term);
        if (startDate && endDate) {
            setDateRange({ start: startDate, end: endDate });
        }
    }, []);

    // Hàm lọc đơn hàng
    const getFilteredOrders = useCallback(() => {
        return orders.filter(order => {
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
    }, [orders, filter, searchTerm, dateRange]);

    return {
        orders,
        filteredOrders: getFilteredOrders(),
        stats,
        isLoading,
        error,
        filter,
        setFilter,
        handleSearch,
        handleStatusChange,
        handleDeleteOrder,
        refreshOrders: fetchOrders
    };
};