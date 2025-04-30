import React from 'react';
import { Link } from 'react-router-dom';

// Hàm định dạng số tiền thành VND
const formatCurrency = (amount) => {
    if (typeof amount === 'object' && amount !== null) {
        try {
            amount = parseFloat(amount.toString());
        } catch (error) {
            amount = 0;
        }
    }
    return new Intl.NumberFormat('vi-VN').format(amount || 0) + 'đ';
};

// Hàm định dạng ngày giờ
const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';

    try {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    } catch (e) {
        console.error("Lỗi định dạng ngày:", e);
        return 'N/A';
    }
};

const RecentOrders = ({ orders = [] }) => {
    // Đảm bảo orders là mảng
    const safeOrders = Array.isArray(orders) ? orders : [];

    return (
        <div className="recent-orders-card">
            <h3 className="card-title">Đơn hàng gần đây</h3>

            {safeOrders.length > 0 ? (
                <table className="recent-orders-table">
                    <thead>
                    <tr>
                        <th>Tracking No</th>
                        <th>Sản phẩm</th>
                        <th>Đơn giá</th>
                        <th>Số lượng</th>
                        <th>Tổng tiền</th>
                    </tr>
                    </thead>
                    <tbody>
                    {safeOrders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.trackingNo || `TN-${order.id}`}</td>
                            <td>
                                <div className="product-info">
                                    <div className="product-img">
                                        {order.productImg ? (
                                            <img src={order.productImg} alt={order.productName} />
                                        ) : (
                                            <div className="no-image">No image</div>
                                        )}
                                    </div>
                                    <div className="product-name">{order.productName}</div>
                                </div>
                            </td>
                            <td>{formatCurrency(order.price)}</td>
                            <td>{order.quantity}</td>
                            <td>{formatCurrency(order.totalAmount)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <div className="no-data" style={{ textAlign: 'center', padding: '20px', color: 'var(--secondary-color)' }}>
                    Không có đơn hàng nào gần đây
                </div>
            )}

            <Link to="/admin/orders" className="view-all">
                Xem tất cả đơn hàng
            </Link>
        </div>
    );
};

export default RecentOrders;