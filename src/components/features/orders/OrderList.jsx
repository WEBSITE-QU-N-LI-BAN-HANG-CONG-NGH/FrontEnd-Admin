import React, { useState } from "react";
import "../../../styles/admin/order/orders.css";
import OrderDetailModal from "./OrderDetailModal";
import { formatCurrency, formatDateTime } from "../../../utils/format.js";

const OrderList = ({orders, isLoading, onStatusChange, onDeleteOrder}) => {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showStatusDropdown, setShowStatusDropdown] = useState({});

    const getStatusBadge = (status, orderId) => {
        if (!status) return <span className="status-badge">Không xác định</span>;

        const orderStatusMap = {
            "PENDING": {className: "status-pending", label: "Chờ xác nhận"},
            "CONFIRMED": {className: "status-confirmed", label: "Đã xác nhận"},
            "SHIPPED": {className: "status-shipped", label: "Đang giao"},
            "DELIVERED": {className: "status-delivered", label: "Đã giao"},
            "CANCELLED": {className: "status-cancelled", label: "Đã hủy"}
        };

        const statusInfo = orderStatusMap[status] || {className: "", label: status};

        return (
            <div style={{ position: "relative" }}>
                <span
                    className={`status-badge ${statusInfo.className}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowStatusDropdown({
                            ...showStatusDropdown,
                            [orderId]: !showStatusDropdown[orderId]
                        });
                    }}
                >
                    {statusInfo.label}
                </span>

                {showStatusDropdown[orderId] && (
                    <div className="status-dropdown">
                        <button onClick={(e) => {
                            e.stopPropagation();
                            onStatusChange(orderId, "confirm");
                            setShowStatusDropdown({...showStatusDropdown, [orderId]: false});
                        }}>Xác nhận</button>
                        <button onClick={(e) => {
                            e.stopPropagation();
                            onStatusChange(orderId, "ship");
                            setShowStatusDropdown({...showStatusDropdown, [orderId]: false});
                        }}>Giao hàng</button>
                        <button onClick={(e) => {
                            e.stopPropagation();
                            onStatusChange(orderId, "deliver");
                            setShowStatusDropdown({...showStatusDropdown, [orderId]: false});
                        }}>Đã giao</button>
                        <button onClick={(e) => {
                            e.stopPropagation();
                            onStatusChange(orderId, "cancel");
                            setShowStatusDropdown({...showStatusDropdown, [orderId]: false});
                        }}>Hủy đơn</button>
                    </div>
                )}
            </div>
        );
    };

    const getActionButtons = (order) => {
        return (
            <div className="order-actions">
                <button
                    className="action-btn delete-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDeleteOrder(order.id);
                    }}
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

    // Đóng dropdown khi click ra ngoài
    React.useEffect(() => {
        const handleClickOutside = () => {
            setShowStatusDropdown({});
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const getPaymentStatusInfo = (paymentStatus) => {
        if (!paymentStatus) return { text: "Không xác định", isPaid: false, className: "unknown" };

        // Ánh xạ trạng thái thanh toán từ backend
        const statusMap = {
            "PENDING": { text: "Chờ thanh toán", isPaid: false, className: "unpaid" },
            "COMPLETED": { text: "Đã thanh toán", isPaid: true, className: "paid" },
            "FAILED": { text: "Thanh toán thất bại", isPaid: false, className: "failed" },
            "CANCELLED": { text: "Đã hủy thanh toán", isPaid: false, className: "cancelled" },
            "REFUNDED": { text: "Đã hoàn tiền", isPaid: false, className: "refunded" }
        };

        return statusMap[paymentStatus] || { text: paymentStatus, isPaid: false, className: "unknown" };
    };

    return (
    <div>
    <h2>Danh sách đơn hàng</h2>
    <div className="orders-table-container">

            {/* Modal chi tiết đơn hàng */}
            {selectedOrder && (
                <OrderDetailModal order={selectedOrder} onClose={closeOrderDetail}/>
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
                        <tr key={order.id} onClick={() => openOrderDetail(order)} style={{cursor: 'pointer'}}>
                            <td className="order-id">#{order.id}</td>
                            <td>
                                <div className="customer-info">
                                    <span
                                        className="customer-name">{order.user?.firstName} {order.user?.lastName}</span>
                                    <span className="customer-email">{order.user?.email}</span>
                                </div>
                            </td>
                            <td className="order-date">{formatDateTime(order.orderDate)}</td>
                            <td className="order-amount">{formatCurrency(order.totalDiscountedPrice)}</td>
                            <td className="order-status">{getStatusBadge(order.orderStatus, order.id)}</td>
                            <td className="order-payment">
                                <div className="payment-info">
                                    <div>{order.paymentMethod || "COD"}</div>
                                    {order.paymentStatus && (
                                        <div className={`payment-status ${getPaymentStatusInfo(order.paymentStatus).className}`}>
                                            {getPaymentStatusInfo(order.paymentStatus).text}
                                        </div>
                                    )}
                                </div>
                            </td >
                            <td className="order-control" onClick={(e) => e.stopPropagation()}>{getActionButtons(order)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    </div>
    );
};

export default OrderList;