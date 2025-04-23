import React, { useState } from "react";
import "../../../styles/admin/orders.css";
import OrderDetailModal from "./OrderDetailModal";

const OrderList = ({ orders, isLoading, onStatusChange, onDeleteOrder }) => {
    const [selectedOrder, setSelectedOrder] = useState(null);
    // Hàm định dạng số tiền
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
    };

    // Hàm định dạng ngày giờ
    const formatDateTime = (dateTimeStr) => {
        if (!dateTimeStr) return "N/A";
        const date = new Date(dateTimeStr);
        return new Intl.DateTimeFormat("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        }).format(date);
    };

    // Tạo badge cho trạng thái đơn hàng
    const getStatusBadge = (status) => {
        if (!status) return <span className="status-badge">Không xác định</span>;

        const statusLower = status.toLowerCase();
        let className = "status-badge";

        if (statusLower === "pending") {
            className += " status-pending";
            return <span className={className}>Chờ xác nhận</span>;
        } else if (statusLower === "confirmed") {
            className += " status-confirmed";
            return <span className={className}>Đã xác nhận</span>;
        } else if (statusLower === "shipped") {
            className += " status-shipped";
            return <span className={className}>Đang giao</span>;
        } else if (statusLower === "delivered") {
            className += " status-delivered";
            return <span className={className}>Đã giao</span>;
        } else if (statusLower === "cancelled") {
            className += " status-cancelled";
            return <span className={className}>Đã hủy</span>;
        }

        return <span className={className}>{status}</span>;
    };

    // Tạo nút hành động dựa trên trạng thái đơn hàng
    const getActionButtons = (order) => {
        const status = order.orderStatus?.toLowerCase();

        return (
            <div className="order-actions">
                {status === "pending" && (
                    <>
                        <button
                            className="action-btn confirm-btn"
                            onClick={() => onStatusChange(order.id, "confirm")}
                        >
                            Xác nhận
                        </button>
                        <button
                            className="action-btn cancel-btn"
                            onClick={() => onStatusChange(order.id, "cancel")}
                        >
                            Hủy
                        </button>
                    </>
                )}

                {status === "confirmed" && (
                    <button
                        className="action-btn ship-btn"
                        onClick={() => onStatusChange(order.id, "ship")}
                    >
                        Giao hàng
                    </button>
                )}

                {status === "shipped" && (
                    <button
                        className="action-btn deliver-btn"
                        onClick={() => onStatusChange(order.id, "deliver")}
                    >
                        Đã giao
                    </button>
                )}

                <button
                    className="action-btn delete-btn"
                    onClick={() => onDeleteOrder(order.id)}
                >
                    Xóa
                </button>
            </div>
        );
    };

    // Hàm mở modal chi tiết
    const openOrderDetail = (order) => {
        setSelectedOrder(order);
    };

    // Hàm đóng modal chi tiết
    const closeOrderDetail = () => {
        setSelectedOrder(null);
    };

    return (
        <div className="orders-table-container">
            <h2>Danh sách đơn hàng</h2>

            {/* Modal chi tiết đơn hàng */}
            {selectedOrder && (
                <OrderDetailModal order={selectedOrder} onClose={closeOrderDetail} />
            )}

            {isLoading ? (
                <div className="loading-message">Đang tải dữ liệu...</div>
            ) : orders.length === 0 ? (
                <div className="empty-message">Không tìm thấy đơn hàng nào</div>
            ) : (
                <table className="orders-table">
                    <thead>
                    <tr>
                        <th>Mã đơn</th>
                        <th>Khách hàng</th>
                        <th>Ngày đặt</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái đơn</th>
                        <th>Thanh toán</th>
                        <th>Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => (
                        <tr key={order.id} onClick={() => openOrderDetail(order)} style={{ cursor: 'pointer' }}>
                            <td>#{order.id}</td>
                            <td>
                                <div className="customer-info">
                                    <span className="customer-name">{order.user?.firstName} {order.user?.lastName}</span>
                                    <span className="customer-email">{order.user?.email}</span>
                                </div>
                            </td>
                            <td>{formatDateTime(order.orderDate)}</td>
                            <td className="order-amount">{formatCurrency(order.totalAmount)}</td>
                            <td>{getStatusBadge(order.orderStatus)}</td>
                            <td>
                                <div className="payment-info">
                                    <div>{order.paymentMethod || "COD"}</div>
                                    {order.paymentStatus && (
                                        <div className={`payment-status ${order.paymentStatus.toLowerCase() === 'paid' ? 'paid' : 'unpaid'}`}>
                                            {order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td onClick={(e) => e.stopPropagation()}>{getActionButtons(order)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default OrderList;