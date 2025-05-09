import React, {useState} from "react";
import "../../../styles/admin/order/orders.css";
import OrderDetailModal from "./OrderDetailModal";

const OrderList = ({orders, isLoading, onStatusChange, onDeleteOrder}) => {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showStatusDropdown, setShowStatusDropdown] = useState({});
    const [showPaymentDropdown, setShowPaymentDropdown] = useState({});
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

    const getStatusBadge = (status) => {
        if (!status) return <span className="status-badge">Không xác định</span>;

        const statusMap = {
            "PENDING": {className: "status-pending", label: "Chờ xác nhận"},
            "CONFIRMED": {className: "status-confirmed", label: "Đã xác nhận"},
            "SHIPPED": {className: "status-shipped", label: "Đang giao"},
            "DELIVERED": {className: "status-delivered", label: "Đã giao"},
            "CANCELLED": {className: "status-cancelled", label: "Đã hủy"}
        };

        const statusInfo = statusMap[status] || {className: "", label: status};

        return <span className={`status-badge ${statusInfo.className}`}>{statusInfo.label}</span>;
    };

    const getActionButtons = (order) => {
        const status = order.orderStatus;

        return (
            <div className="order-actions">
                {status === "PENDING" && (
                    <>
                        <button
                            className="action-btn confirm-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                onStatusChange(order.id, "confirm");
                            }}
                        >
                            Xác nhận
                        </button>
                        <button
                            className="action-btn cancel-btn"
                            onClick={() => onStatusChange(order.id, "cancel")}
                        >
                            Hủy
                        </button>
                        <button
                            className="action-btn status-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowStatusDropdown({
                                    ...showStatusDropdown,
                                    [order.id]: !showStatusDropdown[order.id]
                                });
                            }}
                        >
                            Đổi trạng thái
                        </button>
                    </>
                )}

                {showStatusDropdown[order.id] && (
                    <div className="status-dropdown">
                        <button onClick={(e) => {
                            e.stopPropagation();
                            onStatusChange(order.id, "confirm");
                            setShowStatusDropdown({...showStatusDropdown, [order.id]: false});
                        }}>Xác nhận</button>
                        <button onClick={(e) => {
                            e.stopPropagation();
                            onStatusChange(order.id, "ship");
                            setShowStatusDropdown({...showStatusDropdown, [order.id]: false});
                        }}>Giao hàng</button>
                        {/* Thêm các trạng thái khác tương tự */}
                    </div>
                )}

                {status === "CONFIRMED" && (
                    <button
                        className="action-btn ship-btn"
                        onClick={() => onStatusChange(order.id, "ship")}
                    >
                        Giao hàng
                    </button>
                )}

                {status === "SHIPPED" && (
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
                            <td>#{order.id}</td>
                            <td>
                                <div className="customer-info">
                                    <span
                                        className="customer-name">{order.user?.firstName} {order.user?.lastName}</span>
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
                                        <div
                                            className={`payment-status ${order.paymentStatus.toLowerCase() === 'paid' ? 'paid' : 'unpaid'}`}>
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
    </div>
    );
};

export default OrderList;