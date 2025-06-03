import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../hooks/useAuth.jsx";
import { orderService } from "../../services/index.js";
import OrderList from "../../components/features/orders/OrderList";
import OrderStats from "../../components/features/orders/OrderStats";
import OrderFilters from "../../components/features/orders/OrderFilters";
import "../../styles/admin/order/orders.css";
import OrderDetailModal from "../../components/features/orders/OrderDetailModal.jsx";

const OrdersManagement = () => {
    const { user, loading, isAdmin } = useAuth();
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [dateRange, setDateRange] = useState({ start: "", end: "" });
    const [pageInput, setPageInput] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false
    });

    // Fetch orders function
    const fetchOrders = async (page = 0, size = 10) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await orderService.getAllOrders(
                page,
                size,
                searchTerm,
                filter === 'all' ? '' : filter,
                dateRange.start,
                dateRange.end
            );

            if (response.status === 200) {
                const responseData = response.data.data || {};
                const ordersData = responseData.orders || [];
                const paginationData = responseData.pagination || {};

                setOrders(ordersData);
                setPagination(paginationData);

                // Reset page input when page changes
                setPageInput("");

                // Calculate stats - you may want to fetch these separately for accuracy
                setStats({
                    totalOrders: paginationData.totalElements || 0,
                    pendingOrders: 0, // These should come from separate API call
                    completedOrders: 0,
                    cancelledOrders: 0,
                    totalRevenue: 0,
                    averageOrderValue: 0
                });
            }
        } catch (err) {
            console.error("Error loading orders:", err);
            setError("Cannot load orders. Please try again.");
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

    // Fetch stats separately for more accurate data
    const fetchStats = async () => {
        try {
            const response = await orderService.getOrderStats(dateRange.start, dateRange.end);
            if (response.status === 200) {
                setStats(response.data.data);
            }
        } catch (err) {
            console.error("Error loading stats:", err);
        }
    };

    // Initial load
    useEffect(() => {
        if (!loading && user) {
            fetchOrders(0, pagination.pageSize);
            fetchStats();
        }
    }, [loading, user]);

    // Filter changes - reset to first page
    useEffect(() => {
        if (!loading && user) {
            fetchOrders(0, pagination.pageSize);
        }
    }, [filter, searchTerm, dateRange]);

    // Stats refresh when date range changes
    useEffect(() => {
        if (!loading && user) {
            fetchStats();
        }
    }, [dateRange]);

    // Pagination handlers
    const goToPage = (page) => {
        if (page >= 0 && page < pagination.totalPages) {
            fetchOrders(page, pagination.pageSize);
        }
    };

    const nextPage = () => {
        if (pagination.hasNext) {
            goToPage(pagination.currentPage + 1);
        }
    };

    const previousPage = () => {
        if (pagination.hasPrevious) {
            goToPage(pagination.currentPage - 1);
        }
    };

    const handlePageInputChange = (e) => {
        setPageInput(e.target.value);
    };

    const handlePageInputKeyPress = (e) => {
        if (e.key === 'Enter') {
            const pageNumber = parseInt(pageInput);
            if (pageNumber >= 1 && pageNumber <= pagination.totalPages) {
                goToPage(pageNumber - 1); // Convert to 0-based index
            }
            setPageInput("");
        }
    };

    // Handle status change
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
                // Refresh current page to get updated data
                fetchOrders(pagination.currentPage, pagination.pageSize);
            }
        } catch (err) {
            console.error(`Lỗi khi thay đổi trạng thái đơn hàng ${orderId}:`, err);
            setError(`Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại sau.`);
        }
    };

    // Handle delete order
    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
            return;
        }

        try {
            const response = await orderService.deleteOrder(orderId);
            if (response.status === 200) {
                // Refresh current page to get updated data
                fetchOrders(pagination.currentPage, pagination.pageSize);
            }
        } catch (err) {
            console.error(`Lỗi khi xóa đơn hàng ${orderId}:`, err);
            setError(`Không thể xóa đơn hàng. Vui lòng thử lại sau.`);
        }
    };

    const handleViewOrder = async (orderId) => {
        try {
            // Fetch order details if needed, or use existing order from list
            const orderToView = orders.find(order => order.id === orderId);
            setSelectedOrder(orderToView);
            setIsModalOpen(true);
        } catch (err) {
            console.error("Error viewing order details:", err);
            setError("Cannot load order details. Please try again.");
        }
    };

    const closeOrderDetail = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    // Handle search
    const handleSearch = (term, startDate, endDate) => {
        setSearchTerm(term);
        if (startDate || endDate) {
            setDateRange({ start: startDate || "", end: endDate || "" });
        }
        // The useEffect will handle calling fetchOrders
    };

    // Loading state
    if (loading) {
        return <div>Đang tải...</div>;
    }

    // Authentication check
    if (!user || !isAdmin()) {
        return <Navigate to="/login" replace />;
    }

    return (
        <Layout>
            <div className="orders-container">
                {/* Order Statistics */}
                <OrderStats stats={stats} />

                {/* Order Filters */}
                <OrderFilters
                    currentFilter={filter}
                    onFilterChange={setFilter}
                    onSearch={handleSearch}
                />

                {/* Error Message */}
                {error && <div className="error-message">{error}</div>}

                {/* Order List */}
                <OrderList
                    orders={orders}
                    isLoading={isLoading}
                    onStatusChange={handleStatusChange}
                    onDeleteOrder={handleDeleteOrder}
                    onViewOrder={handleViewOrder}
                />

                {/* Pagination */}
                {!isLoading && orders.length > 0 && (
                    <div className="pagination-container">
                        <div className="pagination">
                            <button
                                className={`button-product outline small ${pagination.currentPage === 0 ? 'active' : ''}`}
                                onClick={() => goToPage(0)}
                                disabled={pagination.currentPage === 0}
                            >
                                Trang đầu
                            </button>

                            <button
                                className="button-product outline small"
                                disabled={!pagination.hasPrevious}
                                onClick={previousPage}
                            >
                                Trang Trước
                            </button>

                            <div className="page-input-container">
                                <input
                                    type="number"
                                    value={pageInput}
                                    onChange={handlePageInputChange}
                                    onKeyPress={handlePageInputKeyPress}
                                    placeholder={`${pagination.currentPage + 1}`}
                                    min="1"
                                    max={pagination.totalPages}
                                    className="button-product outline small"
                                />
                            </div>

                            <button
                                className="button-product outline small"
                                disabled={!pagination.hasNext}
                                onClick={nextPage}
                            >
                                Trang kế
                            </button>

                            <button
                                className={`button-product outline small ${pagination.currentPage === pagination.totalPages - 1 || pagination.totalPages === 0 ? 'active' : ''}`}
                                onClick={() => goToPage(pagination.totalPages - 1)}
                                disabled={pagination.currentPage === pagination.totalPages - 1 || pagination.totalPages === 0}
                            >
                                Trang cuối
                            </button>
                        </div>

                        <div className="pagination-info">
                            Hiển thị {orders.length} trên {pagination.totalElements || 0} đơn hàng
                        </div>
                    </div>
                )}
            </div>
            {isModalOpen && selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    onClose={closeOrderDetail}
                    onStatusChange={handleStatusChange}  // Pass this if modal can edit status
                />
            )}
        </Layout>
    );
};

export default OrdersManagement;